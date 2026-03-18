"use client";
import React, { useState, useEffect, useRef } from 'react';
import "./globals.css";
import Navigation from "@/components/Navigation";
import MobileNav from "@/components/MobileNav";
import Link from 'next/link';
import { User, ShoppingBag, LayoutDashboard, Calendar, Search, Bell, Menu, MapPin, ChevronDown, X, Home, CreditCard, Users as TrainersIcon, Store, MousePointer2, LogOut, Lock, Settings, Shield } from 'lucide-react';
import { AppProvider, useApp } from "@/context/AppContext";
import { usePathname, useRouter } from 'next/navigation';
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, onSnapshot, collection, query, where } from "firebase/firestore";
import { motion, AnimatePresence } from 'framer-motion';
import GlobalModal from "@/components/GlobalModal";
import CartDrawer from "@/components/CartDrawer";

function LayoutContent({ children }) {
    const { t, language, darkMode, setAlert, user, userData, loadingAuth } = useApp();
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith('/admin');
    const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/intro' || pathname === '/forgot-password' || pathname.includes('/forgot-password');
    const [unreadCount, setUnreadCount] = useState(0);
    const [greeting, setGreeting] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const menuRef = useRef(null);
    const profileRef = useRef(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        if (isMenuOpen || isProfileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isMenuOpen, isProfileOpen]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hasSeenIntro = localStorage.getItem('hasSeenIntro');
            if (!hasSeenIntro && pathname !== '/intro') {
                router.push('/intro');
            }
        }
    }, [pathname, router]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            document.documentElement.lang = language;
            document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        }
    }, [language]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
            return language === 'ar' ? 'صباح الخير ☀️' : 'Good Morning ☀️';
        } else if (hour >= 12 && hour < 17) {
            return language === 'ar' ? 'نهارك سعيد 👋' : 'Hi, Good day 👋';
        } else {
            return language === 'ar' ? 'مساء الخير 🌙' : 'Good Evening 🌙';
        }
    };

    useEffect(() => {
        setGreeting(getGreeting());
    }, [language]);


    useEffect(() => {
        if (!user) {
            setUnreadCount(0);
            return;
        }

        const q = query(
            collection(db, "notifications"),
            where("userId", "==", user.uid),
            where("read", "==", false)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setUnreadCount(snapshot.size);
        });

        return () => unsubscribe();
    }, [user]);

    const displayName = userData?.fullName || user?.displayName || (language === 'ar' ? "ضيف" : "Guest");
    const profileImg = user?.photoURL || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100";

    const handleLogout = () => {
        setAlert({
            title: language === 'ar' ? 'تسجيل الخروج' : 'Logout',
            message: language === 'ar' ? 'هل أنت متأكد من رغبتك في تسجيل الخروج؟' : 'Are you sure you want to log out?',
            type: 'confirm',
            onConfirm: async () => {
                await auth.signOut();
                router.push('/login');
                setIsProfileOpen(false);
            }
        });
    };

    return (
        <html lang={language || 'ar'} dir={language === 'en' ? 'ltr' : 'rtl'} className={darkMode ? 'dark' : ''}>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
            </head>
            <body className="antialiased flex flex-col min-h-screen bg-background dark:bg-background transition-colors duration-300">
                {(!isAuthPage && !isAdminPage && user) && (
                    <header className="sticky top-0 z-50 w-full bg-background/80 dark:bg-background/80 backdrop-blur-xl transition-all duration-300">
                        <div className="container mx-auto px-6 h-16 md:h-24 flex items-center justify-between">
                            {/* Right Side - Dropdown & Greeting */}
                            <div ref={menuRef} className="flex items-center gap-4 relative">
                                {/* Toggle Button for Dropdown */}
                                <button 
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="p-3 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-premium hover:shadow-active transition-all group relative z-[60] lg:hidden"
                                >
                                    {isMenuOpen ? (
                                        <X className="w-5 h-5 text-primary" />
                                    ) : (
                                        <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-primary" />
                                    )}
                                </button>

                                {/* Dropdown Menu Portal */}
                                <AnimatePresence>
                                    {isMenuOpen && (
                                        <>
                                            {/* Backdrop */}
                                            <motion.div 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                                            />
                                            {/* Menu Content */}
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.95, y: -20, x: language === 'ar' ? 20 : -20 }}
                                                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: -20, x: language === 'ar' ? 20 : -20 }}
                                                className={`absolute top-20 ${language === 'ar' ? 'right-4' : 'left-4'} w-64 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-white/10 p-4 z-[55] space-y-2 overflow-hidden`}
                                            >
                                                {[
                                                    { name: t('home'), href: '/', icon: Home },
                                                    { name: t('packages'), href: '/packages', icon: CreditCard },
                                                    { name: t('trainers'), href: '/trainers', icon: TrainersIcon },
                                                    { name: t('store'), href: '/store', icon: Store },
                                                    { name: t('booking.title'), href: '/booking', icon: MousePointer2 },
                                                ].map((link, idx) => (
                                                    <Link
                                                        key={link.href}
                                                        href={link.href}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className={`flex items-center gap-3 p-4 rounded-2xl transition-all ${
                                                            link.href === '/' 
                                                            ? pathname === '/' 
                                                            : pathname.startsWith(link.href) 
                                                            ? 'bg-primary/10 text-primary' 
                                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                                                        }`}
                                                    >
                                                        <link.icon className="w-5 h-5" />
                                                        <span className="font-bold">{link.name}</span>
                                                    </Link>
                                                ))}
                                                
                                                <div className="pt-2 mt-2 border-t border-gray-50 dark:border-white/5 space-y-2">
                                                    <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-4 rounded-2xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                                                        <User className="w-5 h-5" />
                                                        <span className="font-bold">{t('profile')}</span>
                                                    </Link>
                                                    {userData?.role === 'admin' && (
                                                        <Link href="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-4 rounded-2xl text-primary bg-primary/5 hover:bg-primary/10 transition-all font-black border border-primary/10">
                                                            <Shield className="w-5 h-5" />
                                                            <span>{language === 'ar' ? 'لوحة تحكم الإدارة' : 'Admin Panel'}</span>
                                                        </Link>
                                                    )}
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>

                                <div className="flex flex-col text-start">
                                    <p className="text-[10px] md:text-xs font-black text-gray-400 dark:text-gray-500 leading-none mb-1 uppercase tracking-wider">
                                        {greeting}
                                    </p>
                                    <h2 className="font-black text-gray-900 dark:text-white leading-tight capitalize flex items-center gap-1">
                                        <span className="text-base md:text-xl">{language === 'ar' ? 'مرحباً' : 'Welcome'}</span>
                                        <span className="text-gray-300 dark:text-gray-700">/</span>
                                        <span className="text-xs md:text-base opacity-90">{displayName}</span>
                                    </h2>
                                </div>
                            </div>

                            {/* Center Section (Desktop Navigation) */}
                            <div className="hidden lg:block">
                                <Navigation />
                            </div>

                            {/* Left Side - Notifications & Profile Dropdown */}
                            <div className="flex items-center gap-4">
                                <Link href="/notifications" className="relative p-3 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-all group">
                                    <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-primary" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-3 right-3 w-2 h-2 bg-primary border border-white dark:border-slate-900 rounded-full"></span>
                                    )}
                                </Link>
                                
                                <div ref={profileRef} className="relative">
                                    <button 
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className={`w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 shadow-premium transition-all flex items-center justify-center bg-white dark:bg-white/5 relative group ${isProfileOpen ? 'border-primary ring-4 ring-primary/20' : 'border-white dark:border-white/5 hover:border-primary/50'}`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        {userData?.photoURL || user?.photoURL ? (
                                            <img src={userData?.photoURL || user?.photoURL} alt="Profile" className="w-full h-full aspect-square object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white">
                                                <User className="w-6 h-6 md:w-8 md:h-8" />
                                            </div>
                                        )}
                                    </button>

                                    {/* Profile Dropdown Menu */}
                                    <AnimatePresence>
                                        {isProfileOpen && (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.95, y: 10, x: language === 'ar' ? -10 : 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: 10, x: language === 'ar' ? -10 : 10 }}
                                                className={`absolute top-[calc(100%+12px)] ${language === 'ar' ? 'left-0' : 'right-0'} w-64 bg-white dark:bg-[#1a2235] rounded-[2rem] shadow-2xl border border-gray-100 dark:border-white/10 p-3 z-[60] overflow-hidden`}
                                            >
                                                {/* Header Info */}
                                                <div className="p-4 mb-2 bg-slate-50 dark:bg-white/5 rounded-[1.5rem] flex items-center gap-3 border border-gray-100 dark:border-white/5">
                                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-primary/5 shadow-inner flex items-center justify-center">
                                                        {userData?.photoURL || user?.photoURL ? (
                                                            <img src={userData?.photoURL || user?.photoURL} alt="Dropdown Profile" className="w-full h-full aspect-square object-cover" />
                                                        ) : (
                                                            <User className="w-6 h-6 text-primary" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col text-start overflow-hidden">
                                                        <span className="text-sm font-black text-slate-900 dark:text-white truncate tracking-tight">{displayName}</span>
                                                        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 truncate opacity-70">{user?.email}</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <Link 
                                                        href="/profile" 
                                                        onClick={() => setIsProfileOpen(false)}
                                                        className="flex items-center gap-3 p-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-sm font-bold"
                                                    >
                                                        <User className="w-4 h-4 text-primary" />
                                                        <span>{language === 'ar' ? 'الصفحة الشخصية' : 'Personal Profile'}</span>
                                                    </Link>
                                                    <Link 
                                                        href="/settings" 
                                                        onClick={() => setIsProfileOpen(false)}
                                                        className="flex items-center gap-3 p-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-sm font-bold"
                                                    >
                                                        <Settings className="w-4 h-4 text-emerald-500" />
                                                        <span>{language === 'ar' ? 'الاعدادات' : 'Settings'}</span>
                                                    </Link>
                                                    <Link 
                                                        href="/settings/password" 
                                                        onClick={() => setIsProfileOpen(false)}
                                                        className="flex items-center gap-3 p-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-sm font-bold"
                                                    >
                                                        <Lock className="w-4 h-4 text-blue-500" />
                                                        <span>{language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}</span>
                                                    </Link>
                                                    
                                                    {userData?.role === 'admin' && (
                                                        <Link 
                                                            href="/admin/dashboard" 
                                                            onClick={() => setIsProfileOpen(false)}
                                                            className="flex items-center gap-3 p-3 rounded-xl text-primary bg-primary/5 hover:bg-primary/10 transition-all text-sm font-black border border-primary/10"
                                                        >
                                                            <Shield className="w-4 h-4" />
                                                            <span>{language === 'ar' ? 'لوحة تحكم الإدارة' : 'Admin Panel'}</span>
                                                        </Link>
                                                    )}
                                                    <div className="pt-1 mt-1 border-t border-gray-100 dark:border-white/5">
                                                        <button 
                                                            onClick={handleLogout}
                                                            className="w-full flex items-center gap-3 p-3 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all text-sm font-bold"
                                                        >
                                                            <LogOut className="w-4 h-4" />
                                                            <span>{language === 'ar' ? 'تسجيل الخروج' : 'Log Out'}</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </header>
                )}

                <main className="flex-grow pb-28 lg:pb-0 dark:text-white">
                    {children}
                </main>

                {(!isAuthPage && !isAdminPage && user) && (
                    <footer className="footer-section bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-white/5 pt-4 pb-16 hidden lg:block transition-all">
                        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-start">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-primary rounded-lg"></div>
                                    <span className="text-2xl font-black text-gray-900 dark:text-white">Captina</span>
                                </div>
                                <p className="text-gray-400 dark:text-gray-500 font-bold leading-relaxed">
                                    {t('discoverDesc')}
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-black text-gray-900 dark:text-white text-lg">{t('quickLinks')}</h4>
                                <ul className="space-y-2 text-gray-500 font-bold">
                                    <li><Link href="/" className="hover:text-primary transition-colors">{t('home')}</Link></li>
                                    <li><Link href="/packages" className="hover:text-primary transition-colors">{t('packages')}</Link></li>
                                    <li><Link href="/store" className="hover:text-primary transition-colors">{t('store')}</Link></li>
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-black text-gray-900 dark:text-white text-lg">{t('needHelp')}</h4>
                                <ul className="space-y-2 text-gray-500 font-bold">
                                    <li><Link href="/contact" className="hover:text-primary transition-colors">{t('contactUs')}</Link></li>
                                    <li><Link href="/help" className="hover:text-primary transition-colors">{t('faqText')}</Link></li>
                                    <li><Link href="/help" className="hover:text-primary transition-colors">{t('support')}</Link></li>
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-black text-gray-900 dark:text-white text-lg">{t('helpSectionTitle')}</h4>
                                <p className="text-gray-500 font-bold">0551447768</p>
                                <p className="text-gray-500 font-bold">support@captina.sa</p>
                            </div>
                        </div>
                    </footer>
                )}

                {(!isAuthPage && !isAdminPage && user) && pathname !== '/booking' && <MobileNav />}
                <GlobalModal />
                <CartDrawer />
            </body>
        </html>
    );
}

export default function RootLayout({ children }) {
    return (
        <AppProvider>
            <LayoutContent>
                {children}
            </LayoutContent>
        </AppProvider>
    );
}
