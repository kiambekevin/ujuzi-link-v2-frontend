import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  CalendarDays,
  Inbox,
  MailOpen,
  User,
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
import "./Applications.css";

const STATUSES = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "REJECTED",
  "OFFERED",
  "OFFER_ACCEPTED",
  "OFFER_DECLINED",
  "WITHDRAWN",
];

/* Deterministic initials from a display name or applicant id */
function initialsFor(application) {
  const source = application.applicant_name || "";
  const parts = source.split(" ").filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `#${application.applicant}`;
}

export default function Applications() {
  const [query, setQuery] = useState({ page: 1, status: "" });
  const params = new URLSearchParams({ page: String(query.page) });
  if (query.status) params.set("status", query.status);
  const { data, loading } = useFetch(() => api.get(`/applications/?${params}`), [query]);

  const patch = (next) => setQuery({ ...query, ...next, page: 1 });
  const results = data?.results || [];

  return (
    <div className="page">
      <header className="apps-header">
        <div>
          <h2>Incoming applications</h2>
          <p className="apps-header-sub">
            Review and progress applications submitted to your adverts.
          </p>
        </div>
      </header>

      <div className="apps-filters">
        <button
          className={`apps-filter${query.status === "" ? " active" : ""}`}
          onClick={() => patch({ status: "" })}
        >
          <span className="apps-filter-dot" /> All
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            className={`apps-filter${query.status === s ? " active" : ""}`}
            onClick={() => patch({ status: s })}
          >
            <span className="apps-filter-dot" />
            {statusBadge(s).label}
          </button>
        ))}
      </div>

      {loading ? (
        <PageLoader />
      ) : results.length === 0 ? (
        <EmptyState
          icon="fa-envelope-open-text"
          title="No applications"
          text="Applications to your adverts will appear here as young people apply."
        />
      ) : (
        <>
          {/* -------- Desktop table -------- */}
          <div className="apps-table-card">
            <table className="apps-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Opportunity</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                {results.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div className="apps-applicant">
                        <div className="apps-avatar">{initialsFor(a)}</div>
                        <div className="apps-applicant-info">
                          <div className="apps-applicant-name">
                            {a.applicant_name || `Applicant #${a.applicant}`}
                          </div>
                          <div className="apps-applicant-id">
                            <User size={11} strokeWidth={2.5} style={{ marginRight: 4 }} />
                            ID #{a.applicant}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="apps-opportunity">
                        <Briefcase size={14} strokeWidth={2.25} />
                        <span className="apps-opportunity-title">
                          {a.opportunity?.title || "-"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={a.status} />
                    </td>
                    <td>
                      <span className="apps-date">
                        <CalendarDays size={13} strokeWidth={2.25} />
                        {fmtDate(a.submitted_at, true)}
                      </span>
                    </td>
                    <td>
                      <div className="apps-action">
                        <Link
                          className="btn btn-outline btn-sm apps-review-btn"
                          to={`/app/org/applications/${a.id}`}
                        >
                          Review <ArrowRight size={13} strokeWidth={2.5} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* -------- Mobile cards -------- */}
          <div className="apps-mobile-list">
            {results.map((a) => (
              <article key={a.id} className="apps-mobile-card">
                <div className="apps-mobile-card-head">
                  <div className="apps-applicant">
                    <div className="apps-avatar">{initialsFor(a)}</div>
                    <div className="apps-applicant-info">
                      <div className="apps-applicant-name">
                        {a.applicant_name || `Applicant #${a.applicant}`}
                      </div>
                      <div className="apps-applicant-id">ID #{a.applicant}</div>
                    </div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
                <div className="apps-mobile-meta">
                  <div className="apps-mobile-meta-row">
                    <Briefcase size={14} strokeWidth={2.25} />
                    {a.opportunity?.title || "-"}
                  </div>
                  <div className="apps-mobile-meta-row">
                    <CalendarDays size={14} strokeWidth={2.25} />
                    Submitted {fmtDate(a.submitted_at, true)}
                  </div>
                </div>
                <div className="apps-mobile-actions">
                  <Link
                    className="btn btn-primary btn-sm apps-review-btn"
                    to={`/app/org/applications/${a.id}`}
                  >
                    Review <ArrowRight size={13} strokeWidth={2.5} />
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