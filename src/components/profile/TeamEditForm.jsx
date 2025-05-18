import { useState, useEffect } from "react";
import Modal from "../forms/modal/Modal";
import styles from './TeamEditForm.module.scss';

const TeamEditForm = ({
  teamData,
  onSave,
  onCancel,
  allTechnologies,
  projectTypes,
}) => {
  const [formData, setFormData] = useState({
    ...teamData,
    technologies: teamData.technologies || [],
    projectType: teamData.projectType || null,
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setFormData({
      ...teamData,
      technologies: teamData.technologies || [],
      projectType: teamData.projectType || null,
    });
  }, [teamData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProjectTypeChange = e => {
    const id = e.target.value;
    setFormData(prev => ({
      ...prev,
      projectType: projectTypes.find(t => Number(t.id) === Number(id)),
    }));
  };

  const handleRemoveTechnology = idToRemove => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t.id !== idToRemove),
    }));
  };

  const toggleModal = () => setShowModal(prev => !prev);

  const handleSave = () => {
    const flatData = {
      name: formData.name,
      project_description: formData.project_description,
      projectType: formData.projectType,
      technologies: formData.technologies,
    };
    onSave(flatData);
  };

  const handleTechnologyChange = tech => {
    const exists = formData.technologies.some(t => t.id === tech.id);
    setFormData(prev => ({
      ...prev,
      technologies: exists
        ? prev.technologies.filter(t => t.id !== tech.id)
        : [...prev.technologies, tech],
    }));
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileEditForm}>
        <h2>Редактировать команду</h2>

        <label>
          Название команды:
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
          />
        </label>

        <label>
          Описание проекта:
          <textarea
            type="text"
            name="project_description"
            value={formData.project_description || ''}
            onChange={handleChange}
          />
        </label>

        <label>
          Тип проекта:
          <div className={styles.technologiesList}>
            <ul id="projectTypeUl" className="filter-switch">
              {projectTypes.map(type => (
                <li class="filter-switch-item" key={type.id}>
                  <input
                    type="radio"
                    id={`projectType-${type.id}`}
                    name="projectType"
                    value={type.id}
                    checked={formData.projectType?.id === type.id}
                    onChange={handleProjectTypeChange}
                    className="sr-only"
                  />
                  <label htmlFor={`projectType-${type.id}`}>
                    {type.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </label>

        <label>
          <span className={styles.textCapture}>Технологии:</span>
          <div className={styles.cardTags}>
            {formData.technologies.length > 0 ? (
              formData.technologies.map(tech => (
                <span
                  key={tech.id}
                  className={styles.cardTag}
                >
                  {tech.name}
                  <span
                    className={styles.removeIcon}
                    onClick={() => handleRemoveTechnology(tech.id)}
                  >
                    🗑
                  </span>
                </span>
              ))
            ) : (
              <p className={styles.noTags}>-</p>
            )}
          </div>
        </label>

        <div className={styles.formButtons}>
          <button onClick={toggleModal}>Добавить технологию</button>
          <button
            className={styles.saveButton}
            onClick={handleSave}
          >
            Сохранить
          </button>
          <button
            className={styles.cancelButton}
            onClick={onCancel}
          >
            Отменить
          </button>
        </div>
      </div>

      {showModal && (
        <Modal show={showModal} onClose={toggleModal}>
          <div className={styles.modalContent}>
            <h2>Добавить технологию</h2>
            <div className={styles.technologiesList}>
              {allTechnologies.map(tech => (
                <div
                  key={tech.id}
                  className={styles.technologyCheckbox}
                >
                  <input
                    className = {styles.checkbox}
                    type="checkbox"
                    id={`tech-${tech.id}`}
                    checked={formData.technologies.some(t => t.id === tech.id)}
                    onChange={() => handleTechnologyChange(tech)}
                  />
                  <label htmlFor={`tech-${tech.id}`}>
                    {tech.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TeamEditForm;