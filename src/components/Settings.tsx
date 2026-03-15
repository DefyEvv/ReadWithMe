import { AppSettings, ReadingProgress } from '../types';
import { X, RotateCcw, Mic, Volume2, Eye } from 'lucide-react';

interface SettingsProps {
  settings: AppSettings;
  progress: ReadingProgress;
  onUpdateSettings: (settings: AppSettings) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const Settings = ({ settings, progress, onUpdateSettings, onResetProgress, onClose }: SettingsProps) => {
  const handleToggle = (key: keyof AppSettings) => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      onResetProgress();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Parent Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
            aria-label="Close settings"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Reading Features</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mic className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Auto-Listening</p>
                    <p className="text-sm text-gray-600">Start listening when page loads</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('autoListening')}
                  className={`w-14 h-8 rounded-full transition-all ${
                    settings.autoListening ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                      settings.autoListening ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Show Incorrect Words</p>
                    <p className="text-sm text-gray-600">Highlight mistakes in red</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('showIncorrectWords')}
                  className={`w-14 h-8 rounded-full transition-all ${
                    settings.showIncorrectWords ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                      settings.showIncorrectWords ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Sound Effects</p>
                    <p className="text-sm text-gray-600">Enable text-to-speech</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('soundEnabled')}
                  className={`w-14 h-8 rounded-full transition-all ${
                    settings.soundEnabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                      settings.soundEnabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Progress</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-700">Total Pages Read:</span>
                <span className="font-bold text-purple-600">{progress.totalPagesRead}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Books Completed:</span>
                <span className="font-bold text-purple-600">{progress.completedBooks.length}</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-red-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 font-semibold"
            >
              <RotateCcw className="w-5 h-5" />
              Reset All Progress
            </button>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">About</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Read With Me helps early readers practice reading phonics-based books aloud.
              The app uses speech recognition to track progress word by word, providing
              gentle encouragement and support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
