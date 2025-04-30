import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import SearchBar from "../../components/search-bar/SearchBar";
import StudentFilter from "../../components/forms/filters/StudentFilter";
import Header from "../../components/header/Header";
import StudentCard from "../../components/card/student-card/StudentCard";
import { observer } from "mobx-react";
import studentStore from "../../stores/studentStore";
import { FaFilter, FaTimes } from "react-icons/fa";
import authStore from "../../stores/authStore";
import Loader from "../../components/spinner/Loader";
import MainContent from "../../components/main-section/MainSection";
import styles from './StudentsPage.module.scss';
const StudentsPage = observer(() => {
  const { trackId, isLoading } = authStore;
  const { students, loading, error, allFilters, filters, hasError } = studentStore;

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [sort, setSort] = useState('name,asc');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const loadData = useCallback(() => {
    if (isLoading) return;
    const current = {
      ...filters,
      trackId: filters.trackId ?? trackId,
      page,
      size,
      sort,
    };
    studentStore.fetchFilters(trackId);
    studentStore.fetchStudents(current);
  }, [filters, trackId, page, size, sort, isLoading]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearch = term => {
    studentStore.setFilters({ ...filters, searchTerm: term, trackId });
    setPage(0);
  };

  const handleApplyFilters = nf => {
    studentStore.setFilters({ ...filters, ...nf, trackId });
    setPage(0);
    setShowMobileFilters(false);
  };

  const handleSortChange = e => {
    setSort(e.target.value);
    setPage(0);
  };
  const handleSortReset = () => {
    setSort('name,asc');
    setPage(0);
  };
  const handlePageChange = np => setPage(np);

  const renderStudents = () => {
    if (loading) return <Loader />;
    if (hasError) return <ErrorDisplay message={error} />;
    if (!students.length) {
      return <div className={styles.emptyState}>Студенты не найдены</div>;
    }
    return (
      <div className={styles.studentsGrid}>
        {students.map(s => (
          <StudentCard
            key={s.id}
            name={s.user?.fio || 'Имя отсутствует'}
            about_self={s.about_self || 'Описание отсутствует'}
            course={s.course}
            technologies={s.technologies}
            profileLink={`/students/${s.id}`}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <MainContent>
        <SearchBar onSearch={handleSearch} />

        {/* кнопка открытия фильтров на планшете/мобиле */}
        <button
          className={styles.mobileFiltersButton}
          onClick={() => setShowMobileFilters(true)}
          aria-label="Открыть фильтры"
        >
          <FaFilter size={18} /> Фильтры
        </button>

        <div className={styles.container}>
          {/* десктоп-сайдбар */}
          <aside className={styles.filtersColumn}>
            <StudentFilter
              availableFilters={allFilters}
              currentFilters={filters}
              onApply={handleApplyFilters}
            />
          </aside>

          {/* основной контент */}
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
                <button
                  className={styles.resetButton}
                  onClick={handleSortReset}
                >
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
              <span className={styles.pageIndicator}>
                Страница {page + 1}
              </span>
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

        {/* модалка фильтров */}
        <div
          className={[
            styles.filtersModal,
            showMobileFilters && styles.filtersModalOpen,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div className={styles.filtersModalContent}>
            <button
              className={styles.filtersModalClose}
              onClick={() => setShowMobileFilters(false)}
            >
              <FaTimes size={16} />
            </button>
            <StudentFilter
              availableFilters={allFilters}
              currentFilters={filters}
              onApply={handleApplyFilters}
              showTitle={false}
            />
          </div>
        </div>
      </MainContent>
    </>
  );
});

export default StudentsPage;