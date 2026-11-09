import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  Clock,
  Coins,
  FileText,
  GraduationCap,
  Hourglass,
  Info,
  Layers,
  MapPin,
  Pause,
  Pencil,
  Play,
  ShieldAlert,
  Sparkles,
  User,
  Users,
  X,
} from "lucide-react";
import { api, errorMessage } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  Alert,
  EmptyState,
  Modal,
  PageLoader,
  Pagination,
  Spinner,
  StatusBadge,
  useAsyncAction,
  useFetch,
} from "../../components/ui";
import {
  fmtDate,
  fmtMoney,
  labelFor,
  OPPORTUNITY_TYPES,
  statusBadge,
  WORK_MODES,
} from "../../lib/constants";
import "./OpportunityManage.css";

const APPLICATION_STATUSES = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "REJECTED",
  "OFFERED",
  "OFFER_ACCEPTED",
  "OFFER_DECLINED",
  "WITHDRAWN",
];

function initialsFor(app) {
  const parts = (app.applicant_name || "").split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `#${app.applicant}`;
}

export default function OpportunityManage() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [extendOpen, setExtendOpen] = useState(false);
  const [extendDate, setExtendDate] = useState("");
  const [tick, setTick] = useState(0);
  const { loading: actionLoading, run } = useAsyncAction();

  const { data: opp, loading, error } = useFetch(() => api.get(`/opportunities/${id}/`), [id, tick]);

  const appParams = new URLSearchParams({ page: String(page) });
  if (statusFilter) appParams.set("status", statusFilter);
  const { data: apps } = useFetch(
    () => api.get(`/opportunities/${id}/applications/?${appParams}`),
    [id, page, statusFilter, tick]
  );

  const isOfficer = user?.role === "ORG_OFFICER";

  const act = (action, extra = {}) =>
    run(() => api.post(`/opportunities/${id}/${action}/`, extra), {
      onSuccess: (res) => {
        toast.success(res.data.detail || "Done.");
        setTick((t) => t + 1);
      },
      onError: (err) => toast.error(errorMessage(err)),
    });

  const doExtend = () => {
    if (!extendDate) return;
    act("extend", { closing_date: extendDate });
    setExtendOpen(false);
    setExtendDate("");
  };

  if (loading) return <PageLoader />;
  if (error || !opp) return <Alert>Advert not found or you do not have access to it.</Alert>;

  const applicationResults = apps?.results || [];
  const isClosedStatus = ["CLOSED", "EXPIRED", "REMOVED"].includes(opp.status);

  return (
    <div className="page">
      {/* ---------- Header ---------- */}
      <header className="opm-header">
        <div className="opm-header-main">
          <h2>{opp.title}</h2>
          <div className="opm-meta">
            <span className="opm-meta-item">
              <Layers size={13} strokeWidth={2.25} />
              {labelFor(OPPORTUNITY_TYPES, opp.type)}
            </span>
            <span className="opm-meta-sep" />
            <span className="opm-meta-item">
              <MapPin size={13} strokeWidth={2.25} />
              {opp.county}
            </span>
            <span className="opm-meta-sep" />
            <span className="opm-meta-item">
              <Clock size={13} strokeWidth={2.25} />
              {labelFor(WORK_MODES, opp.work_mode)}
            </span>
          </div>
        </div>
        <div className="opm-header-actions">
          <StatusBadge status={opp.status} />
          {isOfficer && opp.status !== "CLOSED" && opp.status !== "REMOVED" && (
            <Link
              className="btn btn-outline btn-sm"
              to={`/app/org/opportunities/${opp.id}/edit`}
            >
              <Pencil size={13} strokeWidth={2.5} /> Edit
            </Link>
          )}
        </div>
      </header>

      {/* ---------- Rejection banner ---------- */}
      {opp.rejection_reason && (
        <div className="opm-reject" role="alert">
          <ShieldAlert size={18} strokeWidth={2.25} />
          <div>
            <strong>Rejected by administrator</strong>
            {opp.rejection_reason}. Edit the advert and resubmit.
          </div>
        </div>
      )}

      {/* ---------- Overview ---------- */}
      <div className="opm-overview">
        {/* Details card */}
        <section className="opm-card">
          <div className="opm-card-head">
            <div className="opm-card-head-icon">
              <FileText size={17} strokeWidth={2.25} />
            </div>
            <h4>Details</h4>
          </div>

          <p className="opm-description">{opp.description}</p>

          <div className="opm-details">
            <div className="opm-detail">
              <span className="opm-detail-label">
                <Users size={12} strokeWidth={2.5} /> Places
              </span>
              <span className="opm-detail-value">
                {opp.places_available} of {opp.places_total} available
              </span>
            </div>
            <div className="opm-detail">
              <span className="opm-detail-label">
                <CalendarDays size={12} strokeWidth={2.5} /> Dates
              </span>
              <span className="opm-detail-value">
                {fmtDate(opp.start_date)} → {fmtDate(opp.closing_date)}
              </span>
            </div>
            <div className="opm-detail">
              <span className="opm-detail-label">
                <Hourglass size={12} strokeWidth={2.5} /> Duration
              </span>
              <span className="opm-detail-value">
                {opp.duration_value} {opp.duration_unit?.toLowerCase()}
              </span>
            </div>
            <div className="opm-detail">
              <span className="opm-detail-label">
                <Clock size={12} strokeWidth={2.5} /> Hours
              </span>
              <span className="opm-detail-value is-muted">
                {opp.working_hours || "Not set"}
              </span>
            </div>
            {opp.compensation === "STIPEND" && (
              <div className="opm-detail">
                <span className="opm-detail-label">
                  <Coins size={12} strokeWidth={2.5} /> Stipend
                </span>
                <span className="opm-detail-value">
                  {fmtMoney(opp.stipend_amount)} / month
                </span>
              </div>
            )}
            {opp.min_age != null && (
              <div className="opm-detail">
                <span className="opm-detail-label">
                  <User size={12} strokeWidth={2.5} /> Min. age
                </span>
                <span className="opm-detail-value">{opp.min_age}</span>
              </div>
            )}
          </div>

          {(opp.skills || []).length > 0 && (
            <div className="opm-skills">
              {opp.skills.map((s) => (
                <span key={s} className="opm-skill">
                  <Sparkles size={11} strokeWidth={2.5} /> {s}
                </span>
              ))}
            </div>
          )}

          {opp.eligibility_criteria && (
            <div className="opm-eligibility">
              <strong>
                <GraduationCap size={13} strokeWidth={2.5} /> Eligibility
              </strong>
              <div>{opp.eligibility_criteria}</div>
            </div>
          )}
        </section>

        {/* Lifecycle card */}
        <section className="opm-card">
          <div className="opm-card-head">
            <div className="opm-card-head-icon">
              <Layers size={17} strokeWidth={2.25} />
            </div>
            <h4>Lifecycle</h4>
          </div>

          <div className="opm-lifecycle">
            <div className="opm-lifecycle-actions">
              {opp.status === "DRAFT" && isOfficer && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => act("submit")}
                  disabled={actionLoading}
                >
                  Submit for review
                </button>
              )}

              {opp.status === "ACTIVE" && isOfficer && (
                <>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => act("pause")}
                    disabled={actionLoading}
                  >
                    <Pause size={13} strokeWidth={2.5} /> Pause
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setExtendOpen(true)}
                  >
                    <CalendarPlus size={13} strokeWidth={2.5} /> Extend
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => act("close")}
                    disabled={actionLoading}
                  >
                    <X size={13} strokeWidth={2.5} /> Close
                  </button>
                </>
              )}

              {opp.status === "PAUSED" && isOfficer && (
                <>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => act("resume")}
                    disabled={actionLoading}
                  >
                    <Play size={13} strokeWidth={2.5} /> Resume
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => act("close")}
                    disabled={actionLoading}
                  >
                    <X size={13} strokeWidth={2.5} /> Close
                  </button>
                </>
              )}
            </div>

            {opp.status === "PENDING_REVIEW" && (
              <div className="opm-lifecycle-note">
                <Info size={14} strokeWidth={2.5} />
                Awaiting administrator approval. You can still edit the advert while it is under
                review.
              </div>
            )}

            {isClosedStatus && (
              <div className="opm-lifecycle-note is-closed">
                <Info size={14} strokeWidth={2.5} />
                This advert is no longer open and cannot be actioned.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ---------- Applications ---------- */}
      <section className="opm-apps-card">
        <div className="opm-apps-head">
          <h4>
            <Users size={17} strokeWidth={2.25} /> Applications
            <span className="opm-apps-count">{apps?.count ?? 0}</span>
          </h4>
          <label className="opm-apps-filter">
            <Layers size={14} strokeWidth={2.25} />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All statuses</option>
              {APPLICATION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {statusBadge(s).label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {applicationResults.length === 0 ? (
          <EmptyState
            icon="fa-users"
            title="No applications"
            text="Applications to this advert will appear here."
          />
        ) : (
          <div className="table-wrap" style={{ borderRadius: 0, border: "none" }}>
            <table className="opm-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                {applicationResults.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div className="opm-applicant">
                        <div className="opm-avatar">{initialsFor(a)}</div>
                        <div>
                          <div className="opm-applicant-name">
                            {a.applicant_name || `Applicant #${a.applicant}`}
                          </div>
                          <div className="opm-applicant-id">ID #{a.applicant}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={a.status} />
                    </td>
                    <td>
                      <span className="opm-date">
                        <CalendarDays size={13} strokeWidth={2.25} />
                        {fmtDate(a.submitted_at, true)}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Link
                        className="btn btn-outline btn-sm opm-review-btn"
                        to={`/app/org/applications/${a.id}`}
                      >
                        Review <ArrowRight size={13} strokeWidth={2.5} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {applicationResults.length > 0 && (
          <div style={{ padding: "16px 22px" }}>
            <Pagination page={page} count={apps?.count || 0} onPage={setPage} />
          </div>
        )}
      </section>

      {/* ---------- Extend modal ---------- */}
      {extendOpen && (
        <Modal title="Extend closing date" onClose={() => setExtendOpen(false)}>
          <label className="opm-field" style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-dark)" }}>
              New closing date
            </span>
            <input
              type="date"
              className="input"
              value={extendDate}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setExtendDate(e.target.value)}
            />
            <span style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
              Must be after today. Extending a CLOSED advert with places remaining will reactivate it.
            </span>
          </label>
          <div className="opm-modal-actions">
            <button
              className="btn btn-outline"
              onClick={() => setExtendOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              disabled={!extendDate || actionLoading}
              onClick={doExtend}
            >
              {actionLoading ? (
                <Spinner small />
              ) : (
                <>
                  <CalendarPlus size={14} strokeWidth={2.5} /> Extend
                </>
              )}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}