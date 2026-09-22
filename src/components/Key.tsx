import { BACKSPACE, ENTER, keyAriaLabels, keyLabels } from '../data/keyboard';
import styles from './Key.module.css';

/** یک کلید از کیبورد مجازی. */
export default function Key(
  { value, state, onKey, disabled }
    : { value: string, state, onKey, disabled }
) {
  const isWide = value === ENTER || value === BACKSPACE;
  const label = keyLabels[value] ?? value;
  const classes = [styles.key];
  if (isWide) classes.push(styles.wide);
  if (state) classes.push(styles[state]);

  return (
    <button
      type="button"
      className={classes.join(' ')}
      onClick={() => onKey(value)}
      disabled={disabled}
      aria-label={keyAriaLabels[value] ?? `حرف ${value}`}
    >
      {label}
    </button>
  );
}
