import { useState, useEffect } from "react";
import { fetchTeamById } from "../api/apiTeamsController";
import { fetchStudentById } from "../api/apiStudentsController";
import TeamDto from "../dto/TeamDTO";
import StudentDto from "../dto/StudentDTO";
const useTeamData = (teamId, currentUser) => {
  const [teamData, setTeamData] = useState({
    name: "",
    description: "",
    technologies: [],
    students: [],
    requests: [],
    project_type: null,
    captainName: null,
    isCaptain: false,
  });
  const [isCaptain, setIsCaptain] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const loadTeamData = async () => {
      setLoading(true);
      try {
        const fetchedTeam = await fetchTeamById(teamId);
        const isCurrentUserCaptain = fetchedTeam.captain.id === currentUser;
        setIsCaptain(isCurrentUserCaptain);
        setTeamData(fetchedTeam);
      } catch (err) {
        setError("Ошибка при загрузке данных команды.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, [teamId, currentUser]);

  useEffect(() => {
    console.log('teamdata', teamData);
  }, [teamData]); 

  return { teamData, isCaptain, loading, error };
};

export default useTeamData;

