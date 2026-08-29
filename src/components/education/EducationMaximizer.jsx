import React, { useState } from 'react';
import {
  GraduationCap, CheckCircle, Sparkles
} from 'lucide-react';
import { EDUCATION_PROGRAMS } from '../../data/educationData';

export const EducationMaximizer = ({ currentRating = 70 }) => {
  const [degreeLevel, setDegreeLevel] = useState('bachelors');
  const [hasGiBillMonths, setHasGiBillMonths] = useState(36);
  const [schoolZipBah, setSchoolZipBah] = useState(2400);

  const totalMhaEst = schoolZipBah * 36;
  const tuitionValueEst = 28000 * 4; // 4-year tuition value
  const totalValuePost911 = totalMhaEst + tuitionValueEst + 4000;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-steel/40 via-steel-dark to-steel-dark border border-gold/40 rounded-3xl p-6 sm:p-8 space-y-3 relative overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold">
          <GraduationCap size={15} /> Higher Education & GI Bill Stacking Engine
        </div>
        <div className="space-y-1 max-w-3xl">
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-sand">
            The <span className="text-gold">48-Month + VR&E</span> Stacking Protocol
          </h2>
          <p className="text-sand/70 text-sm leading-relaxed font-sans">
            Never waste your 36 months of Post-9/11 GI Bill on an undergraduate degree if you have a service-connected disability. Learn how to stack VR&E (Chapter 31) + Post-9/11 GI Bill (Chapter 33) + State Waivers for up to 72+ months of 100% paid tuition, books, laptops, and tax-free housing allowance.
          </p>
        </div>
      </div>

      {/* Simulator Inputs & ROI Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Education Scenario Inputs (6 cols) */}
        <div className="lg:col-span-6 bg-steel/20 border border-steel/50 rounded-3xl p-6 space-y-5">
          <div className="border-b border-steel/50 pb-3">
            <h3 className="text-sm font-mono uppercase text-gold font-bold">1. Educational Strategy Parameters</h3>
            <p className="text-xs text-sand/60">Configure your target school location and remaining GI Bill months.</p>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-sand/80 mb-1.5 uppercase font-bold text-[11px]">
                Target Degree Objective:
              </label>
              <select
                value={degreeLevel}
                onChange={(e) => setDegreeLevel(e.target.value)}
                className="w-full bg-steel-dark border border-steel/60 rounded-xl p-3 text-sand focus:outline-none focus:border-gold"
              >
                <option value="associates">Associate's Degree / Trade School</option>
                <option value="bachelors">Bachelor's Degree (4 Years)</option>
                <option value="masters">Master's Degree / MBA (2 Years)</option>
                <option value="law_med">Law School (JD) / Medical School (MD)</option>
              </select>
            </div>

            <div>
              <label className="block text-sand/80 mb-1.5 uppercase font-bold text-[11px]">
                Remaining Post-9/11 GI Bill Months: {hasGiBillMonths} Months
              </label>
              <input
                type="range"
                min="0"
                max="36"
                step="1"
                value={hasGiBillMonths}
                onChange={(e) => setHasGiBillMonths(parseInt(e.target.value))}
                className="w-full accent-gold cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-sand/50 mt-1">
                <span>0 Months (Used)</span>
                <span>18 Months (Half)</span>
                <span>36 Months (Full)</span>
              </div>
            </div>

            <div>
              <label className="block text-sand/80 mb-1.5 uppercase font-bold text-[11px]">
                Estimated Monthly Housing Allowance (E-5 with Dependents BAH for School Zip):
              </label>
              <div className="flex items-center gap-3">
                <span className="text-lg font-black text-emerald-400 font-mono">${schoolZipBah.toLocaleString()}/mo</span>
                <input
                  type="range"
                  min="1200"
                  max="4500"
                  step="50"
                  value={schoolZipBah}
                  onChange={(e) => setSchoolZipBah(parseInt(e.target.value))}
                  className="flex-1 accent-gold cursor-pointer"
                />
              </div>
              <span className="text-[10px] text-sand/50 font-sans block mt-1">
                Based on in-person attendance at your school campus location.
              </span>
            </div>

            {/* Disability Rating Check for VR&E */}
            <div className="p-3.5 rounded-2xl bg-steel-dark/80 border border-steel/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-gold font-bold text-[11px] uppercase">VR&E Eligibility Check:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                  {currentRating >= 10 ? 'QUALIFIED (Rating ≥ 10%)' : 'NEEDS 10%+ RATING'}
                </span>
              </div>
              <p className="text-[11px] text-sand/70 font-sans leading-relaxed">
                {currentRating >= 10
                  ? 'Because your VA rating is 10%+, you legally qualify to apply for VR&E (Chapter 31) employment services and full degree sponsorship.'
                  : 'File a service-connected claim to unlock VR&E eligibility.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Estimated Education Package Value (6 cols) */}
        <div className="lg:col-span-6 bg-steel-dark border border-gold/40 rounded-3xl p-6 space-y-5 shadow-xl">
          <div className="border-b border-steel/50 pb-3">
            <span className="text-[10px] font-mono text-gold uppercase font-bold">Total Educational Capital Unlocked</span>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono mt-1">
              ${totalValuePost911.toLocaleString()}
            </div>
            <span className="text-xs text-sand/60 font-mono">100% Tax-Free Tuition + MHA + Book Stipends</span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono">
            <div className="bg-steel/30 border border-steel/50 rounded-xl p-3 space-y-0.5">
              <span className="text-[10px] text-sand/50 uppercase">Total Housing Cash (MHA)</span>
              <div className="text-lg font-black text-sand">${totalMhaEst.toLocaleString()}</div>
              <div className="text-[10px] text-emerald-400">Directly into your bank account</div>
            </div>

            <div className="bg-steel/30 border border-steel/50 rounded-xl p-3 space-y-0.5">
              <span className="text-[10px] text-sand/50 uppercase">Tuition & Fees Paid</span>
              <div className="text-lg font-black text-sand">${tuitionValueEst.toLocaleString()}</div>
              <div className="text-[10px] text-gold">Paid directly to university</div>
            </div>
          </div>

          {/* Golden Stacking Blueprint Callout */}
          <div className="bg-steel/20 border border-gold/40 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase font-bold">
              <Sparkles size={14} /> The Master 72-Month Degree Blueprint:
            </div>
            <div className="space-y-1.5 text-xs text-sand/80 font-sans">
              <div className="flex items-start gap-2">
                <span className="text-gold font-mono font-bold">Step 1:</span>
                <span>Use <strong>VR&E (Chapter 31)</strong> for Undergrad (48 months covered + Post-9/11 BAH rate + free laptop).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gold font-mono font-bold">Step 2:</span>
                <span>Use your untouched <strong>36 months of Post-9/11 GI Bill</strong> for Master's, MBA, or Law School.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gold font-mono font-bold">Step 3:</span>
                <span>Pass remaining state tuition exemptions (e.g. Texas Hazlewood) to your kids for $0 college.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Program Deep Dive Cards */}
      <div className="space-y-4">
        <h3 className="text-xl font-black uppercase text-sand">Educational Strategic Programs</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EDUCATION_PROGRAMS.map(prog => (
            <div
              key={prog.id}
              className="bg-steel/20 border border-steel/50 rounded-2xl p-5 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-gold/10 text-gold border border-gold/30 text-[10px] font-mono font-bold">
                    {prog.tag}
                  </span>
                  <span className="text-[10px] font-mono text-sand/50">{prog.statute}</span>
                </div>
                <h4 className="font-bold text-sm text-sand leading-snug">{prog.name}</h4>
                <div className="text-xs font-mono text-emerald-400 font-bold">{prog.value}</div>
                <p className="text-xs text-sand/70 leading-relaxed font-sans">{prog.summary}</p>
                
                <div className="space-y-1 pt-2 border-t border-steel/40">
                  <span className="text-[10px] font-mono uppercase text-gold font-bold block">Key Rules:</span>
                  <ul className="space-y-1 text-[11px] text-sand/80 font-sans">
                    {prog.rules.slice(0, 3).map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle size={11} className="text-gold flex-shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-steel/40 text-[11px] font-sans text-gold/90 bg-gold/5 p-2.5 rounded-xl">
                <strong>Pro-Tip:</strong> {prog.proTip}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationMaximizer;
