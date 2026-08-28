// -----------------------------------------------------------------------
// MEDICAL DATABASE FOR IN-BROWSER SCANNER & CLAIM STRENGTH GRADER
// -----------------------------------------------------------------------
export const MED_DB = [
  {
    keywords: ['back pain', 'lower back', 'lumbar', 'lumbosacral', 'disc herniation', 'degenerative disc', 'spondylosis'],
    condition: 'Lumbar Spine Condition',
    dc: '5237 / 5243',
    ratingRange: '10-40%',
    note: 'Claim as Lumbosacral Strain (DC 5237) or Intervertebral Disc Syndrome (DC 5243). Never say back pain -- use the DC term.',
    secondary: ['Radiculopathy Lower Extremity', 'Sleep Apnea', 'Depression']
  },
  {
    keywords: ['neck pain', 'cervical', 'cervical strain', 'cervical disc'],
    condition: 'Cervical Spine Condition',
    dc: '5237',
    ratingRange: '10-30%',
    note: 'Claim as Cervical Strain. Range of motion testing is key -- describe your worst day.',
    secondary: ['Radiculopathy Upper Extremity', 'Headaches']
  },
  {
    keywords: ['knee', 'patellofemoral', 'meniscus', 'acl', 'mcl', 'chondromalacia'],
    condition: 'Knee Condition',
    dc: '5260 / 5257',
    ratingRange: '10-30%',
    note: 'File limitation of flexion AND instability separately. File bilateral for both knees.',
    secondary: ['Hip Condition', 'Ankle Condition']
  },
  {
    keywords: ['shoulder', 'rotator cuff', 'labrum', 'subacromial', 'ac joint'],
    condition: 'Shoulder Condition',
    dc: '5201',
    ratingRange: '10-40%',
    note: 'Rated by limitation of motion. Dominant arm rates higher. File bilateral.',
    secondary: ['Radiculopathy Upper Extremity']
  },
  {
    keywords: ['ankle', 'ankle sprain', 'ankle instability', 'plantar fasciitis'],
    condition: 'Ankle / Foot Condition',
    dc: '5271 / 5276',
    ratingRange: '0-30%',
    note: 'File instability and limitation of motion separately. File bilateral.',
    secondary: ['Knee Condition']
  },
  {
    keywords: ['tinnitus', 'ringing in ears', 'ear ringing'],
    condition: 'Tinnitus',
    dc: '6260',
    ratingRange: '10% FLAT',
    note: 'The easiest claim available. Flat 10% regardless of severity. File this immediately if not done.',
    secondary: ['Hearing Loss', 'Migraine']
  },
  {
    keywords: ['hearing loss', 'audiogram'],
    condition: 'Bilateral Hearing Loss',
    dc: '6100',
    ratingRange: '0-100%',
    note: 'Requires audiogram. File tinnitus AND hearing loss as separate claims.',
    secondary: ['Tinnitus']
  },
  {
    keywords: ['headache', 'migraine'],
    condition: 'Migraine Headaches',
    dc: '8100',
    ratingRange: '0-50%',
    note: 'Rated by frequency of prostrating attacks per month. Keep a headache log.',
    secondary: ['Cervical Strain', 'Sleep Apnea']
  },
  {
    keywords: ['numbness', 'tingling', 'radiculopathy', 'sciatica', 'neuropathy', 'nerve pain'],
    condition: 'Radiculopathy / Neuropathy',
    dc: '8520 / 8510',
    ratingRange: '10-40% per limb',
    note: 'File a separate claim for each affected limb. Secondary to spine conditions.',
    secondary: ['Lumbar Spine', 'Cervical Spine']
  },
  {
    keywords: ['tbi', 'traumatic brain injury', 'concussion', 'blast exposure'],
    condition: 'Traumatic Brain Injury (TBI)',
    dc: '8045',
    ratingRange: '0-100%',
    note: 'Rate by cognitive and emotional symptoms. Push for ALL symptoms to be evaluated at the C&P.',
    secondary: ['Headache', 'Sleep Apnea', 'Depression']
  },
  {
    keywords: ['ptsd', 'post traumatic', 'trauma', 'flashback', 'nightmares from service', 'hypervigilance'],
    condition: 'PTSD',
    dc: '9411',
    ratingRange: '0-100%',
    note: 'No combat required since 2010. Any in-service stressor qualifies. The stressor letter is critical.',
    secondary: ['Sleep Apnea', 'Depression', 'GERD', 'Hypertension']
  },
  {
    keywords: ['depression', 'mdd', 'major depressive'],
    condition: 'Major Depressive Disorder',
    dc: '9434',
    ratingRange: '0-100%',
    note: 'File secondary to PTSD, chronic pain, or TBI for easier approval.',
    secondary: ['PTSD', 'Chronic Pain']
  },
  {
    keywords: ['anxiety', 'panic attack', 'panic disorder', 'gad'],
    condition: 'Generalized Anxiety Disorder',
    dc: '9400',
    ratingRange: '0-100%',
    note: 'Can be primary or secondary to PTSD, TBI, or chronic pain.',
    secondary: ['PTSD', 'Depression']
  },
  {
    keywords: ['mst', 'military sexual trauma', 'sexual assault'],
    condition: 'Military Sexual Trauma (MST)',
    dc: '9411 / 9400',
    ratingRange: '0-100%',
    note: 'In-service stressor requirements are relaxed for MST claims. Confidential claims are available.',
    secondary: ['PTSD', 'Depression']
  },
  {
    keywords: ['sleep apnea', 'cpap', 'apnea'],
    condition: 'Obstructive Sleep Apnea',
    dc: '6847',
    ratingRange: '0-100%',
    note: '50% automatic if CPAP prescribed. File as secondary to PTSD, obesity, or TBI for easy approval.',
    secondary: ['Hypertension', 'Depression']
  },
  {
    keywords: ['asthma', 'wheezing', 'reactive airway'],
    condition: 'Asthma / Reactive Airway Disease',
    dc: '6602',
    ratingRange: '10-100%',
    note: 'PACT Act presumptive for post-9/11 veterans deployed to SW Asia.',
    secondary: ['GERD', 'Sinusitis']
  },
  {
    keywords: ['copd', 'emphysema', 'chronic bronchitis', 'pulmonary fibrosis'],
    condition: 'Chronic Respiratory Condition',
    dc: '6604',
    ratingRange: '10-100%',
    note: 'PACT Act presumptive for burn pit exposure. No nexus letter required.',
    secondary: ['Sleep Apnea']
  },
  {
    keywords: ['hypertension', 'high blood pressure', 'htn'],
    condition: 'Hypertension',
    dc: '7101',
    ratingRange: '10-60%',
    note: 'PACT Act Gulf War presumptive. Also file secondary to PTSD or sleep apnea.',
    secondary: ['Cardiovascular Disease']
  },
  {
    keywords: ['gerd', 'acid reflux', 'heartburn', 'gastroesophageal'],
    condition: 'GERD',
    dc: '7346',
    ratingRange: '10-60%',
    note: 'Very common and very winnable secondary to PTSD and stress.',
    secondary: ['Irritable Bowel']
  },
  {
    keywords: ['diabetes', 'type 2 diabetes', 't2d'],
    condition: 'Diabetes Mellitus Type II',
    dc: '7913',
    ratingRange: '10-100%',
    note: 'Agent Orange and Gulf War presumptive. PACT Act expanded coverage significantly.',
    secondary: ['Neuropathy', 'Hypertension', 'Kidney Condition']
  },
  {
    keywords: ['burn pit', 'burn pits', 'deployed iraq', 'deployed afghanistan', 'deployed kuwait'],
    condition: 'Burn Pit / Toxic Exposure (PACT Act)',
    dc: 'Presumptive',
    ratingRange: 'Varies',
    note: 'PACT Act presumptive. No nexus letter needed. File VA Form 21-10210.',
    secondary: ['Respiratory', 'Cancer', 'Hypertension']
  },
  {
    keywords: ['cancer', 'malignant', 'tumor', 'carcinoma', 'lymphoma'],
    condition: 'Cancer (Possible Service-Connected)',
    dc: 'Varies',
    ratingRange: '100% active',
    note: 'PACT Act dramatically expanded cancer coverage. ALWAYS file for any cancer diagnosis.',
    secondary: ['Depression', 'Neuropathy']
  },
];
