"use client";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Dumbbell, Calendar, Clock, AlertCircle, ChevronLeft, 
    X, CheckCircle, Info, PauseCircle, Play, ShieldAlert
} from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
    collection, query, where, getDocs, 
    addDoc, serverTimestamp, onSnapshot, orderBy, limit 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function TrainingPage() {
    const { t, language, user, loadingAuth, setAlert } = useApp();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('classes');
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
    const [freezeData, setFreezeData] = useState({ reason: '', startDate: '', endDate: '' });
    const [submitting, setSubmitting] = useState(false);

    // Freeze limit tracking
    const [freezeInfo, setFreezeInfo] = useState({
        maxFreezes: 0,
        usedFreezes: 0,
        remaining: 0,
        totalSessions: 0,
        loaded: false
    });

    const translations = t('trainingPage');

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const tab = searchParams.get('tab');
        if (tab === 'classes' || tab === 'programs') {
            setActiveTab(tab);
        }
    }, []);

    useEffect(() => {
        if (!loadingAuth && !user) {
            router.push('/login');
            return;
        }

        if (user) {
            // Listen to Training Schedules
            const q = query(
                collection(db, "training_schedules"), 
                where("userId", "==", user.uid)
            );

            const unsubClasses = onSnapshot(q, (snapshot) => {
                const classList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                // Sort by dayIdx (0-6) then by time (string)
                classList.sort((a, b) => {
                    const dayA = a.dayIdx ?? 0;
                    const dayB = b.dayIdx ?? 0;
                    if (dayA !== dayB) return dayA - dayB;
                    return (a.time || "").localeCompare(b.time || "");
                });

                setClasses(classList);
                setLoading(false);
            });

            // Listen to Active Programs
            const qProg = query(
                collection(db, "user_programs"), 
                where("userId", "==", user.uid)
            );
            const unsubProg = onSnapshot(qProg, (snapshot) => {
                const progList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const activeProgs = progList.filter(p => p.status === 'active' || p.isActive === true);
                setPrograms(activeProgs);
            });

            // Fetch freeze limit info
            const fetchFreezeInfo = async () => {
                try {
                    // Get active subscription
                    const subsQ = query(
                        collection(db, "subscriptions"),
                        where("userId", "==", user.uid),
                        orderBy("createdAt", "desc"),
                        limit(1)
                    );
                    const subsSnap = await getDocs(subsQ);
                    
                    if (!subsSnap.empty) {
                        const sub = { id: subsSnap.docs[0].id, ...subsSnap.docs[0].data() };
                        const months = sub.months || 1;
                        const sessionsPerWeek = sub.sessionsPerWeek || 3;
                        const totalSessions = sessionsPerWeek * months * 4;
                        const maxFreezes = Math.floor(totalSessions * 0.25);

                        // Count used freezes for this subscription
                        const freezeQ = query(
                            collection(db, "freeze_requests"),
                            where("userId", "==", user.uid),
                            where("subscriptionId", "==", sub.id)
                        );
                        const freezeSnap = await getDocs(freezeQ);
                        const approvedOrPending = freezeSnap.docs.filter(d => {
                            const status = d.data().status;
                            return status === 'approved' || status === 'pending';
                        }).length;

                        setFreezeInfo({
                            maxFreezes,
                            usedFreezes: approvedOrPending,
                            remaining: Math.max(0, maxFreezes - approvedOrPending),
                            totalSessions,
                            subscriptionId: sub.id,
                            loaded: true
                        });
                    } else {
                        setFreezeInfo(prev => ({ ...prev, loaded: true }));
                    }
                } catch (error) {
                    console.error("Error fetching freeze info:", error);
                    setFreezeInfo(prev => ({ ...prev, loaded: true }));
                }
            };

            fetchFreezeInfo();

            return () => {
                unsubClasses();
                unsubProg();
            };
        }
    }, [user, loadingAuth, router]);

    const handleFreezeSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        // Check freeze limit
        if (freezeInfo.remaining <= 0) {
            setAlert({
                title: language === 'ar' ? 'تم استنفاد الإيقافات' : 'Freeze Limit Reached',
                message: language === 'ar' 
                    ? `لقد استخدمت جميع الإيقافات المتاحة (${freezeInfo.maxFreezes} إيقاف)` 
                    : `You have used all available freezes (${freezeInfo.maxFreezes} freezes)`,
                type: 'error'
            });
            return;
        }

        setSubmitting(true);
        try {
            await addDoc(collection(db, "freeze_requests"), {
                userId: user.uid,
                userName: user.displayName || 'User',
                userEmail: user.email,
                subscriptionId: freezeInfo.subscriptionId || '',
                ...freezeData,
                status: 'pending',
                createdAt: serverTimestamp()
            });

            // Update local freeze count
            setFreezeInfo(prev => ({
                ...prev,
                usedFreezes: prev.usedFreezes + 1,
                remaining: Math.max(0, prev.remaining - 1)
            }));

            setAlert({
                title: language === 'ar' ? 'تم الإرسال' : 'Sent',
                message: translations.freeze.success
            });
            setIsFreezeModalOpen(false);
            setFreezeData({ reason: '', startDate: '', endDate: '' });
        } catch (error) {
            console.error("Error submitting freeze request:", error);
            setAlert({
                title: language === 'ar' ? 'خطأ' : 'Error',
                message: language === 'ar' ? 'حدث خطأ أثناء إرسال الطلب' : 'Error submitting request'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const daysAr = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    if (loading && !classes.length) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-6 text-center transition-colors">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                >
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-gray-500 dark:text-white/60 font-medium">{translations.generating}</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${language === 'ar' ? 'font-ar' : 'font-en'} bg-gray-50 dark:bg-black text-gray-900 dark:text-white pb-24 transition-colors`}>
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 px-6 py-5">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
                    >
                        {language === 'ar' ? <ChevronLeft className="rotate-180" /> : <ChevronLeft />}
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-tight">
                        {activeTab === 'classes' ? translations.tabs.classes : translations.tabs.programs}
                    </h1>
                </div>
            </header>

            <main className="p-6 max-w-4xl mx-auto">


                <AnimatePresence mode="wait">
                    {activeTab === 'classes' ? (
                        <motion.div 
                            key="classes"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {classes.length > 0 ? (
                                <div className="grid gap-4">
                                    {classes.map((item, idx) => (
                                        <div 
                                            key={item.id}
                                            className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2rem] p-6 flex flex-wrap items-center justify-between gap-4 group hover:border-primary/30 transition-all shadow-sm dark:shadow-none"
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                    <Dumbbell className="w-7 h-7" />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-lg text-gray-900 dark:text-white">{language === 'ar' ? item.name_ar : item.name_en}</h3>
                                                    <div className="flex items-center gap-3 text-gray-500 dark:text-white/50 text-sm mt-1">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {language === 'ar' ? daysAr[item.dayIdx] : daysEn[item.dayIdx]}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {item.time}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-3 ml-auto">
                                                <button 
                                                    onClick={() => setIsFreezeModalOpen(true)}
                                                    className="px-4 py-2 bg-gray-100 dark:bg-white/5 hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-gray-700 dark:text-white"
                                                >
                                                    <PauseCircle className="w-4 h-4" />
                                                    {translations.freeze.button}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white dark:bg-white/5 rounded-[3rem] border border-gray-200 dark:border-white/5 border-dashed">
                                    <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Calendar className="w-10 h-10 text-gray-400 dark:text-white/20" />
                                    </div>
                                    <h3 className="text-gray-500 dark:text-white/40 font-bold">{translations.emptyClasses}</h3>
                                    <p className="text-gray-400 dark:text-white/20 text-sm mt-2">{translations.generating}</p>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="programs"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {programs.length > 0 ? (
                                <div className="grid gap-4">
                                    {programs.map((prog) => (
                                        <div key={prog.id} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-sm dark:shadow-none">
                                            <div className="h-32 bg-gradient-to-br from-primary/20 to-gray-900 dark:to-black p-6 flex items-end">
                                                <h2 className="text-2xl font-black uppercase text-white">{language === 'ar' ? prog.name_ar : prog.name_en}</h2>
                                            </div>
                                            <div className="p-6 space-y-4">
                                                <p className="text-gray-600 dark:text-white/60 leading-relaxed">
                                                    {language === 'ar' ? prog.desc_ar : prog.desc_en}
                                                </p>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl">
                                                        <span className="text-xs text-gray-400 dark:text-white/40 block mb-1">{language === 'ar' ? 'المدة' : 'Duration'}</span>
                                                        <span className="font-bold text-gray-900 dark:text-white">{prog.weekCount} {language === 'ar' ? 'أسابيع' : 'Weeks'}</span>
                                                    </div>
                                                    <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl">
                                                        <span className="text-xs text-gray-400 dark:text-white/40 block mb-1">{language === 'ar' ? 'المستوى' : 'Level'}</span>
                                                        <span className="font-bold text-gray-900 dark:text-white">{language === 'ar' ? prog.level_ar : prog.level_en}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white dark:bg-white/5 rounded-[3rem] border border-gray-200 dark:border-white/5 border-dashed">
                                    <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Trophy className="w-10 h-10 text-gray-400 dark:text-white/20" />
                                    </div>
                                    <h3 className="text-gray-500 dark:text-white/40 font-bold">{translations.emptyPrograms}</h3>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Freeze Request Modal */}
            <AnimatePresence>
                {isFreezeModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFreezeModalOpen(false)}
                            className="absolute inset-0 bg-gray-900/60 dark:bg-black/80 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden text-gray-900 dark:text-white"
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
                                            <PauseCircle className="w-6 h-6" />
                                        </div>
                                        <h2 className="text-xl font-black">{translations.freeze.title}</h2>
                                    </div>
                                    <button 
                                        onClick={() => setIsFreezeModalOpen(false)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400 dark:text-white/40"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Freeze Balance Info */}
                                {freezeInfo.loaded && (
                                    <div className={`mb-6 p-4 rounded-2xl border ${freezeInfo.remaining > 0 ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20' : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20'}`}>
                                        <div className="flex items-center gap-3 mb-2">
                                            <ShieldAlert className={`w-5 h-5 ${freezeInfo.remaining > 0 ? 'text-blue-500' : 'text-red-500'}`} />
                                            <span className={`text-sm font-black ${freezeInfo.remaining > 0 ? 'text-blue-700 dark:text-blue-300' : 'text-red-700 dark:text-red-300'}`}>
                                                {language === 'ar' ? 'رصيد الإيقافات' : 'Freeze Balance'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                                {language === 'ar' 
                                                    ? `${freezeInfo.usedFreezes} من ${freezeInfo.maxFreezes} مستخدمة`
                                                    : `${freezeInfo.usedFreezes} of ${freezeInfo.maxFreezes} used`}
                                            </span>
                                            <span className={`text-lg font-black ${freezeInfo.remaining > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                                                {freezeInfo.remaining} {language === 'ar' ? 'متبقي' : 'remaining'}
                                            </span>
                                        </div>
                                        {/* Progress bar */}
                                        <div className="mt-2 h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all ${freezeInfo.remaining > 0 ? 'bg-blue-500' : 'bg-red-500'}`}
                                                style={{ width: `${freezeInfo.maxFreezes > 0 ? (freezeInfo.usedFreezes / freezeInfo.maxFreezes) * 100 : 0}%` }}
                                            />
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wider">
                                            {language === 'ar' 
                                                ? `25% من إجمالي الحصص (${freezeInfo.totalSessions} حصة)`
                                                : `25% of total sessions (${freezeInfo.totalSessions} sessions)`}
                                        </p>
                                    </div>
                                )}

                                {freezeInfo.remaining <= 0 && freezeInfo.loaded ? (
                                    <div className="text-center py-8 space-y-3">
                                        <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                                            <ShieldAlert className="w-8 h-8 text-red-500" />
                                        </div>
                                        <h3 className="text-lg font-black text-red-600 dark:text-red-400">
                                            {language === 'ar' ? 'تم استنفاد جميع الإيقافات' : 'All Freezes Used'}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {language === 'ar' 
                                                ? 'لقد استخدمت جميع الإيقافات المتاحة لهذا الاشتراك.'
                                                : 'You have used all available freezes for this subscription.'}
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleFreezeSubmit} className="space-y-6">
                                        <div>
                                            <label className="text-sm font-bold text-gray-600 dark:text-white/60 mb-2 block">{translations.freeze.reason}</label>
                                            <textarea 
                                                required
                                                value={freezeData.reason}
                                                onChange={(e) => setFreezeData({...freezeData, reason: e.target.value})}
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white focus:border-red-500/50 transition-colors outline-none h-32 resize-none"
                                                placeholder="..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-bold text-gray-600 dark:text-white/60 mb-2 block">{translations.freeze.startDate}</label>
                                                <input 
                                                    type="date"
                                                    required
                                                    value={freezeData.startDate}
                                                    onChange={(e) => setFreezeData({...freezeData, startDate: e.target.value})}
                                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white focus:border-red-500/50 transition-colors outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-bold text-gray-600 dark:text-white/60 mb-2 block">{translations.freeze.endDate}</label>
                                                <input 
                                                    type="date"
                                                    required
                                                    value={freezeData.endDate}
                                                    onChange={(e) => setFreezeData({...freezeData, endDate: e.target.value})}
                                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white focus:border-red-500/50 transition-colors outline-none"
                                                />
                                            </div>
                                        </div>

                                        <button 
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-red-600/20 active:scale-95 disabled:opacity-50"
                                        >
                                            {submitting ? '...' : translations.freeze.submit}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function Trophy(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
    )
}
