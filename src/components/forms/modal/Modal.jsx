import React from 'react';
import styles from './Modal.module.scss';


function Modal({ show, onClose, title, children, onSubmit, submitLabel = "Сохранить" }) {
  if (!show) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button
          type="button"
          aria-label="Закрыть"
          className={styles.modalClose}
          onClick={onClose}
        >
          &times;
        </button>

        {title && (
          <div className={styles.modalHeader}>
            {title}
          </div>
        )}

        <div className={styles.modalBody}>
          {children}
        </div>

        {onSubmit && (
          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.buttonSecondary}
              onClick={onClose}
            >
              Отмена
            </button>
            <button
              type="button"
              className={styles.buttonPrimary}
              onClick={onSubmit}
            >
              {submitLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
