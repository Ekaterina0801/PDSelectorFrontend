import React from "react";
import styles from './TeamProfileCard.module.scss';

const TeamProfileCard = ({
  team,
  isCaptain,
  showEditForm,
  onEditClick,
  showButton,
  buttonText,
  buttonClass,
  onAction,
}) => (
  <div className={styles.teamInfoCard}>
    <div className={styles.teamHeader}>
      <div className={styles.teamHeaderTop}>
        <h2 className={styles.teamName}>{team?.name}</h2>

        {!isCaptain && showButton && (
          <button
            className={`${styles.applicationCard} ${buttonClass || ''}`}
            onClick={onAction}
            disabled={!onAction}
          >
            {buttonText}
          </button>
        )}

        {!isCaptain && (
          <button
            className={styles.button}
            onClick={onEditClick}
          >
            {showEditForm ? 'Закрыть' : 'Редактировать'}
          </button>
        )}
      </div>

      <div className={styles.teamHeaderCenter}>
        <span className={styles.teamTypeBadge}>
          {team?.project_type?.name || 'Не указано'}
        </span>
      </div>
    </div>

    <div className={styles.teamContentGrid}>
      <div>
        <h3 className={styles.sectionTitle}>Описание проекта</h3>
        <p className={styles.teamDescription}>
          {team?.project_description || 'Описание отсутствует.'}
        </p>

        <h3 className={styles.sectionTitle}>Технологии</h3>
        <div className={styles.cardTags}>
          {team?.technologies?.length ? (
            team.technologies.map((tech, idx) => (
              <span className={styles.cardTag} key={idx}>
                {typeof tech === 'object' ? tech.name : tech}
              </span>
            ))
          ) : (
            <span className={styles.techTag}>-</span>
          )}
        </div>
      </div>

      <div>
        <h3 className={styles.sectionTitle}>Капитан команды</h3>
        <div className={styles.captainCard}>
          <img
            src={team?.captain?.avatarUrl || '/default-avatar.png'}
            alt="Аватар капитана"
            className={styles.captainAvatar}
          />
          <div className={styles.captainDetails}>
            <span className={styles.captainName}>
              {team?.captain?.fio || 'Неизвестно'}
            </span>
            <span className={styles.captainRole}>Капитан</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TeamProfileCard;