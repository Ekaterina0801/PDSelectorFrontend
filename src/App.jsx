import React from 'react';
import './styles/style.css';
import './App.css';
import Navbar from './components/navbar/Navbar';       
import TeamProfilePage from './pages/TeamProfilePage';
import TeamsPage from './pages/TeamsPage';
import SearchBar from './components/search-bar/SearchBar';
import AdminPage from './pages/AdminPage';
import StudentsPage from './pages/StudentsPage';
import ProfilePage from './pages/ProfilePage';
import Filter from './components/forms/Filter';
import Sidebar from './components/sidebar/Sidebar';
import MainSection from './components/main-section/MainSection';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
      <div className="App">
        <Router>
            {/* <Sidebar/> */}
            <Routes>
              <Route path="/teams" element={<TeamsPage />} /> 
              <Route path="/profile" element={<ProfilePage />} /> 
              <Route path="/admin" element={<AdminPage />} /> 
              <Route path="/teams/1" element={<TeamProfilePage />} /> 
              <Route path="/students" element={<StudentsPage />} /> 
            </Routes>
        </Router>
      </div>
  );
}

export default App;
