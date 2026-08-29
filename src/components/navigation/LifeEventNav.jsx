import React, { useRef, useState, useEffect } from 'react';
import {
  Calendar, Award, Calculator, Home, DollarSign,
  Phone, Cpu, Sparkles, Shield, Activity, Flag, Compass,
  GraduationCap, ChevronLeft, ChevronRight, LayoutGrid, X, Check
} from 'lucide-react';

export const LIFE_EVENT_PILLARS = [
  {
    id: 'summary',
    category: 'home',
    icon: <Home size={14} />,
    label: 'Command Post',
    sublabel: 'Overview & Quick Stack',
    badge: 'Home'
  },
  {
    id: 'transition',
    category: 'transition',
    icon: <Calendar size={14} />,
    label: 'Separation & ETS',
    sublabel: 'SkillBridge & 180-Day BDD',
    badge: 'Pillar 1'
  },
  {
    id: 'tracker',
    category: 'transition',
    icon: <Calendar size={14} />,
    label: 'Mission Timeline',
    sublabel: 'Your Life in Months',
    badge: 'P0'
  },
  {
    id: 'grader',
    category: 'claims',
    icon: <Award size={14} />,
    label: 'Claim Grader',
    sublabel: 'A+ to D Rubric & DBQs',
    badge: 'Top Tool'
  },
  {
    id: 'vamath',
    category: 'claims',
    icon: <Calculator size={14} />,
    label: 'VA Math & 100% Path',
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
    label: 'C&P Simulator',
    sublabel: 'Practice DBQ Questions'
  },
  {
    id: 'househack',
    category: 'wealth',
    icon: <Home size={14} />,
    label: 'VA Loan & House Hacker',
    sublabel: 'Zero-Down & Refi Engine'
  },
  {
    id: 'education',
    category: 'transition',
    icon: <GraduationCap size={14} />,
    label: 'Education & GI Bill',
    sublabel: 'VR&E 48-Mo Stacking'
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
    label: 'Career Playbooks',
    sublabel: 'Federal GS, FERS & SDVOSB'
  },
  {
    id: 'scanner',
    category: 'claims',
    icon: <Cpu size={14} />,
    label: 'Med Record Scanner',
    sublabel: 'In-Browser DC Code Matcher'
  },
  {
    id: 'perks',
    category: 'wealth',
    icon: <Sparkles size={14} />,
    label: 'High-Value Perks',
    sublabel: 'Space-A, Dental, Grants'
  },
  {
    id: 'directory',
    category: 'crisis',
    icon: <Phone size={14} />,
    label: 'VSOs & Crisis Hotline',
    sublabel: 'Accredited VSOs & Forms'
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Apps (15)' },
  { id: 'claims', label: '🎯 Claims & Ratings' },
  { id: 'wealth', label: '💰 Wealth & Housing' },
  { id: 'transition', label: '🧭 Transition & School' },
  { id: 'crisis', label: '🆘 Crisis & VSOs' }
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
    <nav aria-label="Main command post navigation" className="bg-steel-dark/95 border-b border-steel/60 sticky top-0 z-30 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 space-y-1.5 py-2">
        {/* Top Control Bar: Category Filters & "View All Modules" Grid Trigger */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none pb-1 text-[11px] font-mono">
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
                  className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap font-bold select-none ${
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
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-steel/50 hover:bg-steel border border-gold/40 text-gold font-bold whitespace-nowrap flex-shrink-0 shadow-sm transition-all"
          >
            <LayoutGrid size={13} />
            <span>{showAllDrawer ? 'Close Grid' : 'All Modules Grid'}</span>
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
                      ? 'bg-gold text-steel-dark border-gold font-black shadow-lg shadow-gold/10 scale-[1.02]'
                      : 'bg-steel/30 border-steel/60 text-sand/80 hover:text-sand hover:border-gold/40 hover:bg-steel/50 font-bold'
                  }`}
                >
                  <span className={isActive ? 'text-steel-dark' : 'text-gold'}>{tab.icon}</span>
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-tight ${
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
                <LayoutGrid size={15} /> Complete Tactical Command Grid (All 15 Apps)
              </div>
              <button
                onClick={() => setShowAllDrawer(false)}
                className="text-xs font-mono text-sand/60 hover:text-gold uppercase font-bold flex items-center gap-1"
              >
                <X size={14} /> Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {LIFE_EVENT_PILLARS.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onSelectTab(tab.id);
                      setShowAllDrawer(false);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all space-y-1 select-none flex flex-col justify-between ${
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
