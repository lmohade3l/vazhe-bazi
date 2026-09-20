import styles from './Toast.module.css';

/** پیام کوتاه بالای برد. */
export default function Toast({ toast }) {
  return (
    <div className={styles.region} role="status" aria-live="polite">
      {toast ? (
        <div key={toast.id} className={styles.toast}>
          {toast.message}
        </div>
      ) : null}
    </div>
  );
}
