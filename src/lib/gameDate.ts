/**
 * مبنای زمانیِ بازی.
 *
 * روزِ بازی به نیمه‌شبِ تهران قفل است، نه به ساعتِ دستگاه. بنابراین کلمه‌ی روز
 * برای همه‌ی کاربران در یک لحظه یکسان است و جلو/عقب بردنِ ساعت گوشی هم
 * کلمه‌ی فردا را لو نمی‌دهد.
 *
 * همه‌ی حساب‌ها روی «تاریخ تقویمی» انجام می‌شود (نه اختلاف میلی‌ثانیه)، پس
 * تغییرِ ساعت تابستانی هیچ اثری ندارد.
 */

/** منطقه‌ی زمانیِ مرجع. */
export const GAME_TIME_ZONE = 'Asia/Tehran';

/** روزِ پازل شماره‌ی ۱. نباید تغییر کند. */
export const EPOCH_DATE = '2026-07-01';

/** تاریخِ روزِ بازی، به شکل `YYYY-MM-DD`. */
export type GameDate = string;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const formatter = new Intl.DateTimeFormat('en-US', {
  timeZone: GAME_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/**
 * تاریخِ تقویمیِ یک لحظه در تهران.
 *
 * از `formatToParts` استفاده می‌شود تا به ترتیبِ اجزای خروجیِ locale وابسته نباشیم.
 */
export function toGameDate(instant: Date = new Date()): GameDate {
  const parts = formatter.formatToParts(instant);
  const get = (type: Intl.DateTimeFormatPartTypes): string => {
    const part = parts.find((p) => p.type === type);
    if (!part) throw new Error(`جزء «${type}» در قالب‌بندی تاریخ پیدا نشد`);
    return part.value;
  };
  return `${get('year')}-${get('month')}-${get('day')}`;
}

/** شکستن `YYYY-MM-DD` به اجزای عددی. */
function parseGameDate(date: GameDate): { year: number; month: number; day: number } {
  if (!DATE_PATTERN.test(date)) {
    throw new Error(`تاریخ باید به شکل YYYY-MM-DD باشد، نه «${date}»`);
  }
  const [year, month, day] = date.split('-').map(Number) as [number, number, number];
  return { year, month, day };
}

/** تبدیل تاریخ تقویمی به شماره‌ی روز (برای اختلاف‌گیری). */
function toDayIndex(date: GameDate): number {
  const { year, month, day } = parseGameDate(date);
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
}

/** شماره‌ی پازلِ یک تاریخ. روزِ مبنا پازل شماره‌ی ۱ است. */
export function dateToPuzzleNumber(date: GameDate): number {
  return toDayIndex(date) - toDayIndex(EPOCH_DATE) + 1;
}

/** تاریخِ یک شماره‌ی پازل. */
export function puzzleNumberToDate(puzzleNumber: number): GameDate {
  if (!Number.isInteger(puzzleNumber)) {
    throw new Error(`شماره‌ی پازل باید عدد صحیح باشد، نه «${puzzleNumber}»`);
  }
  const ms = (toDayIndex(EPOCH_DATE) + puzzleNumber - 1) * 86400000;
  const at = new Date(ms);
  const year = String(at.getUTCFullYear()).padStart(4, '0');
  const month = String(at.getUTCMonth() + 1).padStart(2, '0');
  const day = String(at.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** شماره‌ی پازلِ امروز. */
export function getCurrentPuzzleNumber(instant: Date = new Date()): number {
  return dateToPuzzleNumber(toGameDate(instant));
}

/**
 * آیا این پازل قابل بازی است؟ پازل‌های قبل از روزِ مبنا و بعد از امروز نه.
 */
export function isPuzzleAvailable(puzzleNumber: number, instant: Date = new Date()): boolean {
  return (
    Number.isInteger(puzzleNumber) &&
    puzzleNumber >= 1 &&
    puzzleNumber <= getCurrentPuzzleNumber(instant)
  );
}

/** مثل `isPuzzleAvailable` ولی در صورت نامعتبر بودن خطا می‌دهد. */
export function assertPuzzleAvailable(puzzleNumber: number, instant: Date = new Date()): void {
  if (!Number.isInteger(puzzleNumber)) {
    throw new Error(`شماره‌ی پازل باید عدد صحیح باشد، نه «${puzzleNumber}»`);
  }
  if (puzzleNumber < 1) {
    throw new Error(`پازل شماره‌ی ${puzzleNumber} وجود ندارد؛ شماره‌ها از ۱ شروع می‌شوند`);
  }
  const today = getCurrentPuzzleNumber(instant);
  if (puzzleNumber > today) {
    throw new Error(`پازل شماره‌ی ${puzzleNumber} هنوز نرسیده؛ آخرین پازل امروز ${today} است`);
  }
}
