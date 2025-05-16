// src/hooks/useTeamRequest.js
import { useEffect } from 'react';
import { useLocalObservable } from 'mobx-react-lite';
import applicationStore from '../stores/applicationStore';
import useSuccessMessage from './useSuccessMessage';
import authStore from '../stores/authStore';
import { runInAction } from "mobx";
export function useTeamApplication({ teamId, isCaptain }) {
  const { showSuccessMessage } = useSuccessMessage();
  const { currentUser, studentId: authStudentId } = authStore;
  const studentId = authStudentId || currentUser?.id;

  useEffect(() => {
    if (!isCaptain && studentId) {
      applicationStore.fetchApplicationByTeamIdAndStudentId(teamId, studentId);
      return () => applicationStore.clearApplication();
    }
  }, [teamId, studentId, isCaptain]);

  const loading = applicationStore.loading;
  const error = applicationStore.error;
  const clearError = () => runInAction(() => { applicationStore.error = null });

  if (isCaptain) {
    // Капитан вправе принимать или отклонять заявки
    const performCaptain = async (id, status, successMsg) => {
      clearError();
      try {
        await applicationStore.updateApplication({ id, status });
        showSuccessMessage(successMsg);
      } catch (e) {
        const msg = e?.response?.data?.message || e.message || 'Ошибка';
        runInAction(() => { applicationStore.error = msg });
        return;
      }
      applicationStore.fetchApplicationsByTeamId(teamId);
    };

    const onApprove = id => performCaptain(id, 'accepted', 'Заявка принята');
    const onReject  = id => performCaptain(id, 'rejected', 'Заявка отклонена');
    return { showButton: false, onApprove, onReject, loading, error, clearError };
  }

  // Студент: создаём или отменяем заявку
  const application = applicationStore.application;
  const status = application?.status?.toLowerCase() || '';

  const performStudent = async (fn, successMsg) => {
    clearError();
    try {
      await fn();
      showSuccessMessage(successMsg);
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || 'Ошибка';
      runInAction(() => { applicationStore.error = msg });
      return;
    }
    applicationStore.fetchApplicationByTeamIdAndStudentId(teamId, studentId);
  };

  let buttonText = 'Подать заявку';
  let buttonClass = 'default';
  let onAction = () => performStudent(
    () => applicationStore.createApplication({ student_id: studentId, team_id: teamId, status: 'sent', type: 'request' }),
    'Заявка отправлена'
  );

  if (status === 'sent') {
    buttonText = 'Отменить заявку';
    buttonClass = 'pending';
    onAction = () => performStudent(
      () => applicationStore.updateApplication({ id: application.id, status: 'cancelled', student_id: studentId, team_id: teamId }),
      'Заявка отменена'
    );
  } else if (status === 'accepted') {
    buttonText = 'Заявка одобрена';
    buttonClass = 'approved';
    onAction = null;
  } else if (status === 'rejected') {
    buttonText = 'Заявка отклонена';
    buttonClass = 'rejected';
    onAction = null;
  } else if (status === 'cancelled') {
    buttonText = 'Подать снова';
    buttonClass = 'cancelled';
    onAction = () => performStudent(
      () => applicationStore.updateApplication({ id: application.id, status: 'sent', student_id: studentId, team_id: teamId }),
      'Заявка отправлена'
    );
  }

  return { showButton: true, buttonText, buttonClass, onAction, loading, error, clearError };
}
