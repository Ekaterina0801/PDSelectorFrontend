import React, { useState, useEffect } from "react";

import Modal from "../modal/Modal";


const EditableProfile = ({ studentData, canEdit, onSave }) => {
    const [fio, setFio] = useState("");
    const [course, setCourse] = useState("");
    const [group, setGroup] = useState("");
    const [contacts, setContacts] = useState("");
    const [technologies, setTechnologies] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    useEffect(() => {
      if (studentData) {
        setFio(studentData.fio || "");
        setCourse(studentData.course || "");
        setGroup(studentData.group || "");
        setContacts(studentData.contacts || "");
        setTechnologies(studentData.technologies || []);
      }
    }, [studentData]);
  
    const handleSave = (e) => {
      e.preventDefault(); // Prevent form submission default behavior
      const updatedData = {
        fio,
        course,
        group,
        contacts,
        technologies,
      };
      onSave(updatedData);
      setIsModalOpen(false); // Close modal after saving
    };
  
    const renderTextField = (value, label) => (
      <div className="form-group">
        <label>{label}</label>
        <p className={value ? "" : "empty"}>{value || "Не указано"}</p>
      </div>
    );
    
      
  
    const renderModal = () => (
      <form onSubmit={handleSave} className="profile-form">
        <h3>Редактирование профиля</h3>
        <div className="form-group">
          <label>ФИО</label>
          <input
            type="text"
            value={fio}
            onChange={(e) => setFio(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Курс</label>
          <input
            type="text"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Группа</label>
          <input
            type="text"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Контакты</label>
          <input
            type="text"
            value={contacts}
            onChange={(e) => setContacts(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Технологии</label>
          <input
            type="text"
            value={technologies.join(", ")}
            onChange={(e) =>
              setTechnologies(e.target.value.split(",").map((tech) => tech.trim()))
            }
            placeholder="Введите технологии через запятую"
          />
        </div>
        <div className="modal-footer">
          <button type="submit">Сохранить</button>
          <button type="button" onClick={() => setIsModalOpen(false)}>
            Закрыть
          </button>
        </div>
      </form>
    );
  
    return (
      <div className="editable-profile">
        <h3>Профиль</h3>
  
        {/* Всегда отображаем полную информацию */}
        <div className="profile-container">
          {renderTextField(fio, "ФИО")}
          {renderTextField(course, "Курс")}
          {renderTextField(group, "Группа")}
          {renderTextField(contacts, "Контакты")}
          <div className="form-group">
            <label>Технологии</label>
            <p>{technologies.length > 0 ? technologies.join(", ") : "Не указано"}</p>
          </div>
        </div>
  
        {/* Если редактирование возможно, показываем кнопку */}
        {canEdit && (
          <div className="edit-button">
            <button onClick={() => setIsModalOpen(true)}>Редактировать</button>
          </div>
        )}
  
        {/* Модальное окно для редактирования */}
        <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {renderModal()}
        </Modal>
      </div>
    );
  };
  
  export default EditableProfile;
  