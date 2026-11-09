import { useState, useEffect } from 'react'
import TopBar from '../components/layout/TopBar.jsx'
import BrandRow from '../components/layout/BrandRow.jsx'
import MainNav from '../components/layout/MainNav.jsx'
import Footer from '../components/layout/Footer.jsx'
import '../styles/home.css'
import '../styles/terms.css'

const SECTIONS = [
  { id: 's1', label: '1. Acceptance of terms' },
  { id: 's2', label: '2. About the Platform' },
  { id: 's3', label: '3. Definitions' },
  { id: 's4', label: '4. Eligibility & accounts' },
  { id: 's5', label: '5. User responsibilities' },
  { id: 's6', label: '6. Acceptable use' },
  { id: 's7', label: '7. Trainee terms' },
  { id: 's8', label: '8. Employer terms' },
  { id: 's9', label: '9. Institution terms' },
  { id: 's10', label: '10. Placements & agreements' },
  { id: 's11', label: '11. Intellectual property' },
  { id: 's12', label: '12. Privacy & data protection' },
  { id: 's13', label: '13. Disclaimers' },
  { id: 's14', label: '14. Limitation of liability' },
  { id: 's15', label: '15. Indemnity' },
  { id: 's16', label: '16. Suspension & termination' },
  { id: 's17', label: '17. Dispute resolution' },
  { id: 's18', label: '18. Changes to these Terms' },
  { id: 's19', label: '19. General provisions' },
  { id: 's20', label: '20. Contact us' }
]

export default function TermsPage() {
  const [activeId, setActiveId] = useState('s1')
  const [tocCollapsed, setTocCollapsed] = useState(false)

  // Scroll spy for TOC
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

      {/* ===== PAGE HEADER ===== */}
      <header className="page-header" id="main-content">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">Home</a>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span>Terms and Conditions of Use</span>
          </div>
          <div className="header-badges">
            <span className="badge"><i className="fas fa-file-contract" aria-hidden="true"></i> Legal agreement</span>
            <span className="badge"><i className="fas fa-scale-balanced" aria-hidden="true"></i> Binding terms</span>
          </div>
          <h1>Terms and Conditions of Use</h1>
          <p className="header-sub">
            These Terms and Conditions of Use (“Terms”) govern your access to and use of the National TVET Work-Based Learning Placement System (“Ujuzi Link” or “the Platform”). By registering for, accessing or using the Platform, you agree to be bound by these Terms.
          </p>
          <div className="header-meta">
            <div className="header-meta-item"><i className="fas fa-calendar-check"></i> <span><strong>Effective:</strong> 1 January 2025</span></div>
            <div className="header-meta-item"><i className="fas fa-rotate"></i> <span><strong>Last updated:</strong> 15 October 2025</span></div>
            <div className="header-meta-item"><i className="fas fa-code-branch"></i> <span><strong>Version:</strong> 1.2</span></div>
            <div className="header-meta-item"><i className="fas fa-gavel"></i> <span><strong>Governing law:</strong> Laws of Kenya</span></div>
          </div>
        </div>
      </header>

      {/* ===== PAGE BODY ===== */}
      <div className="page-body">
        <div className="container">
          <div className="layout-grid">

            {/* ===== TABLE OF CONTENTS ===== */}
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
                  <button className="btn btn-outline btn-sm" onClick={() => alert('Preparing a PDF of these Terms (demo).')}>
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
                  <div className="summary-point"><i className="fas fa-circle-check"></i> <span><strong>Ujuzi Link is a national placement platform</strong> for TVET trainees, employers and training institutions.</span></div>
                  <div className="summary-point"><i className="fas fa-circle-check"></i> <span><strong>You must provide accurate information</strong> and keep your account secure.</span></div>
                  <div className="summary-point"><i className="fas fa-circle-check"></i> <span><strong>Employers must offer genuine opportunities</strong> that comply with labour, safety and safeguarding standards.</span></div>
                  <div className="summary-point"><i className="fas fa-circle-check"></i> <span><strong>Institutions must verify trainees</strong> and supervise placements within their mandate.</span></div>
                  <div className="summary-point"><i className="fas fa-circle-check"></i> <span><strong>Prohibited conduct</strong> includes fraud, misrepresentation, harassment and misuse of personal data.</span></div>
                  <div className="summary-point"><i className="fas fa-circle-check"></i> <span><strong>These Terms are governed by Kenyan law</strong> and may be updated; continued use means acceptance.</span></div>
                </div>
              </div>

              {/* 1. Acceptance */}
              <section className="policy-section" id="s1">
                <SectionHeader num="1" title="Acceptance of terms" subtitle="Your agreement to be bound by these Terms" />
                <p>These Terms and Conditions of Use constitute a legally binding agreement between you (“you”, “your” or “User”) and the <strong>State Department for Labour and Skills Development</strong>, under the Ministry of Labour and Social Protection of the Republic of Kenya (the “State Department”), governing your access to and use of the Ujuzi Link platform, including its website, mobile application and related services.</p>
                <p>By creating an account, accessing or using the Platform, you confirm that you have read, understood and agree to be bound by these Terms, our <a href="#" className="inline-link">Privacy Policy</a> and any additional terms applicable to specific features of the Platform.</p>
                <div className="callout warning">
                  <i className="fas fa-triangle-exclamation"></i>
                  <div><strong>If you do not agree to these Terms</strong>, you must not register for, access or use the Platform. If you are using the Platform on behalf of an organisation, you confirm that you have authority to bind that organisation to these Terms.</div>
                </div>
              </section>

              {/* 2. About */}
              <section className="policy-section" id="s2">
                <SectionHeader num="2" title="About the Platform" subtitle="What Ujuzi Link is, and the role of the State Department" />
                <p>Ujuzi Link is a secure, accessible and nationally coordinated digital platform that connects TVET trainees with verified employers and training institutions for <strong>industrial attachment, internship, apprenticeship and dual-training placements</strong>.</p>
                <p>The Platform enables:</p>
                <ul className="policy-list">
                  <BulletItem text="The registration and verification of trainees, employers, host workplaces and training institutions;" />
                  <BulletItem text="The advertisement, search and application for workplace-learning opportunities;" />
                  <BulletItem text="Transparent matching between trainees and employers based on competency, location, eligibility and availability;" />
                  <BulletItem text="Digital placement agreements, learning plans, logbooks, supervisor feedback and competency assessments;" />
                  <BulletItem text="Aggregated information on occupational demand, placement availability, employer participation and transition outcomes." />
                </ul>
                <p>The State Department provides overall coordination of the Platform, subject to Government approval and confirmation of the relevant institutional mandates. The Platform is designed to complement — not replace — existing industrial-attachment, apprenticeship, TVET quality assurance and employment services.</p>
                <div className="callout info">
                  <i className="fas fa-circle-info"></i>
                  <div><strong>Important:</strong> The Platform facilitates introductions, coordination and record-keeping. It does not itself employ trainees, nor does it guarantee a placement, a particular outcome, or the conduct of any employer, institution or trainee.</div>
                </div>
              </section>

              {/* 3. Definitions */}
              <section className="policy-section" id="s3">
                <SectionHeader num="3" title="Definitions" subtitle="Key terms used in these Terms" />
                <div className="def-grid">
                  <DefCard term="Platform" text="The Ujuzi Link website, mobile application and any related digital services operated or coordinated by the State Department." />
                  <DefCard term="User" text="Any person or organisation that registers for, accesses or uses the Platform — including trainees, employers and training institutions." />
                  <DefCard term="Trainee" text="A registered TVET trainee seeking or undertaking workplace learning through the Platform." />
                  <DefCard term="Employer" text="An organisation or individual that advertises or hosts workplace-learning opportunities through the Platform." />
                  <DefCard term="Institution" text="A TVET training institution that verifies trainees, approves placements and supervises learning within its mandate." />
                  <DefCard term="Placement" text="A workplace-learning arrangement between a trainee and an employer, facilitated through the Platform." />
                </div>
              </section>

              {/* 4. Eligibility */}
              <section className="policy-section" id="s4">
                <SectionHeader num="4" title="Eligibility and accounts" subtitle="Who may use the Platform and how accounts work" />
                <h3>Eligibility</h3>
                <ul className="policy-list">
                  <BulletItem><strong>Trainees:</strong> must be at least 16 years of age, registered with a recognised TVET institution, and provide accurate enrolment details. Where the trainee is under 18, parental or guardian consent may be required.</BulletItem>
                  <BulletItem><strong>Employers:</strong> must be legally established organisations or individuals authorised to offer workplace-learning opportunities in Kenya, and must comply with applicable labour, safety and safeguarding laws.</BulletItem>
                  <BulletItem><strong>Institutions:</strong> must be TVETA-registered or otherwise recognised TVET institutions, and must act within their official mandate.</BulletItem>
                </ul>
                <h3>Account security</h3>
                <ul className="policy-list">
                  <BulletItem text="You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account." />
                  <BulletItem text="You must notify us immediately if you become aware of any unauthorised use of your account or any other security breach." />
                  <BulletItem text="You must not share your account with any other person or organisation, or create multiple accounts to circumvent restrictions." />
                  <BulletItem text="We may suspend or terminate accounts that we reasonably believe have been compromised or misused." />
                </ul>
              </section>

              {/* 5. Responsibilities */}
              <section className="policy-section" id="s5">
                <SectionHeader num="5" title="User responsibilities" subtitle="What we expect from every user of the Platform" />
                <p>As a user of Ujuzi Link, you agree to:</p>
                <ul className="policy-list">
                  <BulletItem text="Provide accurate, current and complete information when registering and using the Platform, and update it promptly when it changes." />
                  <BulletItem text="Use the Platform only for lawful purposes and in accordance with these Terms and all applicable laws of Kenya." />
                  <BulletItem text="Respect the rights, dignity and privacy of other users, including trainees, employers and institutional staff." />
                  <BulletItem text="Comply with all applicable workplace safety, safeguarding and non-discrimination requirements." />
                  <BulletItem text="Keep your account secure and report suspected security incidents promptly." />
                  <BulletItem text="Cooperate with reasonable verification, audit and quality-assurance requests made through the Platform." />
                  <BulletItem text="Use accessibility features and support services responsibly." />
                </ul>
              </section>

              {/* 6. Acceptable use */}
              <section className="policy-section" id="s6">
                <SectionHeader num="6" title="Acceptable use" subtitle="What you may and may not do on the Platform" />
                <div className="dodont-grid">
                  <div className="dodont-card allowed">
                    <h4><i className="fas fa-circle-check"></i> You may</h4>
                    <ul>
                      <li><i className="fas fa-check"></i> Register as a trainee, employer or institution and complete your profile.</li>
                      <li><i className="fas fa-check"></i> Search, apply for and advertise genuine workplace-learning opportunities.</li>
                      <li><i className="fas fa-check"></i> Upload accurate documents and evidence to support applications and placements.</li>
                      <li><i className="fas fa-check"></i> Communicate with other users through the Platform's authorised features.</li>
                      <li><i className="fas fa-check"></i> Use accessibility tools and support services to participate fully.</li>
                    </ul>
                  </div>
                  <div className="dodont-card prohibited">
                    <h4><i className="fas fa-circle-xmark"></i> You may not</h4>
                    <ul>
                      <li><i className="fas fa-times"></i> Post false, misleading or fraudulent opportunities, profiles or documents.</li>
                      <li><i className="fas fa-times"></i> Impersonate another person or organisation.</li>
                      <li><i className="fas fa-times"></i> Harass, threaten or discriminate against any user.</li>
                      <li><i className="fas fa-times"></i> Collect, scrape or misuse other users' personal data.</li>
                      <li><i className="fas fa-times"></i> Introduce viruses, malware or attempt to gain unauthorised access to the Platform.</li>
                      <li><i className="fas fa-times"></i> Charge trainees for access to opportunities or placements.</li>
                    </ul>
                  </div>
                </div>
                <div className="callout danger">
                  <i className="fas fa-circle-exclamation"></i>
                  <div><strong>Zero tolerance:</strong> We take fraud, misrepresentation and abuse seriously. We may suspend or terminate accounts and, where appropriate, refer matters to law enforcement or relevant regulatory authorities.</div>
                </div>
              </section>

              {/* 7. Trainee terms */}
              <section className="policy-section" id="s7">
                <SectionHeader num="7" title="Additional terms for trainees" subtitle="Responsibilities specific to trainees" />
                <ul className="policy-list">
                  <BulletItem><strong>Accurate profile:</strong> you must provide accurate information about your institution, course, qualifications, availability and any reasonable support requirements.</BulletItem>
                  <BulletItem><strong>Genuine applications:</strong> you must apply for opportunities you genuinely intend to take up, and respond honestly to employers and institutions.</BulletItem>
                  <BulletItem><strong>Documents:</strong> you must upload genuine documents, including your CV, certificates, identification and insurance cover where required.</BulletItem>
                  <BulletItem><strong>Placement conduct:</strong> once a placement commences, you must comply with the workplace's rules, safety protocols and safeguarding policies, and maintain your logbook.</BulletItem>
                  <BulletItem><strong>Feedback:</strong> you should provide honest feedback on placement quality and workplace experiences to help improve the Platform.</BulletItem>
                </ul>
                <div className="callout warning">
                  <i className="fas fa-triangle-exclamation"></i>
                  <div><strong>Be alert to fraud:</strong> Ujuzi Link does not charge trainees for access to opportunities, matching or placements. If anyone asks you to pay for a placement, report it immediately through our support channels.</div>
                </div>
              </section>

              {/* 8. Employer terms */}
              <section className="policy-section" id="s8">
                <SectionHeader num="8" title="Additional terms for employers" subtitle="Responsibilities specific to employers and host organisations" />
                <ul className="policy-list">
                  <BulletItem><strong>Genuine opportunities:</strong> you must advertise genuine workplace-learning opportunities that provide meaningful practical experience, and you must not misrepresent the nature, duration or conditions of a placement.</BulletItem>
                  <BulletItem><strong>Safety and safeguarding:</strong> you must provide a safe working environment, comply with occupational safety and health requirements, and protect trainees from harm, harassment and exploitation.</BulletItem>
                  <BulletItem><strong>Fair terms:</strong> you must comply with applicable labour laws, TVET placement standards and any agreed stipend, working hours and conditions.</BulletItem>
                  <BulletItem><strong>Supervision:</strong> you must designate a workplace supervisor, support the trainee's learning plan, monitor progress and provide assessment feedback.</BulletItem>
                  <BulletItem><strong>Non-discrimination:</strong> you must offer opportunities without discrimination on grounds prohibited by law.</BulletItem>
                  <BulletItem><strong>No fees:</strong> you must not charge trainees any fee, deposit or payment as a condition of placement.</BulletItem>
                </ul>
              </section>

              {/* 9. Institution terms */}
              <section className="policy-section" id="s9">
                <SectionHeader num="9" title="Additional terms for institutions" subtitle="Responsibilities specific to TVET institutions" />
                <ul className="policy-list">
                  <BulletItem><strong>Verification:</strong> you must verify trainee enrolment, programme details and placement eligibility accurately and in a timely manner.</BulletItem>
                  <BulletItem><strong>Approvals:</strong> you must review and approve placements where required, in line with your institution's policies and TVETA standards.</BulletItem>
                  <BulletItem><strong>Supervision:</strong> you must assign institutional supervisors, coordinate learning plans and monitor trainee progress.</BulletItem>
                  <BulletItem><strong>Assessment and completion:</strong> you must validate completion and assessment records in accordance with applicable requirements.</BulletItem>
                  <BulletItem><strong>Data accuracy:</strong> you must keep institutional information, contact details and active counties up to date.</BulletItem>
                </ul>
              </section>

              {/* 10. Placements */}
              <section className="policy-section" id="s10">
                <SectionHeader num="10" title="Placements and agreements" subtitle="How placements are formalised through the Platform" />
                <p>A placement is formalised when the trainee, employer and, where required, the institution have agreed the placement through the Platform and a digital placement agreement and learning plan have been generated.</p>
                <ul className="policy-list">
                  <BulletItem><strong>Role of the Platform:</strong> Ujuzi Link facilitates the process and maintains records. The legal relationship of any placement is between the trainee, the employer and, where applicable, the institution.</BulletItem>
                  <BulletItem><strong>Learning plan:</strong> the employer and institution should agree a structured learning plan setting out activities, supervision and assessment arrangements.</BulletItem>
                  <BulletItem><strong>Changes:</strong> any material change to a placement — including duration, location or conditions — should be recorded through the Platform and agreed by the relevant parties.</BulletItem>
                  <BulletItem><strong>Completion:</strong> upon completion, the employer and institution should record assessment outcomes and confirm completion through the Platform.</BulletItem>
                </ul>
              </section>

              {/* 11. IP */}
              <section className="policy-section" id="s11">
                <SectionHeader num="11" title="Intellectual property" subtitle="Ownership of content and materials on the Platform" />
                <p>The Platform, including its design, text, graphics, logos, software and other materials provided by the State Department (the “Platform Content”), is protected by intellectual property laws and remains the property of the State Department or its licensors.</p>
                <ul className="policy-list">
                  <BulletItem text="You may use the Platform Content only for the purposes of using the Platform in accordance with these Terms." />
                  <BulletItem text="You may not copy, reproduce, modify, distribute, sell or exploit the Platform Content without prior written permission, except as permitted by law." />
                  <BulletItem text="You retain ownership of the content you upload (such as your CV, documents and feedback) but grant the State Department a non-exclusive licence to use, store and process that content to operate and improve the Platform, in accordance with our Privacy Policy." />
                </ul>
              </section>

              {/* 12. Privacy */}
              <section className="policy-section" id="s12">
                <SectionHeader num="12" title="Privacy and data protection" subtitle="How these Terms relate to our Privacy Policy" />
                <p>Your use of the Platform involves the collection and processing of personal data. Our <a href="#" className="inline-link">Privacy Policy</a> explains what data we collect, how we use it, who we share it with, how long we keep it and the rights available to you.</p>
                <p>The Privacy Policy forms part of these Terms. By accepting these Terms, you also acknowledge the processing described in the Privacy Policy. Where there is any conflict between these Terms and the Privacy Policy on matters of personal data processing, the Privacy Policy prevails.</p>
                <div className="callout info">
                  <i className="fas fa-circle-info"></i>
                  <div><strong>Data protection law:</strong> We process personal data in accordance with the Kenya Data Protection Act, 2019 and related regulations. You may contact our data protection team using the details in section 20.</div>
                </div>
              </section>

              {/* 13. Disclaimers */}
              <section className="policy-section" id="s13">
                <SectionHeader num="13" title="Disclaimers" subtitle="The limits of what we can promise about the Platform" />
                <p>The Platform is provided on an “as is” and “as available” basis. While we take reasonable steps to ensure the Platform is accurate, secure and available, we do not warrant or guarantee that:</p>
                <ul className="policy-list">
                  <BulletItem text="The Platform will be uninterrupted, error-free or free from harmful components;" />
                  <BulletItem text="Any particular trainee will secure a placement, or any particular employer will fill an opportunity;" />
                  <BulletItem text="Information provided by other users is accurate, complete or reliable;" />
                  <BulletItem text="The conduct of any employer, institution or trainee will meet your expectations." />
                </ul>
                <p>Nothing in these Terms excludes or limits any liability that cannot lawfully be excluded or limited under the laws of Kenya.</p>
              </section>

              {/* 14. Liability */}
              <section className="policy-section" id="s14">
                <SectionHeader num="14" title="Limitation of liability" subtitle="How liability is limited under these Terms" />
                <p>To the maximum extent permitted by law, the State Department and its officers, employees, agents and partners shall not be liable for any indirect, incidental, special, consequential or punitive damages, or for any loss of profits, opportunity, data or goodwill, arising out of or in connection with your use of the Platform.</p>
                <p>This limitation applies regardless of the legal theory on which the claim is based, and even if we have been advised of the possibility of such damages. It does not affect any liability that cannot be excluded or limited by law.</p>
              </section>

              {/* 15. Indemnity */}
              <section className="policy-section" id="s15">
                <SectionHeader num="15" title="Indemnity" subtitle="Your responsibility to cover certain losses" />
                <p>You agree to indemnify and hold harmless the State Department and its officers, employees, agents and partners from and against any claims, liabilities, damages, losses, costs or expenses (including reasonable legal fees) arising out of or in connection with:</p>
                <ul className="policy-list">
                  <BulletItem text="Your breach of these Terms or applicable law;" />
                  <BulletItem text="Content you upload or share through the Platform;" />
                  <BulletItem text="Your interaction with other users, including any placement arrangement; or" />
                  <BulletItem text="Any misuse of the Platform by you or anyone using your account." />
                </ul>
              </section>

              {/* 16. Termination */}
              <section className="policy-section" id="s16">
                <SectionHeader num="16" title="Suspension and termination" subtitle="When accounts may be suspended or closed" />
                <p>We may suspend, restrict or terminate your access to the Platform, with or without notice, if we reasonably believe that:</p>
                <ul className="policy-list">
                  <BulletItem text="You have breached these Terms or applicable law;" />
                  <BulletItem text="Your account has been used for fraud, misrepresentation or abuse;" />
                  <BulletItem text="Your continued use poses a risk to other users, the Platform or the public; or" />
                  <BulletItem text="We are required to do so by law or by a competent authority." />
                </ul>
                <p>You may close your account at any time by contacting our support team, subject to any lawful retention obligations and the completion of any active placement arrangements. Termination does not affect any rights or obligations that arose before termination.</p>
              </section>

              {/* 17. Dispute */}
              <section className="policy-section" id="s17">
                <SectionHeader num="17" title="Dispute resolution" subtitle="How we handle disagreements" />
                <p>We encourage users to resolve disputes directly and constructively. If a dispute arises between users in relation to a placement, the relevant institution and, where appropriate, the State Department may assist in facilitating resolution in accordance with the Platform's complaints-handling procedures.</p>
                <p>Any dispute arising out of or in connection with these Terms that cannot be resolved amicably shall be subject to the exclusive jurisdiction of the courts of Kenya, and shall be governed by the laws of Kenya.</p>
              </section>

              {/* 18. Changes */}
              <section className="policy-section" id="s18">
                <SectionHeader num="18" title="Changes to these Terms" subtitle="How we keep these Terms up to date" />
                <p>We may update these Terms from time to time to reflect changes in law, the Platform's functionality, or our practices. When we make material changes, we will take appropriate steps to inform you — for example, through a notice on the Platform, by email or through your account.</p>
                <p>The “Last updated” date at the top of this page indicates when these Terms were most recently revised. Your continued use of the Platform after changes take effect constitutes acceptance of the revised Terms.</p>
              </section>

              {/* 19. General */}
              <section className="policy-section" id="s19">
                <SectionHeader num="19" title="General provisions" subtitle="Governing law, entire agreement and severability" />
                <ul className="policy-list">
                  <BulletItem><strong>Governing law:</strong> These Terms are governed by and construed in accordance with the laws of Kenya.</BulletItem>
                  <BulletItem><strong>Entire agreement:</strong> These Terms, together with the Privacy Policy and any additional terms applicable to specific features, constitute the entire agreement between you and the State Department regarding the Platform.</BulletItem>
                  <BulletItem><strong>Severability:</strong> If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect.</BulletItem>
                  <BulletItem><strong>No waiver:</strong> A failure or delay in exercising any right under these Terms does not constitute a waiver of that right.</BulletItem>
                  <BulletItem><strong>Assignment:</strong> You may not assign or transfer your rights or obligations under these Terms without our prior written consent.</BulletItem>
                </ul>
              </section>

              {/* 20. Contact */}
              <section className="policy-section" id="s20">
                <SectionHeader num="20" title="Contact us" subtitle="Questions about these Terms" />
                <p>If you have any questions about these Terms and Conditions of Use, or if you wish to report a concern about the Platform, please contact us using the details below.</p>
                <div className="contact-block">
                  <h3><i className="fas fa-scale-balanced"></i> Legal &amp; Platform Contact</h3>
                  <div className="contact-line"><i className="fas fa-building"></i> <span><strong>Platform owner:</strong> State Department for Labour and Skills Development, Ministry of Labour and Social Protection</span></div>
                  <div className="contact-line"><i className="fas fa-envelope"></i> <span><strong>Email:</strong> legal@ujizilink.go.ke</span></div>
                  <div className="contact-line"><i className="fas fa-phone"></i> <span><strong>Phone:</strong> +254 20 000 0000</span></div>
                  <div className="contact-line"><i className="fas fa-map-pin"></i> <span><strong>Address:</strong> Nairobi, Kenya</span></div>
                  <div className="contact-line"><i className="fas fa-globe"></i> <span><strong>Website:</strong> <a href="#" className="inline-link">www.ujizilink.go.ke</a></span></div>
                </div>
                <p style={{ marginTop: '1rem' }}>
                  For data protection matters, please see the contact details in our <a href="#" className="inline-link">Privacy Policy</a>. If you believe these Terms or your use of the Platform raise a legal issue, you may also seek independent legal advice.
                </p>
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

/* ---- Small helper components ---- */

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