import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthLayout } from "../../components/Auth";
import { api, errorMessage } from "../../api/client";
import { useAuth, roleHome } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Spinner } from "../../components/ui";
import { REG_PENDING_KEY } from "./Register";
import ujuziLogo from '../../assets/images/ujuzink.png'

export default function VerifyOtp() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { loginWithTokens } = useAuth();

  const identifier = params.get("identifier") || "";
  const purpose = params.get("purpose") || "REGISTRATION";
  const type = params.get("type") || "trainee"; // "trainee" | "org"

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Read the plaintext password stashed by Register.jsx. Needed to
  // immediately log the user in post-verification so we can flush their
  // stashed profile extras (PATCH /api/profile/ requires a JWT).
  const readPending = () => {
    try {
      const raw = sessionStorage.getItem(REG_PENDING_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // 1. Verify OTP
      await api.post("/auth/verify-otp/", {
        identifier,
        code: code.trim(),
        purpose,
      });

      // 2. Password-reset flow terminates here.
      if (purpose === "PASSWORD_RESET") {
        toast.success("Code verified. Set a new password.");
        navigate(
          `/reset-password?identifier=${encodeURIComponent(identifier)}&code=${encodeURIComponent(code.trim())}`,
          { replace: true }
        );
        return;
      }

      // 3. Registration flow: log the user in using the stashed password.
      const pending = readPending();
      const pendingPassword = pending?.password || "";

      if (!pendingPassword) {
        // Nothing stashed (e.g. user reloaded) - fall back to the login page.
        toast.success("Account verified. Please sign in.");
        navigate("/login?verified=1", { replace: true });
        return;
      }

      const { data: tokenData } = await api.post("/auth/token/", {
        identifier,
        password: pendingPassword,
      });
      const user = await loginWithTokens({
        access: tokenData.access,
        refresh: tokenData.refresh,
        user: tokenData.user,
      });

      // 4. For trainees: flush profile extras from registration.
      if (type === "trainee" && pending?.payload) {
        const patch = Object.fromEntries(
          Object.entries(pending.payload).filter(
            ([, v]) =>
              v !== "" &&
              v !== null &&
              v !== undefined &&
              !(Array.isArray(v) && v.length === 0)
          )
        );
        if (Object.keys(patch).length > 0) {
          try {
            await api.patch("/profile/", patch);
          } catch (flushErr) {
            // Do not block login - profile can be completed later.
            // eslint-disable-next-line no-console
            console.warn("Profile flush failed:", flushErr);
          }
        }
      }

      // 5. Clean up and route to the role-specific home.
      sessionStorage.removeItem(REG_PENDING_KEY);
      toast.success("Account verified. Welcome to Ujuzi Link!");
      navigate(roleHome(user), { replace: true });
    } catch (err) {
      setError(errorMessage(err, "Invalid or expired code."));
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setResendLoading(true);
    setError("");
    try {
      await api.post("/auth/resend-otp/", { identifier, purpose });
      toast.success("A new code has been sent.");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div
          className="avatar"
          style={{ width: 56, height: 56, margin: "0 auto 12px", fontSize: "1.3rem" }}
        >
          <i className="fas fa-shield-halved" />
        </div>
        <h2 style={{ fontSize: "1.35rem" }}>
          Verify your {purpose === "PASSWORD_RESET" ? "identity" : "account"}
        </h2>
        <p className="small muted mt-8">
          Enter the 6-digit code sent to <b>{identifier}</b>.
        </p>
      </div>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={submit}>
        <div className="field">
          <input
            className="input"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="••••••"
            style={{
              textAlign: "center",
              fontSize: "1.5rem",
              letterSpacing: "0.5em",
              fontFamily: "JetBrains Mono, monospace",
            }}
            autoFocus
            required
          />
        </div>
        <button
          className="btn btn-primary btn-block btn-lg"
          disabled={loading || code.length !== 6}
        >
          {loading ? (
            <Spinner small />
          ) : (
            <>
              <i className="fas fa-check" /> Verify code
            </>
          )}
        </button>
      </form>
      <div className="row between mt-16">
        <button
          className="btn btn-ghost btn-sm"
          onClick={resend}
          disabled={resendLoading}
        >
          {resendLoading ? (
            <Spinner small />
          ) : (
            <>
              <i className="fas fa-paper-plane" /> Resend code
            </>
          )}
        </button>
        <Link to="/login" className="small">
          Back to sign in
        </Link>
      </div>
      <p className="tiny muted mt-16" style={{ textAlign: "center" }}>
        Tip: in development the code is printed in the Django console output.
      </p>
    </AuthLayout>
  );
}