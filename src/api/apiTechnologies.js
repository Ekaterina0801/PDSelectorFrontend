import axios from "axios";

import { API_BASE_URL } from '../config/apiConfig';

export const fetchTechnologies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/technologies`, {
        method: "GET",
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      console.log('response', response);
      const data = await response.json();
      console.log('data',data);
  
      return data;
    } catch (error) {
      console.error("Ошибка при получении технологий:", error);
      throw error;
    }
  };
  
  
  