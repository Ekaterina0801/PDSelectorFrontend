import { useState } from 'react';
import { createTeam } from '../api/apiTeamsController';


export const useNewTeam = (currentTrackId, studentId, technologies, projectTypes) => {
  const [newTeam, setNewTeam] = useState({
    name: "",
    projectDescription: "", 
    projectType: null, 
    technologies: [], 
    currentTrackId: currentTrackId || null,
    captainId: studentId || null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox' && name === 'technologies') {
      const selectedTech = technologies.find((tech) => tech.id.toString() === value);
      setNewTeam((prev) => ({
        ...prev,
        technologies: checked
          ? [...prev.technologies, selectedTech]  
          : prev.technologies.filter((tech) => tech.id !== selectedTech.id),  
      }));
    } else if (name === 'projectType') {      
      const selectedProjectType = projectTypes.find(type => type.id.toString() === value);
      setNewTeam((prev) => ({
        ...prev,
        projectType: selectedProjectType || null 
      }));
    } else {
      setNewTeam((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('nt', newTeam);

    if (!newTeam.name || !newTeam.projectDescription || !newTeam.projectType || !newTeam.technologies.length) {
      alert("Заполните все обязательные поля.");
      return;
    }
  
    try {
      const formattedTeam = {
        name: newTeam.name,
        project_description: newTeam.projectDescription, 
        project_type: newTeam.projectType, 
        captain_id: studentId,
        technologies: newTeam.technologies, 
        current_track: currentTrackId,
      };
  
      await createTeam(formattedTeam);
      alert("Команда успешно добавлена!");
  

      setNewTeam({
        name: "",
        projectDescription: "", 
        projectType: null,
        technologies: [],
        currentTrackId: currentTrackId || null,
        captainId: studentId || null, 
      });
    } catch (error) {
      console.error("Ошибка при создании команды:", error);
      alert("Не удалось создать команду.");
    }
  };
  
  return { newTeam, handleChange, handleSubmit };
};
