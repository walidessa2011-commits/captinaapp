"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, ShoppingBag, User, Search, Home, Users, Dumbbell, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

import { useApp } from '@/context/AppContext';

export default function MobileNav() {
    const pathname = usePathname();
    const { t } = useApp();

    const navItems = [
        { name: t('home'), icon: Home, path: '/' },
        { name: t('sports'), icon: Dumbbell, path: '/sports' },
        { name: t('trainers'), icon: Users, path: '/trainers' },
        { name: t('store'), icon: ShoppingBag, path: '/store' },
        { name: t('settings'), icon: Settings, path: '/settings' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[100] px-6 pb-8 pointer-events-none">
            <div className="bg-white/95 dark:bg-black/95 backdrop-blur-2xl border border-white/20 dark:border-white/5 rounded-[3rem] p-2 shadow-premium flex items-center justify-between relative pointer-events-auto">
                {navItems.map((item, index) => {
                    const isActive = item.path === '/' 
                        ? pathname === '/' 
                        : pathname.startsWith(item.path);
                    const Icon = item.icon;
                    // Check if this is the middle item to give it a "special" look like the image
                    const isMiddle = index === Math.floor(navItems.length / 2);

                    return (
                        <Link 
                            key={index}
                            href={item.path} 
                            className="relative flex-1 flex flex-col items-center justify-center py-2 h-14 group"
                        >
                            {isActive ? (
                                <motion.div 
                                    layoutId="nav-active-bg"
                                    className="absolute -top-7 w-16 h-16 bg-primary rounded-full border-[6px] border-white dark:border-black shadow-active flex items-center justify-center z-20"
                                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                                >
                                    <Icon className="w-7 h-7 text-white" />
                                </motion.div>
                            ) : (
                                <div className={`relative flex flex-col items-center transition-all duration-300 group-hover:scale-110`}>
                                    <Icon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                                    <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 mt-1">
                                        {item.name}
                                    </span>
                                </div>
                            )}

                            {isActive && (
                                <motion.span 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute bottom-1 text-[9px] font-black text-primary"
                                >
                                    {item.name}
                                </motion.span>
                            )}
                        </Link>
                    )
                })}
            </div>
        </nav>
    );
}
