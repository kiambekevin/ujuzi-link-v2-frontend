import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../api/client";
import { Spinner, StatusBadge } from "../../components/ui";
import { fmtDate } from "../../lib/constants";

export default function PassportPublic() {
  const { token } = useParams();
  const [entry, setEntry] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [verifyCode, setVerifyCode] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);

  useEffect(() => {
    api
      .get(`/passport/public/${token}/`)
      .then((res) => setEntry(res.data))
      .catch((err) => setError(err?.response?.data?.detail || "This share link is invalid or has expired."))
      .finally(() => setLoading(false));
  }, [token]);

  const verify = async (e) => {
    e.preventDefault();
    setVerifyResult(null);
    try {
      const res = await api.post(`/passport/public/${token}/certificate/`, { verification_code: verifyCode.trim() });
      setVerifyResult(res.data);
    } catch (err) {
      setVerifyResult({ valid: false, detail: err?.response?.data?.detail || "Could not verify this certificate." });
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #2e0057 0%, #4b0082 55%, #9333ea 130%)", padding: "40px 16px" }}>
      <div className="card card-lg" style={{ maxWidth: 720, margin: "0 auto", padding: 36 }}>
        <div className="row mb-24">
          <span className="logo-mark" style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg, var(--primary), var(--accent))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "var(--font-heading)", fontWeight: 800 }}>U</span>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800 }}>Ujuzi Link</div>
            <div className="tiny muted">Verified Learning Passport</div>
          </div>
        </div>

        {loading && <Spinner />}
        {error && (
          <div className="empty">
            <i className="fas fa-link-slash" />
            <h4>Link unavailable</h4>
            <p className="small">{error}</p>
            <Link to="/" className="btn btn-primary btn-sm mt-16">Go to Ujuzi Link</Link>
          </div>
        )}

        {entry && (
          <>
            <div className="row between mb-8">
              <h2 style={{ fontSize: "1.5rem" }}>{entry.title}</h2>
              <StatusBadge status={entry.status} />
            </div>
            <p className="muted mb-16"><i className="fas fa-building" style={{ marginRight: 8 }} />{entry.organization_name}</p>

            <div className="grid grid-3 mb-24">
              <div className="card card-pad">
                <div className="tiny bold muted">Type</div>
                <div className="bold mt-8">{entry.opportunity_type?.replace(/_/g, " ") || "-"}</div>
              </div>
              <div className="card card-pad">
                <div className="tiny bold muted">Period</div>
                <div className="bold mt-8 small">{fmtDate(entry.start_date)} → {fmtDate(entry.end_date)}</div>
              </div>
              <div className="card card-pad">
                <div className="tiny bold muted">Skills demonstrated</div>
                <div className="mt-8" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {(entry.skill_names || []).map((s) => <span key={s} className="badge badge-indigo">{s}</span>)}
                  {(entry.skill_names || []).length === 0 && <span className="small muted">-</span>}
                </div>
              </div>
            </div>

            {entry.certificate && (
              <div className="card card-pad mb-24" style={{ background: "linear-gradient(135deg, var(--primary-soft), #f3e8ff)", borderColor: "var(--accent-light)" }}>
                <div className="row between">
                  <div>
                    <div className="tiny bold muted" style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>Certificate of Completion</div>
                    <div className="bold mt-8">{entry.certificate.title || "Completion Certificate"}</div>
                    {entry.certificate.verification_code && (
                      <div className="tiny muted mt-8">Verification code: <b style={{ fontFamily: "JetBrains Mono, monospace" }}>{entry.certificate.verification_code}</b></div>
                    )}
                  </div>
                  {entry.certificate.download_url && (
                    <a href={`/api/passport/public/${token}/certificate/`} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                      <i className="fas fa-download" /> Certificate
                    </a>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={verify} className="card card-pad">
              <label className="small bold mb-8" style={{ display: "block" }}>Verify this record</label>
              <p className="tiny muted mb-16">Enter a certificate verification code to confirm this record is genuine.</p>
              <div className="row wrap">
                <input className="input" style={{ maxWidth: 280 }} value={verifyCode} onChange={(e) => setVerifyCode(e.target.value)} placeholder="e.g. UL-XXXX-XXXX" required />
                <button className="btn btn-outline"><i className="fas fa-certificate" /> Verify</button>
              </div>
              {verifyResult && verifyResult.valid && (
                <div className="form-success mt-16">
                  <i className="fas fa-circle-check" /> <b>{verifyResult.certificate?.title || "Certificate"}</b> - verified
                  {verifyResult.certificate?.issued_at && <> on {fmtDate(verifyResult.certificate.issued_at)}</>}.
                </div>
              )}
              {verifyResult && !verifyResult.valid && <div className="form-error mt-16">{verifyResult.detail}</div>}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
