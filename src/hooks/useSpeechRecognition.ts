import { useState, useEffect, useCallback, useRef } from 'react';

type RecognitionStatus = 'idle' | 'starting' | 'listening' | 'stopped' | 'error';

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
  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  // Simple word matching - find how many words from the start match
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
    const spokenWords = normalizeText(fullTranscript);
    const matchCount = matchWords(spokenWords, expectedWords);
    const wasAdvanced = matchCount > matchedCountRef.current;

    if (wasAdvanced) {
      console.log(`[Speech] Progress: ${matchCount}/${expectedWords.length} words matched`);
      matchedCountRef.current = matchCount;
    }

    setDebugInfo({
      rawTranscript: fullTranscript,
      normalizedWords: spokenWords,
      expectedWords: expectedWords,
      matchedCount: matchCount,
      wasAdvanced,
      pageId
    });

    onProgressUpdate(matchCount, fullTranscript, wasAdvanced);

    // Stop if page complete
    if (matchCount === expectedWords.length && expectedWords.length > 0) {
      console.log('[Speech] Page complete!');
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  }, [expectedWords, matchWords, onProgressUpdate, pageId]);

  const stopListening = useCallback(() => {
    console.log('[Speech] Stopping');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log('[Speech] Error stopping:', e);
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    setRecognitionStatus('stopped');
  }, []);

  const resetListening = useCallback(() => {
    console.log('[Speech] Resetting');
    matchedCountRef.current = 0;
    setTranscript('');
    setNormalizedTranscript('');
    setError(null);
    setDebugInfo({
      rawTranscript: '',
      normalizedWords: [],
      expectedWords: expectedWords,
      matchedCount: 0,
      wasAdvanced: false,
      pageId
    });
  }, [expectedWords, pageId]);

  const startListening = useCallback(() => {
    console.log('[Speech] Starting');

    if (!isSupported) {
      console.log('[Speech] Not supported');
      return;
    }

    if (isListening) {
      console.log('[Speech] Already listening');
      return;
    }

    setRecognitionStatus('starting');
    setError(null);

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        console.log('[Speech] Started');
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
          setRecognitionStatus('error');
        }
      };

      recognition.onend = () => {
        console.log('[Speech] Ended');
        setIsListening(false);
        setRecognitionStatus('stopped');
        recognitionRef.current = null;

        // Auto-restart if still enabled and page not complete
        if (enabled && matchedCountRef.current < expectedWords.length) {
          console.log('[Speech] Auto-restarting...');
          setTimeout(() => {
            if (enabled && matchedCountRef.current < expectedWords.length) {
              startListening();
            }
          }, 300);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;

    } catch (err) {
      console.error('[Speech] Start error:', err);
      setError('Could not start speech recognition');
      setIsListening(false);
      setRecognitionStatus('error');
    }
  }, [isSupported, isListening, enabled, expectedWords.length, processTranscript]);

  // Handle page changes
  useEffect(() => {
    console.log(`[Speech] Page changed to: ${pageId}`);

    // Stop current recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log('[Speech] Error stopping on page change:', e);
      }
      recognitionRef.current = null;
    }

    // Reset state for new page
    matchedCountRef.current = 0;
    setTranscript('');
    setNormalizedTranscript('');
    setError(null);
    setIsListening(false);
    setRecognitionStatus('idle');
    setDebugInfo({
      rawTranscript: '',
      normalizedWords: [],
      expectedWords: expectedWords,
      matchedCount: 0,
      wasAdvanced: false,
      pageId
    });

    // Start listening if enabled
    if (enabled) {
      console.log('[Speech] Auto-starting for new page');
      setTimeout(() => {
        if (enabled) {
          startListening();
        }
      }, 300);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('[Speech] Cleanup error:', e);
        }
        recognitionRef.current = null;
      }
    };
  }, [pageId, expectedWords, enabled, startListening]);

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
