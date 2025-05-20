// src/hooks/useTeamRequest.js
import { useEffect } from 'react';
import { useLocalObservable } from 'mobx-react-lite';
import applicationStore from '../stores/applicationStore';
import useSuccessMessage from './useSuccessMessage';
import authStore from '../stores/authStore';
import { runInAction } from "mobx";
import {toJS} from "mobx";
import studentStore from '../stores/studentStore';
import teamStore from '../stores/teamStore';
export function useTeamApplication({ isCaptain }) {
  const { showSuccessMessage } = useSuccessMessage();
  const { studentId: authStudentId, currentUser } = authStore;

  // Вычисляем teamId: если капитан, берём из teamStore, иначе — из studentStore
  const teamId = isCaptain
    ? teamStore.team?.id
    : studentStore.student?.currentTeamId;
  const studentId = authStudentId || currentUser?.id;

  // При монтировании подгружаем статус заявки
  useEffect(() => {
    if (!isCaptain && studentId != null && teamId != null) {
      applicationStore.fetchApplicationByTeamIdAndStudentId(teamId, studentId);
      return () => applicationStore.clearApplication();
    }
  }, [isCaptain, studentId, teamId]);

  const application = applicationStore.application;
  const status = application?.status?.toLowerCase() || '';

  const clearError = () => runInAction(() => { applicationStore.error = null; });
  const loading = applicationStore.loading;
  const error = applicationStore.error;

  // Обёртка для операций студента
  const performStudent = async (fn, successMsg) => {
    clearError();
    try {
      await fn();
      showSuccessMessage(successMsg);
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || 'Ошибка';
      runInAction(() => { applicationStore.error = msg; });
      return;
    }
    // Перезагружаем статус
    if (teamId != null && studentId != null) {
      applicationStore.fetchApplicationByTeamIdAndStudentId(teamId, studentId);
    }
  };

  // Логика кнопок для студента
  let buttonText = 'Подать заявку';
  let buttonClass = '';
  let onAction = null;

  if (teamId != null && studentId != null) {
    if (!application) {
      onAction = () => performStudent(
        () => applicationStore.createApplication({
          student_id: studentId,
          team_id:    teamId,
          status:     'sent',
          type:       'request',
        }),
        'Заявка отправлена'
      );
    } else {
      switch (status) {
        case 'sent':
          buttonText = 'Отменить заявку';
          buttonClass = 'pending';
          onAction = () => performStudent(
            () => applicationStore.updateApplication({
              id:         application.id,
              student_id: studentId,
              team_id:    teamId,
              status:     'cancelled',
              type:       'request',
            }),
            'Заявка отменена'
          );
          break;
        case 'accepted':
          buttonText = 'Заявка принята';
          buttonClass = 'approved';
          onAction = null;
          break;
        case 'rejected':
          buttonText = 'Заявка отклонена';
          buttonClass = 'rejected';
          onAction = null;
          break;
        case 'cancelled':
          buttonText = 'Подать снова';
          buttonClass = 'cancelled';
          onAction = () => performStudent(
            () => applicationStore.updateApplication({
              id:         application.id,
              student_id: studentId,
              team_id:    teamId,
              status:     'sent',
              type:       'request',
            }),
            'Заявка отправлена'
          );
          break;
        default:
          onAction = () => performStudent(
            () => applicationStore.createApplication({
              student_id: studentId,
              team_id:    teamId,
              status:     'sent',
              type:       'request',
            }),
            'Заявка отправлена'
          );
      }
    }
  }

  // Логика для капитана
  if (isCaptain && teamId != null) {
    const performCaptain = async (id, newStatus, successMsg) => {
      clearError();
      try {
        await applicationStore.updateApplication({ id, status: newStatus });
        showSuccessMessage(successMsg);
      } catch (e) {
        const msg = e?.response?.data?.message || e.message || 'Ошибка';
        runInAction(() => { applicationStore.error = msg; });
        return;
      }
      applicationStore.fetchApplicationsByTeamId(teamId);
    };
    const onApprove = id => performCaptain(id, 'accepted',  'Заявка принята');
    const onReject  = id => performCaptain(id, 'rejected',  'Заявка отклонена');

    return { showButton: false, onApprove, onReject, loading, error, clearError };
  }

  return { showButton: true, buttonText, buttonClass, onAction, loading, error, clearError };
}