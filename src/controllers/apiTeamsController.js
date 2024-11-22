import axios from "axios";

//const API_BASE_URL = "http://188.225.11.37:8080/api/v1";
const API_BASE_URL = "http://localhost:8080/api/v1";
/*
    public static final String FIND_BY_LIKE = "/api/v1/teams/like";

    public static final String SEARCH_TEAMS = "/api/v1/teams/search";

*/
// Получение данных о командах
export const fetchTeams = async (trackId) => {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/teams?trackId=${trackId}`, {
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
    console.error("Ошибка при получении данных команд:", error);
    throw error; 
  }
};


// Получение данных о командах
export const fetchTeamById = async (teamId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/teams/${teamId}`);
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении данных команды:", error);
      throw error;
    }
  };


// Создание новой команды
export const createTeam = async (teamData, trackId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/teams?trackId=${trackId}`,
      teamData
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при создании команды:", error);
    throw error;
  }
};

// Получение данных о командах
export const deleteTeam = async (teamId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/teams/${teamId}`);
      return response.data;
    } catch (error) {
      console.error("Ошибка при удалении команды:", error);
      throw error;
    }
  };

  //добавление существующего студента к команде
  export const addStudentToTeam = async (teamId, studentId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/teams/${teamId}/students/${studentId}`);
      return response.data;
    } catch (error) {
      console.error("Ошибка при добавлении студента к команде:", error);
      throw error;
    }
  };

  // Создание новой команды
export const updateTeam = async (teamData, trackId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/teams?trackId=${trackId}`,
      teamData
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при обновлении команды:", error);
    throw error;
  }
};






