import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "../../components/Auth";
import { useAuth, roleHome } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { errorMessage } from "../../api/client";
import { Spinner } from "../../components/ui";
import ujuziLogo from '../../assets/images/ujuzink.png'

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(identifier.trim(), password);
      toast.success(`Welcome back${data.user?.first_name ? ", " + data.user.first_name : ""}!`);
      navigate(from || roleHome(data.user), { replace: true });
    } catch (err) {
      setError(errorMessage(err, "Invalid email/phone or password."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 style={{ marginBottom: 6, fontSize: "1.35rem" }}>Sign in</h2>
      <p className="small muted mb-16">Use your email address or phone number.</p>
      {location.search.includes("expired") && (
        <div className="form-success">Your session expired. Please sign in again.</div>
      )}
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={submit}>
        <div className="field">
          <label>Email or phone</label>
          <input className="input" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="you@example.com or 07XX XXX XXX" required autoFocus />
        </div>
        <div className="field">
          <div className="row between">
            <label style={{ margin: 0 }}>Password</label>
            <Link to="/password-reset" className="tiny">Forgot password?</Link>
          </div>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" required />
        </div>
        <button className="btn btn-primary btn-block btn-lg" disabled={loading}>
          {loading ? <Spinner small /> : <><i className="fas fa-right-to-bracket" /> Sign in</>}
        </button>
      </form>
      <p className="small muted mt-16" style={{ textAlign: "center" }}>
        New to Ujuzi Link? <Link to="/register"><b>Create an account</b></Link>
      </p>
      <p className="small muted mt-16" style={{ textAlign: "center" }}>
         <Link to="/"><b>Home</b></Link>
      </p>
    </AuthLayout>
  );
}
