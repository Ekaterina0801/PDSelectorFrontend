import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
import RegistrationForm from "../components/login-form/RegistrationForm";

const Registration = () => {
  const navigate = useNavigate();

  const handleFormSubmit = async (formData) => {
    try {
      const userId = await getUserIdFromServer();
      const studentData = { ...formData, user_id: userId };
      console.log(studentData);
      await axios.post(`${API_BASE_URL}/students`, studentData, {
        withCredentials: true,
      });

      alert("Регистрация завершена!");
      navigate("/teams");
    } catch (error) {
      console.error("Ошибка при регистрации студента:", error);
      alert("Произошла ошибка. Попробуйте снова.");
    }
  };

  const handleSkip = () => {
    console.log("Пользователь продолжил без регистрации");
    navigate("/teams"); 
  };

  const getUserIdFromServer = async () => {
    const response = await axios.get(`${API_BASE_URL}/users/me`, {
      withCredentials: true,
    });
    return response.data.id;
  };

  return <RegistrationForm onSubmit={handleFormSubmit} onSkip={handleSkip} />;
};

export default Registration;
