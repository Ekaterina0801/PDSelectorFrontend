import React, { useState } from 'react';
import './style.css'; 

const EditableDescription = ({ initialDescription, onSave }) => {
  const [description, setDescription] = useState(initialDescription);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    if (onSave) {
      onSave(description);
    }
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
          <button className="button-save" onClick={handleSave}>
            Сохранить
          </button>
        </>
      ) : (
        <>
          <p className="description-text">{description || 'Нет описания'}</p>
          <button className="button-edit" onClick={() => setIsEditing(true)}>
            Редактировать
          </button>
        </>
      )}
    </div>
  );
};

export default EditableDescription;
