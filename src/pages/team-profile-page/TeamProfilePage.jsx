import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { useParams } from "react-router-dom";
import ApplicationCard from "../../components/card/application-card/ApplicationCard";
import useSuccessMessage from '../../hooks/useSuccessMessage';
import SuccessMessage from '../../components/successMessage/SuccessMessage';
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
import ErrorModal from "../../components/error-display/ErrorDisplay";
import Loader from "../../components/spinner/Loader";
import NoDataDisplay from "../../components/nodata-display/NoDataDisplay";
import cn from "classnames";
import applicationStore from "../../stores/applicationStore";
const sidebarItems = [
  { name: "Текущие участники", icon: "👥" },
  { name: "Заявки в команду", icon: "📄" },
];
const TeamProfilePage = observer(() => {
  const { teamId } = useParams()
  const { currentUser, isAdmin } = authStore
  const [currentSection, setCurrentSection] = useState(sidebarItems[0].name)
  const [showEditForm, setShowEditForm]     = useState(false)
  const [localAppError, setLocalAppError]   = useState(null)
  const { successMessage, showSuccessMessage } = useSuccessMessage();

  useEffect(() => {
    teamStore.clearTeam()
    teamStore.fetchTeamById(teamId)
    technologyStore.fetchTechnologies()
    projectTypeStore.fetchProjectTypes()
  }, [teamId])

  const team       = teamStore.team
  const loading    = teamStore.loading
  const teamError  = teamStore.error
  const isCaptain  = team?.captain?.id === currentUser?.id

  console.log('team', team)
  useEffect(() => {
    if (applicationStore.error) {
      setLocalAppError(applicationStore.error)
      clearAppErrorHook()
    }
  }, [])

  if (loading || !team) {
    return (
      <>
        <Navbar />
        <MainContent>
          <Loader />
        </MainContent>
      </>
    )
  }
  if (teamError) {
    return (
      <>
        <Navbar />
        <MainContent>
          <ErrorModal message={teamError} onClose={() => teamStore.setError(null)} />
        </MainContent>
      </>
    )
  }


  const renderContent = () => {
    if (currentSection === sidebarItems[0].name) {

      if (!team.students?.length) {
        return <NoDataDisplay message="Нет участников" />
      }
      return (
        <div className={styles.studentsGrid}>
          {team.students.map(s => (
            <StudentCard
              key={s.id}
              name={s.user.fio}
              course={s.course}
              aboutSelf={s.about_self}
              technologies={s.technologies}
              profileLink={`/students/${s.id}`}
              idUser={s.user?.id}
            />
          ))}
        </div>
      )
    } else {
      if (!team.applications?.length) {
        return <NoDataDisplay message="Нет заявок" />
      }
      return (
        <div className={styles.studentsGrid}>
          {team.applications.map(app => (
            <ApplicationCard
              key={app.id}
              application={app}
            />
          ))}
        </div>
      )
    }
  }

  return (
    <>
      <Navbar />
      <MainContent>
      {!!successMessage && <SuccessMessage message={successMessage} />}
        {/* Ошибка операций по заявкам */}
        {localAppError && (
          <ErrorModal
            message={localAppError}
            onClose={() => setLocalAppError(null)}
          />
        )}

        <div className={styles.container}>
          {/* Сайдбар */}
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
            {/* Форма редактирования команды */}
            {showEditForm ? (
              <TeamEditForm
                teamData={team}
                onSave={fullData => {
                  teamStore.updateTeam(fullData, teamId)
                  setShowEditForm(false)
                  showSuccessMessage('Изменения сохранены')
                }}
                onCancel={() => setShowEditForm(false)}
                allTechnologies={technologyStore.technologies}
                projectTypes={projectTypeStore.projectTypes}
              />
            ) : (
              <TeamProfileCard
              team={team}
              isCaptain={isCaptain}
              showEditForm={showEditForm}
              onEditClick={() => setShowEditForm(true)}
              studentId={authStore.studentId}
              isAdmin={isAdmin}
              />
            )}

            {/* Заголовок секции */}
            <h2 className={styles.pageTitle}>{currentSection}</h2>
            {renderContent()}
          </section>
        </div>

        {/* Нижняя навигация для мобил */}
        {(isCaptain || isAdmin) && (
          <nav className={styles.bottomNav}>
            {sidebarItems.map(item => (
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
  )
})

export default TeamProfilePage