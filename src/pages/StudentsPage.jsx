import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import SearchBar from "../components/search-bar/SearchBar";
import Card from "../components/card/Card";
import Filter from "../components/forms/Filter";
import MainContent from "../components/main-section/MainSection";
import { fetchStudents } from "../controllers/apiStudentsController";
import Header from "../components/header/Header";
import { getSavedTrackId } from "../hooks/cookieUtils";
import { fetchFilterParamsByTrackId } from "../controllers/apiTeamsController";
const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [filters, setFilters] = useState({});
  const [filterParams, setFilterParams] = useState([]); // State to hold filter parameters
  const [searchInput, setSearchInput] = useState("");

  // Handler for applying filters
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  // Handler for search input
  const handleSearch = (input) => {
    setSearchInput(input);
  };

  // Load students, user, and filter parameters
  useEffect(() => {
    const loadStudents = async () => {
      const trackId = getSavedTrackId();
      if (!trackId) {
        console.error("trackId отсутствует в куках");
        setLoading(false);
        return;
      }
      try {
        const data = await fetchStudents(trackId, { ...filters, input: searchInput }); // Pass filters and search input if needed
        setStudents(data);
        console.log("Загруженные студенты:", data);
      } catch (error) {
        console.error("Не удалось загрузить студентов:", error);
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
    Promise.all([loadStudents(), loadFilters()]).finally(() => {
      setLoading(false);
    });
  }, [filters, searchInput]); // Dependencies include filters and search input

  return (
    <>
      <Header />
      <Navbar />
      <SearchBar onSearch={handleSearch} /> {/* Pass handler for search */}
      <div className="container">
        <Filter filterParams={filterParams} onApplyFilters={handleApplyFilters} /> {/* Pass filter parameters */}
        <MainContent>
          <h1>Участники</h1>
          <div className="cards">
            {loading ? (
              <p>Загрузка...</p>
            ) : (
              students.map((student) => (
                <Card
                  key={student.id}
                  name={student.user?.fio || "Имя отсутствует"} // Safe access
                  resume={student.about_self || "Описание отсутствует"}
                  tags={student.technologies || []}
                  showActionsForCaptain={false}
                  showActionsForUser={false}
                  profileLink={`/students/${student.id}`}
                />
              ))
            )}
          </div>
        </MainContent>
      </div>
    </>
  );
};

export default StudentsPage;
