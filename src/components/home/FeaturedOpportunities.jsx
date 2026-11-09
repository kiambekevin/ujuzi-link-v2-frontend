// src/components/home/FeaturedOpportunities.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  Clock,
  Factory,
  Gavel,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  Hourglass,
  Inbox,
  Loader2,
  Lock,
  LogIn,
  MapPin,
  RotateCw,
  Star,
  TriangleAlert,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { api, errorMessage, getAccess } from "../../api/client";

const TYPE_ICONS = {
  APPRENTICESHIP: GraduationCap,
  INTERNSHIP: Briefcase,
  INDUSTRIAL_ATTACHMENT: Factory,
  PUPILLAGE: Gavel,
  COMMUNITY_SERVICE: HandHeart,
  VOLUNTEER: HeartHandshake,
  INDUSTRY_VISIT: Building2,
  JOB_SHADOWING: UserCheck,
  OTHER: Award,
};

const TYPE_LABELS = {
  APPRENTICESHIP: "Apprenticeship",
  INTERNSHIP: "Internship",
  INDUSTRIAL_ATTACHMENT: "Industrial Attachment",
  PUPILLAGE: "Pupillage",
  COMMUNITY_SERVICE: "Community Service",
  VOLUNTEER: "Volunteer",
  INDUSTRY_VISIT: "Industry Visit",
  JOB_SHADOWING: "Job Shadowing",
  OTHER: "Other",
};

const TYPE_CLASS = {
  APPRENTICESHIP: "apprenticeship",
  INTERNSHIP: "internship",
  INDUSTRIAL_ATTACHMENT: "attachment",
  PUPILLAGE: "pupillage",
  COMMUNITY_SERVICE: "community",
  VOLUNTEER: "volunteer",
  INDUSTRY_VISIT: "industry-visit",
  JOB_SHADOWING: "job-shadowing",
  OTHER: "other",
};

const API_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  "/api";

function fmtDeadline(value) {
  if (!value) return "Rolling";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fmtDuration(opp) {
  if (opp.duration_display) return opp.duration_display;
  if (!opp.duration_value || !opp.duration_unit) return "-";
  const unit =
    opp.duration_unit === "WEEKS"
      ? opp.duration_value === 1
        ? "week"
        : "weeks"
      : opp.duration_value === 1
      ? "month"
      : "months";
  return `${opp.duration_value} ${unit}`;
}

function normaliseSkills(skills) {
  if (Array.isArray(skills)) return skills.filter(Boolean);
  if (typeof skills === "string") {
    return skills.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

function toCardModel(opp) {
  const skillList = normaliseSkills(opp.skills);
  const employer =
    (typeof opp.organization === "string" && opp.organization) ||
    opp.organization?.name ||
    "Verified employer";

  return {
    id: opp.id,
    title: opp.title,
    employer,
    location: opp.county || opp.location || "Kenya",
    duration: fmtDuration(opp),
    qualification: skillList[0] || "-",
    deadline: opp.closing_date
      ? `Closes ${fmtDeadline(opp.closing_date)}`
      : "Open",
    type: opp.type,
    typeLabel: opp.type_display || TYPE_LABELS[opp.type] || opp.type,
    icon: TYPE_ICONS[opp.type] || Award,
    typeClass: TYPE_CLASS[opp.type] || "other",
    isOpen: opp.is_open !== false,
  };
}

async function fetchFeatured(signal) {
  const params = new URLSearchParams({
    status: "ACTIVE",
    ordering: "-created_at",
    page_size: "6",
  });
  const path = `/opportunities/?${params.toString()}`;

  if (typeof getAccess === "function" && getAccess()) {
    try {
      const { data } = await api.get(path, { signal });
      return data?.results || data || [];
    } catch (err) {
      const status = err?.response?.status;
      if (status !== 401 && status !== 403) throw err;
    }
  }

  if (typeof api.get === "function") {
    try {
      const { data } = await api.get(path, { signal, skipAuth: true });
      return data?.results || data || [];
    } catch (err) {
      const status = err?.response?.status;
      if (status !== 401 && status !== 403) throw err;
    }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    credentials: "omit",
    signal,
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    const e = new Error(detail?.detail || `Request failed (${res.status})`);
    e.status = res.status;
    throw e;
  }
  const data = await res.json();
  return data?.results || data || [];
}

export default function FeaturedOpportunities() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [needsAuth, setNeedsAuth] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      setNeedsAuth(false);
      try {
        const results = await fetchFeatured(controller.signal);
        if (!cancelled) setItems(results.slice(0, 6).map(toCardModel));
      } catch (err) {
        if (
          cancelled ||
          err?.name === "CanceledError" ||
          err?.name === "AbortError"
        ) {
          return;
        }
        if (err?.status === 401 || err?.response?.status === 401) {
          setNeedsAuth(true);
        } else {
          setError(
            errorMessage(err, "Unable to load featured opportunities.")
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const cards = useMemo(() => items, [items]);

  return (
    <section>
      <div className="container">
        <div className="section-head">
          <div>
            
            <h2>
              <Star size={20} strokeWidth={2.5} aria-hidden="true" /> Featured
              opportunities
            </h2>
            <p>
              Hand-picked placements from verified employers, updated regularly.
            </p>
          </div>
          <Link
            to="/opportunities"
            className="btn btn-outline"
            style={{ padding: "0.65rem 1.3rem", fontSize: "0.85rem" }}
          >
            View all opportunities <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="featured-grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <div className="opportunity-card" key={i} aria-hidden="true">
                <div className="opportunity-header">
                  <div className="opportunity-logo" style={{ opacity: 0.4 }}>
                    <Loader2 size={18} strokeWidth={2.5} className="lucide-spin" />
                  </div>
                </div>
                <div className="opportunity-body">
                  <h4
                    style={{
                      height: 18,
                      background: "var(--border-light, #eee)",
                      borderRadius: 4,
                      marginBottom: 10,
                    }}
                  />
                  <div
                    style={{
                      height: 12,
                      width: "60%",
                      background: "var(--border-light, #eee)",
                      borderRadius: 4,
                    }}
                  />
                </div>
                <div className="opportunity-footer">
                  <span className="opportunity-deadline">&nbsp;</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Auth required */}
        {!loading && needsAuth && (
          <div
            className="card"
            style={{
              padding: 28,
              textAlign: "center",
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            <div
              className="avatar"
              style={{
                width: 52,
                height: 52,
                margin: "0 auto 12px",
                fontSize: "1.2rem",
              }}
            >
              <Lock size={22} strokeWidth={2.25} />
            </div>
            <h3 style={{ marginBottom: 6, fontSize: "1.15rem" }}>
              Sign in to view opportunities
            </h3>
            <p className="muted small" style={{ marginBottom: 16 }}>
              Featured placements are visible to signed-in users. Create a free
              account or sign in to browse verified workplace-learning
              openings.
            </p>
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link to="/login" className="btn btn-primary">
                <LogIn size={15} strokeWidth={2.5} /> Sign in
              </Link>
              <Link to="/register" className="btn btn-outline">
                <UserPlus size={15} strokeWidth={2.5} /> Create account
              </Link>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && !needsAuth && error && (
          <div className="card" style={{ padding: 20, textAlign: "center" }}>
            <p className="muted small">
              <TriangleAlert size={14} strokeWidth={2.5} /> {error}
            </p>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ marginTop: 10 }}
              onClick={() => {
                setLoading(true);
                setError("");
                setNeedsAuth(false);
                fetchFeatured(new AbortController().signal)
                  .then((results) =>
                    setItems(results.slice(0, 6).map(toCardModel))
                  )
                  .catch((err) =>
                    setError(
                      errorMessage(
                        err,
                        "Unable to load featured opportunities."
                      )
                    )
                  )
                  .finally(() => setLoading(false));
              }}
            >
              <RotateCw size={13} strokeWidth={2.5} /> Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !needsAuth && !error && cards.length === 0 && (
          <div className="card" style={{ padding: 24, textAlign: "center" }}>
            <p className="muted small">
              <Inbox size={14} strokeWidth={2.5} /> No featured opportunities right
              now. Check back soon or{" "}
              <Link to="/opportunities">browse all openings</Link>.
            </p>
          </div>
        )}

        {/* Cards */}
        {!loading && !needsAuth && !error && cards.length > 0 && (
          <div className="featured-grid">
            {cards.map((opp) => {
              const Icon = opp.icon;
              return (
                <div className="opportunity-card" key={opp.id}>
                  <div className="opportunity-header">
                    <div className="opportunity-logo">
                      <Icon size={20} strokeWidth={2.25} />
                    </div>
                    <span className={`opportunity-type ${opp.typeClass}`}>
                      {opp.typeLabel}
                    </span>
                  </div>
                  <div className="opportunity-body">
                    <h4>{opp.title}</h4>
                    <div className="opportunity-employer">
                      <Building2 size={13} strokeWidth={2.25} /> {opp.employer}
                    </div>
                    <div className="opportunity-meta">
                      <span>
                        <MapPin size={13} strokeWidth={2.25} /> {opp.location}
                      </span>
                      <span>
                        <Clock size={13} strokeWidth={2.25} /> {opp.duration}
                      </span>
                      <span>
                        <GraduationCap size={13} strokeWidth={2.25} />{" "}
                        {opp.qualification}
                      </span>
                    </div>
                  </div>
                  <div className="opportunity-footer">
                    <span className="opportunity-deadline">
                      <Hourglass size={13} strokeWidth={2.25} /> {opp.deadline}
                    </span>
                    <Link
                      to={`/opportunities/${opp.id}`}
                      className="btn btn-primary"
                    >
                      {opp.isOpen ? "Apply" : "View"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}