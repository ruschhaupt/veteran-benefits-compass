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

  // Close dropdown on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenSection(null);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpenSection(null);
        setShowAllDrawer(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const activeSection = getSectionForTab(activeTab);

  const handleSectionClick = (sectionId) => {
    setShowAllDrawer(false);
    const section = NAV_SECTIONS.find(s => s.id === sectionId);
    // If Dashboard, jump directly
    if (section && section.tabs.length === 1) {
      onSelectTab(section.tabs[0]);
      setOpenSection(null);
      return;
    }
    // Toggle dropdown
    setOpenSection(prev => (prev === sectionId ? null : sectionId));
  };

  const handleTabSelect = (tabId) => {
    onSelectTab(tabId);
    setOpenSection(null);
    setShowAllDrawer(false);
  };

  const openSectionData = NAV_SECTIONS.find(s => s.id === openSection);

  return (
    <nav ref={navRef} aria-label="Main navigation" className="bg-steel-dark/95 border-b border-steel/60 sticky top-0 z-30 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Scrollable Category Section Buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar scrollbar-none py-0.5 flex-1 min-w-0">
            {NAV_SECTIONS.map(section => {
              const isSectionActive = activeSection.id === section.id;
              const isOpen = openSection === section.id;
              const hasSubs = section.tabs.length > 1;

              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all border select-none whitespace-nowrap flex-shrink-0 cursor-pointer ${
                    isOpen
                      ? 'bg-gold/20 border-gold text-gold shadow-md ring-1 ring-gold/50'
                      : isSectionActive && !openSection
                        ? 'bg-gold/15 border-gold/60 text-gold shadow-sm'
                        : 'bg-steel/20 border-steel/50 text-sand/70 hover:text-sand hover:border-gold/40 hover:bg-steel/40'
                  }`}
                  aria-expanded={isOpen}
                  aria-haspopup={hasSubs ? 'true' : 'false'}
                >
                  <span className={isOpen || (isSectionActive && !openSection) ? 'text-gold' : 'text-sand/50'}>
                    {section.icon}
                  </span>
                  <span className="hidden sm:inline">{section.label}</span>
                  <span className="inline sm:hidden">{section.shortLabel}</span>
                  {hasSubs && (
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-gold' : isSectionActive ? 'text-gold/60' : 'text-sand/40'}`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Action Utility Buttons: Search & All Grid */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            {onOpenSearch && (
              <button
                onClick={() => {
                  setOpenSection(null);
                  setShowAllDrawer(false);
                  onOpenSearch();
                }}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-steel/30 hover:bg-steel/50 border border-steel/50 text-sand/70 hover:text-gold font-mono text-xs font-bold transition-all select-none cursor-pointer"
                title="Search all benefits, conditions, and statutes (Cmd+K)"
              >
                <Search size={13} className="text-gold" />
                <span className="hidden md:inline">Search</span>
              </button>
            )}

            <button
              onClick={() => {
                setOpenSection(null);
                setShowAllDrawer(prev => !prev);
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-steel/30 hover:bg-steel/50 border border-steel/50 text-sand/60 hover:text-gold font-mono text-xs font-bold transition-all select-none cursor-pointer"
              title="View all 19 modules grid"
            >
              <LayoutGrid size={13} />
              <span className="hidden sm:inline">{showAllDrawer ? 'Close' : 'All 19'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Robust, Non-Clipped Dropdown Panel for the Active Section */}
      {openSection && openSectionData && openSectionData.tabs.length > 1 && (
        <div className="border-t border-steel/60 bg-steel-dark/98 backdrop-blur-xl shadow-2xl p-3 sm:p-5 animate-fade-in z-50">
          <div className="max-w-7xl mx-auto space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-steel/50">
              <div className="flex items-center gap-2 text-gold font-mono font-bold text-xs uppercase tracking-wider">
                <span>{openSectionData.icon}</span>
                <span>{openSectionData.label} — {openSectionData.tabs.length} Command Modules</span>
              </div>
              <button
                onClick={() => setOpenSection(null)}
                className="text-sand/50 hover:text-gold text-xs font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <X size={13} /> Close Menu
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {openSectionData.tabs.map(tabId => {
                const tab = tabMap[tabId];
                if (!tab) return null;
                const isActive = activeTab === tabId;
                return (
                  <button
                    key={tabId}
                    onClick={() => handleTabSelect(tabId)}
                    className={`p-3 rounded-xl border text-left transition-all space-y-1.5 flex flex-col justify-between select-none cursor-pointer ${
                      isActive
                        ? 'bg-gold/20 border-gold shadow-md text-sand ring-1 ring-gold/40'
                        : 'bg-steel/30 border-steel/60 hover:border-gold/50 text-sand/80 hover:bg-steel/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex items-center gap-2 text-gold font-bold font-mono text-xs">
                        <span>{tab.icon}</span>
                        <span className={isActive ? 'text-sand font-black' : 'text-sand'}>{tab.label}</span>
                      </div>
                      {isActive && <Check size={14} className="text-gold flex-shrink-0" />}
                    </div>
                    <p className="text-[11px] text-sand/60 font-sans leading-tight line-clamp-2">
                      {tab.sublabel}
                    </p>
                    {tab.badge && (
                      <div className="pt-1">
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isActive ? 'bg-gold text-steel-dark' : 'bg-steel/60 text-sand/60'
                        }`}>
                          {tab.badge}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* "All Modules" Full Grid Overlay */}
      {showAllDrawer && (
        <div className="border-t border-steel/60 bg-steel-dark/98 backdrop-blur-xl p-4 sm:p-6 shadow-2xl animate-fade-in max-h-[80vh] overflow-y-auto z-50">
          <div className="max-w-7xl mx-auto space-y-5">
            <div className="flex items-center justify-between border-b border-steel/50 pb-2">
              <div className="flex items-center gap-2 text-gold font-mono font-bold text-xs uppercase tracking-wider">
                <LayoutGrid size={15} /> All 19 Command Modules
              </div>
              <button
                onClick={() => setShowAllDrawer(false)}
                className="text-xs font-mono text-sand/60 hover:text-gold uppercase font-bold flex items-center gap-1 cursor-pointer"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  {section.tabs.map(tabId => {
                    const tab = tabMap[tabId];
                    if (!tab) return null;
                    const isActive = activeTab === tabId;
                    return (
                      <button
                        key={tabId}
                        onClick={() => handleTabSelect(tabId)}
                        className={`p-3 rounded-xl border text-left transition-all space-y-1 select-none flex flex-col justify-between cursor-pointer ${
                          isActive
                            ? 'bg-gold/20 border-gold shadow-md text-sand ring-1 ring-gold/40'
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
                        <p className="text-[10px] text-sand/60 leading-tight font-sans line-clamp-2">{tab.sublabel}</p>
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
