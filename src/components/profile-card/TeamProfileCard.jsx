import React from "react";
import styles from './TeamProfileCard.module.scss';
import { observer } from "mobx-react";
import authStore from "../../stores/authStore";
import { useApplicationActions } from "../../hooks/useApplicationActions";
import applicationStore from "../../stores/applicationStore";
import Loader from "../spinner/Loader";
const STATUS_LABELS = {
  sent:      'Заявка отправлена',
  accepted:  'Заявка принята',
  rejected:  'Заявка отклонена',
  cancelled: 'Заявка отменена',
}

const TeamProfileCard = observer(({
  team,
  isCaptain,
  isAdmin,
  showEditForm,
  onEditClick,
}) => {
  // ID текущего пользователя-студента
  const currentUserId = authStore.studentId

  // Показываем секцию заявки только если это не капитан и studentId загружен
  const showRequestSection = !isCaptain && currentUserId != null 

  // Подключаемся к хуку для работы с заявкой
  const { status, actions, loading, error } = useApplicationActions({
    type:      'request',
    teamId:    team.id,
    studentId: currentUserId,
  })

  return (
    <div className={styles.teamInfoCard}>
      <div className={styles.teamHeader}>
        <div className={styles.teamHeaderTop}>
          {/* Название команды */}
          <h2 className={styles.teamName}>{team.name}</h2>

          {/* Редактирование (для капитана или админа) */}
          {(isCaptain || isAdmin) && (
            <button
              className={styles.button}
              onClick={onEditClick}
            >
              {showEditForm ? 'Закрыть' : 'Редактировать'}
            </button>
          )}

          {/* Секция подачи/отмены заявки (для обычного студента) */}
          {showRequestSection && (
            <div className={styles.requestActions}>
              {loading && <Loader size="small" />}

              {error && (
                <span className={styles.error}>
                  {error}
                </span>
              )}

              {status && (
                <span className={`${styles.statusTag} ${styles[status] || ''}`}>
                  {STATUS_LABELS[status] || status}
                </span>
              )}

              {actions.map(act => (
                <button
                  key={act.key}
                  className={styles.actionButton}
                  onClick={act.handler}
                >
                  {act.text}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.teamHeaderCenter}>
          <span className={styles.teamTypeBadge}>
            {team.project_type?.name || 'Не указано'}
          </span>
        </div>
      </div>

      <div className={styles.teamContentGrid}>
        {/* Левая колонка: описание и технологии */}
        <div>
          <h3 className={styles.sectionTitle}>Описание проекта</h3>
          <p className={styles.teamDescription}>
            {team.project_description || 'Описание отсутствует.'}
          </p>

          <h3 className={styles.sectionTitle}>Технологии</h3>
          <div className={styles.cardTags}>
            {team.technologies?.length > 0
              ? team.technologies.map((tech, i) => (
                  <span key={i} className={styles.cardTag}>
                    {tech.name}
                  </span>
                ))
              : <span className={styles.noTags}>-</span>
            }
          </div>
        </div>

        {/* Правая колонка: карточка капитана */}
        <div>
          <h3 className={styles.sectionTitle}>Капитан команды</h3>
          <div className={styles.captainCard}>
            <img
              src={team.captain.avatarUrl || '/images/placeholder2.png'}
              alt="Аватар капитана"
              className={styles.captainAvatar}
            />
            <div className={styles.captainDetails}>
              <span className={styles.captainName}>
                {team.captain.user.fio}
              </span>
              <span className={styles.captainRole}>
                Капитан
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default TeamProfileCard