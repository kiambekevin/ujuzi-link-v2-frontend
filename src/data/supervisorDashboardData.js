export const SUPERVISOR_PROFILES = {
  workplace: {
    name: 'Eng. Peter Kamau',
    role: 'Workplace Supervisor',
    initials: 'PK',
    type: 'workplace',
    organisation: 'Kenya Power & Lighting Co.',
    position: 'Senior Electrical Engineer',
    email: 'peter.kamau@kplc.co.ke',
    phone: '+254 711 223 344'
  },
  institution: {
    name: 'Mr. John Mwangi',
    role: 'Institutional Supervisor',
    initials: 'JM',
    type: 'institution',
    organisation: 'Nairobi Technical Training Institute',
    position: 'Head of Electrical Department',
    email: 'john.mwangi@ntti.ac.ke',
    phone: '+254 722 556 677'
  }
}

export const SUPERVISOR_STATS = {
  workplace: [
    { label: 'Assigned trainees', value: '3', icon: 'fa-users', color: 'purple' },
    { label: 'Entries to review', value: '7', icon: 'fa-hourglass-half', color: 'warning' },
    { label: 'Approved this month', value: '24', icon: 'fa-check-circle', color: 'success' },
    { label: 'Avg. hours / week', value: '41', icon: 'fa-clock', color: 'info' }
  ],
  institution: [
    { label: 'Assigned trainees', value: '8', icon: 'fa-users', color: 'purple' },
    { label: 'Pending verifications', value: '4', icon: 'fa-clipboard-check', color: 'warning' },
    { label: 'Approved this month', value: '15', icon: 'fa-check-circle', color: 'success' },
    { label: 'Completion ready', value: '2', icon: 'fa-award', color: 'info' }
  ]
}

export const TRAINEES = {
  workplace: [
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
  ],
  institution: [
    {
      id: 1,
      name: 'Jane Wanjiku',
      initials: 'JW',
      programme: 'Diploma in Electrical Installation',
      level: 'TVET Level 6',
      institution: 'Nairobi Technical Training Institute',
      placement: 'Electrical Installation Technician',
      employer: 'Kenya Power',
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
      institution: 'Nairobi Technical Training Institute',
      placement: 'Solar Installation Trainee',
      employer: 'M-KOPA Solar',
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
      institution: 'Nairobi Technical Training Institute',
      placement: 'Welding & Fabrication Apprentice',
      employer: 'Kenya Breweries',
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
      institution: 'Nairobi Technical Training Institute',
      placement: 'Clinical Assistant Intern',
      employer: 'Kenyatta National Hospital',
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
}

export const PENDING_ENTRIES = {
  workplace: [
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
  ],
  institution: [
    {
      id: 201,
      traineeName: 'Peter Otieno',
      traineeInitials: 'PO',
      week: 8,
      dates: '13 – 19 Oct 2026',
      phase: 'Phase 1 · Solar PV installation',
      hours: 38,
      activities: [
        'Assisted in installing solar panels on three residential rooftops.',
        'Wired battery banks and inverters under supervision.',
        'Completed safety induction and toolbox talk.'
      ],
      skills: ['Solar PV', 'Wiring', 'Safety protocols'],
      submittedAt: '2026-10-20 08:45'
    },
    {
      id: 202,
      traineeName: 'Peter Otieno',
      traineeInitials: 'PO',
      week: 7,
      dates: '06 – 12 Oct 2026',
      phase: 'Phase 1 · Solar PV installation',
      hours: 40,
      activities: [
        'Supported solar panel mounting and cable routing.',
        'Learned how to test panel output using a multimeter.'
      ],
      skills: ['Solar PV', 'Troubleshooting'],
      submittedAt: '2026-10-13 11:20'
    }
  ]
}

export const RECENT_FEEDBACK = [
  { traineeName: 'Jane Wanjiku', week: 16, comment: 'Great initiative on the switchgear inspection. Ensure you attach the insulation test report for Week 17.', date: '14 Oct 2026', rating: 4 },
  { traineeName: 'Brian Kimani', week: 22, comment: 'Excellent documentation. Consider presenting your findings at the next team meeting.', date: '12 Oct 2026', rating: 5 },
  { traineeName: 'Grace Achieng', week: 15, comment: 'Your unit tests are thorough. Let us schedule a review session on your next task.', date: '08 Oct 2026', rating: 4 }
]

export const COMPETENCY_FRAMEWORK = [
  { name: 'Electrical wiring', current: 4, target: 5 },
  { name: 'Circuit analysis', current: 3, target: 5 },
  { name: 'Fault-finding', current: 4, target: 5 },
  { name: 'Safety protocols', current: 5, target: 5 },
  { name: 'Documentation', current: 3, target: 4 }
]