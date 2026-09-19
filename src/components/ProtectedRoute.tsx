import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-slate-950 text-white">
                <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Verifying Credence Security</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
