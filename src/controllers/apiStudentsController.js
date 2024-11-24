import axios from 'axios';

//const API_BASE_URL = 'http://188.225.11.37:8080/api/v1'; 
import { API_BASE_URL } from '../config/apiConfig';
// получение студентов с фильтрацией
export const fetchStudents = async ({ input, course, groupNumber, hasTeam, technologies }) => {
  try {
    // Формируем параметры запроса
    const queryParams = new URLSearchParams();
    console.log('input', input);
    if (input) queryParams.append("input", input);
    if (course) queryParams.append("course", course);
    if (groupNumber) queryParams.append("group_number", groupNumber);
    if (hasTeam !== undefined) queryParams.append("has_team", hasTeam);
    if (technologies && technologies.length > 0) {
      technologies.forEach((tech) => queryParams.append("technologies", tech));
    }

    const response = await fetch(`${API_BASE_URL}/students/search?${queryParams.toString()}`, {
      method: 'GET',
      credentials: 'include', // Обеспечивает отправку cookies
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const data = await response.json(); // Преобразуем JSON-ответ в объект
    console.log(data); 
    return data;
  } catch (error) {
    console.error('Ошибка при получении данных студентов:', error);
    throw error;
  }
};


// Создание нового студента
export const createStudent = async (trackId, studentData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/students?trackId=${trackId}`, studentData);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании студента:', error);
      throw error;
    }
  };

  // Удаление студента 
export const deleteStudent = async (studentId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/students/${studentId}`);
      return response.data;
    } catch (error) {
      console.error("Ошибка при удалении команды:", error);
      throw error;
    }
  };

  // Получение данных о студенте
export const fetchStudentById = async (studentId) => {
  console.log('st',studentId);
  try {
    const response =await fetch(`${API_BASE_URL}/students/${studentId}`, {
      method: 'GET',
      credentials: 'include', 
    });
   
    const data = await response.json(); 
    console.log('data', data);
    console.log(data);
    return data;
  } catch (error) {
    console.error("Ошибка при получении данных студента:", error);
    throw error;
  }
};

// Создание нового студента
export const updateStudent = async (trackId, studentData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/students?trackId=${trackId}`, studentData);
    return response.data;
  } catch (error) {
    console.error('Ошибка при обновлении студента:', error);
    throw error;
  }
};

// Импорт для работы с запросами
export const fetchCurrentUser = async () => {
  try {
    // Выполнение GET-запроса к серверу
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: "GET",
      credentials: "include", // Включает cookies для авторизации
      headers: {
        "Content-Type": "application/json", // Указание типа данных
      },
    });

    // Проверка успешности ответа
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    // Парсинг данных
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка при получении текущего пользователя:", error);
    throw error;
  }
};


  


