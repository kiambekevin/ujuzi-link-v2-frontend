export const CATEGORY_LABELS = {
  general: 'General',
  trainee: 'Trainee questions',
  employer: 'Employer questions',
  institution: 'Institution questions',
  security: 'Privacy & security'
}

export const CATEGORY_ICONS = {
  general: 'fa-circle-info',
  trainee: 'fa-user-graduate',
  employer: 'fa-building',
  institution: 'fa-university',
  security: 'fa-shield-halved'
}

export const FAQS = [
  // ---- GENERAL ----
  {
    id: 'g1', category: 'general',
    question: 'What is Ujuzi Link?',
    answer: `<p><strong>Ujuzi Link</strong> is the National TVET Work-Based Learning Placement System - a secure, accessible and nationally coordinated digital platform that connects TVET trainees with verified employers and training institutions for industrial attachment, internship, apprenticeship and dual-training placements.</p><p>It is proposed by the State Department for Labour and Skills Development, under the Ministry of Labour and Social Protection, and delivered in collaboration with the Ministry of Education, the State Department for TVET, NITA, TVETA, TVET institutions and employers.</p>`
  },
  {
    id: 'g2', category: 'general',
    question: 'Is Ujuzi Link free to use?',
    answer: `<p>Yes. Ujuzi Link is a <strong>free national service</strong>. Trainees are not charged to register, search for opportunities, apply or be placed. Employers and institutions are also not charged to participate.</p><p>Ujuzi Link does <strong>not</strong> charge trainees for access to placements. If anyone asks you to pay for a placement through the platform, please report it immediately to our support team.</p>`
  },
  {
    id: 'g3', category: 'general',
    question: 'Who can use Ujuzi Link?',
    answer: `<p>Ujuzi Link is open to:</p><ul><li><i class="fas fa-circle"></i> <strong>Trainees</strong> registered with a recognised TVET institution;</li><li><i class="fas fa-circle"></i> <strong>Employers</strong> - public, private and non-profit - offering genuine workplace-learning opportunities;</li><li><i class="fas fa-circle"></i> <strong>TVET institutions</strong> that verify, approve and supervise placements.</li></ul><p>All users must comply with our <a href="/terms">Terms and Conditions of Use</a>.</p>`
  },
  {
    id: 'g4', category: 'general',
    question: 'Which types of workplace learning are supported?',
    answer: `<p>The platform supports four principal forms of workplace learning:</p><ul><li><i class="fas fa-circle"></i> <strong>Industrial attachment</strong> - time-bound workplace experience linked to a trainee's programme;</li><li><i class="fas fa-circle"></i> <strong>Internship</strong> - structured practical experience with defined learning objectives;</li><li><i class="fas fa-circle"></i> <strong>Apprenticeship</strong> - occupational training combining supervised practical experience with complementary learning;</li><li><i class="fas fa-circle"></i> <strong>Dual training</strong> - coordinated workplace-based and institution-based learning.</li></ul>`
  },
  {
    id: 'g5', category: 'general',
    question: 'Which counties and sectors are covered?',
    answer: `<p>Ujuzi Link is designed as a <strong>national platform covering all 47 counties</strong>. Opportunities are advertised across a wide range of occupational sectors, including ICT &amp; Digital, Engineering, Health, Agriculture, Business &amp; Finance, Construction, Manufacturing, Hospitality &amp; Tourism, Energy &amp; Utilities, Transport &amp; Logistics and Creative Arts &amp; Media.</p><p>Coverage grows as more employers and institutions join the platform.</p>`
  },

  // ---- TRAINEES ----
  {
    id: 't1', category: 'trainee',
    question: 'How do I create a trainee account?',
    answer: `<p>To create an account, click <strong>Register</strong> in the top navigation, choose <strong>Trainee</strong> as your account type, and complete the registration form. You'll need:</p><ul><li><i class="fas fa-circle"></i> Your surname and other names;</li><li><i class="fas fa-circle"></i> Your National ID or Passport number;</li><li><i class="fas fa-circle"></i> Your phone number and email address;</li><li><i class="fas fa-circle"></i> Your gender, county and date of birth;</li><li><i class="fas fa-circle"></i> Your TVET institution and programme;</li><li><i class="fas fa-circle"></i> Your occupational sector(s) and preferred opportunity type(s);</li><li><i class="fas fa-circle"></i> A strong password.</li></ul><p>Your institution will then verify your enrolment before your profile becomes fully active.</p>`
  },
  {
    id: 't2', category: 'trainee',
    question: 'How do I apply for an opportunity?',
    answer: `<p>Sign in to your account, go to <strong>Opportunities</strong>, and use the search and filters to find a placement that suits you. Click <strong>View details</strong> on an opportunity to read the full description, then click <strong>Apply now</strong>.</p><p>You will be asked to complete a multi-step application form covering personal details, education, documents and a review. You can save your application as a draft and submit when ready.</p>`
  },
  {
    id: 't3', category: 'trainee',
    question: 'What documents do I need to apply?',
    answer: `<p>Requirements vary by opportunity, but typically you will need:</p><ul><li><i class="fas fa-circle"></i> An updated CV or resume;</li><li><i class="fas fa-circle"></i> Certified copies of your academic certificates;</li><li><i class="fas fa-circle"></i> A copy of your National ID or Passport;</li><li><i class="fas fa-circle"></i> An introduction letter from your TVET institution;</li><li><i class="fas fa-circle"></i> A valid insurance cover document.</li></ul><p>Check the specific requirements listed on each opportunity before applying.</p>`
  },
  {
    id: 't4', category: 'trainee',
    question: 'Why do I need an insurance cover?',
    answer: `<p>A valid <strong>personal accident or WIBA insurance cover</strong> is required before a placement can commence. This protects you in the event of a workplace injury and is a condition of structured workplace learning.</p><p>If you do not have cover, your institution may be able to arrange it. You will be asked to upload your insurance cover during the application process, and to provide details such as the provider, policy number and expiry date.</p>`
  },
  {
    id: 't5', category: 'trainee',
    question: 'How do I track my application status?',
    answer: `<p>Go to your <strong>Dashboard</strong> or <strong>My applications</strong> to view the status of each application. Common statuses include:</p><ul><li><i class="fas fa-circle"></i> <strong>Pending</strong> - submitted and awaiting review;</li><li><i class="fas fa-circle"></i> <strong>Verified</strong> - your institution has verified your enrolment;</li><li><i class="fas fa-circle"></i> <strong>Shortlisted</strong> - the employer is interested in your application;</li><li><i class="fas fa-circle"></i> <strong>Accepted</strong> - you have been offered the placement;</li><li><i class="fas fa-circle"></i> <strong>Not successful</strong> - the opportunity was filled or you were not selected.</li></ul><p>You will also receive email and, where possible, SMS notifications when your status changes.</p>`
  },
  {
    id: 't6', category: 'trainee',
    question: 'What is a logbook, and how do I use it?',
    answer: `<p>Your <strong>logbook</strong> is your digital record of the activities, hours and competencies gained during your placement. You should complete an entry each week, describing the tasks you performed, any challenges you faced, what you learned, and the skills you applied.</p><p>Your supervisor reviews your entries and provides feedback. Your logbook forms part of your assessment and completion record, so keep it accurate and up to date.</p>`
  },
  {
    id: 't7', category: 'trainee',
    question: 'Can I have more than one active application?',
    answer: `<p>Yes. You can apply for multiple opportunities at the same time. However, if you accept a placement, you should withdraw or decline other applications so that employers and institutions are not left waiting.</p>`
  },

  // ---- EMPLOYERS ----
  {
    id: 'e1', category: 'employer',
    question: 'How do I register as an employer?',
    answer: `<p>Click <strong>Register</strong> and choose <strong>Employer</strong>. You can register as an <strong>organisation</strong> or as an <strong>individual</strong>.</p><p>Organisations will need to provide their name, registration number or KRA PIN, sector, size, description, contact person, email, phone number, county and logo. Individuals will need to provide their personal and professional details.</p><p>All employers are verified before opportunities go live.</p>`
  },
  {
    id: 'e2', category: 'employer',
    question: 'How do I post an opportunity?',
    answer: `<p>Sign in, go to your employer dashboard and click <strong>Post an opportunity</strong>. The multi-step form will guide you through:</p><ul><li><i class="fas fa-circle"></i> Opportunity basics - type, title, sectors, places and location;</li><li><i class="fas fa-circle"></i> Placement details - duration, start date, deadline, stipend and workplace;</li><li><i class="fas fa-circle"></i> Requirements - TVET level, preferred courses, skills, documents and learning plan;</li><li><i class="fas fa-circle"></i> Review and publish.</li></ul><p>You can save your listing as a draft and preview it before publishing.</p>`
  },
  {
    id: 'e3', category: 'employer',
    question: 'What information should I include in an opportunity?',
    answer: `<p>To attract the best trainees, include:</p><ul><li><i class="fas fa-circle"></i> A clear, specific title;</li><li><i class="fas fa-circle"></i> A short description of what the trainee will do and learn;</li><li><i class="fas fa-circle"></i> The location, duration and start date;</li><li><i class="fas fa-circle"></i> Eligibility requirements and preferred courses;</li><li><i class="fas fa-circle"></i> Required skills and documents;</li><li><i class="fas fa-circle"></i> Whether a stipend, meals, transport or insurance are provided;</li><li><i class="fas fa-circle"></i> The structured learning phases and assessment methods.</li></ul>`
  },
  {
    id: 'e4', category: 'employer',
    question: 'How do I review applications and select trainees?',
    answer: `<p>Applications appear in your employer dashboard. You can filter and shortlist candidates, view their profiles, verified documents and match scores, and invite them to proceed.</p><p>Your institution partner may verify the trainee's enrolment before you make a final decision. Once you select a trainee, a digital placement agreement and learning plan are generated through the platform.</p>`
  },
  {
    id: 'e5', category: 'employer',
    question: 'What are my obligations as a host employer?',
    answer: `<p>As a host employer, you must:</p><ul><li><i class="fas fa-circle"></i> Provide a <strong>safe working environment</strong> that complies with occupational safety and health requirements;</li><li><i class="fas fa-circle"></i> Protect trainees from harm, harassment and exploitation;</li><li><i class="fas fa-circle"></i> Offer genuine learning opportunities aligned with the agreed learning plan;</li><li><i class="fas fa-circle"></i> Designate a workplace supervisor and provide assessment feedback;</li><li><i class="fas fa-circle"></i> Comply with applicable labour laws and TVET placement standards;</li><li><i class="fas fa-circle"></i> <strong>Never charge trainees</strong> any fee as a condition of placement.</li></ul>`
  },
  {
    id: 'e6', category: 'employer',
    question: 'Can I offer a stipend or other support?',
    answer: `<p>Yes, and it is encouraged. You can indicate whether a stipend is offered, and its range, when posting an opportunity. You can also note whether meals, transport allowance or insurance cover are provided.</p><p>Offering support widens your talent pool and helps ensure that trainees from all backgrounds can participate.</p>`
  },
  {
    id: 'e7', category: 'employer',
    question: 'How do I assess and confirm completion?',
    answer: `<p>Throughout the placement, you will receive logbook entries from the trainee. You can review them, provide feedback and record assessment outcomes using the platform's assessment tools.</p><p>At the end of the placement, you and the institution confirm completion, which is recorded on the trainee's profile and supports their certification.</p>`
  },

  // ---- INSTITUTIONS ----
  {
    id: 'i1', category: 'institution',
    question: 'How does my institution register?',
    answer: `<p>Click <strong>Register</strong> and choose <strong>Institution</strong>. You will need to provide your institution name, abbreviation, institution code, root email address, contact person, description, active counties, occupational sectors and logo.</p><p>Your institution must be TVETA-registered or otherwise recognised, and will be verified before full access is granted.</p>`
  },
  {
    id: 'i2', category: 'institution',
    question: 'How do we verify trainee enrolment?',
    answer: `<p>When a trainee registers and applies for an opportunity, your institution receives a verification request in the institution dashboard. You should confirm the trainee's enrolment, programme details and placement eligibility before approving.</p><p>Accurate and timely verification is essential - it protects trainees, employers and your institution.</p>`
  },
  {
    id: 'i3', category: 'institution',
    question: 'Can we approve placements and assign supervisors?',
    answer: `<p>Yes. Your institution can review and approve placements, assign institutional supervisors, coordinate learning plans with employers, monitor trainee progress and validate completion in accordance with applicable requirements and TVETA standards.</p>`
  },
  {
    id: 'i4', category: 'institution',
    question: 'How do we maintain quality assurance?',
    answer: `<p>The platform supports quality assurance through agreed learning plans, structured supervision, logbook review, competency assessment records and completion validation. These features help align workplace learning with approved training programmes and TVETA standards.</p>`
  },

  // ---- SECURITY ----
  {
    id: 's1', category: 'security',
    question: 'Is my personal data safe?',
    answer: `<p>Yes. We apply technical and organisational measures designed to protect personal data against unauthorised access, loss, misuse or disclosure. These include role-based access control, encryption in transit, audit trails and regular security reviews.</p><p>For full details, please read our <a href="/privacy">Privacy Policy</a>.</p>`
  },
  {
    id: 's2', category: 'security',
    question: 'Who can see my profile and documents?',
    answer: `<p>Your profile and documents are visible only to authorised parties:</p><ul><li><i class="fas fa-circle"></i> Your TVET institution - to verify enrolment and supervise your placement;</li><li><i class="fas fa-circle"></i> Employers you apply to - to review your application;</li><li><i class="fas fa-circle"></i> Authorised platform administrators - for support, verification and security purposes.</li></ul><p>Other trainees cannot see your personal data.</p>`
  },
  {
    id: 's3', category: 'security',
    question: 'What should I do if I suspect fraud?',
    answer: `<p>If you suspect fraud, misrepresentation or any other abuse on the platform, please report it immediately to our support team at <strong>support@ujizilink.go.ke</strong> or through the <strong>Report</strong> option on the relevant listing or profile.</p><p>Never send money to anyone who claims to offer a placement. Ujuzi Link does not charge trainees for placements.</p>`
  },
  {
    id: 's4', category: 'security',
    question: 'How do I reset my password?',
    answer: `<p>On the sign-in page, click <strong>Forgot password?</strong> and follow the instructions sent to your registered email address or phone number. If you no longer have access to your registered contact details, please contact support for assistance.</p>`
  }
]