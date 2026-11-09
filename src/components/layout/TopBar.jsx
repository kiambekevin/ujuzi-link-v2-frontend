// src/components/layout/TopBar.jsx
import gokLogo from '../../assets/images/gok.png' 

export default function TopBar() {
  return (
    <div className="top-bar">
      <div className="container">
        <div className="gov-brand">
          <img src={gokLogo} width="20" height="20" alt="" aria-hidden="true" />
          <span>
            Ministry of Labour and Social Protection - State Department for Labour and Skills Development
          </span>
        </div>
        <div>
          <a href="https://www.labour.go.ke" target="_blank" rel="noopener noreferrer">
            <i className="fas fa-external-link-alt" aria-hidden="true"></i> labour.go.ke
          </a>
        </div>
      </div>
    </div>
  )
}