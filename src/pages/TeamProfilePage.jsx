import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import Card from "../components/card/Card";
import MainContent from "../components/main-section/MainSection";
import EditableDescription from "../components/editable-text-field/EditableTextField";
import { useParams } from "react-router-dom";
import useCurrentUser from "../hooks/useCurrentUser";
import useTeamData from "../hooks/useTeamData";
import ApplicationCard from "../components/card/ApplicationCard";
import { fetchApplicationById } from "../api/apiApplication";
import { updateApplication } from "../api/apiApplication";
import useSuccessMessage from "../hooks/useSuccessMessage";
const sidebarItems = [
  { name: "Текущие участники" },
  { name: "Заявки в команду" },
];
const TeamProfilePage = () => {
  const { teamId } = useParams();
  const [currentContent, setCurrentContent] = useState("Текущие участники");
  const currentUser = useCurrentUser();
  const { successMessage, showSuccessMessage } = useSuccessMessage();
  const { name, description, technologies, students, requests, captainId, isCaptain, loading, error } =
    useTeamData(teamId, currentUser, currentContent);
    console.log('requests', requests);
    console.log('user', currentUser);
    console.log('captain', captainId);
  

  const handleSave = ({ description, technologies }) => {
    setTeamDescription(description);
    setTeamTechnologies(technologies);
  };

  const handleApplicationStatusChange = async (applicationId, status) => {
    try {
      const applicationData = await fetchApplicationById(applicationId);
      applicationData.status = status;
      await updateApplication(applicationData);
      showSuccessMessage(`Заявка успешно ${status.toLowerCase()}`);
      //window.location.reload();
      //refreshStudentData();
    } catch (err) {
      console.error(`Ошибка изменения статуса заявки: ${status}`, err);
    }
  };

  const renderMainContent = () => {
    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;
  
    const data = currentContent === "Текущие участники" ? students : requests;
    console.log('datra', data);
  
    return (
      <div className="cards">
  {data.length > 0 ? (
    data.map((item) => (
      currentContent === "Заявки в команду" ? (
        <ApplicationCard
          key={item.id}
          applicationId={item.id}
          studentName={item.student?.fio || item.user?.fio}
          teamName={name}
          teamId={teamId}
          studentId={item.student?.id || item.user?.id}
          teamDescription={description}
          technologies={item.technologies || []}
          status={item.status || "Sent"}
          showCaptainOptions={true} 
          onApprove={() => handleApplicationStatusChange(item.id, "Accepted")}
          onReject={() => handleApplicationStatusChange(item.id, "Rejected")}
          onCancel={() => handleApplicationStatusChange(item.id, "Cancelled")}
          onSending={(id) => console.log("Re-sent:", id)}
        />
      ) : (
        <Card
          key={item.id}
          name={item.student?.fio || item.user?.fio}
          resume={item.about_self || "Нет описания"}
          tags={item.technologies || []}
        />
      )
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
        {<Sidebar onItemClick={setCurrentContent}  items={sidebarItems} />}
        <MainContent>
          <h2>Описание команды</h2>
          {successMessage && <div className="success-message">{successMessage}</div>}
          <EditableDescription
            initialDescription={description}
            initialTechnologies={technologies}
            canEdit={!isCaptain}
            onSave={handleSave}
          />
          <p>
            <strong>Капитан команды:</strong> {captainId || "Неизвестно"}
          </p>
          <h2>{currentContent}</h2>
          {renderMainContent()}
        </MainContent>
      </div>
    </>
  );
};

export default TeamProfilePage;
