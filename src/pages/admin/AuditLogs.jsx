import { useState } from "react";
import { api } from "../../api/client";
import { EmptyState, PageLoader, Pagination, useFetch } from "../../components/ui";
import { fmtDate } from "../../lib/constants";

const ENTITY_TYPES = ["organization", "opportunity", "user", "application", "placement", "complaint", "passport"];

export default function AuditLogs() {
  const [query, setQuery] = useState({ page: 1, entity_type: "", action: "", search: "" });

  const params = new URLSearchParams({ page: String(query.page) });
  if (query.entity_type) params.set("entity_type", query.entity_type);
  if (query.action) params.set("action", query.action);
  if (query.search) params.set("search", query.search);
  const { data, loading } = useFetch(() => api.get(`/admin/audit-logs/?${params}`), [query]);

  const patch = (next) => setQuery({ ...query, ...next, page: 1 });

  return (
    <div className="page">
      <h2 style={{ margin: 0, marginBottom: 16 }}>Audit trail</h2>
      <div className="row wrap gap-8 mb-16">
        <select className="input input-sm" style={{ width: "auto" }} value={query.entity_type} onChange={(e) => patch({ entity_type: e.target.value })}>
          <option value="">All entities</option>
          {ENTITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input className="input flex-1" style={{ minWidth: 200 }} placeholder="Search action, entity id, details…" value={query.search} onChange={(e) => patch({ search: e.target.value })} />
      </div>

      {loading ? (
        <PageLoader />
      ) : (data?.results || []).length === 0 ? (
        <EmptyState icon="fa-clipboard-list" title="No audit entries" text="Administrative actions are recorded here." />
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>When</th><th>Actor</th><th>Action</th><th>Entity</th><th>Details</th></tr></thead>
              <tbody>
                {(data?.results || []).map((log) => (
                  <tr key={log.id}>
                    <td className="small">{fmtDate(log.created_at, true)}</td>
                    <td className="small">{log.actor || "System"}</td>
                    <td><span className="badge badge-indigo">{log.action}</span></td>
                    <td className="small">{log.entity_type} #{log.entity_id}</td>
                    <td className="tiny muted" style={{ maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {JSON.stringify(log.details || {})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={query.page} count={data?.count || 0} onPage={(page) => setQuery({ ...query, page })} />
        </>
      )}
    </div>
  );
}
