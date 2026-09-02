// -----------------------------------------------------------------------
// VETERAN SERVICE PERSONAS, DRILL PAY OFFSETS, CRDP/CRSC & FAMILY BENEFITS
// -----------------------------------------------------------------------

export const SERVICE_PERSONAS = [
  {
    id: 'enlisted_4yr',
    title: '4-Year Junior Enlisted',
    rankExample: 'E-4 (Cpl / Spc / SrA)',
    desc: 'One enlistment, navigating civilian transition, BDD claims, GI Bill vs VR&E, and federal student loan discharge.',
    keyConcerns: ['180-Day BDD Claim', 'Terminal Leave vs Selling Days', 'GI Bill & VR&E Stacking', 'TPD Student Loan Discharge', 'SkillBridge Rights'],
    badge: '1 Enlistment'
  },
  {
    id: 'nco_combat',
    title: '8–12 Year Combat Vet / NCO',
    rankExample: 'E-6 / E-7 (SSgt / SFC / Gunny / Capt)',
    desc: 'Multiple deployments, wear-and-tear, toxic burn pit exposures, bilateral injuries, and secondary claim stacking to reach 100% P&T.',
    keyConcerns: ['VA Math & Bilateral Factor', 'PACT Act Toxic Presumptives', 'High-Yield Secondary Claims', 'C&P DBQ Exam Prep', 'VA Home Loan House Hacking'],
    badge: 'Combat / Mid-Career'
  },
  {
    id: 'retiree_20yr',
    title: '20+ Year Military Retiree',
    rankExample: 'E-8 / E-9 / O-5 / O-6 (1SG / SgtMaj / Col)',
    desc: 'Full military retirement pension, drawing CRDP (Concurrent Receipt) or CRSC, TRICARE coordination, and state pension tax exemptions.',
    keyConcerns: ['CRDP vs CRSC Combinator', 'Military Pension + 100% VA Comp', 'TRICARE + VA Priority 1', 'FERS Military Buyback', 'State Military Pension Tax Shields'],
    badge: '20+ Year Career'
  },
  {
    id: 'guard_reserve',
    title: 'National Guard & Reserve',
    rankExample: 'Traditional M-Day (Title 32 / Title 10)',
    desc: 'Weekend drills, annual training, drill pay vs VA disability offset waivers (VA Form 21-8951-2), and age-60 non-regular retirement.',
    keyConcerns: ['Drill Pay vs VA Comp Offset', 'Avoiding VA Overpayment Debt', 'VA Home Loan (6yr vs 90d)', 'TRICARE Reserve Select', 'Non-Regular Retirement Points'],
    badge: 'Guard / Reserve'
  }
];

// Typical military drill pay rates per MUTA (drill period) and Annual Training (AT)
// 1 Drill Weekend = 4 MUTAs (4 drill periods). 1 year = 48 MUTAs (12 weekends) + 15 AT days = 63 drill days.
export const DRILL_PAY_ESTIMATES = {
  'E-4': { name: 'E-4 (Over 3 Yrs)', dailyPay: 104, annualDrillPay: 6552 },
  'E-5': { name: 'E-5 (Over 6 Yrs)', dailyPay: 128, annualDrillPay: 8064 },
  'E-6': { name: 'E-6 (Over 10 Yrs)', dailyPay: 156, annualDrillPay: 9828 },
  'E-7': { name: 'E-7 (Over 14 Yrs)', dailyPay: 188, annualDrillPay: 11844 },
  'O-3': { name: 'O-3 (Over 6 Yrs)', dailyPay: 242, annualDrillPay: 15246 },
  'O-4': { name: 'O-4 (Over 12 Yrs)', dailyPay: 312, annualDrillPay: 19656 },
};

// 100% P&T Sovereign Family & Dependents Entitlements Data
export const FAMILY_BENEFITS_DATA = [
  {
    id: 'chapter_35_dea',
    title: 'Chapter 35 DEA (Dependents’ Educational Assistance)',
    badge: '100% P&T Entitlement',
    monthlyCashPerPerson: 1536,
    maxMonths: 36,
    totalPerDependent: 55296,
    governingStatute: '38 U.S.C. Chapter 35',
    summary: 'Direct monthly tax-free cash allowance paid directly to your spouse and each dependent child while attending college, trade school, or apprenticeship.',
    rules: [
      'Children are eligible between ages 18 and 26 (can be extended under specific conditions).',
      'Spouses have up to 20 years from the date of 100% P&T determination or veteran\'s death.',
      'Pays $1,536/mo for full-time enrollment, $1,215/mo for 3/4 time, $892/mo for 1/2 time.',
      'Does NOT count against or reduce the veteran’s own Post-9/11 GI Bill or VR&E.'
    ],
    proTip: 'In states with dependent tuition waivers (e.g. Texas Hazelwood Act, California College Fee Waiver), your child gets 100% FREE university tuition PLUS they pocket the entire $1,536/mo Chapter 35 cash check for living expenses!'
  },
  {
    id: 'tpd_loan_discharge',
    title: '100% TPD Federal Student Loan Discharge',
    badge: '100% P&T / TDIU Entitlement',
    totalValueEstimate: '100% of Balance ($10k–$200k+)',
    governingStatute: '34 CFR § 685.213 | Higher Education Act',
    summary: 'Complete and permanent forgiveness of all federal direct student loans, Perkins loans, and PLUS loans for 100% P&T or TDIU veterans with ZERO federal income tax liability.',
    rules: [
      'Eligible if rated 100% P&T schedular, 100% via TDIU (Individual Unemployability), or receiving SMC at equivalent tier.',
      'Discharge is 100% exempt from federal income tax under the Tax Cuts and Jobs Act permanent provision.',
      'Applies to loans taken out for your own education, as well as Parent PLUS loans taken out for your children\'s college.',
      'Administered automatically via VA-to-Department of Education data match through Nelnet (disabilitydischarge.com).'
    ],
    proTip: 'If you plan to attend graduate, medical, or law school using federal loans, you can wait to request your one-time TPD discharge until AFTER you finish all your degree programs!'
  },
  {
    id: 'champva_healthcare',
    title: 'CHAMPVA Comprehensive Health Insurance',
    badge: '100% P&T Family Protection',
    annualValuePerFamily: 14400,
    governingStatute: '38 U.S.C. § 1781 | 38 CFR § 17.270',
    summary: 'Comprehensive, zero-monthly-premium medical, prescription, and mental health coverage for the spouse and dependent children of 100% P&T veterans.',
    rules: [
      'Zero monthly premiums and zero enrollment fees.',
      'Annual deductible is only $50 per individual ($100 per family maximum).',
      'Catastrophic maximum out-of-pocket limit is capped at $3,000 per family per calendar year.',
      'Covers doctor visits, inpatient hospital care, surgeries, mental health, durable medical equipment, and Meds by Mail (100% free generic prescriptions).'
    ],
    proTip: 'CHAMPVA acts as a secondary payer if your spouse has private or employer insurance, frequently picking up 100% of remaining copays, deductibles, and coinsurance.'
  },
  {
    id: 'dic_survivor_pension',
    title: 'DIC (Dependency & Indemnity Compensation)',
    badge: 'Surviving Spouse & Child Shield',
    monthlyBaseRate: 1612.75,
    governingStatute: '38 U.S.C. Chapter 13',
    summary: 'Tax-free monthly pension paid directly to a surviving spouse and minor children if the veteran passes away from a service-connected disability or was rated 100% P&T for 10+ years.',
    rules: [
      'Base rate is $1,612.75/month tax-free for the surviving spouse for life (does not terminate unless remarried before age 55).',
      'Additional $342.50/month transitional benefit for surviving children.',
      'Veteran meets the standard if service-connected condition caused or contributed to death, OR if veteran was rated 100% P&T for at least 10 continuous years prior to death (the "10-Year Rule").'
    ],
    proTip: 'Ensure your spouse has a copy of your 100% P&T decision letter and DD-214 safely stored in your family lockbox with instructions to file VA Form 21P-534EZ.'
  }
];
