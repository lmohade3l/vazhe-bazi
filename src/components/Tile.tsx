import type { CSSProperties } from 'react';
import type { LetterState } from '../types';
import styles from './Tile.module.css';

const FLIP_STEP = 0.25;
const FLIP_MIDPOINT = 0.275;
const BOUNCE_STEP = 0.1;

interface TileProps {
  letter?: string;
  state?: LetterState | null;
  /** اندیس خانه در ردیف — تأخیر پله‌ای انیمیشن از روی آن حساب می‌شود. */
  index?: number;
  animate?: boolean;
  bounce?: boolean;
  small?: boolean;
}

/**
 * یک خانه‌ی برد. وقتی `animate` روشن باشد، خانه با تأخیر پله‌ای می‌چرخد و
 * رنگِ وضعیت دقیقاً در نیمه‌ی چرخش عوض می‌شود.
 */
export default function Tile({
  letter = '',
  state = null,
  index = 0,
  animate = false,
  bounce = false,
  small = false,
}: TileProps) {
  const classes: (string | undefined)[] = [styles.tile];
  if (small) classes.push(styles.small);
  if (state) classes.push(styles[state]);
  else if (letter) classes.push(styles.filled, styles.pop);
  if (animate) classes.push(styles.flip);
  else if (bounce) classes.push(styles.bounce);

  let style: CSSProperties | undefined;
  if (animate) {
    style = {
      animationDelay: `${index * FLIP_STEP}s`,
      transitionDelay: `${index * FLIP_STEP + FLIP_MIDPOINT}s`,
    };
  } else if (bounce) {
    style = { animationDelay: `${index * BOUNCE_STEP}s` };
  }

  return (
    <div className={classes.filter(Boolean).join(' ')} style={style} aria-hidden="true">
      {letter}
    </div>
  );
}
