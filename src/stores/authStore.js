import { makeAutoObservable, runInAction } from "mobx";
import { AuthService } from "../service/authService";
import commonStore from "./commonStore";
import StudentService from "../service/studentService";

class AuthStore {
  user = null;
  studentId = null;
  trackId = null;
  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
    this.loadTrackId(); 
  }

  loadTrackId() {
    const savedTrackId = localStorage.getItem("trackId");
    if (savedTrackId) {
      this.trackId = savedTrackId;
    } else {
      this.trackId = 1; 
    }
  }


  setTrackId(trackId) {
    this.trackId = trackId;
    localStorage.setItem("trackId", trackId); 
  }

  async checkAuth() {
    if (this.trackId == null) {
      this.trackId = 1; 
    }

    this.isLoading = true;
    try {
      const user = await AuthService.getCurrentUser();
      const student = await StudentService.getCurrentStudentId();
      console.log('user', user);
      runInAction(() => {
        this.user = user;
        this.studentId = student;
        commonStore.loadToken();
      });
    } catch (error) {
      console.error("Ошибка при авторизации:", error);
      runInAction(() => {
        this.user = null;
        this.error = error?.message || "Ошибка авторизации";
      });

      if (error?.status === 401 || error?.response?.status === 401) {
        window.location.href = "/login"; 
      }
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  logout() {
    this.user = null;
    commonStore.setToken(null);
    window.location.href = "/login";
  }

  get isAuthenticated() {
    return !!this.user;
  }
}

const authStore = new AuthStore();
export default authStore;