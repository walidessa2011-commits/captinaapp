"use client";
import { motion } from "framer-motion";
import { Star, Target, Zap, Clock, Shield, ChevronLeft, ChevronRight, Award, Dumbbell } from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";

export default function BodybuildingPage() {
    const { t, language, darkMode } = useApp();
    const content = t('bodybuildingContent');

    if (!content) return null;

    const textClass = "text-white";

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a] pb-20 transition-colors duration-500 overflow-hidden relative" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Decorations */}
            <div className={`absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[160px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse`}></div>
            
            {/* Immersive Header */}
            <header className="relative z-20 pt-16 pb-6 px-6">
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest opacity-50">
                        <Link href="/" className="hover:text-primary transition-colors">{language === 'ar' ? 'الرئيسية' : 'Home'}</Link>
                        <ChevronLeft className={`w-3 h-3 ${language === 'en' ? 'rotate-180' : ''}`} />
                        <Link href="/sports" className="hover:text-primary transition-colors">{language === 'ar' ? 'الرياضات' : 'Sports'}</Link>
                        <ChevronLeft className={`w-3 h-3 ${language === 'en' ? 'rotate-180' : ''}`} />
                        <span className="text-primary">{content.title}</span>
                    </div>

                    {/* Consolidated Title Line */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                        <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase text-center">
                            {language === 'ar' 
                                ? `( ${content.title} - كابتنية )` 
                                : `( ${content.title} - Captina )`}
                        </h1>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                    </div>
                </div>
            </header>

            {/* Hero Section - Compact */}
            <div className="relative h-[20vh] md:h-[25vh] overflow-hidden mx-4 md:mx-10 rounded-[2.5rem] border border-white/5">
                <img 
                    src={content.heroImg}
                    className="w-full h-full object-cover opacity-90 dark:opacity-60"
                    alt={content.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50/80 dark:from-[#0a0f1a] via-transparent to-transparent"></div>
                
                <div className={`absolute bottom-6 ${language === 'en' ? 'left-6 text-left' : 'right-6 text-right'} text-white`}>
                    <div className={`flex flex-wrap gap-2 mb-2 ${language === 'ar' ? 'justify-end' : 'justify-start'}`}>
                        {[
                            { icon: Clock, text: language === 'ar' ? '75 دقيقة' : '75 min', color: 'text-slate-400' },
                            { icon: Dumbbell, text: language === 'ar' ? 'بناء عضلي' : 'Muscle Building', color: 'text-slate-400' },
                            { icon: Zap, text: language === 'ar' ? '600 سعرة' : '600 kcal', color: 'text-slate-400' }
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/5">
                                <item.icon className={`w-3 h-3 ${item.color}`} />
                                <span className="text-[9px] font-black uppercase tracking-wider">{item.text}</span>
                            </div>
                        ))}
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
                                    <Award className="w-5 h-5 text-primary" />
                                    {content.benefitsTitle}
                                </h3>
                                {content.benefits.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-400 font-black text-[10px]">
                                        <div className="w-5 h-5 bg-gray-100 dark:bg-white/5 rounded-md flex items-center justify-center text-primary flex-shrink-0 border border-gray-200 dark:border-white/5">
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
                                            <span className="font-black text-xs text-slate-900 dark:text-white">{sc.time}</span>
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
                                <div className="w-16 h-16 bg-white dark:bg-white/5 rounded-2xl shadow-premium mx-auto flex items-center justify-center mb-4 text-primary border border-gray-100 dark:border-white/5">
                                    <Dumbbell className="w-8 h-8 fill-primary/20" />
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
            </div>
        </div>
    );
}
