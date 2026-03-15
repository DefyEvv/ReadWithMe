import { BookTheme, ReadingProgress } from '../types';
import { Settings, BookOpen } from 'lucide-react';

interface StoryLibraryProps {
  themes: BookTheme[];
  progress: ReadingProgress;
  onSelectBook: (themeId: string, level: 1 | 2 | 3) => void;
  onOpenSettings: () => void;
}

export const StoryLibrary = ({ themes, progress, onSelectBook, onOpenSettings }: StoryLibraryProps) => {
  const getLevelLabel = (level: 1 | 2 | 3): string => {
    const labels = {
      1: 'Beginning Reader',
      2: 'Early Reader',
      3: 'Developing Reader'
    };
    return labels[level];
  };

  const isLevelUnlocked = (themeId: string, level: 1 | 2 | 3): boolean => {
    return (progress.unlockedLevels[themeId] || 1) >= level;
  };

  const getThemeGradient = (index: number): string => {
    const gradients = [
      'from-blue-400 to-cyan-500',
      'from-green-400 to-emerald-500',
      'from-sky-300 to-blue-400',
      'from-amber-400 to-orange-500',
      'from-yellow-400 to-amber-500'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <BookOpen className="w-10 h-10 md:w-14 md:h-14 text-blue-500" />
              Read With Me
            </h1>
            <p className="text-lg md:text-xl text-gray-600">Choose a story to read aloud!</p>
          </div>
          <button
            onClick={onOpenSettings}
            className="p-3 md:p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
            aria-label="Settings"
          >
            <Settings className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme, index) => (
            <div
              key={theme.id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className={`h-48 bg-gradient-to-br ${getThemeGradient(index)} p-6 flex items-center justify-center`}>
                <div className="text-center text-white">
                  <h2 className="text-3xl font-bold mb-2">{theme.title}</h2>
                  <p className="text-sm opacity-90">{theme.description}</p>
                </div>
              </div>

              <div className="p-6 space-y-3">
                {theme.levels.map((bookLevel) => {
                  const unlocked = isLevelUnlocked(theme.id, bookLevel.level);
                  const completed = progress.completedBooks.includes(bookLevel.id);

                  return (
                    <button
                      key={bookLevel.id}
                      onClick={() => unlocked && onSelectBook(theme.id, bookLevel.level)}
                      disabled={!unlocked}
                      className={`w-full p-4 rounded-2xl font-semibold text-lg transition-all ${
                        unlocked
                          ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white hover:scale-105 hover:shadow-lg cursor-pointer'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      } ${completed ? 'ring-4 ring-yellow-400' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>Level {bookLevel.level}</span>
                        {!unlocked && <span className="text-sm">🔒</span>}
                        {completed && <span className="text-sm">⭐</span>}
                      </div>
                      <div className="text-xs mt-1 opacity-90">{getLevelLabel(bookLevel.level)}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center bg-white rounded-2xl p-6 shadow-lg">
          <p className="text-lg text-gray-700">
            <span className="font-bold text-blue-600">{progress.totalPagesRead}</span> pages read!
          </p>
          <p className="text-sm text-gray-500 mt-2">Keep reading to unlock more stories</p>
        </div>
      </div>
    </div>
  );
};
