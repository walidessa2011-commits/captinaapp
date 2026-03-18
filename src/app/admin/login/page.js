"use client";
import React, { useState } from 'react';
import { 
    Shield, 
    Mail, 
    Lock, 
    ArrowRight, 
    Loader2, 
    AlertCircle,
    Eye,
    EyeOff,
    CheckCircle2,
    Zap
} from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export default function AdminLoginPage() {
    const { language, t } = useApp();
    const router = useRouter();
    const [email, setEmail] = useState('admin@captina.sa');
    const [password, setPassword] = useState('CaptinaAdmin2026!');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSetupMode, setIsSetupMode] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Check if user has admin role
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists() && userSnap.data().role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                setError(language === 'ar' ? 'عذراً، هذا الحساب ليس لديه صلاحيات المسؤول.' : 'Sorry, this account does not have administrator privileges.');
                await auth.signOut();
            }
        } catch (err) {
            console.error("Login error:", err);
            
            let errorMessage = language === 'ar' ? 'حدث خطأ أثناء تسجيل الدخول.' : 'An error occurred while logging in.';
            
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                errorMessage = language === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' : 'Invalid email or password.';
            } else if (err.code === 'auth/too-many-requests') {
                errorMessage = language === 'ar' ? 'حسابك محظور مؤقتاً لمحاولات متكررة فاشلة. جرب لاحقاً.' : 'Access disabled temporarily due to multiple failed attempts.';
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetupAdmin = async () => {
        setIsLoading(true);
        setError('');
        try {
            // This will attempt to create the admin user if it doesn't exist
            const userCredential = await createUserWithEmailAndPassword(auth, 'admin@captina.sa', 'CaptinaAdmin2026!');
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                fullName: "System Admin",
                email: "admin@captina.sa",
                role: "admin",
                createdAt: serverTimestamp(),
                photoURL: "https://images.unsplash.com/photo-1599563672721-3e4b76a084e7?q=80&w=100"
            });

            setError(language === 'ar' ? 'تم إنشاء حساب المسؤول بنجاح! يمكنك الدخول الآن.' : 'Admin account created successfully! You can login now.');
            setIsSetupMode(false);
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                // If exists, just make sure it has the admin role
                setError(language === 'ar' ? 'الحساب موجود بالفعل. جرب تسجيل الدخول.' : 'Account already exists. Try logging in.');
            } else {
                setError(err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-tajawal relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-10">
                    <motion.div 
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary/50 border-4 border-white/10 mb-6"
                    >
                        <Shield className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">
                        Captina <span className="text-primary">Admin</span>
                    </h1>
                    <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">
                        {language === 'ar' ? 'نظام التحكم المركزي' : 'Core Command Center'}
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-3xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`flex items-center gap-3 p-4 rounded-2xl border text-sm font-bold ${error.includes('نجاح') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}
                                >
                                    {error.includes('نجاح') ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                                    <p>{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                                {language === 'ar' ? 'البريد الإلكتروني' : 'Admin Identity'}
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@captina.sa"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold placeholder-gray-600 focus:border-primary focus:bg-white/10 transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                                {language === 'ar' ? 'كلمة المرور' : 'Security Key'}
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white font-bold placeholder-gray-600 focus:border-primary focus:bg-white/10 transition-all outline-none"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin text-white/50" />
                            ) : (
                                <>
                                    <span>{language === 'ar' ? 'تسجيل الدخول للنظام' : 'Authorize Entrance'}</span>
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </motion.button>

                        {/* Setup Hint */}
                        <div className="pt-6 border-t border-white/5 text-center">
                            <button 
                                type="button" 
                                onClick={() => setIsSetupMode(!isSetupMode)}
                                className="text-xs font-bold text-gray-500 hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto"
                            >
                                <Zap className="w-3.5 h-3.5" />
                                {language === 'ar' ? 'إعداد حساب المسؤول لأول مرة؟' : 'Initial Admin Provisioning?'}
                            </button>
                            
                            <AnimatePresence>
                                {isSetupMode && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-2xl"
                                    >
                                        <p className="text-[10px] text-gray-400 mb-3 leading-relaxed">
                                            {language === 'ar' 
                                                ? 'سيؤدي هذا إلى إنشاء حساب المسؤول بالتفاصيل الموضحة (admin@captina.sa) تلقائياً.' 
                                                : 'This will automatically provision the root admin account with the displayed credentials.'}
                                        </p>
                                        <button 
                                            type="button"
                                            onClick={handleSetupAdmin}
                                            className="text-xs font-black text-primary hover:underline"
                                        >
                                            {language === 'ar' ? 'تأكيد التثبيت والإنشاء' : 'Confirm Root Installation'}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </form>
                </div>
            </motion.div>

            {/* Version Text */}
            <div className="absolute bottom-6 left-6 flex items-center gap-4 text-xs font-black text-white/10 uppercase tracking-widest">
                <span>Captina Protocol v2.4</span>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span>System Online</span>
            </div>
        </div>
    );
}
