import { useState } from "react";
import { api, errorMessage } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Alert, Modal, Spinner, useFetch } from "../../components/ui";

export default function DataRights() {
  const toast = useToast();
  const { logout, user } = useAuth();
  const { data: exportData, loading } = useFetch(() => api.get("/data-rights/"));
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [correction, setCorrection] = useState({ field: "email", correction: "", explanation: "" });
  const [submitting, setSubmitting] = useState(false);

  const downloadExport = () => {
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ujuzi-my-data.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Your data export has been downloaded.");
  };

  const requestDeletion = async () => {
    setSubmitting(true);
    try {
      await api.post("/data-rights/", { action: "deletion" });
      toast.success("Deletion requested. Your account has been deactivated.");
      setConfirmDelete(false);
      logout();
      window.location.href = "/";
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const submitCorrection = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/data-rights/correction/", correction);
      toast.success("Correction request submitted. Our team will review it.");
      setCorrection({ field: "email", correction: "", explanation: "" });
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <div className="card card-lg card-pad mb-24" style={{ background: "linear-gradient(135deg, var(--primary-dark), var(--primary-light))", color: "#fff" }}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: 6 }}><i className="fas fa-lock" style={{ marginRight: 10, color: "var(--accent-light)" }} />My Data & Privacy</h1>
        <p style={{ color: "#e6d9f7", maxWidth: 620 }}>
          Under the Data Protection Act, 2019 you have the right to access, correct and delete your personal data on Ujuzi Link.
        </p>
      </div>

      <div className="grid grid-2">
        <div className="card card-pad">
          <h4 className="mb-8"><i className="fas fa-download" style={{ marginRight: 8, color: "var(--accent-dark)" }} />Access my data</h4>
          <p className="small muted mb-16">
            Download a full copy of your profile, documents metadata, applications, placements and passport records.
          </p>
          {loading ? <Spinner /> : (
            <button className="btn btn-primary btn-block" onClick={downloadExport}>
              <i className="fas fa-file-arrow-down" /> Download my data (JSON)
            </button>
          )}
        </div>

        <div className="card card-pad">
          <h4 className="mb-8"><i className="fas fa-pen-to-square" style={{ marginRight: 8, color: "var(--accent-dark)" }} />Correct my data</h4>
          <form onSubmit={submitCorrection}>
            <div className="field">
              <label>What needs correcting?</label>
              <select className="select" value={correction.field} onChange={(e) => setCorrection((c) => ({ ...c, field: e.target.value }))}>
                <option value="email">Email address</option>
                <option value="phone">Phone number</option>
                <option value="full_name">Full name</option>
                <option value="date_of_birth">Date of birth</option>
                <option value="national_id">National ID</option>
                <option value="county">County / location</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="field">
              <label>Correct value</label>
              <input className="input" value={correction.correction} onChange={(e) => setCorrection((c) => ({ ...c, correction: e.target.value }))} required />
            </div>
            <div className="field">
              <label>Explanation</label>
              <textarea className="textarea" style={{ minHeight: 70 }} value={correction.explanation} onChange={(e) => setCorrection((c) => ({ ...c, explanation: e.target.value }))} />
            </div>
            <button className="btn btn-outline btn-block" disabled={submitting}>{submitting ? <Spinner small /> : <><i className="fas fa-paper-plane" /> Submit correction request</>}</button>
          </form>
        </div>
      </div>

      <div className="card card-pad mt-24" style={{ borderColor: "#fecaca" }}>
        <h4 className="mb-8" style={{ color: "var(--danger)" }}><i className="fas fa-trash" style={{ marginRight: 8 }} />Delete my data</h4>
        <p className="small muted mb-16">
          Request deletion of your account and personal data. Your account will be deactivated immediately and your data permanently removed after review.
          This action cannot be undone.
        </p>
        <button className="btn btn-danger" onClick={() => setConfirmDelete(true)}>
          <i className="fas fa-trash" /> Request account deletion
        </button>
      </div>

      {confirmDelete && (
        <Modal title="Request account deletion" onClose={() => setConfirmDelete(false)}>
          <Alert>This will deactivate your account immediately. Your applications and records will be anonymised after review. This cannot be undone.</Alert>
          <p className="small muted mb-16">Are you sure you want to delete your account ({user?.email})?</p>
          <div className="row between">
            <button className="btn btn-ghost" onClick={() => setConfirmDelete(false)}>Cancel</button>
            <button className="btn btn-danger" onClick={requestDeletion} disabled={submitting}>
              {submitting ? <Spinner small /> : <><i className="fas fa-trash" /> Yes, delete my data</>}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
