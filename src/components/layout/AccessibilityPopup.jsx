import { useEffect, useRef } from 'react'
import { useAccessibility } from '../../context/AccessibilityContext.jsx'

export default function AccessibilityPopup({ onClose }) {
  const {
    highContrast,
    setHighContrast,
    fontSize,
    setFontSize,
    dyslexia,
    setDyslexia,
    letterSpacing,
    setLetterSpacing,
    highlightLinks,
    setHighlightLinks,
    largeCursor,
    setLargeCursor
  } = useAccessibility()

  const popupRef = useRef(null)

  // Focus first control when opened
  useEffect(() => {
    const first = popupRef.current?.querySelector('button, select')
    first?.focus()
  }, [])

  const decreaseFont = () => {
    if (fontSize > 70) setFontSize(fontSize - 10)
  }
  const increaseFont = () => {
    if (fontSize < 150) setFontSize(fontSize + 10)
  }

  return (
    <div
      className="a11y-popup"
      ref={popupRef}
      role="dialog"
      aria-modal="false"
      aria-label="Accessibility options"
    >
      <div className="a11y-popup-header">
        <span className="a11y-popup-title">
          <i className="fas fa-universal-access" aria-hidden="true"></i>
          Accessibility options
        </span>
        <button
          type="button"
          className="a11y-popup-close"
          onClick={onClose}
          aria-label="Close accessibility options"
        >
          <i className="fas fa-times" aria-hidden="true"></i>
        </button>
      </div>

      <div className="a11y-popup-body">
        {/* Contrast */}
        <div className="a11y-row">
          <div className="a11y-row-info">
            <span className="a11y-row-label">
              <i className="fas fa-adjust" aria-hidden="true"></i> High contrast
            </span>
            <span className="a11y-row-hint">Improve readability with a dark theme.</span>
          </div>
          <button
            type="button"
            className={`a11y-switch ${highContrast ? 'on' : ''}`}
            role="switch"
            aria-checked={highContrast}
            onClick={() => setHighContrast(!highContrast)}
            aria-label="Toggle high contrast mode"
          >
            <span className="a11y-switch-knob" />
          </button>
        </div>

        {/* Text size */}
        <div className="a11y-row">
          <div className="a11y-row-info">
            <span className="a11y-row-label">
              <i className="fas fa-text-height" aria-hidden="true"></i> Text size
            </span>
            <span className="a11y-row-hint">
              Adjust the base font size ({fontSize}%).
            </span>
          </div>
          <div className="a11y-font-controls" role="group" aria-label="Text size">
            <button
              type="button"
              className="a11y-mini-btn"
              onClick={decreaseFont}
              aria-label="Decrease text size"
            >
              <i className="fas fa-minus" aria-hidden="true"></i>
            </button>
            <button
              type="button"
              className="a11y-mini-btn"
              onClick={() => setFontSize(100)}
              aria-label="Reset text size"
            >
              <i className="fas fa-undo-alt" aria-hidden="true"></i>
            </button>
            <button
              type="button"
              className="a11y-mini-btn"
              onClick={increaseFont}
              aria-label="Increase text size"
            >
              <i className="fas fa-plus" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        {/* Dyslexia font */}
        <div className="a11y-row">
          <div className="a11y-row-info">
            <span className="a11y-row-label">
              <i className="fas fa-font" aria-hidden="true"></i> Dyslexia-friendly font
            </span>
            <span className="a11y-row-hint">Use a more readable typeface.</span>
          </div>
          <button
            type="button"
            className={`a11y-switch ${dyslexia ? 'on' : ''}`}
            role="switch"
            aria-checked={dyslexia}
            onClick={() => setDyslexia(!dyslexia)}
            aria-label="Toggle dyslexia-friendly font"
          >
            <span className="a11y-switch-knob" />
          </button>
        </div>

        {/* Letter spacing */}
        <div className="a11y-row">
          <div className="a11y-row-info">
            <span className="a11y-row-label">
              <i className="fas fa-text-width" aria-hidden="true"></i> Increased spacing
            </span>
            <span className="a11y-row-hint">Add space between letters and words.</span>
          </div>
          <button
            type="button"
            className={`a11y-switch ${letterSpacing ? 'on' : ''}`}
            role="switch"
            aria-checked={letterSpacing}
            onClick={() => setLetterSpacing(!letterSpacing)}
            aria-label="Toggle increased letter spacing"
          >
            <span className="a11y-switch-knob" />
          </button>
        </div>

        {/* Highlight links */}
        <div className="a11y-row">
          <div className="a11y-row-info">
            <span className="a11y-row-label">
              <i className="fas fa-link" aria-hidden="true"></i> Highlight links
            </span>
            <span className="a11y-row-hint">Make links easier to spot.</span>
          </div>
          <button
            type="button"
            className={`a11y-switch ${highlightLinks ? 'on' : ''}`}
            role="switch"
            aria-checked={highlightLinks}
            onClick={() => setHighlightLinks(!highlightLinks)}
            aria-label="Toggle link highlighting"
          >
            <span className="a11y-switch-knob" />
          </button>
        </div>

        {/* Large cursor */}
        <div className="a11y-row">
          <div className="a11y-row-info">
            <span className="a11y-row-label">
              <i className="fas fa-mouse-pointer" aria-hidden="true"></i> Large cursor
            </span>
            <span className="a11y-row-hint">Use a larger custom pointer.</span>
          </div>
          <button
            type="button"
            className={`a11y-switch ${largeCursor ? 'on' : ''}`}
            role="switch"
            aria-checked={largeCursor}
            onClick={() => setLargeCursor(!largeCursor)}
            aria-label="Toggle large cursor"
          >
            <span className="a11y-switch-knob" />
          </button>
        </div>
      </div>

      <div className="a11y-popup-footer">
        <button
          type="button"
          className="a11y-reset-btn"
          onClick={() => {
            setHighContrast(false)
            setFontSize(100)
            setDyslexia(false)
            setLetterSpacing(false)
            setHighlightLinks(false)
            setLargeCursor(false)
          }}
        >
          <i className="fas fa-redo" aria-hidden="true"></i> Reset all
        </button>
        <span className="a11y-popup-hint">
          Settings are saved on this device.
        </span>
      </div>
    </div>
  )
}