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
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default observer(function TeamsPage() {
  const navigate = useNavigate();
  const { trackId } = authStore;
  const { teams, loading, error, filters } = teamStore;

  const [page, setPage] = useState(() => filters.page ?? 0);
  const [sort, setSort] = useState(() => filters.sort ?? "name,asc");
  const [input, setInput] = useState(() => filters.input ?? "");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const size = 10;

  const loadData = useCallback(async () => {
    await teamStore.fetchFilters(trackId);
    await teamStore.fetchTeams({
      ...teamStore.filters,
      trackId: authStore.trackId,
      page,
      size,
      sort,
    });
  }, [page, size, sort, trackId, location]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    teamStore.setFilters({ ...filters, trackId, page: newPage });
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setSort(val);
    setPage(0);
    teamStore.setFilters({ ...filters, trackId, sort: val, page: 0 });
  };

  const handleSortReset = () => {
    setSort("name,asc");
    setPage(0);
    teamStore.setFilters({ ...filters, trackId, sort: "name,asc", page: 0 });
  };

  const handleSearch = (term) => {
    setInput(term);
    setPage(0);
    teamStore.setFilters({ ...filters, trackId, input: term, page: 0 });
  };

  const handleApplyFilters = useCallback(
    async (newFilters) => {      
      const params = { ...newFilters, page: 0, size, sort };
      teamStore.setFilters(params);
      setPage(0);
      setShowMobileFilters(false);
      await teamStore.fetchFilters(authStore.trackId);
    },
    [size, sort]
  );

  return (
    <>
      <Navbar />
      <MainContent>
        <SearchBar defaultValue={input} onSearch={handleSearch} />

        <button
          className={styles.mobileFiltersButton}
          onClick={() => setShowMobileFilters(true)}
        >
          <FaFilter size={18} /> Фильтры
        </button>

        <div className={styles.container}>
          <aside className={styles.filtersColumn}>
            <Filter
              availableFilters={teamStore.allFilters}
              currentFilters={filters}
              onApply={handleApplyFilters}
            />
          </aside>

          <section className={styles.contentColumn}>
            <div className={styles.contentHeader}>
              <h1 className={styles.pageTitle}>Команды</h1>
              <div className={styles.sortControls}>
                <label>Сортировка:</label>
                <select value={sort} onChange={handleSortChange}>
                  <option value="name,asc">Имя (А-Я)</option>
                  <option value="name,desc">Имя (Я-А)</option>
                </select>
                <button className={styles.resetButton} onClick={handleSortReset}>Сбросить</button>
              </div>
            </div>

            {loading ? (
              <Loader />
            ) : error ? (
              <ErrorModal
                message={error}
                onClose={() => teamStore.setError(null)}
              />
            ) : !teams.length ? (
              <NoDataDisplay message="Команд нет" />
            ) : (
              <div className={styles.teamsGrid}>
                {teams.map((team) => (
                  <TeamCard
                    key={team.id}
                    name={team.name}
                    projectType={team.project_type?.name || "Не указано"}
                    description={team.project_description}
                    technologies={team.technologies || []}
                    profileLink={`/teams/${team.id}`}
                  />
                ))}
              </div>
            )}

            <div className={styles.paginationControls}>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
              >
                Назад
              </button>
              <span>Страница {page + 1}</span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={teams.length < size}
              >
                Далее
              </button>
            </div>
          </section>
        </div>

        {showMobileFilters && (
          <div className={styles.filtersModal}>
            <div className={styles.filtersModalContent}>
              <button
                className={styles.filtersModalClose}
                onClick={() => setShowMobileFilters(false)}
              >
                <FaTimes />
              </button>
              <Filter
                availableFilters={teamStore.allFilters}
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
