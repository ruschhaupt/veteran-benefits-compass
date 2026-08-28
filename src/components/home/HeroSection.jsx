import React from 'react';
import { ArrowRight, Zap, Calculator, Calendar } from 'lucide-react';
import { getVaMonthlyComp } from '../../data/vaPayTable';

export const HeroSection = ({
  currentRating = 70,
  onRatingChange,
  onLaunchTimeline,
  onLaunchCalculator,
  branchSlang = 'Veteran'
}) => {
  const monthlyCash = getVaMonthlyComp(currentRating, 'single');
  const annualCash = monthlyCash * 12;

  // Unclaimed gap to 100%
  const maxMonthly = getVaMonthlyComp(100, 'single');
  const monthlyGap = Math.max(0, maxMonthly - monthlyCash);
  const annualGap = monthlyGap * 12;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-steel/40 via-steel-dark to-steel-dark border border-gold/40 p-6 sm:p-10 shadow-2xl space-y-8">
      {/* Background Subtle Radial Accent */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Tactical Trust Badge */}
      <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>38 CFR § 4.71a Verified • Updated for 2024–2026 COLA</span>
      </div>

      {/* Option C Hero Headline */}
      <div className="space-y-3 max-w-4xl">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-sand leading-none">
          Veteran Benefits Calculator.<br />
          <span className="text-gold">No Sign-Up. No BS. Free.</span>
        </h1>
        <p className="text-sand/80 text-base sm:text-lg max-w-2xl leading-relaxed font-sans">
          Enter your rating. Get your exact monthly number. Find out what state tax shields, secondary claims, and statutory deadlines you are missing right now.
        </p>
      </div>

      {/* Fast-Track Interactive Rating Wheel & Instant Number Display */}
      <div className="bg-steel/30 border border-steel/60 rounded-2xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-steel/50 pb-4">
          <div>
            <label className="text-xs font-mono uppercase text-gold font-bold flex items-center gap-1.5">
              <Calculator size={14} /> Slide to Your Current Disability Rating:
            </label>
            <div className="text-2xl sm:text-3xl font-black text-sand mt-0.5">
              {currentRating}% <span className="text-sm font-mono text-sand/60 font-normal">Service-Connected</span>
            </div>
          </div>

          {/* Quick Click Rating Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[0, 10, 30, 50, 70, 80, 90, 100].map(r => (
              <button
                key={r}
                onClick={() => onRatingChange && onRatingChange(r)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all border ${
                  currentRating === r
                    ? 'bg-gold text-steel-dark border-gold shadow-md'
                    : 'bg-steel-dark/60 border-steel/50 text-sand/70 hover:text-sand hover:border-gold/50'
                }`}
              >
                {r}%
              </button>
            ))}
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            step="10"
            value={currentRating}
            onChange={(e) => onRatingChange && onRatingChange(Number(e.target.value))}
            className="w-full h-2 bg-steel-dark rounded-lg appearance-none cursor-pointer accent-gold"
          />
          <div className="flex justify-between text-[10px] font-mono text-sand/50">
            <span>0% (Not Rated)</span>
            <span>50%</span>
            <span>70% (TDIU Threshold)</span>
            <span>100% P&T</span>
          </div>
        </div>

        {/* Instant Value Readout Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Active Monthly Compensation */}
          <div className="bg-steel-dark/80 border border-steel/60 rounded-xl p-4 space-y-1">
            <span className="text-[10px] font-mono uppercase text-sand/50">Active Monthly Comp</span>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              ${monthlyCash.toLocaleString()}<span className="text-xs text-sand/60">/mo</span>
            </div>
            <div className="text-[11px] font-mono text-sand/60">
              ${annualCash.toLocaleString()}/yr 100% Tax-Free
            </div>
          </div>

          {/* Unclaimed Gap */}
          <div className="bg-steel-dark/80 border border-steel/60 rounded-xl p-4 space-y-1">
            <span className="text-[10px] font-mono uppercase text-sand/50">Identified Unclaimed Gap</span>
            <div className="text-2xl font-black text-gold font-mono">
              +${monthlyGap.toLocaleString()}<span className="text-xs text-sand/60">/mo</span>
            </div>
            <div className="text-[11px] font-mono text-sand/60">
              +${annualGap.toLocaleString()}/yr Available
            </div>
          </div>

          {/* Key State Shield */}
          <div className="bg-steel-dark/80 border border-steel/60 rounded-xl p-4 space-y-1">
            <span className="text-[10px] font-mono uppercase text-sand/50">Property Tax Shield</span>
            <div className="text-xl sm:text-2xl font-black text-sand font-mono">
              {currentRating >= 100 ? '$0 Property Tax' : 'Up to $12k/yr Saved'}
            </div>
            <div className="text-[11px] font-mono text-sand/60">
              {currentRating >= 100 ? 'State 100% P&T Exemption' : 'Unlocked at 100% P&T'}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={onLaunchTimeline}
          className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-gold hover:bg-yellow-600 text-steel-dark font-black font-mono text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-gold/10 group"
        >
          <Calendar size={18} />
          <span>Launch "Your Life in Months" Timeline</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={onLaunchCalculator}
          className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-steel-dark border border-steel/60 hover:border-gold text-sand font-mono text-sm uppercase font-bold flex items-center justify-center gap-2 transition-all"
        >
          <Zap size={16} className="text-gold" />
          <span>Explore 100% Math & Secondary Matrix</span>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
