import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../../components/Auth";
import { api, errorMessage } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { Spinner } from "../../components/ui";
import ujuziLogo from '../../assets/images/ujuzink.png'

export default function PasswordReset() {
  const toast = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState("request");
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const requestCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/password-reset/", { identifier: identifier.trim() });
      toast.success("A reset code has been sent.");
      setStep("confirm");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const confirmReset = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 8) return setError("Password must be at least 8 characters.");
    if (newPassword !== confirm) return setError("Passwords do not match.");
    setLoading(true);
    try {
      await api.post("/auth/password-reset/confirm/", {
        identifier: identifier.trim(), code: code.trim(), purpose: "PASSWORD_RESET", new_password: newPassword,
      });
      toast.success("Password reset. Sign in with your new password.");
      navigate("/login", { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {step === "request" ? (
        <>
          <h2 style={{ marginBottom: 6, fontSize: "1.35rem" }}>Reset your password</h2>
          <p className="small muted mb-16">Enter your email and we'll send you a reset code.</p>
          {error && <div className="form-error">{error}</div>}
          <form onSubmit={requestCode}>
            <div className="field">
              <label>Email address</label>
              <input className="input" type="email" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="you@example.com" required autoFocus />
            </div>
            <button className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? <Spinner small /> : <><i className="fas fa-paper-plane" /> Send reset code</>}
            </button>
          </form>
        </>
      ) : (
        <>
          <h2 style={{ marginBottom: 6, fontSize: "1.35rem" }}>Enter reset code</h2>
          <p className="small muted mb-16">We sent a 6-digit code to <b>{identifier}</b>.</p>
          {error && <div className="form-error">{error}</div>}
          <form onSubmit={confirmReset}>
            <div className="field">
              <label>Reset code</label>
              <input className="input" inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="••••••" style={{ textAlign: "center", letterSpacing: "0.4em", fontFamily: "JetBrains Mono, monospace" }} required />
            </div>
            <div className="field">
              <label>New password</label>
              <input className="input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 8 characters" required />
            </div>
            <div className="field">
              <label>Confirm new password</label>
              <input className="input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" required />
            </div>
            <button className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? <Spinner small /> : <><i className="fas fa-key" /> Reset password</>}
            </button>
          </form>
          <div className="row between mt-16">
            <button className="btn btn-ghost btn-sm" onClick={() => setStep("request")}>
              <i className="fas fa-arrow-left" /> Back
            </button>
            <Link to="/login" className="small">Sign in</Link>
          </div>
        </>
      )}
    </AuthLayout>
  );
}
