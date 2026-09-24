import Modal from '../Modal';
import Tile from '../Tile';
import { toLetters } from '../../lib/persian';
import type { LetterState } from '../../types';
import styles from './Help.module.css';

interface Example {
  word: string;
  /** اندیس حرفی که رنگ می‌گیرد. */
  index: number;
  state: LetterState;
  text: string;
}

const EXAMPLES: Example[] = [
  {
    word: 'ستاره',
    index: 0,
    state: 'correct',
    text: 'حرف «س» در کلمه هست و سرِ جای درست قرار دارد.',
  },
  {
    word: 'پرنده',
    index: 1,
    state: 'present',
    text: 'حرف «ر» در کلمه هست، اما جایش اشتباه است.',
  },
  {
    word: 'باران',
    index: 4,
    state: 'absent',
    text: 'حرف «ن» در هیچ‌جای کلمه نیست.',
  },
];

/** مودال راهنما. */
interface HelpProps {
  open: boolean;
  onClose: () => void;
}

export default function Help({ open, onClose }: HelpProps) {
  return (
    <Modal open={open} onClose={onClose} title="چطور بازی کنیم" labelledBy="help-title">
      <p className={styles.intro}>
        کلمه‌ی پنج‌حرفیِ امروز را در شش تلاش حدس بزن. بعد از هر حدس، رنگ خانه‌ها
        نشان می‌دهد چقدر به جواب نزدیک شده‌ای.
      </p>

      <hr className={styles.divider} />

      <div className={styles.examples}>
        {EXAMPLES.map((example) => (
          <div key={example.word} className={styles.example}>
            <div className={styles.tiles}>
              {toLetters(example.word).map((letter, i) => (
                <Tile
                  key={i}
                  letter={letter}
                  state={i === example.index ? example.state : null}
                  small
                />
              ))}
            </div>
            <p className={styles.caption}>{example.text}</p>
          </div>
        ))}
      </div>
    </Modal>
  );
}
