
import { useEffect } from 'react';
import applicationStore from '../stores/applicationStore';
import useSuccessMessage from './useSuccessMessage';
import authStore from '../stores/authStore';
import { runInAction } from "mobx";
import teamStore from '../stores/teamStore';
/**
 * Хук для работы с одной заявкой или приглашением (request/invite)
 *
 * @param {{ type: 'request'|'invite', teamId: number, studentId: number }} params
 */
export function useApplicationActions({ type, teamId, studentId }) {
    const { showSuccessMessage } = useSuccessMessage()
  
    const key = `${teamId}_${studentId}`
  
    useEffect(() => {
      if (teamId != null && studentId != null) {
        applicationStore.fetchApplication(teamId, studentId)
      }
    }, [teamId, studentId, type])
  
    const app     = applicationStore.getApplication(teamId, studentId)  
    const loading = applicationStore.getLoading   (teamId, studentId)
    const error   = applicationStore.getError     (teamId, studentId)
  

    const status = app?.status?.toLowerCase() || ''
  

    const currentUserId  = authStore.studentId
    const isCaptainView  = authStore.authStudent?.is_captain

    const isStudentView  = (currentUserId === studentId) && (teamId!==authStore.authStudent?.current_team?.id) &&(!authStore.authStudent?.current_team) && (authStore.authStudent?.current_track?.id) && (authStore.authStudent?.current_track?.id === teamStore.team?.current_track)
    

  
    // универсальный метод для create/update
    async function doAction(payload, successMsg, method) {
      try {
        let updated
        if (method === 'create') {
          updated = await applicationStore.createApplication(payload)
        } else {
          updated = await applicationStore.updateApplication(payload)
        }
        showSuccessMessage(successMsg)
        runInAction(() => {
          applicationStore.applicationsByKey.set(key, updated)
        })
      } catch {
      }
    }
  
    const actions = [];

  if (type === 'request') {

    if (isCaptainView && status === 'sent') {
      actions.push({
        key: 'approve',
        text: 'Принять заявку',
        handler: () => doAction(
          { id: app.id, status: 'accepted', team_id: teamId, student_id: studentId, type },
          'Заявка принята',
          'update'
        )
      });
      actions.push({
        key: 'reject',
        text: 'Отклонить заявку',
        handler: () => doAction(
          { id: app.id, status: 'rejected', team_id: teamId, student_id: studentId, type },
          'Заявка отклонена',
          'update'
        )
      });
    }
    if (isStudentView ) {
      if (!status) {
        actions.push({
          key: 'send',
          text: 'Подать заявку',
          handler: () => doAction(
            { team_id: teamId, student_id: studentId, status: 'sent', type },
            'Заявка отправлена',
            'create'
          )
        });
      }
      if (status === 'sent') {
        actions.push({
          key: 'cancel',
          text: 'Отменить заявку',
          handler: () => doAction(
            { id: app.id, status: 'cancelled', team_id: teamId, student_id: studentId, type },
            'Заявка отменена',
            'update'
          )
        });
      }
      if (status === 'cancelled') {
        actions.push({
          key: 'resend',
          text: 'Подать снова',
          handler: () => doAction(
            { id: app.id, status: 'sent', team_id: teamId, student_id: studentId, type },
            'Заявка отправлена',
            'update'
          )
        });
      }
    }

  } else /* type === 'invite' */ {
    // === ПРИГЛАШЕНИЯ ===
    // 1) Первичное приглашение (если статус пуст)
    if (isCaptainView && !status) {
      actions.push({
        key: 'sendInvite',
        text: 'Пригласить',
        handler: () => doAction(
          { team_id: teamId, student_id: studentId, status: 'sent', type },
          'Приглашение отправлено',
          'create'
        )
      });
    }
    // 2) Капитан может отменить/пригласить снова, если «cancelled»
    if (isCaptainView && status === 'cancelled') {
      actions.push({
        key: 'cancelInvite',
        text: 'Отменить приглашение',
        handler: () => doAction(
          { id: app.id, status: 'cancelled', team_id: teamId, student_id: studentId, type },
          'Приглашение отменено',
          'update'
        )
      });
      actions.push({
        key: 'resendInvite',
        text: 'Пригласить снова',
        handler: () => doAction(
          { id: app.id, status: 'sent', team_id: teamId, student_id: studentId, type },
          'Приглашение отправлено',
          'update'
        )
      });
    }
    // 3) Студент может принять/отклонить, когда «sent»
    if (isStudentView && status === 'sent') {
      actions.push({
        key: 'acceptInvite',
        text: 'Принять приглашение',
        handler: () => doAction(
          { id: app.id, status: 'accepted', team_id: teamId, student_id: studentId, type },
          'Приглашение принято',
          'update'
        )
      });
      actions.push({
        key: 'declineInvite',
        text: 'Отклонить приглашение',
        handler: () => doAction(
          { id: app.id, status: 'rejected', team_id: teamId, student_id: studentId, type },
          'Приглашение отклонено',
          'update'
        )
      });
    }
  }

  return { status, actions, loading, error };
}