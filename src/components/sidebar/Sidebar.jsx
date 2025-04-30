import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import styles from './Sidebar.module.scss';


const Sidebar = ({ items, selected, onItemClick }) => (
  <nav className={styles.sidebar}>
    <ul className={styles.list}>
      {items.map(item => (
        <li
          key={item.name}
          className={item.name === selected ? styles.active : ''}
        >
          <button
            className={styles.link}
            onClick={() => onItemClick(item.name)}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.text}>{item.name}</span>
          </button>
        </li>
      ))}
    </ul>
  </nav>
);

Sidebar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string, icon: PropTypes.node })
  ).isRequired,
  selected: PropTypes.string,
  onItemClick: PropTypes.func.isRequired
};

Sidebar.defaultProps = {
  selected: ''
};

export default Sidebar;
