// Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './style.css';

/* const Sidebar = () => (
    <div className="sidebar">
        <h2>Меню</h2>
        <ul className="sidebar-links">
            <li>
            <NavLink to="/">
            Мои заявки
            </NavLink>
            </li>
            <li>
            <NavLink to="/">
            Мои команды
            </NavLink>
            </li>
            <li>
            <NavLink to="/">
            Мое резюме
            </NavLink>
            </li>
            <li>
            <NavLink to="/">
            Созданные команды
            </NavLink>
            </li>
            
            {/* <li><a href="/">Мое резюме</a></li>
            <li><a href="/">Мои команды</a></li>
            <li><a href="/">Созданные команды</a></li> }
        </ul>
    </div>
); 
*/

const Sidebar = ({ onItemClick }) => {
    return (
    <div className="sidebar">
        <ul className="sidebar-links">
            <li><a onClick={() => onItemClick("My applications")}>Мои заявки</a></li>
            <li><a onClick={() => onItemClick("My resume")}>Мое резюме</a></li>
            <li><a onClick={() => onItemClick("My commands")}>Мои команды</a></li>
            <li><a onClick={() => onItemClick("Created commands")}>Созданные команды</a></li>
        </ul>
    </div>
    );
};

export default Sidebar;
