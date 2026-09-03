import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search, X, ArrowRight, Sparkles,
  Calculator, Award, Shield, Home, Briefcase, GraduationCap,
  Heart, Calendar, DollarSign, Flag, Compass, Cpu, Activity,
  Phone, Zap
} from 'lucide-react';
import { LIFE_EVENT_PILLARS } from './LifeEventNav';

// Keyword mappings to direct tools
const KEYWORD_INDEX = [
  // Claims & Ratings
  { keywords: ['sleep apnea', 'tinnitus', 'ptsd', 'migraines', 'radiculopathy', 'gerd', 'bilateral factor', 'secondary', '38 cfr 4.25', 'math'], tabId: 'vamath', title: 'VA Math & Secondary Combinator', category: 'Claims & Ratings', icon: <Calculator size={14} /> },
  { keywords: ['caluza', 'nexus', 'buddy letter', 'dbq', 'evidence', 'denial', 'appeal', 'grade claim', 'diagnosis'], tabId: 'grader', title: 'Claim Strength Grader & Caluza Rubric', category: 'Claims & Ratings', icon: <Award size={14} /> },
  { keywords: ['burn pit', 'toxic', 'pact act', 'camp lejeune', 'agent orange', 'radiation', 'presumptive', 'airborne hazards', 'iraq', 'afghanistan', 'kuwait'], tabId: 'pact', title: 'PACT Act Toxic Exposure Screener', category: 'Claims & Ratings', icon: <Shield size={14} /> },
  { keywords: ['c&p exam', 'exam prep', 'simulator', 'dbq questions', 'examiner', 'ves', 'qtc', 'optum'], tabId: 'claims', title: 'C&P Exam Practice Simulator', category: 'Claims & Ratings', icon: <Activity size={14} /> },
  { keywords: ['medical records', 'str', 'scanner', 'diagnostic code', 'ocr', 'code match', 'keywords'], tabId: 'scanner', title: 'Medical Record Diagnostic Scanner', category: 'Claims & Ratings', icon: <Cpu size={14} /> },

  // Transition & Career
  { keywords: ['bdd', '180 day', 'skillbridge', 'terminal leave', 'separation', 'ets', 'dd-214', 'outprocessing', 'transition'], tabId: 'transition', title: 'Separation & ETS Command Center', category: 'Transition & Career', icon: <Calendar size={14} /> },
  { keywords: ['guard', 'reserve', 'drill pay', 'offset', 'muta', 'va form 21-8951-2', 'overpayment debt', 'title 32', 'title 10', 'm-day', 'annual training'], tabId: 'guardreserve', title: 'Guard & Reserve Drill Pay Offset Calculator', category: 'Transition & Career', icon: <Shield size={14} /> },
  { keywords: ['gi bill', 'post 9/11', 'bah', 'mha', 'vr&e', 'chapter 31', '48 month rule', 'tuition', 'stacking'], tabId: 'education', title: 'GI Bill & VR&E Chapter 31 Stacking Engine', category: 'Transition & Career', icon: <GraduationCap size={14} /> },
  { keywords: ['voc rehab', 'vre', 'five tracks', 'counselor script', 'long term services', 'employment handicap', 'sevh'], tabId: 'vocrehab', title: 'Voc Rehab (VR&E) 5-Track Strategy', category: 'Transition & Career', icon: <Briefcase size={14} /> },
  { keywords: ['federal gs', 'usajobs', 'fers', 'military buyback', '10-point preference', 'sdvosb', 'schedule a'], tabId: 'avenues', title: 'Federal GS & Veteran Contracting Avenues', category: 'Transition & Career', icon: <Compass size={14} /> },

  // Money & Housing
  { keywords: ['va loan', 'house hack', '0% down', 'multi-family', 'duplex', 'triplex', 'fourplex', 'funding fee waiver', 'irrrl'], tabId: 'househack', title: 'VA Loan House Hacker (2-4 Units)', category: 'Money & Housing', icon: <Home size={14} /> },
  { keywords: ['property tax', 'state benefits', 'texas', 'florida', 'california', 'hazelwood', 'tuition waiver', '50 state'], tabId: 'statematrix', title: '50-State Property Tax & Tuition Shields', category: 'Money & Housing', icon: <Flag size={14} /> },
  { keywords: ['crdp', 'crsc', 'retiree', '20 year', 'concurrent receipt', 'dfas', 'pension', 'combat related', 'chapter 61'], tabId: 'retireecrdp', title: '20-Year Retiree CRDP vs CRSC Combinator', category: 'Money & Housing', icon: <Award size={14} /> },
  { keywords: ['family benefits', 'champva', 'chapter 35', 'dea', 'tpd', 'student loan forgiveness', '100% p&t', 'spouse', 'survivor dic'], tabId: 'familybenefits', title: '100% P&T Family Shield (CHAMPVA & DEA)', category: 'Money & Housing', icon: <Heart size={14} /> },
  { keywords: ['perks', 'space-a', 'mac flight', 'dental', 'commissary', 'national parks', 'sah grant', 'automobile grant'], tabId: 'perks', title: 'High-Value Veteran Perks & Hidden Grants', category: 'Money & Housing', icon: <Sparkles size={14} /> },
  { keywords: ['wealth scorecard', 'net worth', 'annual value', 'debrief', 'financial impact', 'lifetime cash floor'], tabId: 'scorecard', title: 'Veteran Wealth Scorecard & Shareable Debrief', category: 'Money & Housing', icon: <DollarSign size={14} /> },

  // Help & Timeline
  { keywords: ['timeline', 'countdown', 'deadlines', '180-day dental', 'delimitating dates', 'clocks'], tabId: 'tracker', title: 'Mission Timeline Statutory Clocks', category: 'Help & Resources', icon: <Calendar size={14} /> },
  { keywords: ['vso', 'representative', 'crisis', '988', 'suicide', 'dav', 'vfw', 'american legion', 'amvets', 'hotline', 'homeless'], tabId: 'directory', title: 'VSO Locator & 24/7 Crisis Directory', category: 'Help & Resources', icon: <Phone size={14} /> }
];

const POPULAR_SEARCHES = [
  { label: 'Sleep Apnea & Secondaries', query: 'sleep apnea' },
  { label: 'Drill Pay vs VA Comp', query: 'drill pay' },
  { label: '20-Year CRDP / CRSC', query: 'crdp' },
  { label: '100% P&T Family Shield', query: 'champva' },
  { label: '180-Day BDD Window', query: 'bdd' },
  { label: 'Property Tax Exemption', query: 'property tax' },
  { label: 'PACT Act Presumptives', query: 'burn pit' },
  { label: 'GI Bill + VR&E Stacking', query: 'gi bill' }
];

export const CommandPaletteModal = ({ isOpen, onClose, onSelectTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter items matching query
  const filteredResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      // Return top core tools when empty
      return LIFE_EVENT_PILLARS.slice(0, 8).map(pillar => ({
        tabId: pillar.id,
        title: pillar.label,
        sublabel: pillar.sublabel,
        badge: pillar.badge,
        category: pillar.category,
        icon: pillar.icon
      }));
    }

    const matches = [];
    const seenTabs = new Set();

    // 1. Direct keyword mappings
    KEYWORD_INDEX.forEach(item => {
      const hit = item.keywords.some(kw => kw.includes(q) || q.includes(kw));
      if (hit && !seenTabs.has(item.tabId)) {
        seenTabs.add(item.tabId);
        const pillar = LIFE_EVENT_PILLARS.find(p => p.id === item.tabId);
        matches.push({
          tabId: item.tabId,
          title: item.title,
          sublabel: pillar?.sublabel || item.category,
          badge: pillar?.badge,
          category: item.category,
          icon: item.icon
        });
      }
    });

    // 2. Search title/sublabel of all 19 pillars
    LIFE_EVENT_PILLARS.forEach(pillar => {
      if (seenTabs.has(pillar.id)) return;
      const titleHit = pillar.label.toLowerCase().includes(q);
      const subHit = pillar.sublabel?.toLowerCase().includes(q);
      const badgeHit = pillar.badge?.toLowerCase().includes(q);
      if (titleHit || subHit || badgeHit) {
        seenTabs.add(pillar.id);
        matches.push({
          tabId: pillar.id,
          title: pillar.label,
          sublabel: pillar.sublabel,
          badge: pillar.badge,
          category: pillar.category,
          icon: pillar.icon
        });
      }
    });

    return matches;
  }, [searchQuery]);

  // Handle keyboard navigation (ArrowUp, ArrowDown, Enter)
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredResults.length) % Math.max(1, filteredResults.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelect(filteredResults[selectedIndex].tabId);
      }
    }
  };

  const handleSelect = (tabId) => {
    onSelectTab(tabId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 pt-12 sm:pt-20 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-steel-dark border border-gold/40 rounded-2xl sm:rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Input Bar */}
        <div className="p-3 sm:p-4 border-b border-steel/60 flex items-center gap-3 bg-steel/30">
          <Search size={18} className="text-gold flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search any benefit, statute, condition (e.g. sleep apnea, drill pay, CRDP, CHAMPVA)..."
            className="w-full bg-transparent text-sand placeholder-sand/40 font-mono text-xs sm:text-sm focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-sand/40 hover:text-sand text-xs font-mono px-1.5 py-0.5 rounded"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="text-sand/50 hover:text-gold p-1 rounded-lg transition-colors flex-shrink-0"
            aria-label="Close search"
          >
            <X size={18} />
          </button>
        </div>

        {/* Popular Search Suggestions (when input is empty) */}
        {!searchQuery && (
          <div className="px-4 py-2.5 bg-steel/20 border-b border-steel/40">
            <div className="text-[10px] font-mono uppercase text-sand/50 font-bold mb-1.5 flex items-center gap-1.5">
              <Zap size={11} className="text-gold" />
              <span>Fast Tactical Shortcuts:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SEARCHES.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchQuery(item.query)}
                  className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-steel/30 border border-steel/50 text-sand/80 hover:text-gold hover:border-gold/50 transition-all"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="overflow-y-auto p-2 sm:p-3 space-y-1 flex-1 max-h-96">
          {filteredResults.length === 0 ? (
            <div className="p-8 text-center space-y-2 font-mono text-sand/50">
              <p className="text-sm">No exact tactical matches found for "{searchQuery}".</p>
              <p className="text-xs text-sand/40">
                Try searching for diagnoses (sleep apnea, tinnitus), laws (38 CFR, PACT Act), or benefits (drill pay, CRDP, VA loan).
              </p>
            </div>
          ) : (
            filteredResults.map((result, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <button
                  key={`${result.tabId}-${idx}`}
                  onClick={() => handleSelect(result.tabId)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between gap-3 border ${
                    isSelected
                      ? 'bg-gold/15 border-gold/60 text-sand shadow-md'
                      : 'bg-steel/20 border-transparent hover:bg-steel/40 text-sand/80'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span className={`p-2 rounded-lg mt-0.5 ${isSelected ? 'bg-gold text-steel-dark font-black' : 'bg-steel/40 text-gold'}`}>
                      {result.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs sm:text-sm font-mono text-sand truncate">
                          {result.title}
                        </span>
                        {result.badge && (
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-gold text-steel-dark' : 'bg-steel/50 text-sand/60'
                          }`}>
                            {result.badge}
                          </span>
                        )}
                      </div>
                      {result.sublabel && (
                        <p className="text-[11px] text-sand/60 font-sans mt-0.5 line-clamp-1">
                          {result.sublabel}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 text-sand/40">
                    <span className="text-[10px] font-mono hidden sm:inline text-sand/40">{result.category}</span>
                    <ArrowRight size={14} className={isSelected ? 'text-gold translate-x-1 transition-transform' : 'text-sand/30'} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Helper */}
        <div className="px-4 py-2 border-t border-steel/60 bg-steel/30 flex items-center justify-between text-[11px] font-mono text-sand/50">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-steel/60 border border-steel/80 rounded text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-steel/60 border border-steel/80 rounded text-[10px]">↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-steel/60 border border-steel/80 rounded text-[10px]">↵</kbd> Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-steel/60 border border-steel/80 rounded text-[10px]">ESC</kbd> Close
            </span>
          </div>
          <span className="text-gold font-bold text-[10px]">100% Client-Side Instant Search</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPaletteModal;
