"use client";
import React, { useState, useEffect } from 'react';
import "./globals.css";
import Navigation from "@/components/Navigation";
import MobileNav from "@/components/MobileNav";
import Link from 'next/link';
import { User, ShoppingBag, LayoutDashboard, Calendar, Search, Bell, Menu, MapPin, ChevronDown, X, Home, CreditCard, Users as TrainersIcon, Store, MousePointer2 } from 'lucide-react';
import { AppProvider, useApp } from "@/context/AppContext";
import { usePathname } from 'next/navigation';
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, onSnapshot, collection, query, where } from "firebase/firestore";
import { motion, AnimatePresence } from 'framer-motion';

function LayoutContent({ children }) {
    const { t, language } = useApp();
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/register';
    const [user, loadingAuth] = useAuthState(auth);
    const [userData, setUserData] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    useEffect(() => {
        if (!user) {
            setUserData(null);
            return;
        }

        const docRef = doc(db, "users", user.uid);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setUserData(docSnap.data());
            } else {
                setUserData({ fullName: user.displayName, photoURL: user.photoURL });
            }
        }, (error) => {
            console.error("Error listening to user data:", error);
        });

        return () => unsubscribe();
    }, [user]);

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

    return (
        <body className="antialiased flex flex-col min-h-screen bg-background dark:bg-background transition-colors duration-300">
            {!isAuthPage && (
                <header className="sticky top-0 z-50 w-full bg-background/80 dark:bg-background/80 backdrop-blur-xl transition-all duration-300">
                    <div className="container mx-auto px-6 h-16 md:h-24 flex items-center justify-between">
                        {/* Right Side - Dropdown & Greeting */}
                        <div className="flex items-center gap-4">
                            {/* Toggle Button for Dropdown */}
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-3 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-premium hover:shadow-active transition-all group relative z-[60]"
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
                                            
                                            <div className="pt-2 mt-2 border-t border-gray-50 dark:border-white/5">
                                                <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-4 rounded-2xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                                                    <User className="w-5 h-5" />
                                                    <span className="font-bold">{t('profile')}</span>
                                                </Link>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>

                            <div className="flex flex-col text-start">
                                <p className="text-[10px] md:text-xs font-black text-gray-400 dark:text-gray-500 leading-none mb-1 uppercase tracking-wider">
                                    {getGreeting()}
                                </p>
                                <h2 className="font-black text-gray-900 dark:text-white leading-tight capitalize flex items-center gap-1">
                                    <span className="text-lg md:text-2xl">{language === 'ar' ? 'مرحباً' : 'Welcome'}</span>
                                    <span className="text-gray-300 dark:text-gray-700">/</span>
                                    <span className="text-sm md:text-lg opacity-90">{displayName}</span>
                                </h2>
                            </div>
                        </div>

                        {/* Center Section (Desktop Navigation) */}
                        <div className="hidden xl:block">
                            <Navigation />
                        </div>

                        {/* Left Side - Notifications & Profile */}
                        <div className="flex items-center gap-4">
                            <Link href="/notifications" className="relative p-3 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-all group">
                                <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-primary" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-3 right-3 w-2 h-2 bg-primary border border-white dark:border-slate-900 rounded-full"></span>
                                )}
                            </Link>
                            
                            <Link href="/profile" className="w-11 h-11 md:w-14 md:h-14 rounded-2xl overflow-hidden border-2 border-white dark:border-white/5 shadow-premium hover:border-primary transition-all flex items-center justify-center bg-gray-50 dark:bg-white/5">
                                {userData?.photoURL || user?.photoURL ? (
                                    <img src={userData?.photoURL || user?.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-primary flex items-center justify-center text-white">
                                        <User className="w-6 h-6 md:w-8 md:h-8" />
                                    </div>
                                )}
                            </Link>
                        </div>
                    </div>
                </header>
            )}

            <main className="flex-grow pb-28 md:pb-0 dark:text-white">
                {children}
            </main>

            {!isAuthPage && (
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

            {!isAuthPage && pathname !== '/booking' && <MobileNav />}
        </body>
    );
}

export default function RootLayout({ children }) {
    return (
        <html lang="ar" dir="rtl">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
            </head>
            <AppProvider>
                <LayoutContent>
                    {children}
                </LayoutContent>
            </AppProvider>
        </html>
    );
}
