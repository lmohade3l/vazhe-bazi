import type { ToastMessage } from '../types';
import styles from './Toast.module.css';

interface ToastProps {
  toast: ToastMessage | null;
}

/** پیام کوتاه بالای برد. */
export default function Toast({ toast }: ToastProps) {
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
