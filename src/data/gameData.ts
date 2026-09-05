import { generate } from 'random-words';

/**
 * Generates 100% dynamic English vocabulary word from library.
 * @param minLength Min word length (default 3)
 * @param maxLength Max word length (default 8)
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

