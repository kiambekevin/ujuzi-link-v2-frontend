import { useEffect, useRef, useState } from 'react'
import AccessibilityPopup from './AccessibilityPopup.jsx'
import ujuziLogo from '../../assets/images/ujuzink.png';

export default function BrandRow({ onSearchClick }) {
  const [a11yOpen, setA11yOpen] = useState(false)
  const [language, setLanguage] = useState('en')
  const [swNotice, setSwNotice] = useState(false)
  const a11yRef = useRef(null)
  const swTimer = useRef(null)

  // Close accessibility popup when clicking outside
  useEffect(() => {
    if (!a11yOpen) return

    const handleClickOutside = (e) => {
      if (a11yRef.current && !a11yRef.current.contains(e.target)) {
        setA11yOpen(false)
      }
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') setA11yOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [a11yOpen])

  // Auto-dismiss the Kiswahili notice
  useEffect(() => {
    if (!swNotice) return
    clearTimeout(swTimer.current)
    swTimer.current = setTimeout(() => setSwNotice(false), 4500)
    return () => clearTimeout(swTimer.current)
  }, [swNotice])

  const handleLanguageChange = (e) => {
    const value = e.target.value
    if (value === 'sw') {
      // Revert selection and surface a "coming soon" notice
      setLanguage('en')
      setSwNotice(true)
      return
    }
    setLanguage(value)
  }

  return (
    <div className="brand-row">
      <div className="container">
        <div className="logo">
          <div>
            <img src={ujuziLogo} width="75" height="75" alt="Ujuzi Link logo" />
          </div>
          <div className="logo-text">
            Ujuzi Link
            <span>National TVET Work-Based Learning</span>
          </div>
        </div>

        
      </div>

      {/* Kiswahili "coming soon" notice */}
      {swNotice && (
        <div
          className="brand-toast"
          role="status"
          aria-live="polite"
        >
          <i className="fas fa-circle-info" aria-hidden="true"></i>
          <span>
            <strong>Kiswahili is coming soon.</strong> The interface is only
            available in English at the moment - we'll let you know when it's
            ready.
          </span>
          <button
            type="button"
            className="brand-toast-close"
            onClick={() => setSwNotice(false)}
            aria-label="Dismiss notice"
          >
            <i className="fas fa-times" aria-hidden="true"></i>
          </button>
        </div>
      )}
    </div>
  )
}