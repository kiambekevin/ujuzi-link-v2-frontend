import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import TopBar from "../components/layout/TopBar.jsx";
import BrandRow from "../components/layout/BrandRow.jsx";
import MainNav from "../components/layout/MainNav.jsx";
import Footer from "../components/layout/Footer.jsx";
import SearchModal from "../components/ui/SearchModal.jsx";
import { api, errorMessage, isAuthenticated } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "../styles/home.css";
import "../styles/opportunity-details.css";
import "../styles/trainee-profile.css";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function text(v) {
  if (v == null) return "-";
  if (typeof v === "string") return v || "-";
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) {
    const parts = v.map(text).filter((x) => x && x !== "-");
    return parts.length ? parts.join(", ") : "-";
  }
  if (typeof v === "object") return v.name ?? v.title ?? v.label ?? v.code ?? "-";
  return String(v);
}

function initials(profile) {
  const f = profile?.first_name || "";
  const l = profile?.last_name || "";
  return (f.charAt(0) + l.charAt(0)).toUpperCase() || "?";
}

function fullName(profile) {
  if (!profile) return "Trainee";
  const parts = [profile.first_name, profile.middle_name, profile.last_name].filter(Boolean);
  return parts.join(" ") || profile.full_name || "Trainee";
}

function calculateAge(dob) {
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  const t = new Date();
  let a = t.getFullYear() - d.getFullYear();
  const m = t.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < d.getDate())) a -= 1;
  return a;
}

function fmtDate(iso) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch { return iso; }
}

function yearOf(iso) {
  return iso ? String(iso).slice(0, 4) : "-";
}

// All values must match the backend enums (apps/core/constants.py).
const COUNTIES = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu",
  "Garissa", "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho",
  "Kiambu", "Kilifi", "Kirinyaga", "Kisii", "Kisumu", "Kitui",
  "Kwale", "Laikipia", "Lamu", "Machakos", "Makueni", "Mandera",
  "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi",
  "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri",
  "Samburu", "Siaya", "Taita-Taveta", "Tana River", "Tharaka-Nithi",
  "Trans-Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot",
];
const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TraineeProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: me, refreshUser } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  const [trainee, setTrainee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [forbidden, setForbidden] = useState(false);

  const [editing, setEditing] = useState(false);

  // ---- Auth gate ---------------------------------------------------------
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(`/login?next=${encodeURIComponent(`/trainees/${id}`)}`, { replace: true });
    }
  }, [id, navigate]);

  // ---- Load profile based on viewer role ---------------------------------
  useEffect(() => {
    if (!isAuthenticated() || !me) return;
    let cancelled = false;

    setLoading(true);
    setError("");
    setForbidden(false);

    const load = async () => {
      if (me.role === "TRAINEE") {
        // No /trainees/{id}/ endpoint yet - a trainee can only view their own
        // profile via /profile/. So any trainee URL resolves to self.
        try {
          const { data } = await api.get("/profile/");
          const isSelf =
            String(data.user_id) === String(me.id) ||
            String(id) === String(me.id);
          if (isSelf) return data;
          if (!cancelled) setForbidden(true);
          return null;
        } catch (err) {
          if (!cancelled) setError(errorMessage(err, "Could not load your profile."));
          return null;
        }
      }

      if (me.role === "ADMIN") {
        try {
          const { data } = await api.get(`/admin/users/${id}/`);
          return data;
        } catch (err) {
          if (!cancelled) setError(errorMessage(err, "Unable to load trainee profile."));
          return null;
        }
      }

      if (me.role === "ORG_OFFICER" || me.role === "ORG_SUPERVISOR") {
        try {
          const { data } = await api.get(`/organizations/me/trainees/${id}/`);
          return data;
        } catch (err) {
          if (!cancelled) {
            if (err?.response?.status === 403) setForbidden(true);
            else setError("Trainee profile is not available yet.");
          }
          return null;
        }
      }

      if (!cancelled) setForbidden(true);
      return null;
    };

    load()
      .then((data) => { if (!cancelled) setTrainee(data) })
      .catch((err) => {
        if (!cancelled) setError(errorMessage(err, "Unable to load trainee profile."));
      })
      .finally(() => { if (!cancelled) setLoading(false) });

    return () => { cancelled = true };
  }, [id, me]);

  // ---- Derived ----------------------------------------------------------
  const age = useMemo(() => calculateAge(trainee?.date_of_birth), [trainee]);
  const name = fullName(trainee);
  const isOwn =
    me && trainee && (
      String(me.id) === String(trainee.user_id ?? trainee.id) ||
      me.role === "TRAINEE"
    );
  const canEdit = isOwn && me?.role === "TRAINEE";

  const skills = useMemo(() => {
    const arr = Array.isArray(trainee?.skills) ? trainee.skills : [];
    return arr.map((s) => ({
      id: s.id ?? `${s.skill}-${s.name}`,
      label: text(s.name ?? s.skill_name),
      category: text(s.category),
      proficiency: s.proficiency,
      years: s.years_of_experience,
    }));
  }, [trainee]);

  const education = useMemo(() => {
    const arr = Array.isArray(trainee?.education) ? trainee.education : [];
    return [...arr].sort((a, b) => new Date(b.end_date || 0) - new Date(a.end_date || 0));
  }, [trainee]);

  const experiences = useMemo(() => {
    const arr = Array.isArray(trainee?.work_experience) ? trainee.work_experience : [];
    return [...arr].sort((a, b) => new Date(b.start_date || 0) - new Date(a.start_date || 0));
  }, [trainee]);

  const documents = useMemo(
    () => (Array.isArray(trainee?.documents) ? trainee.documents : []),
    [trainee]
  );

  // ---- Save profile edits -----------------------------------------------
  const handleSaveProfile = useCallback(
    async (patch) => {
      // PATCH /api/profile/ - only fields in TraineeProfileWriteSerializer.
      const { data } = await api.patch("/profile/", patch);
      setTrainee(data);
      setEditing(false);
      // Refresh the auth context so the nav chip and dashboard see the
      // latest first_name / last_name / phone if the backend mirrors them.
      try { await refreshUser?.() } catch { /* non-fatal */ }
    },
    [refreshUser]
  );

  // ---- Render guards ----------------------------------------------------
  if (!isAuthenticated()) return null;

  if (loading) {
    return (
      <>
        <TopBar /><BrandRow onSearchClick={() => setSearchOpen(true)} /><MainNav />
        <div className="page-body">
          <div className="container">
            <div className="od-empty-state" style={{ marginTop: "4rem" }}>
              <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
              <h3>Loading trainee profile…</h3>
            </div>
          </div>
        </div>
        <Footer /><SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </>
    );
  }

  if (forbidden && !trainee) {
    return (
      <>
        <TopBar /><BrandRow onSearchClick={() => setSearchOpen(true)} /><MainNav />
        <div className="page-body">
          <div className="container">
            <div className="od-empty-state" style={{ marginTop: "4rem" }}>
              <i className="fas fa-lock" aria-hidden="true"></i>
              <h3>You can&apos;t view this profile</h3>
              <p>Trainee profiles are only visible to the trainee themselves and to employers who have received an application from them.</p>
              <button className="btn btn-primary" onClick={() => navigate("/")}>
                <i className="fas fa-arrow-left" aria-hidden="true"></i> Back to home
              </button>
            </div>
          </div>
        </div>
        <Footer /><SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </>
    );
  }

  if (error || !trainee) {
    return (
      <>
        <TopBar /><BrandRow onSearchClick={() => setSearchOpen(true)} /><MainNav />
        <div className="page-body">
          <div className="container">
            <div className="od-empty-state" style={{ marginTop: "4rem" }}>
              <i className="fas fa-user-slash" aria-hidden="true"></i>
              <h3>Trainee not found</h3>
              <p>{error || "The trainee you're looking for may have been removed or is no longer available."}</p>
              <button className="btn btn-primary" onClick={() => navigate("/")}>
                <i className="fas fa-arrow-left" aria-hidden="true"></i> Back to home
              </button>
            </div>
          </div>
        </div>
        <Footer /><SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </>
    );
  }

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <TopBar /><BrandRow onSearchClick={() => setSearchOpen(true)} /><MainNav />

      <header className="page-header profile-page-header" id="main-content">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <Link to="/trainees">Search trainees</Link>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span>{name}</span>
          </div>

          <div className="profile-header" style={{ marginTop: "1.5rem" }}>
            <div className="profile-avatar-lg">{initials(trainee)}</div>
            <div className="profile-headline">
              <div className="profile-badges">
                <span className="badge badge-verified">
                  <i className="fas fa-shield-alt" aria-hidden="true"></i> Verified trainee
                </span>
                {trainee.is_under_18 === false && (
                  <span className="badge badge-available">
                    <i className="fas fa-user-check" aria-hidden="true"></i> 18+
                  </span>
                )}
                {canEdit && (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setEditing(true)}
                    style={{ marginLeft: "0.5rem" }}
                  >
                    <i className="fas fa-pen" aria-hidden="true"></i> Edit profile
                  </button>
                )}
              </div>

              <h1>{name}</h1>
              {education[0]?.field_of_study && (
                <div className="profile-course">
                  {education[0].field_of_study}
                  {education[0].level && <> · {education[0].level}</>}
                </div>
              )}
              {(education[0]?.institution || trainee.county) && (
                <div className="profile-inst">
                  {education[0]?.institution && (
                    <>
                      <i className="fas fa-university" aria-hidden="true"></i> {education[0].institution}
                    </>
                  )}
                  {education[0]?.institution && trainee.county && <span style={{ opacity: 0.5 }}> · </span>}
                  {trainee.county && (
                    <>
                      <i className="fas fa-map-marker-alt" aria-hidden="true"></i> {trainee.county}
                    </>
                  )}
                </div>
              )}

              <div className="profile-meta-row">
                <div className="profile-meta-item">
                  <i className="fas fa-briefcase" aria-hidden="true"></i>{" "}
                  {experiences.length} role{experiences.length === 1 ? "" : "s"} on file
                </div>
                {age !== null && (
                  <div className="profile-meta-item">
                    <i className="fas fa-user-clock" aria-hidden="true"></i> {age} years old
                  </div>
                )}
                {trainee.gender && (
                  <div className="profile-meta-item">
                    <i className="fas fa-venus" aria-hidden="true"></i>{" "}
                    <span style={{ textTransform: "capitalize" }}>{trainee.gender}</span>
                  </div>
                )}
                {trainee.city && (
                  <div className="profile-meta-item">
                    <i className="fas fa-map-pin" aria-hidden="true"></i> {trainee.city}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="page-body">
        <div className="container">
          <div className="od-layout">
            <div className="od-main">
              {trainee.bio && (
                <div className="od-card">
                  <h2><i className="fas fa-user" aria-hidden="true"></i> About {trainee.first_name || name.split(" ")[0]}</h2>
                  <p style={{ whiteSpace: "pre-wrap" }}>{trainee.bio}</p>
                </div>
              )}

              <div className="od-card">
                <h2><i className="fas fa-id-card" aria-hidden="true"></i> Profile details</h2>
                <div className="od-details-grid">
                  {education[0]?.level && (
                    <div className="od-detail-item">
                      <div className="od-detail-icon"><i className="fas fa-layer-group" aria-hidden="true"></i></div>
                      <div>
                        <div className="od-detail-label">Education level</div>
                        <div className="od-detail-value">{education[0].level}</div>
                      </div>
                    </div>
                  )}
                  {trainee.county && (
                    <div className="od-detail-item">
                      <div className="od-detail-icon"><i className="fas fa-map-marker-alt" aria-hidden="true"></i></div>
                      <div>
                        <div className="od-detail-label">Location</div>
                        <div className="od-detail-value">
                          {trainee.county}{trainee.city ? ` · ${trainee.city}` : ""}
                        </div>
                      </div>
                    </div>
                  )}
                  {trainee.date_of_birth && (
                    <div className="od-detail-item">
                      <div className="od-detail-icon"><i className="fas fa-calendar" aria-hidden="true"></i></div>
                      <div>
                        <div className="od-detail-label">Date of birth</div>
                        <div className="od-detail-value">
                          {fmtDate(trainee.date_of_birth)}{age !== null ? ` (${age} yrs)` : ""}
                        </div>
                      </div>
                    </div>
                  )}
                  {trainee.nationality && (
                    <div className="od-detail-item">
                      <div className="od-detail-icon"><i className="fas fa-flag" aria-hidden="true"></i></div>
                      <div>
                        <div className="od-detail-label">Nationality</div>
                        <div className="od-detail-value">{trainee.nationality}</div>
                      </div>
                    </div>
                  )}
                  {trainee.gender && (
                    <div className="od-detail-item">
                      <div className="od-detail-icon"><i className="fas fa-venus-mars" aria-hidden="true"></i></div>
                      <div>
                        <div className="od-detail-label">Gender</div>
                        <div className="od-detail-value" style={{ textTransform: "capitalize" }}>{trainee.gender}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {skills.length > 0 && (
                <div className="od-card">
                  <h2><i className="fas fa-tools" aria-hidden="true"></i> Skills &amp; competencies</h2>
                  <div className="od-skills-tags">
                    {skills.map((s) => (
                      <span
                        className="od-skill-tag"
                        key={s.id}
                        title={s.years ? `${s.years} yr${Number(s.years) === 1 ? "" : "s"} of experience` : undefined}
                      >
                        {s.label}
                        {s.proficiency != null && (
                          <span style={{ opacity: 0.7, marginLeft: "0.35rem" }}>· L{s.proficiency}</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {education.length > 0 && (
                <div className="od-card">
                  <h2><i className="fas fa-graduation-cap" aria-hidden="true"></i> Education &amp; qualifications</h2>
                  <div className="od-list" style={{ listStyle: "none", paddingLeft: 0 }}>
                    {education.map((edu) => (
                      <div key={edu.id} style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                        <div className="od-detail-icon" style={{ background: "var(--primary-soft)", color: "var(--primary)", flexShrink: 0 }}>
                          <i className="fas fa-university" aria-hidden="true"></i>
                        </div>
                        <div>
                          <h4 style={{ fontSize: "1rem", marginBottom: "0.2rem", color: "var(--text-dark)" }}>
                            {edu.institution}
                          </h4>
                          <div style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600, marginBottom: "0.3rem" }}>
                            {edu.field_of_study}{edu.level && <> · {edu.level}</>}
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                            <span>
                              <i className="fas fa-calendar" aria-hidden="true" style={{ marginRight: "0.3rem" }}></i>
                              {yearOf(edu.start_date)} – {yearOf(edu.end_date)}
                            </span>
                            {edu.registration_number && (
                              <span>
                                <i className="fas fa-hashtag" aria-hidden="true" style={{ marginRight: "0.3rem" }}></i>
                                {edu.registration_number}
                              </span>
                            )}
                          </div>
                          {edu.description && <p style={{ fontSize: "0.85rem", marginTop: "0.4rem" }}>{edu.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {experiences.length > 0 && (
                <div className="od-card">
                  <h2><i className="fas fa-briefcase" aria-hidden="true"></i> Relevant experience</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {experiences.map((exp) => (
                      <div
                        key={exp.id}
                        style={{
                          border: "1px solid var(--border-light)",
                          borderRadius: "12px",
                          padding: "1.2rem",
                          background: "var(--soft-bg)",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.4rem" }}>
                          <h4 style={{ fontSize: "0.95rem", color: "var(--text-dark)", margin: 0 }}>{exp.position}</h4>
                          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--primary)", background: "var(--primary-soft)", padding: "0.2rem 0.6rem", borderRadius: "40px" }}>
                            {yearOf(exp.start_date)} – {exp.is_current ? "Present" : yearOf(exp.end_date)}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600, marginBottom: "0.5rem" }}>
                          <i className="fas fa-building" aria-hidden="true" style={{ marginRight: "0.4rem" }}></i>
                          {exp.organization}
                        </div>
                        {exp.description && <p style={{ fontSize: "0.85rem", margin: 0 }}>{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {documents.length > 0 && (
                <div className="od-card">
                  <h2><i className="fas fa-folder-open" aria-hidden="true"></i> Uploaded documents</h2>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    Documents are uploaded by the trainee. Access is limited to verified employers and shared in line with our data protection policy.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", border: "1px solid var(--border-light)", borderRadius: "12px" }}
                      >
                        <div className="od-detail-icon" style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>
                          <i className="fas fa-file-alt" aria-hidden="true"></i>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-dark)" }}>{text(doc.title)}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            {text(doc.doc_type)} · {fmtDate(doc.created_at)}
                            {doc.size_bytes ? ` · ${(doc.size_bytes / 1024 / 1024).toFixed(2)} MB` : ""}
                          </div>
                        </div>
                        {doc.download_url && (
                          <a className="btn btn-outline btn-sm" href={doc.download_url} target="_blank" rel="noopener noreferrer">
                            <i className="fas fa-download" aria-hidden="true"></i> Download
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="od-sidebar">
              <div className="od-apply-card">
                <div className="od-deadline-box">
                  <div className="od-deadline-label">Profile status</div>
                  <div className="od-deadline-date" style={{ fontSize: "1.1rem", color: "var(--success)" }}>Verified trainee</div>
                </div>
                {canEdit && (
                  <button
                    className="btn btn-accent"
                    onClick={() => setEditing(true)}
                  >
                    <i className="fas fa-user-edit" aria-hidden="true"></i> Edit profile
                  </button>
                )}
                {!isOwn && (me?.role === "ORG_OFFICER" || me?.role === "ORG_SUPERVISOR") && (
                  <>
                    <button className="btn btn-accent" disabled title="Shortlisting is not yet available">
                      <i className="fas fa-bookmark" aria-hidden="true"></i> Shortlist trainee
                    </button>
                    <button className="btn btn-outline" disabled title="Invitations are not yet available">
                      <i className="fas fa-paper-plane" aria-hidden="true"></i> Invite to apply
                    </button>
                  </>
                )}
                <div className="od-apply-note">
                  <i className="fas fa-shield-alt" aria-hidden="true"></i> Verified trainee
                </div>
              </div>

              <div className="od-employer-card">
                <h3><i className="fas fa-address-card" aria-hidden="true"></i> Contact details</h3>
                <ul className="od-employer-facts">
                  {trainee.email && <li><i className="fas fa-envelope" aria-hidden="true"></i> {trainee.email}</li>}
                  {trainee.phone && <li><i className="fas fa-phone" aria-hidden="true"></i> {trainee.phone}</li>}
                  {(trainee.county || trainee.city) && (
                    <li>
                      <i className="fas fa-map-marker-alt" aria-hidden="true"></i>{" "}
                      {[trainee.city, trainee.county].filter(Boolean).join(", ")}
                    </li>
                  )}
                  {education[0]?.institution && (
                    <li><i className="fas fa-university" aria-hidden="true"></i> {education[0].institution}</li>
                  )}
                </ul>
                <div className="od-apply-note" style={{ marginTop: "1rem", background: "transparent", border: "1px dashed var(--border-light)", color: "var(--text-muted)" }}>
                  <i className="fas fa-lock" aria-hidden="true"></i> Shared with verified employers in line with our data protection policy.
                </div>
              </div>

              <div className="od-share-card">
                <h3><i className="fas fa-share-alt" aria-hidden="true"></i> Share this profile</h3>
                <div className="od-share-buttons">
                  <button
                    className="od-share-btn"
                    title="Copy link"
                    onClick={() => {
                      if (navigator.clipboard) navigator.clipboard.writeText(window.location.href);
                    }}
                  >
                    <i className="fas fa-link" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {editing && (
        <EditProfileModal
          profile={trainee}
          onClose={() => setEditing(false)}
          onSave={handleSaveProfile}
        />
      )}

      <Footer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Edit modal - fields mirror TraineeProfileWriteSerializer
// ---------------------------------------------------------------------------

function EditProfileModal({ profile, onClose, onSave }) {
  const [form, setForm] = useState({
    first_name: profile.first_name || "",
    middle_name: profile.middle_name || "",
    last_name: profile.last_name || "",
    gender: profile.gender || "",
    date_of_birth: profile.date_of_birth || "",
    nationality: profile.nationality || "Kenyan",
    national_id: profile.national_id || "",
    passport_no: profile.passport_no || "",
    county: profile.county || "",
    city: profile.city || "",
    bio: profile.bio || "",
    guardian_consent: Boolean(profile.guardian_consent),
    guardian_full_name: profile.guardian_full_name || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const age = useMemo(() => calculateAge(form.date_of_birth), [form.date_of_birth]);
  const isUnder18 = age !== null && age < 18;

  const submit = async (e) => {
    e?.preventDefault?.();
    setError("");

    if (!form.first_name.trim() || !form.last_name.trim()) {
      setError("First name and last name are required.");
      return;
    }
    if (isUnder18) {
      if (!form.guardian_consent) {
        setError("Guardian consent is required for participants under 18.");
        return;
      }
      if (!form.guardian_full_name.trim()) {
        setError("Guardian's full name is required for participants under 18.");
        return;
      }
    }

    // Only send fields the write serializer accepts, and only ones that
    // actually changed - keeps the PATCH minimal.
    const patch = {};
    const keys = [
      "first_name", "middle_name", "last_name", "gender", "date_of_birth",
      "nationality", "national_id", "passport_no", "county", "city", "bio",
    ];
    for (const k of keys) {
      const next = form[k] ?? "";
      const prev = profile[k] ?? "";
      if (String(next) !== String(prev)) patch[k] = next || (k === "date_of_birth" ? null : "");
    }
    if (isUnder18) {
      patch.guardian_consent = Boolean(form.guardian_consent);
      patch.guardian_full_name = form.guardian_full_name.trim();
    }

    if (!Object.keys(patch).length) {
      onClose();
      return;
    }

    setSaving(true);
    try {
      await onSave(patch);
    } catch (err) {
      setError(errorMessage(err, "Could not save your profile."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          width: "100%",
          maxWidth: 640,
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "1.5rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 id="edit-profile-title" style={{ margin: 0 }}>
            <i className="fas fa-user-edit" aria-hidden="true"></i> Edit profile
          </h2>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close">
            <i className="fas fa-times" aria-hidden="true"></i>
          </button>
        </div>

        {error && (
          <p style={{ color: "var(--danger, #d33)", marginBottom: "0.8rem" }}>{error}</p>
        )}

        <form onSubmit={submit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <label>First name *<br />
              <input
                value={form.first_name}
                onChange={(e) => update("first_name", e.target.value)}
                required
                style={{ width: "100%" }}
              />
            </label>
            <label>Middle name<br />
              <input
                value={form.middle_name}
                onChange={(e) => update("middle_name", e.target.value)}
                style={{ width: "100%" }}
              />
            </label>
            <label>Last name *<br />
              <input
                value={form.last_name}
                onChange={(e) => update("last_name", e.target.value)}
                required
                style={{ width: "100%" }}
              />
            </label>
            <label>Gender<br />
              <select value={form.gender} onChange={(e) => update("gender", e.target.value)} style={{ width: "100%" }}>
                <option value="">Select</option>
                {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </label>
            <label>Date of birth<br />
              <input
                type="date"
                value={form.date_of_birth || ""}
                onChange={(e) => update("date_of_birth", e.target.value)}
                style={{ width: "100%" }}
              />
            </label>
            <label>Nationality<br />
              <input
                value={form.nationality}
                onChange={(e) => update("nationality", e.target.value)}
                style={{ width: "100%" }}
              />
            </label>
            <label>National ID<br />
              <input
                value={form.national_id}
                onChange={(e) => update("national_id", e.target.value)}
                style={{ width: "100%" }}
              />
            </label>
            <label>Passport no.<br />
              <input
                value={form.passport_no}
                onChange={(e) => update("passport_no", e.target.value)}
                style={{ width: "100%" }}
              />
            </label>
            <label>County<br />
              <select value={form.county} onChange={(e) => update("county", e.target.value)} style={{ width: "100%" }}>
                <option value="">Select</option>
                {COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label>Town / city<br />
              <input
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                style={{ width: "100%" }}
              />
            </label>
          </div>

          <label style={{ display: "block", marginTop: "0.75rem" }}>
            Bio
            <textarea
              rows="4"
              value={form.bio}
              onChange={(e) => update("bio", e.target.value)}
              maxLength={2000}
              style={{ width: "100%" }}
              placeholder="A couple of sentences about yourself…"
            />
          </label>

          {isUnder18 && (
            <div style={{ marginTop: "1rem", padding: "0.75rem", background: "#f8f4ff", borderRadius: 8 }}>
              <strong style={{ display: "block", marginBottom: "0.4rem" }}>
                <i className="fas fa-user-shield" aria-hidden="true"></i> Guardian consent (required under 18)
              </strong>
              <label style={{ display: "block" }}>
                Guardian's full name *
                <input
                  value={form.guardian_full_name}
                  onChange={(e) => update("guardian_full_name", e.target.value)}
                  style={{ width: "100%" }}
                />
              </label>
              <label style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.5rem" }}>
                <input
                  type="checkbox"
                  checked={form.guardian_consent}
                  onChange={(e) => update("guardian_consent", e.target.checked)}
                />
                <span>My parent or guardian consents to my participation.</span>
              </label>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1.25rem" }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (
                <><i className="fas fa-spinner fa-spin"></i> Saving…</>
              ) : (
                <><i className="fas fa-save"></i> Save changes</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}