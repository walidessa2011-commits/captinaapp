"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
    LayoutDashboard, 
    Calendar, 
    Users, 
    Wallet, 
    UserCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

const navItems = [
    {
        id: 'dashboard',
        label_ar: 'الرئيسية',
        label_en: 'Dashboard',
        icon: LayoutDashboard,
        href: '/trainer/dashboard'
    },
    {
        id: 'schedule',
        label_ar: 'الجدول',
        label_en: 'Schedule',
        icon: Calendar,
        href: '/trainer/schedule'
    },
    {
        id: 'clients',
        label_ar: 'المتدربين',
        label_en: 'Clients',
        icon: Users,
        href: '/trainer/clients'
    },
    {
        id: 'wallet',
        label_ar: 'المحفظة',
        label_en: 'Wallet',
        icon: Wallet,
        href: '/trainer/wallet'
    },
    {
        id: 'profile',
        label_ar: 'حسابي',
        label_en: 'Profile',
        icon: UserCircle,
        href: '/trainer/profile'
    }
];

export default function TrainerBottomNav() {
    const pathname = usePathname();
    const { language, darkMode } = useApp();

    return (
        <nav className={`fixed bottom-0 left-0 right-0 z-50 md:hidden`}>
            {/* Glass Background */}
            <div className={`absolute inset-0 backdrop-blur-xl border-t transition-colors duration-500 ${darkMode ? 'bg-black/60 border-white/10' : 'bg-white/80 border-black/5'}`}></div>
            
            <div className="relative flex items-center justify-around h-20 px-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link key={item.id} href={item.href} className="relative group flex flex-col items-center justify-center py-2 px-1 outline-none">
                            <div className={`relative p-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-[#E51B24]' : 'hover:bg-white/5'}`}>
                                <Icon className={`w-6 h-6 transition-colors duration-300 ${isActive ? 'text-white' : (darkMode ? 'text-white/40 group-hover:text-white' : 'text-gray-400 group-hover:text-gray-900')}`} />
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-glow"
                                        className="absolute inset-0 bg-white/20 blur-md rounded-2xl -z-10"
                                    />
                                )}
                            </div>
                            <span className={`mt-1.5 text-[10px] font-black tracking-tight transition-all duration-300 ${isActive ? (darkMode ? 'text-white' : 'text-[#E51B24]') : (darkMode ? 'text-white/30' : 'text-gray-400')}`}>
                                {language === 'ar' ? item.label_ar : item.label_en}
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="active-dot"
                                    className="absolute -top-1 w-1 h-1 bg-[#E51B24] rounded-full shadow-[0_0_8px_#E51B24]"
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
            
            {/* Safe Area Padding */}
            <div className={`h-[env(safe-area-inset-bottom)] ${darkMode ? 'bg-black/60' : 'bg-white/80'}`}></div>
        </nav>
    );
}
