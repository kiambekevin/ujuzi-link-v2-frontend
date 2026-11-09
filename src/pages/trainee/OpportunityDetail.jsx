import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  Download,
  FileText,
  Info,
  ListChecks,
  MapPin,
  Send,
  ShieldCheck,
  Sparkles,
  Timer,
  Users,
  Wallet,
} from "lucide-react";
import { api, errorMessage } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  Modal,
  PageLoader,
  Spinner,
  StatusBadge,
  useFetch,
} from "../../components/ui";
import { fmtDate, fmtMoney } from "../../lib/constants";
import "./OpportunityDetail.css";

const MAX_COVER_LETTER = 2000;

export default function OpportunityDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { data: opp, loading, error } = useFetch(
    () => api.get(`/opportunities/${id}/`),
    [id]
  );
  const [applyOpen, setApplyOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [docIds, setDocIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [saving, setSaving] = useState(false);

  const isTrainee = user?.role === "TRAINEE";

  const toggleSave = async () => {
    if (!isTrainee) return;
    setSaving(true);
    try {
      await api.post(`/opportunities/${id}/${opp.is_saved ? "unsave" : "save"}/`);
      toast.success(opp.is_saved ? "Removed from saved." : "Saved for later!");
      opp.is_saved = !opp.is_saved;
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    setApplyError("");
    setSubmitting(true);
    try {
      await api.post(`/opportunities/${id}/apply/`, {
        cover_letter: coverLetter,
        document_ids: docIds,
      });
      toast.success("Application submitted!");
      setApplyOpen(false);
      navigate("/app/applications");
    } catch (err) {
      setApplyError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <PageLoader />
      </div>
    );
  }

  if (error || !opp) {
    return (
      <div className="page">
        <div className="odt-notfound">
          <div className="odt-notfound-icon">
            <Briefcase size={28} strokeWidth={2} />
          </div>
          <h3>Opportunity not found</h3>
          <p>It may have been removed or closed.</p>
          <Link to="/app/opportunities" className="btn btn-primary btn-sm">
            <ArrowLeft size={13} strokeWidth={2.5} /> Back to opportunities
          </Link>
        </div>
      </div>
    );
  }

  const isOpen = opp.is_open;

  return (
    <div className="page" style={{ maxWidth: 1000 }}>
      {/* Top bar */}
      <div className="odt-topbar">
        <Link to="/app/opportunities" className="odt-back">
          <ArrowLeft size={14} strokeWidth={2.5} /> Back to opportunities
        </Link>
        <div className="odt-topbar-actions">
          {isTrainee && (
            <button
              className="btn btn-outline btn-sm"
              onClick={toggleSave}
              disabled={saving}
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              {saving ? (
                <Spinner small />
              ) : opp.is_saved ? (
                <BookmarkCheck size={14} strokeWidth={2.5} />
              ) : (
                <Bookmark size={14} strokeWidth={2.5} />
              )}
              {opp.is_saved ? "Saved" : "Save"}
            </button>
          )}
          {isTrainee && opp.has_applied && (
            <span className="odt-applied-badge">
              <CheckCircle2 size={13} strokeWidth={2.75} /> You applied
            </span>
          )}
          {isTrainee && !opp.has_applied && isOpen && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setApplyOpen(true)}
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <Send size={13} strokeWidth={2.5} /> Apply now
            </button>
          )}
        </div>
      </div>

      {/* Hero */}
      <section className="odt-hero">
        <div className="odt-title-row">
          <h1>{opp.title}</h1>
          <StatusBadge status={opp.status} />
        </div>

        <div className="odt-org">
          <Building2 size={14} strokeWidth={2.25} />
          <strong>{opp.organization?.name}</strong>
          {opp.organization?.verified && (
            <span className="odt-verified">
              <ShieldCheck size={11} strokeWidth={2.75} /> Verified employer
            </span>
          )}
        </div>

        <div className="odt-badges">
          <span className="odt-badge odt-badge--type">
            <Briefcase size={12} strokeWidth={2.5} />
            {opp.type_display || opp.type}
          </span>
          <span className="odt-badge odt-badge--mode">
            <MapPin size={12} strokeWidth={2.5} />
            {opp.work_mode_display || opp.work_mode}
          </span>
          <span className="odt-badge odt-badge--pay">
            <Wallet size={12} strokeWidth={2.5} />
            {opp.compensation_display || opp.compensation}
          </span>
          {opp.is_closing_soon && (
            <span className="odt-badge odt-badge--closing">
              <Clock size={12} strokeWidth={2.5} /> Closing soon
            </span>
          )}
        </div>

        {opp.description && (
          <>
            <h3 className="odt-section-title">
              <FileText size={16} strokeWidth={2.25} /> About this opportunity
            </h3>
            <p className="odt-description">{opp.description}</p>
          </>
        )}

        {(opp.skills || []).length > 0 && (
          <>
            <h3 className="odt-section-title">
              <Sparkles size={16} strokeWidth={2.25} /> Skills required
            </h3>
            <div className="odt-skills">
              {opp.skills.map((s) => (
                <span key={s} className="odt-skill">
                  <Sparkles size={10} strokeWidth={3} /> {s}
                </span>
              ))}
            </div>
          </>
        )}

        {opp.match_reasons?.length > 0 && (
          <div className="odt-match">
            <div className="odt-match-head">
              <span className="odt-match-head-icon">
                <Sparkles size={14} strokeWidth={2.5} />
              </span>
              Why this matches you
            </div>
            <ul className="odt-match-list">
              {opp.match_reasons.map((r) => (
                <li key={r}>
                  <CheckCircle2 size={12} strokeWidth={3} />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Two-column: details + requirements */}
      <div className="odt-grid">
        <section className="odt-card">
          <h3 className="odt-section-title">
            <Info size={16} strokeWidth={2.25} /> Details
          </h3>
          <div className="odt-dl">
            <div className="odt-dl-row">
              <span className="odt-dl-label">
                <MapPin size={13} strokeWidth={2.5} /> Location
              </span>
              <span className="odt-dl-value">
                {opp.county}
                {opp.location ? `, ${opp.location}` : ""}
              </span>
            </div>
            <div className="odt-dl-row">
              <span className="odt-dl-label">
                <Timer size={13} strokeWidth={2.5} /> Duration
              </span>
              <span className="odt-dl-value">
                {opp.duration_display ||
                  `${opp.duration_value} ${opp.duration_unit?.toLowerCase()}`}
              </span>
            </div>
            <div className="odt-dl-row">
              <span className="odt-dl-label">
                <Clock size={13} strokeWidth={2.5} /> Working hours
              </span>
              <span className="odt-dl-value">{opp.working_hours || "—"}</span>
            </div>
            {opp.stipend_amount && (
              <div className="odt-dl-row">
                <span className="odt-dl-label">
                  <CircleDollarSign size={13} strokeWidth={2.5} /> Stipend
                </span>
                <span className="odt-dl-value is-highlight">
                  {fmtMoney(opp.stipend_amount)}
                </span>
              </div>
            )}
            <div className="odt-dl-row">
              <span className="odt-dl-label">
                <Users size={13} strokeWidth={2.5} /> Places
              </span>
              <span className="odt-dl-value">
                {opp.places_available} of {opp.places_total} available
              </span>
            </div>
            <div className="odt-dl-row">
              <span className="odt-dl-label">
                <CalendarDays size={13} strokeWidth={2.5} /> Start date
              </span>
              <span className="odt-dl-value">{fmtDate(opp.start_date)}</span>
            </div>
            <div className="odt-dl-row">
              <span className="odt-dl-label">
                <CalendarDays size={13} strokeWidth={2.5} /> Deadline
              </span>
              <span className="odt-dl-value is-highlight">
                {fmtDate(opp.closing_date)}
              </span>
            </div>
            {opp.min_age && (
              <div className="odt-dl-row">
                <span className="odt-dl-label">
                  <Users size={13} strokeWidth={2.5} /> Minimum age
                </span>
                <span className="odt-dl-value">{opp.min_age} years</span>
              </div>
            )}
          </div>
        </section>

        <section className="odt-card">
          <h3 className="odt-section-title">
            <ListChecks size={16} strokeWidth={2.25} /> Requirements &amp;
            instructions
          </h3>

          {opp.qualifications && (
            <div className="odt-req-block">
              <div className="odt-req-label">
                <FileText size={11} strokeWidth={2.5} /> Qualifications
              </div>
              <p className="odt-req-body">{opp.qualifications}</p>
            </div>
          )}
          {opp.eligibility_criteria && (
            <div className="odt-req-block">
              <div className="odt-req-label">
                <CheckCircle2 size={11} strokeWidth={2.5} /> Eligibility
              </div>
              <p className="odt-req-body">{opp.eligibility_criteria}</p>
            </div>
          )}
          {opp.skills_gained && (
            <div className="odt-req-block">
              <div className="odt-req-label">
                <Sparkles size={11} strokeWidth={2.5} /> Skills you'll gain
              </div>
              <p className="odt-req-body">{opp.skills_gained}</p>
            </div>
          )}
          {opp.application_instructions && (
            <div className="odt-req-block">
              <div className="odt-req-label">
                <Send size={11} strokeWidth={2.5} /> How to apply
              </div>
              <p className="odt-req-body">{opp.application_instructions}</p>
            </div>
          )}
          {(opp.required_documents || []).length > 0 && (
            <div className="odt-req-block">
              <div className="odt-req-label">
                <FileText size={11} strokeWidth={2.5} /> Documents required
              </div>
              <div className="odt-docs">
                {opp.required_documents.map((d) => (
                  <span key={d} className="odt-doc">
                    <FileText size={11} strokeWidth={2.5} /> {d}
                  </span>
                ))}
              </div>
            </div>
          )}
          {opp.rejection_reason && (
            <div className="odt-reject">
              <AlertCircle size={14} strokeWidth={2.5} />
              <span>
                <strong>Note: </strong>
                {opp.rejection_reason}
              </span>
            </div>
          )}
        </section>
      </div>

      {/* Apply modal */}
      {applyOpen && (
        <Modal title={`Apply — ${opp.title}`} onClose={() => setApplyOpen(false)}>
          {applyError && (
            <div className="odt-modal-error">
              <AlertCircle size={14} strokeWidth={2.5} />
              <span>{applyError}</span>
            </div>
          )}

          <form onSubmit={submitApplication}>
            <div className="odt-field">
              <label className="odt-field-label">
                Cover letter / statement of interest
              </label>
              <textarea
                className="textarea"
                rows={6}
                value={coverLetter}
                maxLength={MAX_COVER_LETTER}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell the employer why you are a great fit…"
              />
              <div
                className={`odt-char-count${
                  coverLetter.length > MAX_COVER_LETTER - 100 ? " is-low" : ""
                }`}
              >
                {coverLetter.length} / {MAX_COVER_LETTER}
              </div>
            </div>

            <DocumentsPicker onSelect={setDocIds} />

            <div className="odt-modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setApplyOpen(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <Spinner small />
                ) : (
                  <>
                    <Send size={14} strokeWidth={2.5} /> Submit application
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Documents picker                                                    */
/* ------------------------------------------------------------------ */
function DocumentsPicker({ onSelect }) {
  const { data } = useFetch(() => api.get("/profile/documents/"));
  const [selected, setSelected] = useState([]);
  const docs = data?.results || [];

  if (docs.length === 0) return null;

  const toggle = (id) => {
    const next = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];
    setSelected(next);
    onSelect(next);
  };

  return (
    <div className="odt-field">
      <label className="odt-field-label">Attach documents (optional)</label>
      <div className="odt-doc-picker">
        {docs.map((d) => {
          const isOn = selected.includes(d.id);
          return (
            <button
              type="button"
              key={d.id}
              className={`odt-doc-option${isOn ? " is-selected" : ""}`}
              onClick={() => toggle(d.id)}
            >
              <div className="odt-doc-icon">
                <FileText size={14} strokeWidth={2.25} />
              </div>
              <div className="odt-doc-info">
                <div className="odt-doc-title">
                  {d.title || d.doc_type}
                </div>
                {d.created_at && (
                  <div className="odt-doc-meta">
                    Uploaded {fmtDate(d.created_at)}
                  </div>
                )}
              </div>
              <CheckCircle2
                className="odt-doc-check"
                size={16}
                strokeWidth={2.5}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}