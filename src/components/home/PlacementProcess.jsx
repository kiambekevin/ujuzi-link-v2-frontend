import { placementSteps } from '../../data/homeData.js'

export default function PlacementProcess() {
  return (
    <section className="alt-bg">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-label">Structured placement</div>
            <h2>
              <i className="fas fa-sync-alt" aria-hidden="true"></i> 10‑step lifecycle
            </h2>
            <p>
              A transparent, end‑to‑end digital process from employer registration to feedback and
              reporting.
            </p>
          </div>
        </div>
        <div className="lifecycle-wrapper">
          <div className="lifecycle-grid">
            {placementSteps.map((step) => (
              <div className="step" key={step.num}>
                <div className="step-number">{step.num}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}