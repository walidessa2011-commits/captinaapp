"use client";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Search, Star, MessageCircle, ChevronLeft, ChevronRight, 
    Crown, Filter, Users, Award, Trophy, GraduationCap, 
    UserCheck, Shield, HeartPulse, Baby, Dumbbell, 
    UserPlus, CheckCircle2, Heart, Medal, MapPin, 
    Briefcase, Calendar, ArrowLeft, Sparkles
} from 'lucide-react';
import { useApp } from "@/context/AppContext";
import Link from 'next/link';
import React, { useState } from 'react';

import { trainersData } from '@/lib/trainersData';

export default function Trainers() {
    const { t, language } = useApp();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSport, setSelectedSport] = useState("all");

    // Transform trainersData object into arrays for the UI
    const allTrainersList = Object.entries(trainersData).map(([id, info]) => ({
        id,
        name: info.name[language],
        image: info.profileImage,
        specialties: info.specialty[language].split(' - '),
        rating: info.rating,
        students: parseInt(info.stats[0].val),
        exp: info.experience[language],
        bio: info.bio[language],
        premium: id === 'ahmed-hussaini' || id === 'mohammed-otaibi',
        online: true
    }));

    const sportsList = [
        { id: 'karate', name: language === 'ar' ? 'كاراتيه' : 'Karate', count: 45, color: 'bg-red-500' },
        { id: 'taekwondo', name: language === 'ar' ? 'تايكوندو' : 'Taekwondo', count: 38, color: 'bg-blue-500' },
        { id: 'boxing', name: language === 'ar' ? 'ملاكمة' : 'Boxing', count: 52, color: 'bg-orange-500' },
        { id: 'kickbox', name: language === 'ar' ? 'كيك بوكس' : 'Kickbox', count: 41, color: 'bg-purple-500' }
    ];

    const filteredTrainers = allTrainersList.filter(trainer => {
        const matchesSearch = trainer.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSport = selectedSport === "all" || trainer.specialties.some(s => s.toLowerCase().includes(selectedSport.toLowerCase()));
        return matchesSearch && matchesSport;
    });

    return (
        <div className="min-h-screen bg-[#0a0f1a] pb-40 transition-colors duration-500 overflow-x-hidden relative">
            {/* Background Decorative Blobs */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] -z-0 -translate-x-1/2 translate-y-1/2"></div>

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
                            <span className="opacity-50 text-[10px] font-bold uppercase tracking-widest">{language === 'ar' ? 'المدربون' : 'Trainers'}</span>
                            <span className="w-1 h-1 rounded-full bg-white/20"></span>
                            <span className="text-primary">{language === 'ar' ? 'مدربو كابتينة' : 'Captina Trainers'}</span>
                        </h1>
                        <p className="text-gray-500 text-[8px] font-bold uppercase tracking-wider">
                            {language === 'ar' ? 'نخبة من أفضل المدربين في متناول يدك' : "Elite trainers at your fingertips"}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 flex-1 md:max-w-xs justify-end">
                        <div className="relative group flex-1 max-w-[160px]">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={language === 'ar' ? 'ابحث...' : 'Search...'}
                                className="w-full bg-[#1a2235]/60 backdrop-blur-3xl border border-white/5 rounded-lg py-1.5 px-3 ps-8 transition-all outline-none text-white font-bold text-[9px] text-start"
                            />
                            <Search className={`absolute ${language === 'en' ? 'left-2.5' : 'right-2.5'} top-1/2 -translate-y-1/2 w-3 h-3 text-white/40 group-focus-within:text-primary transition-colors`} />
                        </div>
                        <button className="p-2 bg-white/5 rounded-lg border border-white/5 text-gray-400 hover:text-primary transition-all active:scale-95">
                            <Filter className="w-3 h-3" />
                        </button>
                    </div>
                </motion.div>
            </section>

            <div className="max-w-7xl mx-auto px-4 mt-6 relative z-10">
                {/* Sports Mini Scroll - More Compact */}
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-6">
                    {sportsList.map((sport) => (
                        <button
                            key={sport.id}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-300 border ${sport.id === selectedSport ? 'bg-primary text-white border-primary shadow-sm' : 'bg-[#1a2235]/40 text-gray-500 border-white/5 hover:border-white/10'}`}
                            onClick={() => setSelectedSport(sport.id)}
                        >
                            <span className="text-xs">
                                {sport.id === 'boxing' ? '🥊' : sport.id === 'karate' ? '🥋' : sport.id === 'taekwondo' ? '🥋' : '💪'}
                            </span>
                            <span className="text-[8px] font-black uppercase tracking-wider">{sport.name}</span>
                        </button>
                    ))}
                </div>

                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-primary" />
                        <h2 className="text-[11px] font-black text-white tracking-[0.1em] uppercase">
                            {language === 'ar' ? 'فريقنا المعتمد' : 'Certified Team'}
                        </h2>
                    </div>
                </div>

                {/* Trainers Grid - Extreme Density */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                    {filteredTrainers.map((trainer, idx) => (
                        <motion.div
                            key={trainer.id}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            className="group bg-[#1a2235]/30 backdrop-blur-3xl rounded-xl overflow-hidden border border-white/5 shadow-sm hover:border-primary/20 transition-all duration-500 flex flex-col h-full"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden shrink-0">
                                <img src={trainer.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80" alt={trainer.name} />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-transparent to-transparent opacity-90"></div>
                                {trainer.premium && (
                                    <div className="absolute top-1.5 right-1.5 bg-amber-500/90 backdrop-blur-md p-1 rounded-sm shadow-xl border border-white/10">
                                        <Crown className="w-2 h-2 text-white" />
                                    </div>
                                )}
                                <div className="absolute bottom-1.5 left-2 right-2 flex justify-between items-end text-white">
                                    <div className="flex flex-col">
                                        <h3 className="text-[10px] font-black tracking-tight leading-tight line-clamp-1">{trainer.name}</h3>
                                        <div className="flex items-center gap-0.5 mt-0.5">
                                            <Star className="w-2 h-2 text-amber-500 fill-amber-500" />
                                            <span className="text-[7px] font-black">{trainer.rating}</span>
                                        </div>
                                    </div>
                                    <div className="w-5 h-5 bg-white/10 backdrop-blur-md rounded flex items-center justify-center border border-white/10 mb-0.5">
                                        <ChevronRight className={`w-3 h-3 ${language === 'ar' ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 p-2 flex flex-col justify-between">
                                <div className="space-y-2">
                                    <div className="flex flex-wrap gap-1">
                                        {trainer.specialties.slice(0, 2).map((s, i) => (
                                            <span key={i} className="text-[6px] font-black text-gray-500 uppercase tracking-widest px-1 py-0.5 bg-white/5 rounded-sm border border-white/5">{s}</span>
                                        ))}
                                    </div>
                                    
                                    <div className="flex items-center justify-between py-1 border-t border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-[5px] font-black text-gray-600 uppercase tracking-widest leading-none mb-0.5">{language === 'ar' ? 'الطلاب' : 'STUDENTS'}</span>
                                            <span className="text-[8px] font-black text-white">{trainer.students}</span>
                                        </div>
                                        <div className="flex flex-col text-end">
                                            <span className="text-[5px] font-black text-gray-600 uppercase tracking-widest leading-none mb-0.5">{language === 'ar' ? 'الخبرة' : 'EXP'}</span>
                                            <span className="text-[8px] font-black text-white">{trainer.exp}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 mt-2">
                                    <Link 
                                        href={`/trainers/${trainer.id}`}
                                        className="flex-1 bg-white text-[#0a0f1a] hover:bg-primary hover:text-white py-1 rounded-md font-black text-[7px] text-center shadow transition-all uppercase tracking-widest active:scale-95"
                                    >
                                        {language === 'ar' ? 'عرض الملف' : 'View Profile'}
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Stats Compact Grid - Reduced height and padding */}
            <section className="mt-20 py-10 px-6 bg-[#05080f]/50 border-y border-white/5">
                <div className="max-w-4xl mx-auto grid grid-cols-4 gap-4 text-center">
                    {[
                        { icon: UserCheck, val: "150+", label: language === 'ar' ? 'مدرب' : 'Coaches', color: 'text-blue-500' },
                        { icon: Star, val: "4.9", label: language === 'ar' ? 'تقييم' : 'Rating', color: 'text-amber-500' },
                        { icon: Dumbbell, val: "12", label: language === 'ar' ? 'رياضة' : 'Sports', color: 'text-primary' },
                        { icon: Users, val: "10K+", label: language === 'ar' ? 'متدرب' : 'Members', color: 'text-emerald-500' }
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <stat.icon className={`w-5 h-5 ${stat.color} mb-1.5`} />
                            <div className="text-xl font-black text-white tracking-tighter mb-0.5">{stat.val}</div>
                            <div className="text-[7px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Us Compact Section - Optimized into single line on desktop */}
            <section className="py-16 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { icon: Award, title: language === 'ar' ? 'شهادات دولية' : 'Global Certs', color: 'text-rose-500' },
                        { icon: GraduationCap, title: language === 'ar' ? 'خلفية أكاديمية' : 'Pro Background', color: 'text-blue-500' },
                        { icon: Trophy, title: language === 'ar' ? 'أبطال معتمدون' : 'Elite Medalists', color: 'text-amber-500' },
                        { icon: UserCheck, title: language === 'ar' ? 'تقييم دوري' : 'Strict Quality', color: 'text-emerald-500' }
                    ].map((item, i) => (
                        <div key={i} className="bg-[#1a2235]/40 backdrop-blur-3xl p-6 rounded-2xl border border-white/5 text-center group hover:bg-white/5 transition-all">
                            <div className={`w-10 h-10 ${item.color} bg-white/5 rounded-lg flex items-center justify-center mx-auto mb-3 border border-white/5 group-hover:scale-105 transition-transform`}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <h3 className="text-[9px] font-black text-white tracking-tight uppercase">{item.title}</h3>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
