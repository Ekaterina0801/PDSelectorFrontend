import React from 'react';
import styles from './Modal.module.scss';

function Modal({ show, onClose, children }) {
  if (!show) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.modalClose} onClick={onClose}>
          &times;
        </button>
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
