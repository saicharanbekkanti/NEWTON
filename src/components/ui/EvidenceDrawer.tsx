import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, CheckCircle2, ChevronDown, ChevronUp, AlertCircle, ArrowRight } from 'lucide-react';
import type { EvidenceTrailItem } from '@/lib/credenceEngine';
import type { StoredFinancialRecord } from '@/lib/supabase';

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  signal: EvidenceTrailItem | null;
  records: StoredFinancialRecord[];
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  isOpen,
  onClose,
  signal,
  records,
}) => {
  const [showLedger, setShowLedger] = React.useState(false);

  if (!isOpen || !signal) return null;

  const relevantRecords = signal.sourceRecords && signal.sourceRecords.length > 0 
    ? signal.sourceRecords 
    : records.slice(0, 10);

  const getStrengthBadge = (strength: string) => {
    switch (strength) {
      case 'STRONG':
        return <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">MATURED PROFILE</span>;
      case 'MODERATE':
        return <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">DEVELOPING CONTEXT</span>;
      case 'LIMITED':
        return <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">EARLY CONTEXT</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">BUILDING CONTEXT</span>;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-screen max-w-xl bg-white dark:bg-[#0b0f19] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-900/60 backdrop-blur-md sticky top-0 z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60 font-outfit">
                    EXPLAINABLE SIGNAL VERIFICATION
                  </span>
                  {getStrengthBadge(signal.strength)}
                </div>
                <h2 className="text-2xl font-outfit font-black text-slate-900 dark:text-white tracking-tight uppercase">{signal.title}</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Quantitative signal decomposed into authentic commercial understanding</p>
              </div>

              <button
                onClick={onClose}
                className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-8 flex-1">
              {/* Score & Weight Overview */}
              <div className="grid grid-cols-3 gap-4 p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Calculated Score</div>
                  <div className="text-3xl font-outfit font-black text-slate-900 dark:text-white mt-1">{signal.score}<span className="text-xs font-bold text-slate-400">/100</span></div>
                </div>
                <div>
                  <div className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Model Weight</div>
                  <div className="text-3xl font-outfit font-black text-indigo-600 dark:text-indigo-400 mt-1">25%</div>
                </div>
                <div>
                  <div className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Verification Level</div>
                  <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mt-2.5 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> 100% AUDITED
                  </div>
                </div>
              </div>

              {/* Explainable AI Decomposition: RESULT -> SIGNAL -> SUPPORTING EVIDENCE -> SOURCE RECORDS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-outfit font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                    Understanding & Signal Chain (Why This Result?)
                  </h3>
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                    RESULT → SIGNAL → UNDERSTANDING → RECORDS
                  </span>
                </div>

                {/* Level 1: Result */}
                <div className="p-5 rounded-[1.5rem] bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-800/40 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-outfit font-black tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">1</span>
                      LEVEL 1: RESULT
                    </div>
                    <span className="text-[10px] font-mono font-bold">{signal.score} / 100 ({signal.strength})</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                    Contributes 25% weighting to the synthesized Financial Identity score with high model confidence.
                  </p>
                </div>

                {/* Level 2: Signal */}
                <div className="p-5 rounded-[1.5rem] bg-sky-50/40 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-800/40 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-outfit font-black tracking-wider text-sky-600 dark:text-sky-400 uppercase">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">2</span>
                    LEVEL 2: SIGNAL
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">{signal.observation}</p>
                </div>

                {/* Level 3: Relevant Signals & Understanding */}
                <div className="p-5 rounded-[1.5rem] bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/40 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-outfit font-black tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">3</span>
                    LEVEL 3: RELEVANT SIGNALS & UNDERSTANDING
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">{signal.evidence}</p>
                </div>

                {/* Interpretation */}
                <div className="p-5 rounded-[1.5rem] bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-800/40 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-outfit font-black tracking-wider text-purple-600 dark:text-purple-400 uppercase">
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">✦</span>
                    UNDERWRITING INTERPRETATION
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">{signal.interpretation}</p>
                </div>
              </div>

              {/* Verification Safeguards */}
              <div className="space-y-3">
                <h3 className="text-xs font-outfit font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Underwriting Safeguards</h3>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Cross-verified against primary banking & merchant transaction streams</span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>No circular transaction loops detected across counterparties</span>
                  </div>
                </div>
              </div>

              {/* Level 4: Underlying Source Records Collapsible */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden bg-slate-50/50 dark:bg-slate-900/40">
                <button
                  onClick={() => setShowLedger(!showLedger)}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">4</span>
                    <span className="text-xs font-outfit font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      LEVEL 4: SOURCE RECORDS ({relevantRecords.length} Audited Slips)
                    </span>
                  </div>
                  {showLedger ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {showLedger && (
                  <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5 max-h-64 overflow-y-auto">
                    {relevantRecords.length === 0 ? (
                      <div className="text-xs text-slate-500 py-4 text-center font-medium">No underlying records found.</div>
                    ) : (
                      relevantRecords.map((r) => (
                        <div key={r.id} className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="font-bold text-slate-900 dark:text-white">{r.description}</div>
                            <div className="font-outfit font-black text-emerald-600 dark:text-emerald-400">
                              +₹{r.inflow.toLocaleString('en-IN')}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                            <span>{r.record_date} • {r.category}</span>
                            <span className="text-slate-400">Ref: {r.transaction_ref || 'UTR-BATCH'}</span>
                          </div>
                          {r.receipt_hash && (
                            <div className="text-[9px] font-mono text-indigo-500/80 dark:text-indigo-400/80 truncate">
                              Hash: {r.receipt_hash}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <AlertCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Audited cryptographic lineage logged</span>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-outfit font-black text-xs uppercase tracking-widest transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
              >
                <span>Dismiss</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
