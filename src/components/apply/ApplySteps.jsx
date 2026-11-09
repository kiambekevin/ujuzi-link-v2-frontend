const STEPS = [
  { num: 1, label: 'Personal' },
  { num: 2, label: 'Education' },
  { num: 3, label: 'Experience' },
  { num: 4, label: 'Documents' },
  { num: 5, label: 'Review' },
]

export default function ApplySteps({ step, setStep }) {
  return (
    <div className="steps-indicator">
      <ol className="steps-list">
        {STEPS.map((s, idx) => {
          const isDone = s.num < step
          const isActive = s.num === step
          const canClick = s.num < step

          return (
            <li
              key={s.num}
              className={`step-item ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}
              onClick={() => canClick && setStep(s.num)}
              role="button"
              tabIndex={canClick ? 0 : -1}
              onKeyDown={(e) => {
                if (canClick && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  setStep(s.num)
                }
              }}
            >
              {idx < STEPS.length - 1 && <div className="step-line" />}
              <div className="step-dot">{isDone ? <i className="fas fa-check"></i> : s.num}</div>
              <span className="step-label">{s.label}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}