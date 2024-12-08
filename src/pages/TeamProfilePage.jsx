import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import Card from "../components/card/Card";
import MainContent from "../components/main-section/MainSection";
import EditableDescription from "../components/editable-text-field/EditableTextField";
import { useParams } from "react-router-dom";
import useCurrentUser from "../hooks/useCurrentUser";
import useTeamData from "../hooks/useTeamData";
const sidebarItems = [
  { name: "Текущие участники" },
  { name: "Заявки в команду" },
];
const TeamProfilePage = () => {
  const { teamId } = useParams();
  const [currentContent, setCurrentContent] = useState("Текущие участники");
  const currentUser = useCurrentUser();
  const { name, description, technologies, students, requests, captainName, isCaptain, loading, error } =
    useTeamData(teamId, currentUser, currentContent);

  

  const handleSave = ({ description, technologies }) => {
    setTeamDescription(description);
    setTeamTechnologies(technologies);
  };

  const renderMainContent = () => {
    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    const data = currentContent === "Текущие участники" ? students : requests;

    return (
      <div className="cards">
        {data.length > 0 ? (
          data.map((item) => (
            <Card
              key={item.id}
              name={item.user.fio}
              resume={item.about_self}
              tags={item.technologies}
            />
          ))
        ) : (
          <p>{currentContent === "Заявки в команду" ? "Нет доступных запросов." : "Нет участников."}</p>
        )}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <h1>Профиль команды {name}</h1>
      <div className="container">
        {!isCaptain && <Sidebar onItemClick={setCurrentContent}  items={sidebarItems} />}
        <MainContent>
          <h2>Описание команды</h2>
          <EditableDescription
            initialDescription={description}
            initialTechnologies={technologies}
            canEdit={!isCaptain}
            onSave={handleSave}
          />
          <p>
            <strong>Капитан команды:</strong> {captainName || "Неизвестно"}
          </p>
          <h2>{currentContent}</h2>
          {renderMainContent()}
        </MainContent>
      </div>
    </>
  );
};

export default TeamProfilePage;
