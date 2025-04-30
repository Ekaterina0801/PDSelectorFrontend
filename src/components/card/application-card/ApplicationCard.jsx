import React, { useState } from 'react';
import base from '../BaseCard.module.scss';
import styles from './ApplicationCard.module.scss';
export default function ApplicationCard({
  applicationId,
  studentName,
  teamName,
  teamId,
  studentId,
  teamDescription,
  technologies = [],
  status,
  onApprove,
  onReject,
  onCancel,
  onSending,
  onViewDetails,
  approveText    = 'Одобрить',
  rejectText     = 'Отклонить заявку',
  cancelText     = 'Отменить заявку',
  sendingText    = 'Подать заявку снова',
  viewDetailsText= 'Подробнее',
  showCaptainOptions = false,
}) {
  const [appStatus, setAppStatus] = useState(status);

  const statusMap = {
    Sent:      { text: 'Отправлена', color: styles.warning },
    Accepted:  { text: 'Принята',    color: styles.success },
    Rejected:  { text: 'Отклонена',  color: styles.danger },
    Cancelled: { text: 'Отменена',   color: styles.danger },
  };
  const { text: statusText, color: statusColor } = statusMap[appStatus] || {};

  const handlers = {
    approve: () => { onApprove?.(applicationId); setAppStatus('Accepted'); },
    reject:  () => { onReject?.(applicationId);  setAppStatus('Rejected');  },
    cancel:  () => { onCancel?.(applicationId);  setAppStatus('Cancelled'); },
    resend:  () => { onSending?.(applicationId); setAppStatus('Sent');      },
    viewDetails: () => { onViewDetails?.(applicationId); },
  };

  return (
    <div className={`${base.card} ${styles.appBackground}`}>
      {/* Header */}
      <div className={base['card-header']}>
        <h3 className={base['card-name']}>Студент: {studentName}</h3>
        {teamName && (
          <p className={base['card-type']}>
            Команда: {teamName}
          </p>
        )}
      </div>

      {/* Body */}
      <div className={base['card-body']}>
        {teamDescription && (
          <p className={base['card-resume']}>
            Описание: {teamDescription}
          </p>
        )}

        <div className={base['card-tags']}>
          {technologies.length > 0
            ? technologies.map((tech, i) => (
                <span key={i} className={base['card-tag']}>
                  {typeof tech === 'object' ? tech.name : tech}
                </span>
              ))
            : <span className={base.noTags}>-</span>}
        </div>

        {/* Status */}
        <span
          className={styles.statusTag}
          style={{ backgroundColor: statusColor }}
        >
          {statusText}
        </span>
      </div>

      {/* Actions */}
      <div className={base['card-actions']}>
        {appStatus === 'Sent' && (
          showCaptainOptions
            ? <>
                <button
                  className={`${base['action-button']} ${styles.approve}`}
                  onClick={handlers.approve}
                >
                  {approveText}
                </button>
                <button
                  className={`${base['action-button']} ${styles.reject}`}
                  onClick={handlers.reject}
                >
                  {rejectText}
                </button>
              </>
            : <button
                className={`${base['action-button']} ${styles.cancel}`}
                onClick={handlers.cancel}
              >
                {cancelText}
              </button>
        )}

        {appStatus === 'Cancelled' && (
          <button
            className={`${base['action-button']} ${styles.apply}`}
            onClick={handlers.resend}
          >
            {sendingText}
          </button>
        )}

        {/* Подробнее */}
        <button
          className={`${base['action-button']} ${styles.view}`}
          onClick={handlers.viewDetails}
        >
          {viewDetailsText}
        </button>

        {/* Перейти к команде */}
        <a href={`/teams/${teamId}`} className={base['action-link']}>
          <button className={base['action-button']}>К команде</button>
        </a>

        {/* Перейти к студенту */}
        <a href={`/students/${studentId}`} className={base['action-link']}>
          <button className={base['action-button']}>К студенту</button>
        </a>
      </div>
    </div>
  );
}