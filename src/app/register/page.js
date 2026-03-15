"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Mail, Lock, Phone, User, Globe, ChevronLeft } from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Register() {
    const { t, language } = useApp();
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
            alert(language === 'ar' ? "يرجى الموافقة على الشروط" : "Please accept terms");
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

            router.push('/');
        } catch (error) {
            console.error("Registration error:", error);
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
                <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-primary/10 blur-[120px] animate-pulse"></div>
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }}></div>
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-[1000px] w-full min-h-[500px] md:min-h-[600px] flex flex-col md:flex-row-reverse bg-white/5 backdrop-blur-2xl rounded-[2.5rem] md:rounded-[3rem] border border-white/10 overflow-hidden relative z-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
            >
                {/* Visual Section */}
                <div className="hidden md:flex md:w-5/12 relative overflow-hidden bg-gradient-to-tl from-[#001f3f] to-primary/40 p-12 flex-col justify-between">
                    <div className="relative z-10">
                        <motion.div 
                            variants={itemVariants}
                            className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 mb-8"
                        >
                            <User className="w-8 h-8 text-white" />
                        </motion.div>
                        <motion.h2 variants={itemVariants} className="text-4xl font-black text-white leading-tight mb-4">
                            {language === 'ar' ? 'ابدأ رحلتك الرياضية' : 'Start Your Fitness Journey'}
                        </motion.h2>
                        <motion.p variants={itemVariants} className="text-white/60 font-medium text-lg">
                            {t('discoverDesc')}
                        </motion.p>
                    </div>

                    <div className="relative z-10 p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                         <p className="text-white font-black mb-2 italic">"{language === 'ar' ? 'كابتينا غيرت حياتي تماماً!' : 'Captina changed my life!'}"</p>
                         <div className="flex items-center gap-3">
                            <img src="https://i.pravatar.cc/100?u=9" className="w-8 h-8 rounded-full" alt="avatar" />
                            <span className="text-white/40 text-xs font-bold font-tajawal">سارة أحمد</span>
                         </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="w-full md:w-7/12 bg-white flex flex-col p-6 md:p-12 relative">
                    <div className="mb-6 md:mb-8 text-start">
                        <motion.h1 variants={itemVariants} className="text-2xl md:text-5xl font-black text-[#001f3f] mb-1 md:mb-2 tracking-tight">
                            {t('createNewAccount')}
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-xs md:text-base text-gray-400 font-bold">
                            {language === 'ar' ? 'سجل بياناتك للانضمام إلى نخبة الرياضيين' : 'Register to join elite athletes'}
                        </motion.p>
                    </div>

                    <form className="space-y-4 md:space-y-5 flex-grow" onSubmit={handleRegister}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">{language === 'ar' ? 'الاسم كاملاً' : 'Full Name'}</label>
                                <div className="relative group">
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-3.5 md:py-4 px-5 md:px-6 focus:border-primary outline-none transition-all font-black text-[#001f3f] text-sm md:text-base" 
                                        placeholder="John Doe" 
                                    />
                                    <User className={`absolute ${language === 'en' ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-300`} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">{t('phone')}</label>
                                <div className="relative group">
                                    <input 
                                        type="tel" 
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-3.5 md:py-4 px-5 md:px-6 focus:border-primary outline-none transition-all font-black text-[#001f3f] text-sm md:text-base" 
                                        placeholder="05xxxxxxxx" 
                                    />
                                    <Phone className={`absolute ${language === 'en' ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-300`} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">{t('email')}</label>
                            <div className="relative group">
                                <input 
                                    type="email" 
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-3.5 md:py-4 px-5 md:px-6 focus:border-primary outline-none transition-all font-black text-[#001f3f] text-sm md:text-base" 
                                    placeholder="mail@example.com" 
                                />
                                <Mail className={`absolute ${language === 'en' ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-300`} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">{t('password')}</label>
                            <div className="relative group">
                                <input 
                                    type="password" 
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-3.5 md:py-4 px-5 md:px-6 focus:border-primary outline-none transition-all font-black text-[#001f3f] text-sm md:text-base" 
                                    placeholder="••••••••" 
                                />
                                <Lock className={`absolute ${language === 'en' ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-300`} />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-2">
                            <input 
                                type="checkbox" 
                                id="terms" 
                                checked={formData.acceptTerms}
                                onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
                                className="w-4 h-4 accent-primary rounded cursor-pointer" 
                            />
                            <label htmlFor="terms" className="text-xs font-bold text-gray-500 cursor-pointer">{t('acceptTerms')}</label>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#001f3f] text-white font-black py-3.5 md:py-4 rounded-2xl shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-base md:text-lg group mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (language === 'ar' ? 'جاري التحميل...' : 'Loading...') : t('createNewAccount')}
                            {!loading && <ChevronLeft className={`w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform ${language === 'en' ? 'rotate-180' : ''}`} />}
                        </button>
                    </form>

                    <p className="text-center text-gray-400 mt-8 font-bold text-sm">
                        {language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'} <Link href="/login" className="text-primary font-black hover:underline underline-offset-4">{t('login')}</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
