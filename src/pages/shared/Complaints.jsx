import { useState } from "react";
import { api, errorMessage } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { EmptyState, Modal, PageLoader, Pagination, Spinner, StatusBadge, useFetch } from "../../components/ui";
import { COMPLAINT_CATEGORIES, COMPLAINT_SUBJECTS, fmtDate, labelFor } from "../../lib/constants";

export default function Complaints() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const { data, loading } = useFetch(() => api.get(`/complaints/?page=${page}`), [page]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ category: "HARASSMENT", subject_type: "ORGANIZATION", subject_id: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/complaints/", {
        ...form,
        subject_id: form.subject_id ? Number(form.subject_id) : null,
      });
      toast.success("Concern submitted. Our safeguarding team will review it.");
      setOpen(false);
      setForm({ category: "HARASSMENT", subject_type: "ORGANIZATION", subject_id: "", description: "" });
      window.location.reload();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <div className="card card-lg card-pad mb-24" style={{ background: "linear-gradient(135deg, var(--primary-dark), var(--primary-light))", color: "#fff" }}>
        <div className="row between wrap">
          <div>
            <h1 style={{ fontSize: "1.5rem", marginBottom: 6 }}><i className="fas fa-shield-halved" style={{ marginRight: 10, color: "var(--accent-light)" }} />Safeguarding</h1>
            <p style={{ color: "#e6d9f7", maxWidth: 560 }}>
              Report harassment, fraud, exploitation or unsafe placement conditions. Every report is treated confidentially.
            </p>
          </div>
          <button className="btn btn-accent" onClick={() => setOpen(true)}><i className="fas fa-flag" /> Report a concern</button>
        </div>
      </div>

      {loading ? (
        <PageLoader />
      ) : (data?.results || []).length === 0 ? (
        <EmptyState icon="fa-shield-halved" title="No reports" text="Your submitted concerns and their status will appear here." />
      ) : (
        <>
          <div className="table-wrap card">
            <table className="table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>About</th>
                  <th>Status</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {(data?.results || []).map((c) => (
                  <tr key={c.id}>
                    <td><b>{labelFor(COMPLAINT_CATEGORIES, c.category)}</b></td>
                    <td className="small">
                      {labelFor(COMPLAINT_SUBJECTS, c.subject_type)}
                      {c.subject_id ? ` #${c.subject_id}` : ""}
                    </td>
                    <td><StatusBadge status={c.status} /></td>
                    <td className="small muted">{fmtDate(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} count={data?.count || 0} onPage={setPage} />
        </>
      )}

      {open && (
        <Modal title="Report a concern" onClose={() => setOpen(false)}>
          {error && <div className="form-error">{error}</div>}
          <form onSubmit={submit}>
            <div className="field">
              <label>Category</label>
              <select className="select" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {COMPLAINT_CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="grid grid-2" style={{ gap: 0 }}>
              <div className="field" style={{ paddingRight: 10 }}>
                <label>This concern is about</label>
                <select className="select" value={form.subject_type} onChange={(e) => setForm((f) => ({ ...f, subject_type: e.target.value }))}>
                  {COMPLAINT_SUBJECTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div className="field" style={{ paddingLeft: 10 }}>
                <label>Subject ID (optional)</label>
                <input className="input" value={form.subject_id} onChange={(e) => setForm((f) => ({ ...f, subject_id: e.target.value.replace(/\D/g, "") }))} placeholder="e.g. organisation ID" />
              </div>
            </div>
            <div className="field">
              <label>Describe what happened *</label>
              <textarea className="textarea" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} required placeholder="Include dates, names and any other details that will help our team investigate…" />
            </div>
            <p className="tiny muted mb-16"><i className="fas fa-lock" style={{ marginRight: 6 }} />Your report is confidential and handled in line with our safeguarding policy and the Data Protection Act.</p>
            <div className="row between">
              <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn btn-primary" disabled={submitting}>{submitting ? <Spinner small /> : <><i className="fas fa-paper-plane" /> Submit report</>}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
