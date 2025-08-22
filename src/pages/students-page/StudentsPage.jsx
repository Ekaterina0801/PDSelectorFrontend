import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import SearchBar from "../../components/search-bar/SearchBar";
import StudentCard from "../../components/card/student-card/StudentCard";
import { observer } from "mobx-react";
import studentStore from "../../stores/studentStore";
import { FaFilter, FaTimes } from "react-icons/fa";
import authStore from "../../stores/authStore";
import Loader from "../../components/spinner/Loader";
import MainContent from "../../components/main-section/MainSection";
import styles from './StudentsPage.module.scss';
import ErrorModal from "../../components/error-display/ErrorDisplay";
import NoDataDisplay from "../../components/nodata-display/NoDataDisplay";
import { StudentFilter } from "../../components/forms/filters/StudentFilter";
const StudentsPage = observer(() => {
  const { trackId, isLoading } = authStore;
  const { students, loading, error, filters } = studentStore;
  const initialInput = filters.input || ''
  
  const [page, setPage]   = useState(filters.page ?? 0)
  const [sort, setSort]   = useState(filters.sort ?? 'name,asc')
  const [input, setInput] = useState(filters.input ?? '')
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const size = 10
  const loadData = useCallback(async () => {
    if (isLoading) return;
    const params = {...studentStore.filters,
          trackId: authStore.trackId,
          page,
          size,
          sort,};
    await studentStore.fetchFilters(authStore.trackId);
    await studentStore.fetchStudents(params);
  }, [trackId, page, size, sort]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
      setPage(0)
      studentStore.setFilters({ ...studentStore.filters, page: 0 })
    }, [trackId])

  const handleApplyFilters = useCallback(async (newFilters) => {
    const params = { ...studentStore.filters, ...newFilters, trackId, page: 0, size, sort };
    studentStore.setFilters(params);
    setPage(0);
    setShowMobileFilters(false);
    await studentStore.fetchFilters(trackId);
  }, [trackId, size, sort]);

  const handleSearch = useCallback((term) => {
    handleApplyFilters({ ...filters, input: term });
  }, [filters, handleApplyFilters]);

  const handleSortChange = e => { setSort(e.target.value); setPage(0); };
  const handleSortReset = () => { setSort('name,asc'); setPage(0); };
  const handlePageChange = np => setPage(np);

  const renderStudents = () => {
    if (loading) return <Loader />;
    if (!loading && error)
      return <ErrorModal message={error} onClose={() => studentStore.setError(null)} />;
    if (!students.length) return <NoDataDisplay message="Студентов нет" />;

    return (
      <div className={styles.studentsGrid}>
        {students.map(s => (
          <StudentCard
            key={s.id}
            name={s.user?.fio || 'Имя отсутствует'}
            aboutSelf={s.about_self || 'Описание отсутствует'}
            course={s.course}
            technologies={s.technologies}
            profileLink={`/students/${s.id}`}
            idUser={s.user?.id}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <MainContent>
         <SearchBar onSearch={handleSearch} defaultValue={input} />
        <button
          className={styles.mobileFiltersButton}
          onClick={() => setShowMobileFilters(true)}
          aria-label="Открыть фильтры"
        >
          <FaFilter size={18} /> Фильтры
        </button>

        <div className={styles.container}>
          <aside className={styles.filtersColumn}>
            <StudentFilter
              availableFilters={studentStore.allFilters}
              currentFilters={filters}
              onApply={handleApplyFilters}
            />
          </aside>

          <section className={styles.contentColumn}>
            <div className={styles.contentHeader}>
              <h1 className={styles.pageTitle}>Участники</h1>
              <div className={styles.sortControls}>
                <label className={styles.sortLabel}>Сортировка:</label>
                <select
                  className={styles.sortSelect}
                  value={sort}
                  onChange={handleSortChange}
                >
                  <option value="name,asc">Имя (А-Я)</option>
                  <option value="name,desc">Имя (Я-А)</option>
                  <option value="course,asc">Курс (↑)</option>
                  <option value="course,desc">Курс (↓)</option>
                </select>
                <button className={styles.resetButton} onClick={handleSortReset}>
                  Сбросить
                </button>
              </div>
            </div>

            {renderStudents()}

            <div className={styles.paginationControls}>
              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
              >
                Назад
              </button>
              <span className={styles.pageIndicator}>Страница {page + 1}</span>
              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(page + 1)}
                disabled={students.length < size}
              >
                Далее
              </button>
            </div>
          </section>
        </div>

        {showMobileFilters && (
          <div className={[styles.filtersModal, styles.filtersModalOpen].join(' ')}>
            <div className={styles.filtersModalContent}>
              <button
                className={styles.filtersModalClose}
                onClick={() => setShowMobileFilters(false)}
              >
                <FaTimes size={16} />
              </button>
              <StudentFilter
                availableFilters={studentStore.allFilters}
                currentFilters={filters}
                onApply={handleApplyFilters}
              />
            </div>
          </div>
        )}
      </MainContent>
    </>
  );
});
export default StudentsPage;