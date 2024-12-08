import { useState, useEffect } from "react";
import { fetchTeams } from "../api/apiTeamsController";

const useTeams = (filters, searchInput, trackId) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        setLoading(true);
        const data = await fetchTeams({ ...filters, input: searchInput, trackId });
        setTeams(data);
        console.log("Загруженные команды:", data);
      } catch (error) {
        console.error("Не удалось загрузить команды:", error);
      } finally {
        setLoading(false);
      }
    };

    if (trackId) loadTeams();
  }, [filters, searchInput, trackId]);

  return { teams, loading };
};

export default useTeams;
