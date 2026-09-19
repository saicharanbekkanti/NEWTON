import React from 'react';
import {
    ShieldCheck,
    HelpCircle,
    Activity,
    CheckCircle2,
    Clock,
    TrendingUp,
    Layers,
    ArrowRight,
    UploadCloud,
    RefreshCw,
    Network,
    AlertCircle
} from 'lucide-react';
import type { StructuredFinancialIdentityProfile, ProfileDimension } from '@/lib/credenceEngine';

interface CreditProfilesViewProps {
    profile: StructuredFinancialIdentityProfile;
    onNavigateTab: (tab: string) => void;
    onOpenDimensionDrawer: (dimension: ProfileDimension) => void;
    onOpenProfileDrawer: () => void;
    isDemoMode: boolean;
    onLoadDemo: () => void;
}

export const CreditProfilesView: React.FC<CreditProfilesViewProps> = ({
    profile,
    onNavigateTab,
    onOpenDimensionDrawer,
    onOpenProfileDrawer,
    isDemoMode,
    onLoadDemo
}) => {
    const { dimensions, gaps, timeline } = profile;

    const getStrengthBadge = (strength: string) => {
        switch (strength) {
            case 'STRONG':
                return (
                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                        MATURED PROFILE
                    </span>
                );
            case 'MODERATE':
                return (
                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-mono">
                        DEVELOPING CONTEXT
                    </span>
                );
            case 'LIMITED':
                return (
                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
                        EARLY CONTEXT
                    </span>
                );
            default:
                return (
                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-rose-500/10 text-rose-400 border border-rose-500/30 font-mono">
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
        <div className="space-y-12">
            {/* 1. PAGE HEADER */}
            <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 font-outfit">
                                FINANCIAL IDENTITY & UNDERSTANDING
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                                • {isDemoMode ? 'APMC BENCHMARK PROFILE' : 'LIVE RELEVANT SIGNALS'}
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-outfit font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            CREDIT PROFILES
                        </h1>
                        <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300">
                            Your financial identity, built with deep, relevant understanding of your real-world business.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => onNavigateTab('upload')}
                            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-outfit font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
                        >
                            <UploadCloud className="w-4 h-4" />
                            <span>Connect Financial Records</span>
                        </button>
                    </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal pt-2 border-t border-slate-100 dark:border-slate-800">
                    CREDENCE translates real-world operational activity into mature, relevant financial understanding. Every profile attribute is grounded in authentic business context.
                </p>
            </div>

            {/* 2. IMPORTANT PRINCIPLE NOTICE */}
            <div className="p-5 sm:p-6 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 flex items-start gap-4">
                <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                    <h4 className="font-outfit font-black text-sm uppercase tracking-tight text-indigo-950 dark:text-indigo-200">
                        CREDENCE does not replace a lender's credit decision.
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        CREDENCE translates available financial records into an explainable, matured financial identity. It does not guarantee lending eligibility or make lending decisions.
                    </p>
                </div>
            </div>

            {/* 3. PROFILE OVERVIEW CARD */}
            {!profile.hasData ? (
                /* EMPTY / LOW-DATA STATE */
                <div className="p-10 sm:p-14 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-6 shadow-sm">
                    <div className="w-20 h-20 rounded-[2rem] bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                        <AlertCircle className="w-10 h-10" />
                    </div>
                    <div className="space-y-2 max-w-xl mx-auto">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                            FINANCIAL IDENTITY
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-outfit font-black uppercase tracking-tight text-slate-900 dark:text-white">
                            BUILDING FINANCIAL UNDERSTANDING
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            Connect or provide financial records to begin establishing your financial identity. CREDENCE derives behavioural indicators strictly from verified transactional activity and commercial context.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto text-left pt-2">
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Understanding Depth</span>
                            <span className="text-xl font-outfit font-black text-slate-900 dark:text-white mt-1 block">0%</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Observation Period</span>
                            <span className="text-xs font-mono font-bold text-slate-400 mt-2 block">Not established</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Profile Dimensions</span>
                            <span className="text-xs font-mono font-bold text-amber-500 mt-2 block">Awaiting context</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                        <button
                            onClick={() => onNavigateTab('upload')}
                            className="px-8 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-outfit font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
                        >
                            <UploadCloud className="w-4 h-4" />
                            <span>Upload Financial Records (.csv)</span>
                        </button>
                        <button
                            onClick={onLoadDemo}
                            className="px-8 py-3.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-outfit font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4 text-indigo-500" />
                            <span>Load Benchmark Profile (APMC Merchant)</span>
                        </button>
                    </div>
                </div>
            ) : (
                /* ESTABLISHED / DEVELOPING PROFILE OVERVIEW */
                <div
                    onClick={onOpenProfileDrawer}
                    className="p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-500/50 transition-all cursor-pointer group relative overflow-hidden space-y-6"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                        <div>
                            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-400 block mb-1">
                                FINANCIAL IDENTITY
                            </span>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl sm:text-3xl font-outfit font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                    Profile Status:
                                </h2>
                                <span className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-widest border font-mono ${
                                    profile.status === 'ESTABLISHED' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' :
                                    profile.status === 'DEVELOPING' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' :
                                    'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                                }`}>
                                    {profile.status}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-outfit font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                            <span>Open Detailed Profile View</span>
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                        {profile.statusExplanation}
                    </p>

                    {/* Overview Stat Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-2">
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Observation Period</span>
                            <span className="text-xl font-outfit font-black text-slate-900 dark:text-white mt-1 block">
                                {profile.observationPeriod}
                            </span>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Understanding Depth</span>
                            <span className="text-xl font-outfit font-black text-slate-900 dark:text-white mt-1 block">
                                {profile.evidenceCoverage}%
                            </span>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Connected Sources</span>
                            <span className="text-xl font-outfit font-black text-slate-900 dark:text-white mt-1 block">
                                {profile.connectedSourcesCount}
                            </span>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Records Analysed</span>
                            <span className="text-xl font-outfit font-black text-slate-900 dark:text-white mt-1 block">
                                {profile.recordsAnalysed.toLocaleString('en-IN')}
                            </span>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Profile Maturity</span>
                            <span className="text-xl font-outfit font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                                {profile.overallEvidenceStrength === 'STRONG' ? 'MATURED' : profile.overallEvidenceStrength === 'MODERATE' ? 'DEVELOPING' : profile.overallEvidenceStrength === 'LIMITED' ? 'EARLY' : 'BUILDING'}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. EVIDENCE TRACEABILITY PIPELINE */}
            <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 font-outfit">
                                UNDERSTANDING PIPELINE
                            </span>
                            <h3 className="font-outfit font-black text-lg sm:text-xl uppercase tracking-tight text-slate-900 dark:text-white">
                                Context & Signals Provenance
                            </h3>
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">
                            Raw Operational Data → Relevant Signals → Behavioural Context → Matured Understanding → Financial Identity
                        </p>
                    </div>

                    <button
                        onClick={() => onNavigateTab('dashboard')}
                        className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-outfit font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                    >
                        <Network className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Inspect Understanding & Signal Graph</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Pipeline Flow Diagram */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
                    {[
                        {
                            step: "01",
                            tier: "SOURCE",
                            title: "Connected Feeds",
                            desc: `${profile.connectedSourcesCount} Authorized Sources (UPI, APMC Mandi, Ledger)`,
                            status: "Verified Ingestion"
                        },
                        {
                            step: "02",
                            tier: "FINANCIAL RECORD",
                            title: "Raw Records",
                            desc: `${profile.recordsAnalysed} Timestamped Transactions & Voucher Rows`,
                            status: "Cryptographic Hashes"
                        },
                        {
                            step: "03",
                            tier: "BEHAVIOURAL SIGNAL",
                            title: "Extracted Signals",
                            desc: "Inflow Cadence, Outflow Punctuality, Reserve Margins",
                            status: "Mathematical Extraction"
                        },
                        {
                            step: "04",
                            tier: "PROFILE ATTRIBUTE",
                            title: "Behavioural Dimensions",
                            desc: "Stability, Consistency, Continuity, Activity, Growth",
                            status: "Multi-dimensional Fusion"
                        },
                        {
                            step: "05",
                            tier: "FINANCIAL IDENTITY",
                            title: "Structured Profile",
                            desc: `${profile.status} Identity for Informed Underwriting`,
                            status: "Explainable Output"
                        }
                    ].map((step, idx) => (
                        <div
                            key={idx}
                            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between space-y-3"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-mono">
                                        {step.step} • {step.tier}
                                    </span>
                                </div>
                                <h4 className="font-outfit font-black text-xs text-slate-900 dark:text-white uppercase tracking-tight">
                                    {step.title}
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                                    {step.desc}
                                </p>
                            </div>
                            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                                {step.status}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 5. FINANCIAL IDENTITY DIMENSIONS */}
            <div className="space-y-6">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 font-outfit">
                            BEHAVIOURAL DIMENSIONS
                        </span>
                        <h3 className="text-xl sm:text-2xl font-outfit font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            Financial Identity Dimensions
                        </h3>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">
                        Not credit scores. Objective behavioural patterns extracted from authorized records.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* DIMENSION 1: CASH FLOW STABILITY */}
                    <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6 group">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                                    <Activity className="w-6 h-6" />
                                </div>
                                {getStrengthBadge(dimensions.cashFlowStability.evidenceStrength)}
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <h4 className="font-outfit font-black text-lg sm:text-xl uppercase tracking-tight text-slate-900 dark:text-white">
                                        Cash Flow Stability
                                    </h4>
                                    {getStatusBadge(dimensions.cashFlowStability.status, dimensions.cashFlowStability.statusColor)}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                                    {dimensions.cashFlowStability.explanation}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Observation Span</span>
                                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200 mt-0.5 block">{dimensions.cashFlowStability.observationPeriod}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Volatility Index</span>
                                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200 mt-0.5 block">
                                        {dimensions.cashFlowStability.details?.volatility || 'Consistent'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => onOpenDimensionDrawer(dimensions.cashFlowStability)}
                            className="w-full pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-outfit font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 group-hover:translate-x-0.5 transition-transform"
                        >
                            <span className="flex items-center gap-1.5">
                                <HelpCircle className="w-3.5 h-3.5" />
                                Why this result?
                            </span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* DIMENSION 2: PAYMENT CONSISTENCY */}
                    <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6 group">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                {getStrengthBadge(dimensions.paymentConsistency.evidenceStrength)}
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <h4 className="font-outfit font-black text-lg sm:text-xl uppercase tracking-tight text-slate-900 dark:text-white">
                                        Payment Consistency
                                    </h4>
                                    {getStatusBadge(dimensions.paymentConsistency.status, dimensions.paymentConsistency.statusColor)}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                                    {dimensions.paymentConsistency.explanation}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Verified Outflows</span>
                                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200 mt-0.5 block">
                                        {dimensions.paymentConsistency.details?.paymentRecordsCount || 0} Records
                                    </span>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Dispute Flags</span>
                                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                                        0 Recorded
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => onOpenDimensionDrawer(dimensions.paymentConsistency)}
                            className="w-full pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-outfit font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 group-hover:translate-x-0.5 transition-transform"
                        >
                            <span className="flex items-center gap-1.5">
                                <HelpCircle className="w-3.5 h-3.5" />
                                Why this result?
                            </span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* DIMENSION 3: FINANCIAL CONTINUITY */}
                    <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6 group">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400">
                                    <Clock className="w-6 h-6" />
                                </div>
                                {getStrengthBadge(dimensions.financialContinuity.evidenceStrength)}
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <h4 className="font-outfit font-black text-lg sm:text-xl uppercase tracking-tight text-slate-900 dark:text-white">
                                        Financial Continuity
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-outfit font-black text-indigo-600 dark:text-indigo-400">
                                            {dimensions.financialContinuity.metricValue}
                                        </span>
                                        {getStatusBadge(dimensions.financialContinuity.status, dimensions.financialContinuity.statusColor)}
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 mt-3 space-y-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono block">
                                        WHAT THIS MEANS
                                    </span>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                        {dimensions.financialContinuity.explanation}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Activity Coverage</span>
                                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200 mt-0.5 block">
                                        {dimensions.financialContinuity.details?.coveredMonths || 0} / {dimensions.financialContinuity.details?.observationPeriodMonths || 0} Months
                                    </span>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Continuity Breaks</span>
                                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200 mt-0.5 block">
                                        {dimensions.financialContinuity.details?.breaksCount || 0} Neutral Breaks
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => onOpenDimensionDrawer(dimensions.financialContinuity)}
                            className="w-full pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-outfit font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 group-hover:translate-x-0.5 transition-transform"
                        >
                            <span className="flex items-center gap-1.5">
                                <HelpCircle className="w-3.5 h-3.5" />
                                Why this result?
                            </span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* DIMENSION 4: FINANCIAL ACTIVITY */}
                    <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6 group">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
                                    <Layers className="w-6 h-6" />
                                </div>
                                {getStrengthBadge(dimensions.financialActivity.evidenceStrength)}
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <h4 className="font-outfit font-black text-lg sm:text-xl uppercase tracking-tight text-slate-900 dark:text-white">
                                        Financial Activity
                                    </h4>
                                    {getStatusBadge(dimensions.financialActivity.status, dimensions.financialActivity.statusColor)}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                                    {dimensions.financialActivity.explanation}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Active Operating Days</span>
                                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200 mt-0.5 block">
                                        {dimensions.financialActivity.details?.activeDays || 0} Distinct Dates
                                    </span>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Observed Inflow</span>
                                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200 mt-0.5 block">
                                        ₹{(dimensions.financialActivity.details?.totalInflow || 0).toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => onOpenDimensionDrawer(dimensions.financialActivity)}
                            className="w-full pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-outfit font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 group-hover:translate-x-0.5 transition-transform"
                        >
                            <span className="flex items-center gap-1.5">
                                <HelpCircle className="w-3.5 h-3.5" />
                                Why this result?
                            </span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* DIMENSION 5: GROWTH / CHANGE PATTERN */}
                    <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6 group lg:col-span-2">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                {getStrengthBadge(dimensions.growthChangePattern.evidenceStrength)}
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <h4 className="font-outfit font-black text-lg sm:text-xl uppercase tracking-tight text-slate-900 dark:text-white">
                                        Growth / Change Pattern (Self-Comparison)
                                    </h4>
                                    {getStatusBadge(dimensions.growthChangePattern.status, dimensions.growthChangePattern.statusColor)}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                                    {dimensions.growthChangePattern.explanation}
                                </p>
                            </div>

                            {/* CURRENT vs PREVIOUS vs CHANGE */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">CURRENT OBSERVED BEHAVIOUR</span>
                                    <span className="text-sm font-outfit font-black text-slate-900 dark:text-white mt-1 block">
                                        {dimensions.growthChangePattern.details?.current || 'Active Cadence'}
                                    </span>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">PREVIOUS BASELINE BEHAVIOUR</span>
                                    <span className="text-sm font-outfit font-black text-slate-900 dark:text-white mt-1 block">
                                        {dimensions.growthChangePattern.details?.previous || 'Comparable Volume'}
                                    </span>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">MEASURABLE CHANGE</span>
                                    <span className="text-sm font-outfit font-black text-indigo-600 dark:text-indigo-400 mt-1 block">
                                        {dimensions.growthChangePattern.details?.change || 'Stable (±5%)'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] text-slate-400 font-mono italic">
                                Longitudinal self-comparison strictly against the user's historical baseline. No peer comparisons or rankings.
                            </span>
                            <button
                                onClick={() => onOpenDimensionDrawer(dimensions.growthChangePattern)}
                                className="flex items-center gap-1.5 text-xs font-outfit font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 shrink-0"
                            >
                                <HelpCircle className="w-3.5 h-3.5" />
                                <span>Why this result?</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 6. WHAT IS STILL MISSING? (UNDERSTANDING & EXPANSION LEVERS) */}
            <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800 font-outfit">
                            COMPLETENESS & EXPANSION
                        </span>
                        <h3 className="text-xl sm:text-2xl font-outfit font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            UNDERSTANDING & EXPANSION LEVERS
                        </h3>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">
                        Expanding relevant operational records deepens understanding of the enterprise's true cash flow.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {gaps.map((gap, idx) => (
                        <div
                            key={idx}
                            className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <h4 className="font-outfit font-black text-sm uppercase tracking-tight text-slate-900 dark:text-white">
                                    {gap.title}
                                </h4>
                                <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                                    {gap.urgency} Priority
                                </span>
                            </div>

                            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                                <div>
                                    <span className="font-bold text-slate-400 uppercase text-[9px] font-mono block">WHAT IS MISSING:</span>
                                    <span>{gap.whatIsMissing}</span>
                                </div>
                                <div>
                                    <span className="font-bold text-slate-400 uppercase text-[9px] font-mono block">WHY IT MATTERS:</span>
                                    <span>{gap.whyItMatters}</span>
                                </div>
                                <div>
                                    <span className="font-bold text-slate-400 uppercase text-[9px] font-mono block">COMPLETION GUIDANCE:</span>
                                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">{gap.neutralExplanation}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 7. FINANCIAL IDENTITY TIMELINE */}
            <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 font-outfit">
                            CHRONOLOGICAL INTELLIGENCE
                        </span>
                        <h3 className="text-xl sm:text-2xl font-outfit font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            Financial Identity Timeline
                        </h3>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">
                        Meaningful changes detected across the applicant's observed history.
                    </p>
                </div>

                {timeline && timeline.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
                        {timeline.slice(0, 5).map((ev, i) => (
                            <div
                                key={ev.id || i}
                                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2"
                            >
                                <span className="text-[9px] font-mono font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                                    {ev.monthYear}
                                </span>
                                <h4 className="font-outfit font-black text-xs text-slate-900 dark:text-white uppercase tracking-tight">
                                    {ev.milestone}
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                                    {ev.detail}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-xs text-slate-400 font-mono">
                            Not enough historical evidence to construct a meaningful timeline.
                        </p>
                    </div>
                )}
            </div>

            {/* 8. FINAL PROFILE STATEMENT */}
            <div className="p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-indigo-900/50 shadow-xl space-y-6">
                <div className="space-y-2 max-w-3xl">
                    <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-indigo-400">
                        VERIFIABLE FINANCIAL IDENTITY
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-outfit font-black tracking-tight uppercase">
                        YOUR FINANCIAL IDENTITY IS MORE THAN A BUREAU SCORE.
                    </h2>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                        CREDENCE brings together relevant real-world activity, identifies mature commercial rhythms, and makes the financial understanding behind every credit decision visible and fair.
                    </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                    <button
                        onClick={() => onNavigateTab('dashboard')}
                        className="px-8 py-3.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-outfit font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg"
                    >
                        <Network className="w-4 h-4 text-indigo-600" />
                        <span>View Understanding Graph →</span>
                    </button>
                    <button
                        onClick={() => onNavigateTab('upload')}
                        className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white border border-slate-700 font-outfit font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2"
                    >
                        <UploadCloud className="w-4 h-4 text-indigo-400" />
                        <span>Manage Ingested Feeds</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
