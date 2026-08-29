// -----------------------------------------------------------------------
// TRANSITION, SKILLBRIDGE, BDD & EMERGENCY SUPPORT DATA
// -----------------------------------------------------------------------

export const TRANSITION_CHECKLIST = [
  {
    phase: 'T-180 to T-90 Days (The Golden Window)',
    status: 'URGENT',
    tasks: [
      {
        id: 'bdd_claim',
        title: 'File BDD Disability Claim (VA Form 21-526EZ)',
        statute: '38 U.S.C. § 5101',
        desc: 'Submit your claim between 180 and 90 days before discharge. Complete all C&P exams while still on active duty to receive disability pay on Day 1 of civilian life.',
        impact: 'Day 1 compensation + instant priority 1 VA healthcare'
      },
      {
        id: 'medical_jacket',
        title: 'Request Complete Copy of STRs & Dental Jacket',
        statute: 'DoD Directive 6040.45',
        desc: 'Go to your base medical clinic and request a certified paper or digital copy of your complete Service Treatment Record (STR). Never separate without this in your hand.',
        impact: 'Prevents years of National Archives (NARA) backlog'
      },
      {
        id: 'skillbridge',
        title: 'Apply for DoD SkillBridge Internship',
        statute: 'DoD Instruction 1322.29',
        desc: 'Spend the last 180 days of military service working as a full-time civilian intern at top tech, defense, or finance companies while receiving 100% active duty military pay & BAH.',
        impact: 'High-salary civilian job placement before terminal leave'
      }
    ]
  },
  {
    phase: 'T-90 to T-0 Days (Terminal Leave & Out-Processing)',
    status: 'ACTIVE',
    tasks: [
      {
        id: 'terminal_leave',
        title: 'Calculate Terminal Leave vs. Selling Days',
        statute: '37 U.S.C. § 501',
        desc: 'Terminal leave pays full Basic Pay + BAH + BAS. Selling leave only pays Basic Pay (and is taxed at 22% federal rate). Taking terminal leave is almost always more profitable.',
        impact: 'Maximized cash transition runway'
      },
      {
        id: 'dd214_audit',
        title: 'Audit Member-4 / Service-2 Copy of DD-214',
        statute: 'DoD Instruction 1336.01',
        desc: 'Check every medal, campaign badge, deployment theater, MOS/AFSC, and character of service. Corrections made after separation require a 12-month DD-149 board review.',
        impact: 'Locks in PACT Act & state property tax qualifications'
      },
      {
        id: 'vgli_sgli',
        title: 'Convert SGLI to VGLI or Private Life Insurance',
        statute: '38 U.S.C. § 1968',
        desc: 'You have 240 days post-separation to convert SGLI into VGLI with NO proof of good health or medical exam required, regardless of disability rating.',
        impact: 'Guaranteed life insurance coverage with pre-existing conditions'
      }
    ]
  },
  {
    phase: 'Day 1 to Day 90 Post-Separation (Civilian Fortress)',
    status: 'PROTECTION',
    tasks: [
      {
        id: 'va_health_enroll',
        title: 'Enroll in VA Healthcare at Local VAMC',
        statute: '38 U.S.C. § 1705',
        desc: 'Bring your DD-214 to the nearest VA medical center. Combat veterans receive 10 years of enhanced cost-free VA healthcare eligibility under the PACT Act.',
        impact: '$0 copays on service-connected care & free prescriptions'
      },
      {
        id: 'dental_window',
        title: 'Claim Free Statutory 180-Day Dental Exam',
        statute: '38 U.S.C. § 1712',
        desc: 'Veterans with at least 90 days of continuous active service qualify for a one-time free complete dental examination and corrective treatment within 180 days of separation.',
        impact: '$1,500 to $4,000 in free dental care'
      },
      {
        id: 'state_exemptions',
        title: 'File County Homestead Property Tax Exemption',
        statute: 'State Tax Codes',
        desc: 'Submit your VA rating decision letter to your local county appraisal district to reduce or completely eliminate your annual homestead property taxes.',
        impact: '$2,000 to $12,000/yr permanent tax savings'
      }
    ]
  }
];

export const EMERGENCY_RESOURCES = [
  {
    id: 'compact_act',
    title: 'COMPACT Act Emergency Mental Health Care',
    statute: '38 U.S.C. § 1720J',
    phone: '988 (Press 1) or Go to ANY Emergency Room',
    tag: 'FREE EMERGENCY CARE',
    desc: 'Veterans in acute suicidal crisis can go to ANY hospital emergency room (VA or civilian) for 100% free emergency inpatient and outpatient mental health care. No VA enrollment required, $0 copay.',
    actionUrl: 'https://www.va.gov/resources/rates-for-veteran-emergency-care-in-the-community/'
  },
  {
    id: 'hud_vash',
    title: 'HUD-VASH Emergency Housing Choice Vouchers',
    statute: '42 U.S.C. § 1437f(o)(19)',
    phone: '1-877-4AID-VET (1-877-424-3838)',
    tag: 'HOUSING SAFETY NET',
    desc: 'Combines HUD housing choice rental vouchers with VA case management and clinical services to provide permanent subsidized housing for homeless and at-risk veterans.',
    actionUrl: 'https://www.va.gov/homeless/hud-vash.asp'
  },
  {
    id: 'ssvf',
    title: 'SSVF (Supportive Services for Veteran Families)',
    statute: '38 CFR Part 62',
    phone: '1-877-4AID-VET (1-877-424-3838)',
    tag: 'RENT & UTILITY GRANTS',
    desc: 'Provides rapid re-housing grants, emergency security deposit assistance, rental arrears subsidies, and moving cost grants for low-income veteran families.',
    actionUrl: 'https://www.va.gov/homeless/ssvf/'
  }
];
