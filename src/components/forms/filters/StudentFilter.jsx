import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import RadioOption from './RadioOption';
import CheckboxOption from './CheckboxOption';
import { 
  baseFilterPropTypes, 
  baseFilterDefaultProps,
  filterItemPropTypes
} from './propTypes';
import styles from './Filter.module.scss';
export default function StudentFilter({
  availableFilters,
  currentFilters,
  onApply
}) {
  const [filters, setFilters] = useState({
    course: null,
    groups: [],
    technologies: [],
    hasTeam: [],
    isCaptain: []
  });

  const {
    courses = [],
    groups = [],
    technologies: allTechnologies = []
  } = useMemo(() => availableFilters, [availableFilters]);

  useEffect(() => {
    setFilters({
      course: currentFilters.course ?? null,
      groups: Array.isArray(currentFilters.groups)
        ? currentFilters.groups
        : [],
      technologies: Array.isArray(currentFilters.technologies)
        ? currentFilters.technologies
        : [],
      hasTeam: Array.isArray(currentFilters.hasTeam)
        ? currentFilters.hasTeam
        : [],
      isCaptain: Array.isArray(currentFilters.isCaptain)
        ? currentFilters.isCaptain
        : []
    });
  }, [currentFilters]);

  const handleFilterChange = useCallback((field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  const toggleArrayFilter = useCallback((field, value) => {
    setFilters(prev => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(value)
          ? arr.filter(v => v !== value)
          : [...arr, value]
      };
    });
  }, []);

  const handleApply = useCallback(() => {
    onApply(filters);
  }, [filters, onApply]);

  const handleClear = useCallback(() => {
    const cleared = {
      course: null,
      groups: [],
      technologies: [],
      hasTeam: [],
      isCaptain: []
    };
    setFilters(cleared);
    onApply(cleared);
  }, [onApply]);

  return (
    <div className={styles.filterSection}>
      <h2 className={styles.filterSection__title}>Фильтры</h2>

      <div className={styles.filterSection__group}>
        <h3 className={styles.filterSection__groupTitle}>Курс</h3>
        <RadioOption
          name="course"
          label="Неважно"
          value={null}
          checked={filters.course === null}
          onChange={v => handleFilterChange('course', v)}
        />
        {courses.map(course => (
          <RadioOption
            key={course}
            name="course"
            label={String(course)}
            value={String(course)}
            checked={filters.course === String(course)}
            onChange={v => handleFilterChange('course', v)}
          />
        ))}
      </div>

      <div className={styles.filterSection__group}>
        <h3 className={styles.filterSection__groupTitle}>Группа</h3>
        {groups.map(group => (
          <CheckboxOption
            key={group}
            label={String(group)}
            value={group}
            checked={filters.groups.includes(group)}
            onChange={v => toggleArrayFilter('groups', v)}
            className={styles.checkbox}
          />
        ))}
      </div>

      <div className={styles.filterSection__group}>
        <h3 className={styles.filterSection__groupTitle}>Технологии</h3>
        <div className={styles.filterSection__list}>
          {allTechnologies.map(tech => (
            <CheckboxOption
              key={tech.id}
              label={tech.name}
              value={tech.id}
              checked={filters.technologies.includes(tech.id)}
              onChange={v => toggleArrayFilter('technologies', v)}
              className={styles.filterSection__checkbox}
            />
          ))}
        </div>
      </div>

      <div className={styles.filterSection__group}>
        <h3 className={styles.filterSection__groupTitle}>Наличие команды</h3>
        <CheckboxOption
          label="Есть команда"
          value={true}
          checked={filters.hasTeam.includes(true)}
          onChange={v => toggleArrayFilter('hasTeam', v)}
          className={styles.filterSection__checkbox}
        />
        <CheckboxOption
          label="Нет команды"
          value={false}
          checked={filters.hasTeam.includes(false)}
          onChange={v => toggleArrayFilter('hasTeam', v)}
          className={styles.filterSection__checkbox}
        />
      </div>

      <div className={styles.filterSection__group}>
        <h3 className={styles.filterSection__groupTitle}>Капитан</h3>
        <CheckboxOption
          label="Капитан"
          value={true}
          checked={filters.isCaptain.includes(true)}
          onChange={v => toggleArrayFilter('isCaptain', v)}
          className={styles.filterSection__checkbox}
        />
        <CheckboxOption
          label="Не капитан"
          value={false}
          checked={filters.isCaptain.includes(false)}
          onChange={v => toggleArrayFilter('isCaptain', v)}
          className={styles.filterSection__checkbox}
        />
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

StudentFilter.propTypes = {
  ...baseFilterPropTypes,
  availableFilters: PropTypes.shape({
    courses: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])),
    groups: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])),
    technologies: PropTypes.arrayOf(
      PropTypes.shape(filterItemPropTypes)
    )
  }).isRequired,
  currentFilters: PropTypes.shape({
    course: PropTypes.string,
    groups: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
    technologies: PropTypes.arrayOf(PropTypes.number),
    hasTeam: PropTypes.arrayOf(PropTypes.bool),
    isCaptain: PropTypes.arrayOf(PropTypes.bool)
  }),
  onApply: PropTypes.func.isRequired
};

StudentFilter.defaultProps = {
  ...baseFilterDefaultProps
};