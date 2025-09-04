import { makeAutoObservable, runInAction } from "mobx";
import { AuthService } from "../service/authService";
import StudentService from "../service/studentService";
import commonStore from "./commonStore";
import trackStore from "./trackStore";
import { extractErrorMessage } from "../utils/errorUtils";
class AuthStore {
  // --- observable state ---
  user = null;
  isAdmin = false;

  studentId = null;
  authStudent = null;

  users = [];
  total = 0;

  loading = false;      // текущее состояние загрузки (авторизация/запросы)
  initialized = false;  // первичная инициализация завершена?

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
    makeAutoObservable(this, {}, { autoBind: true });
    this.loadTrackId();
  }

  // ---------- computed ----------
  get isAuthenticated() {
    return !!this.user;
  }

  get isTrackActive() {
    const track = trackStore.tracks.find(t => t.id === this.trackId);
    if (!track || !track.startDate || !track.endDate) return false;
    const today = new Date();
    const start = new Date(track.startDate);
    const end   = new Date(track.endDate);
    return today >= start && today <= end;
  }

  // ---------- basic setters ----------
  setError(error) {
    this.error = error;
  }

  // ---------- track helpers ----------
  loadTrackId() {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("trackId") : null;
      this.trackId = stored ? Number(stored) : 1;
      this.filters.trackId = this.trackId; // без fetchUsers на старте
    } catch {
      this.trackId = 1;
      this.filters.trackId = 1;
    }
  }

  setTrackId(trackId) {
    this.trackId = trackId;
    try { localStorage.setItem("trackId", String(trackId)); } catch {}
    this.setFilters({ trackId });
  }

  // ---------- users table ----------
  setFilters(newFilters) {
    this.filters = { ...this.filters, ...newFilters };
    this.fetchUsers();
  }

  async fetchRoles() {
    try {
      const data = await AuthService.getRoles();
      runInAction(() => { this.roles = data ?? []; });
    } catch {}
  }

  async fetchUsers() {
    this.loading = true;
    this.error = null;
    try {
      const {
        page, size, sort, fio, role, course, groupNumber, trackId, isEnabled
      } = this.filters;

      const data = await AuthService.fetchUsers({
        page, size, sort,
        filterFio: fio,
        filterRole: role,
        filterCourse: course,
        filterGroupNumber: groupNumber,
        trackId,
        isEnabled
      });

      runInAction(() => {
        this.users = data?.content ?? [];
        this.total = data?.totalElements ?? 0;
      });
    } catch (err) {
      runInAction(() => {
        this.error = extractErrorMessage(err) || "Ошибка при загрузке пользователей";
      });
    } finally {
      runInAction(() => { this.loading = false; });
    }
  }

  async updateUser(dto) {
    this.loading = true;
    this.error   = null;
    try {
      const cleaned = Object.fromEntries(Object.entries(dto).filter(([, v]) => v != null));
      await AuthService.updateUser(cleaned);
      await this.fetchUsers();
    } catch (err) {
      runInAction(() => {
        this.error = extractErrorMessage(err) || "Ошибка при сохранении пользователя";
      });
    } finally {
      runInAction(() => { this.loading = false; });
    }
  }

  async deleteUser(id) {
    if (!window.confirm("Вы уверены, что хотите деактивировать этого пользователя?")) return;
    this.loading = true;
    this.error = null;
    try {
      await AuthService.deleteUser(id);
      await this.fetchUsers();
    } catch (err) {
      runInAction(() => {
        this.error = extractErrorMessage(err) || "Ошибка при удалении пользователя";
      });
    } finally {
      runInAction(() => { this.loading = false; });
    }
  }

  // ---------- auth lifecycle ----------
  async bootstrap() {
    if (this.initialized) return;

    // подхватываем токен (если commonStore ещё не успел)
    commonStore.loadToken?.();

    // если токена нет — не дёргаем бекенд: сразу считаем неавторизованным
    const token =
      commonStore.token ||
      (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    if (!token) {
      runInAction(() => {
        this.user = null;
        this.isAdmin = false;
        this.studentId = null;
        this.authStudent = null;
        this.loading = false;
        this.initialized = true;
      });
      return;
    }

    // токен есть — проверяем
    this.loading = true;
    try {
      await this.checkAuth();
    } finally {
      runInAction(() => {
        this.loading = false;
        this.initialized = true;
      });
    }
  }

  async checkAuth() {
    if (this.trackId == null) this.trackId = 1;

    this.error = null;
    try {
      const user = await AuthService.getCurrentUser();
      const student = await StudentService.getCurrentStudentId();
      const studentData = student ? await StudentService.fetchStudentById(student) : null;

      this.loadTrackId(); // синк трека из LS

      runInAction(() => {
        this.user = user ?? null;
        this.studentId = student ?? null;
        this.authStudent = studentData ?? null;

        // роли на фронте: считаем админом только при точном ADMIN
        this.isAdmin = (user?.role === "ADMIN");
      });
    } catch (err) {
      runInAction(() => {
        this.user = null;
        this.studentId = null;
        this.authStudent = null;
        this.isAdmin = false;
        this.error = extractErrorMessage(err) || "Ошибка авторизации";
      });
    }
  }

  logout() {
    this.user = null;
    this.isAdmin = false;
    this.studentId = null;
    this.authStudent = null;
    this.error = null;

    commonStore.setToken?.(null);
    try { localStorage.removeItem("token"); } catch {}
    window.location.href = "/login";
  }
}

const authStore = new AuthStore();
export default authStore;