import React from 'react';
import { Volume2, VolumeX, Music, X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetProgress?: () => void;
  isSoundEnabled: boolean;
  isMusicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isSoundEnabled,
  isMusicEnabled,
  onToggleSound,
  onToggleMusic,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm select-none">
      <div className="bg-white rounded-3xl max-w-xs sm:max-w-sm w-full p-6 shadow-2xl border-4 border-sky-300 relative animate-scale-up">
        <button
          onClick={onClose}
          aria-label="Close Settings"
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2 font-game">
          <span>⚙️ Audio Settings</span>
        </h3>

        {/* Audio Toggles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 bg-sky-50 rounded-2xl border border-sky-100">
            <div className="flex items-center gap-3">
              {isSoundEnabled ? <Volume2 className="w-6 h-6 text-sky-600" /> : <VolumeX className="w-6 h-6 text-slate-400" />}
              <span className="font-bold text-slate-700 font-game">Sound Effects</span>
            </div>
            <button
              onClick={onToggleSound}
              aria-label="Toggle Sound Effects"
              className={`w-14 h-8 rounded-full transition-colors p-1 flex items-center ${
                isSoundEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-white shadow-md" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-sky-50 rounded-2xl border border-sky-100">
            <div className="flex items-center gap-3">
              <Music className={`w-6 h-6 ${isMusicEnabled ? 'text-sky-600' : 'text-slate-400'}`} />
              <span className="font-bold text-slate-700 font-game">Arcade Music</span>
            </div>
            <button
              onClick={onToggleMusic}
              aria-label="Toggle Music"
              className={`w-14 h-8 rounded-full transition-colors p-1 flex items-center ${
                isMusicEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-white shadow-md" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
