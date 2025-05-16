import React, { useState, useCallback, useEffect} from "react";
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
import styles from './StudentProfilePage.module.scss';
import NoDataDisplay from "../../components/nodata-display/NoDataDisplay";
import ErrorModal from "../../components/error-display/ErrorDisplay";


const sidebarItems = [
  { name: 'Мои команды', icon: '👥' },
  { name: 'Профиль', icon: '👤' },
  { name: 'Мои заявки', icon: '📄' },
  { name: 'Созданные команды', icon: '⚙️' },
];
const StudentProfilePage = observer(() => {
  const { studentId } = useParams();
  const currentStudentId = authStore.studentId;
  const isAdmin = authStore.isAdmin;
  const isOwnProfile = Number(studentId) === currentStudentId;

  const [currentSection, setCurrentSection] = useState('Профиль');
  const [isEditing, setIsEditing]               = useState(false);
  const [isCreatingTeam, setIsCreatingTeam]     = useState(false);

  const { student, loading} = studentStore;
  const isCaptain = student?.isCaptain;
  const { successMessage } = useSuccessMessage();
  const { showModal, toggleModal } = useModal();

  const appHook = useTeamApplication({
    teamId: student?.currentTeam,
    studentId: currentStudentId,
    isCaptain: false,
  });
  const inviteHook = useTeamInvitation({
    teamId: student?.currentTeam,
    studentId: Number(studentId),
    isCaptain,
  });

  const {
    newTeam,
    handleChange: handleTeamChange,
    handleSubmit: handleTeamSubmit,
  } = useNewTeam(
    authStore.trackId,
    authStore.studentId,
    technologyStore.technologies,
    projectTypeStore.projectTypes
  );

  useEffect(() => {
    async function loadAll() {
      await studentStore.fetchStudentById(studentId);  
      await projectTypeStore.fetchProjectTypes();
      await technologyStore.fetchTechnologies();
    }
    loadAll();
  }, [studentId, applicationStore.application]);
  
  
  const renderProfile = () => {
    if (loading) return <Loader />;
    if (!studentStore.loading&&studentStore.error) return <ErrorModal message={studentStore.error} onClose={() => studentStore.setError(null)} />;

    if ((isOwnProfile||isAdmin) && isEditing) {
      return (
        <ProfileEditForm
          studentData={student}
          onSave={data =>
            studentStore.updateStudent(data, studentId).then(() => setIsEditing(false))
          }
          onCancel={() => setIsEditing(false)}
          allTechnologies={technologyStore.technologies}
        />
      );
    }
    return (
      <ProfileCard
        studentData={student}
        isCurrentUser={isOwnProfile}
        onEdit={() => setIsEditing(true)}
        showButton={inviteHook.showButton}
        buttonText={inviteHook.buttonText}
        isLoading={inviteHook.isLoading}
        onAction={inviteHook.onAction}
      />
    );
  };

  const renderMyTeams = () => {
    if (loading) return <Loader />;
    return student.teams.length > 0 ? (
      <div className={styles.teamsGrid}>
        {student.teams.map(team => (
          <Card
            key={team.id}
            name={team.name}
            type={team.projectType.name}
            resume={team.project_description}
            tags={team.technologies}
            profileLink={`/teams/${team.id}`}
          />
        ))}
      </div>
    ) : (
      <NoDataDisplay message="У вас нет команд" />
    );
  };

  const renderApplications = () => {
    if (loading) return <Loader />;
    return student.applications.length > 0 ? (
      <div className={styles.teamsGrid}>
        {student.applications.map(req => (
          <ApplicationCard
            key={req.id}
            applicationId={req.id}
            studentName={req.student.fio}
            teamName={req.team.name}
            teamDescription={req.team.project_description}
            technologies={req.team.technologies}
            teamId={req.team.id}
            studentId={req.student.id}
            status={req.status}
            showCaptainOptions={isCaptain}
            onApprove={appHook.onAction}
            onReject={appHook.onAction}
            onCancel={appHook.onAction}
          />
        ))}
      </div>
    ) : (
      <NoDataDisplay message="У вас нет заявок" />
    );
  };

  const createdTeams = student?.current_team?[student.current_team]:[];

  const renderCreatedTeams = () => (
    
    <>
      <button
        className={styles.createButton}
        onClick={() => { setIsCreatingTeam(true); toggleModal(); }}
      >
        Создать команду
      </button>
      {createdTeams?.length > 0 ? (
        <div className={styles.teamsGrid}>
          {createdTeams.map(team => (
            <TeamCard
              key={team.id}
              name={team.name}
              type={team.project_type?.name}
              description={team.project_description}
              technologies={team.technologies}
              profileLink={`/teams/${team.id}`}
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
      case 'Профиль':       return renderProfile();
      case 'Мои команды':       return renderMyTeams();
      case 'Мои заявки':        return renderApplications();
      case 'Созданные команды': return renderCreatedTeams();
      default:                  return null;
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
            <div className={styles.sidebarWrapper}>
              <Sidebar
                items={sidebarItems}
                selected={currentSection}
                onItemClick={setCurrentSection}
              />
            </div>
          )}

          <section className={styles.contentColumn}>
            <h2 className={styles.pageTitle}>{currentSection}</h2>
            {renderSection()}
          </section>
        </div>

        {(isOwnProfile || isAdmin) && (
          <nav className={styles.bottomNav}>
            {sidebarItems.map(item => (
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
      </MainContent>

      {showModal && isCreatingTeam && (
        <Modal show onClose={() => { setIsCreatingTeam(false); toggleModal(); }}>
          <TeamForm
            newTeam={newTeam}
            onChange={handleTeamChange}
            onSubmit={handleTeamSubmit}
            onCancel={() => { setIsCreatingTeam(false); toggleModal(); }}
            technologies={technologyStore.technologies}
            projectTypes={projectTypeStore.projectTypes}
            currentTrackId={authStore.trackId}
          />
        </Modal>
      )}
    </>
  );
});

export default StudentProfilePage;