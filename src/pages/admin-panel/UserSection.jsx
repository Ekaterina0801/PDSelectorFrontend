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
  const { users, total, filters, roles, loading, error } = authStore;
  const { teams } = teamStore;
  const { tracks } = trackStore;

  const [search, setSearch]       = useState(filters.fio || '');
  const [modalEditOpen, setModalEditOpen]     = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser]       = useState(null);
  const [showTrackModal, setShowTrackModal]   = useState(false);

  useEffect(() => {
    authStore.fetchRoles();
    authStore.fetchUsers();
    teamStore.fetchTeams();
    trackStore.fetchTracks();
  }, []);

  useEffect(() => {
    setSearch(filters.fio || '');
  }, [filters.fio]);

  const updateFilters = useCallback(diff => {
    authStore.setFilters({ ...filters, ...diff, size: 10 });
  }, [filters]);

  const displayed = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u =>
      u.fio.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  }, [users, search]);

  function openEdit(user) {
    setSelectedUser(user);
    setModalEditOpen(true);
  }
  function closeEdit() {
    setModalEditOpen(false);
    setSelectedUser(null);
  }

  function openDelete(user) {
    setSelectedUser(user);
    setModalDeleteOpen(true);
  }
  function closeDelete() {
    setModalDeleteOpen(false);
    setSelectedUser(null);
  }

  function buildPayload(current, changes) {
    const p = {
      id: current.id,
      fio: current.fio,
      email: current.email,
      role: current.role,
      student: current.student,
      teamId: current.student?.current_team_id ?? null,
      is_enabled: current.is_enabled,
      isRemindEnabled: current.isRemindEnabled,
      ...changes
    };
    Object.entries(p).forEach(([k,v]) => {
      if(v===undefined||v===null) delete p[k];
    });
    return p;
  }

  const handleSave = async formData => {
    if(!selectedUser) return;
    const payload = buildPayload(selectedUser, formData);
    await authStore.updateUser(payload);
    closeEdit();
  };

  const handleDelete = async () => {
    if(!selectedUser) return;
    await authStore.deleteUser(selectedUser.id);
    closeDelete();
  };

  const trackId = filters.trackId;
  const baseFilename = trackId ? `students_track_${trackId}` : 'students_all';

  const handleExportCsv = async () => {
    if(!trackId) { setShowTrackModal(true); return; }
    try {
      const blob = await StudentService.exportStudentsCsv(trackId);
      saveAs(blob, `${baseFilename}.csv`);
    } catch (e) {
      alert('Не удалось скачать CSV: ' + (e.message||''));
    }
  };

  const handleExportExcel = async () => {
    if(!trackId) { setShowTrackModal(true); return; }
    try {
      const blob = await StudentService.exportStudentsExcel(trackId);
      saveAs(blob, `${baseFilename}.xlsx`);
    } catch (e) {
      alert('Не удалось скачать Excel: ' + (e.message||''));
    }
  };

  if(loading) return <Loader />;
  if(error)   return <ErrorModal message={error} onClose={() => authStore.setError(null)} />;

  return (
    <div className={styles.container}>

      <main className={styles.content}>
        <div className={styles.sortPaginationControls}>
          <div className={styles.controlBlock}>
            <label>Поиск:</label>
            <input
              type="text"
              value={search}
              placeholder="ФИО или почта…"
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.controlBlock}>
            <label>Роль:</label>
            <select
              value={filters.role||''}
              onChange={e => updateFilters({ role: e.target.value, page:0 })}
            >
              <option value="">Все</option>
              {roles.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
            </select>
          </div>
          <div className={styles.controlBlock}>
            <label>Курс:</label>
            <select
              value={filters.course||''}
              onChange={e => updateFilters({ course:+e.target.value||null, page:0 })}
            >
              <option value="">Все</option>
              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className={styles.controlBlock}>
            <label>Группа:</label>
            <input
              type="number"
              placeholder="№"
              value={filters.groupNumber||''}
              onChange={e => updateFilters({ groupNumber:+e.target.value||null, page:0 })}
            />
          </div>
          <div className={styles.controlBlock}>
            <label>Активность:</label>
            <select
              value={String(filters.isEnabled ?? '')}
              onChange={e => updateFilters({ isEnabled:e.target.value===''?null:(e.target.value==='true'), page:0 })}
            >
              <option value="">Все</option>
              <option value="true">Активные</option>
              <option value="false">Неактивные</option>
            </select>
          </div>
          <div className={styles.controlBlock}>
            <label>Трек:</label>
            <select
              value={filters.trackId||''}
              onChange={e => updateFilters({ trackId:+e.target.value||null, page:0 })}
            >
              <option value="">Все</option>
              {tracks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <button
            className={styles.exportButton}
            onClick={handleExportCsv}
            disabled={loading}
          >📥 CSV</button>
          <button
            className={styles.exportButton}
            onClick={handleExportExcel}
            disabled={loading}
          >📥 Excel</button>
        </div>

        <DataTable
          columns={[
            { key:'id', title:'ID' },
            { key:'fio', title:'ФИО' },
            { key:'email', title:'Email' },
            { key:'role', title:'Роль' },
            {
              key:'group_number',
              title:'Группа',
              render:(_,r)=>r.student?.group_number||'—'
            },
            {
              key:'current_team_name',
              title:'Команда',
              render:(_,r)=>r.student?.current_team_name||'—'
            },
            {
              key:'isEnabled',
              title:'Активен',
              render:(_,u)=><>{u.is_enabled?'✅':'❌'}</>
            },
            {
              key:'actions',
              title:'Действия',
              render:(_,u)=>(
                <>
                  <button onClick={()=>openEdit(u)}>✏️</button>
                  <button onClick={()=>openDelete(u)}>🗑️</button>
                </>
              )
            }
          ]}
          rows={displayed}
        />

        <div className={styles.pagination}>
          <button
            onClick={()=>updateFilters({ page:Math.max(0, filters.page-1) })}
            disabled={filters.page===0}
          >← Назад</button>
          <span>Стр. {filters.page+1} из {Math.ceil(total/filters.size)}</span>
          <button
            onClick={()=>updateFilters({ page:Math.min(Math.ceil(total/filters.size)-1, filters.page+1) })}
            disabled={filters.page+1>=Math.ceil(total/filters.size)}
          >Далее →</button>
        </div>

        <div className={styles.bottomNav}>
          <button className={`${styles.navItem} ${!filters.trackId && styles.active}`} onClick={handleExportCsv}>
            <span className={styles.navIcon}>📥</span>
            <span className={styles.navLabel}>CSV</span>
          </button>
          <button className={styles.navItem} onClick={handleExportExcel}>
            <span className={styles.navIcon}>📥</span>
            <span className={styles.navLabel}>Excel</span>
          </button>
        </div>

        {modalEditOpen && (
          <ModalForm
            show={modalEditOpen}
            title="Редактировать пользователя"
            fields={[
              { name:'fio', label:'ФИО', type:'text' },
              { name:'email', label:'Почта', type:'email' },
              { name:'role', label:'Роль', type:'select', options:roles.map(r=>({value:r.name,label:r.name})) },
              { name:'teamId', label:'Команда', type:'select', options:teams.filter(t=>t.trackId===selectedUser?.student?.current_track_id).map(t=>({value:t.id,label:t.name})) }
            ]}
            initialData={{ fio:selectedUser?.fio,email:selectedUser?.email,role:selectedUser?.role,teamId:selectedUser?.student?.current_team_id||'' }}
            onSave={handleSave}
            onCancel={closeEdit}
          />
        )}

        {modalDeleteOpen && (
          <ErrorModal
            message={`Удалить пользователя ${selectedUser?.fio}?`}
            onConfirm={handleDelete}
            onClose={closeDelete}
          />
        )}

        {showTrackModal && (
          <ErrorModal
            message="Чтобы скачать отчёт, выберите на панели фильтров трек"
            imageUrl="/images/cat.png"
            onClose={() => setShowTrackModal(false)}
          />
        )}
      </main>
    </div>
  );
});

export default UsersSection;