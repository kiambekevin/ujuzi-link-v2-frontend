// src/components/home/Hero.jsx
import { Link } from 'react-router-dom'
import { heroStats, visualList } from '../../data/homeData.js'

export default function Hero({ onFindPlacement }) {
  return (
    <header className="hero" id="main-content">
      <div className="container hero-grid">
        <div>
          <span className="hero-badge">
            <i className="fas fa-link" aria-hidden="true"></i> Connecting training to employment
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
            <i className="fas fa-bolt" aria-hidden="true"></i>
            <h3>Placement lifecycle</h3>
          </div>
          <ul className="visual-list">
            {visualList.map((item) => (
              <li key={item}>
                <i className="fas fa-check-circle" aria-hidden="true"></i> {item}
              </li>
            ))}
          </ul>
          <div className="visual-cta">
            <Link to="/opportunities" className="btn btn-outline-light">
              <i className="fas fa-route" aria-hidden="true"></i> Explore opportunities
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}