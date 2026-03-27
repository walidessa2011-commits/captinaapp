"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Check, Zap, Shield, Crown, ArrowLeft, Sparkles, Star, ChevronLeft, ChevronRight, ArrowRight, Tag, Clock, Gift, Dumbbell, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { useRouter } from 'next/navigation';

export default function Packages() {
    const { t, language, darkMode, addToCart, setIsCartOpen } = useApp();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('packages');
    const [billingCycle, setBillingCycle] = useState('monthly');
    const packagesList = t('packagesData') || [];
    const offersList = t('allOffersData');
    
    const getIcon = (id) => {
        switch(id) {
            case 'trial': return <Zap className="w-8 h-8" />;
            case 'monthly': return <Shield className="w-8 h-8" />;
            case 'vip': return <Crown className="w-8 h-8" />;
            default: return <Zap className="w-8 h-8" />;
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

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a] pb-40 transition-colors duration-500 relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Decorative Blobs */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] -z-0 -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="h-4 md:h-8"></div>

            <main className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Top Action Bar */}
                <div className="mb-6 p-1 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-between shadow-premium transition-all">
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={() => router.back()}
                            className="w-10 h-10 flex items-center justify-center text-slate-900 dark:text-white hover:text-primary transition-colors active:scale-95"
                        >
                            {language === 'ar' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                        </button>
                        
                        <div className="flex items-center gap-3 px-2 py-2 text-slate-900 dark:text-white">
                            <Crown className="w-4 h-4 text-primary" />
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap">
                                {activeTab === 'packages' 
                                    ? (language === 'ar' ? 'باقات الاشتراك' : 'Subscription Packages')
                                    : (language === 'ar' ? 'العروض الحصرية' : 'Exclusive Offers')}
                            </span>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 px-6 opacity-30">
                        <p className="text-[8px] font-black uppercase tracking-[0.3em]">
                            {language === 'ar' ? 'الرئيسية / الباقات' : 'Home / Packages'}
                        </p>
                    </div>
                </div>

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center text-center mb-10 px-2 gap-4"
                >
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <span className="w-10 h-[1px] bg-primary/40"></span>
                            <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">
                                {activeTab === 'packages' 
                                    ? (language === 'ar' ? 'باقات الاشتراك' : 'Subscription Plans')
                                    : (language === 'ar' ? 'العروض الحصرية' : 'Exclusive Offers')}
                            </span>
                            <span className="w-10 h-[1px] bg-primary/40"></span>
                        </div>
                        <h2 className={`text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none`}>
                            {activeTab === 'packages' ? (
                                <>
                                    {language === 'ar' ? 'انضم إلى' : 'Join Our'} <span className="text-primary">{language === 'ar' ? 'أبطالنا' : 'Champions'}</span>
                                </>
                            ) : (
                                <>
                                    {language === 'ar' ? 'اكتشف' : 'Discover'} <span className="text-primary">{language === 'ar' ? 'هداياك' : 'Your Gifts'}</span>
                                </>
                            )}
                        </h2>
                    </div>
                </motion.div>

                {/* Tab Switcher */}
                <div className="flex justify-center mb-10">
                    <div className="inline-flex p-1.5 bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-2xl shadow-premium">
                        <button
                            onClick={() => setActiveTab('packages')}
                            className={`flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-black transition-all duration-500 ${activeTab === 'packages' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-primary'}`}
                        >
                            <Crown className={`w-4 h-4 ${activeTab === 'packages' ? 'animate-bounce' : ''}`} />
                            {language === 'ar' ? 'الباقات' : 'Packages'}
                        </button>
                        <button
                            onClick={() => setActiveTab('offers')}
                            className={`flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-black transition-all duration-500 ${activeTab === 'offers' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-primary'}`}
                        >
                            <Tag className={`w-4 h-4 ${activeTab === 'offers' ? 'animate-bounce' : ''}`} />
                            {language === 'ar' ? 'العروض' : 'Offers'}
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'packages' ? (
                        <motion.div
                            key="packages"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* No billing toggle needed as we show all 4 plans now */}

                            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth pb-12">
                                {packagesList.map((pkg, i) => (
                                    <div 
                                        key={pkg.id}
                                        className="w-[85vw] sm:w-[350px] shrink-0 snap-center"
                                    >
                                        <div className={`relative p-6 md:p-8 rounded-[2.5rem] shadow-2xl overflow-hidden border transition-all duration-500 group ${pkg.featured ? 'bg-[#7C3AED] text-white border-[#8B5CF6] shadow-purple-500/30' : 'bg-white dark:bg-white/5 dark:text-white border-gray-100 dark:border-white/10 shadow-gray-200/50 dark:shadow-none'}`}>
                                            {/* Top Section */}
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="text-start">
                                                    <h3 className="text-xl font-black mb-2 leading-tight uppercase tracking-tight">{pkg.name}</h3>
                                                    <div className={`flex items-center gap-2 font-bold text-[10px] ${pkg.featured ? 'text-white/80' : 'text-gray-400'}`}>
                                                        <Clock className="w-4 h-4" />
                                                        <span>{pkg.duration}</span>
                                                    </div>
                                                </div>
                                                <div className={`p-3 rounded-2xl ${pkg.featured ? 'bg-white/20' : 'bg-gray-100 dark:bg-white/10'}`}>
                                                    <Dumbbell className={`w-6 h-6 ${pkg.featured ? 'text-white' : 'text-primary'}`} />
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <p className={`text-start text-[11px] font-medium mb-8 leading-relaxed min-h-[40px] ${pkg.featured ? 'text-white/80' : 'text-gray-500'}`}>
                                                {pkg.description}
                                            </p>

                                            {/* Features List */}
                                            <ul className="space-y-4 mb-8 text-start relative z-10">
                                                {(Array.isArray(pkg.features) ? pkg.features : typeof pkg.features === 'string' ? pkg.features.split(',').map(s => s.trim()) : [])?.map((feat, idx) => (
                                                    <li key={idx} className="flex items-center gap-3 text-[11px] font-bold">
                                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${pkg.featured ? 'bg-white/20' : 'bg-emerald-50 dark:bg-emerald-500/10'}`}>
                                                            <Check className={`w-3 h-3 ${pkg.featured ? 'text-white' : 'text-emerald-500'}`} />
                                                        </div>
                                                        <span className={pkg.featured ? 'text-white/90' : 'text-slate-700 dark:text-gray-300'}>{feat}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            {/* Discount Badge */}
                                            {pkg.discount && (
                                                <div className="absolute top-6 left-6 -rotate-6 transition-transform duration-500">
                                                    <span className="bg-rose-500 text-white text-[9px] font-black px-4 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 animate-pulse">
                                                        {language === 'ar' ? `خصم ${pkg.discount}%` : `OFF ${pkg.discount}%`}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Bottom Section */}
                                            <div className={`flex flex-col gap-4 border-t pt-5 ${pkg.featured ? 'border-white/10' : 'border-gray-50 dark:border-white/5'}`}>
                                                {/* Price Header inside Bottom Section */}
                                                <div className="flex items-center justify-between w-full">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${pkg.featured ? 'text-white/60' : 'text-gray-400'}`}>
                                                        {language === 'ar' ? 'السعر' : 'Price'}
                                                    </span>
                                                    <div className="text-end">
                                                        {pkg.oldPrice && (
                                                            <span className={`block text-[10px] line-through font-bold mb-0.5 ${pkg.featured ? 'text-white/40' : 'text-gray-300'}`}>
                                                                {pkg.oldPrice} {pkg.currency}
                                                            </span>
                                                        )}
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-3xl font-black tracking-tighter">
                                                                {pkg.price}
                                                            </span>
                                                            <span className={`text-[10px] font-bold ${pkg.featured ? 'text-white/60' : 'text-primary'}`}>
                                                                {pkg.currency}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Buttons Grid */}
                                                <div className="grid grid-cols-2 gap-2 w-full mt-2">
                                                    <Link 
                                                        href={`/packages/${pkg.id}`}
                                                        className={`flex items-center justify-center gap-2 py-3.5 rounded-[1rem] text-[10px] font-black transition-all active:scale-95 shadow-sm border ${pkg.featured ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-200 dark:border-white/10 text-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                                    >
                                                        {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                                                    </Link>
                                                    <button 
                                                        onClick={() => {
                                                            const packageImage = pkg.months ? {
                                                                1: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop",
                                                                3: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop",
                                                                6: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470&auto=format&fit=crop",
                                                                12: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop"
                                                            }[Number(pkg.months)] : null;
                                                            addToCart({...pkg, image: pkg.image || packageImage}, { 
                                                                type: 'subscription', 
                                                                metadata: { 
                                                                    packageId: pkg.id,
                                                                    isTrial: pkg.id === 'trial'
                                                                } 
                                                            });
                                                            setIsCartOpen(true);
                                                        }}
                                                        className={`flex items-center justify-center gap-2 py-3.5 rounded-[1rem] text-[10px] font-black transition-all active:scale-95 shadow-lg ${pkg.featured ? 'bg-white text-[#7C3AED] hover:shadow-xl' : 'bg-primary text-white hover:shadow-xl'}`}
                                                    >
                                                        {language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                                                        <ShoppingCart className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="offers"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                        >
                            {offersList && offersList.map((offer, idx) => (
                                <motion.div
                                    key={offer.id || idx}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative group bg-white dark:bg-[#1a2235]/40 backdrop-blur-3xl rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-premium overflow-hidden flex flex-col md:flex-row h-full min-h-[220px]"
                                >
                                    {/* Image Section */}
                                    <div className="w-full md:w-2/5 h-48 md:h-auto relative overflow-hidden">
                                        <img 
                                            src={offer.image || (idx % 2 === 0 ? "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800" : "https://images.unsplash.com/photo-1549476464-37392f719918?q=80&w=800")} 
                                            alt={offer.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>
                                        <div className="absolute top-4 left-4">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/90 backdrop-blur-md text-white border border-white/20">
                                                <Sparkles className="w-3 h-3 fill-white" />
                                                <span className="text-[8px] font-black uppercase tracking-widest">{offer.badge}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex-grow p-6 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tighter leading-tight group-hover:text-primary transition-colors">
                                                    {offer.title}
                                                </h3>
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform">
                                                    <Gift className="w-5 h-5" />
                                                </div>
                                            </div>
                                            <p className="text-primary text-[10px] font-black tracking-widest uppercase mb-4">
                                                {offer.subtitle}
                                            </p>
                                            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold mb-6 leading-relaxed">
                                                {offer.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-white/5 mt-auto">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Clock className="w-3 h-3" />
                                                <span className="text-[9px] font-black">{offer.expiry}</span>
                                            </div>
                                            <Link
                                                href={`/offers/${offer.id}`}
                                                className="flex items-center gap-2 text-primary font-black text-[9px] uppercase tracking-widest group-hover:gap-3 transition-all active:scale-95"
                                            >
                                                {t('activateOffer')}
                                                {language === 'ar' ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Hesitating / Help Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 text-center bg-white dark:bg-[#1a2235]/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 relative overflow-hidden group shadow-premium"
                >
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all duration-700"></div>
                    <div className="relative z-10 max-w-md mx-auto">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6 border border-primary/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                            <Star className="w-8 h-8 fill-primary" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">{t('hesitatingTitle')}</h2>
                        <p className="text-[11px] text-gray-500 font-bold mb-8 leading-relaxed">{t('hesitatingSub')}</p>
                        <button className="bg-primary text-white px-10 py-4 rounded-2xl font-black hover:bg-primary/90 transition-all text-[10px] shadow-xl shadow-primary/20 uppercase tracking-widest active:scale-95">
                            {t('talkToExperts')}
                        </button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
