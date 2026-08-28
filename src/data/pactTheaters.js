// -----------------------------------------------------------------------
// PACT ACT & TOXIC EXPOSURE THEATER DATABASE
// -----------------------------------------------------------------------
export const PACT_ACT_THEATERS = [
  {
    id: 'burn_pits',
    name: 'Post-9/11 & Gulf War (Burn Pits & Airborne Toxins)',
    era: '1990 - Present (Gulf War, OIF, OEF, OIR, OND)',
    locations: 'Iraq, Afghanistan, Kuwait, Saudi Arabia, UAE, Qatar, Bahrain, Oman, Gulf of Aden, Gulf of Oman, Persian Gulf, Red Sea, Arabian Sea, Uzbekistan, Syria, Jordan, Egypt, Lebanon, Yemen, Djibouti, Somalia',
    statute: '38 U.S.C. § 1120 (PACT Act Section 406)',
    rules: 'If you served in any of these qualifying locations during the specified dates, the VA legally MUST presume your condition is service-connected. You do NOT need a nexus letter or in-service injury record -- only proof of deployment (DD-214) and a current diagnosis.',
    conditions: [
      { name: 'Asthma (diagnosed after separation)', dc: '6602', maxRating: '100%', commonRating: '10-30%', dbq: 'Respiratory Conditions DBQ', evidence: 'PFT (Pulmonary Function Test) or daily inhaler prescription.' },
      { name: 'Chronic Bronchitis', dc: '6600', maxRating: '100%', commonRating: '10-30%', dbq: 'Respiratory Conditions DBQ', evidence: 'Medical records demonstrating persistent chronic productive cough.' },
      { name: 'Chronic Rhinitis', dc: '6522', maxRating: '30%', commonRating: '10-30%', dbq: 'Sinusitis & Rhinitis DBQ', evidence: 'Doctor note confirming 50%+ nasal obstruction or polyps.' },
      { name: 'Chronic Sinusitis', dc: '6510-6514', maxRating: '50%', commonRating: '10-30%', dbq: 'Sinusitis & Rhinitis DBQ', evidence: 'CT scan or doctor records showing 3+ non-incapacitating episodes per year.' },
      { name: 'Constrictive Bronchiolitis', dc: '6600', maxRating: '100%', commonRating: '30-100%', dbq: 'Respiratory Conditions DBQ', evidence: 'HRCT scan or biopsy confirming small airway scarring.' },
      { name: 'COPD (Chronic Obstructive Pulmonary Disease)', dc: '6604', maxRating: '100%', commonRating: '30-60%', dbq: 'Respiratory Conditions DBQ', evidence: 'PFT FEV-1/FVC ratios confirming airway obstruction.' },
      { name: 'Glioblastoma & Brain Cancers', dc: '8002', maxRating: '100%', commonRating: '100%', dbq: 'Central Nervous System DBQ', evidence: 'Pathology/oncology report confirming diagnosis (Automatic 100% while active).' },
      { name: 'Gastrointestinal Cancers (Colon, Stomach, Pancreas, Esophagus)', dc: '7343', maxRating: '100%', commonRating: '100%', dbq: 'Digestive Cancers DBQ', evidence: 'Biopsy or oncology pathology report.' },
      { name: 'Respiratory / Lung Cancers', dc: '6819', maxRating: '100%', commonRating: '100%', dbq: 'Respiratory Cancers DBQ', evidence: 'Oncology records confirming primary respiratory malignancy.' },
      { name: 'Head / Neck / Pharyngeal Cancers', dc: '6819', maxRating: '100%', commonRating: '100%', dbq: 'Ear, Nose & Throat DBQ', evidence: 'Biopsy confirming malignancy of oral cavity, pharynx, or larynx.' },
      { name: 'Kidney / Renal Cancer', dc: '7528', maxRating: '100%', commonRating: '100%', dbq: 'Genitourinary DBQ', evidence: 'Renal biopsy or surgical oncology report.' },
      { name: 'Lymphoma (Hodgkin & Non-Hodgkin)', dc: '7709', maxRating: '100%', commonRating: '100%', dbq: 'Hemic and Lymphatic DBQ', evidence: 'Lymph node biopsy and hematology records.' },
      { name: 'Melanoma', dc: '7826', maxRating: '100%', commonRating: '100%', dbq: 'Skin Conditions DBQ', evidence: 'Dermatopathology report verifying malignant melanoma.' },
      { name: 'Pulmonary Fibrosis', dc: '6825', maxRating: '100%', commonRating: '30-100%', dbq: 'Respiratory Conditions DBQ', evidence: 'High-resolution CT or PFT showing diffusion capacity impairment.' },
      { name: 'Hypertension (High Blood Pressure)', dc: '7101', maxRating: '60%', commonRating: '10-20%', dbq: 'Hypertension DBQ', evidence: 'Readings confirming diastolic BP 100+ or systolic BP 160+.' },
      { name: 'Monoclonal Gammopathy of Undetermined Significance (MGUS)', dc: '7712', maxRating: '100%', commonRating: '0-100%', dbq: 'Hemic DBQ', evidence: 'Serum protein electrophoresis confirming M-protein spike.' }
    ]
  },
  {
    id: 'camp_lejeune',
    name: 'Camp Lejeune & MCAS New River Toxic Water',
    era: 'August 1, 1953 - December 31, 1987',
    locations: 'Marine Corps Base Camp Lejeune or Marine Corps Air Station (MCAS) New River, North Carolina',
    statute: '38 CFR § 3.307(a)(7) & PACT Act Section 804',
    rules: 'Veterans who served at Camp Lejeune or MCAS New River for at least 30 cumulative days (consecutive or non-consecutive) between 1953 and 1987 qualify for presumptive service connection and free VA healthcare for qualifying conditions.',
    conditions: [
      { name: 'Adult Leukemia', dc: '7703', maxRating: '100%', commonRating: '100%', dbq: 'Hematologic Cancers DBQ', evidence: 'Bone marrow aspirate or peripheral blood smear confirming leukemia.' },
      { name: 'Aplastic Anemia & Myelodysplastic Syndromes', dc: '7716', maxRating: '100%', commonRating: '30-100%', dbq: 'Hemic DBQ', evidence: 'Complete blood count and bone marrow biopsy confirming marrow failure.' },
      { name: 'Bladder Cancer', dc: '7528', maxRating: '100%', commonRating: '100%', dbq: 'Genitourinary Cancers DBQ', evidence: 'Cystoscopy and tissue pathology confirming urothelial carcinoma.' },
      { name: 'Kidney Cancer', dc: '7528', maxRating: '100%', commonRating: '100%', dbq: 'Genitourinary Cancers DBQ', evidence: 'Renal imaging and biopsy confirming renal cell carcinoma.' },
      { name: 'Liver Cancer', dc: '7343', maxRating: '100%', commonRating: '100%', dbq: 'Digestive Cancers DBQ', evidence: 'Histopathology verifying hepatocellular carcinoma.' },
      { name: 'Multiple Myeloma', dc: '7709', maxRating: '100%', commonRating: '100%', dbq: 'Hemic Cancers DBQ', evidence: 'Serum/urine protein electrophoresis and bone marrow biopsy.' },
      { name: 'Non-Hodgkin Lymphoma', dc: '7715', maxRating: '100%', commonRating: '100%', dbq: 'Lymphoma DBQ', evidence: 'Excisional lymph node biopsy confirming NHL.' },
      { name: 'Parkinson’s Disease', dc: '8105', maxRating: '100%', commonRating: '30-100%', dbq: 'Parkinson’s DBQ', evidence: 'Neurology evaluation confirming resting tremor, rigidity, or bradykinesia.' }
    ]
  },
  {
    id: 'agent_orange',
    name: 'Vietnam Era / Agent Orange & Tactical Herbicides',
    era: '1962 - 1975',
    locations: 'Republic of Vietnam (inland & territorial waters 12 nautical miles), Thailand military base perimeters, Korean DMZ (1967-1971), Guam/Johnston Atoll/American Samoa, C-123 aircraft flight crews',
    statute: '38 U.S.C. § 1116 & PACT Act Section 403',
    rules: 'Veterans with verified boots on the ground, Blue Water Navy service, or qualified herbicide storage locations receive automatic presumptive service connection without needing to prove chemical exposure.',
    conditions: [
      { name: 'Type 2 Diabetes Mellitus', dc: '7913', maxRating: '100%', commonRating: '20-40%', dbq: 'Endocrine DBQ', evidence: 'Lab fasting glucose or A1c > 6.5% + daily medication or insulin.' },
      { name: 'Hypertension (High Blood Pressure)', dc: '7101', maxRating: '60%', commonRating: '10-20%', dbq: 'Cardiovascular DBQ', evidence: 'Medical chart readings of diastolic BP 100+ or systolic BP 160+.' },
      { name: 'Monoclonal Gammopathy (MGUS)', dc: '7712', maxRating: '100%', commonRating: '0-100%', dbq: 'Hemic DBQ', evidence: 'Blood test showing monoclonal protein in serum.' },
      { name: 'Ischemic Heart Disease / Coronary Artery Disease', dc: '7005', maxRating: '100%', commonRating: '30-60%', dbq: 'Cardiovascular DBQ', evidence: 'METs exercise stress test or ejection fraction under 50%.' },
      { name: 'Parkinsonism & Parkinson’s Disease', dc: '8105', maxRating: '100%', commonRating: '30-100%', dbq: 'Neurological DBQ', evidence: 'Neurologist diagnosis with motor symptom tracking.' },
      { name: 'Prostate Cancer', dc: '7528', maxRating: '100%', commonRating: '100%', dbq: 'Genitourinary Cancers DBQ', evidence: 'Prostate biopsy report confirming adenocarcinoma.' },
      { name: 'Peripheral Neuropathy (Early-Onset)', dc: '8520', maxRating: '40% per limb', commonRating: '10-20%', dbq: 'Peripheral Nerves DBQ', evidence: 'EMG/NCS nerve conduction study or sensory exam notes.' },
      { name: 'Respiratory Cancers (Lung, Bronchus, Larynx, Trachea)', dc: '6819', maxRating: '100%', commonRating: '100%', dbq: 'Respiratory Cancers DBQ', evidence: 'Pathology confirming respiratory malignancy.' }
    ]
  },
  {
    id: 'radiation',
    name: 'Radiation & Nuclear Cleanup Exposure',
    era: 'WWII to 1990s',
    locations: 'Enewetak Atoll (1977-1980), Palomares B-52 crash (1966), Thule Greenland B-52 crash (1968), Amchitka Island Alaska, Hiroshima/Nagasaki occupation, Atmospheric nuclear test sites',
    statute: '38 CFR § 3.309(d) & PACT Act Section 401',
    rules: 'Veterans who participated in nuclear testing, cleanups, or decontamination operations are entitled to presumptive disability compensation for radiogenic cancers and diseases.',
    conditions: [
      { name: 'Leukemia (any except chronic lymphocytic)', dc: '7703', maxRating: '100%', commonRating: '100%', dbq: 'Hematologic DBQ', evidence: 'Bone marrow aspirate pathology report.' },
      { name: 'Thyroid Cancer & Nodular Thyroid Disease', dc: '7903', maxRating: '100%', commonRating: '30-100%', dbq: 'Endocrine DBQ', evidence: 'Ultrasound and fine needle aspiration biopsy.' },
      { name: 'Breast Cancer', dc: '7627', maxRating: '100%', commonRating: '100%', dbq: 'Breast Conditions DBQ', evidence: 'Mammography and tissue biopsy report.' },
      { name: 'Bone Cancer (Osteosarcoma)', dc: '5012', maxRating: '100%', commonRating: '100%', dbq: 'Bone and Joint DBQ', evidence: 'Skeletal imaging and surgical biopsy.' },
      { name: 'Cancers of the Bile Ducts, Gallbladder, & Pancreas', dc: '7343', maxRating: '100%', commonRating: '100%', dbq: 'Digestive Cancers DBQ', evidence: 'Abdominal CT/MRI and pathology report.' }
    ]
  }
];
