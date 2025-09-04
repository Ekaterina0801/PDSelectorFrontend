
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
        //
      }
    }
    
    const actions = [];
    if (app === null) {
      return { status, actions, loading, error };
    }

    if (app?.type === 'REQUEST') {
      if (app.possibleTransitions.includes('sent')) {
        actions.push({
          key: 'send',
          text: 'Подать заявку',
          handler: () => doAction(
            { team_id: teamId, student_id: studentId, status: 'sent', type },
            'Заявка отправлена',
            'update'
          )
        });
      }
      if (app.possibleTransitions.includes('accepted')) {
        actions.push({
          key: 'approve',
          text: 'Принять заявку',
          handler: () => doAction(
            { id: app.id, status: 'accepted', team_id: teamId, student_id: studentId, type },
            'Заявка принята',
            'update'
          )
        });
      }
      if (app.possibleTransitions.includes('rejected')) {
        actions.push({
          key: 'rejectRequest',
          text: 'Отклонить заявку',
          handler: () => doAction(
            { id: app.id, status: 'rejected', team_id: teamId, student_id: studentId, type },
            'Заявка отклонена',
            'update'
          )
        });
      }
      if (app.possibleTransitions.includes('cancelled')) {
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
    } else /* type === 'invite' */ {
    // === ПРИГЛАШЕНИЯ ===
    // 1) Первичное приглашение (если статус пуст)
      if (app.possibleTransitions.includes('sent')) {
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
      // 2) Капитан может отменить, если sent
      if (app.possibleTransitions.includes('cancelled')) {
      actions.push({
        key: 'cancelInvite',
        text: 'Отменить приглашение',
        handler: () => doAction(
          { id: app.id, status: 'cancelled', team_id: teamId, student_id: studentId, type },
          'Приглашение отменено',
          'update'
        )
      });
    }
    // 3) Студент может принять/отклонить, когда «sent»
    if (app.possibleTransitions.includes('accepted')) {
      actions.push({
        key: 'acceptInvite',
        text: 'Принять приглашение',
        handler: () => doAction(
          { id: app.id, status: 'accepted', team_id: teamId, student_id: studentId, type },
          'Приглашение принято',
          'update'
        )
      });
    }
    if (app.possibleTransitions.includes('rejected')) {
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