import requests from "../agent";

export const ApplicationService = {
  // Получение всех заявок по треку
  fetchApplications: (trackId) => {
    return requests.get(`/applications?track_id=${trackId}`);
  },

  // Получение одной заявки
  fetchApplicationById: (applicationId) => {
    return requests.get(`/applications/${applicationId}`);
  },

  // Получение заявки по студенту и команде
  fetchApplicationByTeamIdAndStudentId: (teamId, studentId) => {
    console.log('fetchApplicationByTeamIdAndStudentId', teamId, studentId);
    return requests.get(`/applications/team/${teamId}/student/${studentId}`);
  },

  // Получение заявок команды
  fetchTeamApplications: (teamId) => {
    return requests.get(`/teams/${teamId}/subscriptions`);
  },

  // Создание заявки
  createApplication: (applicationData) => {
    return requests.post('/applications', applicationData);
  },

  // Обновление заявки
  updateApplication: (applicationData) => {
    return requests.put('/applications', applicationData);
  },

  // Удаление заявки
  deleteApplication: (applicationId) => {
    return requests.del(`/applications/${applicationId}`);
  }
};
