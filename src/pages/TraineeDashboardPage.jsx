import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopBar from "../components/layout/TopBar.jsx";
import BrandRow from "../components/layout/BrandRow.jsx";
import MainNav from "../components/layout/MainNav.jsx";
import Footer from "../components/layout/Footer.jsx";
import { api, errorMessage, isAuthenticated } from "../api/client";
import "../styles/trainee-dashboard.css";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PENDING_STATUSES = ["SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "OFFERED"];
const ACTIVE_PLACEMENT = ["ACTIVE", "PENDING_CONFIRMATION"];

const STATUS_CLASS = {
  SUBMITTED: "pending",
  UNDER_REVIEW: "pending",
  SHORTLISTED: "info",
  REJECTED: "danger",
  OFFERED: "info",
  OFFER_ACCEPTED: "success",
  OFFER_DECLINED: "muted",
  WITHDRAWN: "muted",
};

const pickList = (res) => {
  if (!res || res.status !== "fulfilled") return [];
  const d = res.value?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.results)) return d.results;
  return [];
};

function fmtDate(iso) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

// Coerce anything the backend might send to a printable string.
// Fixes: "Objects are not valid as a React child".
function text(v) {
  if (v == null) return "-";
  if (typeof v === "string") return v || "-";
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) {
    const parts = v.map(text).filter((x) => x && x !== "-");
    return parts.length ? parts.join(", ") : "-";
  }
  if (typeof v === "object") {
    return v.name ?? v.title ?? v.organization_name ?? v.label ?? v.code ?? "-";
  }
  return String(v);
}

function computeProfileCompletion(profile) {
  const checks = [
    { key: "name", label: "Add your full name", done: Boolean(profile?.first_name && profile?.last_name) },
    { key: "contact", label: "Verify email & phone", done: Boolean(profile?.email && profile?.phone) },
    { key: "dob", label: "Add date of birth", done: Boolean(profile?.date_of_birth) },
    { key: "county", label: "Add your county", done: Boolean(profile?.county) },
    { key: "bio", label: "Write a short bio", done: Boolean(profile?.bio) },
    { key: "edu", label: "Add at least one education entry", done: (profile?.education?.length || 0) > 0 },
    { key: "skills", label: "Add at least 3 skills", done: (profile?.skills?.length || 0) >= 3 },
    { key: "docs", label: "Upload a CV or academic certificate", done: (profile?.documents?.length || 0) > 0 },
    { key: "consent", label: "Accept data-processing consent", done: Boolean(profile?.data_processing_consent) },
  ];
  const done = checks.filter((c) => c.done).length;
  return { pct: Math.round((done / checks.length) * 100), checks };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TraineeDashboardPage() {
  const navigate = useNavigate();

  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [applications, setApplications] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [savedOpps, setSavedOpps] = useState([]);
  const [recommendedOpps, setRecommendedOpps] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(`/login?next=${encodeURIComponent("/dashboard")}`, { replace: true });
    }
  }, [navigate]);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    const results = await Promise.allSettled([
      api.get("/auth/me/"),
      api.get("/applications/"),
      api.get("/placements/"),
      api.get("/opportunities/saved/"),
      api.get("/opportunities/recommended/"),
      api.get("/notifications/"),
      api.get("/profile/"),
    ]);

    const [meRes, appsRes, placementsRes, savedRes, recRes, notifsRes, profileRes] = results;

    if (meRes.status === "fulfilled") setMe(meRes.value.data);
    else if (meRes.status === "rejected") {
      setError(errorMessage(meRes.reason, "Could not load your account."));
    }

    setApplications(pickList(appsRes));
    setPlacements(pickList(placementsRes));
    setSavedOpps(pickList(savedRes));

    let rec = pickList(recRes);
    if (!rec.length) {
      try {
        const { data } = await api.get("/opportunities/?ordering=-created_at&page_size=3");
        rec = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
      } catch {
        /* keep empty */
      }
    }
    setRecommendedOpps(rec);

    setNotifications(pickList(notifsRes));

    const prof = profileRes.status === "fulfilled" ? profileRes.value.data || null : null;
    setProfile(prof);
    setDocuments(Array.isArray(prof?.documents) ? prof.documents : []);

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) return;
    loadDashboard();
  }, [loadDashboard]);

  const user = useMemo(() => {
    const display =
      me?.display_name ||
      [me?.first_name, me?.last_name].filter(Boolean).join(" ") ||
      profile?.full_name ||
      "there";
    const firstName = me?.first_name || profile?.first_name || display.split(" ")[0] || "there";
    return { display, firstName };
  }, [me, profile]);

  const activePlacement = useMemo(
    () => placements.find((p) => ACTIVE_PLACEMENT.includes(p.status)) || null,
    [placements]
  );

  const pendingApplications = useMemo(
    () => applications.filter((a) => PENDING_STATUSES.includes(a.status)),
    [applications]
  );

  const unreadNotifications = useMemo(
    () => notifications.filter((n) => !n.read_at).length,
    [notifications]
  );

  const { pct: profilePct, checks: profileChecks } = useMemo(
    () => computeProfileCompletion(profile),
    [profile]
  );

  const recentApplications = useMemo(
    () =>
      [...applications]
        .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
        .slice(0, 5),
    [applications]
  );

  const recentActivity = useMemo(() => {
    const items = [];
    for (const a of applications.slice(0, 6)) {
      items.push({
        title: `Applied for ${text(a.opportunity?.title) !== "-" ? a.opportunity.title : "opportunity"}`,
        date: a.submitted_at,
        type: "primary",
      });
      if (a.status && a.status !== "SUBMITTED") {
        items.push({
          title: `Application ${a.status_display || a.status}`,
          date: a.submitted_at,
          type: "info",
        });
      }
    }
    return items.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  }, [applications]);

  const actionItems = useMemo(() => {
    const items = [];
    if (pendingApplications.length) {
      items.push({
        id: "pending-apps",
        title: `${pendingApplications.length} application${pendingApplications.length > 1 ? "s" : ""} awaiting response`,
        meta: "Check the applications page for updates",
        metaIcon: "fa-hourglass-half",
        urgent: false,
        done: false,
      });
    }
    if (unreadNotifications) {
      items.push({
        id: "unread-notifs",
        title: `${unreadNotifications} unread notification${unreadNotifications > 1 ? "s" : ""}`,
        meta: "Open notifications to review",
        metaIcon: "fa-bell",
        urgent: false,
        done: false,
      });
    }
    const incomplete = profileChecks.filter((c) => !c.done).slice(0, 3);
    for (const c of incomplete) {
      items.push({
        id: `profile-${c.key}`,
        title: c.label,
        meta: "Improve your profile visibility",
        metaIcon: "fa-user-edit",
        urgent: false,
        done: false,
      });
    }
    return items.slice(0, 5);
  }, [pendingApplications, unreadNotifications, profileChecks]);

  const [dismissedItems, setDismissedItems] = useState([]);
  const toggleActionItem = (id) =>
    setDismissedItems((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleReload = () => loadDashboard();
  const handleMarkAllRead = async () => {
    try {
      await api.post("/notifications/read-all/");
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
      );
    } catch {
      /* silent */
    }
  };

  if (!isAuthenticated()) return null;

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <TopBar />
      <BrandRow />
      <MainNav />

      <header className="page-header" id="main-content">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span>Dashboard</span>
          </div>
          <div className="header-flex">
            <div>
              <h1>Welcome back, {user.firstName} 👋</h1>
              <p className="header-sub">
                Here&apos;s an overview of your placement journey, applications and learning progress.
              </p>
            </div>
            <div className="header-actions">
              <Link to="/opportunities" className="btn btn-light">
                <i className="fas fa-search" aria-hidden="true"></i> Find opportunities
              </Link>
              <Link to="/app/trainee/profile" className="btn btn-outline-light">
                <i className="fas fa-user-edit" aria-hidden="true"></i> Profile
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="page-body">
        <div className="container">
          {error && (
            <div className="apply-empty-state" style={{ marginBottom: "1rem" }}>
              <i className="fas fa-triangle-exclamation" aria-hidden="true"></i>
              <h3>Couldn&apos;t load part of your dashboard</h3>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={handleReload}>
                <i className="fas fa-rotate-right"></i> Retry
              </button>
            </div>
          )}

          <div className="stats-row">
            <StatCard icon="fa-paper-plane" color="primary" value={loading ? "…" : applications.length} label="Applications" />
            <StatCard icon="fa-hourglass-half" color="warning" value={loading ? "…" : pendingApplications.length} label="Awaiting response" />
            <StatCard icon="fa-briefcase" color="success" value={loading ? "…" : placements.filter((p) => p.status === "ACTIVE").length} label="Active placements" />
            <StatCard icon="fa-bookmark" color="info" value={loading ? "…" : savedOpps.length} label="Saved opportunities" />
          </div>

          <div className="dashboard-grid">
            <div className="main-column">
              {activePlacement ? (
                <div className="placement-highlight">
                  <div className="ph-top">
                    <span className="ph-badge">
                      <i className="fas fa-bolt" aria-hidden="true"></i> Active placement
                    </span>
                    <span className="ph-status">
                      <i className="fas fa-check-circle" aria-hidden="true"></i>{" "}
                      {text(activePlacement.status_display ?? activePlacement.status)}
                    </span>
                  </div>
                  <h3>{text(activePlacement.opportunity_title)}</h3>
                  <div className="ph-employer">
                    <i className="fas fa-building" aria-hidden="true"></i>{" "}
                    {text(activePlacement.organization_name ?? activePlacement.organization)}
                  </div>
                  <div className="ph-meta">
                    <div className="ph-meta-item">
                      <i className="fas fa-user-tie" aria-hidden="true"></i>{" "}
                      Supervisor: {text(activePlacement.supervisor_name) === "-" ? "Not assigned" : activePlacement.supervisor_name}
                    </div>
                    <div className="ph-meta-item">
                      <i className="fas fa-calendar-check" aria-hidden="true"></i>{" "}
                      Started: {fmtDate(activePlacement.start_date)}
                    </div>
                    <div className="ph-meta-item">
                      <i className="fas fa-money-bill-wave" aria-hidden="true"></i>{" "}
                      {text(activePlacement.compensation)}
                    </div>
                  </div>
                  <div className="ph-actions">
                    <Link to={`/placements/${activePlacement.id}`} className="btn btn-light">
                      <i className="fas fa-book" aria-hidden="true"></i> View learning plan
                    </Link>
                    <Link to={`/placements/${activePlacement.id}`} className="btn btn-outline-light">
                      <i className="fas fa-clipboard-list" aria-hidden="true"></i> Open logbook
                    </Link>
                  </div>
                </div>
              ) : (
                !loading && (
                  <div className="dash-card">
                    <div className="dash-card-body" style={{ textAlign: "center", padding: "1.5rem" }}>
                      <i className="fas fa-briefcase" aria-hidden="true" style={{ fontSize: "2rem", color: "var(--muted)" }}></i>
                      <h3 style={{ marginTop: "0.6rem" }}>No active placement yet</h3>
                      <p style={{ color: "var(--muted)" }}>Once you accept an offer, your placement will appear here.</p>
                      <Link to="/opportunities" className="btn btn-primary btn-sm">
                        <i className="fas fa-search" aria-hidden="true"></i> Find opportunities
                      </Link>
                    </div>
                  </div>
                )
              )}

              <div className="dash-card">
                <div className="dash-card-header">
                  <h2><i className="fas fa-paper-plane" aria-hidden="true"></i> My applications</h2>
                  <Link to="/applications" className="header-link">
                    View all <i className="fas fa-arrow-right" aria-hidden="true"></i>
                  </Link>
                </div>
                <div className="dash-card-body">
                  {loading ? (
                    <p className="form-step-sub" style={{ margin: 0 }}>Loading applications…</p>
                  ) : recentApplications.length === 0 ? (
                    <p className="form-step-sub" style={{ margin: 0 }}>
                      You haven&apos;t applied to any opportunities yet.{" "}
                      <Link to="/opportunities">Browse opportunities →</Link>
                    </p>
                  ) : (
                    <div className="apps-list">
                      {recentApplications.map((a) => (
                        <Link
                          key={a.id}
                          to={`/applications/${a.id}`}
                          className="app-item"
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <div className="app-logo">
                            <i className="fas fa-briefcase" aria-hidden="true"></i>
                          </div>
                          <div className="app-body">
                            <h4>{text(a.opportunity?.title)}</h4>
                            <div className="app-meta">
                              <span>
                                <i className="fas fa-building" aria-hidden="true"></i>{" "}
                                {text(a.organization ?? a.opportunity?.organization_name ?? a.opportunity?.organization)}
                              </span>
                              <span>
                                <i className="fas fa-calendar" aria-hidden="true"></i>{" "}
                                Applied {fmtDate(a.submitted_at)}
                              </span>
                            </div>
                          </div>
                          <span className={`status-badge ${STATUS_CLASS[a.status] || "pending"}`}>
                            {text(a.status_display ?? a.status)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="dash-card">
                <div className="dash-card-header">
                  <h2><i className="fas fa-star" aria-hidden="true"></i> Recommended for you</h2>
                  <Link to="/opportunities" className="header-link">
                    See more <i className="fas fa-arrow-right" aria-hidden="true"></i>
                  </Link>
                </div>
                <div className="dash-card-body">
                  {loading ? (
                    <p className="form-step-sub" style={{ margin: 0 }}>Loading recommendations…</p>
                  ) : recommendedOpps.length === 0 ? (
                    <p className="form-step-sub" style={{ margin: 0 }}>
                      No recommendations yet - check back after you add skills and education.
                    </p>
                  ) : (
                    <div className="rec-list">
                      {recommendedOpps.slice(0, 3).map((rec) => (
                        <Link to={`/opportunities/${rec.id}`} className="rec-item" key={rec.id}>
                          <div className="rec-logo">
                            <i className="fas fa-briefcase" aria-hidden="true"></i>
                          </div>
                          <div className="rec-body">
                            <div className="rec-title">{text(rec.title)}</div>
                            <div className="rec-meta">
                              {text(rec.organization_name ?? rec.organization)} ·{" "}
                              {text(rec.county)} ·{" "}
                              {rec.duration_display
                                ? rec.duration_display
                                : rec.duration_value
                                  ? `${rec.duration_value} ${String(rec.duration_unit || "").toLowerCase()}`
                                  : "-"}
                            </div>
                            {Array.isArray(rec.skills) && rec.skills.length > 0 && (
                              <div className="rec-tags">
                                {rec.skills.slice(0, 3).map((tag, i) => (
                                  <span className="rec-tag" key={i}>{text(tag)}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <aside className="side-column">
              <div className="dash-card">
                <div className="dash-card-header">
                  <h2><i className="fas fa-user-circle" aria-hidden="true"></i> Profile completion</h2>
                </div>
                <div className="dash-card-body">
                  <div className="profile-completion">
                    <div
                      className="completion-ring"
                      style={{
                        background: `conic-gradient(var(--primary) 0deg ${profilePct * 3.6}deg, var(--border-light) ${profilePct * 3.6}deg 360deg)`,
                      }}
                    >
                      <div className="ring-value">{loading ? "…" : `${profilePct}%`}</div>
                    </div>
                    <h3>{profilePct >= 100 ? "Profile complete!" : "Almost there!"}</h3>
                    <p>Complete these steps to stand out to employers.</p>
                    <ul className="completion-list">
                      {profileChecks.map((t) => (
                        <li key={t.key} className={t.done ? "complete" : "incomplete"}>
                          <i className={`fas ${t.done ? "fa-check-circle" : "fa-circle"}`} aria-hidden="true"></i>{" "}
                          {t.label}
                        </li>
                      ))}
                    </ul>
                    <Link to="/profile" className="btn btn-primary btn-sm">
                      <i className="fas fa-user-edit" aria-hidden="true"></i> Complete profile
                    </Link>
                  </div>
                </div>
              </div>

              <div className="dash-card">
                <div className="dash-card-header">
                  <h2><i className="fas fa-tasks" aria-hidden="true"></i> Action items</h2>
                  <span className="status-badge pending">
                    {actionItems.filter((i) => !dismissedItems.includes(i.id)).length}
                  </span>
                </div>
                <div className="dash-card-body">
                  <div className="task-list">
                    {actionItems.length === 0 ? (
                      <p className="form-step-sub" style={{ margin: 0 }}>You&apos;re all caught up 🎉</p>
                    ) : (
                      actionItems.map((task) => {
                        const done = dismissedItems.includes(task.id);
                        return (
                          <div
                            key={task.id}
                            className={`task-item ${done ? "done" : ""}`}
                            onClick={() => toggleActionItem(task.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                toggleActionItem(task.id);
                              }
                            }}
                          >
                            <div className="task-check">
                              <i className="fas fa-check" aria-hidden="true"></i>
                            </div>
                            <div className="task-body">
                              <div className="task-title">{task.title}</div>
                              <div className="task-meta">
                                <i className={`fas ${task.metaIcon}`} style={{ color: task.metaColor || "inherit" }} aria-hidden="true"></i>{" "}
                                <span className={task.urgent ? "urgent" : ""}>{task.meta}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              <div className="dash-card">
                <div className="dash-card-header">
                  <h2><i className="fas fa-bell" aria-hidden="true"></i> Notifications</h2>
                  <button
                    className="header-link"
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                    onClick={handleMarkAllRead}
                  >
                    Mark all read
                  </button>
                </div>
                <div className="dash-card-body">
                  {loading ? (
                    <p className="form-step-sub" style={{ margin: 0 }}>Loading notifications…</p>
                  ) : notifications.length === 0 ? (
                    <p className="form-step-sub" style={{ margin: 0 }}>No notifications yet.</p>
                  ) : (
                    <div className="notif-list">
                      {notifications.slice(0, 5).map((n) => (
                        <div className={`notif-item ${!n.read_at ? "unread" : ""}`} key={n.id}>
                          <div className="notif-icon primary">
                            <i className="fas fa-bell" aria-hidden="true"></i>
                          </div>
                          <div className="notif-body">
                            <div className="notif-title">{text(n.title)}</div>
                            <div className="notif-text">{text(n.body)}</div>
                            <div className="notif-time">
                              <i className="fas fa-clock" aria-hidden="true"></i>{" "}
                              {fmtDate(n.created_at)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="dash-card">
                <div className="dash-card-header">
                  <h2><i className="fas fa-history" aria-hidden="true"></i> Recent activity</h2>
                </div>
                <div className="dash-card-body">
                  {loading ? (
                    <p className="form-step-sub" style={{ margin: 0 }}>Loading activity…</p>
                  ) : recentActivity.length === 0 ? (
                    <p className="form-step-sub" style={{ margin: 0 }}>No activity yet.</p>
                  ) : (
                    <ul className="timeline">
                      {recentActivity.map((item, i) => (
                        <li className={`timeline-item ${item.type}`} key={i}>
                          <div className="tl-title">{item.title}</div>
                          <div className="tl-meta">
                            <i className="fas fa-calendar" aria-hidden="true"></i>{" "}
                            {fmtDate(item.date)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="dash-card">
                <div className="dash-card-header">
                  <h2><i className="fas fa-folder-open" aria-hidden="true"></i> My documents</h2>
                  <Link to="/profile" className="header-link">Manage</Link>
                </div>
                <div className="dash-card-body">
                  {loading ? (
                    <p className="form-step-sub" style={{ margin: 0 }}>Loading documents…</p>
                  ) : documents.length === 0 ? (
                    <p className="form-step-sub" style={{ margin: 0 }}>
                      No documents yet. <Link to="/profile">Upload one →</Link>
                    </p>
                  ) : (
                    <div className="doc-list">
                      {documents.slice(0, 5).map((doc) => (
                        <div className="doc-item" key={doc.id}>
                          <div className="doc-icon">
                            <i className="fas fa-file-alt" aria-hidden="true"></i>
                          </div>
                          <div className="doc-info">
                            <div className="doc-name">{text(doc.title)}</div>
                            <div className="doc-meta">{fmtDate(doc.created_at)}</div>
                          </div>
                          <span className="doc-status success">Saved</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="dash-card">
                <div className="dash-card-header">
                  <h2><i className="fas fa-bolt" aria-hidden="true"></i> Quick actions</h2>
                </div>
                <div className="dash-card-body">
                  <div className="quick-actions-grid">
                    <Link to="/opportunities" className="quick-action">
                      <i className="fas fa-search" aria-hidden="true"></i>
                      <span>Find placement</span>
                    </Link>
                    <Link to="/profile" className="quick-action">
                      <i className="fas fa-upload" aria-hidden="true"></i>
                      <span>Upload doc</span>
                    </Link>
                    <Link to="/applications" className="quick-action">
                      <i className="fas fa-list-check" aria-hidden="true"></i>
                      <span>My applications</span>
                    </Link>
                    <Link to="/profile" className="quick-action">
                      <i className="fas fa-user-edit" aria-hidden="true"></i>
                      <span>Edit profile</span>
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

function StatCard({ icon, color, value, label }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        <i className={`fas ${icon}`} aria-hidden="true"></i>
      </div>
      <div className="stat-info">
        <div className="stat-num">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}