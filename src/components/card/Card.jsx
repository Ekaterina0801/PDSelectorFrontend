import React from 'react';
import "./style.css"
import { useState } from "react";

const Card = ({
  name,
  type,
  resume,
  tags = [],
  profileLink = "#",
  isCaptain = false, 
  showActionsForCaptain = true, 
  showActionsForUser = true,
  onAccept,
  onDecline,
  onApply,
  onCancel,
  acceptText = "Принять заявку",
  declineText = "Отклонить заявку",
  applyText = "Подать заявку",
  cancelText = "Отменить заявку",
  viewText = "Перейти",
}) => {
  const [hasApplied, setHasApplied] = useState(false); // Состояние для отслеживания подачи заявки

  const handleApply = () => {
    if (onApply) onApply(); 
    setHasApplied(true); 
  };

  const handleCancel = () => {
    if (onCancel) onCancel(); 
    setHasApplied(false); 
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-name">{name}</h3>
        {type && <p className="card-type">{type}</p>}
      </div>
      <div className="card-body">
        {resume && <p className="card-resume">{resume}</p>}
        <div className="card-tags">
          {tags.length > 0 ? (
            tags.map((tag, index) => (
              <span key={index} className="card-tag">
                {tag.name}
              </span>
            ))
          ) : (
            <p className="no-tags">Нет указанных технологий</p>
          )}
        </div>
      </div>
      <div className="card-actions">
        {isCaptain && showActionsForCaptain ? (
          <>
            {onAccept && (
              <button className="action-button accept" onClick={onAccept}>
                {acceptText}
              </button>
            )}
            {onDecline && (
              <button className="action-button decline" onClick={onDecline}>
                {declineText}
              </button>
            )}
          </>
        ) : (
          showActionsForUser && (
            <>
              {!hasApplied ? (
                <button className="action-button apply" onClick={handleApply}>
                  {applyText}
                </button>
              ) : (
                <button className="action-button cancel" onClick={handleCancel}>
                  {cancelText}
                </button>
              )}
            </>
          )
        )}
        <a href={profileLink} className="action-link" rel="noopener noreferrer">
          <button className="action-button view">{viewText}</button>
        </a>
      </div>
    </div>
  );
};

export default Card;

