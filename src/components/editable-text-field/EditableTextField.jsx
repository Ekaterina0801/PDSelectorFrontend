import React, { useState, useEffect } from 'react';
import './style.css'; 
import { FaPlus, FaTrash, FaEdit, FaSave } from "react-icons/fa";
import { isEqual } from "lodash";

const EditableDescription = ({
  initialDescription,
  initialTechnologies = [],
  onSave,
  canEdit,
}) => {
  const [description, setDescription] = useState(initialDescription);
  const [technologies, setTechnologies] = useState(initialTechnologies);
  const [newTech, setNewTech] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setDescription(initialDescription);
      setTechnologies(initialTechnologies);
    }
  }, [initialDescription, initialTechnologies, isEditing]);

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

  return (
    <div className="editable-description">
      {isEditing ? (
        <>
          <textarea
            className="description-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="technologies">
            <ul>
              {technologies.map((tech, index) => (
                <li key={index} className="technology-item">
                  {tech}{" "}
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
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                placeholder="Добавить технологию"
              />
              <button className="button-add-tech" onClick={handleAddTechnology}>
                <FaPlus />
              </button>
            </div>
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
            <ul>
              {technologies.length > 0 ? (
                technologies.map((tech, index) => (
                  <li key={index} className="card-tag">
                    {tech}
                  </li>
                ))
              ) : (
                <p>Нет технологий</p>
              )}
            </ul>
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
