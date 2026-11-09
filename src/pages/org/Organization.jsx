import { useState } from "react";
import {
  MapPin,
  Globe,
  BadgeCheck,
  Plus,
  Download,
  Trash2,
  FileText,
  UploadCloud,
  Users,
  UserPlus,
  Lock,
  Building2,
  Mail,
  Phone,
  MapPinned,
  Pencil,
  Check,
  CircleUser,
} from "lucide-react";
import { api, errorMessage } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { Alert, Modal, PageLoader, Spinner, StatusBadge, useAsyncAction, useFetch } from "../../components/ui";
import {
  INDUSTRY_SECTORS,
  KENYA_COUNTIES,
  labelFor,
  ORGANIZATION_TYPES,
  ORG_DOCUMENT_TYPES,
} from "../../lib/constants";
import "./Organization.css";

export default function Organization() {
  const [tab, setTab] = useState("details");
  const { data: org, loading, error } = useFetch(() => api.get("/organizations/me/"));
  const toast = useToast();

  if (loading) return <PageLoader />;
  if (error || !org) return <Alert>Could not load organisation profile.</Alert>;

  const tabs = [
    { key: "details", label: "Organisation Details" },
    { key: "documents", label: "Verification Documents" },
    { key: "members", label: `Team (${(org.members || []).length})` },
  ];

  return (
    <div className="page">
      <header className="org-header">
        <div className="org-header-main">
          <h2>{org.name}</h2>
          <div className="org-meta">
            <span className="org-meta-item">
              <Building2 size={14} strokeWidth={2.25} />
              {labelFor(ORGANIZATION_TYPES, org.org_type)}
            </span>
            <span className="org-meta-sep" />
            <span className="org-meta-item">
              <MapPin size={14} strokeWidth={2.25} />
              {org.county || "County not set"}
            </span>
            {org.verified && (
              <span className="org-verified">
                <BadgeCheck size={13} strokeWidth={2.5} /> Verified
              </span>
            )}
          </div>
        </div>
        <StatusBadge status={org.status} />
      </header>

      <nav className="org-tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`org-tab${tab === t.key ? " active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "details" && <DetailsTab org={org} toast={toast} />}
      {tab === "documents" && <DocumentsTab org={org} toast={toast} />}
      {tab === "members" && <MembersTab org={org} toast={toast} />}
    </div>
  );
}

/* ============================================================
   Details
   ============================================================ */
function DetailsTab({ org, toast }) {
  const [form, setForm] = useState({
    county: org.county || "",
    physical_address: org.physical_address || "",
    postal_address: org.postal_address || "",
    email: org.email || "",
    phone: org.phone || "",
    website: org.website || "",
    description: org.description || "",
  });
  const [sectors, setSectors] = useState(org.sectors || []);
  const { loading, run } = useAsyncAction();
  const isOfficer = org.my_role === "OFFICER";

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const toggleSector = (sector) =>
    setSectors(sectors.includes(sector) ? sectors.filter((s) => s !== sector) : [...sectors, sector]);

  const save = () =>
    run(() => api.patch("/organizations/me/", { ...form, sectors }), {
      onSuccess: () => toast.success("Organisation details updated."),
      onError: (err) => toast.error(errorMessage(err)),
    });

  /* ----- Supervisor / read-only view ----- */
  if (!isOfficer) {
    return (
      <div className="org-card">
        <div className="org-card-head">
          <h4>
            <Building2 size={18} strokeWidth={2.25} />
            About {org.name}
          </h4>
        </div>
        <p className="org-overview-desc">{org.description || "No description provided."}</p>
        <div className="org-overview-meta">
          <div className="org-overview-row">
            <MapPinned size={15} strokeWidth={2.25} />
            <span>{org.physical_address || org.county || "Location not set"}</span>
          </div>
          {org.website && (
            <div className="org-overview-row">
              <Globe size={15} strokeWidth={2.25} />
              <span>{org.website}</span>
            </div>
          )}
          {org.email && (
            <div className="org-overview-row">
              <Mail size={15} strokeWidth={2.25} />
              <span>{org.email}</span>
            </div>
          )}
          {org.phone && (
            <div className="org-overview-row">
              <Phone size={15} strokeWidth={2.25} />
              <span>{org.phone}</span>
            </div>
          )}
        </div>
        <div className="org-readonly-note">
          <Lock size={14} strokeWidth={2.5} />
          Only recruitment officers can edit organisation details.
        </div>
      </div>
    );
  }

  /* ----- Officer / editable view ----- */
  return (
    <div className="org-card">
      <div className="org-card-head">
        <div>
          <h4>
            <Pencil size={17} strokeWidth={2.25} />
            Edit details
          </h4>
          <p className="org-card-sub">
            Verified organisations cannot change their name, registration number or type.
          </p>
        </div>
      </div>

      <div className="org-form-grid">
        <label className="org-field">
          <span className="org-field-label">County</span>
          <select className="input" value={form.county} onChange={set("county")}>
            <option value="">Select county</option>
            {KENYA_COUNTIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="org-field">
          <span className="org-field-label">Physical address</span>
          <input
            className="input"
            value={form.physical_address}
            onChange={set("physical_address")}
            placeholder="Building, street"
          />
        </label>
        <label className="org-field">
          <span className="org-field-label">Postal address</span>
          <input
            className="input"
            value={form.postal_address}
            onChange={set("postal_address")}
            placeholder="P.O. Box"
          />
        </label>
        <label className="org-field">
          <span className="org-field-label">Organisation email</span>
          <input className="input" type="email" value={form.email} onChange={set("email")} />
        </label>
        <label className="org-field">
          <span className="org-field-label">Phone</span>
          <input className="input" value={form.phone} onChange={set("phone")} />
        </label>
        <label className="org-field">
          <span className="org-field-label">Website</span>
          <input
            className="input"
            value={form.website}
            onChange={set("website")}
            placeholder="https://"
          />
        </label>
        <label className="org-field org-field-full">
          <span className="org-field-label">Description</span>
          <textarea
            className="input"
            rows={3}
            value={form.description}
            onChange={set("description")}
            placeholder="What does your organisation do?"
          />
        </label>
        <div className="org-field org-field-full">
          <span className="org-field-label">Industry sectors</span>
          <div className="org-chips">
            {INDUSTRY_SECTORS.map((sector) => {
              const on = sectors.includes(sector);
              return (
                <button
                  key={sector}
                  type="button"
                  className={`org-chip${on ? " is-on" : ""}`}
                  onClick={() => toggleSector(sector)}
                >
                  {on && <Check size={13} strokeWidth={3} />}
                  {sector}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="org-save-bar">
        <button className="btn btn-primary" onClick={save} disabled={loading}>
          {loading ? <Spinner small /> : "Save changes"}
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   Documents
   ============================================================ */
function DocumentsTab({ org, toast }) {
  const [tick, setTick] = useState(0);
  const { data, loading } = useFetch(() => api.get("/organizations/me/documents/"), [tick]);
  const [showAdd, setShowAdd] = useState(false);
  const [docType, setDocType] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const { loading: saving, run } = useAsyncAction();
  const isOfficer = org.my_role === "OFFICER";

  const upload = () => {
    if (!file) return toast.error("Choose a file to upload.");
    const body = new FormData();
    body.append("doc_type", docType || "OTHER");
    body.append("title", title || file.name);
    body.append("file", file);
    run(() => api.post("/organizations/me/documents/", body), {
      onSuccess: () => {
        toast.success("Document uploaded.");
        setShowAdd(false);
        setDocType("");
        setTitle("");
        setFile(null);
        setTick((t) => t + 1);
      },
      onError: (err) => toast.error(errorMessage(err)),
    });
  };

  const remove = (doc) =>
    run(() => api.delete(`/organizations/me/documents/${doc.id}/`), {
      onSuccess: () => {
        toast.success("Document removed.");
        setTick((t) => t + 1);
      },
      onError: (err) => toast.error(errorMessage(err)),
    });

  const docs = data?.results || [];

  return (
    <div className="org-card">
      <div className="org-card-head">
        <h4>
          <FileText size={18} strokeWidth={2.25} />
          Verification documents
        </h4>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
          <UploadCloud size={14} strokeWidth={2.5} /> Upload
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : docs.length === 0 ? (
        <div className="org-empty">
          <FileText size={38} strokeWidth={1.5} />
          <h5>No documents yet</h5>
          <p>Upload your registration certificate and other verification documents.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Type</th>
                <th>Uploaded</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {docs.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.title}</td>
                  <td>
                    <span className="badge badge-neutral">
                      {labelFor(ORG_DOCUMENT_TYPES, doc.doc_type)}
                    </span>
                  </td>
                  <td>{new Date(doc.created_at).toLocaleDateString("en-KE")}</td>
                  <td>
                    <div className="org-td-actions">
                      <a
                        className="org-icon-btn"
                        href={doc.download_url}
                        title="Download"
                        aria-label="Download document"
                      >
                        <Download size={15} strokeWidth={2.25} />
                      </a>
                      {isOfficer && (
                        <button
                          className="org-icon-btn is-danger"
                          onClick={() => remove(doc)}
                          title="Remove"
                          aria-label="Remove document"
                        >
                          <Trash2 size={15} strokeWidth={2.25} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && (
        <Modal title="Upload document" onClose={() => setShowAdd(false)}>
          <label className="org-field">
            <span className="org-field-label">Document type</span>
            <select className="input" value={docType} onChange={(e) => setDocType(e.target.value)}>
              {ORG_DOCUMENT_TYPES.map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </label>
          <label className="org-field">
            <span className="org-field-label">Title</span>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Registration Certificate 2026"
            />
          </label>
          <label className="org-field">
            <span className="org-field-label">File (PDF, images — max 10 MB)</span>
            <input type="file" className="input" onChange={(e) => setFile(e.target.files[0])} />
          </label>
          <div className="org-modal-actions">
            <button className="btn btn-outline" onClick={() => setShowAdd(false)} disabled={saving}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={upload} disabled={saving}>
              {saving ? <Spinner small /> : "Upload"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============================================================
   Members
   ============================================================ */
function MembersTab({ org, toast }) {
  const [tick, setTick] = useState(0);
  const { data, loading } = useFetch(() => api.get("/organizations/me/members/"), [tick]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ first_name: "", email: "", phone: "", role: "OFFICER" });
  const { loading: saving, run } = useAsyncAction();
  const isOfficer = org.my_role === "OFFICER";

  const add = () =>
    run(() => api.post("/organizations/me/members/", form), {
      onSuccess: () => {
        toast.success("Team member added.");
        setShowAdd(false);
        setForm({ first_name: "", email: "", phone: "", role: "OFFICER" });
        setTick((t) => t + 1);
      },
      onError: (err) => toast.error(errorMessage(err)),
    });

  const changeRole = (member, role) =>
    run(() => api.patch(`/organizations/me/members/${member.id}/`, { role }), {
      onSuccess: () => {
        toast.success("Role updated.");
        setTick((t) => t + 1);
      },
      onError: (err) => toast.error(errorMessage(err)),
    });

  const deactivate = (member) =>
    run(() => api.delete(`/organizations/me/members/${member.id}/`), {
      onSuccess: () => {
        toast.success("Member deactivated.");
        setTick((t) => t + 1);
      },
      onError: (err) => toast.error(errorMessage(err)),
    });

  const members = data?.results || [];

  return (
    <div className="org-card">
      <div className="org-card-head">
        <h4>
          <Users size={18} strokeWidth={2.25} />
          Team members
        </h4>
        {isOfficer && (
          <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
            <UserPlus size={14} strokeWidth={2.5} /> Add member
          </button>
        )}
      </div>

      {loading ? (
        <Spinner />
      ) : members.length === 0 ? (
        <div className="org-empty">
          <Users size={38} strokeWidth={1.5} />
          <h5>No team members yet</h5>
          <p>Add recruitment officers and supervisors to help manage placements.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <CircleUser size={16} strokeWidth={2} style={{ color: "var(--accent-dark)" }} />
                      {m.user_name}
                    </span>
                  </td>
                  <td className="small">{m.user_email || m.user_phone || "—"}</td>
                  <td>
                    {isOfficer && m.is_active ? (
                      <select
                        className="org-role-select"
                        value={m.role}
                        onChange={(e) => changeRole(m, e.target.value)}
                        disabled={m.user === undefined}
                      >
                        <option value="OFFICER">Officer</option>
                        <option value="SUPERVISOR">Supervisor</option>
                      </select>
                    ) : (
                      <span className="badge badge-neutral">
                        {m.role === "OFFICER" ? "Officer" : "Supervisor"}
                      </span>
                    )}
                  </td>
                  <td>
                    {m.is_active ? (
                      <span className="badge badge-green">Active</span>
                    ) : (
                      <span className="badge badge-neutral">Inactive</span>
                    )}
                  </td>
                  <td>
                    <div className="org-td-actions">
                      {isOfficer && m.is_active && (
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => deactivate(m)}
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && (
        <Modal title="Add team member" onClose={() => setShowAdd(false)}>
          <label className="org-field">
            <span className="org-field-label">Full name</span>
            <input
              className="input"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            />
          </label>
          <label className="org-field">
            <span className="org-field-label">Email</span>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label className="org-field">
            <span className="org-field-label">Phone (optional)</span>
            <input
              className="input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+2547..."
            />
          </label>
          <label className="org-field">
            <span className="org-field-label">Role</span>
            <select
              className="input"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="OFFICER">Recruitment Officer</option>
              <option value="SUPERVISOR">Supervisor</option>
            </select>
          </label>
          <p className="org-modal-note">
            A new account is created and login details emailed to the member. An existing account is
            simply linked.
          </p>
          <div className="org-modal-actions">
            <button className="btn btn-outline" onClick={() => setShowAdd(false)} disabled={saving}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={add} disabled={saving}>
              {saving ? <Spinner small /> : "Add member"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}