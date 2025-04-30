import React from 'react';
import PropTypes from 'prop-types';
import styles from './ErrorDisplay.module.scss';
import errorImage from '@/assets/images/error-cat.png'; 

export default function ErrorDisplay({ message }) {
  return (
    <div className={styles.container}>
      <img
        src={errorImage}
        alt="Ошибка"
        className={styles.image}
      />
      <p className={styles.message}>
        {message || 'Что-то пошло не так. Попробуйте обновить страницу.'}
      </p>
    </div>
  );
}

ErrorDisplay.propTypes = {
  message: PropTypes.string,
};

ErrorDisplay.defaultProps = {
  message: '',
};
