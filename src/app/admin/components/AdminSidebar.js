"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, Users, UserCheck, Building2, ShoppingBag,
    Tag, CalendarCheck, CreditCard, LogOut, X, Shield, PlaySquare,
    Dumbbell, BarChart3, MessageCircle, Settings2, Package,
    ChevronRight, ChevronLeft, Zap, Bell
} from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from "@/lib/firebase";

const MENU_GROUPS = [
    {
        group: null,
        items: [
            { title: 'Dashboard', title_ar: 'لوحة التحكم', href: '/admin/dashboard', icon: LayoutDashboard },
        ]
    },
    {
        group: 'People', group_ar: 'المستخدمون',
        items: [
            { title: 'Users', title_ar: 'المستخدمين', href: '/admin/users', icon: Users },
            { title: 'Trainers', title_ar: 'المدربين', href: '/admin/trainers', icon: UserCheck },
        ]
    },
    {
        group: 'Content', group_ar: 'المحتوى',
        items: [
            { title: 'Sports', title_ar: 'الرياضات', href: '/admin/sports', icon: Dumbbell },
            { title: 'Gyms', title_ar: 'النوادي', href: '/admin/gyms', icon: Building2 },
            { title: 'Videos', title_ar: 'الفيديوهات', href: '/admin/videos', icon: PlaySquare },
            { title: 'Packages', title_ar: 'الباقات', href: '/admin/packages', icon: Package },
            { title: 'Offers', title_ar: 'العروض', href: '/admin/offers', icon: Tag },
            { title: 'Products', title_ar: 'المنتجات', href: '/admin/products', icon: ShoppingBag },
        ]
    },
    {
        group: 'Operations', group_ar: 'العمليات',
        items: [
            { title: 'Bookings', title_ar: 'الحجوزات', href: '/admin/bookings', icon: CalendarCheck, badge: 'pending' },
            { title: 'Orders', title_ar: 'الطلبات', href: '/admin/orders', icon: CreditCard },
            { title: 'Requests', title_ar: 'الطلبات الإدارية', href: '/admin/requests', icon: CalendarCheck },
            { title: 'Support', title_ar: 'الدعم الفني', href: '/admin/support', icon: MessageCircle },
        ]
    },
    {
        group: 'System', group_ar: 'النظام',
        items: [
            { title: 'Reports', title_ar: 'التقارير', href: '/admin/reports', icon: BarChart3 },
            { title: 'Settings', title_ar: 'الإعدادات', href: '/admin/settings', icon: Settings2 },
        ]
    },
];

export default function AdminSidebar({ isOpen, setIsOpen }) {
    const pathname = usePathname();
    const { language } = useApp();
    const ar = language === 'ar';

    const handleLogout = async () => {
        await auth.signOut();
        window.location.href = '/admin/login';
    };

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    x: isOpen ? 0 : (ar ? '100%' : '-100%'),
                    opacity: isOpen ? 1 : 0,
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={`fixed top-0 bottom-0 ${ar ? 'right-0' : 'left-0'} z-50 w-[260px] bg-white dark:bg-[#0d1526] border-e border-gray-100 dark:border-white/5 shadow-2xl lg:relative lg:translate-x-0 lg:opacity-100 flex flex-col`}
                style={{ width: isOpen ? 260 : 0, overflow: 'hidden', minWidth: isOpen ? 260 : 0 }}
            >
                {/* Logo */}
                <div className="p-5 flex items-center justify-between shrink-0 border-b border-gray-50 dark:border-white/5">
                    <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
                            <Shield className="text-white w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-base font-black text-gray-900 dark:text-white tracking-tight">Captina</span>
                            <span className="block text-[9px] font-black text-primary uppercase tracking-[0.15em]">Admin Panel</span>
                        </div>
                    </Link>
                    <button onClick={() => setIsOpen(false)} className="lg:hidden p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
                    {MENU_GROUPS.map((group, gi) => (
                        <div key={gi}>
                            {group.group && (
                                <p className="text-[8px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em] px-3 mb-1.5">
                                    {ar ? group.group_ar : group.group}
                                </p>
                            )}
                            <div className="space-y-0.5">
                                {group.items.map(item => {
                                    const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${
                                                isActive
                                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-white'
                                            }`}
                                        >
                                            {isActive && (
                                                <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-primary rounded-xl -z-10" />
                                            )}
                                            <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                                            <span className="text-xs font-bold flex-1">{ar ? item.title_ar : item.title}</span>
                                            {isActive && <div className={`w-1.5 h-1.5 bg-white/60 rounded-full ${ar ? 'mr-auto' : 'ml-auto'}`} />}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Footer */}
                <div className="shrink-0 p-3 border-t border-gray-50 dark:border-white/5">
                    <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-xs font-bold mb-1">
                        <Zap className="w-4 h-4 text-gray-400" />
                        {ar ? 'الموقع العام' : 'Public Site'}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all font-bold text-xs"
                    >
                        <LogOut className="w-4 h-4" />
                        {ar ? 'تسجيل الخروج' : 'Logout'}
                    </button>
                </div>
            </motion.aside>
        </>
    );
}
