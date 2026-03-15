import { useState, useEffect, useCallback, useRef } from 'react';

type RecognitionStatus = 'idle' | 'listening' | 'stopped' | 'error';

interface UseSpeechRecognitionProps {
  expectedWords: string[];
  onProgressUpdate: (completedWordCount: number, transcript: string, wasAdvanced: boolean) => void;
  enabled: boolean;
  pageId: string | number;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetListening: () => void;
  transcript: string;
  normalizedTranscript: string;
  error: string | null;
  recognitionStatus: RecognitionStatus;
  debugInfo: {
    rawTranscript: string;
    normalizedWords: string[];
    expectedWords: string[];
    matchedCount: number;
    wasAdvanced: boolean;
    pageId: string | number;
  };
}

const normalizeWord = (word: string): string => {
  return word.toLowerCase().trim().replace(/[.,!?;:"']/g, '');
};

const normalizeText = (text: string): string[] => {
  return text
    .toLowerCase()
    .split(/\s+/)
    .map(w => normalizeWord(w))
    .filter(w => w.length > 0);
};

export const useSpeechRecognition = ({
  expectedWords,
  onProgressUpdate,
  enabled,
  pageId
}: UseSpeechRecognitionProps): UseSpeechRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [normalizedTranscript, setNormalizedTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recognitionStatus, setRecognitionStatus] = useState<RecognitionStatus>('idle');
  const [debugInfo, setDebugInfo] = useState({
    rawTranscript: '',
    normalizedWords: [] as string[],
    expectedWords: [] as string[],
    matchedCount: 0,
    wasAdvanced: false,
    pageId: pageId
  });

  const recognitionRef = useRef<any>(null);
  const matchedCountRef = useRef<number>(0);
  const isStartingRef = useRef(false);
  const isStoppingRef = useRef(false);
  const expectedWordsRef = useRef<string[]>(expectedWords);
  const onProgressUpdateRef = useRef(onProgressUpdate);
  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  // Keep refs up to date
  useEffect(() => {
    expectedWordsRef.current = expectedWords;
  }, [expectedWords]);

  useEffect(() => {
    onProgressUpdateRef.current = onProgressUpdate;
  }, [onProgressUpdate]);

  useEffect(() => {
    console.log('[useSpeechRecognition] Hook initialized, isSupported:', isSupported);
  }, []);

  const matchWords = useCallback((spoken: string[], expected: string[]): number => {
    let count = 0;
    for (let i = 0; i < Math.min(spoken.length, expected.length); i++) {
      if (spoken[i] === expected[i]) {
        count = i + 1;
      } else {
        break;
      }
    }
    return count;
  }, []);

  const processTranscript = useCallback((fullTranscript: string) => {
    const expected = expectedWordsRef.current;
    const spokenWords = normalizeText(fullTranscript);
    const matchCount = matchWords(spokenWords, expected);
    const wasAdvanced = matchCount > matchedCountRef.current;

    if (wasAdvanced) {
      matchedCountRef.current = matchCount;
    }

    setDebugInfo({
      rawTranscript: fullTranscript,
      normalizedWords: spokenWords,
      expectedWords: expected,
      matchedCount: matchCount,
      wasAdvanced,
      pageId
    });

    onProgressUpdateRef.current(matchCount, fullTranscript, wasAdvanced);

    if (matchCount === expected.length && expected.length > 0) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  }, [matchWords, pageId]);

  const stopListening = useCallback(() => {
    if (isStoppingRef.current || !isListening) {
      return;
    }

    isStoppingRef.current = true;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log('[Speech] Error stopping:', e);
      }
    }
  }, [isListening]);

  const resetListening = useCallback(() => {
    matchedCountRef.current = 0;
    setTranscript('');
    setNormalizedTranscript('');
    setError(null);
    setDebugInfo({
      rawTranscript: '',
      normalizedWords: [],
      expectedWords: expectedWordsRef.current,
      matchedCount: 0,
      wasAdvanced: false,
      pageId
    });
  }, [pageId]);

  const startListening = useCallback(() => {
    console.log('[useSpeechRecognition] startListening called');
    console.log('[useSpeechRecognition] isSupported:', isSupported);
    console.log('[useSpeechRecognition] isListening:', isListening);
    console.log('[useSpeechRecognition] isStartingRef.current:', isStartingRef.current);
    console.log('[useSpeechRecognition] isStoppingRef.current:', isStoppingRef.current);

    if (!isSupported) {
      console.log('[useSpeechRecognition] NOT SUPPORTED - returning');
      return;
    }

    if (isListening || isStartingRef.current) {
      console.log('[useSpeechRecognition] Already listening or starting - returning');
      return;
    }

    if (isStoppingRef.current) {
      console.log('[useSpeechRecognition] Currently stopping - returning');
      return;
    }

    isStartingRef.current = true;
    setError(null);

    console.log('[useSpeechRecognition] Creating SpeechRecognition instance');

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      console.log('[useSpeechRecognition] Recognition instance created');

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        isStartingRef.current = false;
        setIsListening(true);
        setRecognitionStatus('listening');
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript + ' ';
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        const combined = (finalTranscript + ' ' + interimTranscript).trim();
        setTranscript(combined);
        setNormalizedTranscript(normalizeText(combined).join(' '));
        processTranscript(combined);
      };

      recognition.onerror = (event: any) => {
        console.error('[Speech] Error:', event.error);

        if (event.error === 'not-allowed') {
          setError('Microphone access denied');
          setRecognitionStatus('error');
        } else if (event.error !== 'aborted' && event.error !== 'no-speech') {
          setError(`Error: ${event.error}`);
        }

        isStartingRef.current = false;
      };

      recognition.onend = () => {
        isStartingRef.current = false;
        isStoppingRef.current = false;
        setIsListening(false);
        setRecognitionStatus('stopped');
        recognitionRef.current = null;
      };

      console.log('[useSpeechRecognition] Calling recognition.start()');
      recognition.start();
      recognitionRef.current = recognition;
      console.log('[useSpeechRecognition] recognition.start() called successfully');

    } catch (err) {
      console.error('[Speech] Start error:', err);
      setError('Could not start speech recognition');
      setIsListening(false);
      setRecognitionStatus('error');
      isStartingRef.current = false;
    }
  }, [isSupported, isListening, processTranscript]);

  // Reset when page changes (pageId dependency only)
  useEffect(() => {
    console.log('[useSpeechRecognition] Page changed to:', pageId);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log('[Speech] Error stopping on page change:', e);
      }
      recognitionRef.current = null;
    }

    isStartingRef.current = false;
    isStoppingRef.current = false;
    matchedCountRef.current = 0;
    setTranscript('');
    setNormalizedTranscript('');
    setError(null);
    setIsListening(false);
    setRecognitionStatus('idle');

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('[Speech] Cleanup error:', e);
        }
        recognitionRef.current = null;
      }
      isStartingRef.current = false;
      isStoppingRef.current = false;
    };
  }, [pageId]);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetListening,
    transcript,
    normalizedTranscript,
    error,
    recognitionStatus,
    debugInfo
  };
};
