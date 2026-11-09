// src/pages/org/Opportunities.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Megaphone,
  MapPin,
  CalendarDays,
  Pencil,
  Trash2,
  Send,
  Pause,
  Play,
  CalendarPlus,
  X,
  Armchair,
  Clock,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { api, errorMessage } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  EmptyState,
  Modal,
  PageLoader,
  Pagination,
  Spinner,
  StatusBadge,
  useAsyncAction,
  useFetch,
} from "../../components/ui";
import { fmtDate, labelFor, OPPORTUNITY_TYPES } from "../../lib/constants";
import "./Opportunities.css";

const STATUS_FILTERS = [
  ["", "All"],
  ["DRAFT", "Draft"],
  ["PENDING_REVIEW", "Pending Review"],
  ["ACTIVE", "Active"],
  ["PAUSED", "Paused"],
  ["CLOSED", "Closed"],
  ["REJECTED", "Rejected"],
];

const WRITE_ROLES = ["ORG_OFFICER", "ORG_SUPERVISOR"];

const STATUS_ACCENT = {
  DRAFT: "draft",
  PENDING_REVIEW: "pending",
  ACTIVE: "active",
  PAUSED: "paused",
  CLOSED: "closed",
  REJECTED: "rejected",
};

export default function Opportunities() {
  const { user } = useAuth();
  const toast = useToast();

  const [query, setQuery] = useState({ page: 1, status: "", search: "" });
  const [extendFor, setExtendFor] = useState(null);
  const [extendDate, setExtendDate] = useState("");
  const [deleteFor, setDeleteFor] = useState(null);
  const [tick, setTick] = useState(0);
  const { loading: actionLoading, run } = useAsyncAction();

  const params = new URLSearchParams();
  params.set("mine", "1");
  params.set("all", "1");
  params.set("page", String(query.page));
  if (query.status) params.set("status", query.status);
  if (query.search) params.set("search", query.search);

  const { data, loading } = useFetch(
    () => api.get(`/opportunities/?${params.toString()}`),
    [query, tick]
  );

  const canWrite = WRITE_ROLES.includes(user?.role);
  const bump = () => setTick((t) => t + 1);

  const act = (opp, action, extra = {}) => {
    if (!canWrite) {
      toast.error("Only employer staff can manage adverts.");
      return;
    }
    run(() => api.post(`/opportunities/${opp.id}/${action}/`, extra), {
      onSuccess: (res) => {
        toast.success(res.data?.detail || "Done.");
        bump();
      },
      onError: (err) => toast.error(errorMessage(err)),
    });
  };

  const doExtend = () => {
    if (!extendFor || !extendDate) return;
    run(
      () =>
        api.post(`/opportunities/${extendFor.id}/extend/`, {
          closing_date: extendDate,
        }),
      {
        onSuccess: (res) => {
          toast.success(res.data?.detail || "Advert extended.");
          setExtendFor(null);
          setExtendDate("");
          bump();
        },
        onError: (err) => toast.error(errorMessage(err)),
      }
    );
  };

  const doDelete = () => {
    if (!deleteFor) return;
    run(() => api.delete(`/opportunities/${deleteFor.id}/`), {
      onSuccess: () => {
        toast.success("Advert deleted.");
        setDeleteFor(null);
        bump();
      },
      onError: (err) => toast.error(errorMessage(err)),
    });
  };

  const patch = (next) => setQuery({ ...query, ...next, page: 1 });

  const results = data?.results || [];

  return (
    <div className="page">
      {/* Header */}
      <header className="opps-header">
        <div>
          <h2>Opportunity adverts</h2>
          <p className="opps-header-sub">
            Manage internships, attachments, apprenticeships and more.
          </p>
        </div>
        {canWrite && (
          <Link to="/app/org/opportunities/new" className="btn btn-primary">
            <Plus size={16} strokeWidth={2.5} /> New advert
          </Link>
        )}
      </header>

      {/* Toolbar */}
      <div className="opps-toolbar">
        <div className="opps-filters">
          {STATUS_FILTERS.map(([value, label]) => (
            <button
              key={value || "all"}
              className={`opps-filter${query.status === value ? " active" : ""}`}
              onClick={() => patch({ status: value })}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="opps-search">
          <Search size={15} strokeWidth={2.25} />
          <input
            placeholder="Search your adverts…"
            value={query.search}
            onChange={(e) => patch({ search: e.target.value })}
          />
        </div>
      </div>

      {loading ? (
        <PageLoader />
      ) : results.length === 0 ? (
        <EmptyState
          icon="fa-bullhorn"
          title={query.status || query.search ? "No adverts match" : "No adverts yet"}
          text="Advertise internships, attachments, apprenticeships and more."
          action={
            canWrite && (
              <Link to="/app/org/opportunities/new" className="btn btn-primary btn-sm">
                Create your first advert
              </Link>
            )
          }
        />
      ) : (
        <>
          <div className="opps-list">
            {results.map((opp) => (
              <AdvertCard
                key={opp.id}
                opp={opp}
                canWrite={canWrite}
                actionLoading={actionLoading}
                onAct={act}
                onExtend={() => {
                  setExtendFor(opp);
                  setExtendDate("");
                }}
                onDelete={() => setDeleteFor(opp)}
              />
            ))}
          </div>

          <Pagination
            page={query.page}
            count={data?.count || 0}
            onPage={(page) => setQuery({ ...query, page })}
          />
        </>
      )}

      {/* Extend modal */}
      {extendFor && (
        <Modal title={`Extend “${extendFor.title}”`} onClose={() => setExtendFor(null)}>
          <label className="field">
            <span className="field-label">New closing date</span>
            <input
              type="date"
              className="input"
              value={extendDate}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setExtendDate(e.target.value)}
            />
            <span className="tiny muted">
              Must be after today. Extending a CLOSED advert with places remaining will reactivate
              it as ACTIVE.
            </span>
          </label>
          <div className="opps-modal-actions">
            <button
              className="btn btn-outline"
              onClick={() => setExtendFor(null)}
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
                  <CalendarPlus size={15} strokeWidth={2.5} /> Extend closing date
                </>
              )}
            </button>
          </div>
        </Modal>
      )}

      {/* Delete modal */}
      {deleteFor && (
        <Modal title={`Delete “${deleteFor.title}”?`} onClose={() => setDeleteFor(null)}>
          <p className="opps-confirm-body">
            This permanently removes the advert. Applications already received are retained per
            data-retention policy, but the advert will no longer be visible to trainees.
          </p>
          <div className="opps-modal-actions">
            <button
              className="btn btn-outline"
              onClick={() => setDeleteFor(null)}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button className="btn btn-danger" onClick={doDelete} disabled={actionLoading}>
              {actionLoading ? (
                <Spinner small />
              ) : (
                <>
                  <Trash2 size={15} strokeWidth={2.5} /> Delete advert
                </>
              )}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============================================================
   Advert card
   ============================================================ */
function AdvertCard({ opp, canWrite, actionLoading, onAct, onExtend, onDelete }) {
  const accent = STATUS_ACCENT[opp.status] || "draft";

  return (
    <article className={`opps-card opps-card--${accent}`}>
      <div className="opps-card-head">
        <div>
          <h4 className="opps-card-title">
            <Link to={`/app/org/opportunities/${opp.id}`}>{opp.title}</Link>
          </h4>
          <div className="opps-card-meta">
            <span className="opps-card-meta-item">
              <Megaphone size={13} strokeWidth={2.25} />
              {labelFor(OPPORTUNITY_TYPES, opp.type)}
            </span>
            <span className="opps-meta-sep" />
            <span className="opps-card-meta-item">
              <MapPin size={13} strokeWidth={2.25} />
              {opp.county}
            </span>
            <span className="opps-meta-sep" />
            <span className="opps-card-meta-item">
              <CalendarDays size={13} strokeWidth={2.25} />
              {fmtDate(opp.start_date)} → {fmtDate(opp.closing_date)}
            </span>
          </div>
        </div>
        <StatusBadge status={opp.status} />
      </div>

      <div className="opps-tags">
        <span className="opps-tag opps-tag--places">
          <Armchair size={12} strokeWidth={2.5} />
          {opp.places_available} of {opp.places_total} places left
        </span>
        {(opp.skills || []).slice(0, 3).map((s) => (
          <span key={s} className="opps-tag">
            {s}
          </span>
        ))}
      </div>

      <div className="opps-actions">
        {canWrite &&
          ["DRAFT", "REJECTED", "PENDING_REVIEW", "ACTIVE", "PAUSED", "CLOSED"].includes(
            opp.status
          ) && (
            <Link
              className="btn btn-outline btn-sm"
              to={`/app/org/opportunities/${opp.id}/edit`}
            >
              <Pencil size={13} strokeWidth={2.5} /> Edit
            </Link>
          )}

        {opp.status === "DRAFT" && canWrite && (
          <>
            <button
              className="btn btn-primary btn-sm"
              disabled={actionLoading}
              onClick={() => onAct(opp, "submit")}
            >
              <Send size={13} strokeWidth={2.5} /> Submit for review
            </button>
            <button
              className="btn btn-outline btn-sm"
              disabled={actionLoading}
              onClick={onDelete}
            >
              <Trash2 size={13} strokeWidth={2.5} /> Delete
            </button>
          </>
        )}

        {opp.status === "REJECTED" && canWrite && (
          <>
            <button
              className="btn btn-primary btn-sm"
              disabled={actionLoading}
              onClick={() => onAct(opp, "submit")}
            >
              <RotateCcw size={13} strokeWidth={2.5} /> Re-submit for review
            </button>
            <button
              className="btn btn-outline btn-sm"
              disabled={actionLoading}
              onClick={onDelete}
            >
              <Trash2 size={13} strokeWidth={2.5} /> Delete
            </button>
          </>
        )}

        {opp.status === "ACTIVE" && canWrite && (
          <>
            <button
              className="btn btn-outline btn-sm"
              disabled={actionLoading}
              onClick={() => onAct(opp, "pause")}
            >
              <Pause size={13} strokeWidth={2.5} /> Pause
            </button>
            <button className="btn btn-outline btn-sm" onClick={onExtend}>
              <CalendarPlus size={13} strokeWidth={2.5} /> Extend
            </button>
            <button
              className="btn btn-outline btn-sm"
              disabled={actionLoading}
              onClick={() => onAct(opp, "close")}
            >
              <X size={13} strokeWidth={2.5} /> Close
            </button>
          </>
        )}

        {opp.status === "PAUSED" && canWrite && (
          <>
            <button
              className="btn btn-primary btn-sm"
              disabled={actionLoading}
              onClick={() => onAct(opp, "resume")}
            >
              <Play size={13} strokeWidth={2.5} /> Resume
            </button>
            <button className="btn btn-outline btn-sm" onClick={onExtend}>
              <CalendarPlus size={13} strokeWidth={2.5} /> Extend
            </button>
            <button
              className="btn btn-outline btn-sm"
              disabled={actionLoading}
              onClick={() => onAct(opp, "close")}
            >
              <X size={13} strokeWidth={2.5} /> Close
            </button>
          </>
        )}

        {opp.status === "CLOSED" && canWrite && (
          <>
            {opp.places_available > 0 && (
              <button className="btn btn-primary btn-sm" onClick={onExtend}>
                <CalendarPlus size={13} strokeWidth={2.5} /> Reopen via extend
              </button>
            )}
            <button
              className="btn btn-outline btn-sm"
              disabled={actionLoading}
              onClick={onDelete}
            >
              <Trash2 size={13} strokeWidth={2.5} /> Delete
            </button>
          </>
        )}

        {opp.status === "PENDING_REVIEW" && (
          <span className="opps-pending-note">
            <Clock size={13} strokeWidth={2.5} />
            Awaiting administrator approval.
            {canWrite && (
              <>
                {" · "}
                <button
                  type="button"
                  className="opps-withdraw"
                  disabled={actionLoading}
                  onClick={onDelete}
                >
                  Withdraw
                </button>
              </>
            )}
          </span>
        )}
      </div>
    </article>
  );
}