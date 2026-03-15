"use client";
import React from 'react';
import { motion } from "framer-motion";
import Link from 'next/link';
import { Tag, Sparkles, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from "@/context/AppContext";

export default function Offers() {
    const { language, t } = useApp();
    const allOffers = t('allOffersData');
    const offerImages = [
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1541534741688-6078c64ec4a9?q=80&w=1000&auto=format&fit=crop"
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-white/5 sticky top-0 z-30">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-full transition-colors order-first">
                        <ChevronLeft className={`w-6 h-6 text-gray-900 dark:text-white ${language === 'en' ? 'rotate-180' : ''}`} />
                    </Link>
                    <h1 className="text-xl font-black text-gray-900 dark:text-white">{t('offersPageTitle')}</h1>
                    <div className="w-10 order-last"></div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid gap-6">
                    {allOffers.map((offer, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5 group"
                        >
                            <div className="relative h-48 md:h-64 overflow-hidden">
                                <img 
                                    src={offerImages[index]} 
                                    alt={offer.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent ${language === 'en' ? '' : 'rotate-180'}`}></div>
                                <div className={`absolute top-4 ${language === 'en' ? 'left-4' : 'right-4'}`}>
                                    <span className="px-4 py-1.5 rounded-full bg-primary text-white text-xs font-black shadow-lg">
                                        {offer.badge}
                                    </span>
                                </div>
                                <div className={`absolute bottom-4 ${language === 'en' ? 'left-4' : 'right-4'} text-white text-start`}>
                                    <h2 className="text-2xl font-black mb-1">{offer.title}</h2>
                                    <div className="flex items-center gap-2 text-white/80 text-sm">
                                        <Clock className="w-4 h-4" />
                                        <span>{offer.expiry}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 text-start">
                                <p className="text-gray-600 dark:text-gray-400 font-bold mb-6 leading-relaxed">
                                    {offer.description}
                                </p>
                                <button className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                    {t('activateOffer')}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
