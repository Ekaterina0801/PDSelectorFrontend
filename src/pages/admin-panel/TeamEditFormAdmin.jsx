import styles from "./TeamEditFormAdmin.module.scss";
import { useState, useEffect } from "react";
import Modal from "../../components/forms/modal/Modal";
import { FiTrash2 } from "react-icons/fi";
import { useMemo } from "react";
import { FiPlus } from "react-icons/fi";
import { observer } from "mobx-react";
import studentStore from "../../stores/studentStore";
import teamStore from "../../stores/teamStore";
const TeamEditModalAdmin = observer(
  ({ show, onClose, onSave, tracks, projectTypes, team }) => {
    const [name, setName] = useState("");
    const [projectType, setProjectType] = useState("");
    const [captain, setCaptain] = useState("");
    const [track, setTrack] = useState("");
    const [members, setMembers] = useState([]);

    const { loading: studentsLoading, students } = studentStore;

    useEffect(() => {
      if (!team) return;

      setName(team.name || "");
      setProjectType(team.project_type?.id.toString() || "");
      setCaptain(team.captain?.user.id.toString() || "");
      const trackId = team.current_track?.toString() || "";
      setTrack(trackId);
      setMembers((team.students || []).map((s) => s.user.id.toString()));
      if (trackId) {
        studentStore.fetchStudents({ trackId: +trackId });
      }
    }, [team]);

    const onTrackChange = (e) => {
      const newTrack = e.target.value;
      setTrack(newTrack);
      setMembers([]);
      setCaptain("");
      if (newTrack) {
        studentStore.fetchStudents({ trackId: +newTrack });
      }
    };

    const addMember = () => setMembers((ms) => [...ms, ""]);
    const changeMember = (idx, val) =>
      setMembers((ms) => ms.map((m, i) => (i === idx ? val : m)));
    const removeMember = (idx) =>
      setMembers((ms) => ms.filter((_, i) => i !== idx));

    const handleSubmit = () => {
        const payload = {
          id: team.id,
          name,
          project_description: "",      
          project_type: { id: +projectType },
          technologies: [],            
          captain_id: +captain,
          studentIds: members
            .filter(Boolean)
            .map((m) => +m),
          current_track_id: +track,
        };
        onSave(payload);
      };
      

    if (!show) return null;
    console.log("students", students);

    return (
      <Modal
        show
        onClose={onClose}
        title={team.id ? "Редактирование команды" : "Новая команда"}
      >
        <div className={styles.form}>
          {/* Название */}
          <label className={styles.field}>
            Название
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          {/* Тип проекта */}
          <label className={styles.field}>
            Тип проекта
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
            >
              <option value="">— выберите тип —</option>
              {projectTypes.map((pt) => (
                <option key={pt.id} value={pt.id}>
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
              {tracks.map((t) => (
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
                {/* Участники */}
                {members.map((m, i) => {
                  // сначала пробуем найти в studentStore
                  const u = students.find((u) => u.user.id.toString() === m);
                  // если не нашли — берём из team.students
                  const fallbackUser = team.students?.find(
                    (s) => s.user.id.toString() === m
                  )?.user;
                  const person = u ? u.user : fallbackUser;
                  return (
                    <div key={i} className={styles.memberRow}>
                      <div className={styles.memberIndex}>{i + 1}</div>
                      <select
                        className={styles.selectMember}
                        value={m}
                        onChange={(e) => changeMember(i, e.target.value)}
                      >
                        <option value="">— выберите участника —</option>
                        {students.map((u2) => (
                          <option
                            key={u2.user.id}
                            value={u2.user.id.toString()}
                          >
                            {u2.user.fio}
                          </option>
                        ))}
                        {/* опция-запасной для тех, кого нет в students */}
                        {fallbackUser &&
                          !students.some(
                            (u2) => u2.user.id === fallbackUser.id
                          ) && <option value={m}>{fallbackUser.fio}</option>}
                      </select>
                      <button
                        onClick={() => removeMember(i)}
                        className={styles.trashBtn}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  );
                })}

                

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
              onChange={(e) => setCaptain(e.target.value)}
              disabled={!members.length}
            >
              <option value="">— выберите участника —</option>
              {members.map((m) => {
                const user = students.find((u) => u.user.id.toString() === m);
                return (
                  user && (
                    <option key={user.user.id} value={m}>
                      {user.user.fio}
                    </option>
                  )
                );
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
                !captain ||
                !track ||
                members.some((m) => !m)
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
  }
);

export default TeamEditModalAdmin;
