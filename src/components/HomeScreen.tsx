import React, { useState } from 'react';
import { HomeSkyBackground } from './HomeSkyBackground';
import { Mascot } from './Mascot';
import { Play, Map, Settings, Star } from 'lucide-react';
import { sounds } from '../utils/audio';
import { SettingsModal } from './SettingsModal';
import { BalloonBlastLogo } from './BalloonBlastLogo';

interface HomeScreenProps {
  unlockedLevel: number;
  totalStars: number;
  onPlay: () => void;
  onOpenMap: () => void;
  onResetProgress: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  unlockedLevel: _unlockedLevel,
  totalStars,
  onPlay,
  onOpenMap,
  onResetProgress,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(sounds.isSoundEnabled);
  const [isMusicEnabled, setIsMusicEnabled] = useState(sounds.isMusicEnabled);

  const handleToggleSound = () => {
    const next = sounds.toggleSound();
    setIsSoundEnabled(next);
  };

  const handleToggleMusic = () => {
    const next = sounds.toggleMusic();
    setIsMusicEnabled(next);
  };

  const handleStartPlay = () => {
    sounds.playClick();
    sounds.startMusic();
    onPlay();
  };

  const handleOpenMap = () => {
    sounds.playClick();
    sounds.startMusic();
    onOpenMap();
  };

  return (
    <div className="relative w-full h-full min-h-[100dvh] flex flex-col justify-between items-center px-4 py-2 sm:py-3 md:py-4 overflow-hidden select-none">
      <HomeSkyBackground showAmbientBalloons={true} />

      {/* Top Bar with Star Counter & Settings (Fix 1: Volume button removed) */}
      <header className="relative z-20 w-full max-w-2xl flex items-center justify-between pt-0.5 sm:pt-1">
        {/* Star Counter Pill */}
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-md border-2 border-amber-300">
          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-400" />
          <span className="font-extrabold text-amber-900 text-xs sm:text-sm md:text-base font-game">
            {totalStars} Stars
          </span>
        </div>

        {/* Settings Gear Button (Only button on top right) */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          aria-label="Settings"
          className="p-2.5 sm:p-3 bg-white/90 hover:bg-white rounded-full shadow-md border-2 border-sky-300 text-sky-600 transition-transform active:scale-90"
        >
          <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </header>

      {/* Hero Section: Centered Pure-Code Logo & Mascot (Fix 7b & Fix 8) */}
      <main className="relative z-20 flex flex-col items-center justify-center my-auto w-full max-w-lg text-center px-2 py-0.5 sm:py-1">
        {/* Agent 1: Pure-Code Vector BALLOON BLAST Logo (Zero external PNG dependency) */}
        <BalloonBlastLogo className="mb-0.5 sm:mb-1 animate-bounce-slow transform hover:scale-105 transition-transform" />

        {/* Subtitle Badge (Clear vertical spacing to prevent overlap) */}
        <div className="inline-block bg-white/95 backdrop-blur-sm px-4 py-1 sm:px-5 sm:py-1.5 rounded-full shadow-md border-2 border-amber-300 mb-2 sm:mb-3">
          <span className="text-[11px] sm:text-xs md:text-sm font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-amber-600 to-sky-600 uppercase font-game">
            Kids Sky Arcade Math • 100 Levels
          </span>
        </div>

        {/* Mascot Center Stage with dedicated clearance for speech bubble (Fix 7b) */}
        <div className="relative my-1 sm:my-2 flex justify-center">
          <Mascot state="idle" speechBubble="Ready to blast some balloons?" />
        </div>

        {/* Primary Action Buttons */}
        <div className="w-full flex flex-col items-center gap-2.5 sm:gap-3 px-4 mt-1 sm:mt-1.5">
          {/* Big Bouncy PLAY Button (Agent 4 Task 3: Button text is 'Play') */}
          <button
            onClick={handleStartPlay}
            className="w-full max-w-xs group relative bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-500 text-white font-black text-2xl sm:text-3xl py-3.5 sm:py-4 px-8 rounded-3xl shadow-[0_10px_25px_rgba(245,158,11,0.5)] border-b-6 border-amber-600 active:border-b-2 active:translate-y-1 transition-all flex items-center justify-center gap-3"
          >
            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white transform group-hover:scale-110 transition-transform" />
            <span className="tracking-wider drop-shadow-md font-game">
              Play
            </span>
          </button>

          {/* 100-Level Sky Map Button */}
          <button
            onClick={handleOpenMap}
            className="w-full max-w-xs bg-white/90 hover:bg-white text-sky-700 font-extrabold text-sm sm:text-base md:text-lg py-2.5 sm:py-3 px-6 rounded-2xl shadow-md border-2 border-sky-300 hover:border-sky-400 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Map className="w-5 h-5 text-sky-500" />
            <span className="font-game">100-Level Sky Map</span>
          </button>
        </div>
      </main>

      {/* Footer Info (Fix 4: No Age labels) */}
      <footer className="relative z-20 pb-1 sm:pb-2 text-center text-[10px] sm:text-xs font-bold text-white drop-shadow">
        <span>100-Level Math Recognition Arcade</span>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetProgress={onResetProgress}
        isSoundEnabled={isSoundEnabled}
        isMusicEnabled={isMusicEnabled}
        onToggleSound={handleToggleSound}
        onToggleMusic={handleToggleMusic}
      />
    </div>
  );
};
