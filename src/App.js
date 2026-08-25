'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  DollarSign, ChevronRight, ChevronLeft,
  CheckCircle, Award, ArrowRight, Shield,
  ShieldAlert, Edit3, Plus, Trash2, Search,
  Upload, FileText, AlertTriangle, MapPin, Phone, Users,
  TrendingUp, Zap, Target, Cpu, ExternalLink,
  CheckSquare, X, Activity, Clock, Home,
  Sparkles, Building, BarChart3, Lock
} from 'lucide-react';

// -------------------------------------------------------------------------
// COMPREHENSIVE MEDICAL & CLAIMS DATABASE
// -------------------------------------------------------------------------
const MED_DB = [
  { keywords: ['back pain','lower back','lumbar','lumbosacral','disc herniation','herniated disc','degenerative disc','spondylosis','scoliosis'], condition: 'Lumbar Spine Condition', dc: '5237 / 5243', ratingRange: '10-40%', note: 'Claim as Lumbosacral Strain or IVDS. Key factor is range of motion with goniometer (forward flexion).', secondary: ['Radiculopathy - Lower Extremity','Obstructive Sleep Apnea','Depression/Chronic Pain','Hip Impingement','Erectile Dysfunction'] },
  { keywords: ['neck pain','cervical','cervical strain','cervical disc','cervical spondylosis','stiff neck'], condition: 'Cervical Spine Condition', dc: '5237', ratingRange: '10-30%', note: 'Claim as Cervical Strain. Document limitation of rotation and extension.', secondary: ['Radiculopathy - Upper Extremity','Migraine Headaches','Sleep Disturbance'] },
  { keywords: ['knee pain','knee','patellofemoral','meniscus','acl','mcl','pcl','chondromalacia','patellar'], condition: 'Knee Condition', dc: '5260 / 5261 / 5257', ratingRange: '10-30%', note: 'Claim limitation of flexion, extension AND lateral instability separately for each knee (up to 3 ratings per knee).', secondary: ['Hip Condition','Ankle Condition','Lumbar Strain (Altered Gait)'] },
  { keywords: ['shoulder','rotator cuff','labrum','acromial','subacromial','ac joint','impingement'], condition: 'Shoulder Condition', dc: '5201 / 5203', ratingRange: '10-40%', note: 'Rated by limitation of arm motion above shoulder level. Dominant arm receives higher rating schedule.', secondary: ['Radiculopathy - Upper Extremity','Cervical Strain'] },
  { keywords: ['ankle','ankle sprain','ankle instability','achilles','plantar fasciitis','tendonitis'], condition: 'Ankle Condition', dc: '5271 / 5270', ratingRange: '0-20%', note: 'Claim ankle instability and limitation of motion separately if supported by exam notes.', secondary: ['Foot Condition','Knee Condition','Altered Gait'] },
  { keywords: ['flat feet','pes planus','plantar fasciitis','foot pain','metatarsalgia','heel spurs'], condition: 'Foot Condition / Pes Planus', dc: '5276 / 5284', ratingRange: '0-50%', note: 'File bilateral (both feet) for a doubled evaluation. Severe bilateral flat feet with orthotic requirement rates 50%.', secondary: ['Knee Condition','Ankle Condition','Lumbar Spine'] },
  { keywords: ['hip pain','hip','trochanteric bursitis','iliotibial','hip flexor','labral tear'], condition: 'Hip Condition', dc: '5251 / 5252 / 5253', ratingRange: '10-40%', note: 'Claim limitation of motion of the thigh (extension and flexion).', secondary: ['Knee Condition','Lower Back Strain'] },
  { keywords: ['wrist pain','wrist','carpal tunnel','carpal','tendinitis','de quervain'], condition: 'Wrist / Carpal Tunnel Syndrome', dc: '5215 / 8215', ratingRange: '10-30%', note: 'Claim carpal tunnel separately under median nerve paralysis (DC 8215) for both hands.', secondary: ['Elbow Condition','Cervical Radiculopathy'] },
  { keywords: ['tinnitus','ringing in ears','ear ringing','ringing ears','buzzing in ears'], condition: 'Tinnitus', dc: '6260', ratingRange: '10% (FLAT RATE)', note: 'EASIEST and most approved VA claim. 10% flat rating. File immediately if exposed to weapons, engines, or flight lines.', secondary: ['Hearing Loss','Migraine Headaches','Insomnia / Anxiety'] },
  { keywords: ['hearing loss','hearing','deaf','audiogram','decibel loss'], condition: 'Bilateral Hearing Loss', dc: '6100', ratingRange: '0-100%', note: 'Requires pure-tone audiogram and Maryland CNC speech recognition test. File both tinnitus AND hearing loss.', secondary: ['Tinnitus','Mental Health Strain'] },
  { keywords: ['headache','migraine','migraines','head pain','tension headache','cluster headache'], condition: 'Migraine Headaches', dc: '8100', ratingRange: '0-50%', note: 'Rated by frequency of PROSTRATING attacks (requiring you to lie down in dark room). 1 attack/month = 30%, frequent attacks = 50%.', secondary: ['Cervical Strain','Tinnitus','Sleep Apnea','PTSD'] },
  { keywords: ['numbness','tingling','radiculopathy','sciatica','sciatic','neuropathy','nerve pain','burning sensation','pin and needles'], condition: 'Radiculopathy / Peripheral Neuropathy', dc: '8520 / 8510 / 8615', ratingRange: '10-40% per limb', note: 'Separate claim for each affected limb (both legs / both arms). Highly effective secondary to cervical/lumbar spine.', secondary: ['Lumbar Spine','Cervical Spine'] },
  { keywords: ['tbi','traumatic brain injury','concussion','blast exposure','blast injury','loss of consciousness'], condition: 'Traumatic Brain Injury (TBI)', dc: '8045', ratingRange: '0-100%', note: 'Rated by cognitive, emotional, and physical residuals. Document blast exposure or head trauma in service.', secondary: ['Migraines','Sleep Apnea','Depression/Anxiety','Vestibular Dysfunction'] },
  { keywords: ['ptsd','post traumatic','post-traumatic','trauma','flashback','nightmares from service','hypervigilance','combat stress'], condition: 'Post-Traumatic Stress Disorder (PTSD)', dc: '9411', ratingRange: '0-100%', note: 'No combat badge required since 2010 rule change. In-service fear/stressor letter is sufficient. 70% rate is standard for occupational impairment.', secondary: ['Sleep Apnea (50%)','GERD','Hypertension','Migraines','Erectile Dysfunction','Bruxism'] },
  { keywords: ['depression','mdd','major depressive','depressive disorder','sadness','hopelessness'], condition: 'Major Depressive Disorder (MDD)', dc: '9434', ratingRange: '0-100%', note: 'File as secondary to chronic pain or physical disabilities if not documented on active duty.', secondary: ['Sleep Apnea','Social Isolation','Chronic Fatigue'] },
  { keywords: ['anxiety','generalized anxiety','panic attack','panic disorder','gad','nervousness'], condition: 'Generalized Anxiety Disorder (GAD)', dc: '9400', ratingRange: '0-100%', note: 'Can be filed primary or secondary to physical pain, tinnitus, or TBI.', secondary: ['GERD','IBS','Hypertension','Bruxism/TMJ'] },
  { keywords: ['mst','military sexual trauma','sexual assault','sexual harassment service'], condition: 'Military Sexual Trauma (MST)', dc: '9411 / 9400', ratingRange: '0-100%', note: 'In-service reporting not required. Markers in personnel/medical records (behavior changes, performance drops) count as proof.', secondary: ['PTSD','Depression','GAD','Substance Coping'] },
  { keywords: ['sleep apnea','cpap','apnea','snoring','gasping for air','stop breathing'], condition: 'Obstructive Sleep Apnea (OSA)', dc: '6847', ratingRange: '0-100%', note: 'AUTOMATIC 50% rating if a CPAP or oral device is prescribed. One of the strongest secondary claims to PTSD, chronic pain, or weight gain from service disabilities.', secondary: ['Hypertension','Cardiovascular Disease','Depression','Daytime Fatigue'] },
  { keywords: ['asthma','wheezing','bronchial asthma','reactive airway','inhaler'], condition: 'Asthma / Reactive Airway Disease', dc: '6602', ratingRange: '10-100%', note: 'PACT Act presumptive for post-9/11 deployments to SW Asia. Daily inhaler prescription qualifies for 30%.', secondary: ['GERD','Sinusitis'] },
  { keywords: ['sinusitis','sinus','rhinitis','chronic sinusitis','nasal polyps','deviated septum'], condition: 'Chronic Sinusitis / Rhinitis', dc: '6513 / 6522', ratingRange: '0-50%', note: 'PACT Act presumptive. File for both Chronic Sinusitis AND Allergic Rhinitis separately.', secondary: ['Sleep Apnea','Asthma'] },
  { keywords: ['gerd','acid reflux','heartburn','gastroesophageal','esophageal reflux','omeprazole'], condition: 'GERD / Gastroesophageal Reflux', dc: '7346', ratingRange: '10-60%', note: 'Extremely high success rate as secondary to PTSD, anxiety, or NSAID medication prescribed for pain.', secondary: ['Irritable Bowel Syndrome','Esophageal Stricture'] },
  { keywords: ['ibs','irritable bowel','bowel dysfunction','diarrhea chronic','constipation chronic','cramping'], condition: 'Irritable Bowel Syndrome (IBS)', dc: '7319', ratingRange: '0-30%', note: 'Gulf War / PACT Act presumptive for SW Asia veterans with unexplained GI conditions. Also strong secondary to PTSD.', secondary: ['GERD','Anxiety'] },
  { keywords: ['hypertension','high blood pressure','htn','blood pressure medication'], condition: 'Hypertension', dc: '7101', ratingRange: '10-60%', note: 'PACT Act presumptive for Vietnam & Gulf War vets. Solid secondary to sleep apnea, PTSD, and renal issues.', secondary: ['Cardiovascular Disease','Kidney Condition','Eye Retinopathy'] },
  { keywords: ['burn pit','burn pits','open air burn','deployed iraq','deployed afghanistan','deployed kuwait','deployed qatar','toxic exposure','particulate matter'], condition: 'Burn Pit / Toxic Exposure (PACT Act)', dc: 'PACT Presumptive', ratingRange: 'Varies by condition', note: 'PACT Act presumptive: no nexus letter needed for 20+ respiratory conditions and cancers if deployed to qualifying zones.', secondary: ['Respiratory','Cancer','Chronic Rhinitis','Constrictive Bronchiolitis'] },
  { keywords: ['eczema','dermatitis','atopic dermatitis','skin rash','chloracne'], condition: 'Dermatitis / Eczema', dc: '7806', ratingRange: '0-60%', note: 'Rated by body surface area affected and frequency of prescription topical steroids.', secondary: ['Sleep Disturbance'] },
  { keywords: ['scar','surgical scar','keloid','painful scar'], condition: 'Scars (Painful / Unstable)', dc: '7800-7805', ratingRange: '10-80%', note: 'All scars resulting from service injuries or service-connected surgeries qualify. Rated per scar if painful/unstable.', secondary: [] },
  { keywords: ['tmj','jaw pain','bruxism','teeth grinding','jaw popping'], condition: 'Temporomandibular Joint Disorder (TMJ / TMD)', dc: '9905', ratingRange: '10-50%', note: 'Rated by interincisal opening (mm). Very common secondary to PTSD and stress (bruxism/teeth grinding).', secondary: ['Migraines','Neck Pain'] },
  { keywords: ['erectile dysfunction','ed','smc-k','sexual dysfunction'], condition: 'Erectile Dysfunction (ED / SMC-K)', dc: '7522 + SMC-K', ratingRange: '0% + $132.90/mo', note: 'Qualifies for Special Monthly Compensation (SMC-K) cash addition on top of your standard rating. Secondary to PTSD, diabetes, back pain, or medication.', secondary: [] },
];

// -------------------------------------------------------------------------
// FINANCIAL FREEDOM MASTER ROADMAP STAGES
// -------------------------------------------------------------------------
const FREEDOM_STAGES = [
  {
    id: 'stage1',
    stageNum: '1',
    timeframe: '12 - 24 Months to Separation',
    title: 'In-Service Fortification & Blueprinting',
    tagline: 'Laying the indestructible medical and financial foundation while on active duty.',
    corePillars: [
      {
        title: 'Medical File Sanitization & Documentation',
        desc: 'Go to sick call and medical for EVERY ache, joint pop, ringing ear, insomnia episode, and headache. In the civilian world, undocumented pain = $0. In the military, a 1-sentence note in your STR is worth $1,000,000+ in lifetime tax-free cash.',
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

// -------------------------------------------------------------------------
// C&P EXAM PRACTICE SIMULATOR SCENARIOS
// -------------------------------------------------------------------------
const CP_SIMULATOR_SCENARIOS = [
  {
    id: 'spine',
    title: 'Thoracolumbar / Cervical Spine C&P Exam',
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

// -------------------------------------------------------------------------
// STATE BENEFITS COMPREHENSIVE MATRIX
// -------------------------------------------------------------------------
const STATE_BENEFITS_EXTENDED = {
  nv: {
    name: 'Nevada', emoji: 'NV',
    incomeTax: '0% State Income Tax (No tax on military, VA, or civilian pay)',
    propTax: '100% P&T = Full Property Tax Exemption ($22,500 base exemption for partial ratings)',
    education: 'Nevada Promise Scholarship: 2 full years of free community college',
    vehicle: 'DMV waives vehicle registration & tax fees for disabled veterans',
    perks: ['Free Nevada State Parks annual pass (any rating)','Free NDOW hunting/fishing licenses (100% P&T)','Priority hiring in state and local government','No corporate or personal income taxes'],
    ratingGrade: 'A+'
  },
  tx: {
    name: 'Texas', emoji: 'TX',
    incomeTax: '0% State Income Tax on ALL income',
    propTax: '100% P&T = 100% Complete Property Tax Exemption (Saves $6k-$14k/year in escrow)',
    education: 'Hazelwood Act: 150 FREE college credit hours at any TX public university (transferable to children)',
    vehicle: 'Disabled Veteran (DV) plates: Free airport parking & toll fee waivers statewide',
    perks: ['Texas Veterans Land Board (VLB) discounted low-rate land & home loans','Free hunting and fishing licenses','100% P&T spouse maintains property tax exemption upon veteran passing','Huge military-friendly corporate culture'],
    ratingGrade: 'A+'
  },
  fl: {
    name: 'Florida', emoji: 'FL',
    incomeTax: '0% State Income Tax',
    propTax: '100% P&T = 100% Real Estate Property Tax Exemption on homestead property',
    education: 'Free college tuition for dependents & spouses of 100% P&T veterans at FL public universities',
    vehicle: 'Free DV license plates + waived motor vehicle fees',
    perks: ['Free lifetime hunting & fishing military gold sportsman licenses','50% discount on state park annual passes for any rated veteran','Florida Veterans Foundation grant access','No state inheritance or gift taxes'],
    ratingGrade: 'A+'
  },
  ca: {
    name: 'California', emoji: 'CA',
    incomeTax: 'VA Disability 100% tax-free (State income tax on other income ranges 1%-13.3%)',
    propTax: 'Disabled Veterans Exemption: Up to $241,627+ deducted from assessed home value',
    education: 'CalVet College Fee Waiver: 100% tuition & fees WAIVED for dependents of 0%+ rated vets',
    vehicle: 'One free set of DV plates with waived registration fees',
    perks: ['CalVet Home Loan program with specialized below-market rates','Free state park passes for 50%+ rated veterans','High GI Bill BAH rates ($3,500 - $4,800/mo) across Bay Area / San Diego / LA','Strong veteran legal aid infrastructure'],
    ratingGrade: 'B+'
  },
  wa: {
    name: 'Washington', emoji: 'WA',
    incomeTax: '0% State Personal Income Tax',
    propTax: '100% P&T / 80%+ = Full or substantial property tax reduction based on income criteria',
    education: 'Full tuition waivers at public universities for surviving dependents / partial waivers for vets',
    vehicle: 'Free lifetime DV license plates for 100% disabled veterans',
    perks: ['Free lifetime pass for all Washington State Parks (30%+ disabled)','High tech job market with strong veteran hiring initiatives (Amazon/Microsoft)','No state tax on retirement pay'],
    ratingGrade: 'A'
  },
  az: {
    name: 'Arizona', emoji: 'AZ',
    incomeTax: 'Military retirement pay & VA disability are 100% exempt from state income tax',
    propTax: 'Property tax exemption for 100% P&T disabled veterans (up to full waiver based on income)',
    education: 'AZ Veteran Supportive Campus tuition assistance and dependent waivers',
    vehicle: 'Waived vehicle license tax & registration fees for 100% certified disabled veterans',
    perks: ['Free AZ hunting & fishing licenses for 100% P&T veterans','Low cost of living with thriving aerospace/defense industries','Year-round sunshine and warm climate for chronic pain relief'],
    ratingGrade: 'A'
  },
  nc: {
    name: 'North Carolina', emoji: 'NC',
    incomeTax: 'Military retirement & VA pay completely exempt from NC state income tax',
    propTax: 'First $45,000 of assessed value excluded from property taxes for 100% P&T',
    education: 'NC Class 1A scholarship: Free tuition for children of 100% P&T or combat disabled veterans',
    vehicle: 'Free DV license plates for qualified disabled veterans',
    perks: ['Massive military community footprint (Fort Liberty, Camp Lejeune)','Low property tax rates compared to national average','Strong defense contracting ecosystem'],
    ratingGrade: 'A-'
  },
  tn: {
    name: 'Tennessee', emoji: 'TN',
    incomeTax: '0% State Income Tax on earned income & pensions',
    propTax: 'Property tax relief on the first $175,000 of home value for 100% P&T veterans',
    education: 'Tennessee STRONG Act: Tuition reimbursement for state educational institutions',
    vehicle: 'Free disabled veteran plates & waived registration',
    perks: ['No state income tax','Very low property taxes and cost of living','Free access to all Tennessee State Parks for 100% P&T vets'],
    ratingGrade: 'A'
  },
  va: {
    name: 'Virginia', emoji: 'VA',
    incomeTax: 'Military retirement pay tax-free up to $40k/yr; VA disability pay 100% tax-free',
    propTax: '100% P&T = 100% Real Estate Property Tax Exemption on primary residence + 1 motor vehicle',
    education: 'VMSDEP: Up to 8 semesters of 100% free tuition & fees for dependents of 90%+ rated veterans',
    vehicle: 'One vehicle completely exempt from state and local personal property tax',
    perks: ['Capital region proximity for maximum federal contracting salaries','Massive concentration of cleared tech & defense jobs','VMSDEP is one of the nation\'s top dependent education benefits'],
    ratingGrade: 'A+'
  },
  fl_nc_other: {
    name: 'Georgia', emoji: 'GA',
    incomeTax: 'Military retirement deduction up to $35k/yr; VA disability 100% tax-free',
    propTax: 'Homestead exemption up to $109,986+ of assessed value for 100% disabled vets',
    education: 'Georgia HERO Scholarship for qualified service members and dependents',
    vehicle: 'Free DV license plates with waived registration fees',
    perks: ['Free lifetime hunting & fishing licenses','Very affordable housing markets outside Atlanta','Strong veteran support infrastructure'],
    ratingGrade: 'A-'
  }
};

// -------------------------------------------------------------------------
// VA PAY TABLES (2024 Monthly Rates)
// -------------------------------------------------------------------------
const VA_PAY_RATES = {
  0:   { single:0,    child_only:0,    spouse:0,    family:0    },
  10:  { single:175,  child_only:189,  spouse:195,  family:211  },
  20:  { single:346,  child_only:367,  spouse:384,  family:409  },
  30:  { single:537,  child_only:568,  spouse:603,  family:641  },
  40:  { single:774,  child_only:813,  spouse:860,  family:911  },
  50:  { single:1102, child_only:1152, spouse:1211, family:1275 },
  60:  { single:1395, child_only:1453, spouse:1529, family:1606 },
  70:  { single:1759, child_only:1830, spouse:1921, family:2014 },
  80:  { single:2044, child_only:2126, spouse:2232, family:2339 },
  90:  { single:2297, child_only:2390, spouse:2512, family:2633 },
  100: { single:3737, child_only:3849, spouse:3946, family:4094 },
};

// -------------------------------------------------------------------------
// MAIN COMPONENT
// -------------------------------------------------------------------------
const VeteranBenefitsCompass = () => {
  // Routing & Global State
  const [currentPage, setCurrentPage] = useState('landing');
  const [wizardStep, setWizardStep] = useState(0);

  // Profile
  const [branch, setBranch] = useState('usmc');
  const [separationMonths, setSeparationMonths] = useState(6);
  const [alreadyOut, setAlreadyOut] = useState(false);
  const [dischargeType, setDischargeType] = useState('honorable');
  const [disabilityStatus, setDisabilityStatus] = useState('none');
  const [currentRating, setCurrentRating] = useState(0);
  const [selectedState, setSelectedState] = useState('nv');
  const [hasDependents, setHasDependents] = useState('single');
  const [servedPost911, setServedPost911] = useState(true);
  const [exposedBurnPit, setExposedBurnPit] = useState(false);
  const [mstFlag, setMstFlag] = useState(false);

  // UI Tabs & Interactive Sub-tabs
  const [activeTab, setActiveTab] = useState('freedom');
  const [activeFreedomStage, setActiveFreedomStage] = useState('stage1');
  const [claimsSubTab, setClaimsSubTab] = useState('math');
  const [selectedCpScenario, setSelectedCpScenario] = useState('spine');
  const [cpChoice, setCpChoice] = useState(null);
  const [upgradeStep, setUpgradeStep] = useState(0);
  const [showCrisis, setShowCrisis] = useState(false);

  // Wealth Engine Calculator State
  const [wealthRating, setWealthRating] = useState(100);
  const [wealthBah, setWealthBah] = useState(3200);
  const [wealthSalary, setWealthSalary] = useState(95000);
  const [wealthRentalUnits, setWealthRentalUnits] = useState(2);
  const [wealthRentPerUnit, setWealthRentPerUnit] = useState(1400);

  // VA House Hack Calculator State
  const [homePrice, setHomePrice] = useState(550000);
  const [interestRate, setInterestRate] = useState(6.25);
  const [propertyUnits, setPropertyUnits] = useState(4);
  const [rentPerTenantUnit, setRentPerTenantUnit] = useState(1600);
  const [hasDisabilityFundingWaiver, setHasDisabilityFundingWaiver] = useState(true);
  const [hasPtTaxExemption, setHasPtTaxExemption] = useState(true);

  // Claims Calculator List
  const [claimsList, setClaimsList] = useState([50, 30, 10]);
  const [newClaimVal, setNewClaimVal] = useState(10);

  // Medical Scanner
  const [scanText, setScanText] = useState('');
  const [scanResults, setScanResults] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Persistent Checklist
  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem('vbc_checklist');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      'str_download': false,
      'sick_call_log': false,
      'cool_cert': false,
      'bdd_filed': false,
      'skillbridge_app': false,
      'va_account_set': false,
      'va_healthcare': false,
      'cpap_study': false,
      'buddy_letters': false,
      'va_loan_coe': false,
      'roth_ira_opened': false,
      'vso_connected': false,
      'state_tax_exempt': false
    };
  });

  const toggleChecklistItem = (id) => {
    setChecklist(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem('vbc_checklist', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
  };

  // Branch Metadata
  const branchData = {
    usmc:          { name: 'Marine Corps', color: 'border-scarlet text-scarlet', bg: 'bg-scarlet', text: 'text-scarlet', badge: 'USMC', sep: 'EAS' },
    army:          { name: 'Army',         color: 'border-amber-400 text-amber-400', bg: 'bg-amber-500', text: 'text-amber-400', badge: 'ARMY', sep: 'ETS' },
    navy:          { name: 'Navy',         color: 'border-sky-400 text-sky-400', bg: 'bg-sky-500', text: 'text-sky-400', badge: 'NAVY', sep: 'EAOS' },
    airforce:      { name: 'Air Force',    color: 'border-blue-400 text-blue-400', bg: 'bg-blue-500', text: 'text-blue-400', badge: 'USAF', sep: 'DOS' },
    coastguard:    { name: 'Coast Guard',  color: 'border-orange-400 text-orange-400', bg: 'bg-orange-500', text: 'text-orange-400', badge: 'USCG', sep: 'DOS' },
    national_guard:{ name: 'Natl Guard',   color: 'border-green-400 text-green-400', bg: 'bg-green-600', text: 'text-green-400', badge: 'NG', sep: 'ETS' },
  };
  const bd = branchData[branch] || branchData.usmc;

  // VA Math Calculation Engine
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

  // Monthly VA Pay Lookup
  const depKey = hasDependents === 'single' ? 'single' : hasDependents === 'unmarried_kids' ? 'child_only' : hasDependents === 'spouse' ? 'spouse' : 'family';
  const monthlyPay = (VA_PAY_RATES[roundedRating] || VA_PAY_RATES[0])[depKey] || 0;
  const annualPay = monthlyPay * 12;

  // Wealth Engine Live Calculations
  const calcWealthEngine = () => {
    const vaMonthly = (VA_PAY_RATES[wealthRating] || VA_PAY_RATES[0])[depKey] || 0;
    const vaAnnual = vaMonthly * 12;
    const bahAnnual = wealthBah * 12;
    const grossSalary = wealthSalary;
    const estimatedTaxesOnSalary = grossSalary * 0.22;
    const netSalary = grossSalary - estimatedTaxesOnSalary;
    const rentalAnnualGross = (wealthRentalUnits * wealthRentPerUnit) * 12;
    
    // Tax-free total cash flow
    const totalTaxFreeMonthly = vaMonthly + wealthBah;
    const totalTaxFreeAnnual = totalTaxFreeMonthly * 12;
    
    // Total take-home cash flow
    const totalNetMonthly = Math.round(vaMonthly + wealthBah + (netSalary / 12) + (wealthRentalUnits * wealthRentPerUnit));
    const totalNetAnnual = totalNetMonthly * 12;
    
    // Equivalent pre-tax civilian gross income needed to match this take-home
    const equivalentPreTaxIncome = Math.round((totalTaxFreeAnnual / 0.72) + grossSalary + rentalAnnualGross);
    
    // 5-year and 10-year wealth compounding projection (Assuming annual invested savings compounding at 8% CAGR)
    const annualInvested = Math.round(totalTaxFreeAnnual * 0.7 + 7000);
    const compound5Yr = Math.round(annualInvested * (((Math.pow(1 + 0.08, 5) - 1) / 0.08) * (1 + 0.08)));
    const compound10Yr = Math.round(annualInvested * (((Math.pow(1 + 0.08, 10) - 1) / 0.08) * (1 + 0.08)));

    return {
      vaMonthly, vaAnnual, bahAnnual, netSalary,
      totalTaxFreeMonthly, totalTaxFreeAnnual,
      totalNetMonthly, totalNetAnnual,
      equivalentPreTaxIncome,
      annualInvested,
      compound5Yr, compound10Yr
    };
  };
  const wealthData = calcWealthEngine();

  // VA House Hack Live Calculations
  const calcHouseHack = () => {
    const monthlyInterestRate = (interestRate / 100) / 12;
    const numberOfPayments = 30 * 12;
    // $0 down VA Loan
    const principal = homePrice;
    const monthlyPrincipalAndInterest = (principal * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments))) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    // Taxes: 1.25% of purchase price annually unless waived by 100% P&T
    const normalAnnualTax = homePrice * 0.0125;
    const monthlyTax = hasPtTaxExemption ? 0 : normalAnnualTax / 12;
    
    // Insurance: approx 0.4% annually
    const monthlyInsurance = (homePrice * 0.004) / 12;
    
    // Total monthly mortgage payment
    const totalMonthlyPayment = Math.round(monthlyPrincipalAndInterest + monthlyTax + monthlyInsurance);
    
    // Rental income from tenant units (units - 1, since you live in 1)
    const tenantUnitsCount = Math.max(0, propertyUnits - 1);
    const totalRentalIncome = tenantUnitsCount * rentPerTenantUnit;
    
    // Net out of pocket cost / profit
    const netHousingCost = totalMonthlyPayment - totalRentalIncome;
    const isProfitable = netHousingCost <= 0;
    
    // VA Funding Fee Saved
    const fundingFeeSaved = hasDisabilityFundingWaiver ? Math.round(homePrice * 0.0215) : 0;
    const annualPropertyTaxSaved = hasPtTaxExemption ? Math.round(normalAnnualTax) : 0;

    return {
      monthlyPrincipalAndInterest: Math.round(monthlyPrincipalAndInterest),
      monthlyTax: Math.round(monthlyTax),
      monthlyInsurance: Math.round(monthlyInsurance),
      totalMonthlyPayment,
      tenantUnitsCount,
      totalRentalIncome,
      netHousingCost: Math.abs(netHousingCost),
      isProfitable,
      fundingFeeSaved,
      annualPropertyTaxSaved
    };
  };
  const houseData = calcHouseHack();

  // State Information
  const stateInfo = STATE_BENEFITS_EXTENDED[selectedState] || STATE_BENEFITS_EXTENDED.nv;

  // Medical Scanner Callback
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
        if (hit) {
          found.push({ ...entry, matchedKeyword: hit });
          foundNames.add(entry.condition);
        }
      });
      const secondaries = new Set();
      found.forEach(f => f.secondary.forEach(s => { if (!foundNames.has(s)) secondaries.add(s); }));
      const pactFlag = exposedBurnPit || lower.includes('burn pit') || lower.includes('iraq') || lower.includes('afghanistan') || lower.includes('kuwait') || lower.includes('toxic');
      setScanResults({ found, secondaries: [...secondaries], pactFlag, totalFound: found.length });
      setScanLoading(false);
    }, 900);
  }, [scanText, exposedBurnPit]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => setScanText(evt.target.result);
    reader.readAsText(file);
  };

  // Mission Score Calculation
  const getMissionScore = () => {
    let score = 0;
    const items = [];
    if (currentRating >= 10) { score += 20; items.push({ done:true, text:'VA Disability Rating Secured (Tax-Free Base)' }); }
    else { items.push({ done:false, text:'File VA Disability Claim (Aim for 100% P&T)' }); }
    
    if (currentRating >= 70) { score += 20; items.push({ done:true, text:'Rating 70%+ (TDIU Eligible / High Baseline)' }); }
    else { items.push({ done:false, text:'Increase Rating to 70%+ via Secondary Stacks' }); }
    
    if (currentRating >= 100) { score += 20; items.push({ done:true, text:'100% P&T Status Achieved (Max Lifetime Benefits)' }); }
    else { items.push({ done:false, text:'Reach 100% P&T (Unlocks Free Family Healthcare & Tax Waivers)' }); }
    
    if (dischargeType === 'honorable') { score += 15; items.push({ done:true, text:'Honorable Discharge Maintained' }); }
    else { items.push({ done:false, text:'Discharge Upgrade Application in Progress' }); }
    
    if (servedPost911) { score += 15; items.push({ done:true, text:'100% GI Bill & VR&E Housing Eligibility' }); }
    else { items.push({ done:false, text:'Partial Education Benefits' }); }
    
    const checkedCount = Object.values(checklist).filter(Boolean).length;
    const checklistPoints = Math.min(10, Math.round((checkedCount / 12) * 10));
    score += checklistPoints;
    items.push({ done: checkedCount >= 6, text: `Transition Milestones Checked (${checkedCount}/13 Complete)` });

    return { score: Math.min(score, 100), items };
  };
  const mission = getMissionScore();

  // Crisis Banner
  const CrisisBanner = () => (
    <div className="fixed bottom-4 right-4 z-50">
      {showCrisis ? (
        <div className="bg-red-950 border-2 border-red-500 rounded-2xl p-4 max-w-xs shadow-2xl">
          <div className="flex justify-between items-start mb-2">
            <span className="text-red-300 font-bold text-sm flex items-center gap-1.5"><ShieldAlert size={16}/> Veterans Crisis Line</span>
            <button onClick={()=>setShowCrisis(false)} className="text-gray-400 hover:text-white p-1"><X size={16}/></button>
          </div>
          <p className="text-white font-black text-2xl tracking-tight">Dial 988, Press 1</p>
          <p className="text-red-200 text-xs mt-1 font-semibold">Text: 838255 | Chat: VeteransCrisisLine.net</p>
          <p className="text-gray-400 text-xs mt-2 border-t border-red-800/60 pt-2">Free, confidential support available 24/7/365. You earned the right to ask for help.</p>
        </div>
      ) : (
        <button onClick={()=>setShowCrisis(true)} className="bg-red-700 hover:bg-red-600 text-white rounded-full px-4 py-2 text-xs font-black shadow-xl flex items-center gap-1.5 transition-all hover:scale-105 border border-red-500/50">
          <Phone size={13}/> Crisis Line (988)
        </button>
      )}
    </div>
  );

  // -----------------------------------------------------------------------
  // RENDER: LANDING PAGE
  // -----------------------------------------------------------------------
  if (currentPage === 'landing') return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col selection:bg-red-600 selection:text-white">
      <CrisisBanner/>
      
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-16 pb-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl"/>
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"/>
        </div>

        {/* Marine Easter Egg */}
        <div className="absolute top-6 right-8 text-3xl opacity-15 hover:opacity-80 transition-opacity cursor-default select-none" title="Every Marine's secret weapon">
          {String.fromCodePoint(0x1F58D)}
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/80 border border-red-600/50 text-red-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={14} className="text-amber-400"/> Next-Gen Veteran Transition & Wealth Protocol
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="text-scarlet" size={42}/>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
              Veteran Benefits <span className="text-scarlet">Compass</span>
            </h1>
          </div>

          <p className="text-xl sm:text-2xl text-gray-200 font-medium mb-3 max-w-2xl mx-auto">
            The master plan to <span className="text-amber-400 font-black">100% P&T</span>, <span className="text-emerald-400 font-black">Triple-Income Stacking</span>, and <span className="text-scarlet font-black">Financial Freedom</span>.
          </p>

          <p className="text-gray-400 mb-10 text-sm sm:text-base max-w-xl mx-auto">
            No gatekeeping. No vague checklists. We hold your hand through every stage of your military exit—from medical record sanitization to zero-down multi-family real estate.
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10 text-left">
            {[
              { icon:<TrendingUp size={20}/>, title:'Ultimate Freedom Blueprint', desc:'5-stage master roadmap from active duty to complete financial sovereignty' },
              { icon:<Home size={20}/>,       title:'VA 4-Plex House Hacker',    desc:'Live mortgage-free using $0 down + 100% P&T property tax waivers' },
              { icon:<FileText size={20}/>,   title:'Medical Record Scanner',    desc:'Extract high-value VA claims & secondary chains from raw text' },
              { icon:<Activity size={20}/>,   title:'C&P Exam Simulator',        desc:'Practice actual DBQ questions & master rating keyword phrasing' },
              { icon:<DollarSign size={20}/>, title:'Wealth Compounding Engine', desc:'Calculate live cash flow: VA Pay + GI Bill MHA + Tech Salary' },
              { icon:<MapPin size={20}/>,     title:'10-State Benefits Matrix',   desc:'Deep dive into TX, NV, FL, CA, WA, AZ & more' },
            ].map((f,i)=>(
              <div key={i} className="bg-gray-900/90 border border-gray-800 hover:border-scarlet/60 rounded-2xl p-4 transition-all hover:bg-gray-900 group">
                <div className="text-scarlet mb-2 group-hover:scale-110 transition-transform">{f.icon}</div>
                <div className="font-black text-sm text-white">{f.title}</div>
                <div className="text-xs text-gray-400 mt-1 leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>

          <button
            onClick={()=>{ setCurrentPage('wizard'); setWizardStep(0); }}
            className="bg-scarlet hover:bg-red-700 text-white font-black text-lg px-10 py-4 rounded-full shadow-2xl hover:shadow-red-600/30 transition-all hover:scale-105 flex items-center gap-3 mx-auto border border-red-500/50">
            Launch Mission Briefing <ArrowRight size={22}/>
          </button>
          
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mt-4 font-medium">
            <span className="flex items-center gap-1"><Lock size={12}/> 100% Private & Client-Side</span>
            <span>•</span>
            <span>Zero Data Stored on Servers</span>
            <span>•</span>
            <span>Updated with 2024 VA Pay Rates & PACT Act</span>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-600 text-xs py-3 border-t border-gray-900 px-4">
        For educational and strategic planning purposes only. Not official legal or medical advice. Consult accredited VSOs (DAV, VFW, American Legion) or accredited agents for claims filing.
      </div>
    </div>
  );

  // -----------------------------------------------------------------------
  // RENDER: PROFILE WIZARD
  // -----------------------------------------------------------------------
  if (currentPage === 'wizard') {
    const steps = ['Branch', 'Status', 'Health & Rating', 'Location & Family'];

    const WizardStepContent = () => {
      switch(wizardStep) {
        case 0: return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-black mb-1">Which branch did you serve?</h2>
              <p className="text-gray-400 text-sm">We will calibrate your timeline and terminology to your service.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(branchData).map(([key,b])=>(
                <button key={key} onClick={()=>setBranch(key)}
                  className={"p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 " + (branch===key ? "border-scarlet bg-scarlet/10 scale-105 shadow-lg shadow-scarlet/20 text-white font-black" : "border-gray-800 bg-gray-900/60 hover:border-gray-600 text-gray-300")}>
                  <Shield size={24} className={branch===key ? "text-scarlet" : "text-gray-500"}/>
                  <div className="font-bold text-sm">{b.name}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">{b.badge}</div>
                </button>
              ))}
            </div>
          </div>
        );

        case 1: return (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="text-2xl font-black mb-1">Where are you in your transition?</h2>
              <p className="text-gray-400 text-sm">This determines which master plan phase you should execute immediately.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={()=>setAlreadyOut(false)}
                className={"p-4 rounded-2xl border text-left transition-all " + (!alreadyOut ? "border-scarlet bg-scarlet/10 text-white" : "border-gray-800 bg-gray-900/60 hover:border-gray-700 text-gray-400")}>
                <div className="font-black text-sm flex items-center gap-2"><Clock size={16} className="text-scarlet"/> Active Duty</div>
                <div className="text-xs text-gray-400 mt-1">Still serving, approaching {bd.sep} date</div>
              </button>
              <button onClick={()=>setAlreadyOut(true)}
                className={"p-4 rounded-2xl border text-left transition-all " + (alreadyOut ? "border-scarlet bg-scarlet/10 text-white" : "border-gray-800 bg-gray-900/60 hover:border-gray-700 text-gray-400")}>
                <div className="font-black text-sm flex items-center gap-2"><Award size={16} className="text-emerald-400"/> Separated Veteran</div>
                <div className="text-xs text-gray-400 mt-1">Already out of the military / in civilian life</div>
              </button>
            </div>

            {!alreadyOut && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300 font-bold">Months until {bd.sep}:</span>
                  <span className={"text-xl font-black " + bd.text}>{separationMonths} months</span>
                </div>
                <input type="range" min={1} max={24} value={separationMonths} onChange={e=>setSeparationMonths(Number(e.target.value))}
                  className="w-full h-2 rounded-full cursor-pointer accent-red-600 bg-gray-800"/>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 mo</span><span>6 mo (BDD Window)</span><span>12 mo</span><span>24 mo</span>
                </div>
              </div>
            )}

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <div className="text-sm font-bold text-gray-300 mb-2">Character of Discharge:</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id:'honorable', label:'Honorable (Full Benefits)' },
                  { id:'general', label:'General Under Honorable' },
                  { id:'oth', label:'Other Than Honorable (OTH)' },
                  { id:'bad_conduct', label:'Bad Conduct / Medical' },
                ].map(d=>(
                  <button key={d.id} onClick={()=>setDischargeType(d.id)}
                    className={"p-2.5 rounded-xl border text-xs text-left transition-all " + (dischargeType===d.id ? "border-scarlet bg-scarlet/10 text-white font-bold" : "border-gray-800 text-gray-400 hover:border-gray-700")}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

        case 2: return (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="text-2xl font-black mb-1">Health & Disability Status</h2>
              <p className="text-gray-400 text-sm">Let's see what benefits you have claimed or are eligible to stack.</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <div className="text-sm font-bold text-gray-300 mb-2">Current VA Claim Status:</div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { val:'none', label:'Never Filed' },
                  { val:'filed', label:'Claim Pending' },
                  { val:'rated', label:'Currently Rated' },
                ].map(s=>(
                  <button key={s.val} onClick={()=>setDisabilityStatus(s.val)}
                    className={"p-2.5 rounded-xl border text-center text-xs transition-all " + (disabilityStatus===s.val ? "border-scarlet bg-scarlet/10 text-white font-bold" : "border-gray-800 text-gray-400 hover:border-gray-700")}>
                    {s.label}
                  </button>
                ))}
              </div>

              {(disabilityStatus === 'rated' || disabilityStatus === 'filed') && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Current Combined Rating:</span>
                    <span className="font-black text-xl text-scarlet">{currentRating}%</span>
                  </div>
                  <input type="range" min={0} max={100} step={10} value={currentRating} onChange={e=>setCurrentRating(Number(e.target.value))}
                    className="w-full h-2 rounded-full cursor-pointer accent-red-600 bg-gray-800"/>
                  <div className="flex justify-between text-xs text-gray-500 mt-1"><span>0%</span><span>50%</span><span>100% P&T</span></div>
                </div>
              )}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-2">
              <div className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-1.5"><ShieldAlert size={16} className="text-amber-400"/> Special Service Exposures</div>
              {[
                { state:servedPost911, setter:setServedPost911, label:'Served Post-9/11 (qualifies for 100% Chapter 33 GI Bill)' },
                { state:exposedBurnPit, setter:setExposedBurnPit, label:'Exposed to Burn Pits / Toxic Chemicals / SW Asia (PACT Act Presumptive)' },
                { state:mstFlag, setter:setMstFlag, label:'Military Sexual Trauma (MST) experienced (Confidential specialized claim)' }
              ].map((item,i)=>(
                <button key={i} onClick={()=>item.setter(!item.state)}
                  className={"w-full p-3 rounded-xl border text-left text-xs flex items-center gap-3 transition-all " + (item.state ? "border-amber-500/50 bg-amber-950/20 text-amber-200" : "border-gray-800 text-gray-400 hover:border-gray-700")}>
                  <div className={"w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 " + (item.state ? "border-amber-400 bg-amber-500 text-black font-black" : "border-gray-600")}>
                    {item.state && "✓"}
                  </div>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

        case 3: return (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="text-2xl font-black mb-1">Location & Family Status</h2>
              <p className="text-gray-400 text-sm">State laws and dependent counts determine your property tax waivers and exact monthly cash payments.</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <div className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-1.5"><MapPin size={16} className="text-scarlet"/> Target State for Living & Real Estate:</div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {Object.entries(STATE_BENEFITS_EXTENDED).map(([key,s])=>(
                  <button key={key} onClick={()=>setSelectedState(key)}
                    className={"p-2.5 rounded-xl border text-xs text-center transition-all " + (selectedState===key ? "border-scarlet bg-scarlet/10 text-scarlet font-black" : "border-gray-800 text-gray-400 hover:border-gray-700")}>
                    <div className="font-bold">{s.emoji} {s.name}</div>
                    <div className="text-[10px] text-gray-500 font-normal mt-0.5">{s.ratingGrade} Grade</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <div className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-1.5"><Users size={16} className="text-scarlet"/> Dependent Status (Increases VA Pay Rate):</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { val:'single', label:'Single (No Dependents)' },
                  { val:'unmarried_kids', label:'Single with Child(ren)' },
                  { val:'spouse', label:'Married (No Children)' },
                  { val:'family', label:'Married with Child(ren)' },
                ].map(d=>(
                  <button key={d.val} onClick={()=>setHasDependents(d.val)}
                    className={"p-3 rounded-xl border text-xs text-left transition-all " + (hasDependents===d.val ? "border-scarlet bg-scarlet/10 text-white font-bold" : "border-gray-800 text-gray-400 hover:border-gray-700")}>
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
        
        {/* Wizard Header */}
        <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-4">
          <button onClick={()=>setCurrentPage('landing')} className="text-gray-500 hover:text-white transition-colors"><ChevronLeft size={20}/></button>
          <div className="flex-1">
            <div className="flex gap-1.5 mb-1.5">
              {steps.map((_,i)=><div key={i} className={"flex-1 h-2 rounded-full transition-all " + (i<=wizardStep ? "bg-scarlet" : "bg-gray-800")}/>)}
            </div>
            <div className="flex justify-between text-xs">
              {steps.map((s,i)=><span key={i} className={i===wizardStep ? "text-scarlet font-black" : i<wizardStep ? "text-gray-400" : "text-gray-700"}>{s}</span>)}
            </div>
          </div>
        </div>

        {/* Wizard Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-2xl mx-auto"><WizardStepContent/></div>
        </div>

        {/* Wizard Footer Navigation */}
        <div className="bg-gray-900 border-t border-gray-800 p-4">
          <div className="max-w-2xl mx-auto flex gap-3">
            {wizardStep > 0 && (
              <button onClick={()=>setWizardStep(w=>w-1)} className="flex-1 py-3 border border-gray-800 hover:border-gray-700 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 text-gray-300">
                <ChevronLeft size={16}/> Back
              </button>
            )}
            {wizardStep < steps.length - 1 ? (
              <button onClick={()=>setWizardStep(w=>w+1)} className="flex-1 py-3 bg-scarlet hover:bg-red-700 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 text-white shadow-lg">
                Continue <ChevronRight size={16}/>
              </button>
            ) : (
              <button onClick={()=>{ setCurrentPage('dashboard'); setActiveTab('freedom'); }} className="flex-1 py-3.5 bg-scarlet hover:bg-red-700 rounded-xl font-black text-base transition-all flex items-center justify-center gap-2 text-white shadow-xl shadow-red-900/30">
                Generate Custom Blueprint <ArrowRight size={18}/>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // RENDER: DASHBOARD TABS
  // -----------------------------------------------------------------------
  const tabs = [
    { id:'freedom',   icon:<Sparkles size={15}/>,   label:'Financial Freedom' },
    { id:'calculator',icon:<Home size={15}/>,       label:'VA House Hacker' },
    { id:'claims',    icon:<TrendingUp size={15}/>, label:'Claims & C&P Sim' },
    { id:'scanner',   icon:<Cpu size={15}/>,        label:'Med Scanner' },
    { id:'mission',   icon:<Target size={15}/>,     label:'Mission Control' },
    { id:'benefits',  icon:<DollarSign size={15}/>, label:'State Matrix' },
    { id:'tracker',   icon:<CheckSquare size={15}/>,label:'Master Checklist' },
    { id:'upgrade',   icon:<Award size={15}/>,      label:'Discharge Guide' },
    { id:'resources', icon:<Phone size={15}/>,      label:'Resources' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col selection:bg-red-600 selection:text-white">
      <CrisisBanner/>

      {/* Top Navbar */}
      <div className="bg-gray-900/90 backdrop-blur border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={()=>setCurrentPage('landing')} className="flex items-center gap-2 group">
            <Shield className="text-scarlet group-hover:scale-110 transition-transform" size={22}/>
            <span className="font-black text-lg tracking-tight">VBC <span className="text-gray-500 font-normal text-sm">| {bd.badge}</span></span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs bg-gray-800/80 px-3 py-1.5 rounded-full border border-gray-700">
            <span className="text-gray-400">Rating:</span>
            <span className="font-black text-scarlet">{currentRating > 0 ? `${currentRating}%` : 'Unrated'}</span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-400">Location:</span>
            <span className="font-bold text-amber-400">{stateInfo.emoji}</span>
          </div>

          <button onClick={()=>setCurrentPage('wizard')} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700 flex items-center gap-1.5 transition-colors">
            <Edit3 size={13}/> Profile
          </button>
        </div>
      </div>

      {/* Sub-Navbar Horizontal Scroll */}
      <div className="bg-gray-900 border-b border-gray-800 overflow-x-auto scrollbar-none">
        <div className="flex gap-1 px-4 min-w-max">
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)}
              className={"flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap " + (activeTab===t.id ? "border-scarlet text-scarlet bg-scarlet/5" : "border-transparent text-gray-400 hover:text-gray-200")}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">

          {/* ================================================================= */}
          {/* TAB 1: ULTIMATE FINANCIAL FREEDOM MASTER PLAN                    */}
          {/* ================================================================= */}
          {activeTab === 'freedom' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-red-950 via-gray-900 to-gray-900 border border-red-800/40 rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-96 h-full bg-scarlet/10 blur-3xl pointer-events-none"/>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-black uppercase tracking-wider mb-2">
                    <Award size={14} className="text-amber-400"/> The Golden Stacking Protocol
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tight">
                    The Recommended Route to <span className="text-scarlet">Ultimate Financial Freedom</span>
                  </h2>
                  <p className="text-gray-300 text-sm mt-2 max-w-2xl leading-relaxed">
                    Veterans who retire wealthy in their 20s and 30s do not rely on chance. They execute a precise, legal benefit arbitrage stack: combining 100% P&T VA Disability with High-BAH education stipends, zero-down multi-family real estate, and cleared career velocity.
                  </p>
                </div>
              </div>

              {/* Stage Navigation Pills */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Select Your Current Starting Point:</div>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {FREEDOM_STAGES.map((s)=>(
                    <button key={s.id} onClick={()=>setActiveFreedomStage(s.id)}
                      className={"p-3 rounded-2xl border text-left transition-all " + (activeFreedomStage===s.id ? "border-scarlet bg-scarlet/15 text-white shadow-lg ring-1 ring-scarlet" : "border-gray-800 bg-gray-900/60 text-gray-400 hover:border-gray-700")}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={"text-xs font-black px-2 py-0.5 rounded-full " + (activeFreedomStage===s.id ? "bg-scarlet text-white" : "bg-gray-800 text-gray-400")}>
                          Stage {s.stageNum}
                        </span>
                      </div>
                      <div className="font-bold text-xs line-clamp-1">{s.title}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{s.timeframe}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Stage Detail Card */}
              {(() => {
                const stage = FREEDOM_STAGES.find(s=>s.id === activeFreedomStage) || FREEDOM_STAGES[0];
                return (
                  <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-4">
                      <div>
                        <div className="text-xs font-black text-amber-400 uppercase tracking-widest">Stage {stage.stageNum} of 5 • {stage.timeframe}</div>
                        <h3 className="text-2xl font-black text-white mt-1">{stage.title}</h3>
                        <p className="text-scarlet font-medium text-sm mt-0.5">{stage.tagline}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {stage.corePillars.map((p,i)=>(
                        <div key={i} className="bg-gray-950/80 border border-gray-800 rounded-2xl p-4 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 text-scarlet font-black text-sm mb-2">
                              <span className="w-5 h-5 rounded-full bg-scarlet/20 flex items-center justify-center text-xs font-black">{i+1}</span>
                              {p.title}
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed">{p.desc}</p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-gray-800/80 text-[11px] text-emerald-400 font-semibold flex items-start gap-1.5">
                            <CheckCircle size={14} className="flex-shrink-0 mt-0.5"/>
                            <span>Action: {p.action}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pro Move Callout */}
                    <div className="bg-gradient-to-r from-amber-950/40 via-gray-950 to-gray-950 border border-amber-500/40 rounded-2xl p-4 flex items-start gap-3">
                      <Zap size={20} className="text-amber-400 flex-shrink-0 mt-0.5"/>
                      <div className="text-xs">
                        <span className="font-black text-amber-300 uppercase tracking-wider">The Veteran Pro Move: </span>
                        <span className="text-gray-300">{stage.proTip}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* LIVE WEALTH ENGINE & COMPOUNDING SIMULATOR */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                      <BarChart3 size={20} className="text-emerald-400"/>
                      Interactive Triple-Income Wealth Simulator
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Adjust your income streams to see your live net cash flow and 10-year compounding projection.</p>
                  </div>
                </div>

                {/* Input Sliders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* VA Disability Rating */}
                  <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-gray-400 font-bold">VA Disability Rating:</span>
                      <span className="text-scarlet font-black text-sm">{wealthRating}% (${wealthData.vaMonthly.toLocaleString()}/mo Tax-Free)</span>
                    </div>
                    <input type="range" min={0} max={100} step={10} value={wealthRating} onChange={e=>setWealthRating(Number(e.target.value))}
                      className="w-full h-2 rounded-full cursor-pointer accent-red-600 bg-gray-800"/>
                  </div>

                  {/* GI Bill / VR&E BAH */}
                  <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-gray-400 font-bold">GI Bill / VR&E MHA Housing:</span>
                      <span className="text-amber-400 font-black text-sm">${wealthBah.toLocaleString()}/mo Tax-Free</span>
                    </div>
                    <input type="range" min={0} max={5000} step={200} value={wealthBah} onChange={e=>setWealthBah(Number(e.target.value))}
                      className="w-full h-2 rounded-full cursor-pointer accent-amber-500 bg-gray-800"/>
                  </div>

                  {/* Civilian Job Salary */}
                  <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-gray-400 font-bold">Civilian Career / Defense Salary:</span>
                      <span className="text-blue-400 font-black text-sm">${wealthSalary.toLocaleString()}/yr Gross</span>
                    </div>
                    <input type="range" min={0} max={200000} step={5000} value={wealthSalary} onChange={e=>setWealthSalary(Number(e.target.value))}
                      className="w-full h-2 rounded-full cursor-pointer accent-blue-500 bg-gray-800"/>
                  </div>

                  {/* Rental Income from House Hacking */}
                  <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-bold">VA Loan Tenant Units ({wealthRentalUnits}):</span>
                      <span className="text-emerald-400 font-black text-sm">${(wealthRentalUnits * wealthRentPerUnit).toLocaleString()}/mo Gross</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      {[0, 1, 2, 3].map(u=>(
                        <button key={u} onClick={()=>setWealthRentalUnits(u)}
                          className={"flex-1 py-1 rounded-lg text-xs font-bold border transition-all " + (wealthRentalUnits===u ? "border-emerald-500 bg-emerald-950 text-emerald-300" : "border-gray-800 text-gray-500")}>
                          {u === 0 ? '0 Units' : `${u} Unit${u>1?'s':''}`}
                        </button>
                      ))}
                    </div>
                    {wealthRentalUnits > 0 && (
                      <div className="pt-1">
                        <div className="flex justify-between text-[11px] text-gray-400 font-bold mb-1">
                          <span>Rent / Unit:</span>
                          <span className="text-emerald-400">${wealthRentPerUnit}/mo</span>
                        </div>
                        <input type="range" min={600} max={3000} step={50} value={wealthRentPerUnit} onChange={e=>setWealthRentPerUnit(Number(e.target.value))}
                          className="w-full h-1.5 rounded-full cursor-pointer accent-emerald-500 bg-gray-800"/>
                      </div>
                    )}
                  </div>
                </div>

                {/* Calculation Outputs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4">
                    <div className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">Total Monthly Net Cash</div>
                    <div className="text-2xl sm:text-3xl font-black text-white mt-1">${wealthData.totalNetMonthly.toLocaleString()}</div>
                    <div className="text-[11px] text-emerald-400 font-semibold mt-1">${wealthData.totalNetAnnual.toLocaleString()} / year take-home</div>
                  </div>

                  <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4">
                    <div className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">Tax-Free Shield Share</div>
                    <div className="text-2xl sm:text-3xl font-black text-scarlet mt-1">${wealthData.totalTaxFreeAnnual.toLocaleString()}</div>
                    <div className="text-[11px] text-gray-400 mt-1">100% exempt from all taxes</div>
                  </div>

                  <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4">
                    <div className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">Civilian Equivalent Gross</div>
                    <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">${wealthData.equivalentPreTaxIncome.toLocaleString()}</div>
                    <div className="text-[11px] text-gray-400 mt-1">Gross salary civilians need to match</div>
                  </div>

                  <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4">
                    <div className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">10-Yr Invested Net Worth</div>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">${(wealthData.compound10Yr / 1000000).toFixed(2)}M</div>
                    <div className="text-[11px] text-emerald-500 mt-1">5-Yr: ${(wealthData.compound5Yr / 1000).toFixed(0)}k at 8% CAGR</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: VA MULTI-FAMILY HOUSE HACK CALCULATOR                     */}
          {/* ================================================================= */}
          {activeTab === 'calculator' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-950/60 via-gray-900 to-gray-900 border border-emerald-800/40 rounded-3xl p-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
                  <Building size={14}/> The Ultimate Real Estate Wealth Multiplier
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  VA Multi-Family <span className="text-emerald-400">House Hacking Engine</span>
                </h2>
                <p className="text-gray-300 text-sm mt-1 max-w-2xl leading-relaxed">
                  The VA Loan allows you to buy up to a <span className="text-emerald-400 font-bold">4-unit residential property</span> with $0 down payment and $0 PMI. Combine this with the 100% P&T state property tax exemption to live 100% mortgage-free while building massive equity.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inputs */}
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-4">
                  <h3 className="text-lg font-black text-white flex items-center gap-2"><Home size={18} className="text-scarlet"/> Property Parameters</h3>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-400">Purchase Price ($0 Down VA Loan):</span>
                      <span className="text-emerald-400 text-sm font-black">${homePrice.toLocaleString()}</span>
                    </div>
                    <input type="range" min={200000} max={1500000} step={25000} value={homePrice} onChange={e=>setHomePrice(Number(e.target.value))}
                      className="w-full h-2 rounded-full cursor-pointer accent-emerald-500 bg-gray-800"/>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-400">Mortgage Interest Rate:</span>
                      <span className="text-white text-sm font-black">{interestRate}%</span>
                    </div>
                    <input type="range" min={4.0} max={9.0} step={0.125} value={interestRate} onChange={e=>setInterestRate(Number(e.target.value))}
                      className="w-full h-2 rounded-full cursor-pointer accent-emerald-500 bg-gray-800"/>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-gray-400 mb-2">Total Units (You live in 1, rent out the rest):</div>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { u:1, label:'Single Family' },
                        { u:2, label:'Duplex (2)' },
                        { u:3, label:'Triplex (3)' },
                        { u:4, label:'Fourplex (4)' },
                      ].map(item=>(
                        <button key={item.u} onClick={()=>setPropertyUnits(item.u)}
                          className={"p-2 rounded-xl border text-center text-xs font-bold transition-all " + (propertyUnits===item.u ? "border-emerald-500 bg-emerald-950 text-emerald-300" : "border-gray-800 text-gray-500 hover:border-gray-700")}>
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {propertyUnits > 1 && (
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-gray-400">Average Monthly Rent per Tenant Unit:</span>
                        <span className="text-emerald-400 text-sm font-black">${rentPerTenantUnit.toLocaleString()}/mo</span>
                      </div>
                      <input type="range" min={600} max={3500} step={50} value={rentPerTenantUnit} onChange={e=>setRentPerTenantUnit(Number(e.target.value))}
                        className="w-full h-2 rounded-full cursor-pointer accent-emerald-500 bg-gray-800"/>
                    </div>
                  )}

                  <div className="space-y-2 pt-2 border-t border-gray-800">
                    <button onClick={()=>setHasDisabilityFundingWaiver(!hasDisabilityFundingWaiver)}
                      className={"w-full p-2.5 rounded-xl border text-left text-xs flex items-center justify-between transition-all " + (hasDisabilityFundingWaiver ? "border-emerald-500/50 bg-emerald-950/20 text-emerald-200" : "border-gray-800 text-gray-500")}>
                      <span>10%+ VA Disability (Funding Fee Waived)</span>
                      <span className="font-black text-emerald-400">{hasDisabilityFundingWaiver ? 'WAIVED' : 'Standard Fee'}</span>
                    </button>

                    <button onClick={()=>setHasPtTaxExemption(!hasPtTaxExemption)}
                      className={"w-full p-2.5 rounded-xl border text-left text-xs flex items-center justify-between transition-all " + (hasPtTaxExemption ? "border-emerald-500/50 bg-emerald-950/20 text-emerald-200" : "border-gray-800 text-gray-500")}>
                      <span>100% P&T State Property Tax Exemption</span>
                      <span className="font-black text-emerald-400">{hasPtTaxExemption ? '$0 Property Tax' : 'Full Tax'}</span>
                    </button>
                  </div>
                </div>

                {/* Results Card */}
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Your Net Monthly Housing Cost:</div>
                    <div className={"text-4xl font-black tracking-tight " + (houseData.isProfitable ? "text-emerald-400" : "text-amber-400")}>
                      {houseData.isProfitable ? `+$${houseData.netHousingCost.toLocaleString()}/mo (PROFIT)` : `$${houseData.netHousingCost.toLocaleString()}/mo out of pocket`}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {houseData.isProfitable
                        ? `Your tenants completely pay your mortgage AND put $${houseData.netHousingCost.toLocaleString()} in your pocket every month!`
                        : `Your ${houseData.tenantUnitsCount} tenant unit${houseData.tenantUnitsCount!==1?'s':''} pay ${Math.round((houseData.totalRentalIncome/houseData.totalMonthlyPayment)*100)}% of your mortgage payment.`}
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-b border-gray-800 py-4 text-xs">
                    <div className="flex justify-between text-gray-300">
                      <span>Principal & Interest (30-Yr Fixed):</span>
                      <span className="font-bold text-white">${houseData.monthlyPrincipalAndInterest.toLocaleString()}/mo</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Real Estate Property Tax:</span>
                      <span className={"font-bold " + (hasPtTaxExemption ? "text-emerald-400" : "text-white")}>
                        {hasPtTaxExemption ? '$0 (100% P&T Exemption)' : `$${houseData.monthlyTax.toLocaleString()}/mo`}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Homeowners Insurance:</span>
                      <span className="font-bold text-white">${houseData.monthlyInsurance.toLocaleString()}/mo</span>
                    </div>
                    <div className="flex justify-between font-bold text-white pt-2 border-t border-gray-800">
                      <span>Total Mortgage Payment:</span>
                      <span className="text-scarlet font-black">${houseData.totalMonthlyPayment.toLocaleString()}/mo</span>
                    </div>
                    <div className="flex justify-between font-bold text-emerald-400">
                      <span>Total Rental Income ({houseData.tenantUnitsCount} tenant units):</span>
                      <span>+${houseData.totalRentalIncome.toLocaleString()}/mo</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-950 p-3 rounded-xl border border-gray-800">
                      <div className="text-gray-500 font-bold">VA Funding Fee Saved</div>
                      <div className="text-base font-black text-emerald-400 mt-0.5">${houseData.fundingFeeSaved.toLocaleString()}</div>
                    </div>
                    <div className="bg-gray-950 p-3 rounded-xl border border-gray-800">
                      <div className="text-gray-500 font-bold">Annual Property Tax Saved</div>
                      <div className="text-base font-black text-emerald-400 mt-0.5">${houseData.annualPropertyTaxSaved.toLocaleString()}/yr</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: CLAIMS ROADMAP & C&P EXAM SIMULATOR                       */}
          {/* ================================================================= */}
          {activeTab === 'claims' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Roadmap to 100% P&T & C&P Simulator</h2>
                <p className="text-gray-400 text-sm">Strategic tools to maximize your legitimate rating schedule without leaving money on the table.</p>
              </div>

              {/* Sub-Tabs */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id:'math', label:'VA Math Simulator' },
                  { id:'exam_sim', label:'C&P Exam Practice Simulator' },
                  { id:'secondaries', label:'Secondary Stacking Matrix' },
                  { id:'terms', label:'Diagnostic Code Lexicon' },
                  { id:'pact', label:'PACT Act Presumptives' },
                  { id:'tdiu', label:'TDIU ($3,737/mo at 70%)' },
                ].map(s=>(
                  <button key={s.id} onClick={()=>setClaimsSubTab(s.id)}
                    className={"px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all " + (claimsSubTab===s.id ? "bg-scarlet border-scarlet text-white shadow-lg" : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700")}>
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Interactive VA Math */}
              {claimsSubTab === 'math' && (
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-4">
                  <div>
                    <h3 className="font-black text-lg text-white">Interactive Whole-Person VA Math Engine</h3>
                    <p className="text-gray-400 text-xs mt-0.5">The VA does not use standard addition. Each disability percentage is calculated against your remaining non-disabled whole person capacity.</p>
                  </div>

                  <div className="space-y-2">
                    {claimsList.map((val,i)=>(
                      <div key={i} className="flex items-center gap-3 bg-gray-950 p-2.5 rounded-xl border border-gray-800">
                        <span className="text-xs font-black text-gray-500 w-8 text-center">#{i+1}</span>
                        <select value={val} onChange={e=>{ const c=[...claimsList]; c[i]=Number(e.target.value); setClaimsList(c); }}
                          className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1 text-xs text-white flex-1 font-bold">
                          {[10,20,30,40,50,60,70,80,90].map(v=><option key={v} value={v}>{v}% Disability Evaluation</option>)}
                        </select>
                        <button onClick={()=>setClaimsList(claimsList.filter((_,j)=>j!==i))} className="text-gray-500 hover:text-red-400 p-1">
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <select value={newClaimVal} onChange={e=>setNewClaimVal(Number(e.target.value))}
                      className="bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white flex-1 font-bold">
                      {[10,20,30,40,50,60,70,80,90].map(v=><option key={v} value={v}>{v}% Claim</option>)}
                    </select>
                    <button onClick={()=>setClaimsList([...claimsList,newClaimVal])}
                      className="flex items-center gap-1.5 bg-scarlet hover:bg-red-700 px-4 py-2 rounded-xl text-xs font-black text-white transition-all shadow-md">
                      <Plus size={15}/> Add Condition
                    </button>
                  </div>

                  <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5 text-center">
                    <div className="text-gray-400 text-xs uppercase font-bold tracking-wider">Exact Combined Raw Calculation:</div>
                    <div className="text-5xl font-black text-scarlet my-1">{combinedRaw}%</div>
                    <div className="text-gray-300 text-sm">Official VA Rounded Rating: <span className="text-white font-black text-2xl">{roundedRating}%</span></div>
                    <div className="text-emerald-400 text-base font-black mt-2">
                      ${(VA_PAY_RATES[roundedRating] || VA_PAY_RATES[0])[depKey]?.toLocaleString() || '0'} / month Tax-Free (${((VA_PAY_RATES[roundedRating] || VA_PAY_RATES[0])[depKey] * 12)?.toLocaleString()}/year)
                    </div>
                  </div>
                </div>
              )}

              {/* C&P Exam Simulator */}
              {claimsSubTab === 'exam_sim' && (
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-6">
                  <div>
                    <h3 className="font-black text-lg text-white flex items-center gap-2">
                      <Activity size={20} className="text-scarlet"/>
                      C&P Disability Examination Practice Simulator
                    </h3>
                    <p className="text-gray-400 text-xs mt-0.5">Test your responses against real VA Disability Benefit Questionnaires (DBQs) to avoid the fatal pitfalls that cost veterans their ratings.</p>
                  </div>

                  <div className="flex gap-2">
                    {CP_SIMULATOR_SCENARIOS.map((sc)=>(
                      <button key={sc.id} onClick={()=>{ setSelectedCpScenario(sc.id); setCpChoice(null); }}
                        className={"px-3 py-1.5 rounded-xl border text-xs font-bold transition-all " + (selectedCpScenario===sc.id ? "border-scarlet bg-scarlet/10 text-scarlet" : "border-gray-800 text-gray-400 hover:border-gray-700")}>
                        {sc.title}
                      </button>
                    ))}
                  </div>

                  {(() => {
                    const sc = CP_SIMULATOR_SCENARIOS.find(s=>s.id===selectedCpScenario) || CP_SIMULATOR_SCENARIOS[0];
                    return (
                      <div className="space-y-4">
                        <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800">
                          <div className="text-xs font-bold text-scarlet uppercase tracking-wider mb-1">C&P Examiner Question:</div>
                          <div className="text-sm font-medium text-white italic">{sc.examinerPrompt}</div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Choose your response:</div>
                          {sc.options.map((opt,i)=>(
                            <button key={i} onClick={()=>setCpChoice(opt)}
                              className={"w-full p-4 rounded-2xl border text-left text-xs transition-all " + (cpChoice===opt ? "border-scarlet bg-scarlet/15 text-white" : "border-gray-800 bg-gray-950/60 hover:border-gray-700 text-gray-300")}>
                              <div className="font-bold text-sm leading-relaxed">{opt.text}</div>
                            </button>
                          ))}
                        </div>

                        {cpChoice && (
                          <div className={"p-4 rounded-2xl border text-xs space-y-2 " + (cpChoice.isOptimal ? "border-emerald-500/50 bg-emerald-950/30 text-emerald-200" : "border-red-500/50 bg-red-950/30 text-red-200")}>
                            <div className="font-black text-sm uppercase tracking-wider flex items-center gap-1.5">
                              {cpChoice.isOptimal ? <CheckCircle size={16} className="text-emerald-400"/> : <AlertTriangle size={16} className="text-red-400"/>}
                              Outcome: {cpChoice.ratingImpact}
                            </div>
                            <p className="text-gray-200 leading-relaxed">{cpChoice.feedback}</p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Secondary Stacking Matrix */}
              {claimsSubTab === 'secondaries' && (
                <div className="space-y-4">
                  <div className="bg-blue-950/30 border border-blue-800/40 rounded-2xl p-4 text-xs text-blue-200">
                    <span className="font-bold">Secondary Claims Principle: </span>
                    You do NOT need to prove secondary conditions happened in military service. You only need to prove they are caused or aggravated by an already service-connected condition.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { primary:'PTSD / Mental Health (DC 9411)', secondaries:['Obstructive Sleep Apnea (50% w/ CPAP)','GERD / Acid Reflux (10-60%)','Hypertension (10-20%)','Migraines (0-50%)','Bruxism / TMJ (10-30%)','Erectile Dysfunction (SMC-K)'] },
                      { primary:'Lumbar Spine Strain (DC 5237)', secondaries:['Sciatica / Lower Radiculopathy Left & Right (10-40% each)','Obstructive Sleep Apnea (Altered Sleep/Weight)','Depression Secondary to Chronic Pain','Hip Impingement / Altered Gait'] },
                      { primary:'Cervical Spine / Neck (DC 5237)', secondaries:['Upper Extremity Radiculopathy Left & Right (10-30% each)','Migraine Headaches','Carpal Tunnel Syndrome','Sleep Disturbance'] },
                      { primary:'Tinnitus (DC 6260)', secondaries:['Migraine Headaches / Tension Headaches','Sleep Apnea / Insomnia','Depression / Anxiety Secondary to Chronic Ringing'] },
                    ].map((item,i)=>(
                      <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-3">
                        <div className="text-scarlet font-black text-sm border-b border-gray-800 pb-2">{item.primary}</div>
                        <div className="space-y-1.5">
                          {item.secondaries.map((s,j)=>(
                            <div key={j} className="text-xs bg-gray-950 border border-gray-800 px-3 py-1.5 rounded-xl text-gray-300 flex items-center gap-2">
                              <span className="text-emerald-400 font-bold">+</span> {s}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Diagnostic Code Lexicon */}
              {claimsSubTab === 'terms' && (
                <div className="space-y-3">
                  <div className="bg-amber-950/30 border border-amber-800/40 rounded-2xl p-4 text-xs text-amber-200">
                    <span className="font-bold">Legal Terminology Rule: </span>
                    Never write "Back hurts" or "Sadness". Use the exact Diagnostic Code (DC) nomenclature from 38 CFR Part 4 so the VA rater maps your file immediately.
                  </div>

                  <div className="grid gap-3">
                    {[
                      { wrong:'Back pain / lower back', right:'Lumbosacral Strain (DC 5237) or Intervertebral Disc Syndrome IVDS (DC 5243)', tip:'Claim both limitation of flexion and intervertebral disc syndrome.' },
                      { wrong:'Ringing in ears', right:'Tinnitus (DC 6260)', tip:'Flat 10% rate. The #1 most granted claim in the VA.' },
                      { wrong:'Snoring / bad sleep', right:'Obstructive Sleep Apnea (DC 6847)', tip:'Automatic 50% if prescribed a CPAP. File secondary to PTSD, asthma, or pain.' },
                      { wrong:'Sadness / stress', right:'Major Depressive Disorder (DC 9434) / PTSD (DC 9411)', tip:'Rated by occupational and social impairment.' },
                      { wrong:'Numbness in arms/legs', right:'Peripheral Neuropathy / Radiculopathy (DC 8510-8530)', tip:'Rate each limb separately for doubled rating power.' }
                    ].map((t,i)=>(
                      <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-red-950/30 border border-red-900/40 p-3 rounded-xl">
                          <span className="text-red-400 font-bold">Incorrect: </span>
                          <span className="text-gray-300">"{t.wrong}"</span>
                        </div>
                        <div className="bg-emerald-950/30 border border-emerald-900/40 p-3 rounded-xl">
                          <span className="text-emerald-400 font-bold">Exact VA Lexicon: </span>
                          <span className="text-white font-medium">"{t.right}"</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PACT Act Tab */}
              {claimsSubTab === 'pact' && (
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-4">
                  <div className="bg-orange-950/40 border border-orange-700/50 rounded-2xl p-4 text-xs text-orange-200">
                    <h4 className="font-black text-sm text-orange-300 mb-1">The PACT Act Presumptive Privilege</h4>
                    If you served in post-9/11 Southwest Asia zones, 20+ respiratory conditions and cancers are PRESUMED service-connected. You do NOT need an in-service medical event or nexus letter.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-300">
                    <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 space-y-2">
                      <div className="font-black text-white text-sm text-orange-400">Qualifying Locations:</div>
                      <p>Iraq, Afghanistan, Kuwait, Saudi Arabia, Qatar, UAE, Bahrain, Oman, Syria, Jordan, Egypt, Lebanon, Yemen, Djibouti, Uzbekistan.</p>
                    </div>
                    <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 space-y-2">
                      <div className="font-black text-white text-sm text-orange-400">Presumptive Diagnoses:</div>
                      <p>Chronic Rhinitis, Chronic Sinusitis, Asthma, Bronchiolitis, Pulmonary Fibrosis, COPD, Glioblastoma, Melanoma, Respiratory Cancers, Gastrointestinal Cancers.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TDIU Tab */}
              {claimsSubTab === 'tdiu' && (
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-4">
                  <div className="bg-blue-950/40 border border-blue-700/50 rounded-2xl p-4 text-xs text-blue-200">
                    <h4 className="font-black text-sm text-blue-300 mb-1">Total Disability Individual Unemployability (TDIU)</h4>
                    Receive 100% pay ($3,737 - $4,094+/mo tax-free) with a combined rating of only 70% if your service-connected disabilities prevent gainful employment.
                  </div>
                  <div className="text-xs text-gray-300 leading-relaxed space-y-2 bg-gray-950 p-4 rounded-2xl border border-gray-800">
                    <p><span className="font-bold text-white">Schedular Criteria:</span> One disability at 60%+ OR two or more disabilities with one at 40%+ and combined at 70%+.</p>
                    <p><span className="font-bold text-white">How to File:</span> Submit VA Form 21-8940 along with physician vocational limitation letters.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: MEDICAL FILE SCANNER                                      */}
          {/* ================================================================= */}
          {activeTab === 'scanner' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Medical File Scanner & Blueprint Generator</h2>
                <p className="text-gray-400 text-sm">Paste raw notes from your military medical records, C&P exams, or separation physical to detect high-value claims.</p>
              </div>

              <div className="bg-amber-950/30 border border-amber-800/40 rounded-2xl p-3 text-xs text-amber-300 flex items-center gap-2">
                <Lock size={14} className="flex-shrink-0"/>
                <span>100% Client-Side Privacy: Your records are processed entirely in your browser memory and never uploaded to any remote server.</span>
              </div>

              <div
                className="bg-gray-900 border-2 border-dashed border-gray-800 hover:border-scarlet/60 rounded-3xl p-6 text-center transition-all cursor-pointer"
                onClick={()=>fileInputRef.current?.click()}>
                <Upload className="mx-auto mb-2 text-gray-500" size={32}/>
                <div className="text-gray-200 font-bold text-sm">Upload Records (.txt file from VA Blue Button)</div>
                <input ref={fileInputRef} type="file" accept=".txt,.text" className="hidden" onChange={handleFileUpload}/>
              </div>

              <textarea
                className="w-full h-36 bg-gray-900 border border-gray-800 rounded-2xl p-4 text-xs text-gray-200 resize-y focus:outline-none focus:border-scarlet transition-colors font-mono"
                placeholder="Or paste your medical records, separation physical notes, or C&P notes here..."
                value={scanText}
                onChange={e=>setScanText(e.target.value)}
              />

              <div className="flex gap-2">
                <button onClick={runMedScan} disabled={!scanText.trim()||scanLoading}
                  className="flex-1 py-3 bg-scarlet hover:bg-red-700 disabled:bg-gray-800 disabled:text-gray-600 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 text-xs shadow-lg">
                  {scanLoading ? <><Activity size={16} className="animate-spin"/> Analyzing Medical Records...</> : <><Search size={16}/> Run Medical Record Scan</>}
                </button>
                {!scanResults && (
                  <button onClick={()=>setScanText("Patient reports chronic lower back pain and lumbar strain since jump master duties. Constant bilateral tinnitus noted. Sleep study diagnosed severe obstructive sleep apnea requiring CPAP. PTSD diagnosis confirmed following deployment to Iraq and Syria. Patient reports frequent acid reflux consistent with GERD. Cervical strain and radiculopathy noted in right arm. Headaches 3x per month.")}
                    className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold rounded-2xl border border-gray-700 transition-colors">
                    Load Sample Record
                  </button>
                )}
              </div>

              {scanResults && (
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                    <div>
                      <h3 className="text-lg font-black text-emerald-400">Scan Complete: {scanResults.totalFound} Claim Opportunities Identified</h3>
                      <p className="text-xs text-gray-400">Review your generated claim codes and potential secondary stacks below.</p>
                    </div>
                    <button onClick={()=>{ setScanResults(null); setScanText(''); }} className="text-xs text-gray-500 hover:text-white p-1">Clear</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {scanResults.found.map((item,i)=>(
                      <div key={i} className="bg-gray-950 p-4 rounded-2xl border border-gray-800 space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="font-black text-white text-sm">{item.condition}</span>
                          <span className="text-[10px] font-black bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full">DC {item.dc}</span>
                        </div>
                        <div className="text-xs text-scarlet font-bold">Rating Range: {item.ratingRange}</div>
                        <p className="text-xs text-gray-400">{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: MISSION CONTROL OVERVIEW                                  */}
          {/* ================================================================= */}
          {activeTab === 'mission' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Mission Control</h2>
                <p className="text-gray-400 text-sm">Real-time status of your earned entitlements and activation score.</p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Benefits Activation Score</div>
                  <div className="text-5xl font-black text-scarlet">{mission.score}<span className="text-2xl text-gray-500 font-normal">/100</span></div>
                  <div className="space-y-1.5 pt-2">
                    {mission.items.map((it,i)=>(
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                        {it.done ? <CheckCircle size={14} className="text-emerald-400"/> : <div className="w-3.5 h-3.5 rounded-full border border-gray-600"/>}
                        <span>{it.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-950 p-6 rounded-2xl border border-gray-800 text-center sm:min-w-[240px]">
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Estimated Lifetime VA Value</div>
                  <div className="text-3xl font-black text-emerald-400 mt-1">${(annualPay * 40 / 1000000).toFixed(2)}M</div>
                  <div className="text-xs text-gray-400 mt-1">Based on 40-year tax-free compounding at current rating</div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label:'Service Branch', val: bd.badge + ' ' + bd.name },
                  { label:'Discharge Character', val: dischargeType === 'honorable' ? 'Honorable' : dischargeType.toUpperCase() },
                  { label:'Home State', val: `${stateInfo.emoji} ${stateInfo.name}` },
                  { label:'Dependents', val: hasDependents.replace('_',' ') }
                ].map((c,i)=>(
                  <div key={i} className="bg-gray-900 border border-gray-800 p-3.5 rounded-2xl">
                    <div className="text-[11px] text-gray-500 font-bold uppercase">{c.label}</div>
                    <div className="text-xs font-black text-white mt-1">{c.val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 6: STATE BENEFITS MATRIX                                     */}
          {/* ================================================================= */}
          {activeTab === 'benefits' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">State Benefits & Tax Matrix</h2>
                <p className="text-gray-400 text-sm">State-level tax exemptions, property waivers, and free tuition programs.</p>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {Object.entries(STATE_BENEFITS_EXTENDED).map(([key,s])=>(
                  <button key={key} onClick={()=>setSelectedState(key)}
                    className={"p-3 rounded-2xl border text-center transition-all " + (selectedState===key ? "border-scarlet bg-scarlet/10 text-scarlet font-black shadow-md" : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700")}>
                    <div className="text-base font-black">{s.emoji}</div>
                    <div className="text-xs font-bold mt-0.5">{s.name}</div>
                  </button>
                ))}
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <h3 className="text-xl font-black text-white">{stateInfo.emoji} {stateInfo.name} Benefits Portfolio</h3>
                  <span className="px-3 py-1 bg-scarlet/20 text-scarlet border border-scarlet/40 rounded-full text-xs font-black">Grade: {stateInfo.ratingGrade}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 space-y-1">
                    <span className="text-gray-500 font-bold uppercase">Income Tax Policy:</span>
                    <p className="text-white font-medium">{stateInfo.incomeTax}</p>
                  </div>
                  <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 space-y-1">
                    <span className="text-gray-500 font-bold uppercase">Property Tax Exemption:</span>
                    <p className="text-white font-medium">{stateInfo.propTax}</p>
                  </div>
                  <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 space-y-1">
                    <span className="text-gray-500 font-bold uppercase">Higher Education Benefits:</span>
                    <p className="text-white font-medium">{stateInfo.education}</p>
                  </div>
                  <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 space-y-1">
                    <span className="text-gray-500 font-bold uppercase">Vehicle Fee Waivers:</span>
                    <p className="text-white font-medium">{stateInfo.vehicle}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Additional State Perks:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {stateInfo.perks.map((p,i)=>(
                      <div key={i} className="flex items-center gap-2 bg-gray-950 p-2.5 rounded-xl border border-gray-800 text-gray-300">
                        <CheckCircle size={14} className="text-emerald-400 flex-shrink-0"/>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 7: MASTER CHECKLIST & TIMELINE                               */}
          {/* ================================================================= */}
          {activeTab === 'tracker' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Interactive Master Transition Checklist</h2>
                <p className="text-gray-400 text-sm">Check off completed milestones. Your progress is automatically saved in your browser.</p>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-3">
                {[
                  { id:'str_download', stage:'Pre-Separation', label:'Request and download full digital copies of your Service Treatment Records (STR) and dental files' },
                  { id:'sick_call_log', stage:'Pre-Separation', label:'Go to medical/sick call to document every physical and mental symptom before terminal leave' },
                  { id:'cool_cert', stage:'Pre-Separation', label:'Complete free civilian certifications (PMP, Sec+, AWS) via DoD COOL / Marine Corps Credentialing' },
                  { id:'bdd_filed', stage:'BDD Window', label:'File Benefits Delivery at Discharge (BDD) claim at the exact 180-90 day pre-separation mark' },
                  { id:'skillbridge_app', stage:'BDD Window', label:'Secure a DoD SkillBridge / CSP civilian corporate internship for your final 6 months' },
                  { id:'va_account_set', stage:'Transition', label:'Set up Login.gov / ID.me authentication on VA.gov and check claim tracker status' },
                  { id:'va_healthcare', stage:'Transition', label:'Enroll in VA Healthcare at your local VA Medical Center (Form 10-10EZ)' },
                  { id:'buddy_letters', stage:'Claims', label:'Collect Lay / Buddy statements (VA Form 21-4138) from fellow service members' },
                  { id:'va_loan_coe', stage:'Wealth', label:'Download your VA Loan Certificate of Eligibility (COE) on eBenefits / VA.gov' },
                  { id:'roth_ira_opened', stage:'Wealth', label:'Open a Roth IRA and automate $583/mo ($7,000/yr) indexing into VOO/VTI' },
                  { id:'state_tax_exempt', stage:'Wealth', label:'Submit your VA rating letter to your county tax assessor for full property tax exemption' },
                ].map((task)=>(
                  <button key={task.id} onClick={()=>toggleChecklistItem(task.id)}
                    className={"w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all " + (checklist[task.id] ? "border-emerald-500/40 bg-emerald-950/20 text-gray-200" : "border-gray-800 bg-gray-950/70 hover:border-gray-700 text-gray-400")}>
                    <div className={"w-5 h-5 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 " + (checklist[task.id] ? "border-emerald-400 bg-emerald-500 text-black font-black" : "border-gray-700")}>
                      {checklist[task.id] && "✓"}
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-scarlet uppercase tracking-wider mr-2">[{task.stage}]</span>
                      <span className={"text-xs " + (checklist[task.id] ? "line-through text-gray-400" : "text-gray-200 font-medium")}>{task.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 8: DISCHARGE UPGRADE GUIDE                                   */}
          {/* ================================================================= */}
          {activeTab === 'upgrade' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Discharge Upgrade Master Playbook</h2>
                <p className="text-gray-400 text-sm">How to upgrade an OTH or General discharge and unlock full GI Bill & VA compensation.</p>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  {[
                    { title:'Step 1: DRB vs BCMR', desc:'Select the appropriate military review board' },
                    { title:'Step 2: Evidence Dossier', desc:'Collect SMRs, buddy letters, & nexus evaluations' },
                    { title:'Step 3: Kurta Memo', desc:'Apply liberal consideration for PTSD/MST' },
                    { title:'Step 4: Free Legal Aid', desc:'Partner with NVLSP or ABA Pro Bono attorneys' }
                  ].map((s,i)=>(
                    <button key={i} onClick={()=>setUpgradeStep(i)}
                      className={"p-3 rounded-2xl border text-left text-xs transition-all " + (upgradeStep===i ? "border-scarlet bg-scarlet/10 text-white font-bold" : "border-gray-800 text-gray-400 hover:border-gray-700")}>
                      <div className="font-black text-scarlet">{s.title}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{s.desc}</div>
                    </button>
                  ))}
                </div>

                <div className="bg-gray-950 p-5 rounded-2xl border border-gray-800 text-xs text-gray-300 leading-relaxed space-y-2">
                  {upgradeStep === 0 && (
                    <p>If discharged less than 15 years ago, file DD Form 293 with your branch Discharge Review Board (DRB). If greater than 15 years or requesting changes to your reenlistment code, file DD Form 149 with the Board for Correction of Military Records (BCMR / BCNR).</p>
                  )}
                  {upgradeStep === 1 && (
                    <p>Assemble your complete Service Treatment Records, awards, character references, and an independent psychological evaluation showing how in-service stressors directly contributed to the separation circumstances.</p>
                  )}
                  {upgradeStep === 2 && (
                    <p>Under the Hagel, Kurta, and Carson Memoranda, military review boards MUST apply liberal consideration to discharge upgrade requests involving PTSD, TBI, or Military Sexual Trauma (MST).</p>
                  )}
                  {upgradeStep === 3 && (
                    <p>Never pay thousands to predatory upgrade consultants. The National Veterans Legal Services Program (NVLSP.org) and the American Bar Association Military Pro Bono Project provide FREE legal representation for qualifying veterans.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 9: RESOURCES & HOTLINES                                      */}
          {/* ================================================================= */}
          {activeTab === 'resources' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Direct Resources & Official Portals</h2>
                <p className="text-gray-400 text-sm">Free accredited representation, official VA links, and crisis assistance.</p>
              </div>

              <div className="bg-red-950/40 border border-red-600/50 rounded-3xl p-6">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Phone size={20} className="text-red-400"/>
                  24/7 Veterans Crisis Line
                </h3>
                <div className="text-3xl font-black text-white my-1">Dial 988, Press 1</div>
                <p className="text-xs text-red-200">Text: 838255 • Chat: VeteransCrisisLine.net • Free, confidential, always available.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { name:'DAV (Disabled American Veterans)', desc:'Free accredited VSO claims representation', url:'https://www.dav.org' },
                  { name:'VFW (Veterans of Foreign Wars)', desc:'Free national claims advocacy & benefits filing', url:'https://www.vfw.org' },
                  { name:'American Legion', desc:'Accredited service officers in every state', url:'https://www.legion.org' },
                  { name:'VA.gov Claims Tracker', desc:'Official federal disability status dashboard', url:'https://www.va.gov/claim-or-appeal-status/' },
                  { name:'eBenefits & COE Portal', desc:'Download VA Loan Certificate of Eligibility', url:'https://www.ebenefits.va.gov' },
                  { name:'NVLSP Free Legal Help', desc:'Free legal aid for denied claims & upgrades', url:'https://www.nvlsp.org' },
                ].map((r,i)=>(
                  <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                    className="bg-gray-900 border border-gray-800 hover:border-scarlet/50 p-4 rounded-2xl transition-all group block">
                    <div className="text-sm font-bold text-white group-hover:text-scarlet transition-colors flex items-center justify-between">
                      <span>{r.name}</span>
                      <ExternalLink size={13} className="text-gray-500 group-hover:text-scarlet"/>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{r.desc}</div>
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Persistent Bottom Bar */}
      <div className="bg-gray-900 border-t border-gray-800 px-4 py-2 flex items-center justify-between text-xs text-gray-500">
        <div>Veteran Benefits Compass • Built by veterans, for veterans.</div>
        <div className="flex items-center gap-2">
          <span title="Made with crayons">{String.fromCodePoint(0x1F58D)} Marines first</span>
        </div>
      </div>
    </div>
  );
};

export default VeteranBenefitsCompass;
