"use client";
import React, { useState, useEffect, useRef, Suspense } from 'react';
import "./globals.css";
import Navigation from "@/components/Navigation";
import MobileNav from "@/components/MobileNav";
import Link from 'next/link';
import { User, ShoppingBag, LayoutDashboard, Calendar, Search, Bell, Menu, MapPin, ChevronDown, X, Home, CreditCard, Users as TrainersIcon, Store, MousePointer2, LogOut, Lock, Settings, Shield, PlaySquare, Sparkles } from 'lucide-react';
import { AppProvider, useApp } from "@/context/AppContext";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, onSnapshot, collection, query, where } from "firebase/firestore";
import { motion, AnimatePresence } from 'framer-motion';
import GlobalModal from "@/components/GlobalModal";
import CartDrawer from "@/components/CartDrawer";
import PremiumLoader from "@/components/PremiumLoader";

function LayoutContent({ children }) {
    const { t, language, darkMode, setAlert, user, userData, loadingAuth, cartCount, setIsCartOpen, getLoc } = useApp();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isTrial = searchParams.get('trial') === 'true';
    const isAdminPage = pathname.startsWith('/admin');
    const isAdminLoginPage = pathname === '/admin/login';
    const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/intro' || pathname === '/forgot-password' || pathname.includes('/forgot-password');
    const [unreadCount, setUnreadCount] = useState(0);
    const [greeting, setGreeting] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [shouldAnimateCart, setShouldAnimateCart] = useState(false);
    const lastCartCount = useRef(cartCount);
    const router = useRouter();
    const menuRef = useRef(null);
    const profileRef = useRef(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMinimumLoading, setIsMinimumLoading] = useState(true);

    useEffect(() => {
        // 250ms is enough to prevent FOUC without blocking navigation
        const timer = setTimeout(() => setIsMinimumLoading(false), 250);
        return () => clearTimeout(timer);
    }, []);

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
            if (!hasSeenIntro && pathname !== '/intro' && !isAuthPage) {
                router.push('/intro');
            }
        }
    }, [pathname, router, isAuthPage]);

    // Route Guard
    useEffect(() => {
        if (!loadingAuth) {
            if (!user && !isAuthPage && !isAdminPage) {
                // Force login — no anonymous browsing
                router.push('/login');
            } else if (user && isAdminPage && !isAdminLoginPage && userData && userData.role !== 'admin') {
                router.push('/');
            } else if (user && userData && pathname !== '/profile') {
                // Profile completion gate: fullName + phone required before booking/purchasing
                const isProfileComplete = !!(
                    (userData.fullName && (typeof userData.fullName === 'string' ? userData.fullName.trim() : (userData.fullName?.ar || userData.fullName?.en))) &&
                    userData.phone
                );
                const profileGatedPaths = ['/booking', '/checkout', '/packages/', '/store/'];
                const needsCompletion = !isProfileComplete && profileGatedPaths.some(p => pathname.startsWith(p));
                if (needsCompletion) {
                    router.push('/profile?complete=true');
                }
            }
        }
    }, [user, loadingAuth, isAuthPage, isAdminPage, userData, router, pathname]);

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
        if (cartCount > lastCartCount.current) {
            setShouldAnimateCart(true);
            const timer = setTimeout(() => setShouldAnimateCart(false), 1000);
            return () => clearTimeout(timer);
        }
        lastCartCount.current = cartCount;
    }, [cartCount]);

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

    const displayName = getLoc(userData?.fullName) || user?.displayName || (language === 'ar' ? "ضيف" : "Guest");
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
                <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&family=Inter:wght@400;700;900&family=Outfit:wght@400;700;900&display=swap" rel="stylesheet" />
                {/* PWA */}
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#E51B24" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content="Captina" />
                <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
                <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
                <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512x512.png" />
            </head>
            <body className="antialiased flex flex-col min-h-screen bg-background dark:bg-background transition-colors duration-300">
                {(!isAuthPage && !isAdminPage && user) && (
                    <header className="sticky top-0 z-50 w-full bg-background/80 dark:bg-background/80 backdrop-blur-xl transition-all duration-300">
                        <div className="w-full px-4 md:px-10 h-14 md:h-20 flex items-center justify-between">
                            {/* Right Side - Dropdown & Greeting */}
                            <div ref={menuRef} className="flex items-center gap-4 relative">
                                {/* Toggle Button for Dropdown */}
                                <button 
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="p-2.5 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-premium hover:shadow-active transition-all group relative z-[60] lg:hidden"
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
                                                initial={{ opacity: 0, scale: 0.95, y: -10, x: language === 'ar' ? 10 : -10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: -10, x: language === 'ar' ? 10 : -10 }}
                                                className={`absolute top-[calc(100%+8px)] ${language === 'ar' ? 'right-0' : 'left-0'} w-56 bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-xl border border-gray-100 dark:border-white/10 p-2 z-[55] space-y-1 overflow-hidden`}
                                            >
                                                {[
                                                    { name: t('home'), href: '/', icon: Home },
                                                    { name: t('nav.trialSession'), href: '/booking?trial=true', icon: Sparkles },
                                                    { name: t('packages'), href: '/packages', icon: CreditCard },
                                                    { name: t('trainers'), href: '/trainers', icon: TrainersIcon },
                                                    { name: t('nav.store'), href: '/store', icon: Store },
                                                    { name: t('nav.library'), href: '/library', icon: PlaySquare },
                                                ].map((link, idx) => (
                                                    <Link
                                                        key={link.href}
                                                        href={link.href}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className={`flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all ${
                                                            (() => {
                                                                if (link.href === '/') return pathname === '/';
                                                                if (link.href.includes('trial=true')) return pathname === '/booking' && isTrial;
                                                                return pathname.startsWith(link.href.split('?')[0]);
                                                            })() 
                                                            ? 'bg-primary/10 text-primary' 
                                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                                                        }`}
                                                    >
                                                        <link.icon className="w-4 h-4" />
                                                        <span className="font-bold text-sm">{link.name}</span>
                                                    </Link>
                                                ))}
                                                
                                                <div className="pt-1 mt-1 border-t border-gray-50 dark:border-white/5 space-y-1">
                                                    <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-sm font-bold">
                                                        <User className="w-4 h-4" />
                                                        <span>{t('profile.title')}</span>
                                                    </Link>
                                                    {userData?.role === 'admin' && (
                                                        <Link href="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-primary bg-primary/5 hover:bg-primary/10 transition-all font-black text-sm border border-primary/10">
                                                            <Shield className="w-4 h-4" />
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
                                        <span className="text-sm md:text-lg">{language === 'ar' ? 'مرحباً' : 'Welcome'}</span>
                                        <span className="text-gray-300 dark:text-gray-700">/</span>
                                        <span className="text-[10px] md:text-sm opacity-90">{displayName}</span>
                                    </h2>
                                </div>
                            </div>

                            {/* Center Section (Desktop Navigation) */}
                            <div className="hidden lg:block">
                                <Navigation />
                            </div>

                            {/* Left Side - Notifications & Profile Dropdown */}
                            <div className="flex items-center gap-4">
                                <motion.div
                                    animate={shouldAnimateCart ? { 
                                        scale: [1, 1.25, 1],
                                    } : {}}
                                    transition={{ duration: 0.5, ease: "backOut" }}
                                >
                                    {/* Premium Glowing Effect Wrapper */}
                                    <div className="relative rounded-2xl group">
                                        <AnimatePresence mode="wait">
                                            {shouldAnimateCart && (
                                                <>
                                                    {/* Expansion Wave */}
                                                    <motion.div 
                                                        initial={{ scale: 0.8, opacity: 0 }}
                                                        animate={{ scale: [1, 2, 2.5], opacity: [0, 0.5, 0] }}
                                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                                        className="absolute inset-0 rounded-2xl bg-primary/40 blur-xl pointer-events-none z-0"
                                                    />
                                                    {/* Persistent Core Glow */}
                                                    <motion.div 
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                        className="absolute -inset-2 rounded-[2rem] bg-primary/20 blur-2xl pointer-events-none z-0"
                                                    />
                                                </>
                                            )}
                                        </AnimatePresence>

                                        <Link 
                                            href="/cart"
                                            className={`relative p-2.5 bg-white dark:bg-white/10 rounded-2xl border ${shouldAnimateCart ? 'border-primary ring-2 ring-primary/20 shadow-2xl shadow-primary/40' : 'border-gray-100 dark:border-white/10 shadow-sm'} hover:shadow-lg transition-all z-10 flex items-center justify-center overflow-visible group/cart`}
                                        >
                                            {/* Container for Shine Streak */}
                                            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                                                {shouldAnimateCart && (
                                                    <motion.div 
                                                        initial={{ x: "-150%", rotate: 25 }}
                                                        animate={{ x: "150%" }}
                                                        transition={{ duration: 0.7, ease: "easeInOut" }}
                                                        className="absolute inset-x-[-50%] inset-y-[-100%] bg-gradient-to-r from-transparent via-white/40 to-transparent z-10"
                                                    />
                                                )}
                                            </div>
                                            
                                            <ShoppingBag className={`w-5 h-5 transition-all duration-500 ${shouldAnimateCart ? 'text-primary scale-110' : 'text-gray-700 dark:text-gray-200 group-hover/cart:text-primary group-hover/cart:-translate-y-0.5'}`} />
                                            
                                            {cartCount > 0 && (
                                                <div className="absolute -top-3 -right-3 z-30 pointer-events-none">
                                                    <motion.div 
                                                        initial={{ scale: 0, rotate: -45 }}
                                                        animate={{ scale: 1, rotate: 0 }}
                                                        key={cartCount}
                                                        className="relative min-w-[22px] h-[22px] md:min-w-[26px] md:h-[26px] flex items-center justify-center p-1"
                                                    >
                                                        {/* High-End Glossy Badge */}
                                                        <span className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-rose-600 rounded-full shadow-[0_4px_15px_rgba(var(--primary-rgb),0.6)] border-[2.5px] border-white dark:border-[#0a0f1a]"></span>
                                                        
                                                        {/* Gloss Overlay */}
                                                        <span className="absolute inset-[2px] bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-full opacity-50"></span>
                                                        
                                                        <span className="relative text-[10px] md:text-[12px] font-[1000] text-white leading-none tracking-tighter drop-shadow-md">
                                                            {cartCount}
                                                        </span>

                                                        {/* Aura Pulse on update */}
                                                        {shouldAnimateCart && (
                                                            <motion.span 
                                                                initial={{ scale: 1, opacity: 1 }}
                                                                animate={{ scale: 3, opacity: 0 }}
                                                                transition={{ duration: 0.8 }}
                                                                className="absolute inset-0 bg-primary rounded-full blur-sm"
                                                            />
                                                        )}
                                                    </motion.div>
                                                </div>
                                            )}
                                        </Link>
                                    </div>
                                </motion.div>
                                
                                <Link href="/notifications" className="relative p-2.5 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-all group">
                                    <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-primary" />
                                    {unreadCount > 0 && (
                                        <div className="absolute -top-3 -right-3 z-30 pointer-events-none">
                                            <motion.div 
                                                initial={{ scale: 0, rotate: 45 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                key={unreadCount}
                                                className="relative min-w-[22px] h-[22px] md:min-w-[26px] md:h-[26px] flex items-center justify-center p-1"
                                            >
                                                {/* High-End Glossy Badge for Notifications */}
                                                <span className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-orange-500 rounded-full shadow-[0_4px_15px_rgba(var(--primary-rgb),0.6)] border-[2.5px] border-white dark:border-[#0a0f1a]"></span>
                                                <span className="relative text-[10px] md:text-[12px] font-[1000] text-white leading-none tracking-tighter drop-shadow-md">
                                                    {unreadCount}
                                                </span>
                                            </motion.div>
                                        </div>
                                    )}
                                </Link>
                                
                                <div ref={profileRef} className="relative">
                                    <button 
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className={`w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden border-2 shadow-premium transition-all flex items-center justify-center bg-white dark:bg-white/5 relative group ${isProfileOpen ? 'border-primary ring-4 ring-primary/20' : 'border-white dark:border-white/5 hover:border-primary/50'}`}
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
                                                className={`absolute top-[calc(100%+8px)] ${language === 'ar' ? 'left-0' : 'right-0'} w-56 bg-white dark:bg-[#1a2235] rounded-[1.5rem] shadow-xl border border-gray-100 dark:border-white/10 p-2 z-[60] overflow-hidden`}
                                            >
                                                {/* Header Info */}
                                                <div className="p-3 mb-1.5 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center gap-2.5 border border-gray-100 dark:border-white/5">
                                                    <div className="w-9 h-9 rounded-full overflow-hidden border border-primary/20 bg-primary/5 shadow-inner flex shrink-0 items-center justify-center">
                                                        {userData?.photoURL || user?.photoURL ? (
                                                            <img src={userData?.photoURL || user?.photoURL} alt="Dropdown Profile" className="w-full h-full aspect-square object-cover" />
                                                        ) : (
                                                            <User className="w-4 h-4 text-primary" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col text-start overflow-hidden">
                                                        <span className="text-sm font-black text-slate-900 dark:text-white truncate tracking-tight">{displayName}</span>
                                                        <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 truncate opacity-70">{user?.email}</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-0.5">
                                                    <Link 
                                                        href="/profile" 
                                                        onClick={() => setIsProfileOpen(false)}
                                                        className="flex items-center gap-3 py-2 px-3 rounded-xl text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all text-xs font-bold group"
                                                    >
                                                        <User className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                                                        <span>{language === 'ar' ? 'الصفحة الشخصية' : 'Personal Profile'}</span>
                                                    </Link>
                                                    <Link 
                                                        href="/settings" 
                                                        onClick={() => setIsProfileOpen(false)}
                                                        className="flex items-center gap-3 py-2 px-3 rounded-xl text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all text-xs font-bold group"
                                                    >
                                                        <Settings className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                                                        <span>{language === 'ar' ? 'الاعدادات' : 'Settings'}</span>
                                                    </Link>
                                                    <Link 
                                                        href="/settings/password" 
                                                        onClick={() => setIsProfileOpen(false)}
                                                        className="flex items-center gap-3 py-2 px-3 rounded-xl text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all text-xs font-bold group"
                                                    >
                                                        <Lock className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                                                        <span>{language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}</span>
                                                    </Link>
                                                    
                                                    {userData?.role === 'admin' && (
                                                        <div className="pt-1 mt-1 border-t border-gray-100 dark:border-white/5">
                                                            <Link 
                                                                href="/admin/dashboard" 
                                                                onClick={() => setIsProfileOpen(false)}
                                                                className="flex items-center gap-3 py-2 px-3 rounded-xl text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all text-xs font-black"
                                                            >
                                                                <Shield className="w-4 h-4" />
                                                                <span>{language === 'ar' ? 'لوحة تحكم الإدارة' : 'Admin Panel'}</span>
                                                            </Link>
                                                        </div>
                                                    )}
                                                    <div className="pt-1 mt-1 border-t border-gray-100 dark:border-white/5">
                                                        <button 
                                                            onClick={handleLogout}
                                                            className="w-full flex items-center gap-3 py-2 px-3 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all text-xs font-bold"
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
                    <AnimatePresence mode="wait">
                        {(loadingAuth || isMinimumLoading) && (
                            <motion.div
                                key="loader"
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                            >
                                <PremiumLoader darkMode={darkMode} language={language} minimal={true} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {(!loadingAuth && !isMinimumLoading) && (isAuthPage || isAdminPage || user) ? children : null}
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
            <Suspense>
                <LayoutContent>
                    {children}
                </LayoutContent>
            </Suspense>
        </AppProvider>
    );
}
