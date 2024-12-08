import "./style.css";
const ProfileCard = ({ studentData, onEdit }) => {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <img
              src={studentData.avatar || "https://via.placeholder.com/150"}
              alt="Avatar"
              className="profile-avatar"
            />
            <h2 className="profile-name">{studentData.user.fio || "Имя Фамилия"}</h2>
            <p className="profile-course">Курс: {studentData.course || "Не указан"}</p>
          </div>
          <div className="profile-details">
            <div className="profile-detail">
              <strong>Группа:</strong> <span>{studentData.group || "Не указана"}</span>
            </div>
            <div className="profile-detail">
              <strong>Контакты:</strong> <span>{studentData.contact || "Не указаны"}</span>
            </div>
            <div className="profile-detail">
              <strong>Технологии:</strong>
              <div className="card-tags">
                {studentData.technologies.length > 0 ? (
                  studentData.technologies.map((tag, index) => (
                    <span key={index} className="card-tag">
                      {tag.name}
                    </span>
                  ))
                ) : (
                  <span className="no-tags">-</span>
                )}
              </div>
            </div>
          </div>
          <button className="edit-button" onClick={onEdit}>
            Редактировать
          </button>
        </div>
      </div>
    );
  };
  
  export default ProfileCard;
  