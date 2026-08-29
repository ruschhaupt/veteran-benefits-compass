import React, { useState } from 'react';
import {
  Calendar, CheckCircle, ExternalLink,
  DollarSign, HeartPulse
} from 'lucide-react';
import { TRANSITION_CHECKLIST, EMERGENCY_RESOURCES } from '../../data/transitionData';

export const TransitionCommandCenter = ({ branch = 'usmc', currentRating = 70 }) => {
  const [completedTasks, setCompletedTasks] = useState({});
  
  // Terminal Leave Calculator State
  const [leaveDays, setLeaveDays] = useState(60);
  const [monthlyBasicPay, setMonthlyBasicPay] = useState(3800); // E-5 approx
  const [monthlyBah, setMonthlyBah] = useState(2200);
  const [monthlyBas] = useState(460);

  const toggleTask = (id) => {
    setCompletedTasks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Terminal Leave Cash Value: (Days / 30) * (BasicPay + BAH + BAS)
  const terminalLeaveValue = (leaveDays / 30) * (monthlyBasicPay + monthlyBah + monthlyBas);
  
  // Selling Leave: (Days / 30) * BasicPay * 0.78 (22% flat federal tax withheld)
  const sellLeaveValue = (leaveDays / 30) * monthlyBasicPay * 0.78;
  const terminalAdvantage = Math.round(terminalLeaveValue - sellLeaveValue);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-steel/40 via-steel-dark to-steel-dark border border-gold/40 rounded-3xl p-6 sm:p-8 space-y-3 relative overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold">
          <Calendar size={15} /> ETS & Separation Tactical Command Center
        </div>
        <div className="space-y-1 max-w-3xl">
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-sand">
            Transition <span className="text-gold">180-Day Checklist & Safety Net</span>
          </h2>
          <p className="text-sand/70 text-sm leading-relaxed font-sans">
            Every dollar of civilian transition success is won before you separate. Lock in your BDD claim 180 days out, maximize terminal leave over selling days, audit your DD-214, and access emergency healthcare under the COMPACT Act.
          </p>
        </div>
      </div>

      {/* Section 1: Terminal Leave vs. Selling Leave Calculator */}
      <div className="bg-steel/20 border border-steel/50 rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="border-b border-steel/50 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-wider font-bold">
              <DollarSign size={14} /> 37 U.S.C. § 501 Financial Analysis
            </div>
            <h3 className="text-xl font-black text-sand uppercase mt-0.5">
              Terminal Leave vs. Selling Days Calculator
            </h3>
          </div>
          <span className="px-3 py-1 rounded-xl bg-gold/10 text-gold border border-gold/30 text-xs font-mono font-bold self-start sm:self-auto">
            Terminal Leave Is ~2.5x More Valuable
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
          {/* Inputs (6 cols) */}
          <div className="lg:col-span-6 bg-steel-dark border border-steel/60 rounded-2xl p-5 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sand/80 uppercase font-bold text-[11px]">Accrued Leave Days Available:</label>
                <span className="text-lg font-black text-gold">{leaveDays} Days ({Math.round(leaveDays / 30 * 10) / 10} Mos)</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="5"
                value={leaveDays}
                onChange={(e) => setLeaveDays(parseInt(e.target.value))}
                className="w-full accent-gold cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sand/80 uppercase font-bold text-[10px] block mb-1">Monthly Basic Pay ($):</label>
                <input
                  type="number"
                  step="100"
                  value={monthlyBasicPay}
                  onChange={(e) => setMonthlyBasicPay(parseInt(e.target.value) || 0)}
                  className="w-full bg-steel border border-steel/60 rounded-xl p-2 text-sand"
                />
              </div>

              <div>
                <label className="text-sand/80 uppercase font-bold text-[10px] block mb-1">Monthly BAH ($):</label>
                <input
                  type="number"
                  step="100"
                  value={monthlyBah}
                  onChange={(e) => setMonthlyBah(parseInt(e.target.value) || 0)}
                  className="w-full bg-steel border border-steel/60 rounded-xl p-2 text-sand"
                />
              </div>
            </div>

            <div className="bg-steel/30 border border-steel/50 rounded-xl p-3 text-[11px] font-sans text-sand/70">
              *Selling leave only pays 1/30th of Basic Pay per day and is subject to mandatory 22% federal tax withholding. Terminal leave pays full Basic Pay + 100% tax-free BAH & BAS.
            </div>
          </div>

          {/* Results (6 cols) */}
          <div className="lg:col-span-6 bg-steel-dark border border-gold/40 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-gold uppercase font-bold">Cash Value Comparison</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-steel/30 p-3 rounded-xl border border-steel/50 space-y-0.5">
                  <span className="text-[10px] text-sand/50 uppercase">Taking Terminal Leave:</span>
                  <div className="text-xl font-black text-emerald-400">
                    ${Math.round(terminalLeaveValue).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-sand/60">Full Pay + BAH + BAS</div>
                </div>

                <div className="bg-steel/30 p-3 rounded-xl border border-steel/50 space-y-0.5">
                  <span className="text-[10px] text-sand/50 uppercase">Selling Days to Gov:</span>
                  <div className="text-xl font-black text-scarlet">
                    ${Math.round(sellLeaveValue).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-sand/60">After 22% tax cut</div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3.5 flex items-center justify-between text-xs">
              <span className="text-sand font-bold font-sans">Terminal Leave Advantage:</span>
              <span className="text-base font-black text-emerald-400 font-mono">+${terminalAdvantage.toLocaleString()} More Cash</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Phase-by-Phase Transition Checklist */}
      <div className="space-y-4">
        <h3 className="text-xl font-black uppercase text-sand">180-Day Tactical Transition Checklist</h3>
        <div className="space-y-4">
          {TRANSITION_CHECKLIST.map((phase, idx) => (
            <div key={idx} className="bg-steel/20 border border-steel/50 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-steel/40 pb-3">
                <h4 className="font-bold text-sm sm:text-base text-gold font-mono uppercase">
                  {phase.phase}
                </h4>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-steel border border-steel/60 text-sand/80">
                  {phase.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {phase.tasks.map(task => {
                  const isChecked = !!completedTasks[task.id];
                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 select-none flex flex-col justify-between ${
                        isChecked
                          ? 'bg-gold/10 border-gold shadow-md'
                          : 'bg-steel-dark/70 border-steel/60 hover:border-gold/40'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-xs text-sand font-mono">{task.title}</span>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isChecked ? 'bg-gold border-gold text-steel-dark' : 'border-steel/60 bg-steel-dark'
                          }`}>
                            {isChecked && <CheckCircle size={12} />}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-sand/50 block">{task.statute}</span>
                        <p className="text-[11px] text-sand/70 font-sans leading-relaxed">{task.desc}</p>
                      </div>

                      <div className="pt-2 border-t border-steel/40 text-[10px] font-mono text-emerald-400">
                        ⚡ {task.impact}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Emergency Healthcare & Safety Net */}
      <div className="bg-steel/20 border border-steel/50 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="border-b border-steel/50 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-scarlet font-mono text-xs uppercase tracking-wider font-bold">
            <HeartPulse size={16} /> Statutory Safety Net & Crisis Protections
          </div>
          <span className="px-3 py-1 rounded-xl bg-scarlet/10 text-scarlet border border-scarlet/30 text-xs font-mono font-bold">
            Federal Protections
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
          {EMERGENCY_RESOURCES.map(res => (
            <div key={res.id} className="bg-steel-dark border border-steel/60 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-scarlet/10 text-scarlet border border-scarlet/30">
                  {res.tag}
                </span>
                <h4 className="font-bold text-sm text-sand font-mono">{res.title}</h4>
                <div className="text-xs font-mono text-gold font-bold">{res.phone}</div>
                <p className="text-sand/70 leading-relaxed">{res.desc}</p>
              </div>

              <div className="pt-2 border-t border-steel/40">
                <a
                  href={res.actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold font-mono text-xs hover:underline flex items-center gap-1 font-bold"
                >
                  Official VA Directive <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransitionCommandCenter;
