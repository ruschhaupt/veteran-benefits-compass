import React, { useState } from 'react';
import { Phone, ShieldCheck, Lock, BookOpen, Moon, SunMedium, Type, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

export const UtilityStrip = () => {
  const [showMore, setShowMore] = useState(false);
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
    <div className="bg-steel-dark border-b border-steel/50 text-xs font-mono select-none z-40 relative">
      {/* Main Single-Line Strip */}
      <div className="max-w-7xl mx-auto px-3 py-1.5 flex items-center justify-between gap-2 flex-wrap">
        {/* Left: Crisis Line — Always Visible */}
        <div className="flex items-center gap-3">
          <a
            href="tel:988"
            className="flex items-center gap-1.5 text-scarlet hover:text-red-400 transition-colors font-bold"
          >
            <span className="flex h-2 w-2 relative flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-scarlet opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <Phone size={11} />
            <span className="text-[11px]">988 Press 1</span>
          </a>
          <span className="text-sand/20 hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-1 text-sand/60 text-[10px]">
            <ShieldCheck size={11} className="text-gold/70" />
            <span>Free</span>
            <span className="text-sand/20">•</span>
            <Lock size={10} className="text-emerald-400/70" />
            <span>Private</span>
            <span className="text-sand/20">•</span>
            <span>No Account</span>
          </div>
        </div>

        {/* Right: Accessibility Compact Toggles + More */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleReaderMode}
            className={`p-1.5 rounded-md border transition-all ${
              readerMode
                ? 'bg-sand text-steel-dark border-sand'
                : 'bg-steel/20 border-steel/40 text-sand/50 hover:text-gold hover:border-gold/50'
            }`}
            title="Reader Mode"
            aria-pressed={readerMode}
            aria-label="Toggle Reader Mode"
          >
            <BookOpen size={12} />
          </button>

          <button
            onClick={toggleCalmMode}
            className={`p-1.5 rounded-md border transition-all ${
              calmMode
                ? 'bg-emerald-900/60 text-emerald-300 border-emerald-500/50'
                : 'bg-steel/20 border-steel/40 text-sand/50 hover:text-gold hover:border-gold/50'
            }`}
            title="Calm Mode (disables animations)"
            aria-pressed={calmMode}
            aria-label="Toggle Calm Mode"
          >
            <Moon size={12} />
          </button>

          <button
            onClick={toggleHighContrast}
            className={`p-1.5 rounded-md border transition-all ${
              highContrast
                ? 'bg-yellow-500 text-steel-dark border-yellow-400'
                : 'bg-steel/20 border-steel/40 text-sand/50 hover:text-gold hover:border-gold/50'
            }`}
            title="High Contrast"
            aria-pressed={highContrast}
            aria-label="Toggle High Contrast"
          >
            <SunMedium size={12} />
          </button>

          <button
            onClick={cycleFontSize}
            className="p-1.5 rounded-md border bg-steel/20 border-steel/40 text-sand/50 hover:text-gold hover:border-gold/50 transition-all text-[10px] font-bold min-w-[2rem] text-center"
            title={`Text Size: ${fontSize}%`}
            aria-label="Cycle Text Size"
          >
            <Type size={12} className="inline" />
          </button>

          <button
            onClick={() => setShowMore(!showMore)}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-steel/20 border border-steel/40 text-sand/50 hover:text-gold hover:border-gold/50 transition-all text-[10px] font-bold"
            aria-expanded={showMore}
          >
            <span className="hidden sm:inline">{showMore ? 'Less' : 'More'}</span>
            {showMore ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
          </button>
        </div>
      </div>

      {/* Expanded Section: Crisis Resources + Full Trust Details */}
      {showMore && (
        <div className="border-t border-steel/40 bg-steel-dark/95 animate-fade-in">
          <div className="max-w-7xl mx-auto px-3 py-3 space-y-3">
            <div className="text-[10px] uppercase font-bold text-scarlet tracking-wider mb-1">Crisis Resources — 24/7/365 • Free • Confidential</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-sans">
              <a
                href="tel:988"
                className="p-2.5 rounded-lg bg-steel/20 border border-scarlet/30 hover:border-gold text-sand/90 flex flex-col gap-0.5 transition-all"
              >
                <div className="font-mono font-bold text-scarlet flex items-center justify-between">
                  <span>Veterans Crisis Line</span>
                  <ExternalLink size={10} />
                </div>
                <div className="text-[10px] text-sand/60">Dial 988, Press 1 (Suicide Prevention)</div>
              </a>

              <a
                href="tel:8774243838"
                className="p-2.5 rounded-lg bg-steel/20 border border-steel/40 hover:border-gold text-sand/90 flex flex-col gap-0.5 transition-all"
              >
                <div className="font-mono font-bold text-gold flex items-center justify-between">
                  <span>Homeless Veteran Hotline</span>
                  <ExternalLink size={10} />
                </div>
                <div className="text-[10px] text-sand/60">1-877-4AID-VET (Housing Crisis)</div>
              </a>

              <a
                href="tel:8779278387"
                className="p-2.5 rounded-lg bg-steel/20 border border-steel/40 hover:border-gold text-sand/90 flex flex-col gap-0.5 transition-all"
              >
                <div className="font-mono font-bold text-emerald-400 flex items-center justify-between">
                  <span>Vet Center Call Center</span>
                  <ExternalLink size={10} />
                </div>
                <div className="text-[10px] text-sand/60">1-877-WAR-VETS (Combat & MST Counseling)</div>
              </a>

              <a
                href="tel:8558296636"
                className="p-2.5 rounded-lg bg-steel/20 border border-steel/40 hover:border-gold text-sand/90 flex flex-col gap-0.5 transition-all"
              >
                <div className="font-mono font-bold text-sky-400 flex items-center justify-between">
                  <span>Women Veterans Line</span>
                  <ExternalLink size={10} />
                </div>
                <div className="text-[10px] text-sand/60">1-855-VA-WOMEN (Care & Maternity)</div>
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[10px] text-sand/50 border-t border-steel/30 pt-2">
              <div className="flex items-center gap-1">
                <ShieldCheck size={11} className="text-gold/60" />
                <span>100% Free Veteran Tool — No Fees Ever</span>
              </div>
              <span className="text-sand/20">•</span>
              <div className="flex items-center gap-1">
                <Lock size={10} className="text-emerald-400/60" />
                <span>100% In-Browser Privacy — Zero Data Sold</span>
              </div>
              <span className="text-sand/20">•</span>
              <span>Direct 38 CFR Citations • WCAG 2.2 AA</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UtilityStrip;
