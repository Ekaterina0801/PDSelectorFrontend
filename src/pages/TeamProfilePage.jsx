import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import Card from "../components/card/Card";
import MainContent from "../components/main-section/MainSection";
import EditableDescription from "../components/editable-text-field/EditableTextField";
import {
  fetchStudentById,
  fetchStudents,
} from "../controllers/apiStudentsController";
import { fetchTeamById } from "../controllers/apiTeamsController";
import TeamDto from "../dto/TeamDTO";
import { useParams } from "react-router-dom";
import StudentDto from "../dto/StudentDTO";
import { fetchCurrentUser } from "../controllers/apiStudentsController";
import MobileNavigation from "../components/mobile-navigation/MobileNavigation";

const sidebarItems = [
  { name: "Текущие участники" },
  { name: "Заявки в команду" },
];
import Header from "../components/header/Header";
const TeamProfilePage = () => {
  const { teamId } = useParams();
  const [currentContent, setCurrentContent] = useState("Текущие участники");
  const [studentsData, setStudentsData] = useState([]);
  const [teamRequests, setTeamRequests] = useState([]);
  const [teamDescription, setTeamDescription] = useState("");
  const [teamTechnologies, setTeamTechnologies] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCaptain, setIsCaptain] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [teamCaptain, setTeamCaptain] = useState(null);
  const [captainId, setCaptainId] = useState(null);
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchCurrentUser();
        setCurrentUser(userData);
      } catch (error) {
        console.error("Ошибка при загрузке профиля пользователя:", error);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const loadTeamAndCaptain = async () => {
      setLoading(true);
      try {
        const fetchedTeam = await fetchTeamById(teamId);
        const teamDto = new TeamDto(fetchedTeam);
        setTeamDescription(teamDto.project_description);
        setTeamName(teamDto.name);
        setCaptainId(teamDto.captain_id);

        if (currentUser && teamDto.captain_id === currentUser.id) {
          if (!isCaptain) setIsCaptain(true);
        }

        if (teamDto.captain_id) {
          const captainData = await fetchStudentById(teamDto.captain_id);
          const captain = new StudentDto(captainData);
          setTeamCaptain(captain.user.fio);
        }

        if (currentContent === "Текущие участники") {
          setStudentsData(teamDto.students);
        } else if (currentContent === "Заявки в команду") {
          setTeamRequests(teamDto.applications);
        }
      } catch (error) {
        setError("Ошибка при загрузке данных команды или капитана.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      loadTeamAndCaptain();
    }
  }, [currentContent, teamId, currentUser]);

  const handleSave = ({ description, technologies }) => {
    setTeamDescription(description);
    setTeamTechnologies(technologies);
  };

  const renderMainContent = () => {
    if (loading) {
      return <p>Загрузка...</p>;
    }

    if (error) {
      return <p>{error}</p>;
    }

    switch (currentContent) {
      case "Текущие участники":
        return (
          <div className="cards">
            {studentsData.map((student) => (
              <Card
                key={student.id}
                name={student.user.fio}
                resume={student.about_self}
                tags={student.technologies}
              />
            ))}
          </div>
        );
      case "Заявки в команду":
        return (
          <div className="cards">
            {teamRequests.length > 0 ? (
              teamRequests.map((request) => (
                <Card
                  key={request.id}
                  name={request.user.fio}
                  resume={request.about_self}
                  tags={request.technologies}
                />
              ))
            ) : (
              <p>Нет доступных запросов.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <MobileNavigation />
      <h1>Профиль команды {teamName}</h1>
      <div className="container">
        {!isCaptain && (
          <Sidebar onItemClick={setCurrentContent} items={sidebarItems} />
        )}{" "}
        <MainContent>
          <h2>Описание команды</h2>
          <EditableDescription
            initialDescription={teamDescription}
            initialTechnologies={teamTechnologies}
            canEdit={!isCaptain}
            onSave={handleSave}
          />

          <p>
            <strong>Капитан команды:</strong> {teamCaptain}
          </p>
          <h2>{currentContent}</h2>
          {renderMainContent()}
        </MainContent>
      </div>
    </>
  );
};

export default TeamProfilePage;
