"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, CreditCard, Shield,
    Star, Sparkles, QrCode, User, Calendar, Dumbbell
} from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { useRouter } from 'next/navigation';
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { QRCodeSVG } from 'qrcode.react';

export default function MembershipCard() {
    const { language, darkMode, userData } = useApp();
    const router = useRouter();
    const [authUser] = useAuthState(auth);
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscription = async () => {
            if (!authUser) return;
            try {
                const subsRef = collection(db, "subscriptions");
                const q = query(
                    subsRef,
                    where("userId", "==", authUser.uid),
                    where("status", "in", ["confirmed", "pending"]),
                    orderBy("createdAt", "desc"),
                    limit(1)
                );
                const snap = await getDocs(q);
                if (!snap.empty) {
                    const doc = snap.docs[0];
                    setSubscription({ id: doc.id, ...doc.data() });
                }
            } catch (err) {
                console.error("Error fetching subscription:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSubscription();
    }, [authUser]);

    const getText = (field) => {
        if (!field) return '';
        if (typeof field === 'object') return field[language] || field['ar'] || field['en'] || '';
        return field;
    };

    const userName = authUser?.displayName || userData?.name || (language === 'ar' ? 'عضو كابتينا' : 'Captina Member');
    const memberSince = authUser?.metadata?.creationTime 
        ? new Date(authUser.metadata.creationTime).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'short' })
        : '';

    const qrData = JSON.stringify({
        uid: authUser?.uid || '',
        name: userName,
        subId: subscription?.id || 'none',
        t: Date.now()
    });

    if (loading) {
        return (
            <div className={`min-h-screen ${darkMode ? 'bg-[#0a0f1a]' : 'bg-slate-50'} flex items-center justify-center`}>
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-[#0a0f1a]' : 'bg-slate-50'} relative overflow-hidden pb-32`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[140px] translate-x-1/3 -translate-y-1/3 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3"></div>

            {/* Header */}
            <div className="max-w-lg mx-auto px-6 pt-6">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => router.back()}
                        className={`w-12 h-12 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} border rounded-2xl flex items-center justify-center hover:bg-primary/10 hover:border-primary/20 transition-all active:scale-95`}
                    >
                        {language === 'ar' ? <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-slate-900'}`} /> : <ChevronLeft className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-slate-900'}`} />}
                    </button>
                    <div className="flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-primary" />
                        <span className={`text-xs font-black uppercase tracking-[0.2em] ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            {language === 'ar' ? 'بطاقة العضوية' : 'Membership Card'}
                        </span>
                    </div>
                    <div className="w-12"></div>
                </div>
            </div>

            {/* Card */}
            <div className="max-w-lg mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30, rotateX: 10 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative"
                >
                    {/* Main Card */}
                    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] border border-white/10">
                        {/* Card Pattern */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{
                            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, white 20px, white 21px)`,
                        }}></div>
                        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px]"></div>
                        <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-500/15 rounded-full blur-[80px]"></div>

                        {/* Card Header */}
                        <div className="relative z-10 px-8 pt-8 pb-4 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                                        <Dumbbell className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-white text-sm font-black tracking-tight uppercase">CAPTINA</span>
                                </div>
                                <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em]">
                                    {language === 'ar' ? 'بطاقة عضوية رقمية' : 'Digital Membership'}
                                </p>
                            </div>
                            <div className="text-end">
                                {subscription ? (
                                    <div className="flex items-center gap-1.5 bg-emerald-500/20 px-3 py-1.5 rounded-full border border-emerald-500/30">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                                            {language === 'ar' ? 'نشطة' : 'Active'}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 bg-amber-500/20 px-3 py-1.5 rounded-full border border-amber-500/30">
                                        <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">
                                            {language === 'ar' ? 'غير مشترك' : 'No Plan'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* QR Code Section */}
                        <div className="relative z-10 flex justify-center py-6">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="bg-white p-4 rounded-[1.5rem] shadow-2xl shadow-black/30"
                            >
                                <QRCodeSVG
                                    value={qrData}
                                    size={180}
                                    level="H"
                                    bgColor="#ffffff"
                                    fgColor="#0f172a"
                                    imageSettings={{
                                        src: "/logo.png",
                                        width: 36,
                                        height: 36,
                                        excavate: true,
                                    }}
                                />
                            </motion.div>
                        </div>

                        {/* Divider */}
                        <div className="relative z-10 px-6">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-slate-900 rounded-full -ml-9 border-2 border-white/5"></div>
                                <div className="flex-1 border-t-2 border-dashed border-white/10"></div>
                                <div className="w-6 h-6 bg-slate-900 rounded-full -mr-9 border-2 border-white/5"></div>
                            </div>
                        </div>

                        {/* Member Info */}
                        <div className="relative z-10 px-8 py-6">
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white shadow-lg shadow-primary/30 border-2 border-white/10 overflow-hidden">
                                    {authUser?.photoURL ? (
                                        <img src={authUser.photoURL} referrerPolicy="no-referrer" className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <User className="w-7 h-7" />
                                    )}
                                </div>
                                <div className="text-start">
                                    <h2 className="text-white text-lg font-black tracking-tight">{userName}</h2>
                                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                                        {language === 'ar' ? 'عضو منذ' : 'Member since'} {memberSince}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                    <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">
                                        {language === 'ar' ? 'نوع الباقة' : 'Plan Type'}
                                    </p>
                                    <p className="text-xs font-black text-white truncate">
                                        {subscription
                                            ? getText(subscription.planName) || getText(subscription.sportName) || (language === 'ar' ? 'اشتراك فعّال' : 'Active Plan')
                                            : (language === 'ar' ? 'بدون باقة' : 'No Plan')
                                        }
                                    </p>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                    <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">
                                        {language === 'ar' ? 'رقم العضوية' : 'Member ID'}
                                    </p>
                                    <p className="text-xs font-black text-primary font-mono truncate">
                                        {authUser?.uid?.slice(0, 8)?.toUpperCase() || '---'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Instructions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className={`mt-8 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} border rounded-[2rem] p-6`}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className={`text-sm font-black ${darkMode ? 'text-white' : 'text-slate-900'} uppercase tracking-wider`}>
                            {language === 'ar' ? 'كيفية الاستخدام' : 'How to Use'}
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {[
                            language === 'ar' ? 'أظهر هذه البطاقة للمدرب عند بداية الحصة' : 'Show this card to the trainer at session start',
                            language === 'ar' ? 'سيقوم المدرب بمسح الكود لتسجيل حضورك' : 'Trainer will scan the code to log your attendance',
                            language === 'ar' ? 'يتم تحديث الكود تلقائياً للأمان' : 'Code auto-refreshes for security',
                        ].map((text, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-7 h-7 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-100'} flex items-center justify-center text-[10px] font-black text-primary`}>
                                    {i + 1}
                                </div>
                                <p className={`text-xs font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{text}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Back to Profile */}
                {!subscription && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        onClick={() => router.push('/packages')}
                        className="mt-6 w-full bg-primary text-white py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <Sparkles className="w-4 h-4" />
                        {language === 'ar' ? 'اشترك الآن' : 'Subscribe Now'}
                    </motion.button>
                )}
            </div>
        </div>
    );
}
