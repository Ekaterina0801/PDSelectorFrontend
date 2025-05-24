import React, { useState, useEffect, useCallback, useMemo } from "react";
import { observer } from "mobx-react";
import styles from "./AdminDashboard.module.scss";
import { DataTable } from "../../components/data-table/DataTable";
import Loader from "../../components/spinner/Loader";
import Sidebar from "../../components/sidebar/Sidebar";
import teamStore from "../../stores/teamStore";
import applicationStore from "../../stores/applicationStore";
import authStore from "../../stores/authStore";
import trackStore from "../../stores/trackStore";
import SearchBar from "../../components/search-bar/SearchBar";
import Navbar from "../../components/navbar/Navbar";
import MainContent from "../../components/main-section/MainSection";
import Modal from "../../components/forms/modal/Modal";
import ModalForm from "../../components/profile/ModalForm";
import ErrorModal from "../../components/error-display/ErrorDisplay";
import UsersSection from "./UserSection";
import TeamsSection from "./TeamsSection";
import ApplicationsSection from "./ApplicationsSection";
import TracksSection from "./TracksSection";
import StatisticsSection from "./StatisticsSection";
import TeamOptionsSection from "./TeamOptionsSection";
const sidebarItems = [
  { name: 'Пользователи', icon: '👥' },
  { name: 'Команды', icon: '👤' },
  { name: 'Заявки', icon: '✉️' },
  { name: 'Треки', icon: '📄' },
  { name: 'Статистика', icon: '📊' },
  { name: 'Типы проектов и технологии', icon: '⚙️' },
];

const AdminDashboard = observer(() => {
  const [section, setSection] = useState(sidebarItems[0].name);

  const renderSection = () => {
    switch (section) {
      case 'Пользователи': return <UsersSection />;
      case 'Команды':      return <TeamsSection />;
      case 'Заявки':       return <ApplicationsSection />;
      case 'Треки':        return <TracksSection />;
      case 'Статистика':   return <StatisticsSection />;
      case 'Типы проектов и технологии': return <TeamOptionsSection/>;
      default: return null;
    }
  };

  return (
    <>
      <Navbar />
      <MainContent>
      
      <main className={styles.container}>
        {/* Sidebar for desktop */}
        <aside className={styles.sidebarWrapper}>
          <Sidebar
            items={sidebarItems}
            selected={section}
            onItemClick={setSection}
          />
        </aside>

        {/* Main content */}
        <section className={styles.content}>
          <h2 className={styles.title}>{section}</h2>
          {renderSection()}
        </section>

        {/* Bottom nav for mobile/tablet */}
        <nav className={styles.bottomNav}>
          {sidebarItems.map(item => (
            <button
              key={item.name}
              className={`${styles.navItem} ${section === item.name ? styles.active : ''}`}
              onClick={() => setSection(item.name)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.name}</span>
            </button>
          ))}
        </nav>
      </main>
      </MainContent>
    </>
  );
});

export default AdminDashboard;