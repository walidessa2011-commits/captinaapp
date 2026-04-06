"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    ChevronLeft, Phone, MessageCircle, MapPin, CheckCircle2,
    Activity, Dumbbell, X, ClipboardCheck,
    Calendar, Clock, AlertCircle, RefreshCw, ChevronDown
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import {
    doc, getDoc, collection, query, where, onSnapshot,
    addDoc, serverTimestamp, updateDoc, orderBy, limit, writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
    getTotalSessions,
    generateSessionSchedule,
    findMissedSessions,
    formatDateKey,
    toDate,
    getPlanLabel,
} from '@/utils/subscriptionUtils';

export default function ClientDetailsContent({ params }) {
    const { language, darkMode, setAlert, user } = useApp();
    const router = useRouter();
    const ar = language === 'ar';

    const [activeTab, setActiveTab] = useState('overview');
    const [client, setClient] = useState(null);
    const [activeSubscription, setActiveSubscription] = useState(null);
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [markingAttendance, setMarkingAttendance] = useState(false);
    const [processingAuto, setProcessingAuto] = useState(false);
    const [sessionSchedule, setSessionSchedule] = useState([]);
    const [showAllSessions, setShowAllSessions] = useState(false);

    // ─── Data fetch ──────────────────────────────────────────────────────────
    useEffect(() => {
        if (!params?.id) return;

        let unsubSub, unsubAttendance;

        const fetchData = async () => {
            try {
                const userDoc = await getDoc(doc(db, 'users', params.id));
                if (userDoc.exists()) setClient({ id: userDoc.id, ...userDoc.data() });

                const subQuery = query(
                    collection(db, 'subscriptions'),
                    where('userId', '==', params.id),
                    where('status', 'in', ['active', 'confirmed']),
                    orderBy('createdAt', 'desc'),
                    limit(1)
                );
                unsubSub = onSnapshot(subQuery, snap => {
                    const sub = snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
                    setActiveSubscription(sub);
                });

                const attQuery = query(
                    collection(db, 'attendance'),
                    where('userId', '==', params.id),
                    orderBy('date', 'desc')
                );
                unsubAttendance = onSnapshot(attQuery, snap => {
                    setAttendanceHistory(snap.docs.map(d => ({ id: d.id, ...d.data() })));
                });

                setLoading(false);
            } catch (err) {
                console.error('Error fetching client data:', err);
                setLoading(false);
            }
        };

        fetchData();
        return () => { unsubSub?.(); unsubAttendance?.(); };
    }, [params]);

    // ─── Build session schedule whenever subscription changes ───────────────
    useEffect(() => {
        if (!activeSubscription) { setSessionSchedule([]); return; }
        const startDate = toDate(activeSubscription.startDate || activeSubscription.createdAt);
        const months = Number(activeSubscription.months ?? 1);
        const perWeek = Number(activeSubscription.sessionsPerWeek ?? 3);
        if (startDate) setSessionSchedule(generateSessionSchedule(startDate, months, perWeek));
    }, [activeSubscription]);

    // ─── Auto-attendance: mark missed past sessions ───────────────────────
    const runAutoAttendance = useCallback(async () => {
        if (!activeSubscription || !sessionSchedule.length || processingAuto) return;

        const missed = findMissedSessions(sessionSchedule, attendanceHistory);
        if (missed.length === 0) return;

        setProcessingAuto(true);
        try {
            const batch = writeBatch(db);
            const subRef = doc(db, 'subscriptions', activeSubscription.id);

            for (const sessionDate of missed) {
                const attRef = doc(collection(db, 'attendance'));
                batch.set(attRef, {
                    userId: params.id,
                    trainerId: user?.uid || null,
                    subscriptionId: activeSubscription.id,
                    date: sessionDate,
                    status: 'auto_absent',
                    autoMarked: true,
                    notes: ar ? 'تم التسجيل تلقائياً (غياب)' : 'Auto-marked as absent',
                });
            }

            // Update consumedSessions counter
            const newConsumed = (activeSubscription.consumedSessions || 0) + missed.length;
            const total = getTotalSessions(activeSubscription);
            const updates = { consumedSessions: newConsumed };
            if (newConsumed >= total) updates.status = 'expired';
            batch.update(subRef, updates);

            await batch.commit();
        } catch (err) {
            console.error('Auto-attendance error:', err);
        } finally {
            setProcessingAuto(false);
        }
    }, [activeSubscription, sessionSchedule, attendanceHistory, processingAuto, params, user, ar]);

    // Run auto-attendance when data is ready
    useEffect(() => {
        if (!loading && activeSubscription && sessionSchedule.length && attendanceHistory !== undefined) {
            runAutoAttendance();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, sessionSchedule]);

    // ─── Manual attendance ────────────────────────────────────────────────
    const handleMarkAttendance = async () => {
        if (!activeSubscription || !client || markingAttendance) return;
        setAlert({
            title: ar ? 'تأكيد الحضور' : 'Confirm Attendance',
            message: ar ? 'هل أنت متأكد من تسجيل حضور المتدرب لهذه الجلسة؟' : 'Mark attendance for this session?',
            type: 'confirm',
            onConfirm: async () => {
                setMarkingAttendance(true);
                try {
                    const subRef = doc(db, 'subscriptions', activeSubscription.id);
                    const currentConsumed = activeSubscription.consumedSessions || 0;
                    const total = getTotalSessions(activeSubscription);
                    const newConsumed = currentConsumed + 1;
                    const updates = { consumedSessions: newConsumed };
                    if (newConsumed >= total) updates.status = 'expired';
                    await updateDoc(subRef, updates);

                    await addDoc(collection(db, 'attendance'), {
                        userId: client.id,
                        trainerId: user?.uid || null,
                        subscriptionId: activeSubscription.id,
                        date: serverTimestamp(),
                        status: 'attended',
                        autoMarked: false,
                        notes: '',
                    });

                    setAlert({
                        title: ar ? 'تم بنجاح' : 'Success',
                        message: ar ? 'تم تسجيل الحضور بنجاح' : 'Attendance recorded successfully',
                        type: 'success',
                    });
                } catch (err) {
                    console.error(err);
                    setAlert({ title: ar ? 'خطأ' : 'Error', message: ar ? 'حدث خطأ' : 'Error recording attendance', type: 'error' });
                } finally {
                    setMarkingAttendance(false);
                }
            },
        });
    };

    // ─── Computed values ──────────────────────────────────────────────────
    const totalSess = activeSubscription ? getTotalSessions(activeSubscription) : 0;
    const consumedSess = activeSubscription?.consumedSessions || 0;
    const remaining = Math.max(0, totalSess - consumedSess);
    const progress = totalSess > 0 ? Math.round((consumedSess / totalSess) * 100) : 0;
    const months = Number(activeSubscription?.months ?? 1);
    const planLabel = activeSubscription?.planLabel || getPlanLabel(months, language);

    // Sessions to show in the schedule tab
    const now = new Date();
    const visibleSessions = showAllSessions ? sessionSchedule : sessionSchedule.slice(0, 30);

    // ─── Loading & not found states ───────────────────────────────────────
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center pb-32">
            <div className="w-8 h-8 border-4 border-[#E51B24] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!client) return (
        <div className="min-h-screen flex items-center justify-center pb-32">
            <p className={darkMode ? 'text-white' : 'text-slate-900'}>
                {ar ? 'المتدرب غير موجود' : 'Client not found'}
            </p>
        </div>
    );

    const card = darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5';
    const textC = darkMode ? 'text-white' : 'text-slate-900';

    return (
        <div className={`p-6 pb-32 max-w-lg mx-auto space-y-6 ${textC}`} dir={ar ? 'rtl' : 'ltr'}>

            {/* Header */}
            <div className="flex items-center justify-between">
                <button onClick={() => router.back()}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${card}`}>
                    <ChevronLeft className={`w-5 h-5 ${ar ? 'rotate-180' : ''}`} />
                </button>
                <h2 className="text-xl font-black italic uppercase tracking-wider">
                    {ar ? 'ملف المتدرب' : 'Client Profile'}
                </h2>
                <div className="w-10" />
            </div>

            {/* Profile Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className={`p-8 rounded-[3rem] border relative overflow-hidden text-center space-y-5 ${card} ${darkMode ? '' : 'shadow-xl'}`}>
                <div className="relative inline-flex mx-auto">
                    <img
                        src={client.photoURL || client.image || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=200'}
                        alt="" className="w-24 h-24 rounded-[2rem] object-cover border-4 border-[#E51B24]/20" />
                    <div className="absolute -bottom-2 -right-2 bg-[#E51B24] p-2 rounded-xl shadow-lg">
                        <Activity className="w-4 h-4 text-white" />
                    </div>
                </div>

                <div>
                    <h3 className="text-2xl font-black italic">{client.fullName || client.name || 'Unnamed'}</h3>
                    <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] mt-0.5">
                        {activeSubscription?.sportId || '—'} • {planLabel}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <a href={`tel:${client.phone}`}
                        className="flex items-center justify-center gap-2 bg-emerald-500 text-white py-3 rounded-2xl font-black text-xs shadow-lg shadow-emerald-500/20">
                        <Phone className="w-4 h-4" />
                        {ar ? 'اتصال' : 'Call'}
                    </a>
                    <a href={`https://wa.me/${client.phone?.replace('+', '')}`}
                        className="flex items-center justify-center gap-2 bg-[#E51B24] text-white py-3 rounded-2xl font-black text-xs shadow-lg shadow-[#E51B24]/20">
                        <MessageCircle className="w-4 h-4" />
                        {ar ? 'واتساب' : 'WhatsApp'}
                    </a>
                </div>
            </motion.div>

            {/* Quick Attendance Button */}
            {activeSubscription && activeSubscription.status !== 'expired' ? (
                <button onClick={handleMarkAttendance} disabled={markingAttendance}
                    className="w-full flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all text-white p-5 rounded-3xl font-black shadow-lg shadow-emerald-500/20 disabled:opacity-50">
                    <ClipboardCheck className="w-6 h-6" />
                    {markingAttendance
                        ? (ar ? 'جاري التسجيل...' : 'Marking...')
                        : (ar ? 'تسجيل حضور سريع' : 'Quick Mark Attendance')}
                </button>
            ) : (
                <div className={`w-full flex items-center justify-center gap-3 p-5 rounded-3xl font-black opacity-50 border ${card}`}>
                    <X className="w-6 h-6" />
                    {ar ? 'لا يوجد اشتراك نشط' : 'No active subscription'}
                </div>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3">
                <div className={`p-4 rounded-[2rem] border text-center ${card}`}>
                    <p className="text-[8px] font-black uppercase opacity-40 tracking-widest mb-1">{ar ? 'المتبقي' : 'Left'}</p>
                    <span className="text-2xl font-black italic text-[#E51B24]">{remaining}</span>
                    <span className="text-[10px] font-bold opacity-20"> / {totalSess}</span>
                </div>
                <div className={`p-4 rounded-[2rem] border text-center ${card}`}>
                    <p className="text-[8px] font-black uppercase opacity-40 tracking-widest mb-1">{ar ? 'المُنجز' : 'Done'}</p>
                    <span className="text-2xl font-black italic text-emerald-500">{consumedSess}</span>
                </div>
                <div className={`p-4 rounded-[2rem] border text-center ${card}`}>
                    <p className="text-[8px] font-black uppercase opacity-40 tracking-widest mb-1">{ar ? 'الإنجاز' : 'Progress'}</p>
                    <span className="text-2xl font-black italic text-blue-400">{progress}%</span>
                </div>
            </div>

            {/* Progress Bar */}
            {totalSess > 0 && (
                <div className={`rounded-2xl border p-4 ${card}`}>
                    <div className="flex justify-between mb-2">
                        <span className="text-[10px] font-black opacity-50 uppercase">
                            {ar ? 'الحصص' : 'Sessions'}
                        </span>
                        <span className="text-[10px] font-black text-primary">{progress}%</span>
                    </div>
                    <div className={`h-2 rounded-full ${darkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                        <div className="h-full rounded-full bg-gradient-to-r from-[#E51B24] to-amber-500 transition-all duration-700"
                            style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex justify-between mt-2">
                        <span className="text-[9px] opacity-40">{ar ? 'البداية' : 'Start'}: {activeSubscription?.startDate || '—'}</span>
                        <span className="text-[9px] opacity-40">{ar ? 'النهاية' : 'End'}: {activeSubscription?.endDate || '—'}</span>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className={`flex border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                {[
                    { key: 'overview', ar: 'نظرة عامة', en: 'Details' },
                    { key: 'schedule', ar: 'جدول الحصص', en: 'Schedule' },
                    { key: 'history', ar: 'سجل الحضور', en: 'History' },
                ].map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                        className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab.key ? 'text-[#E51B24]' : 'opacity-40'}`}>
                        {ar ? tab.ar : tab.en}
                        {activeTab === tab.key && (
                            <motion.div layoutId="tab-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E51B24]" />
                        )}
                    </button>
                ))}
            </div>

            {/* ── Overview Tab ── */}
            {activeTab === 'overview' && (
                <div className="space-y-3">
                    <div className={`p-4 rounded-3xl border flex items-center gap-4 ${card}`}>
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black opacity-40 uppercase tracking-widest">{ar ? 'الموقع' : 'Location'}</p>
                            <p className="text-xs font-black italic">{client.address || client.city || (ar ? 'غير متوفر' : 'N/A')}</p>
                        </div>
                    </div>
                    <div className={`p-4 rounded-3xl border flex items-center gap-4 ${card}`}>
                        <div className="w-10 h-10 rounded-xl bg-[#E51B24]/10 flex items-center justify-center shrink-0">
                            <Dumbbell className="w-5 h-5 text-[#E51B24]" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black opacity-40 uppercase tracking-widest">{ar ? 'هدف التدريب' : 'Training Goal'}</p>
                            <p className="text-xs font-black italic">{client.goal || (ar ? 'غير محدد' : 'Not set')}</p>
                        </div>
                    </div>
                    {activeSubscription && (
                        <div className={`p-4 rounded-3xl border space-y-2 ${card}`}>
                            <p className="text-[9px] font-black opacity-40 uppercase tracking-widest">{ar ? 'تفاصيل الاشتراك' : 'Subscription Details'}</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <span className="opacity-40">{ar ? 'نوع الخطة: ' : 'Plan: '}</span>
                                    <span className="font-black">{planLabel}</span>
                                </div>
                                <div>
                                    <span className="opacity-40">{ar ? 'حصص/أسبوع: ' : 'Sessions/wk: '}</span>
                                    <span className="font-black">{activeSubscription.sessionsPerWeek || 3}</span>
                                </div>
                                <div>
                                    <span className="opacity-40">{ar ? 'إجمالي الحصص: ' : 'Total: '}</span>
                                    <span className="font-black">{totalSess}</span>
                                </div>
                                <div>
                                    <span className="opacity-40">{ar ? 'الحالة: ' : 'Status: '}</span>
                                    <span className={`font-black ${activeSubscription.status === 'expired' ? 'text-rose-400' : 'text-emerald-400'}`}>
                                        {ar
                                            ? (activeSubscription.status === 'expired' ? 'منتهي' : 'نشط')
                                            : (activeSubscription.status === 'expired' ? 'Expired' : 'Active')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── Schedule Tab ── */}
            {activeTab === 'schedule' && (
                <div className="space-y-3">
                    {processingAuto && (
                        <div className="flex items-center gap-2 text-xs opacity-60">
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            {ar ? 'جاري تحديث الحضور التلقائي...' : 'Processing auto-attendance...'}
                        </div>
                    )}

                    {sessionSchedule.length === 0 ? (
                        <div className={`py-12 text-center rounded-3xl border ${card}`}>
                            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-20" />
                            <p className="text-sm font-black opacity-40">
                                {ar ? 'لا يوجد جدول حصص' : 'No session schedule'}
                            </p>
                            <p className="text-[10px] opacity-30 mt-1">
                                {ar ? 'يتطلب وجود اشتراك نشط مع تاريخ بداية' : 'Requires active subscription with start date'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black opacity-50 uppercase">
                                    {ar ? `${sessionSchedule.length} حصة مجدولة` : `${sessionSchedule.length} Scheduled Sessions`}
                                </span>
                                <span className="text-[10px] font-black text-emerald-500">
                                    {attendanceHistory.filter(r => r.status === 'attended').length} {ar ? 'حضور' : 'attended'}
                                </span>
                            </div>

                            {/* Session rows */}
                            <div className="space-y-2">
                                {visibleSessions.map((sessionDate, idx) => {
                                    const key = formatDateKey(sessionDate);
                                    const attRecord = attendanceHistory.find(r => formatDateKey(toDate(r.date || r.sessionDate)) === key);
                                    const isPast = sessionDate < now;
                                    const isToday = key === formatDateKey(now);

                                    let statusIcon, statusColor, statusLabel;
                                    if (attRecord?.status === 'attended') {
                                        statusIcon = <CheckCircle2 className="w-4 h-4" />;
                                        statusColor = 'text-emerald-500 bg-emerald-500/10';
                                        statusLabel = ar ? 'حاضر' : 'Attended';
                                    } else if (attRecord?.status === 'auto_absent') {
                                        statusIcon = <X className="w-4 h-4" />;
                                        statusColor = 'text-rose-400 bg-rose-400/10';
                                        statusLabel = ar ? 'غياب تلقائي' : 'Auto Absent';
                                    } else if (isPast) {
                                        statusIcon = <AlertCircle className="w-4 h-4" />;
                                        statusColor = 'text-amber-400 bg-amber-400/10';
                                        statusLabel = ar ? 'غير مسجل' : 'Unmarked';
                                    } else {
                                        statusIcon = <Clock className="w-4 h-4" />;
                                        statusColor = darkMode ? 'text-white/40 bg-white/5' : 'text-gray-400 bg-gray-100';
                                        statusLabel = ar ? 'قادم' : 'Upcoming';
                                    }

                                    return (
                                        <div key={idx}
                                            className={`flex items-center justify-between p-3 rounded-2xl border ${card} ${isToday ? 'ring-1 ring-[#E51B24]/40' : ''}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black ${isToday ? 'bg-[#E51B24] text-white' : darkMode ? 'bg-white/5' : 'bg-gray-50'} ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black">
                                                        {sessionDate.toLocaleDateString(ar ? 'ar-SA' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                                                        {isToday && <span className="ms-1.5 text-[8px] bg-[#E51B24] text-white px-1.5 py-0.5 rounded-full">{ar ? 'اليوم' : 'Today'}</span>}
                                                    </p>
                                                    <p className="text-[9px] opacity-40 font-bold">
                                                        {attRecord?.autoMarked ? (ar ? 'تلقائي' : 'Auto') : (attRecord ? (ar ? 'يدوي' : 'Manual') : '')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black ${statusColor}`}>
                                                {statusIcon}
                                                {statusLabel}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {sessionSchedule.length > 30 && (
                                <button onClick={() => setShowAllSessions(v => !v)}
                                    className={`w-full py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-all flex items-center justify-center gap-2 ${card}`}>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${showAllSessions ? 'rotate-180' : ''}`} />
                                    {showAllSessions
                                        ? (ar ? 'عرض أقل' : 'Show Less')
                                        : (ar ? `عرض الكل (${sessionSchedule.length})` : `Show All (${sessionSchedule.length})`)}
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* ── History Tab ── */}
            {activeTab === 'history' && (
                <div className="space-y-3">
                    {attendanceHistory.length === 0 ? (
                        <p className="text-center text-xs font-bold opacity-40 py-8">
                            {ar ? 'لا يوجد سجل حضور' : 'No attendance history'}
                        </p>
                    ) : attendanceHistory.map(item => {
                        const dateObj = toDate(item.date);
                        const fDate = dateObj
                            ? dateObj.toLocaleDateString(ar ? 'ar-SA' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                            : (ar ? 'غير متوفر' : 'N/A');
                        const fTime = dateObj
                            ? dateObj.toLocaleTimeString(ar ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })
                            : '';

                        const isAttended = item.status === 'attended';
                        const isAutoAbsent = item.status === 'auto_absent';

                        return (
                            <div key={item.id}
                                className={`p-4 rounded-3xl border flex items-center justify-between ${card} ${!isAttended ? 'opacity-60' : ''}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAttended ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                        {isAttended ? <CheckCircle2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black italic">{fDate}</p>
                                        <p className="text-[9px] font-bold opacity-40">{fTime}
                                            {isAutoAbsent && <span className="ms-1 text-amber-400">{ar ? '· تلقائي' : '· auto'}</span>}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black opacity-20 uppercase">#{item.id.slice(0, 6)}</span>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* BG glow */}
            <div className={`fixed top-0 right-0 w-[400px] h-[400px] blur-[150px] -z-10 rounded-full transition-opacity pointer-events-none ${darkMode ? 'bg-[#E51B24]/5 opacity-100' : 'bg-[#E51B24]/10 opacity-50'}`} />
        </div>
    );
}
