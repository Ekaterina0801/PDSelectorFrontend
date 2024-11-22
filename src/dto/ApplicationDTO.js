export default class ApplicationDto {
    constructor({
      id = null,
      student = null,
      team = null,
      status = '',
    } = {}) {
      this.id = id; 
      this.student = student; 
      this.team = team; 
      this.status = status; 
    }
  }

  