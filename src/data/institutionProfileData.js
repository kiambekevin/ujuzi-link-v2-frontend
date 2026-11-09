// src/data/institutionProfileData.js

export const INSTITUTIONS = {
  // Keyed by institution name (matches PENDING_VERIFICATIONS.institution)
  'Nairobi Technical Training Institute': {
    id: 'ntti-001',
    name: 'Nairobi Technical Training Institute',
    abbreviation: 'NTTI',
    code: 'TVETA/INST/001',
    type: 'Technical Training Institute',
    tagline: 'Skills for industry, competence for life.',
    description:
      'Nairobi Technical Training Institute (NTTI) is a public TVET institution established in 1961 and registered with TVETA. We offer competency-based training in engineering, ICT, business and applied sciences, with a strong focus on industry linkages and workplace learning. Our vision is to be a centre of excellence for technical skills development in Kenya.',
    founded: '1961',
    ownership: 'Public (Government)',
    county: 'Nairobi',
    town: 'Nairobi',
    street: 'Ngong Road',
    building: 'Main Campus',
    postal: 'P.O. Box 30030 – 00100, Nairobi',
    phone: '+254 20 555 0100',
    altPhone: '+254 711 223 344',
    email: 'info@ntti.ac.ke',
    placementEmail: 'placements@ntti.ac.ke',
    website: 'https://www.ntti.ac.ke',
    placementPhone: '+254 20 555 0123',
    socials: {
      facebook: 'https://facebook.com/ntti.kenya',
      twitter: 'https://x.com/ntti_kenya',
      linkedin: 'https://linkedin.com/company/ntti',
      instagram: 'https://instagram.com/ntti_kenya'
    },
    tvetaStatus: 'Fully accredited',
    tvetaExpiry: '2027-06-30',
    nitaReg: 'NITA/TRN/2018/0456',
    kraPin: 'P051234567X',
    studentCount: 3420,
    supervisorCount: 48,
    sectors: ['Engineering', 'ICT & Digital', 'Business & Finance'],
    levels: [
      'TVET Level 3 (Artisan)',
      'TVET Level 4 (Craft)',
      'TVET Level 5 (Technician)',
      'TVET Level 6 (Diploma)'
    ],
    programmes: [
      'Diploma in Electrical Installation',
      'Diploma in Mechanical Engineering',
      'Diploma in Software Development',
      'Diploma in Civil Engineering',
      'Craft Certificate in Automotive Engineering',
      'Craft Certificate in Welding & Fabrication'
    ],
    placementOffice: {
      name: 'Industry Liaison & Placement Office',
      head: 'Dr. Alice Wambui',
      headTitle: 'Head, Industry Liaison & Placement',
      headEmail: 'a.wambui@ntti.ac.ke',
      headPhone: '+254 711 998 877'
    },
    brandColor: '#4B0082',
    visibility: 'public',
    registeredOn: '2023-03-14',
    lastUpdated: '2026-10-18',
    verificationStatus: 'verified',
    pendingVerification: null
  },

  'Kenya Institute of Management': {
    id: 'kim-002',
    name: 'Kenya Institute of Management',
    abbreviation: 'KIM',
    code: 'TVETA/INST/014',
    type: 'TVET College',
    tagline: 'Developing leaders for business and industry.',
    description:
      'The Kenya Institute of Management (KIM) is a private management development institution established in 1954. KIM offers certificate, diploma and professional programmes in business, management, ICT and related fields, and works closely with employers to provide structured workplace learning.',
    founded: '1954',
    ownership: 'Private',
    county: 'Nairobi',
    town: 'Nairobi',
    street: 'Kilimani Road',
    building: 'KIM Campus',
    postal: 'P.O. Box 43706 – 00100, Nairobi',
    phone: '+254 20 444 5000',
    altPhone: '+254 722 100 200',
    email: 'info@kim.ac.ke',
    placementEmail: 'placements@kim.ac.ke',
    website: 'https://www.kim.ac.ke',
    placementPhone: '+254 20 444 5123',
    socials: {
      facebook: 'https://facebook.com/kimkenya',
      twitter: 'https://x.com/kim_kenya',
      linkedin: 'https://linkedin.com/company/kim-kenya',
      instagram: ''
    },
    tvetaStatus: 'Fully accredited',
    tvetaExpiry: '2028-01-31',
    nitaReg: 'NITA/TRN/2019/0781',
    kraPin: 'P051987654Y',
    studentCount: 1860,
    supervisorCount: 32,
    sectors: ['Business & Finance', 'ICT & Digital', 'Education'],
    levels: ['TVET Level 5 (Technician)', 'TVET Level 6 (Diploma)', 'Degree'],
    programmes: [
      'Diploma in Business Management',
      'Diploma in Supply Chain Management',
      'Certificate in Accounting',
      'Diploma in Information Communication Technology'
    ],
    placementOffice: {
      name: 'Career Services & Placement Office',
      head: 'Mr. Peter Mwangi',
      headTitle: 'Manager, Career Services',
      headEmail: 'p.mwangi@kim.ac.ke',
      headPhone: '+254 722 556 677'
    },
    brandColor: '#0369A1',
    visibility: 'public',
    registeredOn: '2023-05-02',
    lastUpdated: '2026-10-19',
    verificationStatus: 'pending',
    pendingVerification: {
      type: 'Batch trainee verification',
      count: 42,
      submitted: '2026-10-19',
      priority: 'normal',
      note: 'Documents attached, awaiting cross-check'
    }
  },

  'Nakuru Technical Training Institute': {
    id: 'nakuru-003',
    name: 'Nakuru Technical Training Institute',
    abbreviation: 'NKTTI',
    code: 'TVETA/INST/027',
    type: 'Technical Training Institute',
    tagline: 'Skills for a changing world.',
    description:
      'Nakuru Technical Training Institute is a public TVET institution offering artisan, craft and technician programmes in engineering, building and ICT. The institute works with county enterprises to support industrial attachment and apprenticeship.',
    founded: '1972',
    ownership: 'Public (Government)',
    county: 'Nakuru',
    town: 'Nakuru',
    street: 'Kenyatta Avenue',
    building: 'Main Campus',
    postal: 'P.O. Box 1200 – 20100, Nakuru',
    phone: '+254 51 221 3300',
    altPhone: '+254 733 445 566',
    email: 'info@nkti.ac.ke',
    placementEmail: 'placements@nkti.ac.ke',
    website: 'https://www.nkti.ac.ke',
    placementPhone: '+254 51 221 3311',
    socials: {
      facebook: 'https://facebook.com/nkti.kenya',
      twitter: '',
      linkedin: '',
      instagram: ''
    },
    tvetaStatus: 'Provisionally accredited',
    tvetaExpiry: '2026-12-31',
    nitaReg: 'NITA/TRN/2020/0912',
    kraPin: 'P051345678Z',
    studentCount: 1280,
    supervisorCount: 22,
    sectors: ['Engineering', 'Construction', 'ICT & Digital'],
    levels: ['TVET Level 3 (Artisan)', 'TVET Level 4 (Craft)', 'TVET Level 5 (Technician)'],
    programmes: [
      'Diploma in Electrical Installation',
      'Craft Certificate in Plumbing',
      'Craft Certificate in Welding & Fabrication',
      'Diploma in Information Communication Technology'
    ],
    placementOffice: {
      name: 'Industrial Liaison Office',
      head: 'Ms. Jane Kariuki',
      headTitle: 'Industrial Liaison Officer',
      headEmail: 'j.kariuki@nkti.ac.ke',
      headPhone: '+254 733 889 900'
    },
    brandColor: '#065F46',
    visibility: 'public',
    registeredOn: '2023-08-21',
    lastUpdated: '2026-10-18',
    verificationStatus: 'pending',
    pendingVerification: {
      type: 'Supervisor appointment',
      count: 6,
      submitted: '2026-10-18',
      priority: 'low',
      note: 'New supervisors assigned to placements'
    }
  },

  'Kisumu National Polytechnic': {
    id: 'kisumu-004',
    name: 'Kisumu National Polytechnic',
    abbreviation: 'KNP',
    code: 'TVETA/INST/009',
    type: 'National Polytechnic',
    tagline: 'Excellence in technical education.',
    description:
      'Kisumu National Polytechnic is a public national polytechnic established in 1967. It offers diploma and higher diploma programmes in engineering, ICT, applied sciences and business, with a strong emphasis on industrial attachment and dual training in the western region.',
    founded: '1967',
    ownership: 'Public (Government)',
    county: 'Kisumu',
    town: 'Kisumu',
    street: 'Kakamega Road',
    building: 'Main Campus',
    postal: 'P.O. Box 250 – 40100, Kisumu',
    phone: '+254 57 202 2200',
    altPhone: '+254 720 334 455',
    email: 'info@kisumupoly.ac.ke',
    placementEmail: 'placements@kisumupoly.ac.ke',
    website: 'https://www.kisumupoly.ac.ke',
    placementPhone: '+254 57 202 2211',
    socials: {
      facebook: 'https://facebook.com/kisumupoly',
      twitter: 'https://x.com/kisumupoly',
      linkedin: 'https://linkedin.com/company/kisumu-national-polytechnic',
      instagram: ''
    },
    tvetaStatus: 'Fully accredited',
    tvetaExpiry: '2027-03-31',
    nitaReg: 'NITA/TRN/2017/0330',
    kraPin: 'P051556677A',
    studentCount: 2140,
    supervisorCount: 38,
    sectors: ['Engineering', 'ICT & Digital', 'Health', 'Business & Finance'],
    levels: ['TVET Level 5 (Technician)', 'TVET Level 6 (Diploma)', 'Degree'],
    programmes: [
      'Diploma in Mechanical Engineering',
      'Diploma in Civil Engineering',
      'Diploma in Software Development',
      'Diploma in Nursing'
    ],
    placementOffice: {
      name: 'Industry & Community Linkages Office',
      head: 'Dr. Tom Ochieng',
      headTitle: 'Director, Industry Linkages',
      headEmail: 't.ochieng@kisumupoly.ac.ke',
      headPhone: '+254 720 667 788'
    },
    brandColor: '#7E22CE',
    visibility: 'public',
    registeredOn: '2023-04-11',
    lastUpdated: '2026-10-17',
    verificationStatus: 'pending',
    pendingVerification: {
      type: 'Batch trainee verification',
      count: 18,
      submitted: '2026-10-17',
      priority: 'high',
      note: 'Insurance documents under review'
    }
  }
}

// Fallback used when an institution has no profile record yet
export function getInstitutionProfile(name) {
  return INSTITUTIONS[name] || null
}