import { createContext, useContext, useState, useEffect } from 'react'

const AccessibilityContext = createContext(null)

export function AccessibilityProvider({ children }) {
  const [highContrast, setHighContrast] = useState(
    () => localStorage.getItem('ujizi-high-contrast') === 'true'
  )
  const [fontSize, setFontSize] = useState(100)
  const [dyslexia, setDyslexia] = useState(false)
  const [letterSpacing, setLetterSpacing] = useState(false)
  const [highlightLinks, setHighlightLinks] = useState(false)
  const [largeCursor, setLargeCursor] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('high-contrast', highContrast)
    localStorage.setItem('ujizi-high-contrast', highContrast)
  }, [highContrast])

  useEffect(() => {
    document.documentElement.style.fontSize = fontSize + '%'
  }, [fontSize])

  useEffect(() => {
    document.body.style.fontFamily = dyslexia
      ? "'Comic Sans MS', 'Open Sans', 'Segoe UI', sans-serif"
      : "'Inter', system-ui, -apple-system, sans-serif"
  }, [dyslexia])

  useEffect(() => {
    document.body.style.letterSpacing = letterSpacing ? '0.08em' : ''
    document.body.style.wordSpacing = letterSpacing ? '0.15em' : ''
  }, [letterSpacing])

  useEffect(() => {
    const styleId = 'link-highlight-style'
    let style = document.getElementById(styleId)
    if (highlightLinks) {
      if (!style) {
        style = document.createElement('style')
        style.id = styleId
        style.textContent = `
          a:not(.btn):not(.logo):not(.mega-col a) {
            background: #C084FC !important;
            color: #2E0057 !important;
            padding: 0.1rem 0.3rem !important;
            border-radius: 3px !important;
            text-decoration: underline !important;
          }
        `
        document.head.appendChild(style)
      }
    } else if (style) {
      style.remove()
    }
  }, [highlightLinks])

  useEffect(() => {
    const cursor =
      'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'48\' height=\'48\' viewBox=\'0 0 48 48\'%3E%3Cpath d=\'M8 4 L8 40 L20 30 L32 44 L38 40 L26 26 L40 24 Z\' fill=\'%234B0082\' stroke=\'%23C084FC\' stroke-width=\'2\'/%3E%3C/svg%3E") 4 4, auto'
    document.body.style.cursor = largeCursor ? cursor : ''
    return () => {
      document.body.style.cursor = ''
    }
  }, [largeCursor])

  const value = {
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
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext)
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider')
  return ctx
}