import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Mascot } from './Mascot';
import { sounds } from '../utils/audio';
import { Star, Play, Map, RotateCcw } from 'lucide-react';

interface CelebrationModalProps {
  level: number;
  stars: number;
  onNextLevel: () => void;
  onReplay: () => void;
  onGoToMap: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  level,
  stars,
  onNextLevel,
  onReplay,
  onGoToMap,
}) => {
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    sounds.playWin();

    // Trigger full-screen confetti burst
    const end = Date.now() + 1.6 * 1000;
    const colors = ['#FF3366', '#00B4D8', '#06D6A0', '#FFD166', '#9D4EDD', '#FF7A00'];

    function frame() {
      if (!isMountedRef.current) return;

      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end && isMountedRef.current) {
        requestAnimationFrame(frame);
      }
    }

    frame();

    // Staggered star chime sounds
    const starTimers: number[] = [];
    for (let i = 0; i < stars; i++) {
      const timer = window.setTimeout(() => {
        if (isMountedRef.current) {
          sounds.playStar(i);
        }
      }, 350 + i * 300);
      starTimers.push(timer);
    }

    return () => {
      isMountedRef.current = false;
      starTimers.forEach((t) => clearTimeout(t));
      // Fix 6: Clear all active confetti particles immediately on unmount
      try {
        confetti.reset();
      } catch (e) {
        // ignore
      }
    };
  }, [stars]);

  const handleNextLevelClick = () => {
    isMountedRef.current = false;
    try {
      confetti.reset();
    } catch (e) {
      // ignore
    }
    sounds.playClick();
    onNextLevel();
  };

  return (
    <div
      data-testid="celebration-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md select-none animate-fade-in"
    >
      <div className="bg-gradient-to-b from-white via-sky-50 to-blue-50 rounded-3xl max-w-sm md:max-w-md w-full p-6 text-center shadow-2xl border-4 border-amber-300 relative overflow-hidden transform animate-scale-up flex flex-col items-center">
        {/* Sunburst background glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Header Banner */}
        <div className="relative mb-3 w-full">
          <span className="text-3xl md:text-4xl font-black text-amber-500 tracking-wider drop-shadow-md uppercase font-game block">
            LEVEL {level} CLEAR!
          </span>
          <p className="text-slate-600 font-extrabold text-sm mt-1">
            {stars === 3 ? '🌟 Outstanding! Perfect Pop!' : stars === 2 ? '⭐ Fantastic Work!' : '✨ Good Job!'}
          </p>
        </div>

        {/* 2. Structured 3-Star Row (Fix 7a: dedicated row with zero overlap) */}
        <div
          data-testid="star-row"
          className="flex items-center justify-center gap-3 my-3 w-full py-1 z-10"
        >
          {[1, 2, 3].map((starIdx) => {
            const isEarned = starIdx <= stars;
            return (
              <div
                key={starIdx}
                data-testid={`star-${starIdx}`}
                className={`relative transform transition-all duration-500 ${
                  isEarned
                    ? 'scale-110 drop-shadow-[0_6px_12px_rgba(245,158,11,0.6)] animate-bounce-slow'
                    : 'scale-90 opacity-40 grayscale'
                }`}
                style={{
                  animationDelay: `${starIdx * 0.15}s`,
                }}
              >
                <div className={`p-2 rounded-full ${isEarned ? 'bg-amber-100 border-2 border-amber-300' : 'bg-slate-200'}`}>
                  <Star
                    className={`w-9 h-9 md:w-11 md:h-11 ${
                      isEarned ? 'text-amber-400 fill-amber-400' : 'text-slate-400 fill-slate-300'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Mascot Avatar (Cleanly below stars with explicit margin & no speech bubble overlap) */}
        <div
          data-testid="celebration-avatar"
          className="my-3 flex justify-center w-full z-10"
        >
          <div className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center">
            <Mascot state="happy" />
          </div>
        </div>

        {/* 4. Action Buttons (Fix 6: Destroys overlay and advances cleanly) */}
        <div className="flex flex-col gap-3 mt-3 w-full z-10">
          {level < 100 ? (
            <button
              data-testid="next-level-btn"
              onClick={handleNextLevelClick}
              className="w-full bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 hover:brightness-105 text-white font-black text-xl py-3.5 px-6 rounded-2xl shadow-xl transform active:scale-95 transition-all flex items-center justify-center gap-3 border-b-4 border-green-700 animate-pulse-slow"
            >
              <span>Next Level</span>
              <Play className="w-6 h-6 fill-white" />
            </button>
          ) : (
            <div className="bg-amber-100 text-amber-800 font-extrabold p-3 rounded-2xl border-2 border-amber-300 text-center">
              🎉 Congratulations! You have conquered all 100 Levels! 🎉
            </div>
          )}

          <div className="flex gap-2 w-full">
            <button
              onClick={() => {
                isMountedRef.current = false;
                try {
                  confetti.reset();
                } catch (e) {}
                sounds.playClick();
                onReplay();
              }}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 px-3 rounded-2xl shadow border-2 border-slate-200 flex items-center justify-center gap-1.5 active:scale-95 text-sm font-game"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Replay</span>
            </button>
            <button
              onClick={() => {
                isMountedRef.current = false;
                try {
                  confetti.reset();
                } catch (e) {}
                sounds.playClick();
                onGoToMap();
              }}
              className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-3 rounded-2xl shadow border-b-2 border-sky-700 flex items-center justify-center gap-1.5 active:scale-95 text-sm font-game"
            >
              <Map className="w-4 h-4" />
              <span>Sky Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
