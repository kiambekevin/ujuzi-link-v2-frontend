import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  GraduationCap,
  LayoutGrid,
  Laptop,
  List,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
  XCircle,
} from "lucide-react";
import TopBar from "../components/layout/TopBar.jsx";
import BrandRow from "../components/layout/BrandRow.jsx";
import MainNav from "../components/layout/MainNav.jsx";
import Footer from "../components/layout/Footer.jsx";
import OpportunityDrawer from "../components/opportunities/OpportunityDrawer.jsx";
import { api, errorMessage } from "../api/client";
import { KENYA_COUNTIES, OPPORTUNITY_TYPES } from "../lib/constants";
import "../styles/home.css";
import "../styles/opportunities-new.css";

// ---------------------------------------------------------------------------
// Constants / helpers
// ---------------------------------------------------------------------------

const ITEMS_PER_PAGE = 6;

const TYPE_LABELS = Object.fromEntries(OPPORTUNITY_TYPES);

const DURATION_OPTIONS = [
  { key: "0-8", label: "Up to 2 months", weeks: 8 },
  { key: "8-16", label: "2 – 4 months", weeks: 16 },
  { key: "16-26", label: "4 – 6 months", weeks: 26 },
  { key: "26-52", label: "6 – 12 months", weeks: 52 },
];

const WORK_MODES = [
  { value: "ONSITE", label: "On-site" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
];

const COMPENSATION_OPTIONS = [
  { value: "PAID", label: "Paid" },
  { value: "STIPEND", label: "Stipend" },
  { value: "UNPAID", label: "Unpaid" },
];

const SAFE_ORDERINGS = new Set([
  "-created_at",
  "created_at",
  "closing_date",
  "-closing_date",
  "start_date",
  "-start_date",
  "title",
]);

const SORT_OPTIONS = [
  { value: "-created_at", label: "Newest first" },
  { value: "closing_date", label: "Deadline (soonest)" },
  { value: "-start_date", label: "Start date (latest)" },
];

const DEADLINE_BUCKETS = [
  { key: "urgent", label: "Closing in 72 hours" },
  { key: "week", label: "Closing this week" },
  { key: "month", label: "Closing this month" },
];

const TYPE_CLASS = {
  APPRENTICESHIP: "apprenticeship",
  INTERNSHIP: "internship",
  INDUSTRIAL_ATTACHMENT: "attachment",
  PUPILLAGE: "pupillage",
  COMMUNITY_SERVICE: "community",
  VOLUNTEER: "volunteer",
  INDUSTRY_VISIT: "visit",
  JOB_SHADOWING: "shadowing",
  OTHER: "other",
};

function toId(value) {
  if (value === undefined || value === null) return null;
  if (value === "undefined" || value === "null" || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

const getInitials = (str) => {
  if (!str) return "??";
  return str
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

const getLogoColor = (str = "") => {
  const colors = ["#4B0082", "#0369A1", "#065F46", "#9D174D", "#92400E", "#7E22CE"];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

function toCardModel(opp) {
  if (!opp || typeof opp !== "object") return null;
  const id = toId(opp.id);
  if (id === null) return null;

  const organizationName =
    (typeof opp.organization === "string" && opp.organization) ||
    opp.organization?.name ||
    opp.organization_name ||
    "Verified employer";

  const type = opp.type || "OTHER";
  const compensation = opp.compensation || "UNPAID";

  const firstSkill =
    Array.isArray(opp.skills)
      ? opp.skills[0]
      : typeof opp.skills === "string"
        ? opp.skills.split(",")[0]?.trim()
        : "";

  const durUnit = opp.duration_unit;
  const durVal = Number(opp.duration_value || 0);
  let durationWeeks = null;
  if (durUnit === "WEEKS") durationWeeks = durVal;
  else if (durUnit === "MONTHS") durationWeeks = Math.round(durVal * 4);

  const compensationLabel =
    opp.compensation_display ||
    (compensation === "STIPEND"
      ? opp.stipend_amount
        ? `Stipend · KES ${opp.stipend_amount}`
        : "Stipend"
      : compensation === "PAID"
        ? opp.stipend_amount
          ? `Paid · KES ${opp.stipend_amount}`
          : "Paid"
        : "Unpaid");

  return {
    id,
    title: opp.title || "Untitled opportunity",
    employer: organizationName,
    county: opp.county || opp.location || "Kenya",
    type,
    typeLabel: opp.type_display || TYPE_LABELS[type] || type,
    typeClass: TYPE_CLASS[type] || "other",
    compensation,
    compensationLabel,
    durationLabel: opp.duration_display || "-",
    durationWeeks,
    workMode: opp.work_mode || null,
    qualification: firstSkill || "TVET Level",
    deadline: opp.closing_date,
    isOpen: opp.is_open !== false,
    isClosingSoon: opp.is_closing_soon === true,
    hasApplied: opp.has_applied === true || opp.has_applied === "true",
    isSaved: opp.is_saved === true || opp.is_saved === "true",
    raw: opp,
  };
}

// ---------------------------------------------------------------------------
// MultiSelect (inlined)
// ---------------------------------------------------------------------------
function MultiSelect({
  label,
  options,
  selected,
  onChange,
  placeholder,
  getValue = (o) => o,
  getLabel = (o) => o,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const filtered = options.filter((o) =>
    getLabel(o).toLowerCase().includes(query.toLowerCase())
  );

  const toggle = (val) => {
    if (selected.includes(val)) onChange(selected.filter((s) => s !== val));
    else onChange([...selected, val]);
  };

  return (
    <div className="ms-wrapper" ref={ref}>
      <button
        type="button"
        className={`ms-trigger ${selected.length ? "has-value" : ""} ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span className="ms-label">{label}</span>
        {selected.length > 0 && <span className="ms-badge">{selected.length}</span>}
        <ChevronDown size={13} strokeWidth={2.5} className="ms-caret" />
      </button>

      {open && (
        <div className="ms-dropdown">
          <div className="ms-search">
            <Search size={13} strokeWidth={2.5} />
            <input
              type="text"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          <div className="ms-options">
            {filtered.length === 0 ? (
              <div className="ms-empty">No results found</div>
            ) : (
              filtered.map((opt) => {
                const val = getValue(opt);
                return (
                  <label key={val} className="ms-option">
                    <input
                      type="checkbox"
                      checked={selected.includes(val)}
                      onChange={() => toggle(val)}
                    />
                    <span>{getLabel(opt)}</span>
                  </label>
                );
              })
            )}
          </div>
          {selected.length > 0 && (
            <button className="ms-clear" onClick={() => onChange([])}>
              Clear selection
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Active chips builder
// ---------------------------------------------------------------------------
function buildChips({
  search,
  selectedTypes,
  selectedCounties,
  selectedDurations,
  selectedWorkModes,
  selectedCompensations,
  deadlines,
  onRemove,
}) {
  const chips = [];

  if (search) {
    chips.push(
      <span key="search" className="active-chip">
        <Search size={11} strokeWidth={2.75} /> “{search}”
        <button onClick={() => onRemove("search")} aria-label="Remove search">
          <X size={11} strokeWidth={3} />
        </button>
      </span>
    );
  }

  selectedTypes.forEach((val) => {
    const label = TYPE_LABELS[val] || val;
    chips.push(
      <span key={`type-${val}`} className="active-chip">
        {label}
        <button onClick={() => onRemove("type", val)} aria-label={`Remove ${label}`}>
          <X size={11} strokeWidth={3} />
        </button>
      </span>
    );
  });

  selectedCounties.forEach((val) => {
    chips.push(
      <span key={`county-${val}`} className="active-chip">
        {val}
        <button onClick={() => onRemove("county", val)} aria-label={`Remove ${val}`}>
          <X size={11} strokeWidth={3} />
        </button>
      </span>
    );
  });

  selectedDurations.forEach((val) => {
    const duration = DURATION_OPTIONS.find((d) => d.key === val);
    const label = duration?.label || val;
    chips.push(
      <span key={`dur-${val}`} className="active-chip">
        {label}
        <button onClick={() => onRemove("duration", val)} aria-label={`Remove ${label}`}>
          <X size={11} strokeWidth={3} />
        </button>
      </span>
    );
  });

  selectedWorkModes.forEach((val) => {
    const mode = WORK_MODES.find((m) => m.value === val);
    const label = mode?.label || val;
    chips.push(
      <span key={`mode-${val}`} className="active-chip">
        {label}
        <button onClick={() => onRemove("work_mode", val)} aria-label={`Remove ${label}`}>
          <X size={11} strokeWidth={3} />
        </button>
      </span>
    );
  });

  selectedCompensations.forEach((val) => {
    const comp = COMPENSATION_OPTIONS.find((c) => c.value === val);
    const label = comp?.label || val;
    chips.push(
      <span key={`comp-${val}`} className="active-chip">
        {label}
        <button onClick={() => onRemove("compensation", val)} aria-label={`Remove ${label}`}>
          <X size={11} strokeWidth={3} />
        </button>
      </span>
    );
  });

  deadlines.forEach((val) => {
    const bucket = DEADLINE_BUCKETS.find((b) => b.key === val);
    const label = bucket?.label || val;
    chips.push(
      <span key={`deadline-${val}`} className="active-chip">
        {label}
        <button onClick={() => onRemove("deadline", val)} aria-label={`Remove ${label}`}>
          <X size={11} strokeWidth={3} />
        </button>
      </span>
    );
  });

  return chips;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function OpportunitiesPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedCounties, setSelectedCounties] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [selectedWorkModes, setSelectedWorkModes] = useState([]);
  const [selectedCompensations, setSelectedCompensations] = useState([]);
  const [sort, setSort] = useState("-created_at");
  const [page, setPage] = useState(1);

  const [deadlines, setDeadlines] = useState(new Set());

  const [view, setView] = useState("list");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeOpp, setActiveOpp] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [
    search,
    selectedTypes,
    selectedCounties,
    selectedDurations,
    selectedWorkModes,
    selectedCompensations,
    deadlines,
    sort,
  ]);

  const query = useMemo(() => {
    const params = {
      status: "ACTIVE",
      ordering: SAFE_ORDERINGS.has(sort) ? sort : "-created_at",
      page,
      page_size: ITEMS_PER_PAGE,
    };

    if (search.trim()) params.search = search.trim();

    if (selectedTypes.length) params.type = selectedTypes;
    if (selectedCounties.length) params.county = selectedCounties;
    if (selectedWorkModes.length) params.work_mode = selectedWorkModes;
    if (selectedCompensations.length) params.compensation = selectedCompensations;

    if (selectedDurations.length) {
      const maxWeeks = Math.max(
        ...selectedDurations.map(
          (k) => DURATION_OPTIONS.find((d) => d.key === k)?.weeks ?? 0
        )
      );
      if (maxWeeks > 0) params.max_duration_weeks = maxWeeks;
    }

    if (deadlines.has("urgent")) params.closing_soon = true;

    return params;
  }, [
    search,
    selectedTypes,
    selectedCounties,
    selectedDurations,
    selectedWorkModes,
    selectedCompensations,
    deadlines,
    sort,
    page,
  ]);

  const fetchRef = useRef(0);
  const load = useCallback(
    async (signal) => {
      setLoading(true);
      setError("");
      const myId = ++fetchRef.current;
      try {
        const { data } = await api.get("/opportunities/", {
          params: query,
          signal,
        });
        if (myId !== fetchRef.current) return;

        const results = data?.results || data || [];
        const models = (Array.isArray(results) ? results : [])
          .map(toCardModel)
          .filter(Boolean);

        setItems(models);
        setTotal(typeof data?.count === "number" ? data.count : models.length);
      } catch (err) {
        if (err?.name === "CanceledError" || err?.name === "AbortError") return;
        if (myId === fetchRef.current) {
          setError(errorMessage(err, "Unable to load opportunities."));
          setItems([]);
          setTotal(0);
        }
      } finally {
        if (myId === fetchRef.current) setLoading(false);
      }
    },
    [query]
  );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const visibleItems = useMemo(() => {
    const now = Date.now();
    const oneDay = 86400000;

    const passesDeadline = (opp) => {
      if (!deadlines.size) return true;
      if (!opp.deadline) return false;
      const d = new Date(opp.deadline + "T23:59:59").getTime();
      const diff = d - now;

      if (deadlines.has("urgent") && diff <= 3 * oneDay && diff >= 0) return true;
      if (deadlines.has("week") && diff <= 7 * oneDay && diff >= 0) return true;
      if (deadlines.has("month") && diff <= 31 * oneDay && diff >= 0) return true;
      return false;
    };

    const passesDuration = (opp) => {
      if (!selectedDurations.length) return true;
      if (opp.durationWeeks == null) return true;
      return selectedDurations.some((k) => {
        const opt = DURATION_OPTIONS.find((d) => d.key === k);
        return opt ? opp.durationWeeks <= opt.weeks : true;
      });
    };

    return items.filter((opp) => passesDeadline(opp) && passesDuration(opp));
  }, [items, deadlines, selectedDurations]);

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

  const toggleDeadline = (key) =>
    setDeadlines((s) => {
      const next = new Set(s);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setSelectedTypes([]);
    setSelectedCounties([]);
    setSelectedDurations([]);
    setSelectedWorkModes([]);
    setSelectedCompensations([]);
    setDeadlines(new Set());
    setSort("-created_at");
    setPage(1);
  };

  const removeChip = (kind, val) => {
    switch (kind) {
      case "search":
        setSearchInput("");
        setSearch("");
        break;
      case "type":
        setSelectedTypes((arr) => arr.filter((v) => v !== val));
        break;
      case "county":
        setSelectedCounties((arr) => arr.filter((v) => v !== val));
        break;
      case "duration":
        setSelectedDurations((arr) => arr.filter((v) => v !== val));
        break;
      case "work_mode":
        setSelectedWorkModes((arr) => arr.filter((v) => v !== val));
        break;
      case "compensation":
        setSelectedCompensations((arr) => arr.filter((v) => v !== val));
        break;
      case "deadline":
        setDeadlines((s) => {
          const n = new Set(s);
          n.delete(val);
          return n;
        });
        break;
      default:
        break;
    }
  };

  const activeFilterCount =
    selectedTypes.length +
    selectedCounties.length +
    selectedDurations.length +
    selectedWorkModes.length +
    selectedCompensations.length +
    deadlines.size +
    (search ? 1 : 0);

  const openDrawer = useCallback(async (opp) => {
    const id = toId(opp?.id);
    if (id === null) {
      console.warn("openDrawer called with invalid opportunity id", opp);
      return;
    }
    setActiveOpp({ ...opp, id });
    try {
      const { data } = await api.get(`/opportunities/${id}/`);
      setActiveOpp((prev) => (prev && toId(prev.id) === id ? { ...prev, ...data } : prev));
    } catch {
      /* keep list data */
    }
  }, []);

  const chips = buildChips({
    search,
    selectedTypes,
    selectedCounties,
    selectedDurations,
    selectedWorkModes,
    selectedCompensations,
    deadlines,
    onRemove: removeChip,
  });

  return (
    <>
      <TopBar />
      <BrandRow />
      <MainNav />

      <header className="page-header hero-search-header">
        <div className="container relative z-10">
          <div className="header-content">
            <h1>Discover your next opportunity</h1>
            <p>
              Find verified attachments, internships, and apprenticeships tailored to your skills.
            </p>
          </div>

          {/* Search bar — the button now sits INSIDE the pill, right-aligned, square */}
          <div className="hero-search-bar">
            <div className="search-input-group">
              <span className="search-icon-chip">
                <Search size={16} strokeWidth={2.5} />
              </span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setSearch(searchInput);
                  }
                }}
                placeholder="Search by role, employer, or keyword…"
              />
              {searchInput && (
                <button
                  className="clear-search"
                  onClick={() => {
                    setSearchInput("");
                    setSearch("");
                  }}
                  aria-label="Clear search"
                >
                  <XCircle size={18} strokeWidth={2} />
                </button>
              )}
              <button
                className="search-btn"
                onClick={() => setSearch(searchInput)}
                aria-label="Search"
                title="Search"
                type="button"
              >
                <Search size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="page-body bg-soft">
        <div className="container">
          <div className="opp-layout">
            <aside className="filter-sidebar">
              <div className="filter-sidebar-header">
                <h3>
                  <SlidersHorizontal size={15} strokeWidth={2.5} /> Filters
                </h3>
                {activeFilterCount > 0 && (
                  <button className="filter-reset" onClick={clearFilters}>
                    Reset
                  </button>
                )}
              </div>

              <div className="filter-section">
                <label>Opportunity Type</label>
                <MultiSelect
                  label="Opportunity Type"
                  options={OPPORTUNITY_TYPES}
                  selected={selectedTypes}
                  onChange={setSelectedTypes}
                  placeholder="Search types…"
                  getValue={(o) => o[0]}
                  getLabel={(o) => o[1]}
                />
              </div>

              <div className="filter-section">
                <label>County</label>
                <MultiSelect
                  label="County"
                  options={KENYA_COUNTIES}
                  selected={selectedCounties}
                  onChange={setSelectedCounties}
                  placeholder="Search counties…"
                />
              </div>

              <div className="filter-section">
                <label>Work mode</label>
                <MultiSelect
                  label="Work mode"
                  options={WORK_MODES}
                  selected={selectedWorkModes}
                  onChange={setSelectedWorkModes}
                  placeholder="Search work modes…"
                  getValue={(o) => o.value}
                  getLabel={(o) => o.label}
                />
              </div>

              <div className="filter-section">
                <label>Compensation</label>
                <MultiSelect
                  label="Compensation"
                  options={COMPENSATION_OPTIONS}
                  selected={selectedCompensations}
                  onChange={setSelectedCompensations}
                  placeholder="Search compensation…"
                  getValue={(o) => o.value}
                  getLabel={(o) => o.label}
                />
              </div>

              <div className="filter-section">
                <label>Duration</label>
                <MultiSelect
                  label="Duration"
                  options={DURATION_OPTIONS}
                  selected={selectedDurations}
                  onChange={setSelectedDurations}
                  placeholder="Search durations…"
                  getValue={(o) => o.key}
                  getLabel={(o) => o.label}
                />
              </div>

              <div className="filter-section">
                <label>Deadline</label>
                <div className="filter-options">
                  {DEADLINE_BUCKETS.map((b) => (
                    <label className="filter-checkbox" key={b.key}>
                      <input
                        type="checkbox"
                        checked={deadlines.has(b.key)}
                        onChange={() => toggleDeadline(b.key)}
                      />
                      <span>{b.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            <div className="results-area">
              <div className="results-toolbar">
                <div className="results-toolbar-left">
                  <h2>Recommended for you</h2>
                  <span className="results-count">
                    {loading
                      ? "Loading…"
                      : `${total} opportunit${total === 1 ? "y" : "ies"} found`}
                  </span>
                </div>

                <div className="results-toolbar-right">
                  <div className="sort-wrapper">
                    <span>Sort by:</span>
                    <select value={sort} onChange={(e) => setSort(e.target.value)}>
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="view-switch" role="group" aria-label="View">
                    <button
                      className={view === "list" ? "active" : ""}
                      onClick={() => setView("list")}
                      aria-label="List view"
                    >
                      <List size={15} strokeWidth={2.5} />
                    </button>
                    <button
                      className={view === "grid" ? "active" : ""}
                      onClick={() => setView("grid")}
                      aria-label="Grid view"
                    >
                      <LayoutGrid size={15} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>

              {chips.length > 0 && (
                <div className="active-chips">
                  {chips}
                  <button className="active-chip clear-all" onClick={clearFilters}>
                    Clear all
                  </button>
                </div>
              )}

              {loading && items.length === 0 && (
                <div className={`job-list ${view === "grid" ? "results-grid" : ""}`}>
                  {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                    <div className="job-card" key={i} style={{ opacity: 0.6 }}>
                      <div className="job-logo" style={{ background: "#eee" }} />
                      <div className="job-main">
                        <h3
                          style={{
                            height: 18,
                            background: "#eee",
                            width: "50%",
                            borderRadius: 4,
                            marginBottom: 10,
                          }}
                        />
                        <p
                          style={{
                            height: 12,
                            background: "#eee",
                            width: "35%",
                            borderRadius: 4,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && error && (
                <div className="empty-state">
                  <div className="empty-icon-wrapper">
                    <AlertTriangle size={32} strokeWidth={2} />
                  </div>
                  <h3>Could not load opportunities</h3>
                  <p>{error}</p>
                  <button className="btn btn-primary" onClick={() => load()}>
                    Try again
                  </button>
                </div>
              )}

              {!loading && !error && visibleItems.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon-wrapper">
                    <Search size={32} strokeWidth={2} />
                  </div>
                  <h3>No opportunities found</h3>
                  <p>
                    {items.length > 0
                      ? "Deadline or duration filters removed all results on this page. Clear them to see more."
                      : "We couldn't find anything matching your current filters."}
                  </p>
                  <button className="btn btn-primary" onClick={clearFilters}>
                    Clear all filters
                  </button>
                </div>
              )}

              {!loading && !error && visibleItems.length > 0 && (
                <>
                  <div className={`job-list ${view === "grid" ? "results-grid" : ""}`}>
                    {visibleItems.map((opp) => (
                      <div
                        key={opp.id}
                        className={`job-card ${opp.isClosingSoon ? "is-urgent" : ""}`}
                        onClick={() => openDrawer(opp)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            openDrawer(opp);
                          }
                        }}
                      >
                        <div
                          className="job-logo"
                          style={{ backgroundColor: `${getLogoColor(opp.employer)}10` }}
                        >
                          <span style={{ color: getLogoColor(opp.employer) }}>
                            {getInitials(opp.employer)}
                          </span>
                        </div>

                        <div className="job-main">
                          <div className="job-title-row">
                            <h3>{opp.title}</h3>
                            <span className={`type-badge ${opp.typeClass}`}>
                              {opp.typeLabel}
                            </span>
                          </div>
                          <p className="job-company">
                            <Building2 size={13} strokeWidth={2.25} /> {opp.employer}
                          </p>

                          <div className="job-meta">
                            <span>
                              <MapPin size={13} strokeWidth={2.25} /> {opp.county}
                            </span>
                            <span>
                              <Clock size={13} strokeWidth={2.25} /> {opp.durationLabel}
                            </span>
                            {opp.workMode && (
                              <span>
                                <Laptop size={13} strokeWidth={2.25} />{" "}
                                {WORK_MODES.find((m) => m.value === opp.workMode)?.label ||
                                  opp.workMode}
                              </span>
                            )}
                            <span>
                              <GraduationCap size={13} strokeWidth={2.25} />{" "}
                              {opp.qualification}
                            </span>
                          </div>
                        </div>

                        <div className="job-side">
                          <div className="job-side-top">
                            {opp.compensation === "UNPAID" ? (
                              <span className="badge-unpaid">Unpaid</span>
                            ) : opp.compensation === "STIPEND" ? (
                              <span className="badge-paid">Stipend</span>
                            ) : (
                              <span className="badge-paid">Paid</span>
                            )}
                          </div>
                          <div className="job-deadline">
                            <Clock size={12} strokeWidth={2.5} /> Closes{" "}
                            {opp.deadline
                              ? new Date(opp.deadline).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                })
                              : "-"}
                          </div>
                          <button
                            className="btn-view"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDrawer(opp);
                            }}
                          >
                            View <ArrowRight size={13} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="pagination-wrapper">
                      <button
                        className="page-btn"
                        disabled={page === 1 || loading}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                      >
                        <ChevronLeft size={16} strokeWidth={2.5} />
                      </button>
                      <span className="page-info">
                        Page <strong>{page}</strong> of {totalPages}
                      </span>
                      <button
                        className="page-btn"
                        disabled={page === totalPages || loading}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      >
                        <ChevronRight size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <OpportunityDrawer
            opportunity={activeOpp}
            onClose={() => setActiveOpp(null)}
          />
        </div>
      </div>

      <Footer />
    </>
  );
}