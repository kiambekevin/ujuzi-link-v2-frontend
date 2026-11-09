import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  BadgeCheck,
  Ban,
  BookOpen,
  Briefcase,
  CheckCircle2,
  CircleDot,
  Download,
  ExternalLink,
  Filter,
  Info,
  Lock,
  Mail,
  MailWarning,
  MapPin,
  Phone,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Star,
  Trash2,
  UserCog,
  UserRound,
  Users as UsersIcon,
  X,
} from "lucide-react";
import { api, errorMessage } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  EmptyState,
  Modal,
  PageLoader,
  Pagination,
  Spinner,
  useAsyncAction,
  useFetch,
} from "../../components/ui";
import { fmtDate, labelFor } from "../../lib/constants";
import "./Users.css";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */
const ROLES = [
  ["TRAINEE", "Trainee"],
  ["ORG_OFFICER", "Org Officer"],
  ["ORG_SUPERVISOR", "Org Supervisor"],
  ["ADMIN", "Administrator"],
];

const ROLE_META = {
  TRAINEE: { icon: UserRound, cls: "is-trainee" },
  ORG_OFFICER: { icon: Briefcase, cls: "is-officer" },
  ORG_SUPERVISOR: { icon: ShieldCheck, cls: "is-supervisor" },
  ADMIN: { icon: BadgeCheck, cls: "is-admin" },
};

const STATUS_FILTERS = [
  ["", "All"],
  ["ACTIVE", "Active"],
  ["SUSPENDED", "Suspended"],
  ["INACTIVE", "Inactive"],
];

const MODAL_COPY = {
  suspend: {
    title: "Suspend user",
    confirm: "Suspend user",
    confirmClass: "btn-danger",
    icon: Ban,
    body: "The user will be blocked from signing in until reinstated. Their data and history remain intact.",
  },
  reinstate: {
    title: "Reinstate user",
    confirm: "Reinstate user",
    confirmClass: "btn-primary",
    icon: RotateCcw,
    body: "The user will regain full access to the platform and can sign in again immediately.",
  },
  "delete-data": {
    title: "Delete user data",
    confirm: "Delete data",
    confirmClass: "btn-danger",
    icon: Trash2,
    body: "Personal information is anonymised and the account deactivated. Applications and placement records are retained per data-retention policy.",
    warning:
      "This action cannot be undone. The user will no longer be able to sign in.",
  },
  "resend-verification": {
    title: "Resend verification",
    confirm: "Send verification",
    confirmClass: "btn-primary",
    icon: MailWarning,
    body: "A new verification code will be sent to the user's email or phone on file.",
  },
  verify: {
    title: "Manually verify",
    confirm: "Mark as verified",
    confirmClass: "btn-primary",
    icon: CheckCircle2,
    body: "This bypasses the normal OTP flow and marks the user's email and phone as verified.",
  },
  impersonate: {
    title: "Impersonate user",
    confirm: "Impersonate",
    confirmClass: "btn-primary",
    icon: ExternalLink,
    body: "You will be signed in as this user for support purposes. This action is recorded in the audit trail.",
    warning:
      "Do not use this to make changes on behalf of the user without their consent.",
  },
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/**
 * An admin user is protected from all admin-side edits unless the actor is
 * a superuser. Centralised here so every action checks the same rule.
 */
function isProtectedAdmin(targetUser, currentUser) {
  if (!targetUser) return false;
  if (targetUser.role !== "ADMIN" && !targetUser.is_superuser) return false;
  return !currentUser?.is_superuser;
}

function initialsFor(user) {
  const name = `${user.first_name || ""} ${user.last_name || ""}`.trim();
  const parts = name.split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (user.email || user.phone || "?").slice(0, 2).toUpperCase();
}

function displayName(user) {
  const name = `${user.first_name || ""} ${user.last_name || ""}`.trim();
  return name || user.email || user.phone || `User #${user.id}`;
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
      aria-sort={
        active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"
      }
    >
      <span className="ausr-th-inner">
        {label}
        <Icon size={12} strokeWidth={2.5} />
      </span>
    </th>
  );
}

function RoleChip({ role }) {
  const meta = ROLE_META[role] || ROLE_META.TRAINEE;
  const Icon = meta.icon;
  return (
    <span className={`ausr-role ${meta.cls}`}>
      <Icon size={11} strokeWidth={2.75} />
      {labelFor(ROLES, role)}
    </span>
  );
}

function StatusPill({ user }) {
  if (user.is_suspended)
    return (
      <span className="ausr-status is-suspended">
        <Ban size={11} strokeWidth={2.75} /> Suspended
      </span>
    );
  if (!user.is_active)
    return (
      <span className="ausr-status is-inactive">
        <Info size={11} strokeWidth={2.75} /> Inactive
      </span>
    );
  return (
    <span className="ausr-status is-active">
      <CheckCircle2 size={11} strokeWidth={2.75} /> Active
    </span>
  );
}

function DrawerRow({ icon: Icon, label, value, badge }) {
  return (
    <div className="ausr-drawer-row">
      <Icon size={14} strokeWidth={2.25} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="ausr-drawer-row-label">{label}</div>
        <div className="ausr-drawer-row-value">
          {value}
          {badge === "verified" && (
            <span className="ausr-verify-pill is-on">✓ Verified</span>
          )}
          {badge === "unverified" && (
            <span className="ausr-verify-pill is-off">✗ Unverified</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Drawer                                                              */
/* ------------------------------------------------------------------ */
function UserDrawer({ userId, currentUser, onClose, onOpenModal }) {
  const { data: user, loading, error } = useFetch(
    () => api.get(`/admin/users/${userId}/`),
    [userId]
  );

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const locked = isProtectedAdmin(user, currentUser);
  const isSelf = currentUser?.id === user?.id;

  return (
    <div className="ausr-drawer-overlay" onClick={onClose}>
      <aside className="ausr-drawer" onClick={(e) => e.stopPropagation()}>
        {loading ? (
          <div style={{ padding: 40 }}>
            <Spinner />
          </div>
        ) : error || !user ? (
          <div style={{ padding: 24 }}>
            <div className="ausr-modal-warning">
              <ShieldAlert size={16} strokeWidth={2.25} />
              <span>
                Could not load user details.
                {error?.response?.status
                  ? ` (HTTP ${error.response.status})`
                  : ""}
                {error?.response?.data?.detail
                  ? ` — ${error.response.data.detail}`
                  : ""}
              </span>
            </div>
            <button className="btn btn-outline" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="ausr-drawer-head">
              <button
                className="ausr-drawer-close"
                onClick={onClose}
                aria-label="Close drawer"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
              <div className="ausr-drawer-avatar">{initialsFor(user)}</div>
              <h3 className="ausr-drawer-name">{displayName(user)}</h3>
              <div className="ausr-drawer-sub">
                <RoleChip role={user.role} />
                <StatusPill user={user} />
              </div>
            </div>

            <div className="ausr-drawer-body">
              {locked && (
                <div className="ausr-drawer-locked">
                  <Lock size={14} strokeWidth={2.25} />
                  <span>
                    This administrator is protected. Only a superuser can modify
                    their account.
                  </span>
                </div>
              )}

              <section>
                <p className="ausr-drawer-section-title">Contact</p>
                <div className="ausr-drawer-rows">
                  <DrawerRow
                    icon={Mail}
                    label="Email"
                    value={user.email || "—"}
                    badge={
                      user.email
                        ? user.is_email_verified
                          ? "verified"
                          : "unverified"
                        : null
                    }
                  />
                  <DrawerRow
                    icon={Phone}
                    label="Phone"
                    value={user.phone || "—"}
                    badge={
                      user.phone
                        ? user.is_phone_verified
                          ? "verified"
                          : "unverified"
                        : null
                    }
                  />
                </div>
              </section>

              <section>
                <p className="ausr-drawer-section-title">Account</p>
                <div className="ausr-drawer-rows">
                  <DrawerRow
                    icon={UserCog}
                    label="User ID"
                    value={`#${user.id}`}
                  />
                  {user.date_joined && (
                    <DrawerRow
                      icon={Info}
                      label="Joined"
                      value={fmtDate(user.date_joined, true)}
                    />
                  )}
                  {user.last_login && (
                    <DrawerRow
                      icon={Info}
                      label="Last login"
                      value={fmtDate(user.last_login, true)}
                    />
                  )}
                  <DrawerRow
                    icon={Star}
                    label="Applications sent"
                    value={user.stats?.applications_sent ?? 0}
                  />
                  <DrawerRow
                    icon={Star}
                    label="Placements"
                    value={user.stats?.placements_count ?? 0}
                  />
                </div>
              </section>

              {user.trainee_profile && (
                <section>
                  <p className="ausr-drawer-section-title">Trainee profile</p>
                  <div className="ausr-drawer-rows">
                    <DrawerRow
                      icon={UserRound}
                      label="Full name"
                      value={user.trainee_profile.full_name || "—"}
                    />
                    {user.trainee_profile.gender && (
                      <DrawerRow
                        icon={Info}
                        label="Gender"
                        value={user.trainee_profile.gender}
                      />
                    )}
                    {user.trainee_profile.date_of_birth && (
                      <DrawerRow
                        icon={Info}
                        label="Date of birth"
                        value={fmtDate(user.trainee_profile.date_of_birth)}
                      />
                    )}
                    {user.trainee_profile.county_display && (
                      <DrawerRow
                        icon={MapPin}
                        label="County"
                        value={user.trainee_profile.county_display}
                      />
                    )}
                    <DrawerRow
                      icon={BookOpen}
                      label="Skills"
                      value={user.trainee_profile.skills_count}
                    />
                    {user.trainee_profile.is_under_18 && (
                      <DrawerRow
                        icon={ShieldAlert}
                        label="Guardian consent"
                        value={
                          user.trainee_profile.guardian_consent
                            ? "On file"
                            : "Missing"
                        }
                      />
                    )}
                  </div>
                </section>
              )}

              {user.org_memberships?.length > 0 && (
                <section>
                  <p className="ausr-drawer-section-title">Organisations</p>
                  <div className="ausr-drawer-rows">
                    {user.org_memberships.map((m) => (
                      <DrawerRow
                        key={m.org_id}
                        icon={Briefcase}
                        label={m.org_name}
                        value={m.is_active ? "Active" : "Inactive"}
                      />
                    ))}
                  </div>
                </section>
              )}

              {user.suspension_logs?.length > 0 && (
                <section>
                  <p className="ausr-drawer-section-title">Suspension history</p>
                  <div className="ausr-drawer-rows">
                    {user.suspension_logs.map((log) => (
                      <DrawerRow
                        key={log.id}
                        icon={log.action === "SUSPEND" ? Ban : RotateCcw}
                        label={`${log.action} · ${fmtDate(log.created_at, true)}`}
                        value={log.reason || log.actor_name || "—"}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {!locked ? (
              <div className="ausr-drawer-actions">
                <button
                  className="btn btn-outline"
                  onClick={() => onOpenModal(user, "change-role")}
                >
                  <UserCog size={14} strokeWidth={2.5} /> Change role
                </button>

                {(!user.is_email_verified || !user.is_phone_verified) && (
                  <>
                    <button
                      className="btn btn-outline"
                      onClick={() => onOpenModal(user, "resend-verification")}
                    >
                      <MailWarning size={14} strokeWidth={2.5} /> Resend
                      verification
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => onOpenModal(user, "verify")}
                    >
                      <CheckCircle2 size={14} strokeWidth={2.5} /> Manually verify
                    </button>
                  </>
                )}

                {!user.is_suspended && user.role !== "ADMIN" && !isSelf && (
                  <button
                    className="btn btn-danger-soft"
                    onClick={() => onOpenModal(user, "suspend")}
                  >
                    <Ban size={14} strokeWidth={2.5} /> Suspend user
                  </button>
                )}
                {user.is_suspended && (
                  <button
                    className="btn btn-primary"
                    onClick={() => onOpenModal(user, "reinstate")}
                  >
                    <RotateCcw size={14} strokeWidth={2.5} /> Reinstate user
                  </button>
                )}
                {user.role !== "ADMIN" && !isSelf && (
                  <button
                    className="btn btn-outline"
                    onClick={() => onOpenModal(user, "impersonate")}
                  >
                    <ExternalLink size={14} strokeWidth={2.5} /> Impersonate
                  </button>
                )}
              </div>
            ) : (
              <div className="ausr-drawer-actions is-locked">
                <span className="ausr-drawer-locked-note">
                  <Lock size={12} strokeWidth={2.5} /> Protected administrator —
                  no actions available
                </span>
              </div>
            )}
          </>
        )}
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main page                                                          */
/* ------------------------------------------------------------------ */
export default function Users() {
  const toast = useToast();
  const { user: currentUser } = useAuth();
  const [query, setQuery] = useState({
    page: 1,
    role: "",
    status: "",
    search: "",
  });
  const [sort, setSort] = useState({ field: "date_joined", dir: "desc" });
  const [selected, setSelected] = useState(new Set());
  const [modal, setModal] = useState(null); // { user, action }
  const [roleDraft, setRoleDraft] = useState("");
  const [suspendReason, setSuspendReason] = useState("");
  const [drawerId, setDrawerId] = useState(null);
  const [tick, setTick] = useState(0);
  const { loading: actionLoading, run } = useAsyncAction();

  const debouncedSearch = useDebounced(query.search, 250);

  const params = useMemo(() => {
    const p = new URLSearchParams({ page: String(query.page) });
    if (query.role) p.set("role", query.role);
    if (query.status) p.set("status", query.status);
    if (debouncedSearch) p.set("search", debouncedSearch);
    p.set("ordering", `${sort.dir === "desc" ? "-" : ""}${sort.field}`);
    return p;
  }, [query.page, query.role, query.status, debouncedSearch, sort]);

  const { data, loading } = useFetch(
    () => api.get(`/admin/users/?${params}`),
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
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const allOnPage = results.length > 0 && results.every((u) => selected.has(u.id));
  const someSelected = selected.size > 0;

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOnPage) results.forEach((u) => next.delete(u.id));
      else
        results
          .filter((u) => !isProtectedAdmin(u, currentUser))
          .filter((u) => u.id !== currentUser?.id)
          .forEach((u) => next.add(u.id));
      return next;
    });
  };

  /* ----- Actions ----- */
  const openModal = (user, action) => {
    // Never open a destructive modal for a protected admin or for self.
    if (isProtectedAdmin(user, currentUser)) {
      toast.error("Administrators are protected and cannot be modified.");
      return;
    }
    if (user.id === currentUser?.id) {
      toast.error("You cannot perform this action on your own account.");
      return;
    }
    setRoleDraft(user.role);
    setSuspendReason("");
    setModal({ user, action });
  };
  const closeModal = () => setModal(null);

  const refresh = () => setTick((t) => t + 1);

  const act = () => {
    const { user, action } = modal;

    // Belt-and-braces: reject even if someone bypassed openModal.
    if (isProtectedAdmin(user, currentUser)) {
      toast.error("Administrators cannot be modified.");
      closeModal();
      return;
    }
    if (user.id === currentUser?.id) {
      toast.error("You cannot perform this action on your own account.");
      closeModal();
      return;
    }

    if (action === "change-role") {
      return run(
        () =>
          api.post(`/admin/users/${user.id}/change-role/`, { role: roleDraft }),
        {
          onSuccess: (res) => {
            toast.success(res.data?.detail || "Role updated.");
            closeModal();
            setDrawerId(null);
            refresh();
          },
          onError: (err) => toast.error(errorMessage(err)),
        }
      );
    }

    if (action === "suspend") {
      return run(
        () =>
          api.post(`/admin/users/${user.id}/suspend/`, {
            reason: suspendReason,
          }),
        {
          onSuccess: () => {
            toast.success("User suspended.");
            closeModal();
            setDrawerId(null);
            refresh();
          },
          onError: (err) => toast.error(errorMessage(err)),
        }
      );
    }

    if (action === "impersonate") {
      return run(() => api.post(`/admin/users/${user.id}/impersonate/`), {
        onSuccess: (res) => {
          const { access, user: target } = res.data;
          sessionStorage.setItem("impersonation_token", access);
          sessionStorage.setItem("impersonation_target", JSON.stringify(target));
          toast.success(
            `Impersonation token issued for ${target.name}. Open in a new tab to use.`
          );
          closeModal();
        },
        onError: (err) => toast.error(errorMessage(err)),
      });
    }

    // verify / resend-verification / reinstate / delete-data
    return run(() => api.post(`/admin/users/${user.id}/${action}/`), {
      onSuccess: (res) => {
        toast.success(res.data?.detail || "Done.");
        closeModal();
        setDrawerId(null);
        refresh();
      },
      onError: (err) => toast.error(errorMessage(err)),
    });
  };

  const bulkAct = (action) => {
    if (!someSelected) return;

    const allowedIds = results
      .filter((u) => selected.has(u.id))
      .filter((u) => !isProtectedAdmin(u, currentUser))
      .filter((u) => u.id !== currentUser?.id)
      .map((u) => u.id);

    if (!allowedIds.length) {
      toast.error("No eligible users selected (administrators are protected).");
      return;
    }

    run(
      () =>
        api.post(`/admin/users/bulk/${action}/`, {
          ids: allowedIds,
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
      ? results.filter((u) => selected.has(u.id))
      : results
    ).map((u) => ({
      id: u.id,
      name: displayName(u),
      email: u.email || "",
      phone: u.phone || "",
      role: u.role,
      status: u.is_suspended
        ? "SUSPENDED"
        : u.is_active
        ? "ACTIVE"
        : "INACTIVE",
      email_verified: u.is_email_verified ? "yes" : "no",
      phone_verified: u.is_phone_verified ? "yes" : "no",
      joined: u.date_joined || "",
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
    a.download = `users-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${rows.length} user${rows.length === 1 ? "" : "s"}.`);
  };

  return (
    <div className="page">
      <header className="ausr-header">
        <div>
          <h2>Users</h2>
          <p className="ausr-header-sub">
            <strong>{totalCount.toLocaleString()}</strong>{" "}
            {totalCount === 1 ? "user" : "users"} across trainees, employer staff
            and administrators.
          </p>
        </div>
        <div className="ausr-header-actions">
          <button className="btn btn-outline btn-sm" onClick={exportCsv}>
            <Download size={14} strokeWidth={2.5} />
            {someSelected ? `Export ${selected.size}` : "Export CSV"}
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="ausr-toolbar">
        <div className="ausr-toolbar-section ausr-toolbar-section--roles">
          <span className="ausr-toolbar-caption">
            <Filter size={10} strokeWidth={2.75} /> Role
          </span>
          <div className="ausr-filter-group">
            <button
              className={`ausr-filter${query.role === "" ? " active" : ""}`}
              onClick={() => patch({ role: "" })}
            >
              <span className="ausr-filter-dot" /> All
            </button>
            {ROLES.map(([value, label]) => (
              <button
                key={value}
                className={`ausr-filter${
                  query.role === value ? " active" : ""
                }`}
                onClick={() => patch({ role: value })}
              >
                <span className="ausr-filter-dot" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="ausr-toolbar-section ausr-toolbar-section--status">
          <span className="ausr-toolbar-caption">
            <CircleDot size={10} strokeWidth={2.75} /> Status
          </span>
          <div className="ausr-filter-group ausr-filter-group--status">
            {STATUS_FILTERS.map(([value, label]) => (
              <button
                key={value || "all"}
                className={`ausr-filter${
                  query.status === value ? " active" : ""
                }`}
                onClick={() => patch({ status: value })}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="ausr-toolbar-section ausr-toolbar-section--search">
          <div className="ausr-search">
            <Search size={15} strokeWidth={2.25} />
            <input
              placeholder="Search name, email, phone…"
              value={query.search}
              onChange={(e) => patch({ search: e.target.value })}
            />
            {query.search && (
              <button
                className="ausr-search-clear"
                onClick={() => patch({ search: "" })}
                aria-label="Clear search"
                title="Clear search"
              >
                <X size={13} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bulk bar */}
      {someSelected && (
        <div className="ausr-bulk">
          <span className="ausr-bulk-count">
            <UsersIcon size={14} strokeWidth={2.5} />
            {selected.size} selected
          </span>
          <div className="ausr-bulk-actions">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => bulkAct("reinstate")}
              disabled={actionLoading}
            >
              <RotateCcw size={12} strokeWidth={2.5} /> Reinstate
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
              onClick={exportCsv}
              disabled={actionLoading}
            >
              <Download size={12} strokeWidth={2.5} /> Export
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setSelected(new Set())}
              disabled={actionLoading}
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
          icon="fa-users"
          title="No users"
          text="No users match your filters."
        />
      ) : (
        <>
          <div className="ausr-table-card">
            <table className="ausr-table">
              <thead>
                <tr>
                  <th className="ausr-check">
                    <input
                      type="checkbox"
                      checked={allOnPage}
                      onChange={toggleAll}
                      aria-label="Select all users on this page"
                    />
                  </th>
                  <SortHeader
                    label="User"
                    field="first_name"
                    sort={sort}
                    onSort={toggleSort}
                  />
                  <SortHeader
                    label="Role"
                    field="role"
                    sort={sort}
                    onSort={toggleSort}
                  />
                  <SortHeader
                    label="Contact"
                    field="email"
                    sort={sort}
                    onSort={toggleSort}
                    className="ausr-col-contact"
                  />
                  <SortHeader
                    label="Status"
                    field="is_suspended"
                    sort={sort}
                    onSort={toggleSort}
                  />
                  <SortHeader
                    label="Joined"
                    field="date_joined"
                    sort={sort}
                    onSort={toggleSort}
                    className="ausr-col-joined"
                  />
                  <th aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                {results.map((u) => {
                  const isSelf = currentUser?.id === u.id;
                  const isLocked = isProtectedAdmin(u, currentUser);
                  const avatarCls = u.is_suspended
                    ? " is-suspended"
                    : u.role === "ADMIN"
                    ? " is-admin"
                    : "";
                  const rowSelected = selected.has(u.id);

                  return (
                    <tr
                      key={u.id}
                      className={rowSelected ? "is-selected" : ""}
                      onClick={() => setDrawerId(u.id)}
                    >
                      <td
                        className="ausr-check"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={rowSelected}
                          onChange={() => toggleOne(u.id)}
                          disabled={isLocked || isSelf}
                          aria-label={`Select ${displayName(u)}`}
                        />
                      </td>
                      <td>
                        <div className="ausr-user">
                          <div className={`ausr-avatar${avatarCls}`}>
                            {initialsFor(u)}
                          </div>
                          <div className="ausr-user-info">
                            <div className="ausr-user-name">
                              {displayName(u)}
                              {isSelf && <span className="ausr-you">You</span>}
                              {isLocked && !isSelf && (
                                <Lock
                                  size={11}
                                  strokeWidth={2.5}
                                  style={{ color: "var(--text-muted)" }}
                                  title="Protected administrator"
                                />
                              )}
                            </div>
                            <div className="ausr-user-id">ID #{u.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <RoleChip role={u.role} />
                      </td>
                      <td className="ausr-col-contact">
                        {u.email ? (
                          <span className="ausr-contact">
                            <Mail size={13} strokeWidth={2.25} />
                            <span className="ausr-contact-text">{u.email}</span>
                          </span>
                        ) : u.phone ? (
                          <span className="ausr-contact">
                            <Phone size={13} strokeWidth={2.25} />
                            <span className="ausr-contact-text">{u.phone}</span>
                          </span>
                        ) : (
                          <span className="ausr-contact">—</span>
                        )}
                      </td>
                      <td>
                        <StatusPill user={u} />
                      </td>
                      <td className="ausr-col-joined">
                        <span className="ausr-date">
                          <Info size={12} strokeWidth={2.25} />
                          {u.date_joined ? fmtDate(u.date_joined) : "—"}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="ausr-actions">
                          <button
                            className="ausr-icon-btn"
                            title="View details"
                            onClick={() => setDrawerId(u.id)}
                          >
                            <Info size={14} strokeWidth={2.25} />
                          </button>
                          {!isLocked &&
                            !isSelf &&
                            !u.is_suspended &&
                            u.role !== "ADMIN" && (
                              <button
                                className="ausr-icon-btn is-danger"
                                title="Suspend user"
                                onClick={() => openModal(u, "suspend")}
                              >
                                <Ban size={14} strokeWidth={2.25} />
                              </button>
                            )}
                          {!isLocked && u.is_suspended && (
                            <button
                              className="ausr-icon-btn"
                              title="Reinstate user"
                              onClick={() => openModal(u, "reinstate")}
                            >
                              <RotateCcw size={14} strokeWidth={2.25} />
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
        <UserDrawer
          userId={drawerId}
          currentUser={currentUser}
          onClose={() => setDrawerId(null)}
          onOpenModal={openModal}
        />
      )}

      {modal && (
        <ModalRenderer
          modal={modal}
          roleDraft={roleDraft}
          setRoleDraft={setRoleDraft}
          suspendReason={suspendReason}
          setSuspendReason={setSuspendReason}
          onClose={closeModal}
          onConfirm={act}
          loading={actionLoading}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Modal renderer                                                      */
/* ------------------------------------------------------------------ */
function ModalRenderer({
  modal,
  roleDraft,
  setRoleDraft,
  suspendReason,
  setSuspendReason,
  onClose,
  onConfirm,
  loading,
}) {
  const { user, action } = modal;

  if (action === "change-role") {
    return (
      <Modal title="Change user role" onClose={onClose}>
        <p className="ausr-modal-body">
          Changing a user's role affects what they can do. This is recorded in
          the audit log.
        </p>
        <label className="ausr-field">
          <span className="ausr-field-label">New role</span>
          <select
            className="input"
            value={roleDraft}
            onChange={(e) => setRoleDraft(e.target.value)}
          >
            {ROLES.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <span className="ausr-field-hint">
            Current: <strong>{labelFor(ROLES, user.role)}</strong>
          </span>
        </label>
        <div className="ausr-modal-actions">
          <button className="btn btn-outline" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={onConfirm}
            disabled={loading || roleDraft === user.role}
          >
            {loading ? (
              <Spinner small />
            ) : (
              <>
                <UserCog size={14} strokeWidth={2.5} /> Save role
              </>
            )}
          </button>
        </div>
      </Modal>
    );
  }

  if (action === "suspend") {
    return (
      <Modal title="Suspend user" onClose={onClose}>
        <p className="ausr-modal-body">
          The user will be blocked from signing in until reinstated. Their data
          and history remain intact.
        </p>
        <label className="ausr-field">
          <span className="ausr-field-label">
            Reason (optional, recorded in audit log)
          </span>
          <textarea
            className="input"
            rows={2}
            value={suspendReason}
            onChange={(e) => setSuspendReason(e.target.value)}
            placeholder="e.g. Violation of platform terms"
          />
        </label>
        <div className="ausr-modal-actions">
          <button className="btn btn-outline" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? (
              <Spinner small />
            ) : (
              <>
                <Ban size={14} strokeWidth={2.5} /> Suspend user
              </>
            )}
          </button>
        </div>
      </Modal>
    );
  }

  const copy = MODAL_COPY[action];
  if (!copy) return null;

  return (
    <Modal title={copy.title} onClose={onClose}>
      <p className="ausr-modal-body">{copy.body}</p>
      {copy.warning && (
        <div className="ausr-modal-warning">
          <ShieldAlert size={16} strokeWidth={2.25} />
          <span>{copy.warning}</span>
        </div>
      )}
      <div className="ausr-modal-actions">
        <button className="btn btn-outline" onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button
          className={`btn ${copy.confirmClass}`}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? (
            <Spinner small />
          ) : (
            <>
              <copy.icon size={14} strokeWidth={2.5} /> {copy.confirm}
            </>
          )}
        </button>
      </div>
    </Modal>
  );
}