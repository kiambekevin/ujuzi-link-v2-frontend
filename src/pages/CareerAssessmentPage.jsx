import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TopBar from '../components/layout/TopBar.jsx'
import BrandRow from '../components/layout/BrandRow.jsx'
import MainNav from '../components/layout/MainNav.jsx'
import Footer from '../components/layout/Footer.jsx'
import { QUESTIONS, PATHWAYS } from '../data/careerAssessmentData.js'
import '../styles/home.css'
import '../styles/career-assessment.css'

const TOTAL = QUESTIONS.length

export default function CareerAssessmentPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0) // 0..TOTAL-1, then TOTAL for results
  const [answers, setAnswers] = useState({}) // { q1: 1, q2: 0, ... }
  const [finished, setFinished] = useState(false)

  const selectAnswer = (answerIdx) => {
    setAnswers(prev => ({ ...prev, [QUESTIONS[step].id]: answerIdx }))
  }

  const goNext = () => {
    if (answers[QUESTIONS[step].id] === undefined) {
      window.alert('Please choose an answer before continuing.')
      return
    }
    if (step + 1 < TOTAL) {
      setStep(step + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setFinished(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goPrev = () => {
    if (step > 0) {
      setStep(step - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const restart = () => {
    setAnswers({})
    setStep(0)
    setFinished(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Compute pathway scores
  const scores = useMemo(() => {
    const totals = Object.fromEntries(
      Object.keys(PATHWAYS).map(k => [k, 0])
    )
    Object.entries(answers).forEach(([qid, idx]) => {
      const q = QUESTIONS.find(x => x.id === qid)
      if (!q) return
      const answer = q.answers[idx]
      if (!answer) return
      Object.entries(answer.scores).forEach(([k, pts]) => {
        totals[k] = (totals[k] || 0) + pts
      })
    })
    return totals
  }, [answers])

  // Sorted results
  const ranked = useMemo(() => {
    const max = Math.max(1, ...Object.values(scores))
    return Object.entries(scores)
      .map(([key, raw]) => ({ key, raw, pct: Math.round((raw / max) * 100) }))
      .sort((a, b) => b.raw - a.raw)
  }, [scores])

  const progressPct = finished ? 100 : Math.round(((step) / TOTAL) * 100)

  // ===== RESULTS VIEW =====
  if (finished) {
    const top = ranked.slice(0, 3)
    return (
      <>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <TopBar />
        <BrandRow />
        <MainNav />

        <header className="page-header" id="main-content">
          <div className="container">
            <div className="breadcrumb">
              <Link to="/">Home</Link>
              <i className="fas fa-chevron-right"></i>
              <Link to="/career-guidance">Career guidance</Link>
              <i className="fas fa-chevron-right"></i>
              <span>Self-assessment results</span>
            </div>
            <h1>Your career match results</h1>
            <p className="header-sub">
              Based on your answers, here are the occupational pathways that best align with your interests, strengths and ambitions.
            </p>
          </div>
        </header>

        <div className="page-body">
          <div className="container">
            <div className="results-grid">
              {top.map((r, i) => {
                const p = PATHWAYS[r.key]
                return (
                  <div className={`result-card ${i === 0 ? 'top-match' : ''}`} key={r.key}>
                    {i === 0 && (
                      <span className="top-ribbon">
                        <i className="fas fa-crown"></i> Best match
                      </span>
                    )}
                    <div className="result-top">
                      <div className={`pw-icon ${p.color}`}>
                        <i className={`fas ${p.icon}`}></i>
                      </div>
                      <div>
                        <div className="result-label">{p.demand}</div>
                        <h3>{p.label}</h3>
                      </div>
                    </div>
                    <div className="result-bar">
                      <div className="result-bar-fill" style={{ width: `${r.pct}%` }}></div>
                    </div>
                    <div className="result-percent">{r.pct}% match</div>
                    <p className="result-desc">{p.description}</p>
                    <div className="result-roles">
                      {p.roles.map(role => (
                        <span key={role} className="pw-role">{role}</span>
                      ))}
                    </div>
                    <div className="result-footer">
                      <span className="pw-salary">
                        <i className="fas fa-money-bill-wave"></i> <strong>{p.salary}</strong>
                      </span>
                      <Link
                        to="/opportunities"
                        className="btn btn-primary btn-sm"
                      >
                        Explore opportunities <i className="fas fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="results-actions">
              <button className="btn btn-outline" onClick={restart}>
                <i className="fas fa-undo"></i> Retake assessment
              </button>
              <Link to="/career-guidance" className="btn btn-ghost">
                <i className="fas fa-arrow-left"></i> Back to career guidance
              </Link>
              <Link to="/cv-builder" className="btn btn-accent">
                <i className="fas fa-file-signature"></i> Build my CV
              </Link>
            </div>

            <div className="results-note">
              <i className="fas fa-info-circle"></i>
              <p>
                <strong>Remember:</strong> this assessment is a guide, not a final decision. Your interests, opportunities and circumstances change over time. Combine these results with your own reflection, conversations with career advisers, and real-world experience through placements.
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </>
    )
  }

  // ===== QUESTION VIEW =====
  const q = QUESTIONS[step]
  const chosen = answers[q.id]

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <TopBar />
      <BrandRow />
      <MainNav />

      <header className="page-header" id="main-content">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <i className="fas fa-chevron-right"></i>
            <Link to="/career-guidance">Career guidance</Link>
            <i className="fas fa-chevron-right"></i>
            <span>Career self-assessment</span>
          </div>
          <h1>Career self-assessment</h1>
          <p className="header-sub">
            Answer {TOTAL} short questions about your interests, strengths and ambitions. We'll suggest the career pathways that fit you best.
          </p>
        </div>
      </header>

      <div className="page-body">
        <div className="container">
          <div className="assessment-layout">
            
            {/* Sidebar (progress + info) */}
            <aside className="assessment-side">
              <div className="progress-card">
                <div className="progress-header">
                  <span className="progress-label">Progress</span>
                  <span className="progress-number">{step + 1} / {TOTAL}</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progressPct}%` }}></div>
                </div>
                <p className="progress-note">
                  <i className="fas fa-lightbulb"></i> Be honest - there are no right or wrong answers.
                </p>
              </div>

              <div className="assessment-tips">
                <h3><i className="fas fa-compass"></i> How this works</h3>
                <ul>
                  <li><i className="fas fa-check-circle"></i> Choose the answer that feels most like you</li>
                  <li><i className="fas fa-check-circle"></i> Take your time - no time limit</li>
                  <li><i className="fas fa-check-circle"></i> Your answers stay private to this session</li>
                  <li><i className="fas fa-check-circle"></i> You can go back and change answers</li>
                </ul>
              </div>
            </aside>

            {/* Main question card */}
            <div className="assessment-main">
              <div className="question-card">
                <div className="question-step">Question {step + 1} of {TOTAL}</div>
                <h2 className="question-text">{q.question}</h2>
                {q.help && <p className="question-help">{q.help}</p>}

                <div className="answers-list">
                  {q.answers.map((a, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`answer-option ${chosen === idx ? 'selected' : ''}`}
                      onClick={() => selectAnswer(idx)}
                    >
                      <span className="answer-letter">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="answer-text">{a.text}</span>
                      {chosen === idx && (
                        <span className="answer-check">
                          <i className="fas fa-check-circle"></i>
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="question-nav">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={goPrev}
                    disabled={step === 0}
                  >
                    <i className="fas fa-arrow-left"></i> Previous
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={goNext}
                    disabled={chosen === undefined}
                  >
                    {step === TOTAL - 1 ? 'See my results' : 'Next question'} <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}