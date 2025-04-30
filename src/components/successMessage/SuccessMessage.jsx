import ReactDOM from 'react-dom';

import styles from './SuccessMessage.module.scss';

const SuccessMessage = ({ message }) => {
  return ReactDOM.createPortal(
    <div className={styles.successMessage}>
      {message}
    </div>,
    document.body
  );
};

export default SuccessMessage;
