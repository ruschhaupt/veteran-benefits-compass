// -----------------------------------------------------------------------
// STATUTORY MISSION TIMELINE EVENTS & DEADLINES
// -----------------------------------------------------------------------
export const TIMELINE_EVENTS = [
  {
    id: 'bdd_fast_track',
    phase: 'p1',
    phaseName: 'Phase 1: Pre-Separation (T-180 to T-0)',
    timing: '180 to 90 Days Pre-Separation',
    urgency: 'critical',
    urgencyLabel: '🔴 CRITICAL TIME CLOCK',
    title: 'Benefits Delivery at Discharge (BDD) Fast-Track Claim',
    value: '+$1,759 to +$3,737/mo from Day 1',
    badge: '38 U.S.C. § 5101',
    summary: 'Submit your VA disability claim while still on active duty. VA schedules your C&P exams immediately so your rating and tax-free paycheck begin on Day 1 after discharge.',
    why: 'Filing after separation puts you in the civilian backlog (6-14 months). BDD guarantees your check starts immediately upon ETS/EAS.',
    steps: [
      'Step 1: Go to your base medical clinic and request your full, certified Service Treatment Records (STR) and dental records on CD/flash drive.',
      'Step 2: Log into VA.gov and submit VA Form 21-526EZ under the BDD program between Day 180 and Day 90 before separation.',
      'Step 3: Attend all contracted C&P exams (VES, QTC, Optum Serve). Describe your symptoms on your worst days, not your best.'
    ],
    form: 'VA Form 21-526EZ',
    formUrl: 'https://www.va.gov/find-forms/about-form-21-526ez/',
    script: 'What to tell medical: "I need a complete certified copy of all inpatient, outpatient, and mental health medical records for my BDD claim filing."'
  },
  {
    id: 'skillbridge_internship',
    phase: 'p1',
    phaseName: 'Phase 1: Pre-Separation (T-180 to T-0)',
    timing: '180 Days Pre-Separation',
    urgency: 'high',
    urgencyLabel: '🟡 CAREER ACCELERATOR',
    title: 'DoD SkillBridge Corporate Internship & Apprenticeship',
    value: 'Full Military Pay + Civilian Salary Pipeline',
    badge: 'DoD Instruction 1322.29',
    summary: 'Spend your final 180 days of active duty working full-time at a civilian corporation while still collecting 100% military base pay, BAH, and BAS.',
    why: 'Eliminates transition unemployment. Over 85% of SkillBridge participants convert directly into high-paying six-figure civilian careers.',
    steps: [
      'Step 1: Browse authorized corporate partners on the official DoD SkillBridge portal (Amazon, Microsoft, Lockheed, local trades).',
      'Step 2: Obtain Commander authorization (O-4 or above approval).',
      'Step 3: Secure formal offer letter and complete military ethics transition briefing.'
    ],
    form: 'DoD SkillBridge App',
    formUrl: 'https://skillbridge.osd.mil/program-overview.htm',
    script: 'What to tell your CO: "This program aligns with my post-service employment and I have trained my relief to ensure zero operational disruption."'
  },
  {
    id: 'intent_to_file_backpay',
    phase: 'p2',
    phaseName: 'Phase 2: Immediate Transition (Months 0 to 6)',
    timing: 'Day 1 Post-Separation',
    urgency: 'critical',
    urgencyLabel: '🔴 BACKPAY SHIELD',
    title: 'Intent to File (ITF) — Lock In Up to 12 Months of Backpay',
    value: '$15,000 to $44,000+ Retroactive Lump Sum',
    badge: '38 CFR § 3.155',
    summary: 'Submitting a simple 1-page Intent to File freezes your legal effective date for 365 days while you gather medical evidence, nexus letters, and buddy statements.',
    why: 'If your claim takes 10 months to reach 100% ($3,737/mo), having an ITF active means the VA must cut you a single tax-free backpay check of $37,370 on approval.',
    steps: [
      'Step 1: Log in to VA.gov and click "Start a new claim" (this automatically submits an Intent to File) or submit VA Form 21-0966.',
      'Step 2: You now have exactly 365 days to collect private medical records, buddy letters, and Nexus letters.',
      'Step 3: When your claim is awarded, every dollar dating back to your ITF submission is deposited into your bank account.'
    ],
    form: 'VA Form 21-0966',
    formUrl: 'https://www.va.gov/find-forms/about-form-21-0966/',
    script: 'What to do: Submit this on Day 1 after separation even if you don\'t have all your medical records ready yet!'
  },
  {
    id: 'va_free_dental_180',
    phase: 'p2',
    phaseName: 'Phase 2: Immediate Transition (Months 0 to 6)',
    timing: 'Within 180 Days of Separation',
    urgency: 'high',
    urgencyLabel: '🟡 TIME-SENSITIVE FREEBIE',
    title: 'VA 100% Free Dental Treatment Window (Class II(b))',
    value: '$2,500 to $8,000+ Free Dental Care',
    badge: '38 U.S.C. § 1712',
    summary: 'All separated veterans with 90+ days continuous active service are legally entitled to one-time 100% free comprehensive dental treatment if applied within 180 days of discharge.',
    why: 'Normally only 100% P&T veterans receive VA dental. This 180-day grace period gives any honorably separated veteran free cleanings, cavity repairs, and crowns.',
    steps: [
      'Step 1: Check your DD-214 Box 29 to verify it indicates dental care was not completed prior to separation (or apply regardless).',
      'Step 2: Contact your local VA Medical Center Dental Department within 180 days of your DD-214 separation date.',
      'Step 3: Complete VA Form 10-10EZ and schedule your comprehensive initial evaluation and treatment plan.'
    ],
    form: 'VA Form 10-10EZ',
    formUrl: 'https://www.va.gov/find-forms/about-form-10-10ez/',
    script: 'What to tell VA Dental: "I was separated within the last 180 days and I am requesting my one-time comprehensive dental evaluation under Class II(b) eligibility."'
  },
  {
    id: 'vgli_life_insurance',
    phase: 'p2',
    phaseName: 'Phase 2: Immediate Transition (Months 0 to 6)',
    timing: 'Within 240 Days of Separation',
    urgency: 'high',
    urgencyLabel: '🟡 GUARANTEED ISSUE LIFE INSURANCE',
    title: 'SGLI to VGLI Conversion — No Health Questions or Physical Exams',
    value: '$500,000 Guaranteed Life Coverage',
    badge: '38 U.S.C. § 1968',
    summary: 'Convert up to $500,000 in military SGLI life insurance to Veterans\' Group Life Insurance (VGLI) with zero medical exams, no physicals, and guaranteed issue.',
    why: 'Commercial life insurance companies routinely deny veterans or charge exorbitant rates if they have PTSD, TBI, or disability ratings. VGLI cannot deny you based on medical history.',
    steps: [
      'Step 1: Log in to the Prudential / OSGLI portal via milConnect within 240 days of separation.',
      'Step 2: Select your coverage amount (up to $500,000 in $10,000 increments).',
      'Step 3: Set up automatic bank draft to keep coverage active for life.'
    ],
    form: 'Form SGLV 8714',
    formUrl: 'https://www.va.gov/life-insurance/options-eligibility/vgli/',
    script: 'Key Rule: Apply within 240 days of discharge for 100% guaranteed approval with zero medical questions.'
  },
  {
    id: 'va_loan_house_hack',
    phase: 'p3',
    phaseName: 'Phase 3: Wealth Building (Months 6 to 24)',
    timing: 'Month 6+ Post-Separation',
    urgency: 'wealth',
    urgencyLabel: '🟢 WEALTH GENERATOR',
    title: 'VA Multi-Family House Hacking ($0 Down + Funding Fee Waived)',
    value: '$4,000 to $15,000+ Fee Waived + $0 Rent',
    badge: '38 U.S.C. § 3729',
    summary: 'Use your VA Loan to purchase a 2 to 4 unit multi-family property with $0 down payment. If you have a 10%+ VA disability rating, the 1.25% to 3.3% VA funding fee is 100% WAIVED.',
    why: 'Live in 1 unit for free while the other 1-3 tenants pay your entire mortgage and generate monthly tax-free cash flow.',
    steps: [
      'Step 1: Download your VA Certificate of Eligibility (COE) from VA.gov to prove funding fee exemption.',
      'Step 2: Connect with a military-savvy VA Loan broker to get pre-approved up to 4 units.',
      'Step 3: Run the numbers inside our VA House Hacker tab to calculate your cash flow in your target state.'
    ],
    form: 'VA Form 26-1880 (COE)',
    formUrl: 'https://www.va.gov/housing-assistance/home-loans/how-to-apply-for-coe/',
    script: 'What to tell your lender: "I am purchasing a primary multi-family residence using my VA Loan with 10%+ service-connected disability funding fee exemption."'
  },
  {
    id: 'secondary_claims_bridge',
    phase: 'p3',
    phaseName: 'Phase 3: Wealth Building (Months 6 to 24)',
    timing: 'Month 12+ Post-Separation',
    urgency: 'wealth',
    urgencyLabel: '🟢 RATING MULTIPLIER',
    title: 'High-Yield Secondary Claims Bridging (Bridge to 100% P&T)',
    value: '+$1,400 to +$2,000+/mo for Life',
    badge: '38 CFR § 3.310',
    summary: 'Claim conditions that were caused or aggravated by your existing primary service-connected disabilities (Sleep Apnea secondary to PTSD, Radiculopathy secondary to Lumbar Strain, Migraines secondary to Tinnitus).',
    why: 'Secondary claims require no in-service medical record proof — only a medical nexus showing your primary disability caused the secondary ailment.',
    steps: [
      'Step 1: Identify your primary service-connected conditions inside our VA Math & Scanner tabs.',
      'Step 2: Obtain a formal diagnosis from your private doctor or VA physician for the secondary condition.',
      'Step 3: Obtain a written Medical Nexus Letter stating the condition is "at least as likely as not (50%+ probability)" caused by your primary disability.'
    ],
    form: 'VA Form 21-526EZ',
    formUrl: 'https://www.va.gov/find-forms/about-form-21-526ez/',
    script: 'Nexus Magic Words: The doctor\'s letter must use the exact legal standard: "It is my professional medical opinion that it is at least as likely as not (50% or greater probability) that the veteran\'s [Condition] is secondary to their service-connected [Primary Disability]."'
  },
  {
    id: 'property_tax_exemption',
    phase: 'p3',
    phaseName: 'Phase 3: Wealth Building (Months 6 to 24)',
    timing: 'Upon Receiving 100% P&T (or 70%+)',
    urgency: 'wealth',
    urgencyLabel: '🟢 MASSIVE TAX SHIELD',
    title: 'County Homestead Property Tax Exemption Submission',
    value: '$4,000 to $12,000+/year Saved Permanently',
    badge: 'State Statutory Code',
    summary: 'Submit your VA Rating Decision Letter to your county tax appraisal district to wipe out 100% of property taxes on your primary residence in eligible states (Texas, Florida, Illinois, Michigan, Alabama, etc.).',
    why: 'On a $350,000 home, saving 2.2% in property taxes puts an extra $640/month ($7,700/year) directly into your pocket.',
    steps: [
      'Step 1: Download your VA Benefit Summary / Commissary Letter from VA.gov showing 100% P&T status.',
      'Step 2: Visit your County Tax Assessor-Collector or Appraisal District website.',
      'Step 3: Submit the Disabled Veteran Homestead Exemption application before the annual county filing deadline.'
    ],
    form: 'County Homestead Form',
    formUrl: 'https://www.va.gov/records/download-va-letters/',
    script: 'What to submit: Your DD-214 copy, VA Commissary / P&T Summary Letter, and state drivers license matching the property address.'
  },
  {
    id: 'rating_defense_rules',
    phase: 'p4',
    phaseName: 'Phase 4: Lifelong Protection (Years 2 to Forever)',
    timing: 'Continuous Protection',
    urgency: 'defense',
    urgencyLabel: '🛡️ LEGAL SHIELD',
    title: 'The 5-Year, 10-Year, and 20-Year VA Rating Protection Rules',
    value: 'Permanent Lifetime Compensation Defense',
    badge: '38 CFR § 3.951 & § 3.327',
    summary: 'Federal law strictly protects your disability rating from arbitrary reductions over time through three statutory grandfathering rules.',
    why: 'Veterans fear VA reduction audits. Knowing the law ensures you never lose sleep over your monthly income.',
    steps: [
      '5-Year Rule (38 CFR § 3.327): The VA cannot reduce a rating on a single re-evaluation unless they prove sustained, long-term material improvement under everyday life conditions.',
      '10-Year Rule (38 CFR § 3.957): The VA cannot sever service connection for any condition rated for 10 consecutive years except in cases of proven fraud.',
      '20-Year Rule (38 CFR § 3.951): A disability rating in continuous effect for 20 years is permanently locked and cannot be reduced for any reason.'
    ],
    form: '38 CFR § 3.951',
    formUrl: 'https://www.ecfr.gov/current/title-38/chapter-I/part-3/subpart-A/subject-group-ECFRf346b0a7c41398c/section-3.951',
    script: 'Defense Rule: Never miss a scheduled VA re-examination appointment, and always seek care at least once a year to keep medical continuity active in your file.'
  },
  {
    id: 'champva_family_healthcare',
    phase: 'p4',
    phaseName: 'Phase 4: Lifelong Protection (Years 2 to Forever)',
    timing: 'Immediate Upon 100% P&T',
    urgency: 'defense',
    urgencyLabel: '🛡️ FAMILY HEALTHCARE',
    title: 'CHAMPVA Free Healthcare for Spouse and Children',
    value: '$12,000 to $24,000/yr Healthcare Savings',
    badge: '38 U.S.C. § 1781',
    summary: '100% P&T disabled veterans receive completely free comprehensive medical, hospital, pharmacy, and prescription coverage for their spouse and dependent children under CHAMPVA.',
    why: 'Completely eliminates employer healthcare insurance premiums, deductibles, and family out-of-pocket health costs.',
    steps: [
      'Step 1: Download and complete VA Form 10-10d (Application for CHAMPVA) and Form 10-7959c (Other Health Insurance Certification).',
      'Step 2: Attach copies of your marriage certificate, children\'s birth certificates, and your VA Rating Decision Letter.',
      'Step 3: Mail or fax to the CHAMPVA Eligibility Center in Denver, CO (Fax: 303-331-7809).'
    ],
    form: 'VA Form 10-10d',
    formUrl: 'https://www.va.gov/find-forms/about-form-10-10d/',
    script: 'What to include: Marriage certificate, birth certificates for all dependent children under 18 (or 23 if enrolled in college full-time), and VA P&T Summary Letter.'
  }
];
