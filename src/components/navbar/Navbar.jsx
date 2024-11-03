import React from 'react';
import './style.css';

const Navbar = () => (
    <div className="navbar">
        <div className="logo">ПД</div>
        <div className="nav-links">
            <a href="#teams">Команды</a>
            <a href="#students">Участники</a>
            <a href="#profile">Профиль</a>
        </div>
    </div>
);

export default Navbar;
