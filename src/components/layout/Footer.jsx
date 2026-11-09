import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo" style={{ marginBottom: '0.5rem' }}>
              <div
                className="logo-icon"
                style={{ width: 42, height: 42, fontSize: '1.3rem' }}
              >
                <i className="fas fa-graduation-cap" aria-hidden="true"></i>
              </div>
              <div className="logo-text" style={{ fontSize: '1.3rem' }}>
                Ujuzi Link{' '}
                <span style={{ fontSize: '0.65rem' }}>National TVET Work-Based Learning</span>
              </div>
            </div>
            <p>
              A national digital platform proposed by the State Department for Labour and Skills
              Development, in collaboration with TVET stakeholders.
            </p>
          </div>
          
          <div className="footer-links">
            <h4>Platform</h4>
            <ul>
              <li>
                <Link to="/about">About the platform</Link>
              </li>
              <li>
                <Link to="/opportunities">Browse opportunities</Link>
              </li>
              <li>
                <Link to="/labour-market">Labour market explorer</Link>
              </li>
              <li>
                <Link to="/career-guidance">Career guidance</Link>
              </li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Support</h4>
            <ul>
              <li>
                <Link to="/faq">Help & FAQs</Link>
              </li>
              <li>
                <Link to="/login">Sign in</Link>
              </li>
              <li>
                <Link to="/register">Create an account</Link>
              </li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Contact</h4>
            <ul>
              <li>
                <a href="mailto:info@ujizilink.go.ke">
                  <i className="fas fa-envelope" style={{ marginRight: '0.6rem' }} aria-hidden="true"></i>{' '}
                  info@ujizilink.go.ke
                </a>
              </li>
              <li>
                <a href="tel:+254200000000">
                  <i className="fas fa-phone-alt" style={{ marginRight: '0.6rem' }} aria-hidden="true"></i>{' '}
                  +254 20 000 0000
                </a>
              </li>
              <li>
                <span style={{ color: 'inherit', fontSize: '0.88rem' }}>
                  <i className="fas fa-map-pin" style={{ marginRight: '0.6rem' }} aria-hidden="true"></i>{' '}
                  Nairobi, Kenya
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <span>
            © 2026 Ministry of Labour and Social Protection. All rights reserved.
          </span>
          <span style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}