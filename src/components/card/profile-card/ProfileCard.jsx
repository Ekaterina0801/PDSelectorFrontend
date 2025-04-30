import React from 'react';
import PropTypes from 'prop-types';
import Loader from '../../spinner/Loader';
import styles from './ProfileCard.module.scss';

const ProfileCard = ({
  studentData,
  onEdit,
  isCurrentUser,
  showButton,
  applicationStatus,
  onApply,
  isLoading
}) => {
  if (!studentData) return <Loader />;

  let btnText = 'Подать заявку';
  let btnClass = styles.default;
  if (applicationStatus) {
    switch (applicationStatus.toLowerCase()) {
      case 'pending':
        btnText = 'Заявка отправлена';
        btnClass = styles.pending;
        break;
      case 'approved':
        btnText = 'Заявка одобрена';
        btnClass = styles.approved;
        break;
      case 'rejected':
        btnText = 'Заявка отклонена';
        btnClass = styles.rejected;
        break;
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatarWrapper}>
          <img
            src={studentData.avatar || '/images/placeholder2.png'}
            alt="Avatar"
            className={styles.avatar}
          />
        </div>
        <div className={styles.info}>
          <h2 className={styles.name}>{studentData.user?.fio || 'Имя Фамилия'}</h2>
          <p className={styles.course}>
            Курс: {studentData.course || 'Не указан'}
          </p>
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.detail}>
          <span className={styles.label}>Группа:</span>
          <span className={styles.value}>
            {studentData.group_number || 'Не указана'}
          </span>
        </div>
        <div className={styles.detail}>
          <span className={styles.label}>Контакты:</span>
          <span className={styles.value}>
            {studentData.contacts || 'Не указаны'}
          </span>
        </div>
        <div className={styles.detail}>
          <span className={styles.label}>Технологии:</span>
          <div className={styles.tags}>
            {studentData.technologies?.length
              ? studentData.technologies.map((t, i) => (
                  <span key={i} className={styles.tag}>
                    {t.name}
                  </span>
                ))
              : <span className={styles.noTags}>-</span>}
          </div>
        </div>
      </div>

      {isCurrentUser
        ? <button className={styles.editBtn} onClick={onEdit}>
            Редактировать
          </button>
        : showButton && (
            isLoading
              ? <button className={`${styles.appBtn} ${styles.loading}`} disabled>
                  Загрузка...
                </button>
              : <button
                  className={`${styles.appBtn} ${btnClass}`}
                  onClick={onApply}
                >
                  {btnText}
                </button>
          )
      }
    </div>
  );
};

ProfileCard.propTypes = {
  studentData: PropTypes.object.isRequired,
  onEdit: PropTypes.func,
  isCurrentUser: PropTypes.bool,
  showButton: PropTypes.bool,
  applicationStatus: PropTypes.string,
  onApply: PropTypes.func,
  isLoading: PropTypes.bool
};

export default ProfileCard;
