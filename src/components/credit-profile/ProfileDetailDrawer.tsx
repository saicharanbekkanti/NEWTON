import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Activity, CheckCircle2, Clock, TrendingUp, Layers, HelpCircle, ArrowRight } from 'lucide-react';
import type { StructuredFinancialIdentityProfile, ProfileDimension } from '@/lib/credenceEngine';

interface ProfileDetailDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    profile: StructuredFinancialIdentityProfile;
    onSelectDimension: (dimension: ProfileDimension) => void;
}

export const ProfileDetailDrawer: React.FC<ProfileDetailDrawerProps> = ({
    isOpen,
    onClose,
    profile,
    onSelectDimension
}) => {
    if (!isOpen) return null;

    const { dimensions } = profile;

    const dimensionList = [
        { dim: dimensions.cashFlowStability, icon: <Activity className="w-5 h-5 text-indigo-400" /> },
        { dim: dimensions.paymentConsistency, icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" /> },
        { dim: dimensions.financialContinuity, icon: <Clock className="w-5 h-5 text-sky-400" /> },
        { dim: dimensions.financialActivity, icon: <Layers className="w-5 h-5 text-amber-400" /> },
        { dim: dimensions.growthChangePattern, icon: <TrendingUp className="w-5 h-5 text-purple-400" /> },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ESTABLISHED':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            case 'DEVELOPING':
                return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
            case 'LIMITED EVIDENCE':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
            default:
                return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
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
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                />

                <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="w-screen max-w-2xl bg-slate-950 border-l border-slate-800 text-slate-100 shadow-2xl flex flex-col justify-between overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="p-6 sm:p-8 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-10 flex items-start justify-between">
                            <div className="space-y-1">
                                <span className="text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-outfit">
                                    MATURED FINANCIAL UNDERSTANDING
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-outfit font-black text-white tracking-tight uppercase mt-2">
                                    Structured Profile Breakdown
                                </h2>
                                <p className="text-xs text-slate-400 font-medium">
                                    Comprehensive commercial understanding derived from verified operational activity
                                </p>
                            </div>

                            <button
                                onClick={onClose}
                                className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content Body */}
                        <div className="p-6 sm:p-8 space-y-8 flex-1">
                            {/* Institutional Principle Notice */}
                            <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-900/40 text-xs text-indigo-200 flex items-start gap-3">
                                <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <span className="font-bold uppercase tracking-wider block text-indigo-300">
                                        CREDENCE does not replace a lender's credit decision.
                                    </span>
                                    <p className="text-slate-300 leading-relaxed font-normal">
                                        CREDENCE translates real-world operational records into mature, relevant financial understanding. It does not guarantee lending eligibility or make lending decisions.
                                    </p>
                                </div>
                            </div>

                            {/* Profile Overview Stats */}
                            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
                                            FINANCIAL IDENTITY STATUS
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border font-mono ${getStatusBadge(profile.status)}`}>
                                            {profile.status}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
                                            PROFILE MATURITY
                                        </span>
                                        <span className="text-xs font-black text-emerald-400 font-mono uppercase">
                                            {profile.overallEvidenceStrength === 'STRONG' ? 'MATURED' : profile.overallEvidenceStrength === 'MODERATE' ? 'DEVELOPING' : profile.overallEvidenceStrength === 'LIMITED' ? 'EARLY' : 'BUILDING'}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
                                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">
                                            Observation Span
                                        </span>
                                        <span className="text-sm font-outfit font-black text-white mt-1 block">
                                            {profile.observationPeriod}
                                        </span>
                                    </div>
                                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">
                                            Understanding Depth
                                        </span>
                                        <span className="text-sm font-outfit font-black text-white mt-1 block">
                                            {profile.evidenceCoverage}%
                                        </span>
                                    </div>
                                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">
                                            Connected Sources
                                        </span>
                                        <span className="text-sm font-outfit font-black text-white mt-1 block">
                                            {profile.connectedSourcesCount}
                                        </span>
                                    </div>
                                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">
                                            Records Analysed
                                        </span>
                                        <span className="text-sm font-outfit font-black text-white mt-1 block">
                                            {profile.recordsAnalysed.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Behavioural Signals List */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 font-mono">
                                        Observed Behavioural Signals
                                    </h3>
                                    <span className="text-[9px] font-mono text-slate-500 uppercase">
                                        Click to inspect understanding & signals
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {dimensionList.map(({ dim, icon }) => (
                                        <div
                                            key={dim.id}
                                            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                        >
                                            <div className="flex items-start gap-3.5">
                                                <div className="p-2.5 rounded-xl bg-slate-800/80 shrink-0">
                                                    {icon}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-outfit font-black text-sm uppercase tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                                                            {dim.title}
                                                        </h4>
                                                        <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider font-mono bg-slate-800 text-slate-300">
                                                            {dim.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                                        {dim.explanation}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    onClose();
                                                    onSelectDimension(dim);
                                                }}
                                                className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-[11px] font-outfit font-black uppercase tracking-wider shrink-0 flex items-center gap-1.5 transition-colors"
                                            >
                                                <HelpCircle className="w-3.5 h-3.5" />
                                                <span>Why this result?</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex items-center justify-between">
                            <div className="text-[10px] text-slate-500 font-mono">
                                SCOPED TO AUTHENTICATED FIREBASE UID
                            </div>
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-outfit font-black text-xs uppercase tracking-wider transition-colors"
                            >
                                Close Profile View
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    );
};
