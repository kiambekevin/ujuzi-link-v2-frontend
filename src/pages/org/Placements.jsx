import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CalendarRange,
  Handshake,
  User,
  UserCog,
} from "lucide-react";
import { api } from "../../api/client";
import {
  EmptyState,
  PageLoader,
  Pagination,
  StatusBadge,
  useFetch,
} from "../../components/ui";
import { fmtDate, statusBadge } from "../../lib/constants";
import "./Placements.css";

const STATUSES = [
  "PENDING_CONFIRMATION",
  "ACTIVE",
  "EXTENDED",
  "COMPLETED",
  "DISCONTINUED",
];

function initialsFor(placement) {
  const parts = (placement.youth_name || "").split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `#${placement.trainee}`;
}

function periodFor(p) {
  return `${fmtDate(p.start_date)} → ${fmtDate(p.expected_end_date || p.actual_end_date)}`;
}

export default function Placements() {
  const [query, setQuery] = useState({ page: 1, status: "" });
  const params = new URLSearchParams({ page: String(query.page) });
  if (query.status) params.set("status", query.status);
  const { data, loading } = useFetch(() => api.get(`/placements/?${params}`), [query]);

  const patch = (next) => setQuery({ ...query, ...next, page: 1 });
  const results = data?.results || [];

  return (
    <div className="page">
      <header className="plc-header">
        <div>
          <h2>Placements</h2>
          <p className="plc-header-sub">
            Active trainees, supervisors and placement timelines across your organisation.
          </p>
        </div>
      </header>

      <div className="plc-filters">
        <button
          className={`plc-filter${query.status === "" ? " active" : ""}`}
          onClick={() => patch({ status: "" })}
        >
          <span className="plc-filter-dot" /> All
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            className={`plc-filter${query.status === s ? " active" : ""}`}
            onClick={() => patch({ status: s })}
          >
            <span className="plc-filter-dot" />
            {statusBadge(s).label}
          </button>
        ))}
      </div>

      {loading ? (
        <PageLoader />
      ) : results.length === 0 ? (
        <EmptyState
          icon="fa-handshake"
          title="No placements"
          text="When an applicant accepts your offer, the placement appears here for confirmation."
        />
      ) : (
        <>
          {/* -------- Desktop table -------- */}
          <div className="plc-table-card">
            <table className="plc-table">
              <thead>
                <tr>
                  <th>Participant</th>
                  <th>Opportunity</th>
                  <th>Supervisor</th>
                  <th>Period</th>
                  <th>Status</th>
                  <th aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                {results.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="plc-participant">
                        <div className="plc-avatar">{initialsFor(p)}</div>
                        <div className="plc-participant-info">
                          <div className="plc-participant-name">
                            {p.youth_name || `Trainee #${p.trainee}`}
                          </div>
                          <div className="plc-participant-id">
                            <User size={11} strokeWidth={2.5} /> ID #{p.trainee}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="plc-cell">
                        <Briefcase size={14} strokeWidth={2.25} />
                        <span className="plc-cell-text">
                          {p.opportunity_title || "—"}
                        </span>
                      </div>
                    </td>
                    <td>
                      {p.supervisor_name ? (
                        <div className="plc-cell">
                          <UserCog size={14} strokeWidth={2.25} />
                          <span className="plc-cell-text">{p.supervisor_name}</span>
                        </div>
                      ) : (
                        <div className="plc-cell is-muted">
                          <UserCog size={14} strokeWidth={2.25} />
                          <span>Not assigned</span>
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="plc-period">
                        <CalendarRange size={13} strokeWidth={2.25} />
                        {periodFor(p)}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={p.status} />
                    </td>
                    <td>
                      <div className="plc-action">
                        <Link
                          className="btn btn-outline btn-sm plc-manage-btn"
                          to={`/app/org/placements/${p.id}`}
                        >
                          Manage <ArrowRight size={13} strokeWidth={2.5} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* -------- Mobile cards -------- */}
          <div className="plc-mobile-list">
            {results.map((p) => (
              <article key={p.id} className="plc-mobile-card">
                <div className="plc-mobile-head">
                  <div className="plc-participant">
                    <div className="plc-avatar">{initialsFor(p)}</div>
                    <div className="plc-participant-info">
                      <div className="plc-participant-name">
                        {p.youth_name || `Trainee #${p.trainee}`}
                      </div>
                      <div className="plc-participant-id">ID #{p.trainee}</div>
                    </div>
                  </div>
                  <StatusBadge status={p.status} />
                </div>

                <div className="plc-mobile-meta">
                  <div className="plc-mobile-meta-row">
                    <Briefcase size={14} strokeWidth={2.25} />
                    {p.opportunity_title || "—"}
                  </div>
                  <div className="plc-mobile-meta-row">
                    <UserCog size={14} strokeWidth={2.25} />
                    {p.supervisor_name || "Supervisor not assigned"}
                  </div>
                  <div className="plc-mobile-meta-row">
                    <CalendarRange size={14} strokeWidth={2.25} />
                    {periodFor(p)}
                  </div>
                </div>

                <div className="plc-mobile-actions">
                  <Link
                    className="btn btn-primary btn-sm plc-manage-btn"
                    to={`/app/org/placements/${p.id}`}
                  >
                    Manage <ArrowRight size={13} strokeWidth={2.5} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <Pagination
            page={query.page}
            count={data?.count || 0}
            onPage={(page) => setQuery({ ...query, page })}
          />
        </>
      )}
    </div>
  );
}