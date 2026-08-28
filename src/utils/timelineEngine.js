// -----------------------------------------------------------------------
// "YOUR LIFE IN MONTHS" STATUTORY TIMELINE ENGINE
// -----------------------------------------------------------------------

/**
 * Parses a date or defaults safely.
 */
const safeDate = (dateString, fallback = new Date()) => {
  try {
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? fallback : d;
  } catch (e) {
    return fallback;
  }
};

/**
 * Computes all statutory deadlines, countdowns, and mission clocks based on 5 inputs:
 * 1. Enlistment Date
 * 2. Separation Date (ETS/EAS)
 * 3. Branch of Service
 * 4. Current Disability Rating (0-100%)
 * 5. State of Residence
 */
export const calculateMissionTimeline = ({
  enlistmentDate = '2016-08-01',
  separationDate = '2024-08-01',
  branch = 'usmc',
  currentRating = 70,
  selectedState = 'tx',
  hasDependents = 'single',
  today = new Date()
}) => {
  const sep = safeDate(separationDate);
  const now = safeDate(today);

  // Time metrics
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSinceSeparation = Math.floor((now - sep) / msPerDay);
  const daysUntilSeparation = Math.floor((sep - now) / msPerDay);
  const isSeparated = daysSinceSeparation >= 0;

  // 1. BDD Window (180 to 90 days pre-separation)
  let bddStatus = 'closed';
  let bddDaysLeft = 0;
  if (!isSeparated) {
    if (daysUntilSeparation >= 90 && daysUntilSeparation <= 180) {
      bddStatus = 'open_now';
      bddDaysLeft = daysUntilSeparation - 90;
    } else if (daysUntilSeparation > 180) {
      bddStatus = 'upcoming';
      bddDaysLeft = daysUntilSeparation - 180;
    } else {
      bddStatus = 'missed'; // under 90 days: standard claims queue
    }
  } else {
    bddStatus = 'completed';
  }

  // 2. Class II(b) VA Dental 180-Day Free Window
  let dentalDaysLeft = Math.max(0, 180 - daysSinceSeparation);
  let dentalStatus = isSeparated ? (dentalDaysLeft > 0 ? 'active' : 'expired') : 'upcoming';

  // 3. VGLI 240-Day Exam-Free Guaranteed Issue Window
  let vgliDaysLeft = Math.max(0, 240 - daysSinceSeparation);
  let vgliStatus = isSeparated ? (vgliDaysLeft > 0 ? 'active' : 'expired') : 'upcoming';

  // 4. GI Bill Expiration Matrix
  // If separated on/after Jan 1, 2013: Forever GI Bill (no expiration).
  // If separated before Jan 1, 2013: 15-year statutory clock.
  const foreverGiBillThreshold = new Date('2013-01-01');
  const isForeverGiBill = sep >= foreverGiBillThreshold;
  let giBillYearsLeft = null;
  if (!isForeverGiBill && isSeparated) {
    const expirationDate = new Date(sep);
    expirationDate.setFullYear(expirationDate.getFullYear() + 15);
    const daysLeft = Math.floor((expirationDate - now) / msPerDay);
    giBillYearsLeft = (daysLeft / 365.25).toFixed(1);
  }

  // 5. Rating Cliff & Income Opportunity Gap
  // Calculate gap to next 10% rating tier and 100% P&T tier
  const rating = Number(currentRating) || 0;
  let monthlyCompEstimate = 0;
  let monthlyCompAt100 = 3737;

  if (rating === 0) monthlyCompEstimate = 0;
  else if (rating === 10) monthlyCompEstimate = 175;
  else if (rating === 20) monthlyCompEstimate = 346;
  else if (rating === 30) monthlyCompEstimate = 537;
  else if (rating === 40) monthlyCompEstimate = 774;
  else if (rating === 50) monthlyCompEstimate = 1102;
  else if (rating === 60) monthlyCompEstimate = 1395;
  else if (rating === 70) monthlyCompEstimate = 1759;
  else if (rating === 80) monthlyCompEstimate = 2044;
  else if (rating === 90) monthlyCompEstimate = 2297;
  else if (rating >= 100) monthlyCompEstimate = 3737;

  const monthlyGapTo100 = Math.max(0, monthlyCompAt100 - monthlyCompEstimate);
  const annualGapTo100 = monthlyGapTo100 * 12;

  // 6. Ranked Tactical Next Actions
  const urgencyActionList = [];

  // BDD urgent action
  if (bddStatus === 'open_now') {
    urgencyActionList.push({
      tier: 'red',
      urgencyLabel: '🔴 CRITICAL ACTION: File BDD Claim',
      headline: `BDD Window Open Now (${bddDaysLeft} Days Remaining)`,
      summary: 'File your Form 21-526EZ before the 90-day pre-separation cutoff to ensure Day-1 tax-free compensation upon exit.',
      actionTab: 'claims',
      impact: `+$1,759 - $3,737/mo guaranteed Day 1`
    });
  }

  // Dental urgent action
  if (dentalStatus === 'active' && currentRating < 100) {
    urgencyActionList.push({
      tier: dentalDaysLeft < 60 ? 'red' : 'yellow',
      urgencyLabel: `${dentalDaysLeft < 60 ? '🔴' : '🟡'} TIME-SENSITIVE: VA 100% Free Dental`,
      headline: `Free Comprehensive Dental Window (${dentalDaysLeft} Days Left)`,
      summary: 'All separated veterans qualify for a 1-time 100% free dental restoration within 180 days of discharge.',
      actionTab: 'perks',
      impact: '$2,500 - $8,000 Free Treatment'
    });
  }

  // VGLI life insurance action
  if (vgliStatus === 'active') {
    urgencyActionList.push({
      tier: 'yellow',
      urgencyLabel: '🟡 EXAM-FREE LIFE INSURANCE',
      headline: `VGLI Guaranteed Issue (${vgliDaysLeft} Days Left)`,
      summary: 'Convert military SGLI up to $500k with zero medical exams, no physicals, and guaranteed issue regardless of disability ratings.',
      actionTab: 'planner',
      impact: '$500,000 Guaranteed Life Coverage'
    });
  }

  // 100% P&T state property tax shield
  if (currentRating >= 100) {
    urgencyActionList.push({
      tier: 'green',
      urgencyLabel: '🟢 SECURED: State Property Tax Exemption',
      headline: `File VA Rating Letter With County Assessor (${selectedState.toUpperCase()})`,
      summary: 'Take your VA Commissary / Rating Letter to your local tax appraisal district to eliminate 100% of property taxes on your primary residence.',
      actionTab: 'househack',
      impact: '$5,000 - $14,000/yr Saved for Life'
    });
  } else if (currentRating >= 70) {
    urgencyActionList.push({
      tier: 'yellow',
      urgencyLabel: '🟡 RATING CLIMB: TDIU / Secondary Claims',
      headline: `Claim Secondary Conditions (Close the $${monthlyGapTo100}/mo Gap)`,
      summary: `You are currently leaving $${monthlyGapTo100.toLocaleString()}/mo ($${annualGapTo100.toLocaleString()}/yr) in unclaimed compensation. File secondary conditions or TDIU.`,
      actionTab: 'vamath',
      impact: `+$${monthlyGapTo100.toLocaleString()}/mo for Life`
    });
  }

  return {
    isSeparated,
    daysSinceSeparation,
    daysUntilSeparation,
    bddStatus,
    bddDaysLeft,
    dentalStatus,
    dentalDaysLeft,
    vgliStatus,
    vgliDaysLeft,
    isForeverGiBill,
    giBillYearsLeft,
    monthlyCompEstimate,
    monthlyGapTo100,
    annualGapTo100,
    urgencyActionList
  };
};
