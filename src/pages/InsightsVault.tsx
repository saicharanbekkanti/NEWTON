import { useState } from 'react';
import {
    TrendingUp,
    LineChart,
    Zap,
    Download,
    Activity,
    ShieldCheck,
    Droplets,
    Calendar,
    Users,
    CheckCircle2,
    Store,
    LogOut
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { Sidebar } from '@/components/ui/sidebar';
import { useTheme } from '../lib/ThemeContext';
import { useAuth } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const CHART_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6'];

/* --- Realistic Vegetable Vendor Dataset (Sai Charan - APMC Mandi) --- */

const VEGETABLE_VENDOR_PROFILE = {
    name: "Sai Charan",
    business: "Sri Balaji Fresh Vegetables (Stall #42, APMC Mandi)",
    location: "Bengaluru, Karnataka",
    category: "Micro-Enterprise / Informal Worker",
    bureauStatus: "Credit Invisible (CIBIL -1 / No Bureau History)",
    credenceScore: 742,
    maxScore: 900,
    credenceGrade: "STRONG (Prime Alternative)",
    evidenceConfidence: "94% Profile Maturity (Verified via 1,840+ digital QR events & mandi receipts)",
    dailyTurnoverAvg: 5840,
    dailyProcurementAvg: 3690,
    monthlyGrossAvg: 175200,
    monthlyNetAvg: 64500,
    liquidReserve: 42500,
    recommendedLoan: 50000,
    repaymentCapacity: "₹650/day or ₹4,500/week (DSCR: 2.8x)"
};

// 30-day daily trading trajectory for Sai Charan
const DAILY_TRADING_DATA = [
    { day: 'Day 1', inflow: 5200, mandiProcurement: 3400, netBuffer: 1800, transactions: 52 },
    { day: 'Day 2', inflow: 4900, mandiProcurement: 3200, netBuffer: 1700, transactions: 48 },
    { day: 'Day 3', inflow: 5600, mandiProcurement: 3500, netBuffer: 2100, transactions: 58 },
    { day: 'Day 4', inflow: 6100, mandiProcurement: 3800, netBuffer: 2300, transactions: 63 },
    { day: 'Day 5', inflow: 5400, mandiProcurement: 3600, netBuffer: 1800, transactions: 54 },
    { day: 'Day 6', inflow: 7200, mandiProcurement: 4400, netBuffer: 2800, transactions: 76 }, // Weekend peak
    { day: 'Day 7', inflow: 7800, mandiProcurement: 4700, netBuffer: 3100, transactions: 82 }, // Sunday peak
    { day: 'Day 8', inflow: 5100, mandiProcurement: 3300, netBuffer: 1800, transactions: 49 },
    { day: 'Day 9', inflow: 5300, mandiProcurement: 3400, netBuffer: 1900, transactions: 51 },
    { day: 'Day 10', inflow: 5800, mandiProcurement: 3700, netBuffer: 2100, transactions: 59 },
    { day: 'Day 11', inflow: 5500, mandiProcurement: 3500, netBuffer: 2000, transactions: 55 },
    { day: 'Day 12', inflow: 5900, mandiProcurement: 3800, netBuffer: 2100, transactions: 61 },
    { day: 'Day 13', inflow: 7400, mandiProcurement: 4600, netBuffer: 2800, transactions: 78 },
    { day: 'Day 14', inflow: 8100, mandiProcurement: 4900, netBuffer: 3200, transactions: 86 },
    { day: 'Day 15', inflow: 5200, mandiProcurement: 3400, netBuffer: 1800, transactions: 50 },
    { day: 'Day 16', inflow: 5400, mandiProcurement: 3500, netBuffer: 1900, transactions: 53 },
    { day: 'Day 17', inflow: 5700, mandiProcurement: 3600, netBuffer: 2100, transactions: 57 },
    { day: 'Day 18', inflow: 6300, mandiProcurement: 3900, netBuffer: 2400, transactions: 66 },
    { day: 'Day 19', inflow: 5600, mandiProcurement: 3600, netBuffer: 2000, transactions: 56 },
    { day: 'Day 20', inflow: 7600, mandiProcurement: 4700, netBuffer: 2900, transactions: 79 },
    { day: 'Day 21', inflow: 8300, mandiProcurement: 5100, netBuffer: 3200, transactions: 88 },
    { day: 'Day 22', inflow: 5000, mandiProcurement: 3300, netBuffer: 1700, transactions: 47 },
    { day: 'Day 23', inflow: 5300, mandiProcurement: 3400, netBuffer: 1900, transactions: 52 },
    { day: 'Day 24', inflow: 5900, mandiProcurement: 3800, netBuffer: 2100, transactions: 60 },
    { day: 'Day 25', inflow: 6200, mandiProcurement: 3900, netBuffer: 2300, transactions: 64 },
    { day: 'Day 26', inflow: 5700, mandiProcurement: 3600, netBuffer: 2100, transactions: 58 },
    { day: 'Day 27', inflow: 7500, mandiProcurement: 4600, netBuffer: 2900, transactions: 77 },
    { day: 'Day 28', inflow: 8000, mandiProcurement: 4900, netBuffer: 3100, transactions: 84 },
    { day: 'Day 29', inflow: 5400, mandiProcurement: 3500, netBuffer: 1900, transactions: 53 },
    { day: 'Day 30', inflow: 5800, mandiProcurement: 3700, netBuffer: 2100, transactions: 59 }
];

// Seasonality Breakdown for Sai Charan (Vegetables)
const SEASONALITY_DATA = [
    {
        season: 'Winter (Nov-Feb)',
        inflow: 185000,
        procurement: 112850,
        marginRate: 39,
        status: 'Peak Supply / High Volume',
        note: 'Abundant seasonal greens (spinach, cauliflower, carrots). Low spoilage.'
    },
    {
        season: 'Summer (Mar-Jun)',
        inflow: 168000,
        procurement: 107520,
        marginRate: 36,
        status: 'Steady Demand',
        note: 'Higher misting & cold crate costs. Steady potato, onion, and gourd demand.'
    },
    {
        season: 'Monsoon (Jul-Aug)',
        inflow: 155000,
        procurement: 103850,
        marginRate: 33,
        status: 'Supply Inflation Hedge',
        note: 'Tomato & onion procurement spikes 35%. Vendor shifts mix to preserve 33% margin.'
    },
    {
        season: 'Festival Surge (Sep-Oct)',
        inflow: 215000,
        procurement: 124700,
        marginRate: 42,
        status: 'Surge Demand / High Ticket',
        note: 'Navratri, Diwali & wedding bulk orders. Peak cash velocity & liquidity.'
    }
];

// Customer Concentration Data for Sai Charan
const CUSTOMER_CONCENTRATION_DATA = [
    { name: 'Daily Retail Walk-ins', value: 81.2, buyers: '1,120+ households', ticket: '₹60 - ₹240' },
    { name: 'Apartment Batch Buyers', value: 11.4, buyers: '28 families', ticket: '₹350 - ₹600' },
    { name: 'Annapurna Tea Stall', value: 4.2, buyers: 'Daily regular', ticket: '₹250/day' },
    { name: 'Sagar Fast Food Corner', value: 3.2, buyers: 'Daily regular', ticket: '₹180/day' }
];

// Liquidity Runway Data
const LIQUIDITY_RUNWAY_DATA = [
    { month: 'Oct 2025', liquidSurplus: 34000, requiredMandiBuffer: 15000, obligationLoad: 8000 },
    { month: 'Nov 2025', liquidSurplus: 38000, requiredMandiBuffer: 16000, obligationLoad: 8000 },
    { month: 'Dec 2025', liquidSurplus: 41000, requiredMandiBuffer: 16500, obligationLoad: 8000 },
    { month: 'Jan 2026', liquidSurplus: 44500, requiredMandiBuffer: 17000, obligationLoad: 8500 },
    { month: 'Feb 2026', liquidSurplus: 39500, requiredMandiBuffer: 16500, obligationLoad: 8500 },
    { month: 'Mar 2026', liquidSurplus: 42500, requiredMandiBuffer: 17500, obligationLoad: 8500 }
];

const InsightsVault = () => {
    const { theme } = useTheme();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('insights');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [timeframe, setTimeframe] = useState<'D' | 'W' | 'M'>('D');
    const [selectedMetricView, setSelectedMetricView] = useState<'trends' | 'seasonality' | 'concentration' | 'liquidity'>('trends');

    const handleLogout = async () => {
        try {
            navigate('/', { replace: true });
            await logout();
        } catch (err) {
            console.error('Logout error:', err);
            window.location.href = '/';
        }
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
    };

    const handleExportAuditCertificate = () => {
        const certificate = {
            issuer: "CREDENCE Alternative Financial Intelligence Engine v2.4",
            evaluationDate: new Date().toISOString(),
            applicant: VEGETABLE_VENDOR_PROFILE,
            coreMetrics: {
                cashFlowStability: "86% (Resilient daily buffer across 30 days)",
                revenueConsistency: "93% (29.2 active trading days/month, 0 collapses)",
                liquidityRunway: "2.4x Daily Procurement Outlay (₹42,500 liquid surplus)",
                revenueTrends: "+14.2% MoM Expansion in digital QR volume",
                seasonalityResilience: "88% (Protects >32% margin during tomato/onion price spikes)",
                customerConcentration: "7.4% Top 5 Buyers (1,120+ granular retail walk-ins)"
            },
            creditDecision: {
                recommendedCreditTier: "Tier-1 Micro Working Capital",
                sanctionLimit: "₹50,000",
                recommendedTenure: "180 Days",
                servicingMethod: "Daily UPI deduction: ₹650/day",
                debtServiceCoverageRatio: "2.8x (Safe Threshold > 1.5x)"
            }
        };

        const blob = new Blob([JSON.stringify(certificate, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `CREDENCE_Financial_Understanding_Sai_Charan_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
                "flex-1 overflow-y-auto relative p-4 sm:p-6 lg:p-12 transition-all duration-300",
                isCollapsed ? "lg:ml-20" : "lg:ml-64"
            )}>
                {/* Header with Applicant Showcase */}
                <header className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-outfit font-black text-slate-900 dark:text-white tracking-tighter uppercase flex items-center gap-3 sm:gap-4">
                                <ShieldCheck className="w-8 h-8 sm:w-12 sm:h-12 text-indigo-600 dark:text-indigo-400" />
                                CREDIT UNDERSTANDING & INSIGHTS
                            </h1>
                            <span className="text-[9px] sm:text-[10px] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 px-3 py-1 rounded-full font-black uppercase tracking-widest flex items-center gap-1.5">
                                <CheckCircle2 className="w-3 h-3" />
                                6 CORE DIMENSIONS VERIFIED
                            </span>
                        </div>
                        <p className="text-slate-400 dark:text-slate-500 font-bold mt-2 uppercase tracking-[0.2em] text-[10px] sm:text-xs">
                            CREDENCE Alternative Credit Analysis • Credit Invisible Micro-Enterprise Cohort
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            {(['D', 'W', 'M'] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTimeframe(t)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeframe === t
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    {t === 'D' ? 'Daily' : t === 'W' ? 'Weekly' : 'Monthly'}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleExportAuditCertificate}
                            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all shadow-sm"
                        >
                            <Download className="w-4 h-4" />
                            <span>EXPORT FINANCIAL UNDERSTANDING</span>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-900/30 transition-all shadow-sm"
                            title="Sign Out of Session"
                        >
                            <LogOut className="w-4 h-4 text-rose-500" />
                            <span>SIGN OUT</span>
                        </button>
                    </div>
                </header>

                {/* Spotlight Banner: Sai Charan (Vegetable Vendor) */}
                <div className="mb-10 p-6 sm:p-8 bg-gradient-to-r from-indigo-900/40 via-slate-900 to-indigo-950/50 rounded-3xl sm:rounded-[2.5rem] border border-indigo-500/20 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="flex items-start sm:items-center gap-5">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                                <Store className="w-8 h-8 sm:w-10 sm:h-10" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl sm:text-3xl font-outfit font-black text-white uppercase tracking-tight">
                                        {VEGETABLE_VENDOR_PROFILE.name}
                                    </h2>
                                    <span className="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                        {VEGETABLE_VENDOR_PROFILE.bureauStatus}
                                    </span>
                                </div>
                                <p className="text-indigo-200/80 text-xs sm:text-sm font-semibold mt-1">
                                    {VEGETABLE_VENDOR_PROFILE.business} • {VEGETABLE_VENDOR_PROFILE.location}
                                </p>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
                                    {VEGETABLE_VENDOR_PROFILE.evidenceConfidence}
                                </p>
                            </div>
                        </div>

                        {/* Alternative Credit Score Pill */}
                        <div className="flex items-center gap-6 bg-white/5 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 backdrop-blur-md self-start md:self-auto">
                            <div className="text-right">
                                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-300 block">
                                    CREDENCE Score
                                </span>
                                <div className="flex items-baseline gap-1 mt-0.5">
                                    <span className="text-3xl sm:text-4xl font-outfit font-black text-emerald-400">
                                        {VEGETABLE_VENDOR_PROFILE.credenceScore}
                                    </span>
                                    <span className="text-xs text-slate-400 font-bold">/ 900</span>
                                </div>
                                <span className="text-[9px] font-bold text-emerald-400/90 uppercase tracking-wider block">
                                    Grade: {VEGETABLE_VENDOR_PROFILE.credenceGrade}
                                </span>
                            </div>
                            <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-400 flex items-center justify-center font-black text-xs text-white">
                                88%
                            </div>
                        </div>
                    </div>
                </div>

                {/* The 6 Core Dimensions Requested by User */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                            6-Dimension Underwriting Synthesis
                        </span>
                        <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">
                            Click a pillar to inspect behavioral chart
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                        {/* 1. Cash Flow Stability */}
                        <MetricPillarCard
                            title="Cash Flow Stability"
                            value="86%"
                            subtext="Positive Buffer 29/30 Days"
                            trend="+4.8%"
                            icon={<Activity className="w-5 h-5" />}
                            color="indigo"
                            isActive={selectedMetricView === 'trends'}
                            onClick={() => setSelectedMetricView('trends')}
                        />

                        {/* 2. Revenue Consistency */}
                        <MetricPillarCard
                            title="Revenue Consistency"
                            value="93%"
                            subtext="29.2 Days/Mo Active UPI"
                            trend="+2.3%"
                            icon={<TrendingUp className="w-5 h-5" />}
                            color="emerald"
                            isActive={selectedMetricView === 'trends'}
                            onClick={() => setSelectedMetricView('trends')}
                        />

                        {/* 3. Liquidity */}
                        <MetricPillarCard
                            title="Liquidity Runway"
                            value="2.4x Buffer"
                            subtext="₹42,500 Liquid Reserves"
                            trend="High Buffer"
                            icon={<Droplets className="w-5 h-5" />}
                            color="sky"
                            isActive={selectedMetricView === 'liquidity'}
                            onClick={() => setSelectedMetricView('liquidity')}
                        />

                        {/* 4. Revenue Trends */}
                        <MetricPillarCard
                            title="Revenue Trends"
                            value="+14.2%"
                            subtext="₹1.75L Mo. Gross"
                            trend="+18% QR Vol"
                            icon={<LineChart className="w-5 h-5" />}
                            color="purple"
                            isActive={selectedMetricView === 'trends'}
                            onClick={() => setSelectedMetricView('trends')}
                        />

                        {/* 5. Seasonality */}
                        <MetricPillarCard
                            title="Seasonality Hedge"
                            value="88%"
                            subtext="Monsoon Margin Protected"
                            trend="Resilient"
                            icon={<Calendar className="w-5 h-5" />}
                            color="amber"
                            isActive={selectedMetricView === 'seasonality'}
                            onClick={() => setSelectedMetricView('seasonality')}
                        />

                        {/* 6. Customer Concentration */}
                        <MetricPillarCard
                            title="Cust. Concentration"
                            value="7.4% Top 5"
                            subtext="1,120+ Retail Buyers"
                            trend="Ultra Low"
                            icon={<Users className="w-5 h-5" />}
                            color="rose"
                            isActive={selectedMetricView === 'concentration'}
                            onClick={() => setSelectedMetricView('concentration')}
                        />
                    </div>
                </div>

                {/* Primary Analytical Workspace */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Interactive Chart Container */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl sm:rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 relative z-10">
                            <div>
                                <h3 className="text-xl sm:text-2xl font-outfit font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                    {selectedMetricView === 'trends' && 'Cash Flow Velocity & Revenue Trends'}
                                    {selectedMetricView === 'seasonality' && 'Seasonality Resilience Across Commodity Cycles'}
                                    {selectedMetricView === 'concentration' && 'Customer Concentration Risk Breakdown'}
                                    {selectedMetricView === 'liquidity' && 'Liquidity Reserves vs Procurement Obligations'}
                                </h3>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">
                                    {selectedMetricView === 'trends' && 'Daily UPI QR Inflows vs Morning Mandi Wholesale Outlays'}
                                    {selectedMetricView === 'seasonality' && 'Margin preservation during crop price fluctuations (Vegetable basket)'}
                                    {selectedMetricView === 'concentration' && 'Granular decentralization across 1,120+ household shoppers'}
                                    {selectedMetricView === 'liquidity' && 'Daily closing cash buffer runway over 6 months'}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setSelectedMetricView('trends')}
                                    className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${selectedMetricView === 'trends' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
                                >
                                    Trends
                                </button>
                                <button
                                    onClick={() => setSelectedMetricView('seasonality')}
                                    className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${selectedMetricView === 'seasonality' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
                                >
                                    Seasonality
                                </button>
                                <button
                                    onClick={() => setSelectedMetricView('concentration')}
                                    className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${selectedMetricView === 'concentration' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
                                >
                                    Concentration
                                </button>
                                <button
                                    onClick={() => setSelectedMetricView('liquidity')}
                                    className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${selectedMetricView === 'liquidity' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
                                >
                                    Liquidity
                                </button>
                            </div>
                        </div>

                        <div className="h-[320px] sm:h-[420px] w-full">
                            {selectedMetricView === 'trends' && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={DAILY_TRADING_DATA}>
                                        <defs>
                                            <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                                            </linearGradient>
                                            <linearGradient id="colorBuffer" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 700 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 700 }} tickFormatter={(v) => `₹${v}`} />
                                        <Tooltip content={<CustomTradingTooltip theme={theme} />} />
                                        <Area type="monotone" dataKey="inflow" name="Gross UPI Retail Sales" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorInflow)" />
                                        <Area type="monotone" dataKey="mandiProcurement" name="Mandi Wholesale Outlay" stroke="#F43F5E" strokeWidth={2} strokeDasharray="4 4" fill="transparent" />
                                        <Area type="monotone" dataKey="netBuffer" name="Net Cash Buffer" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorBuffer)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}

                            {selectedMetricView === 'seasonality' && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={SEASONALITY_DATA}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                                        <XAxis dataKey="season" axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 700 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 700 }} tickFormatter={(v) => `₹${v / 1000}k`} />
                                        <Tooltip content={<CustomSeasonalityTooltip theme={theme} />} />
                                        <Bar dataKey="inflow" name="Turnover (₹)" fill="#6366F1" radius={[6, 6, 0, 0]} barSize={28} />
                                        <Bar dataKey="procurement" name="Procurement (₹)" fill="#F43F5E" radius={[6, 6, 0, 0]} barSize={28} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}

                            {selectedMetricView === 'concentration' && (
                                <div className="h-full flex flex-col md:flex-row items-center justify-center gap-8">
                                    <div className="w-full md:w-1/2 h-[260px] sm:h-[320px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={CUSTOMER_CONCENTRATION_DATA}
                                                    innerRadius={70}
                                                    outerRadius={100}
                                                    paddingAngle={4}
                                                    dataKey="value"
                                                >
                                                    {CUSTOMER_CONCENTRATION_DATA.map((_, index) => (
                                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={<CustomConcentrationTooltip theme={theme} />} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="w-full md:w-1/2 space-y-3">
                                        {CUSTOMER_CONCENTRATION_DATA.map((item, idx) => (
                                            <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}></div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.name}</p>
                                                        <p className="text-[10px] text-slate-400">{item.buyers} • Ticket: {item.ticket}</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{item.value}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedMetricView === 'liquidity' && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={LIQUIDITY_RUNWAY_DATA}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 700 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 700 }} tickFormatter={(v) => `₹${v / 1000}k`} />
                                        <Tooltip content={<CustomLiquidityTooltip theme={theme} />} />
                                        <Bar dataKey="liquidSurplus" name="Liquid Cash Surplus" fill="#10B981" radius={[6, 6, 0, 0]} barSize={26} />
                                        <Bar dataKey="requiredMandiBuffer" name="Mandi 3-Day Buffer" fill="#6366F1" radius={[6, 6, 0, 0]} barSize={26} />
                                        <Bar dataKey="obligationLoad" name="Fixed Obligations" fill="#F43F5E" radius={[6, 6, 0, 0]} barSize={26} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* AI Underwriting Recommendation & Synthesis Card */}
                    <div className="bg-slate-900 rounded-3xl sm:rounded-[3rem] p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-indigo-600/30 rounded-2xl border border-indigo-400/30 text-indigo-400">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-outfit font-black uppercase tracking-tight">AI Underwriter Rationale</h3>
                                    <p className="text-[9px] text-indigo-300 font-bold uppercase tracking-widest">Autonomous Credit Verification</p>
                                </div>
                            </div>

                            <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-indigo-500/50 pl-4">
                                &ldquo;Sai Charan presents an exemplary Credit Invisible profile. Despite having 0 bureau credit lines, his real UPI payment velocity (average 62 txns/day), high gross margins (38%), and 2.4x liquidity buffer demonstrate exceptional debt service capacity. Zero default risk identified from client concentration.&rdquo;
                            </p>

                            <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400 uppercase font-bold text-[10px]">Pre-Approved Micro-Credit:</span>
                                    <span className="font-black text-emerald-400 text-base">{formatCurrency(VEGETABLE_VENDOR_PROFILE.recommendedLoan)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400 uppercase font-bold text-[10px]">Daily Auto-Sweep Capacity:</span>
                                    <span className="font-bold text-white">₹650 / day</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400 uppercase font-bold text-[10px]">Debt Service Coverage (DSCR):</span>
                                    <span className="font-bold text-indigo-300">2.8x (Healthy &gt; 1.5x)</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-black uppercase tracking-widest relative z-10">
                            <span>Alternative Bureau Grade: A</span>
                            <span className="text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                            </span>
                        </div>
                    </div>
                </div>

                {/* Seasonality & Consistency Matrix Ledger */}
                <section className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-16">
                    <div className="px-6 sm:px-10 py-6 sm:py-8 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/30">
                        <div>
                            <h3 className="font-outfit font-black text-lg sm:text-xl uppercase tracking-tight text-slate-900 dark:text-white">
                                Seasonality & Margin Preservation Matrix
                            </h3>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-1">
                                4-Season commodity resilience analysis for Sri Balaji Fresh Vegetables
                            </p>
                        </div>
                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full uppercase tracking-widest">
                            88% Seasonality Resilience
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/30 dark:bg-slate-800/20 text-slate-400 text-[10px] uppercase tracking-[0.25em] font-black border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-8 py-5">Commodity Cycle</th>
                                    <th className="px-8 py-5">Cycle Turnover</th>
                                    <th className="px-8 py-5">Mandi Wholesale Procurement</th>
                                    <th className="px-8 py-5">Gross Margin</th>
                                    <th className="px-8 py-5">Resilience Behavior & Notes</th>
                                    <th className="px-8 py-5 text-center">Stability</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-50 dark:divide-slate-800/50">
                                {SEASONALITY_DATA.map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-indigo-900/10 transition-colors">
                                        <td className="px-8 py-5 font-bold text-slate-900 dark:text-white">{row.season}</td>
                                        <td className="px-8 py-5 font-black text-indigo-600 dark:text-indigo-400">{formatCurrency(row.inflow)}</td>
                                        <td className="px-8 py-5 font-bold text-rose-500">{formatCurrency(row.procurement)}</td>
                                        <td className="px-8 py-5 font-black text-emerald-600 dark:text-emerald-400">{row.marginRate}%</td>
                                        <td className="px-8 py-5 text-xs text-slate-500 dark:text-slate-400 font-medium max-w-xs">{row.note}</td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
                                                Resilient
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
};

/* --- Custom Tooltips --- */

const CustomTradingTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 text-white border border-white/10 p-4 rounded-2xl shadow-xl text-xs space-y-2">
                <p className="font-black text-indigo-300 uppercase tracking-wider">{label}</p>
                {payload.map((p: any, idx: number) => (
                    <div key={idx} className="flex justify-between gap-6">
                        <span className="text-slate-400 font-bold">{p.name}:</span>
                        <span className="font-black" style={{ color: p.color }}>₹{p.value?.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const CustomSeasonalityTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 text-white border border-white/10 p-4 rounded-2xl shadow-xl text-xs space-y-2">
                <p className="font-black text-indigo-300 uppercase tracking-wider">{label}</p>
                {payload.map((p: any, idx: number) => (
                    <div key={idx} className="flex justify-between gap-6">
                        <span className="text-slate-400 font-bold">{p.name}:</span>
                        <span className="font-black" style={{ color: p.color }}>₹{p.value?.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const CustomConcentrationTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const item = payload[0];
        return (
            <div className="bg-slate-900 text-white border border-white/10 p-3 rounded-2xl shadow-xl text-xs">
                <p className="font-black text-indigo-300">{item.name}</p>
                <p className="text-emerald-400 font-bold mt-1">{item.value}% of monthly sales</p>
            </div>
        );
    }
    return null;
};

const CustomLiquidityTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 text-white border border-white/10 p-4 rounded-2xl shadow-xl text-xs space-y-2">
                <p className="font-black text-indigo-300 uppercase tracking-wider">{label}</p>
                {payload.map((p: any, idx: number) => (
                    <div key={idx} className="flex justify-between gap-6">
                        <span className="text-slate-400 font-bold">{p.name}:</span>
                        <span className="font-black" style={{ color: p.color }}>₹{p.value?.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

/* --- Metric Pillar Card --- */

const MetricPillarCard = ({ title, value, subtext, trend, icon, color, isActive, onClick }: any) => {
    const isIndigo = color === 'indigo';
    const isEmerald = color === 'emerald';
    const isSky = color === 'sky';
    const isPurple = color === 'purple';
    const isAmber = color === 'amber';

    return (
        <div
            onClick={onClick}
            className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${isActive
                ? 'bg-white dark:bg-slate-800 border-indigo-500 shadow-xl ring-2 ring-indigo-500/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${isIndigo ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400' :
                    isEmerald ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' :
                        isSky ? 'bg-sky-50 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400' :
                            isPurple ? 'bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400' :
                                isAmber ? 'bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400' :
                                    'bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400'
                    }`}>
                    {icon}
                </div>
                <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-lg border border-emerald-100 dark:border-emerald-800/40">
                    {trend}
                </span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                {title}
            </span>
            <h4 className="text-xl font-outfit font-black text-slate-900 dark:text-white tracking-tight">
                {value}
            </h4>
            <p className="text-[10px] text-slate-400 font-medium truncate mt-1">
                {subtext}
            </p>
        </div>
    );
};

export default InsightsVault;
