import React from 'react';
import './style.css';
import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    onSearch(searchInput); 
  };

  return (
    <div className="search-bar">
      <div className="search-container">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)} 
          placeholder="Поиск"
        />
        <button className="search-button" onClick={handleSearch}>
          🔍
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
