import { TYPE_SHORT, DURATION_LABELS } from '../../data/opportunitiesData.js'

export default function ActiveFilters({ state }) {
  const {
    search,
    types,
    institutions,
    counties,
    sectors,
    durations,
    deadlines,
    stipendOnly,
    removeFilter
  } = state

  const chips = []

  if (search.trim()) {
    chips.push({ label: `Search: "${search}"`, key: 'search', value: null })
  }
  types.forEach((t) =>
    chips.push({ label: `Type: ${TYPE_SHORT[t] || t}`, key: 'type', value: t })
  )
  institutions.forEach((i) =>
    chips.push({ label: `Institution: ${i}`, key: 'institution', value: i })
  )
  counties.forEach((c) =>
    chips.push({ label: `County: ${c}`, key: 'county', value: c })
  )
  sectors.forEach((s) =>
    chips.push({ label: `Sector: ${s}`, key: 'sector', value: s })
  )
  durations.forEach((d) =>
    chips.push({ label: `Duration: ${DURATION_LABELS[d] || d}`, key: 'duration', value: d })
  )
  if (stipendOnly) chips.push({ label: 'Paid only', key: 'stipend', value: null })
  deadlines.forEach((d) => {
    const labels = {
      urgent: 'Closing in 72 hrs',
      week: 'Closing this week',
      month: 'Closing this month'
    }
    chips.push({ label: labels[d] || d, key: 'deadline', value: d })
  })

  if (chips.length === 0) return null

  return (
    <div className="active-filters">
      {chips.map((chip, idx) => (
        <span className="active-filter-chip" key={`${chip.key}-${chip.value ?? idx}`}>
          {chip.label}{' '}
          <button
            type="button"
            aria-label="Remove filter"
            onClick={() => removeFilter(chip.key, chip.value)}
          >
            <i className="fas fa-times"></i>
          </button>
        </span>
      ))}
    </div>
  )
}