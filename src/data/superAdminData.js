export const ADMIN_PROFILE = {
  name: 'Dr. Margaret Wairimu',
  role: 'Super Administrator',
  initials: 'MW',
  position: 'Director, Labour Market Information',
  ministry: 'State Department for Labour and Skills Development',
  department: 'Ministry of Labour and Social Protection',
  email: 'admin@ujizilink.go.ke',
  phone: '+254 20 000 0100'
}

export const PLATFORM_STATS = [
  { label: 'Registered trainees', value: '15,432', trend: '+12%', icon: 'fa-user-graduate', color: 'purple' },
  { label: 'Verified employers', value: '1,204', trend: '+8%', icon: 'fa-building', color: 'success' },
  { label: 'TVET institutions', value: '187', trend: '+3', icon: 'fa-university', color: 'info' },
  { label: 'Active placements', value: '3,842', trend: '+15%', icon: 'fa-briefcase', color: 'warning' }
]

export const PLATFORM_HEALTH = [
  { label: 'Verification queue', value: '312', status: 'attention', note: 'Trainee verifications pending across institutions' },
  { label: 'Pending approvals', value: '84', status: 'attention', note: 'Placement approvals awaiting institutions' },
  { label: 'Reported issues', value: '7', status: 'danger', note: 'Fraud or safeguarding reports requiring investigation' },
  { label: 'System uptime', value: '99.97%', status: 'good', note: 'Over the last 30 days' }
]

export const RECENT_ACTIVITY = [
  {
    id: 1,
    type: 'trainee',
    actor: 'Jane Wanjiku',
    actorInitials: 'JW',
    action: 'Submitted logbook entry · Week 18',
    context: 'Kenya Power · Electrical Installation Technician',
    time: '12 minutes ago'
  },
  {
    id: 2,
    type: 'employer',
    actor: 'Safaricom PLC',
    actorInitials: 'SC',
    action: 'Posted new opportunity',
    context: 'Software Development Intern · Nairobi',
    time: '35 minutes ago'
  },
  {
    id: 3,
    type: 'institution',
    actor: 'Nairobi Technical Training Institute',
    actorInitials: 'NT',
    action: 'Verified 12 trainees',
    context: 'Batch verification · ICT and Engineering',
    time: '1 hour ago'
  },
  {
    id: 4,
    type: 'trainee',
    actor: 'Grace Achieng',
    actorInitials: 'GA',
    action: 'Application accepted',
    context: 'Software Development Intern · Safaricom PLC',
    time: '2 hours ago'
  },
  {
    id: 5,
    type: 'employer',
    actor: 'Kenya Power & Lighting Co.',
    actorInitials: 'KP',
    action: 'Confirmed completion',
    context: 'Electrical Installation Technician · Jane Wanjiku',
    time: '3 hours ago'
  },
  {
    id: 6,
    type: 'institution',
    actor: 'Kisumu National Polytechnic',
    actorInitials: 'KN',
    action: 'Updated institutional profile',
    context: 'Contact details and active counties',
    time: '5 hours ago'
  }
]

export const PLACEMENT_BY_SECTOR = [
  { sector: 'ICT & Digital', count: 982, pct: 100, color: '#6D28D9' },
  { sector: 'Engineering', count: 874, pct: 89, color: '#0369A1' },
  { sector: 'Health', count: 512, pct: 52, color: '#9D174D' },
  { sector: 'Business & Finance', count: 428, pct: 44, color: '#92400E' },
  { sector: 'Construction', count: 386, pct: 39, color: '#0C4A6E' },
  { sector: 'Manufacturing', count: 298, pct: 30, color: '#7E22CE' },
  { sector: 'Agriculture', count: 202, pct: 21, color: '#065F46' },
  { sector: 'Energy & Utilities', count: 160, pct: 16, color: '#854D0E' }
]

export const COUNTY_COVERAGE = [
  { county: 'Nairobi', trainees: 4620, employers: 428, placements: 1842, pct: 100 },
  { county: 'Mombasa', trainees: 1280, employers: 128, placements: 486, pct: 26 },
  { county: 'Kisumu', trainees: 980, employers: 92, placements: 342, pct: 19 },
  { county: 'Nakuru', trainees: 940, employers: 84, placements: 328, pct: 18 },
  { county: 'Kiambu', trainees: 880, employers: 78, placements: 302, pct: 16 },
  { county: 'Uasin Gishu', trainees: 720, employers: 64, placements: 246, pct: 13 }
]

export const PENDING_VERIFICATIONS = [
  {
    id: 1,
    institution: 'Nairobi Technical Training Institute',
    type: 'Institution registration',
    submitted: '2026-10-20',
    status: 'pending',
    priority: 'high',
    note: 'TVETA accreditation pending final review'
  },
  {
    id: 2,
    institution: 'Kenya Institute of Management',
    type: 'Batch trainee verification',
    count: 42,
    submitted: '2026-10-19',
    status: 'pending',
    priority: 'normal',
    note: 'Documents attached, awaiting cross-check'
  },
  {
    id: 3,
    institution: 'Nakuru Technical Training Institute',
    type: 'Supervisor appointment',
    count: 6,
    submitted: '2026-10-18',
    status: 'review',
    priority: 'low',
    note: 'New supervisors assigned to placements'
  },
  {
    id: 4,
    institution: 'Kisumu National Polytechnic',
    type: 'Batch trainee verification',
    count: 18,
    submitted: '2026-10-17',
    status: 'pending',
    priority: 'high',
    note: 'Insurance documents under review'
  }
]

export const FLAGGED_ISSUES = [
  {
    id: 101,
    severity: 'critical',
    category: 'Fraud',
    reporter: 'Trainee (anonymous)',
    target: 'Unverified employer "CareerLink Services Ltd"',
    summary: 'Requested KES 3,500 payment from trainee for a supposed placement.',
    reportedAt: '2026-10-20 08:14',
    status: 'investigating'
  },
  {
    id: 102,
    severity: 'high',
    category: 'Safeguarding',
    reporter: 'Institutional supervisor',
    target: 'Employer "Bolt Logistics"',
    summary: 'Trainee reported unsafe working conditions without PPE.',
    reportedAt: '2026-10-19 15:42',
    status: 'investigating'
  },
  {
    id: 103,
    severity: 'medium',
    category: 'Data quality',
    reporter: 'System detection',
    target: '12 trainee profiles',
    summary: 'Duplicate ID numbers detected across profiles.',
    reportedAt: '2026-10-18 11:30',
    status: 'resolved'
  }
]

export const SYSTEM_ACTIVITIES = [
  { label: 'New trainee registrations', value: '482', change: '+8%', note: 'Last 7 days' },
  { label: 'New employer registrations', value: '26', change: '+4%', note: 'Last 7 days' },
  { label: 'Opportunities posted', value: '148', change: '+12%', note: 'Last 7 days' },
  { label: 'Applications submitted', value: '2,140', change: '+18%', note: 'Last 7 days' }
]

export const TOP_INSTITUTIONS = [
  { name: 'Nairobi Technical Training Institute', trainees: 3420, placements: 486, pct: 100 },
  { name: 'Kisumu National Polytechnic', trainees: 2140, placements: 296, pct: 63 },
  { name: 'Kenya Institute of Management', trainees: 1860, placements: 240, pct: 54 },
  { name: 'Mombasa Technical Training Institute', trainees: 1420, placements: 186, pct: 42 },
  { name: 'Nakuru Technical Training Institute', trainees: 1280, placements: 160, pct: 37 }
]