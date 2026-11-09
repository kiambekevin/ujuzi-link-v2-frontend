// Recognised document types — mirrors StepDocuments.DOC_META.
// Only used for human-readable labels in the review.
const DOC_LABELS = {
  CV: 'CV / Resume',
  ACADEMIC_CERTIFICATE: 'Academic certificates',
  PROFESSIONAL_CERTIFICATE: 'Professional certificates',
  NATIONAL_ID: 'National ID / Passport',
  CERTIFICATE_OF_GOOD_CONDUCT: 'Certificate of Good Conduct',
  OTHER: 'Other supporting documents',
}

function countByType(existingDocs, type) {
  return existingDocs.filter((d) => d.doc_type === type).length
}

export default function StepReview({
  data,
  updateField,
  opp,
  docsSatisfied,
  requiredDocTypes = ['CV'],
  existingDocs = [],
  submitting = false,
  submitError = '',
  onPrev,
  onSubmit,
  onGoToStep,
}) {
  const display = (v) => (v == null || v === '' ? '—' : String(v))

  const employer =
    typeof opp?.organization === 'string'
      ? opp.organization
      : opp?.organization_name || opp?.organization?.name || '—'

  const workExperiences = Array.isArray(data.workExperiences) ? data.workExperiences : []

  return (
    <>
      <h2 className="form-step-title">
        <i className="fas fa-clipboard-check" aria-hidden="true"></i> Review your application
      </h2>
      <p className="form-step-sub">
        Please review your details before submitting. You can edit any section.
      </p>

      {/* ─── PERSONAL ──────────────────────────────────────────────── */}
      <div className="review-block">
        <div className="review-block-header">
          <h4>
            <i className="fas fa-user" aria-hidden="true"></i> Personal details
          </h4>
          <button type="button" className="review-edit" onClick={() => onGoToStep(1)}>
            Edit
          </button>
        </div>
        <div className="review-block-body">
          <div className="review-item">
            <div className="rv-label">Full name</div>
            <div className="rv-value">
              {display(
                `${data.firstName || ''} ${data.middleName || ''} ${data.lastName || ''}`.trim()
              )}
            </div>
          </div>
          <div className="review-item">
            <div className="rv-label">Email</div>
            <div className="rv-value">{display(data.email)}</div>
          </div>
          <div className="review-item">
            <div className="rv-label">Phone</div>
            <div className="rv-value">{display(data.phone)}</div>
          </div>
          <div className="review-item">
            <div className="rv-label">Gender</div>
            <div className="rv-value">{display(data.gender)}</div>
          </div>
          <div className="review-item">
            <div className="rv-label">Date of birth</div>
            <div className="rv-value">{display(data.dob)}</div>
          </div>
          <div className="review-item">
            <div className="rv-label">Nationality</div>
            <div className="rv-value">{display(data.nationality)}</div>
          </div>
          <div className="review-item">
            <div className="rv-label">County</div>
            <div className="rv-value">{display(data.county)}</div>
          </div>
          {data.city && (
            <div className="review-item">
              <div className="rv-label">Town / city</div>
              <div className="rv-value">{display(data.city)}</div>
            </div>
          )}
          <div className="review-item">
            <div className="rv-label">ID / Passport number</div>
            <div className="rv-value">
              {data.idNumber ? `National ID · ${data.idNumber}` : null}
              {data.passportNumber ? `Passport · ${data.passportNumber}` : null}
              {!data.idNumber && !data.passportNumber ? '—' : null}
            </div>
          </div>
          {data.bio && (
            <div className="review-item">
              <div className="rv-label">Bio</div>
              <div className="rv-value">{data.bio}</div>
            </div>
          )}
        </div>
      </div>

      {/* ─── EDUCATION ─────────────────────────────────────────────── */}
      <div className="review-block">
        <div className="review-block-header">
          <h4>
            <i className="fas fa-graduation-cap" aria-hidden="true"></i> Education &amp; qualifications
          </h4>
          <button type="button" className="review-edit" onClick={() => onGoToStep(2)}>
            Edit
          </button>
        </div>
        <div className="review-block-body">
          {data.institution ? (
            <>
              <div className="review-item">
                <div className="rv-label">Institution</div>
                <div className="rv-value">{display(data.institution)}</div>
              </div>
              {data.regNumber && (
                <div className="review-item">
                  <div className="rv-label">Registration number</div>
                  <div className="rv-value">{display(data.regNumber)}</div>
                </div>
              )}
              <div className="review-item">
                <div className="rv-label">Course</div>
                <div className="rv-value">{display(data.course)}</div>
              </div>
              <div className="review-item">
                <div className="rv-label">Level</div>
                <div className="rv-value">{display(data.level)}</div>
              </div>
              <div className="review-item">
                <div className="rv-label">Duration</div>
                <div className="rv-value">
                  {display(data.yearStart)} – {display(data.yearEnd)}
                </div>
              </div>
            </>
          ) : (
            <p className="form-step-sub" style={{ margin: 0 }}>
              No education entries on file yet.
            </p>
          )}

          {Array.isArray(data.skills) && data.skills.length > 0 && (
            <div className="review-item">
              <div className="rv-label">Skills</div>
              <div className="rv-value">
                {typeof data.skills === 'string' ? data.skills : data.skills.join(', ')}
              </div>
            </div>
          )}

          {Array.isArray(data.qualifications) && data.qualifications.length > 0 && (
            <div className="review-item">
              <div className="rv-label">Certifications</div>
              <div className="rv-value">{data.qualifications.join(', ')}</div>
            </div>
          )}
        </div>
      </div>

      {/* ─── WORK EXPERIENCE ───────────────────────────────────────── */}
      <div className="review-block">
        <div className="review-block-header">
          <h4>
            <i className="fas fa-briefcase" aria-hidden="true"></i> Work experience
          </h4>
          <button type="button" className="review-edit" onClick={() => onGoToStep(3)}>
            Edit
          </button>
        </div>
        <div className="review-block-body">
          {workExperiences.length > 0 ? (
            workExperiences.map((w) => (
              <div className="review-item" key={w.id || `${w.organization}-${w.position}`}>
                <div className="rv-label">{display(w.position)}</div>
                <div className="rv-value">
                  {display(w.organization)} · {display(w.start_date)} –{' '}
                  {w.is_current ? 'Present' : display(w.end_date)}
                </div>
                {w.description && (
                  <div className="rv-value muted" style={{ marginTop: '0.2rem', fontSize: '0.9rem' }}>
                    {w.description}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="form-step-sub" style={{ margin: 0 }}>
              No work experience added.
            </p>
          )}
        </div>
      </div>

      {/* ─── DOCUMENTS ─────────────────────────────────────────────── */}
      <div className="review-block">
        <div className="review-block-header">
          <h4>
            <i className="fas fa-file-upload" aria-hidden="true"></i> Documents
          </h4>
          <button type="button" className="review-edit" onClick={() => onGoToStep(4)}>
            Edit
          </button>
        </div>
        <div className="review-block-body">
          {requiredDocTypes.length === 0 ? (
            <p className="form-step-sub" style={{ margin: 0 }}>
              No documents required for this opportunity.
            </p>
          ) : (
            requiredDocTypes.map((type) => {
              const count = countByType(existingDocs, type)
              const label = DOC_LABELS[type] || type.replaceAll('_', ' ')
              return (
                <div className="review-item" key={type}>
                  <div className="rv-label">{label}</div>
                  <div
                    className="rv-value"
                    style={{ color: count > 0 ? 'var(--success)' : 'var(--danger, #d33)' }}
                  >
                    {count > 0 ? (
                      <>
                        <i className="fas fa-check-circle"></i>{' '}
                        {count} file{count === 1 ? '' : 's'} uploaded
                      </>
                    ) : (
                      <>
                        <i className="fas fa-times-circle"></i> Missing
                      </>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* ─── COVER LETTER ──────────────────────────────────────────── */}
      {data.coverLetter && (
        <div className="review-block">
          <div className="review-block-header">
            <h4>
              <i className="fas fa-envelope-open-text" aria-hidden="true"></i> Cover letter
            </h4>
            <button type="button" className="review-edit" onClick={() => onGoToStep(4)}>
              Edit
            </button>
          </div>
          <div className="review-block-body">
            <div className="review-item">
              <div className="rv-value" style={{ whiteSpace: 'pre-wrap' }}>
                {data.coverLetter}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── APPLICATION SUMMARY ──────────────────────────────────── */}
      <div className="review-block">
        <div className="review-block-header">
          <h4>
            <i className="fas fa-bullseye" aria-hidden="true"></i> Applying for
          </h4>
        </div>
        <div className="review-block-body">
          <div className="review-item">
            <div className="rv-label">Opportunity</div>
            <div className="rv-value">{display(opp?.title)}</div>
          </div>
          <div className="review-item">
            <div className="rv-label">Employer</div>
            <div className="rv-value">{employer}</div>
          </div>
        </div>
      </div>

      {/* ─── DECLARATION ───────────────────────────────────────────── */}
      <div className="form-section" style={{ marginTop: '1.2rem' }}>
        <div className="form-section-title">
          <i className="fas fa-check-square" aria-hidden="true"></i> Final declaration
        </div>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={data.finalConsent}
            onChange={(e) => updateField('finalConsent', e.target.checked)}
          />
          <span>
            I declare that the information provided is true and accurate to the best of my
            knowledge, and I agree to the <a href="#">Terms of Service</a> and{' '}
            <a href="#">Privacy Policy</a>. <span className="required">*</span>
          </span>
        </label>

        {!docsSatisfied && (
          <p className="form-hint" style={{ color: 'var(--danger, #d33)', marginTop: '0.5rem' }}>
            All required documents must be uploaded before you can submit.
          </p>
        )}
        {submitError && (
          <p className="form-hint" style={{ color: 'var(--danger, #d33)', marginTop: '0.5rem' }}>
            {submitError}
          </p>
        )}
      </div>

      <div className="form-nav">
        <button type="button" className="btn btn-ghost" onClick={onPrev} disabled={submitting}>
          <i className="fas fa-arrow-left" aria-hidden="true"></i> Back
        </button>
        <div className="form-nav-right">
          <button
            type="button"
            className="btn btn-accent"
            onClick={onSubmit}
            disabled={submitting || !docsSatisfied || !data.finalConsent}
          >
            {submitting ? (
              <>
                <i className="fas fa-spinner fa-spin" aria-hidden="true"></i> Submitting…
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane" aria-hidden="true"></i> Submit application
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}