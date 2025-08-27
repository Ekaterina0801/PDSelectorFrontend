import requests from '../agent';

class StudentService {

  static async fetchStudents({ input, trackId, course, groups, hasTeam, isCaptain, technologies, page = 0, size = 10, sort = 'name,asc' }) {
    const queryParams = [];
  
    if (input) queryParams.push(`input=${encodeURIComponent(input)}`);
    if (course) queryParams.push(`course=${encodeURIComponent(course)}`);
    if (groups) queryParams.push(`group_number=${encodeURIComponent(groups)}`);
    if (hasTeam !== undefined) queryParams.push(`has_team=${hasTeam}`);
    if (isCaptain !== undefined) queryParams.push(`is_captain=${isCaptain}`);
    if (trackId) queryParams.push(`track_id=${encodeURIComponent(trackId)}`);

    if (technologies && technologies.length > 0) {
      technologies.forEach(tech => queryParams.push(`technologies=${encodeURIComponent(tech)}`));
    }
  
    queryParams.push(`page=${encodeURIComponent(page)}`);
    queryParams.push(`size=${encodeURIComponent(size)}`);
    queryParams.push(`sort=${encodeURIComponent(sort)}`);
  
    const queryString = `?${queryParams.join('&')}`;
    console.log('query', queryParams);
    return requests.get(`/students/search${queryString}`);
  }
  
  // Создание студента
  static async createStudent(trackId, studentData) {
    console.log('trackId',trackId);
    console.log('studentData',studentData);
    return requests.post(`/students?trackId=${encodeURIComponent(trackId)}`, studentData);
  }

  // Удаление студента
  static async deleteStudent(studentId) {
    return requests.del(`/students/${encodeURIComponent(studentId)}`);
  }

  static async fetchFilterParamsByTrackId(trackId) {
      if (trackId){
        return requests.get(`/students/filters?track_id=${trackId}`);

      }
    }

  // Получение студента по ID
  static async fetchStudentById(studentId) {
    return requests.get(`/students/${encodeURIComponent(studentId)}`);
  }

  // Обновление студента
  static async updateStudent(studentData, studentId) {
    return requests.put(`/students/${encodeURIComponent(studentId)}`, studentData);
  }

  // Получение текущего студента
  static async getCurrentStudentId() {
    return requests.get('/students/me');
  }

  static async exportStudentsCsv(trackId) {
    console.log('trackIdInService', trackId);
    const response = await requests.get(
      `/students/export/csv?trackId=${encodeURIComponent(trackId)}`,
      { 
        responseType: 'blob' 
      }
    );
    // тут response — это объект axios-ответа
    console.log('response', response);
    return response;  // data будет Blob
  }

  /** Скачивает Excel для переданного трека и возвращает Blob */
  static async exportStudentsExcel(trackId) {
    const response = await requests.get(
      `/students/export/excel?trackId=${encodeURIComponent(trackId)}`,
      { 
        responseType: 'blob' 
      }
    );
    return response;
  }

  static async fetchAvailableForTeam({ trackId, teamId }) {
    const params = [];
    if (trackId  != null) params.push(`track_id=${encodeURIComponent(trackId)}`);
    if (teamId   != null) params.push(`team_id=${encodeURIComponent(teamId)}`);
    const qs = params.length ? `?${params.join("&")}` : "";
    return requests.get(`/students/available${qs}`);
  }
}

export default StudentService;
