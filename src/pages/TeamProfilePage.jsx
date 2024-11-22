import React, { useState, useEffect } from 'react';
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import Card from "../components/card/Card";
import MainContent from "../components/main-section/MainSection";
import EditableDescription from "../components/editable-text-field/EditableTextField";
import { fetchStudents } from '../controllers/apiStudentsController';
import { fetchTeamById } from '../controllers/apiTeamsController';
import TeamDto from '../dto/TeamDTO';

const TeamProfilePage = ({ teamId }) => {
    const [currentContent, setCurrentContent] = useState("Team Members");
    const [studentsData, setStudentsData] = useState([]);
    const [teamRequests, setTeamRequests] = useState([]);
    const [teamDescription, setTeamDescription] = useState(""); // State for team description
    const [teamCaptain, setTeamCaptain] = useState(""); // State for team captain
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
        const loadContent = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedTeam = await fetchTeamById(1);
                const teamDto = new TeamDto(fetchedTeam);
                setTeamDescription(teamDto.project_description); // Set team description
                setTeamCaptain(teamDto.captain); // Set team captain

                if (currentContent === "Team Members") {
                    const fetchedStudents = await fetchStudents(); 
                    setStudentsData(fetchedStudents);
                } else if (currentContent === "Team Requests") {
                    const fetchedRequests = await fetchTeamRequests();
                    setTeamRequests(fetchedRequests);
                }
            } catch (error) {
                setError("Failed to load data.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, [currentContent, teamId]); // Added teamId as a dependency

    // Render the main content
    const renderMainContent = () => {
        if (loading) {
            return <p>Загрузка...</p>;
        }

        if (error) {
            return <p>{error}</p>;
        }

        switch (currentContent) {
            case "Team Members":
                return (
                    <div className="cards">
                        {studentsData.map((student) => (
                            <Card
                                key={student.id}
                                name={student.name}
                                resume={student.resume}
                                /*tags={student.technologiess}*/
                            />
                        ))}
                    </div>
                );
            case "Team Requests":
                return (
                    <div className="cards">
                        {teamRequests.length > 0 ? (
                            teamRequests.map((request) => (
                                <Card
                                    key={request.id}
                                    name={request.name}
                                    resume={request.description}
                                    /*tags={request.technologies}*/
                                />
                            ))
                        ) : (
                            <p>Нет доступных запросов.</p>
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
            <h1>Профиль команды</h1>
            <div className="container">
                <MainContent>
                    <Sidebar onItemClick={setCurrentContent} />
                    <h2>{currentContent}</h2>
                    <EditableDescription
                        initialDescription={teamDescription}
                    />
                    <p><strong>Капитан команды:</strong> {teamCaptain}</p> {/* Display team captain */}
                    {renderMainContent()}
                </MainContent>
            </div>
        </>
    );
};

export default TeamProfilePage;
