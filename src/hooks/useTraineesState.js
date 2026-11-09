import { useCallback, useMemo, useState } from 'react'
import { TRAINEES, PER_PAGE } from '../data/traineesData.js'

export function useTraineesState() {
  const [search, setSearch] = useState('')
  const [availability, setAvailability] = useState(new Set())
  const [sectors, setSectors] = useState(new Set())
  const [levels, setLevels] = useState(new Set())
  const [counties, setCounties] = useState(new Set())
  const [oppTypes, setOppTypes] = useState(new Set())
  const [skills, setSkills] = useState(new Set())
  const [genders, setGenders] = useState(new Set())
  const [disabilityOnly, setDisabilityOnly] = useState(false)
  const [expMin, setExpMin] = useState(null)
  const [expMax, setExpMax] = useState(null)
  const [ageMin, setAgeMin] = useState(null)
  const [ageMax, setAgeMax] = useState(null)
  const [sort, setSort] = useState('relevance')
  const [view, setView] = useState('grid')
  const [page, setPage] = useState(1)

  const makeToggle = (setter) => (value) => {
    setter((prev) => {
      const next = new Set(prev)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return next
    })
    setPage(1)
  }

  const toggleAvailability = makeToggle(setAvailability)
  const toggleSector = makeToggle(setSectors)
  const toggleLevel = makeToggle(setLevels)
  const toggleCounty = makeToggle(setCounties)
  const toggleOppType = makeToggle(setOppTypes)
  const toggleSkill = makeToggle(setSkills)
  const toggleGender = makeToggle(setGenders)

  const setDisability = (value) => {
    setDisabilityOnly(value)
    setPage(1)
  }
  const setExperienceRange = (min, max) => {
    setExpMin(min)
    setExpMax(max)
    setPage(1)
  }
  const setAgeRange = (min, max) => {
    setAgeMin(min)
    setAgeMax(max)
    setPage(1)
  }

  const resetAll = useCallback(() => {
    setSearch('')
    setAvailability(new Set())
    setSectors(new Set())
    setLevels(new Set())
    setCounties(new Set())
    setOppTypes(new Set())
    setSkills(new Set())
    setGenders(new Set())
    setDisabilityOnly(false)
    setExpMin(null)
    setExpMax(null)
    setAgeMin(null)
    setAgeMax(null)
    setPage(1)
  }, [])

  const removeFilter = (key, value) => {
    if (key === 'search') setSearch('')
    else if (key === 'availability') setAvailability((p) => { const n = new Set(p); n.delete(value); return n })
    else if (key === 'sector') setSectors((p) => { const n = new Set(p); n.delete(value); return n })
    else if (key === 'level') setLevels((p) => { const n = new Set(p); n.delete(value); return n })
    else if (key === 'county') setCounties((p) => { const n = new Set(p); n.delete(value); return n })
    else if (key === 'oppType') setOppTypes((p) => { const n = new Set(p); n.delete(value); return n })
    else if (key === 'skill') setSkills((p) => { const n = new Set(p); n.delete(value); return n })
    else if (key === 'gender') setGenders((p) => { const n = new Set(p); n.delete(value); return n })
    else if (key === 'disability') setDisabilityOnly(false)
    else if (key === 'experience') { setExpMin(null); setExpMax(null) }
    else if (key === 'age') { setAgeMin(null); setAgeMax(null) }
    setPage(1)
  }

  const filtered = useMemo(() => {
    let results = TRAINEES.slice()

    if (search.trim()) {
      const q = search.toLowerCase().trim()
      results = results.filter(
        (t) =>
          `${t.firstName} ${t.lastName}`.toLowerCase().includes(q) ||
          t.course.toLowerCase().includes(q) ||
          t.institution.toLowerCase().includes(q) ||
          t.sector.toLowerCase().includes(q) ||
          t.county.toLowerCase().includes(q) ||
          t.skills.some((s) => s.toLowerCase().includes(q))
      )
    }

    if (availability.size > 0) results = results.filter((t) => availability.has(t.availability))
    if (sectors.size > 0) results = results.filter((t) => sectors.has(t.sector))
    if (levels.size > 0) results = results.filter((t) => levels.has(t.level))
    if (counties.size > 0) results = results.filter((t) => counties.has(t.county))
    if (oppTypes.size > 0) results = results.filter((t) => t.preferredTypes.some((pt) => oppTypes.has(pt)))
    if (skills.size > 0) results = results.filter((t) => t.skills.some((s) => skills.has(s)))
    if (genders.size > 0) results = results.filter((t) => genders.has(t.gender))
    if (disabilityOnly) results = results.filter((t) => t.disability)

    if (expMin !== null) results = results.filter((t) => t.experience >= expMin)
    if (expMax !== null) results = results.filter((t) => t.experience <= expMax)
    if (ageMin !== null) results = results.filter((t) => t.age >= ageMin)
    if (ageMax !== null) results = results.filter((t) => t.age <= ageMax)

    switch (sort) {
      case 'newest':
        results.sort((a, b) => new Date(b.added) - new Date(a.added))
        break
      case 'name':
        results.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`))
        break
      case 'institution':
        results.sort((a, b) => a.institution.localeCompare(b.institution))
        break
      case 'experience':
        results.sort((a, b) => b.experience - a.experience)
        break
      case 'relevance':
      default:
        break
    }

    return results
  }, [search, availability, sectors, levels, counties, oppTypes, skills, genders, disabilityOnly, expMin, expMax, ageMin, ageMax, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * PER_PAGE
  const paginated = filtered.slice(start, start + PER_PAGE)

  const activeCount = useMemo(() => {
    let n = availability.size + sectors.size + levels.size + counties.size + oppTypes.size + skills.size + genders.size
    if (disabilityOnly) n += 1
    if (expMin !== null || expMax !== null) n += 1
    if (ageMin !== null || ageMax !== null) n += 1
    return n
  }, [availability, sectors, levels, counties, oppTypes, skills, genders, disabilityOnly, expMin, expMax, ageMin, ageMax])

  return {
    filtered,
    paginated,
    totalCount: filtered.length,
    totalPages,
    page: safePage,
    setPage,
    perPage: PER_PAGE,
    search,
    setSearch,
    sort,
    setSort,
    view,
    setView,
    toggleAvailability,
    toggleSector,
    toggleLevel,
    toggleCounty,
    toggleOppType,
    toggleSkill,
    toggleGender,
    setDisability,
    setExperienceRange,
    setAgeRange,
    availability,
    sectors,
    levels,
    counties,
    oppTypes,
    skills,
    genders,
    disabilityOnly,
    expMin,
    expMax,
    ageMin,
    ageMax,
    activeCount,
    removeFilter,
    resetAll
  }
}