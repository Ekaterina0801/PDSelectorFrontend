import ReactDOM from 'react-dom';

const SuccessMessage = ({ message }) => {
  return ReactDOM.createPortal(
    <div className="success-message">
      {message}
    </div>,
    document.body 
  );
};

export default SuccessMessage;
