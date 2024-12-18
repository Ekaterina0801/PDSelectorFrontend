export default class ApplicationDto {
    constructor({
      id = null,
      studentId = null,
      teamId = null,
      status = '',
    } = {}) {
      this.id = id; 
      this.studentId = studentId; 
      this.teamId = teamId; 
      this.statusId = status; 
    }
  }

  