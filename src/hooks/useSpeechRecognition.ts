import { useCallback, useEffect, useRef, useState } from 'react';

type RecognitionStatus = 'idle' | 'listening' | 'stopped' | 'error';

interface SpeechRecognitionResultAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: SpeechRecognitionResultAlternativeLike;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

interface UseSpeechRecognitionOptions {
  pageId: string | number;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  interimTranscript: string;
  finalTranscript: string;
  error: string | null;
  status: RecognitionStatus;
  startListening: () => void;
  stopListening: () => Promise<string>;
  resetSession: () => void;
}

const getSpeechRecognitionConstructor = (): SpeechRecognitionConstructor | null => {
  const maybeWindow = window as Window & {
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
    SpeechRecognition?: SpeechRecognitionConstructor;
  };

  return maybeWindow.SpeechRecognition || maybeWindow.webkitSpeechRecognition || null;
};

export const useSpeechRecognition = ({ pageId }: UseSpeechRecognitionOptions): UseSpeechRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<RecognitionStatus>('idle');

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalTranscriptRef = useRef('');
  const stopResolveRef = useRef<((value: string) => void) | null>(null);

  const isSupported = typeof window !== 'undefined' && getSpeechRecognitionConstructor() !== null;

  const resetSession = useCallback(() => {
    setInterimTranscript('');
    setFinalTranscript('');
    finalTranscriptRef.current = '';
    setError(null);
    setStatus('idle');
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported || recognitionRef.current) {
      return;
    }

    const SpeechRecognitionClass = getSpeechRecognitionConstructor();
    if (!SpeechRecognitionClass) {
      setError('Speech recognition is not supported in this browser');
      setStatus('error');
      return;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    setInterimTranscript('');
    setFinalTranscript('');
    finalTranscriptRef.current = '';
    setError(null);

    recognition.onstart = () => {
      setIsListening(true);
      setStatus('listening');
    };

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      let sessionFinalTranscript = '';
      let sessionInterimTranscript = '';

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const segment = result?.[0]?.transcript ?? '';

        if (result?.isFinal) {
          sessionFinalTranscript += `${segment} `;
        } else {
          sessionInterimTranscript += segment;
        }
      }

      if (sessionFinalTranscript) {
        finalTranscriptRef.current = `${finalTranscriptRef.current}${sessionFinalTranscript}`.trim();
        setFinalTranscript(finalTranscriptRef.current);
      }

      setInterimTranscript(sessionInterimTranscript.trim());
    };

    recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
      if (event.error === 'aborted') {
        return;
      }

      if (event.error === 'not-allowed') {
        setError('Microphone access denied');
      } else if (event.error === 'no-speech') {
        setError('No speech detected. Try again.');
      } else {
        setError(`Speech recognition error: ${event.error}`);
      }

      setStatus('error');
    };

    recognition.onend = () => {
      setIsListening(false);
      setStatus((currentStatus) => (currentStatus === 'error' ? 'error' : 'stopped'));
      recognitionRef.current = null;

      if (stopResolveRef.current) {
        stopResolveRef.current(finalTranscriptRef.current.trim());
        stopResolveRef.current = null;
      }

      setInterimTranscript('');
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported]);

  const stopListening = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      if (!recognitionRef.current || !isListening) {
        resolve(finalTranscriptRef.current.trim());
        return;
      }

      stopResolveRef.current = resolve;
      recognitionRef.current.stop();
    });
  }, [isListening]);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    resetSession();
  }, [pageId, resetSession]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      if (stopResolveRef.current) {
        stopResolveRef.current(finalTranscriptRef.current.trim());
        stopResolveRef.current = null;
      }
    };
  }, []);

  return {
    isListening,
    isSupported,
    interimTranscript,
    finalTranscript,
    error,
    status,
    startListening,
    stopListening,
    resetSession,
  };
};
