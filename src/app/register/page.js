"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Mail, Lock, Phone, User, Globe, ChevronLeft } from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Register() {
    const { t, language, darkMode, setAlert } = useApp();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        password: '',
        acceptTerms: false
    });

    const handleRegister = async (e) => {
        if (e) e.preventDefault();
        if (!formData.acceptTerms) {
            setAlert({
                title: language === 'ar' ? 'تنبيه' : 'Alert',
                message: language === 'ar' ? "يرجى الموافقة على الشروط والأحكام للمتابعة" : "Please accept our terms and conditions to continue",
                type: 'info'
            });
            return;
        }

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            // Save to Firestore
            await setDoc(doc(db, "users", user.uid), {
                fullName: formData.fullName,
                phone: formData.phone,
                email: formData.email,
                role: 'user',
                createdAt: serverTimestamp(),
                uid: user.uid
            });

            // Update Auth Profile
            await updateProfile(user, { displayName: formData.fullName });

            router.push('/');
        } catch (error) {
            console.error("Registration error:", error);
            setAlert({
                title: language === 'ar' ? 'فشل التسجيل' : 'Registration Failed',
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
            {/* Background Image with Immersive Effect */}
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
                    {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                </Link>
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full max-w-2xl relative z-10 flex flex-col gap-6"
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
                        <motion.h1 variants={itemVariants} className={`text-3xl font-black px-2 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {t('createNewAccount')}
                        </motion.h1>
                        <motion.p variants={itemVariants} className={`text-xs font-bold px-4 transition-colors ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
                            {language === 'ar' ? 'انضم إلينا الآن وابدأ رحلة التغيير' : 'Join us now and start your change journey'}
                        </motion.p>
                    </div>
                </div>

                {/* Glass Content Card */}
                <motion.div
                    variants={itemVariants}
                    className={`w-full backdrop-blur-[25px] border rounded-[2rem] py-8 px-6 md:px-10 shadow-2xl relative overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-black/5'}`}
                >
                    {/* Decorative Background Glow */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#E51B24]/10 blur-3xl rounded-full"></div>
                    
                    <form className="flex flex-col gap-4 relative z-10" onSubmit={handleRegister}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className={`text-[10px] font-black uppercase tracking-widest px-2 ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>{language === 'ar' ? 'الاسم كاملاً' : 'Full Name'}</label>
                                <div className="relative group">
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                        className={`w-full border rounded-xl py-3.5 px-5 md:px-6 outline-none transition-all font-black text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white focus:border-[#E51B24] focus:bg-white/10' : 'bg-black/5 border-black/5 text-gray-900 focus:border-[#E51B24] focus:bg-black/10'}`} 
                                        placeholder="John Doe" 
                                    />
                                    <User className={`absolute ${language === 'en' ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${darkMode ? 'text-white/20' : 'text-gray-400'}`} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className={`text-[10px] font-black uppercase tracking-widest px-2 ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>{t('phone')}</label>
                                <div className="relative group">
                                    <input 
                                        type="tel" 
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className={`w-full border rounded-xl py-3.5 px-5 md:px-6 outline-none transition-all font-black text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white focus:border-[#E51B24] focus:bg-white/10' : 'bg-black/5 border-black/5 text-gray-900 focus:border-[#E51B24] focus:bg-black/10'}`} 
                                        placeholder="05xxxxxxxx" 
                                    />
                                    <Phone className={`absolute ${language === 'en' ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${darkMode ? 'text-white/20' : 'text-gray-400'}`} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className={`text-[10px] font-black uppercase tracking-widest px-2 ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>{t('email')}</label>
                            <div className="relative group">
                                <input 
                                    type="email" 
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className={`w-full border rounded-xl py-3.5 px-5 md:px-6 outline-none transition-all font-black text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white focus:border-[#E51B24] focus:bg-white/10' : 'bg-black/5 border-black/5 text-gray-900 focus:border-[#E51B24] focus:bg-black/10'}`} 
                                    placeholder="mail@example.com" 
                                />
                                <Mail className={`absolute ${language === 'en' ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${darkMode ? 'text-white/20' : 'text-gray-400'}`} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className={`text-[10px] font-black uppercase tracking-widest px-2 ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>{t('password')}</label>
                            <div className="relative group">
                                <input 
                                    type="password" 
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className={`w-full border rounded-xl py-3.5 px-5 md:px-6 outline-none transition-all font-black text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white focus:border-[#E51B24] focus:bg-white/10' : 'bg-black/5 border-black/5 text-gray-900 focus:border-[#E51B24] focus:bg-black/10'}`} 
                                    placeholder="••••••••" 
                                />
                                <Lock className={`absolute ${language === 'en' ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${darkMode ? 'text-white/20' : 'text-gray-400'}`} />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-2 py-1">
                            <input 
                                type="checkbox" 
                                id="terms" 
                                checked={formData.acceptTerms}
                                onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
                                className="w-4 h-4 accent-[#E51B24] rounded cursor-pointer" 
                            />
                            <label htmlFor="terms" className={`text-[11px] font-bold cursor-pointer transition-colors ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>{t('acceptTerms')}</label>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#E51B24] text-white font-black py-4 rounded-xl shadow-lg shadow-[#E51B24]/20 hover:bg-[#ff1f2d] active:scale-95 transition-all flex items-center justify-center gap-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (language === 'ar' ? 'جاري التحميل...' : 'Loading...') : t('createNewAccount')}
                            {!loading && <ChevronLeft className={`w-4 h-4 ${language === 'en' ? 'rotate-180' : ''}`} />}
                        </button>
                    </form>
                </motion.div>

                <p className={`text-center font-bold text-xs mb-8 transition-colors ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
                    {language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'} <Link href="/login" className="text-[#E51B24] font-black hover:underline underline-offset-4">{t('login')}</Link>
                </p>
            </motion.div>

            {/* Global Dynamic Lights */}
            <div className={`absolute top-0 right-0 w-[400px] h-[400px] blur-[120px] -z-10 rounded-full transition-opacity ${darkMode ? 'bg-[#E51B24]/5 opacity-100' : 'bg-[#E51B24]/10 opacity-50'}`}></div>
            <div className={`absolute bottom-0 left-0 w-[300px] h-[300px] blur-[100px] -z-10 rounded-full transition-opacity ${darkMode ? 'bg-blue-500/5 opacity-100' : 'bg-blue-500/10 opacity-50'}`}></div>
        </div>
    );
}
