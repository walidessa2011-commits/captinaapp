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
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] px-6 pb-8">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-2 nav-shadow flex items-center justify-between relative">
                {navItems.map((item, index) => {
                    const isActive = item.path === '/' 
                        ? pathname === '/' 
                        : pathname.startsWith(item.path);
                    const Icon = item.icon;
                    return (
                        <Link 
                            key={index}
                            href={item.path} 
                            className="relative flex-1 flex flex-col items-center justify-center py-2 h-14"
                        >
                            {isActive && (
                                <motion.div 
                                    layoutId="nav-active-bg"
                                    className="absolute -top-6 w-14 h-14 bg-primary rounded-full border-[6px] border-background shadow-xl shadow-primary/30 flex items-center justify-center z-20"
                                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                                >
                                    <Icon className="w-6 h-6 text-white" />
                                </motion.div>
                            )}
                            
                            <div className={`relative flex flex-col items-center transition-all duration-300 ${isActive ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
                                <Icon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-1">
                                    {item.name}
                                </span>
                            </div>

                            {isActive && (
                                <motion.span 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute bottom-1 text-[10px] font-black text-primary"
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
