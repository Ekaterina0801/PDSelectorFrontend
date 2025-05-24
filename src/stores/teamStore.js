import { makeAutoObservable, runInAction,action } from "mobx";
import { TeamService } from "../service/teamService";
import trackStore from "./trackStore";

function extractErrorMessage(err) {
  if (err.response?.data?.message) {
    return err.response.data.message;
  }

  if (err instanceof Error && typeof err.message === 'string') {
    err = err.message;
  }

  if (typeof err === 'string') {
    let str = err.trim();

    if (str.startsWith('"') && str.endsWith('"')) {
      try {
        str = JSON.parse(str);      
      } catch {

      }
    }

    try {
      const obj = JSON.parse(str);
      return obj.message || str;
    } catch {
      return str;
    }
  }

  return String(err);
}


class TeamStore {
  teams = [];
  filters = {
    isFull: null,
    projectType: null,
    technologies: [],
    searchTerm: '',
    trackId: null,
    page: 0,
    size: 10,
    sort: "name,asc",
    total: 0,           
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
        this.filters.total = data.totalElements;
        //this.allFilters = data.availableFilters || {};
        //console.log('DATATATATATA', data);
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
         this.error = err.response?.data?.message || err.message || "Ошибка при загрузке фильтров";
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
         this.error = err.response?.data?.message || err.message || "Ошибка при загрузке команды";
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
         this.error = err.response?.data?.message || err.message || "Ошибка при создании команды";
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
    console.log('teamDataAAAAAA', teamData);
    console.log('teamIdAAAAAA', teamId);
    if (!teamId) {
      teamId = teamData.id;
    }
    try {
      const updated = await TeamService.updateTeam(teamData, teamId);
      runInAction(() => {
        this.team = updated;
        this.teams = this.teams.map(t => (t.id === updated.id ? updated : t));
      });
    } catch (err) {
      runInAction(() => {
        console.log('err',extractErrorMessage(err));
         this.error = extractErrorMessage(err) || "Ошибка при обновлении команды";
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
         this.error = err.response?.data?.message || err.message || "Ошибка при удалении команды";
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
         this.error = err.response?.data?.message || err.message || "Ошибка при добавлении студента";
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
