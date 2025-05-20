import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import MainContent from "../../components/main-section/MainSection";
import TeamCard from "../../components/card/team-card/TeamCard";
import Navbar from "../../components/navbar/Navbar";
import ProfileCard from "../../components/card/profile-card/ProfileCard";
import ProfileEditForm from "../../components/profile/ProfileEditForm";
import ApplicationCard from "../../components/card/application-card/ApplicationCard";
import useSuccessMessage from "../../hooks/useSuccessMessage";
import TeamForm from "../../components/forms/team-form/TeamForm";
import { useNewTeam } from "../../hooks/useNewTeam";
import Modal from "../../components/forms/modal/Modal";
import { useModal } from "../../hooks/useModal";
import authStore from "../../stores/authStore";
import studentStore from "../../stores/studentStore";
import projectTypeStore from "../../stores/projectTypeStore";
import technologyStore from "../../stores/technologyStore";
import applicationStore from "../../stores/applicationStore";
import { observer } from "mobx-react";
import { useTeamInvitation } from "../../hooks/useTeamInvitation";
import { useTeamApplication } from "../../hooks/useTeamApplication";
import Loader from "../../components/spinner/Loader";
import styles from "./StudentProfilePage.module.scss";
import NoDataDisplay from "../../components/nodata-display/NoDataDisplay";
import ErrorModal from "../../components/error-display/ErrorDisplay";
import teamStore from "../../stores/teamStore";
import trackStore from "../../stores/trackStore";
const sidebarItems = [
  { name: "Мои команды", icon: "👥" },
  { name: "Профиль", icon: "👤" },
  { name: "Мои заявки", icon: "📄" },
  { name: "Созданные команды", icon: "⚙️" },
];
const StudentProfilePage = observer(() => {
  const { studentId } = useParams();
  const currentUserId = authStore.studentId;
  const isAdmin = authStore.isAdmin;
  const isOwnProfile = Number(studentId) === currentUserId;

  const [currentSection, setCurrentSection] = useState("Профиль");
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);

  const { student, loading, error: studentError } = studentStore;
  const { successMessage } = useSuccessMessage();
  const { showModal, toggleModal } = useModal();

  const {
    newTeam,
    handleChange: handleTeamChange,
    handleSubmit: handleTeamSubmit,
  } = useNewTeam(
    student?.current_track?.id,
    authStore.studentId,
    technologyStore.technologies,
    projectTypeStore.projectTypes
  );

  // 1) Загрузка данных при маунте
  useEffect(() => {
    studentStore.fetchStudentById(studentId);
    projectTypeStore.fetchProjectTypes();
    technologyStore.fetchTechnologies();
    trackStore.fetchTracks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startEditing = useCallback(() => setIsEditing(true), []);
  const stopEditing  = useCallback(() => setIsEditing(false), []);

  const saveProfile = useCallback(
    async (data) => {
      await studentStore.updateStudent(data, studentId);
      stopEditing();
    },
    [studentId, stopEditing]
  );

  // Рендер профиля или формы редактирования
  const renderProfile = () => {
    if (loading) return <Loader />;
    if (studentError) {
      return (
        <ErrorModal
          message={studentError}
          onClose={() => studentStore.setError(null)}
        />
      );
    }

    if (isOwnProfile && isEditing) {
      return (
        <ProfileEditForm
          studentData={student}
          onSave={saveProfile}
          onCancel={stopEditing}
          allTechnologies={technologyStore.technologies}
        />
      );
    }

    return (
      <ProfileCard
        studentData={student}
        isCurrentUser={isOwnProfile}
        isAdmin={isAdmin}
        onEdit={startEditing}
      />
    );
  };

  const renderMyTeams = () => {
    if (loading) return <Loader />;
    if (!student.teams?.length) {
      return <NoDataDisplay message="У вас нет команд" />;
    }
    return (
      <div className={styles.teamsGrid}>
        {student.teams.map((t) => (
          <Card
            key={t.id}
            name={t.name}
            type={t.projectType.name}
            resume={t.project_description}
            tags={t.technologies}
            profileLink={`/teams/${t.id}`}
          />
        ))}
      </div>
    );
  };

  const renderApplications = () => {
    if (loading) return <Loader />;
    if (!student.applications?.length) {
      return <NoDataDisplay message="У вас нет заявок" />;
    }
    return (
      <div className={styles.teamsGrid}>
        {student.applications.map((app) => (
          <ApplicationCard key={app.id} application={app} />
        ))}
      </div>
    );
  };

  const createdTeams = student?.current_team ? [student.current_team] : [];
  const renderCreatedTeams = () => (
    <>
      {!student.current_team && (
        <button
          className={styles.createButton}
          onClick={() => {
            setIsCreatingTeam(true);
            toggleModal();
          }}
        >
          Создать команду
        </button>
      )}
      {createdTeams.length > 0 ? (
        <div className={styles.teamsGrid}>
          {createdTeams.map((t) => (
            <TeamCard
              key={t.id}
              name={t.name}
              type={t.project_type?.name}
              description={t.project_description}
              technologies={t.technologies}
              profileLink={`/teams/${t.id}`}
            />
          ))}
        </div>
      ) : (
        <NoDataDisplay message="Нет созданных команд" />
      )}
    </>
  );

  const renderSection = () => {
    switch (currentSection) {
      case "Профиль":
        return renderProfile();
      case "Мои команды":
        return renderMyTeams();
      case "Мои заявки":
        return renderApplications();
      case "Созданные команды":
        return renderCreatedTeams();
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />

      <MainContent>
        {successMessage && (
          <div className={styles.successMessage}>{successMessage}</div>
        )}

        <div className={styles.container}>
          {(isOwnProfile || isAdmin) && (
            <aside className={styles.sidebarWrapper}>
              <Sidebar
                items={sidebarItems}
                selected={currentSection}
                onItemClick={setCurrentSection}
              />
            </aside>
          )}

          <section className={styles.contentColumn}>
            <h2 className={styles.pageTitle}>{currentSection}</h2>
            {renderSection()}
          </section>
        </div>

        {(isOwnProfile || isAdmin) && (
          <nav className={styles.bottomNav}>
            {sidebarItems.map((item) => (
              <button
                key={item.name}
                className={
                  item.name === currentSection
                    ? `${styles.navItem} ${styles.active}`
                    : styles.navItem
                }
                onClick={() => setCurrentSection(item.name)}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.name}</span>
              </button>
            ))}
          </nav>
        )}

        {showModal && isCreatingTeam && (
          <Modal
            show
            onClose={() => {
              setIsCreatingTeam(false);
              toggleModal();
            }}
          >
            <TeamForm
              newTeam={newTeam}
              onChange={handleTeamChange}
              onSubmit={async (e) => {
                e.preventDefault();
                await handleTeamSubmit(e);
                setIsCreatingTeam(false);
                toggleModal();
              }}
              onCancel={() => {
                setIsCreatingTeam(false);
                toggleModal();
              }}
              technologies={technologyStore.technologies}
              projectTypes={projectTypeStore.projectTypes}
              currentTrackId={authStore.trackId}
            />
          </Modal>
        )}
      </MainContent>
    </>
  );
});

export default StudentProfilePage;