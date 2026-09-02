import React, { useState } from 'react';
import { Heart, GraduationCap, CheckCircle } from 'lucide-react';
import { FAMILY_BENEFITS_DATA } from '../../data/serviceTypes';

export const FamilyBenefitsSuite = ({ currentRating = 100, selectedState = 'tx' }) => {
  const [numCollegeKids, setNumCollegeKids] = useState(2);
  const [spouseInSchool, setSpouseInSchool] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState('chapter_35_dea');

  const is100Pt = currentRating >= 100;

  // Chapter 35 DEA Math ($1,536/mo per person for 36 months)
  const monthlyDeaRate = 1536;
  const totalStudents = numCollegeKids + (spouseInSchool ? 1 : 0);
  const monthlyDeaTotal = totalStudents * monthlyDeaRate;
  const lifetimeDeaTotal = totalStudents * (monthlyDeaRate * 36);

  const activeBenefitData = FAMILY_BENEFITS_DATA.find(b => b.id === selectedBenefit) || FAMILY_BENEFITS_DATA[0];

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border border-steel/60 bg-steel-dark/95 rounded-2xl p-6 sm:p-8 space-y-3 relative overflow-hidden shadow-xl">
        <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold">
          <Heart size={15} /> 100% P&T Family & Sovereign Shield Suite
        </div>
        <div className="space-y-1 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-sand">
            100% P&T <span className="text-gold">Family Protections & Entitlements</span>
          </h2>
          <p className="text-sand/70 text-sm leading-relaxed font-sans">
            Reaching 100% Permanent & Total (P&T) disability changes your entire family's financial future: $1,536/month cash college stipends for every child and spouse (Chapter 35 DEA), 100% free comprehensive family health insurance (CHAMPVA), permanent federal student loan cancellation (TPD), and lifetime DIC survivor pensions.
          </p>
        </div>

        {/* Rating Alert */}
        <div className="pt-2 flex items-center gap-2 flex-wrap text-xs font-mono">
          <span className={`px-3 py-1 rounded-xl font-bold border ${
            is100Pt
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
          }`}>
            {is100Pt ? '🛡️ 100% P&T QUALIFIED (ALL FAMILY ENTITLEMENTS ACTIVE)' : `CURRENT RATING: ${currentRating}% (UNLOCKED AT 100% P&T / TDIU)`}
          </span>
        </div>
      </div>

      {/* Chapter 35 DEA Interactive Financial Calculator */}
      <div className="bg-steel/20 border border-steel/50 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="border-b border-steel/50 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-wider font-bold">
              <GraduationCap size={15} /> 38 U.S.C. Chapter 35 Educational Stipend Calculator
            </div>
            <h3 className="text-xl font-black text-sand uppercase mt-0.5">
              Chapter 35 DEA Dependent Cash Calculator
            </h3>
          </div>
          <span className="px-3 py-1 rounded-xl bg-gold/10 text-gold border border-gold/30 text-xs font-mono font-bold self-start sm:self-auto">
            $1,536 / Month Tax-Free per Dependent
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
          {/* Inputs (6 cols) */}
          <div className="lg:col-span-6 bg-steel-dark border border-steel/60 rounded-xl p-5 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sand/80 uppercase font-bold text-[11px]">
                  Number of Dependent Children (College / Trade School):
                </label>
                <span className="text-lg font-black text-gold">{numCollegeKids} Children</span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                step="1"
                value={numCollegeKids}
                onChange={(e) => setNumCollegeKids(parseInt(e.target.value))}
                className="w-full accent-gold cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-steel/30 border border-steel/50 flex items-center justify-between">
              <div>
                <span className="text-sand font-bold">Spouse Attending College / Trade School?</span>
                <div className="text-[10px] text-sand/50">Spouses receive up to 36 full months of $1,536/mo cash</div>
              </div>
              <button
                type="button"
                onClick={() => setSpouseInSchool(!spouseInSchool)}
                className={`px-3 py-1.5 rounded-xl font-bold font-mono text-xs transition-all ${
                  spouseInSchool ? 'bg-gold text-steel-dark' : 'bg-steel text-sand/60'
                }`}
              >
                {spouseInSchool ? 'YES (+1)' : 'NO (0)'}
              </button>
            </div>

            <div className="bg-steel/20 border border-steel/40 rounded-xl p-3 text-[11px] font-sans text-sand/70 leading-relaxed">
              💡 <strong>Direct Deposit:</strong> Chapter 35 payments are wired directly into each dependent's individual bank account each month and do <strong>not</strong> affect FAFSA Pell Grants or state scholarship eligibility.
            </div>
          </div>

          {/* Results (6 cols) */}
          <div className="lg:col-span-6 bg-steel-dark border border-gold/40 rounded-xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-gold uppercase font-bold">Total Family Cash Payout</span>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-steel/30 p-3 rounded-xl border border-steel/50 space-y-0.5">
                  <span className="text-[10px] text-sand/50 uppercase">Active Monthly Cash:</span>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400">
                    ${monthlyDeaTotal.toLocaleString()}<span className="text-xs text-sand/60">/mo</span>
                  </div>
                  <div className="text-[10px] text-sand/60">For {totalStudents} attending dependents</div>
                </div>

                <div className="bg-steel/30 p-3 rounded-xl border border-steel/50 space-y-0.5">
                  <span className="text-[10px] text-sand/50 uppercase">36-Month Lifetime Cap:</span>
                  <div className="text-xl sm:text-2xl font-black text-gold">
                    ${lifetimeDeaTotal.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-sand/60">100% Tax-Free Cash</div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3.5 flex items-center justify-between text-xs">
              <span className="text-sand font-bold font-sans">Per Dependent Maximum:</span>
              <span className="text-base font-black text-emerald-400 font-mono">$55,296.00 / child</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selector Tabs for Family Entitlements */}
      <div className="flex items-center gap-2 flex-wrap">
        {FAMILY_BENEFITS_DATA.map(item => (
          <button
            key={item.id}
            onClick={() => setSelectedBenefit(item.id)}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all border ${
              selectedBenefit === item.id
                ? 'bg-gold text-steel-dark border-gold shadow-md'
                : 'bg-steel/30 border-steel/60 text-sand/70 hover:text-sand hover:bg-steel/50'
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* Active Benefit Deep Dive Card */}
      <div className="bg-steel/20 border border-steel/50 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="border-b border-steel/50 pb-4 space-y-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-xl font-black uppercase text-sand">{activeBenefitData.title}</h3>
            <span className="text-xs font-mono text-gold font-bold px-2.5 py-1 rounded-lg bg-gold/10 border border-gold/30">
              {activeBenefitData.badge}
            </span>
          </div>
          <p className="text-xs font-mono text-sand/50">{activeBenefitData.governingStatute}</p>
          <p className="text-xs text-sand/80 pt-1 leading-relaxed font-sans">{activeBenefitData.summary}</p>
        </div>

        {/* Detailed Rules List */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-gold font-bold block">Key Statutory Criteria & Requirements:</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeBenefitData.rules.map((r, i) => (
              <div key={i} className="bg-steel-dark border border-steel/60 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-sand/80 font-sans leading-relaxed">
                <CheckCircle size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Tip Callout */}
        {activeBenefitData.proTip && (
          <div className="bg-steel-dark/90 border border-gold/40 rounded-xl p-4 text-xs font-sans text-sand/90 space-y-1">
            <strong className="text-gold font-mono uppercase text-[11px] block">Veteran Pro Tip:</strong>
            <p className="leading-relaxed">{activeBenefitData.proTip}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyBenefitsSuite;
