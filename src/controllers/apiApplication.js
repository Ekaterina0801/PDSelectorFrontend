import axios from "axios";
import { API_BASE_URL } from '../config/apiConfig';
//const API_BASE_URL = "http://188.225.11.37:8080/api/v1";
// Получение данных о всех заявках
export const fetchApplications = async (trackId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/applications?=${trackId}`
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении заявок", error);
    throw error;
  }
};

// Получение данных о конкретной заявке
export const fetchApplicationById = async (applicationId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/applications/${applicationId}`
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении данных заявки:", error);
    throw error;
  }
};

// Получение заявок конкретной команды
export const fetchTeamApplications = async (teamId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/teams/${teamId}/subscriptions`
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении заявок команды:", error);
    throw error;
  }
};

// Создание новой заявки
export const createApplication = async (applicationData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/applications?`,
      applicationData
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при создании заявки:", error);
    throw error;
  }
};

// Удаление заявки
export const deleteApplication = async (applicationId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/applications/${applicationId}`
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при удалении заявки:", error);
    throw error;
  }
};

// Обновление заявки
export const updateApplication = async (applicationData, applicationId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/applications/${applicationId}`,
      applicationData
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при обновлении заявки:", error);
    throw error;
  }
};
