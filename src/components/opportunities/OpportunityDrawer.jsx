import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

// Friendly labels for backend `required_documents` values.
// Mirrors apps/core/constants.USER_DOCUMENT_TYPE_CHOICES
const DOC_LABELS = {
  CV: "CV / resume",
  ACADEMIC_CERTIFICATE: "Academic certificates",
  PROFESSIONAL_CERTIFICATE: "Professional certificates",
  NATIONAL_ID: "National ID / Passport copy",
  CERTIFICATE_OF_GOOD_CONDUCT: "Certificate of Good Conduct",
  OTHER: "Other supporting documents",
};

// Coerce anything the API might return to a printable string.
function text(v, fallback = "-") {
  if (v == null) return fallback;
  if (typeof v === "string") return v || fallback;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) {
    const parts = v.map((x) => text(x, "")).filter(Boolean);
    return parts.length ? parts.join(", ") : fallback;
  }
  if (typeof v === "object") {
    return v.name ?? v.title ?? v.label ?? v.code ?? fallback;
  }
  return String(v);
}

function orgName(opp) {
  if (!opp) return "Verified employer";
  if (typeof opp.organization === "string") return opp.organization;
  if (opp.organization?.name) return opp.organization.name;
  if (opp.organization_name) return opp.organization_name;
  return "Verified employer";
}

function durationLabel(opp) {
  if (!opp) return "-";
  if (opp.duration_display) return opp.duration_display;
  if (opp.duration_value) {
    const unit = String(opp.duration_unit || "").toLowerCase();
    return `${opp.duration_value} ${unit}${opp.duration_value === 1 ? "" : "s"}`;
  }
  return "-";
}

function compensationLabel(opp) {
  if (!opp) return "-";
  if (opp.compensation === "UNPAID") return "Unpaid";
  if (opp.stipend_amount) return `${opp.compensation_display || "Paid"} · KES ${opp.stipend_amount}`;
  if (opp.compensation_display) return opp.compensation_display;
  if (opp.compensation === "STIPEND") return "Stipend provided";
  if (opp.compensation === "PAID") return "Paid";
  return "-";
}

function deadlineLabel(iso) {
  if (!iso) return "-";
  try {
    const d = new Date(`${iso}`.length === 10 ? `${iso}T23:59:59` : iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

function locationLabel(opp) {
  if (!opp) return "-";
  const bits = [opp.county, opp.location || opp.worksite].filter(Boolean);
  if (opp.work_mode === "REMOTE") bits.push("Remote");
  return bits.length ? bits.join(" · ") : "-";
}

export default function OpportunityDrawer({ opportunity, onClose }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isLoggedIn = Boolean(user);

  const drawerRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Lock body scroll while open; restore on close/unmount.
  useEffect(() => {
    if (opportunity) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [opportunity]);

  // Escape closes; focus moves to the close button on open.
  useEffect(() => {
    if (!opportunity) return;
    closeBtnRef.current?.focus?.();

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [opportunity, onClose]);

  // Very light focus trap - keeps Tab inside the drawer while open.
  useEffect(() => {
    if (!opportunity) return;
    const node = drawerRef.current;
    if (!node) return;

    const onKey = (e) => {
      if (e.key !== "Tab") return;
      const focusables = node.querySelectorAll(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    node.addEventListener("keydown", onKey);
    return () => node.removeEventListener("keydown", onKey);
  }, [opportunity]);

  if (!opportunity) return null;

  const hasApplied = opportunity.has_applied === true || opportunity.has_applied === "true";
  const isSaved = opportunity.is_saved === true || opportunity.is_saved === "true";
  const isOpen = opportunity.is_open !== false && opportunity.status !== "CLOSED";
  const placesAvailable = Number(opportunity.places_available || 0);
  const isFull = isOpen && placesAvailable < 1;

  const requiredDocs = Array.isArray(opportunity.required_documents)
    ? opportunity.required_documents
    : [];

  const skills = Array.isArray(opportunity.skills)
    ? opportunity.skills
    : typeof opportunity.skills === "string"
      ? opportunity.skills.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

  const applyDisabled = !isOpen || isFull || hasApplied;

  const handleApply = () => {
    if (!opportunity?.id) return;
    const target = `/apply/${opportunity.id}`;
    if (!isLoggedIn) {
      navigate(`/login?next=${encodeURIComponent(target)}`);
      return;
    }
    navigate(target);
  };

  return (
    <>
      <div
        className="drawer-scrim"
        onClick={onClose}
        role="presentation"
        aria-hidden="true"
      ></div>

      <aside
        ref={drawerRef}
        className={`detail-drawer ${opportunity ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="opp-drawer-title"
      >
        <div className="drawer-header">
          <button
            ref={closeBtnRef}
            className="close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="fas fa-times"></i>
          </button>

          <div className="drawer-header-top">
            <h2 id="opp-drawer-title">{text(opportunity.title)}</h2>
            <span className={`type-badge ${opportunity.type}`}>
              {text(opportunity.type_display || opportunity.type)}
            </span>
          </div>

          <div className="drawer-employer">
            <i className="fas fa-building"></i> {orgName(opportunity)}
            {opportunity.county && (
              <>
                <span style={{ opacity: 0.5 }}> · </span>
                <i className="fas fa-map-marker-alt"></i> {text(opportunity.county)}
              </>
            )}
          </div>

          {/* Status strip - quick context */}
          <div
            className="drawer-status-strip"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginTop: "0.75rem",
            }}
          >
            {isOpen && !isFull && (
              <span
                className="badge"
                style={{
                  background: "var(--success-bg, #e6f4ea)",
                  color: "var(--success, #1e7e34)",
                  padding: "0.15rem 0.55rem",
                  borderRadius: 40,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                }}
              >
                <i className="fas fa-check-circle"></i> Open
              </span>
            )}
            {isFull && (
              <span
                className="badge"
                style={{
                  background: "#fee2e2",
                  color: "#b91c1c",
                  padding: "0.15rem 0.55rem",
                  borderRadius: 40,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                }}
              >
                <i className="fas fa-users-slash"></i> No places left
              </span>
            )}
            {!isOpen && (
              <span
                className="badge"
                style={{
                  background: "#f3f4f6",
                  color: "#374151",
                  padding: "0.15rem 0.55rem",
                  borderRadius: 40,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                }}
              >
                <i className="fas fa-lock"></i> Closed
              </span>
            )}
            {hasApplied && (
              <span
                className="badge"
                style={{
                  background: "#e0f2fe",
                  color: "#0369a1",
                  padding: "0.15rem 0.55rem",
                  borderRadius: 40,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                }}
              >
                <i className="fas fa-check"></i> Applied
              </span>
            )}
            {isSaved && (
              <span
                className="badge"
                style={{
                  background: "#fef3c7",
                  color: "#92400e",
                  padding: "0.15rem 0.55rem",
                  borderRadius: 40,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                }}
              >
                <i className="fas fa-bookmark"></i> Saved
              </span>
            )}
          </div>
        </div>

        <div className="drawer-body">
          {/* ABOUT */}
          <div className="detail-section">
            <h3>
              <i className="fas fa-info-circle"></i> About the role
            </h3>
            {opportunity.description ? (
              <p style={{ whiteSpace: "pre-wrap" }}>{opportunity.description}</p>
            ) : (
              <p className="muted">No description provided.</p>
            )}
          </div>

          {/* WHAT YOU WILL GAIN */}
          {opportunity.skills_gained && (
            <div className="detail-section">
              <h3>
                <i className="fas fa-sparkles"></i> What you will gain
              </h3>
              <p style={{ whiteSpace: "pre-wrap" }}>{opportunity.skills_gained}</p>
            </div>
          )}

          {/* REQUIREMENTS */}
          <div className="detail-section">
            <h3>
              <i className="fas fa-list-check"></i> Requirements &amp; skills
            </h3>
            {opportunity.qualifications && (
              <div className="detail-row">
                <span>Qualifications</span>
                <strong style={{ whiteSpace: "pre-wrap", textAlign: "right" }}>
                  {opportunity.qualifications}
                </strong>
              </div>
            )}
            {opportunity.eligibility_criteria && (
              <div className="detail-row">
                <span>Eligibility</span>
                <strong style={{ whiteSpace: "pre-wrap", textAlign: "right" }}>
                  {opportunity.eligibility_criteria}
                </strong>
              </div>
            )}
            {opportunity.min_age && (
              <div className="detail-row">
                <span>Minimum age</span>
                <strong>{opportunity.min_age} years</strong>
              </div>
            )}
            {skills.length > 0 && (
              <div className="tag-cloud mt-2">
                {skills.map((tag, i) => (
                  <span className="tag" key={i}>
                    {text(tag)}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* PLACEMENT DETAILS */}
          <div className="detail-section">
            <h3>
              <i className="fas fa-briefcase"></i> Placement details
            </h3>
            <div className="detail-row">
              <span>Location</span>
              <strong>{locationLabel(opportunity)}</strong>
            </div>
            <div className="detail-row">
              <span>Duration</span>
              <strong>{durationLabel(opportunity)}</strong>
            </div>
            {opportunity.work_mode_display && (
              <div className="detail-row">
                <span>Work mode</span>
                <strong>{opportunity.work_mode_display}</strong>
              </div>
            )}
            {opportunity.working_hours && (
              <div className="detail-row">
                <span>Working hours</span>
                <strong>{opportunity.working_hours}</strong>
              </div>
            )}
            <div className="detail-row">
              <span>Compensation</span>
              <strong>{compensationLabel(opportunity)}</strong>
            </div>
            {opportunity.places_total > 0 && (
              <div className="detail-row">
                <span>Places</span>
                <strong>
                  {placesAvailable} of {opportunity.places_total} available
                </strong>
              </div>
            )}
            {opportunity.start_date && (
              <div className="detail-row">
                <span>Start date</span>
                <strong>{deadlineLabel(opportunity.start_date)}</strong>
              </div>
            )}
          </div>

          {/* HOW TO APPLY */}
          <div className="detail-section">
            <h3>
              <i className="fas fa-file-signature"></i> How to apply
            </h3>
            <p className="mb-3">
              {opportunity.application_instructions ||
                "Apply directly through the Uzizi Link platform. Complete the short wizard and upload the required documents."}
            </p>

            <div className="detail-row">
              <span>Required documents</span>
              <strong style={{ textAlign: "right" }}>
                {requiredDocs.length > 0
                  ? requiredDocs.map((d) => DOC_LABELS[d] || String(d).replaceAll("_", " ").toLowerCase()).join(", ")
                  : "CV / resume"}
              </strong>
            </div>
            <div className="detail-row">
              <span>Application deadline</span>
              <strong className="text-danger">{deadlineLabel(opportunity.closing_date)}</strong>
            </div>
          </div>
        </div>

        <div className="drawer-footer">
          {applyDisabled ? (
            <button
              type="button"
              className="btn btn-primary w-full"
              disabled
              style={{ opacity: 0.6 }}
            >
              {hasApplied
                ? "Already applied"
                : isFull
                  ? "No places available"
                  : !isOpen
                    ? "Applications closed"
                    : "Unavailable"}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary w-full"
              onClick={handleApply}
            >
              {isLoggedIn ? "Apply for this placement" : "Sign in to apply"}
            </button>
          )}
          <p className="apply-hint">
            {hasApplied
              ? "You can track this application from your dashboard."
              : !isOpen
                ? "This opportunity is no longer accepting applications."
                : isFull
                  ? "All places for this opportunity have been filled."
                  : isLoggedIn
                    ? "You will review your profile before submitting."
                    : "You will be asked to sign in or create an account."}
          </p>
        </div>
      </aside>
    </>
  );
}