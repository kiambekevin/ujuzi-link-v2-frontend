import { stakeholders } from '../../data/homeData.js'

export default function StakeholderEcosystem() {
  return (
    <section>
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-label">Collaboration</div>
            <h2>
              <i className="fas fa-users" aria-hidden="true"></i> National stakeholder ecosystem
            </h2>
            <p>
              Ujuzi Link is a collaborative service bringing together government, industry,
              training institutions and development partners.
            </p>
          </div>
        </div>
        <div className="stakeholder-logos">
          {stakeholders.map((s) => (
            <div className="stakeholder-logo-card" key={s.label}>
              <div className="stakeholder-logo-img">
                <i className={`fas ${s.icon}`}></i>
              </div>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}