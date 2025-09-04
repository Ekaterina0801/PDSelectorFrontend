import React from 'react';
import PropTypes from 'prop-types';
import styles from './TeamForm.module.scss';

function TeamForm({ newTeam, onChange, onSubmit, onCancel, technologies, projectTypes }) {
  return (
    <form className={styles.teamForm} onSubmit={onSubmit}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Название команды:</label>
        <input
          className={styles.input}
          name="name"
          value={newTeam.name}
          onChange={onChange}
          placeholder="Введите название"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Описание проекта:</label>
        <textarea
          className={styles.textarea}
          name="projectDescription"
          value={newTeam.projectDescription}
          onChange={onChange}
          placeholder="Краткое описание"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Тип проекта:</label>
        <select
          className={styles.select}
          name="projectType"
          value={newTeam.projectType?.id}
          onChange={onChange}
        >
          <option value="">-- выберите тип --</option>
          {projectTypes.map(pt => (
            <option key={pt.id} value={pt.id}>{pt.name}</option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Технологии:</label>
        <div className={styles.technologiesList}>
          {technologies.length > 0 ? technologies.map(tech => (
            <div key={tech.id} className={styles.technologyCheckbox}>
              <input
                className={styles.checkbox}
                type="checkbox"
                id={`tech-${tech.id}`}
                name="technologies"
                value={tech.id}
                checked={newTeam.technologies.some(t => t.id === tech.id)}
                onChange={onChange}
              />
              <label htmlFor={`tech-${tech.id}`}>{tech.name}</label>
            </div>
          )) : (
            <p className={styles.noTech}>Нет доступных технологий</p>
          )}
        </div>
      </div>

      <div className={styles.formActions}>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>
          Отмена
        </button>
        <button type="submit" className={styles.submitButton}>
          Сохранить
        </button>
      </div>
    </form>
  );
}

TeamForm.propTypes = {
  newTeam: PropTypes.shape({
    name: PropTypes.string,
    projectDescription: PropTypes.string,
    projectType: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    technologies: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number }))
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  technologies: PropTypes.array.isRequired,
  projectTypes: PropTypes.array.isRequired
};

export default TeamForm;
