import { Link } from "react-router-dom";
import { api } from "../../api/client";
import { EmptyState, PageLoader, StatusBadge, useFetch } from "../../components/ui";
import { fmtDate } from "../../lib/constants";

export default function Placements() {
  const { data, loading } = useFetch(() => api.get("/placements/"));

  return (
    <div className="page">
      {loading ? (
        <PageLoader />
      ) : (data?.results || []).length === 0 ? (
        <EmptyState
          icon="fa-handshake"
          title="No placements yet"
          text="When you accept an offer and start, your placement appears here with your learning plan."
          action={<Link to="/app/opportunities" className="btn btn-primary btn-sm">Find opportunities</Link>}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {(data?.results || []).map((p) => (
            <div key={p.id} className="card card-pad">
              <div className="row between wrap mb-8">
                <h4>{p.opportunity_title || "Placement"}</h4>
                <StatusBadge status={p.status} />
              </div>
              <p className="small muted mb-16">
                <i className="fas fa-building" style={{ marginRight: 8 }} />{p.organization_name}
                <span style={{ margin: "0 10px" }}>•</span>
                <i className="fas fa-calendar" style={{ marginRight: 8 }} />{fmtDate(p.start_date)} → {fmtDate(p.expected_end_date || p.actual_end_date)}
                {p.supervisor_name && (
                  <>
                    <span style={{ margin: "0 10px" }}>•</span>
                    <i className="fas fa-user-tie" style={{ marginRight: 8 }} />Supervisor: {p.supervisor_name}
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
