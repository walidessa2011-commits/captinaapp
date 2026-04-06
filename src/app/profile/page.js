"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Settings, Package, Calendar, LogOut, ChevronLeft, ChevronRight,
    TrendingUp, Target, MapPin, ShoppingBag, Trophy, Clock, Camera,
    Star, MessageCircle, CreditCard, ShieldCheck, Heart, Dumbbell,
    Phone, Mail, QrCode, Sparkles, Users, Edit3, Bell,
    CheckCircle2, AlertCircle, Flame, Award, BookOpen, ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { useState, useEffect, useRef, useMemo } from "react";
import { signOut, updateProfile } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
    updateDoc, doc, collection, query, where,
    getDocs, limit, orderBy, onSnapshot, addDoc, serverTimestamp
} from "firebase/firestore";
import { storage, auth, db } from "@/lib/firebase";

export default function Profile() {
    const {
        t, language, darkMode, setAlert,
        favorites, products, toggleFavorite,
        favoriteTrainers, toggleFavoriteTrainer, trainers,
        favoriteSports, toggleFavoriteSport, sports,
        user, userData, loadingAuth,
        addToCart, setIsCartOpen,
    } = useApp();

    const ar = language === 'ar';
    const router = useRouter();
    const searchParams = useSearchParams();
    const needsCompletion = searchParams.get('complete') === 'true';
    const profileInputRef = useRef(null);
    const coverInputRef = useRef(null);

    const [activeSubscription, setActiveSubscription] = useState(null);
    const [upcomingSchedules, setUpcomingSchedules] = useState([]);
    const [trainingStats, setTrainingStats] = useState({ sessions: 0, activeSports: 0, streak: 0 });
    const [loadingSub, setLoadingSub] = useState(true);
    const [loadingSchedules, setLoadingSchedules] = useState(true);
    const [uploading, setUploading] = useState({ profile: false, cover: false });
    const [requestLoading, setRequestLoading] = useState(false);
    const [showSubOptions, setShowSubOptions] = useState(false);
    const [activeSection, setActiveSection] = useState(() =>
        typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('complete') === 'true'
            ? 'settings'
            : 'overview'
    ); // overview | training | favorites | settings

    const bg = darkMode ? 'bg-[#0a0f1a]' : 'bg-slate-50';
    const card = darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100';
    const textC = darkMode ? 'text-white' : 'text-slate-900';
    const muted = darkMode ? 'text-gray-400' : 'text-gray-500';

    const getText = (f) => !f ? '' : typeof f === 'object' ? f[language] || f.ar || f.en || '' : f;

    // ── Data Fetching ──────────────────────────────────────────────
    useEffect(() => {
        if (!loadingAuth && !user) { router.push('/login'); return; }
        if (!user) return;

        // Subscription listener
        const subQ = query(collection(db, "subscriptions"), where("userId", "==", user.uid), orderBy("createdAt", "desc"), limit(1));
        const unsubSub = onSnapshot(subQ, snap => {
            setActiveSubscription(snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() });
            setLoadingSub(false);
        }, () => setLoadingSub(false));

        // Schedules listener
        const schedQ = query(collection(db, "training_schedules"), where("userId", "==", user.uid));
        const unsubSched = onSnapshot(schedQ, async snap => {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            const now = new Date();
            const curDay = now.getDay();
            const curMins = now.getHours() * 60 + now.getMinutes();
            const toMins = (t) => {
                if (!t) return 0;
                const [time, period] = t.includes(' ') ? t.split(' ') : [t, 'AM'];
                let [h, m] = time.split(':').map(Number);
                if (period === 'PM' && h !== 12) h += 12;
                if (period === 'AM' && h === 12) h = 0;
                return h * 60 + (m || 0);
            };
            const sorted = list.map(s => {
                const sm = toMins(s.time);
                let d = (s.dayIdx - curDay + 7) % 7;
                if (d === 0 && sm <= curMins) d = 7;
                return { ...s, daysUntil: d, _sort: d * 1440 + sm };
            }).sort((a, b) => a._sort - b._sort);
            setUpcomingSchedules(sorted);

            // Stats
            try {
                const completedSnap = await getDocs(query(collection(db, "bookings"), where("userId", "==", user.uid), where("status", "==", "completed")));
                setTrainingStats({
                    sessions: completedSnap.size,
                    activeSports: new Set(list.map(s => s.name_en || s.name_ar)).size,
                    streak: userData?.streak || 0,
                });
            } catch (e) { /* ignore */ }
            setLoadingSchedules(false);
        }, () => setLoadingSchedules(false));

        return () => { unsubSub(); unsubSched(); };
    }, [user, loadingAuth, router]);

    // ── Image Upload ───────────────────────────────────────────────
    const handleImageUpload = async (file, type) => {
        if (!file || !user) return;
        setUploading(p => ({ ...p, [type]: true }));
        try {
            const fileRef = ref(storage, `users/${user.uid}/${type}_${Date.now()}`);
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);
            await updateDoc(doc(db, "users", user.uid), { [type === 'profile' ? 'photoURL' : 'coverURL']: url });
            if (type === 'profile') await updateProfile(user, { photoURL: url });
            setAlert({ title: ar ? 'تم التحديث' : 'Updated', message: ar ? 'تم تحديث الصورة بنجاح' : 'Image updated successfully', type: 'success' });
        } catch {
            setAlert({ title: ar ? 'خطأ' : 'Error', message: ar ? 'فشل رفع الصورة' : 'Upload failed', type: 'error' });
        } finally { setUploading(p => ({ ...p, [type]: false })); }
    };

    // ── Subscription Request ───────────────────────────────────────
    const handleSubRequest = async (type) => {
        if (!user || !activeSubscription) return;
        setRequestLoading(true);
        try {
            await addDoc(collection(db, "subscription_requests"), {
                userId: user.uid, currentSubscriptionId: activeSubscription.id,
                type, status: 'pending', createdAt: serverTimestamp()
            });
            setAlert({ title: ar ? 'تم إرسال الطلب' : 'Request Sent', message: ar ? 'سيتواصل معك فريق الدعم قريباً' : 'Support team will contact you soon', type: 'success' });
            setShowSubOptions(false);
        } catch {
            setAlert({ title: ar ? 'خطأ' : 'Error', message: ar ? 'حدث خطأ، حاول مجدداً' : 'Error, try again', type: 'error' });
        } finally { setRequestLoading(false); }
    };

    const handleLogout = () => {
        setAlert({
            title: ar ? 'تسجيل الخروج' : 'Logout',
            message: ar ? 'هل أنت متأكد من الخروج؟' : 'Are you sure you want to logout?',
            type: 'confirm',
            onConfirm: async () => { await signOut(auth); router.push('/login'); }
        });
    };

    if (loadingAuth || (user && loadingSub)) return (
        <div className={`min-h-screen ${bg} flex items-center justify-center`}>
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const name = getText(userData?.fullName) || user?.displayName || (ar ? 'مستخدم' : 'User');
    const photo = userData?.photoURL || user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ff0000&color=fff&size=128`;
    const cover = userData?.coverURL || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200';

    const subStatus = activeSubscription?.status;
    const subStatusColor = subStatus === 'active' || subStatus === 'confirmed' ? 'text-emerald-500 bg-emerald-100 dark:bg-emerald-500/15' :
        subStatus === 'paused' ? 'text-amber-500 bg-amber-100 dark:bg-amber-500/15' :
        subStatus === 'pending' ? 'text-blue-500 bg-blue-100 dark:bg-blue-500/15' :
        'text-gray-500 bg-gray-100 dark:bg-gray-500/15';
    const subStatusLabel = subStatus === 'active' || subStatus === 'confirmed' ? (ar ? 'نشط' : 'Active') :
        subStatus === 'paused' ? (ar ? 'موقوف' : 'Paused') :
        subStatus === 'pending' ? (ar ? 'قيد المراجعة' : 'Pending') :
        subStatus === 'expired' ? (ar ? 'منتهي' : 'Expired') : (ar ? 'غير مشترك' : 'No Plan');

    const totalSessions = activeSubscription?.totalSessions || 0;
    const consumedSessions = activeSubscription?.consumedSessions || 0;
    const remainingSessions = Math.max(0, totalSessions - consumedSessions);
    const sessionsProgress = totalSessions > 0 ? (remainingSessions / totalSessions) * 100 : 0;

    const DAY_NAMES_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const DAY_NAMES_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const sections = [
        { k: 'overview', label: ar ? 'نظرة عامة' : 'Overview', icon: User },
        { k: 'training', label: ar ? 'التدريب' : 'Training', icon: Dumbbell },
        { k: 'favorites', label: ar ? 'المفضلة' : 'Favorites', icon: Heart },
        { k: 'settings', label: ar ? 'الإعدادات' : 'Settings', icon: Settings },
    ];

    return (
        <div className={`min-h-screen ${bg} pb-32 transition-colors duration-300 relative overflow-hidden`} dir={ar ? 'rtl' : 'ltr'}>
            {/* BG */}
            <div className="fixed top-0 left-0 w-96 h-96 bg-primary/8 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
            <div className="fixed bottom-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* ── Profile Completion Banner ── */}
            {needsCompletion && (
                <div className="relative z-10 mx-4 mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-black text-amber-800 dark:text-amber-300 text-sm">
                            {ar ? 'أكمل بياناتك الشخصية أولاً' : 'Complete Your Profile First'}
                        </p>
                        <p className="text-amber-600 dark:text-amber-400 text-xs font-bold mt-0.5">
                            {ar ? 'يجب إدخال الاسم ورقم الهاتف قبل الحجز أو الاشتراك أو الشراء' : 'Name and phone number are required before booking, subscribing, or purchasing'}
                        </p>
                    </div>
                </div>
            )}

            {/* ── Cover + Avatar ── */}
            <div className="relative">
                <div className="h-36 md:h-48 relative overflow-hidden">
                    <img src={cover} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
                    <button onClick={() => coverInputRef.current?.click()}
                        className="absolute top-4 end-4 w-9 h-9 bg-black/30 backdrop-blur-md text-white rounded-xl border border-white/20 flex items-center justify-center hover:bg-black/50 transition-all active:scale-95">
                        <Camera className="w-4 h-4" />
                        <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e.target.files[0], 'cover')} />
                    </button>
                </div>

                {/* Avatar */}
                <div className="absolute -bottom-12 start-6">
                    <div className="relative">
                        <img src={photo} alt={name} className="w-24 h-24 rounded-2xl border-4 border-white dark:border-[#0a0f1a] object-cover shadow-xl" />
                        <button onClick={() => profileInputRef.current?.click()}
                            className="absolute -bottom-1 -end-1 w-7 h-7 bg-primary text-white rounded-lg flex items-center justify-center shadow-lg border-2 border-white dark:border-[#0a0f1a] active:scale-90 transition-all">
                            <Camera className="w-3 h-3" />
                            <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e.target.files[0], 'profile')} />
                        </button>
                        {uploading.profile && <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /></div>}
                    </div>
                </div>
            </div>

            {/* ── Name + Info ── */}
            <div className="pt-16 px-6 max-w-2xl mx-auto">
                <div className="flex items-start justify-between mb-1">
                    <div>
                        <h1 className={`text-xl font-black ${textC} tracking-tight`}>{name}</h1>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                            {user?.email && <span className={`text-[10px] font-bold ${muted} flex items-center gap-1`}><Mail className="w-3 h-3" />{user.email}</span>}
                            {userData?.phone && <span className={`text-[10px] font-bold ${muted} flex items-center gap-1`}><Phone className="w-3 h-3" />{userData.phone}</span>}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <Link href="/profile/edit" className={`p-2.5 ${card} border rounded-xl hover:border-primary/30 transition-all active:scale-95`}>
                            <Edit3 className={`w-4 h-4 ${muted}`} />
                        </Link>
                        <Link href="/notifications" className={`p-2.5 ${card} border rounded-xl hover:border-primary/30 transition-all active:scale-95`}>
                            <Bell className={`w-4 h-4 ${muted}`} />
                        </Link>
                    </div>
                </div>

                {/* Membership badge */}
                <div className="flex items-center gap-2 mt-2 mb-5">
                    <span className="text-[9px] font-black text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                        <Award className="w-2.5 h-2.5" />{ar ? 'عضو ذهبي' : 'Gold Member'}
                    </span>
                    {userData?.has_used_trial && (
                        <span className={`text-[9px] font-black ${muted} bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest`}>
                            {ar ? 'جرّب التجربة' : 'Trial Used'}
                        </span>
                    )}
                </div>

                {/* ── Stats Row ── */}
                <div className={`grid grid-cols-3 gap-3 mb-6 p-4 ${card} border rounded-[1.5rem]`}>
                    {[
                        { icon: Dumbbell, val: trainingStats.sessions, label: ar ? 'حصص مكتملة' : 'Sessions', color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
                        { icon: Target, val: trainingStats.activeSports, label: ar ? 'رياضات نشطة' : 'Sports', color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' },
                        { icon: Flame, val: trainingStats.streak, label: ar ? 'أيام متواصلة' : 'Day Streak', color: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10' },
                    ].map(({ icon: Icon, val, label, color }, i) => (
                        <div key={i} className="flex flex-col items-center text-center">
                            <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center mb-2`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <span className={`text-xl font-black ${textC}`}>{val}</span>
                            <span className={`text-[8px] font-bold uppercase tracking-wider ${muted} mt-0.5`}>{label}</span>
                        </div>
                    ))}
                </div>

                {/* ── Section Tabs ── */}
                <div className={`flex gap-1 p-1 ${darkMode ? 'bg-white/5' : 'bg-gray-100'} rounded-2xl mb-6`}>
                    {sections.map(({ k, label, icon: Icon }) => (
                        <button key={k} onClick={() => setActiveSection(k)}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${activeSection === k ? 'bg-white dark:bg-white/10 text-primary shadow-sm' : `${muted} hover:text-primary`}`}>
                            <Icon className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{label}</span>
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">

                    {/* ── OVERVIEW ── */}
                    {activeSection === 'overview' && (
                        <motion.div key="ov" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">

                            {/* Subscription Card */}
                            <div className={`${card} border rounded-[1.5rem] overflow-hidden`}>
                                <div className={`px-5 py-4 border-b ${darkMode ? 'border-white/5' : 'border-gray-50'} flex items-center justify-between`}>
                                    <div className="flex items-center gap-2">
                                        <Package className="w-4 h-4 text-primary" />
                                        <span className={`text-xs font-black ${textC} uppercase tracking-wider`}>{ar ? 'اشتراكي الحالي' : 'My Subscription'}</span>
                                    </div>
                                    {activeSubscription && (
                                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-full ${subStatusColor}`}>{subStatusLabel}</span>
                                    )}
                                </div>

                                <div className="p-5">
                                    {activeSubscription ? (
                                        <div className="space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className={`text-sm font-black ${textC}`}>{getText(activeSubscription.planLabel) || getText(activeSubscription.sportName) || (ar ? 'اشتراك نشط' : 'Active Plan')}</p>
                                                    <p className={`text-[10px] font-bold ${muted} mt-0.5`}>
                                                        {activeSubscription.startDate && `${ar ? 'من' : 'From'} ${activeSubscription.startDate}`}
                                                        {activeSubscription.endDate && ` ${ar ? 'حتى' : 'to'} ${activeSubscription.endDate}`}
                                                    </p>
                                                </div>
                                                <Link href="/profile/card" className={`p-2 ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'} rounded-xl transition-all`}>
                                                    <QrCode className={`w-4 h-4 ${muted}`} />
                                                </Link>
                                            </div>

                                            {totalSessions > 0 && (
                                                <div>
                                                    <div className="flex justify-between text-[10px] font-bold mb-1.5">
                                                        <span className={muted}>{ar ? 'الحصص المتبقية' : 'Sessions Left'}</span>
                                                        <span className={`font-black ${sessionsProgress <= 25 ? 'text-rose-500' : sessionsProgress <= 50 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                                            {remainingSessions}/{totalSessions}
                                                        </span>
                                                    </div>
                                                    <div className={`h-2 ${darkMode ? 'bg-white/10' : 'bg-gray-100'} rounded-full overflow-hidden`}>
                                                        <motion.div initial={{ width: 0 }} animate={{ width: `${sessionsProgress}%` }} transition={{ duration: 1 }}
                                                            className={`h-full rounded-full ${sessionsProgress <= 25 ? 'bg-rose-500' : sessionsProgress <= 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Sub Options */}
                                            <div className="relative">
                                                <button onClick={() => setShowSubOptions(s => !s)}
                                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black border ${darkMode ? 'border-white/10 text-gray-300 hover:bg-white/5' : 'border-gray-200 text-gray-600 hover:bg-gray-50'} transition-all`}>
                                                    {ar ? 'خيارات الاشتراك' : 'Subscription Options'}
                                                    <ChevronDown className={`w-4 h-4 transition-transform ${showSubOptions ? 'rotate-180' : ''}`} />
                                                </button>
                                                <AnimatePresence>
                                                    {showSubOptions && (
                                                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                                            className={`absolute top-full inset-x-0 mt-1.5 ${darkMode ? 'bg-[#1a2235]' : 'bg-white'} border ${darkMode ? 'border-white/10' : 'border-gray-100'} rounded-2xl shadow-xl p-1.5 z-10 space-y-0.5`}>
                                                            {[
                                                                { k: 'renew', label: ar ? 'طلب تجديد الاشتراك' : 'Request Renewal', icon: TrendingUp },
                                                                { k: 'upgrade', label: ar ? 'طلب ترقية الباقة' : 'Request Upgrade', icon: Sparkles },
                                                                { k: 'change_sport', label: ar ? 'طلب تغيير الرياضة' : 'Request Sport Change', icon: Target },
                                                            ].map(({ k, label, icon: Icon }) => (
                                                                <button key={k} disabled={requestLoading} onClick={() => handleSubRequest(k)}
                                                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold ${darkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-50'} transition-all disabled:opacity-50 text-start`}>
                                                                    <Icon className="w-4 h-4 text-primary" />
                                                                    {label}
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center space-y-4 py-2">
                                            <div className={`w-14 h-14 ${darkMode ? 'bg-white/5' : 'bg-gray-50'} rounded-full flex items-center justify-center mx-auto`}>
                                                <Package className="w-7 h-7 text-gray-300" />
                                            </div>
                                            <div>
                                                <p className={`text-sm font-black ${textC} mb-1`}>{ar ? 'لا يوجد اشتراك نشط' : 'No Active Subscription'}</p>
                                                <p className={`text-xs font-bold ${muted}`}>{ar ? 'اشترك الآن للبدء في رحلتك التدريبية' : 'Subscribe now to start your training journey'}</p>
                                            </div>
                                            {!userData?.has_used_trial ? (
                                                <button onClick={() => router.push('/booking?trial=true')}
                                                    className="w-full py-3 bg-emerald-500 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all">
                                                    <Sparkles className="w-4 h-4" />
                                                    {ar ? 'احجز حصة مجانية' : 'Book Free Trial'}
                                                </button>
                                            ) : (
                                                <button onClick={() => router.push('/packages')}
                                                    className="w-full py-3 bg-primary text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all">
                                                    {ar ? 'اشترك الآن' : 'Subscribe Now'}
                                                    {ar ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quick Links Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { href: '/profile/orders', icon: ShoppingBag, label: ar ? 'طلباتي' : 'My Orders', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' },
                                    { href: '/profile/card', icon: QrCode, label: ar ? 'بطاقتي' : 'My Card', color: 'text-slate-500 bg-slate-100 dark:bg-slate-500/10', dark: true },
                                    { href: '/profile/bookings', icon: Calendar, label: ar ? 'حجوزاتي' : 'Bookings', color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
                                    { href: '/profile/achievements', icon: Trophy, label: ar ? 'إنجازاتي' : 'Achievements', color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' },
                                    { href: '/profile/training', icon: Dumbbell, label: ar ? 'جدول التدريب' : 'Schedule', color: 'text-primary bg-primary/10' },
                                    { href: '/profile/addresses', icon: MapPin, label: ar ? 'عناويني' : 'Addresses', color: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10' },
                                ].map(({ href, icon: Icon, label, color, dark }) => (
                                    <Link key={href} href={href}
                                        className={`${dark ? 'bg-slate-900 border-white/10 text-white' : `${card} border ${textC}`} rounded-2xl p-4 flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm`}>
                                        <div className={`w-10 h-10 ${dark ? 'bg-white/10' : color} rounded-xl flex items-center justify-center shrink-0`}>
                                            <Icon className={`w-5 h-5 ${dark ? 'text-white' : color.split(' ')[0]}`} />
                                        </div>
                                        <span className="text-xs font-black">{label}</span>
                                        {ar ? <ChevronLeft className="w-4 h-4 ms-auto opacity-30" /> : <ChevronRight className="w-4 h-4 ms-auto opacity-30" />}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ── TRAINING ── */}
                    {activeSection === 'training' && (
                        <motion.div key="tr" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                            <div className={`${card} border rounded-[1.5rem] overflow-hidden`}>
                                <div className={`px-5 py-4 border-b ${darkMode ? 'border-white/5' : 'border-gray-50'} flex items-center justify-between`}>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        <span className={`text-xs font-black ${textC}`}>{ar ? 'الحصص القادمة' : 'Upcoming Sessions'}</span>
                                    </div>
                                    <Link href="/profile/training" className="text-[10px] font-black text-primary">{ar ? 'عرض الكل' : 'View All'}</Link>
                                </div>
                                <div className="p-4 space-y-2">
                                    {loadingSchedules ? (
                                        <div className="py-8 flex justify-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
                                    ) : upcomingSchedules.length > 0 ? upcomingSchedules.slice(0, 4).map((s, i) => (
                                        <div key={s.id} className={`flex items-center gap-3 p-3 ${darkMode ? 'bg-white/5 hover:bg-white/8' : 'bg-gray-50 hover:bg-gray-100'} rounded-xl transition-all`}>
                                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                                <Dumbbell className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-xs font-black ${textC}`}>{ar ? (s.name_ar || s.name_en) : (s.name_en || s.name_ar)}</p>
                                                <p className={`text-[10px] font-bold ${muted}`}>{ar ? DAY_NAMES_AR[s.dayIdx] : DAY_NAMES_EN[s.dayIdx]} • {s.time}</p>
                                            </div>
                                            <span className={`text-[9px] font-black px-2 py-1 rounded-full ${s.daysUntil === 0 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400' : 'bg-primary/10 text-primary'}`}>
                                                {s.daysUntil === 0 ? (ar ? 'اليوم' : 'Today') : s.daysUntil === 1 ? (ar ? 'غداً' : 'Tomorrow') : `${ar ? 'بعد' : 'In'} ${s.daysUntil} ${ar ? 'أيام' : 'days'}`}
                                            </span>
                                        </div>
                                    )) : (
                                        <div className="py-10 text-center">
                                            <Clock className={`w-8 h-8 ${muted} mx-auto mb-3 opacity-40`} />
                                            <p className={`text-xs font-bold ${muted}`}>{ar ? 'لا توجد حصص مجدولة' : 'No scheduled sessions'}</p>
                                            <Link href="/booking" className="mt-3 inline-block text-xs font-black text-primary">{ar ? 'احجز حصة' : 'Book a Session'}</Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Achievements */}
                            <div className={`${card} border rounded-[1.5rem] overflow-hidden`}>
                                <div className={`px-5 py-4 border-b ${darkMode ? 'border-white/5' : 'border-gray-50'} flex items-center justify-between`}>
                                    <div className="flex items-center gap-2">
                                        <Trophy className="w-4 h-4 text-amber-500" />
                                        <span className={`text-xs font-black ${textC}`}>{ar ? 'الإنجازات' : 'Achievements'}</span>
                                    </div>
                                    <Link href="/profile/achievements" className="text-[10px] font-black text-primary">{ar ? 'عرض الكل' : 'View All'}</Link>
                                </div>
                                <div className="p-4 grid grid-cols-4 gap-3">
                                    {[
                                        { icon: Flame, label: ar ? 'المثابر' : 'Streak', color: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10', unlocked: trainingStats.streak >= 7 },
                                        { icon: Trophy, label: ar ? 'الوحش' : 'Beast', color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10', unlocked: trainingStats.sessions >= 20 },
                                        { icon: Star, label: ar ? 'النجم' : 'Star', color: 'text-violet-500 bg-violet-50 dark:bg-violet-500/10', unlocked: true },
                                        { icon: Target, label: ar ? 'متعدد' : 'Multi', color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10', unlocked: trainingStats.activeSports >= 2 },
                                    ].map(({ icon: Icon, label, color, unlocked }, i) => (
                                        <div key={i} className={`flex flex-col items-center gap-1.5 p-3 ${darkMode ? 'bg-white/5' : 'bg-gray-50'} rounded-2xl ${!unlocked ? 'opacity-40 grayscale' : ''}`}>
                                            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <span className={`text-[9px] font-black ${textC} text-center`}>{label}</span>
                                            {unlocked && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ── FAVORITES ── */}
                    {activeSection === 'favorites' && (
                        <motion.div key="fav" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                            {/* Favorite Trainers */}
                            <div>
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <span className={`text-xs font-black ${textC} flex items-center gap-2`}><Users className="w-4 h-4 text-primary" />{ar ? 'المدربون المفضلون' : 'Favorite Trainers'}</span>
                                    <Link href="/trainers" className="text-[10px] font-black text-primary">{ar ? 'اكتشف المزيد' : 'Discover More'}</Link>
                                </div>
                                {favoriteTrainers.length > 0 ? (
                                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                        {trainers.filter(tr => favoriteTrainers.includes(tr.id)).map(trainer => (
                                            <Link key={trainer.id} href={`/trainers/${trainer.id}`}
                                                className={`flex-shrink-0 w-36 ${card} border rounded-2xl p-3 group hover:border-primary/30 transition-all`}>
                                                <div className="relative mb-2">
                                                    <div className="aspect-square rounded-xl overflow-hidden">
                                                        <img src={trainer.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                    </div>
                                                    <button onClick={e => { e.preventDefault(); toggleFavoriteTrainer(trainer.id); }}
                                                        className="absolute top-1 end-1 w-6 h-6 bg-rose-500 rounded-lg flex items-center justify-center">
                                                        <Heart className="w-3 h-3 text-white fill-current" />
                                                    </button>
                                                </div>
                                                <p className={`text-[10px] font-black ${textC} truncate`}>{getText(trainer.name)}</p>
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <Star className="w-2.5 h-2.5 text-amber-500 fill-current" />
                                                    <span className="text-[9px] font-bold text-amber-500">{trainer.rating || '5.0'}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={`${card} border rounded-2xl p-6 text-center`}>
                                        <p className={`text-xs font-bold ${muted}`}>{ar ? 'لم تضف مدربين للمفضلة بعد' : 'No favorite trainers yet'}</p>
                                        <Link href="/trainers" className="mt-2 inline-block text-xs font-black text-primary">{ar ? 'استعرض المدربين' : 'Browse Trainers'}</Link>
                                    </div>
                                )}
                            </div>

                            {/* Favorite Sports */}
                            <div>
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <span className={`text-xs font-black ${textC} flex items-center gap-2`}><Dumbbell className="w-4 h-4 text-blue-500" />{ar ? 'الرياضات المفضلة' : 'Favorite Sports'}</span>
                                    <Link href="/sports" className="text-[10px] font-black text-blue-500">{ar ? 'كل الرياضات' : 'All Sports'}</Link>
                                </div>
                                {favoriteSports.length > 0 ? (
                                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                        {sports.filter(s => favoriteSports.includes(s.id)).map(sport => (
                                            <Link key={sport.id} href={`/sports/${sport.id}`}
                                                className="flex-shrink-0 w-40 h-24 relative rounded-2xl overflow-hidden group">
                                                <img src={sport.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                                <button onClick={e => { e.preventDefault(); toggleFavoriteSport(sport.id); }}
                                                    className="absolute top-2 end-2 w-6 h-6 bg-rose-500 rounded-lg flex items-center justify-center">
                                                    <Heart className="w-3 h-3 text-white fill-current" />
                                                </button>
                                                <p className="absolute bottom-2 start-3 text-white text-[10px] font-black">{getText(sport.name)}</p>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={`${card} border rounded-2xl p-6 text-center`}>
                                        <p className={`text-xs font-bold ${muted}`}>{ar ? 'لم تختر رياضات مفضلة بعد' : 'No favorite sports yet'}</p>
                                        <Link href="/sports" className="mt-2 inline-block text-xs font-black text-primary">{ar ? 'استعرض الرياضات' : 'Browse Sports'}</Link>
                                    </div>
                                )}
                            </div>

                            {/* Favorite Products */}
                            <div>
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <span className={`text-xs font-black ${textC} flex items-center gap-2`}><Heart className="w-4 h-4 text-rose-500" />{ar ? 'المنتجات المفضلة' : 'Favorite Products'}</span>
                                    <Link href="/store" className="text-[10px] font-black text-rose-500">{ar ? 'تسوق المزيد' : 'Shop More'}</Link>
                                </div>
                                {favorites.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        {products.filter(p => favorites.includes(p.id)).map(product => (
                                            <Link key={product.id} href={`/store/${product.id}`}
                                                className={`${card} border rounded-2xl p-3 group hover:border-primary/30 transition-all`}>
                                                <div className="aspect-square rounded-xl overflow-hidden mb-2">
                                                    <img src={product.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                </div>
                                                <p className={`text-[10px] font-black ${textC} truncate`}>{getText(product.name)}</p>
                                                <p className="text-[10px] font-black text-primary mt-0.5">{product.price} {ar ? 'ر.س' : 'SAR'}</p>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={`${card} border rounded-2xl p-6 text-center`}>
                                        <p className={`text-xs font-bold ${muted}`}>{ar ? 'لا توجد منتجات مفضلة بعد' : 'No favorite products yet'}</p>
                                        <Link href="/store" className="mt-2 inline-block text-xs font-black text-primary">{ar ? 'استعرض المنتجات' : 'Browse Products'}</Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* ── SETTINGS ── */}
                    {activeSection === 'settings' && (
                        <motion.div key="set" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
                            {[
                                { href: '/profile/edit', icon: Edit3, label: ar ? 'تعديل الملف الشخصي' : 'Edit Profile', sub: needsCompletion ? (ar ? '⚠️ أكمل بياناتك الآن (الاسم + الهاتف)' : '⚠️ Complete your info now (name + phone)') : (ar ? 'الاسم، الصورة، البيانات' : 'Name, photo, details'), color: needsCompletion ? 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' : 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
                                { href: '/settings', icon: Settings, label: ar ? 'الإعدادات العامة' : 'General Settings', sub: ar ? 'اللغة، الوضع الليلي' : 'Language, dark mode', color: 'text-gray-500 bg-gray-50 dark:bg-gray-500/10' },
                                { href: '/settings/password', icon: ShieldCheck, label: ar ? 'الأمان وكلمة المرور' : 'Security & Password', sub: ar ? 'تغيير كلمة المرور' : 'Change password', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' },
                                { href: '/profile/addresses', icon: MapPin, label: ar ? 'عناويني المحفوظة' : 'Saved Addresses', sub: ar ? 'إدارة عناوين التوصيل' : 'Manage delivery addresses', color: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10' },
                                { href: '/help', icon: MessageCircle, label: ar ? 'المساعدة والدعم' : 'Help & Support', sub: ar ? 'الأسئلة الشائعة، التواصل' : 'FAQs, contact us', color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' },
                                { href: '/about', icon: BookOpen, label: ar ? 'عن كابتينا' : 'About Captina', sub: ar ? 'من نحن، الشروط والأحكام' : 'About us, terms', color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' },
                            ].map(({ href, icon: Icon, label, sub, color }) => (
                                <Link key={href} href={href}
                                    className={`${card} border rounded-2xl p-4 flex items-center gap-3 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-sm`}>
                                    <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center shrink-0`}>
                                        <Icon className={`w-5 h-5 ${color.split(' ')[0]}`} />
                                    </div>
                                    <div className="flex-1 text-start">
                                        <p className={`text-sm font-black ${textC}`}>{label}</p>
                                        <p className={`text-[10px] font-bold ${muted}`}>{sub}</p>
                                    </div>
                                    {ar ? <ChevronLeft className={`w-4 h-4 ${muted}`} /> : <ChevronRight className={`w-4 h-4 ${muted}`} />}
                                </Link>
                            ))}

                            {/* Logout */}
                            <button onClick={handleLogout}
                                className="w-full flex items-center gap-3 p-4 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all border border-rose-200 dark:border-rose-500/20">
                                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-500/10 rounded-xl flex items-center justify-center shrink-0">
                                    <LogOut className="w-5 h-5 text-rose-500" />
                                </div>
                                <div className="flex-1 text-start">
                                    <p className="text-sm font-black">{ar ? 'تسجيل الخروج' : 'Logout'}</p>
                                    <p className="text-[10px] font-bold opacity-70">{user?.email}</p>
                                </div>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
