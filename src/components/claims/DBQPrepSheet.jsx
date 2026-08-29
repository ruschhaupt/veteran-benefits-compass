import React from 'react';
import { Printer, Shield, FileText, CheckCircle } from 'lucide-react';

export const DBQPrepSheet = ({
  veteranName = 'U.S. Veteran',
  branch = 'USMC',
  condition = 'Lumbar Spine Strain & Degenerative Disc Disease',
  dcCode = '5242 / 5243',
  targetRating = '20% - 40%',
  onClose
}) => {
  return (
    <div className="bg-white text-gray-900 p-6 sm:p-10 rounded-2xl max-w-4xl mx-auto shadow-2xl space-y-6 font-sans print:p-0 print:shadow-none">
      {/* Header Banner - Printable */}
      <div className="border-b-2 border-gray-900 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="text-xs font-mono font-bold tracking-widest text-gray-500 uppercase">
            Disability Benefits Questionnaire (DBQ) • Physician Examination Preparation Dossier
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-950 uppercase mt-0.5">
            Clinical Impairment Assessment Prep
          </h2>
          <div className="text-xs text-gray-600 mt-1 font-mono">
            Prepared under 38 CFR § 4.71a & § 4.10 (Functional Loss & Flare-Up Principles)
          </div>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-gray-900 text-white font-mono text-xs font-bold rounded-xl hover:bg-gray-800 flex items-center gap-1.5 shadow-md transition-all"
          >
            <Printer size={14} /> Print Dossier
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-2 bg-gray-200 text-gray-700 font-mono text-xs font-bold rounded-xl hover:bg-gray-300"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Veteran Intake Info Box */}
      <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div>
          <span className="text-gray-500 block uppercase text-[10px]">Veteran</span>
          <strong className="text-gray-900 text-sm">{veteranName}</strong>
        </div>
        <div>
          <span className="text-gray-500 block uppercase text-[10px]">Branch of Service</span>
          <strong className="text-gray-900 text-sm">{branch.toUpperCase()}</strong>
        </div>
        <div>
          <span className="text-gray-500 block uppercase text-[10px]">Target Condition</span>
          <strong className="text-gray-900 text-sm">{condition}</strong>
        </div>
        <div>
          <span className="text-gray-500 block uppercase text-[10px]">VA Diagnostic Code</span>
          <strong className="text-gray-900 text-sm">DC {dcCode}</strong>
        </div>
      </div>

      {/* Section 1: Caluza Triangle Evidence Framework */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1 flex items-center gap-2">
          <Shield size={14} className="text-amber-700" />
          1. Statutory Caluza Elements Verification
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-1">
            <strong className="text-gray-900 block font-mono">Element 1: In-Service Incurrence</strong>
            <p className="text-gray-600 text-[11px]">
              Documented event, injury, trauma, or toxic exposure in Service Treatment Records (STRs) or via PACT Act deployment presumption.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-1">
            <strong className="text-gray-900 block font-mono">Element 2: Current Diagnosis</strong>
            <p className="text-gray-600 text-[11px]">
              Active clinical diagnosis established by a licensed medical practitioner with objective imaging (X-ray, MRI) or diagnostic testing.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-1">
            <strong className="text-gray-900 block font-mono">Element 3: Medical Nexus</strong>
            <p className="text-gray-600 text-[11px]">
              Medical opinion establishing that the current condition is "at least as likely as not (50%+ probability)" caused by in-service events.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Clinical Functional Impairment Assessment */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1 flex items-center gap-2">
          <FileText size={14} className="text-blue-700" />
          2. Clinical Functional Impairment Checklist (For Examining Physician)
        </h3>
        <p className="text-xs text-gray-600 leading-relaxed">
          Per <strong>DeLuca v. Brown (1995)</strong> and <strong>Mitchell v. Shinseki (2011)</strong>, the examiner MUST record limitation of motion due to pain, fatigue, weakness, lack of endurance, and incoordination during repetitive use and flare-ups.
        </p>

        <div className="border border-gray-300 rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300 font-mono text-[11px] text-gray-700">
                <th className="p-2.5">Evaluation Metric</th>
                <th className="p-2.5">Clinical Standard</th>
                <th className="p-2.5">Veteran Reported Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-800">
              <tr>
                <td className="p-2.5 font-bold">Initial Onset of Pain</td>
                <td className="p-2.5">Measure range of motion (goniometer) at FIRST onset of pain, not maximum tolerance.</td>
                <td className="p-2.5 text-gray-600">Motion stops at onset of pain / discomfort.</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold">Flare-Up Severity</td>
                <td className="p-2.5">Estimate range of motion and functional loss during active flare-up episodes.</td>
                <td className="p-2.5 text-gray-600">Occurs 3-5 times monthly; bed rest required for 24-48 hours.</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold">Repetitive Motion Fatigue</td>
                <td className="p-2.5">Does repeated movement (3+ cycles) cause additional degradation in motion or strength?</td>
                <td className="p-2.5 text-gray-600">Marked degradation after 3 repetitions.</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold">Occupational Impairment</td>
                <td className="p-2.5">Describe functional limitations on sedentary, physical, or prolonged standing duties.</td>
                <td className="p-2.5 text-gray-600">Inability to sit for &gt; 30 mins; cannot lift &gt; 25 lbs.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Statutory Nexus Phrasing Standard */}
      <div className="space-y-2 bg-amber-50/60 border border-amber-300 rounded-xl p-4 text-xs space-y-2">
        <h4 className="font-bold text-amber-950 uppercase text-[11px] font-mono flex items-center gap-1.5">
          <CheckCircle size={14} className="text-amber-800" />
          Statutory Medical Nexus Language Guide (38 CFR § 3.102 - Benefit of the Doubt)
        </h4>
        <p className="text-amber-900 leading-relaxed">
          The VA adjudicator evaluates medical opinions against the legal standard of proof. The physician should state:
        </p>
        <blockquote className="bg-white border-l-4 border-amber-600 p-3 text-gray-800 italic font-serif text-[12px] rounded">
          "It is my professional medical opinion that it is <strong>at least as likely as not (50% or greater probability)</strong> that the veteran's [{condition}] is etiologically related to / aggravated by their active military service, based on review of service records, clinical examination, and objective diagnostic findings."
        </blockquote>
      </div>

      {/* Footer Notice */}
      <div className="pt-2 border-t border-gray-300 flex flex-col sm:flex-row justify-between text-[10px] font-mono text-gray-500">
        <span>Veteran Benefits Compass • Educational DBQ Prep Template</span>
        <span>Independent Veteran Resource • 38 CFR Compliant</span>
      </div>
    </div>
  );
};

export default DBQPrepSheet;
