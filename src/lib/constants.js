export const OPPORTUNITY_TYPES = [
  ["APPRENTICESHIP", "Apprenticeship"],
  ["INTERNSHIP", "Internship"],
  ["INDUSTRIAL_ATTACHMENT", "Industrial Attachment"],
  ["PUPILLAGE", "Pupillage"],
  ["COMMUNITY_SERVICE", "Community Service Learning"],
  ["VOLUNTEER", "Volunteer Opportunity"],
  ["INDUSTRY_VISIT", "Industry Visit"],
  ["JOB_SHADOWING", "Job Shadowing"],
  ["OTHER", "Other Approved Work-Based Learning"],
];

export const ORGANIZATION_TYPES = [
  ["COMPANY", "Private Company"],
  ["GOVERNMENT", "Government Institution"],
  ["NGO", "NGO / Non-Profit"],
  ["LAW_FIRM", "Law Firm"],
  ["EDUCATION", "Educational Institution"],
  ["FAITH_BASED", "Faith-Based Organisation"],
  ["OTHER", "Other"],
];

// Must match Sector.code values seeded on the backend. The org registration
// endpoint (`OrganizationRegisterSerializer.sectors = ListField(child=CharField())`)
// expects these codes, NOT primary keys.
export const SECTOR_OPTIONS = [
  { code: "AGRICULTURE", name: "Agriculture" },
  { code: "CONSTRUCTION", name: "Construction" },
  { code: "EDUCATION", name: "Education" },
  { code: "ENERGY", name: "Energy" },
  { code: "FINANCE", name: "Finance" },
  { code: "HEALTHCARE", name: "Healthcare" },
  { code: "HOSPITALITY", name: "Hospitality" },
  { code: "ICT", name: "ICT" },
  { code: "MANUFACTURING", name: "Manufacturing" },
  { code: "MEDIA", name: "Media" },
  { code: "PUBLIC_ADMIN", name: "Public Administration" },
  { code: "RETAIL", name: "Retail" },
  { code: "TRANSPORT", name: "Transport" },
  { code: "WATER", name: "Water & Sanitation" },
  { code: "OTHER", name: "Other" },
];

export const WORK_MODES = [
  ["ONSITE", "On-site"],
  ["REMOTE", "Remote"],
  ["HYBRID", "Hybrid"],
];

export const COMPENSATION_TYPES = [
  ["PAID", "Paid"],
  ["STIPEND", "Stipend"],
  ["UNPAID", "Unpaid"],
];

export const DURATION_UNITS = [
  ["WEEKS", "Weeks"],
  ["MONTHS", "Months"],
];

export const INTERVIEW_MODES = [
  ["IN_PERSON", "In Person"],
  ["PHONE", "Phone Call"],
  ["VIDEO", "Video Call"],
];

export const EDUCATION_LEVELS = [
  "Primary School", "Secondary School (KCSE)", "Certificate", "Diploma",
  "Bachelor's Degree", "Master's Degree", "Doctorate", "Other",
];

export const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

export const USER_DOCUMENT_TYPES = [
  ["CV", "CV / Resume"],
  ["ACADEMIC_CERTIFICATE", "Academic Certificate"],
  ["PROFESSIONAL_CERTIFICATE", "Professional Certificate"],
  ["NATIONAL_ID", "National ID / Passport"],
  ["OTHER", "Other"],
];

export const ORG_DOCUMENT_TYPES = [
  ["REGISTRATION_CERTIFICATE", "Registration Certificate"],
  ["TAX_COMPLIANCE", "Tax Compliance Certificate"],
  ["KRA_PIN", "KRA PIN Certificate"],
  ["DIRECTORS_CR12", "CR12 / Directors List"],
  ["SECTOR_LICENSE", "Sector / Professional Licence"],
  ["OTHER", "Other"],
];

export const COMPLAINT_CATEGORIES = [
  ["HARASSMENT", "Harassment / Abuse"],
  ["FRAUD", "Fraud / Misrepresentation"],
  ["EXPLOITATION", "Exploitation"],
  ["UNSAFE_PLACEMENT", "Unsafe Placement Conditions"],
  ["DISPUTE", "Dispute"],
  ["DATA_PRIVACY", "Data Privacy Concern"],
  ["OTHER", "Other"],
];

export const COMPLAINT_SUBJECTS = [
  ["ORGANIZATION", "Organisation"],
  ["USER", "User"],
  ["OPPORTUNITY", "Opportunity"],
  ["PLACEMENT", "Placement"],
];

export const KENYA_COUNTIES = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa",
  "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi",
  "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu", "Machakos",
  "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a",
  "Nairobi", "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri",
  "Samburu", "Siaya", "Taita-Taveta", "Tana River", "Tharaka-Nithi", "Trans Nzoia",
  "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot",
];

export const INDUSTRY_SECTORS = [
  "Agriculture", "Construction", "Education", "Energy", "Finance", "Healthcare",
  "Hospitality", "ICT", "Manufacturing", "Media", "Public Administration",
  "Retail", "Transport", "Water & Sanitation", "Other",
];

export const STATUS_META = {
  // Applications
  SUBMITTED: ["badge-blue", "Submitted"],
  UNDER_REVIEW: ["badge-amber", "Under Review"],
  SHORTLISTED: ["badge-purple", "Shortlisted"],
  REJECTED: ["badge-red", "Rejected"],
  OFFERED: ["badge-indigo", "Offered"],
  OFFER_ACCEPTED: ["badge-green", "Offer Accepted"],
  OFFER_DECLINED: ["badge-neutral", "Offer Declined"],
  WITHDRAWN: ["badge-neutral", "Withdrawn"],
  // Opportunities
  DRAFT: ["badge-neutral", "Draft"],
  PENDING_REVIEW: ["badge-amber", "Pending Review"],
  ACTIVE: ["badge-green", "Active"],
  PAUSED: ["badge-amber", "Paused"],
  CLOSED: ["badge-neutral", "Closed"],
  REMOVED: ["badge-red", "Removed"],
  EXPIRED: ["badge-neutral", "Expired"],
  // Organizations
  PENDING: ["badge-amber", "Pending"],
  SUSPENDED: ["badge-red", "Suspended"],
  // Placements
  PENDING_CONFIRMATION: ["badge-blue", "Pending Confirmation"],
  COMPLETED: ["badge-green", "Completed"],
  DISCONTINUED: ["badge-neutral", "Discontinued"],
  EXTENDED: ["badge-purple", "Extended"],
  // Passport
  PENDING_VERIFICATION: ["badge-amber", "Pending Verification"],
  VERIFIED: ["badge-green", "Verified"],
  // Interviews
  SCHEDULED: ["badge-blue", "Scheduled"],
  CANCELLED: ["badge-neutral", "Cancelled"],
  // Learning objectives
  IN_PROGRESS: ["badge-blue", "In Progress"],
  ACHIEVED: ["badge-green", "Achieved"],
  // Complaints
  OPEN: ["badge-red", "Open"],
  RESOLVED: ["badge-green", "Resolved"],
  DISMISSED: ["badge-neutral", "Dismissed"],
};

export function statusBadge(status) {
  const [cls, label] = STATUS_META[status] || ["badge-neutral", status?.replace(/_/g, " ") || ""];
  return { cls, label };
}

export function labelFor(options, value) {
  const found = options.find(([v]) => v === value);
  return found ? found[1] : value || "-";
}

export function fmtDate(value, withTime = false) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const opts = { day: "numeric", month: "short", year: "numeric" };
  if (withTime) Object.assign(opts, { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleString("en-KE", opts);
}

export function fmtMoney(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return "KES " + n.toLocaleString("en-KE", { maximumFractionDigits: 0 });
}