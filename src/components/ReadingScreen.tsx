import { useState, useEffect } from 'react';
import { BookLevel, AppSettings } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { BookIllustration } from './BookIllustration';
import { ArrowLeft, ArrowRight, Volume2, Circle, RotateCcw, Mic, CheckCircle2 } from 'lucide-react';

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

const normalizeText = (text: string): string[] => {
  return text
    .toLowerCase()
    .replace(/[.,!?;:"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
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
  const [pageMatchedCounts, setPageMatchedCounts] = useState<number[]>(book.pages.map(() => 0));
  const [completedWords, setCompletedWords] = useState(0);
  const [wordStates, setWordStates] = useState<WordState[]>([]);
  const [lastTranscript, setLastTranscript] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);
  const [animatingWords, setAnimatingWords] = useState(false);

  const currentPage = book.pages[currentPageIndex];
  const sentenceWords = currentPage.text.split(/\s+/);
  const expectedWords = normalizeText(currentPage.text);

  const {
    isListening,
    isSupported,
    interimTranscript,
    finalTranscript,
    error,
    status,
    startListening,
    stopListening,
    resetSession,
  } = useSpeechRecognition({
    pageId: `${book.id}-${currentPageIndex}`,
  });

  useEffect(() => {
    setPageMatchedCounts(book.pages.map(() => 0));
    setCurrentPageIndex(initialPage);
  }, [book.id, book.pages, initialPage]);

  useEffect(() => {
    const matchedCount = Math.min(pageMatchedCounts[currentPageIndex] ?? 0, expectedWords.length);
    setCompletedWords(matchedCount);

    const newStates = sentenceWords.map((_, index) => {
      if (index < matchedCount) return 'correct';
      if (index === matchedCount) return 'current';
      return 'neutral';
    });

    setWordStates(newStates);
    setLastTranscript('');
    setShowTranscript(false);
    setAnimatingWords(false);
    resetSession();
  }, [currentPageIndex, pageMatchedCounts, expectedWords.length, sentenceWords, resetSession]);

  const applyMatchedCount = (nextMatchedCount: number) => {
    const finalMatchedCount = Math.max(completedWords, Math.min(nextMatchedCount, expectedWords.length));

    if (finalMatchedCount > completedWords) {
      setAnimatingWords(true);
      setTimeout(() => setAnimatingWords(false), 1000);
    }

    setCompletedWords(finalMatchedCount);

    setPageMatchedCounts((previous) => {
      const next = [...previous];
      next[currentPageIndex] = finalMatchedCount;
      return next;
    });

    const newStates = sentenceWords.map((_, index) => {
      if (index < finalMatchedCount) return 'correct';
      if (index === finalMatchedCount) return 'current';
      return 'neutral';
    });
    setWordStates(newStates);

    if (finalMatchedCount === expectedWords.length && expectedWords.length > 0) {
      onPageComplete(currentPageIndex);
    }
  };

  const scoreTranscript = (transcript: string) => {
    const spokenWords = normalizeText(transcript);
    let detectedMatchedCount = completedWords;

    for (let index = completedWords; index < expectedWords.length; index += 1) {
      if (spokenWords[index] === expectedWords[index]) {
        detectedMatchedCount = index + 1;
      } else {
        break;
      }
    }

    const newMatchedCount = Math.max(completedWords, detectedMatchedCount);
    applyMatchedCount(newMatchedCount);
  };

  const handleStartReading = () => {
    setShowTranscript(false);
    setLastTranscript('');
    startListening();
  };

  const handleCheckReading = async () => {
    const transcript = await stopListening();
    setLastTranscript(transcript);
    setShowTranscript(true);
    scoreTranscript(transcript);
  };

  const handleWordTap = (index: number) => {
    if (settings.soundEnabled && !isListening) {
      const utterance = new SpeechSynthesisUtterance(sentenceWords[index]);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleResetPage = () => {
    setPageMatchedCounts((previous) => {
      const next = [...previous];
      next[currentPageIndex] = 0;
      return next;
    });
    setCompletedWords(0);
    setWordStates(sentenceWords.map((_, index) => (index === 0 ? 'current' : 'neutral')));
    setLastTranscript('');
    setShowTranscript(false);
    setAnimatingWords(false);
    resetSession();
  };

  const speakText = (text: string) => {
    if (!settings.soundEnabled) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleHearIt = () => {
    if (!isListening) {
      speakText(currentPage.text);
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < book.pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      onBookComplete();
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const isPageComplete = completedWords === expectedWords.length && expectedWords.length > 0;

  const getWordClassName = (state: WordState): string => {
    const base = 'inline-block px-3 py-2 mx-1 my-1 rounded-xl transition-all duration-500 cursor-pointer text-3xl md:text-5xl font-bold';
    const animation = animatingWords && state === 'correct' ? 'animate-bounce' : '';

    switch (state) {
      case 'current':
        return `${base} bg-yellow-300 scale-110 shadow-lg ring-4 ring-yellow-400`;
      case 'correct':
        return `${base} bg-green-300 text-green-900 ${animation}`;
      default:
        return `${base} bg-gray-200 text-gray-600 hover:bg-gray-300 hover:scale-105`;
    }
  };

  const getStatusText = () => {
    if (isListening) return 'Listening... Read the sentence!';
    if (status === 'error') return 'Speech recognition had a problem. Please try again.';
    if (isPageComplete) return 'Page Complete! Great reading!';
    if (showTranscript) return 'Check your progress below';
    return 'Tap "Start Reading" when ready';
  };

  const getStatusColor = () => {
    if (isListening) return 'bg-red-50 border-red-400 text-red-800';
    if (status === 'error') return 'bg-red-50 border-red-400 text-red-800';
    if (isPageComplete) return 'bg-green-50 border-green-400 text-green-800';
    if (showTranscript) return 'bg-blue-50 border-blue-400 text-blue-800';
    return 'bg-gray-50 border-gray-400 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            disabled={isListening}
            className="flex items-center gap-2 px-4 py-3 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="bg-white px-4 py-2 rounded-xl shadow-lg">
            <span className="font-bold text-gray-700">
              Page {currentPageIndex + 1} / {book.pages.length}
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-red-400 rounded-2xl p-4 mb-6">
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        )}

        <div className={`border-2 rounded-2xl p-4 mb-6 ${getStatusColor()}`}>
          <div className="flex items-center justify-center mb-2">
            <p className="font-semibold text-center flex items-center gap-2">
              {isListening && <Circle className="w-3 h-3 fill-current animate-pulse" />}
              {getStatusText()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm">
              Progress: <span className="font-bold">{completedWords}/{expectedWords.length}</span> words
            </p>
            {isListening && interimTranscript && (
              <p className="text-sm mt-2 opacity-80">Hearing: {`${finalTranscript} ${interimTranscript}`.trim()}</p>
            )}
          </div>
        </div>

        {settings.showTranscript && showTranscript && (
          <div className="bg-white border-2 border-blue-400 rounded-2xl p-4 mb-6">
            <p className="text-sm font-semibold text-gray-600 mb-2">What I heard:</p>
            <p className="text-lg text-blue-800 font-medium">{lastTranscript || '(no transcript)'}</p>
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
                  onClick={() => handleWordTap(index)}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {!isListening && (
            <button
              onClick={handleStartReading}
              disabled={!isSupported}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mic className="w-6 h-6" />
              Start Reading
            </button>
          )}

          {isListening && (
            <button
              onClick={handleCheckReading}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-red-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 font-bold text-lg animate-pulse"
            >
              <CheckCircle2 className="w-6 h-6" />
              Check My Reading
            </button>
          )}

          <button
            onClick={handleHearIt}
            disabled={isListening}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Volume2 className="w-5 h-5" />
            Hear It
          </button>

          <button
            onClick={handleResetPage}
            disabled={isListening}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-5 h-5" />
            Reset Page
          </button>

          <button
            onClick={handlePrevPage}
            disabled={currentPageIndex === 0 || isListening}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl shadow-lg font-bold transition-all ${
              currentPageIndex === 0 || isListening
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:shadow-xl hover:scale-105'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Prev
          </button>

          <button
            onClick={handleNextPage}
            disabled={!isPageComplete || isListening}
            className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl shadow-lg font-bold transition-all text-lg col-span-2 md:col-span-1 ${
              !isPageComplete || isListening
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-green-500 text-white hover:shadow-xl hover:scale-105'
            }`}
          >
            {currentPageIndex === book.pages.length - 1 ? 'Finish Book' : 'Next Page'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {isPageComplete && (
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-6 text-center">
            <p className="text-2xl font-bold text-green-700">
              Excellent work! You read all {expectedWords.length} words correctly!
            </p>
          </div>
        )}

        {!isSupported && (
          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-2xl p-4 mt-6">
            <p className="text-yellow-800 font-semibold text-center">
              Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
