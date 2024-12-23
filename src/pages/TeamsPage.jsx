import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar/Navbar";
import SearchBar from "../components/search-bar/SearchBar";
import Filter from "../components/forms/Filter";
import MainContent from "../components/main-section/MainSection";
import Card from "../components/card/Card";
import { getSavedTrackId } from "../hooks/cookieUtils";
import useCurrentUser from "../hooks/useCurrentUser";
import useTeamFilters from "../hooks/useTeamFilters";
import useTeams from "../hooks/useTeams";
import { getCurrentStudentId } from "../api/apiStudentsController";
import { createApplication } from "../api/apiApplication";
import useSuccessMessage from "../hooks/useSuccessMessage";
;


const TeamsPage = () => {
  const [filters, setFilters] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const { successMessage, showSuccessMessage } = useSuccessMessage();
  const [applicationsStatus, setApplicationsStatus] = useState({}); 

  const trackId = getSavedTrackId();
  const { teams, loading } = useTeams(filters, searchInput, trackId);

  const handleApplyFilters = (newFilters) => setFilters(newFilters);
  const handleSearch = (input) => setSearchInput(input);

  const handleApplicationSubmit = async (teamId) => {
    try {
      const studentId = await getCurrentStudentId();
      const applicationDto = { student_id: studentId, team_id: teamId, status: "Sent" };
      await createApplication(applicationDto);
      showSuccessMessage("Заявка в команду подана");


      setApplicationsStatus((prev) => ({ ...prev, [teamId]: true }));
    } catch (err) {
      console.error("Ошибка отправки заявки:", err);
    }
  };


  useEffect(() => {
    const fetchApplicationStatuses = async () => {
      try {
        const studentId = await getCurrentStudentId();
        const statuses = {};

  
        teams.forEach((team) => {
          const hasApplied = team.applications?.some(
            (application) => application.student_id === studentId
          );
          statuses[team.id] = hasApplied || false;
        });

        setApplicationsStatus(statuses);
      } catch (err) {
        console.error("Ошибка загрузки статусов заявок:", err);
      }
    };

    if (!loading && teams.length > 0) {
      fetchApplicationStatuses();
    }
  }, [teams, loading]);

  return (
    <>
      <Navbar />
      <SearchBar onSearch={handleSearch} />
      <div className="container">
        <Filter filterParams={useTeamFilters(trackId)} onApplyFilters={handleApplyFilters} />
        <MainContent>
          <h1>Команды</h1>
          <div className="cards">
            {loading ? (
              <p>Загрузка...</p>
            ) : (
              teams.map((team) => (
                <Card
                  key={team.id}
                  name={team.name}
                  type={team.project_type.name}
                  resume={team.project_description}
                  isCaptain={false}
                  onApply={() => handleApplicationSubmit(team.id)}
                  onCancel={() => console.log("Заявка отменена")}
                  tags={team.technologies}
                  profileLink={`/teams/${team.id}`}
                  showApplyButton={!applicationsStatus[team.id]} // Используем статусы из состояния
                />
              ))
            )}
          </div>
        </MainContent>
      </div>
    </>
  );
};

export default TeamsPage;
