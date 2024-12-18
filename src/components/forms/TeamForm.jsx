import React from 'react';
function TeamForm({ newTeam, technologies, onChange, onSubmit, trackId }) {
    const handleTechnologyChange = (event) => {
        const { value, checked } = event.target;

        const selectedTech = technologies.find((tech) => tech.id.toString() === value);
        
        const updatedTechnologies = checked
          ? [...newTeam.technologies, selectedTech]
          : newTeam.technologies.filter((tech) => tech.id !== selectedTech.id); 


        onChange({
          target: {
            name: 'technologies',
            value: updatedTechnologies,
          }
        });
    };

    return (
      <form onSubmit={onSubmit} className="team-form">
        <label htmlFor="name">Название команды:</label>
        <input
          id="name"
          type="text"
          name="name"
          value={newTeam.name}
          onChange={onChange}
          required
        />

        <label htmlFor="projectDescription">Описание проекта:</label>
        <textarea
          id="projectDescription"
          name="projectDescription"
          value={newTeam.projectDescription}
          onChange={onChange}
          maxLength="1024"
          required
        />

        <label htmlFor="projectType">Тип проекта:</label>
        <input
          id="projectType"
          type="text"
          name="projectType"
          value={newTeam.projectType}
          onChange={onChange}
          required
        />

        <label htmlFor="technologies">Технологии:</label>
        <div className="technologies-list">
          {technologies && technologies.length > 0 ? (
            technologies.map((tech) => (
              <div key={tech.id} className="technology-checkbox">
                <input
                  type="checkbox"
                  id={`tech-${tech.id}`}
                  name="technologies"
                  value={tech.id} 
                  checked={newTeam.technologies.some((t) => t.id === tech.id)}  
                  onChange={handleTechnologyChange}
                />
                <label htmlFor={`tech-${tech.id}`}>{tech.name}</label>
              </div>
            ))
          ) : (
            <p>Нет доступных технологий</p>
          )}
        </div>
        <button type="submit">Создать команду</button>
      </form>
    );
}

export default TeamForm;
