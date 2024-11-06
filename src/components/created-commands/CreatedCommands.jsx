import React, { useState } from "react";
import "./style.css";

let command_example = {
  id: 1,
  name: "Название какое то ",
  resume: "Делаем красивое веб приложение",
  type: "Веб-приложение",
  tags: ["JavaScript", "React", "Node.js"],
};

let tags = ["JavaScript", "React", "Node.js"];

const CreatedCommands = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name_of_command, setName] = useState(command_example.name);
  const [resume_of_command, setResume] = useState(command_example.resume);
  const [type_of_command, setType] = useState(command_example.type);
  const [tags_of_command, setTags] = useState(command_example.tags);

  const nameChange = (event) => {
    command_example.name=event.target.value;
    setName(command_example.name);
  };

  const resumeChange = (event) => {
    command_example.resume=event.target.value;
    setResume(command_example.resume);
  };

  const typeChange = (event) => {
    command_example.type=event.target.value;
    setType(command_example.type);
  };

  const tagsChange = (event) => {
    command_example.tags = event.target.value.split(",");
    setTags(command_example.tags);
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <div className="my-resume">
      {isEditing ? (
        <>
          <h5>Название команды:</h5>
          <input
            className="tags-input"
            type="text"
            value={name_of_command}
            onChange={nameChange}
          />
          <h5>Тип проекта:</h5>
          <input
            className="tags-input"
            type="text"
            value={type_of_command}
            onChange={resumeChange}
          />
          <h5>Описание проекта:</h5>
          <textarea
            className="info"
            type="text"
            value={resume_of_command}
            onChange={typeChange}
          />
          <h5>Теги:</h5>
            <input className="tags-input"
            type="text"
            value={tags_of_command}
            onChange={tagsChange}
            />
        </>
      ) : (
        <>
            <div className="card-name">{command_example.name}</div>
            <div className="card-type">{command_example.type}</div>
            <div className="card-resume">{command_example.resume}</div>
            <div className="card-tags">
              {command_example.tags.map((tag, index) => (
                <span key={index} className="card-tag">
                  {tag}
                </span>
              ))}
            </div>
        </>
      )}
      <button className="button-input" onClick={toggleEdit}>
        {isEditing ? "Сохранить" : "Редактировать"}
      </button>
    </div>
  );
};

export default CreatedCommands;
