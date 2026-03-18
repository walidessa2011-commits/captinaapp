"use client";
import { motion } from "framer-motion";
import Link from 'next/link';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Mail, ChevronLeft, ArrowRight } from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPassword() {
    const { t, language, darkMode, setAlert } = useApp();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);

    const handleReset = async (e) => {
        if (e) e.preventDefault();
        if (!email) return;
        
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            setIsSent(true);
            setAlert({
                title: language === 'ar' ? 'تم الإرسال' : 'Email Sent',
                message: language === 'ar' 
                    ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني' 
                    : 'A password reset link has been sent to your email address',
                type: 'success'
            });
        } catch (error) {
            console.error("Reset error:", error);
            setAlert({
                title: language === 'ar' ? 'خطأ' : 'Error',
                message: error.message,
                type: 'error'
            });
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
            {/* Background Image - Same as login/register */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000" 
                    alt="" 
                    className={`w-full h-full object-cover transition-opacity duration-500 ${darkMode ? 'opacity-40 grayscale-[20%]' : 'opacity-30'}`}
                />
                <div className={`absolute inset-0 transition-colors duration-500 bg-gradient-to-b ${darkMode ? 'from-[#0A0E17]/80 via-transparent to-[#0A0E17]' : 'from-white/80 via-transparent to-slate-50'}`}></div>
            </div>

            {/* Back Button Overlay */}
            <div className="absolute top-8 left-8 z-30">
                <Link 
                    href="/login"
                    className={`flex items-center gap-2 transition-all font-bold text-xs backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 ${darkMode ? 'text-white/60 bg-white/5 hover:text-white' : 'text-gray-500 bg-black/5 hover:text-gray-900'}`}
                >
                    <ChevronLeft className={`w-4 h-4 ${language === 'en' ? '' : 'rotate-180'}`} />
                    {language === 'ar' ? 'الرجوع للدخول' : 'Back to Login'}
                </Link>
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
                            {language === 'ar' ? 'استعادة الحساب' : 'Account Recovery'}
                        </motion.h1>
                        <motion.p variants={itemVariants} className={`text-xs font-bold px-4 transition-colors ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
                            {language === 'ar' ? 'أدخل بريدك الإلكتروني لإرسال تعليمات إعادة التعيين' : 'Enter your email to receive reset instructions'}
                        </motion.p>
                    </div>
                </div>

                {/* Glass Content Card */}
                <motion.div
                    variants={itemVariants}
                    className={`w-full backdrop-blur-[25px] border rounded-[2rem] py-8 px-6 shadow-2xl relative overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-black/5'}`}
                >
                    {/* Decorative Background Glow */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#E51B24]/10 blur-3xl rounded-full"></div>
                    
                    {!isSent ? (
                        <form className="flex flex-col gap-5 relative z-10" onSubmit={handleReset}>
                            <div className="space-y-2">
                                <label className={`text-[10px] font-black uppercase tracking-widest px-2 ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>{t('email')}</label>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`w-full border rounded-xl py-4 px-6 focus:border-[#E51B24] outline-none transition-all font-black text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white focus:bg-white/10' : 'bg-black/5 border-black/5 text-gray-900 focus:bg-black/10'}`}
                                        placeholder="mail@example.com"
                                    />
                                    <Mail className={`absolute ${language === 'en' ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${darkMode ? 'text-white/20 group-focus-within:text-[#E51B24]' : 'text-gray-400 group-focus-within:text-[#E51B24]'}`} />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={loading || !email}
                                className="w-full bg-[#E51B24] text-white font-black py-4 rounded-xl shadow-lg shadow-[#E51B24]/20 hover:bg-[#ff1f2d] active:scale-95 transition-all flex items-center justify-center gap-3 text-sm disabled:opacity-50"
                            >
                                {loading ? (language === 'ar' ? 'جاري الإرسال...' : 'Sending...') : (language === 'ar' ? 'إرسال رابط التعيين' : 'Send Reset Link')}
                                {!loading && <ArrowRight className={`w-4 h-4 ${language === 'en' ? '' : 'rotate-180'}`} />}
                            </button>
                        </form>
                    ) : (
                        <div className="flex flex-col items-center gap-6 py-4 text-center">
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/20">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-emerald-500"
                                >
                                    <ArrowRight className={`w-8 h-8 ${language === 'en' ? '' : 'rotate-180'}`} />
                                </motion.div>
                            </div>
                            <div className="space-y-2">
                                <h3 className={`font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {language === 'ar' ? 'تفقد بريدك الإلكتروني' : 'Check Your Email'}
                                </h3>
                                <p className={`text-xs font-bold leading-relaxed ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
                                    {language === 'ar' 
                                        ? `لقد أرسلنا رابطاً خاصاً إلى ${email} لإعادة تعيين كلمة المرور.`
                                        : `We have sent a special link to ${email} to reset your password.`}
                                </p>
                            </div>
                            <button 
                                onClick={() => setIsSent(false)}
                                className={`text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-lg border transition-all ${darkMode ? 'border-white/10 text-white hover:bg-white/5' : 'border-black/5 text-gray-900 hover:bg-black/5'}`}
                            >
                                {language === 'ar' ? 'إعادة الإرسال' : 'Resend Link'}
                            </button>
                        </div>
                    )}
                </motion.div>

                <p className={`text-center font-bold text-xs transition-colors ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
                    {language === 'ar' ? 'تذكرت كلمة المرور؟' : 'Remembered your password?'} <Link href="/login" className="text-[#E51B24] font-black hover:underline underline-offset-4">{t('login')}</Link>
                </p>
            </motion.div>

            {/* Global Dynamic Lights */}
            <div className={`absolute top-0 right-0 w-[400px] h-[400px] blur-[120px] -z-10 rounded-full transition-opacity ${darkMode ? 'bg-[#E51B24]/5 opacity-100' : 'bg-[#E51B24]/10 opacity-50'}`}></div>
            <div className={`absolute bottom-0 left-0 w-[300px] h-[300px] blur-[100px] -z-10 rounded-full transition-opacity ${darkMode ? 'bg-blue-500/5 opacity-100' : 'bg-blue-500/10 opacity-50'}`}></div>
        </div>
    );
}
