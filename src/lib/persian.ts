import { GAME_TIME_ZONE } from './gameDate';

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/** نگاشت حروفِ هم‌آوا برای مقایسه — فقط در منطق، نه در نمایش. */
const LETTER_MAP: Record<string, string> = {
  آ: 'ا',
  أ: 'ا',
  إ: 'ا',
  ٱ: 'ا',
  ك: 'ک',
  ي: 'ی',
  ئ: 'ی',
  ى: 'ی',
  ۀ: 'ه',
  ة: 'ه',
  ؤ: 'و',
};

/** حذف اعراب و نیم‌فاصله‌ها. */
const DIACRITICS = /[ً-ْٰ‌‏‎]/g;

/**
 * نرمال‌سازی یک رشته‌ی فارسی برای مقایسه.
 * حروف با `[...str]` شکسته می‌شوند تا کاراکترهای چندبایتی سالم بمانند.
 */
export function normalize(text: string): string {
  return [...text.replace(DIACRITICS, '')].map((ch) => LETTER_MAP[ch] ?? ch).join('');
}

/** شکستن یک کلمه به آرایه‌ی حروف. */
export function toLetters(text: string): string[] {
  return [...text];
}

/** تبدیل ارقام لاتین به ارقام فارسی. */
export function toFa(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)] ?? d);
}

/**
 * تاریخ به شمسی و فارسی — مثل «پنجشنبه ۱۰ تیر».
 *
 * به وقت تهران قالب‌بندی می‌شود تا با روزِ بازی بخواند؛ وگرنه کاربرِ یک
 * منطقه‌ی زمانیِ دیگر تاریخی می‌دید که با پازلِ جاری یکی نبود.
 */
export function formatPersianDate(date: Date = new Date()): string {
  try {
    const formatted = new Intl.DateTimeFormat('fa-IR', {
      timeZone: GAME_TIME_ZONE,
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date);
    return toFa(formatted);
  } catch {
    return '';
  }
}
