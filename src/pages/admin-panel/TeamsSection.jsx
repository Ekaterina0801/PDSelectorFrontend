import React, { useState, useEffect, useCallback, useMemo } from "react";
import { observer } from "mobx-react";
import styles from "./AdminDashboard.module.scss";
import { DataTable } from "../../components/data-table/DataTable";
import Loader from "../../components/spinner/Loader";
import teamStore from "../../stores/teamStore";
import ErrorModal from "../../components/error-display/ErrorDisplay";
import trackStore from "../../stores/trackStore";
import { TeamService } from "../../service/teamService";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/forms/modal/Modal";
import TeamEditModalAdmin from "./TeamEditFormAdmin";
import authStore from "../../stores/authStore";
import studentStore from "../../stores/studentStore";


const TeamsSection = observer(() => {
  const {
    teams,
    total,
    loading,
    error,
    allFilters,
    filters,
    fetchTeams,
    setFilters,
    deleteTeam,
    updateTeam,
    setCurrentTeam,
    clearCurrentTeam,
    team: currentTeam,
  } = teamStore;

  const { tracks, fetchTracks } = trackStore;
  const { users, fetchUsers } = authStore;

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("id,asc");
  const [showTrackModal, setShowTrackModal] = useState(false);

  const [showMembersModal, setShowMembersModal] = useState(false);
  const [members, setMembers] = useState([]);

  // Load reference data
  useEffect(() => {
    const init = async () => {
      try {
        await trackStore.fetchTracks();
        await authStore.fetchUsers();
      } catch (e) {
        console.error("Ошибка при загрузке треков или пользователей:", e);
      }
    };
    init();
  }, []);

  // Load teams & filters
  useEffect(() => {
    console.log("CURR TEAM", currentTeam);
    console.log("TRACJ", currentTeam?.current_track);
    const load = async () => {
      try {
        console.log("FILTERS", filters);
        if (currentTeam.current_track != null) {
          await teamStore.fetchFilters(currentTeam.current_track);
        }
        await teamStore.fetchTeams({ ...filters, searchTerm: search, sort });
      } catch (e) {
        console.error("Ошибка при загрузке команд или фильтров:", e);
      }
    };
    load();
  }, [filters.trackId, filters.page, filters.size, search, sort]);

  console.log("filters", allFilters);

  const displayed = useMemo(() => {
    let arr = teams.slice();
    const q = search.trim().toLowerCase();
    if (q) arr = arr.filter((t) => t.name.toLowerCase().includes(q));
    const [field, dir] = sort.split(",");
    return arr.sort((a, b) => {
      const va = ("" + (a[field] || "")).toLowerCase();
      const vb = ("" + (b[field] || "")).toLowerCase();
      if (va < vb) return dir === "asc" ? -1 : 1;
      if (va > vb) return dir === "asc" ? 1 : -1;
      return 0;
    });
  }, [teams, search, sort]);

  const updateFilter = useCallback(
    (key, value) => {
      setFilters({ ...filters, [key]: value, page: 0 });
    },
    [filters, setFilters]
  );

  const handleExportCsv = async () => {
    if (!filters.trackId) {
      setShowTrackModal(true);
      return;
    }
    try {
      const blob = await TeamService.exportTeamsCsv(filters.trackId);
      saveAs(blob, `teams_track_${filters.trackId}.csv`);
    } catch {
      alert("Не удалось скачать CSV");
    }
  };

  const handleExportExcel = async () => {
    if (!filters.trackId) {
      setShowTrackModal(true);
      return;
    }
    try {
      const blob = await TeamService.exportTeamsExcel(filters.trackId);
      saveAs(blob, `teams_track_${filters.trackId}.xlsx`);
    } catch {
      alert("Не удалось скачать Excel");
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className={styles.error}>{error}</div>;
  console.log("currTeam", currentTeam);
  return (
    <>
      {/* — Filters & Export — */}
      <div className={styles.sortPaginationControls}>
        {/* Track */}
        <div className={styles.controlBlock}>
          <label>Трек:</label>
          <select
            value={filters.trackId ?? ""}
            onChange={(e) =>
              updateFilter(
                "trackId",
                e.target.value === "" ? null : +e.target.value
              )
            }
          >
            <option value="">Все</option>
            {tracks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Name Search */}
        <div className={styles.controlBlock}>
          <label>По названию:</label>
          <input
            type="text"
            placeholder="Название…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Fullness */}
        <div className={styles.controlBlock}>
          <label>Полнота:</label>
          <select
            value={filters.isFull ?? ""}
            onChange={(e) =>
              updateFilter(
                "isFull",
                e.target.value === "" ? null : e.target.value === "true"
              )
            }
          >
            <option value="">Все</option>
            <option value="true">Полные</option>
            <option value="false">Частичные</option>
          </select>
        </div>

        {/* Project Type */}
        <div className={styles.controlBlock}>
          <label>Тип проекта:</label>
          <select
            value={filters.projectType ?? ""}
            onChange={(e) =>
              updateFilter("projectType", e.target.value || null)
            }
          >
            <option value="">Все</option>
            {allFilters.projectTypes?.map((pt) => (
              <option key={pt.id} value={pt.id}>
                {pt.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className={styles.controlBlock}>
          <label>Сортировка:</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="id,asc">ID ↑</option>
            <option value="id,desc">ID ↓</option>
            <option value="name,asc">Название ↑</option>
            <option value="name,desc">Название ↓</option>
          </select>
        </div>

        {/* Export */}
          <button onClick={handleExportCsv} className={styles.exportButton}>📥 CSV</button>
          <button onClick={handleExportExcel} className={styles.exportButton}>📥 Excel</button>
      </div>

      {/* — Teams Table — */}
      <DataTable
        columns={[
          { key: "id", title: "ID" },
          { key: "name", title: "Название" },
          {
            key: "projectType",
            title: "Тип проекта",
            render: (_, t) => t.project_type?.name || "—",
          },
          {
            key: "captain",
            title: "Капитан",
            render: (_, t) => t.captain?.user.fio || "—",
          },
        ]}
        rows={displayed}
        renderRowActions={(t) => (
          <>
            <button
              onClick={() => {
                setMembers(t.students || []);
                setShowMembersModal(true);
              }}
              title="Состав команды"
            >
              ℹ️
            </button>
            <button
              onClick={() => {
                setCurrentTeam(t);
                console.log("team", t);
              }}
              title="Редактировать"
            >
              ✏️
            </button>
            <button onClick={() => deleteTeam(t.id)} title="Удалить">
              🗑️
            </button>
          </>
        )}
      />

      {/* — Pagination — */}
      <div className={styles.pagination}>
        <button
          onClick={() => updateFilter("page", Math.max(0, filters.page - 1))}
          disabled={filters.page === 0}
        >
          ← Назад
        </button>
        <span>
          Стр. {filters.page + 1} из {Math.ceil(total / filters.size)}
        </span>
        <button
          onClick={() =>
            updateFilter(
              "page",
              Math.min(Math.ceil(total / filters.size) - 1, filters.page + 1)
            )
          }
          disabled={filters.page + 1 >= Math.ceil(total / filters.size)}
        >
          Далее →
        </button>
      </div>

      {/* — Export Error — */}
      {showTrackModal && (
        <ErrorModal
          message="Чтобы скачать отчёт, выберите трек"
          imageUrl="/images/cat.png"
          onClose={() => setShowTrackModal(false)}
        />
      )}

      {/* — Members Modal — */}
      <Modal
        show={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        title="Состав команды"
      >
        <div className={styles.modalBody}>
          <ul>
            {members.map((m) => (
              <li key={m.user.id}>
                <strong>{m.user.fio}</strong>
                <div className={styles.memberInfo}>
                  <span>Курс: {m.course || "—"}</span>
                  <span>Группа: {m.group_number || "—"}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Modal>

      {currentTeam !== null && (
        <TeamEditModalAdmin
          show={true}
          onClose={clearCurrentTeam}
          onSave={(data) => {
            updateTeam(data);
            clearCurrentTeam();
          }}
          team={currentTeam}
          tracks={tracks}
          projectTypes={allFilters.projectTypes || []}
          students={users}
        />
      )}
    </>
  );
});

export default TeamsSection;
