import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { useParams } from "react-router-dom";
import ApplicationCard from "../../components/card/application-card/ApplicationCard";
import useSuccessMessage from "../../hooks/useSuccessMessage";
import TeamEditForm from "../../components/profile/TeamEditForm";
import StudentCard from "../../components/card/student-card/StudentCard";
import { observer } from "mobx-react-lite";
import teamStore from "../../stores/teamStore";
import authStore from "../../stores/authStore";
import TeamProfileCard from "../../components/profile-card/TeamProfileCard";
import MainContent from "../../components/main-section/MainSection";
import { useTeamApplication } from "../../hooks/useTeamApplication";
import styles from "./TeamProfilePage.module.scss";
import projectTypeStore from "../../stores/projectTypeStore";
import technologyStore from "../../stores/technologyStore";
import applicationStore from "../../stores/applicationStore";
import ErrorModal from "../../components/error-display/ErrorDisplay";
import Loader from "../../components/spinner/Loader";
import NoDataDisplay from "../../components/nodata-display/NoDataDisplay";
import cn from "classnames";
const sidebarItems = [
  { name: "Текущие участники", icon: "👥" },
  { name: "Заявки в команду", icon: "📄" },
];

const TeamProfilePage = observer(() => {
  const { teamId } = useParams();
  const { currentUser, studentId, isAdmin } = authStore;
  const { showSuccessMessage } = useSuccessMessage();

  const [currentSection, setCurrentSection] = useState(sidebarItems[0].name);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    teamStore.clearTeam();
    teamStore.fetchTeamById(teamId);
    projectTypeStore.fetchProjectTypes();
    technologyStore.fetchTechnologies();
    //console.log('applicationStore', teamStore.team?.applications);
  }, [teamId]);

  const team = teamStore.team;
  console.log('apps', team?.applications);
  const loading = teamStore.loading;
  const error = teamStore.error;

  const isCaptain = team?.captain?.id === currentUser?.id;

  const appHook = useTeamApplication({ teamId, studentId, isCaptain });

  if (loading || !team) {
    return (
      <>
        <Navbar />
        <MainContent>
          <Loader />
        </MainContent>
      </>
    );
  }
  if (!applicationStore.loading && applicationStore.error) return (
  <>
    <Navbar />
    <MainContent>
      <ErrorModal
        message={applicationStore.error}
        onClose={() => {
          applicationStore.setError(null);
        }}
      />
    
    </MainContent>
  </>);

  if (error) {
    return (
      <>
        <Navbar />
        <MainContent>
          <ErrorModal
            message={error}
            onClose={() => teamStore.setError(null)}
          />
        </MainContent>
      </>
    );
  }

  const renderContent = () => {
    const list =
      currentSection === sidebarItems[0].name
        ? team.students
        : team.applications;

    if (!list || list.length === 0) {
      return (
        <NoDataDisplay
          message={
            currentSection === sidebarItems[0].name
              ? "Нет участников"
              : "Нет заявок"
          }
        />
      );
    }

    return (
      <div className={styles.studentsGrid}>
        {currentSection === sidebarItems[0].name
          ? list.map((s) => (
              <StudentCard
                key={s.id}
                name={s.user.fio}
                track={team.currentTrack?.name}
                course={s.course}
                about_self={s.about_self}
                technologies={s.technologies}
                profileLink={`/students/${s.id}`}
              />
            ))
          : list.map(app => (
            <ApplicationCard
              key={app.id}
              applicationId={app.id}
              studentName={app.student?.fio || app.user?.fio}
              teamName={team.name}
              teamId={teamId}
            studentId={app.student?.id ?? app.user?.id}
              teamDescription={team.project_description}
              technologies={app.technologies}
              status={app.status}
              showCaptainOptions={isCaptain}
              onApprove={appHook.onAction}
              onReject={appHook.onAction}
              onCancel={appHook.onAction}
            />
          ))}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <MainContent>
        <div className={styles.container}>
          {(isCaptain || isAdmin) && (
            <aside className={styles.sidebarWrapper}>
              <Sidebar
                items={sidebarItems}
                selected={currentSection}
                onItemClick={setCurrentSection}
              />
            </aside>
          )}

          <section className={styles.contentColumn}>
            {showEditForm && (
              <TeamEditForm
                teamData={{
                  name: team.name,
                  project_description: team.project_description,
                  projectType: team.project_type?.name,
                  technologies: team.technologies,
                }}
                onSave={(data) => {
                  teamStore.updateTeam(data, teamId);
                  setShowEditForm(false);
                }}
                onCancel={() => setShowEditForm(false)}
                allTechnologies={technologyStore.technologies}
                projectTypes={projectTypeStore.projectTypes}
              />
            )}

            <TeamProfileCard
              team={team}
              captain={{
                avatarUrl: team.captain.avatarUrl,
                fio: team.captain.fio,
              }}
              isCaptain={isCaptain}
              showEditForm={showEditForm}
              onEditClick={() => setShowEditForm((prev) => !prev)}
              showButton={appHook.showButton}
              buttonText={appHook.buttonText}
              buttonClass={appHook.buttonClass}
              onAction={appHook.onAction}
            />

            <h2 className={styles.pageTitle}>{currentSection}</h2>
            {renderContent()}

            {showSuccessMessage && (
              <div className={styles.successMessage}>{showSuccessMessage}</div>
            )}
          </section>
        </div>

        {(isCaptain || isAdmin) && (
          <nav className={styles.bottomNav}>
            {sidebarItems.map((item) => (
              <button
                key={item.name}
                className={cn(
                  styles.navItem,
                  currentSection === item.name && styles.active
                )}
                onClick={() => setCurrentSection(item.name)}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.name}</span>
              </button>
            ))}
          </nav>
        )}
      </MainContent>
    </>
  );
});

export default TeamProfilePage;
