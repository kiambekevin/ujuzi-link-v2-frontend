import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  Bell,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  Mail,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  useFetch,
  PageLoader,
  StatusBadge,
} from "../../components/ui";
import OpportunityCard from "../../components/OpportunityCard";
import { api } from "../../api/client";
import { fmtDate } from "../../lib/constants";
import "./Dashboard.css";

/* ------------------------------------------------------------------ */
/* KPI card                                                            */
/* ------------------------------------------------------------------ */
function KpiCard({ icon: Icon, label, value, sub, tone = "default", badge }) {
  const iconCls =
    tone === "accent" ? "is-accent" : tone === "warn" ? "is-warn" : tone === "success" ? "is-success" : "";
  return (
    <div className="trd-kpi">
      <div className="trd-kpi-top">
        <div className={`trd-kpi-icon ${iconCls}`}>
          <Icon size={19} strokeWidth={2.25} />
        </div>
        {badge && <span className="trd-kpi-badge is-warn">{badge}</span>}
      </div>
      <div className="trd-kpi-value">{value}</div>
      <div className="trd-kpi-label">{label}</div>
      {sub && <div className="trd-kpi-sub">{sub}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Progress strip in hero                                              */
/* ------------------------------------------------------------------ */
function JourneyProgress({ percent, hint }) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <div className="trd-progress">
      <div className="trd-progress-label">Profile readiness</div>
      <div className="trd-progress-value">{clamped}%</div>
      <div className="trd-progress-bar">
        <div className="trd-progress-fill" style={{ width: `${clamped}%` }} />
      </div>
      <div className="trd-progress-hint">{hint}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main page                                                          */
/* ------------------------------------------------------------------ */
export default function Dashboard() {
  const { user } = useAuth();
  const { data: recs, loading: recsLoading } = useFetch(() =>
    api.get("/opportunities/recommended/")
  );
  const { data: apps } = useFetch(() => api.get("/applications/?page_size=5"));
  const { data: notifs } = useFetch(() => api.get("/notifications/?page_size=4"));
  const { data: profile } = useFetch(() => api.get("/profile/"));

  const name = user?.first_name || "there";

  const recommendations = recs?.results || [];
  const applications = apps?.results || [];
  const notifications = notifs?.results || [];

  const activeApps = applications.filter((a) =>
    ["SUBMITTED", "UNDER_REVIEW", "SHORTLISTED"].includes(a.status)
  ).length;
  const offers = applications.filter((a) =>
    ["OFFERED", "OFFER_ACCEPTED"].includes(a.status)
  ).length;
  const unread = notifications.filter((n) => !n.read_at).length;

  /* Profile readiness — derived from the profile endpoint */
  const readiness = useMemo(() => {
    if (!profile) return { percent: 0, hint: "Finish setting up your profile" };
    let score = 0;
    let total = 0;
    const check = (ok, weight = 1) => {
      total += weight;
      if (ok) score += weight;
    };

    check(!!profile.first_name && !!profile.last_name, 2);
    check(!!profile.county, 1);
    check(!!profile.bio, 1);
    check((profile.skills || []).length > 0, 2);
    check((profile.education || []).length > 0, 1);
    check((profile.preferred_careers || []).length > 0, 1);
    check((profile.preferred_locations || []).length > 0, 1);
    check((profile.documents || []).length > 0, 1);

    const percent = total ? (score / total) * 100 : 0;
    const hint =
      percent >= 90
        ? "You're all set — great job!"
        : percent >= 60
        ? "Add your documents to finish"
        : percent >= 30
        ? "Add skills and preferences"
        : "Start by completing the basics";
    return { percent, hint };
  }, [profile]);

  return (
    <div className="page">
      {/* ---------- Hero ---------- */}
      <section className="trd-hero">
        <div className="trd-hero-inner">
          <div className="trd-hero-text">
            <h1>Karibu, {name}! 👋</h1>
            <p>
              {recommendations.length
                ? `We found ${recommendations.length} opportunit${
                    recommendations.length === 1 ? "y" : "ies"
                  } matching your profile. Let's find your next step.`
                : "Complete your profile to unlock smart-matched opportunities."}
            </p>
            <div className="trd-hero-actions">
              <Link to="/app/opportunities" className="trd-hero-btn trd-hero-btn--primary">
                <Briefcase size={16} strokeWidth={2.5} /> Browse opportunities
              </Link>
              <Link to="/app/profile" className="trd-hero-btn trd-hero-btn--ghost">
                <UserRound size={16} strokeWidth={2.5} /> Edit profile
              </Link>
            </div>
          </div>
          <JourneyProgress percent={readiness.percent} hint={readiness.hint} />
        </div>
      </section>

      {/* ---------- KPIs ---------- */}
      <div className="trd-kpis">
        <KpiCard
          icon={FileText}
          label="Applications"
          value={apps?.count ?? "—"}
          sub="Total submitted"
          tone="accent"
        />
        <KpiCard
          icon={TrendingUp}
          label="In progress"
          value={activeApps}
          sub="Submitted, review or shortlisted"
        />
        <KpiCard
          icon={Award}
          label="Offers"
          value={offers}
          sub="Offered or accepted"
          tone="success"
        />
        <KpiCard
          icon={Bell}
          label="Unread"
          value={unread}
          sub="Notifications"
          tone={unread > 0 ? "warn" : "default"}
          badge={unread > 0 ? "New" : null}
        />
      </div>

      {/* ---------- Two-column layout ---------- */}
      <div className="trd-grid">
        {/* Left column: recommendations */}
        <div>
          <div className="trd-section-head">
            <h3>
              <Sparkles size={16} strokeWidth={2.5} /> Recommended for you
            </h3>
            <Link to="/app/opportunities">
              View all <ArrowRight size={12} strokeWidth={2.5} />
            </Link>
          </div>

          {recsLoading ? (
            <PageLoader />
          ) : recommendations.length === 0 ? (
            <div className="trd-panel">
              <div className="trd-empty">
                <div className="trd-empty-icon">
                  <Sparkles size={22} strokeWidth={2.25} />
                </div>
                <h4>No matches yet</h4>
                <p>
                  Complete your profile with skills and career preferences to get
                  tailored recommendations.
                </p>
                <Link to="/app/profile" className="btn btn-primary btn-sm">
                  Complete profile
                </Link>
              </div>
            </div>
          ) : (
            <div className="trd-recs">
              {recommendations.slice(0, 3).map((opp) => (
                <OpportunityCard key={opp.id} opp={opp} />
              ))}
            </div>
          )}
        </div>

        {/* Right column: notifications + recent applications */}
        <div>
          {/* Notifications */}
          <div className="trd-section-head">
            <h3>
              <Bell size={16} strokeWidth={2.5} /> Latest activity
            </h3>
            <Link to="/app/notifications">
              View all <ArrowRight size={12} strokeWidth={2.5} />
            </Link>
          </div>

          <div className="trd-panel">
            {notifications.length === 0 ? (
              <div className="trd-empty">
                <div className="trd-empty-icon">
                  <Bell size={22} strokeWidth={2.25} />
                </div>
                <h4>No notifications</h4>
                <p>Updates about your applications and matches will appear here.</p>
              </div>
            ) : (
              notifications.map((n) => {
                const isUnread = !n.read_at;
                return (
                  <div
                    key={n.id}
                    className={`trd-notif${isUnread ? " is-unread" : ""}`}
                  >
                    <div className="trd-notif-icon">
                      <Bell size={15} strokeWidth={2.25} />
                    </div>
                    <div className="trd-notif-body">
                      <div className="trd-notif-title">{n.title}</div>
                      <div className="trd-notif-text">{n.body}</div>
                    </div>
                    <span className="trd-notif-time">
                      {fmtDate(n.created_at)}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Recent applications */}
          <div className="trd-section-head" style={{ marginTop: 22 }}>
            <h3>
              <ClipboardList size={16} strokeWidth={2.5} /> Recent applications
            </h3>
            <Link to="/app/applications">
              View all <ArrowRight size={12} strokeWidth={2.5} />
            </Link>
          </div>

          <div className="trd-panel">
            {applications.length === 0 ? (
              <div className="trd-empty">
                <div className="trd-empty-icon">
                  <ClipboardList size={22} strokeWidth={2.25} />
                </div>
                <h4>No applications yet</h4>
                <p>Apply to opportunities and track your progress here.</p>
                <Link to="/app/opportunities" className="btn btn-primary btn-sm">
                  Find opportunities
                </Link>
              </div>
            ) : (
              applications.map((a) => (
                <Link
                  key={a.id}
                  to={`/app/applications/${a.id}`}
                  className="trd-app"
                >
                  <div className="trd-app-body">
                    <div className="trd-app-title">
                      {a.opportunity?.title || "Opportunity"}
                    </div>
                    <div className="trd-app-org">
                      <Building2 size={11} strokeWidth={2.25} />
                      {a.opportunity?.organization_name || "Organisation"}
                    </div>
                  </div>
                  <StatusBadge status={a.status} />
                  <ChevronRight
                    size={14}
                    strokeWidth={2.25}
                    className="trd-app-chevron"
                  />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}