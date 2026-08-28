// -----------------------------------------------------------------------
// HIGH-VALUE SPECIAL PERKS DATA
// -----------------------------------------------------------------------
export const SPECIAL_PERKS = [
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
