export const DASHBOARD_DATA = {
  user: {
    firstName: 'Jane',
    lastName: 'Wanjiku',
    initials: 'JW',
    role: 'Trainee'
  },
  stats: [
    { label: 'Total applications', value: 4, icon: 'fa-paper-plane', color: 'purple' },
    { label: 'Pending review', value: 2, icon: 'fa-hourglass-half', color: 'info' },
    { label: 'Active placement', value: 1, icon: 'fa-briefcase', color: 'success' },
    { label: 'Pending tasks', value: 3, icon: 'fa-tasks', color: 'warning' }
  ],
  activePlacement: {
    title: 'Electrical Installation Technician',
    employer: 'Kenya Power & Lighting Co.',
    location: 'Nairobi',
    progress: 42,
    month: 5,
    totalMonths: 12,
    supervisor: 'Eng. Peter Kamau',
    startDate: 'Jan 2026',
    stipend: 'KES 18,000/mo'
  },
  applications: [
    { title: 'Electrical Installation Technician', employer: 'Kenya Power', icon: 'fa-bolt', date: '12 Oct 2025', status: 'accepted', statusLabel: 'Accepted' },
    { title: 'Solar Installation Technician', employer: 'M-KOPA Solar', icon: 'fa-solar-panel', date: '05 Oct 2025', status: 'shortlisted', statusLabel: 'Shortlisted' },
    { title: 'Electrical Technician Apprentice', employer: 'Kenya Breweries', icon: 'fa-hard-hat', date: '28 Sep 2025', status: 'pending', statusLabel: 'Pending' },
    { title: 'Mechanical Fitter Apprentice', employer: 'Kenya Breweries', icon: 'fa-cogs', date: '20 Sep 2025', status: 'rejected', statusLabel: 'Not successful' }
  ],
  recommendations: [
    { title: 'Power Systems Attachment', employer: 'KenGen', location: 'Naivasha', duration: '6 months', icon: 'fa-bolt', tags: ['Attachment', 'Engineering'] },
    { title: 'Renewable Energy Intern', employer: 'Kenya Power', location: 'Nairobi', duration: '4 months', icon: 'fa-solar-panel', tags: ['Internship', 'Energy'] },
    { title: 'Maintenance Technician Apprentice', employer: 'Bamburi Cement', location: 'Mombasa', duration: '12 months', icon: 'fa-cogs', tags: ['Apprenticeship', 'Manufacturing'] }
  ],
  profileCompletion: {
    percentage: 76,
    tasks: [
      { label: 'Personal details', complete: true },
      { label: 'Institution verification', complete: true },
      { label: 'CV uploaded', complete: true },
      { label: 'Insurance cover', complete: false },
      { label: 'Additional qualifications', complete: false },
      { label: 'Skills & languages', complete: false }
    ]
  },
  tasks: [
    { id: 1, title: 'Upload insurance cover', meta: 'Required before placement', metaIcon: 'fa-exclamation-circle', metaColor: 'var(--danger)', urgent: true, done: false },
    { id: 2, title: 'Complete monthly logbook entry', meta: 'Due 30 Oct 2025', metaIcon: 'fa-clock', done: false },
    { id: 3, title: 'Add additional qualifications', meta: 'Optional, boosts profile', metaIcon: 'fa-info-circle', done: false },
    { id: 4, title: 'Sign digital placement agreement', meta: 'Completed 15 Jan 2026', metaIcon: 'fa-check-circle', metaColor: 'var(--success)', done: true }
  ],
  notifications: [
    { title: 'Application shortlisted', text: 'M-KOPA Solar has shortlisted you for the Solar Installation Technician role.', time: '2 hours ago', icon: 'fa-check', color: 'success', unread: true },
    { title: 'Logbook reminder', text: 'Your monthly logbook entry for October is due on 30 Oct 2025.', time: '1 day ago', icon: 'fa-file-alt', color: 'info', unread: true },
    { title: 'Insurance cover needed', text: 'Please upload your insurance cover to complete your placement file.', time: '3 days ago', icon: 'fa-shield-alt', color: 'warning', unread: false },
    { title: 'New recommendations', text: '3 new opportunities match your profile - check them out.', time: '5 days ago', icon: 'fa-star', color: 'purple', unread: false }
  ],
  timeline: [
    { title: 'Placement started at Kenya Power', date: '15 Jan 2026', type: 'success' },
    { title: 'Digital placement agreement signed', date: '12 Jan 2026', type: 'success' },
    { title: 'Application accepted by Kenya Power', date: '20 Dec 2025', type: 'info' },
    { title: 'Applied for Electrical Installation Technician', date: '12 Oct 2025', type: 'default' }
  ],
  documents: [
    { name: 'CV_ Jane_Wanjiku.pdf', date: 'Uploaded 10 Oct 2025', icon: 'fa-file-pdf', status: 'uploaded', label: 'Verified' },
    { name: 'National_ID.jpg', date: 'Uploaded 10 Oct 2025', icon: 'fa-file-image', status: 'uploaded', label: 'Verified' },
    { name: 'Intro_letter_NTTI.pdf', date: 'Uploaded 11 Oct 2025', icon: 'fa-file-alt', status: 'uploaded', label: 'Verified' },
    { name: 'Insurance cover', date: 'Not uploaded', icon: 'fa-shield-virus', status: 'missing', label: 'Missing' }
  ]
}