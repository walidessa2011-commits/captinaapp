"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Bell, 
    ChevronLeft, 
    ChevronRight, 
    CheckCircle2, 
    Calendar, 
    Tag, 
    AlertCircle, 
    Trash2, 
    ExternalLink,
    Filter,
    Sparkles,
    Check
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { db, auth } from "@/lib/firebase";
import { 
    collection, 
    query, 
    where, 
    orderBy, 
    onSnapshot, 
    updateDoc, 
    doc, 
    deleteDoc, 
    writeBatch 
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function NotificationsPage() {
    const { language, darkMode, t } = useApp();
    const [user] = useAuthState(auth);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, unread
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "notifications"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedNotifications = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNotifications(fetchedNotifications);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const markAsRead = async (id) => {
        try {
            await updateDoc(doc(db, "notifications", id), {
                read: true
            });
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await deleteDoc(doc(db, "notifications", id));
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    const markAllAsRead = async () => {
        const unreadOnes = notifications.filter(n => !n.read);
        if (unreadOnes.length === 0) return;

        const batch = writeBatch(db);
        unreadOnes.forEach((n) => {
            batch.update(doc(db, "notifications", n.id), { read: true });
        });
        await batch.commit();
    };

    const filteredNotifications = filter === 'unread' 
        ? notifications.filter(n => !n.read) 
        : notifications;

    const getIcon = (type) => {
        switch (type) {
            case 'booking': return <Calendar className="w-5 h-5 text-blue-500" />;
            case 'offer': return <Tag className="w-5 h-5 text-emerald-500" />;
            case 'alert': return <AlertCircle className="w-5 h-5 text-rose-500" />;
            default: return <Bell className={`w-5 h-5 ${darkMode ? 'text-white/60' : 'text-gray-400'}`} />;
        }
    };

    if (!mounted) {
        return <div className="min-h-screen bg-[#0a0f1a]" />;
    }

    return (
        <div className={`min-h-screen pb-40 transition-colors duration-500 overflow-hidden relative ${darkMode ? 'bg-[#0a0f1a]' : 'bg-slate-50'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Decorations */}
            <div className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[160px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse transition-opacity duration-1000 ${darkMode ? 'bg-[#E51B24]/10 opacity-100' : 'bg-[#E51B24]/5 opacity-60'}`}></div>
            <div className={`absolute bottom-0 left-0 w-96 h-96 rounded-full blur-[140px] -z-0 -translate-x-1/2 translate-y-1/2 transition-colors duration-1000 ${darkMode ? 'bg-primary/5' : 'bg-primary/5'}`}></div>

            {/* Header / Breadcrumbs */}
            <header className="relative z-20 pt-16 pb-6 px-6 container mx-auto">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumbs - Fixed alignment */}
                    <motion.div 
                        initial={{ opacity: 0, x: language === 'ar' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex items-center gap-2 mb-6 text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-white/40' : 'text-gray-400'}`}
                    >
                        <Link href="/" className="hover:text-primary transition-colors">{language === 'ar' ? 'الرئيسية' : 'Home'}</Link>
                        <span className="opacity-40">{language === 'ar' ? ' \u00BB ' : ' \u00AB '}</span>
                        <span className="text-primary font-black">{language === 'ar' ? 'الإشعارات' : 'Notifications'}</span>
                    </motion.div>

                    {/* Title and Action */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 w-full">
                        <div className="space-y-4 pt-4">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3"
                            >
                                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(229,27,36,0.5)] animate-pulse"></div>
                                <h1 className={`text-xl md:text-3xl font-black tracking-tighter italic uppercase transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {language === 'ar' 
                                        ? 'الإشعارات ( تفاعل لحظي - إشعارات كابتينا )' 
                                        : 'Updates ( Real-time - Captina Info )'}
                                </h1>
                            </motion.div>
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className={`text-[11px] font-bold transition-colors ${darkMode ? 'text-white/40' : 'text-gray-500'}`}
                            >
                                {language === 'ar' ? 'ابق على اطلاع دائم بكل جديد حول حجوزاتك وعروضنا' : 'Stay up to date with your bookings and our latest offers'}
                            </motion.p>
                        </div>

                        <motion.button 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={markAllAsRead}
                            className={`flex items-center gap-2 text-[10px] font-black uppercase px-6 py-3.5 rounded-2xl transition-all border whitespace-nowrap tracking-wider shadow-sm ${
                                darkMode 
                                ? 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20' 
                                : 'bg-white border-black/5 text-gray-900 hover:bg-gray-50 hover:border-black/10'
                            }`}
                        >
                            <Check className="w-4 h-4 text-emerald-500" />
                            {language === 'ar' ? 'تحديد الكل كمقروء' : 'Mark All as Read'}
                        </motion.button>
                    </div>

                    {/* Compact Filters */}
                    <div className={`inline-flex gap-1.5 p-1.5 rounded-2xl border transition-all shadow-sm mb-8 ${darkMode ? 'bg-[#1a2235]/60 border-white/5' : 'bg-white border-black/5'}`}>
                        <button 
                            onClick={() => setFilter('all')}
                            className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all tracking-widest ${filter === 'all' ? 'bg-[#E51B24] text-white shadow-lg shadow-[#E51B24]/20' : darkMode ? 'text-white/40 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}
                        >
                            {language === 'ar' ? 'عرض الكل' : 'All'}
                        </button>
                        <button 
                            onClick={() => setFilter('unread')}
                            className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 tracking-widest ${filter === 'unread' ? 'bg-[#E51B24] text-white shadow-lg shadow-[#E51B24]/20' : darkMode ? 'text-white/40 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}
                        >
                            {language === 'ar' ? 'غير مقروء' : 'Unread'}
                            {notifications.filter(n => !n.read).length > 0 && (
                                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black transition-colors ${filter === 'unread' ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                                    {notifications.filter(n => !n.read).length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 relative z-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-6">
                        <div className="relative">
                            <div className="w-12 h-12 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin"></div>
                            <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse rounded-full"></div>
                        </div>
                        <p className={`text-[11px] font-black uppercase tracking-[0.3em] ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>
                            {language === 'ar' ? 'جاري المزامنة' : 'Syncing Streams'}
                        </p>
                    </div>
                ) : filteredNotifications.length > 0 ? (
                    <div className="grid gap-4">
                        <AnimatePresence mode='popLayout'>
                            {filteredNotifications.map((notification, index) => (
                                <motion.div 
                                    key={notification.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    className={`group relative backdrop-blur-3xl rounded-3xl p-5 border transition-all duration-300 ${
                                        darkMode 
                                        ? `bg-white/5 border-white/5 hover:border-primary/30 ${notification.read ? 'opacity-60' : 'bg-primary/[0.02]'}` 
                                        : `bg-white border-black/5 hover:border-primary/30 shadow-sm ${notification.read ? 'opacity-80' : 'bg-primary/[0.01]'}`
                                    }`}
                                    onClick={() => !notification.read && markAsRead(notification.id)}
                                >
                                    <div className="flex items-start gap-5">
                                        <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center relative transition-transform duration-500 group-hover:scale-105 border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-black/5'}`}>
                                            <div className="relative z-10">{getIcon(notification.type)}</div>
                                            {!notification.read && <div className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-[#1a2235] translate-x-1/3 -translate-y-1/3 animate-bounce"></div>}
                                        </div>
                                        
                                        <div className="flex-grow min-w-0">
                                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                                <h3 className={`text-sm font-black tracking-tight truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {notification.title}
                                                </h3>
                                                <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider ${darkMode ? 'bg-white/5 border-white/5 text-white/40' : 'bg-slate-50 border-black/5 text-gray-500'}`}>
                                                    <Calendar className="w-3 h-3" />
                                                    {notification.createdAt ? new Date(notification.createdAt.seconds * 1000).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                                                </div>
                                            </div>
                                            <p className={`text-xs leading-relaxed font-bold transition-colors ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
                                                {notification.message}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Button - Trash */}
                                    <div className={`absolute ${language === 'en' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100`}>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNotification(notification.id);
                                            }}
                                            className="w-10 h-10 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition-all active:scale-90"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-32 text-center"
                    >
                        <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center mb-8 border transition-colors ${darkMode ? 'bg-white/5 border-white/5 text-white/10' : 'bg-white border-black/5 text-gray-200'}`}>
                            <Bell className="w-12 h-12" />
                        </div>
                        <h3 className={`text-3xl font-black mb-4 tracking-tighter transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {language === 'ar' ? 'صندوق الإشعارات فارغ' : 'All Clear.'}
                        </h3>
                        <p className={`text-sm font-bold max-w-xs mx-auto leading-relaxed transition-colors ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
                            {language === 'ar' ? 'سوف نظهر لك التنبيهات هنا فور توفرها، ابق مترقباً!' : 'No new notifications found. We will keep you updated as things happen.'}
                        </p>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
