import React from 'react';
import { Shield, ExternalLink, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-steel/50 bg-steel-dark/95 py-8 px-6 mt-12 text-center text-xs font-mono text-sand/60 space-y-4">
      <div className="max-w-4xl mx-auto space-y-3 leading-relaxed">
        {/* Founder Authenticity Badge */}
        <div className="inline-flex items-center gap-2 bg-steel/30 border border-gold/30 rounded-2xl px-4 py-2 text-xs text-sand/90">
          <Shield size={15} className="text-gold" />
          <span>
            <strong>Built by Sgt Rusch, USMC</strong> — Not a corporation. Not a law firm. Just a Marine who figured it out and built the tool he wished he had on Day 1.
          </span>
        </div>

        {/* Legal Non-Government Disclaimer */}
        <div className="space-y-1 text-sand/50">
          <p className="font-bold text-sand/70 uppercase">
            Independence & Anti-Claim-Shark Notice
          </p>
          <p>
            Veteran Benefits Compass is an independent, veteran-created educational command post. We are NOT affiliated with the U.S. Department of Veterans Affairs (VA) or any government agency. We never charge fees, collect personal medical files, or act as unaccredited claim agents. All calculations run strictly in your browser (client-side) via 38 CFR and statutory rate schedules. We encourage every veteran to file official claims through accredited Veteran Service Officers (VSOs), DAV, VFW, American Legion, or state Departments of Veterans Affairs.
          </p>
        </div>

        {/* Statutory Source Links */}
        <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gold/80 pt-2">
          <a
            href="https://www.ecfr.gov/current/title-38/chapter-I/part-4"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-center gap-1"
          >
            38 CFR Part 4 (Schedule for Rating Disabilities) <ExternalLink size={10} />
          </a>
          <span>•</span>
          <a
            href="https://www.va.gov/disability/compensation-rates/veteran-rates/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-center gap-1"
          >
            VA Official 2024–2026 Rate Tables <ExternalLink size={10} />
          </a>
          <span>•</span>
          <a
            href="https://www.va.gov/ogc/apps/accreditation/index.asp"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-center gap-1"
          >
            Official Accredited VSO Locator <ExternalLink size={10} />
          </a>
        </div>

        {/* Bottom copyright / accessibility */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-sand/40 border-t border-steel/30 mt-4 pt-4">
          <span>Built for U.S. Service Members & Veterans • WCAG 2.2 AA Compliant • Free Forever</span>
          <span className="flex items-center gap-1 mt-2 sm:mt-0 text-sand/30 hover:text-sand/50 transition-colors">
            made with <Heart size={11} className="text-scarlet inline" /> and crayons
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
