/**
 * فهرست حدس‌های معتبر را از پکیج `an-array-of-persian-words` می‌سازد.
 *
 *   npm run words:build
 *
 * خروجی در `src/data/dictionary.ts` نوشته می‌شود و **در گیت commit می‌شود**، تا
 * بیلدِ برنامه به پکیج وابسته نباشد. پکیج فقط ابزار زمانِ ساخت است: اگر مستقیم
 * در کد برنامه import شود، حدود ۸۲۷ کیلوبایت فشرده به باندل اضافه می‌کند.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import rawWordsSource from 'an-array-of-persian-words';
import { seedWords } from '../src/data/seed-words';
import { normalize } from '../src/lib/persian';

const OUT_FILE = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../src/data/dictionary.ts',
);

/** اعراب و علامت‌های عربی. */
const DIACRITICS = /[ً-ٰٟۖ-ۭ]/u;
const HAMZA = /[ءأإؤئٴ]/u;
const TEH_MARBUTA = /ة/u;
const WHITESPACE = /\s/u;

/**
 * حروف فارسیِ مجاز. `آ` عمداً نیست: `normalize` آن را به `ا` تبدیل می‌کند، پس
 * هیچ‌وقت در خروجیِ نرمال‌شده ظاهر نمی‌شود.
 */
const PERSIAN_LETTERS = /^[ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]+$/u;

function toStringArray(input: unknown): string[] {
  if (Array.isArray(input)) return input.filter((x): x is string => typeof x === 'string');
  throw new Error('فهرست خام خوانده نشد؛ import اسکریپت را بررسی کن.');
}

/**
 * یک کلمه را پاک می‌کند و شکل نرمال‌شده‌اش را برمی‌گرداند، یا `null` اگر به
 * فهرست راه ندارد.
 *
 * کلمه‌های دارای `ة` یا همزه **پیش از** نرمال‌سازی حذف می‌شوند. اگر بعد از آن
 * حذف می‌شدند، `رهدلة` به `رهدله` تبدیل می‌شد و فارسی به‌نظر می‌رسید.
 */
function cleanWord(word: string): string | null {
  const trimmed = word.trim();
  if (!trimmed) return null;
  if (TEH_MARBUTA.test(trimmed) || HAMZA.test(trimmed) || DIACRITICS.test(trimmed)) return null;

  const normalized = normalize(trimmed);
  if (!normalized) return null;
  if (WHITESPACE.test(normalized)) return null;
  if ([...normalized].length !== 5) return null;
  if (!PERSIAN_LETTERS.test(normalized)) return null;

  return normalized;
}

function formatTsFile(words: string[]): string {
  // همه‌ی کلمه‌ها پنج حرفِ تک‌واحدیِ BMP‌اند، پس برش با گام ۵ روی رشته درست است.
  const offenders = words.filter((w) => w.length !== 5);
  if (offenders.length > 0) {
    throw new Error(`کلمه‌هایی با طول UTF-16 غیر از ۵: ${offenders.slice(0, 5).join('، ')}`);
  }

  // به‌هم‌چسبیده ذخیره می‌شود، نه آرایه‌ای از رشته‌ها: گیومه و ویرگول برای
  // ۴۰ هزار کلمه حدود ۱۶۰ کیلوبایت اضافه می‌کردند.
  const packed = words.join('');
  const lines: string[] = [];
  for (let i = 0; i < packed.length; i += 100) {
    lines.push('  ' + JSON.stringify(packed.slice(i, i + 100)) + ',');
  }

  return `// تولیدشده با scripts/build-words.ts — دستی ویرایش نکن.
// برای ساختن دوباره: npm run words:build
//
// کلمه‌ها نرمال‌شده‌اند (با normalize در src/lib/persian.ts)، پس فقط برای
// مقایسه به‌کار می‌روند و هیچ‌وقت به کاربر نمایش داده نمی‌شوند.
//
// همه‌ی کلمه‌ها پنج‌حرفی‌اند و بدون جداکننده پشت سر هم چسبیده‌اند؛
// \`unpackWords\` در words.ts آن‌ها را جدا می‌کند.
//
// رشته تکه‌تکه نوشته شده و در زمان اجرا به‌هم می‌پیوندد: یک زنجیره‌ی طولانی از
// \`+\` درخت نحوی را آن‌قدر تودرتو می‌کرد که پارسر ESLint سرریز می‌شد.

/** تعداد کلمه‌های فهرست. */
export const wordCount = ${words.length};

const chunks: string[] = [
${lines.join('\n')}
];

export const packedWords: string = chunks.join('');
`;
}

function main(): void {
  const raw = toStringArray(rawWordsSource);

  // بذر اول می‌آید تا کلمه‌های دست‌چین‌شده ابتدای فهرست بمانند.
  const fromSeed = seedWords.map(cleanWord).filter((w): w is string => w !== null);
  const fromPackage = raw.map(cleanWord).filter((w): w is string => w !== null);

  const merged = [...new Set([...fromSeed, ...fromPackage])];

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, formatTsFile(merged), 'utf8');

  const droppedSeed = seedWords.length - fromSeed.length;
  console.log(`کلمه‌های خام پکیج : ${raw.length.toLocaleString('en-US')}`);
  console.log(`از پکیج پذیرفته شد: ${fromPackage.length.toLocaleString('en-US')}`);
  console.log(`از بذر پذیرفته شد : ${fromSeed.length}${droppedSeed ? ` (${droppedSeed} رد شد)` : ''}`);
  console.log(`فهرست نهایی       : ${merged.length.toLocaleString('en-US')}`);
  console.log(`نوشته شد          : ${path.relative(process.cwd(), OUT_FILE)}`);
}

main();
