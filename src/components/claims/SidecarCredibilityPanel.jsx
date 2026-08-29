import React, { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, Scale } from 'lucide-react';

export const STATUTORY_CITATIONS = [
  {
    title: '38 CFR § 4.25 — Combined Ratings Table (VA Math)',
    subject: 'Whole-Person Efficiency Algorithm',
    summary: 'Governs the non-additive combined rating formula. Each disability rating is applied against the remaining efficiency of the person, preventing ratings from exceeding 100%.',
    link: 'https://www.ecfr.gov/current/title-38/chapter-I/part-4/subpart-A/section-4.25'
  },
  {
    title: '38 CFR § 4.26 — Bilateral Factor (+10% Bonus)',
    subject: 'Paired Extremities Bonus',
    summary: 'When a veteran has service-connected disabilities affecting paired limbs (both arms or both legs), 10% of their combined rating is added to the value before overall combination.',
    link: 'https://www.ecfr.gov/current/title-38/chapter-I/part-4/subpart-A/section-4.26'
  },
  {
    title: '38 CFR § 3.310 — Secondary Disabilities',
    subject: 'Aggravation & Secondary Connection',
    summary: 'Authorizes service connection for any condition that is proximately due to or the result of a service-connected disease or injury without requiring in-service medical records.',
    link: 'https://www.ecfr.gov/current/title-38/chapter-I/part-3/subpart-A/subject-group-ECFRda3bf4d8a1e9ce1/section-3.310'
  },
  {
    title: '38 CFR § 3.327 & § 3.951 — Grandfathering & Rating Defense',
    subject: '5-Year, 10-Year, and 20-Year Protection Rules',
    summary: 'Federal statutes that protect disability ratings from arbitrary reductions. A continuous 20-year rating is permanently locked by law and cannot be reduced for any reason.',
    link: 'https://www.ecfr.gov/current/title-38/chapter-I/part-3/subpart-A/subject-group-ECFRf346b0a7c41398c/section-3.951'
  },
  {
    title: '38 U.S.C. § 5101 — Benefits Delivery at Discharge (BDD)',
    subject: 'Pre-Separation Fast-Track Claims',
    summary: 'Authorizes active duty service members to submit disability claims between 180 and 90 days before discharge for day-1 compensation upon civilian transition.',
    link: 'https://www.va.gov/disability/how-to-file-claim/when-to-file/pre-discharge-claim/'
  }
];

export const SidecarCredibilityPanel = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-steel/20 border border-gold/30 rounded-2xl p-4 sm:p-5 space-y-3 font-mono text-xs">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2 text-gold font-bold">
          <Scale size={15} />
          <span className="uppercase text-[11px] tracking-wide">
            Statutory Legal Credibility & 38 CFR Citations
          </span>
        </div>
        <div className="flex items-center gap-2 text-sand/60 text-[10px]">
          <span>{isOpen ? 'Collapse' : 'View Federal Statutes'}</span>
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </div>

      <div className="text-[11px] text-sand/70 font-sans leading-relaxed">
        Every algorithm, rating tier, and deadline in this calculator is strictly derived from <strong>Title 38 of the Code of Federal Regulations (38 CFR)</strong> and official 2024–2026 VA rate schedules.
      </div>

      {isOpen && (
        <div className="space-y-2.5 pt-2 border-t border-steel/40 animate-fade-in font-sans">
          {STATUTORY_CITATIONS.map((cit, i) => (
            <div key={i} className="bg-steel-dark/80 border border-steel/50 rounded-xl p-3 space-y-1">
              <div className="flex justify-between items-start gap-2">
                <strong className="text-sand font-mono text-xs">{cit.title}</strong>
                <a
                  href={cit.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono text-gold hover:underline flex items-center gap-0.5 flex-shrink-0"
                >
                  eCFR Text <ExternalLink size={10} />
                </a>
              </div>
              <p className="text-[11px] text-sand/70 leading-relaxed">{cit.summary}</p>
            </div>
          ))}

          <div className="pt-2 text-[10px] font-mono text-sand/50 text-center">
            Independent Educational Resource • Verified against official Federal Register updates
          </div>
        </div>
      )}
    </div>
  );
};

export default SidecarCredibilityPanel;
