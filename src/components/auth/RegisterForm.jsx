// src/components/auth/RegisterForm.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PasswordToggle from './PasswordToggle.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const ROLES = [
  { key: 'trainee', label: 'Trainee', icon: 'fa-user-graduate' },
  { key: 'institution', label: 'Institution', icon: 'fa-university' },
  { key: 'employer', label: 'Employer', icon: 'fa-building' }
]

const TVET_SECTORS = [
  'ICT & Digital',
  'Engineering',
  'Health',
  'Agriculture',
  'Business & Finance',
  'Construction',
  'Manufacturing',
  'Hospitality & Tourism',
  'Transport & Logistics',
  'Energy & Utilities',
  'Creative Arts & Media',
  'Other'
]

const INSTITUTIONS = [
  'Nairobi Technical Training Institute',
  'Kenya Technical Trainers College',
  'Mombasa Technical Training Institute',
  'Kisumu National Polytechnic',
  'Nakuru Technical Training Institute',
  'Rift Valley Technical Training Institute',
  'Eldoret National Polytechnic',
  'Meru National Polytechnic',
  'Kakamega Technical Training Institute',
  'Thika Technical Training Institute',
  'Kenya Institute of Management',
  'Other'
]

const COUNTIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Uasin Gishu', 'Kiambu', 'Machakos',
  'Kakamega', 'Meru', 'Kisii', 'Nyeri', 'Kilifi', 'Bungoma', 'Kitui', 'Kericho',
  'Embu', 'Garissa', 'Lamu', 'Other'
]

const OPPORTUNITY_TYPES = [
  { key: 'attachment', label: 'Industrial attachment' },
  { key: 'internship', label: 'Internship' },
  { key: 'apprenticeship', label: 'Apprenticeship' },
  { key: 'dual', label: 'Dual training' }
]

export default function RegisterForm({ onSwitchToLogin }) {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [role, setRole] = useState('trainee')
  const [terms, setTerms] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!terms) {
      setError('Please agree to the Terms of Service and Privacy Policy.')
      return
    }

    // Demo registration — create a session for the selected role
    const demoProfiles = {
      trainee: { name: 'New Trainee', id: 'demo-trainee' },
      institution: { name: 'New Institution', id: 'demo-institution' },
      employer: { name: 'New Employer', id: 'demo-employer' }
    }
    const profile = demoProfiles[role] || demoProfiles.trainee

    login({
      id: profile.id,
      name: profile.name,
      role,
      email: `new-${role}@demo.ujizilink`,
      registeredAt: new Date().toISOString()
    })

    const dashboard = {
      trainee: '/trainees_dashboard',
      institution: '/institution_dashboard',
      employer: '/employer_dashboard'
    }[role] || '/'

    navigate(dashboard, { replace: true })
  }

  return (
    <form className="auth-form active" onSubmit={handleSubmit} noValidate>
      {/* Role selection */}
      <div className="form-group">
        <label>
          I am registering as <span className="required">*</span>
        </label>
        <div className="role-options" role="radiogroup" aria-label="Account type">
          {ROLES.map((r) => (
            <label
              key={r.key}
              className={`role-option ${role === r.key ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="role"
                value={r.key}
                checked={role === r.key}
                onChange={() => setRole(r.key)}
              />
              <i className={`fas ${r.icon}`} aria-hidden="true"></i>
              <span>{r.label}</span>
            </label>
          ))}
        </div>
      </div>

      {role === 'trainee' && <TraineeFields />}
      {role === 'institution' && <InstitutionFields />}
      {role === 'employer' && <EmployerFields />}

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={terms}
          onChange={(e) => setTerms(e.target.checked)}
        />
        <span>
          I agree to the{' '}
          <Link to="/terms" target="_blank" rel="noreferrer">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" target="_blank" rel="noreferrer">
            Privacy Policy
          </Link>
        </span>
      </label>

      {error && <div className="auth-error">{error}</div>}

      <button type="submit" className="btn btn-primary">
        <i className="fas fa-user-plus" aria-hidden="true"></i> Create account
      </button>

      <div className="info-box">
        <i className="fas fa-info-circle" aria-hidden="true"></i>
        <strong>Demo notice:</strong> This is a front-end preview. No real accounts
        are created — submitting will sign you in with a demo profile for the
        selected role.
      </div>

      <p className="auth-footer-note">
        Already have an account?{' '}
        <button
          type="button"
          className="link-button"
          onClick={onSwitchToLogin}
        >
          Log in here
        </button>
      </p>
    </form>
  )
}

// ==================== TRAINEE ====================

function TraineeFields() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [selectedSectors, setSelectedSectors] = useState([])
  const [selectedOppTypes, setSelectedOppTypes] = useState(['attachment'])

  const toggleSector = (sector) => {
    setSelectedSectors((prev) =>
      prev.includes(sector)
        ? prev.filter((s) => s !== sector)
        : [...prev, sector]
    )
  }

  const toggleOppType = (key) => {
    setSelectedOppTypes((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const passwordsMatch = password === '' || confirm === '' || password === confirm

  return (
    <div className="dynamic-section active">
      <div className="form-row-2">
        <div className="form-group">
          <label htmlFor="trSurname">
            Surname <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <i className="fas fa-user" aria-hidden="true"></i>
            <input
              id="trSurname"
              type="text"
              placeholder="e.g. Wanjiku"
              autoComplete="family-name"
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="trOtherNames">
            Other names <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <i className="fas fa-user" aria-hidden="true"></i>
            <input
              id="trOtherNames"
              type="text"
              placeholder="e.g. Jane Njeri"
              autoComplete="given-name"
              required
            />
          </div>
        </div>
      </div>

      <div className="form-row-2">
        <div className="form-group">
          <label htmlFor="trIdType">
            ID type <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <i className="fas fa-id-card" aria-hidden="true"></i>
            <select id="trIdType" defaultValue="national">
              <option value="national">National ID (Kenyan)</option>
              <option value="passport">Passport (Non-Kenyan)</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="trIdNumber">
            ID / Passport number <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <i className="fas fa-hashtag" aria-hidden="true"></i>
            <input
              id="trIdNumber"
              type="text"
              placeholder="e.g. 12345678 / A1234567"
              required
            />
          </div>
        </div>
      </div>

      <div className="form-row-2">
        <div className="form-group">
          <label htmlFor="trPhone">
            Phone number <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <i className="fas fa-phone" aria-hidden="true"></i>
            <input
              id="trPhone"
              type="tel"
              placeholder="+254 7XX XXX XXX"
              autoComplete="tel"
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="trEmail">
            Email address <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <i className="fas fa-envelope" aria-hidden="true"></i>
            <input
              id="trEmail"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
        </div>
      </div>

      <div className="form-row-2">
        <div className="form-group">
          <label htmlFor="trGender">Gender</label>
          <div className="input-wrapper">
            <i className="fas fa-venus-mars" aria-hidden="true"></i>
            <select id="trGender" defaultValue="">
              <option value="">Select gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
              <option value="prefer-not">Prefer not to say</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="trDob">
            Date of birth <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <i className="fas fa-calendar" aria-hidden="true"></i>
            <input id="trDob" type="date" required />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="trCounty">
          County <span className="required">*</span>
        </label>
        <div className="input-wrapper">
          <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
          <select id="trCounty" defaultValue="">
            <option value="">Select county</option>
            {COUNTIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="trInstitution">
          Institution <span className="required">*</span>
        </label>
        <div className="input-wrapper">
          <i className="fas fa-university" aria-hidden="true"></i>
          <select id="trInstitution" defaultValue="">
            <option value="">Select institution</option>
            {INSTITUTIONS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>
          Occupational sector(s) <span className="required">*</span>
        </label>
        <div className="chip-grid">
          {TVET_SECTORS.map((sector) => (
            <button
              type="button"
              key={sector}
              className={`chip ${selectedSectors.includes(sector) ? 'selected' : ''}`}
              onClick={() => toggleSector(sector)}
            >
              {sector}
            </button>
          ))}
        </div>
        <span className="form-hint">
          Select one or more sectors relevant to your programme.
        </span>
      </div>

      <div className="form-group">
        <label>
          Preferred opportunity type(s) <span className="required">*</span>
        </label>
        <div className="chip-grid">
          {OPPORTUNITY_TYPES.map((o) => (
            <button
              type="button"
              key={o.key}
              className={`chip ${selectedOppTypes.includes(o.key) ? 'selected' : ''}`}
              onClick={() => toggleOppType(o.key)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <PasswordFields
        password={password}
        confirm={confirm}
        onPasswordChange={setPassword}
        onConfirmChange={setConfirm}
        passwordsMatch={passwordsMatch}
      />
    </div>
  )
}

// ==================== INSTITUTION ====================

function InstitutionFields() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const passwordsMatch = password === '' || confirm === '' || password === confirm

  return (
    <div className="dynamic-section active">
      <div className="form-row-2">
        <div className="form-group">
          <label htmlFor="instName">
            Institution name <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <i className="fas fa-university" aria-hidden="true"></i>
            <input
              id="instName"
              type="text"
              placeholder="e.g. Nairobi Technical Training Institute"
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="instAbbr">
            Abbreviation <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <i className="fas fa-font" aria-hidden="true"></i>
            <input
              id="instAbbr"
              type="text"
              placeholder="e.g. NTTI"
              required
            />
          </div>
        </div>
      </div>

      <div className="form-row-2">
        <div className="form-group">
          <label htmlFor="instCode">
            Institution code <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <i className="fas fa-hashtag" aria-hidden="true"></i>
            <input
              id="instCode"
              type="text"
              placeholder="e.g. TVETA/INST/001"
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="instEmail">
            Root email (admin) <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <i className="fas fa-envelope" aria-hidden="true"></i>
            <input
              id="instEmail"
              type="email"
              placeholder="admin@institution.ac.ke"
              required
            />
          </div>
        </div>
      </div>

      <div className="form-row-2">
        <div className="form-group">
          <label htmlFor="instPerson">
            Root contact person <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <i className="fas fa-user-tie" aria-hidden="true"></i>
            <input
              id="instPerson"
              type="text"
              placeholder="e.g. Dr. John Kamau"
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="instPhone">
            Phone number <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <i className="fas fa-phone" aria-hidden="true"></i>
            <input
              id="instPhone"
              type="tel"
              placeholder="+254 20 XXX XXXX"
              required
            />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="instDescription">
          Description of institution <span className="required">*</span>
        </label>
        <div className="input-wrapper">
          <i className="fas fa-align-left" aria-hidden="true"></i>
          <textarea
            id="instDescription"
            rows="3"
            placeholder="Brief description of your institution, its mandate and TVET programmes..."
            required
          />
        </div>
      </div>

      <PasswordFields
        password={password}
        confirm={confirm}
        onPasswordChange={setPassword}
        onConfirmChange={setConfirm}
        passwordsMatch={passwordsMatch}
      />
    </div>
  )
}

// ==================== EMPLOYER ====================

function EmployerFields() {
  const [employerType, setEmployerType] = useState('organization')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const passwordsMatch = password === '' || confirm === '' || password === confirm

  return (
    <div className="dynamic-section active">
      <div className="form-group">
        <label>Registering as</label>
        <div className="radio-pill-group" role="radiogroup" aria-label="Employer type">
          <label className={`radio-pill ${employerType === 'organization' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="employerType"
              value="organization"
              checked={employerType === 'organization'}
              onChange={() => setEmployerType('organization')}
            />
            Organization
          </label>
          <label className={`radio-pill ${employerType === 'individual' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="employerType"
              value="individual"
              checked={employerType === 'individual'}
              onChange={() => setEmployerType('individual')}
            />
            Individual
          </label>
        </div>
      </div>

      {employerType === 'organization' ? (
        <>
          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="orgName">
                Organization name <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <i className="fas fa-building" aria-hidden="true"></i>
                <input
                  id="orgName"
                  type="text"
                  placeholder="e.g. Safaricom PLC"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="orgReg">
                Registration / KRA PIN <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <i className="fas fa-file-invoice" aria-hidden="true"></i>
                <input
                  id="orgReg"
                  type="text"
                  placeholder="e.g. P051234567X"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="orgSector">
                Primary industry <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <i className="fas fa-industry" aria-hidden="true"></i>
                <select id="orgSector" defaultValue="">
                  <option value="">Select sector</option>
                  {TVET_SECTORS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="orgSize">Organization size</label>
              <div className="input-wrapper">
                <i className="fas fa-users" aria-hidden="true"></i>
                <select id="orgSize" defaultValue="">
                  <option value="">Select size</option>
                  <option value="micro">Micro (1–9)</option>
                  <option value="small">Small (10–49)</option>
                  <option value="medium">Medium (50–249)</option>
                  <option value="large">Large (250+)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="orgDescription">
              Description of organization <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <i className="fas fa-align-left" aria-hidden="true"></i>
              <textarea
                id="orgDescription"
                rows="3"
                placeholder="Brief description of what your organization does, and the kind of opportunities you can offer..."
                required
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="orgContactPerson">
                Contact person <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <i className="fas fa-user-tie" aria-hidden="true"></i>
                <input
                  id="orgContactPerson"
                  type="text"
                  placeholder="e.g. Mary Atieno"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="orgContactRole">
                Contact role <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <i className="fas fa-briefcase" aria-hidden="true"></i>
                <input
                  id="orgContactRole"
                  type="text"
                  placeholder="e.g. HR Manager"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="orgEmail">
                Organization email <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <i className="fas fa-envelope" aria-hidden="true"></i>
                <input
                  id="orgEmail"
                  type="email"
                  placeholder="info@organization.co.ke"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="orgPhone">
                Phone number <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <i className="fas fa-phone" aria-hidden="true"></i>
                <input
                  id="orgPhone"
                  type="tel"
                  placeholder="+254 20 XXX XXXX"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="orgCounty">
              Head office county <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
              <select id="orgCounty" defaultValue="">
                <option value="">Select county</option>
                {COUNTIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="indSurname">
                Surname <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <i className="fas fa-user" aria-hidden="true"></i>
                <input
                  id="indSurname"
                  type="text"
                  placeholder="e.g. Otieno"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="indOtherNames">
                Other names <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <i className="fas fa-user" aria-hidden="true"></i>
                <input
                  id="indOtherNames"
                  type="text"
                  placeholder="e.g. Peter Ochieng"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="indIdType">ID type</label>
              <div className="input-wrapper">
                <i className="fas fa-id-card" aria-hidden="true"></i>
                <select id="indIdType" defaultValue="national">
                  <option value="national">National ID</option>
                  <option value="passport">Passport</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="indIdNumber">
                ID / Passport number <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <i className="fas fa-hashtag" aria-hidden="true"></i>
                <input
                  id="indIdNumber"
                  type="text"
                  placeholder="e.g. 12345678"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="indEmail">
                Email address <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <i className="fas fa-envelope" aria-hidden="true"></i>
                <input
                  id="indEmail"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="indPhone">
                Phone number <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <i className="fas fa-phone" aria-hidden="true"></i>
                <input
                  id="indPhone"
                  type="tel"
                  placeholder="+254 7XX XXX XXX"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="indDescription">About you / your practice</label>
            <div className="input-wrapper">
              <i className="fas fa-align-left" aria-hidden="true"></i>
              <textarea
                id="indDescription"
                rows="3"
                placeholder="Brief description of your professional practice and the kind of opportunities you can offer..."
              />
            </div>
          </div>
        </>
      )}

      <PasswordFields
        password={password}
        confirm={confirm}
        onPasswordChange={setPassword}
        onConfirmChange={setConfirm}
        passwordsMatch={passwordsMatch}
      />
    </div>
  )
}

// ==================== SHARED PASSWORD FIELDS ====================

function PasswordFields({
  password,
  confirm,
  onPasswordChange,
  onConfirmChange,
  passwordsMatch
}) {
  return (
    <>
      <div className="form-group">
        <label htmlFor="authPassword">
          Password <span className="required">*</span>
        </label>
        <div className="input-wrapper">
          <i className="fas fa-lock" aria-hidden="true"></i>
          <PasswordToggle
            id="authPassword"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Create a strong password (min. 8 characters)"
            autoComplete="new-password"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="authConfirm">
          Confirm password <span className="required">*</span>
        </label>
        <div className={`input-wrapper ${!passwordsMatch ? 'error' : ''}`}>
          <i className="fas fa-lock" aria-hidden="true"></i>
          <PasswordToggle
            id="authConfirm"
            value={confirm}
            onChange={(e) => onConfirmChange(e.target.value)}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            ariaInvalid={!passwordsMatch}
          />
        </div>
        {!passwordsMatch && (
          <span className="field-error">Passwords do not match.</span>
        )}
      </div>
    </>
  )
}