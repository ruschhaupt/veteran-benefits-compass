// -----------------------------------------------------------------------
// MASTER CHECKLIST MILESTONES
// -----------------------------------------------------------------------
export const ALL_MILESTONES = [
  { id: 'str_download', stage: 'Pre-Separation', label: 'Request and download full digital copies of your Service Treatment Records (STR) and dental files', hideWhen: (p) => p.alreadyOut },
  { id: 'sick_call_log', stage: 'Pre-Separation', label: 'Go to medical/sick call to document every physical and mental symptom before terminal leave', hideWhen: (p) => p.alreadyOut },
  { id: 'cool_cert', stage: 'Pre-Separation', label: 'Complete free civilian certifications (PMP, Sec+, AWS) via DoD COOL / Branch Credentialing', hideWhen: (p) => p.alreadyOut },
  { id: 'bdd_filed', stage: 'BDD Window', label: 'File Benefits Delivery at Discharge (BDD) claim at the exact 180-90 day pre-separation mark', hideWhen: (p) => p.alreadyOut || p.currentRating >= 100 },
  { id: 'skillbridge_app', stage: 'BDD Window', label: 'Secure a DoD SkillBridge / CSP civilian corporate internship for your final 6 months', hideWhen: (p) => p.alreadyOut },
  { id: 'va_account_set', stage: 'Transition', label: 'Set up Login.gov / ID.me authentication on VA.gov and verify claim tracker status' },
  { id: 'va_healthcare', stage: 'Transition', label: 'Enroll in VA Healthcare at your local VA Medical Center (Form 10-10EZ)' },
  { id: 'buddy_letters', stage: 'Transition', label: 'Collect Lay / Buddy statements (VA Form 21-4138) from fellow service members for claims', hideWhen: (p) => p.currentRating >= 100 },
  { id: 'va_loan_coe', stage: 'Post-Separation', label: 'Download your VA Loan Certificate of Eligibility (COE) on eBenefits / VA.gov' },
  { id: 'roth_ira_opened', stage: 'Post-Separation', label: 'Open a Roth IRA and automate $583/mo ($7,000/yr) indexing into VOO/VTI' },
  { id: 'state_tax_exempt', stage: 'Post-Separation', label: 'Submit your VA rating letter to your county tax assessor for full property tax exemption', hideWhen: (p) => p.currentRating < 100 },
  { id: 'champva_enrolled', stage: 'Post-Separation', label: 'Submit VA Form 10-10d to enroll spouse and children in CHAMPVA healthcare', hideWhen: (p) => p.currentRating < 100 || p.hasDependents === 'single' },
];
