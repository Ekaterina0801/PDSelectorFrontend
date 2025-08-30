import React from 'react';
import styles from './Filter.module.scss';
import PropTypes from 'prop-types';
const CheckboxOption = ({ id, value, checked, onChange, label }) => (
  <label className={styles.checkboxWrapper} htmlFor={id}>
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={() => onChange(value)}
    />
    <span className={styles.checkboxLabel}>{label}</span>
  </label>
);

CheckboxOption.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default CheckboxOption;
