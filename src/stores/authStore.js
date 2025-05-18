import { makeAutoObservable, runInAction } from "mobx";
import { AuthService } from "../service/authService";
import StudentService from "../service/studentService";
import commonStore from "./commonStore";
import trackStore from "./trackStore";

class AuthStore {
  user = null;
  isAdmin = false;
  studentId = null;
  authStudent = null;
  users = [];
  total = 0;
  loading = false;
  error = null;
  trackId = null;
  filters = {
    page: 0,
    size: 10,
    sort: "fio,asc",
    fio: null,
    role: null,
    course: null,
    groupNumber: null,
    trackId: null,
    isEnabled: null
  };
  roles = [];

  constructor() {
    makeAutoObservable(this);
    this.loadTrackId();
  }

  loadTrackId() {
    const stored = localStorage.getItem("trackId");
    this.trackId = stored ? Number(stored) : 1;
    this.filters.trackId = this.trackId;
  }

  get isTrackActive() {
    const track = trackStore.tracks.find(t => t.id === this.trackId);
    if (!track || !track.startDate || !track.endDate) return false;
    const today = new Date();
    const start = new Date(track.startDate);
    const end   = new Date(track.endDate);
    return today >= start && today <= end;
  }

  setTrackId(trackId) {
    this.trackId = trackId;
    localStorage.setItem("trackId", trackId);
    this.setFilters({ trackId });
  }

  setFilters(newFilters) {
    this.filters = { ...this.filters, ...newFilters };
    this.fetchUsers();
  }

  async fetchRoles() {
    try {
      const data = await AuthService.getRoles();
      console.log("dataRoles", data);
      runInAction(() => {
        this.roles = data;
        console.log("rolesStore", this.roles);
      });
    } catch {}
  }

  async fetchUsers() {
    this.loading = true;
    this.error = null;
    try {
      const {
        page,
        size,
        sort,
        fio,
        role,
        course,
        groupNumber,
        trackId,
        isEnabled
      } = this.filters;
      const data = await AuthService.fetchUsers({
        page,
        size,
        sort,
        filterFio: fio,
        filterRole: role,
        filterCourse: course,
        filterGroupNumber: groupNumber,
        trackId,
        isEnabled
      });
      console.log('total', data.totalElements)
      runInAction(() => {
        this.users = data.content;
        this.total = data.totalElements;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message || "Ошибка при загрузке пользователей";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async checkAuth() {
    if (this.trackId == null) {
      this.trackId = 1;
    }
    this.loading = true;
    this.error = null;
    try {
      const user = await AuthService.getCurrentUser();
      const student = await StudentService.getCurrentStudentId();
      let studentData = null;
      if (student)
        studentData = await StudentService.fetchStudentById(student);
      console.log("STUDENT_DATA", studentData);
      this.loadTrackId();
      runInAction(() => {
        this.user = user;
        this.studentId = student;
        this.authStudent = studentData;
        this.isAdmin = user.role === "ADMIN";
        console.log("user", user);
        console.log('isAdmin', this.isAdmin);
        commonStore.loadToken();
      });
    } catch (err) {
      runInAction(() => {
        this.user = null;
        this.error = err.message || "Ошибка авторизации";
      });
      if (err?.response?.status === 401) {
        window.location.href = "/login";
      }
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  logout() {
    this.user = null;
    commonStore.setToken(null);
    window.location.href = "/login";
  }

  async updateUser(dto) {
    this.loading = true;
    this.error   = null;
    try {
      // не передавать туда ничего лишнего:
      const cleaned = Object.fromEntries(
        Object.entries(dto).filter(([_, v]) => v != null)
      );
      await AuthService.updateUser(cleaned);
      await this.fetchUsers();
    } catch (err) {
      runInAction(() => {
        this.error = err.message || "Ошибка при сохранении пользователя";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
  

  async deleteUser(id) {
    if (!window.confirm("Вы уверены, что хотите деактивировать этого пользователя?")) {
      console.log("User deletion cancelled");
      return;
    
    }
    console.log("Deleting user with ID:", id);
    this.loading = true;
    this.error = null;
    try {
      await AuthService.deleteUser(id);
      await this.fetchUsers();
    } catch (err) {
      runInAction(() => {
        console.log('errroooor');
        console.log(err);
        this.error = err.message || "Ошибка при удалении пользователя";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  get isAuthenticated() {
    return !!this.user;
  }

  setError(error) {
    this.error = error;
  }
}

export default new AuthStore();