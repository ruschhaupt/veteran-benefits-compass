import React, { useState } from 'react';
import { Award, DollarSign } from 'lucide-react';
import { getVaMonthlyComp } from '../../data/vaPayTable';

export const RetireeCrdpCalculator = ({ currentRating = 70, hasDependents = 'single' }) => {
  const [retireeRank, setRetireeRank] = useState('E-7');
  const [yearsOfService, setYearsOfService] = useState(20);
  const [high3BasicPay, setHigh3BasicPay] = useState(5400); // High-3 average monthly basic pay
  const [isCombatRelated, setIsCombatRelated] = useState(false);
  const [combatRating, setCombatRating] = useState(50);
  const [hasSbp, setHasSbp] = useState(true);

  // 1. Military Pension Calculation
  // Legacy High-3: 2.5% per year of service (50% at 20 yrs, 75% at 30 yrs)
  // BRS (Blended Retirement): 2.0% per year of service (40% at 20 yrs)
  const pensionMultiplier = yearsOfService * 0.025;
  const grossMonthlyPension = Math.round(high3BasicPay * pensionMultiplier);

  // 2. VA Monthly Disability Compensation (100% Federal & State Tax-Free)
  const monthlyVaComp = getVaMonthlyComp(currentRating, hasDependents);

  // 3. CRDP (Concurrent Retirement and Disability Pay - 10 U.S.C. § 1414)
  // Condition: 20+ years of active duty service AND 50%+ VA disability rating
  // Result: NO OFFSET. Full military retirement pension PLUS full VA disability check.
  const isCrdpEligible = yearsOfService >= 20 && currentRating >= 50;

  // If rating < 50%, dollar-for-dollar offset occurs (pension is reduced by VA comp amount, but VA comp is tax-free)
  const pensionPaidUnderOffset = isCrdpEligible
    ? grossMonthlyPension
    : Math.max(0, grossMonthlyPension - monthlyVaComp);

  // 4. CRSC (Combat-Related Special Compensation - 10 U.S.C. § 1413a)
  // If disability is combat-related (purple heart, simulated war, hazardous duty, instrument of war),
  // veteran receives tax-free CRSC check to restore the offset.
  const combatVaComp = getVaMonthlyComp(combatRating, hasDependents);
  const crscCap = Math.min(combatVaComp, grossMonthlyPension);
  const crscMonthlyAmount = isCombatRelated ? crscCap : 0;

  // Total Combined Monthly Cash
  const totalMonthlyCash = isCrdpEligible
    ? grossMonthlyPension + monthlyVaComp
    : pensionPaidUnderOffset + monthlyVaComp + (isCombatRelated ? crscMonthlyAmount : 0);

  const totalAnnualCash = totalMonthlyCash * 12;

  // Tax breakdown (VA comp is 100% tax-free; military pension is federally taxable)
  const taxFreePct = Math.round((monthlyVaComp / totalMonthlyCash) * 100);

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border border-steel/60 bg-steel-dark/95 rounded-2xl p-6 sm:p-8 space-y-3 relative overflow-hidden shadow-xl">
        <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold">
          <Award size={15} /> 20-Year Career Retiree Command Post
        </div>
        <div className="space-y-1 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-sand">
            Military Pension + <span className="text-gold">CRDP & CRSC Combinator</span>
          </h2>
          <p className="text-sand/70 text-sm leading-relaxed font-sans">
            Under 10 U.S.C. § 1414 (CRDP), regular military retirees with a 50% or higher VA disability rating receive <strong>both their full military retirement pension and their full tax-free VA disability check</strong> with zero dollar-for-dollar offset.
          </p>
        </div>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Retirement Parameters (6 cols) */}
        <div className="lg:col-span-6 bg-steel/20 border border-steel/50 rounded-2xl p-6 space-y-5">
          <div className="border-b border-steel/50 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-mono uppercase text-gold font-bold flex items-center gap-1.5">
              <DollarSign size={14} /> Career & Pension Parameters
            </h3>
            <span className="text-xs font-mono text-sand/60">High-3 Legacy & BRS</span>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sand/80 uppercase font-bold text-[10px] mb-1">
                  Retirement Rank:
                </label>
                <select
                  value={retireeRank}
                  onChange={(e) => setRetireeRank(e.target.value)}
                  className="w-full bg-steel-dark border border-steel/60 rounded-xl px-3 py-2 text-sand text-sm focus:outline-none focus:border-gold"
                >
                  <option value="E-7">E-7 (SFC / MSgt / Gunny)</option>
                  <option value="E-8">E-8 (1SG / MSgt / Senior Chief)</option>
                  <option value="E-9">E-9 (SGM / CMSgt / Master Chief)</option>
                  <option value="O-4">O-4 (Major / LCDR)</option>
                  <option value="O-5">O-5 (LTC / Commander)</option>
                  <option value="O-6">O-6 (Colonel / Captain)</option>
                </select>
              </div>

              <div>
                <label className="block text-sand/80 uppercase font-bold text-[10px] mb-1">
                  Years of Active Service:
                </label>
                <input
                  type="number"
                  min="20"
                  max="40"
                  value={yearsOfService}
                  onChange={(e) => setYearsOfService(Math.max(20, parseInt(e.target.value) || 20))}
                  className="w-full bg-steel-dark border border-steel/60 rounded-xl px-3 py-2 text-sand text-sm focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sand/80 uppercase font-bold text-[11px]">
                  Average High-3 Monthly Basic Pay ($):
                </label>
                <span className="text-gold font-bold text-sm">${high3BasicPay.toLocaleString()}/mo</span>
              </div>
              <input
                type="range"
                min="3500"
                max="14000"
                step="100"
                value={high3BasicPay}
                onChange={(e) => setHigh3BasicPay(parseInt(e.target.value))}
                className="w-full accent-gold cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-sand/50 mt-0.5">
                <span>$3.5k (E-7)</span>
                <span>$7k (E-9 / O-4)</span>
                <span>$14k (O-6 Max)</span>
              </div>
            </div>

            {/* Combat Related (CRSC) Toggle */}
            <div className="p-3.5 rounded-xl bg-steel-dark border border-steel/60 space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer font-sans text-xs text-sand font-bold">
                  <input
                    type="checkbox"
                    checked={isCombatRelated}
                    onChange={(e) => setIsCombatRelated(e.target.checked)}
                    className="rounded border-steel/60 text-gold focus:ring-gold bg-steel"
                  />
                  <span>Do you have Combat-Related Disabilities (CRSC)?</span>
                </label>
                <span className="text-[10px] text-gold font-mono uppercase">10 U.S.C. § 1413a</span>
              </div>

              {isCombatRelated && (
                <div className="pt-2 border-t border-steel/40 flex items-center justify-between text-xs">
                  <span className="text-sand/70">Combat Disability Rating:</span>
                  <select
                    value={combatRating}
                    onChange={(e) => setCombatRating(parseInt(e.target.value))}
                    className="bg-steel border border-steel/60 rounded-lg px-2 py-1 text-sand text-xs focus:outline-none focus:border-gold"
                  >
                    {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(r => (
                      <option key={r} value={r}>{r}% Combat</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Survivor Benefit Plan (SBP) Toggle */}
            <div className="p-3 rounded-xl bg-steel-dark/60 border border-steel/60 flex items-center justify-between text-xs">
              <div>
                <span className="text-sand font-bold">Survivor Benefit Plan (SBP) Enrollment:</span>
                <div className="text-[10px] text-sand/50">6.5% pre-tax pension deduction protects spouse (55% lifetime)</div>
              </div>
              <input
                type="checkbox"
                checked={hasSbp}
                onChange={(e) => setHasSbp(e.target.checked)}
                className="rounded border-steel/60 text-gold focus:ring-gold bg-steel"
              />
            </div>
          </div>
        </div>

        {/* Right Col: Pay Combinator Output (6 cols) */}
        <div className="lg:col-span-6 bg-steel-dark border border-gold/40 rounded-2xl p-6 space-y-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-steel/50 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-gold uppercase font-bold">Combined Monthly Cash Flow</span>
                <div className="text-3xl font-black font-mono text-emerald-400 mt-0.5">
                  ${totalMonthlyCash.toLocaleString()} <span className="text-xs text-sand/60">/mo</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-sand/50 uppercase">Annualized</span>
                <div className="text-lg font-black text-sand font-mono">
                  ${totalAnnualCash.toLocaleString()}/yr
                </div>
              </div>
            </div>

            {/* Eligibility Status Pill */}
            <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
              isCrdpEligible
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
            }`}>
              <span className="font-bold">
                {isCrdpEligible
                  ? '✅ CRDP ACTIVE: 100% CONCURRENT RECEIPT (ZERO OFFSET)'
                  : '⚠️ UNDER 50% RATING: VA COMP OFFSETS PENSION'}
              </span>
              <span className="text-[10px]">{currentRating}% Rated</span>
            </div>

            {/* Breakdown Stack */}
            <div className="space-y-2 text-xs font-mono">
              <div className="bg-steel/30 p-2.5 rounded-xl border border-steel/50 flex justify-between items-center">
                <div>
                  <span className="text-sand font-bold">Military Retirement Pension ({yearsOfService} Yrs @ {(pensionMultiplier*100).toFixed(1)}%):</span>
                  <div className="text-[10px] text-sand/50">Federally taxable | COLA adjusted</div>
                </div>
                <strong className="text-sand text-sm">${grossMonthlyPension.toLocaleString()}/mo</strong>
              </div>

              <div className="bg-steel/30 p-2.5 rounded-xl border border-steel/50 flex justify-between items-center">
                <div>
                  <span className="text-sand font-bold">VA Disability Compensation ({currentRating}%):</span>
                  <div className="text-[10px] text-emerald-400 font-bold">100% Tax-Free Federal & State</div>
                </div>
                <strong className="text-emerald-400 text-sm">+${monthlyVaComp.toLocaleString()}/mo</strong>
              </div>

              {hasSbp && (
                <div className="bg-steel/20 p-2 rounded-lg border border-steel/40 flex justify-between items-center text-sand/70">
                  <span>Pre-Tax SBP Deduction (6.5%):</span>
                  <span className="text-scarlet font-bold">-${Math.round(grossMonthlyPension * 0.065).toLocaleString()}/mo</span>
                </div>
              )}
            </div>

            {/* Tax Shield Readout */}
            <div className="bg-steel/20 border border-steel/50 rounded-xl p-3 text-xs text-sand/80 font-sans space-y-1">
              <div className="flex justify-between font-mono text-[11px] text-gold font-bold">
                <span>Tax-Free Income Ratio:</span>
                <span>{taxFreePct}% Tax-Free</span>
              </div>
              <p className="text-[11px] text-sand/70 leading-relaxed">
                Because ${monthlyVaComp.toLocaleString()}/mo of your monthly income comes from VA disability, it is completely exempt from federal income taxes, state taxes, and FICA.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Retiree Healthcare & SBP Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
        <div className="bg-steel/20 border border-steel/50 rounded-2xl p-5 space-y-2">
          <span className="text-gold font-mono font-bold uppercase text-[11px]">1. TRICARE Prime / Select</span>
          <p className="text-sand/70 leading-relaxed">
            As a 20-year retiree, you and your family have lifelong TRICARE coverage with low annual enrollment fees (~$372/yr individual, ~$744/yr family) transitioning to TRICARE For Life (TFL) at age 65 alongside Medicare Part B.
          </p>
        </div>

        <div className="bg-steel/20 border border-steel/50 rounded-2xl p-5 space-y-2">
          <span className="text-gold font-mono font-bold uppercase text-[11px]">2. VA Priority Group 1</span>
          <p className="text-sand/70 leading-relaxed">
            Veterans rated 50%+ are automatically placed in <strong>VA Priority Group 1</strong>: 100% free outpatient and inpatient care, zero prescription medication copayments, and travel reimbursement for clinic appointments.
          </p>
        </div>

        <div className="bg-steel/20 border border-steel/50 rounded-2xl p-5 space-y-2">
          <span className="text-gold font-mono font-bold uppercase text-[11px]">3. State Pension Tax Shields</span>
          <p className="text-sand/70 leading-relaxed">
            Over 36 states (including Texas, Florida, North Carolina, Ohio, Indiana, Pennsylvania) exempt 100% of military retirement pension pay from state income taxes. Check the 50-State Matrix tab for your state.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RetireeCrdpCalculator;
