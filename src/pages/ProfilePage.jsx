import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import Card from "../components/card-my-resume/CardMyResume";
import TextFieldEdit from "../components/text-field-edit/TextFieldEdit";
import CreatedCommands from "../components/created-commands/CreatedCommands";
import DataAboutStudent from "../components/data-about-student/DataAboutStudent";
import MainContent from "../components/main-section/MainSection";
import React, { useState } from "react";
/*
const ProfilePage = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <Sidebar />
        <MainContent>
          <div className="cards">
            <Card
              key={"1"}
              name={"Oleg"}
              type={"team"}
              resume={"team"}
              tags={["team"]}
            />
          </div>
        </MainContent>
      </div>
    </>
  );
};
*/

const teamsData = [
    {
      id: 1,
      name: 'Название какое то ',
      resume: 'Делаем красивое веб приложение',
      type:"Веб-приложение",
      tags: ['JavaScript', 'React', 'Node.js']
    },
    {
      id: 2,
      name: 'Какое то название',
      type:'Игра',
      resume: 'Делаем красивую игру в славянском сеттинге',
      tags: [ 'Unity', 'C#']
    },
    {
      id: 3,
      name: 'Название то какое!',
      type:"Мобильное приложение", 
      resume: 'Делаем крутое мобильное приложение',
      tags: ['Java', 'Kotlin']
    },
  ];

const ProfilePage = () => {
  // Состояние для управления текущим контентом
  const [currentContent, setCurrentContent] = useState("My applications"); // начальное значение

  const [currentTeamsData, setCurrentTeamsData] = useState(teamsData);

  function removeCard(id){
    const newTeamsData = currentTeamsData.filter((item)=> { 
        return item.id !== id})
    setCurrentTeamsData(newTeamsData)     
  }
  // Определение содержимого на основе состояния
  const renderMainContent = () => {
    switch (currentContent) {
      case "My applications":
        return (
            <div className="cards">
              {currentTeamsData.map((team) => (
                <Card
                  key={team.id}
                  name={team.name}
                  type={team.type}
                  resume={team.resume}
                  tags={team.tags}
                  onRemove={()=>{removeCard(team.id)}}
                />
              ))}
            </div>
        );
      case "My resume":
        return (
          <div>
            {<TextFieldEdit />}
          </div>
        );
      case "My commands":
        return (
          <div>
            <h2>Messages Component</h2>
            {/*TODO*/}
          </div>
        );
      case "Created commands":
        return (
          <div>
            {<CreatedCommands />}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <DataAboutStudent />
      <div className="container">
        <Sidebar onItemClick={setCurrentContent} />
        <MainContent>{renderMainContent()}</MainContent>
      </div>
    </>
  );
};

export default ProfilePage;
