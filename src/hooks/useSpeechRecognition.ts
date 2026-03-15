import { useState, useEffect, useCallback, useRef } from 'react';

type RecognitionStatus = 'idle' | 'starting' | 'listening' | 'stopping' | 'stopped' | 'error';

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
    lockedCount: number;
    wasAdvanced: boolean;
    isPageLocked: boolean;
    status: RecognitionStatus;
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

const removeDuplicateWords = (words: string[]): string[] => {
  const result: string[] = [];
  for (let i = 0; i < words.length; i++) {
    if (i === 0 || words[i] !== words[i - 1]) {
      result.push(words[i]);
    }
  }
  return result;
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
    lockedCount: 0,
    wasAdvanced: false,
    isPageLocked: false,
    status: 'idle' as RecognitionStatus,
    pageId: pageId
  });

  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef<string>('');
  const lockedMatchedCountRef = useRef<number>(0);
  const isPageLockedRef = useRef<boolean>(false);
  const enabledRef = useRef(enabled);
  const expectedWordsRef = useRef(expectedWords);
  const onProgressUpdateRef = useRef(onProgressUpdate);
  const currentPageIdRef = useRef(pageId);
  const shouldAutoRestartRef = useRef(false);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    expectedWordsRef.current = expectedWords;
  }, [expectedWords]);

  useEffect(() => {
    onProgressUpdateRef.current = onProgressUpdate;
  }, [onProgressUpdate]);

  useEffect(() => {
    currentPageIdRef.current = pageId;
  }, [pageId]);

  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  const processTranscript = useCallback((fullTranscript: string, finalPart: string, interimPart: string) => {
    if (isPageLockedRef.current) {
      console.log('Page locked - ignoring transcript');
      return;
    }

    const normalizedSpoken = normalizeText(fullTranscript);
    const cleanedSpoken = removeDuplicateWords(normalizedSpoken);
    const expected = expectedWordsRef.current;
    const currentLocked = lockedMatchedCountRef.current;

    let farthestMatch = currentLocked;

    for (let startOffset = 0; startOffset <= currentLocked && startOffset < cleanedSpoken.length; startOffset++) {
      let testMatch = currentLocked;

      for (let i = 0; i < cleanedSpoken.length - startOffset; i++) {
        const expectedIndex = currentLocked + i;
        const spokenIndex = startOffset + i;

        if (expectedIndex >= expected.length) break;
        if (spokenIndex >= cleanedSpoken.length) break;

        if (expected[expectedIndex] === cleanedSpoken[spokenIndex]) {
          testMatch = expectedIndex + 1;
        } else {
          break;
        }
      }

      if (testMatch > farthestMatch) {
        farthestMatch = testMatch;
      }
    }

    const newMatchedCount = Math.max(currentLocked, farthestMatch);
    const wasAdvanced = newMatchedCount > currentLocked;

    lockedMatchedCountRef.current = newMatchedCount;

    if (newMatchedCount >= expected.length && expected.length > 0) {
      isPageLockedRef.current = true;
      shouldAutoRestartRef.current = false;
      console.log('Page locked - all words complete!');
    }

    setDebugInfo(prev => ({
      ...prev,
      rawTranscript: `Final: "${finalPart}" | Interim: "${interimPart}"`,
      normalizedWords: cleanedSpoken,
      expectedWords: expected,
      matchedCount: newMatchedCount,
      lockedCount: currentLocked,
      wasAdvanced,
      isPageLocked: isPageLockedRef.current
    }));

    onProgressUpdateRef.current(newMatchedCount, fullTranscript, wasAdvanced);
  }, []);

  const stopListening = useCallback(() => {
    console.log(`[stopListening] called, status: ${recognitionStatus}`);

    if (recognitionStatus === 'stopping' || recognitionStatus === 'stopped' || recognitionStatus === 'idle') {
      console.log('[stopListening] already stopping/stopped/idle, ignoring');
      return;
    }

    shouldAutoRestartRef.current = false;
    setRecognitionStatus('stopping');

    if (recognitionRef.current) {
      try {
        console.log('[stopListening] calling recognition.stop()');
        recognitionRef.current.stop();
      } catch (e) {
        console.log('[stopListening] error stopping recognition:', e);
        setRecognitionStatus('stopped');
      }
    } else {
      setRecognitionStatus('stopped');
      setIsListening(false);
    }
  }, [recognitionStatus]);

  const resetListening = useCallback(() => {
    console.log('[resetListening] called');
    finalTranscriptRef.current = '';
    lockedMatchedCountRef.current = 0;
    isPageLockedRef.current = false;
    shouldAutoRestartRef.current = false;
    setTranscript('');
    setNormalizedTranscript('');
    setError(null);
    setDebugInfo(prev => ({
      rawTranscript: '',
      normalizedWords: [],
      expectedWords: expectedWordsRef.current,
      matchedCount: 0,
      lockedCount: 0,
      wasAdvanced: false,
      isPageLocked: false,
      status: prev.status,
      pageId: currentPageIdRef.current
    }));
  }, []);

  const startListening = useCallback(() => {
    console.log(`[startListening] called, status: ${recognitionStatus}, enabled: ${enabledRef.current}`);

    if (!isSupported) {
      console.log('[startListening] not supported');
      return;
    }

    if (recognitionStatus === 'starting' || recognitionStatus === 'listening') {
      console.log('[startListening] already starting/listening, ignoring');
      return;
    }

    if (recognitionStatus === 'stopping') {
      console.log('[startListening] currently stopping, cannot start yet');
      return;
    }

    if (isPageLockedRef.current) {
      console.log('[startListening] page is locked, not starting');
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
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('[onstart] Speech recognition started');
        setIsListening(true);
        setRecognitionStatus('listening');
        finalTranscriptRef.current = '';
      };

      recognition.onresult = (event: any) => {
        if (isPageLockedRef.current) {
          console.log('[onresult] Page is locked, ignoring transcript');
          return;
        }

        let finalTranscript = finalTranscriptRef.current;
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcriptPart = result[0].transcript;

          if (result.isFinal) {
            finalTranscript += ' ' + transcriptPart;
          } else {
            interimTranscript += transcriptPart;
          }
        }

        finalTranscriptRef.current = finalTranscript;

        const combinedTranscript = (finalTranscript + ' ' + interimTranscript).trim();

        setTranscript(combinedTranscript);
        setNormalizedTranscript(normalizeText(combinedTranscript).join(' '));
        processTranscript(combinedTranscript, finalTranscript.trim(), interimTranscript.trim());

        if (isPageLockedRef.current && recognitionRef.current) {
          console.log('[onresult] Page complete - stopping recognition');
          shouldAutoRestartRef.current = false;
          setTimeout(() => {
            if (recognitionRef.current && isPageLockedRef.current) {
              try {
                recognitionRef.current.stop();
              } catch (e) {
                console.log('[onresult] error stopping:', e);
              }
            }
          }, 100);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('[onerror] Speech recognition error:', event.error);

        if (event.error === 'aborted') {
          return;
        }

        if (event.error === 'not-allowed') {
          setError('Microphone access denied. Please allow microphone access.');
          setIsListening(false);
          setRecognitionStatus('error');
          shouldAutoRestartRef.current = false;
        } else if (event.error === 'no-speech') {
          console.log('[onerror] No speech detected, will auto-restart if enabled');
        } else {
          setRecognitionStatus('error');
        }
      };

      recognition.onend = () => {
        console.log(`[onend] Speech recognition ended, shouldAutoRestart: ${shouldAutoRestartRef.current}, enabled: ${enabledRef.current}, pageLocked: ${isPageLockedRef.current}`);

        setIsListening(false);
        setRecognitionStatus('stopped');
        recognitionRef.current = null;

        if (shouldAutoRestartRef.current && enabledRef.current && !isPageLockedRef.current) {
          console.log('[onend] Auto-restarting recognition in 500ms');
          setTimeout(() => {
            if (shouldAutoRestartRef.current && enabledRef.current && !isPageLockedRef.current) {
              console.log('[onend] Restarting now');
              startListening();
            } else {
              console.log('[onend] Restart conditions no longer met');
            }
          }, 500);
        } else {
          console.log('[onend] Not auto-restarting');
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      shouldAutoRestartRef.current = true;

    } catch (err) {
      console.error('[startListening] Error starting speech recognition:', err);
      setError('Could not start speech recognition.');
      setIsListening(false);
      setRecognitionStatus('error');
    }
  }, [isSupported, recognitionStatus, processTranscript]);

  // Handle page changes - full cleanup and reset
  useEffect(() => {
    console.log(`[pageId effect] Page changed to: ${pageId}`);

    // Stop current recognition immediately
    shouldAutoRestartRef.current = false;
    if (recognitionRef.current) {
      try {
        console.log('[pageId effect] Stopping old recognition');
        recognitionRef.current.stop();
      } catch (e) {
        console.log('[pageId effect] Error stopping:', e);
      }
      recognitionRef.current = null;
    }

    // Reset all page-specific state
    resetListening();
    setIsListening(false);
    setRecognitionStatus('idle');

    // If enabled, start after a brief delay to ensure cleanup is complete
    if (enabled) {
      console.log('[pageId effect] Will auto-start in 300ms');
      const timer = setTimeout(() => {
        if (enabledRef.current && currentPageIdRef.current === pageId) {
          console.log('[pageId effect] Auto-starting for new page');
          startListening();
        }
      }, 300);

      return () => {
        clearTimeout(timer);
        shouldAutoRestartRef.current = false;
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch (e) {
            console.log('[pageId cleanup] Error stopping:', e);
          }
          recognitionRef.current = null;
        }
      };
    }

    return () => {
      shouldAutoRestartRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('[cleanup] Error stopping:', e);
        }
        recognitionRef.current = null;
      }
    };
  }, [pageId, enabled, resetListening, startListening]);

  // Handle enabled toggle (not page change)
  useEffect(() => {
    console.log(`[enabled effect] Enabled changed to: ${enabled}`);

    if (enabled && recognitionStatus === 'idle') {
      console.log('[enabled effect] Starting listening');
      startListening();
    } else if (!enabled && (recognitionStatus === 'listening' || recognitionStatus === 'starting')) {
      console.log('[enabled effect] Stopping listening');
      stopListening();
    }
  }, [enabled, recognitionStatus, startListening, stopListening]);

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
