import { useEffect, useState } from 'react'

export default function OpportunitiesHeader({ search, onSearchChange, onSearchSubmit }) {
  const [value, setValue] = useState(search)

  useEffect(() => {
    setValue(search)
  }, [search])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearchSubmit(value)
  }

  return (
    <header className="page-header" id="main-content">
      <div className="container">
        <div className="breadcrumb">
          <a href="#">Home</a>
          <i className="fas fa-chevron-right" style={{ fontSize: '0.6rem' }}></i>
          <span>Opportunities</span>
        </div>
        <h1>Explore workplace-learning opportunities</h1>
        <p>
          Search verified industrial attachments, internships, apprenticeships and dual-training
          placements from employers across Kenya.
        </p>

        <form className="search-hero" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <i className="fas fa-search" aria-hidden="true"></i>
            <input
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                onSearchChange(e.target.value)
              }}
              placeholder="Search by occupation, employer, institution, county or keyword..."
              autoComplete="off"
              aria-label="Search opportunities"
            />
          </div>
          <button type="submit" className="btn btn-accent">
            <i className="fas fa-search" aria-hidden="true"></i> Search
          </button>
        </form>
      </div>
    </header>
  )
}