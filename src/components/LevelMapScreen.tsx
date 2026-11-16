import React, { useEffect, useRef, useMemo } from 'react';
import { HomeSkyBackground } from './HomeSkyBackground';
import { ArrowLeft, Lock, Star, Play, Compass } from 'lucide-react';
import { LEVELS, LevelData } from '../data/levels';
import { sounds } from '../utils/audio';
import { Mascot } from './Mascot';

interface LevelMapScreenProps {
  unlockedLevel: number;
  levelStars: Record<number, number>;
  onSelectLevel: (level: number) => void;
  onBackToHome: () => void;
}

export const LevelMapScreen: React.FC<LevelMapScreenProps> = ({
  unlockedLevel,
  levelStars,
  onSelectLevel,
  onBackToHome,
}) => {
  const currentLevelRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Candy Crush-style progression: Level 1 at bottom, Level 100 at top
  const bottomToTopLevels = useMemo(() => {
    return [...LEVELS].reverse();
  }, []);

  // Auto-scroll smoothly to the player's current unlocked level on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentLevelRef.current) {
        currentLevelRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [unlockedLevel]);

  const handleLevelClick = (lvlNum: number) => {
    if (lvlNum <= unlockedLevel) {
      sounds.playClick();
      onSelectLevel(lvlNum);
    } else {
      sounds.playDeflate();
    }
  };

  const scrollToCurrent = () => {
    sounds.playClick();
    currentLevelRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] min-h-[100dvh] flex flex-col overflow-hidden select-none bg-sky-300">
      <HomeSkyBackground showAmbientBalloons={false} />

      {/* Fix 3: Sticky Top AppBar permanently visible on all mobile browsers */}
      <header
        data-testid="map-app-bar"
        className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md px-4 pb-3 shadow-md border-b-2 border-sky-300 flex items-center justify-between"
        style={{
          paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0px))',
        }}
      >
        <button
          data-testid="map-back-btn"
          onClick={() => {
            sounds.playClick();
            onBackToHome();
          }}
          className="p-2.5 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-2xl flex items-center gap-1.5 font-bold text-sm shadow-sm active:scale-95 transition-all min-w-[44px] min-h-[44px] justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-game">Home</span>
        </button>

        <div className="text-center px-2">
          <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-800 font-game tracking-wide">
            100-Level Sky Map
          </h2>
          <span className="text-[11px] sm:text-xs font-extrabold text-sky-700 block">
            Current: Level {unlockedLevel} of 100
          </span>
        </div>

        <button
          onClick={scrollToCurrent}
          className="p-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-2xl flex items-center gap-1.5 font-bold text-sm shadow-sm active:scale-95 transition-all min-w-[44px] min-h-[44px] justify-center"
          title="Jump to current level"
        >
          <Compass className="w-5 h-5 text-amber-600 animate-spin-slow" />
          <span className="hidden sm:inline font-game">Level {unlockedLevel}</span>
        </button>
      </header>

      {/* Fix 2: Bottom-to-Top Winding Candy Crush Sky Path */}
      <main
        ref={scrollContainerRef}
        data-testid="map-scroll-container"
        className="relative z-20 flex-1 overflow-y-auto px-4 py-8 flex flex-col items-center"
      >
        {/* Top Trophy at Level 100 */}
        <div className="text-center mb-6 animate-bounce-slow">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-amber-950 font-black px-6 py-2 rounded-full shadow-lg border-2 border-white text-sm uppercase tracking-wider font-game">
            <span>🏆 Level 100 Summit! 🏆</span>
          </div>
        </div>

        <div className="w-full max-w-md relative flex flex-col items-center">
          {bottomToTopLevels.map((item: LevelData) => {
            const lvlNum = item.level;
            const isUnlocked = lvlNum <= unlockedLevel;
            const isCurrent = lvlNum === unlockedLevel;
            const stars = levelStars[lvlNum] || 0;

            // Winding horizontal offset pattern (-40, -20, 0, 20, 40, ...)
            const waveOffsets = [0, 24, 44, 24, 0, -24, -44, -24];
            const xOffset = waveOffsets[lvlNum % waveOffsets.length];

            // Milestone header before tier start
            const isMilestone = lvlNum % 10 === 0 && lvlNum > 0;

            return (
              <React.Fragment key={lvlNum}>
                {isMilestone && (
                  <div className="w-full my-5 text-center z-10 animate-fade-in">
                    <div className="inline-block bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-600 text-white font-extrabold text-xs px-4 py-1.5 rounded-full shadow-md border-2 border-white/80 uppercase tracking-wider font-game">
                      ⭐ Milestone: {item.category}
                    </div>
                  </div>
                )}

                {/* Level Node Container */}
                <div
                  ref={isCurrent ? currentLevelRef : null}
                  data-level-node={lvlNum}
                  style={{
                    transform: `translateX(${xOffset}px)`,
                  }}
                  className="relative my-3 flex flex-col items-center transition-transform"
                >
                  {/* Mascot Avatar standing on/next to active level node (Fix 2) */}
                  {isCurrent && (
                    <div
                      data-testid="map-avatar"
                      className="absolute -top-16 -right-12 z-30 pointer-events-none transform animate-bounce duration-700"
                    >
                      <div className="relative flex flex-col items-center">
                        <div className="w-16 h-16 transform scale-75">
                          <Mascot state="happy" />
                        </div>
                        <div className="bg-amber-400 text-amber-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow-md border border-white -mt-1 font-game whitespace-nowrap">
                          YOU ARE HERE!
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Level Button */}
                  <button
                    onClick={() => handleLevelClick(lvlNum)}
                    disabled={!isUnlocked}
                    data-level-button={lvlNum}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-orange-500 scale-110 shadow-[0_0_25px_rgba(245,158,11,0.8)] border-4 border-white animate-pulse-slow'
                        : isUnlocked
                        ? 'bg-gradient-to-b from-sky-400 to-blue-600 hover:brightness-110 shadow-lg border-3 border-white'
                        : 'bg-slate-300/80 border-2 border-slate-400/50 shadow opacity-70 cursor-not-allowed'
                    }`}
                  >
                    {isCurrent ? (
                      <div className="flex flex-col items-center justify-center">
                        <Play className="w-7 h-7 text-white fill-white drop-shadow" />
                        <span className="text-[11px] font-black text-amber-950 font-game -mt-0.5">
                          {lvlNum}
                        </span>
                      </div>
                    ) : isUnlocked ? (
                      <span className="text-xl sm:text-2xl font-black text-white font-game drop-shadow-md">
                        {lvlNum}
                      </span>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <Lock className="w-6 h-6 text-slate-500" />
                        <span className="text-[10px] font-bold text-slate-600 -mt-0.5">
                          {lvlNum}
                        </span>
                      </div>
                    )}
                  </button>

                  {/* Stars Earned underneath completed levels */}
                  {isUnlocked && stars > 0 && (
                    <div className="flex items-center gap-0.5 mt-1 bg-white/85 px-2 py-0.5 rounded-full shadow-sm">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${
                            s <= stars
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300 fill-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Level 1 Starting Gate at Bottom */}
        <div className="text-center mt-6 mb-8">
          <div className="inline-flex items-center gap-2 bg-white/90 text-sky-800 font-extrabold px-6 py-2 rounded-full shadow-md border-2 border-sky-300 text-xs uppercase tracking-wider font-game">
            <span>🏁 Level 1: Launch Pad! 🏁</span>
          </div>
        </div>
      </main>
    </div>
  );
};
