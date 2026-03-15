"use client";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Search, Star, MessageCircle, ChevronLeft, ChevronRight, 
    Crown, Filter, Users, Award, Trophy, GraduationCap, 
    UserCheck, Shield, HeartPulse, Baby, Dumbbell, 
    UserPlus, CheckCircle2, Heart, Medal, MapPin, 
    Briefcase, Calendar
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

    const topTrainers = allTrainersList.filter(t => t.premium);
    const allTrainers = allTrainersList.filter(t => !t.premium);

    const sportsList = [
        { id: 'karate', name: language === 'ar' ? 'كاراتيه' : 'Karate', count: 45, color: 'bg-red-100 text-red-600' },
        { id: 'taekwondo', name: language === 'ar' ? 'تايكوندو' : 'Taekwondo', count: 38, color: 'bg-blue-100 text-blue-600' },
        { id: 'boxing', name: language === 'ar' ? 'ملاكمة' : 'Boxing', count: 52, color: 'bg-orange-100 text-orange-600' },
        { id: 'kickbox', name: language === 'ar' ? 'كيك بوكس' : 'Kickbox', count: 41, color: 'bg-purple-100 text-purple-600' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] pb-32 transition-colors duration-500 overflow-x-hidden">
            {/* Premium Hero Section - Compacted */}
            <section className="relative pt-12 pb-8 px-6 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1E] dark:from-[#0f172a] dark:to-[#020617] -z-10"></div>
                {/* Decorative Elements */}
                <div className="absolute top-10 right-[-10%] w-[40%] h-[200px] bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
                <div className="absolute bottom-5 left-[-10%] w-[30%] h-[150px] bg-blue-500/10 rounded-full blur-[100px] -z-10"></div>

                <div className="max-w-7xl mx-auto text-start">
                    {/* Enhanced Search Bar - Now at the Top */}

                    {/* Enhanced Search Bar */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="mt-2 relative max-w-2xl group"
                    >
                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={language === 'ar' ? 'ابحث عن مدرب أو رياضة...' : 'Search for a trainer or sport...'}
                                className="w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 ps-14 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none text-white focus:text-gray-900 dark:focus:text-white font-bold text-lg shadow-2xl"
                            />
                            <Search className={`absolute ${language === 'en' ? 'left-6' : 'right-6'} w-6 h-6 text-gray-400 group-focus-within:text-primary transition-colors`} />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Quick Filters */}
            <section className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 py-4 px-4 overflow-x-auto no-scrollbar">
                <div className="max-w-7xl mx-auto flex items-center gap-3">
                    <button 
                        onClick={() => setSelectedSport('all')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-black transition-all ${selectedSport === 'all' ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}
                    >
                        <Filter className="w-4 h-4" />
                        {language === 'ar' ? 'الكل' : 'All'}
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-black bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 transition-all whitespace-nowrap">
                        <Star className="w-4 h-4 text-amber-500" />
                        {language === 'ar' ? 'الأعلى تقييمًا' : 'Top Rated'}
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-black bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 transition-all whitespace-nowrap">
                        <Trophy className="w-4 h-4 text-primary" />
                        {language === 'ar' ? 'الأكثر طلباً' : 'Most Popular'}
                    </button>
                </div>
            </section>

            {/* Content Container - Compact spacing */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Sports Horizontal Scroll */}
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-8 mb-8">
                    {sportsList.map((sport) => (
                        <button
                            key={sport.id}
                            className={`${sport.color} px-5 py-3 rounded-2xl text-sm font-black whitespace-nowrap hover:scale-105 transition-transform shadow-sm`}
                        >
                            {sport.name} ({sport.count})
                        </button>
                    ))}
                </div>

                {/* Unified Trainers List Section */}
                <div>
                     <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white">
                            {language === 'ar' ? 'فريق المدربين المعتمدين' : 'Our Certified Coaching Team'}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {allTrainersList.map((trainer, idx) => (
                            <motion.div
                                key={trainer.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className="group bg-white dark:bg-slate-800 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="flex flex-col sm:flex-row p-5 items-center sm:items-start gap-5">
                                    <div className="relative flex-shrink-0">
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-lg">
                                            <img src={trainer.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={trainer.name} />
                                        </div>
                                        {trainer.premium && (
                                            <div className="absolute -top-2 -right-2 bg-amber-500 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-lg">
                                                <Crown className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                        {trainer.online && (
                                            <div className="absolute -bottom-1 -left-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 shadow-md"></div>
                                        )}
                                    </div>

                                    <div className="flex-1 text-center sm:text-start">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors">{trainer.name}</h3>
                                                <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-1">
                                                    {trainer.specialties.map((s, i) => (
                                                        <span key={i} className="bg-primary/5 text-primary text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border border-primary/10">{s}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <button className="p-2 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-400 hover:text-rose-500 transition-colors hidden sm:block">
                                                <Heart className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-center sm:justify-start gap-4 mb-4">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                <span className="text-xs font-black text-gray-900 dark:text-white">{trainer.rating}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-400">
                                                <Users className="w-3.5 h-3.5" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">{trainer.students}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-400">
                                                <Medal className="w-3.5 h-3.5" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">{trainer.exp}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Link 
                                                href={`/trainers/${trainer.id}`}
                                                className="flex-1 bg-primary text-white py-2.5 rounded-xl font-black text-xs text-center shadow-lg shadow-primary/10 hover:brightness-110 transition-all uppercase tracking-widest"
                                            >
                                                {language === 'ar' ? 'الملف الشخصي' : 'View Profile'}
                                            </Link>
                                            <button className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-primary/10 hover:text-primary transition-all">
                                                <MessageCircle className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Section - Compact */}
            <section className="bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1E] dark:from-[#0f172a] dark:to-[#020617] py-12 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: UserCheck, val: "150+", label: language === 'ar' ? 'مدرب معتمد' : 'Certified Trainers' },
                            { icon: Star, val: "4.9", label: language === 'ar' ? 'متوسط التقييم' : 'Average Rating' },
                            { icon: Dumbbell, val: "12", label: language === 'ar' ? 'رياضة متاحة' : 'Sports Available' },
                            { icon: Users, val: "10K+", label: language === 'ar' ? 'متدرب سعيد' : 'Happy Trainees' }
                        ].map((stat, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 border border-white/10">
                                    <stat.icon className="w-8 h-8 text-primary" />
                                </div>
                                <div className="text-3xl font-black text-white mb-1 tracking-tight">{stat.val}</div>
                                <div className="text-white/40 text-[10px] font-black uppercase tracking-widest">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Specialized Sections - Cert info - Compact */}
            <section className="py-12 px-6 max-w-7xl mx-auto">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white text-center mb-10">
                    {language === 'ar' ? 'الشهادات والمؤهلات' : 'Certifications & Quality'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { icon: Award, title: language === 'ar' ? 'شهادات دولية' : 'International Certs', desc: language === 'ar' ? 'مدربون حاصلون على شهادات من اتحادات عالمية' : 'Coaches with certs from world federations.', color: 'from-rose-500/10 to-rose-600/5', iconColor: 'text-rose-500' },
                        { icon: GraduationCap, title: language === 'ar' ? 'تدريب أكاديمي' : 'Academic Training', desc: language === 'ar' ? 'خريجو أكاديميات رياضية متخصصة ومعتمدة' : 'Graduates of specialized sports academies.', color: 'from-blue-500/10 to-blue-600/5', iconColor: 'text-blue-500' },
                        { icon: Trophy, title: language === 'ar' ? 'إنجازات مميزة' : 'Top Achievements', desc: language === 'ar' ? 'حاملون لميداليات وبطولات محلية ودولية' : 'Medalists in local and global tournaments.', color: 'from-amber-500/10 to-amber-600/5', iconColor: 'text-amber-500' },
                        { icon: UserCheck, title: language === 'ar' ? 'تقييم مستمر' : 'Continuous Quality', desc: language === 'ar' ? 'نظام تقييم لضمان أعلى مستويات التدريب' : 'Rating system to ensure best coaching quality.', color: 'from-emerald-500/10 to-emerald-600/5', iconColor: 'text-emerald-500' }
                    ].map((item, i) => (
                        <div key={i} className={`p-8 rounded-[2.5rem] bg-gradient-to-br ${item.color} border border-white dark:border-white/5 text-start hover:scale-105 transition-transform duration-300`}>
                            <div className={`w-14 h-14 ${item.iconColor} bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-xl`}>
                                <item.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2 leading-tight">{item.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-bold leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section - Compact */}
            <section className="px-6 py-12 pb-24">
                <div className="max-w-4xl mx-auto rounded-[2rem] bg-gradient-to-br from-primary to-orange-600 p-8 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white opacity-[0.05] rounded-full -translate-y-1/2 translate-x-1/2 blur-[60px]"></div>
                    <div className="relative text-center">
                        <h2 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tight">
                            {language === 'ar' ? 'ابدأ رحلتك التدريبية الآن' : 'Start Your Journey Now'}
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="w-full sm:w-auto px-10 py-4 bg-white text-primary rounded-xl font-black text-base shadow-xl hover:scale-105 transition-all">
                                {language === 'ar' ? 'تصفح جميع المدربين' : 'Explore All Trainers'}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
