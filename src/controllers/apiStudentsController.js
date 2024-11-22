import axios from 'axios';

//const API_BASE_URL = 'http://188.225.11.37:8080/api/v1'; 
const API_BASE_URL = "http://localhost:8080/api/v1";
//получение всех студентов
export const fetchStudents = async (trackId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/students?trackId=${trackId}`, {
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
  try {
    const response = await axios.get(`${API_BASE_URL}/students/${studentId}`);
    return response.data;
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
    const response = await fetch("http://localhost:8080/api/v1/me", {
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


  


