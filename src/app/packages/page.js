"use client";
import React from 'react';
import { motion } from "framer-motion";
import { Check, Zap, Shield, Crown, ArrowLeft } from 'lucide-react';
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
            case 'vip': return 'from-secondary-dark to-orange-600';
            default: return 'from-primary to-blue-700';
        }
    };

    return (
        <div className="relative py-6 md:py-24 bg-white/30 dark:bg-slate-900/30 transition-colors">
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent -z-10"></div>

            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10 md:mb-24 max-w-3xl mx-auto space-y-2 md:space-y-6"
                >
                    <h1 className="text-3xl md:text-7xl font-black text-gray-900 dark:text-white leading-tight">
                        {language === 'ar' ? (
                            <>استثمر في <span className="text-primary italic">نفسك</span></>
                        ) : (
                            <>Invest in <span className="text-primary italic">Yourself</span></>
                        )}
                    </h1>
                    <p className="text-xs md:text-xl text-gray-500 dark:text-gray-400 font-medium">{t('packagesPageSub')}</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10 items-stretch">
                    {packagesList.map((pkg, idx) => (
                        <motion.div
                            key={pkg.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -5 }}
                            className={`relative flex flex-col bg-white dark:bg-slate-800 rounded-3xl md:rounded-[4rem] p-6 md:p-12 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border-2 transition-all ${pkg.featured ? 'border-primary' : 'border-gray-50 dark:border-white/5'}`}
                        >
                            {pkg.featured && (
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-blue-600 text-white font-black px-10 py-3 rounded-full shadow-2xl z-20 whitespace-nowrap">
                                    {t('mostPopular')}
                                </div>
                            )}

                            <div className={`w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] bg-gradient-to-br ${getGradient(pkg.id)} text-white flex items-center justify-center mb-4 md:mb-10 shadow-xl shadow-primary/20`}>
                                <div className="scale-75 md:scale-100">{getIcon(pkg.id)}</div>
                            </div>

                            <div className="text-start">
                                <h3 className="text-xl md:text-4xl font-black text-gray-900 dark:text-white mb-1 md:mb-3">{pkg.name}</h3>
                                <p className="text-xs md:text-xl text-gray-500 dark:text-gray-400 font-medium mb-4 md:mb-10 leading-relaxed">{pkg.description}</p>
                            </div>

                            <div className={`flex items-baseline ${language === 'en' ? 'justify-start' : 'justify-end'} gap-1.5 md:gap-3 mb-4 md:mb-10`}>
                                <span className="text-gray-400 font-black text-sm md:text-xl">{t('currency')}</span>
                                <span className="text-4xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter">{pkg.price}</span>
                                <span className="text-gray-400 font-bold text-[10px] md:text-base">{t('perMonth')}</span>
                            </div>

                            <div className="flex-grow space-y-3 md:space-y-6 mb-6 md:mb-12">
                                {pkg.features.map((feature, i) => (
                                    <div key={i} className={`flex items-center gap-2 md:gap-4 ${language === 'en' ? 'flex-row' : 'flex-row-reverse'} justify-end text-gray-600 dark:text-gray-300 font-black`}>
                                        <span className="text-xs md:text-lg">{feature}</span>
                                        <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3 md:w-4 md:h-4" strokeWidth={3} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href={`/booking?package=${pkg.id}`}
                                className={`premium-button w-full py-3 md:py-6 rounded-xl md:rounded-[2.5rem] font-black text-center text-lg md:text-2xl transition-all shadow-xl ${pkg.featured ? 'bg-primary text-white shadow-primary/30' : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white hover:bg-primary hover:text-white hover:shadow-primary/20'}`}
                            >
                                {t('subscribeNow')}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Support Section */}
                <div className="mt-12 md:mt-24 text-center glass-card p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-white dark:border-white/5 bg-white/50 dark:bg-slate-800/50 max-w-4xl mx-auto shadow-xl">
                    <p className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-2 md:mb-4">{t('hesitatingTitle')}</p>
                    <p className="text-xs md:text-gray-500 dark:text-gray-400 font-bold mb-6 md:mb-8">{t('hesitatingSub')}</p>
                    <button className="bg-primary text-white px-8 py-3 rounded-xl md:rounded-2xl font-black hover:scale-105 transition-transform text-sm md:text-base shadow-lg shadow-primary/25">
                        {t('talkToExperts')}
                    </button>
                </div>
            </div>
        </div>
    );
}
