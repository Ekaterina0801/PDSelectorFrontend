import React, {useState, useRef} from 'react';
import './style.css';
import { NavLink } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import useTracks from '../../hooks/useTracks';
import { saveTrackId } from '../../hooks/cookieUtils';

const Navbar = () => {
    const {tracks, selectedTrack, setSelectedTrack} = useTracks();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const handleTrackChange = (trackId) =>{
        setSelectedTrack(trackId);
        saveTrackId(trackId);
        setIsDropdownOpen(false);
        window.location.reload();
    }

    const selectedTrackName = tracks.find(track=>track.id===Number(selectedTrack))?.name||"Выберите трек";
    return (
        <div className="navbar">
            <div className="logo">ПД</div>
            <div className="nav-links">
                <NavLink
                    to="/teams"
                    className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                    Команды
                </NavLink>
                <NavLink
                    to="/students"
                    className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                    Участники
                </NavLink>
                <NavLink
                    to="/profile"
                    className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                    Профиль
                </NavLink>
            </div>
            <div className="track-selector" ref={dropdownRef}>
        <div
          className={`select-icon ${isDropdownOpen ? 'open' : ''}`}
          onClick={() => setIsDropdownOpen((prev) => !prev)} 
        >
          <span>{selectedTrackName}</span>
          <FaChevronDown />
        </div>
        {isDropdownOpen && (
          <div className="dropdown">
            <ul>
              {tracks.map((track) => (
                <li key={track.id} onClick={() => handleTrackChange(track.id)}>
                  {track.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
        </div>
    );
};

export default Navbar;
