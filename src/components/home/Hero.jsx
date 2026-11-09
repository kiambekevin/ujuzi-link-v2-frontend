// src/components/home/Hero.jsx
import { Link } from 'react-router-dom'
import { CheckCircle2, Link2, Route, Zap } from 'lucide-react'
import { heroStats, visualList } from '../../data/homeData.js'

export default function Hero({ onFindPlacement }) {
  return (
    <header className="hero" id="main-content">
      <div className="container hero-grid">
        <div>
          <span className="hero-badge">
            <Link2 size={14} strokeWidth={2.5} aria-hidden="true" />
            Connecting training to employment
          </span>
          <h1>
            Where skills meet <span>opportunity</span>.
          </h1>
          <p className="hero-description">
            Ujuzi Link is the national digital platform for industrial attachment, internship,
            apprenticeship and dual-training placements - bridging TVET trainees, verified
            employers and training institutions across Kenya.
          </p>
        </div>
        <div className="hero-visual">
          <div className="visual-header">
            <Zap size={18} strokeWidth={2.5} aria-hidden="true" />
            <h3>Placement lifecycle</h3>
          </div>
          <ul className="visual-list">
            {visualList.map((item) => (
              <li key={item}>
                <CheckCircle2 size={14} strokeWidth={2.5} aria-hidden="true" /> {item}
              </li>
            ))}
          </ul>
          <div className="visual-cta">
            <Link to="/opportunities" className="btn btn-outline-light">
              <Route size={16} strokeWidth={2.5} aria-hidden="true" /> Explore opportunities
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}