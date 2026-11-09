import OpportunityCard from './OpportunityCard.jsx'
import ActiveFilters from './ActiveFilters.jsx'
import Pagination from './Pagination.jsx'

export default function OpportunitiesResults({ state }) {
  const {
    paginated,
    totalCount,
    sort,
    setSort,
    view,
    setView,
    page,
    setPage,
    totalPages,
    resetAll
  } = state

  return (
    <div className="results-area">
      <div className="results-toolbar">
        <div className="results-count">
          Showing <strong>{totalCount}</strong> opportunities
        </div>
        <div className="toolbar-right">
          <div className="sort-select">
            <label htmlFor="sortSelect" style={{ fontWeight: 600 }}>
              Sort by:
            </label>
            <select
              id="sortSelect"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort opportunities"
            >
              <option value="newest">Newest first</option>
              <option value="deadline">Deadline (soonest)</option>
              <option value="title">Title (A–Z)</option>
              <option value="employer">Employer (A–Z)</option>
              <option value="institution">Institution (A–Z)</option>
            </select>
          </div>
          <div className="view-toggle" role="group" aria-label="View mode">
            <button
              className={`view-btn ${view === 'grid' ? 'active' : ''}`}
              onClick={() => setView('grid')}
              aria-label="Grid view"
              aria-pressed={view === 'grid'}
              title="Grid view"
            >
              <i className="fas fa-th-large" aria-hidden="true"></i>
            </button>
            <button
              className={`view-btn ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
              aria-label="List view"
              aria-pressed={view === 'list'}
              title="List view"
            >
              <i className="fas fa-list" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>

      <ActiveFilters state={state} />

      {paginated.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-search" aria-hidden="true"></i>
          <h3>No opportunities found</h3>
          <p>Try adjusting your filters or search terms to find more placements.</p>
          <button className="btn btn-primary" onClick={resetAll}>
            <i className="fas fa-undo"></i> Clear all filters
          </button>
        </div>
      ) : (
        <div className={view === 'grid' ? 'opportunities-grid' : 'opportunities-list'}>
          {paginated.map((opp) => (
            <OpportunityCard key={opp.id} opp={opp} view={view} />
          ))}
        </div>
      )}

      {paginated.length > 0 && (
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      )}
    </div>
  )
}