import axios from "axios";

import { API_BASE_URL } from '../config/apiConfig';
export const fetchTeams = async ({ input, trackId, isFull, projectType, technologies }) => {
  try {
    // Формируем параметры запроса
    const queryParams = new URLSearchParams();

    if (input) queryParams.append("input", input);
    console.log("input", input);
    if (trackId) queryParams.append("track_id", trackId);
    if (isFull !== undefined) queryParams.append("is_full", isFull);
    if (projectType) queryParams.append("project_type", projectType);
    if (technologies && technologies.length > 0) {
      technologies.forEach((techId) => queryParams.append("technologies", techId));
    }

    const response = await fetch(`${API_BASE_URL}/teams/search?${queryParams.toString()}`, {
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
    console.error("Ошибка при получении данных команд:", error);
    throw error;
  }
};



// Получение данных о командах
export const fetchTeamById = async (teamId) => {
  console.log('id team',teamId);
    try {
      const response = await fetch(`${API_BASE_URL}/teams/${teamId}`, {
        method: 'GET',
        credentials: 'include', 
      });

      return response.json();
    } catch (error) {
      console.error("Ошибка при получении данных команды:", error);
      throw error;
    }
  };

  // Получение данных о фильтре
export const fetchFilterParamsByTrackId = async (trackId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/teams/filters?track_id=${trackId}`, {
        method: 'GET',
        credentials: 'include', 
      });

      return response.json();
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
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



