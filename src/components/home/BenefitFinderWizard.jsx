import React, { useState } from 'react';
import {
  Sparkles, CheckCircle, ArrowRight, ArrowLeft, RefreshCw, Zap
} from 'lucide-react';
import { getVaMonthlyComp } from '../../data/vaPayTable';
import { STATE_BENEFITS } from '../../data/stateBenefits';

export const BenefitFinderWizard = ({ onCompleteQuiz, initialBranch = 'usmc', initialState = 'tx' }) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    branch: initialBranch,
    status: 'separated', // 'active' | 'separated' | 'retiring'
    rating: 70,
    goals: ['wealth', 'home', 'education'],
    state: initialState
  });

  const [isCompleted, setIsCompleted] = useState(false);

  const toggleGoal = (goalKey) => {
    setAnswers(prev => {
      const exists = prev.goals.includes(goalKey);
      return {
        ...prev,
        goals: exists ? prev.goals.filter(g => g !== goalKey) : [...prev.goals, goalKey]
      };
    });
  };

  const handleFinish = () => {
    setIsCompleted(true);
    if (onCompleteQuiz) {
      onCompleteQuiz(answers);
    }
  };

  const monthlyEst = getVaMonthlyComp(answers.rating, 'single');
  const annualEst = monthlyEst * 12;
  const stateData = STATE_BENEFITS[answers.state] || STATE_BENEFITS.tx;

  return (
    <div className="bg-gradient-to-b from-steel/40 via-steel-dark to-steel-dark border-2 border-gold/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-steel/50 pb-4">
        <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold">
          <Zap size={14} className="text-gold animate-pulse" />
          <span>60-Second Tactical Benefit Finder</span>
        </div>
        <div className="text-xs font-mono text-sand/60">
          Step {step} of 4
        </div>
      </div>

      {!isCompleted ? (
        <div className="space-y-6 animate-fade-in">
          {/* STEP 1: Military Service Status */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black uppercase text-sand">
                  What is your current military status?
                </h3>
                <p className="text-xs text-sand/70">
                  This determines your BDD claim window, transition allowances, and statutory deadlines.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'active', label: 'Active Duty (T-180 to ETS)', desc: 'Eligible for BDD fast-track claims & SkillBridge' },
                  { id: 'separated', label: 'Separated Veteran', desc: 'Eligible for retroactive disability backpay & state shields' },
                  { id: 'retiring', label: 'Military Retiree (20+ Yrs / Medboard)', desc: 'CRDP/CRSC dual-compensation eligible' },
                ].map(opt => (
                  <div
                    key={opt.id}
                    onClick={() => setAnswers({ ...answers, status: opt.id })}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1.5 select-none ${
                      answers.status === opt.id
                        ? 'bg-gold/10 border-gold shadow-lg text-sand'
                        : 'bg-steel-dark/60 border-steel/50 text-sand/70 hover:border-gold/40'
                    }`}
                  >
                    <div className="font-bold text-sm text-sand font-mono flex items-center justify-between">
                      <span>{opt.label}</span>
                      {answers.status === opt.id && <CheckCircle size={14} className="text-gold" />}
                    </div>
                    <p className="text-[11px] text-sand/60 leading-tight">{opt.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Current Disability Rating */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black uppercase text-sand">
                  What is your current VA disability rating?
                </h3>
                <p className="text-xs text-sand/70">
                  Select your active rating (or 0% if currently unrated/pending).
                </p>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[0, 10, 30, 50, 70, 80, 90, 100].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setAnswers({ ...answers, rating: r })}
                    className={`py-3 px-2 rounded-xl font-mono text-sm font-bold border transition-all ${
                      answers.rating === r
                        ? 'bg-gold text-steel-dark border-gold shadow-lg font-black'
                        : 'bg-steel-dark/70 border-steel/60 text-sand hover:border-gold/50'
                    }`}
                  >
                    {r}%
                  </button>
                ))}
              </div>

              <div className="bg-steel/30 border border-steel/50 rounded-xl p-3 text-xs text-sand/80 flex items-center justify-between">
                <span>Estimated Monthly Compensation at {answers.rating}%:</span>
                <strong className="text-emerald-400 font-mono text-sm">${monthlyEst.toLocaleString()}/mo Tax-Free</strong>
              </div>
            </div>
          )}

          {/* STEP 3: Goals & Life Priorities */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black uppercase text-sand">
                  What are your top post-military goals?
                </h3>
                <p className="text-xs text-sand/70">
                  Select all that apply. We will map the highest-value pathways for you.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'home', label: '🏠 Buy a Home ($0 Down VA Loan)', desc: 'Funding fee waiver, multi-family house hacking, $0 down' },
                  { id: 'education', label: '🎓 Education & Degrees', desc: 'Post-9/11 GI Bill, VR&E Chapter 31 stacking, state waivers' },
                  { id: 'wealth', label: '💰 Maximize Tax-Free Income', desc: 'Reach 100% P&T, stack secondary claims, TDIU, SMC add-ons' },
                  { id: 'career', label: '💼 Federal GS / SDVOSB Business', desc: '10-point veteran preference, $47B sole-source contracts' },
                ].map(g => {
                  const isSelected = answers.goals.includes(g.id);
                  return (
                    <div
                      key={g.id}
                      onClick={() => toggleGoal(g.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1 select-none ${
                        isSelected
                          ? 'bg-gold/10 border-gold text-sand shadow-md'
                          : 'bg-steel-dark/60 border-steel/50 text-sand/60 hover:border-gold/40'
                      }`}
                    >
                      <div className="font-bold text-xs sm:text-sm text-sand font-mono flex items-center justify-between">
                        <span>{g.label}</span>
                        {isSelected && <CheckCircle size={14} className="text-gold" />}
                      </div>
                      <p className="text-[11px] text-sand/60 leading-tight">{g.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Target State of Domicile */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black uppercase text-sand">
                  What is your target State of Residence?
                </h3>
                <p className="text-xs text-sand/70">
                  State property tax exemptions, income tax waivers, and free dependent tuition.
                </p>
              </div>

              <select
                value={answers.state}
                onChange={(e) => setAnswers({ ...answers, state: e.target.value })}
                className="w-full bg-steel-dark border border-steel/60 rounded-xl p-3 text-sm text-sand font-mono focus:outline-none focus:border-gold"
              >
                {Object.keys(STATE_BENEFITS).map(k => (
                  <option key={k} value={k}>
                    {STATE_BENEFITS[k].name} ({STATE_BENEFITS[k].taxStatus})
                  </option>
                ))}
              </select>

              <div className="bg-steel/30 border border-steel/50 rounded-xl p-3.5 space-y-1 text-xs">
                <span className="text-gold font-mono uppercase font-bold text-[10px]">
                  {stateData.name} Tax Highlights:
                </span>
                <ul className="space-y-1 text-sand/80">
                  {stateData.highlights.slice(0, 2).map((h, i) => (
                    <li key={i}>• {h}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-steel/50">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl bg-steel-dark border border-steel/60 text-sand text-xs font-mono font-bold flex items-center gap-1 hover:border-gold transition-all"
              >
                <ArrowLeft size={13} /> Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-5 py-2.5 rounded-xl bg-gold hover:bg-yellow-600 text-steel-dark text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all"
              >
                Next <ArrowRight size={13} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-steel-dark text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <Sparkles size={14} /> Reveal My Benefit Stack
              </button>
            )}
          </div>
        </div>
      ) : (
        /* COMPLETED STACK REVEAL */
        <div className="space-y-5 animate-fade-in font-mono">
          <div className="space-y-1">
            <span className="text-[10px] text-gold uppercase tracking-widest font-bold">
              === YOUR CUSTOM TACTICAL STACK ===
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-sand uppercase">
              Targeted Roadmap ({answers.rating}% Rated • {stateData.name})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-steel/30 border border-steel/50 rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] text-sand/50 uppercase">Disability Compensation</span>
              <div className="text-xl font-black text-emerald-400">
                ${monthlyEst.toLocaleString()}<span className="text-xs text-sand/60">/mo</span>
              </div>
              <div className="text-[10px] text-sand/60">${annualEst.toLocaleString()}/yr tax-free</div>
            </div>

            <div className="bg-steel/30 border border-steel/50 rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] text-sand/50 uppercase">State Tax Shield</span>
              <div className="text-xl font-black text-gold">
                {answers.rating === 100 ? '$0 Property Tax' : 'Up to $8k/yr Saved'}
              </div>
              <div className="text-[10px] text-sand/60">{stateData.name} Exemption</div>
            </div>

            <div className="bg-steel/30 border border-steel/50 rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] text-sand/50 uppercase">VA Home Loan</span>
              <div className="text-xl font-black text-sand">
                {answers.rating >= 10 ? '$0 Fee Waived' : '0% Down Eligible'}
              </div>
              <div className="text-[10px] text-sand/60">Multi-Family Friendly</div>
            </div>
          </div>

          <div className="bg-steel/20 border border-steel/50 rounded-2xl p-4 space-y-2 text-xs font-sans">
            <span className="text-gold font-mono uppercase font-bold text-[11px] block">
              Top 3 Immediate Mission Objectives:
            </span>
            <div className="space-y-1.5 text-sand/80">
              <div className="flex items-start gap-2">
                <span className="text-gold font-mono font-bold">1.</span>
                <span>File secondary conditions (Sleep Apnea, Radiculopathy) to bridge the gap to 100% P&T ($3,737/mo).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gold font-mono font-bold">2.</span>
                <span>Lock in {stateData.name} homestead property tax exemption with county appraisal district.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gold font-mono font-bold">3.</span>
                <span>Claim your Lifetime National Parks Military Pass and 100% free VA dental evaluation.</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                setIsCompleted(false);
                setStep(1);
              }}
              className="px-4 py-2 rounded-xl bg-steel border border-steel/60 hover:border-gold text-sand text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
            >
              <RefreshCw size={12} /> Retake Finder
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BenefitFinderWizard;
