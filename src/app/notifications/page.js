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
    const { language } = useApp();
    const [user] = useAuthState(auth);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, unread

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
            default: return <Bell className="w-5 h-5 text-primary" />;
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0f1a] pb-40 transition-colors duration-500 overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[160px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[140px] -z-0 -translate-x-1/2 translate-y-1/2"></div>

            {/* Header / Breadcrumbs - Compact Version */}
            <header className="relative z-20 pt-6 px-4">
                <div className="max-w-4xl mx-auto flex flex-col items-center">
                    {/* Breadcrumbs */}
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest opacity-50"
                    >
                        <Link href="/" className="hover:text-primary transition-colors">{language === 'ar' ? 'الرئيسية' : 'Home'}</Link>
                        <span className="text-gray-500">
                            {language === 'ar' ? ' < ' : ' > '}
                        </span>
                        <span className="text-primary">{language === 'ar' ? 'الإشعارات' : 'Notifications'}</span>
                    </motion.div>

                    {/* Consolidated Title Line - Horizontal */}
                    <div className="flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-3 mb-4"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                            <h1 className="text-xl md:text-2xl font-black text-white tracking-tighter italic uppercase text-center">
                                {language === 'ar' 
                                    ? '( تفاعل لحظي - إشعارات كابتينة )' 
                                    : '( Real-time Updates - Captina Notifications )'}
                            </h1>
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                        </motion.div>

                        <motion.button 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={markAllAsRead}
                            className="text-[8px] font-black text-primary uppercase bg-primary/10 px-6 py-2.5 rounded-xl hover:bg-primary hover:text-white transition-all border border-primary/20 active:scale-95 whitespace-nowrap tracking-[0.2em] mb-4"
                        >
                            {language === 'ar' ? 'تحديد الكل كمقروء' : 'Mark All as Read'}
                        </motion.button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 pt-1 pb-6 relative z-10">
                {/* Compact Filters */}
                <div className="flex gap-1.5 mb-6 bg-[#1a2235]/60 backdrop-blur-3xl p-1 rounded-xl border border-white/5 w-fit mx-auto md:mx-0 shadow-sm">
                    <button 
                        onClick={() => setFilter('all')}
                        className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase transition-all tracking-widest ${filter === 'all' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}
                    >
                        {language === 'ar' ? 'عرض الكل' : 'All'}
                    </button>
                    <button 
                        onClick={() => setFilter('unread')}
                        className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase transition-all flex items-center gap-1.5 tracking-widest ${filter === 'unread' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}
                    >
                        {language === 'ar' ? 'غير مقروء' : 'Unread'}
                        {notifications.filter(n => !n.read).length > 0 && (
                            <span className={`px-1.5 py-0.5 rounded text-[7px] font-black ${filter === 'unread' ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                                {notifications.filter(n => !n.read).length}
                            </span>
                        )}
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-4">
                        <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-[10px] font-black text-gray-500 tracking-widest uppercase italic">
                            {language === 'ar' ? 'جاري التحميل...' : 'Syncing...'}
                        </p>
                    </div>
                ) : filteredNotifications.length > 0 ? (
                    <div className="space-y-2.5">
                        <AnimatePresence mode='popLayout'>
                            {filteredNotifications.map((notification) => (
                                <motion.div 
                                    key={notification.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={`group relative bg-[#1a2235]/40 backdrop-blur-3xl rounded-xl p-4 border transition-all duration-300 hover:border-primary/20 cursor-pointer ${notification.read ? 'border-white/5 opacity-70' : 'border-primary/20 shadow-sm bg-primary/[0.01]'}`}
                                    onClick={() => !notification.read && markAsRead(notification.id)}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center relative overflow-hidden ${notification.read ? 'bg-white/5' : 'bg-primary/10'} border border-white/5 group-hover:scale-105 transition-transform`}>
                                            <div className="relative z-10 scale-75">{getIcon(notification.type)}</div>
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex items-center justify-between gap-3 mb-0.5">
                                                <div className="flex items-center gap-1.5">
                                                    {!notification.read && <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]"></div>}
                                                    <h3 className={`text-[11px] font-black tracking-tight ${notification.read ? 'text-gray-400' : 'text-white'}`}>
                                                        {notification.title}
                                                    </h3>
                                                </div>
                                                <span className="text-[7px] font-black text-gray-500 bg-white/5 px-1.5 py-0.5 rounded-md uppercase tracking-wider border border-white/5 whitespace-nowrap">
                                                    {notification.createdAt ? new Date(notification.createdAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                                                </span>
                                            </div>
                                            <p className={`text-[10px] leading-relaxed font-bold tracking-tight ${notification.read ? 'text-gray-500' : 'text-gray-300'}`}>
                                                {notification.message}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Button - Trash */}
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNotification(notification.id);
                                            }}
                                            className="p-1.5 bg-rose-500/10 text-rose-500 rounded-md hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 active:scale-90"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-32 text-center space-y-8"
                    >
                        <div className="relative w-32 h-32 bg-[#1a2235]/60 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-white/5 group hover:rotate-6 transition-transform">
                            <Bell className="w-12 h-12 text-gray-700" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black text-white tracking-tighter">
                                {language === 'ar' ? 'لا يوجد تنبيهات حالياً' : 'Zero Transmission.'}
                            </h3>
                            <p className="text-sm text-gray-500 font-bold max-w-xs mx-auto leading-relaxed">
                                {language === 'ar' ? 'سوف تظهر التنبيهات الخاصة بك هنا فور صدورها.' : 'Safe and quiet. Elite briefings will emerge here when necessary.'}
                            </p>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
