"use client";
import React from 'react';
import { motion } from "framer-motion";
import { Check, Zap, Shield, Crown, ChevronLeft, ChevronRight, ShoppingCart, Star, Clock, Gift, Dumbbell, Sparkles, Calendar, Repeat } from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function PackageDetail({ params }) {
    const { t, language, darkMode, addToCart, setIsCartOpen } = useApp();
    const router = useRouter();
    const packageId = params.id;
    
    const packagesList = t('packagesData') || [];
    const pkg = packagesList.find(p => p.id === packageId);

    if (!pkg) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0f1a]">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-widest">
                        {language === 'ar' ? 'الباقة غير موجودة' : 'Package Not Found'}
                    </h2>
                    <button 
                        onClick={() => router.push('/packages')}
                        className="px-6 py-3 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all"
                    >
                        {language === 'ar' ? 'العودة للباقات' : 'Back to Packages'}
                    </button>
                </div>
            </div>
        );
    }

    const getIcon = (id) => {
        switch(id) {
            case 'trial': return <Zap className="w-12 h-12" />;
            case 'monthly': return <Shield className="w-12 h-12" />;
            case 'vip': return <Crown className="w-12 h-12" />;
            default: return <Zap className="w-12 h-12" />;
        }
    };

    const getGradient = (id) => {
        switch(id) {
            case 'trial': return 'from-emerald-400 to-teal-600';
            case 'monthly': return 'from-primary to-blue-700';
            case 'vip': return 'from-amber-400 to-rose-600';
            default: return 'from-primary to-blue-700';
        }
    };

    const getPackageImage = (months) => {
        switch (Number(months)) {
            case 1: return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop";
            case 3: return "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop";
            case 6: return "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470&auto=format&fit=crop";
            case 12: return "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop";
            default: return null;
        }
    };

    const isMonthPackage = [1, 3, 6, 12].includes(Number(pkg.months));
    const packageImage = pkg.image || getPackageImage(pkg.months);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a] pb-20 transition-colors duration-500 relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Decorative Blobs */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            
            <div className="max-w-4xl mx-auto px-4 pt-10 relative z-10">
                {/* Back Button */}
                <button 
                    onClick={() => router.back()}
                    className="mb-6 w-10 h-10 bg-white dark:bg-white/5 rounded-xl flex items-center justify-center border border-gray-100 dark:border-white/10 text-gray-900 dark:text-white hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                    {language === 'ar' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>

                <div className={`grid grid-cols-1 ${isMonthPackage ? 'lg:grid-cols-5 max-w-5xl mx-auto items-start gap-8 bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-xl border border-gray-100 dark:border-white/5' : 'md:grid-cols-2 gap-10 items-center'}`}>
                    {/* Visual Side */}
                    <motion.div
                        initial={{ opacity: 0, x: language === 'ar' ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`relative ${isMonthPackage ? 'lg:col-span-2' : ''}`}
                    >
                        {packageImage ? (
                            <div className={`w-full relative rounded-3xl overflow-hidden shadow-lg ${isMonthPackage ? 'aspect-video lg:aspect-[3/4]' : 'aspect-square'}`}>
                                <Image 
                                    src={packageImage}
                                    alt={pkg.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <h3 className="text-white text-2xl font-black">{pkg.name}</h3>
                                    <p className="text-white/80 text-sm font-bold mt-1 line-clamp-2">{pkg.description}</p>
                                </div>
                            </div>
                        ) : (
                            <div className={`rounded-3xl bg-gradient-to-br ${getGradient(pkg.id)} flex items-center justify-center text-white shadow-xl relative overflow-hidden group ${isMonthPackage ? 'aspect-video lg:aspect-[3/4]' : 'aspect-square'}`}>
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                {getIcon(pkg.id)}
                                
                                {/* Decorative Sparkles */}
                                <div className="absolute top-10 right-10">
                                    <Sparkles className="w-8 h-8 opacity-40 animate-pulse" />
                                </div>
                            </div>
                        )}
                        
                        
                        {/* Rating Badge Overlay */}
                        <div className="absolute -bottom-6 -right-6 md:right-10 bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-2xl border border-gray-100 dark:border-white/10 flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                                <Star className="w-5 h-5 text-white fill-white" />
                            </div>
                            <div className="flex flex-col text-start">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{language === 'ar' ? 'تقييم شامل' : 'Overall Rating'}</span>
                                <span className="text-sm font-black text-gray-900 dark:text-white">4.9/5.0</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, x: language === 'ar' ? -50 : 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex flex-col text-start ${isMonthPackage ? 'lg:col-span-3 space-y-4' : 'space-y-6'}`}
                    >
                        <div className="space-y-1">
                            <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">{t('membership_plans')}</span>
                            {!isMonthPackage && <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">{pkg.name}</h1>}
                            {isMonthPackage && <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{language === 'ar' ? 'تفاصيل الاشتراك' : 'Subscription Details'}</h2>}
                        </div>

                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl md:text-6xl font-black text-primary">{pkg.price}</span>
                            <span className="text-lg md:text-2xl font-black text-slate-400">{t('currency')}</span>
                            {pkg.id !== 'trial' && <span className="text-sm font-bold text-gray-400 mx-2">{t('perMonth')}</span>}
                        </div>

                        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base font-bold leading-relaxed">
                            {pkg.description}
                        </p>

                        {/* Session Info Cards */}
                        <div className="grid grid-cols-3 gap-3 pt-4">
                            <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-2xl text-center space-y-1">
                                <Repeat className="w-5 h-5 text-blue-500 mx-auto" />
                                <div className="text-lg font-black text-blue-600 dark:text-blue-400">{pkg.sessionsPerWeek || 3}</div>
                                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{language === 'ar' ? 'حصص/أسبوع' : 'Sessions/Week'}</div>
                            </div>
                            <div className="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-2xl text-center space-y-1">
                                <Calendar className="w-5 h-5 text-emerald-500 mx-auto" />
                                <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">{(pkg.sessionsPerWeek || 3) * (pkg.months || 1) * 4}</div>
                                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{language === 'ar' ? 'إجمالي الحصص' : 'Total Sessions'}</div>
                            </div>
                            <div className="bg-amber-50 dark:bg-amber-500/10 p-4 rounded-2xl text-center space-y-1">
                                <Clock className="w-5 h-5 text-amber-500 mx-auto" />
                                <div className="text-lg font-black text-amber-600 dark:text-amber-400">{pkg.months || 1}</div>
                                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{language === 'ar' ? 'شهر' : 'Month(s)'}</div>
                            </div>
                        </div>

                        <div className={`space-y-3 ${isMonthPackage ? 'pt-2' : 'pt-6'}`}>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{language === 'ar' ? 'المزايا المتاحة' : 'Package Features'}</h3>
                            <div className={`grid grid-cols-1 ${isMonthPackage ? 'md:grid-cols-2 gap-2 text-xs' : 'gap-3 text-sm'} text-start`}>
                                {(Array.isArray(pkg.features) ? pkg.features : []).map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-2 group">
                                        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <span className={`font-bold text-slate-700 dark:text-slate-300 ${isMonthPackage ? 'text-xs' : 'text-sm'}`}>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 flex flex-col sm:flex-row gap-3">
                            <button 
                                onClick={() => {
                                    addToCart({ ...pkg, image: packageImage });
                                    setIsCartOpen(true);
                                }}
                                className={`flex-1 py-4 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2`}
                            >
                                <ShoppingCart className="w-4 h-4" />
                                {t('subscribeNow')}
                            </button>
                            
                            {pkg.id === 'trial' && (
                                <button 
                                    onClick={() => router.push('/booking?trial=true')}
                                    className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-black dark:hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                                >
                                    <Clock className="w-4 h-4" />
                                    {language === 'ar' ? 'حجز الموعد' : 'Schedule Now'}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
