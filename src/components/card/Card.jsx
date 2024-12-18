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
  showApplyButton
}) => {
  const [hasApplied, setHasApplied] = useState(false);

  const handleApply = () => {
    if (onApply) onApply();
    setHasApplied(true);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-name">{name}</h3>
        {type && <p className="card-type"><h3 className="type-capture">Тип проекта: </h3>{type}</p>}
      </div>
      <div className="card-body">
        {resume && <p className="card-resume"><h3 className="type-capture">Резюме: </h3>{resume}</p>}
        <div className="card-tags">
          <h3 className="text-capture">Технологии: </h3>
          {tags.length > 0 ? (
            tags.map((tag, index) => (
              <span key={index} className="card-tag">
                {tag.name}
              </span>
            ))
          ) : (
            <p className="no-tags">-</p>
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
      </div>
    </div>
  );
};

export default Card;
