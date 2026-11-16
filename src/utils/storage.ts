export interface PlayerProgress {
  unlockedLevel: number;
  levelStars: Record<number, number>; // level -> 1..3 stars
  highestScore: number;
  totalPops: number;
}

const STORAGE_KEY = 'balloon_math_blast_progress';

export function getPlayerProgress(): PlayerProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load progress', e);
  }
  return {
    unlockedLevel: 1,
    levelStars: {},
    highestScore: 0,
    totalPops: 0,
  };
}

export function savePlayerProgress(progress: PlayerProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress', e);
  }
}

export function completeLevelProgress(level: number, starsEarned: number): PlayerProgress {
  const current = getPlayerProgress();
  const nextLevel = Math.max(current.unlockedLevel, Math.min(100, level + 1));
  const previousStars = current.levelStars[level] || 0;
  
  const updated: PlayerProgress = {
    ...current,
    unlockedLevel: nextLevel,
    levelStars: {
      ...current.levelStars,
      [level]: Math.max(previousStars, starsEarned),
    },
    totalPops: current.totalPops + 1,
  };
  savePlayerProgress(updated);
  return updated;
}

export function resetPlayerProgress(): PlayerProgress {
  const fresh: PlayerProgress = {
    unlockedLevel: 1,
    levelStars: {},
    highestScore: 0,
    totalPops: 0,
  };
  savePlayerProgress(fresh);
  return fresh;
}
