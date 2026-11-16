import React, { useState, useEffect, useMemo } from 'react';
import { GameplaySkyBackground } from './GameplaySkyBackground';
import { Mascot, MascotState } from './Mascot';
import { Balloon } from './Balloon';
import { ExplanationModal } from './ExplanationModal';
import { CelebrationModal } from './CelebrationModal';
import { LevelData } from '../data/levels';
import { sounds } from '../utils/audio';
import { ArrowLeft, Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface GameScreenProps {
  levelData: LevelData;
  onNextLevel: () => void;
  onReplayLevel: () => void;
  onBackToMap: () => void;
  onLevelComplete: (level: number, starsEarned: number) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  levelData,
  onNextLevel,
  onReplayLevel,
  onBackToMap,
  onLevelComplete,
}) => {
  const [poppedValues, setPoppedValues] = useState<number[]>([]);
  const [attempts, setAttempts] = useState<number>(0);
  const [mascotState, setMascotState] = useState<MascotState>('idle');
  const [speechBubble, setSpeechBubble] = useState<string | undefined>('Which balloon is it?');
  const [isInputCooldown, setIsInputCooldown] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [isShakingBanner, setIsShakingBanner] = useState<boolean>(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(sounds.isSoundEnabled);

  // Reset state when level data changes
  const resetLevelState = () => {
    setPoppedValues([]);
    setAttempts(0);
    setMascotState('idle');
    setSpeechBubble('Which balloon is it?');
    setIsInputCooldown(false);
    setShowExplanation(false);
    setShowCelebration(false);
    setIsShakingBanner(false);
  };

  useEffect(() => {
    resetLevelState();
  }, [levelData.level]);

  // Compute layout positions for the balloons shifted rightwards to leave room for center-left mascot
  const balloonPositions = useMemo(() => {
    const count = levelData.balloonCount;
    if (count === 3) {
      return [
        { x: 34, y: 44, delay: 0, dur: 3.2 },
        { x: 60, y: 36, delay: 0.8, dur: 3.8 },
        { x: 84, y: 46, delay: 1.6, dur: 3.5 },
      ];
    }
    if (count === 4) {
      return [
        { x: 36, y: 34, delay: 0, dur: 3.4 },
        { x: 78, y: 34, delay: 1.1, dur: 3.7 },
        { x: 38, y: 64, delay: 1.8, dur: 3.5 },
        { x: 78, y: 64, delay: 0.6, dur: 3.9 },
      ];
    }
    if (count === 5) {
      return [
        { x: 32, y: 32, delay: 0.2, dur: 3.3 },
        { x: 58, y: 28, delay: 1.4, dur: 3.8 },
        { x: 84, y: 34, delay: 0.7, dur: 3.5 },
        { x: 42, y: 62, delay: 1.9, dur: 3.6 },
        { x: 76, y: 62, delay: 1.0, dur: 4.0 },
      ];
    }
    // 6 balloons
    return [
      { x: 32, y: 30, delay: 0.1, dur: 3.4 },
      { x: 58, y: 26, delay: 1.2, dur: 3.7 },
      { x: 84, y: 30, delay: 0.5, dur: 3.5 },
      { x: 34, y: 58, delay: 1.8, dur: 3.9 },
      { x: 60, y: 62, delay: 0.9, dur: 3.6 },
      { x: 84, y: 58, delay: 1.5, dur: 3.8 },
    ];
  }, [levelData.balloonCount]);

  const handleToggleSound = () => {
    const next = sounds.toggleSound();
    setIsSoundEnabled(next);
  };

  const handleBalloonPop = (val: number) => {
    if (isInputCooldown || poppedValues.includes(val) || showCelebration) return;

    if (val === levelData.answer) {
      // CORRECT ANSWER!
      sounds.playPop();
      setPoppedValues((prev) => [...prev, val]);
      setMascotState('happy');
      setSpeechBubble('🎉 Awesome job!');

      const currentAttempts = attempts;
      const earnedStars = currentAttempts === 0 ? 3 : currentAttempts === 1 ? 2 : 1;

      onLevelComplete(levelData.level, earnedStars);

      setTimeout(() => {
        setShowCelebration(true);
      }, 650);
    } else {
      // WRONG ANSWER
      sounds.playDeflate();
      setPoppedValues((prev) => [...prev, val]);
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);

      setIsInputCooldown(true);
      setTimeout(() => setIsInputCooldown(false), 300);

      setIsShakingBanner(true);
      setTimeout(() => setIsShakingBanner(false), 450);

      if (nextAttempts === 1) {
        setMascotState('encourage');
        setSpeechBubble('Oops! Try again! 😊');
        setTimeout(() => {
          setMascotState('thinking');
        }, 1800);
      } else {
        setMascotState('thinking');
        setSpeechBubble("Let's look at the clue!");
        setTimeout(() => {
          setShowExplanation(true);
        }, 400);
      }
    }
  };

  const calculatedStars = attempts === 0 ? 3 : attempts === 1 ? 2 : 1;

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] min-h-[100dvh] flex flex-col justify-between overflow-hidden select-none bg-sky-400">
      <GameplaySkyBackground />

      {/* Top Header Bar */}
      <header
        className="relative z-30 w-full px-4 pb-2 flex items-center justify-between"
        style={{
          paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0px))',
        }}
      >
        <button
          onClick={() => {
            sounds.playClick();
            onBackToMap();
          }}
          className="p-2.5 bg-white/90 hover:bg-white text-sky-700 rounded-2xl shadow-md border-2 border-sky-200 flex items-center gap-1.5 active:scale-95 transition-all min-w-[44px] min-h-[44px] justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline font-bold text-sm font-game">Map</span>
        </button>

        {/* Level Badge */}
        <div className="bg-white/95 backdrop-blur-md px-5 py-1.5 rounded-full shadow-md border-2 border-amber-300 text-center">
          <span className="font-black text-amber-900 text-base md:text-lg font-game">
            Level {levelData.level}
          </span>
        </div>

        {/* Retry & Sound Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playClick();
              resetLevelState();
            }}
            aria-label="Restart Level"
            title="Restart Level"
            className="p-2.5 bg-white/90 hover:bg-white rounded-2xl shadow-md border-2 border-sky-200 text-sky-600 active:scale-95 transition-all min-w-[44px] min-h-[44px] justify-center flex items-center"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={handleToggleSound}
            className="p-2.5 bg-white/90 hover:bg-white rounded-2xl shadow-md border-2 border-sky-200 text-sky-600 active:scale-95 transition-all min-w-[44px] min-h-[44px] justify-center"
          >
            {isSoundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>
        </div>
      </header>

      {/* Math Question Banner */}
      <div className="relative z-30 w-full flex items-center justify-center px-4 mt-1 sm:mt-2">
        <div
          className={`relative bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 border-4 sm:border-[5px] border-amber-500 rounded-3xl py-3.5 sm:py-4.5 md:py-5 px-10 sm:px-16 md:px-24 min-w-[280px] sm:min-w-[380px] md:min-w-[440px] text-center shadow-[0_12px_28px_rgba(217,119,6,0.38)] transition-transform ${
            isShakingBanner ? 'animate-[shake_0.45s_ease-in-out]' : ''
          }`}
        >
          <div className="flex items-center justify-center">
            <span className="text-4xl sm:text-5xl md:text-6xl font-black text-amber-950 tracking-wider font-game drop-shadow-sm">
              {levelData.question}
            </span>
          </div>
        </div>
      </div>

      {/* Mascot Avatar Placed at Centre-Left of Screen */}
      <div
        data-testid="gameplay-mascot"
        className="absolute left-1 sm:left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 pointer-events-auto transform hover:scale-105 transition-transform"
      >
        <div className="relative flex flex-col items-center">
          {/* Reactive Speech Bubble */}
          {speechBubble && (
            <div className="absolute -top-11 left-0 bg-white/95 text-slate-800 text-[10px] sm:text-xs font-bold py-1 px-2.5 rounded-xl shadow-md border-2 border-amber-300 animate-bounce-slow whitespace-nowrap z-40 pointer-events-none">
              {speechBubble}
              <div className="absolute -bottom-1 left-4 w-2 h-2 bg-white border-r-2 border-b-2 border-amber-300 transform rotate-45" />
            </div>
          )}
          <div className="w-18 h-18 sm:w-24 sm:h-24 md:w-28 md:h-28 drop-shadow-xl">
            <Mascot state={mascotState} />
          </div>
        </div>
      </div>

      {/* Floating Buoyant Balloons Arena */}
      <main className="relative flex-1 w-full max-w-3xl mx-auto h-[55vh] z-20 overflow-hidden">
        {levelData.options.map((val, index) => {
          const pos = balloonPositions[index % balloonPositions.length];
          const isPopped = poppedValues.includes(val);

          return (
            <Balloon
              key={`${levelData.level}-${val}-${index}`}
              id={`${levelData.level}-${index}`}
              value={val}
              colorIndex={index}
              xPercent={pos.x}
              yPercent={pos.y}
              floatDelay={pos.delay}
              floatDuration={pos.dur}
              isPopped={isPopped}
              isDisabled={isInputCooldown || showCelebration}
              isCorrect={val === levelData.answer}
              onPop={handleBalloonPop}
            />
          );
        })}
      </main>

      {/* Bottom Footer: Protected from mobile browser address bar interference */}
      <footer
        className="relative z-30 w-full px-4 flex items-center justify-between pointer-events-none"
        style={{
          paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))',
        }}
      >
        <div className="bg-white/85 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-sky-200 shadow-sm pointer-events-auto">
          <span className="text-xs font-bold text-slate-700 font-game">
            🎯 {levelData.category}
          </span>
        </div>

        <div className="bg-white/85 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-amber-200 shadow-sm pointer-events-auto text-amber-800 font-bold text-xs font-game">
          🎈 Pop the right number!
        </div>
      </footer>

      {/* Visual Dot-Grouping Explanation Modal (on 2nd wrong tap) */}
      {showExplanation && (
        <ExplanationModal
          question={levelData.question}
          answer={levelData.answer}
          explanation={levelData.explanation}
          onContinue={() => {
            resetLevelState();
            setSpeechBubble('Now give it another try!');
            setMascotState('idle');
          }}
        />
      )}

      {/* Level Celebration & Auto-Advance Modal */}
      {showCelebration && (
        <CelebrationModal
          level={levelData.level}
          stars={calculatedStars}
          onNextLevel={() => {
            resetLevelState();
            onNextLevel();
          }}
          onReplay={() => {
            resetLevelState();
            onReplayLevel();
          }}
          onGoToMap={() => {
            resetLevelState();
            onBackToMap();
          }}
        />
      )}

      {/* Shake Keyframe definition */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-12px); }
          40% { transform: translateX(12px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
};
