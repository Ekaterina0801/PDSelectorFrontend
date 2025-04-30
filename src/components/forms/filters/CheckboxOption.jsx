import React from 'react';
import PropTypes from 'prop-types';

const CheckboxOption = ({ value, checked, onChange, label, className = '' }) => (
  <label className={className}>
    <input
      type="checkbox"
      checked={checked}
      onChange={() => onChange(value)}
    />
    {label}
  </label>
);

CheckboxOption.propTypes = {
  value: PropTypes.any.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default CheckboxOption;