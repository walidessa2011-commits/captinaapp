"use client";
import { motion } from "framer-motion";
import { Star, Target, Zap, Clock, Shield, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";

export default function KaratePage() {
    const { t, language } = useApp();
    const content = t('karateContent');

    if (!content) return null;

    return (
        <div className="min-h-screen bg-[#0a0f1a] pb-32 transition-colors relative">
            {/* Hero Image - Compact */}
            <div className="relative h-[25vh] md:h-[35vh] overflow-hidden">
                <img 
                    src={content.heroImg}
                    className="w-full h-full object-cover opacity-60"
                    alt={content.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-transparent to-transparent"></div>
                
                <Link href="/sports" className={`absolute top-4 ${language === 'en' ? 'left-4' : 'right-4'} bg-white/10 backdrop-blur-md p-2 rounded-xl text-white border border-white/10 hover:bg-white/20 transition-all flex items-center gap-2`}>
                    {language === 'ar' ? (
                        <>
                            <span className="font-black text-[10px] uppercase tracking-widest">{content.backText}</span>
                            <ChevronRight className="w-4 h-4" />
                        </>
                    ) : (
                        <>
                            <ChevronLeft className="w-4 h-4" />
                            <span className="font-black text-[10px] uppercase tracking-widest">{content.backText}</span>
                        </>
                    )}
                </Link>

                <div className={`absolute bottom-6 ${language === 'en' ? 'left-6 text-left' : 'right-6 text-right'} text-white`}>
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-2xl md:text-5xl font-black mb-3 tracking-tighter">{content.title}</h1>
                        <div className={`flex flex-wrap gap-2 mb-2 ${language === 'ar' ? 'justify-end' : 'justify-start'}`}>
                            {[
                                { icon: Clock, text: language === 'ar' ? '90 دقيقة' : '90 min', color: 'text-blue-300' },
                                { icon: Target, text: language === 'ar' ? 'تركيز وانضباط' : 'Focus & Discipline', color: 'text-blue-300' },
                                { icon: Zap, text: language === 'ar' ? '500 سعرة' : '500 kcal', color: 'text-blue-300' }
                            ].map((item, i) => (
                                <div key={i} className="bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/5">
                                    <item.icon className={`w-3 h-3 ${item.color}`} />
                                    <span className="text-[9px] font-black uppercase tracking-wider">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8 relative z-10 max-w-6xl">
                <div className="bg-[#1a2235]/60 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl border border-white/5 flex flex-col lg:flex-row gap-10">
                    <div className="lg:w-2/3 text-start">
                        <h2 className="text-xl font-black text-white mb-4 tracking-tight">{content.descTitle}</h2>
                        <p className="text-[11px] md:text-[13px] text-gray-400 font-bold leading-relaxed mb-8">
                            {content.description}
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 mb-10">
                            <div className="space-y-4">
                                <h3 className="text-lg font-black text-white flex items-center gap-2 tracking-tight">
                                    <Award className="w-5 h-5 text-primary" />
                                    {content.benefitsTitle}
                                </h3>
                                {content.benefits.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-gray-400 font-black text-[10px]">
                                        <div className="w-5 h-5 bg-white/5 rounded-md flex items-center justify-center text-blue-500 flex-shrink-0 border border-white/5">
                                            <Shield className="w-2.5 h-2.5" />
                                        </div>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                <h3 className="text-lg font-black text-white mb-4 tracking-tight">{content.scheduleTitle}</h3>
                                <div className="space-y-2">
                                    {content.schedule.map((sc, i) => (
                                        <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                            <span className="font-bold text-[10px] text-gray-400">{sc.day}</span>
                                            <span className="font-black text-xs text-blue-500">{sc.time}</span>
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
                        <div className="bg-white/5 p-6 rounded-3xl sticky top-32 border border-white/5">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-white/5 rounded-2xl shadow-xl mx-auto flex items-center justify-center mb-4 text-blue-500 border border-white/5">
                                    <Shield className="w-8 h-8" />
                                </div>
                                <h4 className="text-base font-black text-white tracking-tight">{content.ratingTitle}</h4>
                                <p className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-widest">{content.ratingSub}</p>
                            </div>

                            <div className="space-y-4 font-black">
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 shadow-sm">
                                    <p className="text-gray-500 text-[8px] mb-1 uppercase tracking-widest">{content.equipmentTitle}</p>
                                    <p className="text-[11px] text-white">{content.equipment}</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 shadow-sm">
                                    <p className="text-gray-500 text-[8px] mb-1 uppercase tracking-widest">{content.ageTitle}</p>
                                    <p className="text-[11px] text-white">{content.age}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
