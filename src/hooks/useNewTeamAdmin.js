// useNewTeam.js
import { useState } from "react";
import teamStore from "../stores/teamStore";

/**
 * Хук для создания НОВОЙ команды (из-под админа).
 * - studentId может быть null → поле captain_id в payload не отправляем.
 * - technologies/projectTypes нужны только для валидации/формирования UI.
 */
export const useNewTeam = ({
  defaultTrackId = null,
  studentId = null,            // админ-кейс: обычно null
  onAfterCreate,               // опционально: колбэк после успешного create
} = {}) => {
  const [newTeam, setNewTeam] = useState({
    name: "",
    projectDescription: "",
    projectTypeId: "",         // сохраняем id, не объект
    techIds: [],               // массив чисел (id технологий)
    trackId: defaultTrackId ? String(defaultTrackId) : "", // в UI храним строкой
  });

  const resetNewTeam = () =>
    setNewTeam({
      name: "",
      projectDescription: "",
      projectTypeId: "",
      techIds: [],
      trackId: defaultTrackId ? String(defaultTrackId) : "",
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTeam((prev) => ({ ...prev, [name]: value }));
  };

  const toggleTech = (id, checked) => {
    setNewTeam((prev) => ({
      ...prev,
      techIds: checked
        ? [...prev.techIds, Number(id)]
        : prev.techIds.filter((x) => x !== Number(id)),
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();

    if (
      !newTeam.name.trim() ||
      !newTeam.projectDescription.trim() ||
      !newTeam.projectTypeId ||
      !newTeam.trackId
    ) {
      alert("Заполните обязательные поля: название, описание, тип проекта и трек.");
      return;
    }

    const payload = {
      name: newTeam.name.trim(),
      project_description: newTeam.projectDescription.trim(),
      project_type: { id: Number(newTeam.projectTypeId) },
      technologies: newTeam.techIds.map((id) => ({ id })),
      current_track_id: Number(newTeam.trackId),
      ...(studentId ? { captain_id: Number(studentId) } : {}), // админ-кейс: не добавляем, если null
    };

    try {
      await teamStore.createTeam(payload);
      onAfterCreate?.(payload);
      resetNewTeam();
    } catch (err) {
      console.error("Ошибка при создании команды:", err);
      alert("Не удалось создать команду.");
    }
  };

  return {
    newTeam,
    setNewTeam,
    handleChange,
    toggleTech,
    handleSubmit,
    resetNewTeam,
  };
};
