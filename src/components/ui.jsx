import { useEffect, useState } from "react";
import { statusBadge } from "../lib/constants";

export function StatusBadge({ status }) {
  const { cls, label } = statusBadge(status);
  return <span className={`badge ${cls}`}>{label}</span>;
}

export function Card({ children, className = "", hover = false, pad = false, onClick }) {
  const classes = ["card", className, hover && "card-hover", pad && "card-pad"].filter(Boolean).join(" ");
  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
}

export function StatCard({ icon, label, value, sub, accent = false }) {
  return (
    <Card pad hover={false} className={accent ? "stat-accent" : ""}>
      <div className="row between">
        <div>
          <div className="tiny bold" style={{ color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {label}
          </div>
          <div style={{ fontSize: "1.9rem", fontFamily: "var(--font-heading)", fontWeight: 800, marginTop: 4 }}>{value}</div>
          {sub && <div className="tiny muted mt-8">{sub}</div>}
        </div>
        {icon && (
          <div
            style={{
              width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
              background: accent ? "linear-gradient(135deg, var(--primary), var(--accent-dark))" : "var(--primary-soft)",
              color: accent ? "#fff" : "var(--primary-dark)", fontSize: "1.15rem",
            }}
          >
            <i className={`fas ${icon}`} />
          </div>
        )}
      </div>
    </Card>
  );
}

export function Modal({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${wide ? "modal-wide" : ""}`}>
        <div className="row between mb-16">
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <i className="fas fa-times" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Spinner({ small = false }) {
  return <div className={`spinner ${small ? "spinner-sm" : ""}`} />;
}

export function PageLoader() {
  return <Spinner />;
}

export function EmptyState({ icon = "fa-inbox", title, text, action }) {
  return (
    <Card>
      <div className="empty">
        <i className={`fas ${icon}`} />
        <h4>{title}</h4>
        {text && <p className="small">{text}</p>}
        {action && <div className="mt-16">{action}</div>}
      </div>
    </Card>
  );
}

export function Pagination({ page, count, pageSize = 20, onPage }) {
  const pages = Math.max(1, Math.ceil(count / pageSize));
  if (pages <= 1) return null;
  const items = [];
  const start = Math.max(1, Math.min(page - 2, pages - 4));
  for (let p = start; p <= Math.min(pages, start + 4); p++) items.push(p);
  return (
    <div className="pagination">
      <button className="page-btn" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        <i className="fas fa-chevron-left" />
      </button>
      {start > 1 && <span className="page-btn" style={{ border: "none" }}>…</span>}
      {items.map((p) => (
        <button key={p} className={`page-btn ${p === page ? "active" : ""}`} onClick={() => onPage(p)}>
          {p}
        </button>
      ))}
      {start + 4 < pages && <span className="page-btn" style={{ border: "none" }}>…</span>}
      <button className="page-btn" disabled={page >= pages} onClick={() => onPage(page + 1)}>
        <i className="fas fa-chevron-right" />
      </button>
    </div>
  );
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs">
      {tabs.map((t) => (
        <button key={t.key} className={`tab ${active === t.key ? "active" : ""}`} onClick={() => onChange(t.key)}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function Alert({ type = "error", children }) {
  return <div className={`form-${type === "error" ? "error" : "success"}`}>{children}</div>;
}

export function useFetch(fn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fn()
      .then((res) => {
        if (!cancelled) setData(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}

export function useAsyncAction() {
  const [loading, setLoading] = useState(false);
  const run = async (fn, { onSuccess, onError } = {}) => {
    setLoading(true);
    try {
      const res = await fn();
      onSuccess && onSuccess(res);
      return res;
    } catch (err) {
      onError && onError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  return { loading, run };
}
