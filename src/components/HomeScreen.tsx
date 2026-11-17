import React, { useState } from 'react';
import { HomeSkyBackground } from './HomeSkyBackground';
import { Mascot } from './Mascot';
import { Play, Map, Settings, Star } from 'lucide-react';
import { sounds } from '../utils/audio';
import { SettingsModal } from './SettingsModal';
import logoImg from '../assets/balloon-blast/logo_balloon_blast.png';

interface HomeScreenProps {
  unlockedLevel: number;
  totalStars: number;
  onPlay: () => void;
  onOpenMap: () => void;
  onResetProgress: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  unlockedLevel,
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
    <div className="relative w-full h-full min-h-[100dvh] flex flex-col justify-between items-center p-4 md:p-6 overflow-hidden select-none">
      <HomeSkyBackground showAmbientBalloons={true} />

      {/* Top Bar with Star Counter & Settings (Fix 1: Volume button removed) */}
      <header className="relative z-20 w-full max-w-2xl flex items-center justify-between pt-1">
        {/* Star Counter Pill */}
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-md border-2 border-amber-300">
          <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
          <span className="font-extrabold text-amber-900 text-sm md:text-base font-game">
            {totalStars} Stars
          </span>
        </div>

        {/* Settings Gear Button (Only button on top right) */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          aria-label="Settings"
          className="p-3 bg-white/90 hover:bg-white rounded-full shadow-md border-2 border-sky-300 text-sky-600 transition-transform active:scale-90"
        >
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Hero Section: Centered Logo & Mascot (Fix 7b & Fix 8) */}
      <main className="relative z-20 flex flex-col items-center justify-center my-auto w-full max-w-lg text-center px-2 py-1">
        {/* Responsive Enlarged Logo (Fix 8) */}
        <div
          style={{ width: 'clamp(240px, 46vw, 440px)', aspectRatio: '1024 / 506' }}
          className="max-w-full mb-1 transform hover:scale-105 transition-transform duration-300 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)] flex justify-center items-center"
        >
          <img
            src={logoImg}
            alt="Balloon Blast"
            className="w-full h-full object-contain animate-bounce-slow"
          />
        </div>

        {/* Subtitle Badge (Clear vertical spacing to prevent overlap) */}
        <div className="inline-block bg-white/95 backdrop-blur-sm px-4 py-1 sm:px-5 sm:py-1.5 rounded-full shadow-md border-2 border-amber-300 mb-2 sm:mb-3">
          <span className="text-xs md:text-sm font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-amber-600 to-sky-600 uppercase font-game">
            Kids Sky Arcade Math • 100 Levels
          </span>
        </div>

        {/* Mascot Center Stage with dedicated clearance for speech bubble (Fix 7b) */}
        <div className="relative my-1.5 sm:my-2.5 flex justify-center">
          <Mascot state="idle" speechBubble="Ready to blast some balloons?" />
        </div>

        {/* Primary Action Buttons */}
        <div className="w-full flex flex-col items-center gap-2.5 sm:gap-3.5 px-4 mt-1 sm:mt-2">
          {/* Big Bouncy PLAY Button */}
          <button
            onClick={handleStartPlay}
            className="w-full max-w-xs group relative bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-500 text-white font-black text-2xl md:text-3xl py-4 px-8 rounded-3xl shadow-[0_10px_25px_rgba(245,158,11,0.5)] border-b-6 border-amber-600 active:border-b-2 active:translate-y-1 transition-all flex items-center justify-center gap-3"
          >
            <Play className="w-8 h-8 fill-white transform group-hover:scale-110 transition-transform" />
            <span className="tracking-wider drop-shadow-md font-game">
              {unlockedLevel === 1 ? 'PLAY' : `LEVEL ${unlockedLevel}`}
            </span>
          </button>

          {/* 100-Level Sky Map Button */}
          <button
            onClick={handleOpenMap}
            className="w-full max-w-xs bg-white/90 hover:bg-white text-sky-700 font-extrabold text-base md:text-lg py-3 px-6 rounded-2xl shadow-md border-2 border-sky-300 hover:border-sky-400 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Map className="w-5 h-5 text-sky-500" />
            <span className="font-game">100-Level Sky Map</span>
          </button>
        </div>
      </main>

      {/* Footer Info (Fix 4: No Age labels) */}
      <footer className="relative z-20 pb-2 text-center text-xs font-bold text-white drop-shadow">
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
