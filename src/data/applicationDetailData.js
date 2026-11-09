export const APPLICATION_DETAIL = {
  id: 1,
  name: 'Grace Achieng',
  initials: 'GA',
  email: 'grace.achieng@example.com',
  phone: '+254 712 345 002',
  county: 'Nairobi',
  dob: '03 Sep 2003',
  gender: 'Female',
  appliedRole: 'Software Development Intern',
  appliedDate: '2025-10-24',
  status: 'new',
  matchScore: 92,
  institution: 'Nairobi Technical Training Institute',
  programme: 'Diploma in Software Development',
  level: 'TVET Level 6',
  experience: '1 year',
  bio: 'Final-year Diploma in Software Development trainee with practical experience building React applications and integrating REST APIs. Eager to contribute to a fast-paced engineering team and grow into a full-stack developer.',
  skills: ['JavaScript', 'React', 'API', 'Python', 'SQL', 'Git'],
  documents: {
    cv: { name: 'CV_Grace_Achieng.pdf', size: '245 KB', status: 'verified', uploaded: '2025-10-22' },
    id: { name: 'National_ID.jpg', size: '180 KB', status: 'verified', uploaded: '2025-10-22' },
    intro: { name: 'Intro_letter_NTTI.pdf', size: '120 KB', status: 'verified', uploaded: '2025-10-23' },
    insurance: { name: 'Insurance_cover.pdf', size: '310 KB', status: 'pending', uploaded: '2025-10-24' }
  },
  notes: 'Strong fit for front-end development. Portfolio shows active React project work.',
  timeline: [
    { label: 'Application submitted', date: '2025-10-24', icon: 'fa-paper-plane', type: 'info' },
    { label: 'Documents verified', date: '2025-10-24', icon: 'fa-check-circle', type: 'success' },
    { label: 'Match score calculated', date: '2025-10-24', icon: 'fa-bolt', type: 'info' }
  ]
}

export const STATUS_LABELS = {
  new: { label: 'New', cls: 'info', icon: 'fa-star' },
  shortlisted: { label: 'Shortlisted', cls: 'verified', icon: 'fa-check' },
  review: { label: 'Under Review', cls: 'pending', icon: 'fa-clock' },
  rejected: { label: 'Rejected', cls: 'rejected', icon: 'fa-times' }
}