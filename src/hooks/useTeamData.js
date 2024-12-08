import { useState, useEffect } from "react";
import { fetchTeamById } from "../api/apiTeamsController";
import { fetchStudentById } from "../api/apiStudentsController";
import TeamDto from "../dto/TeamDTO";
import StudentDto from "../dto/StudentDTO";

const useTeamData = (teamId, currentUser, currentContent) => {
  const [teamData, setTeamData] = useState({
    name: "",
    description: "",
    technologies: [],
    students: [],
    requests: [],
    captainName: null,
    isCaptain: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const loadTeamData = async () => {
      setLoading(true);
      try {
        const fetchedTeam = await fetchTeamById(teamId);
        const teamDto = new TeamDto(fetchedTeam);

        const isCurrentUserCaptain = teamDto.captain_id === currentUser.id;
        let captainName = null;

        if (teamDto.captain_id) {
          const captainData = await fetchStudentById(teamDto.captain_id);
          const captain = new StudentDto(captainData);
          captainName = captain.user.fio;
        }

        setTeamData({
          name: teamDto.name,
          description: teamDto.project_description,
          technologies: teamDto.technologies || [],
          students: currentContent === "Текущие участники" ? teamDto.students : [],
          requests: currentContent === "Заявки в команду" ? teamDto.applications : [],
          captainName,
          isCaptain: isCurrentUserCaptain,
        });
      } catch (err) {
        setError("Ошибка при загрузке данных команды.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, [teamId, currentUser, currentContent]);

  return { ...teamData, loading, error };
};

export default useTeamData;
