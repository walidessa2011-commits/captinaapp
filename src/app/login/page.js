"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Mail, Lock, Phone, ArrowRight, ShieldCheck, Globe, Fingerprint, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Login() {
    const { t, language } = useApp();
    const router = useRouter();
    const [loginMethod, setLoginMethod] = useState('phone'); // 'phone', 'google', 'email'
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailLogin = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/');
        } catch (error) {
            console.error("Login error:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user exists in Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            
            if (!userDoc.exists()) {
                // If not, create a profile
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    fullName: user.displayName || '',
                    email: user.email,
                    photoURL: user.photoURL || '',
                    role: 'user',
                    createdAt: serverTimestamp(),
                    phone: user.phoneNumber || ''
                });
            }

            // Redirect to home
            router.push('/');
        } catch (error) {
            console.error("Google login error:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#001f3f] relative overflow-hidden font-sans">
            {/* Ambient Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-primary/10 blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary-light/5 blur-[100px] animate-pulse delay-1000"></div>
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }}></div>
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-[1000px] w-full min-h-[500px] md:min-h-[600px] flex flex-col md:flex-row bg-white/5 backdrop-blur-2xl rounded-[2.5rem] md:rounded-[3rem] border border-white/10 overflow-hidden relative z-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
            >
                {/* Visual Section - Left (Desktop) */}
                <div className="hidden md:flex md:w-5/12 relative overflow-hidden bg-gradient-to-br from-[#001f3f] to-primary/40 p-12 flex-col justify-between">
                    <div className="relative z-10">
                        <motion.div 
                            variants={itemVariants}
                            className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 mb-8"
                        >
                            <Globe className="w-8 h-8 text-white" />
                        </motion.div>
                        <motion.h2 variants={itemVariants} className="text-4xl font-black text-white leading-tight mb-4">
                            {t('joinElite')}
                        </motion.h2>
                        <motion.p variants={itemVariants} className="text-white/60 font-medium text-lg">
                            {t('joinEliteDesc')}
                        </motion.p>
                    </div>

                    <div className="relative z-10">
                        <div className="flex -space-x-reverse space-x-3 mb-4">
                            {[1, 2, 3, 4].map(i => (
                                <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-10 h-10 rounded-full border-2 border-white/20" alt="user" />
                            ))}
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-black border-2 border-white/20">
                                +50K
                            </div>
                        </div>
                        <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{language === 'ar' ? 'انضم للمحترفين اليوم' : 'Join the pros today'}</p>
                    </div>

                    {/* Decorative bits */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                </div>

                {/* Form Section - Right */}
                <div className="w-full md:w-7/12 bg-white flex flex-col p-6 md:p-12 relative">
                    <div className="mb-6 md:mb-8 text-start">
                        <motion.h1 variants={itemVariants} className="text-2xl md:text-5xl font-black text-[#001f3f] mb-1 md:mb-2 tracking-tight">
                            {t('login')}
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-xs md:text-base text-gray-400 font-bold">
                            {language === 'ar' ? 'أهلاً بك في كابتينا، ابدأ رحلتك الآن' : 'Welcome to Captina, start your journey now'}
                        </motion.p>
                    </div>

                    {/* Login Method Toggle */}
                    <div className="flex bg-gray-50 p-1 rounded-2xl mb-6 md:mb-8">
                        <button 
                            onClick={() => setLoginMethod('phone')}
                            className={`flex-1 py-2.5 md:py-3 rounded-xl font-black text-xs md:text-sm transition-all ${loginMethod === 'phone' ? 'bg-[#001f3f] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {language === 'ar' ? 'رقم الجوال' : 'Phone'}
                        </button>
                        <button 
                            onClick={() => setLoginMethod('email')}
                            className={`flex-1 py-2.5 md:py-3 rounded-xl font-black text-xs md:text-sm transition-all ${loginMethod === 'email' ? 'bg-[#001f3f] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                             {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                        </button>
                    </div>

                    <div className="space-y-4 md:space-y-6 flex-grow">
                        <AnimatePresence mode="wait">
                            {loginMethod === 'phone' ? (
                                <motion.div
                                    key="phone"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">{t('phone')}</label>
                                        <div className="relative group">
                                            <div className={`absolute ${language === 'en' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-gray-200 pr-3 md:pr-4`}>
                                                <img src="https://flagcdn.com/w20/sa.png" width="18" className="md:w-5" alt="SA" />
                                                <span className="font-black text-[#001f3f] text-xs md:text-sm">+966</span>
                                            </div>
                                            <input
                                                type="tel"
                                                className={`w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-3.5 md:py-4 ${language === 'en' ? 'pl-24 pr-5' : 'pr-24 pl-5'} focus:border-primary focus:bg-white outline-none transition-all font-black text-[#001f3f] text-sm md:text-base`}
                                                placeholder={t('phonePlaceholder')}
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => router.push('/')}
                                        className="w-full bg-[#001f3f] text-white font-black py-3.5 md:py-4 rounded-2xl shadow-xl shadow-blue-900/10 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-base md:text-lg group"
                                    >
                                        {language === 'ar' ? 'أرسل رمز التحقق' : 'Send Code'}
                                        <ChevronLeft className={`w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform ${language === 'en' ? 'rotate-180' : ''}`} />
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="email"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <form onSubmit={handleEmailLogin} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">{t('email')}</label>
                                            <div className="relative group">
                                                <input
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-3.5 md:py-4 px-5 md:px-6 focus:border-primary focus:bg-white outline-none transition-all font-black text-[#001f3f] text-sm md:text-base"
                                                    placeholder="mail@example.com"
                                                />
                                                <Mail className={`absolute ${language === 'en' ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-300 group-focus-within:text-primary transition-colors`} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between px-2">
                                                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">{t('password')}</label>
                                                <Link href="#" className="text-[9px] md:text-[10px] font-black text-primary hover:underline">{t('forgotPassword')}</Link>
                                            </div>
                                            <div className="relative group">
                                                <input
                                                    type="password"
                                                    required
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-3.5 md:py-4 px-5 md:px-6 focus:border-primary focus:bg-white outline-none transition-all font-black text-[#001f3f] text-sm md:text-base"
                                                    placeholder="••••••••"
                                                />
                                                <Lock className={`absolute ${language === 'en' ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-300 group-focus-within:text-primary transition-colors`} />
                                            </div>
                                        </div>
                                        <button 
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-[#001f3f] text-white font-black py-3.5 md:py-4 rounded-2xl shadow-xl shadow-blue-900/10 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-base md:text-lg group disabled:opacity-50"
                                        >
                                            {loading ? (language === 'ar' ? 'جاري التحميل...' : 'Loading...') : t('loginToAccount')}
                                            {!loading && <ChevronLeft className={`w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform ${language === 'en' ? 'rotate-180' : ''}`} />}
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative pt-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase">
                                <span className="bg-white px-4 text-gray-400 font-black tracking-widest">{t('orVia')}</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button 
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-3 border-2 border-gray-50 bg-gray-50/50 py-3.5 md:py-4 rounded-2xl font-black text-[#001f3f] hover:bg-white hover:border-gray-200 hover:shadow-lg transition-all active:scale-95 group disabled:opacity-50"
                            >
                                <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                    <path fill="#EA4335" d="M12 5.04c1.9 0 3.53.64 4.87 1.89l3.6-3.6C18.18 1.34 15.36 0 12 0 7.31 0 3.25 2.69 1.19 6.6l4.12 3.19c.98-2.93 3.73-5.04 6.69-5.04z" />
                                    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.89 3c2.28-2.1 3.53-5.2 3.53-8.82z" />
                                    <path fill="#FBBC05" d="M5.31 14.41c-.24-.7-.38-1.44-.38-2.21s.14-1.51.38-2.21L1.19 6.8c-.81 1.62-1.28 3.45-1.28 5.4 0 1.95.47 3.78 1.28 5.4l4.12-3.19z" />
                                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.89-3c-1.11.75-2.53 1.19-4.04 1.19-2.96 0-5.46-2.11-6.36-4.94L1.57 17.5C3.73 21.42 7.55 24 12 24z" />
                                </svg>
                                <span className="text-sm">{t('loginWithGoogle')}</span>
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-gray-400 mt-8 font-bold text-sm">
                        {t('dontHaveAccount')} <Link href="/register" className="text-primary font-black hover:underline underline-offset-4">{t('joinUsNow')}</Link>
                    </p>
                </div>
            </motion.div>

            {/* Language Switcher Link */}
            <div className="absolute top-8 right-8 z-20">
                <Link href="/" className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-white border border-white/20 text-xs font-black shadow-xl">
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
