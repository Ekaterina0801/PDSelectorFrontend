import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import routes from './routes';
import { useEffect } from 'react';
import authStore from './stores/authStore';
import commonStore from './stores/commonStore';
import { useLocation } from 'react-router-dom';
function App() {
  const location = useLocation(); 
  
  useEffect(() => {
    console.log('App mounted');
    commonStore.loadToken();  


    if (location.pathname !== '/login'&& location.pathname !== '/registration'&& location.pathname !== '/auth') {
      console.log('checkAuth');
      authStore.checkAuth(); 
    }

  }, [location]); 

  return (
    <div className="App">

        <Header />

        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>

    </div>
  );
}

export default App;