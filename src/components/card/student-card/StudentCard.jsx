import React from 'react';
import base from '@/components/card/BaseCard.module.scss'

import styles from './StudentCard.module.scss';
export default function StudentCard({
  name,
  track,
  course,
  about_self,
  technologies = [],
  profileLink
}) {
  return (
    <div className={`${base.card} ${styles.studentCard}`}>
      {/* Header: аватар + ФИО + Курс */}
      <div className={styles.header}>
        <img
          src="/images/placeholder2.png"
          alt={name}
          className={styles.avatar}
          onError={e => { e.target.src = '/images/placeholder2.png'; }}
        />
        <h3 className={styles.name}>{name}</h3>
        {course != null && <p className={styles.course}>Курс: {course}</p>}
      </div>

      {/* Body: описание + теги */}
      <div className={styles.body}>
        {about_self && (
          <p className={styles.resume}>{about_self}</p>
        )}
        <div className={styles.tags}>
          {technologies.length
            ? technologies.map(t => (
                <span key={t.id || t} className={styles.tag}>
                  {typeof t === 'object' ? t.name : t}
                </span>
              ))
            : <span className={styles.noTags}>-</span>}
        </div>
      </div>

      {/* Footer: кнопка */}
      <div className={styles.footer}>
        <a href={profileLink} className={styles.actionLink}>
          <button className={styles.actionButton}>
            Профиль
          </button>
        </a>
      </div>
    </div>
  );
}