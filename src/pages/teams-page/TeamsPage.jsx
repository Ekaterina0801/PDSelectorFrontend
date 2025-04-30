import React, { useState, useEffect, useCallback } from "react";
import { observer } from "mobx-react";
import teamStore from "../../stores/teamStore";
import Navbar from "../../components/navbar/Navbar";
import SearchBar from "../../components/search-bar/SearchBar";
import Filter from "../../components/forms/filters/Filter";
import Loader from "../../components/spinner/Loader";
import authStore from "../../stores/authStore";
import TeamCard from "../../components/card/team-card/TeamCard";
import { FaFilter, FaTimes } from "react-icons/fa";
import MainContent from "../../components/main-section/MainSection";
import styles from './TeamsPage.module.scss';
import ErrorDisplay from "../../components/error-display/ErrorDisplay";
const TeamsPage = observer(() => {
  const { trackId, isLoading } = authStore;
  const { teams, loading, error, allFilters, filters } = teamStore;

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
    teamStore.fetchFilters(trackId);
    teamStore.fetchTeams(current);
  }, [filters, trackId, page, size, sort, isLoading]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearch = term => {
    teamStore.setFilters({ ...filters, searchTerm: term, trackId });
    setPage(0);
  };

  const handleApplyFilters = nf => {
    teamStore.setFilters({
      ...filters,
      isFull: nf.isFull,
      projectType: nf.projectType,
      technologies: nf.technologies?.map(t => t.id || t) || [],
      trackId,
    });
    setPage(0);
    setShowMobileFilters(false);
  };

  const handlePageChange = np => setPage(np);
  const handleSortChange = e => {
    setSort(e.target.value);
    setPage(0);
  };
  const handleSortReset = () => {
    setSort('name,asc');
    setPage(0);
  };

  const renderTeams = () => {
    if (loading) return <Loader />;
    if (error) return <ErrorDisplay message={error} />;
    if (!teams.length)
      return (
        <div className={styles.emptyState}>
          Нет команд по выбранным фильтрам
        </div>
      );

    return (
      <div className={styles.teamsGrid}>
        {teams.map(t => (
          <TeamCard
            key={t.id}
            name={t.name}
            projectType={t.project_type?.name || 'Не указано'}
            description={t.project_description}
            technologies={t.technologies || []}
            profileLink={`/teams/${t.id}`}
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
          <FaFilter size={18} />
          Фильтры
        </button>

        <div className={styles.container}>
          {/* десктоп-сайдбар */}
          <aside className={styles.filtersColumn}>
            <Filter
              availableFilters={allFilters}
              currentFilters={filters}
              onApply={handleApplyFilters}
            />
          </aside>

          {/* основной контент */}
          <section className={styles.contentColumn}>
            <div className={styles.contentHeader}>
              <h1 className={styles.pageTitle}>Команды</h1>
              <div className={styles.sortControls}>
                <label className={styles.sortLabel}>Сортировка:</label>
                <select
                  className={styles.sortSelect}
                  value={sort}
                  onChange={handleSortChange}
                >
                  <option value="name,asc">Имя (А-Я)</option>
                  <option value="name,desc">Имя (Я-А)</option>
                  <option value="createdAt,asc">
                    Дата создания (старые)
                  </option>
                  <option value="createdAt,desc">
                    Дата создания (новые)
                  </option>
                </select>
                <button
                  className={styles.resetButton}
                  onClick={handleSortReset}
                >
                  Сбросить
                </button>
              </div>
            </div>

            {renderTeams()}

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
                disabled={teams.length < size}
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
            showMobileFilters && styles.filtersModalOpen
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
            <Filter
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

export default TeamsPage;