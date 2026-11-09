import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import TopBar from '../components/layout/TopBar.jsx'
import BrandRow from '../components/layout/BrandRow.jsx'
import MainNav from '../components/layout/MainNav.jsx'
import Footer from '../components/layout/Footer.jsx'
import { OCCUPATIONS, TREND_VALUES } from '../data/labourMarketData.js'
import '../styles/home.css'
import '../styles/labour-market.css'

const DEMAND_LABEL = { high: 'High demand', medium: 'Steady', emerging: 'Emerging' }
const DEMAND_ORDER = { high: 0, medium: 1, emerging: 2 }

function formatSalary(min, max) {
  return `KES ${min / 1000}K – ${max / 1000}K / month`
}

function demandIcon(d) {
  return d === 'high' ? 'fa-arrow-up' : d === 'medium' ? 'fa-minus' : 'fa-bolt'
}

export default function LabourMarketExplorerPage() {
  const [search, setSearch] = useState('')
  const [demandFilter, setDemandFilter] = useState('all')
  const [sort, setSort] = useState('demand')

  // ===== Derived counts =====
  const counts = useMemo(() => ({
    total: OCCUPATIONS.length,
    high: OCCUPATIONS.filter(o => o.demand === 'high').length,
    medium: OCCUPATIONS.filter(o => o.demand === 'medium').length,
    emerging: OCCUPATIONS.filter(o => o.demand === 'emerging').length,
    avgGrowth: Math.round(OCCUPATIONS.reduce((s, o) => s + o.growth, 0) / OCCUPATIONS.length)
  }), [])

  // ===== Filtering + sorting =====
  const filtered = useMemo(() => {
    let result = OCCUPATIONS.slice()

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(o =>
        o.title.toLowerCase().includes(q) ||
        o.sector.toLowerCase().includes(q) ||
        o.skills.some(s => s.toLowerCase().includes(q)) ||
        o.counties.some(c => c.toLowerCase().includes(q))
      )
    }

    if (demandFilter !== 'all') {
      result = result.filter(o => o.demand === demandFilter)
    }

    switch (sort) {
      case 'demand':
        result.sort((a, b) => DEMAND_ORDER[a.demand] - DEMAND_ORDER[b.demand])
        break
      case 'salary':
        result.sort((a, b) => b.salaryMax - a.salaryMax)
        break
      case 'growth':
        result.sort((a, b) => b.growth - a.growth)
        break
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        break
    }

    return result
  }, [search, demandFilter, sort])

  // ===== Sidebar: sector breakdown =====
  const sectorBreakdown = useMemo(() => {
    const totals = {}
    OCCUPATIONS.forEach(o => {
      totals[o.sector] = (totals[o.sector] || 0) + o.placements
    })
    const entries = Object.entries(totals).sort((a, b) => b[1] - a[1])
    const max = Math.max(...entries.map(e => e[1]), 1)
    return entries.map(([sector, count]) => ({
      sector,
      count,
      pct: Math.round((count / max) * 100)
    }))
  }, [])

  // ===== Sidebar: county ranking =====
  const countyRanking = useMemo(() => {
    const totals = {}
    OCCUPATIONS.forEach(o => {
      o.counties.forEach(c => {
        totals[c] = (totals[c] || 0) + Math.round(o.placements / o.counties.length)
      })
    })
    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([county, count]) => ({ county, count }))
  }, [])

  const handleReset = () => {
    setSearch('')
    setDemandFilter('all')
    setSort('demand')
  }

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <TopBar />
      <BrandRow />
      <MainNav />

      <header className="page-header" id="main-content">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <Link to="/trainees">Trainees</Link>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <Link to="/career-guidance">Career guidance</Link>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span>Labour market explorer</span>
          </div>
          <div className="header-flex">
            <div>
              <div className="header-badges">
                <span className="badge"><i className="fas fa-chart-line"></i> Data-driven career insights</span>
              </div>
              <h1>Labour market explorer</h1>
              <p className="header-sub">
                Explore occupational demand, salary ranges, growth trends and regional distribution across Kenya's TVET sectors. Use the data to make informed decisions about your career pathway.
              </p>
            </div>
            <div className="header-actions">
              <button className="btn btn-light" onClick={() => alert('Exporting labour-market data (demo).')}>
                <i className="fas fa-download"></i> Export data
              </button>
              <button className="btn btn-outline-light" onClick={() => alert('Opening methodology note (demo).')}>
                <i className="fas fa-circle-info"></i> Methodology
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="page-body">
        <div className="container">

          <div className="data-note">
            <i className="fas fa-database"></i>
            <div>
              <strong>Data source:</strong> This explorer draws on aggregated labour-market information from the State Department for Labour and Skills Development, NITA, TVETA, employer surveys and Ujuzi Link placement data. Figures are indicative and updated periodically.{' '}
              <a href="#" onClick={(e) => e.preventDefault()}>Read the methodology</a>.
            </div>
          </div>

          {/* ===== Summary stats ===== */}
          <div className="summary-row">
            <div className="summary-stat">
              <div className="ss-icon purple"><i className="fas fa-briefcase"></i></div>
              <div className="ss-info">
                <div className="ss-num">{counts.total}</div>
                <div className="ss-label">Occupations tracked</div>
              </div>
            </div>
            <div className="summary-stat">
              <div className="ss-icon success"><i className="fas fa-arrow-trend-up"></i></div>
              <div className="ss-info">
                <div className="ss-num">{counts.high}</div>
                <div className="ss-label">In high demand</div>
              </div>
            </div>
            <div className="summary-stat">
              <div className="ss-icon info"><i className="fas fa-map-marked-alt"></i></div>
              <div className="ss-info">
                <div className="ss-num">47</div>
                <div className="ss-label">Counties covered</div>
              </div>
            </div>
            <div className="summary-stat">
              <div className="ss-icon warning"><i className="fas fa-chart-line"></i></div>
              <div className="ss-info">
                <div className="ss-num">+{counts.avgGrowth}%</div>
                <div className="ss-label">Avg. sector growth</div>
              </div>
            </div>
          </div>

          {/* ===== Toolbar ===== */}
          <div className="explorer-toolbar">
            <div className="toolbar-left">
              <h2>
                <i className="fas fa-search"></i> Occupational explorer{' '}
                <span className="count-pill">{filtered.length}</span>
              </h2>
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search occupations, skills or sectors..."
                />
              </div>
            </div>
            <div className="toolbar-right">
              <div className="filter-chips">
                {['all', 'high', 'medium', 'emerging'].map(d => {
                  const label = d === 'all' ? 'All' : (d === 'medium' ? 'Steady' : (d === 'emerging' ? 'Emerging' : 'High demand'))
                  const count = d === 'all' ? counts.total : counts[d]
                  return (
                    <button
                      key={d}
                      className={`filter-chip ${demandFilter === d ? 'active' : ''}`}
                      onClick={() => setDemandFilter(d)}
                    >
                      {label} <span className="chip-count">{count}</span>
                    </button>
                  )
                })}
              </div>
              <div className="sort-select">
                <label style={{ fontWeight: 600 }}>Sort:</label>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="demand">Demand (high first)</option>
                  <option value="salary">Salary (high first)</option>
                  <option value="growth">Growth (high first)</option>
                  <option value="title">Title (A–Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* ===== Main layout ===== */}
          <div className="explorer-layout">
            
            <div className="explorer-main">
              {filtered.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-search"></i>
                  <h3>No occupations match your filters</h3>
                  <p>Try adjusting your search or demand filter to find what you're looking for.</p>
                  <button className="btn btn-primary" onClick={handleReset}>
                    <i className="fas fa-undo"></i> Reset filters
                  </button>
                </div>
              ) : (
                <div className="occupations-grid">
                  {filtered.map(o => {
                    const growthIcon = o.growthTrend === 'up' ? 'fa-arrow-trend-up'
                      : o.growthTrend === 'down' ? 'fa-arrow-trend-down'
                      : 'fa-minus'
                    const growthClass = o.growthTrend === 'up' ? 'growth-up'
                      : o.growthTrend === 'down' ? 'growth-down'
                      : 'growth-flat'
                    const barPct = Math.min(100, Math.round((o.growth / 35) * 100))
                    return (
                      <article
                        key={o.key}
                        className="occupation-card"
                        onClick={() => alert(`Opening details for ${o.title} (demo).`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            alert(`Opening details for ${o.title} (demo).`)
                          }
                        }}
                      >
                        <div className="occupation-card-header">
                          <div className={`occ-icon ${o.iconClass}`}>
                            <i className={`fas ${o.icon}`}></i>
                          </div>
                          <div className="occ-title-wrap">
                            <h3>{o.title}</h3>
                            <p>{o.sector}</p>
                          </div>
                          <span className={`demand-badge ${o.demand}`}>
                            <i className={`fas ${demandIcon(o.demand)}`}></i> {DEMAND_LABEL[o.demand]}
                          </span>
                        </div>
                        <div className="occupation-card-body">
                          <div className="occ-salary">
                            <i className="fas fa-money-bill-wave"></i>{' '}
                            <strong>{formatSalary(o.salaryMin, o.salaryMax)}</strong>
                          </div>
                          <div className="occ-growth-row">
                            <span><i className="fas fa-chart-line"></i> Annual growth</span>
                            <span className={growthClass}>
                              <i className={`fas ${growthIcon}`}></i> +{o.growth}% / yr
                            </span>
                          </div>
                          <div className="occ-mini-bar">
                            <div className={`fill ${o.demand}`} style={{ width: `${barPct}%` }}></div>
                          </div>
                          <div className="occ-tags">
                            {o.skills.slice(0, 3).map(s => <span key={s} className="occ-tag">{s}</span>)}
                            {o.skills.length > 3 && <span className="occ-tag">+{o.skills.length - 3}</span>}
                          </div>
                        </div>
                        <div className="occupation-card-footer">
                          <span className="occ-counties">
                            <i className="fas fa-map-marker-alt"></i>{' '}
                            {o.counties.length} counties · {o.placements} placements
                          </span>
                          <span className="occ-detail-link">
                            Explore <i className="fas fa-arrow-right"></i>
                          </span>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </div>

            <aside className="explorer-sidebar">

              {/* Sector breakdown */}
              <div className="sidebar-card">
                <h3><i className="fas fa-chart-pie"></i> Demand by sector</h3>
                <div className="sector-bars">
                  {sectorBreakdown.map(({ sector, count, pct }) => (
                    <div className="sector-bar-row" key={sector}>
                      <span className="sector-bar-name" title={sector}>{sector}</span>
                      <div className="sector-bar-track">
                        <div className="sector-bar-fill" style={{ width: `${pct}%` }}></div>
                      </div>
                      <span className="sector-bar-val">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trend card */}
              <div className="trend-card">
                <div className="tc-label">
                  <i className="fas fa-arrow-trend-up"></i> Overall outlook
                </div>
                <h3>Kenya's TVET sectors are growing</h3>
                <p>Demand for skilled technical workers is rising across all sectors, with the fastest growth in ICT, renewable energy and construction.</p>
                <div className="trend-sparkline">
                  {TREND_VALUES.map((v, i) => {
                    const max = Math.max(...TREND_VALUES)
                    const h = Math.round((v / max) * 100)
                    return (
                      <div
                        key={i}
                        className={`trend-spark-bar ${i === TREND_VALUES.length - 1 ? 'latest' : ''}`}
                        style={{ height: `${Math.max(12, h)}%` }}
                        title={`Year ${i + 1}: index ${v}`}
                      ></div>
                    )
                  })}
                </div>
                <button className="btn btn-light" onClick={() => alert('Opening the full labour-market report (demo).')}>
                  <i className="fas fa-file-lines"></i> Read the full report
                </button>
              </div>

              {/* Top counties */}
              <div className="sidebar-card">
                <h3><i className="fas fa-map-location-dot"></i> Top counties for opportunity</h3>
                <div className="county-list">
                  {countyRanking.map(({ county, count }, i) => (
                    <div className="county-item" key={county}>
                      <span className="county-item-name">
                        <i className="fas fa-map-marker-alt"></i> {i + 1}. {county}
                      </span>
                      <span className="county-item-val">{count} placements</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick links */}
              <div className="sidebar-card">
                <h3><i className="fas fa-compass"></i> Related tools</h3>
                <div className="quick-link-list">
                  <Link to="/career-assessment" className="quick-link-item">
                    <i className="fas fa-compass"></i> Career self-assessment
                  </Link>
                  <Link to="/career-guidance" className="quick-link-item">
                    <i className="fas fa-graduation-cap"></i> Career guidance hub
                  </Link>
                  <Link to="/opportunities" className="quick-link-item">
                    <i className="fas fa-search"></i> Search opportunities
                  </Link>
                  <Link to="/cv-builder" className="quick-link-item">
                    <i className="fas fa-file-signature"></i> Build your CV
                  </Link>
                </div>
              </div>

            </aside>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}