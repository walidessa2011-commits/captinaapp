"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, 
    Users, 
    UserCheck, 
    Building2, 
    ShoppingBag, 
    Tag, 
    CalendarCheck, 
    CreditCard,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    Settings,
    Shield
} from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from "@/lib/firebase";

const menuItems = [
    { title: 'Dashboard', title_ar: 'لوحة التحكم', href: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'Users', title_ar: 'المستخدمين', href: '/admin/users', icon: Users },
    { title: 'Trainers', title_ar: 'المدربين', href: '/admin/trainers', icon: UserCheck },
    { title: 'Gyms', title_ar: 'النوادي الرياضية', href: '/admin/gyms', icon: Building2 },
    { title: 'Products', title_ar: 'المنتجات', href: '/admin/products', icon: ShoppingBag },
    { title: 'Offers', title_ar: 'العروض', href: '/admin/offers', icon: Tag },
    { title: 'Bookings', title_ar: 'الحجوزات', href: '/admin/bookings', icon: CalendarCheck },
    { title: 'Orders', title_ar: 'الطلبات', href: '/admin/orders', icon: CreditCard },
];

export default function AdminSidebar({ isOpen, setIsOpen }) {
    const pathname = usePathname();
    const { language, t } = useApp();

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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Content */}
            <motion.aside
                initial={false}
                animate={{ 
                    x: isOpen ? 0 : (language === 'ar' ? '100%' : '-100%'),
                    width: '280px'
                }}
                className={`fixed top-0 bottom-0 ${language === 'ar' ? 'right-0' : 'left-0'} z-50 bg-white dark:bg-[#0f172a] border-x border-gray-100 dark:border-white/5 shadow-2xl lg:translate-x-0 lg:static transition-all duration-300`}
            >
                {/* Header */}
                <div className="p-6 flex items-center justify-between border-b border-gray-50 dark:border-white/5">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                            <Shield className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                            Captina <span className="text-primary">Admin</span>
                        </span>
                    </Link>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-2 text-gray-400 hover:text-primary transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Main Menu */}
                <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link 
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group ${
                                    isActive 
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[0.98]' 
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                                }`}
                            >
                                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                                <span className="font-bold text-sm tracking-tight">
                                    {language === 'ar' ? item.title_ar : item.title}
                                </span>
                                {isActive && (
                                    <motion.div 
                                        layoutId="active-indicator"
                                        className={`ml-auto w-1.5 h-1.5 bg-white rounded-full ${language === 'ar' ? 'mr-auto ml-0' : 'ml-auto'}`}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-black/20">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all group font-bold"
                    >
                        <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        <span className="text-sm">{language === 'ar' ? 'تسجيل الخروج' : 'Logout System'}</span>
                    </button>
                </div>
            </motion.aside>
        </>
    );
}
