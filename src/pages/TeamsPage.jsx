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

const TeamsPage = () => {
  const [filters, setFilters] = useState({});
  const [searchInput, setSearchInput] = useState("");

  const trackId = getSavedTrackId();
  const currentUser = useCurrentUser();
  const filterParams = useTeamFilters(trackId);
  const { teams, loading } = useTeams(filters, searchInput, trackId);

  const handleApplyFilters = (newFilters) => setFilters(newFilters);
  const handleSearch = (input) => setSearchInput(input);

  return (
    <>
      <Navbar />
      <SearchBar onSearch={handleSearch} />
      <div className="container">
        <Filter filterParams={filterParams} onApplyFilters={handleApplyFilters} />
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
