"use client";
import React from 'react';
import { motion } from "framer-motion";
import { Check, Zap, Shield, Crown, ArrowLeft, Sparkles, Star, ChevronLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";

export default function Packages() {
    const { t, language } = useApp();
    const packagesList = t('packagesData');
    
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
            {/* Header / Breadcrumbs - Compact Version */}
            <header className="relative z-20 pt-6 px-4">
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    {/* Breadcrumbs */}
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest opacity-50"
                    >
                        <Link href="/" className="hover:text-primary transition-colors">{language === 'ar' ? 'الرئيسية' : 'Home'}</Link>
                        <span className="text-gray-500">
                            {language === 'ar' ? ' < ' : ' > '}
                        </span>
                        <span className="text-primary">{language === 'ar' ? 'الباقات' : 'Packages'}</span>
                    </motion.div>

                    {/* Consolidated Title Line - Horizontal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3 mb-4"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                        <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase text-center">
                            {language === 'ar' 
                                ? '( عروض محدودة - باقات اشتراك كابتينة )' 
                                : '( Exclusive Deals - Captina Packages )'}
                        </h1>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                    </motion.div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 mt-2 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
                    {packagesList.map((pkg, idx) => (
                        <motion.div
                            key={pkg.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`relative flex flex-col bg-white dark:bg-[#1a2235]/40 backdrop-blur-3xl rounded-[2rem] p-5 border shadow-premium transition-all duration-500 hover:border-primary/20 group ${pkg.featured ? 'border-primary/40 bg-primary/5 dark:bg-primary/5' : 'border-gray-100 dark:border-white/5'}`}
                        >
                            {pkg.featured && (
                                <div className="absolute -top-2.5 left-1/2 -track-x-1/2 -translate-x-1/2 bg-primary text-white font-black px-4 py-0.5 rounded-full shadow-lg z-20 whitespace-nowrap text-[6px] tracking-widest uppercase flex items-center gap-1">
                                    <Sparkles className="w-2 h-2 fill-white" />
                                    {t('mostPopular')}
                                </div>
                            )}

                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getGradient(pkg.id)} text-white flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500`}>
                                    <div className="scale-50">{getIcon(pkg.id)}</div>
                                </div>
                                <div className="text-end">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">{pkg.price}</span>
                                        <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest">{t('currency')}</span>
                                    </div>
                                    <p className="text-[6px] font-black text-primary uppercase tracking-widest">{t('perMonth')}</p>
                                </div>
                            </div>

                            <div className="text-start mb-4">
                                <h3 className="text-sm font-black text-slate-900 dark:text-white mb-0.5 tracking-tight">{pkg.name}</h3>
                                <p className="text-[9px] text-gray-500 font-bold leading-tight line-clamp-1">{pkg.description}</p>
                            </div>

                            <div className="flex-grow space-y-2.5 mb-6">
                                {pkg.features.map((feature, i) => (
                                    <div key={i} className={`flex items-center gap-2 ${language === 'en' ? 'flex-row text-left' : 'flex-row text-right'}`}>
                                        <div className="w-5 h-5 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 border border-primary/20">
                                            <Check className="w-2.5 h-2.5" strokeWidth={4} />
                                        </div>
                                        <span className="text-[8px] text-gray-600 dark:text-gray-400 font-bold tracking-tight leading-tight">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href={`/booking?package=${pkg.id}`}
                                className={`w-full py-2.5 rounded-xl font-black text-center text-[8px] transition-all shadow-xl uppercase tracking-widest active:scale-95 ${pkg.featured ? 'bg-primary text-white hover:bg-primary/90' : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-white border border-gray-200 dark:border-white/5 hover:bg-primary hover:border-primary'}`}
                            >
                                {t('subscribeNow')}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Compact Help Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center bg-white dark:bg-[#1a2235]/40 backdrop-blur-3xl p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 relative overflow-hidden group shadow-premium"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 max-w-sm mx-auto">
                        <h2 className="text-lg font-black text-slate-900 dark:text-white mb-1 tracking-tighter">{t('hesitatingTitle')}</h2>
                        <p className="text-[9px] text-gray-500 font-bold mb-5">{t('hesitatingSub')}</p>
                        <button className="bg-primary/10 text-primary border border-primary/20 px-8 py-2.5 rounded-xl font-black hover:bg-primary hover:text-white transition-all text-[8px] shadow-sm uppercase tracking-widest">
                            {t('talkToExperts')}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
