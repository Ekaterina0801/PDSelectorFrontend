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
import styles from "./TeamsPage.module.scss";
import ErrorDisplay from "../../components/error-display/ErrorDisplay";
import NoDataDisplay from "../../components/nodata-display/NoDataDisplay";
import ErrorModal from "../../components/error-display/ErrorDisplay";
const TeamsPage = observer(() => {
  const { trackId } = authStore;
  const { teams, loading, error, filters } = teamStore;

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [sort, setSort] = useState('name,asc');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const loadData = useCallback(async () => {
    await teamStore.fetchTeams({
      ...teamStore.filters,
      trackId: authStore.trackId,
      page,
      size,
      sort,
    });
    await teamStore.fetchFilters(trackId);
  }, [page, size, sort, trackId]);

  useEffect(() => {
    loadData();
  }, [loadData]);


  const handleApplyFilters = useCallback(async (newFilters) => {
    teamStore.setFilters(newFilters);
    setPage(0);
    setShowMobileFilters(false);

    await teamStore.fetchTeams({ ...newFilters, page: 0, size, sort });
    await teamStore.fetchFilters(newFilters.trackId);
  }, [size, sort]);

  const handleSearch = useCallback((term) => {
    const updated = { ...filters, searchTerm: term, trackId };
    handleApplyFilters(updated);
  }, [filters, trackId, handleApplyFilters]);

  const handlePageChange = (newPage) => setPage(newPage);
  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(0);
  };
  const handleSortReset = () => {
    setSort('name,asc');
    setPage(0);
  };

  const renderTeams = () => {
    if (loading) return <Loader />;
    if (!loading && error) {
      return (
        <ErrorModal
          message={error}
          onClose={() => teamStore.setError(null)}
        />
      );
    }
    if (!teams.length) return <NoDataDisplay message="Команд нет" />;

    return (
      <div className={styles.teamsGrid}>
        {teams.map(team => (
          <TeamCard
            key={team.id}
            name={team.name}
            projectType={team.project_type?.name || 'Не указано'}
            description={team.project_description}
            technologies={team.technologies || []}
            profileLink={`/teams/${team.id}`}
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

        <button
          className={styles.mobileFiltersButton}
          onClick={() => setShowMobileFilters(true)}
          aria-label="Открыть фильтры"
        >
          <FaFilter size={18} /> Фильтры
        </button>

        <div className={styles.container}>
          <aside className={styles.filtersColumn}>
            <Filter
              availableFilters={teamStore.allFilters}
              currentFilters={teamStore.filters}
              onApply={handleApplyFilters}
            />
          </aside>

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
                  <option value="createdAt,asc">Дата создания (старые)</option>
                  <option value="createdAt,desc">Дата создания (новые)</option>
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
              <span className={styles.pageIndicator}>Страница {page + 1}</span>
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

        <div
          className={
            [
              styles.filtersModal,
              showMobileFilters && styles.filtersModalOpen,
            ]
              .filter(Boolean)
              .join(' ')
          }
        >
          <div className={styles.filtersModalContent}>
            <button
              className={styles.filtersModalClose}
              onClick={() => setShowMobileFilters(false)}
            >
              <FaTimes size={16} />
            </button>
            <Filter
              availableFilters={teamStore.allFilters}
              currentFilters={teamStore.filters}
              onApply={handleApplyFilters}
            />
          </div>
        </div>
      </MainContent>
    </>
  );
});

export default TeamsPage;
