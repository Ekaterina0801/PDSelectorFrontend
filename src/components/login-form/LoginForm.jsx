import React from 'react';
import Cookies from 'js-cookie';
import './style.css'


const LoginForm = () => {
  const handleLogin = () => {
    // Перенаправляем пользователя на сервер для начала авторизации через GitHub
    //window.location.href = 'http://188.225.11.37:8080/api/v1/';
    window.location.href = 'http://localhost:8080/api/v1/';
  };

  return (
    <div className="background">
      <div className="login-container">
        <div className="login-image">
          <img src="/images/logoMmcs.png" alt="Login Illustration" />
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


 

