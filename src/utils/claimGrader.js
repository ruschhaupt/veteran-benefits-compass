// -----------------------------------------------------------------------
// CLAIM STRENGTH GRADER ENGINE (A+ to D Rubric)
// -----------------------------------------------------------------------
import { MED_DB } from '../data/medDb';

/**
 * Evaluates a veteran's described condition against the Diagnostic Code database
 * and calculates a Claim Strength Grade (A+ to D) based on available evidence.
 * 
 * @param {string} userConditionText - Plain English condition text (e.g. "ringing in ears", "bad knee")
 * @param {Object} evidenceTier - Checklist of evidence: { hasSTR, hasPrivateDiagnosis, hasNexus, hasBuddyStatement, isPactPresumptive }
 * @returns {Object} Graded claim result with matched DC code, letter grade, advice, and DBQ prep info.
 */
export const gradeClaimStrength = (
  userConditionText = '',
  evidenceTier = {
    hasSTR: false,
    hasPrivateDiagnosis: false,
    hasNexus: false,
    hasBuddyStatement: false,
    isPactPresumptive: false
  }
) => {
  if (!userConditionText.trim()) {
    return null;
  }

  const query = userConditionText.toLowerCase().trim();
  let matched = null;

  // Search in MED_DB
  for (const entry of MED_DB) {
    const hit = entry.keywords.find(kw => query.includes(kw) || kw.includes(query));
    if (hit) {
      matched = entry;
      break;
    }
  }

  // Fallback generic condition if no exact match in DB
  const conditionName = matched ? matched.condition : userConditionText;
  const dcCode = matched ? matched.dc : 'Review with VSO';
  const ratingRange = matched ? matched.ratingRange : '10-50%';
  const secondaryPotential = matched ? matched.secondary : ['Depression', 'Sleep Disturbance'];
  const clinicalNote = matched ? matched.note : 'Ensure you describe your worst flare-up days during your C&P exam.';

  // Determine Grade based on evidence rubric
  let grade = 'D';
  let scorePercent = 35;
  let statusTag = 'High Denial Risk';
  let statusColor = 'text-red-400 border-red-500/40 bg-red-950/40';
  let recommendations = [];

  const { hasSTR, hasPrivateDiagnosis, hasNexus, hasBuddyStatement, isPactPresumptive } = evidenceTier;

  if (hasSTR && hasPrivateDiagnosis && (hasNexus || isPactPresumptive)) {
    grade = 'A+';
    scorePercent = 98;
    statusTag = 'Rock Solid Claim (Near 100% Approval Expected)';
    statusColor = 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
    recommendations = [
      'Your claim meets all 3 Caluza elements: in-service event, current diagnosis, and medical nexus.',
      'Prepare for the C&P Exam by focusing on functional limitations and range of motion at first onset of pain.',
      'File VA Form 21-526EZ immediately.'
    ];
  } else if ((hasSTR || isPactPresumptive) && hasPrivateDiagnosis) {
    grade = 'A';
    scorePercent = 88;
    statusTag = 'Strong Claim (High Approval Probability)';
    statusColor = 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
    recommendations = [
      'You have the in-service event and current diagnosis.',
      'If you do not have an explicit nexus letter, the VA C&P examiner will be asked for a nexus opinion. Provide detailed medical history during the exam.',
      'Consider requesting a brief Nexus Letter from your private physician stating "at least as likely as not" connected.'
    ];
  } else if (hasPrivateDiagnosis && hasBuddyStatement) {
    grade = 'B';
    scorePercent = 75;
    statusTag = 'Viable Claim (Needs Strong C&P Exam or Nexus)';
    statusColor = 'text-yellow-400 border-yellow-500/40 bg-yellow-950/40';
    recommendations = [
      'You lack in-service STR documentation, but your buddy statement establishes in-service onset.',
      'Submit VA Form 21-4138 (Statement in Support of Claim) with chronological symptom history.',
      'Obtain an Independent Medical Opinion (IMO) / Nexus letter before filing to avoid initial denial.'
    ];
  } else if (hasPrivateDiagnosis) {
    grade = 'C';
    scorePercent = 55;
    statusTag = 'Vulnerable Claim (Missing In-Service Nexus)';
    statusColor = 'text-orange-400 border-orange-500/40 bg-orange-950/40';
    recommendations = [
      'You have a current diagnosis, but the VA will likely deny for lack of service connection unless you prove in-service occurrence.',
      'Gather Buddy Statements (VA Form 21-10210) from fellow service members who witnessed your injury or symptoms.',
      'Check if this condition is secondary to an already service-connected condition.'
    ];
  } else {
    grade = 'D';
    scorePercent = 30;
    statusTag = 'High Denial Risk (Symptoms Only / No Medical Diagnosis)';
    statusColor = 'text-red-400 border-red-500/40 bg-red-950/40';
    recommendations = [
      'Do NOT submit Form 21-526EZ yet! The VA denies claims without a current diagnosed medical condition.',
      'Step 1: Schedule an appointment with your private doctor or VA primary care to get an official diagnosis.',
      'Step 2: Start a symptom and treatment log.',
      'Step 3: Submit an Intent to File (ITF) to freeze your backpay effective date while you get diagnosed.'
    ];
  }

  return {
    conditionName,
    dcCode,
    ratingRange,
    grade,
    scorePercent,
    statusTag,
    statusColor,
    secondaryPotential,
    clinicalNote,
    recommendations,
    evidenceTier
  };
};
