// src/components/home/CTASection.jsx
import { Link } from 'react-router-dom'
import { Briefcase, GraduationCap } from 'lucide-react'

export default function CTASection() {
  return (
    <section style={{ paddingTop: '1rem' }}>
      <div className="container">
        <div className="cta-block">
          <div>
            <h2>Ready to bridge the gap?</h2>
            <p>
              Whether you are a trainee seeking hands‑on experience, an employer offering placement,
              or an institution supporting learners - Ujuzi Link connects you.
            </p>
          </div>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-light">
              <GraduationCap size={16} strokeWidth={2.5} aria-hidden="true" /> Join as trainee
            </Link>
            <Link to="/register" className="btn btn-outline-light">
              <Briefcase size={16} strokeWidth={2.5} aria-hidden="true" /> Join as employer
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}