import { useState, useRef, useCallback } from 'react';

type RecorderStatus = 'idle' | 'recording' | 'processing' | 'error';

interface UseMediaRecorderReturn {
  status: RecorderStatus;
  error: string | null;
  isRecording: boolean;
  isProcessing: boolean;
  isSupported: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string>;
}

export const useMediaRecorder = (): UseMediaRecorderReturn => {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const isSupported = typeof MediaRecorder !== 'undefined' &&
                      typeof navigator !== 'undefined' &&
                      typeof navigator.mediaDevices !== 'undefined';

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      setError('Audio recording is not supported in this browser');
      setStatus('error');
      return;
    }

    try {
      setError(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });

      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('[MediaRecorder] Error:', event);
        setError('Recording error occurred');
        setStatus('error');
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setStatus('recording');

      console.log('[MediaRecorder] Started recording');
    } catch (err) {
      console.error('[MediaRecorder] Failed to start:', err);
      setError('Microphone access denied or unavailable');
      setStatus('error');

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  }, [isSupported]);

  const stopRecording = useCallback(async (): Promise<string> => {
    if (!mediaRecorderRef.current || status !== 'recording') {
      return '';
    }

    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current!;

      mediaRecorder.onstop = async () => {
        console.log('[MediaRecorder] Stopped recording');
        setStatus('processing');

        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }

        if (audioChunksRef.current.length === 0) {
          console.warn('[MediaRecorder] No audio data captured');
          setError('No audio was captured. Please try again.');
          setStatus('error');
          resolve('');
          return;
        }

        try {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: mediaRecorder.mimeType
          });

          console.log('[MediaRecorder] Audio blob created:', {
            size: audioBlob.size,
            type: audioBlob.type
          });

          const formData = new FormData();
          const fileName = `audio.${mediaRecorder.mimeType.includes('webm') ? 'webm' : 'mp4'}`;
          formData.append('audio', audioBlob, fileName);

          const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/transcribe`;

          console.log('[MediaRecorder] Sending to transcription service...');

          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Transcription failed');
          }

          const data = await response.json();
          const transcript = data.transcript || '';

          console.log('[MediaRecorder] Transcription result:', transcript);

          setStatus('idle');
          setError(null);
          resolve(transcript);
        } catch (err) {
          console.error('[MediaRecorder] Transcription error:', err);
          setError('Failed to process audio. Please try again.');
          setStatus('error');
          resolve('');
        }
      };

      mediaRecorder.stop();
    });
  }, [status]);

  return {
    status,
    error,
    isRecording: status === 'recording',
    isProcessing: status === 'processing',
    isSupported,
    startRecording,
    stopRecording,
  };
};
