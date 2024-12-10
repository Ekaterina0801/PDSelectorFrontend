import React, { useState, useEffect } from "react";
import Header from "../components/header/Header";
import Navbar from "../components/navbar/Navbar";
import SearchBar from "../components/search-bar/SearchBar";
import Filter from "../components/forms/Filter";
import MainContent from "../components/main-section/MainSection";
import Card from "../components/card/Card";
import { fetchTeams } from "../controllers/apiTeamsController";
import { fetchCurrentUser } from "../controllers/apiStudentsController";
import TeamDto from "../dto/TeamDTO";
import { getSavedTrackId } from "../hooks/cookieUtils";
import { fetchFilterParamsByTrackId } from "../controllers/apiTeamsController";
import MobileNavigation from "../components/mobile-navigation/MobileNavigation";

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [filters, setFilters] = useState({});
  const [filterParams, setFilterParams] = useState([]); // State to hold filter parameters
  const [searchInput, setSearchInput] = useState("");

  // Обработчик применения фильтров
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  // Обработчик для строки поиска
  const handleSearch = (input) => {
    setSearchInput(input);
  };

  // Загрузка команд, пользователя и параметров фильтра
  useEffect(() => {
    const loadTeams = async () => {
      const trackId = getSavedTrackId();
      if (!trackId) {
        console.error("trackId отсутствует в куках");
        setLoading(false);
        return;
      }
      try {
        const data = await fetchTeams({ ...filters, input: searchInput, trackId: trackId });
        setTeams(data);
        console.log("Загруженные команды:", data);
      } catch (error) {
        console.error("Не удалось загрузить команды:", error);
      }
    };

    const loadUser = async () => {
      try {
        const userData = await fetchCurrentUser();
        setCurrentUser(userData);
        console.log(userData);
      } catch (error) {
        console.error("Ошибка при загрузке профиля пользователя:", error);
      }
    };

    const loadFilters = async () => {
      const trackId = getSavedTrackId();
      console.log('trackId', trackId);
      if (!trackId) return;
      try {
        const params = await fetchFilterParamsByTrackId(trackId);
        setFilterParams(params);
        console.log("Полученные параметры фильтра:", params);
      } catch (error) {
        console.error("Ошибка при получении параметров фильтра:", error);
      }
    };

    setLoading(true); // Set loading state before loading data
    Promise.all([loadTeams(), loadUser(), loadFilters()]).finally(() => {
      setLoading(false);
    });
  }, [filters, searchInput]);

  return (
    <>
      <Navbar />
      <MobileNavigation />
      <SearchBar onSearch={handleSearch} />
      <div className="container">
        <Filter filterParams={filterParams} onApplyFilters={handleApplyFilters} /> {/* Pass filter parameters */}
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
                  isCaptain={false}
                  onApply={() => console.log("Заявка подана")}
                  onCancel={() => console.log("Заявка отменена")}
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
