import { useState, useEffect } from 'react'
import TopBar from '../components/layout/TopBar.jsx'
import BrandRow from '../components/layout/BrandRow.jsx'
import MainNav from '../components/layout/MainNav.jsx'
import Footer from '../components/layout/Footer.jsx'
import '../styles/home.css'
import '../styles/privacy-policy.css'

const SECTIONS = [
  { id: 's1', label: '1. Introduction' },
  { id: 's2', label: '2. Who we are' },
  { id: 's3', label: '3. Definitions' },
  { id: 's4', label: '4. Personal data we collect' },
  { id: 's5', label: '5. How we collect data' },
  { id: 's6', label: '6. Why we use your data' },
  { id: 's7', label: '7. Legal basis for processing' },
  { id: 's8', label: '8. Sharing your data' },
  { id: 's9', label: '9. Data retention' },
  { id: 's10', label: '10. Data security' },
  { id: 's11', label: '11. Your rights' },
  { id: 's12', label: '12. Cookies & tracking' },
  { id: 's13', label: '13. Children & minors' },
  { id: 's14', label: '14. International transfers' },
  { id: 's15', label: '15. Changes to this policy' },
  { id: 's16', label: '16. How to contact us' }
]

const LEGAL_BASIS = [
  { basis: 'Consent', applies: 'Where you have given clear, informed consent - for example, to process sensitive personal data such as disability status, or to receive optional communications.' },
  { basis: 'Contract', applies: 'Where processing is necessary to enter into or perform a contract with you - for example, to create your account, process your application or administer a placement.' },
  { basis: 'Legal obligation', applies: 'Where processing is necessary to comply with a legal obligation applicable to the State Department or the Platform.' },
  { basis: 'Public interest / public task', applies: 'Where processing is necessary to perform a task carried out in the public interest or in the exercise of official authority - including the coordination of national workplace-learning opportunities and the generation of labour-market information.' },
  { basis: 'Legitimate interests', applies: 'Where processing is necessary for legitimate interests pursued by the State Department or a third party, provided your rights and freedoms are not overridden - for example, to maintain the security and integrity of the Platform.' }
]

const RIGHTS = [
  { icon: 'fa-eye', title: 'Right of access', text: 'Request confirmation of whether we hold your data and obtain a copy of it.' },
  { icon: 'fa-pen', title: 'Right to correction', text: 'Ask us to correct inaccurate or incomplete personal data.' },
  { icon: 'fa-trash', title: 'Right to deletion', text: 'Ask us to delete personal data where there is no lawful reason for us to keep it.' },
  { icon: 'fa-ban', title: 'Right to object', text: 'Object to certain processing, including processing based on legitimate interests.' },
  { icon: 'fa-pause', title: 'Right to restrict processing', text: 'Ask us to restrict processing while a concern is being investigated.' },
  { icon: 'fa-download', title: 'Right to data portability', text: 'Receive your data in a structured, commonly used format, where technically feasible.' },
  { icon: 'fa-undo', title: 'Right to withdraw consent', text: 'Withdraw consent at any time, without affecting the lawfulness of prior processing.' },
  { icon: 'fa-gavel', title: 'Right to complain', text: 'Lodge a complaint with the Office of the Data Protection Commissioner.' }
]

export default function PrivacyPolicyPage() {
  const [activeId, setActiveId] = useState('s1')
  const [tocCollapsed, setTocCollapsed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 130
      const sections = document.querySelectorAll('.policy-section')
      let current = 's1'
      sections.forEach(sec => {
        if (sec.offsetTop <= scrollPos) current = sec.id
      })
      setActiveId(current)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.history.replaceState(null, '', '#' + id)
    }
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
            <a href="/">Home</a>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span>Privacy Policy</span>
          </div>
          <div className="header-badges">
            <span className="badge"><i className="fas fa-shield-halved"></i> Data protection</span>
            <span className="badge"><i className="fas fa-lock"></i> Privacy &amp; security</span>
          </div>
          <h1>Privacy Policy</h1>
          <p className="header-sub">
            This Privacy Policy explains how the National TVET Work-Based Learning Placement System (“Ujuzi Link”) collects, uses, stores, shares and protects personal data - and the rights available to trainees, employers, institutions and other users of the platform.
          </p>
          <div className="header-meta">
            <div className="header-meta-item"><i className="fas fa-calendar-check"></i> <span><strong>Effective:</strong> 1 January 2025</span></div>
            <div className="header-meta-item"><i className="fas fa-rotate"></i> <span><strong>Last updated:</strong> 15 October 2025</span></div>
            <div className="header-meta-item"><i className="fas fa-code-branch"></i> <span><strong>Version:</strong> 1.2</span></div>
            <div className="header-meta-item"><i className="fas fa-landmark"></i> <span><strong>Owner:</strong> State Department for Labour and Skills Development</span></div>
          </div>
        </div>
      </header>

      <div className="page-body">
        <div className="container">
          <div className="layout-grid">

            {/* ===== TOC ===== */}
            <aside>
              <button
                className="toc-toggle"
                onClick={() => setTocCollapsed(prev => !prev)}
                type="button"
              >
                <span><i className="fas fa-list"></i> On this page</span>
                <i className={`fas fa-chevron-${tocCollapsed ? 'up' : 'down'}`}></i>
              </button>
              <nav className={`toc-panel ${tocCollapsed ? 'collapsed' : ''}`} aria-label="Table of contents">
                <h2><i className="fas fa-list-ul"></i> On this page</h2>
                <ul className="toc-list">
                  {SECTIONS.map(s => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className={activeId === s.id ? 'active' : ''}
                        onClick={(e) => { e.preventDefault(); scrollToSection(s.id) }}
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="toc-divider"></div>
                <div className="toc-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => alert('Preparing a PDF of this Privacy Policy (demo).')}>
                    <i className="fas fa-download"></i> Download PDF
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => window.print()}>
                    <i className="fas fa-print"></i> Print this page
                  </button>
                </div>
              </nav>
            </aside>

            {/* ===== CONTENT ===== */}
            <div className="content-area">

              {/* Summary */}
              <div className="summary-card">
                <h2><i className="fas fa-bolt"></i> Key points at a glance</h2>
                <div className="summary-grid">
                  <div className="summary-point"><i className="fas fa-circle-check"></i> <span><strong>We collect only what is needed</strong> to register users, advertise and match workplace-learning opportunities, and monitor placements.</span></div>
                  <div className="summary-point"><i className="fas fa-circle-check"></i> <span><strong>Your data is used to connect you</strong> with verified employers, institutions and support services within the platform.</span></div>
                  <div className="summary-point"><i className="fas fa-circle-check"></i> <span><strong>We share data only with authorised parties</strong> - such as your institution, a prospective employer you apply to, or mandated government agencies.</span></div>
                  <div className="summary-point"><i className="fas fa-circle-check"></i> <span><strong>We protect your data</strong> through role-based access, encryption in transit, audit trails and regular security reviews.</span></div>
                  <div className="summary-point"><i className="fas fa-circle-check"></i> <span><strong>You have rights</strong> - including access, correction, deletion, objection and portability, subject to applicable law.</span></div>
                  <div className="summary-point"><i className="fas fa-circle-check"></i> <span><strong>We comply with the Kenya Data Protection Act, 2019</strong> and other applicable laws of Kenya.</span></div>
                </div>
              </div>

              {/* 1. Introduction */}
              <section className="policy-section" id="s1">
                <SectionHeader num="1" title="Introduction" subtitle="Scope, purpose and your acceptance of this policy" />
                <p>The National TVET Work-Based Learning Placement System - known as <strong>Ujuzi Link</strong> - is a national digital platform that connects TVET trainees with verified employers and training institutions for industrial attachment, internship, apprenticeship and dual-training placements.</p>
                <p>This Privacy Policy describes how personal data is collected, used, disclosed, stored and protected when you use the Ujuzi Link website, mobile application or any related services (together, “the Platform”). It applies to all users of the Platform, including trainees, employers, training institutions, supervisors and platform administrators.</p>
                <p>By registering for, accessing or using Ujuzi Link, you acknowledge that you have read and understood this Privacy Policy. If you do not agree with any part of this Policy, you should not use the Platform.</p>
                <div className="callout info">
                  <i className="fas fa-circle-info"></i>
                  <div><strong>Notice:</strong> This Policy should be read together with our <a href="/terms" className="inline-link">Terms of Service</a>, <a href="#" className="inline-link">Accessibility Statement</a> and any specific privacy notices provided at the point of data collection.</div>
                </div>
              </section>

              {/* 2. Who we are */}
              <section className="policy-section" id="s2">
                <SectionHeader num="2" title="Who we are" subtitle="The data controller and the institutions we work with" />
                <p>Ujuzi Link is proposed and coordinated by the <strong>State Department for Labour and Skills Development</strong>, under the <strong>Ministry of Labour and Social Protection</strong> of the Republic of Kenya (the “State Department”). The State Department acts as the data controller for personal data processed through the Platform, subject to Government approval and confirmation of the relevant institutional mandates.</p>
                <p>The Platform is delivered in collaboration with:</p>
                <ul className="policy-list">
                  <BulletItem text="The Ministry of Education and the State Department for Technical and Vocational Education and Training (TVET);" />
                  <BulletItem text="The National Industrial Training Authority (NITA) and the Technical and Vocational Education and Training Authority (TVETA);" />
                  <BulletItem text="TVET institutions, employers and host organisations, employer associations and industry bodies;" />
                  <BulletItem text="The ICT Authority and relevant government ICT functions, county governments, and development partners subject to Government approval." />
                </ul>
                <p>Where an institution or employer processes your personal data through the Platform for its own purposes, it may act as a separate data controller for that processing. We require such parties to comply with applicable data protection law and to process your data only for purposes connected with workplace learning.</p>
              </section>

              {/* 3. Definitions */}
              <section className="policy-section" id="s3">
                <SectionHeader num="3" title="Definitions" subtitle="Key terms used in this Policy" />
                <div className="def-grid">
                  <DefCard term="Personal data" text="Any information relating to an identified or identifiable natural person, such as a name, identification number, location data or an online identifier." />
                  <DefCard term="Sensitive personal data" text="Data revealing race, health status, disability, religion, conscience, belief, genetic data, biometric data, property details, marital status, family details or sexual orientation." />
                  <DefCard term="Data controller" text="A person or institution that determines the purpose and means of processing personal data. The State Department is the controller for Ujuzi Link." />
                  <DefCard term="Data processor" text="A person or institution that processes personal data on behalf of, and under the instructions of, a data controller." />
                  <DefCard term="Data subject" text="The individual to whom personal data relates - for example, a trainee, employer contact person or institutional supervisor." />
                  <DefCard term="Processing" text="Any operation performed on personal data, including collection, recording, storage, retrieval, use, disclosure, alteration or deletion." />
                </div>
              </section>

              {/* 4. Personal data */}
              <section className="policy-section" id="s4">
                <SectionHeader num="4" title="Personal data we collect" subtitle="The categories of data collected for each type of user" />

                <h3>Trainees</h3>
                <ul className="policy-list">
                  <BulletItem><strong>Identity data:</strong> first name, surname, other names, preferred name, date of birth, gender, nationality, national ID or passport number, photograph (optional).</BulletItem>
                  <BulletItem><strong>Contact data:</strong> email address, phone number, physical address, town, county and postal code.</BulletItem>
                  <BulletItem><strong>Education and qualification data:</strong> institution, registration number, course, TVET level, year of study, grades, additional qualifications and institutions where they were obtained.</BulletItem>
                  <BulletItem><strong>Application data:</strong> opportunities applied for, applications submitted, uploaded CV, certificates, introduction letters, recommendation letters, portfolio evidence and insurance cover documents.</BulletItem>
                  <BulletItem><strong>Learning data:</strong> placement details, learning plans, logbook entries, supervisor feedback, competency assessments and completion records.</BulletItem>
                  <BulletItem><strong>Inclusion data:</strong> disability status and any reasonable support requirements you choose to share.</BulletItem>
                  <BulletItem><strong>Emergency contact data:</strong> name, relationship and phone number of a contact person.</BulletItem>
                </ul>

                <h3>Employers and host organisations</h3>
                <ul className="policy-list">
                  <BulletItem><strong>Organisation data:</strong> organisation name, registration number or KRA PIN, sector, size, description, physical address, county and logo.</BulletItem>
                  <BulletItem><strong>Contact person data:</strong> name, role, email address and phone number.</BulletItem>
                  <BulletItem><strong>Opportunity data:</strong> opportunities advertised, placement details, requirements, learning plans and assessment methods.</BulletItem>
                  <BulletItem><strong>Individual employer data (where applicable):</strong> name, ID or passport number, email, phone number, gender, county and a description of the practice.</BulletItem>
                </ul>

                <h3>Training institutions</h3>
                <ul className="policy-list">
                  <BulletItem><strong>Institution data:</strong> institution name, abbreviation, institution code, description, active counties, occupational sectors and logo.</BulletItem>
                  <BulletItem><strong>Contact person data:</strong> root email address, contact person name and phone number.</BulletItem>
                  <BulletItem><strong>Verification and supervision data:</strong> trainee verifications, placement approvals, supervisor assignments, progress monitoring records and completion validation.</BulletItem>
                </ul>

                <h3>Technical and usage data</h3>
                <ul className="policy-list">
                  <BulletItem><strong>Device and log data:</strong> IP address, device type, browser type, operating system, access times and pages viewed.</BulletItem>
                  <BulletItem><strong>Authentication data:</strong> login timestamps, password reset events and multi-factor authentication events (if enabled).</BulletItem>
                  <BulletItem><strong>Preferences:</strong> language preference, accessibility settings and notification preferences.</BulletItem>
                </ul>
              </section>

              {/* 5. How we collect */}
              <section className="policy-section" id="s5">
                <SectionHeader num="5" title="How we collect your data" subtitle="Direct, automated and third-party sources" />
                <ul className="policy-list">
                  <BulletItem><strong>Directly from you:</strong> when you register, complete your profile, apply for an opportunity, upload documents, submit logbook entries or contact our support team.</BulletItem>
                  <BulletItem><strong>From your institution:</strong> when your TVET institution verifies your enrolment, approves a placement or submits assessment records.</BulletItem>
                  <BulletItem><strong>From employers:</strong> when an employer responds to your application, provides supervisor feedback or confirms completion of a placement.</BulletItem>
                  <BulletItem><strong>Automatically:</strong> through cookies and similar technologies that help us operate, secure and improve the Platform.</BulletItem>
                  <BulletItem><strong>From authorised public agencies:</strong> where lawful and necessary for verification of identity, registration or placement eligibility.</BulletItem>
                </ul>
              </section>

              {/* 6. Why we use */}
              <section className="policy-section" id="s6">
                <SectionHeader num="6" title="Why we use your data" subtitle="Purposes of processing and the outcomes we aim for" />
                <ul className="policy-list">
                  <BulletItem><strong>To create and manage your account</strong> on the Platform, verify your identity and maintain the security of your profile.</BulletItem>
                  <BulletItem><strong>To facilitate placement matching:</strong> to help trainees find verified opportunities and to help employers and institutions identify suitable trainees.</BulletItem>
                  <BulletItem><strong>To process applications:</strong> to receive, route, review and communicate decisions on applications and placement agreements.</BulletItem>
                  <BulletItem><strong>To support structured learning:</strong> to coordinate learning plans, supervisor feedback, logbooks, competency assessments and completion certification.</BulletItem>
                  <BulletItem><strong>To communicate with you:</strong> to send notifications, reminders, application updates and support messages through the Platform, email and, where feasible, SMS.</BulletItem>
                  <BulletItem><strong>To generate aggregated labour-market information:</strong> to support labour-market analysis, programme planning and policy development. Aggregated and de-identified information does not identify any individual.</BulletItem>
                  <BulletItem><strong>To keep the Platform safe and secure:</strong> to detect and prevent fraud, abuse, unauthorised access and other security incidents.</BulletItem>
                  <BulletItem><strong>To comply with legal obligations:</strong> including obligations under Kenyan law and applicable regulatory requirements.</BulletItem>
                </ul>
                <div className="callout warning">
                  <i className="fas fa-triangle-exclamation"></i>
                  <div><strong>We do not sell your personal data.</strong> We do not use your data for advertising or marketing unrelated to the Platform, and we do not share it with third parties for their own marketing purposes.</div>
                </div>
              </section>

              {/* 7. Legal basis */}
              <section className="policy-section" id="s7">
                <SectionHeader num="7" title="Legal basis for processing" subtitle="Why we are lawfully permitted to process your data" />
                <p>We process your personal data in accordance with the <strong>Kenya Data Protection Act, 2019</strong> and related regulations. Depending on the circumstances, we rely on one or more of the following legal bases:</p>
                <table className="legal-table">
                  <thead>
                    <tr>
                      <th>Legal basis</th>
                      <th>When it applies</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LEGAL_BASIS.map((row, i) => (
                      <tr key={i}>
                        <td>{row.basis}</td>
                        <td>{row.applies}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              {/* 8. Sharing */}
              <section className="policy-section" id="s8">
                <SectionHeader num="8" title="Sharing your data" subtitle="Who may receive your personal data and why" />
                <p>We share personal data only where necessary, and only with parties who are bound by appropriate confidentiality and data protection obligations. Recipients may include:</p>
                <ul className="policy-list">
                  <BulletItem><strong>Your TVET institution:</strong> to verify enrolment, approve placements, assign supervisors and monitor your progress.</BulletItem>
                  <BulletItem><strong>Employers you apply to:</strong> so they can review your application and, if successful, prepare a placement agreement and learning plan.</BulletItem>
                  <BulletItem><strong>Relevant government agencies:</strong> including the State Department for TVET, NITA, TVETA and the ICT Authority, within their respective mandates and as authorised by law.</BulletItem>
                  <BulletItem><strong>Service providers:</strong> who support the operation of the Platform (for example, hosting, authentication, notifications, cybersecurity and technical support) and act under our instructions.</BulletItem>
                  <BulletItem><strong>Law enforcement or regulatory bodies:</strong> where required by law, court order or a lawful request, or where necessary to protect the rights, property or safety of users or the public.</BulletItem>
                  <BulletItem><strong>Development partners:</strong> only where authorised by Government approval and only on an aggregated or de-identified basis, unless you have consented otherwise.</BulletItem>
                </ul>
                <p>Where an employer or institution receives your data through the Platform, that party is responsible for its own onward use of your data in accordance with applicable law. We encourage you to review any separate privacy notices they provide.</p>
              </section>

              {/* 9. Retention */}
              <section className="policy-section" id="s9">
                <SectionHeader num="9" title="How long we keep your data" subtitle="Retention periods and the principles behind them" />
                <p>We retain personal data only for as long as is necessary for the purposes for which it was collected, or as required by law. Retention periods are determined in line with the following principles:</p>
                <ul className="policy-list">
                  <BulletItem><strong>Active accounts:</strong> data is retained while your account remains active and for a reasonable period afterwards to allow you to reactivate it and to support audit and dispute-resolution needs.</BulletItem>
                  <BulletItem><strong>Placement records:</strong> learning plans, logbooks, assessments and completion records are retained in accordance with TVET quality assurance requirements and applicable record-keeping obligations.</BulletItem>
                  <BulletItem><strong>Application data:</strong> unsuccessful application data is retained only for as long as necessary for record-keeping and dispute-resolution purposes, after which it is deleted or de-identified.</BulletItem>
                  <BulletItem><strong>Aggregated information:</strong> de-identified and aggregated information may be retained indefinitely for statistical and planning purposes, as it no longer identifies any individual.</BulletItem>
                </ul>
                <p>When data is no longer required, it is securely deleted or anonymised in accordance with our data governance framework.</p>
              </section>

              {/* 10. Security */}
              <section className="policy-section" id="s10">
                <SectionHeader num="10" title="How we protect your data" subtitle="Technical and organisational security measures" />
                <p>We apply a combination of technical and organisational measures designed to protect personal data against unauthorised access, loss, misuse, alteration or disclosure. These measures include:</p>
                <ul className="policy-list">
                  <BulletItem><strong>Role-based access control</strong> so that users can access only the data they need for their role.</BulletItem>
                  <BulletItem><strong>Encryption in transit</strong> and appropriate protections for data at rest.</BulletItem>
                  <BulletItem><strong>Audit trails and logging</strong> to track access and changes to sensitive records.</BulletItem>
                  <BulletItem><strong>Regular security reviews</strong>, vulnerability management and incident-response procedures.</BulletItem>
                  <BulletItem><strong>Staff training and confidentiality obligations</strong> for personnel who handle personal data.</BulletItem>
                </ul>
                <div className="callout info">
                  <i className="fas fa-circle-info"></i>
                  <div><strong>Security incidents:</strong> If a personal data breach occurs, we will notify the Office of the Data Protection Commissioner and affected data subjects, where required, in accordance with applicable law and our security incident reporting procedures.</div>
                </div>
              </section>

              {/* 11. Your rights */}
              <section className="policy-section" id="s11">
                <SectionHeader num="11" title="Your rights" subtitle="What you can ask us to do with your personal data" />
                <p>Subject to applicable law and certain exceptions, you have the following rights in relation to your personal data:</p>
                <div className="rights-grid">
                  {RIGHTS.map((r, i) => (
                    <div className="right-item" key={i}>
                      <div className="right-icon"><i className={`fas ${r.icon}`}></i></div>
                      <div>
                        <h4>{r.title}</h4>
                        <p>{r.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ marginTop: '1rem' }}>To exercise any of these rights, please contact us using the details in section 16. We may need to verify your identity before acting on a request, and we will respond within the timelines required by law.</p>
              </section>

              {/* 12. Cookies */}
              <section className="policy-section" id="s12">
                <SectionHeader num="12" title="Cookies and similar technologies" subtitle="How we use cookies and how you can manage them" />
                <p>Ujuzi Link uses cookies and similar technologies to operate the Platform securely, remember your preferences and understand how the Platform is used so we can improve it. Cookies are small text files stored on your device when you visit a website.</p>
                <ul className="policy-list">
                  <BulletItem><strong>Strictly necessary cookies:</strong> required for core functions such as secure login, session management and accessibility preferences. These cannot be switched off.</BulletItem>
                  <BulletItem><strong>Functional cookies:</strong> remember your settings, such as language and text size, to provide a more personalised experience.</BulletItem>
                  <BulletItem><strong>Analytical cookies:</strong> help us understand how visitors use the Platform - for example, which pages are most visited - so we can improve the service. These are used in an aggregated form.</BulletItem>
                </ul>
                <p>You can manage or delete cookies through your browser settings. Blocking certain cookies may affect the functionality and performance of the Platform. Where required, we will ask for your consent before setting non-essential cookies.</p>
              </section>

              {/* 13. Children */}
              <section className="policy-section" id="s13">
                <SectionHeader num="13" title="Children and minors" subtitle="Age requirements and safeguards" />
                <p>Ujuzi Link is intended for TVET trainees who are at least 16 years of age, and for employers and institutions acting in a professional capacity. Where a trainee is under 18, we require appropriate safeguards, including parental or guardian consent where required by law, and additional protection in the design of placements and data handling.</p>
                <p>If we become aware that we have collected personal data from a child in circumstances where consent was required and not obtained, we will take reasonable steps to delete that data or to obtain the required consent without undue delay.</p>
              </section>

              {/* 14. International transfers */}
              <section className="policy-section" id="s14">
                <SectionHeader num="14" title="International data transfers" subtitle="Where your data may be processed outside Kenya" />
                <p>The Platform is designed to host personal data within Kenya. Where it becomes necessary to transfer personal data outside Kenya - for example, for hosting, technical support or cybersecurity services - we will ensure that appropriate safeguards are in place in accordance with the Kenya Data Protection Act, 2019. These safeguards may include contractual data protection clauses, adequacy determinations or other lawful transfer mechanisms.</p>
                <p>We will only transfer personal data internationally where the transfer is necessary for the purposes described in this Policy and where the rights of data subjects are adequately protected.</p>
              </section>

              {/* 15. Changes */}
              <section className="policy-section" id="s15">
                <SectionHeader num="15" title="Changes to this Policy" subtitle="How we keep this Policy up to date" />
                <p>We may update this Privacy Policy from time to time to reflect changes in law, the Platform's functionality, or our data protection practices. When we make material changes, we will take appropriate steps to inform you - for example, through a notice on the Platform, by email or through your account.</p>
                <p>The “Last updated” date at the top of this page indicates when this Policy was most recently revised. We encourage you to review this Policy periodically to stay informed about how we protect your data.</p>
              </section>

              {/* 16. Contact */}
              <section className="policy-section" id="s16">
                <SectionHeader num="16" title="How to contact us" subtitle="Questions, requests and complaints" />
                <p>If you have any questions about this Privacy Policy, wish to exercise any of your rights, or have a concern about how your personal data is being handled, please contact us using the details below.</p>
                <div className="contact-block">
                  <h3><i className="fas fa-shield-halved"></i> Data Protection Contact</h3>
                  <div className="contact-line"><i className="fas fa-building"></i> <span><strong>Data Controller:</strong> State Department for Labour and Skills Development, Ministry of Labour and Social Protection</span></div>
                  <div className="contact-line"><i className="fas fa-envelope"></i> <span><strong>Email:</strong> privacy@ujizilink.go.ke</span></div>
                  <div className="contact-line"><i className="fas fa-phone"></i> <span><strong>Phone:</strong> +254 20 000 0000</span></div>
                  <div className="contact-line"><i className="fas fa-map-pin"></i> <span><strong>Address:</strong> Nairobi, Kenya</span></div>
                  <div className="contact-line"><i className="fas fa-globe"></i> <span><strong>Website:</strong> <a href="#" className="inline-link">www.ujizilink.go.ke</a></span></div>
                </div>
                <p style={{ marginTop: '1rem' }}>You also have the right to lodge a complaint with the <strong>Office of the Data Protection Commissioner</strong> of Kenya if you believe your personal data has been processed unlawfully. We would, however, appreciate the opportunity to address your concerns first.</p>
              </section>

              <div className="back-to-top">
                <a href="#main-content">
                  <i className="fas fa-arrow-up"></i> Back to top
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

/* ---- Helpers ---- */

function SectionHeader({ num, title, subtitle }) {
  return (
    <div className="policy-section-header">
      <div className="ps-num">{num}</div>
      <div className="ps-title">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  )
}

function BulletItem({ children, text }) {
  return (
    <li>
      <i className="fas fa-circle"></i>
      <span>{children || text}</span>
    </li>
  )
}

function DefCard({ term, text }) {
  return (
    <div className="def-card">
      <div className="def-term">{term}</div>
      <div className="def-text">{text}</div>
    </div>
  )
}