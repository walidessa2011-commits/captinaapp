"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import {
    Target, TrendingUp, Users, ShoppingBag,
    ArrowLeft, Star, ChevronRight, Gift,
    Bell, ChevronLeft, Search, Settings2,
    Activity, Dumbbell, UserCheck, Flame, Sparkles, GraduationCap, PlaySquare, Heart, Clock, Check
} from 'lucide-react';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useApp } from "@/context/AppContext";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { trainersData } from "@/lib/trainersData";

export default function Home() {
    const {
        t, language, darkMode, userData,
        favoriteSports,
        toggleFavoriteSport,
        favoriteTrainers,
        toggleFavoriteTrainer,
        offers,
        sports,
        trainers,
        products,
        gyms,
        tasks,
        goals,
        addToCart,
        setIsCartOpen,
        activeSubscription
    } = useApp();

    const [showAllGoals, setShowAllGoals] = useState(false);
    const userSport = activeSubscription?.sportName || 'general';
    const filteredGoals = goals.filter(g => g.sport === userSport || g.sport === 'general');

    const getText = (field) => {
        if (!field) return '';
        if (typeof field === 'object') {
            return field[language] || field['ar'] || field['en'] || '';
        }
        return field;
    };

    const [user, loadingAuth] = useAuthState(auth);
    const router = useRouter();
    const [currentOffer, setCurrentOffer] = useState(0);
    const [currentPackage, setCurrentPackage] = useState(0);
    const [billingCycle, setBillingCycle] = useState('monthly');

    useEffect(() => {
        // Data is now handled globally in AppContext with real-time listeners
    }, []);

    // Using dynamic data from useApp() instead of static translation data
    const hasOffers = Array.isArray(offers) && offers.length > 0;
    const hasSports = Array.isArray(sports) && sports.length > 0;
    const hasTrainers = Array.isArray(trainers) && trainers.length > 0;
    const hasProducts = Array.isArray(products) && products.length > 0;

    const offerImages = []; // Will use offer.image if available

    const sportsImages = {}; // Removed hardcoded images, will use sport.image
    const trainersImages = []; // Removed hardcoded images, will use trainer.image

    useEffect(() => {
        if (hasOffers) {
            const timer = setInterval(() => {
                setCurrentOffer((prev) => (prev + 1) % offers.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [hasOffers, offers.length]);

    const packages = t('packagesData') || [];
    useEffect(() => {
        if (packages.length > 0) {
            const timer = setInterval(() => {
                setCurrentPackage((prev) => (prev + 1) % packages.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [packages.length]);

    const bgClass = darkMode ? "bg-[#0a0f1a]" : "bg-slate-50";
    const textClass = darkMode ? "text-white" : "text-gray-900";
    const cardBg = darkMode ? "bg-white/5 border-white/5" : "bg-white border-gray-100";

    return (
        <div className={`min-h-screen ${bgClass} transition-colors duration-500 pb-32`}>
            {/* Background Decorative Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 ${darkMode ? 'opacity-40' : 'opacity-20'} animate-pulse`}></div>
                <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] ${darkMode ? 'bg-blue-500/10' : 'bg-blue-500/5'} rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2`}></div>
            </div>
            
            <section className="container mx-auto px-4 pt-4 pb-1 relative z-10">
                {/* Header */}
                <div className={`flex items-center justify-between gap-3 border-b ${darkMode ? 'border-white/5' : 'border-gray-200'} pb-4 mb-6`}>
                    <div className="flex flex-col text-start">
                        <h1 className={`text-lg md:text-2xl font-black ${textClass} tracking-tighter flex items-center gap-2`}>
                            <span className="opacity-50 text-[10px] font-bold uppercase tracking-widest">{t('home')}</span>
                            <span className={`w-1 h-1 rounded-full ${darkMode ? 'bg-white/20' : 'bg-gray-300'}`}></span>
                            <span className="text-primary">{language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</span>
                        </h1>
                        <p className="text-gray-500 text-[9px] font-bold uppercase tracking-wider">
                            {language === 'ar' ? 'مرحباً بعودتك يا بطل' : 'Welcome back, Champ!'}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className={`p-2.5 ${darkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-200 text-gray-600'} border rounded-xl relative`}>
                            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                            <Bell className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Quick Stats Banner */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {[
                        { label: language === 'ar' ? 'السعرات' : 'Calories', val: userData?.calories?.toLocaleString() || '0', icon: <Flame className="w-4 h-4 text-orange-500" />, sub: 'kcal' },
                        { label: language === 'ar' ? 'التمارين' : 'Workouts', val: userData?.workoutsCount || '0', icon: <Activity className="w-4 h-4 text-primary" />, sub: 'sessions' },
                        { label: language === 'ar' ? 'الوزن' : 'Weight', val: userData?.weight || '0', icon: <TrendingUp className="w-4 h-4 text-emerald-500" />, sub: 'kg' },
                        { label: language === 'ar' ? 'المدربين' : 'Coaches', val: userData?.activeCoaches || '0', icon: <Users className="w-4 h-4 text-blue-500" />, sub: 'active' },
                    ].map((stat, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`${cardBg} p-4 rounded-2xl border flex flex-col items-start text-start gap-1 shadow-sm hover:shadow-md transition-all group cursor-pointer`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-white/5 group-hover:scale-110 transition-transform">
                                    {stat.icon}
                                </div>
                                <span className="text-[8px] font-black uppercase text-gray-500 tracking-widest">{stat.label}</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className={`text-sm font-black ${textClass}`}>{stat.val}</span>
                                <span className="text-[7px] font-bold text-gray-400 uppercase">{stat.sub}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Personalized Goals Card - Minimized Horizontal View - Only for Subscribed Users */}
            {activeSubscription && filteredGoals.length > 0 && (
                <section className="container mx-auto px-4 mb-8">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            <h2 className={`text-sm font-black uppercase tracking-widest ${textClass}`}>
                                {language === 'ar' ? 'أهدافك الرياضية' : 'Your Training Goals'}
                            </h2>
                        </div>
                        {filteredGoals.length > 1 && (
                            <button 
                                onClick={() => setShowAllGoals(!showAllGoals)}
                                className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                            >
                                {showAllGoals 
                                    ? (language === 'ar' ? 'عرض أقل' : 'See Less') 
                                    : (language === 'ar' ? 'عرض الكل' : 'See More')}
                            </button>
                        )}
                    </div>
                    
                    <div className={`flex ${showAllGoals ? 'flex-col gap-3' : 'gap-3 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory scroll-smooth -mx-2 px-2'}`}>
                        {(showAllGoals ? filteredGoals : filteredGoals.slice(0, 4)).map((goal, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ y: -2 }}
                                className={`flex-shrink-0 ${showAllGoals ? 'w-full' : 'w-[140px] md:w-[160px]'} snap-start ${cardBg} p-2.5 rounded-2xl border shadow-sm border-gray-100 dark:border-white/5 flex items-center gap-2`}
                            >
                                <div className="relative w-8 h-8 shrink-0">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="16" cy="16" r="14" fill="transparent" stroke="currentColor" strokeWidth="2.5" className={darkMode ? 'text-white/5' : 'text-gray-100'} />
                                        <motion.circle 
                                            cx="16" cy="16" r="14" fill="transparent" stroke="currentColor" strokeWidth="2.5" strokeDasharray={88} 
                                            initial={{ strokeDashoffset: 88 }}
                                            animate={{ strokeDashoffset: 88 * (1 - goal.percentage / 100) }}
                                            className="text-primary"
                                        />
                                    </svg>
                                    <span className={`absolute inset-0 flex items-center justify-center text-[7.5px] font-black ${textClass}`}>
                                        {goal.percentage}%
                                    </span>
                                </div>
                                <div className="text-start flex-1 min-w-0">
                                    <h3 className={`text-[8px] font-black ${textClass} mb-0.5 truncate uppercase tracking-tighter`}>{goal.text}</h3>
                                    <p className="text-[7px] font-bold text-gray-500 leading-tight line-clamp-1">{goal.sub}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            <main className="container mx-auto px-4 space-y-3 relative z-10 w-full overflow-hidden">
                {/* Offers Banner (Carousel-like) - MOVED UP */}
                {hasOffers && (
                    <section>
                        <div 
                            className="relative h-48 md:h-[280px] rounded-[2rem] overflow-hidden bg-slate-900 shadow-xl group cursor-pointer"
                            onClick={() => router.push(`/offers/${offers[currentOffer].id}`)}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div 
                                    key={currentOffer}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="absolute inset-0"
                                >
                                    <img src={offers[currentOffer].image || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000"} alt="" className="w-full h-full object-cover opacity-50 scale-100 group-hover:scale-105 transition-transform duration-1000" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent p-10 md:p-20 flex flex-col justify-center text-start">
                                        <motion.span 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-primary text-white text-[9px] font-black px-4 py-1.5 rounded-full w-fit mb-4 uppercase tracking-[0.2em] shadow-lg shadow-primary/30"
                                        >
                                            {offers[currentOffer].badge}
                                        </motion.span>
                                        <motion.h2 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="text-lg md:text-2xl lg:text-3xl font-black text-white mb-2 tracking-tighter italic"
                                        >
                                            {offers[currentOffer].title}
                                        </motion.h2>
                                        <motion.p 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="text-[9px] md:text-xs text-white/70 font-bold mb-4 max-w-lg leading-relaxed line-clamp-2"
                                        >
                                            {offers[currentOffer].subtitle}
                                        </motion.p>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); router.push(`/offers/${offers[currentOffer].id}`); }}
                                            className="bg-white text-slate-900 px-10 py-3.5 rounded-2xl text-[10px] md:text-xs font-black w-fit transition-all shadow-xl hover:scale-105 active:scale-95 uppercase tracking-widest flex items-center gap-3"
                                        >
                                            {t('claimOffer')}
                                            <Sparkles className="w-4 h-4 text-primary" />
                                        </button>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Dots navigation */}
                            <div className="absolute bottom-8 right-10 flex gap-2">
                                {offers.map((_, i) => (
                                    <button 
                                        key={i} 
                                        onClick={(e) => { e.stopPropagation(); setCurrentOffer(i); }}
                                        className={`h-1.5 rounded-full transition-all duration-500 z-10 ${currentOffer === i ? 'w-10 bg-primary shadow-lg shadow-primary/50' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Sports Grid */}
                {hasSports && (
                    <section>
                        <div className="flex items-center justify-between mb-2 px-1">
                            <div className="text-start">
                                <h2 className={`text-base md:text-xl font-black ${textClass} tracking-tight`}>{t('sports')}</h2>
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">{language === 'ar' ? 'اختر تحديك القادم' : 'Choose your next challenge'}</p>
                            </div>
                            <Link href="/sports" className="text-primary font-black text-xs flex items-center gap-1 group">
                                {t('viewAll')} 
                                <ChevronLeft className={`w-4 h-4 transition-transform group-hover:-translate-x-1 ${language === 'en' ? 'rotate-180' : ''}`} />
                            </Link>
                        </div>
                        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {sports.map((sport, i) => {
                                const displayName = getText(sport.name) || (language === 'ar' ? 'رياضة' : 'Sport');
                                return (
                                    <Link 
                                        href={`/sports/${sport.id}`} 
                                        key={i}
                                        className="flex-shrink-0 w-[35%] md:w-[160px] snap-center"
                                    >
                                        <motion.div 
                                            whileHover={{ y: -5 }}
                                            className="group relative h-44 md:h-[220px] rounded-[1.5rem] overflow-hidden shadow-2xl border border-white/10 bg-black"
                                        >
                                            <img 
                                                src={sport.image || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400"} 
                                                alt={displayName}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80"
                                            />
                                            
                                            {/* Sports Title and Action */}
                                            <div className="absolute inset-0 p-4 md:p-5 flex flex-col justify-between z-10">
                                                {/* Top: Sport Name & Detail Button */}
                                                <div className="flex justify-between items-start gap-1">
                                                    <div className="flex-1">
                                                        <h3 className={`text-[10px] md:text-xs font-black text-white drop-shadow-[0_4px_12px_rgba(0,0,0,1)] leading-tight ${language === 'en' ? 'italic uppercase tracking-tighter' : ''}`}>
                                                            {displayName}
                                                        </h3>
                                                    </div>
                                                    
                                                    <div className="flex flex-col gap-1.5 items-center">
                                                        <button 
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                toggleFavoriteSport(sport.id);
                                                            }}
                                                            className={`w-6 h-6 md:w-7 md:h-7 rounded-lg backdrop-blur-md flex items-center justify-center border transition-all active:scale-90 ${favoriteSports.includes(sport.id) ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-white/20 border-white/30 text-white hover:bg-white/40'}`}
                                                        >
                                                            <Heart className={`w-3 h-3 md:w-3.5 md:h-3.5 ${favoriteSports.includes(sport.id) ? 'fill-current' : ''}`} />
                                                        </button>
                                                        
                                                        <div className="bg-primary/90 backdrop-blur-md text-white w-6 h-6 md:w-7 md:h-7 rounded-lg flex items-center justify-center shadow-lg shadow-primary/40 group-hover:bg-white group-hover:text-primary transition-all duration-300">
                                                            <ChevronLeft className={`w-3 h-3 md:w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 ${language === 'en' ? 'rotate-180' : ''}`} />
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Bottom: Stats */}
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-wrap items-center gap-1">
                                                        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xl px-2 py-0.5 rounded-md border border-white/10 shadow-lg">
                                                            <Activity className="w-2 h-2 text-primary" />
                                                            <span className="text-[7px] text-white font-bold uppercase tracking-wider">
                                                                {sport.stats?.intensity || (language === 'ar' ? 'عالية' : 'High')}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="text-[7px] text-white/90 font-black bg-white/10 backdrop-blur-md px-2 py-1 rounded-md border border-white/5 w-fit uppercase tracking-widest">
                                                        {language === 'ar' ? 'عرض' : 'View'}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Gradient Overlay for better readability */}
                                            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/80 via-black/40 to-transparent"></div>
                                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                            
                                            {/* Simplified Hover Effect */}
                                            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Trainers Section */}
                {hasTrainers && (
                    <section>
                        <div className="flex items-center justify-between mb-2 px-1">
                            <div className="text-start">
                                <h2 className={`text-base md:text-xl font-black ${textClass} tracking-tight`}>{t('trainers')}</h2>
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">{language === 'ar' ? 'نخبة المدربين العالميين' : 'Elite global coaches'}</p>
                            </div>
                            <Link href="/trainers" className="text-primary font-black text-xs flex items-center gap-1 group">
                                {t('viewAll')} 
                                <ChevronLeft className={`w-4 h-4 transition-transform group-hover:-translate-x-1 ${language === 'en' ? 'rotate-180' : ''}`} />
                            </Link>
                        </div>
                        <div className="flex items-center gap-4 overflow-x-auto pb-3 -mx-4 px-4 no-scrollbar snap-x snap-mandatory scroll-smooth">
                            {trainers.map((trainer, i) => (
                                <Link 
                                    href={`/trainers/${trainer.id || (typeof trainer.name === 'string' ? trainer.name.toLowerCase().replace(/ /g, '-') : getText(trainer.name).toLowerCase().replace(/ /g, '-'))}`}
                                    key={i}
                                    className="flex-shrink-0 w-40 md:w-56 snap-start"
                                >
                                    <motion.div 
                                        whileHover={{ scale: 1.02 }}
                                        className={`w-full ${cardBg} p-4 rounded-[2rem] border shadow-sm group relative overflow-hidden`}
                                    >
                                        <div className="relative mb-4">
                                            <div className="w-full aspect-square rounded-2xl overflow-hidden">
                                                <img 
                                                    src={(() => {
                                                        if (trainer.image) return trainer.image;
                                                        if (trainer.profileImage) return trainer.profileImage;
                                                        
                                                        // Fallback: search by name in trainersData
                                                        const dbName = typeof trainer.name === 'object' ? trainer.name : { ar: trainer.name, en: trainer.name };
                                                        const found = Object.values(trainersData).find(t => 
                                                            t.name.ar === dbName.ar || t.name.en === dbName.en
                                                        );
                                                        
                                                        return found?.profileImage || 'https://images.unsplash.com/photo-1548690312-e3b507d17a47?q=80&w=200';
                                                    })()} 
                                                    alt={getText(trainer.name)} 
                                                    referrerPolicy="no-referrer" 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                />
                                            </div>
                                            <div className="absolute top-2 end-2">
                                                <button 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        toggleFavoriteTrainer(trainer.id);
                                                    }}
                                                    className={`w-7 h-7 rounded-lg backdrop-blur-md flex items-center justify-center border transition-all active:scale-90 ${favoriteTrainers.includes(trainer.id) ? 'bg-rose-500 border-rose-500 text-white shadow-lg' : 'bg-white/20 border-white/30 text-white'}`}
                                                >
                                                    <Heart className={`w-3 h-3 ${favoriteTrainers.includes(trainer.id) ? 'fill-current' : ''}`} />
                                                </button>
                                            </div>
                                            <div className="absolute -bottom-2 -start-2 bg-primary text-white p-1.5 rounded-lg shadow-lg">
                                                <Star className="w-3 h-3 fill-current" />
                                            </div>
                                        </div>
                                        <div className="text-start">
                                            <h3 className={`text-xs md:text-sm font-black ${textClass} mb-1 truncate`}>{getText(trainer.name)}</h3>
                                            <p className="text-[8px] md:text-[10px] text-gray-500 font-bold uppercase tracking-wider truncate mb-3">{getText(trainer.specialty)}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[8px] text-primary-light font-black">{trainer.rating || "5.0"} / 5.0</span>
                                                <ChevronRight className="w-3 h-3 text-primary" />
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
                {/* Gyms Section */}
                <section>
                    <div className="flex items-center justify-between mb-2 px-1">
                        <div className="text-start">
                            <h2 className={`text-base md:text-xl font-black ${textClass} tracking-tight`}>
                                {language === 'ar' ? 'نوادينا المعتمدة' : 'Our Certified Gyms'}
                            </h2>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                                {language === 'ar' ? 'أفضل المراكز الرياضية المعتمدة' : 'Top certified fitness centers'}
                            </p>
                        </div>
                        <Link href="/gyms" className="text-primary font-black text-xs flex items-center gap-1 group">
                            {t('viewAll')} 
                            <ChevronLeft className={`w-4 h-4 transition-transform group-hover:-translate-x-1 ${language === 'en' ? 'rotate-180' : ''}`} />
                        </Link>
                    </div>
                    <div className="flex items-center gap-4 overflow-x-auto pb-3 -mx-4 px-4 no-scrollbar snap-x snap-mandatory scroll-smooth">
                        {gyms.filter(g => g.type === 'Partner').map((gym, i) => (
                            <motion.div 
                                onClick={() => router.push(`/gyms/${gym.id}`)}
                                key={i}
                                whileHover={{ y: -5 }}
                                className={`flex-shrink-0 w-64 md:w-72 ${cardBg} rounded-[2rem] border shadow-sm overflow-hidden group snap-start cursor-pointer`}
                            >
                                <div className="relative h-32 md:h-40">
                                    <img src={gym.image} alt={gym.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                                        <span className="text-[9px] text-white font-black uppercase tracking-tighter">{gym.type}</span>
                                    </div>
                                </div>
                                <div className="p-4 text-start">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className={`text-xs md:text-sm font-black ${textClass}`}>{gym.name}</h3>
                                        <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-md text-primary">
                                            <Star className="w-2.5 h-2.5 fill-current" />
                                            <span className="text-[9px] font-black">{gym.rating}</span>
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-gray-400 font-bold mb-3">
                                        {language === 'ar' ? 'متاح الآن للحجز والتدريب' : 'Available now for booking'}
                                    </p>
                                    <div className={`w-full py-2.5 rounded-xl border ${darkMode ? 'border-white/10 group-hover:bg-white/5' : 'border-gray-100 group-hover:bg-gray-50'} transition-colors text-center text-[9px] font-black text-primary uppercase tracking-widest`}>
                                        {language === 'ar' ? 'تفاصيل النادي' : 'Gym Details'}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Membership Packages Section - Redesigned to Carousel */}
                <section className="relative py-8">
                    <div className="absolute inset-0 bg-primary/5 rounded-[4rem] -z-10 blur-3xl opacity-50"></div>
                    
                    <div className="w-full flex flex-col items-center justify-center text-center mb-3 px-1 gap-2">
                        <div className="w-full flex flex-col items-center justify-center text-center">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <span className="w-10 h-[1px] bg-primary/40"></span>
                                <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">
                                    {t('membership_plans')}
                                </span>
                                <span className="w-10 h-[1px] bg-primary/40"></span>
                            </div>
                            <h2 className={`text-xl md:text-2xl font-black ${textClass} tracking-tight leading-none`}>
                                {language === 'ar' ? 'انضم إلى' : 'Join Our'} <span className="text-primary">{language === 'ar' ? 'أبطالنا' : 'Champions'}</span>
                            </h2>
                        </div>
                        
                        <div className={`p-1.5 rounded-2xl flex items-center justify-center gap-1 mx-auto ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-100 border border-gray-200'} shadow-inner`}>
                            <button 
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${billingCycle === 'monthly' ? (darkMode ? 'bg-primary text-white shadow-xl shadow-primary/40' : 'bg-white text-slate-900 shadow-md') : 'text-gray-500 hover:text-primary'}`}
                            >
                                {language === 'ar' ? 'شهري' : 'Monthly'}
                            </button>
                            <button 
                                onClick={() => setBillingCycle('yearly')}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${billingCycle === 'yearly' ? (darkMode ? 'bg-primary text-white shadow-xl shadow-primary/40' : 'bg-white text-slate-900 shadow-md') : 'text-gray-500 hover:text-primary'}`}
                            >
                                {language === 'ar' ? 'سنوي' : 'Yearly'}
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth pb-8">
                        {packages.map((pkg, i) => (
                            <div 
                                key={pkg.id}
                                className="w-[85vw] sm:w-[320px] lg:w-[350px] shrink-0 snap-center"
                            >
                                <div className={`relative p-5 md:p-6 rounded-[2rem] shadow-xl overflow-hidden border transition-all duration-300 group ${pkg.featured ? 'bg-[#7C3AED] text-white border-[#8B5CF6] shadow-purple-500/20' : 'bg-white dark:bg-white/5 dark:text-white border-gray-100 dark:border-white/10 shadow-gray-200/50 dark:shadow-none'}`}>
                                    {/* Top Section */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="text-start">
                                            <h3 className="text-lg font-black mb-1 leading-tight">{pkg.name}</h3>
                                            <div className={`flex items-center gap-1 font-bold text-[9px] ${pkg.featured ? 'text-white/80' : 'text-gray-400'}`}>
                                                <Clock className="w-3 h-3" />
                                                <span>{pkg.duration || (language === 'ar' ? `${pkg.months} شهر` : `${pkg.months} Month`)}</span>
                                            </div>
                                        </div>
                                        <div className={`p-2 rounded-xl ${pkg.featured ? 'bg-white/20' : 'bg-gray-100 dark:bg-white/10'}`}>
                                            <Dumbbell className={`w-5 h-5 ${pkg.featured ? 'text-white' : 'text-primary'}`} />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className={`text-start text-[10px] font-medium mb-6 leading-relaxed line-clamp-2 min-h-[30px] ${pkg.featured ? 'text-white/80' : 'text-gray-500'}`}>
                                        {pkg.description}
                                    </p>

                                    {/* Features List */}
                                    <ul className="space-y-3 mb-6 text-start">
                                        {(Array.isArray(pkg.features) ? pkg.features : typeof pkg.features === 'string' ? pkg.features.split(',').map(s => s.trim()) : [])?.map((feat, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-[10px] font-bold">
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${pkg.featured ? 'bg-white/20' : 'bg-emerald-50 dark:bg-emerald-500/10'}`}>
                                                    <Check className={`w-2.5 h-2.5 ${pkg.featured ? 'text-white' : 'text-emerald-500'}`} />
                                                </div>
                                                <span className={pkg.featured ? 'text-white/90' : 'text-slate-700 dark:text-gray-300'}>{feat}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Discount Badge */}
                                    {pkg.discount && (
                                        <div className="absolute top-4 left-4 -rotate-6 transition-transform duration-500">
                                            <span className="bg-rose-500 text-white text-[8px] font-black px-3 py-1 rounded-[8px] shadow-sm flex items-center gap-1">
                                                {language === 'ar' ? `خصم ${pkg.discount}%` : `OFF ${pkg.discount}%`}
                                            </span>
                                        </div>
                                    )}

                                    {/* Bottom Section */}
                                    <div className={`flex items-center justify-between border-t pt-5 ${pkg.featured ? 'border-white/10' : 'border-gray-50 dark:border-white/5'}`}>
                                        <button 
                                            onClick={() => {
                                                addToCart(pkg, { 
                                                    type: 'subscription', 
                                                    metadata: { 
                                                        packageId: pkg.id,
                                                        isTrial: pkg.id === 'trial',
                                                        billingCycle: billingCycle
                                                    } 
                                                });
                                                setIsCartOpen(true);
                                            }}
                                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black transition-all active:scale-95 shadow-sm ${pkg.featured ? 'bg-white text-[#7C3AED] hover:shadow-md' : 'bg-primary text-white hover:shadow-md'}`}
                                        >
                                            {language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                                        </button>

                                        <div className="text-end">
                                            {pkg.oldPrice && (
                                                <span className={`block text-[9px] line-through font-bold mb-0.5 ${pkg.featured ? 'text-white/40' : 'text-gray-300'}`}>
                                                    {pkg.oldPrice} {pkg.currency}
                                                </span>
                                            )}
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl font-black tracking-tighter">
                                                    {billingCycle === 'monthly' ? pkg.price : (pkg.priceYearly || pkg.price * 10)}
                                                </span>
                                                <span className={`text-[9px] font-bold ${pkg.featured ? 'text-white/60' : 'text-primary'}`}>
                                                    {pkg.currency}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Featured Free Trial Card - MOVED DOWN */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className={`relative overflow-hidden rounded-[3rem] ${darkMode ? 'bg-primary shadow-2xl shadow-primary/20' : 'bg-slate-900 shadow-2xl shadow-slate-900/20'} min-h-[220px] flex items-center`}
                >
                    <div className="absolute inset-0 opacity-20">
                        <img 
                            src="https://images.unsplash.com/photo-1590556409324-aa1d726e5c3c?q=80&w=1200" 
                            className="w-full h-full object-cover"
                            alt=""
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
                    </div>
                    <div className="relative z-10 w-full p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1 text-start">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                                    <Gift className="w-5 h-5 text-white animate-bounce" />
                                </div>
                                <span className="text-white/80 text-[9px] font-black uppercase tracking-[0.3em]">{language === 'ar' ? 'هدية الانضمام' : 'WELCOME GIFT'}</span>
                            </div>
                            <h2 className="text-lg md:text-2xl font-black text-white mb-2 tracking-tight">
                                {language === 'ar' ? 'ابدأ رحلتك' : 'Start Your'}{' '}
                                <span className="text-primary-light italic">{language === 'ar' ? 'بحصة تجريبية' : 'Free Trial'}</span>
                            </h2>
                            <p className="text-white/60 text-[10px] md:text-xs font-medium max-w-lg leading-relaxed">
                                {language === 'ar' ? 'هل أنت مستعد لاكتشاف قدراتك الحقيقية؟ انضم إلينا الآن في حصة تجريبية.' : 'Ready to discover your true potential? Join us now for a completely free trial session.'}
                            </p>
                        </div>
                        
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <button 
                                onClick={() => {
                                    const pkg = packages.find(p => p.id === 'trial') || { id: 'trial', name: language === 'ar' ? 'حصّة تجريبية' : 'Free Trial' };
                                    addToCart(pkg, { 
                                        type: 'subscription', 
                                        metadata: { 
                                            packageId: 'trial',
                                            isTrial: true
                                        } 
                                    });
                                    setIsCartOpen(true);
                                }}
                                className="bg-white text-slate-900 px-12 py-5 rounded-[2rem] font-black text-xs md:text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-4 whitespace-nowrap group"
                            >
                                {language === 'ar' ? 'احجز حصتك الآن' : 'Book Your Session'}
                                <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                                    <ArrowLeft className={`w-5 h-5 group-hover:text-primary transition-colors ${language === 'en' ? 'rotate-180' : ''}`} />
                                </motion.div>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Progress & Library (Side-by-side on desktop) */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Library Column */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <h2 className={`text-base md:text-xl font-black ${textClass} tracking-tight`}>{language === 'ar' ? 'مكتبة كابتنا' : 'Captina Library'}</h2>
                            <Link href="/library" className="w-10 h-10 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-black transition-all hover:bg-primary hover:text-white shadow-sm">
                                <ChevronLeft className={`w-4 h-4 ${language === 'en' ? 'rotate-180' : ''}`} />
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {[
                                { id: 'educational', title: language === 'ar' ? 'فيديوهات تعليمية لكل رياضة' : 'Educational Videos', icon: <GraduationCap className="w-5 h-5" />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                                { id: 'trainees', title: language === 'ar' ? 'فيديوهات المتدربين' : 'Trainee Videos', icon: <Users className="w-5 h-5" />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                                { id: 'trainers', title: language === 'ar' ? 'فيديوهات المدربين' : 'Trainer Videos', icon: <UserCheck className="w-5 h-5" />, color: 'text-orange-500', bg: 'bg-orange-500/10' }
                            ].map((cat, i) => (
                                <Link key={i} href={`/library/${cat.id}`} className={`${cardBg} p-5 rounded-[2rem] border flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow group block`}>
                                    <div className={`w-14 h-14 ${cat.bg} ${cat.color} rounded-2xl flex items-center justify-center`}>
                                        {cat.icon}
                                    </div>
                                    <div className="flex-1 text-start">
                                        <h3 className={`font-black text-sm md:text-base ${textClass}`}>{cat.title}</h3>
                                        <p className="text-[10px] md:text-xs font-bold text-gray-400 mt-1">{language === 'ar' ? 'تصفح المحتوى' : 'Browse Content'}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                        <ChevronLeft className={`w-4 h-4 text-gray-400 group-hover:text-white ${language === 'en' ? 'rotate-180' : ''}`} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Goals card moved to top */}
                </div>
            </main>
        </div>
    );
}
