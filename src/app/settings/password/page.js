"use client";
import { motion } from "framer-motion";
import { 
    Lock, Shield, ChevronLeft, ChevronRight, 
    CheckCircle2, AlertCircle, Eye, EyeOff, Key
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function ChangePassword() {
    const { language, t, darkMode } = useApp();
    const router = useRouter();
    const [user, loadingAuth] = useAuthState(auth);
    
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!loadingAuth && !user) {
            router.push('/login');
        }
    }, [user, loadingAuth, router]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (newPassword !== confirmPassword) {
            setError(language === 'ar' ? 'كلمات المرور الجديدة غير متطابقة' : 'New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError(language === 'ar' ? 'يجب أن تكون كلمة المرور 6 أحرف على الأقل' : 'Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            setSuccess(true);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            
            setTimeout(() => {
                router.push('/settings');
            }, 2000);
        } catch (error) {
            console.error("Error updating password:", error);
            if (error.code === 'auth/wrong-password') {
                setError(language === 'ar' ? 'كلمة المرور الحالية غير صحيحة' : 'Current password is incorrect');
            } else {
                setError(language === 'ar' ? 'حدث خطأ أثناء تحديث كلمة المرور' : 'Error updating password');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loadingAuth) {
        return (
            <div className={`min-h-screen ${darkMode ? 'bg-[#0a0f1a]' : 'bg-slate-50'} flex items-center justify-center`}>
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const inputClasses = `w-full ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-100 border-gray-200 text-slate-900'} border rounded-2xl py-4 px-12 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none placeholder:text-gray-400`;
    const labelClasses = "block text-[10px] font-black text-primary uppercase mb-3 px-1 tracking-widest";

    const textClass = darkMode ? "text-white" : "text-slate-900";

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-[#0a0f1a]' : 'bg-slate-50'} pb-20 transition-colors duration-500 overflow-hidden relative`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[160px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            
            {/* Minimal Spacer */}
            <div className="h-4 md:h-8"></div>

            <main className="max-w-xl mx-auto px-4 pb-6 relative z-10">
                {/* Top Action Bar - Title & Back */}
                <div className="mb-2 p-1 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-between shadow-premium transition-all">
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={() => router.back()}
                            className="w-10 h-10 flex items-center justify-center text-slate-900 dark:text-white hover:text-primary transition-colors active:scale-95"
                        >
                            {language === 'ar' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                        </button>
                        
                        <div className="flex items-center gap-3 px-2 py-2 text-slate-900 dark:text-white">
                            <Shield className="w-4 h-4 text-primary" />
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap">
                                {language === 'ar' ? 'حماية الدخول' : 'Access Security'}
                            </span>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 px-6 opacity-30">
                        <p className="text-[8px] font-black uppercase tracking-[0.3em]">
                            {language === 'ar' ? 'كلمة المرور / الأمان' : 'Key Protocol / Access'}
                        </p>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 bg-primary/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-lg shadow-primary/5">
                        <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className={`text-xl font-black ${textClass} mb-1 tracking-tight`}>
                        {language === 'ar' ? 'تأمين حسابك' : 'Secure Your Identity'}
                    </h2>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        {language === 'ar' ? 'تحديث بروتوكول الوصول الخاص بك' : 'Update your access protocol'}
                    </p>
                </motion.div>

                <form onSubmit={handleUpdate} className="space-y-6">
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-rose-500/10 text-rose-500 p-5 rounded-2xl text-[11px] font-black flex items-center gap-4 border border-rose-500/20 shadow-xl shadow-rose-500/5"
                        >
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    {success && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-emerald-500/10 text-emerald-500 p-5 rounded-2xl text-[11px] font-black flex items-center gap-4 border border-emerald-500/20 shadow-xl shadow-emerald-500/5"
                        >
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                            {language === 'ar' ? 'تم تحديث مشفر الحماية بنجاح!' : 'Security cipher updated successfully!'}
                        </motion.div>
                    )}

                    <div className={`${darkMode ? 'bg-[#1a2235]/60 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-3xl rounded-[2.5rem] p-8 border shadow-2xl relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10"></div>
                        
                        <div className="space-y-6">
                            <div className="group">
                                <label className={labelClasses}>{language === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}</label>
                                <div className="relative">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-primary transition-colors" />
                                    <input 
                                        type={showCurrent ? "text" : "password"} 
                                        className={inputClasses + (language === 'ar' ? " pr-12 pl-12" : " pl-12")}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowCurrent(!showCurrent)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-primary transition-colors p-1"
                                    >
                                        {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="h-px bg-white/5 mx-2"></div>

                            <div className="group">
                                <label className={labelClasses}>{language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-primary transition-colors" />
                                    <input 
                                        type={showNew ? "text" : "password"} 
                                        className={inputClasses + (language === 'ar' ? " pr-12 pl-12" : " pl-12")}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowNew(!showNew)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-primary transition-colors p-1"
                                    >
                                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="group">
                                <label className={labelClasses}>{language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-primary transition-colors" />
                                    <input 
                                        type={showNew ? "text" : "password"} 
                                        className={inputClasses + (language === 'ar' ? " pr-12 pl-12" : " pl-12")}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`${darkMode ? 'bg-amber-500/5 border-amber-500/10' : 'bg-amber-50 border-amber-200'} p-5 rounded-[1.5rem] border backdrop-blur-md`}>
                        <div className="flex gap-4 items-start">
                            <div className="p-2 bg-amber-500/10 rounded-lg shrink-0">
                                <AlertCircle className="w-4 h-4 text-amber-500" />
                            </div>
                            <p className="text-[10px] font-black text-amber-600 dark:text-amber-500 leading-relaxed uppercase tracking-widest text-start pt-1">
                                {language === 'ar' 
                                    ? 'سيتم تسجيل خروجك من جميع الجلسات الأخرى عند تغيير كلمة المرور لأغراض أمنية.' 
                                    : 'Active sessions will be terminated across all devices upon security protocol update.'}
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Key className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                {language === 'ar' ? 'تحديث كلمة المرور' : 'Secure Account'}
                            </>
                        )}
                    </button>
                </form>
            </main>
        </div>
    );
}
