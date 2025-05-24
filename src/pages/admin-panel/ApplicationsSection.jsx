import React, { useState, useEffect, useCallback, useMemo } from "react";
import { observer } from "mobx-react";
import styles from "./AdminDashboard.module.scss";
import { DataTable } from "../../components/data-table/DataTable";
import Loader from "../../components/spinner/Loader";
import applicationStore from "../../stores/applicationStore";
import trackStore from "../../stores/trackStore";

const ApplicationsSection = observer(() => {
  const { applications, error, page, size, sort, totalPages } =
    applicationStore;

  const { tracks } = trackStore;

  const [trackId, setTrackId] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    applicationStore.setPage(0);
  }, [trackId, status]);

  useEffect(() => {
 
      applicationStore.fetchApplications({
        track_id: trackId,
        status: status || null,
      });
  }, [trackId, page, size, sort, status]);

  const columns = [
    { key: "id", title: "ID" },
    {
      key: "student",
      title: "Студент",
      render: (_, a) => a.student?.fio ?? "—",
    },
    { key: "team", title: "Команда", render: (_, a) => a.team?.name ?? "—" },
    { key: "status", title: "Статус" },
  ];

  if (applicationStore.loading) {
    return <Loader />;
  }
  if (!applicationStore.loading && error)
    return <div className={styles.error}>{error}</div>;

  return (
    <>
      <div className={styles.controls}>
        <div className={styles.sortPaginationControls}>
          <div className={styles.controlBlock}>
            <label>Трек:</label>
            <select
              value={trackId ?? ""}
              onChange={(e) =>
                setTrackId(e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">Все треки</option>
              {tracks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.controlBlock}>
            <label>Статус:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Все статусы</option>
              <option value="SENT">Ожидает</option>
              <option value="ACCEPTED">Одобрено</option>
              <option value="REJECTED">Отклонено</option>
              <option value="CANCELLED">Отклонено</option>
            </select>
          </div>
          <div className={styles.controlBlock}>
            <label>Сортировка:</label>
            <select
              value={sort}
              onChange={(e) => applicationStore.setSort(e.target.value)}
            >
              <option value="id,asc">ID ↑</option>
              <option value="id,desc">ID ↓</option>
              <option value="student.user.fio,asc">Студент ↑</option>
              <option value="student.user.fio,desc">Студент ↓</option>
            </select>
          </div>
        </div>
      </div>

      <DataTable columns={columns} rows={applications} />

      <div className={styles.pagination}>
        <button
          onClick={() => applicationStore.setPage(page - 1)}
          disabled={page === 0}
        >
          Назад
        </button>
        <span>
          Страница {page + 1} из {totalPages || 1}
        </span>
        <button
          onClick={() => applicationStore.setPage(page + 1)}
          disabled={page >= totalPages - 1}
        >
          Далее
        </button>
      </div>
    </>
  );
});

export default ApplicationsSection;
