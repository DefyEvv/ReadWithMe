import { BookLevel } from '../types';
import { Star, Home, BookOpen } from 'lucide-react';

interface CompletionScreenProps {
  book: BookLevel;
  onBackToLibrary: () => void;
  levelUnlocked?: boolean;
}

export const CompletionScreen = ({ book, onBackToLibrary, levelUnlocked }: CompletionScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
        <div className="mb-6">
          <div className="flex justify-center gap-4 mb-6">
            <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <Star className="w-20 h-20 text-yellow-400 fill-yellow-400 animate-bounce" style={{ animationDelay: '100ms' }} />
            <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-bounce" style={{ animationDelay: '200ms' }} />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            You Did It!
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-2">
            You finished reading
          </p>
          <p className="text-2xl md:text-3xl font-bold text-blue-600 mb-6">
            {book.title}
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-6 mb-8">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-green-600" />
          <p className="text-lg font-semibold text-gray-700">
            You read {book.pages.length} pages all by yourself!
          </p>
        </div>

        {levelUnlocked && (
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-8 border-4 border-purple-300">
            <div className="text-4xl mb-3">🎉</div>
            <p className="text-xl font-bold text-purple-700">
              You unlocked the next level!
            </p>
          </div>
        )}

        <button
          onClick={onBackToLibrary}
          className="flex items-center justify-center gap-3 w-full px-8 py-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 font-bold text-xl"
        >
          <Home className="w-6 h-6" />
          Back to Library
        </button>
      </div>
    </div>
  );
};
