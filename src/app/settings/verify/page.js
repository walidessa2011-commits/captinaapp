"use client";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Shield, Mail, Phone, Fingerprint, 
    CheckCircle2, ChevronRight, ChevronLeft,
    AlertCircle, Clock, ShieldCheck, FileCheck, ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { RecaptchaVerifier, signInWithPhoneNumber, updatePhoneNumber, PhoneAuthProvider, PhoneMultiFactorGenerator } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { registerBiometrics, isBiometricAvailable } from "@/lib/webauthn";

export default function IdentityVerification() {
    const { language, t } = useApp();
    const router = useRouter();
    const [user, loadingAuth] = useAuthState(auth);
    const [status, setStatus] = useState({
        emailVerified: false,
        phoneVerified: false,
        identityVerified: false,
        verificationPending: false
    });
    const [loading, setLoading] = useState(true);
    const { setAlert } = useApp();
    const [verifyingPhone, setVerifyingPhone] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [biometricAvailable, setBiometricAvailable] = useState(false);

    useEffect(() => {
        const checkBiometric = async () => {
            const available = await isBiometricAvailable();
            setBiometricAvailable(available);
        };
        checkBiometric();
    }, []);

    const setupRecaptcha = () => {
        if (window.recaptchaVerifier) return;
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible'
        });
    };

    useEffect(() => {
        if (!loadingAuth && !user) {
            router.push('/login');
        }

        const fetchStatus = async () => {
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setStatus({
                        emailVerified: user.emailVerified,
                        phoneVerified: data.phoneVerified || false,
                        identityVerified: data.identityVerified || false,
                        verificationPending: data.verificationPending || false
                    });
                }
                setLoading(false);
            }
        };

        fetchStatus();
    }, [user, loadingAuth, router]);

    if (loadingAuth || loading) {
        return (
            <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const steps = [
        {
            id: 'email',
            icon: Mail,
            title: language === 'ar' ? 'البريد الإلكتروني' : 'Email Authentication',
            desc: language === 'ar' ? 'تأكيد ملكية البريد الإلكتروني المسجل' : 'Confirm ownership of primary communication channel',
            status: status.emailVerified ? 'verified' : 'unverified',
            color: 'text-blue-400',
            action: null
        },
        {
            id: 'phone',
            icon: Phone,
            title: language === 'ar' ? 'رقم الهاتف' : 'Neural Link (Phone)',
            desc: language === 'ar' ? 'ربط حسابك برقم هاتف موثق' : 'Establish secure link via mobile network protocols',
            status: status.phoneVerified ? 'verified' : 'unverified',
            color: 'text-emerald-400',
            action: 'verify_phone'
        },
        {
            id: 'biometric',
            icon: Fingerprint,
            title: language === 'ar' ? 'البصمة / معرف الوجه' : 'Biometric Identity',
            desc: language === 'ar' ? 'تفعيل الدخول السريع عبر بصمة الوجه أو الأصبع' : 'Enable fast access via FaceID or Fingerprint biometrics',
            status: status.identityVerified ? 'verified' : 'unverified',
            color: 'text-primary',
            action: 'register_biometric'
        }
    ];

    const handleAction = async (action) => {
        if (action === 'verify_phone') {
            setVerifyingPhone(true);
        } else if (action === 'register_biometric') {
            handleRegisterBiometric();
        }
    };

    const handleSendOTP = async () => {
        if (!phoneNumber) return;
        try {
            setupRecaptcha();
            const fullPhone = `+966${phoneNumber}`;
            const confirmation = await signInWithPhoneNumber(auth, fullPhone, window.recaptchaVerifier);
            setConfirmationResult(confirmation);
        } catch (error) {
            setAlert({ title: 'Error', message: error.message, type: 'error' });
        }
    };

    const handleVerifyOTP = async () => {
        try {
            const result = await confirmationResult.confirm(verificationCode);
            await updateDoc(doc(db, "users", user.uid), {
                phoneVerified: true,
                phone: result.user.phoneNumber
            });
            setStatus(prev => ({ ...prev, phoneVerified: true }));
            setVerifyingPhone(false);
            setAlert({ title: language === 'ar' ? 'تم بنجاح' : 'Success', message: language === 'ar' ? 'تم توثيق الرقم بنجاح' : 'Phone verified successfully', type: 'success' });
        } catch (error) {
            setAlert({ title: 'Error', message: t('invalidCode'), type: 'error' });
        }
    };

    const handleRegisterBiometric = async () => {
        try {
            const result = await registerBiometrics(user.uid, user.email);
            await updateDoc(doc(db, "users", user.uid), {
                biometricCredentialId: result.credentialId,
                identityVerified: true
            });
            setStatus(prev => ({ ...prev, identityVerified: true }));
            setAlert({ title: t('biometricSuccess'), message: t('biometricSuccess'), type: 'success' });
        } catch (error) {
            setAlert({ title: 'Error', message: error.message, type: 'error' });
        }
    };

    const getStatusUI = (status) => {
        switch(status) {
            case 'verified':
                return {
                    label: language === 'ar' ? 'مكتمل' : 'AUTHENTICATED',
                    bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                    icon: CheckCircle2
                };
            case 'pending':
                return {
                    label: language === 'ar' ? 'قيد المراجعة' : 'PROCESSING',
                    bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
                    icon: Clock
                };
            default:
                return {
                    label: language === 'ar' ? 'غير مفعل' : 'INACTIVE',
                    bg: 'bg-white/5 text-gray-500 border-white/5',
                    icon: AlertCircle
                };
        }
    };

    const textClass = "text-white";

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a] pb-20 transition-colors duration-500 overflow-hidden relative" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            
            {/* Minimal Spacer */}
            <div className="h-4 md:h-8"></div>

            <main className="max-w-2xl mx-auto px-4 pb-6 relative z-10">
                {/* Top Action Bar - Title & Back */}
                <div className="mb-4 p-1 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-between shadow-premium transition-all">
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={() => router.back()}
                            className="w-10 h-10 flex items-center justify-center text-slate-900 dark:text-white hover:text-primary transition-colors active:scale-95"
                        >
                            {language === 'ar' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                        </button>
                        
                        <div className="flex items-center gap-3 px-2 py-2 text-slate-900 dark:text-white">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap">
                                {language === 'ar' ? 'بصمة الأمان' : 'Identity Core'}
                            </span>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 px-6 opacity-30">
                        <p className="text-[8px] font-black uppercase tracking-[0.3em]">
                            {language === 'ar' ? 'التوثيق / الحماية' : 'Trusted / Authentication'}
                        </p>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-12"
                >
                    {/* Security Notice */}
                    <div className="p-8 bg-white dark:bg-[#1a2235]/60 backdrop-blur-3xl rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10"></div>
                        <div className="flex gap-6 items-start">
                            <div className="p-4 bg-primary/10 rounded-2xl shrink-0">
                                <ShieldCheck className="w-8 h-8 text-primary" />
                            </div>
                            <div className="text-start">
                                <h2 className="text-lg font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">
                                    {language === 'ar' ? 'تأمين الحساب المتقدم' : 'Advanced Security Protocol'}
                                </h2>
                                <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 leading-relaxed uppercase tracking-wider">
                                    {language === 'ar' 
                                        ? 'التوثيق يمنحك وصولاً كاملاً لمميزات المنصة ويحمي بياناتك من عمليات الدخول غير المصرح بها.' 
                                        : 'Verification grants core access to platform features and shields data from unauthorized neural-link attempts.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Verification Steps */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] px-2">
                            {language === 'ar' ? 'خطوات التوثيق' : 'Authentication Pipeline'}
                        </h3>
                        
                        <div className="bg-white dark:bg-[#1a2235]/60 backdrop-blur-3xl rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-2xl overflow-hidden divide-y divide-gray-100 dark:divide-white/5">
                            {steps.map((step) => {
                                const ui = getStatusUI(step.status);
                                return (
                                    <div key={step.id} className="p-8 flex items-center justify-between gap-6 hover:bg-white/[0.02] transition-colors group">
                                        <div className="flex items-center gap-5 text-start">
                                            <div className={`w-14 h-14 rounded-[1.25rem] bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:scale-110 transition-transform ${step.color}`}>
                                                <step.icon className="w-7 h-7" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{step.title}</h4>
                                                    <div className={`px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-tight ${ui.bg}`}>
                                                        {ui.label}
                                                    </div>
                                                </div>
                                                <p className="text-[10px] font-bold text-gray-500 leading-relaxed max-w-[200px] md:max-w-sm">{step.desc}</p>
                                            </div>
                                        </div>
                                        
                                        {step.status === 'unverified' && (
                                            <button 
                                                onClick={() => handleAction(step.action)}
                                                className="px-5 py-2.5 bg-primary text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all outline-none"
                                            >
                                                {language === 'ar' ? 'ابدأ الآن' : 'Initialize'}
                                            </button>
                                        )}
                                        
                                        {step.status === 'verified' && (
                                            <div className="text-emerald-500 p-2">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Phone Verification Modal */}
            <AnimatePresence>
                {verifyingPhone && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setVerifyingPhone(false)}
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-slate-900 border border-white/10 p-8 rounded-[2rem] w-full max-w-sm relative z-10 space-y-6"
                        >
                            <h2 className="text-xl font-black text-white text-center">{t('phone')}</h2>
                            <div className="space-y-4">
                                <div className="relative">
                                    <input 
                                        type="tel"
                                        placeholder={t('phonePlaceholder')}
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-primary transition-all font-bold"
                                    />
                                </div>
                                {confirmationResult && (
                                    <input 
                                        type="text"
                                        placeholder={t('verificationCode')}
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-center tracking-[1em] outline-none focus:border-primary transition-all font-black text-xl"
                                    />
                                )}
                                <div id="recaptcha-container"></div>
                                <button 
                                    onClick={confirmationResult ? handleVerifyOTP : handleSendOTP}
                                    className="w-full bg-primary py-4 rounded-xl text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95"
                                >
                                    {confirmationResult ? t('verifyCode') : t('sendCode')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
