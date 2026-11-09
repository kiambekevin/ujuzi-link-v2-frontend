export default function TraineeSearchHeader({ search, onSearchChange }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    document.querySelector('.results-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header className="page-header" id="main-content">
      <div className="container">
        <div className="breadcrumb">
          <a href="#">Employer dashboard</a>
          <i className="fas fa-chevron-right" aria-hidden="true"></i>
          <span>Search trainees</span>
        </div>
        <h1>Find the right trainee</h1>
        <p className="header-sub">
          Search verified TVET trainees by occupation, skills, institution, county and
          availability. Filter to build your ideal shortlist.
        </p>
        <form className="header-search" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <i className="fas fa-search" aria-hidden="true"></i>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, skill, course, institution or keyword..."
              autoComplete="off"
              aria-label="Search trainees"
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