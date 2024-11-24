import Cookies from 'js-cookie';

export const getSavedTrackId = () => {
  return Cookies.get("trackId");
};

export const saveTrackId = (trackId) => {
  Cookies.set("trackId", trackId);
};
