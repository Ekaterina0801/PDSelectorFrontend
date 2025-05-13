import React, { useState, useEffect, useCallback, useMemo } from "react";
import { observer } from "mobx-react";
import styles from "./AdminDashboard.module.scss";
import { DataTable } from "../../components/data-table/DataTable";
import Loader from "../../components/spinner/Loader";
import teamStore from "../../stores/teamStore";
import ErrorModal from "../../components/error-display/ErrorDisplay";
import trackStore from "../../stores/trackStore";

const TeamsSection = observer(() => {
    const { teams, total, loading, error, allFilters, filters } = teamStore;
    const { tracks, fetchTracks } = trackStore;
  
    // Локальные состояния поиска и сортировки
    const [search, setSearch] = useState('');
    const [sort,   setSort]   = useState('id,asc');
  
    // Подгружаем список треков один раз
    useEffect(() => {
      fetchTracks();
    }, [fetchTracks]);
  
    // При изменении фильтров/page/search/sort — обновляем
    useEffect(() => {
      // Если выбран конкретный трек — подгружаем его фильтры
      if (filters.trackId != null) {
        teamStore.fetchFilters(filters.trackId);
      }
      // А вот команд всегда грузим (без trackId при null — значит “все”)
      teamStore.fetchTeams({
        ...filters,
        searchTerm: search,
        sort,
      });
    }, [
      filters.trackId,
      filters.page,
      filters.size,
      search,
      sort,
    ]);
  
    // Клиентская фильтрация + сортировка по уже загруженному списку
    const displayed = useMemo(() => {
      let arr = teams;
      const q = (search || '').trim().toLowerCase();
      if (q) {
        arr = arr.filter(t => t.name.toLowerCase().includes(q));
      }
      const [f, d] = (sort || 'id,asc').split(',');
      return [...arr].sort((a, b) => {
        const va = (a[f] ?? '').toString().toLowerCase();
        const vb = (b[f] ?? '').toString().toLowerCase();
        if (va < vb) return d === 'asc' ? -1 : 1;
        if (va > vb) return d === 'asc' ? 1 : -1;
        return 0;
      });
    }, [teams, search, sort]);
  
    // Хелпер для смены любого фильтра (и сброса страницы)
    const updateFilter = useCallback((key, value) => {
      teamStore.setFilters({ ...filters, [key]: value, page: 0 });
    }, [filters]);
  
    if (loading) return <Loader />;
    if (error)   return <div className={styles.error}>{error}</div>;
  
    return (
      <>
        <div className={styles.sortPaginationControls}>
  
          {/* Трек */}
          <div className={styles.controlBlock}>
            <label>Трек:</label>
            <select
              value={filters.trackId ?? ''}
              onChange={e =>
                updateFilter(
                  'trackId',
                  e.target.value === '' ? null : Number(e.target.value)
                )
              }
            >
              <option value="">Все</option>
              {tracks.map(tr => (
                <option key={tr.id} value={tr.id}>
                  {tr.name}
                </option>
              ))}
            </select>
          </div>
  
          {/* По названию */}
          <div className={styles.controlBlock}>
            <label>По названию:</label>
            <input
              type="text"
              placeholder="Название…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
  
          {/* Полнота */}
          <div className={styles.controlBlock}>
            <label>Полнота:</label>
            <select
              value={filters.isFull ?? ''}
              onChange={e =>
                updateFilter(
                  'isFull',
                  e.target.value === '' ? null : e.target.value === 'true'
                )
              }
            >
              <option value="">Все</option>
              <option value="true">Полные</option>
              <option value="false">Частичные</option>
            </select>
          </div>
  
          {/* Тип проекта */}
          <div className={styles.controlBlock}>
            <label>Тип проекта:</label>
            <select
              value={filters.projectType ?? ''}
              onChange={e =>
                updateFilter('projectType', e.target.value || null)
              }
            >
              <option value="">Все</option>
              {allFilters.projectTypes?.map(pt => (
                <option key={pt.id} value={pt.name}>
                  {pt.name}
                </option>
              ))}
            </select>
          </div>
  
          {/* Сортировка */}
          <div className={styles.controlBlock}>
            <label>Сортировка:</label>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="id,asc">ID ↑</option>
              <option value="id,desc">ID ↓</option>
              <option value="name,asc">Название ↑</option>
              <option value="name,desc">Название ↓</option>
            </select>
          </div>
  
        </div>
  
        <DataTable
          columns={[
            { key: 'id',   title: 'ID' },
            { key: 'name', title: 'Название' },
            {
              key: 'projectType',
              title: 'Тип проекта',
              render: (_, t) => t.projectType?.name ?? '—',
            },
            {
              key: 'captain',
              title: 'Капитан',
              render: (_, t) => t.captain?.fio ?? '—',
            },
          ]}
          rows={displayed}
          renderRowActions={t => (
            <>
              <button onClick={() => teamStore.edit(t.id)}>✏️</button>
              <button onClick={() => teamStore.remove(t.id)}>🗑️</button>
            </>
          )}
        />
  
        {/* Пагинация */}
        <div className={styles.pagination}>
          <button
            onClick={() => updateFilter('page', Math.max(0, filters.page - 1))}
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
                'page',
                Math.min(
                  Math.ceil(total / filters.size) - 1,
                  filters.page + 1
                )
              )
            }
            disabled={filters.page + 1 >= Math.ceil(total / filters.size)}
          >
            Далее →
          </button>
        </div>
      </>
    );
  });
  
  export default TeamsSection;