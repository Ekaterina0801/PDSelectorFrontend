import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import RadioOption from "./RadioOption";
import CheckboxOption from "./CheckboxOption";
import { 
  baseFilterPropTypes, 
  baseFilterDefaultProps,
  filterItemPropTypes
} from './propTypes';
import styles from './Filter.module.scss';
import { toJS } from 'mobx';
import teamStore from '../../../stores/teamStore';
import authStore from '../../../stores/authStore';
const Filter = ({ availableFilters, currentFilters, onApply }) => {
  const [localFilters, setLocalFilters] = useState({
    isFull: [],
    projectType: [],
    technologies: []
  });

  const { projectTypes = [], technologies: allTechnologies = [] } = useMemo(
    () => availableFilters,
    [availableFilters]
  );

  useEffect(() => {
    setLocalFilters({
      isFull: currentFilters.isFull !== null ? [String(currentFilters.isFull)] : [],
      projectType: currentFilters.projectType || [],  // Теперь это всегда массив
      technologies: Array.isArray(currentFilters.technologies) ? currentFilters.technologies : [],
    });
  }, [currentFilters]);

  const handleFilterChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value) // Убираем, если уже выбран
        : [...prev[field], value] // Добавляем в массив, если не выбран
    }));
  };

  const handleApply = () => {
    const applied = {
      isFull: localFilters.isFull.length === 1 ? localFilters.isFull[0] === 'true' : null,
      projectType: localFilters.projectType.length > 0 ? localFilters.projectType : null, // Применяем все выбранные типы
      technologies: localFilters.technologies,
      trackId: authStore.trackId,  // Здесь предполагается, что trackId есть в authStore
    };
    onApply(applied);
  };

  const handleClear = () => {
    setLocalFilters({ isFull: [], projectType: [], technologies: [] });
    const reset = { isFull: null, projectType: null, technologies: [], trackId: authStore.trackId };
    onApply(reset);
  };

  return (
    <div className={styles.filterSection}>
      <h3 className={styles.filterSection__title}>Фильтры</h3>

      {/* Фильтры по заполненности */}
      <div className={styles.filterSection__group}>
        <h4 className={styles.filterSection__groupTitle}>Заполненность</h4>
        <CheckboxOption
          id="isFull-true"
          label="Полностью укомплектован"
          value="true"
          checked={localFilters.isFull.includes('true')}
          onChange={v => handleFilterChange('isFull', v)}
        />
        <CheckboxOption
          id="isFull-false"
          label="Есть свободные места"
          value="false"
          checked={localFilters.isFull.includes('false')}
          onChange={v => handleFilterChange('isFull', v)}
        />
      </div>

      {/* Фильтры по типу проекта */}
      <div className={styles.filterSection__group}>
        <h4 className={styles.filterSection__groupTitle}>Тип проекта</h4>
        {projectTypes.length > 0 ? (
          <div className={styles.filterSection__list}>
            {projectTypes.map(pt => (
              <CheckboxOption
                key={pt.id}
                id={`projectType-${pt.id}`}
                label={pt.name}
                value={pt.name}
                checked={localFilters.projectType.includes(pt.name)} // Проверяем, выбран ли тип
                onChange={v => handleFilterChange('projectType', v)}
              />
            ))}
          </div>
        ) : (
          <p>Нет доступных типов проектов</p>
        )}
      </div>

      {/* Фильтры по технологиям */}
      <div className={styles.filterSection__group}>
        <h4 className={styles.filterSection__groupTitle}>Технологии</h4>
        {allTechnologies.length > 0 ? (
          <div className={styles.filterSection__list}>
            {allTechnologies.map(tech => (
              <CheckboxOption
                key={tech.id}
                id={`tech-${tech.id}`}
                label={tech.name}
                value={tech.id}
                checked={localFilters.technologies.includes(tech.id)} // Проверяем, выбрана ли технология
                onChange={v => handleFilterChange('technologies', v)}
              />
            ))}
          </div>
        ) : (
          <p>Нет доступных технологий</p>
        )}
      </div>

      <div className={styles.filterSection__actions}>
        <button
          type="button"
          className={styles.filterSection__button}
          onClick={handleApply}
        >
          Применить
        </button>
        <button
          type="button"
          className={styles.filterSection__button}
          onClick={handleClear}
        >
          Сбросить
        </button>
      </div>
    </div>
  );
};

export default Filter;