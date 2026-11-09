import { Link } from "react-router-dom";
import {
  Megaphone,
  UserPlus,
  UserCheck,
  Armchair,
  Hourglass,
  TriangleAlert,
  Zap,
  FileText,
  ArrowRight,
  Briefcase,
  ShieldCheck,
} from "lucide-react";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { Alert, PageLoader, useFetch } from "../../components/ui";
import "./Dashboard.css";

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function StatCard({ icon: Icon, label, value, accent = false, split = false }) {
  return (
    <div className="dash-stat">
      <div className="dash-stat-top">
        <div className={`dash-stat-icon${accent ? " dash-stat-icon--accent" : ""}`}>
          <Icon size={20} strokeWidth={2.25} />
        </div>
      </div>
      <div className={`dash-stat-value${split ? " dash-stat-value--split" : ""}`}>{value}</div>
      <div className="dash-stat-label">{label}</div>
    </div>
  );
}

function ActionCard({ icon: Icon, title, metrics, to, cta }) {
  return (
    <div className="dash-action">
      <div className="dash-action-head">
        <div className="dash-action-icon">
          <Icon size={18} strokeWidth={2.25} />
        </div>
        <h4>{title}</h4>
      </div>
      <div className="dash-action-metrics">
        {metrics.map((m) => (
          <div className="dash-metric" key={m.label}>
            <span className="dash-metric-value">{m.value}</span>
            <span className="dash-metric-label">{m.label}</span>
          </div>
        ))}
      </div>
      <Link to={to} className="btn btn-outline btn-sm dash-action-cta">
        {cta} <ArrowRight size={14} strokeWidth={2.5} />
      </Link>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data: org, loading: orgLoading } = useFetch(() => api.get("/organizations/me/"));
  const { data, loading, error } = useFetch(() => api.get("/organizations/me/dashboard/"));

  if (loading || orgLoading) return <PageLoader />;
  if (error || !data) {
    return <Alert>Could not load your dashboard. {error?.response?.data?.detail || ""}</Alert>;
  }

  const orgStatus = org?.status;
  const pendingApproval = orgStatus === "PENDING";
  const rejected = orgStatus !== "ACTIVE" && orgStatus !== "PENDING";
  const isOfficer = org?.my_role === "OFFICER";
  const roleLabel = isOfficer ? "Recruitment Officer" : "Supervisor";
  const RoleIcon = isOfficer ? Briefcase : ShieldCheck;

  return (
    <div className="page">
      {/* ---- Hero ---- */}
      <section className="dash-hero">
        <div className="dash-hero-inner">
          <div>
            <h2>Karibu, {org?.name || user?.display_name}</h2>
            <div className="dash-hero-sub">
              <span className="dash-hero-name">{user?.display_name}</span>
              <span className="dash-hero-badge">
                <RoleIcon size={13} strokeWidth={2.5} />
                {roleLabel}
              </span>
            </div>
          </div>
          <div className="dash-hero-emblem" aria-hidden="true">
            {initials(org?.name || user?.display_name)}
          </div>
        </div>
      </section>

      {/* ---- Status banners ---- */}
      {pendingApproval && (
        <div className="dash-banner dash-banner--pending">
          <div className="dash-banner-icon">
            <Hourglass size={18} strokeWidth={2.25} />
          </div>
          <div className="dash-banner-body">
            <strong>Approval in progress.</strong>
            <p>
              Your organisation profile is awaiting administrator review. Upload your verification
              documents on the <Link to="/app/org/organization">Organisation page</Link> to speed things up.
            </p>
          </div>
        </div>
      )}

      {rejected && (
        <div className="dash-banner dash-banner--rejected">
          <div className="dash-banner-icon">
            <TriangleAlert size={18} strokeWidth={2.25} />
          </div>
          <div className="dash-banner-body">
            <strong>Your organisation is {orgStatus.toLowerCase()}.</strong>
            <p>
              {org?.rejection_reason ? `Reason: ${org.rejection_reason}. ` : ""}
              You cannot advertise opportunities until an administrator approves your profile.
            </p>
          </div>
        </div>
      )}

      {/* ---- Stats ---- */}
      <div className="dash-stats">
        <StatCard icon={Megaphone} label="Active adverts" value={data.opportunities_active} accent />
        <StatCard icon={UserPlus} label="Applications to review" value={data.applications_pending} />
        <StatCard icon={UserCheck} label="Active placements" value={data.placements_active} />
        <StatCard
          icon={Armchair}
          label="Places available"
          value={`${data.places_available} / ${data.capacity || "-"}`}
          split
        />
      </div>

      {/* ---- Quick actions ---- */}
      <h3 className="dash-section-title">
        <Zap size={16} strokeWidth={2.5} /> Quick actions
      </h3>
      <div className="dash-actions">
        <ActionCard
          icon={Megaphone}
          title="Opportunities"
          metrics={[
            { label: "Total adverts", value: data.opportunities_total },
            { label: "Places advertised", value: data.places_advertised },
          ]}
          to="/app/org/opportunities"
          cta="Manage adverts"
        />
        <ActionCard
          icon={FileText}
          title="Applications"
          metrics={[
            { label: "Total received", value: data.applications_total },
            { label: "Awaiting action", value: data.applications_pending },
          ]}
          to="/app/org/applications"
          cta="Review applications"
        />
        <ActionCard
          icon={UserCheck}
          title="Placements"
          metrics={[
            { label: "Active", value: data.placements_active },
            { label: "Completed", value: data.placements_completed },
          ]}
          to="/app/org/placements"
          cta="View placements"
        />
      </div>
    </div>
  );
}