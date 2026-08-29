import React, { useState } from 'react';
import {
  GraduationCap, CheckCircle, FileText, Copy, Check
} from 'lucide-react';
import { VRE_TRACKS, VRE_COUNSELOR_SCRIPT_GUIDE, VRE_FAQS } from '../../data/vreData';

export const VocRehabCommandCenter = ({ currentRating = 70 }) => {
  const [selectedTrack, setSelectedTrack] = useState('long_term');
  const [targetCareer, setTargetCareer] = useState('Cybersecurity / Software Engineer');
  const [currentDisabilities, setCurrentDisabilities] = useState('Lumbar spine strain & PTSD');
  const [schoolZipBah, setSchoolZipBah] = useState(2500); // E-5 BAH approx
  const [monthsNeeded, setMonthsNeeded] = useState(36);
  const [hasGiBillDay, setHasGiBillDay] = useState(true);
  const [copiedScript, setCopiedScript] = useState(false);

  const isEligible = currentRating >= 10;
  
  // Subsistence Calculations
  // P-54 rate = full E-5 with dependents BAH
  // Standard Chapter 31 rate ~ $850/mo
  const monthlySubsistence = hasGiBillDay ? schoolZipBah : 850;
  const totalSubsistenceCash = monthlySubsistence * monthsNeeded;
  const estimatedTuitionValue = 30000 * (monthsNeeded / 9); // ~$30k/yr
  const techPackageValue = 3500; // MacBook Pro / PC, dual monitors, desk, printer
  const bookSuppliesValue = 1500 * (monthsNeeded / 9);
  const eaaPostGradBonus = monthlySubsistence * 2; // 2 months of EAA post-graduation

  const totalPackageValue = Math.round(
    totalSubsistenceCash + estimatedTuitionValue + techPackageValue + bookSuppliesValue + eaaPostGradBonus
  );

  const generatedScript = `MEMBER TALKING POINTS FOR VR&E (VA FORM 28-1900) INTAKE:
----------------------------------------------------------------------
1. PRIMARY STATEMENT OF EMPLOYMENT HANDICAP:
"My service-connected conditions (${currentDisabilities}) significantly impair my ability to continue in my current field of work due to physical strain and symptom flare-ups (38 CFR § 21.51). Labor market analysis demonstrates that retraining into ${targetCareer} provides a sustainable, sedentary, and viable long-term career that will not aggravate my service-connected disabilities."

2. FEASIBILITY & LABOR MARKET JUSTIFICATION:
"I have reviewed current labor market demand and regional employer job postings. Every target employer in ${targetCareer} mandates a formal degree / credential. This specific program under Track 1 (Employment Through Long-Term Services, 38 CFR § 21.120) is the direct prerequisite to achieve suitable employment."

3. HOUSING ELECTION (P-54 RATE):
"I hold remaining Post-9/11 GI Bill (Chapter 33) entitlement and hereby elect the P-54 Post-9/11 subsistence allowance rate under 38 U.S.C. § 3108(b) on VA Form 28-0988."

4. RETROACTIVE INDUCTION INTENT:
"I also request a formal evaluation for Retroactive Induction under M28C for any prior semesters completed while service-connected to restore my Chapter 33 entitlement."`;

  const copyScriptToClipboard = () => {
    navigator.clipboard.writeText(generatedScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const activeTrackData = VRE_TRACKS.find(t => t.id === selectedTrack) || VRE_TRACKS[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-steel/40 via-steel-dark to-steel-dark border border-gold/40 rounded-3xl p-6 sm:p-8 space-y-3 relative overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold">
          <GraduationCap size={15} /> Chapter 31 Veteran Readiness & Employment (VR&E)
        </div>
        <div className="space-y-1 max-w-3xl">
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-sand">
            Voc Rehab <span className="text-gold">Command Center & Master 5-Track Suite</span>
          </h2>
          <p className="text-sand/70 text-sm leading-relaxed font-sans">
            VR&E is the VA's ultimate employment and higher-education program: 100% uncapped tuition (Law School, Med School, MBA, Undergrad), free laptops and dual monitors, full E-5 BAH housing pay, startup business funding, and <strong>zero depletion of your 36-month Post-9/11 GI Bill</strong>.
          </p>
        </div>

        {/* Quick Eligibility Badge */}
        <div className="pt-2 flex items-center gap-3 flex-wrap">
          <span className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border ${
            isEligible
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
          }`}>
            {isEligible ? `✅ RATING: ${currentRating}% (ELIGIBLE FOR CHAPTER 31)` : 'NEEDS 10%+ SERVICE-CONNECTED RATING'}
          </span>
          <span className="text-xs font-mono text-sand/60">
            Governing Statute: 38 U.S.C. Chapter 31 | 38 CFR Part 21
          </span>
        </div>
      </div>

      {/* Section 1: Financial & Degree Package Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Calculator Inputs (6 cols) */}
        <div className="lg:col-span-6 bg-steel/20 border border-steel/50 rounded-3xl p-6 space-y-5">
          <div className="border-b border-steel/50 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-mono uppercase text-gold font-bold">
              1. VR&E Financial & Package Calculator
            </h3>
            <span className="text-xs font-mono text-sand/60">P-54 Rate Engine</span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sand/80 uppercase font-bold text-[11px]">
                  Estimated E-5 with Dependents BAH (School Zip):
                </label>
                <span className="text-lg font-black text-emerald-400">${schoolZipBah.toLocaleString()}/mo</span>
              </div>
              <input
                type="range"
                min="1200"
                max="4500"
                step="50"
                value={schoolZipBah}
                onChange={(e) => setSchoolZipBah(parseInt(e.target.value))}
                className="w-full accent-gold cursor-pointer"
              />
              <span className="text-[10px] text-sand/50 block font-sans mt-0.5">
                Paid tax-free directly to your personal bank account every month.
              </span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sand/80 uppercase font-bold text-[11px]">
                  Months of Training Needed: {monthsNeeded} Months
                </label>
                <span className="text-sm font-bold text-sand">{Math.round(monthsNeeded / 9 * 10) / 10} Academic Years</span>
              </div>
              <input
                type="range"
                min="9"
                max="48"
                step="3"
                value={monthsNeeded}
                onChange={(e) => setMonthsNeeded(parseInt(e.target.value))}
                className="w-full accent-gold cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-steel-dark border border-steel/60 flex items-center justify-between">
              <div>
                <div className="font-bold text-sand text-[11px]">Do you have at least 1 day of Post-9/11 GI Bill?</div>
                <div className="text-[10px] text-sand/60 font-sans">Unlocks the P-54 E-5 BAH housing rate</div>
              </div>
              <button
                type="button"
                onClick={() => setHasGiBillDay(!hasGiBillDay)}
                className={`px-3 py-1.5 rounded-xl font-bold font-mono text-xs transition-all ${
                  hasGiBillDay ? 'bg-gold text-steel-dark font-black' : 'bg-steel text-sand/60'
                }`}
              >
                {hasGiBillDay ? 'YES (P-54 Rate)' : 'NO (Std Rate)'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Total Package Value Breakdown (6 cols) */}
        <div className="lg:col-span-6 bg-steel-dark border border-gold/40 rounded-3xl p-6 space-y-5 shadow-xl">
          <div className="border-b border-steel/50 pb-3">
            <span className="text-[10px] font-mono text-gold uppercase font-bold">Total Financial Capital Transferred</span>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono mt-1">
              ${totalPackageValue.toLocaleString()}
            </div>
            <span className="text-xs text-sand/60 font-mono">100% Tax-Free • Zero Debt • 100% Preserved GI Bill</span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="bg-steel/30 p-3 rounded-xl border border-steel/50 space-y-0.5">
              <span className="text-[10px] text-sand/50 uppercase">Housing Cash (MHA):</span>
              <div className="text-base font-black text-sand">${totalSubsistenceCash.toLocaleString()}</div>
              <div className="text-[10px] text-emerald-400">${monthlySubsistence}/mo tax-free</div>
            </div>

            <div className="bg-steel/30 p-3 rounded-xl border border-steel/50 space-y-0.5">
              <span className="text-[10px] text-sand/50 uppercase">100% Tuition Paid:</span>
              <div className="text-base font-black text-sand">${Math.round(estimatedTuitionValue).toLocaleString()}</div>
              <div className="text-[10px] text-gold">Zero dollar cap</div>
            </div>

            <div className="bg-steel/30 p-3 rounded-xl border border-steel/50 space-y-0.5">
              <span className="text-[10px] text-sand/50 uppercase">Free Laptop & Tech:</span>
              <div className="text-base font-black text-sand">${techPackageValue.toLocaleString()}</div>
              <div className="text-[10px] text-sand/60">MacBook / PC + dual monitors</div>
            </div>

            <div className="bg-steel/30 p-3 rounded-xl border border-steel/50 space-y-0.5">
              <span className="text-[10px] text-sand/50 uppercase">Post-Grad Bonus (EAA):</span>
              <div className="text-base font-black text-sand">${eaaPostGradBonus.toLocaleString()}</div>
              <div className="text-[10px] text-emerald-400">2 Extra Months BAH</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: The 5 Official VR&E Tracks Explorer */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-xl font-black uppercase text-sand">The 5 Official VR&E Tracks (38 CFR § 21.40)</h3>
            <p className="text-xs text-sand/60">Select a track to inspect statutory entitlements and coverage details.</p>
          </div>
        </div>

        {/* Track Selector Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {VRE_TRACKS.map(track => (
            <button
              key={track.id}
              onClick={() => setSelectedTrack(track.id)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-2xl font-mono text-xs font-bold transition-all border text-left ${
                selectedTrack === track.id
                  ? 'bg-gold text-steel-dark border-gold shadow-lg shadow-gold/10'
                  : 'bg-steel/30 border-steel/60 text-sand/80 hover:text-sand hover:bg-steel/50'
              }`}
            >
              <div className="text-[10px] uppercase opacity-75">{track.number}</div>
              <div>{track.name.split('(')[0]}</div>
            </button>
          ))}
        </div>

        {/* Active Track Deep Dive Card */}
        <div className="bg-steel/20 border border-steel/50 rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="border-b border-steel/50 pb-4 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className={`px-3 py-0.5 rounded-xl text-xs font-mono font-bold border ${activeTrackData.tagColor}`}>
                {activeTrackData.tag}
              </span>
              <span className="text-xs font-mono text-sand/50">{activeTrackData.statute}</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-sand uppercase">
              {activeTrackData.name}
            </h4>
            <p className="text-xs text-sand/80 font-sans leading-relaxed">
              {activeTrackData.summary}
            </p>
          </div>

          {/* What is covered grid */}
          <div className="space-y-3 font-sans">
            <span className="text-xs font-mono text-gold font-bold uppercase block">
              100% Mandatory Entitlements & Paid Items:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeTrackData.whatIsCovered.map((item, idx) => (
                <div key={idx} className="bg-steel-dark/80 border border-steel/60 rounded-xl p-3 flex items-start gap-2.5 text-xs text-sand/80">
                  <CheckCircle size={14} className="text-gold flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-steel/30 border border-steel/50 rounded-2xl p-4 text-xs font-sans text-sand/80">
            <strong className="text-gold font-mono block mb-1">Ideal Candidate Profile:</strong>
            {activeTrackData.idealFor}
          </div>
        </div>
      </div>

      {/* Section 3: Counselor Interview Talking Points Generator */}
      <div className="bg-steel/20 border border-steel/50 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-steel/50 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-wider font-bold">
              <FileText size={14} /> Intake Rehearsal & Strategy
            </div>
            <h3 className="text-xl font-black text-sand uppercase mt-0.5">
              VR&E Initial Counselor Interview Script Generator
            </h3>
            <p className="text-xs text-sand/60 font-sans">
              VR&E is an <strong>employment program</strong>. Generating legal talking points tailored to your conditions ensures your counselor grants entitlement on Day 1.
            </p>
          </div>

          <button
            onClick={copyScriptToClipboard}
            className="px-4 py-2.5 rounded-xl bg-gold hover:bg-yellow-600 text-steel-dark font-black font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto flex-shrink-0 shadow-md transition-all"
          >
            {copiedScript ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedScript ? 'Copied to Clipboard!' : 'Copy Script'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div>
            <label className="text-sand/80 uppercase font-bold text-[11px] block mb-1">
              Your Service-Connected Conditions:
            </label>
            <input
              type="text"
              value={currentDisabilities}
              onChange={(e) => setCurrentDisabilities(e.target.value)}
              className="w-full bg-steel-dark border border-steel/60 rounded-xl p-3 text-sand focus:outline-none focus:border-gold"
              placeholder="e.g. Lumbar spine, PTSD, Migraines, Tinnitus"
            />
          </div>

          <div>
            <label className="text-sand/80 uppercase font-bold text-[11px] block mb-1">
              Your Target Sedentary / High-Value Career:
            </label>
            <input
              type="text"
              value={targetCareer}
              onChange={(e) => setTargetCareer(e.target.value)}
              className="w-full bg-steel-dark border border-steel/60 rounded-xl p-3 text-sand focus:outline-none focus:border-gold"
              placeholder="e.g. Cyber Security Analyst, Attorney, Project Manager"
            />
          </div>
        </div>

        {/* Generated Script Box */}
        <div className="bg-steel-dark border border-gold/40 rounded-2xl p-5 font-mono text-xs text-sand/90 space-y-3 whitespace-pre-wrap leading-relaxed">
          {generatedScript}
        </div>
      </div>

      {/* Section 4: What to Say vs. What Not to Say in the Interview */}
      <div className="space-y-4">
        <h3 className="text-xl font-black uppercase text-sand">Interview Rules of Engagement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {VRE_COUNSELOR_SCRIPT_GUIDE.map((guide, idx) => (
            <div key={idx} className="bg-steel/20 border border-steel/50 rounded-2xl p-5 space-y-3 font-sans text-xs">
              <h4 className="font-bold text-gold font-mono uppercase text-sm border-b border-steel/40 pb-2">
                {guide.topic}
              </h4>
              <p className="text-sand/80 leading-relaxed">
                <strong>Counselor Mindset:</strong> {guide.whatVAPrioritizes}
              </p>
              <div className="bg-scarlet/10 border border-scarlet/30 p-2.5 rounded-xl text-sand/80">
                {guide.whatNotToSay}
              </div>
              <div className="bg-emerald-950/40 border border-emerald-500/40 p-2.5 rounded-xl text-emerald-300">
                {guide.whatToSay}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: VR&E FAQs */}
      <div className="bg-steel/20 border border-steel/50 rounded-3xl p-6 sm:p-8 space-y-4 font-sans text-xs">
        <h3 className="text-xl font-black uppercase text-sand font-mono">Frequently Asked VR&E Questions</h3>
        <div className="space-y-3">
          {VRE_FAQS.map((faq, i) => (
            <div key={i} className="bg-steel-dark border border-steel/60 rounded-2xl p-4 space-y-1.5">
              <h4 className="font-bold text-sm text-gold font-mono">{faq.q}</h4>
              <p className="text-sand/80 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VocRehabCommandCenter;
