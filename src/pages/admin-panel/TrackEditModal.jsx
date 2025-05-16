import Modal from "../../components/forms/modal/Modal"
import { observer } from "mobx-react"
import styles from "./TrackEditModal.module.scss";
import { useState, useEffect } from "react";
const TrackEditModal = observer(({ show, track, onClose, onSave }) => {
    const [name,        setName]        = useState('');
    const [startDate,   setStartDate]   = useState('');
    const [endDate,     setEndDate]     = useState('');
    const [description, setDescription] = useState('');
    const [maxConstraint, setMaxConstraint] = useState(7);
    const [maxSecondCourseConstraint, setMaxSecondCourseConstraint] = useState(3);
    const [minConstraint, setMinConstraint] = useState(3);
    const [type, setType] = useState('bachelor');
  
    // инициализация полей
    useEffect(() => {
      if (!track) return;
      setName(track.name || '');
      // даты
      if (Array.isArray(track.startDate)) {
        const [Y, M, D] = track.startDate;
        setStartDate(new Date(Y, M - 1, D).toISOString().slice(0, 10));
      } else {
        setStartDate('');
      }
      if (Array.isArray(track.endDate)) {
        const [Y, M, D] = track.endDate;
        setEndDate(new Date(Y, M - 1, D).toISOString().slice(0, 10));
      } else {
        setEndDate('');
      }
      setDescription(track.about || '');
      setMaxConstraint(track.maxConstraint ?? 7);
      setMaxSecondCourseConstraint(track.maxSecondCourseConstraint ?? 3);
      setMinConstraint(track.minConstraint ?? 3);
      setType(track.type || 'bachelor');
    }, [track]);
  
    if (!show) return null;
  
    const handleSubmit = () => {
      onSave({
        id:   track?.id,
        name,
        startDate,
        endDate,
        about: description,
        maxConstraint,
        maxSecondCourseConstraint,
        minConstraint,
        type,
      });
    };
  
    return (
      <Modal
        show
        onClose={onClose}
        title={track?.id ? 'Редактирование трека' : 'Новый трек'}
      >
        <div className={styles.form}>
          <label className={styles.field}>
            Название
            <input value={name} onChange={e => setName(e.target.value)} />
          </label>
  
          <label className={styles.field}>
            Дата начала
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </label>
  
          <label className={styles.field}>
            Дата окончания
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </label>
  
          <label className={styles.field}>
            Описание
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </label>
  
          <label className={styles.field}>
            Min участников
            <input
              type="number" min={1}
              value={minConstraint}
              onChange={e => setMinConstraint(+e.target.value)}
            />
          </label>
  
          <label className={styles.field}>
            Max участников
            <input
              type="number" min={minConstraint}
              value={maxConstraint}
              onChange={e => setMaxConstraint(+e.target.value)}
            />
          </label>
  
          <label className={styles.field}>
            Max 2-го курса
            <input
              type="number" min={0}
              value={maxSecondCourseConstraint}
              onChange={e => setMaxSecondCourseConstraint(+e.target.value)}
            />
          </label>
  
          <label className={styles.field}>
            Тип обучения
            <select value={type} onChange={e => setType(e.target.value)}>
              <option value="bachelor">bachelor</option>
              <option value="master">master</option>
              <option value="phd">phd</option>
            </select>
          </label>
  
          <div className={styles.actions}>
            <button
              className={styles.btnSave}
              onClick={handleSubmit}
              disabled={!name || !startDate || !endDate}
            >
              {track?.id ? 'Сохранить' : 'Создать'}
            </button>
            <button className={styles.btnCancel} onClick={onClose}>
              Отменить
            </button>
          </div>
        </div>
      </Modal>
    );
  });
  
  export default TrackEditModal;