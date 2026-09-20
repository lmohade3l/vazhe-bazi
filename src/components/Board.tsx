import Tile from './Tile';
import { toLetters } from '../lib/persian';
import styles from './Board.module.css';

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
}) {
  const currentRow = guesses.length;
  const currentLetters = toLetters(current);

  return (
    <div className={styles.board}>
      {Array.from({ length: rows }, (_, row) => {
        const isCurrent = row === currentRow;
        const guessLetters = row < guesses.length ? toLetters(guesses[row]) : null;
        const rowClasses = [styles.row];
        if (isCurrent && shaking) rowClasses.push(styles.shake);

        return (
          <div key={row} className={rowClasses.join(' ')}>
            {Array.from({ length: wordLength }, (_, col) => (
              <Tile
                key={col}
                index={col}
                letter={guessLetters ? guessLetters[col] : isCurrent ? (currentLetters[col] ?? '') : ''}
                state={guessLetters ? evaluations[row][col] : null}
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
