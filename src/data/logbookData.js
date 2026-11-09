export const LOGBOOK_ENTRIES = [
  {
    id: 1,
    week: 17,
    dates: '13 – 19 Oct 2026',
    phase: 'Phase 3 · Maintenance & troubleshooting',
    status: 'submitted',
    activities: [
      'Assisted in routine maintenance of distribution transformers at the Nairobi West depot.',
      'Carried out insulation resistance testing on three transformers under supervision.',
      'Completed fault-finding exercise on a low-voltage distribution board.'
    ],
    hours: 40,
    supervisor: 'Eng. Peter Kamau',
    evidenceCount: 2,
    skills: ['Transformer maintenance', 'Insulation testing', 'Fault-finding']
  },
  {
    id: 2,
    week: 16,
    dates: '06 – 12 Oct 2026',
    phase: 'Phase 3 · Maintenance & troubleshooting',
    status: 'approved',
    activities: [
      'Participated in switchgear inspection and cleaning at the substation.',
      'Shadowed senior technician during metering system calibration.',
      'Documented maintenance procedures in the logbook.'
    ],
    hours: 42,
    supervisor: 'Eng. Peter Kamau',
    evidenceCount: 1,
    skills: ['Switchgear', 'Metering']
  },
  {
    id: 3,
    week: 15,
    dates: '29 Sep – 05 Oct 2026',
    phase: 'Phase 3 · Maintenance & troubleshooting',
    status: 'approved',
    activities: [
      'Began Phase 3: induction to transformer maintenance procedures.',
      'Observed and assisted in oil sampling for transformer diagnostics.',
      'Reviewed safety data sheets for insulating oil.'
    ],
    hours: 38,
    supervisor: 'Eng. Peter Kamau',
    evidenceCount: 0,
    skills: ['Transformer maintenance', 'Oil sampling']
  },
  {
    id: 4,
    week: 14,
    dates: '22 – 28 Sep 2026',
    phase: 'Phase 2 · Core electrical installation (completion)',
    status: 'approved',
    activities: [
      'Completed final practical wiring project for Phase 2 assessment.',
      'Installed a three-phase distribution board under supervision.',
      'Received Phase 2 completion certificate from supervisor.'
    ],
    hours: 44,
    supervisor: 'Eng. Peter Kamau',
    evidenceCount: 0,
    skills: ['Distribution boards', 'Wiring'],
    certified: 'Phase 2 certified'
  },
  {
    id: 5,
    week: 13,
    dates: '15 – 21 Sep 2026',
    phase: 'Phase 2 · Core electrical installation',
    status: 'draft',
    activities: ['Draft entry — activities not yet finalised.'],
    hours: null,
    supervisor: 'Not assigned',
    evidenceCount: 0,
    skills: ['Wiring']
  }
]

export const WEEKLY_HOURS = [
  { week: 14, hours: 44, pct: 100 },
  { week: 15, hours: 38, pct: 95 },
  { week: 16, hours: 42, pct: 100 },
  { week: 17, hours: 40, pct: 100 },
  { week: 18, hours: null, pct: 0, partial: true }
]

export const STATUS_LABELS = {
  approved: 'Approved',
  submitted: 'Awaiting review',
  draft: 'Draft',
  'needs-revision': 'Needs revision'
}

export const PLACEMENT_DETAILS = [
  { icon: 'fa-bolt', label: 'Opportunity', value: 'Electrical Installation Technician' },
  { icon: 'fa-building', label: 'Employer', value: 'Kenya Power & Lighting Co.' },
  { icon: 'fa-map-marker-alt', label: 'Location', value: 'Nairobi, Kenya' },
  { icon: 'fa-user-tie', label: 'Workplace supervisor', value: 'Eng. Peter Kamau' },
  { icon: 'fa-university', label: 'Institutional supervisor', value: 'Mr. John Mwangi · NTTI' },
  { icon: 'fa-calendar-check', label: 'Current week', value: 'Week 18 of 52' }
]

export const LOGBOOK_REQUIREMENTS = [
  { done: true, label: 'Signed logbook agreement' },
  { done: true, label: 'Supervisor assigned' },
  { done: true, label: 'Weekly entries up to Week 17' },
  { done: false, label: 'Week 18 entry pending' },
  { done: true, label: 'Evidence for Weeks 14–16' }
]