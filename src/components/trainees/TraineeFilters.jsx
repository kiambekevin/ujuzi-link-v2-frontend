import { useMemo, useState } from 'react'
import {
  COUNTIES,
  SECTORS,
  ALL_SKILLS,
  AVAILABILITY_LABELS,
  LEVEL_LABELS,
  OPP_TYPE_LABELS
} from '../../data/traineesData.js'

export default function TraineeFilters({ state }) {
  const {
    availability, sectors, levels, counties, oppTypes, skills, genders,
    disabilityOnly, expMin, expMax, ageMin, ageMax,
    toggleAvailability, toggleSector, toggleLevel, toggleCounty, toggleOppType,
    toggleSkill, toggleGender, setDisability, setExperienceRange, setAgeRange,
    activeCount, resetAll
  } = state

  const [mobileOpen, setMobileOpen] = useState(false)
  const [countySearch, setCountySearch] = useState('')
  const [skillSearch, setSkillSearch] = useState('')

  const [openGroups, setOpenGroups] = useState({
    availability: true,
    sector: false,
    level: false,
    county: false,
    oppType: false,
    skills: false,
    gender: false,
    disability: false,
    experience: false,
    age: false
  })
  const toggleGroup = (key) =>
    setOpenGroups((g) => ({ ...g, [key]: !g[key] }))

  const filteredCounties = useMemo(() => {
    const q = countySearch.toLowerCase()
    return COUNTIES.filter((c) => c.toLowerCase().includes(q))
  }, [countySearch])

  const filteredSkills = useMemo(() => {
    const q = skillSearch.toLowerCase()
    return ALL_SKILLS.filter((s) => s.toLowerCase().includes(q))
  }, [skillSearch])

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
          {activeCount > 0 && <span className="filters-toggle-badge">{activeCount}</span>}
        </span>
        <i className={`fas fa-chevron-${mobileOpen ? 'up' : 'down'}`} aria-hidden="true"></i>
      </button>

      <div className={`filters-panel ${mobileOpen ? '' : 'collapsed'}`}>
        <div className="filters-header">
          <h3>
            <i className="fas fa-filter" aria-hidden="true"></i> Filters
            {activeCount > 0 && <span className="filters-count">{activeCount}</span>}
          </h3>
          <button className="clear-filters" onClick={resetAll} type="button">
            Clear all
          </button>
        </div>

        {/* Availability */}
        <div className={`filter-group ${openGroups.availability ? 'is-open' : ''}`}>
          <button type="button" className="filter-group-toggle"
            onClick={() => toggleGroup('availability')} aria-expanded={openGroups.availability}>
            <h4>
              <i className="fas fa-user-clock" aria-hidden="true"></i> Availability
              {availability.size > 0 && <span className="fg-count">{availability.size}</span>}
            </h4>
            <i className={`fas fa-chevron-${openGroups.availability ? 'up' : 'down'} fg-caret`} aria-hidden="true"></i>
          </button>
          {openGroups.availability && (
            <div className="filter-group-body">
              <div className="filter-options">
                {Object.entries(AVAILABILITY_LABELS).map(([key, label]) => (
                  <label className="filter-checkbox" key={key}>
                    <input type="checkbox" checked={availability.has(key)} onChange={() => toggleAvailability(key)} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Occupational sector */}
        <div className={`filter-group ${openGroups.sector ? 'is-open' : ''}`}>
          <button type="button" className="filter-group-toggle"
            onClick={() => toggleGroup('sector')} aria-expanded={openGroups.sector}>
            <h4>
              <i className="fas fa-tags" aria-hidden="true"></i> Sector
              {sectors.size > 0 && <span className="fg-count">{sectors.size}</span>}
            </h4>
            <i className={`fas fa-chevron-${openGroups.sector ? 'up' : 'down'} fg-caret`} aria-hidden="true"></i>
          </button>
          {openGroups.sector && (
            <div className="filter-group-body">
              <div className="filter-options">
                {SECTORS.map((sector) => (
                  <label className="filter-checkbox" key={sector}>
                    <input type="checkbox" checked={sectors.has(sector)} onChange={() => toggleSector(sector)} />
                    <span>{sector}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* TVET level */}
        <div className={`filter-group ${openGroups.level ? 'is-open' : ''}`}>
          <button type="button" className="filter-group-toggle"
            onClick={() => toggleGroup('level')} aria-expanded={openGroups.level}>
            <h4>
              <i className="fas fa-layer-group" aria-hidden="true"></i> TVET level
              {levels.size > 0 && <span className="fg-count">{levels.size}</span>}
            </h4>
            <i className={`fas fa-chevron-${openGroups.level ? 'up' : 'down'} fg-caret`} aria-hidden="true"></i>
          </button>
          {openGroups.level && (
            <div className="filter-group-body">
              <div className="filter-options">
                {Object.entries(LEVEL_LABELS).map(([key, label]) => (
                  <label className="filter-checkbox" key={key}>
                    <input type="checkbox" checked={levels.has(key)} onChange={() => toggleLevel(key)} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* County */}
        <div className={`filter-group ${openGroups.county ? 'is-open' : ''}`}>
          <button type="button" className="filter-group-toggle"
            onClick={() => toggleGroup('county')} aria-expanded={openGroups.county}>
            <h4>
              <i className="fas fa-map-marker-alt" aria-hidden="true"></i> County
              {counties.size > 0 ? (
                <span className="fg-count">{counties.size}</span>
              ) : (
                <span className="fg-total">{COUNTIES.length}</span>
              )}
            </h4>
            <i className={`fas fa-chevron-${openGroups.county ? 'up' : 'down'} fg-caret`} aria-hidden="true"></i>
          </button>
          {openGroups.county && (
            <div className="filter-group-body">
              <div className="filter-search">
                <i className="fas fa-search" aria-hidden="true"></i>
                <input type="text" placeholder="Search county..."
                  value={countySearch} onChange={(e) => setCountySearch(e.target.value)}
                  aria-label="Search county" />
              </div>
              <div className="filter-options scrollable">
                {filteredCounties.map((county) => (
                  <label className="filter-checkbox" key={county}>
                    <input type="checkbox" checked={counties.has(county)} onChange={() => toggleCounty(county)} />
                    <span>{county}</span>
                  </label>
                ))}
                {filteredCounties.length === 0 && <div className="ms-empty">No counties match</div>}
              </div>
            </div>
          )}
        </div>

        {/* Preferred opportunity type */}
        <div className={`filter-group ${openGroups.oppType ? 'is-open' : ''}`}>
          <button type="button" className="filter-group-toggle"
            onClick={() => toggleGroup('oppType')} aria-expanded={openGroups.oppType}>
            <h4>
              <i className="fas fa-briefcase" aria-hidden="true"></i> Opportunity type
              {oppTypes.size > 0 && <span className="fg-count">{oppTypes.size}</span>}
            </h4>
            <i className={`fas fa-chevron-${openGroups.oppType ? 'up' : 'down'} fg-caret`} aria-hidden="true"></i>
          </button>
          {openGroups.oppType && (
            <div className="filter-group-body">
              <div className="filter-options">
                {Object.entries(OPP_TYPE_LABELS).map(([key, label]) => (
                  <label className="filter-checkbox" key={key}>
                    <input type="checkbox" checked={oppTypes.has(key)} onChange={() => toggleOppType(key)} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Skills */}
        <div className={`filter-group ${openGroups.skills ? 'is-open' : ''}`}>
          <button type="button" className="filter-group-toggle"
            onClick={() => toggleGroup('skills')} aria-expanded={openGroups.skills}>
            <h4>
              <i className="fas fa-tools" aria-hidden="true"></i> Skills
              {skills.size > 0 && <span className="fg-count">{skills.size}</span>}
            </h4>
            <i className={`fas fa-chevron-${openGroups.skills ? 'up' : 'down'} fg-caret`} aria-hidden="true"></i>
          </button>
          {openGroups.skills && (
            <div className="filter-group-body">
              <div className="filter-search">
                <i className="fas fa-search" aria-hidden="true"></i>
                <input type="text" placeholder="Search skills..."
                  value={skillSearch} onChange={(e) => setSkillSearch(e.target.value)}
                  aria-label="Search skills" />
              </div>
              <div className="filter-options scrollable">
                {filteredSkills.map((skill) => (
                  <label className="filter-checkbox" key={skill}>
                    <input type="checkbox" checked={skills.has(skill)} onChange={() => toggleSkill(skill)} />
                    <span>{skill}</span>
                  </label>
                ))}
                {filteredSkills.length === 0 && <div className="ms-empty">No skills match</div>}
              </div>
            </div>
          )}
        </div>

        {/* Gender */}
        <div className={`filter-group ${openGroups.gender ? 'is-open' : ''}`}>
          <button type="button" className="filter-group-toggle"
            onClick={() => toggleGroup('gender')} aria-expanded={openGroups.gender}>
            <h4>
              <i className="fas fa-venus-mars" aria-hidden="true"></i> Gender
              {genders.size > 0 && <span className="fg-count">{genders.size}</span>}
            </h4>
            <i className={`fas fa-chevron-${openGroups.gender ? 'up' : 'down'} fg-caret`} aria-hidden="true"></i>
          </button>
          {openGroups.gender && (
            <div className="filter-group-body">
              <div className="filter-options">
                <label className="filter-checkbox">
                  <input type="checkbox" checked={genders.has('female')} onChange={() => toggleGender('female')} />
                  <span>Female</span>
                </label>
                <label className="filter-checkbox">
                  <input type="checkbox" checked={genders.has('male')} onChange={() => toggleGender('male')} />
                  <span>Male</span>
                </label>
                <label className="filter-checkbox">
                  <input type="checkbox" checked={genders.has('other')} onChange={() => toggleGender('other')} />
                  <span>Other</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Disability */}
        <div className={`filter-group ${openGroups.disability ? 'is-open' : ''}`}>
          <button type="button" className="filter-group-toggle"
            onClick={() => toggleGroup('disability')} aria-expanded={openGroups.disability}>
            <h4>
              <i className="fas fa-universal-access" aria-hidden="true"></i> Inclusion
              {disabilityOnly && <span className="fg-count">1</span>}
            </h4>
            <i className={`fas fa-chevron-${openGroups.disability ? 'up' : 'down'} fg-caret`} aria-hidden="true"></i>
          </button>
          {openGroups.disability && (
            <div className="filter-group-body">
              <div className="filter-options">
                <label className="filter-checkbox">
                  <input type="checkbox" checked={disabilityOnly} onChange={(e) => setDisability(e.target.checked)} />
                  <span>Persons with disabilities</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Experience */}
        <div className={`filter-group ${openGroups.experience ? 'is-open' : ''}`}>
          <button type="button" className="filter-group-toggle"
            onClick={() => toggleGroup('experience')} aria-expanded={openGroups.experience}>
            <h4>
              <i className="fas fa-hourglass-half" aria-hidden="true"></i> Experience
              {(expMin !== null || expMax !== null) && <span className="fg-count">1</span>}
            </h4>
            <i className={`fas fa-chevron-${openGroups.experience ? 'up' : 'down'} fg-caret`} aria-hidden="true"></i>
          </button>
          {openGroups.experience && (
            <div className="filter-group-body">
              <div className="filter-range">
                <input type="number" placeholder="Min" min="0" max="20"
                  value={expMin ?? ''}
                  onChange={(e) => setExperienceRange(e.target.value === '' ? null : Number(e.target.value), expMax)}
                  aria-label="Minimum years of experience" />
                <span>to</span>
                <input type="number" placeholder="Max" min="0" max="20"
                  value={expMax ?? ''}
                  onChange={(e) => setExperienceRange(expMin, e.target.value === '' ? null : Number(e.target.value))}
                  aria-label="Maximum years of experience" />
              </div>
            </div>
          )}
        </div>

        {/* Age */}
        <div className={`filter-group ${openGroups.age ? 'is-open' : ''}`}>
          <button type="button" className="filter-group-toggle"
            onClick={() => toggleGroup('age')} aria-expanded={openGroups.age}>
            <h4>
              <i className="fas fa-birthday-cake" aria-hidden="true"></i> Age
              {(ageMin !== null || ageMax !== null) && <span className="fg-count">1</span>}
            </h4>
            <i className={`fas fa-chevron-${openGroups.age ? 'up' : 'down'} fg-caret`} aria-hidden="true"></i>
          </button>
          {openGroups.age && (
            <div className="filter-group-body">
              <div className="filter-range">
                <input type="number" placeholder="Min" min="16" max="60"
                  value={ageMin ?? ''}
                  onChange={(e) => setAgeRange(e.target.value === '' ? null : Number(e.target.value), ageMax)}
                  aria-label="Minimum age" />
                <span>to</span>
                <input type="number" placeholder="Max" min="16" max="60"
                  value={ageMax ?? ''}
                  onChange={(e) => setAgeRange(ageMin, e.target.value === '' ? null : Number(e.target.value))}
                  aria-label="Maximum age" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}