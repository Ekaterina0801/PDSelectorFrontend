import React, { useState, useEffect, useCallback, useMemo } from "react";
import { observer } from "mobx-react";
import styles from "./AdminDashboard.module.scss";
import { DataTable } from "../../components/data-table/DataTable";
import Loader from "../../components/spinner/Loader";
import trackStore from "../../stores/trackStore";
import TrackEditModal from "./TrackEditModal";
import ErrorModal from "../../components/error-display/ErrorDisplay";
const TracksSection = observer(() => {
  const {
    tracks,
    track: currentTrack,
    loading,
    error,
    fetchTracks,
    fetchTrackById,
    createTrack,
    updateTrack,
    deleteTrack,
    clearTrack,
  } = trackStore;

  const [search, setSearch] = useState('');
  const [sort, setSort]     = useState('id,asc');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  const displayed = useMemo(() => {
    let arr = tracks.slice();
    const q = search.trim().toLowerCase();
    if (q) arr = arr.filter(t => t.name.toLowerCase().includes(q));
    const [field, dir] = sort.split(',');
    return arr.sort((a, b) => {
      const va = ('' + (a[field] ?? '')).toLowerCase();
      const vb = ('' + (b[field] ?? '')).toLowerCase();
      if (va < vb) return dir === 'asc' ? -1 : 1;
      if (va > vb) return dir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [tracks, search, sort]);

  const columns = [
    { key: 'id',   title: 'ID' },
    { key: 'name', title: 'Название' },
    {
      key: 'startDate',
      title: 'Дата начала',
      render: (_, t) => {
        const sd = t.startDate;
        if (Array.isArray(sd) && sd.length >= 3) {
          const [y, m, d] = sd;
          return new Date(y, m - 1, d).toLocaleDateString();
        }
        return '—';
      }
    },
    {
      key: 'endDate',
      title: 'Дата окончания',
      render: (_, t) => {
        const ed = t.endDate;
        if (Array.isArray(ed) && ed.length >= 3) {
          const [y, m, d] = ed;
          return new Date(y, m - 1, d).toLocaleDateString();
        }
        return '—';
      }
    },
    { key: 'about', title: 'Описание', render: (_, t) => t.about || '—' },
    { key: 'minConstraint',             title: 'Min участников' },
    { key: 'maxConstraint',             title: 'Max участников' },
    { key: 'maxSecondCourseConstraint', title: 'Max 2-го курса' },
    { key: 'type',                      title: 'Тип обучения' },
  ];

  if (loading) return <Loader />;
  if (!loading && error) return (
    <ErrorModal
      message={error}
      onClose={() => teamStore.setError(null)}
    />
  );

  return (
    <>
      <div className={styles.sortPaginationControls}>
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
          <label>Сортировка:</label>
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="id,asc">ID ↑</option>
            <option value="id,desc">ID ↓</option>
            <option value="name,asc">Название ↑</option>
            <option value="name,desc">Название ↓</option>
          </select>
        </div>

        <div className={styles.controlBlock}>
          <button
            onClick={() => {
              clearTrack();
              setCreating(true);
            }}
          >
            + Новый трек
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={displayed}
        renderRowActions={t => (
          <>
            <button
              onClick={async () => {
                await fetchTrackById(t.id);
                setCreating(false);
              }}
            >
              ✏️
            </button>
            <button
              onClick={() => {
                const confirmed = window.confirm(
                  `Вы уверены, что хотите удалить трек "${t.name}"?`
                );
                if (confirmed) {
                  deleteTrack(t.id);
                }
              }}
            >
              🗑️
            </button>
          </>
        )}
      />

      <TrackEditModal
        key={creating ? 'new' : currentTrack?.id ?? 'new'}
        show={creating || !!currentTrack?.id}
        track={creating ? {} : currentTrack}
        onClose={() => {
          clearTrack();
          setCreating(false);
        }}
        onSave={async data => {
          if (data.id) {
            await updateTrack(data, data.id);
          } else {
            await createTrack(data);
          }
          clearTrack();
          setCreating(false);
          await fetchTracks();
        }}
      />
    </>
  );
});

export default TracksSection;