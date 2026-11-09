import { objectives } from '../../data/homeData.js'

export default function Objectives() {
  return (
    <section className="alt-bg">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-label">Why Ujuzi Link</div>
            <h2>
              <i className="fas fa-bullseye" aria-hidden="true"></i> A national coordination platform
            </h2>
            <p>
              Designed to strengthen the transition from training to productive employment through
              structured workplace learning.
            </p>
          </div>
        </div>
        <div className="grid-3">
          {objectives.map((obj) => (
            <div className="card" key={obj.title}>
              <div className="card-icon">
                <i className={`fas ${obj.icon}`} aria-hidden="true"></i>
              </div>
              <h3>{obj.title}</h3>
              <p>{obj.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}