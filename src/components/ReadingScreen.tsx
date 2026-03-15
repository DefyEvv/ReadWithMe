import { useState, useEffect, useCallback, useRef } from 'react';
import { BookLevel, AppSettings } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { BookIllustration } from './BookIllustration';
import { ArrowLeft, ArrowRight, Volume2, Mic, MicOff, RotateCcw, Bug } from 'lucide-react';

interface ReadingScreenProps {
  book: BookLevel;
  initialPage: number;
  settings: AppSettings;
  themeId: string;
  onBack: () => void;
  onPageComplete: (pageNumber: number) => void;
  onBookComplete: () => void;
}

type WordState = 'neutral' | 'current' | 'correct';

const normalizeWord = (word: string): string => {
  return word.toLowerCase().trim().replace(/[.,!?;:"']/g, '');
};

export const ReadingScreen = ({
  book,
  initialPage,
  settings,
  themeId,
  onBack,
  onPageComplete,
  onBookComplete
}: ReadingScreenProps) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(initialPage);
  const [completedWords, setCompletedWords] = useState(0);
  const [wordStates, setWordStates] = useState<WordState[]>([]);
  const [listening, setListening] = useState(settings.autoListening);
  const [showDebug, setShowDebug] = useState(false);

  const stopListeningRef = useRef<(() => void) | null>(null);
  const resetListeningRef = useRef<(() => void) | null>(null);

  const currentPage = book.pages[currentPageIndex];
  const sentenceWords = currentPage.text.split(/\s+/);
  const expectedWords = sentenceWords.map(w => normalizeWord(w));

  // Reset page state when page changes
  useEffect(() => {
    console.log(`[ReadingScreen] Page changed to ${currentPageIndex}`);
    setWordStates(expectedWords.map(() => 'neutral'));
    setCompletedWords(0);
  }, [currentPageIndex]);

  const handleProgressUpdate = useCallback((matchedCount: number, transcript: string, wasAdvanced: boolean) => {
    if (wasAdvanced) {
      console.log(`[ReadingScreen] Progress advanced: ${matchedCount}/${expectedWords.length} words matched`);
    }

    setCompletedWords(prevCount => Math.max(prevCount, matchedCount));

    const newStates = expectedWords.map((_, index) => {
      if (index < matchedCount) return 'correct';
      if (index === matchedCount) return 'current';
      return 'neutral';
    });

    setWordStates(newStates);

    if (matchedCount === expectedWords.length && matchedCount > 0) {
      console.log('[ReadingScreen] Page complete! Stopping listening.');
      onPageComplete(currentPageIndex);
      setListening(false);
    }
  }, [expectedWords, currentPageIndex, onPageComplete]);

  const {
    isListening,
    isSupported,
    error,
    transcript,
    normalizedTranscript,
    debugInfo,
    resetListening,
    stopListening,
    startListening,
    recognitionStatus
  } = useSpeechRecognition({
    expectedWords,
    onProgressUpdate: handleProgressUpdate,
    enabled: listening,
    pageId: currentPageIndex
  });

  stopListeningRef.current = stopListening;
  resetListeningRef.current = resetListening;

  const isPageComplete = completedWords === expectedWords.length && expectedWords.length > 0;

  const speakText = (text: string) => {
    if (!settings.soundEnabled) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleHearIt = () => {
    speakText(currentPage.text);
  };

  const handleWordClick = (word: string) => {
    speakText(word);
  };

  const handleResetPage = () => {
    console.log('[ReadingScreen] Resetting page');
    setCompletedWords(0);
    setWordStates(expectedWords.map(() => 'neutral'));
    resetListening();
  };

  const handleNextPage = () => {
    console.log('[ReadingScreen] Next page clicked');

    if (currentPageIndex < book.pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
      setListening(false);
    } else {
      onBookComplete();
    }
  };

  const handlePrevPage = () => {
    console.log('[ReadingScreen] Previous page clicked');

    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
      setListening(false);
    }
  };

  const getWordClassName = (state: WordState): string => {
    const base = 'inline-block px-3 py-2 mx-1 my-1 rounded-xl transition-all duration-300 cursor-pointer text-3xl md:text-5xl font-bold';
    switch (state) {
      case 'current':
        return `${base} bg-yellow-300 scale-110 shadow-lg ring-4 ring-yellow-400`;
      case 'correct':
        return `${base} bg-green-300 text-green-900`;
      default:
        return `${base} bg-gray-200 text-gray-600`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-3 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-xl shadow-lg">
              <span className="font-bold text-gray-700">
                Page {currentPageIndex + 1} / {book.pages.length}
              </span>
            </div>

            <button
              onClick={() => setShowDebug(!showDebug)}
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
              aria-label="Toggle debug"
            >
              <Bug className="w-5 h-5 text-gray-600" />
            </button>

            {isSupported && (
              <button
                onClick={() => {
                  console.log('[ReadingScreen] Mic button clicked, isListening:', isListening);
                  if (isListening) {
                    console.log('[ReadingScreen] Stopping mic');
                    stopListening();
                    setListening(false);
                  } else {
                    console.log('[ReadingScreen] Starting mic');
                    startListening();
                    setListening(true);
                  }
                }}
                className={`p-3 rounded-full shadow-lg transition-all ${
                  isListening
                    ? 'bg-green-500 text-white animate-pulse'
                    : 'bg-white text-gray-600 hover:scale-105'
                }`}
                aria-label={isListening ? 'Stop listening' : 'Start listening'}
              >
                {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>

        {!isSupported && (
          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-2xl p-4 mb-6">
            <p className="text-yellow-800 font-semibold">
              Speech recognition is not supported in your browser. Tap Next to continue.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-2 border-red-400 rounded-2xl p-4 mb-6">
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        )}

        {isSupported && listening && (
          <div className={`border-2 rounded-2xl p-4 mb-6 ${
            isListening
              ? 'bg-green-50 border-green-400'
              : recognitionStatus === 'starting'
              ? 'bg-yellow-50 border-yellow-400'
              : 'bg-gray-50 border-gray-400'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`font-semibold flex items-center gap-2 ${
                isListening ? 'text-green-800' : 'text-gray-700'
              }`}>
                <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
                {recognitionStatus === 'starting' && 'Starting microphone...'}
                {recognitionStatus === 'listening' && `Listening for: ${expectedWords.join(' ')}`}
                {recognitionStatus === 'stopping' && 'Stopping...'}
                {recognitionStatus === 'stopped' && 'Stopped'}
                {recognitionStatus === 'idle' && 'Ready to listen'}
                {recognitionStatus === 'error' && 'Error occurred'}
              </p>
              <p className="text-sm text-green-700">
                Progress: <span className="font-bold">{completedWords}/{expectedWords.length}</span>
              </p>
            </div>
            {transcript && (
              <p className="text-sm text-green-600 mt-2">
                You said: <span className="font-semibold">{transcript}</span>
              </p>
            )}
          </div>
        )}

        {showDebug && (
          <div className="bg-gray-800 text-white rounded-2xl p-4 mb-6 font-mono text-xs">
            <h3 className="font-bold mb-2 text-sm">Debug Info</h3>
            <div className="space-y-1">
              <p className="text-blue-400 font-bold">Page: {currentPageIndex + 1}</p>
              <p className="text-purple-400 font-bold">Status: {recognitionStatus.toUpperCase()}</p>
              <p>Listening: {isListening ? 'YES' : 'NO'}</p>
              <p>Auto-listen: {settings.autoListening ? 'YES' : 'NO'}</p>
              <p className="border-t border-gray-600 pt-1 mt-2">You said: {debugInfo.rawTranscript || '(nothing yet)'}</p>
              <p>Spoken words: [{debugInfo.normalizedWords.join(', ')}]</p>
              <p>Expected: [{debugInfo.expectedWords.join(', ')}]</p>
              <p className="text-yellow-400 font-bold">Matched: {debugInfo.matchedCount}/{expectedWords.length}</p>
              <p className={debugInfo.wasAdvanced ? 'text-green-400' : 'text-gray-400'}>
                Progress advanced: {debugInfo.wasAdvanced ? 'YES' : 'NO'}
              </p>
              <p className="text-cyan-400">Has image: {currentPage.imagePrompt ? 'YES' : 'NO'}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
          <div className="h-64 md:h-96">
            <BookIllustration page={currentPage} themeId={themeId} />
          </div>

          <div className="p-6 md:p-12 bg-white">
            <div className="text-center leading-relaxed flex flex-wrap justify-center items-center min-h-[150px]">
              {sentenceWords.map((word, index) => (
                <span
                  key={index}
                  className={getWordClassName(wordStates[index])}
                  onClick={() => handleWordClick(word)}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <button
            onClick={handleHearIt}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 font-bold"
          >
            <Volume2 className="w-5 h-5" />
            Hear It
          </button>

          <button
            onClick={handleResetPage}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 font-bold"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>

          <button
            onClick={handlePrevPage}
            disabled={currentPageIndex === 0}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl shadow-lg font-bold transition-all ${
              currentPageIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:shadow-xl hover:scale-105'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Prev
          </button>

          <button
            onClick={handleNextPage}
            disabled={!isPageComplete && isSupported}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl shadow-lg font-bold transition-all ${
              !isPageComplete && isSupported
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-green-500 text-white hover:shadow-xl hover:scale-105'
            }`}
          >
            {currentPageIndex === book.pages.length - 1 ? 'Finish' : 'Next'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {isPageComplete && (
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-6 text-center">
            <p className="text-2xl font-bold text-green-700">Great job! Ready for the next page!</p>
          </div>
        )}
      </div>
    </div>
  );
};
