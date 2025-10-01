import requests from '../agent';

class StudentService {

  static async fetchStudents({ input, trackId, course, groups, hasTeam, isCaptain, technologies, page = 0, size = 10, sort = 'name,asc' }) {
    const queryParams = [];
  
    if (input) queryParams.push(`input=${encodeURIComponent(input)}`);
    if (course && course.length > 0) 
    {
      //queryParams.push(`course=${encodeURIComponent(course)}`);
      course.forEach(c => queryParams.push(`course=${encodeURIComponent(c)}`));
    }
    if (groups && groups.length > 0)
    { 
      //queryParams.push(`group_number=${encodeURIComponent(groups)}`);
      groups.forEach(g => queryParams.push(`group_number=${encodeURIComponent(g)}`));
    }
    if (hasTeam !== undefined) queryParams.push(`has_team=${hasTeam}`);
    if (isCaptain !== undefined) queryParams.push(`is_captain=${isCaptain}`);
    if (trackId) queryParams.push(`track_id=${encodeURIComponent(trackId)}`);

    if (technologies && technologies.length > 0) {
      technologies.forEach(tech => queryParams.push(`technologies=${encodeURIComponent(tech)}`));
    }
  
    if (page) queryParams.push(`page=${encodeURIComponent(page)}`);
    if (size) queryParams.push(`size=${encodeURIComponent(size)}`);
    if (sort) queryParams.push(`sort=${encodeURIComponent(sort)}`);
  
    const queryString = `?${queryParams.join('&')}`;
    return requests.get(`/students/search${queryString}`);
  }
  
  // Создание студента
  static async createStudent(trackId, studentData) {
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
    const response = await requests.get(
      `/students/export/csv?trackId=${encodeURIComponent(trackId)}`,
      { 
        responseType: 'blob' 
      }
    );
    // тут response — это объект axios-ответа
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
