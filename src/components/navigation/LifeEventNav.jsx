import React, { useRef, useState, useEffect } from 'react';
import {
  Calendar, Award, Calculator, Home, DollarSign,
  Phone, Cpu, Sparkles, Shield, Activity, Flag, Compass,
  GraduationCap, Briefcase, ChevronLeft, ChevronRight, LayoutGrid, X, Check,
  Heart
} from 'lucide-react';

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
    category: 'transition',
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
    category: 'crisis',
    icon: <Phone size={14} />,
    label: 'VSOs & Crisis Hotlines',
    sublabel: 'Accredited VSOs & Emergency'
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Modules (19)' },
  { id: 'claims', label: 'Claims & Ratings' },
  { id: 'wealth', label: 'Wealth, Housing & Family' },
  { id: 'transition', label: 'Transition & Career' },
  { id: 'crisis', label: 'VSO Directory & Crisis' }
];

export const LifeEventNav = ({ activeTab, onSelectTab }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAllDrawer, setShowAllDrawer] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  const filteredTabs = selectedCategory === 'all'
    ? LIFE_EVENT_PILLARS
    : LIFE_EVENT_PILLARS.filter(t => t.category === selectedCategory || t.id === 'summary');

  return (
    <nav aria-label="Main navigation" className="bg-steel-dark/95 border-b border-steel/60 sticky top-0 z-30 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 space-y-1.5 py-2">
        {/* Top Control Bar: Category Filters & "View All Modules" Grid Trigger */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none pb-1 text-xs font-mono">
          <div className="flex items-center gap-1.5 flex-nowrap">
            {CATEGORIES.map(cat => {
              const isCatActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
                  }}
                  className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap font-bold select-none ${
                    isCatActive
                      ? 'bg-gold/20 text-gold border border-gold/50 shadow-sm'
                      : 'bg-steel/30 text-sand/60 hover:text-sand hover:bg-steel/50 border border-steel/40'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* View All Drawer Trigger */}
          <button
            onClick={() => setShowAllDrawer(!showAllDrawer)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-steel/50 hover:bg-steel border border-steel/60 text-sand/80 hover:text-gold font-bold whitespace-nowrap flex-shrink-0 transition-all text-xs"
          >
            <LayoutGrid size={13} />
            <span>{showAllDrawer ? 'Close Grid' : 'All Modules'}</span>
          </button>
        </div>

        {/* Horizontal Scrollable Tabs Row with Smooth Nav Controls */}
        <div className="relative flex items-center group">
          {/* Scroll Left Button */}
          {canScrollLeft && (
            <button
              onClick={() => handleScroll('left')}
              className="absolute left-0 z-20 h-full px-2 bg-gradient-to-r from-steel-dark via-steel-dark/90 to-transparent flex items-center text-gold hover:text-sand transition-all"
              aria-label="Scroll left"
            >
              <div className="w-6 h-6 rounded-full bg-steel border border-steel/60 flex items-center justify-center shadow-md">
                <ChevronLeft size={14} />
              </div>
            </button>
          )}

          {/* Main Scrollable Track */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none no-scrollbar w-full scroll-smooth"
          >
            {filteredTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 border select-none ${
                    isActive
                      ? 'bg-gold text-steel-dark border-gold font-black shadow-md'
                      : 'bg-steel/30 border-steel/60 text-sand/80 hover:text-sand hover:border-gold/40 hover:bg-steel/50 font-bold'
                  }`}
                >
                  <span className={isActive ? 'text-steel-dark' : 'text-gold'}>{tab.icon}</span>
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      isActive ? 'bg-steel-dark text-gold' : 'bg-gold/20 text-gold border border-gold/40'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          {canScrollRight && (
            <button
              onClick={() => handleScroll('right')}
              className="absolute right-0 z-20 h-full px-2 bg-gradient-to-l from-steel-dark via-steel-dark/90 to-transparent flex items-center text-gold hover:text-sand transition-all"
              aria-label="Scroll right"
            >
              <div className="w-6 h-6 rounded-full bg-steel border border-steel/60 flex items-center justify-center shadow-md">
                <ChevronRight size={14} />
              </div>
            </button>
          )}
        </div>
      </div>

      {/* "All Modules" Grid Modal Overlay */}
      {showAllDrawer && (
        <div className="border-t border-steel/60 bg-steel-dark/95 backdrop-blur-xl p-4 sm:p-6 shadow-2xl animate-fade-in">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex items-center justify-between border-b border-steel/50 pb-2">
              <div className="flex items-center gap-2 text-gold font-mono font-bold text-xs uppercase">
                <LayoutGrid size={15} /> Complete Command Module Grid (19 Applications)
              </div>
              <button
                onClick={() => setShowAllDrawer(false)}
                className="text-xs font-mono text-sand/60 hover:text-gold uppercase font-bold flex items-center gap-1"
              >
                <X size={14} /> Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {LIFE_EVENT_PILLARS.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onSelectTab(tab.id);
                      setShowAllDrawer(false);
                    }}
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
        </div>
      )}
    </nav>
  );
};

export default LifeEventNav;
