import Key from './Key';
import { keyboardRows } from '../data/keyboard';
import { normalize } from '../lib/persian';
import styles from './Keyboard.module.css';

/** کیبورد مجازی فارسی. کلیدها از چپ چیده می‌شوند. */
export default function Keyboard({ letterStates, onKey, disabled }) {
  return (
    <div className={styles.keyboard} role="group" aria-label="کیبورد فارسی">
      {keyboardRows.map((row, index) => (
        <div key={index} className={styles.row}>
          {row.map((value) => (
            <Key
              key={value}
              value={value}
              state={letterStates[normalize(value)]}
              onKey={onKey}
              disabled={disabled}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
