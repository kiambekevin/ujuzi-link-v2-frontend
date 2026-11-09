import { useState } from "react";
import { api, errorMessage } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { EmptyState, PageLoader, Pagination, useFetch } from "../../components/ui";
import { fmtDate } from "../../lib/constants";

export default function Notifications() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const { data, loading } = useFetch(() => api.get(`/notifications/?page=${page}`), [page]);

  const markRead = async (n) => {
    if (n.read_at) return;
    try {
      await api.post(`/notifications/${n.id}/read/`);
      n.read_at = new Date().toISOString();
    } catch {
      /* noop */
    }
  };

  const markAll = async () => {
    try {
      await api.post("/notifications/read-all/");
      toast.success("All notifications marked as read.");
      window.location.reload();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <div className="page" style={{ maxWidth: 860 }}>
      <div className="row between mb-16">
        <h3 className="muted small">{data?.count || 0} notification{(data?.count || 0) === 1 ? "" : "s"}</h3>
        <button className="btn btn-outline btn-sm" onClick={markAll}><i className="fas fa-check-double" /> Mark all read</button>
      </div>
      {loading ? (
        <PageLoader />
      ) : (data?.results || []).length === 0 ? (
        <EmptyState icon="fa-bell" title="No notifications" text="Updates about your applications and opportunities will appear here." />
      ) : (
        <>
          <div className="card">
            {(data?.results || []).map((n) => (
              <div
                key={n.id}
                className="row"
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--border-light)",
                  background: n.read_at ? undefined : "linear-gradient(90deg, rgba(192,132,252,0.08), transparent)",
                  cursor: "pointer",
                }}
                onClick={() => markRead(n)}
              >
                <span
                  className="avatar"
                  style={{
                    width: 40, height: 40,
                    background: n.read_at ? "var(--primary-soft)" : "linear-gradient(135deg, var(--primary), var(--accent-dark))",
                    color: n.read_at ? "var(--primary-dark)" : "#fff",
                  }}
                >
                  <i className="fas fa-bell" />
                </span>
                <div style={{ flex: 1 }}>
                  <div className="small bold">{n.title}</div>
                  <div className="small muted">{n.body}</div>
                  <div className="tiny muted mt-8"><i className="fas fa-clock" style={{ marginRight: 6 }} />{fmtDate(n.created_at, true)}</div>
                </div>
                {!n.read_at && <span className="badge badge-purple">New</span>}
              </div>
            ))}
          </div>
          <Pagination page={page} count={data?.count || 0} onPage={setPage} />
        </>
      )}
    </div>
  );
}
