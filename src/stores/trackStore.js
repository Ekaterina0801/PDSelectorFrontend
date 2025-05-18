
import { TrackService } from "../service/trackService";
import { makeAutoObservable, runInAction } from "mobx"; 

class TrackStore {
  tracks = [];
  track = null;
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  
  fetchTracks = async () => {
    this.loading = true;
    this.error = null;

    try {
      const data = await TrackService.fetchTracks();
      runInAction(() => {
        this.tracks = data;
        console.log("Tracks:", data);
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message || "Ошибка при загрузке треков";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };


  fetchTrackById = async (trackId) => {
    this.loading = true;
    this.error = null;

    try {
      const track = await TrackService.fetchTrackById(trackId);
      runInAction(() => {
        this.track = track;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message || "Ошибка при загрузке трека";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  createTrack = async (trackData) => {
    this.loading = true;
    this.error = null;

    try {
      const newTrack = await TrackService.createTrack(trackData);
      runInAction(() => {
        this.tracks.push(newTrack);
        this.track = newTrack;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message || "Ошибка при создании трека";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateTrack = async (trackData, trackId) => {
    this.loading = true;
    this.error = null;

    try {
      const updated = await TrackService.updateTrack(trackData, trackId);
      runInAction(() => {
        this.track = updated;
        this.tracks = this.tracks.map(t => (t.id === updated.id ? updated : t));
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message || "Ошибка при обновлении трека";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  deleteTrack = async (trackId) => {
    this.loading = true;
    this.error = null;

    try {
      await TrackService.deleteTrack(trackId);
      runInAction(() => {
        this.tracks = this.tracks.filter(t => t.id !== trackId);
        if (this.track?.id === trackId) this.track = null;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message || "Ошибка при удалении трека";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  clearTrack = () => {
    this.track = null;
  }
}

export const trackStore = new TrackStore();
export default trackStore;
