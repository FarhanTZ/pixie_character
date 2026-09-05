import { generate } from 'random-words';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  label: string;
  badgeColor: string;
  minLen: number;
  maxLen: number;
  baseSpeed: number;
  spawnIntervalMs: number;
  scoreMultiplier: number;
  targetWords: number;
  damagePerMiss: number;
}

export const DIFFICULTY_SETTINGS: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    label: 'EASY',
    badgeColor: 'from-emerald-500 to-teal-400 text-emerald-950 border-emerald-300',
    minLen: 3,
    maxLen: 5,
    baseSpeed: 0.17,
    spawnIntervalMs: 2200,
    scoreMultiplier: 1.0,
    targetWords: 25,
    damagePerMiss: 8,
  },
  medium: {
    label: 'MEDIUM',
    badgeColor: 'from-amber-500 to-yellow-400 text-amber-950 border-amber-300',
    minLen: 5,
    maxLen: 8,
    baseSpeed: 0.24,
    spawnIntervalMs: 1750,
    scoreMultiplier: 1.5,
    targetWords: 35,
    damagePerMiss: 12,
  },
  hard: {
    label: 'HARD',
    badgeColor: 'from-rose-500 to-red-400 text-rose-950 border-rose-300',
    minLen: 7,
    maxLen: 12,
    baseSpeed: 0.32,
    spawnIntervalMs: 1350,
    scoreMultiplier: 2.2,
    targetWords: 50,
    damagePerMiss: 16,
  },
};

/**
 * Generates 100% dynamic English vocabulary word from library based on length.
 * @param minLength Min word length
 * @param maxLength Max word length
 */
export const getRandomBattleWord = (
  minLength = 3,
  maxLength = 8
): string => {
  try {
    const res = generate({
      minLength,
      maxLength,
      exactly: 1,
    });
    const word = Array.isArray(res) ? res[0] : res;
    return String(word).toUpperCase();
  } catch {
    // Basic fallback English words if library encounters issues
    const fallbackList = [
      'WATER', 'PLANET', 'ENERGY', 'FUTURE', 'CASTLE', 'FOREST',
      'BRIDGE', 'SILVER', 'SHADOW', 'WIZARD', 'JOURNEY', 'CRYSTAL',
      'DRAGON', 'NIGHT', 'FLOWER', 'SPRING', 'WINDOW', 'GARDEN'
    ];
    return fallbackList[Math.floor(Math.random() * fallbackList.length)].toUpperCase();
  }
};

