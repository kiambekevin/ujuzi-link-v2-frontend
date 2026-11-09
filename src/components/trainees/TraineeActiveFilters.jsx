import {
  AVAILABILITY_LABELS,
  LEVEL_LABELS,
  OPP_TYPE_LABELS
} from '../../data/traineesData.js'

export default function TraineeActiveFilters({ state }) {
  const {
    search, availability, sectors, levels, counties, oppTypes, skills, genders,
    disabilityOnly, expMin, expMax, ageMin, ageMax, removeFilter
  } = state

  const chips = []

  if (search.trim()) chips.push({ label: `Search: "${search}"`, key: 'search', value: null })
  availability.forEach((v) => chips.push({ label: `Availability: ${AVAILABILITY_LABELS[v] || v}`, key: 'availability', value: v }))
  sectors.forEach((s) => chips.push({ label: `Sector: ${s}`, key: 'sector', value: s }))
  levels.forEach((l) => chips.push({ label: `Level: ${LEVEL_LABELS[l] || l}`, key: 'level', value: l }))
  counties.forEach((c) => chips.push({ label: `County: ${c}`, key: 'county', value: c }))
  oppTypes.forEach((o) => chips.push({ label: `Type: ${OPP_TYPE_LABELS[o] || o}`, key: 'oppType', value: o }))
  skills.forEach((s) => chips.push({ label: `Skill: ${s}`, key: 'skill', value: s }))
  genders.forEach((g) => chips.push({ label: `Gender: ${g}`, key: 'gender', value: g }))
  if (disabilityOnly) chips.push({ label: 'Persons with disabilities', key: 'disability', value: null })
  if (expMin !== null || expMax !== null) {
    const min = expMin ?? 0
    const max = expMax ?? '∞'
    chips.push({ label: `Experience: ${min}–${max} yrs`, key: 'experience', value: null })
  }
  if (ageMin !== null || ageMax !== null) {
    const min = ageMin ?? 16
    const max = ageMax ?? '∞'
    chips.push({ label: `Age: ${min}–${max}`, key: 'age', value: null })
  }

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