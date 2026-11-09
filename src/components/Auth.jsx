import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return <div className="spinner" style={{ marginTop: 120 }} />;
  }
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

export function RequireRole({ roles, children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" style={{ marginTop: 120 }} />;
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export function AuthLayout({ children, wide = false }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        background: "linear-gradient(160deg, #2e0057 0%, #4b0082 45%, #9333ea 100%)",
      }}
    >
      <div
        className="card card-lg card-pad"
        style={{ width: "100%", maxWidth: wide ? 680 : 440, boxShadow: "var(--shadow-xl)" }}
      >
        <div className="row" style={{ justifyContent: "center", marginBottom: 20 }}>
          <span className="logo-mark" style={{ width: 44, height: 44, borderRadius: 13, background: "linear-gradient(135deg, var(--primary), var(--accent))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.3rem" }}>U</span>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.25rem" }}>Ujuzi Link</div>
            <div className="tiny muted">Kenya's work-based learning platform</div>
          </div>
        </div>
        {children} 
      </div>
    </div>
  );
}
