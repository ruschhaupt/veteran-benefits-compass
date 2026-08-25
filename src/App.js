'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  Compass, DollarSign, Calendar, ChevronRight, ChevronLeft,
  CheckCircle, Award, ArrowRight, Shield, Heart,
  ShieldAlert, Edit3, Plus, Trash2, Search,
  Upload, FileText, AlertTriangle, MapPin, Phone, Globe, Users,
  TrendingUp, Zap, Target, Cpu, ExternalLink,
  CheckSquare, X, Activity, Clock, Flag
} from 'lucide-react';

// -------------------------------------------------------------------------
// MEDICAL DATABASE  (defined outside component -- no closure issues)
// -------------------------------------------------------------------------
const MED_DB = [
  { keywords: ['back pain','lower back','lumbar','lumbosacral','disc herniation','herniated disc','degenerative disc','spondylosis'], condition: 'Lumbar Spine Condition', dc: '5237 / 5243', ratingRange: '10-40%', note: 'Claim as Lumbosacral Strain or Intervertebral Disc Syndrome (IVDS)', secondary: ['Radiculopathy - Lower Extremity','Sleep Apnea','Depression'] },
  { keywords: ['neck pain','cervical','cervical strain','cervical disc','cervical spondylosis'], condition: 'Cervical Spine Condition', dc: '5237', ratingRange: '10-30%', note: 'Claim as Cervical Strain. Key: range of motion testing.', secondary: ['Radiculopathy - Upper Extremity','Headaches/Migraine'] },
  { keywords: ['knee pain','knee','patellofemoral','meniscus','acl','mcl','pcl','chondromalacia'], condition: 'Knee Condition', dc: '5260 / 5261 / 5257', ratingRange: '10-30%', note: 'Claim limitation of flexion AND instability separately for each knee.', secondary: ['Hip Condition','Ankle Condition'] },
  { keywords: ['shoulder','rotator cuff','labrum','acromial','subacromial','ac joint'], condition: 'Shoulder Condition', dc: '5201 / 5203', ratingRange: '10-40%', note: 'Rate by limitation of motion. Dominant arm rates higher.', secondary: ['Radiculopathy - Upper Extremity'] },
  { keywords: ['ankle','ankle sprain','ankle instability','achilles','plantar fasciitis'], condition: 'Ankle Condition', dc: '5271 / 5270', ratingRange: '0-20%', note: 'Claim ankle instability and/or limitation of motion.', secondary: ['Foot Condition','Knee Condition'] },
  { keywords: ['flat feet','pes planus','plantar fasciitis','foot pain','metatarsalgia'], condition: 'Foot Condition', dc: '5276 / 5284', ratingRange: '0-30%', note: 'File bilateral (both feet) for doubled evaluation.', secondary: ['Knee Condition','Ankle Condition'] },
  { keywords: ['hip pain','hip','trochanteric bursitis','iliotibial','hip flexor'], condition: 'Hip Condition', dc: '5251 / 5252 / 5253', ratingRange: '10-40%', note: 'Claim limitation of motion of the thigh.', secondary: ['Knee Condition','Lower Back'] },
  { keywords: ['wrist pain','wrist','carpal tunnel','carpal','tendinitis','de quervain'], condition: 'Wrist/Hand Condition', dc: '5215 / 8215', ratingRange: '10-30%', note: 'Claim carpal tunnel separately under nerve (DC 8215).', secondary: ['Elbow Condition'] },
  { keywords: ['tinnitus','ringing in ears','ear ringing','ringing ears'], condition: 'Tinnitus', dc: '6260', ratingRange: '10% (FLAT RATE)', note: 'EASIEST claim. Flat 10% regardless of severity. File immediately.', secondary: ['Hearing Loss','Migraine'] },
  { keywords: ['hearing loss','hearing','deaf','audiogram'], condition: 'Bilateral Hearing Loss', dc: '6100', ratingRange: '0-100%', note: 'Requires audiogram. File both tinnitus AND hearing loss.', secondary: ['Tinnitus'] },
  { keywords: ['headache','migraine','migraines','head pain'], condition: 'Migraine Headaches', dc: '8100', ratingRange: '0-50%', note: 'Rated by frequency of prostrating attacks per month.', secondary: ['Cervical Strain','Sleep Disturbance'] },
  { keywords: ['numbness','tingling','radiculopathy','sciatica','sciatic','neuropathy','nerve pain','burning sensation'], condition: 'Radiculopathy / Peripheral Neuropathy', dc: '8520 / 8510 / 8615', ratingRange: '10-40% per limb', note: 'Separate claim for each affected extremity. Secondary to spine conditions.', secondary: ['Lumbar Spine','Cervical Spine'] },
  { keywords: ['tbi','traumatic brain injury','concussion','blast exposure','blast injury'], condition: 'Traumatic Brain Injury (TBI)', dc: '8045', ratingRange: '0-100%', note: 'Rate by cognitive and emotional symptoms. Get a C&P focused on ALL symptoms.', secondary: ['Headache','Sleep Apnea','Depression/Anxiety'] },
  { keywords: ['ptsd','post traumatic','post-traumatic','trauma','flashback','nightmares from service','hypervigilance'], condition: 'PTSD', dc: '9411', ratingRange: '0-100%', note: 'No combat required since 2010. In-service stressor letter is key.', secondary: ['Sleep Apnea','Depression','GERD','Hypertension'] },
  { keywords: ['depression','mdd','major depressive','depressive disorder','sadness'], condition: 'Major Depressive Disorder (MDD)', dc: '9434', ratingRange: '0-100%', note: 'File as secondary to PTSD, pain conditions, or TBI for easier approval.', secondary: ['PTSD','Chronic Pain'] },
  { keywords: ['anxiety','generalized anxiety','panic attack','panic disorder','gad'], condition: 'Generalized Anxiety Disorder (GAD)', dc: '9400', ratingRange: '0-100%', note: 'Can be primary or secondary to PTSD, TBI, or chronic pain.', secondary: ['PTSD','Depression'] },
  { keywords: ['mst','military sexual trauma','sexual assault','sexual harassment service'], condition: 'Military Sexual Trauma (MST)', dc: '9411 / 9400', ratingRange: '0-100%', note: 'In-service stressor requirements are relaxed for MST. Confidential claims available.', secondary: ['PTSD','Depression','GAD'] },
  { keywords: ['sleep apnea','cpap','apnea','snoring'], condition: 'Sleep Apnea (Obstructive)', dc: '6847', ratingRange: '0-100%', note: '50% automatic if prescribed CPAP. Excellent secondary to PTSD, obesity, TBI.', secondary: ['Hypertension','Cardiovascular','Depression'] },
  { keywords: ['asthma','wheezing','bronchial asthma','reactive airway'], condition: 'Asthma / Reactive Airway Disease', dc: '6602', ratingRange: '10-100%', note: 'Post-9/11 vets: PACT Act presumptive if deployed to SW Asia.', secondary: ['GERD','Sinusitis'] },
  { keywords: ['sinusitis','sinus','rhinitis','chronic sinusitis'], condition: 'Chronic Sinusitis / Rhinitis', dc: '6513 / 6522', ratingRange: '0-50%', note: 'Common among veterans. File bilateral for each sinus.', secondary: ['Asthma','Sleep Apnea'] },
  { keywords: ['copd','emphysema','chronic bronchitis','pulmonary fibrosis','bronchiolitis'], condition: 'Chronic Respiratory Condition (COPD/ILD)', dc: '6604 / 6834', ratingRange: '10-100%', note: 'PACT Act presumptive for post-9/11 burn pit exposure.', secondary: ['Sleep Apnea'] },
  { keywords: ['hypertension','high blood pressure','htn'], condition: 'Hypertension', dc: '7101', ratingRange: '10-60%', note: 'PACT Act Gulf War presumptive. Also secondary to PTSD, sleep apnea.', secondary: ['Cardiovascular Disease','Kidney Condition'] },
  { keywords: ['gerd','acid reflux','heartburn','gastroesophageal','esophageal reflux'], condition: 'GERD / Gastroesophageal Reflux Disease', dc: '7346', ratingRange: '10-60%', note: 'File separately. Excellent secondary to PTSD, stress.', secondary: ['Irritable Bowel','Esophageal Stricture'] },
  { keywords: ['ibs','irritable bowel','bowel dysfunction','diarrhea chronic','constipation chronic'], condition: 'Irritable Bowel Syndrome (IBS)', dc: '7319', ratingRange: '0-30%', note: 'Common secondary to PTSD. Document frequency of attacks.', secondary: ['GERD','Anxiety'] },
  { keywords: ['diabetes','type 2 diabetes','t2d','hyperglycemia'], condition: 'Diabetes Mellitus Type II', dc: '7913', ratingRange: '10-100%', note: 'Agent Orange and Gulf War/post-9/11 presumptive under PACT Act.', secondary: ['Neuropathy','Hypertension','Kidney Condition','Eye Conditions'] },
  { keywords: ['eczema','dermatitis','atopic dermatitis','skin rash','skin condition'], condition: 'Dermatitis / Eczema', dc: '7806', ratingRange: '0-60%', note: 'Rated by body surface area affected.', secondary: [] },
  { keywords: ['scar','surgical scar','keloid'], condition: 'Scars', dc: '7800-7805', ratingRange: '0-80%', note: 'All scars from service or service-connected surgery qualify.', secondary: [] },
  { keywords: ['burn pit','burn pits','open air burn','deployed iraq','deployed afghanistan','deployed kuwait','deployed qatar'], condition: 'Burn Pit / Toxic Exposure (PACT Act)', dc: 'PACT Presumptive', ratingRange: 'Varies by condition', note: 'PACT Act presumptive. File with VA Form 21-10210. No nexus letter needed.', secondary: ['Respiratory','Cancer','Hypertension'] },
  { keywords: ['cancer','malignant','tumor','carcinoma','lymphoma','leukemia','melanoma'], condition: 'Cancer (Possible Service-Connected)', dc: 'Varies by type', ratingRange: '100% active / 10-100% residuals', note: 'PACT Act expanded cancer coverage significantly. ALWAYS file for cancer.', secondary: ['Depression','Fatigue','Neuropathy from chemo'] },
  { keywords: ['hemorrhoid','hemorrhoids','rectal'], condition: 'Hemorrhoids', dc: '7336', ratingRange: '0-20%', note: 'Often overlooked. Easy to document and file.', secondary: [] },
  { keywords: ['vision','eye','visual acuity','blurry vision','diplopia'], condition: 'Eye Condition', dc: '6000-6091', ratingRange: '0-100%', note: 'Service-connected eye conditions include blast/laser injury.', secondary: [] },
  { keywords: ['kidney','renal','proteinuria'], condition: 'Kidney Condition', dc: '7502 / 7504', ratingRange: '0-100%', note: 'Secondary to hypertension or diabetes.', secondary: ['Hypertension','Diabetes'] },
];

const VeteranBenefitsCompass = () => {
  // routing
  const [currentPage, setCurrentPage] = useState('landing');
  const [wizardStep, setWizardStep] = useState(0);

  // profile (collected once, used everywhere)
  const [branch, setBranch] = useState('usmc');
  const [separationMonths, setSeparationMonths] = useState(6);
  const [alreadyOut, setAlreadyOut] = useState(false);
  const [dischargeType, setDischargeType] = useState('honorable');
  const [disabilityStatus, setDisabilityStatus] = useState('none');
  const [currentRating, setCurrentRating] = useState(0);
  const [futurePath, setFuturePath] = useState('expat');
  const [selectedState, setSelectedState] = useState('nv');
  const [hasDependents, setHasDependents] = useState('single');
  const [yearsOfService, setYearsOfService] = useState(4);
  const [servedPost911, setServedPost911] = useState(true);
  const [exposedBurnPit, setExposedBurnPit] = useState(false);
  const [mstFlag, setMstFlag] = useState(false);

  // ui
  const [activeTab, setActiveTab] = useState('mission');
  const [activeAvenue, setActiveAvenue] = useState('expat');
  const [upgradeStep, setUpgradeStep] = useState(0);
  const [claimsSubTab, setClaimsSubTab] = useState('math');
  const [claimsList, setClaimsList] = useState([50, 30, 10]);
  const [newClaimVal, setNewClaimVal] = useState(10);
  const [showCrisis, setShowCrisis] = useState(false);

  // scanner
  const [scanText, setScanText] = useState('');
  const [scanResults, setScanResults] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);
  const fileInputRef = useRef(null);

  // -----------------------------------------------------------------------
  // BRANCH DATA
  // -----------------------------------------------------------------------
  const branchData = {
    usmc:          { name: 'Marine Corps', color: 'border-scarlet text-scarlet', bg: 'bg-scarlet', text: 'text-scarlet', badge: 'USMC', sep: 'EAS' },
    army:          { name: 'Army',         color: 'border-amber-400 text-amber-400', bg: 'bg-amber-500', text: 'text-amber-400', badge: 'ARMY', sep: 'ETS' },
    navy:          { name: 'Navy',         color: 'border-sky-400 text-sky-400', bg: 'bg-sky-500', text: 'text-sky-400', badge: 'NAVY', sep: 'EAOS' },
    airforce:      { name: 'Air Force',    color: 'border-blue-400 text-blue-400', bg: 'bg-blue-500', text: 'text-blue-400', badge: 'USAF', sep: 'DOS' },
    coastguard:    { name: 'Coast Guard',  color: 'border-orange-400 text-orange-400', bg: 'bg-orange-500', text: 'text-orange-400', badge: 'USCG', sep: 'DOS' },
    national_guard:{ name: 'Natl Guard',   color: 'border-green-400 text-green-400', bg: 'bg-green-600', text: 'text-green-400', badge: 'NG', sep: 'ETS' },
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

  // -----------------------------------------------------------------------
  // SCANNER ENGINE
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
      setScanResults({ found, secondaries: [...secondaries], pactFlag, totalFound: found.length });
      setScanLoading(false);
    }, 1100);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanText, exposedBurnPit]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => setScanText(evt.target.result);
    reader.readAsText(file);
  };

  // -----------------------------------------------------------------------
  // VA PAY TABLE (2024 monthly rates)
  // -----------------------------------------------------------------------
  const vaPayTable = {
    0:  { single:0,    child_only:0,    spouse:0,    family:0    },
    10: { single:175,  child_only:189,  spouse:195,  family:211  },
    20: { single:346,  child_only:367,  spouse:384,  family:409  },
    30: { single:537,  child_only:568,  spouse:603,  family:641  },
    40: { single:774,  child_only:813,  spouse:860,  family:911  },
    50: { single:1102, child_only:1152, spouse:1211, family:1275 },
    60: { single:1395, child_only:1453, spouse:1529, family:1606 },
    70: { single:1759, child_only:1830, spouse:1921, family:2014 },
    80: { single:2044, child_only:2126, spouse:2232, family:2339 },
    90: { single:2297, child_only:2390, spouse:2512, family:2633 },
    100:{ single:3737, child_only:3849, spouse:3946, family:4094 },
  };
  const depKey = hasDependents === 'single' ? 'single' : hasDependents === 'unmarried_kids' ? 'child_only' : hasDependents === 'spouse' ? 'spouse' : 'family';
  const monthlyPay = (vaPayTable[roundedRating] || vaPayTable[0])[depKey] || 0;
  const annualPay = monthlyPay * 12;

  // -----------------------------------------------------------------------
  // STATE BENEFITS
  // -----------------------------------------------------------------------
  const stateBenefits = {
    nv: { name:'Nevada',      emoji:'NV', tax:'ZERO income tax on all military/VA income', housing:'Property tax exemption: $22,500 base; 100% P&T = full exemption', education:'Nevada Promise - 2 free years at community college',
      highlights:['No state income tax on military retirement or VA pay','Property tax exemption up to $22,500 (100% P&T = full exemption)','DMV waives registration fees for disabled vets','Free Nevada State Parks annual pass (any rating)','NDOW hunting/fishing licenses free (100% P&T)','Nevada Veterans Employment Program (priority hiring)'] },
    ca: { name:'California',  emoji:'CA', tax:'No state tax on VA disability pay; military retirement partially taxed', housing:'CalVet Home Loan below market rate', education:'College Fee Waiver for veteran dependents',
      highlights:['No state tax on VA disability pay','CalVet Farm & Home Loan (low interest)','Property tax exemption (varies by county)','Free fishing/hunting license (100% P&T)','CalVets College Fee Waiver for dependents','Priority state hiring'] },
    tx: { name:'Texas',       emoji:'TX', tax:'ZERO income tax - no state tax on anything', housing:'TX Veterans Land Board: low-rate loans. 100% P&T = full property tax exemption', education:'Hazelwood Act: 150 free college credit hours (transferable to dependents)',
      highlights:['100% P&T = 100% property tax exemption (huge benefit)','No state income tax on any income','Hazelwood Act - 150 credit hours tuition waived at TX colleges','Free hunting/fishing licenses','VLB land and home loan program'] },
    fl: { name:'Florida',     emoji:'FL', tax:'ZERO income tax', housing:'Full property tax exemption at 100% P&T', education:'Free tuition for dependents of 100% P&T vets at FL state schools',
      highlights:['No state income tax','100% P&T = full property tax exemption','Free college tuition for dependents of 100% P&T vets','Florida Resident Access Grant for private colleges','Free hunting/fishing license (any rating)'] },
    wa: { name:'Washington',  emoji:'WA', tax:'ZERO income tax', housing:'Property tax exemption at 100% P&T', education:'Reduced tuition at state colleges',
      highlights:['No state income tax','Property tax exemption for 100% P&T','Free hunting/fishing licenses','State veterans cemetery at no cost','Reduced tuition at state colleges'] },
    az: { name:'Arizona',     emoji:'AZ', tax:'Military retirement fully exempt from state income tax', housing:'Property tax exemption for disabled vets', education:'Veteran Supportive Campus priority admissions',
      highlights:['Property tax exemption for disabled vets','Military retirement exempt from state income tax','Free AZ hunting/fishing licenses for 100% P&T','AZ Veteran Supportive Campus Program (education)','Disabled veteran home loan program'] },
  };
  const stateInfo = stateBenefits[selectedState] || stateBenefits.nv;

  // -----------------------------------------------------------------------
  // AVENUES
  // -----------------------------------------------------------------------
  const avenues = {
    expat: { label:'Live Abroad', title:'The Expat Veteran', tagline:'Your VA pay goes 3-10x further overseas.',
      bullets:[
        'VA disability pay transfers to ANY country with your US bank account',
        'Charles Schwab and similar banks refund all ATM fees worldwide',
        'VA healthcare available at select OCONUS clinics + travel reimbursement',
        '100% P&T = approx $3,737/mo - buys a luxury life in SE Asia or Latin America',
        'Top destinations: Portugal, Mexico, Thailand, Costa Rica, Colombia',
        'No federal income tax on VA disability - even abroad',
        'Keep US address for banking. File FBAR if foreign accounts exceed $10K',
      ], ctaText:'Explore Expat Resources', ctaUrl:'https://www.va.gov/pension/' },
    fire: { label:'Financial Freedom', title:'F.I.R.E. the Rat Race', tagline:'VA disability + GI Bill + investing = retire before 40.',
      bullets:[
        'VA disability is TAX-FREE income - invest the difference aggressively',
        'GI Bill (Chapter 33) pays BAH while you study - invest that too',
        'Vocational Rehabilitation (Chapter 31) can fund a business or training',
        'VA Home Loan: ZERO down, no PMI - build equity from day 1',
        'CRDP/CRSC: If retired military, collect BOTH retirement AND disability',
        '100% P&T = ZERO federal income tax on disability - massive tax shield',
        'Open a Roth IRA after separation - tax-free growth on tax-free income',
      ], ctaText:'VA Financial Benefits', ctaUrl:'https://www.benefits.va.gov' },
    education: { label:'Education', title:'Scholar Veteran', tagline:'Free degrees, monthly cash, and a new career funded by taxpayers.',
      bullets:[
        'Post-9/11 GI Bill (Ch. 33): 100% tuition + fees + $1,000/yr books + BAH',
        'Yellow Ribbon Program: top schools (law, medical, private) at NO cost',
        'Montgomery GI Bill (Ch. 30): $2,400+/mo even at already-free schools',
        'Vocational Rehabilitation (Ch. 31): for 10%+ rated vets - often better than GI Bill',
        'BAH during school = essentially paid to get a degree',
        'Use CLEP/DSST exams to test out of classes - faster degree, more money',
        'Stack: community college (free) then transfer to Yellow Ribbon school',
      ], ctaText:'Check GI Bill Eligibility', ctaUrl:'https://www.va.gov/education/eligibility/' },
    career: { label:'Civilian Career', title:'Mission: Civilian Career', tagline:'Federal jobs, clearance leverage, and placement pipelines.',
      bullets:[
        '5-point federal hiring preference (Honorable discharge)',
        '10-point preference if 10%+ disabled - major competitive advantage',
        'VA Schedule A: 30%+ disabled = direct hire without competing',
        'SkillBridge Program: intern at civilian companies the last 180 days of service',
        'Security clearance is valuable - tech and defense contractors pay premium',
        'Hiring Our Heroes: free corporate fellowships and placement assistance',
        'USAJOBS.gov: filter by veterans preference required for fastest federal wins',
      ], ctaText:'Search Federal Jobs', ctaUrl:'https://www.usajobs.gov' },
    disability: { label:'Live on Disability', title:'Disability-First Strategy', tagline:'Live completely on VA disability. More possible than you think.',
      bullets:[
        '100% P&T = $3,737 - $4,094+/mo tax-free (with dependents)',
        '100% P&T = FREE VA healthcare for life (no copays for service-connected)',
        '100% P&T = Commissary/BX/PX access retained',
        '100% P&T = CHAMPVA for dependents (free family healthcare)',
        'No earned income limit on VA disability - work as much as you want',
        '70% + unemployability = TDIU = 100% pay even at lower combined rating',
        'Combine with expat strategy: $3,737/mo goes very far abroad',
      ], ctaText:'Learn About TDIU', ctaUrl:'https://www.va.gov/disability/eligibility/special-claims/unemployability/' },
    entrepreneurship: { label:'Start a Business', title:'Veteran Entrepreneur', tagline:'SDVOSB set-asides and SBA support you did not know existed.',
      bullets:[
        'SDVOSB (Service-Disabled Veteran-Owned Small Business): sole-source federal contracts',
        'SBA Boots to Business - free 2-day entrepreneurship course through TAP',
        'Voc Rehab (Ch. 31): can fund self-employment for 10%+ disabled vets',
        'SBA Veterans Advantage: reduced loan fees plus Express loans',
        'Register at SAM.gov then get SDVOSB certification - access $25B+ in set-aside contracts',
        'GI Bill BAH covers living expenses while you take business courses',
        'TX, NV, FL = zero state income tax on business profits',
      ], ctaText:'SBA Boots to Business', ctaUrl:'https://boots2business.org' },
  };

  // -----------------------------------------------------------------------
  // DISCHARGE UPGRADE STEPS
  // -----------------------------------------------------------------------
  const upgradeSteps = [
    { title: 'Step 1 - Know Your Board',
      body: [
        'Discharge Review Board (DRB): if discharged less than 15 years ago. Can upgrade OTH and General discharges.',
        'Board for Correction of Military Records (BCMR / BCNR): all branches, any time. Reviews characterization of service.',
        'Note for Navy and USMC: the BCNR (Board for Correction of Naval Records) handles both branches.',
        'Automatic upgrades: DoD 2023 guidance - many OTH discharges related to PTSD, MST, or mental health may qualify for automatic upgrade review.',
      ]},
    { title: 'Step 2 - Gather Your Evidence',
      body: [
        'DD-214 - your most important document. Request via milConnect.com or eVetRecs.',
        'Service Records (SMR) - request your complete SMR through the National Archives (NPRC).',
        'Medical Records - especially mental health records from service.',
        'Buddy Statements - written statements from fellow service members (VA Form 21-4142).',
        'Personal Statement - your own account of the circumstances. Be specific and factual.',
        'Mental Health Diagnosis - if PTSD, MST, or TBI contributed to your discharge, include a psychiatric evaluation.',
        'Key argument: Liberal Consideration memos (Kurta, Hagel, Carson) require boards to give special weight to PTSD/MST/TBI-related discharges.',
      ]},
    { title: 'Step 3 - Write Your Application',
      body: [
        'For DRB: use DD Form 293. Focus on clemency, procedural error, or inequity (disproportionate punishment).',
        'For BCMR/BCNR: use DD Form 149. Focus on error or injustice in the record.',
        'Include mental health nexus to misconduct (PTSD, MST, TBI).',
        'Argue that your service as a whole outweighs the separation reason.',
        'Hire a VSO or attorney - National Veterans Legal Services Program (NVLSP) offers free help.',
        'American Bar Association Military Pro Bono Project offers FREE legal representation.',
      ]},
    { title: 'Step 4 - Submit and Advocate',
      body: [
        'Complete DD Form 293 (DRB) or DD Form 149 (BCMR) with all supporting documents.',
        'Include personal statement, buddy letters, and mental health evaluation.',
        'DRB decisions: typically 12-18 months. BCMR/BCNR decisions: 12-24 months.',
        'Request a personal appearance hearing for DRB - highly recommended.',
        'If denied: appeal to the Court of Appeals for Veterans Claims (CAVC) with a VA-accredited attorney.',
      ]},
  ];

  // -----------------------------------------------------------------------
  // TIMELINE
  // -----------------------------------------------------------------------
  const getTimelineItems = () => {
    const sep = alreadyOut ? 0 : separationMonths;
    const items = [];
    if (!alreadyOut) {
      if (sep >= 12) items.push({ time:'12 Months Out', tasks:['Start TAP (Transition Assistance Program)','Begin VA disability claims pre-separation','Explore SkillBridge internship opportunities','Research Yellow Ribbon schools if using GI Bill'] });
      if (sep >= 6)  items.push({ time:'6 Months Out',  tasks:['File VA disability claim (pre-discharge program)','Get ALL medical conditions documented in sick call / medical records','Request complete military medical records','Begin networking on LinkedIn - add your MOS translation'] });
      if (sep >= 3)  items.push({ time:'3 Months Out',  tasks:['Schedule separation physical - document EVERYTHING','Apply for VA healthcare enrollment','Contact local VSO for free claims assistance (DAV, VFW, American Legion)','Research state benefits for your target state'] });
      if (sep >= 1)  items.push({ time:'1 Month Out',   tasks:['Review DD-214 for accuracy before signing','Ensure all awards and decorations are listed correctly','Set up VA.gov account','Apply for GI Bill (if using)','Open civilian bank account (USAA or Navy Federal are veteran-friendly)'] });
    }
    items.push({ time: alreadyOut ? 'Right Now - Immediate Actions' : 'After Separation', tasks: [
      'Enroll in VA healthcare at VA.gov (do this even if you feel healthy)',
      'File disability claim if not already done - earlier is always better',
      dischargeType !== 'honorable' ? 'Begin discharge upgrade process - see the Discharge tab' : 'Confirm DD-214 reflects Honorable discharge',
      'Apply for Voc Rehab (Chapter 31) if you have or expect a 10%+ rating',
      'Register at USAJOBS.gov with veteran preference',
      'Connect with local VSO - VFW, DAV, American Legion are all FREE',
    ]});
    items.push({ time:'3-6 Months Post-Separation', tasks:[
      'Follow up on VA disability claim status at VA.gov/claim-or-appeal-status',
      'Submit supplemental claims for any denied conditions',
      servedPost911 ? 'Check PACT Act eligibility for burn pit or toxic exposure - see Claims tab' : 'Request full C-file review from VA',
      'Attend ALL C&P exams - never cancel. Describe your worst day.',
      'Research state-specific benefits in your home state - see Benefits tab',
      'Consider opening a Roth IRA with first tax-free VA disability pay',
    ]});
    items.push({ time:'6-12 Months - Building Your New Life', tasks:[
      'If using GI Bill: enroll in school and start collecting BAH stipend',
      'Review combined disability rating and consider additional or secondary claims',
      'If 70%+ rated: research TDIU eligibility in the Claims tab',
      'Connect with veteran entrepreneurs if starting a business',
      'File for CRSC if retired military with combat-related disability',
      'Re-evaluate life insurance: VGLI is available after separation',
    ]});
    return items;
  };

  // -----------------------------------------------------------------------
  // MISSION SCORE
  // -----------------------------------------------------------------------
  const getMissionScore = () => {
    let score = 0;
    const items = [];
    if (currentRating >= 10) { score += 20; items.push({ done:true,  text:'VA Disability Rating Filed' }); }
    else                     {              items.push({ done:false, text:'File VA Disability Claim' }); }
    if (currentRating >= 70) { score += 20; items.push({ done:true,  text:'Rating 70%+ (TDIU eligible)' }); }
    else                     {              items.push({ done:false, text:'Increase Rating to 70%+' }); }
    if (currentRating >= 100){ score += 20; items.push({ done:true,  text:'100% P&T Status Achieved' }); }
    else                     {              items.push({ done:false, text:'Reach 100% P&T' }); }
    if (dischargeType === 'honorable') { score += 15; items.push({ done:true,  text:'Honorable Discharge' }); }
    else                               {              items.push({ done:false, text:'Discharge Upgrade Pending' }); }
    if (yearsOfService >= 4) { score += 10; items.push({ done:true,  text:'Full GI Bill Eligibility (36 months)' }); }
    else                     {              items.push({ done:false, text:'Partial GI Bill (pro-rated)' }); }
    score += 15; items.push({ done:true, text:'Using Veteran Benefits Compass' });
    return { score: Math.min(score, 100), items };
  };
  const mission = getMissionScore();

  // -----------------------------------------------------------------------
  // SHARED COMPONENTS
  // -----------------------------------------------------------------------
  const CrisisBanner = () => (
    <div className="fixed bottom-4 right-4 z-50">
      {showCrisis ? (
        <div className="bg-red-900 border border-red-500 rounded-xl p-4 max-w-xs shadow-2xl">
          <div className="flex justify-between items-start mb-2">
            <span className="text-red-300 font-bold text-sm">Veterans Crisis Line</span>
            <button onClick={()=>setShowCrisis(false)} className="text-gray-400 hover:text-white ml-2"><X size={14}/></button>
          </div>
          <p className="text-white font-bold text-xl">Dial 988, then Press 1</p>
          <p className="text-gray-300 text-xs mt-1">Text: 838255</p>
          <p className="text-gray-300 text-xs">Chat: VeteransCrisisLine.net</p>
          <p className="text-gray-400 text-xs mt-2">Available 24/7. You are not alone.</p>
        </div>
      ) : (
        <button onClick={()=>setShowCrisis(true)} className="bg-red-700 hover:bg-red-600 text-white rounded-full px-4 py-2 text-xs font-bold shadow-lg flex items-center gap-1 transition-all">
          <Phone size={12}/> Crisis Line
        </button>
      )}
    </div>
  );

  // -----------------------------------------------------------------------
  // LANDING PAGE
  // -----------------------------------------------------------------------
  if (currentPage === 'landing') return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <CrisisBanner/>
      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-scarlet/10 rounded-full blur-3xl"/>
        </div>
        {/* subtle crayon easter egg */}
        <div className="absolute top-8 right-8 text-4xl opacity-10 hover:opacity-60 transition-opacity cursor-default select-none" title="Every Marine's secret weapon">
          {String.fromCodePoint(0x1F58D)}
        </div>
        <div className="relative z-10 w-full max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="text-scarlet" size={36}/>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Veteran Benefits <span className="text-scarlet">Compass</span>
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-2">
            The <span className="text-gold font-bold">ultimate transition guide</span> - from every branch, for every path.
          </p>
          <p className="text-gray-400 mb-10 text-sm">
            No one tells you what you are owed. We do. Step by step. Hand in hand.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10 text-left">
            {[
              { icon:<FileText size={18}/>,  title:'Medical File Scanner',  desc:'Upload records and get your claim blueprint' },
              { icon:<Target size={18}/>,    title:'Roadmap to 100% P&T',   desc:'VA math, medical terms, stacking guide' },
              { icon:<Globe size={18}/>,     title:'6 Life Paths',          desc:'Expat, FIRE, career, entrepreneurship and more' },
              { icon:<MapPin size={18}/>,    title:'State Benefits Matrix',  desc:'NV, CA, TX, FL, WA, AZ deep-dives' },
              { icon:<Award size={18}/>,     title:'Discharge Upgrade',     desc:'DRB, BCMR, liberal consideration guide' },
              { icon:<Phone size={18}/>,     title:'Crisis and Resources',  desc:'VSO locator, crisis line, key contacts' },
            ].map((f,i)=>(
              <div key={i} className="bg-gray-900 border border-gray-700 hover:border-scarlet/50 rounded-xl p-3 transition-all">
                <div className="text-scarlet mb-1">{f.icon}</div>
                <div className="font-bold text-sm text-white">{f.title}</div>
                <div className="text-xs text-gray-400">{f.desc}</div>
              </div>
            ))}
          </div>
          <button
            onClick={()=>{ setCurrentPage('wizard'); setWizardStep(0); }}
            className="bg-scarlet hover:bg-red-700 text-white font-black text-lg px-12 py-4 rounded-full shadow-xl transition-all hover:shadow-2xl flex items-center gap-2 mx-auto">
            Begin Mission Briefing <ArrowRight size={20}/>
          </button>
          <p className="text-gray-600 text-xs mt-3">Takes about 3 minutes. Completely private. No data stored.</p>
        </div>
      </div>
      <div className="text-center text-gray-600 text-xs pb-4 px-4">
        For informational purposes only. Not legal or medical advice. Always consult a VA-accredited VSO or attorney for your specific situation.
      </div>
    </div>
  );

  // -----------------------------------------------------------------------
  // WIZARD
  // -----------------------------------------------------------------------
  if (currentPage === 'wizard') {
    const steps = ['Branch','Status','Health','Your Path'];

    const WizardStep = () => {
      switch(wizardStep) {

        case 0: return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-black mb-1">Which branch did you serve?</h2>
              <p className="text-gray-400 text-sm">Your portal is customized to your service.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(branchData).map(([key,b])=>(
                <button key={key} onClick={()=>setBranch(key)}
                  className={"p-4 rounded-xl border-2 text-left transition-all " + (branch===key ? "border-scarlet bg-gray-800 scale-105" : "border-gray-700 hover:border-gray-500 bg-gray-900")}>
                  <div className="font-black text-lg mb-1">{b.badge}</div>
                  <div className="font-bold text-sm">{b.name}</div>
                </button>
              ))}
            </div>
          </div>
        );

        case 1: return (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="text-2xl font-black mb-1">What is your current status?</h2>
              <p className="text-gray-400 text-sm">This shapes your entire action plan.</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-3 font-bold"><Flag size={16} className="text-scarlet"/> Separation Status</div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[{ val:false, label:'Still Active / Upcoming ' + bd.sep },{ val:true, label:'Already Separated / Veteran' }].map(opt=>(
                  <button key={String(opt.val)} onClick={()=>setAlreadyOut(opt.val)}
                    className={"p-3 rounded-lg border text-sm font-medium transition-all text-center " + (alreadyOut===opt.val ? "border-scarlet bg-scarlet/10 text-scarlet" : "border-gray-600 hover:border-gray-400 text-gray-300")}>
                    {opt.label}
                  </button>
                ))}
              </div>
              {!alreadyOut && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Months until {bd.sep}</span>
                    <span className={"font-bold " + bd.text}>{separationMonths} months</span>
                  </div>
                  <input type="range" min={1} max={24} value={separationMonths} onChange={e=>setSeparationMonths(Number(e.target.value))}
                    className="w-full h-3 rounded-full cursor-pointer accent-red-600"/>
                  <div className="flex gap-2 mt-3">
                    {[6,12,18,24].map(v=>(
                      <button key={v} onClick={()=>setSeparationMonths(v)}
                        className={"flex-1 text-xs py-1.5 rounded-lg border transition-all " + (separationMonths===v ? "border-scarlet bg-scarlet/10 text-scarlet" : "border-gray-600 text-gray-400 hover:border-gray-400")}>
                        {v}mo
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-3 font-bold"><Award size={16} className="text-scarlet"/> Discharge Characterization</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { val:'honorable', label:'Honorable',                 sub:'Full access to all benefits' },
                  { val:'general',   label:'General (Under Honorable)', sub:'Most benefits, limited GI Bill' },
                  { val:'oth',       label:'Other Than Honorable (OTH)',sub:'Very limited - upgrade recommended' },
                  { val:'bad_conduct',label:'Bad Conduct / Dishonorable',sub:'Upgrade process available' },
                ].map(d=>(
                  <button key={d.val} onClick={()=>setDischargeType(d.val)}
                    className={"p-3 rounded-lg border text-left text-xs transition-all " + (dischargeType===d.val ? "border-scarlet bg-scarlet/10" : "border-gray-600 hover:border-gray-400")}>
                    <div className="font-bold">{d.label}</div>
                    <div className="text-gray-400 mt-0.5">{d.sub}</div>
                  </button>
                ))}
              </div>
              {dischargeType !== 'honorable' && (
                <div className="mt-3 p-3 bg-amber-900/20 border border-amber-700/40 rounded-lg text-xs text-amber-300">
                  Discharge upgrade may be possible. Your dashboard includes a full step-by-step upgrade guide.
                </div>
              )}
            </div>

            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-3 font-bold"><Calendar size={16} className="text-scarlet"/> Years of Service</div>
              <div className="grid grid-cols-5 gap-2">
                {[1,2,3,4,6,8,10,12,16,20].map(y=>(
                  <button key={y} onClick={()=>setYearsOfService(y)}
                    className={"py-2 text-sm rounded-lg border transition-all " + (yearsOfService===y ? "border-scarlet bg-scarlet/10 text-scarlet font-bold" : "border-gray-600 text-gray-300 hover:border-gray-400")}>
                    {y}yr
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

        case 2: return (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="text-2xl font-black mb-1">Health and Disability Profile</h2>
              <p className="text-gray-400 text-sm">Honest answers unlock the most accurate benefit plan.</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-3 font-bold"><Shield size={16} className="text-scarlet"/> VA Disability Status</div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { val:'none',    label:'No Rating Yet',           sub:'Never filed a claim' },
                  { val:'pending', label:'Pending / In Process',    sub:'Filed, awaiting decision' },
                  { val:'filed',   label:'Filed, Needs Increase',   sub:'Have rating, want more' },
                  { val:'rated',   label:'Have an Established Rating', sub:'Know your current rating' },
                ].map(s=>(
                  <button key={s.val} onClick={()=>setDisabilityStatus(s.val)}
                    className={"p-3 rounded-lg border text-left text-xs transition-all " + (disabilityStatus===s.val ? "border-scarlet bg-scarlet/10" : "border-gray-600 hover:border-gray-400")}>
                    <div className="font-bold">{s.label}</div>
                    <div className="text-gray-400 mt-0.5">{s.sub}</div>
                  </button>
                ))}
              </div>
              {(disabilityStatus === 'rated' || disabilityStatus === 'filed') && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Current Combined Rating</span>
                    <span className={"font-black text-xl " + bd.text}>{currentRating}%</span>
                  </div>
                  <input type="range" min={0} max={100} step={10} value={currentRating} onChange={e=>setCurrentRating(Number(e.target.value))}
                    className="w-full h-3 rounded-full cursor-pointer accent-red-600"/>
                  <div className="flex justify-between text-xs text-gray-500 mt-1"><span>0%</span><span>50%</span><span>100%</span></div>
                </div>
              )}
            </div>

            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-3 font-bold"><ShieldAlert size={16} className="text-amber-400"/> Service Exposure (select all that apply)</div>
              <div className="space-y-2">
                {[
                  { state:servedPost911,    setter:setServedPost911,    label:'Served post-9/11 (after September 11, 2001)' },
                  { state:exposedBurnPit,   setter:setExposedBurnPit,   label:'Exposed to burn pits, contaminated water, or toxic chemicals during service' },
                  { state:mstFlag,          setter:setMstFlag,          label:'Experienced Military Sexual Trauma (MST) - private and confidential' },
                ].map((item,i)=>(
                  <button key={i} onClick={()=>item.setter(!item.state)}
                    className={"w-full p-3 rounded-lg border text-left text-sm flex items-center gap-3 transition-all " + (item.state ? "border-amber-600 bg-amber-900/20" : "border-gray-600 hover:border-gray-500")}>
                    <div className={"w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 " + (item.state ? "border-amber-400 bg-amber-500" : "border-gray-500")}>
                      {item.state && <CheckCircle size={12} className="text-white"/>}
                    </div>
                    <span className={item.state ? "text-amber-200" : "text-gray-300"}>{item.label}</span>
                  </button>
                ))}
              </div>
              {exposedBurnPit && (
                <div className="mt-3 p-3 bg-orange-900/20 border border-orange-600/40 rounded-lg text-xs text-orange-300">
                  PACT Act Alert: You may qualify for burn pit presumptive claims with no nexus letter required. Your Claims Roadmap will cover this.
                </div>
              )}
            </div>
          </div>
        );

        case 3: return (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="text-2xl font-black mb-1">Your Future Mission</h2>
              <p className="text-gray-400 text-sm">We will build your personalized action plan around your goals.</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-3 font-bold"><Compass size={16} className="text-scarlet"/> Primary Path</div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(avenues).map(([key,a])=>(
                  <button key={key} onClick={()=>setFuturePath(key)}
                    className={"p-3 rounded-lg border text-left transition-all " + (futurePath===key ? "border-scarlet bg-scarlet/10" : "border-gray-600 hover:border-gray-400")}>
                    <div className="font-bold text-sm">{a.label}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{a.tagline}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-3 font-bold"><MapPin size={16} className="text-scarlet"/> Target State (for state benefits)</div>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(stateBenefits).map(([key,s])=>(
                  <button key={key} onClick={()=>setSelectedState(key)}
                    className={"p-2 rounded-lg border text-sm transition-all " + (selectedState===key ? "border-scarlet bg-scarlet/10 text-scarlet font-bold" : "border-gray-600 hover:border-gray-400 text-gray-300")}>
                    {s.emoji} {s.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-3 font-bold"><Users size={16} className="text-scarlet"/> Dependent Status <span className="text-xs text-gray-500 font-normal">(affects VA pay rate)</span></div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { val:'single',        label:'Single - No Dependents' },
                  { val:'unmarried_kids',label:'Single Parent (children, not married)' },
                  { val:'spouse',        label:'Married, No Children' },
                  { val:'family',        label:'Married with Children' },
                ].map(d=>(
                  <button key={d.val} onClick={()=>setHasDependents(d.val)}
                    className={"p-3 rounded-lg border text-sm transition-all " + (hasDependents===d.val ? "border-scarlet bg-scarlet/10 text-white font-medium" : "border-gray-600 hover:border-gray-400 text-gray-300")}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

        default: return null;
      }
    };

    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <CrisisBanner/>
        <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-4">
          <button onClick={()=>setCurrentPage('landing')} className="text-gray-500 hover:text-white transition-colors"><ChevronLeft size={20}/></button>
          <div className="flex-1">
            <div className="flex gap-1 mb-1">
              {steps.map((_,i)=><div key={i} className={"flex-1 h-2 rounded-full transition-all " + (i<=wizardStep ? "bg-scarlet" : "bg-gray-700")}/>)}
            </div>
            <div className="flex justify-between text-xs">
              {steps.map((s,i)=><span key={i} className={i===wizardStep ? "text-scarlet font-bold" : i<wizardStep ? "text-gray-400" : "text-gray-600"}>{s}</span>)}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto p-4 md:p-8"><WizardStep/></div>
        </div>
        <div className="bg-gray-900 border-t border-gray-800 p-4 flex gap-3 max-w-2xl mx-auto w-full">
          {wizardStep > 0 && (
            <button onClick={()=>setWizardStep(w=>w-1)} className="flex-1 py-3 border border-gray-700 rounded-xl font-bold hover:border-gray-500 transition-all flex items-center justify-center gap-2">
              <ChevronLeft size={16}/> Back
            </button>
          )}
          {wizardStep < steps.length - 1 ? (
            <button onClick={()=>setWizardStep(w=>w+1)} className="flex-1 py-3 bg-scarlet hover:bg-red-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
              Next Step <ChevronRight size={16}/>
            </button>
          ) : (
            <button onClick={()=>{ setCurrentPage('dashboard'); setActiveTab('mission'); }} className="flex-1 py-3 bg-scarlet hover:bg-red-700 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2">
              Launch Dashboard <ArrowRight size={18}/>
            </button>
          )}
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // DASHBOARD
  // -----------------------------------------------------------------------
  const tabs = [
    { id:'mission',   icon:<Target size={14}/>,   label:'Mission Control' },
    { id:'avenues',   icon:<Compass size={14}/>,  label:'Life Paths' },
    { id:'claims',    icon:<TrendingUp size={14}/>,label:'Claims Roadmap' },
    { id:'scanner',   icon:<Cpu size={14}/>,       label:'Med Scanner' },
    { id:'benefits',  icon:<DollarSign size={14}/>,label:'State Benefits' },
    { id:'timeline',  icon:<Calendar size={14}/>,  label:'Timeline' },
    { id:'upgrade',   icon:<Award size={14}/>,     label:'Discharge' },
    { id:'resources', icon:<Phone size={14}/>,     label:'Resources' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <CrisisBanner/>

      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Shield className="text-scarlet" size={20}/>
          <span className="font-black text-lg">VBC <span className="text-gray-500 font-normal text-sm">| {bd.name}</span></span>
        </div>
        <div className="flex items-center gap-3">
          <span className={"text-xs font-bold px-2 py-1 rounded-full bg-gray-800 " + bd.text}>
            {bd.badge} {currentRating > 0 ? currentRating + "% Rated" : "Unrated"}
          </span>
          <button onClick={()=>setCurrentPage('wizard')} className="text-xs text-gray-500 hover:text-scarlet flex items-center gap-1 transition-colors">
            <Edit3 size={12}/> Edit Profile
          </button>
        </div>
      </div>

      <div className="bg-gray-900 border-b border-gray-800 overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)}
              className={"flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-all whitespace-nowrap " + (activeTab===t.id ? "border-scarlet text-scarlet" : "border-transparent text-gray-400 hover:text-gray-200")}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-5">

          {/* === MISSION CONTROL === */}
          {activeTab === 'mission' && (<>
            <div>
              <h2 className="text-2xl font-black mb-1">Mission Control</h2>
              <p className="text-gray-400 text-sm">Your personalized benefit overview - everything you have earned.</p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-gray-400 text-sm">Benefits Activation Score</div>
                  <div className="text-5xl font-black text-scarlet">{mission.score}<span className="text-2xl text-gray-500">/100</span></div>
                </div>
                <div className="w-24 h-24 relative">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#374151" strokeWidth="3"/>
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#dc2626" strokeWidth="3"
                      strokeDasharray={mission.score + " " + (100-mission.score)} strokeLinecap="round"/>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-lg font-black">{mission.score}%</div>
                </div>
              </div>
              <div className="space-y-2">
                {mission.items.map((item,i)=>(
                  <div key={i} className={"flex items-center gap-2 text-sm " + (item.done ? "text-gray-200" : "text-gray-500")}>
                    {item.done
                      ? <CheckCircle size={14} className="text-green-400 flex-shrink-0"/>
                      : <div className="w-3.5 h-3.5 rounded-full border border-gray-600 flex-shrink-0"/>}
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {currentRating >= 10 && (
              <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-4">
                <div className="text-green-300 font-bold text-sm mb-1">Estimated Monthly VA Tax-Free Income</div>
                <div className="text-4xl font-black text-white">${monthlyPay.toLocaleString()}<span className="text-sm text-gray-400 font-normal">/mo</span></div>
                <div className="text-green-400 text-xs mt-1">${annualPay.toLocaleString()}/year - completely tax-free, for life</div>
                <div className="text-gray-500 text-xs mt-1">Based on {roundedRating}% rating - {hasDependents.replace('_',' ')} - 2024 VA rate tables</div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label:'Branch',       value: bd.badge + ' ' + bd.name },
                { label:'Status',       value: alreadyOut ? 'Veteran (Separated)' : separationMonths + 'mo to ' + bd.sep },
                { label:'Discharge',    value: dischargeType === 'honorable' ? 'Honorable' : dischargeType.toUpperCase() },
                { label:'Target State', value: stateInfo.emoji + ' ' + stateInfo.name },
              ].map((c,i)=>(
                <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-3">
                  <div className="text-gray-500 text-xs mb-1">{c.label}</div>
                  <div className="font-bold text-sm">{c.value}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {dischargeType !== 'honorable' && (
                <div className="flex items-start gap-3 p-3 bg-amber-900/20 border border-amber-700/40 rounded-xl text-sm">
                  <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5"/>
                  <div><span className="font-bold text-amber-300">Discharge Upgrade Available - </span>Your discharge may limit benefits. Use the Discharge tab for a step-by-step upgrade guide.</div>
                </div>
              )}
              {exposedBurnPit && (
                <div className="flex items-start gap-3 p-3 bg-orange-900/20 border border-orange-600/40 rounded-xl text-sm">
                  <Zap size={16} className="text-orange-400 flex-shrink-0 mt-0.5"/>
                  <div><span className="font-bold text-orange-300">PACT Act Eligible - </span>Burn pit exposure qualifies you for presumptive claims. No nexus letter required. File now.</div>
                </div>
              )}
              {mstFlag && (
                <div className="flex items-start gap-3 p-3 bg-purple-900/20 border border-purple-600/40 rounded-xl text-sm">
                  <Shield size={16} className="text-purple-400 flex-shrink-0 mt-0.5"/>
                  <div><span className="font-bold text-purple-300">MST Claims Support - </span>Reduced stressor evidence requirements. Claims are handled confidentially. See the Resources tab for MST-specific contacts.</div>
                </div>
              )}
              {currentRating >= 70 && currentRating < 100 && (
                <div className="flex items-start gap-3 p-3 bg-blue-900/20 border border-blue-600/40 rounded-xl text-sm">
                  <TrendingUp size={16} className="text-blue-400 flex-shrink-0 mt-0.5"/>
                  <div><span className="font-bold text-blue-300">TDIU May Apply - </span>At {currentRating}%, if your service-connected disabilities prevent gainful employment, you can receive 100% pay. See Claims tab.</div>
                </div>
              )}
              {disabilityStatus === 'none' && (
                <div className="flex items-start gap-3 p-3 bg-red-900/20 border border-red-700/40 rounded-xl text-sm">
                  <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5"/>
                  <div><span className="font-bold text-red-300">No Claim Filed - </span>If you served and have ANY physical or mental health condition, you likely qualify. Use the Med Scanner tab to identify your claims.</div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { label:'File a Claim',      url:'https://www.va.gov/disability/file-disability-claim/', icon:<Plus size={14}/> },
                  { label:'Find a VSO',         url:'https://www.va.gov/ogc/apps/accreditation/index.asp', icon:<Users size={14}/> },
                  { label:'Check Claim Status', url:'https://www.va.gov/claim-or-appeal-status/',          icon:<Search size={14}/> },
                  { label:'VA Healthcare',      url:'https://www.va.gov/health-care/apply-for-health-care-form-10-10ez/', icon:<Heart size={14}/> },
                ].map((a,i)=>(
                  <a key={i} href={a.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-gray-900 border border-gray-700 hover:border-scarlet/50 rounded-xl text-xs font-medium transition-all group">
                    <span className="text-scarlet group-hover:scale-110 transition-transform">{a.icon}</span>{a.label}
                  </a>
                ))}
              </div>
            </div>
          </>)}

          {/* === LIFE PATHS === */}
          {activeTab === 'avenues' && (<>
            <div>
              <h2 className="text-2xl font-black mb-1">Life Paths and Avenues</h2>
              <p className="text-gray-400 text-sm">Possibilities most veterans never knew existed. Explore them all.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(avenues).map(([key,a])=>(
                <button key={key} onClick={()=>setActiveAvenue(key)}
                  className={"px-3 py-2 rounded-full text-xs font-bold border transition-all " + (activeAvenue===key ? "bg-scarlet border-scarlet text-white" : "border-gray-600 text-gray-400 hover:border-gray-400")}>
                  {a.label}
                </button>
              ))}
            </div>
            {(() => {
              const av = avenues[activeAvenue];
              return (
                <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
                  <h3 className="text-xl font-black mb-1">{av.title}</h3>
                  <p className="text-scarlet font-medium text-sm mb-4">{av.tagline}</p>
                  <ul className="space-y-2 mb-5">
                    {av.bullets.map((b,i)=>(
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-200">
                        <CheckCircle size={14} className="text-green-400 flex-shrink-0 mt-0.5"/>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <a href={av.ctaUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-scarlet hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all">
                    {av.ctaText} <ExternalLink size={13}/>
                  </a>
                </div>
              );
            })()}
            <div className="bg-blue-950/30 border border-blue-700/30 rounded-xl p-4 text-sm">
              <div className="text-blue-300 font-bold mb-1">Did You Know?</div>
              <div className="text-gray-300">VA disability pay is not counted as earned income for federal tax purposes. It is completely tax-free income you can stack on top of any career, business, or investment income. There is no limit on how much you can earn while receiving VA disability compensation (unless on TDIU).</div>
            </div>
          </>)}

          {/* === CLAIMS ROADMAP === */}
          {activeTab === 'claims' && (<>
            <div>
              <h2 className="text-2xl font-black mb-1">Roadmap to 100% P&T</h2>
              <p className="text-gray-400 text-sm">Every tool you need to maximize your rating - legally and legitimately.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id:'math',       label:'VA Math' },
                { id:'terms',      label:'Claim Terms' },
                { id:'secondaries',label:'Secondary Claims' },
                { id:'evidence',   label:'Evidence Guide' },
                { id:'pact',       label:'PACT Act' },
                { id:'tdiu',       label:'TDIU' },
              ].map(s=>(
                <button key={s.id} onClick={()=>setClaimsSubTab(s.id)}
                  className={"px-3 py-1.5 rounded-full text-xs font-bold border transition-all " + (claimsSubTab===s.id ? "bg-scarlet border-scarlet text-white" : "border-gray-600 text-gray-400 hover:border-gray-400")}>
                  {s.label}
                </button>
              ))}
            </div>

            {claimsSubTab === 'math' && (
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 space-y-4">
                <div>
                  <h3 className="font-black mb-1">Interactive VA Math Simulator</h3>
                  <p className="text-gray-400 text-xs">VA uses whole-person math, not simple addition. See exactly how your combined rating is calculated.</p>
                </div>
                <div className="space-y-2">
                  {claimsList.map((val,i)=>(
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-6">#{i+1}</span>
                      <select value={val} onChange={e=>{ const c=[...claimsList]; c[i]=Number(e.target.value); setClaimsList(c); }}
                        className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-1.5 text-sm flex-1">
                        {[10,20,30,40,50,60,70,80,90].map(v=><option key={v} value={v}>{v}%</option>)}
                      </select>
                      <button onClick={()=>setClaimsList(claimsList.filter((_,j)=>j!==i))} className="text-gray-500 hover:text-red-400 transition-colors">
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <select value={newClaimVal} onChange={e=>setNewClaimVal(Number(e.target.value))}
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-1.5 text-sm flex-1">
                    {[10,20,30,40,50,60,70,80,90].map(v=><option key={v} value={v}>{v}%</option>)}
                  </select>
                  <button onClick={()=>setClaimsList([...claimsList,newClaimVal])}
                    className="flex items-center gap-1 bg-scarlet hover:bg-red-700 px-3 py-1.5 rounded-lg text-sm font-bold transition-all">
                    <Plus size={14}/> Add Claim
                  </button>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 text-center">
                  <div className="text-gray-400 text-sm mb-1">Combined VA Math Result</div>
                  <div className="text-5xl font-black text-scarlet">{combinedRaw}%</div>
                  <div className="text-gray-400 text-sm mt-1">VA rounds to: <span className="text-white font-black text-2xl">{roundedRating}%</span></div>
                  <div className="text-green-400 text-sm mt-2 font-bold">
                    Approx ${(vaPayTable[roundedRating] || vaPayTable[0])[depKey]?.toLocaleString() || '0'}/month tax-free
                  </div>
                </div>
                <div className="p-3 bg-blue-900/20 border border-blue-700/40 rounded-lg text-xs text-blue-300">
                  How VA Math works: Start with 100% whole person. Your highest rating (50%) takes 50% of that = 50 disabled, 50 remaining. Next claim (30%) takes 30% of the remaining 50 = 15 more. Total = 65%, which rounds to 70%. Always list your highest rating first.
                </div>
              </div>
            )}

            {claimsSubTab === 'terms' && (
              <div className="space-y-3">
                <div className="bg-amber-900/20 border border-amber-700/40 rounded-xl p-3 text-xs text-amber-300">
                  Critical Rule: Never say "back pain" - say "Lumbosacral Strain (DC 5237)". The exact VA terminology determines your diagnostic code and rating schedule. Use these terms on every claim form and in every C&P exam.
                </div>
                <div className="grid gap-3">
                  {[
                    { wrong:'Back pain / lower back problems',          right:'Lumbosacral Strain (DC 5237) or Intervertebral Disc Syndrome IVDS (DC 5243)',   tip:'Claim BOTH if discs are involved.' },
                    { wrong:'Neck pain',                                right:'Cervical Strain (DC 5237) or Cervical IVDS (DC 5243)',                           tip:'Claim radiculopathy secondary if arm symptoms are present.' },
                    { wrong:'Ringing in ears',                          right:'Tinnitus (DC 6260)',                                                             tip:'Easiest 10% claim. File now if not already done.' },
                    { wrong:'Knee problems',                            right:'Limitation of Flexion, Knee (DC 5260) plus Knee Instability (DC 5257)',          tip:'Claim both limitation AND instability - they are rated separately.' },
                    { wrong:'Shoulder injury',                          right:'Limitation of Motion of the Arm (DC 5201) or Scapulohumeral Articulation (DC 5200)', tip:'Dominant arm rates higher. File bilateral if both shoulders are affected.' },
                    { wrong:'Nightmares and anxiety from deployment',   right:'Post-Traumatic Stress Disorder PTSD (DC 9411)',                                  tip:'No combat required since 2010. Any in-service stressor qualifies.' },
                    { wrong:'Feeling depressed since service',          right:'Major Depressive Disorder (DC 9434) or Persistent Depressive Disorder (DC 9433)', tip:'File secondary to PTSD, chronic pain, or TBI for easier approval.' },
                    { wrong:'Trouble sleeping or snoring',              right:'Obstructive Sleep Apnea (DC 6847)',                                              tip:'Get a sleep study. If prescribed CPAP, that is an automatic 50%. File secondary to PTSD, obesity, or TBI.' },
                    { wrong:'Acid reflux or heartburn',                 right:'Gastroesophageal Reflux Disease GERD (DC 7346)',                                 tip:'Secondary to stress and PTSD. Very common and very winnable.' },
                    { wrong:'Foot pain or flat feet',                   right:'Pes Planus / Flatfoot (DC 5276) or Plantar Fasciitis (DC 5284)',                 tip:'File bilateral (both feet) for a doubled evaluation.' },
                    { wrong:'Headaches',                                right:'Migraine Headaches (DC 8100)',                                                   tip:'Rated by frequency of prostrating attacks per month. Keep a headache diary.' },
                    { wrong:'Numbness in arms or legs',                 right:'Radiculopathy Upper Extremity (DC 8510-8519) or Lower Extremity (DC 8520-8530)', tip:'Secondary to spine conditions. Rate each limb separately.' },
                    { wrong:'Memory problems or brain fog after blast', right:'Traumatic Brain Injury TBI (DC 8045)',                                           tip:'Highly underrated. Push for cognitive and emotional symptoms to be evaluated.' },
                  ].map((t,i)=>(
                    <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                      <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1">
                          <div className="text-xs text-red-400 font-bold mb-1">Do NOT say:</div>
                          <div className="text-sm text-gray-400 italic">"{t.wrong}"</div>
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-green-400 font-bold mb-1">Say this instead:</div>
                          <div className="text-sm text-white font-medium">"{t.right}"</div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-blue-300 bg-blue-900/20 border border-blue-700/30 rounded-lg p-2">Tip: {t.tip}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {claimsSubTab === 'secondaries' && (
              <div className="space-y-3">
                <p className="text-gray-400 text-sm">Secondary claims are conditions caused or aggravated by a service-connected condition. You only need to prove the secondary was caused by your already-rated condition - not that it was caused directly by military service.</p>
                {[
                  { primary:'PTSD / Anxiety / Depression', secondaries:['Sleep Apnea (50% auto if CPAP)','GERD / Irritable Bowel Syndrome','Hypertension (high blood pressure)','Erectile Dysfunction (10% if medication needed)','Migraine Headaches','Chronic Fatigue'] },
                  { primary:'Lower Back (Lumbar Spine)',   secondaries:['Radiculopathy lower extremity (legs)','Hip Condition (DJD)','Knee Condition','Bladder or Bowel Dysfunction','Sleep Apnea (pain prevents comfortable sleep)'] },
                  { primary:'Cervical Spine (Neck)',       secondaries:['Radiculopathy upper extremity (arms or hands)','Carpal Tunnel Syndrome','Migraine Headaches','Sleep Apnea'] },
                  { primary:'Sleep Apnea',                 secondaries:['Hypertension','Cardiovascular Disease','Depression / Major Depressive Disorder','Erectile Dysfunction','Cognitive Impairment / Memory Issues'] },
                  { primary:'Diabetes Mellitus Type 2',   secondaries:['Peripheral Neuropathy all four extremities (rated separately)','Hypertension','Erectile Dysfunction','Kidney Disease','Eye Conditions (retinopathy)'] },
                  { primary:'TBI (Traumatic Brain Injury)',secondaries:['Sleep Apnea','Headache / Migraine','Depression / Anxiety','PTSD (co-diagnosis possible)','Cognitive Impairment','Vestibular Disorder (balance)'] },
                ].map((item,i)=>(
                  <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                    <div className="text-scarlet font-bold mb-2 text-sm">{item.primary} can lead to:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {item.secondaries.map((s,j)=><span key={j} className="bg-gray-800 border border-gray-600 text-xs px-2 py-1 rounded-full text-gray-200">{s}</span>)}
                    </div>
                  </div>
                ))}
                <div className="bg-blue-900/20 border border-blue-700/40 rounded-xl p-4 text-sm text-blue-300">
                  Nexus Letter Tip: Get a private doctor to write a nexus letter stating "at least as likely as not (50% or greater probability) the veterans [condition] is related to [service-connected condition]." This phrase is what the VA needs. Cost is typically $150-$500 per letter - often worth thousands in monthly benefits.
                </div>
              </div>
            )}

            {claimsSubTab === 'evidence' && (
              <div className="space-y-3">
                {[
                  { title:'C&P Exam Preparation', items:['Show up to EVERY C&P exam - a missed exam equals an automatic denial','Describe your WORST day, not your average or best day','Bring a family member or advocate as a witness','Do NOT say you manage fine or minimize your symptoms - describe full impact on work and daily life','Request a copy of the examiner DBQ (Disability Benefits Questionnaire) afterward','If the C&P was rushed or inadequate, request a new exam (file VA Form 10-5345)'] },
                  { title:'Buddy Statements (VA Form 21-4142)',items:['Fellow service members who witnessed your injury or condition','Family members who can describe how your condition affects daily life','Roommates, friends, or co-workers who have observed your limitations','Statements should include: who they are, relationship, specific observations with dates','These carry significant weight - get as many as possible'] },
                  { title:'Medical Evidence', items:['Service Treatment Records (STRs) - request via milConnect or NPRC','VA medical records - download via My HealtheVet Blue Button feature','Private medical records - submit all relevant records','DBQ (Disability Benefits Questionnaire) from your private doctor - the gold standard','IMO (Independent Medical Opinion) - nexus letters from specialists'] },
                  { title:'Your Personal Statement', items:['Describe how each condition affects your daily life, work, relationships, and sleep','Use specific examples: cannot carry groceries over 5 lbs, miss X days of work per month','Note any medications and their side effects','Describe the in-service event or exposure that caused each condition','Be consistent - your statement will be compared to your medical records'] },
                  { title:'The Nexus Letter (Most Powerful Move)', items:['"At least as likely as not (50% or greater probability) the veterans condition is related to the service event" - this is the exact phrase needed','Find a nexus letter doctor at DBQdoctor.com or similar services','Cost is typically $150-$500 per letter - often worth thousands in monthly benefits','Most powerful for denied claims and secondary claims','Must be from a licensed MD, DO, or appropriate specialist'] },
                ].map((section,i)=>(
                  <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                    <h4 className="font-bold mb-3">{section.title}</h4>
                    <ul className="space-y-1.5">
                      {section.items.map((item,j)=>(
                        <li key={j} className="text-sm text-gray-300 flex items-start gap-2">
                          <CheckCircle size={13} className="text-green-400 flex-shrink-0 mt-0.5"/>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {claimsSubTab === 'pact' && (
              <div className="space-y-4">
                <div className="bg-orange-900/20 border border-orange-600/40 rounded-xl p-4">
                  <h3 className="text-orange-300 font-black text-lg mb-1">The PACT Act - Your Presumptive Power</h3>
                  <p className="text-gray-300 text-sm">Signed August 2022. Largest expansion of VA benefits in decades. If you deployed post-8/2/1990 to qualifying locations, listed conditions are PRESUMED service-connected. No nexus letter. No proof of connection needed.</p>
                </div>
                {[
                  { title:'Who Qualifies', body:'Served on or after 8/2/1990 in: Iraq, Afghanistan, Kuwait, Bahrain, Qatar, Saudi Arabia, Somalia, Oman, UAE, Djibouti, Egypt, Jordan, Lebanon, Syria, Uzbekistan, Yemen, or aboard vessels in the Persian Gulf.' },
                  { title:'Respiratory Presumptive Conditions', body:'Constrictive or obliterative bronchiolitis, constrictive pericarditis, granulomatous disease, interstitial lung disease (ILD), pleuritis, pulmonary fibrosis, sarcoidosis, chronic rhinitis, chronic sinusitis, asthma (post-service diagnosis), COPD, emphysema, and chronic bronchitis.' },
                  { title:'Cancer Presumptives', body:'Head, neck, respiratory, reproductive, urinary, hematologic, lymphatic cancers, lymphomas, melanoma, pancreatic cancer, gastrointestinal cancers, and any cancer not otherwise excluded. File immediately for any cancer diagnosis.' },
                  { title:'How to File a PACT Act Claim', body:'1. File VA Form 21-526EZ at VA.gov/disability\n2. Indicate qualifying service location\n3. Include your DD-214 (proof of service location)\n4. Include current medical diagnosis from a licensed provider\n5. VA must presume the connection - no nexus letter needed\n6. If previously denied: submit a Supplemental Claim with VA Form 20-0995' },
                ].map((item,i)=>(
                  <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                    <h4 className="font-bold text-orange-300 mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-300 whitespace-pre-line">{item.body}</p>
                  </div>
                ))}
              </div>
            )}

            {claimsSubTab === 'tdiu' && (
              <div className="space-y-4">
                <div className="bg-blue-900/20 border border-blue-700/40 rounded-xl p-4">
                  <h3 className="text-blue-300 font-black text-lg mb-1">Total Disability Individual Unemployability (TDIU)</h3>
                  <p className="text-gray-300 text-sm">Get paid at the 100% rate even if your combined rating is only 60-70%. If your service-connected disabilities prevent you from working a substantially gainful occupation, you qualify.</p>
                </div>
                {[
                  { title:'Basic Eligibility', body:'Option 1 (Schedular): Single disability at 60%+ OR two or more disabilities with one at 40%+ and combined at 70%+.\nOption 2 (Extra-Schedular): Any combination if your disabilities prevent gainful employment. VA reviews this on a case-by-case basis.' },
                  { title:'Monthly Pay Under TDIU', body:'TDIU pays at the veteran 100% rate: $3,737+/month (varies by dependents). This is completely tax-free income. TDIU is not the same as 100% P&T - some additional benefits (like CHAMPVA and property tax exemptions) require a true schedular 100% rating.' },
                  { title:'How to File', body:'1. File VA Form 21-8940 (TDIU Application)\n2. Include VA Form 21-4192 (employer certification confirming you cannot maintain employment)\n3. Gather medical evidence showing how disabilities prevent sustained employment\n4. Get buddy statements from employers, coworkers, and family members\n5. Get an employment limitation letter from your treating physician' },
                  { title:'TDIU Earnings Limit', body:'You CAN work with TDIU, but NOT at substantially gainful employment.\nCurrent poverty threshold: approximately $14,580/year. Earning above this may result in TDIU termination.\nException: Marginal employment in sheltered or protected work environments may be allowed.\nWARNING: If on TDIU, do not earn above this threshold without consulting a VSO or benefits attorney first.' },
                ].map((item,i)=>(
                  <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                    <h4 className="font-bold text-blue-300 mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-300 whitespace-pre-line">{item.body}</p>
                  </div>
                ))}
              </div>
            )}
          </>)}

          {/* === MED SCANNER === */}
          {activeTab === 'scanner' && (<>
            <div>
              <h2 className="text-2xl font-black mb-1">Medical File Scanner</h2>
              <p className="text-gray-400 text-sm">Paste your medical records, C&P exam notes, or separation physical text. The scanner identifies potential VA claims and gives you a personalized action plan.</p>
            </div>
            <div className="bg-amber-900/20 border border-amber-700/40 rounded-xl p-3 text-xs text-amber-300">
              100% Private: This scanner runs entirely in your browser. No text is ever uploaded or stored anywhere. Your medical records stay on your device.
            </div>
            <div
              className="bg-gray-900 border-2 border-dashed border-gray-700 hover:border-scarlet/50 rounded-xl p-6 text-center transition-all cursor-pointer"
              onClick={()=>fileInputRef.current?.click()}>
              <Upload className="mx-auto mb-2 text-gray-500" size={32}/>
              <div className="text-gray-300 font-bold">Upload Medical Records (.txt file)</div>
              <div className="text-gray-500 text-xs mt-1">Works with VA Blue Button exports saved as .txt format</div>
              <input ref={fileInputRef} type="file" accept=".txt,.text" className="hidden" onChange={handleFileUpload}/>
            </div>
            <div className="text-center text-gray-500 text-xs">or paste your text below</div>
            <textarea
              className="w-full h-40 bg-gray-900 border border-gray-700 rounded-xl p-4 text-sm text-gray-200 resize-y focus:outline-none focus:border-scarlet/50 transition-colors"
              placeholder="Paste your medical records, separation physical notes, or C&P exam results here..."
              value={scanText}
              onChange={e=>setScanText(e.target.value)}
            />
            <button onClick={runMedScan} disabled={!scanText.trim()||scanLoading}
              className="w-full py-3 bg-scarlet hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2">
              {scanLoading ? <><Activity size={16} className="animate-pulse"/> Scanning Records...</> : <><Search size={16}/> Scan for VA Claims</>}
            </button>

            {scanResults && !scanLoading && (
              <div className="space-y-4">
                <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-4">
                  <h3 className="text-green-300 font-black text-lg mb-1">
                    Scan Complete - {scanResults.totalFound} Potential Claim{scanResults.totalFound !== 1 ? 's' : ''} Detected
                  </h3>
                  <p className="text-gray-400 text-sm">Review each finding below. Bring this summary to your VSO appointment or when filing your claim.</p>
                </div>
                {scanResults.pactFlag && (
                  <div className="bg-orange-900/20 border border-orange-600/40 rounded-xl p-4">
                    <div className="text-orange-300 font-bold mb-1">PACT Act Deployment Detected</div>
                    <div className="text-sm text-gray-300">Your records suggest qualifying deployment locations. PACT Act presumptive claims may apply - no nexus letter required. Bring this to a VSO immediately.</div>
                  </div>
                )}
                {scanResults.found.map((item,i)=>(
                  <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="font-black text-white">{item.condition}</div>
                        <div className="text-xs text-gray-500">Detected keyword: "{item.matchedKeyword}"</div>
                      </div>
                      <span className="bg-green-900/40 border border-green-700/40 text-green-400 text-xs px-2 py-0.5 rounded-full whitespace-nowrap">DC {item.dc}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div className="bg-gray-800 rounded-lg p-2">
                        <div className="text-gray-500 mb-0.5">Typical Rating Range</div>
                        <div className="font-bold text-scarlet">{item.ratingRange}</div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-2">
                        <div className="text-gray-500 mb-0.5">Secondary Claims</div>
                        <div className="font-bold text-blue-400">{item.secondary.length > 0 ? item.secondary.length + ' possible' : 'None identified'}</div>
                      </div>
                    </div>
                    <div className="text-xs text-blue-300 bg-blue-900/20 border border-blue-700/30 rounded-lg p-2 mb-2">Tip: {item.note}</div>
                    {item.secondary.length > 0 && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Potential secondary claims to file:</div>
                        <div className="flex flex-wrap gap-1">
                          {item.secondary.map((s,j)=><span key={j} className="text-xs bg-gray-800 border border-gray-600 px-2 py-0.5 rounded-full text-gray-300">{s}</span>)}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {scanResults.secondaries.length > 0 && (
                  <div className="bg-blue-900/20 border border-blue-700/40 rounded-xl p-4">
                    <h4 className="font-bold text-blue-300 mb-2">Additional Secondary Claims to Consider</h4>
                    <div className="flex flex-wrap gap-2">
                      {scanResults.secondaries.map((s,i)=><span key={i} className="bg-blue-900/30 border border-blue-700/40 text-blue-300 text-xs px-2 py-1 rounded-full">{s}</span>)}
                    </div>
                  </div>
                )}
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                  <h4 className="font-bold mb-3">Your Personalized Action Plan</h4>
                  <ol className="space-y-2">
                    {[
                      'Contact a VSO (free service) - DAV, VFW, or American Legion - bring this scan summary',
                      'Request all military medical records via milConnect.com',
                      'Schedule appointments with civilian doctors for each detected condition to document current symptoms',
                      'File VA Form 21-526EZ at VA.gov for all ' + scanResults.totalFound + ' detected condition' + (scanResults.totalFound !== 1 ? 's' : ''),
                      'For any denied claims: submit Supplemental Claim (VA Form 20-0995) with new evidence',
                      'Get a nexus letter from a private doctor for any secondary claims',
                      scanResults.pactFlag ? 'File PACT Act presumptive claims - no nexus letter required for qualifying conditions' : 'Review PACT Act eligibility at VA.gov',
                      'Attend ALL C&P exams - describe your worst day, not your best',
                    ].map((step,i)=>(
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                        <span className="bg-scarlet text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i+1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
                <button onClick={()=>{ setScanResults(null); setScanText(''); }} className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1">
                  <X size={12}/> Clear scan and start over
                </button>
              </div>
            )}

            {!scanResults && (
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                <h4 className="text-sm font-bold mb-2 text-gray-400">Try it with sample text:</h4>
                <button
                  onClick={()=>setScanText("Patient presents with chronic lower back pain and lumbar strain. Reports tinnitus bilaterally since deployment. Sleep study confirmed obstructive sleep apnea, CPAP prescribed. PTSD diagnosis confirmed following deployment to Iraq. Patient also reports acid reflux and heartburn consistent with GERD. Radiographic evidence of cervical disc herniation at C4-C5. Reports numbness and tingling in right arm consistent with radiculopathy. Headaches occurring 2-3 times per week. Exposed to burn pits during deployment to Iraq and Kuwait.")}
                  className="text-xs text-scarlet hover:text-red-400 underline transition-colors">
                  Load sample medical record text
                </button>
              </div>
            )}
          </>)}

          {/* === STATE BENEFITS === */}
          {activeTab === 'benefits' && (<>
            <div>
              <h2 className="text-2xl font-black mb-1">State Benefits Matrix</h2>
              <p className="text-gray-400 text-sm">State-specific benefits that stack on top of federal VA benefits. Often worth tens of thousands of dollars annually.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stateBenefits).map(([key,s])=>(
                <button key={key} onClick={()=>setSelectedState(key)}
                  className={"px-3 py-2 rounded-full text-sm font-bold border transition-all " + (selectedState===key ? "bg-scarlet border-scarlet text-white" : "border-gray-600 text-gray-400 hover:border-gray-400")}>
                  {s.emoji} {s.name}
                </button>
              ))}
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
              <h3 className="text-xl font-black mb-4">{stateInfo.emoji} {stateInfo.name} Veteran Benefits</h3>
              <div className="space-y-2 mb-4">
                {stateInfo.highlights.map((h,i)=>(
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle size={14} className="text-green-400 flex-shrink-0 mt-0.5"/>
                    <span className="text-gray-200">{h}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { label:'Tax Status',  value:stateInfo.tax },
                  { label:'Housing',     value:stateInfo.housing },
                  { label:'Education',   value:stateInfo.education },
                ].map((item,i)=>(
                  <div key={i} className="bg-gray-800 rounded-xl p-3">
                    <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                    <div className="text-sm text-white">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-blue-900/20 border border-blue-700/40 rounded-xl p-4 text-sm text-blue-300">
              Pro Tip: If you are flexible on where to live, combining {stateInfo.name} with 100% P&T status is one of the best financial moves available. Zero income tax, property tax exemption, and commissary access can add $15,000-$30,000+ per year in effective income compared to high-tax states.
            </div>
          </>)}

          {/* === TIMELINE === */}
          {activeTab === 'timeline' && (<>
            <div>
              <h2 className="text-2xl font-black mb-1">Separation Timeline</h2>
              <p className="text-gray-400 text-sm">Your step-by-step action checklist, ordered by priority. Check them off as you go.</p>
            </div>
            <div className="space-y-4">
              {getTimelineItems().map((section,i)=>(
                <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
                  <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
                    <Clock size={14} className="text-scarlet"/>
                    <span className="font-bold text-sm">{section.time}</span>
                  </div>
                  <div className="p-4 space-y-2">
                    {section.tasks.map((task,j)=>(
                      <div key={j} className="flex items-start gap-3 text-sm">
                        <CheckSquare size={14} className="text-gray-600 flex-shrink-0 mt-0.5"/>
                        <span className="text-gray-300">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>)}

          {/* === DISCHARGE UPGRADE === */}
          {activeTab === 'upgrade' && (<>
            <div>
              <h2 className="text-2xl font-black mb-1">Discharge Upgrade Guide</h2>
              <p className="text-gray-400 text-sm">A non-honorable discharge is NOT the end. Many veterans successfully upgrade their discharge and unlock full benefits.</p>
            </div>
            {dischargeType === 'honorable' && (
              <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-4 text-sm text-green-300">
                You indicated an Honorable Discharge. This guide is still useful if you are helping a fellow veteran or if any service characterization issue arises.
              </div>
            )}
            <div className="flex gap-2 flex-wrap">
              {upgradeSteps.map((s,i)=>(
                <button key={i} onClick={()=>setUpgradeStep(i)}
                  className={"px-3 py-1.5 rounded-full text-xs font-bold border transition-all " + (upgradeStep===i ? "bg-scarlet border-scarlet text-white" : "border-gray-600 text-gray-400 hover:border-gray-400")}>
                  {s.title}
                </button>
              ))}
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
              <h3 className="font-black text-lg mb-4">{upgradeSteps[upgradeStep].title}</h3>
              <ul className="space-y-2">
                {upgradeSteps[upgradeStep].body.map((line,i)=>(
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <CheckCircle size={14} className="text-green-400 flex-shrink-0 mt-0.5"/>
                    {line}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 mt-4">
                {upgradeStep > 0 && (
                  <button onClick={()=>setUpgradeStep(s=>s-1)} className="flex items-center gap-1 px-4 py-2 border border-gray-600 rounded-lg text-sm hover:border-gray-400 transition-all">
                    <ChevronLeft size={14}/> Previous
                  </button>
                )}
                {upgradeStep < upgradeSteps.length - 1 && (
                  <button onClick={()=>setUpgradeStep(s=>s+1)} className="flex items-center gap-1 px-4 py-2 bg-scarlet hover:bg-red-700 rounded-lg text-sm font-bold transition-all">
                    Next Step <ChevronRight size={14}/>
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Key Upgrade Resources</h4>
              {[
                { name:'National Veterans Legal Services Program (NVLSP)', url:'https://www.nvlsp.org', desc:'Free legal help for discharge upgrades' },
                { name:'American Bar Association Military Pro Bono Project', url:'https://www.americanbar.org/groups/legal_services/milvets/', desc:'Free attorney representation' },
                { name:'Swords to Plowshares', url:'https://www.swords-to-plowshares.org', desc:'West Coast veteran legal services' },
                { name:'DD Form 293 - Discharge Review Board Application', url:'https://www.esd.whs.mil/Portals/54/Documents/DD/forms/dd/dd0293.pdf', desc:'Official DRB form' },
                { name:'DD Form 149 - BCMR/BCNR Application', url:'https://www.esd.whs.mil/Portals/54/Documents/DD/forms/dd/dd0149.pdf', desc:'Official BCMR and BCNR form' },
              ].map((r,i)=>(
                <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-900 border border-gray-700 hover:border-scarlet/50 rounded-xl text-sm transition-all group">
                  <ExternalLink size={14} className="text-scarlet flex-shrink-0"/>
                  <div>
                    <div className="font-medium text-white group-hover:text-scarlet transition-colors">{r.name}</div>
                    <div className="text-xs text-gray-500">{r.desc}</div>
                  </div>
                </a>
              ))}
            </div>
          </>)}

          {/* === RESOURCES === */}
          {activeTab === 'resources' && (<>
            <div>
              <h2 className="text-2xl font-black mb-1">Resources and Key Contacts</h2>
              <p className="text-gray-400 text-sm">Every hotline, free service, and critical link - in one place.</p>
            </div>

            <div className="bg-red-950 border-2 border-red-600 rounded-2xl p-5">
              <h3 className="text-red-300 font-black text-xl mb-2">Veterans Crisis Line</h3>
              <div className="text-4xl font-black text-white mb-1">988, then Press 1</div>
              <div className="text-red-300 font-bold mb-2">Text: 838255</div>
              <div className="text-red-300 font-bold mb-3">Chat: VeteransCrisisLine.net</div>
              <p className="text-gray-300 text-sm">Available 24/7/365. No VA enrollment needed. You do not need to be in crisis to call. They are there for any dark moment. You earned the right to ask for help.</p>
            </div>

            <div>
              <h3 className="font-black mb-3">Free Claims and Legal Help</h3>
              <div className="space-y-2">
                {[
                  { name:'Disabled American Veterans (DAV)', url:'https://www.dav.org', desc:'Free VSO help, claims assistance, transportation', phone:'877-426-2838' },
                  { name:'Veterans of Foreign Wars (VFW)', url:'https://www.vfw.org', desc:'Free claims assistance, VSO representatives nationwide', phone:'816-756-3390' },
                  { name:'American Legion', url:'https://www.legion.org', desc:'Free claims assistance, local chapters nationwide', phone:'800-433-3318' },
                  { name:'VA Accredited VSO Locator', url:'https://www.va.gov/ogc/apps/accreditation/index.asp', desc:'Official VA tool to find an accredited representative in your area' },
                  { name:'National Veterans Legal Services Program (NVLSP)', url:'https://www.nvlsp.org', desc:'Free legal representation for denied claims and appeals' },
                  { name:'Veterans Benefits Administration (VBA)', url:'https://www.benefits.va.gov', desc:'VA benefits information and claim filing', phone:'800-827-1000' },
                ].map((r,i)=>(
                  <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-bold text-white hover:text-scarlet transition-colors text-sm">
                      {r.name} <ExternalLink size={11} className="inline"/>
                    </a>
                    <div className="text-xs text-gray-400 mt-0.5">{r.desc}</div>
                    {r.phone && <div className="text-xs text-scarlet mt-1">Phone: {r.phone}</div>}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-black mb-3">Mental Health Resources</h3>
              <div className="space-y-2">
                {[
                  { name:'Vet Center', url:'https://www.vetcenter.va.gov', desc:'Free, confidential PTSD and MST counseling. Walk-in friendly. No appointment needed.', phone:'877-927-8387' },
                  { name:'VA Mental Health', url:'https://www.mentalhealth.va.gov', desc:'VA mental health services, peer support, and treatment programs' },
                  { name:'Headstrong Project', url:'https://www.goheadstrong.org', desc:'FREE mental health treatment for post-9/11 veterans. No copays. No limits. No red tape.' },
                  { name:'Mission 22', url:'https://www.mission22.com', desc:'Veteran PTSD and suicide prevention programs' },
                  ...(mstFlag ? [{ name:'VA MST Support', url:'https://www.mentalhealth.va.gov/mstemplate/', desc:'VA confidential MST support. No police report required. Every VA facility has an MST Coordinator.', phone:'800-827-1000' }] : []),
                ].map((r,i)=>(
                  <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-bold text-white hover:text-scarlet transition-colors text-sm">
                      {r.name} <ExternalLink size={11} className="inline"/>
                    </a>
                    <div className="text-xs text-gray-400 mt-0.5">{r.desc}</div>
                    {r.phone && <div className="text-xs text-scarlet mt-1">Phone: {r.phone}</div>}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-black mb-3">Key VA Forms (direct links)</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { form:'VA 21-526EZ', desc:'Disability Claim Application',   url:'https://www.va.gov/find-forms/about-form-21-526ez/' },
                  { form:'VA 21-0781',  desc:'PTSD Stressor Statement',         url:'https://www.va.gov/find-forms/about-form-21-0781/' },
                  { form:'VA 20-0995',  desc:'Supplemental Claim',              url:'https://www.va.gov/find-forms/about-form-20-0995/' },
                  { form:'VA 21-8940',  desc:'TDIU Application',                url:'https://www.va.gov/find-forms/about-form-21-8940/' },
                  { form:'VA 22-1990',  desc:'GI Bill Application',             url:'https://www.va.gov/find-forms/about-form-22-1990/' },
                  { form:'VA 10-10EZ',  desc:'VA Healthcare Enrollment',        url:'https://www.va.gov/find-forms/about-form-10-10ez/' },
                ].map((f,i)=>(
                  <a key={i} href={f.url} target="_blank" rel="noopener noreferrer"
                    className="bg-gray-900 border border-gray-700 hover:border-scarlet/50 rounded-xl p-3 transition-all group">
                    <div className="font-black text-scarlet text-sm group-hover:text-red-400 transition-colors">{f.form}</div>
                    <div className="text-xs text-gray-400">{f.desc}</div>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-black mb-3">Official VA Portals</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name:'VA.gov',                  url:'https://www.va.gov',                            desc:'Main VA portal - file claims, check status' },
                  { name:'My HealtheVet',            url:'https://www.myhealth.va.gov',                   desc:'VA health records - Blue Button download' },
                  { name:'eBenefits',                url:'https://www.ebenefits.va.gov',                  desc:'Benefits management and DEERS updates' },
                  { name:'milConnect',               url:'https://milconnect.dmdc.osd.mil',               desc:'Military records and ID card management' },
                  { name:'USAJOBS',                  url:'https://www.usajobs.gov',                       desc:'Federal employment with veteran preference' },
                  { name:'GI Bill Comparison Tool',  url:'https://www.va.gov/education/gi-bill-comparison-tool/', desc:'Compare schools and GI Bill benefits' },
                ].map((p,i)=>(
                  <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
                    className="bg-gray-900 border border-gray-700 hover:border-scarlet/50 rounded-xl p-3 transition-all group">
                    <div className="font-bold text-white text-sm group-hover:text-scarlet transition-colors">{p.name} <ExternalLink size={10} className="inline"/></div>
                    <div className="text-xs text-gray-500">{p.desc}</div>
                  </a>
                ))}
              </div>
            </div>
          </>)}

        </div>
      </div>

      <div className="bg-gray-900 border-t border-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="text-gray-600 text-xs">For informational purposes only. Not legal or medical advice.</div>
        <div className="text-gray-800 text-xs" title="Every Marine's secret weapon">
          {String.fromCodePoint(0x1F58D)} made with crayons
        </div>
      </div>
    </div>
  );
};

export default VeteranBenefitsCompass;
