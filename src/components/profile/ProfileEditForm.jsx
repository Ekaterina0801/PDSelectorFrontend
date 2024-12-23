import { useState } from "react";
import { useTechnologies } from "../../hooks/useTechnologies";
import { useNewTeam } from "../../hooks/useNewTeam";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import "./style.css";
const ProfileEditForm = ({ studentData, onSave, onCancel }) => {
    const [formData, setFormData] = useState(studentData);
  
    const handleChangeInfo = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSave = () => {
      onSave(formData);
    };
    const { studentId } = useParams();
    const { allTechnologies, loadingTechnologies, errorTechnologies } = useTechnologies();
    const currentTrackId = Cookies.get("trackId");
    const { newTeam, handleChange, handleSubmit } = useNewTeam(currentTrackId, studentId, allTechnologies);

    const handleTechnologyChange = (event) => {
          const { value, checked } = event.target;

          const selectedTech = allTechnologies.find((tech) => tech.id.toString() === value);
          
          const updatedTechnologies = checked
            ? [...formData.technologies, selectedTech]
            : formData.technologies.filter((tech) => tech.id !== selectedTech.id); 


            setFormData((prevData) => ({
              ...prevData,
              technologies: updatedTechnologies,
            }));
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
            onChange={handleChangeInfo}
          />
        </label>
        <label>
          Курс:
          <input
            type="number"
            name="course"
            value={formData.course}
            onChange={handleChangeInfo}
          />
        </label>
        <label>
          Группа:
          <input
            type="text"
            name="group"
            value={formData.group}
            onChange={handleChangeInfo}
          />
        </label>
        <label>
          Контакты:
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChangeInfo}
          />
        </label>

        <label>Технологии:  </label>      
        <div className="technologies-list">
          {formData.technologies && formData.technologies.length > 0 ? (
            allTechnologies.map((tech) => (
              <div key={tech.id} className="technology-checkbox">
                <input
                  type="checkbox"
                  id={`tech-${tech.id}`}
                  name="technologies"
                  value={tech.id} 
                  checked={formData.technologies.some((t) => t.id === tech.id)}  
                  onChange={handleTechnologyChange}
                />
                <label htmlFor={`tech-${tech.id}`}>{tech.name}</label>
              </div>
            ))
          ) : (
            <p>Нет доступных технологий</p>
          )}
        </div>
         

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