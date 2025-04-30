import { makeAutoObservable, runInAction } from "mobx";
import ProjectTypeService from "../service/projectTypeService";

class ProjectTypeStore {
  projectTypes = [];
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchProjectTypes() {
    this.loading = true;
    this.error = null;

    try {
      const data = await ProjectTypeService.fetchProjectTypes();
      runInAction(() => {
        this.projectTypes = data;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message || "Ошибка при загрузке типов проектов";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  clear() {
    this.projectTypes = [];
    this.error = null;
  }
}

const projectTypeStore = new ProjectTypeStore();
export default projectTypeStore;
