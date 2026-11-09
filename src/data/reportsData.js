// src/data/reportsData.js

/**
 * Report templates - pre-built report definitions the admin can run.
 * Each template declares which datasets it pulls from and what format it renders.
 */
export const REPORT_TEMPLATES = [
  {
    id: 'placement-funnel',
    name: 'Placement funnel',
    description: 'Registrations → applications → offers → placements commenced → placements completed.',
    icon: 'fa-filter',
    color: 'purple',
    formats: ['chart', 'table', 'csv'],
    defaultRange: 'last-90',
    dataset: 'funnel'
  },
  {
    id: 'county-coverage',
    name: 'County coverage',
    description: 'Opportunities, applications and placements by county.',
    icon: 'fa-map-location-dot',
    color: 'info',
    formats: ['table', 'csv'],
    defaultRange: 'last-90',
    dataset: 'counties'
  },
  {
    id: 'sector-demand',
    name: 'Sector demand',
    description: 'Advertised opportunities, applications and placements by occupational sector.',
    icon: 'fa-chart-pie',
    color: 'success',
    formats: ['chart', 'table', 'csv'],
    defaultRange: 'last-90',
    dataset: 'sectors'
  },
  {
    id: 'employer-participation',
    name: 'Employer participation',
    description: 'Verified employers, opportunities posted, placements hosted and completion rates.',
    icon: 'fa-building',
    color: 'warning',
    formats: ['table', 'csv'],
    defaultRange: 'last-90',
    dataset: 'employers'
  },
  {
    id: 'opportunity-types',
    name: 'Opportunity types',
    description: 'Distribution across apprenticeships, internships, attachments, pupillage and more.',
    icon: 'fa-layer-group',
    color: 'purple',
    formats: ['chart', 'table', 'csv'],
    defaultRange: 'last-90',
    dataset: 'types'
  },
  {
    id: 'completion-outcomes',
    name: 'Completion & outcomes',
    description: 'Placements started, completed, discontinued, and trainee transition outcomes.',
    icon: 'fa-graduation-cap',
    color: 'success',
    formats: ['table', 'csv'],
    defaultRange: 'last-90',
    dataset: 'outcomes'
  },
  {
    id: 'satisfaction',
    name: 'Satisfaction & quality',
    description: 'Trainee and employer satisfaction, learning plan approval and supervisor coverage.',
    icon: 'fa-star',
    color: 'warning',
    formats: ['table', 'csv'],
    defaultRange: 'last-90',
    dataset: 'satisfaction'
  },
  {
    id: 'opportunity-gaps',
    name: 'Opportunity gaps',
    description: 'Counties and sectors with limited opportunities relative to trainee population.',
    icon: 'fa-triangle-exclamation',
    color: 'danger',
    formats: ['table', 'csv'],
    defaultRange: 'last-90',
    dataset: 'gaps'
  }
]

export const DATE_RANGES = [
  { key: 'last-7', label: 'Last 7 days' },
  { key: 'last-30', label: 'Last 30 days' },
  { key: 'last-90', label: 'Last 90 days' },
  { key: 'last-365', label: 'Last 12 months' },
  { key: 'custom', label: 'Custom range' }
]

/**
 * KPI cards shown at the top of the page.
 * `value` can be a number or a preformatted string (e.g. "92%").
 */
export const KPI_CARDS = [
  {
    id: 'registrations',
    label: 'Trainee registrations',
    value: 15432,
    format: 'number',
    trend: '+12%',
    trendDir: 'up',
    icon: 'fa-user-graduate',
    color: 'purple',
    note: 'vs previous 90 days'
  },
  {
    id: 'applications',
    label: 'Applications submitted',
    value: 2140,
    format: 'number',
    trend: '+18%',
    trendDir: 'up',
    icon: 'fa-file-signature',
    color: 'info',
    note: 'across 148 live opportunities'
  },
  {
    id: 'placements',
    label: 'Placements commenced',
    value: 3842,
    format: 'number',
    trend: '+15%',
    trendDir: 'up',
    icon: 'fa-briefcase',
    color: 'success',
    note: 'this reporting period'
  },
  {
    id: 'completion',
    label: 'Completion rate',
    value: 84,
    format: 'percent',
    trend: '+3%',
    trendDir: 'up',
    icon: 'fa-graduation-cap',
    color: 'warning',
    note: 'of commenced placements'
  },
  {
    id: 'employer-satisfaction',
    label: 'Employer satisfaction',
    value: 88,
    format: 'percent',
    trend: '+2%',
    trendDir: 'up',
    icon: 'fa-building',
    color: 'success',
    note: 'of surveyed employers'
  },
  {
    id: 'trainee-satisfaction',
    label: 'Trainee satisfaction',
    value: 91,
    format: 'percent',
    trend: '+5%',
    trendDir: 'up',
    icon: 'fa-face-smile',
    color: 'purple',
    note: 'of surveyed trainees'
  },
  {
    id: 'avg-time-to-place',
    label: 'Avg. time to placement',
    value: 18,
    format: 'days',
    trend: '-4',
    trendDir: 'down',
    icon: 'fa-clock',
    color: 'info',
    note: 'from application to offer'
  },
  {
    id: 'returning-employers',
    label: 'Returning employers',
    value: 64,
    format: 'percent',
    trend: '+7%',
    trendDir: 'up',
    icon: 'fa-arrows-rotate',
    color: 'warning',
    note: 'offered additional opportunities'
  }
]

/**
 * Placement funnel - one row per stage.
 * `value` is the count at that stage; `pct` is relative to the first stage.
 */
export const PLACEMENT_FUNNEL = [
  { stage: 'Trainees registered', value: 15432, pct: 100, color: '#6D28D9' },
  { stage: 'Eligible & active', value: 11204, pct: 73, color: '#7E22CE' },
  { stage: 'Applied to opportunities', value: 6842, pct: 44, color: '#8B5CF6' },
  { stage: 'Shortlisted / interviewed', value: 4120, pct: 27, color: '#A78BFA' },
  { stage: 'Received offers', value: 3208, pct: 21, color: '#C084FC' },
  { stage: 'Placements commenced', value: 3842, pct: 25, color: '#065F46' },
  { stage: 'Placements completed', value: 3228, pct: 21, color: '#047857' }
]

/**
 * County coverage - same shape as superAdminData.COUNTY_COVERAGE plus gap metrics.
 */
export const COUNTY_REPORT = [
  {
    county: 'Nairobi',
    trainees: 4620,
    employers: 428,
    opportunities: 62,
    applications: 894,
    placements: 1842,
    completed: 1584,
    pct: 100,
    gap: 'Low'
  },
  {
    county: 'Mombasa',
    trainees: 1280,
    employers: 128,
    opportunities: 18,
    applications: 236,
    placements: 486,
    completed: 402,
    pct: 26,
    gap: 'Low'
  },
  {
    county: 'Kisumu',
    trainees: 980,
    employers: 92,
    opportunities: 14,
    applications: 178,
    placements: 342,
    completed: 286,
    pct: 19,
    gap: 'Medium'
  },
  {
    county: 'Nakuru',
    trainees: 940,
    employers: 84,
    opportunities: 11,
    applications: 164,
    placements: 328,
    completed: 268,
    pct: 18,
    gap: 'Medium'
  },
  {
    county: 'Kiambu',
    trainees: 880,
    employers: 78,
    opportunities: 9,
    applications: 148,
    placements: 302,
    completed: 248,
    pct: 16,
    gap: 'Medium'
  },
  {
    county: 'Uasin Gishu',
    trainees: 720,
    employers: 64,
    opportunities: 8,
    applications: 122,
    placements: 246,
    completed: 196,
    pct: 13,
    gap: 'High'
  },
  {
    county: 'Machakos',
    trainees: 640,
    employers: 52,
    opportunities: 6,
    applications: 98,
    placements: 198,
    completed: 158,
    pct: 11,
    gap: 'High'
  },
  {
    county: 'Kakamega',
    trainees: 580,
    employers: 46,
    opportunities: 5,
    applications: 84,
    placements: 176,
    completed: 138,
    pct: 9,
    gap: 'High'
  },
  {
    county: 'Meru',
    trainees: 520,
    employers: 42,
    opportunities: 4,
    applications: 72,
    placements: 158,
    completed: 122,
    pct: 8,
    gap: 'High'
  },
  {
    county: 'Nyeri',
    trainees: 460,
    employers: 38,
    opportunities: 3,
    applications: 64,
    placements: 142,
    completed: 108,
    pct: 7,
    gap: 'High'
  }
]

/**
 * Sector demand - advertised opportunities, applications, placements.
 */
export const SECTOR_REPORT = [
  { sector: 'ICT & Digital', opportunities: 42, applications: 682, placements: 982, completed: 872, pct: 100, color: '#6D28D9' },
  { sector: 'Engineering', opportunities: 34, applications: 554, placements: 874, completed: 768, pct: 89, color: '#0369A1' },
  { sector: 'Health', opportunities: 22, applications: 312, placements: 512, completed: 448, pct: 52, color: '#9D174D' },
  { sector: 'Business & Finance', opportunities: 18, applications: 268, placements: 428, completed: 372, pct: 44, color: '#92400E' },
  { sector: 'Construction', opportunities: 14, applications: 198, placements: 386, completed: 322, pct: 39, color: '#0C4A6E' },
  { sector: 'Manufacturing', opportunities: 9, applications: 142, placements: 298, completed: 246, pct: 30, color: '#7E22CE' },
  { sector: 'Agriculture', opportunities: 6, applications: 98, placements: 202, completed: 164, pct: 21, color: '#065F46' },
  { sector: 'Energy & Utilities', opportunities: 3, applications: 64, placements: 160, completed: 132, pct: 16, color: '#854D0E' }
]

/**
 * Employer participation - top employers by placements hosted.
 */
export const EMPLOYER_REPORT = [
  { employer: 'Safaricom PLC', sector: 'ICT & Digital', verified: true, opportunities: 24, applications: 412, placements: 86, completed: 62, completionRate: 92 },
  { employer: 'Kenya Power & Lighting Co.', sector: 'Energy & Utilities', verified: true, opportunities: 18, applications: 212, placements: 142, completed: 118, completionRate: 88 },
  { employer: 'Kenya Electricity Generating Company', sector: 'Energy & Utilities', verified: true, opportunities: 15, applications: 188, placements: 118, completed: 102, completionRate: 89 },
  { employer: 'Equity Bank Kenya', sector: 'Business & Finance', verified: true, opportunities: 14, applications: 412, placements: 92, completed: 78, completionRate: 91 },
  { employer: 'Airtel Kenya', sector: 'ICT & Digital', verified: true, opportunities: 12, applications: 196, placements: 68, completed: 58, completionRate: 90 },
  { employer: 'Mombasa Cement Ltd', sector: 'Manufacturing', verified: true, opportunities: 9, applications: 64, placements: 58, completed: 46, completionRate: 79 },
  { employer: 'Britam Holdings', sector: 'Business & Finance', verified: true, opportunities: 10, applications: 84, placements: 56, completed: 48, completionRate: 87 },
  { employer: 'Bamburi Cement PLC', sector: 'Manufacturing', verified: true, opportunities: 6, applications: 52, placements: 42, completed: 36, completionRate: 86 },
  { employer: 'Africare Kenya', sector: 'Health', verified: true, opportunities: 7, applications: 18, placements: 34, completed: 28, completionRate: 84 },
  { employer: 'Thika Clothing Manufacturers', sector: 'Manufacturing', verified: false, opportunities: 5, applications: 22, placements: 14, completed: 9, completionRate: 64 }
]

/**
 * Opportunity types distribution.
 */
export const TYPE_REPORT = [
  { type: 'Internship', count: 62, pct: 100, color: '#6D28D9' },
  { type: 'Industrial attachment', count: 48, pct: 77, color: '#0369A1' },
  { type: 'Apprenticeship', count: 22, pct: 35, color: '#065F46' },
  { type: 'Volunteer', count: 12, pct: 19, color: '#9D174D' },
  { type: 'Community service learning', count: 8, pct: 13, color: '#92400E' },
  { type: 'Pupillage', count: 6, pct: 10, color: '#7E22CE' },
  { type: 'Industry visit', count: 4, pct: 6, color: '#0C4A6E' },
  { type: 'Job shadowing', count: 2, pct: 3, color: '#854D0E' }
]

/**
 * Completion & outcomes.
 */
export const OUTCOME_REPORT = [
  { outcome: 'Placements commenced', value: 3842, pct: 100, color: '#6D28D9' },
  { outcome: 'Placements completed', value: 3228, pct: 84, color: '#065F46' },
  { outcome: 'Extended beyond planned duration', value: 168, pct: 4.4, color: '#0369A1' },
  { outcome: 'Discontinued - trainee request', value: 148, pct: 3.9, color: '#92400E' },
  { outcome: 'Discontinued - employer request', value: 96, pct: 2.5, color: '#9D174D' },
  { outcome: 'Discontinued - safeguarding', value: 14, pct: 0.4, color: '#B91C1C' },
  { outcome: 'Transitioned to employment', value: 1240, pct: 32, color: '#047857' },
  { outcome: 'Transitioned to further training', value: 682, pct: 18, color: '#7E22CE' },
  { outcome: 'Self-employment / freelance', value: 214, pct: 5.6, color: '#C084FC' }
]

/**
 * Satisfaction & quality metrics.
 */
export const SATISFACTION_REPORT = [
  {
    metric: 'Trainee satisfaction',
    value: 91,
    target: 85,
    trend: '+5%',
    trendDir: 'up',
    unit: '%'
  },
  {
    metric: 'Employer satisfaction',
    value: 88,
    target: 85,
    trend: '+2%',
    trendDir: 'up',
    unit: '%'
  },
  {
    metric: 'Placements with approved learning plans',
    value: 94,
    target: 90,
    trend: '+3%',
    trendDir: 'up',
    unit: '%'
  },
  {
    metric: 'Placements with designated supervisor',
    value: 97,
    target: 95,
    trend: '+1%',
    trendDir: 'up',
    unit: '%'
  },
  {
    metric: 'Placements monitored (≥1 visit)',
    value: 89,
    target: 85,
    trend: '+4%',
    trendDir: 'up',
    unit: '%'
  },
  {
    metric: 'Placements with documented assessment',
    value: 82,
    target: 85,
    trend: '-3%',
    trendDir: 'down',
    unit: '%'
  },
  {
    metric: 'Employers requesting repeat placements',
    value: 64,
    target: 60,
    trend: '+7%',
    trendDir: 'up',
    unit: '%'
  }
]

/**
 * Opportunity gaps - counties and sectors where opportunities are limited.
 */
export const GAP_REPORT = [
  {
    scope: 'County',
    location: 'Uasin Gishu',
    trainees: 720,
    opportunities: 8,
    ratio: '90 trainees per opportunity',
    severity: 'high'
  },
  {
    scope: 'County',
    location: 'Machakos',
    trainees: 640,
    opportunities: 6,
    ratio: '107 trainees per opportunity',
    severity: 'high'
  },
  {
    scope: 'County',
    location: 'Kakamega',
    trainees: 580,
    opportunities: 5,
    ratio: '116 trainees per opportunity',
    severity: 'high'
  },
  {
    scope: 'County',
    location: 'Meru',
    trainees: 520,
    opportunities: 4,
    ratio: '130 trainees per opportunity',
    severity: 'high'
  },
  {
    scope: 'County',
    location: 'Nyeri',
    trainees: 460,
    opportunities: 3,
    ratio: '153 trainees per opportunity',
    severity: 'high'
  },
  {
    scope: 'Sector',
    location: 'Energy & Utilities',
    trainees: 820,
    opportunities: 3,
    ratio: '273 trainees per opportunity',
    severity: 'high'
  },
  {
    scope: 'Sector',
    location: 'Agriculture',
    trainees: 1240,
    opportunities: 6,
    ratio: '207 trainees per opportunity',
    severity: 'high'
  },
  {
    scope: 'Sector',
    location: 'Manufacturing',
    trainees: 1180,
    opportunities: 9,
    ratio: '131 trainees per opportunity',
    severity: 'medium'
  }
]

/**
 * Recent report exports - activity log.
 */
export const RECENT_EXPORTS = [
  { id: 'exp-01', name: 'Placement funnel', format: 'CSV', range: 'Last 90 days', generatedBy: 'Dr. Margaret Wairimu', generatedAt: '2026-10-20 10:14', size: '48 KB' },
  { id: 'exp-02', name: 'County coverage', format: 'XLSX', range: 'Last 90 days', generatedBy: 'Dr. Margaret Wairimu', generatedAt: '2026-10-18 15:32', size: '126 KB' },
  { id: 'exp-03', name: 'Sector demand', format: 'CSV', range: 'Last 30 days', generatedBy: 'System schedule', generatedAt: '2026-10-16 08:00', size: '32 KB' },
  { id: 'exp-04', name: 'Employer participation', format: 'XLSX', range: 'Last 90 days', generatedBy: 'Dr. Margaret Wairimu', generatedAt: '2026-10-14 11:20', size: '88 KB' },
  { id: 'exp-05', name: 'Satisfaction & quality', format: 'CSV', range: 'Last 12 months', generatedBy: 'System schedule', generatedAt: '2026-10-12 08:00', size: '24 KB' }
]