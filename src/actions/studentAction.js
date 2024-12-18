// actions/studentActions.js
export const FETCH_STUDENT_REQUEST = "FETCH_STUDENT_REQUEST";
export const FETCH_STUDENT_SUCCESS = "FETCH_STUDENT_SUCCESS";
export const FETCH_STUDENT_FAILURE = "FETCH_STUDENT_FAILURE";
export const UPDATE_APPLICATION_STATUS = "UPDATE_APPLICATION_STATUS";
import { fetchStudentById } from "../api/apiStudentsController";
import { fetchApplicationById } from "../api/apiApplication";
import { updateApplication } from "../api/apiApplication";
export const fetchStudentRequest = () => ({
  type: FETCH_STUDENT_REQUEST,
});

export const fetchStudentSuccess = (studentData) => ({
  type: FETCH_STUDENT_SUCCESS,
  payload: studentData,
});

export const fetchStudentFailure = (error) => ({
  type: FETCH_STUDENT_FAILURE,
  payload: error,
});

export const updateApplicationStatus = (applicationId, status) => ({
  type: UPDATE_APPLICATION_STATUS,
  payload: { applicationId, status },
});


export const fetchStudentData = (studentId) => async (dispatch) => {
  dispatch(fetchStudentRequest());
  try {
    const fetchedStudent = await fetchStudentById(studentId);
    dispatch(fetchStudentSuccess(fetchedStudent));
  } catch (error) {
    dispatch(fetchStudentFailure("Ошибка при загрузке данных студента."));
  }
};

export const handleApplicationStatusChange = (applicationId, status, successMessage) => async (dispatch) => {
    try {
      const applicationData = await fetchApplicationById(applicationId);
      applicationData.status = status;
      console.log("Обновленные данные заявки:", applicationData);
      await updateApplication(applicationData); 
      dispatch(updateApplicationStatus(applicationId, status)); // Обновление статуса в Redux
      console.log(successMessage);
    } catch (error) {
      console.error("Ошибка при изменении статуса заявки:", error);
    }
  };
  

