import React, { useState, useEffect } from 'react';
import Header from '../components/header/Header'; 
import Navbar from '../components/navbar/Navbar';
import SearchBar from '../components/search-bar/SearchBar';
import Filter from '../components/forms/Filter';
import MainContent from '../components/main-section/MainSection';
import Card from '../components/card/Card';
import { fetchTeams } from '../controllers/apiTeamsController';
import { fetchCurrentUser } from '../controllers/apiStudentsController';
import TeamDto from '../dto/TeamDTO';


const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    const loadTeams = async () => {
      try {
        const fetchedTeams = await fetchTeams(1); // Получаем уже разобранные данные
        console.log(fetchedTeams);
        console.log("Загруженные команды:", fetchedTeams);
        setTeams(fetchedTeams);
      } catch (error) {
        console.error("Не удалось загрузить команды:", error);
      } finally {
        setLoading(false); 
      }
    };
  
    loadTeams();
    const loadUser = async () => {
      try {
        const userData = await fetchCurrentUser();
        setCurrentUser(userData); 
        console.log(userData);
      } catch (error) {
        console.error("Ошибка при загрузке профиля пользователя:", error);
      } finally {
        setLoading(false); 
      }
    };

    loadUser();
  }, []);
  


  return (
    <>
      <Header />
      <Navbar />
      <SearchBar />
      <div className="container">
        <Filter />
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
                  type={team.project_type} 
                  resume={team.project_description}
                  tags={team.technologies} 
                  profileLink={`/teams/${team.id}`}
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
