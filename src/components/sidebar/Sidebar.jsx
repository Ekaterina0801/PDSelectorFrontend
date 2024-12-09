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

const Sidebar = ({ items, onItemClick }) => {
    return (
        <div className="sidebar">
            <ul className="sidebar-links">
                {items.map((item, index) => (
                    <li key={index}>
                        <a 
                            href={item.link || "#"}  // Если есть ссылка, используем ее, иначе просто # 
                            onClick={(e) => {
                                e.preventDefault(); // Чтобы предотвратить стандартное поведение ссылки, если используется onItemClick
                                onItemClick(item.name);
                            }}
                        >
                            {item.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
