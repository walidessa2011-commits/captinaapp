"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShoppingBag, 
    Dumbbell, 
    ChevronLeft, 
    ChevronRight, 
    Package, 
    Truck, 
    CheckCircle2, 
    XCircle, 
    Clock, 
    Calendar, 
    MapPin, 
    Hash,
    Search,
    Filter,
    ArrowRight,
    ArrowLeft,
    AlertCircle,
    Activity,
    User,
    CreditCard
} from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function MyOrdersPage() {
    const { language, darkMode, setAlert, t } = useApp();
    const router = useRouter();
    const [user, loadingAuth] = useAuthState(auth);
    
    const [activeTab, setActiveTab] = useState('store'); // 'store' or 'training'
    const [activeType, setActiveType] = useState('current'); // 'current' or 'previous'
    
    const [storeOrders, setStoreOrders] = useState([]);
    const [trainingOrders, setTrainingOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const isAr = language === 'ar';

    const fetchAllData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            // 1. Fetch Store Orders
            const qStore = query(
                collection(db, "orders"),
                where("userId", "==", user.uid),
                orderBy("createdAt", "desc")
            );
            const storeSnap = await getDocs(qStore);
            const storeData = storeSnap.docs.map(doc => {
                const d = doc.data();
                return {
                    id: doc.id,
                    ...d,
                    items: d.itemsNames || d.items?.map(i => i.name_ar || i.name) || [],
                    total: d.totalPrice ? `${d.totalPrice} ${isAr ? 'ريال' : 'SAR'}` : '---',
                    date: d.createdAt?.toDate ? d.createdAt.toDate().toLocaleDateString(isAr ? 'ar-SA' : 'en-US') : '---',
                    status: d.status || 'processing',
                    statusLabel: d.statusText || (isAr ? 'قيد المعالجة' : 'Processing')
                };
            });
            setStoreOrders(storeData);

            // 2. Fetch Training (Bookings & Subscriptions)
            const qBookings = query(
                collection(db, "bookings"),
                where("userId", "==", user.uid),
                orderBy("createdAt", "desc")
            );
            const bookingsSnap = await getDocs(qBookings);
            const bookingsData = bookingsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                type: 'booking'
            }));

            const qSubs = query(
                collection(db, "subscriptions"),
                where("userId", "==", user.uid),
                orderBy("createdAt", "desc")
            );
            const subsSnap = await getDocs(qSubs);
            const subsData = subsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                type: 'subscription'
            }));

            const combinedTraining = [...bookingsData, ...subsData].sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
                return dateB - dateA;
            });

            const formattedTraining = combinedTraining.map(item => {
                let status = item.status?.toLowerCase() || 'pending';
                let statusLabel = item.status;
                
                if (isAr) {
                    if (['confirmed', 'مؤكد', 'active'].includes(status)) statusLabel = "مؤكد / نشط";
                    else if (['pending', 'قيد الانتظار'].includes(status)) statusLabel = "قيد الانتظار";
                    else if (['cancelled', 'ملغي'].includes(status)) statusLabel = "ملغي";
                    else if (['completed', 'تمت'].includes(status)) statusLabel = "مكتملة";
                } else {
                    if (['confirmed', 'مؤكد', 'active'].includes(status)) statusLabel = "Confirmed / Active";
                    else if (['pending', 'قيد الانتظار'].includes(status)) statusLabel = "Pending";
                    else if (['cancelled', 'ملغي'].includes(status)) statusLabel = "Cancelled";
                }

                return {
                    id: item.id,
                    ...item,
                    category: item.type === 'subscription' ? (isAr ? 'اشتراك باقة' : 'Package Sub') : (isAr ? 'جلسة تدريب' : 'Training Session'),
                    title: item.type === 'subscription' ? item.planLabel : (item.serviceName || (isAr ? 'تدريب شخصي' : 'Personal Training')),
                    trainer: item.trainerName || (isAr ? 'كابتن كابتينا' : 'Captina Coach'),
                    date: item.startDate || item.date || '---',
                    price: item.price ? `${item.price} ${isAr ? 'ريال' : 'SAR'}` : '---',
                    status: status,
                    statusLabel: statusLabel
                };
            });
            setTrainingOrders(formattedTraining);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, [user, isAr]);

    useEffect(() => {
        if (!loadingAuth && !user) {
            router.push('/login');
            return;
        }
        fetchAllData();
    }, [user, loadingAuth, router, fetchAllData]);

    const getStoreStatusStyles = (status) => {
        const s = status.toLowerCase();
        if (['processing', 'pending'].includes(s)) return { bg: 'bg-amber-500/10', text: 'text-amber-500', icon: <Package className="w-4 h-4" /> };
        if (['shipping', 'shipped'].includes(s)) return { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: <Truck className="w-4 h-4" /> };
        if (['delivered', 'completed', 'success'].includes(s)) return { bg: 'bg-emerald-500/10', text: 'text-emerald-500', icon: <CheckCircle2 className="w-4 h-4" /> };
        if (['cancelled', 'failed'].includes(s)) return { bg: 'bg-rose-500/10', text: 'text-rose-500', icon: <XCircle className="w-4 h-4" /> };
        return { bg: 'bg-gray-500/10', text: 'text-gray-500', icon: <AlertCircle className="w-4 h-4" /> };
    };

    const getTrainingStatusStyles = (status) => {
        const s = status.toLowerCase();
        if (['active', 'confirmed', 'مؤكد'].includes(s)) return { bg: 'bg-emerald-500/10', text: 'text-emerald-500', icon: <CheckCircle2 className="w-4 h-4" /> };
        if (['pending', 'قيد الانتظار'].includes(s)) return { bg: 'bg-amber-500/10', text: 'text-amber-500', icon: <Clock className="w-4 h-4" /> };
        if (['cancelled', 'ملغي', 'expired', 'failed'].includes(s)) return { bg: 'bg-rose-500/10', text: 'text-rose-500', icon: <XCircle className="w-4 h-4" /> };
        if (['completed', 'تمت'].includes(s)) return { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: <CheckCircle2 className="w-4 h-4" /> };
        return { bg: 'bg-gray-500/10', text: 'text-gray-500', icon: <AlertCircle className="w-4 h-4" /> };
    };

    // Filter Logic
    const filteredStore = storeOrders.filter(o => {
        const s = o.status.toLowerCase();
        if (activeType === 'current') return !['delivered', 'cancelled', 'failed'].includes(s);
        return ['delivered', 'cancelled', 'failed'].includes(s);
    });

    const filteredTraining = trainingOrders.filter(o => {
        const s = o.status.toLowerCase();
        if (activeType === 'current') return ['pending', 'confirmed', 'active', 'مؤكد', 'قيد الانتظار'].includes(s);
        return ['cancelled', 'completed', 'expired', 'failed', 'ملغي', 'تمت'].includes(s);
    });

    if (loadingAuth || loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a] flex items-center justify-center">
                <div className="relative group">
                    <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Activity className="w-6 h-6 text-primary animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${darkMode ? "bg-[#0a0f1a]" : "bg-slate-50"} pb-32 transition-colors duration-500 relative overflow-hidden`} dir={isAr ? 'rtl' : 'ltr'}>
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[160px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[140px] -z-0 -translate-x-1/2 translate-y-1/2"></div>

            <main className="max-w-xl mx-auto px-4 pt-4 relative z-10">
                {/* Custom Header */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => router.back()}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-slate-900 dark:text-white hover:bg-primary hover:text-white transition-all shadow-premium"
                        >
                            {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        </button>
                        <div>
                            <h1 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                {isAr ? 'سجل طلباتي' : 'Order History'}
                            </h1>
                            <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mt-0.5 opacity-70">
                                {isAr ? 'إدارة جميع مشترياتك وتدريباتك' : 'Manage your orders & sessions'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Tab Switcher - Store vs Training */}
                <div className="grid grid-cols-2 gap-2 mb-4 p-1 rounded-[1.2rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-premium backdrop-blur-3xl">
                    <button 
                        onClick={() => setActiveTab('store')}
                        className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-black uppercase tracking-widest text-[9px] transition-all ${
                            activeTab === 'store' 
                            ? 'bg-primary text-white shadow-xl shadow-primary/25 scale-[1.02] -translate-y-[1px]' 
                            : 'text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-white'
                        }`}
                    >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{isAr ? 'طلبات المتجر' : 'Store Orders'}</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('training')}
                        className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-black uppercase tracking-widest text-[9px] transition-all ${
                            activeTab === 'training' 
                            ? 'bg-primary text-white shadow-xl shadow-primary/25 scale-[1.02] -translate-y-[1px]' 
                            : 'text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-white'
                        }`}
                    >
                        <Dumbbell className="w-3.5 h-3.5" />
                        <span>{isAr ? 'طلبات التدريب' : 'Training'}</span>
                    </button>
                </div>

                {/* Sub Tab Switcher - Current vs Previous */}
                <div className="flex items-center gap-2 mb-4 justify-center">
                    <button 
                        onClick={() => setActiveType('current')}
                        className={`px-4 py-1.5 rounded-full text-[8.5px] font-black uppercase tracking-widest border-2 transition-all ${
                            activeType === 'current'
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-lg'
                            : 'border-gray-200 dark:border-white/10 text-gray-400 dark:text-gray-500 hover:border-primary hover:text-primary'
                        }`}
                    >
                        {isAr ? 'الطلبات الحالية' : 'Current Orders'}
                    </button>
                    <button 
                        onClick={() => setActiveType('previous')}
                        className={`px-4 py-1.5 rounded-full text-[8.5px] font-black uppercase tracking-widest border-2 transition-all ${
                            activeType === 'previous'
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-lg'
                            : 'border-gray-200 dark:border-white/10 text-gray-400 dark:text-gray-500 hover:border-primary hover:text-primary'
                        }`}
                    >
                        {isAr ? 'الطلبات السابقة' : 'Order History'}
                    </button>
                </div>

                {/* Content Area */}
                <div className="space-y-6">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={`${activeTab}-${activeType}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* STORE ORDERS LIST */}
                            {activeTab === 'store' && (
                                <>
                                    {filteredStore.length > 0 ? filteredStore.map((order, idx) => (
                                        <div 
                                            key={order.id}
                                            className="group bg-white dark:bg-[#1a2235]/60 backdrop-blur-3xl border border-gray-100 dark:border-white/5 rounded-[1.2rem] p-3.5 shadow-premium hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-gray-50 dark:border-white/5">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                                        <ShoppingBag className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Hash className="w-2.5 h-2.5 text-primary" />
                                                            <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-wider">{order.id.slice(-8)}</span>
                                                        </div>
                                                        <p className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">
                                                            {order.date}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black flex items-center gap-1.5 uppercase tracking-widest ${getStoreStatusStyles(order.status).bg} ${getStoreStatusStyles(order.status).text}`}>
                                                    {getStoreStatusStyles(order.status).icon}
                                                    {order.statusLabel}
                                                </div>
                                            </div>

                                            <div className="space-y-4 mb-8 px-2">
                                                {order.items.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-4">
                                                        <div className="w-3 h-3 rounded-full bg-primary/20 flex-shrink-0"></div>
                                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                                                            {item}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-between pt-3 bg-gray-50/50 dark:bg-white/5 -mx-4 -mb-4 p-4 rounded-b-[1.5rem]">
                                                <div className="flex items-center gap-4">
                                                    <div>
                                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{isAr ? 'طريقة الدفع' : 'Payment'}</p>
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-900 dark:text-white">
                                                            <CreditCard className="w-3 h-3 text-primary" />
                                                            <span>{isAr ? 'عند الاستلام' : 'COD'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{isAr ? 'الإجمالي' : 'Total'}</p>
                                                    <p className="text-lg font-black text-primary">{order.total}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <EmptyState icon={ShoppingBag} message={isAr ? 'لا توجد طلبات متجر حالياً' : 'No store orders found'} />
                                    )}
                                </>
                            )}

                            {/* TRAINING ORDERS LIST */}
                            {activeTab === 'training' && (
                                <>
                                    {filteredTraining.length > 0 ? filteredTraining.map((order, idx) => (
                                        <div 
                                            key={order.id}
                                            className="group bg-white dark:bg-[#1a2235]/60 backdrop-blur-3xl border border-gray-100 dark:border-white/5 rounded-[1.5rem] p-4 shadow-premium hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-gray-50 dark:border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                                                        <Dumbbell className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-1.5 py-0.5 rounded-md inline-block mb-0.5">
                                                            {order.category}
                                                        </p>
                                                        <h4 className="text-sm font-black text-slate-900 dark:text-white">{order.title}</h4>
                                                    </div>
                                                </div>
                                                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black flex items-center gap-1.5 uppercase tracking-widest ${getTrainingStatusStyles(order.status).bg} ${getTrainingStatusStyles(order.status).text}`}>
                                                    {getTrainingStatusStyles(order.status).icon}
                                                    {order.statusLabel}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-8">
                                                <div className="flex items-center gap-3 bg-gray-50/50 dark:bg-white/5 p-3 rounded-2xl">
                                                    <Calendar className="w-4 h-4 text-primary" />
                                                    <div>
                                                        <p className="text-[8px] font-black text-gray-400 uppercase">{isAr ? 'التاريخ' : 'Date'}</p>
                                                        <p className="text-xs font-bold text-slate-900 dark:text-white">{order.date}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 bg-gray-50/50 dark:bg-white/5 p-3 rounded-2xl">
                                                    <User className="w-4 h-4 text-primary" />
                                                    <div>
                                                        <p className="text-[8px] font-black text-gray-400 uppercase">{isAr ? 'المدرب' : 'Trainer'}</p>
                                                        <p className="text-xs font-bold text-slate-900 dark:text-white">{order.trainer}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-3 bg-gray-50/50 dark:bg-white/5 -mx-4 -mb-4 p-4 rounded-b-[1.5rem]">
                                                <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                    <MapPin className="w-3 h-3" />
                                                    <span>{isAr ? 'نادي كابتينا الرئيسي' : 'Captina Main Club'}</span>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{isAr ? 'قيمة الاشتراك' : 'Price'}</p>
                                                    <p className="text-base font-black text-primary">{order.price}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <EmptyState icon={Dumbbell} message={isAr ? 'لا توجد تدريبات حالية' : 'No training orders found'} />
                                    )}
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

function EmptyState({ icon: Icon, message }) {
    const { darkMode } = useApp();
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 bg-white dark:bg-white/5 rounded-[3rem] border border-gray-100 dark:border-white/10 shadow-premium"
        >
            <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 relative group">
                <Icon className="w-10 h-10 text-gray-300 dark:text-gray-600 group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20"></div>
            </div>
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
                {message}
            </p>
        </motion.div>
    );
}
