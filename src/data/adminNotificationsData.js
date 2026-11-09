// src/data/adminNotificationsData.js

export const NOTIFICATION_CHANNELS = [
  { key: 'inApp', label: 'In-app', icon: 'fa-mobile-screen', color: 'purple', enabled: true },
  { key: 'email', label: 'Email', icon: 'fa-envelope', color: 'info', enabled: true },
  { key: 'sms', label: 'SMS', icon: 'fa-comment-sms', color: 'success', enabled: true },
  { key: 'whatsapp', label: 'WhatsApp', icon: 'fa-whatsapp', color: 'warning', enabled: false }
]

export const CHANNEL_HEALTH = [
  {
    key: 'inApp',
    label: 'In-app',
    icon: 'fa-mobile-screen',
    status: 'healthy',
    sent24h: 1842,
    delivered24h: 1842,
    failed24h: 0,
    deliveryRate: 100,
    provider: 'Internal',
    lastSync: '2026-10-20 09:50'
  },
  {
    key: 'email',
    label: 'Email',
    icon: 'fa-envelope',
    status: 'healthy',
    sent24h: 962,
    delivered24h: 948,
    failed24h: 14,
    deliveryRate: 98.5,
    provider: 'SMTP relay',
    lastSync: '2026-10-20 09:50'
  },
  {
    key: 'sms',
    label: 'SMS',
    icon: 'fa-comment-sms',
    status: 'degraded',
    sent24h: 418,
    delivered24h: 382,
    failed24h: 36,
    deliveryRate: 91.4,
    provider: "Africa's Talking",
    lastSync: '2026-10-20 09:50'
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    icon: 'fa-whatsapp',
    status: 'not-configured',
    sent24h: 0,
    delivered24h: 0,
    failed24h: 0,
    deliveryRate: 0,
    provider: 'WhatsApp Business API',
    lastSync: null
  }
]

export const NOTIFICATION_SUMMARY = {
  sent24h: 3222,
  delivered24h: 3172,
  failed24h: 50,
  queued: 12,
  templates: 14,
  activeTemplates: 12,
  deliveryRate: 98.4
}

/**
 * Templates - each has subject/body variants, default channels, and status.
 */
export const NOTIFICATION_TEMPLATES = [
  {
    id: 'tpl-001',
    key: 'registrationReceived',
    name: 'Registration received',
    description: 'Sent when a trainee, employer or institution completes registration.',
    category: 'Account',
    channels: ['inApp', 'email', 'sms'],
    status: 'active',
    lastEdited: '2026-10-18',
    editedBy: 'Dr. Margaret Wairimu',
    sent24h: 186,
    deliveryRate: 99.2,
    subject: 'Welcome to Ujuzi Link - verify your account',
    body:
      'Hi {{firstName}},\n\nYour Ujuzi Link account has been created. Use the code below to verify your account and start exploring workplace-learning opportunities.\n\nVerification code: {{code}}\n\nThe code expires in 10 minutes.\n\nNeed help? Contact support@ujizilink.go.ke\n\n- The Ujuzi Link team'
  },
  {
    id: 'tpl-002',
    key: 'applicationReceived',
    name: 'Application received',
    description: 'Sent to the trainee when their application is submitted successfully.',
    category: 'Applications',
    channels: ['inApp', 'email'],
    status: 'active',
    lastEdited: '2026-10-14',
    editedBy: 'Dr. Margaret Wairimu',
    sent24h: 212,
    deliveryRate: 99.8,
    subject: 'Application received: {{opportunityTitle}}',
    body:
      'Hi {{firstName}},\n\nYour application for "{{opportunityTitle}}" at {{employerName}} has been received. We\'ll notify you when the employer reviews your application.\n\nYou can track the status from your dashboard.\n\n- The Ujuzi Link team'
  },
  {
    id: 'tpl-003',
    key: 'applicationStatusChanged',
    name: 'Application status changed',
    description: 'Sent when an employer updates an application status (shortlisted, rejected, etc.).',
    category: 'Applications',
    channels: ['inApp', 'email', 'sms'],
    status: 'active',
    lastEdited: '2026-10-16',
    editedBy: 'Dr. Margaret Wairimu',
    sent24h: 94,
    deliveryRate: 97.8,
    subject: 'Update on your application: {{opportunityTitle}}',
    body:
      'Hi {{firstName}},\n\nYour application for "{{opportunityTitle}}" at {{employerName}} has been updated.\n\nNew status: {{status}}\n\nLog in to your dashboard for full details.\n\n- The Ujuzi Link team'
  },
  {
    id: 'tpl-004',
    key: 'interviewInvitation',
    name: 'Interview invitation',
    description: 'Sent when an employer schedules an interview or assessment.',
    category: 'Applications',
    channels: ['inApp', 'email', 'sms', 'whatsapp'],
    status: 'active',
    lastEdited: '2026-10-20',
    editedBy: 'Dr. Margaret Wairimu',
    sent24h: 28,
    deliveryRate: 98.2,
    subject: 'Interview invitation: {{opportunityTitle}}',
    body:
      'Hi {{firstName}},\n\n{{employerName}} would like to invite you for an interview for "{{opportunityTitle}}".\n\nDate: {{interviewDate}}\nTime: {{interviewTime}}\nLocation: {{interviewLocation}}\n\nPlease confirm your attendance from your dashboard.\n\n- The Ujuzi Link team'
  },
  {
    id: 'tpl-005',
    key: 'offerIssued',
    name: 'Placement offer issued',
    description: 'Sent when an employer issues a placement offer.',
    category: 'Placements',
    channels: ['inApp', 'email', 'sms', 'whatsapp'],
    status: 'active',
    lastEdited: '2026-10-18',
    editedBy: 'Dr. Margaret Wairimu',
    sent24h: 18,
    deliveryRate: 100,
    subject: 'Placement offer: {{opportunityTitle}}',
    body:
      'Hi {{firstName}},\n\nCongratulations! {{employerName}} has offered you a placement for "{{opportunityTitle}}".\n\nStart date: {{startDate}}\nDuration: {{duration}}\nStipend: {{stipend}}\n\nPlease accept or decline the offer by {{deadline}}.\n\n- The Ujuzi Link team'
  },
  {
    id: 'tpl-006',
    key: 'offerDeadlineReminder',
    name: 'Offer deadline reminder',
    description: 'Sent 48 hours before an offer deadline if the trainee hasn\'t responded.',
    category: 'Placements',
    channels: ['inApp', 'email', 'sms'],
    status: 'active',
    lastEdited: '2026-10-12',
    editedBy: 'Dr. Margaret Wairimu',
    sent24h: 6,
    deliveryRate: 100,
    subject: 'Reminder: respond to your placement offer',
    body:
      'Hi {{firstName}},\n\nThis is a reminder to respond to the placement offer from {{employerName}} for "{{opportunityTitle}}".\n\nYour offer expires on {{deadline}}.\n\n- The Ujuzi Link team'
  },
  {
    id: 'tpl-007',
    key: 'placementStartReminder',
    name: 'Placement start reminder',
    description: 'Sent 3 days before a confirmed placement start date.',
    category: 'Placements',
    channels: ['inApp', 'email', 'sms'],
    status: 'active',
    lastEdited: '2026-10-10',
    editedBy: 'Dr. Margaret Wairimu',
    sent24h: 14,
    deliveryRate: 99.1,
    subject: 'Your placement starts soon',
    body:
      'Hi {{firstName}},\n\nYour placement at {{employerName}} begins on {{startDate}}. Please confirm you have reviewed the learning plan and workplace requirements.\n\nSupervisor: {{supervisorName}}\nLocation: {{workplace}}\n\n- The Ujuzi Link team'
  },
  {
    id: 'tpl-008',
    key: 'certificateAvailable',
    name: 'Certificate available',
    description: 'Sent when a completion certificate is issued.',
    category: 'Placements',
    channels: ['inApp', 'email'],
    status: 'active',
    lastEdited: '2026-09-28',
    editedBy: 'Dr. Margaret Wairimu',
    sent24h: 8,
    deliveryRate: 100,
    subject: 'Your completion certificate is ready',
    body:
      'Hi {{firstName}},\n\nYour completion certificate for "{{opportunityTitle}}" is now available in your digital learning passport.\n\nView and download it from your dashboard.\n\n- The Ujuzi Link team'
  },
  {
    id: 'tpl-009',
    key: 'newOpportunityMatch',
    name: 'New opportunity match',
    description: 'Sent when a matching opportunity is posted (AI matching feature flag dependent).',
    category: 'Opportunities',
    channels: ['inApp'],
    status: 'active',
    lastEdited: '2026-10-17',
    editedBy: 'Dr. Margaret Wairimu',
    sent24h: 412,
    deliveryRate: 100,
    subject: 'New opportunity match: {{opportunityTitle}}',
    body:
      'Hi {{firstName}},\n\nA new opportunity matching your profile is available: "{{opportunityTitle}}" at {{employerName}}.\n\nMatch reason: {{matchReason}}\n\n- The Ujuzi Link team'
  },
  {
    id: 'tpl-010',
    key: 'complaintReceived',
    name: 'Complaint received',
    description: 'Sent to the reporter when a complaint or safeguarding report is received.',
    category: 'Support',
    channels: ['inApp', 'email'],
    status: 'active',
    lastEdited: '2026-10-05',
    editedBy: 'Dr. Margaret Wairimu',
    sent24h: 2,
    deliveryRate: 100,
    subject: 'We have received your report',
    body:
      'Hi {{firstName}},\n\nWe have received your report (reference {{referenceId}}) and our safeguarding team is reviewing it. We will keep you updated on progress.\n\nIf your situation is urgent, please also call our safeguarding hotline.\n\n- The Ujuzi Link team'
  },
  {
    id: 'tpl-011',
    key: 'complaintUpdate',
    name: 'Complaint status update',
    description: 'Sent when the status of a complaint changes.',
    category: 'Support',
    channels: ['inApp', 'email'],
    status: 'active',
    lastEdited: '2026-10-05',
    editedBy: 'Dr. Margaret Wairimu',
    sent24h: 0,
    deliveryRate: 100,
    subject: 'Update on your report ({{referenceId}})',
    body:
      'Hi {{firstName}},\n\nThere is an update on your report {{referenceId}}.\n\nNew status: {{status}}\n\nLog in to your dashboard for details.\n\n- The Ujuzi Link team'
  },
  {
    id: 'tpl-012',
    key: 'verificationPending',
    name: 'Verification pending',
    description: 'Sent to employers/institutions when admin begins verification.',
    category: 'Account',
    channels: ['inApp', 'email'],
    status: 'active',
    lastEdited: '2026-09-15',
    editedBy: 'Dr. Margaret Wairimu',
    sent24h: 4,
    deliveryRate: 100,
    subject: 'Your account verification is in progress',
    body:
      'Hi {{firstName}},\n\nOur team has begun verifying your account. This typically takes 1–3 working days.\n\nWe may contact you if we need additional documents.\n\n- The Ujuzi Link team'
  },
  {
    id: 'tpl-013',
    key: 'safeguardingAlert',
    name: 'Safeguarding alert (internal)',
    description: 'Internal alert to the safeguarding team when a serious report is received.',
    category: 'Internal',
    channels: ['inApp', 'email', 'sms'],
    status: 'active',
    lastEdited: '2026-10-20',
    editedBy: 'Dr. Margaret Wairimu',
    sent24h: 1,
    deliveryRate: 100,
    subject: '[URGENT] Safeguarding report - {{category}}',
    body:
      'A new safeguarding report has been received.\n\nSeverity: {{severity}}\nTarget: {{target}}\nReporter: {{reporter}}\n\nReview immediately in the admin complaints queue.\n\n- Ujuzi Link (internal)'
  },
  {
    id: 'tpl-014',
    key: 'weeklyDigest',
    name: 'Weekly digest',
    description: 'Weekly summary of new opportunities and platform activity.',
    category: 'Digest',
    channels: ['email'],
    status: 'paused',
    lastEdited: '2026-09-10',
    editedBy: 'Dr. Margaret Wairimu',
    sent24h: 0,
    deliveryRate: 100,
    subject: 'Your week on Ujuzi Link',
    body:
      'Hi {{firstName}},\n\nHere are the highlights from your week on Ujuzi Link:\n\n{{digestItems}}\n\n- The Ujuzi Link team'
  }
]

/**
 * Delivery log - recent notifications, including failures.
 */
export const NOTIFICATION_LOG = [
  {
    id: 'log-01',
    templateKey: 'safeguardingAlert',
    templateName: 'Safeguarding alert (internal)',
    channel: 'sms',
    recipient: 'Safeguarding team (3 recipients)',
    recipientRole: 'admin',
    status: 'delivered',
    sentAt: '2026-10-20 09:48',
    deliveredAt: '2026-10-20 09:48',
    ref: 'CareerLink Services Ltd - Fraud',
    error: null
  },
  {
    id: 'log-02',
    templateKey: 'offerIssued',
    templateName: 'Placement offer issued',
    channel: 'whatsapp',
    recipient: 'Grace Achieng',
    recipientRole: 'trainee',
    status: 'failed',
    sentAt: '2026-10-20 09:42',
    deliveredAt: null,
    ref: 'Safaricom PLC - Software Development Intern',
    error: 'WhatsApp channel not configured'
  },
  {
    id: 'log-03',
    templateKey: 'offerIssued',
    templateName: 'Placement offer issued',
    channel: 'email',
    recipient: 'Grace Achieng',
    recipientRole: 'trainee',
    status: 'delivered',
    sentAt: '2026-10-20 09:42',
    deliveredAt: '2026-10-20 09:42',
    ref: 'Safaricom PLC - Software Development Intern',
    error: null
  },
  {
    id: 'log-04',
    templateKey: 'applicationStatusChanged',
    templateName: 'Application status changed',
    channel: 'sms',
    recipient: 'Brian Omondi',
    recipientRole: 'trainee',
    status: 'failed',
    sentAt: '2026-10-20 09:30',
    deliveredAt: null,
    ref: 'KenGen - Mechanical Engineering Apprentice',
    error: 'Invalid phone number format'
  },
  {
    id: 'log-05',
    templateKey: 'applicationReceived',
    templateName: 'Application received',
    channel: 'email',
    recipient: 'Jane Wanjiku',
    recipientRole: 'trainee',
    status: 'delivered',
    sentAt: '2026-10-20 09:22',
    deliveredAt: '2026-10-20 09:22',
    ref: 'Kenya Power - Electrical Installation Technician Attachment',
    error: null
  },
  {
    id: 'log-06',
    templateKey: 'interviewInvitation',
    templateName: 'Interview invitation',
    channel: 'email',
    recipient: 'Grace Achieng',
    recipientRole: 'trainee',
    status: 'delivered',
    sentAt: '2026-10-20 08:55',
    deliveredAt: '2026-10-20 08:55',
    ref: 'Safaricom PLC - Software Development Intern',
    error: null
  },
  {
    id: 'log-07',
    templateKey: 'registrationReceived',
    templateName: 'Registration received',
    channel: 'sms',
    recipient: 'Ann Wairimu',
    recipientRole: 'trainee',
    status: 'delivered',
    sentAt: '2026-10-20 08:42',
    deliveredAt: '2026-10-20 08:43',
    ref: 'Account registration',
    error: null
  },
  {
    id: 'log-08',
    templateKey: 'registrationReceived',
    templateName: 'Registration received',
    channel: 'email',
    recipient: 'Ann Wairimu',
    recipientRole: 'trainee',
    status: 'delivered',
    sentAt: '2026-10-20 08:42',
    deliveredAt: '2026-10-20 08:42',
    ref: 'Account registration',
    error: null
  },
  {
    id: 'log-09',
    templateKey: 'newOpportunityMatch',
    templateName: 'New opportunity match',
    channel: 'inApp',
    recipient: '412 trainees matched',
    recipientRole: 'trainee',
    status: 'delivered',
    sentAt: '2026-10-20 08:00',
    deliveredAt: '2026-10-20 08:00',
    ref: 'Konza Technopolis - Smart City Innovation Intern',
    error: null
  },
  {
    id: 'log-10',
    templateKey: 'applicationStatusChanged',
    templateName: 'Application status changed',
    channel: 'sms',
    recipient: 'Kevin Mwangi',
    recipientRole: 'trainee',
    status: 'failed',
    sentAt: '2026-10-19 22:12',
    deliveredAt: null,
    ref: 'Thika Clothing - Garment Production Trainee',
    error: 'Recipient account deactivated'
  },
  {
    id: 'log-11',
    templateKey: 'placementStartReminder',
    templateName: 'Placement start reminder',
    channel: 'sms',
    recipient: 'Brian Omondi',
    recipientRole: 'trainee',
    status: 'delivered',
    sentAt: '2026-10-19 18:30',
    deliveredAt: '2026-10-19 18:31',
    ref: 'Mombasa Cement - Manufacturing Process Trainee',
    error: null
  },
  {
    id: 'log-12',
    templateKey: 'verificationPending',
    templateName: 'Verification pending',
    channel: 'email',
    recipient: 'Mary Achieng (Twiga Foods)',
    recipientRole: 'employer',
    status: 'delivered',
    sentAt: '2026-10-19 16:40',
    deliveredAt: '2026-10-19 16:40',
    ref: 'Employer verification',
    error: null
  }
]