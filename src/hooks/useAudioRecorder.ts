import { useState, useRef, useCallback } from 'react';

type RecordingStatus = 'idle' | 'recording' | 'processing' | 'error';

interface UseAudioRecorderReturn {
  isRecording: boolean;
  isProcessing: boolean;
  status: RecordingStatus;
  error: string | null;
  isSupported: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string>;
}

export const useAudioRecorder = (): UseAudioRecorderReturn => {
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const isSupported = typeof MediaRecorder !== 'undefined' && navigator.mediaDevices?.getUserMedia;

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      setError('Audio recording is not supported in your browser');
      return;
    }

    try {
      setError(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setStatus('recording');

      console.log('[AudioRecorder] Recording started');
    } catch (err) {
      console.error('[AudioRecorder] Error starting recording:', err);
      setError('Could not access microphone. Please grant permission.');
      setStatus('error');
    }
  }, [isSupported]);

  const stopRecording = useCallback(async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const mediaRecorder = mediaRecorderRef.current;

      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        reject(new Error('No active recording'));
        return;
      }

      mediaRecorder.onstop = async () => {
        console.log('[AudioRecorder] Recording stopped');
        setStatus('processing');

        try {
          // Stop all tracks
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }

          // Create audio blob
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          console.log('[AudioRecorder] Audio blob created, size:', audioBlob.size);

          // Send to transcription API
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');

          const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/transcribe`;
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Transcription failed');
          }

          const data = await response.json();
          const transcript = data.transcript || '';

          console.log('[AudioRecorder] Transcript received:', transcript);
          setStatus('idle');
          resolve(transcript);
        } catch (err) {
          console.error('[AudioRecorder] Error processing recording:', err);
          setError('Could not transcribe audio. Please try again.');
          setStatus('error');
          reject(err);
        }
      };

      mediaRecorder.stop();
    });
  }, []);

  return {
    isRecording: status === 'recording',
    isProcessing: status === 'processing',
    status,
    error,
    isSupported,
    startRecording,
    stopRecording,
  };
};
