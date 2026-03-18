"use client";
import { motion } from "framer-motion";
import { Star, Target, Zap, Clock, Shield, ChevronLeft, ChevronRight, Award, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { useRouter } from 'next/navigation';
import SportTrainers from "@/components/SportTrainers";

export default function CrossfitPage() {
    const { t, language, darkMode } = useApp();
    const router = useRouter();
    const content = t('crossfitContent');

    if (!content) return null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a] pb-20 transition-colors duration-500 overflow-hidden relative" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Decorations */}
            <div className={`absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[160px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse`}></div>
            
            {/* Immersive Cover Image */}
            <div className="relative h-[30vh] md:h-[45vh] w-full overflow-hidden shadow-2xl">
                <img 
                    src={content.heroImg}
                    className="w-full h-full object-cover"
                    alt={content.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#0a0f1a] via-black/20 to-transparent text-start"></div>
                
                {/* Back Button */}
                <button 
                    onClick={() => router.back()}
                    className={`absolute top-8 ${language === 'en' ? 'left-6' : 'right-6'} z-30 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all shadow-xl`}
                >
                    <ChevronLeft className={`w-6 h-6 ${language === 'en' ? '' : 'rotate-180'}`} />
                </button>

                {/* Actions - Top Right */}
                <div className={`absolute top-8 ${language === 'en' ? 'right-6' : 'left-6'} flex gap-3 z-30`}>
                    <button className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-xl">
                        <Star className="w-5 h-5" />
                    </button>
                    <button className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-xl">
                        <Award className="w-5 h-5" />
                    </button>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-12 inset-x-0 px-6 z-20">
                    <div className="max-w-7xl mx-auto flex flex-col items-start gap-2">
                        <motion.div
                            initial={{ opacity: 0, x: language === 'ar' ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2"
                        >
                            <span className="w-8 h-[2px] bg-primary"></span>
                            <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-[0.3em] drop-shadow-lg">
                                {language === 'ar' ? 'تحدي القوة' : 'STRENGTH CHALLENGE'}
                            </span>
                        </motion.div>
                            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic drop-shadow-2xl">
                                {content.title}
                            </h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8 relative z-10 max-w-6xl">
                <div className="bg-white dark:bg-[#1a2235]/60 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-premium border border-gray-100 dark:border-white/5 flex flex-col lg:flex-row gap-10">
                    <div className="lg:w-2/3 text-start">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{content.descTitle}</h2>
                        <p className="text-[11px] md:text-[13px] text-gray-600 dark:text-gray-400 font-bold leading-relaxed mb-8">
                            {content.description}
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 mb-10">
                            <div className="space-y-4">
                                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                                    <Trophy className="w-5 h-5 text-primary" />
                                    {content.benefitsTitle}
                                </h3>
                                {content.benefits.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-400 font-black text-[10px]">
                                        <div className="w-5 h-5 bg-gray-100 dark:bg-white/5 rounded-md flex items-center justify-center text-orange-500 flex-shrink-0 border border-gray-200 dark:border-white/5">
                                            <Shield className="w-2.5 h-2.5" />
                                        </div>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5">
                                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 tracking-tight">{content.scheduleTitle}</h3>
                                <div className="space-y-2">
                                    {content.schedule.map((sc, i) => (
                                        <div key={i} className="flex justify-between items-center bg-white dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                                            <span className="font-bold text-[10px] text-gray-500 dark:text-gray-400">{sc.day}</span>
                                            <span className="font-black text-xs text-orange-500">{sc.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <Link href="/booking" className="bg-primary text-white font-black px-10 py-3 rounded-xl shadow-xl shadow-primary/10 hover:bg-primary-dark transition-all text-center text-[11px] uppercase tracking-widest">
                                {content.bookNow}
                            </Link>
                        </div>
                    </div>

                    <div className="lg:w-1/3">
                        <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-3xl sticky top-32 border border-gray-100 dark:border-white/5">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-white dark:bg-white/5 rounded-2xl shadow-premium mx-auto flex items-center justify-center mb-4 text-orange-500 border border-gray-100 dark:border-white/5">
                                    <Zap className="w-8 h-8 fill-orange-500/20" />
                                </div>
                                <h4 className="text-base font-black text-slate-900 dark:text-white tracking-tight">{content.ratingTitle}</h4>
                                <p className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-widest">{content.ratingSub}</p>
                            </div>

                            <div className="space-y-4 font-black">
                                <div className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                                    <p className="text-gray-500 text-[8px] mb-1 uppercase tracking-widest">{content.equipmentTitle}</p>
                                    <p className="text-[11px] text-slate-900 dark:text-white">{content.equipment}</p>
                                </div>
                                <div className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                                    <p className="text-gray-500 text-[8px] mb-1 uppercase tracking-widest">{content.ageTitle}</p>
                                    <p className="text-[11px] text-slate-900 dark:text-white">{content.age}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* All Coaches for this sport */}
                <SportTrainers sportId="crossfit" sportName={content.title} />
            </div>
        </div>
    );
}
