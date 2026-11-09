import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, errorMessage } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { EmptyState, Modal, PageLoader, Spinner, StatusBadge, useFetch } from "../../components/ui";
import { fmtDate } from "../../lib/constants";

export default function Passport() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const [shareEntry, setShareEntry] = useState(null);
  const [certEntry, setCertEntry] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get("/passport/")
      .then((res) => { if (!cancelled) setData(res.data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [tick]);

  const refresh = () => setTick((t) => t + 1);
  const verified = (data?.results || []).filter((e) => e.status === "VERIFIED").length;

  return (
    <div className="page">
      <div className="card card-lg card-pad mb-24" style={{ background: "linear-gradient(135deg, var(--primary-dark), var(--primary-light))", color: "#fff" }}>
        <div className="row between wrap">
          <div>
            <h1 style={{ fontSize: "1.5rem", marginBottom: 6 }}><i className="fas fa-passport" style={{ marginRight: 10, color: "var(--accent-light)" }} />Digital Learning Passport</h1>
            <p style={{ color: "#e6d9f7", maxWidth: 560 }}>
              A verified, shareable record of every placement you complete — your proof of skills for future employers.
            </p>
          </div>
          <span className="badge" style={{ background: "rgba(192,132,252,0.2)", color: "#d8b4fe" }}>
            {verified} verified record{verified === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {loading ? (
        <PageLoader />
      ) : (data?.results || []).length === 0 ? (
        <EmptyState
          icon="fa-passport"
          title="No records yet"
          text="Once you complete a placement, a verified record appears here automatically."
          action={<Link to="/app/opportunities" className="btn btn-primary btn-sm">Find opportunities</Link>}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {(data?.results || []).map((entry) => (
            <div key={entry.id} className="card card-pad">
              <div className="row between wrap mb-8">
                <h4>{entry.title}</h4>
                <StatusBadge status={entry.status} />
              </div>
              <p className="small muted mb-16">
                <i className="fas fa-building" style={{ marginRight: 8 }} />{entry.organization_name}
                <span style={{ margin: "0 10px" }}>•</span>
                <i className="fas fa-calendar" style={{ marginRight: 8 }} />{fmtDate(entry.start_date)} → {fmtDate(entry.end_date)}
              </p>
              {(entry.skill_names || []).length > 0 && (
                <div className="mb-16" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {entry.skill_names.map((s) => <span key={s} className="badge badge-indigo">{s}</span>)}
                </div>
              )}
              <div className="row wrap">
                {entry.status === "VERIFIED" && (
                  <button className="btn btn-accent btn-sm" onClick={() => setShareEntry(entry)}>
                    <i className="fas fa-share-nodes" /> Share
                  </button>
                )}
                <button className="btn btn-outline btn-sm" onClick={() => setCertEntry(entry)}>
                  <i className="fas fa-certificate" /> Certificates
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {shareEntry && <ShareModal entry={shareEntry} onClose={() => setShareEntry(null)} onShared={refresh} />}
      {certEntry && <CertificatesModal entry={certEntry} onClose={() => setCertEntry(null)} />}
    </div>
  );
}

function ShareModal({ entry, onClose, onShared }) {
  const toast = useToast();
  const [days, setDays] = useState(30);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const create = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/passport/${entry.id}/share/`, { days });
      setToken(res.data.token);
      toast.success("Share link created!");
      onShared();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const link = token ? `${window.location.origin}/passport/public/${token}` : null;

  return (
    <Modal title={`Share record — ${entry.title}`} onClose={onClose}>
      {!token ? (
        <>
          <p className="small muted mb-16">
            Create a secure link anyone can open to view this verified record. The link works without signing in.
          </p>
          <div className="field">
            <label>Valid for (days)</label>
            <select className="select" value={days} onChange={(e) => setDays(Number(e.target.value))}>
              {[7, 14, 30, 60, 90].map((d) => <option key={d} value={d}>{d} days</option>)}
            </select>
          </div>
          <div className="row between">
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={create} disabled={loading}>
              {loading ? <Spinner small /> : <><i className="fas fa-link" /> Create share link</>}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="form-success mb-16"><i className="fas fa-circle-check" /> Share link created and valid for {days} days.</div>
          <div className="row" style={{ border: "1.5px solid var(--border-light)", borderRadius: 12, padding: "8px 12px" }}>
            <code className="small" style={{ flex: 1, wordBreak: "break-all", color: "var(--primary-dark)" }}>{link}</code>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => { navigator.clipboard.writeText(link); toast.success("Link copied to clipboard!"); }}
            >
              <i className="fas fa-copy" /> Copy
            </button>
          </div>
          <div className="row mt-16" style={{ justifyContent: "flex-end" }}>
            <button className="btn btn-primary btn-sm" onClick={onClose}>Done</button>
          </div>
        </>
      )}
    </Modal>
  );
}

function CertificatesModal({ entry, onClose }) {
  const { data, loading, error } = useFetch(() => api.get(`/passport/${entry.id}/certificates/`), [entry.id]);
  const cert = data || null;

  return (
    <Modal title={`Certificates — ${entry.title}`} onClose={onClose}>
      {loading ? (
        <Spinner />
      ) : error || !cert ? (
        <p className="small muted">No certificate has been issued for this record yet.</p>
      ) : (
        <div className="card card-pad" style={{ background: "linear-gradient(135deg, var(--primary-soft), #f3e8ff)" }}>
          <div className="row between">
            <div>
              <div className="bold">{cert.title || "Completion Certificate"}</div>
              <div className="tiny muted mt-8">Issued {fmtDate(cert.issued_at)}</div>
              {cert.verification_code && (
                <div className="tiny mt-8">Code: <b style={{ fontFamily: "JetBrains Mono, monospace" }}>{cert.verification_code}</b></div>
              )}
            </div>
            {cert.download_url && (
              <a href={cert.download_url} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                <i className="fas fa-download" /> Download
              </a>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
