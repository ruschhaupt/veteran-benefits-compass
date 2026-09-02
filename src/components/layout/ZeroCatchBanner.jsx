import React from 'react';
import { ShieldCheck, Lock, EyeOff } from 'lucide-react';

export const ZeroCatchBanner = () => {
  return (
    <aside aria-label="Privacy & Transparency Guarantee" className="bg-steel-dark/95 border-b border-steel/60 px-3 py-1.5 text-[11px] font-mono text-sand/80 flex items-center justify-center gap-3 sm:gap-6 flex-wrap select-none z-40 relative">
      <div className="flex items-center gap-1.5 text-gold font-bold">
        <ShieldCheck size={13} className="text-gold flex-shrink-0" />
        <span>100% FREE VETERAN TOOL</span>
      </div>
      <div className="hidden md:inline text-sand/30">•</div>
      <div className="flex items-center gap-1 text-sand/70">
        <Lock size={12} className="text-emerald-400 flex-shrink-0" />
        <span>100% In-Browser Privacy</span>
      </div>
      <div className="hidden sm:inline text-sand/30">•</div>
      <div className="flex items-center gap-1 text-sand/70">
        <EyeOff size={12} className="text-sand/50 flex-shrink-0" />
        <span>Zero Account Required • Zero Data Sold • Direct 38 CFR Citations</span>
      </div>
    </aside>
  );
};

export default ZeroCatchBanner;
