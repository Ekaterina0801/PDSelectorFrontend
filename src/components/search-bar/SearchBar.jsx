import React from 'react';
import { useState } from 'react';

import styles from './SearchBar.module.scss';

const SearchBar = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = () => {
    onSearch(searchInput);
  };

  return (
    <div className={styles.searchBar}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Поиск"
        />
        <button
          className={styles.searchButton}
          onClick={handleSearch}
        >
          🔍
        </button>
      </div>
    </div>
  );
};

export default SearchBar;