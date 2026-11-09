// All supported doc types. Must stay in sync with:
//   apps/core/constants.USER_DOCUMENT_TYPE_CHOICES
const DOC_META = {
  CV: {
    label: 'CV / Resume',
    hint: 'PDF, DOC or DOCX – max 5 MB',
    accept: '.pdf,.doc,.docx',
  },
  ACADEMIC_CERTIFICATE: {
    label: 'Academic certificates',
    hint: 'PDF, JPG or PNG – max 5 MB',
    accept: '.pdf,.jpg,.jpeg,.png',
  },
  PROFESSIONAL_CERTIFICATE: {
    label: 'Professional certificates',
    hint: 'PDF, JPG or PNG – max 5 MB',
    accept: '.pdf,.jpg,.jpeg,.png',
  },
  NATIONAL_ID: {
    label: 'National ID / Passport copy',
    hint: 'PDF, JPG or PNG – max 5 MB',
    accept: '.pdf,.jpg,.jpeg,.png',
  },
  CERTIFICATE_OF_GOOD_CONDUCT: {
    label: 'Certificate of Good Conduct',
    hint: 'PDF or JPG – max 5 MB',
    accept: '.pdf,.jpg,.jpeg,.png',
  },
  OTHER: {
    label: 'Other supporting documents',
    hint: 'PDF, JPG or PNG – max 5 MB',
    accept: '.pdf,.jpg,.jpeg,.png',
  },
}

function DocTypeGroup({
  type,
  cfg,
  required,
  docs,             // array of existing docs for this type
  uploading,        // bool — a file is being uploaded for THIS type
  onUpload,         // (file) => void
  onRemove,         // (id) => void | undefined
}) {
  const inputId = `doc-${type}`

  return (
    <div
      className="form-section"
      style={{
        border: '1px solid var(--border, #e5e7eb)',
        borderRadius: 8,
        padding: '1rem',
        marginBottom: '1rem',
      }}
    >
      <div
        className="form-section-title"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <span>
          <i className="fas fa-file-alt" aria-hidden="true"></i>{' '}
          {cfg.label}{' '}
          {required && <span className="required">*</span>}{' '}
          <span className="muted" style={{ fontWeight: 400 }}>
            ({docs.length})
          </span>
        </span>
        {required && docs.length === 0 && (
          <span className="form-hint" style={{ color: 'var(--danger, #d33)', margin: 0 }}>
            Required
          </span>
        )}
      </div>

      {docs.length > 0 && (
        <ul className="profile-list" style={{ marginTop: '0.4rem' }}>
          {docs.map((d) => (
            <li key={d.id} className="profile-list-item">
              <div>
                <strong>{d.title || d.file?.split('/').pop() || `Doc #${d.id}`}</strong>
                {d.size_bytes ? (
                  <span className="muted" style={{ marginLeft: '0.5rem' }}>
                    · {(d.size_bytes / 1024 / 1024).toFixed(2)} MB
                  </span>
                ) : null}
                {d.created_at && (
                  <div className="muted" style={{ fontSize: '0.8rem' }}>
                    Uploaded {new Date(d.created_at).toLocaleDateString('en-GB')}
                  </div>
                )}
              </div>
              {onRemove && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => onRemove(d.id)}
                  title="Remove this document"
                >
                  <i className="fas fa-times" aria-hidden="true"></i>
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <label
        className={`file-upload ${docs.length > 0 ? 'compact' : ''}`}
        htmlFor={inputId}
        style={{ marginTop: '0.6rem' }}
      >
        <i
          className={`fas ${uploading ? 'fa-spinner fa-spin' : 'fa-cloud-upload-alt'}`}
          aria-hidden="true"
        ></i>
        <div className="file-upload-text">
          <strong>{uploading ? 'Uploading…' : docs.length ? 'Upload another' : 'Click to upload'}</strong>
          <span className="file-meta">{cfg.hint}</span>
        </div>
        <input
          id={inputId}
          type="file"
          accept={cfg.accept}
          disabled={uploading}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onUpload(e.target.files[0])
              e.target.value = '' // allow re-uploading the same filename
            }
          }}
        />
      </label>
    </div>
  )
}

export default function StepDocuments({
  data,
  updateField,
  requiredDocTypes = ['CV'],
  existingDocs = [],
  uploadingDocType = null,
  onUploadDocument,
  onRemoveDocument,
  onNext,
  onPrev,
}) {
  // Filter to known types; anything unknown is coerced to OTHER.
  const requiredSet = new Set(
    requiredDocTypes.map((t) => (DOC_META[t] ? t : 'OTHER'))
  )

  // Show every optional type EXCEPT ones already in the required list.
  const optionalTypes = Object.keys(DOC_META).filter((t) => !requiredSet.has(t))

  const docsByType = (type) => existingDocs.filter((d) => d.doc_type === type)

  const validate = () => {
    const missing = [...requiredSet].filter((t) => docsByType(t).length === 0)
    if (missing.length) {
      alert(
        `Please upload the following required document${missing.length > 1 ? 's' : ''}: ${missing
          .map((t) => DOC_META[t]?.label || t)
          .join(', ')}.`
      )
      return false
    }
    if (!data.dataConsent || !data.accurateConsent) {
      alert('Please accept the data protection and accuracy declarations.')
      return false
    }
    return true
  }

  return (
    <>
      <h2 className="form-step-title">
        <i className="fas fa-file-upload" aria-hidden="true"></i> Upload documents
      </h2>
      <p className="form-step-sub">
        You can upload multiple files for any document type (e.g. two academic
        certificates). Accepted formats: PDF, DOC/DOCX, JPG, PNG — max 5 MB each.
        Everything you upload is saved to your profile and reused for future
        applications.
      </p>

      <div className="form-section">
        <div className="form-section-title">
          <i className="fas fa-id-card" aria-hidden="true"></i> Required documents
        </div>

        {[...requiredSet].map((type) => (
          <DocTypeGroup
            key={type}
            type={type}
            cfg={DOC_META[type]}
            required
            docs={docsByType(type)}
            uploading={uploadingDocType === type}
            onUpload={(file) => onUploadDocument(type, file)}
            onRemove={
              onRemoveDocument
                ? (id) => {
                    if (window.confirm('Remove this document from your profile?')) {
                      onRemoveDocument(id)
                    }
                  }
                : undefined
            }
          />
        ))}
      </div>

      {optionalTypes.length > 0 && (
        <div className="form-section">
          <div className="form-section-title">
            <i className="fas fa-folder-plus" aria-hidden="true"></i> Optional documents
          </div>

          {optionalTypes.map((type) => (
            <DocTypeGroup
              key={type}
              type={type}
              cfg={DOC_META[type]}
              required={false}
              docs={docsByType(type)}
              uploading={uploadingDocType === type}
              onUpload={(file) => onUploadDocument(type, file)}
              onRemove={
                onRemoveDocument
                  ? (id) => {
                      if (window.confirm('Remove this document from your profile?')) {
                        onRemoveDocument(id)
                      }
                    }
                  : undefined
              }
            />
          ))}
        </div>
      )}

      <div className="form-section">
        <div className="form-section-title">
          <i className="fas fa-pen" aria-hidden="true"></i> Cover letter (optional)
        </div>
        <div className="form-group">
          <label htmlFor="coverLetter">
            Tell the employer why you&apos;re a good fit — a few sentences is fine.
          </label>
          <div className="input-wrapper">
            <i className="fas fa-align-left" aria-hidden="true"></i>
            <textarea
              id="coverLetter"
              rows="4"
              value={data.coverLetter || ''}
              onChange={(e) => updateField('coverLetter', e.target.value)}
              placeholder="e.g. I'm a final-year electrical installation student eager to apply my coursework in a hands-on setting…"
              maxLength={2000}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">
          <i className="fas fa-lock" aria-hidden="true"></i> Data protection &amp; declaration
        </div>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={data.dataConsent}
            onChange={(e) => updateField('dataConsent', e.target.checked)}
          />
          <span>
            I consent to Ujuzi Link processing my personal data for the purpose of this
            application, in accordance with the <a href="#">Data Protection Policy</a>.{' '}
            <span className="required">*</span>
          </span>
        </label>
        <label className="checkbox-label" style={{ marginTop: '0.7rem' }}>
          <input
            type="checkbox"
            checked={data.accurateConsent}
            onChange={(e) => updateField('accurateConsent', e.target.checked)}
          />
          <span>
            I confirm that the information and documents provided are true and accurate.{' '}
            <span className="required">*</span>
          </span>
        </label>
      </div>

      <div className="form-nav">
        <button type="button" className="btn btn-ghost" onClick={onPrev}>
          <i className="fas fa-arrow-left" aria-hidden="true"></i> Back
        </button>
        <div className="form-nav-right">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => validate() && onNext()}
          >
            Review application <i className="fas fa-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </>
  )
}