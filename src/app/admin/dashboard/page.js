"use client";
import React, { useState, useEffect, useMemo } from 'react';
import {
    Users, Building2, CalendarCheck, CreditCard, TrendingUp,
    Activity, ShoppingBag, ArrowUpRight, ArrowDownRight, Clock,
    UserCheck, Star, Package, Dumbbell, BarChart3, Eye,
    CheckCircle2, AlertCircle, Loader2, RefreshCw, Zap,
    Target, PlaySquare, MessageCircle, ChevronRight, ChevronLeft
} from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { motion } from 'framer-motion';
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit, where, Timestamp } from "firebase/firestore";
import Link from 'next/link';

// Mini sparkline chart using SVG
function Sparkline({ data = [], color = '#ff0000', height = 32 }) {
    if (!data.length) return null;
    const max = Math.max(...data, 1);
    const min = Math.min(...data);
    const range = max - min || 1;
    const w = 80, h = height;
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / range) * (h - 4) - 2;
        return `${x},${y}`;
    }).join(' ');
    const area = `0,${h} ` + pts + ` ${w},${h}`;
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
            <defs>
                <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={area} fill={`url(#sg-${color.replace('#','')})`} />
            <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={pts.split(' ').pop().split(',')[0]} cy={pts.split(' ').pop().split(',')[1]} r="3" fill={color} />
        </svg>
    );
}

// Donut chart
function DonutChart({ segments = [], size = 80 }) {
    const r = 28, cx = size / 2, cy = size / 2;
    const circ = 2 * Math.PI * r;
    const total = segments.reduce((a, b) => a + b.value, 0) || 1;
    let offset = 0;
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {segments.map((seg, i) => {
                const dash = (seg.value / total) * circ;
                const gap = circ - dash;
                const el = (
                    <circle key={i} cx={cx} cy={cy} r={r}
                        fill="none" stroke={seg.color} strokeWidth="8"
                        strokeDasharray={`${dash} ${gap}`}
                        strokeDashoffset={-offset}
                        strokeLinecap="round"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
                    />
                );
                offset += dash;
                return el;
            })}
            <circle cx={cx} cy={cy} r={r - 4} fill="currentColor" className="text-white dark:text-[#0f172a]" />
        </svg>
    );
}

export default function AdminDashboard() {
    const { language, getLoc } = useApp();
    const ar = language === 'ar';
    const [data, setData] = useState({
        users: 0, gyms: 0, bookings: 0, orders: 0,
        trainers: 0, products: 0, revenue: 0, subscribers: 0,
        pendingBookings: 0, confirmedBookings: 0,
        recentUsers: [], recentBookings: [], recentOrders: [],
        monthlyBookings: [], bookingsByStatus: [],
        topTrainers: [],
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchData = async () => {
        try {
            const [
                usersSnap, gymsSnap, bookingsSnap, ordersSnap,
                trainersSnap, productsSnap, subscriptionsSnap,
                recentUsersSnap, recentBookingsSnap, recentOrdersSnap,
            ] = await Promise.all([
                getDocs(collection(db, "users")),
                getDocs(collection(db, "gyms")),
                getDocs(collection(db, "bookings")),
                getDocs(collection(db, "orders")),
                getDocs(query(collection(db, "trainers"), where("status", "==", "active"))),
                getDocs(collection(db, "products")),
                getDocs(collection(db, "subscriptions")),
                getDocs(query(collection(db, "users"), orderBy("createdAt", "desc"), limit(6))),
                getDocs(query(collection(db, "bookings"), orderBy("createdAt", "desc"), limit(6))),
                getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(5))),
            ]);

            const bookingsData = bookingsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            const ordersData = ordersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            const subsData = subscriptionsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

            const revenue = [...ordersData, ...subsData].reduce((acc, d) => acc + (d.totalAmount || d.totalPrice || d.price || 0), 0);
            const pendingBookings = bookingsData.filter(b => b.status === 'pending').length;
            const confirmedBookings = bookingsData.filter(b => b.status === 'confirmed').length;
            const activeSubscribers = subsData.filter(s => s.status === 'active' || s.status === 'confirmed').length;

            // Monthly bookings for last 6 months
            const now = new Date();
            const monthlyBookings = Array.from({ length: 6 }, (_, i) => {
                const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
                const count = bookingsData.filter(b => {
                    const created = b.createdAt?.toDate?.() || (b.createdAt instanceof Date ? b.createdAt : null);
                    return created && created.getMonth() === d.getMonth() && created.getFullYear() === d.getFullYear();
                }).length;
                return count;
            });

            // Booking status distribution
            const statusGroups = { confirmed: 0, pending: 0, cancelled: 0, completed: 0 };
            bookingsData.forEach(b => { if (statusGroups[b.status] !== undefined) statusGroups[b.status]++; });
            const bookingsByStatus = [
                { label: ar ? 'مؤكد' : 'Confirmed', value: statusGroups.confirmed, color: '#10b981' },
                { label: ar ? 'قيد الانتظار' : 'Pending', value: statusGroups.pending, color: '#f59e0b' },
                { label: ar ? 'ملغي' : 'Cancelled', value: statusGroups.cancelled, color: '#ef4444' },
                { label: ar ? 'مكتمل' : 'Completed', value: statusGroups.completed, color: '#3b82f6' },
            ];

            setData({
                users: usersSnap.size,
                gyms: gymsSnap.size,
                bookings: bookingsSnap.size,
                orders: ordersSnap.size,
                trainers: trainersSnap.size,
                products: productsSnap.size,
                revenue: Math.round(revenue),
                subscribers: activeSubscribers,
                pendingBookings, confirmedBookings,
                recentUsers: recentUsersSnap.docs.map(d => ({ id: d.id, ...d.data() })),
                recentBookings: recentBookingsSnap.docs.map(d => ({ id: d.id, ...d.data() })),
                recentOrders: recentOrdersSnap.docs.map(d => ({ id: d.id, ...d.data() })),
                monthlyBookings,
                bookingsByStatus,
                topTrainers: trainersSnap.docs.map(d => ({ id: d.id, ...d.data() })).slice(0, 5),
            });
            setLastUpdated(new Date());
        } catch (err) {
            console.error("Dashboard fetch error:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleRefresh = () => { setRefreshing(true); fetchData(); };

    const getText = (f) => !f ? '' : typeof f === 'object' ? f[language] || f.ar || f.en || '' : f;

    const statCards = [
        { label: ar ? 'المستخدمين' : 'Total Users', value: data.users, icon: Users, color: '#3b82f6', bg: 'from-blue-500 to-blue-600', trend: '+12%', up: true, href: '/admin/users', spark: [4,6,5,8,7,data.users] },
        { label: ar ? 'الحجوزات' : 'Bookings', value: data.bookings, icon: CalendarCheck, color: '#8b5cf6', bg: 'from-violet-500 to-violet-600', trend: '+24%', up: true, href: '/admin/bookings', spark: [2,5,4,8,6,data.bookings] },
        { label: ar ? 'الإيرادات' : 'Revenue', value: `${data.revenue.toLocaleString()} ${ar ? 'ر.س' : 'SAR'}`, icon: TrendingUp, color: '#10b981', bg: 'from-emerald-500 to-emerald-600', trend: '+18%', up: true, href: '/admin/reports', spark: [10,15,12,20,18,data.revenue/100] },
        { label: ar ? 'المشتركين' : 'Subscribers', value: data.subscribers, icon: Star, color: '#f59e0b', bg: 'from-amber-500 to-amber-600', trend: '+8%', up: true, href: '/admin/requests', spark: [1,3,2,4,3,data.subscribers] },
        { label: ar ? 'المدربين النشطين' : 'Active Trainers', value: data.trainers, icon: UserCheck, color: '#ef4444', bg: 'from-rose-500 to-rose-600', trend: '+5%', up: true, href: '/admin/trainers', spark: [3,4,3,5,4,data.trainers] },
        { label: ar ? 'الطلبات' : 'Orders', value: data.orders, icon: ShoppingBag, color: '#06b6d4', bg: 'from-cyan-500 to-cyan-600', trend: '-2%', up: false, href: '/admin/orders', spark: [5,4,6,3,5,data.orders] },
        { label: ar ? 'النوادي' : 'Gyms', value: data.gyms, icon: Building2, color: '#6366f1', bg: 'from-indigo-500 to-indigo-600', trend: '+3%', up: true, href: '/admin/gyms', spark: [1,2,2,3,3,data.gyms] },
        { label: ar ? 'المنتجات' : 'Products', value: data.products, icon: Package, color: '#ec4899', bg: 'from-pink-500 to-pink-600', trend: '+1%', up: true, href: '/admin/products', spark: [10,12,11,14,13,data.products] },
    ];

    const quickActions = [
        { label: ar ? 'إضافة مدرب' : 'Add Trainer', icon: UserCheck, href: '/admin/trainers', color: 'text-violet-500 bg-violet-50 dark:bg-violet-500/10' },
        { label: ar ? 'إدارة الحجوزات' : 'Manage Bookings', icon: CalendarCheck, href: '/admin/bookings', color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
        { label: ar ? 'التقارير' : 'Reports', icon: BarChart3, href: '/admin/reports', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' },
        { label: ar ? 'إضافة منتج' : 'Add Product', icon: ShoppingBag, href: '/admin/products', color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' },
        { label: ar ? 'العروض' : 'Offers', icon: Zap, href: '/admin/offers', color: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10' },
        { label: ar ? 'الإعدادات' : 'Settings', icon: Target, href: '/admin/settings', color: 'text-gray-500 bg-gray-50 dark:bg-gray-500/10' },
    ];

    if (loading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">
                    {ar ? 'جاري تحميل البيانات...' : 'Loading data...'}
                </p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 pb-8">

            {/* ── Header ── */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        {ar ? '👋 لوحة التحكم' : '👋 Dashboard'}
                    </h1>
                    <p className="text-sm font-bold text-gray-400 mt-1">
                        {ar ? 'نظرة شاملة على أداء التطبيق' : 'Complete overview of app performance'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {lastUpdated && (
                        <span className="text-[10px] font-bold text-gray-400 hidden md:block">
                            {ar ? 'آخر تحديث: ' : 'Updated: '}{lastUpdated.toLocaleTimeString(ar ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-xs font-black hover:border-primary/30 hover:text-primary transition-all active:scale-95 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                        {ar ? 'تحديث' : 'Refresh'}
                    </button>
                </div>
            </div>

            {/* ── Alert: Pending Bookings ── */}
            {data.pendingBookings > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl"
                >
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                        <p className="text-sm font-bold text-amber-700 dark:text-amber-400">
                            {ar ? `${data.pendingBookings} حجز يحتاج مراجعة` : `${data.pendingBookings} booking(s) awaiting review`}
                        </p>
                    </div>
                    <Link href="/admin/bookings" className="text-xs font-black text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1">
                        {ar ? 'مراجعة' : 'Review'}
                        {ar ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </Link>
                </motion.div>
            )}

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <Link href={s.href} className="block group">
                            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/8 rounded-[1.5rem] p-5 hover:border-gray-200 dark:hover:border-white/15 hover:-translate-y-1 transition-all shadow-sm hover:shadow-md relative overflow-hidden">
                                {/* BG blob */}
                                <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 group-hover:scale-150 transition-all duration-500" style={{ background: s.color }} />

                                <div className="flex items-start justify-between mb-3">
                                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${s.bg} flex items-center justify-center text-white shadow-lg`}>
                                        <s.icon className="w-5 h-5" />
                                    </div>
                                    <span className={`text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-0.5 ${s.up ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400'}`}>
                                        {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                        {s.trend}
                                    </span>
                                </div>

                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-1">{s.value}</div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</div>
                                    </div>
                                    <Sparkline data={s.spark} color={s.color} />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* ── Charts Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Monthly Bookings Bar Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/8 rounded-[1.5rem] p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-sm font-black text-slate-900 dark:text-white">{ar ? 'الحجوزات الشهرية' : 'Monthly Bookings'}</h3>
                            <p className="text-[10px] font-bold text-gray-400 mt-0.5">{ar ? 'آخر 6 أشهر' : 'Last 6 months'}</p>
                        </div>
                        <BarChart3 className="w-5 h-5 text-gray-300" />
                    </div>
                    <div className="flex items-end gap-2 h-28">
                        {data.monthlyBookings.map((v, i) => {
                            const max = Math.max(...data.monthlyBookings, 1);
                            const pct = (v / max) * 100;
                            const months = ar
                                ? ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']
                                : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                            const now = new Date();
                            const mIdx = (now.getMonth() - 5 + i + 12) % 12;
                            const isLast = i === data.monthlyBookings.length - 1;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                                    <span className="text-[9px] font-black text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">{v}</span>
                                    <div className="w-full rounded-t-lg transition-all duration-500" style={{
                                        height: `${Math.max(pct, 4)}%`,
                                        background: isLast ? 'linear-gradient(to top, #ff0000, #ff6666)' : 'linear-gradient(to top, #e2e8f0, #cbd5e1)',
                                    }} />
                                    <span className="text-[8px] font-bold text-gray-400">{months[mIdx].slice(0,3)}</span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Booking Status Donut */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/8 rounded-[1.5rem] p-6"
                >
                    <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">{ar ? 'حالة الحجوزات' : 'Booking Status'}</h3>
                    <p className="text-[10px] font-bold text-gray-400 mb-6">{ar ? 'توزيع الحالات' : 'Status distribution'}</p>
                    <div className="flex flex-col items-center gap-4">
                        <DonutChart segments={data.bookingsByStatus} size={100} />
                        <div className="w-full space-y-2">
                            {data.bookingsByStatus.map((s, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                                        <span className="text-[10px] font-bold text-gray-500">{s.label}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-900 dark:text-white">{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ── Quick Actions ── */}
            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/8 rounded-[1.5rem] p-6">
                <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4">{ar ? '⚡ إجراءات سريعة' : '⚡ Quick Actions'}</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {quickActions.map((a, i) => (
                        <Link key={i} href={a.href}>
                            <div className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer">
                                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${a.color}`}>
                                    <a.icon className="w-5 h-5" />
                                </div>
                                <span className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center leading-tight">{a.label}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* ── Recent Activity ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Recent Users */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/8 rounded-[1.5rem] overflow-hidden"
                >
                    <div className="p-5 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                                <Users className="w-4 h-4 text-blue-500" />
                            </div>
                            <h3 className="text-sm font-black text-slate-900 dark:text-white">{ar ? 'أحدث المستخدمين' : 'Recent Users'}</h3>
                        </div>
                        <Link href="/admin/users" className="text-[10px] font-black text-primary hover:underline flex items-center gap-1">
                            {ar ? 'عرض الكل' : 'View All'}
                            {ar ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-white/5">
                        {data.recentUsers.length > 0 ? data.recentUsers.map(u => (
                            <div key={u.id} className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-white/3 transition-colors">
                                <div className="w-9 h-9 rounded-xl overflow-hidden bg-gray-100 dark:bg-white/10 shrink-0 flex items-center justify-center">
                                    {u.photoURL
                                        ? <img src={u.photoURL} referrerPolicy="no-referrer" className="w-full h-full object-cover" alt="" />
                                        : <Users className="w-4 h-4 text-gray-400" />
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-slate-900 dark:text-white truncate">{getText(u.fullName) || u.displayName || (ar ? 'بدون اسم' : 'Unnamed')}</p>
                                    <p className="text-[10px] font-bold text-gray-400 truncate">{u.email}</p>
                                </div>
                                <div className="shrink-0 flex items-center gap-1.5">
                                    <span className={`text-[9px] font-black px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' : 'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400'}`}>
                                        {u.role === 'admin' ? (ar ? 'أدمن' : 'Admin') : (ar ? 'مستخدم' : 'User')}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-gray-400 text-sm font-bold">{ar ? 'لا يوجد مستخدمين' : 'No users yet'}</div>
                        )}
                    </div>
                </motion.div>

                {/* Recent Bookings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/8 rounded-[1.5rem] overflow-hidden"
                >
                    <div className="p-5 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-violet-50 dark:bg-violet-500/10 rounded-xl">
                                <CalendarCheck className="w-4 h-4 text-violet-500" />
                            </div>
                            <h3 className="text-sm font-black text-slate-900 dark:text-white">{ar ? 'أحدث الحجوزات' : 'Recent Bookings'}</h3>
                        </div>
                        <Link href="/admin/bookings" className="text-[10px] font-black text-primary hover:underline flex items-center gap-1">
                            {ar ? 'عرض الكل' : 'View All'}
                            {ar ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-white/5">
                        {data.recentBookings.length > 0 ? data.recentBookings.map(b => (
                            <div key={b.id} className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-white/3 transition-colors">
                                <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center shrink-0">
                                    <Activity className="w-4 h-4 text-violet-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-slate-900 dark:text-white truncate">{b.clientName || getText(b.trainerName) || (ar ? 'حجز' : 'Booking')}</p>
                                    <p className="text-[10px] font-bold text-gray-400">{getText(b.sportType) || getText(b.sport?.name) || (ar ? 'رياضة' : 'Sport')} • {b.date || ''}</p>
                                </div>
                                <span className={`text-[9px] font-black px-2 py-1 rounded-full shrink-0 ${
                                    b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' :
                                    b.status === 'pending' ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' :
                                    b.status === 'cancelled' ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' :
                                    'bg-gray-100 text-gray-500 dark:bg-white/10'
                                }`}>
                                    {b.status === 'confirmed' ? (ar ? 'مؤكد' : 'Confirmed') :
                                     b.status === 'pending' ? (ar ? 'قيد الانتظار' : 'Pending') :
                                     b.status === 'cancelled' ? (ar ? 'ملغي' : 'Cancelled') :
                                     (b.status || (ar ? 'غير محدد' : 'Unknown'))}
                                </span>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-gray-400 text-sm font-bold">{ar ? 'لا يوجد حجوزات' : 'No bookings yet'}</div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* ── Recent Orders ── */}
            {data.recentOrders.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/8 rounded-[1.5rem] overflow-hidden"
                >
                    <div className="p-5 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-cyan-50 dark:bg-cyan-500/10 rounded-xl">
                                <ShoppingBag className="w-4 h-4 text-cyan-500" />
                            </div>
                            <h3 className="text-sm font-black text-slate-900 dark:text-white">{ar ? 'أحدث الطلبات' : 'Recent Orders'}</h3>
                        </div>
                        <Link href="/admin/orders" className="text-[10px] font-black text-primary hover:underline flex items-center gap-1">
                            {ar ? 'عرض الكل' : 'View All'}
                            {ar ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-white/5">
                                    <th className="text-start p-4">{ar ? 'العميل' : 'Customer'}</th>
                                    <th className="text-start p-4">{ar ? 'المبلغ' : 'Amount'}</th>
                                    <th className="text-start p-4">{ar ? 'الحالة' : 'Status'}</th>
                                    <th className="text-start p-4">{ar ? 'التاريخ' : 'Date'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                                {data.recentOrders.map(o => (
                                    <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors">
                                        <td className="p-4">
                                            <p className="text-sm font-black text-slate-900 dark:text-white">{o.userName || o.customerName || (ar ? 'عميل' : 'Customer')}</p>
                                            <p className="text-[10px] font-bold text-gray-400">{o.userPhone || o.customerPhone || ''}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm font-black text-primary">{o.totalAmount || o.totalPrice || 0} {ar ? 'ر.س' : 'SAR'}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-[9px] font-black px-2 py-1 rounded-full ${
                                                o.status === 'completed' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' :
                                                o.status === 'processing' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' :
                                                'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                                            }`}>
                                                {o.status === 'completed' ? (ar ? 'مكتمل' : 'Completed') :
                                                 o.status === 'processing' ? (ar ? 'جاري' : 'Processing') :
                                                 (ar ? 'قيد الانتظار' : 'Pending')}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-[10px] font-bold text-gray-400">
                                                {o.createdAt?.toDate?.()?.toLocaleDateString(ar ? 'ar-SA' : 'en-US') || '---'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

        </div>
    );
}
