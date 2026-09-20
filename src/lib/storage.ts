const PREFIX = 'vajebazi:';

/** خواندن یک مقدار از localStorage — در صورت خطا مقدار پیش‌فرض. */
export function readStore(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/** نوشتن یک مقدار در localStorage — خطاها نادیده گرفته می‌شوند. */
export function writeStore(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* حالت خصوصی مرورگر یا پر بودن فضا */
  }
}

/** حذف یک کلید. */
export function removeStore(key) {
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

export const defaultSettings = {
  theme: 'light',
  hardMode: false,
  colorBlind: false,
};

export const defaultStats = {
  played: 0,
  wins: 0,
  streak: 0,
  maxStreak: 0,
  dist: [0, 0, 0, 0, 0, 0],
};

/** آمار را با نتیجه‌ی یک بازیِ تمام‌شده به‌روز می‌کند. */
export function applyResult(stats, { won, attempts, rows }) {
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
