function Field({ id, label, icon, required, children, hint }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>
        {label} {required && <span className="required">*</span>}
      </label>
      <div className="input-wrapper">
        <i className={`fas ${icon}`} aria-hidden="true"></i>
        {children}
      </div>
      {hint && <span className="form-hint">{hint}</span>}
    </div>
  )
}

// Real backend choices — must stay in sync with:
//   - apps/core/constants.COUNTY_CHOICES
//   - apps/core/constants.GENDERS
const COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu',
  'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho',
  'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui',
  'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
  'Marsabit', 'Meru', 'Migori', 'Mombasa', "Murang'a", 'Nairobi',
  'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
  'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi',
  'Trans-Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot',
]

const GENDERS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
  { value: 'Prefer not to say', label: 'Prefer not to say' },
]

function calculateAge(isoDate) {
  if (!isoDate) return null
  const dob = new Date(isoDate)
  if (Number.isNaN(dob.getTime())) return null
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age -= 1
  return age
}

export default function StepPersonal({ data, updateField, onNext }) {
  const age = calculateAge(data.dob)
  const isUnder18 = age !== null && age < 18

  const validate = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'gender', 'dob', 'county']
    const missing = required.filter((k) => !String(data[k] || '').trim())
    if (missing.length) {
      alert('Please complete all required fields before proceeding.')
      return false
    }

    // Under-18 guardianship (TORS 115) — enforced by the backend too.
    if (isUnder18) {
      if (!data.guardianConsent) {
        alert('Participants under 18 require guardian consent.')
        return false
      }
      if (!String(data.guardianFullName || '').trim()) {
        alert("Please provide the guardian's full name.")
        return false
      }
    }

    // Ensure at least one identity number is provided.
    if (!String(data.idNumber || '').trim() && !String(data.passportNumber || '').trim()) {
      alert('Please provide either a national ID number or a passport number.')
      return false
    }
    return true
  }

  return (
    <>
      <h2 className="form-step-title">
        <i className="fas fa-user" aria-hidden="true"></i> Personal details
      </h2>
      <p className="form-step-sub">
        Tell us about yourself. Fields marked with <span className="required">*</span> are required.
      </p>

      <div className="form-row-2">
        <Field id="firstName" label="First name" icon="fa-user" required>
          <input
            id="firstName"
            value={data.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            placeholder="e.g. Jane"
            autoComplete="given-name"
          />
        </Field>
        <Field id="middleName" label="Middle name (optional)" icon="fa-user">
          <input
            id="middleName"
            value={data.middleName}
            onChange={(e) => updateField('middleName', e.target.value)}
            placeholder="e.g. Njeri"
            autoComplete="additional-name"
          />
        </Field>
      </div>

      <Field id="lastName" label="Surname" icon="fa-user" required>
        <input
          id="lastName"
          value={data.lastName}
          onChange={(e) => updateField('lastName', e.target.value)}
          placeholder="e.g. Wanjiku"
          autoComplete="family-name"
        />
      </Field>

      <div className="form-row-2">
        <Field
          id="email"
          label="Email address"
          icon="fa-envelope"
          required
          hint="Changing your email requires OTP verification from the account settings page."
        >
          <input
            id="email"
            type="email"
            value={data.email}
            readOnly
            disabled
            autoComplete="email"
          />
        </Field>
        <Field
          id="phone"
          label="Primary phone number"
          icon="fa-phone"
          required
          hint="Changing your phone requires OTP verification from the account settings page."
        >
          <input
            id="phone"
            type="tel"
            value={data.phone}
            readOnly
            disabled
            autoComplete="tel"
          />
        </Field>
      </div>

      <div className="form-row-2">
        <Field id="gender" label="Gender" icon="fa-venus-mars" required>
          <select
            id="gender"
            value={data.gender}
            onChange={(e) => updateField('gender', e.target.value)}
          >
            <option value="">Select gender</option>
            {GENDERS.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </Field>
        <Field id="dob" label="Date of birth" icon="fa-calendar" required>
          <input
            id="dob"
            type="date"
            value={data.dob || ''}
            onChange={(e) => updateField('dob', e.target.value)}
          />
        </Field>
      </div>

      <div className="form-row-2">
        <Field id="nationality" label="Nationality" icon="fa-flag">
          <input
            id="nationality"
            value={data.nationality || ''}
            onChange={(e) => updateField('nationality', e.target.value)}
            placeholder="e.g. Kenyan"
          />
        </Field>
        <Field id="county" label="County" icon="fa-map-marker-alt" required>
          <select
            id="county"
            value={data.county}
            onChange={(e) => updateField('county', e.target.value)}
          >
            <option value="">Select county</option>
            {COUNTIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field id="city" label="Town / city (optional)" icon="fa-city">
        <input
          id="city"
          value={data.city || ''}
          onChange={(e) => updateField('city', e.target.value)}
          placeholder="e.g. Nairobi CBD"
        />
      </Field>

      {/* ─── NEW: bio ────────────────────────────────────────────── */}
      <Field
        id="bio"
        label="Short bio (optional)"
        icon="fa-align-left"
        hint="A couple of sentences about yourself — this is shown to employers alongside your application."
      >
        <textarea
          id="bio"
          rows="4"
          value={data.bio || ''}
          onChange={(e) => updateField('bio', e.target.value)}
          placeholder="e.g. Final-year electrical installation student passionate about renewable energy and hands-on field work."
          maxLength={1000}
        />
      </Field>
      {/* ─── END bio ─────────────────────────────────────────────── */}

      <div className="form-section">
        <div className="form-section-title">
          <i className="fas fa-id-card" aria-hidden="true"></i> Identification
        </div>
        <p className="form-step-sub" style={{ marginTop: 0 }}>
          Provide at least one — a national ID for Kenyan citizens, or a passport for non-citizens.
        </p>

        <div className="form-row-2">
          <Field id="idNumber" label="National ID number" icon="fa-hashtag">
            <input
              id="idNumber"
              value={data.idNumber || ''}
              onChange={(e) => updateField('idNumber', e.target.value)}
              placeholder="e.g. 12345678"
            />
          </Field>
          <Field id="passportNumber" label="Passport number" icon="fa-passport">
            <input
              id="passportNumber"
              value={data.passportNumber || ''}
              onChange={(e) => updateField('passportNumber', e.target.value)}
              placeholder="e.g. AK0123456"
            />
          </Field>
        </div>
      </div>

      {isUnder18 && (
        <div className="form-section">
          <div className="form-section-title">
            <i className="fas fa-user-shield" aria-hidden="true"></i> Guardian consent (required under 18)
          </div>
          <p className="form-step-sub" style={{ marginTop: 0 }}>
            Because you are under 18, we need your parent or guardian's details.
          </p>

          <Field id="guardianFullName" label="Guardian full name" icon="fa-user" required>
            <input
              id="guardianFullName"
              value={data.guardianFullName || ''}
              onChange={(e) => updateField('guardianFullName', e.target.value)}
              placeholder="e.g. Mary Wanjiku"
            />
          </Field>

          <label className="checkbox-label" style={{ marginTop: '0.7rem' }}>
            <input
              type="checkbox"
              checked={Boolean(data.guardianConsent)}
              onChange={(e) => updateField('guardianConsent', e.target.checked)}
            />
            <span>
              My parent or guardian consents to my participation in this programme.
              <span className="required"> *</span>
            </span>
          </label>
        </div>
      )}

      <div className="form-nav">
        <span />
        <div className="form-nav-right">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => validate() && onNext()}
          >
            Next: Education <i className="fas fa-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </>
  )
}