import { useEffect, useRef } from 'react'

export default function SearchModal({ isOpen, onClose }) {
  const modalRef = useRef(null)
  const keywordRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => keywordRef.current?.focus(), 100)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="modal-overlay active"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-content" ref={modalRef} role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2>
            <i className="fas fa-search" aria-hidden="true"></i> Find a placement
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close search modal">
            <i className="fas fa-times" aria-hidden="true"></i>
          </button>
        </div>
        <div className="modal-body">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              alert('Search submitted! (Demo)')
            }}
          >
            <div className="search-field">
              <label htmlFor="searchKeyword">Keyword or occupation</label>
              <div className="search-input-wrapper">
                <i className="fas fa-search" aria-hidden="true"></i>
                <input
                  type="text"
                  id="searchKeyword"
                  ref={keywordRef}
                  placeholder="e.g. Electrical, Software, Nursing, Agriculture..."
                  autoComplete="off"
                />
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-search" aria-hidden="true"></i> Search
                </button>
              </div>
            </div>

            <div className="filter-grid">
              <div className="filter-group">
                <label htmlFor="filterType">Opportunity type</label>
                <select id="filterType">
                  <option value="">All types</option>
                  <option value="attachment">Industrial attachment</option>
                  <option value="internship">Internship</option>
                  <option value="apprenticeship">Apprenticeship</option>
                  <option value="dual">Dual training</option>
                </select>
              </div>
              <div className="filter-group">
                <label htmlFor="filterCounty">County</label>
                <select id="filterCounty">
                  <option value="">All counties</option>
                  <option value="nairobi">Nairobi</option>
                  <option value="mombasa">Mombasa</option>
                  <option value="kisumu">Kisumu</option>
                  <option value="nakuru">Nakuru</option>
                  <option value="eldoret">Eldoret</option>
                  <option value="thika">Thika</option>
                  <option value="malindi">Malindi</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="filter-group">
                <label htmlFor="filterSector">Occupational sector</label>
                <select id="filterSector">
                  <option value="">All sectors</option>
                  <option value="ict">ICT & Digital</option>
                  <option value="engineering">Engineering</option>
                  <option value="health">Health</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="business">Business & Finance</option>
                  <option value="construction">Construction</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="hospitality">Hospitality & Tourism</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-search" aria-hidden="true"></i> Search opportunities
              </button>
            </div>
          </form>

          <div className="quick-links">
            <h4>
              <i className="fas fa-bolt" aria-hidden="true"></i> Quick searches
            </h4>
            <div className="quick-links-list">
              {['Software Development', 'Electrical', 'Nursing', 'Agriculture', 'Mechanical', 'Accounting'].map(
                (q) => (
                  <span
                    key={q}
                    className="quick-link-chip"
                    onClick={() => {
                      if (keywordRef.current) keywordRef.current.value = q
                    }}
                  >
                    {q}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}