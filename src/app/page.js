"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { 
    Target, TrendingUp, Users, ShoppingBag, 
    ArrowLeft, Star, ChevronRight, Gift, 
    Bell, ChevronLeft, Search, Settings2, 
    Activity, Dumbbell, UserCheck, Flame, Sparkles
} from 'lucide-react';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useApp } from "@/context/AppContext";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getDocs, query, where, limit } from "firebase/firestore";

export default function Home() {
    const { t, language, darkMode, userData } = useApp();
    const [user, loadingAuth] = useAuthState(auth);
    const router = useRouter();
    const [currentOffer, setCurrentOffer] = useState(0);
    const [currentPackage, setCurrentPackage] = useState(0);
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [dbTrainers, setDbTrainers] = useState([]);

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const q = query(collection(db, "trainers"), where("status", "==", "active"), limit(10));
                const snap = await getDocs(q);
                setDbTrainers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (err) {
                console.error("Error fetching trainers:", err);
            }
        };
        fetchTrainers();
    }, []);

    const offers = t('offersData') || [];
    const sports = t('pageSportsData') || [];
    const staticTrainers = t('pageTrainersData') || [];
    const trainers = dbTrainers.length > 0 ? dbTrainers : staticTrainers;
    const products = t('productsData') || [];
    const gyms = t('gymsData') || [];
    const tasks = t('tasksData') || [];
    const goals = t('goalsData') || {};

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
            
            <section className="container mx-auto px-4 pt-6 pb-2 relative z-10">
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

            <main className="container mx-auto px-4 space-y-8 relative z-10">
                {/* Offers Banner (Carousel-like) - MOVED UP */}
                {hasOffers && (
                    <section>
                        <div className="relative h-64 md:h-[400px] rounded-[3rem] overflow-hidden bg-slate-900 shadow-2xl group">
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
                                            className="text-2xl md:text-6xl font-black text-white mb-3 tracking-tighter italic"
                                        >
                                            {offers[currentOffer].title}
                                        </motion.h2>
                                        <motion.p 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="text-[10px] md:text-lg text-white/70 font-bold mb-8 max-w-lg leading-relaxed"
                                        >
                                            {offers[currentOffer].subtitle}
                                        </motion.p>
                                        <button className="bg-white text-slate-900 px-10 py-3.5 rounded-2xl text-[10px] md:text-xs font-black w-fit transition-all shadow-xl hover:scale-105 active:scale-95 uppercase tracking-widest flex items-center gap-3">
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
                                        onClick={() => setCurrentOffer(i)}
                                        className={`h-1.5 rounded-full transition-all duration-500 ${currentOffer === i ? 'w-10 bg-primary shadow-lg shadow-primary/50' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Sports Grid */}
                {hasSports && (
                    <section>
                        <div className="flex items-center justify-between mb-6 px-1">
                            <div className="text-start">
                                <h2 className={`text-xl md:text-3xl font-black ${textClass} tracking-tighter`}>{t('sports')}</h2>
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">{language === 'ar' ? 'اختر تحديك القادم' : 'Choose your next challenge'}</p>
                            </div>
                            <Link href="/sports" className="text-primary font-black text-xs flex items-center gap-1 group">
                                {t('viewAll')} 
                                <ChevronLeft className={`w-4 h-4 transition-transform group-hover:-translate-x-1 ${language === 'en' ? 'rotate-180' : ''}`} />
                            </Link>
                        </div>
                        <div className="flex gap-6 overflow-x-auto pb-10 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {sports.map((sport, i) => {
                                const displayName = sport.name || (language === 'ar' ? 'رياضة' : 'Sport');
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
                                                    
                                                    <div className="bg-primary/90 backdrop-blur-md text-white w-6 h-6 md:w-7 md:h-7 rounded-lg flex items-center justify-center shadow-lg shadow-primary/40 group-hover:bg-white group-hover:text-primary transition-all duration-300">
                                                        <ChevronLeft className={`w-3 h-3 md:w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 ${language === 'en' ? 'rotate-180' : ''}`} />
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
                        <div className="flex items-center justify-between mb-6 px-1">
                            <div className="text-start">
                                <h2 className={`text-xl md:text-3xl font-black ${textClass} tracking-tighter`}>{t('trainers')}</h2>
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">{language === 'ar' ? 'نخبة المدربين العالميين' : 'Elite global coaches'}</p>
                            </div>
                            <Link href="/trainers" className="text-primary font-black text-xs flex items-center gap-1 group">
                                {t('viewAll')} 
                                <ChevronLeft className={`w-4 h-4 transition-transform group-hover:-translate-x-1 ${language === 'en' ? 'rotate-180' : ''}`} />
                            </Link>
                        </div>
                        <div className="flex items-center gap-4 overflow-x-auto pb-6 -mx-4 px-4 no-scrollbar snap-x snap-mandatory scroll-smooth">
                            {trainers.map((trainer, i) => (
                                <Link 
                                    href={`/trainers/${trainer.id || (typeof trainer.name === 'string' ? trainer.name.toLowerCase().replace(/ /g, '-') : 'trainer-'+i)}`}
                                    key={i}
                                    className="flex-shrink-0 w-40 md:w-56 snap-start"
                                >
                                    <motion.div 
                                        whileHover={{ scale: 1.02 }}
                                        className={`w-full ${cardBg} p-4 rounded-[2rem] border shadow-sm group relative overflow-hidden`}
                                    >
                                        <div className="relative mb-4">
                                            <div className="w-full aspect-square rounded-2xl overflow-hidden">
                                                <img src={trainer.image || trainer.profileImage || 'https://images.unsplash.com/photo-1548690312-e3b507d17a47?q=80&w=200'} alt={typeof trainer.name === 'string' ? trainer.name : trainer.name?.[language]} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div className="absolute -bottom-2 -start-2 bg-primary text-white p-1.5 rounded-lg shadow-lg">
                                                <Star className="w-3 h-3 fill-current" />
                                            </div>
                                        </div>
                                        <div className="text-start">
                                            <h3 className={`text-xs md:text-sm font-black ${textClass} mb-1 truncate`}>{typeof trainer.name === 'string' ? trainer.name : trainer.name?.[language]}</h3>
                                            <p className="text-[8px] md:text-[10px] text-gray-500 font-bold uppercase tracking-wider truncate mb-3">{typeof trainer.specialty === 'string' ? trainer.specialty : trainer.specialty?.[language]}</p>
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
                    <div className="flex items-center justify-between mb-6 px-1">
                        <div className="text-start">
                            <h2 className={`text-xl md:text-3xl font-black ${textClass} tracking-tighter`}>
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
                    <div className="flex items-center gap-5 overflow-x-auto pb-6 -mx-4 px-4 no-scrollbar snap-x snap-mandatory scroll-smooth">
                        {gyms.filter(g => g.type === 'Partner').map((gym, i) => (
                            <motion.div 
                                key={i}
                                whileHover={{ y: -5 }}
                                className={`flex-shrink-0 w-64 md:w-80 ${cardBg} rounded-[2.5rem] border shadow-sm overflow-hidden group snap-start`}
                            >
                                <div className="relative h-40 md:h-48">
                                    <img src={gym.image} alt={gym.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                        <span className="text-[10px] text-white font-black uppercase tracking-tighter">{gym.type}</span>
                                    </div>
                                </div>
                                <div className="p-5 text-start">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className={`text-sm md:text-base font-black ${textClass}`}>{gym.name}</h3>
                                        <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-lg text-primary">
                                            <Star className="w-3 h-3 fill-current" />
                                            <span className="text-[10px] font-black">{gym.rating}</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-500 font-bold mb-4">
                                        {language === 'ar' ? 'متاح الآن للحجز والتدريب' : 'Available now for booking & training'}
                                    </p>
                                    <button className={`w-full py-3 rounded-xl border ${darkMode ? 'border-white/10 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'} transition-colors text-[10px] font-black text-primary uppercase tracking-widest`}>
                                        {language === 'ar' ? 'تفاصيل النادي' : 'Gym Details'}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Membership Packages Section - Redesigned to Carousel */}
                <section className="relative py-8">
                    <div className="absolute inset-0 bg-primary/5 rounded-[4rem] -z-10 blur-3xl opacity-50"></div>
                    
                    <div className="w-full flex flex-col items-center justify-center text-center mb-10 px-1 gap-6">
                        <div className="w-full flex flex-col items-center justify-center text-center">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <span className="w-10 h-[1px] bg-primary/40"></span>
                                <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">
                                    {t('membership_plans')}
                                </span>
                                <span className="w-10 h-[1px] bg-primary/40"></span>
                            </div>
                            <h2 className={`text-3xl md:text-5xl font-black ${textClass} tracking-tighter leading-none`}>
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

                    <div className="relative h-[420px] md:h-[350px] rounded-[3rem] overflow-hidden shadow-2xl group">
                        {/* Background Images of Kids Training */}
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={currentPackage}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                className="absolute inset-0"
                            >
                                <img 
                                    src={[
                                        "https://images.unsplash.com/photo-1599058917233-57c0e88cfb4c?q=80&w=1200", // Kids training
                                        "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1200", // Training
                                        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200"  // Kids focus
                                    ][currentPackage % 3]} 
                                    className="w-full h-full object-cover" 
                                    alt="" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
                                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Package Card Content */}
                        <div className="absolute inset-0 p-8 md:p-12 flex items-center justify-center lg:justify-start">
                            <AnimatePresence mode="wait">
                                {packages[currentPackage] && (
                                    <motion.div 
                                        key={packages[currentPackage].id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.5 }}
                                        className="max-w-xl w-full flex flex-col items-center lg:items-start text-center lg:text-start"
                                    >
                                        <div className="flex items-center justify-center lg:justify-start gap-3 mb-4 md:mb-6">
                                            <span className="bg-primary px-3 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-widest shadow-xl shadow-primary/30">
                                                {packages[currentPackage].badge || (language === 'ar' ? 'باقة مميزة' : 'FEATURED')}
                                            </span>
                                            {packages[currentPackage].featured && (
                                                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                                                    <Star className="w-2.5 h-2.5 text-yellow-400 fill-current" />
                                                    <span className="text-white text-[8px] font-black uppercase tracking-tighter">POPULAR</span>
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="text-3xl md:text-5xl font-black text-white mb-2 md:mb-3 tracking-tighter leading-none">
                                            {packages[currentPackage].name}
                                        </h3>
                                        <p className="text-gray-300 text-xs md:text-base mb-5 md:mb-6 font-medium leading-relaxed max-w-sm opacity-90 line-clamp-2 md:line-clamp-none">
                                            {packages[currentPackage].description}
                                        </p>

                                        <div className="flex items-baseline justify-center lg:justify-start gap-2 mb-6 md:mb-10">
                                            <span className="text-white text-5xl md:text-7xl font-black tracking-tighter leading-none">
                                                {billingCycle === 'monthly' ? packages[currentPackage].price : packages[currentPackage].priceYearly}
                                            </span>
                                            <div className="flex flex-col items-start">
                                                <span className="text-primary text-xl md:text-2xl font-bold leading-none">{packages[currentPackage].currency}</span>
                                                <span className="text-white/40 text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-2 px-1">
                                                    {billingCycle === 'monthly' ? (language === 'ar' ? 'شهرياً' : 'MONTHLY') : (language === 'ar' ? 'سنوياً' : 'YEARLY')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap justify-center lg:justify-start gap-2 md:gap-3 mb-8 md:mb-10">
                                            {packages[currentPackage].features.slice(0, 3).map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-xl backdrop-blur-md transition-colors hover:bg-white/20">
                                                    <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                                                        <Star className="w-2.5 h-2.5 text-primary fill-current" />
                                                    </div>
                                                    <span className="text-white text-[10px] md:text-xs font-bold whitespace-nowrap">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <button className="bg-primary hover:bg-primary-light text-white px-8 py-3.5 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/40 block w-full md:w-fit">
                                            {language === 'ar' ? 'اشترك الآن' : 'Subscribe Now'}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Carousel Indicators */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                            {packages.map((_, i) => (
                                <button 
                                    key={i}
                                    onClick={() => setCurrentPackage(i)}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${currentPackage === i ? 'w-10 bg-primary shadow-lg shadow-primary/50' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                                />
                            ))}
                        </div>
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
                                <span className="text-white/80 text-[10px] font-black uppercase tracking-[0.4em]">{language === 'ar' ? 'هدية الانضمام' : 'WELCOME GIFT'}</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter">
                                {language === 'ar' ? 'ابدأ رحلتك' : 'Start Your'}{' '}
                                <span className="text-primary-light italic">{language === 'ar' ? 'بحصة تجريبية مجانية' : 'Free Trial Today'}</span>
                            </h2>
                            <p className="text-white/60 text-xs md:text-base font-medium max-w-lg leading-relaxed">
                                {language === 'ar' ? 'هل أنت مستعد لاكتشاف قدراتك الحقيقية؟ انضم إلينا الآن في حصة تجريبية مجانية تماماً مع نخبة من أفضل المدربين.' : 'Ready to discover your true potential? Join us now for a completely free trial session with elite professional coaches.'}
                            </p>
                        </div>
                        
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <Link 
                                href="/booking?package=trial" 
                                className="bg-white text-slate-900 px-12 py-5 rounded-[2rem] font-black text-xs md:text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-4 whitespace-nowrap group"
                            >
                                {language === 'ar' ? 'احجز حصتك الآن' : 'Book Your Session'}
                                <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                                    <ArrowLeft className={`w-5 h-5 group-hover:text-primary transition-colors ${language === 'en' ? 'rotate-180' : ''}`} />
                                </motion.div>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Progress & Tasks (Side-by-side on desktop) */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Tasks Column */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-1">
                            <h2 className={`text-xl font-black ${textClass} tracking-tighter`}>{language === 'ar' ? 'مهامي القادمة' : 'Upcoming Tasks'}</h2>
                            <button className="w-10 h-10 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-black transition-all hover:bg-primary hover:text-white shadow-sm">+</button>
                        </div>
                        <div className="space-y-4">
                            {tasks.map((task, i) => (
                                <div key={i} className={`${cardBg} p-5 rounded-[2rem] border flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow`}>
                                    <div className={`w-14 h-14 ${task.type === 'cardio' ? 'bg-primary/20 text-primary' : 'bg-orange-100/50 text-orange-600'} rounded-2xl flex items-center justify-center text-2xl`}>
                                        {task.icon}
                                    </div>
                                    <div className="flex-1 text-start">
                                        <h3 className={`font-black text-sm md:text-base ${textClass}`}>{task.title}</h3>
                                        <p className="text-[10px] md:text-xs font-bold text-gray-400 mt-1">{task.time}</p>
                                    </div>
                                    <ChevronLeft className={`w-5 h-5 text-gray-300 ${language === 'en' ? 'rotate-180' : ''}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Achievement Card */}
                    <div className={`${darkMode ? 'bg-primary' : 'bg-slate-900'} p-10 rounded-[3rem] text-white text-start relative overflow-hidden shadow-2xl`}>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <p className="text-[10px] font-black tracking-widest uppercase opacity-60 mb-3">{language === 'ar' ? 'أهداف الأسبوع' : 'Weekly Goals'}</p>
                                <h3 className="text-5xl font-black mb-6 flex items-baseline gap-2">
                                    {goals.percentage}%
                                    <span className="text-xs opacity-50 font-bold uppercase tracking-widest">{language === 'ar' ? 'مكتمل' : 'Completed'}</span>
                                </h3>
                                <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden mb-8 border border-white/5 p-0.5">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${goals.percentage}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="bg-white h-full rounded-full shadow-[0_0_20px_#fff] relative"
                                    >
                                        <div className="absolute top-0 right-0 h-full w-2 bg-white blur-sm"></div>
                                    </motion.div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <div className="space-y-1">
                                    <p className="text-xs font-black">{goals.text}</p>
                                    <p className="text-[10px] font-medium opacity-60">{goals.sub}</p>
                                </div>
                                <button className="px-8 py-3 bg-white text-slate-900 rounded-2xl text-[10px] font-black hover:scale-105 transition-transform shadow-xl">
                                    {t('readMore')}
                                </button>
                            </div>
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Target className="w-40 h-40" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
