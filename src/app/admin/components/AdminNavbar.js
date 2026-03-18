"use client";
import React, { useState } from 'react';
import { 
    Search, 
    Bell, 
    User, 
    Menu, 
    Settings,
    LogOut,
    ExternalLink,
    ChevronDown,
    Zap,
    Globe
} from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function AdminNavbar({ setIsSidebarOpen }) {
    const { user, userData, language, setLanguage, darkMode, setDarkMode } = useApp();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <header className="h-20 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 sticky top-0 z-30 px-6 lg:px-10 flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-6">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all lg:hidden"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="hidden lg:flex items-center gap-3 bg-gray-50 dark:bg-white/5 px-4 py-2.5 rounded-2xl border border-transparent focus-within:border-primary/20 focus-within:bg-white dark:focus-within:bg-[#1a2235] transition-all w-80 group">
                    <Search className="w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text" 
                        placeholder={language === 'ar' ? 'البحث عن بيانات...' : 'Search for data...'}
                        className="bg-transparent border-none outline-none text-sm w-full font-bold dark:text-white placeholder-gray-400"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3 lg:gap-5">
                {/* Language Switch */}
                <button 
                    onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-2xl hover:bg-white dark:hover:bg-white/10 hover:shadow-lg transition-all border border-transparent hover:border-gray-100 dark:hover:border-white/10 group group-active:scale-95"
                >
                    <div className="w-6 h-6 flex items-center justify-center bg-primary/10 rounded-lg group-hover:bg-primary transition-colors">
                        <Globe className="w-3.5 h-3.5 text-primary group-hover:text-white" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-gray-600 dark:text-gray-300">
                        {language === 'ar' ? 'English' : 'العربية'}
                    </span>
                </button>

                {/* Notifications */}
                <button className="relative p-3 bg-gray-50 dark:bg-white/5 rounded-2xl hover:bg-white dark:hover:bg-white/10 hover:shadow-lg transition-all border border-transparent hover:border-gray-100 dark:hover:border-white/10 group">
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors" />
                    <span className="absolute top-3.5 right-3.5 w-1.5 h-1.5 bg-primary border-2 border-white dark:border-[#0f172a] rounded-full ring-2 ring-primary/20"></span>
                </button>

                {/* Vertical Divider */}
                <div className="w-px h-8 bg-gray-100 dark:bg-white/5 mx-2 hidden lg:block"></div>

                {/* User Profile */}
                <div className="relative">
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 p-1.5 bg-gray-50 dark:bg-white/5 rounded-[1.25rem] border border-transparent hover:bg-white dark:hover:bg-white/10 hover:shadow-xl transition-all group"
                    >
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg border-2 border-primary/20 ring-4 ring-primary/5 flex items-center justify-center bg-gray-50 dark:bg-white/5">
                            {userData?.photoURL || user?.photoURL ? (
                                <img 
                                    src={userData?.photoURL || user?.photoURL} 
                                    alt="Admin Profile" 
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full aspect-square object-cover"
                                />
                            ) : (
                                <User className="w-6 h-6 text-primary" />
                            )}
                        </div>
                        <div className="hidden lg:flex flex-col text-start mr-1">
                            <span className="text-xs font-black text-slate-900 dark:text-white leading-none mb-0.5 tracking-tight truncate max-w-[120px]">
                                {userData?.fullName || user?.displayName || 'Admin Console'}
                            </span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest opacity-60">
                                System Root
                            </span>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 group-hover:text-primary transition-transform hidden lg:block ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isProfileOpen && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 10, x: language === 'ar' ? -10 : 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10, x: language === 'ar' ? -10 : 10 }}
                                className={`absolute top-[calc(100%+12px)] ${language === 'ar' ? 'left-0' : 'right-0'} w-72 bg-white dark:bg-[#1a2235] rounded-[2rem] shadow-2xl border border-gray-100 dark:border-white/10 p-4 z-50 overflow-hidden`}
                            >
                                <div className="p-4 mb-3 bg-slate-50 dark:bg-white/5 rounded-[1.5rem] border border-gray-100 dark:border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                                            <Zap className="w-7 h-7 text-primary" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-slate-900 dark:text-white truncate tracking-tight uppercase">Admin Control</span>
                                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 truncate opacity-70">admin@captina.sa</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Link 
                                        href="/" 
                                        className="flex items-center gap-3 p-3.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-all text-sm font-bold group"
                                    >
                                        <div className="p-2 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
                                            <ExternalLink className="w-4 h-4" />
                                        </div>
                                        <span>{language === 'ar' ? 'عودة للموقع العام' : 'View Public Site'}</span>
                                    </Link>
                                    
                                    <Link 
                                        href="/settings" 
                                        className="flex items-center gap-3 p-3.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-all text-sm font-bold group"
                                    >
                                        <div className="p-2 bg-blue-100 dark:bg-blue-500/10 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                                            <Settings className="w-4 h-4" />
                                        </div>
                                        <span>{language === 'ar' ? 'إعدادات النظام' : 'System Settings'}</span>
                                    </Link>

                                    <div className="h-px bg-gray-100 dark:bg-white/5 my-2"></div>
                                    
                                    <button 
                                        onClick={async () => {
                                            const { auth } = await import("@/lib/firebase");
                                            await auth.signOut();
                                            window.location.href = '/login';
                                        }}
                                        className="w-full flex items-center gap-3 p-3.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all text-sm font-bold group"
                                    >
                                        <div className="p-2 bg-rose-100 dark:bg-rose-500/10 text-rose-500 rounded-lg group-hover:scale-110 transition-transform">
                                            <LogOut className="w-4 h-4" />
                                        </div>
                                        <span>{language === 'ar' ? 'تسجيل الخروج' : 'Terminate Session'}</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
