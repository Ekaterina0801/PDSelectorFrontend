import React, { useState, useEffect, useCallback, useMemo } from "react";
import { observer } from "mobx-react";
import styles from "./AdminDashboard.module.scss";
import { DataTable } from "../../components/data-table/DataTable";
import Loader from "../../components/spinner/Loader";
import applicationStore from "../../stores/applicationStore";
import ErrorModal from "../../components/error-display/ErrorDisplay";

const ApplicationsSection = observer(() => {
    const { applications, loading, error, fetchApplications } = applicationStore;
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [sort, setSort] = useState('id,asc');
  
    useEffect(() => { fetchApplications(); }, []);
  
    const displayed = useMemo(() => {
      let arr = applications;
      console.log("applications: ", applications);
      const q = search.trim().toLowerCase();
      if (q) arr = arr.filter(a=>
        a.student?.fio.toLowerCase().includes(q) ||
        a.team?.name.toLowerCase().includes(q)
      );
      if (status) arr = arr.filter(a=>a.status===status);
      const [f,d] = sort.split(',');
      return [...arr].sort((a,b)=>{
        const va = ((f==='student'?a.student?.fio:
                    f==='team'?a.team?.name:
                    f==='status'?a.status:
                    a[f])||'').toString().toLowerCase();
        const vb = ((f==='student'?b.student?.fio:
                    f==='team'?b.team?.name:
                    f==='status'?b.status:
                    b[f])||'').toString().toLowerCase();
        return va<vb ? (d==='asc'?-1:1) : va>vb ? (d==='asc'?1:-1):0;
      });
    }, [applications,search,status,sort]);
  
    const columns = [
      { key:'id', title:'ID' },
      { key:'student', title:'Студент', render:(_,a)=>a.student?.fio ?? '—' },
      { key:'team', title:'Команда', render:(_,a)=>a.team?.name ?? '—' },
      { key:'status', title:'Статус' },
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
          <label>Поиск:</label>
            <input
              placeholder="Поиск…"
              value={search}
              onChange={e=>setSearch(e.target.value)}
            />
          </div>
          <div className={styles.controlBlock}>
          <label>Тип статуса:</label>
            <select value={status}
                    onChange={e=>setStatus(e.target.value)}>
              <option value="">Все статусы</option>
              {['PENDING','APPROVED','REJECTED'].map(s=>
                <option key={s} value={s}>{s}</option>
              )}
            </select>
          </div>
          <div className={styles.controlBlock}>
          <label>Сортировка:</label>
            <select value={sort}
                    onChange={e=>setSort(e.target.value)}>
              <option value="id,asc">ID ↑</option>
              <option value="id,desc">ID ↓</option>
              <option value="student,asc">Студент ↑</option>
              <option value="student,desc">Студент ↓</option>
            </select>
          </div>
        </div>
        <DataTable
          columns={columns}
          rows={displayed}
          renderRowActions={a=>(
            <>
              <button onClick={()=>applicationStore.approve(a.id)}>✔️</button>
              <button onClick={()=>applicationStore.reject(a.id)}>✖️</button>
            </>
          )}
        />
      </>
    );
  });
  
  export default ApplicationsSection;