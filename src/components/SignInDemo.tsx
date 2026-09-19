import { SignInPage, type Testimonial } from "@/components/ui/sign-in";
import { auth } from "@/lib/firebase";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { motion } from "framer-motion";

const sampleTestimonials: Testimonial[] = [
    {
        avatarSrc: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        name: "Sunita Sharma",
        handle: "@sunita_retail",
        text: "Without a formal credit score, banks rejected our working capital requests for years. CREDENCE verified our daily UPI cash flows in 48 hours."
    },
    {
        avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        name: "Rajesh Kulkarni",
        handle: "@rajesh_logistics",
        text: "As a fleet driver, my income spans multiple delivery platforms. CREDENCE turned my transaction consistency into verified evidence lenders trusted."
    },
    {
        avatarSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        name: "Anand Verma",
        handle: "@verma_dairy",
        text: "The Evidence Vault made our utility payments and recurring supplier invoice history transparent. We secured growth financing on our actual merit."
    },
];

const SignInPageDemo = () => {
    const navigate = useNavigate();
    const { user, signInAsGuest } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isSigningIn, setIsSigningIn] = useState(false);

    // Single source of truth for redirection
    useEffect(() => {
        if (user) {
            console.log("User detected, redirecting to dashboard...");
            navigate("/dashboard");
        }
    }, [user, navigate]);

    const handleGuestSignIn = () => {
        signInAsGuest();
        navigate("/dashboard");
    };

    const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isSigningIn) return;

        setError(null);
        setIsSigningIn(true);
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            setError(err.message);
            console.error("Sign In Error:", err);
            setIsSigningIn(false);
        }
    };

    const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isSigningIn) return;

        setError(null);
        setIsSigningIn(true);
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            setIsSigningIn(false);
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            setError(err.message);
            console.error("Sign Up Error:", err);
            setIsSigningIn(false);
        }
    };

    const handleGoogleSignIn = async () => {
        if (isSigningIn) return;

        setError(null);
        setIsSigningIn(true);
        console.log("Initiating Google Sign-In Popup...");

        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        try {
            const result = await signInWithPopup(auth, provider);
            console.log("Google Auth Success:", result.user.email);
        } catch (err: any) {
            console.error("Google Auth Error:", err);
            if (err.code === 'auth/popup-closed-by-user') {
                setError("The sign-in popup was closed before completion. Please try again.");
            } else if (err.code === 'auth/cancelled-popup-request') {
                setError("Only one sign-in attempt allowed at a time.");
            } else {
                setError(err.message);
            }
            setIsSigningIn(false);
        }
    };

    const handleResetPassword = async () => {
        const email = prompt("Please enter your email address to reset password:");
        if (email) {
            try {
                await sendPasswordResetEmail(auth, email);
                alert("Password reset email sent!");
            } catch (err: any) {
                console.error("Reset Password Error:", err);
                alert(`Error: ${err.message}`);
            }
        }
    }

    return (
        <div className="bg-background text-foreground min-h-screen overflow-x-hidden">
            <SignInPage
                heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
                testimonials={sampleTestimonials}
                onSignIn={handleSignIn}
                onSignUp={handleSignUp}
                onGoogleSignIn={handleGoogleSignIn}
                onResetPassword={handleResetPassword}
                onGuestSignIn={handleGuestSignIn}
                isLoading={isSigningIn}
            />
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-rose-500 text-white rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-xl max-w-[90vw] w-max"
                >
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse shrink-0" />
                    <span className="text-xs font-black uppercase tracking-widest truncate">{error}</span>
                </motion.div>
            )}
        </div>
    );
};

export default SignInPageDemo;
