import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1'; 

export const fetchStudents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/students`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении данных студентов:', error);
    throw error;
  }
};




  
