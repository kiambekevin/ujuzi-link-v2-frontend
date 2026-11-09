import { useEffect, useMemo, useState } from "react";
import {
  Award,
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  GraduationCap,
  Info,
  MapPin,
  Plus,
  Save,
  ShieldAlert,
  Sparkles,
  Target,
  Trash2,
  UploadCloud,
  User as UserIcon,
  Users,
} from "lucide-react";
import { api, errorMessage, downloadFile } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import {
  Alert,
  Modal,
  PageLoader,
  Spinner,
  useFetch,
} from "../../components/ui";
import {
  EDUCATION_LEVELS,
  GENDERS,
  INDUSTRY_SECTORS,
  KENYA_COUNTIES,
  OPPORTUNITY_TYPES,
  USER_DOCUMENT_TYPES,
} from "../../lib/constants";
import "./Profile.css";

const MAX_UPLOAD_MB = 10;

const TABS = [
  { key: "about", label: "About me", icon: UserIcon },
  { key: "skills", label: "Skills", icon: Sparkles },
  { key: "education", label: "Education", icon: GraduationCap },
  { key: "experience", label: "Work experience", icon: Briefcase },
  { key: "certifications", label: "Certifications", icon: Award },
  { key: "documents", label: "Documents", icon: FileText },
  { key: "privacy", label: "Privacy", icon: ShieldAlert },
];

function initialsFor(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "?"
  );
}

/* Simple confirm modal used across all tabs for destructive actions */
function ConfirmModal({ title, body, confirmLabel = "Delete", danger = true, onConfirm, onClose, busy }) {
  return (
    <Modal title={title} onClose={onClose}>
      <p style={{ margin: "0 0 16px", color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: 1.55 }}>
        {body}
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 14, borderTop: "1px dashed var(--border-light)" }}>
        <button className="btn btn-outline" onClick={onClose} disabled={busy}>
          Cancel
        </button>
        <button className={`btn ${danger ? "btn-danger" : "btn-primary"}`} onClick={onConfirm} disabled={busy}>
          {busy ? <Spinner small /> : <>
            <Trash2 size={13} strokeWidth={2.5} /> {confirmLabel}
          </>}
        </button>
      </div>
    </Modal>
  );
}

/* ================================================================ */
export default function Profile() {
  const [tab, setTab] = useState("about");
  const { data: profile, loading, error } = useFetch(() => api.get("/profile/"), [tab]);

  const readiness = useMemo(() => {
    if (!profile) return 0;
    let score = 0;
    let total = 0;
    const check = (ok, w = 1) => {
      total += w;
      if (ok) score += w;
    };
    check(!!profile.full_name, 2);
    check(!!profile.county, 1);
    check(!!profile.bio, 1);
    check((profile.skills || []).length > 0, 2);
    check((profile.education || []).length > 0, 1);
    check((profile.preferred_careers || []).length > 0, 1);
    check((profile.preferred_locations || []).length > 0, 1);
    check((profile.documents || []).length > 0, 1);
    return total ? Math.round((score / total) * 100) : 0;
  }, [profile]);

  const displayName =
    profile?.full_name || profile?.first_name || "Your profile";

  return (
    <div className="page">
      {/* Hero */}
      <section className="tpf-hero">
        <div className="tpf-hero-inner">
          <div className="tpf-hero-identity">
            <div className="tpf-hero-avatar">{initialsFor(displayName)}</div>
            <div className="tpf-hero-text">
              <h1>{displayName}</h1>
              <p>
                <MapPin size={13} strokeWidth={2.5} />
                {profile?.county || "County not set"}
                {profile?.city ? ` · ${profile.city}` : ""}
                {profile?.is_under_18 && (
                  <>
                    <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.5)" }} />
                    <ShieldAlert size={13} strokeWidth={2.5} />
                    Under 18
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="tpf-hero-progress">
            <div className="tpf-hero-progress-label">Profile completeness</div>
            <div className="tpf-hero-progress-value">{readiness}%</div>
            <div className="tpf-hero-progress-bar">
              <div className="tpf-hero-progress-fill" style={{ width: `${readiness}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <nav className="tpf-tabs">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              className={`tpf-tab${tab === t.key ? " active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              <Icon size={14} strokeWidth={2.25} />
              {t.label}
            </button>
          );
        })}
      </nav>

      {loading && <PageLoader />}
      {error && <Alert>Could not load your profile.</Alert>}

      {profile && tab === "about" && <AboutTab profile={profile} />}
      {profile && tab === "skills" && <SkillsTab />}
      {profile && tab === "education" && <EducationTab />}
      {profile && tab === "experience" && <ExperienceTab />}
      {profile && tab === "certifications" && <CertificationsTab />}
      {profile && tab === "documents" && <DocumentsTab />}
      {profile && tab === "privacy" && <PrivacyTab profile={profile} />}
    </div>
  );
}

/* ================================================================
   About
   ================================================================ */
function AboutTab({ profile }) {
  const toast = useToast();
  const [form, setForm] = useState({
    full_name: profile.full_name || "",
    gender: profile.gender || "",
    date_of_birth: profile.date_of_birth || "",
    national_id: profile.national_id || "",
    county: profile.county || "",
    city: profile.city || "",
    bio: profile.bio || "",
    preferred_careers: profile.preferred_careers || [],
    preferred_industries: profile.preferred_industries || [],
    preferred_locations: profile.preferred_locations || [],
    preferred_opportunity_types: profile.preferred_opportunity_types || [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.patch("/profile/", {
        ...form,
        date_of_birth: form.date_of_birth || null,
      });
      toast.success("Profile updated!");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const toggleIn = (key, value) =>
    setForm((f) => ({
      ...f,
      [key]: (f[key] || []).includes(value)
        ? f[key].filter((v) => v !== value)
        : [...(f[key] || []), value],
    }));

  return (
    <form onSubmit={save}>
      {profile.is_under_18 && (
        <div className="tpf-consent">
          <ShieldAlert size={16} strokeWidth={2.25} />
          <span>
            You are under 18 — guardian consent is required before applying.
            Update it from the Privacy tab.
          </span>
        </div>
      )}

      <section className="tpf-card">
        <div className="tpf-card-head">
          <div className="tpf-card-head-left">
            <div className="tpf-card-head-icon">
              <UserIcon size={17} strokeWidth={2.25} />
            </div>
            <h3>Personal details</h3>
          </div>
        </div>

        {error && (
          <div style={{ background: "var(--danger-bg)", color: "var(--danger)", padding: "10px 14px", borderRadius: 10, fontSize: "0.85rem", marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div className="tpf-grid">
          <label className="tpf-field">
            <span className="tpf-field-label">Full name</span>
            <input className="input" value={form.full_name} onChange={set("full_name")} />
          </label>
          <label className="tpf-field">
            <span className="tpf-field-label">Gender</span>
            <select className="input" value={form.gender} onChange={set("gender")}>
              <option value="">Select…</option>
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </label>
          <label className="tpf-field">
            <span className="tpf-field-label">Date of birth</span>
            <input className="input" type="date" value={form.date_of_birth} onChange={set("date_of_birth")} />
          </label>
          <label className="tpf-field">
            <span className="tpf-field-label">National ID / Passport</span>
            <input className="input" value={form.national_id} onChange={set("national_id")} placeholder="ID number" />
          </label>
          <label className="tpf-field">
            <span className="tpf-field-label">County</span>
            <select className="input" value={form.county} onChange={set("county")}>
              <option value="">Select…</option>
              {KENYA_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="tpf-field">
            <span className="tpf-field-label">City / Town</span>
            <input className="input" value={form.city} onChange={set("city")} placeholder="e.g. Westlands" />
          </label>
        </div>

        <label className="tpf-field" style={{ marginTop: 14 }}>
          <span className="tpf-field-label">About you</span>
          <textarea
            className="input"
            rows={4}
            value={form.bio}
            onChange={set("bio")}
            placeholder="Tell employers about yourself, your goals and what you love doing…"
          />
        </label>
      </section>

      <section className="tpf-card">
        <div className="tpf-card-head">
          <div className="tpf-card-head-left">
            <div className="tpf-card-head-icon">
              <Target size={17} strokeWidth={2.25} />
            </div>
            <h3>Career preferences</h3>
          </div>
        </div>

        <label className="tpf-field">
          <span className="tpf-field-label">Preferred careers</span>
          <input
            className="input"
            value={(form.preferred_careers || []).join(", ")}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                preferred_careers: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              }))
            }
            placeholder="e.g. Software Development, Data Science"
          />
          <span className="tpf-field-hint">Comma-separated. Press enter to separate.</span>
        </label>

        <div className="tpf-field">
          <span className="tpf-field-label">Preferred industries</span>
          <div className="tpf-chips">
            {INDUSTRY_SECTORS.map((s) => {
              const on = (form.preferred_industries || []).includes(s);
              return (
                <button
                  type="button"
                  key={s}
                  className={`tpf-chip${on ? " is-on" : ""}`}
                  onClick={() => toggleIn("preferred_industries", s)}
                >
                  {on && <CheckCircle2 size={11} strokeWidth={3} />}
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        <div className="tpf-field">
          <span className="tpf-field-label">Preferred locations</span>
          <select
            className="input"
            multiple
            size={5}
            value={form.preferred_locations || []}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                preferred_locations: [...e.target.selectedOptions].map((o) => o.value),
              }))
            }
          >
            {KENYA_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <span className="tpf-field-hint">Hold Ctrl (Cmd) to select multiple counties.</span>
        </div>

        <div className="tpf-field">
          <span className="tpf-field-label">Preferred opportunity types</span>
          <div className="tpf-chips">
            {OPPORTUNITY_TYPES.map(([v, l]) => {
              const on = (form.preferred_opportunity_types || []).includes(v);
              return (
                <button
                  type="button"
                  key={v}
                  className={`tpf-chip${on ? " is-on" : ""}`}
                  onClick={() => toggleIn("preferred_opportunity_types", v)}
                >
                  {on && <CheckCircle2 size={11} strokeWidth={3} />}
                  {l}
                </button>
              );
            })}
          </div>
        </div>

        <div className="tpf-actions">
          <button className="btn btn-primary" disabled={saving}>
            {saving ? <Spinner small /> : <>
              <Save size={14} strokeWidth={2.5} /> Save profile
            </>}
          </button>
        </div>
      </section>
    </form>
  );
}

/* ================================================================
   Skills
   ================================================================ */
function SkillsTab() {
  const toast = useToast();
  const { data: mySkills } = useFetch(() => api.get("/profile/skills/"));
  const { data: catalog } = useFetch(() => api.get("/skills/"));
  const [skillId, setSkillId] = useState("");
  const [proficiency, setProficiency] = useState(3);
  const [years, setYears] = useState(0);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const add = async (e) => {
    e.preventDefault();
    if (!skillId) return;
    setSaving(true);
    try {
      await api.post("/profile/skills/", {
        skill: Number(skillId),
        proficiency,
        years_of_experience: years,
      });
      toast.success("Skill added!");
      setSkillId("");
      window.location.reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/profile/skills/${id}/`);
      toast.success("Skill removed.");
      setConfirmDelete(null);
      window.location.reload();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const skills = mySkills?.results || mySkills || [];

  return (
    <div>
      <section className="tpf-card">
        <div className="tpf-card-head">
          <div className="tpf-card-head-left">
            <div className="tpf-card-head-icon">
              <Plus size={17} strokeWidth={2.25} />
            </div>
            <h3>Add a skill</h3>
          </div>
        </div>

        <form onSubmit={add}>
          <div className="tpf-grid">
            <label className="tpf-field" style={{ gridColumn: "span 2" }}>
              <span className="tpf-field-label">
                Skill <span className="req">*</span>
              </span>
              <select className="input" value={skillId} onChange={(e) => setSkillId(e.target.value)}>
                <option value="">Select a skill…</option>
                {(catalog?.results || catalog || []).map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </label>
            <label className="tpf-field">
              <span className="tpf-field-label">Proficiency</span>
              <select className="input" value={proficiency} onChange={(e) => setProficiency(Number(e.target.value))}>
                {[1, 2, 3, 4, 5].map((p) => (
                  <option key={p} value={p}>
                    {p} — {["Beginner", "Basic", "Intermediate", "Advanced", "Expert"][p - 1]}
                  </option>
                ))}
              </select>
            </label>
            <label className="tpf-field">
              <span className="tpf-field-label">Years of experience</span>
              <input className="input" type="number" min={0} value={years} onChange={(e) => setYears(Number(e.target.value))} />
            </label>
          </div>
          <div className="tpf-actions">
            <button className="btn btn-primary" disabled={saving || !skillId}>
              {saving ? <Spinner small /> : <>
                <Plus size={14} strokeWidth={2.5} /> Add skill
              </>}
            </button>
          </div>
        </form>
      </section>

      <section className="tpf-card">
        <div className="tpf-card-head">
          <div className="tpf-card-head-left">
            <div className="tpf-card-head-icon">
              <Sparkles size={17} strokeWidth={2.25} />
            </div>
            <h3>My skills</h3>
          </div>
        </div>

        {skills.length === 0 ? (
          <p className="tpf-empty-inline">No skills yet — add some to improve your matches.</p>
        ) : (
          <div className="tpf-skill-list">
            {skills.map((s) => (
              <div key={s.id} className="tpf-skill-item">
                <div className="tpf-skill-body">
                  <div className="tpf-skill-name">{s.name}</div>
                  <div className="tpf-skill-meta">
                    {s.category ? `${s.category} · ` : ""}
                    {s.years_of_experience} yrs experience
                  </div>
                </div>
                <div className="tpf-dots" title={`Proficiency ${s.proficiency}/5`}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className={`tpf-dot${i <= s.proficiency ? " is-on" : ""}`} />
                  ))}
                </div>
                <button
                  className="tpf-icon-btn is-danger"
                  onClick={() => setConfirmDelete(s)}
                  title="Remove skill"
                >
                  <Trash2 size={14} strokeWidth={2.25} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {confirmDelete && (
        <ConfirmModal
          title={`Remove “${confirmDelete.name}”?`}
          body="This skill will be removed from your profile and won't count toward matches."
          confirmLabel="Remove skill"
          onConfirm={() => remove(confirmDelete.id)}
          onClose={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

/* ================================================================
   Education
   ================================================================ */
function EducationTab() {
  const toast = useToast();
  const { data } = useFetch(() => api.get("/profile/education/"));
  const [form, setForm] = useState({
    institution: "",
    level: "Diploma",
    qualification: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const items = data?.results || data || [];

  const add = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/profile/education/", {
        ...form,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      });
      toast.success("Education added!");
      window.location.reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/profile/education/${id}/`);
      toast.success("Entry removed.");
      setConfirmDelete(null);
      window.location.reload();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <div>
      <section className="tpf-card">
        <div className="tpf-card-head">
          <div className="tpf-card-head-left">
            <div className="tpf-card-head-icon">
              <Plus size={17} strokeWidth={2.25} />
            </div>
            <h3>Add education</h3>
          </div>
        </div>

        <form onSubmit={add}>
          <div className="tpf-grid">
            <label className="tpf-field">
              <span className="tpf-field-label">
                Institution <span className="req">*</span>
              </span>
              <input
                className="input"
                value={form.institution}
                onChange={(e) => setForm((f) => ({ ...f, institution: e.target.value }))}
                placeholder="e.g. University of Nairobi"
                required
              />
            </label>
            <label className="tpf-field">
              <span className="tpf-field-label">Level</span>
              <select className="input" value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}>
                {EDUCATION_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </label>
            <label className="tpf-field">
              <span className="tpf-field-label">Field of study</span>
              <input
                className="input"
                value={form.field_of_study}
                onChange={(e) => setForm((f) => ({ ...f, field_of_study: e.target.value }))}
                placeholder="e.g. Computer Science"
              />
            </label>
            <label className="tpf-field">
              <span className="tpf-field-label">Qualification</span>
              <input
                className="input"
                value={form.qualification}
                onChange={(e) => setForm((f) => ({ ...f, qualification: e.target.value }))}
                placeholder="e.g. BSc. (Hons)"
              />
            </label>
            <label className="tpf-field">
              <span className="tpf-field-label">Start date</span>
              <input className="input" type="date" value={form.start_date} onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))} />
            </label>
            <label className="tpf-field">
              <span className="tpf-field-label">End date</span>
              <input className="input" type="date" value={form.end_date} onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))} />
            </label>
          </div>
          <div className="tpf-actions">
            <button className="btn btn-primary" disabled={saving}>
              {saving ? <Spinner small /> : <>
                <Plus size={14} strokeWidth={2.5} /> Add education
              </>}
            </button>
          </div>
        </form>
      </section>

      <section className="tpf-card">
        <div className="tpf-card-head">
          <div className="tpf-card-head-left">
            <div className="tpf-card-head-icon">
              <GraduationCap size={17} strokeWidth={2.25} />
            </div>
            <h3>Education history</h3>
          </div>
        </div>

        {items.length === 0 ? (
          <p className="tpf-empty-inline">No education entries yet.</p>
        ) : (
          <div className="tpf-list">
            {items.map((e) => (
              <div key={e.id} className="tpf-list-item">
                <div className="tpf-item-icon">
                  <GraduationCap size={15} strokeWidth={2.25} />
                </div>
                <div className="tpf-item-body">
                  <div className="tpf-item-title">{e.institution}</div>
                  <div className="tpf-item-sub">
                    {e.level}
                    {e.field_of_study ? ` — ${e.field_of_study}` : ""}
                    {e.start_date && e.end_date
                      ? ` · ${fmtYear(e.start_date)} → ${fmtYear(e.end_date)}`
                      : ""}
                  </div>
                </div>
                <div className="tpf-item-actions">
                  <button
                    className="tpf-icon-btn is-danger"
                    onClick={() => setConfirmDelete(e)}
                    title="Remove entry"
                  >
                    <Trash2 size={14} strokeWidth={2.25} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {confirmDelete && (
        <ConfirmModal
          title="Remove education entry?"
          body={`“${confirmDelete.institution}” will be removed from your profile.`}
          confirmLabel="Remove entry"
          onConfirm={() => remove(confirmDelete.id)}
          onClose={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

/* ================================================================
   Experience
   ================================================================ */
function ExperienceTab() {
  const toast = useToast();
  const { data } = useFetch(() => api.get("/profile/experience/"));
  const [form, setForm] = useState({ organization: "", position: "", start_date: "", end_date: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const items = data?.results || data || [];

  const add = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/profile/experience/", {
        ...form,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      });
      toast.success("Experience added!");
      window.location.reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/profile/experience/${id}/`);
      toast.success("Entry removed.");
      setConfirmDelete(null);
      window.location.reload();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <div>
      <section className="tpf-card">
        <div className="tpf-card-head">
          <div className="tpf-card-head-left">
            <div className="tpf-card-head-icon">
              <Plus size={17} strokeWidth={2.25} />
            </div>
            <h3>Add work experience</h3>
          </div>
        </div>

        <form onSubmit={add}>
          <div className="tpf-grid">
            <label className="tpf-field">
              <span className="tpf-field-label">
                Organisation <span className="req">*</span>
              </span>
              <input
                className="input"
                value={form.organization}
                onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))}
                required
              />
            </label>
            <label className="tpf-field">
              <span className="tpf-field-label">Position</span>
              <input
                className="input"
                value={form.position}
                onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
              />
            </label>
            <label className="tpf-field">
              <span className="tpf-field-label">Start date</span>
              <input className="input" type="date" value={form.start_date} onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))} />
            </label>
            <label className="tpf-field">
              <span className="tpf-field-label">End date</span>
              <input className="input" type="date" value={form.end_date} onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))} />
            </label>
          </div>
          <label className="tpf-field" style={{ marginTop: 4 }}>
            <span className="tpf-field-label">What did you do?</span>
            <textarea
              className="input"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </label>
          <div className="tpf-actions">
            <button className="btn btn-primary" disabled={saving}>
              {saving ? <Spinner small /> : <>
                <Plus size={14} strokeWidth={2.5} /> Add experience
              </>}
            </button>
          </div>
        </form>
      </section>

      <section className="tpf-card">
        <div className="tpf-card-head">
          <div className="tpf-card-head-left">
            <div className="tpf-card-head-icon">
              <Briefcase size={17} strokeWidth={2.25} />
            </div>
            <h3>Work history</h3>
          </div>
        </div>

        {items.length === 0 ? (
          <p className="tpf-empty-inline">No work experience yet.</p>
        ) : (
          <div className="tpf-list">
            {items.map((e) => (
              <div key={e.id} className="tpf-list-item">
                <div className="tpf-item-icon">
                  <Briefcase size={15} strokeWidth={2.25} />
                </div>
                <div className="tpf-item-body">
                  <div className="tpf-item-title">{e.position || "Role"}</div>
                  <div className="tpf-item-sub">
                    {e.organization}
                    {e.start_date && e.end_date
                      ? ` · ${fmtYear(e.start_date)} → ${fmtYear(e.end_date)}`
                      : ""}
                  </div>
                </div>
                <div className="tpf-item-actions">
                  <button
                    className="tpf-icon-btn is-danger"
                    onClick={() => setConfirmDelete(e)}
                    title="Remove entry"
                  >
                    <Trash2 size={14} strokeWidth={2.25} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {confirmDelete && (
        <ConfirmModal
          title="Remove work experience?"
          body={`“${confirmDelete.position || "Role"}” at ${confirmDelete.organization} will be removed.`}
          confirmLabel="Remove entry"
          onConfirm={() => remove(confirmDelete.id)}
          onClose={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

/* ================================================================
   Certifications
   ================================================================ */
function CertificationsTab() {
  const toast = useToast();
  const { data } = useFetch(() => api.get("/profile/certifications/"));
  const [form, setForm] = useState({ title: "", issuer: "", date_obtained: "", expiry_date: "" });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const items = data?.results || data || [];

  const add = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/profile/certifications/", {
        ...form,
        date_obtained: form.date_obtained || null,
        expiry_date: form.expiry_date || null,
      });
      toast.success("Certification added!");
      window.location.reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/profile/certifications/${id}/`);
      toast.success("Certification removed.");
      setConfirmDelete(null);
      window.location.reload();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <div>
      <section className="tpf-card">
        <div className="tpf-card-head">
          <div className="tpf-card-head-left">
            <div className="tpf-card-head-icon">
              <Plus size={17} strokeWidth={2.25} />
            </div>
            <h3>Add certification</h3>
          </div>
        </div>

        <form onSubmit={add}>
          <div className="tpf-grid">
            <label className="tpf-field">
              <span className="tpf-field-label">
                Title <span className="req">*</span>
              </span>
              <input
                className="input"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Cisco CCNA"
                required
              />
            </label>
            <label className="tpf-field">
              <span className="tpf-field-label">Issuer</span>
              <input
                className="input"
                value={form.issuer}
                onChange={(e) => setForm((f) => ({ ...f, issuer: e.target.value }))}
                placeholder="e.g. Cisco Systems"
              />
            </label>
            <label className="tpf-field">
              <span className="tpf-field-label">Date obtained</span>
              <input className="input" type="date" value={form.date_obtained} onChange={(e) => setForm((f) => ({ ...f, date_obtained: e.target.value }))} />
            </label>
            <label className="tpf-field">
              <span className="tpf-field-label">Expiry date</span>
              <input className="input" type="date" value={form.expiry_date} onChange={(e) => setForm((f) => ({ ...f, expiry_date: e.target.value }))} />
            </label>
          </div>
          <div className="tpf-actions">
            <button className="btn btn-primary" disabled={saving}>
              {saving ? <Spinner small /> : <>
                <Plus size={14} strokeWidth={2.5} /> Add certification
              </>}
            </button>
          </div>
        </form>
      </section>

      <section className="tpf-card">
        <div className="tpf-card-head">
          <div className="tpf-card-head-left">
            <div className="tpf-card-head-icon">
              <Award size={17} strokeWidth={2.25} />
            </div>
            <h3>My certifications</h3>
          </div>
        </div>

        {items.length === 0 ? (
          <p className="tpf-empty-inline">No certifications yet.</p>
        ) : (
          <div className="tpf-list">
            {items.map((c) => (
              <div key={c.id} className="tpf-list-item">
                <div className="tpf-item-icon">
                  <Award size={15} strokeWidth={2.25} />
                </div>
                <div className="tpf-item-body">
                  <div className="tpf-item-title">{c.title}</div>
                  <div className="tpf-item-sub">
                    {c.issuer}
                    {c.date_obtained ? ` · ${fmtYear(c.date_obtained)}` : ""}
                  </div>
                </div>
                <div className="tpf-item-actions">
                  <button
                    className="tpf-icon-btn is-danger"
                    onClick={() => setConfirmDelete(c)}
                    title="Remove certification"
                  >
                    <Trash2 size={14} strokeWidth={2.25} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {confirmDelete && (
        <ConfirmModal
          title="Remove certification?"
          body={`“${confirmDelete.title}” will be removed from your profile.`}
          confirmLabel="Remove certification"
          onConfirm={() => remove(confirmDelete.id)}
          onClose={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

/* ================================================================
   Documents
   ================================================================ */
function DocumentsTab() {
  const toast = useToast();
  const { data } = useFetch(() => api.get("/profile/documents/"));
  const [docType, setDocType] = useState("CV");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const docs = data?.results || data || [];

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return;
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024)
      return toast.error(`File must be under ${MAX_UPLOAD_MB} MB.`);
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("doc_type", docType);
    fd.append("title", title || file.name);
    try {
      await api.post("/profile/documents/", fd);
      toast.success("Document uploaded!");
      window.location.reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/profile/documents/${id}/`);
      toast.success("Document removed.");
      setConfirmDelete(null);
      window.location.reload();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <div>
      <section className="tpf-card">
        <div className="tpf-card-head">
          <div className="tpf-card-head-left">
            <div className="tpf-card-head-icon">
              <UploadCloud size={17} strokeWidth={2.25} />
            </div>
            <h3>Upload a document</h3>
          </div>
        </div>

        <p className="tpf-field-hint" style={{ marginBottom: 14 }}>
          Accepted: PDF, DOC, DOCX, images. Maximum {MAX_UPLOAD_MB} MB.
        </p>

        <form onSubmit={upload}>
          <div className="tpf-grid">
            <label className="tpf-field">
              <span className="tpf-field-label">Document type</span>
              <select className="input" value={docType} onChange={(e) => setDocType(e.target.value)}>
                {USER_DOCUMENT_TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>
            <label className="tpf-field">
              <span className="tpf-field-label">Title</span>
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. My CV 2026" />
            </label>
          </div>

          <div className="tpf-field">
            <span className="tpf-field-label">File</span>
            <label className="tpf-file-zone">
              <div className="tpf-file-zone-icon">
                <UploadCloud size={16} strokeWidth={2.25} />
              </div>
              <div className="tpf-file-zone-text">
                <strong>{file ? file.name : "Click to choose a file"}</strong>
                <div className="tpf-field-hint">PDF, DOC, DOCX, or image · max {MAX_UPLOAD_MB} MB</div>
              </div>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
            </label>
          </div>

          <div className="tpf-actions">
            <button className="btn btn-primary" disabled={uploading || !file}>
              {uploading ? <Spinner small /> : <>
                <UploadCloud size={14} strokeWidth={2.5} /> Upload
              </>}
            </button>
          </div>
        </form>
      </section>

      <section className="tpf-card">
        <div className="tpf-card-head">
          <div className="tpf-card-head-left">
            <div className="tpf-card-head-icon">
              <FileText size={17} strokeWidth={2.25} />
            </div>
            <h3>My documents</h3>
          </div>
        </div>

        {docs.length === 0 ? (
          <p className="tpf-empty-inline">No documents uploaded yet.</p>
        ) : (
          <div className="tpf-list">
            {docs.map((d) => (
              <div key={d.id} className="tpf-list-item">
                <div className="tpf-item-icon">
                  <FileText size={15} strokeWidth={2.25} />
                </div>
                <div className="tpf-item-body">
                  <div className="tpf-item-title">{d.title || d.doc_type}</div>
                  <div className="tpf-item-sub">
                    {USER_DOCUMENT_TYPES.find(([v]) => v === d.doc_type)?.[1] || d.doc_type}
                    {d.size_bytes ? ` · ${(d.size_bytes / 1024).toFixed(0)} KB` : ""}
                  </div>
                </div>
                <div className="tpf-item-actions">
                  <button
                    className="tpf-icon-btn"
                    onClick={() => downloadFile(d.id, d.title || "document").catch((err) => toast.error(errorMessage(err)))}
                    title="Download"
                  >
                    <Download size={14} strokeWidth={2.25} />
                  </button>
                  <button
                    className="tpf-icon-btn is-danger"
                    onClick={() => setConfirmDelete(d)}
                    title="Remove document"
                  >
                    <Trash2 size={14} strokeWidth={2.25} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {confirmDelete && (
        <ConfirmModal
          title="Remove document?"
          body={`“${confirmDelete.title || confirmDelete.doc_type}” will be deleted from your profile.`}
          confirmLabel="Remove document"
          onConfirm={() => remove(confirmDelete.id)}
          onClose={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

/* ================================================================
   Privacy
   ================================================================ */
function PrivacyTab({ profile }) {
  const toast = useToast();
  const { data: prefs, loading } = useFetch(() => api.get("/notifications/preferences/"));
  const [saving, setSaving] = useState(false);
  const [privacy, setPrivacy] = useState({
    county: profile.county || "",
    city: profile.city || "",
    guardian_consent: profile.guardian_consent || false,
  });

  const savePrivacy = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/profile/privacy/", privacy);
      toast.success("Privacy settings saved.");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const toggleChannel = async (pref, channel) => {
    try {
      await api.patch(`/notifications/preferences/${pref.id}/`, { [channel]: !pref[channel] });
      toast.success("Preference updated.");
      window.location.reload();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const CHANNELS = [
    ["in_app", "In-app", Bell],
    ["email", "Email", FileText],
    ["sms", "SMS", Building2],
    ["whatsapp", "WhatsApp", Users],
  ];

  const prefsList = prefs?.results || prefs || [];

  return (
    <div>
      <section className="tpf-card">
        <div className="tpf-card-head">
          <div className="tpf-card-head-left">
            <div className="tpf-card-head-icon">
              <MapPin size={17} strokeWidth={2.25} />
            </div>
            <h3>Location privacy</h3>
          </div>
        </div>

        <p className="tpf-field-hint" style={{ marginBottom: 14 }}>
          Your county and city are used for matching and are visible to employers on your applications.
        </p>

        <form onSubmit={savePrivacy}>
          <div className="tpf-grid">
            <label className="tpf-field">
              <span className="tpf-field-label">County</span>
              <select className="input" value={privacy.county} onChange={(e) => setPrivacy((p) => ({ ...p, county: e.target.value }))}>
                <option value="">Not set</option>
                {KENYA_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="tpf-field">
              <span className="tpf-field-label">City / Town</span>
              <input className="input" value={privacy.city} onChange={(e) => setPrivacy((p) => ({ ...p, city: e.target.value }))} />
            </label>
          </div>

          {profile.is_under_18 && (
            <label className="tpf-field" style={{ flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 12, background: "#fbf9fe", borderRadius: 12, border: "1.5px dashed var(--border-light)", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={privacy.guardian_consent}
                onChange={(e) => setPrivacy((p) => ({ ...p, guardian_consent: e.target.checked }))}
                style={{ width: 16, height: 16, marginTop: 2, accentColor: "var(--accent-dark)" }}
              />
              <span style={{ fontSize: "0.84rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                I confirm a parent/guardian has consented to my participation on this platform.
              </span>
            </label>
          )}

          <div className="tpf-actions">
            <button className="btn btn-primary" disabled={saving}>
              {saving ? <Spinner small /> : <>
                <Save size={14} strokeWidth={2.5} /> Save privacy settings
              </>}
            </button>
          </div>
        </form>
      </section>

      <section className="tpf-card">
        <div className="tpf-card-head">
          <div className="tpf-card-head-left">
            <div className="tpf-card-head-icon">
              <Bell size={17} strokeWidth={2.25} />
            </div>
            <h3>Notification channels</h3>
          </div>
        </div>

        <p className="tpf-field-hint" style={{ marginBottom: 14 }}>
          Choose how Ujuzi Link contacts you for each kind of update.
        </p>

        {loading && <PageLoader />}
        {!loading && prefsList.length === 0 && (
          <p className="tpf-empty-inline">No preferences available yet.</p>
        )}
        {!loading && prefsList.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table className="tpf-channel-matrix">
              <thead>
                <tr>
                  <th>Notification</th>
                  {CHANNELS.map(([key, label]) => (
                    <th key={key}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {prefsList.map((pref) => (
                  <tr key={pref.id}>
                    <td>
                      <span className="tpf-channel-name">
                        {String(pref.notification_type).replace(/_/g, " ")}
                      </span>
                    </td>
                    {CHANNELS.map(([key]) => (
                      <td key={key} style={{ textAlign: "center" }}>
                        <button
                          className={`tpf-channel-toggle${pref[key] ? " is-on" : ""}`}
                          onClick={() => toggleChannel(pref, key)}
                          aria-label={`Toggle ${key}`}
                        >
                          {pref[key] ? "On" : "Off"}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tiny helpers                                                       */
/* ------------------------------------------------------------------ */
function fmtYear(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).getFullYear();
  } catch {
    return dateStr;
  }
}