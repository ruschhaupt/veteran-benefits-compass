import React, { useState, useEffect } from 'react';
import { Shield, Check, ExternalLink } from 'lucide-react';

export const NotTheVAModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem('vbc_not_the_va_dismissed');
      if (!dismissed) {
        setIsOpen(true);
      }
    } catch (e) {}
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem('vbc_not_the_va_dismissed', 'true');
    } catch (e) {}
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-modal-title"
    >
      <div className="bg-steel-dark border border-gold/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-fade-in relative">
        <div className="flex items-center gap-3 border-b border-steel/50 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-gold/10 border border-gold/40 flex items-center justify-center flex-shrink-0">
            <Shield className="text-gold" size={22} />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold">
              Battle Buddy Transparency Disclosure
            </span>
            <h2 id="disclaimer-modal-title" className="text-xl font-black uppercase tracking-tight text-sand">
              We Are Not The VA.
            </h2>
          </div>
        </div>

        <div className="text-sm text-sand/80 leading-relaxed space-y-3 font-sans">
          <p>
            <strong>Plain Language:</strong> We are not the Department of Veterans Affairs. We are not a law firm. We are not unaccredited claim agents.
          </p>
          <p>
            We are veterans who built a <strong>100% free, private educational calculator</strong> so you don't have to navigate 38 CFR alone. Every calculation is cited directly to federal statutes.
          </p>
          <p className="bg-steel/30 border border-steel/60 rounded-xl p-3 text-xs text-sand/70">
            💡 <strong>Our Mission:</strong> To give you the exact numbers and statutory references so you become the most prepared client your accredited Veteran Service Officer (VSO) has ever seen.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDismiss}
            className="flex-1 py-3 px-5 rounded-xl bg-gold hover:bg-yellow-600 text-steel-dark font-black font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <Check size={16} /> Understood — Let's Roll
          </button>
          <a
            href="https://www.va.gov/ogc/apps/accreditation/index.asp"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-xl bg-steel-dark border border-steel/60 hover:border-gold text-sand/70 hover:text-sand font-mono text-xs uppercase font-bold flex items-center justify-center gap-1.5 transition-all text-center"
          >
            Find Accredited VSO <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotTheVAModal;
