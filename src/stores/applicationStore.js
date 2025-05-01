import { observable, action, runInAction, makeObservable } from 'mobx';
import { ApplicationService } from '../service/applicationService';


class ApplicationStore {
  applications = [];
  application = null;
  teamApplications = [];
  loading = false;
  error = null;

  constructor() {
    makeObservable(this, {
      applications: observable,
      application: observable,
      teamApplications: observable,
      loading: observable,
      error: observable,

      fetchApplications: action,
      fetchApplicationById: action,
      fetchTeamApplications: action,
      createApplication: action,
      updateApplication: action,
      deleteApplication: action,
      clearApplication: action,
      setError: action,
    });
  }

  async fetchApplications(trackId) {
    this.loading = true;
    this.error = null;
    try {
      const data = await ApplicationService.fetchApplications(trackId);
      runInAction(() => {
        this.applications = data;
      });
    } catch (err) {
      runInAction(() => {
        this.error = JSON.parse(err.message).detail || 'Ошибка при загрузке заявок';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchApplicationById(applicationId) {
    this.loading = true;
    this.error = null;
    try {
      const data = await ApplicationService.fetchApplicationById(applicationId);
      runInAction(() => {
        this.application = data;
      });
    } catch (err) {
      runInAction(() => {
        this.error = JSON.parse(err.message).detail || 'Ошибка при загрузке заявки';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchApplicationByTeamIdAndStudentId(teamId, studentId) {
    this.loading = true;
    this.error = null;
    try {
      const data = await ApplicationService.fetchApplicationByTeamIdAndStudentId(teamId, studentId);
      console.log('fetchApplicationByTeamIdAndStudentId', data);
      runInAction(() => {
        this.application = data;
      });
    } catch (err) {
      runInAction(() => {
        this.error = JSON.parse(err.message).detail || 'Ошибка при загрузке заявки';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchTeamApplications(teamId) {
    this.loading = true;
    this.error = null;
    try {
      const data = await ApplicationService.fetchTeamApplications(teamId);
      runInAction(() => {
        this.teamApplications = data;
      });
    } catch (err) {
      runInAction(() => {
        this.error = JSON.parse(err.message).detail || 'Ошибка при загрузке заявок команды';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async createApplication(applicationData) {
    this.loading = true;
    this.error = null;
    try {
      const newApp = await ApplicationService.createApplication(applicationData);
      runInAction(() => {
        this.applications.push(newApp);
        this.application = newApp;
      });
    } catch (err) {
      runInAction(() => {
        console.log('createApplication error', err);
        this.error = JSON.parse(err.message).detail || 'Ошибка при создании заявки';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async updateApplication(applicationData) {
    this.loading = true;
    this.error = null;
    try {
      console.log('updateApplication', applicationData);
      const updatedApp = await ApplicationService.updateApplication(applicationData);
      runInAction(() => {
        this.application = updatedApp;
        console.log('updatedApp', updatedApp);
        this.applications = this.applications.map(app =>
          app.id === updatedApp.id ? updatedApp : app
        );
      });
    } catch (err) {
      runInAction(() => {
        this.error = JSON.parse(err.message).detail || 'Ошибка при обновлении заявки';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async deleteApplication(applicationId) {
    this.loading = true;
    this.error = null;
    try {
      await ApplicationService.deleteApplication(applicationId);
      runInAction(() => {
        this.applications = this.applications.filter(app => app.id !== applicationId);
        if (this.application?.id === applicationId) this.application = null;
      });
    } catch (err) {
      runInAction(() => {
        this.error = JSON.parse(err.message).detail || 'Ошибка при удалении заявки';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  clearApplication() {
    this.application = null;
  }

  setError(error) {
    this.error = error;
  }
}

const applicationStore = new ApplicationStore();
export default applicationStore;
