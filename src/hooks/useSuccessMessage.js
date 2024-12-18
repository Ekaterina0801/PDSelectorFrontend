import { useState } from "react";

const useSuccessMessage = () => {
  const [successMessage, setSuccessMessage] = useState("");

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return {
    successMessage,
    showSuccessMessage,
  };
};

export default useSuccessMessage;
