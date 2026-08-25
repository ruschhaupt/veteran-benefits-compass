import React, { useState, useRef, useCallback } from 'react';
import {
  Compass, ChevronRight, ChevronLeft,
  CheckCircle, Award, ArrowRight,
  Plus, Trash2, Search, Upload, FileText,
  Phone, TrendingUp, Target, Cpu,
  ExternalLink, X, Activity, Flag, Info,
  Home, CheckSquare
} from 'lucide-react';

// -----------------------------------------------------------------------
// 1. MEDICAL DATABASE FOR IN-BROWSER SCANNER
// -----------------------------------------------------------------------
const MED_DB = [
  { keywords: ['back pain','lower back','lumbar','lumbosacral','disc herniation','degenerative disc','spondylosis'], condition: 'Lumbar Spine Condition', dc: '5237 / 5243', ratingRange: '10-40%', note: 'Claim as Lumbosacral Strain (DC 5237) or Intervertebral Disc Syndrome (DC 5243). Never say back pain -- use the DC term.', secondary: ['Radiculopathy Lower Extremity','Sleep Apnea','Depression'] },
  { keywords: ['neck pain','cervical','cervical strain','cervical disc'], condition: 'Cervical Spine Condition', dc: '5237', ratingRange: '10-30%', note: 'Claim as Cervical Strain. Range of motion testing is key -- describe your worst day.', secondary: ['Radiculopathy Upper Extremity','Headaches'] },
  { keywords: ['knee','patellofemoral','meniscus','acl','mcl','chondromalacia'], condition: 'Knee Condition', dc: '5260 / 5257', ratingRange: '10-30%', note: 'File limitation of flexion AND instability separately. File bilateral for both knees.', secondary: ['Hip Condition','Ankle Condition'] },
  { keywords: ['shoulder','rotator cuff','labrum','subacromial','ac joint'], condition: 'Shoulder Condition', dc: '5201', ratingRange: '10-40%', note: 'Rated by limitation of motion. Dominant arm rates higher. File bilateral.', secondary: ['Radiculopathy Upper Extremity'] },
  { keywords: ['ankle','ankle sprain','ankle instability','plantar fasciitis'], condition: 'Ankle / Foot Condition', dc: '5271 / 5276', ratingRange: '0-30%', note: 'File instability and limitation of motion separately. File bilateral.', secondary: ['Knee Condition'] },
  { keywords: ['tinnitus','ringing in ears','ear ringing'], condition: 'Tinnitus', dc: '6260', ratingRange: '10% FLAT', note: 'The easiest claim available. Flat 10% regardless of severity. File this immediately if not done.', secondary: ['Hearing Loss','Migraine'] },
  { keywords: ['hearing loss','audiogram'], condition: 'Bilateral Hearing Loss', dc: '6100', ratingRange: '0-100%', note: 'Requires audiogram. File tinnitus AND hearing loss as separate claims.', secondary: ['Tinnitus'] },
  { keywords: ['headache','migraine'], condition: 'Migraine Headaches', dc: '8100', ratingRange: '0-50%', note: 'Rated by frequency of prostrating attacks per month. Keep a headache log.', secondary: ['Cervical Strain','Sleep Apnea'] },
  { keywords: ['numbness','tingling','radiculopathy','sciatica','neuropathy','nerve pain'], condition: 'Radiculopathy / Neuropathy', dc: '8520 / 8510', ratingRange: '10-40% per limb', note: 'File a separate claim for each affected limb. Secondary to spine conditions.', secondary: ['Lumbar Spine','Cervical Spine'] },
  { keywords: ['tbi','traumatic brain injury','concussion','blast exposure'], condition: 'Traumatic Brain Injury (TBI)', dc: '8045', ratingRange: '0-100%', note: 'Rate by cognitive and emotional symptoms. Push for ALL symptoms to be evaluated at the C&P.', secondary: ['Headache','Sleep Apnea','Depression'] },
  { keywords: ['ptsd','post traumatic','trauma','flashback','nightmares from service','hypervigilance'], condition: 'PTSD', dc: '9411', ratingRange: '0-100%', note: 'No combat required since 2010. Any in-service stressor qualifies. The stressor letter is critical.', secondary: ['Sleep Apnea','Depression','GERD','Hypertension'] },
  { keywords: ['depression','mdd','major depressive'], condition: 'Major Depressive Disorder', dc: '9434', ratingRange: '0-100%', note: 'File secondary to PTSD, chronic pain, or TBI for easier approval.', secondary: ['PTSD','Chronic Pain'] },
  { keywords: ['anxiety','panic attack','panic disorder','gad'], condition: 'Generalized Anxiety Disorder', dc: '9400', ratingRange: '0-100%', note: 'Can be primary or secondary to PTSD, TBI, or chronic pain.', secondary: ['PTSD','Depression'] },
  { keywords: ['mst','military sexual trauma','sexual assault'], condition: 'Military Sexual Trauma (MST)', dc: '9411 / 9400', ratingRange: '0-100%', note: 'In-service stressor requirements are relaxed for MST claims. Confidential claims are available.', secondary: ['PTSD','Depression'] },
  { keywords: ['sleep apnea','cpap','apnea'], condition: 'Obstructive Sleep Apnea', dc: '6847', ratingRange: '0-100%', note: '50% automatic if CPAP prescribed. File as secondary to PTSD, obesity, or TBI for easy approval.', secondary: ['Hypertension','Depression'] },
  { keywords: ['asthma','wheezing','reactive airway'], condition: 'Asthma / Reactive Airway Disease', dc: '6602', ratingRange: '10-100%', note: 'PACT Act presumptive for post-9/11 veterans deployed to SW Asia.', secondary: ['GERD','Sinusitis'] },
  { keywords: ['copd','emphysema','chronic bronchitis','pulmonary fibrosis'], condition: 'Chronic Respiratory Condition', dc: '6604', ratingRange: '10-100%', note: 'PACT Act presumptive for burn pit exposure. No nexus letter required.', secondary: ['Sleep Apnea'] },
  { keywords: ['hypertension','high blood pressure','htn'], condition: 'Hypertension', dc: '7101', ratingRange: '10-60%', note: 'PACT Act Gulf War presumptive. Also file secondary to PTSD or sleep apnea.', secondary: ['Cardiovascular Disease'] },
  { keywords: ['gerd','acid reflux','heartburn','gastroesophageal'], condition: 'GERD', dc: '7346', ratingRange: '10-60%', note: 'Very common and very winnable secondary to PTSD and stress.', secondary: ['Irritable Bowel'] },
  { keywords: ['diabetes','type 2 diabetes','t2d'], condition: 'Diabetes Mellitus Type II', dc: '7913', ratingRange: '10-100%', note: 'Agent Orange and Gulf War presumptive. PACT Act expanded coverage significantly.', secondary: ['Neuropathy','Hypertension','Kidney Condition'] },
  { keywords: ['burn pit','burn pits','deployed iraq','deployed afghanistan','deployed kuwait'], condition: 'Burn Pit / Toxic Exposure (PACT Act)', dc: 'Presumptive', ratingRange: 'Varies', note: 'PACT Act presumptive. No nexus letter needed. File VA Form 21-10210.', secondary: ['Respiratory','Cancer','Hypertension'] },
  { keywords: ['cancer','malignant','tumor','carcinoma','lymphoma'], condition: 'Cancer (Possible Service-Connected)', dc: 'Varies', ratingRange: '100% active', note: 'PACT Act dramatically expanded cancer coverage. ALWAYS file for any cancer diagnosis.', secondary: ['Depression','Neuropathy'] },
];

// -----------------------------------------------------------------------
// 2. C&P EXAM PRACTICE SIMULATOR SCENARIOS
// -----------------------------------------------------------------------
const CP_SIMULATOR_SCENARIOS = [
  {
    id: 'spine',
    title: 'Spine & Musculoskeletal DBQ Exam',
    examinerPrompt: '"Good morning. I see you noted back and neck pain. On a normal day, how does your back feel, and can you bend down to touch your toes for me?"',
    options: [
      {
        text: 'A) "Honestly, today is not too bad! I can bend pretty far if I warm up first, but sometimes after a long run it gets sore."',
        ratingImpact: 'DISASTER (Likely 0% - 10% or Denial)',
        feedback: 'Never describe your best or average day. When the examiner asks you to bend, VA regulations mandate that range of motion stops the moment PAIN or RESISTANCE begins, not when you physically can not move further. Minimizing your symptoms leads to severe under-rating.',
        isOptimal: false
      },
      {
        text: 'B) "On my worst days, pain radiates down my legs, making it difficult to put on shoes or sit for more than 20 minutes. As I bend, the pain begins right here at about 30 degrees of flexion, so I must stop."',
        ratingImpact: 'OPTIMAL (High 20% - 40% Rating + Secondary Radiculopathy)',
        feedback: 'Perfect execution. You accurately described functional impairment, your worst flare-ups, radiating nerve symptoms (secondary radiculopathy), and properly stopped the goniometer measurement when pain started.',
        isOptimal: true
      },
      {
        text: 'C) "It hurts all the time. 10 out of 10 pain 24/7. I can not move at all."',
        ratingImpact: 'SUSPICIOUS (Examiner may note exaggeration / lack of credibility)',
        feedback: 'Avoid exaggerating with "10/10 24/7" unless hospitalized. Focus on specific functional limitations (e.g. inability to lift groceries, sleep disturbances, flare-up frequency, and exact degrees of motion).',
        isOptimal: false
      }
    ]
  },
  {
    id: 'ptsd',
    title: 'Mental Health / PTSD DBQ Exam',
    examinerPrompt: '"How are things going with your family, sleep, and your job? Are you managing okay day to day?"',
    options: [
      {
        text: 'A) "Yeah, I am hanging in there. Work is fine and I manage to get through the day, just get a little stressed sometimes."',
        ratingImpact: 'DENIAL / LOW (0% - 10% Rating)',
        feedback: 'Military culture teaches us to say "I am fine." In a C&P exam, this destroys your claim. The VA rates mental health based on social and occupational impairment (38 CFR 4.130).',
        isOptimal: false
      },
      {
        text: 'B) "I struggle significantly. I isolate from friends, experience frequent nightmares and hypervigilance in crowds, wake up exhausted after 3 hours of sleep, and have had multiple verbal conflicts at work that resulted in disciplinary warnings."',
        ratingImpact: 'OPTIMAL (Solid 70% Rating - Occupational & Social Impairment)',
        feedback: 'Spot on. You clearly articulated specific symptoms corresponding to the 70% rating criteria: sleep impairment, panic/hypervigilance, social isolation, and occupational friction.',
        isOptimal: true
      },
      {
        text: 'C) "Everything is the military\'s fault and I hate everyone."',
        ratingImpact: 'UNHELPFUL (Lacks clinical symptom specificity)',
        feedback: 'Focus on clinical symptoms: frequency of panic attacks, mood regulation, memory lapses, sleep disruption, relationship strains, and inability to maintain social ties.',
        isOptimal: false
      }
    ]
  },
  {
    id: 'migraines',
    title: 'Migraine Headaches (DC 8100) C&P Exam',
    examinerPrompt: '"Tell me about your headaches. How often do they occur and what do you do when they strike?"',
    options: [
      {
        text: 'A) "I get them about once a week. I take some Advil and keep working through the headache."',
        ratingImpact: 'LOW (10% Rating)',
        feedback: 'If you can continue working, the VA considers the headache NON-PROSTRATING. 50% rating requires PROSTRATING attacks (attacks that force you to stop all activity and lie down in a dark, quiet room).',
        isOptimal: false
      },
      {
        text: 'B) "I experience severe throbbing headaches 2 to 3 times per month. They cause intense light sensitivity and nausea, forcing me to lay down in a dark room for 4-6 hours, missing work and completely stopping all activity."',
        ratingImpact: 'MAXIMUM RATING (50% Rating Schedule)',
        feedback: 'Excellent. You highlighted the critical legal keywords: "prostrating attacks", frequency (2+ times monthly), light/noise sensitivity, and concrete economic/work impact.',
        isOptimal: true
      }
    ]
  }
];

// -----------------------------------------------------------------------
// 3. THE GOLDEN STACKING PROTOCOL (5 FREEDOM STAGES)
// -----------------------------------------------------------------------
const FREEDOM_STAGES = [
  {
    id: 'stage1',
    stageNum: '1',
    timeframe: '12 - 6 Months to Separation',
    title: 'Active Duty Infiltration & Documentation',
    tagline: 'Documenting every physical and mental condition while active duty medical records still carry absolute presumption of service connection.',
    corePillars: [
      {
        title: 'Medical Documentation Blitz',
        desc: 'Go to medical/sick call for EVERY injury, ache, ringing in ears, insomnia, digestive issue, and mental strain. If it is not in your Service Treatment Record (STR), it is 10x harder to claim later.',
        action: 'Request full digital copies of your Service Treatment Records (STR) and dental records now.'
      },
      {
        title: 'MOS Credentialing & Security Clearance Lock-In',
        desc: 'Use DoD COOL, IgnitED, or Marine Corps Credentialing to earn civilian certifications (PMP, CompTIA Sec+, CISSP, AWS, Six Sigma) at zero cost before terminal leave.',
        action: 'Ensure your Secret/TS-SCI clearance is actively renewed so it remains in scope for defense/cleared tech jobs.'
      },
      {
        title: 'Credit Score & Liquidity Building',
        desc: 'Target a 740+ credit score to unlock optimal VA Loan terms. Build a 3-6 month cash emergency fund in a High-Yield Savings Account (HYSA).',
        action: 'Eliminate high-interest consumer debt before your separation date.'
      }
    ],
    proTip: 'Never tough it out. The greatest regret of 90% of veterans is not getting their medical records stamped while still in uniform.'
  },
  {
    id: 'stage2',
    stageNum: '2',
    timeframe: '180 - 90 Days to Separation (THE GOLDEN WINDOW)',
    title: 'The BDD Speedrun & SkillBridge Arbitrage',
    tagline: 'Filing your claims early and earning civilian income while still on full military pay.',
    corePillars: [
      {
        title: 'File Benefits Delivery at Discharge (BDD Claim)',
        desc: 'Between 180 and 90 days before separation, submit your BDD claim at VA.gov. Complete all C&P exams while still in uniform. Result: Your VA rating decision arrives on Day 1 out of the military with zero income gap.',
        action: 'File VA Form 21-526EZ online through VA.gov or with a free VSO.'
      },
      {
        title: 'DoD SkillBridge / Career Skills Program (CSP)',
        desc: 'Spend your final 6 months interning at high-paying civilian companies (Amazon, Microsoft, defense contractors, financial firms) while STILL receiving your full active duty base pay, BAH, and BAS.',
        action: 'Apply to SkillBridge opportunities 9 months in advance with commander approval.'
      },
      {
        title: 'Terminal Leave Maximization',
        desc: 'Stack 60+ days of saved terminal leave. This allows you to collect active duty pay AND start your new civilian job / GI Bill simultaneously (Double-dipping legally).',
        action: 'Calculate your exact leave balance and align it with your civilian start date.'
      }
    ],
    proTip: 'The BDD program is the single biggest cheat code in the transition process. If you miss the 90-day window, standard claims take 6-12 months longer.'
  },
  {
    id: 'stage3',
    stageNum: '3',
    timeframe: 'Months 1 - 12 Post-Separation',
    title: 'The Triple-Income Tax-Free Stacking Protocol',
    tagline: 'Stacking tax-free disability + education housing stipends + career salary for $150k - $220k+ net cash flow.',
    corePillars: [
      {
        title: 'Leg 1: 100% P&T VA Disability ($3,737 - $4,100+/mo Tax-Free)',
        desc: 'Provides a guaranteed lifetime floor of ~$45,000 - $50,000/year completely exempt from federal and state income taxes. Equivalent to earning $65,000+ in pre-tax civilian salary.',
        action: 'Set up direct deposit into a high-yield account; never let this money sit idle.'
      },
      {
        title: 'Leg 2: Post-9/11 GI Bill / VR&E Housing Allowance ($2,500 - $4,800/mo Tax-Free)',
        desc: 'Enroll in an accredited college or approved vocational bootcamp in a high-BAH zip code (e.g. San Francisco, NYC, San Diego, DC) or hybrid classes. Pocket $30,000 - $50,000/year tax-free in MHA while tuition and books are 100% covered.',
        action: 'Apply for VR&E (Chapter 31) FIRST to preserve your 36 months of Post-9/11 GI Bill for later.'
      },
      {
        title: 'Leg 3: Cleared Defense / Tech / Corporate Salary ($85,000 - $140,000/yr)',
        desc: 'Leverage your security clearance and military leadership for federal contracting (USAJOBS) or corporate roles. Your combined take-home pay immediately vaults you into the top 5% of household earners nationwide.',
        action: 'Target 10-point preference federal vacancies and cleared tech recruitment pipelines.'
      }
    ],
    proTip: 'Because 60%+ of your income in this phase is 100% tax-free, your effective tax rate is negligible, accelerating wealth accumulation 3x faster than normal civilians.'
  },
  {
    id: 'stage4',
    stageNum: '4',
    timeframe: 'Years 1 - 3 Post-Military',
    title: 'The VA Multi-Family House Hack & Roth Compounding Engine',
    tagline: 'Eliminating housing expenses forever, building equity, and automating the tax-free investment flywheel.',
    corePillars: [
      {
        title: 'The $0-Down VA Loan Multi-Family House Hack (2-4 Units)',
        desc: 'Use your VA Loan to purchase a duplex, triplex, or fourplex with ZERO down payment and ZERO Private Mortgage Insurance (PMI). Live in unit 1; rent out units 2, 3, and 4. The tenant rent pays your entire mortgage + generates net cash flow.',
        action: 'Because you are rated 10%+, the VA Funding Fee (normally 2.15%-3.3%) is completely WAIVED ($15k-$30k instant savings).'
      },
      {
        title: '100% P&T State Property Tax Shield ($5,000 - $15,000/yr Free)',
        desc: 'In states like Texas, Florida, Nevada, Washington, and many others, 100% P&T veterans pay $0 in real estate property taxes. This wipes out thousands in annual escrow costs, dramatically raising your rental yield.',
        action: 'File your VA disability summary letter with your county tax assessor immediately upon closing.'
      },
      {
        title: 'The Automated Compounding Snowball',
        desc: 'Max out your Roth IRA ($7,000/yr) with broad market index funds (VTI/VOO/QQQ). Contribute to an HSA and employer 401(k) match. Reinvest your VA disability check into income-producing assets.',
        action: 'In 5-8 years of consistent execution, your investment portfolio crosses the $1,000,000 net worth milestone.'
      }
    ],
    proTip: 'You can reuse your VA Loan entitlement repeatedly by refinancing into conventional loans or utilizing remaining bonus entitlement!'
  },
  {
    id: 'stage5',
    stageNum: '5',
    timeframe: 'Years 3+ and Beyond',
    title: 'Uncapped Sovereign Wealth & SDVOSB Freedom',
    tagline: 'Scaling enterprise contracting, geographic arbitrage, and true generational sovereignty.',
    corePillars: [
      {
        title: 'SDVOSB Federal Contracting Set-Asides ($25+ Billion Pool)',
        desc: 'Federal law mandates that 3%+ of all federal contracting dollars MUST go to Service-Disabled Veteran-Owned Small Businesses. This allows you to win sole-source government contracts up to $5M+ with zero bidding competition.',
        action: 'Register your entity on SAM.gov and certify via the SBA Veteran Small Business Certification (VetCert).'
      },
      {
        title: 'Geographic Arbitrage & Expat Freedom (Optional)',
        desc: 'With $4,000/mo in inflation-indexed tax-free VA compensation, you have top 1% purchasing power in world-class destinations like Portugal, Spain, Thailand, Mexico, Colombia, or Costa Rica.',
        action: 'Keep your US bank accounts (Charles Schwab for $0 worldwide ATM fees) and enjoy complete sovereign location independence.'
      },
      {
        title: 'CHAMPVA & Dependent Legacy Protection',
        desc: 'At 100% P&T, your spouse and children receive CHAMPVA (100% free healthcare) and Chapter 35 DEA (Dependents Educational Assistance paying $1,488/mo per child for college) + DIC survivor protection.',
        action: 'Enroll dependents in DEERS and CHAMPVA to ensure family security for life.'
      }
    ],
    proTip: 'True financial freedom is not about never working; it is about having the sovereign choice to only pursue work that brings you purpose and fulfillment.'
  }
];

// -----------------------------------------------------------------------
// 4. LIFE PLANNER GOALS & STEPS
// -----------------------------------------------------------------------
const PLANNER_GOALS = [
  { id: 'freedom',   icon: '⚡', label: 'Financial Freedom',        desc: 'Never need to work again -- live completely on benefits' },
  { id: 'travel',    icon: '✈', label: 'Travel / Expat Life',       desc: 'Live or travel abroad with full VA benefits intact' },
  { id: 'home',      icon: '🏠', label: 'Home Ownership',            desc: 'Buy a home or start building equity in real estate' },
  { id: 'family',    icon: '👨‍👩‍👧', label: 'Secure My Family',          desc: 'Healthcare, education, and insurance for dependents' },
  { id: 'business',  icon: '💼', label: 'Start a Business',          desc: 'Leverage SDVOSB set-asides and SBA programs' },
  { id: 'education', icon: '🎓', label: 'Get a Degree / Certification',desc: 'Maximize GI Bill and VR&E for free education' },
  { id: 'career',    icon: '🎯', label: 'Land a High-Paying Career', desc: 'Federal preference, clearance premium, and SkillBridge' },
  { id: 'debt',      icon: '📉', label: 'Eliminate Debt',            desc: 'Use veteran benefits to destroy debt and build credit' },
  { id: 'wealth',    icon: '📈', label: 'Generational Wealth',       desc: 'Real estate, Roth IRA, TSP -- build a legacy' },
];

const ALL_STEPS = [
  {
    id: 'disability_claim',
    goals: ['universal'],
    priority: 1,
    category: 'Foundation',
    title: 'File or Maximize Your VA Disability Claim',
    timeline: 'Immediately',
    action: 'File VA Form 21-526EZ at VA.gov. Every 10% rating increase = $150-400+/month MORE tax-free for life. Getting to 100% P&T is your single highest ROI action as a veteran.',
    why: 'At 100% P&T a single veteran receives $3,737+/month ($44,844/year) completely tax-free -- equivalent to a $60,000+ pre-tax salary. This income has zero earned-income limit and cannot be garnished.',
    value: 'Up to $44,844/yr tax-free',
    link: 'https://www.va.gov/disability/file-disability-claim/',
    form: 'VA Form 21-526EZ',
    hideWhen: (p) => p.currentRating >= 100,
  },
  {
    id: 'vso',
    goals: ['universal'],
    priority: 1,
    category: 'Foundation',
    title: 'Get a Free VSO (Veterans Service Officer)',
    timeline: 'This week',
    action: 'Contact DAV, VFW, or American Legion. A good VSO can identify conditions you missed, write nexus arguments, and prep your C&P exam strategy. This service is 100% FREE.',
    why: 'Veterans with VSO representation win claims at significantly higher rates. VSOs know the exact VA rating schedule language and can identify secondary claims you never knew you had.',
    value: 'Thousands in additional claims',
    link: 'https://www.va.gov/ogc/apps/accreditation/index.asp',
    form: null,
    hideWhen: null,
  },
  {
    id: 'va_healthcare',
    goals: ['universal'],
    priority: 1,
    category: 'Foundation',
    title: 'Enroll in VA Healthcare NOW',
    timeline: 'This week',
    action: 'Apply online at VA.gov with VA Form 10-10EZ. Enrollment is free and your priority group is based on your disability rating. Do this even if you feel healthy -- it documents your baseline for future claims.',
    why: 'Priority Group 1 (100% P&T) = zero copays for all care including prescriptions, mental health, and emergency visits. Value: $12,000-$20,000/year in healthcare costs eliminated.',
    value: '$0-$20,000/yr in healthcare costs',
    link: 'https://www.va.gov/health-care/apply-for-health-care-form-10-10ez/',
    form: 'VA Form 10-10EZ',
    hideWhen: null,
  },
  {
    id: 'tdiu',
    goals: ['freedom'],
    priority: 2,
    category: 'Income Maximization',
    title: 'File for TDIU (Total Disability Individual Unemployability)',
    timeline: 'If 70%+ rated and cannot maintain employment',
    action: 'File VA Form 21-8940. If your service-connected disabilities prevent substantial gainful employment, TDIU pays at the 100% rate ($3,737+/mo) even if your combined rating is only 60-70%.',
    why: 'TDIU is a critical bridge to 100% pay. Eligibility: one condition at 60%+ OR multiple conditions combined at 70%+ with one at 40%+. An employment limitation letter from your doctor + buddy statements from former employers = strong application.',
    value: '$3,737+/mo (100% rate)',
    link: 'https://www.va.gov/disability/eligibility/special-claims/unemployability/',
    form: 'VA Form 21-8940',
    hideWhen: null,
  },
  {
    id: 'property_tax',
    goals: ['freedom','home','wealth'],
    priority: 2,
    category: 'Expense Elimination',
    title: 'Claim Your State Property Tax Exemption',
    timeline: 'After establishing residency in target state',
    action: 'File with your county assessor. TX and FL: 100% exemption at 100% P&T = $0 property tax. NV: $22,500 exemption base. CA: up to $271K assessed value reduction. This is automatic annual savings every year.',
    why: 'On a $400,000 home in Texas, the property tax exemption saves approximately $8,000-$12,000 per year -- every year -- for the rest of your life. Over 20 years that is $160,000-$240,000 in tax-free savings.',
    value: '$4,000-$12,000/yr saved',
    link: 'https://www.benefits.va.gov/homeloans/documents/docs/va_policy_regarding_natural_disasters.pdf',
    form: 'File with county assessor',
    hideWhen: null,
  },
  {
    id: 'fmp',
    goals: ['travel'],
    priority: 1,
    category: 'Healthcare Abroad',
    title: 'Register for the Foreign Medical Program (FMP)',
    timeline: 'Before leaving the US',
    action: 'Complete VA FMP registration. The VA will pay 100% of all medical care, prescriptions, and treatments related to your service-connected conditions in 150+ countries. Doctors bill VA directly or you get reimbursed.',
    why: 'Healthcare is the #1 concern for expat veterans. FMP eliminates that concern entirely. You visit a local doctor, pay the bill, submit the claim to the VA, and get fully reimbursed within 4-6 weeks.',
    value: 'Full coverage worldwide',
    link: 'https://www.va.gov/health-care/foreign-medical-program/',
    form: 'VA Form 10-7959f-2',
    hideWhen: null,
  },
  {
    id: 'expat_banking',
    goals: ['travel'],
    priority: 1,
    category: 'Financial Setup',
    title: 'Open a Fee-Free Global Bank Account',
    timeline: 'Before leaving the US',
    action: 'Open a Charles Schwab High Yield Investor Checking account. It refunds ALL ATM fees worldwide with no foreign transaction fees. Keep USAA or Navy Federal as your primary account for wire receives.',
    why: 'International ATM fees and foreign transaction fees can cost $50-$150/month. Schwab eliminates these entirely. VA disability pays into your US account and you withdraw in local currency anywhere with zero fees.',
    value: '$600-$1,800/yr in fees saved',
    link: 'https://www.schwab.com/checking',
    form: null,
    hideWhen: null,
  },
  {
    id: 'va_loan',
    goals: ['home','wealth','debt'],
    priority: 1,
    category: 'Real Estate',
    title: 'Use Your VA Home Loan Benefit ($0 Down, $0 PMI)',
    timeline: 'When ready to buy',
    action: 'VA loan: 0% down payment, no PMI (private mortgage insurance), competitive interest rates, and the funding fee is WAIVED entirely if you have a 10%+ disability rating.',
    why: 'No PMI alone saves $200-$500/month vs a conventional loan. Zero down payment preserves your cash for investing. The funding fee waiver saves $8,000-$15,000 upfront on a $400K home.',
    value: '$8,000-$15,000 upfront + $200-500/mo PMI savings',
    link: 'https://www.va.gov/housing-assistance/home-loans/',
    form: 'VA Form 26-1880',
    hideWhen: null,
  },
  {
    id: 'house_hack',
    goals: ['home','wealth','freedom'],
    priority: 2,
    category: 'Real Estate Strategy',
    title: 'House Hack with a VA Multifamily Loan (2-4 Units)',
    timeline: 'When buying your first home',
    action: 'Buy a 2-4 unit property (duplex, triplex, or fourplex) with your VA loan. Live in one unit. Rent out the remaining units. The rental income often covers your entire mortgage payment.',
    why: 'Example: Buy a $450K fourplex with $0 down. Rent 3 units at $1,200 each = $3,600/month rental income. Mortgage is $2,800/month. You live FOR FREE with $800/month profit.',
    value: 'Potentially $0 housing cost + positive cash flow',
    link: 'https://www.va.gov/housing-assistance/home-loans/loan-types/purchase-loan/',
    form: 'VA Form 26-1880',
    hideWhen: null,
  },
  {
    id: 'champva',
    goals: ['family'],
    priority: 1,
    category: 'Family Healthcare',
    title: 'Enroll Dependents in CHAMPVA',
    timeline: 'After reaching 100% P&T',
    action: 'At 100% P&T, your spouse and children under 23 qualify for CHAMPVA -- comprehensive health insurance at near-zero cost. Apply with VA Form 10-10d.',
    why: 'Family health insurance typically costs $500-$1,500/month on the civilian market. CHAMPVA eliminates most of that cost. For a family of 4, this saves $6,000-$18,000/year in health insurance premiums alone.',
    value: '$6,000-$18,000/yr in insurance savings',
    link: 'https://www.va.gov/health-care/family-caregiver-benefits/champva/',
    form: 'VA Form 10-10d',
    hideWhen: null,
  },
  {
    id: 'chapter35',
    goals: ['family','wealth'],
    priority: 2,
    category: 'Dependent Education',
    title: 'Enroll Dependents in Chapter 35 DEA',
    timeline: 'When dependents are college-age',
    action: 'Chapter 35 Dependent Education Assistance pays $1,574/month directly to your spouse or each child enrolled in college, trade school, or an apprenticeship -- for up to 45 months per student.',
    why: 'If you have a spouse and two college-age children, the government pays $4,722/month ($56,664/year) in cash for them to attend school.',
    value: '$1,574/mo per student (up to 45 months)',
    link: 'https://www.va.gov/education/survivor-dependent-benefits/dependents-education-assistance/',
    form: 'VA Form 22-5490',
    hideWhen: null,
  },
  {
    id: 'sdvosb',
    goals: ['business'],
    priority: 1,
    category: 'Business',
    title: 'Get SDVOSB Certification for Federal Contracting',
    timeline: 'When starting or growing a business',
    action: 'Register your business at SAM.gov and apply for Service-Disabled Veteran-Owned Small Business (SDVOSB) certification through the SBA VetCert program.',
    why: 'The federal government is REQUIRED by law to award at least 5% of all federal contracting dollars to SDVOSBs. As an SDVOSB, you can receive sole-source contracts up to $4M without competitive bidding.',
    value: 'Access to $25B+ in set-aside contracts',
    link: 'https://www.sba.gov/federal-contracting/contracting-assistance-programs/service-disabled-veteran-owned-small-business-program',
    form: 'SBA VetCert at MySBA.gov',
    hideWhen: null,
  },
  {
    id: 'vre_business',
    goals: ['business','education'],
    priority: 2,
    category: 'Business + Education',
    title: 'Use VR&E Chapter 31 for Self-Employment or Degree',
    timeline: 'Apply immediately if 10%+ rated',
    action: 'VR&E (Chapter 31 Vocational Rehabilitation) is available to veterans with 10%+ disability rating and an employment handicap. It pays 100% of tuition at any school + all books, tools, and a laptop.',
    why: 'VR&E is often BETTER than the GI Bill: it provides up to 48 months of benefits (vs 36 for GI Bill), pays tuition directly, and does NOT use up your GI Bill entitlement -- saving it for later.',
    value: 'Up to 48 months of full tuition + $1,500-$2,800/mo stipend',
    link: 'https://www.va.gov/careers-employment/vocational-rehabilitation/',
    form: 'VA Form 28-1900',
    hideWhen: null,
  },
  {
    id: 'skillbridge',
    goals: ['career'],
    priority: 1,
    category: 'Career',
    title: 'Use DoD SkillBridge in Your Final 180 Days',
    timeline: 'While still on active duty (last 180 days)',
    action: 'SkillBridge allows you to intern at a civilian company (Microsoft, Amazon, Boeing, Lockheed) during your final 6 months of service while DoD continues paying your full military salary and benefits.',
    why: 'SkillBridge participants report a job offer rate of over 85% from their host companies. You transition directly into a civilian career with zero income gap.',
    value: 'Full military pay + civilian career launch',
    link: 'https://skillbridge.osd.mil/',
    form: 'Coordinate with your command',
    hideWhen: null,
  },
  {
    id: 'usajobs',
    goals: ['career'],
    priority: 1,
    category: 'Career',
    title: 'Apply for Federal Jobs with 10-Point Veterans Preference',
    timeline: 'After separation',
    action: 'Register at USAJOBS.gov. With a 10%+ disability rating, you receive 10-point preference. 30%+ rating qualifies you for Schedule A direct hire without competing with other applicants.',
    why: 'GS-12 to GS-13 federal positions pay $90,000-$130,000+/year with excellent benefits, pension (FERS), and 401K matching. Stacked with VA disability pay, this creates a strong dual-income foundation.',
    value: '$90K-$130K+ federal salary + dual VA income',
    link: 'https://www.usajobs.gov/',
    form: null,
    hideWhen: null,
  },
  {
    id: 'roth_ira',
    goals: ['wealth','freedom'],
    priority: 2,
    category: 'Investing',
    title: 'Open and Max a Roth IRA Every Year',
    timeline: 'As soon as you have any W-2 or self-employment income',
    action: 'Open a Roth IRA at Fidelity, Vanguard, or Schwab. Invest in a total market index fund (VTSAX, VTI, FSKAX). Contribute up to the annual limit ($7,000/yr).',
    why: 'A 25-year-old veteran contributing $7,000/year for 35 years at 10% average annual return will have approximately $1.9 million in a TAX-FREE Roth IRA at 60. Combined with VA disability pay, this is a completely tax-free retirement.',
    value: 'Potentially $1M-$2M+ tax-free at retirement',
    link: 'https://www.irs.gov/retirement-plans/roth-iras',
    form: null,
    hideWhen: null,
  },
  {
    id: 'pact_act',
    goals: ['universal'],
    priority: 1,
    category: 'Foundation',
    title: 'Check PACT Act Eligibility -- No Nexus Letter Needed',
    timeline: 'If deployed post-8/2/1990 to qualifying locations',
    action: 'If you served in Iraq, Afghanistan, Kuwait, Qatar, Bahrain, Saudi Arabia, or other SW Asia locations, listed conditions are presumed service-connected -- no proof required. File VA Form 21-10210.',
    why: 'PACT Act is the largest expansion of VA benefits in decades. Respiratory conditions, cancers, hypertension, and more qualify. If you were denied before 2022, file a Supplemental Claim immediately.',
    value: 'Presumptive claims without nexus letter',
    link: 'https://www.va.gov/resources/the-pact-act-and-your-va-benefits/',
    form: 'VA Form 21-526EZ or 20-0995',
    hideWhen: null,
  },
];

// -----------------------------------------------------------------------
// 5. MASTER CHECKLIST MILESTONES (TRACKER)
// -----------------------------------------------------------------------
const MILESTONES_DATA = [
  { id:'str_download', stage:'Pre-Separation', label:'Request and download full digital copies of your Service Treatment Records (STR) and dental files' },
  { id:'sick_call_log', stage:'Pre-Separation', label:'Go to medical/sick call to document every physical and mental symptom before terminal leave' },
  { id:'cool_cert', stage:'Pre-Separation', label:'Complete free civilian certifications (PMP, Sec+, AWS) via DoD COOL / Marine Corps Credentialing' },
  { id:'bdd_filed', stage:'BDD Window', label:'File Benefits Delivery at Discharge (BDD) claim at the exact 180-90 day pre-separation mark' },
  { id:'skillbridge_app', stage:'BDD Window', label:'Secure a DoD SkillBridge / CSP civilian corporate internship for your final 6 months' },
  { id:'va_account_set', stage:'Transition', label:'Set up Login.gov / ID.me authentication on VA.gov and check claim tracker status' },
  { id:'va_healthcare', stage:'Transition', label:'Enroll in VA Healthcare at your local VA Medical Center (Form 10-10EZ)' },
  { id:'buddy_letters', stage:'Transition', label:'Collect Lay / Buddy statements (VA Form 21-4138) from fellow service members' },
  { id:'va_loan_coe', stage:'Post-Separation', label:'Download your VA Loan Certificate of Eligibility (COE) on eBenefits / VA.gov' },
  { id:'roth_ira_opened', stage:'Post-Separation', label:'Open a Roth IRA and automate $583/mo ($7,000/yr) indexing into VOO/VTI' },
  { id:'state_tax_exempt', stage:'Post-Separation', label:'Submit your VA rating letter to your county tax assessor for full property tax exemption' },
];

// -----------------------------------------------------------------------
// MAIN COMPONENT: VeteranBenefitsCompass
// -----------------------------------------------------------------------
const VeteranBenefitsCompass = () => {

  // ---- Page Routing ----
  const [currentPage, setCurrentPage] = useState('landing');
  const [wizardStep, setWizardStep] = useState(0);

  // ---- Profile State ----
  const [branch, setBranch] = useState('usmc');
  const [separationMonths, setSeparationMonths] = useState(6);
  const [alreadyOut, setAlreadyOut] = useState(false);
  const [dischargeType, setDischargeType] = useState('honorable');
  const [disabilityStatus, setDisabilityStatus] = useState('none');
  const [currentRating, setCurrentRating] = useState(0);
  const [futurePath, setFuturePath] = useState('freedom');
  const [selectedState, setSelectedState] = useState('tx');
  const [hasDependents, setHasDependents] = useState('single');
  const [yearsOfService, setYearsOfService] = useState(4);
  const [servedPost911, setServedPost911] = useState(true);
  const [exposedBurnPit, setExposedBurnPit] = useState(false);
  const [mstFlag, setMstFlag] = useState(false);

  // ---- Dashboard Navigation ----
  const [activeTab, setActiveTab] = useState('planner');
  const [activeAvenue, setActiveAvenue] = useState('expat');
  const [claimsSubTab, setClaimsSubTab] = useState('math');
  const [claimsList, setClaimsList] = useState([50, 30, 10]);
  const [newClaimVal, setNewClaimVal] = useState(10);
  const [showCrisis, setShowCrisis] = useState(false);

  // ---- Planner Sub-Modes ----
  const [plannerMode, setPlannerMode] = useState('goals'); // 'goals' | 'protocol'
  const [planStage, setPlanStage] = useState(0);
  const [lifeGoals, setLifeGoals] = useState([]);
  const [planGenerated, setPlanGenerated] = useState(false);
  const [activeFreedomStage, setActiveFreedomStage] = useState('stage1');

  // ---- C&P Exam Simulator State ----
  const [selectedCpScenario, setSelectedCpScenario] = useState('spine');
  const [cpChoice, setCpChoice] = useState(null);

  // ---- House Hacker Calculator State ----
  const [homePrice, setHomePrice] = useState(450000);
  const [interestRate, setInterestRate] = useState(6.25);
  const [propertyUnits, setPropertyUnits] = useState(3);
  const [rentPerUnit, setRentPerUnit] = useState(1400);

  // ---- Milestone Tracker State ----
  const [completedMilestones, setCompletedMilestones] = useState({
    str_download: true,
    sick_call_log: true,
    va_account_set: true
  });

  // ---- Medical Scanner State ----
  const [scanText, setScanText] = useState('');
  const [scanResults, setScanResults] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);
  const fileInputRef = useRef(null);

  // -----------------------------------------------------------------------
  // BRANCH DATA
  // -----------------------------------------------------------------------
  const branchData = {
    usmc:  { name: 'Marine Corps', badge: 'USMC', sep: 'EAS' },
    army:  { name: 'Army',         badge: 'ARMY', sep: 'ETS' },
    navy:  { name: 'Navy',         badge: 'NAVY', sep: 'EAOS' },
    usaf:  { name: 'Air Force',    badge: 'USAF', sep: 'DOS' },
    uscg:  { name: 'Coast Guard',  badge: 'USCG', sep: 'DOS' },
    ussf:  { name: 'Space Force',  badge: 'USSF', sep: 'ETS' },
  };
  const bd = branchData[branch] || branchData.usmc;

  // -----------------------------------------------------------------------
  // VA MATH
  // -----------------------------------------------------------------------
  const calcCombined = (ratings) => {
    let remaining = 100;
    let combined = 0;
    [...ratings].sort((a,b)=>b-a).forEach(r => {
      const c = (remaining * r) / 100;
      combined += c;
      remaining -= c;
    });
    return Math.round(combined);
  };
  const combinedRaw = calcCombined(claimsList);
  const roundedRating = combinedRaw >= 95 ? 100 : Math.round(combinedRaw / 10) * 10;

  const vaPayTable = {
    0:   { single:0,    single_kids:0,    spouse:0,    family:0    },
    10:  { single:175,  single_kids:189,  spouse:195,  family:211  },
    20:  { single:346,  single_kids:367,  spouse:384,  family:409  },
    30:  { single:537,  single_kids:568,  spouse:603,  family:641  },
    40:  { single:774,  single_kids:813,  spouse:860,  family:911  },
    50:  { single:1102, single_kids:1152, spouse:1211, family:1275 },
    60:  { single:1395, single_kids:1453, spouse:1529, family:1606 },
    70:  { single:1759, single_kids:1830, spouse:1921, family:2014 },
    80:  { single:2044, single_kids:2126, spouse:2232, family:2339 },
    90:  { single:2297, single_kids:2390, spouse:2512, family:2633 },
    100: { single:3737, single_kids:3849, spouse:3946, family:4094 },
  };
  const depKey = hasDependents === 'single' ? 'single'
    : hasDependents === 'single_kids' ? 'single_kids'
    : hasDependents === 'spouse' ? 'spouse'
    : 'family';
  const monthlyPay = (vaPayTable[roundedRating] || vaPayTable[0])[depKey] || 0;
  const annualPay = monthlyPay * 12;

  // -----------------------------------------------------------------------
  // HOUSE HACK CALCULATOR LOGIC
  // -----------------------------------------------------------------------
  const calcHouseHack = () => {
    const monthlyRate = (interestRate / 100) / 12;
    const nPayments = 360;
    const monthlyMortgagePI = (homePrice * (monthlyRate * Math.pow(1 + monthlyRate, nPayments))) / (Math.pow(1 + monthlyRate, nPayments) - 1);
    const estimatedInsurance = (homePrice * 0.005) / 12;
    const estimatedTaxes = (currentRating === 100 && (selectedState === 'tx' || selectedState === 'fl')) ? 0 : (homePrice * 0.015) / 12;
    const totalPITI = monthlyMortgagePI + estimatedInsurance + estimatedTaxes;
    const tenantUnits = Math.max(0, propertyUnits - 1);
    const grossRentalIncome = tenantUnits * rentPerUnit;
    const netHousingCost = totalPITI - grossRentalIncome;
    const netMonthlyProfit = grossRentalIncome - totalPITI;
    const annualSavingsVsRenting = (1800 * 12) - (netHousingCost > 0 ? netHousingCost * 12 : 0) + (netMonthlyProfit > 0 ? netMonthlyProfit * 12 : 0);
    const fiveYearEquityGrowth = (homePrice * 0.04 * 5) + (monthlyMortgagePI * 0.35 * 60);

    return {
      monthlyMortgagePI: Math.round(monthlyMortgagePI),
      totalPITI: Math.round(totalPITI),
      tenantUnits,
      grossRentalIncome,
      netHousingCost: Math.round(netHousingCost),
      netMonthlyProfit: Math.round(netMonthlyProfit),
      annualSavingsVsRenting: Math.round(annualSavingsVsRenting),
      fiveYearEquityGrowth: Math.round(fiveYearEquityGrowth),
      propertyTaxWaived: (currentRating === 100 && (selectedState === 'tx' || selectedState === 'fl'))
    };
  };
  const hh = calcHouseHack();

  // -----------------------------------------------------------------------
  // LIFE PLANNER ROADMAP GENERATOR
  // -----------------------------------------------------------------------
  const toggleGoal = (id) => {
    setLifeGoals(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  const generateRoadmap = () => {
    const profile = { currentRating, dischargeType, yearsOfService, servedPost911, exposedBurnPit };
    return ALL_STEPS
      .filter(step => {
        if (step.hideWhen && step.hideWhen(profile)) return false;
        if (step.goals.includes('universal')) return true;
        return step.goals.some(g => lifeGoals.includes(g));
      })
      .sort((a, b) => a.priority - b.priority);
  };
  const roadmap = planGenerated ? generateRoadmap() : [];

  // -----------------------------------------------------------------------
  // MEDICAL SCANNER ENGINE
  // -----------------------------------------------------------------------
  const runMedScan = useCallback(() => {
    if (!scanText.trim()) return;
    setScanLoading(true);
    setTimeout(() => {
      const lower = scanText.toLowerCase();
      const found = [];
      const foundNames = new Set();
      MED_DB.forEach(entry => {
        if (foundNames.has(entry.condition)) return;
        const hit = entry.keywords.find(kw => lower.includes(kw));
        if (hit) { found.push({ ...entry, matchedKeyword: hit }); foundNames.add(entry.condition); }
      });
      const secondaries = new Set();
      found.forEach(f => f.secondary.forEach(s => { if (!foundNames.has(s)) secondaries.add(s); }));
      const pactFlag = exposedBurnPit || lower.includes('burn pit') || lower.includes('iraq') || lower.includes('afghanistan') || lower.includes('kuwait');
      setScanResults({ found, secondaries: [...secondaries], pactFlag });
      setScanLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 1100);
  }, [scanText, exposedBurnPit]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => setScanText(evt.target.result);
    reader.readAsText(file);
  };

  // -----------------------------------------------------------------------
  // STATE BENEFITS MATRIX
  // -----------------------------------------------------------------------
  const stateBenefits = {
    tx: { name:'Texas',      highlights:['100% P&T = 100% property tax exemption ($4K-$12K+/yr)','No state income tax on any income','Hazlewood Act: 150 credit hours free tuition at TX public colleges (transferable to dependents)','Free DV license plates and hunting/fishing licenses','VLB land and home loan program (low-rate second lien loans)'] },
    fl: { name:'Florida',    highlights:['No state income tax','100% P&T = full property tax exemption','Free college tuition for dependents of 100% P&T vets at FL state schools','Free hunting and fishing license for any rating','Florida Resident Access Grant for private colleges'] },
    nv: { name:'Nevada',     highlights:['No state income tax on any income','Property tax exemption: $22,500 base; 100% P&T = full exemption','Free Nevada State Parks annual pass','Free NDOW hunting and fishing licenses at 100% P&T','DMV waives registration fees for disabled veterans'] },
    ca: { name:'California', highlights:['No state tax on VA disability pay (military retirement partially taxed)','CalVet Farm and Home Loan at below-market rates','Property tax exemption up to $271K assessed value reduction','College Fee Waiver for veteran dependents at all CA public colleges','Free fishing and hunting license at 100% P&T'] },
    wa: { name:'Washington', highlights:['No state income tax','Property tax exemption at 100% P&T','Free hunting and fishing licenses','Reduced tuition at WA state colleges','State veterans cemetery at no cost'] },
    az: { name:'Arizona',    highlights:['Military retirement fully exempt from state income tax','Property tax exemption for disabled veterans','AZ Veteran Supportive Campus priority admissions','Free AZ hunting and fishing licenses at 100% P&T','Disabled veteran home loan program'] },
  };
  const stateInfo = stateBenefits[selectedState] || stateBenefits.tx;

  // -----------------------------------------------------------------------
  // AVENUES DATA
  // -----------------------------------------------------------------------
  const avenues = {
    expat: { label: 'The Expat Route', tagline: 'Your VA pay goes 3-10x further overseas.',
      bullets: [
        'VA disability transfers to ANY country via US bank account -- no interruption',
        'Foreign Medical Program (FMP) covers ALL service-connected care in 150+ countries',
        'Top destinations: Portugal, Mexico, Thailand, Costa Rica, Colombia, Panama',
        '100% P&T = $3,737-$4,094/mo tax-free. Luxury lifestyle in SE Asia or Latin America for $1,200-$1,800/mo',
        'Charles Schwab Investor Checking: zero ATM fees worldwide, zero foreign transaction fees',
        'GI Bill accepted at 1,000+ international universities -- earn a degree while traveling',
        'No US federal tax on VA disability -- even while living abroad',
      ], ctaText: 'Foreign Medical Program', ctaUrl: 'https://www.va.gov/health-care/foreign-medical-program/' },
    fire: { label: 'Financial Freedom (FIRE)', tagline: 'VA disability + smart investing = retire before 40.',
      bullets: [
        '100% P&T tax-free equivalent: $3,737/mo = $61K-$74K pre-tax salary equivalent (depending on state)',
        'Zero earned income limit on VA disability -- work as much as you want in addition',
        'No PMI with VA loan saves $200-$500/month vs conventional mortgages',
        '100% P&T in TX or FL = $0 property taxes ($6K-$12K/year in saved overhead)',
        'CHAMPVA for family: eliminates $500-$1,500/month in health insurance premiums',
        'Roth IRA + index fund investing on tax-free disability income = tax-free retirement',
        'TDIU if 70%+: receive 100% pay even at a lower rating if unable to maintain employment',
      ], ctaText: 'TDIU Information', ctaUrl: 'https://www.va.gov/disability/eligibility/special-claims/unemployability/' },
    education: { label: 'Education Stacking', tagline: 'Free degrees, monthly cash, and 48 months of benefits.',
      bullets: [
        'VR&E Chapter 31: 10%+ rated -- full tuition + $1,500-$2,800/mo stipend + laptop + books (48 months)',
        'Use VR&E FIRST to preserve your 36 months of GI Bill for later or transfer to dependents',
        'Post-9/11 GI Bill: 100% tuition + $1,000/yr books + BAH ($2,000-$4,500/mo based on location)',
        'Yellow Ribbon Program: attend Harvard Law or top medical schools at zero cost',
        'GI Bill at overseas universities: earn a degree in Europe, UK, or Australia with full MHA',
        'CLEP/DSST exams: test out of courses and compress a 4-year degree into 2 years',
        'Stack: Community college transfer credits + Yellow Ribbon + CLEP = maximum ROI',
      ], ctaText: 'Vocational Rehab', ctaUrl: 'https://www.va.gov/careers-employment/vocational-rehabilitation/' },
    career: { label: 'High-Paying Career', tagline: 'Federal preference, clearance premium, SkillBridge.',
      bullets: [
        'SkillBridge: last 180 days on full military pay -- intern at your target civilian employer',
        'USAJOBS 10-point preference (10%+ rated): major advantage in federal hiring with GS-12/13 salaries',
        'Schedule A direct hire: 30%+ disability = no competitive process needed for federal jobs',
        'TS/SCI clearance commands $30K-$80K salary premium at defense contractors',
        'Hiring Our Heroes: 12-week fellowship at Fortune 500 companies (free)',
        'ClearanceJobs.com: dedicated job board for cleared veterans -- highest quality veteran jobs',
        'Target dual income: Federal GS salary ($90K-$130K) PLUS VA disability ($1,000-$3,700/mo)',
      ], ctaText: 'SkillBridge Program', ctaUrl: 'https://skillbridge.osd.mil/' },
    business: { label: 'Veteran Business Owner', tagline: 'SDVOSB set-asides and SBA support you never knew existed.',
      bullets: [
        'SDVOSB: Service-Disabled Veteran-Owned Small Business gives you access to $25B+ in set-aside federal contracts annually',
        'Sole-source contracts up to $4M: win government work without competitive bidding',
        'VR&E Chapter 31 can fund your entire self-employment plan: business equipment, training, and operating costs',
        'SBA Veterans Advantage: reduced loan guarantee fees on SBA 7(a) loans',
        'Boots to Business: free 2-day SBA entrepreneurship course available through TAP',
        'PTAC (Procurement Technical Assistance Centers): free federal contracting guidance in every state',
        'Register at SAM.gov + SBA VetCert = access to all government contracting set-asides',
      ], ctaText: 'SBA Boots to Business', ctaUrl: 'https://boots2business.org' },
  };

  // -----------------------------------------------------------------------
  // TOOLTIP COMPONENT
  // -----------------------------------------------------------------------
  const Tooltip = ({ text, children }) => (
    <span className="relative group inline-flex">
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 w-56 bg-gray-950 border border-gold/30 text-sand/90 text-xs rounded-lg p-2.5 shadow-2xl leading-relaxed">
        {text}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-950"/>
      </span>
    </span>
  );

  // -----------------------------------------------------------------------
  // CRISIS BANNER
  // -----------------------------------------------------------------------
  const CrisisBanner = () => (
    <div className="fixed bottom-4 right-4 z-50">
      {showCrisis ? (
        <div className="bg-gray-900 border border-scarlet rounded-xl p-4 max-w-xs shadow-2xl">
          <div className="flex justify-between items-start mb-2">
            <span className="text-scarlet font-black text-sm uppercase tracking-wider">Veterans Crisis Line</span>
            <button onClick={()=>setShowCrisis(false)} className="text-sand/40 hover:text-sand ml-2"><X size={14}/></button>
          </div>
          <p className="text-sand font-black text-2xl">988 -- Press 1</p>
          <p className="text-sand/70 text-xs mt-1">Text: 838255</p>
          <p className="text-sand/70 text-xs">Chat: VeteransCrisisLine.net</p>
          <p className="text-sand/50 text-xs mt-2">24/7. No enrollment needed. You are not alone.</p>
        </div>
      ) : (
        <button onClick={()=>setShowCrisis(true)}
          className="bg-scarlet hover:bg-red-800 text-sand rounded-full px-4 py-2 text-xs font-black shadow-lg flex items-center gap-1.5 transition-all uppercase tracking-wider">
          <Phone size={12}/> Crisis Line
        </button>
      )}
    </div>
  );

  // -----------------------------------------------------------------------
  // LANDING PAGE
  // -----------------------------------------------------------------------
  if (currentPage === 'landing') return (
    <div className="min-h-screen bg-steel-dark text-sand flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"/>
      <CrisisBanner/>

      <header className="border-b border-steel/50 bg-steel-dark/90 backdrop-blur-md py-4 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center font-mono">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-scarlet animate-ping"/>
            <span className="text-xs tracking-widest uppercase opacity-70 font-bold">SITREP: ACTIVE TRANSITION PORTAL</span>
          </div>
          <span className="text-xs border border-gold/30 px-3 py-1 rounded bg-gold/5 text-gold font-bold">UNCLASSIFIED</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center relative z-10">
        {/* Subtle Crayon Easter Egg */}
        <div className="absolute top-8 right-8 text-3xl opacity-5 hover:opacity-40 transition-opacity cursor-default select-none" title="Every Marine's secret weapon">
          {String.fromCodePoint(0x1F58D)}
        </div>

        <div className="mb-6 p-4 rounded-full bg-gold/5 border border-gold/20 inline-flex">
          <Compass className="w-14 h-14 text-gold animate-pulse"/>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 uppercase">
          Stepping Through <span className="text-scarlet">the Portal</span>
        </h1>
        <p className="text-xl text-sand/70 max-w-2xl mb-4 font-light">
          The all-inclusive military transition portal. Every benefit, real estate house hack, C&P exam simulator, and wealth strategy -- in one unified system.
        </p>
        <p className="text-sm text-sand/40 mb-10">All branches. All paths. Crayon-reader friendly.</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl w-full mb-10 text-left">
          {[
            { icon:<Target size={16}/>,      title:'Life & Wealth Planner',    desc:'Goal-based action blueprint & 5-stage stacking' },
            { icon:<Home size={16}/>,        title:'VA House Hacker Engine',   desc:'2-4 unit multi-family real estate calculator' },
            { icon:<Activity size={16}/>,    title:'C&P Exam Simulator',       desc:'Practice DBQ scenarios & avoid trap answers' },
            { icon:<FileText size={16}/>,     title:'Medical File Scanner',     desc:'Upload records, discover missed DC claims' },
            { icon:<TrendingUp size={16}/>,   title:'VA Math Simulator',        desc:'Live combined whole-person calculation' },
            { icon:<CheckSquare size={16}/>,  title:'Milestone Tracker',        desc:'Interactive transition milestone checklist' },
          ].map((f,i)=>(
            <div key={i} className="bg-steel/30 border border-steel/60 hover:border-gold/40 rounded-xl p-3 transition-all">
              <div className="text-gold mb-1">{f.icon}</div>
              <div className="font-bold text-sm">{f.title}</div>
              <div className="text-xs text-sand/50 mt-0.5">{f.desc}</div>
            </div>
          ))}
        </div>

        <div className="w-full max-w-md bg-steel/30 border border-steel/60 p-6 rounded-2xl backdrop-blur-sm">
          <p className="font-mono text-xs uppercase tracking-widest text-gold mb-4">Select your branch of service</p>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {Object.entries(branchData).map(([key,b])=>(
              <button key={key} onClick={()=>setBranch(key)}
                className={"p-3 rounded-xl border transition-all text-center " + (branch===key ? "border-gold bg-gold/10 text-gold shadow-lg" : "border-steel/60 text-sand/50 hover:text-sand hover:border-steel")}>
                <div className="font-black text-xs uppercase">{b.badge}</div>
                <div className="text-xs opacity-60 mt-0.5">{b.name}</div>
              </button>
            ))}
          </div>
          <button onClick={()=>{ setCurrentPage('wizard'); setWizardStep(0); }}
            className="w-full py-4 bg-scarlet hover:bg-red-800 text-sand font-black text-base uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 group transition-all">
            Step Through the Portal <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
          </button>
        </div>
      </main>

      <footer className="border-t border-steel/50 bg-steel-dark/80 py-4 text-center text-xs text-sand/30 font-mono relative z-10">
        <span>For informational purposes only. Not legal or medical advice. Always consult a VSO or VA-accredited attorney.</span>
        <span className="ml-4 text-sand/10 hover:text-sand/30 transition-colors" title="Crayon-powered">
          {String.fromCodePoint(0x1F58D)} made with crayons
        </span>
      </footer>
    </div>
  );

  // -----------------------------------------------------------------------
  // WIZARD
  // -----------------------------------------------------------------------
  if (currentPage === 'wizard') {
    const steps = ['Branch', 'Status', 'Health', 'Path'];

    return (
      <div className="min-h-screen bg-steel-dark text-sand flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"/>
        <CrisisBanner/>

        <header className="border-b border-steel/50 bg-steel-dark/90 backdrop-blur-md py-4 px-6 relative z-10 font-mono">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button onClick={()=>setCurrentPage('landing')} className="flex items-center gap-1 text-xs uppercase hover:text-gold transition-colors">
              <ChevronLeft size={14}/> Abort
            </button>
            <span className="text-xs text-gold uppercase tracking-wider">Phase {wizardStep+1} of {steps.length}</span>
          </div>
        </header>

        <div className="bg-steel-dark/80 px-6 py-3 border-b border-steel/30 relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-1 mb-1">
              {steps.map((_,i)=><div key={i} className={"flex-1 h-1.5 rounded-full transition-all " + (i<=wizardStep ? "bg-scarlet" : "bg-steel/50")}/>)}
            </div>
            <div className="flex justify-between text-xs font-mono">
              {steps.map((s,i)=><span key={i} className={i===wizardStep ? "text-gold font-bold" : i<wizardStep ? "text-sand/50" : "text-sand/30"}>{s}</span>)}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto relative z-10">
          <div className="max-w-2xl mx-auto p-6 md:p-10">
            <div className="bg-steel/20 border border-steel/50 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl">

              {/* Step 0: Branch */}
              {wizardStep === 0 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Confirm Branch Identity</h2>
                    <p className="text-sand/60 text-sm">We adapt vocabulary, timelines, and culture to your branch.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(branchData).map(([key,b])=>(
                      <button key={key} onClick={()=>setBranch(key)}
                        className={"p-4 border rounded-xl text-left transition-all " + (branch===key ? "border-gold bg-gold/10 text-sand" : "border-steel/60 bg-steel-dark/30 text-sand/50 hover:text-sand hover:border-steel")}>
                        <div className="font-black text-sm uppercase tracking-wider">{b.name}</div>
                        <div className="text-xs opacity-60 mt-0.5">Sep. term: {b.sep}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Status */}
              {wizardStep === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Separation Status</h2>
                    <p className="text-sand/60 text-sm">This shapes your entire action plan and timeline.</p>
                  </div>

                  <div className="bg-steel-dark/50 border border-steel/50 rounded-xl p-4 space-y-4">
                    <div className="font-mono text-xs uppercase tracking-widest text-gold font-bold">Separation Timing</div>
                    <div className="grid grid-cols-2 gap-2">
                      {[{val:false, label:'Active / Upcoming '+bd.sep},{val:true, label:'Already Separated'}].map(opt=>(
                        <button key={String(opt.val)} onClick={()=>setAlreadyOut(opt.val)}
                          className={"p-3 rounded-lg border text-sm text-center transition-all " + (alreadyOut===opt.val ? "border-gold bg-gold/10 text-sand font-medium" : "border-steel/60 text-sand/50 hover:text-sand hover:border-steel")}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {!alreadyOut && (<>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-sand/50">Months until {bd.sep}</span>
                        <span className="text-gold font-black">{separationMonths} months</span>
                      </div>
                      <input type="range" min={1} max={24} value={separationMonths} onChange={e=>setSeparationMonths(Number(e.target.value))}
                        className="w-full h-2.5 rounded-full cursor-pointer accent-red-600 bg-steel/40"/>
                      <div className="flex gap-1.5">
                        {[6,12,18,24].map(v=>(
                          <button key={v} onClick={()=>setSeparationMonths(v)}
                            className={"flex-1 text-xs py-1.5 rounded-lg border transition-all font-mono " + (separationMonths===v ? "border-gold text-gold" : "border-steel/50 text-sand/40 hover:border-steel")}>
                            {v}mo
                          </button>
                        ))}
                      </div>
                    </>)}
                  </div>

                  <div className="bg-steel-dark/50 border border-steel/50 rounded-xl p-4 space-y-3">
                    <div className="font-mono text-xs uppercase tracking-widest text-gold font-bold">Discharge Characterization</div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {val:'honorable',    label:'Honorable',                  sub:'Full benefit access'},
                        {val:'general',      label:'General (Under Honorable)',   sub:'Most benefits, limited GI Bill'},
                        {val:'oth',          label:'Other Than Honorable (OTH)', sub:'Very limited -- upgrade available'},
                        {val:'bad_conduct',  label:'Bad Conduct / Dishonorable', sub:'Upgrade process available'},
                      ].map(d=>(
                        <button key={d.val} onClick={()=>setDischargeType(d.val)}
                          className={"p-3 rounded-lg border text-left text-xs transition-all " + (dischargeType===d.val ? "border-gold bg-gold/10" : "border-steel/60 hover:border-steel")}>
                          <div className="font-bold text-sand">{d.label}</div>
                          <div className="text-sand/50 mt-0.5">{d.sub}</div>
                        </button>
                      ))}
                    </div>
                    {dischargeType !== 'honorable' && (
                      <div className="p-2 bg-scarlet/10 border border-scarlet/30 rounded-lg text-xs text-scarlet/90">
                        Discharge upgrade may be possible. Your dashboard includes a full step-by-step guide.
                      </div>
                    )}
                  </div>

                  <div className="bg-steel-dark/50 border border-steel/50 rounded-xl p-4 space-y-3">
                    <div className="font-mono text-xs uppercase tracking-widest text-gold font-bold">Years of Service</div>
                    <div className="grid grid-cols-5 gap-2">
                      {[1,2,3,4,6,8,10,12,16,20].map(y=>(
                        <button key={y} onClick={()=>setYearsOfService(y)}
                          className={"py-2 text-sm rounded-lg border transition-all font-mono " + (yearsOfService===y ? "border-gold bg-gold/10 text-gold font-black" : "border-steel/50 text-sand/40 hover:border-steel hover:text-sand")}>
                          {y}yr
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Health */}
              {wizardStep === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Health and Disability Profile</h2>
                    <p className="text-sand/60 text-sm">Honest answers unlock the most accurate benefit plan.</p>
                  </div>

                  <div className="bg-steel-dark/50 border border-steel/50 rounded-xl p-4 space-y-4">
                    <div className="font-mono text-xs uppercase tracking-widest text-gold font-bold">VA Disability Status</div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {val:'none',    label:'No Rating Yet',              sub:'Have not filed a claim'},
                        {val:'pending', label:'Filed -- Pending',           sub:'Waiting on decision'},
                        {val:'filed',   label:'Rated -- Seeking Increase',  sub:'Have rating, want more'},
                        {val:'rated',   label:'Have Established Rating',    sub:'Know current number'},
                      ].map(s=>(
                        <button key={s.val} onClick={()=>setDisabilityStatus(s.val)}
                          className={"p-3 rounded-lg border text-left text-xs transition-all " + (disabilityStatus===s.val ? "border-gold bg-gold/10" : "border-steel/60 hover:border-steel")}>
                          <div className="font-bold text-sand">{s.label}</div>
                          <div className="text-sand/50 mt-0.5">{s.sub}</div>
                        </button>
                      ))}
                    </div>
                    {(disabilityStatus==='rated'||disabilityStatus==='filed') && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-sand/50">Current Combined Rating</span>
                          <span className="text-gold font-black text-lg">{currentRating}%</span>
                        </div>
                        <input type="range" min={0} max={100} step={10} value={currentRating} onChange={e=>setCurrentRating(Number(e.target.value))}
                          className="w-full h-2.5 rounded-full cursor-pointer accent-red-600 bg-steel/40"/>
                        <div className="flex justify-between text-xs text-sand/30 font-mono"><span>0%</span><span>50%</span><span>100%</span></div>
                      </div>
                    )}
                  </div>

                  <div className="bg-steel-dark/50 border border-steel/50 rounded-xl p-4 space-y-3">
                    <div className="font-mono text-xs uppercase tracking-widest text-gold font-bold">Service Exposure</div>
                    {[
                      {state:servedPost911,  setter:setServedPost911,  label:'Served post-9/11 (after September 11, 2001)'},
                      {state:exposedBurnPit, setter:setExposedBurnPit, label:'Exposed to burn pits, contaminated water, or toxic chemicals'},
                      {state:mstFlag,        setter:setMstFlag,        label:'Experienced Military Sexual Trauma (MST) -- private and confidential'},
                    ].map((item,i)=>(
                      <button key={i} onClick={()=>item.setter(!item.state)}
                        className={"w-full p-3 rounded-lg border text-left text-sm flex items-center gap-3 transition-all " + (item.state ? "border-gold/50 bg-gold/5" : "border-steel/50 hover:border-steel")}>
                        <div className={"w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 " + (item.state ? "border-gold bg-gold" : "border-steel/60")}>
                          {item.state && <span className="text-steel-dark font-black" style={{fontSize:'10px'}}>X</span>}
                        </div>
                        <span className={item.state ? "text-sand" : "text-sand/60"}>{item.label}</span>
                      </button>
                    ))}
                    {exposedBurnPit && (
                      <div className="p-2 bg-gold/5 border border-gold/20 rounded-lg text-xs text-gold/80">
                        PACT Act Alert: Presumptive claims available -- no nexus letter required. Your roadmap will include this.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Path */}
              {wizardStep === 3 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Your Future Mission</h2>
                    <p className="text-sand/60 text-sm">We will build your personalized action plan around your goals.</p>
                  </div>

                  <div className="bg-steel-dark/50 border border-steel/50 rounded-xl p-4 space-y-3">
                    <div className="font-mono text-xs uppercase tracking-widest text-gold font-bold">Primary Path</div>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(avenues).map(([key,a])=>(
                        <button key={key} onClick={()=>setFuturePath(key)}
                          className={"p-3 rounded-lg border text-left text-xs transition-all " + (futurePath===key ? "border-gold bg-gold/10" : "border-steel/60 hover:border-steel")}>
                          <div className="font-bold text-sand">{a.label}</div>
                          <div className="text-sand/50 mt-0.5">{a.tagline}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-steel-dark/50 border border-steel/50 rounded-xl p-4 space-y-3">
                      <div className="font-mono text-xs uppercase tracking-widest text-gold font-bold">Target State</div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {Object.entries(stateBenefits).map(([key,s])=>(
                          <button key={key} onClick={()=>setSelectedState(key)}
                            className={"p-2 rounded-lg border text-xs text-center transition-all " + (selectedState===key ? "border-gold bg-gold/10 text-gold font-bold" : "border-steel/50 text-sand/40 hover:text-sand hover:border-steel")}>
                            {s.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="bg-steel-dark/50 border border-steel/50 rounded-xl p-4 space-y-3">
                      <div className="font-mono text-xs uppercase tracking-widest text-gold font-bold">Dependents</div>
                      <div className="space-y-1.5">
                        {[
                          {val:'single',      label:'Single -- No Dependents'},
                          {val:'single_kids', label:'Single Parent (kids, not married)'},
                          {val:'spouse',      label:'Married, No Children'},
                          {val:'family',      label:'Married with Children'},
                        ].map(d=>(
                          <button key={d.val} onClick={()=>setHasDependents(d.val)}
                            className={"w-full p-2 rounded-lg border text-xs text-left transition-all " + (hasDependents===d.val ? "border-gold bg-gold/10 text-sand font-medium" : "border-steel/50 text-sand/40 hover:text-sand hover:border-steel")}>
                            {d.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Nav buttons */}
              <div className="flex gap-3 mt-6 pt-5 border-t border-steel/40">
                {wizardStep > 0 && (
                  <button onClick={()=>setWizardStep(w=>w-1)}
                    className="flex items-center gap-1 px-4 py-2.5 border border-steel/60 rounded-xl text-sm hover:border-steel transition-all font-mono uppercase">
                    <ChevronLeft size={14}/> Back
                  </button>
                )}
                {wizardStep < steps.length - 1 ? (
                  <button onClick={()=>setWizardStep(w=>w+1)}
                    className="flex-1 py-2.5 bg-scarlet hover:bg-red-800 rounded-xl font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-wider">
                    Continue <ChevronRight size={16}/>
                  </button>
                ) : (
                  <button onClick={()=>{ setCurrentPage('dashboard'); setActiveTab('planner'); }}
                    className="flex-1 py-3 bg-gold hover:bg-yellow-600 text-steel-dark font-black text-base rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider shadow-lg">
                    Launch Dashboard <ArrowRight size={18}/>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // DASHBOARD NAV TABS CONFIGURATION WITH TOOLTIPS
  // -----------------------------------------------------------------------
  const tabs = [
    { id:'planner',   icon:<Target size={13}/>,       label:'Life & Wealth Planner',  tooltip:'Interactive goal-driven roadmap + the 5-Stage Golden Stacking Protocol for retiring early on benefits and real estate.' },
    { id:'househack', icon:<Home size={13}/>,         label:'VA House Hacker',        tooltip:'Interactive multi-family (2-4 units) real estate calculator. Calculate $0-down mortgage, rental cash flow, and equity growth.' },
    { id:'claims',    icon:<Activity size={13}/>,     label:'Claims & C&P Sim',       tooltip:'Practice C&P exam DBQ scenarios, calculate VA whole-person math, explore secondary claims, and review the Diagnostic Lexicon.' },
    { id:'scanner',   icon:<Cpu size={13}/>,          label:'Med Scanner',            tooltip:'Upload or paste medical records to scan for 25+ service-connected conditions, DC codes, and PACT Act presumptives. 100% private.' },
    { id:'avenues',   icon:<Compass size={13}/>,      label:'Avenues',                tooltip:'5 proven life pathways: Expat living, FIRE, Education stacking, high-paying civilian career, and SDVOSB entrepreneurship.' },
    { id:'benefits',  icon:<Award size={13}/>,        label:'State Matrix',           tooltip:'Comprehensive state-by-state veteran benefits: full property tax exemptions, free college tuition, vehicle registration waivers.' },
    { id:'tracker',   icon:<CheckSquare size={13}/>,  label:'Milestones',             tooltip:'Interactive transition checklist across Pre-Separation, BDD Window, and Post-Separation with live progress saving.' },
    { id:'upgrade',   icon:<Flag size={13}/>,         label:'Discharge Guide',        tooltip:'Step-by-step discharge upgrade guide for DRB and BCMR/BCNR boards under PTSD/MST Liberal Consideration.' },
    { id:'resources', icon:<Phone size={13}/>,        label:'Resources',              tooltip:'Veterans Crisis Line, free VSO locator (DAV/VFW), mental health (Headstrong free therapy), and official VA Form downloads.' },
  ];

  return (
    <div className="min-h-screen bg-steel-dark text-sand flex flex-col">
      <CrisisBanner/>

      {/* Top Nav */}
      <header className="border-b border-steel/50 bg-steel-dark/90 backdrop-blur-md py-3 px-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Compass className="text-gold" size={18}/>
            <span className="font-black text-sm uppercase tracking-wider">VET-COMPASS</span>
            <span className="text-sand/30 font-mono text-xs border border-steel/40 px-2 py-0.5 rounded">{bd.badge}</span>
          </div>
          <div className="flex items-center gap-4">
            {currentRating > 0 && (
              <span className="text-xs text-gold font-mono font-bold border border-gold/30 px-2 py-1 rounded bg-gold/5">
                {currentRating}% Rated
              </span>
            )}
            <button onClick={()=>setCurrentPage('wizard')} className="text-xs text-sand/40 hover:text-gold transition-colors font-mono uppercase tracking-wider">
              Edit Profile
            </button>
          </div>
        </div>
      </header>

      {/* Income Banner (if rated) */}
      {currentRating >= 10 && (
        <div className="bg-steel/20 border-b border-steel/30 px-6 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-mono">
            <span className="text-sand/50">Estimated VA Tax-Free Income:</span>
            <span className="text-gold font-black text-base">${monthlyPay.toLocaleString()}/mo</span>
            <span className="text-sand/40">${annualPay.toLocaleString()}/yr -- 100% tax-free</span>
          </div>
        </div>
      )}

      {/* Tab Bar */}
      <div className="bg-steel-dark/90 border-b border-steel/50 overflow-x-auto sticky top-14 z-30">
        <div className="max-w-7xl mx-auto flex gap-0 min-w-max px-2">
          {tabs.map(t=>(
            <Tooltip key={t.id} text={t.tooltip}>
              <button
                onClick={()=>setActiveTab(t.id)}
                className={"flex items-center gap-1.5 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap uppercase tracking-wider font-mono " + (activeTab===t.id ? "border-gold text-gold" : "border-transparent text-sand/40 hover:text-sand/70")}>
                {t.icon} {t.label}
                <Info size={10} className="opacity-30 hover:opacity-70 transition-opacity"/>
              </button>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">

          {/* ============================================================ */}
          {/* TAB 1: LIFE & WEALTH PLANNER                                 */}
          {/* ============================================================ */}
          {activeTab === 'planner' && (
            <div className="space-y-6">
              {/* Header / Mode Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-steel/40 pb-4">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Life & Wealth Success Planner</h2>
                  <p className="text-sand/50 text-sm">Actionable blueprints to achieve total financial sovereignty after service.</p>
                </div>
                <div className="flex bg-steel-dark border border-steel/50 rounded-xl p-1 font-mono text-xs">
                  <button onClick={()=>setPlannerMode('goals')}
                    className={"px-3 py-1.5 rounded-lg font-bold transition-all " + (plannerMode==='goals' ? "bg-scarlet text-sand" : "text-sand/50 hover:text-sand")}>
                    Goal-Driven Blueprint
                  </button>
                  <button onClick={()=>setPlannerMode('protocol')}
                    className={"px-3 py-1.5 rounded-lg font-bold transition-all " + (plannerMode==='protocol' ? "bg-scarlet text-sand" : "text-sand/50 hover:text-sand")}>
                    5-Stage Golden Stacking
                  </button>
                </div>
              </div>

              {/* SUB-MODE A: GOAL-DRIVEN BLUEPRINT */}
              {plannerMode === 'goals' && (<>
                {!planGenerated ? (<>
                  {planStage === 0 && (<>
                    <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 text-sm text-sand/70">
                      Select every goal that applies to your vision for life after service. Select as many as you want and we will build a prioritized roadmap tailored to your selections.
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {PLANNER_GOALS.map(g=>(
                        <button key={g.id} onClick={()=>toggleGoal(g.id)}
                          className={"p-4 rounded-xl border text-left transition-all flex items-start gap-3 " + (lifeGoals.includes(g.id) ? "border-gold bg-gold/10 shadow-lg" : "border-steel/60 hover:border-steel bg-steel/10")}>
                          <span className="text-2xl flex-shrink-0">{g.icon}</span>
                          <div>
                            <div className={"font-bold text-sm " + (lifeGoals.includes(g.id) ? "text-sand" : "text-sand/70")}>{g.label}</div>
                            <div className="text-xs text-sand/50 mt-0.5">{g.desc}</div>
                          </div>
                          {lifeGoals.includes(g.id) && <CheckCircle size={16} className="text-gold ml-auto flex-shrink-0 mt-0.5"/>}
                        </button>
                      ))}
                    </div>

                    {lifeGoals.length > 0 && (
                      <button onClick={()=>setPlanStage(1)}
                        className="w-full py-3 bg-scarlet hover:bg-red-800 text-sand font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2">
                        Continue to Financial Snapshot ({lifeGoals.length} goal{lifeGoals.length!==1?'s':''} selected) <ChevronRight size={16}/>
                      </button>
                    )}
                  </>)}

                  {planStage === 1 && (<>
                    <div className="bg-steel/20 border border-steel/50 rounded-2xl p-5 space-y-5">
                      <div>
                        <h3 className="font-black uppercase tracking-tight text-lg">Quick Situation Snapshot</h3>
                        <p className="text-sand/50 text-xs mt-1">This lets us order your steps by highest ROI first.</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="font-mono text-xs uppercase tracking-widest text-gold font-bold mb-2">Selected Goals:</div>
                          <div className="flex flex-wrap gap-2">
                            {lifeGoals.map(g=>{
                              const goal = PLANNER_GOALS.find(pg=>pg.id===g);
                              return goal ? (
                                <span key={g} className="bg-steel/30 border border-gold/30 text-xs px-2 py-1 rounded-full text-gold font-mono">
                                  {goal.icon} {goal.label}
                                </span>
                              ) : null;
                            })}
                          </div>
                        </div>

                        <div>
                          <div className="font-mono text-xs uppercase tracking-widest text-gold font-bold mb-2">Profile Snapshot:</div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                            {[
                              {label:'Branch',    val:bd.name},
                              {label:'Discharge', val:dischargeType},
                              {label:'Rating',    val:currentRating>0 ? currentRating+'%' : 'Unrated'},
                              {label:'State',     val:stateInfo.name},
                              {label:'Service',   val:yearsOfService+' years'},
                              {label:'Dependents',val:hasDependents.replace('_',' ')},
                            ].map((item,i)=>(
                              <div key={i} className="bg-steel-dark/60 border border-steel/40 rounded-lg p-2">
                                <div className="text-sand/40">{item.label}</div>
                                <div className="font-bold text-sand capitalize">{item.val}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button onClick={()=>setPlanStage(0)} className="flex items-center gap-1 px-4 py-2.5 border border-steel/60 rounded-xl text-sm hover:border-steel transition-all font-mono uppercase">
                        <ChevronLeft size={14}/> Back
                      </button>
                      <button onClick={()=>{ setPlanGenerated(true); }}
                        className="flex-1 py-3 bg-gold hover:bg-yellow-600 text-steel-dark font-black text-base rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider shadow-lg">
                        Generate My Success Blueprint <ArrowRight size={18}/>
                      </button>
                    </div>
                  </>)}
                </>) : (<>
                  {/* Generated Roadmap */}
                  <div className="bg-gold/5 border border-gold/20 rounded-xl p-4">
                    <div className="font-mono text-xs uppercase tracking-widest text-gold font-bold mb-1">Personalized Success Blueprint</div>
                    <div className="text-sm text-sand/60">{roadmap.length} action items generated based on your goals and profile. Ordered by highest ROI.</div>
                  </div>

                  <div className="space-y-3">
                    {roadmap.map((step, i) => {
                      const priorityColor = step.priority === 1 ? 'border-l-scarlet' : step.priority === 2 ? 'border-l-gold' : 'border-l-steel';
                      return (
                        <div key={step.id} className={"bg-steel/20 border border-steel/50 border-l-4 " + priorityColor + " rounded-r-xl p-5"}>
                          <div className="flex items-start gap-3 mb-3">
                            <div className={"w-7 h-7 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 " + (step.priority===1 ? "bg-scarlet text-sand" : step.priority===2 ? "bg-gold text-steel-dark" : "bg-steel text-sand/60")}>
                              {i+1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-black text-sand text-sm">{step.title}</h4>
                                <span className="text-xs border border-steel/60 text-sand/40 px-2 py-0.5 rounded-full font-mono">{step.category}</span>
                              </div>
                              <div className="text-gold text-xs font-mono mt-0.5">{step.timeline}</div>
                            </div>
                            {step.form && (
                              <span className="text-xs bg-steel-dark border border-steel/50 text-sand/50 px-2 py-1 rounded font-mono hidden md:block">{step.form}</span>
                            )}
                          </div>
                          <p className="text-sm text-sand/70 mb-2 ml-10">{step.action}</p>
                          <div className="ml-10 space-y-2">
                            <div className="bg-steel-dark/60 border border-steel/40 rounded-lg p-3">
                              <span className="text-xs text-gold font-mono font-bold">WHY THIS MATTERS: </span>
                              <span className="text-xs text-sand/60">{step.why}</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <div className="text-xs font-mono">
                                <span className="text-sand/40">Est. Value: </span>
                                <span className="text-gold font-bold">{step.value}</span>
                              </div>
                              {step.link && (
                                <a href={step.link} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-xs text-scarlet hover:text-red-400 transition-colors font-mono uppercase tracking-wider">
                                  Take Action <ExternalLink size={10}/>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button onClick={()=>{ setPlanGenerated(false); setPlanStage(0); setLifeGoals([]); }}
                    className="text-xs text-sand/40 hover:text-sand/70 transition-colors flex items-center gap-1 font-mono uppercase tracking-wider">
                    <X size={12}/> Start Over -- Change My Goals
                  </button>
                </>)}
              </>)}

              {/* SUB-MODE B: 5-STAGE GOLDEN STACKING PROTOCOL */}
              {plannerMode === 'protocol' && (
                <div className="space-y-6">
                  {/* Stage Selector Pills */}
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest text-gold font-bold mb-2">Select Transition Phase:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                      {FREEDOM_STAGES.map((s)=>(
                        <button key={s.id} onClick={()=>setActiveFreedomStage(s.id)}
                          className={"p-3 rounded-xl border text-left transition-all " + (activeFreedomStage===s.id ? "border-gold bg-gold/10 text-sand shadow-lg" : "border-steel/60 bg-steel/10 text-sand/40 hover:border-steel hover:text-sand")}>
                          <div className="font-mono text-xs text-gold font-bold mb-0.5">Stage {s.stageNum}</div>
                          <div className="font-bold text-xs line-clamp-1">{s.title}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Active Stage Detail */}
                  {(() => {
                    const stage = FREEDOM_STAGES.find(s=>s.id === activeFreedomStage) || FREEDOM_STAGES[0];
                    return (
                      <div className="bg-steel/20 border border-steel/50 rounded-2xl p-6 space-y-6">
                        <div className="border-b border-steel/40 pb-4">
                          <span className="text-xs font-mono text-gold uppercase tracking-wider">Stage {stage.stageNum} of 5 -- {stage.timeframe}</span>
                          <h3 className="text-2xl font-black uppercase tracking-tight text-sand mt-1">{stage.title}</h3>
                          <p className="text-sand/60 text-sm mt-1">{stage.tagline}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {stage.corePillars.map((p,i)=>(
                            <div key={i} className="bg-steel-dark/60 border border-steel/40 rounded-xl p-4 flex flex-col justify-between">
                              <div>
                                <h4 className="font-bold text-gold text-sm mb-2">{p.title}</h4>
                                <p className="text-xs text-sand/70 leading-relaxed mb-3">{p.desc}</p>
                              </div>
                              <div className="bg-steel/30 border border-steel/50 rounded-lg p-2 text-xs text-sand/50">
                                <span className="font-bold text-sand/70 font-mono">Action: </span>{p.action}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 text-xs text-sand/70">
                          <span className="font-black text-gold font-mono uppercase">Pro Tip: </span>
                          {stage.proTip}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: VA HOUSE HACKER REAL ESTATE ENGINE                    */}
          {/* ============================================================ */}
          {activeTab === 'househack' && (
            <div className="space-y-6">
              <div className="bg-steel/20 border border-steel/50 rounded-2xl p-6">
                <span className="font-mono text-xs text-gold uppercase tracking-widest font-bold">The Real Estate Wealth Multiplier</span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mt-1">
                  VA Multi-Family <span className="text-gold">House Hacking Engine</span>
                </h2>
                <p className="text-sand/60 text-sm mt-1 max-w-2xl leading-relaxed">
                  Use your VA Loan to purchase up to a <span className="text-gold font-bold">4-unit multi-family property</span> with $0 down payment and $0 PMI. Combine with state property tax exemptions to live 100% mortgage-free while building massive equity.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inputs */}
                <div className="bg-steel/20 border border-steel/50 rounded-2xl p-6 space-y-4">
                  <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                    <Home size={18} className="text-gold"/> Property Parameters
                  </h3>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-sand/50">Purchase Price ($0 Down VA Loan):</span>
                      <span className="text-gold font-black">${homePrice.toLocaleString()}</span>
                    </div>
                    <input type="range" min={200000} max={1500000} step={25000} value={homePrice} onChange={e=>setHomePrice(Number(e.target.value))}
                      className="w-full h-2 rounded-full cursor-pointer accent-red-600 bg-steel/40"/>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-sand/50">Interest Rate:</span>
                      <span className="text-sand font-black">{interestRate}%</span>
                    </div>
                    <input type="range" min={4.0} max={9.0} step={0.125} value={interestRate} onChange={e=>setInterestRate(Number(e.target.value))}
                      className="w-full h-2 rounded-full cursor-pointer accent-red-600 bg-steel/40"/>
                  </div>

                  <div>
                    <div className="text-xs font-mono text-sand/50 mb-2">Total Units (You live in 1, rent the rest):</div>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { u:1, label:'Single (1)' },
                        { u:2, label:'Duplex (2)' },
                        { u:3, label:'Triplex (3)' },
                        { u:4, label:'Fourplex (4)' },
                      ].map(item=>(
                        <button key={item.u} onClick={()=>setPropertyUnits(item.u)}
                          className={"p-2 rounded-xl border text-center text-xs font-bold transition-all " + (propertyUnits===item.u ? "border-gold bg-gold/10 text-gold" : "border-steel/50 text-sand/40 hover:border-steel")}>
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {propertyUnits > 1 && (
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-sand/50">Rent per Tenant Unit:</span>
                        <span className="text-gold font-black">${rentPerUnit.toLocaleString()}/mo</span>
                      </div>
                      <input type="range" min={600} max={3500} step={50} value={rentPerUnit} onChange={e=>setRentPerUnit(Number(e.target.value))}
                        className="w-full h-2 rounded-full cursor-pointer accent-red-600 bg-steel/40"/>
                    </div>
                  )}

                  {hh.propertyTaxWaived && (
                    <div className="p-3 bg-gold/5 border border-gold/20 rounded-xl text-xs text-gold">
                      100% P&T Tax Shield Active ({stateInfo.name}): Property taxes estimated at $0/mo!
                    </div>
                  )}
                </div>

                {/* Live Output Card */}
                <div className="bg-steel/20 border border-steel/50 rounded-2xl p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight mb-4">Cash Flow & Equity Output</h3>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm border-b border-steel/40 pb-2">
                        <span className="text-sand/50">Monthly Total Payment (PITI):</span>
                        <span className="font-mono font-bold text-sand">${hh.totalPITI.toLocaleString()}/mo</span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-b border-steel/40 pb-2">
                        <span className="text-sand/50">Tenant Rental Income ({hh.tenantUnits} units):</span>
                        <span className="font-mono font-bold text-gold">+${hh.grossRentalIncome.toLocaleString()}/mo</span>
                      </div>
                      <div className="bg-steel-dark/60 border border-steel/50 rounded-xl p-4">
                        <div className="text-xs font-mono text-sand/50 mb-1 uppercase">Net Out-of-Pocket Housing Cost:</div>
                        <div className="text-3xl font-black text-gold">
                          {hh.netMonthlyProfit > 0 ? (
                            <span className="text-gold">+${hh.netMonthlyProfit.toLocaleString()}/mo PROFIT</span>
                          ) : (
                            <span>${hh.netHousingCost.toLocaleString()}/mo</span>
                          )}
                        </div>
                        <div className="text-xs text-sand/40 mt-1">
                          {hh.netMonthlyProfit > 0 ? 'You live 100% for free AND get paid every month!' : 'Significantly cheaper than market rent.'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="bg-steel-dark/60 border border-steel/40 p-3 rounded-xl">
                      <div className="text-sand/40 font-mono">5-Yr Equity Est.</div>
                      <div className="text-lg font-black text-gold mt-0.5">${hh.fiveYearEquityGrowth.toLocaleString()}</div>
                    </div>
                    <div className="bg-steel-dark/60 border border-steel/40 p-3 rounded-xl">
                      <div className="text-sand/40 font-mono">Annual Savings</div>
                      <div className="text-lg font-black text-sand mt-0.5">${hh.annualSavingsVsRenting.toLocaleString()}/yr</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: CLAIMS & C&P EXAM PRACTICE SIMULATOR                  */}
          {/* ============================================================ */}
          {activeTab === 'claims' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Claims, C&P Exam Sim & Stacking</h2>
                <p className="text-sand/50 text-sm">Practice DBQ exam scenarios, master VA math, and explore secondary chains.</p>
              </div>

              {/* Sub-nav */}
              <div className="flex flex-wrap gap-2">
                {[
                  {id:'math',       label:'VA Math Simulator'},
                  {id:'exam_sim',   label:'C&P Exam Simulator'},
                  {id:'secondaries',label:'Secondary Stacking'},
                  {id:'terms',      label:'Diagnostic Lexicon'},
                  {id:'pact',       label:'PACT Act'},
                  {id:'tdiu',       label:'TDIU ($3,737/mo)'},
                ].map(s=>(
                  <button key={s.id} onClick={()=>setClaimsSubTab(s.id)}
                    className={"px-3 py-1.5 rounded-full text-xs font-bold border transition-all uppercase tracking-wider font-mono " + (claimsSubTab===s.id ? "bg-scarlet border-scarlet text-sand" : "border-steel/60 text-sand/50 hover:border-steel hover:text-sand")}>
                    {s.label}
                  </button>
                ))}
              </div>

              {/* SUB-TAB 1: VA MATH */}
              {claimsSubTab === 'math' && (
                <div className="bg-steel/20 border border-steel/50 rounded-2xl p-5 space-y-4">
                  <div>
                    <h3 className="font-black uppercase tracking-tight">Interactive VA Math Simulator</h3>
                    <p className="text-sand/50 text-xs mt-1">VA uses whole-person combined math, not simple addition.</p>
                  </div>
                  <div className="space-y-2">
                    {claimsList.map((val,i)=>(
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xs text-sand/40 font-mono w-5">#{i+1}</span>
                        <select value={val} onChange={e=>{ const c=[...claimsList]; c[i]=Number(e.target.value); setClaimsList(c); }}
                          className="bg-steel-dark border border-steel/60 rounded-lg px-3 py-1.5 text-sm flex-1 text-sand focus:outline-none focus:border-gold">
                          {[10,20,30,40,50,60,70,80,90].map(v=><option key={v} value={v}>{v}%</option>)}
                        </select>
                        <button onClick={()=>setClaimsList(claimsList.filter((_,j)=>j!==i))} className="text-sand/30 hover:text-scarlet transition-colors">
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <select value={newClaimVal} onChange={e=>setNewClaimVal(Number(e.target.value))}
                      className="bg-steel-dark border border-steel/60 rounded-lg px-3 py-1.5 text-sm flex-1 text-sand focus:outline-none focus:border-gold">
                      {[10,20,30,40,50,60,70,80,90].map(v=><option key={v} value={v}>{v}%</option>)}
                    </select>
                    <button onClick={()=>setClaimsList([...claimsList,newClaimVal])}
                      className="flex items-center gap-1 bg-scarlet hover:bg-red-800 px-3 py-1.5 rounded-lg text-sm font-bold transition-all">
                      <Plus size={14}/> Add
                    </button>
                  </div>
                  <div className="bg-steel-dark/60 border border-steel/50 rounded-xl p-5 text-center">
                    <div className="text-sand/50 text-xs mb-1 font-mono uppercase">Combined VA Math Result</div>
                    <div className="text-5xl font-black text-scarlet">{combinedRaw}%</div>
                    <div className="text-sand/50 text-sm mt-1">VA rounds to: <span className="text-sand font-black text-2xl">{roundedRating}%</span></div>
                    <div className="text-gold text-sm mt-2 font-black">
                      ${(vaPayTable[roundedRating] || vaPayTable[0])[depKey]?.toLocaleString() || '0'}/month tax-free
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: C&P EXAM PRACTICE SIMULATOR */}
              {claimsSubTab === 'exam_sim' && (
                <div className="bg-steel/20 border border-steel/50 rounded-2xl p-6 space-y-6">
                  <div>
                    <h3 className="font-black text-lg text-sand flex items-center gap-2">
                      <Activity size={20} className="text-gold"/> C&P Disability Examination Practice Simulator
                    </h3>
                    <p className="text-sand/50 text-xs mt-1">Test your responses against real VA DBQs to avoid the trap answers that cost veterans thousands.</p>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {CP_SIMULATOR_SCENARIOS.map((sc)=>(
                      <button key={sc.id} onClick={()=>{ setSelectedCpScenario(sc.id); setCpChoice(null); }}
                        className={"px-3 py-1.5 rounded-xl border text-xs font-bold transition-all " + (selectedCpScenario===sc.id ? "border-gold bg-gold/10 text-gold" : "border-steel/60 text-sand/40 hover:border-steel hover:text-sand")}>
                        {sc.title}
                      </button>
                    ))}
                  </div>

                  {(() => {
                    const sc = CP_SIMULATOR_SCENARIOS.find(s=>s.id===selectedCpScenario) || CP_SIMULATOR_SCENARIOS[0];
                    return (
                      <div className="space-y-4">
                        <div className="bg-steel-dark/80 p-4 rounded-xl border border-steel/50">
                          <div className="text-xs font-mono text-gold uppercase tracking-wider mb-1">Examiner Asks:</div>
                          <p className="text-sm text-sand font-serif italic">{sc.examinerPrompt}</p>
                        </div>

                        <div className="space-y-2">
                          <div className="text-xs font-mono text-sand/50 uppercase">Select Your Response:</div>
                          {sc.options.map((opt, idx)=>(
                            <button key={idx} onClick={()=>setCpChoice(idx)}
                              className={"w-full p-4 rounded-xl border text-left text-sm transition-all " + (cpChoice===idx ? "border-gold bg-gold/10" : "border-steel/50 bg-steel-dark/40 hover:border-steel text-sand/70")}>
                              {opt.text}
                            </button>
                          ))}
                        </div>

                        {cpChoice !== null && (
                          <div className={"p-4 rounded-xl border " + (sc.options[cpChoice].isOptimal ? "bg-gold/5 border-gold/30" : "bg-scarlet/10 border-scarlet/30")}>
                            <div className="flex items-center gap-2 mb-2 font-mono text-xs font-black">
                              <span>Impact:</span>
                              <span className={sc.options[cpChoice].isOptimal ? "text-gold" : "text-scarlet"}>
                                {sc.options[cpChoice].ratingImpact}
                              </span>
                            </div>
                            <p className="text-xs text-sand/80 leading-relaxed">{sc.options[cpChoice].feedback}</p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* SUB-TAB 3: SECONDARY STACKING */}
              {claimsSubTab === 'secondaries' && (
                <div className="space-y-3">
                  <p className="text-sand/60 text-sm">Secondary claims are conditions caused or aggravated by an already-rated condition. You only prove the link to your rated condition, not to military service.</p>
                  {[
                    {primary:'PTSD / Anxiety / Depression',  secondaries:['Sleep Apnea (50% auto with CPAP)','GERD','Hypertension','Erectile Dysfunction (10% if medication needed)','Migraines','Chronic Fatigue']},
                    {primary:'Lower Back (Lumbar)',           secondaries:['Radiculopathy lower extremity (legs)','Hip Condition','Knee Condition','Bladder or Bowel Dysfunction','Sleep Apnea (pain prevents sleep)']},
                    {primary:'Cervical Spine (Neck)',         secondaries:['Radiculopathy upper extremity (arms/hands)','Carpal Tunnel Syndrome','Migraine Headaches']},
                    {primary:'Sleep Apnea',                  secondaries:['Hypertension','Cardiovascular Disease','Depression','Erectile Dysfunction','Cognitive Impairment']},
                    {primary:'Diabetes Mellitus Type 2',     secondaries:['Peripheral Neuropathy (all 4 limbs rated separately)','Hypertension','Erectile Dysfunction','Kidney Disease','Retinopathy']},
                    {primary:'TBI',                          secondaries:['Sleep Apnea','Migraine','Depression','PTSD','Cognitive Impairment','Vestibular Disorder']},
                  ].map((item,i)=>(
                    <div key={i} className="bg-steel/20 border border-steel/50 rounded-xl p-4">
                      <div className="text-gold font-bold mb-2 text-sm">{item.primary} -- secondary chains:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.secondaries.map((s,j)=><span key={j} className="bg-steel-dark border border-steel/60 text-xs px-2 py-1 rounded-full text-sand/70">{s}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SUB-TAB 4: DIAGNOSTIC LEXICON */}
              {claimsSubTab === 'terms' && (
                <div className="space-y-3">
                  <div className="bg-scarlet/10 border border-scarlet/30 rounded-xl p-3 text-xs text-scarlet/90">
                    Critical Rule: Never say "back pain." Say "Lumbosacral Strain DC 5237." The exact diagnostic code determines your rating schedule.
                  </div>
                  <div className="grid gap-3">
                    {[
                      {wrong:'Back pain / lower back problems',         right:'Lumbosacral Strain (DC 5237) or Intervertebral Disc Syndrome IVDS (DC 5243)',              tip:'Claim BOTH if discs are involved. File bilateral.'},
                      {wrong:'Neck pain',                               right:'Cervical Strain (DC 5237) or Cervical IVDS (DC 5243)',                                    tip:'Claim radiculopathy secondary if arm symptoms present.'},
                      {wrong:'Ringing in ears',                         right:'Tinnitus (DC 6260)',                                                                      tip:'Flat 10% always. Easiest claim available. File NOW.'},
                      {wrong:'Knee problems',                           right:'Limitation of Flexion of the Knee (DC 5260) plus Knee Instability (DC 5257)',             tip:'File both limitation AND instability -- rated separately.'},
                      {wrong:'Shoulder injury',                         right:'Limitation of Motion of the Arm (DC 5201) or Scapulohumeral Articulation (DC 5200)',      tip:'Dominant arm rates higher. File bilateral.'},
                      {wrong:'Nightmares and anxiety from deployment',  right:'Post-Traumatic Stress Disorder PTSD (DC 9411)',                                           tip:'No combat required since 2010. Any in-service stressor qualifies.'},
                      {wrong:'Trouble sleeping or snoring',             right:'Obstructive Sleep Apnea (DC 6847)',                                                       tip:'Get a sleep study. CPAP prescribed = automatic 50%. File secondary to PTSD.'},
                      {wrong:'Acid reflux or heartburn',                right:'Gastroesophageal Reflux Disease GERD (DC 7346)',                                          tip:'Secondary to stress and PTSD. Very common and very winnable.'},
                      {wrong:'Numbness in arms or legs',                right:'Radiculopathy Upper Extremity (DC 8510) or Lower Extremity (DC 8520)',                    tip:'Secondary to spine conditions. Rate each limb separately.'},
                    ].map((t,i)=>(
                      <div key={i} className="bg-steel/20 border border-steel/50 rounded-xl p-4">
                        <div className="flex flex-col md:flex-row gap-3">
                          <div className="flex-1">
                            <div className="text-xs text-scarlet font-bold mb-1">Do NOT say:</div>
                            <div className="text-sm text-sand/60 italic">"{t.wrong}"</div>
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-gold font-bold mb-1">Say this instead:</div>
                            <div className="text-sm text-sand font-medium">"{t.right}"</div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-sand/50 bg-steel/30 border border-steel/50 rounded-lg p-2">Tip: {t.tip}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB 5: PACT ACT */}
              {claimsSubTab === 'pact' && (
                <div className="space-y-4">
                  <div className="bg-gold/5 border border-gold/20 rounded-xl p-4">
                    <h3 className="font-black text-lg mb-1">The PACT Act (2022)</h3>
                    <p className="text-sand/60 text-sm">Largest VA benefit expansion in decades. Deployed post-8/2/1990 to qualifying locations? Listed conditions are PRESUMED service-connected. No nexus letter needed.</p>
                  </div>
                  {[
                    {title:'Who Qualifies', body:'Served on or after 8/2/1990 in: Iraq, Afghanistan, Kuwait, Bahrain, Qatar, Saudi Arabia, Somalia, Oman, UAE, Djibouti, Egypt, Jordan, Lebanon, Syria, Uzbekistan, Yemen, or aboard vessels in the Persian Gulf.'},
                    {title:'Respiratory Presumptives', body:'Constrictive bronchiolitis, pulmonary fibrosis, sarcoidosis, interstitial lung disease (ILD), pleuritis, asthma (post-service), COPD, emphysema, chronic bronchitis, chronic sinusitis, chronic rhinitis.'},
                    {title:'Cancer Presumptives', body:'Head, neck, respiratory, reproductive, urinary, hematologic, lymphatic cancers, lymphomas, melanoma, pancreatic, gastrointestinal cancers. File IMMEDIATELY for any cancer diagnosis.'},
                  ].map((item,i)=>(
                    <div key={i} className="bg-steel/20 border border-steel/50 rounded-xl p-4">
                      <h4 className="font-bold text-gold text-sm mb-2">{item.title}</h4>
                      <p className="text-sm text-sand/70">{item.body}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* SUB-TAB 6: TDIU */}
              {claimsSubTab === 'tdiu' && (
                <div className="space-y-4">
                  <div className="bg-steel/20 border border-steel/50 rounded-xl p-4">
                    <h3 className="font-black text-lg mb-1">Total Disability Individual Unemployability (TDIU)</h3>
                    <p className="text-sand/60 text-sm">Get paid at the 100% rate ($3,737+/mo) even if your combined rating is only 60-70%. If service-connected disabilities prevent substantially gainful employment, you qualify.</p>
                  </div>
                  {[
                    {title:'Eligibility', body:'Schedular: Single disability at 60%+ OR two+ disabilities with one at 40%+ and combined at 70%+. Extra-Schedular: Any combination reviewed on a case-by-case basis if disabilities prevent employment.'},
                    {title:'How to File', body:'File VA Form 21-8940 (TDIU application) plus VA Form 21-4192 (employer certification). Include medical evidence showing inability to maintain substantially gainful employment.'},
                    {title:'TDIU Earnings Limit', body:'You CAN work with TDIU but NOT at substantially gainful employment. Current poverty threshold: approximately $14,580/year.'},
                  ].map((item,i)=>(
                    <div key={i} className="bg-steel/20 border border-steel/50 rounded-xl p-4">
                      <h4 className="font-bold text-gold text-sm mb-2">{item.title}</h4>
                      <p className="text-sm text-sand/70">{item.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: MEDICAL FILE SCANNER                                  */}
          {/* ============================================================ */}
          {activeTab === 'scanner' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Medical File Scanner</h2>
                <p className="text-sand/50 text-sm">Paste medical records, C&P notes, or separation physical text. The scanner identifies potential VA claims and gives you a personalized action plan.</p>
              </div>
              <div className="bg-steel/20 border border-steel/50 rounded-xl p-3 text-xs text-sand/60">
                100% Private: Runs entirely in your browser. No text is uploaded or stored anywhere. Your medical data stays on your device.
              </div>
              <div className="bg-steel/20 border-2 border-dashed border-steel/50 hover:border-gold/30 rounded-xl p-6 text-center transition-all cursor-pointer" onClick={()=>fileInputRef.current?.click()}>
                <Upload className="mx-auto mb-2 text-sand/30" size={28}/>
                <div className="text-sand/70 font-bold text-sm">Upload Medical Records (.txt)</div>
                <div className="text-sand/40 text-xs mt-1">Works with VA Blue Button exports saved as .txt</div>
                <input ref={fileInputRef} type="file" accept=".txt,.text" className="hidden" onChange={handleFileUpload}/>
              </div>
              <div className="text-center text-sand/30 text-xs font-mono">or paste your text below</div>
              <textarea className="w-full h-36 bg-steel-dark border border-steel/60 rounded-xl p-4 text-sm text-sand/80 resize-y focus:outline-none focus:border-gold/40 transition-colors"
                placeholder="Paste your medical records, separation physical notes, or C&P exam results here..."
                value={scanText} onChange={e=>setScanText(e.target.value)}/>
              <button onClick={runMedScan} disabled={!scanText.trim()||scanLoading}
                className="w-full py-3 bg-scarlet hover:bg-red-800 disabled:bg-steel/40 disabled:text-sand/30 text-sand font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2">
                {scanLoading ? <><Activity size={16} className="animate-pulse"/> Scanning Records...</> : <><Search size={16}/> Scan for VA Claims</>}
              </button>
              {!scanResults && (
                <div className="bg-steel/20 border border-steel/50 rounded-xl p-4">
                  <p className="text-xs text-sand/50 mb-2 font-mono uppercase tracking-wider">Try it with a sample:</p>
                  <button onClick={()=>setScanText("Patient presents with chronic lower back pain and lumbar strain. Reports tinnitus bilaterally since deployment. Sleep study confirmed obstructive sleep apnea, CPAP prescribed. PTSD diagnosis confirmed following deployment to Iraq and Afghanistan. Also reports acid reflux consistent with GERD. Cervical disc herniation at C4-C5 confirmed on MRI. Reports numbness and tingling in right arm. Headaches 2-3 times per week. Exposed to burn pits during deployment to Iraq and Kuwait.")}
                    className="text-xs text-gold hover:text-yellow-400 underline transition-colors">
                    Load sample medical record text
                  </button>
                </div>
              )}
              {scanResults && !scanLoading && (
                <div className="space-y-3">
                  <div className="bg-steel/20 border border-steel/50 rounded-xl p-4">
                    <div className="font-black text-lg text-sand">{scanResults.found.length} Potential Claim{scanResults.found.length!==1?'s':''} Detected</div>
                    <div className="text-sand/50 text-xs mt-1">Review each finding below. Bring this to your VSO appointment.</div>
                  </div>
                  {scanResults.pactFlag && (
                    <div className="bg-gold/5 border border-gold/20 rounded-xl p-4">
                      <div className="text-gold font-bold text-sm mb-1">PACT Act Deployment Detected</div>
                      <div className="text-sand/60 text-xs">Your records suggest qualifying deployment. PACT Act presumptive claims may apply -- no nexus letter required. File VA Form 21-526EZ immediately.</div>
                    </div>
                  )}
                  {scanResults.found.map((item,i)=>(
                    <div key={i} className="bg-steel/20 border border-steel/50 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <div className="font-black text-sand">{item.condition}</div>
                          <div className="text-xs text-sand/40 font-mono">Keyword: "{item.matchedKeyword}"</div>
                        </div>
                        <span className="bg-steel-dark border border-steel/60 text-gold text-xs px-2 py-0.5 rounded font-mono whitespace-nowrap">DC {item.dc}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                        <div className="bg-steel-dark/60 rounded-lg p-2"><div className="text-sand/40 mb-0.5">Typical Rating</div><div className="font-bold text-scarlet">{item.ratingRange}</div></div>
                        <div className="bg-steel-dark/60 rounded-lg p-2"><div className="text-sand/40 mb-0.5">Secondary Claims</div><div className="font-bold text-gold">{item.secondary.length>0?item.secondary.length+' possible':'None'}</div></div>
                      </div>
                      <div className="text-xs text-sand/60 bg-steel/30 border border-steel/50 rounded-lg p-2 mb-2">Tip: {item.note}</div>
                      {item.secondary.length>0&&(
                        <div className="flex flex-wrap gap-1">
                          {item.secondary.map((s,j)=><span key={j} className="text-xs bg-steel-dark border border-steel/50 px-2 py-0.5 rounded-full text-sand/60">{s}</span>)}
                        </div>
                      )}
                    </div>
                  ))}
                  <button onClick={()=>{setScanResults(null);setScanText('');}} className="text-xs text-sand/40 hover:text-sand/70 transition-colors flex items-center gap-1 font-mono uppercase tracking-wider">
                    <X size={12}/> Clear and start over
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 5: UNEXPLORED AVENUES                                    */}
          {/* ============================================================ */}
          {activeTab === 'avenues' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Unexplored Avenues</h2>
                <p className="text-sand/50 text-sm">Possibilities most veterans never knew existed. Click to explore each one.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(avenues).map(([key,a])=>(
                  <button key={key} onClick={()=>setActiveAvenue(key)}
                    className={"px-4 py-2 rounded-full text-xs font-bold border transition-all uppercase tracking-wider font-mono " + (activeAvenue===key ? "bg-scarlet border-scarlet text-sand" : "border-steel/60 text-sand/50 hover:border-steel hover:text-sand")}>
                    {a.label}
                  </button>
                ))}
              </div>
              {(() => {
                const av = avenues[activeAvenue];
                return (
                  <div className="bg-steel/20 border border-steel/50 rounded-2xl p-6 backdrop-blur-md">
                    <div className="border-b border-steel/40 pb-4 mb-5">
                      <h3 className="text-xl font-black uppercase tracking-tight">{av.label}</h3>
                      <p className="text-gold text-sm mt-1">{av.tagline}</p>
                    </div>
                    <ul className="space-y-2.5 mb-5">
                      {av.bullets.map((b,i)=>(
                        <li key={i} className="flex items-start gap-2 text-sm text-sand/80">
                          <CheckCircle size={13} className="text-gold flex-shrink-0 mt-0.5"/>
                          {b}
                        </li>
                      ))}
                    </ul>
                    <a href={av.ctaUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-scarlet hover:bg-red-800 text-sand px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all">
                      {av.ctaText} <ExternalLink size={11}/>
                    </a>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 6: STATE MATRIX                                          */}
          {/* ============================================================ */}
          {activeTab === 'benefits' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight mb-1">State Benefits Matrix</h2>
                <p className="text-sand/50 text-sm">State-specific veteran perks that stack with federal compensation.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stateBenefits).map(([key,s])=>(
                  <button key={key} onClick={()=>setSelectedState(key)}
                    className={"px-3 py-1.5 rounded-full text-xs font-bold border transition-all font-mono uppercase " + (selectedState===key ? "bg-scarlet border-scarlet text-sand" : "border-steel/60 text-sand/50 hover:border-steel hover:text-sand")}>
                    {s.name}
                  </button>
                ))}
              </div>
              <div className="bg-steel/20 border border-steel/50 rounded-2xl p-5">
                <h3 className="font-black uppercase tracking-tight text-xl mb-4">{stateInfo.name} Veteran Benefits</h3>
                <div className="space-y-2">
                  {stateInfo.highlights.map((h,i)=>(
                    <div key={i} className="flex items-start gap-2 text-sm text-sand/80">
                      <CheckCircle size={13} className="text-gold flex-shrink-0 mt-0.5"/>
                      {h}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-steel/20 border border-steel/50 rounded-xl p-4 text-sm text-sand/60">
                Pro Tip: Combining {stateInfo.name} residency with 100% P&T status can add $10,000-$25,000+ per year in effective income compared to a high-tax state with no veteran exemptions.
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 7: MILESTONE TRACKER                                     */}
          {/* ============================================================ */}
          {activeTab === 'tracker' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-steel/40 pb-4">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Interactive Milestone Tracker</h2>
                  <p className="text-sand/50 text-sm">Track and check off your transition steps from uniform to financial freedom.</p>
                </div>
                <div className="bg-steel-dark border border-steel/50 rounded-xl px-4 py-2 text-xs font-mono">
                  <span className="text-sand/50">Progress: </span>
                  <span className="text-gold font-black">
                    {Object.values(completedMilestones).filter(Boolean).length} / {MILESTONES_DATA.length} Completed
                  </span>
                </div>
              </div>

              <div className="bg-steel/20 border border-steel/50 rounded-2xl p-6 space-y-3">
                {MILESTONES_DATA.map(m=>(
                  <button key={m.id}
                    onClick={()=>setCompletedMilestones(prev=>({...prev, [m.id]: !prev[m.id]}))}
                    className={"w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3 " + (completedMilestones[m.id] ? "bg-steel-dark/80 border-gold/40 text-sand" : "bg-steel-dark/30 border-steel/40 text-sand/60 hover:border-steel")}>
                    <div className={"w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 " + (completedMilestones[m.id] ? "bg-gold border-gold text-steel-dark" : "border-steel/60")}>
                      {completedMilestones[m.id] && <CheckSquare size={13}/>}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-gold px-2 py-0.5 rounded bg-gold/5 border border-gold/20 inline-block mb-1">
                        {m.stage}
                      </span>
                      <div className={"text-sm " + (completedMilestones[m.id] ? "line-through opacity-60" : "font-medium")}>
                        {m.label}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 8: DISCHARGE UPGRADE GUIDE                               */}
          {/* ============================================================ */}
          {activeTab === 'upgrade' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Discharge Upgrade Guide</h2>
                <p className="text-sand/50 text-sm">A non-honorable discharge is not the end. Many veterans successfully upgrade and unlock full benefits.</p>
              </div>
              {dischargeType === 'honorable' && (
                <div className="bg-steel/20 border border-steel/50 rounded-xl p-4 text-sm text-sand/60">
                  You indicated an Honorable Discharge. This guide is still useful for helping fellow veterans or if any characterization issue arises.
                </div>
              )}
              {[
                {title:'Step 1 -- Know Your Board', items:[
                  'Discharge Review Board (DRB): discharged less than 15 years ago. Can upgrade OTH and General discharges.',
                  'Board for Correction of Military Records (BCMR / BCNR for Navy and USMC): any branch, any time. Reviews characterization.',
                  'DoD 2023 guidance: many OTH discharges related to PTSD, MST, or mental health may qualify for automatic upgrade review.',
                ]},
                {title:'Step 2 -- Gather Evidence', items:[
                  'DD-214: your most critical document. Request via milConnect.com or eVetRecs.',
                  'Service Records (SMR): request complete SMR through the National Archives (NPRC).',
                  'Medical records: especially mental health records from service.',
                  'Buddy Statements (VA Form 21-4142): written accounts from fellow service members.',
                  'Personal Statement: your account of the circumstances. Be specific and factual.',
                  'Mental Health Evaluation: if PTSD, MST, or TBI contributed to discharge, include a psychiatric evaluation.',
                  'Key argument: Liberal Consideration memos (Kurta, Hagel, Carson) require boards to give special weight to PTSD and MST-related discharges.',
                ]},
                {title:'Step 3 -- Write Your Application', items:[
                  'For DRB: use DD Form 293. Focus on clemency, procedural error, or inequity (disproportionate punishment).',
                  'For BCMR/BCNR: use DD Form 149. Focus on error or injustice in the record.',
                  'Include mental health nexus to misconduct (PTSD, MST, TBI).',
                  'Argue that your service as a whole outweighs the separation reason.',
                  'Hire a VSO or attorney -- NVLSP and ABA Military Pro Bono offer FREE legal representation.',
                ]},
                {title:'Step 4 -- Submit and Follow Up', items:[
                  'DRB decisions: typically 12-18 months. BCMR/BCNR: 12-24 months.',
                  'Request a personal appearance hearing for DRB -- highly recommended.',
                  'If denied: appeal to the Court of Appeals for Veterans Claims (CAVC) with a VA-accredited attorney.',
                ]},
              ].map((section,i)=>(
                <div key={i} className="bg-steel/20 border border-steel/50 rounded-xl p-4">
                  <h4 className="font-black text-gold uppercase tracking-tight mb-3">{section.title}</h4>
                  <ul className="space-y-2">
                    {section.items.map((item,j)=>(
                      <li key={j} className="flex items-start gap-2 text-sm text-sand/70">
                        <CheckCircle size={13} className="text-gold flex-shrink-0 mt-0.5"/>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 9: RESOURCES & HOTLINE DIRECTORY                         */}
          {/* ============================================================ */}
          {activeTab === 'resources' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Resources and Key Contacts</h2>
                <p className="text-sand/50 text-sm">Every hotline, free service, and critical link -- in one place.</p>
              </div>

              <div className="bg-steel/20 border-2 border-scarlet/40 rounded-2xl p-5">
                <h3 className="text-scarlet font-black text-xl mb-2 uppercase tracking-tight">Veterans Crisis Line</h3>
                <div className="text-4xl font-black text-sand mb-1">988, then Press 1</div>
                <div className="text-scarlet font-bold mb-1">Text: 838255</div>
                <div className="text-scarlet font-bold mb-3">Chat: VeteransCrisisLine.net</div>
                <p className="text-sand/60 text-sm">Available 24/7/365. No VA enrollment needed. You do not need to be in crisis to call. You earned the right to ask for help.</p>
              </div>

              <div>
                <h3 className="font-black uppercase tracking-tight mb-3 text-sm font-mono text-gold">Free Claims Help (VSOs)</h3>
                <div className="space-y-2">
                  {[
                    {name:'Disabled American Veterans (DAV)', url:'https://www.dav.org', desc:'Free VSO help, claims assistance, transportation to VA', phone:'877-426-2838'},
                    {name:'Veterans of Foreign Wars (VFW)', url:'https://www.vfw.org', desc:'Free claims assistance, VSO representatives nationwide', phone:'816-756-3390'},
                    {name:'American Legion', url:'https://www.legion.org', desc:'Free claims assistance, local chapters nationwide', phone:'800-433-3318'},
                    {name:'VA Accredited VSO Locator', url:'https://www.va.gov/ogc/apps/accreditation/index.asp', desc:'Official VA tool to find a VSO in your area'},
                    {name:'NVLSP (Free Legal)', url:'https://www.nvlsp.org', desc:'Free legal representation for denied claims and appeals'},
                  ].map((r,i)=>(
                    <div key={i} className="bg-steel/20 border border-steel/50 rounded-xl p-4">
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-bold text-sand hover:text-gold transition-colors text-sm">
                        {r.name} <ExternalLink size={10} className="inline"/>
                      </a>
                      <div className="text-xs text-sand/40 mt-0.5">{r.desc}</div>
                      {r.phone && <div className="text-xs text-gold mt-1 font-mono">{r.phone}</div>}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-black uppercase tracking-tight mb-3 text-sm font-mono text-gold">Mental Health Resources</h3>
                <div className="space-y-2">
                  {[
                    {name:'Vet Center', url:'https://www.vetcenter.va.gov', desc:'Free confidential PTSD and MST counseling. Walk-in friendly. No appointment needed.', phone:'877-927-8387'},
                    {name:'Headstrong Project', url:'https://www.goheadstrong.org', desc:'FREE mental health treatment for post-9/11 veterans. No copays. No limits. No red tape.'},
                    {name:'Mission 22', url:'https://www.mission22.com', desc:'Veteran PTSD and suicide prevention programs'},
                    ...(mstFlag ? [{name:'VA MST Support', url:'https://www.mentalhealth.va.gov/mstemplate/', desc:'Confidential MST support. No police report required. Every VA facility has an MST Coordinator.', phone:'800-827-1000'}] : []),
                  ].map((r,i)=>(
                    <div key={i} className="bg-steel/20 border border-steel/50 rounded-xl p-4">
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-bold text-sand hover:text-gold transition-colors text-sm">
                        {r.name} <ExternalLink size={10} className="inline"/>
                      </a>
                      <div className="text-xs text-sand/40 mt-0.5">{r.desc}</div>
                      {r.phone && <div className="text-xs text-gold mt-1 font-mono">{r.phone}</div>}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-black uppercase tracking-tight mb-3 text-sm font-mono text-gold">Key VA Forms</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {form:'VA 21-526EZ', desc:'Disability Claim Application',    url:'https://www.va.gov/find-forms/about-form-21-526ez/'},
                    {form:'VA 20-0995',  desc:'Supplemental Claim',              url:'https://www.va.gov/find-forms/about-form-20-0995/'},
                    {form:'VA 21-8940',  desc:'TDIU Application',                url:'https://www.va.gov/find-forms/about-form-21-8940/'},
                    {form:'VA 22-1990',  desc:'GI Bill Application',             url:'https://www.va.gov/find-forms/about-form-22-1990/'},
                    {form:'VA 28-1900',  desc:'VR&E Application',                url:'https://www.va.gov/find-forms/about-form-28-1900/'},
                    {form:'VA 10-10EZ',  desc:'VA Healthcare Enrollment',        url:'https://www.va.gov/find-forms/about-form-10-10ez/'},
                  ].map((f,i)=>(
                    <a key={i} href={f.url} target="_blank" rel="noopener noreferrer"
                      className="bg-steel/20 border border-steel/50 hover:border-gold/30 rounded-xl p-3 transition-all group">
                      <div className="font-black text-gold text-sm group-hover:text-yellow-400 transition-colors">{f.form}</div>
                      <div className="text-xs text-sand/40">{f.desc}</div>
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-black uppercase tracking-tight mb-3 text-sm font-mono text-gold">Official VA Portals</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {name:'VA.gov',               url:'https://www.va.gov',                                    desc:'Main portal -- file claims, check status'},
                    {name:'My HealtheVet',         url:'https://www.myhealth.va.gov',                           desc:'VA health records, Blue Button download'},
                    {name:'milConnect',            url:'https://milconnect.dmdc.osd.mil',                       desc:'Military records and ID card management'},
                    {name:'USAJOBS',               url:'https://www.usajobs.gov',                               desc:'Federal employment with veteran preference'},
                    {name:'GI Bill Comparison',    url:'https://www.va.gov/education/gi-bill-comparison-tool/', desc:'Compare schools and GI Bill benefits'},
                    {name:'ClearanceJobs',         url:'https://www.clearancejobs.com/',                        desc:'Jobs for cleared veterans (premium salary)'},
                  ].map((p,i)=>(
                    <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
                      className="bg-steel/20 border border-steel/50 hover:border-gold/30 rounded-xl p-3 transition-all group">
                      <div className="font-bold text-sand text-xs group-hover:text-gold transition-colors">{p.name} <ExternalLink size={9} className="inline"/></div>
                      <div className="text-xs text-sand/40">{p.desc}</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <footer className="bg-steel-dark/90 border-t border-steel/50 px-6 py-2 flex items-center justify-between">
        <div className="text-sand/30 text-xs">For informational purposes only. Not legal or medical advice.</div>
        <div className="text-sand/10 text-xs hover:text-sand/30 transition-colors cursor-default select-none" title="Crayon-powered">
          {String.fromCodePoint(0x1F58D)} made with crayons
        </div>
      </footer>
    </div>
  );
};

export default VeteranBenefitsCompass;
