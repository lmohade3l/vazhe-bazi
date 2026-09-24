import Modal from '../Modal';
import StatGrid from '../StatGrid';
import Distribution from '../Distribution';
import type { Stats as StatsValue } from '../../types';
import styles from './Stats.module.css';

interface StatsProps {
  open: boolean;
  onClose: () => void;
  stats: StatsValue;
  rows: number;
  highlight?: number | null;
}

/** مودال آمار. */
export default function Stats({ open, onClose, stats, rows, highlight }: StatsProps) {
  return (
    <Modal open={open} onClose={onClose} title="آمار" labelledBy="stats-title">
      <div className={styles.body}>
        <StatGrid stats={stats} />
        <Distribution dist={stats.dist} rows={rows} highlight={highlight} />
      </div>
    </Modal>
  );
}
