"use client";
import { motion } from "framer-motion";
import { Star, Target, Zap, Clock, Shield, ChevronLeft, ChevronRight, Award, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { useRouter } from 'next/navigation';
import SportTrainers from "@/components/SportTrainers";

export default function BoxingPage() {
    const { t, language, darkMode } = useApp();
    const router = useRouter();
    const content = t('boxingContent');

    if (!content) return null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a] pb-20 transition-colors relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Decorative Blobs */}
            <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse`}></div>
            <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -z-0 -translate-x-1/2 translate-y-1/2`}></div>
            
            {/* Immersive Cover Image */}
            <div className="relative h-[30vh] md:h-[45vh] w-full overflow-hidden shadow-2xl">
                <img 
                    src={content.heroImg}
                    className="w-full h-full object-cover"
                    alt={content.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#0a0f1a] via-black/20 to-transparent"></div>
                
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
                                {language === 'ar' ? 'رياضة النخبة' : 'ELITE SPORT'}
                            </span>
                        </motion.div>
                            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic drop-shadow-2xl">
                                {content.title}
                            </h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8 relative z-10 max-w-6xl">
                {/* Info Card - Compact */}
                <div className="bg-white dark:bg-[#1a2235]/60 backdrop-blur-xl rounded-3xl p-5 md:p-8 border border-gray-100 dark:border-white/5 mb-6 shadow-premium">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <div>
                            <h1 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">{content.title}</h1>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{language === 'ar' ? 'نادي النخبة للملاكمة' : 'Boxing Elite Club, Riyadh'}</p>
                        </div>
                        <div className="text-start md:text-end">
                            <p className="text-2xl font-black text-primary tracking-tighter">$239<span className="text-[10px] text-gray-400 font-bold ml-1">/mo</span></p>
                            <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black rounded-lg mt-1 uppercase tracking-widest">{language === 'ar' ? 'قابلة للتعديل' : 'Negotiable'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 py-3 border-y border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-[10px] font-bold text-gray-400">{content.duration || "60 Min"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Target className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-[10px] font-bold text-gray-400">{content.intensity || "High Intensity"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-[10px] font-bold text-gray-400">4.9 (1.2k)</span>
                        </div>
                    </div>
                </div>

                {/* Description & Features - Compact */}
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6 text-start">
                        <div className="bg-white dark:bg-[#1a2235]/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-white/5 shadow-premium">
                            <h2 className="text-lg font-black text-slate-900 dark:text-white mb-3 tracking-tight">{content.descTitle}</h2>
                            <p className="text-[11px] md:text-[13px] text-gray-600 dark:text-gray-400 font-bold leading-relaxed">
                                {content.description}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-[#1a2235]/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-white/5 shadow-premium">
                            <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4 tracking-tight">{content.benefitsTitle}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {content.benefits.map((benefit, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                        <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                            <Shield className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-600 dark:text-gray-300">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-primary text-white rounded-3xl p-6 shadow-xl shadow-primary/10">
                            <h3 className="text-lg font-black mb-4 tracking-tight">{content.scheduleTitle}</h3>
                            <div className="space-y-2">
                                {content.schedule.map((sc, i) => (
                                    <div key={i} className="flex justify-between items-center bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                                        <span className="font-bold text-[10px]">{sc.day}</span>
                                        <span className="font-black text-xs">{sc.time}</span>
                                    </div>
                                ))}
                            </div>
                            <Link href="/booking" className="block w-full mt-6 bg-white text-primary text-center font-black py-3 rounded-xl shadow-lg active:scale-95 transition-all text-[11px] uppercase tracking-widest">
                                {content.bookNow}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* All Coaches for this sport */}
                <SportTrainers sportId="boxing" sportName={content.title} />

            </div>
        </div>
    );
}
