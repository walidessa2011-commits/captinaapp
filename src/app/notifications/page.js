"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell, ChevronLeft, ChevronRight, CheckCircle2, Calendar,
    Tag, AlertCircle, Trash2, ShoppingBag, Dumbbell, Star,
    MessageCircle, Trophy, CreditCard, Info, Zap, Check,
    BellOff, RefreshCw, Filter, X
} from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { useRouter } from 'next/navigation';
import { db, auth } from "@/lib/firebase";
import {
    collection, query, where, orderBy, onSnapshot,
    updateDoc, doc, deleteDoc, writeBatch, addDoc, serverTimestamp
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import Link from 'next/link';

// ── Type config ──────────────────────────────────────────────────
const TYPE_CONFIG = {
    booking:  { icon: Calendar,     color: 'text-blue-500',   bg: 'bg-blue-50   dark:bg-blue-500/15',  label_ar: 'حجز',       label_en: 'Booking'  },
    offer:    { icon: Tag,          color: 'text-emerald-500',bg: 'bg-emerald-50 dark:bg-emerald-500/15',label_ar: 'عرض',      label_en: 'Offer'    },
    alert:    { icon: AlertCircle,  color: 'text-rose-500',   bg: 'bg-rose-50    dark:bg-rose-500/15',  label_ar: 'تنبيه',    label_en: 'Alert'    },
    order:    { icon: ShoppingBag,  color: 'text-cyan-500',   bg: 'bg-cyan-50    dark:bg-cyan-500/15',  label_ar: 'طلب',      label_en: 'Order'    },
    training: { icon: Dumbbell,     color: 'text-violet-500', bg: 'bg-violet-50  dark:bg-violet-500/15',label_ar: 'تدريب',   label_en: 'Training' },
    promo:    { icon: Zap,          color: 'text-amber-500',  bg: 'bg-amber-50   dark:bg-amber-500/15', label_ar: 'ترويج',   label_en: 'Promo'    },
    system:   { icon: Info,         color: 'text-gray-400',   bg: 'bg-gray-100   dark:bg-gray-500/15',  label_ar: 'نظام',    label_en: 'System'   },
    achievement:{ icon: Trophy,     color: 'text-orange-500', bg: 'bg-orange-50  dark:bg-orange-500/15',label_ar: 'إنجاز',  label_en: 'Achievement'},
    message:  { icon: MessageCircle,color: 'text-pink-500',   bg: 'bg-pink-50    dark:bg-pink-500/15',  label_ar: 'رسالة',   label_en: 'Message'  },
    payment:  { icon: CreditCard,   color: 'text-indigo-500', bg: 'bg-indigo-50  dark:bg-indigo-500/15',label_ar: 'دفع',    label_en: 'Payment'  },
};

const getConfig = (type) => TYPE_CONFIG[type] || TYPE_CONFIG.system;

// ── Time formatter ───────────────────────────────────────────────
function formatTime(ts, ar) {
    if (!ts) return '';
    const date = ts?.toDate?.() || (ts instanceof Date ? ts : new Date(ts.seconds * 1000));
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60)   return ar ? 'الآن' : 'Just now';
    if (diff < 3600) return ar ? `منذ ${Math.floor(diff/60)} دقيقة` : `${Math.floor(diff/60)}m ago`;
    if (diff < 86400)return ar ? `منذ ${Math.floor(diff/3600)} ساعة` : `${Math.floor(diff/3600)}h ago`;
    if (diff < 604800)return ar ? `منذ ${Math.floor(diff/86400)} يوم` : `${Math.floor(diff/86400)}d ago`;
    return date.toLocaleDateString(ar ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric' });
}

function getDateGroup(ts, ar) {
    if (!ts) return ar ? 'قديم' : 'Older';
    const date = ts?.toDate?.() || new Date(ts.seconds * 1000);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diff === 0) return ar ? 'اليوم' : 'Today';
    if (diff === 1) return ar ? 'أمس' : 'Yesterday';
    if (diff < 7)   return ar ? 'هذا الأسبوع' : 'This Week';
    if (diff < 30)  return ar ? 'هذا الشهر' : 'This Month';
    return ar ? 'قديم' : 'Older';
}

// ── Notification Card ────────────────────────────────────────────
function NotifCard({ notif, ar, darkMode, onRead, onDelete }) {
    const cfg = getConfig(notif.type);
    const Icon = cfg.icon;
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async (e) => {
        e.stopPropagation();
        setDeleting(true);
        await onDelete(notif.id);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: deleting ? 0 : 1, x: deleting ? (ar ? 100 : -100) : 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.28 }}
            onClick={() => !notif.read && onRead(notif.id)}
            className={`group relative rounded-2xl border p-4 transition-all cursor-pointer ${
                !notif.read
                    ? darkMode ? 'bg-white/8 border-primary/20 hover:border-primary/40' : 'bg-white border-primary/15 shadow-sm hover:border-primary/30'
                    : darkMode ? 'bg-white/3 border-white/5 hover:border-white/10 opacity-70' : 'bg-white border-gray-100 hover:border-gray-200 opacity-80'
            }`}
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`w-11 h-11 ${cfg.bg} rounded-xl flex items-center justify-center shrink-0 relative`}>
                    <Icon className={`w-5 h-5 ${cfg.color}`} />
                    {!notif.read && (
                        <span className="absolute -top-1 -end-1 w-3 h-3 bg-primary rounded-full border-2 border-white dark:border-[#0a0f1a]" />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                        <h3 className={`text-sm font-black ${darkMode ? 'text-white' : 'text-slate-900'} leading-tight`}>
                            {notif.title}
                        </h3>
                        <span className={`text-[9px] font-bold shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {formatTime(notif.createdAt, ar)}
                        </span>
                    </div>
                    <p className={`text-xs font-medium leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {notif.message}
                    </p>

                    {/* Action link */}
                    {notif.link && (
                        <Link href={notif.link} onClick={e => e.stopPropagation()}
                            className={`inline-flex items-center gap-1 mt-2 text-[10px] font-black ${cfg.color} hover:underline`}>
                            {ar ? 'عرض التفاصيل' : 'View Details'}
                            {ar ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </Link>
                    )}
                </div>
            </div>

            {/* Type badge */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-current/5">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} uppercase tracking-wider`}>
                    {ar ? cfg.label_ar : cfg.label_en}
                </span>
                <div className="flex items-center gap-1.5">
                    {!notif.read && (
                        <button onClick={e => { e.stopPropagation(); onRead(notif.id); }}
                            className={`p-1.5 rounded-lg ${darkMode ? 'bg-white/5 hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-400' : 'bg-gray-50 hover:bg-emerald-50 text-gray-400 hover:text-emerald-500'} transition-all`}>
                            <Check className="w-3 h-3" />
                        </button>
                    )}
                    <button onClick={handleDelete}
                        className={`p-1.5 rounded-lg ${darkMode ? 'bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400' : 'bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-500'} transition-all`}>
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

// ── Main Page ────────────────────────────────────────────────────
export default function NotificationsPage() {
    const { language, darkMode, setAlert } = useApp();
    const ar = language === 'ar';
    const router = useRouter();
    const [user] = useAuthState(auth);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [showTypeFilter, setShowTypeFilter] = useState(false);

    const bg = darkMode ? 'bg-[#0a0f1a]' : 'bg-slate-50';
    const card = darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100';
    const textC = darkMode ? 'text-white' : 'text-slate-900';
    const muted = darkMode ? 'text-gray-400' : 'text-gray-500';

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "notifications"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, snap => {
            setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        }, () => setLoading(false));
        return () => unsub();
    }, [user]);

    const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

    const filtered = useMemo(() => {
        let list = notifications;
        if (filter === 'unread') list = list.filter(n => !n.read);
        if (typeFilter !== 'all') list = list.filter(n => n.type === typeFilter);
        return list;
    }, [notifications, filter, typeFilter]);

    // Group by date
    const grouped = useMemo(() => {
        const groups = {};
        const ORDER = [ar ? 'اليوم' : 'Today', ar ? 'أمس' : 'Yesterday', ar ? 'هذا الأسبوع' : 'This Week', ar ? 'هذا الشهر' : 'This Month', ar ? 'قديم' : 'Older'];
        filtered.forEach(n => {
            const g = getDateGroup(n.createdAt, ar);
            if (!groups[g]) groups[g] = [];
            groups[g].push(n);
        });
        return ORDER.filter(k => groups[k]).map(k => ({ label: k, items: groups[k] }));
    }, [filtered, ar]);

    const markAsRead = async (id) => {
        try { await updateDoc(doc(db, "notifications", id), { read: true }); } catch (e) { console.error(e); }
    };

    const deleteNotification = async (id) => {
        try { await deleteDoc(doc(db, "notifications", id)); } catch (e) { console.error(e); }
    };

    const markAllAsRead = async () => {
        const unread = notifications.filter(n => !n.read);
        if (!unread.length) return;
        const batch = writeBatch(db);
        unread.forEach(n => batch.update(doc(db, "notifications", n.id), { read: true }));
        await batch.commit();
        setAlert({ title: ar ? 'تم' : 'Done', message: ar ? 'تم تحديد الكل كمقروء' : 'All marked as read', type: 'success' });
    };

    const deleteAll = async () => {
        if (!filtered.length) return;
        setAlert({
            title: ar ? 'تأكيد الحذف' : 'Confirm Delete',
            message: ar ? 'هل تريد حذف جميع الإشعارات الظاهرة؟' : 'Delete all visible notifications?',
            type: 'confirm',
            onConfirm: async () => {
                const batch = writeBatch(db);
                filtered.forEach(n => batch.delete(doc(db, "notifications", n.id)));
                await batch.commit();
            }
        });
    };

    const availableTypes = useMemo(() => [...new Set(notifications.map(n => n.type).filter(Boolean))], [notifications]);

    return (
        <div className={`min-h-screen ${bg} pb-32 relative overflow-hidden transition-colors duration-300`} dir={ar ? 'rtl' : 'ltr'}>
            {/* BG blobs */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[140px] pointer-events-none translate-x-1/2 -translate-y-1/2 animate-pulse" />
            <div className="fixed bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-2xl mx-auto px-4 pt-6 relative z-10">

                {/* ── Header ── */}
                <div className={`${card} border rounded-[1.5rem] p-3 mb-5 flex items-center justify-between gap-2`}>
                    <div className="flex items-center gap-2">
                        <button onClick={() => router.back()}
                            className={`w-10 h-10 flex items-center justify-center ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'} rounded-xl transition-all active:scale-95`}>
                            {ar ? <ChevronRight className={`w-5 h-5 ${textC}`} /> : <ChevronLeft className={`w-5 h-5 ${textC}`} />}
                        </button>
                        <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-primary" />
                            <span className={`text-sm font-black ${textC} uppercase tracking-wider`}>{ar ? 'الإشعارات' : 'Notifications'}</span>
                            {unreadCount > 0 && (
                                <span className="text-[9px] font-black bg-primary text-white px-2 py-0.5 rounded-full">{unreadCount}</span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button onClick={markAllAsRead}
                                className={`p-2.5 rounded-xl text-emerald-500 ${darkMode ? 'bg-emerald-500/10 hover:bg-emerald-500/20' : 'bg-emerald-50 hover:bg-emerald-100'} transition-all active:scale-95`}
                                title={ar ? 'تحديد الكل مقروء' : 'Mark all read'}>
                                <CheckCircle2 className="w-4 h-4" />
                            </button>
                        )}
                        <button onClick={() => setShowTypeFilter(s => !s)}
                            className={`p-2.5 rounded-xl ${showTypeFilter ? 'bg-primary text-white' : darkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'} transition-all active:scale-95`}>
                            <Filter className="w-4 h-4" />
                        </button>
                        {filtered.length > 0 && (
                            <button onClick={deleteAll}
                                className={`p-2.5 rounded-xl text-rose-500 ${darkMode ? 'bg-rose-500/10 hover:bg-rose-500/20' : 'bg-rose-50 hover:bg-rose-100'} transition-all active:scale-95`}>
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Read / Unread Toggle ── */}
                <div className={`flex gap-1 p-1 ${darkMode ? 'bg-white/5' : 'bg-gray-100'} rounded-2xl mb-4`}>
                    {[
                        { k: 'all', label: ar ? 'الكل' : 'All', count: notifications.length },
                        { k: 'unread', label: ar ? 'غير مقروء' : 'Unread', count: unreadCount },
                    ].map(({ k, label, count }) => (
                        <button key={k} onClick={() => setFilter(k)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${filter === k ? 'bg-white dark:bg-white/10 text-primary shadow-sm' : `${muted} hover:text-primary`}`}>
                            {label}
                            {count > 0 && <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${filter === k ? 'bg-primary/10 text-primary' : 'bg-gray-200 dark:bg-white/10 text-gray-500'}`}>{count}</span>}
                        </button>
                    ))}
                </div>

                {/* ── Type Filter (expandable) ── */}
                <AnimatePresence>
                    {showTypeFilter && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-4">
                            <div className="flex flex-wrap gap-2 pb-1">
                                <button onClick={() => setTypeFilter('all')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black border transition-all ${typeFilter === 'all' ? 'bg-primary text-white border-primary' : `${darkMode ? 'border-white/10 text-gray-400 hover:border-white/20' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}`}>
                                    {ar ? 'الكل' : 'All'}
                                </button>
                                {availableTypes.map(type => {
                                    const cfg = getConfig(type);
                                    const Icon = cfg.icon;
                                    return (
                                        <button key={type} onClick={() => setTypeFilter(type === typeFilter ? 'all' : type)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black border transition-all ${typeFilter === type ? `${cfg.bg} ${cfg.color} border-current/20` : `${darkMode ? 'border-white/10 text-gray-400 hover:border-white/20' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}`}>
                                            <Icon className="w-3 h-3" />
                                            {ar ? cfg.label_ar : cfg.label_en}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Content ── */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${muted} animate-pulse`}>
                            {ar ? 'جاري التحميل...' : 'Loading...'}
                        </p>
                    </div>
                ) : grouped.length > 0 ? (
                    <div className="space-y-6">
                        <AnimatePresence>
                            {grouped.map(({ label, items }) => (
                                <motion.div key={label} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    {/* Group Header */}
                                    <div className="flex items-center gap-3 mb-3 px-1">
                                        <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${muted}`}>{label}</span>
                                        <div className={`flex-1 h-px ${darkMode ? 'bg-white/5' : 'bg-gray-200'}`} />
                                        <span className={`text-[9px] font-bold ${muted}`}>{items.length}</span>
                                    </div>

                                    {/* Notifications */}
                                    <div className="space-y-2">
                                        <AnimatePresence mode="popLayout">
                                            {items.map(notif => (
                                                <NotifCard
                                                    key={notif.id}
                                                    notif={notif}
                                                    ar={ar}
                                                    darkMode={darkMode}
                                                    onRead={markAsRead}
                                                    onDelete={deleteNotification}
                                                />
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    // ── Empty State ──
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-24 text-center px-6">
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                            className={`w-24 h-24 ${darkMode ? 'bg-white/5' : 'bg-white'} rounded-3xl flex items-center justify-center mb-6 border ${darkMode ? 'border-white/10' : 'border-gray-100'} shadow-lg`}>
                            <BellOff className={`w-10 h-10 ${muted} opacity-50`} />
                        </motion.div>
                        <h3 className={`text-2xl font-black ${textC} mb-2 tracking-tight`}>
                            {filter === 'unread'
                                ? (ar ? 'كل شيء مقروء!' : 'All Caught Up!')
                                : (ar ? 'لا توجد إشعارات' : 'No Notifications')}
                        </h3>
                        <p className={`text-sm font-bold ${muted} max-w-xs leading-relaxed mb-6`}>
                            {filter === 'unread'
                                ? (ar ? 'قرأت جميع إشعاراتك. رائع!' : "You've read everything. Great!")
                                : (ar ? 'ستظهر الإشعارات هنا عند وجود حجوزات أو عروض أو تحديثات جديدة.' : 'Notifications will appear here when there are new bookings, offers, or updates.')}
                        </p>
                        {filter !== 'all' ? (
                            <button onClick={() => setFilter('all')}
                                className={`px-6 py-3 ${darkMode ? 'bg-white/10 text-white' : 'bg-white text-gray-700 border border-gray-200'} rounded-2xl text-sm font-black shadow-sm active:scale-95 transition-all`}>
                                {ar ? 'عرض الكل' : 'Show All'}
                            </button>
                        ) : (
                            <Link href="/" className="px-6 py-3 bg-primary text-white rounded-2xl text-sm font-black shadow-xl shadow-primary/20 active:scale-95 transition-all">
                                {ar ? 'العودة للرئيسية' : 'Back to Home'}
                            </Link>
                        )}
                    </motion.div>
                )}

                {/* ── Stats Footer ── */}
                {notifications.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                        className={`mt-8 ${card} border rounded-2xl p-4 grid grid-cols-3 gap-4 text-center`}>
                        {[
                            { val: notifications.length, label: ar ? 'إجمالي' : 'Total', color: textC },
                            { val: unreadCount, label: ar ? 'غير مقروء' : 'Unread', color: 'text-primary' },
                            { val: notifications.length - unreadCount, label: ar ? 'مقروء' : 'Read', color: 'text-emerald-500' },
                        ].map(({ val, label, color }, i) => (
                            <div key={i}>
                                <div className={`text-xl font-black ${color}`}>{val}</div>
                                <div className={`text-[9px] font-bold uppercase tracking-wider ${muted} mt-0.5`}>{label}</div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
