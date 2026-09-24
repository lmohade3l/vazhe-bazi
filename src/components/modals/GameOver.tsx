import { useEffect, useRef, useState } from 'react';
import Modal from '../Modal';
import StatGrid from '../StatGrid';
import Distribution from '../Distribution';
import { buildShareText, shareResult } from '../../lib/share';
import type { Settings, Stats } from '../../types';
import styles from './GameOver.module.css';

const PRAISE = ['نابغه!', 'محشر!', 'عالی!', 'آفرین!', 'خوب بود!', 'اوف، به‌زحمت!'];
const COPIED_DURATION = 2200;

interface GameOverProps {
  open: boolean;
  onClose: () => void;
  won: boolean;
  stats: Stats;
  rows: number;
  guesses: string[];
  solution: string;
  puzzleNumber: number;
  settings: Settings;
  onPlayAgain: () => void;
  onShareFailed: () => void;
}

/** مودال پایان بازی. */
export default function GameOver({
  open,
  onClose,
  won,
  stats,
  rows,
  guesses,
  solution,
  puzzleNumber,
  settings,
  onPlayAgain,
  onShareFailed,
}: GameOverProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const handleShare = async () => {
    const text = buildShareText({
      puzzleNumber,
      guesses,
      solution,
      rows,
      won,
      theme: settings.theme,
      colorBlind: settings.colorBlind,
    });
    const ok = await shareResult(text);
    if (!ok) {
      onShareFailed();
      return;
    }
    setCopied(true);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), COPIED_DURATION);
  };

  const praise = PRAISE[Math.min(guesses.length - 1, PRAISE.length - 1)];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={won ? 'بردی!' : 'تمام شد'}
      labelledBy="gameover-title"
    >
      {won ? (
        <p className={styles.praise}>{praise}</p>
      ) : (
        <div className={styles.answer}>
          <p className={styles.answerLabel}>کلمه‌ی درست این بود:</p>
          <p className={styles.word}>{solution}</p>
        </div>
      )}

      <StatGrid stats={stats} />
      <Distribution dist={stats.dist} rows={rows} highlight={won ? guesses.length : null} />

      <button type="button" className={styles.share} onClick={() => void handleShare()}>
        {copied ? 'کپی شد ✓' : 'اشتراک‌گذاری نتیجه'}
      </button>

      <button type="button" className={styles.again} onClick={onPlayAgain}>
        بازی دوباره
      </button>
    </Modal>
  );
}
