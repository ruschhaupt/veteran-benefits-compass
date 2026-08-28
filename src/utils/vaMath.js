// -----------------------------------------------------------------------
// VA COMBINED RATING MATHEMATICS ENGINE (38 CFR § 4.25)
// -----------------------------------------------------------------------

/**
 * Calculates the combined VA disability rating per 38 CFR § 4.25 (Non-additive whole-person efficiency).
 * 
 * @param {Array<number>} ratingsArray - Array of individual disability percentages (e.g. [70, 50, 20, 10])
 * @param {boolean} isBilateral - Whether the bilateral factor (+10% of combined bilateral rating) applies
 * @returns {Object} Full breakdown including rawTotal, roundedRating, pointsTo100, is100, and step-by-step math.
 */
export const calcVaMath = (ratingsArray = [], isBilateral = false) => {
  if (!ratingsArray || ratingsArray.length === 0) {
    return {
      sorted: [],
      rawTotal: '0.0',
      roundedRating: 0,
      pointsTo100: '95.0',
      is100: false,
      steps: []
    };
  }

  // Filter valid numbers and sort descending
  const sorted = [...ratingsArray]
    .map(r => Number(r))
    .filter(r => !isNaN(r) && r > 0)
    .sort((a, b) => b - a);

  if (sorted.length === 0) {
    return {
      sorted: [],
      rawTotal: '0.0',
      roundedRating: 0,
      pointsTo100: '95.0',
      is100: false,
      steps: []
    };
  }

  let remainingEfficiency = 1.0;
  let totalDisabled = 0.0;
  const steps = [];

  sorted.forEach((r) => {
    const disabledFromRemaining = remainingEfficiency * (r / 100);
    totalDisabled += disabledFromRemaining;
    remainingEfficiency -= disabledFromRemaining;
    steps.push({
      conditionRating: r,
      addedValue: (disabledFromRemaining * 100).toFixed(1),
      runningTotal: (totalDisabled * 100).toFixed(1),
      runningEfficiency: (remainingEfficiency * 100).toFixed(1)
    });
  });

  let rawTotal = totalDisabled * 100;
  if (isBilateral) {
    // 38 CFR § 4.26: 10% bilateral bonus added to combined bilateral rating before overall combination
    rawTotal = Math.min(100, rawTotal * 1.10);
  }

  // VA standard rounding: 95.0% and above rounds to 100%. Otherwise standard nearest 10%.
  const roundedRating = rawTotal >= 94.5 ? 100 : Math.min(100, Math.round(rawTotal / 10) * 10);
  const pointsTo100 = Math.max(0, 94.5 - rawTotal);

  return {
    sorted,
    rawTotal: rawTotal.toFixed(1),
    roundedRating,
    pointsTo100: pointsTo100.toFixed(1),
    is100: roundedRating === 100,
    steps
  };
};

/**
 * Calculates next most impactful rating needed to reach the next 10% cliff.
 */
export const calcNextRatingNeeded = (currentRatings = []) => {
  const current = calcVaMath(currentRatings);
  if (current.is100) return null;

  const targetRounded = current.roundedRating + 10;
  const possibleNextRatings = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  for (const testRating of possibleNextRatings) {
    const projected = calcVaMath([...currentRatings, testRating]);
    if (projected.roundedRating >= targetRounded) {
      return {
        ratingNeeded: testRating,
        projectedRaw: projected.rawTotal,
        projectedRounded: projected.roundedRating
      };
    }
  }

  return { ratingNeeded: 100, projectedRaw: '100.0', projectedRounded: 100 };
};
