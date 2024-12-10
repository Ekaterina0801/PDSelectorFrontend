import React, { useState, useRef } from "react";
import "./style.css";
import { NavLink } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import useTracks from "../../hooks/useTracks";
import { saveTrackId } from "../../hooks/cookieUtils";
import { MdOutlineMenu, MdClose } from "react-icons/md";

const MobileNavigation = () => {
  const [click, setClick] = useState(false);
  const { tracks, selectedTrack, setSelectedTrack } = useTracks();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const handleTrackChange = (trackId) => {
    setSelectedTrack(trackId);
    saveTrackId(trackId);
    setIsDropdownOpen(false);
    window.location.reload();
  };

  const Hamburger = (
    <MdOutlineMenu
      className="HamburgerMenu"
      size="30px"
      color="white"
      onClick={() => setClick(!click)}
    />
  );

  const Close = (
    <MdClose
      className="HamburgerMenu"
      size="30px"
      color="white"
      onClick={() => setClick(!click)}
    />
  );

  const selectedTrackName =
    tracks.find((track) => track.id === Number(selectedTrack))?.name ||
    "Выберите трек";
  return (
    <>
        
    <div className="navbar-mobile-logo"> 
        <div className="logo">ПД</div>
        <div className="track-selector" ref={dropdownRef}>          
            <div
              className={`select-icon ${isDropdownOpen ? "open" : ""}`}
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              <span>{selectedTrackName}</span>
              <FaChevronDown />
            </div>
            {isDropdownOpen && (
              <div className="dropdown">
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

        {click ? Close : Hamburger}
           
      {click && (
        <div className="navbar-mobile">
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
        </div>
      )}
       </div>
    </>
  );
};
export default MobileNavigation;
