"use client";
import { motion } from "framer-motion";
import { 
    ShieldCheck, Mail, Phone, FileText, ChevronRight, 
    ChevronLeft, CheckCircle2, AlertCircle, Camera,
    FileCheck, UserCheck, ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function AccountVerification() {
    const { language } = useApp();
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
            <div className="min-h-screen bg-[#001f3f] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const verificationSteps = [
        {
            id: 'email',
            icon: Mail,
            title: language === 'ar' ? 'توثيق البريد الإلكتروني' : 'Email Verification',
            status: status.emailVerified ? 'verified' : 'pending',
            desc: language === 'ar' ? 'تأكيد ملكية بريدك الإلكتروني لتلقي التحديثات' : 'Confirm ownership of your email to receive updates'
        },
        {
            id: 'phone',
            icon: Phone,
            title: language === 'ar' ? 'توثيق رقم الجوال' : 'Phone Verification',
            status: status.phoneVerified ? 'verified' : 'unverified',
            desc: language === 'ar' ? 'ربط رقم جوالك لتأمين حسابك' : 'Link your phone number to secure your account'
        },
        {
            id: 'identity',
            icon: FileCheck,
            title: language === 'ar' ? 'توثيق الهوية' : 'Identity Verification',
            status: status.identityVerified ? 'verified' : (status.verificationPending ? 'pending' : 'unverified'),
            desc: language === 'ar' ? 'رفع وثيقة رسمية لتوثيق ملكية الحساب' : 'Upload official document to verify account ownership'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#001f3f] transition-colors duration-300">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#001f3f]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 p-4">
                <div className="container mx-auto max-w-2xl flex items-center justify-between">
                    <Link href="/settings" className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                        {language === 'ar' ? <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                    </Link>
                    <h1 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                        {language === 'ar' ? 'توثيق الحساب' : 'Account Verification'}
                    </h1>
                    <div className="w-10"></div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-primary/5">
                        <ShieldCheck className="w-12 h-12 text-primary" />
                    </div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                        {language === 'ar' ? 'زد من أمان حسابك' : 'Boost Your Security'}
                    </h2>
                    <p className="text-xs text-gray-500 font-medium max-w-xs mx-auto">
                        {language === 'ar' 
                            ? 'الحسابات الموثقة تحصل على حماية إضافية وتتمكن من الوصول لجميع مميزات التطبيق' 
                            : 'Verified accounts get extra protection and access to all app features'}
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm divide-y divide-gray-50 dark:divide-white/5">
                    {verificationSteps.map((step) => (
                        <div key={step.id} className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4 text-start">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                                        step.status === 'verified' ? 'bg-emerald-500/10 text-emerald-500' : 
                                        step.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-gray-50 dark:bg-white/5 text-gray-400'
                                    }`}>
                                        <step.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-gray-900 dark:text-white mb-0.5">{step.title}</h4>
                                        <p className="text-[10px] font-bold text-gray-400 leading-tight">{step.desc}</p>
                                    </div>
                                </div>
                                <div>
                                    {step.status === 'verified' ? (
                                        <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-1.5">
                                            <CheckCircle2 className="w-3 h-3" />
                                            {language === 'ar' ? 'موثق' : 'Verified'}
                                        </div>
                                    ) : step.status === 'pending' ? (
                                        <div className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-1.5">
                                            <AlertCircle className="w-3 h-3" />
                                            {language === 'ar' ? 'قيد المراجعة' : 'Pending'}
                                        </div>
                                    ) : (
                                        <button className="bg-primary text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase">
                                            {language === 'ar' ? 'ابدأ الأن' : 'Start Now'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10 text-start">
                    <div className="flex gap-4">
                        <ShieldAlert className="w-6 h-6 text-blue-500 shrink-0" />
                        <div>
                            <h4 className="text-xs font-black text-blue-600 mb-1">
                                {language === 'ar' ? 'لماذا أوثق حسابي؟' : 'Why verify my account?'}
                            </h4>
                            <p className="text-[10px] font-bold text-blue-600/70 leading-relaxed">
                                {language === 'ar' 
                                    ? 'التوثيق يساعدنا في التأكد من تواصلك مع مدربين حقيقيين ويحمي بياناتك وطلباتك من أي محاولات وصول غير مشروعة.' 
                                    : 'Verification helps us ensure you connect with real trainers and protects your data and requests from any unauthorized access attempts.'}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
