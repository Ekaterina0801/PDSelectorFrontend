import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
export const getUserIdFromServer = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/me`, {
        withCredentials: true, 
      });
      if (response.status === 401) {
        window.location.href = "/login";}
      return response.data.id;
    } catch (error) {
        
      console.error("Error fetching user ID:", error);
      throw error;
    }
  };
