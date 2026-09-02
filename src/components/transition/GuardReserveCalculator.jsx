import React, { useState } from 'react';
import { Shield, AlertTriangle, Calculator } from 'lucide-react';
import { DRILL_PAY_ESTIMATES } from '../../data/serviceTypes';
import { getVaMonthlyComp } from '../../data/vaPayTable';

export const GuardReserveCalculator = ({ currentRating = 70, hasDependents = 'single' }) => {
  const [payGrade, setPayGrade] = useState('E-5');
  const [drillDaysPerYear, setDrillDaysPerYear] = useState(63); // 48 MUTAs (24 drill days) + 15 AT days = 63 drill days standard
  const [selectedTab, setSelectedTab] = useState('offset');

  // Daily VA Disability Rate = (Monthly Comp * 12) / 360 days (VA statutory formula)
  const monthlyVaComp = getVaMonthlyComp(currentRating, hasDependents);
  const annualVaComp = monthlyVaComp * 12;
  const dailyVaRate = Math.round((annualVaComp / 360) * 100) / 100;

  // Selected Pay Grade Drill Pay
  const gradeData = DRILL_PAY_ESTIMATES[payGrade] || DRILL_PAY_ESTIMATES['E-5'];
  const dailyDrillPay = gradeData.dailyPay;
  
  // Total Drill Pay earned across drill days
  const totalAnnualDrillPay = dailyDrillPay * drillDaysPerYear;

  // If you waive VA Comp (most common for higher ranks/grades):
  // You owe the VA: drillDays * dailyVaRate
  const vaDebtIncurred = Math.round(drillDaysPerYear * dailyVaRate);
  
  // Net cash if you KEEP Drill Pay and WAIVE VA Comp for drill days:
  // Net = (Annual VA Comp - VA Debt) + Total Drill Pay
  const netOptionKeepDrillPay = Math.round(annualVaComp - vaDebtIncurred + totalAnnualDrillPay);

  // Financial Recommendation
  const isDrillPayHigher = dailyDrillPay > dailyVaRate;
  const recommendedChoice = isDrillPayHigher ? 'KEEP DRILL PAY & WAIVE VA COMP' : 'WAIVE DRILL PAY & KEEP VA COMP';

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border border-steel/60 bg-steel-dark/95 rounded-2xl p-6 sm:p-8 space-y-3 relative overflow-hidden shadow-xl">
        <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold">
          <Shield size={15} /> National Guard & Reserve Command Post
        </div>
        <div className="space-y-1 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-sand">
            Guard & Reserve <span className="text-gold">Drill Pay vs. VA Offset Engine</span>
          </h2>
          <p className="text-sand/70 text-sm leading-relaxed font-sans">
            Under 10 U.S.C. § 12316 and 38 U.S.C. § 5304, you cannot legally receive both military drill pay and VA disability compensation for the exact same calendar day. Calculate your exact offset, avoid surprise $4,000+ debt letters, and check VA Loan & retirement rules.
          </p>
        </div>

        {/* Sub-nav switcher */}
        <div className="flex items-center gap-2 pt-2 border-t border-steel/40">
          <button
            onClick={() => setSelectedTab('offset')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
              selectedTab === 'offset'
                ? 'bg-gold text-steel-dark border-gold'
                : 'bg-steel/30 text-sand/70 hover:text-sand border-steel/50'
            }`}
          >
            1. Drill Pay vs. VA Offset Calculator
          </button>
          <button
            onClick={() => setSelectedTab('valoan')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
              selectedTab === 'valoan'
                ? 'bg-gold text-steel-dark border-gold'
                : 'bg-steel/30 text-sand/70 hover:text-sand border-steel/50'
            }`}
          >
            2. Guard/Reserve VA Home Loan Rules
          </button>
          <button
            onClick={() => setSelectedTab('retirement')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
              selectedTab === 'retirement'
                ? 'bg-gold text-steel-dark border-gold'
                : 'bg-steel/30 text-sand/70 hover:text-sand border-steel/50'
            }`}
          >
            3. Non-Regular Retirement (Age 60)
          </button>
        </div>
      </div>

      {/* TAB 1: DRILL PAY VS VA OFFSET CALCULATOR */}
      {selectedTab === 'offset' && (
        <div className="space-y-6">
          {/* Important Debt Alert Box */}
          <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-5 flex items-start gap-3.5">
            <AlertTriangle className="text-amber-400 flex-shrink-0 mt-0.5" size={20} />
            <div className="space-y-1 text-xs font-sans">
              <strong className="text-amber-300 font-mono text-sm uppercase block">
                The "Surprise VA Debt Letter" Rule:
              </strong>
              <p className="text-sand/80 leading-relaxed">
                The VA and Defense Finance and Accounting Service (DFAS) audit drill days annually. If you perform 63 drill days (48 MUTAs + 15 AT days) while collecting 100% of your monthly VA check, the VA will send you a debt collection letter for <strong>${vaDebtIncurred.toLocaleString()}</strong>. Use this calculator to know your numbers and submit <strong>VA Form 21-8951-2</strong> ahead of time.
              </p>
            </div>
          </div>

          {/* Calculator Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Col: Parameters */}
            <div className="lg:col-span-6 bg-steel/20 border border-steel/50 rounded-2xl p-6 space-y-5">
              <div className="border-b border-steel/50 pb-3 flex items-center justify-between">
                <h3 className="text-sm font-mono uppercase text-gold font-bold flex items-center gap-1.5">
                  <Calculator size={14} /> Drill & Rating Inputs
                </h3>
                <span className="text-xs font-mono text-sand/60">360-Day VA Math</span>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-sand/80 uppercase font-bold text-[11px] mb-1">
                    Your Drill Pay Grade / Rank:
                  </label>
                  <select
                    value={payGrade}
                    onChange={(e) => setPayGrade(e.target.value)}
                    className="w-full bg-steel-dark border border-steel/60 rounded-xl px-3 py-2 text-sand text-sm focus:outline-none focus:border-gold"
                  >
                    {Object.keys(DRILL_PAY_ESTIMATES).map(k => (
                      <option key={k} value={k}>{DRILL_PAY_ESTIMATES[k].name} (~${DRILL_PAY_ESTIMATES[k].dailyPay}/day)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sand/80 uppercase font-bold text-[11px]">
                      Drill & Annual Training Days per Year:
                    </label>
                    <span className="text-gold font-bold text-sm">{drillDaysPerYear} Days</span>
                  </div>
                  <input
                    type="range"
                    min="24"
                    max="120"
                    step="1"
                    value={drillDaysPerYear}
                    onChange={(e) => setDrillDaysPerYear(parseInt(e.target.value))}
                    className="w-full accent-gold cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-sand/50 mt-0.5">
                    <span>24 Days (Drill Only)</span>
                    <span>63 Days (Std 48 MUTAs + 15 AT)</span>
                    <span>120 Days (High Ops)</span>
                  </div>
                </div>

                {/* Day Rate Comparison Table */}
                <div className="bg-steel-dark/90 border border-steel/60 rounded-xl p-4 space-y-2">
                  <div className="text-[11px] text-gold font-bold uppercase border-b border-steel/40 pb-1">
                    Daily Pay Rate Head-to-Head:
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sand/70">Military Drill Pay (1 Day / 2 MUTAs):</span>
                    <strong className="text-sand text-sm">${dailyDrillPay.toFixed(2)}/day</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sand/70">VA Disability Rate ({currentRating}%):</span>
                    <strong className="text-emerald-400 text-sm">${dailyVaRate.toFixed(2)}/day</strong>
                  </div>
                  <div className="pt-1 border-t border-steel/40 flex justify-between text-[11px]">
                    <span className="text-sand/60">Advantage:</span>
                    <span className={`font-bold ${isDrillPayHigher ? 'text-gold' : 'text-emerald-400'}`}>
                      {isDrillPayHigher
                        ? `Drill Pay is +$${(dailyDrillPay - dailyVaRate).toFixed(2)}/day higher`
                        : `VA Disability is +$${(dailyVaRate - dailyDrillPay).toFixed(2)}/day higher`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Mathematical Verdict & Action Plan */}
            <div className="lg:col-span-6 bg-steel-dark border border-gold/40 rounded-2xl p-6 space-y-5 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-steel/50 pb-3">
                  <span className="text-[10px] font-mono text-gold uppercase font-bold">Optimal Financial Strategy</span>
                  <div className="text-xl font-black text-sand uppercase mt-1">
                    {recommendedChoice}
                  </div>
                  <p className="text-xs text-sand/60 mt-0.5">
                    Maximizes your annual cash flow while remaining 100% compliant with DFAS & VA regulations.
                  </p>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="bg-steel/30 p-3 rounded-xl border border-steel/50 flex justify-between items-center">
                    <span className="text-sand/70">Total Annual Drill Pay Earned:</span>
                    <strong className="text-sand text-sm">${totalAnnualDrillPay.toLocaleString()}</strong>
                  </div>

                  <div className="bg-steel/30 p-3 rounded-xl border border-steel/50 flex justify-between items-center">
                    <span className="text-sand/70">VA Comp Offset for {drillDaysPerYear} Days:</span>
                    <strong className="text-amber-400 text-sm">-${vaDebtIncurred.toLocaleString()}</strong>
                  </div>

                  <div className="bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-500/40 flex justify-between items-center">
                    <span className="text-sand font-bold">Net Annual Cash Retained:</span>
                    <strong className="text-emerald-400 text-base font-mono">
                      ${netOptionKeepDrillPay.toLocaleString()}
                    </strong>
                  </div>
                </div>

                {/* Practical Advice */}
                <div className="bg-steel/20 border border-steel/50 rounded-xl p-3.5 text-xs text-sand/80 space-y-1.5 font-sans">
                  <strong className="text-gold font-mono uppercase text-[11px] block">Recommended Action Steps:</strong>
                  <p>
                    1. <strong>Keep your Drill Pay</strong> because it counts toward your future retirement points and Social Security credits.
                  </p>
                  <p>
                    2. When the VA sends the annual <strong>VA Form 21-8951-2</strong> notice in the fall, check "Waive VA Disability Compensation" for {drillDaysPerYear} days. The VA will simply adjust your monthly checks or withhold for 1-2 months rather than demanding an immediate lump sum.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GUARD / RESERVE VA HOME LOAN RULES */}
      {selectedTab === 'valoan' && (
        <div className="bg-steel/20 border border-steel/50 rounded-2xl p-6 space-y-5">
          <div className="border-b border-steel/50 pb-3">
            <h3 className="text-lg font-black uppercase text-sand">
              VA Home Loan Eligibility for Guard & Reservists
            </h3>
            <p className="text-xs text-sand/60">How traditional drill status qualifies for $0-down VA loans.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            <div className="bg-steel-dark border border-steel/60 rounded-xl p-4 space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-gold/10 text-gold border border-gold/30">
                Pathway 1: 6 Good Drill Years
              </span>
              <h4 className="font-bold text-sand text-sm font-mono">6 Years in Selected Reserve</h4>
              <p className="text-sand/70 leading-relaxed">
                Must have completed at least 6 years in the Selected Reserve or National Guard with an honorable discharge, placed on the retired list, or continuing to serve in good standing (at least 50 points per year).
              </p>
              <div className="text-[11px] font-mono text-sand/50">Documentation: NGB-22 / Points Statement (ARPC 249 / NGB 23)</div>
            </div>

            <div className="bg-steel-dark border border-steel/60 rounded-xl p-4 space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Pathway 2: 90 Days Active Duty
              </span>
              <h4 className="font-bold text-sand text-sm font-mono">Title 10 or Title 32 Active Service</h4>
              <p className="text-sand/70 leading-relaxed">
                Under the Johnny Isakson and David P. Roe, M.D. Veterans Health Care and Benefits Improvement Act of 2020, Guard members who served <strong>at least 90 cumulative days of full-time active duty</strong> (with at least 30 consecutive days under Title 32 orders) are fully eligible.
              </p>
              <div className="text-[11px] font-mono text-sand/50">Documentation: DD-214 or Title 32 Section 502(f) orders</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NON-REGULAR RETIREMENT (AGE 60) */}
      {selectedTab === 'retirement' && (
        <div className="bg-steel/20 border border-steel/50 rounded-2xl p-6 space-y-5">
          <div className="border-b border-steel/50 pb-3">
            <h3 className="text-lg font-black uppercase text-sand">
              Non-Regular Guard / Reserve Retirement Points Engine
            </h3>
            <p className="text-xs text-sand/60">Understanding the age-60 pension and early retirement order reductions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
            <div className="bg-steel-dark border border-steel/60 rounded-xl p-4 space-y-2">
              <span className="font-bold font-mono text-gold text-xs block">1. Retirement Points Math</span>
              <p className="text-sand/70 leading-relaxed">
                Every drill weekend earns 4 points; 15 days Annual Training earns 15 points; 15 annual membership points are granted automatically. 
              </p>
              <div className="bg-steel/30 p-2 rounded text-[11px] font-mono text-emerald-400">
                Formula: (Total Career Points / 360) × 2.5% × High-3 Base Pay
              </div>
            </div>

            <div className="bg-steel-dark border border-steel/60 rounded-xl p-4 space-y-2">
              <span className="font-bold font-mono text-gold text-xs block">2. Reduced Age Retirement</span>
              <p className="text-sand/70 leading-relaxed">
                Under the 2008 NDAA, for every 90 days served on qualifying Title 10 active duty orders in a fiscal year, your retirement pay eligibility age (normally age 60) drops by 3 months down to a floor of age 50.
              </p>
            </div>

            <div className="bg-steel-dark border border-steel/60 rounded-xl p-4 space-y-2">
              <span className="font-bold font-mono text-gold text-xs block">3. TRICARE Retired Reserve</span>
              <p className="text-sand/70 leading-relaxed">
                Between the date you transfer to the Retired Reserve ("Gray Area") and the date you turn age 60, you can purchase TRICARE Retired Reserve (TRR) coverage before transitioning to standard TRICARE Prime/Select at age 60.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuardReserveCalculator;
