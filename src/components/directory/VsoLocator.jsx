import React, { useState } from 'react';
import { Search, Phone, ExternalLink, MapPin, Building } from 'lucide-react';
import { STATE_BENEFITS } from '../../data/stateBenefits';

export const VSO_DIRECTORY = [
  {
    id: 'dav',
    name: 'Disabled American Veterans (DAV)',
    type: 'National Congressionally-Chartered VSO',
    focus: 'Disability Compensation, C&P Representation, Free Claims Filing',
    fee: '100% Free / Non-Profit',
    phone: '1-877-426-2838',
    website: 'https://www.dav.org/veterans/find-your-local-office/',
    description: 'Specializes in helping veterans navigate disability claims, appeals, and medical evidence gathering at no cost.'
  },
  {
    id: 'vfw',
    name: 'Veterans of Foreign Wars (VFW)',
    type: 'National Congressionally-Chartered VSO',
    focus: 'Combat Veterans, Overseas Service, BDD Claims, Appeals',
    fee: '100% Free / Non-Profit',
    phone: '1-816-756-3390',
    website: 'https://www.vfw.org/assistance/va-claims-separation-benefits',
    description: 'Accredited service officers nationwide to assist with VA claims, separation benefits, and discharge upgrades.'
  },
  {
    id: 'legion',
    name: 'The American Legion',
    type: 'National Congressionally-Chartered VSO',
    focus: 'Comprehensive Veteran & Family Advocacy, Claims, Education',
    fee: '100% Free / Non-Profit',
    phone: '1-800-433-3318',
    website: 'https://www.legion.org/vets-service-officer',
    description: 'Largest veteran service organization in the US with accredited officers in nearly every county.'
  },
  {
    id: 'pva',
    name: 'Paralyzed Veterans of America (PVA)',
    type: 'Specialized National VSO',
    focus: 'Spinal Cord Injury, Catastrophic Disability, SAH Grants, SMC',
    fee: '100% Free / Non-Profit',
    phone: '1-800-424-8200',
    website: 'https://pva.org/find-support/',
    description: 'World-class expertise in severe spinal injuries, Special Monthly Compensation (SMC-L through R), and housing grants.'
  },
  {
    id: 'nvlsp',
    name: 'National Veterans Legal Services Program (NVLSP)',
    type: 'Pro Bono Legal Advocacy',
    focus: 'Discharge Upgrades, Board of Veterans Appeals (BVA), CAVC Appeals',
    fee: '100% Free Pro Bono',
    phone: '1-202-265-8305',
    website: 'https://www.nvlsp.org/',
    description: 'Non-profit law firm providing free legal representation to veterans denied benefits by the Board of Veterans Appeals.'
  },
  {
    id: 'va_ogc',
    name: 'Official VA Accreditation Search (OGC)',
    type: 'Federal Search Database',
    focus: 'Search all 10,000+ accredited attorneys, claims agents, and VSOs',
    fee: 'Official VA Tool',
    phone: '1-800-827-1000',
    website: 'https://www.va.gov/ogc/apps/accreditation/index.asp',
    description: 'The official federal registry to verify whether an individual or organization is legally accredited to represent you.'
  }
];

export const VsoLocator = ({ selectedState = 'tx' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredVSOs = VSO_DIRECTORY.filter(vso => {
    const matchesSearch = vso.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vso.focus.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vso.description.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'chartered') return matchesSearch && vso.type.includes('Chartered');
    if (filterType === 'legal') return matchesSearch && vso.type.includes('Legal');
    return matchesSearch;
  });

  const stateInfo = STATE_BENEFITS[selectedState] || STATE_BENEFITS.tx;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-steel/40 via-steel-dark to-steel-dark border border-gold/40 rounded-3xl p-6 sm:p-8 space-y-3 shadow-2xl">
        <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold">
          <Building size={14} /> Accredited Claims Advocacy Network
        </div>
        <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-sand">
          Accredited VSO & <span className="text-gold">Legal Resource Locator</span>
        </h2>
        <p className="text-sand/70 text-sm leading-relaxed font-sans max-w-3xl">
          Never pay an unaccredited "claim shark" an illegal percentage of your backpay. Federal law guarantees you access to <strong>100% free, accredited Veteran Service Officers</strong> trained to represent you before the VA.
        </p>
      </div>

      {/* State Direct Agency Card */}
      <div className="bg-steel/20 border border-gold/40 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-gold" />
            <span className="text-xs font-mono uppercase text-gold font-bold">
              Your State Department of Veterans Affairs:
            </span>
          </div>
          <h3 className="text-lg font-black text-sand">{stateInfo.name} State Veterans Commission / DVA</h3>
          <p className="text-xs text-sand/60 font-sans">
            Offers county veterans service officers (CVSOs), state tuition assistance, and state veterans homes.
          </p>
        </div>

        <a
          href="https://www.nasdva.us/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-gold hover:bg-yellow-600 text-steel-dark font-black font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md flex-shrink-0"
        >
          Find {stateInfo.name} CVSO Office <ExternalLink size={12} />
        </a>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-steel/20 border border-steel/50 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by organization name, specialty (e.g. Appeals, BDD, SMC)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-steel-dark border border-steel/60 rounded-xl pl-9 pr-4 py-2.5 text-xs text-sand font-mono focus:outline-none focus:border-gold placeholder:text-sand/30"
          />
          <Search size={14} className="absolute left-3 top-3 text-sand/40 pointer-events-none" />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: 'All Organizations' },
            { id: 'chartered', label: 'Chartered VSOs' },
            { id: 'legal', label: 'Legal & Appeals' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all border ${
                filterType === f.id
                  ? 'bg-gold text-steel-dark border-gold'
                  : 'bg-steel-dark/60 border-steel/50 text-sand/70 hover:text-sand'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVSOs.map(vso => (
          <div key={vso.id} className="bg-steel-dark border border-steel/60 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-2 border-b border-steel/40 pb-2">
                <div>
                  <span className="text-[10px] font-mono uppercase text-gold font-bold">{vso.type}</span>
                  <h4 className="font-black text-base text-sand">{vso.name}</h4>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
                  {vso.fee}
                </span>
              </div>

              <p className="text-xs text-sand/75 font-sans leading-relaxed">
                {vso.description}
              </p>

              <div className="text-[11px] font-mono text-sand/60 bg-steel/30 p-2.5 rounded-xl border border-steel/40">
                <strong>Core Focus:</strong> {vso.focus}
              </div>
            </div>

            <div className="pt-2 border-t border-steel/40 flex items-center justify-between gap-2 flex-wrap text-xs font-mono">
              <div className="text-gold font-bold flex items-center gap-1">
                <Phone size={12} /> {vso.phone}
              </div>
              <a
                href={vso.website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-steel/40 hover:bg-gold hover:text-steel-dark border border-steel/60 text-sand text-xs font-bold flex items-center gap-1 transition-all"
              >
                Official Site <ExternalLink size={11} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VsoLocator;
