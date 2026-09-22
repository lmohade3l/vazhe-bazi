const PREFIX = 'vajebazi:';

/** خواندن یک مقدار از localStorage — در صورت خطا مقدار پیش‌فرض. */
export function readStore(key: string, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/** نوشتن یک مقدار در localStorage — خطاها نادیده گرفته می‌شوند. */
export function writeStore(key: string, value: string) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* حالت خصوصی مرورگر یا پر بودن فضا */
  }
}

/** حذف یک کلید. */
export function removeStore(key: string) {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* بی‌اهمیت */
  }
}

export const KEYS = {
  settings: 'settings',
  stats: 'stats',
  game: 'game',
};

export type SETTINGS = {
  theme: 'light' | 'dark',
  hardMode: boolean,
  colorBlind: boolean
}

export const defaultSettings = {
  theme: 'light',
  hardMode: false,
  colorBlind: false,
};

export type STATS = {
  played: number,
  wins: number,
  streak: number,
  maxStreak: number,
  dist: number[],

}

export const defaultStats = {
  played: 0,
  wins: 0,
  streak: 0,
  maxStreak: 0,
  dist: [0, 0, 0, 0, 0, 0],
};

export function applyResult(stats: STATS, { won, attempts, rows }: { won: boolean, attempts: number, rows: number }) {
  const dist = Array.from({ length: rows }, (_, i) => stats.dist[i] ?? 0);
  if (won) dist[attempts - 1] += 1;
  const streak = won ? stats.streak + 1 : 0;
  return {
    played: stats.played + 1,
    wins: stats.wins + (won ? 1 : 0),
    streak,
    maxStreak: Math.max(stats.maxStreak, streak),
    dist,
  };
}
