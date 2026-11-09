import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api, errorMessage } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { Spinner } from "../../components/ui";
import {
  GENDERS,
  KENYA_COUNTIES,
  OPPORTUNITY_TYPES,
  ORGANIZATION_TYPES,
  SECTOR_OPTIONS,
} from "../../lib/constants";
import "../../styles/auth.css";

import ujuziLogo from '../../assets/images/ujuzink.png'

// Trainee-only extras are stashed here so VerifyOtp.jsx can PATCH /api/profile/
// after OTP verification (which requires a JWT). The plaintext password is
// included so VerifyOtp can auto-login — see VerifyOtp.jsx for the fallback
// if you'd rather not stash it.
export const REG_PENDING_KEY = "ujuzi.registration.pendingProfile";

// Mirror TraineeProfile.save()'s age calc so the guardian block can appear
// as soon as an under-18 DOB is entered.
function isUnder18(dob) {
  if (!dob) return false;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age -= 1;
  return age < 18;
}

export default function Register() {
  const [params] = useSearchParams();
  const isOrg = params.get("type") === "organization";
  const [tab, setTab] = useState(isOrg ? "org" : "trainee");
  const toast = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    // shared
    email: "",
    phone: "",
    password: "",
    confirm: "",
    accept_terms: false,

    // trainee (only full_name reaches the backend; rest is stashed)
    full_name: "",
    gender: "",
    date_of_birth: "",
    county: "Nairobi",
    city: "",
    national_id: "",
    bio: "",
    preferred_opportunity_types: [],
    guardian_consent: false,
    guardian_full_name: "",

    // organisation (all sent to /organizations/register/)
    name: "",
    contact_name: "",
    org_type: "COMPANY",
    registration_no: "",
    physical_address: "",
    website: "",
    description: "",
    sectors: [], // array of codes, e.g. ["ICT", "ENERGY"]
  });

  // Keep the visible tab in sync if the URL param changes mid-mount.
  useEffect(() => {
    if (isOrg && tab !== "org") setTab("org");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOrg]);

  const set = (key) => (e) =>
    setForm((f) => ({
      ...f,
      [key]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const toggleInArray = (key, value) =>
    setForm((f) => {
      const arr = f[key];
      return {
        ...f,
        [key]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });

  const under18 = useMemo(
    () => tab === "trainee" && isUnder18(form.date_of_birth),
    [tab, form.date_of_birth]
  );

  const switchTab = (next) => {
    setError("");
    setTab(next);
  };

  const validate = () => {
    if (!form.email.trim())
      return "An email address is required for verification.";
    if (form.phone && !/^\+?[0-9\s-]{7,20}$/.test(form.phone))
      return "Please enter a valid phone number (e.g. +254712345678).";
    if (form.password.length < 8)
      return "Password must be at least 8 characters.";
    if (form.password !== form.confirm) return "Passwords do not match.";
    if (!form.accept_terms)
      return "You must accept the terms and data protection consent.";

    if (tab === "trainee") {
      if (!form.full_name.trim()) return "Please enter your full name.";
      if (!form.gender) return "Please select your gender.";
      if (!form.date_of_birth) return "Please enter your date of birth.";
      if (!form.county) return "Please select your county.";
      if (under18) {
        if (!form.guardian_consent)
          return "Guardian consent is required for participants under 18 (TORS 115).";
        if (!form.guardian_full_name.trim())
          return "Please provide your guardian's full name.";
      }
    }

    if (tab === "org") {
      if (!form.name.trim()) return "Please enter the organisation name.";
      if (!form.contact_name.trim())
        return "Please enter the contact person's name.";
      if (form.website && !/^https?:\/\//i.test(form.website))
        return "Website must start with http:// or https://";
    }
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) return setError(v);

    setLoading(true);
    try {
      // -------- Build the exact payload each backend serializer expects -----
      const payload =
        tab === "trainee"
          ? {
              // RegisterSerializer only
              email: form.email,
              phone: form.phone || undefined,
              password: form.password,
              full_name: form.full_name,
              role: "TRAINEE",
              accept_terms: true,
            }
          : {
              // OrganizationRegisterSerializer
              email: form.email,
              phone: form.phone || undefined,
              password: form.password,
              contact_name: form.contact_name,
              name: form.name,
              registration_no: form.registration_no || undefined,
              org_type: form.org_type,
              county: form.county || undefined,
              physical_address: form.physical_address || undefined,
              website: form.website || undefined,
              description: form.description || undefined,
              sectors: form.sectors, // array of codes
              accept_terms: true,
            };

      const { data } = await api.post(
        tab === "trainee" ? "/auth/register/" : "/organizations/register/",
        payload
      );

      const identifier = data?.identifier || form.email || form.phone;

      // -------- Stage trainee extras (and password) for VerifyOtp.jsx ------
      // Org registrations are fully persisted by the backend at this point,
      // so nothing needs to be stashed for them.
      if (tab === "trainee") {
        const extra = {
          gender: form.gender,
          date_of_birth: form.date_of_birth || null,
          county: form.county,
          city: form.city || "",
          national_id: form.national_id || "",
          bio: form.bio || "",
          preferred_opportunity_types: form.preferred_opportunity_types,
          guardian_consent: under18 ? form.guardian_consent : false,
          guardian_full_name: under18 ? form.guardian_full_name : "",
        };
        try {
          sessionStorage.setItem(
            REG_PENDING_KEY,
            JSON.stringify({
              type: "trainee",
              payload: extra,
              password: form.password, // for immediate auto-login in VerifyOtp
            })
          );
        } catch {
          // Private browsing / storage full — non-fatal; VerifyOtp will
          // fall back to the login page.
        }
      }

      toast.success("Account created. Verify your email to continue.");
      navigate(
        `/verify-otp?identifier=${encodeURIComponent(
          identifier
        )}&purpose=REGISTRATION&type=${tab}`
      );
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* LEFT: Brand panel (matches AuthPage) */}
      <div className="auth-brand-panel">
        <div className="brand-content">
          
          <h2>
            Where skills meet <span>opportunity</span>.
          </h2>
          <p>
            Ujuzi Link connects TVET trainees with verified employers for
            industrial attachment, internship, apprenticeship and
            dual-training placements across Kenya.
          </p>
          
        </div>
      </div>

      {/* RIGHT: Form panel */}
      <div className="auth-form-panel">
        <div className="auth-top">
          <Link to="/" className="logo" aria-label="Ujuzi Link home">
            <div className="logo-icon">
              <img src={ujuziLogo} width="50" height="50" alt="" aria-hidden="true" className="fas fa-graduation-cap" />

            </div>
            <div className="logo-text">
              Ujuzi Link
              <span>National TVET Work-Based Learning</span>
            </div>
          </Link>
          <Link to="/login" className="back-home">
            <i className="fas fa-arrow-left" aria-hidden="true"></i> Back to sign
            in
          </Link>
        </div>

        <div className="auth-form-container">
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">
            Join Kenya's national work-based learning platform.
          </p>

          {/* Tabs */}
          <div
            className="auth-tabs"
            role="tablist"
            aria-label="Registration type"
          >
            <button
              type="button"
              className={`auth-tab ${tab === "trainee" ? "active" : ""}`}
              role="tab"
              aria-selected={tab === "trainee"}
              onClick={() => switchTab("trainee")}
            >
              <i className="fa-solid fa-user-graduate" aria-hidden="true"></i> 
              Trainee
            </button>
            <button
              type="button"
              className={`auth-tab ${tab === "org" ? "active" : ""}`}
              role="tab"
              aria-selected={tab === "org"}
              onClick={() => switchTab("org")}
            >
              <i className="fas fa-building" aria-hidden="true"></i> Organisation
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={submit} noValidate>
            {/* ======================= TRAINEE ======================= */}
            {tab === "trainee" && (
              <>
                <div className="form-group">
                  <label htmlFor="full_name">
                    Full name <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <i className="fas fa-user" aria-hidden="true"></i>
                    <input
                      id="full_name"
                      value={form.full_name}
                      onChange={set("full_name")}
                      placeholder="e.g. Amina Wanjiku"
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div className="form-hint">
                    We'll split this into first and last name for your profile.
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="gender">
                      Gender <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <i className="fas fa-venus-mars" aria-hidden="true"></i>
                      <select
                        id="gender"
                        value={form.gender}
                        onChange={set("gender")}
                        required
                      >
                        <option value="">Select…</option>
                        {GENDERS.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="date_of_birth">
                      Date of birth <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <i className="fas fa-calendar" aria-hidden="true"></i>
                      <input
                        id="date_of_birth"
                        type="date"
                        value={form.date_of_birth}
                        onChange={set("date_of_birth")}
                        max={new Date().toISOString().slice(0, 10)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="county">
                      County <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <i
                        className="fas fa-map-marker-alt"
                        aria-hidden="true"
                      ></i>
                      <select
                        id="county"
                        value={form.county}
                        onChange={set("county")}
                        required
                      >
                        {KENYA_COUNTIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="city">Town / City</label>
                    <div className="input-wrapper">
                      <i className="fas fa-city" aria-hidden="true"></i>
                      <input
                        id="city"
                        value={form.city}
                        onChange={set("city")}
                        placeholder="e.g. Nakuru"
                        autoComplete="address-level2"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="national_id">
                    National ID / Passport no. (optional)
                  </label>
                  <div className="input-wrapper">
                    <i className="fas fa-id-card" aria-hidden="true"></i>
                    <input
                      id="national_id"
                      value={form.national_id}
                      onChange={set("national_id")}
                      placeholder="e.g. 12345678"
                      autoComplete="off"
                    />
                  </div>
                  <div className="form-hint">
                    Only visible to organisations you apply to.
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="bio">Short bio (optional)</label>
                  <div className="input-wrapper">
                    <i className="fas fa-align-left" aria-hidden="true"></i>
                    <textarea
                      id="bio"
                      value={form.bio}
                      onChange={set("bio")}
                      placeholder="Tell employers a little about yourself, your interests and what you're looking for."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Opportunity types you're interested in</label>
                  <div
                    className="chip-grid"
                    role="group"
                    aria-label="Opportunity types"
                  >
                    {OPPORTUNITY_TYPES.map(([v, l]) => {
                      const selected =
                        form.preferred_opportunity_types.includes(v);
                      return (
                        <button
                          key={v}
                          type="button"
                          className={`chip ${selected ? "selected" : ""}`}
                          aria-pressed={selected}
                          onClick={() =>
                            toggleInArray("preferred_opportunity_types", v)
                          }
                        >
                          {l}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {under18 && (
                  <div className="dynamic-section">
                    <div className="info-box">
                      <i className="fas fa-shield-alt" aria-hidden="true" />
                      Because you're under 18, we need your guardian's consent
                      before you can apply for placements (TORS 115).
                    </div>
                    <div className="form-group">
                      <label htmlFor="guardian_full_name">
                        Guardian's full name{" "}
                        <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <i className="fas fa-user-shield" aria-hidden="true"></i>
                        <input
                          id="guardian_full_name"
                          value={form.guardian_full_name}
                          onChange={set("guardian_full_name")}
                          placeholder="e.g. Grace Wanjiku"
                          required={under18}
                        />
                      </div>
                    </div>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={form.guardian_consent}
                        onChange={set("guardian_consent")}
                        required={under18}
                      />
                      <span>
                        I confirm my parent / guardian has consented to my
                        participation in work-based learning on Ujuzi Link.
                      </span>
                    </label>
                  </div>
                )}
              </>
            )}

            {/* ====================== ORGANISATION ====================== */}
            {tab === "org" && (
              <>
                <div className="form-group">
                  <label htmlFor="org_name">
                    Organisation name <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <i className="fas fa-building" aria-hidden="true"></i>
                    <input
                      id="org_name"
                      value={form.name}
                      onChange={set("name")}
                      placeholder="e.g. Acme Corporation"
                      autoComplete="organization"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="contact_name">
                    Contact person's name <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <i className="fas fa-id-badge" aria-hidden="true"></i>
                    <input
                      id="contact_name"
                      value={form.contact_name}
                      onChange={set("contact_name")}
                      placeholder="e.g. Jane Officer"
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div className="form-hint">
                    This becomes the first recruitment officer account.
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="org_type">
                      Organisation type <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <i className="fas fa-briefcase" aria-hidden="true"></i>
                      <select
                        id="org_type"
                        value={form.org_type}
                        onChange={set("org_type")}
                      >
                        {ORGANIZATION_TYPES.map(([v, l]) => (
                          <option key={v} value={v}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="county">
                      Head office county <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <i
                        className="fas fa-map-marker-alt"
                        aria-hidden="true"
                      ></i>
                      <select
                        id="county"
                        value={form.county}
                        onChange={set("county")}
                      >
                        {KENYA_COUNTIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="registration_no">
                    Registration no. / KRA PIN (optional)
                  </label>
                  <div className="input-wrapper">
                    <i className="fas fa-file-invoice" aria-hidden="true"></i>
                    <input
                      id="registration_no"
                      value={form.registration_no}
                      onChange={set("registration_no")}
                      placeholder="e.g. CPR/2019/123456 or P051234567X"
                    />
                  </div>
                  <div className="form-hint">
                    Speeds up verification — you can also upload documents
                    later.
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="physical_address">
                    Physical address (optional)
                  </label>
                  <div className="input-wrapper">
                    <i className="fas fa-location-dot" aria-hidden="true"></i>
                    <input
                      id="physical_address"
                      value={form.physical_address}
                      onChange={set("physical_address")}
                      placeholder="e.g. Westlands, Nairobi"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="website">Website (optional)</label>
                  <div className="input-wrapper">
                    <i className="fas fa-globe" aria-hidden="true"></i>
                    <input
                      id="website"
                      type="url"
                      value={form.website}
                      onChange={set("website")}
                      placeholder="https://acme.co.ke"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description">
                    About the organisation (optional)
                  </label>
                  <div className="input-wrapper">
                    <i className="fas fa-align-left" aria-hidden="true"></i>
                    <textarea
                      id="description"
                      value={form.description}
                      onChange={set("description")}
                      placeholder="A short description of what your organisation does."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Industry sectors you offer placements in</label>
                  <div className="chip-grid" role="group" aria-label="Sectors">
                    {SECTOR_OPTIONS.map((s) => {
                      const selected = form.sectors.includes(s.code);
                      return (
                        <button
                          key={s.code}
                          type="button"
                          className={`chip ${selected ? "selected" : ""}`}
                          aria-pressed={selected}
                          onClick={() => toggleInArray("sectors", s.code)}
                        >
                          {s.name}
                        </button>
                      );
                    })}
                  </div>
                  <div className="form-hint">
                    You can add or change these later from your dashboard.
                  </div>
                </div>
              </>
            )}

            {/* ======================= SHARED ======================= */}
            <div className="form-group">
              <label htmlFor="email">
                Email address <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <i className="fas fa-envelope" aria-hidden="true"></i>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="form-hint">
                We'll send a one-time verification code to this address.
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone number (optional)</label>
              <div className="input-wrapper">
                <i className="fas fa-phone" aria-hidden="true"></i>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="+254 712 345 678"
                  autoComplete="tel"
                />
              </div>
              <div className="form-hint">
                Useful for interview reminders and SMS alerts.
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="password">
                  Password <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <i className="fas fa-lock" aria-hidden="true"></i>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={set("password")}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <i
                      className={`fas ${
                        showPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="confirm">
                  Confirm password <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <i className="fas fa-lock" aria-hidden="true"></i>
                  <input
                    id="confirm"
                    type={showConfirm ? "text" : "password"}
                    value={form.confirm}
                    onChange={set("confirm")}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirm((s) => !s)}
                    aria-label={
                      showConfirm ? "Hide password" : "Show password"
                    }
                  >
                    <i
                      className={`fas ${
                        showConfirm ? "fa-eye-slash" : "fa-eye"
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </div>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.accept_terms}
                onChange={set("accept_terms")}
              />
              <span>
                I agree to the <a href="/terms">Terms of Use</a> and consent to
                the processing of my personal data in line with the{" "}
                <a href="/privacy">Data Protection Act, 2019</a>. I understand I
                can access, correct or delete my data at any time.
              </span>
            </label>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <Spinner small />
              ) : (
                <>
                  <i className="fas fa-user-plus" aria-hidden="true" /> Create
                  account
                </>
              )}
            </button>
          </form>

          <p className="auth-footer-note">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}