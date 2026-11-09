import { useEffect, useState } from 'react'

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

const emptyExperience = () => ({
  organization: '',
  position: '',
  start_date: '',
  end_date: '',
  is_current: false,
  description: '',
})

const normaliseExperience = (w) => ({
  id: w.id,
  organization: w.organization || '',
  position: w.position || '',
  start_date: w.start_date || '',
  end_date: w.end_date || '',
  is_current: Boolean(w.is_current),
  description: w.description || '',
})

export default function StepWorkExperience({
  experiences = [],
  onAddExperience,
  onSaveExperience,
  onRemoveExperience,
  onNext,
  onPrev,
}) {
  const [mode, setMode] = useState('view')          // 'view' | 'add' | 'edit'
  const [draft, setDraft] = useState(emptyExperience)
  const [editingRow, setEditingRow] = useState(null) // row being edited
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const canEdit = Boolean(onAddExperience || onSaveExperience)

  // Reset add-draft whenever the form leaves 'add' mode.
  useEffect(() => {
    if (mode !== 'add') setDraft(emptyExperience())
  }, [mode])

  const startEdit = (row) => {
    setError('')
    setEditingRow(row)
    setDraft(normaliseExperience(row))
    setMode('edit')
  }

  const cancel = () => {
    setEditingRow(null)
    setDraft(emptyExperience())
    setMode('view')
    setError('')
  }

  const validateDraft = () => {
    if (!draft.organization || !draft.position || !draft.start_date) {
      setError('Organization, position, and start date are required.')
      return false
    }
    if (
      !draft.is_current &&
      draft.end_date &&
      new Date(draft.end_date) < new Date(draft.start_date)
    ) {
      setError('End date cannot be before start date.')
      return false
    }
    return true
  }

  const submit = async () => {
    setError('')
    if (!validateDraft()) return
    const payload = {
      organization: draft.organization,
      position: draft.position,
      start_date: draft.start_date,
      end_date: draft.is_current ? null : draft.end_date || null,
      is_current: draft.is_current,
      description: draft.description || '',
    }
    setBusy(true)
    try {
      if (mode === 'edit' && editingRow?.id && onSaveExperience) {
        await onSaveExperience(editingRow.id, payload)
      } else if (onAddExperience) {
        await onAddExperience(payload)
      }
      cancel()
    } catch {
      setError('Could not save that work experience entry. Try again.')
    } finally {
      setBusy(false)
    }
  }

  const remove = async (row) => {
    if (!onRemoveExperience || !row.id) return
    setBusy(true)
    try {
      await onRemoveExperience(row.id)
    } catch {
      setError('Could not remove that entry.')
    } finally {
      setBusy(false)
    }
  }

  const isEditing = mode !== 'view'

  return (
    <>
      <h2 className="form-step-title">
        <i className="fas fa-briefcase" aria-hidden="true"></i> Work experience
      </h2>
      <p className="form-step-sub">
        List any paid or volunteer roles, attachments, or projects that are
        relevant to this opportunity. If you have none, you can skip this step.
      </p>

      {error && <p className="form-hint" style={{ color: 'var(--danger, #d33)' }}>{error}</p>}

      {/* ─── VIEW MODE ──────────────────────────────────────────────── */}
      {mode === 'view' && (
        <>
          <div
            className="form-section-title"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>
              <i className="fas fa-list" aria-hidden="true"></i>{' '}
              Experience entries{' '}
              <span className="muted" style={{ fontWeight: 400 }}>
                ({experiences.length})
              </span>
            </span>
            {canEdit && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setMode('add')}
                disabled={busy}
              >
                <i className="fas fa-plus" aria-hidden="true"></i> Add experience
              </button>
            )}
          </div>

          {experiences.length > 0 ? (
            <ul className="profile-list" style={{ marginTop: '0.5rem' }}>
              {experiences.map((w) => (
                <li key={w.id} className="profile-list-item">
                  <div>
                    <strong>{w.position}</strong>
                    <span className="muted"> · {w.organization}</span>
                    <div className="muted" style={{ fontSize: '0.85rem' }}>
                      {w.start_date || '-'} – {w.is_current ? 'Present' : (w.end_date || '-')}
                    </div>
                    {w.description && (
                      <div className="muted" style={{ fontSize: '0.85rem' }}>
                        {w.description}
                      </div>
                    )}
                  </div>
                  <span style={{ display: 'inline-flex', gap: '0.3rem' }}>
                    {onSaveExperience && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => startEdit(w)}
                        disabled={busy}
                        title="Edit"
                      >
                        <i className="fas fa-pen" aria-hidden="true"></i>
                      </button>
                    )}
                    {onRemoveExperience && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => remove(w)}
                        disabled={busy}
                        title="Remove"
                      >
                        <i className="fas fa-trash" aria-hidden="true"></i>
                      </button>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="form-step-sub" style={{ marginTop: 0 }}>
              No work experience on file yet.
            </p>
          )}
        </>
      )}

      {/* ─── ADD / EDIT MODE ───────────────────────────────────────── */}
      {isEditing && (
        <>
          <div className="draft-card">
            <div className="draft-card-header">
              <strong>{mode === 'edit' ? 'Edit experience' : 'New experience entry'}</strong>
            </div>

            <div className="form-row-2">
              <Field id="we-org" label="Organization" icon="fa-building" required>
                <input
                  id="we-org"
                  value={draft.organization}
                  onChange={(e) => setDraft((p) => ({ ...p, organization: e.target.value }))}
                  placeholder="e.g. Kenya Power & Lighting Co."
                />
              </Field>
              <Field id="we-position" label="Position / role" icon="fa-user-tie" required>
                <input
                  id="we-position"
                  value={draft.position}
                  onChange={(e) => setDraft((p) => ({ ...p, position: e.target.value }))}
                  placeholder="e.g. Electrical Technician (Attachment)"
                />
              </Field>
            </div>

            <div className="form-row-2">
              <Field id="we-start" label="Start date" icon="fa-calendar" required>
                <input
                  id="we-start"
                  type="date"
                  value={draft.start_date}
                  onChange={(e) => setDraft((p) => ({ ...p, start_date: e.target.value }))}
                />
              </Field>
              <Field id="we-end" label="End date" icon="fa-calendar-check" hint={draft.is_current ? 'Disabled because "I currently work here" is checked.' : undefined}>
                <input
                  id="we-end"
                  type="date"
                  value={draft.end_date}
                  onChange={(e) => setDraft((p) => ({ ...p, end_date: e.target.value }))}
                  disabled={draft.is_current}
                />
              </Field>
            </div>

            <label className="checkbox-label" style={{ marginTop: '0.4rem' }}>
              <input
                type="checkbox"
                checked={draft.is_current}
                onChange={(e) =>
                  setDraft((p) => ({
                    ...p,
                    is_current: e.target.checked,
                    end_date: e.target.checked ? '' : p.end_date,
                  }))
                }
              />
              <span>I currently work here</span>
            </label>

            <div className="form-group" style={{ marginTop: '0.8rem' }}>
              <label htmlFor="we-desc">Description (optional)</label>
              <div className="input-wrapper">
                <i className="fas fa-align-left" aria-hidden="true"></i>
                <textarea
                  id="we-desc"
                  rows="3"
                  value={draft.description}
                  onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))}
                  placeholder="What did you do? Key duties, achievements, tools used…"
                />
              </div>
            </div>
          </div>

          <div className="form-nav-right" style={{ marginTop: '1rem' }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={cancel}
              disabled={busy}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={submit}
              disabled={busy}
            >
              {busy ? (
                <><i className="fas fa-spinner fa-spin"></i> Saving…</>
              ) : (
                <><i className="fas fa-save"></i> Save</>
              )}
            </button>
          </div>
        </>
      )}

      <div className="form-nav">
        <button type="button" className="btn btn-ghost" onClick={onPrev} disabled={busy}>
          <i className="fas fa-arrow-left" aria-hidden="true"></i> Back
        </button>
        <div className="form-nav-right">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onNext}
            disabled={isEditing || busy}
            title={isEditing ? 'Save or cancel your edit first.' : undefined}
          >
            Next: Documents <i className="fas fa-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </>
  )
}