import { makeAutoObservable, runInAction } from "mobx";
import TechnologyService from "../service/technologyService";
import { extractErrorMessage } from "../utils/errorUtils";
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
        this.error = extractErrorMessage(err) || 'Ошибка при загрузке технологий';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async createTechnology(name) {
    this.loading = true;
    this.error = null;
    try {
      const newTech = await TechnologyService.createTechnology(name);
      runInAction(() => {
        this.technologies.push(newTech);
      });
    } catch (err) {
      runInAction(() => {
        this.error = extractErrorMessage(err) || 'Ошибка при создании технологии';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async deleteTechnology(id) {
    this.loading = true;
    this.error = null;
    try {
      await TechnologyService.deleteTechnology(id);
      runInAction(() => {
        this.technologies = this.technologies.filter(t => t.id !== id);
      });
    } catch (err) {
      runInAction(() => {
        this.error = extractErrorMessage(err) || 'Ошибка при удалении технологии';
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