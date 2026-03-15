"use client";
import React from 'react';
import { motion } from "framer-motion";
import Link from 'next/link';
import { Tag, Sparkles, Clock, ChevronLeft, ChevronRight, Gift, Percent } from 'lucide-react';
import { useApp } from "@/context/AppContext";

export default function Offers() {
    const { language, t } = useApp();
    const allOffers = t('allOffersData') || [];
    const offerImages = [
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1541534741688-6078c64ec4a9?q=80&w=1000&auto=format&fit=crop"
    ];

    return (
        <div className="min-h-screen bg-[#0a0f1a] relative overflow-hidden pb-40 transition-colors duration-500">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-0 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -z-0 -translate-x-1/2 translate-y-1/2"></div>

            {/* Premium Ultra-Compact Header */}
            <section className="relative pt-4 pb-2 px-4 z-20 max-w-7xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/5 pb-2"
                >
                    <div className="flex flex-col text-start">
                        <h1 className="text-base md:text-lg font-black text-white tracking-tighter flex items-center gap-2">
                            <span className="opacity-50 text-[10px] font-bold uppercase tracking-widest">{t('main') || 'الرئيسية'}</span>
                            <span className="w-1 h-1 rounded-full bg-white/20"></span>
                            <span className="opacity-50 text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">{language === 'ar' ? 'العروض' : 'Offers'}</span>
                            <span className="w-1 h-1 rounded-full bg-white/20"></span>
                            <span className="text-primary">{language === 'ar' ? 'عروض كابتينة' : 'Captina Offers'}</span>
                        </h1>
                        <p className="text-gray-500 text-[8px] font-bold uppercase tracking-wider">
                            {language === 'ar' ? 'خصومات حصرية وعروض لا تفوت' : "Exclusive discounts and limited deals"}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{language === 'ar' ? 'أقوى العروض' : 'Best Deals'}</span>
                        </div>
                    </div>
                </motion.div>
            </section>

            <div className="container mx-auto px-4 py-4 relative z-10 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {allOffers.map((offer, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative"
                        >
                            <div className="relative bg-[#1a2235]/40 backdrop-blur-3xl rounded-2xl overflow-hidden border border-white/5 shadow-sm transition-all duration-500 hover:border-primary/20 flex flex-col h-full">
                                <div className="relative w-full h-32 overflow-hidden shrink-0">
                                    <img src={offerImages[index % offerImages.length]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80" alt={offer.title} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-transparent to-transparent opacity-60"></div>
                                    
                                    <div className="absolute top-2 left-2">
                                        <div className="px-2 py-0.5 rounded-md bg-primary backdrop-blur-md text-white text-[7px] font-black uppercase tracking-widest border border-white/10">
                                            {offer.badge}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 p-3 flex flex-col justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1 text-primary/80">
                                            <Sparkles className="w-2.5 h-2.5 fill-primary/20" />
                                            <span className="text-[6px] font-black uppercase tracking-widest leading-none">{language === 'ar' ? 'عرض متميز' : 'Premium Deal'}</span>
                                        </div>
                                        
                                        <h3 className="text-[11px] font-black text-white tracking-tight leading-tight group-hover:text-primary transition-colors line-clamp-1">
                                            {offer.title}
                                        </h3>
                                        
                                        <div className="flex items-center gap-1 text-gray-500">
                                            <Clock className="w-2.5 h-2.5" />
                                            <span className="text-[7px] font-bold">{offer.expiry}</span>
                                        </div>
                                        
                                        <p className="text-gray-400 font-medium text-[8px] leading-relaxed line-clamp-2">
                                            {offer.description}
                                        </p>
                                    </div>

                                    <div className="mt-3 flex items-center gap-2">
                                        <button className="flex-1 bg-white text-slate-950 font-black py-1.5 rounded-lg shadow-sm hover:bg-primary hover:text-white active:scale-95 transition-all flex items-center justify-center gap-1 text-[7px] uppercase tracking-widest font-bold">
                                            {t('activateOffer') || 'Get Offer'}
                                            {language === 'ar' ? <ChevronLeft className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
                                        </button>
                                        <button className="w-7 h-7 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                                            <Percent className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Coupon component - extreme condensed */}
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm relative overflow-hidden"
                >
                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="text-start">
                            <h4 className="text-sm font-black text-white mb-0.5 tracking-tight">
                                {language === 'ar' ? 'لديك كوبون؟' : 'Have a Coupon?'}
                            </h4>
                            <p className="text-[7px] font-black text-gray-500 uppercase tracking-widest opacity-60">
                                {language === 'ar' ? 'أدخل الكود للتفعيل' : 'Enter code to apply'}
                            </p>
                        </div>
                        <div className="w-full sm:w-auto flex gap-2">
                            <input 
                                type="text" 
                                placeholder={language === 'ar' ? 'الكود...' : 'Code...'}
                                className="flex-1 sm:w-28 bg-[#1a2235]/60 border border-white/5 rounded-lg px-3 py-1.5 text-[8px] font-black text-white outline-none focus:border-primary/20 transition-all"
                            />
                            <button className="bg-primary text-white font-black px-4 py-1.5 rounded-lg hover:opacity-90 transition-all text-[8px] uppercase tracking-widest">
                                {language === 'ar' ? 'تفعيل' : 'Apply'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

