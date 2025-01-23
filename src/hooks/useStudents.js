import { useState, useEffect } from "react";
import { fetchStudents } from "../api/apiStudentsController";
import { getSavedTrackId } from "./cookieUtils";

const useStudents = (filters, searchInput) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      const trackId = getSavedTrackId();
      if (!trackId) {
        console.error("trackId отсутствует в куках");
        setLoading(false);
        return;
      }
      try {
        const data = await fetchStudents(trackId, { ...filters, input: searchInput });
        setStudents(data);
        console.log("Загруженные студенты:", data);
      } catch (error) {
        console.error("Не удалось загрузить студентов:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [filters, searchInput]);

  return { students, loading };
};

export default useStudents;
