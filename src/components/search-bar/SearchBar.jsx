import React from 'react';
import { useState, useEffect } from 'react';

import styles from './SearchBar.module.scss';
export default function SearchBar({ onSearch, defaultValue = '' }) {
  const [searchInput, setSearchInput] = useState(defaultValue)

  useEffect(() => {
    setSearchInput(defaultValue)
  }, [defaultValue])

  const handleSubmit = e => {
    e.preventDefault()
    onSearch(searchInput.trim())
  }

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Поиск"
          className={styles.searchInput}
        />
        <button
          type="submit"
          className={styles.searchButton}
          aria-label="Найти"
        >
          🔍
        </button>
      </div>
    </form>
  )
}
