import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    TrendingUp,
    UploadCloud,
    Zap,
    ShieldCheck,
    Database,
    Sparkles,
    HelpCircle,
    ArrowUpRight,
    History,
    RefreshCw,
    Activity,
    CheckCircle2,
    AlertCircle,
    Clock,
    Scale,
    Compass,
    LogOut,
    Network,
    Cpu,
    Layers,
    ArrowRight
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useTheme } from '../lib/ThemeContext';
import { Sidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';

import { MultiStepLoader } from '@/components/ui/loader';
import { 
    calculateFinancialIdentity, 
    DEMO_RECORDS, 
    generateEvidenceTrail, 
    detectEvidenceGaps, 
    detectSignalChanges, 
    calculateFinancialContinuity,
    generateSignalFusion,
    generateBehaviouralIntelligence,
    buildEvidenceGraph,
    generateTrustLayerItems,
    type EvidenceTrailItem, 
    type EvidenceGap, 
    type SignalChange, 
    type FinancialContinuityAnalysis,
    type ContinuityTimelineEvent,
    type ContinuityBreak,
    type SignalFusionItem,
    type BehaviouralIntelligenceItem,
    type EvidenceGraphData,
    type EvidenceGraphNode,
    type TrustLayerItem,
    buildStructuredFinancialIdentityProfile,
    type StructuredFinancialIdentityProfile,
    type ProfileDimension,
    calculateCredenceScore,
    type CredenceScoreResult
} from '@/lib/credenceEngine';
import { dbService, type StoredFinancialRecord, type StoredSource } from '@/lib/supabase';
import { RevealEvidenceModal } from '@/components/ui/RevealEvidenceModal';
import { EvidenceDrawer } from '@/components/ui/EvidenceDrawer';
import { DataSourcesManager } from '@/components/DataSourcesManager';
import { CreditProfilesView } from '@/components/credit-profile/CreditProfilesView';
import { WhyThisResultDrawer } from '@/components/credit-profile/WhyThisResultDrawer';
import { ProfileDetailDrawer } from '@/components/credit-profile/ProfileDetailDrawer';
import { CredenceScoreHero } from '@/components/credit-profile/CredenceScoreHero';
import { WhyThisScoreModal } from '@/components/credit-profile/WhyThisScoreModal';

/* --- Demo Constants --- */

const DEMO_SOURCES: StoredSource[] = [
    {
        id: "src_upi_demo",
        firebase_uid: "demo_uid",
        source_name: "Retail UPI QR Inflow",
        source_type: "UPI_QR",
        status: "VERIFIED",
        record_count: 22,
        evidence_contribution: 45,
        last_sync: "2026-03-15T10:00:00Z"
    },
    {
        id: "src_mandi_demo",
        firebase_uid: "demo_uid",
        source_name: "Mandi Wholesale Procurement",
        source_type: "APMC_MANDI",
        status: "VERIFIED",
        record_count: 6,
        evidence_contribution: 35,
        last_sync: "2026-03-15T08:30:00Z"
    },
    {
        id: "src_util_demo",
        firebase_uid: "demo_uid",
        source_name: "Transport & Crate Fee",
        source_type: "UTILITY",
        status: "VERIFIED",
        record_count: 2,
        evidence_contribution: 20,
        last_sync: "2026-03-14T19:00:00Z"
    }
];

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const handleLogout = async () => {
        try {
            navigate('/', { replace: true });
            await logout();
        } catch (err) {
            console.error('Logout error:', err);
            window.location.href = '/';
        }
    };

    // Navigation and layout
    const rawTab = searchParams.get('tab') || 'dashboard';
    const activeTab = rawTab === 'story' ? 'continuity' : rawTab;
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Demo Mode vs Live Records
    const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
    const [userRecords, setUserRecords] = useState<StoredFinancialRecord[]>([]);
    const [userSources, setUserSources] = useState<StoredSource[]>([]);

    // Modals
    const [isRevealModalOpen, setIsRevealModalOpen] = useState(false);
    const [isWhyThisScoreOpen, setIsWhyThisScoreOpen] = useState(false);
    const [selectedSignalForDrawer, setSelectedSignalForDrawer] = useState<EvidenceTrailItem | null>(null);
    const [selectedGraphNode, setSelectedGraphNode] = useState<EvidenceGraphNode | null>(null);
    const [selectedDimensionForDrawer, setSelectedDimensionForDrawer] = useState<ProfileDimension | null>(null);
    const [isProfileDetailOpen, setIsProfileDetailOpen] = useState(false);

    // Load User Data from Supabase / Local Storage
    const loadUserData = useCallback(async () => {
        const uid = user?.uid || 'guest';
        try {
            const [recs, srcs] = await Promise.all([
                dbService.getRecords(uid),
                dbService.getSources(uid)
            ]);
            setUserRecords(recs);
            setUserSources(srcs);
        } catch (err) {
            console.error("Error loading user records:", err);
        }
    }, [user]);

    useEffect(() => {
        let isMounted = true;
        const initFetch = async () => {
            const uid = user?.uid || 'guest';
            try {
                const [recs, srcs] = await Promise.all([
                    dbService.getRecords(uid),
                    dbService.getSources(uid)
                ]);
                if (isMounted) {
                    setUserRecords(recs);
                    setUserSources(srcs);
                }
            } catch (err) {
                console.error("Error loading user records:", err);
            }
        };
        initFetch();
        return () => {
            isMounted = false;
        };
    }, [user]);

    // Active records & computed financial identity
    const activeRecords = useMemo(() => {
        return isDemoMode ? DEMO_RECORDS : userRecords;
    }, [isDemoMode, userRecords]);

    const activeSources = useMemo(() => {
        return isDemoMode ? DEMO_SOURCES : userSources;
    }, [isDemoMode, userSources]);

    const financialIdentity = useMemo(() => {
        return calculateFinancialIdentity(activeRecords);
    }, [activeRecords]);

    const evidenceTrail = useMemo<EvidenceTrailItem[]>(() => {
        return generateEvidenceTrail(financialIdentity, activeRecords);
    }, [financialIdentity, activeRecords]);

    const signalFusionItems = useMemo<SignalFusionItem[]>(() => {
        return generateSignalFusion(activeRecords);
    }, [activeRecords]);

    const behaviouralIntelligence = useMemo<BehaviouralIntelligenceItem[]>(() => {
        return generateBehaviouralIntelligence(financialIdentity, activeRecords);
    }, [financialIdentity, activeRecords]);

    const evidenceGraph = useMemo<EvidenceGraphData>(() => {
        return buildEvidenceGraph(activeRecords, financialIdentity);
    }, [activeRecords, financialIdentity]);

    const trustLayerItems = useMemo<TrustLayerItem[]>(() => {
        return generateTrustLayerItems(activeRecords);
    }, [activeRecords]);

    const evidenceGaps = useMemo<EvidenceGap[]>(() => {
        return detectEvidenceGaps(financialIdentity, activeRecords);
    }, [financialIdentity, activeRecords]);

    const signalChanges = useMemo<SignalChange[]>(() => {
        return detectSignalChanges(activeRecords);
    }, [activeRecords]);

    const continuityAnalysis = useMemo<FinancialContinuityAnalysis>(() => {
        return calculateFinancialContinuity(activeRecords);
    }, [activeRecords]);

    const structuredProfile = useMemo<StructuredFinancialIdentityProfile>(() => {
        return buildStructuredFinancialIdentityProfile(activeRecords, activeSources);
    }, [activeRecords, activeSources]);

    const credenceScore = useMemo<CredenceScoreResult>(() => {
        return calculateCredenceScore(activeRecords, activeSources);
    }, [activeRecords, activeSources]);

    const handleSelectDimension = (key: string) => {
        if (key === 'cashFlowStability') {
            setSelectedDimensionForDrawer(structuredProfile.dimensions.cashFlowStability);
        } else if (key === 'paymentConsistency') {
            setSelectedDimensionForDrawer(structuredProfile.dimensions.paymentConsistency);
        } else if (key === 'financialContinuity') {
            setSelectedDimensionForDrawer(structuredProfile.dimensions.financialContinuity);
        } else if (key === 'financialActivity') {
            setSelectedDimensionForDrawer(structuredProfile.dimensions.financialActivity);
        } else {
            setSelectedDimensionForDrawer(structuredProfile.dimensions.growthChangePattern);
        }
    };

    const setActiveTab = (tab: string) => {
        if (tab === 'chat') {
            navigate('/chat');
        } else if (tab === 'insights') {
            navigate('/insights');
        } else {
            setSearchParams({ tab });
        }
    };

    // Chart Data
    const barChartData = useMemo(() => {
        if (activeRecords.length === 0) return [];
        const grouped: Record<string, { date: string; inflow: number; obligations: number }> = {};
        activeRecords.forEach((r: StoredFinancialRecord) => {
            const date = r.record_date;
            if (!grouped[date]) grouped[date] = { date, inflow: 0, obligations: 0 };
            grouped[date].inflow += r.inflow;
            grouped[date].obligations += r.outflow;
        });
        return Object.values(grouped).slice(-10);
    }, [activeRecords]);

    const lineChartData = useMemo(() => {
        if (activeRecords.length === 0) return [];
        let runningBuffer = 0;
        return activeRecords.slice(0, 15).map((r: StoredFinancialRecord, i: number) => {
            runningBuffer += r.net_buffer;
            return {
                name: `T-${i + 1}`,
                netBuffer: runningBuffer
            };
        });
    }, [activeRecords]);



    const getSignalIcon = (key: string) => {
        switch (key) {
            case 'cash_flow_stability': return <TrendingUp className="w-5 h-5" />;
            case 'payment_consistency': return <CheckCircle2 className="w-5 h-5" />;
            case 'financial_continuity': return <Clock className="w-5 h-5" />;
            case 'obligation_behaviour': return <Scale className="w-5 h-5" />;
            case 'activity_strength': return <Activity className="w-5 h-5" />;
            default: return <Sparkles className="w-5 h-5" />;
        }
    };

    const getSignalColor = (index: number) => {
        const colors = ['indigo', 'emerald', 'sky', 'amber', 'purple', 'rose'];
        return colors[index % colors.length];
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            <main className={cn(
                "flex-1 overflow-y-auto relative transition-all duration-300",
                isCollapsed ? "lg:ml-20" : "lg:ml-64"
            )}>
                {/* Secondary navigation for Mobile */}
                <div className="lg:hidden p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-2">
                        <span className="font-outfit font-black text-xl tracking-tighter text-slate-900 dark:text-white uppercase">
                            CRED<span className="text-indigo-600 dark:text-indigo-400">ENCE</span>
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1.5 transition-colors"
                        title="Sign Out"
                    >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                    </button>
                </div>

                <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-12 space-y-10">
                    {/* Header with Title & Context Controls */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800/80">
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl sm:text-4xl font-outfit font-black text-slate-900 dark:text-white tracking-tight uppercase flex items-center gap-3">
                                    <ShieldCheck className="w-9 h-9 text-indigo-600 dark:text-indigo-400" />
                                    {activeTab === 'score'
                                        ? 'CREDENCE SCORE'
                                        : activeTab === 'continuity'
                                        ? 'SCORE EVOLUTION'
                                        : activeTab === 'upload'
                                        ? 'DATA SOURCES & INGESTION'
                                        : activeTab === 'reports'
                                        ? 'FINANCIAL IDENTITY'
                                        : 'CREDENCE INTELLIGENCE'}
                                </h1>
                                
                                {/* Demo Data Mode Toggle Badge */}
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs font-mono shadow-sm">
                                    <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                                    <span className="font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                                        {isDemoMode ? 'DEMO DATA (Sai Charan - APMC)' : 'LIVE USER REPOSITORY'}
                                    </span>
                                    <button
                                        onClick={() => setIsDemoMode(!isDemoMode)}
                                        className="ml-2 text-[10px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 underline uppercase font-black tracking-widest"
                                    >
                                        {isDemoMode ? 'Switch to Live Data' : 'Switch to Demo Cohort'}
                                    </button>
                                </div>
                            </div>
                            <p className="text-slate-400 dark:text-slate-500 font-black mt-2 uppercase tracking-[0.2em] text-[10px] sm:text-xs">
                                {activeTab === 'score'
                                    ? 'DETERMINISTIC BEHAVIOURAL SCORING (300 - 900) • EMPIRICAL EVIDENCE & AUDIT TRAIL'
                                    : activeTab === 'continuity'
                                    ? 'LONGITUDINAL CONTINUITY INDEX • CALENDAR PERSISTENCE & BREAK EVALUATION'
                                    : activeTab === 'upload'
                                    ? 'AUTHORIZED FINANCIAL FEED INGESTION & DATA INTEGRITY ENGINE'
                                    : activeTab === 'reports'
                                    ? 'STRUCTURED FINANCIAL IDENTITY • MULTI-DIMENSIONAL CREDIT PROFILE'
                                    : 'ALTERNATIVE FINANCIAL UNDERSTANDING & CREDIT INTELLIGENCE LAYER'}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            {/* Fast Trigger: Explore Financial Understanding */}
                            {financialIdentity.hasData && (
                                <button
                                    onClick={() => setIsRevealModalOpen(true)}
                                    className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-outfit font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
                                >
                                    <Sparkles className="w-4 h-4 text-indigo-200" />
                                    <span>EXPLORE FINANCIAL UNDERSTANDING</span>
                                </button>
                            )}

                            <button
                                onClick={() => setActiveTab('upload')}
                                className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-outfit font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
                            >
                                <UploadCloud className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                <span>Ingest Data</span>
                            </button>

                            <button
                                onClick={handleLogout}
                                className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-800/40 font-outfit font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
                                title="Sign Out of Session"
                            >
                                <LogOut className="w-4 h-4 text-rose-500" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>

                    {errorMsg && (
                        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 px-6 py-4 rounded-2xl flex items-center justify-between">
                            <span className="font-bold text-sm uppercase tracking-widest">{errorMsg}</span>
                            <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-rose-600 font-bold uppercase text-xs">Dismiss</button>
                        </div>
                    )}

                    {/* Loader */}
                    {isLoading && (
                        <div className="p-20 text-center flex flex-col items-center justify-center">
                            <MultiStepLoader loadingStates={[{ text: "Synthesizing Matured Financial Understanding..." }]} />
                        </div>
                    )}

                    {/* TAB: DASHBOARD / OVERVIEW & CREDENCE SCORE */}
                    {!isLoading && (activeTab === 'dashboard' || activeTab === 'score') && (
                        <div className="space-y-12">
                            {/* Score Specific Focus Banner */}
                            {activeTab === 'score' && (
                                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-black uppercase tracking-wider text-white">CREDENCE SCORE VERIFICATION CONSOLE</span>
                                            <p className="text-[11px] text-slate-300 font-medium">Deterministic behavioural underwriting derived from authorized longitudinal records. Zero black boxes.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setIsWhyThisScoreOpen(true)}
                                            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-outfit font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer"
                                        >
                                            <Sparkles className="w-3.5 h-3.5" />
                                            <span>Why This Score?</span>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('reports')}
                                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-outfit font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
                                        >
                                            View Credit Profile
                                        </button>
                                    </div>
                                </div>
                            )}
                            {/* EMPTY STATE CHECK */}
                            {!financialIdentity.hasData ? (
                                <div className="p-12 sm:p-16 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center max-w-2xl mx-auto space-y-6 shadow-sm">
                                    <div className="w-20 h-20 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
                                        <ShieldCheck className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl sm:text-3xl font-outfit font-black uppercase tracking-tight text-slate-900 dark:text-white">
                                            YOUR FINANCIAL IDENTITY IS NOT YET ESTABLISHED
                                        </h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed font-medium">
                                            Traditional credit bureaus left your business invisible. Ingest UPI QR payment batches, APMC mandi receipts, or bank statements to synthesize your verified alternative credit identity.
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                                        <button
                                            onClick={() => setActiveTab('upload')}
                                            className="px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-outfit font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
                                        >
                                            <UploadCloud className="w-4 h-4" />
                                            <span>Ingest Financial Records (.csv)</span>
                                        </button>
                                        <button
                                            onClick={() => setIsDemoMode(true)}
                                            className="px-8 py-4 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-outfit font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
                                        >
                                            <RefreshCw className="w-4 h-4 text-indigo-500" />
                                            <span>Load Demo Profile (Sai Charan)</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* CREDENCE SCORE HERO COMPONENT (300 - 900) */}
                                    <CredenceScoreHero
                                        scoreResult={credenceScore}
                                        onOpenWhyThisScore={() => setIsWhyThisScoreOpen(true)}
                                        onSelectDimension={handleSelectDimension}
                                        onIngestData={() => setActiveTab('upload')}
                                    />

                                    {/* SECTION: EVIDENCE SUPPORTING YOUR SCORE & WHAT'S MISSING (EVIDENCE GAPS) */}
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                        {/* Left: Key Supporting Evidence */}
                                        <div className="lg:col-span-6 p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-outfit font-black text-lg uppercase tracking-tight text-slate-900 dark:text-white">
                                                            EVIDENCE SUPPORTING YOUR SCORE
                                                        </h4>
                                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                                                            Verified empirical behaviour extracted from authorized feeds
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                                    Grounded Proof
                                                </span>
                                            </div>

                                            <div className="space-y-3">
                                                {credenceScore.supportingEvidence.map((ev, i) => (
                                                    <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                                        <span className="text-xs font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                                                            {ev}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => setIsWhyThisScoreOpen(true)}
                                                className="w-full py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-outfit font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                                            >
                                                <Sparkles className="w-4 h-4 text-indigo-500" />
                                                <span>View Complete Attribution Trail</span>
                                            </button>
                                        </div>

                                        {/* Right: What's Missing? (Evidence Gap Engine) */}
                                        <div className="lg:col-span-6 p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                                                        <AlertCircle className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-outfit font-black text-lg uppercase tracking-tight text-slate-900 dark:text-white">
                                                            WHAT'S MISSING? (EVIDENCE GAPS)
                                                        </h4>
                                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                                                            Neutral identification of unobserved or incomplete data areas
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                                    Coverage Opportunities
                                                </span>
                                            </div>

                                            <div className="space-y-4">
                                                {/* Gap 1: Historical Coverage */}
                                                <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                                                            Historical Coverage Depth
                                                        </span>
                                                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                                                            Medium Coverage
                                                        </span>
                                                    </div>
                                                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                        Current coverage: <strong>{continuityAnalysis.coveredMonths} of {credenceScore.observationPeriodMonths} months</strong> active
                                                    </p>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                                        <strong>Why it matters:</strong> A longer continuous observation period provides stronger evidence of financial continuity.
                                                    </p>
                                                    <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                                                        <strong>Suggested action:</strong> Continue maintaining consistent records and connect additional legitimate sources where appropriate.
                                                    </p>
                                                </div>

                                                {/* Gap 2: Utility & Commercial Ledger Invoices */}
                                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                                                            Utility & B2B Invoices
                                                        </span>
                                                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                                            Pending Connectors
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                                        <strong>Why it matters:</strong> Direct recurring bill evidence strengthens payment consistency weighting.
                                                    </p>
                                                    <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                                                        <strong>Suggested action:</strong> Upload commercial utility receipts to expand verification depth.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECTION: FINANCIAL CONTINUITY & SCORE EVOLUTION */}
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                        {/* Financial Continuity Card */}
                                        <div className="lg:col-span-6 p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400">
                                                        <Clock className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-outfit font-black text-lg uppercase tracking-tight text-slate-900 dark:text-white">
                                                            FINANCIAL CONTINUITY
                                                        </h4>
                                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                                                            Longitudinal persistence of financial activity across time
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
                                                    {credenceScore.components.financialContinuity} • STABLE
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Observation Period</span>
                                                    <div className="text-base font-outfit font-black text-slate-900 dark:text-white mt-1">
                                                        {credenceScore.observationPeriodText}
                                                    </div>
                                                </div>

                                                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Activity Coverage</span>
                                                    <div className="text-base font-outfit font-black text-emerald-600 dark:text-emerald-400 mt-1">
                                                        {continuityAnalysis.coveredMonths} / {credenceScore.observationPeriodMonths} mo
                                                    </div>
                                                </div>

                                                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Recurring Patterns</span>
                                                    <div className="text-base font-outfit font-black text-indigo-600 dark:text-indigo-400 mt-1">
                                                        Detected
                                                    </div>
                                                </div>

                                                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Continuity Breaks</span>
                                                    <div className="text-base font-outfit font-black text-amber-500 mt-1">
                                                        {continuityAnalysis.breaks.length} Natural Breaks
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Month by month continuity timeline */}
                                            <div className="space-y-2 pt-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    Longitudinal Month-by-Month Activity Timeline
                                                </span>
                                                <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 pt-1 font-mono text-[9px] text-center">
                                                    {[
                                                        { m: 'Jan', active: true },
                                                        { m: 'Feb', active: true },
                                                        { m: 'Mar', active: true },
                                                        { m: 'Apr', active: true },
                                                        { m: 'May', active: true },
                                                        { m: 'Jun', active: true },
                                                        { m: 'Jul', active: false },
                                                        { m: 'Aug', active: false },
                                                        { m: 'Sep', active: true },
                                                        { m: 'Oct', active: true },
                                                        { m: 'Nov', active: true },
                                                        { m: 'Dec', active: true },
                                                        { m: 'Jan', active: true },
                                                        { m: 'Feb', active: true }
                                                    ].map((item, idx) => (
                                                        <div key={idx} className={`p-2 rounded-xl border flex flex-col items-center justify-between ${item.active ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400'}`}>
                                                            <span className="font-bold">{item.m}</span>
                                                            <span className="text-[10px]">{item.active ? '██' : '──'}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Score Evolution & History Card */}
                                        <div className="lg:col-span-6 p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                                        <History className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-outfit font-black text-lg uppercase tracking-tight text-slate-900 dark:text-white">
                                                            SCORE EVOLUTION & HISTORY
                                                        </h4>
                                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                                                            Score change attribution based on verified longitudinal evidence
                                                        </p>
                                                    </div>
                                                </div>
                                                {credenceScore.evolution && (
                                                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                                        +{credenceScore.evolution.change} Points
                                                    </span>
                                                )}
                                            </div>

                                            {credenceScore.evolution ? (
                                                <div className="space-y-4">
                                                    <div className="flex items-baseline justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                                                        <div>
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Score</span>
                                                            <div className="text-2xl font-outfit font-black text-slate-900 dark:text-white">
                                                                {credenceScore.evolution.currentScore}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Previous Score</span>
                                                            <div className="text-2xl font-outfit font-black text-slate-400">
                                                                {credenceScore.evolution.previousScore}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Net Change</span>
                                                            <div className="text-2xl font-outfit font-black text-emerald-600 dark:text-emerald-400">
                                                                +{credenceScore.evolution.change}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                                                        "{credenceScore.evolution.explanation}"
                                                    </p>

                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[10px]">
                                                        {credenceScore.evolution.contributors.map((ec, idx) => (
                                                            <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                                                                <span className="block text-slate-400 font-bold truncate">{ec.factor}</span>
                                                                <span className={`font-black text-xs mt-0.5 block ${ec.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                                    {ec.change >= 0 ? `+${ec.change}` : ec.change}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center space-y-2">
                                                    <span className="font-outfit font-black text-xs uppercase tracking-wider text-slate-400">
                                                        BUILDING HISTORY
                                                    </span>
                                                    <p className="text-xs text-slate-400">
                                                        Future analyses will appear here as your financial evidence evolves over time.
                                                    </p>
                                                </div>
                                            )}

                                            {/* Historical Snapshots */}
                                            <div className="space-y-2 pt-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    Longitudinal Snapshots
                                                </span>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px]">
                                                    {credenceScore.history.map((h, i) => (
                                                        <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                                            <span className="font-bold text-slate-400">{h.period}</span>
                                                            <span className="font-black text-slate-900 dark:text-white">{h.score}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* THE CREDENCE INTELLIGENCE LOOP BANNER */}
                                    <div className="p-6 sm:p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 text-white space-y-4 shadow-xl">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                                                    <Layers className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-outfit font-black uppercase tracking-wider text-white">
                                                        The CREDENCE Intelligence Loop
                                                    </h4>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                        Continuous Alternative Financial Understanding Architecture
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                                                9 OF 9 PIPELINE STAGES ACTIVE
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 pt-1">
                                            {[
                                                { step: '01', title: 'Data Ingestion', status: 'Active' },
                                                { step: '02', title: 'Signal Fusion', status: 'Fused' },
                                                { step: '03', title: 'Quality Check', status: 'Audited' },
                                                { step: '04', title: 'Behavioural Intel', status: 'Calculated' },
                                                { step: '05', title: 'Understanding Graph', status: 'Mapped' },
                                                { step: '06', title: 'Financial Continuity', status: 'Established' },
                                                { step: '07', title: 'Gap Analysis', status: 'Assessed' },
                                                { step: '08', title: 'Financial Identity', status: 'Synthesized' },
                                                { step: '09', title: 'Explainable Proof', status: 'Verified' }
                                            ].map((s, idx) => (
                                                <div key={idx} className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/40 flex flex-col justify-between">
                                                    <span className="text-[9px] font-mono font-black text-indigo-400">{s.step}</span>
                                                    <span className="text-[10px] font-bold text-slate-200 mt-1 truncate">{s.title}</span>
                                                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mt-0.5">{s.status}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* CORE FEATURE 01 — FINANCIAL SIGNAL FUSION */}
                                    <div className="space-y-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 font-outfit">
                                                        CORE FEATURE 01
                                                    </span>
                                                    <h3 className="text-xl sm:text-2xl font-outfit font-black text-slate-900 dark:text-white tracking-tight uppercase">
                                                        Financial Signal Fusion
                                                    </h3>
                                                </div>
                                                <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">
                                                    Assembling fragmented operational activity into one structured understanding layer (SOURCE → SIGNAL → BEHAVIOUR)
                                                </p>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-2 rounded-full uppercase tracking-widest self-start sm:self-auto">
                                                {signalFusionItems.length} Sources Fused
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {signalFusionItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
                                                >
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                                                                {item.sourceType}
                                                            </span>
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-mono">
                                                                {item.verificationStatus}
                                                            </span>
                                                        </div>

                                                        <div>
                                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">SOURCE</span>
                                                            <h4 className="font-outfit font-black text-slate-900 dark:text-white text-base leading-tight">
                                                                {item.sourceName}
                                                            </h4>
                                                            <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold mt-1">
                                                                {item.recordCount} Records • ₹{item.inflowTotal.toLocaleString('en-IN')} Vol.
                                                            </div>
                                                        </div>

                                                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 space-y-1">
                                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                                ↓ SIGNAL
                                                            </span>
                                                            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                                                {item.extractedSignal}
                                                            </p>
                                                        </div>

                                                        <div className="p-3.5 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-1">
                                                            <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">
                                                                ↓ BEHAVIOUR
                                                            </span>
                                                            <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                                                                {item.observedBehaviour}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                        <span>Contribution</span>
                                                        <span className="text-indigo-600 dark:text-indigo-400 font-black">{item.evidenceContribution}%</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* CORE FEATURE 02 & 03: 6 CORE SIGNALS GRID */}
                                    <div className="space-y-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 font-outfit">
                                                        CORE FEATURES 02 & 03
                                                    </span>
                                                    <h3 className="text-xl sm:text-2xl font-outfit font-black text-slate-900 dark:text-white tracking-tight uppercase">
                                                        Behavioural Intelligence Dimensions
                                                    </h3>
                                                </div>
                                                <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">
                                                    Pattern recognition across time (SIGNAL → OBSERVATION → UNDERSTANDING) with explainable drill-down
                                                </p>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-2 rounded-full uppercase tracking-widest self-start sm:self-auto">
                                                6 Signals Verified
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {evidenceTrail.map((signal: EvidenceTrailItem, idx: number) => {
                                                const color = getSignalColor(idx);
                                                const isIndigo = color === 'indigo';
                                                const isEmerald = color === 'emerald';
                                                const isSky = color === 'sky';

                                                return (
                                                    <div
                                                        key={signal.signalKey}
                                                        className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group flex flex-col justify-between"
                                                    >
                                                        <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-5 dark:opacity-10 transition-opacity group-hover:opacity-15 dark:group-hover:opacity-20 ${isIndigo ? 'bg-indigo-600' : isEmerald ? 'bg-emerald-600' : isSky ? 'bg-sky-600' : 'bg-amber-600'}`}></div>

                                                        <div>
                                                            <div className="flex items-center justify-between mb-6">
                                                                <div className={`p-4 rounded-2xl ${isIndigo ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400' : isEmerald ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : isSky ? 'bg-sky-50 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400' : 'bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'}`}>
                                                                    {getSignalIcon(signal.signalKey)}
                                                                </div>
                                                                <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                                                                    {signal.strength}
                                                                </span>
                                                            </div>

                                                            <span className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">
                                                                {signal.title}
                                                            </span>

                                                            <div className="flex items-baseline gap-2 mb-4">
                                                                <h4 className="text-3xl font-outfit font-black text-slate-900 dark:text-white tracking-tighter">
                                                                    {signal.score}%
                                                                </h4>
                                                                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest ml-auto">
                                                                    Calculated
                                                                </span>
                                                            </div>

                                                            {/* Progress bar */}
                                                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-4">
                                                                <div 
                                                                    className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-500"
                                                                    style={{ width: `${signal.score}%` }}
                                                                />
                                                            </div>

                                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
                                                                {signal.observation}
                                                            </p>
                                                        </div>

                                                        <button
                                                            onClick={() => setSelectedSignalForDrawer(signal)}
                                                            className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-outfit font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 group-hover:translate-x-0.5 transition-transform"
                                                        >
                                                            <span className="flex items-center gap-1.5">
                                                                <HelpCircle className="w-3.5 h-3.5" />
                                                                Why this result?
                                                            </span>
                                                            <ArrowUpRight className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Behavioural Pattern Breakdown (SIGNAL → OBSERVATION → UNDERSTANDING) */}
                                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-outfit">
                                                    Pattern Telemetry: SIGNAL → OBSERVATION → RELEVANT UNDERSTANDING
                                                </span>
                                                <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                                                    {behaviouralIntelligence.length} Verified Understanding Vectors
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                                {behaviouralIntelligence.map((item, bIdx) => (
                                                    <div key={bIdx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5 text-left">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-outfit truncate max-w-[120px]">
                                                                {item.title}
                                                            </span>
                                                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase font-mono ${item.status === 'SUFFICIENT' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'}`}>
                                                                {item.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold line-clamp-2 leading-tight">
                                                            {item.observation}
                                                        </p>
                                                        <p className="text-[9px] text-slate-400 dark:text-slate-500 line-clamp-1 font-mono">
                                                            {item.evidence}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* INNOVATION 01 — CREDENCE UNDERSTANDING GRAPH */}
                                    <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 font-outfit">
                                                        INNOVATION 01
                                                    </span>
                                                    <h4 className="font-outfit font-black text-xl sm:text-2xl uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                                                        <Network className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                                        CREDENCE UNDERSTANDING GRAPH
                                                    </h4>
                                                </div>
                                                <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">
                                                    "Every insight is grounded in relevant real-world activity." Interactive relationship map from raw vouchers to financial identity.
                                                </p>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
                                                100% Traceable Lineage
                                            </span>
                                        </div>

                                        {/* Graph Node Columns */}
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
                                            {evidenceGraph.nodes.map((node) => (
                                                <div
                                                    key={node.id}
                                                    onClick={() => {
                                                        setSelectedGraphNode(node);
                                                        if (evidenceTrail.length > 0) setSelectedSignalForDrawer(evidenceTrail[0]);
                                                    }}
                                                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 group ${
                                                        selectedGraphNode?.id === node.id
                                                            ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                                                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                                                    }`}
                                                >
                                                    <div>
                                                        <div className="flex items-center justify-between mb-1.5">
                                                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                                                node.type === 'USER' ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200' :
                                                                node.type === 'SOURCE' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' :
                                                                node.type === 'RECORD' ? 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300' :
                                                                node.type === 'SIGNAL' ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' :
                                                                node.type === 'PATTERN' ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' :
                                                                'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                                                            }`}>
                                                                {node.type}
                                                            </span>
                                                        </div>
                                                        <div className="font-outfit font-black text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                                                            {node.label}
                                                        </div>
                                                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium line-clamp-2 mt-0.5">
                                                            {node.sublabel}
                                                        </div>
                                                    </div>

                                                    {node.value && (
                                                        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] font-mono font-black text-indigo-600 dark:text-indigo-400">
                                                            {node.value}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                            <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-medium">
                                                <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                                                <span>Interactive Understanding Path: Click any node to trace operational context and verify real-world activity.</span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if (evidenceTrail.length > 0) setSelectedSignalForDrawer(evidenceTrail[0]);
                                                }}
                                                className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-outfit font-black text-[10px] uppercase tracking-wider hover:bg-indigo-500 transition-colors shrink-0 flex items-center gap-1"
                                            >
                                                <span>Decompose All Nodes</span>
                                                <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* INNOVATION 04 & 03: SIGNAL CHANGES & EVIDENCE GAPS */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Signal Changes (Longitudinal vs Own History) */}
                                        <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                                        <TrendingUp className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
                                                                INNOVATION 04
                                                            </span>
                                                            <h4 className="font-outfit font-black text-lg uppercase tracking-tight text-slate-900 dark:text-white">
                                                                Signal Changes (Longitudinal Intelligence)
                                                            </h4>
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                                                            Evaluating evolution against the applicant's own historical baseline
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Non-Fraud</span>
                                            </div>

                                            <div className="space-y-4">
                                                {signalChanges.map((sc: SignalChange, i: number) => (
                                                    <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
                                                        <div>
                                                            <span className="font-outfit font-black text-sm text-slate-900 dark:text-white uppercase tracking-tight">{sc.title}</span>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium leading-relaxed">{sc.observation}</p>
                                                            {sc.behavioralImpact && (
                                                                <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1 font-medium italic">
                                                                    Impact: {sc.behavioralImpact}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <span className="px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest shrink-0 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                                            {sc.direction}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                                      {/* Understanding Gaps (Completeness Intelligence) */}
                                        <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                                                        <Compass className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
                                                                INNOVATION 03
                                                            </span>
                                                            <h4 className="font-outfit font-black text-lg uppercase tracking-tight text-slate-900 dark:text-white">
                                                                Understanding & Expansion Levers
                                                            </h4>
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                                                            Identifying context expansion opportunities neutrally without score penalties
                                                        </p>
                                                    </div>
                                                </div>                            </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Neutral</span>
                                            </div>

                                            <div className="space-y-4">
                                                {evidenceGaps.map((gap: EvidenceGap, i: number) => (
                                                    <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between gap-2">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <span className="font-outfit font-black text-sm text-slate-900 dark:text-white uppercase tracking-tight">{gap.title}</span>
                                                            <span className="text-[9px] px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 shrink-0 font-black uppercase tracking-widest">
                                                                {gap.urgency} Priority
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{gap.description}</p>
                                                        <p className="text-[11px] text-slate-400 dark:text-slate-500 italic bg-white dark:bg-slate-900/60 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                                                            "{gap.neutralExplanation}"
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* INNOVATION 05 — CREDENCE TRUST LAYER */}
                                    <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 font-outfit">
                                                        INNOVATION 05
                                                    </span>
                                                    <h4 className="font-outfit font-black text-xl sm:text-2xl uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                                                        <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                                        CREDENCE TRUST LAYER
                                                    </h4>
                                                </div>
                                                <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">
                                                    Transparency around not only WHAT the system knows, but HOW WELL it knows it.
                                                </p>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
                                                Zero Fictional Claims
                                            </span>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 text-[9px] uppercase tracking-[0.2em] font-black border-b border-slate-100 dark:border-slate-800">
                                                    <tr>
                                                        <th className="px-6 py-4">Data Feed / Source</th>
                                                        <th className="px-6 py-4">Verification Status</th>
                                                        <th className="px-6 py-4">Observation Period</th>
                                                        <th className="px-6 py-4">Data Quality</th>
                                                        <th className="px-6 py-4">Profile Maturity</th>
                                                        <th className="px-6 py-4">Last Updated</th>
                                                        <th className="px-6 py-4">Audit Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 text-xs">
                                                    {trustLayerItems.map((item) => (
                                                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="font-bold text-slate-900 dark:text-white">{item.source}</div>
                                                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.sourceType}</div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                                                                    {item.verificationStatus}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                                                                {item.observationPeriod}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                                                    {item.dataQuality}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 font-black text-slate-900 dark:text-white">
                                                                {item.evidenceStrength}
                                                            </td>
                                                            <td className="px-6 py-4 text-slate-400 text-[11px] font-mono">
                                                                {item.lastUpdated}
                                                            </td>
                                                            <td className="px-6 py-4 text-[11px] text-slate-500 dark:text-slate-400 max-w-xs font-medium">
                                                                {item.auditStatus}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* VISUAL INTELLIGENCE LAYER */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <ChartCard title="Cash Flow History" subtitle="Verified Inflows vs Operating Obligations">
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={barChartData}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 10 }} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 10 }} tickFormatter={(v) => `₹${v / 1000}k`} />
                                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', backgroundColor: theme === 'dark' ? '#0f172a' : '#fff', color: theme === 'dark' ? '#eee' : '#111' }} />
                                                    <Bar dataKey="inflow" name="Cash Inflow" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={20} />
                                                    <Bar dataKey="obligations" name="Obligations" fill="#F43F5E" radius={[4, 4, 0, 0]} barSize={20} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </ChartCard>

                                        <ChartCard title="Liquidity Runway" subtitle="Cumulative Operating Net Cash Buffer">
                                            <ResponsiveContainer width="100%" height={300}>
                                                <LineChart data={lineChartData}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                                                    <XAxis dataKey="name" hide />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 10 }} tickFormatter={(v) => `₹${v / 1000}k`} />
                                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', backgroundColor: theme === 'dark' ? '#0f172a' : '#fff', color: theme === 'dark' ? '#eee' : '#111' }} />
                                                    <Line type="monotone" dataKey="netBuffer" name="Cumulative Buffer" stroke="#10B981" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: theme === 'dark' ? '#0f172a' : '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </ChartCard>
                                    </div>

                                    {/* INNOVATION SHOWCASE — WHY CREDENCE IS DIFFERENT */}
                                    <div className="space-y-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div>
                                                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 font-outfit">
                                                    INNOVATION SHOWCASE
                                                </span>
                                                <h3 className="text-xl sm:text-2xl font-outfit font-black text-slate-900 dark:text-white tracking-tight uppercase mt-1">
                                                    Why CREDENCE is Different
                                                </h3>
                                                <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                                                    5 foundational breakthroughs solving the credit-invisible dilemma
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                            {[
                                                {
                                                    number: "01",
                                                    title: "UNDERSTANDING GRAPH",
                                                    tagline: "Ground every credit insight in real-world commercial context.",
                                                    description: "Visual relationship map connecting daily operational activity to mature credit capacity."
                                                },
                                                {
                                                    number: "02",
                                                    title: "FINANCIAL CONTINUITY",
                                                    tagline: "Understand behaviour across time, not isolated transactions.",
                                                    description: "Measure whether financial activity demonstrates continuity across observation periods, identifying recurring patterns and neutral breaks."
                                                },
                                                {
                                                    number: "03",
                                                    title: "UNDERSTANDING GAPS",
                                                    tagline: "Constructive context expansion without arbitrary penalties.",
                                                    description: "Constructive completeness guidance without arbitrary score penalties or false credit promises."
                                                },
                                                {
                                                    number: "04",
                                                    title: "SIGNAL CHANGES",
                                                    tagline: "Understand how financial behaviour evolves.",
                                                    description: "Non-punitive comparison of the applicant's current cash velocity against their own historical baseline."
                                                },
                                                {
                                                    number: "05",
                                                    title: "TRUST LAYER",
                                                    tagline: "Know the source, relevance, and maturity of every financial signal.",
                                                    description: "Complete transparency around verification tier, data quality, and authentic transaction validation."
                                                }
                                            ].map((feat, idx) => (
                                                <div key={idx} className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all">
                                                    <div className="space-y-2">
                                                        <span className="text-2xl font-outfit font-black text-indigo-600 dark:text-indigo-400">{feat.number}</span>
                                                        <h4 className="text-sm font-outfit font-black uppercase tracking-tight text-slate-900 dark:text-white">{feat.title}</h4>
                                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-snug">{feat.tagline}</p>
                                                    </div>
                                                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium leading-relaxed">{feat.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* MODULAR DATA SOURCE CONNECTOR LAYER ARCHITECTURE */}
                                    <div className="p-6 sm:p-8 rounded-[2rem] bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-3">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div className="flex items-center gap-2.5">
                                                <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                                <span className="text-xs font-outfit font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                                    Modular Data Source Connector Pipeline
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                                                <span>Version: {financialIdentity.analysisVersioning?.analysis_version || 'v2.4.0'}</span>
                                                <span>•</span>
                                                <span>Merkle Root: {financialIdentity.analysisVersioning?.cryptographic_merkle_root || '0x4f82...'}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400">
                                            <span className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">SOURCE CONNECTOR</span>
                                            <span className="text-indigo-500">→</span>
                                            <span className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">NORMALIZATION</span>
                                            <span className="text-indigo-500">→</span>
                                            <span className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">VALIDATION</span>
                                            <span className="text-indigo-500">→</span>
                                            <span className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">SIGNAL EXTRACTION</span>
                                            <span className="text-indigo-500">→</span>
                                            <span className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">UNDERSTANDING ENGINE</span>
                                        </div>
                                    </div>

                                    {/* UNDERWRITING NARRATIVE BANNER */}
                                    <div className="bg-indigo-600 dark:bg-indigo-500 rounded-3xl sm:rounded-[3rem] p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-200 dark:shadow-indigo-500/20">
                                        <div className="absolute top-0 right-0 w-[20rem] sm:w-[40rem] h-[20rem] sm:h-[40rem] bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 backdrop-blur-3xl animate-pulse" />

                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                                    <Zap className="w-5 h-5 text-white" />
                                                </div>
                                                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] opacity-80 font-outfit">
                                                    CREDENCE Alternative Credit Synthesis v2.4
                                                </span>
                                            </div>

                                            <p className="text-base sm:text-lg font-medium leading-relaxed max-w-4xl text-white/95">
                                                Alternative financial understanding synthesized from recurring UPI flows, utility consistency, and APMC Mandi wholesale auction vouchers. Reveals an aggregated 86% Cash Flow Stability, 94% Payment Consistency, and manageable 41% Obligation Load across verified transactions. Demonstrates verifiable repayment capacity for applicants previously omitted by traditional bureau algorithms.
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* TAB: FINANCIAL CONTINUITY INDEX */}
                    {!isLoading && activeTab === 'continuity' && (
                        <div className="space-y-8 max-w-5xl mx-auto">
                            {/* Page Header */}
                            <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                                            <History className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 font-outfit">
                                                    SIGNATURE INNOVATION
                                                </span>
                                                <h2 className="text-2xl font-outfit font-black uppercase tracking-tight text-slate-900 dark:text-white">
                                                    Financial Continuity Index
                                                </h2>
                                            </div>
                                            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">
                                                Measure the consistency of financial behaviour across time
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
                                        Derived Analytical Indicator
                                    </span>
                                </div>

                                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/80 dark:border-indigo-900/30 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
                                    <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                                    <p className="leading-relaxed">
                                        <strong>Analytical Indicator:</strong> Financial Continuity answers whether meaningful financial activity demonstrates continuity across available observation periods. It is derived strictly from verified transactional activity and commercial understanding and is not an official credit bureau score.
                                    </p>
                                </div>
                            </div>

                            {/* MAIN CONTINUITY CARD / INSUFFICIENT STATE */}
                            {continuityAnalysis.isInsufficient ? (
                                <div className="p-8 sm:p-10 rounded-[2.5rem] bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 shadow-sm space-y-4">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                        <h3 className="text-lg font-outfit font-black uppercase tracking-wide text-amber-900 dark:text-amber-200">
                                            FINANCIAL CONTINUITY: BUILDING UNDERSTANDING
                                        </h3>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {continuityAnalysis.insufficientReason}
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-900/40">
                                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Observation Span</span>
                                            <span className="text-xl font-outfit font-black text-slate-900 dark:text-white mt-1 block">{continuityAnalysis.observationPeriodMonths} Months</span>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-900/40">
                                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Coverage</span>
                                            <span className="text-xl font-outfit font-black text-slate-900 dark:text-white mt-1 block">{continuityAnalysis.coveredMonths} / {continuityAnalysis.observationPeriodMonths} Months</span>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-900/40">
                                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Required Threshold</span>
                                            <span className="text-xl font-outfit font-black text-amber-600 dark:text-amber-400 mt-1 block">≥ 2 Cycles</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-slate-100 dark:border-slate-800 pb-8">
                                        {/* Score Column */}
                                        <div className="lg:col-span-5 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 font-outfit">
                                                    FINANCIAL CONTINUITY
                                                </span>
                                                <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                                    {continuityAnalysis.status}
                                                </span>
                                            </div>
                                            <div className="flex items-baseline gap-3">
                                                <span className="text-6xl font-outfit font-black tracking-tighter text-slate-900 dark:text-white">
                                                    {continuityAnalysis.score}%
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                                Derived from {continuityAnalysis.coveredMonths} active cycles across a {continuityAnalysis.observationPeriodMonths}-month empirical observation period.
                                            </p>
                                        </div>

                                        {/* 4 Telemetry Metrics */}
                                        <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                                                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Observation Period</span>
                                                <span className="text-lg font-outfit font-black text-slate-900 dark:text-white">{continuityAnalysis.observationPeriodMonths} Months</span>
                                                <span className="text-[10px] text-slate-400 block">Total window depth</span>
                                            </div>

                                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                                                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Activity Coverage</span>
                                                <span className="text-lg font-outfit font-black text-slate-900 dark:text-white">{continuityAnalysis.coveredMonths} / {continuityAnalysis.observationPeriodMonths} Months</span>
                                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">{Math.round(continuityAnalysis.coverageRatio * 100)}% monthly coverage</span>
                                            </div>

                                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                                                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Recurring Patterns</span>
                                                <span className="text-lg font-outfit font-black text-indigo-600 dark:text-indigo-400">
                                                    {continuityAnalysis.recurringPatternsDetected ? 'Detected' : 'Not Detected'}
                                                </span>
                                                <span className="text-[10px] text-slate-400 block">Weekly & monthly inflows</span>
                                            </div>

                                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                                                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Profile Maturity</span>
                                                <span className="text-lg font-outfit font-black text-emerald-600 dark:text-emerald-400">
                                                    {continuityAnalysis.evidenceStrength === 'Strong' ? 'Matured' : continuityAnalysis.evidenceStrength === 'Moderate' ? 'Developing' : continuityAnalysis.evidenceStrength === 'Limited' ? 'Early' : 'Building'}
                                                </span>
                                                <span className="text-[10px] text-slate-400 block">High statistical validity</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Observation Period Timeline Track */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-xs font-mono">
                                            <span className="text-slate-400 uppercase tracking-wider font-bold">
                                                {continuityAnalysis.observationPeriodMonths} MONTH OBSERVATION TRACK
                                            </span>
                                            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                                                ●────●────●────●────●────●
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                                            <span className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/40">Activity Inception</span>
                                            <span className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/40">Inflow Cadence</span>
                                            <span className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/40">Payment Consistency</span>
                                            <span className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/40">Trade Expansion</span>
                                            <span className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/40">Continuity Maintained</span>
                                        </div>
                                    </div>

                                    {/* CONTINUITY PATTERN */}
                                    <div className="p-6 rounded-[2rem] bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-outfit">
                                                CONTINUITY PATTERN
                                            </span>
                                            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-mono">
                                                {continuityAnalysis.patternType}
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                                            {continuityAnalysis.patternDescription}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-medium">
                                            Analytical observation derived from empirical transaction cadence, not a judgment of character or intent.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* CONTINUITY BREAKS */}
                            <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-outfit font-black text-xl uppercase tracking-tight text-slate-900 dark:text-white">
                                                CONTINUITY BREAKS
                                            </h3>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest font-mono ${continuityAnalysis.breaks.length > 0 ? 'bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800' : 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'}`}>
                                                {continuityAnalysis.breaks.length} Detected
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">
                                            Detect meaningful gaps in available financial activity with neutral observation
                                        </p>
                                    </div>
                                </div>

                                {continuityAnalysis.breaks.length === 0 ? (
                                    <div className="p-6 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                        <p className="text-xs text-emerald-800 dark:text-emerald-200 font-medium">
                                            No activity gaps detected across the {continuityAnalysis.observationPeriodMonths}-month observation window. Continuous transactional velocity verified.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {continuityAnalysis.breaks.map((brk: ContinuityBreak) => (
                                            <div key={brk.id} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/40 pb-3">
                                                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                                                        OBSERVATION PERIOD: {brk.observationPeriod}
                                                    </span>
                                                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 self-start sm:self-auto">
                                                        GAP DURATION: ~{brk.gapDurationMonths} MONTHS ({brk.gapDurationDays} DAYS)
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                                    <div>
                                                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">AFFECTED SIGNAL</span>
                                                        <p className="font-semibold text-slate-800 dark:text-slate-200">{brk.affectedSignal}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">OBSERVATION</span>
                                                        <p className="italic text-slate-600 dark:text-slate-300">"{brk.observation}"</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between pt-2">
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                                        SUPPORTING DATA: {brk.supportingData}
                                                    </p>
                                                    {evidenceTrail.length > 0 && (
                                                        <button
                                                            onClick={() => setSelectedSignalForDrawer(evidenceTrail[0])}
                                                            className="text-xs font-outfit font-black uppercase text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                                                        >
                                                            VIEW CONTEXT & RECORDS →
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* CONTINUITY TIMELINE */}
                            <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                                    <h3 className="font-outfit font-black text-xl uppercase tracking-tight text-slate-900 dark:text-white">
                                        CONTINUITY TIMELINE
                                    </h3>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">
                                        Chronological events reconstructed strictly from actual stored records
                                    </p>
                                </div>

                                <div className="relative pl-8 sm:pl-10 border-l-2 border-indigo-500/40 dark:border-indigo-500/30 space-y-8">
                                    {continuityAnalysis.timeline.map((event: ContinuityTimelineEvent, idx: number) => (
                                        <div key={idx} className="relative group">
                                            <div className="absolute -left-[41px] sm:-left-[49px] top-1.5 w-5 h-5 rounded-full bg-indigo-600 border-4 border-white dark:border-slate-900 group-hover:scale-125 transition-transform shadow-md" />
                                            <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-3 hover:shadow-xl transition-all">
                                                <div className="flex items-center justify-between text-xs font-mono">
                                                    <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{event.monthYear}</span>
                                                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                        {event.status}
                                                    </span>
                                                </div>
                                                <h4 className="text-base font-outfit font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                                    {event.milestone}
                                                </h4>
                                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                                    {event.detail}
                                                </p>
                                                {event.volumeTotal > 0 && (
                                                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/40 text-[11px] font-mono">
                                                        <span className="text-slate-400">
                                                            {event.recordCount} records • Total Volume: ₹{event.volumeTotal.toLocaleString('en-IN')}
                                                        </span>
                                                        {evidenceTrail.length > 0 && (
                                                            <button
                                                                onClick={() => setSelectedSignalForDrawer(evidenceTrail[0])}
                                                                className="text-xs font-outfit font-black uppercase text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                                                            >
                                                                VIEW CONTEXT & RECORDS →
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* EVIDENCE GRAPH CONNECTION */}
                            <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white border border-slate-800 space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 font-outfit">
                                            UNDERSTANDING & GRAPH CONNECTION
                                        </span>
                                        <h4 className="text-lg font-outfit font-black uppercase tracking-tight mt-0.5">
                                            Trace Continuity to the Understanding Graph
                                        </h4>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSearchParams({ tab: 'dashboard' });
                                        }}
                                        className="px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest bg-white text-black hover:bg-slate-200 transition-all flex items-center gap-2 self-start sm:self-auto"
                                    >
                                        <span>VIEW UNDERSTANDING GRAPH</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center gap-2 text-[10px] font-mono font-bold text-slate-300">
                                    <span>FINANCIAL RECORDS</span>
                                    <span className="text-indigo-400">↓</span>
                                    <span>CONTINUITY SIGNALS</span>
                                    <span className="text-indigo-400">↓</span>
                                    <span>CONTINUITY PATTERN</span>
                                    <span className="text-indigo-400">↓</span>
                                    <span>MATURED UNDERSTANDING</span>
                                    <span className="text-indigo-400">↓</span>
                                    <span className="text-emerald-400">FINANCIAL IDENTITY</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: DATA SOURCES & INGESTION */}
                    {!isLoading && activeTab === 'upload' && (
                        <div className="space-y-8">
                            <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                                        <Database className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-outfit font-black uppercase tracking-tight text-slate-900 dark:text-white">
                                            Alternative Data Feeds & Statement Ingestion
                                        </h2>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                                            Connect live merchant aggregators or upload statement records with automated pre-ingestion audit checks
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <DataSourcesManager
                                userId={user?.uid || 'guest'}
                                sources={activeSources}
                                records={activeRecords}
                                onDataUpdated={loadUserData}
                                isDemoMode={isDemoMode}
                            />
                        </div>
                    )}

                    {/* TAB: CREDIT PROFILES (STRUCTURED FINANCIAL IDENTITY) */}
                    {!isLoading && activeTab === 'reports' && (
                        <CreditProfilesView
                            profile={structuredProfile}
                            onNavigateTab={setActiveTab}
                            onOpenDimensionDrawer={(dimension) => setSelectedDimensionForDrawer(dimension)}
                            onOpenProfileDrawer={() => setIsProfileDetailOpen(true)}
                            isDemoMode={isDemoMode}
                            onLoadDemo={() => setIsDemoMode(true)}
                        />
                    )}
                </div>
            </main>

            {/* Signature Reveal Evidence Modal */}
            <RevealEvidenceModal
                isOpen={isRevealModalOpen}
                onClose={() => setIsRevealModalOpen(false)}
            />

            {/* Explainable AI Evidence Drawer */}
            <EvidenceDrawer
                isOpen={!!selectedSignalForDrawer}
                onClose={() => setSelectedSignalForDrawer(null)}
                signal={selectedSignalForDrawer}
                records={activeRecords}
            />

            {/* Credit Profile: Dimension Evidence Drill-down Drawer */}
            <WhyThisResultDrawer
                isOpen={!!selectedDimensionForDrawer}
                onClose={() => setSelectedDimensionForDrawer(null)}
                dimension={selectedDimensionForDrawer}
                allRecords={activeRecords}
            />

            {/* Credit Profile: Full Profile Breakdown Drawer */}
            <ProfileDetailDrawer
                isOpen={isProfileDetailOpen}
                onClose={() => setIsProfileDetailOpen(false)}
                profile={structuredProfile}
                onSelectDimension={(dim) => setSelectedDimensionForDrawer(dim)}
            />

            {/* Comprehensive "Why This Score?" Explanation Engine Modal */}
            <WhyThisScoreModal
                isOpen={isWhyThisScoreOpen}
                onClose={() => setIsWhyThisScoreOpen(false)}
                scoreResult={credenceScore}
                onSelectDimension={(key) => {
                    setIsWhyThisScoreOpen(false);
                    handleSelectDimension(key);
                }}
            />
        </div>
    );
};

/* --- Helpers --- */



const ChartCard = ({ title, subtitle, children }: any) => (
    <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl sm:rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all">
        <div className="mb-6 sm:mb-8">
            <h3 className="font-outfit font-black text-xl sm:text-2xl text-slate-900 dark:text-white leading-none tracking-tight uppercase">{title}</h3>
            <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold mt-2 uppercase tracking-widest">{subtitle}</p>
        </div>
        {children}
    </div>
);

export default Dashboard;
