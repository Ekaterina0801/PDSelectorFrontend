import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import SearchBar from '../components/search-bar/SearchBar';
import Filter from '../components/forms/Filter';
import MainContent from '../components/main-section/MainSection';
import Card from '../components/card/Card';
const teamsData = [
    {
      id: 1,
      name: 'Название какое то ',
      resume: 'Делаем красивое веб приложение',
      type:"Веб-приложение",
      tags: ['JavaScript', 'React', 'Node.js'],
      profileLink:"/teams/1"
    },
    {
      id: 2,
      name: 'Какое то название',
      type:'Игра',
      resume: 'Делаем красивую игру в славянском сеттинге',
      tags: [ 'Unity', 'C#'],
      profileLink:"/teams/1"
    },
    {
      id: 3,
      name: 'Название то какое!',
      type:"Мобильное приложение", 
      resume: 'Делаем крутое мобильное приложение',
      tags: ['Java', 'Kotlin'],
      profileLink:"/teams/1"
    },
  ];
const TeamsPage = () => {
    return (
        <>
        <Navbar />
        <SearchBar />
        <div className="container">

        <Filter/>
          <MainContent>
          <h1>Команды</h1>
            <div className="cards">
              {teamsData.map((team) => (
                <Card
                  key={team.id}
                  name={team.name}
                  type={team.type}
                  resume={team.resume}
                  tags={team.tags}
                  profileLink={team.profileLink}
                />
              ))}
            </div>
          </MainContent>
        </div>
      </>
    );
};

export default TeamsPage;
