// =============================================================
// Opportunity type labels (used by the multi-select filter)
// =============================================================

export const TYPE_OPTIONS = [
  'Apprenticeships',
  'Internships',
  'Industrial attachments',
  'Pupillage for law graduates and eligible candidates',
  'Community service learning',
  'Volunteer opportunities',
  'Industry visits',
  'Job shadowing',
  'Other'
]

// Internal keys → full display labels (used for aria & full-text needs)
export const TYPE_LABELS = {
  apprenticeship: 'Apprenticeships',
  internship: 'Internships',
  attachment: 'Industrial attachments',
  pupillage: 'Pupillage for law graduates and eligible candidates',
  community: 'Community service learning',
  volunteer: 'Volunteer opportunities',
  visit: 'Industry visits',
  shadowing: 'Job shadowing',
  other: 'Other'
}

// Short labels used on opportunity badges & active filter chips
export const TYPE_SHORT = {
  apprenticeship: 'Apprenticeship',
  internship: 'Internship',
  attachment: 'Industrial attachment',
  pupillage: 'Pupillage',
  community: 'Community service',
  volunteer: 'Volunteer',
  visit: 'Industry visit',
  shadowing: 'Job shadowing',
  other: 'Other'
}

// Display label → internal key (used when toggling filters)
export const TYPE_LABEL_TO_KEY = {
  Apprenticeships: 'apprenticeship',
  Internships: 'internship',
  'Industrial attachments': 'attachment',
  'Pupillage for law graduates and eligible candidates': 'pupillage',
  'Community service learning': 'community',
  'Volunteer opportunities': 'volunteer',
  'Industry visits': 'visit',
  'Job shadowing': 'shadowing',
  Other: 'other'
}

// =============================================================
// Durations
// =============================================================

export const DURATION_LABELS = {
  short: '1–3 months',
  medium: '4–6 months',
  long: '7–12 months',
  extended: '12+ months'
}

// =============================================================
// Counties (national list used in the county filter)
// =============================================================

export const COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
  'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
  'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu',
  'Machakos', 'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa',
  "Murang'a", 'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua',
  'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi',
  'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
]

// =============================================================
// Sectors
// =============================================================

export const SECTORS = [
  'ICT & Digital',
  'Engineering',
  'Health',
  'Agriculture',
  'Business & Finance',
  'Construction',
  'Manufacturing',
  'Hospitality & Tourism',
  'Education',
  'Transport & Logistics',
  'Energy & Utilities',
  'Creative Arts & Media',
  'Social Work & Community Development',
  'Environmental Science',
  'Other'
]

// =============================================================
// Opportunities
// =============================================================

export const OPPORTUNITIES = [
  {
    id: 1,
    title: 'Electrical Installation Technician',
    employer: 'Kenya Power & Lighting Co.',
    type: 'apprenticeship',
    county: 'Nairobi',
    sector: 'Engineering',
    duration: 12,
    stipend: true,
    posted: '2025-10-20',
    deadline: '2025-12-16',
    qualification: 'TVET Level 3+',
    institution: 'Nairobi Technical Training Institute',
    institutionAbbr: 'NTTI',
    institutionColor: '#4B0082',
    tags: ['Electrical', 'Power Systems', 'Wiring']
  },
  {
    id: 2,
    title: 'Software Development Intern',
    employer: 'Safaricom PLC',
    type: 'internship',
    county: 'Nairobi',
    sector: 'ICT & Digital',
    duration: 6,
    stipend: true,
    posted: '2025-10-22',
    deadline: '2025-11-15',
    qualification: 'Diploma / Degree',
    institution: 'Kenya Institute of Management',
    institutionAbbr: 'KIM',
    institutionColor: '#0369A1',
    tags: ['JavaScript', 'React', 'API']
  },
  {
    id: 3,
    title: 'Civil Engineering Attachment',
    employer: 'Kenya National Highways Authority',
    type: 'attachment',
    county: 'Nairobi',
    sector: 'Construction',
    duration: 3,
    stipend: false,
    posted: '2025-10-15',
    deadline: '2025-12-20',
    qualification: 'Diploma in Civil Eng.',
    institution: 'Nairobi Technical Training Institute',
    institutionAbbr: 'NTTI',
    institutionColor: '#4B0082',
    tags: ['Roads', 'Surveying', 'AutoCAD']
  },
  {
    id: 4,
    title: 'Agri-Business Dual Trainee',
    employer: 'Kenya Agricultural & Livestock Research Org.',
    type: 'dual',
    county: 'Nakuru',
    sector: 'Agriculture',
    duration: 18,
    stipend: true,
    posted: '2025-10-18',
    deadline: '2026-01-10',
    qualification: 'Certificate / Diploma',
    institution: 'Nakuru Technical Training Institute',
    institutionAbbr: 'NTTI-NKR',
    institutionColor: '#065F46',
    tags: ['Agronomy', 'Farm Management']
  },
  {
    id: 5,
    title: 'Nursing Intern',
    employer: 'Kenyatta National Hospital',
    type: 'internship',
    county: 'Nairobi',
    sector: 'Health',
    duration: 12,
    stipend: true,
    posted: '2025-10-12',
    deadline: '2025-12-05',
    qualification: 'Diploma in Nursing',
    institution: 'Kenya Medical Training College',
    institutionAbbr: 'KMTC',
    institutionColor: '#9D174D',
    tags: ['Patient Care', 'Clinical']
  },
  {
    id: 6,
    title: 'Mechanical Fitter Apprentice',
    employer: 'Kenya Breweries Limited',
    type: 'apprenticeship',
    county: 'Nairobi',
    sector: 'Manufacturing',
    duration: 24,
    stipend: true,
    posted: '2025-10-10',
    deadline: '2025-11-28',
    qualification: 'Craft Certificate',
    institution: 'Thika Technical Training Institute',
    institutionAbbr: 'TTTI',
    institutionColor: '#92400E',
    tags: ['Fitting', 'Machining', 'Maintenance']
  },
  {
    id: 7,
    title: 'Accountant Attachment',
    employer: 'Kenya Revenue Authority',
    type: 'attachment',
    county: 'Mombasa',
    sector: 'Business & Finance',
    duration: 3,
    stipend: false,
    posted: '2025-10-08',
    deadline: '2025-11-20',
    qualification: 'CPA Part II',
    institution: 'Mombasa Technical Training Institute',
    institutionAbbr: 'MTTI',
    institutionColor: '#6A2C9E',
    tags: ['Taxation', 'Audit', 'Bookkeeping']
  },
  {
    id: 8,
    title: 'Hotel Management Trainee',
    employer: 'Serena Hotels',
    type: 'internship',
    county: 'Mombasa',
    sector: 'Hospitality & Tourism',
    duration: 6,
    stipend: true,
    posted: '2025-10-19',
    deadline: '2025-11-25',
    qualification: 'Diploma in Hospitality',
    institution: 'Kenya Institute of Management',
    institutionAbbr: 'KIM',
    institutionColor: '#0369A1',
    tags: ['Front Office', 'F&B', 'Housekeeping']
  },
  {
    id: 9,
    title: 'Solar Installation Technician',
    employer: 'M-KOPA Solar',
    type: 'apprenticeship',
    county: 'Kisumu',
    sector: 'Energy & Utilities',
    duration: 9,
    stipend: true,
    posted: '2025-10-21',
    deadline: '2025-12-01',
    qualification: 'TVET Level 4',
    institution: 'Kisumu National Polytechnic',
    institutionAbbr: 'KNP',
    institutionColor: '#4B0082',
    tags: ['Solar PV', 'Wiring', 'Installation']
  },
  {
    id: 10,
    title: 'Data Analytics Intern',
    employer: 'Equity Bank Kenya',
    type: 'internship',
    county: 'Nairobi',
    sector: 'ICT & Digital',
    duration: 4,
    stipend: true,
    posted: '2025-10-23',
    deadline: '2025-11-18',
    qualification: 'Degree in Statistics/CS',
    institution: 'Kenya Institute of Management',
    institutionAbbr: 'KIM',
    institutionColor: '#0369A1',
    tags: ['SQL', 'Python', 'Dashboards']
  },
  {
    id: 11,
    title: 'Automotive Engineering Attachment',
    employer: 'Isuzu East Africa',
    type: 'attachment',
    county: 'Nairobi',
    sector: 'Engineering',
    duration: 3,
    stipend: false,
    posted: '2025-10-14',
    deadline: '2025-12-15',
    qualification: 'Diploma in Automotive Eng.',
    institution: 'Nairobi Technical Training Institute',
    institutionAbbr: 'NTTI',
    institutionColor: '#4B0082',
    tags: ['Vehicle Diagnostics', 'Engine Repair']
  },
  {
    id: 12,
    title: 'Supply Chain Dual Trainee',
    employer: 'Kenya Ports Authority',
    type: 'dual',
    county: 'Mombasa',
    sector: 'Transport & Logistics',
    duration: 18,
    stipend: true,
    posted: '2025-10-16',
    deadline: '2026-01-05',
    qualification: 'Diploma in Supply Chain',
    institution: 'Mombasa Technical Training Institute',
    institutionAbbr: 'MTTI',
    institutionColor: '#6A2C9E',
    tags: ['Procurement', 'Logistics', 'Warehousing']
  },
  {
    id: 13,
    title: 'Pharmacy Assistant Attachment',
    employer: 'AAR Healthcare',
    type: 'attachment',
    county: 'Nairobi',
    sector: 'Health',
    duration: 3,
    stipend: false,
    posted: '2025-10-11',
    deadline: '2025-11-22',
    qualification: 'Certificate in Pharmacy',
    institution: 'Kenya Medical Training College',
    institutionAbbr: 'KMTC',
    institutionColor: '#9D174D',
    tags: ['Dispensing', 'Inventory']
  },
  {
    id: 14,
    title: 'Graphic Design Intern',
    employer: 'Scanad Kenya',
    type: 'internship',
    county: 'Nairobi',
    sector: 'Creative Arts & Media',
    duration: 4,
    stipend: true,
    posted: '2025-10-20',
    deadline: '2025-11-30',
    qualification: 'Diploma in Design',
    institution: 'Kenya Institute of Management',
    institutionAbbr: 'KIM',
    institutionColor: '#0369A1',
    tags: ['Illustrator', 'Branding', 'Social Media']
  },
  {
    id: 15,
    title: 'Electrical Technician Apprentice',
    employer: 'Kenya Breweries Limited',
    type: 'apprenticeship',
    county: 'Nairobi',
    sector: 'Manufacturing',
    duration: 12,
    stipend: true,
    posted: '2025-10-09',
    deadline: '2025-11-28',
    qualification: 'TVET Level 3',
    institution: 'Thika Technical Training Institute',
    institutionAbbr: 'TTTI',
    institutionColor: '#92400E',
    tags: ['Electrical', 'PLC', 'Maintenance']
  },

  // ---- New types (pupillage, community, volunteer, visit, shadowing, other) ----

  {
    id: 16,
    title: 'Legal Pupillage',
    employer: 'Kituo Cha Sheria (Legal Advice Centre)',
    type: 'pupillage',
    county: 'Nairobi',
    sector: 'Business & Finance',
    duration: 12,
    stipend: true,
    posted: '2025-10-22',
    deadline: '2025-11-30',
    qualification: 'LLB (Bachelor of Laws)',
    institution: 'Kenya School of Law',
    institutionAbbr: 'KSL',
    institutionColor: '#0369A1',
    tags: ['Litigation', 'Legal Aid', 'Conveyancing']
  },
  {
    id: 17,
    title: 'Community Health Volunteer',
    employer: 'Amref Health Africa',
    type: 'volunteer',
    county: 'Kajiado',
    sector: 'Health',
    duration: 6,
    stipend: false,
    posted: '2025-10-19',
    deadline: '2025-12-10',
    qualification: 'Certificate in Community Health',
    institution: 'Kenya Medical Training College',
    institutionAbbr: 'KMTC',
    institutionColor: '#9D174D',
    tags: ['Community Outreach', 'Health Education']
  },
  {
    id: 18,
    title: 'Community Service Learning',
    employer: 'Nairobi City County',
    type: 'community',
    county: 'Nairobi',
    sector: 'Social Work & Community Development',
    duration: 3,
    stipend: false,
    posted: '2025-10-17',
    deadline: '2025-11-28',
    qualification: 'Diploma in Social Work',
    institution: 'Nairobi Technical Training Institute',
    institutionAbbr: 'NTTI',
    institutionColor: '#4B0082',
    tags: ['Community Engagement', 'Public Service']
  },
  {
    id: 19,
    title: 'Industry Visit - Automotive Assembly',
    employer: 'Isuzu East Africa',
    type: 'visit',
    county: 'Nairobi',
    sector: 'Manufacturing',
    duration: 1,
    stipend: false,
    posted: '2025-10-23',
    deadline: '2025-11-05',
    qualification: 'All TVET levels',
    institution: 'Nairobi Technical Training Institute',
    institutionAbbr: 'NTTI',
    institutionColor: '#4B0082',
    tags: ['Factory Tour', 'Industrial Exposure']
  },
  {
    id: 20,
    title: 'Job Shadowing - Hospital Laboratory',
    employer: 'Aga Khan University Hospital',
    type: 'shadowing',
    county: 'Nairobi',
    sector: 'Health',
    duration: 2,
    stipend: false,
    posted: '2025-10-21',
    deadline: '2025-11-12',
    qualification: 'Diploma in Medical Lab Sciences',
    institution: 'Kenya Medical Training College',
    institutionAbbr: 'KMTC',
    institutionColor: '#9D174D',
    tags: ['Lab Work', 'Clinical Observation']
  },
  {
    id: 21,
    title: 'Data Entry Clerk - Short Term',
    employer: 'Kenya National Bureau of Statistics',
    type: 'other',
    county: 'Nairobi',
    sector: 'Business & Finance',
    duration: 2,
    stipend: true,
    posted: '2025-10-18',
    deadline: '2025-11-20',
    qualification: 'Certificate in ICT',
    institution: 'Nairobi Technical Training Institute',
    institutionAbbr: 'NTTI',
    institutionColor: '#4B0082',
    tags: ['Data Entry', 'Statistics', 'ICT']
  }
]

// =============================================================
// Demo "now" reference for urgency calculations
// (kept in sync with the sample posted dates above)
// =============================================================

export const NOW = new Date('2025-10-25T12:00:00')

// =============================================================
// Helpers
// =============================================================

export function hoursUntilDeadline(deadlineStr) {
  const dl = new Date(deadlineStr + 'T23:59:59')
  return (dl - NOW) / (1000 * 60 * 60)
}

export function isUrgent(o) {
  const hrs = hoursUntilDeadline(o.deadline)
  return hrs >= 0 && hrs <= 72
}

export function getInstitutionInitials(abbr, name) {
  if (abbr && abbr.length >= 2) return abbr.substring(0, 2).toUpperCase()
  const words = (name || 'IN').trim().split(/\s+/)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return (name || 'IN').substring(0, 2).toUpperCase()
}

export function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}