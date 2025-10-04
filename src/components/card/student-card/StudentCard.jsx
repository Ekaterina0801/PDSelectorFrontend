import React from 'react';
import base from '@/components/card/BaseCard.module.scss'
import { API_BASE_URL } from "../../../config/apiConfig"

import styles from './StudentCard.module.scss';


export default function StudentCard({
  name,
  course,
  aboutSelf,
  technologies = [],
  profileLink,
  idUser
}) {
  return (
    <div className={`${base.card} ${styles.studentCard}`}>
      <div className={styles.header}>
        <img
          src={`${API_BASE_URL}/users/${idUser}/photo`}
          alt={name}
          className={styles.avatar}
          onError={e => { (e.target).src = '/images/placeholder2.png'; }}
        />
        <h3 className={styles.name}>{name}</h3>
        {course != null && <p className={styles.course}>Курс: {course}</p>}
      </div>
      <div className={styles.body}>
        {aboutSelf ? (
          <p className={styles.resume}>{aboutSelf}</p>
        ) : (
          <p className={styles.resumeEmpty}>Описание отсутствует</p>
        )}
        <div className={styles.tags}>
          {technologies.length > 0 ? (
            technologies.map(t => {
              const label = typeof t === 'object' ? t.name : t;
              const key = typeof t === 'object' ? t.id ?? label : t;
              return (
                <span key={key} className={styles.tag}>
                  {label}
                </span>
              );
            })
          ) : (
            <span className={styles.noTags}>-</span>
          )}
        </div>
      </div>
      <div className={styles.footer}>
        <a href={profileLink} className={styles.actionLink}>
          <button className={styles.actionButton}>Профиль</button>
        </a>
      </div>
    </div>
  );
}
