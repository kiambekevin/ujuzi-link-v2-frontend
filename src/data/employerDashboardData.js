// src/data/employerDashboardData.js

export const DASHBOARD_DATA = {
  employer: {
    name: 'Kenya Power & Lighting Co. PLC',
    type: 'Energy & Utilities',
    initials: 'KP',
    verified: true
  },
  stats: [
    { label: 'Active opportunities', value: '8', icon: 'fa-briefcase', color: 'purple' },
    { label: 'Total applicants', value: '142', icon: 'fa-users', color: 'info' },
    { label: 'Active placements', value: '24', icon: 'fa-user-check', color: 'success' },
    { label: 'Pending reviews', value: '12', icon: 'fa-clock', color: 'warning' }
  ],
  activePlacements: [
    {
      id: 1,
      trainee: 'Jane Wanjiku',
      initials: 'JW',
      role: 'Electrical Installation Technician',
      department: 'Distribution & Maintenance',
      progress: 42,
      month: 5,
      totalMonths: 12,
      supervisor: 'Eng. Peter Kamau',
      startDate: 'Jan 2026',
      status: 'on-track'
    },
    {
      id: 2,
      trainee: 'Brian Kimani',
      initials: 'BK',
      role: 'Mechanical Engineering Intern',
      department: 'Generation',
      progress: 75,
      month: 9,
      totalMonths: 12,
      supervisor: 'Eng. Sarah Ochieng',
      startDate: 'Apr 2025',
      status: 'on-track'
    }
  ],
  recentApplications: [
    { id: 1, name: 'Grace Achieng', initials: 'GA', role: 'Software Development Intern', date: '2 hours ago', status: 'new' },
    { id: 2, name: 'David Omondi', initials: 'DO', role: 'Civil Engineering Attachment', date: '5 hours ago', status: 'shortlisted' },
    { id: 3, name: 'Lydia Atieno', initials: 'LA', role: 'ICT Support Apprentice', date: '1 day ago', status: 'review' },
    { id: 4, name: 'Samuel Kipchoge', initials: 'SK', role: 'Automotive Technician', date: '2 days ago', status: 'rejected' }
  ],
  activeOpportunities: [
    { id: 1, title: 'Electrical Installation Technician', type: 'Apprenticeship', applicants: 45, deadline: '30 Nov 2025', status: 'active' },
    { id: 2, title: 'Software Development Intern', type: 'Internship', applicants: 68, deadline: '15 Dec 2025', status: 'active' },
    { id: 3, title: 'Civil Engineering Attachment', type: 'Attachment', applicants: 29, deadline: '05 Nov 2025', status: 'closing-soon' }
  ],
  actionItems: [
    { id: 1, title: 'Review 12 new applications', meta: 'High priority', metaIcon: 'fa-exclamation-circle', metaColor: 'var(--danger)', urgent: true, done: false },
    { id: 2, title: 'Approve logbook entries for 3 trainees', meta: 'Due 28 Oct', metaIcon: 'fa-clock', done: false },
    { id: 3, title: 'Schedule mid-term evaluations', meta: 'Due 31 Oct', metaIcon: 'fa-calendar', done: false },
    { id: 4, title: 'Update opportunity details for Q1 2026', meta: 'Optional', metaIcon: 'fa-info-circle', done: false }
  ],
  notifications: [
    { title: 'New application received', text: 'Grace Achieng applied for Software Development Intern.', time: '2 hours ago', icon: 'fa-user-plus', color: 'info', unread: true },
    { title: 'Logbook submission', text: 'Jane Wanjiku submitted her monthly logbook entry.', time: '1 day ago', icon: 'fa-book', color: 'success', unread: true },
    { title: 'Placement milestone reached', text: 'Brian Kimani has reached 75% completion of his internship.', time: '3 days ago', icon: 'fa-flag-checkered', color: 'purple', unread: false }
  ]
}