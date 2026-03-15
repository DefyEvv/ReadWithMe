import { AppSettings, ReadingProgress } from '../types';
import { X, RotateCcw, Volume2, HandHelping, Lightbulb, Mic } from 'lucide-react';

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
            <h3 className="text-xl font-bold text-gray-800 mb-4">Reading Mode</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <HandHelping className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Parent Assist Mode</p>
                    <p className="text-sm text-gray-600">Tap words to mark them complete</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('parentAssistMode')}
                  className={`w-14 h-8 rounded-full transition-all ${
                    settings.parentAssistMode ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                      settings.parentAssistMode ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Show Word Hints</p>
                    <p className="text-sm text-gray-600">Display visual hints for words</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('showWordHints')}
                  className={`w-14 h-8 rounded-full transition-all ${
                    settings.showWordHints ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                      settings.showWordHints ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Sound Enabled</p>
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

          <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Mic className="w-5 h-5 text-orange-600" />
              Experimental Features
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-semibold text-gray-800">Voice Recognition Mode</p>
                    <p className="text-sm text-gray-600">Use microphone to track reading (may be unstable)</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('experimentalVoiceMode')}
                  className={`w-14 h-8 rounded-full transition-all ${
                    settings.experimentalVoiceMode ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                      settings.experimentalVoiceMode ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {settings.experimentalVoiceMode && (
                <div className="bg-orange-100 border border-orange-300 rounded-xl p-3">
                  <p className="text-xs text-orange-800 font-semibold">
                    Voice mode is experimental and may not work reliably across all browsers and devices.
                  </p>
                </div>
              )}
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
              Read With Me helps early readers practice phonics-based books. Children can tap words
              to hear them pronounced, read at their own pace, and build confidence. Parent Assist
              mode lets you tap words to mark them complete as your child reads aloud to you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
