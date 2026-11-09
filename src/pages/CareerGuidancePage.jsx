import { useState } from 'react'
import { Link } from 'react-router-dom'
import TopBar from '../components/layout/TopBar.jsx'
import BrandRow from '../components/layout/BrandRow.jsx'
import MainNav from '../components/layout/MainNav.jsx'
import Footer from '../components/layout/Footer.jsx'
import '../styles/home.css'
import '../styles/career-guidance.css'

const PATHWAYS = [
  {
    key: 'engineering',
    icon: 'fa-cogs',
    color: 'engineering',
    demand: { label: 'High demand', cls: 'high', icon: 'fa-arrow-up' },
    title: 'Engineering & Technical Trades',
    desc: "Electrical, mechanical, civil and automotive engineering roles that keep Kenya's industries moving.",
    roles: ['Electrical Technician', 'Mechanical Fitter', 'Civil Technician'],
    salary: 'KES 25K – 80K'
  },
  {
    key: 'ict',
    icon: 'fa-laptop-code',
    color: 'ict',
    demand: { label: 'High demand', cls: 'high', icon: 'fa-arrow-up' },
    title: 'ICT & Digital Economy',
    desc: "Software development, networking, cybersecurity and data roles powering Kenya's digital transformation.",
    roles: ['Software Developer', 'Network Technician', 'Data Analyst'],
    salary: 'KES 30K – 120K'
  },
  {
    key: 'health',
    icon: 'fa-heartbeat',
    color: 'health',
    demand: { label: 'High demand', cls: 'high', icon: 'fa-arrow-up' },
    title: 'Health & Social Care',
    desc: "Nursing, pharmacy, laboratory and community health roles that support Kenya's healthcare system.",
    roles: ['Nurse', 'Pharmacy Assistant', 'Lab Technician'],
    salary: 'KES 20K – 90K'
  },
  {
    key: 'agriculture',
    icon: 'fa-seedling',
    color: 'agriculture',
    demand: { label: 'Steady', cls: 'medium', icon: 'fa-minus' },
    title: 'Agriculture & Agribusiness',
    desc: "Agronomy, livestock, agri-processing and agribusiness roles that drive Kenya's food economy.",
    roles: ['Agronomist', 'Farm Manager', 'Agri-Entrepreneur'],
    salary: 'KES 18K – 70K'
  },
  {
    key: 'business',
    icon: 'fa-chart-pie',
    color: 'business',
    demand: { label: 'Steady', cls: 'medium', icon: 'fa-minus' },
    title: 'Business & Finance',
    desc: 'Accounting, supply chain, banking and entrepreneurship roles that keep businesses running.',
    roles: ['Accountant', 'Procurement Officer', 'Bank Teller'],
    salary: 'KES 22K – 85K'
  },
  {
    key: 'creative',
    icon: 'fa-palette',
    color: 'creative',
    demand: { label: 'Emerging', cls: 'emerging', icon: 'fa-bolt' },
    title: 'Creative Arts & Media',
    desc: "Graphic design, multimedia, photography and content creation for Kenya's growing creative economy.",
    roles: ['Graphic Designer', 'Content Creator', 'Photographer'],
    salary: 'KES 20K – 75K'
  }
]

const ARTICLES_CV = [
  {
    icon: 'fa-file-alt',
    title: 'How to write a CV that works for TVET roles',
    desc: 'Structure, format and content tips tailored to technical and vocational trainees.',
    time: '6 min read',
    tag: 'CV'
  },
  {
    icon: 'fa-envelope-open-text',
    title: 'Writing a cover letter that gets noticed',
    desc: 'How to tailor your cover letter for attachments, internships and apprenticeships.',
    time: '5 min read',
    tag: 'Applications'
  },
  {
    icon: 'fa-tools',
    title: 'Showcasing practical skills and projects',
    desc: 'How to present your portfolio, logbook and hands-on experience to employers.',
    time: '4 min read',
    tag: 'Portfolio'
  }
]

const ARTICLES_INTERVIEW = [
  {
    icon: 'fa-question-circle',
    title: 'Common interview questions for TVET trainees',
    desc: 'Practice these questions and learn how to structure strong answers using the STAR method.',
    time: '8 min read',
    tag: 'Interviews'
  },
  {
    icon: 'fa-handshake',
    title: 'Your first week at a placement: what to expect',
    desc: 'Practical tips on professionalism, safety, communication and making a good first impression.',
    time: '5 min read',
    tag: 'Workplace'
  },
  {
    icon: 'fa-arrow-trend-up',
    title: 'From attachment to employment: next steps',
    desc: 'How to turn a successful placement into a job offer, reference or further opportunity.',
    time: '7 min read',
    tag: 'Career growth'
  }
]

const FAQS = [
  {
    q: 'How do I know which career pathway is right for me?',
    a: 'Start by reflecting on what you enjoy doing, what subjects or tasks come naturally to you, and the working environment you prefer (indoor/outdoor, team/independent, hands-on/desk-based). Take our career self-assessment quiz, review labour-market demand, and speak to your institutional career adviser. Remember that career paths are rarely linear — many people start in one trade and specialise or transition later.'
  },
  {
    q: 'Does my TVET level limit the careers I can pursue?',
    a: 'Your TVET level determines the entry point, not the ceiling. Artisan (Level 3) and craft (Level 4) qualifications can lead to technician roles and eventually supervisory positions with experience. Many technicians progress to diploma and degree programmes through Recognition of Prior Learning (RPL) or part-time study. What matters most is continuous learning, practical competence and workplace experience.'
  },
  {
    q: 'How important is a workplace attachment for my career?',
    a: 'Very important. Workplace attachments and apprenticeships give you real-world experience, build your professional network, and often lead directly to employment. Employers consistently rank practical experience as one of the top factors when hiring TVET graduates. They also help you confirm whether a particular career is right for you before committing long-term.'
  },
  {
    q: 'Can I get a placement without prior work experience?',
    a: 'Yes — placements are designed specifically for trainees who are building experience. Your institution verifies your enrolment and eligibility, and employers understand that you are learning. What matters is your attitude, willingness to learn, safety awareness and reliability. A strong CV and application, even without prior experience, can help you stand out.'
  },
  {
    q: "What should I do if my placement doesn't go well?",
    a: 'First, raise any concerns with your workplace supervisor or institutional supervisor as early as possible. Most issues — misunderstandings about tasks, communication problems or safety concerns — can be resolved quickly. If you feel unsafe or mistreated, report it through the Ujuzi Link platform or contact your institution immediately. No placement should compromise your safety or dignity.'
  }
]

export default function CareerGuidancePage() {
  const [openFaq, setOpenFaq] = useState(null)
  const [search, setSearch] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    alert(`Career search (demo): ${search}`)
  }

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <TopBar />
      <BrandRow />
      <MainNav />

      {/* ===== PAGE HEADER ===== */}
      <header className="page-header" id="main-content">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <Link to="/trainees">Trainees</Link>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span>Career guidance</span>
          </div>
          <h1>Career guidance &amp; planning</h1>
          <p>
            Explore occupational pathways, understand labour-market demand, and build the skills and confidence to make informed career decisions in Kenya's technical and vocational sectors.
          </p>

          <form className="header-search" onSubmit={handleSearch}>
            <div className="input-wrapper">
              <i className="fas fa-search" aria-hidden="true"></i>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search careers, skills, sectors or articles..."
                autoComplete="off"
                aria-label="Search career guidance"
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

          {/* ===== QUICK ACTION TILES ===== */}
          <div className="action-tiles">
            <Link to="/career-assessment" className="action-tile">
              <div className="at-icon"><i className="fas fa-compass"></i></div>
              <h3>Career self-assessment</h3>
              <p>Answer a short quiz about your interests, strengths and work preferences to discover careers that fit you.</p>
              <span className="at-link">Start assessment <i className="fas fa-arrow-right"></i></span>
            </Link>

            <Link to="/labour-market" className="action-tile">
              <div className="at-icon"><i className="fas fa-chart-line"></i></div>
              <h3>Labour market explorer</h3>
              <p>See which occupations are in high demand, expected growth areas, and typical salary ranges in Kenya.</p>
              <span className="at-link">Explore demand <i className="fas fa-arrow-right"></i></span>
            </Link>

            <Link to="/cv-builder" className="action-tile">
              <div className="at-icon"><i className="fas fa-file-signature"></i></div>
              <h3>CV &amp; application builder</h3>
              <p>Build a professional CV and cover letter, with tips tailored to TVET trainees and entry-level roles.</p>
              <span className="at-link">Build my CV <i className="fas fa-arrow-right"></i></span>
            </Link>
          </div>

          {/* ===== CAREER PATHWAYS ===== */}
          <section className="section">
            <div className="section-head">
              <div className="section-head-left">
                <div className="section-label">Occupational pathways</div>
                <h2><i className="fas fa-route" aria-hidden="true"></i> Explore career pathways</h2>
                <p>Understand where your TVET programme can take you — from entry-level roles to long-term career growth.</p>
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => alert('View all pathways (demo)')}
              >
                View all pathways <i className="fas fa-arrow-right"></i>
              </button>
            </div>

            <div className="pathways-grid">
              {PATHWAYS.map(p => (
                <Link
                  to={`/career-guidance/${p.key}`}
                  className="pathway-card"
                  key={p.key}
                >
                  <div className="pw-top">
                    <div className={`pw-icon ${p.color}`}>
                      <i className={`fas ${p.icon}`} aria-hidden="true"></i>
                    </div>
                    <span className={`pw-demand ${p.demand.cls}`}>
                      <i className={`fas ${p.demand.icon}`} aria-hidden="true"></i> {p.demand.label}
                    </span>
                  </div>
                  <h3>{p.title}</h3>
                  <p className="pw-desc">{p.desc}</p>
                  <div className="pw-roles">
                    {p.roles.map(role => (
                      <span className="pw-role" key={role}>{role}</span>
                    ))}
                  </div>
                  <div className="pw-footer">
                    <span className="pw-salary">
                      <i className="fas fa-money-bill-wave" aria-hidden="true"></i>{' '}
                      <strong>{p.salary}</strong> / month
                    </span>
                    <span className="pw-explore">
                      Explore <i className="fas fa-arrow-right" aria-hidden="true"></i>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ===== SIDEBAR LAYOUT FOR GUIDES ===== */}
          <div className="sidebar-layout">
            <div className="main-column">
              <div className="resources-grid">
                {/* CV & applications */}
                <div>
                  <div className="section-head" style={{ marginBottom: '1rem' }}>
                    <div className="section-head-left">
                      <div className="section-label">CV &amp; applications</div>
                      <h2 style={{ fontSize: '1.25rem' }}>
                        <i className="fas fa-file-signature"></i> Build a strong application
                      </h2>
                    </div>
                  </div>
                  <div className="article-list">
                    {ARTICLES_CV.map((a, i) => (
                      <div
                        className="article-item"
                        key={i}
                        onClick={() => alert(`Opening article: ${a.title} (demo).`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            alert(`Opening article: ${a.title} (demo).`)
                          }
                        }}
                      >
                        <div className="article-icon">
                          <i className={`fas ${a.icon}`}></i>
                        </div>
                        <div className="article-body">
                          <h4>{a.title}</h4>
                          <p>{a.desc}</p>
                          <div className="article-meta">
                            <span><i className="fas fa-clock"></i> {a.time}</span>
                            <span className="article-tag">{a.tag}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interviews & workplace */}
                <div>
                  <div className="section-head" style={{ marginBottom: '1rem' }}>
                    <div className="section-head-left">
                      <div className="section-label">Interviews &amp; workplace</div>
                      <h2 style={{ fontSize: '1.25rem' }}>
                        <i className="fas fa-comments"></i> Prepare for the workplace
                      </h2>
                    </div>
                  </div>
                  <div className="article-list">
                    {ARTICLES_INTERVIEW.map((a, i) => (
                      <div
                        className="article-item"
                        key={i}
                        onClick={() => alert(`Opening article: ${a.title} (demo).`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            alert(`Opening article: ${a.title} (demo).`)
                          }
                        }}
                      >
                        <div className="article-icon">
                          <i className={`fas ${a.icon}`}></i>
                        </div>
                        <div className="article-body">
                          <h4>{a.title}</h4>
                          <p>{a.desc}</p>
                          <div className="article-meta">
                            <span><i className="fas fa-clock"></i> {a.time}</span>
                            <span className="article-tag">{a.tag}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <section className="section" style={{ marginBottom: 0 }}>
                <div className="section-head">
                  <div className="section-head-left">
                    <div className="section-label">Common questions</div>
                    <h2><i className="fas fa-circle-question"></i> Frequently asked questions</h2>
                    <p>Answers to the questions trainees ask most about careers and placements.</p>
                  </div>
                </div>
                <div className="faq-list">
                  {FAQS.map((faq, i) => (
                    <div className={`faq-item ${openFaq === i ? 'open' : ''}`} key={i}>
                      <button
                        className="faq-question"
                        aria-expanded={openFaq === i}
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      >
                        {faq.q}
                        <i className="fas fa-chevron-down"></i>
                      </button>
                      <div className="faq-answer">
                        <p>{faq.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* ===== SIDE COLUMN ===== */}
            <aside className="side-column">
              {/* Spotlight */}
              <div className="spotlight-card">
                <div className="spotlight-label">
                  <i className="fas fa-bolt"></i> Career spotlight
                </div>
                <h3>Renewable energy is one of Kenya's fastest-growing sectors</h3>
                <p>Solar, wind and energy-efficiency roles are expanding rapidly. Trainees with electrical or solar PV skills are in high demand across the country.</p>
                <button
                  className="btn btn-light"
                  onClick={() => alert('Opening renewable energy pathway (demo).')}
                >
                  <i className="fas fa-solar-panel"></i> Explore energy careers
                </button>
              </div>

              {/* CV checklist */}
              <div className="checklist-card">
                <h3><i className="fas fa-check-square"></i> CV quick checklist</h3>
                <ul className="checklist">
                  <li><i className="fas fa-check-circle"></i> Keep it to 1–2 pages</li>
                  <li><i className="fas fa-check-circle"></i> Include your TVET level and programme</li>
                  <li><i className="fas fa-check-circle"></i> List practical skills and software you can use</li>
                  <li><i className="fas fa-check-circle"></i> Mention attachments, projects and logbook work</li>
                  <li><i className="fas fa-check-circle"></i> Add two referees with current contacts</li>
                  <li><i className="fas fa-check-circle"></i> Use a clean, professional layout</li>
                  <li><i className="fas fa-check-circle"></i> Proofread for spelling and grammar</li>
                </ul>
                <Link to="/cv-builder" className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: '1rem' }}>
                  <i className="fas fa-file-signature"></i> Open CV builder
                </Link>
              </div>

              {/* Interview checklist */}
              <div className="checklist-card">
                <h3><i className="fas fa-comments"></i> Interview prep checklist</h3>
                <ul className="checklist">
                  <li><i className="fas fa-check-circle"></i> Research the employer and role</li>
                  <li><i className="fas fa-check-circle"></i> Re-read your CV and application</li>
                  <li><i className="fas fa-check-circle"></i> Prepare examples of your practical work</li>
                  <li><i className="fas fa-check-circle"></i> Practise the STAR method for answers</li>
                  <li><i className="fas fa-check-circle"></i> Prepare questions to ask the interviewer</li>
                  <li><i className="fas fa-check-circle"></i> Plan your transport and arrive early</li>
                  <li><i className="fas fa-check-circle"></i> Dress professionally and appropriately</li>
                </ul>
              </div>

              {/* Need help */}
              <div className="checklist-card" style={{ background: 'var(--primary-soft)', borderColor: 'rgba(147,51,234,0.15)' }}>
                <h3><i className="fas fa-headset"></i> Need guidance?</h3>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                  Our career advisers and your institutional placement office are here to help you plan your next step.
                </p>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                  onClick={() => alert('Contacting career adviser (demo).')}
                >
                  <i className="fas fa-envelope"></i> Contact a career adviser
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}