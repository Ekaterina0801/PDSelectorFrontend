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
const TeamsSection = observer(() => {
  const navigate = useNavigate()
  const { teams, total, loading, error, allFilters, filters } = teamStore
  const { tracks, fetchTracks } = trackStore

  const [search, setSearch] = useState('')
  const [sort, setSort]     = useState('id,asc')
  const [showTrackModal, setShowTrackModal] = useState(false)

  useEffect(() => {
    fetchTracks()
  }, [fetchTracks])

  useEffect(() => {
    if (filters.trackId != null) {
      teamStore.fetchFilters(filters.trackId)
    }
    teamStore.fetchTeams({ ...filters, searchTerm: search, sort })
  }, [filters.trackId, filters.page, filters.size, search, sort])

  const displayed = useMemo(() => {
    let arr = teams
    const q = search.trim().toLowerCase()
    if (q) arr = arr.filter(t => t.name.toLowerCase().includes(q))
    const [field, dir] = sort.split(',')
    return [...arr].sort((a, b) => {
      const va = (a[field] ?? '').toString().toLowerCase()
      const vb = (b[field] ?? '').toString().toLowerCase()
      if (va < vb) return dir === 'asc' ? -1 : 1
      if (va > vb) return dir === 'asc' ? 1 : -1
      return 0
    })
  }, [teams, search, sort])

  const updateFilter = useCallback((key, value) => {
    teamStore.setFilters({ ...filters, [key]: value, page: 0 })
  }, [filters])

  const handleExportCsv = async () => {
    if (!filters.trackId) {
      setShowTrackModal(true)
      return
    }
    try {
      const blob = await TeamService.exportTeamsCsv(filters.trackId)
      saveAs(blob, `teams_track_${filters.trackId}.csv`)
    } catch (e) {
      console.error('Export CSV error:', e)
      alert('Не удалось скачать CSV')
    }
  }

  const handleExportExcel = async () => {
    if (!filters.trackId) {
      setShowTrackModal(true)
      return
    }
    try {
      const blob = await TeamService.exportTeamsExcel(filters.trackId)
      saveAs(blob, `teams_track_${filters.trackId}.xlsx`)
    } catch (e) {
      console.error('Export Excel error:', e)
      alert('Не удалось скачать Excel')
    }
  }

  if (loading) return <Loader />
  if (error) return <div className={styles.error}>{error}</div>

  return (
    <>
      <div className={styles.sortPaginationControls}>
        {/* Filters */}
        <div className={styles.controlBlock}>
          <label>Трек:</label>
          <select
            value={filters.trackId ?? ''}
            onChange={e => updateFilter('trackId', e.target.value === '' ? null : +e.target.value)}
          >
            <option value="">Все</option>
            {tracks.map(t => (
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
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.controlBlock}>
          <label>Полнота:</label>
          <select
            value={filters.isFull ?? ''}
            onChange={e => updateFilter('isFull', e.target.value === '' ? null : e.target.value === 'true')}
          >
            <option value="">Все</option>
            <option value="true">Полные</option>
            <option value="false">Частичные</option>
          </select>
        </div>
        <div className={styles.controlBlock}>
          <label>Тип проекта:</label>
          <select
            value={filters.projectType ?? ''}
            onChange={e => updateFilter('projectType', e.target.value || null)}
          >
            <option value="">Все</option>
            {allFilters.projectTypes?.map(pt => (
              <option key={pt.id} value={pt.name}>{pt.name}</option>
            ))}
          </select>
        </div>
        <div className={styles.controlBlock}>
          <label>Сортировка:</label>
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="id,asc">ID ↑</option>
            <option value="id,desc">ID ↓</option>
            <option value="name,asc">Название ↑</option>
            <option value="name,desc">Название ↓</option>
          </select>
        </div>
        {/* Export Buttons */}
        <div className={styles.controlBlock}>
          <button onClick={handleExportCsv} disabled={loading}>📥 CSV</button>
          <button onClick={handleExportExcel} disabled={loading}>📥 Excel</button>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'id', title: 'ID' },
          { key: 'name', title: 'Название' },
          { key: 'projectType', title: 'Тип проекта', render: (_, t) => t.project_type?.name ?? '—' },
          { key: 'captain', title: 'Капитан', render: (_, t) => t.captain?.user.fio ?? '—' },
        ]}
        rows={displayed}
        renderRowActions={t => (
          <>
            <button onClick={() => navigate(`/teams/${t.id}`)} title="Редактировать">✏️</button>
            <button onClick={() => teamStore.deleteTeam(t.id)} title="Удалить">🗑️</button>
          </>
        )}
      />

      <div className={styles.pagination}>
        <button onClick={() => updateFilter('page', Math.max(0, filters.page - 1))} disabled={filters.page === 0}>← Назад</button>
        <span>Стр. {filters.page + 1} из {Math.ceil(total / filters.size)}</span>
        <button onClick={() => updateFilter('page', Math.min(Math.ceil(total / filters.size) - 1, filters.page + 1))} disabled={filters.page + 1 >= Math.ceil(total / filters.size)}>Далее →</button>
      </div>

      {showTrackModal && (
        <ErrorModal
          message="Чтобы скачать отчёт, выберите на панели фильтров трек"
          imageUrl="/images/cat.png"
          onClose={() => setShowTrackModal(false)}
        />
      )}
    </>
  )
})

export default TeamsSection
