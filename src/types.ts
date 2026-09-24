/**
 * تایپ‌های دامنه‌ی واژه‌بازی.
 *
 * هرچیزی که بین چند ماژول مشترک است اینجا تعریف می‌شود تا یک منبعِ حقیقت داشته
 * باشیم. تایپ‌های مخصوصِ یک کامپوننت، کنار خودِ همان کامپوننت می‌مانند.
 */

/** وضعیت یک حرف بعد از ارزیابی حدس. */
export type LetterState = 'correct' | 'present' | 'absent';

/** وضعیت یک بازی. */
export type GameStatus = 'playing' | 'won' | 'lost';

/** وضعیت یک روز در تاریخچه و تقویم. */
export type DayStatus = 'won' | 'lost' | 'in-progress' | 'not-played';

export type Theme = 'light' | 'dark';

export interface Settings {
  theme: Theme;
  hardMode: boolean;
  colorBlind: boolean;
}

/**
 * تغییر یک تنظیم. روی کلید generic است تا تایپ مقدار با تایپ همان کلید بخواند —
 * یعنی `setSetting('hardMode', 'dark')` خطای کامپایل بدهد.
 */
export type SetSetting = <K extends keyof Settings>(name: K, value: Settings[K]) => void;

export interface Stats {
  played: number;
  wins: number;
  streak: number;
  maxStreak: number;
  /** تعداد بردها به‌ازای هر شماره‌ی تلاش؛ اندیس ۰ یعنی برد در تلاش اول. */
  dist: number[];
}

/** یک پازل روزانه. */
export interface Puzzle {
  /** شماره‌ی پازل، از ۱ شروع می‌شود. */
  number: number;
  solution: string;
}

/** بازیِ ذخیره‌شده‌ی یک پازل. */
export interface GameRecord {
  puzzle: number;
  guesses: string[];
  status: GameStatus;
  /** آمارِ این بازی قبلاً ثبت شده یا نه — تا «بازی دوباره» آمار را دوبار نشمارد. */
  scored: boolean;
}

/** پیام کوتاهی که بالای برد نشان داده می‌شود. */
export interface ToastMessage {
  message: string;
  /** برای اینکه هر پیام تازه انیمیشن را از نو اجرا کند. */
  id: number;
}
