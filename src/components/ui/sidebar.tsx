import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    LogOut,
    LayoutDashboard,
    Layers,
    UploadCloud,
    Menu,
    X,
    User as UserIcon,
    Zap,
    Bot,
    Sun,
    Moon,
    ChevronLeft,
    History,
    ShieldCheck
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useTheme } from "@/lib/ThemeContext";
import { cn } from "@/lib/utils";

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isCollapsed?: boolean;
    setIsCollapsed?: (collapsed: boolean) => void;
}

const AnimatedMenuToggle = ({
    toggle,
    isOpen,
}: {
    toggle: () => void;
    isOpen: boolean;
}) => (
    <button
        onClick={toggle}
        aria-label="Toggle menu"
        className="focus:outline-none z-[100] p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 lg:hidden"
    >
        {isOpen ? <X className="w-5 h-5 text-slate-600 dark:text-slate-400" /> : <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
    </button>
);

const Sidebar = ({ activeTab, setActiveTab, isCollapsed = false, setIsCollapsed = () => { } }: SidebarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            navigate('/', { replace: true });
            await logout();
        } catch (error) {
            console.error("Logout error:", error);
            window.location.href = '/';
        }
    };

    const menuItems = [
        { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
        { id: 'score', label: 'CREDENCE Score', icon: <ShieldCheck className="w-5 h-5 text-indigo-400" />, path: '/dashboard?tab=score' },
        { id: 'reports', label: 'Financial Identity', icon: <Layers className="w-5 h-5" />, path: '/dashboard?tab=reports' },
        { id: 'insights', label: 'Evidence Intelligence', icon: <Zap className="w-5 h-5 font-bold" />, path: '/insights' },
        { id: 'continuity', label: 'Score Evolution', icon: <History className="w-5 h-5" />, path: '/dashboard?tab=continuity' },
        { id: 'upload', label: 'Data Sources', icon: <UploadCloud className="w-5 h-5" />, path: '/dashboard?tab=upload' },
        { id: 'chat', label: 'Financial Guide', icon: <Bot className="w-5 h-5" />, path: '/chat' },
    ];

    const currentPath = location.pathname;

    const handleNav = (item: any) => {
        const [targetPath, queryString] = item.path.split('?');
        const targetSearch = queryString ? `?${queryString}` : '';
        if (currentPath !== targetPath || location.search !== targetSearch) {
            navigate(item.path);
        }
        setActiveTab(item.id);
        setIsOpen(false);
    };

    const mobileSidebarVariants = {
        hidden: { x: "-100%", opacity: 0 },
        visible: { x: 0, opacity: 1 },
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <div className="lg:hidden fixed top-4 right-4 z-[100]">
                <AnimatedMenuToggle toggle={() => setIsOpen(!isOpen)} isOpen={isOpen} />
            </div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={mobileSidebarVariants}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 shadow-2xl flex flex-col"
                        >
                            <SidebarContent
                                user={user}
                                activeTab={activeTab}
                                onNav={handleNav}
                                menuItems={menuItems}
                                onLogout={handleLogout}
                                theme={theme}
                                setTheme={setTheme}
                                isCollapsed={false}
                                setIsCollapsed={() => { }}
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <motion.div
                animate={{ width: isCollapsed ? 80 : 256 }}
                className="hidden lg:flex flex-col fixed top-0 left-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-sm z-30 transition-all duration-300"
            >
                <SidebarContent
                    user={user}
                    activeTab={activeTab}
                    onNav={handleNav}
                    menuItems={menuItems}
                    onLogout={handleLogout}
                    theme={theme}
                    setTheme={setTheme}
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                />
            </motion.div>
        </>
    );
};

const SidebarContent = ({ user, activeTab, onNav, menuItems, onLogout, theme, setTheme, isCollapsed, setIsCollapsed }: {
    user: any;
    activeTab: string;
    onNav: (item: any) => void;
    menuItems: any[];
    onLogout: () => void;
    theme: string;
    setTheme: (theme: any) => void;
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
}) => (
    <div className="flex flex-col h-full py-6">
        {/* Profile Section */}
        <div className="px-4 mb-8">
            <div className={cn(
                "flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm transition-all duration-300",
                isCollapsed ? "justify-center px-2" : ""
            )}>
                {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full ring-2 ring-indigo-500/10" />
                ) : (
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 shadow-inner flex-shrink-0">
                        <UserIcon className="w-5 h-5" />
                    </div>
                )}
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="min-w-0 pr-2"
                    >
                        <p className="font-outfit font-black text-slate-900 dark:text-white truncate text-xs tracking-tight">{user?.displayName || 'Credence User'}</p>
                        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 truncate uppercase tracking-widest">{user?.email ? 'PRO ACCOUNT' : 'GUEST'}</p>
                    </motion.div>
                )}
            </div>
        </div>

        {/* Brand Section */}
        <div className={cn(
            "px-6 mb-8 pb-4 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between",
            isCollapsed ? "justify-center px-2" : ""
        )}>
            {!isCollapsed && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                >
                    <span className="font-outfit font-black text-xl tracking-tighter text-slate-900 dark:text-white uppercase">
                        CRED<span className="text-indigo-600 dark:text-indigo-400">ENCE</span>
                    </span>
                </motion.div>
            )}

            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={cn(
                    "p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400 dark:text-slate-500 hidden lg:block",
                    isCollapsed ? "mx-auto" : ""
                )}
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
                {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
            {menuItems.map((item: any) => (
                <button
                    key={item.id}
                    onClick={() => onNav(item)}
                    className={cn(
                        "flex items-center gap-4 w-full px-4 py-4 rounded-2xl transition-all font-black uppercase tracking-widest text-[10px]",
                        isCollapsed ? "justify-center" : "",
                        activeTab === item.id
                            ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xl"
                            : "text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                    title={isCollapsed ? item.label : ""}
                >
                    <span className={cn(
                        "flex-shrink-0",
                        activeTab === item.id ? "text-indigo-400 dark:text-indigo-600" : ""
                    )}>{item.icon}</span>
                    {!isCollapsed && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            {item.label}
                        </motion.span>
                    )}
                </button>
            ))}
        </nav>

        {/* Footer / Theme / Sign Out */}
        <div className="px-3 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={cn(
                    "flex items-center gap-4 w-full px-4 py-4 rounded-2xl transition-all font-black uppercase tracking-widest text-[10px] text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800",
                    isCollapsed ? "justify-center" : ""
                )}
                title="Toggle Theme"
            >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                {!isCollapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{theme === 'dark' ? 'Light' : 'Dark'} Mode</motion.span>}
            </button>

            <button
                onClick={onLogout}
                className={cn(
                    "flex items-center gap-4 w-full px-4 py-4 rounded-2xl text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all font-black uppercase tracking-widest text-[10px]",
                    isCollapsed ? "justify-center" : ""
                )}
                title="Sign Out"
            >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Sign Out</motion.span>}
            </button>
        </div>
    </div>
);

export { Sidebar };
