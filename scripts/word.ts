/**
 * کلمه‌ی روز را نشان می‌دهد.
 *
 *   npm run word                  → پازل امروز
 *   npm run word -- 2026-07-15    → پازل یک تاریخ مشخص
 *   npm run word -- 42            → پازل شماره‌ی ۴۲
 */
import { getPuzzle } from '../src/data/words';
import {
  GAME_TIME_ZONE,
  dateToPuzzleNumber,
  getCurrentPuzzleNumber,
  toGameDate,
} from '../src/lib/gameDate';
import { formatPersianDate, toFa } from '../src/lib/persian';

const arg = process.argv[2];

function resolvePuzzleNumber(value: string | undefined): number {
  if (value === undefined) return getCurrentPuzzleNumber();
  if (/^\d+$/.test(value)) return Number(value);
  return dateToPuzzleNumber(value);
}

try {
  const puzzleNumber = resolvePuzzleNumber(arg);
  const puzzle = getPuzzle(puzzleNumber);
  const persian = formatPersianDate(new Date(`${puzzle.date}T12:00:00Z`));

  process.stdout.write(
    [
      `پازل    : #${toFa(puzzle.number)}`,
      `تاریخ   : ${puzzle.date}  (${persian})`,
      `کلمه    : ${puzzle.solution}`,
      `امروز   : #${toFa(getCurrentPuzzleNumber())} — ${toGameDate()} به وقت ${GAME_TIME_ZONE}`,
      '',
    ].join('\n'),
  );
} catch (error) {
  process.stderr.write(`خطا: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
