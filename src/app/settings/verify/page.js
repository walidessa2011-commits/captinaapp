"use client";
import { motion } from "framer-motion";
import { 
    Shield, Mail, Phone, Fingerprint, 
    CheckCircle2, ChevronRight, ChevronLeft,
    AlertCircle, Clock, ShieldCheck, FileCheck, ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

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
            color: 'text-blue-400'
        },
        {
            id: 'phone',
            icon: Phone,
            title: language === 'ar' ? 'رقم الهاتف' : 'Neural Link (Phone)',
            desc: language === 'ar' ? 'ربط حسابك برقم هاتف موثق' : 'Establish secure link via mobile network protocols',
            status: status.phoneVerified ? 'verified' : 'unverified',
            color: 'text-emerald-400'
        },
        {
            id: 'identity',
            icon: Fingerprint,
            title: language === 'ar' ? 'الهوية الشخصية' : 'Biometric Identity',
            desc: language === 'ar' ? 'رفع وثيقة هوية رسمية (جواز سفر / بطاقة)' : 'Initialize biometric and official ID validation process',
            status: status.identityVerified ? 'verified' : (status.verificationPending ? 'pending' : 'unverified'),
            color: 'text-primary'
        }
    ];

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
        <div className={`min-h-screen bg-[#0a0f1a] pb-20 transition-colors duration-500 overflow-hidden relative`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            
            {/* Immersive Header */}
            <header className="relative z-20 pt-16 pb-6 px-6">
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    {/* Breadcrumbs */}
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest opacity-50"
                    >
                        <Link href="/" className="hover:text-primary transition-colors">{language === 'ar' ? 'الرئيسية' : 'Home'}</Link>
                        <span className="text-gray-500">
                            {language === 'ar' ? ' < ' : ' > '}
                        </span>
                        <Link href="/settings" className="hover:text-primary transition-colors">{language === 'ar' ? 'الإعدادات' : 'Settings'}</Link>
                        <span className="text-gray-500">
                            {language === 'ar' ? ' < ' : ' > '}
                        </span>
                        <span className="text-primary">{language === 'ar' ? 'التوثيق' : 'Verification'}</span>
                    </motion.div>

                    {/* Consolidated Title Line */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3 mb-4"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                        <h1 className={`text-xl md:text-2xl font-black ${textClass} tracking-tighter italic uppercase text-center`}>
                            {language === 'ar' 
                                ? '( بصمة الأمان - توثيق كابتينة )' 
                                : '( Trusted Identity - Captina Verify )'}
                        </h1>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                    </motion.div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-12"
                >
                    {/* Security Notice */}
                    <div className="p-8 bg-[#1a2235]/60 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10"></div>
                        <div className="flex gap-6 items-start">
                            <div className="p-4 bg-primary/10 rounded-2xl shrink-0">
                                <ShieldCheck className="w-8 h-8 text-primary" />
                            </div>
                            <div className="text-start">
                                <h2 className="text-lg font-black text-white mb-2 uppercase tracking-tight">
                                    {language === 'ar' ? 'تأمين الحساب المتقدم' : 'Advanced Security Protocol'}
                                </h2>
                                <p className="text-[11px] font-bold text-gray-400 leading-relaxed uppercase tracking-wider">
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
                        
                        <div className="bg-[#1a2235]/60 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden divide-y divide-white/5">
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
                                                    <h4 className="text-sm font-black text-white uppercase tracking-tight">{step.title}</h4>
                                                    <div className={`px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-tight ${ui.bg}`}>
                                                        {ui.label}
                                                    </div>
                                                </div>
                                                <p className="text-[10px] font-bold text-gray-500 leading-relaxed max-w-[200px] md:max-w-sm">{step.desc}</p>
                                            </div>
                                        </div>
                                        
                                        {step.status === 'unverified' && (
                                            <button className="px-5 py-2.5 bg-primary text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all outline-none">
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
        </div>
    );
}
