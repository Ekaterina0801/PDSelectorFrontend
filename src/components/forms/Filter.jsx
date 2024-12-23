import './style.css';
import React, { useState } from "react";
import { useMemo } from 'react';

const Filter = ({ filterParams, onApplyFilters }) => {
  const [isFull, setIsFull] = useState(null);
  const [selectedProjectTypes, setSelectedProjectTypes] = useState([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);


  const availableProjectTypes = useMemo(() => filterParams.projectTypes || [], [filterParams]);
  const availableTechnologies = useMemo(() => filterParams.technologies || [], [filterParams]);
  {console.log("availableProjectTypes: ", availableProjectTypes)}
  {console.log("availableTechnologies: ", availableTechnologies)}

  const toggleSelection = (setState, value) => {
    setState((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleApplyFilters = () => {
    const filters = {
      isFull,
      projectType: selectedProjectTypes.length > 0 ? selectedProjectTypes : null,
      technologies: selectedTechnologies.length > 0 ? selectedTechnologies : null,
    };
    onApplyFilters(filters);
  };

  return (
    <div className="filter-section">
      <h2>Фильтры</h2>

      {/* Фильтр по заполненности */}
      <div className="filter-group">
        <h3>Заполненность</h3>
        {["Полностью укомплектован", "Есть свободные места", "Все"].map((label, index) => (
          <label key={index}>
            <input
              type="radio"
              name="isFull"
              value={index === 2 ? null : index === 0}
              checked={isFull === (index === 2 ? null : index === 0)}
              onChange={() => setIsFull(index === 2 ? null : index === 0)}
            />
            {label}
          </label>
        ))}
      </div>

      {/* Фильтр по типу проекта */}
      <div className="filter-group">
        <h3>Тип проекта</h3>
        {availableProjectTypes.map((type) => (
          <label key={type.id}>
            <input
              type="checkbox"
              checked={selectedProjectTypes.includes(type.id)}
              onChange={() => toggleSelection(setSelectedProjectTypes, type.id)}
            />
            {type.name}
          </label>
        ))}
      </div>

      {/* Фильтр по технологиям */}
      <div className="filter-group">
        <h3>Технологии</h3>
        {availableTechnologies.map((tech) => (
          <label key={tech.id}>
            <input
              type="checkbox"
              checked={selectedTechnologies.includes(tech.id)}
              onChange={() => toggleSelection(setSelectedTechnologies, tech.id)}
            />
            {tech.name}
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