import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import ujuziLogo from '../assets/images/ujuzink.png' 
import {
  Award,
  BadgeCheck,
  Bell,
  Bookmark,
  BookUser,
  Briefcase,
  Building2,
  ChevronRight,
  FileText,
  Gauge,
  Handshake,
  Inbox,
  Info,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  Megaphone,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import "./AppShell.css";

/* ------------------------------------------------------------------ */
/* Navigation definitions                                             */
/* ------------------------------------------------------------------ */
const TRAINEE_NAV = [
  { to: "/app", label: "Dashboard", icon: Gauge, end: true, section: "Overview" },
  { to: "/app/opportunities", label: "Opportunities", icon: Briefcase, section: "Overview" },
  { to: "/app/applications", label: "My Applications", icon: FileText, section: "Overview" },
  { to: "/app/saved", label: "Saved", icon: Bookmark, section: "Overview" },
  { to: "/app/passport", label: "My Passport", icon: BookUser, section: "Overview" },
  { to: "/app/placements", label: "Placements", icon: Handshake, section: "Overview" },
  { to: "/app/profile", label: "My Profile", icon: UserRound, section: "Account" },
  { to: "/app/notifications", label: "Notifications", icon: Bell, section: "Account" },
  { to: "/app/complaints", label: "Report a Concern", icon: ShieldAlert, section: "Account" },
  { to: "/app/data", label: "Data & Privacy", icon: Lock, section: "Account" },
];

const ORG_NAV = [
  { to: "/app/org", label: "Dashboard", icon: Gauge, end: true, section: "Overview" },
  { to: "/app/org/organization", label: "My Organisation", icon: Building2, section: "Overview" },
  { to: "/app/org/opportunities", label: "Opportunities", icon: Megaphone, section: "Operations" },
  { to: "/app/org/applications", label: "Applications", icon: Inbox, section: "Operations" },
  { to: "/app/org/placements", label: "Placements", icon: Handshake, section: "Operations" },
  { to: "/app/org/notifications", label: "Notifications", icon: Bell, section: "Account" },
  { to: "/app/org/complaints", label: "Report a Concern", icon: ShieldAlert, section: "Account" },
];

const ADMIN_NAV = [
  { to: "/app/admin", label: "Dashboard", icon: Gauge, end: true, section: "Overview" },
  { to: "/app/admin/organizations", label: "Organisations", icon: Building2, section: "Moderation" },
  { to: "/app/admin/opportunities", label: "Opportunities", icon: Megaphone, section: "Moderation" },
  { to: "/app/admin/complaints", label: "Complaints", icon: ShieldAlert, section: "Moderation" },
  { to: "/app/admin/users", label: "Users", icon: Users, section: "Administration" },
  { to: "/app/admin/reports", label: "Reports & Exports", icon: ScrollText, section: "Administration" },
  { to: "/app/admin/audit", label: "Audit Log", icon: BadgeCheck, section: "Administration" },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */
function groupBySection(nav) {
  const sections = new Map();
  nav.forEach((item) => {
    const section = item.section || "Navigation";
    if (!sections.has(section)) sections.set(section, []);
    sections.get(section).push(item);
  });
  return [...sections.entries()];
}

function roleLabel(role) {
  return (
    {
      ADMIN: "Administrator",
      TRAINEE: "Job Seeker",
      ORG_OFFICER: "Recruitment Officer",
      ORG_SUPERVISOR: "Supervisor",
    }[role] || "Member"
  );
}

function roleChipClass(role) {
  return (
    {
      ADMIN: "is-admin",
      TRAINEE: "is-trainee",
      ORG_OFFICER: "is-officer",
      ORG_SUPERVISOR: "is-supervisor",
    }[role] || "is-trainee"
  );
}

/* ------------------------------------------------------------------ */
/* Notifications bell                                                 */
/* ------------------------------------------------------------------ */
function NotificationsBell({ role }) {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const ref = useRef(null);
  const navigate = useNavigate();

  const load = () => {
    api
      .get("/notifications/")
      .then((res) => {
        const list = res.data.results || res.data || [];
        setCount(list.filter((n) => !n.read_at).length);
        setItems(list.slice(0, 5));
      })
      .catch(() => {});
  };

  useEffect(() => {
    load();
    const onClick = (e) =>
      ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const toggle = () => {
    setOpen((o) => !o);
    if (!open) load();
  };

  const markAllRead = () => {
    api
      .post("/notifications/mark-all-read/")
      .then(() => {
        setCount(0);
        setItems((list) =>
          list.map((n) => ({
            ...n,
            read_at: n.read_at || new Date().toISOString(),
          }))
        );
      })
      .catch(() => {});
  };

  const homePath =
    role === "ADMIN"
      ? "/app/admin"
      : role === "ORG_OFFICER" || role === "ORG_SUPERVISOR"
      ? "/app/org/notifications"
      : "/app/notifications";

  return (
    <div className="sh-bell-wrap" ref={ref}>
      <button
        className="sh-icon-btn"
        onClick={toggle}
        aria-label={`Notifications${count ? `, ${count} unread` : ""}`}
      >
        <Bell size={17} strokeWidth={2.25} />
        {count > 0 && (
          <span className="sh-bell-dot has-count">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="sh-dropdown">
          <div className="sh-dropdown-head">
            <h4>
              <Bell size={14} strokeWidth={2.5} /> Notifications
            </h4>
            {count > 0 && (
              <button onClick={markAllRead} type="button">
                Mark all read
              </button>
            )}
          </div>

          <div className="sh-dropdown-list">
            {items.length === 0 ? (
              <div className="sh-notif-empty">
                <Bell size={22} strokeWidth={2} />
                <div>No notifications yet.</div>
              </div>
            ) : (
              items.map((n) => (
                <div
                  key={n.id}
                  className={`sh-notif ${n.read_at ? "is-read" : "is-unread"}`}
                >
                  <span className="sh-notif-dot" />
                  <div className="sh-notif-body">
                    <div className="sh-notif-title">{n.title}</div>
                    {n.body && <div className="sh-notif-text">{n.body}</div>}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="sh-dropdown-footer">
            <button
              onClick={() => {
                setOpen(false);
                navigate(homePath);
              }}
            >
              <ChevronRight size={13} strokeWidth={2.5} /> View all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* User menu                                                          */
/* ------------------------------------------------------------------ */
function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (e) =>
      ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const initials = (user?.first_name || user?.email || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const name = user?.display_name || user?.first_name || "Account";

  return (
    <div className="sh-bell-wrap" ref={ref}>
      <button
        className="sh-avatar-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
      >
        {initials || "U"}
      </button>

      {open && (
        <div className="sh-user-menu">
          <div className="sh-user-menu-head">
            <div className="sh-user-menu-avatar">{initials || "U"}</div>
            <div className="sh-user-menu-id">
              <div className="sh-user-menu-name">{name}</div>
              {user?.email && (
                <div className="sh-user-menu-email">{user.email}</div>
              )}
            </div>
          </div>

          <div className="sh-user-menu-items">
            {user?.role === "TRAINEE" && (
              <Link
                to="/app/profile"
                className="sh-user-menu-item"
                onClick={() => setOpen(false)}
              >
                <UserRound size={15} strokeWidth={2.25} /> Profile
              </Link>
            )}
            {user?.role === "TRAINEE" && (
              <Link
                to="/app/data"
                className="sh-user-menu-item"
                onClick={() => setOpen(false)}
              >
                <Lock size={15} strokeWidth={2.25} /> Data & Privacy
              </Link>
            )}
            {(user?.role === "ORG_OFFICER" ||
              user?.role === "ORG_SUPERVISOR") && (
              <Link
                to="/app/org/organization"
                className="sh-user-menu-item"
                onClick={() => setOpen(false)}
              >
                <Building2 size={15} strokeWidth={2.25} /> Organisation
              </Link>
            )}
            <div className="sh-user-menu-sep" />
            <button
              className="sh-user-menu-item is-danger"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              <LogOut size={15} strokeWidth={2.25} /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Titles                                                             */
/* ------------------------------------------------------------------ */
const TITLES = {
  "/app": "Dashboard",
  "/app/opportunities": "Opportunities",
  "/app/applications": "My Applications",
  "/app/saved": "Saved Opportunities",
  "/app/passport": "Digital Learning Passport",
  "/app/placements": "My Placements",
  "/app/profile": "My Profile",
  "/app/notifications": "Notifications",
  "/app/complaints": "Report a Concern",
  "/app/data": "My Data & Privacy",
  "/app/org": "Organisation Dashboard",
  "/app/org/organization": "My Organisation",
  "/app/org/opportunities": "Manage Opportunities",
  "/app/org/applications": "Applications",
  "/app/org/placements": "Placements",
  "/app/org/notifications": "Notifications",
  "/app/org/complaints": "Report a Concern",
  "/app/admin": "Admin Dashboard",
  "/app/admin/organizations": "Organisations",
  "/app/admin/opportunities": "Opportunities",
  "/app/admin/users": "Users",
  "/app/admin/complaints": "Complaints",
  "/app/admin/reports": "Reports & Exports",
  "/app/admin/audit": "Audit Log",
};

function resolveTitle(pathname) {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/app/opportunities/")) return "Opportunity Details";
  if (pathname.startsWith("/app/applications/")) return "Application";
  if (pathname.startsWith("/app/org/applications/")) return "Application";
  if (pathname.startsWith("/app/org/placements/")) return "Placement";
  if (pathname.startsWith("/app/placements/")) return "Placement";
  if (pathname.startsWith("/app/org/opportunities/")) return "Manage Opportunity";
  if (pathname.startsWith("/app/admin/")) return "Administration";
  return "Ujuzi Link";
}

/* ------------------------------------------------------------------ */
/* Main shell                                                         */
/* ------------------------------------------------------------------ */
export default function AppShell({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (!user) return null;

  const nav =
    user.role === "ADMIN"
      ? ADMIN_NAV
      : user.role === "TRAINEE"
      ? TRAINEE_NAV
      : ORG_NAV;

  const groupedNav = groupBySection(nav);
  const title = resolveTitle(location.pathname);
  const roleClass = roleChipClass(user.role);
  const RoleIcon =
    user.role === "ADMIN"
      ? BadgeCheck
      : user.role === "TRAINEE"
      ? UserRound
      : ShieldCheck;

  return (
    <div className="sh-shell">
      {mobileOpen && (
        <div
          className="sh-mobile-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sh-sidebar${mobileOpen ? " is-open" : ""}`}>
        <div className="sh-brand">
          <img src={ujuziLogo} width="50" height="50" alt="" aria-hidden="true" />
          <span className="sh-brand-text">
            <b>Ujuzi Link</b>
            <small>{roleLabel(user.role)}</small>
          </span>
        </div>

        {groupedNav.map(([section, items]) => (
          <div key={section}>
            <div className="sh-nav-section">{section}</div>
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `sh-nav-link${isActive ? " active" : ""}`
                  }
                >
                  <Icon size={17} strokeWidth={2.25} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}

        <div className="sh-sidebar-footer">
          <div className="sh-nav-section">Platform</div>
          <Link to="/" className="sh-nav-link">
            <LayoutDashboard size={15} strokeWidth={2.25} /> Home
          </Link>
          <Link to="/about" className="sh-nav-link">
            <Info size={15} strokeWidth={2.25} /> About
          </Link>
          <Link to="/terms" className="sh-nav-link">
            <FileText size={15} strokeWidth={2.25} /> Terms
          </Link>
          <Link to="/privacy" className="sh-nav-link">
            <ShieldAlert size={15} strokeWidth={2.25} /> Privacy
          </Link>
        </div>
      </aside>

      <div className="sh-main">
        <header className="sh-topbar">
          <button
            className="sh-menu-btn"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? (
              <X size={18} strokeWidth={2.5} />
            ) : (
              <Menu size={18} strokeWidth={2.5} />
            )}
          </button>

          <div className="sh-topbar-title">
            <div className="sh-topbar-crumb">
              <Sparkles size={11} strokeWidth={2.5} /> Ujuzi Link
              <ChevronRight size={10} strokeWidth={2.5} />
              {roleLabel(user.role)}
            </div>
            <h1>{title}</h1>
          </div>

          <div className="sh-topbar-spacer" />

          <span className={`sh-role-chip ${roleClass}`}>
            <RoleIcon size={11} strokeWidth={2.75} />
            {roleLabel(user.role)}
          </span>

          {user.role !== "ADMIN" && <NotificationsBell role={user.role} />}
          <UserMenu />
        </header>

        <main className="sh-main-area">{children}</main>
      </div>
    </div>
  );
}