import { useNavigate } from 'react-router-dom'
import {
  TYPE_SHORT,
  hoursUntilDeadline,
  isUrgent,
  getInstitutionInitials,
  hexToRgba
} from '../../data/opportunitiesData.js'

export default function OpportunityCard({ opp, view }) {
  const navigate = useNavigate()

  const urgent = isUrgent(opp)
  const hrsLeft = hoursUntilDeadline(opp.deadline)
  const roundedHrs = Math.max(1, Math.round(hrsLeft))

  const deadlineDate = new Date(opp.deadline + 'T23:59:59')
  const formattedDeadline = deadlineDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  const initials = getInstitutionInitials(opp.institutionAbbr, opp.institution)
  const logoBg = hexToRgba(opp.institutionColor || '#4B0082', 0.12)
  const logoColor = opp.institutionColor || '#4B0082'

  const deadlineText = urgent
    ? `Closes in ${roundedHrs}h`
    : `Closes ${formattedDeadline}`
  const deadlineClass = urgent
    ? 'opportunity-deadline urgent-deadline'
    : 'opportunity-deadline'
  const deadlineIcon = urgent ? 'fa-exclamation-circle' : 'fa-hourglass-half'

  const typeLabel = TYPE_SHORT[opp.type] || opp.type

  const openDetails = () => navigate(`/opportunities/${opp.id}`)

  const handleApply = (e) => {
    e.stopPropagation()
    navigate(`/opportunities/${opp.id}`)
  }

  return (
    <article
      className={`opportunity-card ${urgent ? 'urgent' : ''}`}
      aria-label={`${opp.title} at ${opp.employer}`}
      onClick={openDetails}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openDetails()
        }
      }}
      style={{ cursor: 'pointer' }}
    >
      {urgent && (
        <div className="urgent-ribbon">
          <i className="fas fa-exclamation-triangle" aria-hidden="true"></i>
          Closing soon - {roundedHrs} hour{roundedHrs === 1 ? '' : 's'} left
        </div>
      )}

      <div className="opportunity-header">
        <div
          className="opportunity-logo"
          style={{ background: logoBg, color: logoColor }}
        >
          <span className="logo-initials">{initials}</span>
          <span className="inst-verified-badge" title="Verified institution">
            <i className="fas fa-check" aria-hidden="true"></i>
          </span>
        </div>
        <span className={`opportunity-type ${opp.type}`}>{typeLabel}</span>
      </div>

      <div className="opportunity-body">
        <h4>{opp.title}</h4>

        <div className="opportunity-employer">
          <i className="fas fa-building" aria-hidden="true"></i> {opp.employer}
        </div>

        <div className="opportunity-institution" title={opp.institution}>
          <i className="fas fa-university" aria-hidden="true"></i>
          <span>{opp.institution}</span>
        </div>

        <div className="opportunity-tags">
          {opp.tags.map((t) => (
            <span className="opp-tag" key={t}>
              {t}
            </span>
          ))}
        </div>

        <div className="opportunity-meta">
          <span>
            <i className="fas fa-map-marker-alt" aria-hidden="true"></i> {opp.county}
          </span>
          <span>
            <i className="fas fa-clock" aria-hidden="true"></i> {opp.duration}{' '}
            {opp.duration === 1 ? 'month' : 'months'}
          </span>
          <span>
            <i className="fas fa-graduation-cap" aria-hidden="true"></i> {opp.qualification}
          </span>
        </div>
      </div>

      <div className="opportunity-footer">
        <span className={deadlineClass}>
          <i className={`fas ${deadlineIcon}`} aria-hidden="true"></i> {deadlineText}
        </span>
        <button className="btn btn-primary" onClick={handleApply}>
          Apply
        </button>
      </div>
    </article>
  )
}