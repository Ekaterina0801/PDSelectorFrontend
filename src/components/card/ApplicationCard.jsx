import React, { useState } from "react";

const ApplicationCard = ({
    applicationId,
    studentName,
    teamName,
    teamId,
    studentId,
    teamDescription,
    technologies = [],
    status,
    onApprove,
    onReject,
    onCancel,
    onSending,
    onViewDetails,
    approveText = "Одобрить",
    rejectText = "Отклонить заявку",
    cancelText = "Отменить заявку",
    sendingText= "Подать заявку снова",
    viewDetailsText = "Подробнее",
    showCaptainOptions = false, 
  }) => {
    const [applicationStatus, setApplicationStatus] = useState(status);
  
    const handleApprove = () => {
      if (onApprove) onApprove(applicationId);
      setApplicationStatus("Accepted");
    };
  
    console.log('show>',showCaptainOptions);
    const handleReject = () => {
      if (onReject) onReject(applicationId);
      setApplicationStatus("Rejected");
    };
  
    const handleCancel = () => {
      if (onCancel) onCancel(applicationId);
      setApplicationStatus("Cancelled");
    };

    const handleSending = () =>{
        if (onSending) onSending(applicationId);
        setApplicationStatus("Sent");
    }
  
    const getStatusDetails = (status) => {
      switch (status) {
        case "Sent":
          return { text: "Отправлена", color: "#FFD700" }; 
        case "Accepted":
          return { text: "Принята", color: "#32CD32" };
        case "Rejected":
          return { text: "Отклонена", color: "#FF4500" };
        case "Cancelled":
          return { text: "Отменена", color: "#FF4500" }; 
        default:
          return { text: "Неизвестный", color: "#999" }; 
      }
    };
  
    const { text: statusText, color: statusColor } = getStatusDetails(applicationStatus);
  
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-type"><h3 className="type-capture">Студент: </h3> {studentName}</h3>
          {teamName && (
            <p className="card-type">
              <strong><h3 className="type-capture">Команда:</h3> </strong>
              {teamName}
            </p>
          )}
        </div>
        <div className="card-body">
          {teamDescription && (
            <p className="card-resume">
              <h3 className="type-capture">Описание команды: </h3>
              {teamDescription}
            </p>
          )}
          <div className="card-tags">
            <h3 className="text-capture">Технологии: </h3>
            {technologies.length > 0 ? (
              technologies.map((tech, index) => (
                <span key={index} className="card-tag">
                  {tech.name}
                </span>
              ))
            ) : (
              <p className="no-tags">-</p>
            )}
          </div>
          <p className="card-tag" style={{ backgroundColor: statusColor }}>
            <strong>Статус: </strong>
            {statusText}
          </p>
        </div>
        <div className="card-actions">
          {applicationStatus === "Sent" && (
            <>
              {showCaptainOptions && (
                <button className="action-button approve" onClick={handleApprove}>
                  {approveText}
                </button>
              )}
              {showCaptainOptions ? (
                <button className="action-button reject" onClick={handleReject}>
                  {rejectText}
                </button>
              ) : (
                <button className="action-button cancel" onClick={handleCancel}>
                  {cancelText}
                </button>
              )}
            </>
          )}
          {
            applicationStatus==="Cancelled" &&(
                <>
                <button className="action-button apply" onClick={handleSending}>
                  {sendingText}
                </button>
                </>
            )
          }
          <a href={`/teams/${teamId}`} className="action-link" rel="noopener noreferrer">
            <button className="action-button view">Перейти к команде</button>
          </a>
          <a href={`/students/${studentId}`} className="action-link" rel="noopener noreferrer">
            <button className="action-button view">Перейти к студенту</button>
          </a>
        </div>
      </div>
    );
  };
  
  export default ApplicationCard;
  