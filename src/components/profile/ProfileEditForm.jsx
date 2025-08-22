import { useState } from "react";
import Modal from "../forms/modal/Modal";
import styles from "./TeamEditForm.module.scss";
import authStore from "../../stores/authStore";

const ProfileEditForm = ({ studentData, onSave, onCancel, allTechnologies }) => {
  const [formData, setFormData] = useState({
    ...studentData,
    user: { ...studentData.user },
    technologies: studentData.technologies || [],
  });
  const [showModal, setShowModal] = useState(false);
  const isAdmin = authStore.isAdmin;

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'fio') {
      setFormData(prev => ({
        ...prev,
        user: { ...prev.user, fio: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveTechnology = idToRemove => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t.id !== idToRemove),
    }));
  };

  const toggleModal = () => setShowModal(prev => !prev);

  const handleSave = () => {
    // Отправляем на бэкенд весь объект студента
    onSave(formData);
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
        <h2>Редактировать профиль</h2>

        {isAdmin && <label>
          ФИО:
          <input
            type="text"
            name="fio"
            value={formData.user?.fio || ''}
            onChange={handleChange}
          />
        </label>}

        {isAdmin && <label>
          Курс:
          <input
            type="number"
            name="course"
            value={formData.course || ''}
            onChange={handleChange}
          />
        </label>}

        {isAdmin && <label>
          Группа:
          <input
            type="text"
            name="group_number"
            value={formData.group_number || ''}
            onChange={handleChange}
          />
        </label>}

        <label>
          О себе:
          <textarea
            name="about_self"
            value={formData.about_self || ''}
            onChange={handleChange}
          />
        </label>

        <label>
          Контакты:
          <input
            type="text"
            name="contacts"
            value={formData.contacts || ''}
            onChange={handleChange}
          />
        </label>

        <label>
          <span className={styles.textCapture}>Технологии:</span>
          <div className={styles.cardTags}>
            {formData.technologies.length > 0 ? (
              formData.technologies.map(tech => (
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

        <div className={styles.formButtons}>
          <button type="button" onClick={toggleModal}>Добавить технологию</button>
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
        <Modal show={showModal} onClose={toggleModal}>
          <div className={styles.modalContent}>
            <h2>Добавить технологию</h2>
            <div className={styles.technologiesList}>
              {allTechnologies?.length ? (
                allTechnologies.map(tech => (
                  <div
                    key={tech.id}
                    className={styles.technologyCheckbox}
                  >
                    <input
                      type="checkbox"
                      id={`tech-${tech.id}`}
                      checked={formData.technologies.some(t => t.id === tech.id)}
                      onChange={() => handleTechnologyChange(tech)}
                    />
                    <label htmlFor={`tech-${tech.id}`}>
                      {tech.name}
                    </label>
                  </div>
                ))
              ) : (
                <p>Нет доступных технологий</p>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProfileEditForm;
