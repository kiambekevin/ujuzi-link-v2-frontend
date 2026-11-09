import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { roleHome } from "../context/AuthContext";

const OPPORTUNITY_TYPES = [
  ["fa-graduation-cap", "Apprenticeship", "Structured training with a skilled employer while you earn."],
  ["fa-briefcase", "Internship", "Gain hands-on professional experience in your field."],
  ["fa-industry", "Industrial Attachment", "Fulfil your coursework with real industry exposure."],
  ["fa-scale-balanced", "Pupillage", "Practical legal training for aspiring advocates."],
  ["fa-hands-holding-heart", "Community Service", "Serve your community while building skills."],
  ["fa-hand-holding-heart", "Volunteer", "Contribute to causes and grow your network."],
  ["fa-building", "Industry Visit", "See how organisations operate from the inside."],
  ["fa-user-tie", "Job Shadowing", "Follow a professional through their working day."],
  ["fa-lightbulb", "Other Work-Based Learning", "Approved learning opportunities of every kind."],
];

const STEPS = [
  ["fa-id-card", "Create your profile", "Register in minutes, verify with a one-time code, and build a rich profile of your education, skills and documents."],
  ["fa-wand-magic-sparkles", "Get matched", "Our smart matching recommends opportunities that fit your skills, location and career goals — and tells you exactly why."],
  ["fa-passport", "Learn, work & grow", "Apply, get placed, and build a verified Digital Learning Passport you can share with any future employer."],
];

function LandingNav() {
  return (
    <header
      style={{
        background: "linear-gradient(180deg, rgba(46,0,87,0.96), rgba(46,0,87,0.88))",
        backdropFilter: "blur(8px)",
        color: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 60,
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", gap: 28, padding: "16px 24px" }}>
        <a href="#top" style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff", fontWeight: 800, fontFamily: "var(--font-heading)", fontSize: "1.15rem" }}>
          <span className="logo-mark" style={{ width: 36, height: 36, borderRadius: 11, background: "linear-gradient(135deg, var(--primary-light), var(--accent))", display: "flex", alignItems: "center", justifyContent: "center" }}>U</span>
          Ujuzi Link
        </a>
        <nav style={{ display: "flex", gap: 22, fontSize: "0.92rem", marginLeft: "auto" }} className="hide-sm">
          <a href="#how" style={{ color: "#cfc3e8" }}>How it works</a>
          <a href="#types" style={{ color: "#cfc3e8" }}>Opportunities</a>
          <a href="#employers" style={{ color: "#cfc3e8" }}>For employers</a>
          <a href="#about" style={{ color: "#cfc3e8" }}>About</a>
        </nav>
        <div className="row" style={{ marginLeft: "auto" }}>
          <Link to="/login" className="btn btn-outline btn-sm" style={{ background: "transparent", color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}>
            Sign in
          </Link>
          <Link to="/register" className="btn btn-accent btn-sm">Get started</Link>
        </div>
      </div>
    </header>
  );
}

export default function Landing() {
  const { user } = useAuth();

  return (
    <div id="top" style={{ background: "#fff" }}>
      <LandingNav />
      <style>{`
        .hide-sm nav { display: flex; }
        @media (max-width: 760px) { .hide-sm { display: none !important; } }
        .hero { background: linear-gradient(165deg, #2e0057 0%, #4b0082 55%, #9333ea 120%); color: #fff; position: relative; overflow: hidden; }
        .hero::before { content: ""; position: absolute; inset: 0; background: radial-gradient(700px 420px at 85% -10%, rgba(192,132,252,0.35), transparent 60%), radial-gradient(600px 380px at -10% 110%, rgba(147,51,234,0.3), transparent 55%); }
        .hero .container { position: relative; padding-top: 88px; padding-bottom: 96px; }
        .hero h1 { font-size: clamp(2.2rem, 5vw, 3.6rem); line-height: 1.08; max-width: 760px; margin: 0 auto 18px; text-align: center; }
        .hero p.sub { max-width: 620px; margin: 0 auto 34px; text-align: center; color: #e6d9f7; font-size: 1.08rem; }
        .hero-search { max-width: 640px; margin: 0 auto 18px; display: flex; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 24px 60px rgba(0,0,0,0.35); }
        .hero-search input { flex: 1; border: none; padding: 16px 20px; font-size: 1rem; outline: none; color: var(--text-dark); }
        .hero-search button { border: none; background: linear-gradient(135deg, var(--primary), var(--accent-dark)); color: #fff; padding: 0 26px; font-weight: 700; }
        .hero-stats { display: flex; justify-content: center; gap: 48px; flex-wrap: wrap; margin-top: 52px; }
        .hero-stat { text-align: center; }
        .hero-stat b { font-family: var(--font-heading); font-size: 2rem; display: block; background: linear-gradient(135deg, #fff, var(--accent-light)); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .hero-stat span { color: #cfc3e8; font-size: 0.85rem; }
        .type-card { padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-light); background: #fff; transition: all 0.2s; }
        .type-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: var(--accent-light); }
        .type-card .icon { width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, var(--primary-soft), #f3e8ff); color: var(--accent-dark); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; margin-bottom: 14px; }
        .step-num { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--accent-dark)); color: #fff; display: flex; align-items: center; justify-content: center; font-family: var(--font-heading); font-weight: 800; font-size: 1.3rem; margin-bottom: 16px; }
        .cta-box { background: linear-gradient(135deg, var(--primary-dark), var(--primary-light)); border-radius: var(--radius-lg); padding: 56px 40px; color: #fff; text-align: center; position: relative; overflow: hidden; }
        .cta-box::after { content: ""; position: absolute; inset: 0; background: radial-gradient(500px 300px at 90% 0%, rgba(192,132,252,0.35), transparent 60%); }
        .cta-box > * { position: relative; }
        footer { background: #1a0a2e; color: #b9a8d8; padding: 48px 24px 28px; font-size: 0.88rem; }
        footer h5 { color: #fff; margin-bottom: 12px; font-size: 0.95rem; }
        footer a { color: #b9a8d8; display: block; margin-bottom: 8px; }
        footer a:hover { color: var(--accent-light); }
      `}</style>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <span className="badge badge-purple" style={{ display: "table", margin: "0 auto 20px", background: "rgba(192,132,252,0.18)", color: "#d8b4fe", fontSize: "0.8rem", padding: "7px 16px" }}>
            <i className="fas fa-flag" /> Kenya's National Work-Based Learning Platform
          </span>
          <h1>
            Where skills meet <span style={{ background: "linear-gradient(135deg, #c084fc, #d8b4fe)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>opportunity.</span>
          </h1>
          <p className="sub">
            Ujuzi Link connects young Kenyans with verified employers offering apprenticeships, internships,
            attachments, pupillage and more — with smart matching that explains why each opportunity fits you.
          </p>
          <div className="hero-search">
            <i className="fas fa-magnifying-glass" style={{ alignSelf: "center", marginLeft: 20, color: "var(--text-muted)" }} />
            <input placeholder="Job title, skill, or keyword..." aria-label="Search opportunities" readOnly />
            <Link to={user ? roleHome(user) : "/register"} style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
              <button style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <i className="fas fa-search" /> Search
              </button>
            </Link>
          </div>
          <div className="row" style={{ justifyContent: "center", flexWrap: "wrap" }}>
            {["Apprenticeship", "Internship", "Attachment", "Pupillage", "Volunteer"].map((c) => (
              <span key={c} className="chip" style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.25)", color: "#e6d9f7" }}>{c}</span>
            ))}
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><b>9</b><span>Work-based learning types</span></div>
            <div className="hero-stat"><b>47</b><span>Counties covered</span></div>
            <div className="hero-stat"><b>100%</b><span>Verified employers</span></div>
          </div>
        </div>
      </section>

      {/* Opportunity types */}
      <section id="types" style={{ padding: "80px 0", background: "var(--soft-bg)" }}>
        <div className="container">
          <h2 style={{ textAlign: "center", fontSize: "1.9rem" }}>Every path to <span className="gradient-text">experience</span></h2>
          <p className="muted" style={{ textAlign: "center", maxWidth: 620, margin: "10px auto 44px" }}>
            Nine nationally recognised work-based learning opportunity types, all in one place.
          </p>
          <div className="grid grid-3">
            {OPPORTUNITY_TYPES.map(([icon, title, text]) => (
              <div key={title} className="type-card">
                <div className="icon"><i className={`fas ${icon}`} /></div>
                <h4 style={{ marginBottom: 6 }}>{title}</h4>
                <p className="small muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: "80px 0", background: "#fff" }}>
        <div className="container">
          <h2 style={{ textAlign: "center", fontSize: "1.9rem" }}>How it works: <span className="gradient-text">3 simple steps</span></h2>
          <p className="muted" style={{ textAlign: "center", margin: "10px auto 48px", maxWidth: 560 }}>
            From registration to a verified record of everything you've learned and achieved.
          </p>
          <div className="grid grid-3">
            {STEPS.map(([icon, title, text], i) => (
              <div key={title} className="card card-pad card-lg card-hover" style={{ textAlign: "center" }}>
                <div className="step-num" style={{ margin: "0 auto 16px" }}>{i + 1}</div>
                <div style={{ color: "var(--accent-dark)", fontSize: "1.4rem", marginBottom: 10 }}><i className={`fas ${icon}`} /></div>
                <h4 style={{ marginBottom: 8 }}>{title}</h4>
                <p className="small muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For employers / job seekers */}
      <section id="employers" style={{ padding: "80px 0", background: "var(--soft-bg)" }}>
        <div className="container grid grid-2">
          <div className="card card-lg card-pad" style={{ background: "linear-gradient(135deg, #fff, #faf5ff)" }}>
            <div className="row mb-16">
              <span className="avatar" style={{ width: 52, height: 52, fontSize: "1.25rem" }}><i className="fas fa-building" /></span>
              <div>
                <h3>For employers</h3>
                <p className="small muted">Advertise verified opportunities to the right trainee.</p>
              </div>
            </div>
            <ul className="match-reasons">
              <li><i className="fas fa-check" /> Register once and get an official verified badge</li>
              <li><i className="fas fa-check" /> Advertise all 9 opportunity types with capacity limits</li>
              <li><i className="fas fa-check" /> Shortlist, interview and offer — all in one workflow</li>
              <li><i className="fas fa-check" /> Manage placements, supervisors and assessments</li>
            </ul>
            <Link to="/register?type=organization" className="btn btn-primary mt-24"><i className="fas fa-arrow-right" /> Advertise opportunities</Link>
          </div>
          <div className="card card-lg card-pad" style={{ background: "linear-gradient(135deg, #fff, #faf5ff)" }}>
            <div className="row mb-16">
              <span className="avatar" style={{ width: 52, height: 52, fontSize: "1.25rem" }}><i className="fas fa-user-graduate" /></span>
              <div>
                <h3>For job seekers</h3>
                <p className="small muted">Find placements that match your skills and goals.</p>
              </div>
            </div>
            <ul className="match-reasons">
              <li><i className="fas fa-check" /> Verified profile with education, skills and documents</li>
              <li><i className="fas fa-check" /> Recommendations with clear reasons for every match</li>
              <li><i className="fas fa-check" /> Track every application and offer in one place</li>
              <li><i className="fas fa-check" /> Build a shareable Digital Learning Passport</li>
            </ul>
            <Link to="/register" className="btn btn-accent mt-24"><i className="fas fa-arrow-right" /> Create your profile</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about" style={{ padding: "80px 0 90px", background: "#fff" }}>
        <div className="container">
          <div className="cta-box">
            <h2 style={{ fontSize: "2rem", marginBottom: 10 }}>Ready to bridge the gap?</h2>
            <p style={{ color: "#e6d9f7", maxWidth: 520, margin: "0 auto 28px" }}>
              Join Kenya's national platform connecting trainee, employers and learning institutions.
            </p>
            <div className="row" style={{ justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/register?type=organization" className="btn btn-accent btn-lg"><i className="fas fa-users" /> Find talent</Link>
              <Link to="/register" className="btn btn-lg" style={{ background: "#fff", color: "var(--primary-dark)" }}><i className="fas fa-briefcase" /> Find work</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container grid grid-4" style={{ gap: 32 }}>
          <div>
            <div className="row mb-8" style={{ color: "#fff", fontFamily: "var(--font-heading)", fontWeight: 800 }}>
              <span className="logo-mark" style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg, var(--primary-light), var(--accent))", display: "flex", alignItems: "center", justifyContent: "center" }}>U</span>
              Ujuzi Link
            </div>
            <p className="tiny">Kenya's national work-based learning platform under the Ministry of Labour and Social Protection.</p>
          </div>
          <div>
            <h5>Platform</h5>
            <a href="#how">How it works</a>
            <a href="#types">Opportunity types</a>
            <Link to="/register">Join as a job seeker</Link>
            <Link to="/register?type=organization">Join as an employer</Link>
          </div>
          <div>
            <h5>Resources</h5>
            <a href="#about">About the programme</a>
            <a href="#employers">For employers</a>
            <a href="#how">For job seekers</a>
            <Link to="/login">Sign in</Link>
          </div>
          <div>
            <h5>Contact</h5>
            <a href="https://ujuzilink.go.ke" target="_blank" rel="noreferrer"><i className="fas fa-globe" style={{ marginRight: 6 }} /> ujuzilink.go.ke</a>
            <a href="mailto:support@ujuzilink.go.ke"><i className="fas fa-envelope" style={{ marginRight: 6 }} /> support@ujuzilink.go.ke</a>
            <div className="row mt-8">
              <a href="#top" aria-label="LinkedIn" style={{ fontSize: "1.1rem", marginRight: 12 }}><i className="fab fa-linkedin" /></a>
              <a href="#top" aria-label="X" style={{ fontSize: "1.1rem", marginRight: 12 }}><i className="fab fa-x-twitter" /></a>
              <a href="#top" aria-label="Facebook" style={{ fontSize: "1.1rem" }}><i className="fab fa-facebook" /></a>
            </div>
          </div>
        </div>
        <div className="container" style={{ borderTop: "1px solid rgba(255,255,255,0.12)", marginTop: 36, paddingTop: 20, textAlign: "center" }}>
          <span className="tiny">© {new Date().getFullYear()} Ujuzi Link — Ministry of Labour and Social Protection, Republic of Kenya. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
