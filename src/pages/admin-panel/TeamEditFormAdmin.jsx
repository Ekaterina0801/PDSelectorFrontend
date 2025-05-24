import styles from "./TeamEditFormAdmin.module.scss";
import { useState, useEffect } from "react";
import Modal from "../../components/forms/modal/Modal";
import { FiTrash2 } from "react-icons/fi";
import { useMemo } from "react";
import { FiPlus } from "react-icons/fi";
import { observer } from "mobx-react";
import studentStore from "../../stores/studentStore";
import teamStore from "../../stores/teamStore";
import { has } from "lodash";
const TeamEditModalAdmin = observer(({
  show,
  onClose,
  onSave,
  tracks,
  projectTypes,
  team
}) => {
  const [name, setName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [track, setTrack] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [captain, setCaptain] = useState("");

  const { loading: studentsLoading, availableStudents } = studentStore;

  // При открытии/смене команды: инициализируем лок. стейт и красим availableStudents
  useEffect(() => {
    if (!team) return;
    setName(team.name || "");
    setProjectType(team.project_type?.id.toString() || "");
    const trackId = team.current_track?.toString() || "";
    setTrack(trackId);
    const initial = (team.students || []).map(s => s.id.toString());
    setTeamMembers(initial);
    const cap = team.captain?.id.toString() || "";
    setCaptain(initial.includes(cap) ? cap : "");

    if (trackId && team.id) {
      studentStore.fetchAvailableStudents({
        trackId: +trackId,
        teamId:  team.id
      });
    }
  }, [team]);

  // Смена трека: сброс участников/капитана + перезагрузка списка
  const onTrackChange = e => {
    const newTrack = e.target.value;
    setTrack(newTrack);
    setTeamMembers([]);
    setCaptain("");
    if (newTrack && team?.id) {
      studentStore.fetchAvailableStudents({
        trackId: +newTrack,
        teamId:  team.id
      });
    }
  };

  // CRUD участников
  const addMember    = () => setTeamMembers(ms => [...ms, ""]);
  const changeMember = (idx, val) => setTeamMembers(ms => ms.map((m,i) => i===idx?val:m));
  const removeMember = idx => {
    setTeamMembers(ms => {
      const upd = ms.filter((_,i) => i!==idx);
      if (!upd.includes(captain)) setCaptain("");
      return upd;
    });
  };

  // Опции для селекторов участников
  const availableMembers = availableStudents.map(u => ({
    id:  u.id.toString(),
    fio: u.user.fio
  }));

  const handleSubmit = () => {
    onSave({
      id:               team.id,
      name,
      project_description: "",
      project_type:     { id: +projectType },
      technologies:     [],
      captain_id:       +captain,
      studentIds:       teamMembers.filter(Boolean).map(id=>+id),
      current_track_id: +track
    });
  };

  if (!show) return null;

  return (
    <Modal show onClose={onClose} title={team.id ? "Редактирование команды" : "Новая команда"}>
      <div className={styles.form}>

        {/* Название */}
        <label className={styles.field}>
          Название
          <input value={name} onChange={e => setName(e.target.value)} />
        </label>

        {/* Тип проекта */}
        <label className={styles.field}>
          Тип проекта
          <select value={projectType} onChange={e => setProjectType(e.target.value)}>
            <option value="">— выберите тип —</option>
            {projectTypes.map(pt => (
              <option key={pt.id} value={pt.id.toString()}>
                {pt.name}
              </option>
            ))}
          </select>
        </label>

        {/* Трек */}
        <label className={styles.field}>
          Трек
          <select value={track} onChange={onTrackChange}>
            <option value="">— выберите трек —</option>
            {tracks.map(t => (
              <option key={t.id} value={t.id.toString()}>
                {t.name}
              </option>
            ))}
          </select>
        </label>

        {/* Участники */}
        <div className={styles.membersSection}>
          <div className={styles.sectionTitle}>Участники</div>
          {studentsLoading ? (
            <p>Загрузка участников…</p>
          ) : (
            <div className={styles.membersList}>
              {teamMembers.map((mId, idx) => (
                <div key={idx} className={styles.memberRow}>
                  <div className={styles.memberIndex}>{idx + 1}</div>
                  <select
                    className={styles.selectMember}
                    value={mId}
                    onChange={e => changeMember(idx, e.target.value)}
                  >
                    <option value="">— выберите участника —</option>
                    {availableMembers.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.fio}
                      </option>
                    ))}
                  </select>
                  <button onClick={() => removeMember(idx)} className={styles.trashBtn}>
                    <FiTrash2 />
                  </button>
                </div>
              ))}

              <button className={styles.addMemberBtn} onClick={addMember}>
                <FiPlus />
              </button>
            </div>
          )}
        </div>

        {/* Капитан */}
        <label className={styles.field}>
          Капитан команды
          <select
            value={captain}
            onChange={e => setCaptain(e.target.value)}
            disabled={!teamMembers.length}
          >
            <option value="">— выберите капитана —</option>
            {teamMembers.map(id => {
              const opt = availableMembers.find(u => u.id === id);
              return opt
                ? <option key={id} value={id}>{opt.fio}</option>
                : null;
            })}
          </select>
        </label>

        {/* Кнопки */}
        <div className={styles.actions}>
          <button
            className={styles.btnSave}
            onClick={handleSubmit}
            disabled={
              !name ||
              !projectType ||
              !track ||
              !captain ||
              teamMembers.some(m => !m)
            }
          >
            {team.id ? "Сохранить изменения" : "Создать команду"}
          </button>
          <button className={styles.btnCancel} onClick={onClose}>
            Отменить
          </button>
        </div>
      </div>
    </Modal>
  );
});

export default TeamEditModalAdmin;



