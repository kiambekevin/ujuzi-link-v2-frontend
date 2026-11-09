// src/data/adminSettingsData.js

export const SETTINGS_SECTIONS = [
  { key: 'general', label: 'General', icon: 'fa-sliders', desc: 'Platform identity and defaults' },
  { key: 'verification', label: 'Verification rules', icon: 'fa-user-check', desc: 'How users and listings get verified' },
  { key: 'notifications', label: 'Notifications', icon: 'fa-bell', desc: 'Channels, templates and delivery' },
  { key: 'privacy', label: 'Data & privacy', icon: 'fa-shield-halved', desc: 'Retention, consent and data requests' },
  { key: 'roles', label: 'Roles & permissions', icon: 'fa-user-lock', desc: 'Who can do what' },
  { key: 'integrations', label: 'Integrations', icon: 'fa-plug', desc: 'External systems and APIs' },
  { key: 'features', label: 'Feature flags', icon: 'fa-toggle-on', desc: 'Roll out features gradually' }
]

export const DEFAULT_GENERAL = {
  platformName: 'Ujuzi Link',
  platformTagline: 'National TVET Work-Based Learning Placement System',
  supportEmail: 'support@ujizilink.go.ke',
  supportPhone: '+254 20 000 0100',
  defaultCounty: 'Nairobi',
  defaultLanguage: 'en',
  timezone: 'Africa/Nairobi',
  dateFormat: 'DD MMM YYYY',
  maintenanceMode: false,
  registrationOpen: true,
  publicDirectory: true
}

export const DEFAULT_VERIFICATION = {
  autoApproveTrainees: false,
  autoApproveEmployers: false,
  requireInstitutionApproval: true,
  requireTvetaCheck: true,
  requireKraCheck: true,
  requireNitaCheck: true,
  employerDocRequirements: [
    { key: 'certIncorporation', label: 'Certificate of incorporation', required: true },
    { key: 'kraPin', label: 'KRA PIN certificate', required: true },
    { key: 'nitaReg', label: 'NITA registration', required: true },
    { key: 'safetyPolicy', label: 'Workplace safety policy', required: false },
    { key: 'insuranceCover', label: 'Trainee insurance cover', required: false }
  ],
  maxVerificationDays: 14,
  reVerificationMonths: 24
}

export const DEFAULT_NOTIFICATIONS = {
  channels: {
    inApp: true,
    email: true,
    sms: true,
    whatsapp: false
  },
  events: {
    registrationReceived: { inApp: true, email: true, sms: true, whatsapp: false },
    applicationReceived: { inApp: true, email: true, sms: false, whatsapp: false },
    applicationStatusChanged: { inApp: true, email: true, sms: true, whatsapp: false },
    interviewInvitation: { inApp: true, email: true, sms: true, whatsapp: true },
    offerIssued: { inApp: true, email: true, sms: true, whatsapp: true },
    offerDeadlineReminder: { inApp: true, email: true, sms: true, whatsapp: false },
    placementStartReminder: { inApp: true, email: true, sms: true, whatsapp: false },
    certificateAvailable: { inApp: true, email: true, sms: false, whatsapp: false },
    newOpportunityMatch: { inApp: true, email: false, sms: false, whatsapp: false }
  },
  quietHoursStart: '21:00',
  quietHoursEnd: '07:00',
  digestFrequency: 'daily'
}

export const DEFAULT_PRIVACY = {
  retention: {
    traineeProfilesMonths: 60,
    applicationRecordsMonths: 36,
    placementRecordsMonths: 84,
    auditLogsMonths: 48,
    deletedAccountGraceDays: 30
  },
  consent: {
    requireExplicitConsent: true,
    allowAnalytics: true,
    allowMarketingEmails: false,
    allowThirdPartySharing: false
  },
  dataRequests: {
    autoAcknowledge: true,
    responseDeadlineDays: 30,
    requireIdentityVerification: true,
    notifyDpo: true
  },
  dpo: {
    name: 'Adv. Wanjiku Mwaura',
    email: 'dpo@ujizilink.go.ke',
    phone: '+254 20 000 0101'
  }
}

export const DEFAULT_ROLES = [
  {
    key: 'trainee',
    label: 'Trainee',
    permissions: {
      browseOpportunities: true,
      applyToOpportunities: true,
      viewOwnProfile: true,
      editOwnProfile: true,
      uploadDocuments: true,
      raiseComplaints: true,
      viewOwnPlacements: true,
      submitLogbooks: true
    }
  },
  {
    key: 'employer',
    label: 'Employer officer',
    permissions: {
      postOpportunities: true,
      reviewApplications: true,
      issueOffers: true,
      assignSupervisors: true,
      monitorPlacements: true,
      confirmCompletion: true,
      viewTraineeProfiles: true,
      downloadReports: true
    }
  },
  {
    key: 'institution',
    label: 'Institution officer',
    permissions: {
      verifyTrainees: true,
      approvePlacements: true,
      assignSupervisors: true,
      viewPlacementProgress: true,
      validateCompletion: true,
      downloadReports: true,
      manageProgrammes: true
    }
  },
  {
    key: 'workplace_supervisor',
    label: 'Workplace supervisor',
    permissions: {
      viewAssignedTrainees: true,
      approveLogbooks: true,
      submitAssessments: true,
      confirmCompletion: true
    }
  },
  {
    key: 'institution_supervisor',
    label: 'Institution supervisor',
    permissions: {
      viewAssignedTrainees: true,
      reviewLearningPlans: true,
      monitorProgress: true,
      validateCompletion: true,
      submitAssessments: true
    }
  },
  {
    key: 'admin',
    label: 'Administrator',
    permissions: {
      manageUsers: true,
      verifyEmployers: true,
      verifyInstitutions: true,
      moderateOpportunities: true,
      handleComplaints: true,
      viewAllReports: true,
      configurePlatform: true,
      viewAuditLog: true
    }
  }
]

export const DEFAULT_INTEGRATIONS = {
  nita: {
    enabled: true,
    label: 'National Industrial Training Authority',
    status: 'connected',
    lastSync: '2026-10-20 06:00',
    mode: 'read-only'
  },
  tveta: {
    enabled: true,
    label: 'Technical and Vocational Education and Training Authority',
    status: 'connected',
    lastSync: '2026-10-19 22:00',
    mode: 'two-way'
  },
  kra: {
    enabled: true,
    label: 'Kenya Revenue Authority — PIN verification',
    status: 'connected',
    lastSync: '2026-10-20 08:30',
    mode: 'read-only'
  },
  smsGateway: {
    enabled: true,
    label: 'Africa\'s Talking — SMS',
    status: 'connected',
    lastSync: '2026-10-20 09:00',
    mode: 'send-only'
  },
  whatsappApi: {
    enabled: false,
    label: 'WhatsApp Business API',
    status: 'not-configured',
    lastSync: null,
    mode: 'send-only'
  },
  emailProvider: {
    enabled: true,
    label: 'SMTP relay',
    status: 'connected',
    lastSync: '2026-10-20 09:00',
    mode: 'send-only'
  },
  countyPayments: {
    enabled: false,
    label: 'County stipend disbursement',
    status: 'not-configured',
    lastSync: null,
    mode: 'read-only'
  }
}

export const DEFAULT_FEATURES = [
  { key: 'aiMatching', label: 'AI opportunity matching', desc: 'Personalise recommendations using skills and interests.', enabled: false, category: 'Matching' },
  { key: 'advancedAnalytics', label: 'Advanced analytics', desc: 'Drill-down charts, cohort analysis and custom filters.', enabled: true, category: 'Reporting' },
  { key: 'digitalPassport', label: 'Digital learning passport', desc: 'Verified portfolio of completed workplace-learning experiences.', enabled: true, category: 'Trainee' },
  { key: 'inAppMessaging', label: 'In-app messaging', desc: 'Direct messaging between trainees and employers.', enabled: true, category: 'Communication' },
  { key: 'whatsappNotifications', label: 'WhatsApp notifications', desc: 'Send key updates via WhatsApp Business API.', enabled: false, category: 'Communication' },
  { key: 'smsNotifications', label: 'SMS notifications', desc: 'Send key updates via SMS gateway.', enabled: true, category: 'Communication' },
  { key: 'geoSearch', label: 'Nearby opportunities', desc: 'Location-based search with optional sharing.', enabled: true, category: 'Matching' },
  { key: 'institutionIntegrations', label: 'Institution system integrations', desc: 'Verify student status with university/TVET systems.', enabled: false, category: 'Integrations' },
  { key: 'publicDirectory', label: 'Public opportunity directory', desc: 'Allow unauthenticated browsing of approved listings.', enabled: true, category: 'Trainee' },
  { key: 'bulkImport', label: 'Bulk user import', desc: 'Admins can import trainees/employers from CSV.', enabled: false, category: 'Admin' }
]

export const RECENT_SETTINGS_CHANGES = [
  { id: 'chg-01', field: 'notifications.channels.sms', from: 'off', to: 'on', by: 'Dr. Margaret Wairimu', at: '2026-10-20 09:12' },
  { id: 'chg-02', field: 'features.aiMatching', from: 'on', to: 'off', by: 'Dr. Margaret Wairimu', at: '2026-10-19 16:48' },
  { id: 'chg-03', field: 'verification.requireKraCheck', from: 'off', to: 'on', by: 'Dr. Margaret Wairimu', at: '2026-10-18 11:30' },
  { id: 'chg-04', field: 'privacy.retention.applicationRecordsMonths', from: '24', to: '36', by: 'Dr. Margaret Wairimu', at: '2026-10-15 14:02' },
  { id: 'chg-05', field: 'general.maintenanceMode', from: 'on', to: 'off', by: 'System schedule', at: '2026-10-12 22:00' }
]