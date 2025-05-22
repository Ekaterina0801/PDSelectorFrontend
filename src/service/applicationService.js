import requests from "../agent";

export const ApplicationService = {
  // Получение всех заявок по треку
  fetchApplications: (params) => {
    const queryParams = [];
    if (params.page) queryParams.push(`page=${params.page}`);
    if (params.size) queryParams.push(`size=${params.size}`);
    if (params.sort) queryParams.push(`sort=${params.sort}`);
    if (params.track_id) queryParams.push(`track_id=${params.track_id}`);
    if (params.status) queryParams.push(`status=${params.status.toLowerCase()}`);
    
    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
    return requests.get(`/applications${queryString}`);
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
