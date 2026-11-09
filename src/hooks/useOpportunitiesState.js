import { useCallback, useMemo, useState } from 'react'
import {
  OPPORTUNITIES,
  hoursUntilDeadline
} from '../data/opportunitiesData.js'

export const PER_PAGE = 6

export function useOpportunitiesState() {
  const [search, setSearch] = useState('')
  const [types, setTypes] = useState(new Set())
  const [institutions, setInstitutions] = useState(new Set())
  const [counties, setCounties] = useState(new Set())
  const [sectors, setSectors] = useState(new Set())
  const [durations, setDurations] = useState(new Set())
  const [stipendOnly, setStipendOnly] = useState(false)
  const [deadlines, setDeadlines] = useState(new Set())
  const [sort, setSort] = useState('newest')
  const [view, setView] = useState('grid')
  const [page, setPage] = useState(1)
  const [searchModalOpen, setSearchModalOpen] = useState(false)

  const toggleSet = (setter) => (value) => {
    setter((prev) => {
      const next = new Set(prev)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return next
    })
    setPage(1)
  }

  const resetAll = useCallback(() => {
    setSearch('')
    setTypes(new Set())
    setInstitutions(new Set())
    setCounties(new Set())
    setSectors(new Set())
    setDurations(new Set())
    setStipendOnly(false)
    setDeadlines(new Set())
    setPage(1)
  }, [])

  const filtered = useMemo(() => {
    let results = OPPORTUNITIES.slice()

    if (search.trim()) {
      const q = search.toLowerCase().trim()
      results = results.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.employer.toLowerCase().includes(q) ||
          o.county.toLowerCase().includes(q) ||
          o.sector.toLowerCase().includes(q) ||
          o.institution.toLowerCase().includes(q) ||
          o.institutionAbbr.toLowerCase().includes(q) ||
          o.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    if (types.size > 0) results = results.filter((o) => types.has(o.type))
    if (institutions.size > 0)
      results = results.filter((o) => institutions.has(o.institution))
    if (counties.size > 0) results = results.filter((o) => counties.has(o.county))
    if (sectors.size > 0) results = results.filter((o) => sectors.has(o.sector))

    if (durations.size > 0) {
      results = results.filter((o) => {
        const d = o.duration
        if (durations.has('short') && d >= 1 && d <= 3) return true
        if (durations.has('medium') && d >= 4 && d <= 6) return true
        if (durations.has('long') && d >= 7 && d <= 12) return true
        if (durations.has('extended') && d > 12) return true
        return false
      })
    }

    if (stipendOnly) results = results.filter((o) => o.stipend)

    if (deadlines.size > 0) {
      results = results.filter((o) => {
        const hrs = hoursUntilDeadline(o.deadline)
        const days = hrs / 24
        if (deadlines.has('urgent') && hrs >= 0 && hrs <= 72) return true
        if (deadlines.has('week') && days >= 0 && days <= 7) return true
        if (deadlines.has('month') && days >= 0 && days <= 30) return true
        return false
      })
    }

    switch (sort) {
      case 'newest':
        results.sort((a, b) => new Date(b.posted) - new Date(a.posted))
        break
      case 'deadline':
        results.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        break
      case 'title':
        results.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'employer':
        results.sort((a, b) => a.employer.localeCompare(b.employer))
        break
      case 'institution':
        results.sort((a, b) => a.institution.localeCompare(b.institution))
        break
      default:
        break
    }

    return results
  }, [search, types, institutions, counties, sectors, durations, stipendOnly, deadlines, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * PER_PAGE
  const paginated = filtered.slice(start, start + PER_PAGE)

  const toggleType = toggleSet(setTypes)
  const toggleInstitution = toggleSet(setInstitutions)
  const toggleCounty = toggleSet(setCounties)
  const toggleSector = toggleSet(setSectors)
  const toggleDuration = toggleSet(setDurations)
  const toggleDeadline = toggleSet(setDeadlines)

  const removeFilter = (key, value) => {
    if (key === 'search') setSearch('')
    else if (key === 'type') setTypes((p) => { const n = new Set(p); n.delete(value); return n })
    else if (key === 'institution') setInstitutions((p) => { const n = new Set(p); n.delete(value); return n })
    else if (key === 'county') setCounties((p) => { const n = new Set(p); n.delete(value); return n })
    else if (key === 'sector') setSectors((p) => { const n = new Set(p); n.delete(value); return n })
    else if (key === 'duration') setDurations((p) => { const n = new Set(p); n.delete(value); return n })
    else if (key === 'deadline') setDeadlines((p) => { const n = new Set(p); n.delete(value); return n })
    else if (key === 'stipend') setStipendOnly(false)
    setPage(1)
  }

  const openSearch = useCallback(() => setSearchModalOpen(true), [])
  const closeSearch = useCallback(() => setSearchModalOpen(false), [])
  const submitSearch = useCallback((value) => {
    setSearch(value)
    setPage(1)
    setSearchModalOpen(false)
  }, [])

  return {
    // raw data
    opportunities: OPPORTUNITIES,
    filtered,
    paginated,
    // search
    search,
    setSearch,
    submitSearch,
    // filters
    types,
    institutions,
    counties,
    sectors,
    durations,
    deadlines,
    stipendOnly,
    setStipendOnly,
    toggleType,
    toggleInstitution,
    toggleCounty,
    toggleSector,
    toggleDuration,
    toggleDeadline,
    removeFilter,
    resetAll,
    // sort & view
    sort,
    setSort,
    view,
    setView,
    // pagination
    page: safePage,
    setPage,
    totalPages,
    totalCount: filtered.length,
    perPage: PER_PAGE,
    // search modal (brand row search)
    searchModalOpen,
    openSearch,
    closeSearch
  }
}