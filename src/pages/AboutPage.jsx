import { Link } from 'react-router-dom'
import {
  Accessibility,
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  ChevronRight,
  Eye,
  Factory,
  Flag,
  Globe,
  GraduationCap,
  Handshake,
  Info,
  Landmark,
  Laptop,
  Lightbulb,
  Link2,
  ListChecks,
  Lock,
  MapPinned,
  Network,
  School,
  ScrollText,
  Shield,
  Target,
  TrendingUp,
  Wrench,
} from 'lucide-react'
import TopBar from '../components/layout/TopBar.jsx'
import BrandRow from '../components/layout/BrandRow.jsx'
import MainNav from '../components/layout/MainNav.jsx'
import Footer from '../components/layout/Footer.jsx'
import '../styles/home.css'
import '../styles/about.css'

const MVV = [
  {
    icon: Target,
    title: 'Our mission',
    text: 'To establish a secure, accessible and nationally coordinated digital platform that connects TVET trainees with verified employers and suitable workplaces, strengthening workplace learning, skills matching and the transition from training to employment.',
  },
  {
    icon: Eye,
    title: 'Our vision',
    text: 'A Kenya where every TVET trainee has access to structured, high-quality workplace learning that builds practical competencies, improves employability, and meets the evolving needs of industry and the economy.',
  },
  {
    icon: Handshake,
    title: 'Our values',
    text: 'Collaboration across government, industry and institutions. Transparency and merit in matching. Equity of access for all trainees. Quality assurance and safeguarding. Data protection and accountability in everything we do.',
  },
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
  'Improve access to career guidance, occupational information and employment-related opportunities.',
]

const PRINCIPLES = [
  { icon: Handshake, text: 'Labour-market responsiveness and employer participation' },
  { icon: GraduationCap, text: 'Trainee-centred service delivery' },
  { icon: Wrench, text: 'Competency development and structured workplace learning' },
  { icon: ScrollText, text: 'Transparency, merit-based matching and equal opportunity' },
  { icon: Shield, text: 'Quality assurance, workplace safety and safeguarding' },
  { icon: Lock, text: 'Data protection, privacy and cybersecurity' },
  { icon: Accessibility, text: 'Accessibility, affordability and mobile-first design' },
  { icon: Network, text: 'Inter-agency collaboration and interoperability' },
  { icon: TrendingUp, text: 'Accountability, measurable results and continuous improvement' },
]

const GOVERNANCE = [
  {
    icon: Landmark,
    title: 'State Department for Labour and Skills Development',
    text: 'Provides proposed policy leadership and coordination in labour-market linkages and workplace-learning opportunities. Coordinates employer engagement, links the platform to employment and labour-market information services, and monitors implementation performance.',
  },
  {
    icon: School,
    title: 'Ministry of Education & State Department for TVET',
    text: 'Provides guidance on alignment with TVET policies, programmes and institutional arrangements. Facilitates engagement with TVET institutions and coordination of training-related placement requirements.',
  },
  {
    icon: GraduationCap,
    title: 'TVET institutions',
    text: 'Verify trainee enrolment, programme details and placement eligibility. Approve placements, assign institutional supervisors, coordinate learning plans, monitor progress and validate completion in accordance with applicable requirements.',
  },
  {
    icon: Building2,
    title: 'Employers and host organisations',
    text: 'Register and provide accurate organisational information. Advertise genuine workplace-learning opportunities, designate workplace supervisors, provide relevant practical learning experiences and appropriate working conditions, monitor progress and provide feedback and assessment.',
  },
  {
    icon: Factory,
    title: 'National Industrial Training Authority (NITA)',
    text: 'Participates in the coordination of industrial attachment and apprenticeship-related activities within its mandate. Advises on alignment with existing industrial-attachment arrangements and explores authorised digital integration and information exchange.',
  },
  {
    icon: Award,
    title: 'TVET Authority (TVETA)',
    text: 'Provides guidance on applicable TVET standards and quality assurance requirements. Supports appropriate quality assurance arrangements for workplace-based learning and alignment with TVETA standards.',
  },
]

const STAKEHOLDERS = [
  { icon: Landmark, label: 'State Department for Labour' },
  { icon: School, label: 'State Department for TVET' },
  { icon: Factory, label: 'NITA' },
  { icon: Award, label: 'TVETA' },
  { icon: GraduationCap, label: 'TVET institutions' },
  { icon: Building2, label: 'Federation of Kenya Employers' },
  { icon: Factory, label: 'Kenya Association of Manufacturers' },
  { icon: Briefcase, label: 'KEPSA' },
  { icon: MapPinned, label: 'County governments' },
  { icon: Laptop, label: 'ICT Authority' },
  { icon: Accessibility, label: 'Disability organisations' },
  { icon: Globe, label: 'Development partners' },
]

const OUTCOMES = [
  {
    n: '01',
    title: 'Improved coordination',
    text: 'Stronger coordination between training institutions, employers and labour-market institutions.',
  },
  {
    n: '02',
    title: 'Increased employer participation',
    text: 'More employers offering verified, structured workplace-learning opportunities.',
  },
  {
    n: '03',
    title: 'Wider access to workplace learning',
    text: 'Expanded access to attachment, internship, apprenticeship and dual-training placements.',
  },
  {
    n: '04',
    title: 'Improved practical competencies',
    text: 'Better practical skills, employability and readiness for the world of work.',
  },
  {
    n: '05',
    title: 'Better labour-market information',
    text: 'Reliable data on occupational demand, placement availability and transition outcomes.',
  },
  {
    n: '06',
    title: 'Stronger transition to employment',
    text: 'Improved pathways to wage employment, self-employment or further training.',
  },
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
            <ChevronRight size={12} strokeWidth={2.5} aria-hidden="true" />
            <span>About Ujuzi Link</span>
          </div>
          <div className="header-badges">
            <span className="badge">
              <Flag size={13} strokeWidth={2.5} aria-hidden="true" /> Ministry of Labour and Social Protection
            </span>
            <span className="badge">
              <Link2 size={13} strokeWidth={2.5} aria-hidden="true" /> Connecting training to employment
            </span>
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
              {MVV.map((m, i) => {
                const Icon = m.icon
                return (
                  <div className="mvv-card" key={i}>
                    <div className="mvv-icon">
                      <Icon size={24} strokeWidth={2.25} />
                    </div>
                    <h3>{m.title}</h3>
                    <p>{m.text}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* ===== BACKGROUND & RATIONALE ===== */}
          <section className="section">
            <div className="section-label">Why we exist</div>
            <h2 className="section-heading">
              <Info size={20} strokeWidth={2.5} /> Background &amp; rationale
            </h2>
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
                <h3>
                  <Lightbulb size={18} strokeWidth={2.5} /> The gaps Ujuzi Link addresses
                </h3>
                <ul className="callout-list">
                  <li><ArrowRight size={14} strokeWidth={2.5} /> Fragmented, informal and unverified placement opportunities</li>
                  <li><ArrowRight size={14} strokeWidth={2.5} /> Weak linkages between training institutions and employers</li>
                  <li><ArrowRight size={14} strokeWidth={2.5} /> Limited access to reliable labour-market information</li>
                  <li><ArrowRight size={14} strokeWidth={2.5} /> Inconsistent quality and supervision of workplace learning</li>
                  <li><ArrowRight size={14} strokeWidth={2.5} /> Unequal access to opportunities across counties and groups</li>
                  <li><ArrowRight size={14} strokeWidth={2.5} /> Duplication of effort across existing systems and mandates</li>
                </ul>
              </div>
            </div>
          </section>

          {/* ===== OBJECTIVES ===== */}
          <section className="section">
            <div className="section-label">What we aim to achieve</div>
            <h2 className="section-heading">
              <ListChecks size={20} strokeWidth={2.5} /> Our objectives
            </h2>
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
            <h2 className="section-heading">
              <ScrollText size={20} strokeWidth={2.5} /> Guiding principles
            </h2>
            <p className="section-subtext">
              The system is guided by principles that ensure it is responsive, equitable, secure and accountable.
            </p>

            <div className="principles-grid">
              {PRINCIPLES.map((p, i) => {
                const Icon = p.icon
                return (
                  <div className="principle-item" key={i}>
                    <Icon size={18} strokeWidth={2.25} />
                    <span>{p.text}</span>
                  </div>
                )
              })}
            </div>
          </section>

          {/* ===== GOVERNANCE ===== */}
          <section className="section">
            <div className="section-label">Who is involved</div>
            <h2 className="section-heading">
              <Network size={20} strokeWidth={2.5} /> Governance &amp; institutional roles
            </h2>
            <p className="section-subtext">
              A multi-stakeholder steering committee guides system development, implementation, stakeholder participation, performance monitoring and sustainability. Each institution has a clearly defined role.
            </p>

            <div className="governance-grid">
              {GOVERNANCE.map((g, i) => {
                const Icon = g.icon
                return (
                  <div className="gov-card" key={i}>
                    <div className="gov-card-top">
                      <div className="gov-icon">
                        <Icon size={22} strokeWidth={2.25} />
                      </div>
                      <h3>{g.title}</h3>
                    </div>
                    <p>{g.text}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* ===== EXPECTED OUTCOMES ===== */}
          <section className="section">
            <div className="section-label">What we aim to deliver</div>
            <h2 className="section-heading">
              <TrendingUp size={20} strokeWidth={2.5} /> Expected outcomes
            </h2>
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

        </div>
      </div>

      <Footer />
    </>
  )
}