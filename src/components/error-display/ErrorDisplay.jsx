import React from 'react';
import PropTypes from 'prop-types';
import styles from './ErrorDisplay.module.scss';
import errorImage from '@/assets/images/error-cat.png'; 
export default function ErrorModal({ message, onClose }) {
    return (
      <div className={styles.backdrop} onClick={onClose}>
        <div className={styles.modal} onClick={e => e.stopPropagation()}>
          <button
            aria-label="Закрыть"
            className={styles.closeButton}
            onClick={onClose}
          >
            ×
          </button>
          <img
            src={errorImage}
            alt="Ошибка"
            className={styles.image}
          />
          <h2 className={styles.title}>Упс!</h2>
          <p className={styles.message}>
            {message || 'Что-то пошло не так. Попробуйте обновить страницу.'}
          </p>
          <button className={styles.actionButton} onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    );
  }
  
  ErrorModal.propTypes = {
    message: PropTypes.string,
    onClose: PropTypes.func.isRequired,
  };
  
  ErrorModal.defaultProps = {
    message: '',
  };