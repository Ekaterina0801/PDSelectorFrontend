import { makeAutoObservable, runInAction } from "mobx";
import ProjectTypeService from "../service/projectTypeService";
import { extractErrorMessage } from "../utils/errorUtils";
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
        this.error = extractErrorMessage(err) || 'Ошибка при загрузке типов проектов';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async createProjectType(name) {
    this.loading = true;
    this.error = null;
    try {
      const newType = await ProjectTypeService.createProjectType(name);
      runInAction(() => {
        this.projectTypes.push(newType);
      });
    } catch (err) {
      runInAction(() => {
        this.error = extractErrorMessage(err) || 'Ошибка при создании типа проекта';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async deleteProjectType(id) {
    this.loading = true;
    this.error = null;
    try {
      await ProjectTypeService.deleteProjectType(id);
      runInAction(() => {
        this.projectTypes = this.projectTypes.filter(pt => pt.id !== id);
      });
    } catch (err) {
      runInAction(() => {
        this.error = extractErrorMessage(err) || 'Ошибка при удалении типа проекта';
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
