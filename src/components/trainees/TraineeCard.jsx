import { useNavigate } from 'react-router-dom'
import { AVAILABILITY_LABELS } from '../../data/traineesData.js'

const AVAILABILITY_META = {
  available: { cls: 'available', icon: 'fa-check-circle' },
  open: { cls: 'open', icon: 'fa-clock' },
  unavailable: { cls: 'unavailable', icon: 'fa-times-circle' }
}

export default function TraineeCard({ trainee }) {
  const navigate = useNavigate()
  const avail = AVAILABILITY_META[trainee.availability] || AVAILABILITY_META.open

  const visibleSkills = trainee.skills.slice(0, 3)
  const extraSkills = trainee.skills.length - visibleSkills.length

  const openProfile = () => navigate(`/trainees/${trainee.id}`)

  return (
    <article
      className="trainee-card"
      aria-label={`${trainee.firstName} ${trainee.lastName} - ${trainee.course}`}
      onClick={openProfile}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openProfile()
        }
      }}
      style={{ cursor: 'pointer' }}
    >
      <div className="trainee-card-header">
        <div className="trainee-avatar">{trainee.initials}</div>
        <span className="trainee-id-badge">
          <i className="fas fa-shield-alt" aria-hidden="true"></i> Verified
        </span>
        <div className="trainee-headline">
          <h4>{trainee.firstName} {trainee.lastName}</h4>
          <div className="course">{trainee.course}</div>
          <div className="institution">
            <i className="fas fa-university" aria-hidden="true"></i> {trainee.institution}
          </div>
        </div>
      </div>
      <div className="trainee-card-body">
        <div className="trainee-meta-row">
          <span><i className="fas fa-graduation-cap" aria-hidden="true"></i> {trainee.levelLabel}</span>
          <span><i className="fas fa-map-marker-alt" aria-hidden="true"></i> {trainee.county}</span>
          <span><i className="fas fa-briefcase" aria-hidden="true"></i> {trainee.experience} yr{trainee.experience === 1 ? '' : 's'} exp</span>
        </div>
        <div className="trainee-skills">
          {visibleSkills.map((s) => (
            <span className="skill-tag" key={s}>{s}</span>
          ))}
          {extraSkills > 0 && <span className="skill-tag more">+{extraSkills} more</span>}
        </div>
      </div>
      <div className="trainee-card-footer">
        <span className={`availability-badge ${avail.cls}`}>
          <i className={`fas ${avail.icon}`} aria-hidden="true"></i> {AVAILABILITY_LABELS[trainee.availability]}
        </span>
        <button
          className="btn btn-primary"
          onClick={(e) => {
            e.stopPropagation()
            openProfile()
          }}
        >
          View profile
        </button>
      </div>
    </article>
  )
}