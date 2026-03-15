"use client";
import { motion } from "framer-motion";
import { Star, Target, Zap, Clock, Shield, ChevronLeft, ChevronRight, Award, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";

export default function BoxingPage() {
    const { t, language } = useApp();
    const content = t('boxingContent');

    if (!content) return null;

    return (
        <div className="min-h-screen bg-background pb-32 transition-colors">
            {/* Hero Image - Matching Design */}
            <div className="relative h-[45vh] md:h-[65vh] overflow-hidden">
                <img 
                    src={content.heroImg}
                    className="w-full h-full object-cover"
                    alt={content.title}
                />
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* Back Button - Top Left */}
                <Link href="/sports" className="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/40 transition-all">
                    <ChevronLeft className="w-6 h-6" />
                </Link>

                {/* Actions - Top Right */}
                <div className="absolute top-6 right-6 flex gap-2">
                    <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20">
                        <Star className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20">
                        <Award className="w-5 h-5" />
                    </button>
                </div>

                {/* View All Photo Button - Bottom Right of Image */}
                <button className="absolute bottom-6 right-6 px-4 py-2 bg-black/40 backdrop-blur-md rounded-xl text-white text-xs font-bold flex items-center gap-2 border border-white/10">
                    <Zap className="w-4 h-4" />
                    {language === 'ar' ? 'عرض الكل' : 'View All Photos'}
                </button>
            </div>

            <div className="container mx-auto px-4 -mt-12 relative z-10">
                {/* Info Card - Matching Design */}
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 md:p-10 premium-shadow border border-gray-100 dark:border-white/5 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">{content.title}</h1>
                            <p className="text-sm font-bold text-gray-400">Boxing Elite Club, Newbridge</p>
                        </div>
                        <div className="text-start md:text-end">
                            <p className="text-2xl md:text-3xl font-black text-primary">$239<span className="text-xs text-gray-400">/mo</span></p>
                            <span className="inline-block px-3 py-1 bg-primary-light text-primary text-[10px] font-black rounded-full mt-1">Negotiable</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 py-4 border-y border-gray-50 dark:border-white/5">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">60 Min</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">High Intensity</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">4.9 (1k+)</span>
                        </div>
                    </div>

                    {/* Trainer Profile (Agent Style) - Matching Design */}
                    <div className="mt-8 flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-3xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                                <img src="https://images.unsplash.com/photo-1548690312-e3b507d17a47?q=80&w=200" alt="Trainer" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-gray-900 dark:text-white">Captain Ahmed</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Head Coach / Elite Trainer</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <Zap className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Description & Features */}
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8 text-start">
                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-10 border border-gray-100 dark:border-white/5">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4">{content.descTitle}</h2>
                            <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed">
                                {content.description}
                                <span className="text-primary font-bold cursor-pointer ml-1">...read more</span>
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-10 border border-gray-100 dark:border-white/5">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6">{content.benefitsTitle}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {content.benefits.map((benefit, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                            <Shield className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-primary text-white rounded-[2.5rem] p-8 shadow-xl shadow-primary/20">
                            <h3 className="text-xl font-black mb-6">{content.scheduleTitle}</h3>
                            <div className="space-y-3">
                                {content.schedule.map((sc, i) => (
                                    <div key={i} className="flex justify-between items-center bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                                        <span className="font-bold text-xs">{sc.day}</span>
                                        <span className="font-black text-sm">{sc.time}</span>
                                    </div>
                                ))}
                            </div>
                            <Link href="/booking" className="block w-full mt-8 bg-white text-primary text-center font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all">
                                {content.bookNow}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AwardIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
      <circle cx="12" cy="8" r="6" />
    </svg>
  )
}
