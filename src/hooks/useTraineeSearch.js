import { useMemo, useState, useCallback } from 'react'
import { TRAINEES } from '../data/traineesData.js'

const PER_PAGE = 6

const createToggle = (setter) => (value) =>
  setter((prev) => {
    const next = new Set(prev)
    next.has(value) ? next.delete(value) : next.add(value)
    return next
  })

export default function useTraineeSearch() {
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

  const toggleAvailability = useCallback(createToggle(setAvailability), [])
  const toggleSector = useCallback(createToggle(setSectors), [])
  const toggleLevel = useCallback(createToggle(setLevels), [])
  const toggleCounty = useCallback(createToggle(setCounties), [])
  const toggleOppType = useCallback(createToggle(setOppTypes), [])
  const toggleSkill = useCallback(createToggle(setSkills), [])
  const toggleGender = useCallback(createToggle(setGenders), [])

  const setDisability = useCallback((checked) => {
    setDisabilityOnly(checked)
    setPage(1)
  }, [])

  const setExperienceRange = useCallback((min, max) => {
    setExpMin(min)
    setExpMax(max)
    setPage(1)
  }, [])

  const setAgeRange = useCallback((min, max) => {
    setAgeMin(min)
    setAgeMax(max)
    setPage(1)
  }, [])

  const handleSearchChange = useCallback((value) => {
    setSearch(value)
    setPage(1)
  }, [])

  const handleSortChange = useCallback((value) => {
    setSort(value)
    setPage(1)
  }, [])

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
    setSort('relevance')
    setPage(1)
  }, [])

  const removeFilter = useCallback((key, value) => {
    switch (key) {
      case 'search':
        setSearch('')
        break
      case 'availability':
        setAvailability((prev) => { const n = new Set(prev); n.delete(value); return n })
        break
      case 'sector':
        setSectors((prev) => { const n = new Set(prev); n.delete(value); return n })
        break
      case 'level':
        setLevels((prev) => { const n = new Set(prev); n.delete(value); return n })
        break
      case 'county':
        setCounties((prev) => { const n = new Set(prev); n.delete(value); return n })
        break
      case 'oppType':
        setOppTypes((prev) => { const n = new Set(prev); n.delete(value); return n })
        break
      case 'skill':
        setSkills((prev) => { const n = new Set(prev); n.delete(value); return n })
        break
      case 'gender':
        setGenders((prev) => { const n = new Set(prev); n.delete(value); return n })
        break
      case 'disability':
        setDisabilityOnly(false)
        break
      case 'experience':
        setExpMin(null)
        setExpMax(null)
        break
      case 'age':
        setAgeMin(null)
        setAgeMax(null)
        break
      default:
        break
    }
    setPage(1)
  }, [])

  const activeCount = useMemo(() => {
    return (
      (search.trim() ? 1 : 0) +
      availability.size + sectors.size + levels.size + counties.size +
      oppTypes.size + skills.size + genders.size +
      (disabilityOnly ? 1 : 0) +
      (expMin !== null || expMax !== null ? 1 : 0) +
      (ageMin !== null || ageMax !== null ? 1 : 0)
    )
  }, [search, availability, sectors, levels, counties, oppTypes, skills, genders, disabilityOnly, expMin, expMax, ageMin, ageMax])

  const filtered = useMemo(() => {
    let results = TRAINEES.slice()

    if (search.trim()) {
      const q = search.toLowerCase().trim()
      results = results.filter((t) =>
        `${t.firstName} ${t.lastName}`.toLowerCase().includes(q) ||
        t.course.toLowerCase().includes(q) ||
        t.institution.toLowerCase().includes(q) ||
        t.sector.toLowerCase().includes(q) ||
        t.county.toLowerCase().includes(q) ||
        t.skills.some((s) => s.toLowerCase().includes(q))
      )
    }
    if (availability.size) results = results.filter((t) => availability.has(t.availability))
    if (sectors.size) results = results.filter((t) => sectors.has(t.sector))
    if (levels.size) results = results.filter((t) => levels.has(t.level))
    if (counties.size) results = results.filter((t) => counties.has(t.county))
    if (oppTypes.size) results = results.filter((t) => t.preferredTypes.some((pt) => oppTypes.has(pt)))
    if (skills.size) results = results.filter((t) => t.skills.some((s) => skills.has(s)))
    if (genders.size) results = results.filter((t) => genders.has(t.gender))
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
        results.sort((a, b) =>
          `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`))
        break
      case 'institution':
        results.sort((a, b) => a.institution.localeCompare(b.institution))
        break
      case 'experience':
        results.sort((a, b) => b.experience - a.experience)
        break
      default:
        break
    }

    return results
  }, [search, availability, sectors, levels, counties, oppTypes, skills, genders, disabilityOnly, expMin, expMax, ageMin, ageMax, sort])

  const totalCount = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const paginated = useMemo(
    () => filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE),
    [filtered, safePage]
  )

  return {
    // state
    search, availability, sectors, levels, counties, oppTypes, skills, genders,
    disabilityOnly, expMin, expMax, ageMin, ageMax, sort, view, page: safePage,
    // derived
    activeCount, paginated, totalCount, totalPages,
    // setters / actions
    handleSearchChange,
    handleSortChange,
    setView,
    setPage,
    toggleAvailability, toggleSector, toggleLevel, toggleCounty,
    toggleOppType, toggleSkill, toggleGender,
    setDisability, setExperienceRange, setAgeRange,
    removeFilter, resetAll
  }
}