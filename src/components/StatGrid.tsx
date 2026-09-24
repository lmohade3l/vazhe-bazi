import { toFa } from '../lib/persian';
import type { Stats } from '../types';
import styles from './StatGrid.module.css';

interface StatGridProps {
  stats: Stats;
}

/** چهار عدد کلیدیِ آمار. */
export default function StatGrid({ stats }: StatGridProps) {
  const winRate = stats.played === 0 ? 0 : Math.round((stats.wins / stats.played) * 100);

  const items = [
    { label: 'بازی‌ها', value: stats.played },
    { label: '٪ برد', value: winRate },
    { label: 'استریک', value: stats.streak },
    { label: 'بهترین', value: stats.maxStreak },
  ];

  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <div key={item.label} className={styles.item}>
          <span className={styles.value}>{toFa(item.value)}</span>
          <span className={styles.label}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
