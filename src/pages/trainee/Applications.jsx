import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import { EmptyState, PageLoader, Pagination, StatusBadge, useFetch } from "../../components/ui";
import { fmtDate, statusBadge } from "../../lib/constants";

const STATUSES = ["SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "OFFERED", "OFFER_ACCEPTED", "REJECTED", "WITHDRAWN"];

export default function Applications() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const { data, loading } = useFetch(
    () => api.get(`/applications/?page=${page}${status ? `&status=${status}` : ""}`),
    [page, status]
  );

  return (
    <div className="page">
      <div className="row wrap mb-16" style={{ gap: 8 }}>
        <button className={`chip ${status === "" ? "active" : ""}`} onClick={() => { setStatus(""); setPage(1); }}>All</button>
        {STATUSES.map((s) => (
          <button key={s} className={`chip ${status === s ? "active" : ""}`} onClick={() => { setStatus(s); setPage(1); }}>
            {statusBadge(s).label}
          </button>
        ))}
      </div>

      {loading ? (
        <PageLoader />
      ) : data?.count === 0 ? (
        <EmptyState
          icon="fa-file-lines"
          title="No applications yet"
          text="Apply to opportunities and track your journey here."
          action={<Link to="/app/opportunities" className="btn btn-primary btn-sm">Find opportunities</Link>}
        />
      ) : (
        <>
          <div className="table-wrap card">
            <table className="table">
              <thead>
                <tr>
                  <th>Opportunity</th>
                  <th>Organisation</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Applied</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {(data?.results || []).map((a) => (
                  <tr key={a.id}>
                    <td><b>{a.opportunity?.title}</b></td>
                    <td>{a.opportunity?.organization_name || "—"}</td>
                    <td className="small muted">{a.opportunity?.type?.replace(/_/g, " ")}</td>
                    <td><StatusBadge status={a.status} /></td>
                    <td className="small muted">{fmtDate(a.submitted_at)}</td>
                    <td className="right">
                      <Link to={`/app/applications/${a.id}`} className="btn btn-outline btn-sm">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} count={data?.count || 0} onPage={setPage} />
        </>
      )}
    </div>
  );
}
