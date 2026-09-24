import type { Settings, Stats } from '../types';

const PREFIX = 'vajebazi:';

export const KEYS = {
  settings: 'settings',
  stats: 'stats',
  game: 'game',
} as const;

export type StorageKey = (typeof KEYS)[keyof typeof KEYS];

/**
 * خواندن یک مقدار از localStorage — در صورت خطا مقدار پیش‌فرض.
 *
 * محتوای localStorage از بیرون می‌آید و ممکن است هر شکلی داشته باشد، پس نتیجه‌ی
 * `JSON.parse` با assertion به `T` تبدیل می‌شود. اعتبارسنجیِ واقعیِ ساختار در
 * تسک ۴ (بازطراحی لایه‌ی ذخیره‌سازی) اضافه می‌شود.
 */
export function readStore<T>(key: StorageKey, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** نوشتن یک مقدار در localStorage — خطاها نادیده گرفته می‌شوند. */
export function writeStore(key: StorageKey, value: unknown): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* حالت خصوصی مرورگر یا پر بودن فضا */
  }
}

/** حذف یک کلید. */
export function removeStore(key: StorageKey): void {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* بی‌اهمیت */
  }
}

export const defaultSettings: Settings = {
  theme: 'light',
  hardMode: false,
  colorBlind: false,
};

export const defaultStats: Stats = {
  played: 0,
  wins: 0,
  streak: 0,
  maxStreak: 0,
  dist: [0, 0, 0, 0, 0, 0],
};

interface GameResult {
  won: boolean;
  /** شماره‌ی تلاشی که بازی با آن تمام شد. */
  attempts: number;
  /** تعداد کل ردیف‌های بازی. */
  rows: number;
}

/** آمار را با نتیجه‌ی یک بازیِ تمام‌شده به‌روز می‌کند. */
export function applyResult(stats: Stats, { won, attempts, rows }: GameResult): Stats {
  const dist = Array.from({ length: rows }, (_, i) => stats.dist[i] ?? 0);
  const index = attempts - 1;
  if (won && index >= 0 && index < dist.length) {
    dist[index] = (dist[index] ?? 0) + 1;
  }
  const streak = won ? stats.streak + 1 : 0;
  return {
    played: stats.played + 1,
    wins: stats.wins + (won ? 1 : 0),
    streak,
    maxStreak: Math.max(stats.maxStreak, streak),
    dist,
  };
}
