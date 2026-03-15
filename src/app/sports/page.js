"use client";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Dumbbell, Award, Target, Users, Star } from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";

export default function Sports() {
    const { t, language } = useApp();
    const sportsList = t('pageSportsData');
    const sportsColors = [
        'from-orange-500 to-rose-600',
        'from-blue-500 to-indigo-600',
        'from-emerald-500 to-teal-600',
        'from-slate-700 to-slate-900'
    ];
    const sportsImages = [
        'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=400',
        'https://images.unsplash.com/photo-1552072805-2a9039d00e57?q=80&w=400',
        'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?q=80&w=400',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400'
    ];

    return (
        <div className="min-h-screen bg-background pb-32 transition-colors">
            {/* Header Section */}
            <div className={`pt-20 pb-16 px-6 text-start`}>
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">{t('sportsPageTitle')}</h1>
                <p className="text-gray-500 font-bold max-w-xl">
                    {t('sportsPageSub')}
                </p>
            </div>

            <div className="container mx-auto px-4 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sportsList.map((sport, idx) => (
                        <motion.div
                            key={sport.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Link href={`/sports/${sport.id}`} className="block group">
                                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden premium-shadow border border-gray-100 dark:border-white/5 transition-all duration-500 hover:-translate-y-2">
                                    {/* Image Container with Tag */}
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img 
                                            src={sportsImages[idx]} 
                                            alt={sport.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                                                {idx === 0 ? 'FEATURED' : 'ACTIVE'}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20">
                                            <Star className="w-5 h-5 fill-white" />
                                        </div>
                                    </div>

                                    {/* Content Container */}
                                    <div className="p-8 text-start">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h2 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors">{sport.name}</h2>
                                                <p className="text-sm font-bold text-gray-400 mt-1 flex items-center gap-1">
                                                    <Target className="w-3 h-3" />
                                                    {sport.stats.intensity} Training
                                                </p>
                                            </div>
                                            <div className="text-end">
                                                <p className="text-xl font-black text-primary">$199</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">Per Month</p>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-6 line-clamp-2">
                                            {sport.description}
                                        </p>

                                        <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-white/5">
                                            <div className="flex -space-x-2">
                                                {[1,2,3].map(i => (
                                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-gray-200 overflow-hidden">
                                                        <img src={`https://i.pravatar.cc/100?u=${sport.id}${i}`} alt="user" />
                                                    </div>
                                                ))}
                                                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-primary-light flex items-center justify-center text-[10px] font-black text-primary">
                                                    +12
                                                </div>
                                            </div>
                                            <div className="bg-gray-100 dark:bg-white/5 p-2 rounded-xl text-gray-400 group-hover:bg-primary group-hover:text-white transition-all">
                                                <ChevronRight className="w-5 h-5" />
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
