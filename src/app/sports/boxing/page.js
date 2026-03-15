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
        <div className="min-h-screen bg-[#0a0f1a] pb-32 transition-colors relative">
            {/* Hero Image - Compact */}
            <div className="relative h-[30vh] md:h-[40vh] overflow-hidden">
                <img 
                    src={content.heroImg}
                    className="w-full h-full object-cover opacity-70"
                    alt={content.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-transparent to-transparent"></div>
                
                {/* Back Button - Top Left */}
                <Link href="/sports" className="absolute top-4 left-4 w-8 h-8 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10 hover:bg-white/20 transition-all">
                    <ChevronLeft className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                </Link>

                {/* Actions - Top Right */}
                <div className="absolute top-4 right-4 flex gap-2">
                    <button className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10">
                        <Star className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10">
                        <Award className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8 relative z-10 max-w-6xl">
                {/* Info Card - Compact */}
                <div className="bg-[#1a2235]/60 backdrop-blur-xl rounded-3xl p-5 md:p-8 border border-white/5 mb-6 shadow-2xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <div>
                            <h1 className="text-xl md:text-3xl font-black text-white mb-1 tracking-tight">{content.title}</h1>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Boxing Elite Club, Newbridge</p>
                        </div>
                        <div className="text-start md:text-end">
                            <p className="text-2xl font-black text-primary tracking-tighter">$239<span className="text-[10px] text-gray-400 font-bold ml-1">/mo</span></p>
                            <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black rounded-lg mt-1 uppercase tracking-widest">Negotiable</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 py-3 border-y border-white/5">
                        <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-[10px] font-bold text-gray-400">60 Min</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Target className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-[10px] font-bold text-gray-400">High Intensity</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Award className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-[10px] font-bold text-gray-400">4.9 (1k+)</span>
                        </div>
                    </div>

                    {/* Compact Trainer Profile */}
                    <div className="mt-6 flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-primary/20">
                                <img src="https://images.unsplash.com/photo-1548690312-e3b507d17a47?q=80&w=200" alt="Trainer" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-white">Captain Ahmed</p>
                                <p className="text-[8px] font-bold text-gray-500 uppercase tracking-wider">Head Coach / Elite Trainer</p>
                            </div>
                        </div>
                        <button className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <Zap className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Description & Features - Compact */}
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6 text-start">
                        <div className="bg-[#1a2235]/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/5">
                            <h2 className="text-lg font-black text-white mb-3 tracking-tight">{content.descTitle}</h2>
                            <p className="text-[11px] md:text-[13px] text-gray-400 font-bold leading-relaxed">
                                {content.description}
                                <span className="text-primary font-black cursor-pointer ml-1">...read more</span>
                            </p>
                        </div>

                        <div className="bg-[#1a2235]/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/5">
                            <h2 className="text-lg font-black text-white mb-4 tracking-tight">{content.benefitsTitle}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {content.benefits.map((benefit, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                        <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                            <Shield className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-300">{benefit}</span>
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
