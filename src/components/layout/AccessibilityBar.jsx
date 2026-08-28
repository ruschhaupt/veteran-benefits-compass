import React from 'react';
import { BookOpen, Moon, Type, SunMedium } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

export const AccessibilityBar = () => {
  const {
    readerMode,
    calmMode,
    fontSize,
    highContrast,
    toggleReaderMode,
    toggleCalmMode,
    toggleHighContrast,
    cycleFontSize
  } = useAccessibility();

  return (
    <nav aria-label="Accessibility settings" className="bg-steel-dark/95 border-b border-steel/50 px-4 py-2 text-xs font-mono text-sand/70 flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase font-bold text-gold/80 tracking-wider">
          Accessibility Suite (WCAG 2.2 AA):
        </span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
        {/* Reader Mode Toggle */}
        <button
          onClick={toggleReaderMode}
          className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 transition-all ${
            readerMode
              ? 'bg-sand text-steel-dark border-sand'
              : 'bg-steel/30 border-steel/60 text-sand/80 hover:border-gold hover:text-gold'
          }`}
          title="Toggle Reader Mode (Strips decorative colors/cards for pure readability)"
          aria-pressed={readerMode}
        >
          <BookOpen size={12} />
          <span>{readerMode ? 'Reader: ON' : 'Reader Mode'}</span>
        </button>

        {/* Calm Mode Toggle */}
        <button
          onClick={toggleCalmMode}
          className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 transition-all ${
            calmMode
              ? 'bg-emerald-900/60 text-emerald-300 border-emerald-500/50'
              : 'bg-steel/30 border-steel/60 text-sand/80 hover:border-gold hover:text-gold'
          }`}
          title="Toggle Calm Mode (Disables animations, pulsing, and rapid transitions for PTSD/TBI relief)"
          aria-pressed={calmMode}
        >
          <Moon size={12} />
          <span>{calmMode ? 'Calm: ON' : 'Calm Mode'}</span>
        </button>

        {/* High Contrast Toggle */}
        <button
          onClick={toggleHighContrast}
          className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 transition-all ${
            highContrast
              ? 'bg-yellow-500 text-steel-dark border-yellow-400'
              : 'bg-steel/30 border-steel/60 text-sand/80 hover:border-gold hover:text-gold'
          }`}
          title="Toggle High Contrast Mode"
          aria-pressed={highContrast}
        >
          <SunMedium size={12} />
          <span>Contrast</span>
        </button>

        {/* Font Size Scaling */}
        <button
          onClick={cycleFontSize}
          className="px-2.5 py-1 rounded-lg border border-steel/60 bg-steel/30 text-sand/80 hover:border-gold hover:text-gold text-[11px] font-bold flex items-center gap-1 transition-all"
          title="Cycle Text Size (100% -> 125% -> 150%)"
        >
          <Type size={12} />
          <span>Text: {fontSize}%</span>
        </button>
      </div>
    </nav>
  );
};

export default AccessibilityBar;
