"use client";
import React, { useState, useEffect } from 'react';
import { 
    Users, 
    Building2, 
    CalendarCheck, 
    CreditCard, 
    TrendingUp, 
    Activity, 
    ShoppingBag, 
    ArrowUpRight,
    ArrowDownRight,
    Clock
} from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { motion } from 'framer-motion';
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import Link from 'next/link';

export default function AdminDashboard() {
    const { language } = useApp();
    const [stats, setStats] = useState({
        users: 0,
        gyms: 0,
        bookings: 0,
        orders: 0
    });
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentBookings, setRecentBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch total counts
                const usersSnap = await getDocs(collection(db, "users"));
                const gymsSnap = await getDocs(collection(db, "gyms"));
                const bookingsSnap = await getDocs(collection(db, "bookings"));
                const ordersSnap = await getDocs(collection(db, "orders"));

                setStats({
                    users: usersSnap.size,
                    gyms: gymsSnap.size,
                    bookings: bookingsSnap.size,
                    orders: ordersSnap.size
                });

                // Fetch recent users
                const recentUsersQuery = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(5));
                const recentUsersSnap = await getDocs(recentUsersQuery);
                setRecentUsers(recentUsersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

                // Fetch recent bookings
                const recentBookingsQuery = query(collection(db, "bookings"), orderBy("createdAt", "desc"), limit(5));
                const recentBookingsSnap = await getDocs(recentBookingsQuery);
                setRecentBookings(recentBookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statCards = [
        { 
            title: language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users', 
            count: stats.users, 
            icon: Users, 
            color: 'from-blue-500 to-blue-600',
            trend: '+12%',
            isPositive: true
        },
        { 
            title: language === 'ar' ? 'النوادي المسجلة' : 'Registered Gyms', 
            count: stats.gyms, 
            icon: Building2, 
            color: 'from-emerald-500 to-emerald-600',
            trend: '+5%',
            isPositive: true
        },
        { 
            title: language === 'ar' ? 'الحجوزات النشطة' : 'Active Bookings', 
            count: stats.bookings, 
            icon: CalendarCheck, 
            color: 'from-purple-500 to-purple-600',
            trend: '+24%',
            isPositive: true
        },
        { 
            title: language === 'ar' ? 'إجمالي الطلبات' : 'Total Orders', 
            count: stats.orders, 
            icon: CreditCard, 
            color: 'from-rose-500 to-rose-600',
            trend: '-2%',
            isPositive: false
        }
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                    {language === 'ar' ? 'نظرة عامة' : 'Dashboard Overview'}
                </h1>
                <p className="text-sm font-bold text-gray-500 mt-1">
                    {language === 'ar' ? 'ملخص أداء النظام والإحصائيات الرئيسية.' : 'Core system performance and primary statistics.'}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx}
                        className="bg-white dark:bg-white/5 backdrop-blur-3xl p-6 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-premium relative overflow-hidden group hover:-translate-y-1 transition-transform"
                    >
                        <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${stat.color} rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500`}></div>
                        
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${stat.isPositive ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'}`}>
                                {stat.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                                <span>{stat.trend}</span>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-3xl font-black text-slate-900 dark:text-white leading-none mb-1">{stat.count}</span>
                            <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{stat.title}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity Grids */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                {/* Recent Users */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-premium flex flex-col"
                >
                    <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-500/10 text-blue-600 rounded-xl">
                                <Users className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-black text-slate-900 dark:text-white">
                                {language === 'ar' ? 'أحدث المستخدمين' : 'Recent Users'}
                            </h2>
                        </div>
                        <Link href="/admin/users" className="text-xs font-bold text-primary hover:underline">
                            {language === 'ar' ? 'عرض الكل' : 'View All'}
                        </Link>
                    </div>
                    <div className="p-4 space-y-2 flex-grow">
                        {recentUsers.length > 0 ? recentUsers.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/5 flex items-center justify-center">
                                        {user.photoURL ? (
                                            <img 
                                                src={user.photoURL} 
                                                alt="Avatar" 
                                                referrerPolicy="no-referrer"
                                                className="w-full h-full aspect-square object-cover" 
                                            />
                                        ) : (
                                            <Users className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{user.fullName || (language === 'ar' ? 'بدون اسم' : 'Unnamed')}</span>
                                        <span className="text-[10px] text-gray-500">{user.email}</span>
                                    </div>
                                </div>
                                <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-lg">
                                    <Clock className="w-3 h-3" />
                                    <span>{user.createdAt ? user.createdAt.toDate().toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>
                        )) : (
                            <div className="p-6 text-center text-gray-500 font-bold text-sm">
                                {language === 'ar' ? 'لا يوجد مستخدمين بعد.' : 'No users found.'}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Recent Bookings */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-premium flex flex-col"
                >
                    <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-500/10 text-purple-600 rounded-xl">
                                <CalendarCheck className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-black text-slate-900 dark:text-white">
                                {language === 'ar' ? 'أحدث الحجوزات' : 'Recent Bookings'}
                            </h2>
                        </div>
                        <Link href="/admin/bookings" className="text-xs font-bold text-primary hover:underline">
                            {language === 'ar' ? 'عرض الكل' : 'View All'}
                        </Link>
                    </div>
                    <div className="p-4 space-y-2 flex-grow">
                        {recentBookings.length > 0 ? recentBookings.map(booking => (
                            <div key={booking.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 flex items-center justify-center">
                                        <Activity className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{booking.trainerName || booking.gymName || 'Session'}</span>
                                        <span className="text-[10px] text-gray-500">{booking.sportType || 'General'}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-xs font-black text-slate-900 dark:text-white">{booking.totalPrice || 0} {language === 'ar' ? 'ر.س' : 'SAR'}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'}`}>
                                        {booking.status === 'confirmed' ? (language === 'ar' ? 'مؤكد' : 'Confirmed') : (language === 'ar' ? 'قيد الانتظار' : 'Pending')}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <div className="p-6 text-center text-gray-500 font-bold text-sm">
                                {language === 'ar' ? 'لا يوجد حجوزات بعد.' : 'No bookings found.'}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
