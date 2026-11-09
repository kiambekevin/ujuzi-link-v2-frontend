import { useEffect, useState } from "react";
import {
  Clock,
  Home,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Wallet,
  X,
} from "lucide-react";
import { api } from "../../api/client";
import { EmptyState, Pagination } from "../../components/ui";
import OpportunityCard from "../../components/OpportunityCard";
import {
  COMPENSATION_TYPES,
  KENYA_COUNTIES,
  OPPORTUNITY_TYPES,
  WORK_MODES,
  labelFor,
} from "../../lib/constants";
import "./Opportunities.css";

const CHIP_FILTERS = [
  { key: "Remote", icon: Home },
  { key: "Closing soon", icon: Clock },
  { key: "Has stipend", icon: Wallet },
];

export default function Opportunities() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState({ page: 1 });
  const [search, setSearch] = useState("");
  const [chips, setChips] = useState([]);
  const [nearby, setNearby] = useState(false);
  const [nearbyError, setNearbyError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) if (v) params.set(k, v);
    if (chips.includes("Remote")) params.set("remote", "true");
    if (chips.includes("Closing soon")) params.set("closing_soon", "true");
    if (chips.includes("Has stipend")) params.set("has_stipend", "true");

    const run = () =>
      api
        .get(`/opportunities/?${params.toString()}`)
        .then((res) => {
          if (!cancelled) setData(res.data);
        })
        .catch(() => {})
        .finally(() => {
          if (!cancelled) setLoading(false);
        });

    if (nearby) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          params.set("lat", pos.coords.latitude.toFixed(5));
          params.set("lon", pos.coords.longitude.toFixed(5));
          params.set("radius_km", "25");
          setNearbyError(false);
          run();
        },
        () => {
          setNearbyError(true);
          run();
        },
        { timeout: 5000 }
      );
    } else {
      run();
    }
    return () => {
      cancelled = true;
    };
  }, [query, chips, nearby]);

  const patch = (patchObj) => setQuery((q) => ({ ...patchObj, page: 1 }));
  const toggleChip = (c) =>
    setChips((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );

  const resetFilters = () => {
    setQuery({ page: 1 });
    setSearch("");
    setChips([]);
    setNearby(false);
    setNearbyError(false);
  };

  const removeFilter = (key) => {
    setQuery((q) => {
      const next = { ...q, page: 1 };
      delete next[key];
      return next;
    });
  };

  const activeFilters = [];
  if (query.search)
    activeFilters.push({ key: "search", label: `“${query.search}”` });
  if (query.type)
    activeFilters.push({
      key: "type",
      label: labelFor(OPPORTUNITY_TYPES, query.type),
    });
  if (query.county)
    activeFilters.push({ key: "county", label: query.county });
  if (query.work_mode)
    activeFilters.push({
      key: "work_mode",
      label: labelFor(WORK_MODES, query.work_mode),
    });
  if (query.compensation)
    activeFilters.push({
      key: "compensation",
      label: labelFor(COMPENSATION_TYPES, query.compensation),
    });
  chips.forEach((c) => activeFilters.push({ key: `chip:${c}`, label: c }));
  if (nearby) activeFilters.push({ key: "nearby", label: "Near me" });

  const clearOne = (f) => {
    if (f.key === "nearby") setNearby(false);
    else if (f.key.startsWith("chip:")) toggleChip(f.key.slice(5));
    else removeFilter(f.key);
  };

  return (
    <div className="page">
      {/* Filter panel */}
      <div className="tro-panel">
        <form
          className="tro-form"
          onSubmit={(e) => {
            e.preventDefault();
            patch({ search: search.trim() });
          }}
        >
          <div className="tro-search">
            <Search size={16} strokeWidth={2.25} />
            <input
              placeholder="Search title, skill, keyword…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="tro-select"
            value={query.type || ""}
            onChange={(e) => patch({ type: e.target.value })}
          >
            <option value="">All types</option>
            {OPPORTUNITY_TYPES.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>

          <select
            className="tro-select"
            value={query.county || ""}
            onChange={(e) => patch({ county: e.target.value })}
          >
            <option value="">All counties</option>
            {KENYA_COUNTIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            className="tro-select"
            value={query.work_mode || ""}
            onChange={(e) => patch({ work_mode: e.target.value })}
          >
            <option value="">Any mode</option>
            {WORK_MODES.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>

          <select
            className="tro-select"
            value={query.compensation || ""}
            onChange={(e) => patch({ compensation: e.target.value })}
          >
            <option value="">Any pay</option>
            {COMPENSATION_TYPES.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>

          <button className="tro-submit" type="submit">
            <Search size={15} strokeWidth={2.5} /> Search
          </button>
          <button
            type="button"
            className="tro-reset"
            onClick={resetFilters}
          >
            <RotateCcw size={14} strokeWidth={2.5} /> Reset
          </button>
        </form>

        <div className="tro-chips">
          {CHIP_FILTERS.map(({ key, icon: Icon }) => (
            <button
              key={key}
              type="button"
              className={`tro-chip${chips.includes(key) ? " active" : ""}`}
              onClick={() => toggleChip(key)}
            >
              <Icon size={13} strokeWidth={2.5} /> {key}
            </button>
          ))}
          <button
            type="button"
            className={`tro-chip${nearby ? " active" : ""}`}
            onClick={() => setNearby((n) => !n)}
            title="Filter to opportunities near your current location"
          >
            <MapPin size={13} strokeWidth={2.5} /> Near me
          </button>
          {nearbyError && (
            <span className="tiny muted" style={{ alignSelf: "center" }}>
              Location unavailable - showing all results.
            </span>
          )}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <SkeletonList />
      ) : !data || data.count === 0 ? (
        <EmptyState
          icon="fa-briefcase"
          title="No opportunities found"
          text="Try adjusting your search or filters."
          action={
            <button className="btn btn-outline btn-sm" onClick={resetFilters}>
              <RotateCcw size={13} strokeWidth={2.5} /> Clear filters
            </button>
          }
        />
      ) : (
        <>
          <div className="tro-results-head">
            <span className="tro-count">
              <strong>{data.count.toLocaleString()}</strong>{" "}
              opportunit{data.count === 1 ? "y" : "ies"} found
            </span>
            {activeFilters.length > 0 && (
              <div className="tro-active-filters">
                <SlidersHorizontal
                  size={13}
                  strokeWidth={2.5}
                  style={{ color: "var(--accent-dark)" }}
                />
                {activeFilters.map((f) => (
                  <span key={f.key} className="tro-active-tag">
                    {f.label}
                    <button
                      type="button"
                      onClick={() => clearOne(f)}
                      aria-label={`Remove ${f.label}`}
                    >
                      <X size={10} strokeWidth={3} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="tro-list">
            {data.results.map((opp) => (
              <OpportunityCard key={opp.id} opp={opp} />
            ))}
          </div>

          <Pagination
            page={query.page || 1}
            count={data.count}
            onPage={(p) => setQuery((q) => ({ ...q, page: p }))}
          />
        </>
      )}
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="tro-list">
      {[0, 1, 2].map((i) => (
        <div className="tro-skeleton" key={i}>
          <div className="tro-skeleton-bar is-wide" />
          <div className="tro-skeleton-bar is-mid" />
          <div className="tro-skeleton-bar is-short" />
        </div>
      ))}
    </div>
  );
}