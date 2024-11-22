export default class StudentDto {
    constructor({
      id = null,
      course = null,
      group_number = null,
      about_self = '',
      contacts = '',
      has_team = false,
      is_captain = false,
      current_team = null,
      technologies = [],
      applications = [],
      user = null,
    } = {}) {
      this.id = id; 
      this.course = course; 
      this.group_number = group_number; 
      this.about_self = about_self; 
      this.contacts = contacts; 
      this.has_team = has_team; 
      this.is_full = is_full; 
      this.is_captain = is_captain; 
      this.current_team = current_team; 
      this.technologies = technologies; 
      this.applications = applications;
      this.user = user;
    }
  }
  