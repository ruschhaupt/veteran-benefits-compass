import React from 'react';
import { ShieldCheck, Lock, EyeOff } from 'lucide-react';

export const ZeroCatchBanner = () => {
  return (
    <aside aria-label="Privacy & Transparency Guarantee" className="bg-steel-dark border-b border-gold/30 px-3 py-1.5 text-[11px] font-mono text-sand/80 flex items-center justify-center gap-3 sm:gap-6 flex-wrap select-none z-40 relative">
      <div className="flex items-center gap-1.5 text-gold font-bold">
        <ShieldCheck size={13} className="text-gold flex-shrink-0" />
        <span>0 CATCH GUARANTEE</span>
      </div>
      <div className="hidden md:inline text-sand/40">•</div>
      <div className="flex items-center gap-1 text-sand/70">
        <Lock size={12} className="text-emerald-400 flex-shrink-0" />
        <span>100% In-Browser Computation</span>
      </div>
      <div className="hidden sm:inline text-sand/40">•</div>
      <div className="flex items-center gap-1 text-sand/70">
        <EyeOff size={12} className="text-gold/80 flex-shrink-0" />
        <span>Zero Sign-Up Required • Zero Data Sold • Zero Claim-Shark Fees</span>
      </div>
    </aside>
  );
};

export default ZeroCatchBanner;
