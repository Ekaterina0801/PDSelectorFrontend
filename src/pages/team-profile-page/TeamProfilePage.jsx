import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { useParams } from "react-router-dom";
import useCurrentUser from "../../hooks/useCurrentUser";
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
import { useTeamInvitation } from "../../hooks/useTeamInvitation";
import styles from './TeamProfilePage.module.scss';
import projectTypeStore from "../../stores/projectTypeStore";
import technologyStore from "../../stores/technologyStore";

const TeamProfilePage = observer(() => {
  const { teamId } = useParams();
  const [currentContent, setCurrentContent] = useState('Текущие участники');
  const [showEditForm, setShowEditForm] = useState(false);
  const { currentUser, studentId } = authStore;
  const { successMessage } = useSuccessMessage();

  useEffect(() => {
   
    return () => teamStore.clearTeam();
  }, [teamId]);

  useEffect(() => {
    async function loadAll() {
      teamStore.fetchTeamById(teamId);
  
      await projectTypeStore.fetchProjectTypes();
    
      await technologyStore.fetchTechnologies();
  
    }
    loadAll();
  }, [teamId]);

  const isCaptain = !teamStore.team?.captain?.id === currentUser?.id;
  const appHook = useTeamApplication({ teamId, studentId, isCaptain });

  const StudentListItem = ({ student }) => (
    <div className={styles.studentListItem}>
      <StudentCard
        name={student.user.fio}
        course={student.course}
        about_self={student.about_self}
        technologies={student.technologies}
      />
    </div>
  );

  const renderMainContent = () => {
    if (teamStore.loading) return <div className={styles.loading}>Загрузка...</div>;
    if (teamStore.error) return <div className={styles.error}>{teamStore.error}</div>;

    const data = currentContent === 'Текущие участники'
      ? teamStore.team?.students || []
      : teamStore.team?.applications || [];

    if (!data.length) {
      return <div className={styles.noResults}>Нет данных.</div>;
    }

    return (
      <div className={styles.studentsGrid}>
        {data.map(item =>
          currentContent === 'Текущие участники' ? (
            <StudentListItem key={item.id} student={item} />
          ) : (
            <ApplicationCard
              key={item.id}
              applicationId={item.id}
              studentName={item.student?.fio || item.user?.fio}
              teamName={teamStore.team?.name}
              teamId={teamId}
              studentId={item.student?.id || item.user?.id}
              teamDescription={teamStore.team?.project_description}
              technologies={item.technologies || []}
              status={item.status || 'sent'}
              showCaptainOptions={true}
              onApprove={appHook.onAction}
              onReject={appHook.onAction}
              onCancel={appHook.onAction}
            />
          )
        )}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <MainContent>
        {isCaptain && (
          <Sidebar
            onItemClick={setCurrentContent}
            items={[{ name: 'Текущие участники' }, { name: 'Заявки в команду' }]}
          />
        )}

        <div className={styles.contentColumn}>
          {showEditForm && (
            <TeamEditForm
              teamData={{
                name: teamStore.team?.name,
                project_description: teamStore.team?.project_description,
                projectType: teamStore.team?.project_type?.name,
                technologies: teamStore.team?.technologies
              }}
              onSave={data => teamStore.updateTeam(data, teamId)}
              onCancel={() => setShowEditForm(false)}
              allTechnologies={technologyStore.technologies}
              projectTypes={projectTypeStore.projectTypes}
            />
          )}

          <TeamProfileCard
            team={teamStore.team}
            captain={{ avatarUrl: teamStore.team?.captain?.avatarUrl, fio: teamStore.team?.captain?.fio }}
            isCaptain={isCaptain}
            showEditForm={showEditForm}
            onEditClick={() => setShowEditForm(prev => !prev)}
            showButton={appHook.showButton}
            buttonText={appHook.buttonText}
            buttonClass={appHook.buttonClass}
            onAction={appHook.onAction}
          />

          <h2 className={styles.pageTitle}>{currentContent}</h2>
          {renderMainContent()}
          {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
        </div>
      </MainContent>
    </>
  );
});

export default TeamProfilePage;