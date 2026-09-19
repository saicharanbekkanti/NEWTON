import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as fbSignOut, type User } from 'firebase/auth';
import { auth } from './firebase';

export interface DemoUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    isDemo?: boolean;
}

export type AppUser = User | DemoUser;

interface AuthContextType {
    user: AppUser | null;
    loading: boolean;
    signInAsGuest: () => void;
    logout: () => Promise<void>;
}

const DEMO_GUEST_USER: DemoUser = {
    uid: 'demo_user_credence',
    email: 'analyst@credence.ai',
    displayName: 'Credence Analyst (Demo)',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isDemo: true
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signInAsGuest: () => { },
    logout: async () => { }
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AppUser | null>(() => {
        try {
            if (typeof window !== 'undefined' && localStorage.getItem('credence_demo_mode') === 'true') {
                return DEMO_GUEST_USER;
            }
        } catch {
            // ignore
        }
        return null;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                try {
                    localStorage.removeItem('credence_demo_mode');
                } catch {
                    // ignore
                }
            } else {
                try {
                    if (localStorage.getItem('credence_demo_mode') === 'true') {
                        setUser(DEMO_GUEST_USER);
                    } else {
                        setUser(null);
                    }
                } catch {
                    setUser(null);
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInAsGuest = () => {
        try {
            localStorage.setItem('credence_demo_mode', 'true');
        } catch {
            // ignore
        }
        setUser(DEMO_GUEST_USER);
    };

    const logout = async () => {
        try {
            localStorage.removeItem('credence_demo_mode');
        } catch {
            // ignore
        }
        setUser(null);
        try {
            await fbSignOut(auth);
        } catch {
            // ignore
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInAsGuest, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
