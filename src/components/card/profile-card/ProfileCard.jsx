import React from 'react';
import PropTypes from 'prop-types';
import Loader from '../../spinner/Loader';
import styles from './ProfileCard.module.scss';
import base from '@/components/card/BaseCard.module.scss'
import { observer } from 'mobx-react';
const ProfileCard = observer(function ProfileCard({
  studentData,
  onEdit,
  isCurrentUser,
  showButton,
  applicationStatus,
  onApply,
  isLoading,
  isAdmin
}) {
  if (!studentData) return <Loader />;

  // «разворачиваем» observable.array в чистый JS-массив
  const techs = studentData.technologies?.slice() || [];
  console.log('techs', techs);

  let btnText = "Подать заявку";
  let btnClass = styles.default;
  if (applicationStatus) {
    switch (applicationStatus.toLowerCase()) {
      case "pending":
        btnText = "Заявка отправлена";
        btnClass = styles.pending;
        break;
      case "approved":
        btnText = "Заявка одобрена";
        btnClass = styles.approved;
        break;
      case "rejected":
        btnText = "Заявка отклонена";
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
            src={studentData.avatar || "/images/placeholder2.png"}
            alt="Avatar"
            className={styles.avatar}
          />
        </div>
        <div className={styles.info}>
          <h2 className={styles.name}>
            {studentData.user?.fio || "Имя Фамилия"}
          </h2>
          <p className={styles.course}>
            Курс: {studentData.course ?? "—"}
          </p>
        </div>
      </header>

      <section className={styles.details}>
        <Detail label="Группа" value={studentData.group_number ?? "—"} />
        <Detail label="Контакты" value={studentData.contacts ?? "—"} />
        <Detail label="О себе" value={studentData.about_self ?? "—"} />
        <Detail
          label="Команда"
          value={studentData.current_team?.name ?? "Нет команды"}
        />

        <div className={styles.detail}>
          <p className={styles.label}>Технологии:</p>
          <div className={styles.tags}>
            {techs.length > 0 ? (
              techs.map((t) => (
                <p key={t.id} className={styles.tag}>
                  {t.name}
                </p>
              ))
            ) : (
              <span className={styles.noTag}>—</span>
            )}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        {(isCurrentUser || isAdmin) ? (
          <button className={styles.editButton} onClick={onEdit}>
            Редактировать профиль
          </button>
        ) : (
          showButton && (
            <button
              className={`${styles.applicationButton} ${btnClass} ${
                isLoading ? styles.loading : ""
              }`}
              onClick={onApply}
              disabled={isLoading}
            >
              {isLoading ? "Загрузка…" : btnText}
            </button>
          )
        )}
      </footer>
    </div>
  );
});

const Detail = ({ label, value }) => (
  <div className={styles.detail}>
    <p className={styles.label}>{label}:</p>
    <p className={styles.value}>{value}</p>
  </div>
);

Detail.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
};

ProfileCard.propTypes = {
  studentData: PropTypes.shape({
    avatar: PropTypes.string,
    user: PropTypes.shape({ fio: PropTypes.string }),
    course: PropTypes.number,
    group_number: PropTypes.number,
    contacts: PropTypes.string,
    about_self: PropTypes.string,
    current_team: PropTypes.shape({ name: PropTypes.string }),
    technologies: PropTypes.arrayOf(
      PropTypes.shape({ id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), name: PropTypes.string })
    ),
  }).isRequired,
  onEdit: PropTypes.func,
  isCurrentUser: PropTypes.bool,
  showButton: PropTypes.bool,
  applicationStatus: PropTypes.string,
  onApply: PropTypes.func,
  isLoading: PropTypes.bool,
  isAdmin: PropTypes.bool,
};

export default ProfileCard;