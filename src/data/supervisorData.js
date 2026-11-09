// ============================================================
// WORKPLACE SUPERVISOR (employer hosting trainees)
// ============================================================
export const WORKPLACE_SUPERVISOR = {
  name: 'Eng. Peter Kamau',
  role: 'Workplace Supervisor',
  initials: 'PK',
  position: 'Senior Electrical Engineer',
  organisation: 'Kenya Power & Lighting Co.',
  email: 'peter.kamau@kplc.co.ke',
  phone: '+254 711 223 344'
}

export const WORKPLACE_STATS = [
  { label: 'Assigned trainees', value: '3', icon: 'fa-users', color: 'purple' },
  { label: 'Entries to review', value: '7', icon: 'fa-hourglass-half', color: 'warning' },
  { label: 'Approved this month', value: '24', icon: 'fa-check-circle', color: 'success' },
  { label: 'Avg. hours / week', value: '41', icon: 'fa-clock', color: 'info' }
]

export const WORKPLACE_TRAINEES = [
  {
    id: 1,
    name: 'Jane Wanjiku',
    initials: 'JW',
    programme: 'Diploma in Electrical Installation',
    level: 'TVET Level 6',
    institution: 'Nairobi Technical Training Institute',
    placement: 'Electrical Installation Technician',
    startDate: 'Jan 2026',
    progress: 42,
    month: 5,
    totalMonths: 12,
    status: 'on-track',
    lastLogbook: '2026-10-19',
    pendingEntries: 2,
    hoursLogged: 336,
    hoursRequired: 480
  },
  {
    id: 2,
    name: 'Brian Kimani',
    initials: 'BK',
    programme: 'Diploma in Mechanical Engineering',
    level: 'TVET Level 6',
    institution: 'Nairobi Technical Training Institute',
    placement: 'Mechanical Engineering Intern',
    startDate: 'Apr 2025',
    progress: 75,
    month: 9,
    totalMonths: 12,
    status: 'on-track',
    lastLogbook: '2026-10-18',
    pendingEntries: 0,
    hoursLogged: 360,
    hoursRequired: 480
  },
  {
    id: 3,
    name: 'Grace Achieng',
    initials: 'GA',
    programme: 'Diploma in Software Development',
    level: 'TVET Level 6',
    institution: 'Kenya Institute of Management',
    placement: 'Software Development Intern',
    startDate: 'Sep 2025',
    progress: 28,
    month: 3,
    totalMonths: 12,
    status: 'attention',
    lastLogbook: '2026-10-12',
    pendingEntries: 5,
    hoursLogged: 112,
    hoursRequired: 480
  }
]

export const WORKPLACE_PENDING_ENTRIES = [
  {
    id: 101,
    traineeName: 'Grace Achieng',
    traineeInitials: 'GA',
    week: 17,
    dates: '13 – 19 Oct 2026',
    phase: 'Phase 2 · Core practical experience',
    hours: 40,
    activities: [
      'Built a new React dashboard component for the internal tooling team.',
      'Wrote unit tests for the user authentication flow.',
      'Participated in a code review session and paired with a senior engineer.'
    ],
    skills: ['React', 'JavaScript', 'API'],
    submittedAt: '2026-10-20 09:14'
  },
  {
    id: 102,
    traineeName: 'Grace Achieng',
    traineeInitials: 'GA',
    week: 16,
    dates: '06 – 12 Oct 2026',
    phase: 'Phase 2 · Core practical experience',
    hours: 36,
    activities: [
      'Fixed three production bugs reported by users.',
      'Documented the API integration guide for new developers.'
    ],
    skills: ['JavaScript', 'Documentation'],
    submittedAt: '2026-10-13 14:30'
  }
]

export const WORKPLACE_COMPETENCIES = [
  { name: 'Electrical wiring', current: 4, target: 5 },
  { name: 'Circuit analysis', current: 3, target: 5 },
  { name: 'Fault-finding', current: 4, target: 5 },
  { name: 'Safety protocols', current: 5, target: 5 },
  { name: 'Documentation', current: 3, target: 4 }
]

// ============================================================
// INSTITUTIONAL SUPERVISOR (TVET institution staff)
// ============================================================
export const INSTITUTION_SUPERVISOR = {
  name: 'Mr. John Mwangi',
  role: 'Institutional Supervisor',
  initials: 'JM',
  position: 'Head of Electrical Department',
  organisation: 'Nairobi Technical Training Institute',
  email: 'john.mwangi@ntti.ac.ke',
  phone: '+254 722 556 677'
}

export const INSTITUTION_STATS = [
  { label: 'Assigned trainees', value: '8', icon: 'fa-users', color: 'purple' },
  { label: 'Pending verifications', value: '4', icon: 'fa-clipboard-check', color: 'warning' },
  { label: 'Approved this month', value: '15', icon: 'fa-check-circle', color: 'success' },
  { label: 'Completion ready', value: '2', icon: 'fa-award', color: 'info' }
]

export const INSTITUTION_TRAINEES = [
  {
    id: 1,
    name: 'Jane Wanjiku',
    initials: 'JW',
    programme: 'Diploma in Electrical Installation',
    level: 'TVET Level 6',
    employer: 'Kenya Power',
    placement: 'Electrical Installation Technician',
    startDate: 'Jan 2026',
    progress: 42,
    month: 5,
    totalMonths: 12,
    status: 'on-track',
    lastLogbook: '2026-10-19',
    pendingEntries: 2,
    hoursLogged: 336,
    hoursRequired: 480
  },
  {
    id: 4,
    name: 'Peter Otieno',
    initials: 'PO',
    programme: 'Certificate in Solar PV Installation',
    level: 'TVET Level 4',
    employer: 'M-KOPA Solar',
    placement: 'Solar Installation Trainee',
    startDate: 'Mar 2026',
    progress: 18,
    month: 2,
    totalMonths: 6,
    status: 'attention',
    lastLogbook: '2026-10-08',
    pendingEntries: 4,
    hoursLogged: 84,
    hoursRequired: 240
  },
  {
    id: 5,
    name: 'Kevin Mwangi',
    initials: 'KM',
    programme: 'Craft Certificate in Welding & Fabrication',
    level: 'TVET Level 3',
    employer: 'Kenya Breweries',
    placement: 'Welding & Fabrication Apprentice',
    startDate: 'Jun 2026',
    progress: 15,
    month: 1,
    totalMonths: 12,
    status: 'on-track',
    lastLogbook: '2026-10-20',
    pendingEntries: 1,
    hoursLogged: 40,
    hoursRequired: 480
  },
  {
    id: 6,
    name: 'Mary Muthoni',
    initials: 'MM',
    programme: 'Diploma in Nursing',
    level: 'TVET Level 6',
    employer: 'Kenyatta National Hospital',
    placement: 'Clinical Assistant Intern',
    startDate: 'Jan 2026',
    progress: 88,
    month: 11,
    totalMonths: 12,
    status: 'completion-ready',
    lastLogbook: '2026-10-20',
    pendingEntries: 0,
    hoursLogged: 460,
    hoursRequired: 480
  }
]

export const INSTITUTION_PENDING_VERIFICATIONS = [
  {
    id: 201,
    name: 'Esther Chebet',
    initials: 'EC',
    programme: 'Diploma in Business Management',
    level: 'TVET Level 6',
    submitted: '2026-10-20',
    docCount: 4,
    note: 'All documents verified by employer, pending final institutional approval.'
  },
  {
    id: 202,
    name: 'Samuel Kipchoge',
    initials: 'SK',
    programme: 'Craft Certificate in Automotive Engineering',
    level: 'TVET Level 3',
    submitted: '2026-10-19',
    docCount: 3,
    note: 'Insurance cover awaiting upload before eligibility is confirmed.'
  },
  {
    id: 203,
    name: 'Faith Njeri',
    initials: 'FN',
    programme: 'Certificate in Agribusiness',
    level: 'TVET Level 4',
    submitted: '2026-10-18',
    docCount: 4,
    note: 'Self-identified as a person with a disability; reasonable adjustments to confirm with employer.'
  },
  {
    id: 204,
    name: 'Lydia Atieno',
    initials: 'LA',
    programme: 'Diploma in Information Communication Technology',
    level: 'TVET Level 6',
    submitted: '2026-10-17',
    docCount: 4,
    note: 'Eligible. Ready for institutional sign-off.'
  }
]

export const INSTITUTION_APPROVALS = [
  { id: 301, trainee: 'Jane Wanjiku', employer: 'Kenya Power', role: 'Electrical Installation Technician', status: 'approved' },
  { id: 302, trainee: 'Peter Otieno', employer: 'M-KOPA Solar', role: 'Solar Installation Trainee', status: 'review' },
  { id: 303, trainee: 'Mary Muthoni', employer: 'Kenyatta National Hospital', role: 'Clinical Assistant Intern', status: 'completion' }
]

export const INSTITUTION_COMPLETION_READY = [
  {
    id: 6,
    name: 'Mary Muthoni',
    initials: 'MM',
    programme: 'Diploma in Nursing',
    employer: 'Kenyatta National Hospital',
    hours: 460,
    required: 480,
    competencies: 'Verified',
    supervisorFeedback: 'Submitted',
    readyDate: '2026-10-20'
  },
  {
    id: 7,
    name: 'Daniel Kipruto',
    initials: 'DK',
    programme: 'Diploma in Supply Chain Management',
    employer: 'Kenya Ports Authority',
    hours: 480,
    required: 480,
    competencies: 'Verified',
    supervisorFeedback: 'Submitted',
    readyDate: '2026-10-15'
  }
]