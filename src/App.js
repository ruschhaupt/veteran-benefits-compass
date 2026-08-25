import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Compass, ChevronRight, ChevronLeft, BarChart3, DollarSign,
  CheckCircle, Award, ArrowRight,
  Plus, Trash2, Search, Upload, FileText,
  Phone, TrendingUp, Target, Cpu,
  ExternalLink, X, Activity, Flag, Info,
  Home, CheckSquare, Save, User, Mail, ShieldAlert,
  Sparkles, Quote
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
// 4. LIFE PLANNER GOALS
// -----------------------------------------------------------------------
const PLANNER_GOALS = [
  { id: 'freedom',   icon: '⚡', label: 'Financial Freedom (FIRE)', desc: 'Live comfortably on tax-free benefits & passive cash flow' },
  { id: 'travel',    icon: '✈', label: 'Travel / Expat Living',     desc: 'Live or travel abroad with full VA compensation & FMP healthcare' },
  { id: 'home',      icon: '🏠', label: 'Real Estate & House Hacking', desc: '$0 down multi-family real estate with VA loan' },
  { id: 'family',    icon: '👨👩👧', label: 'Family Security',           desc: 'CHAMPVA healthcare, Chapter 35 DEA tuition, survivor legacy' },
  { id: 'business',  icon: '💼', label: 'Veteran Business & SDVOSB', desc: 'SBA programs & $25B+ federal set-aside contracts' },
  { id: 'education', icon: '🎓', label: 'Degree & Certifications',  desc: 'VR&E Ch. 31 + Post-9/11 GI Bill stacking & Yellow Ribbon' },
  { id: 'career',    icon: '🎯', label: 'High-Paying Civilian Career', desc: 'SkillBridge, clearance premium, 10-point federal hiring preference' },
  { id: 'debt',      icon: '📉', label: 'Eliminate Debt',            desc: 'Destroy high interest debt using veteran housing and benefit shields' },
  { id: 'wealth',    icon: '📈', label: 'Generational Wealth',       desc: 'Automated Roth IRA index investing & real estate compounding' },
];

// -----------------------------------------------------------------------
// 5. SPECIAL MONTHLY COMPENSATION (SMC) & SPECIAL PERKS DATA
// -----------------------------------------------------------------------
const SMC_DATA = [
  {
    level: 'SMC-K',
    rate2026: '$139.87 / mo (Per Condition Add-on)',
    title: 'Loss of a Creative Organ or Specific Anatomical Loss',
    desc: 'Paid IN ADDITION to your regular disability check. Very common for Erectile Dysfunction (ED) secondary to PTSD, medications, or lumbar spine injury, or for loss of breast tissue/reproductive organs. Multiple SMC-K awards can be stacked.',
    criteria: 'Loss of use of creative organ, one hand, one foot, severe blindness, or permanent vocal impairment.'
  },
  {
    level: 'SMC-S',
    rate2026: '$4,408.53 / mo (Replaces standard 100% rate)',
    title: 'Statutory Housebound / 100% + 60% Rule',
    desc: 'Awarded when a veteran has ONE single service-connected condition rated at 100% PLUS another completely separate service-connected condition (or combined group) rated at 60% or more. Adds an extra ~$470/mo tax-free on top of standard 100% pay.',
    criteria: 'Single 100% condition + separate 60% condition, OR substantially permanently confined to home.'
  },
  {
    level: 'SMC-L',
    rate2026: '$4,846.52 / mo',
    title: 'Aid & Attendance / Severe Loss of Function',
    desc: 'For veterans requiring regular aid and attendance of another person for daily activities (dressing, bathing, eating, managing medication) or severe bilateral extremity loss.',
    criteria: 'Need for regular personal care or severe anatomical impairment.'
  },
  {
    level: 'SMC-R.1 / R.2',
    rate2026: 'Up to $10,879.46 / mo',
    title: 'High-Level Daily Skilled Care',
    desc: 'Maximum compensation tier for veterans who require daily authorized skilled health care assistance in their home.',
    criteria: 'Highest level of ongoing medical and physical assistance.'
  }
];

const SPECIAL_PERKS = [
  {
    id: 'space_a',
    annualValue: 2500,
    isCash: false,
    upfrontValue: 0,
    category: 'travel',
    title: 'Space-A (Space Available) Free Military Flights',
    value: '$0 Airfare Worldwide',
    badge: '100% P&T Exclusive (Category VI)',
    summary: 'Veterans with a 100% P&T rating fly for FREE on Department of Defense military cargo and transport aircraft (C-17 Globemaster, C-130 Hercules, KC-135 Stratotanker, and Patriot Express commercial charters) across CONUS and US Territories.',
    eligibility: [
      'Must have a 100% Permanent and Total (P&T) VA disability rating.',
      'Must possess the Next Generation Uniformed Services Identification Card (USID) marked "100% Disabled Veteran" (DD Form 2765).',
      'Eligible for flights within the Continental US (CONUS) and direct flights between CONUS and Alaska, Hawaii, Puerto Rico, Guam, US Virgin Islands, and American Samoa.',
      'Spouses and eligible dependents can accompany the 100% P&T veteran on flights to/from US territories.'
    ],
    stepByStep: [
      { step: '1. Obtain NextGen USID Card', detail: 'Schedule an appointment at any military DEERS/RAPIDS ID card office (via idco.dmdc.osd.mil/idco). Bring two forms of ID, your DD-214, and your VA Commissary/Exchange Letter (Summary of Benefits Letter stating 100% P&T).' },
      { step: '2. Remote Sign-Up at AMC Terminals', detail: 'Sign up remotely via email or in person at Air Mobility Command (AMC) passenger terminals up to 60 days before your intended travel date. Keep the email timestamp confirmation (your position on the standby list is based on your sign-up date/time).' },
      { step: '3. Monitor 72-Hour Flight Schedules', detail: 'Check the official Facebook pages or web portals of departure terminals (e.g. Travis AFB, Dover AFB, Joint Base Lewis-McChord, MacDill AFB, Hickam AFB) for 72-hour flight projections.' },
      { step: '4. Attend Roll Call & Board', detail: 'Mark yourself "Present" at the terminal passenger counter 2-3 hours before the scheduled flight Roll Call. When your name is called in Category VI, present your USID card and check in up to two 70-lb bags for free.' }
    ],
    requiredDocs: [
      'Next Generation USID Military Card (DD Form 2765)',
      'Valid Government Photo ID / Passport (for territory flights)',
      'Proof of Space-A Sign-Up Email Timestamp Confirmation'
    ],
    proTip: 'Sign up at multiple AMC passenger terminals 60 days in advance even if you are not sure of your exact travel day. Your 60-day active window establishes seniority on the standby list over veterans who sign up last-minute.',
    officialLink: 'https://www.amc.af.mil/AMC-Travel-Site/',
    formNumber: 'AMC Remote Email Registration / USID Card'
  },
  {
    id: 'sah_grant',
    annualValue: 0,
    isCash: false,
    upfrontValue: 117014,
    category: 'housing',
    title: 'Specially Adapted Housing (SAH) & SHA Grants',
    value: 'Up to $117,014 Tax-Free Grant',
    badge: 'Severe Mobility Impairment',
    summary: 'Lifetime tax-free grants to build, buy, or remodel a permanent home to accommodate service-connected physical disabilities (wheelchair ramps, roll-in showers, widened hallways, therapy rooms).',
    eligibility: [
      'SAH Grant (Up to $117,014): Loss or loss of use of both lower extremities; blindness in both eyes plus loss of use of one leg; loss of use of one lower extremity due to service-connected disease; or severe full-body burn injuries.',
      'Special Home Adaptation (SHA) Grant (Up to $23,444): Severe blindness in both eyes (visual acuity 20/200 or less); loss of use of both hands; severe respiratory or burn injuries.',
      'Temporary Residence Adaptation (TRA) Grant (Up to $47,130): Available if you are temporarily living in a family member\'s home that needs adaptations.',
      'Grants can be used up to 3 separate times until the maximum lifetime dollar cap is reached.'
    ],
    stepByStep: [
      { step: '1. Submit VA Form 26-4555', detail: 'Apply online through VA.gov or submit VA Form 26-4555 ("Application in Acquiring Specially Adapted Housing or Special Home Adaptation Grant") to your VA Regional Loan Center.' },
      { step: '2. Feasibility & Field Agent Interview', detail: 'A VA Specially Adapted Housing agent will schedule an on-site interview and property inspection to determine the structural feasibility of your remodeling or construction project.' },
      { step: '3. Select a Licensed Contractor', detail: 'Choose a licensed general contractor with experience in ADA/VA adaptations. The contractor submits architectural plans and line-item cost estimates directly to the VA SAH office.' },
      { step: '4. VA Approval & Direct Escrow Disbursement', detail: 'Once the VA approves the architectural plans, grant funds are placed into an escrow account and disbursed directly to the contractor as construction milestones are verified.' }
    ],
    requiredDocs: [
      'VA Form 26-4555 (Application for SAH/SHA)',
      'VA Disability Rating Decision Letter documenting qualifying physical impairment',
      'Contractor Licensed Estimate & Architectural Remodel Blueprint'
    ],
    proTip: 'Veterans who qualify for an SAH grant are also automatically eligible for Veterans Mortgage Life Insurance (VMLI), which provides up to $200,000 in mortgage payoff protection in the event of death with zero medical underwriting exams.',
    officialLink: 'https://www.va.gov/housing-assistance/disability-housing-grants/',
    formNumber: 'VA Form 26-4555'
  },
  {
    id: 'auto_grant',
    annualValue: 0,
    isCash: false,
    upfrontValue: 25600,
    category: 'auto',
    title: 'Automobile Allowance & Adaptive Equipment (AAE)',
    value: '$25,600 One-Time Grant + Equipment',
    badge: 'Service-Connected Mobility Impairment',
    summary: 'A tax-free one-time cash allowance of up to $25,600 paid directly to an auto dealer toward the purchase of a new or used vehicle, plus lifetime free adaptive driving equipment (hand controls, wheelchair lifts, specialized steering).',
    eligibility: [
      'Loss or permanent loss of use of one or both feet.',
      'Loss or permanent loss of use of one or both hands.',
      'Permanent severe impairment of vision in both eyes (20/200 visual acuity or 20-degree visual field).',
      'Severe burn injuries that limit motion of one or more extremities.',
      'Ankylosis (joint stiffness/immobility) of one or both knees or hips resulting from service.'
    ],
    stepByStep: [
      { step: '1. File VA Form 21-4502', detail: 'Complete Section I of VA Form 21-4502 ("Application for Automobile and Adaptive Equipment") and submit it to your local VA Regional Office.' },
      { step: '2. Receive VA Eligibility Certification', detail: 'The VA certifies Section II of the form and mails it back to you, officially confirming your entitlement to the $25,600 grant amount.' },
      { step: '3. Select Vehicle at Any Dealership', detail: 'Take certified VA Form 21-4502 to any licensed automobile dealership. Choose your vehicle. The dealer completes Section III and submits it directly to the VA for payment disbursement.' },
      { step: '4. Install Adaptive Equipment via VA Form 10-1394', detail: 'For wheelchair lifts, hand controls, raised roofs, or power seats, submit VA Form 10-1394 through your VA Prosthetics representative for 100% free installation and ongoing repairs.' }
    ],
    requiredDocs: [
      'VA Form 21-4502 (Automobile Allowance Application)',
      'VA Disability Rating Decision Letter showing qualifying loss of use',
      'Dealer Bill of Sale / Invoice with Section III completed'
    ],
    proTip: 'Even if you have already used your one-time $25,600 automobile purchase allowance, you are entitled to UNLIMITED lifetime free adaptive equipment installations, maintenance, and vehicle modifications across any future cars you buy.',
    officialLink: 'https://www.va.gov/resources/how-to-get-adaptive-equipment-for-your-vehicle/',
    formNumber: 'VA Form 21-4502 & VA Form 10-1394'
  },
  {
    id: 'parks_pass',
    annualValue: 80,
    isCash: false,
    upfrontValue: 0,
    category: 'travel',
    title: 'America the Beautiful Lifetime Military Pass',
    value: '$80/yr Free for Life (2,000+ Parks)',
    badge: 'All Veterans & Gold Star Families',
    summary: 'A free lifetime pass granting 100% free entrance for the veteran and all passengers in their vehicle to over 2,000 federal recreation sites, National Parks (Yellowstone, Yosemite, Zion, Grand Canyon), BLM public lands, and National Wildlife Refuges.',
    eligibility: [
      'All military veterans with a discharge under other than dishonorable conditions.',
      'All active duty, National Guard, and Reserve service members.',
      'Gold Star Family members with an approved voucher.'
    ],
    stepByStep: [
      { step: '1. Option A -- Obtain In Person (Instant & Free)', detail: 'Drive up to any federal recreation entrance station or park visitor center that charges entrance fees. Present one form of proof of veteran status to receive your physical plastic Lifetime Pass on the spot for $0.' },
      { step: '2. Option B -- Order Online ($10 Shipping Fee)', detail: 'Order through the official USGS Store website (store.usgs.gov/military-pass). Upload a copy of your DD-214 or Veteran ID card and pay the standard $10 shipping and processing fee.' },
      { step: '3. Display Pass for Free Vehicle Entry', detail: 'Display the pass on your vehicle rearview mirror or present it at the park entrance gate. The pass covers the veteran plus all passengers in a single non-commercial vehicle (or up to 4 adults at per-person fee sites).' }
    ],
    requiredDocs: [
      'Any ONE of the following:',
      '- State-issued Driver\'s License with Veteran Designation',
      '- Veteran Health Identification Card (VHIC)',
      '- DoD Identification Card (NextGen USID / Retired / Active)',
      '- DD-214 or Certificate of Release from Active Duty'
    ],
    proTip: 'The Lifetime Military Pass covers day-use entrance fees, standard amenity fees, and commercial day-use parking at National Parks, National Forests, and Army Corps of Engineers lakes. It also provides up to 50% discounts on select federal campsites and boat launches.',
    officialLink: 'https://www.nps.gov/planyourvisit/veterans-and-gold-star-families-free-access.htm',
    formNumber: 'USGS Lifetime Military Pass'
  },
  {
    id: 'dental_classes',
    annualValue: 3500,
    isCash: false,
    upfrontValue: 0,
    category: 'health',
    title: '100% Free VA Comprehensive Dental Care Matrix',
    value: '$3,000 - $10,000+/yr Value',
    badge: 'Class I - VI Eligibility Pathways',
    summary: 'VA Dental Care is not limited to 100% P&T veterans. Five distinct legal pathways unlock full comprehensive dental care (cleanings, crowns, dental implants, root canals, dentures, and oral surgery) at zero out-of-pocket cost.',
    eligibility: [
      'Class IV (Most Common): 100% P&T or TDIU veterans qualify for full comprehensive lifetime dental care.',
      'Class I: Veterans with a service-connected dental condition or trauma rated at 10%+ receive free dental care for that condition.',
      'Class II: Recently separated veterans within 180 days of discharge who did NOT receive a complete dental exam on active duty qualify for a one-time full dental restoration.',
      'Class IIc: All former Prisoners of War (POWs) receive 100% free comprehensive dental care.',
      'Class V: Veterans actively enrolled in the VR&E (Chapter 31) program receive all dental care necessary to achieve their employment and educational goal.',
      'Class VI: Inpatient veterans scheduled for major surgery/transplants who require dental clearance.'
    ],
    stepByStep: [
      { step: '1. Verify Your Class Eligibility Pathway', detail: 'Check whether you qualify under 100% P&T (Class IV), 10%+ dental rating (Class I), recent separation within 180 days (Class II), or active VR&E enrollment (Class V).' },
      { step: '2. Contact Your Local VAMC Dental Clinic', detail: 'Call the dental clinic at your nearest VA Medical Center or submit a dental care request via My HealtheVet secure messaging.' },
      { step: '3. Comprehensive Dental Intake & Imaging', detail: 'Complete a full panoramic X-ray and clinical periodontal exam. The VA dentist establishes your multi-year treatment plan (cleanings, crowns, implants, fillings).' },
      { step: '4. VA Community Care Dental Referral (If Backlogged)', detail: 'Under the VA MISSION Act, if the VA dental clinic cannot schedule your appointment within 28 days or within a 60-minute drive, request a referral to a civilian private dentist at 100% VA expense.' }
    ],
    requiredDocs: [
      'VA Summary of Benefits Letter (Confirming rating or VR&E status)',
      'VA Healthcare Enrollment (VA Form 10-10EZ on file)',
      'DD-214 (If applying within 180 days for Class II exit coverage)'
    ],
    proTip: 'If you are rated 10% to 90%, applying for VR&E (Chapter 31) instantly puts you into Class V Dental Eligibility, unlocking thousands in free dental treatment while you train for your next career.',
    officialLink: 'https://www.va.gov/health-care/about-va-health-benefits/dental-care/',
    formNumber: 'VAMC Dental Registration / MISSION Act Referral'
  },
  {
    id: 'commissary_exchange',
    annualValue: 4200,
    isCash: false,
    upfrontValue: 0,
    category: 'shopping',
    title: 'Tax-Free Military Commissary, Exchange & MWR Privileges',
    value: '$3,500 - $6,000/yr in Grocery & Sales Tax Savings',
    badge: 'Any Service-Connected Rating (0% - 100%)',
    summary: 'Under the Disabled Veterans Equal Access Act, all veterans with a service-connected disability rating (from 0% to 100%), Purple Heart recipients, Medal of Honor recipients, and former POWs have full on-base shopping privileges at military commissaries, exchanges (AAFES, NEX, MCX, CGX), and MWR recreational facilities.',
    eligibility: [
      'Any veteran with a VA service-connected disability rating of 0%, 10%, 20%, 30%, 40%, 50%, 60%, 70%, 80%, 90%, or 100%.',
      'Purple Heart recipients and Medal of Honor recipients.',
      'Former Prisoners of War (POWs).',
      'Caregivers enrolled in the VA Program of Comprehensive Assistance for Family Caregivers (PCAFC).'
    ],
    stepByStep: [
      { step: '1. Obtain Veteran Health ID Card (VHIC)', detail: 'Enroll in VA Healthcare at VA.gov (Form 10-10EZ) and visit your local VAMC enrollment office to have your photo taken for your VHIC card. Ensure your card displays "Service Connected", "Purple Heart", or "Former POW" under your photo.' },
      { step: '2. Register at Military Base Visitor Center', detail: 'On your first visit to any military installation, stop at the Visitor Center at the front gate. Present your VHIC and Real ID driver\'s license for a quick background check and gate pass registration.' },
      { step: '3. Shop 100% Tax-Free at Commissary & Exchanges', detail: 'Enjoy 100% tax-free groceries at the commissary (saving an average of 25% vs civilian supermarkets) and tax-free electronics, clothing, and appliances at the Exchange.' },
      { step: '4. Access Military MWR Recreation & Lodging', detail: 'Book military resort lodging (Inns of the Corps, Navy Gateway Inns, Army Lodging), rent outdoor camping gear, boats, and RVs at MWR recreation centers, and access military golf courses at active duty rates.' }
    ],
    requiredDocs: [
      'Veteran Health Identification Card (VHIC) with "Service Connected" inscription',
      'Real ID Driver\'s License or Passport for base access security scan'
    ],
    proTip: 'You can also shop online 100% tax-free with free shipping at ShopMyExchange.com, NavyExchange.com, and MyMCX.com by simply registering your veteran status on their portals.',
    officialLink: 'https://www.militaryonesource.mil/benefits/commissary-and-exchange-privileges-for-veterans/',
    formNumber: 'VHIC Service Connected Card'
  }
];

// -----------------------------------------------------------------------
// 6. PERSONALIZED DYNAMIC ACTION STEPS REPOSITORY
// -----------------------------------------------------------------------
const ALL_DYNAMIC_STEPS = [
  // --- 100% P&T Specific High-Value Actions (Show ONLY when rated 100%) ---
  {
    id: 'tax_exemption_100',
    annualValue: 10000,
    isCash: false,
    upfrontValue: 0,
    goals: ['universal', 'freedom', 'home', 'wealth'],
    priority: 1,
    category: 'State Tax Shield',
    title: 'Claim Your 100% P&T State Property Tax Exemption ($0 Taxes)',
    timeline: 'Immediate post-rating action',
    action: 'Take your VA rating summary letter to your county tax assessor. In Texas, Florida, Nevada, Washington, Ohio and many states, 100% P&T veterans pay ZERO in real estate property taxes on their primary residence.',
    why: 'On a $450,000 home, this immediately saves $8,000 to $14,000 every single year for life. Over 20 years, that is $160,000-$280,000 in tax-free saved capital.',
    value: '$8,000 - $14,000/yr savings',
    link: 'https://www.benefits.va.gov/homeloans/',
    form: 'File with County Tax Assessor',
    showWhen: (p) => p.currentRating >= 100,
  },
  {
    id: 'champva_family_100',
    annualValue: 12000,
    isCash: false,
    upfrontValue: 0,
    goals: ['universal', 'family', 'freedom'],
    priority: 1,
    category: 'Family Healthcare',
    title: 'Enroll Spouse & Children in CHAMPVA (100% Free Health Insurance)',
    timeline: 'Immediate post-100% rating action',
    action: 'Submit VA Form 10-10d. CHAMPVA covers spouses and dependent children of 100% P&T veterans with near-zero copays and a $3,000 maximum family annual cap.',
    why: 'Replaces civilian health insurance plans that cost $600-$1,500/month. Eliminates private insurance premiums for your entire household.',
    value: '$7,200 - $18,000/yr saved',
    link: 'https://www.va.gov/health-care/family-caregiver-benefits/champva/',
    form: 'VA Form 10-10d',
    showWhen: (p) => p.currentRating >= 100 && p.hasDependents !== 'single',
  },
  {
    id: 'chapter35_dea_100',
    annualValue: 18888,
    isCash: true,
    upfrontValue: 0,
    goals: ['family', 'wealth', 'education'],
    priority: 2,
    category: 'Dependent Tuition',
    title: 'Activate Chapter 35 DEA College Stipend for Dependents',
    timeline: 'When spouse or children attend college/trade school',
    action: 'Apply with VA Form 22-5490. Pays $1,574/month CASH directly to your spouse and each child enrolled in college, vocational training, or apprenticeships for up to 45 months per student.',
    why: 'A spouse and two college students will receive $4,722/month ($56,664/year) in tax-free cash for attending school, preserving your family savings.',
    value: '$1,574/mo per student cash',
    link: 'https://www.va.gov/education/survivor-dependent-benefits/dependents-education-assistance/',
    form: 'VA Form 22-5490',
    showWhen: (p) => p.currentRating >= 100 && p.hasDependents !== 'single',
  },
  {
    id: 'dental_priority_1_100',
    annualValue: 3500,
    isCash: false,
    upfrontValue: 0,
    goals: ['universal', 'freedom'],
    priority: 2,
    category: 'Healthcare',
    title: 'Unlock Comprehensive VA Dental Care (Priority Group 1)',
    timeline: 'Immediate post-100% rating action',
    action: 'Call your local VA Medical Center dental clinic. 100% P&T status automatically unlocks full comprehensive dental coverage: cleanings, crowns, implants, root canals, and surgery at $0 cost.',
    why: 'Civilian dental work regularly costs $3,000-$10,000+ for major procedures. VA Priority 1 eliminates all dental expenses for life.',
    value: '$2,000 - $5,000/yr value',
    link: 'https://www.va.gov/health-care/about-va-health-benefits/dental-care/',
    form: 'Call Local VAMC Dental Clinic',
    showWhen: (p) => p.currentRating >= 100,
  },

  // --- Actions for unrated or partially rated veterans (<100%) ---
  {
    id: 'initial_disability_claim',
    annualValue: 44844,
    isCash: true,
    upfrontValue: 0,
    goals: ['universal', 'freedom'],
    priority: 1,
    category: 'Claims Strategy',
    title: 'File Initial VA Disability Claim or Submit Intent to File',
    timeline: 'Immediately (Locks your effective back-pay date)',
    action: 'Submit an Intent to File online at VA.gov immediately to lock your back-pay effective date. Then file VA Form 21-526EZ with all supporting Service Treatment Records and diagnosis letters.',
    why: 'Every month delayed is a month of tax-free back-pay permanently lost. An established rating provides monthly cash, free VA healthcare, and loan waivers.',
    value: 'Up to $44,844/yr tax-free',
    link: 'https://www.va.gov/disability/file-disability-claim/',
    form: 'VA Form 21-526EZ',
    showWhen: (p) => p.currentRating === 0,
  },
  {
    id: 'rating_increase_secondaries',
    annualValue: 23736,
    isCash: true,
    upfrontValue: 0,
    goals: ['universal', 'freedom'],
    priority: 1,
    category: 'Claims Increase',
    title: 'File for Rating Increases & Secondary Stacking (Path to 100%)',
    timeline: 'Within 90 days of rating decision',
    action: 'Use the Med Scanner and Secondary Stacking Matrix to file secondaries (e.g. Sleep Apnea secondary to PTSD; Radiculopathy secondary to Lumbar Strain). Request medical increase exams for worsening conditions.',
    why: 'A veteran at 70% ($1,759/mo) who stacks secondary conditions to reach 100% jumps to $3,737+/month -- an extra $23,736/year tax-free for life.',
    value: '+$1,000 to +$2,000/mo increase',
    link: 'https://www.va.gov/disability/file-disability-claim/',
    form: 'VA Form 21-526EZ',
    showWhen: (p) => p.currentRating > 0 && p.currentRating < 100,
  },
  {
    id: 'tdiu_70_plus',
    annualValue: 44844,
    isCash: true,
    upfrontValue: 0,
    goals: ['freedom'],
    priority: 2,
    category: 'Income Bridge',
    title: 'Apply for TDIU: Get 100% Pay ($3,737/mo) at Your Current Rating',
    timeline: 'If service-connected conditions prevent gainful work',
    action: 'Submit VA Form 21-8940. Because you are rated 70%+, you meet the schedular threshold to be paid at the full 100% rate ($3,737+/mo) if your conditions prevent sustained employment.',
    why: 'Instantly elevates your monthly pay to the maximum rate without needing to fight for individual 100% schedular ratings.',
    value: '$3,737+/mo (100% rate)',
    link: 'https://www.va.gov/disability/eligibility/special-claims/unemployability/',
    form: 'VA Form 21-8940',
    showWhen: (p) => p.currentRating >= 70 && p.currentRating < 100,
  },

  // --- Active Duty vs Already Separated Logic ---
  {
    id: 'bdd_speedrun_active',
    goals: ['universal', 'career'],
    priority: 1,
    category: 'Transition Speedrun',
    title: 'File BDD (Benefits Delivery at Discharge) Claim (180-90 Day Window)',
    timeline: 'Between 180 and 90 days before separation date',
    action: 'Submit your claim via VA.gov BDD program. Complete all C&P exams while still in uniform. Your rating and monthly cash start on Day 1 of civilian life.',
    why: 'Avoids the 6-12 month standard post-separation claim backlog. All conditions documented while in uniform carry direct presumption of service connection.',
    value: 'Zero income gap on separation',
    link: 'https://www.va.gov/disability/how-to-file-claim/when-to-file/pre-discharge-claim/',
    form: 'VA Form 21-526EZ (BDD)',
    showWhen: (p) => !p.alreadyOut && p.separationMonths >= 3,
  },
  {
    id: 'skillbridge_active',
    goals: ['career', 'freedom'],
    priority: 1,
    category: 'Career Velocity',
    title: 'Secure a DoD SkillBridge Corporate Internship (Last 180 Days)',
    timeline: '6-9 months before separation date',
    action: 'Apply to SkillBridge opportunities at defense contractors, tech firms (Amazon, Microsoft), or financial institutions. Work as a civilian intern while receiving 100% full active military pay & BAH.',
    why: 'Over 85% of SkillBridge participants receive high-paying full-time job offers before their separation date, guaranteeing zero transition downtime.',
    value: 'Full military pay + civilian salary offer',
    link: 'https://skillbridge.osd.mil/',
    form: 'Command Approval Package',
    showWhen: (p) => !p.alreadyOut,
  },
  {
    id: 'post_sep_smr_request',
    goals: ['universal'],
    priority: 1,
    category: 'Records Recovery',
    title: 'Request Complete Service Treatment Records (STR) from NPRC',
    timeline: 'Immediate post-separation step',
    action: 'Submit an online request via eVetRecs / National Archives (NPRC) or milConnect for your complete military medical, dental, and personnel jacket (OOM/OMPF).',
    why: 'Having complete official records is mandatory for winning claims increases, secondary connections, and PACT Act presumptive awards.',
    value: 'Foundation for all future claims',
    link: 'https://www.archives.gov/veterans/military-service-records',
    form: 'Standard Form 180 / eVetRecs',
    showWhen: (p) => p.alreadyOut && p.currentRating < 100,
  },

  // --- Discharge Upgrade (Elevated when non-honorable) ---
  {
    id: 'discharge_upgrade_priority',
    goals: ['universal', 'career', 'education'],
    priority: 1,
    category: 'Service Characterization',
    title: 'Initiate Discharge Upgrade under PTSD/MST Liberal Consideration',
    timeline: 'Immediate priority action',
    action: 'File DD Form 293 (DRB for <15 years) or DD Form 149 (BCMR). Leverage DoD Liberal Consideration memos (Kurta, Hagel, Carson) linking mental health or service trauma to discharge characterization.',
    why: 'An upgraded Honorable discharge unlocks the Post-9/11 GI Bill, state veterans hiring preference, and full VA healthcare coverage.',
    value: 'Restores full GI Bill & VA benefit rights',
    link: 'https://www.va.gov/discharge-upgrade-instructions/',
    form: 'DD Form 293 or DD Form 149',
    showWhen: (p) => p.dischargeType !== 'honorable',
  },

  // --- Universal High-ROI Wealth & Housing Actions ---
  {
    id: 'va_loan_house_hack',
    annualValue: 4200,
    isCash: false,
    upfrontValue: 15000,
    goals: ['home', 'wealth', 'freedom'],
    priority: 2,
    category: 'Real Estate',
    title: 'Execute the $0-Down VA Loan Multi-Family House Hack (2-4 Units)',
    timeline: 'When purchasing primary residence',
    action: 'Use your VA Loan to purchase a duplex, triplex, or fourplex. Live in unit 1; rent units 2, 3, and 4. Tenant rents cover your entire mortgage + generate monthly cash flow.',
    why: 'Zero down payment, zero PMI, and if rated 10%+, the $15,000+ VA Funding Fee is 100% WAIVED.',
    value: '$0 housing cost + equity growth',
    link: 'https://www.va.gov/housing-assistance/home-loans/',
    form: 'VA Form 26-1880 (COE)',
    showWhen: null,
  },
  {
    id: 'vre_ch31_education',
    annualValue: 32000,
    isCash: true,
    upfrontValue: 0,
    goals: ['education', 'business', 'career'],
    priority: 2,
    category: 'Education Stacking',
    title: 'Apply for VR&E (Chapter 31) BEFORE Touching Your GI Bill',
    timeline: 'When planning education, trade school, or entrepreneurship',
    action: 'If you have a 10%+ rating, apply for VR&E on VA.gov. It pays 100% tuition, all books/laptops, and a monthly housing subsistence stipend for up to 48 months WITHOUT consuming your Post-9/11 GI Bill.',
    why: 'Using VR&E first preserves your 36 months of Post-9/11 GI Bill for a second master\'s degree, flight school, or transfer to your dependents.',
    value: 'Up to 48 months full tuition + stipend',
    link: 'https://www.va.gov/careers-employment/vocational-rehabilitation/',
    form: 'VA Form 28-1900',
    showWhen: (p) => p.currentRating >= 10,
  },
  {
    id: 'sdvosb_business_setasides',
    annualValue: 25000,
    isCash: true,
    upfrontValue: 0,
    goals: ['business', 'wealth'],
    priority: 2,
    category: 'Federal Contracting',
    title: 'Register as a Service-Disabled Veteran-Owned Small Business (SDVOSB)',
    timeline: 'When launching or scaling a business',
    action: 'Certify your entity on SAM.gov via the SBA VetCert portal. Unlocks sole-source federal contracts up to $5,000,000 with zero public bidding competition.',
    why: 'Federal agencies are legally mandated to award 5%+ of all federal procurement (billions annually) to SDVOSB entities.',
    value: 'Access to $25B+ in set-aside contracts',
    link: 'https://www.sba.gov/federal-contracting/contracting-assistance-programs/service-disabled-veteran-owned-small-business-program',
    form: 'SBA VetCert (MySBA)',
    showWhen: (p) => p.currentRating >= 10,
  },
  {
    id: 'fmp_worldwide_care',
    annualValue: 4500,
    isCash: false,
    upfrontValue: 0,
    goals: ['travel', 'freedom'],
    priority: 2,
    category: 'Expat Freedom',
    title: 'Enroll in the Foreign Medical Program (FMP) for Worldwide Coverage',
    timeline: 'Before traveling or moving overseas',
    action: 'Submit VA Form 10-7959f-2. The VA covers 100% of all medical visits, prescription drugs, and surgeries for your service-connected conditions in 150+ countries.',
    why: 'Enables complete sovereign geographic freedom. Live in Portugal, Costa Rica, Thailand, or Mexico while retaining full US medical backing.',
    value: '100% global healthcare coverage',
    link: 'https://www.va.gov/health-care/foreign-medical-program/',
    form: 'VA Form 10-7959f-2',
    showWhen: (p) => p.currentRating >= 10,
  },
  {
    id: 'pact_act_presumptive_fasttrack',
    goals: ['universal'],
    priority: 1,
    category: 'Toxic Exposure',
    title: 'Submit PACT Act Presumptive Claim (No Nexus Letter Required)',
    timeline: 'Immediate claim submission',
    action: 'File VA Form 21-526EZ for respiratory conditions, sinusitis, rhinitis, or cancers. Because you served post-9/11 in qualifying locations, service connection is legally presumed.',
    why: 'Zero burden of proof for causation. If you have a diagnosed condition on the PACT list, VA must approve service connection.',
    value: 'Fast-track claim approval',
    link: 'https://www.va.gov/resources/the-pact-act-and-your-va-benefits/',
    form: 'VA Form 21-526EZ',
    showWhen: (p) => (p.exposedBurnPit || p.servedPost911) && p.currentRating < 100,
  }
];

// -----------------------------------------------------------------------
// 7. MASTER CHECKLIST MILESTONES
// -----------------------------------------------------------------------
const ALL_MILESTONES = [
  { id:'str_download', stage:'Pre-Separation', label:'Request and download full digital copies of your Service Treatment Records (STR) and dental files', hideWhen: (p)=>p.alreadyOut },
  { id:'sick_call_log', stage:'Pre-Separation', label:'Go to medical/sick call to document every physical and mental symptom before terminal leave', hideWhen: (p)=>p.alreadyOut },
  { id:'cool_cert', stage:'Pre-Separation', label:'Complete free civilian certifications (PMP, Sec+, AWS) via DoD COOL / Branch Credentialing', hideWhen: (p)=>p.alreadyOut },
  { id:'bdd_filed', stage:'BDD Window', label:'File Benefits Delivery at Discharge (BDD) claim at the exact 180-90 day pre-separation mark', hideWhen: (p)=>p.alreadyOut || p.currentRating >= 100 },
  { id:'skillbridge_app', stage:'BDD Window', label:'Secure a DoD SkillBridge / CSP civilian corporate internship for your final 6 months', hideWhen: (p)=>p.alreadyOut },
  { id:'va_account_set', stage:'Transition', label:'Set up Login.gov / ID.me authentication on VA.gov and verify claim tracker status' },
  { id:'va_healthcare', stage:'Transition', label:'Enroll in VA Healthcare at your local VA Medical Center (Form 10-10EZ)' },
  { id:'buddy_letters', stage:'Transition', label:'Collect Lay / Buddy statements (VA Form 21-4138) from fellow service members for claims', hideWhen: (p)=>p.currentRating >= 100 },
  { id:'va_loan_coe', stage:'Post-Separation', label:'Download your VA Loan Certificate of Eligibility (COE) on eBenefits / VA.gov' },
  { id:'roth_ira_opened', stage:'Post-Separation', label:'Open a Roth IRA and automate $583/mo ($7,000/yr) indexing into VOO/VTI' },
  { id:'state_tax_exempt', stage:'Post-Separation', label:'Submit your VA rating letter to your county tax assessor for full property tax exemption', hideWhen: (p)=>p.currentRating < 100 },
  { id:'champva_enrolled', stage:'Post-Separation', label:'Submit VA Form 10-10d to enroll spouse and children in CHAMPVA healthcare', hideWhen: (p)=>p.currentRating < 100 || p.hasDependents === 'single' },
];

// -----------------------------------------------------------------------
// MAIN COMPONENT: VeteranBenefitsCompass
// -----------------------------------------------------------------------

// -----------------------------------------------------------------------
// VA HOUSE HACKER: STATE GRADE MATRIX (MODULE SCOPE)
// -----------------------------------------------------------------------
const STATE_GRADES = [
  {
    state: 'Texas', abbr: 'TX', grade: 'A+',
    gradeColor: 'text-emerald-400', badgeColor: 'bg-emerald-900/50 border-emerald-500/50',
    propertyTaxExemption: '100% P&T = $0 property taxes statewide, no cap',
    avgRent2br: 1350, avgRent3br: 1650, avgRent4br: 1950,
    medianHomePrice: 310000,
    stateTaxClimate: 'No state income tax',
    landlordFriendly: true,
    secretTip: 'Texas does not charge 100% P&T disabled veterans ANY state property taxes on their primary residence. On a $300k home this saves $7,000-$10,000/yr alone. Combined with no state income tax and strong military base BAH markets (San Antonio, Killeen, El Paso, Fort Worth), Texas is the ultimate VA house hacking state.',
    militaryBases: ['Fort Cavazos (Killeen)', 'JBSA San Antonio', 'Fort Bliss (El Paso)', 'NAS Corpus Christi'],
    topRentalMarkets: ['San Antonio', 'Austin', 'Fort Worth', 'El Paso'],
    highlights: ['$0 state income tax', '$0 property tax (100% P&T)', 'Landlord-friendly eviction laws', 'Strong BAH: San Antonio E-5 w/deps = $2,196/mo']
  },
  {
    state: 'Florida', abbr: 'FL', grade: 'A+',
    gradeColor: 'text-emerald-400', badgeColor: 'bg-emerald-900/50 border-emerald-500/50',
    propertyTaxExemption: '100% P&T = full homestead exemption ($50k+)',
    avgRent2br: 1600, avgRent3br: 1950, avgRent4br: 2300,
    medianHomePrice: 375000,
    stateTaxClimate: 'No state income tax',
    landlordFriendly: true,
    secretTip: 'Florida offers 100% P&T veterans a complete homestead property tax exemption plus the $500 additional veteran exemption. No state income tax means your VA compensation stays 100% in your pocket. Jacksonville, Pensacola, and Tampa are massive military markets with exceptional rental demand from active duty service members.',
    militaryBases: ['NAS Jacksonville', 'NAS Pensacola', 'MacDill AFB (Tampa)', 'Patrick SFB (Melbourne)'],
    topRentalMarkets: ['Jacksonville', 'Tampa', 'Pensacola', 'Orlando'],
    highlights: ['$0 state income tax', 'Full P&T property tax exemption', 'Year-round rental demand', 'Strong military BAH markets']
  },
  {
    state: 'North Carolina', abbr: 'NC', grade: 'A+',
    gradeColor: 'text-emerald-400', badgeColor: 'bg-emerald-900/50 border-emerald-500/50',
    propertyTaxExemption: 'First $45k of assessed value exempt for 100% P&T',
    avgRent2br: 1250, avgRent3br: 1500, avgRent4br: 1750,
    medianHomePrice: 290000,
    stateTaxClimate: 'Low flat 4.5% state income tax (VA comp still exempt)',
    landlordFriendly: true,
    secretTip: 'Fort Liberty (formerly Bragg) is the largest US military installation generating massive rental demand. NC waives all in-state tuition for 100% P&T veterans at all UNC-system schools - stack this with Post-9/11 GI Bill for a monthly housing stipend on top.',
    militaryBases: ['Fort Liberty (Fayetteville)', 'Camp Lejeune (Jacksonville)', 'Cherry Point MCAS', 'Seymour Johnson AFB'],
    topRentalMarkets: ['Fayetteville', 'Jacksonville', 'Raleigh', 'Charlotte'],
    highlights: ['VA comp is state-tax-exempt', '$0 tuition at UNC schools for 100% P&T', 'High military rental demand', 'Rapidly appreciating markets']
  },
  {
    state: 'Georgia', abbr: 'GA', grade: 'A+',
    gradeColor: 'text-emerald-400', badgeColor: 'bg-emerald-900/50 border-emerald-500/50',
    propertyTaxExemption: 'Full homestead exemption for 100% P&T',
    avgRent2br: 1300, avgRent3br: 1600, avgRent4br: 1900,
    medianHomePrice: 295000,
    stateTaxClimate: 'VA comp exempt from state income tax',
    landlordFriendly: true,
    secretTip: 'Fort Moore (formerly Benning), Fort Stewart, and Robins AFB generate enormous off-post rental demand year-round. Georgia exempts veteran disability compensation from state income tax and offers 100% P&T veterans a full homestead property tax exemption.',
    militaryBases: ['Fort Moore (Columbus)', 'Fort Stewart (Savannah)', 'Robins AFB (Warner Robins)', 'Moody AFB (Valdosta)'],
    topRentalMarkets: ['Columbus', 'Warner Robins', 'Hinesville', 'Augusta'],
    highlights: ['VA comp state-tax-exempt', 'Full property tax exemption (100% P&T)', 'Very low home prices relative to rents', 'Year-round military rental demand']
  },
  {
    state: 'Tennessee', abbr: 'TN', grade: 'A',
    gradeColor: 'text-blue-400', badgeColor: 'bg-blue-900/50 border-blue-500/50',
    propertyTaxExemption: 'Property tax freeze for qualifying disabled veterans',
    avgRent2br: 1300, avgRent3br: 1550, avgRent4br: 1800,
    medianHomePrice: 305000,
    stateTaxClimate: 'No state income tax on wages; VA comp fully exempt',
    landlordFriendly: true,
    secretTip: 'Tennessee eliminated its income tax on wages entirely in 2021. Nashville and Memphis are growing rapidly with strong rental demand. Fort Campbell on the KY border is a major Army installation with a large military community.',
    militaryBases: ['Fort Campbell', 'Arnold AFB (Tullahoma)'],
    topRentalMarkets: ['Nashville', 'Memphis', 'Clarksville', 'Murfreesboro'],
    highlights: ['No state income tax', 'Rapid appreciation in Nashville corridor', 'Low cost of living outside major metros', 'Strong landlord-friendly laws']
  },
  {
    state: 'South Carolina', abbr: 'SC', grade: 'A',
    gradeColor: 'text-blue-400', badgeColor: 'bg-blue-900/50 border-blue-500/50',
    propertyTaxExemption: '100% exemption on primary residence for 100% P&T',
    avgRent2br: 1200, avgRent3br: 1450, avgRent4br: 1700,
    medianHomePrice: 265000,
    stateTaxClimate: 'VA disability pay fully exempt from state income tax',
    landlordFriendly: true,
    secretTip: 'South Carolina offers one of the most generous veteran benefit packages in the nation. 100% P&T veterans pay zero property taxes and receive a full exemption on their VA compensation from state income tax. The Columbia and Charleston markets have strong military presence ensuring consistent rental demand.',
    militaryBases: ['Fort Jackson (Columbia)', 'Shaw AFB (Sumter)', 'JB Charleston', 'MCAS Beaufort'],
    topRentalMarkets: ['Columbia', 'Charleston', 'Sumter', 'Florence'],
    highlights: ['$0 property tax (100% P&T)', 'VA comp state-tax-exempt', 'Affordable home prices', 'High military renter demand']
  },
  {
    state: 'Arizona', abbr: 'AZ', grade: 'A',
    gradeColor: 'text-blue-400', badgeColor: 'bg-blue-900/50 border-blue-500/50',
    propertyTaxExemption: 'Property tax exemption for 100% P&T on primary residence',
    avgRent2br: 1500, avgRent3br: 1800, avgRent4br: 2100,
    medianHomePrice: 360000,
    stateTaxClimate: 'Flat 2.5% income tax (lowest in US); VA comp exempt',
    landlordFriendly: true,
    secretTip: 'Arizona is an emerging powerhouse for house hackers. Luke AFB, Davis-Monthan, and Fort Huachuca create sustained military rental markets. The Phoenix metro has grown 15%+ in population since 2020. Flat 2.5% income tax (the lowest flat rate in the US) and full VA comp exemption make this an elite state for financial freedom.',
    militaryBases: ['Luke AFB (Glendale)', 'Davis-Monthan AFB (Tucson)', 'Fort Huachuca (Sierra Vista)', 'MCAS Yuma'],
    topRentalMarkets: ['Phoenix Metro', 'Tucson', 'Sierra Vista', 'Glendale'],
    highlights: ['2.5% flat tax (lowest in US)', 'VA comp state-tax-exempt', 'Rapidly growing rental market', 'Multi-family opportunities near Luke AFB']
  },
  {
    state: 'Nevada', abbr: 'NV', grade: 'A',
    gradeColor: 'text-blue-400', badgeColor: 'bg-blue-900/50 border-blue-500/50',
    propertyTaxExemption: '$3,000 assessed value exemption per year for 100% P&T',
    avgRent2br: 1600, avgRent3br: 1900, avgRent4br: 2200,
    medianHomePrice: 400000,
    stateTaxClimate: 'No state income tax',
    landlordFriendly: true,
    secretTip: 'Nevada has no state income tax and one of the most landlord-friendly legal frameworks in the country. The Las Vegas / Henderson metro is a top destination for retiring military members. Nellis AFB and Creech AFB create strong off-post demand. Nevada allows very rapid eviction proceedings - critical for protecting rental income.',
    militaryBases: ['Nellis AFB (Las Vegas)', 'Creech AFB (Indian Springs)', 'Naval Air Station Fallon'],
    topRentalMarkets: ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas'],
    highlights: ['No state income tax', 'Landlord-friendly eviction laws', 'Rapidly growing metro', 'Strong retiree rental demand']
  },
  {
    state: 'Ohio', abbr: 'OH', grade: 'A',
    gradeColor: 'text-blue-400', badgeColor: 'bg-blue-900/50 border-blue-500/50',
    propertyTaxExemption: '100% P&T = homestead property tax credit',
    avgRent2br: 1050, avgRent3br: 1250, avgRent4br: 1500,
    medianHomePrice: 220000,
    stateTaxClimate: 'VA comp exempt from state income tax',
    landlordFriendly: true,
    secretTip: 'Ohio is one of the most underrated house hacking states in the country. Extremely low home prices relative to rents means exceptional rent-to-price ratios. A $200k 4-plex in Dayton or Columbus can generate $4,000-$5,000/mo in gross rents. Wright-Patterson AFB ensures steady military renter demand.',
    militaryBases: ['Wright-Patterson AFB (Dayton)', 'DFAS Columbus', 'Camp Perry'],
    topRentalMarkets: ['Dayton', 'Columbus', 'Cleveland', 'Cincinnati'],
    highlights: ['Exceptional rent-to-price ratios', 'Very affordable 2-4 unit properties', 'Military renter demand in Dayton', 'VA comp state-tax-exempt']
  },
  {
    state: 'Virginia', abbr: 'VA', grade: 'B',
    gradeColor: 'text-yellow-400', badgeColor: 'bg-yellow-900/50 border-yellow-500/50',
    propertyTaxExemption: '100% P&T = $0 property taxes on primary residence',
    avgRent2br: 1800, avgRent3br: 2200, avgRent4br: 2600,
    medianHomePrice: 415000,
    stateTaxClimate: '5.75% state income tax; VA comp partially exempt',
    landlordFriendly: false,
    secretTip: 'Virginia is one of the densest military states in the nation (Norfolk, Pentagon, Quantico, Fort Gregg-Adams). BAH rates near major installations are among the highest in the country, making rental premiums extraordinary. The northern VA / DC corridor commands massive rents.',
    militaryBases: ['Norfolk NAS', 'Fort Gregg-Adams (Petersburg)', 'Quantico USMC', 'Pentagon'],
    topRentalMarkets: ['Norfolk/VA Beach', 'Hampton Roads', 'Northern Virginia', 'Richmond'],
    highlights: ['$0 property tax (100% P&T)', 'Highest BAH rates in SE region', 'Enormous federal/defense renter pool', 'Strong long-term appreciation']
  },
  {
    state: 'Colorado', abbr: 'CO', grade: 'B',
    gradeColor: 'text-yellow-400', badgeColor: 'bg-yellow-900/50 border-yellow-500/50',
    propertyTaxExemption: '50% exemption on first $200k for 100% P&T',
    avgRent2br: 1800, avgRent3br: 2100, avgRent4br: 2500,
    medianHomePrice: 490000,
    stateTaxClimate: 'VA comp exempt from CO state income tax',
    landlordFriendly: false,
    secretTip: 'Colorado Springs is one of the most military-dense cities in the nation (NORAD, Peterson, Schriever, Fort Carson, Air Force Academy) creating permanent rental demand. The state exempts all VA disability compensation from state income taxes. High home prices make it harder - stick to Colorado Springs and Pueblo for best cash flow.',
    militaryBases: ['Fort Carson', 'Peterson SFB', 'Schriever SFB', 'Air Force Academy'],
    topRentalMarkets: ['Colorado Springs', 'Pueblo', 'Aurora', 'Fort Collins'],
    highlights: ['VA comp state-tax-exempt', 'Massive military community in COS', 'High appreciation potential', 'Property tax exemption for 100% P&T']
  },
  {
    state: 'California', abbr: 'CA', grade: 'C',
    gradeColor: 'text-red-400', badgeColor: 'bg-red-900/50 border-red-500/50',
    propertyTaxExemption: '$4,000 assessed value exemption per year (low)',
    avgRent2br: 2600, avgRent3br: 3200, avgRent4br: 3900,
    medianHomePrice: 750000,
    stateTaxClimate: 'Up to 13.3% state income tax (highest in US); VA comp state-exempt',
    landlordFriendly: false,
    secretTip: 'THE CALIFORNIA SECRET: Your VA disability compensation is completely exempt from California state income tax. The REAL play: establish Texas or Florida as your domicile state (TX/FL license, register vehicle there, vote there) but keep your California VA Healthcare enrollment and CalVet home loan benefits. Many 100% P&T vets use this dual-state strategy to get TX/FL $0 property taxes while living near CA bases.',
    militaryBases: ['Camp Pendleton', 'Miramar MCAS', 'NAS North Island', 'Edwards AFB', 'Travis AFB'],
    topRentalMarkets: ['San Diego (near Pendleton)', 'Oceanside', 'Victorville', 'Barstow'],
    highlights: ['VA comp is CA-state-tax-exempt', 'CalVet Home Loans available', 'High long-term appreciation', 'High COL - tenant laws favor renters']
  }
];

// -----------------------------------------------------------------------
// AVENUES DATA: COMPREHENSIVE PLAYBOOKS (MODULE SCOPE)
// -----------------------------------------------------------------------
const AVENUES_DATA = [
  {
    id: 'education',
    icon: '🎓',
    title: 'The Education Route',
    tagline: 'Turn your service into a fully-funded degree, monthly income, and a career that pays 6 figures.',
    totalMonthlyEstimate: '4200 - 7800',
    eligibleFor: ['any'],
    overview: 'Going to school as a veteran is not about getting a degree. It is about maximizing a tax-free monthly income, eliminating student loans entirely, and building credentials while the government pays you to learn.',
    sections: [
      {
        heading: 'The GI Bill Stack: What Most People Miss',
        content: [
          { label: 'Post-9/11 GI Bill (Chapter 33)', detail: 'Pays 100% of in-state tuition at public schools, up to $28,937/yr at private schools, $1,000/yr book stipend, and a monthly Housing Allowance (MHA) equal to BAH for an E-5 with dependents at the school ZIP code. ONLINE-ONLY students receive 50% MHA nationally, so attend IN PERSON at a school in a HIGH-BAH city for maximum housing cash.' },
          { label: 'Yellow Ribbon Schools', detail: 'At Yellow Ribbon partner schools (Harvard, Georgetown, NYU, USC, Pepperdine, Vanderbilt, WGU), the VA pays 50% of tuition above the public-school cap AND the school matches the other 50% - meaning your private school tuition is entirely covered at zero cost.' },
          { label: 'Chapter 31 VR&E (Vocational Rehab)', detail: 'If you have a 10%+ rating and an employment handicap, VR&E pays for school AND pays you a monthly subsistence allowance (independent of GI Bill). VR&E also pays for certifications, tools, licensing, and career counseling.' },
          { label: 'Pell Grant Stacking', detail: 'The Post-9/11 GI Bill housing stipend does NOT count as income for FAFSA purposes. If your household income qualifies, you can receive a Pell Grant (up to $7,395/yr) on top of your GI Bill - free additional money that most veterans never apply for.' },
          { label: 'Chapter 35 DEA (Dependent Transfer)', detail: 'If you are 100% P&T and transfer your GI Bill to a dependent, your spouse or child receives 36 months of education benefits. Meanwhile, you can enroll in VR&E Ch. 31 for additional education funding - two family members in school simultaneously doubles the household education income.' }
        ]
      },
      {
        heading: 'Highest-Value Schools for Veterans (Ranked by Total Package)',
        content: [
          { label: 'Western Governors University (WGU) - Online, All States', detail: 'WGU is accredited, entirely online, flat-rate tuition (~$3,500/term), and partners with Yellow Ribbon. Complete a BSN, BSIT, Cybersecurity, or Business degree in 18-24 months due to competency-based acceleration. Best for veterans who want to complete fast and start earning.' },
          { label: 'University of Florida (UF) - Gainesville, FL', detail: 'UF is rated #1 public university in FL and top 5 nationally. In-state tuition is $6,380/yr fully covered by GI Bill. Gainesville BAH E-5 with dependents = $1,686/mo housing stipend. Florida has no state income tax. UF has the largest veterans resource center of any SEC school.' },
          { label: 'Texas A&M / UT Austin - Texas', detail: 'Both schools have the Hazlewood Act - Texas veterans get free tuition at ANY Texas public school for themselves and one dependent child. Combined with GI Bill, the book stipend and BAH housing allowance are pure income. San Antonio and Austin BAH = $1,800-$2,400/mo.' },
          { label: 'George Mason University - Fairfax, VA', detail: 'Located 20 minutes from the Pentagon in one of the highest BAH zones in the nation. E-5 with dependents BAH in Fairfax = $3,006/mo housing stipend. GMU has outstanding cybersecurity, IT, and federal government career pipelines with NSA, DARPA, and DoD contractor placement.' },
          { label: 'American Military University (AMU/APUS)', detail: 'Specifically designed for military and veteran students. Online, Yellow Ribbon partner, and fully accepts all military transcripts (JST/AARTS). Intelligence studies, Criminal Justice, Emergency Management, and Cybersecurity are top vet career programs.' }
        ]
      },
      {
        heading: 'Best Degrees for Maximum ROI (Ranked)',
        content: [
          { label: '#1 - Cybersecurity / Information Technology', detail: 'Median starting salary $75k-$95k. Government clearance-eligible. DoD 8570/8140 certifications (Security+, CEH, CISSP) add immediate pay premiums. CompTIA Security+ is $400 to test and lands $80k-$120k jobs. VR&E pays for ALL certification exams.' },
          { label: '#2 - Nursing (BSN/RN)', detail: 'VA Nurse Training Program pays salary DURING nursing school. Travel nurse contracts pay $6,000-$12,000/month for 13-week assignments. Veteran EMT/medic credits accelerate BSN by 1-2 years. Nursing shortage means 100% job placement.' },
          { label: '#3 - Business / Finance / Accounting', detail: 'CPA license opens $85k-$150k doors. CFP (Certified Financial Planner) pairs perfectly with the knowledge you gain navigating military finance. Many veterans become financial advisors specifically serving the veteran community.' },
          { label: '#4 - Federal Contracting / Acquisition Management', detail: 'Every dollar the DoD spends has an acquisition professional behind it. Defense Acquisition University (DAU) certifications are FREE for active duty and veterans. Federal acquisition managers earn $95k-$175k in the GS-12 to GS-15 range plus full federal benefits.' },
          { label: '#5 - Healthcare Administration / Physician Assistant', detail: 'PA programs accept military medical background. Starting PA salary: $120k-$150k. Healthcare administration MBAs at WGU or similar take 18 months with GI Bill covering full cost.' }
        ]
      },
      {
        heading: 'State Tuition Waiver Programs (Stack on top of GI Bill)',
        content: [
          { label: 'Texas Hazlewood Act', detail: 'FREE tuition at any Texas public college or university for veterans with honorable discharge who are Texas residents. Also transfers to ONE dependent child. Combined with GI Bill housing stipend = pure monthly income with zero education cost.' },
          { label: 'Florida Fee Waivers', detail: 'Florida waives 100% of tuition and fees at all public universities and community colleges for veterans who are FL residents. Combined with GI Bill BAH stipend, Florida veterans go to school for free AND get paid.' },
          { label: 'North Carolina UNC System Waiver', detail: '100% P&T veterans attend any UNC system school for FREE including Chapel Hill, NC State, UNC Charlotte, and East Carolina. The GI Bill housing stipend applies on top - net result: monthly income while in school.' },
          { label: 'New York State Veterans Tuition Awards (VTA)', detail: 'NY pays up to $5,135/yr to NY veteran residents on top of their federal benefits. Combined with GI Bill in a New York City school = very high BAH housing stipend ($3,000-$4,200/mo).' }
        ]
      }
    ]
  },
  {
    id: 'federal_career',
    icon: '💼',
    title: 'Federal / Government Career Route',
    tagline: 'Get hired faster, earn more, and stack two retirement streams the government cannot touch.',
    totalMonthlyEstimate: '6500 - 14000',
    eligibleFor: ['any'],
    overview: 'Veterans hold a permanent, irrevocable competitive edge in federal hiring. Once in, a federal career stacks a second retirement pension (FERS) directly on top of your VA disability compensation - and unlike the old CSRS system, FERS does NOT reduce your VA comp.',
    sections: [
      {
        heading: 'Veterans Preference: Your Unfair Advantage',
        content: [
          { label: '5-Point Preference (TP)', detail: 'All veterans with an honorable discharge and any active duty service get 5 extra points added to their competitive exam score on every federal job application via USAJOBS. A score of 85 becomes 90. This is permanent and applies to virtually all competitive service positions.' },
          { label: '10-Point Preference (CP/CPS) - The Real Weapon', detail: 'Veterans with a service-connected disability rating of 10% or more receive 10 points AND go to the TOP of the certificate of eligibles list - ahead of all non-preference eligible candidates regardless of score. A 30%+ rating puts you in the CPS (Compensable Preference Superior) category which is the highest hiring preference in the federal government.' },
          { label: 'Schedule A Disability Hiring', detail: 'Schedule A is a NON-COMPETITIVE hiring authority specifically for persons with disabilities including service-connected VA ratings. An agency can hire you DIRECTLY without competing. You need only a Schedule A letter from a VA doctor and a resume. Many agencies specifically seek Schedule A applicants.' },
          { label: 'Veterans Employment Opportunity Act (VEOA)', detail: 'VEOA allows preference eligibles to compete for career-ladder positions that agencies otherwise restrict to current federal employees. This lets you access internal promotion competitions without being a current fed - a massive door-opener for moving into GS-12 to GS-14 positions.' }
        ]
      },
      {
        heading: 'The FERS + VA Disability Double Pension',
        content: [
          { label: 'FERS Basic Benefit Calculation', detail: 'FERS pays 1% of your highest-3-year average salary per year of creditable service (1.1% if you retire at 62+ with 20+ years). A GS-12 federal employee earning $90k for 25 years retires at $22,500/yr ($1,875/mo) FERS pension. Add your VA compensation on top - ZERO reduction.' },
          { label: 'Military Service Buy-Back', detail: 'If you served on active duty before your federal civilian career, you can BUY BACK your military service time into your FERS retirement at a cost of 3% of your military base pay. This adds your entire military career to your FERS years of service - dramatically increasing your pension payout.' },
          { label: 'TSP (Thrift Savings Plan)', detail: 'The federal equivalent of a 401(k). FERS employees get a 1% automatic agency contribution plus up to 4% agency match. Max contribution in 2025 is $23,500/yr. Veterans who max TSP contributions for 20 years accumulate $1.2M-$2.4M in tax-deferred wealth.' },
          { label: 'Federal Health Benefits (FEHB + FEDVIP)', detail: 'Federal employees get access to the Federal Employees Health Benefits program (the best employer-sponsored healthcare in the nation). Combined with VA healthcare for service-connected conditions, a veteran fed has essentially zero out-of-pocket healthcare costs.' }
        ]
      },
      {
        heading: 'Top Federal Agencies and GS Pay by Location',
        content: [
          { label: 'DoD / Defense Agencies - GS-12 to GS-15', detail: 'DARPA, DLA, DISA, DSS, and the individual military service headquarters are premier veteran hiring destinations. Locality pay in DC/Northern VA adds 32.49% on top of base GS pay. A GS-13 Step 5 earns $120,579 base + 32.49% locality = $159,671 in DC. Security clearances earned during service are worth $20k-$50k annually in salary premiums.' },
          { label: 'VA (Veterans Health Administration)', detail: 'VHA is the largest health system in the US and hires veterans aggressively. Clinical positions (RN, PA, MD, Mental Health), administrative (healthcare admin), and IT roles all have veteran preference. Title 38 positions within VHA have their own pay structure that often exceeds comparable GS positions.' },
          { label: 'FBI / DHS / NSA / CIA', detail: 'Intelligence community agencies prize military veterans - especially those with active clearances, SIGINT/HUMINT experience, language qualifications, or special operations backgrounds. Your existing DoD clearance dramatically speeds the adjudication process.' }
        ]
      }
    ]
  },
  {
    id: 'sdvosb',
    icon: '🏗️',
    title: 'SDVOSB / Veteran-Owned Business',
    tagline: 'The government is legally required to set aside federal contracts specifically for veteran-owned businesses. Use it.',
    totalMonthlyEstimate: '5000 - 50000+',
    eligibleFor: ['any'],
    overview: 'Service-Disabled Veteran-Owned Small Businesses (SDVOSBs) have access to exclusive federal contract set-asides. The federal government is mandated to award at least 3% of all contracting dollars to SDVOSBs. In FY2024, that equaled over $47 BILLION in veteran-exclusive contracts.',
    sections: [
      {
        heading: 'Getting Certified: Step by Step',
        content: [
          { label: 'Step 1: Register on SAM.gov', detail: 'System for Award Management (SAM.gov) is the federal contractor database. Registration is free and takes 1-3 business days. You MUST be registered in SAM.gov before bidding on any federal contract. Renew annually - a lapsed SAM registration means you cannot receive payment even if you won a contract.' },
          { label: 'Step 2: SBA CVE Certification', detail: 'The Small Business Administration manages SDVOSB and VOSB certification through certifications.sba.gov. The process takes 60-90 days. You will need your DD-214, VA rating letter, business formation documents, operating agreement, and tax returns. Certification is valid for 3 years.' },
          { label: 'Step 3: Research Contract Opportunities', detail: 'Go to SAM.gov/opp and filter by Set-Aside type = SDVOSB. Browse open solicitations in your NAICS code. Start with small contracts under $150k to build past performance - your most critical currency in federal contracting.' },
          { label: 'Step 4: Write Your Capability Statement', detail: 'A one-page capability statement is the business card of federal contracting. It must include: company overview, core competencies, past performance, differentiators, certifications, DUNS/UEI number, NAICS codes, and cage code. Free templates available from your nearest PTAC or VBOC.' }
        ]
      },
      {
        heading: 'Best Business Types for Federal Set-Asides',
        content: [
          { label: 'IT / Cybersecurity Services', detail: 'The federal government spends over $90 billion per year on IT. Cybersecurity, cloud migration, help desk, software development, and system administration are constantly solicited. A veteran with Security+ or CISSP and an active clearance can bid on IDIQ vehicles like NASA SEWP, GSA Schedule, and Army CHESS.' },
          { label: 'Professional Services / Consulting', detail: 'Program management, logistics, administrative support, training services, and financial management consulting are high-volume federal contract categories perfectly suited to veterans with military operations backgrounds.' },
          { label: 'Construction / Facilities', detail: 'The Army Corps of Engineers and NAVFAC set aside construction, renovation, and facilities management contracts specifically for SDVOSBs. If you have a GC license or trade background, this is a straight line to 6-7 figure contracts on federal facilities.' },
          { label: 'Healthcare Staffing', detail: 'VA Medical Centers contract heavily for healthcare staffing (RN, LPN, PA, medical admin). An SDVOSB healthcare staffing firm can bid on VA NCI/FSS contracts to supply healthcare workers to VAMCs nationally - building recurring monthly revenue from a single contract vehicle.' }
        ]
      },
      {
        heading: 'Free Resources You Must Use',
        content: [
          { label: 'PTAC (Procurement Technical Assistance Centers)', detail: 'Completely free government-funded advisors who specialize in helping small businesses win federal contracts. They will review your bid/proposal, help you find solicitations, and introduce you to Contracting Officers. Find your local PTAC at aptac.org.' },
          { label: 'VBOC (Veteran Business Outreach Centers)', detail: 'SBA-funded centers specifically for veteran entrepreneurs. Free business plan writing, financial analysis, marketing strategy, and intro to federal contracting. Find your regional VBOC at sba.gov/vboc.' },
          { label: 'SBA Boots to Business', detail: 'A free 2-day entrepreneurship training course offered on military installations to transitioning service members and veterans. Covers business plan development, access to capital, and intro to federal contracting. Alumni receive priority access to SBA loans and SBIR grants.' }
        ]
      }
    ]
  },
  {
    id: 'tech_remote',
    icon: '🌐',
    title: 'Remote Tech / Digital Career',
    tagline: 'Certify on the government dime, get hired remotely, and work from anywhere in the world.',
    totalMonthlyEstimate: '5500 - 12000',
    eligibleFor: ['any'],
    overview: 'The DoD is the largest employer of cybersecurity and IT professionals on earth. Your security clearance, discipline, and systems thinking translate directly into $70k-$180k remote tech careers - and VR&E Chapter 31 will pay for every single certification exam to get you there.',
    sections: [
      {
        heading: 'VR&E-Funded Certifications (100% Free with 10%+ Rating)',
        content: [
          { label: 'CompTIA A+ to Security+ to Network+', detail: 'The standard entry path. A+ validates hardware/OS fundamentals. Network+ validates networking. Security+ is the DoD 8570/8140 baseline certification required for virtually every DoD IT job. All three can be completed in 4-6 months and open $55k-$80k roles. VR&E pays exam fees ($380-$460 each), study materials, and training.' },
          { label: 'AWS / Azure Cloud Certifications', detail: 'AWS Solutions Architect Associate and Azure AZ-104 are the most in-demand certs in the federal and private sector. Starting salaries for cloud architects at DoD contractors (Leidos, Booz Allen, SAIC) begin at $95k and scale to $160k with a TS/SCI clearance. VR&E pays for training courses and exam vouchers.' },
          { label: 'CISSP (Certified Information Systems Security Professional)', detail: 'The gold standard cybersecurity certification. Requires 5 years of experience. Median salary for CISSP holders is $130k. VR&E pays the $699 exam fee and any prep course costs. Most federal cybersecurity manager roles require or strongly prefer CISSP.' },
          { label: 'PMP (Project Management Professional)', detail: 'Veterans with military leadership backgrounds are ideal candidates for PMP certification. Requires 3 years of project management experience - military command and leadership counts. PMP holders earn a median of $123k. Applicable to every industry.' }
        ]
      },
      {
        heading: 'SkillBridge Programs: Get Hired Before You Separate',
        content: [
          { label: 'Amazon (AWS)', detail: 'Amazon SkillBridge rotations in cloud operations, logistics, IT, and operations management. Post-SkillBridge hire rate from Amazon is extremely high. Starting roles at $75k-$110k with RSU equity grants.' },
          { label: 'Microsoft', detail: 'Microsoft MSSA (Microsoft Software and Systems Academy) is an 18-week program accepting active duty service members in the last 180 days of service. Graduates receive Microsoft Azure certifications and are matched with Microsoft and partner employers. Average starting salary: $80k-$120k.' },
          { label: 'Leidos / SAIC / Booz Allen Hamilton', detail: 'The Big Three defense IT contractors run SkillBridge rotations that convert at very high rates. These companies prioritize hiring veterans with clearances into program management, cybersecurity, systems engineering, and IT infrastructure roles at $85k-$140k.' },
          { label: 'VET TEC Program', detail: 'VA-funded high-tech training pilot that pays private coding bootcamps and tech training providers for veterans at NO cost and WITHOUT using your GI Bill months. Programs cover full-stack development, Python, data science, and UX design.' }
        ]
      }
    ]
  },
  {
    id: 'coast_freedom',
    icon: '🏖️',
    title: 'The Pure Freedom / Coast Route',
    tagline: 'For 100% P&T veterans: how to build a $8,000-$14,000/mo income floor with zero traditional employment.',
    totalMonthlyEstimate: '8000 - 14000',
    eligibleFor: ['100pt'],
    overview: 'If you are 100% Permanent & Total, you already receive one of the most powerful financial platforms in existence. Most veterans never fully stack it. Here is the complete blueprint to generate $8k-$14k per month in tax-free or tax-advantaged income without ever working a traditional job again.',
    sections: [
      {
        heading: 'The Full Stack: Monthly Income Floor',
        content: [
          { label: 'VA Disability Compensation (100% P&T)', detail: '$3,737.85/mo tax-free (2026 rate, single veteran). Add $150-$400/mo per dependent. This is your foundation - it never stops, never gets taxed federally or in most states, and adjusts annually with COLA.' },
          { label: 'SMC-S Housebound Add-On', detail: 'If you have a separate additional service-connected condition rated at 60%+ (or are actually housebound), you qualify for SMC-S which pays $4,408.53/mo total - roughly $670/mo MORE than standard 100%. Most veterans with 100% P&T and multiple conditions qualify for at least SMC-K ($139.87/mo per qualifying condition).' },
          { label: 'VA House Hack Rental Income (2-4 Unit)', detail: 'Using your VA loan with $0 down to purchase a 2-4 unit property in a military market like San Antonio, Fayetteville, or Columbus, renting out the other units generates $1,500-$3,500/mo passive income while you live in one unit for free or near-free. This effectively gives you free housing PLUS income.' },
          { label: 'Dividend Portfolio / Brokerage Income', detail: 'Investing VA comp surplus into dividend-paying ETFs (SCHD, VYM, JEPI) at $500-$1,000/mo over 5 years generates $600-$2,000/mo in passive dividend income. Roth IRA contributions from VA comp are tax-advantaged with tax-free growth.' }
        ]
      },
      {
        heading: 'Expenses You No Longer Pay (Annual Savings)',
        content: [
          { label: 'State Property Taxes', detail: '$0 in TX, FL, SC, NC, GA, VA (100% P&T) - saving $5,000-$14,000/yr depending on home value.' },
          { label: 'Family Health Insurance', detail: 'CHAMPVA covers spouse and all dependents under 23 at ZERO premium cost - saving $12,000-$18,000/yr in private health insurance premiums.' },
          { label: 'Dental Care', detail: 'Priority Group 1 (100% P&T) = full comprehensive dental, zero co-pay - saving $2,000-$5,000/yr.' },
          { label: 'Commissary and Exchange Shopping', detail: 'Tax-free groceries 20-30% below civilian prices, tax-free electronics and clothing - saving $3,000-$5,500/yr for a family of 4.' }
        ]
      },
      {
        heading: '5-Year Wealth Building Blueprint',
        content: [
          { label: 'Year 1: Claim Everything and Set the Foundation', detail: 'Verify 100% P&T. Apply for CHAMPVA. Enroll family in VA dental. Claim state property tax exemption. Open Roth IRA. Obtain NextGen USID for commissary access. Buy Lifetime Military Pass. Start building 3-month cash reserve from VA comp savings.' },
          { label: 'Year 2: The House Hack', detail: 'Use VA loan to purchase 2-4 unit property in a military market. Move into one unit, rent all others. Target properties where rents from other units cover 100% of PITI - achieving zero housing cost. Refinance IRRRL if rates drop.' },
          { label: 'Year 3: Invest the Surplus', detail: 'With housing cost covered by tenants and VA comp + SMC as base income, redirect $1,000-$2,000/mo into Roth IRA (max $7,000/yr) and brokerage SCHD/VYM dividend ETFs. Begin building taxable brokerage as backup income layer.' },
          { label: 'Year 4-5: Business or Education Layer', detail: 'Add a light-touch 1099 consulting stream, SDVOSB contract, or finish a degree via GI Bill while the rental pays itself. This transforms passive income into compounding multi-stream wealth.' }
        ]
      }
    ]
  }
];


const VeteranBenefitsCompass = () => {

  // ---- Inspirational Splash Screen State (12s Display Timer) ----
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);

  useEffect(() => {
    // 12-second total duration before smooth fade
    const fadeTimer = setTimeout(() => {
      setSplashFading(true);
    }, 12000);

    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 12500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  // ---- Page Routing ----
  const [currentPage, setCurrentPage] = useState('landing');
  const [wizardStep, setWizardStep] = useState(0);

  // ---- Profile State (Persisted in localStorage) ----
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [isProfileSaved, setIsProfileSaved] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

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

  // ---- Navigation ----
  const [activeTab, setActiveTab] = useState('planner');
  // eslint-disable-next-line no-unused-vars
  const [activeAvenue, setActiveAvenue] = useState('expat');
  const [claimsSubTab, setClaimsSubTab] = useState('math');
  const [claimsList, setClaimsList] = useState([50, 30, 10]);
  const [newClaimVal, setNewClaimVal] = useState(10);
  const [showCrisis, setShowCrisis] = useState(false);

  // ---- Planner Sub-Modes ----
  const [plannerMode, setPlannerMode] = useState('goals'); // 'goals' | 'protocol'
  const [lifeGoals, setLifeGoals] = useState(['freedom', 'home']);
  const [planGenerated, setPlanGenerated] = useState(true);
  const [activeFreedomStage, setActiveFreedomStage] = useState('stage1');

  // ---- C&P Exam Simulator State ----
  const [selectedCpScenario, setSelectedCpScenario] = useState('spine');
  const [cpChoice, setCpChoice] = useState(null);

  // ---- House Hacker Calculator State ----
  const [homePrice, setHomePrice] = useState(450000);
  // eslint-disable-next-line no-unused-vars
  const [interestRate, setInterestRate] = useState(6.25);
  // eslint-disable-next-line no-unused-vars
  const [propertyUnits, setPropertyUnits] = useState(3);
  // eslint-disable-next-line no-unused-vars
  const [rentPerUnit, setRentPerUnit] = useState(1400);

  // ---- Milestone Tracker State ----
    // ---- Completed Benefits & Savings Tracking State ----
  const [completedBenefits, setCompletedBenefits] = useState({
    tax_exemption_100: false,
    champva_family_100: false,
    dental_priority_1_100: false,
    parks_pass: true,
    commissary_exchange: true,
    va_healthcare: true,
  });

  const toggleBenefitCompleted = (id) => {
    setCompletedBenefits(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        const saved = localStorage.getItem('vbc_veteran_profile');
        if (saved) {
          const p = JSON.parse(saved);
          p.completedBenefits = updated;
          localStorage.setItem('vbc_veteran_profile', JSON.stringify(p));
        }
      } catch (e) {}
      return updated;
    });
  };

  const [completedMilestones, setCompletedMilestones] = useState({
    va_account_set: true,
    va_healthcare: true
  });


  // ---- House Hacker State ----
  const [hhState, setHhState] = useState('TX');
  const [hhPrice, setHhPrice] = useState(300000);
  const [hhUnits, setHhUnits] = useState(2);
  const [hhRate, setHhRate] = useState(6.85);
  const [hhIsVeteranExempt, setHhIsVeteranExempt] = useState(true);
  const [hhDownPct, setHhDownPct] = useState(0);
  const [hhInsurance, setHhInsurance] = useState(200);


  // ---- Avenues Accordion State ----
  const [expandedAvenue, setExpandedAvenue] = useState(null);
  const [avenueHasDeps, setAvenueHasDeps] = useState(false);
  const [avenueSchoolMode, setAvenueSchoolMode] = useState('inperson');

  // ---- Medical Scanner State ----
  const [scanText, setScanText] = useState('');
  const [scanResults, setScanResults] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);
  const fileInputRef = useRef(null);

  // -----------------------------------------------------------------------
  // LOCALSTORAGE PROFILE PERSISTENCE
  // -----------------------------------------------------------------------
  useEffect(() => {
    try {
      const saved = localStorage.getItem('vbc_veteran_profile');
      if (saved) {
        const p = JSON.parse(saved);
        if (p.userEmail) setUserEmail(p.userEmail);
        if (p.userName) setUserName(p.userName);
        if (p.branch) setBranch(p.branch);
        if (p.separationMonths !== undefined) setSeparationMonths(p.separationMonths);
        if (p.alreadyOut !== undefined) setAlreadyOut(p.alreadyOut);
        if (p.dischargeType) setDischargeType(p.dischargeType);
        if (p.disabilityStatus) setDisabilityStatus(p.disabilityStatus);
        if (p.currentRating !== undefined) setCurrentRating(p.currentRating);
        if (p.futurePath) setFuturePath(p.futurePath);
        if (p.selectedState) setSelectedState(p.selectedState);
        if (p.hasDependents) setHasDependents(p.hasDependents);
        if (p.yearsOfService !== undefined) setYearsOfService(p.yearsOfService);
        if (p.servedPost911 !== undefined) setServedPost911(p.servedPost911);
        if (p.exposedBurnPit !== undefined) setExposedBurnPit(p.exposedBurnPit);
        if (p.mstFlag !== undefined) setMstFlag(p.mstFlag);
        if (p.lifeGoals) setLifeGoals(p.lifeGoals);
        if (p.completedMilestones) setCompletedMilestones(p.completedMilestones);
        if (p.completedBenefits) setCompletedBenefits(p.completedBenefits);
        if (p.homePrice) setHomePrice(p.homePrice);
        setIsProfileSaved(true);
      }
    } catch (e) {
      console.warn('Could not load profile from localStorage', e);
    }
  }, []);

  const saveProfileToStorage = (emailToSave = userEmail, nameToSave = userName) => {
    const profile = {
      userEmail: emailToSave,
      userName: nameToSave,
      branch,
      separationMonths,
      alreadyOut,
      dischargeType,
      disabilityStatus,
      currentRating,
      futurePath,
      selectedState,
      hasDependents,
      yearsOfService,
      servedPost911,
      exposedBurnPit,
      mstFlag,
      lifeGoals,
      completedMilestones,
      completedBenefits,
      homePrice,
      savedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem('vbc_veteran_profile', JSON.stringify(profile));
      setIsProfileSaved(true);
      setShowEmailModal(false);
    } catch (e) {
      console.error('Failed to save profile to localStorage', e);
    }
  };

  // -----------------------------------------------------------------------
  // BRANCH DATA
  // -----------------------------------------------------------------------
  const branchData = {
    usmc:  { name: 'Marine Corps', badge: 'USMC', sep: 'EAS', slang: 'Marine / Devil Dog' },
    army:  { name: 'Army',         badge: 'ARMY', sep: 'ETS', slang: 'Soldier' },
    navy:  { name: 'Navy',         badge: 'NAVY', sep: 'EAOS', slang: 'Sailor / Shipmate' },
    usaf:  { name: 'Air Force',    badge: 'USAF', sep: 'DOS', slang: 'Airman' },
    uscg:  { name: 'Coast Guard',  badge: 'USCG', sep: 'DOS', slang: 'Coastie / Guard' },
    ussf:  { name: 'Space Force',  badge: 'USSF', sep: 'ETS', slang: 'Guardian' },
  };
  const bd = branchData[branch] || branchData.usmc;

  // -----------------------------------------------------------------------
  // VA MATH WITH BILATERAL FACTOR OPTIMIZATION
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
  const effectiveRatingForPay = currentRating > 0 ? currentRating : roundedRating;
  const monthlyPay = (vaPayTable[effectiveRatingForPay] || vaPayTable[0])[depKey] || 0;
  const annualPay = monthlyPay * 12;

  // -----------------------------------------------------------------------
  // HOUSE HACK CALCULATOR LOGIC
  // -----------------------------------------------------------------------
  // eslint-disable-next-line no-unused-vars
  const calcHouseHack = () => {
    const monthlyRate = (interestRate / 100) / 12;
    const nPayments = 360;
    const monthlyMortgagePI = (homePrice * (monthlyRate * Math.pow(1 + monthlyRate, nPayments))) / (Math.pow(1 + monthlyRate, nPayments) - 1);
    const estimatedInsurance = (homePrice * 0.005) / 12;
    const isTaxExempt = (currentRating === 100 && (selectedState === 'tx' || selectedState === 'fl' || selectedState === 'nv' || selectedState === 'oh'));
    const estimatedTaxes = isTaxExempt ? 0 : (homePrice * 0.015) / 12;
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
      propertyTaxWaived: isTaxExempt
    };
  };

  // -----------------------------------------------------------------------
  // ENHANCED HOUSE HACKER CALCULATOR
  // -----------------------------------------------------------------------
  const calcEnhancedHouseHack = () => {
    const stateData = STATE_GRADES.find(s => s.abbr === hhState) || STATE_GRADES[0];
    const loanAmt = hhPrice * (1 - hhDownPct / 100);

    // VA Funding Fee: 0% if service-connected 10%+ rated, otherwise 1.25% (first use 0% down)
    const fundingFee = hhIsVeteranExempt ? 0 : loanAmt * 0.0125;
    const totalLoan = loanAmt + fundingFee;

    // Monthly mortgage P&I
    const monthlyRate = hhRate / 100 / 12;
    const numPayments = 360; // 30yr
    const pAndI = totalLoan * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);

    // Property tax
    const annualTaxRate = hhIsVeteranExempt && stateData.landlordFriendly ? 0 : 0.012; // approx 1.2% if not exempt
    const monthlyTax = (hhPrice * annualTaxRate) / 12;

    // Insurance
    const monthlyInsurance = hhInsurance;

    // PITI
    const piti = pAndI + monthlyTax + monthlyInsurance;

    // Rental income from OTHER units (vet lives in 1)
    const rentingUnits = hhUnits - 1;
    const rentPerUnit = hhUnits === 2 ? stateData.avgRent2br
                      : hhUnits === 3 ? stateData.avgRent3br
                      : stateData.avgRent4br;
    const grossRent = rentPerUnit * rentingUnits;
    const vacancyLoss = grossRent * 0.05; // 5% vacancy
    const maintenanceCost = grossRent * 0.08; // 8% maintenance reserve
    const netRent = grossRent - vacancyLoss - maintenanceCost;

    // Net cash flow (positive = vet profits, negative = vet subsidizes)
    const netCashFlow = netRent - piti;

    // Effective monthly housing cost for the vet
    const effectiveHousingCost = Math.max(0, piti - netRent);

    // Equity building
    const annualAppreciation = hhPrice * 0.04; // assume 4%/yr
    const yearOnePrincipalPaydown = (pAndI * 12) - ((totalLoan * hhRate / 100));
    const fiveYearEquity = (annualAppreciation * 5) + (hhDownPct / 100 * hhPrice) + Math.max(0, yearOnePrincipalPaydown * 5);

    // DSCR
    const dscr = netRent / piti;

    return {
      stateData,
      loanAmt, fundingFee, totalLoan,
      pAndI, monthlyTax, monthlyInsurance, piti,
      rentPerUnit, rentingUnits, grossRent, netRent, netCashFlow,
      effectiveHousingCost, fiveYearEquity, dscr
    };
  };


  // -----------------------------------------------------------------------
  // FINANCIAL SUMMARY ENGINE (CASH + SAVINGS CALCULATIONS)
  // -----------------------------------------------------------------------
  const calcFinancialSummary = () => {
    // 1. Base VA Disability Compensation (Monthly * 12)
    const baseDisabilityAnnualCash = annualPay;

    // 2. Completed Action Items & Perks
    let additionalAnnualCash = 0;
    let annualSavingsAndDiscounts = 0;
    let upfrontGrantsUnlocked = 0;

    // Check completed items from ALL_DYNAMIC_STEPS
    ALL_DYNAMIC_STEPS.forEach(step => {
      if (completedBenefits[step.id]) {
        if (step.isCash) {
          // If it's already accounted in base disability, don't double count
          if (step.id !== 'initial_disability_claim' && step.id !== 'tdiu_70_plus') {
            additionalAnnualCash += (step.annualValue || 0);
          }
        } else {
          annualSavingsAndDiscounts += (step.annualValue || 0);
        }
        upfrontGrantsUnlocked += (step.upfrontValue || 0);
      }
    });

    // Check completed items from SPECIAL_PERKS
    SPECIAL_PERKS.forEach(perk => {
      if (completedBenefits[perk.id]) {
        if (perk.isCash) {
          additionalAnnualCash += (perk.annualValue || 0);
        } else {
          annualSavingsAndDiscounts += (perk.annualValue || 0);
        }
        upfrontGrantsUnlocked += (perk.upfrontValue || 0);
      }
    });

    const totalAnnualCashIncome = baseDisabilityAnnualCash + additionalAnnualCash;
    const totalAnnualCombinedValue = totalAnnualCashIncome + annualSavingsAndDiscounts;
    const tenYearWealthImpact = (totalAnnualCombinedValue * 10) + upfrontGrantsUnlocked;
    const twentyYearWealthImpact = (totalAnnualCombinedValue * 20) + upfrontGrantsUnlocked;

    return {
      baseDisabilityAnnualCash,
      additionalAnnualCash,
      totalAnnualCashIncome,
      annualSavingsAndDiscounts,
      totalAnnualCombinedValue,
      upfrontGrantsUnlocked,
      tenYearWealthImpact,
      twentyYearWealthImpact
    };
  };
  const finSummary = calcFinancialSummary();


  // -----------------------------------------------------------------------
  // DYNAMIC PERSONALIZED ROADMAP GENERATOR
  // -----------------------------------------------------------------------
  const toggleGoal = (id) => {
    setLifeGoals(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  const getPersonalizedRoadmap = () => {
    const profile = {
      currentRating,
      dischargeType,
      yearsOfService,
      servedPost911,
      exposedBurnPit,
      alreadyOut,
      hasDependents,
      separationMonths,
      selectedState
    };

    return ALL_DYNAMIC_STEPS
      .filter(step => {
        if (step.showWhen && !step.showWhen(profile)) {
          return false;
        }
        if (step.goals.includes('universal')) return true;
        return step.goals.some(g => lifeGoals.includes(g));
      })
      .sort((a, b) => a.priority - b.priority);
  };
  const dynamicRoadmap = getPersonalizedRoadmap();

  // -----------------------------------------------------------------------
  // FILTERED MILESTONES (TRACKER)
  // -----------------------------------------------------------------------
  const profileForMilestones = { alreadyOut, currentRating, hasDependents };
  const filteredMilestones = ALL_MILESTONES.filter(m => !m.hideWhen || !m.hideWhen(profileForMilestones));

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
  // STATE BENEFITS MATRIX (EXPANDED)
  // -----------------------------------------------------------------------
  const stateBenefits = {
    tx: { name:'Texas',          highlights:['100% P&T = 100% property tax exemption ($4K-$12K+/yr)','No state income tax on any income','Hazlewood Act: 150 credit hours free tuition at TX public colleges (transferable to dependents)','Free DV license plates and hunting/fishing licenses','VLB land and home loan program (low-rate second lien loans)'] },
    fl: { name:'Florida',        highlights:['No state income tax','100% P&T = full property tax exemption','Free college tuition for dependents of 100% P&T vets at FL state schools','Free hunting and fishing license for any rating','Florida Resident Access Grant for private colleges'] },
    nv: { name:'Nevada',         highlights:['No state income tax on any income','Property tax exemption: $22,500 base; 100% P&T = full exemption','Free Nevada State Parks annual pass','Free NDOW hunting and fishing licenses at 100% P&T','DMV waives registration fees for disabled veterans'] },
    ca: { name:'California',     highlights:['No state tax on VA disability pay (military retirement partially taxed)','CalVet Farm and Home Loan at below-market rates','Property tax exemption up to $271K assessed value reduction','College Fee Waiver for veteran dependents at all CA public colleges','Free fishing and hunting license at 100% P&T'] },
    nc: { name:'North Carolina', highlights:['No state tax on military retirement pay (Harper v. Virginia tax relief)','Property tax: $45,000 assessed value reduction for disabled veterans','NC Scholarship for Children of Wartime Veterans (Full tuition at UNC system schools)','Free hunting and inland fishing licenses at 50%+ disability'] },
    oh: { name:'Ohio',           highlights:['100% homestead property tax exemption for 100% P&T veterans','Ohio Veterans Bonus Program (tax-free cash bonus for wartime deployments)','Ohio War Orphans & Severely Disabled Veterans Scholarship (80%+ tuition waiver)','Military retirement pay 100% exempt from state income tax'] },
    ga: { name:'Georgia',        highlights:['100% P&T disabled veteran homestead exemption (up to $109,986 exemption)','Free Georgia drivers license and disabled veteran license plates','State income tax exemption on first $35,000 of military retirement pay','Free lifetime hunting and fishing license'] },
    wa: { name:'Washington',     highlights:['No state income tax on any income','Property tax exemption at 100% P&T on primary residence','Free state park passes and discounted hunting/fishing licenses','Tuition waivers at WA state public colleges'] },
    az: { name:'Arizona',        highlights:['Military retirement pay 100% exempt from state income tax','Property tax exemption for disabled veterans','AZ Veteran Supportive Campus priority college admissions','Free AZ hunting and fishing licenses at 100% P&T'] },
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
  // EMAIL / PROFILE SYNC MODAL
  // -----------------------------------------------------------------------
  const EmailSyncModal = () => {
    const [tempEmail, setTempEmail] = useState(userEmail);
    const [tempName, setTempName] = useState(userName);

    if (!showEmailModal) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-steel-dark border border-gold/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-steel/50 pb-3">
            <div className="flex items-center gap-2">
              <User className="text-gold" size={18}/>
              <h3 className="font-black uppercase tracking-tight text-lg">Save Your Personalized Dashboard</h3>
            </div>
            <button onClick={()=>setShowEmailModal(false)} className="text-sand/40 hover:text-sand"><X size={16}/></button>
          </div>

          <p className="text-sand/70 text-xs leading-relaxed">
            Enter your email to save your personalized military roadmap, house hacking numbers, and milestone progress. The portal will automatically recognize you when you return.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono uppercase text-gold mb-1">Your Name / Callsign</label>
              <input
                type="text"
                placeholder="e.g. Sgt. Miller / Devil Dog"
                value={tempName}
                onChange={e=>setTempName(e.target.value)}
                className="w-full bg-steel/30 border border-steel/60 rounded-xl px-3 py-2 text-sm text-sand focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-gold mb-1">Email Address</label>
              <input
                type="email"
                placeholder="veteran@example.com"
                value={tempEmail}
                onChange={e=>setTempEmail(e.target.value)}
                className="w-full bg-steel/30 border border-steel/60 rounded-xl px-3 py-2 text-sm text-sand focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={()=>{
                setUserEmail(tempEmail);
                setUserName(tempName);
                saveProfileToStorage(tempEmail, tempName);
              }}
              className="flex-1 py-2.5 bg-gold hover:bg-yellow-600 text-steel-dark font-black text-sm uppercase rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
              <Save size={15}/> Save & Remember Me
            </button>
          </div>
        </div>
      </div>
    );
  };

  // -----------------------------------------------------------------------
  // LANDING PAGE WITH 12-SECOND INSPIRATIONAL OVERLAY
  // -----------------------------------------------------------------------
  if (currentPage === 'landing') return (
    <div className="min-h-screen bg-steel-dark text-sand flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"/>
      <CrisisBanner/>
      <EmailSyncModal/>

      {/* Inspirational Opening Quote Overlay (12s Display) */}
      {showSplash && (
        <div
          className={`fixed inset-0 z-50 bg-gray-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center transition-opacity duration-500 ${
            splashFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(#990000_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none"/>
          
          <div className="max-w-2xl mx-auto space-y-6 relative z-10 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 mx-auto flex items-center justify-center text-gold shadow-lg shadow-gold/10">
              <Quote size={28} className="text-gold animate-pulse" />
            </div>

            <div className="space-y-5">
              <blockquote className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-sand leading-snug">
                "Too many of our U.S. service members have no idea the immense level of <span className="text-gold">financial freedom</span> waiting on the other side of military service. This free portal was built to give you the <span className="text-scarlet">ultimate blueprint</span> and foundation to claim everything you have earned, build real wealth, and take full control of your future."
              </blockquote>

              <div className="pt-3 text-sm font-mono tracking-wider text-gold font-black uppercase">
                -- Sgt Rusch
              </div>
            </div>

            <div className="pt-4 flex flex-col items-center gap-3">
              <button
                onClick={() => {
                  setSplashFading(true);
                  setTimeout(() => setShowSplash(false), 300);
                }}
                className="px-6 py-2.5 bg-scarlet hover:bg-red-800 text-sand text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 group"
              >
                Enter Portal <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Visual 12-second countdown progress line */}
              <div className="w-48 h-1 bg-steel/40 rounded-full overflow-hidden border border-steel/60">
                <div className="h-full bg-gold" style={{ width: '100%', animation: 'shrink 12s linear forwards' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="border-b border-steel/50 bg-steel-dark/90 backdrop-blur-md py-4 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center font-mono">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-scarlet animate-ping"/>
            <span className="text-xs tracking-widest uppercase opacity-70 font-bold">SITREP: ACTIVE TRANSITION PORTAL</span>
          </div>
          <div className="flex items-center gap-3">
            {isProfileSaved && userEmail && (
              <span className="text-xs border border-gold/40 px-2.5 py-1 rounded-full bg-gold/10 text-gold font-bold">
                 Synced: {userName || userEmail}
              </span>
            )}
            <span className="text-xs border border-gold/30 px-3 py-1 rounded bg-gold/5 text-gold font-bold">UNCLASSIFIED</span>
          </div>
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
          The all-inclusive military transition portal. Every benefit, real estate house hack, C&P exam simulator, and wealth strategy -- fully tailored to your exact profile.
        </p>
        <p className="text-sm text-sand/40 mb-10">All branches. All paths. Zero fluff. Crayon-reader friendly.</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl w-full mb-10 text-left">
          {[
            { icon:<Target size={16}/>,      title:'Tailored Wealth Planner',  desc:'Custom dynamic roadmap filtered to your exact rating' },
            { icon:<Home size={16}/>,        title:'VA House Hacker Engine',   desc:'2-4 unit multi-family real estate calculator' },
            { icon:<Activity size={16}/>,    title:'C&P Exam Simulator',       desc:'Practice DBQ scenarios & avoid trap answers' },
            { icon:<FileText size={16}/>,     title:'Medical File Scanner',     desc:'Upload records, discover missed DC claims' },
            { icon:<TrendingUp size={16}/>,   title:'VA Math Simulator',        desc:'Live combined whole-person calculation' },
            { icon:<CheckSquare size={16}/>,  title:'Milestone Tracker',        desc:'Interactive transition checklist tailored to your status' },
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
                className={"p-3 rounded-xl border transition-all text-center " + (branch===key ? "border-gold bg-gold/10 text-gold shadow-lg scale-105" : "border-steel/60 text-sand/50 hover:text-sand hover:border-steel")}>
                <div className="font-black text-xs uppercase">{b.badge}</div>
                <div className="text-xs opacity-60 mt-0.5">{b.name}</div>
              </button>
            ))}
          </div>
          <button onClick={()=>{
            // Directly jump to Wizard Phase 1 (Status) without redundant branch confirmation
            setCurrentPage('wizard');
            setWizardStep(0);
          }}
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
  // STREAMLINED WIZARD (3 FOCUSED PHASES -- NO REDUNDANT BRANCH CONFIRMATION)
  // -----------------------------------------------------------------------
  if (currentPage === 'wizard') {
    const steps = ['Status', 'Health & Exposure', 'Mission & Location'];

    return (
      <div className="min-h-screen bg-steel-dark text-sand flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"/>
        <CrisisBanner/>
        <EmailSyncModal/>

        <header className="border-b border-steel/50 bg-steel-dark/90 backdrop-blur-md py-4 px-6 relative z-10 font-mono">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button onClick={()=>setCurrentPage('landing')} className="flex items-center gap-1 text-xs uppercase hover:text-gold transition-colors">
              <ChevronLeft size={14}/> Abort
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-gold/10 border border-gold/30 text-gold px-2 py-0.5 rounded font-bold">{bd.badge}</span>
              <span className="text-xs text-gold uppercase tracking-wider">Phase {wizardStep+1} of {steps.length}</span>
            </div>
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

              {/* Step 0: Separation Status & Discharge Characterization */}
              {wizardStep === 0 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Separation Status & Service Record</h2>
                    <p className="text-sand/60 text-sm">Tailors your timeline milestones specifically for {bd.name} ({bd.sep}).</p>
                  </div>

                  <div className="bg-steel-dark/50 border border-steel/50 rounded-xl p-4 space-y-4">
                    <div className="font-mono text-xs uppercase tracking-widest text-gold font-bold">Separation Timing</div>
                    <div className="grid grid-cols-2 gap-2">
                      {[{val:false, label:'Active / Upcoming '+bd.sep},{val:true, label:'Already Separated (Veteran)'}].map(opt=>(
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
                        Discharge upgrade priority activated. Your entire dashboard and planner will surface the DRB/BCMR upgrade process first.
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

              {/* Step 1: Health & Disability */}
              {wizardStep === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Health and Disability Profile</h2>
                    <p className="text-sand/60 text-sm">Honest answers immediately eliminate redundant questions and tune your dashboard.</p>
                  </div>

                  <div className="bg-steel-dark/50 border border-steel/50 rounded-xl p-4 space-y-4">
                    <div className="font-mono text-xs uppercase tracking-widest text-gold font-bold">VA Disability Status</div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {val:'none',    label:'No Rating Yet',              sub:'Have not filed a claim'},
                        {val:'pending', label:'Filed -- Pending',           sub:'Waiting on decision'},
                        {val:'filed',   label:'Rated -- Seeking Increase',  sub:'Have rating, want more'},
                        {val:'rated',   label:'Established Rating',         sub:'Know current number'},
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
                        PACT Act Presumptive Protocol active: No nexus letter needed for qualifying respiratory/cancer claims.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Mission & Location */}
              {wizardStep === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Your Future Mission & Location</h2>
                    <p className="text-sand/60 text-sm">We will build your personalized action plan around your exact selections.</p>
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
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
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
                          {val:'single',      label:'Single (No Dependents)'},
                          {val:'single_kids', label:'Single Parent (with children)'},
                          {val:'spouse',      label:'Married (Spouse only)'},
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
                  <button onClick={()=>{
                    saveProfileToStorage();
                    setCurrentPage('dashboard');
                    setActiveTab('planner');
                  }}
                    className="flex-1 py-3 bg-gold hover:bg-yellow-600 text-steel-dark font-black text-base rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider shadow-lg">
                    Launch Tailored Dashboard <ArrowRight size={18}/>
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
    { id:'summary',   icon:<BarChart3 size={13}/>,    label:'Summary & Value',        tooltip:'Real-time financial summary showing all completed benefits, tax-free annual income, and healthcare/tax savings.' },
    { id:'planner',   icon:<Target size={13}/>,       label:'Life & Wealth Planner',  tooltip:'Interactive goal-driven roadmap tailored to your rating + the 5-Stage Golden Stacking Protocol.' },
    { id:'househack', icon:<Home size={13}/>,         label:'VA House Hacker',        tooltip:'Interactive multi-family (2-4 units) real estate calculator with $0-down mortgage, rent offsets, and state tax shields.' },
    { id:'claims',    icon:<Activity size={13}/>,     label:'Claims & C&P Sim',       tooltip:'Practice C&P exam DBQ scenarios, calculate whole-person math, explore secondary claims, SMC tiers, and Diagnostic Lexicon.' },
    { id:'perks',     icon:<Sparkles size={13}/>,     label:'High-Value Perks',       tooltip:'Space-A free military flights (Category VI), America the Beautiful lifetime parks pass, Adaptive Housing Grants ($117k), and Free VA Dental Classes.' },
    { id:'scanner',   icon:<Cpu size={13}/>,          label:'Med Scanner',            tooltip:'Upload or paste medical records to scan for 25+ service-connected conditions, DC codes, and PACT Act presumptives. 100% private.' },
    { id:'avenues',   icon:<Compass size={13}/>,      label:'Avenues',                tooltip:'5 proven life pathways: Expat living, FIRE, Education stacking, high-paying civilian career, and SDVOSB entrepreneurship.' },
    { id:'benefits',  icon:<Award size={13}/>,        label:'State Matrix',           tooltip:'Comprehensive state-by-state veteran benefits: full property tax exemptions, free college tuition, vehicle registration waivers.' },
    { id:'tracker',   icon:<CheckSquare size={13}/>,  label:'Milestones',             tooltip:'Interactive transition checklist tailored to your separation status with live progress saving.' },
    { id:'upgrade',   icon:<Flag size={13}/>,         label:'Discharge Guide',        tooltip:'Step-by-step discharge upgrade guide for DRB and BCMR/BCNR boards under PTSD/MST Liberal Consideration.' },
    { id:'resources', icon:<Phone size={13}/>,        label:'Resources',              tooltip:'Veterans Crisis Line, free VSO locator (DAV/VFW), mental health (Headstrong free therapy), and official VA Form downloads.' },
  ];

  return (
    <div className="min-h-screen bg-steel-dark text-sand flex flex-col">
      <CrisisBanner/>
      <EmailSyncModal/>

      {/* Top Nav */}
      <header className="border-b border-steel/50 bg-steel-dark/90 backdrop-blur-md py-3 px-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Compass className="text-gold" size={18}/>
            <span className="font-black text-sm uppercase tracking-wider">VET-COMPASS</span>
            <span className="text-sand/30 font-mono text-xs border border-steel/40 px-2 py-0.5 rounded">{bd.badge}</span>
            {userName && (
              <span className="hidden sm:inline-block text-xs font-mono text-gold/80">
                | Welcome, {userName}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={()=>setShowEmailModal(true)}
              className={"text-xs font-mono px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 " + (isProfileSaved && userEmail ? "border-gold/40 bg-gold/10 text-gold" : "border-steel/60 hover:border-gold text-sand/60 hover:text-sand")}>
              <Mail size={12}/>
              {isProfileSaved && userEmail ? (
                <span>Saved ({userEmail.split('@')[0]})</span>
              ) : (
                <span>Save Profile</span>
              )}
            </button>

            {currentRating > 0 && (
              <span className="text-xs text-gold font-mono font-bold border border-gold/30 px-2 py-1 rounded bg-gold/5">
                {currentRating}% Rated
              </span>
            )}
            <button onClick={()=>setCurrentPage('wizard')} className="text-xs text-sand/40 hover:text-gold transition-colors font-mono uppercase tracking-wider">
              Edit Settings
            </button>
          </div>
        </div>
      </header>

      {/* Dynamic SITREP Banner Tailored Specifically to Settings */}
      <div className="bg-steel/25 border-b border-steel/30 px-6 py-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-mono gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse"/>
            <span className="text-gold font-bold">TAILORED SITREP:</span>
            <span className="text-sand/80">
              {currentRating === 100 ? (
                <span>100% P&T Active - {stateInfo.name} Tax Shield Unlocked - Priority 1 VA Care - Space-A Cat VI Eligible</span>
              ) : alreadyOut ? (
                <span>Separated Veteran - Current Rating: {currentRating}% - Target: 100% P&T Stacking</span>
              ) : (
                <span>{separationMonths} Months to {bd.sep} - BDD Window Priority Active - SkillBridge Eligible</span>
              )}
              {dischargeType !== 'honorable' && ' - Discharge Upgrade Priority'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sand/60">
            {currentRating > 0 ? (
              <span>Monthly Comp: <strong className="text-gold">${monthlyPay.toLocaleString()}/mo</strong> (${annualPay.toLocaleString()}/yr)</span>
            ) : (
              <span className="text-scarlet">Unrated (Potential $3,737+/mo Available)</span>
            )}
          </div>
        </div>
      </div>

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
          {/* TAB 0: SUMMARY & FINANCIAL VALUE UNLOCKED                     */}
          {/* ============================================================ */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* Header Hero Banner */}
              <div className="bg-gradient-to-r from-red-950/70 via-steel-dark to-steel-dark border border-scarlet/40 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
                <div className="absolute -right-10 -top-10 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none"/>
                <div className="relative z-10 space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-mono font-bold uppercase tracking-wider">
                    <BarChart3 size={13}/> Real-Time Benefit & Savings Ledger
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-sand">
                    Total Value & <span className="text-gold">Financial Freedom Summary</span>
                  </h2>
                  <p className="text-sand/70 text-sm max-w-2xl leading-relaxed">
                    Here is the cumulative financial impact of your completed military benefits, tax-free compensation, state tax exemptions, and health coverage. Check off items as you complete them to watch your total grow.
                  </p>
                </div>
              </div>

              {/* Top 4 Financial Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-steel/20 border border-steel/50 rounded-2xl p-4 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-sand/50">
                    <span>Tax-Free Annual Cash</span>
                    <DollarSign size={14} className="text-gold"/>
                  </div>
                  <div className="text-2xl font-black text-gold font-mono">
                    ${finSummary.totalAnnualCashIncome.toLocaleString()}
                    <span className="text-xs text-sand/40 font-normal"> /yr</span>
                  </div>
                  <div className="text-[11px] text-sand/50">
                    ${(Math.round(finSummary.totalAnnualCashIncome / 12)).toLocaleString()}/mo guaranteed income
                  </div>
                </div>

                <div className="bg-steel/20 border border-steel/50 rounded-2xl p-4 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-sand/50">
                    <span>Annual Savings & Shields</span>
                    <ShieldAlert size={14} className="text-scarlet"/>
                  </div>
                  <div className="text-2xl font-black text-sand font-mono">
                    ${finSummary.annualSavingsAndDiscounts.toLocaleString()}
                    <span className="text-xs text-sand/40 font-normal"> /yr</span>
                  </div>
                  <div className="text-[11px] text-sand/50">
                    Taxes, healthcare premiums & groceries saved
                  </div>
                </div>

                <div className="bg-steel/20 border border-gold/40 rounded-2xl p-4 flex flex-col justify-between space-y-2 shadow-lg bg-gold/5">
                  <div className="flex items-center justify-between text-xs font-mono text-gold font-bold">
                    <span>Combined Annual Value</span>
                    <Sparkles size={14} className="text-gold"/>
                  </div>
                  <div className="text-2xl font-black text-gold font-mono">
                    ${finSummary.totalAnnualCombinedValue.toLocaleString()}
                    <span className="text-xs text-sand/40 font-normal"> /yr</span>
                  </div>
                  <div className="text-[11px] text-gold/80">
                    Cash + annual expenses eliminated
                  </div>
                </div>

                <div className="bg-steel/20 border border-steel/50 rounded-2xl p-4 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-sand/50">
                    <span>20-Yr Wealth Projection</span>
                    <TrendingUp size={14} className="text-gold"/>
                  </div>
                  <div className="text-2xl font-black text-sand font-mono">
                    ${finSummary.twentyYearWealthImpact.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-sand/50">
                    10-Yr: ${finSummary.tenYearWealthImpact.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Upfront Grants & Waivers Banner if any unlocked */}
              {finSummary.upfrontGrantsUnlocked > 0 && (
                <div className="bg-steel/20 border border-gold/30 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Award className="text-gold" size={24}/>
                    <div>
                      <div className="font-black text-sm text-sand">One-Time Upfront Grants & Waivers Claimed:</div>
                      <div className="text-xs text-sand/60">VA Loan Funding Fee Waivers, SAH Housing or Automobile Grants</div>
                    </div>
                  </div>
                  <div className="text-xl font-black text-gold font-mono">
                    +${finSummary.upfrontGrantsUnlocked.toLocaleString()}
                  </div>
                </div>
              )}

              {/* Active / Completed Items Breakdown List */}
              <div className="bg-steel/20 border border-steel/50 rounded-2xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-steel/40 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-sand uppercase tracking-tight">
                      Your Active Claimed Benefits & Shields
                    </h3>
                    <p className="text-sand/50 text-xs mt-0.5">
                      Items marked as completed across your dashboard and planner. Click to toggle status.
                    </p>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold font-bold">
                    {Object.values(completedBenefits).filter(Boolean).length} Active Benefits
                  </span>
                </div>

                <div className="space-y-2.5">
                  {/* List of completed action steps & perks */}
                  {[...ALL_DYNAMIC_STEPS, ...SPECIAL_PERKS]
                    .filter(item => completedBenefits[item.id])
                    .map((item, idx) => (
                      <div key={idx} className="bg-steel-dark/70 border border-steel/40 hover:border-gold/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleBenefitCompleted(item.id)}
                            className="w-5 h-5 rounded-md bg-gold border border-gold text-steel-dark flex items-center justify-center flex-shrink-0 mt-0.5"
                            title="Click to unmark"
                          >
                            <CheckSquare size={13} />
                          </button>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-sand">{item.title}</span>
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-steel text-sand/60">
                                {item.category || item.badge}
                              </span>
                            </div>
                            <div className="text-xs text-sand/50 mt-0.5">
                              {item.action || item.summary?.slice(0, 100) + '...'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center font-mono">
                          <span className="text-xs font-black text-gold bg-gold/10 border border-gold/20 px-2.5 py-1 rounded-lg whitespace-nowrap">
                            {item.value || (item.annualValue ? `$${item.annualValue.toLocaleString()}/yr` : 'Active')}
                          </span>
                        </div>
                      </div>
                    ))}

                  {Object.values(completedBenefits).filter(Boolean).length === 0 && (
                    <div className="p-8 text-center text-sand/40 font-mono text-xs border border-dashed border-steel/40 rounded-xl">
                      No benefits marked as completed yet. Explore the Planner or Perks tab and click "Mark as Completed" on any benefit you have already claimed!
                    </div>
                  )}
                </div>
              </div>

              {/* Next Highest Value Opportunities To Unlock */}
              <div className="bg-steel/20 border border-steel/50 rounded-2xl p-6 space-y-4">
                <div className="border-b border-steel/40 pb-3">
                  <h3 className="text-lg font-black text-sand uppercase tracking-tight flex items-center gap-2">
                    <Target size={18} className="text-scarlet"/>
                    Next Unclaimed High-Value Opportunities
                  </h3>
                  <p className="text-sand/50 text-xs mt-0.5">
                    Benefits you qualify for that haven't been claimed yet. Click "Mark Completed" once you finish applying to update your numbers.
                  </p>
                </div>

                <div className="grid gap-3">
                  {[...ALL_DYNAMIC_STEPS, ...SPECIAL_PERKS]
                    .filter(item => !completedBenefits[item.id] && (!item.showWhen || item.showWhen({ currentRating, dischargeType, yearsOfService, servedPost911, exposedBurnPit, alreadyOut, hasDependents, separationMonths, selectedState })))
                    .slice(0, 5)
                    .map((item, idx) => (
                      <div key={idx} className="bg-steel-dark/40 border border-steel/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="font-bold text-sm text-sand">{item.title}</div>
                          <div className="text-xs text-sand/50 mt-0.5">{item.why || item.summary?.slice(0, 90) + '...'}</div>
                          <div className="text-xs font-mono text-gold font-bold mt-1">Est. Value: {item.value}</div>
                        </div>
                        <button
                          onClick={() => toggleBenefitCompleted(item.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-steel-dark border border-steel/60 hover:border-gold hover:text-gold text-sand/70 transition-all whitespace-nowrap self-start sm:self-center flex items-center gap-1.5"
                        >
                          <Plus size={12}/> Mark as Claimed
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 1: LIFE & WEALTH PLANNER (DEEPLY PERSONALIZED)           */}
          {/* ============================================================ */}
          {activeTab === 'planner' && (
            <div className="space-y-6">
              {/* Header / Mode Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-steel/40 pb-4">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Tailored Life & Wealth Planner</h2>
                  <p className="text-sand/50 text-sm">
                    {currentRating === 100 ? (
                      <span className="text-gold font-bold">Personalized for 100% P&T Veteran: Initial claim steps removed. Showing wealth maximization, tax shields, and family benefits.</span>
                    ) : (
                      <span>Personalized for {bd.name} ({currentRating > 0 ? `${currentRating}% rated` : 'Unrated'}, {alreadyOut ? 'Separated' : `${separationMonths}mo to ${bd.sep}`}).</span>
                    )}
                  </p>
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

              {/* Personalization Context Card */}
              <div className="bg-steel/20 border border-steel/50 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-gold font-bold">Active Configuration:</span>
                  <span className="text-sand/70">{bd.name} - {dischargeType.toUpperCase()} - {alreadyOut ? 'Veteran' : `${separationMonths}mo to ${bd.sep}`} - {selectedState.toUpperCase()} - {hasDependents.replace('_',' ')}</span>
                </div>
                <button onClick={()=>setCurrentPage('wizard')} className="text-gold hover:underline">
                  Adjust Settings
                </button>
              </div>

              {/* SUB-MODE A: GOAL-DRIVEN BLUEPRINT */}
              {plannerMode === 'goals' && (<>
                {!planGenerated ? (<>
                  <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 text-sm text-sand/70">
                    Select your goals below. The planner dynamically filters out redundant actions and highlights high-leverage steps for your situation.
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
                    <button onClick={()=>setPlanGenerated(true)}
                      className="w-full py-3 bg-scarlet hover:bg-red-800 text-sand font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2">
                      Generate Tailored Blueprint ({lifeGoals.length} goal{lifeGoals.length!==1?'s':''} selected) <ChevronRight size={16}/>
                    </button>
                  )}
                </>) : (<>
                  {/* Generated Dynamic Personalized Roadmap */}
                  <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="font-mono text-xs uppercase tracking-widest text-gold font-bold">
                        {currentRating === 100 ? '100% P&T Maximization Blueprint' : 'Customized Veteran Action Blueprint'}
                      </div>
                      <div className="text-sm text-sand/60 mt-0.5">
                        {dynamicRoadmap.length} tailored action items generated. Redundant steps (like basic claim filing) automatically removed.
                      </div>
                    </div>
                    <button
                      onClick={()=>setShowEmailModal(true)}
                      className="text-xs bg-steel-dark border border-gold/40 text-gold px-3 py-1.5 rounded-lg hover:bg-gold/10 font-mono transition-all">
                      Save / Email Plan
                    </button>
                  </div>

                  <div className="space-y-3">
                    {dynamicRoadmap.map((step, i) => {
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
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                              <div className="text-xs font-mono">
                                <span className="text-sand/40">Est. Value: </span>
                                <span className="text-gold font-bold">{step.value}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => toggleBenefitCompleted(step.id)}
                                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                                    completedBenefits[step.id]
                                      ? 'bg-gold text-steel-dark border border-gold shadow-md'
                                      : 'bg-steel-dark border border-steel/60 text-sand/60 hover:text-sand hover:border-gold/40'
                                  }`}
                                >
                                  <CheckSquare size={12} />
                                  {completedBenefits[step.id] ? ' Claimed / Completed' : 'Mark as Completed'}
                                </button>
                                {step.link && (
                                  <a href={step.link} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-xs text-scarlet hover:text-red-400 transition-colors font-mono uppercase tracking-wider">
                                    Take Action <ExternalLink size={10}/>
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button onClick={()=>setPlanGenerated(false)}
                      className="text-xs text-sand/40 hover:text-sand/70 transition-colors flex items-center gap-1 font-mono uppercase tracking-wider">
                      <X size={12}/> Select Different Goals
                    </button>
                    <button onClick={()=>saveProfileToStorage()}
                      className="text-xs text-gold hover:underline font-mono">
                       Save Progress to Device
                    </button>
                  </div>
                </>)}
              </>)}

              {/* SUB-MODE B: 5-STAGE GOLDEN STACKING PROTOCOL */}
              {plannerMode === 'protocol' && (
                <div className="space-y-6">
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
          {activeTab === 'househack' && (() => {
            const hhCalc = calcEnhancedHouseHack();
            const { stateData } = hhCalc;
            return (
              <div className="space-y-6">
                {/* Header */}
                <div className="bg-steel/20 border border-steel/50 rounded-2xl p-6">
                  <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold mb-1">
                    <Home size={14}/> VA Multi-Family House Hacker Engine
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-sand">
                    State-Graded <span className="text-gold">Real Estate Intelligence</span>
                  </h2>
                  <p className="text-sand/60 text-sm mt-1 max-w-2xl leading-relaxed">
                    The VA loan lets you buy a 2-4 unit property with $0 down and live in one unit while tenants pay your mortgage. If you are 10%+ service-connected, the VA funding fee ($5k-$15k) is completely WAIVED. Select your target state to see the exact math.
                  </p>
                </div>

                {/* State Grade Selector Grid */}
                <div className="bg-steel/20 border border-steel/50 rounded-2xl p-5 space-y-4">
                  <h3 className="font-black text-sm uppercase tracking-wider text-sand">
                    Step 1: Choose Your Target State <span className="text-sand/50 font-normal text-xs">(graded A+ to C by VA house hacking opportunity)</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {STATE_GRADES.map(s => (
                      <button
                        key={s.abbr}
                        onClick={() => setHhState(s.abbr)}
                        className={`rounded-xl border p-3 text-left transition-all ${
                          hhState === s.abbr
                            ? 'border-gold bg-gold/10 shadow-lg'
                            : 'border-steel/40 bg-steel-dark/50 hover:border-gold/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-black text-sm text-sand">{s.abbr}</span>
                          <span className={`text-xs font-black px-1.5 py-0.5 rounded border ${s.badgeColor} ${s.gradeColor}`}>{s.grade}</span>
                        </div>
                        <div className="text-[10px] text-sand/50 leading-tight">{s.state}</div>
                        <div className="text-[10px] font-mono text-gold mt-1">${s.avgRent2br}/mo avg 2br rent</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected State Deep-Dive */}
                {stateData && (
                  <div className={`border rounded-2xl p-5 space-y-4 ${stateData.badgeColor}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-xl text-sand">{stateData.state}</h3>
                          <span className={`text-lg font-black ${stateData.gradeColor}`}>{stateData.grade}</span>
                        </div>
                        <p className="text-xs text-sand/60 mt-0.5">{stateData.stateTaxClimate}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-sand/40 font-mono">Median Home Price</div>
                        <div className="text-lg font-black text-gold">${stateData.medianHomePrice.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* State Secret Tip */}
                    <div className="bg-steel-dark/60 border border-gold/20 rounded-xl p-4 space-y-1.5">
                      <div className="text-xs font-mono font-black text-gold uppercase flex items-center gap-1.5"><Sparkles size={12}/> State Intelligence & Hidden Secrets:</div>
                      <p className="text-xs text-sand/80 leading-relaxed">{stateData.secretTip}</p>
                    </div>

                    {/* Key Highlights */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {stateData.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-sand/80">
                          <CheckSquare size={12} className="text-gold flex-shrink-0"/>
                          {h}
                        </div>
                      ))}
                    </div>

                    {/* Military Bases & Top Rental Markets */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-mono uppercase text-sand/40 font-bold">Military Installations Driving Rental Demand:</div>
                        {stateData.militaryBases.map((b, i) => (
                          <div key={i} className="text-xs text-sand/70 flex items-center gap-1.5">
                            <span className="text-scarlet">></span>{b}
                          </div>
                        ))}
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-mono uppercase text-sand/40 font-bold">Top Rental Markets in State:</div>
                        {stateData.topRentalMarkets.map((m, i) => (
                          <div key={i} className="text-xs text-sand/70 flex items-center gap-1.5">
                            <span className="text-gold">></span>{m}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Calculator Inputs */}
                <div className="bg-steel/20 border border-steel/50 rounded-2xl p-5 space-y-4">
                  <h3 className="font-black text-sm uppercase tracking-wider text-sand">Step 2: Configure Your Deal</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-sand/60 font-mono">Purchase Price</label>
                      <input
                        type="number"
                        value={hhPrice}
                        onChange={e => setHhPrice(Number(e.target.value))}
                        className="w-full bg-steel-dark border border-steel/60 rounded-lg px-3 py-2 text-sm text-sand focus:outline-none focus:border-gold/50"
                      />
                      <div className="text-[10px] text-sand/40">Median in {stateData?.state}: ${stateData?.medianHomePrice.toLocaleString()}</div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-sand/60 font-mono">Number of Units</label>
                      <div className="flex gap-2">
                        {[2,3,4].map(u => (
                          <button
                            key={u}
                            onClick={() => setHhUnits(u)}
                            className={`flex-1 py-2 rounded-lg text-sm font-black border transition-all ${
                              hhUnits === u ? 'bg-gold text-steel-dark border-gold' : 'bg-steel-dark border-steel/60 text-sand/70 hover:border-gold/40'
                            }`}
                          >
                            {u}-Plex
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-sand/60 font-mono">Interest Rate: {hhRate}%</label>
                      <input
                        type="range" min="5" max="9" step="0.05"
                        value={hhRate}
                        onChange={e => setHhRate(Number(e.target.value))}
                        className="w-full accent-gold"
                      />
                      <div className="flex justify-between text-[10px] text-sand/40"><span>5%</span><span>9%</span></div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-sand/60 font-mono">Down Payment: {hhDownPct}%</label>
                      <div className="flex gap-2">
                        {[0, 3.5, 5, 10].map(p => (
                          <button
                            key={p}
                            onClick={() => setHhDownPct(p)}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                              hhDownPct === p ? 'bg-gold text-steel-dark border-gold' : 'bg-steel-dark border-steel/60 text-sand/70 hover:border-gold/40'
                            }`}
                          >
                            {p}%
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-sand/60 font-mono">Monthly Insurance Estimate</label>
                      <input
                        type="number"
                        value={hhInsurance}
                        onChange={e => setHhInsurance(Number(e.target.value))}
                        className="w-full bg-steel-dark border border-steel/60 rounded-lg px-3 py-2 text-sm text-sand focus:outline-none focus:border-gold/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-sand/60 font-mono">VA Funding Fee Status</label>
                      <button
                        onClick={() => setHhIsVeteranExempt(!hhIsVeteranExempt)}
                        className={`w-full py-2 rounded-lg text-xs font-bold border transition-all ${
                          hhIsVeteranExempt ? 'bg-gold text-steel-dark border-gold' : 'bg-steel-dark border-steel/60 text-sand/70 hover:border-gold/40'
                        }`}
                      >
                        {hhIsVeteranExempt ? '10%+ SC Rating: Funding Fee WAIVED' : 'No SC Rating: Fee Applies (~1.25%)'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Results Dashboard */}
                <div className="bg-steel/20 border border-steel/50 rounded-2xl p-5 space-y-4">
                  <h3 className="font-black text-sm uppercase tracking-wider text-sand flex items-center gap-2">
                    <DollarSign size={16} className="text-gold"/> Step 3: Your Deal Analysis
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="bg-steel-dark/60 border border-steel/40 rounded-xl p-4 space-y-1">
                      <div className="text-[10px] font-mono text-sand/40 uppercase">Loan Amount</div>
                      <div className="text-xl font-black text-sand">${Math.round(hhCalc.totalLoan).toLocaleString()}</div>
                      <div className="text-[10px] text-sand/50">
                        {hhCalc.fundingFee > 0
                          ? `Includes $${Math.round(hhCalc.fundingFee).toLocaleString()} funding fee`
                          : 'Funding fee WAIVED (0%)'}
                      </div>
                    </div>

                    <div className="bg-steel-dark/60 border border-steel/40 rounded-xl p-4 space-y-1">
                      <div className="text-[10px] font-mono text-sand/40 uppercase">Monthly PITI</div>
                      <div className="text-xl font-black text-sand">${Math.round(hhCalc.piti).toLocaleString()}/mo</div>
                      <div className="text-[10px] text-sand/50">
                        P&I ${Math.round(hhCalc.pAndI).toLocaleString()} + Tax ${Math.round(hhCalc.monthlyTax).toLocaleString()} + Ins ${Math.round(hhCalc.monthlyInsurance).toLocaleString()}
                        {hhIsVeteranExempt && stateData?.landlordFriendly && <span className="text-gold"> (Property tax EXEMPT)</span>}
                      </div>
                    </div>

                    <div className="bg-steel-dark/60 border border-steel/40 rounded-xl p-4 space-y-1">
                      <div className="text-[10px] font-mono text-sand/40 uppercase">Gross Rental Income ({hhCalc.rentingUnits} units)</div>
                      <div className="text-xl font-black text-gold">${Math.round(hhCalc.grossRent).toLocaleString()}/mo</div>
                      <div className="text-[10px] text-sand/50">${hhCalc.rentPerUnit.toLocaleString()}/unit avg in {stateData?.state}</div>
                    </div>

                    <div className="bg-steel-dark/60 border border-steel/40 rounded-xl p-4 space-y-1">
                      <div className="text-[10px] font-mono text-sand/40 uppercase">Net Rent (after 5% vacancy + 8% reserve)</div>
                      <div className="text-xl font-black text-sand">${Math.round(hhCalc.netRent).toLocaleString()}/mo</div>
                    </div>

                    <div className={`border rounded-xl p-4 space-y-1 ${hhCalc.netCashFlow >= 0 ? 'bg-emerald-950/40 border-emerald-500/40' : 'bg-red-950/40 border-red-500/40'}`}>
                      <div className="text-[10px] font-mono text-sand/40 uppercase">Monthly Cash Flow</div>
                      <div className={`text-xl font-black ${hhCalc.netCashFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {hhCalc.netCashFlow >= 0 ? '+' : ''}${Math.round(hhCalc.netCashFlow).toLocaleString()}/mo
                      </div>
                      <div className="text-[10px] text-sand/50">
                        {hhCalc.netCashFlow >= 0 ? 'Positive  -  tenants paying + PROFIT' : 'Vet covers the gap'}
                      </div>
                    </div>

                    <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 space-y-1">
                      <div className="text-[10px] font-mono text-gold uppercase font-bold">Your Effective Housing Cost</div>
                      <div className="text-xl font-black text-gold">${Math.round(hhCalc.effectiveHousingCost).toLocaleString()}/mo</div>
                      <div className="text-[10px] text-sand/50">What you personally pay to live here after rent income</div>
                    </div>
                  </div>

                  {/* DSCR and Equity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="bg-steel-dark/50 border border-steel/40 rounded-xl p-4">
                      <div className="text-[10px] font-mono text-sand/40 uppercase mb-1">Debt Service Coverage Ratio (DSCR)</div>
                      <div className={`text-2xl font-black ${hhCalc.dscr >= 1 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {hhCalc.dscr.toFixed(2)}x
                      </div>
                      <div className="text-[10px] text-sand/50 mt-1">
                        {hhCalc.dscr >= 1.25 ? "Strong - lenders love this deal" : hhCalc.dscr >= 1 ? "Breakeven or better" : "Rents don't fully cover PITI - consider a different market or more units"}
                      </div>
                    </div>

                    <div className="bg-steel-dark/50 border border-steel/40 rounded-xl p-4">
                      <div className="text-[10px] font-mono text-sand/40 uppercase mb-1">5-Year Equity Accumulation</div>
                      <div className="text-2xl font-black text-gold">${Math.round(hhCalc.fiveYearEquity).toLocaleString()}</div>
                      <div className="text-[10px] text-sand/50 mt-1">Via appreciation (4%/yr) + mortgage principal paydown</div>
                    </div>
                  </div>
                </div>

                {/* Hidden Secrets Section */}
                <div className="bg-steel/20 border border-steel/50 rounded-2xl p-5 space-y-4">
                  <h3 className="font-black text-sm uppercase tracking-wider text-sand flex items-center gap-2">
                    <Sparkles size={16} className="text-gold"/> VA Loan Secrets Most Veterans Never Know
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { title: 'The Duplex Loophole (0% Down, 2-4 Units)', body: 'The VA loan is the only loan type that funds a 2, 3, or 4-unit investment property with ZERO down payment  -  as long as you occupy one unit as your primary residence. A standard FHA loan requires 3.5% down on a duplex and still requires owner-occupancy. A conventional investment loan requires 20-25% down. The VA gives you the keys for $0.' },
                      { title: 'Service-Connected Rating = $0 Funding Fee', body: 'The VA Funding Fee on a 0%-down first-time purchase is 2.15% of the loan amount ($6,450 on a $300k loan). Veterans with ANY service-connected disability rating of 10% or more have this fee completely WAIVED by law  -  that is money directly back in your pocket at closing.' },
                      { title: 'The IRRRL Streamline Refi', body: 'When interest rates drop, use the VA Interest Rate Reduction Refinance Loan (IRRRL) to lower your rate with NO income verification, NO appraisal, and NO home inspection required. Closing costs can be rolled into the new loan. Many veterans refinanced from 7% to 5.5% saving $300-$800/month with zero out-of-pocket costs.' },
                      { title: 'VA Loan Entitlement is REUSABLE', body: 'Your VA loan entitlement does not disappear after first use. After selling your home and paying off the VA loan, your full entitlement is restored and you can buy again with $0 down. Some veterans use bonus entitlement to hold TWO properties simultaneously in different states  -  one active and one retained as a rental.' },
                      { title: "The CA Benefits + TX Domicile Play", body: "California veteran benefits (CalVet home loans, CalVet life insurance, Medi-Cal for veterans) are tied to state residency - NOT to where you physically live. Some veterans establish legal domicile in Texas or Florida (get a TX/FL driver's license, register vehicles there, vote there) for the $0 property tax benefit while maintaining CA state benefits enrollment. This is legal  -  consult a veteran-focused tax attorney for your specific situation." },
                      { title: 'BAH As Rental Qualification Income', body: 'If you are still on active duty, VA lenders count your Basic Allowance for Housing (BAH) as stable income for mortgage qualification  -  even though BAH is tax-free. This significantly boosts your loan ceiling. A Texas E-7 with family receives $2,196/mo BAH in San Antonio which counts toward qualifying income on a VA loan application.' }
                    ].map((secret, idx) => (
                      <div key={idx} className="bg-steel-dark/60 border border-steel/40 rounded-xl p-4 space-y-1.5">
                        <div className="font-bold text-xs text-gold">{secret.title}</div>
                        <p className="text-xs text-sand/70 leading-relaxed">{secret.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ============================================================ */}
          {/* TAB 3: CLAIMS & C&P EXAM PRACTICE SIMULATOR + SMC MATRIX     */}
          {/* ============================================================ */}
          {activeTab === 'claims' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Claims, C&P Exam Sim & SMC Matrix</h2>
                <p className="text-sand/50 text-sm">Practice DBQ exam scenarios, master VA math, explore secondary chains, and learn Special Monthly Compensation.</p>
              </div>

              {/* Sub-nav */}
              <div className="flex flex-wrap gap-2">
                {[
                  {id:'math',       label:'VA Math Simulator'},
                  {id:'smc',        label:'Special Monthly Comp (SMC)'},
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

              {/* SUB-TAB 1: VA MATH WITH BILATERAL FACTOR */}
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

                  <div className="p-4 bg-gold/5 border border-gold/20 rounded-xl text-xs text-sand/70 leading-relaxed">
                    <span className="font-bold text-gold font-mono uppercase">The Bilateral Factor Secret: </span>
                    If you have service-connected disabilities affecting paired extremities (e.g. left knee + right knee, or left arm + right arm), the VA combines them first and adds a <span className="text-gold font-bold">10% bilateral bonus</span> to that subtotal before combining with other body systems. This often pushes 84% to 90% or 94% to 100%!
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: SPECIAL MONTHLY COMPENSATION (SMC) */}
              {claimsSubTab === 'smc' && (
                <div className="space-y-4">
                  <div className="bg-steel/20 border border-steel/50 rounded-2xl p-5">
                    <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold mb-1">
                      <Sparkles size={14}/> Advanced VA Benefit Tier
                    </div>
                    <h3 className="text-xl font-black text-sand uppercase tracking-tight">Special Monthly Compensation (SMC) Matrix</h3>
                    <p className="text-sand/60 text-xs mt-1">
                      SMC provides tax-free payments above standard 100% rates for specific anatomical losses, Aid & Attendance, or having multiple severe disabilities.
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {SMC_DATA.map((smc, i)=>(
                      <div key={i} className="bg-steel/20 border border-steel/50 rounded-xl p-4 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-steel/40 pb-2">
                          <div className="font-black text-base text-gold flex items-center gap-2">
                            <span className="bg-steel-dark border border-gold/30 px-2 py-0.5 rounded text-xs font-mono">{smc.level}</span>
                            <span>{smc.title}</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-sand bg-scarlet/20 border border-scarlet/40 px-2 py-1 rounded">
                            {smc.rate2026}
                          </span>
                        </div>
                        <p className="text-xs text-sand/80 leading-relaxed">{smc.desc}</p>
                        <div className="p-2 bg-steel-dark/60 rounded-lg text-[11px] text-sand/50 font-mono">
                          <span className="text-gold font-bold">Criteria: </span>{smc.criteria}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB 3: C&P EXAM PRACTICE SIMULATOR */}
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

              {/* SUB-TAB 4: SECONDARY STACKING */}
              {claimsSubTab === 'secondaries' && (
                <div className="space-y-3">
                  <p className="text-sand/60 text-sm">Secondary claims are conditions caused or aggravated by an already-rated condition. You only prove the link to your rated condition, not to military service.</p>
                  {[
                    {primary:'PTSD / Anxiety / Depression',  secondaries:['Sleep Apnea (50% auto with CPAP)','GERD','Hypertension','Erectile Dysfunction (SMC-K +$139/mo)','Migraines','Chronic Fatigue']},
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

              {/* SUB-TAB 5: DIAGNOSTIC LEXICON */}
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

              {/* SUB-TAB 6: PACT ACT */}
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

              {/* SUB-TAB 7: TDIU */}
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
          {/* TAB 4: HIGH-VALUE PERKS (SPACE-A, DENTAL, ADAPTIVE GRANTS)    */}
          {/* ============================================================ */}
          {activeTab === 'perks' && (
            <div className="space-y-6">
              <div className="bg-steel/20 border border-steel/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold mb-1">
                  <Sparkles size={14} /> Comprehensive Veteran Entitlements
                </div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-sand">
                  High-Value <span className="text-gold">Hidden Perks & Grants</span>
                </h2>
                <p className="text-sand/60 text-sm mt-1 max-w-2xl leading-relaxed">
                  Most veterans only know about monthly disability compensation. Below is the ultimate deep-dive guide to free international military flights, $117k adaptive housing grants, free comprehensive dental pathways, and lifetime tax-free shopping.
                </p>
              </div>

              {/* Category Quick Filter */}
              <div className="grid gap-6">
                {SPECIAL_PERKS.map((perk)=>(
                  <div key={perk.id} className="bg-steel/20 border border-steel/50 rounded-2xl p-6 space-y-5 transition-all hover:border-gold/40 shadow-xl">
                    
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-steel/40 pb-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-gold/10 border border-gold/30 text-gold font-bold">
                            {perk.badge}
                          </span>
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-steel-dark text-sand/60 border border-steel/40">
                            {perk.formNumber}
                          </span>
                        </div>
                        <h3 className="font-black text-xl text-sand tracking-tight">
                          {perk.title}
                        </h3>
                      </div>
                      <div className="bg-scarlet/15 border border-scarlet/40 px-3 py-1.5 rounded-xl text-right self-start md:self-auto">
                        <div className="text-[10px] font-mono uppercase text-sand/50">Estimated Value</div>
                        <div className="text-sm font-black text-sand">{perk.value}</div>
                      </div>
                    </div>

                    {/* Summary */}
                    <p className="text-sm text-sand/80 leading-relaxed font-normal">
                      {perk.summary}
                    </p>

                    {/* Eligibility & Criteria */}
                    <div className="bg-steel-dark/60 border border-steel/40 rounded-xl p-4 space-y-2">
                      <div className="text-xs font-mono uppercase tracking-wider text-gold font-bold flex items-center gap-1.5">
                        <CheckCircle size={13} /> Strict Eligibility Criteria:
                      </div>
                      <ul className="space-y-1.5 text-xs text-sand/70">
                        {perk.eligibility.map((el, i)=>(
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-gold font-black">-</span>
                            <span>{el}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Step by Step Walkthrough */}
                    <div className="space-y-3">
                      <div className="text-xs font-mono uppercase tracking-wider text-sand/50 font-bold">
                        Step-by-Step How to Apply & Access:
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {perk.stepByStep.map((s, idx)=>(
                          <div key={idx} className="bg-steel-dark/40 border border-steel/40 rounded-xl p-3.5 flex flex-col justify-between">
                            <div className="font-bold text-xs text-gold mb-1">{s.step}</div>
                            <p className="text-xs text-sand/70 leading-relaxed">{s.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Required Documents & Pro Tip Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="bg-steel-dark/60 border border-steel/40 rounded-xl p-4 space-y-1.5">
                        <div className="text-xs font-mono text-gold font-bold uppercase">Required Documentation:</div>
                        <ul className="text-xs text-sand/60 space-y-1 font-mono">
                          {perk.requiredDocs.map((doc, dIdx)=>(
                            <li key={dIdx}>- {doc}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 flex flex-col justify-between">
                        <div>
                          <div className="text-xs font-mono text-gold font-black uppercase mb-1">Insider Pro-Tip:</div>
                          <p className="text-xs text-sand/80 leading-relaxed">{perk.proTip}</p>
                        </div>
                        <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gold/20">
                          <button
                            onClick={() => toggleBenefitCompleted(perk.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                              completedBenefits[perk.id]
                                ? 'bg-gold text-steel-dark border border-gold shadow-md'
                                : 'bg-steel-dark border border-steel/60 text-sand/60 hover:text-sand hover:border-gold/40'
                            }`}
                          >
                            <CheckSquare size={12} />
                            {completedBenefits[perk.id] ? 'Claimed & Active' : 'Mark Benefit Claimed'}
                          </button>
                          {perk.officialLink && (
                            <a
                              href={perk.officialLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-scarlet hover:text-red-400 font-mono font-bold uppercase tracking-wider transition-colors"
                            >
                              Official Portal & Application Instructions <ExternalLink size={11} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 5: MEDICAL FILE SCANNER                                  */}
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
                    {/* ============================================================ */}
          {/* TAB 6: UNEXPLORED AVENUES                                    */}
          {/* ============================================================ */}
          {activeTab === 'avenues' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-steel/20 border border-steel/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold mb-1">
                  <Compass size={14}/> Life Path Intelligence
                </div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-sand">
                  Veteran Life <span className="text-gold">Avenues & Playbooks</span>
                </h2>
                <p className="text-sand/60 text-sm mt-1 max-w-2xl leading-relaxed">
                  Every avenue below is a fully-built financial playbook. Click any route to open the complete deep-dive: stacking strategies, exact dollar amounts, specific schools, hiring hacks, and the things nobody in transition brief ever told you.
                </p>
              </div>

              {/* Avenue Cards Accordion */}
              <div className="space-y-3">
                {AVENUES_DATA.map(avenue => {
                  const isOpen = expandedAvenue === avenue.id;
                  const isEligible = avenue.eligibleFor.includes('any') ||
                    (avenue.eligibleFor.includes('100pt') && currentRating === '100');
                  return (
                    <div
                      key={avenue.id}
                      className={`rounded-2xl border transition-all ${
                        isOpen
                          ? 'border-gold/60 bg-steel/30 shadow-xl shadow-gold/5'
                          : 'border-steel/50 bg-steel/20 hover:border-gold/30'
                      }`}
                    >
                      {/* Accordion Header  -  Always Visible */}
                      <button
                        className="w-full text-left p-5 flex items-center justify-between gap-4"
                        onClick={() => setExpandedAvenue(isOpen ? null : avenue.id)}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{avenue.icon}</span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-black text-lg text-sand">{avenue.title}</h3>
                              {!isEligible && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold/10 border border-gold/30 text-gold">100% P&T Only</span>
                              )}
                            </div>
                            <p className="text-xs text-sand/60 mt-0.5 max-w-xl">{avenue.tagline}</p>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <DollarSign size={11} className="text-gold"/>
                              <span className="text-xs font-mono text-gold font-bold">${avenue.totalMonthlyEstimate}/mo estimated income range</span>
                            </div>
                          </div>
                        </div>
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                          isOpen ? 'border-gold bg-gold text-steel-dark' : 'border-steel/60 text-sand/60'
                        }`}>
                          <ChevronRight size={16} className={`transition-transform ${isOpen ? 'rotate-90' : ''}`}/>
                        </div>
                      </button>

                      {/* Accordion Expanded Content */}
                      {isOpen && (
                        <div className="px-5 pb-6 space-y-5 border-t border-steel/40 pt-5">
                          {/* Overview */}
                          <div className="bg-steel-dark/60 border border-steel/40 rounded-xl p-4">
                            <div className="text-[10px] font-mono uppercase text-gold font-bold mb-1">Overview & Core Strategy:</div>
                            <p className="text-sm text-sand/80 leading-relaxed">{avenue.overview}</p>
                          </div>

                          {/* Education-only: Live Income Calculator */}
                          {avenue.id === 'education' && (
                            <div className="bg-steel-dark/60 border border-gold/20 rounded-xl p-4 space-y-3">
                              <div className="text-xs font-mono uppercase text-gold font-bold">Monthly Income Calculator While in School:</div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[10px] text-sand/50 font-mono">Your VA Rating</label>
                                  <select
                                    value={currentRating}
                                    className="w-full bg-steel border border-steel/60 rounded-lg px-2 py-1.5 text-xs text-sand focus:outline-none focus:border-gold/50"
                                    readOnly
                                  >
                                    <option>{currentRating}% (from your profile)</option>
                                  </select>
                                  <div className="text-[10px] text-sand/40">Adjust in Settings</div>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] text-sand/50 font-mono">School Mode</label>
                                  <div className="flex gap-1.5">
                                    {['inperson', 'online'].map(m => (
                                      <button
                                        key={m}
                                        onClick={() => setAvenueSchoolMode(m)}
                                        className={`flex-1 py-1.5 text-xs rounded-lg font-bold border transition-all ${
                                          avenueSchoolMode === m ? 'bg-gold text-steel-dark border-gold' : 'bg-steel-dark border-steel/60 text-sand/60'
                                        }`}
                                      >
                                        {m === 'inperson' ? 'In-Person' : 'Online'}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] text-sand/50 font-mono">Have Dependents?</label>
                                  <div className="flex gap-1.5">
                                    {[false, true].map(d => (
                                      <button
                                        key={String(d)}
                                        onClick={() => setAvenueHasDeps(d)}
                                        className={`flex-1 py-1.5 text-xs rounded-lg font-bold border transition-all ${
                                          avenueHasDeps === d ? 'bg-gold text-steel-dark border-gold' : 'bg-steel-dark border-steel/60 text-sand/60'
                                        }`}
                                      >
                                        {d ? 'Yes' : 'No'}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              {/* Output */}
                              {(() => {
                                const bah = avenueSchoolMode === 'inperson'
                                  ? (avenueHasDeps ? 2100 : 1750)
                                  : (avenueHasDeps ? 1050 : 1050);
                                const disabilityRates = {
                                  '0': 0, '10': 175.51, '20': 346.95, '30': 537.42,
                                  '40': 773.16, '50': 1100.10, '60': 1395.93,
                                  '70': 1759.19, '80': 2044.89, '90': 2297.96,
                                  '100': 3737.85
                                };
                                const vaComp = disabilityRates[currentRating] || 0;
                                const books = 83; // $1000/yr / 12
                                const total = vaComp + bah + books;
                                return (
                                  <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
                                    <div>
                                      <div className="text-[10px] text-sand/40 font-mono">VA Disability</div>
                                      <div className="text-base font-black text-sand">${vaComp.toLocaleString()}</div>
                                    </div>
                                    <div>
                                      <div className="text-[10px] text-sand/40 font-mono">GI Bill BAH {avenueSchoolMode === 'online' ? '(Online)' : '(In-Person)'}</div>
                                      <div className="text-base font-black text-gold">${bah.toLocaleString()}</div>
                                    </div>
                                    <div>
                                      <div className="text-[10px] text-sand/40 font-mono">Book Stipend</div>
                                      <div className="text-base font-black text-sand">${books}</div>
                                    </div>
                                    <div>
                                      <div className="text-[10px] text-gold font-mono font-bold uppercase">Monthly Total</div>
                                      <div className="text-lg font-black text-gold">${Math.round(total).toLocaleString()}</div>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          )}

                          {/* Sections Loop */}
                          {avenue.sections
                            .filter(s => !s.isCalculator)
                            .map((section, sIdx) => (
                              <div key={sIdx} className="space-y-3">
                                <h4 className="font-black text-sm text-gold uppercase tracking-wide border-b border-steel/40 pb-2">
                                  {section.heading}
                                </h4>
                                <div className="grid grid-cols-1 gap-3">
                                  {(section.content || []).map((item, iIdx) => (
                                    <div key={iIdx} className="bg-steel-dark/50 border border-steel/40 rounded-xl p-4 space-y-1">
                                      <div className="font-bold text-xs text-sand flex items-center gap-2">
                                        <span className="text-gold font-black">{iIdx + 1}.</span>
                                        {item.label}
                                      </div>
                                      <p className="text-xs text-sand/65 leading-relaxed pl-4">{item.detail}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 7: STATE MATRIX (EXPANDED)                               */}
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
          {/* TAB 8: MILESTONE TRACKER (FILTERED TO VETERAN STATUS)        */}
          {/* ============================================================ */}
          {activeTab === 'tracker' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-steel/40 pb-4">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Personalized Milestone Tracker</h2>
                  <p className="text-sand/50 text-sm">
                    {alreadyOut ? 'Checklist filtered for separated veterans. Irrelevant pre-separation tasks hidden.' : 'Checklist tailored for active duty transition countdown.'}
                  </p>
                </div>
                <div className="bg-steel-dark border border-steel/50 rounded-xl px-4 py-2 text-xs font-mono">
                  <span className="text-sand/50">Progress: </span>
                  <span className="text-gold font-black">
                    {filteredMilestones.filter(m=>completedMilestones[m.id]).length} / {filteredMilestones.length} Completed
                  </span>
                </div>
              </div>

              <div className="bg-steel/20 border border-steel/50 rounded-2xl p-6 space-y-3">
                {filteredMilestones.map(m=>(
                  <button key={m.id}
                    onClick={()=>{
                      const updated = {...completedMilestones,
      completedBenefits, [m.id]: !completedMilestones[m.id]};
                      setCompletedMilestones(updated);
                      // Auto-save
                      try {
                        const saved = localStorage.getItem('vbc_veteran_profile');
                        if (saved) {
                          const p = JSON.parse(saved);
                          p.completedMilestones = updated;
                          localStorage.setItem('vbc_veteran_profile', JSON.stringify(p));
                        }
                      } catch (e) {}
                    }}
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
          {/* TAB 9: DISCHARGE UPGRADE GUIDE                               */}
          {/* ============================================================ */}
          {activeTab === 'upgrade' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Discharge Upgrade Guide</h2>
                <p className="text-sand/50 text-sm">A non-honorable discharge is not the end. Many veterans successfully upgrade and unlock full benefits.</p>
              </div>
              {dischargeType === 'honorable' ? (
                <div className="bg-steel/20 border border-steel/50 rounded-xl p-4 text-sm text-sand/60">
                  You indicated an Honorable Discharge. This guide is still useful for helping fellow veterans or if any characterization issue arises.
                </div>
              ) : (
                <div className="bg-scarlet/10 border border-scarlet/40 rounded-xl p-4 text-xs text-scarlet space-y-1">
                  <div className="font-black uppercase flex items-center gap-1.5">
                    <ShieldAlert size={14}/> Upgrade Priority Activated ({dischargeType.toUpperCase()})
                  </div>
                  <div>Your discharge characterization restricts GI Bill or full VA access. Follow the 4 steps below to apply to your service branch's Discharge Review Board (DRB) or Board for Correction of Military Records (BCMR/BCNR).</div>
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
          {/* TAB 10: RESOURCES & HOTLINE DIRECTORY                        */}
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
