import { normalize, toLetters } from './persian';
import type { LetterState } from '../types';

export const CORRECT = 'correct';
export const PRESENT = 'present';
export const ABSENT = 'absent';

/** ترتیب اهمیت وضعیت‌ها — برای رنگ کلیدهای کیبورد. */
const RANK: Record<LetterState, number> = { absent: 1, present: 2, correct: 3 };

/** بهترین وضعیتِ هر حرف تا این لحظه؛ کلید، حرفِ نرمال‌شده است. */
export type LetterStates = Record<string, LetterState>;

/**
 * ارزیابی دومرحله‌ای: ابتدا حروفِ درست‌جا علامت می‌خورند و از شمارش کلمه‌ی
 * هدف کم می‌شوند، سپس در پاس دوم حروفِ موجود اما جابه‌جا مشخص می‌شوند.
 * به این ترتیب حروف تکراری درست شمرده می‌شوند.
 */
export function evaluateGuess(guess: string, solution: string): LetterState[] {
  const guessLetters = toLetters(normalize(guess));
  const solutionLetters = toLetters(normalize(solution));
  const result: LetterState[] = guessLetters.map(() => ABSENT);
  const remaining = new Map<string, number>();

  guessLetters.forEach((letter, i) => {
    const target = solutionLetters[i];
    if (letter === target) {
      result[i] = CORRECT;
    } else if (target !== undefined) {
      remaining.set(target, (remaining.get(target) ?? 0) + 1);
    }
  });

  guessLetters.forEach((letter, i) => {
    if (result[i] === CORRECT) return;
    const left = remaining.get(letter) ?? 0;
    if (left > 0) {
      result[i] = PRESENT;
      remaining.set(letter, left - 1);
    }
  });

  return result;
}

/**
 * بهترین وضعیتی که هر حرف تا این لحظه گرفته است — کلید: حرفِ نرمال‌شده.
 */
export function buildLetterStates(guesses: string[], solution: string): LetterStates {
  const states: LetterStates = {};
  guesses.forEach((guess) => {
    const result = evaluateGuess(guess, solution);
    toLetters(normalize(guess)).forEach((letter, i) => {
      const next = result[i];
      if (next === undefined) return;
      const current = states[letter];
      if (current === undefined || RANK[next] > RANK[current]) states[letter] = next;
    });
  });
  return states;
}

/**
 * بررسی قوانین حالت سخت. در صورت تخلف، پیام فارسی برمی‌گرداند؛
 * در غیر این صورت `null`.
 */
export function checkHardMode(
  guess: string,
  guesses: string[],
  solution: string,
  formatNumber: (value: number) => string,
): string | null {
  if (guesses.length === 0) return null;

  const guessLetters = toLetters(normalize(guess));
  const known = new Map<string, number>(); // حرف → کمینه‌ی دفعاتِ لازم
  const fixed = new Map<number, string>(); // اندیس → حرف
  const original = new Map<string, string>(); // حرفِ نرمال‌شده → شکلِ نمایشی

  guesses.forEach((prev) => {
    const prevLetters = toLetters(normalize(prev));
    const prevDisplay = toLetters(prev);
    const result = evaluateGuess(prev, solution);
    const counts = new Map<string, number>();

    result.forEach((state, i) => {
      const letter = prevLetters[i];
      if (letter === undefined) return;
      if (state === CORRECT) fixed.set(i, letter);
      if (state === CORRECT || state === PRESENT) {
        counts.set(letter, (counts.get(letter) ?? 0) + 1);
        const display = prevDisplay[i];
        if (!original.has(letter) && display !== undefined) original.set(letter, display);
      }
    });

    counts.forEach((count, letter) => {
      known.set(letter, Math.max(known.get(letter) ?? 0, count));
    });
  });

  for (const [index, letter] of fixed) {
    if (guessLetters[index] !== letter) {
      return `باید حرف خانه‌ی ${formatNumber(index + 1)} را نگه داری`;
    }
  }

  for (const [letter, count] of known) {
    const used = guessLetters.filter((l) => l === letter).length;
    if (used < count) {
      return `باید از حرف «${original.get(letter) ?? letter}» استفاده کنی`;
    }
  }

  return null;
}
