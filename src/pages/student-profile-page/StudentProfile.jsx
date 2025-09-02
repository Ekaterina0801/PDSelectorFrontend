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
import SuccessMessage from '../../components/successMessage/SuccessMessage';
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
import { groupBy } from "lodash";


const sidebarItems = [
  { name: "Мои команды", icon: "👥" },
  { name: "Профиль", icon: "👤" },
  { name: "Мои заявки", icon: "📄" },
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
  const { successMessage, showSuccessMessage } = useSuccessMessage();

  const { showModal, toggleModal } = useModal();

  const {
    newTeam,
    handleChange: handleTeamChange,
    handleSubmit: handleTeamSubmit,
  } = useNewTeam(
    student?.current_track?.id,
    student?.id,
    technologyStore.technologies,
    projectTypeStore.projectTypes
  );

const groupTeamsByTrack = (teams) => {
    return groupBy(teams, t => {
      const trackId = t.current_track;
      const track = trackStore.tracks.find(tr => tr.id === trackId);
      return track ? track.name : 'Без трека';
    });
  };
  console.log('student', student);

  useEffect(() => {
    studentStore.fetchStudentById(studentId);
    projectTypeStore.fetchProjectTypes();
    technologyStore.fetchTechnologies();
    trackStore.fetchTracks();
  }, [studentId]); 

  const startEditing = useCallback(() => setIsEditing(true), []);
  const stopEditing  = useCallback(() => setIsEditing(false), []);

  const saveProfile = useCallback(
    async (data) => {
      await studentStore.updateStudent(data, studentId);
      stopEditing();
      showSuccessMessage(`Изменения сохранены`);
    },
    [studentId, stopEditing]
  );

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
    
    if ((isOwnProfile || isAdmin) && isEditing) {
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

  const renderTeamsSection = (teams, emptyMessage) => {
    if (loading) return <Loader />;
    if (!teams.length) {
      return <NoDataDisplay message={emptyMessage} />;
    }
    const groups = groupTeamsByTrack(teams);
    return (
      <div className={styles.trackGroupsContainer}>
        {Object.entries(groups).map(([trackName, group]) => (
          <div key={trackName}>
            <h3 className={styles.trackTitle}>{trackName}</h3>
            <div className={styles.teamsGrid}>
              {group.map(t => (
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
          </div>
        ))}
      </div>
    );
  };

const renderMyTeams = () => {
  if (loading) return <Loader />;

  const current = student?.current_team;
  const oldTeams = (student?.teams || []).filter(t => current?.id !== t.id);

  return (
    
    <div className={styles.contentColumn}>
      {authStore.authStudent?.id===student?.id&&!student.current_team && (
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
      {/* Блок текущей команды */}
      <h3 className={styles.comandState}>Текущая команда</h3>
      {current ? (
        <div className={styles.cardWithTrack}>
          <p className={styles.trackTitle}>
            Трек:{' '}
            {(() => {
              const track = trackStore.tracks.find(
                tr => tr.id === current.current_track
              );
              return track ? track.name : '—';
            })()}
          </p>
          <TeamCard
            key={current.id}
            name={current.name}
            type={current.project_type?.name}
            description={current.project_description}
            technologies={current.technologies}
            profileLink={`/teams/${current.id}`}
          />
          
        </div>
      ) : (
        <NoDataDisplay message="У вас нет текущей команды" />
      )}

      {/* Блок старых команд */}
      <h3 className={styles.comandState}>Старые команды</h3>
      {oldTeams.length ? (
        <div className={styles.teamsGrid}>
          {oldTeams.map(t => {
            const track = trackStore.tracks.find(tr => tr.id === t.current_track);
            return (
              <div key={t.id} className={styles.cardWithTrack}>
                <p className={styles.trackTitle}>
                  Трек: {track ? track.name : '—'}
                </p>
                <TeamCard
                  name={t.name}
                  type={t.project_type?.name}
                  description={t.project_description}
                  technologies={t.technologies}
                  profileLink={`/teams/${t.id}`}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <NoDataDisplay message="Нет старых команд" />
      )}
    </div>
  );
};


  const managedTeams = student?.teams?.filter(t => t.captain_id === currentUserId) || [];

  const renderManagedTeams = () =>
    renderTeamsSection(managedTeams, 'Нет управляемых команд');



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

  const renderSection = () => {
    switch (currentSection) {
      case "Профиль":
        return renderProfile();
      case "Мои команды":
        return renderMyTeams();
      case "Мои заявки":
        return renderApplications();
      case "Управляемые команды":
        return renderManagedTeams();
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />

      <MainContent>
      {!!successMessage && <SuccessMessage message={successMessage} />}

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