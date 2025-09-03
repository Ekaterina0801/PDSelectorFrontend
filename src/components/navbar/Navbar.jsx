import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { observer } from "mobx-react";
import authStore from "../../stores/authStore";
import trackStore from "../../stores/trackStore";
import { FaChevronDown, FaUsers, FaUserGraduate, FaLayerGroup, FaTools, FaCheck } from "react-icons/fa";

import styles from "./Navbar.module.scss";
const Navbar = observer(() => {
  const { tracks, fetchTracks } = trackStore;
  const { trackId, studentId, isAdmin, setTrackId } = authStore;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!tracks.length) fetchTracks();
  }, [tracks.length, fetchTracks]);

  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleTrackChange = (id) => {
    authStore.setTrackId(id);
    setIsDropdownOpen(false);
    setMenuOpen(false);
  };

  const selectedTrackName =
    tracks.find((t) => t.id === parseInt(trackId, 10))?.name || "Выберите трек";

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <span className={styles.logoDot} />
          <h3>Конструктор команд</h3>
        </div>

        <button
          type="button"
          className={styles.burger}
          aria-label="Открыть меню"
          aria-expanded={menuOpen}
          onClick={toggleMenu}
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`${styles.menu} ${menuOpen ? styles.isOpen : ''}`}>
          <li>
            <NavLink
              to="/teams"
              end
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.isActive : ''}`
              }
            >
              <FaLayerGroup aria-hidden className={styles.icon} />
              <span>Команды</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/students"
              end
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.isActive : ''}`
              }
            >
              <FaUsers aria-hidden className={styles.icon} />
              <span>Участники</span>
            </NavLink>
          </li>

          {studentId && (
            <li>
              <NavLink
                to={`/students/${studentId}`}
                end
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.isActive : ''}`
                }
              >
                <FaUserGraduate aria-hidden className={styles.icon} />
                <span>Профиль</span>
              </NavLink>
            </li>
          )}

          {isAdmin && (
            <li>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.isActive : ''}`
                }
              >
                <FaTools aria-hidden className={styles.icon} />
                <span>Админка</span>
              </NavLink>
            </li>
          )}

          <li className={styles.trackLi}>
            <div className={styles.trackSelector} ref={dropdownRef}>
              <button
                type="button"
                className={`${styles.selectBtn} ${isDropdownOpen ? styles.open : ''}`}
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
                onClick={() => setIsDropdownOpen((p) => !p)}
                title={selectedTrackName}
              >
                <span className={styles.selectLabel} aria-live="polite">
                  {selectedTrackName}
                </span>
                <FaChevronDown className={styles.chevron} aria-hidden />
              </button>

              <div
                className={`${styles.dropdown} ${isDropdownOpen ? styles.dropOpen : ''}`}
                role="listbox"
              >
                <ul className={styles.dropList}>
                  {tracks.map((track) => {
                    const selected = track.id === parseInt(trackId, 10);
                    return (
                      <li key={track.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={selected}
                          className={`${styles.dropItem} ${selected ? styles.selected : ''}`}
                          onClick={() => handleTrackChange(track.id)}
                          title={track.name}
                        >
                          <span className={styles.itemName}>{track.name}</span>
                          {selected && <FaCheck className={styles.check} aria-hidden />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
});

export default Navbar;