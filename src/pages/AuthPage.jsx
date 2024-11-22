import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";


const AuthPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token) {
      // Если токен получен, перенаправляем на профиль
      navigate('/profile');
    } else {
      console.error('Ошибка: токен отсутствует');
    }
  }, [navigate]);

  return <div>Авторизация...</div>;
};

export default AuthPage;


