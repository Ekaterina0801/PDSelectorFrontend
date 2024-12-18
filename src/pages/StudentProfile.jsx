import React, { useState} from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import MainContent from "../components/main-section/MainSection";
import Card from "../components/card/Card";
import Navbar from "../components/navbar/Navbar";
import useStudentData from "../hooks/useStudentData";
import useCurrentUser from "../hooks/useCurrentUser";
import ProfileCard from "../components/profile/ProfileCard";
import ProfileEditForm from "../components/profile/ProfileEditForm";
import ApplicationCard from "../components/card/ApplicationCard";
import useSuccessMessage from "../hooks/useSuccessMessage";
import { updateApplication } from "../api/apiApplication";
import { fetchApplicationById } from "../api/apiApplication";
import TeamForm from "../components/forms/TeamForm";
import { useNewTeam } from "../hooks/useNewTeam";
import Cookies from "js-cookie";
import Modal from "../components/forms/modal/Modal";
import { useModal } from "../hooks/useModal";
import { useTechnologies } from "../hooks/useTechnologies";
const sidebarItems = [
  { name: "Мои команды", icon: "👥" },
  { name: "Мой профиль", icon: "👤" },
  { name: "Мои заявки", icon: "📄" },
  { name: "Созданные команды", icon: "⚙️" },
];



const StudentProfilePage = () => {
  const { studentId } = useParams();
  const currentUser = useCurrentUser();
  const {
    studentData,
    myTeams,
    createdTeams,
    submittedRequests,
    loading,
    error,
    isCurrentUser,
    refreshStudentData,
    technologies
  } = useStudentData(studentId, currentUser);

  const { allTechnologies, loadingTechnologies, errorTechnologies } = useTechnologies();
  const currentTrackId = Cookies.get("trackId");
  const { newTeam, handleChange, handleSubmit } = useNewTeam(currentTrackId, studentId, allTechnologies);

  const { successMessage, showSuccessMessage } = useSuccessMessage();
  const { showModal, toggleModal } = useModal();

  const [currentContent, setCurrentContent] = useState("Профиль");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);


  const handleProfileSave = (updatedData) => {
    console.log("Сохраненные данные:", updatedData);
    setIsEditingProfile(false);
  };

  const handleProfileEdit = () => setIsEditingProfile(true);
  const handleProfileCancel = () => setIsEditingProfile(false);


  const handleApplicationStatusChange = async (applicationId, status) => {
    try {
      const applicationData = await fetchApplicationById(applicationId);
      applicationData.status = status;
      await updateApplication(applicationData);
      showSuccessMessage(`Заявка успешно ${status.toLowerCase()}`);
      refreshStudentData();
    } catch (err) {
      console.error(`Ошибка изменения статуса заявки: ${status}`, err);
    }
  };


  const handleTeamCreate = async (e) => {
    e.preventDefault();
    try {
      await handleSubmit(e);
      setIsCreatingTeam(false);
      showSuccessMessage("Команда успешно создана");
      toggleModal(); 
      refreshStudentData();
    } catch (err) {
      console.error("Ошибка создания команды", err);
      alert("Не удалось создать команду");
    }
  };

  const handleCreateTeamClick = () => {
    setIsCreatingTeam(true);
    toggleModal(); 
  };

  const renderProfileContent = () => {
    if (isEditingProfile) {
      return <ProfileEditForm studentData={studentData} onSave={handleProfileSave} onCancel={handleProfileCancel} />;
    }
    return <ProfileCard studentData={studentData} onEdit={handleProfileEdit} />;
  };

  const renderMyTeams = () => (
    <div className="cards">
      {myTeams.length > 0 ? (
        myTeams.map((team) => (
          <Card key={team.id} name={team.name} type={team.project_type} resume={team.project_description} tags={team.technologies} profileLink={`/teams/${team.id}`} />
        ))
      ) : (
        <p>У вас нет команд</p>
      )}
    </div>
  );

  const renderApplications = () => (
    <div className="cards">
      {submittedRequests.length > 0 ? (
        submittedRequests.map((request) => (
          <ApplicationCard
            key={request.id}
            applicationId={request.id}
            studentName={request.student.fio}
            teamName={request.team.name}
            teamDescription={request.team.project_description}
            technologies={request.team.technologies}
            status={request.status}
            studentId={request.student.id}
            teamId={request.team.id}
            onReject={() => handleApplicationStatusChange(request.id, "Rejected")}
            onCancel={() => handleApplicationStatusChange(request.id, "Cancelled")}
            onSending={() => handleApplicationStatusChange(request.id, "Sent")}
          />
        ))
      ) : (
        <p>Нет поданных заявок</p>
      )}
    </div>
  );

  const renderCreatedTeams = () => (
    <div className="cards">
      {showModal && (
        <Modal show={showModal} onClose={toggleModal}>
          {isCreatingTeam && (
            <TeamForm
              newTeam={newTeam}
              onChange={handleChange}
              onSubmit={handleTeamCreate}
              onCancel={() => setIsCreatingTeam(false)}
              technologies={allTechnologies}
              currentTrackId={currentTrackId}
            />
          )}
        </Modal>
      )}
      <button onClick={handleCreateTeamClick}>Создать команду</button>
      {createdTeams.length > 0 ? (
        createdTeams.map((team) => (
          <Card key={team.id} name={team.name} type={team.project_type} resume={team.project_description} tags={team.technologies} profileLink={`/teams/${team.id}`} />
        ))
      ) : (
        <p>Вы не создали команд.</p>
      )}
    </div>
  );

  const renderMainContent = () => {
    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    switch (currentContent) {
      case "Профиль":
        return renderProfileContent();
      case "Мои команды":
        return renderMyTeams();
      case "Мои заявки":
        return renderApplications();
      case "Созданные команды":
        return renderCreatedTeams();
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        {!isCurrentUser && <Sidebar onItemClick={setCurrentContent} items={sidebarItems} />}
        <MainContent>
          <h2>{currentContent}</h2>
          {successMessage && <div className="success-message">{successMessage}</div>}
          {renderMainContent()}
        </MainContent>
      </div>
    </>
  );
};

export default StudentProfilePage;
