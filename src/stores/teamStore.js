import { makeAutoObservable, runInAction,action } from "mobx";
import { TeamService } from "../service/teamService";
import trackStore from "./trackStore";


class TeamStore {
  teams = [];
  filters = {
    isFull: null,
    projectType: null,
    technologies: [],
    searchTerm: '',
    trackId: null
  };
  allFilters = {};
  loading = false;
  error = null;
  team = null;

  constructor() {
    makeAutoObservable(
      this,
      {
        fetchTeams:        true,
        fetchFilters:      true,
        updateTeam:        true,
        deleteTeam:        true,
        setFilters:        true,
        setCurrentTeam:    true,
        clearCurrentTeam:  true,
      },
      {
        autoBind: true
      }
    )
  }

  async fetchTeams(params = {}) {
    this.loading = true;
    this.error = null;

    try {
      const apiParams = {
        input: params.searchTerm || undefined,
        trackId: params.trackId || undefined,
        isFull: params.isFull ?? undefined,
        projectType: params.projectType || undefined,
        technologies: params.technologies?.length ? params.technologies : undefined,
        page: params.page,
        size: params.size,
        sort: params.sort
      };

      const cleanedParams = Object.fromEntries(
        Object.entries(apiParams).filter(([_, v]) => v !== undefined)
      );

      const data = await TeamService.fetchTeams(cleanedParams);

      runInAction(() => {
        this.teams = data.content;
        this.allFilters = data.availableFilters || {};
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
  async fetchFilters(trackId) {
    this.loading = true;
    this.error = null;
    console.log("TRACKID", trackId);
    try {
      if (trackId == null) {

        runInAction(() => {
          this.allFilters = {
            projectTypes: [],
            technologies: [],
            tracks: trackStore.tracks
          };
        });
        return;
      }
      const filters = await TeamService.fetchFilterParamsByTrackId(trackId);
      console.log('filtersSSSSS', filters);
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

  
  

  setFilters(newFilters) {
    runInAction(() => {
      this.filters = {
        ...this.filters,
        ...newFilters
      };
    });
    this.fetchTeams(this.filters);
  }
  resetFilters() {
    this.filters = {};
    this.fetchTeams({});
  }

  clearTeam() {
    this.team = null;
  }
  
  setError(error) {
    this.error = error;
  }
  setCurrentTeam(team) {
    this.team = team
    console.log('team', this.team);
  }

  clearCurrentTeam() {
    this.team = null
  }
}

export const teamStore = new TeamStore();
export default teamStore;
