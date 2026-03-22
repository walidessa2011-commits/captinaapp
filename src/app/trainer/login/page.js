"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Mail, Lock, Phone, ArrowRight, Globe, Fingerprint, ChevronLeft, ShieldAlert } from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { auth, db } from "@/lib/firebase";
import { 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup,
    RecaptchaVerifier,
    signInWithPhoneNumber
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export default function TrainerLogin() {
    const { t, language, darkMode, setAlert } = useApp();
    const router = useRouter();
    const [loginMethod, setLoginMethod] = useState('email'); // Default to email for trainers
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);

    const checkTrainerAccess = async (user) => {
        const trainerDoc = await getDoc(doc(db, "trainers", user.uid));
        if (trainerDoc.exists()) {
            const data = trainerDoc.data();
            if (data.status === 'active') {
                router.push('/trainer/dashboard');
            } else {
                router.push('/trainer/status');
            }
            return true;
        } else {
            setAlert({
                title: language === 'ar' ? 'دخول مرفوض' : 'Access Denied',
                message: language === 'ar' ? 'هذا الحساب غير مسجل كمدرب' : 'This account is not registered as a trainer',
                type: 'error'
            });
            await auth.signOut();
            return false;
        }
    };

    const handleEmailLogin = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            await checkTrainerAccess(result.user);
        } catch (error) {
            setAlert({
                title: language === 'ar' ? 'فشل الدخول' : 'Login Failed',
                message: error.message,
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            await checkTrainerAccess(result.user);
        } catch (error) {
            setAlert({
                title: language === 'ar' ? 'فشل الدخول' : 'Login Failed',
                message: error.message,
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const setupRecaptcha = () => {
        if (window.recaptchaVerifier) return;
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible'
        });
    };

    const handleSendCode = async () => {
        if (!phoneNumber) return;
        setLoading(true);
        try {
            setupRecaptcha();
            const fullPhone = `+966${phoneNumber}`;
            const confirmation = await signInWithPhoneNumber(auth, fullPhone, window.recaptchaVerifier);
            setConfirmationResult(confirmation);
        } catch (error) {
            setAlert({ title: 'Error', message: error.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!verificationCode || !confirmationResult) return;
        setLoading(true);
        try {
            const result = await confirmationResult.confirm(verificationCode);
            await checkTrainerAccess(result.user);
        } catch (error) {
            setAlert({ title: 'Invalid Code', message: error.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-[100dvh] flex flex-col items-center justify-center p-4 relative overflow-hidden ${darkMode ? 'bg-[#0D0D0F] text-white' : 'bg-slate-50 text-gray-900'} ${language === 'ar' ? 'font-arabic' : ''}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000" 
                    alt="" 
                    className={`w-full h-full object-cover transition-opacity duration-500 ${darkMode ? 'opacity-20 grayscale' : 'opacity-10'}`}
                />
                <div className={`absolute inset-0 bg-gradient-to-b ${darkMode ? 'from-[#0D0D0F]/80 via-transparent to-[#0D0D0F]' : 'from-white/80 via-transparent to-slate-50'}`}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10 flex flex-col gap-8"
            >
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2.5 backdrop-blur-lg p-1 pr-3.5 rounded-xl border border-white/10 mx-auto bg-white/5">
                        <div className="w-8 h-8 rounded-lg overflow-hidden">
                            <img src="/logo_captina.jpg" alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-black text-xs tracking-wider uppercase text-[#E51B24]">Trainer Portal</span>
                    </div>
                    
                    <h1 className="text-4xl font-black">{language === 'ar' ? 'بوابة المدرب' : 'Trainer Portal'}</h1>
                    <p className="text-xs font-bold text-white/40">{language === 'ar' ? 'سجل دخولك لإدارة جلساتك ومتدربيك' : 'Log in to manage your sessions and trainees'}</p>
                </div>

                <div className={`w-full backdrop-blur-2xl border rounded-[2.5rem] p-8 shadow-2xl ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-black/5'}`}>
                    <div className="flex flex-col gap-6">
                        {/* Tabs */}
                        <div className="flex p-1.5 rounded-2xl bg-white/5">
                            {['email', 'phone', 'social'].map(method => (
                                <button 
                                    key={method}
                                    onClick={() => setLoginMethod(method)}
                                    className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all ${loginMethod === method ? 'bg-[#E51B24] text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
                                >
                                    {method === 'email' ? (language === 'ar' ? 'الإيميل' : 'Email') : method === 'phone' ? (language === 'ar' ? 'الجوال' : 'Phone') : (language === 'ar' ? 'جوجل' : 'Social')}
                                </button>
                            ))}
                        </div>

                        {loginMethod === 'email' && (
                            <form onSubmit={handleEmailLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest px-2 text-white/40">{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-[#E51B24] focus:bg-white/10 transition-all font-black text-sm"
                                        placeholder="coach@captina.sa"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest px-2 text-white/40">{language === 'ar' ? 'كلمة المرور' : 'Password'}</label>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-[#E51B24] focus:bg-white/10 transition-all font-black text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-[#E51B24] text-white font-black py-4 rounded-2xl shadow-xl shadow-[#E51B24]/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3">
                                    {loading ? '...' : (language === 'ar' ? 'تسجيل الدخول' : 'Sign In')}
                                    <ArrowRight className={`w-4 h-4 ${language === 'en' ? '' : 'rotate-180'}`} />
                                </button>
                            </form>
                        )}

                        {loginMethod === 'phone' && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest px-2 text-white/40">{language === 'ar' ? 'رقم الجوال' : 'Phone Number'}</label>
                                    <div className="relative">
                                        <div className={`absolute ${language === 'en' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-white/10 pr-3`}>
                                            <span className="text-xs font-black">+966</span>
                                        </div>
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className={`w-full bg-white/5 border border-white/10 rounded-2xl py-4 ${language === 'en' ? 'pl-20' : 'pr-20'} px-6 outline-none focus:border-[#E51B24] transition-all font-black text-sm`}
                                            placeholder="5XXXXXXXX"
                                        />
                                    </div>
                                </div>
                                {confirmationResult && (
                                    <input
                                        type="text"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-center tracking-[1em] outline-none focus:border-[#E51B24] transition-all font-black text-xl"
                                        placeholder="000000"
                                    />
                                )}
                                <div id="recaptcha-container"></div>
                                <button onClick={confirmationResult ? handleVerifyCode : handleSendCode} disabled={loading} className="w-full bg-[#E51B24] text-white font-black py-4 rounded-2xl shadow-xl shadow-[#E51B24]/20 hover:brightness-110 transition-all flex items-center justify-center gap-3">
                                    {loading ? '...' : (confirmationResult ? 'Verify' : 'Send Code')}
                                </button>
                            </div>
                        )}

                        {loginMethod === 'social' && (
                            <button onClick={handleGoogleLogin} disabled={loading} className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-3">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continue with Google
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex justify-center gap-6">
                    <Link href="/intro" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-[#E51B24] transition-colors flex items-center gap-2">
                        <ChevronLeft className="w-3 h-3" />
                        {language === 'ar' ? 'الرجوع للرئيسية' : 'Back to Home'}
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
