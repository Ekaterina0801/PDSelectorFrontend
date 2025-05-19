import React, { useEffect } from 'react';
import styles from './LoginForm.module.scss';

const LoginForm = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/azure';
    //window.location.href = 'https://titlecounter.ru:8080/oauth2/authorization/azure';
  };

  const getCookieValue = name => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };

  useEffect(() => {
    ['trackId', 'userId', 'JSESSIONID', 'SessionId'].forEach(name => {
      const val = getCookieValue(name);
      if (val) {
        localStorage.setItem(name, val);
        console.log(`Moved cookie ${name}→localStorage: ${val}`);
      } else {
        console.warn(`Cookie ${name} not found`);
      }
    });
  }, []);

  return (
    <div className={styles.background}>
      <div className={styles.loginContainer}>
        <div className={styles.loginImage}>
          <img src="/images/start-cat.jpg" alt="Login Illustration" />
        </div>
        <div className={styles.loginContent}>
          <h2 className={styles.welcomeText}>
            Добро пожаловать на портал выбора команд ПД
          </h2>
          <button className={styles.loginButton} onClick={handleLogin}>
            Войти
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
