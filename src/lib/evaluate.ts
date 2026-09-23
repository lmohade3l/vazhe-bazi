import { normalize, toLetters } from './persian';

export const CORRECT = 'correct';
export const PRESENT = 'present';
export const ABSENT = 'absent';

const RANK = { [ABSENT]: 1, [PRESENT]: 2, [CORRECT]: 3 };

export function evaluateGuess(guess, solution) {
  const guessLetters = toLetters(normalize(guess));
  const solutionLetters = toLetters(normalize(solution));
  const result = new Array(guessLetters.length).fill(ABSENT);
  const remaining = new Map();

  guessLetters.forEach((letter, i) => {
    if (letter === solutionLetters[i]) {
      result[i] = CORRECT;
    } else {
      const target = solutionLetters[i];
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
export function buildLetterStates(guesses, solution) {
  const states = {};
  guesses.forEach((guess) => {
    const result = evaluateGuess(guess, solution);
    toLetters(normalize(guess)).forEach((letter, i) => {
      const next = result[i];
      const current = states[letter];
      if (!current || RANK[next] > RANK[current]) states[letter] = next;
    });
  });
  return states; 
}

/**
 * بررسی قوانین حالت سخت. در صورت تخلف، پیام فارسی برمی‌گرداند؛
 * در غیر این صورت `null`.
 */
export function checkHardMode(guess, guesses, solution, toFa) {
  if (guesses.length === 0) return null;

  const guessLetters = toLetters(normalize(guess));
  const known = new Map(); // حرف → کمینه‌ی دفعاتِ لازم
  const fixed = new Map(); // اندیس → حرف
  const original = new Map(); // حرفِ نرمال‌شده → شکلِ نمایشی

  guesses.forEach((prev) => {
    const prevLetters = toLetters(normalize(prev));
    const prevDisplay = toLetters(prev);
    const result = evaluateGuess(prev, solution);
    const counts = new Map();
    result.forEach((state, i) => {
      if (state === CORRECT) fixed.set(i, prevLetters[i]);
      if (state === CORRECT || state === PRESENT) {
        counts.set(prevLetters[i], (counts.get(prevLetters[i]) ?? 0) + 1);
        if (!original.has(prevLetters[i])) original.set(prevLetters[i], prevDisplay[i]);
      }
    });
    counts.forEach((count, letter) => {
      known.set(letter, Math.max(known.get(letter) ?? 0, count));
    });
  });

  for (const [index, letter] of fixed) {
    if (guessLetters[index] !== letter) {
      return `باید حرف خانه‌ی ${toFa(index + 1)} را نگه داری`;
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
