// src/pages/PostOpportunityPage.jsx
import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TopBar from '../components/layout/TopBar.jsx'
import BrandRow from '../components/layout/BrandRow.jsx'
import MainNav from '../components/layout/MainNav.jsx'
import Footer from '../components/layout/Footer.jsx'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext.jsx'
import '../styles/home.css'
import '../styles/post-opportunity.css'

// Must match Type4c0Enum in the API exactly.
const OPPORTUNITY_TYPES = [
  { value: 'INDUSTRIAL_ATTACHMENT', label: 'Industrial attachment' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'APPRENTICESHIP', label: 'Apprenticeship' },
  { value: 'PUPILLAGE', label: 'Pupillage' },
  { value: 'COMMUNITY_SERVICE', label: 'Community service learning' },
  { value: 'VOLUNTEER', label: 'Volunteer opportunity' },
  { value: 'INDUSTRY_VISIT', label: 'Industry visit' },
  { value: 'JOB_SHADOWING', label: 'Job shadowing' },
  { value: 'OTHER', label: 'Other approved work-based learning' },
]

// Full CountyEnum from the API - the previous 7-item list would 400 on any
// other county.
const COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu',
  'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho',
  'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale',
  'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera', 'Marsabit',
  'Meru', 'Migori', 'Mombasa', "Murang'a", 'Nairobi', 'Nakuru', 'Nandi',
  'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 'Siaya',
  'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans-Nzoia', 'Turkana',
  'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot',
]

// Must match UserDocumentDocTypeEnum codes.
const DOCUMENT_OPTIONS = [
  { value: 'CV', label: 'Updated CV' },
  { value: 'ACADEMIC_CERTIFICATE', label: 'Academic transcripts / certificates' },
  { value: 'PROFESSIONAL_CERTIFICATE', label: 'Professional certificate' },
  { value: 'NATIONAL_ID', label: 'National ID / Passport' },
  { value: 'CERTIFICATE_OF_GOOD_CONDUCT', label: 'Certificate of good conduct' },
  { value: 'OTHER', label: 'Other' },
]

const COMPENSATION_OPTIONS = [
  { value: 'STIPEND', label: 'Monthly Stipend' },
  { value: 'PAID', label: 'Salaried Role' },
  { value: 'UNPAID', label: 'Unpaid (Educational Only)' },
]

const DURATION_UNITS = [
  { value: 'WEEKS', label: 'Weeks' },
  { value: 'MONTHS', label: 'Months' },
]

// Only these roles may open this page at all. NOTE: the backend currently
// only accepts POST from ORG_OFFICER - see the guard in handleSubmit below.
const ALLOWED_ROLES = ['ORG_OFFICER', 'ORG_SUPERVISOR']

export default function PostOpportunityPage() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  // Org capacity - fetched from /organizations/me/ so we don't lie to the user.
  const [org, setOrg] = useState(null)
  const [orgLoading, setOrgLoading] = useState(true)
  const [orgError, setOrgError] = useState(null)
  const [placesUsed, setPlacesUsed] = useState(0)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'INDUSTRIAL_ATTACHMENT',
    places_total: 1,

    work_mode: 'ONSITE', // ONSITE | REMOTE | HYBRID
    county: 'Nairobi',
    location: '',
    worksite: '',

    duration_value: '',
    duration_unit: 'MONTHS',
    start_date: '',
    closing_date: '',

    qualifications: '',
    eligibility_criteria: '',
    skills_gained: '',
    skill_ids: [],

    compensation: 'STIPEND',
    stipend_amount: '',
    working_hours: '',
    schedule: '',

    application_instructions: '',
    required_documents: ['CV'],
    min_age: '',
    allow_multiple_applications: false,

    // Wizard control: publish (PENDING_REVIEW) vs. save draft.
    submit: true,
  })

  const [skills, setSkills] = useState([])
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState(null)

  // ---- Role gate -------------------------------------------------------
  // Wait for auth bootstrap; then bounce anyone who isn't employer staff.
  useEffect(() => {
    if (loading) return
    if (!user || !ALLOWED_ROLES.includes(user.role)) {
      navigate('/', { replace: true })
    }
  }, [loading, user, navigate])

  // ---- Load the org + remaining capacity + skill catalogue -------------
  useEffect(() => {
    if (!user || !ALLOWED_ROLES.includes(user.role)) return
    let cancelled = false

    async function loadContext() {
      try {
        const [orgRes, skillsRes, mineRes] = await Promise.all([
          api.get('/organizations/me/'),
          api.get('/skills/', { params: { page_size: 200 } }),
          api.get('/opportunities/', { params: { mine: '1', all: '1', page_size: 200 } }),
        ])
        if (cancelled) return
        setOrg(orgRes.data)
        setSkills(skillsRes.data.results ?? skillsRes.data)
        const active = (mineRes.data.results ?? mineRes.data).filter(o =>
          ['DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'PAUSED'].includes(o.status)
        )
        setPlacesUsed(active.reduce((sum, o) => sum + (o.places_total || 0), 0))
        setOrgError(null)
      } catch (err) {
        if (cancelled) return
        setOrgError(
          err?.response?.data?.detail ||
            'Could not load your organisation profile. Please refresh.'
        )
      } finally {
        if (!cancelled) setOrgLoading(false)
      }
    }

    loadContext()
    return () => { cancelled = true }
  }, [user])

  const remainingPlaces = useMemo(() => {
    if (!org) return null
    return Math.max(0, (org.capacity || 0) - placesUsed)
  }, [org, placesUsed])

  // ---- Field handlers --------------------------------------------------
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  const handleDocToggle = (value) => {
    setFormData(prev => ({
      ...prev,
      required_documents: prev.required_documents.includes(value)
        ? prev.required_documents.filter(d => d !== value)
        : [...prev.required_documents, value],
    }))
  }

  const handleSkillToggle = (id) => {
    setFormData(prev => ({
      ...prev,
      skill_ids: prev.skill_ids.includes(id)
        ? prev.skill_ids.filter(s => s !== id)
        : [...prev.skill_ids, id],
    }))
  }

  // ---- Client-side validation (mirrors serializer) ---------------------
  const validate = () => {
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required.'
    if (!formData.description.trim()) newErrors.description = 'Description is required.'

    const placesNum = parseInt(formData.places_total, 10)
    if (!placesNum || placesNum < 1) {
      newErrors.places_total = 'Must be at least 1 place.'
    } else if (remainingPlaces != null && placesNum > remainingPlaces) {
      newErrors.places_total = `Exceeds your approved capacity. Only ${remainingPlaces} place(s) remain.`
    }

    if (formData.work_mode !== 'REMOTE' && !formData.location.trim()) {
      newErrors.location = 'Location is required.'
    }

    const durVal = parseInt(formData.duration_value, 10)
    if (!durVal || durVal < 1) {
      newErrors.duration_value = 'Duration must be a positive number.'
    }

    if (!formData.start_date) newErrors.start_date = 'Start date is required.'
    if (!formData.closing_date) newErrors.closing_date = 'Closing date is required.'
    // Backend rule: closing_date MUST be <= start_date.
    if (formData.start_date && formData.closing_date) {
      if (new Date(formData.closing_date) > new Date(formData.start_date)) {
        newErrors.closing_date = 'Closing date must be on or before the start date.'
      }
    }

    if (formData.compensation === 'STIPEND') {
      const n = Number(formData.stipend_amount)
      if (!formData.stipend_amount || Number.isNaN(n) || n <= 0) {
        newErrors.stipend_amount = 'Enter the stipend amount as a number (KES).'
      }
    }

    if (!formData.skills_gained.trim()) {
      newErrors.skills_gained = 'Please describe the skills the participant will gain.'
    }
    if (!formData.working_hours.trim()) {
      newErrors.working_hours = 'Working hours are required.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ---- Submit ----------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError(null)

    // Guard: backend currently only permits ORG_OFFICER to POST /opportunities/.
    // If you're an ORG_SUPERVISOR, the request will 403 until the backend view
    // is updated to accept supervisors too.
    if (user?.role !== 'ORG_OFFICER') {
      setServerError(
        'Only recruitment officers can publish opportunities. Ask your organisation administrator to grant you the ORG_OFFICER role.'
      )
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      type: formData.type,
      work_mode: formData.work_mode,
      compensation: formData.compensation,
      stipend_amount:
        formData.compensation === 'STIPEND'
          ? Number(formData.stipend_amount)
          : null,
      county: formData.work_mode === 'REMOTE' ? '' : formData.county,
      location: formData.work_mode === 'REMOTE' ? '' : formData.location.trim(),
      worksite: formData.work_mode === 'REMOTE' ? '' : formData.worksite.trim(),
      places_total: parseInt(formData.places_total, 10),
      start_date: formData.start_date,
      closing_date: formData.closing_date,
      duration_value: parseInt(formData.duration_value, 10),
      duration_unit: formData.duration_unit,
      working_hours: formData.working_hours.trim(),
      schedule: formData.schedule.trim(),
      skills_gained: formData.skills_gained.trim(),
      qualifications: formData.qualifications.trim(),
      eligibility_criteria: formData.eligibility_criteria.trim(),
      application_instructions: formData.application_instructions.trim(),
      required_documents: formData.required_documents,
      skill_ids: formData.skill_ids,
      min_age: formData.min_age === '' ? null : parseInt(formData.min_age, 10),
      allow_multiple_applications: formData.allow_multiple_applications,
      submit: formData.submit,
    }

    setIsSubmitting(true)
    try {
      await api.post('/opportunities/', payload)
      alert(
        payload.submit
          ? 'Opportunity submitted for administrator review.'
          : 'Draft saved.'
      )
      navigate('/employer_dashboard')
    } catch (err) {
      const data = err?.response?.data
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        // Surface DRF field errors inline where possible.
        const fieldErrors = {}
        let general = null
        for (const [key, val] of Object.entries(data)) {
          const msg = Array.isArray(val) ? val.join(' ') : String(val)
          if (key in formData) fieldErrors[key] = msg
          else general = general ? `${general} ${msg}` : msg
        }
        setErrors(prev => ({ ...prev, ...fieldErrors }))
        if (general) setServerError(general)
      } else {
        setServerError('Could not publish the opportunity. Please try again.')
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // ---- Render guards ---------------------------------------------------
  if (loading || (user && !ALLOWED_ROLES.includes(user.role))) {
    return (
      <>
        <TopBar />
        <BrandRow />
        <MainNav />
        <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: 28 }} />
          <p>Checking your access…</p>
        </div>
        <Footer />
      </>
    )
  }

  const orgReady = org && org.status === 'ACTIVE'

  return (
    <>
      <TopBar />
      <BrandRow />
      <MainNav />

      <header className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/employer_dashboard">Employer Dashboard</Link>
            <i className="fas fa-chevron-right"></i>
            <span>Post Opportunity</span>
          </div>
          <h1>Advertise a Workplace-Learning Opportunity</h1>
          <p>
            Reach thousands of TVET trainees looking for industrial attachments,
            internships, and apprenticeships.
          </p>
        </div>
      </header>

      <div className="page-body">
        <div className="container">

          {/* Org status / capacity banners */}
          {orgError && (
            <div className="info-box warning" style={{ marginBottom: 20 }}>
              <i className="fas fa-triangle-exclamation"></i>
              <div>{orgError}</div>
            </div>
          )}

          {orgLoading && (
            <div className="info-box" style={{ marginBottom: 20 }}>
              <i className="fas fa-spinner fa-spin"></i>
              <div>Loading your organisation profile…</div>
            </div>
          )}

          {!orgLoading && org && !orgReady && (
            <div className="info-box warning" style={{ marginBottom: 20 }}>
              <i className="fas fa-lock"></i>
              <div>
                <strong>Organisation not approved.</strong> Your organisation
                status is <code>{org.status}</code>. You can draft adverts, but
                publishing requires administrator approval.
              </div>
            </div>
          )}

          {!orgLoading && org && orgReady && remainingPlaces != null && (
            <div className="info-box" style={{ marginBottom: 20 }}>
              <i className="fas fa-circle-info"></i>
              <div>
                Approved capacity: <strong>{org.capacity}</strong> places.
                Already advertised: <strong>{placesUsed}</strong>.
                Remaining: <strong>{remainingPlaces}</strong>.
              </div>
            </div>
          )}

          {serverError && (
            <div className="info-box warning" style={{ marginBottom: 20 }}>
              <i className="fas fa-circle-exclamation"></i>
              <div>{serverError}</div>
            </div>
          )}

          <div className="layout-grid">
            {/* ===== MAIN FORM AREA ===== */}
            <form className="form-area" onSubmit={handleSubmit}>

              {/* 1. Basic Information */}
              <div className="form-card">
                <div className="form-card-header">
                  <h2><i className="fas fa-briefcase"></i> Basic Information</h2>
                </div>
                <div className="form-card-body">
                  <div className="form-group">
                    <label>Opportunity Title <span className="required">*</span></label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Software Development Intern"
                      className={errors.title ? 'error-input' : ''}
                    />
                    {errors.title && <span className="field-error">{errors.title}</span>}
                  </div>

                  <div className="form-group">
                    <label>Description <span className="required">*</span></label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Describe the role, the team they will join, and what they will be doing."
                      className={errors.description ? 'error-input' : ''}
                    ></textarea>
                    {errors.description && <span className="field-error">{errors.description}</span>}
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Opportunity Type <span className="required">*</span></label>
                      <select name="type" value={formData.type} onChange={handleInputChange}>
                        {OPPORTUNITY_TYPES.map(t => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Number of Places <span className="required">*</span></label>
                      <input
                        type="number"
                        name="places_total"
                        min="1"
                        max={remainingPlaces ?? undefined}
                        value={formData.places_total}
                        onChange={handleInputChange}
                        className={errors.places_total ? 'error-input' : ''}
                      />
                      {errors.places_total ? (
                        <span className="field-error">{errors.places_total}</span>
                      ) : remainingPlaces != null ? (
                        <span className="field-hint">
                          {remainingPlaces} unallocated place(s) remaining.
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Location & Worksite - work_mode is a single enum */}
              <div className="form-card">
                <div className="form-card-header">
                  <h2><i className="fas fa-map-marker-alt"></i> Location & Worksite</h2>
                </div>
                <div className="form-card-body">
                  <div className="form-group">
                    <label>Work Mode <span className="required">*</span></label>
                    <div className="radio-pill-group">
                      {['ONSITE', 'HYBRID', 'REMOTE'].map(mode => (
                        <label
                          key={mode}
                          className={`radio-pill ${formData.work_mode === mode ? 'selected' : ''}`}
                        >
                          <input
                            type="radio"
                            name="work_mode"
                            value={mode}
                            checked={formData.work_mode === mode}
                            onChange={handleInputChange}
                          />
                          {mode === 'ONSITE' ? 'On-site' : mode === 'REMOTE' ? 'Fully Remote' : 'Hybrid'}
                        </label>
                      ))}
                    </div>
                  </div>

                  {formData.work_mode !== 'REMOTE' && (
                    <>
                      <div className="form-row-2 mt-3">
                        <div className="form-group">
                          <label>County <span className="required">*</span></label>
                          <select name="county" value={formData.county} onChange={handleInputChange}>
                            {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Town / Location <span className="required">*</span></label>
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="e.g. Upper Hill, Nairobi"
                            className={errors.location ? 'error-input' : ''}
                          />
                          {errors.location && <span className="field-error">{errors.location}</span>}
                        </div>
                      </div>

                      <div className="form-group mt-3">
                        <label>Specific Worksite (Optional)</label>
                        <input
                          type="text"
                          name="worksite"
                          value={formData.worksite}
                          onChange={handleInputChange}
                          placeholder="e.g. Safaricom HQ, Waiyaki Way"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 3. Duration & Schedule - split into value + unit */}
              <div className="form-card">
                <div className="form-card-header">
                  <h2><i className="fas fa-calendar-alt"></i> Duration & Schedule</h2>
                </div>
                <div className="form-card-body">
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Duration <span className="required">*</span></label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          type="number"
                          name="duration_value"
                          min="1"
                          value={formData.duration_value}
                          onChange={handleInputChange}
                          placeholder="e.g. 3"
                          className={errors.duration_value ? 'error-input' : ''}
                          style={{ flex: 1 }}
                        />
                        <select
                          name="duration_unit"
                          value={formData.duration_unit}
                          onChange={handleInputChange}
                          style={{ width: 120 }}
                        >
                          {DURATION_UNITS.map(u => (
                            <option key={u.value} value={u.value}>{u.label}</option>
                          ))}
                        </select>
                      </div>
                      {errors.duration_value && <span className="field-error">{errors.duration_value}</span>}
                    </div>
                    <div className="form-group">
                      <label>Working Hours <span className="required">*</span></label>
                      <input
                        type="text"
                        name="working_hours"
                        value={formData.working_hours}
                        onChange={handleInputChange}
                        placeholder="e.g. Monday–Friday, 8:00am – 5:00pm"
                        className={errors.working_hours ? 'error-input' : ''}
                      />
                      {errors.working_hours && <span className="field-error">{errors.working_hours}</span>}
                    </div>
                  </div>

                  <div className="form-row-2 mt-3">
                    <div className="form-group">
                      <label>Start Date <span className="required">*</span></label>
                      <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleInputChange}
                        className={errors.start_date ? 'error-input' : ''}
                      />
                      {errors.start_date && <span className="field-error">{errors.start_date}</span>}
                    </div>
                    <div className="form-group">
                      <label>Application Closing Date <span className="required">*</span></label>
                      <input
                        type="date"
                        name="closing_date"
                        value={formData.closing_date}
                        onChange={handleInputChange}
                        className={errors.closing_date ? 'error-input' : ''}
                      />
                      {errors.closing_date && <span className="field-error">{errors.closing_date}</span>}
                      <span className="field-hint">
                        Must be on or before the start date. Listing auto-closes
                        at midnight on this date.
                      </span>
                    </div>
                  </div>

                  <div className="form-group mt-3">
                    <label>Expected Schedule Details (Optional)</label>
                    <input
                      type="text"
                      name="schedule"
                      value={formData.schedule}
                      onChange={handleInputChange}
                      placeholder="e.g. Rotating shifts, or specific days required in office"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Compensation - uppercase enum + numeric stipend */}
              <div className="form-card">
                <div className="form-card-header">
                  <h2><i className="fas fa-money-bill-wave"></i> Compensation</h2>
                </div>
                <div className="form-card-body">
                  <div className="form-group">
                    <label>Payment Structure <span className="required">*</span></label>
                    <div className="radio-pill-group">
                      {COMPENSATION_OPTIONS.map(opt => (
                        <label
                          key={opt.value}
                          className={`radio-pill ${formData.compensation === opt.value ? 'selected' : ''}`}
                        >
                          <input
                            type="radio"
                            name="compensation"
                            value={opt.value}
                            checked={formData.compensation === opt.value}
                            onChange={handleInputChange}
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {formData.compensation === 'STIPEND' && (
                    <div className="form-group mt-3">
                      <label>Monthly Stipend (KES) <span className="required">*</span></label>
                      <input
                        type="number"
                        name="stipend_amount"
                        min="0"
                        step="0.01"
                        value={formData.stipend_amount}
                        onChange={handleInputChange}
                        placeholder="e.g. 15000"
                        className={errors.stipend_amount ? 'error-input' : ''}
                      />
                      {errors.stipend_amount && <span className="field-error">{errors.stipend_amount}</span>}
                    </div>
                  )}

                  {formData.compensation === 'UNPAID' && (
                    <div className="info-box mt-3 warning">
                      <i className="fas fa-triangle-exclamation"></i>
                      <div>
                        <strong>Unpaid placements:</strong> The platform flags
                        unpaid listings with high hours (e.g. over 40 hrs/week)
                        for admin review to ensure compliance with safeguarding
                        standards.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 5. Requirements & Skills - backend uses `qualifications` and `skill_ids` */}
              <div className="form-card">
                <div className="form-card-header">
                  <h2><i className="fas fa-graduation-cap"></i> Requirements & Skills</h2>
                </div>
                <div className="form-card-body">
                  <div className="form-group">
                    <label>Required Qualifications</label>
                    <textarea
                      name="qualifications"
                      value={formData.qualifications}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="e.g. Diploma in Software Development, TVET Level 5 or 6"
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label>Eligibility Requirements</label>
                    <input
                      type="text"
                      name="eligibility_criteria"
                      value={formData.eligibility_criteria}
                      onChange={handleInputChange}
                      placeholder="e.g. Must be a Kenyan citizen under 25, or must be registered with a TVETA institution"
                    />
                  </div>

                  <div className="form-group">
                    <label>Skills the participant will gain <span className="required">*</span></label>
                    <textarea
                      name="skills_gained"
                      value={formData.skills_gained}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="e.g. Agile delivery, API development, unit testing, workplace communication"
                      className={errors.skills_gained ? 'error-input' : ''}
                    ></textarea>
                    {errors.skills_gained && <span className="field-error">{errors.skills_gained}</span>}
                  </div>

                  {skills.length > 0 && (
                    <div className="form-group">
                      <label>Preferred / Required Skills (Optional)</label>
                      <div className="chip-grid">
                        {skills.map(skill => (
                          <button
                            key={skill.id}
                            type="button"
                            className={`chip ${formData.skill_ids.includes(skill.id) ? 'selected' : ''}`}
                            onClick={() => handleSkillToggle(skill.id)}
                          >
                            {skill.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 6. Application Process - codes, not labels */}
              <div className="form-card">
                <div className="form-card-header">
                  <h2><i className="fas fa-file-signature"></i> Application Process</h2>
                </div>
                <div className="form-card-body">
                  <div className="form-group">
                    <label>Required Documents <span className="required">*</span></label>
                    <div className="chip-grid">
                      {DOCUMENT_OPTIONS.map(doc => (
                        <button
                          key={doc.value}
                          type="button"
                          className={`chip ${formData.required_documents.includes(doc.value) ? 'selected' : ''}`}
                          onClick={() => handleDocToggle(doc.value)}
                        >
                          {doc.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group mt-3">
                    <label>Application Instructions</label>
                    <textarea
                      name="application_instructions"
                      value={formData.application_instructions}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="e.g. Apply through the platform. Ensure your profile is complete."
                    ></textarea>
                  </div>

                  <div className="form-row-2 mt-3">
                    <div className="form-group">
                      <label>Minimum Age (Optional)</label>
                      <input
                        type="number"
                        name="min_age"
                        min="0"
                        max="32767"
                        value={formData.min_age}
                        onChange={handleInputChange}
                        placeholder="e.g. 18"
                      />
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', paddingTop: 28 }}>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="allow_multiple_applications"
                          checked={formData.allow_multiple_applications}
                          onChange={handleInputChange}
                        />
                        <span>Allow multiple applications per trainee</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Submit Bar */}
              <div className="sticky-submit-bar">
                <div className="ssb-info">
                  <i className="fas fa-shield-halved"></i>
                  <span>Listings are subject to terms and conditions and privacy policy.</span>
                </div>
                <div className="ssb-actions">
                  <button
                    type="button"
                    className="btn btn-outline"
                    disabled={isSubmitting || !orgReady}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, submit: false }))
                      // Use setTimeout so state updates before handleSubmit reads it
                      setTimeout(() => handleSubmit({ preventDefault: () => {} }), 0)
                    }}
                  >
                    Save Draft
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || !orgReady}
                    onClick={() => setFormData(prev => ({ ...prev, submit: true }))}
                  >
                    {isSubmitting ? 'Publishing…' : <><i className="fas fa-check"></i> Publish Opportunity</>}
                  </button>
                </div>
              </div>

            </form>

            {/* ===== SIDEBAR GUIDELINES ===== */}
            <aside className="sidebar">
              <div className="tips-card">
                <h3><i className="fas fa-lightbulb"></i> Tips for a great listing</h3>
                <ul>
                  <li>
                    <i className="fas fa-check"></i>
                    <div><strong>Be specific about skills.</strong> Trainees want to know exactly what they will learn.</div>
                  </li>
                  <li>
                    <i className="fas fa-check"></i>
                    <div><strong>Specify the supervisor.</strong> Indicate if a dedicated mentor will be assigned.</div>
                  </li>
                  <li>
                    <i className="fas fa-check"></i>
                    <div><strong>Be transparent about stipends.</strong> Clear compensation builds trust and attracts better candidates.</div>
                  </li>
                </ul>
              </div>

              <div className="dash-card policy-card">
                <div className="dash-card-header">
                  <h2><i className="fas fa-scale-balanced"></i> Platform Policies</h2>
                </div>
                <div className="dash-card-body">
                  <p>As an approved employer, you must:</p>
                  <ul>
                    <li>Provide a safe working environment.</li>
                    <li>Comply with all labour and safeguarding laws.</li>
                    <li>Never charge trainees any fees.</li>
                  </ul>
                  <Link to="/terms" className="btn btn-outline btn-sm w-full mt-3">
                    Read full Employer Terms
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}