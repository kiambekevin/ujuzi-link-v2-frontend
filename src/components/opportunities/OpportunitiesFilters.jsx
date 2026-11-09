import { useMemo, useState } from 'react'
import SearchableMultiSelect from './SearchableMultiSelect.jsx'
import {
  OPPORTUNITIES,
  COUNTIES,
  SECTORS,
  TYPE_OPTIONS,
  TYPE_LABEL_TO_KEY,
  TYPE_SHORT,
  DURATION_LABELS
} from '../../data/opportunitiesData.js'

export default function OpportunitiesFilters({ state }) {
  const {
    types,
    institutions,
    counties,
    sectors,
    durations,
    deadlines,
    stipendOnly,
    toggleType,
    toggleInstitution,
    toggleCounty,
    toggleSector,
    toggleDuration,
    toggleDeadline,
    setStipendOnly,
    resetAll
  } = state

  const [countySearch, setCountySearch] = useState('')
  const [institutionSearch, setInstitutionSearch] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  // Collapsible groups
  const [openGroups, setOpenGroups] = useState({
    type: true,
    sector: true,
    institution: false,
    county: false,
    duration: false,
    stipend: false,
    deadline: false
  })

  const toggleGroup = (key) =>
    setOpenGroups((g) => ({ ...g, [key]: !g[key] }))

  // ---- Type multi-select helpers ----
  // state.types stores internal keys (e.g. 'apprenticeship').
  // The multi-select works in display labels (e.g. 'Apprenticeships').
  const selectedTypeLabels = useMemo(() => {
    const labels = new Set()
    types.forEach((key) => {
      const label = TYPE_OPTIONS.find(
        (l) => TYPE_LABEL_TO_KEY[l] === key
      )
      if (label) labels.add(label)
    })
    return labels
  }, [types])

  const handleToggleType = (label) => {
    const key = TYPE_LABEL_TO_KEY[label]
    if (key) toggleType(key)
  }

  const handleClearTypes = () => {
    types.forEach((key) => toggleType(key))
  }

  // ---- Sector multi-select helpers ----
  const handleToggleSector = (sector) => toggleSector(sector)
  const handleClearSectors = () => {
    sectors.forEach((s) => toggleSector(s))
  }

  // ---- Active filter counter ----
  const activeCount = useMemo(() => {
    let n = types.size + institutions.size + counties.size + sectors.size
    n += durations.size + deadlines.size
    if (stipendOnly) n += 1
    return n
  }, [types, institutions, counties, sectors, durations, deadlines, stipendOnly])

  const institutionList = useMemo(
    () => Array.from(new Set(OPPORTUNITIES.map((o) => o.institution))).sort(),
    []
  )

  const filteredCounties = useMemo(() => {
    const q = countySearch.toLowerCase()
    return COUNTIES.filter((c) => c.toLowerCase().includes(q))
  }, [countySearch])

  const filteredInstitutions = useMemo(() => {
    const q = institutionSearch.toLowerCase()
    return institutionList.filter((i) => i.toLowerCase().includes(q))
  }, [institutionSearch, institutionList])

  return (
    <>
      <button
        type="button"
        className="filters-toggle"
        onClick={() => setMobileOpen((v) => !v)}
        aria-expanded={mobileOpen}
      >
        <span>
          <i className="fas fa-filter"></i> Filters
          {activeCount > 0 && (
            <span className="filters-toggle-badge">{activeCount}</span>
          )}
        </span>
        <i className={`fas fa-chevron-${mobileOpen ? 'up' : 'down'}`} aria-hidden="true"></i>
      </button>

      <div className={`filters-panel ${mobileOpen ? '' : 'collapsed'}`}>
        <div className="filters-header">
          <h3>
            <i className="fas fa-filter" aria-hidden="true"></i> Filters
            {activeCount > 0 && <span className="filters-count">{activeCount}</span>}
          </h3>
          <button type="button" className="clear-filters" onClick={resetAll}>
            Clear all
          </button>
        </div>

        {/* ===== Opportunity type (searchable multi-select) ===== */}
        <div className={`filter-group ${openGroups.type ? 'is-open' : ''}`}>
          <button
            type="button"
            className="filter-group-toggle"
            onClick={() => toggleGroup('type')}
            aria-expanded={openGroups.type}
          >
            <h4>
              <i className="fas fa-briefcase" aria-hidden="true"></i>
              Opportunity type
              {types.size > 0 && <span className="fg-count">{types.size}</span>}
            </h4>
            <i
              className={`fas fa-chevron-${openGroups.type ? 'up' : 'down'} fg-caret`}
              aria-hidden="true"
            ></i>
          </button>
          {openGroups.type && (
            <div className="filter-group-body">
              <SearchableMultiSelect
                label="opportunity types"
                options={TYPE_OPTIONS}
                selected={selectedTypeLabels}
                onToggle={handleToggleType}
                onClear={handleClearTypes}
                placeholder="Search opportunity types..."
                emptyLabel="No types match"
              />
            </div>
          )}
        </div>

        {/* ===== Occupational sector (searchable multi-select) ===== */}
        <div className={`filter-group ${openGroups.sector ? 'is-open' : ''}`}>
          <button
            type="button"
            className="filter-group-toggle"
            onClick={() => toggleGroup('sector')}
            aria-expanded={openGroups.sector}
          >
            <h4>
              <i className="fas fa-tags" aria-hidden="true"></i>
              Occupational sector
              {sectors.size > 0 && <span className="fg-count">{sectors.size}</span>}
            </h4>
            <i
              className={`fas fa-chevron-${openGroups.sector ? 'up' : 'down'} fg-caret`}
              aria-hidden="true"
            ></i>
          </button>
          {openGroups.sector && (
            <div className="filter-group-body">
              <SearchableMultiSelect
                label="sectors"
                options={SECTORS}
                selected={sectors}
                onToggle={handleToggleSector}
                onClear={handleClearSectors}
                placeholder="Search sectors..."
                emptyLabel="No sectors match"
              />
            </div>
          )}
        </div>

        {/* ===== Institution ===== */}
        <div className={`filter-group ${openGroups.institution ? 'is-open' : ''}`}>
          <button
            type="button"
            className="filter-group-toggle"
            onClick={() => toggleGroup('institution')}
            aria-expanded={openGroups.institution}
          >
            <h4>
              <i className="fas fa-university" aria-hidden="true"></i>
              Institution
              {institutions.size > 0 ? (
                <span className="fg-count">{institutions.size}</span>
              ) : (
                <span className="fg-total">{institutionList.length}</span>
              )}
            </h4>
            <i
              className={`fas fa-chevron-${openGroups.institution ? 'up' : 'down'} fg-caret`}
              aria-hidden="true"
            ></i>
          </button>
          {openGroups.institution && (
            <div className="filter-group-body">
              <div className="filter-search">
                <i className="fas fa-search" aria-hidden="true"></i>
                <input
                  type="text"
                  placeholder="Search institution..."
                  value={institutionSearch}
                  onChange={(e) => setInstitutionSearch(e.target.value)}
                  aria-label="Search institution filter"
                />
              </div>
              <div className="filter-options scrollable">
                {filteredInstitutions.map((inst) => (
                  <label className="filter-checkbox" key={inst}>
                    <input
                      type="checkbox"
                      checked={institutions.has(inst)}
                      onChange={() => toggleInstitution(inst)}
                    />
                    <span title={inst}>{inst}</span>
                  </label>
                ))}
                {filteredInstitutions.length === 0 && (
                  <div className="ms-empty">No institutions match</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ===== County ===== */}
        <div className={`filter-group ${openGroups.county ? 'is-open' : ''}`}>
          <button
            type="button"
            className="filter-group-toggle"
            onClick={() => toggleGroup('county')}
            aria-expanded={openGroups.county}
          >
            <h4>
              <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
              County
              {counties.size > 0 ? (
                <span className="fg-count">{counties.size}</span>
              ) : (
                <span className="fg-total">{COUNTIES.length}</span>
              )}
            </h4>
            <i
              className={`fas fa-chevron-${openGroups.county ? 'up' : 'down'} fg-caret`}
              aria-hidden="true"
            ></i>
          </button>
          {openGroups.county && (
            <div className="filter-group-body">
              <div className="filter-search">
                <i className="fas fa-search" aria-hidden="true"></i>
                <input
                  type="text"
                  placeholder="Search county..."
                  value={countySearch}
                  onChange={(e) => setCountySearch(e.target.value)}
                  aria-label="Search county filter"
                />
              </div>
              <div className="filter-options scrollable">
                {filteredCounties.map((county) => (
                  <label className="filter-checkbox" key={county}>
                    <input
                      type="checkbox"
                      checked={counties.has(county)}
                      onChange={() => toggleCounty(county)}
                    />
                    <span>{county}</span>
                  </label>
                ))}
                {filteredCounties.length === 0 && (
                  <div className="ms-empty">No counties match</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ===== Duration ===== */}
        <div className={`filter-group ${openGroups.duration ? 'is-open' : ''}`}>
          <button
            type="button"
            className="filter-group-toggle"
            onClick={() => toggleGroup('duration')}
            aria-expanded={openGroups.duration}
          >
            <h4>
              <i className="fas fa-clock" aria-hidden="true"></i>
              Duration
              {durations.size > 0 && <span className="fg-count">{durations.size}</span>}
            </h4>
            <i
              className={`fas fa-chevron-${openGroups.duration ? 'up' : 'down'} fg-caret`}
              aria-hidden="true"
            ></i>
          </button>
          {openGroups.duration && (
            <div className="filter-group-body">
              <div className="filter-options">
                {Object.entries(DURATION_LABELS).map(([key, label]) => (
                  <label className="filter-checkbox" key={key}>
                    <input
                      type="checkbox"
                      checked={durations.has(key)}
                      onChange={() => toggleDuration(key)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ===== Stipend ===== */}
        <div className={`filter-group ${openGroups.stipend ? 'is-open' : ''}`}>
          <button
            type="button"
            className="filter-group-toggle"
            onClick={() => toggleGroup('stipend')}
            aria-expanded={openGroups.stipend}
          >
            <h4>
              <i className="fas fa-money-bill-wave" aria-hidden="true"></i>
              Stipend offered
              {stipendOnly && <span className="fg-count">1</span>}
            </h4>
            <i
              className={`fas fa-chevron-${openGroups.stipend ? 'up' : 'down'} fg-caret`}
              aria-hidden="true"
            ></i>
          </button>
          {openGroups.stipend && (
            <div className="filter-group-body">
              <div className="filter-options">
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={stipendOnly}
                    onChange={(e) => {
                      setStipendOnly(e.target.checked)
                      state.setPage(1)
                    }}
                  />
                  <span>Only paid placements</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* ===== Deadline ===== */}
        <div className={`filter-group ${openGroups.deadline ? 'is-open' : ''}`}>
          <button
            type="button"
            className="filter-group-toggle"
            onClick={() => toggleGroup('deadline')}
            aria-expanded={openGroups.deadline}
          >
            <h4>
              <i className="fas fa-hourglass-half" aria-hidden="true"></i>
              Deadline
              {deadlines.size > 0 && <span className="fg-count">{deadlines.size}</span>}
            </h4>
            <i
              className={`fas fa-chevron-${openGroups.deadline ? 'up' : 'down'} fg-caret`}
              aria-hidden="true"
            ></i>
          </button>
          {openGroups.deadline && (
            <div className="filter-group-body">
              <div className="filter-options">
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={deadlines.has('urgent')}
                    onChange={() => toggleDeadline('urgent')}
                  />
                  <span>Closing in 72 hours</span>
                </label>
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={deadlines.has('week')}
                    onChange={() => toggleDeadline('week')}
                  />
                  <span>Closing this week</span>
                </label>
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={deadlines.has('month')}
                    onChange={() => toggleDeadline('month')}
                  />
                  <span>Closing this month</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}