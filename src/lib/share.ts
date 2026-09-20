import { CORRECT, PRESENT, evaluateGuess } from './evaluate';
import { toFa } from './persian';

const EMOJI = {
  normal: { [CORRECT]: '🟩', [PRESENT]: '🟨' },
  colorBlind: { [CORRECT]: '🟧', [PRESENT]: '🟦' },
};

/** متن اشتراک‌گذاری نتیجه‌ی امروز. */
export function buildShareText({
  puzzleNumber,
  guesses,
  solution,
  rows,
  won,
  theme,
  colorBlind,
}) {
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
export async function shareResult(text) {
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
