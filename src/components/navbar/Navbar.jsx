import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { observer } from "mobx-react";
import authStore from "../../stores/authStore";
import trackStore from "../../stores/trackStore";

import styles from "./Navbar.module.scss";
const Navbar = observer(() => {
  const { tracks, fetchTracks } = trackStore;
  const trackId = authStore.trackId;
  const studentId = authStore.studentId;
  const isAdmin = authStore.isAdmin;
  console.log("isAdmin", isAdmin);


  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleTrackChange = (id) => {
    authStore.setTrackId(id);
    setIsDropdownOpen(false);
  };

  const selectedTrackName =
    tracks.find((t) => t.id === parseInt(trackId, 10))?.name || "Выберите трек";

  return (
    <nav className={styles.NavbarItems}>
      <div className={styles.logo}>
        <h3>Конструктор команд</h3>
      </div>
      <div className={styles.HamburgerCrossIcons} onClick={toggleMenu}>
        <i className={menuOpen ? "fas fa-times" : "fas fa-bars"} />
      </div>
      <ul className={`${styles.MenuItems} ${menuOpen ? styles.active : ""}`}>
        <li>
          <NavLink to="/teams" className="nav-link">
            Команды
          </NavLink>
        </li>
        <li>
          <NavLink to="/students" className="nav-link">
            Участники
          </NavLink>
        </li>
        { studentId&& (
          <li>
            <NavLink to={`/students/${studentId}`} end className="nav-link">
              Профиль
            </NavLink>
          </li>
        )}

        {isAdmin && (
          <li>
            <NavLink to={`/admin`} end className="nav-link">
              Админка
            </NavLink>
          </li>
        )}

        <li style={{ width: "100%", position: "relative" }}>
          <div className={styles.trackSelector} ref={dropdownRef}>
            <div
              className={`${styles.selectIcon} ${
                isDropdownOpen ? styles.open : ""
              }`}
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              <span>{selectedTrackName}</span>
              <FaChevronDown />
            </div>
            {isDropdownOpen && (
              <div className={styles.dropdown}>
                <ul>
                  {tracks.map((track) => (
                    <li
                      key={track.id}
                      onClick={() => handleTrackChange(track.id)}
                    >
                      {track.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </li>
      </ul>
    </nav>
  );
});

export default Navbar;
