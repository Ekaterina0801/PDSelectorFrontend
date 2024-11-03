import React from 'react';
import './style.css';

const Card = ({ name, resume, tags }) => {
  return (
    <div className="card">
      <div className="card-name">{name}</div>
      <div className="card-resume">{resume}</div>
      <div className="card-tags">
        {tags.map((tag, index) => (
          <span key={index} className="card-tag">{tag}</span>
        ))}
      </div>
    </div>
  );
};

export default Card;
