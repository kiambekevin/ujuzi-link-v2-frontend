// Each question offers 3-4 answers. Each answer weights 1-2 pathways.
// Pathway keys must match the `pathways` map below.
export const QUESTIONS = [
  {
    id: 'q1',
    question: 'Which type of work feels most natural to you?',
    help: 'Think about how you prefer to spend your day.',
    answers: [
      { text: 'Working with my hands on tools, machines or equipment', scores: { engineering: 2, construction: 1, energy: 1 } },
      { text: 'Solving problems with computers, software and data', scores: { ict: 2 } },
      { text: 'Caring for people and supporting their wellbeing', scores: { health: 2, hospitality: 1 } },
      { text: 'Organising, planning and managing resources', scores: { business: 2, manufacturing: 1 } }
    ]
  },
  {
    id: 'q2',
    question: 'Which environment would you enjoy most?',
    help: 'Where would you like to spend most of your working day?',
    answers: [
      { text: 'A workshop, site or plant with technical equipment', scores: { engineering: 2, manufacturing: 1, construction: 1 } },
      { text: 'An office or remote setup with computers', scores: { ict: 2, business: 1, creative: 1 } },
      { text: 'A clinic, hospital or community health setting', scores: { health: 2 } },
      { text: 'Farms, field stations or outdoor environments', scores: { agriculture: 2 } }
    ]
  },
  {
    id: 'q3',
    question: 'Which subject did you enjoy most at school?',
    answers: [
      { text: 'Mathematics and physical sciences', scores: { engineering: 1, ict: 1, energy: 1 } },
      { text: 'Biology and health sciences', scores: { health: 2, agriculture: 1 } },
      { text: 'Business studies and accounting', scores: { business: 2, hospitality: 1 } },
      { text: 'Art, design and creative expression', scores: { creative: 2 } }
    ]
  },
  {
    id: 'q4',
    question: 'How do you prefer to work?',
    answers: [
      { text: 'Independently with clear goals', scores: { ict: 1, creative: 1, agriculture: 1 } },
      { text: 'As part of a close-knit team', scores: { engineering: 1, health: 1, hospitality: 1 } },
      { text: 'Leading and coordinating others', scores: { business: 2, construction: 1 } },
      { text: 'Directly serving customers or clients', scores: { hospitality: 2, business: 1, health: 1 } }
    ]
  },
  {
    id: 'q5',
    question: 'Which of these outcomes matters most to you?',
    answers: [
      { text: 'Building and maintaining infrastructure', scores: { engineering: 2, construction: 2, energy: 1 } },
      { text: 'Creating digital products or services', scores: { ict: 2 } },
      { text: 'Improving people\'s health and wellbeing', scores: { health: 2 } },
      { text: 'Growing food, managing land or natural resources', scores: { agriculture: 2, energy: 1 } }
    ]
  },
  {
    id: 'q6',
    question: 'Which of these tasks would you find most satisfying?',
    answers: [
      { text: 'Troubleshooting a fault and getting a machine running again', scores: { engineering: 2, manufacturing: 1 } },
      { text: 'Launching a new application or digital service', scores: { ict: 2 } },
      { text: 'Helping a patient recover or a community stay healthy', scores: { health: 2 } },
      { text: 'Running a profitable farm, business or hotel', scores: { business: 1, agriculture: 1, hospitality: 1 } }
    ]
  },
  {
    id: 'q7',
    question: 'How do you like to learn new skills?',
    answers: [
      { text: 'Through hands-on practice and observation', scores: { engineering: 1, construction: 1, agriculture: 1 } },
      { text: 'Through online tutorials and self-study', scores: { ict: 2, creative: 1 } },
      { text: 'Through formal training and certification', scores: { health: 1, business: 1, energy: 1 } },
      { text: 'Through creative experimentation', scores: { creative: 2 } }
    ]
  },
  {
    id: 'q8',
    question: 'Which of these best describes your long-term ambition?',
    answers: [
      { text: 'Become a certified technician or engineer', scores: { engineering: 1, energy: 1, manufacturing: 1 } },
      { text: 'Build a career in tech or digital industries', scores: { ict: 2 } },
      { text: 'Start my own business or social enterprise', scores: { business: 1, agriculture: 1, hospitality: 1, creative: 1 } },
      { text: 'Work in public health or community service', scores: { health: 2, agriculture: 1 } }
    ]
  }
]

export const PATHWAYS = {
  engineering: {
    label: 'Engineering & Technical Trades',
    icon: 'fa-cogs',
    color: 'engineering',
    description: 'Hands-on roles in electrical, mechanical and civil engineering, keeping industries running and infrastructure safe.',
    roles: ['Electrical Technician', 'Mechanical Fitter', 'Maintenance Technician', 'Civil Technician'],
    salary: 'KES 25K – 80K / month',
    demand: 'High demand'
  },
  ict: {
    label: 'ICT & Digital Economy',
    icon: 'fa-laptop-code',
    color: 'ict',
    description: 'Software, networking, cybersecurity and data roles powering Kenya\'s digital transformation.',
    roles: ['Software Developer', 'Network Technician', 'Data Analyst', 'Cybersecurity Assistant'],
    salary: 'KES 30K – 120K / month',
    demand: 'High demand'
  },
  health: {
    label: 'Health & Social Care',
    icon: 'fa-heartbeat',
    color: 'health',
    description: 'Nursing, pharmacy, laboratory and community health roles supporting Kenya\'s healthcare system.',
    roles: ['Nurse', 'Pharmacy Assistant', 'Lab Technician', 'Community Health Worker'],
    salary: 'KES 20K – 90K / month',
    demand: 'High demand'
  },
  agriculture: {
    label: 'Agriculture & Agribusiness',
    icon: 'fa-seedling',
    color: 'agriculture',
    description: 'Agronomy, livestock, agri-processing and agribusiness roles driving Kenya\'s food economy.',
    roles: ['Agronomist', 'Farm Manager', 'Agri-Entrepreneur', 'Livestock Technician'],
    salary: 'KES 18K – 70K / month',
    demand: 'Steady demand'
  },
  business: {
    label: 'Business & Finance',
    icon: 'fa-chart-pie',
    color: 'business',
    description: 'Accounting, supply chain, banking and entrepreneurship roles that keep businesses running.',
    roles: ['Accountant', 'Procurement Officer', 'Bank Teller', 'Sales Executive'],
    salary: 'KES 22K – 85K / month',
    demand: 'Steady demand'
  },
  creative: {
    label: 'Creative Arts & Media',
    icon: 'fa-palette',
    color: 'creative',
    description: 'Graphic design, multimedia, photography and content creation for Kenya\'s growing creative economy.',
    roles: ['Graphic Designer', 'Content Creator', 'Photographer', 'Video Editor'],
    salary: 'KES 20K – 75K / month',
    demand: 'Emerging demand'
  },
  hospitality: {
    label: 'Hospitality & Tourism',
    icon: 'fa-hotel',
    color: 'hospitality',
    description: 'Front office, food and beverage, housekeeping and tour operations roles in Kenya\'s tourism economy.',
    roles: ['Front Office Assistant', 'Housekeeper', 'F&B Service Staff', 'Tour Guide'],
    salary: 'KES 18K – 60K / month',
    demand: 'Steady demand'
  },
  construction: {
    label: 'Construction & Built Environment',
    icon: 'fa-hard-hat',
    color: 'construction',
    description: 'Building, surveying, plumbing, masonry and site supervision roles shaping Kenya\'s urban growth.',
    roles: ['Mason', 'Plumber', 'Site Supervisor', 'Quantity Surveyor Assistant'],
    salary: 'KES 22K – 80K / month',
    demand: 'High demand'
  },
  energy: {
    label: 'Energy & Utilities',
    icon: 'fa-bolt',
    color: 'energy',
    description: 'Solar PV, power distribution, energy efficiency and renewable energy roles for Kenya\'s energy transition.',
    roles: ['Solar PV Installer', 'Power Technician', 'Energy Auditor', 'Metering Technician'],
    salary: 'KES 22K – 85K / month',
    demand: 'Emerging demand'
  },
  manufacturing: {
    label: 'Manufacturing & Production',
    icon: 'fa-industry',
    color: 'manufacturing',
    description: 'Welding, machining, automation and quality assurance roles in Kenya\'s industrial sector.',
    roles: ['Welder', 'Machinist', 'Quality Assistant', 'Production Operator'],
    salary: 'KES 20K – 70K / month',
    demand: 'Steady demand'
  }
}