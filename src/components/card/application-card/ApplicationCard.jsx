import React, { useState } from 'react';
import baseStyles from '../BaseCard.module.scss';
import styles from './ApplicationCard.module.scss';
import { observer } from 'mobx-react';
import {useApplicationActions} from '../../../hooks/useApplicationActions';
import teamStore from '../../../stores/teamStore';
import Loader from '../../spinner/Loader';
import ErrorModal from '../../error-display/ErrorDisplay';
export default observer(function ApplicationCard({ application }) {
  const teamId    = application.team.id;
  const studentId = application.student.id;
  const type      = application.type.toLowerCase();

  const { status, actions, loading, error } = useApplicationActions({
    type,
    teamId,
    studentId,
  });

  const STATUS_LABELS = {
    sent:      type === 'request' ? 'Заявка отправлена'  : 'Приглашение отправлено',
    accepted:  type === 'request' ? 'Заявка принята'     : 'Приглашение принято',
    rejected:  type === 'request' ? 'Заявка отклонена'   : 'Приглашение отклонено',
    cancelled: type === 'request' ? 'Заявка отменена'    : 'Приглашение отменено',
  };
  if (loading)
    return <Loader size="small" />;
  
    if (error)
      return <ErrorModal title="УПС" message={error} onClose={() => setError(null)} />;

  return (
    <div className={styles.cardContainer}>
      {/* Header */}
      <div className={baseStyles['card-header']}>
        <h3 className={baseStyles['card-name']}>
          Студент: {application.student.fio}
        </h3>
        <h3 className={baseStyles['card-name']}>
          Команда: {application.team.name}
        </h3>
      </div>

      {/* Body */}
      <div className={styles.cardBody}>
        {application.team.project_description && (
          <p className={baseStyles['card-resume']}>
            {application.team.project_description}
          </p>
        )}
        <div className={baseStyles['card-tags']}>
          {application.team.technologies.map((t, i) => (
            <span key={i} className={baseStyles['card-tag']}>
              {t.name}
            </span>
          ))}
        </div>

  

        {status && (
          <div className={`${styles.statusTag} ${styles[status]}`}>
            {STATUS_LABELS[status]}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className={styles.cardActions}>
        {actions.map(act => (
          <button
            key={act.key}
            className={styles.actionButton}
            onClick={act.handler}
          >
            {act.text}
          </button>
        ))}

        <a href={`/teams/${teamId}`}>
          <button className={styles.actionButton}>К команде</button>
        </a>
        <a href={`/students/${studentId}`}>
          <button className={styles.actionButton}>К студенту</button>
        </a>
      </div>
    </div>
  );
});
