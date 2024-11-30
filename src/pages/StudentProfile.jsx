import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fetchCurrentUser,
  fetchStudentById
} from "../controllers/apiStudentsController";
import Sidebar from "../components/sidebar/Sidebar";
import MainContent from "../components/main-section/MainSection";

import EditableProfile from "../components/editable-profile/EditableProfile"; // Компонент для редактирования профиля студента
import Card from "../components/card/Card";
import Navbar from "../components/navbar/Navbar";
const sidebarItems = [
  { name: "Мои команды" },
  { name: "Мой профиль" },
  { name: "Поданные заявки" },
  { name: "Созданные команды" },
];

const StudentProfilePage = () => {
  const { studentId } = useParams();
  const [currentContent, setCurrentContent] = useState("Профиль");
  const [studentData, setStudentData] = useState(null);
  const [myTeams, setMyTeams] = useState([]);
  const [createdTeams, setCreatedTeams] = useState([]);
  const [submittedRequests, setSubmittedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false); // Проверка, совпадает ли текущий пользователь с этим студентом
  const [currentUser, setCurrentUser] = useState(null);

  // Загрузка данных о текущем пользователе
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

  // Загрузка данных студента и его команд
  useEffect(() => {
    const loadStudentData = async () => {
      setLoading(true);
      try {
        const fetchedStudent = await fetchStudentById(studentId);
        setStudentData(fetchedStudent);

        // Проверяем, является ли текущий пользователь этим студентом
        if (currentUser && currentUser.id === fetchedStudent.id) {
          setIsCurrentUser(true);
        }

        // Загружаем команды студента
        const teams = [fetchedStudent.team];
        //await fetchTeamsByStudentId(fetchedStudent.id);
        setMyTeams(teams);

        // Загружаем заявки студента
        // Моковые данные для заявок, если они есть
        const requests = fetchedStudent.applications || [];
        setSubmittedRequests(requests);

        // Загружаем команды, которые студент создал
        const createdTeamsData = fetchedStudent.created_teams || [];
        setCreatedTeams(createdTeamsData);
      } catch (error) {
        setError("Ошибка при загрузке данных студента.");
        console.error("Error loading student data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      loadStudentData();
    }
  }, [studentId, currentUser]);

  // В родительском компоненте
  const handleProfileSave = (updatedData) => {
    console.log("Сохраненные данные:", updatedData);
    // Отправка обновленных данных на сервер или в родительский компонент
  };

  // Функция для рендеринга контента в зависимости от выбранной вкладки
  const renderMainContent = () => {
    if (loading) {
      return <p>Загрузка...</p>;
    }

    if (error) {
      return <p>{error}</p>;
    }

    switch (currentContent) {
      case "Профиль":
        console.log('user', currentUser);
        return (

          <div>
            
            {/*<h3>ФИО текущего пользователя: {currentUser.fio}</h3>*/}
            <EditableProfile
              studentData={studentData} // Данные студента, полученные из API
              canEdit={!isCurrentUser} // Разрешение на редактирование только для текущего пользователя
              onSave={handleProfileSave}
            />
          </div>

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
      <h1>Профиль студента</h1>
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
