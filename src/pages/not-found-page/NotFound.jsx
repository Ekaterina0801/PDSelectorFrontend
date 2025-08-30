import React from "react";
import { Link } from "react-router-dom";
import styles from './NotFound.module.scss'; // Импортируем стили как объект
import cat from '@/assets/images/nodata-cat.png'; 
const NotFound = () => {
  return (
    <div className={styles['background']}>
      <div className={styles['card']}>
        <h1 className={styles['title']}>404</h1>
        <p className={styles['subtitle']}>Страница не найдена</p>
        <img
          src={cat}
          alt="No Data"
          className={styles['notFoundImage']}
        />
        <Link to="/teams" className={styles['primaryBtn']}>
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
};

export default NotFound;