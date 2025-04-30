import React from 'react';
import styles from './MainSection.module.scss';

const MainContent = ({ children }) => {
  return (
    <div className={styles.mainContent}>
      {children}
    </div>
  );
};

export default MainContent;
