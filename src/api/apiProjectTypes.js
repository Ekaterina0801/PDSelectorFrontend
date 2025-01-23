import axios from "axios";

import { API_BASE_URL } from '../config/apiConfig';

export const fetchProjectTypes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/projectTypes`, {
        method: "GET",
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      const data = await response.json();  
      return data;
    } catch (error) {
      console.error("Ошибка при получении типов проектов:", error);
      throw error;
    }
  };