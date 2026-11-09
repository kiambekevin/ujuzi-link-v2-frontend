import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TopBar from "../components/layout/TopBar.jsx";
import BrandRow from "../components/layout/BrandRow.jsx";
import MainNav from "../components/layout/MainNav.jsx";
import Footer from "../components/layout/Footer.jsx";
import SearchModal from "../components/ui/SearchModal.jsx";
import ApplySteps from "../components/apply/ApplySteps.jsx";
import StepPersonal from "../components/apply/StepPersonal.jsx";
import StepEducation from "../components/apply/StepEducation.jsx";
import StepWorkExperience from "../components/apply/StepWorkExperience.jsx";
import StepDocuments from "../components/apply/StepDocuments.jsx";
import StepReview from "../components/apply/StepReview.jsx";
import ApplySidebar from "../components/apply/ApplySidebar.jsx";
import ApplySuccess from "../components/apply/ApplySuccess.jsx";
import { api, errorMessage, isAuthenticated } from "../api/client";
import "../styles/home.css";
import "../styles/apply.css";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TYPE_CLASS = {
  APPRENTICESHIP: "apprenticeship",
  INTERNSHIP: "internship",
  INDUSTRIAL_ATTACHMENT: "attachment",
  PUPILLAGE: "pupillage",
  COMMUNITY_SERVICE: "community",
  VOLUNTEER: "volunteer",
  INDUSTRY_VISIT: "visit",
  JOB_SHADOWING: "shadowing",
  OTHER: "other",
};

function orgName(opp) {
  if (!opp) return "Verified employer";
  if (typeof opp.organization === "string") return opp.organization;
  if (opp.organization_name) return opp.organization_name;
  if (opp.organization?.name) return opp.organization.name;
  return "Verified employer";
}

const EMPTY_FORM = {
  // personal
  firstName: "",
  lastName: "",
  middleName: "",
  email: "",
  phone: "",
  county: "",
  city: "",
  bio: "",
  gender: "",
  dob: "",
  nationality: "Kenyan",
  idNumber: "",
  passportNumber: "",
  guardianConsent: false,
  guardianFullName: "",
  // education (first row, back-compat)
  institution: "",
  regNumber: "",
  course: "",
  level: "",
  qualification: "",
  description: "",
  yearStart: "",
  yearEnd: "",
  skills: "",
  qualifications: [],
  // cover letter + consents
  coverLetter: "",
  dataConsent: false,
  accurateConsent: false,
  finalConsent: false,
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ApplyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  const [opp, setOpp] = useState(null);
  const [oppLoading, setOppLoading] = useState(true);
  const [oppError, setOppError] = useState("");
  const [me, setMe] = useState(null);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [existingDocs, setExistingDocs] = useState([]);
  const [educationEntries, setEducationEntries] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [certificationsList, setCertificationsList] = useState([]);
  const [workExperiences, setWorkExperiences] = useState([]);
  const [skillCatalogue, setSkillCatalogue] = useState([]);
  const [uploadingDocType, setUploadingDocType] = useState(null);

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submittedApp, setSubmittedApp] = useState(null);

  const updateField = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // ---- Auth + role gate ---------------------------------------------------
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(`/login?next=${encodeURIComponent(`/apply/${id}`)}`, { replace: true });
    }
  }, [id, navigate]);

  useEffect(() => {
    if (!isAuthenticated()) return;
    let cancelled = false;
    api.get("/auth/me/")
      .then(({ data }) => { if (!cancelled) setMe(data) })
      .catch(() => {});
    return () => { cancelled = true };
  }, []);

  const isTrainee = me?.role === "TRAINEE";

  useEffect(() => {
    if (me && !isTrainee) navigate("/opportunities", { replace: true });
  }, [me, isTrainee, navigate]);

  // ---- Opportunity -------------------------------------------------------
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    setOppLoading(true);
    setOppError("");

    api.get(`/opportunities/${id}/`, { signal: controller.signal })
      .then(({ data }) => {
        if (cancelled) return;
        setOpp({ ...data, organization_name: orgName(data) });
      })
      .catch((err) => {
        if (err?.name === "CanceledError" || err?.name === "AbortError") return;
        if (!cancelled) setOppError(errorMessage(err, "Unable to load this opportunity."));
      })
      .finally(() => { if (!cancelled) setOppLoading(false) });

    return () => { cancelled = true; controller.abort() };
  }, [id]);

  // ---- Hydrate profile, education, skills, certs, docs, experience -------
  useEffect(() => {
    if (!isAuthenticated() || !isTrainee) return;
    let cancelled = false;

    Promise.allSettled([
      api.get("/profile/"),
      api.get("/profile/education/"),
      api.get("/profile/documents/"),
      api.get("/profile/skills/"),
      api.get("/profile/certifications/"),
      api.get("/skills/?page_size=500"),
      api.get("/profile/experience/"),
    ]).then((results) => {
      if (cancelled) return;

      const [profileRes, eduRes, docsRes, skillsRes, certsRes, catalogueRes, expRes] = results;

      const pickList = (res) => {
        if (res.status !== "fulfilled") return [];
        const d = res.value?.data;
        if (Array.isArray(d)) return d;
        if (Array.isArray(d?.results)) return d.results;
        return [];
      };

      const profile = profileRes.status === "fulfilled" ? profileRes.value.data || {} : {};
      const eduList = pickList(eduRes);
      const docs = pickList(docsRes);
      const skillsArr = pickList(skillsRes);
      const certsArr = pickList(certsRes);
      const catalogue = pickList(catalogueRes);
      const expArr = pickList(expRes);

      setEducationEntries(eduList);
      setSkillsList(skillsArr);
      setCertificationsList(certsArr);
      setWorkExperiences(expArr);
      setSkillCatalogue(catalogue);
      setExistingDocs(docs);

      const edu0 = eduList[0] || {};
      setFormData((prev) => ({
        ...prev,
        // personal
        firstName: profile.first_name || prev.firstName,
        lastName: profile.last_name || prev.lastName,
        middleName: profile.middle_name || prev.middleName,
        email: profile.email || prev.email,
        phone: profile.phone || prev.phone,
        county: profile.county || prev.county,
        city: profile.city || prev.city,
        bio: profile.bio || prev.bio,
        gender: profile.gender || prev.gender,
        dob: profile.date_of_birth || prev.dob,
        nationality: profile.nationality || prev.nationality,
        idNumber: profile.national_id || prev.idNumber,
        passportNumber: profile.passport_no || prev.passportNumber,
        guardianConsent: Boolean(profile.guardian_consent) || prev.guardianConsent,
        guardianFullName: profile.guardian_full_name || prev.guardianFullName,

        // standing consents
        dataConsent: Boolean(profile.data_processing_consent) || prev.dataConsent,
        accurateConsent: Boolean(profile.accuracy_consent) || prev.accurateConsent,

        // first education row (used by review step for the summary)
        institution: edu0.institution || prev.institution,
        regNumber: edu0.registration_number || prev.regNumber,
        course: edu0.field_of_study || prev.course,
        level: edu0.level || prev.level,
        qualification: edu0.qualification || prev.qualification,
        description: edu0.description || prev.description,
        yearStart: (edu0.start_date || "").slice(0, 4) || prev.yearStart,
        yearEnd: (edu0.end_date || "").slice(0, 4) || prev.yearEnd,

        // summarised skills + certifications for the review block
        skills: skillsArr.map((s) => s.name || s.skill_name).filter(Boolean).join(", "),
        qualifications: certsArr.map((c) => c.title).filter(Boolean),
      }));
    });

    return () => { cancelled = true };
  }, [isTrainee]);

  // ---- Derived -----------------------------------------------------------
  const typeLabel = opp?.type_display || opp?.type || "";
  const typeClass = TYPE_CLASS[opp?.type] || "other";

  const requiredDocTypes = useMemo(() => {
    const raw = opp?.required_documents;
    if (Array.isArray(raw) && raw.length) return raw;
    return ["CV"];
  }, [opp]);

  const docsSatisfied = useMemo(() => {
    const have = new Set(existingDocs.map((d) => d.doc_type));
    return requiredDocTypes.every((t) => have.has(t));
  }, [existingDocs, requiredDocTypes]);

  const alreadyApplied = opp?.has_applied === true || opp?.has_applied === "true";
  const closed =
    opp?.is_open === false ||
    (opp?.closing_date && new Date(opp.closing_date) < new Date());

  // ---- Document upload / remove -----------------------------------------
  const handleUploadDocument = useCallback(async (docType, file) => {
    if (!file) return;
    setUploadingDocType(docType);
    try {
      const fd = new FormData();
      fd.append("doc_type", docType);
      fd.append("title", file.name.replace(/\.[^.]+$/, ""));
      fd.append("file", file);
      const { data } = await api.post("/profile/documents/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Append - multiple docs per type are supported.
      setExistingDocs((prev) => [...prev, data]);
    } catch (err) {
      alert(errorMessage(err, "Failed to upload document."));
    } finally {
      setUploadingDocType(null);
    }
  }, []);

  const handleRemoveDocument = useCallback(async (docId) => {
    try {
      await api.delete(`/profile/documents/${docId}/`);
      setExistingDocs((prev) => prev.filter((d) => d.id !== docId));
    } catch (err) {
      alert(errorMessage(err, "Could not remove that document."));
    }
  }, []);

  // ---- Education mutations ----------------------------------------------
  const handleSaveEducation = useCallback(async (entries) => {
    const saved = [];
    for (const entry of entries) {
      const payload = {
        institution: entry.institution,
        registration_number: entry.registration_number || "",
        level: entry.level || "Other",
        qualification: entry.qualification || "",
        field_of_study: entry.field_of_study || "",
        start_date: entry.start_date || null,
        end_date: entry.end_date || null,
        description: entry.description || "",
      };
      if (entry.id) {
        const { data } = await api.patch(`/profile/education/${entry.id}/`, payload);
        saved.push(data);
      } else {
        const { data } = await api.post("/profile/education/", payload);
        saved.push(data);
      }
    }
    setEducationEntries(saved);
    return saved;
  }, []);

  const handleRemoveEducation = useCallback(async (id) => {
    await api.delete(`/profile/education/${id}/`);
    setEducationEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  // ---- Skills -----------------------------------------------------------
  const handleAddSkill = useCallback(async (payload) => {
    const { data } = await api.post("/profile/skills/", payload);
    setSkillsList((prev) => [...prev, data]);
  }, []);

  const handleRemoveSkill = useCallback(async (id) => {
    await api.delete(`/profile/skills/${id}/`);
    setSkillsList((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // ---- Certifications ---------------------------------------------------
  const handleAddCertification = useCallback(async (payload) => {
    const { data } = await api.post("/profile/certifications/", payload);
    setCertificationsList((prev) => [...prev, data]);
  }, []);

  const handleRemoveCertification = useCallback(async (id) => {
    await api.delete(`/profile/certifications/${id}/`);
    setCertificationsList((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // ---- Work experience --------------------------------------------------
  const handleAddExperience = useCallback(async (payload) => {
    const { data } = await api.post("/profile/experience/", payload);
    setWorkExperiences((prev) => [data, ...prev]);
  }, []);

  const handleSaveExperience = useCallback(async (id, payload) => {
    const { data } = await api.patch(`/profile/experience/${id}/`, payload);
    setWorkExperiences((prev) => prev.map((w) => (w.id === id ? data : w)));
  }, []);

  const handleRemoveExperience = useCallback(async (id) => {
    await api.delete(`/profile/experience/${id}/`);
    setWorkExperiences((prev) => prev.filter((w) => w.id !== id));
  }, []);

  // ---- Persist standing profile bits ------------------------------------
  const persistStandingProfileBits = useCallback(async () => {
    const profilePayload = {};
    if (formData.nationality) profilePayload.nationality = formData.nationality;
    if (formData.bio) profilePayload.bio = formData.bio;
    if (formData.idNumber) profilePayload.national_id = formData.idNumber;
    if (formData.passportNumber) profilePayload.passport_no = formData.passportNumber;
    if (formData.city) profilePayload.city = formData.city;
    if (formData.gender) profilePayload.gender = formData.gender;
    if (formData.dob) profilePayload.date_of_birth = formData.dob;
    if (formData.county) profilePayload.county = formData.county;
    if (formData.firstName) profilePayload.first_name = formData.firstName;
    if (formData.middleName) profilePayload.middle_name = formData.middleName;
    if (formData.lastName) profilePayload.last_name = formData.lastName;
    if (formData.dataConsent) profilePayload.data_processing_consent = true;
    if (formData.accurateConsent) profilePayload.accuracy_consent = true;

    const age = (() => {
      if (!formData.dob) return null;
      const d = new Date(formData.dob);
      if (Number.isNaN(d.getTime())) return null;
      const t = new Date();
      let a = t.getFullYear() - d.getFullYear();
      const m = t.getMonth() - d.getMonth();
      if (m < 0 || (m === 0 && t.getDate() < d.getDate())) a -= 1;
      return a;
    })();
    if (age !== null && age < 18) {
      profilePayload.guardian_consent = Boolean(formData.guardianConsent);
      profilePayload.guardian_full_name = formData.guardianFullName || "";
    }

    if (Object.keys(profilePayload).length) {
      try { await api.patch("/profile/", profilePayload) } catch { /* non-fatal */ }
    }
  }, [formData]);

  // ---- Submit -----------------------------------------------------------
  const handleSubmit = useCallback(async () => {
    if (!formData.finalConsent) {
      alert("Please confirm the final declaration before submitting.");
      return;
    }
    if (!docsSatisfied) {
      alert("Please upload all required documents before submitting.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      await persistStandingProfileBits();

      const body = {
        cover_letter: formData.coverLetter || "",
        final_declaration_accepted: true,
        document_ids: existingDocs.map((d) => d.id).filter(Boolean),
      };

      const { data: applied } = await api.post(`/opportunities/${id}/apply/`, body);

      let app = applied;
      if (app?.id && !app?.status) {
        try {
          const { data: detail } = await api.get(`/applications/${app.id}/`);
          app = detail;
        } catch { /* keep what we have */ }
      }

      setSubmittedApp(app || { id: null, status: "SUBMITTED" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(errorMessage(err, "Could not submit your application."));
    } finally {
      setSubmitting(false);
    }
  }, [
    formData.finalConsent,
    formData.coverLetter,
    docsSatisfied,
    existingDocs,
    id,
    persistStandingProfileBits,
  ]);

  // ---- Render guards ----------------------------------------------------
  if (!isAuthenticated()) return null;

  if (oppLoading) {
    return (
      <>
        <TopBar /><BrandRow onSearchClick={() => setSearchOpen(true)} /><MainNav />
        <div className="page-body">
          <div className="container">
            <div className="apply-empty-state">
              <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
              <h3>Loading opportunity…</h3>
            </div>
          </div>
        </div>
        <Footer /><SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </>
    );
  }

  if (oppError || !opp) {
    return (
      <>
        <TopBar /><BrandRow onSearchClick={() => setSearchOpen(true)} /><MainNav />
        <div className="page-body">
          <div className="container">
            <div className="apply-empty-state">
              <i className="fas fa-circle-question" aria-hidden="true"></i>
              <h3>Opportunity not found</h3>
              <p>{oppError || "This opportunity may have closed or been removed."}</p>
              <button className="btn btn-primary" onClick={() => navigate("/opportunities")}>
                <i className="fas fa-arrow-left"></i> Back to opportunities
              </button>
            </div>
          </div>
        </div>
        <Footer /><SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </>
    );
  }

  if (alreadyApplied && !submittedApp) {
    return (
      <>
        <TopBar /><BrandRow onSearchClick={() => setSearchOpen(true)} /><MainNav />
        <header className="page-header" id="main-content">
          <div className="container">
            <div className="breadcrumb">
              <Link to="/">Home</Link>
              <i className="fas fa-chevron-right" />
              <Link to="/opportunities">Opportunities</Link>
              <i className="fas fa-chevron-right" />
              <Link to={`/opportunities/${opp.id}`}>{opp.title}</Link>
              <i className="fas fa-chevron-right" />
              <span>Apply</span>
            </div>
            <h1>You've already applied</h1>
            <p>
              You have an existing application for {opp.title} at{" "}
              <strong>{opp.organization_name}</strong>.
            </p>
          </div>
        </header>
        <div className="page-body">
          <div className="container">
            <div className="apply-empty-state">
              <i className="fas fa-info-circle" aria-hidden="true"></i>
              <h3>Application already on file</h3>
              <p>Track the status of this application from your dashboard.</p>
              <button className="btn btn-primary" onClick={() => navigate("/applications")}>
                <i className="fas fa-list-check"></i> View my applications
              </button>
            </div>
          </div>
        </div>
        <Footer /><SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </>
    );
  }

  if (closed && !submittedApp) {
    return (
      <>
        <TopBar /><BrandRow onSearchClick={() => setSearchOpen(true)} /><MainNav />
        <header className="page-header" id="main-content">
          <div className="container">
            <h1>Applications closed</h1>
            <p>
              {opp.title} at <strong>{opp.organization_name}</strong> is no
              longer accepting applications.
            </p>
          </div>
        </header>
        <div className="page-body">
          <div className="container">
            <div className="apply-empty-state">
              <i className="fas fa-lock" aria-hidden="true"></i>
              <h3>This opportunity is closed</h3>
              <p>Browse other opportunities that are still accepting applications.</p>
              <button className="btn btn-primary" onClick={() => navigate("/opportunities")}>
                <i className="fas fa-search"></i> Browse opportunities
              </button>
            </div>
          </div>
        </div>
        <Footer /><SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </>
    );
  }

  if (submittedApp) {
    return (
      <>
        <TopBar /><BrandRow onSearchClick={() => setSearchOpen(true)} /><MainNav />
        <header className="page-header" id="main-content">
          <div className="container">
            <h1>Application submitted</h1>
            <p>
              Thank you for applying to {opp.organization_name}. You will receive
              updates through the platform.
            </p>
          </div>
        </header>
        <div className="page-body">
          <div className="container">
            <ApplySuccess opp={opp} application={submittedApp} />
          </div>
        </div>
        <Footer /><SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </>
    );
  }

  // ---- Wizard -----------------------------------------------------------
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <TopBar /><BrandRow onSearchClick={() => setSearchOpen(true)} /><MainNav />

      <header className="page-header" id="main-content">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <i className="fas fa-chevron-right" />
            <Link to="/opportunities">Opportunities</Link>
            <i className="fas fa-chevron-right" />
            <Link to={`/opportunities/${opp.id}`}>{opp.title}</Link>
            <i className="fas fa-chevron-right" />
            <span>Apply</span>
          </div>
          <h1>Apply for this opportunity</h1>
          <p>
            Complete the form below to apply for the {opp.title} at{" "}
            <strong>{opp.organization_name}</strong>.
          </p>
        </div>
      </header>

      <div className="page-body">
        <div className="container">
          <div className="apply-layout">
            <div className="apply-main">
              <ApplySteps step={step} setStep={setStep} />

              <div className="apply-form-card">
                {step === 1 && (
                  <StepPersonal
                    data={formData}
                    updateField={updateField}
                    onNext={() => setStep(2)}
                  />
                )}
                {step === 2 && (
                  <StepEducation
                    data={formData}
                    updateField={updateField}
                    onNext={() => setStep(3)}
                    onPrev={() => setStep(1)}
                    educationEntries={educationEntries}
                    skills={skillsList}
                    certifications={certificationsList}
                    skillCatalogue={skillCatalogue}
                    onSaveEducation={handleSaveEducation}
                    onRemoveEducation={handleRemoveEducation}
                    onAddSkill={handleAddSkill}
                    onRemoveSkill={handleRemoveSkill}
                    onAddCertification={handleAddCertification}
                    onRemoveCertification={handleRemoveCertification}
                  />
                )}
                {step === 3 && (
                  <StepWorkExperience
                    experiences={workExperiences}
                    onAddExperience={handleAddExperience}
                    onSaveExperience={handleSaveExperience}
                    onRemoveExperience={handleRemoveExperience}
                    onNext={() => setStep(4)}
                    onPrev={() => setStep(2)}
                  />
                )}
                {step === 4 && (
                  <StepDocuments
                    data={formData}
                    updateField={updateField}
                    requiredDocTypes={requiredDocTypes}
                    existingDocs={existingDocs}
                    uploadingDocType={uploadingDocType}
                    onUploadDocument={handleUploadDocument}
                    onRemoveDocument={handleRemoveDocument}
                    onNext={() => setStep(5)}
                    onPrev={() => setStep(3)}
                  />
                )}
                {step === 5 && (
                  <StepReview
                    data={{ ...formData, workExperiences }}
                    updateField={updateField}
                    opp={opp}
                    docsSatisfied={docsSatisfied}
                    requiredDocTypes={requiredDocTypes}
                    existingDocs={existingDocs}
                    submitting={submitting}
                    submitError={submitError}
                    onPrev={() => setStep(4)}
                    onSubmit={handleSubmit}
                    onGoToStep={setStep}
                  />
                )}
              </div>
            </div>

            <ApplySidebar
              opp={opp}
              typeLabel={typeLabel}
              typeClass={typeClass}
              requiredDocTypes={requiredDocTypes}
              docsSatisfied={docsSatisfied}
            />
          </div>
        </div>
      </div>

      <Footer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}