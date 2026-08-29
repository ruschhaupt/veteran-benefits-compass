import React, { useState } from 'react';
import {
  Home, RefreshCw, Award
} from 'lucide-react';

export const VaLoanAnalyzer = ({ currentRating = 70 }) => {
  const [purchasePrice, setPurchasePrice] = useState(450000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [isFirstUse, setIsFirstUse] = useState(true);

  // IRRRL Streamline Refi parameters
  const [currentMortgageBalance, setCurrentMortgageBalance] = useState(400000);
  const [currentRate, setCurrentRate] = useState(7.25);
  const [newRefiRate, setNewRefiRate] = useState(5.75);

  const isFeeWaived = currentRating >= 10;
  
  // Standard VA Funding fee: 2.15% first use, 3.3% subsequent use with 0% down
  const standardFeePct = isFirstUse ? 0.0215 : 0.033;

  // Monthly Principal & Interest Calculation
  const calculateMonthlyPI = (principal, ratePct) => {
    const monthlyRate = (ratePct / 100) / 12;
    const numPayments = 360;
    if (monthlyRate === 0) return principal / numPayments;
    return (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  };

  const monthlyPI = calculateMonthlyPI(purchasePrice, interestRate);
  
  // FHA comparison (FHA requires 3.5% down + 1.75% upfront MIP + 0.55% annual PMI)
  const fhaDown = purchasePrice * 0.035;
  const fhaMonthlyPmi = (purchasePrice * 0.0055) / 12;

  // IRRRL Refinance calculations
  const oldMonthlyPI = calculateMonthlyPI(currentMortgageBalance, currentRate);
  const newMonthlyPI = calculateMonthlyPI(currentMortgageBalance, newRefiRate);
  const monthlySavings = Math.max(0, oldMonthlyPI - newMonthlyPI);
  const estimatedRefiCosts = 4500; // Average closing costs rolled into loan
  const breakEvenMonths = monthlySavings > 0 ? Math.ceil(estimatedRefiCosts / monthlySavings) : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-steel/40 via-steel-dark to-steel-dark border border-gold/40 rounded-3xl p-6 sm:p-8 space-y-3 relative overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold">
          <Home size={15} /> VA Home Loan & IRRRL Streamline Refinance Engine
        </div>
        <div className="space-y-1 max-w-3xl">
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-sand">
            VA Loan <span className="text-gold">Zero-Down & Refi Analyzer</span>
          </h2>
          <p className="text-sand/70 text-sm leading-relaxed font-sans">
            The VA Home Loan is the most powerful wealth-building vehicle in the United States: 0% down payment, no monthly mortgage insurance (PMI), and 100% funding fee exemption for veterans with a 10%+ disability rating.
          </p>
        </div>
      </div>

      {/* Main Grid: Purchase Calculator & Funding Fee Waiver */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Purchase Inputs (6 cols) */}
        <div className="lg:col-span-6 bg-steel/20 border border-steel/50 rounded-3xl p-6 space-y-5">
          <div className="border-b border-steel/50 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-mono uppercase text-gold font-bold">1. Purchase Price & Terms</h3>
            <span className="text-xs font-mono text-sand/60">30-Year Fixed</span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sand/80 uppercase font-bold text-[11px]">Home Purchase Price:</label>
                <span className="text-lg font-black text-sand font-mono">${purchasePrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="150000"
                max="1200000"
                step="10000"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(parseInt(e.target.value))}
                className="w-full accent-gold cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-sand/50 mt-1">
                <span>$150k</span>
                <span>$600k</span>
                <span>$1.2M</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sand/80 uppercase font-bold text-[11px]">Mortgage Interest Rate:</label>
                <span className="text-lg font-black text-gold font-mono">{interestRate}%</span>
              </div>
              <input
                type="range"
                min="4.0"
                max="9.0"
                step="0.125"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="w-full accent-gold cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-steel-dark border border-steel/60">
              <span className="text-sand font-bold text-[11px]">First-Time VA Loan Usage?</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsFirstUse(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                    isFirstUse ? 'bg-gold text-steel-dark' : 'bg-steel text-sand'
                  }`}
                >
                  Yes (2.15%)
                </button>
                <button
                  type="button"
                  onClick={() => setIsFirstUse(false)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                    !isFirstUse ? 'bg-gold text-steel-dark' : 'bg-steel text-sand'
                  }`}
                >
                  Subsequent (3.3%)
                </button>
              </div>
            </div>

            {/* Disability Funding Fee Exemption Badge */}
            <div className="p-4 rounded-2xl bg-steel-dark/90 border border-gold/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-gold font-mono font-bold text-xs uppercase">
                  <Award size={14} /> VA Funding Fee Status:
                </div>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                  isFeeWaived ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {isFeeWaived ? '100% EXEMPT ($0 FEE)' : 'FEE APPLIES'}
                </span>
              </div>
              <p className="text-xs text-sand/80 font-sans leading-relaxed">
                {isFeeWaived ? (
                  <>You save <strong className="text-emerald-400 font-mono">${(purchasePrice * standardFeePct).toLocaleString()}</strong> in upfront funding fees because your VA disability rating is 10%+.</>
                ) : (
                  <>Standard funding fee of ${(purchasePrice * standardFeePct).toLocaleString()} applies. Reaching a 10%+ disability rating waives this fee permanently.</>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Monthly Breakdown & FHA Comparison (6 cols) */}
        <div className="lg:col-span-6 bg-steel-dark border border-gold/40 rounded-3xl p-6 space-y-5 shadow-xl">
          <div className="border-b border-steel/50 pb-3">
            <span className="text-[10px] font-mono text-gold uppercase font-bold">Estimated Monthly Payment (P&I)</span>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono mt-1">
              ${Math.round(monthlyPI).toLocaleString()}<span className="text-sm text-sand/60">/mo</span>
            </div>
            <span className="text-xs text-sand/60 font-mono">0% Down Payment • No Monthly PMI</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="bg-steel/30 border border-steel/50 rounded-2xl p-4 space-y-2">
              <span className="text-gold uppercase font-bold text-[11px] block">
                VA Loan vs. FHA Loan Advantage:
              </span>
              <div className="grid grid-cols-2 gap-3 text-sand/80">
                <div>
                  <span className="text-[10px] text-sand/50 uppercase block">FHA Down Payment (3.5%):</span>
                  <span className="text-sm font-bold text-scarlet">${fhaDown.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-sand/50 uppercase block">VA Down Payment:</span>
                  <span className="text-sm font-bold text-emerald-400">$0 (Saved ${fhaDown.toLocaleString()})</span>
                </div>
                <div>
                  <span className="text-[10px] text-sand/50 uppercase block">Monthly PMI Saved:</span>
                  <span className="text-sm font-bold text-emerald-400">+${Math.round(fhaMonthlyPmi)}/mo</span>
                </div>
                <div>
                  <span className="text-[10px] text-sand/50 uppercase block">5-Year PMI Savings:</span>
                  <span className="text-sm font-bold text-emerald-400">+${Math.round(fhaMonthlyPmi * 60).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-steel/20 border border-steel/50 rounded-xl p-3.5 space-y-1 text-xs font-sans text-sand/80">
              <strong className="text-gold font-mono block">Multi-Family House Hacking Rule:</strong>
              You can use your VA loan to purchase up to a <strong>4-plex (4 residential units)</strong> with 0% down payment as long as you live in 1 unit for 1 year. The rental income from the other 3 units pays your entire mortgage.
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: IRRRL Streamline Refinance Calculator */}
      <div className="bg-steel/20 border border-steel/50 rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="border-b border-steel/50 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-wider font-bold">
              <RefreshCw size={14} /> Interest Rate Reduction Refinance Loan (IRRRL)
            </div>
            <h3 className="text-xl font-black text-sand uppercase mt-0.5">
              VA Streamline Refi Break-Even Calculator
            </h3>
          </div>
          <span className="px-3 py-1 rounded-xl bg-gold/10 text-gold border border-gold/30 text-xs font-mono font-bold self-start sm:self-auto">
            No Appraisal • No Income Docs Required
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 font-mono text-xs">
          <div className="bg-steel-dark border border-steel/60 rounded-2xl p-4 space-y-3">
            <div>
              <label className="text-sand/80 uppercase font-bold text-[11px] block mb-1">
                Current Mortgage Balance:
              </label>
              <input
                type="number"
                value={currentMortgageBalance}
                onChange={(e) => setCurrentMortgageBalance(parseInt(e.target.value) || 0)}
                className="w-full bg-steel border border-steel/60 rounded-xl p-2.5 text-sand focus:outline-none focus:border-gold font-mono"
              />
            </div>
            <div>
              <label className="text-sand/80 uppercase font-bold text-[11px] block mb-1">
                Current Interest Rate (%):
              </label>
              <input
                type="number"
                step="0.125"
                value={currentRate}
                onChange={(e) => setCurrentRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-steel border border-steel/60 rounded-xl p-2.5 text-sand focus:outline-none focus:border-gold font-mono"
              />
            </div>
            <div>
              <label className="text-sand/80 uppercase font-bold text-[11px] block mb-1">
                Target New Refi Rate (%):
              </label>
              <input
                type="number"
                step="0.125"
                value={newRefiRate}
                onChange={(e) => setNewRefiRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-steel border border-steel/60 rounded-xl p-2.5 text-sand focus:outline-none focus:border-gold font-mono"
              />
            </div>
          </div>

          <div className="bg-steel-dark border border-steel/60 rounded-2xl p-5 space-y-3 flex flex-col justify-center">
            <span className="text-[10px] uppercase text-sand/50">Monthly Cash Savings</span>
            <div className="text-3xl font-black text-emerald-400 font-mono">
              +${Math.round(monthlySavings).toLocaleString()}<span className="text-xs text-sand/60">/mo</span>
            </div>
            <div className="text-xs text-sand/70">
              Annual Cash Savings: <strong className="text-sand font-mono">+${Math.round(monthlySavings * 12).toLocaleString()}/yr</strong>
            </div>
          </div>

          <div className="bg-steel-dark border border-steel/60 rounded-2xl p-5 space-y-3 flex flex-col justify-center">
            <span className="text-[10px] uppercase text-sand/50">Statutory Recoupment Clock</span>
            <div className="text-3xl font-black text-gold font-mono">
              {breakEvenMonths} Months
            </div>
            <p className="text-[11px] text-sand/70 font-sans leading-relaxed">
              By federal law (38 U.S.C. § 3709), an IRRRL refinance must recoup all closing costs within <strong>36 months</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaLoanAnalyzer;
