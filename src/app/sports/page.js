"use client";
import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
    ChevronLeft, ChevronRight, Dumbbell, Award, 
    Target, Users, Star, Trophy, ArrowLeft,
    Flame, Zap, Timer, Activity, Sparkles, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";

export default function Sports() {
    const { t, language, darkMode } = useApp();
    const sportsList = t('pageSportsData') || [];

    return (
        <div className={`min-h-screen ${darkMode ? "bg-[#0a0f1a]" : "bg-slate-50"} relative overflow-hidden pb-40 transition-colors duration-500`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
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
                            {language === 'ar' ? 'الرياضات' : 'Sports'}
                        </span>
                    </motion.div>

                    {/* Titling Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-1"
                    >
                        <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                            {language === 'ar' ? 'عالم كابتينا' : 'Captina World'}
                        </h1>
                        <div className="flex items-center gap-2">
                            <div className="h-1 w-12 bg-primary rounded-full"></div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest opacity-80">
                                {language === 'ar' ? 'اختر رياضتك المفضلة وابدأ التحدي' : 'Choose your favorite sport & start the challenge'}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Sports Grid */}
            <div className="max-w-7xl mx-auto px-6 mt-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {sportsList.map((sport, idx) => (
                        <motion.div
                            key={sport.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group"
                        >
                            <Link href={`/sports/${sport.id}`}>
                                <div className="relative h-[480px] rounded-[3rem] overflow-hidden shadow-premium transition-all duration-700 hover:shadow-active hover:-translate-y-2 group active:scale-[0.98]">
                                    {/* Image Section */}
                                    <div className="absolute inset-0">
                                        <img 
                                            src={sport.image || "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=800"} 
                                            alt={sport.name}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90"></div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <div className="px-3 py-1 rounded-full bg-primary/90 text-white text-[9px] font-black uppercase tracking-widest backdrop-blur-md">
                                                    {sport.stats?.intensity || 'High Intensity'}
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">
                                                    <Timer className="w-3 h-3 text-primary" />
                                                    <span>{sport.stats?.duration || '60 Min'}</span>
                                                </div>
                                            </div>

                                            <h2 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors duration-300">
                                                {sport.name}
                                            </h2>

                                            <p className="text-xs text-white/50 font-bold uppercase tracking-wider leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 line-clamp-2">
                                                {sport.description}
                                            </p>

                                            <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-4 overflow-hidden">
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black uppercase opacity-60 tracking-widest">{language === 'ar' ? 'المستوى' : 'Experience'}</span>
                                                    <span className="text-xs font-black text-white uppercase tracking-widest">{sport.stats?.level || 'Pro League'}</span>
                                                </div>
                                                <div className="w-12 h-12 bg-white text-slate-950 rounded-[1.2rem] flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl">
                                                    <ArrowRight className={`w-5 h-5 transition-transform ${language === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Subtle Icon Decoration */}
                                    <div className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100">
                                        <Dumbbell className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* CTA Section - More Premium */}
            <section className="mt-32 px-6 max-w-7xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative rounded-[4rem] p-12 md:p-20 overflow-hidden bg-slate-900 dark:bg-[#161b22] text-white shadow-3xl text-start"
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-0 translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-0 -translate-x-1/2 translate-y-1/2"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="max-w-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <Trophy className="w-8 h-8 text-primary" />
                                <span className="text-xs font-black text-primary uppercase tracking-[0.4rem]">Winner Mindset</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black mb-8 leading-none tracking-tighter uppercase italic">
                                {language === 'ar' ? 'بوابتك للاحتراف' : 'Your Pro Portal'}
                            </h2>
                            <p className="text-white/60 text-lg font-bold mb-10 leading-relaxed uppercase tracking-wider opacity-80">
                                {language === 'ar' ? 'انضم الآن واحصل على تقييم بدني مجاني مع استشارة من خبرائنا في المجال الرياضي.' : 'Unleash your potential with dedicated pro-coaching and premium sports science assessment.'}
                            </p>
                            <Link href="/booking" className="inline-flex items-center gap-4 bg-primary text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2rem] hover:shadow-xl hover:shadow-primary/30 active:scale-95 transition-all">
                                {language === 'ar' ? 'ابدأ الآن' : 'Join Elite'}
                                <ChevronRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
                            </Link>
                        </div>
                        <div className="hidden md:block relative animate-float">
                            <div className="w-72 h-72 border-2 border-primary/20 rounded-full flex items-center justify-center p-8">
                                <div className="w-full h-full border-2 border-primary/40 rounded-full flex items-center justify-center p-8">
                                    <Dumbbell className="w-full h-full text-primary opacity-40" />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
