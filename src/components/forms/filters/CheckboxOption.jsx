import React from 'react';
import styles from './Filter.module.scss';

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

export default CheckboxOption;
