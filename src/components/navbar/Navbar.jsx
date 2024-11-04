import React from 'react';
import './style.css';
import { NavLink } from 'react-router-dom';


const Navbar = () => {
    return (
        <div className="navbar">
            <div className="logo">ПД</div>
            <div className="nav-links">
                <NavLink to="/teams" activeClassName="active-link">
                    Команды
                </NavLink>
                <NavLink to="/students" activeClassName="active-link">
                    Участники
                </NavLink>
                <NavLink to="/profile" activeClassName="active-link">
                    Профиль
                </NavLink>
            </div>
        </div>
    );
};

export default Navbar;
