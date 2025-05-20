import { observable, action, runInAction, makeObservable } from 'mobx';
import { ApplicationService } from '../service/applicationService';

class ApplicationStore {
  // для fetchApplications(trackId)
  applications = []

  // для отдельных запросов по паре teamId/studentId
  applicationsByKey = new Map()
  loadingByKey      = new Map()
  errorByKey        = new Map()

  constructor() {
    makeObservable(this, {
      applications:      observable,
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

  async fetchApplications(trackId) {
    this.applications = []
    try {
      const data = await ApplicationService.fetchApplications(trackId)
      console.log('DADARARADARAR', data)
      runInAction(() => {
        this.applications = data
      })
    } catch (err) {
      console.error('Ошибка при fetchApplications:', err)
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
      runInAction(() => {
        this.applicationsByKey.set(key, data)
      })
    } catch (err) {
      runInAction(() => {
        this.errorByKey.set(
          key,
          err.response?.data?.message || err.message || 'Ошибка при загрузке заявки'
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
          err.response?.data?.message || err.message || 'Ошибка при создании заявки'
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
          err.response?.data?.message || err.message || 'Ошибка при обновлении заявки'
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