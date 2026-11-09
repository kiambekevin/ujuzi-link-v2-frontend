import { Users } from 'lucide-react'
import { stakeholders } from '../../data/homeData.js'

export default function StakeholderEcosystem() {
  return (
    <section>
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-label">Collaboration</div>
            <h2>
              <Users size={20} strokeWidth={2.5} aria-hidden="true" /> National stakeholder ecosystem
            </h2>
            <p>
              Ujuzi Link is a collaborative service bringing together government, industry,
              training institutions and development partners.
            </p>
          </div>
        </div>
        <div className="stakeholder-logos">
          {stakeholders.map((s) => {
            // `stakeholders` in homeData.js stores icon as an FA class string.
            // If you keep that data untouched, either (a) migrate the data
            // too, or (b) leave this loop unchanged. This version expects a
            // component reference (`s.icon` is a Lucide icon). Migrate the
            // data source accordingly, e.g.:
            //   { label: 'Ministry of Labour', icon: Building2 },
            const Icon = s.icon
            return (
              <div className="stakeholder-logo-card" key={s.label}>
                <div className="stakeholder-logo-img">
                  {Icon ? <Icon size={24} strokeWidth={2.25} /> : null}
                </div>
                <span>{s.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}