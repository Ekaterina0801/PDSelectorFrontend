
import './style.css'
import React from 'react';
import { useEffect } from 'react';

const LoginForm = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/azure';
  };

  const getCookieValue = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };

  useEffect(() => {
    const cookieNames = ['trackId', 'userId', 'JSESSIONID', 'SessionId'];
    cookieNames.forEach((cookieName) => {
      const cookieValue = getCookieValue(cookieName);
      if (cookieValue) {
        localStorage.setItem(cookieName, cookieValue);
        console.log(`Кука ${cookieName} перемещена в localStorage: ${cookieValue}`);
      } else {
        console.warn(`Кука ${cookieName} не найдена.`);
      }
    });
  }, []);

  return (
    <div className="background">
      <div className="login-container">
        <div className="login-image">
          <img src="/images/logo3.png" alt="Login Illustration" />
        </div>
        <div className="login-content">
          <h2 className="welcome-text">Добро пожаловать на портал выбора команд ПД</h2>
          <button className="login-button" onClick={handleLogin}>Войти</button>
        </div>
      </div>
    </div>
  );
};
export default LoginForm;

 

