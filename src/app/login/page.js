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
    const { t, language, darkMode } = useApp();
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
        <div className={`min-h-[100dvh] flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-[#0A0E17] text-white' : 'bg-slate-50 text-gray-900'} ${language === 'ar' ? 'font-arabic' : ''}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Image with Immersive Effect */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1541534741688-6078c64b52d3?q=80&w=1000" 
                    alt="" 
                    className={`w-full h-full object-cover transition-opacity duration-500 ${darkMode ? 'opacity-40 grayscale-[20%]' : 'opacity-30'}`}
                />
                <div className={`absolute inset-0 transition-colors duration-500 bg-gradient-to-b ${darkMode ? 'from-[#0A0E17]/80 via-transparent to-[#0A0E17]' : 'from-white/80 via-transparent to-slate-50'}`}></div>
            </div>

            {/* Back Button Overlay */}
            <div className="absolute top-8 left-8 z-30">
                <button 
                    onClick={() => router.push('/intro')}
                    className={`flex items-center gap-2 transition-all font-bold text-xs backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 ${darkMode ? 'text-white/60 bg-white/5 hover:text-white' : 'text-gray-500 bg-black/5 hover:text-gray-900'}`}
                >
                    <ChevronLeft className={`w-4 h-4 ${language === 'en' ? '' : 'rotate-180'}`} />
                    {language === 'ar' ? 'الرجوع' : 'Back'}
                </button>
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full max-w-md relative z-10 flex flex-col gap-6"
            >
                {/* Logo and Welcome */}
                <div className="text-center space-y-4">
                    <motion.div 
                        variants={itemVariants}
                        className={`inline-flex items-center gap-2.5 backdrop-blur-lg p-1 pr-3.5 rounded-xl border border-white/10 mx-auto transition-colors ${darkMode ? 'bg-black/30' : 'bg-white/40'}`}
                    >
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10">
                            <img src="/logo_captina.jpg" alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-black text-xs tracking-wider uppercase text-[#E51B24]">Captina</span>
                    </motion.div>
                    
                    <div className="space-y-1">
                        <motion.h1 variants={itemVariants} className={`text-3xl font-black transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {t('login')}
                        </motion.h1>
                        <motion.p variants={itemVariants} className={`text-xs font-bold px-4 transition-colors ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
                            {language === 'ar' ? 'أهلاً بك في كابتينا، سجل دخولك للبدء' : 'Welcome to Captina, log in to start'}
                        </motion.p>
                    </div>
                </div>

                {/* Glass Content Card */}
                <motion.div
                    variants={itemVariants}
                    className={`w-full backdrop-blur-[25px] border rounded-[2rem] py-6 px-6 shadow-2xl relative overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-black/5'}`}
                >
                    {/* Decorative Background Glow */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#E51B24]/10 blur-3xl rounded-full"></div>
                    
                    <div className="flex flex-col gap-5 relative z-10">
                        {/* Login Method Toggle */}
                        <div className={`flex p-1 rounded-xl transition-colors ${darkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                            <button 
                                onClick={() => setLoginMethod('phone')}
                                className={`flex-1 py-2.5 rounded-lg font-black text-xs transition-all ${loginMethod === 'phone' ? 'bg-[#E51B24] text-white shadow-md' : (darkMode ? 'text-white/40 hover:text-white/60' : 'text-gray-400 hover:text-gray-600')}`}
                            >
                                {language === 'ar' ? 'الجوال' : 'Phone'}
                            </button>
                            <button 
                                onClick={() => setLoginMethod('email')}
                                className={`flex-1 py-2.5 rounded-lg font-black text-xs transition-all ${loginMethod === 'email' ? 'bg-[#E51B24] text-white shadow-md' : (darkMode ? 'text-white/40 hover:text-white/60' : 'text-gray-400 hover:text-gray-600')}`}
                            >
                                 {language === 'ar' ? 'الإيميل' : 'Email'}
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {loginMethod === 'phone' ? (
                                <motion.div
                                    key="phone"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <label className={`text-[10px] font-black uppercase tracking-widest px-2 ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>{t('phone')}</label>
                                        <div className="relative group">
                                            <div className={`absolute ${language === 'en' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 flex items-center gap-2 border-r pr-3 ${darkMode ? 'border-white/10' : 'border-black/5'}`}>
                                                <img src="https://flagcdn.com/w20/sa.png" width="18" alt="SA" />
                                                <span className={`font-black text-xs ${darkMode ? 'text-white' : 'text-gray-900'}`}>+966</span>
                                            </div>
                                            <input
                                                type="tel"
                                                className={`w-full border rounded-xl py-3.5 ${language === 'en' ? 'pl-24 pr-5' : 'pr-24 pl-5'} focus:border-[#E51B24] outline-none transition-all font-black text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white focus:bg-white/10' : 'bg-black/5 border-black/5 text-gray-900 focus:bg-black/10'}`}
                                                placeholder={t('phonePlaceholder')}
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => router.push('/')}
                                        className="w-full bg-[#E51B24] text-white font-black py-4 rounded-xl shadow-lg shadow-[#E51B24]/20 hover:bg-[#ff1f2d] active:scale-95 transition-all flex items-center justify-center gap-3 text-sm"
                                    >
                                        {language === 'ar' ? 'أرسل رمز التحقق' : 'Send Code'}
                                        <ArrowRight className={`w-4 h-4 ${language === 'en' ? '' : 'rotate-180'}`} />
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="email"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="space-y-4"
                                >
                                    <form onSubmit={handleEmailLogin} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className={`text-[10px] font-black uppercase tracking-widest px-2 ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>{t('email')}</label>
                                            <div className="relative group">
                                                <input
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className={`w-full border rounded-xl py-3.5 px-5 md:px-6 focus:border-[#E51B24] outline-none transition-all font-black text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white focus:bg-white/10' : 'bg-black/5 border-black/5 text-gray-900 focus:bg-black/10'}`}
                                                    placeholder="mail@example.com"
                                                />
                                                <Mail className={`absolute ${language === 'en' ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${darkMode ? 'text-white/20 group-focus-within:text-[#E51B24]' : 'text-gray-400 group-focus-within:text-[#E51B24]'}`} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between px-2">
                                                <label className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>{t('password')}</label>
                                                <Link href="#" className="text-[10px] font-black text-[#E51B24] hover:underline">{t('forgotPassword')}</Link>
                                            </div>
                                            <div className="relative group">
                                                <input
                                                    type="password"
                                                    required
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className={`w-full border rounded-xl py-3.5 px-5 md:px-6 focus:border-[#E51B24] outline-none transition-all font-black text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white focus:bg-white/10' : 'bg-black/5 border-black/5 text-gray-900 focus:bg-black/10'}`}
                                                    placeholder="••••••••"
                                                />
                                                <Lock className={`absolute ${language === 'en' ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${darkMode ? 'text-white/20 group-focus-within:text-[#E51B24]' : 'text-gray-400 group-focus-within:text-[#E51B24]'}`} />
                                            </div>
                                        </div>
                                        <button 
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-[#E51B24] text-white font-black py-4 rounded-xl shadow-lg shadow-[#E51B24]/20 hover:bg-[#ff1f2d] active:scale-95 transition-all flex items-center justify-center gap-3 text-sm disabled:opacity-50"
                                        >
                                            {loading ? (language === 'ar' ? 'جاري التحميل...' : 'Loading...') : t('loginToAccount')}
                                            {!loading && <ArrowRight className={`w-4 h-4 ${language === 'en' ? '' : 'rotate-180'}`} />}
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative pt-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className={`w-full border-t ${darkMode ? 'border-white/10' : 'border-black/5'}`}></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase">
                                <span className={`backdrop-blur-md px-4 font-black tracking-widest transition-colors ${darkMode ? 'bg-[#0A0E17]/50 text-white/30' : 'bg-white/50 text-gray-400'}`}>{t('orVia')}</span>
                            </div>
                        </div>

                        <button 
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className={`w-full flex items-center justify-center gap-3 border py-3.5 rounded-xl font-black transition-all active:scale-95 disabled:opacity-50 ${darkMode ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-black/5 border-black/5 text-gray-900 hover:bg-black/10'}`}
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M12 5.04c1.9 0 3.53.64 4.87 1.89l3.6-3.6C18.18 1.34 15.36 0 12 0 7.31 0 3.25 2.69 1.19 6.6l4.12 3.19c.98-2.93 3.73-5.04 6.69-5.04z" />
                                <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.89 3c2.28-2.1 3.53-5.2 3.53-8.82z" />
                                <path fill="#FBBC05" d="M5.31 14.41c-.24-.7-.38-1.44-.38-2.21s.14-1.51.38-2.21L1.19 6.8c-.81 1.62-1.28 3.45-1.28 5.4 0 1.95.47 3.78 1.28 5.4l4.12-3.19z" />
                                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.89-3c-1.11.75-2.53 1.19-4.04 1.19-2.96 0-5.46-2.11-6.36-4.94L1.57 17.5C3.73 21.42 7.55 24 12 24z" />
                            </svg>
                            <span className="text-xs">{t('loginWithGoogle')}</span>
                        </button>
                    </div>
                </motion.div>

                <p className={`text-center font-bold text-xs transition-colors ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
                    {t('dontHaveAccount')} <Link href="/register" className="text-[#E51B24] font-black hover:underline underline-offset-4">{t('joinUsNow')}</Link>
                </p>
            </motion.div>

            {/* Global Dynamic Lights */}
            <div className={`absolute top-0 right-0 w-[400px] h-[400px] blur-[120px] -z-10 rounded-full transition-opacity ${darkMode ? 'bg-[#E51B24]/5 opacity-100' : 'bg-[#E51B24]/10 opacity-50'}`}></div>
            <div className={`absolute bottom-0 left-0 w-[300px] h-[300px] blur-[100px] -z-10 rounded-full transition-opacity ${darkMode ? 'bg-blue-500/5 opacity-100' : 'bg-blue-500/10 opacity-50'}`}></div>
        </div>
    );
}
