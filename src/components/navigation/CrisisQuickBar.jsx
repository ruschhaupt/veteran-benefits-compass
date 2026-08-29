import React, { useState } from 'react';
import { Phone, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

export const CrisisQuickBar = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-red-950/90 border-b border-scarlet/60 text-sand px-3 py-1.5 text-xs font-mono select-none z-30 relative transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-scarlet opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="font-black text-scarlet tracking-wider uppercase flex items-center gap-1 text-[11px]">
            <Phone size={12} className="text-scarlet" />
            24/7 CRISIS RESPONSE:
          </span>
          <span className="text-sand/90 text-[11px]">
            Dial <strong className="text-white font-bold bg-scarlet/40 px-1.5 py-0.5 rounded border border-scarlet/50">988, Press 1</strong>
          </span>
          <span className="hidden sm:inline text-sand/40">•</span>
          <span className="hidden sm:inline text-sand/90 text-[11px]">
            Text <strong className="text-gold font-bold">838255</strong>
          </span>
          <span className="hidden md:inline text-sand/40">•</span>
          <span className="hidden md:inline text-sand/80 text-[11px]">
            Free, Confidential, 24/7/365
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[10px] text-sand/80 hover:text-gold uppercase font-bold flex items-center gap-1 transition-colors px-2 py-0.5 rounded bg-black/30 border border-scarlet/30"
          >
            <span>{expanded ? 'Hide Crisis Resources' : 'More Crisis Resources'}</span>
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-scarlet/40 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px] animate-fade-in font-sans">
          <a
            href="tel:988"
            className="p-2 rounded-lg bg-black/40 border border-scarlet/40 hover:border-gold text-sand/90 flex flex-col gap-0.5 transition-all"
          >
            <div className="font-mono font-bold text-scarlet flex items-center justify-between">
              <span>Veterans Crisis Line</span>
              <ExternalLink size={10} />
            </div>
            <div className="text-[10px] text-sand/60">Dial 988, Press 1 (Immediate Suicide Prevention)</div>
          </a>

          <a
            href="tel:8774243838"
            className="p-2 rounded-lg bg-black/40 border border-scarlet/40 hover:border-gold text-sand/90 flex flex-col gap-0.5 transition-all"
          >
            <div className="font-mono font-bold text-gold flex items-center justify-between">
              <span>National Homeless Vet Line</span>
              <ExternalLink size={10} />
            </div>
            <div className="text-[10px] text-sand/60">1-877-4AID-VET (24/7 Housing Crisis)</div>
          </a>

          <a
            href="tel:8779278387"
            className="p-2 rounded-lg bg-black/40 border border-scarlet/40 hover:border-gold text-sand/90 flex flex-col gap-0.5 transition-all"
          >
            <div className="font-mono font-bold text-emerald-400 flex items-center justify-between">
              <span>Vet Center Call Center</span>
              <ExternalLink size={10} />
            </div>
            <div className="text-[10px] text-sand/60">1-877-WAR-VETS (Free Combat & MST Counseling)</div>
          </a>

          <a
            href="tel:8558296636"
            className="p-2 rounded-lg bg-black/40 border border-scarlet/40 hover:border-gold text-sand/90 flex flex-col gap-0.5 transition-all"
          >
            <div className="font-mono font-bold text-sky-400 flex items-center justify-between">
              <span>Women Veterans Call Center</span>
              <ExternalLink size={10} />
            </div>
            <div className="text-[10px] text-sand/60">1-855-VA-WOMEN (VA Care & Maternity Support)</div>
          </a>
        </div>
      )}
    </div>
  );
};

export default CrisisQuickBar;
