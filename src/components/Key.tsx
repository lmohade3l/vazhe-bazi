import { BACKSPACE, ENTER, keyAriaLabels, keyLabels } from '../data/keyboard';
import type { LetterState } from '../types';
import styles from './Key.module.css';

interface KeyProps {
  value: string;
  state?: LetterState | undefined;
  onKey: (value: string) => void;
  disabled: boolean;
}

/** یک کلید از کیبورد مجازی. */
export default function Key({ value, state, onKey, disabled }: KeyProps) {
  const isWide = value === ENTER || value === BACKSPACE;
  const label = keyLabels[value] ?? value;

  const classes: (string | undefined)[] = [styles.key];
  if (isWide) classes.push(styles.wide);
  if (state) classes.push(styles[state]);

  return (
    <button
      type="button"
      className={classes.filter(Boolean).join(' ')}
      onClick={() => onKey(value)}
      disabled={disabled}
      aria-label={keyAriaLabels[value] ?? `حرف ${value}`}
    >
      {label}
    </button>
  );
}
