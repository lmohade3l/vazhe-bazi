import { CORRECT, PRESENT, evaluateGuess } from './evaluate';
import { toFa } from './persian';
import type { LetterState, Theme } from '../types';

type Palette = Partial<Record<LetterState, string>>;

const EMOJI: Record<'normal' | 'colorBlind', Palette> = {
  normal: { [CORRECT]: '🟩', [PRESENT]: '🟨' },
  colorBlind: { [CORRECT]: '🟧', [PRESENT]: '🟦' },
};

interface ShareOptions {
  puzzleNumber: number;
  guesses: string[];
  solution: string;
  rows: number;
  won: boolean;
  theme: Theme;
  colorBlind: boolean;
}

/** متن اشتراک‌گذاری نتیجه‌ی امروز. */
export function buildShareText({
  puzzleNumber,
  guesses,
  solution,
  rows,
  won,
  theme,
  colorBlind,
}: ShareOptions): string {
  const palette = colorBlind ? EMOJI.colorBlind : EMOJI.normal;
  const absent = theme === 'dark' ? '⬛' : '⬜';
  const score = won ? toFa(guesses.length) : 'X';
  const header = `واژه‌بازی — حدس‌واژه #${toFa(puzzleNumber)}  ${score}/${toFa(rows)}`;

  const grid = guesses
    .map((guess) =>
      evaluateGuess(guess, solution)
        .map((state) => palette[state] ?? absent)
        .join(''),
    )
    .join('\n');

  return `${header}\n\n${grid}`;
}

/**
 * ابتدا اشتراک‌گذاری بومی، در غیر این صورت کپی در کلیپ‌بورد.
 * در صورت موفقیت `true` برمی‌گرداند.
 */
export async function shareResult(text: string): Promise<boolean> {
  try {
    if (navigator.share) {
      await navigator.share({ text });
      return true;
    }
  } catch {
    /* کاربر لغو کرد یا پشتیبانی نشد — سراغ کلیپ‌بورد می‌رویم */
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
