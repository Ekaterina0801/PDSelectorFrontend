import { useEffect } from 'react';
import { useLocalObservable } from 'mobx-react-lite';
import applicationStore from '../stores/applicationStore';
import useSuccessMessage from './useSuccessMessage';

export function useTeamInvitation({ teamId, studentId, isCaptain }) {
  const { showSuccessMessage } = useSuccessMessage();
  const store = useLocalObservable(() => applicationStore);

  useEffect(() => {
    if (isCaptain) {
      store.fetchApplicationByTeamIdAndStudentId(teamId, studentId);
      return () => store.clearApplication();
    }
  }, [teamId, studentId, isCaptain, store]);

  if (!isCaptain) return { showButton: false };

  const { application } = store;
  const hasInvite = application?.type === 'invite';
  let buttonText = hasInvite ? 'Отменить приглашение' : 'Пригласить в команду';
  const onAction = async () => {
    if (!hasInvite) {
      await store.createApplication({
        student_id: studentId,
        team_id: teamId,
        status: 'sent',
        type: 'invite'
      });
      showSuccessMessage('Приглашение отправлено');
    } else {
      await store.updateApplication({
        id: application.id,
        student_id: studentId,
        team_id: teamId,
        status: 'cancelled',
        type: 'invite'
      });
      showSuccessMessage('Приглашение отменено');
    }
  };

  return { showButton: true, buttonText, onAction };
}
