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
    const {loading: studentsLoading, students } = studentStore;

    useEffect(() => {
      if (team) {
        console.log('TEAM', team);
        setName(team.name || "");
        setProjectType(team.project_type?.id.toString() || "");
        setCaptain(team.captain?.user.id || "");
        setTrack(team.current_track.toString() || "");
        setMembers(team.students?.map((s) => s.user.id) || []);
        console.log('name', name);
        console.log('members', members);
        console.log('track', track);
      }
    }, [team]);

    useEffect(() => {
      if (track) studentStore.fetchStudents({ trackId: track });
    }, [track]);

    const memberStudents = useMemo(() => team.students || [], [team.students]);
    console.log("members", memberStudents);
    if (show == false) {
      return null;
    }

    const addMember = () => setMembers((ms) => [...ms, ""]);
    const changeMember = (i, id) => {
      setMembers((ms) => ms.map((v, idx) => (idx === i ? id : v)));
      if (captain && !members.includes(captain)) setCaptain("");
    };
    const removeMember = (i) => {
      setMembers((ms) => ms.filter((_, idx) => idx !== i));
      if (captain && !members.filter((_, idx) => idx !== i).includes(captain)) {
        setCaptain("");
      }
    };
    const handleSubmit = () => {
      onSave({
        id: team.id,
        name,
        projectType,
        captain,
        track,
        students: members.filter(Boolean),
      });
    };

    return (
      <Modal
        show
        onClose={onClose}
        title={team.id ? "Редактирование команды" : "Новая команда"}
      >
        <div className={styles.form}>
          <label className={styles.field}>
            Название
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label className={styles.field}>
            Тип проекта
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
            >
              <option value="">Выберите тип</option>
              {projectTypes.map((pt) => (
                <option key={pt.id} value={pt.id}>
                  {pt.name}
                </option>
              ))}
            </select>
          </label>
          <div className={styles.membersSection}>
            <div className={styles.sectionTitle}>Участники</div>
            <div className={styles.membersList}>
              {members.map((m, i) => (
                <div key={i} className={styles.memberRow}>
                  <div className={styles.memberIndex}>{i + 1}</div>
                  <select
                    className={styles.selectMember}
                    value={m}
                    onChange={(e) => changeMember(i, e.target.value)}
                    disabled={studentsLoading}
                  >
                    <option value="">— выберите участника —</option>
                    {students.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.user.fio}
                      </option>
                    ))}
                  </select>
                  <button
                    className={styles.trashBtn}
                    onClick={() => removeMember(i)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
              <button className={styles.addMemberBtn} onClick={addMember}>
                <FiPlus />
              </button>
            </div>
          </div>
          <label className={styles.field}>
            Капитан команды
            <select
              value={captain}
              onChange={(e) => setCaptain(e.target.value)}
            >
              <option value="">— выберите из участников —</option>
              {memberStudents.map((s) => (
                <option key={s.user.id} value={s.user.id}>
                  {s.user.fio}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            Трек
            <select value={track} onChange={(e) => setTrack(e.target.value)}>
              <option value="">Выберите трек</option>
              {tracks.map((t) => (
                <option key={t.id} value={t.id.toString()}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>

          <div className={styles.actions}>
            <button
              className={styles.btnSave}
              onClick={handleSubmit}
              disabled={!name || !projectType || !captain || !track}
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
