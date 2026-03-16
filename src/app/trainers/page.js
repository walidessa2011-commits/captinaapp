"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Star, MessageCircle, ChevronLeft, ChevronRight, 
    Crown, Filter, Users, Award, Trophy, GraduationCap, 
    UserCheck, Shield, HeartPulse, Baby, Dumbbell, 
    UserPlus, CheckCircle2, Heart, Medal, MapPin, 
    Briefcase, Calendar, ArrowLeft, Sparkles, Activity, Target, Zap, ArrowRight
} from 'lucide-react';
import { useApp } from "@/context/AppContext";
import Link from 'next/link';
import { trainersData } from '@/lib/trainersData';

export default function Trainers() {
    const { t, language, darkMode } = useApp();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSport, setSelectedSport] = useState("all");

    const allTrainersList = Object.entries(trainersData).map(([id, info]) => ({
        id,
        name: info.name[language],
        image: info.profileImage,
        specialties: info.specialty[language].split(' - '),
        rating: info.rating,
        students: parseInt(info.stats[0]?.val || "0"),
        exp: info.experience[language],
        bio: info.bio[language],
        premium: id === 'ahmed-hussaini' || id === 'mohammed-otaibi',
        online: true
    }));

    const sportsList = [
        { id: 'all', name: language === 'ar' ? 'الكل' : 'All', icon: <Activity className="w-4 h-4" /> },
        { id: 'karate', name: language === 'ar' ? 'كاراتيه' : 'Karate', icon: <Target className="w-4 h-4" /> },
        { id: 'taekwondo', name: language === 'ar' ? 'تايكوندو' : 'Taekwondo', icon: <Medal className="w-4 h-4" /> },
        { id: 'boxing', name: language === 'ar' ? 'ملاكمة' : 'Boxing', icon: <Award className="w-4 h-4" /> },
        { id: 'kickbox', name: language === 'ar' ? 'كيك بوكس' : 'Kickbox', icon: <Zap className="w-4 h-4" /> }
    ];

    const filteredTrainers = allTrainersList.filter(trainer => {
        const matchesSearch = trainer.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSport = selectedSport === "all" || trainer.specialties.some(s => s.toLowerCase().includes(selectedSport.toLowerCase()));
        return matchesSearch && matchesSport;
    });

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
                            {language === 'ar' ? 'المدربين' : 'Trainers'}
                        </span>
                    </motion.div>

                    <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
                        {/* Titling Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col gap-1"
                        >
                            <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                                {language === 'ar' ? 'نخبة المدربين' : 'Elite Trainers'}
                            </h1>
                            <div className="flex items-center gap-2">
                                <div className="h-1 w-12 bg-primary rounded-full"></div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest opacity-80">
                                    {language === 'ar' ? 'تدريب احترافي يصل بك للقمة' : 'Professional training taking you to the top'}
                                </p>
                            </div>
                        </motion.div>

                        {/* Search & Filter Component */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2 w-full md:w-auto"
                        >
                            <div className="relative flex-1 md:w-80 group">
                                <Search className={`absolute ${language === 'en' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors`} />
                                <input 
                                    type="text"
                                    placeholder={language === 'ar' ? 'ابحث عن بطلك...' : 'Search your hero...'}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-4 h-12 px-12 text-xs font-black text-slate-900 dark:text-white outline-none focus:border-primary transition-all placeholder:opacity-50"
                                />
                            </div>
                            <button className="h-12 w-12 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all active:scale-95">
                                <Filter className="w-5 h-5" />
                            </button>
                        </motion.div>
                    </div>

                    {/* Specialty Tabs */}
                    <div className="flex gap-2 mt-8 overflow-x-auto no-scrollbar py-2 w-full">
                        {sportsList.map((sport) => (
                            <button
                                key={sport.id}
                                onClick={() => setSelectedSport(sport.id)}
                                className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${
                                    selectedSport === sport.id 
                                    ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' 
                                    : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-transparent dark:border-white/5 hover:border-primary/30'
                                }`}
                            >
                                <span className={`${selectedSport === sport.id ? 'text-white' : 'text-primary'}`}>{sport.icon}</span>
                                {sport.name}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 mt-12 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredTrainers.map((trainer, idx) => (
                            <motion.div
                                key={trainer.id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group"
                            >
                                <Link href={`/trainers/${trainer.id}`}>
                                    <div className="relative bg-white/80 dark:bg-[#1a2235]/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-premium transition-all duration-500 hover:shadow-active hover:-translate-y-2 flex flex-col h-full active:scale-[0.98]">
                                        {/* Profile Media */}
                                        <div className="relative aspect-[4/5] overflow-hidden m-1.5 rounded-[2.2rem]">
                                            <img 
                                                src={trainer.image || `https://i.pravatar.cc/800?u=${trainer.id}`}
                                                alt={trainer.name}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                            
                                            {/* Top Icons */}
                                            <div className="absolute top-4 start-4 end-4 flex justify-between items-center">
                                                <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-black flex items-center gap-1.5 border border-white/30 shadow-lg">
                                                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                                    <span>{trainer.rating}</span>
                                                </div>
                                                {trainer.premium && (
                                                    <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-[0_4px_15px_rgba(255,0,0,0.4)]">
                                                        <Crown className="w-4 h-4 text-white" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Name & Specialty Over Image */}
                                            <div className="absolute bottom-6 start-6 end-6">
                                                <h3 className="text-xl font-black text-white tracking-tight leading-tight group-hover:text-primary transition-colors mb-1 truncate">
                                                    {trainer.name}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-1 w-4 bg-primary rounded-full"></div>
                                                    <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest truncate">
                                                        {trainer.specialties[0]}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Actions/Stats */}
                                        <div className="p-4 pt-1 flex items-center justify-between">
                                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 py-2 px-3 rounded-2xl border border-gray-100 dark:border-white/10 flex-1">
                                                <Users className="w-3.5 h-3.5 text-primary" />
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter leading-none">{language === 'ar' ? 'طلاب' : 'Students'}</span>
                                                    <span className="text-[11px] font-black text-slate-900 dark:text-white leading-none mt-0.5">{trainer.students}+</span>
                                                </div>
                                            </div>
                                            <div className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center ms-2 group-hover:bg-primary group-hover:text-white transition-all shadow-lg shadow-black/5">
                                                <ArrowRight className={`w-4 h-4 transition-transform ${language === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </main>

            {/* Empty State */}
            {filteredTrainers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-40 opacity-50">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest italic text-center">
                        {language === 'ar' ? 'لم يتم العثور على مدربين بهذا الاسم' : 'No coaches found with this name'}
                    </p>
                </div>
            )}
        </div>
    );
}
