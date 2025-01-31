export default class TeamDto {
    constructor({
      id = null,
      name = '',
      project_description = '',
      project_type = null,
      quantity_of_students = 0,
      captain = null,
      is_full = false,
      technologies = [],
      current_track = null,
      students = [],
      applications = [],
    } = {}) {
      this.id = id; 
      this.name = name; 
      this.project_description = project_description; 
      this.project_type = project_type; 
      this.quantity_of_students = quantity_of_students; 
      this.captain = captain; 
      this.is_full = is_full; 
      this.technologies = technologies; 
      this.current_track = current_track; 
      this.students = students; 
      this.applications = applications;
    }
  }