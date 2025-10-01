import { makeAutoObservable, observable, action, runInAction, computed } from 'mobx';
import StudentService from '../service/studentService';
import { extractErrorMessage } from '../utils/errorUtils';
import { sort } from 'd3';
class StudentStore {
  students = [];
  student = null;
  loading = false;
  error = null;
  filters = {};
  allFilters = {};
  availableStudents = []; 

  constructor() {
    makeAutoObservable(this);
    this.loadFilterData();
  }

  loadFilterData() {
    try {
      const studentFilters = localStorage.getItem("studentFilters");
      if (studentFilters) {
        const studentFiltersParse = JSON.parse(studentFilters);
        this.filters = {...this.filters, ...studentFiltersParse};
      }
    }
    catch (error) {
      console.error("Ошибка при извлечении фильтров из localStorage: ", error);
    }
  }

  setStudentsFilters(newFilters) {
    try {
    localStorage.setItem("studentFilters", JSON.stringify(newFilters));
    }
    catch (error) {
      console.error("Ошибка при сохранении фильтров в localStorage: ", error);
    }
  }

  get hasError() {
    return this.error != null;
  }
  async fetchAvailableStudents({ trackId, teamId }) {
    this.loading = true;
    this.error   = null;
    try {
      const list = await StudentService.fetchAvailableForTeam({ trackId, teamId });
      runInAction(() => {
        this.availableStudents = list;
      });
    } catch (err) {
      runInAction(() => {
        this.error = extractErrorMessage(err) || "Ошибка при загрузке доступных студентов";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchStudents(params = {}) {
    this.loading = true;
    this.error = null;
    try {
      const data = await StudentService.fetchStudents(params);
      const filters = await StudentService.fetchFilterParamsByTrackId(params.trackId);
      runInAction(() => {
        this.students = data.content;
        this.allFilters = filters;
      });
    } catch (err) {
      runInAction(() => {
        this.error = extractErrorMessage(err) || "Ошибка при загрузке студентов";
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
        this.error = extractErrorMessage(err) || "Ошибка при загрузке студента";
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
      const newStudent = await StudentService.createStudent(trackId, studentData);
      runInAction(() => {
        this.students.push(newStudent);
        this.student = newStudent;
      });
    } catch (err) {
      runInAction(() => {
        this.error = extractErrorMessage(err) || "Ошибка при создании студента";
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
        this.error = extractErrorMessage(err) || "Ошибка при обновлении студента";
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
        this.error = extractErrorMessage(err) || "Ошибка при удалении студента";
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
        this.error = extractErrorMessage(err) || "Ошибка при получении текущего студента";
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
        this.error = extractErrorMessage(err) || "Ошибка при загрузке фильтров";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  setFilters(newFilters) {
    const parsedFilters = {
      ...(newFilters.input && { input: newFilters.input }),
      ...(newFilters.trackId && { trackId: newFilters.trackId }),
      ...(newFilters.technologies && { technologies: newFilters.technologies.map(t => t.id || t) }),
      ...(newFilters.hasTeam !== undefined && { hasTeam: newFilters.hasTeam }),
      ...(newFilters.course !== undefined && { course: newFilters.course }),
      ...(newFilters.isCaptain !== undefined && { isCaptain: newFilters.isCaptain }),
      ...(newFilters.groups !== undefined && { groups: newFilters.groups }),
      ...(newFilters.sort !== undefined && { sort: newFilters.sort })
    };
    this.filters = parsedFilters;
    this.fetchStudents(this.filters);
    this.setStudentsFilters(parsedFilters);
  }

  resetFilters() {
    this.filters = {};
    this.fetchStudents({});
  }

  clearStudent() {
    this.student = null;
  }

  setError(error) {
    this.error = error;
  }
}

const studentStore = new StudentStore();
export default studentStore;
