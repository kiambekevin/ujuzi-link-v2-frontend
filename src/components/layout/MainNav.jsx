import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

import { useAuth } from '../../context/AuthContext'


// Menu definitions unchanged - only the auth actions block below changes.
const MENUS = [
  {
    key: 'platform',
    label: 'About',
    icon: 'fa-layer-group',
    sections: [
      {
        heading: 'Explore',
        links: [
          { to: '/about', icon: 'fa-circle-info', label: 'About Ujuzi Link' },
          { to: '/opportunities', icon: 'fa-briefcase', label: 'Browse opportunities' },
          { to: '/labour-market', icon: 'fa-chart-line', label: 'Labour market explorer' },
          { to: '/career-guidance', icon: 'fa-compass', label: 'Career guidance' },
          { to: '/terms', icon: 'fa-file-contract', label: 'Terms of service' },
          { to: '/privacy', icon: 'fa-shield-halved', label: 'Privacy policy' },
        ],
      },
      {
        heading: 'Get started',
        links: [
          { to: '/register', icon: 'fa-user-plus', label: 'Create an account' },
          { to: '/login', icon: 'fa-sign-in-alt', label: 'Sign in' },
          { to: '/faq', icon: 'fa-question-circle', label: 'Frequently asked questions' },
        ],
      },
    ],
  },
  {
    key: 'employers',
    label: 'Employers',
    icon: 'fa-building',
    sections: [
      {
        heading: 'For employers',
        links: [
          { to: '/app/org', icon: 'fa-gauge', label: 'Employer dashboard' },
          { to: '/app/org/opportunities/new', icon: 'fa-bullhorn', label: 'Post an opportunity' },
          { to: '/app/org/applications', icon: 'fa-users', label: 'Review applicants' },
          { to: '/app/org/organization', icon: 'fa-pen', label: 'Edit employer profile' },
        ],
      },
      {
        heading: 'Learn more',
        links: [
          { to: '/about', icon: 'fa-handshake', label: 'Why host trainees?' },
          { to: '/faq', icon: 'fa-file-alt', label: 'Employer guidelines' },
          { to: '/terms', icon: 'fa-balance-scale', label: 'Legal & compliance' },
        ],
      },
    ],
  },
  {
    key: 'trainees',
    label: 'Trainees',
    icon: 'fa-user-graduate',
    sections: [
      {
        heading: 'Find a placement',
        links: [
          { to: '/opportunities', icon: 'fa-search', label: 'Search opportunities' },
          { to: '/app/trainee/dashboard', icon: 'fa-gauge', label: 'Trainee dashboard' },
          { to: '/trainees', icon: 'fa-users', label: 'Browse trainee profiles' },
          { to: '/opportunities', icon: 'fa-paper-plane', label: 'Start an application' },
          
        ],
      },
      {
        heading: 'Prepare',
        links: [
          { to: '/cv-builder', icon: 'fa-file-signature', label: 'CV & cover letter builder' },
          { to: '/career-guidance', icon: 'fa-compass', label: 'Career guidance' },
          { to: '/career-assessment', icon: 'fa-clipboard-check', label: 'Career assessment' },
          { to: '/labour-market', icon: 'fa-chart-line', label: 'Labour market explorer' },
          // { to: '/logbook', icon: 'fa-book', label: 'Logbook' },
        ],
      },
    ],
  },
  {
    key: 'institutions',
    label: 'Institutions',
    icon: 'fa-university',
    sections: [
      {
        heading: 'Manage placements',
        links: [
          { to: '/app/org', icon: 'fa-gauge', label: 'Institution dashboard' },
          { to: '/app/org/opportunities/new', icon: 'fa-bullhorn', label: 'Post an opportunity' },
          { to: '/app/org/applications', icon: 'fa-users', label: 'Review trainees' },
          { to: '/app/org/organization', icon: 'fa-pen', label: 'Edit institution profile' },
        ],
      },
      {
        heading: 'Learn more',
        links: [
          { to: 'https://www.tveta.go.ke/tvet-standards/', icon: 'fa-certificate', label: 'TVETA standards' },
          { to: '/faq', icon: 'fa-question-circle', label: 'Institutional guides' },
        ],
      },
    ],
  },
  
]

// Where each role lands when they click "Dashboard" in the account chip.
const ROLE_DASHBOARD = {
  TRAINEE: '/trainees_dashboard',
  ORG_OFFICER: '/employer_dashboard',
  ORG_SUPERVISOR: '/employer_dashboard',
  ADMIN: '/admin',
}

// Menu items per role in the account dropdown. `null` = not shown.
function accountLinksFor(role) {
  const dash = ROLE_DASHBOARD[role] || '/'
  switch (role) {
    case 'TRAINEE':
      return [
        { to: '/app/trainee/dashboard', icon: 'fa-gauge', label: 'Dashboard' },
        { to: '/app/trainee/profile', icon: 'fa-user', label: 'My profile' },
        { to: '/app', icon: 'fa-user', label: 'Administration' },
      ]
    case 'ORG_OFFICER':
      return [
        { to: '/app/org', icon: 'fa-gauge', label: 'Dashboard' },
        { to: '/app/org/opportunities/new', icon: 'fa-bullhorn', label: 'Post opportunity' },
        { to: '/app/org/applications', icon: 'fa-users', label: 'Review applicants' },
      ]
    case 'ORG_SUPERVISOR':
      return [
        { to: '/app/org', icon: 'fa-gauge', label: 'Dashboard' },
        { to: '/app/org/opportunities/new', icon: 'fa-bullhorn', label: 'Post opportunity' },
        { to: '/app/org/applications', icon: 'fa-users', label: 'Review applicants' },
      ]
    case 'ADMIN':
      return [
        { to: '/app/admin', icon: 'fa-shield-halved', label: 'Admin Dashboard' },
        { to: '/opportunities', icon: 'fa-briefcase', label: 'Opportunities' },
      ]
    default:
      return [{ to: '/', icon: 'fa-house', label: 'Home' }]
  }
}

function initialsOf(user) {
  if (!user) return '?'
  const f = (user.first_name || '').trim()
  const l = (user.last_name || '').trim()
  if (f || l) return `${f.charAt(0)}${l.charAt(0)}`.toUpperCase() || '?'
  const email = (user.email || '').trim()
  if (email) return email.charAt(0).toUpperCase()
  const phone = (user.phone || '').trim()
  if (phone) return '#'
  return '?'
}

function displayNameOf(user) {
  if (!user) return ''
  const full =
    [user.first_name, user.last_name].filter(Boolean).join(' ').trim() ||
    user.display_name ||
    user.name ||
    user.email ||
    user.phone ||
    ''
  return full
}

export default function MainNav() {
  const location = useLocation()
  const { user, logout } = useAuth()   // ← adjust to your context's API if different
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)
  const [accountOpen, setAccountOpen] = useState(false)
  const navRef = useRef(null)

  // Close menus when navigating
  useEffect(() => {
    setMobileOpen(false)
    setOpenMenu(null)
    setAccountOpen(false)
  }, [location.pathname])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null)
        setAccountOpen(false)
      }
    }
    if (openMenu || accountOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [openMenu, accountOpen])

  // Close dropdowns on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setOpenMenu(null)
        setAccountOpen(false)
        setMobileOpen(false)
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  const toggleMenu = (key) => {
    setOpenMenu((cur) => (cur === key ? null : key))
    setAccountOpen(false)
  }

  const toggleAccount = () => {
    setAccountOpen((v) => !v)
    setOpenMenu(null)
  }

  const handleLogout = async () => {
    try {
      if (logout) await logout()
    } catch {
      /* ignore */
    }
    setAccountOpen(false)
  }

  const isMenuActive = (menu) =>
    menu.sections.some((s) =>
      s.links.some((l) => {
        if (l.to === '/') return location.pathname === '/'
        return location.pathname === l.to || location.pathname.startsWith(`${l.to}/`)
      })
    )

  const isHome = location.pathname === '/'

  const isLoggedIn = Boolean(user)
  const accountLinks = isLoggedIn ? accountLinksFor(user.role) : []

  return (
    <nav className="main-nav" aria-label="Main navigation" ref={navRef}>
      <div className="container">
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'}`} aria-hidden="true"></i>
        </button>

        <div className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className={`nav-home ${isHome ? 'active' : ''}`}>
            <i className="fas fa-house" aria-hidden="true"></i>
            <span>Home</span>
          </Link>

          {MENUS.map((menu) => {
            const menuActive = isMenuActive(menu)
            const isOpen = openMenu === menu.key
            return (
              <div className="nav-item" key={menu.key}>
                <button
                  type="button"
                  className={`nav-trigger ${isOpen ? 'open' : ''} ${menuActive ? 'active' : ''}`}
                  onClick={() => toggleMenu(menu.key)}
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                >
                  <i className={`fas ${menu.icon} nav-trigger-icon`} aria-hidden="true"></i>
                  <span>{menu.label}</span>
                  <i className="fas fa-chevron-down nav-trigger-caret" aria-hidden="true"></i>
                </button>

                <div
                  className={`simple-dropdown ${isOpen ? 'open' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
                >
                  {menu.sections.map((section, si) => (
                    <div className="dropdown-section" key={section.heading}>
                      {si > 0 && <div className="dropdown-divider" />}
                      <div className="dropdown-heading">{section.heading}</div>
                      {section.links.map((link) => {
                        const linkActive =
                          location.pathname === link.to ||
                          (link.to !== '/' && location.pathname.startsWith(`${link.to}/`))
                        return (
                          <Link
                            to={link.to}
                            key={link.to + link.label}
                            className={`dropdown-link ${linkActive ? 'active' : ''}`}
                          >
                            <i className={`fas ${link.icon}`} aria-hidden="true"></i>
                            <span>{link.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* ===== AUTH ACTIONS ===== */}
        <div className={`nav-actions ${mobileOpen ? 'mobile-open' : ''}`}>
          {isLoggedIn ? (
            <div className="nav-item nav-account">
              <button
                type="button"
                className={`nav-trigger nav-account-trigger ${accountOpen ? 'open' : ''}`}
                onClick={toggleAccount}
                aria-haspopup="true"
                aria-expanded={accountOpen}
                title={displayNameOf(user)}
              >
                <span className="nav-avatar" aria-hidden="true">
                  {initialsOf(user)}
                </span>
                <span className="nav-account-name">
                  {displayNameOf(user) || 'Account'}
                </span>
                <i className="fas fa-chevron-down nav-trigger-caret" aria-hidden="true"></i>
              </button>

              <div className={`simple-dropdown ${accountOpen ? 'open' : ''}`}>
                <div className="dropdown-section">
                  <div className="dropdown-heading">
                    {displayNameOf(user) || 'Signed in'}
                    {user.role && (
                      <span
                        className="nav-account-role"
                        style={{
                          marginLeft: '0.5rem',
                          fontSize: '0.7rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          color: 'var(--text-muted, #6b7280)',
                        }}
                      >
                        {String(user.role).replace('_', ' ').toLowerCase()}
                      </span>
                    )}
                  </div>
                  {accountLinks.map((link) => (
                    <Link
                      to={link.to}
                      key={link.to + link.label}
                      className={`dropdown-link ${
                        location.pathname === link.to ||
                        (link.to !== '/' && location.pathname.startsWith(`${link.to}/`))
                          ? 'active'
                          : ''
                      }`}
                    >
                      <i className={`fas ${link.icon}`} aria-hidden="true"></i>
                      <span>{link.label}</span>
                    </Link>
                  ))}
                  <div className="dropdown-divider" />
                  <button
                    type="button"
                    className="dropdown-link"
                    onClick={handleLogout}
                    style={{
                      background: 'none',
                      border: 'none',
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <i className="fas fa-sign-out-alt" aria-hidden="true"></i>
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-btn nav-btn-login">
                <i className="fas fa-sign-in-alt" aria-hidden="true"></i>
                <span>Log in</span>
              </Link>
              <Link to="/register" className="nav-btn nav-btn-register">
                <i className="fas fa-user-plus" aria-hidden="true"></i>
                <span>Register</span>
                <i className="fas fa-arrow-right nav-btn-arrow" aria-hidden="true"></i>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}