// src/components/auth/LoginForm.jsx
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import PasswordToggle from './PasswordToggle.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const METHOD_TABS = [
  { key: 'email', icon: 'fa-envelope', label: 'Email' },
  { key: 'nid', icon: 'fa-id-card', label: 'National ID' },
  { key: 'passport', icon: 'fa-passport', label: 'Passport' },
  { key: 'phone', icon: 'fa-phone', label: 'Phone' }
]

// Demo identities - pick one to sign in as. In production this would be
// resolved from the identifier + password.
const DEMO_IDENTITIES = [
  {
    key: 'trainee',
    label: 'Trainee',
    icon: 'fa-user-graduate',
    name: 'Jane Wanjiku',
    email: 'jane.wanjiku@example.com',
    role: 'trainee',
    dashboard: '/trainees_dashboard'
  },
  {
    key: 'employer',
    label: 'Employer',
    icon: 'fa-building',
    name: 'Wanjiru Kamau',
    email: 'w.kamau@safaricom.co.ke',
    role: 'employer',
    dashboard: '/employer_dashboard'
  },
  {
    key: 'institution',
    label: 'Institution',
    icon: 'fa-university',
    name: 'Alice Wambui',
    email: 'a.wambui@ntti.ac.ke',
    role: 'institution',
    dashboard: '/institution_dashboard'
  },
  {
    key: 'admin',
    label: 'Super admin',
    icon: 'fa-shield-halved',
    name: 'Dr. Margaret Wairimu',
    email: 'admin@ujizilink.go.ke',
    role: 'super-admin',
    dashboard: '/admin'
  }
]

export default function LoginForm({ onSwitchToRegister }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()

  const [method, setMethod] = useState('email')
  const [email, setEmail] = useState('')
  const [nid, setNid] = useState('')
  const [passport, setPassport] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [demoRole, setDemoRole] = useState('trainee')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!password.trim()) {
      setError('Please enter your password.')
      return
    }

    let identifier = ''
    if (method === 'email') {
      if (!email.trim()) {
        setError('Please enter your email address.')
        return
      }
      identifier = email.trim()
    } else if (method === 'nid') {
      if (!nid.trim()) {
        setError('Please enter your national ID number.')
        return
      }
      identifier = nid.trim()
    } else if (method === 'passport') {
      if (!passport.trim()) {
        setError('Please enter your passport number.')
        return
      }
      identifier = passport.trim()
    } else if (method === 'phone') {
      if (!phone.trim()) {
        setError('Please enter your phone number.')
        return
      }
      identifier = phone.trim()
    }

    // Resolve the demo identity from the selected role
    const identity = DEMO_IDENTITIES.find((d) => d.key === demoRole) || DEMO_IDENTITIES[0]

    login({
      id: `demo-${identity.role}`,
      name: identity.name,
      role: identity.role,
      email: method === 'email' ? identifier : identity.email,
      identifier,
      method,
      remember,
      loggedInAt: new Date().toISOString()
    })

    // Honor ?redirect= param; otherwise send the user to their dashboard
    const redirectTo = searchParams.get('redirect') || identity.dashboard
    navigate(redirectTo, { replace: true })
  }

  return (
    <form className="auth-form active" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label>Sign in with</label>
        <div className="login-method-tabs" role="tablist" aria-label="Login method">
          {METHOD_TABS.map((m) => (
            <button
              key={m.key}
              type="button"
              className={`login-method-tab ${method === m.key ? 'active' : ''}`}
              role="tab"
              aria-selected={method === m.key}
              onClick={() => {
                setMethod(m.key)
                setError('')
              }}
            >
              <i className={`fas ${m.icon}`} aria-hidden="true"></i> {m.label}
            </button>
          ))}
        </div>
      </div>

      {method === 'email' && (
        <div className="form-group">
          <label htmlFor="loginEmail">
            Email address <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <i className="fas fa-envelope" aria-hidden="true"></i>
            <input
              type="email"
              id="loginEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
        </div>
      )}

      {method === 'nid' && (
        <div className="form-group">
          <label htmlFor="loginNid">
            National ID number <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <i className="fas fa-id-card" aria-hidden="true"></i>
            <input
              type="text"
              id="loginNid"
              value={nid}
              onChange={(e) => setNid(e.target.value)}
              placeholder="e.g. 12345678"
              autoComplete="off"
            />
          </div>
          <span className="form-hint">
            Enter the ID number registered on your Ujuzi Link account.
          </span>
        </div>
      )}

      {method === 'passport' && (
        <div className="form-group">
          <label htmlFor="loginPassport">
            Passport number <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <i className="fas fa-passport" aria-hidden="true"></i>
            <input
              type="text"
              id="loginPassport"
              value={passport}
              onChange={(e) => setPassport(e.target.value)}
              placeholder="e.g. A1234567"
              autoComplete="off"
            />
          </div>
          <span className="form-hint">
            For non-Kenyan users. Enter the passport number registered on your account.
          </span>
        </div>
      )}

      {method === 'phone' && (
        <div className="form-group">
          <label htmlFor="loginPhone">
            Phone number <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <i className="fas fa-phone" aria-hidden="true"></i>
            <input
              type="tel"
              id="loginPhone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+254 7XX XXX XXX"
              autoComplete="tel"
            />
          </div>
          <span className="form-hint">
            A one-time code will be sent to this number.
          </span>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="loginPassword">
          Password <span className="required">*</span>
        </label>
        <div className="input-wrapper">
          <i className="fas fa-lock" aria-hidden="true"></i>
          <PasswordToggle
            id="loginPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </div>
      </div>

      {/* ===== Demo role selector ===== */}
      <div className="form-group demo-role-group">
        <label>
          Demo - sign in as <span className="required">*</span>
        </label>
        <div className="demo-role-grid" role="radiogroup" aria-label="Demo role">
          {DEMO_IDENTITIES.map((d) => (
            <label
              key={d.key}
              className={`demo-role-card ${demoRole === d.key ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="demoRole"
                value={d.key}
                checked={demoRole === d.key}
                onChange={() => setDemoRole(d.key)}
              />
              <i className={`fas ${d.icon}`} aria-hidden="true"></i>
              <span className="demo-role-label">{d.label}</span>
              <span className="demo-role-name">{d.name}</span>
            </label>
          ))}
        </div>
        <span className="form-hint">
          This is a demo. The selected role determines which dashboard you land on
          after signing in.
        </span>
      </div>

      <div className="form-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Remember me
        </label>
        <Link to="/forgot-password" className="forgot-link">
          Forgot password?
        </Link>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <button type="submit" className="btn btn-primary">
        <i className="fas fa-sign-in-alt" aria-hidden="true"></i> Sign in
      </button>

      <div className="divider">or continue with</div>

      <div className="sso-row">
        <button
          type="button"
          className="sso-btn"
          onClick={() =>
            alert('Google SSO is not enabled in this demo. Please use the form.')
          }
        >
          <i className="fab fa-google" aria-hidden="true"></i> Google
        </button>
        <button
          type="button"
          className="sso-btn"
          onClick={() =>
            alert('Microsoft SSO is not enabled in this demo. Please use the form.')
          }
        >
          <i className="fab fa-microsoft" aria-hidden="true"></i> Microsoft
        </button>
      </div>

      <div className="info-box">
        <i className="fas fa-info-circle" aria-hidden="true"></i>
        <strong>Demo notice:</strong> This is a front-end preview. Authentication is
        simulated; no real credentials are processed or stored.
      </div>

      <p className="auth-footer-note">
        Don't have an account?{' '}
        <button
          type="button"
          className="link-button"
          onClick={onSwitchToRegister}
        >
          Register here
        </button>
      </p>
    </form>
  )
}