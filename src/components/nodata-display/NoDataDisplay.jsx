import React from 'react';
import PropTypes from 'prop-types';
import styles from './NoDataDisplay.module.scss';
import emptyIllustration from '@/assets/images/nodata-cat.png'; 
export default function NoDataDisplay({
    message,
    imageSrc,
    buttonText,
    onButtonClick,
  }) {
    return (
      <div className={styles.noData}>
        <div className={styles.card}>
          <img
            src={imageSrc || emptyIllustration}
            alt="Пустое состояние"
            className={styles.image}
          />
          <h2 className={styles.title}>
            {message || 'Здесь пока ничего нет'}
          </h2>
          {buttonText && onButtonClick && (
            <button
              type="button"
              className={styles.actionButton}
              onClick={onButtonClick}
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>
    );
  }
  
  NoDataDisplay.propTypes = {
    message: PropTypes.string,
    imageSrc: PropTypes.string,
    buttonText: PropTypes.string,
    onButtonClick: PropTypes.func,
  };
  
  NoDataDisplay.defaultProps = {
    message: '',
    imageSrc: '',
    buttonText: '',
    onButtonClick: null,
  };