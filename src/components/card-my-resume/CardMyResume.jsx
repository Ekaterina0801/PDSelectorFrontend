import React from 'react';
import './style.css';

const Card = ({ name, type, resume, tags, onRemove }) => {
  return (
    <div className="card-my-resume">
      <div className="card-my-resume-name">{name}</div>
      <div className="card-my-resume-type">{type}</div>
      <div className="card-my-resume-resume">{resume}</div>
      <div className="card-my-resume-tags">
        {tags.map((tag, index) => (
          <span key={index} className="card-my-resume-tag">{tag}</span>
        ))}
      </div>
      <button className="resume-card" onClick={onRemove}>Отменить заявку</button>
    </div>
  );
};

export default Card;
