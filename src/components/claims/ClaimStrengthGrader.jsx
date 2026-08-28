import React, { useState } from 'react';
import {
  Award, Search, Printer, Check
} from 'lucide-react';
import { gradeClaimStrength } from '../../utils/claimGrader';
import { MED_DB } from '../../data/medDb';

export const ClaimStrengthGrader = () => {
  const [conditionInput, setConditionInput] = useState('');
  const [evidence, setEvidence] = useState({
    hasSTR: true,
    hasPrivateDiagnosis: true,
    hasNexus: false,
    hasBuddyStatement: true,
    isPactPresumptive: false
  });

  const gradedResult = gradeClaimStrength(conditionInput || 'Lumbar Spine Strain', evidence);

  const toggleEvidence = (key) => {
    setEvidence(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectPreset = (cond) => {
    setConditionInput(cond.condition);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-steel/40 via-steel-dark to-steel-dark border border-gold/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl space-y-3">
        <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold">
          <Award size={14} /> Evidentiary Claim Analytics
        </div>
        <div className="space-y-1 max-w-3xl">
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-sand">
            Claim Strength <span className="text-gold">Grader (A+ to D)</span>
          </h2>
          <p className="text-sand/70 text-sm leading-relaxed font-sans">
            Every veteran has been told by the VA that their claim "lacks evidence." This tool maps your symptoms to VA Diagnostic Codes, grades your evidence tier before you file, and generates a custom DBQ Prep Sheet for your doctor.
          </p>
        </div>
      </div>

      {/* Input & Evidence Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Intake & Evidence Checkboxes (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Step 1: Condition Input */}
          <div className="bg-steel/20 border border-steel/50 rounded-2xl p-5 space-y-3">
            <label className="block text-xs font-mono uppercase text-gold font-bold">
              1. Enter Your Medical Condition in Plain English:
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Ringing in ears, lower back pain, sleep apnea, PTSD"
                value={conditionInput}
                onChange={(e) => setConditionInput(e.target.value)}
                className="w-full bg-steel-dark/90 border border-steel/60 rounded-xl px-4 py-3 text-sm text-sand focus:outline-none focus:border-gold placeholder:text-sand/40"
              />
              <Search size={16} className="absolute right-3.5 top-3.5 text-sand/40 pointer-events-none" />
            </div>

            {/* Quick condition chip selector */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono uppercase text-sand/50">Top Winable Conditions:</span>
              <div className="flex flex-wrap gap-1.5">
                {MED_DB.slice(0, 6).map((c, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectPreset(c)}
                    className="px-2.5 py-1 rounded-lg bg-steel-dark/60 hover:bg-steel/60 border border-steel/50 text-[11px] font-mono text-sand/80 hover:text-gold transition-all"
                  >
                    {c.condition}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2: Evidence Checklist */}
          <div className="bg-steel/20 border border-steel/50 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-gold font-bold">
                2. Check All Documentation You Currently Have:
              </label>
              <span className="text-[10px] font-mono text-sand/50">Caluza Element Rubric</span>
            </div>

            <div className="space-y-2.5 font-sans">
              {[
                {
                  key: 'hasSTR',
                  label: 'In-Service Medical Record (STR)',
                  desc: 'Documented injury, clinic visit, sick call, or incident in your military medical jacket.'
                },
                {
                  key: 'hasPrivateDiagnosis',
                  label: 'Current Medical Diagnosis',
                  desc: 'Active diagnosis from a private physician, specialist, or VA primary care clinic.'
                },
                {
                  key: 'hasNexus',
                  label: 'Official Medical Nexus Letter / IMO',
                  desc: 'Doctor letter stating condition is "at least as likely as not" related to military service.'
                },
                {
                  key: 'hasBuddyStatement',
                  label: 'Buddy Statement / Lay Letter (VA Form 21-10210)',
                  desc: 'Written statement from a battle buddy, spouse, or supervisor witnessing the in-service injury or daily symptoms.'
                },
                {
                  key: 'isPactPresumptive',
                  label: 'PACT Act Presumptive Service / Toxic Exposure',
                  desc: 'Qualified service in SW Asia, burn pit zones, Camp Lejeune, or Agent Orange territories.'
                },
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() => toggleEvidence(item.key)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                    evidence[item.key]
                      ? 'bg-gold/10 border-gold/50 text-sand'
                      : 'bg-steel-dark/60 border-steel/50 text-sand/60 hover:border-steel/80'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      evidence[item.key]
                        ? 'bg-gold border-gold text-steel-dark font-bold'
                        : 'border-steel/60 bg-steel-dark'
                    }`}
                  >
                    {evidence[item.key] && <Check size={12} />}
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-sand font-mono">{item.label}</div>
                    <div className="text-[11px] text-sand/60 leading-tight">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Scorecard & DBQ Prep Sheet (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {gradedResult && (
            <div className="bg-steel-dark border border-gold/40 rounded-2xl p-6 space-y-5 shadow-xl sticky top-6">
              {/* Grade Header */}
              <div className="flex items-center justify-between border-b border-steel/50 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-gold font-bold">
                    Evidentiary Scorecard
                  </span>
                  <h3 className="text-lg font-black uppercase text-sand mt-0.5">
                    {gradedResult.conditionName}
                  </h3>
                  <div className="text-xs font-mono text-sand/60">
                    VA DC Code: <span className="text-gold font-bold">{gradedResult.dcCode}</span> • Range: {gradedResult.ratingRange}
                  </div>
                </div>

                {/* Grade Badge */}
                <div className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center font-black ${gradedResult.statusColor}`}>
                  <span className="text-2xl font-mono leading-none">{gradedResult.grade}</span>
                  <span className="text-[9px] font-mono mt-0.5 uppercase tracking-tighter">Grade</span>
                </div>
              </div>

              {/* Status Tag Pill */}
              <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold text-center ${gradedResult.statusColor}`}>
                {gradedResult.statusTag}
              </div>

              {/* Clinical Examiner Strategy Note */}
              <div className="bg-steel/30 border border-steel/50 rounded-xl p-3.5 space-y-1 text-xs">
                <span className="text-gold font-mono uppercase font-bold text-[10px] block">
                  Examiner & DBQ Strategy:
                </span>
                <p className="text-sand/80 leading-relaxed font-sans">
                  {gradedResult.clinicalNote}
                </p>
              </div>

              {/* Recommendations Checklist */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase text-gold font-bold block">
                  Action Steps to Lock In Rating:
                </span>
                <div className="space-y-2">
                  {gradedResult.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-sand/80 bg-steel/20 p-2.5 rounded-lg border border-steel/40">
                      <span className="font-mono font-bold text-gold flex-shrink-0">{i + 1}.</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secondary Potential Connections */}
              {gradedResult.secondaryPotential && gradedResult.secondaryPotential.length > 0 && (
                <div className="pt-2 border-t border-steel/50 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-sand/50">
                    High-Yield Secondaries to Stack:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {gradedResult.secondaryPotential.map((sec, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-steel text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                        +{sec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Print DBQ Prep Sheet Button */}
              <div className="pt-2">
                <button
                  onClick={() => window.print()}
                  className="w-full py-3 rounded-xl bg-gold hover:bg-yellow-600 text-steel-dark font-black font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Printer size={14} /> Print Doctor / DBQ Prep Sheet
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimStrengthGrader;
