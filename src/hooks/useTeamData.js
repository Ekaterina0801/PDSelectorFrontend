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
        console.log('teamdto', teamDto);

        const isCurrentUserCaptain = teamDto.captain.id === currentUser.id;
        let captainId = null;

        if (teamDto.captain) {
          console.log('ddd',teamDto);
          captainId = teamDto.captain.id;
        }

        setTeamData({
          name: teamDto.name,
          description: teamDto.project_description,
          technologies: teamDto.technologies || [],
          students: teamDto.students || [],
          requests: teamDto.applications || [],
          captainId,
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
  }, [teamId, currentUser]);

  return { ...teamData, loading, error };
};

export default useTeamData;
