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
  status = '',
  onApprove,
  onReject,
  onCancel,
  onSending,
  onViewDetails,
  approveText     = 'Одобрить',
  rejectText      = 'Отклонить заявку',
  cancelText      = 'Отменить заявку',
  sendingText     = 'Подать заявку снова',
  showCaptainOptions = false,
  isAdmin
}) {
  const [appStatus, setAppStatus] = useState(status.toLowerCase());

  const statusMap = {
    sent:      { text: 'Отправлена', className: styles.warning },
    accepted:  { text: 'Принята',    className: styles.success },
    rejected:  { text: 'Отклонена',  className: styles.danger },
    cancelled: { text: 'Отменена',   className: styles.danger },
  };

  const { text: statusText, className: statusClass } = statusMap[appStatus] || {};

  const handlers = {
    approve: () => { onApprove?.(applicationId); setAppStatus('accepted'); console.log("Сработал метод approve!!!!!!!");},
    reject:  () => { onReject?.(applicationId);  setAppStatus('rejected');  console.log("Сработал метод reject!!!!!!!");},
    cancel:  () => { onCancel?.(applicationId);  setAppStatus('cancelled'); console.log("Сработал метод cancel!!!!!!!");},
    resend:  () => { onSending?.(applicationId); setAppStatus('sent'); console.log("Сработал метод resend!!!!!!!");},
    viewDetails: () => { onViewDetails?.(applicationId); },
  };

  return (
    <div className={`${base.card} ${styles.appBackground}`}>
      <div className={base['card-header']}>
        <h3 className={base['card-name']}>Студент: {studentName}</h3>
        {teamName && (
          <h3 className={base['card-name']}>Команда: {teamName}</h3>
        )}
      </div>

      <div className={base['card-body']}>
        {teamDescription && (
          <p className={base['card-resume']}>Описание: {teamDescription}</p>
        )}
        <div className={base['card-tags']}>
          {technologies.length > 0
            ? technologies.map((tech,i) => (
                <span key={i} className={base['card-tag']}>
                  {typeof tech === 'object' ? tech.name : tech}
                </span>
              ))
            : <span className={base.noTags}>-</span>
          }
        </div>

        {statusText && (
          <span className={`${styles.statusTag} ${statusClass}`}>
            {statusText}
          </span>
        )}
      </div>

      <div className={base['card-actions']}>
        {appStatus === 'sent' && (
          showCaptainOptions || isAdmin
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

        {appStatus === 'cancelled' && (
          <button
            className={`${base['action-button']} ${styles.apply}`}
            onClick={handlers.resend}
          >
            {sendingText}
          </button>
        )}

        <a href={`/teams/${teamId}`} className={base['action-link']}>
          <button className={base['action-button']}>К команде</button>
        </a>
        <a href={`/students/${studentId}`} className={base['action-link']}>
          <button className={base['action-button']}>К студенту</button>
        </a>
      </div>
    </div>
  );
}