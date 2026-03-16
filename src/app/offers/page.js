"use client";
import React from 'react';
import { motion } from "framer-motion";
import Link from 'next/link';
import { Tag, Sparkles, Clock, ChevronLeft, ChevronRight, Gift, Percent, ArrowRight } from 'lucide-react';
import { useApp } from "@/context/AppContext";

export default function Offers() {
    const { language, t, darkMode } = useApp();
    const allOffers = t('allOffersData') || [];
    const offerImages = [
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1541534741688-6078c64ec4a9?q=80&w=1000&auto=format&fit=crop"
    ];

    return (
        <div className={`min-h-screen ${darkMode ? "bg-[#0a0f1a]" : "bg-slate-50"} relative overflow-hidden pb-32 transition-colors duration-500`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px] -z-0 -translate-x-1/2 translate-y-1/2"></div>
            
            {/* Header / Breadcrumbs - Mobile Premium Alignment */}
            <header className="relative z-20 pt-8 px-6">
                <div className="max-w-7xl mx-auto flex flex-col items-start">
                    {/* Breadcrumbs */}
                    <motion.div 
                        initial={{ opacity: 0, x: language === 'ar' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 mb-4 text-[11px] font-black uppercase tracking-[0.2em] opacity-60"
                    >
                        <Link href="/" className="hover:text-primary transition-colors text-slate-900 dark:text-white">
                            {language === 'ar' ? 'الرئيسية' : 'Home'}
                        </Link>
                        <span className="text-gray-400">
                            {language === 'ar' ? ' / ' : ' / '}
                        </span>
                        <span className="text-primary font-black">
                            {language === 'ar' ? 'العروض' : 'Offers'}
                        </span>
                    </motion.div>

                    {/* Titling Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-1"
                    >
                        <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                            {language === 'ar' ? 'أقوى العروض' : 'Strongest Offers'}
                        </h1>
                        <div className="flex items-center gap-2">
                            <div className="h-1 w-12 bg-primary rounded-full"></div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest opacity-80">
                                {language === 'ar' ? 'وفر أكثر مع باقات كابتينة' : 'Save more with Captina packages'}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </header>

            <div className="container mx-auto px-6 mt-12 relative z-10 max-w-7xl">
                {/* Offers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allOffers.map((offer, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="relative bg-white/80 dark:bg-[#1a2235]/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-premium transition-all duration-500 hover:shadow-active hover:-translate-y-2 flex flex-col h-full active:scale-[0.98]">
                                {/* Card Image Section */}
                                <div className="relative w-full h-44 overflow-hidden shrink-0">
                                    <img 
                                        src={offerImages[index % offerImages.length]} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                                        alt={offer.title} 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    
                                    {/* Action Badge */}
                                    <div className="absolute top-4 start-4">
                                        <div className="px-4 py-1.5 rounded-full bg-primary/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest border border-white/20 shadow-lg">
                                            {offer.badge}
                                        </div>
                                    </div>

                                    {/* Discount Icon Overlay */}
                                    <div className="absolute bottom-4 end-4">
                                        <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                            <Percent className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="flex-1 p-6 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-primary/10 rounded-xl">
                                                <Sparkles className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                                                {language === 'ar' ? 'عرض متميز' : 'Premium Deal'}
                                            </span>
                                        </div>
                                        
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-primary transition-colors">
                                            {offer.title}
                                        </h3>
                                        
                                        <div className="flex items-center gap-2 text-primary font-bold">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-xs uppercase tracking-tight">{offer.expiry}</span>
                                        </div>
                                        
                                        <p className="text-gray-500 dark:text-gray-400 font-bold text-sm leading-relaxed line-clamp-3">
                                            {offer.description}
                                        </p>
                                    </div>

                                    {/* CTA Button */}
                                    <div className="mt-8">
                                        <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black py-4 rounded-2xl shadow-xl hover:bg-primary hover:text-white dark:hover:bg-primary transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2rem] group/btn">
                                            {t('activateOffer') || 'Get Offer'}
                                            <ArrowRight className={`w-4 h-4 transition-transform ${language === 'ar' ? 'rotate-180 group-hover/btn:-translate-x-1' : 'group-hover/btn:translate-x-1'}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Coupon component - Large & Immersive */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 p-1 rounded-[3rem] bg-gradient-to-br from-primary via-primary/50 to-blue-500 shadow-2xl relative overflow-hidden"
                >
                    <div className="bg-white dark:bg-[#0a101f] rounded-[2.8rem] p-8 md:p-12 relative overflow-hidden">
                        {/* Abstract background for coupon */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-center md:text-start max-w-md">
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                                    <div className="p-3 bg-primary/10 rounded-2xl">
                                        <Gift className="w-6 h-6 text-primary" />
                                    </div>
                                    <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">
                                        Exclusive Reward
                                    </span>
                                </div>
                                <h4 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                                    {language === 'ar' ? 'أدخل كود الخصم المباشر' : 'Have a Promo Code?'}
                                </h4>
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 leading-relaxed uppercase tracking-wider opacity-80">
                                    {language === 'ar' ? 'استخدم كوبونك الآن لمزايا إضافية على اشتراكك القادم' : 'Apply your coupon code for additional benefits on your next plan'}
                                </p>
                            </div>
                            
                            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
                                <input 
                                    type="text" 
                                    placeholder={language === 'ar' ? 'أدخل الكود هنا...' : 'Enter code...'}
                                    className="flex-1 md:w-72 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-black text-slate-900 dark:text-white outline-none focus:border-primary transition-all placeholder:opacity-50"
                                />
                                <button className="bg-primary text-white font-black px-10 py-4 rounded-2xl hover:shadow-lg hover:shadow-primary/30 transition-all text-xs uppercase tracking-widest active:scale-95">
                                    {language === 'ar' ? 'تفعيل ' : 'Apply Now'}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
