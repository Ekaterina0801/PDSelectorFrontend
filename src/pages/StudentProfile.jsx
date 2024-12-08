import React, { useState} from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import MainContent from "../components/main-section/MainSection";

import EditableProfile from "../components/editable-profile/EditableProfile"; 
import Card from "../components/card/Card";
import Navbar from "../components/navbar/Navbar";
import useStudentData from "../hooks/useStudentData";
import useCurrentUser from "../hooks/useCurrentUser";
import ProfileCard from "../components/profile/ProfileCard";
import ProfileEditForm from "../components/profile/ProfileEditForm";

const sidebarItems = [
  { name: "Мои команды", icon: "👥" },
  { name: "Мой профиль", icon: "👤" },
  { name: "Поданные заявки", icon: "📄" },
  { name: "Созданные команды", icon: "⚙️" },
];

const StudentProfilePage = () => {
  const { studentId } = useParams();
  const [currentContent, setCurrentContent] = useState("Профиль");
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const currentUser = useCurrentUser();
  const {
    studentData,
    myTeams,
    createdTeams,
    submittedRequests,
    loading,
    error,
    isCurrentUser,
  } = useStudentData(studentId, currentUser);

  const handleProfileSave = (updatedData) => {
    console.log("Сохраненные данные:", updatedData);
    // Update the profile data in the state or backend
    setIsEditingProfile(false);
  };

  const handleProfileEdit = () => {
    setIsEditingProfile(true);
  };

  const handleProfileCancel = () => {
    setIsEditingProfile(false);
  };

  const renderMainContent = () => {
    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    switch (currentContent) {
      case "Профиль":
        return isEditingProfile ? (
          <ProfileEditForm
            studentData={studentData}
            onSave={handleProfileSave}
            onCancel={handleProfileCancel}
          />
        ) : (
          <ProfileCard studentData={studentData} onEdit={handleProfileEdit} />
        );
      case "Мои команды":
        return (
          <div className="cards">
            {myTeams.length > 0 ? (
              myTeams.map((team) => (
                <Card
                  key={team.id}
                  name={team.name}
                  type={team.project_type}
                  resume={team.project_description}
                  tags={team.technologies}
                  profileLink={`/teams/${team.id}`}
                />
              ))
            ) : (
              <p>У вас нет команд.</p>
            )}
          </div>
        );
      case "Поданные заявки":
        return (
          <div className="cards">
            {submittedRequests.length > 0 ? (
              submittedRequests.map((request) => (
                <Card
                  key={request.id}
                  name={request.team.name}
                  resume={request.team.project_description}
                  tags={request.team.technologies}
                />
              ))
            ) : (
              <p>Нет поданных заявок.</p>
            )}
          </div>
        );
      case "Созданные команды":
        return (
          <div className="cards">
            {createdTeams.length > 0 ? (
              createdTeams.map((team) => (
                <Card
                  key={team.id}
                  name={team.name}
                  type={team.project_type}
                  resume={team.project_description}
                  tags={team.technologies}
                  profileLink={`/teams/${team.id}`}
                />
              ))
            ) : (
              <p>Вы не создали команд.</p>
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
      <div className="container">
        {!isCurrentUser && (
          <Sidebar onItemClick={setCurrentContent} items={sidebarItems} />
        )}
        <MainContent>
          <h2>{currentContent}</h2>
          {renderMainContent()}
        </MainContent>
      </div>
    </>
  );
};

export default StudentProfilePage;