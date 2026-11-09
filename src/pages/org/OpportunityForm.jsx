import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  Check,
  CircleCheck,
  FileText,
  Info,
  Layers,
  Lightbulb,
  MapPin,
  Megaphone,
  Save,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { api, errorMessage } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { PageLoader, Spinner } from "../../components/ui";
import {
  COMPENSATION_TYPES,
  DURATION_UNITS,
  KENYA_COUNTIES,
  OPPORTUNITY_TYPES,
  USER_DOCUMENT_TYPES,
  WORK_MODES,
} from "../../lib/constants";
import "./OpportunityForm.css";

const EMPTY = {
  title: "",
  description: "",
  type: "INTERNSHIP",
  work_mode: "ONSITE",
  compensation: "UNPAID",
  stipend_amount: "",
  county: "",
  location: "",
  worksite: "",
  places_total: 1,
  start_date: "",
  closing_date: "",
  duration_value: 1,
  duration_unit: "WEEKS",
  working_hours: "",
  schedule: "",
  skills_gained: "",
  qualifications: "",
  eligibility_criteria: "",
  application_instructions: "",
  min_age: "",
  allow_multiple_applications: false,
};

export default function OpportunityForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(EMPTY);
  const [documents, setDocuments] = useState([]);
  const [skillIds, setSkillIds] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/skills/")
      .then((res) => setCatalog(res.data.results || res.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!editing) return;
    api
      .get(`/opportunities/${id}/`)
      .then((res) => {
        const o = res.data;
        setForm({
          title: o.title || "",
          description: o.description || "",
          type: o.type,
          work_mode: o.work_mode,
          compensation: o.compensation,
          stipend_amount: o.stipend_amount ?? "",
          county: o.county || "",
          location: o.location || "",
          worksite: o.worksite || "",
          places_total: o.places_total,
          start_date: o.start_date || "",
          closing_date: o.closing_date || "",
          duration_value: o.duration_value,
          duration_unit: o.duration_unit,
          working_hours: o.working_hours || "",
          schedule: o.schedule || "",
          skills_gained: o.skills_gained || "",
          qualifications: o.qualifications || "",
          eligibility_criteria: o.eligibility_criteria || "",
          application_instructions: o.application_instructions || "",
          min_age: o.min_age ?? "",
          allow_multiple_applications: o.allow_multiple_applications,
        });
        setDocuments(o.required_documents || []);
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [editing, id]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const toggleDoc = (value) =>
    setDocuments(documents.includes(value) ? documents.filter((d) => d !== value) : [...documents, value]);

  const toggleSkill = (value) =>
    setSkillIds(skillIds.includes(value) ? skillIds.filter((s) => s !== value) : [...skillIds, value]);

  const validate = () => {
    if (!form.title.trim()) return "Give the advert a title.";
    if (form.closing_date && form.start_date && form.closing_date >= form.start_date)
      return "The closing date must be before the starting date.";
    return "";
  };

  const submit = async () => {
    const problem = validate();
    if (problem) return setError(problem);
    setSaving(true);
    setError("");
    const payload = { ...form, required_documents: documents, skill_ids: skillIds };
    if (!editing) {
      payload.submit = true;
    } else {
      delete payload.places_total;
    }
    try {
      const res = editing
        ? await api.patch(`/opportunities/${id}/`, payload)
        : await api.post("/opportunities/", payload);
      toast.success(editing ? "Advert updated." : "Advert submitted for review.");
      navigate(`/app/org/opportunities/${res.data.id}`);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="page">
      <header className="opform-header">
        <div>
          <h2>{editing ? "Edit advert" : "Advertise an opportunity"}</h2>
          <p className="opform-header-sub">
            New adverts are submitted to the administrator for review before going live.{" "}
            <strong>Fields marked * are required.</strong>
          </p>
        </div>
      </header>

      {error && (
        <div className="opform-error" role="alert">
          <AlertCircle size={18} strokeWidth={2.25} />
          <span>{error}</span>
        </div>
      )}

      <div className="opform-sections">
        {/* -------- Basics -------- */}
        <section className="opform-card">
          <div className="opform-card-head">
            <div className="opform-card-head-icon">
              <Megaphone size={18} strokeWidth={2.25} />
            </div>
            <div>
              <h4>Basics</h4>
              <p>What the opportunity is and who it's for.</p>
            </div>
          </div>

          <div className="opform-field">
            <span className="opform-field-label">
              Title <span className="req">*</span>
            </span>
            <input
              className="input"
              value={form.title}
              onChange={set("title")}
              placeholder="e.g. Data Science Internship — Nairobi"
            />
          </div>

          <div className="opform-field">
            <span className="opform-field-label">
              Description <span className="req">*</span>
            </span>
            <textarea
              className="input"
              rows={4}
              value={form.description}
              onChange={set("description")}
              placeholder="What will the young person do and learn?"
            />
          </div>

          <div className="opform-grid">
            <label className="opform-field">
              <span className="opform-field-label">Opportunity type</span>
              <select className="input" value={form.type} onChange={set("type")}>
                {OPPORTUNITY_TYPES.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </label>
            <label className="opform-field">
              <span className="opform-field-label">Work mode</span>
              <select className="input" value={form.work_mode} onChange={set("work_mode")}>
                {WORK_MODES.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </label>
            <label className="opform-field">
              <span className="opform-field-label">Compensation</span>
              <select className="input" value={form.compensation} onChange={set("compensation")}>
                {COMPENSATION_TYPES.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </label>
            {form.compensation === "STIPEND" && (
              <label className="opform-field">
                <span className="opform-field-label">Monthly stipend (KES)</span>
                <input
                  className="input"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.stipend_amount}
                  onChange={set("stipend_amount")}
                />
              </label>
            )}
            <label className="opform-field">
              <span className="opform-field-label">County</span>
              <select className="input" value={form.county} onChange={set("county")}>
                <option value="">Select county</option>
                {KENYA_COUNTIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="opform-field">
              <span className="opform-field-label">Location / worksite</span>
              <input
                className="input"
                value={form.location}
                onChange={set("location")}
                placeholder="e.g. Upper Hill, Nairobi"
              />
            </label>
            <label className="opform-field">
              <span className="opform-field-label">
                Places available <span className="req">*</span>
              </span>
              <input
                className="input"
                type="number"
                min="1"
                value={form.places_total}
                onChange={set("places_total")}
                disabled={editing}
              />
              {editing && <span className="opform-field-hint">Places can't change after submission.</span>}
            </label>
            <label className="opform-field">
              <span className="opform-field-label">Minimum age</span>
              <input
                className="input"
                type="number"
                min="14"
                max="35"
                value={form.min_age}
                onChange={set("min_age")}
              />
            </label>
          </div>
        </section>

        {/* -------- Dates & duration -------- */}
        <section className="opform-card">
          <div className="opform-card-head">
            <div className="opform-card-head-icon">
              <CalendarDays size={18} strokeWidth={2.25} />
            </div>
            <div>
              <h4>Dates &amp; duration</h4>
              <p>When the placement runs and how long it lasts.</p>
            </div>
          </div>

          <div className="opform-grid">
            <label className="opform-field">
              <span className="opform-field-label">
                Start date <span className="req">*</span>
              </span>
              <input className="input" type="date" value={form.start_date} onChange={set("start_date")} />
            </label>
            <label className="opform-field">
              <span className="opform-field-label">
                Application closing date <span className="req">*</span>
              </span>
              <input className="input" type="date" value={form.closing_date} onChange={set("closing_date")} />
            </label>
            <label className="opform-field">
              <span className="opform-field-label">Duration</span>
              <input
                className="input"
                type="number"
                min="1"
                value={form.duration_value}
                onChange={set("duration_value")}
              />
            </label>
            <label className="opform-field">
              <span className="opform-field-label">Duration unit</span>
              <select className="input" value={form.duration_unit} onChange={set("duration_unit")}>
                {DURATION_UNITS.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </label>
            <label className="opform-field">
              <span className="opform-field-label">Working hours</span>
              <input
                className="input"
                value={form.working_hours}
                onChange={set("working_hours")}
                placeholder="e.g. 8:00 am – 5:00 pm, Mon–Fri"
              />
            </label>
            <label className="opform-field">
              <span className="opform-field-label">Schedule / shifts</span>
              <input
                className="input"
                value={form.schedule}
                onChange={set("schedule")}
                placeholder="e.g. Full-time, weekdays"
              />
            </label>
          </div>
        </section>

        {/* -------- Requirements & learning -------- */}
        <section className="opform-card">
          <div className="opform-card-head">
            <div className="opform-card-head-icon">
              <Lightbulb size={18} strokeWidth={2.25} />
            </div>
            <div>
              <h4>Requirements &amp; learning</h4>
              <p>Who qualifies and what they will gain.</p>
            </div>
          </div>

          <label className="opform-field">
            <span className="opform-field-label">Skills the participant will gain</span>
            <input
              className="input"
              value={form.skills_gained}
              onChange={set("skills_gained")}
              placeholder="e.g. Data analysis, Python, Report writing"
            />
          </label>

          <label className="opform-field">
            <span className="opform-field-label">Qualifications required</span>
            <textarea
              className="input"
              rows={2}
              value={form.qualifications}
              onChange={set("qualifications")}
              placeholder="e.g. Diploma in IT or equivalent"
            />
          </label>

          <label className="opform-field">
            <span className="opform-field-label">Eligibility criteria</span>
            <textarea
              className="input"
              rows={2}
              value={form.eligibility_criteria}
              onChange={set("eligibility_criteria")}
              placeholder="e.g. Kenyan trainee aged 18–35"
            />
          </label>

          <label className="opform-field">
            <span className="opform-field-label">Application instructions</span>
            <textarea
              className="input"
              rows={2}
              value={form.application_instructions}
              onChange={set("application_instructions")}
              placeholder="Anything applicants should know"
            />
          </label>

          <div className="opform-field">
            <span className="opform-field-label">Required documents</span>
            <div className="opform-chips">
              {USER_DOCUMENT_TYPES.map(([v, l]) => {
                const on = documents.includes(v);
                return (
                  <button
                    key={v}
                    type="button"
                    className={`opform-chip${on ? " is-on" : ""}`}
                    onClick={() => toggleDoc(v)}
                  >
                    {on && <Check size={13} strokeWidth={3} />}
                    {l}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="opform-field">
            <span className="opform-field-label">Skills required of applicants</span>
            <div className="opform-chips">
              {catalog.map((s) => {
                const on = skillIds.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    className={`opform-chip${on ? " is-on" : ""}`}
                    onClick={() => toggleSkill(s.id)}
                  >
                    {on && <Check size={13} strokeWidth={3} />}
                    {s.name}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="opform-checkbox-row">
            <input
              type="checkbox"
              checked={form.allow_multiple_applications}
              onChange={(e) =>
                setForm({ ...form, allow_multiple_applications: e.target.checked })
              }
            />
            <span className="opform-checkbox-text">
              <strong>Allow repeat applications</strong>
              Let the same person apply to this advert more than once.
            </span>
          </label>
        </section>

        {/* -------- Sticky save bar -------- */}
        <div className="opform-save-bar">
          <span className="opform-save-note">
            <Info size={14} strokeWidth={2.5} />
            {editing ? "Changes are saved immediately." : "Submitted adverts go to admin review."}
          </span>
          <button className="btn btn-outline" onClick={() => navigate("/app/org/opportunities")}>
            <X size={15} strokeWidth={2.5} /> Cancel
          </button>
          <button className="btn btn-primary" onClick={submit} disabled={saving}>
            {saving ? (
              <Spinner small />
            ) : editing ? (
              <>
                <Save size={15} strokeWidth={2.5} /> Save changes
              </>
            ) : (
              <>
                <Send size={15} strokeWidth={2.5} /> Submit for review
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}