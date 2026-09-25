import { execFileSync } from 'node:child_process';
import { getDailyPuzzle, getPuzzle } from '../src/data/words';
import {
  EPOCH_DATE,
  assertPuzzleAvailable,
  dateToPuzzleNumber,
  getCurrentPuzzleNumber,
  isPuzzleAvailable,
  puzzleNumberToDate,
  toGameDate,
} from '../src/lib/gameDate';

/**
 * بررسی مبنای زمانیِ بازی.
 *
 *   npm run test:dates
 *
 * وقتی با متغیر `VB_TZ_PROBE` اجرا شود، فقط شماره‌ی پازلِ یک لحظه‌ی ثابت را
 * چاپ می‌کند؛ از همین برای مقایسه‌ی مناطق زمانی مختلف استفاده می‌شود.
 */
const PROBE_INSTANT = '2026-09-27T20:30:00Z';

if (process.env['VB_TZ_PROBE']) {
  const probe = getDailyPuzzle(new Date(PROBE_INSTANT));
  process.stdout.write(`${getCurrentPuzzleNumber(new Date(PROBE_INSTANT))}|${probe.solution}`);
  process.exit(0);
}

let fails = 0;
const eq = (name: string, a: unknown, b: unknown) => {
  const ok = JSON.stringify(a) === JSON.stringify(b);
  if (!ok) { fails++; console.log('FAIL', name, JSON.stringify(a), '!=', JSON.stringify(b)); }
  else console.log('ok  ', name);
};
const throws = (name: string, fn: () => unknown) => {
  try { fn(); fails++; console.log('FAIL', name, '— خطا نداد'); }
  catch { console.log('ok  ', name); }
};

// مبنا
eq('روز مبنا ۱ جولای ۲۰۲۶', EPOCH_DATE, '2026-07-01');
eq('مبنا = پازل ۱', dateToPuzzleNumber('2026-07-01'), 1);
eq('روز بعد = پازل ۲', dateToPuzzleNumber('2026-07-02'), 2);
eq('۲۰ سپتامبر = پازل ۸۲', dateToPuzzleNumber('2026-09-20'), 82);
eq('۲۷ سپتامبر = پازل ۸۹', dateToPuzzleNumber('2026-09-27'), 89);

// رفت‌وبرگشت شماره ↔ تاریخ
eq('پازل ۱ → تاریخ مبنا', puzzleNumberToDate(1), '2026-07-01');
eq('پازل ۸۹ → ۲۷ سپتامبر', puzzleNumberToDate(89), '2026-09-27');
const roundTrip = Array.from({ length: 400 }, (_, i) => i + 1)
  .filter((n) => dateToPuzzleNumber(puzzleNumberToDate(n)) !== n);
eq('رفت‌وبرگشت ۴۰۰ پازل', roundTrip, []);
eq('عبور از مرز ماه', puzzleNumberToDate(32), '2026-08-01');
eq('عبور از مرز سال', puzzleNumberToDate(185), '2027-01-01');

// پایداری
const a = getPuzzle(50, new Date('2026-09-27T00:00:00Z'));
const b = getPuzzle(50, new Date('2026-12-31T23:59:00Z'));
eq('پازل ۵۰ همیشه یک کلمه', a.solution, b.solution);
eq('پازل ۵۰ همیشه یک تاریخ', a.date, b.date);
eq('کلمه‌های متوالی متفاوت', getPuzzle(50).solution !== getPuzzle(51).solution, true);

// مرزها
eq('پازل ۱ معتبر', isPuzzleAvailable(1), true);
eq('پازل امروز معتبر', isPuzzleAvailable(getCurrentPuzzleNumber()), true);
eq('پازل فردا نامعتبر', isPuzzleAvailable(getCurrentPuzzleNumber() + 1), false);
eq('پازل ۰ نامعتبر', isPuzzleAvailable(0), false);
eq('پازل منفی نامعتبر', isPuzzleAvailable(-5), false);
eq('پازل کسری نامعتبر', isPuzzleAvailable(1.5), false);
throws('getPuzzle(0) خطا می‌دهد', () => getPuzzle(0));
throws('getPuzzle(فردا) خطا می‌دهد', () => getPuzzle(getCurrentPuzzleNumber() + 1));
throws('تاریخ بدشکل خطا می‌دهد', () => dateToPuzzleNumber('2026/07/01'));
throws('شماره‌ی کسری خطا می‌دهد', () => puzzleNumberToDate(2.5));
throws('assert روی ۰ خطا می‌دهد', () => assertPuzzleAvailable(0));

// نیمه‌شب تهران: لحظه‌ی دقیق تغییر روز
const justBefore = new Date('2026-09-27T20:29:59Z'); // 23:59:59 تهران
const justAfter = new Date('2026-09-27T20:30:00Z'); // 00:00:00 تهران
eq('یک ثانیه قبل از نیمه‌شب تهران', toGameDate(justBefore), '2026-09-27');
eq('دقیقاً نیمه‌شب تهران', toGameDate(justAfter), '2026-09-28');
eq('شماره‌ی پازل هم عوض می‌شود',
  [getCurrentPuzzleNumber(justBefore), getCurrentPuzzleNumber(justAfter)], [89, 90]);

// استقلال از منطقه‌ی زمانیِ دستگاه — هر بار در یک فرایند جدا با TZ متفاوت
const ZONES = [
  'Asia/Tehran',
  'Europe/Berlin',
  'America/Los_Angeles',
  'Pacific/Kiritimati',
  'Pacific/Pago_Pago',
  'UTC',
];
const results = ZONES.map((zone) =>
  execFileSync(process.execPath, ['--import', 'tsx', import.meta.filename], {
    env: { ...process.env, TZ: zone, VB_TZ_PROBE: '1' },
    encoding: 'utf8',
  }),
);
eq(`یک کلمه در ${ZONES.length} منطقه‌ی زمانی`, new Set(results).size, 1);
console.log('     همه:', results[0]);

// پازل امروز در فهرست هست
const today = getDailyPuzzle();
eq('کلمه‌ی امروز پنج‌حرفی', [...today.solution].length, 5);
eq('پازل امروز تاریخ دارد', today.date, toGameDate());

console.log(fails === 0 ? '\nهمه‌ی تست‌ها پاس شد' : `\n${fails} تست شکست خورد`);
process.exit(fails ? 1 : 0);
