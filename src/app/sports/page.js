"use client";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Dumbbell, Award, Target, Users, Star, Trophy, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";

export default function Sports() {
    const { t, language } = useApp();
    const sportsList = t('pageSportsData');
    
    const sportsImages = [
        'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=600',
        'https://images.unsplash.com/photo-1552072805-2a9039d00e57?q=80&w=600',
        'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?q=80&w=600',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600'
    ];

    return (
        <div className="min-h-screen bg-[#0a0f1a] pb-40 transition-colors relative overflow-hidden">
            {/* Background Decorative Blobs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
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
                            <span className="opacity-50 text-[10px] font-bold uppercase tracking-widest">{language === 'ar' ? 'الرياضات' : 'Sports'}</span>
                            <span className="w-1 h-1 rounded-full bg-white/20"></span>
                            <span className="text-primary">{language === 'ar' ? 'رياضات كابتينة' : 'Captina Sports'}</span>
                        </h1>
                        <p className="text-gray-500 text-[8px] font-bold uppercase tracking-wider">
                            {language === 'ar' ? 'تجهيزات الأبطال في مكان واحد' : "Champions' gear in one place"}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 flex-1 md:max-w-xs justify-end">
                        <div className="relative group flex-1 max-w-[160px]">
                            <input
                                type="text"
                                placeholder={language === 'ar' ? 'ابحث...' : 'Search...'}
                                className="w-full bg-[#1a2235]/60 backdrop-blur-3xl border border-white/5 rounded-lg py-1.5 px-3 ps-8 transition-all outline-none text-white font-bold text-[9px] text-start"
                            />
                            <Target className={`absolute ${language === 'en' ? 'left-2.5' : 'right-2.5'} top-1/2 -translate-y-1/2 w-3 h-3 text-white/40 group-focus-within:text-primary transition-colors`} />
                        </div>
                    </div>
                </motion.div>
            </section>

            <div className="container mx-auto px-4 py-8 relative z-10 max-w-7xl">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                    {sportsList.map((sport, idx) => (
                        <motion.div
                            key={sport.id}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Link href={`/sports/${sport.id}`} className="block group h-full">
                                <div className="bg-[#1a2235]/30 backdrop-blur-3xl rounded-xl overflow-hidden border border-white/5 transition-all duration-500 hover:border-primary/20 relative flex flex-col h-full shadow-sm">
                                    {/* Image Container */}
                                    <div className="relative aspect-[4/5] overflow-hidden shrink-0">
                                        <img 
                                            src={sportsImages[idx] || sportsImages[0]} 
                                            alt={sport.name}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-transparent to-transparent opacity-90"></div>
                                        
                                        <div className="absolute top-1.5 right-1.5 flex flex-col gap-1 items-end">
                                            <span className="bg-primary backdrop-blur-md text-white text-[5px] font-black px-1 py-0.5 rounded shadow-lg uppercase tracking-widest border border-white/10">
                                               {language === 'ar' ? 'متاح' : 'ACTIVE'}
                                            </span>
                                        </div>
                                        
                                        <div className="absolute bottom-1.5 left-2 right-2 flex justify-between items-end text-white">
                                            <div className="flex flex-col">
                                                <h2 className="text-[10px] font-black tracking-tight leading-tight line-clamp-1 group-hover:text-primary transition-colors">{sport.name}</h2>
                                                <div className="flex items-center gap-0.5 mt-0.5">
                                                    <Trophy className="w-2 h-2 text-amber-500 fill-amber-500" />
                                                    <span className="text-[8px] font-black">4.9</span>
                                                </div>
                                            </div>
                                            <div className="w-5 h-5 bg-white/10 backdrop-blur-md rounded flex items-center justify-center border border-white/10 mb-0.5">
                                                <ChevronRight className={`w-3 h-3 ${language === 'ar' ? 'rotate-180' : ''}`} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Container */}
                                    <div className="p-2 text-start flex-1 flex flex-col justify-between">
                                        <div className="mb-2">
                                            <p className="text-[7px] text-gray-500 font-bold leading-tight line-clamp-2 opacity-80">
                                                {sport.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                            <div className="flex flex-col">
                                                <span className="text-[5px] font-black text-gray-600 uppercase tracking-widest leading-none mb-0.5">{language === 'ar' ? 'المدربين' : 'COACHES'}</span>
                                                <span className="text-[8px] font-black text-white">12+</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="flex -space-x-1.5">
                                                    {[1,2,3].map(i => (
                                                        <div key={i} className="w-4 h-4 rounded-sm border border-[#1a2235] bg-slate-800 overflow-hidden">
                                                            <img src={`https://i.pravatar.cc/100?u=${sport.id}${i}`} alt="user" className="w-full h-full object-cover" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
