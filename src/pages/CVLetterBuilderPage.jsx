import { useState } from 'react'
import TopBar from '../components/layout/TopBar.jsx'
import BrandRow from '../components/layout/BrandRow.jsx'
import MainNav from '../components/layout/MainNav.jsx'
import Footer from '../components/layout/Footer.jsx'
import '../styles/home.css'
import '../styles/cv-letter-builder.css'

const makeId = (prefix) => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`

const SAMPLE_DATA = {
  personal: {
    fullName: 'Jane Wanjiku',
    jobTitle: 'Electrical Installation Technician',
    email: 'jane.wanjiku@example.com',
    phone: '+254 712 345 678',
    location: 'Nairobi, Kenya',
    nationality: 'Kenyan',
    portfolio: 'https://linkedin.com/in/janewanjiku'
  },
  summary: 'Motivated final-year Diploma in Electrical Installation trainee with hands-on experience in domestic and commercial wiring, fault-finding and safety compliance. Seeking a structured apprenticeship to consolidate practical competencies and contribute to reliable power distribution in Kenya.',
  education: [
    { id: 'edu_1', qualification: 'Diploma', field: 'Electrical Installation', institution: 'Nairobi Technical Training Institute', startYear: '2023', endYear: '2025', grade: 'Distinction' },
    { id: 'edu_2', qualification: 'Certificate', field: 'Solar PV Installation', institution: 'Kenya Institute of Management', startYear: '2024', endYear: '2024', grade: 'Pass' }
  ],
  experience: [
    { id: 'exp_1', role: 'Electrical Installation Attachment', organisation: 'Kenya Power & Lighting Co.', startDate: 'Jun 2025', endDate: 'Aug 2025', description: 'Assisted in domestic wiring installation and distribution board assembly\nCompleted 8 supervised installations and documented safety checks\nSupported routine transformer inspection and metering' },
    { id: 'exp_2', role: 'Solar PV Installation Attachment', organisation: 'M-KOPA Solar', startDate: 'Dec 2024', endDate: 'Jan 2025', description: 'Supported solar panel installation and wiring for residential systems\nGained practical exposure to inverter setup and battery maintenance' }
  ],
  skills: ['Electrical wiring', 'Circuit analysis', 'Safety protocols', 'Blueprint reading', 'Solar PV installation', 'Fault-finding', 'Teamwork', 'Attention to detail'],
  referees: [
    { id: 'ref_1', name: 'Eng. Peter Kamau', role: 'Workplace Supervisor', organisation: 'Kenya Power', email: 'peter.kamau@kplc.co.ke', phone: '+254 711 223 344' },
    { id: 'ref_2', name: 'Mr. John Mwangi', role: 'Institutional Supervisor', organisation: 'Nairobi Technical Training Institute', email: 'john.mwangi@ntti.ac.ke', phone: '+254 722 556 677' }
  ],
  letter: {
    targetRole: 'Electrical Installation Technician',
    company: 'Kenya Power & Lighting Co.',
    recipient: 'Ms. Mary Atieno, HR Manager',
    address: 'P.O. Box 30099 – 00100, Nairobi',
    date: new Date().toISOString().slice(0, 10),
    intro: 'I am writing to apply for the Electrical Installation Technician apprenticeship advertised on Ujuzi Link. As a final-year Diploma in Electrical Installation trainee at Nairobi Technical Training Institute, I am eager to contribute my practical skills and learn from your experienced team.',
    body: 'During my recent attachment at Kenya Power, I gained hands-on experience in domestic wiring, distribution board assembly and safety inspections. I also completed a Certificate in Solar PV Installation, which broadened my understanding of renewable energy systems. My supervisors have noted my safety-conscious approach, attention to detail and reliability.',
    closing: 'I would welcome the opportunity to discuss how I can contribute to your team. Thank you for considering my application. I look forward to hearing from you.'
  }
}

const EMPTY_PERSONAL = { fullName: '', jobTitle: '', email: '', phone: '', location: '', nationality: 'Kenyan', portfolio: '' }
const EMPTY_LETTER = { targetRole: '', company: '', recipient: '', address: '', date: new Date().toISOString().slice(0, 10), intro: '', body: '', closing: '' }

export default function CVLetterBuilderPage() {
  const [activeDoc, setActiveDoc] = useState('cv') // 'cv' | 'letter'
  const [activeSection, setActiveSection] = useState('personal')
  const [personal, setPersonal] = useState(EMPTY_PERSONAL)
  const [summary, setSummary] = useState('')
  const [education, setEducation] = useState([])
  const [experience, setExperience] = useState([])
  const [skills, setSkills] = useState([])
  const [skillInput, setSkillInput] = useState('')
  const [referees, setReferees] = useState([])
  const [letter, setLetter] = useState(EMPTY_LETTER)

  const handlePersonal = (e) => setPersonal(prev => ({ ...prev, [e.target.name]: e.target.value }))
  const handleLetter = (e) => setLetter(prev => ({ ...prev, [e.target.name]: e.target.value }))

  // Education handlers
  const addEducation = () => setEducation(prev => [...prev, { id: makeId('edu'), qualification: '', field: '', institution: '', startYear: '', endYear: '', grade: '' }])
  const updateEducation = (id, field, value) => setEducation(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e))
  const removeEducation = (id) => setEducation(prev => prev.filter(e => e.id !== id))

  // Experience handlers
  const addExperience = () => setExperience(prev => [...prev, { id: makeId('exp'), role: '', organisation: '', startDate: '', endDate: '', description: '' }])
  const updateExperience = (id, field, value) => setExperience(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e))
  const removeExperience = (id) => setExperience(prev => prev.filter(e => e.id !== id))

  // Referees handlers
  const addReferee = () => setReferees(prev => [...prev, { id: makeId('ref'), name: '', role: '', organisation: '', email: '', phone: '' }])
  const updateReferee = (id, field, value) => setReferees(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  const removeReferee = (id) => setReferees(prev => prev.filter(r => r.id !== id))

  // Skills handlers
  const addSkill = (text) => {
    const clean = text.trim().replace(/,$/, '')
    if (!clean) return
    if (skills.some(s => s.toLowerCase() === clean.toLowerCase())) return
    setSkills(prev => [...prev, clean])
  }
  const removeSkill = (skill) => setSkills(prev => prev.filter(s => s !== skill))

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addSkill(skillInput)
      setSkillInput('')
    } else if (e.key === 'Backspace' && !skillInput && skills.length > 0) {
      removeSkill(skills[skills.length - 1])
    }
  }

  // Load sample
  const loadSample = () => {
    setPersonal(SAMPLE_DATA.personal)
    setSummary(SAMPLE_DATA.summary)
    setEducation(SAMPLE_DATA.education)
    setExperience(SAMPLE_DATA.experience)
    setSkills(SAMPLE_DATA.skills)
    setReferees(SAMPLE_DATA.referees)
    setLetter(SAMPLE_DATA.letter)
    setActiveSection('personal')
    setActiveDoc('cv')
    alert('Sample CV and application letter loaded.')
  }

  // Printable
  const handleDownload = () => {
    alert('Preparing your document for download (demo).\n\nTip: use your browser\'s Print → Save as PDF for a real PDF.')
    setTimeout(() => window.print(), 600)
  }

  // Derived preview values
  const displayName = personal.fullName || 'Your Full Name'
  const displayRole = personal.jobTitle || 'Your Professional Title'
  const displayEmail = personal.email || 'your@email.com'
  const displayPhone = personal.phone || '+254 700 000 000'
  const displayLocation = personal.location || 'Location'

  const hasSummary = !!summary.trim()
  const hasEducation = education.length > 0
  const hasExperience = experience.length > 0
  const hasSkills = skills.length > 0
  const hasReferees = referees.length > 0

  const hasLetterContent = letter.targetRole || letter.company || letter.intro || letter.body || letter.closing

  const letterDateFormatted = letter.date
    ? new Date(letter.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  const sections = [
    { id: 'personal', label: 'Personal', icon: 'fa-user', complete: !!(personal.fullName && personal.jobTitle) },
    { id: 'summary', label: 'Summary', icon: 'fa-align-left', complete: hasSummary },
    { id: 'education', label: 'Education', icon: 'fa-graduation-cap', complete: hasEducation },
    { id: 'experience', label: 'Experience', icon: 'fa-briefcase', complete: hasExperience },
    { id: 'skills', label: 'Skills', icon: 'fa-tools', complete: hasSkills },
    { id: 'referees', label: 'Referees', icon: 'fa-user-tie', complete: hasReferees }
  ]

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
            <a href="/trainees">Trainees</a>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <a href="#">Career guidance</a>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span>CV &amp; application letter builder</span>
          </div>
          <div className="header-flex">
            <div>
              <div className="header-badges">
                <span className="badge"><i className="fas fa-file-signature"></i> Build a professional application</span>
              </div>
              <h1>CV &amp; application letter builder</h1>
              <p className="header-sub">Create a professional, TVET-focused CV and a matching cover letter. Fill in the form on the left and watch the preview update in real time — then download as PDF or print.</p>
            </div>
            <div className="header-actions">
              <button className="btn btn-light" onClick={loadSample}>
                <i className="fas fa-wand-magic-sparkles"></i> Load sample
              </button>
              <button className="btn btn-outline-light" onClick={() => alert('Opening the CV & application guide (demo).')}>
                <i className="fas fa-circle-question"></i> Help
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="page-body">
        <div className="container">
          <div className="builder-layout">
            {/* ===== FORM COLUMN ===== */}
            <div className="builder-form">
              {/* Doc tabs */}
              <div className="doc-tabs" role="tablist">
                <button
                  className={`doc-tab ${activeDoc === 'cv' ? 'active' : ''}`}
                  onClick={() => setActiveDoc('cv')}
                >
                  <i className="fas fa-file-user"></i> Curriculum Vitae
                </button>
                <button
                  className={`doc-tab ${activeDoc === 'letter' ? 'active' : ''}`}
                  onClick={() => setActiveDoc('letter')}
                >
                  <i className="fas fa-envelope-open-text"></i> Application Letter
                </button>
              </div>

              {/* ===== CV FORM ===== */}
              {activeDoc === 'cv' && (
                <>
                  <div className="form-section-nav">
                    {sections.map(s => (
                      <button
                        key={s.id}
                        className={`fsn-btn ${activeSection === s.id ? 'active' : ''} ${s.complete ? 'complete' : ''}`}
                        onClick={() => setActiveSection(s.id)}
                      >
                        <i className={`fas ${s.icon}`}></i> {s.label}
                        <span className="fsn-check"><i className="fas fa-check-circle"></i></span>
                      </button>
                    ))}
                  </div>

                  {/* Personal */}
                  {activeSection === 'personal' && (
                    <div className="form-card">
                      <div className="form-card-header">
                        <h2><i className="fas fa-user"></i> Personal details</h2>
                        <span className="header-hint">Required</span>
                      </div>
                      <div className="form-card-body">
                        <div className="form-row-2">
                          <div className="form-group">
                            <label>Full name <span className="required">*</span></label>
                            <div className="input-wrapper">
                              <i className="fas fa-user"></i>
                              <input type="text" name="fullName" value={personal.fullName} onChange={handlePersonal} placeholder="e.g. Jane Wanjiku" />
                            </div>
                          </div>
                          <div className="form-group">
                            <label>Professional title / target role</label>
                            <div className="input-wrapper">
                              <i className="fas fa-id-badge"></i>
                              <input type="text" name="jobTitle" value={personal.jobTitle} onChange={handlePersonal} placeholder="e.g. Electrical Installation Technician" />
                            </div>
                          </div>
                        </div>
                        <div className="form-row-2">
                          <div className="form-group">
                            <label>Email address</label>
                            <div className="input-wrapper">
                              <i className="fas fa-envelope"></i>
                              <input type="email" name="email" value={personal.email} onChange={handlePersonal} placeholder="e.g. jane.wanjiku@example.com" />
                            </div>
                          </div>
                          <div className="form-group">
                            <label>Phone number</label>
                            <div className="input-wrapper">
                              <i className="fas fa-phone"></i>
                              <input type="tel" name="phone" value={personal.phone} onChange={handlePersonal} placeholder="e.g. +254 712 345 678" />
                            </div>
                          </div>
                        </div>
                        <div className="form-row-2">
                          <div className="form-group">
                            <label>Location (county / town)</label>
                            <div className="input-wrapper">
                              <i className="fas fa-map-marker-alt"></i>
                              <input type="text" name="location" value={personal.location} onChange={handlePersonal} placeholder="e.g. Nairobi, Kenya" />
                            </div>
                          </div>
                          <div className="form-group">
                            <label>Nationality</label>
                            <div className="input-wrapper">
                              <i className="fas fa-flag"></i>
                              <input type="text" name="nationality" value={personal.nationality} onChange={handlePersonal} placeholder="e.g. Kenyan" />
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Portfolio / LinkedIn (optional)</label>
                          <div className="input-wrapper">
                            <i className="fas fa-link"></i>
                            <input type="url" name="portfolio" value={personal.portfolio} onChange={handlePersonal} placeholder="e.g. https://linkedin.com/in/yourname" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  {activeSection === 'summary' && (
                    <div className="form-card">
                      <div className="form-card-header">
                        <h2><i className="fas fa-align-left"></i> Professional summary</h2>
                        <span className="header-hint">2–4 sentences</span>
                      </div>
                      <div className="form-card-body">
                        <div className="form-group">
                          <label>Short professional summary</label>
                          <div className="input-wrapper">
                            <i className="fas fa-align-left"></i>
                            <textarea rows="5" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="e.g. Motivated TVET trainee with a Diploma in Electrical Installation, seeking an apprenticeship to consolidate practical skills in wiring, maintenance and safety. Safety-conscious, reliable and eager to learn from experienced technicians." />
                          </div>
                          <span className="form-hint">Tip: mention your programme, level, key strengths and the kind of opportunity you want.</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {activeSection === 'education' && (
                    <div className="form-card">
                      <div className="form-card-header">
                        <h2><i className="fas fa-graduation-cap"></i> Education &amp; qualifications</h2>
                        <span className="header-hint">Most recent first</span>
                      </div>
                      <div className="form-card-body">
                        <div className="repeat-list">
                          {education.map((edu, idx) => (
                            <div className="repeat-item" key={edu.id}>
                              <div className="repeat-item-header">
                                <div className="ri-title"><i className="fas fa-graduation-cap"></i> Qualification {idx + 1}</div>
                                <button type="button" className="remove-btn" onClick={() => removeEducation(edu.id)}>
                                  <i className="fas fa-trash"></i> Remove
                                </button>
                              </div>
                              <div className="form-row-2">
                                <div className="form-group">
                                  <label>Qualification</label>
                                  <div className="input-wrapper">
                                    <i className="fas fa-award"></i>
                                    <input type="text" value={edu.qualification} onChange={(e) => updateEducation(edu.id, 'qualification', e.target.value)} placeholder="e.g. Diploma" />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label>Field of study</label>
                                  <div className="input-wrapper">
                                    <i className="fas fa-book"></i>
                                    <input type="text" value={edu.field} onChange={(e) => updateEducation(edu.id, 'field', e.target.value)} placeholder="e.g. Electrical Installation" />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <label>Institution</label>
                                <div className="input-wrapper">
                                  <i className="fas fa-university"></i>
                                  <input type="text" value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} placeholder="e.g. Nairobi Technical Training Institute" />
                                </div>
                              </div>
                              <div className="form-row-2">
                                <div className="form-group">
                                  <label>Start year</label>
                                  <div className="input-wrapper">
                                    <i className="fas fa-calendar"></i>
                                    <input type="text" value={edu.startYear} onChange={(e) => updateEducation(edu.id, 'startYear', e.target.value)} placeholder="e.g. 2023" />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label>End year</label>
                                  <div className="input-wrapper">
                                    <i className="fas fa-calendar-check"></i>
                                    <input type="text" value={edu.endYear} onChange={(e) => updateEducation(edu.id, 'endYear', e.target.value)} placeholder="e.g. 2025" />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <label>Grade / award (optional)</label>
                                <div className="input-wrapper">
                                  <i className="fas fa-star"></i>
                                  <input type="text" value={edu.grade} onChange={(e) => updateEducation(edu.id, 'grade', e.target.value)} placeholder="e.g. Distinction" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button type="button" className="add-btn" onClick={addEducation}>
                          <i className="fas fa-plus-circle"></i> Add another qualification
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {activeSection === 'experience' && (
                    <div className="form-card">
                      <div className="form-card-header">
                        <h2><i className="fas fa-briefcase"></i> Work experience &amp; attachments</h2>
                        <span className="header-hint">Most recent first</span>
                      </div>
                      <div className="form-card-body">
                        <div className="repeat-list">
                          {experience.map((exp, idx) => (
                            <div className="repeat-item" key={exp.id}>
                              <div className="repeat-item-header">
                                <div className="ri-title"><i className="fas fa-briefcase"></i> Experience {idx + 1}</div>
                                <button type="button" className="remove-btn" onClick={() => removeExperience(exp.id)}>
                                  <i className="fas fa-trash"></i> Remove
                                </button>
                              </div>
                              <div className="form-row-2">
                                <div className="form-group">
                                  <label>Role / title</label>
                                  <div className="input-wrapper">
                                    <i className="fas fa-id-badge"></i>
                                    <input type="text" value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} placeholder="e.g. Electrical Attachment Trainee" />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label>Organisation</label>
                                  <div className="input-wrapper">
                                    <i className="fas fa-building"></i>
                                    <input type="text" value={exp.organisation} onChange={(e) => updateExperience(exp.id, 'organisation', e.target.value)} placeholder="e.g. Kenya Power" />
                                  </div>
                                </div>
                              </div>
                              <div className="form-row-2">
                                <div className="form-group">
                                  <label>Start date</label>
                                  <div className="input-wrapper">
                                    <i className="fas fa-calendar"></i>
                                    <input type="text" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} placeholder="e.g. Jun 2025" />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label>End date</label>
                                  <div className="input-wrapper">
                                    <i className="fas fa-calendar-check"></i>
                                    <input type="text" value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} placeholder="e.g. Aug 2025" />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <label>Description (one responsibility per line)</label>
                                <div className="input-wrapper">
                                  <i className="fas fa-align-left"></i>
                                  <textarea rows="3" value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} placeholder="e.g. Assisted in domestic wiring installations&#10;Documented safety checks" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button type="button" className="add-btn" onClick={addExperience}>
                          <i className="fas fa-plus-circle"></i> Add another experience
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {activeSection === 'skills' && (
                    <div className="form-card">
                      <div className="form-card-header">
                        <h2><i className="fas fa-tools"></i> Skills &amp; competencies</h2>
                        <span className="header-hint">Add 6–10 skills</span>
                      </div>
                      <div className="form-card-body">
                        <div className="form-group">
                          <label>Skills (press Enter or comma to add)</label>
                          <div className="input-wrapper">
                            <i className="fas fa-plus"></i>
                            <input
                              type="text"
                              value={skillInput}
                              onChange={(e) => setSkillInput(e.target.value)}
                              onKeyDown={handleSkillKeyDown}
                              placeholder="e.g. Electrical wiring, Circuit analysis, Safety protocols"
                            />
                          </div>
                          <span className="form-hint">Add technical and soft skills relevant to your target role.</span>
                        </div>
                        <div className="tags-wrap">
                          {skills.length === 0 ? (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No skills added yet.</span>
                          ) : (
                            skills.map(skill => (
                              <span key={skill} className="skill-chip">
                                {skill}
                                <button type="button" onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`}>
                                  <i className="fas fa-times"></i>
                                </button>
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Referees */}
                  {activeSection === 'referees' && (
                    <div className="form-card">
                      <div className="form-card-header">
                        <h2><i className="fas fa-user-tie"></i> Referees</h2>
                        <span className="header-hint">2 referees recommended</span>
                      </div>
                      <div className="form-card-body">
                        <div className="repeat-list">
                          {referees.map((ref, idx) => (
                            <div className="repeat-item" key={ref.id}>
                              <div className="repeat-item-header">
                                <div className="ri-title"><i className="fas fa-user-tie"></i> Referee {idx + 1}</div>
                                <button type="button" className="remove-btn" onClick={() => removeReferee(ref.id)}>
                                  <i className="fas fa-trash"></i> Remove
                                </button>
                              </div>
                              <div className="form-row-2">
                                <div className="form-group">
                                  <label>Full name</label>
                                  <div className="input-wrapper">
                                    <i className="fas fa-user"></i>
                                    <input type="text" value={ref.name} onChange={(e) => updateReferee(ref.id, 'name', e.target.value)} placeholder="e.g. Eng. Peter Kamau" />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label>Role / title</label>
                                  <div className="input-wrapper">
                                    <i className="fas fa-briefcase"></i>
                                    <input type="text" value={ref.role} onChange={(e) => updateReferee(ref.id, 'role', e.target.value)} placeholder="e.g. Workplace Supervisor" />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <label>Organisation</label>
                                <div className="input-wrapper">
                                  <i className="fas fa-building"></i>
                                  <input type="text" value={ref.organisation} onChange={(e) => updateReferee(ref.id, 'organisation', e.target.value)} placeholder="e.g. Kenya Power" />
                                </div>
                              </div>
                              <div className="form-row-2">
                                <div className="form-group">
                                  <label>Email</label>
                                  <div className="input-wrapper">
                                    <i className="fas fa-envelope"></i>
                                    <input type="email" value={ref.email} onChange={(e) => updateReferee(ref.id, 'email', e.target.value)} placeholder="e.g. supervisor@company.co.ke" />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label>Phone</label>
                                  <div className="input-wrapper">
                                    <i className="fas fa-phone"></i>
                                    <input type="tel" value={ref.phone} onChange={(e) => updateReferee(ref.id, 'phone', e.target.value)} placeholder="e.g. +254 711 223 344" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button type="button" className="add-btn" onClick={addReferee}>
                          <i className="fas fa-plus-circle"></i> Add another referee
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="builder-tips">
                    <div className="tip-card">
                      <h3><i className="fas fa-lightbulb"></i> CV tips for TVET roles</h3>
                      <ul>
                        <li><i className="fas fa-check-circle"></i> Keep it to 1–2 pages</li>
                        <li><i className="fas fa-check-circle"></i> Lead with your strongest qualification</li>
                        <li><i className="fas fa-check-circle"></i> Quantify your practical work where possible</li>
                        <li><i className="fas fa-check-circle"></i> Use a clean, readable font</li>
                        <li><i className="fas fa-check-circle"></i> Proofread for spelling and grammar</li>
                      </ul>
                    </div>
                    <div className="tip-card">
                      <h3><i className="fas fa-file-signature"></i> Application letter tips</h3>
                      <ul>
                        <li><i className="fas fa-check-circle"></i> Address a named person where possible</li>
                        <li><i className="fas fa-check-circle"></i> State the role and where you saw it</li>
                        <li><i className="fas fa-check-circle"></i> Connect your skills to the role</li>
                        <li><i className="fas fa-check-circle"></i> Keep it to one page</li>
                        <li><i className="fas fa-check-circle"></i> Close with a clear call to action</li>
                      </ul>
                    </div>
                  </div>
                </>
              )}

              {/* ===== LETTER FORM ===== */}
              {activeDoc === 'letter' && (
                <>
                  <div className="form-card">
                    <div className="form-card-header">
                      <h2><i className="fas fa-envelope-open-text"></i> Application letter details</h2>
                      <span className="header-hint">One page</span>
                    </div>
                    <div className="form-card-body">
                      <div className="form-group">
                        <label>Target role / position <span className="required">*</span></label>
                        <div className="input-wrapper">
                          <i className="fas fa-id-badge"></i>
                          <input type="text" name="targetRole" value={letter.targetRole} onChange={handleLetter} placeholder="e.g. Electrical Installation Technician" />
                        </div>
                      </div>
                      <div className="form-row-2">
                        <div className="form-group">
                          <label>Organisation name <span className="required">*</span></label>
                          <div className="input-wrapper">
                            <i className="fas fa-building"></i>
                            <input type="text" name="company" value={letter.company} onChange={handleLetter} placeholder="e.g. Kenya Power & Lighting Co." />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Hiring manager / recipient (optional)</label>
                          <div className="input-wrapper">
                            <i className="fas fa-user-tie"></i>
                            <input type="text" name="recipient" value={letter.recipient} onChange={handleLetter} placeholder="e.g. Ms. Mary Atieno, HR Manager" />
                          </div>
                        </div>
                      </div>
                      <div className="form-row-2">
                        <div className="form-group">
                          <label>Organisation address (optional)</label>
                          <div className="input-wrapper">
                            <i className="fas fa-map-marker-alt"></i>
                            <input type="text" name="address" value={letter.address} onChange={handleLetter} placeholder="e.g. P.O. Box 30099 – 00100, Nairobi" />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Letter date</label>
                          <div className="input-wrapper">
                            <i className="fas fa-calendar"></i>
                            <input type="date" name="date" value={letter.date} onChange={handleLetter} />
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Opening paragraph</label>
                        <div className="input-wrapper">
                          <i className="fas fa-align-left"></i>
                          <textarea rows="3" name="intro" value={letter.intro} onChange={handleLetter} placeholder="e.g. I am writing to apply for the Electrical Installation Technician apprenticeship advertised on Ujuzi Link..." />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Body paragraph(s)</label>
                        <div className="input-wrapper">
                          <i className="fas fa-align-left"></i>
                          <textarea rows="5" name="body" value={letter.body} onChange={handleLetter} placeholder="Describe your relevant skills, training and experience..." />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Closing paragraph</label>
                        <div className="input-wrapper">
                          <i className="fas fa-align-left"></i>
                          <textarea rows="3" name="closing" value={letter.closing} onChange={handleLetter} placeholder="e.g. I would welcome the opportunity to discuss how I can contribute to your team..." />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="builder-tips" style={{ marginTop: '1.2rem' }}>
                    <div className="tip-card">
                      <h3><i className="fas fa-check-double"></i> Before you send</h3>
                      <ul>
                        <li><i className="fas fa-check-circle"></i> Double-check the organisation name</li>
                        <li><i className="fas fa-check-circle"></i> Tailor your skills to the role description</li>
                        <li><i className="fas fa-check-circle"></i> Proofread for typos and grammar</li>
                        <li><i className="fas fa-check-circle"></i> Attach your CV and certificates</li>
                      </ul>
                    </div>
                    <div className="tip-card">
                      <h3><i className="fas fa-magic"></i> Save time</h3>
                      <ul>
                        <li><i className="fas fa-check-circle"></i> Reuse your CV details from the tab</li>
                        <li><i className="fas fa-check-circle"></i> Adjust only the role and company for each application</li>
                        <li><i className="fas fa-check-circle"></i> Download as PDF before attaching</li>
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* ===== PREVIEW COLUMN ===== */}
            <div className="builder-preview">
              <div className="preview-toolbar">
                <span className="pt-label">
                  <i className="fas fa-eye"></i> Live preview
                </span>
                <div className="pt-actions">
                  <button className="btn btn-outline" onClick={handleDownload}>
                    <i className="fas fa-download"></i> PDF
                  </button>
                  <button className="btn btn-ghost" onClick={() => window.print()}>
                    <i className="fas fa-print"></i> Print                  </button>
                </div>
              </div>

              <div className="preview-sheet">
                {/* CV PREVIEW */}
                {activeDoc === 'cv' && (
                  <div className="doc cv-doc">
                    <div className="cv-header">
                      <div className={`cv-name ${!personal.fullName ? 'placeholder-text' : ''}`}>{displayName}</div>
                      <div className={`cv-role ${!personal.jobTitle ? 'placeholder-text' : ''}`}>{displayRole}</div>
                      <div className="cv-contact">
                        <span className={!personal.email ? 'placeholder-text' : ''}>
                          <i className="fas fa-envelope"></i> {displayEmail}
                        </span>
                        <span className={!personal.phone ? 'placeholder-text' : ''}>
                          <i className="fas fa-phone"></i> {displayPhone}
                        </span>
                        <span className={!personal.location ? 'placeholder-text' : ''}>
                          <i className="fas fa-map-marker-alt"></i> {displayLocation}
                        </span>
                        {personal.portfolio && (
                          <span><i className="fas fa-link"></i> {personal.portfolio}</span>
                        )}
                        {personal.nationality && (
                          <span><i className="fas fa-flag"></i> {personal.nationality}</span>
                        )}
                      </div>
                    </div>

                    {hasSummary && (
                      <div className="cv-section">
                        <div className="cv-section-title"><i className="fas fa-align-left"></i> Professional summary</div>
                        <div className="cv-summary">{summary}</div>
                      </div>
                    )}

                    {hasEducation && (
                      <div className="cv-section">
                        <div className="cv-section-title"><i className="fas fa-graduation-cap"></i> Education</div>
                        {education.map(edu => {
                          const title = [edu.qualification, edu.field].filter(Boolean).join(' in ') || 'Qualification'
                          const date = [edu.startYear, edu.endYear].filter(Boolean).join(' – ')
                          return (
                            <div className="cv-entry" key={edu.id}>
                              <div className="cv-entry-head">
                                <div className="cv-entry-title">{title}</div>
                                {date && <div className="cv-entry-date">{date}</div>}
                              </div>
                              {edu.institution && <div className="cv-entry-sub">{edu.institution}</div>}
                              {edu.grade && <div className="cv-entry-desc">{edu.grade}</div>}
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {hasExperience && (
                      <div className="cv-section">
                        <div className="cv-section-title"><i className="fas fa-briefcase"></i> Experience</div>
                        {experience.map(exp => {
                          const date = [exp.startDate, exp.endDate].filter(Boolean).join(' – ')
                          const lines = (exp.description || '').split('\n').filter(l => l.trim())
                          return (
                            <div className="cv-entry" key={exp.id}>
                              <div className="cv-entry-head">
                                <div className="cv-entry-title">{exp.role || 'Role'}</div>
                                {date && <div className="cv-entry-date">{date}</div>}
                              </div>
                              {exp.organisation && <div className="cv-entry-sub">{exp.organisation}</div>}
                              {lines.length > 0 && (
                                <ul className="cv-entry-bullets">
                                  {lines.map((line, i) => <li key={i}>{line.trim()}</li>)}
                                </ul>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {hasSkills && (
                      <div className="cv-section">
                        <div className="cv-section-title"><i className="fas fa-tools"></i> Skills</div>
                        <div className="cv-skills-grid">
                          {skills.map(s => <span className="cv-skill-tag" key={s}>{s}</span>)}
                        </div>
                      </div>
                    )}

                    {hasReferees && (
                      <div className="cv-section">
                        <div className="cv-section-title"><i className="fas fa-user-tie"></i> Referees</div>
                        {referees.map(r => (
                          <div className="cv-referee" key={r.id}>
                            {r.name && <strong>{r.name}</strong>}
                            {r.role && <> — <span className="ref-role">{r.role}</span></>}
                            {r.organisation && <><br />{r.organisation}</>}
                            {(r.email || r.phone) && (
                              <><br />{[r.email, r.phone].filter(Boolean).join(' · ')}</>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* LETTER PREVIEW */}
                {activeDoc === 'letter' && (
                  <div className="doc letter-doc">
                    {!hasLetterContent ? (
                      <div className="letter-empty">
                        <i className="fas fa-envelope-open-text"></i>
                        <p>Fill in the application letter form to see your letter here.</p>
                      </div>
                    ) : (
                      <>
                        <div className="letter-header">
                          <div className="letter-sender">{displayName}</div>
                          <div className="letter-sender-detail">
                            {displayEmail} · {displayPhone}<br />{displayLocation}
                          </div>
                        </div>
                        <div className="letter-date">{letterDateFormatted}</div>
                        <div className="letter-recipient">
                          {letter.recipient && <>{letter.recipient}<br /></>}
                          {letter.company && <strong>{letter.company}</strong>}
                          {letter.address && <><br />{letter.address}</>}
                        </div>
                        <div className="letter-subject">
                          RE: APPLICATION FOR THE POSITION OF {letter.targetRole ? letter.targetRole.toUpperCase() : 'A WORKPLACE-LEARNING OPPORTUNITY'}
                        </div>
                        <div className="letter-body">
                          {letter.intro && <p>{letter.intro}</p>}
                          {letter.body && <p>{letter.body}</p>}
                          {letter.closing && <p>{letter.closing}</p>}
                        </div>
                        <div className="letter-signoff">
                          Yours faithfully,
                          <div className="letter-sig-name">{displayName}</div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}