import React from 'react';
import './style.css';
import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    onSearch(searchInput); // Передаем строку поиска родительскому компоненту
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)} // Обновляем локальное состояние
        placeholder="Поиск"
      />
      <button onClick={handleSearch}>Искать</button>
    </div>
  );
};

export default SearchBar;
