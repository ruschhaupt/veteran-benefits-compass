import React from 'react';
import {
  Calendar, Award, Calculator, Home, DollarSign,
  Phone, Cpu, Sparkles, Shield, Activity, Flag, Compass, GraduationCap
} from 'lucide-react';

export const LIFE_EVENT_PILLARS = [
  {
    id: 'transition',
    pillar: 'life',
    icon: <Calendar size={15} />,
    label: 'Separation & ETS',
    sublabel: 'SkillBridge & 180-Day BDD',
    badge: 'Pillar 1'
  },
  {
    id: 'tracker',
    pillar: 'life',
    icon: <Calendar size={15} />,
    label: 'Mission Timeline',
    sublabel: 'Your Life in Months',
    badge: 'P0 Feature'
  },
  {
    id: 'grader',
    pillar: 'claims',
    icon: <Award size={15} />,
    label: 'Claim Strength Grader',
    sublabel: 'A+ to D Rubric & DBQs',
    badge: 'New'
  },
  {
    id: 'vamath',
    pillar: 'claims',
    icon: <Calculator size={15} />,
    label: 'VA Math & 100% Path',
    sublabel: '38 CFR § 4.25 Combinator'
  },
  {
    id: 'pact',
    pillar: 'claims',
    icon: <Shield size={15} />,
    label: 'PACT Act Screener',
    sublabel: 'Toxic Exposure Presumptives'
  },
  {
    id: 'claims',
    pillar: 'claims',
    icon: <Activity size={15} />,
    label: 'C&P Exam Simulator',
    sublabel: 'Practice DBQ Questions'
  },
  {
    id: 'househack',
    pillar: 'wealth',
    icon: <Home size={15} />,
    label: 'VA Loan & House Hacker',
    sublabel: 'Zero-Down & Refi Engine'
  },
  {
    id: 'education',
    pillar: 'life',
    icon: <GraduationCap size={15} />,
    label: 'Education & GI Bill',
    sublabel: 'VR&E 48-Mo Stacking'
  },
  {
    id: 'statematrix',
    pillar: 'wealth',
    icon: <Flag size={15} />,
    label: '50-State Matrix',
    sublabel: 'Property Tax & Tuition Shields'
  },
  {
    id: 'scorecard',
    pillar: 'wealth',
    icon: <DollarSign size={15} />,
    label: 'Wealth Scorecard',
    sublabel: 'Shareable Mission Debrief'
  },
  {
    id: 'avenues',
    pillar: 'life',
    icon: <Compass size={15} />,
    label: 'Career & Life Playbooks',
    sublabel: 'Education, Federal GS, SDVOSB'
  },
  {
    id: 'scanner',
    pillar: 'claims',
    icon: <Cpu size={15} />,
    label: 'Med Record Scanner',
    sublabel: 'In-Browser DC Code Matcher'
  },
  {
    id: 'perks',
    pillar: 'wealth',
    icon: <Sparkles size={15} />,
    label: 'High-Value Perks',
    sublabel: 'Space-A, Dental, Grants'
  },
  {
    id: 'directory',
    pillar: 'life',
    icon: <Phone size={15} />,
    label: 'Crisis & Resources',
    sublabel: 'VSOs, Hotlines & Forms'
  }
];

export const LifeEventNav = ({ activeTab, onSelectTab }) => {
  return (
    <nav aria-label="Main command post navigation" className="bg-steel-dark/95 border-b border-steel/50 sticky top-0 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none no-scrollbar">
          {LIFE_EVENT_PILLARS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 border select-none ${
                  isActive
                    ? 'bg-gold text-steel-dark border-gold font-black shadow-lg shadow-gold/10'
                    : 'bg-steel/30 border-steel/60 text-sand/70 hover:text-sand hover:border-gold/40 hover:bg-steel/50 font-bold'
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
      </div>
    </nav>
  );
};

export default LifeEventNav;
