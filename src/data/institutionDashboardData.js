export const DASHBOARD_DATA = {
  institution: {
    name: 'Nairobi Technical Training Institute',
    code: 'TVETA/INST/001',
    county: 'Nairobi County',
    profileCompleteness: 68,
    stats: {
      trainees: 342,
      supervisors: 12,
      activePlacements: 186
    }
  },
  stats: [
    { label: 'Registered trainees', value: '342', icon: 'fa-user-graduate', color: 'purple' },
    { label: 'Pending verifications', value: '28', icon: 'fa-clipboard-check', color: 'info' },
    { label: 'Active placements', value: '186', icon: 'fa-briefcase', color: 'success' },
    { label: 'Action items', value: '5', icon: 'fa-tasks', color: 'warning' }
  ],
  pendingVerifications: [
    { name: 'Peter Otieno', id: 'TVET/2025/0456', course: 'Solar PV Installation' },
    { name: 'Grace Achieng', id: 'TVET/2025/0512', course: 'Software Development' },
    { name: 'Kevin Mwangi', id: 'TVET/2025/0389', course: 'Welding & Fabrication' }
  ],
  placementApprovals: [
    { title: 'Electrical Installation Technician', employer: 'Kenya Power', trainee: 'Jane Wanjiku', status: 'review', statusLabel: 'Review' },
    { title: 'Software Development Intern', employer: 'Safaricom PLC', trainee: 'Grace Achieng', status: 'review', statusLabel: 'Review' },
    { title: 'Civil Engineering Attachment', employer: 'KeNHA', trainee: 'David Omondi', status: 'approved', statusLabel: 'Approved' }
  ],
  traineeProgress: [
    { name: 'Jane Wanjiku', programme: 'Electrical Installation', placement: 'Kenya Power', progress: 42, status: 'verified', statusLabel: 'On track' },
    { name: 'Grace Achieng', programme: 'Software Development', placement: 'Safaricom PLC', progress: 68, status: 'verified', statusLabel: 'On track' },
    { name: 'David Omondi', programme: 'Civil Engineering', placement: 'KeNHA', progress: 100, status: 'approved', statusLabel: 'Completed' },
    { name: 'Peter Otieno', programme: 'Solar PV Installation', placement: 'M-KOPA Solar', progress: 15, status: 'pending', statusLabel: 'Pending' }
  ],
  actionItems: [
    { id: 1, title: 'Verify 28 pending trainees', meta: 'High priority', metaIcon: 'fa-exclamation-circle', metaColor: 'var(--danger)', urgent: true, done: false },
    { id: 2, title: 'Review 2 placement approvals', meta: 'Due 30 Oct 2025', metaIcon: 'fa-clock', done: false },
    { id: 3, title: 'Assign supervisors for 3 new placements', meta: 'Due 28 Oct 2025', metaIcon: 'fa-clock', done: false },
    { id: 4, title: 'Review monthly logbook submissions', meta: 'Due 30 Oct 2025', metaIcon: 'fa-clock', done: false },
    { id: 5, title: "Approve David Omondi's completion", meta: 'Completed 20 Oct 2025', metaIcon: 'fa-check-circle', metaColor: 'var(--success)', done: true }
  ],
  notifications: [
    { title: 'New trainee verification request', text: 'Peter Otieno has submitted a verification request.', time: '2 hours ago', icon: 'fa-user-check', color: 'info', unread: true },
    { title: 'Placement approved', text: "David Omondi's civil engineering attachment was approved by KeNHA.", time: '1 day ago', icon: 'fa-check', color: 'success', unread: true },
    { title: 'Missing document', text: 'Insurance cover missing for 5 trainees in active placements.', time: '3 days ago', icon: 'fa-exclamation-triangle', color: 'warning', unread: false },
    { title: 'New employer partnership', text: 'M-KOPA Solar has posted 4 new apprenticeship opportunities.', time: '5 days ago', icon: 'fa-star', color: 'purple', unread: false }
  ]
}