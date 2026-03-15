import { useState, useEffect } from 'react';
import { BookLevel, AppSettings } from '../types';
import { useMediaRecorder } from '../hooks/useMediaRecorder';
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

const normalizeWord = (word: string): string => {
  return word.toLowerCase().trim().replace(/[.,!?;:"']/g, '');
};

const normalizeText = (text: string): string[] => {
  return text
    .toLowerCase()
    .replace(/[.,!?;:"']/g, '')
    .split(/\s+/)
    .filter(w => w.length > 0);
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
  const [lastTranscript, setLastTranscript] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);
  const [animatingWords, setAnimatingWords] = useState(false);

  const {
    status,
    error,
    isRecording,
    isProcessing,
    isSupported,
    startRecording,
    stopRecording,
  } = useMediaRecorder();

  const currentPage = book.pages[currentPageIndex];
  const sentenceWords = currentPage.text.split(/\s+/);
  const expectedWords = sentenceWords.map(w => normalizeWord(w));

  useEffect(() => {
    console.log(`[ReadingScreen] Page ${currentPageIndex + 1} loaded`);
    setWordStates(expectedWords.map(() => 'neutral'));
    setCompletedWords(0);
    setLastTranscript('');
    setShowTranscript(false);
    setAnimatingWords(false);
  }, [currentPageIndex]);

  const updateProgress = (transcript: string) => {
    const spokenWords = normalizeText(transcript);

    console.log('[Progress] Transcript:', transcript);
    console.log('[Progress] Spoken:', spokenWords);
    console.log('[Progress] Expected:', expectedWords);

    let newMatchCount = 0;
    for (let i = 0; i < Math.min(spokenWords.length, expectedWords.length); i++) {
      if (spokenWords[i] === expectedWords[i]) {
        newMatchCount = i + 1;
      } else {
        break;
      }
    }

    const finalMatchCount = Math.max(completedWords, newMatchCount);

    console.log('[Progress] Previous:', completedWords);
    console.log('[Progress] New:', newMatchCount);
    console.log('[Progress] Final:', finalMatchCount);

    if (finalMatchCount > completedWords) {
      setAnimatingWords(true);
      setTimeout(() => setAnimatingWords(false), 1000);
    }

    setCompletedWords(finalMatchCount);

    const newStates = expectedWords.map((_, index) => {
      if (index < finalMatchCount) return 'correct';
      if (index === finalMatchCount) return 'current';
      return 'neutral';
    });

    setWordStates(newStates);

    if (finalMatchCount === expectedWords.length && expectedWords.length > 0) {
      console.log('[Progress] Page complete!');
      onPageComplete(currentPageIndex);
    }
  };

  const handleStartReading = async () => {
    console.log('[ReadingScreen] Start Reading clicked');
    setShowTranscript(false);
    setLastTranscript('');
    await startRecording();
  };

  const handleCheckReading = async () => {
    console.log('[ReadingScreen] Check My Reading clicked');
    const transcript = await stopRecording();
    setLastTranscript(transcript);
    setShowTranscript(true);

    setTimeout(() => {
      updateProgress(transcript);
    }, 100);
  };

  const handleWordTap = (index: number) => {
    if (settings.soundEnabled && !isRecording) {
      const utterance = new SpeechSynthesisUtterance(sentenceWords[index]);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleResetPage = () => {
    console.log('[ReadingScreen] Reset Page');
    setCompletedWords(0);
    setWordStates(expectedWords.map(() => 'neutral'));
    setLastTranscript('');
    setShowTranscript(false);
    setAnimatingWords(false);
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
    if (!isRecording) {
      speakText(currentPage.text);
    }
  };

  const handleNextPage = () => {
    console.log('[ReadingScreen] Next page');

    if (currentPageIndex < book.pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      onBookComplete();
    }
  };

  const handlePrevPage = () => {
    console.log('[ReadingScreen] Previous page');

    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const isPageComplete = completedWords === expectedWords.length && expectedWords.length > 0;

  const getWordClassName = (state: WordState, index: number): string => {
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
    if (isRecording) return 'Listening... Read the sentence!';
    if (isProcessing) return 'Processing what you said...';
    if (isPageComplete) return 'Page Complete! Great reading!';
    if (showTranscript && lastTranscript) return 'Check your progress below';
    return 'Tap "Start Reading" when ready';
  };

  const getStatusColor = () => {
    if (isRecording) return 'bg-red-50 border-red-400 text-red-800';
    if (isProcessing) return 'bg-orange-50 border-orange-400 text-orange-800';
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
            disabled={isRecording || isProcessing}
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
              {isRecording && <Circle className="w-3 h-3 fill-current animate-pulse" />}
              {getStatusText()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm">
              Progress: <span className="font-bold">{completedWords}/{expectedWords.length}</span> words
            </p>
          </div>
        </div>

        {settings.showTranscript && showTranscript && lastTranscript && (
          <div className="bg-white border-2 border-blue-400 rounded-2xl p-4 mb-6">
            <p className="text-sm font-semibold text-gray-600 mb-2">What I heard:</p>
            <p className="text-lg text-blue-800 font-medium">{lastTranscript}</p>
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
                  className={getWordClassName(wordStates[index], index)}
                  onClick={() => handleWordTap(index)}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {!isRecording && !isProcessing && (
            <button
              onClick={handleStartReading}
              disabled={!isSupported}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mic className="w-6 h-6" />
              Start Reading
            </button>
          )}

          {isRecording && (
            <button
              onClick={handleCheckReading}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-red-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 font-bold text-lg animate-pulse"
            >
              <CheckCircle2 className="w-6 h-6" />
              Check My Reading
            </button>
          )}

          {isProcessing && (
            <div className="flex items-center justify-center gap-2 px-6 py-4 bg-orange-400 text-white rounded-2xl shadow-lg font-bold text-lg">
              <Circle className="w-6 h-6 animate-spin" />
              Processing...
            </div>
          )}

          <button
            onClick={handleHearIt}
            disabled={isRecording}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Volume2 className="w-5 h-5" />
            Hear It
          </button>

          <button
            onClick={handleResetPage}
            disabled={isRecording || isProcessing}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-5 h-5" />
            Reset Page
          </button>

          <button
            onClick={handlePrevPage}
            disabled={currentPageIndex === 0 || isRecording || isProcessing}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl shadow-lg font-bold transition-all ${
              currentPageIndex === 0 || isRecording || isProcessing
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:shadow-xl hover:scale-105'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Prev
          </button>

          <button
            onClick={handleNextPage}
            disabled={!isPageComplete || isRecording || isProcessing}
            className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl shadow-lg font-bold transition-all text-lg col-span-2 md:col-span-1 ${
              !isPageComplete || isRecording || isProcessing
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
              Voice recording is not supported in this browser. Please use a modern browser like Chrome, Edge, or Safari.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
