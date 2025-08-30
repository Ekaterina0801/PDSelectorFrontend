import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import trackStore from "../../../stores/trackStore";
import styles from "./RegistrationForm.module.scss";
import { useMemo } from "react";
const COURSE_MIN = 1;
const COURSE_MAX = 6;
const GROUP_MIN = 1;
const GROUP_MAX = 10;


function useRegistrationForm(onSubmit) {
  const clamp = useMemo(
    () => ({
      course: (v) => Math.max(COURSE_MIN, Math.min(COURSE_MAX, v)),
      group: (v) => Math.max(GROUP_MIN, Math.min(GROUP_MAX, v)),
    }),
    []
  );

  const toApi = (f) => ({
    course: Number(f.course),
    group_number: Number(f.groupNumber),
    about_self: f.aboutSelf || "",
    contacts: f.contacts || "",
    current_track_id: f.currentTrackId,
  });

  const validate = (f) => {
    const e = {};
    if (f.course === "" || f.course == null) e.course = "Курс обязателен";
    if (f.groupNumber === "" || f.groupNumber == null)
      e.groupNumber = "Группа обязательна";
    if (!f.currentTrackId) e.track = "Трек обязателен";

    const c = Number(f.course);
    if (!Number.isNaN(c) && (c < COURSE_MIN || c > COURSE_MAX)) {
      e.course = `Курс должен быть ${COURSE_MIN}–${COURSE_MAX}`;
    }
    const g = Number(f.groupNumber);
    if (!Number.isNaN(g) && (g < GROUP_MIN || g > GROUP_MAX)) {
      e.groupNumber = `Группа должна быть ${GROUP_MIN}–${GROUP_MAX}`;
    }
    return e;
  };

  async function submit(form, setErrors, onSubmitCb = onSubmit) {
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    await Promise.resolve(onSubmitCb(toApi(form)));
  }

  return { clamp, submit };
}


const RegistrationForm = observer(({ onSubmit, onSkip }) => {
  const { tracks, fetchTracks } = trackStore;

  const [formData, setFormData] = useState({
    course: "",
    groupNumber: "",
    aboutSelf: "",
    contacts: "",
    currentTrackId: "",
  });

  const [errors, setErrors] = useState({});

  const { clamp, submit } = useRegistrationForm(onSubmit);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "course") {
      const next = value === "" ? "" : clamp.course(Number(value));
      return setFormData((p) => ({ ...p, course: next }));
    }
    if (name === "groupNumber") {
      const next = value === "" ? "" : clamp.group(Number(value));
      return setFormData((p) => ({ ...p, groupNumber: next }));
    }
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = () => submit(formData, setErrors);

return (
  <div className={styles.background}>
    <div className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>Создание аккаунта студента</h2>
        <p className={styles.subtitle}>Заполни поля ниже — это займёт минуту</p>
      </header>

      <form className={styles.form} noValidate>
        <div className={styles.grid}>
          {/* КУРС */}
          <div className={`${styles.field} ${errors.course ? styles.hasError : ''}`}>
            <div className={styles.labelRow}>
              <label htmlFor="course" className={styles.label}>Курс</label>
              <span className={styles.hint}>{COURSE_MIN}–{COURSE_MAX}</span>
            </div>
            <input
              id="course"
              name="course"
              type="number"
              inputMode="numeric"
              min={COURSE_MIN}
              max={COURSE_MAX}
              step={1}
              value={formData.course}
              onChange={handleChange}
              placeholder="Введите курс"
              className={styles.input}
              aria-invalid={!!errors.course}
              aria-describedby={errors.course ? "course-error" : undefined}
            />
            {errors.course && (
              <p id="course-error" className={styles.errorText} aria-live="polite">
                {errors.course}
              </p>
            )}
          </div>

          {/* ГРУППА */}
          <div className={`${styles.field} ${errors.groupNumber ? styles.hasError : ''}`}>
            <div className={styles.labelRow}>
              <label htmlFor="groupNumber" className={styles.label}>Номер группы</label>
              <span className={styles.hint}>{GROUP_MIN}–{GROUP_MAX}</span>
            </div>
            <input
              id="groupNumber"
              name="groupNumber"
              type="number"
              inputMode="numeric"
              min={GROUP_MIN}
              max={GROUP_MAX}
              step={1}
              value={formData.groupNumber}
              onChange={handleChange}
              placeholder="Введите номер группы"
              className={styles.input}
              aria-invalid={!!errors.groupNumber}
              aria-describedby={errors.groupNumber ? "group-error" : undefined}
            />
            {errors.groupNumber && (
              <p id="group-error" className={styles.errorText} aria-live="polite">
                {errors.groupNumber}
              </p>
            )}
          </div>

          {/* ТРЕК (на всю ширину) */}
          <div className={`${styles.field} ${styles.colSpan2} ${errors.track ? styles.hasError : ''}`}>
            <label htmlFor="currentTrackId" className={styles.label}>Выберите трек</label>
            <select
              id="currentTrackId"
              name="currentTrackId"
              value={formData.currentTrackId}
              onChange={handleChange}
              className={`${styles.input} ${styles.select}`}
              aria-invalid={!!errors.track}
              aria-describedby={errors.track ? "track-error" : undefined}
            >
              <option value="">Выберите трек</option>
              {tracks.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            {errors.track && (
              <p id="track-error" className={styles.errorText} aria-live="polite">
                {errors.track}
              </p>
            )}
          </div>

          {/* О СЕБЕ (на всю ширину) */}
          <div className={`${styles.field} ${styles.colSpan2}`}>
            <label htmlFor="aboutSelf" className={styles.label}>О себе</label>
            <textarea
              id="aboutSelf"
              name="aboutSelf"
              rows={4}
              value={formData.aboutSelf}
              onChange={handleChange}
              placeholder="Расскажите о себе"
              className={`${styles.input} ${styles.textarea}`}
            />
          </div>

          {/* КОНТАКТЫ */}
          <div className={`${styles.field} ${styles.colSpan2}`}>
            <label htmlFor="contacts" className={styles.label}>Контакты</label>
            <input
              id="contacts"
              name="contacts"
              type="text"
              value={formData.contacts}
              onChange={handleChange}
              placeholder="Введите контакты"
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={handleSubmit}
          >
            Завершить регистрацию
          </button>
          <button
            type="button"
            className={styles.ghostBtn}
            onClick={onSkip}
          >
            Продолжить без регистрации
          </button>
        </div>
      </form>
    </div>
  </div>
);

});

RegistrationForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onSkip: PropTypes.func,
};

export default RegistrationForm;