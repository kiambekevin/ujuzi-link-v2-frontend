import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Award,
  Ban,
  CalendarDays,
  CalendarPlus,
  Check,
  CheckCircle2,
  ClipboardList,
  Download,
  FileText,
  Flag,
  Hourglass,
  MessageSquare,
  Plus,
  Route,
  Send,
  Star,
  Target,
  UploadCloud,
  UserCog,
  Users,
} from "lucide-react";
import { api, errorMessage } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import {
  Alert,
  EmptyState,
  Modal,
  PageLoader,
  Spinner,
  StatusBadge,
  useAsyncAction,
  useFetch,
} from "../../components/ui";
import { fmtDate, fmtMoney, statusBadge } from "../../lib/constants";
import "./PlacementDetail.css";

/* ------------------------------------------------------------------
   Small helpers
------------------------------------------------------------------- */
function initialsFor(name = "", fallback = "") {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return fallback;
}

function StarDisplay({ rating = 0, size = 13 }) {
  return (
    <span className="pld-stars-display">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          strokeWidth={2}
          fill={n <= rating ? "currentColor" : "none"}
          style={{ opacity: n <= rating ? 1 : 0.4 }}
        />
      ))}
    </span>
  );
}

function StarPicker({ value, onChange }) {
  return (
    <div className="pld-rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`pld-star${value >= n ? " is-on" : ""}`}
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <Star size={17} strokeWidth={2} fill={value >= n ? "currentColor" : "none"} />
        </button>
      ))}
    </div>
  );
}

function ChipToggle({ on, onClick, children }) {
  return (
    <button type="button" className={`pld-chip${on ? " is-on" : ""}`} onClick={onClick}>
      {on && <Check size={12} strokeWidth={3} />}
      {children}
    </button>
  );
}

function SectionCard({ icon: Icon, title, children, action }) {
  return (
    <div className="pld-card">
      <div className="pld-card-head">
        <div className="pld-card-head-left">
          <div className="pld-card-head-icon">
            <Icon size={17} strokeWidth={2.25} />
          </div>
          <h4>{title}</h4>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function ModalActions({ onCancel, submitLabel, onSubmit, disabled, saving, danger }) {
  return (
    <div className="pld-modal-actions">
      <button className="btn btn-outline" onClick={onCancel} disabled={saving}>
        Cancel
      </button>
      <button
        className={`btn ${danger ? "btn-danger" : "btn-primary"}`}
        onClick={onSubmit}
        disabled={disabled || saving}
      >
        {saving ? <Spinner small /> : submitLabel}
      </button>
    </div>
  );
}

/* ================================================================
   Main page
   ================================================================ */
export default function PlacementDetail() {
  const { id } = useParams();
  const toast = useToast();
  const [tab, setTab] = useState("overview");
  const [tick, setTick] = useState(0);

  const { data: placement, loading, error } = useFetch(
    () => (id ? api.get(`/placements/${id}/`) : Promise.resolve({ data: null })),
    [id, tick]
  );

  if (!id) {
    return (
      <div className="page">
        <Alert>Missing placement id in the URL.</Alert>
      </div>
    );
  }

  if (loading) return <PageLoader />;

  if (error || !placement) {
    const status = error?.response?.status;
    const detail =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      errorMessage(error) ||
      (error ? "Request failed." : "No data returned.");
    return (
      <div className="page">
        <Alert>
          <strong>Could not load placement.</strong>{" "}
          {status ? `(HTTP ${status}) ` : ""}
          {detail}
        </Alert>
      </div>
    );
  }

  const tabs = [
    { key: "overview", label: "Overview", icon: ClipboardList },
    {
      key: "plans",
      label: "Learning Plans",
      icon: Route,
      count: (placement.learning_plans || []).length,
    },
    {
      key: "activities",
      label: "Activities",
      icon: CalendarDays,
      count: (placement.activities || []).length,
    },
    {
      key: "reviews",
      label: "Reviews",
      icon: MessageSquare,
      count: (placement.reviews || []).length,
    },
    {
      key: "assessments",
      label: "Assessments",
      icon: Target,
      count: (placement.assessments || []).length,
    },
    { key: "completion", label: "Completion", icon: Award },
    {
      key: "feedback",
      label: "Feedback",
      icon: Star,
      count: (placement.feedback || []).length,
    },
  ];

  const period = `${fmtDate(placement.start_date)} → ${fmtDate(
    placement.expected_end_date || placement.actual_end_date
  )}`;

  return (
    <div className="page">
      <header className="pld-header">
        <div className="pld-header-main">
          <h2>{placement.opportunity_title}</h2>
          <div className="pld-meta">
            <span className="pld-meta-item">
              <Users size={13} strokeWidth={2.25} />
              {placement.trainee_name || `Trainee #${placement.trainee}`}
            </span>
            <span className="pld-meta-sep" />
            <span className="pld-meta-item">
              <CalendarDays size={13} strokeWidth={2.25} />
              {period}
            </span>
            {placement.supervisor_name && (
              <>
                <span className="pld-meta-sep" />
                <span className="pld-meta-item">
                  <UserCog size={13} strokeWidth={2.25} />
                  {placement.supervisor_name}
                </span>
              </>
            )}
          </div>
        </div>
        <StatusBadge status={placement.status} />
      </header>

      <nav className="pld-tabs">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              className={`pld-tab${tab === t.key ? " active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              <Icon size={14} strokeWidth={2.25} />
              {t.label}
              {typeof t.count === "number" && t.count > 0 && (
                <span className="pld-tab-count">{t.count}</span>
              )}
            </button>
          );
        })}
      </nav>

      {tab === "overview" && (
        <OverviewTab placement={placement} tick={setTick} toast={toast} />
      )}
      {tab === "plans" && (
        <PlansTab placement={placement} tick={setTick} toast={toast} />
      )}
      {tab === "activities" && (
        <ActivitiesTab placement={placement} tick={setTick} toast={toast} />
      )}
      {tab === "reviews" && (
        <ReviewsTab placement={placement} tick={setTick} toast={toast} />
      )}
      {tab === "assessments" && (
        <AssessmentsTab placement={placement} tick={setTick} toast={toast} />
      )}
      {tab === "completion" && (
        <CompletionTab placement={placement} tick={setTick} toast={toast} />
      )}
      {tab === "feedback" && <FeedbackTab placement={placement} />}
    </div>
  );
}

/* ================================================================
   Shared hook
   ================================================================ */
function usePlacementActions(placement, tick, toast) {
  const { loading, run } = useAsyncAction();
  const act = (action, payload = {}) =>
    run(() => api.post(`/placements/${placement.id}/${action}/`, payload), {
      onSuccess: (res) => {
        toast.success(res.data.detail || "Done.");
        tick((t) => t + 1);
      },
      onError: (err) => toast.error(errorMessage(err)),
    });
  return { loading, act };
}

/* ================================================================
   Overview
   ================================================================ */
function OverviewTab({ placement, tick, toast }) {
  const { loading, act } = usePlacementActions(placement, tick, toast);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const { data: members } = useFetch(() => api.get("/organizations/me/members/"));

  const supervisors = (members?.results || []).filter((m) => m.is_active);
  const active =
    placement.status === "ACTIVE" || placement.status === "EXTENDED";

  const open = (name) => {
    setForm({});
    setModal(name);
  };

  const submit = () => {
    if (modal === "extend")
      return act("extend", { new_end_date: form.new_end_date });
    if (modal === "assign")
      return act("assign-supervisor", {
        supervisor_id: Number(form.supervisor_id),
      });
    if (modal === "complete")
      return act("complete", {
        actual_end_date: form.actual_end_date || undefined,
      });
    if (modal === "discontinue")
      return act("discontinue", {
        actual_end_date: form.actual_end_date || undefined,
        reason: form.reason || "",
      });
    return null;
  };

  return (
    <div className="pld-tab-body">
      <SectionCard
        icon={ClipboardList}
        title="Placement details"
        action={
          placement.application && (
            <Link
              className="btn btn-outline btn-sm"
              to={`/app/org/applications/${placement.application}`}
            >
              <FileText size={13} strokeWidth={2.5} /> View application
            </Link>
          )
        }
      >
        <div className="pld-details">
          <div className="pld-detail">
            <span className="pld-detail-label">Compensation</span>
            <span className="pld-detail-value">
              {placement.compensation} {fmtMoney(placement.stipend_amount)}
            </span>
          </div>
          <div className="pld-detail">
            <span className="pld-detail-label">
              <UserCog size={12} strokeWidth={2.5} /> Supervisor
            </span>
            <span
              className={`pld-detail-value${
                placement.supervisor_name ? "" : " is-muted"
              }`}
            >
              {placement.supervisor_name || "Not assigned"}
            </span>
          </div>
          <div className="pld-detail">
            <span className="pld-detail-label">
              <CalendarDays size={12} strokeWidth={2.5} /> Started
            </span>
            <span className="pld-detail-value">
              {fmtDate(placement.start_date) || "Not confirmed"}
            </span>
          </div>
          <div className="pld-detail">
            <span className="pld-detail-label">
              <Hourglass size={12} strokeWidth={2.5} /> Expected end
            </span>
            <span className="pld-detail-value">
              {fmtDate(placement.expected_end_date) || "Not set"}
            </span>
          </div>
        </div>

        <div className="pld-actions">
          {placement.status === "PENDING_CONFIRMATION" && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() =>
                act("confirm-start", {
                  start_date: new Date().toISOString().slice(0, 10),
                })
              }
              disabled={loading}
            >
              <CheckCircle2 size={14} strokeWidth={2.5} /> Confirm start
            </button>
          )}
          {active && (
            <>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => open("assign")}
              >
                <UserCog size={14} strokeWidth={2.5} /> Assign supervisor
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => open("extend")}
              >
                <CalendarPlus size={14} strokeWidth={2.5} /> Extend
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => open("complete")}
              >
                <Flag size={14} strokeWidth={2.5} /> Mark complete
              </button>
              <button
                className="btn btn-outline btn-sm is-danger"
                onClick={() => open("discontinue")}
              >
                <Ban size={14} strokeWidth={2.5} /> Discontinue
              </button>
            </>
          )}
        </div>
      </SectionCard>

      {modal === "assign" && (
        <Modal title="Assign supervisor" onClose={() => setModal(null)}>
          <label className="pld-field" style={{ marginBottom: 16 }}>
            <span className="pld-field-label">Supervisor</span>
            <select
              className="input"
              value={form.supervisor_id || ""}
              onChange={(e) =>
                setForm({ ...form, supervisor_id: e.target.value })
              }
            >
              <option value="">Select a team member…</option>
              {supervisors.map((m) => (
                <option key={m.id} value={m.user}>
                  {m.user_name}
                </option>
              ))}
            </select>
          </label>
          <ModalActions
            onCancel={() => setModal(null)}
            submitLabel={
              <>
                <UserCog size={14} strokeWidth={2.5} /> Assign
              </>
            }
            onSubmit={submit}
            disabled={!form.supervisor_id}
            saving={loading}
          />
        </Modal>
      )}

      {modal === "extend" && (
        <Modal title="Extend placement" onClose={() => setModal(null)}>
          <label className="pld-field" style={{ marginBottom: 16 }}>
            <span className="pld-field-label">New expected end date</span>
            <input
              type="date"
              className="input"
              value={form.new_end_date || ""}
              onChange={(e) =>
                setForm({ ...form, new_end_date: e.target.value })
              }
            />
          </label>
          <ModalActions
            onCancel={() => setModal(null)}
            submitLabel={
              <>
                <CalendarPlus size={14} strokeWidth={2.5} /> Extend
              </>
            }
            onSubmit={submit}
            disabled={!form.new_end_date}
            saving={loading}
          />
        </Modal>
      )}

      {modal === "complete" && (
        <Modal title="Complete placement" onClose={() => setModal(null)}>
          <label className="pld-field" style={{ marginBottom: 16 }}>
            <span className="pld-field-label">
              Actual end date (optional)
            </span>
            <input
              type="date"
              className="input"
              value={form.actual_end_date || ""}
              onChange={(e) =>
                setForm({ ...form, actual_end_date: e.target.value })
              }
            />
          </label>
          <ModalActions
            onCancel={() => setModal(null)}
            submitLabel={
              <>
                <CheckCircle2 size={14} strokeWidth={2.5} /> Mark completed
              </>
            }
            onSubmit={submit}
            saving={loading}
          />
        </Modal>
      )}

      {modal === "discontinue" && (
        <Modal title="Discontinue placement" onClose={() => setModal(null)}>
          <label className="pld-field" style={{ marginBottom: 16 }}>
            <span className="pld-field-label">
              Reason <span className="req">*</span>
            </span>
            <textarea
              className="input"
              rows={2}
              value={form.reason || ""}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />
          </label>
          <label className="pld-field" style={{ marginBottom: 16 }}>
            <span className="pld-field-label">
              Actual end date (optional)
            </span>
            <input
              type="date"
              className="input"
              value={form.actual_end_date || ""}
              onChange={(e) =>
                setForm({ ...form, actual_end_date: e.target.value })
              }
            />
          </label>
          <ModalActions
            onCancel={() => setModal(null)}
            submitLabel={
              <>
                <Ban size={14} strokeWidth={2.5} /> Discontinue
              </>
            }
            onSubmit={submit}
            disabled={!form.reason}
            saving={loading}
            danger
          />
        </Modal>
      )}
    </div>
  );
}

/* ================================================================
   Learning plans
   ================================================================ */
function PlansTab({ placement, tick, toast }) {
  const { loading, run } = useAsyncAction();
  const [showPlan, setShowPlan] = useState(false);
  const [planForm, setPlanForm] = useState({ title: "", description: "" });
  const [showObjective, setShowObjective] = useState(null);
  const [objectiveForm, setObjectiveForm] = useState({
    description: "",
    target_date: "",
    status: "PENDING",
    skill_ids: [],
  });
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    api
      .get("/skills/")
      .then((res) => setCatalog(res.data.results || res.data || []))
      .catch(() => {});
  }, []);

  const createPlan = () =>
    run(() => api.post(`/placements/${placement.id}/learning-plans/`, planForm), {
      onSuccess: () => {
        toast.success("Learning plan created.");
        setShowPlan(false);
        setPlanForm({ title: "", description: "" });
        tick((t) => t + 1);
      },
      onError: (err) => toast.error(errorMessage(err)),
    });

  const createObjective = () =>
    run(
      () =>
        api.post(
          `/placements/${placement.id}/learning-plans/${showObjective}/objectives/`,
          {
            ...objectiveForm,
            skill_ids: objectiveForm.skill_ids.map(Number),
          }
        ),
      {
        onSuccess: () => {
          toast.success("Objective added.");
          setShowObjective(null);
          setObjectiveForm({
            description: "",
            target_date: "",
            status: "PENDING",
            skill_ids: [],
          });
          tick((t) => t + 1);
        },
        onError: (err) => toast.error(errorMessage(err)),
      }
    );

  const setObjectiveStatus = (objectiveId, status) =>
    run(
      () =>
        api.patch(`/placements/${placement.id}/objectives/${objectiveId}/`, {
          status,
        }),
      {
        onSuccess: () => {
          toast.success("Objective updated.");
          tick((t) => t + 1);
        },
        onError: (err) => toast.error(errorMessage(err)),
      }
    );

  const toggleSkill = (skillId) =>
    setObjectiveForm((f) => ({
      ...f,
      skill_ids: f.skill_ids.includes(skillId)
        ? f.skill_ids.filter((s) => s !== skillId)
        : [...f.skill_ids, skillId],
    }));

  const plans = placement.learning_plans || [];

  return (
    <div className="pld-tab-body">
      <div className="row between wrap" style={{ gap: 12 }}>
        <p className="pld-card-sub" style={{ margin: 0, flex: 1 }}>
          Define what the participant should learn and track progress towards
          each objective.
        </p>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowPlan(true)}
        >
          <Plus size={14} strokeWidth={2.5} /> New plan
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="pld-card">
          <EmptyState
            icon="fa-route"
            title="No learning plans yet"
            text="Create a plan with objectives for this placement."
          />
        </div>
      ) : (
        plans.map((plan) => (
          <SectionCard
            key={plan.id}
            icon={Route}
            title={plan.title}
            action={
              <button
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setShowObjective(plan.id);
                  setObjectiveForm({
                    description: "",
                    target_date: "",
                    status: "PENDING",
                    skill_ids: [],
                  });
                }}
              >
                <Plus size={13} strokeWidth={2.5} /> Objective
              </button>
            }
          >
            {plan.description && (
              <p className="pld-plan-desc">{plan.description}</p>
            )}

            {(plan.objectives || []).length === 0 ? (
              <p className="pld-empty-inline">No objectives yet.</p>
            ) : (
              <div className="pld-objectives">
                {(plan.objectives || []).map((obj) => (
                  <div key={obj.id} className="pld-objective">
                    <div className="pld-objective-main">
                      <div className="pld-objective-desc">{obj.description}</div>
                      <div className="pld-objective-meta">
                        <CalendarDays size={11} strokeWidth={2.5} />
                        Target: {fmtDate(obj.target_date)}
                      </div>
                      {(obj.skill_names || []).length > 0 && (
                        <div className="pld-objective-skills">
                          {obj.skill_names.map((s) => (
                            <span key={s} className="pld-skill-pill">
                              <Target size={10} strokeWidth={3} /> {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <select
                      className="pld-status-select"
                      value={obj.status}
                      onChange={(e) =>
                        setObjectiveStatus(obj.id, e.target.value)
                      }
                    >
                      {["PENDING", "IN_PROGRESS", "ACHIEVED"].map((s) => (
                        <option key={s} value={s}>
                          {statusBadge(s).label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        ))
      )}

      {showPlan && (
        <Modal title="New learning plan" onClose={() => setShowPlan(false)}>
          <label className="pld-field" style={{ marginBottom: 14 }}>
            <span className="pld-field-label">
              Title <span className="req">*</span>
            </span>
            <input
              className="input"
              value={planForm.title}
              onChange={(e) =>
                setPlanForm({ ...planForm, title: e.target.value })
              }
              placeholder="e.g. Data Analysis Fundamentals"
            />
          </label>
          <label className="pld-field" style={{ marginBottom: 16 }}>
            <span className="pld-field-label">Description</span>
            <textarea
              className="input"
              rows={2}
              value={planForm.description}
              onChange={(e) =>
                setPlanForm({ ...planForm, description: e.target.value })
              }
            />
          </label>
          <ModalActions
            onCancel={() => setShowPlan(false)}
            submitLabel="Create plan"
            onSubmit={createPlan}
            disabled={!planForm.title}
            saving={loading}
          />
        </Modal>
      )}

      {showObjective && (
        <Modal
          title="Add learning objective"
          onClose={() => setShowObjective(null)}
        >
          <label className="pld-field" style={{ marginBottom: 14 }}>
            <span className="pld-field-label">
              Description <span className="req">*</span>
            </span>
            <textarea
              className="input"
              rows={2}
              value={objectiveForm.description}
              onChange={(e) =>
                setObjectiveForm({
                  ...objectiveForm,
                  description: e.target.value,
                })
              }
            />
          </label>
          <label className="pld-field" style={{ marginBottom: 14 }}>
            <span className="pld-field-label">Target date</span>
            <input
              type="date"
              className="input"
              value={objectiveForm.target_date}
              onChange={(e) =>
                setObjectiveForm({
                  ...objectiveForm,
                  target_date: e.target.value,
                })
              }
            />
          </label>
          <div className="pld-field" style={{ marginBottom: 16 }}>
            <span className="pld-field-label">Skills</span>
            <div className="pld-chips">
              {catalog.map((s) => (
                <ChipToggle
                  key={s.id}
                  on={objectiveForm.skill_ids.includes(s.id)}
                  onClick={() => toggleSkill(s.id)}
                >
                  {s.name}
                </ChipToggle>
              ))}
            </div>
          </div>
          <ModalActions
            onCancel={() => setShowObjective(null)}
            submitLabel="Add objective"
            onSubmit={createObjective}
            disabled={!objectiveForm.description}
            saving={loading}
          />
        </Modal>
      )}
    </div>
  );
}

/* ================================================================
   Activities
   ================================================================ */
function ActivitiesTab({ placement, tick, toast }) {
  const { loading, run } = useAsyncAction();
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    activity: "",
    hours: 4,
  });

  const add = () =>
    run(() => api.post(`/placements/${placement.id}/activities/`, form), {
      onSuccess: () => {
        toast.success("Activity recorded.");
        setForm({
          date: new Date().toISOString().slice(0, 10),
          activity: "",
          hours: 4,
        });
        tick((t) => t + 1);
      },
      onError: (err) => toast.error(errorMessage(err)),
    });

  const activities = placement.activities || [];

  return (
    <div className="pld-tab-body">
      <SectionCard icon={CalendarDays} title="Record activity">
        <div className="pld-activity-form">
          <label className="pld-field">
            <span className="pld-field-label">Date</span>
            <input
              type="date"
              className="input"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </label>
          <label className="pld-field">
            <span className="pld-field-label">
              Activity <span className="req">*</span>
            </span>
            <input
              className="input"
              value={form.activity}
              onChange={(e) => setForm({ ...form, activity: e.target.value })}
              placeholder="e.g. Attended field survey"
            />
          </label>
          <label className="pld-field">
            <span className="pld-field-label">Hours</span>
            <input
              className="input"
              type="number"
              min="0"
              step="0.5"
              value={form.hours}
              onChange={(e) => setForm({ ...form, hours: e.target.value })}
            />
          </label>
        </div>
        <button
          className="btn btn-primary btn-sm"
          disabled={!form.activity || loading}
          onClick={add}
        >
          {loading ? (
            <Spinner small />
          ) : (
            <>
              <Plus size={14} strokeWidth={2.5} /> Record
            </>
          )}
        </button>
      </SectionCard>

      {activities.length === 0 ? (
        <p className="pld-empty-inline">No activities recorded yet.</p>
      ) : (
        <div className="pld-card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="table-wrap" style={{ borderRadius: 0, border: "none" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Activity</th>
                  <th>Hours</th>
                  <th>Recorded by</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a) => (
                  <tr key={a.id}>
                    <td>{fmtDate(a.date)}</td>
                    <td>{a.activity}</td>
                    <td>{a.hours}</td>
                    <td className="small">{a.recorded_by_name || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   Reviews
   ================================================================ */
function ReviewsTab({ placement, tick, toast }) {
  const { loading, run } = useAsyncAction();
  const [form, setForm] = useState({ comments: "", rating: 3 });

  const add = () =>
    run(() => api.post(`/placements/${placement.id}/reviews/`, form), {
      onSuccess: () => {
        toast.success("Review added.");
        setForm({ comments: "", rating: 3 });
        tick((t) => t + 1);
      },
      onError: (err) => toast.error(errorMessage(err)),
    });

  const reviews = placement.reviews || [];

  return (
    <div className="pld-tab-body">
      <SectionCard icon={MessageSquare} title="Add progress review">
        <div className="pld-field" style={{ marginBottom: 14 }}>
          <span className="pld-field-label">Rating</span>
          <StarPicker
            value={form.rating}
            onChange={(r) => setForm({ ...form, rating: r })}
          />
        </div>
        <label className="pld-field" style={{ marginBottom: 14 }}>
          <span className="pld-field-label">
            Comments <span className="req">*</span>
          </span>
          <textarea
            className="input"
            rows={2}
            value={form.comments}
            onChange={(e) => setForm({ ...form, comments: e.target.value })}
          />
        </label>
        <button
          className="btn btn-primary btn-sm"
          disabled={!form.comments || loading}
          onClick={add}
        >
          {loading ? (
            <Spinner small />
          ) : (
            <>
              <Send size={13} strokeWidth={2.5} /> Add review
            </>
          )}
        </button>
      </SectionCard>

      {reviews.length === 0 ? (
        <p className="pld-empty-inline">No reviews yet.</p>
      ) : (
        reviews.map((r) => (
          <div key={r.id} className="pld-card pld-review">
            <div className="pld-review-head">
              <div className="pld-review-author">
                <div className="pld-review-avatar">
                  {initialsFor(r.reviewer_name || "Reviewer")}
                </div>
                <div>
                  <div className="pld-review-name">
                    {r.reviewer_name || "Reviewer"}
                  </div>
                  <div className="pld-review-time">Review</div>
                </div>
              </div>
              <StarDisplay rating={r.rating} />
            </div>
            <p className="pld-review-body">{r.comments}</p>
          </div>
        ))
      )}
    </div>
  );
}

/* ================================================================
   Assessments
   ================================================================ */
function AssessmentsTab({ placement, tick, toast }) {
  const { loading, run } = useAsyncAction();
  const [form, setForm] = useState({ overall_rating: 3, comments: "" });
  const [ratings, setRatings] = useState([]);
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    api
      .get("/skills/")
      .then((res) => setCatalog(res.data.results || res.data || []))
      .catch(() => {});
  }, []);

  const toggleSkill = (skillId) =>
    setRatings((rs) =>
      rs.some((r) => r.skill_id === skillId)
        ? rs.filter((r) => r.skill_id !== skillId)
        : [...rs, { skill_id: skillId, rating: 3, comments: "" }]
    );

  const setRating = (skillId, patch) =>
    setRatings((rs) =>
      rs.map((r) => (r.skill_id === skillId ? { ...r, ...patch } : r))
    );

  const add = () =>
    run(
      () =>
        api.post(`/placements/${placement.id}/assessments/`, {
          ...form,
          skill_ratings: ratings,
        }),
      {
        onSuccess: () => {
          toast.success("Assessment recorded.");
          setForm({ overall_rating: 3, comments: "" });
          setRatings([]);
          tick((t) => t + 1);
        },
        onError: (err) => toast.error(errorMessage(err)),
      }
    );

  const assessments = placement.assessments || [];

  return (
    <div className="pld-tab-body">
      <SectionCard icon={Target} title="New assessment">
        <div className="pld-field" style={{ marginBottom: 14 }}>
          <span className="pld-field-label">Overall rating</span>
          <StarPicker
            value={form.overall_rating}
            onChange={(r) => setForm({ ...form, overall_rating: r })}
          />
        </div>

        <label className="pld-field" style={{ marginBottom: 14 }}>
          <span className="pld-field-label">Comments</span>
          <textarea
            className="input"
            rows={2}
            value={form.comments}
            onChange={(e) => setForm({ ...form, comments: e.target.value })}
          />
        </label>

        <div className="pld-field" style={{ marginBottom: 14 }}>
          <span className="pld-field-label">Rate skills (optional)</span>
          <div className="pld-chips">
            {catalog.map((s) => (
              <ChipToggle
                key={s.id}
                on={ratings.some((r) => r.skill_id === s.id)}
                onClick={() => toggleSkill(s.id)}
              >
                {s.name}
              </ChipToggle>
            ))}
          </div>
        </div>

        {ratings.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 14,
            }}
          >
            {ratings.map((r) => (
              <div key={r.skill_id} className="pld-skill-rate-row">
                <span className="pld-skill-rate-name">
                  {catalog.find((s) => s.id === r.skill_id)?.name}
                </span>
                <select
                  className="pld-status-select"
                  value={r.rating}
                  onChange={(e) =>
                    setRating(r.skill_id, { rating: Number(e.target.value) })
                  }
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} / 5
                    </option>
                  ))}
                </select>
                <input
                  className="input"
                  style={{ flex: 1, padding: "7px 10px", fontSize: "0.82rem" }}
                  placeholder="Note"
                  value={r.comments}
                  onChange={(e) =>
                    setRating(r.skill_id, { comments: e.target.value })
                  }
                />
              </div>
            ))}
          </div>
        )}

        <button
          className="btn btn-primary btn-sm"
          disabled={loading}
          onClick={add}
        >
          {loading ? (
            <Spinner small />
          ) : (
            <>
              <CheckCircle2 size={14} strokeWidth={2.5} /> Record assessment
            </>
          )}
        </button>
      </SectionCard>

      {assessments.length === 0 ? (
        <p className="pld-empty-inline">No assessments yet.</p>
      ) : (
        assessments.map((a) => (
          <div key={a.id} className="pld-card pld-review">
            <div className="pld-review-head">
              <div className="pld-review-author">
                <div className="pld-review-avatar">
                  {initialsFor(a.assessed_by_name || "Assessor")}
                </div>
                <div>
                  <div className="pld-review-name">
                    {a.assessed_by_name || "Assessor"}
                  </div>
                  <div className="pld-review-time">
                    {fmtDate(a.created_at, true)}
                  </div>
                </div>
              </div>
              <StarDisplay rating={a.overall_rating} />
            </div>
            {a.comments && <p className="pld-review-body">{a.comments}</p>}
            {(a.skill_ratings || []).length > 0 && (
              <div className="pld-skill-summary">
                {(a.skill_ratings || []).map((sr) => (
                  <span key={sr.id} className="pld-skill-summary-pill">
                    <Star size={10} strokeWidth={3} />
                    {sr.skill_name}: {sr.rating}/5
                  </span>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

/* ================================================================
   Completion
   ================================================================ */
function CompletionTab({ placement, tick, toast }) {
  const { loading, run } = useAsyncAction();
  const [summary, setSummary] = useState("");
  const [file, setFile] = useState(null);
  const record = placement.completion_record;

  const issue = () => {
    const body = new FormData();
    body.append("summary", summary);
    if (file) body.append("certificate_file", file);
    run(() => api.post(`/placements/${placement.id}/completion/`, body), {
      onSuccess: () => {
        toast.success("Completion record issued.");
        setSummary("");
        setFile(null);
        tick((t) => t + 1);
      },
      onError: (err) => toast.error(errorMessage(err)),
    });
  };

  if (record) {
    return (
      <div className="pld-tab-body">
        <SectionCard icon={Award} title="Completion record">
          <p className="pld-review-body" style={{ marginBottom: 12 }}>
            {record.summary || "No summary provided."}
          </p>
          <div className="row wrap gap-8" style={{ marginBottom: 14 }}>
            <span
              className={`pld-completion-badge ${
                record.verified ? "is-verified" : "is-pending"
              }`}
            >
              {record.verified ? (
                <>
                  <CheckCircle2 size={12} strokeWidth={2.5} /> Verified
                </>
              ) : (
                <>
                  <Hourglass size={12} strokeWidth={2.5} /> Pending verification
                </>
              )}
            </span>
            <span
              className="pld-detail-value is-muted"
              style={{ fontSize: "0.8rem" }}
            >
              Issued {fmtDate(record.issued_at, true)}
            </span>
          </div>
          {record.download_url && (
            <a
              className="btn btn-primary btn-sm"
              href={record.download_url}
              target="_blank"
              rel="noreferrer"
            >
              <Download size={14} strokeWidth={2.5} /> Download certificate
            </a>
          )}
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="pld-tab-body">
      <SectionCard icon={Award} title="Issue completion record">
        <p className="pld-card-sub">
          Issued records are attached to the participant's passport after
          verification.
        </p>
        <label className="pld-field" style={{ marginBottom: 14 }}>
          <span className="pld-field-label">
            Summary <span className="req">*</span>
          </span>
          <textarea
            className="input"
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="What did the participant accomplish?"
          />
        </label>
        <label className="pld-field" style={{ marginBottom: 16 }}>
          <span className="pld-field-label">
            Certificate file (PDF, optional)
          </span>
          <input
            type="file"
            className="input"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>
        <button
          className="btn btn-primary"
          disabled={!summary.trim() || loading}
          onClick={issue}
        >
          {loading ? (
            <Spinner small />
          ) : (
            <>
              <UploadCloud size={14} strokeWidth={2.5} /> Issue record
            </>
          )}
        </button>
      </SectionCard>
    </div>
  );
}

/* ================================================================
   Feedback
   ================================================================ */
function FeedbackTab({ placement }) {
  const feedback = placement.feedback || [];
  return (
    <div className="pld-tab-body">
      {feedback.length === 0 ? (
        <p className="pld-empty-inline">
          The participant has not submitted feedback yet.
        </p>
      ) : (
        feedback.map((f) => (
          <div key={f.id} className="pld-card pld-review">
            <div className="pld-review-head">
              <div className="pld-review-author">
                <div className="pld-review-avatar">
                  {initialsFor(f.author_name || "Participant")}
                </div>
                <div>
                  <div className="pld-review-name">
                    {f.author_name || "Participant"}
                  </div>
                  <div className="pld-review-time">
                    {fmtDate(f.created_at, true)}
                  </div>
                </div>
              </div>
              <StarDisplay rating={f.rating} />
            </div>
            <p className="pld-review-body">{f.comments}</p>
          </div>
        ))
      )}
    </div>
  );
}