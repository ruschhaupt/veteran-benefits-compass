// -----------------------------------------------------------------------
// HIGH-YIELD SECONDARY CLAIMS ARSENAL DATABASE
// -----------------------------------------------------------------------
export const SECONDARY_CLAIMS_DATA = [
  {
    primary: 'PTSD / Mental Health (30-100%)',
    icon: '🧠',
    secondaries: [
      { condition: 'Obstructive Sleep Apnea (with CPAP)', potential: '50%', mechanism: 'Chronic hyperarousal and stress hormones cause airway collapse; PTSD medications (SSRIs/antipsychotics) cause weight gain resulting in OSA.' },
      { condition: 'GERD / Acid Reflux / IBS', potential: '10-30%', mechanism: 'Vagus nerve disruption from chronic fight-or-flight stress causes excessive stomach acid secretion and gastrointestinal motility dysfunction.' },
      { condition: 'Hypertension (High Blood Pressure)', potential: '10-20%', mechanism: 'Sustained sympathetic nervous system activation and elevated cortisol chronically constrict vascular walls.' },
      { condition: 'Bruxism / TMJ (Teeth Grinding)', potential: '10-30%', mechanism: 'Unconscious jaw clenching and nocturnal grinding triggered by PTSD nightmares and hypervigilance.' }
    ]
  },
  {
    primary: 'Tinnitus (10% Flat Rate)',
    icon: '👂',
    secondaries: [
      { condition: 'Migraine / Chronic Headaches', potential: '30-50%', mechanism: 'Continuous high-frequency acoustic nerve irritation triggers trigeminal nerve sensitization and prostrating headache episodes.' },
      { condition: 'Somatic Symptom Disorder / Anxiety / Depression', potential: '30-70%', mechanism: 'Inability to experience silence creates chronic sleep deprivation, cognitive fatigue, and severe mood deterioration.' },
      { condition: 'Sleep Disturbance / Insomnia', potential: '10-30%', mechanism: 'Acoustic masking failure at night prevents progression into deep REM sleep cycles.' }
    ]
  },
  {
    primary: 'Lumbar / Cervical Spine Strain (10-40%)',
    icon: '🦴',
    secondaries: [
      { condition: 'Radiculopathy (Sciatica / Femoral Nerve) - Bilateral', potential: '10-40% per limb', mechanism: 'Compressed nerve roots at L4-S1 or C5-C7 cause radiating pain, numbness, and tingling into legs/arms. Bilateral factor applies!' },
      { condition: 'Bilateral Knee / Hip Degeneration (Altered Gait)', potential: '10-30% per joint', mechanism: 'Antalgic limping to protect painful spine causes asymmetric biomechanical loading on knees and hips.' },
      { condition: 'Erectile Dysfunction (SMC-K)', potential: '$140/mo (SMC-K)', mechanism: 'Sacral nerve root compression or spinal analgesic medications impair vascular and neurological erectile response.' }
    ]
  },
  {
    primary: 'Chronic Pain & Musculoskeletal Conditions',
    icon: '💊',
    secondaries: [
      { condition: 'GERD & Peptic Ulcer Disease (from NSAID use)', potential: '10-30%', mechanism: 'Years of prescribed high-dose Ibuprofen/Meloxicam/Naproxen erode gastric mucosal lining.' },
      { condition: 'Major Depressive Disorder Secondary to Pain', potential: '30-70%', mechanism: 'Chronic unremitting pain destroys functional capacity, vocational outlook, and emotional regulation.' }
    ]
  }
];
