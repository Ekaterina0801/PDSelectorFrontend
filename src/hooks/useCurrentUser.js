import { useState, useEffect } from "react";
import { fetchCurrentUser } from "../api/apiStudentsController";

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchCurrentUser();
        setCurrentUser(userData);
      } catch (err) {
        console.error("Ошибка при загрузке профиля пользователя:", err);
      }
    };

    loadUser();
  }, []);

  return currentUser;
};

export default useCurrentUser;
