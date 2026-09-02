import React, { useState, useRef, useEffect } from 'react';
import {
  Home, Award, Calculator, DollarSign,
  Phone, Cpu, Shield, Activity, Flag, Compass,
  GraduationCap, Briefcase, ChevronDown,
  Heart, Calendar, Sparkles, LayoutGrid, X, Check
} from 'lucide-react';

// All 19 modules — unchanged data, just organized into groups
export const LIFE_EVENT_PILLARS = [
  {
    id: 'summary',
    category: 'home',
    icon: <Home size={14} />,
    label: 'Dashboard',
    sublabel: 'Overview & Persona Selector',
    badge: 'Home'
  },
  {
    id: 'transition',
    category: 'transition',
    icon: <Calendar size={14} />,
    label: 'Separation & ETS',
    sublabel: 'SkillBridge & 180-Day BDD',
    badge: '1-4 Yrs'
  },
  {
    id: 'guardreserve',
    category: 'transition',
    icon: <Shield size={14} />,
    label: 'Guard & Reserve',
    sublabel: 'Drill Pay vs VA Comp Offset',
    badge: 'Guard/Res'
  },
  {
    id: 'retireecrdp',
    category: 'wealth',
    icon: <Award size={14} />,
    label: 'Retiree CRDP / CRSC',
    sublabel: '20-Year Pension + 100% VA Pay',
    badge: '20+ Yrs'
  },
  {
    id: 'familybenefits',
    category: 'wealth',
    icon: <Heart size={14} />,
    label: '100% P&T Family Shield',
    sublabel: 'Chapter 35 DEA, CHAMPVA & TPD',
    badge: '100% P&T'
  },
  {
    id: 'tracker',
    category: 'help',
    icon: <Calendar size={14} />,
    label: 'Mission Timeline',
    sublabel: 'Statutory Countdown Clocks',
    badge: 'Deadlines'
  },
  {
    id: 'grader',
    category: 'claims',
    icon: <Award size={14} />,
    label: 'Claim Strength Grader',
    sublabel: 'Caluza Rubric & DBQ Prep Sheet',
    badge: 'Top Tool'
  },
  {
    id: 'vamath',
    category: 'claims',
    icon: <Calculator size={14} />,
    label: 'VA Math & Secondaries',
    sublabel: '38 CFR § 4.25 Combinator'
  },
  {
    id: 'pact',
    category: 'claims',
    icon: <Shield size={14} />,
    label: 'PACT Act Screener',
    sublabel: 'Toxic Exposure Presumptives'
  },
  {
    id: 'claims',
    category: 'claims',
    icon: <Activity size={14} />,
    label: 'C&P Exam Simulator',
    sublabel: 'Practice DBQ Questions'
  },
  {
    id: 'househack',
    category: 'wealth',
    icon: <Home size={14} />,
    label: 'VA Loan House Hacker',
    sublabel: '0% Down 2-4 Units & IRRRL'
  },
  {
    id: 'education',
    category: 'transition',
    icon: <GraduationCap size={14} />,
    label: 'GI Bill & VR&E Stacking',
    sublabel: '48-Month + Chapter 31 Engine'
  },
  {
    id: 'vocrehab',
    category: 'transition',
    icon: <Briefcase size={14} />,
    label: 'Voc Rehab (VR&E)',
    sublabel: '5 Tracks & Counselor Intake Script',
    badge: '100% Paid'
  },
  {
    id: 'statematrix',
    category: 'wealth',
    icon: <Flag size={14} />,
    label: '50-State Matrix',
    sublabel: 'Property Tax & Tuition Shields'
  },
  {
    id: 'scorecard',
    category: 'wealth',
    icon: <DollarSign size={14} />,
    label: 'Wealth Scorecard',
    sublabel: 'Shareable Mission Debrief'
  },
  {
    id: 'avenues',
    category: 'transition',
    icon: <Compass size={14} />,
    label: 'Federal GS & SDVOSB',
    sublabel: 'FERS Buyback & 10-Pt Preference'
  },
  {
    id: 'scanner',
    category: 'claims',
    icon: <Cpu size={14} />,
    label: 'Medical Record Scanner',
    sublabel: 'In-Browser Diagnostic Code Match'
  },
  {
    id: 'perks',
    category: 'wealth',
    icon: <Sparkles size={14} />,
    label: 'High-Value Perks',
    sublabel: 'Space-A, Free Dental, SAH Grants'
  },
  {
    id: 'directory',
    category: 'help',
    icon: <Phone size={14} />,
    label: 'VSOs & Crisis Hotlines',
    sublabel: 'Accredited VSOs & Emergency'
  }
];

// Navigation section groups
const NAV_SECTIONS = [
  {
    id: 'home',
    label: 'Dashboard',
    icon: <Home size={15} />,
    tabs: ['summary']
  },
  {
    id: 'claims',
    label: 'Claims & Ratings',
    icon: <Award size={15} />,
    tabs: ['grader', 'vamath', 'pact', 'claims', 'scanner']
  },
  {
    id: 'transition',
    label: 'Transition & Career',
    icon: <Briefcase size={15} />,
    tabs: ['transition', 'guardreserve', 'education', 'vocrehab', 'avenues']
  },
  {
    id: 'wealth',
    label: 'Money & Housing',
    icon: <DollarSign size={15} />,
    tabs: ['househack', 'statematrix', 'retireecrdp', 'scorecard', 'familybenefits', 'perks']
  },
  {
    id: 'help',
    label: 'Help & Resources',
    icon: <Phone size={15} />,
    tabs: ['tracker', 'directory']
  }
];

// Keep the old CATEGORIES export for backward compatibility
export const CATEGORIES = [
  { id: 'all', label: 'All Modules (19)' },
  { id: 'claims', label: 'Claims & Ratings' },
  { id: 'wealth', label: 'Wealth, Housing & Family' },
  { id: 'transition', label: 'Transition & Career' },
  { id: 'crisis', label: 'VSO Directory & Crisis' }
];

// Lookup helpers
const tabMap = Object.fromEntries(LIFE_EVENT_PILLARS.map(t => [t.id, t]));
const getSection = (tabId) => NAV_SECTIONS.find(s => s.tabs.includes(tabId)) || NAV_SECTIONS[0];

export const LifeEventNav = ({ activeTab, onSelectTab }) => {
  const [openSection, setOpenSection] = useState(null);
  const [showAllDrawer, setShowAllDrawer] = useState(false);
  const navRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenSection(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeSection = getSection(activeTab);

  const handleSectionClick = (sectionId) => {
    const section = NAV_SECTIONS.find(s => s.id === sectionId);
    // Dashboard has only one tab — go directly
    if (section && section.tabs.length === 1) {
      onSelectTab(section.tabs[0]);
      setOpenSection(null);
      return;
    }
    setOpenSection(openSection === sectionId ? null : sectionId);
  };

  const handleTabSelect = (tabId) => {
    onSelectTab(tabId);
    setOpenSection(null);
    setShowAllDrawer(false);
  };

  return (
    <nav ref={navRef} aria-label="Main navigation" className="bg-steel-dark/95 border-b border-steel/60 sticky top-0 z-30 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2">
        {/* Desktop: Section buttons in a row */}
        <div className="flex items-center gap-1.5">
          {NAV_SECTIONS.map(section => {
            const isSectionActive = activeSection.id === section.id;
            const isOpen = openSection === section.id;
            const hasSubs = section.tabs.length > 1;

            return (
              <div key={section.id} className="relative">
                <button
                  onClick={() => handleSectionClick(section.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all border select-none ${
                    isSectionActive
                      ? 'bg-gold/15 border-gold/50 text-gold shadow-sm'
                      : 'bg-steel/20 border-steel/50 text-sand/70 hover:text-sand hover:border-gold/40 hover:bg-steel/40'
                  }`}
                  aria-expanded={isOpen}
                >
                  <span className={isSectionActive ? 'text-gold' : 'text-sand/50'}>{section.icon}</span>
                  <span className="hidden sm:inline">{section.label}</span>
                  {hasSubs && (
                    <ChevronDown size={11} className={`transition-transform ${isOpen ? 'rotate-180' : ''} ${isSectionActive ? 'text-gold/60' : 'text-sand/40'}`} />
                  )}
                </button>

                {/* Dropdown Panel */}
                {isOpen && hasSubs && (
                  <div className="absolute top-full left-0 mt-1 w-72 bg-steel-dark border border-steel/60 rounded-xl shadow-2xl overflow-hidden animate-fade-in z-50">
                    <div className="p-1.5 space-y-0.5">
                      {section.tabs.map(tabId => {
                        const tab = tabMap[tabId];
                        if (!tab) return null;
                        const isActive = activeTab === tabId;
                        return (
                          <button
                            key={tabId}
                            onClick={() => handleTabSelect(tabId)}
                            className={`w-full text-left p-2.5 rounded-lg transition-all flex items-start gap-2.5 ${
                              isActive
                                ? 'bg-gold/15 border border-gold/40'
                                : 'hover:bg-steel/40 border border-transparent'
                            }`}
                          >
                            <span className={`mt-0.5 flex-shrink-0 ${isActive ? 'text-gold' : 'text-sand/50'}`}>{tab.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className={`text-xs font-mono font-bold truncate ${isActive ? 'text-sand' : 'text-sand/80'}`}>
                                  {tab.label}
                                </span>
                                {tab.badge && (
                                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold flex-shrink-0 ${
                                    isActive ? 'bg-gold text-steel-dark' : 'bg-steel/40 text-sand/50'
                                  }`}>
                                    {tab.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-sand/50 mt-0.5 leading-tight">{tab.sublabel}</p>
                            </div>
                            {isActive && <Check size={13} className="text-gold mt-0.5 flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Spacer */}
          <div className="flex-1" />

          {/* All Modules Grid Button */}
          <button
            onClick={() => { setShowAllDrawer(!showAllDrawer); setOpenSection(null); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-steel/30 hover:bg-steel/50 border border-steel/50 text-sand/60 hover:text-gold font-mono text-xs font-bold transition-all select-none flex-shrink-0"
          >
            <LayoutGrid size={13} />
            <span className="hidden sm:inline">{showAllDrawer ? 'Close' : 'All 19'}</span>
          </button>
        </div>
      </div>

      {/* "All Modules" Full Grid Overlay */}
      {showAllDrawer && (
        <div className="border-t border-steel/60 bg-steel-dark/95 backdrop-blur-xl p-4 sm:p-6 shadow-2xl animate-fade-in">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex items-center justify-between border-b border-steel/50 pb-2">
              <div className="flex items-center gap-2 text-gold font-mono font-bold text-xs uppercase">
                <LayoutGrid size={15} /> All 19 Modules
              </div>
              <button
                onClick={() => setShowAllDrawer(false)}
                className="text-xs font-mono text-sand/60 hover:text-gold uppercase font-bold flex items-center gap-1"
              >
                <X size={14} /> Close
              </button>
            </div>

            {/* Render by section group */}
            {NAV_SECTIONS.filter(s => s.tabs.length > 0).map(section => (
              <div key={section.id} className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-mono uppercase text-sand/50 font-bold">
                  {section.icon}
                  <span>{section.label}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {section.tabs.map(tabId => {
                    const tab = tabMap[tabId];
                    if (!tab) return null;
                    const isActive = activeTab === tabId;
                    return (
                      <button
                        key={tabId}
                        onClick={() => handleTabSelect(tabId)}
                        className={`p-3 rounded-xl border text-left transition-all space-y-1 select-none flex flex-col justify-between ${
                          isActive
                            ? 'bg-gold/15 border-gold shadow-md text-sand'
                            : 'bg-steel/30 border-steel/60 hover:border-gold/50 text-sand/80 hover:bg-steel/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gold font-bold font-mono text-xs">
                            <span>{tab.icon}</span>
                            <span className="text-sand">{tab.label}</span>
                          </div>
                          {isActive && <Check size={14} className="text-gold" />}
                        </div>
                        <p className="text-[10px] text-sand/60 leading-tight font-sans">{tab.sublabel}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default LifeEventNav;
