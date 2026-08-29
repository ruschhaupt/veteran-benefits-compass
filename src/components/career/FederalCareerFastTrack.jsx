import React, { useState } from 'react';
import { Briefcase, Building } from 'lucide-react';

export const FederalCareerFastTrack = ({ currentRating = 70, yearsOfService = 4 }) => {
  // Military Buy-Back Calculator state
  const [militaryYears, setMilitaryYears] = useState(yearsOfService);
  const [totalBasicPayEarned, setTotalBasicPayEarned] = useState(140000); // Approximate 4-year active duty basic pay
  const [targetGsSalary, setTargetGsSalary] = useState(95000); // Target GS-12/13 salary

  // Military buy-back deposit is exactly 3.0% of military basic pay for post-1956 active service
  const buyBackCost = totalBasicPayEarned * 0.03;
  
  // Annual FERS pension boost: 1.0% per year of service x high-3 average salary
  const annualPensionBoost = targetGsSalary * (militaryYears * 0.01);
  const breakEvenMonths = annualPensionBoost > 0 ? Math.ceil((buyBackCost / annualPensionBoost) * 12) : 0;

  const isCPSQualified = currentRating >= 30;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-steel/40 via-steel-dark to-steel-dark border border-gold/40 rounded-3xl p-6 sm:p-8 space-y-3 relative overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold">
          <Briefcase size={15} /> Federal GS Career & SDVOSB Contracting Suite
        </div>
        <div className="space-y-1 max-w-3xl">
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-sand">
            Federal Career <span className="text-gold">Fast-Track & FERS Buyback</span>
          </h2>
          <p className="text-sand/70 text-sm leading-relaxed font-sans">
            Leverage your military service for non-competitive direct federal hiring (Schedule A / 30% disabled authority), buy back your military time to boost your FERS federal retirement pension, and compete for $47B in federal SDVOSB set-aside contracts.
          </p>
        </div>
      </div>

      {/* Grid: 10-Point Preference & Hiring Authorities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Direct Hiring Authorities (6 cols) */}
        <div className="lg:col-span-6 bg-steel/20 border border-steel/50 rounded-3xl p-6 space-y-5">
          <div className="border-b border-steel/50 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-mono uppercase text-gold font-bold">1. Federal Hiring Preference Tiers</h3>
            <span className="text-xs font-mono text-sand/60">5 CFR § 315.707</span>
          </div>

          <div className="space-y-3">
            {/* CPS Authority Box */}
            <div className={`p-4 rounded-2xl border space-y-2 ${
              isCPSQualified
                ? 'bg-gold/10 border-gold shadow-lg'
                : 'bg-steel-dark border-steel/60'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-sand">
                  10-Point 30% Compensable Disability (CPS)
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  isCPSQualified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-steel text-sand/50'
                }`}>
                  {isCPSQualified ? '✅ UNLOCKED (30%+ RATED)' : 'NEEDS 30%+ RATING'}
                </span>
              </div>
              <p className="text-xs text-sand/80 font-sans leading-relaxed">
                Allows federal hiring managers (DoD, VA, FBI, Homeland Security, FAA) to hire you <strong>directly and non-competitively</strong> without going through the public USAJOBS announcement queue.
              </p>
            </div>

            {/* VRA Box */}
            <div className="p-4 rounded-2xl bg-steel-dark border border-steel/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-sand">
                  Veterans Recruitment Appointment (VRA)
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-sand/80 font-sans leading-relaxed">
                Appoint qualified wartime or campaign-badge veterans up to <strong>GS-11 grade</strong> non-competitively, converting to permanent career federal status after 2 years.
              </p>
            </div>

            {/* VEOA Box */}
            <div className="p-4 rounded-2xl bg-steel-dark border border-steel/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-sand">
                  Veterans Employment Opportunities Act (VEOA)
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-sand/80 font-sans leading-relaxed">
                Allows veterans to apply to "status" merit promotion jobs that are normally only open to internal federal employees.
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Military Service Buy-Back Calculator (6 cols) */}
        <div className="lg:col-span-6 bg-steel-dark border border-gold/40 rounded-3xl p-6 space-y-5 shadow-xl">
          <div className="border-b border-steel/50 pb-3">
            <span className="text-[10px] font-mono text-gold uppercase font-bold">Military FERS Pension Buy-Back Engine</span>
            <h3 className="text-lg font-black text-sand uppercase mt-0.5">
              Turn Military Active Duty into Federal Pension Years
            </h3>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div>
              <label className="text-sand/80 uppercase font-bold text-[11px] block mb-1">
                Military Active Duty Years: {militaryYears} Years
              </label>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={militaryYears}
                onChange={(e) => setMilitaryYears(parseInt(e.target.value))}
                className="w-full accent-gold cursor-pointer"
              />
            </div>

            <div>
              <label className="text-sand/80 uppercase font-bold text-[11px] block mb-1">
                Estimated Military Basic Pay Over Service ($):
              </label>
              <input
                type="number"
                step="5000"
                value={totalBasicPayEarned}
                onChange={(e) => setTotalBasicPayEarned(parseInt(e.target.value) || 0)}
                className="w-full bg-steel border border-steel/60 rounded-xl p-2.5 text-sand font-mono focus:outline-none focus:border-gold"
              />
              <span className="text-[10px] text-sand/50 font-sans block mt-1">
                From military DFAS estimated earnings statement.
              </span>
            </div>

            <div>
              <label className="text-sand/80 uppercase font-bold text-[11px] block mb-1">
                Target High-3 Federal GS Salary ($):
              </label>
              <input
                type="number"
                step="5000"
                value={targetGsSalary}
                onChange={(e) => setTargetGsSalary(parseInt(e.target.value) || 0)}
                className="w-full bg-steel border border-steel/60 rounded-xl p-2.5 text-sand font-mono focus:outline-none focus:border-gold"
              />
            </div>

            {/* Calculations Result Box */}
            <div className="bg-steel/30 border border-steel/50 rounded-2xl p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-sand/50 uppercase block">One-Time Buy-Back Cost (3%):</span>
                  <span className="text-lg font-black text-sand font-mono">${Math.round(buyBackCost).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-sand/50 uppercase block">Annual FERS Pension Increase:</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">+${Math.round(annualPensionBoost).toLocaleString()}/yr</span>
                </div>
              </div>

              <div className="pt-2 border-t border-steel/40 flex justify-between items-center text-xs">
                <span>Break-Even Recoupment Clock:</span>
                <strong className="text-gold font-mono">{breakEvenMonths} Months into Retirement</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: SDVOSB Contracting Suite */}
      <div className="bg-steel/20 border border-steel/50 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="border-b border-steel/50 pb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-wider font-bold">
              <Building size={14} /> Service-Disabled Veteran-Owned Small Business (SDVOSB)
            </div>
            <h3 className="text-xl font-black text-sand uppercase mt-0.5">
              Federal Contracting & Sole-Source Set-Asides ($47 Billion/Yr)
            </h3>
          </div>
          <span className="px-3 py-1 rounded-xl bg-gold/10 text-gold border border-gold/30 text-xs font-mono font-bold">
            SBA VetCert Certified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
          <div className="bg-steel-dark border border-steel/60 rounded-2xl p-4 space-y-2">
            <h4 className="font-bold text-sand font-mono uppercase text-[11px] text-gold">
              1. 5% Federal Statutory Goal
            </h4>
            <p className="text-sand/70 leading-relaxed">
              Federal law mandates that at least 5% of all federal prime contracts and subcontracts must be awarded to certified SDVOSBs.
            </p>
          </div>

          <div className="bg-steel-dark border border-steel/60 rounded-2xl p-4 space-y-2">
            <h4 className="font-bold text-sand font-mono uppercase text-[11px] text-gold">
              2. Sole-Source Awards Up to $5M
            </h4>
            <p className="text-sand/70 leading-relaxed">
              Federal contracting officers can award contracts up to $5,000,000 directly to your SDVOSB without full and open public competition.
            </p>
          </div>

          <div className="bg-steel-dark border border-steel/60 rounded-2xl p-4 space-y-2">
            <h4 className="font-bold text-sand font-mono uppercase text-[11px] text-gold">
              3. SBA VetCert Fast-Track
            </h4>
            <p className="text-sand/70 leading-relaxed">
              Requires 51% ownership and control by a service-disabled veteran (0%+ rating qualifies). Self-certification through veterans.certify.sba.gov.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FederalCareerFastTrack;
