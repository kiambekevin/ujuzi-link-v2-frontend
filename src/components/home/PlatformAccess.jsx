// src/components/home/PlatformAccess.jsx
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Briefcase,
  DoorOpen,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react'

const ROLES = [
  {
    key: 'trainee',
    label: 'Trainees',
    desc: 'Find placements, track applications and build your digital learning passport.',
    icon: GraduationCap,
    color: 'purple',
    primary: { to: '/trainees_dashboard', label: 'Trainee dashboard' },
    secondary: { to: '/opportunities', label: 'Browse opportunities' }
  },
  {
    key: 'employer',
    label: 'Employers',
    desc: 'Post workplace-learning opportunities and manage placements end to end.',
    icon: Briefcase,
    color: 'success',
    primary: { to: '/employer_dashboard', label: 'Employer dashboard' },
    secondary: { to: '/post_opportunity', label: 'Post an opportunity' }
  },
  {
    key: 'institution',
    label: 'Institutions',
    desc: 'Verify trainees, approve placements and monitor workplace learning.',
    icon: GraduationCap,
    color: 'info',
    primary: { to: '/institution_dashboard', label: 'Institution dashboard' },
    secondary: { to: '/verify_trainee', label: 'Verify trainees' }
  },
  {
    key: 'admin',
    label: 'Administrators',
    desc: 'Manage the platform, verify employers, moderate listings and generate reports.',
    icon: ShieldCheck,
    color: 'warning',
    primary: { to: '/admin', label: 'Admin dashboard' },
    secondary: { to: '/admin/institutions', label: 'Institutions directory' }
  }
]

export default function PlatformAccess() {
  return (
    <section>
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-label">Platform access</div>
            <h2>
              <DoorOpen size={20} strokeWidth={2.5} aria-hidden="true" /> Sign in by role
            </h2>
            <p>
              Ujuzi Link serves trainees, employers, institutions and administrators. Pick
              the workspace that matches your role.
            </p>
          </div>
          <Link to="/login" className="btn btn-outline" style={{ padding: '0.65rem 1.3rem', fontSize: '0.85rem' }}>
            Sign in <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>

        <div className="access-grid">
          {ROLES.map((role) => {
            const Icon = role.icon
            return (
              <div className={`access-card ${role.color}`} key={role.key}>
                <div className={`access-icon ${role.color}`}>
                  <Icon size={22} strokeWidth={2.25} />
                </div>
                <h3>{role.label}</h3>
                <p>{role.desc}</p>
                <div className="access-actions">
                  <Link to={role.primary.to} className="btn btn-primary btn-sm">
                    {role.primary.label} <ArrowRight size={13} strokeWidth={2.5} />
                  </Link>
                  <Link to={role.secondary.to} className="btn btn-ghost btn-sm">
                    {role.secondary.label}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}