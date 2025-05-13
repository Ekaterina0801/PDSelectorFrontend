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
const UsersSection = observer(() => {
    // === Данные из сторов ===
    const { users, total, filters, roles, loading, error } = authStore;
    const { teams } = teamStore;
    const { tracks } = trackStore;
  
    // === Локальные стейты ===
    const [search, setSearch]       = useState(filters.fio || '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing]     = useState(null);
  
    // === Первичная загрузка ===
    useEffect(() => {
      authStore.fetchRoles();
      authStore.fetchUsers();
      teamStore.fetchTeams();
      trackStore.fetchTracks();
    }, []);
  
    // синхронизируем локальный поиск с фильтром из стора
    useEffect(() => {
      setSearch(filters.fio || '');
    }, [filters.fio]);
  
    // обновление фильтров
    const updateFilters = useCallback(diff => {
      authStore.setFilters({ ...filters, ...diff, size: 10 });
    }, [filters]);
  
    // клиентский live-search
    const displayed = useMemo(() => {
      const q = search.trim().toLowerCase();
      if (!q) return users;
      return users.filter(u =>
        u.fio.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    }, [users, search]);
  
    // открытие/закрытие модалки
    const openEdit  = user => { setEditing(user); setModalOpen(true); };
    const closeEdit = ()   => { setEditing(null); setModalOpen(false); };
  
    // строим полный payload из user + overrides
    function buildPayload(current, changes) {
        // Берём из UI (или из того, что мы редактируем) именно те поля,
        // что лежат в current
        const payload = {
          id:               current.id,
          fio:              current.fio,
          email:            current.email,
          role:             current.role,   
          student: current.student,                
          teamId:           current.student?.current_team_id ?? null,
          is_enabled:        current.is_enabled,                  // булево из UI
          isRemindEnabled:  current.isRemindEnabled,            // булево
        };
      
        // Накатываем изменения из формы / клик-тоггла
        Object.assign(payload, changes);
      
        // Пропускаем undefined/null-поле, если нужно
        Object.entries(payload).forEach(([k, v]) => {
          if (v === undefined || v === null) delete payload[k];
        });
      
        return payload;
      }
  
    // onSave для формы редактирования
    const handleSave = async formData => {
      if (!editing) return;
      const payload = buildPayload(editing, formData);
      await authStore.updateUser(payload);
      closeEdit();
    };
  
    // переключить активность
    const toggleEnabled = async user => {
      const payload = buildPayload(user, { is_enabled: !user.is_enabled });
      console.log("toggleEnabled", payload);
      await authStore.updateUser(payload);
    };
  
    // столбцы таблицы
    const columns = [
      { key: "id",    title: "ID" },
      { key: "fio",   title: "ФИО" },
      { key: "course", title: "Курс",
        render: (_, r) => r.student?.course ?? "—"
      },
      { key: "group_number", title: "Группа",
        render: (_, r) => r.student?.group_number ?? "—"
      },
      { key: "current_team_name", title: "Команда",
        render: (_, r) => r.student?.current_team_name ?? "—"
      },
      { key: "role",  title: "Роль" },
      { key: "email", title: "Почта" },
      {
        key: "isEnabled", title: "Активен",
        render: (_, u) => (
          <button
            onClick={() => toggleEnabled(u)}
            title={u.is_enabled ? "Отключить" : "Включить"}
          >
            {u.is_enabled ? "✅" : "❌"}
          </button>
        )
      }
    ];
  
    // поля формы
    const fields = [
      { name: "fio",   label: "ФИО",   type: "text" },
      { name: "email", label: "Почта", type: "email" },
      {
        name: "role", label: "Роль", type: "select",
        options: roles.map(r => ({ value: r.name, label: r.name }))
      },
      {
        name: "teamId", label: "Команда", type: "select",
        options: teams
          .filter(t => t.trackId === editing?.student?.current_team_id)
          .map(t => ({ value: t.id, label: t.name }))
      }
    ];
  
    if (loading) return <Loader />;
    if (error)   return <ErrorModal message={error} onClose={() => authStore.setError(null)} />;
  
    return (
      <>
        <div className={styles.sortPaginationControls}>
          {/* Поиск */}
          <div className={styles.controlBlock}>
            <label>Поиск:</label>
            <input
              type="text"
              value={search}
              placeholder="ФИО или почта…"
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {/* Роль */}
          <div className={styles.controlBlock}>
            <label>Роль:</label>
            <select
              value={filters.role||''}
              onChange={e => updateFilters({ role: e.target.value, page: 0 })}
            >
              <option value="">Все</option>
              {roles.map(r =>
                <option key={r.name} value={r.name}>{r.name}</option>
              )}
            </select>
          </div>
          {/* Курс */}
          <div className={styles.controlBlock}>
            <label>Курс:</label>
            <select
              value={filters.course||''}
              onChange={e => updateFilters({ course: +e.target.value||null, page:0 })}
            >
              <option value="">Все</option>
              {[1,2,3,4,5,6].map(n =>
                <option key={n} value={n}>{n}</option>
              )}
            </select>
          </div>
          {/* Группа */}
          <div className={styles.controlBlock}>
            <label>Группа:</label>
            <input
              type="number"
              placeholder="№"
              value={filters.groupNumber||''}
              onChange={e => updateFilters({ groupNumber: +e.target.value||null, page:0 })}
            />
          </div>
          {/* Активность */}
          <div className={styles.controlBlock}>
            <label>Активность:</label>
            <select
              value={String(filters.isEnabled ?? '')}
              onChange={e => updateFilters({
                isEnabled: e.target.value==='' ? null : (e.target.value==='true'),
                page:0
              })}
            >
              <option value="">Все</option>
              <option value="true">Активные</option>
              <option value="false">Неактивные</option>
            </select>
          </div>
          {/* Трек */}
          <div className={styles.controlBlock}>
            <label>Трек:</label>
            <select
              value={filters.trackId||''}
              onChange={e => updateFilters({ trackId: +e.target.value||null, page:0 })}
            >
              <option value="">Все</option>
              {tracks.map(t =>
                <option key={t.id} value={t.id}>{t.name}</option>
              )}
            </select>
          </div>
          {/* Сортировка */}
          <div className={styles.controlBlock}>
            <label>Сортировка:</label>
            <select
              value={filters.sort}
              onChange={e => updateFilters({ sort: e.target.value, page:0 })}
            >
              <option value="fio,asc">ФИО ↑</option>
              <option value="fio,desc">ФИО ↓</option>
              <option value="id,asc">ID ↑</option>
              <option value="id,desc">ID ↓</option>
            </select>
          </div>
        </div>
  
        <DataTable
          columns={columns}
          rows={displayed}
          renderRowActions={u => (
            <>
              <button onClick={() => openEdit(u)}>✏️</button>
              <button onClick={() => authStore.deleteUser(u.id)}>🗑️</button>
            </>
          )}
        />
  
        <div className={styles.pagination}>
          <button
            onClick={() => updateFilters({ page: Math.max(0, filters.page - 1) })}
            disabled={filters.page === 0}
          >← Назад</button>
          <span>
            Стр. {filters.page + 1} из {Math.ceil(total / filters.size)}
          </span>
          <button
            onClick={() => updateFilters({
              page: Math.min(Math.ceil(total / filters.size) - 1, filters.page + 1)
            })}
            disabled={filters.page + 1 >= Math.ceil(total / filters.size)}
          >Далее →</button>
        </div>
  
        <ModalForm
          show={modalOpen}
          title="Редактировать пользователя"
          fields={fields}
          initialData={{
            fio:    editing?.fio,
            email:  editing?.email,
            role:   editing?.role,
            teamId: editing?.student?.current_team_id ?? ''
          }}
          onSave={handleSave}
          onCancel={closeEdit}
        />
      </>
    );
  });
  
  export default UsersSection;