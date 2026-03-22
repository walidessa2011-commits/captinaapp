"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, ShoppingBag, User, Search, Home, Users, Dumbbell, Settings, PlaySquare } from 'lucide-react';
import { motion } from 'framer-motion';

import { useApp } from '@/context/AppContext';

export default function MobileNav() {
    const pathname = usePathname();
    const { t, language } = useApp();

    const navItems = [
        { name: t('home'), icon: Home, path: '/' },
        { name: t('sports'), icon: Dumbbell, path: '/sports' },
        { name: t('trainers'), icon: Users, path: '/trainers' },
        { name: t('store'), icon: ShoppingBag, path: '/store' },
        { name: t('library'), icon: PlaySquare, path: '/library' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[100] px-4 md:px-6 pb-4 pointer-events-none lg:hidden">
            <div className="bg-white/95 dark:bg-black/95 backdrop-blur-2xl border border-white/20 dark:border-white/5 rounded-[2rem] p-1.5 shadow-premium flex items-center justify-between relative pointer-events-auto">
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
                            className="relative flex-1 flex flex-col items-center justify-center py-1.5 h-12 group"
                        >
                            {isActive ? (
                                <motion.div 
                                    layoutId="nav-active-bg"
                                    className="absolute -top-5 w-12 h-12 bg-primary rounded-full border-[4px] border-white dark:border-[#0a0f1a] shadow-active flex items-center justify-center z-20"
                                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                                >
                                    <Icon className="w-5 h-5 text-white" />
                                </motion.div>
                            ) : (
                                <div className={`relative flex flex-col items-center transition-all duration-300 group-hover:scale-110`}>
                                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-gray-400 dark:text-gray-500" />
                                    <span className="text-[8px] md:text-[9px] font-bold text-gray-400 dark:text-gray-500 mt-0.5">
                                        {item.name}
                                    </span>
                                </div>
                            )}

                            {isActive && (
                                <motion.span 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute bottom-0 text-[8px] md:text-[9px] font-black text-primary"
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
