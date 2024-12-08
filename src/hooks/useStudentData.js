import { useState, useEffect } from "react";
import { fetchStudentById } from "../api/apiStudentsController";

const useStudentData = (studentId, currentUser) => {
  const [studentData, setStudentData] = useState(null);
  const [myTeams, setMyTeams] = useState([]);
  const [createdTeams, setCreatedTeams] = useState([]);
  const [submittedRequests, setSubmittedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const loadStudentData = async () => {
      if (!studentId) return;

      setLoading(true);
      try {
        const fetchedStudent = await fetchStudentById(studentId);
        setStudentData(fetchedStudent);

        if (currentUser && currentUser.id === fetchedStudent.id) {
          setIsCurrentUser(true);
        }

        setMyTeams([fetchedStudent.team]);
        setSubmittedRequests(fetchedStudent.applications || []);
        setCreatedTeams(fetchedStudent.created_teams || []);
      } catch (error) {
        setError("Ошибка при загрузке данных студента.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, [studentId, currentUser]);

  return {
    studentData,
    myTeams,
    createdTeams,
    submittedRequests,
    loading,
    error,
    isCurrentUser,
  };
};

export default useStudentData;
