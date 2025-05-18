import { useState, useEffect } from "react";
import Modal from "../forms/modal/Modal";
import styles from "./TeamEditForm.module.scss";
import studentStore from "../../stores/studentStore";
import trackStore from "../../stores/trackStore";

const ProfileEditForm = ({ studentData, onSave, onCancel, allTechnologies }) => {
  const [track, setTrack] = useState("");
  useEffect(() => {
    setTrack(studentData.current_track?.id.toString() || "");
  }, [studentData]);

  useEffect(() => {
    if (track) studentStore.fetchStudents({ trackId: track });
  }, [track]);

  const [formData, setFormData] = useState({
    ...studentData,
    user: { ...studentData.user },
    technologies: studentData.technologies || [],
    track: track
  });
  const [showModal, setShowModal] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'fio') {
      setFormData(prev => ({
        ...prev,
        user: { ...prev.user, fio: value }
      }));
    } else if (name === "track") {
      setFormData(prev => ({ ...prev, track: value }));
      setTrack(value);
    }
      else {
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

        <label>
          ФИО:
          <input
            type="text"
            name="fio"
            value={formData.user?.fio || ''}
            onChange={handleChange}
          />
        </label>

        <label>
          Курс:
          <input
            type="number"
            name="course"
            value={formData.course || ''}
            onChange={handleChange}
          />
        </label>

        <label>
          Группа:
          <input
            type="text"
            name="group_number"
            value={formData.group_number || ''}
            onChange={handleChange}
          />
        </label>

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

        <label className={styles.field}>
            Трек
            <select value={track} name = "track" onChange={handleChange}>
              <option value="">Выберите трек</option>
              {trackStore.tracks.map((t) => (
                <option key={t.id} value={t.id.toString()}>
                  {t.name}
                </option>
              ))}
            </select>
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
                      className={styles.checkbox}
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
