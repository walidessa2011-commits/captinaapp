"use client";
import { motion } from "framer-motion";
import { Star, Target, Zap, Clock, Shield, ChevronLeft, ChevronRight, Award, Dumbbell } from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";

export default function BodybuildingPage() {
    const { t, language } = useApp();
    const content = t('bodybuildingContent');

    if (!content) return null;

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 pb-32 transition-colors">
            {/* Hero Image */}
            <div className="relative h-[40vh] md:h-[60vh] overflow-hidden">
                <img 
                    src={content.heroImg}
                    className="w-full h-full object-cover"
                    alt={content.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/99 via-black/40 to-transparent"></div>
                
                <Link href="/sports" className={`absolute top-6 ${language === 'en' ? 'left-6' : 'right-6'} bg-white/10 backdrop-blur-md p-3 rounded-2xl text-white border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2`}>
                    {language === 'ar' ? (
                        <>
                            <span className="font-black text-sm">{content.backText}</span>
                            <ChevronRight className="w-5 h-5" />
                        </>
                    ) : (
                        <>
                            <ChevronLeft className="w-5 h-5" />
                            <span className="font-black text-sm">{content.backText}</span>
                        </>
                    )}
                </Link>

                <div className={`absolute bottom-10 ${language === 'en' ? 'left-10 text-left' : 'right-10 text-right'} text-white`}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-5xl md:text-8xl font-black mb-4">{content.title}</h1>
                        <div className={`flex flex-wrap gap-4 mb-6 ${language === 'ar' ? 'justify-end' : 'justify-start'}`}>
                            {[
                                { icon: Clock, text: language === 'ar' ? '75 دقيقة' : '75 min', color: 'text-slate-400' },
                                { icon: Dumbbell, text: language === 'ar' ? 'بناء عضلي' : 'Muscle Building', color: 'text-slate-400' },
                                { icon: Zap, text: language === 'ar' ? '600 سعرة' : '600 kcal', color: 'text-slate-400' }
                            ].map((item, i) => (
                                <div key={i} className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10">
                                    <item.icon className={`w-4 h-4 ${item.color}`} />
                                    <span className="text-xs font-bold">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-10">
                <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-8 md:p-16 shadow-2xl border border-gray-50 dark:border-white/5 flex flex-col lg:flex-row gap-16">
                    <div className="lg:w-2/3 text-start">
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">{content.descTitle}</h2>
                        <p className="text-xl text-gray-500 dark:text-gray-400 font-bold leading-relaxed mb-10">
                            {content.description}
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                                    <Award className="w-7 h-7 text-primary" />
                                    {content.benefitsTitle}
                                </h3>
                                {content.benefits.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 text-gray-600 dark:text-gray-300 font-bold">
                                        <div className="w-6 h-6 bg-slate-500/10 rounded-full flex items-center justify-center text-slate-500 flex-shrink-0">
                                            <Shield className="w-3 h-3" />
                                        </div>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="bg-slate-50/30 dark:bg-white/5 p-8 rounded-[2.5rem]">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">{content.scheduleTitle}</h3>
                                <div className="space-y-4">
                                    {content.schedule.map((sc, i) => (
                                        <div key={i} className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                                            <span className="font-bold text-gray-500 dark:text-gray-400">{sc.day}</span>
                                            <span className="font-black text-slate-600">{sc.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <Link href="/booking" className="bg-primary text-white font-black px-12 py-5 rounded-2xl shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all text-center">
                                {content.bookNow}
                            </Link>
                        </div>
                    </div>

                    <div className="lg:w-1/3">
                        <div className="bg-slate-50/50 dark:bg-white/5 p-8 rounded-[3rem] sticky top-32 border border-slate-100 dark:border-white/5">
                            <div className="text-center mb-10">
                                <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl mx-auto flex items-center justify-center mb-6 text-slate-600">
                                    <Dumbbell className="w-12 h-12 fill-slate-600" />
                                </div>
                                <h4 className="text-xl font-black text-gray-900 dark:text-white">{content.ratingTitle}</h4>
                                <p className="text-sm font-bold text-gray-400 mt-2">{content.ratingSub}</p>
                            </div>

                            <div className="space-y-6 font-black">
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-white dark:border-white/5 shadow-sm">
                                    <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider">{content.equipmentTitle}</p>
                                    <p className="text-gray-900 dark:text-white">{content.equipment}</p>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-white dark:border-white/5 shadow-sm">
                                    <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider">{content.ageTitle}</p>
                                    <p className="text-gray-900 dark:text-white">{content.age}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
