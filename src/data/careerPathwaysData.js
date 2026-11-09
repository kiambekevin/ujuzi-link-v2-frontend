export const CAREER_PATHWAY_DETAILS = {
  engineering: {
    key: 'engineering',
    title: 'Engineering & Technical Trades',
    icon: 'fa-cogs',
    color: 'engineering',
    tagline: 'Keep Kenya\'s industries moving, building and powering.',
    demand: { label: 'High demand', cls: 'high', icon: 'fa-arrow-up' },
    growth: '14% per year',
    salary: 'KES 25K – 80K / month',
    description: 'Engineering and technical trades are the backbone of Kenya\'s industrial economy. From domestic wiring to heavy plant maintenance, from site supervision to CAD design, these roles keep the country\'s infrastructure, buildings and factories running safely and efficiently. As Kenya continues to invest in roads, energy and manufacturing, demand for skilled engineering technicians is growing steadily.',
    roles: [
      { title: 'Electrical Technician', salary: 'KES 25K – 65K', growth: '+14%' },
      { title: 'Mechanical Fitter', salary: 'KES 22K – 55K', growth: '+9%' },
      { title: 'Civil Technician', salary: 'KES 24K – 70K', growth: '+18%' },
      { title: 'Automotive Mechanic', salary: 'KES 20K – 60K', growth: '+6%' },
      { title: 'Maintenance Engineer', salary: 'KES 40K – 80K', growth: '+12%' }
    ],
    entry: [
      'TVET Level 3 (Artisan) or Level 4 (Craft) for entry-level roles',
      'TVET Level 5 (Technician) or Level 6 (Diploma) for supervisory and design roles',
      'KCSE D+ or above, with strong mathematics and physical sciences',
      'Willingness to work on-site, outdoors or in industrial environments'
    ],
    progression: [
      { stage: 'Entry', title: 'Apprentice / Attachment Trainee', years: '0–1 yr' },
      { stage: 'Junior', title: 'Assistant Technician / Fitter', years: '1–3 yrs' },
      { stage: 'Intermediate', title: 'Qualified Technician', years: '3–6 yrs' },
      { stage: 'Senior', title: 'Senior Technician / Supervisor', years: '6–10 yrs' },
      { stage: 'Expert', title: 'Engineering Manager / Consultant', years: '10+ yrs' }
    ],
    employers: [
      'Kenya Power & Lighting Co.',
      'Kenya Electricity Generating Co. (KenGen)',
      'Kenya National Highways Authority',
      'Kenya Breweries Ltd',
      'Isuzu East Africa',
      'Bamburi Cement PLC',
      'County governments & parastatals'
    ],
    counties: ['Nairobi', 'Mombasa', 'Kiambu', 'Nakuru', 'Kisumu', 'Uasin Gishu'],
    skills: ['Electrical wiring', 'Blueprint reading', 'Fault-finding', 'Safety protocols', 'Machining', 'AutoCAD'],
    articles: [
      { icon: 'fa-file-alt', title: 'How to write a CV for engineering technician roles', tag: 'CV' },
      { icon: 'fa-comments', title: 'Common interview questions for technical trade roles', tag: 'Interviews' },
      { icon: 'fa-handshake', title: 'Your first week on site: safety and professionalism', tag: 'Workplace' }
    ]
  },

  ict: {
    key: 'ict',
    title: 'ICT & Digital Economy',
    icon: 'fa-laptop-code',
    color: 'ict',
    tagline: 'Build the software, systems and infrastructure of the digital age.',
    demand: { label: 'High demand', cls: 'high', icon: 'fa-arrow-up' },
    growth: '24% per year',
    salary: 'KES 30K – 120K / month',
    description: 'Kenya\'s ICT sector is one of the fastest-growing in Africa. From fintech and e-commerce to cloud infrastructure and cybersecurity, digital skills are in high demand across every industry. Tech roles offer some of the highest salaries for TVET graduates, and many ICT professionals work remotely for international companies.',
    roles: [
      { title: 'Software Developer', salary: 'KES 35K – 120K', growth: '+24%' },
      { title: 'Network Technician', salary: 'KES 28K – 70K', growth: '+15%' },
      { title: 'Cybersecurity Analyst', salary: 'KES 35K – 130K', growth: '+32%' },
      { title: 'Data Analyst', salary: 'KES 30K – 95K', growth: '+20%' },
      { title: 'IT Support Specialist', salary: 'KES 22K – 55K', growth: '+8%' }
    ],
    entry: [
      'TVET Level 4 (Craft) or Level 5 (Technician) for entry-level support roles',
      'TVET Level 6 (Diploma) or Degree for software and data roles',
      'Strong logical reasoning and problem-solving abilities',
      'Portfolio of personal projects or code repositories (strongly recommended)'
    ],
    progression: [
      { stage: 'Entry', title: 'Junior Developer / IT Support', years: '0–2 yrs' },
      { stage: 'Junior', title: 'Developer / Network Admin', years: '2–4 yrs' },
      { stage: 'Intermediate', title: 'Senior Developer / Systems Engineer', years: '4–6 yrs' },
      { stage: 'Senior', title: 'Tech Lead / DevOps Engineer', years: '6–10 yrs' },
      { stage: 'Expert', title: 'CTO / Engineering Manager', years: '10+ yrs' }
    ],
    employers: [
      'Safaricom PLC',
      'Equity Bank Kenya',
      'KCB Group',
      'M-KOPA',
      'Andela Kenya',
      'Microsoft Africa Development Centre',
      'Kenya ICT Authority'
    ],
    counties: ['Nairobi', 'Kiambu', 'Mombasa', 'Kisumu', 'Nakuru'],
    skills: ['JavaScript', 'React', 'Python', 'SQL', 'Networking', 'Cybersecurity', 'Cloud platforms'],
    articles: [
      { icon: 'fa-file-alt', title: 'Building a portfolio that gets you hired', tag: 'Portfolio' },
      { icon: 'fa-comments', title: 'Cracking your first technical interview', tag: 'Interviews' },
      { icon: 'fa-handshake', title: 'Remote work etiquette for TVET graduates', tag: 'Workplace' }
    ]
  },

  health: {
    key: 'health',
    title: 'Health & Social Care',
    icon: 'fa-heartbeat',
    color: 'health',
    tagline: 'Care for people, strengthen communities, and support Kenya\'s health system.',
    demand: { label: 'High demand', cls: 'high', icon: 'fa-arrow-up' },
    growth: '12% per year',
    salary: 'KES 20K – 90K / month',
    description: 'Health and social care roles are essential to Kenya\'s wellbeing. Nurses, clinical assistants, pharmacy technicians and community health workers provide direct care to millions of citizens. With growing public investment and expanding private hospitals, career opportunities in health are diverse and rewarding.',
    roles: [
      { title: 'Registered Nurse', salary: 'KES 30K – 90K', growth: '+12%' },
      { title: 'Clinical Assistant', salary: 'KES 22K – 55K', growth: '+10%' },
      { title: 'Pharmacy Technician', salary: 'KES 24K – 60K', growth: '+9%' },
      { title: 'Laboratory Technician', salary: 'KES 25K – 65K', growth: '+11%' },
      { title: 'Community Health Worker', salary: 'KES 20K – 45K', growth: '+14%' }
    ],
    entry: [
      'TVET Level 4 (Craft) or Level 6 (Diploma) depending on the role',
      'Registration with relevant professional boards (Nursing Council, Pharmacy & Poisons Board)',
      'Physical and emotional resilience',
      'Commitment to patient confidentiality and ethical care'
    ],
    progression: [
      { stage: 'Entry', title: 'Trainee / Clinical Assistant', years: '0–1 yr' },
      { stage: 'Junior', title: 'Registered Nurse / Technician', years: '1–3 yrs' },
      { stage: 'Intermediate', title: 'Senior Nurse / Specialist Technician', years: '3–7 yrs' },
      { stage: 'Senior', title: 'Unit Head / Clinical Supervisor', years: '7–12 yrs' },
      { stage: 'Expert', title: 'Hospital Administrator / Matron', years: '12+ yrs' }
    ],
    employers: [
      'Kenyatta National Hospital',
      'Moi Teaching & Referral Hospital',
      'Aga Khan University Hospital',
      'AAR Healthcare',
      'Amref Health Africa',
      'County health departments',
      'Private clinics and pharmacies'
    ],
    counties: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Kakamega'],
    skills: ['Patient care', 'Clinical procedures', 'First aid', 'Medical records', 'Health education'],
    articles: [
      { icon: 'fa-file-alt', title: 'Preparing a strong nursing application', tag: 'Applications' },
      { icon: 'fa-comments', title: 'Compassionate interviewing for health roles', tag: 'Interviews' },
      { icon: 'fa-handshake', title: 'Managing stress on your first placement', tag: 'Wellbeing' }
    ]
  },

  agriculture: {
    key: 'agriculture',
    title: 'Agriculture & Agribusiness',
    icon: 'fa-seedling',
    color: 'agriculture',
    tagline: 'Feed the nation and build a profitable agri-business.',
    demand: { label: 'Steady demand', cls: 'medium', icon: 'fa-minus' },
    growth: '8% per year',
    salary: 'KES 18K – 70K / month',
    description: 'Agriculture remains a major contributor to Kenya\'s economy and employs a large share of the workforce. Modern agribusiness, from greenhouse horticulture to agricultural technology, is creating new opportunities for TVET graduates with practical skills and entrepreneurial ambition.',
    roles: [
      { title: 'Agronomist', salary: 'KES 25K – 70K', growth: '+8%' },
      { title: 'Farm Manager', salary: 'KES 28K – 65K', growth: '+7%' },
      { title: 'Agri-Entrepreneur', salary: 'Variable', growth: 'Growth depends on business' },
      { title: 'Livestock Technician', salary: 'KES 20K – 55K', growth: '+6%' },
      { title: 'Agri-Tech Specialist', salary: 'KES 30K – 65K', growth: '+12%' }
    ],
    entry: [
      'TVET Level 3 (Artisan) or Level 4 (Craft) for field-based roles',
      'TVET Level 6 (Diploma) for management and advisory roles',
      'Practical experience on a farm or agricultural programme',
      'Willingness to work in rural or peri-urban settings'
    ],
    progression: [
      { stage: 'Entry', title: 'Farm Assistant / Attaché', years: '0–1 yr' },
      { stage: 'Junior', title: 'Field Technician / Sales Rep', years: '1–3 yrs' },
      { stage: 'Intermediate', title: 'Farm Manager / Agronomist', years: '3–7 yrs' },
      { stage: 'Senior', title: 'Regional Manager / Consultant', years: '7–12 yrs' },
      { stage: 'Expert', title: 'Agribusiness Owner / Director', years: '12+ yrs' }
    ],
    employers: [
      'Kenya Agricultural & Livestock Research Org. (KALRO)',
      'Del Monte Kenya',
      'Kakuzi PLC',
      'Kenya Tea Development Agency',
      'Farm to Market Alliance',
      'County agriculture departments',
      'Private farms and agri-startups'
    ],
    counties: ['Nakuru', 'Kiambu', 'Nyeri', 'Meru', 'Kisumu', 'Kakamega', 'Uasin Gishu'],
    skills: ['Agronomy', 'Farm management', 'Crop production', 'Livestock management', 'Irrigation', 'Agri-business planning'],
    articles: [
      { icon: 'fa-file-alt', title: 'CV tips for agribusiness roles', tag: 'CV' },
      { icon: 'fa-comments', title: 'Interviews for farm management jobs', tag: 'Interviews' },
      { icon: 'fa-handshake', title: 'From attachment to farm owner: a roadmap', tag: 'Career growth' }
    ]
  },

  business: {
    key: 'business',
    title: 'Business & Finance',
    icon: 'fa-chart-pie',
    color: 'business',
    tagline: 'Manage money, people and processes with confidence.',
    demand: { label: 'Steady demand', cls: 'medium', icon: 'fa-minus' },
    growth: '10% per year',
    salary: 'KES 22K – 85K / month',
    description: 'Business and finance roles underpin every sector of Kenya\'s economy. From accounting and bookkeeping to procurement and sales, business skills are always in demand. TVET graduates in business can work in corporates, SMEs, NGOs or start their own enterprises.',
    roles: [
      { title: 'Accountant', salary: 'KES 25K – 85K', growth: '+10%' },
      { title: 'Procurement Officer', salary: 'KES 28K – 75K', growth: '+8%' },
      { title: 'Sales Executive', salary: 'KES 20K – 60K + commission', growth: '+11%' },
      { title: 'Bookkeeper', salary: 'KES 22K – 50K', growth: '+6%' },
      { title: 'Bank Teller / Customer Advisor', salary: 'KES 22K – 45K', growth: '+4%' }
    ],
    entry: [
      'TVET Level 4 (Craft) or Level 6 (Diploma) for most business roles',
      'Strong numeracy and communication skills',
      'Proficiency with office software (Excel, QuickBooks, SAP)',
      'Professional certifications (CPA, CIPS) boost progression'
    ],
    progression: [
      { stage: 'Entry', title: 'Assistant / Intern', years: '0–1 yr' },
      { stage: 'Junior', title: 'Officer / Executive', years: '1–3 yrs' },
      { stage: 'Intermediate', title: 'Senior Officer / Accountant', years: '3–7 yrs' },
      { stage: 'Senior', title: 'Finance Manager / Head of Sales', years: '7–12 yrs' },
      { stage: 'Expert', title: 'CFO / Business Owner', years: '12+ yrs' }
    ],
    employers: [
      'Equity Bank Kenya',
      'KCB Group',
      'Kenya Revenue Authority',
      'Deloitte Kenya',
      'Unilever Kenya',
      'SMEs across all sectors',
      'NGOs and development organisations'
    ],
    counties: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu'],
    skills: ['Accounting', 'Bookkeeping', 'QuickBooks', 'Customer service', 'Data analysis', 'Negotiation'],
    articles: [
      { icon: 'fa-file-alt', title: 'How to tailor your CV for finance roles', tag: 'CV' },
      { icon: 'fa-comments', title: 'Common accounting interview questions', tag: 'Interviews' },
      { icon: 'fa-handshake', title: 'From attachment to first job offer', tag: 'Career growth' }
    ]
  },

  creative: {
    key: 'creative',
    title: 'Creative Arts & Media',
    icon: 'fa-palette',
    color: 'creative',
    tagline: 'Turn imagination and design into a thriving career.',
    demand: { label: 'Emerging demand', cls: 'emerging', icon: 'fa-bolt' },
    growth: '16% per year',
    salary: 'KES 20K – 75K / month',
    description: 'Kenya\'s creative economy is booming. From brand design and social media to film and animation, creative professionals are finding new audiences and clients both locally and internationally. Digital tools have made it easier than ever to build a portfolio and reach clients directly.',
    roles: [
      { title: 'Graphic Designer', salary: 'KES 22K – 65K', growth: '+16%' },
      { title: 'Content Creator', salary: 'KES 20K – 75K', growth: '+22%' },
      { title: 'Photographer / Videographer', salary: 'Project-based', growth: '+10%' },
      { title: 'UI / UX Designer', salary: 'KES 30K – 80K', growth: '+25%' },
      { title: 'Social Media Manager', salary: 'KES 24K – 60K', growth: '+18%' }
    ],
    entry: [
      'TVET Level 4 (Craft) or Level 6 (Diploma) for design and media roles',
      'A strong, curated portfolio of personal or client work',
      'Fluency with design and editing tools (Adobe Suite, Figma, Canva)',
      'A willingness to freelance, build a client base and self-promote'
    ],
    progression: [
      { stage: 'Entry', title: 'Junior Designer / Intern', years: '0–1 yr' },
      { stage: 'Junior', title: 'Designer / Content Creator', years: '1–3 yrs' },
      { stage: 'Intermediate', title: 'Senior Designer / Art Director', years: '3–6 yrs' },
      { stage: 'Senior', title: 'Creative Lead / Studio Manager', years: '6–10 yrs' },
      { stage: 'Expert', title: 'Creative Director / Agency Owner', years: '10+ yrs' }
    ],
    employers: [
      'Scanad Kenya',
      'Ogilvy Africa',
      'Innova8ve Kenya',
      'Safaricom (brand and content teams)',
      'Film and television production houses',
      'Freelance and agency clients'
    ],
    counties: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu'],
    skills: ['Illustrator', 'Photoshop', 'Branding', 'Social media', 'Video editing', 'UI design'],
    articles: [
      { icon: 'fa-file-alt', title: 'Curating a portfolio that wins clients', tag: 'Portfolio' },
      { icon: 'fa-comments', title: 'How to pitch yourself as a freelance creative', tag: 'Freelancing' },
      { icon: 'fa-handshake', title: 'Building a personal brand as a creative', tag: 'Career growth' }
    ]
  }
}