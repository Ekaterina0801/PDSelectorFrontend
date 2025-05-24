import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import styles from './TeamOptionsSection.module.scss';
import projectTypeStore from '../../stores/projectTypeStore';
import technologyStore from '../../stores/technologyStore';
import ModalForm from '../../components/profile/ModalForm';
import ErrorModal from '../../components/error-display/ErrorDisplay';
import SuccessMessage from '../../components/successMessage/SuccessMessage';
const TeamOptionsSection = observer(() => {

  const [showProjectTypeModal, setShowProjectTypeModal] = useState(false);
  const [showTechModal, setShowTechModal] = useState(false);

  const [projectTypeToDelete, setProjectTypeToDelete] = useState(null);
  const [techToDelete, setTechToDelete] = useState(null);

  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    projectTypeStore.fetchProjectTypes();
    technologyStore.fetchTechnologies();
  }, [projectTypeStore, technologyStore]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSaveProjectType = async ({ name }) => {
    await projectTypeStore.createProjectType(name);
    setShowProjectTypeModal(false);
    setSuccessMessage(`Тип проекта "${name}" успешно добавлен`);
  };

  const handleSaveTech = async ({ name }) => {
    await technologyStore.createTechnology(name);
    setShowTechModal(false);
    setSuccessMessage(`Технология "${name}" успешно добавлена`);
  };

  const confirmDeleteProjectType = (pt) => {
    setProjectTypeToDelete(pt);
  };

  const confirmDeleteTech = (tech) => {
    setTechToDelete(tech);
  };

  const doDeleteProjectType = async () => {
    if (projectTypeToDelete) {
      await projectTypeStore.deleteProjectType(projectTypeToDelete.id);
      setSuccessMessage(`Тип проекта "${projectTypeToDelete.name}" успешно удалён`);
      setProjectTypeToDelete(null);
    }
  };

  const doDeleteTech = async () => {
    if (techToDelete) {
      await technologyStore.deleteTechnology(techToDelete.id);
      setSuccessMessage(`Технология "${techToDelete.name}" успешно удалена`);
      setTechToDelete(null);
    }
  };

  return (
    <div className={styles.container}>
      {/* === Project Types Section === */}
      <section className={styles.section}>
        <div className={styles.header}>
          <h2>Типы проектов</h2>
          <button
            className={styles.addBtn}
            onClick={() => setShowProjectTypeModal(true)}
          >
            Добавить тип
          </button>
        </div>
        <div className={styles.tagCloud}>
          {projectTypeStore.projectTypes.map(pt => (
            <span key={pt.id} className={styles.tag}>
              {pt.name}
              <button
                className={styles.deleteTagBtn}
                title="Удалить тип проекта"
                onClick={() => confirmDeleteProjectType(pt)}
              >
                🗑️
              </button>
            </span>
          ))}
          {projectTypeStore.projectTypes.length === 0 && (
            <p className={styles.emptyText}>Нет типов проектов</p>
          )}
        </div>
      </section>

      {/* === Technologies Section === */}
      <section className={styles.section}>
        <div className={styles.header}>
          <h2>Технологии</h2>
          <button
            className={styles.addBtn}
            onClick={() => setShowTechModal(true)}
          >
            Добавить технологию
          </button>
        </div>
        <div className={styles.tagCloud}>
          {technologyStore.technologies.map(tech => (
            <span key={tech.id} className={styles.tag}>
              {tech.name}
              <button
                className={styles.deleteTagBtn}
                title="Удалить технологию"
                onClick={() => confirmDeleteTech(tech)}
              >
                🗑️
              </button>
            </span>
          ))}
          {technologyStore.technologies.length === 0 && (
            <p className={styles.emptyText}>Нет технологий</p>
          )}
        </div>
      </section>

      {/* Modal for adding Project Type */}
      <ModalForm
        show={showProjectTypeModal}
        title="Новый тип проекта"
        initialData={{}}
        fields={[
          { name: 'name', label: 'Название', type: 'text', required: true },
        ]}
        onSave={handleSaveProjectType}
        onCancel={() => setShowProjectTypeModal(false)}
      />

      {/* Modal for adding Technology */}
      <ModalForm
        show={showTechModal}
        title="Новая технология"
        initialData={{}}
        fields={[
          { name: 'name', label: 'Название', type: 'text', required: true },
        ]}
        onSave={handleSaveTech}
        onCancel={() => setShowTechModal(false)}
      />

      {/* Confirmation ErrorModal for Project Type deletion */}
      {projectTypeToDelete && (
        <ErrorModal
          title="Удаление типа проекта"
          message={`Вы действительно хотите удалить тип "${projectTypeToDelete.name}"?`}
          onClose={() => setProjectTypeToDelete(null)}
          onConfirm={doDeleteProjectType}
        />
      )}

      {/* Confirmation ErrorModal for Technology deletion */}
      {techToDelete && (
        <ErrorModal
          title="Удаление технологии"
          message={`Вы действительно хотите удалить технологию "${techToDelete.name}"?`}
          onClose={() => setTechToDelete(null)}
          onConfirm={doDeleteTech}
        />
      )}

      {/* SuccessMessage */}
      {!!successMessage && <SuccessMessage message={successMessage} />}
    </div>
  );
});

export default TeamOptionsSection;