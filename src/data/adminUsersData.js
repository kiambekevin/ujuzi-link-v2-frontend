// src/data/adminUsersData.js

export const USER_ROLES = [
  { key: 'all', label: 'All roles' },
  { key: 'trainee', label: 'Trainee' },
  { key: 'employer', label: 'Employer officer' },
  { key: 'institution', label: 'Institution officer' },
  { key: 'workplace_supervisor', label: 'Workplace supervisor' },
  { key: 'institution_supervisor', label: 'Institution supervisor' },
  { key: 'admin', label: 'Administrator' }
]

export const USER_STATUSES = [
  { key: 'all', label: 'All statuses' },
  { key: 'active', label: 'Active' },
  { key: 'pending', label: 'Pending verification' },
  { key: 'suspended', label: 'Suspended' },
  { key: 'deactivated', label: 'Deactivated' }
]

export const USER_STATUS_META = {
  active: { label: 'Active', cls: 'verified', icon: 'fa-check-circle' },
  pending: { label: 'Pending', cls: 'pending', icon: 'fa-clock' },
  suspended: { label: 'Suspended', cls: 'flagged', icon: 'fa-ban' },
  deactivated: { label: 'Deactivated', cls: 'suspended', icon: 'fa-circle-minus' }
}

export const ROLE_META = {
  trainee: { label: 'Trainee', icon: 'fa-user-graduate', color: 'purple' },
  employer: { label: 'Employer officer', icon: 'fa-building', color: 'success' },
  institution: { label: 'Institution officer', icon: 'fa-university', color: 'info' },
  workplace_supervisor: { label: 'Workplace supervisor', icon: 'fa-user-tie', color: 'warning' },
  institution_supervisor: { label: 'Institution supervisor', icon: 'fa-chalkboard-user', color: 'info' },
  admin: { label: 'Administrator', icon: 'fa-shield-halved', color: 'danger' }
}

export const USERS_SUMMARY = {
  totalUsers: 18742,
  activeUsers: 17986,
  pendingUsers: 486,
  suspendedUsers: 214,
  deactivatedUsers: 56,
  admins: 8
}

/**
 * Each user supports:
 * - role-specific context (institution / employer / placement)
 * - status + last active
 * - audit trail entries
 * - security metadata (login attempts, 2FA, last IP)
 */
export const USERS = [
  {
    id: 'usr-001',
    name: 'Jane Wanjiku',
    email: 'jane.wanjiku@example.com',
    phone: '+254 712 345 678',
    role: 'trainee',
    status: 'active',
    avatarColor: '#4B0082',
    initials: 'JW',
    county: 'Nairobi',
    institution: 'Nairobi Technical Training Institute',
    programme: 'Diploma in Electrical Installation',
    registeredOn: '2024-06-12',
    lastActive: '2026-10-20 09:42',
    lastIp: '197.232.14.88',
    loginAttempts: 0,
    twoFactor: true,
    flags: 0,
    audit: [
      { id: 'a1', action: 'Logged in', detail: 'Successful login', at: '2026-10-20 09:42', by: 'Self' },
      { id: 'a2', action: 'Submitted logbook entry', detail: 'Week 18 · Kenya Power', at: '2026-10-20 09:45', by: 'Self' },
      { id: 'a3', action: 'Profile updated', detail: 'Phone number changed', at: '2026-10-18 14:12', by: 'Self' }
    ]
  },
  {
    id: 'usr-002',
    name: 'Grace Achieng',
    email: 'grace.achieng@example.com',
    phone: '+254 722 445 566',
    role: 'trainee',
    status: 'active',
    avatarColor: '#7E22CE',
    initials: 'GA',
    county: 'Nairobi',
    institution: 'Nairobi Technical Training Institute',
    programme: 'Diploma in Software Development',
    registeredOn: '2024-07-02',
    lastActive: '2026-10-19 16:30',
    lastIp: '197.232.14.102',
    loginAttempts: 0,
    twoFactor: true,
    flags: 0,
    audit: [
      { id: 'a1', action: 'Logged in', detail: 'Successful login', at: '2026-10-19 16:30', by: 'Self' },
      { id: 'a2', action: 'Application accepted', detail: 'Safaricom PLC · Software Development Intern', at: '2026-10-19 16:32', by: 'Safaricom PLC' }
    ]
  },
  {
    id: 'usr-003',
    name: 'Wanjiru Kamau',
    email: 'w.kamau@safaricom.co.ke',
    phone: '+254 722 000 111',
    role: 'employer',
    status: 'active',
    avatarColor: '#00A651',
    initials: 'WK',
    county: 'Nairobi',
    employer: 'Safaricom PLC',
    position: 'Talent Acquisition Manager',
    registeredOn: '2023-02-19',
    lastActive: '2026-10-20 08:14',
    lastIp: '196.201.212.11',
    loginAttempts: 0,
    twoFactor: true,
    flags: 0,
    audit: [
      { id: 'a1', action: 'Logged in', detail: 'Successful login', at: '2026-10-20 08:14', by: 'Self' },
      { id: 'a2', action: 'Opportunity posted', detail: 'Software Development Intern', at: '2026-10-18 10:22', by: 'Self' }
    ]
  },
  {
    id: 'usr-004',
    name: 'Peter Mwangi',
    email: 'p.mwangi@kim.ac.ke',
    phone: '+254 722 556 677',
    role: 'institution',
    status: 'active',
    avatarColor: '#0369A1',
    initials: 'PM',
    county: 'Nairobi',
    institution: 'Kenya Institute of Management',
    position: 'Manager, Career Services',
    registeredOn: '2023-05-02',
    lastActive: '2026-10-19 15:18',
    lastIp: '41.90.18.44',
    loginAttempts: 0,
    twoFactor: true,
    flags: 0,
    audit: [
      { id: 'a1', action: 'Logged in', detail: 'Successful login', at: '2026-10-19 15:18', by: 'Self' },
      { id: 'a2', action: 'Batch verified', detail: '42 trainees verified', at: '2026-10-19 15:22', by: 'Self' }
    ]
  },
  {
    id: 'usr-005',
    name: 'David Mutua',
    email: 'd.mutua@careerlink.co.ke',
    phone: '+254 700 123 456',
    role: 'employer',
    status: 'suspended',
    avatarColor: '#9D174D',
    initials: 'DM',
    county: 'Nairobi',
    employer: 'CareerLink Services Ltd',
    position: 'Director',
    registeredOn: '2026-10-20',
    lastActive: '2026-10-20 08:20',
    lastIp: '102.68.77.9',
    loginAttempts: 2,
    twoFactor: false,
    flags: 1,
    suspensionReason: 'Fraud investigation - requested payment from trainee',
    audit: [
      { id: 'a1', action: 'Account suspended', detail: 'Fraud investigation opened', at: '2026-10-20 08:30', by: 'Dr. Margaret Wairimu' },
      { id: 'a2', action: 'Logged in', detail: 'Successful login', at: '2026-10-20 08:20', by: 'Self' },
      { id: 'a3', action: 'Flagged by trainee', detail: 'Requested KES 3,500 payment', at: '2026-10-20 08:14', by: 'Trainee (anonymous)' }
    ]
  },
  {
    id: 'usr-006',
    name: 'Alice Wambui',
    email: 'a.wambui@ntti.ac.ke',
    phone: '+254 711 998 877',
    role: 'institution',
    status: 'active',
    avatarColor: '#4B0082',
    initials: 'AW',
    county: 'Nairobi',
    institution: 'Nairobi Technical Training Institute',
    position: 'Head, Industry Liaison & Placement',
    registeredOn: '2023-03-14',
    lastActive: '2026-10-19 14:02',
    lastIp: '197.232.14.20',
    loginAttempts: 0,
    twoFactor: true,
    flags: 0,
    audit: [
      { id: 'a1', action: 'Logged in', detail: 'Successful login', at: '2026-10-19 14:02', by: 'Self' },
      { id: 'a2', action: 'Trainee verified', detail: 'Jane Wanjiku', at: '2026-10-19 14:05', by: 'Self' }
    ]
  },
  {
    id: 'usr-007',
    name: 'James Otieno',
    email: 'j.otieno@kplc.co.ke',
    phone: '+254 733 111 222',
    role: 'workplace_supervisor',
    status: 'active',
    avatarColor: '#0C4A6E',
    initials: 'JO',
    county: 'Nairobi',
    employer: 'Kenya Power & Lighting Co.',
    position: 'Industrial Attachment Coordinator',
    registeredOn: '2023-11-05',
    lastActive: '2026-10-20 07:30',
    lastIp: '196.201.212.55',
    loginAttempts: 0,
    twoFactor: true,
    flags: 0,
    audit: [
      { id: 'a1', action: 'Logged in', detail: 'Successful login', at: '2026-10-20 07:30', by: 'Self' },
      { id: 'a2', action: 'Logbook approved', detail: 'Jane Wanjiku · Week 17', at: '2026-10-20 07:34', by: 'Self' }
    ]
  },
  {
    id: 'usr-008',
    name: 'Mary Achieng',
    email: 'm.achieng@twigafoods.com',
    phone: '+254 711 222 333',
    role: 'employer',
    status: 'pending',
    avatarColor: '#065F46',
    initials: 'MA',
    county: 'Nairobi',
    employer: 'Twiga Foods',
    position: 'People Operations Lead',
    registeredOn: '2026-10-14',
    lastActive: '2026-10-18 10:15',
    lastIp: '105.48.33.7',
    loginAttempts: 0,
    twoFactor: false,
    flags: 0,
    audit: [
      { id: 'a1', action: 'Account created', detail: 'Pending employer verification', at: '2026-10-14 11:20', by: 'Self' },
      { id: 'a2', action: 'Documents uploaded', detail: 'Certificate of incorporation, KRA PIN', at: '2026-10-14 11:32', by: 'Self' }
    ]
  },
  {
    id: 'usr-009',
    name: 'Tom Ochieng',
    email: 't.ochieng@kisumupoly.ac.ke',
    phone: '+254 720 667 788',
    role: 'institution_supervisor',
    status: 'active',
    avatarColor: '#7E22CE',
    initials: 'TO',
    county: 'Kisumu',
    institution: 'Kisumu National Polytechnic',
    position: 'Director, Industry Linkages',
    registeredOn: '2023-04-11',
    lastActive: '2026-10-18 13:40',
    lastIp: '41.90.42.18',
    loginAttempts: 0,
    twoFactor: true,
    flags: 0,
    audit: [
      { id: 'a1', action: 'Logged in', detail: 'Successful login', at: '2026-10-18 13:40', by: 'Self' },
      { id: 'a2', action: 'Placement approved', detail: 'Grace Achieng', at: '2026-10-18 13:45', by: 'Self' }
    ]
  },
  {
    id: 'usr-010',
    name: 'Margaret Wairimu',
    email: 'admin@ujizilink.go.ke',
    phone: '+254 20 000 0100',
    role: 'admin',
    status: 'active',
    avatarColor: '#2E0057',
    initials: 'MW',
    county: 'Nairobi',
    position: 'Super Administrator',
    registeredOn: '2023-01-01',
    lastActive: '2026-10-20 09:50',
    lastIp: '196.201.212.1',
    loginAttempts: 0,
    twoFactor: true,
    flags: 0,
    audit: [
      { id: 'a1', action: 'Logged in', detail: 'Successful login', at: '2026-10-20 09:50', by: 'Self' },
      { id: 'a2', action: 'Account suspended', detail: 'David Mutua · CareerLink Services Ltd', at: '2026-10-20 08:30', by: 'Self' },
      { id: 'a3', action: 'Report exported', detail: 'Placement funnel (CSV)', at: '2026-10-20 10:14', by: 'Self' }
    ]
  },
  {
    id: 'usr-011',
    name: 'Achieng Odhiambo',
    email: 'a.odhiambo@craftskenya.co.ke',
    phone: '+254 721 999 888',
    role: 'employer',
    status: 'pending',
    avatarColor: '#9D174D',
    initials: 'AO',
    county: 'Kisumu',
    employer: 'Crafts & Creations Kenya',
    position: 'Founder',
    registeredOn: '2026-10-10',
    lastActive: '2026-10-17 16:20',
    lastIp: '41.90.51.22',
    loginAttempts: 0,
    twoFactor: false,
    flags: 0,
    audit: [
      { id: 'a1', action: 'Account created', detail: 'Pending employer verification', at: '2026-10-10 09:05', by: 'Self' }
    ]
  },
  {
    id: 'usr-012',
    name: 'Samuel Mwangi',
    email: 's.mwangi@thikaclothing.co.ke',
    phone: '+254 733 888 999',
    role: 'employer',
    status: 'suspended',
    avatarColor: '#6D28D9',
    initials: 'SM',
    county: 'Kiambu',
    employer: 'Thika Clothing Manufacturers',
    position: 'Production Manager',
    registeredOn: '2024-08-20',
    lastActive: '2026-10-05 11:15',
    lastIp: '105.48.44.9',
    loginAttempts: 0,
    twoFactor: true,
    flags: 1,
    suspensionReason: 'Employer suspended pending completion-record backlog resolution',
    audit: [
      { id: 'a1', action: 'Account suspended', detail: 'Employer account suspended', at: '2026-10-05 11:15', by: 'Dr. Margaret Wairimu' },
      { id: 'a2', action: 'Logged in', detail: 'Successful login', at: '2026-10-04 09:10', by: 'Self' }
    ]
  },
  {
    id: 'usr-013',
    name: 'Faith Mwikali',
    email: 'f.mwikali@africare.org',
    phone: '+254 720 666 777',
    role: 'workplace_supervisor',
    status: 'active',
    avatarColor: '#0369A1',
    initials: 'FM',
    county: 'Nairobi',
    employer: 'Africare Kenya',
    position: 'Program Manager',
    registeredOn: '2023-09-15',
    lastActive: '2026-10-18 15:22',
    lastIp: '41.90.18.77',
    loginAttempts: 0,
    twoFactor: true,
    flags: 0,
    audit: [
      { id: 'a1', action: 'Logged in', detail: 'Successful login', at: '2026-10-18 15:22', by: 'Self' },
      { id: 'a2', action: 'Assessment submitted', detail: 'Grace Achieng · mid-placement', at: '2026-10-18 15:26', by: 'Self' }
    ]
  },
  {
    id: 'usr-014',
    name: 'David Kimani',
    email: 'd.kimani@konzacity.go.ke',
    phone: '+254 733 555 666',
    role: 'employer',
    status: 'pending',
    avatarColor: '#6D28D9',
    initials: 'DK',
    county: 'Machakos',
    employer: 'Konza Technopolis Development Authority',
    position: 'Innovation Programme Officer',
    registeredOn: '2026-10-12',
    lastActive: '2026-10-18 09:10',
    lastIp: '105.48.60.14',
    loginAttempts: 0,
    twoFactor: false,
    flags: 0,
    audit: [
      { id: 'a1', action: 'Account created', detail: 'Pending employer verification', at: '2026-10-12 10:05', by: 'Self' },
      { id: 'a2', action: 'Documents uploaded', detail: 'Certificate of incorporation', at: '2026-10-12 10:12', by: 'Self' }
    ]
  },
  {
    id: 'usr-015',
    name: 'Esther Njeri',
    email: 'e.njeri@equitybank.co.ke',
    phone: '+254 711 444 555',
    role: 'employer',
    status: 'deactivated',
    avatarColor: '#9D174D',
    initials: 'EN',
    county: 'Nairobi',
    employer: 'Equity Bank Kenya',
    position: 'Graduate Programme Lead',
    registeredOn: '2023-06-30',
    lastActive: '2026-09-15 14:30',
    lastIp: '196.201.212.90',
    loginAttempts: 0,
    twoFactor: true,
    flags: 0,
    audit: [
      { id: 'a1', action: 'Account deactivated', detail: 'Self-requested deactivation', at: '2026-09-15 14:30', by: 'Self' },
      { id: 'a2', action: 'Logged in', detail: 'Successful login', at: '2026-09-15 14:20', by: 'Self' }
    ]
  },
  {
    id: 'usr-016',
    name: 'Brian Omondi',
    email: 'brian.omondi@example.com',
    phone: '+254 713 555 777',
    role: 'trainee',
    status: 'active',
    avatarColor: '#0369A1',
    initials: 'BO',
    county: 'Kisumu',
    institution: 'Kisumu National Polytechnic',
    programme: 'Diploma in Mechanical Engineering',
    registeredOn: '2025-01-20',
    lastActive: '2026-10-19 18:04',
    lastIp: '41.90.51.90',
    loginAttempts: 1,
    twoFactor: false,
    flags: 0,
    audit: [
      { id: 'a1', action: 'Logged in', detail: 'Successful login', at: '2026-10-19 18:04', by: 'Self' },
      { id: 'a2', action: 'Password reset requested', detail: 'One failed attempt before reset', at: '2026-10-19 17:55', by: 'Self' }
    ]
  },
  {
    id: 'usr-017',
    name: 'Mercy Wambui',
    email: 'mercy.wambui@example.com',
    phone: '+254 720 333 444',
    role: 'institution_supervisor',
    status: 'active',
    avatarColor: '#7E22CE',
    initials: 'MW',
    county: 'Nakuru',
    institution: 'Nakuru Technical Training Institute',
    position: 'Industrial Liaison Officer',
    registeredOn: '2023-08-21',
    lastActive: '2026-10-18 11:20',
    lastIp: '41.90.33.18',
    loginAttempts: 0,
    twoFactor: true,
    flags: 0,
    audit: [
      { id: 'a1', action: 'Logged in', detail: 'Successful login', at: '2026-10-18 11:20', by: 'Self' },
      { id: 'a2', action: 'Supervisor appointed', detail: '3 new supervisors assigned', at: '2026-10-18 11:25', by: 'Self' }
    ]
  },
  {
    id: 'usr-018',
    name: 'Hassan Ali',
    email: 'h.ali@mombasacement.com',
    phone: '+254 722 444 555',
    role: 'employer',
    status: 'active',
    avatarColor: '#0C4A6E',
    initials: 'HA',
    county: 'Mombasa',
    employer: 'Mombasa Cement Ltd',
    position: 'HR Manager',
    registeredOn: '2024-04-08',
    lastActive: '2026-10-17 10:12',
    lastIp: '196.201.213.20',
    loginAttempts: 0,
    twoFactor: true,
    flags: 0,
    audit: [
      { id: 'a1', action: 'Logged in', detail: 'Successful login', at: '2026-10-17 10:12', by: 'Self' }
    ]
  },
  {
    id: 'usr-019',
    name: 'Ann Wairimu',
    email: 'ann.wairimu@example.com',
    phone: '+254 722 888 999',
    role: 'trainee',
    status: 'pending',
    avatarColor: '#854D0E',
    initials: 'AW',
    county: 'Kiambu',
    institution: 'Kiambu Institute of Science and Technology',
    programme: 'Diploma in Information Communication Technology',
    registeredOn: '2026-10-18',
    lastActive: '2026-10-19 09:05',
    lastIp: '105.48.22.4',
    loginAttempts: 0,
    twoFactor: false,
    flags: 0,
    audit: [
      { id: 'a1', action: 'Account created', detail: 'Pending institution verification', at: '2026-10-18 08:00', by: 'Self' }
    ]
  },
  {
    id: 'usr-020',
    name: 'Kevin Mwangi',
    email: 'kevin.mwangi@example.com',
    phone: '+254 711 777 888',
    role: 'trainee',
    status: 'deactivated',
    avatarColor: '#065F46',
    initials: 'KM',
    county: 'Machakos',
    institution: 'Machakos Technical Institute for the Blind',
    programme: 'Certificate in Assistive Technology',
    registeredOn: '2024-09-12',
    lastActive: '2026-08-22 16:45',
    lastIp: '197.232.14.78',
    loginAttempts: 0,
    twoFactor: false,
    flags: 0,
    audit: [
      { id: 'a1', action: 'Account deactivated', detail: 'Admin deactivation - 60 days inactive', at: '2026-08-22 16:45', by: 'System schedule' },
      { id: 'a2', action: 'Logged in', detail: 'Last successful login', at: '2026-06-20 10:15', by: 'Self' }
    ]
  }
]