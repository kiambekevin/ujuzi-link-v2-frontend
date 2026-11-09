import { useParams, Link, useNavigate } from 'react-router-dom'
import TopBar from '../components/layout/TopBar.jsx'
import BrandRow from '../components/layout/BrandRow.jsx'
import MainNav from '../components/layout/MainNav.jsx'
import Footer from '../components/layout/Footer.jsx'
import { CAREER_PATHWAY_DETAILS } from '../data/careerPathwaysData.js'
import '../styles/home.css'
import '../styles/career-pathway.css'

export default function CareerPathwayDetailPage() {
  const { pathwayKey } = useParams()
  const navigate = useNavigate()
  const pathway = CAREER_PATHWAY_DETAILS[pathwayKey]

  if (!pathway) {
    return (
      <>
        <TopBar />
        <BrandRow />
        <MainNav />
        <div className="page-body">
          <div className="container">
            <div className="empty-state" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <i className="fas fa-map-signs" style={{ fontSize: '3rem', color: 'var(--primary-soft)', display: 'block', marginBottom: '1rem' }}></i>
              <h3>Career pathway not found</h3>
              <p>We couldn't find a pathway with that key.</p>
              <Link to="/career-guidance" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                <i className="fas fa-arrow-left"></i> Back to career guidance
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <TopBar />
      <BrandRow />
      <MainNav />

      <header className="page-header pathway-header" id="main-content">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <Link to="/career-guidance">Career guidance</Link>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span>{pathway.title}</span>
          </div>

          <div className="pathway-hero">
            <div className={`pathway-hero-icon pw-icon ${pathway.color}`}>
              <i className={`fas ${pathway.icon}`}></i>
            </div>
            <div className="pathway-hero-body">
              <div className="pathway-hero-badges">
                <span className={`pw-demand ${pathway.demand.cls}`}>
                  <i className={`fas ${pathway.demand.icon}`}></i> {pathway.demand.label}
                </span>
                <span className="badge badge-growth">
                  <i className="fas fa-arrow-trend-up"></i> {pathway.growth}
                </span>
              </div>
              <h1>{pathway.title}</h1>
              <p className="pathway-tagline">{pathway.tagline}</p>
            </div>
          </div>

          <div className="pathway-hero-stats">
            <div className="ph-stat">
              <span className="ph-label">Salary range</span>
              <span className="ph-value">{pathway.salary}</span>
            </div>
            <div className="ph-stat">
              <span className="ph-label">Growth</span>
              <span className="ph-value">{pathway.growth}</span>
            </div>
            <div className="ph-stat">
              <span className="ph-label">Roles profiled</span>
              <span className="ph-value">{pathway.roles.length}</span>
            </div>
            <div className="ph-stat">
              <span className="ph-label">Top counties</span>
              <span className="ph-value">{pathway.counties.length}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="page-body">
        <div className="container">
          <div className="pathway-layout">

            {/* ===== MAIN COLUMN ===== */}
            <div className="main-column">

              {/* Overview */}
              <section className="pathway-section">
                <h2><i className="fas fa-info-circle"></i> Overview</h2>
                <p className="pathway-description">{pathway.description}</p>
              </section>

              {/* Roles and salaries */}
              <section className="pathway-section">
                <h2><i className="fas fa-briefcase"></i> Roles and salary ranges</h2>
                <div className="roles-table">
                  <div className="roles-head">
                    <span>Role</span>
                    <span>Salary (KES / month)</span>
                    <span>Growth</span>
                  </div>
                  {pathway.roles.map((role, i) => (
                    <div className="roles-row" key={i}>
                      <span className="role-title">{role.title}</span>
                      <span className="role-salary">{role.salary}</span>
                      <span className="role-growth">{role.growth}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Entry requirements */}
              <section className="pathway-section">
                <h2><i className="fas fa-clipboard-check"></i> Entry requirements</h2>
                <ul className="pathway-list">
                  {pathway.entry.map((item, i) => (
                    <li key={i}><i className="fas fa-check-circle"></i> {item}</li>
                  ))}
                </ul>
              </section>

              {/* Career progression */}
              <section className="pathway-section">
                <h2><i className="fas fa-route"></i> Career progression</h2>
                <ol className="progression-ladder">
                  {pathway.progression.map((stage, i) => (
                    <li key={i} className="ladder-step">
                      <div className="ladder-marker">
                        <span className="ladder-num">{i + 1}</span>
                      </div>
                      <div className="ladder-body">
                        <div className="ladder-stage">{stage.stage}</div>
                        <div className="ladder-title">{stage.title}</div>
                        <div className="ladder-years">{stage.years}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Skills */}
              <section className="pathway-section">
                <h2><i className="fas fa-tools"></i> Key skills to develop</h2>
                <div className="skills-cloud">
                  {pathway.skills.map((s, i) => (
                    <span className="skill-tag" key={i}>{s}</span>
                  ))}
                </div>
              </section>

              {/* Articles */}
              <section className="pathway-section">
                <h2><i className="fas fa-newspaper"></i> Related articles and guides</h2>
                <div className="article-list">
                  {pathway.articles.map((a, i) => (
                    <div className="article-item" key={i} onClick={() => alert(`Opening: ${a.title} (demo).`)}>
                      <div className="article-icon"><i className={`fas ${a.icon}`}></i></div>
                      <div className="article-body">
                        <h4>{a.title}</h4>
                        <span className="article-tag">{a.tag}</span>
                      </div>
                      <i className="fas fa-arrow-right article-arrow"></i>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* ===== SIDE COLUMN ===== */}
            <aside className="side-column">

              {/* Top employers */}
              <div className="sidebar-card">
                <h3><i className="fas fa-building"></i> Top employers</h3>
                <ul className="employer-list">
                  {pathway.employers.map((emp, i) => (
                    <li key={i}>
                      <i className="fas fa-check-circle"></i> {emp}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Counties */}
              <div className="sidebar-card">
                <h3><i className="fas fa-map-marker-alt"></i> Where these jobs are</h3>
                <div className="county-chips">
                  {pathway.counties.map((c, i) => (
                    <span className="county-chip" key={i}>
                      <i className="fas fa-map-pin"></i> {c}
                    </span>
                  ))}
                </div>
                <p className="county-note">
                  These are the counties with the highest concentration of opportunities in this pathway.
                </p>
              </div>

              {/* CTA card */}
              <div className="pathway-cta">
                <h3>Ready to start?</h3>
                <p>Find verified workplace-learning opportunities in {pathway.title.toLowerCase()} across Kenya.</p>
                <Link to="/opportunities" className="btn btn-primary" style={{ width: '100%', marginBottom: '0.6rem' }}>
                  <i className="fas fa-search"></i> Search opportunities
                </Link>
                <Link to="/career-assessment" className="btn btn-outline" style={{ width: '100%' }}>
                  <i className="fas fa-compass"></i> Take the assessment
                </Link>
              </div>

              {/* Related pathways */}
              <div className="sidebar-card">
                <h3><i className="fas fa-layer-group"></i> Explore other pathways</h3>
                <div className="related-pathways">
                  {Object.values(CAREER_PATHWAY_DETAILS)
                    .filter(p => p.key !== pathway.key)
                    .slice(0, 3)
                    .map(p => (
                      <Link
                        key={p.key}
                        to={`/career-guidance/${p.key}`}
                        className="related-pathway-item"
                      >
                        <div className={`pw-icon ${p.color}`} style={{ width: 36, height: 36, fontSize: '0.95rem' }}>
                          <i className={`fas ${p.icon}`}></i>
                        </div>
                        <div className="rp-info">
                          <div className="rp-title">{p.title}</div>
                          <div className="rp-growth">{p.demand.label}</div>
                        </div>
                        <i className="fas fa-arrow-right" style={{ color: 'var(--primary-mid)' }}></i>
                      </Link>
                    ))}
                </div>
              </div>

              <button
                className="btn btn-ghost"
                style={{ width: '100%' }}
                onClick={() => navigate('/career-guidance')}
              >
                <i className="fas fa-arrow-left"></i> Back to career guidance
              </button>
            </aside>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}