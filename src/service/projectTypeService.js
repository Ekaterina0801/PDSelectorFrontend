import { API_BASE_URL } from '../config/apiConfig';
import requests from '../agent';

class ProjectTypeService {
  static async fetchProjectTypes() {
    return requests.get("/projectTypes");
  }

  static async createProjectType(name) {
    return requests.post("/projectTypes", { name });
  }

  static async deleteProjectType(id) {
    return requests.delete(`/projectTypes/${id}`);
  }
}

export default ProjectTypeService;