import {
    FETCH_STUDENT_REQUEST,
    FETCH_STUDENT_SUCCESS,
    FETCH_STUDENT_FAILURE,
    UPDATE_APPLICATION_STATUS,
  } from "../actions/studentAction";
  
  const initialState = {
    studentData: null,
    myTeams: [],
    createdTeams: [],
    submittedRequests: [],
    loading: false,
    error: null,
    isCurrentUser: false,
  };
  
  const studentReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_STUDENT_REQUEST':
        return { ...state, loading: true, error: null };
      case 'FETCH_STUDENT_SUCCESS':
        return {
          ...state,
          loading: false,
          studentData: action.payload,
          myTeams: action.payload.teams,
          createdTeams: action.payload.created_teams,
          submittedRequests: action.payload.applications,
        };
      case 'FETCH_STUDENT_FAILURE':
        return { ...state, loading: false, error: action.payload };
        case UPDATE_APPLICATION_STATUS:
            return {
              ...state,
              submittedRequests: state.submittedRequests.map((request) =>
                request.id === action.payload.applicationId
                  ? { ...request, status: action.payload.status }
                  : request
              ),
            };
      default:
        return state;
    }
  };
  
  
  export default studentReducer;
  