import { toFa } from '../lib/persian';
import styles from './StatGrid.module.css';

/** چهار عدد کلیدیِ آمار. */
export default function StatGrid({ stats }) {
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
