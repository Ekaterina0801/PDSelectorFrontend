import { makeAutoObservable, runInAction } from "mobx";
import TechnologyService from "../service/technologyService";

class TechnologyStore {
  technologies = [];
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchTechnologies() {
    this.loading = true;
    this.error = null;
    try {
      const data = await TechnologyService.fetchTechnologies();
      runInAction(() => {
        this.technologies = data;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message || "Ошибка при загрузке технологий";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  clear() {
    this.technologies = [];
    this.error = null;
  }
}

const technologyStore = new TechnologyStore();
export default technologyStore;
