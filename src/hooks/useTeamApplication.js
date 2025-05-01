// src/hooks/useTeamRequest.js
import { useEffect } from 'react';
import { useLocalObservable } from 'mobx-react-lite';
import applicationStore from '../stores/applicationStore';
import useSuccessMessage from './useSuccessMessage';

export function useTeamApplication({ teamId, studentId, isCaptain }) {
    const { showSuccessMessage } = useSuccessMessage();
    const store = useLocalObservable(() => applicationStore);

    useEffect(() => {
      if (!isCaptain) {
        store.fetchApplicationByTeamIdAndStudentId(teamId, studentId);
        return () => store.clearApplication();
      }
    }, [teamId, studentId, isCaptain, store]);
    if (isCaptain) {
      return { showButton: false };
    }
  
    const { application } = store;
    console.log('application', application);
    const status = application?.status?.toLowerCase() || '';
  
    let buttonText = 'Подать заявку';
    let buttonClass = 'default'
    let onAction;
  
    if (!application) {
      onAction = async () => {
        await store.createApplication({
          student_id: studentId,
          team_id: teamId,
          status: 'sent',
          type: 'request'
        });
        showSuccessMessage('Заявка отправлена');
      };
    } else if (status === 'sent') {
      buttonText = 'Отменить заявку';
      buttonClass = 'pending';
      onAction = async () => {
        await store.updateApplication({
          id: application.id,
          student_id: studentId,
          team_id: teamId,
          status: 'cancelled',
          type: 'request'
        });
        showSuccessMessage('Заявка отменена');
      };
    } else if (status === 'accepted') {
      buttonText = 'Заявка одобрена';
      buttonClass = 'approved';
      onAction = null;
    } else if (status === 'rejected') {
      buttonText = 'Заявка отклонена';
      buttonClass = 'rejected';
      onAction = null;
    } else if (status === 'cancelled') {
      buttonText = 'Заявка отменена. Подать снова';
      buttonClass = 'cancelled';
      onAction = async () => {
        await store.updateApplication({
          id: application.id,
          student_id: studentId,
          team_id: teamId,
          status: 'sent',
          type: 'request'
        });
        showSuccessMessage('Заявка отправлена');
      };
    }
  
    return {
      showButton: true,
      buttonText,
      buttonClass,
      error: store.error,
      onAction,
    };
  }
  