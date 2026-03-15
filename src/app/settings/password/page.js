"use client";
import { motion } from "framer-motion";
import { 
    Lock, Shield, ChevronRight, ChevronLeft, 
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
    const { language } = useApp();
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
            // Re-authenticate user first
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            
            // Update password
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
            <div className="min-h-screen bg-[#001f3f] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const inputClasses = "w-full bg-slate-100 dark:bg-white/5 border-0 rounded-2xl p-4 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none";
    const labelClasses = "block text-[10px] font-black text-gray-400 uppercase mb-2 px-1";

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#001f3f] transition-colors duration-300">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#001f3f]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 p-4">
                <div className="container mx-auto max-w-2xl flex items-center justify-between">
                    <Link href="/settings" className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                        {language === 'ar' ? <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                    </Link>
                    <h1 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                        {language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
                    </h1>
                    <div className="w-10"></div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-xl">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                        {language === 'ar' ? 'تأمين حسابك' : 'Secure Your Account'}
                    </h2>
                    <p className="text-xs text-gray-500 font-medium">
                        {language === 'ar' ? 'اختر كلمة مرور قوية وفريدة لحماية بياناتك' : 'Choose a strong, unique password to protect your data'}
                    </p>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                    {error && (
                        <div className="bg-rose-500/10 text-rose-500 p-4 rounded-2xl text-[11px] font-black flex items-center gap-3 border border-rose-500/10">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-emerald-500/10 text-emerald-500 p-4 rounded-2xl text-[11px] font-black flex items-center gap-3 border border-emerald-500/10">
                            <CheckCircle2 className="w-4 h-4" />
                            {language === 'ar' ? 'تم تحديث كلمة المرور بنجاح!' : 'Password updated successfully!'}
                        </div>
                    )}

                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
                        <div>
                            <label className={labelClasses}>{language === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}</label>
                            <div className="relative">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type={showCurrent ? "text" : "password"} 
                                    className={inputClasses + (language === 'ar' ? " pr-4 pl-12" : " pl-12")}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                                >
                                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="h-px bg-gray-50 dark:bg-white/5 my-2"></div>

                        <div>
                            <label className={labelClasses}>{language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type={showNew ? "text" : "password"} 
                                    className={inputClasses + (language === 'ar' ? " pr-4 pl-12" : " pl-12")}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                                >
                                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className={labelClasses}>{language === 'ar' ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type={showNew ? "text" : "password"} 
                                    className={inputClasses + (language === 'ar' ? " pr-4 pl-12" : " pl-12")}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10">
                        <div className="flex gap-3">
                            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                            <p className="text-[10px] font-bold text-amber-600 leading-relaxed">
                                {language === 'ar' 
                                    ? 'سيتم تسجيل خروجك من جميع الجلسات الأخرى عند تغيير كلمة المرور لأغراض أمنية.' 
                                    : 'You will be logged out of other sessions when you change your password for security purposes.'}
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-5 rounded-3xl font-black uppercase tracking-wider shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Key className="w-5 h-5" />
                                {language === 'ar' ? 'تحديث كلمة المرور' : 'Update Password'}
                            </>
                        )}
                    </button>
                </form>
            </main>
        </div>
    );
}
