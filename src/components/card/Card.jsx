import React from 'react';
import "./style.css"
const Card = ({ name, type, resume, tags, showAccept, showDecline, profileLink }) => {
  const handleAccept = () => {
    // Логика для принятия заявки
    console.log(`${name} принял заявку.`);
  };

  const handleDecline = () => {
    // Логика для отклонения заявки
    console.log(`${name} отклонил заявку.`);
  };

  return (
    <div className="card">
      <div className="card-name">{name}</div>
      <div className="card-type">{type}</div>
      <div className="card-resume">{resume}</div>
      <div className="card-tags">
        {tags.map((tag, index) => (
          <span key={index} className="card-tag">{tag}</span>
        ))}
      </div>
      <div className="card-actions">
        {showAccept && (
          <button className="action-button" onClick={handleAccept}>
            Принять заявку
          </button>
        )}
        {showDecline && (
          <button className="action-button" onClick={handleDecline}>
            Отклонить заявку
          </button>
        )}
        <a href={profileLink} target="_blank" rel="noopener noreferrer">
         <button className="action-button">
                        Перейти
          </button>
        </a>
      </div>
    </div>
  );
};

export default Card;

