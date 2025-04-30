
import requests from "../agent";

const encode = encodeURIComponent;

export const TeamService = {
  fetchTeams: ({ input, trackId, isFull, projectType, technologies }) => {
    const queryParams = [];
  
    if (input) queryParams.push(`input=${encodeURIComponent(input)}`);
    if (trackId) queryParams.push(`track_id=${encodeURIComponent(trackId)}`);
    if (isFull !== undefined) queryParams.push(`is_full=${isFull}`);
    if (projectType) queryParams.push(`project_type=${encodeURIComponent(projectType)}`);
    
    if (technologies?.length) {

      const techIds = technologies.map(tech => tech.id || tech);
      techIds.forEach(id => queryParams.push(`technologies=${encodeURIComponent(id)}`));
    }
  
    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
    console.log("API Request:", queryString);
    
    return requests.get(`/teams/search${queryString}`)
      .then(data => {
        console.log("API Response:", data);
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
    return requests.put(`/teams/${teamId}`, teamData);
  },

  deleteTeam: (teamId) => {
    return requests.del(`/teams/${teamId}`);
  },

  addStudentToTeam: (teamId, studentId) => {
    return requests.put(`/teams/${teamId}/students/${studentId}`);
  }
};
