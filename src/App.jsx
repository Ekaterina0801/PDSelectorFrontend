import React from 'react';
import './styles/style.css';
import './App.css';

import Navbar from './components/navbar/Navbar';       
import SearchBar from './components/search-bar/SearchBar';
import Filter from './components/forms/Filter';
import MainSection from './components/main-section/MainSection';

function App() {
  return (
      <div className="App">
          <Navbar />
          <SearchBar />
          <div className="container">
              <Filter />
              <MainSection />
          </div>
      </div>
  );
}

export default App;
