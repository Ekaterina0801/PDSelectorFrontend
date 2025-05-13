import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
import RegistrationForm from "../components/forms/registration-form/RegistrationForm";
import authStore from "../stores/authStore";
import studentStore from "../stores/studentStore";
const Registration = () => {
  const navigate = useNavigate();

  const handleFormSubmit = async (formData) => {
    try {
      await authStore.checkAuth();
      const studentData = { ...formData, user_id: authStore.user.id };
      await studentStore.createStudent(authStore.trackId,studentData);

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

  return <RegistrationForm onSubmit={handleFormSubmit} onSkip={handleSkip} />;
};

export default Registration;
