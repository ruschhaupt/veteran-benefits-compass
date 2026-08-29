import React, { useState } from 'react';
import { Copy, Check, Share2, X, MessageSquare, ExternalLink } from 'lucide-react';

export const ShareModal = ({ isOpen, onClose, redditText, smsText, rating, stateName }) => {
  const [copiedType, setCopiedType] = useState(null);

  if (!isOpen) return null;

  const handleCopy = (type, text) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-steel-dark border border-gold/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-fade-in relative font-mono">
        <div className="flex items-center justify-between border-b border-steel/50 pb-3">
          <div className="flex items-center gap-2 text-gold font-bold">
            <Share2 size={18} />
            <h3 className="font-black text-lg text-sand uppercase">Share Your Anonymized Win</h3>
          </div>
          <button onClick={onClose} className="text-sand/40 hover:text-sand text-lg font-black">
            <X size={20} />
          </button>
        </div>

        <p className="text-xs text-sand/70 font-sans leading-relaxed">
          Zero personal info (name, SSN, or contact data) is included. Share your anonymized calculation with your unit chat or the Reddit community to help other veterans get what they earned.
        </p>

        {/* Option 1: Reddit Markdown */}
        <div className="bg-steel/20 border border-steel/50 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sand uppercase">
              1. Reddit Markdown (r/VeteransBenefits)
            </span>
            <button
              onClick={() => handleCopy('reddit', redditText)}
              className="px-3 py-1.5 rounded-lg bg-gold hover:bg-yellow-600 text-steel-dark text-xs font-bold flex items-center gap-1 transition-all"
            >
              {copiedType === 'reddit' ? <Check size={12} /> : <Copy size={12} />}
              <span>{copiedType === 'reddit' ? 'Copied!' : 'Copy Markdown'}</span>
            </button>
          </div>
          <textarea
            readOnly
            value={redditText}
            rows={4}
            className="w-full bg-steel-dark border border-steel/60 rounded-xl p-2.5 text-[11px] text-sand/80 focus:outline-none resize-none font-mono"
          />
        </div>

        {/* Option 2: SMS / Group Chat Format */}
        <div className="bg-steel/20 border border-steel/50 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sand uppercase flex items-center gap-1.5">
              <MessageSquare size={13} className="text-emerald-400" />
              2. Text / WhatsApp / Signal Format
            </span>
            <button
              onClick={() => handleCopy('sms', smsText)}
              className="px-3 py-1.5 rounded-lg bg-steel-dark border border-steel/60 hover:border-gold text-sand text-xs font-bold flex items-center gap-1 transition-all"
            >
              {copiedType === 'sms' ? <Check size={12} /> : <Copy size={12} />}
              <span>{copiedType === 'sms' ? 'Copied!' : 'Copy Text'}</span>
            </button>
          </div>
          <textarea
            readOnly
            value={smsText}
            rows={3}
            className="w-full bg-steel-dark border border-steel/60 rounded-xl p-2.5 text-[11px] text-sand/80 focus:outline-none resize-none font-mono"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-steel border border-steel/60 hover:border-gold text-sand text-xs font-bold uppercase transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
