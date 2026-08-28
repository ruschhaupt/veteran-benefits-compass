import React, { useState } from 'react';
import {
  Award, Share2, Copy, Check, Printer
} from 'lucide-react';
import { calculateVeteranWealth } from '../../utils/wealthCalculator';
import { STATE_BENEFITS } from '../../data/stateBenefits';
import { BRANCH_DATA } from '../../data/branchData';

export const VeteranWealthScorecard = ({
  userName = '',
  branch = 'usmc',
  currentRating = 70,
  selectedState = 'tx',
  hasDependents = 'single',
  completedBenefits = {},
  homePrice = 450000
}) => {
  const [copiedType, setCopiedType] = useState(null);

  const wealth = calculateVeteranWealth({
    currentRating,
    hasDependents,
    selectedState,
    completedBenefits,
    homePrice
  });

  const stateInfo = STATE_BENEFITS[selectedState] || STATE_BENEFITS.tx;
  const bd = BRANCH_DATA[branch] || BRANCH_DATA.usmc;

  // Generate Reddit Markdown
  const redditText = `### 🎖️ Veteran Wealth & Compensation Debrief
* **Branch:** ${bd.name}
* **Current Rating:** ${currentRating}% Service-Connected
* **State of Domicile:** ${stateInfo.name} (${stateInfo.taxStatus})

#### 💰 Financial Breakdown
* **Active Tax-Free Disability:** $${wealth.monthlyComp.toLocaleString()}/mo ($${wealth.annualComp.toLocaleString()}/yr)
* **Identified Unclaimed Gap:** +$${wealth.unclaimedMonthlyGap.toLocaleString()}/mo (+$${wealth.unclaimedAnnualGap.toLocaleString()}/yr)
* **State Tax & Healthcare Shield:** $${wealth.totalAnnualTaxAndHealthShield.toLocaleString()}/yr
* **Total Annual Value Unlocked:** **$${wealth.totalAnnualValueUnlocked.toLocaleString()} / year**
* **10-Year Projected Wealth Floor:** **$${wealth.tenYearImpact.toLocaleString()}**

*Calculated with zero sign-up & zero data stored via Veteran Benefits Compass:*
https://veteran-benefits-compass.vercel.app`;

  // Generate SMS / GroupMe Text
  const smsText = `I ran my military numbers through this free calculator:
Found $${wealth.totalAnnualValueUnlocked.toLocaleString()}/yr in tax-free comp and state tax shields.
Check what you're leaving on the table: https://veteran-benefits-compass.vercel.app`;

  const handleCopy = (type, text) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-steel/40 via-steel-dark to-steel-dark border border-gold/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl space-y-3">
        <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold">
          <Award size={14} /> The Viral Wealth Scorecard
        </div>
        <div className="space-y-1 max-w-3xl">
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-sand">
            Veteran Wealth <span className="text-gold">Mission Debrief</span>
          </h2>
          <p className="text-sand/70 text-sm leading-relaxed font-sans">
            A comprehensive summary of your annual tax-free income, unlocked state tax shields, and lifetime wealth floor. Share your anonymized win with your unit or on Reddit.
          </p>
        </div>
      </div>

      {/* The Visual Scorecard Card */}
      <div className="bg-gradient-to-b from-steel/30 via-steel-dark to-steel-dark border-2 border-gold/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-w-3xl mx-auto font-mono">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-steel/60 pb-5">
          <div className="space-y-1">
            <span className="text-[10px] text-gold uppercase tracking-widest font-bold">
              === OFFICIAL MISSION DEBRIEF ===
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-sand uppercase">
              {userName ? userName : 'U.S. Veteran'} • {bd.badge}
            </h3>
            <div className="text-xs text-sand/60">
              Rating: <strong className="text-gold">{currentRating}%</strong> • State: <strong className="text-sand">{stateInfo.name}</strong>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-gold/10 border border-gold/40 text-gold text-xs font-bold self-start sm:self-center">
            {currentRating === 100 ? '🛡️ 100% P&T SOVEREIGN' : `🎯 CLIMB TO 100%`}
          </div>
        </div>

        {/* Core Financial Readout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-steel/30 border border-steel/50 rounded-2xl p-4 space-y-1">
            <span className="text-[10px] text-sand/50 uppercase">Active Monthly Cash</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">
              ${wealth.monthlyComp.toLocaleString()} <span className="text-xs text-sand/60">/mo</span>
            </div>
            <div className="text-xs text-sand/70">
              ${wealth.annualComp.toLocaleString()}/yr 100% Tax-Free
            </div>
          </div>

          <div className="bg-steel/30 border border-steel/50 rounded-2xl p-4 space-y-1">
            <span className="text-[10px] text-sand/50 uppercase">Identified Unclaimed Gap</span>
            <div className="text-2xl sm:text-3xl font-black text-gold">
              +${wealth.unclaimedMonthlyGap.toLocaleString()} <span className="text-xs text-sand/60">/mo</span>
            </div>
            <div className="text-xs text-sand/70">
              +${wealth.unclaimedAnnualGap.toLocaleString()}/yr in Potential Pay
            </div>
          </div>
        </div>

        {/* State Shields & Healthcare Breakdown */}
        <div className="bg-steel/20 border border-steel/50 rounded-2xl p-5 space-y-3 text-xs">
          <div className="text-gold font-bold uppercase text-[11px] border-b border-steel/40 pb-1.5">
            Annual Shields & Value Unlocked:
          </div>
          <div className="flex justify-between items-center text-sand/80">
            <span>State Property Tax Exemption ({stateInfo.name}):</span>
            <strong className="text-sand">${wealth.statePropertyTaxSaved.toLocaleString()}/yr</strong>
          </div>
          <div className="flex justify-between items-center text-sand/80">
            <span>CHAMPVA & Family Healthcare Shield:</span>
            <strong className="text-sand">${wealth.champvaSavings.toLocaleString()}/yr</strong>
          </div>
          <div className="flex justify-between items-center text-sand/80">
            <span>VA Comprehensive Dental Value:</span>
            <strong className="text-sand">${wealth.dentalSavings.toLocaleString()}/yr</strong>
          </div>

          <div className="pt-2 border-t border-steel/50 flex justify-between items-center text-sm font-bold">
            <span className="text-sand">Total Annual Value Unlocked:</span>
            <span className="text-emerald-400 text-lg sm:text-xl">${wealth.totalAnnualValueUnlocked.toLocaleString()} / yr</span>
          </div>
        </div>

        {/* 10-Year & 20-Year Compounding Wealth Floor */}
        <div className="bg-steel-dark border border-gold/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="text-[10px] text-sand/50 uppercase font-bold">10-Year Guaranteed Floor</span>
            <div className="text-xl sm:text-2xl font-black text-gold">
              ${wealth.tenYearImpact.toLocaleString()}
            </div>
          </div>
          <div className="text-xs text-sand/60 font-sans max-w-xs">
            Inflation-indexed federal compensation + tax savings. Zero risk, sovereign baseline.
          </div>
        </div>

        {/* Share & Copy Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleCopy('reddit', redditText)}
            className="flex-1 py-3 px-4 rounded-xl bg-gold hover:bg-yellow-600 text-steel-dark font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            {copiedType === 'reddit' ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedType === 'reddit' ? 'Copied Reddit Markdown!' : 'Copy Reddit Summary'}</span>
          </button>

          <button
            onClick={() => handleCopy('sms', smsText)}
            className="flex-1 py-3 px-4 rounded-xl bg-steel-dark border border-steel/60 hover:border-gold text-sand font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            {copiedType === 'sms' ? <Check size={14} /> : <Share2 size={14} />}
            <span>{copiedType === 'sms' ? 'Copied Text!' : 'Copy SMS / Chat Text'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="py-3 px-4 rounded-xl bg-steel-dark border border-steel/60 hover:border-gold text-sand font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-all"
            title="Print Scorecard"
          >
            <Printer size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VeteranWealthScorecard;
