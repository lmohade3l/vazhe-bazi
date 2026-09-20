import { toFa } from '../lib/persian';
import styles from './Distribution.module.css';

const MIN_WIDTH = 8;

/** توزیع حدس‌ها به‌صورت میله‌های افقی. */
export default function Distribution({ dist, rows, highlight }) {
  const values = Array.from({ length: rows }, (_, i) => dist[i] ?? 0);
  const max = Math.max(...values, 1);

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.heading}>توزیع حدس‌ها</h3>
      <div className={styles.chart}>
        {values.map((count, index) => (
          <div key={index} className={styles.line}>
            <span className={styles.index}>{toFa(index + 1)}</span>
            <div
              className={`${styles.bar} ${highlight === index + 1 ? styles.highlight : ''}`}
              style={{ width: `${Math.max((count / max) * 100, MIN_WIDTH)}%` }}
            >
              <span className={styles.count}>{toFa(count)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
