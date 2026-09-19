import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    ChevronRight,
    ChevronLeft,
    Sparkles,
    ShieldAlert,
    Activity,
    TrendingUp,
    Network,
    History,
    Compass,
    CheckCircle2,
    RotateCcw,
    HelpCircle
} from 'lucide-react';

interface RevealEvidenceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DEMO_STAGES = [
    {
        stage: 1,
        stepTitle: "STAGE 01 / 08",
        name: "Credit Visibility",
        status: "LIMITED / THIN-FILE",
        badgeColor: "rose",
        icon: <ShieldAlert className="w-6 h-6 text-rose-400" />,
        headline: "The Invisible Applicant",
        description: "Sai Charan runs an active APMC Mandi vegetable stall, turning over ₹1.84 Lakhs monthly with 58+ daily digital transactions. Yet traditional credit scoring models report a blank file.",
        dataPoints: [
            { label: "Traditional Bureau Score", value: "Score: -1 (No History)", alert: true },
            { label: "Formal Bureau Records", value: "0 Cards / 0 Term Loans", alert: true },
            { label: "Algorithmic Underwriting", value: "Automated Rejection (Thin File)", alert: true }
        ],
        insight: "Over 80% of micro-enterprises and informal workers operate outside formal bureau registries, rendering their actual financial capacity completely invisible."
    },
    {
        stage: 2,
        stepTitle: "STAGE 02 / 08",
        name: "Financial Signal Fusion",
        status: "SOURCE → SIGNAL → BEHAVIOUR",
        badgeColor: "amber",
        icon: <Activity className="w-6 h-6 text-amber-400" />,
        headline: "Fragmented Activity Assembled",
        description: "CREDENCE connects directly to Sai Charan's primary transaction channels: Daily Retail UPI QR collections, APMC Mandi wholesale auction vouchers, and cold transit receipts.",
        dataPoints: [
            { label: "Daily UPI Transactions", value: "1,840+ digital QR events", alert: false },
            { label: "Wholesale Mandi Vouchers", value: "30 verified auction slips", alert: false },
            { label: "Gross Monthly Turnover", value: "₹1,84,300 (Avg ₹6,143/day)", alert: false }
        ],
        insight: "Instead of searching for past debt history, CREDENCE listens to real-time commercial activity across fragmented operational channels."
    },
    {
        stage: 3,
        stepTitle: "STAGE 03 / 08",
        name: "Behavioural Patterns",
        status: "SIGNAL → OBSERVATION → UNDERSTANDING",
        badgeColor: "sky",
        icon: <TrendingUp className="w-6 h-6 text-sky-400" />,
        headline: "Operating Resilience Extracted",
        description: "Evaluating volatility, supplier punctuality, and operating resilience across 30 consecutive business trading sessions.",
        dataPoints: [
            { label: "Cash Flow Stability", value: "86% (Low Variance / 0 Collapses)", alert: false },
            { label: "Payment Consistency", value: "94% (Zero Overdue Events)", alert: false },
            { label: "Operating Buffer Margin", value: "37% Median Gross Margin", alert: false }
        ],
        insight: "Sai Charan absorbs wholesale price shocks in perishable commodities by dynamically managing retail spreads without relying on expensive informal debt."
    },
    {
        stage: 4,
        stepTitle: "STAGE 04 / 08",
        name: "Understanding Graph Builds",
        status: "INTERACTIVE RELATIONSHIP MAP",
        badgeColor: "indigo",
        icon: <Network className="w-6 h-6 text-indigo-400" />,
        headline: "Visual Relationship Tree Constructed",
        description: "Raw receipts are organized into a hierarchical context graph: User → Financial Sources → Records → Signals → Behavioural Patterns → Financial Identity.",
        dataPoints: [
            { label: "Context Lineage", value: "100% Traceable Nodes", alert: false },
            { label: "Source Diversity", value: "3 Distinct Channels (QR/Mandi/Transit)", alert: false },
            { label: "Cryptographic Audit", value: "Merkle Root Verified", alert: false }
        ],
        insight: "'Every insight is grounded in relevant real-world activity.' Underwriters can click any behavioral claim and inspect the raw transactional context beneath it."
    },
    {
        stage: 5,
        stepTitle: "STAGE 05 / 08",
        name: "Financial Continuity Index Analyzed",
        status: "LONGITUDINAL CONTINUITY",
        badgeColor: "purple",
        icon: <History className="w-6 h-6 text-purple-400" />,
        headline: "Evaluating Continuity Across Time",
        description: "CREDENCE measures whether financial activity demonstrates continuity across the observation period. Identifies recurring patterns and neutral continuity breaks without artificial assumptions.",
        dataPoints: [
            { label: "Financial Continuity", value: "78% (ESTABLISHED)", alert: false },
            { label: "Observation Period", value: "14 Months (12 / 14 Coverage)", alert: false },
            { label: "Continuity Pattern", value: "STABLE (Recurring Inflows Detected)", alert: false }
        ],
        insight: "'Understand behaviour across time.' Traditional credit visibility looks for formal bureau lines. CREDENCE measures ongoing, persistent commercial viability directly from authentic operational records."
    },
    {
        stage: 6,
        stepTitle: "STAGE 06 / 08",
        name: "Understanding Gaps Identified",
        status: "COMPLETENESS INTELLIGENCE",
        badgeColor: "amber",
        icon: <Compass className="w-6 h-6 text-amber-400" />,
        headline: "Identifying What Is Missing",
        description: "CREDENCE identifies missing records without punishing the applicant. Constructive recommendations show how to unlock additional credit capacity.",
        dataPoints: [
            { label: "Observation Window Depth", value: "30 Days Active (60 Days Recommended)", alert: false },
            { label: "Utility / Stall Dues", value: "Municipal Dues Connection Optional", alert: false },
            { label: "Profile Completeness", value: "88% Verified Profile", alert: false }
        ],
        insight: "Neutral guidance: 'Additional relevant context and records may deepen the understanding of the financial profile.' This turns scoring into an inclusion system."
    },
    {
        stage: 7,
        stepTitle: "STAGE 07 / 08",
        name: "Financial Identity Generated",
        status: "EXPLAINABLE FINANCIAL IDENTITY",
        badgeColor: "emerald",
        icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
        headline: "Prime Alternative (A) Synthesized",
        description: "Sai Charan is transformed from 'Credit Invisible' to a verified, low-risk commercial borrower with empirical repayment capacity.",
        dataPoints: [
            { label: "CREDENCE Score", value: "742 / 900 (STRONG - Prime Alternative)", alert: false },
            { label: "Debt Service Coverage (DSCR)", value: "2.41x Operating Coverage", alert: false },
            { label: "Recommended Credit Facility", value: "₹50,000 Micro Working Capital Line", alert: false }
        ],
        insight: "Financial credibility already existed in Sai Charan's daily behaviour. CREDENCE simply made the merchant's true commercial understanding visible and clear to lenders."
    },
    {
        stage: 8,
        stepTitle: "STAGE 08 / 08",
        name: "Why This Result?",
        status: "AUDITED DECOMPOSITION",
        badgeColor: "indigo",
        icon: <HelpCircle className="w-6 h-6 text-indigo-400" />,
        headline: "Full Source Context & Verification",
        description: "Every dimension decomposes into exact empirical behaviour: 29 of 30 positive buffer sessions, ₹1,800/day median surplus, and zero circular transactions.",
        dataPoints: [
            { label: "Source Vouchers", value: "30 Audited Day Batches (SHA-256 Hashed)", alert: false },
            { label: "Daily Sweep Capacity", value: "₹650/day Safe Servicing", alert: false },
            { label: "Underwriting Verdict", value: "Sanction-Ready with Institutional Proof", alert: false }
        ],
        insight: "Institutional lenders approve credit with confidence because they are not trusting a black-box AI number—they are understanding the borrower's authentic business reality."
    }
];

export const RevealEvidenceModal: React.FC<RevealEvidenceModalProps> = ({
    isOpen,
    onClose
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);

    const handleClose = () => {
        setCurrentStep(0);
        setIsAutoPlaying(false);
        onClose();
    };

    useEffect(() => {
        if (!isAutoPlaying || !isOpen) return;
        const timer = setTimeout(() => {
            if (currentStep < DEMO_STAGES.length - 1) {
                setCurrentStep(prev => prev + 1);
            } else {
                setIsAutoPlaying(false);
            }
        }, 4500);
        return () => clearTimeout(timer);
    }, [isAutoPlaying, currentStep, isOpen]);

    if (!isOpen) return null;

    const currentStage = DEMO_STAGES[currentStep];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0 bg-black/85 backdrop-blur-2xl"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 20 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full max-w-4xl bg-[#0b0f19] border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
                >
                    {/* Header Bar */}
                    <div className="px-8 py-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/50 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-outfit font-black uppercase tracking-wider text-white">The CREDENCE Financial Understanding Walkthrough</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                    Signature 8-Stage Demonstration • Translating Activity into Matured Financial Understanding
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-outfit font-black uppercase tracking-wider border transition-all ${isAutoPlaying
                                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20 animate-pulse'
                                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                                    }`}
                            >
                                {isAutoPlaying ? 'Auto-Playing (35s)' : 'Play 30s Demo'}
                            </button>
                            <button
                                onClick={handleClose}
                                className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Stage Progress Indicator */}
                    <div className="grid grid-cols-8 gap-1.5 px-8 pt-5 bg-[#0b0f19]">
                        {DEMO_STAGES.map((s, idx) => (
                            <button
                                key={s.stage}
                                onClick={() => { setCurrentStep(idx); setIsAutoPlaying(false); }}
                                className="text-left group cursor-pointer"
                                title={s.name}
                            >
                                <div className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentStep
                                    ? 'bg-indigo-500 shadow-sm shadow-indigo-500/50'
                                    : idx < currentStep
                                        ? 'bg-emerald-500/80'
                                        : 'bg-slate-800'
                                    }`} />
                                <div className="mt-1.5 text-[9px] font-outfit font-bold uppercase tracking-wider text-slate-400 truncate group-hover:text-white transition-colors">
                                    0{idx + 1}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Stage Body */}
                    <div className="p-8 flex-1 overflow-y-auto space-y-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStage.stage}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.35, ease: "easeOut" }}
                                className="space-y-6"
                            >
                                {/* Stage Header & Badge */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
                                            {currentStage.icon}
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">{currentStage.stepTitle}</span>
                                            <h2 className="text-2xl font-outfit font-black text-white tracking-tight uppercase">{currentStage.headline}</h2>
                                        </div>
                                    </div>

                                    <div className={`self-start sm:self-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${currentStage.badgeColor === 'rose'
                                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                                        : currentStage.badgeColor === 'amber'
                                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                            : currentStage.badgeColor === 'sky'
                                                ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                                                : currentStage.badgeColor === 'purple'
                                                    ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                                                    : currentStage.badgeColor === 'indigo'
                                                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                                                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                        }`}>
                                        {currentStage.status}
                                    </div>
                                </div>

                                <p className="text-sm md:text-base text-slate-300 leading-relaxed font-medium">
                                    {currentStage.description}
                                </p>

                                {/* Structured Data Points */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {currentStage.dataPoints.map((dp, idx) => (
                                        <div
                                            key={idx}
                                            className={`p-5 rounded-2xl border ${dp.alert
                                                ? 'bg-rose-950/20 border-rose-800/40 text-rose-300'
                                                : 'bg-slate-900/60 border-slate-800 text-slate-200'
                                                }`}
                                        >
                                            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">{dp.label}</div>
                                            <div className="text-base font-outfit font-black tracking-tight">{dp.value}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Deep Insight Note */}
                                <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 flex items-start gap-3">
                                    <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <p className="text-xs text-indigo-200 leading-relaxed font-medium">
                                        <strong className="font-bold text-white uppercase tracking-wider mr-1">CREDENCE Principle:</strong>
                                        {currentStage.insight}
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer Controls */}
                    <div className="px-8 py-5 border-t border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex items-center justify-between">
                        <button
                            onClick={() => { setCurrentStep(0); setIsAutoPlaying(false); }}
                            className="text-xs font-outfit font-black uppercase tracking-wider text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restart Demo</span>
                        </button>

                        <div className="flex items-center gap-3">
                            <button
                                disabled={currentStep === 0}
                                onClick={() => { setCurrentStep(prev => prev - 1); setIsAutoPlaying(false); }}
                                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-outfit font-black uppercase tracking-wider text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span>Previous</span>
                            </button>

                            {currentStep < DEMO_STAGES.length - 1 ? (
                                <button
                                    onClick={() => { setCurrentStep(prev => prev + 1); setIsAutoPlaying(false); }}
                                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-outfit font-black uppercase tracking-wider text-white flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
                                >
                                    <span>Next Stage ({currentStep + 2}/8)</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleClose}
                                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-outfit font-black uppercase tracking-wider text-black flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
                                >
                                    <span>Explore Full Evidence</span>
                                    <CheckCircle2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
