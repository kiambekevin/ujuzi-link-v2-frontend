import { useEffect, useMemo, useState } from "react";
import {
  Armchair,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  BadgeCheck,
  Ban,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Info,
  Mail,
  MailWarning,
  MapPin,
  Phone,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Trash2,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { api, errorMessage } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import {
  EmptyState,
  Modal,
  PageLoader,
  Pagination,
  Spinner,
  StatusBadge,
  useAsyncAction,
  useFetch,
} from "../../components/ui";
import {
  fmtDate,
  labelFor,
  ORGANIZATION_TYPES,
  OPPORTUNITY_TYPES,
} from "../../lib/constants";
import "./Organizations.css";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */
const FILTERS = [
  ["", "All"],
  ["PENDING", "Pending"],
  ["ACTIVE", "Active"],
  ["REJECTED", "Rejected"],
  ["SUSPENDED", "Suspended"],
];

const MODAL_COPY = {
  approve: {
    title: "Approve",
    icon: CheckCircle2,
    confirm: "Approve organisation",
    confirmClass: "btn-primary",
    body: "Approve this organisation so they can advertise opportunities and manage placements.",
  },
  reject: {
    title: "Reject",
    icon: XCircle,
    confirm: "Reject organisation",
    confirmClass: "btn-danger",
    body: "Reject this organisation and provide a reason. The reason is shown to the organisation.",
  },
  suspend: {
    title: "Suspend",
    icon: Ban,
    confirm: "Suspend organisation",
    confirmClass: "btn-danger",
    body: "This takes effect immediately — the organisation will not be able to advertise or manage placements until reinstated.",
  },
  reinstate: {
    title: "Reinstate",
    icon: RotateCcw,
    confirm: "Reinstate organisation",
    confirmClass: "btn-primary",
    body: "This takes effect immediately — the organisation will regain access to advertising and placement management.",
  },
  verify: {
    title: "Verify organisation",
    icon: ShieldCheck,
    confirm: "Mark as verified",
    confirmClass: "btn-primary",
    body: "Mark this organisation as verified. The verified badge appears on their public profile.",
  },
  unverify: {
    title: "Remove verification",
    icon: ShieldX,
    confirm: "Remove verification",
    confirmClass: "btn-danger",
    body: "Remove the verified badge from this organisation.",
  },
  capacity: {
    title: "Update capacity",
    icon: Armchair,
    confirm: "Save capacity",
    confirmClass: "btn-primary",
    body: "Set the maximum number of concurrent placement places this organisation can host.",
  },
  "resend-invite": {
    title: "Resend invitation",
    icon: MailWarning,
    confirm: "Resend invitation",
    confirmClass: "btn-primary",
    body: "Re-send onboarding emails to officers whose accounts are not yet verified.",
  },
  delete: {
    title: "Deactivate organisation",
    icon: Trash2,
    confirm: "Deactivate organisation",
    confirmClass: "btn-danger",
    body: "This suspends the organisation and removes its verified status. It can be reinstated later.",
    warning: "Members will lose access immediately.",
  },
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
function initialsFor(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function useDebounced(value, delay = 250) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                        */
/* ------------------------------------------------------------------ */
function SortHeader({ label, field, sort, onSort, className = "" }) {
  const active = sort.field === field;
  const Icon = !active ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <th
      className={`is-sortable ${className}`}
      onClick={() => onSort(field)}
      aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
    >
      <span className="aorg-th-inner">
        {label}
        <Icon size={12} strokeWidth={2.5} />
      </span>
    </th>
  );
}

function DrawerRow({ icon: Icon, label, value }) {
  return (
    <div className="aorg-drawer-row">
      <Icon size={14} strokeWidth={2.25} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="aorg-drawer-row-label">{label}</div>
        <div className="aorg-drawer-row-value">{value}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Drawer                                                              */
/* ------------------------------------------------------------------ */
function OrgDrawer({ orgId, onClose, onOpenModal }) {
  const { data: org, loading, error } = useFetch(
    () => api.get(`/admin/organizations/${orgId}/`),
    [orgId]
  );

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="aorg-drawer-overlay" onClick={onClose}>
      <aside className="aorg-drawer" onClick={(e) => e.stopPropagation()}>
        {loading ? (
          <div style={{ padding: 40 }}>
            <Spinner />
          </div>
        ) : error || !org ? (
          <div style={{ padding: 24 }}>
            <div className="aorg-modal-warning">
              <ShieldAlert size={16} strokeWidth={2.25} />
              <span>
                Could not load organisation.
                {error?.response?.status
                  ? ` (HTTP ${error.response.status})`
                  : ""}
              </span>
            </div>
            <button className="btn btn-outline" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="aorg-drawer-head">
              <button
                className="aorg-drawer-close"
                onClick={onClose}
                aria-label="Close drawer"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
              <div className="aorg-drawer-avatar">{initialsFor(org.name)}</div>
              <h3 className="aorg-drawer-name">{org.name}</h3>
              <div className="aorg-drawer-sub">
                <StatusBadge status={org.status} />
                {org.verified && (
                  <span className="aorg-verified">
                    <BadgeCheck size={11} strokeWidth={2.75} /> Verified
                  </span>
                )}
              </div>
            </div>

            <div className="aorg-drawer-body">
              <section>
                <p className="aorg-drawer-section-title">Identity</p>
                <div className="aorg-drawer-rows">
                  <DrawerRow
                    icon={Building2}
                    label="Type"
                    value={labelFor(ORGANIZATION_TYPES, org.org_type)}
                  />
                  {org.registration_no && (
                    <DrawerRow
                      icon={FileText}
                      label="Registration no."
                      value={org.registration_no}
                    />
                  )}
                  {org.year_established && (
                    <DrawerRow
                      icon={CalendarDays}
                      label="Established"
                      value={org.year_established}
                    />
                  )}
                  <DrawerRow
                    icon={CalendarDays}
                    label="Joined platform"
                    value={fmtDate(org.created_at)}
                  />
                </div>
              </section>

              <section>
                <p className="aorg-drawer-section-title">Contact</p>
                <div className="aorg-drawer-rows">
                  <DrawerRow
                    icon={Mail}
                    label="Email"
                    value={org.email || "—"}
                  />
                  <DrawerRow
                    icon={Phone}
                    label="Phone"
                    value={org.phone || "—"}
                  />
                  {org.website && (
                    <DrawerRow
                      icon={Globe}
                      label="Website"
                      value={
                        <a
                          href={org.website}
                          target="_blank"
                          rel="noreferrer"
                          className="aorg-drawer-link"
                        >
                          {org.website} <ExternalLink size={11} strokeWidth={2.5} />
                        </a>
                      }
                    />
                  )}
                  <DrawerRow
                    icon={MapPin}
                    label="Head office"
                    value={org.county || "—"}
                  />
                </div>
              </section>

              {org.contact_person_name && (
                <section>
                  <p className="aorg-drawer-section-title">Primary contact</p>
                  <div className="aorg-drawer-rows">
                    <DrawerRow
                      icon={Users}
                      label={org.contact_person_role || "Contact person"}
                      value={org.contact_person_name}
                    />
                    {org.contact_person_email && (
                      <DrawerRow
                        icon={Mail}
                        label="Email"
                        value={org.contact_person_email}
                      />
                    )}
                    {org.contact_person_phone && (
                      <DrawerRow
                        icon={Phone}
                        label="Phone"
                        value={org.contact_person_phone}
                      />
                    )}
                  </div>
                </section>
              )}

              {org.counties_served?.length > 0 && (
                <section>
                  <p className="aorg-drawer-section-title">Counties served</p>
                  <div className="aorg-chip-row">
                    {org.counties_served.map((c) => (
                      <span key={c} className="aorg-mini-chip">
                        <MapPin size={10} strokeWidth={2.5} /> {c}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {org.sectors?.length > 0 && (
                <section>
                  <p className="aorg-drawer-section-title">Industry sectors</p>
                  <div className="aorg-chip-row">
                    {org.sectors.map((s) => (
                      <span key={s.id || s.code} className="aorg-mini-chip">
                        {s.name || s}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {org.opportunity_types?.length > 0 && (
                <section>
                  <p className="aorg-drawer-section-title">
                    Opportunity types offered
                  </p>
                  <div className="aorg-chip-row">
                    {org.opportunity_types.map((t) => (
                      <span
                        key={t}
                        className="aorg-mini-chip aorg-mini-chip--soft"
                      >
                        <BookOpen size={10} strokeWidth={2.5} />
                        {labelFor(OPPORTUNITY_TYPES, t)}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <p className="aorg-drawer-section-title">
                  Team ({org.counts?.members_active ?? 0} active)
                </p>
                <div className="aorg-drawer-rows">
                  {(org.members || []).map((m) => (
                    <DrawerRow
                      key={m.id}
                      icon={Users}
                      label={m.user_name || m.user_email}
                      value={`${m.role} ${m.is_active ? "· Active" : "· Inactive"}`}
                    />
                  ))}
                  {(org.members || []).length === 0 && (
                    <span className="aorg-empty-inline">No members yet.</span>
                  )}
                </div>
              </section>

              <section>
                <p className="aorg-drawer-section-title">
                  Documents ({org.counts?.documents ?? 0})
                </p>
                <div className="aorg-drawer-rows">
                  {(org.documents || []).map((d) => (
                    <DrawerRow
                      key={d.id}
                      icon={FileText}
                      label={d.title || d.doc_type}
                      value={
                        d.download_url ? (
                          <a
                            href={d.download_url}
                            target="_blank"
                            rel="noreferrer"
                            className="aorg-drawer-link"
                          >
                            Download
                          </a>
                        ) : (
                          "—"
                        )
                      }
                    />
                  ))}
                  {(org.documents || []).length === 0 && (
                    <span className="aorg-empty-inline">
                      No documents uploaded.
                    </span>
                  )}
                </div>
              </section>
            </div>

            <div className="aorg-drawer-actions">
              {org.status === "PENDING" && (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={() => onOpenModal(org, "approve")}
                  >
                    <CheckCircle2 size={14} strokeWidth={2.5} /> Approve
                  </button>
                  <button
                    className="btn btn-danger-soft"
                    onClick={() => onOpenModal(org, "reject")}
                  >
                    <XCircle size={14} strokeWidth={2.5} /> Reject
                  </button>
                </>
              )}
              {org.status === "ACTIVE" && (
                <button
                  className="btn btn-danger-soft"
                  onClick={() => onOpenModal(org, "suspend")}
                >
                  <Ban size={14} strokeWidth={2.5} /> Suspend
                </button>
              )}
              {org.status === "SUSPENDED" && (
                <button
                  className="btn btn-primary"
                  onClick={() => onOpenModal(org, "reinstate")}
                >
                  <RotateCcw size={14} strokeWidth={2.5} /> Reinstate
                </button>
              )}

              <button
                className="btn btn-outline"
                onClick={() => onOpenModal(org, "capacity")}
              >
                <Armchair size={14} strokeWidth={2.5} /> Update capacity
              </button>

              {org.verified ? (
                <button
                  className="btn btn-outline"
                  onClick={() => onOpenModal(org, "unverify")}
                >
                  <ShieldX size={14} strokeWidth={2.5} /> Remove verification
                </button>
              ) : (
                <button
                  className="btn btn-outline"
                  onClick={() => onOpenModal(org, "verify")}
                >
                  <ShieldCheck size={14} strokeWidth={2.5} /> Mark as verified
                </button>
              )}

              <button
                className="btn btn-outline"
                onClick={() => onOpenModal(org, "resend-invite")}
              >
                <MailWarning size={14} strokeWidth={2.5} /> Resend invitations
              </button>

              <button
                className="btn btn-outline is-danger"
                onClick={() => onOpenModal(org, "delete")}
              >
                <Trash2 size={14} strokeWidth={2.5} /> Deactivate
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main page                                                          */
/* ------------------------------------------------------------------ */
export default function Organizations() {
  const toast = useToast();
  const [query, setQuery] = useState({ page: 1, status: "", search: "" });
  const [sort, setSort] = useState({ field: "created_at", dir: "desc" });
  const [selected, setSelected] = useState(new Set());
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [drawerId, setDrawerId] = useState(null);
  const [tick, setTick] = useState(0);
  const { loading: actionLoading, run } = useAsyncAction();

  const debouncedSearch = useDebounced(query.search, 250);

  const params = useMemo(() => {
    const p = new URLSearchParams({ page: String(query.page) });
    if (query.status) p.set("status", query.status);
    if (debouncedSearch) p.set("search", debouncedSearch);
    p.set("ordering", `${sort.dir === "desc" ? "-" : ""}${sort.field}`);
    return p;
  }, [query.page, query.status, debouncedSearch, sort]);

  const { data, loading } = useFetch(
    () => api.get(`/admin/organizations/?${params}`),
    [params, tick]
  );

  const results = data?.results || [];
  const totalCount = data?.count || 0;

  const patch = (next) => setQuery({ ...query, ...next, page: 1 });
  const toggleSort = (field) =>
    setSort((s) =>
      s.field === field
        ? { field, dir: s.dir === "asc" ? "desc" : "asc" }
        : { field, dir: "asc" }
    );

  /* ----- Selection ----- */
  const toggleOne = (id) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const allOnPage =
    results.length > 0 && results.every((o) => selected.has(o.id));
  const someSelected = selected.size > 0;
  const toggleAll = () => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (allOnPage) results.forEach((o) => n.delete(o.id));
      else results.forEach((o) => n.add(o.id));
      return n;
    });
  };

  /* ----- Actions ----- */
  const openModal = (org, action) => {
    setForm({
      capacity: org?.capacity ?? "",
      reason: "",
    });
    setModal({ org, action });
  };
  const closeModal = () => setModal(null);
  const refresh = () => setTick((t) => t + 1);

  const act = () => {
    const { org, action } = modal;

    if (action === "capacity") {
      return run(
        () =>
          api.patch(`/admin/organizations/${org.id}/`, {
            capacity: Number(form.capacity) || 0,
          }),
        {
          onSuccess: () => {
            toast.success("Capacity updated.");
            closeModal();
            setDrawerId(null);
            refresh();
          },
          onError: (err) => toast.error(errorMessage(err)),
        }
      );
    }

    if (action === "delete") {
      return run(
        () => api.post(`/admin/organizations/${org.id}/delete-org/`),
        {
          onSuccess: () => {
            toast.success("Organisation deactivated.");
            closeModal();
            setDrawerId(null);
            refresh();
          },
          onError: (err) => toast.error(errorMessage(err)),
        }
      );
    }

    const payload = {};
    if (action === "approve") {
      payload.capacity =
        Number(form.capacity || org.capacity || 0) || undefined;
    }
    if (action === "reject") payload.reason = form.reason || "";

    const endpoint =
      action === "resend-invite"
        ? `/admin/organizations/${org.id}/resend-invite/`
        : `/admin/organizations/${org.id}/${action}/`;

    return run(() => api.post(endpoint, payload), {
      onSuccess: (res) => {
        toast.success(res.data.detail || "Done.");
        closeModal();
        setDrawerId(null);
        refresh();
      },
      onError: (err) => toast.error(errorMessage(err)),
    });
  };

  const bulkAct = (action) => {
    if (!someSelected) return;
    run(
      () =>
        api.post(`/admin/organizations/bulk/${action}/`, {
          ids: Array.from(selected),
        }),
      {
        onSuccess: (res) => {
          toast.success(res.data?.detail || "Done.");
          setSelected(new Set());
          refresh();
        },
        onError: (err) => toast.error(errorMessage(err)),
      }
    );
  };

  const exportCsv = () => {
    const rows = (someSelected
      ? results.filter((o) => selected.has(o.id))
      : results
    ).map((o) => ({
      id: o.id,
      name: o.name,
      type: o.org_type,
      county: o.county || "",
      email: o.email || "",
      phone: o.phone || "",
      status: o.status,
      verified: o.verified ? "yes" : "no",
      capacity: o.capacity || "",
      joined: o.created_at || "",
    }));
    if (!rows.length) {
      toast.error("Nothing to export.");
      return;
    }
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        headers
          .map((h) => {
            const v = String(r[h] ?? "");
            return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
          })
          .join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `organizations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${rows.length} organisation(s).`);
  };

  const copy = modal ? MODAL_COPY[modal.action] : null;

  return (
    <div className="page">
      <header className="aorg-header">
        <div>
          <h2>Organisations</h2>
          <p className="aorg-header-sub">
            <strong>{totalCount.toLocaleString()}</strong> employer
            {totalCount === 1 ? "" : "s"} registered on the platform.
          </p>
        </div>
        <div className="aorg-header-actions">
          <button className="btn btn-outline btn-sm" onClick={exportCsv}>
            <Download size={14} strokeWidth={2.5} />
            {someSelected ? `Export ${selected.size}` : "Export CSV"}
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="aorg-toolbar">
        <div className="aorg-filters">
          {FILTERS.map(([value, label]) => (
            <button
              key={value || "all"}
              className={`aorg-filter${query.status === value ? " active" : ""}`}
              onClick={() => patch({ status: value })}
            >
              <span className="aorg-filter-dot" />
              {label}
            </button>
          ))}
        </div>
        <div className="aorg-search">
          <Search size={15} strokeWidth={2.25} />
          <input
            placeholder="Search name, registration no, email…"
            value={query.search}
            onChange={(e) => patch({ search: e.target.value })}
          />
          {query.search && (
            <button
              className="aorg-search-clear"
              onClick={() => patch({ search: "" })}
              aria-label="Clear search"
            >
              <X size={13} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>

      {/* Bulk bar */}
      {someSelected && (
        <div className="aorg-bulk">
          <span className="aorg-bulk-count">
            <Building2 size={14} strokeWidth={2.5} />
            {selected.size} selected
          </span>
          <div className="aorg-bulk-actions">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => bulkAct("approve")}
              disabled={actionLoading}
            >
              <CheckCircle2 size={12} strokeWidth={2.5} /> Approve
            </button>
            <button
              className="btn btn-danger-soft btn-sm"
              onClick={() => bulkAct("suspend")}
              disabled={actionLoading}
            >
              <Ban size={12} strokeWidth={2.5} /> Suspend
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => bulkAct("reinstate")}
              disabled={actionLoading}
            >
              <RotateCcw size={12} strokeWidth={2.5} /> Reinstate
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={exportCsv}
              disabled={actionLoading}
            >
              <Download size={12} strokeWidth={2.5} /> Export
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setSelected(new Set())}
            >
              <X size={12} strokeWidth={2.5} /> Clear
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <PageLoader />
      ) : results.length === 0 ? (
        <EmptyState
          icon="fa-building"
          title="No organisations"
          text="No organisations match your filters."
        />
      ) : (
        <>
          <div className="aorg-table-card">
            <table className="aorg-table">
              <thead>
                <tr>
                  <th className="aorg-check">
                    <input
                      type="checkbox"
                      checked={allOnPage}
                      onChange={toggleAll}
                      aria-label="Select all organisations"
                    />
                  </th>
                  <SortHeader
                    label="Organisation"
                    field="name"
                    sort={sort}
                    onSort={toggleSort}
                  />
                  <SortHeader
                    label="Type"
                    field="org_type"
                    sort={sort}
                    onSort={toggleSort}
                  />
                  <SortHeader
                    label="County"
                    field="county"
                    sort={sort}
                    onSort={toggleSort}
                  />
                  <SortHeader
                    label="Status"
                    field="status"
                    sort={sort}
                    onSort={toggleSort}
                  />
                  <SortHeader
                    label="Capacity"
                    field="capacity"
                    sort={sort}
                    onSort={toggleSort}
                  />
                  <th aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                {results.map((org) => {
                  const rowSelected = selected.has(org.id);
                  return (
                    <tr
                      key={org.id}
                      className={rowSelected ? "is-selected" : ""}
                      onClick={() => setDrawerId(org.id)}
                    >
                      <td
                        className="aorg-check"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={rowSelected}
                          onChange={() => toggleOne(org.id)}
                        />
                      </td>
                      <td>
                        <div className="aorg-org">
                          <div className="aorg-avatar">
                            {initialsFor(org.name)}
                          </div>
                          <div className="aorg-org-info">
                            <div className="aorg-org-name">
                              {org.name}
                              {org.verified && (
                                <span className="aorg-verified">
                                  <BadgeCheck size={11} strokeWidth={2.75} />
                                  Verified
                                </span>
                              )}
                            </div>
                            <div className="aorg-org-email">
                              <Mail size={11} strokeWidth={2.25} />
                              {org.email || "No email on file"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="aorg-cell">
                          <Building2 size={13} strokeWidth={2.25} />
                          {labelFor(ORGANIZATION_TYPES, org.org_type)}
                        </span>
                      </td>
                      <td>
                        {org.county ? (
                          <span className="aorg-cell">
                            <MapPin size={13} strokeWidth={2.25} />
                            {org.county}
                          </span>
                        ) : (
                          <span className="aorg-cell is-muted">—</span>
                        )}
                      </td>
                      <td>
                        <StatusBadge status={org.status} />
                      </td>
                      <td>
                        {org.capacity ? (
                          <span className="aorg-capacity">
                            <Armchair size={12} strokeWidth={2.5} />
                            {org.capacity}
                          </span>
                        ) : (
                          <span className="aorg-cell is-muted">—</span>
                        )}
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="aorg-actions">
                          <button
                            className="aorg-icon-btn"
                            title="View details"
                            onClick={() => setDrawerId(org.id)}
                          >
                            <Info size={14} strokeWidth={2.25} />
                          </button>
                          {org.status === "PENDING" && (
                            <button
                              className="aorg-icon-btn"
                              title="Approve"
                              onClick={() => openModal(org, "approve")}
                            >
                              <CheckCircle2 size={14} strokeWidth={2.25} />
                            </button>
                          )}
                          {org.status === "ACTIVE" && (
                            <button
                              className="aorg-icon-btn is-danger"
                              title="Suspend"
                              onClick={() => openModal(org, "suspend")}
                            >
                              <Ban size={14} strokeWidth={2.25} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            page={query.page}
            count={totalCount}
            onPage={(page) => setQuery({ ...query, page })}
          />
        </>
      )}

      {drawerId && (
        <OrgDrawer
          orgId={drawerId}
          onClose={() => setDrawerId(null)}
          onOpenModal={openModal}
        />
      )}

      {modal && copy && (
        <Modal
          title={`${copy.title} “${modal.org.name}”`}
          onClose={closeModal}
        >
          <p className="aorg-modal-body">{copy.body}</p>
          {copy.warning && (
            <div className="aorg-modal-warning">
              <ShieldAlert size={16} strokeWidth={2.25} />
              <span>{copy.warning}</span>
            </div>
          )}

          {(modal.action === "approve" || modal.action === "capacity") && (
            <label className="aorg-field">
              <span className="aorg-field-label">
                Placement capacity (annual)
              </span>
              <input
                className="input"
                type="number"
                min="1"
                value={form.capacity ?? ""}
                onChange={(e) =>
                  setForm({ ...form, capacity: e.target.value })
                }
                placeholder="e.g. 50"
              />
            </label>
          )}

          {modal.action === "reject" && (
            <label className="aorg-field">
              <span className="aorg-field-label">
                Reason <span className="req">*</span>
              </span>
              <textarea
                className="input"
                rows={2}
                value={form.reason || ""}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="Shown to the organisation"
              />
            </label>
          )}

          <div className="aorg-modal-actions">
            <button
              className="btn btn-outline"
              onClick={closeModal}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button
              className={`btn ${copy.confirmClass}`}
              disabled={
                actionLoading || (modal.action === "reject" && !form.reason)
              }
              onClick={act}
            >
              {actionLoading ? (
                <Spinner small />
              ) : (
                <>
                  <copy.icon size={14} strokeWidth={2.5} />
                  {copy.confirm}
                </>
              )}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}