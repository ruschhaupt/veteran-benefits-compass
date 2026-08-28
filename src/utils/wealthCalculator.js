// -----------------------------------------------------------------------
// VETERAN WEALTH & FINANCIAL SUMMARY ENGINE
// -----------------------------------------------------------------------
import { getVaMonthlyComp } from '../data/vaPayTable';
import { ALL_DYNAMIC_STEPS } from '../data/dynamicSteps';
import { SPECIAL_PERKS } from '../data/specialPerks';

/**
 * Calculates comprehensive annual cash flow, tax shields, and lifetime wealth unlocked.
 */
export const calculateVeteranWealth = ({
  currentRating = 70,
  hasDependents = 'single',
  selectedState = 'tx',
  completedBenefits = {},
  homePrice = 450000
}) => {
  const monthlyComp = getVaMonthlyComp(currentRating, hasDependents);
  const annualComp = monthlyComp * 12;

  // Maximum schedular compensation (100% P&T)
  const maxMonthlyComp = getVaMonthlyComp(100, hasDependents);
  const unclaimedMonthlyGap = Math.max(0, maxMonthlyComp - monthlyComp);
  const unclaimedAnnualGap = unclaimedMonthlyGap * 12;

  // State Tax Shield calculation
  let statePropertyTaxSaved = 0;
  if (currentRating >= 100 && (selectedState === 'tx' || selectedState === 'fl' || selectedState === 'nv' || selectedState === 'oh' || selectedState === 'al' || selectedState === 'il' || selectedState === 'wa')) {
    // Average 1.8% to 2.3% property tax rate on primary home
    statePropertyTaxSaved = Math.round(homePrice * 0.02);
  }

  // Healthcare Savings (CHAMPVA at 100% P&T with dependents)
  let champvaSavings = 0;
  if (currentRating >= 100 && hasDependents !== 'single') {
    champvaSavings = 14400; // $1,200/mo avg family health premium
  }

  // Dental Savings (Priority 1 at 100%)
  let dentalSavings = currentRating >= 100 ? 3500 : 0;

  // Additional completed perks calculation
  let additionalCash = 0;
  let additionalSavings = 0;
  let upfrontGrants = 0;

  ALL_DYNAMIC_STEPS.forEach(step => {
    if (completedBenefits[step.id]) {
      if (step.isCash && step.id !== 'initial_disability_claim' && step.id !== 'tdiu_70_plus') {
        additionalCash += (step.annualValue || 0);
      } else {
        additionalSavings += (step.annualValue || 0);
      }
      upfrontGrants += (step.upfrontValue || 0);
    }
  });

  SPECIAL_PERKS.forEach(perk => {
    if (completedBenefits[perk.id]) {
      if (perk.isCash) {
        additionalCash += (perk.annualValue || 0);
      } else {
        additionalSavings += (perk.annualValue || 0);
      }
      upfrontGrants += (perk.upfrontValue || 0);
    }
  });

  const totalAnnualCash = annualComp + additionalCash;
  const totalAnnualTaxAndHealthShield = statePropertyTaxSaved + champvaSavings + dentalSavings + additionalSavings;
  const totalAnnualValueUnlocked = totalAnnualCash + totalAnnualTaxAndHealthShield;

  const tenYearImpact = (totalAnnualValueUnlocked * 10) + upfrontGrants;
  const twentyYearImpact = (totalAnnualValueUnlocked * 20) + upfrontGrants;

  return {
    monthlyComp,
    annualComp,
    maxMonthlyComp,
    unclaimedMonthlyGap,
    unclaimedAnnualGap,
    statePropertyTaxSaved,
    champvaSavings,
    dentalSavings,
    totalAnnualCash,
    totalAnnualTaxAndHealthShield,
    totalAnnualValueUnlocked,
    upfrontGrants,
    tenYearImpact,
    twentyYearImpact
  };
};
