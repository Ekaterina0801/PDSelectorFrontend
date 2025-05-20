import React from 'react';
import PropTypes from 'prop-types';
import Loader from '../../spinner/Loader';
import styles from './ProfileCard.module.scss';
import baseStyles from '@/components/card/BaseCard.module.scss'
import { observer } from 'mobx-react';
import authStore from '../../../stores/authStore';
import { useApplicationActions } from '../../../hooks/useApplicationActions';
import { useMemo, useEffect } from 'react';
import studentStore from '../../../stores/studentStore';
import { IoContractOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
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
const ProfileCard = observer(function ProfileCard({
  studentData,
  onEdit,
  isCurrentUser,
  isAdmin,
}) {
  if (!studentData) return <Loader />;



  console.log('')
  const authStudent = authStore.authStudent;
  const currentUserId = authStudent?.id;
  console.log('authStudent', authStudent)
  const team = studentData?.current_team;
  console.log('Authteam', team)
  const isCaptain = authStore.authStudent?.is_captain;
  const teamId    = authStore.authStudent?.current_team?.id;
  const studentId = studentData.id;
  

  // Показываем кнопку приглашения, только если:
  // - текущий пользователь — капитан этой команды
  // - это не его собственный профиль
  // - у студента уже есть команда
  const shouldShowInvite =
    isCaptain &&
    teamId != null &&
    studentId !== currentUserId
    && !studentData.current_team
    && authStore.authStudent?.current_track?.id === studentData.current_track?.id;
    console.log('STUD_DATA', studentData.current_track?.id)
    console.log('authSTUDENT', authStore.authStudent?.current_track?.id)
    console.log('shouldShowInvite', shouldShowInvite)
    console.log('isCaptain', isCaptain)
    console.log('teamId', teamId)
    console.log('studentId', studentId)

  // Используем наши готовые кнопки из хука
  const { status, actions, loading, error } = useApplicationActions({
    type:      'invite',
    teamId,
    studentId,
  });

  const STATUS_LABELS = {
    sent:      'Приглашение отправлено',
    accepted:  'Приглашение принято',
    rejected:  'Приглашение отклонено',
    cancelled: 'Приглашение отменено',
  };

  return (
    <div className={`${baseStyles.card} ${styles.card}`}>
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
        <Detail label="Трек" value={studentData.current_track.name ?? "—"} />
        <div className={styles.detail}>
          <p className={styles.label}>Команда:</p>
          <p className={styles.value}>
            {studentData.current_team ? (
              <Link to={`/teams/${studentData.current_team.id }`} className={styles.teamLink}>
                {studentData.current_team.name}
              </Link>
            ) : (
              'Нет команды'
            )}
          </p>
        </div>
        <div className={styles.detail}>
          <p className={styles.label}>Технологии:</p>
          <div className={styles.tags}>
            {studentData.technologies?.length ? (
              studentData.technologies.map(t => (
                <span key={t.id} className={styles.tag}>{t.name}</span>
              ))
            ) : (
              <span className={styles.noTag}>—</span>
            )}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        { (isCurrentUser || isAdmin) ? (
          <button className={styles.editButton} onClick={onEdit}>
            Редактировать профиль
          </button>
        ) : shouldShowInvite ? (
          <div className={styles.inviteSection}>
            {loading && <Loader size="small" />}
            {error   && <div className={styles.error}>{error}</div>}
            {status && (
              <div className={`${styles.statusTag} ${styles[status]}`}>
                {STATUS_LABELS[status]}
              </div>
            )}
            {actions.map(act => (
              <button
                key={act.key}
                className={`${styles.actionButton}`}
                onClick={act.handler}
                disabled={loading}
              >
                {act.text}
              </button>
            ))}
          </div>
        ) : null }
      </footer>
    </div>
  );
});

ProfileCard.propTypes = {
  studentData: PropTypes.shape({
    avatar: PropTypes.string,
    user: PropTypes.shape({ fio: PropTypes.string, id: PropTypes.number }),
    course: PropTypes.number,
    group_number: PropTypes.number,
    contacts: PropTypes.string,
    about_self: PropTypes.string,
    current_team: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      captainId: PropTypes.number,
    }),
    technologies: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
      })
    ),
  }).isRequired,
  onEdit: PropTypes.func,
  isCurrentUser: PropTypes.bool,
  isAdmin: PropTypes.bool,
};

export default ProfileCard;