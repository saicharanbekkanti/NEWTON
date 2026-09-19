import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, 
    ShieldCheck, 
    Sparkles, 
    CheckCircle2, 
    AlertTriangle, 
    ArrowUpRight, 
    TrendingUp, 
    Clock, 
    Activity, 
    Database, 
    FileText 
} from 'lucide-react';
import type { CredenceScoreResult } from '@/lib/credenceEngine';

interface WhyThisScoreModalProps {
    isOpen: boolean;
    onClose: () => void;
    scoreResult: CredenceScoreResult;
    onSelectDimension?: (key: string) => void;
}

export const WhyThisScoreModal: React.FC<WhyThisScoreModalProps> = ({
    isOpen,
    onClose,
    scoreResult,
    onSelectDimension
}) => {
    if (!isOpen) return null;

    const getIcon = (key: string) => {
        switch (key) {
            case 'cashFlowStability': return <TrendingUp className="w-5 h-5 text-emerald-400" />;
            case 'paymentConsistency': return <CheckCircle2 className="w-5 h-5 text-indigo-400" />;
            case 'financialContinuity': return <Clock className="w-5 h-5 text-sky-400" />;
            case 'financialActivity': return <Activity className="w-5 h-5 text-amber-400" />;
            case 'evidenceQuality': return <Database className="w-5 h-5 text-purple-400" />;
            default: return <ShieldCheck className="w-5 h-5 text-indigo-400" />;
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md"
                />

                {/* Modal Window */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] bg-[#090D1A] border border-slate-800 text-slate-100 shadow-2xl z-10 p-6 sm:p-10 space-y-8"
                >
                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-slate-800/80 pb-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                                    SCORE EXPLANATION ENGINE
                                </span>
                                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                    {scoreResult.methodologyVersion}
                                </span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-outfit font-black uppercase tracking-tight text-white flex items-center gap-3 mt-2">
                                <ShieldCheck className="w-7 h-7 text-indigo-400" />
                                WHY THIS SCORE?
                            </h2>
                            <p className="text-xs text-slate-400 font-medium">
                                Deterministic behavioural attribution derived from authorized longitudinal financial records.
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2.5 rounded-full bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Top Summary Box */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">CREDENCE SCORE</span>
                            <div className="text-3xl font-outfit font-black text-white flex items-baseline gap-1.5">
                                <span>{scoreResult.score}</span>
                                <span className="text-sm font-bold text-slate-500">/ 900</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                                {scoreResult.classification} CREDIBILITY
                            </span>
                        </div>

                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">CONFIDENCE LEVEL</span>
                            <div className="text-2xl font-outfit font-black text-indigo-400">
                                {scoreResult.confidence}
                            </div>
                            <span className="text-[10px] font-medium text-slate-400">
                                High evidence depth
                            </span>
                        </div>

                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">EVIDENCE COVERAGE</span>
                            <div className="text-2xl font-outfit font-black text-white">
                                {scoreResult.observationPeriodText}
                            </div>
                            <span className="text-[10px] font-medium text-slate-400">
                                Longitudinal observation
                            </span>
                        </div>

                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">VERIFIED SOURCES</span>
                            <div className="text-2xl font-outfit font-black text-white">
                                {scoreResult.sourcesCount} Feeds
                            </div>
                            <span className="text-[10px] font-medium text-slate-400">
                                {scoreResult.recordsCount} total records
                            </span>
                        </div>
                    </div>

                    {/* Section 1: What Contributed */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-indigo-400" />
                                WHAT CONTRIBUTED (BEHAVIOURAL DIMENSIONS)
                            </h3>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Click dimension to inspect proof
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {scoreResult.contributors.map((c) => (
                                <div
                                    key={c.key}
                                    onClick={() => {
                                        if (onSelectDimension) onSelectDimension(c.key);
                                    }}
                                    className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all space-y-3 group"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/50">
                                            {getIcon(c.key)}
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xl font-outfit font-black text-white group-hover:text-indigo-400 transition-colors">
                                                +{c.score}
                                            </span>
                                            <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                                Weight {(c.weight * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-black uppercase tracking-wider text-white">
                                            {c.factor}
                                        </h4>
                                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                                            {c.whatItMeasures}
                                        </p>
                                    </div>

                                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                                        <span className="font-bold text-emerald-400">{c.strength} EVIDENCE</span>
                                        <span className="text-indigo-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                                            Drilldown <ArrowUpRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 2: Key Supporting Evidence */}
                    <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            KEY SUPPORTING EVIDENCE (TRACEABLE PROOF)
                        </h3>

                        <div className="space-y-2.5">
                            {scoreResult.supportingEvidence.map((evidenceText, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800/60">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                    <span className="text-xs font-medium text-slate-200 leading-relaxed">
                                        {evidenceText}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 3: Evidence Limitations & Gaps */}
                    <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                            EVIDENCE LIMITATIONS & OBSERVED GAPS
                        </h3>

                        <div className="space-y-2.5">
                            {scoreResult.limitations.map((lim, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-medium text-slate-300 leading-relaxed">
                                            {lim}
                                        </span>
                                        <p className="text-[10px] text-slate-400">
                                            Note: This is an evidence coverage limitation, not a negative behavioural evaluation.
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer / Disclaimer */}
                    <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[10px] text-slate-400">
                        <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                            <span>Calculated on {new Date(scoreResult.calculatedAt).toLocaleDateString()} via CREDENCE Engine v1.0</span>
                        </div>
                        <span className="uppercase tracking-widest text-slate-400">
                            Authorized Financial Intelligence • Not an official Bureau score
                        </span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
