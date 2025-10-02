import requests from "../agent";

export const TrackService = {
    fetchTracks: () => {
      return requests.get(`/tracks`)
        .then(data => {
          return data;
        })
        .catch(error => {
          console.error("API Error:", error);
          throw error;
        });
    },
  
    fetchTrackById: (trackId) => {
      return requests.get(`/tracks/${trackId}`)
        .then(data => {
          return data;
        })
        .catch(error => {
          console.error("API Error:", error);
          throw error;
        });
    },
  
    createTrack: (trackData) => {
      return requests.post(`/tracks`, trackData)
        .then(data => {
          return data;
        })
        .catch(error => {
          console.error("API Error:", error);
          throw error;
        });
    },
  
    updateTrack: (trackData, trackId) => {
      return requests.put(`/tracks/${trackId}`, trackData)
        .then(data => {
          return data;
        })
        .catch(error => {
          console.error("API Error:", error);
          throw error;
        });
    },
  
    deleteTrack: (trackId) => {
      return requests.delete(`/tracks/${trackId}`)
        .then(data => {
          return data;
        })
        .catch(error => {
          console.error("API Error:", error);
          throw error;
        });
    }
  };
  