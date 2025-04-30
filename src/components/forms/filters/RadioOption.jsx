import React from 'react';
import PropTypes from 'prop-types';

const RadioOption = ({ value, checked, onChange, label, name }) => (
  <label>
    <input
      type="radio"
      name={name}
      checked={checked}
      onChange={() => onChange(value)}
    />
    {label}
  </label>
);

RadioOption.propTypes = {
  value: PropTypes.any.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default RadioOption;