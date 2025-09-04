import { useState } from 'react';
//import { createTeam } from '../api/apiTeamsController';
import studentStore from '../stores/studentStore';
import teamStore from '../stores/teamStore';
import { extractErrorMessage } from "../utils/errorUtils";

export const useNewTeam = (currentTrackId, studentId, technologies, projectTypes) => {
  const [newTeam, setNewTeam] = useState({
    name: "",
    projectDescription: "",
    projectType: null,
    technologies: [],
    currentTrackId: currentTrackId || null,
    captainId: studentId || null,
  });

  const handleCheckboxChange = (value, checked) => {
    const selectedTech = technologies.find((tech) => tech.id.toString() === value);
    setNewTeam((prev) => ({
      ...prev,
      technologies: checked
        ? [...prev.technologies, selectedTech]
        : prev.technologies.filter((tech) => tech.id !== selectedTech.id),
    }));
  };

  const handleProjectTypeChange = (value) => {
    console.log("Selected project type:", value);
    const selectedProjectType = projectTypes.find((type) => Number(type.id) === Number(value));
    console.log("Selected project type object:", selectedProjectType);
    setNewTeam((prev) => ({
      ...prev,
      projectType: selectedProjectType || null,
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox' && name === 'technologies') {
      handleCheckboxChange(value, checked);
    } else if (name === 'projectType') {
      handleProjectTypeChange(value);
    } else {
      setNewTeam((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting new team:", newTeam);
    if (!newTeam.name || !newTeam.projectType) {
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

      await teamStore.createTeam(formattedTeam);
      await studentStore.fetchStudentById(studentId);
      //alert("Команда успешно добавлена!");

      resetNewTeam();
    } catch (error) {
      //console.error("Ошибка при создании команды:", error);
      //alert("Не удалось создать команду.");
      throw new Error(extractErrorMessage(error));
    }
  };

  const resetNewTeam = () => {
    setNewTeam({
      name: "",
      projectDescription: "",
      projectType: null,
      technologies: [],
      currentTrackId: currentTrackId || null,
      captainId: studentId || null,
    });
  };

  return { newTeam, handleChange, handleSubmit };
};