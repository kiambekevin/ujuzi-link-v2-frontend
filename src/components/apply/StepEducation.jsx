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

const LEVELS = [
  'Primary School',
  'Secondary School (KCSE)',
  'Certificate',
  'Diploma',
  "Bachelor's Degree",
  "Master's Degree",
  'Doctorate',
  'Other',
]

const PROFICIENCY = [
  { value: 1, label: 'Beginner' },
  { value: 2, label: 'Basic' },
  { value: 3, label: 'Intermediate' },
  { value: 4, label: 'Advanced' },
  { value: 5, label: 'Expert' },
]

const COMMON_COURSES = [
  'Certificate in Electrical Installation',
  'Diploma in Electrical Installation',
  'Certificate in Motor Vehicle Mechanics',
  'Diploma in Automotive Engineering',
  'Certificate in Welding & Fabrication',
  'Diploma in Mechanical Engineering',
  'Certificate in Plumbing',
  'Diploma in Civil Engineering',
  'Certificate in ICT',
  'Diploma in Information Technology',
  'Certificate in Business Administration',
  'Diploma in Business Management',
  'Certificate in Food & Beverage',
  'Diploma in Hospitality Management',
  'Diploma in Nursing',
  'Certificate in Community Health',
]

const startYears = (() => {
  const y = new Date().getFullYear()
  return Array.from({ length: 37 }, (_, i) => String(y + 6 - i))
})()
const endYears = (() => {
  const y = new Date().getFullYear()
  return Array.from({ length: 13 }, (_, i) => String(y + 10 - i))
})()

const yearOf = (iso) => (iso ? String(iso).slice(0, 4) : '')
const asIsoYear = (year) => (year ? `${year}-01-01` : null)
const proficiencyLabel = (value) =>
  PROFICIENCY.find((p) => Number(p.value) === Number(value))?.label || `Level ${value}`

const emptyEducation = () => ({
  institution: '',
  registration_number: '',
  level: '',
  qualification: '',
  field_of_study: '',
  start_date: '',
  end_date: '',
  description: '',
})

const emptySkill = () => ({ skill: '', proficiency: 3, years_of_experience: 0 })
const emptyCertification = () => ({
  title: '',
  issuer: '',
  date_obtained: '',
  expiry_date: '',
})

const normaliseEducation = (e) => ({
  id: e.id,
  institution: e.institution || '',
  registration_number: e.registration_number || '',
  level: e.level || '',
  qualification: e.qualification || '',
  field_of_study: e.field_of_study || '',
  start_date: e.start_date || '',
  end_date: e.end_date || '',
  description: e.description || '',
})

export default function StepEducation({
  data,
  updateField,
  onNext,
  onPrev,
  educationEntries = [],
  skills = [],
  certifications = [],
  onSaveEducation,
  onRemoveEducation,
  onAddSkill,
  onRemoveSkill,
  onAddCertification,
  onRemoveCertification,
  skillCatalogue = [],
}) {
  const [eduMode, setEduMode] = useState('view')
  const [skillMode, setSkillMode] = useState('view')
  const [certMode, setCertMode] = useState('view')

  const [eduDraft, setEduDraft] = useState(() => educationEntries.map(normaliseEducation))
  const [newEduEntry, setNewEduEntry] = useState(emptyEducation)
  const [skillDraft, setSkillDraft] = useState(emptySkill)
  const [certDraft, setCertDraft] = useState(emptyCertification)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setEduDraft(educationEntries.map(normaliseEducation))
  }, [educationEntries])

  useEffect(() => { if (eduMode !== 'add') setNewEduEntry(emptyEducation()) }, [eduMode])
  useEffect(() => { if (skillMode !== 'add') setSkillDraft(emptySkill()) }, [skillMode])
  useEffect(() => { if (certMode !== 'add') setCertDraft(emptyCertification()) }, [certMode])

  const canEditEducation = Boolean(onSaveEducation)
  const canEditSkills = Boolean(onAddSkill)
  const canEditCerts = Boolean(onAddCertification)

  const saveEducationEdits = async () => {
    setError('')
    for (const [i, e] of eduDraft.entries()) {
      if (!e.institution && !e.level) continue
      if (!e.institution || !e.level || !e.start_date || !e.end_date) {
        setError(`Education entry #${i + 1}: institution, level, start and end dates are required.`)
        return
      }
      if (Number(yearOf(e.end_date)) < Number(yearOf(e.start_date))) {
        setError(`Education entry #${i + 1}: completion year must be after start year.`)
        return
      }
    }
    setBusy(true)
    try {
      await onSaveEducation(eduDraft.filter((e) => e.institution && e.level))
      setEduMode('view')
    } catch {
      setError('Could not save education entries. Try again.')
    } finally {
      setBusy(false)
    }
  }

  const cancelEducationEdits = () => {
    setEduDraft(educationEntries.map(normaliseEducation))
    setEduMode('view')
  }

  const addEducationEntry = () => {
    setError('')
    const e = newEduEntry
    if (!e.institution || !e.level || !e.start_date || !e.end_date) {
      setError('Fill in institution, level, start and end dates first.')
      return
    }
    setEduDraft((prev) => [...prev, { ...e }])
    setNewEduEntry(emptyEducation())
  }

  const removeEducationFromDraft = (idx) => {
    setEduDraft((prev) => prev.filter((_, i) => i !== idx))
  }

  const commitEducationRemoval = async (row) => {
    if (!row.id || !onRemoveEducation) return
    setBusy(true)
    try {
      await onRemoveEducation(row.id)
    } catch {
      setError('Could not remove that education entry.')
    } finally {
      setBusy(false)
    }
  }

  const addSkill = async () => {
    setError('')
    if (!skillDraft.skill) { setError('Pick a skill first.'); return }
    setBusy(true)
    try {
      await onAddSkill({
        skill: Number(skillDraft.skill),
        proficiency: Number(skillDraft.proficiency),
        years_of_experience: String(skillDraft.years_of_experience || 0),
      })
      setSkillMode('view')
    } catch {
      setError('Could not add that skill. It may already be on your profile.')
    } finally {
      setBusy(false)
    }
  }

  const removeSkill = async (id) => {
    if (!onRemoveSkill) return
    setBusy(true)
    try { await onRemoveSkill(id) }
    catch { setError('Could not remove that skill.') }
    finally { setBusy(false) }
  }

  const addCertification = async () => {
    setError('')
    if (!certDraft.title || !certDraft.issuer) {
      setError('Title and issuer are required.')
      return
    }
    setBusy(true)
    try {
      await onAddCertification({
        title: certDraft.title,
        issuer: certDraft.issuer,
        date_obtained: certDraft.date_obtained || null,
        expiry_date: certDraft.expiry_date || null,
      })
      setCertMode('view')
    } catch {
      setError('Could not add that certification.')
    } finally {
      setBusy(false)
    }
  }

  const removeCertification = async (id) => {
    if (!onRemoveCertification) return
    setBusy(true)
    try { await onRemoveCertification(id) }
    catch { setError('Could not remove that certification.') }
    finally { setBusy(false) }
  }

  const canAdvance = eduMode === 'view' && skillMode === 'view' && certMode === 'view'

  return (
    <>
      <h2 className="form-step-title">
        <i className="fas fa-graduation-cap" aria-hidden="true"></i> Education, skills &amp; certifications
      </h2>
      <p className="form-step-sub">
        Everything below is loaded from your profile. Add or edit anything that&apos;s missing,
        then continue.
      </p>

      {error && <p className="form-hint" style={{ color: 'var(--danger, #d33)' }}>{error}</p>}

      {/* ─── EDUCATION ────────────────────────────────────────────── */}
      <div className="form-section">
        <SectionHeader
          icon="fa-university"
          title="Education entries"
          count={educationEntries.length}
          mode={eduMode}
          onEdit={canEditEducation && educationEntries.length > 0 ? () => setEduMode('edit') : undefined}
          onAdd={canEditEducation ? () => setEduMode('add') : undefined}
          disabled={busy}
        />

        {eduMode === 'view' && (
          educationEntries.length > 0 ? (
            <ul className="profile-list">
              {educationEntries.map((e) => (
                <li key={e.id} className="profile-list-item">
                  <div>
                    <strong>{e.institution}</strong>{' '}
                    <span className="muted">· {e.level}</span>
                    {e.registration_number && (
                      <div className="muted" style={{ fontSize: '0.85rem' }}>Reg. {e.registration_number}</div>
                    )}
                    {e.field_of_study && (
                      <div className="muted" style={{ fontSize: '0.85rem' }}>{e.field_of_study}</div>
                    )}
                    {(e.start_date || e.end_date) && (
                      <div className="muted" style={{ fontSize: '0.85rem' }}>
                        {yearOf(e.start_date) || '—'} – {yearOf(e.end_date) || '—'}
                      </div>
                    )}
                  </div>
                  {canEditEducation && onRemoveEducation && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => commitEducationRemoval(e)}
                      disabled={busy}
                      title="Remove this entry"
                    >
                      <i className="fas fa-trash" aria-hidden="true"></i>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="form-step-sub" style={{ marginTop: 0 }}>No education entries on file yet.</p>
          )
        )}

        {(eduMode === 'edit' || eduMode === 'add') && (
          <>
            {eduDraft.map((e, idx) => (
              <div key={e.id || `new-${idx}`} className="draft-card">
                <div className="draft-card-header">
                  <strong>{e.id ? `Entry #${idx + 1}` : `New entry #${idx + 1}`}</strong>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => removeEducationFromDraft(idx)}
                  >
                    <i className="fas fa-times" aria-hidden="true"></i>
                  </button>
                </div>
                <EducationFields
                  idPrefix={`edu-${idx}`}
                  value={e}
                  onChange={(patch) =>
                    setEduDraft((prev) => prev.map((row, i) => (i === idx ? { ...row, ...patch } : row)))
                  }
                />
              </div>
            ))}

            {eduMode === 'add' && (
              <div className="draft-card">
                <div className="draft-card-header"><strong>New education entry</strong></div>
                <EducationFields
                  idPrefix="edu-new"
                  value={newEduEntry}
                  onChange={(patch) => setNewEduEntry((p) => ({ ...p, ...patch }))}
                />
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={addEducationEntry}
                >
                  <i className="fas fa-plus" aria-hidden="true"></i> Add to draft
                </button>
              </div>
            )}

            <div className="form-nav-right" style={{ marginTop: '1rem' }}>
              <button type="button" className="btn btn-ghost" onClick={cancelEducationEdits} disabled={busy}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={saveEducationEdits} disabled={busy}>
                {busy ? <><i className="fas fa-spinner fa-spin"></i> Saving…</> : <><i className="fas fa-save"></i> Save education</>}
              </button>
            </div>
          </>
        )}

        <datalist id="course-options">
          {COMMON_COURSES.map((c) => <option key={c} value={c} />)}
        </datalist>
      </div>

      {/* ─── SKILLS ───────────────────────────────────────────────── */}
      <div className="form-section">
        <SectionHeader
          icon="fa-tools"
          title="Trainee skills"
          count={skills.length}
          mode={skillMode}
          onAdd={canEditSkills ? () => setSkillMode('add') : undefined}
          disabled={busy}
        />

        {skillMode === 'view' && (
          skills.length > 0 ? (
            <ul className="profile-list">
              {skills.map((s) => (
                <li key={s.id} className="profile-list-item">
                  <div>
                    <strong>{s.name || s.skill_name || `Skill #${s.skill}`}</strong>
                    {s.proficiency != null && (
                      <span className="muted" style={{ marginLeft: '0.5rem' }}>· {proficiencyLabel(s.proficiency)}</span>
                    )}
                    {Number(s.years_of_experience) > 0 && (
                      <span className="muted" style={{ marginLeft: '0.5rem' }}>· {s.years_of_experience} yr</span>
                    )}
                  </div>
                  {onRemoveSkill && (
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeSkill(s.id)} disabled={busy}>
                      <i className="fas fa-times" aria-hidden="true"></i>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="form-step-sub" style={{ marginTop: 0 }}>No skills added yet.</p>
          )
        )}

        {skillMode === 'add' && (
          <>
            <div className="form-row-2">
              <Field id="newSkill" label="Skill" icon="fa-plus">
                <select
                  id="newSkill"
                  value={skillDraft.skill}
                  onChange={(e) => setSkillDraft((p) => ({ ...p, skill: e.target.value }))}
                >
                  <option value="">Select a skill</option>
                  {skillCatalogue.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </Field>
              <Field id="newProficiency" label="Proficiency" icon="fa-star">
                <select
                  id="newProficiency"
                  value={skillDraft.proficiency}
                  onChange={(e) => setSkillDraft((p) => ({ ...p, proficiency: e.target.value }))}
                >
                  {PROFICIENCY.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </Field>
            </div>
            <div className="form-row-2">
              <Field id="newSkillYears" label="Years of experience" icon="fa-hourglass-half">
                <input
                  id="newSkillYears"
                  type="number"
                  min="0"
                  step="0.5"
                  value={skillDraft.years_of_experience}
                  onChange={(e) => setSkillDraft((p) => ({ ...p, years_of_experience: e.target.value }))}
                />
              </Field>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={addSkill}
                  disabled={busy || !skillDraft.skill}
                  style={{ width: '100%' }}
                >
                  <i className="fas fa-plus" aria-hidden="true"></i> Add skill
                </button>
              </div>
            </div>
            <div className="form-nav-right" style={{ marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setSkillMode('view')} disabled={busy}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>

      {/* ─── CERTIFICATIONS ───────────────────────────────────────── */}
      <div className="form-section">
        <SectionHeader
          icon="fa-certificate"
          title="Certifications"
          count={certifications.length}
          mode={certMode}
          onAdd={canEditCerts ? () => setCertMode('add') : undefined}
          disabled={busy}
        />

        {certMode === 'view' && (
          certifications.length > 0 ? (
            <ul className="profile-list">
              {certifications.map((c) => (
                <li key={c.id} className="profile-list-item">
                  <div>
                    <strong>{c.title}</strong>
                    <span className="muted" style={{ marginLeft: '0.5rem' }}>· {c.issuer}</span>
                    {c.date_obtained && (
                      <span className="muted" style={{ marginLeft: '0.5rem' }}>· {c.date_obtained}</span>
                    )}
                  </div>
                  {onRemoveCertification && (
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeCertification(c.id)} disabled={busy}>
                      <i className="fas fa-times" aria-hidden="true"></i>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="form-step-sub" style={{ marginTop: 0 }}>No certifications added yet.</p>
          )
        )}

        {certMode === 'add' && (
          <>
            <div className="form-row-2">
              <Field id="newCertTitle" label="Certification title" icon="fa-certificate" required>
                <input
                  id="newCertTitle"
                  value={certDraft.title}
                  onChange={(e) => setCertDraft((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. First Aid"
                />
              </Field>
              <Field id="newCertIssuer" label="Issuer" icon="fa-building" required>
                <input
                  id="newCertIssuer"
                  value={certDraft.issuer}
                  onChange={(e) => setCertDraft((p) => ({ ...p, issuer: e.target.value }))}
                  placeholder="e.g. St John Ambulance"
                />
              </Field>
            </div>
            <div className="form-row-2">
              <Field id="newCertDate" label="Date obtained" icon="fa-calendar">
                <input
                  id="newCertDate"
                  type="date"
                  value={certDraft.date_obtained}
                  onChange={(e) => setCertDraft((p) => ({ ...p, date_obtained: e.target.value }))}
                />
              </Field>
              <Field id="newCertExpiry" label="Expiry date (optional)" icon="fa-calendar-times">
                <input
                  id="newCertExpiry"
                  type="date"
                  value={certDraft.expiry_date}
                  onChange={(e) => setCertDraft((p) => ({ ...p, expiry_date: e.target.value }))}
                />
              </Field>
            </div>
            <div className="form-nav-right" style={{ marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setCertMode('view')} disabled={busy}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={addCertification}
                disabled={busy || !certDraft.title || !certDraft.issuer}
              >
                {busy ? <><i className="fas fa-spinner fa-spin"></i> Saving…</> : <><i className="fas fa-plus"></i> Add certification</>}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="form-nav">
        <button type="button" className="btn btn-ghost" onClick={onPrev}>
          <i className="fas fa-arrow-left" aria-hidden="true"></i> Back
        </button>
        <div className="form-nav-right">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onNext}
            disabled={!canAdvance || busy}
            title={!canAdvance ? 'Finish editing or cancel changes first.' : undefined}
          >
            Next: Experience <i className="fas fa-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </>
  )
}

// ─── subcomponents ────────────────────────────────────────────────────────

function SectionHeader({ icon, title, count, mode, onEdit, onAdd, disabled }) {
  const isEditing = mode !== 'view'
  return (
    <div
      className="form-section-title"
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
    >
      <span>
        <i className={`fas ${icon}`} aria-hidden="true"></i> {title}{' '}
        <span className="muted" style={{ fontWeight: 400 }}>({count})</span>
      </span>
      {!isEditing && (
        <span style={{ display: 'inline-flex', gap: '0.4rem' }}>
          {onEdit && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={onEdit} disabled={disabled}>
              <i className="fas fa-pen" aria-hidden="true"></i> Edit
            </button>
          )}
          {onAdd && (
            <button type="button" className="btn btn-outline btn-sm" onClick={onAdd} disabled={disabled}>
              <i className="fas fa-plus" aria-hidden="true"></i> Add
            </button>
          )}
        </span>
      )}
    </div>
  )
}

function EducationFields({ idPrefix, value, onChange }) {
  return (
    <>
      <div className="form-row-2">
        <Field id={`${idPrefix}-inst`} label="Institution name" icon="fa-university" required>
          <input
            id={`${idPrefix}-inst`}
            value={value.institution || ''}
            onChange={(e) => onChange({ institution: e.target.value })}
            placeholder="e.g. Nairobi Technical Training Institute"
          />
        </Field>
        <Field id={`${idPrefix}-reg`} label="Registration / admission number" icon="fa-hashtag">
          <input
            id={`${idPrefix}-reg`}
            value={value.registration_number || ''}
            onChange={(e) => onChange({ registration_number: e.target.value })}
            placeholder="e.g. NTTI/2023/0456"
          />
        </Field>
      </div>

      <Field id={`${idPrefix}-course`} label="Course / programme" icon="fa-book" required>
        <input
          id={`${idPrefix}-course`}
          list="course-options"
          value={value.field_of_study || ''}
          onChange={(e) => onChange({ field_of_study: e.target.value })}
          placeholder="e.g. Diploma in Electrical Installation"
        />
      </Field>

      <div className="form-row-2">
        <Field id={`${idPrefix}-level`} label="Education level" icon="fa-layer-group" required>
          <select
            id={`${idPrefix}-level`}
            value={value.level || ''}
            onChange={(e) => onChange({ level: e.target.value })}
          >
            <option value="">Select level</option>
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </Field>
        <Field id={`${idPrefix}-qual`} label="Qualification / award (optional)" icon="fa-award">
          <input
            id={`${idPrefix}-qual`}
            value={value.qualification || ''}
            onChange={(e) => onChange({ qualification: e.target.value })}
            placeholder="e.g. Diploma in Electrical Installation"
          />
        </Field>
      </div>

      <div className="form-row-2">
        <Field id={`${idPrefix}-start`} label="Year started" icon="fa-calendar" required>
          <select
            id={`${idPrefix}-start`}
            value={yearOf(value.start_date)}
            onChange={(e) => onChange({ start_date: asIsoYear(e.target.value) })}
          >
            <option value="">Select year</option>
            {startYears.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </Field>
        <Field id={`${idPrefix}-end`} label="Expected / actual completion" icon="fa-calendar-check" required>
          <select
            id={`${idPrefix}-end`}
            value={yearOf(value.end_date)}
            onChange={(e) => onChange({ end_date: asIsoYear(e.target.value) })}
          >
            <option value="">Select year</option>
            {endYears.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </Field>
      </div>

      <div className="form-group">
        <label htmlFor={`${idPrefix}-desc`}>Additional notes (optional)</label>
        <div className="input-wrapper">
          <i className="fas fa-align-left" aria-hidden="true"></i>
          <textarea
            id={`${idPrefix}-desc`}
            rows="2"
            value={value.description || ''}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="e.g. Specialisation, projects, awards…"
          />
        </div>
      </div>
    </>
  )
}