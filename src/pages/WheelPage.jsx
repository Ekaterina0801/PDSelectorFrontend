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
import WheelRandom from "../components/wheel/WheelRandom";
import * as d3 from "d3";
import Triangle from "../components/triangle/Triangle";

const WheelPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [searchInput, setSearchInput] = useState("");
  /*const data =[
      {name: "Comand 1", value: 1},
      {name: "Comand 2", value: 1},
      {name: "Comand 3", value: 1},
      {name: "Comand 4", value: 1},
      {name: "Comand 5", value: 1},
      {name: "Comand 6", value: 1}
    ]*/
  useEffect(() => {
    const loadTeams = async () => {
      const trackId = getSavedTrackId();
      if (!trackId) {
        console.error("trackId отсутствует в куках");
        setLoading(false);
        return;
      }
      try {
        const data = await fetchTeams({...filters, input: searchInput, trackId: trackId} );
        setTeams(data);
      } catch (error) {
        console.error("Не удалось загрузить команды", error);
      }
    };

    setLoading(true); // Set loading state before loading data
    loadTeams().finally(() => {
      setLoading(false);
    });

  }, []);
  return (
    <>
      <Navbar />
      <MobileNavigation />
      <div className="container">
      {loading ? (
              <p>Загрузка...</p>
            ) : (
        <WheelRandom teamsData={teams}/>
      )}    
      </div>
    </>
  );
};

export default WheelPage;
