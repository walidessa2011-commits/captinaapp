"use client";
import { motion } from "framer-motion";
import Link from 'next/link';
import { Target, TrendingUp, Users, ShoppingBag, ArrowLeft, Star, ChevronRight, Gift, Percent, Utensils, Truck, Bell, ChevronLeft, Search, Settings2 } from 'lucide-react';
import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import Splash from "@/components/Splash";
import { useApp } from "@/context/AppContext";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Home() {
    const { t, language, darkMode } = useApp();
    const [user, loadingAuth] = useAuthState(auth);
    const router = useRouter();
    const [showSplash, setShowSplash] = useState(true);
    const [currentOffer, setCurrentOffer] = useState(0);

    const offers = t('offersData');
    const trainersData = t('trainersData');
    const offerImages = [
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1541534741688-6078c64ec4a9?q=80&w=1000&auto=format&fit=crop"
    ];

    const trainersImages = [
        'https://images.unsplash.com/photo-1548690312-e3b507d17a47?q=80&w=200',
        'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=200',
        'https://images.unsplash.com/photo-1517438476312-10d79c077509?q=80&w=200',
        'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=200'
    ];

    useEffect(() => {
        const hasShownSplash = sessionStorage.getItem('hasShownSplash');
        
        if (loadingAuth) return;

        if (hasShownSplash) {
            setShowSplash(false);
        }

        if (!showSplash) {
            sessionStorage.setItem('hasShownSplash', 'true');
            // Second guard: if splash is gone and still no user, redirect
            if (!user) {
                router.push('/login');
                return;
            }
            const timer = setInterval(() => {
                setCurrentOffer((prev) => (prev + 1) % offers.length);
            }, 3000);
            return () => clearInterval(timer);
        }
    }, [showSplash, offers.length, loadingAuth, user, router]);

    return (
        <>
            {showSplash && (
                <Splash 
                    onComplete={() => {
                        // After splash, if we are definitely not logged in, go to login
                        if (!loadingAuth && !user) {
                            router.push('/login');
                        } else {
                            // If still loading or user exists, show the home page
                            setShowSplash(false);
                        }
                    }} 
                />
            )}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: showSplash ? 0 : 1 }}
                transition={{ duration: 1 }}
                className="relative overflow-x-hidden bg-[#0a0f1a] min-h-screen pb-40"
            >
            {/* Background Decorative Blobs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2"></div>
            
            <section className="container mx-auto px-4 pt-4 pb-2">
                {/* Single-Line Compact Header */}
                <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-3 mb-4">
                    <div className="flex flex-col text-start">
                        <h1 className="text-base md:text-lg font-black text-white tracking-tighter flex items-center gap-2">
                            <span className="opacity-50 text-[10px] font-bold uppercase tracking-widest">{t('main') || 'الرئيسية'}</span>
                            <span className="w-1 h-1 rounded-full bg-white/20"></span>
                            <span className="text-primary">{language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</span>
                        </h1>
                        <p className="text-gray-500 text-[8px] font-bold uppercase tracking-wider">
                            {language === 'ar' ? 'مرحباً بعودتك يا بطل' : 'Welcome back, Champ!'}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative group">
                            <Search className={`absolute ${language === 'en' ? 'left-2.5' : 'right-2.5'} top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500`} />
                            <input 
                                type="text" 
                                placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                                className="w-24 md:w-40 bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 ps-8 text-[9px] font-bold text-white outline-none focus:border-primary/50 transition-all shadow-sm"
                            />
                        </div>
                        <button className="p-2 bg-primary/10 border border-primary/20 rounded-lg text-primary shadow-lg hover:bg-primary hover:text-white transition-all">
                            <Settings2 className="w-3 h-3" />
                        </button>
                        <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 relative">
                            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full border border-[#0a0f1a]"></div>
                            <Bell className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* Categories - Ultra Compact Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-2 px-2">
                    {[
                        { name: t('all') || (language === 'ar' ? 'الكل' : 'All'), icon: '🔥', active: true, color: 'bg-orange-500' },
                        { name: t('sports') || (language === 'ar' ? 'رياضات' : 'Sports'), icon: '⚽', color: 'bg-blue-500' },
                        { name: t('trainers') || (language === 'ar' ? 'مدربين' : 'Trainers'), icon: '💪', color: 'bg-emerald-500' },
                        { name: t('store') || (language === 'ar' ? 'متجر' : 'Store'), icon: '🛍️', color: 'bg-purple-500' },
                        { name: t('offers') || (language === 'ar' ? 'عروض' : 'Offers'), icon: '🎁', color: 'bg-rose-500' }
                    ].map((cat, i) => (
                        <button 
                            key={i}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all border ${cat.active ? 'bg-primary/10 border-primary text-primary shadow-sm shadow-primary/20' : 'bg-white/5 border-white/5 text-gray-400 opacity-80'}`}
                        >
                            <span className="text-[10px]">{cat.icon}</span>
                            <span className="text-[8px] font-black tracking-widest uppercase">{cat.name}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Dashboard Section - High Density */}
            <section className="container mx-auto px-4 py-4">
                <div className="flex flex-col gap-4">
                    {/* Tabs - Mini Style */}
                    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl w-fit">
                        {['Daily', 'Weekly', 'Monthly'].map((tab, i) => (
                            <button 
                                key={tab}
                                className={`px-4 py-1.5 rounded-lg text-[8px] font-black tracking-widest uppercase transition-all ${i === 0 ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                {language === 'ar' ? (i === 0 ? 'يومي' : i === 1 ? 'أسبوعي' : 'شهري') : tab}
                            </button>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-2 gap-4">
                        {/* My Tasks Column */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between px-1">
                                <h2 className="text-sm font-black text-white tracking-widest uppercase">{language === 'ar' ? 'مهامي القادمة' : 'Upcoming Tasks'}</h2>
                                <button className="w-6 h-6 bg-primary/20 text-primary rounded-lg flex items-center justify-center font-black transition-all hover:bg-primary hover:text-white text-xs">+</button>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { title: language === 'ar' ? 'تمارين الكارديو الصباحية' : 'Morning Cardio Session', time: '08:00 AM - 09:00 AM', icon: '🏃‍♂️', color: 'bg-primary/20 text-primary' },
                                    { title: language === 'ar' ? 'وجبة غداء غنية بالبروتين' : 'High Protein Lunch', time: '01:00 PM - 02:00 PM', icon: '🥗', color: 'bg-blue-100/50 text-blue-600' },
                                    { title: language === 'ar' ? 'تدريب القوة - الأرجل' : 'Strength Training - Legs', time: '05:00 PM - 06:30 PM', icon: '💪', color: 'bg-orange-100/50 text-orange-600' }
                                ].map((task, i) => (
                                    <motion.div 
                                        key={i}
                                        whileHover={{ scale: 1.01, x: language === 'ar' ? -3 : 3 }}
                                        className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-premium border border-gray-100 dark:border-white/5 flex items-center gap-4 group cursor-pointer transition-all"
                                    >
                                        <div className={`w-10 h-10 ${task.color} dark:bg-white/10 rounded-xl flex items-center justify-center text-lg shadow-sm group-hover:rotate-12 transition-transform`}>
                                            {task.icon}
                                        </div>
                                        <div className="flex-1 text-start">
                                            <h3 className="font-black text-xs text-gray-900 dark:text-white group-hover:text-primary transition-colors">{task.title}</h3>
                                            <p className="text-[9px] font-bold text-gray-400 mt-0.5">{task.time}</p>
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                            <ChevronRight className={`w-3 h-3 ${language === 'ar' ? 'rotate-180' : ''}`} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Completed & Stats Column */}
                        <div className="space-y-4">
                            <h2 className="text-lg md:text-xl font-black text-gray-900 dark:text-white text-start px-2 tracking-tight">{language === 'ar' ? 'المهام المكتملة' : 'Completed Tasks'}</h2>
                            
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { title: language === 'ar' ? 'تأمل الصباح' : 'Morning Meditation', time: '07:00 AM', icon: '🧘‍♀️' },
                                    { title: language === 'ar' ? 'شرب 2 لتر ماء' : 'Drink 2L Water', time: '02:00 PM', icon: '💧' }
                                ].map((task, i) => (
                                    <div 
                                        key={i}
                                        className="bg-gray-50/50 dark:bg-white/5 p-3 rounded-2xl border border-dashed border-gray-300 dark:border-white/10 flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity"
                                    >
                                        <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-[10px] shadow-lg shadow-emerald-500/20">
                                            ✓
                                        </div>
                                        <div className="flex-1 text-start overflow-hidden">
                                            <h3 className="font-bold text-[9px] text-gray-900 dark:text-white line-through opacity-60 truncate">{task.title}</h3>
                                            <p className="text-[8px] font-black text-emerald-500">{language === 'ar' ? 'مكتمل' : 'Done'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Weekly Progress Card - Premium Style */}
                            <div className="bg-slate-900 dark:bg-primary p-6 rounded-[2rem] shadow-2xl text-white text-start relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 transition-transform duration-1000 group-hover:scale-125"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2"></div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center">
                                            <TrendingUp className="w-4 h-4" />
                                        </div>
                                        <p className="text-[8px] font-black tracking-widest uppercase opacity-60">{language === 'ar' ? 'تقدمك الأسبوعي' : 'Weekly Progress'}</p>
                                    </div>
                                    <h3 className="text-2xl font-black mb-4 flex items-baseline gap-1.5">85% <span className="text-[10px] font-bold opacity-60">{language === 'ar' ? 'مكتمل' : 'Completed'}</span></h3>
                                    
                                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-4">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            whileInView={{ width: '85%' }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="bg-white h-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                                        ></motion.div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <p className="text-[9px] font-bold leading-relaxed max-w-[150px]">{language === 'ar' ? 'أداء رائع! بقي 3 مهام لهذا اليوم.' : 'Great job! You have 3 tasks left for today.'}</p>
                                        <button className="px-4 py-2 bg-white text-slate-900 rounded-xl text-[9px] font-black shadow-xl hover:scale-105 transition-all">{language === 'ar' ? 'التفاصيل' : 'Details'}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Offers Carousel Section */}
            <section className="container mx-auto px-4 py-4 md:py-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg md:text-2xl font-black text-gray-900 dark:text-white">{t('strongestOffers')}</h2>
                    <Link href="/offers" className="text-primary font-black text-[10px] md:text-xs hover:gap-1.5 flex items-center gap-1 transition-all">
                         <ChevronLeft className={`w-3.5 h-3.5 ${language === 'en' ? 'rotate-180' : ''}`} /> {t('viewAll')}
                    </Link>
                </div>
                <div className="relative overflow-hidden rounded-[2rem] bg-gray-900 h-44 md:h-72 flex items-center shadow-2xl group">
                    <div className="relative w-full h-full">
                        {offers.map((offer, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ 
                                    opacity: currentOffer === index ? 1 : 0,
                                    scale: currentOffer === index ? 1 : 1.1,
                                    pointerEvents: currentOffer === index ? 'auto' : 'none'
                                }}
                                transition={{ duration: 0.8, ease: "circOut" }}
                                className="absolute inset-0"
                            >
                                {/* Offer Background Image */}
                                <div className="absolute inset-0">
                                    <img 
                                        src={offerImages[index]} 
                                        alt={offer.title} 
                                        className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
                                    />
                                    <div className={`absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent`}></div>
                                </div>

                                <div className="relative h-full flex items-center px-6 md:px-16 text-start">
                                    <div className="max-w-xl">
                                        <motion.div 
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: currentOffer === index ? 1 : 0, y: currentOffer === index ? 0 : 15 }}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/20 backdrop-blur-xl border border-primary/30 text-primary-light text-[8px] md:text-xs font-black mb-2 shadow-xl"
                                        >
                                            <Gift className="w-3 h-3" />
                                            {offer.badge}
                                        </motion.div>
                                        <h2 className="text-xl md:text-5xl font-black text-white leading-tight mb-1 drop-shadow-2xl">{offer.title}</h2>
                                        <p className="text-xs md:text-xl text-gray-300 font-bold mb-6 opacity-80">{offer.subtitle}</p>
                                        
                                        <motion.button 
                                            whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0,0,0,0.3)" }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-6 md:px-10 py-2.5 md:py-4 rounded-xl bg-white text-slate-900 font-black text-[9px] md:text-base shadow-2xl flex items-center gap-2 group/btn"
                                        >
                                            {t('claimOffer')}
                                            <ArrowLeft className={`w-4 h-4 transition-transform group-hover/btn:translate-x-[-3px] ${language === 'en' ? 'rotate-180 group-hover/btn:translate-x-[3px]' : ''}`} />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Progress Dots */}
                    <div className="absolute bottom-3 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-3 z-20">
                        {offers.map((_, i) => (
                            <div 
                                key={i}
                                className={`h-1 md:h-2 transition-all duration-500 rounded-full ${currentOffer === i ? 'w-6 md:w-12 bg-white' : 'w-1.5 md:w-3 bg-white/30'}`}
                            ></div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Top Trainers Section */}
            <section className="py-6 md:py-16">
                <div className="container mx-auto px-3">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl md:text-4xl font-black text-gray-900 dark:text-white">{t('trainers')}</h2>
                        <Link href="/trainers" className="text-primary font-black text-xs md:text-base hover:left-2 flex items-center gap-1 transition-all">
                            <ChevronLeft className={`w-3 h-3 md:w-5 md:h-5 ${language === 'en' ? 'rotate-180' : ''}`} /> {t('viewAll')}
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {trainersData.map((trainer, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group bg-white dark:bg-slate-800 rounded-[3rem] overflow-hidden shadow-premium hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-white/5"
                            >
                                <div className="relative aspect-[3/4] overflow-hidden">
                                    <img 
                                        src={trainersImages[i]} 
                                        alt={trainer.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                    />
                                    <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
                                        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl px-4 py-2 rounded-2xl flex items-center gap-1.5 shadow-xl border border-white/20">
                                            <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
                                            <span className="text-[11px] font-black text-gray-900 dark:text-white">4.8</span>
                                        </div>
                                        <button className="w-10 h-10 bg-white/40 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white transition-all hover:bg-primary hover:border-primary">
                                            <Users className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-60"></div>
                                </div>
                                <div className="p-6 text-start">
                                    <h3 className="text-base md:text-xl font-black text-gray-900 dark:text-white mb-1 line-clamp-1">{trainer.name}</h3>
                                    <p className="text-[11px] md:text-sm font-bold text-gray-400 dark:text-gray-500 mb-5">{trainer.role}</p>
                                    <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 p-3 rounded-2xl border border-gray-100 dark:border-white/10">
                                        <p className="text-primary font-black text-base md:text-lg">$45<span className="text-[10px] text-gray-400 font-bold ml-1">/session</span></p>
                                        <Link href="/trainers" className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-110 transition-all">
                                            <ChevronLeft className={`w-5 h-5 ${language === 'en' ? 'rotate-180' : ''}`} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Services */}
            <section className="py-6 md:py-24 bg-primary/5 dark:bg-white/5">
                <div className="container mx-auto px-3">
                    <div className="text-center mb-6 md:mb-16 space-y-1 md:space-y-4">
                        <h2 className="text-2xl md:text-5xl font-black text-gray-900 dark:text-white">{t('exceptionalServices')}</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-xs md:text-base font-bold max-w-xl mx-auto">{t('exceptionalServicesDesc')}</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {[
                            { title: t('eliteTrainers'), icon: <Users className="w-10 h-10" />, color: 'from-blue-500 to-indigo-600', delay: 0 },
                            { title: t('precisePlans'), icon: <Target className="w-10 h-10" />, color: 'from-primary to-orange-600', delay: 0.1 },
                            { title: t('genuineEquipment'), icon: <ShoppingBag className="w-10 h-10" />, color: 'from-emerald-500 to-teal-600', delay: 0.2 },
                            { title: t('quickResults'), icon: <TrendingUp className="w-10 h-10" />, color: 'from-rose-500 to-red-600', delay: 0.3 }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10, rotate: 1 }}
                                className="bg-white dark:bg-slate-800 p-6 md:p-12 rounded-[3.5rem] shadow-premium hover:shadow-2xl border border-gray-100 dark:border-white/5 text-start space-y-4 md:space-y-8 group transition-all relative overflow-hidden"
                            >
                                <div className={`w-14 h-14 md:w-24 md:h-24 rounded-[2rem] bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-xl shadow-gray-200 dark:shadow-none transition-all duration-500 group-hover:scale-110`}>
                                    <div className="scale-[0.7] md:scale-100">{item.icon}</div>
                                </div>
                                <div className="space-y-2 md:space-y-4">
                                    <h3 className="text-base md:text-3xl font-black text-gray-900 dark:text-white leading-tight">{item.title}</h3>
                                    <p className="text-gray-400 dark:text-gray-500 text-[10px] md:text-lg font-bold line-clamp-3 leading-relaxed">
                                        {t('serviceDesc')}
                                    </p>
                                </div>
                                <Link href="#" className="inline-flex items-center gap-2 text-primary font-black text-[10px] md:text-xl group-hover:gap-4 transition-all">
                                    {t('readMore')}
                                    <ArrowLeft className={`w-4 h-4 md:w-6 md:h-6 ${language === 'en' ? 'rotate-180' : ''}`} />
                                </Link>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 dark:bg-white/5 rounded-full -translate-y-16 translate-x-16 -z-10 transition-transform group-hover:scale-150"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            {/* Our Sports Section */}
            <section className="pt-12 md:pt-24 pb-0">
                <div className="container mx-auto px-3">
                    <div className="flex items-center justify-between mb-8 md:mb-16">
                        <div className="text-start">
                            <h2 className="text-2xl md:text-5xl font-black text-gray-900 dark:text-white mb-2 md:mb-4">{t('sports')}</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-xs md:text-xl font-bold max-w-2xl leading-relaxed">{t('sportsPageSub')}</p>
                        </div>
                        <Link href="/sports" className="text-primary font-black text-xs md:text-base hover:gap-3 flex items-center gap-2 transition-all">
                            {t('viewAll')} <ChevronLeft className={`w-3 h-3 md:w-5 md:h-5 ${language === 'en' ? 'rotate-180' : ''}`} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {t('pageSportsData').map((sport, i) => (
                            <motion.div
                                key={sport.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="group relative h-[300px] md:h-[450px] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl bg-slate-900"
                            >
                                <img 
                                    src={
                                        sport.id === 'boxing' ? 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=600' :
                                        sport.id === 'karate' ? 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=600' :
                                        sport.id === 'crossfit' ? 'https://images.unsplash.com/photo-1534367507873-d2d7e249a3fe?q=80&w=600' :
                                        'https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?q=80&w=600'
                                    } 
                                    alt={sport.name}
                                    className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                                
                                <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end text-start">
                                    <h3 className="text-xl md:text-3xl font-black text-white mb-2 md:mb-4">{sport.name}</h3>
                                    <p className="text-gray-300 text-[10px] md:text-sm font-bold mb-4 md:mb-6 line-clamp-2 md:line-clamp-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        {sport.description}
                                    </p>
                                    <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                                        <div className="px-3 py-1 md:px-4 md:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[8px] md:text-xs font-black">
                                            {sport.stats.duration}
                                        </div>
                                        <div className="px-3 py-1 md:px-4 md:py-2 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-light text-[8px] md:text-xs font-black">
                                            {sport.stats.intensity}
                                        </div>
                                    </div>
                                </div>

                                <motion.div 
                                    className="absolute top-6 right-6 w-10 h-10 md:w-16 md:h-16 rounded-2xl bg-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 shadow-xl shadow-primary/40"
                                >
                                    <ChevronLeft className={`w-5 h-5 md:w-8 md:h-8 ${language === 'en' ? 'rotate-180' : ''}`} />
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </motion.div>
        </>
    );
}
