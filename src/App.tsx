import React, { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { LevelMapScreen } from './components/LevelMapScreen';
import { GameScreen } from './components/GameScreen';
import { LEVELS } from './data/levels';
import {
  getPlayerProgress,
  completeLevelProgress,
  resetPlayerProgress,
  PlayerProgress,
} from './utils/storage';

export type ScreenState = 'home' | 'map' | 'game';

export const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>('home');
  const [progress, setProgress] = useState<PlayerProgress>(getPlayerProgress());
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [levelSessionKey, setLevelSessionKey] = useState<number>(0);

  // Sync current level with unlockedLevel when loading
  useEffect(() => {
    setCurrentLevel(progress.unlockedLevel);
  }, []);

  const totalStars = Object.values(progress.levelStars).reduce((sum, s) => sum + s, 0);

  const handleStartPlay = () => {
    setCurrentLevel(progress.unlockedLevel);
    setLevelSessionKey((k) => k + 1);
    setScreen('game');
  };

  const handleSelectLevel = (level: number) => {
    setCurrentLevel(level);
    setLevelSessionKey((k) => k + 1);
    setScreen('game');
  };

  const handleNextLevel = () => {
    if (currentLevel < 100) {
      setCurrentLevel((prev) => prev + 1);
      setLevelSessionKey((k) => k + 1);
    } else {
      setScreen('map');
    }
  };

  const handleReplayLevel = () => {
    // Increment session key to completely remount the game screen in pristine initial state
    setLevelSessionKey((k) => k + 1);
  };

  const handleLevelComplete = (level: number, starsEarned: number) => {
    const updated = completeLevelProgress(level, starsEarned);
    setProgress(updated);
  };

  const handleResetProgress = () => {
    const fresh = resetPlayerProgress();
    setProgress(fresh);
    setCurrentLevel(1);
    setScreen('home');
  };

  const currentLevelData = LEVELS.find((l) => l.level === currentLevel) || LEVELS[0];

  return (
    <div className="w-full h-full min-h-screen relative font-game bg-sky-400">
      {screen === 'home' && (
        <HomeScreen
          unlockedLevel={progress.unlockedLevel}
          totalStars={totalStars}
          onPlay={handleStartPlay}
          onOpenMap={() => setScreen('map')}
          onResetProgress={handleResetProgress}
        />
      )}

      {screen === 'map' && (
        <LevelMapScreen
          unlockedLevel={progress.unlockedLevel}
          levelStars={progress.levelStars}
          onSelectLevel={handleSelectLevel}
          onBackToHome={() => setScreen('home')}
        />
      )}

      {screen === 'game' && (
        <GameScreen
          key={`level-${currentLevel}-${levelSessionKey}`}
          levelData={currentLevelData}
          onNextLevel={handleNextLevel}
          onReplayLevel={handleReplayLevel}
          onBackToMap={() => setScreen('map')}
          onLevelComplete={handleLevelComplete}
        />
      )}
    </div>
  );
};

export default App;
