import PropTypes from 'prop-types';

export const filterItemPropTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired
};

export const baseFilterPropTypes = {
  onApply: PropTypes.func.isRequired,
  currentFilters: PropTypes.object,
  availableFilters: PropTypes.object
};

export const baseFilterDefaultProps = {
  currentFilters: {},
  availableFilters: {}
};