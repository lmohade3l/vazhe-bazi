import { ReactNode, useEffect, useRef } from 'react';
import styles from './Modal.module.css';

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

interface ModalProps {
  open: boolean, 
  onClose: () => void, 
  title: string, 
  labelledBy, 
  children: ReactNode
}
export default function Modal({ open, onClose, title, labelledBy, children }: ModalProps) {
  const cardRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    previousFocus.current = document.activeElement;
    const card = cardRef.current;
    card?.querySelector(FOCUSABLE)?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !card) return;

      const items = [...card.querySelectorAll(FOCUSABLE)].filter(
        (el) => !el.hasAttribute('disabled'),
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previousFocus.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={cardRef}
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="بستن"
          title="بستن"
        >
          ✕
        </button>
        {title ? (
          <h2 id={labelledBy} className={styles.title}>
            {title}
          </h2>
        ) : null}
        {children}
      </div>
    </div>
  );
}
