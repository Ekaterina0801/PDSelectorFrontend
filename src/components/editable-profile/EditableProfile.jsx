import React, { useState, useEffect } from "react";
import Modal from "../modal/Modal";
import "../modal/style.css";
import "./style.css";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import DropDownTechnologies from "../drop-down-technologies/DropDownTechnologies";
import { fetchFilterParamsByTrackId } from "../../controllers/apiTeamsController";
import { getSavedTrackId } from "../../hooks/cookieUtils";

const EditableProfile = ({ studentData, canEdit, onSave }) => {
  const [fio, setFio] = useState("");
  const [course, setCourse] = useState("");
  const [group, setGroup] = useState("");
  const [contacts, setContacts] = useState("");
  const [technologies, setTechnologies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [allTechnologies, setAllTechnologies] = useState();
  const [newTech, setNewTech] = useState("");
  const [technologiesNames, setTechnologiesNames] = useState([]);


  useEffect(() => {
    if (studentData) {
      setFio(studentData.fio || "");
      setCourse(studentData.course || "");
      setGroup(studentData.group || "");
      setContacts(studentData.contacts || "");
      setTechnologies(studentData.technologies || []);
    }

    const loadFilters = async () => {
      const trackId = getSavedTrackId();
      console.log("trackId", trackId);
      if (!trackId) return;
      try {
        const params = await fetchFilterParamsByTrackId(trackId);
        setAllTechnologies(params.technologies);
        console.log("Test: ", params.technologies);
        console.log("Полученные параметры фильтра:", params);
      } catch (error) {
        console.error("Ошибка при получении параметров фильтра:", error);
      }
    };
    loadFilters();

    let names_of_technologies = [];

    for (let i = 0; i < technologies.length; i++) {
      names_of_technologies.push(technologies[i].name);
    }
    
    setTechnologiesNames(names_of_technologies);

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
    <div className="form-group ">
      <label>{label}</label>
      {/*<p className={value ? "" : "empty"}>{value || "Не указано"}</p>*/}
      <p className="p-editable-profile">{value || "Не указано"}</p>
    </div>
  );

  const handleAddTechnology = (e) => {
    e.preventDefault();
    if (newTech) {
      setTechnologiesNames((prev) => [...prev, newTech]);
      setNewTech("");
    }
  };

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleRemoveTechnology = (e, index) => {
    e.preventDefault();
    setTechnologiesNames((prev) => prev.filter((_, i) => i !== index));
  };

  const renderModal = () => (
    <form onSubmit={handleSave} className="profile-form">
      <h3>Редактирование профиля</h3>
      <div className="form-group-modal">
        <label>ФИО </label>
        <input
          type="text"
          value={fio}
          onChange={(e) => setFio(e.target.value)}
        />
      </div>
      <div className="form-group-modal">
        <label>Курс </label>
        <input
          type="text"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />
      </div>
      <div className="form-group-modal">
        <label>Группа </label>
        <input
          type="text"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
        />
      </div>
      <div className="form-group-modal">
        <label>Контакты </label>
        <input
          type="text"
          value={contacts}
          onChange={(e) => setContacts(e.target.value)}
        />
      </div>
      <div className="form-group-modal">
        <label>Технологии </label>
        <input
          type="text"
          readOnly
          value={newTech}
          onClick={handleToggleDropdown}
          onChange={(e) => setNewTech(e.target.value)}
          placeholder="Введите технологии через запятую"
        />
        {isDropdownOpen && (
          <DropDownTechnologies
            technologies_all={allTechnologies}
            dropDownOpenFlag={setIsDropdownOpen}
            setterForNewTech={setNewTech}
            techNew={newTech}
          />
        )}
        <button className="button-add-tech" onClick={handleAddTechnology}>
          <FaPlus />
        </button>
        <ul>
          {technologiesNames.map((tech, index) => (
            <li key={index} className="technology-item">
              {tech}
              <button
                className="button-remove-tech"
                onClick={(e) => handleRemoveTechnology(e, index)}>
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
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
      {/*<h3>Профиль</h3>*/}

      {/* Всегда отображаем полную информацию */}
      <div className="profile-container">
        {renderTextField(fio, "ФИО")}
        {renderTextField(course, "Курс")}
        {renderTextField(group, "Группа")}
        {renderTextField(contacts, "Контакты")}
        <div className="form-group">
          <label>Технологии</label>
          <p className="p-editable-profile">
            {technologiesNames.length > 0 ? technologiesNames.join(", ") : "Не указано"}
          </p>
        </div>
      </div>

      {/* Если редактирование возможно, показываем кнопку */}
      {canEdit && (
        <div className="edit-button">
          <button onClick={() => setIsModalOpen(true)}>
            <FaEdit />
            Редактировать
          </button>
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
