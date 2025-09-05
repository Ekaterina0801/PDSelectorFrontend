import { observable, action, runInAction, makeObservable } from 'mobx';
import { ApplicationService } from '../service/applicationService';
import { extractErrorMessage } from '../utils/errorUtils';
class ApplicationStore {
  // для fetchApplications(trackId)
  applications = []
  loading      = false;
  page           = 0;
  size           = 10;
  sort           = 'id,asc';
  totalPages     = 0;
  totalElements  = 0;

  // для отдельных запросов по паре teamId/studentId
  applicationsByKey = new Map()
  loadingByKey      = new Map()
  errorByKey        = new Map()

  constructor() {
    makeObservable(this, {
      applications:      observable,
      loading:           observable,
      applicationsByKey: observable,
      loadingByKey:      observable,
      errorByKey:        observable,

      fetchApplications:      action,
      fetchApplication:       action,
      createApplication:      action,
      updateApplication:      action,
      clearApplicationKey:    action,
    })
  }

  makeKey(teamId, studentId) {
    return `${teamId}_${studentId}`
  }

  setPage(newPage) {
    this.page = newPage;
    this.fetchApplications();
  }

  setSort(newSort) {
    this.sort = newSort;
    this.page = 0;
    this.fetchApplications();
  }

  setSize(newSize) {
    this.size = newSize;
    this.page = 0;
    this.fetchApplications();
  }

  async fetchApplications({ track_id = null, status = null } = {}) {
    this.loading = true;
    this.error = null;
    try {
      const params = {
        page: this.page,
        size: this.size,
        sort: this.sort,
      };
      if (track_id != null) params.track_id = track_id;
      if (status != null) params.status = status;

      const response = await ApplicationService.fetchApplications(params);
      runInAction(() => {
        const { content, totalPages, totalElements } = response;
        this.applications = content;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
      });
    } catch (err) {
      runInAction(() => {
        this.error = extractErrorMessage(err) || 'Ошибка при загрузке заявок';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  getApplication(teamId, studentId) {
    return this.applicationsByKey.get(this.makeKey(teamId, studentId)) || null
  }

  getLoading(teamId, studentId) {
    return this.loadingByKey.get(this.makeKey(teamId, studentId)) || false
  }

  getError(teamId, studentId) {
    return this.errorByKey.get(this.makeKey(teamId, studentId)) || null
  }

  clearApplicationKey(teamId, studentId) {
    const key = this.makeKey(teamId, studentId)
    this.applicationsByKey.delete(key)
    this.loadingByKey.delete(key)
    this.errorByKey.delete(key)
  }

  async fetchApplication(teamId, studentId) {
    const key = this.makeKey(teamId, studentId)
    this.loadingByKey.set(key, true)
    this.errorByKey.set(key, null)
    try {
      const data = await ApplicationService.fetchApplicationByTeamIdAndStudentId(teamId, studentId)
      if (data !== null) {
        data.possibleTransitions = data.possibleTransitions.map(element =>
          element.toLowerCase()
        );
      }
      runInAction(() => {
        this.applicationsByKey.set(key, data)
      })
    } catch (err) {
      runInAction(() => {
        this.errorByKey.set(
          key,
          extractErrorMessage(err) || 'Ошибка при загрузке заявки'
        )
      })
    } finally {
      runInAction(() => {
        this.loadingByKey.set(key, false)
      })
    }
  }

  async createApplication(payload) {
    const key = this.makeKey(payload.team_id, payload.student_id)
    this.loadingByKey.set(key, true)
    this.errorByKey.set(key, null)
    try {
      const newApp = await ApplicationService.createApplication(payload)
      runInAction(() => {
        this.applicationsByKey.set(key, newApp)
      })
      return newApp
    } catch (err) {
      runInAction(() => {
        this.errorByKey.set(
          key,
          extractErrorMessage(err) || 'Ошибка при создании заявки'
        )
      })
      throw err
    } finally {
      runInAction(() => {
        this.loadingByKey.set(key, false)
      })
    }
  }

  async updateApplication(payload) {
    const key = this.makeKey(payload.team_id, payload.student_id)
    this.loadingByKey.set(key, true)
    this.errorByKey.set(key, null)
    try {
      const updated = await ApplicationService.updateApplication(payload)
      runInAction(() => {
        this.applicationsByKey.set(key, updated)
      })
      return updated
    } catch (err) {
      runInAction(() => {
        this.errorByKey.set(
          key,
          extractErrorMessage(err) || 'Ошибка при обновлении заявки'
        )
      })
      throw err
    } finally {
      runInAction(() => {
        this.loadingByKey.set(key, false)
      })
    }
  }
}

export default new ApplicationStore()