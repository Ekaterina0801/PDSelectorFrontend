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
import { Link } from "react-router-dom";
import studentStore from "../../stores/studentStore";

const TeamsSection = observer(() => {
  const {
    teams,
    loading,
    error,
    allFilters,
    filters,
    setFilters,
    deleteTeam,
    updateTeam,
    setCurrentTeam,
    clearCurrentTeam,
    team: currentTeam,
    total,
  } = teamStore;

  const { tracks } = trackStore;
  const { users } = authStore;

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("id,asc");
  const [showTrackModal, setShowTrackModal] = useState(false);

  const [showMembersModal, setShowMembersModal] = useState(false);
  const [members, setMembers] = useState([]);

  const [teamToDelete, setTeamToDelete] = useState(null);

  useEffect(() => {
    trackStore.fetchTracks();
    authStore.fetchUsers();
  }, []);

  useEffect(() => {
    const load = async () => {
      await teamStore.fetchFilters(filters.trackId);

      await teamStore.fetchTeams({ ...filters, searchTerm: search, sort });
    };

    load();
  }, [filters.trackId, filters.page, filters.size, search, sort, currentTeam]);

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

  const handleExport = async (fmt) => {
    if (!filters.trackId) {
      setShowTrackModal(true);
      return;
    }
    try {
      const svc =
        fmt === "csv"
          ? TeamService.exportTeamsCsv
          : TeamService.exportTeamsExcel;
      const blob = await svc(filters.trackId);
      saveAs(blob, `teams_track_${filters.trackId}.${fmt}`);
    } catch {
      alert(`Не удалось скачать ${fmt.toUpperCase()}`);
    }
  };

  const confirmDelete = (team) => {
    setTeamToDelete(team);
  };

  const cancelDelete = () => {
    setTeamToDelete(null);
  };

  const doDelete = async () => {
    if (teamToDelete) {
      await deleteTeam(teamToDelete.id);
      setTeamToDelete(null);
    }
  };

  if (loading) return <Loader />;
  console.log("teamStore.allFilters", teamStore.allFilters);
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <>
      <div className={styles.sortPaginationControls}>
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

        <div className={styles.controlBlock}>
          <label>По названию:</label>
          <input
            type="text"
            placeholder="Название…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

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
              <option key={pt.id} value={pt.name}>
                {pt.name}
              </option>
            ))}
          </select>
        </div>

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
        <button
          onClick={() => handleExport("csv")}
          className={styles.exportButton}
        >
          📥 CSV
        </button>
        <button
          onClick={() => handleExport("xlsx")}
          className={styles.exportButton}
        >
          📥 Excel
        </button>
      </div>

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
            <button onClick={() => setCurrentTeam(t)} title="Редактировать">
              ✏️
            </button>
            <button onClick={() => confirmDelete(t)} title="Удалить">
              🗑️
            </button>
          </>
        )}
      />

      <div className={styles.pagination}>
        <button
          onClick={() => updateFilter("page", Math.max(0, filters.page - 1))}
          disabled={filters.page === 0}
        >
          ← Назад
        </button>
        <span>
          Стр. {filters.page + 1} из{" "}
          {Math.max(1, Math.ceil(filters.total / filters.size))}
        </span>
        <button
          onClick={() => updateFilter("page", filters.page + 1)}
          disabled={(filters.page + 1) * filters.size >= filters.total}
        >
          Далее →
        </button>
      </div>

      {showTrackModal && (
        <ErrorModal
          message="Чтобы скачать отчёт, выберите трек"
          onClose={() => setShowTrackModal(false)}
        />
      )}

      <Modal
        show={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        title="Состав команды"
      >
        <div className={styles.membersList}>
          {members.map((m) => (
            <div key={m.user.id} className={styles.memberCard}>
              <img
                src={m.user.avatarUrl || "/images/placeholder2.png"}
                alt={m.user.fio}
                className={styles.memberAvatar}
              />
              <div className={styles.memberDetails}>
                <Link
                  to={`/students/${m.user.id}`}
                  className={styles.memberName}
                >
                  {m.user.fio}
                </Link>
                <p className={styles.memberMeta}>
                  Курс {m.course || "—"} &bull; Группа {m.group_number || "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {teamToDelete && (
        <ErrorModal
          title={"Удаление команды"}
          message={`Удалить команду "${teamToDelete.name}"?`}
          onClose={cancelDelete}
          onConfirm={doDelete}
        />
      )}

      {currentTeam && (
        <TeamEditModalAdmin
          show
          onClose={clearCurrentTeam}
          onSave={async (data) => {
            await updateTeam(data);
            clearCurrentTeam();
          }}
          team={currentTeam}
          technologies={allFilters.technologies || []}
          tracks={tracks}
          projectTypes={allFilters.projectTypes || []}
          students={users}
        />
      )}
    </>
  );
});

export default TeamsSection;
