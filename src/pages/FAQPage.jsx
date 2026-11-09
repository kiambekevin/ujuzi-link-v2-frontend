import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import TopBar from '../components/layout/TopBar.jsx'
import BrandRow from '../components/layout/BrandRow.jsx'
import MainNav from '../components/layout/MainNav.jsx'
import Footer from '../components/layout/Footer.jsx'
import { FAQS, CATEGORY_LABELS, CATEGORY_ICONS } from '../data/faqsData.js'
import '../styles/home.css'
import '../styles/faq.css'

const CATEGORY_ORDER = ['general', 'trainee', 'employer', 'institution', 'security']

const QUICK_LINKS = [
  { jump: 'trainee', icon: 'fa-user-graduate', title: "I'm a trainee", desc: 'Applying, profiles, documents, insurance and logbooks.' },
  { jump: 'employer', icon: 'fa-building', title: "I'm an employer", desc: 'Posting opportunities, applications, supervision and assessments.' },
  { jump: 'institution', icon: 'fa-university', title: "I'm an institution", desc: 'Verification, approvals, supervisors and completion records.' }
]

export default function FAQPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [open, setOpen] = useState(new Set())

  // ===== Counts per category =====
  const counts = useMemo(() => {
    const c = { all: FAQS.length }
    CATEGORY_ORDER.forEach(cat => {
      c[cat] = FAQS.filter(f => f.category === cat).length
    })
    return c
  }, [])

  // ===== Filter =====
  const filtered = useMemo(() => {
    let result = FAQS.slice()
    if (category !== 'all') result = result.filter(f => f.category === category)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(f =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().replace(/<[^>]*>/g, ' ').includes(q)
      )
    }
    return result
  }, [search, category])

  const toggleItem = (id) => {
    setOpen(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const expandAll = () => {
    setOpen(new Set(filtered.map(f => f.id)))
  }

  const collapseAll = () => {
    setOpen(new Set())
  }

  const resetFilters = () => {
    setSearch('')
    setCategory('all')
    setOpen(new Set())
  }

  const handleQuickLink = (jump) => {
    setCategory(jump)
    setSearch('')
    document.querySelector('.faq-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Group filtered FAQs by category
  const grouped = useMemo(() => {
    const map = {}
    CATEGORY_ORDER.forEach(cat => {
      const items = filtered.filter(f => f.category === cat)
      if (items.length > 0) map[cat] = items
    })
    return map
  }, [filtered])

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
            <Link to="#">Help</Link>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span>FAQs</span>
          </div>
          <div className="header-badges">
            <span className="badge"><i className="fas fa-circle-question"></i> Frequently asked questions</span>
            <span className="badge"><i className="fas fa-headset"></i> Help &amp; support</span>
          </div>
          <h1>How can we help you?</h1>
          <p className="header-sub">
            Find answers to common questions about using Ujuzi Link - whether you are a trainee looking for a placement, an employer hosting trainees, or a TVET institution supporting learners.
          </p>

          <form className="faq-search" onSubmit={(e) => e.preventDefault()}>
            <div className="input-wrapper">
              <i className="fas fa-search" aria-hidden="true"></i>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search FAQs - e.g. insurance, apply, stipend, verification..."
                autoComplete="off"
                aria-label="Search frequently asked questions"
              />
            </div>
            <button type="submit" className="btn btn-accent">
              <i className="fas fa-search" aria-hidden="true"></i> Search
            </button>
          </form>
        </div>
      </header>

      <div className="page-body">
        <div className="container">

          {/* Quick links */}
          <div className="quick-links-grid">
            {QUICK_LINKS.map(ql => (
              <button
                key={ql.jump}
                className="quick-link-card"
                onClick={() => handleQuickLink(ql.jump)}
              >
                <div className="ql-icon"><i className={`fas ${ql.icon}`}></i></div>
                <div className="ql-body">
                  <h3>{ql.title}</h3>
                  <p>{ql.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="faq-layout">

            {/* Category sidebar */}
            <aside>
              <div className="category-panel">
                <h2><i className="fas fa-layer-group"></i> Categories</h2>
                <ul className="category-list">
                  <li>
                    <button
                      className={category === 'all' ? 'active' : ''}
                      onClick={() => setCategory('all')}
                    >
                      <span className="cat-left">
                        <i className="fas fa-list"></i> All questions
                      </span>
                      <span className="cat-count">{counts.all}</span>
                    </button>
                  </li>
                  {CATEGORY_ORDER.map(cat => (
                    <li key={cat}>
                      <button
                        className={category === cat ? 'active' : ''}
                        onClick={() => setCategory(cat)}
                      >
                        <span className="cat-left">
                          <i className={`fas ${CATEGORY_ICONS[cat]}`}></i> {CATEGORY_LABELS[cat]}
                        </span>
                        <span className="cat-count">{counts[cat]}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* FAQ content */}
            <div className="faq-content">
              <div className="results-meta">
                <div className="rm-count">
                  Showing <strong>{filtered.length}</strong> questions
                </div>
                <div className="rm-actions">
                  <button className="btn btn-ghost" onClick={expandAll}>
                    <i className="fas fa-angles-down"></i> Expand all
                  </button>
                  <button className="btn btn-ghost" onClick={collapseAll}>
                    <i className="fas fa-angles-up"></i> Collapse all
                  </button>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="faq-empty">
                  <i className="fas fa-circle-question"></i>
                  <h3>No matching questions</h3>
                  <p>We couldn't find any FAQs that match your search. Try different keywords or browse all categories.</p>
                  <button className="btn btn-primary" onClick={resetFilters}>
                    <i className="fas fa-undo"></i> Clear search &amp; filters
                  </button>
                </div>
              ) : (
                Object.entries(grouped).map(([cat, items]) => (
                  <section className="faq-group" key={cat}>
                    <div className="faq-group-head">
                      <div className="fg-icon">
                        <i className={`fas ${CATEGORY_ICONS[cat]}`}></i>
                      </div>
                      <h2>{CATEGORY_LABELS[cat]}</h2>
                      <span className="fg-count">{items.length}</span>
                    </div>
                    <div className="accordion">
                      {items.map(faq => {
                        const isOpen = open.has(faq.id)
                        return (
                          <div className={`acc-item ${isOpen ? 'open' : ''}`} key={faq.id}>
                            <button
                              className="acc-trigger"
                              onClick={() => toggleItem(faq.id)}
                              aria-expanded={isOpen}
                              aria-controls={`panel-${faq.id}`}
                            >
                              <span className="acc-q-icon">Q</span>
                              <span className="acc-q-text">{faq.question}</span>
                              <i className="fas fa-chevron-down acc-chevron"></i>
                            </button>
                            <div
                              className="acc-panel"
                              id={`panel-${faq.id}`}
                              role="region"
                            >
                              <div
                                className="acc-panel-inner"
                                dangerouslySetInnerHTML={{ __html: faq.answer }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </section>
                ))
              )}
            </div>
          </div>

          {/* Help CTA */}
          <div className="help-cta">
            <div>
              <h2>Still need help?</h2>
              <p>Our support team is here to assist trainees, employers and institutions. Reach out and we'll respond as quickly as possible.</p>
            </div>
            <div className="cta-actions">
              <button
                className="btn btn-light"
                onClick={() => alert('Contact support form would open here (demo).')}
              >
                <i className="fas fa-envelope"></i> Contact support
              </button>
              <button
                className="btn btn-outline-light"
                onClick={() => alert('Navigating to user guides (demo).')}
              >
                <i className="fas fa-book-open"></i> User guides
              </button>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  )
}