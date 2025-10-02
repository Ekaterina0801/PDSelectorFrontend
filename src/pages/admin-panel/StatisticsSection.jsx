// src/components/StatisticsSection.jsx
import React, { useEffect, useState, useMemo, useRef } from "react"
import { observer } from "mobx-react"
import trackStore from "../../stores/trackStore"
import teamStore from "../../stores/teamStore"
import studentStore from "../../stores/studentStore"
import stylesAdmin from "./AdminDashboard.module.scss";

import styles from "./StatisticsSection.module.scss";
import authStore from "../../stores/authStore"
import * as d3 from "d3";

import palette from "../../styles/palette"
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const StatisticsSection = observer(() => {
  const { students, fetchStudents } = studentStore;
  const { teams,    fetchTeams    } = teamStore;
  const { tracks,   fetchTracks   } = trackStore;

  const [selectedTrack, setSelectedTrack] = useState("");


  useEffect(() => {
    fetchTracks().then(() => {
      if (trackStore.tracks.length) {
        setSelectedTrack(trackStore.tracks[0].id);
      }
    });
  }, []);


  useEffect(() => {
    if (selectedTrack) {
      studentStore.fetchStudents({ trackId: selectedTrack, size: 10000 });
      teamStore.fetchTeams   ({ trackId: selectedTrack, size: 10000 });
    }
  }, [selectedTrack]);

  const haveTeam = students.filter(s => s.has_team).length;
  const noTeam   = students.length - haveTeam;

  const currentTrack = tracks.find(t => t.id === selectedTrack) || {
    minConstraint: 0,
    maxConstraint: Infinity,
  };
  const { minConstraint, maxConstraint } = currentTrack;
  const fullTeams = teams.filter(
    t => t.is_full == true
  ).length;
  const notFull = teams.length - fullTeams;

  const pctStudents = students.length
    ? Math.round((haveTeam / students.length) * 100)
    : 0;
  const pctTeams = teams.length
    ? Math.round((fullTeams / teams.length) * 100)
    : 0;

  const barData = useMemo(() => {
    const map = {};
    teams.forEach(t => {
      const key = t.project_type?.name || "Без типа";
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([type, count]) => ({ type, count }));
  }, [teams]);

  const typeColors = useMemo(() => {
    const types = barData.map(d => d.type);
    const scale = d3.scaleOrdinal(d3.schemeCategory10).domain(types);
    return Object.fromEntries(types.map(t => [t, scale(t)]));
  }, [barData]);

  return (
    <div className={styles.statistics}>

      <div className={styles.sortPaginationControls}>
        <div className={stylesAdmin.controlBlock}>
          <label htmlFor="track-select">Трек:</label>
          <select
            id="track-select"
            value={selectedTrack}
            onChange={e => setSelectedTrack(e.target.value)}
          >
            {tracks.map(tr => (
              <option key={tr.id} value={tr.id}>{tr.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className={styles.widgets}>
        {/* Донат студентов */}
        <div className={styles.widget}>
          <h2>Распределение студентов по командам</h2>
          <div className={styles.donut}>
            <div
              className={styles["donut-inner"]}
              style={{
                "--pct": `${pctStudents}%`,
                "--color": "#9ccc65",
                "--bg": "#dcd0ff",
              }}
            />
            <div className={styles["donut-center"]}>
              {pctStudents}%
            </div>
          </div>
          <div className={styles.texts}>
            <p><strong>{haveTeam}</strong> студентов в проектах</p>
            <p><strong>{noTeam}</strong> без проектов</p>
          </div>
      
        </div>

        {/* Донат команд */}
        <div className={styles.widget}>
          <h2>Информация о командах</h2>
          <h2></h2>
          <div className={styles.donut}>
            <div
              className={styles["donut-inner"]}
              style={{
                "--pct": `${pctTeams}%`,
                "--color": "#ff8c42",
                "--bg": "#dcd0ff",
              }}
            />
            <div className={styles["donut-center"]}>
              {pctTeams}%
            </div>
          </div>
          <div className={styles.texts}>
            <p><strong>{fullTeams}</strong> заполнены</p>
            <p><strong>{notFull}</strong> неполные</p>
          </div>
        </div>
      </div>

      {/* Гистограмма */}
      <div className={styles.histogram}>
        <h2>Проекты по типам</h2>
        <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={barData}
          margin={{ top: 20, right: 30, left: 1, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="type" 
            angle={-40} 
            textAnchor="end" 
            interval={0} 
            height={60}
            className="x-axis-tick"
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
          
          <Bar dataKey="count">
            {barData.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={typeColors[entry.type]} />
            ))}
          </Bar>
        </BarChart>
        </ResponsiveContainer>
        <p className={styles.total}>
          Всего проектов: <strong>{teams.length}</strong>
        </p>
      </div>
    </div>
  );
});

export default StatisticsSection;