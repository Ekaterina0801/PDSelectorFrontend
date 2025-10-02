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
import projectTypeStore from "../../stores/projectTypeStore";
import technologyStore from "../../stores/technologyStore";
import SuccessMessage from '../../components/successMessage/SuccessMessage';
import useSuccessMessage from '../../hooks/useSuccessMessage';
import {API_BASE_URL} from "../../api/apiController"
import { saveAs } from "file-saver";
import TeamCreateModalAdmin from "./TeamCreateModalAdmin";
import { useNewTeam } from "../../hooks/useNewTeam";
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
    createTeam,
    setCurrentTeam,
    clearCurrentTeam,
    team: currentTeam,
  } = teamStore;

  const { tracks } = trackStore;
  const { users, trackId: userTrackId } = authStore;
  const { projectTypes } = projectTypeStore;
  const { technologies } = technologyStore;
  const { successMessage, showSuccessMessage } = useSuccessMessage();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("id,asc");

  const [showTrackModal, setShowTrackModal] = useState(false);

  const [showMembersModal, setShowMembersModal] = useState(false);
  const [members, setMembers] = useState([]);

  const [teamToDelete, setTeamToDelete] = useState(null);

  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [createDraftTrackId, setCreateDraftTrackId] = useState(null);

  useEffect(() => {
    trackStore.fetchTracks();
    authStore.fetchUsers();
    projectTypeStore.fetchProjectTypes();
    technologyStore.fetchTechnologies();
  }, []);

  // грузим список команд/фильтры (НЕ завязываемся на currentTeam — это вызывало лишние перезагрузки)
  useEffect(() => {
    const load = async () => {
      await teamStore.fetchFilters(filters.trackId);
      await teamStore.fetchTeams({ ...filters, input: search, sort, size: 10000 });
    };
    load();
  }, [filters.trackId, filters.page, filters.size, sort]);

  const displayed = useMemo(() => {
    let arr = teams.slice();
    const q = search.trim().toLowerCase();
    if (q) arr = arr.filter((t) => t.name?.toLowerCase().includes(q));
    const [field, dir] = sort.split(",");
    return arr.sort((a, b) => {
      const va = ("" + (a[field] ?? "")).toLowerCase();
      const vb = ("" + (b[field] ?? "")).toLowerCase();
      if (va < vb) return dir === "asc" ? -1 : 1;
      if (va > vb) return dir === "asc" ? 1 : -1;
      return 0;
    });
  }, [teams, search, sort]);

  const updateFilter = useCallback(
    (diff) => setFilters({ ...filters, ...diff }),
    [filters, setFilters]
  );

  const handleExport = async (fmt) => {
    if (!filters.trackId) {
      setShowTrackModal(true);
      return;
    }
    try {
      const svc = fmt === "csv" ? TeamService.exportTeamsCsv : TeamService.exportTeamsExcel;
      const blob = await svc(filters.trackId);
      saveAs(blob, `teams_track_${filters.trackId}.${fmt}`);
    } catch {
      alert(`Не удалось скачать ${fmt.toUpperCase()}`);
    }
  };

  const confirmDelete = (team) => setTeamToDelete(team);
  const cancelDelete  = () => setTeamToDelete(null);

  const doDelete = async () => {
    if (teamToDelete) {
      await deleteTeam(teamToDelete.id);
      showSuccessMessage(`Команда "${teamToDelete.name}" успешно удалена`);
      setTeamToDelete(null);
    }
  };

  const getDefaultTrackId = () =>
    filters.trackId ?? userTrackId ?? tracks[0]?.id ?? null;

  const handleCreateNewTeam = () => {
    // гарантированно закрываем режим редактирования
    clearCurrentTeam();
    setCreateDraftTrackId(getDefaultTrackId());
    setIsCreatingNew(true);
  };

  // удобный helper — закрыть всё
  const closeAllModals = () => {
    setIsCreatingNew(false);
    setShowMembersModal(false);
    setTeamToDelete(null);
    clearCurrentTeam();
  };

  if (loading) return <Loader />;
  if (error) {
    return (
      <ErrorModal
        message={error}
        onClose={() => teamStore.setError(null)}
      />
    );
  }

  return (
    <>
      {!!successMessage && <SuccessMessage message={successMessage} />}

      {/* Кнопка создания */}
      <div className={styles.createButtonContainer}>
        <button className={styles.createButton} onClick={handleCreateNewTeam}>
          + Создать новую команду
        </button>
      </div>

      {/* Панель фильтров/экспорта */}
      <div className={styles.sortPaginationControls}>
        <div className={styles.controlBlock}>
          <label>Трек:</label>
          <select
            value={filters.trackId ?? ""}
            onChange={(e) =>
              updateFilter({
                trackId: e.target.value === "" ? null : +e.target.value,
                page: 0,
              })
            }
          >
            <option value="">Все</option>
            {tracks.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
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
              updateFilter({
                isFull: e.target.value === "" ? null : e.target.value === "true",
                page: 0,
              })
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
              updateFilter({ projectType: e.target.value || null, page: 0 })
            }
          >
            <option value="">Все</option>
            {allFilters.projectTypes?.map((pt) => (
              <option key={pt.id} value={pt.name}>{pt.name}</option>
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

        <div className={styles.emptyDiv}></div>  

          <button onClick={() => handleExport("csv")}  className={styles.exportButton}>📥 CSV</button>
          <button onClick={() => handleExport("xlsx")} className={styles.exportButton}>📥 Excel</button>
        
      </div>

      {/* Таблица */}
      <DataTable
        columns={[
          { key: "id", title: "ID" },
          { key: "name", title: "Название" },
          { key: "projectType", title: "Тип проекта", render: (_, t) => t.project_type?.name || "—" },
          { key: "captain", title: "Капитан", render: (_, t) => t.captain?.user.fio || "—" },
          {
            key: "technologies",
            title: "Технологии",
            render: (_, t) => {
              const techs = t.technologies || [];
              if (!techs.length) return "—";
              const shown = techs.slice(0, 4);
              const rest = techs.length - shown.length;
              return (
                <div className={styles.tagList}>
                  {shown.map((tech) => (
                    <span key={`tech-${tech.id}`} className={styles.tag}>
                      {tech.name}
                    </span>
                  ))}
                  {rest > 0 && <span className={styles.moreTag}>+{rest}</span>}
                </div>
              );
            },
          },
          {
            key: "projectDescription",
            title: "Описание",
            render: (_, t) => {
              const text = t.project_description || "";
              if (!text) return "—";
              return (
                <div className={styles.descCell} title={text}>
                  {text}
                </div>
              );
            },
          },
        ]}
        rows={displayed}
        renderRowActions={(t) => (
          <>
            <button
              onClick={() => {
                const m = (t.students || []).map((s) => ({
                  id: s.id,
                  userId: s.user?.id,
                  fio: s.user?.fio || "—",
                  course: s.course,
                  group: s.group_number,
                }));
                setMembers(m);
                setShowMembersModal(true);
              }}
              title="Состав команды"
            >
              ℹ️
            </button>
            <button
              onClick={() => {
                setIsCreatingNew(false); // на всякий случай
                setCurrentTeam(t);
              }}
              title="Редактировать"
            >
              ✏️
            </button>
            <button onClick={() => confirmDelete(t)} title="Удалить">🗑️</button>
          </>
        )}
      />

      {/* Пагинация */}
      <div className={styles.pagination}>
        <button
          onClick={() => updateFilter({ page: Math.max(0, filters.page - 1) })}
          disabled={filters.page === 0}
        >
          Назад
        </button>
        <span>
          Стр. {filters.page + 1} из {Math.max(1, Math.ceil(filters.total / filters.size))}
        </span>
        <button
          onClick={() => updateFilter({ page: Math.max(0, filters.page + 1) })}
          disabled={(filters.page + 1) * filters.size >= filters.total}
        >
          Далее
        </button>
      </div>

      {/* Гард для экспорта */}
      {showTrackModal && (
        <ErrorModal message="Чтобы скачать отчёт, выберите трек" onClose={() => setShowTrackModal(false)} />
      )}

      {/* Модалка состава */}
      <Modal show={showMembersModal} onClose={() => setShowMembersModal(false)} title="Состав команды">
        <div className={styles.membersList}>
          {members.map((m) => (
            <div key={m.id} className={styles.memberCard}>
              <img src={`${API_BASE_URL}/users/${m.userId}/photo`} alt={m.fio} className={styles.memberAvatar} />
              <div className={styles.memberDetails}>
                <Link to={`/students/${m.id}`} className={styles.memberName}>{m.fio}</Link>
                <p className={styles.memberMeta}>Курс {m.course || "—"} &bull; Группа {m.group || "—"}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Подтверждение удаления */}
      {teamToDelete && (
        <ErrorModal
          title="Удаление команды"
          message={`Удалить команду "${teamToDelete.name}"?`}
          onClose={cancelDelete}
          onConfirm={doDelete}
        />
      )}

      {/* Модалка СОЗДАНИЯ */}
      {isCreatingNew && (
        <TeamCreateModalAdmin
          show
          onClose={() => setIsCreatingNew(false)}
          onSave={async (payload) => {
            await createTeam(payload);
            // <<< ключевой момент: гарантированно НЕ открываем модалку редактирования
            clearCurrentTeam();
            setIsCreatingNew(false);
            showSuccessMessage("Команда успешно создана");
            // при желании можно рефетчнуть
            // await teamStore.fetchTeams({ ...filters, searchTerm: search, sort });
          }}
          tracks={tracks}
          projectTypes={projectTypes || []}
          technologies={technologies || []}
          defaultTrackId={createDraftTrackId}
        />
      )}

      {/* Модалка РЕДАКТИРОВАНИЯ */}
      {currentTeam && !isCreatingNew && (
        <>
          <TeamEditModalAdmin
            show
            onClose={() => clearCurrentTeam()}
            onSave={async (data) => {
              await updateTeam(data);
              if (!teamStore.error) {
                clearCurrentTeam();
                showSuccessMessage("Изменения сохранены");
              }
            }}
            team={currentTeam}
            technologies={technologies || []}
            tracks={tracks}
            projectTypes={projectTypes || []}
            students={users}
          />
          {teamStore.error && (
            <ErrorModal
              title="Ошибка при сохранении"
              message={teamStore.error}
              onClose={() => teamStore.setError(null)}
            />
          )}
        </>
      )}
    </>
  );
});

export default TeamsSection;