import { useState, useEffect } from "react";
import { fetchFilterParamsByTrackId } from "../api/apiTeamsController";
import { getSavedTrackId } from "./cookieUtils";

const useStudentFilters = () => {
  const [filterParams, setFilterParams] = useState([]);

  useEffect(() => {
    const loadFilters = async () => {
      const trackId = getSavedTrackId();
      if (!trackId) {
        console.error("trackId отсутствует в куках");
        return;
      }
      try {
        const params = await fetchFilterParamsByTrackId(trackId);
        setFilterParams(params);
        console.log("Полученные параметры фильтра:", params);
      } catch (error) {
        console.error("Ошибка при получении параметров фильтра:", error);
      }
    };

    loadFilters();
  }, []);

  return filterParams;
};

export default useStudentFilters;
