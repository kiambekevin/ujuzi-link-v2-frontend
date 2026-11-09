import { Link } from 'react-router-dom'
import TopBar from '../components/layout/TopBar.jsx'
import BrandRow from '../components/layout/BrandRow.jsx'
import MainNav from '../components/layout/MainNav.jsx'
import Footer from '../components/layout/Footer.jsx'
import '../styles/home.css'
import '../styles/about.css'

const MVV = [
  { icon: 'fa-bullseye', title: 'Our mission', text: 'To establish a secure, accessible and nationally coordinated digital platform that connects TVET trainees with verified employers and suitable workplaces, strengthening workplace learning, skills matching and the transition from training to employment.' },
  { icon: 'fa-eye', title: 'Our vision', text: 'A Kenya where every TVET trainee has access to structured, high-quality workplace learning that builds practical competencies, improves employability, and meets the evolving needs of industry and the economy.' },
  { icon: 'fa-handshake', title: 'Our values', text: 'Collaboration across government, industry and institutions. Transparency and merit in matching. Equity of access for all trainees. Quality assurance and safeguarding. Data protection and accountability in everything we do.' }
]

const OBJECTIVES = [
  'Establish a national digital register of trainees, employers, host workplaces, training institutions and available opportunities.',
  'Improve access to verified industrial attachment, internship, apprenticeship and dual-training opportunities.',
  'Facilitate transparent matching based on occupational interests, competencies, location, eligibility and availability.',
  'Strengthen employer participation in workplace learning and the development of occupational competencies.',
  'Facilitate collaboration between labour-market institutions, training institutions, employers and government agencies.',
  "Generate reliable information on occupational demand, placement availability and trainees' transition to employment.",
  'Promote equitable access across counties, occupational sectors and eligible trainee groups.',
  'Support quality workplace learning through agreed learning plans, supervision, monitoring, assessment and feedback.',
  'Improve access to career guidance, occupational information and employment-related opportunities.'
]

const PRINCIPLES = [
  { icon: 'fa-handshake', text: 'Labour-market responsiveness and employer participation' },
  { icon: 'fa-user-graduate', text: 'Trainee-centred service delivery' },
  { icon: 'fa-tools', text: 'Competency development and structured workplace learning' },
  { icon: 'fa-balance-scale', text: 'Transparency, merit-based matching and equal opportunity' },
  { icon: 'fa-shield-alt', text: 'Quality assurance, workplace safety and safeguarding' },
  { icon: 'fa-lock', text: 'Data protection, privacy and cybersecurity' },
  { icon: 'fa-universal-access', text: 'Accessibility, affordability and mobile-first design' },
  { icon: 'fa-sitemap', text: 'Inter-agency collaboration and interoperability' },
  { icon: 'fa-chart-line', text: 'Accountability, measurable results and continuous improvement' }
]

const GOVERNANCE = [
  { icon: 'fa-landmark', title: 'State Department for Labour and Skills Development', text: 'Provides proposed policy leadership and coordination in labour-market linkages and workplace-learning opportunities. Coordinates employer engagement, links the platform to employment and labour-market information services, and monitors implementation performance.' },
  { icon: 'fa-school', title: 'Ministry of Education & State Department for TVET', text: 'Provides guidance on alignment with TVET policies, programmes and institutional arrangements. Facilitates engagement with TVET institutions and coordination of training-related placement requirements.' },
  { icon: 'fa-university', title: 'TVET institutions', text: 'Verify trainee enrolment, programme details and placement eligibility. Approve placements, assign institutional supervisors, coordinate learning plans, monitor progress and validate completion in accordance with applicable requirements.' },
  { icon: 'fa-building', title: 'Employers and host organisations', text: 'Register and provide accurate organisational information. Advertise genuine workplace-learning opportunities, designate workplace supervisors, provide relevant practical learning experiences and appropriate working conditions, monitor progress and provide feedback and assessment.' },
  { icon: 'fa-industry', title: 'National Industrial Training Authority (NITA)', text: 'Participates in the coordination of industrial attachment and apprenticeship-related activities within its mandate. Advises on alignment with existing industrial-attachment arrangements and explores authorised digital integration and information exchange.' },
  { icon: 'fa-certificate', title: 'TVET Authority (TVETA)', text: 'Provides guidance on applicable TVET standards and quality assurance requirements. Supports appropriate quality assurance arrangements for workplace-based learning and alignment with TVETA standards.' }
]

const STAKEHOLDERS = [
  { icon: 'fa-landmark', label: 'State Department for Labour' },
  { icon: 'fa-school', label: 'State Department for TVET' },
  { icon: 'fa-industry', label: 'NITA' },
  { icon: 'fa-certificate', label: 'TVETA' },
  { icon: 'fa-university', label: 'TVET institutions' },
  { icon: 'fa-building', label: 'Federation of Kenya Employers' },
  { icon: 'fa-factory', label: 'Kenya Association of Manufacturers' },
  { icon: 'fa-briefcase', label: 'KEPSA' },
  { icon: 'fa-map-marked-alt', label: 'County governments' },
  { icon: 'fa-laptop-code', label: 'ICT Authority' },
  { icon: 'fa-wheelchair', label: 'Disability organisations' },
  { icon: 'fa-globe', label: 'Development partners' }
]

const OUTCOMES = [
  { n: '01', title: 'Improved coordination', text: 'Stronger coordination between training institutions, employers and labour-market institutions.' },
  { n: '02', title: 'Increased employer participation', text: 'More employers offering verified, structured workplace-learning opportunities.' },
  { n: '03', title: 'Wider access to workplace learning', text: 'Expanded access to attachment, internship, apprenticeship and dual-training placements.' },
  { n: '04', title: 'Improved practical competencies', text: 'Better practical skills, employability and readiness for the world of work.' },
  { n: '05', title: 'Better labour-market information', text: 'Reliable data on occupational demand, placement availability and transition outcomes.' },
  { n: '06', title: 'Stronger transition to employment', text: 'Improved pathways to wage employment, self-employment or further training.' }
]

export default function AboutPage() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <TopBar />
      <BrandRow />
      <MainNav />

      {/* ===== PAGE HEADER ===== */}
      <header className="page-header about-header" id="main-content">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span>About Ujuzi Link</span>
          </div>
          <div className="header-badges">
            <span className="badge"><i className="fas fa-flag" aria-hidden="true"></i> Ministry of Labour and Social Protection</span>
            <span className="badge"><i className="fas fa-link" aria-hidden="true"></i> Connecting training to employment</span>
          </div>
          <h1>About Ujuzi Link</h1>
          <p className="header-sub">
            Ujuzi Link is a proposed national digital platform to strengthen the transition from training to productive employment in Kenya. It connects TVET trainees with verified employers for industrial attachment, internship, apprenticeship and dual-training placements - and provides the coordination, quality assurance and labour-market intelligence needed to make workplace learning work.
          </p>

          
        </div>
      </header>

      <div className="page-body">
        <div className="container">

          {/* ===== MISSION / VISION / VALUES ===== */}
          <section className="section">
            <div className="mvv-grid">
              {MVV.map((m, i) => (
                <div className="mvv-card" key={i}>
                  <div className="mvv-icon"><i className={`fas ${m.icon}`}></i></div>
                  <h3>{m.title}</h3>
                  <p>{m.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ===== BACKGROUND & RATIONALE ===== */}
          <section className="section">
            <div className="section-label">Why we exist</div>
            <h2 className="section-heading"><i className="fas fa-info-circle"></i> Background &amp; rationale</h2>
            <p className="section-subtext">
              Kenya has made significant progress in expanding access to technical and vocational education and training. However, the transition from training to employment remains a major challenge - and structured workplace learning is a critical missing link.
            </p>

            <div className="two-col-text">
              <div className="prose">
                <p>The <strong>State Department for Labour and Skills Development</strong>, under the Ministry of Labour and Social Protection, plays a strategic role in promoting employment, strengthening labour-market coordination, facilitating access to employment opportunities and supporting the development of a responsive labour market in Kenya.</p>
                <p>A critical challenge facing Kenya's labour market is the need to strengthen the transition from training to productive employment by improving linkages between training institutions, trainees and employers. Although TVET equips trainees with occupational knowledge and practical skills, access to structured workplace-learning opportunities remains an important component of the transition from training to employment.</p>
                <p>Many trainees require practical workplace experience to consolidate their competencies and improve their readiness for employment. Employers need access to trainees with relevant occupational competencies, while trainees require reliable information on available workplace-learning opportunities.</p>
                <p><strong>Ujuzi Link</strong> responds to these gaps. It is a national digital platform that facilitates the identification, advertisement, application, matching, placement and monitoring of workplace-learning opportunities - and supports the collection of labour-market information on occupational demand, available opportunities, employer participation, skills requirements and trainees' transition into employment.</p>
                <p>The platform is designed as a collaborative national service that complements existing government and institutional systems. The State Department for Labour and Skills Development provides proposed leadership in labour-market coordination and employer engagement, working in collaboration with the Ministry of Education, the State Department for TVET, NITA, TVETA, TVET institutions, employers and other stakeholders.</p>
              </div>

              <div className="callout-card">
                <h3><i className="fas fa-lightbulb"></i> The gaps Ujuzi Link addresses</h3>
                <ul className="callout-list">
                  <li><i className="fas fa-arrow-right"></i> Fragmented, informal and unverified placement opportunities</li>
                  <li><i className="fas fa-arrow-right"></i> Weak linkages between training institutions and employers</li>
                  <li><i className="fas fa-arrow-right"></i> Limited access to reliable labour-market information</li>
                  <li><i className="fas fa-arrow-right"></i> Inconsistent quality and supervision of workplace learning</li>
                  <li><i className="fas fa-arrow-right"></i> Unequal access to opportunities across counties and groups</li>
                  <li><i className="fas fa-arrow-right"></i> Duplication of effort across existing systems and mandates</li>
                </ul>
              </div>
            </div>
          </section>

          {/* ===== OBJECTIVES ===== */}
          <section className="section">
            <div className="section-label">What we aim to achieve</div>
            <h2 className="section-heading"><i className="fas fa-list-check"></i> Our objectives</h2>
            <p className="section-subtext">
              Nine specific objectives guide the design, development and operation of the National TVET Work-Based Learning Placement System.
            </p>

            <div className="objectives-grid">
              {OBJECTIVES.map((obj, i) => (
                <div className="objective-card" key={i}>
                  <div className="obj-num">{i + 1}</div>
                  <div className="obj-body"><p>{obj}</p></div>
                </div>
              ))}
            </div>
          </section>

          {/* ===== GUIDING PRINCIPLES ===== */}
          <section className="section">
            <div className="section-label">How we work</div>
            <h2 className="section-heading"><i className="fas fa-gavel"></i> Guiding principles</h2>
            <p className="section-subtext">
              The system is guided by principles that ensure it is responsive, equitable, secure and accountable.
            </p>

            <div className="principles-grid">
              {PRINCIPLES.map((p, i) => (
                <div className="principle-item" key={i}>
                  <i className={`fas ${p.icon}`}></i>
                  <span>{p.text}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ===== GOVERNANCE ===== */}
          <section className="section">
            <div className="section-label">Who is involved</div>
            <h2 className="section-heading"><i className="fas fa-sitemap"></i> Governance &amp; institutional roles</h2>
            <p className="section-subtext">
              A multi-stakeholder steering committee guides system development, implementation, stakeholder participation, performance monitoring and sustainability. Each institution has a clearly defined role.
            </p>

            <div className="governance-grid">
              {GOVERNANCE.map((g, i) => (
                <div className="gov-card" key={i}>
                  <div className="gov-card-top">
                    <div className="gov-icon"><i className={`fas ${g.icon}`}></i></div>
                    <h3>{g.title}</h3>
                  </div>
                  <p>{g.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ===== STAKEHOLDERS ===== */}
          <section className="section">
            <div className="section-label">A collaborative service</div>
            <h2 className="section-heading"><i className="fas fa-users"></i> Our stakeholder ecosystem</h2>
            <p className="section-subtext">
              Ujuzi Link is a national collaboration bringing together government, industry, training institutions, development partners and civil society.
            </p>

            <div className="stakeholders-grid">
              {STAKEHOLDERS.map((s, i) => (
                <div className="stakeholder-card" key={i}>
                  <div className="stakeholder-icon"><i className={`fas ${s.icon}`}></i></div>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ===== EXPECTED OUTCOMES ===== */}
          <section className="section">
            <div className="section-label">What we aim to deliver</div>
            <h2 className="section-heading"><i className="fas fa-chart-simple"></i> Expected outcomes</h2>
            <p className="section-subtext">
              The platform is designed to deliver measurable improvements in coordination, participation, access, quality and labour-market information.
            </p>

            <div className="outcomes-grid">
              {OUTCOMES.map((o, i) => (
                <div className="outcome-card" key={i}>
                  <div className="oc-num">{o.n}</div>
                  <h3>{o.title}</h3>
                  <p>{o.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ===== CTA + CONTACT ===== */}
          <section className="section">
            <div className="cta-block">
              <div className="cta-body">
                <h2>Be part of Kenya's skills-to-employment journey</h2>
                <p>Whether you are a trainee seeking hands-on experience, an employer offering placement, or an institution supporting learners - Ujuzi Link connects you to the people and opportunities that matter.</p>
              </div>
              <div className="cta-buttons">
                <Link to="/register" className="btn btn-light">
                  <i className="fas fa-user-graduate"></i> Join as trainee
                </Link>
                <Link to="/register" className="btn btn-outline-light">
                  <i className="fas fa-briefcase"></i> Join as employer
                </Link>
              </div>
            </div>

            <div className="contact-strip">
              <div className="contact-item">
                <div className="ci-icon"><i className="fas fa-envelope"></i></div>
                <div>
                  <div className="ci-label">Email us</div>
                  <div className="ci-value">info@ujizilink.go.ke</div>
                </div>
              </div>
              <div className="contact-item">
                <div className="ci-icon"><i className="fas fa-phone"></i></div>
                <div>
                  <div className="ci-label">Call us</div>
                  <div className="ci-value">+254 20 000 0000</div>
                </div>
              </div>
              <div className="contact-item">
                <div className="ci-icon"><i className="fas fa-map-pin"></i></div>
                <div>
                  <div className="ci-label">Visit us</div>
                  <div className="ci-value">Ministry of Labour and Social Protection, Nairobi, Kenya</div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </>
  )
}