import requests from "../agent";
class TechnologyService {
    static async fetchTechnologies() {
      return requests.get("/technologies");
    }
  }
  
  export default TechnologyService;