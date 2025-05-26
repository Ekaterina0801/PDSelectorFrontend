import { useState, useEffect } from "react";
import Modal from "../forms/modal/Modal";
import styles from "./TeamEditForm.module.scss";
import teamStore from "../../stores/teamStore";
import {toJS} from "mobx";
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
  console.log("teamData", toJS(teamData));
  useEffect(() => {
    setFormData({
      ...teamData,
      technologies: teamData.technologies || [],
      projectType: teamData.projectType || null,
      studentIds: teamData.students?.map((s) => s.id) || [],
      current_track_id: teamData.current_track,
      captain_id: teamData.captain?.id,
    });
  }, [teamData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProjectTypeChange = (e) => {
    const id = e.target.value;
    setFormData((prev) => ({
      ...prev,
      project_type: projectTypes.find((t) => Number(t.id) === Number(id)),
    }));
  };

  const handleRemoveTechnology = (idToRemove) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t.id !== idToRemove),
    }));
  };

  const toggleModal = () => setShowModal((prev) => !prev);

  const handleSave = () => {
    console.log('Saving payload', toJS(formData));
    onSave(formData);
  };

  const handleTechnologyChange = (tech) => {
    const exists = formData.technologies.some((t) => t.id === tech.id);
    setFormData((prev) => ({
      ...prev,
      technologies: exists
        ? prev.technologies.filter((t) => t.id !== tech.id)
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
            value={formData.name || ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Описание проекта:
          <textarea
            name="project_description"
            value={formData.project_description || ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Тип проекта:
          <ul className={styles.projectTypeList}>
            {projectTypes.map((type) => (
              <li key={type.id} className={styles.projectTypeItem}>
                <input
                  type="radio"
                  id={`project_type-${type.id}`}
                  name="project_type"
                  value={type.id}
                  checked={formData.project_type?.id === type.id}
                  onChange={handleProjectTypeChange}
                  className="sr-only"
                />
                <label htmlFor={`project_type-${type.id}`}>{type.name}</label>
              </li>
            ))}
          </ul>
        </label>

        <label>
          <span className={styles.textCapture}>Технологии:</span>
          <div className={styles.cardTags}>
            {formData.technologies.length > 0 ? (
              formData.technologies.map((tech) => (
                <span key={tech.id} className={styles.cardTag}>
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

        <label>
          Капитан команды:
          <select
            name="captain_id"
            value={formData.captain_id || ""}
            onChange={handleChange}
          >
            <option value="">-- Выберите капитана --</option>
            {teamData.students?.map((student) => (
              <option key={student?.id} value={student?.id}>
                {student.user.fio}
              </option>
            ))}
          </select>
        </label>

        <div className={styles.formButtons}>
          <button type="button" onClick={toggleModal}>
            Добавить технологию
          </button>
          <button
            type="button"
            className={styles.saveButton}
            onClick={handleSave}
          >
            Сохранить
          </button>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
          >
            Отменить
          </button>
        </div>
      </div>

      {showModal && (
        <Modal show onClose={toggleModal}>
          <div className={styles.modalContent}>
            <h2>Добавить технологию</h2>
            <div className={styles.technologiesList}>
              {allTechnologies.map((tech) => (
                <div key={tech.id} className={styles.technologyCheckbox}>
                  <input
                    className = {styles.checkbox}
                    type="checkbox"
                    id={`tech-${tech.id}`}
                    checked={formData.technologies.some(
                      (t) => t.id === tech.id
                    )}
                    onChange={() => handleTechnologyChange(tech)}
                  />
                  <label htmlFor={`tech-${tech.id}`}>{tech.name}</label>
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
