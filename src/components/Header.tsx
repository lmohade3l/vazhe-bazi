import { Link } from 'react-router-dom';
import styles from './Header.module.css';

function GridIcon() {
  return (
    <svg viewBox="0 0 20 20" width="19" height="19" fill="currentColor" aria-hidden="true">
      <rect x="2" y="2" width="7" height="7" rx="1.6" />
      <rect x="11" y="2" width="7" height="7" rx="1.6" />
      <rect x="2" y="11" width="7" height="7" rx="1.6" />
      <rect x="11" y="11" width="7" height="7" rx="1.6" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 20 20" width="19" height="19" fill="currentColor" aria-hidden="true">
      <rect x="2" y="11" width="4" height="7" rx="1" />
      <rect x="8" y="6" width="4" height="12" rx="1" />
      <rect x="14" y="2" width="4" height="16" rx="1" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="19"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="2" y1="6" x2="18" y2="6" />
      <line x1="2" y1="14" x2="18" y2="14" />
      <circle cx="13" cy="6" r="2.4" fill="var(--bg)" />
      <circle cx="7" cy="14" r="2.4" fill="var(--bg)" />
    </svg>
  );
}

interface HeaderProps {
  onHelp: () => void;
  onStats: () => void;
  onSettings: () => void;
}

/** هدر صفحه‌ی بازی. */
export default function Header({ onHelp, onStats, onSettings }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.side}>
        <Link to="/" className={styles.button} title="بازگشت به خانه" aria-label="بازگشت به خانه">
          <GridIcon />
        </Link>
        <button
          type="button"
          className={styles.button}
          onClick={onHelp}
          title="راهنما"
          aria-label="راهنما"
        >
          <span className={styles.question}>؟</span>
        </button>
      </div>

      <h1 className={styles.title}>حدس‌واژه</h1>

      <div className={`${styles.side} ${styles.end}`}>
        <button
          type="button"
          className={styles.button}
          onClick={onStats}
          title="آمار"
          aria-label="آمار"
        >
          <ChartIcon />
        </button>
        <button
          type="button"
          className={styles.button}
          onClick={onSettings}
          title="تنظیمات"
          aria-label="تنظیمات"
        >
          <SlidersIcon />
        </button>
      </div>
    </header>
  );
}
