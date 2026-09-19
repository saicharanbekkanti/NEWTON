import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { HorizonHero } from '../components/ui/horizon-hero-section';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Activity,
    TrendingUp,
    ShieldCheck,
    Fingerprint,
    FileSearch,
    LogOut
} from 'lucide-react';
import { GlowingEffect } from "../components/ui/glowing-effect";
import { cn } from "../lib/utils";

const LandingPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleTryNow = () => {
        if (user) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <div className="relative bg-black min-h-screen overflow-x-hidden">
            {/* Top Navigation Bar */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-xl bg-black/40 border-b border-white/5 transition-all">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center font-black text-black text-sm shadow-lg shadow-indigo-500/20">
                        C
                    </div>
                    <span className="font-poppins font-black text-lg tracking-wider text-white italic">CREDENCE</span>
                </div>

                <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-400">
                    <a href="#features" className="hover:text-white transition-colors">Architecture</a>
                    <a href="#features" className="hover:text-white transition-colors">Insights & Understanding</a>
                    <button onClick={handleTryNow} className="hover:text-indigo-400 transition-colors">Live Demo</button>
                </nav>

                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest bg-white text-black hover:bg-slate-200 transition-all active:scale-95 shadow-lg shadow-white/10 flex items-center gap-2"
                            >
                                <span>Console</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-widest bg-white/10 text-white hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30 border border-white/10 transition-all active:scale-95 flex items-center gap-2"
                                title="Sign Out of Session"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span>Sign Out</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-colors"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={handleTryNow}
                                className="px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest bg-white text-black hover:bg-slate-200 transition-all active:scale-95 shadow-lg shadow-white/10 flex items-center gap-2"
                            >
                                <span>Launch Console</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </>
                    )}
                </div>
            </header>

            {/* 3D Hero Section */}
            <HorizonHero />

            {/* Feature Overlay (Visible on scroll) */}
            <div id="features" className="relative z-10 bg-black/90 backdrop-blur-xl border-t border-white/5 py-32 px-8">
                <div className="max-w-7xl mx-auto">
                    {/* 4 CORE PRINCIPLES BANNER */}
                    <div className="mb-24">
                        <div className="p-8 sm:p-10 rounded-[2.5rem] bg-zinc-950/80 border border-white/10 backdrop-blur-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                            <div className="relative z-10 space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-6">
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 font-outfit">
                                            PRODUCT PHILOSOPHY & MANDATE
                                        </span>
                                        <h3 className="text-2xl sm:text-3xl font-poppins font-black text-white italic uppercase tracking-tight mt-1">
                                            The Four Non-Negotiables
                                        </h3>
                                    </div>
                                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-white/5 text-slate-300 border border-white/10 self-start sm:self-auto">
                                        Architecture: Firebase Auth • Supabase DB • CREDENCE Engine
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                                    {[
                                        {
                                            num: "01",
                                            title: "MAKE INVISIBLE BEHAVIOUR VISIBLE",
                                            desc: "Bring thin-file informal economic activity out of the dark into structured financial reality."
                                        },
                                        {
                                            num: "02",
                                            title: "TRANSLATE ACTIVITY INTO MATURED UNDERSTANDING",
                                            desc: "Unify fragmented UPI flows, APMC auction slips, and utility logs into relevant commercial understanding."
                                        },
                                        {
                                            num: "03",
                                            title: "MAKE IDENTITY EXPLAINABLE",
                                            desc: "No black boxes. Every insight connects directly to source records with 4-level deep proof decomposition."
                                        },
                                        {
                                            num: "04",
                                            title: "SCALABLE FINANCIAL INCLUSION",
                                            desc: "A rigorous, auditable underwriting foundation empowering lenders to deploy capital with conviction."
                                        }
                                    ].map((item, i) => (
                                        <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2.5 hover:border-indigo-500/30 transition-colors">
                                            <span className="text-xl font-outfit font-black text-indigo-400">{item.num}</span>
                                            <h4 className="text-xs font-outfit font-black uppercase tracking-wider text-white">{item.title}</h4>
                                            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 6-STAGE PRODUCT STORY (SECTION 36) */}
                    <div id="product-story" className="mb-36">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400 font-outfit">
                                PRODUCT STORY & PROGRESSION
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-poppins font-black text-white italic uppercase tracking-tighter mt-2">
                                Where Financial Behaviour Becomes Credibility
                            </h2>
                            <p className="text-slate-400 text-xs sm:text-sm font-medium uppercase tracking-widest mt-3">
                                CREDENCE transforms real financial activity into an explainable financial credibility profile for people and businesses with limited traditional credit visibility.
                            </p>
                            <div className="flex items-center justify-center gap-4 mt-6">
                                <button
                                    onClick={handleTryNow}
                                    className="px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest bg-white text-black hover:bg-slate-200 transition-all active:scale-95 shadow-lg shadow-white/10 flex items-center gap-2"
                                >
                                    <span>BUILD YOUR CREDENCE</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                                <a
                                    href="#story-grid"
                                    className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white border border-white/10 hover:border-white/30 transition-colors"
                                >
                                    SEE HOW IT WORKS
                                </a>
                            </div>
                        </div>

                        <div id="story-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* 01 — THE GAP */}
                            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-rose-950/20 to-zinc-950/60 border border-rose-500/20 backdrop-blur-xl relative overflow-hidden group hover:border-rose-500/40 transition-all">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black font-outfit tracking-widest text-rose-400 uppercase bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                                            01 — THE GAP
                                        </span>
                                        <span className="text-[10px] font-mono text-rose-300/70 uppercase">CIBIL: -1</span>
                                    </div>
                                    <h3 className="text-xl font-poppins font-black text-white uppercase italic tracking-tight">
                                        Financial activity can exist without a complete credit identity.
                                    </h3>
                                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                        Over 600 million micro-entrepreneurs, Mandi stall operators, and informal businesses conduct active daily trade. Traditional credit bureaus discard them because they lack credit cards or collateral.
                                    </p>
                                </div>
                            </div>

                            {/* 02 — THE EVIDENCE */}
                            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-amber-950/20 to-zinc-950/60 border border-amber-500/20 backdrop-blur-xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black font-outfit tracking-widest text-amber-400 uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                                            02 — THE EVIDENCE
                                        </span>
                                        <span className="text-[10px] font-mono text-amber-300/70 uppercase">SIGNALS FOUND</span>
                                    </div>
                                    <h3 className="text-xl font-poppins font-black text-white uppercase italic tracking-tight">
                                        Income patterns, payments, transactions and continuity provide signals.
                                    </h3>
                                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                        Every APMC auction slip, QR settlement, freight voucher, and electricity bill represents verifiable proof of economic activity and solvent responsibility.
                                    </p>
                                </div>
                            </div>

                            {/* 03 — THE INTELLIGENCE */}
                            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-indigo-950/20 to-zinc-950/60 border border-indigo-500/20 backdrop-blur-xl relative overflow-hidden group hover:border-indigo-500/40 transition-all">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black font-outfit tracking-widest text-indigo-400 uppercase bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                                            03 — THE INTELLIGENCE
                                        </span>
                                        <span className="text-[10px] font-mono text-indigo-300/70 uppercase">NORMALIZATION</span>
                                    </div>
                                    <h3 className="text-xl font-poppins font-black text-white uppercase italic tracking-tight">
                                        CREDENCE transforms these signals into an explainable profile.
                                    </h3>
                                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                        Deterministic behavioural models evaluate Cash Flow Stability, Payment Consistency, Financial Continuity, Financial Activity, and Evidence Quality without opaque black boxes.
                                    </p>
                                </div>
                            </div>

                            {/* 04 — THE SCORE */}
                            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-emerald-950/20 to-zinc-950/60 border border-emerald-500/20 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black font-outfit tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                            04 — THE SCORE
                                        </span>
                                        <span className="text-[10px] font-mono text-emerald-300/70 uppercase">300–900 SCALE</span>
                                    </div>
                                    <h3 className="text-xl font-poppins font-black text-white uppercase italic tracking-tight">
                                        CREDENCE Score summarizes the available financial evidence.
                                    </h3>
                                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                        A standardized 300–900 credit credibility benchmark (e.g. 742 / 900, STRONG) separated from Confidence (HIGH/MODERATE/LOW) so data breadth is transparently isolated from behaviour.
                                    </p>
                                </div>
                            </div>

                            {/* 05 — THE EXPLANATION */}
                            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-sky-950/20 to-zinc-950/60 border border-sky-500/20 backdrop-blur-xl relative overflow-hidden group hover:border-sky-500/40 transition-all">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black font-outfit tracking-widest text-sky-400 uppercase bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
                                            05 — THE EXPLANATION
                                        </span>
                                        <span className="text-[10px] font-mono text-sky-300/70 uppercase">AUDITABLE PROOF</span>
                                    </div>
                                    <h3 className="text-xl font-poppins font-black text-white uppercase italic tracking-tight">
                                        Every score can be traced back to supporting evidence.
                                    </h3>
                                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                        Click "Why This Score?" to explore each weighted contributor (+84, +79, +82, +76, +88), longitudinal continuity breaks, and unobserved evidence gaps.
                                    </p>
                                </div>
                            </div>

                            {/* 06 — THE CONVERSATION */}
                            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-violet-950/20 to-zinc-950/60 border border-violet-500/20 backdrop-blur-xl relative overflow-hidden group hover:border-violet-500/40 transition-all">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black font-outfit tracking-widest text-violet-400 uppercase bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
                                            06 — THE CONVERSATION
                                        </span>
                                        <span className="text-[10px] font-mono text-violet-300/70 uppercase">FINANCIAL GUIDE</span>
                                    </div>
                                    <h3 className="text-xl font-poppins font-black text-white uppercase italic tracking-tight">
                                        Ask the CREDENCE Financial Guide why your score looks the way it does.
                                    </h3>
                                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                        Direct conversational voice agent queries backend scoring ground truth. Ask "Why is my score 742?" or "How can I improve?" without hallucinations or false promises.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Glowing Grid Section: INTELLIGENCE ARCHITECTURE */}
                    <div className="mb-40">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 font-outfit">
                                SYSTEM TOPOLOGY
                            </span>
                            <h2 className="text-3xl md:text-5xl font-poppins font-black text-white italic uppercase tracking-tighter mt-2">
                                Credence Intelligence Architecture
                            </h2>
                            <p className="text-slate-400 text-xs sm:text-sm font-medium uppercase tracking-widest mt-2">
                                5 core architectural modules translating real-world behaviour into institutional trust
                            </p>
                        </motion.div>

                        <motion.ul
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={{
                                hidden: { opacity: 0 },
                                show: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.15
                                    }
                                }
                            }}
                            className="grid grid-cols-1 gap-6 md:grid-cols-12 lg:gap-8 auto-rows-fr"
                        >
                            <GridItem
                                area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
                                icon={<Activity className="h-6 w-6 text-indigo-400" />}
                                title="Financial Signal Fusion"
                                description="SOURCE → SIGNAL → BEHAVIOUR. Normalizes disparate UPI QR settlements, APMC wholesale auction slips, and utility outlays into continuous telemetry."
                            />
                            <GridItem
                                area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
                                icon={<TrendingUp className="h-6 w-6 text-emerald-400" />}
                                title="Behavioural Intelligence"
                                description="SIGNAL → OBSERVATION → RELEVANT UNDERSTANDING. Computes Cash Flow Stability, Payment Consistency, Working Capital Buffer, and Expense Burden with verified commercial clarity."
                            />
                            <GridItem
                                area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
                                icon={<ShieldCheck className="h-6 w-6 text-rose-400" />}
                                title="Credence Understanding Graph"
                                description="USER → SOURCES → RECORDS → SIGNALS → PATTERNS → IDENTITY. Complete interactive graph mapping every high-level score claim back to source receipts."
                            />
                            <GridItem
                                area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
                                icon={<Fingerprint className="h-6 w-6 text-amber-400" />}
                                title="Financial Continuity Index"
                                description="UNDERSTAND BEHAVIOUR OVER TIME. Measures whether financial activity demonstrates continuity across observation periods. Identifies recurring patterns and neutral breaks without artificial assumptions."
                            />
                            <GridItem
                                area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
                                icon={<FileSearch className="h-6 w-6 text-sky-400" />}
                                title="Trust Layer & Explainability"
                                description="WHY THIS RESULT? 4-level deep proof decomposition, verification tier governance, audit completeness, and SHA-256 cryptographic verification."
                            />
                        </motion.ul>
                    </div>

                    {/* Final CTA Section */}
                    <div className="text-center py-20 relative overflow-hidden rounded-[4rem] bg-gradient-to-b from-indigo-600/20 to-transparent border border-indigo-500/10 mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono uppercase tracking-widest mb-6">
                                CANONICAL PROFILE: SAI CHARAN • APMC MANDI STALL #42
                            </div>
                            <h2 className="text-4xl md:text-6xl font-poppins font-black text-white italic uppercase tracking-tighter mb-6">
                                BEYOND THE CREDIT FILE.
                            </h2>
                            <p className="text-slate-400 text-base sm:text-lg font-medium max-w-2xl mx-auto mb-10 uppercase tracking-widest leading-relaxed italic">
                                TURN INVISIBLE FINANCIAL BEHAVIOUR INTO VERIFIABLE CREDIBILITY.
                            </p>

                            <button
                                onClick={handleTryNow}
                                className="group relative inline-flex items-center gap-4 bg-white text-black px-10 py-5 rounded-full font-black text-xl uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10"
                            >
                                LAUNCH CREDENCE CONSOLE
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />

                                <div className="absolute inset-0 -z-10 bg-white/20 blur-2xl rounded-full scale-125 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </button>
                        </motion.div>
                    </div>
                </div>

                {/* Footer Decor */}
                <div className="mt-40 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black tracking-[0.5em] text-slate-600 uppercase italic">
                    <div>© 2026 CREDENCE</div>
                    <div className="flex gap-10">
                        <span className="hover:text-white cursor-pointer transition-colors">Page1</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Page2</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Page3</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface GridItemProps {
    area: string;
    icon: React.ReactNode;
    title: string;
    description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
    return (
        <motion.li
            variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className={cn("min-h-[14rem] list-none", area)}
        >
            <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-white/10 p-2 md:rounded-[1.5rem] md:p-3 group">
                <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    borderWidth={3}
                />
                <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] border-white/5 bg-zinc-900/50 p-6 shadow-sm md:p-6 backdrop-blur-sm transition-transform duration-500 group-hover:translate-y-[-4px]">
                    <div className="relative flex flex-1 flex-col justify-between gap-3">
                        <div className="w-fit rounded-lg border-[0.75px] border-white/10 bg-white/5 p-3 group-hover:scale-110 transition-transform bg-gradient-to-br from-white/10 to-transparent">
                            {icon}
                        </div>
                        <div className="space-y-3">
                            <h3 className="pt-0.5 text-lg leading-[1.375rem] font-black font-poppins italic tracking-tight uppercase text-white">
                                {title}
                            </h3>
                            <p className="font-inter text-[13px] leading-[1.125rem] md:text-[14px] md:leading-[1.375rem] text-slate-400 italic uppercase tracking-wider">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.li>
    );
};

export default LandingPage;
