import { useState } from "react";
import "./style.css";
const ProfileEditForm = ({ studentData, onSave, onCancel }) => {
    const [formData, setFormData] = useState(studentData);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSave = () => {
      onSave(formData);
    };
  
    return (
        <div className="profile-container">
      <div className="profile-edit-form">
        <h2>Редактировать профиль</h2>
        <label>
          ФИО:
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
        </label>
        <label>
          Курс:
          <input
            type="number"
            name="course"
            value={formData.course}
            onChange={handleChange}
          />
        </label>
        <label>
          Группа:
          <input
            type="text"
            name="group"
            value={formData.group}
            onChange={handleChange}
          />
        </label>
        <label>
          Контакты:
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
          />
        </label>
        <label>
          Технологии:
          <input
            type="text"
            name="technologies"
            value={formData.technologies}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "technologies",
                  value: e.target.value.split(",").map((tech) => tech.trim()),
                },
              })
            }
          />
        </label>
        <div className="form-buttons">
          <button className="save-button" onClick={handleSave}>
            Сохранить
          </button>
          <button className="cancel-button" onClick={onCancel}>
            Отменить
          </button>
        </div>
      </div>
      </div>
    );
  };
  export default ProfileEditForm;