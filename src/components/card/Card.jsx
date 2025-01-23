import React from 'react';
import "./style.css"
import { useState } from "react";
import { getCurrentStudentId } from '../../api/apiStudentsController';


const Card = ({
  name,
  type,
  resume,
  tags = [],
  profileLink = "#",
  showActionsForStudent = true,
  onApply,
  applyText = "Подать заявку",
  viewText = "Перейти",
  showApplyButton,
  showEditingOptions
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentName, setCurrentName] = useState(name);
  const [currentType, setCurrentType] = useState(type);
  const [currentResume, setCurrentResume] = useState(resume);
  const [currentTags, setCurrentTags] = useState(tags.map(tag => tag.name));
  const [hasApplied, setHasApplied] = useState(false);

  const handleApply = () => {
    if (onApply) onApply();
    setHasApplied(true);
  };

  const handleSave = () => {
    console.log("Сохранено:", { currentName, currentType, currentResume, currentTags });
    setIsEditing(false);
  };

  return (
    <div className="card">
      <div className="card-header">
        {isEditing ? (
          <input
            type="text"
            value={currentName}
            onChange={(e) => setCurrentName(e.target.value)}
            className="card-name-input"
          />
        ) : (
          <h3 className="card-name">{currentName}</h3>
        )}
        {currentType && (
          <p className="card-type">
            <span className="type-capture">Тип проекта: </span>
            {isEditing ? (
              <input
                type="text"
                value={currentType}
                onChange={(e) => setCurrentType(e.target.value)}
                className="card-type-input"
              />
            ) : (
              currentType
            )}
          </p>
        )}
      </div>
      <div className="card-body">
        {currentResume && (
          <p className="card-resume">
            <span className="type-capture">Резюме: </span>
            {isEditing ? (
              <textarea
                value={currentResume}
                onChange={(e) => setCurrentResume(e.target.value)}
                className="card-resume-input"
              />
            ) : (
              currentResume
            )}
          </p>
        )}
        <div className="card-tags">
          <span className="text-capture">Технологии: </span>
          {isEditing ? (
            <input
              type="text"
              value={currentTags.join(', ')} 
              onChange={(e) => setCurrentTags(e.target.value.split(',').map(tag => tag.trim()))} 
              className="card-tags-input"
            />
          ) : (
            currentTags.length > 0 ? (
              currentTags.map((tag, index) => (
                <span key={index} className="card-tag">
                  {tag}
                </span>
              ))
            ) : (
              <p className="no-tags">-</p>
            )
          )}
        </div>
      </div>
      <div className="card-actions">
        {showActionsForStudent && showApplyButton && (
          <button className="action-button apply" onClick={handleApply}>
            {applyText}
          </button>
        )}
        <a href={profileLink} className="action-link" rel="noopener noreferrer">
          <button className="action-button view">{viewText}</button>
        </a>
        {showEditingOptions && <button className="action-button edit" onClick={() => {
          if (isEditing) handleSave(); 
          setIsEditing(!isEditing); 
        }}>
          {isEditing ? "Сохранить" : "Редактировать"}
        </button>}
        
      </div>
    </div>
  );
};

export default Card;
