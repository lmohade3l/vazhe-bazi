import Key from './Key';
import { keyboardRows } from '../data/keyboard';
import { normalize } from '../lib/persian';
import styles from './Keyboard.module.css';

interface KeyboardProps {
  letterStates: ,
  onKey: (value: string) => void,
  disabled: boolean
}

export default function Keyboard({ letterStates, onKey, disabled }:KeyboardProps) {
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
