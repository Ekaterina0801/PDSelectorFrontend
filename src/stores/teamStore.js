import { makeAutoObservable, runInAction,action } from "mobx";
import { TeamService } from "../service/teamService";


class TeamStore {
  teams = [];
  team = null;
  filters = {};
  allFilters = {};
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchTeams(params) {
    this.loading = true;
    this.error = null;

    try {
      const apiParams = {
        input: params.searchTerm,
        trackId: params.trackId,
        isFull: params.isFull ?? undefined,
        ...(params.projectType != null && { projectType: params.projectType }),
        technologies: params.technologies,
      };

      const cleanedParams = Object.fromEntries(
        Object.entries(apiParams).filter(([_, v]) => v !== undefined)
      );

      const data = await TeamService.fetchTeams(cleanedParams);
      const allFilters = await TeamService.fetchFilterParamsByTrackId(params.trackId);

      runInAction(() => {
        this.teams = data.content;
        this.allFilters = allFilters;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message || "Ошибка при загрузке команд";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchTeamById(teamId) {
    this.loading = true;
    this.error = null;

    try {
      const team = await TeamService.fetchTeamById(teamId);
      runInAction(() => {
        this.team = team;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message || "Ошибка при загрузке команды";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async createTeam(teamData) {
    this.loading = true;
    this.error = null;

    try {
      const newTeam = await TeamService.createTeam(teamData);
      runInAction(() => {
        this.teams.push(newTeam);
        this.team = newTeam;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message || "Ошибка при создании команды";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async updateTeam(teamData, teamId) {
    this.loading = true;
    this.error = null;

    try {
      const updated = await TeamService.updateTeam(teamData, teamId);
      runInAction(() => {
        this.team = updated;
        this.teams = this.teams.map(t => (t.id === updated.id ? updated : t));
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message || "Ошибка при обновлении команды";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async deleteTeam(teamId) {
    this.loading = true;
    this.error = null;

    try {
      await TeamService.deleteTeam(teamId);
      runInAction(() => {
        this.teams = this.teams.filter(t => t.id !== teamId);
        if (this.team?.id === teamId) this.team = null;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message || "Ошибка при удалении команды";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async addStudentToTeam(teamId, studentId) {
    this.loading = true;
    this.error = null;

    try {
      const updated = await TeamService.addStudentToTeam(teamId, studentId);
      runInAction(() => {
        this.team = updated;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message || "Ошибка при добавлении студента";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchFilters(trackId) {
    this.loading = true;
    this.error = null;

    try {
      const filters = await TeamService.fetchFilterParamsByTrackId(trackId);
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
      isFull: newFilters.isFull ?? null,
      ...(newFilters.projectType && { projectType: newFilters.projectType }),
      technologies: (newFilters.technologies || []).map(tech => tech.id || tech),
      trackId: newFilters.trackId,
    };

    this.filters = parsedFilters;
    this.fetchTeams(this.filters);
  }

  resetFilters() {
    this.filters = {};
    this.fetchTeams({});
  }

  clearTeam() {
    this.team = null;
  }
}

export const teamStore = new TeamStore();
export default teamStore;
