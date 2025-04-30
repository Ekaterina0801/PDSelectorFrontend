import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import trackStore from "../../../stores/trackStore";
import styles from './RegistrationForm.module.scss';

const RegistrationForm = observer(({ onSubmit, onSkip }) => {
  const { tracks, fetchTracks } = trackStore;

  const [formData, setFormData] = useState({
    course: '',
    groupNumber: '',
    aboutSelf: '',
    contacts: '',
    currentTrackId: ''
  });

  const [errors, setErrors] = useState({ course: false, groupNumber: false, track: false });

  useEffect(() => {
    if (!tracks.length) fetchTracks();
  }, [tracks, fetchTracks]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const newErrs = {
      course: !formData.course,
      groupNumber: !formData.groupNumber,
      track: !formData.currentTrackId
    };
    setErrors(newErrs);
    if (!Object.values(newErrs).some(Boolean)) {
      onSubmit({
        course: formData.course,
        group_number: formData.groupNumber,
        about_self: formData.aboutSelf,
        contacts: formData.contacts,
        current_track_id: formData.currentTrackId
      });
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.loginContainer}>
        <div className={styles.loginImage}>
          <img src="/images/logo3.png" alt="Logo" />
        </div>
        <div className={styles.loginContent}>
          <h2 className={styles.welcomeText}>Создание аккаунта студента</h2>
          <form className={styles.registrationForm} noValidate>
            <label htmlFor="course">Курс</label>
            <input
              id="course"
              name="course"
              type="number"
              value={formData.course}
              onChange={handleChange}
              placeholder="Введите курс"
              className={errors.course ? styles.inputError : ''}
            />
            {errors.course && <p className={styles.errorText}>Курс обязателен</p>}

            <label htmlFor="groupNumber">Номер группы</label>
            <input
              id="groupNumber"
              name="groupNumber"
              type="number"
              value={formData.groupNumber}
              onChange={handleChange}
              placeholder="Введите номер группы"
              className={errors.groupNumber ? styles.inputError : ''}
            />
            {errors.groupNumber && <p className={styles.errorText}>Группа обязательна</p>}

            <label htmlFor="aboutSelf">О себе</label>
            <textarea
              id="aboutSelf"
              name="aboutSelf"
              rows="4"
              value={formData.aboutSelf}
              onChange={handleChange}
              placeholder="Расскажите о себе"
            />

            <label htmlFor="contacts">Контакты</label>
            <input
              id="contacts"
              name="contacts"
              type="text"
              value={formData.contacts}
              onChange={handleChange}
              placeholder="Введите контакты"
            />

            <label htmlFor="currentTrackId">Выберите трек</label>
            <select
              id="currentTrackId"
              name="currentTrackId"
              value={formData.currentTrackId}
              onChange={handleChange}
              className={errors.track ? styles.inputError : ''}
            >
              <option value="">Выберите трек</option>
              {tracks.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            {errors.track && <p className={styles.errorText}>Трек обязателен</p>}

            <div className={styles.formButtons}>
              <button
                type="button"
                className={styles.registerButton}
                onClick={handleSubmit}
              >
                Завершить регистрацию
              </button>
              <button
                type="button"
                className={styles.skipButton}
                onClick={onSkip}
              >
                Продолжить без регистрации
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

RegistrationForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onSkip: PropTypes.func
};

export default RegistrationForm;
