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
export default function Filter({ availableFilters, currentFilters, onApply }) {

  const [filters, setFilters] = useState({
    isFull: null,
    projectType: null,
    technologies: []
  });

  const { projectTypes = [], technologies: allTechnologies = [] } = 
    useMemo(() => availableFilters, [availableFilters]);

  useEffect(() => {
    setFilters({
      isFull: currentFilters.isFull ?? null,
      projectType:
        currentFilters.projectType != null
          ? String(currentFilters.projectType)
          : null,
      technologies: Array.isArray(currentFilters.technologies)
        ? currentFilters.technologies
        : String(currentFilters.technologies || '')
            .split(',')
            .filter(Boolean)
    });
  }, [currentFilters]);

  const handleFilterChange = useCallback((field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  const toggleTechnology = useCallback(techId => {
    setFilters(prev => ({
      ...prev,
      technologies: prev.technologies.includes(techId)
        ? prev.technologies.filter(id => id !== techId)
        : [...prev.technologies, techId]
    }));
  }, []);

  const handleApply = useCallback(() => {
    onApply({
      ...filters,
      technologies:
        filters.technologies.length > 0 ? filters.technologies : null
    });
  }, [filters, onApply]);

  const handleClear = useCallback(() => {
    const cleared = { isFull: null, projectType: null, technologies: [] };
    setFilters(cleared);
    onApply(cleared);
  }, [onApply]);

  return (
    <div className={styles.filterSection}>
      <h2 className={styles.filterSection__title}>Фильтры</h2>

      <div className={styles.filterSection__group}>
        <h3 className={styles.filterSection__groupTitle}>Заполненность</h3>
        <RadioOption
          name="isFull"
          label="Неважно"
          value={null}
          checked={filters.isFull === null}
          onChange={v => handleFilterChange('isFull', v)}
        />
        <RadioOption
          name="isFull"
          label="Полностью укомплектован"
          value={true}
          checked={filters.isFull === true}
          onChange={v => handleFilterChange('isFull', v)}
        />
        <RadioOption
          name="isFull"
          label="Есть свободные места"
          value={false}
          checked={filters.isFull === false}
          onChange={v => handleFilterChange('isFull', v)}
        />
      </div>

      {projectTypes.length > 0 && (
        <div className={styles.filterSection__group}>
          <h3 className={styles.filterSection__groupTitle}>Тип проекта</h3>
          <RadioOption
            name="projectType"
            label="Неважно"
            value={null}
            checked={filters.projectType === null}
            onChange={v => handleFilterChange('projectType', v)}
          />
          {projectTypes.map(pt => (
            <RadioOption
              key={pt.name}
              name="projectType"
              label={pt.name}
              value={pt.name}
              checked={filters.projectType === pt.name}
              onChange={v => handleFilterChange('projectType', v)}
            />
          ))}
        </div>
      )}

      <div className={styles.filterSection__group}>
        <h3 className={styles.filterSection__groupTitle}>Технологии</h3>
        <div className={styles.filterSection__list}>
          {allTechnologies.map(tech => (
            <CheckboxOption
              key={tech.id}
              label={tech.name}
              value={tech.id}
              checked={filters.technologies.includes(tech.id)}
              onChange={toggleTechnology}
              className={styles.filterSection__checkbox}
            />
          ))}
        </div>
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
}

Filter.propTypes = {
  ...baseFilterPropTypes,
  availableFilters: PropTypes.shape({
    projectTypes: PropTypes.arrayOf(
      PropTypes.shape({ name: PropTypes.string.isRequired })
    ),
    technologies: PropTypes.arrayOf(
      PropTypes.shape(filterItemPropTypes)
    )
  }).isRequired,
  currentFilters: PropTypes.shape({
    isFull: PropTypes.bool,
    projectType: PropTypes.string,
    technologies: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string
    ])
  }).isRequired,
  onApply: PropTypes.func.isRequired
};

Filter.defaultProps = {
  ...baseFilterDefaultProps
};