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
    <div className={base.card + ' ' + styles['student-card']}>
      <div className={styles.cardContent}>
        <div className={base['card-header']}>
          <img
            src="/images/placeholder2.png"
            alt={name}
            className={styles.avatar}
            onError={e => { e.target.src = '/images/placeholder2.png' }}
          />
          <div className={styles.info}>
            <h3 className={base['card-name']}>{name}</h3>
            {track  && <p className={base['card-type']}>Трек: {track}</p>}
            {course && <p className={base['card-type']}>Курс: {course}</p>}
          </div>
        </div>
        <div className={base['card-body']}>
          {about_self && (
            <p className={base['card-resume']}>
              {about_self}
            </p>
          )}
          <div className={base['card-tags']}>
            {technologies.length
              ? technologies.map(t => (
                  <span key={t.id || t} className={base['card-tag']}>
                    {typeof t === 'object' ? t.name : t}
                  </span>
                ))
              : <span className={base.noTags}>-</span>}
          </div>
        </div>
      </div>

      <div className={base['card-actions']}>
        <a href={profileLink} className={base['action-link']}>
          <button className={base['action-button']}>
            Профиль
          </button>
        </a>
      </div>
    </div>
  )
}