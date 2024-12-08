import { useState, useEffect } from "react";
import { fetchFilterParamsByTrackId } from "../api/apiTeamsController";

const useTeamFilters = (trackId) => {
  const [filterParams, setFilterParams] = useState([]);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const params = await fetchFilterParamsByTrackId(trackId);
        setFilterParams(params);
        console.log("Полученные параметры фильтра:", params);
      } catch (error) {
        console.error("Ошибка при получении параметров фильтра:", error);
      }
    };

    if (trackId) loadFilters();
  }, [trackId]);

  return filterParams;
};

export default useTeamFilters;
