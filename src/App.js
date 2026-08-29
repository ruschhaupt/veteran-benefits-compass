import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Compass,
  CheckCircle, Plus, Search, Upload, FileText,
  Phone, Cpu, ExternalLink, X, Activity, Flag,
  Home, ShieldAlert, Sparkles, Copy,
  Sliders, Printer, Share2, Check,
  Calculator, ChevronDown, ChevronUp,
  ArrowRight, RefreshCw, Zap
} from 'lucide-react';

// Data imports
import { MED_DB } from './data/medDb';
import { CP_SIMULATOR_SCENARIOS } from './data/cpScenarios';
import { SMC_DATA } from './data/smcData';
import { SPECIAL_PERKS } from './data/specialPerks';
import { STATE_GRADES } from './data/stateGrades';
import { STATE_BENEFITS } from './data/stateBenefits';
import { AVENUES_DATA } from './data/avenuesData';
import { PACT_ACT_THEATERS } from './data/pactTheaters';
import { SECONDARY_CLAIMS_DATA } from './data/secondaryClaims';
import { BRANCH_DATA } from './data/branchData';
import { getVaMonthlyComp } from './data/vaPayTable';

// Utility imports
import { calcVaMath } from './utils/vaMath';
import { loadProfileFromStorage, saveProfileToStorage } from './utils/storage';
import { calculateVeteranWealth } from './utils/wealthCalculator';

// Component imports
import ZeroCatchBanner from './components/layout/ZeroCatchBanner';
import AccessibilityBar from './components/layout/AccessibilityBar';
import CrisisQuickBar from './components/navigation/CrisisQuickBar';
import NotTheVAModal from './components/layout/NotTheVAModal';
import Footer from './components/layout/Footer';
import HeroSection from './components/home/HeroSection';
import BenefitFinderWizard from './components/home/BenefitFinderWizard';
import MissionTimelineGenerator from './components/timeline/MissionTimelineGenerator';
import ClaimStrengthGrader from './components/claims/ClaimStrengthGrader';
import SidecarCredibilityPanel from './components/claims/SidecarCredibilityPanel';
import VeteranWealthScorecard from './components/scorecard/VeteranWealthScorecard';
import LifeEventNav from './components/navigation/LifeEventNav';
import VsoLocator from './components/directory/VsoLocator';
import EducationMaximizer from './components/education/EducationMaximizer';
import VaLoanAnalyzer from './components/housing/VaLoanAnalyzer';
import FederalCareerFastTrack from './components/career/FederalCareerFastTrack';

const VeteranBenefitsCompass = () => {
  // ---- Profile State ----
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  const [branch, setBranch] = useState('usmc');
  const [enlistmentDate, setEnlistmentDate] = useState('2016-08-01');
  const [separationDate, setSeparationDate] = useState('2024-08-01');
  const [separationMonths, setSeparationMonths] = useState(6);
  const [alreadyOut, setAlreadyOut] = useState(true);
  const [dischargeType, setDischargeType] = useState('honorable');
  const [currentRating, setCurrentRating] = useState(70);
  const [futurePath, setFuturePath] = useState('freedom');
  const [selectedState, setSelectedState] = useState('tx');
  const [hasDependents, setHasDependents] = useState('single');
  const [yearsOfService, setYearsOfService] = useState(4);
  const [servedPost911, setServedPost911] = useState(true);
  const [exposedBurnPit, setExposedBurnPit] = useState(true);
  const [mstFlag, setMstFlag] = useState(false);

  // ---- Navigation State ----
  const [activeTab, setActiveTab] = useState('summary');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [showFinderWizard, setShowFinderWizard] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [claimedNotification, setClaimedNotification] = useState(null);

  // ---- Planner & Stage State ----
  const [lifeGoals, setLifeGoals] = useState(['freedom', 'home', 'wealth']);

  // ---- C&P Exam Simulator State ----
  const [selectedCpScenario, setSelectedCpScenario] = useState('spine');
  const [cpChoice, setCpChoice] = useState(null);

  // ---- House Hacker Calculator State ----
  const [homePrice, setHomePrice] = useState(450000);
  const [hhState, setHhState] = useState('TX');
  const [hhPrice, setHhPrice] = useState(350000);
  const [hhUnits, setHhUnits] = useState(3);
  const [hhRate, setHhRate] = useState(6.75);
  const [hhIsVeteranExempt, setHhIsVeteranExempt] = useState(true);
  const [hhDownPct] = useState(0);
  const [hhInsurance] = useState(200);

  // ---- VA Math State ----
  const [vaRatingsList, setVaRatingsList] = useState([70, 50, 20, 10]);
  const [newRatingInput, setNewRatingInput] = useState(10);
  const [hasBilateralFactor, setHasBilateralFactor] = useState(false);

  // ---- PACT Act Screener State ----
  const [selectedPactTheater, setSelectedPactTheater] = useState('burn_pits');

  // ---- Perks & Avenues Accordion State ----
  const [expandedPerk, setExpandedPerk] = useState(null);
  const [expandedAvenue, setExpandedAvenue] = useState('education');

  // ---- Medical Scanner State ----
  const [scanText, setScanText] = useState('');
  const [scanResults, setScanResults] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);
  const fileInputRef = useRef(null);

  // ---- Completed Milestones & Benefits Tracking ----
  const [completedMilestones, setCompletedMilestones] = useState({
    va_account_set: true,
    va_healthcare: true,
    intent_to_file_backpay: true
  });

  const [completedBenefits, setCompletedBenefits] = useState({
    parks_pass: true,
    commissary_exchange: true,
    va_healthcare: true,
  });

  // ---- Load initial state from LocalStorage on Mount ----
  useEffect(() => {
    const loaded = loadProfileFromStorage();
    if (loaded) {
      if (loaded.userEmail) setUserEmail(loaded.userEmail);
      if (loaded.userName) setUserName(loaded.userName);
      if (loaded.branch) setBranch(loaded.branch);
      if (loaded.enlistmentDate) setEnlistmentDate(loaded.enlistmentDate);
      if (loaded.separationDate) setSeparationDate(loaded.separationDate);
      if (loaded.separationMonths !== undefined) setSeparationMonths(loaded.separationMonths);
      if (loaded.alreadyOut !== undefined) setAlreadyOut(loaded.alreadyOut);
      if (loaded.dischargeType) setDischargeType(loaded.dischargeType);
      if (loaded.currentRating !== undefined) setCurrentRating(loaded.currentRating);
      if (loaded.futurePath) setFuturePath(loaded.futurePath);
      if (loaded.selectedState) setSelectedState(loaded.selectedState);
      if (loaded.hasDependents) setHasDependents(loaded.hasDependents);
      if (loaded.yearsOfService !== undefined) setYearsOfService(loaded.yearsOfService);
      if (loaded.servedPost911 !== undefined) setServedPost911(loaded.servedPost911);
      if (loaded.exposedBurnPit !== undefined) setExposedBurnPit(loaded.exposedBurnPit);
      if (loaded.mstFlag !== undefined) setMstFlag(loaded.mstFlag);
      if (loaded.lifeGoals) setLifeGoals(loaded.lifeGoals);
      if (loaded.completedMilestones) setCompletedMilestones(loaded.completedMilestones);
      if (loaded.completedBenefits) setCompletedBenefits(loaded.completedBenefits);
      if (loaded.homePrice) setHomePrice(loaded.homePrice);
    }
  }, []);

  // ---- Save to LocalStorage Helper ----
  const saveState = (overrides = {}) => {
    const payload = {
      userEmail,
      userName,
      branch,
      enlistmentDate,
      separationDate,
      separationMonths,
      alreadyOut,
      dischargeType,
      currentRating,
      futurePath,
      selectedState,
      hasDependents,
      yearsOfService,
      servedPost911,
      exposedBurnPit,
      mstFlag,
      lifeGoals,
      completedMilestones,
      completedBenefits,
      homePrice,
      ...overrides
    };
    saveProfileToStorage(payload);
  };

  const toggleBenefitCompleted = (id) => {
    setCompletedBenefits(prev => {
      const isClaiming = !prev[id];
      const updated = { ...prev, [id]: isClaiming };
      saveState({ completedBenefits: updated });
      if (isClaiming) {
        setClaimedNotification('🎖️ Benefit marked as claimed! Locked into your profile.');
        setTimeout(() => setClaimedNotification(null), 3000);
      }
      return updated;
    });
  };

  const toggleMilestone = (id) => {
    setCompletedMilestones(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      saveState({ completedMilestones: updated });
      return updated;
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  // Branch and State derivations
  const bd = BRANCH_DATA[branch] || BRANCH_DATA.usmc;
  const stateInfo = STATE_BENEFITS[selectedState] || STATE_BENEFITS.tx;

  // Monthly pay and wealth computations
  const monthlyPay = getVaMonthlyComp(currentRating, hasDependents);
  const annualPay = monthlyPay * 12;

  const wealthData = calculateVeteranWealth({
    currentRating,
    hasDependents,
    selectedState,
    completedBenefits,
    homePrice
  });

  // VA Math calculation
  const vaMathResult = calcVaMath(vaRatingsList, hasBilateralFactor);

  // House Hacker calculation
  const calcHouseHacker = () => {
    const stateData = STATE_GRADES.find(s => s.abbr === hhState) || STATE_GRADES[0];
    const loanAmt = hhPrice * (1 - hhDownPct / 100);
    const fundingFee = hhIsVeteranExempt ? 0 : loanAmt * 0.0125;
    const totalLoan = loanAmt + fundingFee;
    const monthlyRate = hhRate / 100 / 12;
    const numPayments = 360;
    const pAndI = totalLoan * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    const annualTaxRate = hhIsVeteranExempt && stateData.landlordFriendly ? 0 : 0.012;
    const monthlyTax = (hhPrice * annualTaxRate) / 12;
    const piti = pAndI + monthlyTax + hhInsurance;

    const rentingUnits = hhUnits - 1;
    const rentPerUnit = hhUnits === 2 ? stateData.avgRent2br : hhUnits === 3 ? stateData.avgRent3br : stateData.avgRent4br;
    const grossRent = rentPerUnit * rentingUnits;
    const netRent = grossRent * 0.87; // 5% vacancy + 8% maintenance
    const netCashFlow = netRent - piti;
    const effectiveHousingCost = Math.max(0, piti - netRent);

    return {
      stateData,
      totalLoan: Math.round(totalLoan),
      fundingFee: Math.round(fundingFee),
      pAndI: Math.round(pAndI),
      monthlyTax: Math.round(monthlyTax),
      piti: Math.round(piti),
      rentPerUnit,
      rentingUnits,
      grossRent: Math.round(grossRent),
      netRent: Math.round(netRent),
      netCashFlow: Math.round(netCashFlow),
      effectiveHousingCost: Math.round(effectiveHousingCost)
    };
  };
  const hhResult = calcHouseHacker();

  // Medical Scanner run
  const runMedScan = useCallback(() => {
    if (!scanText.trim()) return;
    setScanLoading(true);
    setTimeout(() => {
      const lower = scanText.toLowerCase();
      const found = [];
      const foundNames = new Set();
      MED_DB.forEach(entry => {
        if (foundNames.has(entry.condition)) return;
        const hit = entry.keywords.find(kw => lower.includes(kw));
        if (hit) {
          found.push({ ...entry, matchedKeyword: hit });
          foundNames.add(entry.condition);
        }
      });
      const secondaries = new Set();
      found.forEach(f => f.secondary.forEach(s => { if (!foundNames.has(s)) secondaries.add(s); }));
      const pactFlag = exposedBurnPit || lower.includes('burn pit') || lower.includes('iraq') || lower.includes('afghanistan') || lower.includes('kuwait');
      setScanResults({ found, secondaries: [...secondaries], pactFlag });
      setScanLoading(false);
    }, 800);
  }, [scanText, exposedBurnPit]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => setScanText(evt.target.result);
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-steel-dark text-sand flex flex-col relative overflow-hidden font-sans">
      {/* Background Tactical Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      {/* 1. "0 Catch" Guarantee Persistent Banner */}
      <ZeroCatchBanner />

      {/* 2. Neuro-Accessibility Suite Controls (Reader Mode, Calm Mode, Font Size) */}
      <AccessibilityBar />

      {/* 3. 24/7 Crisis Response Quick Bar */}
      <CrisisQuickBar />

      {/* 4. "Not The VA" First-Visit Battle Buddy Disclosure Modal */}
      <NotTheVAModal />

      {/* 4. Copy Notification Toast */}
      {copiedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-gold text-steel-dark px-4 py-2.5 rounded-xl font-mono text-xs font-black shadow-2xl flex items-center gap-2 animate-fade-in">
          <Check size={14} /> Copied to clipboard!
        </div>
      )}

      {/* 4b. Claimed Benefit Win Toast */}
      {claimedNotification && (
        <div className="fixed bottom-6 left-6 z-50 bg-emerald-500 text-steel-dark px-4 py-2.5 rounded-xl font-mono text-xs font-black shadow-2xl flex items-center gap-2 animate-fade-in border border-emerald-400">
          <Sparkles size={14} /> {claimedNotification}
        </div>
      )}

      {/* 5. Main Tactical Navigation Header */}
      <header className="border-b border-steel/50 bg-steel-dark/90 px-4 py-3 flex items-center justify-between flex-wrap gap-3 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center text-steel-dark font-black shadow-lg shadow-gold/10">
            <Compass size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg sm:text-xl text-sand tracking-tight uppercase leading-none">
                Veteran Benefits <span className="text-gold">Compass</span>
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-gold/10 text-gold border border-gold/30">
                PROD v2.0
              </span>
            </div>
            <p className="text-[11px] font-mono text-sand/50 mt-0.5">
              The Free Client-Side Tactical Command Post • Built by Sgt Rusch, USMC
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowSettingsModal(true)}
            className="px-3 py-1.5 rounded-xl bg-steel/30 hover:bg-steel/60 border border-steel/60 hover:border-gold text-sand font-mono text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Sliders size={13} className="text-gold" />
            <span>Profile ({currentRating}% • {stateInfo.abbr})</span>
          </button>

          <button
            onClick={() => setShowDossierModal(true)}
            className="px-3 py-1.5 rounded-xl bg-gold hover:bg-yellow-600 text-steel-dark font-mono text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all"
          >
            <FileText size={13} />
            <span>VSO Dossier</span>
          </button>
        </div>
      </header>

      {/* 6. Main Sticky Life-Event Navigation Tabs */}
      <LifeEventNav activeTab={activeTab} onSelectTab={(tabId) => setActiveTab(tabId)} />

      {/* 7. Main Content Viewport */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8 z-10">
        
        {/* ============================================================ */}
        {/* TAB 1: SUMMARY & HERO LANDING                                */}
        {/* ============================================================ */}
        {activeTab === 'summary' && (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Section (Option C) */}
            <HeroSection
              currentRating={currentRating}
              onRatingChange={(r) => {
                setCurrentRating(r);
                saveState({ currentRating: r });
              }}
              onLaunchTimeline={() => setActiveTab('tracker')}
              onLaunchCalculator={() => setActiveTab('vamath')}
              branchSlang={bd.slang}
            />

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-steel/20 border border-steel/50 rounded-2xl p-5 space-y-1">
                <span className="text-[10px] font-mono uppercase text-sand/50">Monthly Compensation</span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                  ${wealthData.monthlyComp.toLocaleString()}<span className="text-xs text-sand/60">/mo</span>
                </div>
                <div className="text-xs text-sand/60">100% Federal & State Tax-Free</div>
              </div>

              <div className="bg-steel/20 border border-steel/50 rounded-2xl p-5 space-y-1">
                <span className="text-[10px] font-mono uppercase text-sand/50">Annual Cash Floor</span>
                <div className="text-2xl sm:text-3xl font-black text-sand font-mono">
                  ${wealthData.annualComp.toLocaleString()}<span className="text-xs text-sand/60">/yr</span>
                </div>
                <div className="text-xs text-sand/60">Guaranteed for Life with COLA</div>
              </div>

              <div className="bg-steel/20 border border-steel/50 rounded-2xl p-5 space-y-1">
                <span className="text-[10px] font-mono uppercase text-sand/50">State Tax Shield ({stateInfo.name})</span>
                <div className="text-2xl sm:text-3xl font-black text-gold font-mono">
                  ${wealthData.statePropertyTaxSaved.toLocaleString()}<span className="text-xs text-sand/60">/yr</span>
                </div>
                <div className="text-xs text-sand/60">Property & Income Tax Savings</div>
              </div>

              <div className="bg-steel/20 border border-steel/50 rounded-2xl p-5 space-y-1">
                <span className="text-[10px] font-mono uppercase text-sand/50">10-Year Wealth Impact</span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                  ${wealthData.tenYearImpact.toLocaleString()}
                </div>
                <div className="text-xs text-sand/60">Compounding Sovereign Base</div>
              </div>
            </div>

            {/* 60-Second Benefit Finder Wizard Card / Component */}
            {showFinderWizard ? (
              <div className="space-y-3">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowFinderWizard(false)}
                    className="text-xs font-mono text-sand/60 hover:text-gold uppercase font-bold"
                  >
                    ✕ Close Benefit Finder
                  </button>
                </div>
                <BenefitFinderWizard
                  initialBranch={branch}
                  initialState={selectedState}
                  onCompleteQuiz={(answers) => {
                    if (answers.rating !== undefined) setCurrentRating(answers.rating);
                    if (answers.state) setSelectedState(answers.state);
                    if (answers.goals) setLifeGoals(answers.goals);
                    saveState({
                      currentRating: answers.rating,
                      selectedState: answers.state,
                      lifeGoals: answers.goals
                    });
                  }}
                />
              </div>
            ) : (
              <div className="bg-gradient-to-r from-gold/15 via-steel/30 to-steel-dark border-2 border-gold/40 rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-wider font-bold">
                    <Zap size={14} className="text-gold animate-pulse" />
                    <span>60-Second Tactical Benefit Finder</span>
                  </div>
                  <h3 className="text-xl font-black text-sand uppercase">
                    Not sure what benefits you qualify for?
                  </h3>
                  <p className="text-xs text-sand/70 leading-relaxed font-sans">
                    Answer 4 quick questions. Our client-side algorithm instantly maps your highest-value monthly disability pay, state tax exemptions, and housing grants.
                  </p>
                </div>

                <button
                  onClick={() => setShowFinderWizard(true)}
                  className="px-6 py-3.5 rounded-2xl bg-gold hover:bg-yellow-600 text-steel-dark font-black font-mono text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-gold/20 flex-shrink-0 transition-all"
                >
                  <Sparkles size={14} />
                  <span>Launch 60-Sec Finder</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}

            {/* Quick Action Matrix */}
            <div className="bg-steel/20 border border-steel/50 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black uppercase text-sand">Next Recommended Tactical Moves</h3>
                  <p className="text-xs text-sand/60">Ranked by immediate dollar impact and urgency.</p>
                </div>
                <button
                  onClick={() => setActiveTab('scorecard')}
                  className="px-3.5 py-1.5 rounded-xl bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 font-mono text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Share2 size={12} /> View Shareable Debrief
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  onClick={() => setActiveTab('tracker')}
                  className="p-4 rounded-2xl bg-steel-dark/60 border border-steel/60 hover:border-gold/60 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-gold font-bold">
                    <span>🗓️ Mission Timeline Clocks</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="font-bold text-sm text-sand">Check Statutory Deadlines & Windows</div>
                  <p className="text-xs text-sand/60">Never miss the BDD, 180-day dental, or GI Bill expiration clocks.</p>
                </div>

                <div
                  onClick={() => setActiveTab('grader')}
                  className="p-4 rounded-2xl bg-steel-dark/60 border border-steel/60 hover:border-gold/60 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-gold font-bold">
                    <span>🎯 Claim Strength Grader</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="font-bold text-sm text-sand">Grade Your Evidence (A+ to D) Before Filing</div>
                  <p className="text-xs text-sand/60">Avoid 8-month denials by checking the Caluza element rubric first.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: "YOUR LIFE IN MONTHS" TIMELINE GENERATOR              */}
        {/* ============================================================ */}
        {activeTab === 'tracker' && (
          <div className="animate-fade-in">
            <MissionTimelineGenerator
              enlistmentDate={enlistmentDate}
              separationDate={separationDate}
              branch={branch}
              currentRating={currentRating}
              selectedState={selectedState}
              hasDependents={hasDependents}
              completedMilestones={completedMilestones}
              onToggleMilestone={toggleMilestone}
              onOpenSettings={() => setShowSettingsModal(true)}
            />
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: CLAIM STRENGTH GRADER & DBQ PREP                      */}
        {/* ============================================================ */}
        {activeTab === 'grader' && (
          <div className="animate-fade-in">
            <ClaimStrengthGrader />
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: VIRAL VETERAN WEALTH SCORECARD                        */}
        {/* ============================================================ */}
        {activeTab === 'scorecard' && (
          <div className="animate-fade-in">
            <VeteranWealthScorecard
              userName={userName}
              branch={branch}
              currentRating={currentRating}
              selectedState={selectedState}
              hasDependents={hasDependents}
              completedBenefits={completedBenefits}
              homePrice={homePrice}
            />
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: VA MATH COMBAT CALCULATOR (38 CFR § 4.25)             */}
        {/* ============================================================ */}
        {activeTab === 'vamath' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-steel/40 via-steel-dark to-steel-dark border border-gold/40 rounded-3xl p-6 sm:p-8 space-y-3 shadow-2xl">
              <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold">
                <Calculator size={14} /> 38 CFR § 4.25 Non-Additive Math
              </div>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-sand">
                VA Math <span className="text-gold">Combat Combinator & 100% Path</span>
              </h2>
              <p className="text-sand/70 text-sm leading-relaxed font-sans max-w-3xl">
                The VA does not use standard addition. Each disability percentage is calculated against your <em>remaining whole-person efficiency</em>. Understand the math and discover high-yield secondary claims to close the gap.
              </p>
            </div>

            {/* Combinator Interactive Widget */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-steel/20 border border-steel/50 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-steel/50 pb-3">
                  <h3 className="font-bold text-sand uppercase text-sm font-mono text-gold">Your Disability Ratings Stack</h3>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-sand/80">
                    <input
                      type="checkbox"
                      checked={hasBilateralFactor}
                      onChange={(e) => setHasBilateralFactor(e.target.checked)}
                      className="rounded border-steel/60 text-gold focus:ring-gold bg-steel-dark"
                    />
                    <span>Bilateral Factor (+10%)</span>
                  </label>
                </div>

                {/* Rating Pills */}
                <div className="flex flex-wrap gap-2">
                  {vaRatingsList.map((r, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-steel-dark border border-gold/40 rounded-xl px-3 py-1.5 font-mono text-sm font-bold text-sand">
                      <span>{r}%</span>
                      <button
                        onClick={() => setVaRatingsList(prev => prev.filter((_, idx) => idx !== i))}
                        className="text-sand/40 hover:text-scarlet transition-colors ml-1"
                        title="Remove rating"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                  {vaRatingsList.length === 0 && (
                    <div className="text-xs text-sand/40 font-mono py-2">No ratings added yet. Add below:</div>
                  )}
                </div>

                {/* Add Rating Input */}
                <div className="flex items-center gap-2 pt-2">
                  <select
                    value={newRatingInput}
                    onChange={(e) => setNewRatingInput(Number(e.target.value))}
                    className="bg-steel-dark border border-steel/60 rounded-xl px-3 py-2 text-sm text-sand font-mono focus:outline-none focus:border-gold"
                  >
                    {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(v => (
                      <option key={v} value={v}>+{v}% Disability</option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      setVaRatingsList(prev => [...prev, newRatingInput]);
                    }}
                    className="px-4 py-2 rounded-xl bg-gold hover:bg-yellow-600 text-steel-dark font-black font-mono text-xs uppercase tracking-wider flex items-center gap-1 shadow-md transition-all"
                  >
                    <Plus size={14} /> Add Condition
                  </button>
                  <button
                    onClick={() => setVaRatingsList([])}
                    className="px-3 py-2 rounded-xl bg-steel-dark border border-steel/60 hover:border-scarlet text-sand/60 hover:text-scarlet text-xs font-mono transition-all"
                  >
                    Clear All
                  </button>
                </div>

                {/* Calculation Breakdown Steps */}
                <div className="space-y-2 pt-3 border-t border-steel/40">
                  <span className="text-[11px] font-mono uppercase text-gold font-bold">Step-by-Step Whole Person Efficiency:</span>
                  <div className="space-y-1.5">
                    {vaMathResult.steps.map((st, i) => (
                      <div key={i} className="flex justify-between items-center text-xs font-mono bg-steel/30 p-2.5 rounded-lg border border-steel/50">
                        <span>Condition {i + 1} ({st.conditionRating}%):</span>
                        <span className="text-sand/70">Adds +{st.addedValue}% → Total: {st.runningTotal}% (Efficiency Left: {st.runningEfficiency}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Combined Scorecard (Right Col) */}
              <div className="lg:col-span-5 bg-steel-dark border border-gold/40 rounded-2xl p-6 space-y-5 shadow-xl">
                <div className="border-b border-steel/50 pb-3">
                  <span className="text-[10px] font-mono text-gold uppercase font-bold">Official Combined Result</span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-4xl font-black text-sand font-mono">{vaMathResult.roundedRating}%</span>
                    <span className="text-sm text-sand/60 font-mono">Raw: {vaMathResult.rawTotal}%</span>
                  </div>
                </div>

                {/* Points to 100 */}
                <div className="bg-steel/30 border border-steel/50 rounded-xl p-4 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-gold font-bold">Distance to 100% P&T (94.5% Schedular Threshold):</span>
                  <div className="text-2xl font-black text-gold font-mono">
                    {vaMathResult.is100 ? '🎉 100% P&T ACHIEVED!' : `${vaMathResult.pointsTo100}% Raw Points Needed`}
                  </div>
                  <p className="text-xs text-sand/70">
                    {vaMathResult.is100
                      ? 'You have reached the maximum schedular tier ($3,737+/mo tax-free + state tax shields).'
                      : 'Because of diminishing efficiency, you need high-impact primary or stacked secondaries.'}
                  </p>
                </div>

                {/* Secondary Stacking Callout */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono uppercase text-gold font-bold">High-Yield Secondary Bridges:</span>
                  <div className="space-y-1.5 text-xs">
                    <div className="bg-steel/20 p-2.5 rounded-lg border border-steel/40">
                      <strong>Sleep Apnea (50%)</strong> secondary to PTSD/Mental Health
                    </div>
                    <div className="bg-steel/20 p-2.5 rounded-lg border border-steel/40">
                      <strong>Radiculopathy (20% x 2 Limbs)</strong> secondary to Lumbar Strain
                    </div>
                    <div className="bg-steel/20 p-2.5 rounded-lg border border-steel/40">
                      <strong>Migraines (30-50%)</strong> secondary to Tinnitus or Neck Strain
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Claims Arsenal Section */}
            <div className="bg-steel/20 border border-steel/50 rounded-3xl p-6 space-y-4">
              <h3 className="text-xl font-black uppercase text-sand">High-Yield Secondary Claims Arsenal</h3>
              <p className="text-xs text-sand/60">Conditions commonly granted as secondary service connection without requiring in-service medical records.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SECONDARY_CLAIMS_DATA.map((item, i) => (
                  <div key={i} className="bg-steel-dark border border-steel/60 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-gold font-bold font-mono text-sm border-b border-steel/40 pb-2">
                      <span>{item.icon}</span>
                      <span>Primary: {item.primary}</span>
                    </div>
                    <div className="space-y-2">
                      {item.secondaries.map((sec, j) => (
                        <div key={j} className="bg-steel/20 p-2.5 rounded-xl border border-steel/40 space-y-1">
                          <div className="flex justify-between text-xs font-bold text-sand">
                            <span>{sec.condition}</span>
                            <span className="text-emerald-400 font-mono">{sec.potential}</span>
                          </div>
                          <p className="text-[11px] text-sand/60 leading-tight">{sec.mechanism}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statutory Legal Credibility & 38 CFR Citations Panel */}
            <SidecarCredibilityPanel />
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 6: PACT ACT TOXIC EXPOSURE SCREENER                      */}
        {/* ============================================================ */}
        {activeTab === 'pact' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-steel/40 via-steel-dark to-steel-dark border border-gold/40 rounded-3xl p-6 sm:p-8 space-y-3 shadow-2xl">
              <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold">
                <ShieldAlert size={14} /> PACT Act Section 406 & 804 Presumptives
              </div>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-sand">
                PACT Act <span className="text-gold">Toxic Exposure Screener</span>
              </h2>
              <p className="text-sand/70 text-sm leading-relaxed font-sans max-w-3xl">
                If you served in qualifying deployed theaters (SW Asia, Iraq, Afghanistan, Camp Lejeune, Agent Orange), the VA legally <strong>must presume</strong> your condition was caused by military service. No nexus letter required.
              </p>
            </div>

            {/* Theater Selector Chips */}
            <div className="flex items-center gap-2 flex-wrap">
              {PACT_ACT_THEATERS.map(th => (
                <button
                  key={th.id}
                  onClick={() => setSelectedPactTheater(th.id)}
                  className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all border ${
                    selectedPactTheater === th.id
                      ? 'bg-gold text-steel-dark border-gold shadow-md'
                      : 'bg-steel/30 border-steel/60 text-sand/70 hover:text-sand hover:bg-steel/50'
                  }`}
                >
                  {th.name}
                </button>
              ))}
            </div>

            {/* Active Theater Content */}
            {(() => {
              const currentTheater = PACT_ACT_THEATERS.find(t => t.id === selectedPactTheater) || PACT_ACT_THEATERS[0];
              return (
                <div className="bg-steel/20 border border-steel/50 rounded-3xl p-6 space-y-5">
                  <div className="border-b border-steel/50 pb-4 space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="text-xl font-black uppercase text-sand">{currentTheater.name}</h3>
                      <span className="text-xs font-mono text-gold font-bold">{currentTheater.statute}</span>
                    </div>
                    <p className="text-xs text-sand/60 font-mono"><strong>Qualifying Locations:</strong> {currentTheater.locations}</p>
                    <p className="text-xs text-sand/80 pt-1 leading-relaxed">{currentTheater.rules}</p>
                  </div>

                  {/* Conditions List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentTheater.conditions.map((cond, i) => (
                      <div key={i} className="bg-steel-dark border border-steel/60 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-sand">{cond.name}</span>
                          <span className="text-xs font-mono text-emerald-400 font-bold">DC {cond.dc} • Up to {cond.maxRating}</span>
                        </div>
                        <div className="text-xs text-sand/60">
                          <strong>DBQ Exam:</strong> {cond.dbq}
                        </div>
                        <div className="text-[11px] text-sand/70 bg-steel/30 p-2 rounded-lg border border-steel/40">
                          <strong>Required Evidence:</strong> {cond.evidence}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 7: C&P EXAM PRACTICE SIMULATOR                           */}
        {/* ============================================================ */}
        {activeTab === 'claims' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-steel/40 via-steel-dark to-steel-dark border border-gold/40 rounded-3xl p-6 sm:p-8 space-y-3 shadow-2xl">
              <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold">
                <Activity size={14} /> Clinical Examination Rehearsal
              </div>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-sand">
                C&P Exam <span className="text-gold">DBQ Practice Simulator</span>
              </h2>
              <p className="text-sand/70 text-sm leading-relaxed font-sans max-w-3xl">
                Military culture trains service members to say "I'm fine." In a C&P examination, that response destroys your claim. Practice common DBQ examiner prompts and learn how to describe your worst days with legal precision.
              </p>
            </div>

            {/* Scenario Selector Chips */}
            <div className="flex items-center gap-2 flex-wrap">
              {CP_SIMULATOR_SCENARIOS.map(sc => (
                <button
                  key={sc.id}
                  onClick={() => {
                    setSelectedCpScenario(sc.id);
                    setCpChoice(null);
                  }}
                  className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all border ${
                    selectedCpScenario === sc.id
                      ? 'bg-gold text-steel-dark border-gold shadow-md'
                      : 'bg-steel/30 border-steel/60 text-sand/70 hover:text-sand hover:bg-steel/50'
                  }`}
                >
                  {sc.title}
                </button>
              ))}
            </div>

            {/* Simulator Interactive Card */}
            {(() => {
              const currentScenario = CP_SIMULATOR_SCENARIOS.find(s => s.id === selectedCpScenario) || CP_SIMULATOR_SCENARIOS[0];
              return (
                <div className="bg-steel/20 border border-steel/50 rounded-3xl p-6 sm:p-8 space-y-6">
                  <div className="bg-steel-dark border border-gold/30 rounded-2xl p-5 space-y-2">
                    <span className="text-[10px] font-mono text-gold uppercase font-bold">Examiner Prompt:</span>
                    <div className="text-base sm:text-lg font-bold text-sand italic font-sans">
                      {currentScenario.examinerPrompt}
                    </div>
                  </div>

                  {/* Multiple Choice Options */}
                  <div className="space-y-3">
                    <span className="text-xs font-mono uppercase text-sand/60 font-bold">Select How You Would Respond:</span>
                    {currentScenario.options.map((opt, i) => (
                      <div
                        key={i}
                        onClick={() => setCpChoice(i)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                          cpChoice === i
                            ? opt.isOptimal
                              ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg'
                              : 'bg-red-950/40 border-red-500/60 shadow-lg'
                            : 'bg-steel-dark/60 border-steel/50 hover:border-steel/80'
                        }`}
                      >
                        <div className="font-bold text-sm text-sand leading-relaxed">{opt.text}</div>
                        {cpChoice === i && (
                          <div className="pt-2 border-t border-steel/40 space-y-1 animate-fade-in font-sans text-xs">
                            <div className={`font-mono font-bold uppercase ${opt.isOptimal ? 'text-emerald-400' : 'text-scarlet'}`}>
                              Result: {opt.ratingImpact}
                            </div>
                            <p className="text-sand/80 leading-relaxed">{opt.feedback}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* SMC Tiers Section */}
            <div className="bg-steel/20 border border-steel/50 rounded-3xl p-6 space-y-4">
              <h3 className="text-xl font-black uppercase text-sand">Special Monthly Compensation (SMC) Maximizer</h3>
              <p className="text-xs text-sand/60">Additional tax-free monthly add-ons on top of your standard 100% disability compensation.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SMC_DATA.map((smc, i) => (
                  <div key={i} className="bg-steel-dark border border-steel/60 rounded-2xl p-5 space-y-2">
                    <div className="flex justify-between items-baseline border-b border-steel/40 pb-2">
                      <span className="text-gold font-black font-mono text-base">{smc.level}</span>
                      <span className="text-emerald-400 font-mono text-xs font-bold">{smc.rate2026}</span>
                    </div>
                    <div className="font-bold text-sm text-sand">{smc.title}</div>
                    <p className="text-xs text-sand/70 leading-relaxed font-sans">{smc.desc}</p>
                    <div className="text-[11px] font-mono text-sand/50 bg-steel/30 p-2 rounded-lg">
                      <strong>Qualifying Criteria:</strong> {smc.criteria}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 8: VA HOUSE HACKER CALCULATOR                            */}
        {/* ============================================================ */}
        {activeTab === 'househack' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-steel/40 via-steel-dark to-steel-dark border border-gold/40 rounded-3xl p-6 sm:p-8 space-y-3 shadow-2xl">
              <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold">
                <Home size={14} /> $0-Down Multi-Family Real Estate
              </div>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-sand">
                VA House Hacker <span className="text-gold">Calculator (2–4 Units)</span>
              </h2>
              <p className="text-sand/70 text-sm leading-relaxed font-sans max-w-3xl">
                Use your VA Loan to purchase a duplex, triplex, or fourplex with zero down payment and zero PMI. Live in unit 1 while tenant rents pay your entire mortgage and generate monthly cash flow.
              </p>
            </div>

            {/* Calculator Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Inputs (7 cols) */}
              <div className="lg:col-span-7 bg-steel/20 border border-steel/50 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-sand uppercase text-sm font-mono text-gold border-b border-steel/40 pb-2">
                  Property & Loan Parameters
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-sand/70 mb-1">State Market</label>
                    <select
                      value={hhState}
                      onChange={(e) => setHhState(e.target.value)}
                      className="w-full bg-steel-dark border border-steel/60 rounded-xl px-3 py-2 text-sm text-sand font-mono focus:outline-none focus:border-gold"
                    >
                      {STATE_GRADES.map(s => (
                        <option key={s.abbr} value={s.abbr}>{s.state} (Grade: {s.grade})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-sand/70 mb-1">Number of Units (2–4)</label>
                    <select
                      value={hhUnits}
                      onChange={(e) => setHhUnits(Number(e.target.value))}
                      className="w-full bg-steel-dark border border-steel/60 rounded-xl px-3 py-2 text-sm text-sand font-mono focus:outline-none focus:border-gold"
                    >
                      <option value={2}>2 Units (Duplex - 1 Rental)</option>
                      <option value={3}>3 Units (Triplex - 2 Rentals)</option>
                      <option value={4}>4 Units (Fourplex - 3 Rentals)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-sand/70 mb-1">Purchase Price ($)</label>
                    <input
                      type="number"
                      value={hhPrice}
                      step={10000}
                      onChange={(e) => setHhPrice(Number(e.target.value))}
                      className="w-full bg-steel-dark border border-steel/60 rounded-xl px-3 py-2 text-sm text-sand font-mono focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-sand/70 mb-1">Interest Rate (%)</label>
                    <input
                      type="number"
                      value={hhRate}
                      step={0.125}
                      onChange={(e) => setHhRate(Number(e.target.value))}
                      className="w-full bg-steel-dark border border-steel/60 rounded-xl px-3 py-2 text-sm text-sand font-mono focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-steel/40">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-sand select-none">
                    <input
                      type="checkbox"
                      checked={hhIsVeteranExempt}
                      onChange={(e) => setHhIsVeteranExempt(e.target.checked)}
                      className="rounded border-steel/60 text-gold focus:ring-gold bg-steel-dark"
                    />
                    <span>10%+ Service-Connected (VA Funding Fee 100% WAIVED)</span>
                  </label>
                </div>
              </div>

              {/* Output Summary (5 cols) */}
              <div className="lg:col-span-5 bg-steel-dark border border-gold/40 rounded-2xl p-6 space-y-5 shadow-xl">
                <div className="border-b border-steel/50 pb-3">
                  <span className="text-[10px] font-mono text-gold uppercase font-bold">House Hack Cash Flow</span>
                  <div className="text-3xl font-black font-mono mt-1 text-emerald-400">
                    {hhResult.netCashFlow >= 0
                      ? `+$${hhResult.netCashFlow.toLocaleString()}/mo Net Profit`
                      : `$${Math.abs(hhResult.netCashFlow).toLocaleString()}/mo Effective Rent`}
                  </div>
                  <div className="text-xs text-sand/60 mt-0.5">
                    {hhResult.netCashFlow >= 0 ? 'You live for 100% FREE + cash flow.' : 'Your monthly housing cost is deeply subsidized.'}
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono text-sand/80">
                  <div className="flex justify-between">
                    <span>Total PITI Mortgage:</span>
                    <strong className="text-sand">${hhResult.piti.toLocaleString()}/mo</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Tenant Gross Rental Income:</span>
                    <strong className="text-emerald-400">${hhResult.grossRent.toLocaleString()}/mo</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>VA Funding Fee Saved:</span>
                    <strong className="text-gold">${(hhPrice * 0.0215).toLocaleString()} Free</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>State Property Tax (100% P&T):</span>
                    <strong className="text-gold">{hhResult.monthlyTax === 0 ? '$0 / mo' : `$${hhResult.monthlyTax}/mo`}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* VA Loan Zero-Down & Streamline Refinance Suite */}
            <VaLoanAnalyzer currentRating={currentRating} />
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 8b: EDUCATION & GI BILL / VR&E STACKING                  */}
        {/* ============================================================ */}
        {activeTab === 'education' && (
          <div className="animate-fade-in">
            <EducationMaximizer currentRating={currentRating} selectedState={selectedState} />
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 9: 50-STATE TAX & TUITION MATRIX                         */}
        {/* ============================================================ */}
        {activeTab === 'statematrix' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-steel/40 via-steel-dark to-steel-dark border border-gold/40 rounded-3xl p-6 sm:p-8 space-y-3 shadow-2xl">
              <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold">
                <Flag size={14} /> State Tax Shields & Waivers
              </div>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-sand">
                50-State <span className="text-gold">Benefits & Tax Shield Matrix</span>
              </h2>
              <p className="text-sand/70 text-sm leading-relaxed font-sans max-w-3xl">
                Where you choose to live after the military changes your net worth by hundreds of thousands of dollars. Compare property tax exemptions, state income tax shields, and dependent tuition programs across all 50 states.
              </p>
            </div>

            {/* State Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(STATE_BENEFITS).map((key) => {
                const st = STATE_BENEFITS[key];
                return (
                  <div key={key} className="bg-steel/20 border border-steel/50 hover:border-gold/50 rounded-2xl p-5 space-y-3 transition-all">
                    <div className="flex justify-between items-baseline border-b border-steel/40 pb-2">
                      <span className="font-black text-lg text-sand">{st.name} ({st.abbr})</span>
                      <span className="text-xs font-mono font-bold text-gold px-2 py-0.5 rounded bg-gold/10 border border-gold/30">
                        {st.taxStatus}
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-sand/75 font-sans">
                      {st.highlights.map((h, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle size={12} className="text-gold flex-shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 10: AVENUES PLAYBOOKS (CAREER & FREEDOM)                 */}
        {/* ============================================================ */}
        {activeTab === 'avenues' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-steel/40 via-steel-dark to-steel-dark border border-gold/40 rounded-3xl p-6 sm:p-8 space-y-3 shadow-2xl">
              <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold">
                <Compass size={14} /> Tactical Post-Military Routes
              </div>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-sand">
                Avenues <span className="text-gold">Playbooks & Master Blueprints</span>
              </h2>
              <p className="text-sand/70 text-sm leading-relaxed font-sans max-w-3xl">
                Comprehensive step-by-step roadmaps for Education Stacking, Federal GS Careers, $47B SDVOSB Set-Asides, Remote Tech, and Pure Expat Freedom.
              </p>
            </div>

            {/* Playbook Selector */}
            <div className="flex items-center gap-2 flex-wrap">
              {AVENUES_DATA.map(av => (
                <button
                  key={av.id}
                  onClick={() => setExpandedAvenue(av.id)}
                  className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all border flex items-center gap-1.5 ${
                    expandedAvenue === av.id
                      ? 'bg-gold text-steel-dark border-gold shadow-md'
                      : 'bg-steel/30 border-steel/60 text-sand/70 hover:text-sand hover:bg-steel/50'
                  }`}
                >
                  <span>{av.icon}</span>
                  <span>{av.title}</span>
                </button>
              ))}
            </div>

            {/* Active Playbook View */}
            {(() => {
              const currentAvenue = AVENUES_DATA.find(a => a.id === expandedAvenue) || AVENUES_DATA[0];
              return (
                <div className="bg-steel/20 border border-steel/50 rounded-3xl p-6 sm:p-8 space-y-6">
                  <div className="border-b border-steel/50 pb-4 space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="text-2xl font-black uppercase text-sand flex items-center gap-2">
                        <span>{currentAvenue.icon}</span>
                        <span>{currentAvenue.title}</span>
                      </h3>
                      <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-xl">
                        Est. Monthly Cash: ${currentAvenue.totalMonthlyEstimate}/mo
                      </span>
                    </div>
                    <p className="text-xs text-gold font-mono font-bold mt-1">{currentAvenue.tagline}</p>
                    <p className="text-xs text-sand/70 pt-2 leading-relaxed">{currentAvenue.overview}</p>
                  </div>

                  {/* Playbook Sections */}
                  <div className="space-y-6">
                    {currentAvenue.sections.map((sec, i) => (
                      <div key={i} className="bg-steel-dark/60 border border-steel/60 rounded-2xl p-5 space-y-3">
                        <h4 className="font-bold text-sm text-gold font-mono uppercase tracking-wide">{sec.heading}</h4>
                        <div className="space-y-2.5">
                          {sec.content.map((item, j) => (
                            <div key={j} className="bg-steel/20 p-3 rounded-xl border border-steel/40 space-y-1">
                              <div className="font-bold text-xs text-sand font-mono">{item.label}</div>
                              <p className="text-xs text-sand/75 leading-relaxed font-sans">{item.detail}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Federal GS Career & FERS Buy-Back Suite */}
            <FederalCareerFastTrack currentRating={currentRating} yearsOfService={yearsOfService} />
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 11: IN-BROWSER MEDICAL SCANNER                           */}
        {/* ============================================================ */}
        {activeTab === 'scanner' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-steel/40 via-steel-dark to-steel-dark border border-gold/40 rounded-3xl p-6 sm:p-8 space-y-3 shadow-2xl">
              <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold">
                <Cpu size={14} /> 100% In-Browser Privacy Scanner
              </div>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-sand">
                Military Medical <span className="text-gold">Record Scanner</span>
              </h2>
              <p className="text-sand/70 text-sm leading-relaxed font-sans max-w-3xl">
                Paste your Service Treatment Records (STR) notes, AHLTA summaries, or civilian diagnoses. Our client-side regex engine maps your symptoms to VA Diagnostic Codes with <strong>zero data leaving your device</strong>.
              </p>
            </div>

            {/* Scanner Input Card */}
            <div className="bg-steel/20 border border-steel/50 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase text-gold font-bold">
                  Paste Medical Record Text or Symptoms:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".txt,.doc,.docx"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    className="px-3 py-1.5 rounded-lg bg-steel-dark border border-steel/60 hover:border-gold text-sand/80 font-mono text-xs flex items-center gap-1 transition-all"
                  >
                    <Upload size={12} /> Upload .txt file
                  </button>
                </div>
              </div>

              <textarea
                rows={6}
                value={scanText}
                onChange={(e) => setScanText(e.target.value)}
                placeholder="Paste clinic notes, MRI reports, DBQs, or describe your symptoms (e.g. 'Patient reports chronic lower back pain with numbness radiating down left leg, persistent tinnitus, CPAP usage for sleep apnea, and nightmares since 2018 deployment...')"
                className="w-full bg-steel-dark/90 border border-steel/60 rounded-xl p-4 text-xs text-sand font-mono focus:outline-none focus:border-gold placeholder:text-sand/30"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setScanText('')}
                  className="px-4 py-2 rounded-xl bg-steel-dark border border-steel/60 text-sand/60 text-xs font-mono"
                >
                  Clear Text
                </button>
                <button
                  onClick={runMedScan}
                  disabled={scanLoading || !scanText.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gold hover:bg-yellow-600 disabled:opacity-50 text-steel-dark font-black font-mono text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all"
                >
                  {scanLoading ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                  <span>{scanLoading ? 'Scanning in Browser...' : 'Run In-Browser Scan'}</span>
                </button>
              </div>
            </div>

            {/* Scan Results Output */}
            {scanResults && (
              <div className="bg-steel-dark border border-gold/40 rounded-3xl p-6 space-y-5 animate-fade-in">
                <div className="flex items-center justify-between border-b border-steel/50 pb-3">
                  <h3 className="font-black text-lg text-sand uppercase">Scan Results: {scanResults.found.length} Matches Found</h3>
                  {scanResults.pactFlag && (
                    <span className="text-xs font-mono font-bold text-scarlet px-3 py-1 rounded-xl bg-red-950/60 border border-scarlet/40">
                      ⚠️ PACT Act Presumptive Triggers Detected
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {scanResults.found.map((hit, i) => (
                    <div key={i} className="bg-steel/30 border border-steel/60 rounded-2xl p-4 space-y-1.5">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-sm text-sand">{hit.condition}</span>
                        <span className="text-xs font-mono text-gold font-bold">DC {hit.dc}</span>
                      </div>
                      <div className="text-xs text-sand/60 font-mono">
                        Matched keyword: <span className="text-sand/90 font-bold">"{hit.matchedKeyword}"</span> • Rating: {hit.ratingRange}
                      </div>
                      <p className="text-xs text-sand/75 leading-relaxed font-sans">{hit.note}</p>
                    </div>
                  ))}
                </div>

                {scanResults.secondaries.length > 0 && (
                  <div className="pt-3 border-t border-steel/50 space-y-2">
                    <span className="text-xs font-mono uppercase text-gold font-bold">High-Yield Secondary Claims to Investigate:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {scanResults.secondaries.map((sec, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-steel text-xs font-mono text-emerald-400 border border-emerald-500/30 font-bold">
                          +{sec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 12: HIGH-VALUE SPECIAL PERKS                             */}
        {/* ============================================================ */}
        {activeTab === 'perks' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-steel/40 via-steel-dark to-steel-dark border border-gold/40 rounded-3xl p-6 sm:p-8 space-y-3 shadow-2xl">
              <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold">
                <Sparkles size={14} /> Sovereign Military Entitlements
              </div>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-sand">
                High-Value <span className="text-gold">Special Perks & Grants</span>
              </h2>
              <p className="text-sand/70 text-sm leading-relaxed font-sans max-w-3xl">
                Space-A Free Flights (Category VI), $117k Adapted Housing Grants, Free National Parks Lifetime Passes, and the 5 Pathways to 100% Free Comprehensive VA Dental Care.
              </p>
            </div>

            {/* Perks Cards List */}
            <div className="space-y-4">
              {SPECIAL_PERKS.map((perk) => {
                const isClaimed = Boolean(completedBenefits[perk.id]);
                const isExpanded = expandedPerk === perk.id;

                return (
                  <div
                    key={perk.id}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isClaimed
                        ? 'border-emerald-500/40 bg-emerald-950/20'
                        : isExpanded
                        ? 'border-gold/60 bg-steel/30 shadow-xl'
                        : 'border-steel/50 bg-steel/20 hover:border-gold/30'
                    }`}
                  >
                    <div
                      onClick={() => setExpandedPerk(isExpanded ? null : perk.id)}
                      className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none"
                    >
                      <div className="flex items-start gap-3.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBenefitCompleted(perk.id);
                          }}
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${
                            isClaimed
                              ? 'bg-emerald-500 border-emerald-400 text-steel-dark'
                              : 'border-steel/60 hover:border-gold bg-steel-dark/60'
                          }`}
                        >
                          {isClaimed && <CheckCircle size={14} />}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-steel text-gold">
                              {perk.badge}
                            </span>
                          </div>
                          <div className={`font-black text-base sm:text-lg mt-0.5 ${isClaimed ? 'line-through text-sand/50' : 'text-sand'}`}>
                            {perk.title}
                          </div>
                          <div className="text-xs text-sand/60">{perk.summary}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="text-right">
                          <div className="text-xs font-mono text-emerald-400 font-bold">{perk.value}</div>
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-steel/40 border border-steel/60 flex items-center justify-center text-sand/60">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-steel/40 bg-steel-dark/60 p-5 space-y-4 animate-fade-in font-sans text-xs">
                        <div className="space-y-2">
                          <strong className="text-gold font-mono uppercase">Step-by-Step Instructions:</strong>
                          <div className="space-y-1.5">
                            {perk.stepByStep.map((s, i) => (
                              <div key={i} className="bg-steel/20 p-2.5 rounded-lg border border-steel/40">
                                <strong className="text-sand">{s.step}:</strong> {s.detail}
                              </div>
                            ))}
                          </div>
                        </div>

                        {perk.proTip && (
                          <div className="bg-steel/30 p-3 rounded-xl border border-gold/30 text-sand/85">
                            <strong className="text-gold font-mono uppercase">Pro Tip:</strong> {perk.proTip}
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-2">
                          {perk.officialLink && (
                            <a
                              href={perk.officialLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 rounded-xl bg-gold hover:bg-yellow-600 text-steel-dark font-mono font-bold text-xs uppercase flex items-center gap-1.5 transition-all shadow-md"
                            >
                              Official Portal <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 13: CRISIS HOTLINES & ACCREDITED VSO DIRECTORY           */}
        {/* ============================================================ */}
        {activeTab === 'directory' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-steel/40 via-steel-dark to-steel-dark border border-gold/40 rounded-3xl p-6 sm:p-8 space-y-3 shadow-2xl">
              <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold">
                <Phone size={14} /> Emergency & Accredited VSO Resources
              </div>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-sand">
                Crisis Hotlines & <span className="text-gold">Accredited VSO Locator</span>
              </h2>
              <p className="text-sand/70 text-sm leading-relaxed font-sans max-w-3xl">
                Direct emergency hotlines, free accredited Veteran Service Organizations (DAV, VFW, American Legion), and essential federal forms.
              </p>
            </div>

            {/* Crisis Callout Banner */}
            <div className="bg-steel/20 border-2 border-scarlet/50 rounded-3xl p-6 space-y-3">
              <h3 className="text-scarlet font-black text-2xl uppercase tracking-tight">Veterans Crisis Line</h3>
              <div className="text-4xl sm:text-5xl font-black text-sand font-mono">988, Press 1</div>
              <div className="text-sm font-mono text-sand/80">Text: <strong className="text-scarlet">838255</strong> • Chat: <strong className="text-sand">VeteransCrisisLine.net</strong></div>
              <p className="text-xs text-sand/60 font-sans">
                Available 24/7/365. Free, confidential, and you do not need to be enrolled in VA healthcare. You earned the right to ask for help.
              </p>
            </div>

            {/* Accredited VSO Locator Component */}
            <VsoLocator selectedState={selectedState} />
          </div>
        )}

      </main>

      {/* 8. VSO Claim Dossier Modal */}
      {showDossierModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-steel-dark border border-gold/40 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-steel/50 pb-3">
              <div className="flex items-center gap-2 text-gold font-bold">
                <FileText size={20} />
                <h3 className="font-black text-lg text-sand uppercase">VSO Accredited Representative Briefing Dossier</h3>
              </div>
              <button onClick={() => setShowDossierModal(false)} className="text-sand/40 hover:text-sand text-lg font-black">✕</button>
            </div>

            <div className="bg-steel/30 border border-steel/50 rounded-xl p-4 font-mono text-xs text-sand/80 space-y-3 leading-relaxed max-h-96 overflow-y-auto">
              <div className="text-gold font-bold text-center border-b border-steel/40 pb-2">
                === CONFIDENTIAL VETERAN SERVICE OFFICER (VSO) BRIEFING SHEET ===
              </div>
              <div><strong>Veteran Profile:</strong> {userName || 'U.S. Veteran'} | Branch: {bd.name}</div>
              <div><strong>Current Disability Status:</strong> {currentRating}% Service-Connected | Target: 100% P&T</div>
              <div><strong>Target State of Domicile:</strong> {stateInfo.name} ({stateInfo.taxStatus})</div>
              <div><strong>Estimated Annual Tax-Free Cash:</strong> ${annualPay.toLocaleString()}/yr (${monthlyPay.toLocaleString()}/mo)</div>
              
              <div className="pt-2 border-t border-steel/40 font-bold text-gold">ACTIVE CONTENDED DIAGNOSES & TARGET DBQS:</div>
              <div>- Review for Secondary Service Connection (Sleep Apnea, Radiculopathy, Migraines, GERD)</div>
              <div>- Review PACT Act Presumptive Eligibility for Deployed Theaters</div>
              <div>- Check SMC Eligibility (SMC-K for loss of creative organ / SMC-S for Housebound)</div>

              <div className="pt-2 border-t border-steel/40 font-bold text-gold">CLAIMED & COMPLETED IN-BROWSER PERKS:</div>
              {Object.keys(completedBenefits).filter(k => completedBenefits[k]).map((k, i) => (
                <div key={i}>✓ {k}</div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  const completedList = Object.keys(completedBenefits).filter(k => completedBenefits[k]);
                  const textToCopy = `=== VSO CLAIM BRIEFING DOSSIER ===\nVeteran: ${userName || 'U.S. Veteran'} (${bd.name})\nCurrent Rating: ${currentRating}%\nTarget State: ${stateInfo.name}\nMonthly Comp: $${monthlyPay.toLocaleString()}/mo\nAnnual Value: $${annualPay.toLocaleString()}/yr\n\nTarget Items:\n- Review for PACT Act Presumptives\n- Review for Secondary Connections (Sleep Apnea, Migraines, Radiculopathy, GERD)\n- Review for SMC-K / SMC-S add-ons\n\nClaimed Benefits:\n${completedList.map(c => `- ${c}`).join('\n') || '- None marked yet'}`;
                  copyToClipboard(textToCopy);
                }}
                className="px-5 py-2.5 rounded-xl bg-gold text-steel-dark font-black font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <Copy size={13}/> Copy Dossier Text
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-steel-dark border border-steel/60 hover:border-gold text-sand font-mono text-xs uppercase font-bold flex items-center justify-center gap-1.5"
              >
                <Printer size={13}/> Print Briefing Sheet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Profile Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-steel-dark border border-gold/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-steel/50 pb-3">
              <div className="flex items-center gap-2 text-gold font-bold">
                <Sliders size={18} />
                <h3 className="font-black text-lg text-sand uppercase">Edit Veteran Profile</h3>
              </div>
              <button onClick={() => setShowSettingsModal(false)} className="text-sand/40 hover:text-sand text-lg font-black">✕</button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="block uppercase text-gold font-bold mb-1">Your Name / Callsign</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Sgt Miller / Devil Dog"
                  className="w-full bg-steel/30 border border-steel/60 rounded-xl px-3 py-2 text-sand text-sm focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-gold font-bold mb-1">Military Branch</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-steel/30 border border-steel/60 rounded-xl px-3 py-2 text-sand text-sm focus:outline-none focus:border-gold"
                  >
                    <option value="usmc">Marine Corps (USMC)</option>
                    <option value="army">Army</option>
                    <option value="navy">Navy</option>
                    <option value="usaf">Air Force</option>
                    <option value="uscg">Coast Guard</option>
                    <option value="ussf">Space Force</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase text-gold font-bold mb-1">State of Residence</label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full bg-steel/30 border border-steel/60 rounded-xl px-3 py-2 text-sand text-sm focus:outline-none focus:border-gold"
                  >
                    {Object.keys(STATE_BENEFITS).map(k => (
                      <option key={k} value={k}>{STATE_BENEFITS[k].name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-gold font-bold mb-1">Current Rating (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={10}
                    value={currentRating}
                    onChange={(e) => setCurrentRating(Number(e.target.value))}
                    className="w-full bg-steel/30 border border-steel/60 rounded-xl px-3 py-2 text-sand text-sm focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block uppercase text-gold font-bold mb-1">Dependents Status</label>
                  <select
                    value={hasDependents}
                    onChange={(e) => setHasDependents(e.target.value)}
                    className="w-full bg-steel/30 border border-steel/60 rounded-xl px-3 py-2 text-sand text-sm focus:outline-none focus:border-gold"
                  >
                    <option value="single">Single (No Dependents)</option>
                    <option value="spouse">Married / With Spouse</option>
                    <option value="single_kids">Single + Children</option>
                    <option value="family">Spouse + Children (Family)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  saveState({ userName, branch, selectedState, currentRating, hasDependents });
                  setShowSettingsModal(false);
                }}
                className="w-full py-3 rounded-xl bg-gold hover:bg-yellow-600 text-steel-dark font-black font-mono text-xs uppercase tracking-wider shadow-lg transition-all"
              >
                Save & Update Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. Footer Component */}
      <Footer />
    </div>
  );
};

export default VeteranBenefitsCompass;
