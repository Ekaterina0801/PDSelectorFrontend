import React from 'react';
import PropTypes from 'prop-types';
import Loader from '../../spinner/Loader';
import styles from './ProfileCard.module.scss';
import base from '@/components/card/BaseCard.module.scss'
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
      default:
        break;
    }
  }

  return (
    <div className={`${base.card} ${styles.card}`}>
      <header className={styles.header}>
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
      </header>

      <section className={styles.details}>
        <Detail label="Группа" value={studentData.group_number || '—'} />
        <Detail label="Контакты" value={studentData.contacts || '—'} />
        <div className={styles.detail}>
          <p className={styles.label}>Технологии:</p>
          <div className={styles.tags}>
            {studentData.technologies?.length
              ? studentData.technologies.map(t => (
                  <p key={t.id} className={styles.tag}>
                    {t.name}
                  </p>
                ))
              : <span className={styles.noTag}>—</span>}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        {isCurrentUser ? (
          <button className={styles.editButton} onClick={onEdit}>
            Редактировать профиль
          </button>
        ) : (
          showButton && (
            <button
              className={`${styles.applicationButton} ${btnClass} ${isLoading ? styles.loading : ''}`}
              onClick={onApply}
              disabled={isLoading}
            >
              {isLoading ? 'Загрузка…' : btnText}
            </button>
          )
        )}
      </footer>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div className={styles.detail}>
    <p className={styles.label}>{label}:</p>
    <p className={styles.value}>{value}</p>
  </div>
);

Detail.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired
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