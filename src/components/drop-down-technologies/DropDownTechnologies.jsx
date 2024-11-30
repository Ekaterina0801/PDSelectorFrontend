import React from "react";
import "./style.css";

const DropDownTechnologies = ({
  technologies_all,
  dropDownOpenFlag,
  setterForNewTech,
  techNew,
}) => {
  const handleTechSelect = (tech) => {
    dropDownOpenFlag(false);
    setterForNewTech(tech.name);
  };

  const handleCustomTechChange = (e) => {
    setterForNewTech(e.target.value);
  };

  return (
    <ul className="dropdown">
      {technologies_all && technologies_all.length > 0 ? (
        technologies_all.map((tech) => {
          console.log("Tech: ", tech);
          return (
            <li key={tech.id} onClick={() => handleTechSelect(tech)}>
              {tech.name}
            </li>
          );
        })
      ) : (
        <li>Нет доступных технологий</li>
      )}
      <li>
        <input
          type="text"
          value={techNew}
          onChange={handleCustomTechChange}
          placeholder="Введите свою технологию"
        />
      </li>
    </ul>
  );
};

export default DropDownTechnologies;
