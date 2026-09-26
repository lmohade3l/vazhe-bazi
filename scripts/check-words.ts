/**
 * درستیِ فهرست‌های کلمه را بررسی می‌کند.
 *
 *   npm run words:check
 *
 * در صورت مشکل با کد خروج ۱ تمام می‌شود، تا در CI یا قبل از انتشار جلوی
 * فهرستِ خراب را بگیرد.
 */
import { answers, remainingRunway, words } from '../src/data/words';
import { seedWords } from '../src/data/seed-words';
import { getCurrentPuzzleNumber } from '../src/lib/gameDate';
import { normalize } from '../src/lib/persian';

/** اگر ذخیره‌ی کلمه‌ی روز از این کمتر شود، خطا می‌دهیم. */
const MIN_RUNWAY_DAYS = 30;

const PERSIAN_LETTERS = /^[ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]+$/u;
const PERSIAN_LETTERS_WITH_ALEF_MAD = /^[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]+$/u;
const ARABIC_LETTERS = /[ةيكئؤأإء]/u;

/**
 * اعراب و نیم‌فاصله را کدنقطه‌به‌کدنقطه می‌سنجد.
 *
 * این‌ها داخل یک character class گذاشته نمی‌شوند، چون علامت‌های ترکیبی در
 * character class گمراه‌کننده‌اند و ESLint هم درست ایراد می‌گیرد.
 */
function hasMarkOrZwnj(word: string): boolean {
  return [...word].some((ch) => {
    const cp = ch.codePointAt(0) ?? 0;
    return (cp >= 0x064b && cp <= 0x065f) || cp === 0x0670 || cp === 0x200c;
  });
}

let failures = 0;

function pass(label: string, detail = ''): void {
  console.log('ok  ', label, detail);
}

function fail(label: string, detail: string): void {
  failures++;
  console.log('FAIL', label, '—', detail);
}

function check(label: string, offenders: string[], sample = 8): void {
  if (offenders.length === 0) pass(label);
  else
    fail(
      label,
      `${offenders.length} مورد: ${offenders.slice(0, sample).join('، ')}${
        offenders.length > sample ? ' …' : ''
      }`,
    );
}

// ---- طول ----
check(
  'همه‌ی حدس‌های معتبر پنج‌حرفی‌اند',
  words.filter((w) => [...w].length !== 5),
);
check(
  'همه‌ی کلمه‌های روز پنج‌حرفی‌اند',
  answers.filter((w) => [...w].length !== 5),
);
check(
  'همه‌ی کلمه‌های بذر پنج‌حرفی‌اند',
  seedWords.filter((w) => [...w].length !== 5),
);

// ---- تکرار ----
const dupWords = words.filter((w, i) => words.indexOf(w) !== i);
check('فهرست حدس‌ها تکراری ندارد', [...new Set(dupWords)]);

const dupAnswers = answers.filter((w, i) => answers.indexOf(w) !== i);
check('فهرست کلمه‌های روز تکراری ندارد', [...new Set(dupAnswers)]);

// دو کلمه‌ی متفاوت که بعد از نرمال‌سازی یکی می‌شوند، در عمل یک کلمه‌اند.
const byNormalized = new Map<string, string[]>();
for (const w of answers) {
  const key = normalize(w);
  byNormalized.set(key, [...(byNormalized.get(key) ?? []), w]);
}
check(
  'هیچ دو کلمه‌ی روزی پس از نرمال‌سازی یکی نمی‌شوند',
  [...byNormalized.values()].filter((g) => g.length > 1).map((g) => g.join('=')),
);

// ---- حروف ----
check(
  'فهرست حدس‌ها حرف عربی یا اعراب ندارد',
  words.filter((w) => ARABIC_LETTERS.test(w) || hasMarkOrZwnj(w) || !PERSIAN_LETTERS.test(w)),
);

// کلمه‌های روز شکل نمایشی دارند، پس «آ» در آن‌ها مجاز است.
check(
  'کلمه‌های روز حرف عربی یا اعراب ندارند',
  answers.filter(
    (w) => ARABIC_LETTERS.test(w) || hasMarkOrZwnj(w) || !PERSIAN_LETTERS_WITH_ALEF_MAD.test(w),
  ),
);

// ---- زیرمجموعه بودن ----
// فهرست تولیدشده نرمال‌شده است ولی کلمه‌های روز شکل نمایشی دارند («آسمان» در
// مقابل «اسمان»)، پس مقایسه باید نرمال‌سازی‌شده باشد.
const validGuesses = new Set(words);
check(
  'هر کلمه‌ی روز یک حدسِ معتبر هم هست',
  answers.filter((a) => !validGuesses.has(normalize(a))),
);
check(
  'هر کلمه‌ی بذر یک حدسِ معتبر هم هست',
  seedWords.filter((s) => !validGuesses.has(normalize(s))),
);

// ---- ذخیره‌ی کلمه‌ی روز ----
const today = getCurrentPuzzleNumber();
const runway = remainingRunway();
if (answers.length < today) {
  fail('فهرست کلمه‌های روز به امروز می‌رسد', `پازل امروز ${today} است ولی فهرست ${answers.length} کلمه دارد`);
} else if (runway < MIN_RUNWAY_DAYS) {
  fail(
    'ذخیره‌ی کافیِ کلمه‌ی روز',
    `فقط ${runway} روز مانده (کمینه ${MIN_RUNWAY_DAYS}) — به answers اضافه کن`,
  );
} else {
  pass('ذخیره‌ی کافیِ کلمه‌ی روز', `${runway} روز`);
}

console.log();
console.log(`حدس‌های معتبر: ${words.length.toLocaleString('en-US')} | کلمه‌های روز: ${answers.length}`);
console.log(failures === 0 ? 'همه‌ی بررسی‌ها پاس شد' : `${failures} بررسی شکست خورد`);
process.exit(failures ? 1 : 0);
