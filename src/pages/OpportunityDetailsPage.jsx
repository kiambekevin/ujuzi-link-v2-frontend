import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TopBar from "../components/layout/TopBar.jsx";
import BrandRow from "../components/layout/BrandRow.jsx";
import MainNav from "../components/layout/MainNav.jsx";
import Footer from "../components/layout/Footer.jsx";
import SearchModal from "../components/ui/SearchModal.jsx";
import { api, errorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/home.css";
import "../styles/opportunity-details.css";

// Map backend enum → CSS class + human label. Matches
// apps/core/constants.OPPORTUNITY_TYPE_CHOICES
const TYPE_META = {
  APPRENTICESHIP: { cls: "apprenticeship", label: "Apprenticeship" },
  INTERNSHIP: { cls: "internship", label: "Internship" },
  INDUSTRIAL_ATTACHMENT: { cls: "attachment", label: "Industrial Attachment" },
  PUPILLAGE: { cls: "pupillage", label: "Pupillage" },
  COMMUNITY_SERVICE: { cls: "community", label: "Community Service" },
  VOLUNTEER: { cls: "volunteer", label: "Volunteer" },
  INDUSTRY_VISIT: { cls: "visit", label: "Industry Visit" },
  JOB_SHADOWING: { cls: "shadowing", label: "Job Shadowing" },
  OTHER: { cls: "other", label: "Other" },
};

const DOC_LABELS = {
  CV: "Updated CV / resume",
  ACADEMIC_CERTIFICATE: "Academic certificates",
  PROFESSIONAL_CERTIFICATE: "Professional certificates",
  NATIONAL_ID: "National ID / Passport copy",
  CERTIFICATE_OF_GOOD_CONDUCT: "Certificate of Good Conduct",
  OTHER: "Other supporting documents",
};

// Safe text coercion — see the dashboard fix. Never crashes if the API returns
// a nested object where a string was expected.
function text(v) {
  if (v == null) return "—";
  if (typeof v === "string") return v || "—";
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) {
    const parts = v.map(text).filter((x) => x && x !== "—");
    return parts.length ? parts.join(", ") : "—";
  }
  if (typeof v === "object") return v.name ?? v.title ?? v.label ?? v.code ?? "—";
  return String(v);
}

function fmtDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(`${iso}`.length === 10 ? `${iso}T23:59:59` : iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function daysUntil(iso) {
  if (!iso) return 0;
  const target = new Date(`${iso}`.length === 10 ? `${iso}T23:59:59` : iso);
  if (Number.isNaN(target.getTime())) return 0;
  return Math.max(0, Math.ceil((target.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

function orgName(opp) {
  if (!opp) return "Verified employer";
  if (typeof opp.organization === "string") return opp.organization;
  if (opp.organization_name) return opp.organization_name;
  if (opp.organization?.name) return opp.organization.name;
  return "Verified employer";
}

function durationLabel(opp) {
  if (!opp) return "—";
  if (opp.duration_display) return opp.duration_display;
  if (opp.duration_value) {
    const unit = String(opp.duration_unit || "").toLowerCase();
    return `${opp.duration_value} ${unit}${opp.duration_value === 1 ? "" : "s"}`;
  }
  return "—";
}

function stipendLabel(opp) {
  if (!opp) return "—";
  if (opp.compensation === "UNPAID") return "Not provided";
  if (opp.stipend_amount) return `KES ${opp.stipend_amount} / month`;
  if (opp.compensation === "STIPEND") return "Stipend provided";
  if (opp.compensation === "PAID") return "Paid";
  return opp.compensation_display || "—";
}

function locationLabel(opp) {
  if (!opp) return "—";
  const bits = [opp.county, opp.location || opp.worksite].filter(Boolean);
  return bits.length ? bits.join(", ") : "—";
}

export default function OpportunityDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();   // ← correct: your context exposes `user`, not `isLoggedIn`
  const isLoggedIn = Boolean(user);

  const [searchOpen, setSearchOpen] = useState(false);
  const [opp, setOpp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [similar, setSimilar] = useState([]);
  const [saving, setSaving] = useState(false);
  const [reporting, setReporting] = useState(false);

  // ---- Load opportunity --------------------------------------------------
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    setLoading(true);
    setError("");

    api
      .get(`/opportunities/${id}/`, { signal: controller.signal })
      .then(({ data }) => {
        if (!cancelled) setOpp(data);
      })
      .catch((err) => {
        if (err?.name === "CanceledError" || err?.name === "AbortError") return;
        if (!cancelled) setError(errorMessage(err, "Unable to load this opportunity."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [id]);

  // ---- Load similar opportunities ---------------------------------------
  useEffect(() => {
    if (!opp) return;
    let cancelled = false;

    const params = new URLSearchParams({ page_size: "4", ordering: "-created_at" });
    if (opp.type) params.set("type", opp.type);
    if (opp.county) params.set("county", opp.county);

    api
      .get(`/opportunities/?${params.toString()}`)
      .then(({ data }) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
        setSimilar(list.filter((o) => String(o.id) !== String(opp.id)).slice(0, 4));
      })
      .catch(() => {
        /* silent — similar list is optional */
      });

    return () => {
      cancelled = true;
    };
  }, [opp]);

  // ---- Derived ----------------------------------------------------------
  const typeMeta = TYPE_META[opp?.type] || { cls: "other", label: text(opp?.type) };
  const deadlineDays = useMemo(() => daysUntil(opp?.closing_date), [opp?.closing_date]);
  const isUrgent = deadlineDays <= 3;
  const isOpen = opp?.is_open !== false && (!opp?.closing_date || new Date(opp.closing_date) >= new Date());
  const alreadyApplied = opp?.has_applied === true || opp?.has_applied === "true";
  const isSaved = opp?.is_saved === true || opp?.is_saved === "true";

  const requiredDocs = useMemo(() => {
    const raw = opp?.required_documents;
    return Array.isArray(raw) ? raw : [];
  }, [opp]);

  const skills = useMemo(() => {
    const arr = Array.isArray(opp?.skills) ? opp.skills : [];
    return arr.filter(Boolean);
  }, [opp]);

  // ---- Actions ----------------------------------------------------------
  const handleApply = useCallback(() => {
    if (!opp) return;
    const target = `/apply/${opp.id}`;
    if (!isLoggedIn) {
      navigate(`/login?next=${encodeURIComponent(target)}`);
      return;
    }
    navigate(target);
  }, [opp, isLoggedIn, navigate]);

  const handleSave = useCallback(async () => {
    if (!isLoggedIn) {
      navigate(`/login?next=${encodeURIComponent(`/opportunities/${id}`)}`);
      return;
    }
    setSaving(true);
    try {
      if (isSaved) {
        await api.post(`/opportunities/${id}/unsave/`);
        setOpp((prev) => (prev ? { ...prev, is_saved: false } : prev));
      } else {
        await api.post(`/opportunities/${id}/save/`);
        setOpp((prev) => (prev ? { ...prev, is_saved: true } : prev));
      }
    } catch (err) {
      alert(errorMessage(err, "Could not update your saved list."));
    } finally {
      setSaving(false);
    }
  }, [id, isLoggedIn, isSaved, navigate]);

  const handleShare = useCallback(async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard.");
      } else {
        alert(`Share this page: ${window.location.href}`);
      }
    } catch {
      /* silent */
    }
  }, []);

  const handleReport = useCallback(async () => {
    if (!isLoggedIn) {
      navigate(`/login?next=${encodeURIComponent(`/opportunities/${id}`)}`);
      return;
    }
    // Uses the complaint endpoint if available; falls back to a message.
    setReporting(true);
    try {
      await api.post("/complaints/", {
        category: "OTHER",
        subject_type: "OPPORTUNITY",
        subject_id: Number(id),
        description: "Reported from opportunity details page.",
      });
      alert("Thank you. Our team will review this opportunity.");
    } catch {
      alert("Could not submit the report. Please use the contact form.");
    } finally {
      setReporting(false);
    }
  }, [id, isLoggedIn, navigate]);

  // ---- Render: loading ---------------------------------------------------
  if (loading) {
    return (
      <>
        <TopBar />
        <BrandRow onSearchClick={() => setSearchOpen(true)} />
        <MainNav />
        <div className="page-body">
          <div className="container">
            <div className="od-empty-state" style={{ marginTop: "4rem" }}>
              <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
              <h3>Loading opportunity…</h3>
            </div>
          </div>
        </div>
        <Footer />
        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </>
    );
  }

  // ---- Render: not found / error ----------------------------------------
  if (error || !opp) {
    return (
      <>
        <TopBar />
        <BrandRow onSearchClick={() => setSearchOpen(true)} />
        <MainNav />
        <div className="page-body">
          <div className="container">
            <div className="od-empty-state">
              <i className="fas fa-circle-question" aria-hidden="true"></i>
              <h3>Opportunity not found</h3>
              <p>{error || "The opportunity you're looking for may have closed or been removed."}</p>
              <button className="btn btn-primary" onClick={() => navigate("/opportunities")}>
                <i className="fas fa-arrow-left"></i> Back to opportunities
              </button>
            </div>
          </div>
        </div>
        <Footer />
        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </>
    );
  }

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <TopBar />
      <BrandRow onSearchClick={() => setSearchOpen(true)} />
      <MainNav />

      <header className="page-header" id="main-content">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <Link to="/opportunities">Opportunities</Link>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span>{text(opp.title)}</span>
          </div>

          <div className="od-header-badges">
            <span className={`od-badge od-badge-type ${typeMeta.cls}`}>{typeMeta.label}</span>
            {opp.is_open && (
              <span className="od-badge od-badge-new">
                <i className="fas fa-bolt" aria-hidden="true"></i> Open
              </span>
            )}
            {alreadyApplied && (
              <span className="od-badge">
                <i className="fas fa-check" aria-hidden="true"></i> Applied
              </span>
            )}
          </div>

          <h1>{text(opp.title)}</h1>

          <div className="od-header-employer">
            <i className="fas fa-building" aria-hidden="true"></i>
            {orgName(opp)}
            {opp.county && <> · {opp.county}, Kenya</>}
          </div>

          <div className="od-header-meta">
            <div className="od-header-meta-item">
              <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
              <span>{locationLabel(opp)}</span>
            </div>
            <div className="od-header-meta-item">
              <i className="fas fa-clock" aria-hidden="true"></i>
              <span>
                {durationLabel(opp)}
                {opp.work_mode_display ? ` · ${opp.work_mode_display}` : ""}
              </span>
            </div>
            {opp.qualifications && (
              <div className="od-header-meta-item">
                <i className="fas fa-graduation-cap" aria-hidden="true"></i>
                <span>{text(opp.qualifications).split("\n")[0]}</span>
              </div>
            )}
            <div className="od-header-meta-item">
              <i className="fas fa-money-bill-wave" aria-hidden="true"></i>
              <span>{stipendLabel(opp)}</span>
            </div>
            {opp.places_available > 0 && (
              <div className="od-header-meta-item">
                <i className="fas fa-users" aria-hidden="true"></i>
                <span>
                  {opp.places_available} place{opp.places_available === 1 ? "" : "s"} available
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="page-body">
        <div className="container">
          <div className="od-layout">
            <div className="od-main">
              {/* About */}
              <div className="od-card">
                <h2>
                  <i className="fas fa-info-circle" aria-hidden="true"></i> About this opportunity
                </h2>
                <div style={{ whiteSpace: "pre-wrap" }}>{opp.description}</div>
              </div>

              {/* Placement details */}
              <div className="od-card">
                <h2>
                  <i className="fas fa-list-check" aria-hidden="true"></i> Placement details
                </h2>
                <div className="od-details-grid">
                  <div className="od-detail-item">
                    <div className="od-detail-icon"><i className="fas fa-briefcase" aria-hidden="true"></i></div>
                    <div>
                      <div className="od-detail-label">Opportunity type</div>
                      <div className="od-detail-value">{typeMeta.label}</div>
                    </div>
                  </div>
                  <div className="od-detail-item">
                    <div className="od-detail-icon"><i className="fas fa-hourglass-half" aria-hidden="true"></i></div>
                    <div>
                      <div className="od-detail-label">Duration</div>
                      <div className="od-detail-value">{durationLabel(opp)}</div>
                    </div>
                  </div>
                  {opp.work_mode_display && (
                    <div className="od-detail-item">
                      <div className="od-detail-icon"><i className="fas fa-laptop-house" aria-hidden="true"></i></div>
                      <div>
                        <div className="od-detail-label">Work mode</div>
                        <div className="od-detail-value">{opp.work_mode_display}</div>
                      </div>
                    </div>
                  )}
                  {locationLabel(opp) !== "—" && (
                    <div className="od-detail-item">
                      <div className="od-detail-icon"><i className="fas fa-map-marker-alt" aria-hidden="true"></i></div>
                      <div>
                        <div className="od-detail-label">Location</div>
                        <div className="od-detail-value">{locationLabel(opp)}</div>
                      </div>
                    </div>
                  )}
                  {opp.start_date && (
                    <div className="od-detail-item">
                      <div className="od-detail-icon"><i className="fas fa-calendar-check" aria-hidden="true"></i></div>
                      <div>
                        <div className="od-detail-label">Start date</div>
                        <div className="od-detail-value">{fmtDate(opp.start_date)}</div>
                      </div>
                    </div>
                  )}
                  <div className="od-detail-item">
                    <div className="od-detail-icon"><i className="fas fa-money-bill-wave" aria-hidden="true"></i></div>
                    <div>
                      <div className="od-detail-label">Compensation</div>
                      <div className="od-detail-value">{stipendLabel(opp)}</div>
                    </div>
                  </div>
                  <div className="od-detail-item">
                    <div className="od-detail-icon"><i className="fas fa-users" aria-hidden="true"></i></div>
                    <div>
                      <div className="od-detail-label">Places</div>
                      <div className="od-detail-value">
                        {opp.places_available} of {opp.places_total} available
                      </div>
                    </div>
                  </div>
                  {opp.working_hours && (
                    <div className="od-detail-item">
                      <div className="od-detail-icon"><i className="fas fa-clock" aria-hidden="true"></i></div>
                      <div>
                        <div className="od-detail-label">Working hours</div>
                        <div className="od-detail-value">{opp.working_hours}</div>
                      </div>
                    </div>
                  )}
                  <div className="od-detail-item">
                    <div className="od-detail-icon"><i className="fas fa-calendar-alt" aria-hidden="true"></i></div>
                    <div>
                      <div className="od-detail-label">Application deadline</div>
                      <div className="od-detail-value">{fmtDate(opp.closing_date)}</div>
                    </div>
                  </div>
                  {opp.min_age && (
                    <div className="od-detail-item">
                      <div className="od-detail-icon"><i className="fas fa-user-clock" aria-hidden="true"></i></div>
                      <div>
                        <div className="od-detail-label">Minimum age</div>
                        <div className="od-detail-value">{opp.min_age} years</div>
                      </div>
                    </div>
                  )}
                </div>
                {opp.schedule && (
                  <div style={{ marginTop: "1rem" }}>
                    <div className="od-detail-label">Schedule</div>
                    <p style={{ whiteSpace: "pre-wrap" }}>{opp.schedule}</p>
                  </div>
                )}
              </div>

              {/* Requirements */}
              {(opp.qualifications || opp.eligibility_criteria || skills.length > 0 || requiredDocs.length > 0) && (
                <div className="od-card">
                  <h2>
                    <i className="fas fa-clipboard-check" aria-hidden="true"></i> Requirements &amp; eligibility
                  </h2>
                  {opp.qualifications && (
                    <>
                      <h3>Minimum qualifications</h3>
                      <p style={{ whiteSpace: "pre-wrap" }}>{opp.qualifications}</p>
                    </>
                  )}
                  {opp.eligibility_criteria && (
                    <>
                      <h3>Eligibility criteria</h3>
                      <p style={{ whiteSpace: "pre-wrap" }}>{opp.eligibility_criteria}</p>
                    </>
                  )}
                  {skills.length > 0 && (
                    <>
                      <h3>Preferred skills &amp; attributes</h3>
                      <div className="od-skills-tags">
                        {skills.map((tag, i) => (
                          <span className="od-skill-tag" key={typeof tag === "string" ? tag : i}>
                            {text(tag)}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                  {requiredDocs.length > 0 && (
                    <>
                      <h3>Documents required</h3>
                      <ul className="od-list">
                        {requiredDocs.map((t) => (
                          <li key={t}>
                            <i className="fas fa-file-alt" aria-hidden="true"></i>
                            <span>{DOC_LABELS[t] || String(t).replaceAll("_", " ").toLowerCase()}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}

              {/* Skills gained */}
              {opp.skills_gained && (
                <div className="od-card">
                  <h2>
                    <i className="fas fa-route" aria-hidden="true"></i> What you will gain
                  </h2>
                  <p style={{ whiteSpace: "pre-wrap" }}>{opp.skills_gained}</p>
                </div>
              )}

              {/* About employer */}
              <div className="od-card">
                <h2>
                  <i className="fas fa-building" aria-hidden="true"></i> About the employer
                </h2>
                <div className="od-employer-row">
                  <div className="od-employer-logo">
                    <i className="fas fa-building" aria-hidden="true"></i>
                  </div>
                  <div>
                    <div className="od-employer-name">{orgName(opp)}</div>
                    {opp.organization?.org_type && (
                      <div className="od-employer-type">{text(opp.organization.org_type)}</div>
                    )}
                  </div>
                </div>
                <p>
                  {orgName(opp)} is advertising this opportunity through the Ujuzi Link platform. Employer
                  details, accreditations and reviews are available on their organisation page.
                </p>
              </div>

              {/* How to apply */}
              {opp.application_instructions ? (
                <div className="od-card">
                  <h2>
                    <i className="fas fa-paper-plane" aria-hidden="true"></i> How to apply
                  </h2>
                  <div style={{ whiteSpace: "pre-wrap" }}>{opp.application_instructions}</div>
                </div>
              ) : (
                <div className="od-card">
                  <h2>
                    <i className="fas fa-paper-plane" aria-hidden="true"></i> How to apply
                  </h2>
                  <p>
                    Applications must be submitted through the Ujuzi Link platform.{" "}
                    {isLoggedIn ? (
                      <>Click <strong>Apply now</strong> on this page to start your application.</>
                    ) : (
                      <>
                        Please{" "}
                        <Link to={`/login?next=${encodeURIComponent(`/apply/${opp.id}`)}`} style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "underline" }}>
                          sign in
                        </Link>{" "}
                        or{" "}
                        <Link to="/register" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "underline" }}>
                          register
                        </Link>{" "}
                        to apply.
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="od-sidebar">
              <div className="od-apply-card">
                <div className={`od-deadline-box ${isUrgent ? "urgent" : ""}`}>
                  <div className="od-deadline-label">Application closes</div>
                  <div className="od-deadline-date">{fmtDate(opp.closing_date)}</div>
                  <div className="od-deadline-days">
                    <i className="fas fa-hourglass-half" aria-hidden="true"></i>{" "}
                    {deadlineDays} day{deadlineDays === 1 ? "" : "s"} left
                  </div>
                </div>

                {alreadyApplied ? (
                  <button className="btn btn-outline" disabled>
                    <i className="fas fa-check-circle" aria-hidden="true"></i> Already applied
                  </button>
                ) : (
                  <button
                    className="btn btn-accent"
                    onClick={handleApply}
                    disabled={!isOpen || opp.places_available < 1}
                  >
                    <i className="fas fa-paper-plane" aria-hidden="true"></i>{" "}
                    {!isOpen
                      ? "Applications closed"
                      : opp.places_available < 1
                        ? "No places available"
                        : isLoggedIn
                          ? "Apply now"
                          : "Sign in to apply"}
                  </button>
                )}

                <button
                  className="btn btn-outline"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <i className={`fas ${isSaved ? "fa-bookmark" : "fa-bookmark"}`} aria-hidden="true"></i>{" "}
                  {saving ? "Saving…" : isSaved ? "Saved" : "Save opportunity"}
                </button>

                <div className="od-save-row">
                  <button className="btn btn-ghost btn-sm" onClick={handleShare}>
                    <i className="fas fa-share-alt" aria-hidden="true"></i> Share
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={handleReport}
                    disabled={reporting}
                  >
                    <i className="fas fa-flag" aria-hidden="true"></i> Report
                  </button>
                </div>

                <div className="od-apply-note">
                  <i className="fas fa-shield-alt" aria-hidden="true"></i> Verified employer
                </div>
              </div>

              <div className="od-employer-card">
                <h3>
                  <i className="fas fa-building" aria-hidden="true"></i> Employer
                </h3>
                <div className="od-employer-row">
                  <div className="od-employer-logo">
                    <i className="fas fa-building" aria-hidden="true"></i>
                  </div>
                  <div>
                    <div className="od-employer-name">{orgName(opp)}</div>
                    <div className="od-employer-type">Verified employer</div>
                  </div>
                </div>
                <ul className="od-employer-facts">
                  {opp.county && (
                    <li><i className="fas fa-map-marker-alt" aria-hidden="true"></i> {opp.county}, Kenya</li>
                  )}
                  {opp.organization?.org_type && (
                    <li><i className="fas fa-industry" aria-hidden="true"></i> {text(opp.organization.org_type)}</li>
                  )}
                  <li>
                    <i className="fas fa-money-bill-wave" aria-hidden="true"></i>{" "}
                    {stipendLabel(opp)}
                  </li>
                </ul>
              </div>

              <div className="od-share-card">
                <h3>
                  <i className="fas fa-share-alt" aria-hidden="true"></i> Share this opportunity
                </h3>
                <div className="od-share-buttons">
                  <button
                    className="od-share-btn"
                    title="Copy link"
                    aria-label="Copy link"
                    onClick={handleShare}
                  >
                    <i className="fas fa-link" aria-hidden="true"></i>
                  </button>
                </div>
              </div>

              {similar.length > 0 && (
                <div className="od-share-card">
                  <h3>
                    <i className="fas fa-layer-group" aria-hidden="true"></i> Similar opportunities
                  </h3>
                  <div className="od-similar-list">
                    {similar.map((s) => (
                      <Link
                        to={`/opportunities/${s.id}`}
                        className="od-similar-item"
                        key={s.id}
                      >
                        <div className="od-similar-logo">
                          <i className="fas fa-briefcase" aria-hidden="true"></i>
                        </div>
                        <div className="od-similar-body">
                          <div className="od-similar-title">{text(s.title)}</div>
                          <div className="od-similar-meta">
                            {orgName(s)} · {text(s.county)}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    to="/opportunities"
                    className="btn btn-outline btn-sm"
                    style={{ width: "100%", marginTop: "1rem" }}
                  >
                    <i className="fas fa-search" aria-hidden="true"></i> View all opportunities
                  </Link>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>

      <Footer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}