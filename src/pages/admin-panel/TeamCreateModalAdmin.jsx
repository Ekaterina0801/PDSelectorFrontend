import styles from "./TeamEditFormAdmin.module.scss";
import { useState, useEffect } from "react";
import Modal from "../../components/forms/modal/Modal";
import { observer } from "mobx-react";
import { useNewTeam } from "../../hooks/useNewTeamAdmin";
import studentStore from "../../stores/studentStore";
import { FiTrash2, FiPlus, FiCheck, FiX } from "react-icons/fi";
import { useMemo } from "react";
const TeamCreateModalAdmin = observer(function TeamCreateModalAdmin({
  show,
  onClose,
  onSave,
  tracks,
  projectTypes = [],
  technologies = [],
  defaultTrackId = null,
}) {
  const [name, setName]                 = useState("");
  const [projectType, setProjectType]   = useState("");
  const [track, setTrack]               = useState(defaultTrackId ? String(defaultTrackId) : "");
  const [projectDescription, setProjectDescription] = useState("");

  const [techIds, setTechIds]           = useState([]);      
  const [techQuery, setTechQuery]       = useState("");     

  const [teamMembers, setTeamMembers]   = useState([]);      
  const [captain, setCaptain]           = useState("");      
  const { loading, availableStudents } = studentStore;


  useEffect(() => {
    if (!show) return;
    setName("");
    setProjectType("");
    setTrack(defaultTrackId ? String(defaultTrackId) : "");
    setProjectDescription("");
    setTechIds([]);
    setTechQuery("");
    setTeamMembers([]);
    setCaptain("");
  }, [show, defaultTrackId]);


  useEffect(() => {
    if (!track) return;
    studentStore.fetchAvailableStudents({ trackId: +track, teamId: -1 });
    setTeamMembers([]);
    setCaptain("");
  }, [track]);

 
  const baseOptions = useMemo(
    () =>
      (availableStudents || []).map((s) => ({
        id: s.id.toString(),
        fio: s.user?.fio || "—",
      })),
    [availableStudents]
  );


  const selectedIds = useMemo(
    () => new Set(teamMembers.filter(Boolean)),
    [teamMembers]
  );


  const getRowOptions = (currentId, rowIndex) => {
    const selectedExceptSelf = new Set(
      teamMembers.map((id, i) => (i === rowIndex ? null : id)).filter(Boolean)
    );
    return baseOptions.filter(
      (o) => o.id === currentId || !selectedExceptSelf.has(o.id)
    );
  };

  
  const canAddMore = baseOptions.length > selectedIds.size;

  const addMember = () => {
    if (!canAddMore) return;
    setTeamMembers((ms) => [...ms, ""]);
  };


  const changeMember = (rowIndex, newId) => {
    setTeamMembers((prev) => {
      const next = [...prev];
      next.forEach((val, i) => {
        if (i !== rowIndex && val === newId) next[i] = "";
      });
      next[rowIndex] = newId;

      if (!next.includes(captain)) setCaptain("");
      return next;
    });
  };

  const removeMember = (rowIndex) => {
    setTeamMembers((prev) => {
      const next = prev.filter((_, i) => i !== rowIndex);
      if (!next.includes(captain)) setCaptain("");
      return next;
    });
  };

  const captainCandidates = useMemo(
    () => Array.from(new Set(teamMembers.filter(Boolean))),
    [teamMembers]
  );

  const filteredTechnologies = useMemo(
    () =>
      (technologies || []).filter((t) =>
        t.name.toLowerCase().includes(techQuery.toLowerCase())
      ),
    [technologies, techQuery]
  );

  const toggleTech = (id) =>
    setTechIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  // Сабмит
  const handleSubmit = () => {
    if (!name.trim() || !projectType || !track) {
      alert("Заполните: Название, Тип проекта и Трек.");
      return;
    }
    const cleanMembers = teamMembers.filter(Boolean);
    if (!cleanMembers.length) {
      alert("Добавьте хотя бы одного участника.");
      return;
    }
    if (!captain || !cleanMembers.includes(captain)) {
      alert("Выберите капитана из списка участников.");
      return;
    }

    const payload = {
      name: name.trim(),
      project_description: projectDescription.trim(),
      project_type: { id: +projectType },
      current_track: +track,
      technologies: techIds.map((id) => ({ id })),
      captain_id: +captain,
      studentIds: cleanMembers.map((id) => +id),
    };

    onSave(payload);
  };

  if (!show) return null;

  return (
    <Modal show onClose={onClose} title="Новая команда">
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
              <option key={`pt-${pt.id}`} value={pt.id.toString()}>
                {pt.name}
              </option>
            ))}
          </select>
        </label>

        {/* Трек */}
        <label className={styles.field}>
          Трек
          <select value={track} onChange={(e) => setTrack(e.target.value)}>
            <option value="">— выберите трек —</option>
            {tracks.map((ti) => (
              <option key={`tr-${ti.id}`} value={ti.id.toString()}>
                {ti.name}
              </option>
            ))}
          </select>
        </label>

        {/* Описание проекта */}
        <label className={styles.field}>
          Описание проекта
          <textarea
            className={styles.textarea}
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            rows={4}
            placeholder="Коротко опишите идею проекта"
          />
        </label>

        {/* Технологии — чипы + поиск */}
        <div className={styles.field}>
          <div className={styles.techHeader}>
            <div className={styles.sectionTitle}>Технологии</div>
            <input
              className={styles.techSearch}
              type="text"
              placeholder="Поиск технологий…"
              value={techQuery}
              onChange={(e) => setTechQuery(e.target.value)}
            />
          </div>

          {/* Выбранные */}
          <div className={styles.techSelected}>
            {techIds.length ? (
              techIds.map((id) => {
                const tech = technologies.find((t) => t.id === id);
                if (!tech) return null;
                return (
                  <button
                    key={`sel-${id}`}
                    type="button"
                    className={styles.techChipSelected}
                    onClick={() => toggleTech(id)}
                    title="Убрать из выбранных"
                  >
                    <span className={styles.techDot} />
                    <span className={styles.techLabel}>{tech.name}</span>
                    <FiX className={styles.techClose} />
                  </button>
                );
              })
            ) : (
              <span className={styles.techEmpty}>Пока ничего не выбрано</span>
            )}
          </div>

          {/* Облако доступных тегов */}
          <div className={styles.techCloud}>
            {filteredTechnologies.map((t) => {
              const active = techIds.includes(t.id);
              return (
                <button
                  key={`tech-${t.id}`}
                  type="button"
                  className={`${styles.techChip} ${active ? styles.active : ""}`}
                  onClick={() => toggleTech(t.id)}
                  aria-pressed={active}
                >
                  {active && <FiCheck className={styles.checkIcon} />}
                  <span className={styles.techLabel}>{t.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Участники */}
        <div className={styles.membersSection}>
          <div className={styles.sectionTitle}>
            Участники{" "}
            <span className={styles.hint}>
              (свободно: {Math.max(0, baseOptions.length - selectedIds.size)})
            </span>
          </div>

          {loading ? (
            <p>Загрузка…</p>
          ) : (
            <div className={styles.membersList}>
              {teamMembers.map((mId, idx) => {
                const rowOptions = getRowOptions(mId, idx);
                return (
                  <div key={`row-${idx}`} className={styles.memberRow}>
                    <div className={styles.memberIndex}>{idx + 1}</div>
                    <select
                      value={mId}
                      onChange={(e) => changeMember(idx, e.target.value)}
                      className={styles.selectMember}
                    >
                      <option value="">— выберите участника —</option>
                      {rowOptions.map((o) => (
                        <option key={`opt-${o.id}`} value={o.id}>
                          {o.fio}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeMember(idx)}
                      className={styles.trashBtn}
                      type="button"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                );
              })}
              <button
                onClick={addMember}
                className={styles.addMemberBtn}
                type="button"
                disabled={!canAddMore || !baseOptions.length}
                title={
                  !baseOptions.length
                    ? "Нет доступных студентов"
                    : !canAddMore
                    ? "Свободных участников больше нет"
                    : ""
                }
              >
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
            disabled={!captainCandidates.length}
          >
            <option value="">— выберите капитана —</option>
            {captainCandidates.map((id) => {
              const opt = baseOptions.find((x) => x.id === id);
              return opt ? (
                <option key={`cap-${id}`} value={id}>
                  {opt.fio}
                </option>
              ) : null;
            })}
          </select>
        </label>

        {/* Кнопки */}
        <div className={styles.actions}>
          <button className={styles.btnSave} onClick={handleSubmit}>
            Создать команду
          </button>
          <button className={styles.btnCancel} onClick={onClose} type="button">
            Отменить
          </button>
        </div>
      </div>
    </Modal>
  );
});

export default TeamCreateModalAdmin;