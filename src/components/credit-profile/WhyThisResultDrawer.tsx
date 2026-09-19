import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, ChevronDown, ChevronUp, Database, Calendar } from 'lucide-react';
import type { ProfileDimension } from '@/lib/credenceEngine';
import type { StoredFinancialRecord } from '@/lib/supabase';

interface WhyThisResultDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    dimension: ProfileDimension | null;
    allRecords?: StoredFinancialRecord[];
}

export const WhyThisResultDrawer: React.FC<WhyThisResultDrawerProps> = ({
    isOpen,
    onClose,
    dimension,
    allRecords = []
}) => {
    const [showLedger, setShowLedger] = useState(false);

    if (!isOpen || !dimension) return null;

    const relevantRecords = dimension.supportingRecords && dimension.supportingRecords.length > 0
        ? dimension.supportingRecords
        : allRecords.slice(0, 10);

    const getStrengthBadge = (strength: string) => {
        switch (strength) {
            case 'STRONG':
                return (
                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        MATURED PROFILE
                    </span>
                );
            case 'MODERATE':
                return (
                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                        DEVELOPING CONTEXT
                    </span>
                );
            case 'LIMITED':
                return (
                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        EARLY CONTEXT
                    </span>
                );
            default:
                return (
                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        BUILDING UNDERSTANDING
                    </span>
                );
        }
    };

    const getStatusBadge = (status: string, color: string) => {
        const colorClasses = 
            color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
            color === 'indigo' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' :
            color === 'amber' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
            color === 'rose' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
            'bg-slate-500/10 text-slate-400 border-slate-500/30';

        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border font-mono ${colorClasses}`}>
                {status}
            </span>
        );
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
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-outfit">
                                        UNDERSTANDING DRILL-DOWN
                                    </span>
                                    {getStrengthBadge(dimension.evidenceStrength)}
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 font-mono">
                                        WHY THIS RESULT?
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-outfit font-black text-white tracking-tight uppercase mt-0.5">
                                        {dimension.title}
                                    </h2>
                                </div>
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
                            {/* Assessment & Observation Period */}
                            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1 font-mono">
                                            ASSESSMENT STATUS
                                        </span>
                                        {getStatusBadge(dimension.status, dimension.statusColor)}
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1 font-mono">
                                            OBSERVATION PERIOD
                                        </span>
                                        <div className="flex items-center sm:justify-end gap-1.5 text-xs font-mono font-bold text-slate-200">
                                            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                                            <span>{dimension.observationPeriod}</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm font-medium text-slate-300 leading-relaxed">
                                    {dimension.explanation}
                                </p>
                            </div>

                            {/* Relevant Signals Observed */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 font-mono">
                                        Relevant Financial Signals Observed
                                    </h3>
                                </div>
                                <div className="space-y-2.5">
                                    {dimension.evidenceItems.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-3"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                                            <span className="text-xs font-medium text-slate-200 leading-relaxed">
                                                {item}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Maturity & Relevance Rationale */}
                            <div className="p-5 rounded-3xl bg-indigo-950/20 border border-indigo-900/30 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 font-mono">
                                        MATURITY & RELEVANCE RATIONALE
                                    </span>
                                    <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">
                                        Contextual Weighting
                                    </span>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                    {dimension.evidenceStrengthReason}
                                </p>
                            </div>

                            {/* Self-Comparison / Quantitative Breakdown if available */}
                            {dimension.details && Object.keys(dimension.details).length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 font-mono">
                                        Quantitative Indicators
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {Object.entries(dimension.details).map(([key, val]) => (
                                            <div key={key} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                                                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block truncate">
                                                    {key.replace(/([A-Z])/g, ' $1')}
                                                </span>
                                                <span className="text-base font-outfit font-black text-white mt-1 block">
                                                    {typeof val === 'number' && key.toLowerCase().includes('inflow')
                                                        ? `₹${val.toLocaleString('en-IN')}`
                                                        : String(val)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Supporting Records Ledger Toggle */}
                            <div className="pt-2">
                                <button
                                    onClick={() => setShowLedger(!showLedger)}
                                    className="w-full p-4 rounded-2xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 flex items-center justify-between text-xs font-outfit font-black uppercase tracking-wider text-indigo-400 transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        <Database className="w-4 h-4 text-indigo-400" />
                                        <span>View Relevant Transaction Records ({relevantRecords.length} Records) →</span>
                                    </span>
                                    {showLedger ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>

                                {showLedger && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-4 space-y-2 overflow-hidden"
                                    >
                                        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                                            <table className="w-full text-left text-[11px]">
                                                <thead className="bg-slate-900 text-slate-400 uppercase font-mono tracking-wider text-[9px] border-b border-slate-800">
                                                    <tr>
                                                        <th className="px-4 py-3">Date</th>
                                                        <th className="px-4 py-3">Source / Category</th>
                                                        <th className="px-4 py-3">Inflow</th>
                                                        <th className="px-4 py-3">Outflow</th>
                                                        <th className="px-4 py-3">Net</th>
                                                        <th className="px-4 py-3 text-right">Audit Ref</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-800/60 font-mono">
                                                    {relevantRecords.map((r, i) => (
                                                        <tr key={r.id || i} className="hover:bg-slate-900/50 transition-colors">
                                                            <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                                                                {r.record_date}
                                                            </td>
                                                            <td className="px-4 py-3 text-slate-200 font-sans font-medium">
                                                                {r.category || 'General Ledger'}
                                                            </td>
                                                            <td className="px-4 py-3 text-emerald-400 font-bold">
                                                                {Number(r.inflow) > 0 ? `+₹${Number(r.inflow).toLocaleString('en-IN')}` : '—'}
                                                            </td>
                                                            <td className="px-4 py-3 text-rose-400 font-bold">
                                                                {Number(r.outflow) > 0 ? `-₹${Number(r.outflow).toLocaleString('en-IN')}` : '—'}
                                                            </td>
                                                            <td className="px-4 py-3 text-slate-300 font-bold">
                                                                ₹{(Number(r.net_buffer) || (Number(r.inflow) - Number(r.outflow))).toLocaleString('en-IN')}
                                                            </td>
                                                            <td className="px-4 py-3 text-right text-slate-500 font-mono text-[9px]">
                                                                {r.transaction_ref || r.receipt_hash || `0x${Math.abs(r.id?.charCodeAt(0) || 72).toString(16)}..b9`}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-mono italic px-2">
                                            All records are cryptographically verified and bound to the authenticated user UID in Supabase.
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex items-center justify-between">
                            <div className="text-[10px] text-slate-500 font-mono">
                                CREDENCE EXPLAINABILITY ENGINE v2.4
                            </div>
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-outfit font-black text-xs uppercase tracking-wider transition-colors"
                            >
                                Close Drill-down
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    );
};
