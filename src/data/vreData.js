// -----------------------------------------------------------------------
// VOCATIONAL REHABILITATION & EMPLOYMENT (VR&E - CHAPTER 31) MASTER DATA
// 38 U.S.C. Chapter 31 | 38 CFR Part 21
// -----------------------------------------------------------------------

export const VRE_TRACKS = [
  {
    id: 'long_term',
    number: 'Track 1',
    name: 'Employment Through Long-Term Services (The Master College / Degree Track)',
    tag: '👑 MOST POPULAR',
    tagColor: 'text-gold border-gold/40 bg-gold/10',
    summary: '100% paid college tuition with ZERO dollar caps, full degree programs (Undergrad, Master\'s, Law, MBA, Med School), monthly tax-free housing allowance, and all tech/supplies covered.',
    whatIsCovered: [
      '100% tuition and all mandatory university fees (Public or Private universities with no cap)',
      'Monthly Housing Allowance (P-54 Rate: Pays full Post-9/11 E-5 with Dependents BAH)',
      'Free computer package (MacBook Pro / High-End PC, dual monitors, printer, docking station)',
      'All required textbooks, lab supplies, access codes, and parking permits',
      'Professional licensure, bar exams, certifications, and exam prep courses',
      '2 additional months of full E-5 BAH subsistence pay post-graduation while job hunting (EER)'
    ],
    idealFor: 'Veterans whose service-connected conditions prevent them from working in their current field and who need a formal degree to enter a sedentary, professional career.',
    statute: '38 CFR § 21.120'
  },
  {
    id: 'self_employment',
    number: 'Track 2',
    name: 'Self-Employment Track (The Entrepreneur / Business Track)',
    tag: '🚀 START A BUSINESS',
    tagColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40',
    summary: 'The VA funds and supports your startup or small business with expert business plan counseling, initial tools, commercial equipment, licenses, franchise fees, and startup inventory.',
    whatIsCovered: [
      'Category I (Serious Employment Handicap): Full startup funding including equipment, tools, initial inventory, licenses, insurance, and professional fees',
      'Category II (Standard Employment Handicap): Essential tools, equipment, licenses, and marketing services',
      'One-on-one professional business plan development through SBDC and contracted mentors',
      'Monthly subsistence allowance while writing business plan and executing launch phase',
      'Fast-track SDVOSB (Service-Disabled Veteran-Owned Small Business) federal certification'
    ],
    idealFor: 'Veterans with severe conditions who require the autonomy of being their own boss, or those with viable business models that accommodate their medical limitations.',
    statute: '38 CFR § 21.258'
  },
  {
    id: 'rapid_access',
    number: 'Track 3',
    name: 'Rapid Access to Employment Track (Direct Job Placement)',
    tag: '⚡ QUICK PLACEMENT',
    tagColor: 'text-sand border-steel/60 bg-steel/30',
    summary: 'Fast-track employment services for veterans who already possess marketable skills and degrees but need specialized resume re-targeting, interview coaching, or industry certifications.',
    whatIsCovered: [
      'Professional resume writing and federal USAJOBS application tailoring',
      'Industry certifications, bootcamps, and short-term vocational licenses (1-12 months)',
      'Direct non-competitive federal hiring placement via Schedule A & 30%+ Disabled Authority',
      'Interview attire, work equipment, uniform stipends, and commuting assistance',
      'Employment Adjustment Allowance (EAA): 2 months of full subsistence payments'
    ],
    idealFor: 'Veterans seeking immediate civilian employment within 30-90 days without going through a full 4-year degree.',
    statute: '38 CFR § 21.122'
  },
  {
    id: 'reemployment',
    number: 'Track 4',
    name: 'Reemployment with Previous Employer Track',
    tag: '🛡️ USERRA RIGHTS',
    tagColor: 'text-sand border-steel/60 bg-steel/30',
    summary: 'For National Guard, Reserve, or separating members returning to their pre-service employer under USERRA protections with required medical workplace accommodations.',
    whatIsCovered: [
      'Ergonomic workplace evaluations and specialized adaptive office furniture',
      'Assistive technology, screen readers, and mobility accommodations paid by the VA',
      'Mediation with employer HR departments to ensure job retention and fair promotion',
      'Re-training on updated company software, tools, and technical equipment'
    ],
    idealFor: 'Reservists and Guardsmen returning to their civilian jobs who have new service-connected limitations.',
    statute: '38 CFR § 21.124'
  },
  {
    id: 'independent_living',
    number: 'Track 5',
    name: 'Independent Living Track (ILP)',
    tag: '🏠 DAILY LIVING INDEPENDENCE',
    tagColor: 'text-scarlet border-scarlet/40 bg-scarlet/10',
    summary: 'For veterans with severe service-connected disabilities for whom employment is currently not feasible. Focuses on quality of life, mobility, and independent daily functioning.',
    whatIsCovered: [
      'Comprehensive home assessments and smart-home environmental controls',
      'Assistive mobility equipment, specialized lift chairs, and wheelchair ramps',
      'Adaptive technology (voice-to-text, specialized keyboards, adaptive sports equipment)',
      'Health and wellness technology to reduce dependence on full-time caregivers'
    ],
    idealFor: 'Veterans with 70%-100% ratings or SMC tiers who face severe mobility, cognitive, or physical limitations.',
    statute: '38 CFR § 21.160'
  }
];

export const VRE_COUNSELOR_SCRIPT_GUIDE = [
  {
    topic: '1. What VR&E Is (and Is Not)',
    whatVAPrioritizes: 'VR&E is an EMPLOYMENT program, not an education program. The VA\'s goal is strictly to place you in sustainable, suitable employment that does not worsen your service-connected conditions.',
    whatNotToSay: '❌ "I am here because I want a free Master\'s degree / law degree." (Instant red flag — counselors will deny entitlement).',
    whatToSay: '✅ "My service-connected conditions (lumbar strain / PTSD / migraines) make it impossible for me to continue in my current field of work. The labor market data shows that retraining into [Target Career] is the only sustainable, pain-free career path for me."'
  },
  {
    topic: '2. Proving Serious Employment Handicap (SEH)',
    whatVAPrioritizes: 'An SEH gives you up to 48+ months of extended benefits, waives the 12-year basic eligibility window, and unlocks the highest priority degree and self-employment funding.',
    whatNotToSay: '❌ "I can do anything, I just want a higher paying job."',
    whatToSay: '✅ "My physical/mental conditions substantially impair my ability to prepare for, obtain, or retain employment consistent with my abilities. Standing/sitting for long periods causes severe flare-ups (DeLuca factor), documented in my VA medical records."'
  },
  {
    topic: '3. The Labor Market & Feasibility Packet',
    whatVAPrioritizes: 'Counselors want to see that you researched the job market and that the proposed degree directly qualifies you for open positions in your region.',
    whatNotToSay: '❌ "I haven\'t looked at job openings yet, I just want to start classes."',
    whatToSay: '✅ "I have printed 3-5 current job postings on USAJOBS / LinkedIn in this field. All of them require a minimum of a Bachelor\'s/Master\'s degree, which is why this specific degree program is a mandatory prerequisite for employment."'
  },
  {
    topic: '4. Retroactive Induction (Getting Your GI Bill Back)',
    whatVAPrioritizes: 'Under 38 CFR § 21.282 and the 2021 VA policy change, if you previously used Post-9/11 GI Bill while having an active service-connected disability, VR&E can retroactively cover those past semesters and return your 36 months of GI Bill back to you!',
    whatNotToSay: '❌ "I guess my GI Bill is gone forever."',
    whatToSay: '✅ "I am officially requesting a Retroactive Induction review under M28C for the [Dates/Semesters] I attended school while service-connected, so my Chapter 33 entitlement can be restored to my account."'
  }
];

export const VRE_FAQS = [
  {
    q: 'Does VR&E use up my Post-9/11 GI Bill?',
    a: 'NO. Since April 2021, the VA no longer counts VR&E usage against your 36 months of Post-9/11 GI Bill. You can use VR&E for 48 months for undergraduate studies, and then STILL HAVE your entire 36 months of Post-9/11 GI Bill available for graduate school or other degrees!'
  },
  {
    q: 'How do I get paid the full E-5 BAH housing allowance under VR&E?',
    a: 'To receive the "P-54 Subsistence Rate" (which equals the full Post-9/11 GI Bill BAH rate for an E-5 with dependents in your school\'s zip code), you only need to have at least ONE DAY of remaining, unexpired Post-9/11 GI Bill entitlement when you enter VR&E and elect the P-54 rate on VA Form 28-0988.'
  },
  {
    q: 'Can VR&E pay for Law School, Medical School, or an MBA?',
    a: 'YES. If your approved Individualized Written Rehabilitation Plan (IWRP) establishes that your target professional career (e.g. Attorney, Physician, CPA, Clinical Psychologist) requires a graduate degree as the mandatory entry-level credential, VR&E will fund 100% of law school, med school, or graduate school tuition with no dollar cap.'
  },
  {
    q: 'What is Employment Adjustment Allowance (EAA)?',
    a: 'Once you graduate or complete your VR&E program, the VA continues paying you your full monthly housing allowance (E-5 BAH) for an extra TWO full months while you participate in job search and interview activities.'
  }
];
