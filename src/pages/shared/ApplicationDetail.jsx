import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, errorMessage, downloadFile } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { EmptyState, Modal, PageLoader, Spinner, StatusBadge } from "../../components/ui";
import { COMPENSATION_TYPES, INTERVIEW_MODES, fmtDate, fmtMoney } from "../../lib/constants";

const ORG_ROLES = ["ORG_OFFICER", "ORG_SUPERVISOR"];

export default function ApplicationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [interviewOpen, setInterviewOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);

  const load = () => {
    api
      .get(`/applications/${id}/`)
      .then((res) => setApp(res.data))
      .catch((err) => { if (err?.response?.status === 404) setNotFound(true); })
      .finally(() => setLoading(false));
  };
  useEffect(load, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const isOrg = ORG_ROLES.includes(user?.role);
  const isApplicant = user?.role === "TRAINEE";

  const action = async (name) => {
    try {
      await api.post(`/applications/${id}/${name}/`);
      toast.success(`Application ${name === "withdraw" ? "withdrawn" : name} successfully.`);
      load();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  if (loading) return <div className="page"><PageLoader /></div>;
  if (notFound || !app) {
    return (
      <div className="page">
        <EmptyState icon="fa-file-lines" title="Application not found" text="You may not have access to this application." />
      </div>
    );
  }

  const offer = app.offer;
  const interviews = app.interviews || [];

  return (
    <div className="page" style={{ maxWidth: 1000 }}>
      <div className="row between wrap mb-16">
        <Link to={isOrg ? "/app/org/applications" : "/app/applications"} className="btn btn-ghost btn-sm">
          <i className="fas fa-arrow-left" /> Back to applications
        </Link>
        <div className="row wrap">
          {isApplicant && ["SUBMITTED", "UNDER_REVIEW", "SHORTLISTED"].includes(app.status) && (
            <button className="btn btn-danger-soft btn-sm" onClick={() => action("withdraw")}>
              <i className="fas fa-undo" /> Withdraw application
            </button>
          )}
          {isOrg && ["SUBMITTED", "UNDER_REVIEW", "SHORTLISTED"].includes(app.status) && (
            <>
              <button className="btn btn-outline btn-sm" onClick={() => action("review")}><i className="fas fa-eye" /> Mark under review</button>
              <button className="btn btn-primary btn-sm" onClick={() => action("shortlist")}><i className="fas fa-star" /> Shortlist</button>
              <button className="btn btn-danger-soft btn-sm" onClick={() => action("reject")}><i className="fas fa-xmark" /> Reject</button>
            </>
          )}
        </div>
      </div>

      <div className="card card-lg card-pad mb-24">
        <div className="row between wrap mb-8">
          <h1 style={{ fontSize: "1.55rem" }}>{app.opportunity?.title}</h1>
          <StatusBadge status={app.status} />
        </div>
        <p className="small muted mb-16">
          <i className="fas fa-building" style={{ marginRight: 8 }} />{app.opportunity?.organization_name}
          <span style={{ margin: "0 10px" }}>•</span>
          <i className="fas fa-briefcase" style={{ marginRight: 8 }} />{app.opportunity?.type?.replace(/_/g, " ")}
          <span style={{ margin: "0 10px" }}>•</span>
          <i className="fas fa-clock" style={{ marginRight: 8 }} />Submitted {fmtDate(app.submitted_at, true)}
        </p>

        {isOrg && (
          <div className="card card-pad mb-16" style={{ background: "var(--primary-soft)", border: "none" }}>
            <h4 className="mb-8">Applicant</h4>
            <div className="row wrap">
              <span className="badge badge-indigo"><i className="fas fa-user" /> {app.applicant_name}</span>
              {app.applicant_email && <span className="badge badge-neutral"><i className="fas fa-envelope" /> {app.applicant_email}</span>}
              {app.applicant_phone && <span className="badge badge-neutral"><i className="fas fa-phone" /> {app.applicant_phone}</span>}
            </div>
          </div>
        )}

        {app.cover_letter && (
          <>
            <h4 className="mb-8">Cover letter</h4>
            <p className="small mb-16" style={{ whiteSpace: "pre-line" }}>{app.cover_letter}</p>
          </>
        )}

        {(app.documents || []).length > 0 && (
          <>
            <h4 className="mb-8">Documents</h4>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {app.documents.map((d) => (
                <button
                  key={d.id}
                  className="chip"
                  onClick={() => {
                    const fid = (d.download_url?.match(/\/files\/(\d+)\//) || [])[1];
                    if (fid) downloadFile(fid, d.title || "document").catch((err) => toast.error(errorMessage(err)));
                  }}
                >
                  <i className="fas fa-file" /> {d.title || d.doc_type} <i className="fas fa-download" />
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="grid grid-2" style={{ alignItems: "start" }}>
        <div>
          <div className="card card-pad mb-24">
            <h4 className="mb-16"><i className="fas fa-clock-rotate-left" style={{ marginRight: 8, color: "var(--accent-dark)" }} />Status history</h4>
            <ul className="timeline">
              {(app.status_history || []).map((h, i) => (
                <li key={i}>
                  <div className="small bold"><StatusBadge status={h.new_status} /></div>
                  <div className="tiny muted mt-8">{fmtDate(h.created_at, true)} by {h.changed_by_name || "System"}</div>
                  {h.note && <div className="tiny mt-8">{h.note}</div>}
                </li>
              ))}
            </ul>
          </div>

          <div className="card card-pad mb-24">
            <div className="row between mb-16">
              <h4 style={{ margin: 0 }}><i className="fas fa-video" style={{ marginRight: 8, color: "var(--accent-dark)" }} />Interviews</h4>
              {isOrg && app.status === "SHORTLISTED" && (
                <button className="btn btn-primary btn-sm" onClick={() => setInterviewOpen(true)}><i className="fas fa-plus" /> Schedule</button>
              )}
            </div>
            {interviews.length === 0 && <p className="small muted">No interviews scheduled yet.</p>}
            {interviews.map((iv) => (
              <div key={iv.id} className="row between" style={{ borderBottom: "1px solid var(--border-light)", padding: "10px 0" }}>
                <div>
                  <div className="small bold"><i className="fas fa-calendar" style={{ marginRight: 8 }} />{fmtDate(iv.scheduled_at, true)}</div>
                  <div className="tiny muted">
                    {iv.mode_display || INTERVIEW_MODES.find(([v]) => v === iv.mode)?.[1] || iv.mode}
                    {iv.location_or_link ? ` - ${iv.location_or_link}` : ""}
                  </div>
                </div>
                <div className="row">
                  <StatusBadge status={iv.status} />
                  {isOrg && iv.status === "SCHEDULED" && (
                    <button className="btn btn-outline btn-sm" onClick={() => api.post(`/applications/${id}/interviews/${iv.id}/complete/`).then(load).catch((err) => toast.error(errorMessage(err)))}>
                      <i className="fas fa-check" /> Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <OfferCard app={app} isOrg={isOrg} isApplicant={isApplicant} onOpenOffer={() => setOfferOpen(true)} onReload={load} />
        </div>

        <div className="card card-pad">
          <h4 className="mb-16"><i className="fas fa-comments" style={{ marginRight: 8, color: "var(--accent-dark)" }} />Messages</h4>
          <Messages applicationId={id} />
        </div>
      </div>

      {interviewOpen && (
        <InterviewModal applicationId={id} onClose={() => setInterviewOpen(false)} onDone={() => { setInterviewOpen(false); load(); }} />
      )}
      {offerOpen && (
        <OfferModal applicationId={id} onClose={() => setOfferOpen(false)} onDone={() => { setOfferOpen(false); load(); }} />
      )}
    </div>
  );
}

function OfferCard({ app, isOrg, isApplicant, onOpenOffer, onReload }) {
  const toast = useToast();
  const offer = app.offer;

  const respond = async (response) => {
    try {
      await api.post(`/applications/${app.id}/offer/respond/`, { response });
      toast.success(response === "ACCEPT" ? "Offer accepted - congratulations!" : "Offer declined.");
      onReload();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <div className="card card-pad">
      <div className="row between mb-16">
        <h4 style={{ margin: 0 }}><i className="fas fa-envelope-open-text" style={{ marginRight: 8, color: "var(--accent-dark)" }} />Offer</h4>
        {isOrg && ["SHORTLISTED", "UNDER_REVIEW"].includes(app.status) && !offer && (
          <button className="btn btn-accent btn-sm" onClick={onOpenOffer}><i className="fas fa-paper-plane" /> Issue offer</button>
        )}
      </div>
      {!offer && <p className="small muted">No offer issued yet.</p>}
      {offer && (
        <>
          <div className="row wrap mb-8">
            <StatusBadge status={offer.status === "PENDING" ? "PENDING" : offer.status === "ACCEPTED" ? "OFFER_ACCEPTED" : offer.status === "DECLINED" ? "OFFER_DECLINED" : "EXPIRED"} />
            {offer.compensation && <span className="badge badge-indigo">{COMPENSATION_TYPES.find(([v]) => v === offer.compensation)?.[1] || offer.compensation}</span>}
            {offer.stipend_amount && <span className="badge badge-green">{fmtMoney(offer.stipend_amount)}</span>}
          </div>
          <table className="table">
            <tbody>
              <tr><td className="muted">Start date</td><td><b>{fmtDate(offer.start_date)}</b></td></tr>
              {offer.terms && <tr><td className="muted">Terms</td><td className="small">{offer.terms}</td></tr>}
              <tr><td className="muted">Respond by</td><td className={new Date(offer.deadline) < new Date() ? "bold" : ""} style={{ color: new Date(offer.deadline) < new Date() ? "var(--danger)" : undefined }}>{fmtDate(offer.deadline, true)}</td></tr>
            </tbody>
          </table>
          {isApplicant && offer.status === "PENDING" && (
            <div className="row mt-16">
              <button className="btn btn-success" onClick={() => respond("ACCEPT")}><i className="fas fa-check" /> Accept offer</button>
              <button className="btn btn-danger-soft" onClick={() => respond("DECLINE")}><i className="fas fa-xmark" /> Decline</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function InterviewModal({ applicationId, onClose, onDone }) {
  const toast = useToast();
  const [form, setForm] = useState({ scheduled_at: "", mode: "VIDEO", location_or_link: "", notes: "" });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post(`/applications/${applicationId}/interviews/`, { ...form, scheduled_at: new Date(form.scheduled_at).toISOString() });
      toast.success("Interview scheduled!");
      onDone();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Schedule interview" onClose={onClose}>
      <form onSubmit={submit}>
        <div className="field">
          <label>Date & time *</label>
          <input className="input" type="datetime-local" value={form.scheduled_at} onChange={(e) => setForm((f) => ({ ...f, scheduled_at: e.target.value }))} required />
        </div>
        <div className="field">
          <label>Mode</label>
          <select className="select" value={form.mode} onChange={(e) => setForm((f) => ({ ...f, mode: e.target.value }))}>
            {INTERVIEW_MODES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Location or link</label>
          <input className="input" value={form.location_or_link} onChange={(e) => setForm((f) => ({ ...f, location_or_link: e.target.value }))} placeholder="Address, phone or video link" />
        </div>
        <div className="field">
          <label>Notes for the candidate</label>
          <textarea className="textarea" style={{ minHeight: 70 }} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
        </div>
        <div className="row between">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={saving}>{saving ? <Spinner small /> : <><i className="fas fa-calendar-plus" /> Schedule</>}</button>
        </div>
      </form>
    </Modal>
  );
}

function OfferModal({ applicationId, onClose, onDone }) {
  const toast = useToast();
  const [form, setForm] = useState({ start_date: "", compensation: "STIPEND", stipend_amount: "", terms: "", deadline: "" });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post(`/applications/${applicationId}/offer/`, {
        ...form,
        stipend_amount: form.compensation === "STIPEND" ? form.stipend_amount : null,
        deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
      });
      toast.success("Offer issued!");
      onDone();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Issue placement offer" onClose={onClose}>
      <form onSubmit={submit}>
        <div className="field">
          <label>Start date *</label>
          <input className="input" type="date" value={form.start_date} onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))} required />
        </div>
        <div className="field">
          <label>Compensation</label>
          <select className="select" value={form.compensation} onChange={(e) => setForm((f) => ({ ...f, compensation: e.target.value }))}>
            {COMPENSATION_TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        {form.compensation === "STIPEND" && (
          <div className="field">
            <label>Stipend amount (KES) *</label>
            <input className="input" type="number" min="0" step="0.01" value={form.stipend_amount} onChange={(e) => setForm((f) => ({ ...f, stipend_amount: e.target.value }))} required />
          </div>
        )}
        <div className="field">
          <label>Terms</label>
          <textarea className="textarea" style={{ minHeight: 70 }} value={form.terms} onChange={(e) => setForm((f) => ({ ...f, terms: e.target.value }))} placeholder="Duration, working hours, supervision arrangements…" />
        </div>
        <div className="field">
          <label>Offer deadline (optional - defaults to 7 days)</label>
          <input className="input" type="datetime-local" value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))} />
        </div>
        <div className="row between">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-accent" disabled={saving}>{saving ? <Spinner small /> : <><i className="fas fa-paper-plane" /> Issue offer</>}</button>
        </div>
      </form>
    </Modal>
  );
}

function Messages({ applicationId }) {
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  const load = () => {
    api
      .get(`/applications/${applicationId}/messages/`)
      .then((res) => setMessages(Array.isArray(res.data) ? res.data : res.data.results || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(load, [applicationId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    try {
      await api.post(`/applications/${applicationId}/messages/`, { body });
      setBody("");
      load();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <div>
      <div style={{ maxHeight: 420, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
        {loading && <Spinner />}
        {!loading && messages.length === 0 && <p className="small muted">Start the conversation - ask about start dates, supervision or anything else.</p>}
        {messages.map((m) => (
          <div key={m.id} style={{ alignSelf: m.sender_role === "TRAINEE" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
            <div
              className="small"
              style={{
                padding: "10px 14px",
                borderRadius: 14,
                background: m.sender_role === "TRAINEE" ? "linear-gradient(135deg, var(--primary), var(--accent-dark))" : "var(--primary-soft)",
                color: m.sender_role === "TRAINEE" ? "#fff" : "var(--text-dark)",
              }}
            >
              {m.body}
            </div>
            <div className="tiny muted mt-8">{m.sender_name} • {fmtDate(m.created_at, true)}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="row mt-16">
        <input className="input" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Type a message…" />
        <button className="btn btn-primary"><i className="fas fa-paper-plane" /></button>
      </form>
    </div>
  );
}
