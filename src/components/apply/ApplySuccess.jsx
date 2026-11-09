import { Link } from 'react-router-dom'

export default function ApplySuccess({ opp, applicationRef }) {
  return (
    <div className="apply-success">
      <div className="apply-success-icon">
        <i className="fas fa-check-circle" aria-hidden="true"></i>
      </div>
      <h2>Application submitted!</h2>
      <p>
        Thank you for applying. Your application has been received and will be reviewed by
        your institution and the employer.
      </p>
      <div className="apply-success-details">
        <div className="sd-row">
          <span className="sd-label">Application reference</span>
          <span className="sd-value">{applicationRef}</span>
        </div>
        <div className="sd-row">
          <span className="sd-label">Opportunity</span>
          <span className="sd-value">{opp.title}</span>
        </div>
        <div className="sd-row">
          <span className="sd-label">Employer</span>
          <span className="sd-value">{opp.employer}</span>
        </div>
        <div className="sd-row">
          <span className="sd-label">Status</span>
          <span className="sd-value" style={{ color: 'var(--success)' }}>Pending verification</span>
        </div>
      </div>
      <div className="apply-success-actions">
        <Link to="/app/trainee/dashboard" className="btn btn-primary">
          <i className="fas fa-list" aria-hidden="true"></i> View my applications
        </Link>
        <Link to="/opportunities" className="btn btn-outline">
          <i className="fas fa-home" aria-hidden="true"></i> Back to opportunities
        </Link>
      </div>
    </div>
  )
}