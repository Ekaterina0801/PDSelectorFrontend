import "./style.css";
import ReactDOM from 'react-dom';

const Loader = () => {
  return ReactDOM.createPortal(
    <div className="loader-overlay">
      <div className="spinner"></div>
    </div>,
    document.body 
  );
};

export default Loader;

  