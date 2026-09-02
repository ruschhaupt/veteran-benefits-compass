import React from 'react';
import { ArrowRight, Calculator, Calendar } from 'lucide-react';
import { getVaMonthlyComp } from '../../data/vaPayTable';
import { SERVICE_PERSONAS } from '../../data/serviceTypes';

export const HeroSection = ({
  currentRating = 70,
  onRatingChange,
  onLaunchTimeline,
  onLaunchCalculator,
  selectedServicePersona = 'enlisted_4yr',
  onSelectServicePersona,
  branchSlang = 'Veteran'
}) => {
  const monthlyCash = getVaMonthlyComp(currentRating, 'single');
  const annualCash = monthlyCash * 12;

  // Unclaimed gap to 100%
  const maxMonthly = getVaMonthlyComp(100, 'single');
  const monthlyGap = Math.max(0, maxMonthly - monthlyCash);
  const annualGap = monthlyGap * 12;

  return (
    <section className="relative overflow-hidden rounded-2xl bg-steel-dark/95 border border-steel/60 p-6 sm:p-8 shadow-xl space-y-6">
      {/* Top Trust & Statute Strip */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono border-b border-steel/50 pb-3">
        <div className="flex items-center gap-2 text-gold font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>38 CFR § 4.71a Official Rates • 2024–2026 COLA Updated</span>
        </div>
        <div className="text-sand/50 text-[11px]">
          100% Client-Side • Zero Data Stored • Free & Open
        </div>
      </div>

      {/* Main Headline & Subtitle */}
      <div className="space-y-2 max-w-3xl">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-sand leading-tight">
          Every Veteran Benefit & Statute.<br />
          <span className="text-gold">Calculated For Your Actual Service.</span>
        </h1>
        <p className="text-sand/80 text-sm sm:text-base leading-relaxed font-sans">
          Whether you completed 4 years, multiple combat tours, a 20-year career, or weekend drills in the Guard/Reserve, enter your numbers below to instantly calculate your tax-free disability pay, state tax exemptions, and statutory windows.
        </p>
      </div>

      {/* Service Persona Interactive Selector */}
      <div className="space-y-2 pt-1">
        <span className="text-[11px] font-mono uppercase text-gold font-bold block">
          Select Your Service Profile:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SERVICE_PERSONAS.map((persona) => {
            const isSelected = selectedServicePersona === persona.id;
            return (
              <button
                key={persona.id}
                type="button"
                onClick={() => onSelectServicePersona && onSelectServicePersona(persona.id)}
                className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
                  isSelected
                    ? 'bg-gold/15 border-gold shadow-md text-sand'
                    : 'bg-steel/30 border-steel/50 text-sand/70 hover:text-sand hover:bg-steel/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs font-mono">{persona.title}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    isSelected ? 'bg-gold text-steel-dark font-black' : 'bg-steel text-sand/50'
                  }`}>
                    {persona.badge}
                  </span>
                </div>
                <div className="text-[10px] text-sand/50 font-sans truncate">{persona.rankExample}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Rating Wheel & Instant Number Display */}
      <div className="bg-steel/20 border border-steel/50 rounded-xl p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-steel/40 pb-4">
          <div>
            <label className="text-xs font-mono uppercase text-gold font-bold flex items-center gap-1.5">
              <Calculator size={14} /> Slide or Select Your Current Disability Rating:
            </label>
            <div className="text-2xl sm:text-3xl font-black text-sand mt-0.5 font-mono">
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
                    ? 'bg-gold text-steel-dark border-gold shadow-sm font-black'
                    : 'bg-steel-dark/60 border-steel/50 text-sand/70 hover:text-sand hover:border-gold/50'
                }`}
              >
                {r}%
              </button>
            ))}
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-1.5">
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
            <span>30% (CPS / VEOA)</span>
            <span>50% (CRDP Floor)</span>
            <span>70% (TDIU Threshold)</span>
            <span>100% P&T (Sovereign)</span>
          </div>
        </div>

        {/* Instant Value Readout Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Active Monthly Compensation */}
          <div className="bg-steel-dark/90 border border-steel/60 rounded-xl p-4 space-y-1">
            <span className="text-[10px] font-mono uppercase text-sand/50">Tax-Free Monthly Pay</span>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              ${monthlyCash.toLocaleString()}<span className="text-xs text-sand/60">/mo</span>
            </div>
            <div className="text-[11px] font-mono text-sand/60">
              ${annualCash.toLocaleString()}/yr 100% Tax-Free
            </div>
          </div>

          {/* Unclaimed Gap */}
          <div className="bg-steel-dark/90 border border-steel/60 rounded-xl p-4 space-y-1">
            <span className="text-[10px] font-mono uppercase text-sand/50">Unclaimed 100% Gap</span>
            <div className="text-2xl font-black text-gold font-mono">
              +${monthlyGap.toLocaleString()}<span className="text-xs text-sand/60">/mo</span>
            </div>
            <div className="text-[11px] font-mono text-sand/60">
              +${annualGap.toLocaleString()}/yr Potential Gap
            </div>
          </div>

          {/* Key State Shield */}
          <div className="bg-steel-dark/90 border border-steel/60 rounded-xl p-4 space-y-1">
            <span className="text-[10px] font-mono uppercase text-sand/50">State Property Shield</span>
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
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
        <button
          onClick={onLaunchTimeline}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gold hover:bg-yellow-600 text-steel-dark font-black font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
        >
          <Calendar size={16} />
          <span>Launch Mission Timeline Clocks</span>
          <ArrowRight size={14} />
        </button>

        <button
          onClick={onLaunchCalculator}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-steel-dark border border-steel/60 hover:border-gold text-sand font-mono text-xs uppercase font-bold flex items-center justify-center gap-2 transition-all"
        >
          <Calculator size={16} className="text-gold" />
          <span>38 CFR § 4.25 VA Math & Secondaries</span>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
