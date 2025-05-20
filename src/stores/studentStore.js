import { makeAutoObservable, observable, action, runInAction, computed } from 'mobx';
import StudentService from '../service/studentService';
import authStore from './authStore';
import { isCancel } from 'axios';

class StudentStore {
  students = [];
  student = null;
  loading = false;
  error = null;
  filters = {};
  allFilters = {};

  constructor() {
    makeAutoObservable(this);
  }

  get hasError() {
    return this.error != null;
  }

  async fetchStudents(params = {}) {
    this.loading = true;
    this.error = null;

    try {
      const data = await StudentService.fetchStudents(params);
      console.log('studentsData', data);
      const filters = await StudentService.fetchFilterParamsByTrackId(params.trackId);
      console.log('filters', filters);

      runInAction(() => {
        this.students = data.content;
        this.allFilters = filters;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message || "Ошибка при загрузке студентов";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchStudentById(studentId) {
    this.loading = true;
    this.error = null;

    try {
      const student = await StudentService.fetchStudentById(studentId);
      runInAction(() => {
        this.student = student;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message || "Ошибка при загрузке студента";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async createStudent(trackId, studentData) {
    this.loading = true;
    this.error = null;

    try {
      console.log('CREATEDATA', studentData);
      const newStudent = await StudentService.createStudent(trackId, studentData);
      runInAction(() => {
        this.students.push(newStudent);
        this.student = newStudent;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message || "Ошибка при создании студента";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async updateStudent(studentData, studentId) {
    this.loading = true;
    this.error = null;

    try {
      const updated = await StudentService.updateStudent(studentData, studentId);
      runInAction(() => {
        this.student = updated;
        this.students = this.students.map(s => s.id === updated.id ? updated : s);
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message || "Ошибка при обновлении студента";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async deleteStudent(studentId) {
    this.loading = true;
    this.error = null;

    try {
      await StudentService.deleteStudent(studentId);
      runInAction(() => {
        this.students = this.students.filter(s => s.id !== studentId);
        if (this.student?.id === studentId) this.student = null;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message || "Ошибка при удалении студента";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async getCurrentStudentId() {
    try {
      const student = await StudentService.getCurrentStudentId();
      runInAction(() => {
        this.student = student;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message || "Ошибка при получении текущего студента";
      });
    }
  }

  async fetchFilters(trackId) {
    this.loading = true;
    this.error = null;

    try {
      const filters = await StudentService.fetchFilterParamsByTrackId(trackId);
      runInAction(() => {
        this.allFilters = filters;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message || "Ошибка при загрузке фильтров";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  setFilters(newFilters) {
    const parsedFilters = {
      ...(newFilters.trackId && { trackId: newFilters.trackId }),
      ...(newFilters.technologies && { technologies: newFilters.technologies.map(t => t.id || t) }),
      ...(newFilters.hasTeam !== undefined && { hasTeam: newFilters.hasTeam }),
      ...(newFilters.course !== undefined && { course: newFilters.course }),
      ...(newFilters.isCaptain !== undefined && { isCaptain: newFilters.isCaptain }),
    };

    this.filters = parsedFilters;
    this.fetchStudents(this.filters);
  }

  resetFilters() {
    this.filters = {};
    this.fetchStudents({});
  }

  clearStudent() {
    this.student = null;
  }
}

const studentStore = new StudentStore();
export default studentStore;
