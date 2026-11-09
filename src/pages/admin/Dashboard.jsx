import {
  Activity,
  ArrowUpRight,
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileCheck,
  Handshake,
  Hourglass,
  Inbox,
  Megaphone,
  Minus,
  Star,
  UserRound,
  Users,
} from "lucide-react";
import { api } from "../../api/client";
import { PageLoader, useFetch } from "../../components/ui";
import { labelFor, OPPORTUNITY_TYPES, statusBadge } from "../../lib/constants";
import "./Dashboard.css";

/* ================================================================
   Small presentational pieces
   ================================================================ */

function KpiCard({ icon: Icon, label, value, sub, accent = false, trend }) {
  return (
    <div className="adm-kpi">
      <div className="adm-kpi-top">
        <div className={`adm-kpi-icon${accent ? " is-accent" : ""}`}>
          <Icon size={20} strokeWidth={2.25} />
        </div>
        {trend != null && trend > 0 && (
          <span className="adm-kpi-trend">
            <ArrowUpRight size={11} strokeWidth={3} />
            {trend}
          </span>
        )}
        {trend === 0 && (
          <span className="adm-kpi-trend">
            <Minus size={11} strokeWidth={3} />
            0
          </span>
        )}
      </div>
      <div className="adm-kpi-value">{value}</div>
      <div className="adm-kpi-label">{label}</div>
      {sub && <div className="adm-kpi-sub">{sub}</div>}
    </div>
  );
}

function PanelCard({ icon: Icon, title, hint, children }) {
  return (
    <div className="adm-panel">
      <div className="adm-panel-head">
        <div className="adm-panel-head-left">
          <div className="adm-panel-icon">
            <Icon size={16} strokeWidth={2.25} />
          </div>
          <h4>{title}</h4>
        </div>
        {hint && <span className="adm-panel-hint">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function FunnelBar({ label, value, max, tone = "default" }) {
  const width = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  const toneClass =
    tone === "primary" ? " is-primary" : tone === "success" ? " is-success" : "";
  return (
    <div className="adm-funnel-row">
      <div className="adm-funnel-labels">
        <span>{label}</span>
        <span className="adm-funnel-value">{value}</span>
      </div>
      <div className="adm-funnel-track">
        <div
          className={`adm-funnel-fill${toneClass}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function MonthChart({ title, icon: Icon, points }) {
  const max = Math.max(1, ...(points || []).map((p) => p.count));
  const hasData = (points || []).some((p) => p.count > 0);

  return (
    <PanelCard icon={Icon} title={title}>
      {!hasData ? (
        <p className="adm-empty">No activity recorded in the last 12 months.</p>
      ) : (
        <div className="adm-chart">
          {(points || []).map((p) => (
            <div
              key={p.month}
              className="adm-chart-col"
              title={`${p.month}: ${p.count}`}
            >
              <span className="adm-chart-count">{p.count || ""}</span>
              <div
                className="adm-chart-bar"
                style={{ height: `${Math.round((p.count / max) * 84)}px` }}
              />
              <span className="adm-chart-label">{p.month.slice(5)}</span>
            </div>
          ))}
        </div>
      )}
    </PanelCard>
  );
}

function BreakdownRow({ label, value, icon: Icon }) {
  return (
    <div className="adm-breakdown-row">
      <span className="adm-breakdown-label">
        {Icon && <Icon size={13} strokeWidth={2.25} />}
        {label}
      </span>
      <span className="adm-breakdown-value">{value}</span>
    </div>
  );
}

/* ================================================================
   Main page
   ================================================================ */
export default function Dashboard() {
  const { data, loading } = useFetch(() => api.get("/reports/overview/"));

  if (loading || !data) return <PageLoader />;

  const funnel = data.funnel || {};
  const funnelMax = Math.max(1, ...Object.values(funnel));

  const appStatusEntries = Object.entries(data.applications?.by_status || {});
  const oppTypeEntries = Object.entries(data.opportunities?.by_type || {});

  const satisfaction = data.satisfaction?.trainee_avg_rating;

  return (
    <div className="page">
      {/* ---------- Header ---------- */}
      <header className="adm-header">
        <div>
          <h2>Platform overview</h2>
          <p className="adm-header-sub">
            Snapshot of every trainee, organisation, advert and placement on the
            platform.
          </p>
        </div>
        <span className="adm-badge">
          <BadgeCheck size={13} strokeWidth={2.5} /> Administrator
        </span>
      </header>

      {/* ---------- KPI cards ---------- */}
      <div className="adm-kpis">
        <KpiCard
          icon={Users}
          label="Trainees registered"
          value={data.trainee?.total ?? 0}
          accent
          trend={data.trainee?.this_month}
          sub={
            <>
              <UserRound size={12} strokeWidth={2.5} />
              <span>
                <strong>{data.trainee?.this_month ?? 0}</strong> joined this
                month
              </span>
            </>
          }
        />
        <KpiCard
          icon={Building2}
          label="Organisations"
          value={data.organizations?.total ?? 0}
          sub={
            <>
              <BadgeCheck size={12} strokeWidth={2.5} />
              <span>
                <strong>{data.organizations?.verified ?? 0}</strong> verified ·{" "}
                <strong>{data.organizations?.pending ?? 0}</strong> pending
              </span>
            </>
          }
        />
        <KpiCard
          icon={Megaphone}
          label="Active adverts"
          value={data.opportunities?.active ?? 0}
          sub={
            <>
              <Briefcase size={12} strokeWidth={2.5} />
              <span>
                <strong>{data.opportunities?.places_available ?? 0}</strong>{" "}
                places open
              </span>
            </>
          }
        />
        <KpiCard
          icon={Handshake}
          label="Active placements"
          value={data.placements?.active ?? 0}
          sub={
            <>
              <CheckCircle2 size={12} strokeWidth={2.5} />
              <span>
                <strong>{data.placements?.completed ?? 0}</strong> completed
              </span>
            </>
          }
        />
      </div>

      {/* ---------- Funnel + charts ---------- */}
      <div className="adm-row adm-row--funnel">
        <PanelCard icon={Activity} title="Recruitment funnel">
          <div className="adm-funnel">
            <FunnelBar label="Applied" value={funnel.applied ?? 0} max={funnelMax} />
            <FunnelBar label="Shortlisted" value={funnel.shortlisted ?? 0} max={funnelMax} />
            <FunnelBar label="Offered" value={funnel.offered ?? 0} max={funnelMax} />
            <FunnelBar label="Accepted" value={funnel.accepted ?? 0} max={funnelMax} tone="primary" />
            <FunnelBar label="Placed" value={funnel.placed ?? 0} max={funnelMax} tone="primary" />
            <FunnelBar label="Completed" value={funnel.completed ?? 0} max={funnelMax} tone="success" />
          </div>
        </PanelCard>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <MonthChart
            icon={Users}
            title="Trainee registrations"
            points={data.timeseries?.registrations || []}
          />
          <MonthChart
            icon={ClipboardList}
            title="Applications"
            points={data.timeseries?.applications || []}
          />
        </div>
      </div>

      {/* ---------- Breakdowns ---------- */}
      <div className="adm-row adm-row--breakdown">
        <PanelCard icon={ClipboardList} title="Applications by status">
          <div className="adm-breakdown">
            {appStatusEntries.length === 0 ? (
              <p className="adm-empty">No applications yet.</p>
            ) : (
              appStatusEntries.map(([status, count]) => {
                const meta = statusBadge(status);
                return (
                  <div key={status} className="adm-breakdown-row">
                    <span className={`badge ${meta.cls}`}>{meta.label}</span>
                    <span className="adm-breakdown-value">{count}</span>
                  </div>
                );
              })
            )}
          </div>
        </PanelCard>

        <PanelCard icon={Megaphone} title="Adverts by type">
          <div className="adm-breakdown">
            {oppTypeEntries.length === 0 ? (
              <p className="adm-empty">No adverts yet.</p>
            ) : (
              oppTypeEntries.map(([type, count]) => (
                <BreakdownRow
                  key={type}
                  icon={Briefcase}
                  label={labelFor(OPPORTUNITY_TYPES, type)}
                  value={count}
                />
              ))
            )}
          </div>
        </PanelCard>

        <PanelCard icon={FileCheck} title="Other metrics">
          <div className="adm-breakdown">
            <BreakdownRow
              icon={Inbox}
              label="Offers made"
              value={data.offers?.total ?? 0}
            />
            <BreakdownRow
              icon={CheckCircle2}
              label="Offers accepted"
              value={data.offers?.accepted ?? 0}
            />
            <BreakdownRow
              icon={Award}
              label="Passport entries"
              value={data.passport?.entries ?? 0}
            />
            <BreakdownRow
              icon={FileCheck}
              label="Certificates issued"
              value={data.passport?.certificates_issued ?? 0}
            />
            <BreakdownRow
              icon={Clock}
              label="Open complaints"
              value={data.complaints?.open ?? 0}
            />
            <div className="adm-breakdown-row">
              <span className="adm-breakdown-label">
                <Star size={13} strokeWidth={2.25} />
                Avg. trainee rating
              </span>
              <span className="adm-rating">
                <Star size={13} strokeWidth={2.25} fill="currentColor" />
                {satisfaction ?? "—"} <span style={{ opacity: 0.6 }}>/ 5</span>
              </span>
            </div>
          </div>
        </PanelCard>
      </div>
    </div>
  );
}