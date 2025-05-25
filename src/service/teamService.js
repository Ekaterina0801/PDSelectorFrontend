
import requests from "../agent";


export const TeamService = {
  fetchTeams: ({ input, trackId, isFull, projectType, technologies, sort }) => {
    const queryParams = [];
  
    if (input) queryParams.push(`input=${encodeURIComponent(input)}`);
    if (trackId) queryParams.push(`track_id=${encodeURIComponent(trackId)}`);
    if (isFull !== undefined) queryParams.push(`is_full=${isFull}`);
    if (projectType) queryParams.push(`project_type=${encodeURIComponent(projectType)}`);
    if (sort) queryParams.push(`sort=${encodeURIComponent(sort)}`);
    
    if (technologies?.length) {

      const techIds = technologies.map(tech => tech.id || tech);
      techIds.forEach(id => queryParams.push(`technologies=${encodeURIComponent(id)}`));
    }
  
    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
    
    return requests.get(`/teams/search${queryString}`)
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error("API Error:", error);
        throw error;
      });
  },

  fetchTeamById: (teamId) => {
    return requests.get(`/teams/${teamId}`);
  },

  fetchFilterParamsByTrackId: (trackId) => {
    return requests.get(`/teams/filters?track_id=${trackId}`);
  },

  createTeam: (teamData) => {
    return requests.post(`/teams`, teamData);
  },

  updateTeam: (teamData, teamId) => {
    console.log('teamData', teamData);
    return requests.put(`/teams/${teamId}`, teamData);
  },

  deleteTeam: (teamId) => {
    return requests.delete(`/teams/${teamId}`);
  },

  addStudentToTeam: (teamId, studentId) => {
    return requests.put(`/teams/${teamId}/students/${studentId}`);
  },
  exportTeamsCsv: trackId =>
    requests.get(
      `/teams/export/csv?trackId=${encodeURIComponent(trackId)}`,
      { responseType: 'blob' }
    ),

  exportTeamsExcel: trackId =>
    requests.get(
      `/teams/export/excel?trackId=${encodeURIComponent(trackId)}`,
      { responseType: 'blob' }
    ),
};
