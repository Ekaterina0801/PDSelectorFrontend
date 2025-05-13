import React, { useState, useEffect, useCallback, useMemo } from "react";
import { observer } from "mobx-react";
import styles from "./AdminDashboard.module.scss";
import { DataTable } from "../../components/data-table/DataTable";
import Loader from "../../components/spinner/Loader";
import trackStore from "../../stores/trackStore";
const TracksSection = observer(() => {
    const { tracks, loading, error, fetchTracks } = trackStore;
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('id,asc');
  
    useEffect(() => { fetchTracks(); }, []);
  
    const displayed = useMemo(() => {
      let arr = tracks;
      const q = search.trim().toLowerCase();
      if (q) arr = arr.filter(t => t.name.toLowerCase().includes(q));
      const [f,d] = sort.split(',');
      return [...arr].sort((a,b)=>{
        const va=(a[f]||'').toString().toLowerCase();
        const vb=(b[f]||'').toString().toLowerCase();
        return va<vb ? (d==='asc'?-1:1) : va>vb ? (d==='asc'?1:-1):0;
      });
    }, [tracks,search,sort]);
  
    const columns = [
      { key:'id', title:'ID' },
      { key:'name', title:'Название' },
    ];
  
    if (loading) return <Loader />;
    if (!loading && error) return <div className={styles.error}>{error}</div>;
  
    return (
      <>
        <div className={styles.controls}>
          <input
            placeholder="Поиск…"
            value={search}
            onChange={e=>setSearch(e.target.value)}
          />
          <select value={sort}
                  onChange={e=>setSort(e.target.value)}>
            <option value="id,asc">ID ↑</option>
            <option value="id,desc">ID ↓</option>
            <option value="name,asc">Название ↑</option>
            <option value="name,desc">Название ↓</option>
          </select>
        </div>
  
        <DataTable columns={columns} rows={displayed} />
      </>
    );
  });
  
  export default TracksSection;