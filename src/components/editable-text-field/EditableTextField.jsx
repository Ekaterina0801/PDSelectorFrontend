import React, { useState, useEffect } from "react";
import "./style.css";
import { FaPlus, FaTrash, FaEdit, FaSave, FaChevronDown } from "react-icons/fa";
import { isEqual } from "lodash";
import { fetchFilterParamsByTrackId } from "../../api/apiTeamsController";
import { getSavedTrackId } from "../../hooks/cookieUtils";
import DropDownTechnologies from "../drop-down-technologies/DropDownTechnologies";
import { useTechnologies } from "../../hooks/useTechnologies";
import { useNewTeam } from "../../hooks/useNewTeam";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

const EditableDescription = ({
  initialDescription,
  initialTechnologies,
  onSave,
  canEdit,
}) => {
  const [description, setDescription] = useState(initialDescription);
  const [technologies, setTechnologies] = useState(initialTechnologies);
  const [newTech, setNewTech] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  //const [allTechnologies, setAllTechnologies] = useState(initialTechnologies);
  /*
  const all_technologies = [
    { id: 0, name: "C++" },
    { id: 1, name: "C#" },
    { id: 2, name: "Python" },
    { id: 3, name: "Java" },
    { id: 4, name: "Ruby" },
    { id: 5, name: "Kotlin" },
    { id: 6, name: "Dart" },
    { id: 7, name: "JavaScript" },
    { id: 8, name: "CSS" },
    { id: 9, name: "SQL" },
    { id: 10, name: "HTML" },
    { id: 11, name: "Android" },
    { id: 12, name: "iOS" },
    { id: 13, name: "Ruby On Rails" },
    { id: 14, name: "Docker" },
    { id: 15, name: "Unity" },
    { id: 16, name: "PHP" },
    { id: 17, name: "Node.js" },
    { id: 18, name: "Godot" },
  ];*/

  const { studentId } = useParams();
  const { allTechnologies, loadingTechnologies, errorTechnologies } = useTechnologies();
  const currentTrackId = Cookies.get("trackId");
  const { newTeam, handleChange, handleSubmit } = useNewTeam(currentTrackId, studentId, allTechnologies);

  const handleTechnologyChange = (event) => {
        const { value, checked } = event.target;

        const selectedTech = allTechnologies.find((tech) => tech.id.toString() === value);
        
        const updatedTechnologies = checked
          ? [...technologies, selectedTech]
          : technologies.filter((tech) => tech.id !== selectedTech.id); 

          setTechnologies(updatedTechnologies);
  };

  useEffect(() => {
    if (!isEditing) {
      setDescription(initialDescription);
      setTechnologies(initialTechnologies);
    }
    const loadFilters = async () => {
      const trackId = getSavedTrackId();
      console.log("trackId", trackId);
      if (!trackId) return;
      try {
        const params = await fetchFilterParamsByTrackId(trackId);
        //setAllTechnologies(params.technologies);
        console.log("Test: ", params.technologies);
        console.log("Полученные параметры фильтра:", params);
      } catch (error) {
        console.error("Ошибка при получении параметров фильтра:", error);
      }
    };

    loadFilters();
  }, [initialDescription, initialTechnologies, isEditing]);

  useEffect(() => {
    
  }, []);

  const handleSave = () => {
    setIsEditing(false);
    if (onSave) {
      onSave({
        description,
        technologies,
      });
    }
  };

  const handleAddTechnology = () => {
    if (newTech.trim()) {
      setTechnologies((prev) => [...prev, newTech.trim()]);
      setNewTech("");
    }
  };

  const handleRemoveTechnology = (index) => {
    setTechnologies((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="editable-description">
      {isEditing ? (
        <>
        <label>Описание: </label>
          <textarea
            className="description-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/*<div className="technologies">
            <ul>
              {technologies.map((tech, index) => (
                <li key={tech.id||index} className="technology-item">
                  {console.log("TECH: ", tech)}
                  {tech.name}
                  <button
                    className="button-remove-tech"
                    onClick={() => handleRemoveTechnology(index)}
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
            <div className="add-technology">
              <input
                type="text"
                readOnly
                value={newTech}
                onClick={handleToggleDropdown}
                onChange={(e) => setNewTech(e.target.value)}
                placeholder="Добавить технологию"
              />
              {isDropdownOpen && (
                <DropDownTechnologies technologies_all = {allTechnologies} dropDownOpenFlag={setIsDropdownOpen} setterForNewTech={setNewTech} techNew={newTech}/>
              )}
              <button className="button-add-tech" onClick={handleAddTechnology}>
                <FaPlus />
              </button>
            </div>
          </div>*/}
        <label>Технологии: </label>
        <div className="technologies-list">
          {technologies && technologies.length > 0 ? (
            allTechnologies.map((tech) => (
              <div key={tech.id} className="technology-checkbox">
                <input
                  type="checkbox"
                  id={`tech-${tech.id}`}
                  name="technologies"
                  value={tech.id} 
                  checked={technologies.some((t) => t.id === tech.id)}  
                  onChange={handleTechnologyChange}
                />
                <label htmlFor={`tech-${tech.id}`}>{tech.name}</label>
              </div>
            ))
          ) : (
            <p>Нет доступных технологий</p>
          )}
        </div>



          <button className="button-save" onClick={handleSave}>
            <FaSave /> Сохранить
          </button>
        </>
      ) : (
        <>
          <p className="description-text">{description || "Нет описания"}</p>
          <div className="card-tags">
            <strong>Технологии:</strong>

            {initialTechnologies.length > 0 ? (
              technologies.map((tech) => (
                <span key={tech.id||tech} className="card-tag">
                  {tech.name||tech}
                </span>
              ))
            ) : (
              <p>Нет технологий</p>
            )}
          </div>
          {canEdit && (
            <button className="button-edit" onClick={() => setIsEditing(true)}>
              <FaEdit /> Редактировать
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default EditableDescription;
