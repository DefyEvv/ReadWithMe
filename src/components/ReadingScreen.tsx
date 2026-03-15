import { useState, useEffect, useCallback } from 'react';
import { BookLevel, AppSettings } from '../types';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { BookIllustration } from './BookIllustration';
import { ArrowLeft, ArrowRight, Volume2, Circle, RotateCcw, Bug } from 'lucide-react';

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
    .split(/\s+/)
    .map(w => normalizeWord(w))
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
  const [showDebug, setShowDebug] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');

  const {
    isRecording,
    isProcessing,
    status,
    error,
    isSupported,
    startRecording,
    stopRecording,
  } = useAudioRecorder();

  const currentPage = book.pages[currentPageIndex];
  const sentenceWords = currentPage.text.split(/\s+/);
  const expectedWords = sentenceWords.map(w => normalizeWord(w));

  // Reset page state when page changes
  useEffect(() => {
    console.log(`[ReadingScreen] Page changed to ${currentPageIndex}`);
    console.log(`[ReadingScreen] Expected words:`, expectedWords);
    setWordStates(expectedWords.map(() => 'neutral'));
    setCompletedWords(0);
    setLastTranscript('');
  }, [currentPageIndex]);

  const updateProgress = useCallback((transcript: string) => {
    const spokenWords = normalizeText(transcript);

    console.log('[ReadingScreen] Matching transcript:', transcript);
    console.log('[ReadingScreen] Spoken words:', spokenWords);
    console.log('[ReadingScreen] Expected words:', expectedWords);

    // Forward-only matching: find how many consecutive words match from the start
    let newMatchCount = 0;
    for (let i = 0; i < Math.min(spokenWords.length, expectedWords.length); i++) {
      if (spokenWords[i] === expectedWords[i]) {
        newMatchCount = i + 1;
      } else {
        break;
      }
    }

    // Never go backwards
    const finalMatchCount = Math.max(completedWords, newMatchCount);

    console.log('[ReadingScreen] Previous match count:', completedWords);
    console.log('[ReadingScreen] New match count:', newMatchCount);
    console.log('[ReadingScreen] Final match count:', finalMatchCount);

    setCompletedWords(finalMatchCount);

    // Update word states
    const newStates = expectedWords.map((_, index) => {
      if (index < finalMatchCount) return 'correct';
      if (index === finalMatchCount) return 'current';
      return 'neutral';
    });

    setWordStates(newStates);

    // Check if page is complete
    if (finalMatchCount === expectedWords.length && expectedWords.length > 0) {
      console.log('[ReadingScreen] Page complete!');
      onPageComplete(currentPageIndex);
    }
  }, [expectedWords, completedWords, currentPageIndex, onPageComplete]);

  const handleReadPage = async () => {
    if (isRecording) {
      // Stop recording and get transcript
      try {
        const transcript = await stopRecording();
        setLastTranscript(transcript);
        updateProgress(transcript);
      } catch (err) {
        console.error('[ReadingScreen] Error stopping recording:', err);
      }
    } else {
      // Start recording
      await startRecording();
    }
  };

  const handleResetPage = () => {
    console.log('[ReadingScreen] Resetting page');
    setCompletedWords(0);
    setWordStates(expectedWords.map(() => 'neutral'));
    setLastTranscript('');
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
    speakText(currentPage.text);
  };

  const handleWordClick = (word: string) => {
    speakText(word);
  };

  const handleNextPage = () => {
    console.log('[ReadingScreen] Next page clicked');

    if (currentPageIndex < book.pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      onBookComplete();
    }
  };

  const handlePrevPage = () => {
    console.log('[ReadingScreen] Previous page clicked');

    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const isPageComplete = completedWords === expectedWords.length && expectedWords.length > 0;

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

  const getStatusText = () => {
    if (isRecording) return 'Recording... Tap to stop';
    if (isProcessing) return 'Processing...';
    if (isPageComplete) return 'Complete!';
    return 'Idle';
  };

  const getStatusColor = () => {
    if (isRecording) return 'bg-red-50 border-red-400 text-red-800';
    if (isProcessing) return 'bg-blue-50 border-blue-400 text-blue-800';
    if (isPageComplete) return 'bg-green-50 border-green-400 text-green-800';
    return 'bg-gray-50 border-gray-400 text-gray-800';
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
          </div>
        </div>

        {!isSupported && (
          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-2xl p-4 mb-6">
            <p className="text-yellow-800 font-semibold">
              Audio recording is not supported in your browser. Tap Next to continue.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-2 border-red-400 rounded-2xl p-4 mb-6">
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        )}

        <div className={`border-2 rounded-2xl p-4 mb-6 ${getStatusColor()}`}>
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold flex items-center gap-2">
              <Circle className={`w-3 h-3 ${isRecording ? 'fill-current animate-pulse' : ''}`} />
              Status: {getStatusText()}
            </p>
            <p className="text-sm">
              Progress: <span className="font-bold">{completedWords}/{expectedWords.length}</span>
            </p>
          </div>
        </div>

        {showDebug && (
          <div className="bg-gray-800 text-white rounded-2xl p-4 mb-6 font-mono text-xs">
            <h3 className="font-bold mb-2 text-sm">Debug Info</h3>
            <div className="space-y-1">
              <p className="text-blue-400 font-bold border-b border-gray-600 pb-1">PAGE STATE</p>
              <p>Current page: {currentPageIndex + 1}</p>
              <p>Expected text: {currentPage.text}</p>
              <p>Expected words: [{expectedWords.join(', ')}]</p>
              <p>Completed words: {completedWords}/{expectedWords.length}</p>
              <p>Page complete: {isPageComplete ? 'YES' : 'NO'}</p>

              <p className="text-purple-400 font-bold border-b border-gray-600 pb-1 pt-2">RECORDING STATE</p>
              <p>Status: {status.toUpperCase()}</p>
              <p>Recording: {isRecording ? 'YES' : 'NO'}</p>
              <p>Processing: {isProcessing ? 'YES' : 'NO'}</p>

              <p className="text-green-400 font-bold border-b border-gray-600 pb-1 pt-2">TRANSCRIPT</p>
              <p>Last transcript: {lastTranscript || '(none yet)'}</p>
              <p>Normalized: [{normalizeText(lastTranscript).join(', ')}]</p>
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
          {isSupported && (
            <button
              onClick={handleReadPage}
              disabled={isProcessing}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl shadow-lg font-bold transition-all ${
                isRecording
                  ? 'bg-red-500 text-white hover:shadow-xl hover:scale-105 animate-pulse'
                  : isProcessing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:shadow-xl hover:scale-105'
              }`}
            >
              <Circle className={`w-5 h-5 ${isRecording ? 'fill-current' : ''}`} />
              {isRecording ? 'Stop' : 'Read Page'}
            </button>
          )}

          <button
            onClick={handleHearIt}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 font-bold"
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
