"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { 
    Target, TrendingUp, Users, ShoppingBag, 
    ArrowLeft, Star, ChevronRight, Gift, 
    Bell, ChevronLeft, Search, Settings2, 
    Activity, Dumbbell, UserCheck, Flame
} from 'lucide-react';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useApp } from "@/context/AppContext";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Home() {
    const { t, language, darkMode } = useApp();
    const [user, loadingAuth] = useAuthState(auth);
    const router = useRouter();
    const [currentOffer, setCurrentOffer] = useState(0);
    const [currentPackage, setCurrentPackage] = useState(0);
    const [billingCycle, setBillingCycle] = useState('monthly');

    const offers = t('offersData') || [];
    const sports = t('pageSportsData') || [];
    const trainers = t('pageTrainersData') || [];
    const products = t('productsData') || [];
    const gyms = t('gymsData') || [];

    const hasOffers = Array.isArray(offers) && offers.length > 0;
    const hasSports = Array.isArray(sports) && sports.length > 0;
    const hasTrainers = Array.isArray(trainers) && trainers.length > 0;
    const hasProducts = Array.isArray(products) && products.length > 0;

    const offerImages = [
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000",
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000",
        "https://images.unsplash.com/photo-1541534741688-6078c64ec4a9?q=80&w=1000"
    ];

    const sportsImages = {
        'boxing': "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=600",
        'karate': "https://images.unsplash.com/photo-1552072805-2a9039d00e57?q=80&w=600",
        'crossfit': "https://images.unsplash.com/photo-1534367507873-d2d7e249a3fe?q=80&w=600",
        'bodybuilding': "https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?q=80&w=600"
    };

    const trainersImages = [
        'https://images.unsplash.com/photo-1548690312-e3b507d17a47?q=80&w=200',
        'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=200',
        'https://images.unsplash.com/photo-1517438476312-10d79c077509?q=80&w=200',
        'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=200'
    ];

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
                        { label: language === 'ar' ? 'السعرات' : 'Calories', val: '1,240', icon: <Flame className="w-4 h-4 text-orange-500" />, sub: 'kcal' },
                        { label: language === 'ar' ? 'التمارين' : 'Workouts', val: '12', icon: <Activity className="w-4 h-4 text-primary" />, sub: 'sessions' },
                        { label: language === 'ar' ? 'الوزن' : 'Weight', val: '78.5', icon: <TrendingUp className="w-4 h-4 text-emerald-500" />, sub: 'kg' },
                        { label: language === 'ar' ? 'المدربين' : 'Coaches', val: '4', icon: <Users className="w-4 h-4 text-blue-500" />, sub: 'active' },
                    ].map((stat, i) => (
                        <div key={i} className={`${cardBg} p-4 rounded-2xl border flex flex-col items-start text-start gap-1 shadow-sm`}>
                            <div className="flex items-center gap-2 mb-1">
                                {stat.icon}
                                <span className="text-[8px] font-black uppercase text-gray-500 tracking-widest">{stat.label}</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className={`text-sm font-black ${textClass}`}>{stat.val}</span>
                                <span className="text-[7px] font-bold text-gray-400 uppercase">{stat.sub}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <main className="container mx-auto px-4 space-y-12 relative z-10">
                {/* Featured Free Trial Card - Compact & Professional */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className={`relative overflow-hidden rounded-[2.5rem] ${darkMode ? 'bg-primary shadow-2xl shadow-primary/20' : 'bg-slate-900 shadow-2xl shadow-slate-900/20'} min-h-[180px] flex items-center`}
                >
                    <div className="absolute inset-0 opacity-20">
                        <img 
                            src="https://images.unsplash.com/photo-1590556409324-aa1d726e5c3c?q=80&w=1200" 
                            className="w-full h-full object-cover"
                            alt=""
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
                    </div>
                    <div className="relative z-10 w-full p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1 text-start">
                            <div className="flex items-center gap-2 mb-3">
                                <Gift className="w-5 h-5 text-white animate-bounce" />
                                <span className="text-white/80 text-[10px] font-black uppercase tracking-[0.3em]">{language === 'ar' ? 'هدية الانضمام' : 'WELCOME GIFT'}</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tighter">
                                {language === 'ar' ? 'احصل على حصتك' : 'Get Your First'} <span className="text-primary-light">{language === 'ar' ? 'التجريبية مجاناً' : 'Trial Free'}</span>
                            </h2>
                            <p className="text-white/60 text-[11px] md:text-xs font-medium max-w-sm">
                                {language === 'ar' ? 'ابدأ اليوم مع أفضل المدربين واكتشف قدراتك الحقيقية في بيئة احترافية.' : 'Start today with the best coaches and discover your true potential in a professional environment.'}
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <div className="hidden md:block w-32 h-24 rounded-2xl overflow-hidden border-2 border-white/10 rotate-3 shadow-2xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=400"
                                    className="w-full h-full object-cover" 
                                    alt="Trial" 
                                />
                            </div>
                            <Link 
                                href="/booking?package=trial" 
                                className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2 whitespace-nowrap"
                            >
                                {language === 'ar' ? 'احجز الآن' : 'Book Now'}
                                <ArrowLeft className={`w-4 h-4 ${language === 'en' ? 'rotate-180' : ''}`} />
                            </Link>
                        </div>
                    </div>
                </motion.div>

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
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {sports.map((sport, i) => (
                                <Link href={`/sports/${sport.id}`} key={i}>
                                    <motion.div 
                                        whileHover={{ y: -8 }}
                                        className="group relative h-48 md:h-64 rounded-[2rem] overflow-hidden shadow-xl"
                                    >
                                        <img 
                                            src={sportsImages[sport.id] || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400"} 
                                            alt={sport.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                                        <div className="absolute inset-0 p-5 flex flex-col justify-end text-start">
                                            <h3 className="text-lg md:text-xl font-black text-white mb-1">{sport.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[8px] md:text-[10px] text-primary bg-primary/20 backdrop-blur-md px-2 py-0.5 rounded-full font-black uppercase">
                                                    {sport.stats.intensity}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
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
                                <motion.div 
                                    key={i}
                                    whileHover={{ scale: 1.02 }}
                                    className={`flex-shrink-0 w-40 md:w-56 ${cardBg} p-4 rounded-[2rem] border shadow-sm group relative overflow-hidden snap-start`}
                                >
                                    <div className="relative mb-4">
                                        <div className="w-full aspect-square rounded-2xl overflow-hidden">
                                            <img src={trainersImages[i % trainersImages.length]} alt={trainer.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="absolute -bottom-2 -start-2 bg-primary text-white p-1.5 rounded-lg shadow-lg">
                                            <Star className="w-3 h-3 fill-current" />
                                        </div>
                                    </div>
                                    <div className="text-start">
                                        <h3 className={`text-xs md:text-sm font-black ${textClass} mb-1 truncate`}>{trainer.name}</h3>
                                        <p className="text-[8px] md:text-[10px] text-gray-500 font-bold uppercase tracking-wider truncate mb-3">{trainer.specialty}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[8px] text-primary-light font-black">{trainer.rating} / 5.0</span>
                                            <ChevronRight className="w-3 h-3 text-primary" />
                                        </div>
                                    </div>
                                </motion.div>
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
                <section className="relative py-12">
                    <div className="absolute inset-0 bg-primary/5 rounded-[4rem] -z-10 blur-3xl opacity-50"></div>
                    
                    <div className="flex flex-col md:flex-row items-end justify-between mb-10 px-1 gap-4">
                        <div className="text-start">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-8 h-[2px] bg-primary rounded-full"></span>
                                <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">{t('membership_plans') || (language === 'ar' ? 'خطط العضوية' : 'MEMBERSHIP PLANS')}</span>
                            </div>
                            <h2 className={`text-3xl md:text-5xl font-black ${textClass} tracking-tighter leading-none`}>
                                {language === 'ar' ? 'انضم إلى' : 'Join Our'} <span className="text-primary">{language === 'ar' ? 'أبطالنا' : 'Champions'}</span>
                            </h2>
                        </div>
                        <div className={`p-1 rounded-2xl flex items-center gap-1 ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-100 border border-gray-200'}`}>
                            <button 
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${billingCycle === 'monthly' ? (darkMode ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white text-slate-900 shadow-sm') : 'text-gray-500 hover:text-primary'}`}
                            >
                                {language === 'ar' ? 'شهري' : 'Monthly'}
                            </button>
                            <button 
                                onClick={() => setBillingCycle('yearly')}
                                className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${billingCycle === 'yearly' ? (darkMode ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white text-slate-900 shadow-sm') : 'text-gray-500 hover:text-primary'}`}
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
                        <div className="absolute inset-0 p-6 md:p-10 flex items-center">
                            <AnimatePresence mode="wait">
                                {packages[currentPackage] && (
                                    <motion.div 
                                        key={packages[currentPackage].id}
                                        initial={{ opacity: 0, x: language === 'ar' ? 50 : -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: language === 'ar' ? -50 : 50 }}
                                        transition={{ duration: 0.5 }}
                                        className="max-w-xl w-full text-start"
                                    >
                                        <div className="flex items-center gap-3 mb-3 md:mb-5">
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

                                        <div className="flex items-baseline gap-2 mb-6 md:mb-8">
                                            <span className="text-white text-4xl md:text-6xl font-black tracking-tighter">
                                                {billingCycle === 'monthly' ? packages[currentPackage].price : packages[currentPackage].priceYearly}
                                            </span>
                                            <div className="flex flex-col">
                                                <span className="text-primary text-lg md:text-xl font-bold leading-none">{packages[currentPackage].currency}</span>
                                                <span className="text-white/40 text-[8px] md:text-[9px] font-black uppercase tracking-widest mt-1">
                                                    {billingCycle === 'monthly' ? (language === 'ar' ? 'شهرياً' : 'MONTHLY') : (language === 'ar' ? 'سنوياً' : 'YEARLY')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8">
                                            {packages[currentPackage].features.slice(0, 3).map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
                                                    <div className="w-3.5 h-3.5 rounded-full bg-primary/20 flex items-center justify-center">
                                                        <Star className="w-2 h-2 text-primary fill-current" />
                                                    </div>
                                                    <span className="text-white text-[9px] md:text-[10px] font-bold">{feature}</span>
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
                        <div className="absolute bottom-6 right-8 md:bottom-8 md:right-10 flex gap-1.5">
                            {packages.map((_, i) => (
                                <button 
                                    key={i}
                                    onClick={() => setCurrentPackage(i)}
                                    className={`h-1 rounded-full transition-all duration-500 ${currentPackage === i ? 'w-8 bg-primary' : 'w-1.5 bg-white/20 hover:bg-white/40'}`}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Offers Banner (Carousel-like) */}
                {hasOffers && (
                    <section>
                        <div className="relative h-56 md:h-80 rounded-[3rem] overflow-hidden bg-slate-900 shadow-2xl group">
                            <AnimatePresence mode="wait">
                                <motion.div 
                                    key={currentOffer}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="absolute inset-0"
                                >
                                    <img src={offerImages[currentOffer % offerImages.length]} alt="" className="w-full h-full object-cover opacity-50 scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent p-10 md:p-16 flex flex-col justify-center text-start">
                                        <motion.span 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-primary/20 text-primary-light text-[10px] font-black px-4 py-1.5 rounded-full w-fit mb-4 backdrop-blur-md"
                                        >
                                            {offers[currentOffer].badge}
                                        </motion.span>
                                        <motion.h2 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="text-2xl md:text-5xl font-black text-white mb-3"
                                        >
                                            {offers[currentOffer].title}
                                        </motion.h2>
                                        <motion.p 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="text-xs md:text-xl text-gray-300 font-bold mb-8"
                                        >
                                            {offers[currentOffer].subtitle}
                                        </motion.p>
                                        <button className="bg-primary hover:bg-primary-light text-white px-8 py-3 rounded-2xl text-[10px] md:text-xs font-black w-fit transition-all shadow-xl shadow-primary/40 group-hover:scale-105 active:scale-95">
                                            {t('claimOffer')}
                                        </button>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Dots navigation */}
                            <div className="absolute bottom-8 right-10 flex gap-2">
                                {offers.map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={`h-1.5 rounded-full transition-all duration-500 ${currentOffer === i ? 'w-8 bg-primary' : 'w-2 bg-white/20'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Progress & Tasks (Side-by-side on desktop) */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Tasks Column */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-1">
                            <h2 className={`text-xl font-black ${textClass} tracking-tighter`}>{language === 'ar' ? 'مهامي القادمة' : 'Upcoming Tasks'}</h2>
                            <button className="w-10 h-10 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-black transition-all hover:bg-primary hover:text-white shadow-sm">+</button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { title: language === 'ar' ? 'تمارين الكارديو الصباحية' : 'Morning Cardio Session', time: '08:00 AM', icon: '🏃‍♂️', color: 'bg-primary/20 text-primary' },
                                { title: language === 'ar' ? 'تدريب القوة - الأرجل' : 'Strength Training - Legs', time: '05:00 PM', icon: '💪', color: 'bg-orange-100/50 text-orange-600' }
                            ].map((task, i) => (
                                <div key={i} className={`${cardBg} p-5 rounded-[2rem] border flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow`}>
                                    <div className={`w-14 h-14 ${task.color} rounded-2xl flex items-center justify-center text-2xl`}>
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
                                    85%
                                    <span className="text-xs opacity-50 font-bold uppercase tracking-widest">{language === 'ar' ? 'مكتمل' : 'Completed'}</span>
                                </h3>
                                <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden mb-8 border border-white/5 p-0.5">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: '85%' }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="bg-white h-full rounded-full shadow-[0_0_20px_#fff] relative"
                                    >
                                        <div className="absolute top-0 right-0 h-full w-2 bg-white blur-sm"></div>
                                    </motion.div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <div className="space-y-1">
                                    <p className="text-xs font-black">{language === 'ar' ? 'أداء مذهل!' : 'Amazing performance!'}</p>
                                    <p className="text-[10px] font-medium opacity-60">{language === 'ar' ? 'أكملت 12 حصة من أصل 14.' : '12 out of 14 sessions done.'}</p>
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
