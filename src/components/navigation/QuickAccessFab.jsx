import React, { useState } from 'react';
import { Compass, Award, Calculator, Phone, X, Search } from 'lucide-react';

const QUICK_LINKS = [
  { id: 'summary', label: 'Dashboard', icon: <Compass size={16} />, color: 'text-gold' },
  { id: 'grader', label: 'Claim Grader', icon: <Award size={16} />, color: 'text-emerald-400' },
  { id: 'vamath', label: 'VA Math', icon: <Calculator size={16} />, color: 'text-sky-400' },
  { id: 'directory', label: 'Crisis & VSO', icon: <Phone size={16} />, color: 'text-scarlet' },
];

export const QuickAccessFab = ({ onSelectTab, onOpenSearch }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (tabId) => {
    onSelectTab(tabId);
    setIsOpen(false);
  };

  const handleSearch = () => {
    setIsOpen(false);
    if (onOpenSearch) onOpenSearch();
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 md:hidden">
      {/* Quick Links Popover */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 bg-steel-dark border border-gold/40 rounded-2xl shadow-2xl p-2 space-y-1 animate-fade-in w-52">
          <div className="text-[10px] font-mono uppercase text-sand/50 font-bold px-2 pt-1 pb-1">Tactical Shortcuts</div>
          
          {onOpenSearch && (
            <button
              onClick={handleSearch}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-gold/15 border border-gold/40 hover:bg-gold/25 transition-all text-left mb-1"
            >
              <Search size={15} className="text-gold" />
              <span className="text-xs font-mono font-bold text-gold">Search Benefits...</span>
            </button>
          )}

          {QUICK_LINKS.map(link => (
            <button
              key={link.id}
              onClick={() => handleSelect(link.id)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-steel/40 transition-all text-left"
            >
              <span className={link.color}>{link.icon}</span>
              <span className="text-xs font-mono font-bold text-sand/90">{link.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all border ${
          isOpen
            ? 'bg-steel border-steel/60 text-sand/80'
            : 'bg-gold border-gold text-steel-dark shadow-gold/30'
        }`}
        aria-label="Quick access menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={20} /> : <Compass size={22} />}
      </button>
    </div>
  );
};

export default QuickAccessFab;
