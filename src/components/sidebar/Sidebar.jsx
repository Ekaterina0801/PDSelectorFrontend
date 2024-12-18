import React from 'react';
import './style.css';
const Sidebar = ({ items, onItemClick }) => {
    return (
        <div className="sidebar">
            <ul className="sidebar-links">
                {items.map((item, index) => (
                    <li key={index} className="sidebar-item">
                        <a 
                            href={item.link || "#"}  // Если есть ссылка, используем ее, иначе просто #
                            onClick={(e) => {
                                e.preventDefault(); // Чтобы предотвратить стандартное поведение ссылки, если используется onItemClick
                                onItemClick(item.name);
                            }}
                            className="sidebar-link"
                        >
                            <span className="sidebar-icon">{item.icon}</span> {/* Отображение иконки */}
                            <span className="sidebar-name">{item.name}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;

