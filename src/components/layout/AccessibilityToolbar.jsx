import { useAccessibility } from '../../context/AccessibilityContext.jsx'

export default function AccessibilityToolbar() {
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

  const decreaseFont = () => {
    if (fontSize > 70) setFontSize(fontSize - 10)
  }
  const increaseFont = () => {
    if (fontSize < 150) setFontSize(fontSize + 10)
  }

  return (
    <div className="access-toolbar" role="toolbar" aria-label="Accessibility tools">
      <button
        className={`access-btn ${highContrast ? 'active' : ''}`}
        onClick={() => setHighContrast(!highContrast)}
        aria-label="Toggle high contrast mode"
        aria-pressed={highContrast}
        title="High contrast mode"
      >
        <i className="fas fa-adjust" aria-hidden="true"></i>
      </button>

      <div className="font-size-group" role="group" aria-label="Text size adjustment">
        <button
          className="access-btn"
          onClick={decreaseFont}
          aria-label="Decrease text size"
          title="Decrease text size"
        >
          <i className="fas fa-minus" aria-hidden="true"></i>
        </button>
        <button
          className="access-btn"
          onClick={() => setFontSize(100)}
          aria-label="Reset text size"
          title="Reset text size"
        >
          <i className="fas fa-undo-alt" aria-hidden="true"></i>
        </button>
        <button
          className="access-btn"
          onClick={increaseFont}
          aria-label="Increase text size"
          title="Increase text size"
        >
          <i className="fas fa-plus" aria-hidden="true"></i>
        </button>
      </div>

      <div className="toolbar-divider" aria-hidden="true"></div>

      <button
        className={`access-btn ${dyslexia ? 'active' : ''}`}
        onClick={() => setDyslexia(!dyslexia)}
        aria-label="Toggle dyslexia-friendly font"
        aria-pressed={dyslexia}
        title="Dyslexia-friendly font"
      >
        <i className="fas fa-font" aria-hidden="true"></i>
      </button>
      <button
        className={`access-btn ${letterSpacing ? 'active' : ''}`}
        onClick={() => setLetterSpacing(!letterSpacing)}
        aria-label="Toggle increased letter spacing"
        aria-pressed={letterSpacing}
        title="Increased letter spacing"
      >
        <i className="fas fa-text-width" aria-hidden="true"></i>
      </button>
      <button
        className={`access-btn ${highlightLinks ? 'active' : ''}`}
        onClick={() => setHighlightLinks(!highlightLinks)}
        aria-label="Toggle link highlighting"
        aria-pressed={highlightLinks}
        title="Highlight links"
      >
        <i className="fas fa-link" aria-hidden="true"></i>
      </button>
      <button
        className={`access-btn ${largeCursor ? 'active' : ''}`}
        onClick={() => setLargeCursor(!largeCursor)}
        aria-label="Toggle large cursor"
        aria-pressed={largeCursor}
        title="Large cursor"
      >
        <i className="fas fa-mouse-pointer" aria-hidden="true"></i>
      </button>
    </div>
  )
}