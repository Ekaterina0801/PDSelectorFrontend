import './style.css';
import React, { useState } from "react";


const Filter = ({ filterParams, onApplyFilters }) => {
  const [isFull, setIsFull] = useState(null); // Флаг заполненности
  const [projectTypes, setProjectTypes] = useState([]); // Типы проектов
  const [technologies, setTechnologies] = useState([]); // Технологии

  // Extract project types and technologies from params
  const availableProjectTypes = filterParams.projectTypes || []; // Array of project types
  const availableTechnologies = filterParams.technologies || []; // Array of technology objects

  const handleProjectTypeChange = (type) => {
    setProjectTypes((prevTypes) =>
      prevTypes.includes(type)
        ? prevTypes.filter((t) => t !== type)
        : [...prevTypes, type]
    );
  };

  const handleTechnologyChange = (technology) => {
    setTechnologies((prevTechnologies) =>
      prevTechnologies.includes(technology)
        ? prevTechnologies.filter((t) => t !== technology)
        : [...prevTechnologies, technology]
    );
  };

  const handleApplyFilters = () => {
    const filters = {
      isFull,
      projectType: projectTypes.length > 0 ? projectTypes : null,
      technologies: technologies.length > 0 ? technologies : null,
    };

    onApplyFilters(filters);
  };

  return (
    <div className="filter-section">
      <h2>Фильтры</h2>
      {/* Фильтр по заполненности */}
      <div className="filter-group">
        <h3>Заполненность</h3>
        <label>
          <input
            type="radio"
            name="isFull"
            value="true"
            checked={isFull === true}
            onChange={() => setIsFull(true)}
          />
          Полностью укомплектован
        </label>
        <label>
          <input
            type="radio"
            name="isFull"
            value="false"
            checked={isFull === false}
            onChange={() => setIsFull(false)}
          />
          Есть свободные места
        </label>
        <label>
          <input
            type="radio"
            name="isFull"
            value="null"
            checked={isFull === null}
            onChange={() => setIsFull(null)}
          />
          Все
        </label>
      </div>

      {/* Фильтр по типу проекта */}
      <div className="filter-group">
        <h3>Тип проекта</h3>
        {availableProjectTypes.map((type) => (
          <label key={type}>
            <input
              type="checkbox"
              checked={projectTypes.includes(type)}
              onChange={() => handleProjectTypeChange(type)}
            />
            {type}
          </label>
        ))}
      </div>

      {/* Фильтр по технологиям */}
      <div className="filter-group">
        <h3>Технологии</h3>
        {availableTechnologies.map((tech) => (
          <label key={tech.id}> {/* Use tech.id as a unique key */}
            <input
              type="checkbox"
              checked={technologies.includes(tech.id)} // Check against tech.id for technologies
              onChange={() => handleTechnologyChange(tech.id)} // Use tech.id to handle changes
            />
            {tech.name} {/* Display the technology name */}
          </label>
        ))}
      </div>

      <button className="show-button" onClick={handleApplyFilters}>
        Применить фильтры
      </button>
    </div>
  );
};

export default Filter;
