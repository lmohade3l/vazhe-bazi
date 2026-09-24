import Tile from './Tile';
import { toLetters } from '../lib/persian';
import type { LetterState } from '../types';
import styles from './Board.module.css';

interface BoardProps {
  rows: number;
  wordLength: number;
  guesses: string[];
  evaluations: LetterState[][];
  current: string;
  animatingRow: number;
  shaking: boolean;
  bouncing: boolean;
}

/** برد بازی: ردیف‌های حدس‌شده، ردیف جاری و ردیف‌های خالی. */
export default function Board({
  rows,
  wordLength,
  guesses,
  evaluations,
  current,
  animatingRow,
  shaking,
  bouncing,
}: BoardProps) {
  const currentRow = guesses.length;
  const currentLetters = toLetters(current);

  return (
    <div className={styles.board}>
      {Array.from({ length: rows }, (_, row) => {
        const isCurrent = row === currentRow;
        const guess = guesses[row];
        const guessLetters = guess === undefined ? null : toLetters(guess);
        const rowEvaluation = evaluations[row];

        const rowClasses: (string | undefined)[] = [styles.row];
        if (isCurrent && shaking) rowClasses.push(styles.shake);

        return (
          <div key={row} className={rowClasses.filter(Boolean).join(' ')}>
            {Array.from({ length: wordLength }, (_, col) => (
              <Tile
                key={col}
                index={col}
                letter={
                  guessLetters
                    ? (guessLetters[col] ?? '')
                    : isCurrent
                      ? (currentLetters[col] ?? '')
                      : ''
                }
                state={guessLetters ? (rowEvaluation?.[col] ?? null) : null}
                animate={row === animatingRow}
                bounce={bouncing && row === guesses.length - 1}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
