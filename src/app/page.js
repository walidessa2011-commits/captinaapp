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
                className="relative overflow-x-hidden bg-background min-h-screen"
            >
            {/* Background Decorative Blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
            
            <section className="container mx-auto px-4 pt-4 pb-1">
                {/* Search Bar - More Compact */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder={t('searchPlaceholder') || (language === 'ar' ? 'ابحث عن أي شيء...' : 'Search for everything...')}
                            className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
                        />
                    </div>
                    <button className="p-3 bg-gray-900 dark:bg-primary rounded-xl text-white shadow-lg active:scale-95 transition-all">
                        <Settings2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Categories - Smaller & Horizontal */}
                <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4">
                    {[
                        { name: t('all') || (language === 'ar' ? 'الكل' : 'All'), icon: '🔥', active: true },
                        { name: t('sports') || (language === 'ar' ? 'رياضات' : 'Sports'), icon: '⚽' },
                        { name: t('trainers') || (language === 'ar' ? 'مدربين' : 'Trainers'), icon: '💪' },
                        { name: t('store') || (language === 'ar' ? 'متجر' : 'Store'), icon: '🛍️' },
                        { name: t('offers') || (language === 'ar' ? 'عروض' : 'Offers'), icon: '🎁' }
                    ].map((cat, i) => (
                        <button 
                            key={i}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all border ${cat.active ? 'bg-white border-primary shadow-sm' : 'bg-gray-50 border-transparent text-gray-400'}`}
                        >
                            <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs">{cat.icon}</span>
                            <span className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded-full text-xs">{cat.icon}</span>
                            <span className={`text-[10px] font-black ${cat.active ? 'text-primary' : ''}`}>{cat.name}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Hero Section - Compacted for Mobile */}
            <section className="container mx-auto px-4 py-2">
                <div className="grid lg:grid-cols-2 gap-4 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-start space-y-3"
                    >
                        <h1 className="text-2xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight">
                            {t('heroTitle').split(' ').map((word, i) => (
                                i >= t('heroTitle').split(' ').length - 3 ? <span key={i} className="text-primary italic"> {word}</span> : word + ' '
                            ))}
                        </h1>
                        <p className="text-xs md:text-lg text-gray-500 dark:text-gray-400 font-bold max-w-lg leading-relaxed">
                            {t('heroSubtitle')}
                        </p>
                        <p className="text-sm text-gray-500 max-w-md">{t('heroDesc')}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="relative order-1 lg:order-2"
                    >
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-primary to-secondary rounded-[4rem] blur-2xl opacity-20 filter group-hover:opacity-30 transition duration-1000"></div>
                            <div className="relative rounded-2xl md:rounded-[4rem] overflow-hidden border-[4px] md:border-[16px] border-white dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-800">
                                <img
                                    src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop"
                                    alt="Personal Training Hero"
                                    className="w-full h-[220px] md:h-[650px] object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>

                            {/* Floating Cards */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                                className={`absolute ${language === 'en' ? '-left-8' : '-right-8'} top-1/4 glass-card dark:bg-slate-800/80 p-6 rounded-[2rem] flex items-center gap-4 animate-float`}
                            >
                                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div className="text-start">
                                    <p className="text-gray-400 text-xs font-bold">{t('muscleGrowth')}</p>
                                    <p className="text-xl font-black text-gray-900 dark:text-white">+42%</p>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 5 }}
                                className={`absolute ${language === 'en' ? '-right-12' : '-left-12'} bottom-1/4 glass-card dark:bg-slate-800/80 p-6 rounded-[2rem] flex flex-col items-center gap-2 animate-float`}
                            >
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />)}
                                </div>
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{t('bestRating')}</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Offers Carousel Section */}
            <section className="container mx-auto px-3 md:px-4 py-4 md:py-8">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h2 className="text-xl md:text-4xl font-black text-gray-900 dark:text-white">{t('strongestOffers')}</h2>
                    <Link href="/offers" className="text-primary font-black text-xs md:text-base hover:left-2 flex items-center gap-1 transition-all">
                         <ChevronLeft className={`w-3 h-3 md:w-5 md:h-5 ${language === 'en' ? 'rotate-180' : ''}`} /> {t('viewAll')}
                    </Link>
                </div>
                <div className="relative overflow-hidden rounded-2xl md:rounded-[3rem] bg-gray-900 h-40 md:h-72 flex items-center shadow-2xl">
                    <div className="relative w-full h-full">
                        {offers.map((offer, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: language === 'ar' ? 200 : -200 }}
                                animate={{ 
                                    opacity: currentOffer === index ? 1 : 0,
                                    x: currentOffer === index ? 0 : (language === 'ar' ? -200 : 200),
                                    pointerEvents: currentOffer === index ? 'auto' : 'none',
                                    scale: currentOffer === index ? 1 : 1.1
                                }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                className="absolute inset-0"
                            >
                                {/* Offer Background Image */}
                                <div className="absolute inset-0">
                                    <img 
                                        src={offerImages[index]} 
                                        alt={offer.title} 
                                        className="w-full h-full object-cover"
                                    />
                                    <div className={`absolute inset-0 bg-gradient-to-r ${language === 'en' ? 'from-black/80 via-black/40 to-transparent' : 'from-black/80 via-black/40 to-transparent rotate-180'}`}></div>
                                </div>

                                <div className="relative h-full flex items-center px-6 md:px-20 text-start">
                                    <div>
                                        <motion.span 
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: currentOffer === index ? 1 : 0, scale: 1 }}
                                            className="inline-block px-3 md:px-6 py-1 md:py-2 rounded-full bg-primary text-white text-[8px] md:text-sm font-black mb-2 md:mb-4 shadow-lg shadow-primary/30"
                                        >
                                            {offer.badge}
                                        </motion.span>
                                        <h2 className="text-lg md:text-5xl font-black text-white leading-tight drop-shadow-lg">{offer.title}</h2>
                                        <p className="text-[10px] md:text-2xl text-gray-200/90 font-bold mt-1 md:mt-3 drop-shadow-md">{offer.subtitle}</p>
                                        
                                        <motion.button 
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="mt-3 md:mt-8 px-5 md:px-10 py-1.5 md:py-3.5 rounded-full bg-white text-gray-900 font-black text-[10px] md:text-lg shadow-xl"
                                        >
                                            {t('claimOffer')}
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
                                className="group bg-white dark:bg-slate-800 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-white/5"
                            >
                                <div className="relative aspect-[4/5] overflow-hidden">
                                    <img 
                                        src={trainersImages[i]} 
                                        alt={trainer.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                            <Star className="w-3 h-3 fill-secondary text-secondary" />
                                            <span className="text-[10px] font-black text-gray-900 dark:text-white">4.8</span>
                                        </div>
                                    </div>
                                    <button className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all">
                                        <Users className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="p-5 text-start">
                                    <h3 className="text-sm md:text-lg font-black text-gray-900 dark:text-white mb-1 line-clamp-1">{trainer.name}</h3>
                                    <p className="text-[10px] md:text-sm font-bold text-gray-400 dark:text-gray-500 mb-3">{trainer.role}</p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-primary font-black text-sm md:text-base">$45<span className="text-[10px] text-gray-400 font-bold">/session</span></p>
                                        <Link href="/trainers" className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                            <ChevronLeft className={`w-4 h-4 ${language === 'en' ? 'rotate-180' : ''}`} />
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

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
                        {[
                            { title: t('eliteTrainers'), icon: <Users className="w-8 h-8" />, color: 'text-primary', delay: 0 },
                            { title: t('precisePlans'), icon: <Target className="w-8 h-8" />, color: 'text-secondary-dark', delay: 0.1 },
                            { title: t('genuineEquipment'), icon: <ShoppingBag className="w-8 h-8" />, color: 'text-emerald-500', delay: 0.2 },
                            { title: t('quickResults'), icon: <TrendingUp className="w-8 h-8" />, color: 'text-rose-500', delay: 0.3 }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -3 }}
                                className="bg-white dark:bg-slate-800 p-4 md:p-10 rounded-2xl md:rounded-[3rem] shadow-lg border border-gray-100 dark:border-white/5 text-start space-y-2 md:space-y-6 group transition-all"
                            >
                                <div className={`w-10 h-10 md:w-20 md:h-20 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center ${item.color} group-hover:bg-primary group-hover:text-white transition-all duration-500`}>
                                    <div className="scale-[0.6] md:scale-100">{item.icon}</div>
                                </div>
                                <h3 className="text-sm md:text-2xl font-black text-gray-900 dark:text-white">{item.title}</h3>
                                <p className="text-gray-400 dark:text-gray-500 text-[9px] md:text-base font-medium line-clamp-2 md:line-clamp-none leading-tight">
                                    {t('serviceDesc')}
                                </p>
                                <Link href="#" className="flex items-center gap-1 text-primary font-black text-[9px] md:text-base">
                                    {t('readMore')}
                                </Link>
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
