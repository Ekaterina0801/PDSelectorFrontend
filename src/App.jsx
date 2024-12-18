import React from 'react';
import './styles/style.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import routes from './routes';
import { Provider } from 'react-redux';
import store from './store';
function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Header />
        <Router>
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Router>
      </div>
    </Provider>
  );
}
export default App;