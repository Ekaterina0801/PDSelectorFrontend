import requests from "../agent";
class TechnologyService {
  static async fetchTechnologies() {
    return requests.get("/technologies");
  }

  static async createTechnology(name) {
    return requests.post("/technologies", { name });
  }

  static async deleteTechnology(id) {
    return requests.delete(`/technologies/${id}`);
  }
}

export default TechnologyService;