import styles from "./TeamEditFormAdmin.module.scss";
import { useState, useEffect } from "react";
import Modal from "../../components/forms/modal/Modal";
import { FiTrash2 } from "react-icons/fi";
import { useMemo } from "react";
import { FiPlus } from "react-icons/fi";
import { observer } from "mobx-react";
import studentStore from "../../stores/studentStore";
const TeamEditModalAdmin = observer(({
  show, onClose, onSave,
  tracks, projectTypes, team
}) => {
  const [name, setName]               = useState("");
  const [projectType, setProjectType] = useState("");
  const [track, setTrack]             = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [captain, setCaptain]         = useState("");

  const { loading, availableStudents } = studentStore;

  // 1) заполнение всех полей при монтировании/смене team
  useEffect(() => {
    if (!team) return;

    setName(team.name || "");
    setProjectType(team.project_type?.id.toString() || "");

    const tId = team.current_track?.toString() || "";
    setTrack(tId);

    const memberIds = (team.students || []).map(s => s.id.toString());
    setTeamMembers(memberIds);

    const capId = team.captain?.id.toString() || "";
    setCaptain(memberIds.includes(capId) ? capId : "");

    if (tId && team.id) {
      studentStore.fetchAvailableStudents({ trackId: +tId, teamId: team.id });
    }
  }, [team]);

  // 2) реагируем на смену трека
  useEffect(() => {
    if (!track || !team?.id) return;

    // всегда перезагружаем пул свободных/текущих студентов
    studentStore.fetchAvailableStudents({ trackId: +track, teamId: team.id });

    // если это исходный трек — восстанавливаем старых участников
    if (track === team.current_track?.toString()) {
      const original = (team.students || []).map(s => s.id.toString());
      setTeamMembers(original);
      const capId = team.captain?.id.toString() || "";
      setCaptain(original.includes(capId) ? capId : "");
    }

  }, [track, team]);

  const onTrackChange = e => {
    setTrack(e.target.value);
    setTeamMembers([]);
    setCaptain("");
  };

  const addMember    = () => setTeamMembers(ms => [...ms, ""]);
  const changeMember = (i,v) => setTeamMembers(ms => ms.map((m,idx)=>idx===i?v:m));
  const removeMember = i => setTeamMembers(ms => {
    const upd = ms.filter((_,idx)=>idx!==i);
    if (!upd.includes(captain)) setCaptain("");
    return upd;
  });

  const options = availableStudents.map(u=>({
    id: u.id.toString(), fio: u.user.fio
  }));

  const handleSubmit = () => {
    console.log('team', team);
    onSave({
      id:                 team.id,
      name,
      project_description: team.project_description || "",
      project_type:       { id: +projectType },
      technologies:       team.technologies || [],
      captain_id:         +captain,
      studentIds:         teamMembers.filter(Boolean).map(id=>+id),
      current_track_id:   +track
    });
  };

  if (!show) return null;

  return (
    <Modal show onClose={onClose}
           title={team.id ? "Редактирование команды" : "Новая команда"}>
      <div className={styles.form}>
        {/* Название */}
        <label className={styles.field}>
          Название
          <input value={name}
                 onChange={e=>setName(e.target.value)}/>
        </label>

        {/* Тип проекта */}
        <label className={styles.field}>
          Тип проекта
          <select value={projectType}
                  onChange={e=>setProjectType(e.target.value)}>
            <option value="">— выберите тип —</option>
            {projectTypes.map(pt=>(
              <option key={pt.id} value={pt.id.toString()}>
                {pt.name}
              </option>
            ))}
          </select>
        </label>

        {/* Трек */}
        <label className={styles.field}>
          Трек
          <select value={track}
                  onChange={onTrackChange}>
            <option value="">— выберите трек —</option>
            {tracks.map(ti=>(
              <option key={ti.id} value={ti.id.toString()}>
                {ti.name}
              </option>
            ))}
          </select>
        </label>

        {/* Участники */}
        <div className={styles.membersSection}>
          <div className={styles.sectionTitle}>Участники</div>
          {loading
            ? <p>Загрузка…</p>
            : <div className={styles.membersList}>
                {teamMembers.map((mId,idx)=>(
                  <div key={idx} className={styles.memberRow}>
                    <div className={styles.memberIndex}>{idx+1}</div>
                    <select value={mId}
                            onChange={e=>changeMember(idx,e.target.value)}
                            className={styles.selectMember}>
                      <option value="">— выберите участника —</option>
                      {options.map(o=>(
                        <option key={o.id} value={o.id}>{o.fio}</option>
                      ))}
                    </select>
                    <button onClick={()=>removeMember(idx)}
                            className={styles.trashBtn}>
                      <FiTrash2/>
                    </button>
                  </div>
                ))}
                <button onClick={addMember}
                        className={styles.addMemberBtn}>
                  <FiPlus/>
                </button>
              </div>
          }
        </div>

        {/* Капитан */}
        <label className={styles.field}>
          Капитан команды
          <select value={captain}
                  onChange={e=>setCaptain(e.target.value)}
                  disabled={!teamMembers.length}>
            <option value="">— выберите капитана —</option>
            {teamMembers.map(id=>{
              const opt = options.find(x=>x.id===id);
              return opt
                ? <option key={id} value={id}>{opt.fio}</option>
                : null;
            })}
          </select>
        </label>

        {/* Кнопки */}
        <div className={styles.actions}>
          <button className={styles.btnSave}
                  onClick={handleSubmit}
                  disabled={
                    !name||
                    !projectType||
                    !track||
                    !captain||
                    teamMembers.some(m=>!m)
                  }>
            {team.id ? "Сохранить изменения" : "Создать команду"}
          </button>
          <button className={styles.btnCancel}
                  onClick={onClose}>
            Отменить
          </button>
        </div>
      </div>
    </Modal>
  );
});

export default TeamEditModalAdmin;
