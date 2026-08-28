import React, { useState } from 'react';
import {
  Calendar, CheckCircle,
  ExternalLink, Printer, Sliders, ChevronDown, ChevronUp, Download, Copy, Check
} from 'lucide-react';
import { calculateMissionTimeline } from '../../utils/timelineEngine';
import { TIMELINE_EVENTS } from '../../data/timelineEvents';
import { STATE_BENEFITS } from '../../data/stateBenefits';

export const MissionTimelineGenerator = ({
  enlistmentDate = '2016-08-01',
  separationDate = '2024-08-01',
  branch = 'usmc',
  currentRating = 70,
  selectedState = 'tx',
  hasDependents = 'single',
  completedMilestones = {},
  onToggleMilestone,
  onOpenSettings
}) => {
  const [timelinePhaseFilter, setTimelinePhaseFilter] = useState('all');
  const [hideCompleted, setHideCompleted] = useState(false);
  const [expandedCard, setExpandedCard] = useState('bdd_fast_track');
  const [copiedId, setCopiedId] = useState(null);

  const timelineMetrics = calculateMissionTimeline({
    enlistmentDate,
    separationDate,
    branch,
    currentRating,
    selectedState,
    hasDependents
  });

  const stateInfo = STATE_BENEFITS[selectedState] || STATE_BENEFITS.tx;

  const handleCopyScript = (id, scriptText) => {
    navigator.clipboard.writeText(scriptText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const completedCount = TIMELINE_EVENTS.filter(e => completedMilestones[e.id]).length;

  return (
    <div className="space-y-6">
      {/* Header Hero Banner */}
      <div className="bg-gradient-to-r from-steel/40 via-steel-dark to-steel-dark border border-gold/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl space-y-4">
        <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold">
          <Calendar size={14} /> Mission Clocks & Statutory Windows
        </div>
        <div className="space-y-1 max-w-3xl">
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-sand">
            "Your Life in Months" <span className="text-gold">Mission Timeline</span>
          </h2>
          <p className="text-sand/70 text-sm leading-relaxed font-sans">
            Veterans lose thousands of dollars simply by missing statutory windows. Below are your live statutory countdown clocks, ranked actionable urgency tiers, and hand-held execution guides.
          </p>
        </div>

        {/* Profile Controls Header */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenSettings}
            className="px-3.5 py-2 rounded-xl bg-gold text-steel-dark font-black font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:bg-yellow-600 transition-all"
          >
            <Sliders size={13} /> Edit Timeline Profile ({currentRating}% Rated • {stateInfo.name})
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-steel-dark border border-steel/60 hover:border-gold text-sand font-mono text-xs uppercase font-bold flex items-center gap-1.5 transition-all"
          >
            <Printer size={13} /> Print 1-Page Mission Brief
          </button>
        </div>
      </div>

      {/* Tactical Top Statutory Countdown Clocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* BDD Window Card */}
        <div className="bg-steel/20 border border-steel/50 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold bg-steel text-sand/70">
              Pre-Separation Clock
            </span>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                timelineMetrics.bddStatus === 'open_now'
                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 animate-pulse'
                  : timelineMetrics.bddStatus === 'completed'
                  ? 'bg-steel text-sand/60'
                  : 'bg-red-950/60 text-scarlet border border-scarlet/40'
              }`}
            >
              {timelineMetrics.bddStatus === 'open_now'
                ? `🟢 OPEN (${timelineMetrics.bddDaysLeft}d Left)`
                : timelineMetrics.bddStatus === 'completed'
                ? '✓ Completed'
                : timelineMetrics.bddStatus === 'upcoming'
                ? `Opens in ${timelineMetrics.bddDaysLeft}d`
                : '🔴 Standard Backlog Queue'}
            </span>
          </div>
          <div>
            <div className="font-black text-sand text-base">BDD Fast-Track Window</div>
            <p className="text-xs text-sand/60 leading-relaxed mt-1">
              180 to 90 days before discharge. Guarantees your VA disability check starts on <strong>Day 1 as a civilian</strong>.
            </p>
          </div>
          <div className="pt-2 border-t border-steel/40 text-[11px] font-mono text-gold flex items-center justify-between">
            <span>38 U.S.C. § 5101</span>
            <span className="text-sand/50">{timelineMetrics.isSeparated ? 'Separated' : 'Active Duty'}</span>
          </div>
        </div>

        {/* 180-Day Free Dental Clock */}
        <div className="bg-steel/20 border border-steel/50 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold bg-steel text-sand/70">
              180-Day Grace Clock
            </span>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                timelineMetrics.dentalStatus === 'active'
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                  : 'bg-steel text-sand/50'
              }`}
            >
              {timelineMetrics.dentalStatus === 'active'
                ? `🟢 ${timelineMetrics.dentalDaysLeft} Days Remaining`
                : timelineMetrics.dentalStatus === 'expired'
                ? 'Expired (Class IV at 100%)'
                : 'Upcoming at ETS'}
            </span>
          </div>
          <div>
            <div className="font-black text-sand text-base">100% Free VA Dental Care</div>
            <p className="text-xs text-sand/60 leading-relaxed mt-1">
              All separated veterans qualify for <strong>one-time 100% free comprehensive dental treatment</strong> if applied within 180 days of separation.
            </p>
          </div>
          <div className="pt-2 border-t border-steel/40 text-[11px] font-mono text-gold flex items-center justify-between">
            <span>Class II(b) Dental</span>
            <span className="text-emerald-400 font-bold">$2,500-$8,000 Value</span>
          </div>
        </div>

        {/* VGLI Guaranteed Life Insurance Clock */}
        <div className="bg-steel/20 border border-steel/50 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold bg-steel text-sand/70">
              240-Day Exam-Free Clock
            </span>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                timelineMetrics.vgliStatus === 'active'
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                  : 'bg-steel text-sand/50'
              }`}
            >
              {timelineMetrics.vgliStatus === 'active'
                ? `🟢 ${timelineMetrics.vgliDaysLeft} Days Remaining`
                : timelineMetrics.vgliStatus === 'expired'
                ? 'Standard Medical Underwriting'
                : 'Upcoming at ETS'}
            </span>
          </div>
          <div>
            <div className="font-black text-sand text-base">VGLI Guaranteed Life Insurance</div>
            <p className="text-xs text-sand/60 leading-relaxed mt-1">
              Convert up to $500k life insurance with <strong>ZERO physical exams and guaranteed approval</strong> regardless of PTSD or service ratings.
            </p>
          </div>
          <div className="pt-2 border-t border-steel/40 text-[11px] font-mono text-gold flex items-center justify-between">
            <span>Guaranteed Issue</span>
            <span className="text-sand/50">Up to $500,000</span>
          </div>
        </div>
      </div>

      {/* Filter Ribbon & Declutter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-steel/20 border border-steel/50 rounded-2xl p-4">
        {/* Phase Filter Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: `All Phases (${TIMELINE_EVENTS.length})` },
            { id: 'p1', label: 'Pre-Separation' },
            { id: 'p2', label: 'First 6 Months' },
            { id: 'p3', label: 'Wealth & Housing' },
            { id: 'p4', label: 'Lifelong Defense' },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setTimelinePhaseFilter(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                timelinePhaseFilter === p.id
                  ? 'bg-gold text-steel-dark border-gold shadow-sm'
                  : 'bg-steel-dark/60 border-steel/50 text-sand/70 hover:text-sand hover:bg-steel/40'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Declutter Checkbox */}
        <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-sand/80 select-none bg-steel-dark/60 border border-steel/50 px-3 py-1.5 rounded-xl">
          <input
            type="checkbox"
            checked={hideCompleted}
            onChange={(e) => setHideCompleted(e.target.checked)}
            className="rounded border-steel/60 text-gold focus:ring-gold bg-steel-dark"
          />
          <span>Hide Completed ({completedCount})</span>
        </label>
      </div>

      {/* Hand-Held Step-by-Step Timeline Cards */}
      <div className="space-y-4">
        {TIMELINE_EVENTS
          .filter(item => {
            const isDone = Boolean(completedMilestones[item.id]);
            if (hideCompleted && isDone) return false;
            if (timelinePhaseFilter !== 'all' && item.phase !== timelinePhaseFilter) return false;
            return true;
          })
          .map(item => {
            const isOpen = expandedCard === item.id;
            const isDone = Boolean(completedMilestones[item.id]);

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isDone
                    ? 'border-emerald-500/40 bg-emerald-950/20'
                    : isOpen
                    ? 'border-gold/60 bg-steel/30 shadow-xl shadow-gold/5'
                    : 'border-steel/50 bg-steel/20 hover:border-gold/30'
                }`}
              >
                {/* Card Click Header */}
                <div
                  onClick={() => setExpandedCard(isOpen ? null : item.id)}
                  className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none"
                >
                  <div className="flex items-start gap-3.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleMilestone) onToggleMilestone(item.id);
                      }}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-400 text-steel-dark'
                          : 'border-steel/60 hover:border-gold bg-steel-dark/60'
                      }`}
                      title={isDone ? 'Mark as Pending' : 'Mark as Completed'}
                    >
                      {isDone && <CheckCircle size={14} />}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-steel text-gold">
                          {item.timing}
                        </span>
                        <span className="text-[10px] font-mono text-sand/50 font-semibold">
                          {item.badge}
                        </span>
                      </div>
                      <div className={`font-black text-base sm:text-lg ${isDone ? 'line-through text-sand/50' : 'text-sand'}`}>
                        {item.title}
                      </div>
                      <div className="text-xs text-sand/60">{item.summary}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="text-right">
                      <div className="text-xs font-mono text-emerald-400 font-bold">{item.value}</div>
                      <div className="text-[10px] font-mono text-sand/40">{item.urgencyLabel}</div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-steel/40 border border-steel/60 flex items-center justify-center text-sand/60">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                </div>

                {/* Expanded Action Drawer */}
                {isOpen && (
                  <div className="border-t border-steel/40 bg-steel-dark/60 p-5 space-y-4 animate-fade-in font-sans">
                    {/* Why This Matters */}
                    <div className="bg-steel/30 border border-steel/60 rounded-xl p-3.5 text-xs text-sand/80 leading-relaxed">
                      <strong className="text-gold font-mono uppercase">Why This Matters:</strong> {item.why}
                    </div>

                    {/* Step-by-Step Instructions */}
                    <div className="space-y-2">
                      <div className="text-xs font-mono uppercase text-gold font-bold">Execution Checklist:</div>
                      <div className="space-y-2">
                        {item.steps.map((st, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-sand/85 leading-relaxed bg-steel/20 border border-steel/40 rounded-xl p-3">
                            <span className="font-mono font-bold text-gold flex-shrink-0">{i + 1}.</span>
                            <span>{st}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Script / Talking Points */}
                    {item.script && (
                      <div className="bg-steel-dark/90 border border-gold/30 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-gold uppercase font-bold">
                            💬 Battle Buddy Script / Magic Words
                          </span>
                          <button
                            onClick={() => handleCopyScript(item.id, item.script)}
                            className="px-2 py-1 rounded-md bg-steel/60 hover:bg-gold hover:text-steel-dark text-[10px] font-mono font-bold text-sand/80 flex items-center gap-1 transition-all"
                          >
                            {copiedId === item.id ? <Check size={10} /> : <Copy size={10} />}
                            <span>{copiedId === item.id ? 'Copied' : 'Copy Script'}</span>
                          </button>
                        </div>
                        <div className="text-xs font-mono text-sand/90 italic bg-steel/20 p-2.5 rounded-lg border border-steel/40">
                          {item.script}
                        </div>
                      </div>
                    )}

                    {/* Form Download & Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-steel/40">
                      {item.formUrl && (
                        <a
                          href={item.formUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-gold hover:bg-yellow-600 text-steel-dark font-black font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
                        >
                          <Download size={12} /> Official Form ({item.form}) <ExternalLink size={11} />
                        </a>
                      )}
                      <button
                        onClick={() => {
                          if (onToggleMilestone) onToggleMilestone(item.id);
                        }}
                        className={`px-4 py-2 rounded-xl font-mono text-xs uppercase font-bold flex items-center gap-1.5 transition-all border ${
                          isDone
                            ? 'bg-steel-dark border-steel/60 text-sand/70'
                            : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60'
                        }`}
                      >
                        <Check size={12} /> {isDone ? 'Mark as Incomplete' : 'Mark as Completed'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MissionTimelineGenerator;
