import TraineeCard from './TraineeCard.jsx'
import TraineeActiveFilters from './TraineeActiveFilters.jsx'
import TraineePagination from './TraineePagination.jsx'

export default function TraineeResults({ state }) {
  const {
    paginated, totalCount, sort, setSort, view, setView,
    page, setPage, totalPages, resetAll
  } = state

  return (
    <div className="results-area">
      <div className="results-toolbar">
        <div className="results-count">
          Showing <strong>{totalCount}</strong> trainees
        </div>
        <div className="toolbar-right">
          <div className="sort-select">
            <label htmlFor="sortSelect" style={{ fontWeight: 600 }}>Sort by:</label>
            <select id="sortSelect" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort trainees">
              <option value="relevance">Relevance</option>
              <option value="newest">Recently added</option>
              <option value="name">Name (A–Z)</option>
              <option value="institution">Institution (A–Z)</option>
              <option value="experience">Experience (most)</option>
            </select>
          </div>
          <div className="view-toggle" role="group" aria-label="View mode">
            <button className={`view-btn ${view === 'grid' ? 'active' : ''}`}
              onClick={() => setView('grid')} aria-label="Grid view" aria-pressed={view === 'grid'}>
              <i className="fas fa-th-large" aria-hidden="true"></i>
            </button>
            <button className={`view-btn ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')} aria-label="List view" aria-pressed={view === 'list'}>
              <i className="fas fa-list" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>

      <TraineeActiveFilters state={state} />

      {paginated.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-user-graduate" aria-hidden="true"></i>
          <h3>No trainees found</h3>
          <p>Try adjusting your filters or search terms to find more trainees.</p>
          <button className="btn btn-primary" onClick={resetAll}>
            <i className="fas fa-undo"></i> Clear all filters
          </button>
        </div>
      ) : (
        <div className={view === 'grid' ? 'trainees-grid' : 'trainees-list'}>
          {paginated.map((t) => (
            <TraineeCard key={t.id} trainee={t} view={view} />
          ))}
        </div>
      )}

      {paginated.length > 0 && (
        <TraineePagination page={page} totalPages={totalPages} setPage={setPage} />
      )}
    </div>
  )
}