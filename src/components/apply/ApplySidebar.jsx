import { hoursUntilDeadline } from '../../data/opportunitiesData.js'

export default function ApplySidebar({ opp, typeLabel }) {
  const hrs = hoursUntilDeadline(opp.deadline)
  const days = Math.max(0, Math.ceil(hrs / 24))
  const deadlineDate = new Date(opp.deadline + 'T23:59:59')
  const formattedDeadline = deadlineDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  return (
    <aside className="apply-sidebar">
      <div className="apply-summary-card">
        <div className="apply-summary-header">
          <span className="apply-summary-type">{typeLabel}</span>
          <h3>{opp.title}</h3>
          <div className="apply-summary-employer">
            <i className="fas fa-building" aria-hidden="true"></i> {opp.employer}
          </div>
        </div>
        <div className="apply-summary-body">
          <ul className="apply-summary-facts">
            <li>
              <i className="fas fa-map-marker-alt" aria-hidden="true"></i>{' '}
              <span><strong>Location:</strong> {opp.county}</span>
            </li>
            <li>
              <i className="fas fa-clock" aria-hidden="true"></i>{' '}
              <span><strong>Duration:</strong> {opp.duration} {opp.duration === 1 ? 'month' : 'months'}</span>
            </li>
            <li>
              <i className="fas fa-graduation-cap" aria-hidden="true"></i>{' '}
              <span><strong>Level:</strong> {opp.qualification}</span>
            </li>
            <li>
              <i className="fas fa-money-bill-wave" aria-hidden="true"></i>{' '}
              <span><strong>Stipend:</strong> {opp.stipend ? 'Provided' : 'Not provided'}</span>
            </li>
            <li>
              <i className="fas fa-calendar-check" aria-hidden="true"></i>{' '}
              <span><strong>Start:</strong> January 2026</span>
            </li>
          </ul>
          <div className="apply-summary-deadline">
            <div className="sd-label">Application closes</div>
            <div className="sd-date">{formattedDeadline}</div>
            <div className="sd-days">
              <i className="fas fa-hourglass-half" aria-hidden="true"></i> {days} day{days === 1 ? '' : 's'} left
            </div>
          </div>
        </div>
      </div>

      <div className="apply-help-card">
        <h3>
          <i className="fas fa-headset" aria-hidden="true"></i> Need help?
        </h3>
        <p>Our support team is available to assist you with your application, document uploads, or any questions.</p>
        <button className="btn btn-outline btn-sm" style={{ width: '100%' }}>
          <i className="fas fa-envelope" aria-hidden="true"></i> Contact support
        </button>
      </div>

      <div className="apply-tips-card">
        <h3>
          <i className="fas fa-lightbulb" aria-hidden="true"></i> Application tips
        </h3>
        <ul>
          <li>
            <i className="fas fa-check" aria-hidden="true"></i> Double-check your personal details before submitting.
          </li>
          <li>
            <i className="fas fa-check" aria-hidden="true"></i> Ensure all uploaded documents are clear and legible.
          </li>
          <li>
            <i className="fas fa-check" aria-hidden="true"></i> A valid insurance cover is mandatory before placement begins.
          </li>
          <li>
            <i className="fas fa-check" aria-hidden="true"></i> Your institution will verify your enrolment before the employer reviews.
          </li>
        </ul>
      </div>
    </aside>
  )
}