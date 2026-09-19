import React from 'react';
import { motion } from 'framer-motion';
import { 
    ShieldCheck, 
    Sparkles, 
    TrendingUp, 
    CheckCircle2, 
    Clock, 
    Activity, 
    Database,
    ChevronRight, 
    AlertCircle, 
    Layers,
    UploadCloud
} from 'lucide-react';
import type { CredenceScoreResult } from '@/lib/credenceEngine';

interface CredenceScoreHeroProps {
    scoreResult: CredenceScoreResult;
    onOpenWhyThisScore: () => void;
    onSelectDimension: (key: string) => void;
    onIngestData?: () => void;
}

export const CredenceScoreHero: React.FC<CredenceScoreHeroProps> = ({
    scoreResult,
    onOpenWhyThisScore,
    onSelectDimension,
    onIngestData
}) => {
    // Handling Insufficient Evidence / Empty State honestly
    if (!scoreResult.hasData || scoreResult.score === 0) {
        return (
            <div className="relative p-8 sm:p-12 rounded-[2.5rem] bg-[#0A0F1D] border border-slate-800 text-slate-100 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-2xl mx-auto text-center space-y-6">
                    <div className="w-20 h-20 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
                        <AlertCircle className="w-10 h-10" />
                    </div>

                    <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                            CREDENCE SCORE
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-outfit font-black uppercase tracking-tight text-white mt-3">
                            SCORE UNAVAILABLE
                        </h2>
                        <p className="text-sm font-bold uppercase tracking-wider text-amber-400">
                            Insufficient Evidence
                        </p>
                    </div>

                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                        Connect or provide additional authorized financial evidence to generate a meaningful CREDENCE Score. We never generate fabricated scores without verified empirical transactions.
                    </p>

                    <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                        <button
                            onClick={onIngestData}
                            className="px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-outfit font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                        >
                            <UploadCloud className="w-4 h-4" />
                            <span>ADD FINANCIAL EVIDENCE →</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Mathematical radial gauge calculations for 300 to 900 scale
    const minScore = 300;
    const maxScore = 900;
    const currentScore = Math.max(minScore, Math.min(maxScore, scoreResult.score));
    const scorePercentage = (currentScore - minScore) / (maxScore - minScore); // 0 to 1

    // Arc geometry
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    // We display a 260 degree arc
    const arcDegrees = 260;
    const strokeDasharray = `${circumference * (arcDegrees / 360)} ${circumference}`;
    const strokeDashoffset = circumference * (arcDegrees / 360) * (1 - scorePercentage);

    const getComponentIcon = (key: string) => {
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
        <div className="space-y-8">
            {/* HERO SCORE CARD */}
            <div className="relative p-6 sm:p-10 rounded-[2.5rem] bg-gradient-to-b from-[#0C1222] to-[#080D1A] border border-slate-800 text-slate-100 shadow-2xl overflow-hidden group">
                {/* Ambient Cinematic Background Elements */}
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mt-20" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Left Column: Radial Gauge Score Visualization */}
                    <div className="lg:col-span-6 flex flex-col items-center justify-center p-4">
                        <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
                            {/* SVG Radial Gauge */}
                            <svg className="w-full h-full" style={{ transform: 'rotate(140deg)' }} viewBox="0 0 300 300">
                                {/* Track circle */}
                                <circle
                                    cx="150"
                                    cy="150"
                                    r={radius}
                                    fill="transparent"
                                    stroke="rgba(30, 41, 59, 0.7)"
                                    strokeWidth="16"
                                    strokeDasharray={strokeDasharray}
                                    strokeLinecap="round"
                                />
                                {/* Progress Arc */}
                                <motion.circle
                                    cx="150"
                                    cy="150"
                                    r={radius}
                                    fill="transparent"
                                    stroke="url(#scoreGradient)"
                                    strokeWidth="16"
                                    strokeDasharray={strokeDasharray}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                    initial={{ strokeDashoffset: circumference * (arcDegrees / 360) }}
                                    animate={{ strokeDashoffset }}
                                    transition={{ duration: 1.5, ease: 'easeOut' }}
                                />
                                <defs>
                                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#6366f1" />
                                        <stop offset="50%" stopColor="#818cf8" />
                                        <stop offset="100%" stopColor="#10b981" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            {/* Center Score Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-2 pointer-events-none">
                                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">
                                    CREDENCE SCORE
                                </span>
                                
                                <div className="flex items-baseline justify-center gap-1.5 mt-1">
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.8 }}
                                        className="text-6xl sm:text-7xl font-outfit font-black text-white tracking-tighter"
                                    >
                                        {scoreResult.score}
                                    </motion.span>
                                    <span className="text-xl font-outfit font-black text-slate-400">
                                        / 900
                                    </span>
                                </div>

                                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span>{scoreResult.classification} FINANCIAL CREDIBILITY</span>
                                </div>
                            </div>
                        </div>

                        {/* Dial Subtext */}
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest text-center mt-2">
                            Scale: 300–900 • Deterministic Behavioural Scoring
                        </p>
                    </div>

                    {/* Right Column: Score Metadata & "Why This Score" Trigger */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                                    Evidence Strength: {scoreResult.evidenceStrength}
                                </span>
                                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-800 text-slate-300 border border-slate-700">
                                    Confidence: {scoreResult.confidence}
                                </span>
                            </div>

                            <h3 className="text-2xl sm:text-3xl font-outfit font-black text-white uppercase tracking-tight">
                                {scoreResult.classification} FINANCIAL CREDIBILITY
                            </h3>

                            <p className="text-sm text-slate-300 leading-relaxed font-medium">
                                {scoreResult.evidenceStrengthReason}
                            </p>
                        </div>

                        {/* Metadata Pills */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                                <span className="block text-[9px] font-black uppercase tracking-widest text-slate-400">
                                    Evidence Coverage
                                </span>
                                <span className="text-sm font-outfit font-black text-white mt-1 block">
                                    {scoreResult.observationPeriodText}
                                </span>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                                <span className="block text-[9px] font-black uppercase tracking-widest text-slate-400">
                                    Audited Sources
                                </span>
                                <span className="text-sm font-outfit font-black text-white mt-1 block">
                                    {scoreResult.sourcesCount} Verified Feeds
                                </span>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 col-span-2 sm:col-span-1">
                                <span className="block text-[9px] font-black uppercase tracking-widest text-slate-400">
                                    Last Calculated
                                </span>
                                <span className="text-sm font-outfit font-black text-emerald-400 mt-1 block">
                                    Today
                                </span>
                            </div>
                        </div>

                        {/* Hero CTAs */}
                        <div className="pt-2 flex flex-wrap items-center gap-4">
                            <button
                                onClick={onOpenWhyThisScore}
                                className="px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-outfit font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
                            >
                                <Sparkles className="w-4 h-4 text-indigo-200" />
                                <span>WHY THIS SCORE? →</span>
                            </button>

                            <button
                                onClick={() => onSelectDimension('cashFlowStability')}
                                className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 font-outfit font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2"
                            >
                                <Layers className="w-4 h-4 text-indigo-400" />
                                <span>Inspect Dimensions</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* SCORE BREAKDOWN: 5 CLICKABLE COMPONENT CARDS */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div>
                        <h3 className="text-lg font-outfit font-black uppercase tracking-tight text-white flex items-center gap-2.5">
                            <Layers className="w-5 h-5 text-indigo-400" />
                            SCORE BREAKDOWN (5 CORE DIMENSIONS)
                        </h3>
                        <p className="text-xs text-slate-400 font-medium">
                            Normalized 0–100 behavioural metrics. Click any card to view exact supporting records and proof.
                        </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                        Total Weight: 100%
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {scoreResult.contributors.map((c) => (
                        <div
                            key={c.key}
                            onClick={() => onSelectDimension(c.key)}
                            className="p-5 rounded-2xl bg-[#090E1B] hover:bg-slate-900/90 border border-slate-800 hover:border-indigo-500/60 cursor-pointer transition-all hover:-translate-y-1 shadow-sm hover:shadow-xl space-y-4 group flex flex-col justify-between"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/50">
                                        {getComponentIcon(c.key)}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                                        {(c.weight * 100).toFixed(0)}% WT
                                    </span>
                                </div>

                                <div>
                                    <span className="text-3xl font-outfit font-black text-white group-hover:text-indigo-400 transition-colors">
                                        {c.score}
                                    </span>
                                    <span className="text-xs font-bold text-slate-400 ml-1">/ 100</span>
                                </div>

                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 group-hover:text-white">
                                        {c.factor}
                                    </h4>
                                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                                        {c.whatItMeasures}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                                <span className="font-bold text-emerald-400">
                                    {c.strength}
                                </span>
                                <span className="font-bold text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                                    WHY? <ChevronRight className="w-3 h-3" />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
