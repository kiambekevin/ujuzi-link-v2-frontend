import { useState } from "react";
import {
  AlertCircle,
  Ban,
  CheckCircle2,
  Clock,
  Eye,
  Gavel,
  Hash,
  Info,
  Pencil,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { api, errorMessage } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import {
  EmptyState,
  Modal,
  PageLoader,
  Pagination,
  Spinner,
  useAsyncAction,
  useFetch,
} from "../../components/ui";
import {
  fmtDate,
  labelFor,
  COMPLAINT_CATEGORIES,
  COMPLAINT_SUBJECTS,
} from "../../lib/constants";
import "./Complaints.css";

const STATUSES = ["OPEN", "UNDER_REVIEW", "RESOLVED", "DISMISSED"];

const STATUS_META = {
  OPEN: { label: "Open", cls: "acmp-card--open", icon: AlertCircle, pillCls: "badge-amber" },
  UNDER_REVIEW: { label: "Under review", cls: "acmp-card--review", icon: Eye, pillCls: "badge-blue" },
  RESOLVED: { label: "Resolved", cls: "acmp-card--resolved", icon: CheckCircle2, pillCls: "badge-green" },
  DISMISSED: { label: "Dismissed", cls: "acmp-card--dismissed", icon: Ban, pillCls: "badge-neutral" },
};

function initialsFor(name = "", fallback = "?") {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return fallback.slice(0, 2).toUpperCase();
}

export default function Complaints() {
  const toast = useToast();
  const [query, setQuery] = useState({ page: 1, status: "" });
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ status: "", resolution_notes: "" });
  const [tick, setTick] = useState(0);
  const { loading: saving, run } = useAsyncAction();

  const params = new URLSearchParams({ page: String(query.page) });
  if (query.status) params.set("status", query.status);
  const { data, loading } = useFetch(
    () => api.get(`/complaints/?${params}`),
    [query, tick]
  );

  const patch = (next) => setQuery({ ...query, ...next, page: 1 });
  const results = data?.results || [];

  const openEdit = (complaint) => {
    setEditing(complaint);
    setForm({
      status:
        complaint.status === "OPEN" ? "UNDER_REVIEW" : complaint.status,
      resolution_notes: complaint.resolution_notes || "",
    });
  };

  const save = () =>
    run(() => api.patch(`/admin/complaints/${editing.id}/`, form), {
      onSuccess: () => {
        toast.success("Complaint updated.");
        setEditing(null);
        setTick((t) => t + 1);
      },
      onError: (err) => toast.error(errorMessage(err)),
    });

  return (
    <div className="page">
      <header className="acmp-header">
        <div>
          <h2>Complaints &amp; safeguarding</h2>
          <p className="acmp-header-sub">
            Triage complaints reported by trainees, organisations and staff.
            Resolutions are recorded in the audit trail.
          </p>
        </div>
      </header>

      <div className="acmp-filters">
        <button
          className={`acmp-filter${query.status === "" ? " active" : ""}`}
          onClick={() => patch({ status: "" })}
        >
          <ShieldAlert size={13} strokeWidth={2.5} /> All
        </button>
        {STATUSES.map((s) => {
          const meta = STATUS_META[s];
          const Icon = meta.icon;
          return (
            <button
              key={s}
              className={`acmp-filter${query.status === s ? " active" : ""}`}
              onClick={() => patch({ status: s })}
            >
              <Icon size={13} strokeWidth={2.5} />
              {meta.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <PageLoader />
      ) : results.length === 0 ? (
        <EmptyState
          icon="fa-shield-alt"
          title="No complaints"
          text="Complaints reported by platform users appear here."
        />
      ) : (
        <>
          <div className="acmp-list">
            {results.map((c) => {
              const meta = STATUS_META[c.status] || STATUS_META.OPEN;
              const Icon = meta.icon;
              return (
                <article key={c.id} className={`acmp-card ${meta.cls}`}>
                  <div className="acmp-card-head">
                    <div className="acmp-tags">
                      <span className="acmp-tag acmp-tag--category">
                        <ShieldAlert size={10} strokeWidth={3} />
                        {labelFor(COMPLAINT_CATEGORIES, c.category)}
                      </span>
                      <span className="acmp-tag acmp-tag--subject">
                        <Hash size={10} strokeWidth={3} />
                        {labelFor(COMPLAINT_SUBJECTS, c.subject_type)} #
                        {c.subject_id}
                      </span>
                    </div>
                    <span className={`badge ${meta.pillCls}`}>
                      <Icon size={11} strokeWidth={2.75} /> {meta.label}
                    </span>
                  </div>

                  <p className="acmp-description">{c.description}</p>

                  <div className="acmp-meta">
                    <span className="acmp-meta-item">
                      <div className="acmp-reporter-avatar">
                        {initialsFor(c.reporter_name || "", `#${c.reporter}`)}
                      </div>
                      <span className="acmp-reporter">
                        {c.reporter_name || `User #${c.reporter}`}
                      </span>
                    </span>
                    <span className="acmp-meta-item">
                      <Clock size={12} strokeWidth={2.5} />
                      {fmtDate(c.created_at, true)}
                    </span>
                  </div>

                  {c.resolution_notes && (
                    <div className="acmp-resolution">
                      <Gavel size={14} strokeWidth={2.25} />
                      <div>
                        <span className="acmp-resolution-label">
                          Resolution notes
                        </span>
                        {c.resolution_notes}
                      </div>
                    </div>
                  )}

                  <div className="acmp-actions">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => openEdit(c)}
                    >
                      <Pencil size={13} strokeWidth={2.5} /> Manage complaint
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <Pagination
            page={query.page}
            count={data?.count || 0}
            onPage={(page) => setQuery({ ...query, page })}
          />
        </>
      )}

      {editing && (
        <Modal
          title={`Manage complaint #${editing.id}`}
          onClose={() => setEditing(null)}
        >
          <p className="acmp-modal-body">
            Update the status and record how this complaint was handled. Notes
            are visible in the audit log and may be shared with the reporter.
          </p>

          <div className="acmp-field">
            <span className="acmp-field-label">Status</span>
            <div className="acmp-status-options">
              {STATUSES.map((s) => {
                const meta = STATUS_META[s];
                const Icon = meta.icon;
                const active = form.status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    className={`acmp-status-option${active ? " active" : ""}`}
                    onClick={() => setForm({ ...form, status: s })}
                  >
                    <Icon size={15} strokeWidth={2.5} />
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="acmp-field">
            <span className="acmp-field-label">Resolution notes</span>
            <textarea
              className="input"
              rows={3}
              value={form.resolution_notes}
              onChange={(e) =>
                setForm({ ...form, resolution_notes: e.target.value })
              }
              placeholder="How was this handled?"
            />
          </label>

          <div className="acmp-modal-actions">
            <button
              className="btn btn-outline"
              onClick={() => setEditing(null)}
              disabled={saving}
            >
              Cancel
            </button>
            <button className="btn btn-primary" disabled={saving} onClick={save}>
              {saving ? (
                <Spinner small />
              ) : (
                <>
                  <CheckCircle2 size={14} strokeWidth={2.5} /> Save changes
                </>
              )}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}