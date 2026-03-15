import { AppSettings, ReadingProgress } from '../types';
import { X, RotateCcw, Volume2, FileText } from 'lucide-react';

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
          <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
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
                  <Volume2 className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Sound Enabled</p>
                    <p className="text-sm text-gray-600">Text-to-speech for words and sentences</p>
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

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Show Transcript</p>
                    <p className="text-sm text-gray-600">Display what was heard after reading</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('showTranscript')}
                  className={`w-14 h-8 rounded-full transition-all ${
                    settings.showTranscript ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                      settings.showTranscript ? 'translate-x-7' : 'translate-x-1'
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
            <h3 className="text-xl font-bold text-gray-800 mb-3">How It Works</h3>
            <div className="text-gray-600 text-sm leading-relaxed space-y-2">
              <p><strong>1. Start Reading</strong> - Tap to begin recording</p>
              <p><strong>2. Read Aloud</strong> - Read the sentence on the page</p>
              <p><strong>3. Check My Reading</strong> - Tap to see your progress</p>
              <p><strong>4. Try Again</strong> - Keep reading to complete all words</p>
              <p className="pt-2 border-t border-gray-300 mt-3">
                Tap any word to hear it pronounced. Completed words stay green until you press Reset Page or move to the next page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
