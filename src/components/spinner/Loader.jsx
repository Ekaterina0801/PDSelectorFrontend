import ReactDOM from 'react-dom';

import styles from './Loader.module.scss';

const Loader = () => {
  return ReactDOM.createPortal(
    <div className={styles.loaderOverlay}>
      <div className={styles.spinner}></div>
    </div>,
    document.body
  );
};

export default Loader;

  