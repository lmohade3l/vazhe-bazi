import Modal from '../Modal';
import StatGrid from '../StatGrid';
import Distribution from '../Distribution';
import styles from './Stats.module.css';

/** مودال آمار. */
export default function Stats({ open, onClose, stats, rows, highlight }) {
  return (
    <Modal open={open} onClose={onClose} title="آمار" labelledBy="stats-title">
      <div className={styles.body}>
        <StatGrid stats={stats} />
        <Distribution dist={stats.dist} rows={rows} highlight={highlight} />
      </div>
    </Modal>
  );
}
