import { API_BASE_URL } from '../config/apiConfig';
import requests from '../agent';

class ProjectTypeService {
    static async fetchProjectTypes() {
      return requests.get("/projectTypes")
    }
  }
  
  export default ProjectTypeService;
