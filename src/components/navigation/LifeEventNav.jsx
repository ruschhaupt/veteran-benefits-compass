import React, { useState, useRef, useEffect } from 'react';
import {
  Home, Award, Calculator, DollarSign,
  Phone, Cpu, Shield, Activity, Flag, Compass,
  GraduationCap, Briefcase, ChevronDown,
  Heart, Calendar, Sparkles, LayoutGrid, X, Check, Search
} from 'lucide-react';

// All 19 modules
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
export const NAV_SECTIONS = [
  {
    id: 'home',
    label: 'Dashboard',
    shortLabel: 'Home',
    icon: <Home size={15} />,
    tabs: ['summary']
  },
  {
    id: 'claims',
    label: 'Claims & Ratings',
    shortLabel: 'Claims',
    icon: <Award size={15} />,
    tabs: ['grader', 'vamath', 'pact', 'claims', 'scanner']
  },
  {
    id: 'transition',
    label: 'Transition & Career',
    shortLabel: 'Transition',
    icon: <Briefcase size={15} />,
    tabs: ['transition', 'guardreserve', 'education', 'vocrehab', 'avenues']
  },
  {
    id: 'wealth',
    label: 'Money & Housing',
    shortLabel: 'Money',
    icon: <DollarSign size={15} />,
    tabs: ['househack', 'statematrix', 'retireecrdp', 'scorecard', 'familybenefits', 'perks']
  },
  {
    id: 'help',
    label: 'Help & Resources',
    shortLabel: 'Help',
    icon: <Phone size={15} />,
    tabs: ['tracker', 'directory']
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Modules (19)' },
  { id: 'claims', label: 'Claims & Ratings' },
  { id: 'wealth', label: 'Wealth, Housing & Family' },
  { id: 'transition', label: 'Transition & Career' },
  { id: 'crisis', label: 'VSO Directory & Crisis' }
];

const tabMap = Object.fromEntries(LIFE_EVENT_PILLARS.map(t => [t.id, t]));
export const getSectionForTab = (tabId) => NAV_SECTIONS.find(s => s.tabs.includes(tabId)) || NAV_SECTIONS[0];

export const LifeEventNav = ({ activeTab, onSelectTab, onOpenSearch }) => {
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

  const activeSection = getSectionForTab(activeTab);

  const handleSectionClick = (sectionId) => {
    const section = NAV_SECTIONS.find(s => s.id === sectionId);
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
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Scrollable Section Bar on Mobile & Desktop */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar scrollbar-none py-0.5 flex-1 min-w-0">
            {NAV_SECTIONS.map(section => {
              const isSectionActive = activeSection.id === section.id;
              const isOpen = openSection === section.id;
              const hasSubs = section.tabs.length > 1;

              return (
                <div key={section.id} className="relative flex-shrink-0">
                  <button
                    onClick={() => handleSectionClick(section.id)}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all border select-none whitespace-nowrap ${
                      isSectionActive
                        ? 'bg-gold/15 border-gold/50 text-gold shadow-sm'
                        : 'bg-steel/20 border-steel/50 text-sand/70 hover:text-sand hover:border-gold/40 hover:bg-steel/40'
                    }`}
                    aria-expanded={isOpen}
                  >
                    <span className={isSectionActive ? 'text-gold' : 'text-sand/50'}>{section.icon}</span>
                    {/* Full label on tablet/desktop, clear short label on mobile */}
                    <span className="hidden sm:inline">{section.label}</span>
                    <span className="inline sm:hidden">{section.shortLabel}</span>
                    {hasSubs && (
                      <ChevronDown size={11} className={`transition-transform ${isOpen ? 'rotate-180' : ''} ${isSectionActive ? 'text-gold/60' : 'text-sand/40'}`} />
                    )}
                  </button>

                  {/* Desktop Dropdown Panel (md and up) */}
                  {isOpen && hasSubs && (
                    <div className="hidden md:block absolute top-full left-0 mt-1 w-80 bg-steel-dark border border-steel/60 rounded-xl shadow-2xl overflow-hidden animate-fade-in z-50">
                      <div className="p-1.5 space-y-0.5">
                        <div className="px-2.5 py-1 text-[10px] font-mono uppercase text-sand/40 font-bold border-b border-steel/40 mb-1">
                          {section.label}
                        </div>
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
                                      isActive ? 'bg-gold text-steel-dark font-black' : 'bg-steel/50 text-sand/60'
                                    }`}>
                                      {tab.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-sand/50 mt-0.5 leading-tight line-clamp-1">{tab.sublabel}</p>
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
          </div>

          {/* Quick Action Utility Buttons: Search & All Grid */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-steel/30 hover:bg-steel/50 border border-steel/50 text-sand/70 hover:text-gold font-mono text-xs font-bold transition-all select-none"
                title="Search all benefits, conditions, and statutes (Cmd+K)"
              >
                <Search size={13} className="text-gold" />
                <span className="hidden md:inline">Search</span>
              </button>
            )}

            <button
              onClick={() => { setShowAllDrawer(!showAllDrawer); setOpenSection(null); }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-steel/30 hover:bg-steel/50 border border-steel/50 text-sand/60 hover:text-gold font-mono text-xs font-bold transition-all select-none"
              title="View all 19 modules grid"
            >
              <LayoutGrid size={13} />
              <span className="hidden sm:inline">{showAllDrawer ? 'Close' : 'All 19'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Full-Width Section Drawer (< md) */}
        {openSection && (
          <div className="md:hidden mt-2 pt-2 border-t border-steel/50 animate-fade-in space-y-1">
            {(() => {
              const currentSec = NAV_SECTIONS.find(s => s.id === openSection);
              if (!currentSec || currentSec.tabs.length <= 1) return null;
              return (
                <div className="bg-steel/20 rounded-xl p-2 border border-steel/50 space-y-1">
                  <div className="flex items-center justify-between px-2 py-1 text-[11px] font-mono text-gold font-bold uppercase border-b border-steel/40">
                    <span>{currentSec.label}</span>
                    <button onClick={() => setOpenSection(null)} className="text-sand/50 hover:text-sand text-xs">✕</button>
                  </div>
                  <div className="grid grid-cols-1 gap-1 pt-1">
                    {currentSec.tabs.map(tabId => {
                      const tab = tabMap[tabId];
                      if (!tab) return null;
                      const isActive = activeTab === tabId;
                      return (
                        <button
                          key={tabId}
                          onClick={() => handleTabSelect(tabId)}
                          className={`w-full text-left p-2.5 rounded-lg transition-all flex items-center justify-between gap-2 ${
                            isActive
                              ? 'bg-gold/20 border border-gold/50 text-sand'
                              : 'bg-steel-dark/60 hover:bg-steel/50 text-sand/80 border border-steel/40'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={isActive ? 'text-gold' : 'text-sand/50'}>{tab.icon}</span>
                            <div className="min-w-0">
                              <div className="text-xs font-mono font-bold truncate text-sand">{tab.label}</div>
                              <div className="text-[10px] text-sand/50 truncate font-sans">{tab.sublabel}</div>
                            </div>
                          </div>
                          {tab.badge && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-steel text-sand/60 flex-shrink-0">
                              {tab.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* "All Modules" Full Grid Overlay */}
      {showAllDrawer && (
        <div className="border-t border-steel/60 bg-steel-dark/95 backdrop-blur-xl p-4 sm:p-6 shadow-2xl animate-fade-in max-h-[80vh] overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex items-center justify-between border-b border-steel/50 pb-2">
              <div className="flex items-center gap-2 text-gold font-mono font-bold text-xs uppercase">
                <LayoutGrid size={15} /> All 19 Command Modules
              </div>
              <button
                onClick={() => setShowAllDrawer(false)}
                className="text-xs font-mono text-sand/60 hover:text-gold uppercase font-bold flex items-center gap-1"
              >
                <X size={14} /> Close
              </button>
            </div>

            {NAV_SECTIONS.map(section => (
              <div key={section.id} className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-mono uppercase text-gold/80 font-bold">
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
