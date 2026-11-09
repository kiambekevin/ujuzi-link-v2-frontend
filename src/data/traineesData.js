// =============================================================
// Ujuzi Link · Trainee data
// =============================================================

// ---------- Label maps ----------
export const AVAILABILITY_LABELS = {
  available: 'Available immediately',
  open: 'Open to opportunities',
  unavailable: 'Not currently available'
}

export const LEVEL_LABELS = {
  'level-3': 'TVET Level 3',
  'level-4': 'TVET Level 4',
  'level-5': 'TVET Level 5',
  'level-6': 'TVET Level 6 (Diploma)',
  degree: 'Degree'
}

export const OPP_TYPE_LABELS = {
  attachment: 'Industrial attachment',
  internship: 'Internship',
  apprenticeship: 'Apprenticeship',
  dual: 'Dual training'
}

// ---------- Filter option lists ----------
export const SECTORS = [
  'ICT & Digital', 'Engineering', 'Health', 'Agriculture',
  'Business & Finance', 'Construction', 'Manufacturing',
  'Hospitality & Tourism', 'Energy & Utilities',
  'Transport & Logistics', 'Creative Arts & Media', 'Other'
]

export const COUNTIES = [
  'Baringo','Bomet','Bungoma','Busia','Elgeyo-Marakwet','Embu','Garissa',
  'Homa Bay','Isiolo','Kajiado','Kakamega','Kericho','Kiambu','Kilifi',
  'Kirinyaga','Kisii','Kisumu','Kitui','Kwale','Laikipia','Lamu','Machakos',
  'Makueni','Mandera','Marsabit','Meru','Migori','Mombasa',"Murang'a",
  'Nairobi','Nakuru','Nandi','Narok','Nyamira','Nyandarua','Nyeri','Samburu',
  'Siaya','Taita-Taveta','Tana River','Tharaka-Nithi','Trans Nzoia','Turkana',
  'Uasin Gishu','Vihiga','Wajir','West Pokot'
]

// ---------- Trainees (summary records for search page) ----------
export const TRAINEES = [
  {
    id: 1, firstName: 'Jane', lastName: 'Wanjiku', initials: 'JW',
    course: 'Diploma in Electrical Installation', level: 'level-6',
    levelLabel: 'TVET Level 6 (Diploma)', institution: 'Nairobi Technical Training Institute',
    sector: 'Engineering', county: 'Nairobi', gender: 'female', age: 23, experience: 1,
    availability: 'available', preferredTypes: ['attachment', 'apprenticeship'],
    skills: ['Electrical wiring', 'Circuit analysis', 'Safety protocols', 'Blueprint reading'],
    disability: false, added: '2025-10-20'
  },
  {
    id: 2, firstName: 'Peter', lastName: 'Otieno', initials: 'PO',
    course: 'Certificate in Solar PV Installation', level: 'level-4',
    levelLabel: 'TVET Level 4', institution: 'Kisumu National Polytechnic',
    sector: 'Energy & Utilities', county: 'Kisumu', gender: 'male', age: 21, experience: 0,
    availability: 'open', preferredTypes: ['attachment', 'internship'],
    skills: ['Solar PV', 'Wiring', 'Installation', 'Troubleshooting'],
    disability: false, added: '2025-10-18'
  },
  {
    id: 3, firstName: 'Grace', lastName: 'Achieng', initials: 'GA',
    course: 'Diploma in Software Development', level: 'level-6',
    levelLabel: 'TVET Level 6 (Diploma)', institution: 'Kenya Institute of Management',
    sector: 'ICT & Digital', county: 'Nairobi', gender: 'female', age: 22, experience: 1,
    availability: 'available', preferredTypes: ['internship'],
    skills: ['JavaScript', 'React', 'API', 'Python'],
    disability: false, added: '2025-10-22'
  },
  {
    id: 4, firstName: 'Samuel', lastName: 'Kipchoge', initials: 'SK',
    course: 'Craft Certificate in Automotive Engineering', level: 'level-3',
    levelLabel: 'TVET Level 3', institution: 'Eldoret National Polytechnic',
    sector: 'Engineering', county: 'Uasin Gishu', gender: 'male', age: 20, experience: 0,
    availability: 'open', preferredTypes: ['apprenticeship', 'dual'],
    skills: ['Vehicle diagnostics', 'Engine repair', 'Welding'],
    disability: false, added: '2025-10-15'
  },
  {
    id: 5, firstName: 'Mary', lastName: 'Muthoni', initials: 'MM',
    course: 'Diploma in Nursing', level: 'level-6',
    levelLabel: 'TVET Level 6 (Diploma)', institution: 'Kenya Medical Training College',
    sector: 'Health', county: 'Nairobi', gender: 'female', age: 24, experience: 1,
    availability: 'open', preferredTypes: ['internship'],
    skills: ['Patient care', 'Clinical procedures', 'First aid'],
    disability: false, added: '2025-10-19'
  },
  {
    id: 6, firstName: 'David', lastName: 'Omondi', initials: 'DO',
    course: 'Diploma in Civil Engineering', level: 'level-6',
    levelLabel: 'TVET Level 6 (Diploma)', institution: 'Mombasa Technical Training Institute',
    sector: 'Construction', county: 'Mombasa', gender: 'male', age: 23, experience: 2,
    availability: 'available', preferredTypes: ['attachment'],
    skills: ['Surveying', 'AutoCAD', 'Road construction', 'Site supervision'],
    disability: false, added: '2025-10-12'
  },
  {
    id: 7, firstName: 'Faith', lastName: 'Njeri', initials: 'FN',
    course: 'Certificate in Agribusiness', level: 'level-4',
    levelLabel: 'TVET Level 4', institution: 'Nakuru Technical Training Institute',
    sector: 'Agriculture', county: 'Nakuru', gender: 'female', age: 22, experience: 0,
    availability: 'open', preferredTypes: ['attachment', 'dual'],
    skills: ['Agronomy', 'Farm management', 'Crop production'],
    disability: true, added: '2025-10-17'
  },
  {
    id: 8, firstName: 'Brian', lastName: 'Kimani', initials: 'BK',
    course: 'Diploma in Mechanical Engineering', level: 'level-6',
    levelLabel: 'TVET Level 6 (Diploma)', institution: 'Thika Technical Training Institute',
    sector: 'Manufacturing', county: 'Kiambu', gender: 'male', age: 24, experience: 2,
    availability: 'unavailable', preferredTypes: ['apprenticeship'],
    skills: ['Fitting', 'Machining', 'Maintenance', 'PLC'],
    disability: false, added: '2025-09-28'
  },
  {
    id: 9, firstName: 'Esther', lastName: 'Chebet', initials: 'EC',
    course: 'Diploma in Business Management', level: 'level-6',
    levelLabel: 'TVET Level 6 (Diploma)', institution: 'Kenya Institute of Management',
    sector: 'Business & Finance', county: 'Nairobi', gender: 'female', age: 22, experience: 1,
    availability: 'available', preferredTypes: ['internship', 'attachment'],
    skills: ['Accounting', 'Bookkeeping', 'QuickBooks', 'Customer service'],
    disability: false, added: '2025-10-21'
  },
  {
    id: 10, firstName: 'Joseph', lastName: 'Mutua', initials: 'JM',
    course: 'Certificate in Hospitality Management', level: 'level-3',
    levelLabel: 'TVET Level 3', institution: 'Machakos Technical Institute',
    sector: 'Hospitality & Tourism', county: 'Machakos', gender: 'male', age: 21, experience: 0,
    availability: 'open', preferredTypes: ['attachment', 'internship'],
    skills: ['Front office', 'Housekeeping', 'Food & beverage'],
    disability: false, added: '2025-10-14'
  },
  {
    id: 11, firstName: 'Lydia', lastName: 'Atieno', initials: 'LA',
    course: 'Diploma in Information Communication Technology', level: 'level-6',
    levelLabel: 'TVET Level 6 (Diploma)', institution: 'Kisumu National Polytechnic',
    sector: 'ICT & Digital', county: 'Kisumu', gender: 'female', age: 23, experience: 1,
    availability: 'available', preferredTypes: ['internship', 'dual'],
    skills: ['Networking', 'Cybersecurity', 'Python', 'SQL'],
    disability: false, added: '2025-10-16'
  },
  {
    id: 12, firstName: 'Kevin', lastName: 'Mwangi', initials: 'KM',
    course: 'Craft Certificate in Welding & Fabrication', level: 'level-3',
    levelLabel: 'TVET Level 3', institution: 'Nakuru Technical Training Institute',
    sector: 'Manufacturing', county: 'Nakuru', gender: 'male', age: 20, experience: 0,
    availability: 'open', preferredTypes: ['apprenticeship'],
    skills: ['Welding', 'Fabrication', 'Metalwork'],
    disability: true, added: '2025-10-11'
  },
  {
    id: 13, firstName: 'Cynthia', lastName: 'Wambui', initials: 'CW',
    course: 'Diploma in Graphic Design', level: 'level-6',
    levelLabel: 'TVET Level 6 (Diploma)', institution: 'Kenya Institute of Management',
    sector: 'Creative Arts & Media', county: 'Nairobi', gender: 'female', age: 22, experience: 1,
    availability: 'available', preferredTypes: ['internship'],
    skills: ['Illustrator', 'Photoshop', 'Branding', 'Social media'],
    disability: false, added: '2025-10-23'
  },
  {
    id: 14, firstName: 'Daniel', lastName: 'Kipruto', initials: 'DK',
    course: 'Diploma in Supply Chain Management', level: 'level-6',
    levelLabel: 'TVET Level 6 (Diploma)', institution: 'Mombasa Technical Training Institute',
    sector: 'Transport & Logistics', county: 'Mombasa', gender: 'male', age: 24, experience: 2,
    availability: 'open', preferredTypes: ['attachment', 'dual'],
    skills: ['Procurement', 'Warehousing', 'Logistics', 'Inventory'],
    disability: false, added: '2025-10-13'
  }
]

// ---------- Derived: all skills across all trainees ----------
export const ALL_SKILLS = [...new Set(TRAINEES.flatMap((t) => t.skills))].sort()

// =============================================================
// PROFILE DETAILS (keyed by trainee id)
// =============================================================
// Only trainee id=1 has a fully-authored profile in this demo.
// Other IDs fall back to a generic profile built from TRAINEES.
export const TRAINEE_PROFILES = {
  1: {
    bio: [
      'I am a final-year Diploma in Electrical Installation trainee at Nairobi Technical Training Institute, with a strong interest in power distribution, wiring installation and preventive maintenance. I have completed two industrial attachments and am now seeking a structured apprenticeship or attachment to consolidate my practical competencies.',
      'I am safety-conscious, detail-oriented and enjoy working in teams. My goal is to become a certified electrical technician and contribute to reliable, safe electricity distribution in Kenya.'
    ],
    dob: '14 Mar 2002',
    nationality: 'Kenyan',
    languages: 'English, Kiswahili',
    availableFrom: 'Nov 2025',
    technicalSkills: [
      { icon: 'fa-bolt', label: 'Electrical wiring' },
      { icon: 'fa-project-diagram', label: 'Circuit analysis' },
      { icon: 'fa-shield-alt', label: 'Safety protocols' },
      { icon: 'fa-drafting-compass', label: 'Blueprint reading' },
      { icon: 'fa-solar-panel', label: 'Solar PV installation' },
      { icon: 'fa-search', label: 'Fault-finding' }
    ],
    softSkills: [
      { icon: 'fa-users', label: 'Teamwork' },
      { icon: 'fa-lightbulb', label: 'Problem-solving' },
      { icon: 'fa-eye', label: 'Attention to detail' },
      { icon: 'fa-clock', label: 'Time management' }
    ],
    education: [
      {
        icon: 'fa-university',
        title: 'Diploma in Electrical Installation',
        institution: 'Nairobi Technical Training Institute',
        meta: [
          { icon: 'fa-layer-group', text: 'TVET Level 6' },
          { icon: 'fa-calendar', text: '2023 – 2025' },
          { icon: 'fa-award', text: 'Distinction' }
        ]
      },
      {
        icon: 'fa-certificate',
        title: 'Certificate in Solar PV Installation',
        institution: 'Kenya Institute of Management',
        meta: [
          { icon: 'fa-layer-group', text: 'Short course' },
          { icon: 'fa-calendar', text: '2024' },
          { icon: 'fa-award', text: 'Pass' }
        ]
      },
      {
        icon: 'fa-school',
        title: 'Kenya Certificate of Secondary Education',
        institution: 'Moi Girls High School, Nairobi',
        meta: [
          { icon: 'fa-calendar', text: '2019' },
          { icon: 'fa-award', text: 'B+ (Plus)' }
        ]
      }
    ],
    experience: [
      {
        title: 'Electrical Installation Attachment',
        dates: 'Jun – Aug 2025',
        org: 'Kenya Power & Lighting Co.',
        description:
          'Assisted in domestic wiring installation, distribution board assembly and routine inspection of transformers. Completed 8 supervised installations and documented safety checks.'
      },
      {
        title: 'Solar PV Installation Attachment',
        dates: 'Dec 2024 – Jan 2025',
        org: 'M-KOPA Solar',
        description:
          'Supported solar panel installation, wiring and customer handover for residential solar systems in Nairobi. Gained practical exposure to inverter setup and battery maintenance.'
      }
    ],
    documents: [
      { icon: 'fa-file-pdf', name: 'CV_ Jane_Wanjiku.pdf', meta: 'Uploaded 10 Oct 2025' },
      { icon: 'fa-file-image', name: 'National_ID.jpg', meta: 'Uploaded 10 Oct 2025' },
      { icon: 'fa-file-alt', name: 'Intro_letter_NTTI.pdf', meta: 'Uploaded 11 Oct 2025' },
      { icon: 'fa-shield-virus', name: 'Insurance_cover.pdf', meta: 'Uploaded 12 Oct 2025 · Valid to Dec 2026' }
    ],
    contact: {
      email: 'jane.wanjiku@example.com',
      phone: '+254 712 345 678',
      location: 'Nairobi, Kenya',
      institution: 'Nairobi Technical Training Institute'
    },
    match: {
      score: 85,
      opportunity: 'Electrical Installation Technician',
      reasons: [
        'Matches required TVET level (Level 3+)',
        'Has relevant electrical wiring skills',
        'Located in Nairobi - matches workplace',
        'Available before the start date'
      ]
    }
  }
}

// ---------- Helper: build full profile for any trainee id ----------
export function getTraineeProfile(id) {
  const trainee = TRAINEES.find((t) => String(t.id) === String(id))
  if (!trainee) return null

  const detailed = TRAINEE_PROFILES[trainee.id]
  if (detailed) return { ...trainee, ...detailed }

  // Fallback profile for the remaining demo trainees
  return {
    ...trainee,
    bio: [
      `${trainee.firstName} ${trainee.lastName} is a ${trainee.course.toLowerCase()} trainee at ${trainee.institution}, currently seeking a ${trainee.preferredTypes[0]} in the ${trainee.sector} sector.`
    ],
    dob: '-',
    nationality: 'Kenyan',
    languages: 'English, Kiswahili',
    availableFrom: '-',
    technicalSkills: trainee.skills.map((s) => ({ icon: 'fa-tools', label: s })),
    softSkills: [],
    education: [
      {
        icon: 'fa-university',
        title: trainee.course,
        institution: trainee.institution,
        meta: [{ icon: 'fa-layer-group', text: trainee.levelLabel }]
      }
    ],
    experience: trainee.experience
      ? [
          {
            title: 'Relevant experience',
            dates: '-',
            org: trainee.institution,
            description: `${trainee.experience} year${trainee.experience === 1 ? '' : 's'} of practical exposure relevant to ${trainee.course.toLowerCase()}.`
          }
        ]
      : [],
    documents: [],
    contact: {
      email: `${trainee.firstName.toLowerCase()}.${trainee.lastName.toLowerCase()}@example.com`,
      phone: '+254 700 000 000',
      location: `${trainee.county}, Kenya`,
      institution: trainee.institution
    },
    match: {
      score: 70,
      opportunity: trainee.course,
      reasons: ['Matches your sector filter', 'Verified profile']
    }
  }
}