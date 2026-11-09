import { useState } from "react";
import {
  Armchair,
  Building2,
  CalendarDays,
  CheckCircle2,
  Layers,
  MapPin,
  Megaphone,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { api, errorMessage } from "../../api/client";
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

const FILTERS = [
  ["", "All"],
  ["PENDING_REVIEW", "Pending Review"],
  ["ACTIVE", "Active"],
  ["PAUSED", "Paused"],
  ["CLOSED", "Closed"],
  ["EXPIRED", "Expired"],
  ["REMOVED", "Removed"],
];

const MODAL_COPY = {
  approve: {
    title: "Approve advert",
    body: "Matching trainees will be notified and the advert goes live immediately.",
    confirm: "Approve advert",
    confirmClass: "btn-primary",
    icon: CheckCircle2,
  },
  reject: {
    title: "Reject advert",
    body: "Provide a reason. The organisation will see this on their advert and can edit and resubmit.",
    confirm: "Reject advert",
    confirmClass: "btn-danger",
    icon: XCircle,
  },
  remove: {
    title: "Remove advert",
    body: "This permanently removes the advert from the platform. This action cannot be undone.",
    confirm: "Remove advert",
    confirmClass: "btn-danger",
    icon: Trash2,
  },
};

export default function Opportunities() {
  const toast = useToast();
  const [query, setQuery] = useState({ page: 1, status: "", search: "" });
  const [modal, setModal] = useState(null);
  const [reason, setReason] = useState("");
  const [tick, setTick] = useState(0);
  const { loading: actionLoading, run } = useAsyncAction();

  const params = new URLSearchParams({ page: String(query.page) });
  if (query.status) params.set("status", query.status);
  if (query.search) params.set("search", query.search);
  const { data, loading } = useFetch(
    () => api.get(`/admin/opportunities/?${params}`),
    [query, tick]
  );

  const patch = (next) => setQuery({ ...query, ...next, page: 1 });
  const results = data?.results || [];

  const openModal = (opp, action) => {
    setReason("");
    setModal({ id: opp.id, action });
  };

  const act = () =>
    run(
      () =>
        api.post(
          `/admin/opportunities/${modal.id}/${modal.action}/`,
          modal.action === "reject" ? { reason } : {}
        ),
      {
        onSuccess: (res) => {
          toast.success(res.data.detail || "Done.");
          setModal(null);
          setReason("");
          setTick((t) => t + 1);
        },
        onError: (err) => toast.error(errorMessage(err)),
      }
    );

  const copy = modal ? MODAL_COPY[modal.action] : null;

  return (
    <div className="page">
      <header className="aop-header">
        <div>
          <h2>Opportunity moderation</h2>
          <p className="aop-header-sub">
            Review, approve or remove adverts submitted by organisations.
          </p>
        </div>
      </header>

      {/* Toolbar */}
      <div className="aop-toolbar">
        <div className="aop-filters">
          {FILTERS.map(([value, label]) => (
            <button
              key={value || "all"}
              className={`aop-filter${query.status === value ? " active" : ""}`}
              onClick={() => patch({ status: value })}
            >
              <span className="aop-filter-dot" />
              {label}
            </button>
          ))}
        </div>
        <div className="aop-search">
          <Search size={15} strokeWidth={2.25} />
          <input
            placeholder="Search title or organisation…"
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
          title="No adverts"
          text="No adverts match your filters."
        />
      ) : (
        <>
          <div className="aop-table-card">
            <table className="aop-table">
              <thead>
                <tr>
                  <th>Advert</th>
                  <th>Organisation</th>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Status</th>
                  <th aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                {results.map((opp) => (
                  <tr key={opp.id}>
                    <td>
                      <div className="aop-title">
                        <div className="aop-title-icon">
                          <Megaphone size={16} strokeWidth={2.25} />
                        </div>
                        <div className="aop-title-info">
                          <div className="aop-title-name">{opp.title}</div>
                          <div className="aop-title-meta">
                            <span className="aop-title-meta-item">
                              <MapPin size={11} strokeWidth={2.5} />
                              {opp.county || "County not set"}
                            </span>
                            <span className="aop-title-sep" />
                            <span className="aop-places">
                              <Armchair size={10} strokeWidth={2.5} />
                              {opp.places_available}/{opp.places_total}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="aop-cell">
                        <Building2 size={13} strokeWidth={2.25} />
                        <span className="aop-cell-text">
                          {opp.organization?.name || "—"}
                        </span>
                      </span>
                    </td>
                    <td>
                      <span className="aop-cell">
                        <Layers size={13} strokeWidth={2.25} />
                        {labelFor(OPPORTUNITY_TYPES, opp.type)}
                      </span>
                    </td>
                    <td>
                      <span className="aop-cell">
                        <CalendarDays size={13} strokeWidth={2.25} />
                        {fmtDate(opp.start_date)} → {fmtDate(opp.closing_date)}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={opp.status} />
                      {opp.rejection_reason && (
                        <div
                          className="aop-rejection"
                          title={opp.rejection_reason}
                        >
                          “{opp.rejection_reason}”
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="aop-actions">
                        {opp.status === "PENDING_REVIEW" && (
                          <>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => openModal(opp, "approve")}
                            >
                              <CheckCircle2 size={13} strokeWidth={2.5} />{" "}
                              Approve
                            </button>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => openModal(opp, "reject")}
                            >
                              <XCircle size={13} strokeWidth={2.5} /> Reject
                            </button>
                          </>
                        )}
                        {["CLOSED", "EXPIRED", "REJECTED"].includes(
                          opp.status
                        ) && (
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => openModal(opp, "remove")}
                          >
                            <Trash2 size={13} strokeWidth={2.5} /> Remove
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={query.page}
            count={data?.count || 0}
            onPage={(page) => setQuery({ ...query, page })}
          />
        </>
      )}

      {modal && copy && (
        <Modal title={copy.title} onClose={() => setModal(null)}>
          <p className="aop-modal-body">{copy.body}</p>

          {modal.action === "reject" && (
            <label className="aop-field">
              <span className="aop-field-label">
                Reason <span className="req">*</span>
              </span>
              <textarea
                className="input"
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Shown to the organisation"
              />
            </label>
          )}

          <div className="aop-modal-actions">
            <button
              className="btn btn-outline"
              onClick={() => setModal(null)}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button
              className={`btn ${copy.confirmClass}`}
              disabled={
                actionLoading || (modal.action === "reject" && !reason.trim())
              }
              onClick={act}
            >
              {actionLoading ? (
                <Spinner small />
              ) : (
                <>
                  <copy.icon size={14} strokeWidth={2.5} />
                  {copy.confirm}
                </>
              )}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}