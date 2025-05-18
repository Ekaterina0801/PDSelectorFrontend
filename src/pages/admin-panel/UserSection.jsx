import React, { useState, useEffect, useCallback, useMemo } from "react";
import { observer } from "mobx-react";
import styles from "./AdminDashboard.module.scss";
import { DataTable } from "../../components/data-table/DataTable";
import Loader from "../../components/spinner/Loader";
import teamStore from "../../stores/teamStore";
import authStore from "../../stores/authStore";
import trackStore from "../../stores/trackStore";
import ModalForm from "../../components/profile/ModalForm";
import ErrorModal from "../../components/error-display/ErrorDisplay";
import StudentService from "../../service/studentService";
import { saveAs } from "file-saver";
const UsersSection = observer(() => {
  const {
    users,
    total,
    filters,
    roles,
    loading,
    error,
    deleteUser,
    fetchUsers,
  } = authStore;
  const { teams } = teamStore;
  const { tracks } = trackStore;

  const [search, setSearch] = useState(filters.fio || "");
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // initial data load
  useEffect(() => {
    authStore.fetchUsers();
    teamStore.fetchTeams();
    trackStore.fetchTracks();
  }, [fetchUsers]);

  // sync local search state
  useEffect(() => {
    setSearch(filters.fio || "");
  }, [filters.fio]);

  // helper to update filters (always reset page to 0)
  const updateFiltersHandler = useCallback(
    (diff) => {
      authStore.setFilters({ ...filters, ...diff, page: 0, size: filters.size });
    },
    [filters]
  );

  // filtered rows
  const displayed = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.fio.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [users, search]);

  // export logic
  const trackId = filters.trackId;
  const baseFilename = trackId ? `students_track_${trackId}` : "students_all";

  const handleExport = async (fmt) => {
    if (!trackId) {
      setShowTrackModal(true);
      return;
    }
    try {
      const svc =
        fmt === "csv"
          ? StudentService.exportStudentsCsv
          : StudentService.exportStudentsExcel;
      const blob = await svc(trackId);
      saveAs(blob, `${baseFilename}.${fmt}`);
    } catch (e) {
      alert(`Не удалось скачать ${fmt.toUpperCase()}: ${e.message}`);
    }
  };

  const openEdit = (u) => {
    setSelectedUser(u);
    setModalEditOpen(true);
  };
  const closeEdit = () => {
    setModalEditOpen(false);
    setSelectedUser(null);
  };
  const openDelete = (u) => {
    setSelectedUser(u);
    setModalDeleteOpen(true);
  };
  const closeDelete = () => {
    setModalDeleteOpen(false);
    setSelectedUser(null);
  };

  // build payload so that teamId lands in student.current_team_id
  const buildPayload = (current, changes) => {
    const p = {
      id: current.id,
      fio: current.fio,
      email: current.email,
      role: current.role,
      student: { ...(current.student || {}) },
      is_enabled: current.is_enabled,
      isRemindEnabled: current.isRemindEnabled,
    };
    Object.entries(changes).forEach(([k, v]) => {
      if (k === "teamId") {
        p.student.current_team_id = v;
      } else {
        p[k] = v;
      }
    });
    // clean up
    Object.entries(p).forEach(([k, v]) => {
      if (v == null) delete p[k];
    });
    if (p.student && Object.keys(p.student).length === 0) delete p.student;
    return p;
  };

  const handleSave = async (formData) => {
    if (!selectedUser) return;
    const payload = buildPayload(selectedUser, formData);
    await authStore.updateUser(payload);
    closeEdit();
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    await deleteUser(selectedUser.id);
    closeDelete();
  };

  if (loading) return <Loader />;
  if (error)
    return <ErrorModal message={error} onClose={() => authStore.setError(null)} />;

  return (
    <div className={styles.container}>
      <main className={styles.content}>
        {/* Filters & Export */}
        <div className={styles.sortPaginationControls}>
          {/* Search */}
          <div className={styles.controlBlock}>
            <label>Поиск:</label>
            <input
              type="text"
              placeholder="ФИО или почта…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {/* Role */}
          <div className={styles.controlBlock}>
            <label>Роль:</label>
            <select
              value={filters.role || ""}
              onChange={(e) =>
                updateFiltersHandler({ role: e.target.value })
              }
            >
              <option value="">Все</option>
              {roles.map((r) => (
                <option key={r.name} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          {/* Course */}
          <div className={styles.controlBlock}>
            <label>Курс:</label>
            <select
              value={filters.course ?? ""}
              onChange={(e) =>
                updateFiltersHandler({ course: +e.target.value || null })
              }
            >
              <option value="">Все</option>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          {/* Group */}
          <div className={styles.controlBlock}>
            <label>Группа:</label>
            <input
              type="number"
              placeholder="№"
              value={filters.groupNumber ?? ""}
              onChange={(e) =>
                updateFiltersHandler({
                  groupNumber: +e.target.value || null,
                })
              }
            />
          </div>
          {/* Enabled */}
          <div className={styles.controlBlock}>
            <label>Активность:</label>
            <select
              value={String(filters.isEnabled ?? "")}
              onChange={(e) =>
                updateFiltersHandler({
                  isEnabled:
                    e.target.value === ""
                      ? null
                      : e.target.value === "true",
                })
              }
            >
              <option value="">Все</option>
              <option value="true">Активные</option>
              <option value="false">Неактивные</option>
            </select>
          </div>
          {/* Track: сброс страницы и фильтрация */}
          <div className={styles.controlBlock}>
            <label>Трек:</label>
            <select
              value={filters.trackId ?? ""}
              onChange={(e) =>
                updateFiltersHandler({
                  trackId: +e.target.value || null,
                  page: 0,
                })
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
          <button
            className={styles.exportButton}
            onClick={() => handleExport("csv")}
          >
            📥 CSV
          </button>
          <button
            className={styles.exportButton}
            onClick={() => handleExport("xlsx")}
          >
            📥 Excel
          </button>
        </div>

        {/* DataTable */}
        <div className={styles.tableContainer}>
          <DataTable
            columns={[
              { key: "id", title: "ID" },
              { key: "fio", title: "ФИО" },
              { key: "email", title: "Email" },
              { key: "role", title: "Роль" },
              {
                key: "group_number",
                title: "Группа",
                render: (_, r) => r.student?.group_number || "—",
              },
              {
                key: "current_team_name",
                title: "Команда",
                render: (_, r) => r.student?.current_team_name || "—",
              },
              {
                key: "isEnabled",
                title: "Активен",
                render: (_, u) => (u.is_enabled ? "✅" : "❌"),
              },
              {
                key: "actions",
                title: "✏️",
                render: (_, u) => <button onClick={() => openEdit(u)}>✏️</button>,
              },
            ]}
            rows={displayed}
          />
        </div>

        {/* Pagination */}
        <div className={styles.pagination}>
          <button
            onClick={() =>
              updateFiltersHandler({ page: Math.max(0, filters.page - 1) })
            }
            disabled={filters.page === 0}
          >
            ← Назад
          </button>
          <span>
            Стр. {filters.page + 1} из {Math.ceil(total / filters.size)}
          </span>
          <button
            onClick={() =>
              updateFiltersHandler({
                page: Math.min(
                  Math.ceil(total / filters.size) - 1,
                  filters.page + 1
                ),
              })
            }
            disabled={filters.page + 1 >= Math.ceil(total / filters.size)}
          >
            Далее →
          </button>
        </div>
      </main>

      {/* Edit Modal */}
      {modalEditOpen && selectedUser && (
        <ModalForm
          show={modalEditOpen}
          title="Редактировать пользователя"
          initialData={{
            fio: selectedUser.fio,
            email: selectedUser.email,
            role: selectedUser.role,
            teamId: selectedUser.student?.current_team_id || "",
            is_enabled: selectedUser.is_enabled,
          }}
          fields={[
            { name: "fio", label: "ФИО", type: "text" },
            { name: "email", label: "Почта", type: "email" },
            {
              name: "role",
              label: "Роль",
              type: "select",
              options: roles.map((r) => ({ value: r.name, label: r.name })),
            },
            {
              name: "teamId",
              label: "Команда",
              type: "select",
              options: teams.map((t) => ({ value: t.id, label: t.name })),
            },
            { name: "is_enabled", label: "Активен", type: "checkbox" },
          ]}
          onSave={handleSave}
          onCancel={closeEdit}
        />
      )}

      {/* Delete Confirmation */}
      {modalDeleteOpen && selectedUser && (
        <ErrorModal
          message={`Удалить пользователя "${selectedUser.fio}"?`}
          onConfirm={handleDelete}
          onClose={closeDelete}
        />
      )}

      {/* Need track to export */}
      {showTrackModal && (
        <ErrorModal
          message="Чтобы скачать отчёт, выберите трек"
          onClose={() => setShowTrackModal(false)}
        />
      )}
    </div>
  );
});

export default UsersSection;
