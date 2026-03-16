"use client";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Star, MessageCircle, ChevronLeft, MapPin, 
    Calendar, Trophy, Award, GraduationCap, 
    Briefcase, ShieldCheck, Heart, Share2, 
    CheckCircle2, Clock, Users, Play, StarHalf,
    Dumbbell, Target, Zap, TrendingUp, Info, 
    Sparkles, ArrowLeft
} from 'lucide-react';
import { useApp } from "@/context/AppContext";
import Link from 'next/link';
import React, { use } from 'react';
import { trainersData } from '@/lib/trainersData';

const iconMap = {
    ShieldCheck, Dumbbell, Target, Zap, Trophy, Award, GraduationCap, Heart
};

export default function TrainerProfile({ params }) {
    const { t, language, darkMode } = useApp();
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    // Use specific trainer data or fallback to Ahmed
    const trainerInfo = trainersData[id] || trainersData['ahmed-hussaini'];

    const trainer = {
        name: trainerInfo.name[language],
        coverImage: trainerInfo.coverImage,
        profileImage: trainerInfo.profileImage,
        title: trainerInfo.title[language],
        specialty: trainerInfo.specialty[language],
        rating: trainerInfo.rating,
        reviewsCount: trainerInfo.reviewsCount,
        experience: trainerInfo.experience[language],
        location: trainerInfo.location[language],
        bio: trainerInfo.bio[language],
        stats: trainerInfo.stats.map(s => ({
            label: s.label[language],
            val: s.val
        })),
        achievements: trainerInfo.achievements.map(a => ({
            title: a.title[language],
            date: a.date
        })),
        certificates: trainerInfo.certificates.map(c => ({
            name: c.name[language],
            issuer: c.issuer
        })),
        specializations: trainerInfo.specializations.map((iconName, index) => ({
            id: index + 1,
            name: language === 'ar' ? trainerInfo.specialty[language].split(' - ')[index] || iconName : iconName,
            icon: iconMap[iconName] || Target
        })),
        reviews: trainerInfo.reviews.map(r => ({
            id: r.id,
            user: r.user[language],
            rating: r.rating,
            date: r.date[language],
            comment: r.comment[language]
        })),
        price: trainerInfo.price || 150
    };

    const textClass = darkMode ? "text-white" : "text-slate-900";

    return (
        <div className={`min-h-screen ${darkMode ? "bg-[#0a0f1a]" : "bg-slate-50"} pb-32 transition-colors duration-500 overflow-x-hidden relative`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Decorative Blobs */}
            <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${darkMode ? 'bg-primary/20' : 'bg-primary/10'} rounded-full blur-[120px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse`}></div>
            
            {/* Immersive Header */}
            <header className="relative z-20 pt-16 pb-6 px-6">
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    {/* Breadcrumbs */}
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest opacity-50"
                    >
                        <Link href="/" className="hover:text-primary transition-colors">{language === 'ar' ? 'الرئيسية' : 'Home'}</Link>
                        <span className="text-gray-500">
                            {language === 'ar' ? ' < ' : ' > '}
                        </span>
                        <Link href="/trainers" className="hover:text-primary transition-colors">{language === 'ar' ? 'المدربين' : 'Trainers'}</Link>
                        <span className="text-gray-500">
                            {language === 'ar' ? ' < ' : ' > '}
                        </span>
                        <span className="text-primary">{trainer.name}</span>
                    </motion.div>

                    {/* Consolidated Title Line */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3 mb-4"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                        <h1 className={`text-xl md:text-2xl font-black ${textClass} tracking-tighter italic uppercase text-center`}>
                            {language === 'ar' 
                                ? `( ${trainer.name} - ملف المدرب )` 
                                : `( ${trainer.name} - Expert Profile )`}
                        </h1>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                    </motion.div>
                </div>
            </header>

            {/* Banner Section - Compact */}
            <div className="relative h-[180px] md:h-[220px] w-full overflow-hidden mx-auto max-w-5xl rounded-[2.5rem] border border-white/5">
                <img src={trainer.coverImage} className="w-full h-full object-cover opacity-60" alt="Cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/40 to-transparent"></div>
            </div>

            {/* Profile Info Card - Overlapping */}
            <div className="max-w-4xl mx-auto px-6 -mt-16 md:-mt-20 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#1a2235]/40 backdrop-blur-3xl rounded-[2.5rem] p-6 lg:p-8 border border-white/10 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4">
                        <div className="flex items-center gap-1.5 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span className="text-sm font-black text-amber-500">{trainer.rating}</span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2rem] overflow-hidden border-4 border-white/10 relative z-10 shadow-2xl">
                                <img src={trainer.profileImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={trainer.name} />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-primary p-2 rounded-xl border-4 border-[#1a2235] z-20 flex items-center justify-center shadow-lg">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-start">
                            <div className="mb-4">
                                <div className="flex flex-col gap-1 mb-2">
                                    <h1 className="text-3xl font-black text-white tracking-tighter">{trainer.name}</h1>
                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                        <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">{trainer.title}</span>
                                        <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                                        <span className="text-[10px] font-bold text-gray-500">{trainer.location}</span>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-xs md:text-sm font-medium leading-relaxed max-w-2xl">
                                    {trainer.bio}
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-md">
                                {trainer.stats.map((s, i) => (
                                    <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 transition-all hover:bg-white/10">
                                        <div className="text-lg md:text-xl font-black text-white tracking-tighter mb-0.5">{s.val}</div>
                                        <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Specializations - Compact */}
                        <div className="bg-[#1a2235]/40 backdrop-blur-3xl rounded-[2.5rem] p-6 border border-white/5">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Target className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="text-lg font-black text-white tracking-tight uppercase">
                                    {language === 'ar' ? 'مجالات الخبرة' : 'Specializations'}
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {trainer.specializations.map((spec) => (
                                    <div key={spec.id} className="bg-white/5 border border-white/5 p-4 rounded-3xl text-center group hover:bg-primary/5 hover:border-primary/20 transition-all">
                                        <spec.icon className="w-6 h-6 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                                        <span className="text-[8px] font-black text-white/60 uppercase tracking-widest block group-hover:text-primary transition-colors">{spec.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Achievements & Certificates Horizontal Split */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-[#1a2235]/40 backdrop-blur-3xl rounded-[2.5rem] p-6 border border-white/5">
                                <div className="flex items-center gap-3 mb-6">
                                    <Trophy className="w-5 h-5 text-amber-500" />
                                    <h3 className="text-sm font-black text-white uppercase tracking-wider">{language === 'ar' ? 'أهم الإنجازات' : 'Achievements'}</h3>
                                </div>
                                <div className="space-y-4">
                                    {trainer.achievements.map((item, i) => (
                                        <div key={i} className="flex gap-3 items-center">
                                            <div className="w-8 h-8 bg-white/5 rounded-xl flex-shrink-0 flex items-center justify-center border border-white/5">
                                                <Award className="w-4 h-4 text-amber-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-white text-xs truncate leading-tight">{item.title}</h4>
                                                <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{item.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#1a2235]/40 backdrop-blur-3xl rounded-[2.5rem] p-6 border border-white/5">
                                <div className="flex items-center gap-3 mb-6">
                                    <GraduationCap className="w-5 h-5 text-blue-500" />
                                    <h3 className="text-sm font-black text-white uppercase tracking-wider">{language === 'ar' ? 'الشهادات' : 'Certificates'}</h3>
                                </div>
                                <div className="space-y-4">
                                    {trainer.certificates.map((cert, i) => (
                                        <div key={i} className="flex gap-3 items-center">
                                            <div className="w-8 h-8 bg-white/5 rounded-xl flex-shrink-0 flex items-center justify-center border border-white/5">
                                                <ShieldCheck className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-white text-xs truncate leading-tight">{cert.name}</h4>
                                                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">{cert.issuer}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Reviews - Compact */}
                        <div className="bg-[#1a2235]/40 backdrop-blur-3xl rounded-[2.5rem] p-6 border border-white/5">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-primary" />
                                    <h3 className="text-lg font-black text-white tracking-tight uppercase">{language === 'ar' ? 'آراء المتدربين' : 'Reviews'}</h3>
                                </div>
                                <button className="text-xs font-black text-primary uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-xl">
                                    {language === 'ar' ? 'الكل' : 'All'}
                                </button>
                            </div>
                            <div className="space-y-4">
                                {trainer.reviews.map((review) => (
                                    <div key={review.id} className="bg-white/5 border border-white/5 p-4 rounded-3xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-black text-[10px]">
                                                    {review.user.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-white text-[11px] leading-tight">{review.user}</h4>
                                                    <p className="text-[8px] text-gray-500 font-black">{review.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-2.5 h-2.5 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-white/10'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-400 text-xs leading-relaxed font-medium pl-11">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Booking CTA - Ultra Compact */}
                        <div className="bg-primary p-1 rounded-[2.5rem] relative group">
                            <div className="bg-[#1a2235] rounded-[2.4rem] p-6 relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="text-xl font-black text-white mb-1 tracking-tighter uppercase">{language === 'ar' ? 'احجز الآن' : 'Book Now'}</h3>
                                    <p className="text-[10px] font-bold text-gray-500 mb-6 leading-relaxed">
                                        {language === 'ar' ? 'ابدأ رحلة التغيير مع كابتن' : 'Start your transformation with Coach'} {trainer.name}
                                    </p>
                                    
                                    <div className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5 mb-6">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{language === 'ar' ? 'سعر الجلسة' : 'Price'}</span>
                                            <span className="text-xl font-black text-white tracking-tighter">{trainer.price} <span className="text-xs text-primary font-black">EGP</span></span>
                                        </div>
                                        <div className="flex items-center gap-1.5 p-2 bg-primary/10 rounded-xl">
                                            <Clock className="w-3.5 h-3.5 text-primary" />
                                            <span className="text-[10px] font-black text-primary">60m</span>
                                        </div>
                                    </div>

                                    <Link 
                                        href="/booking"
                                        className="block w-full py-4 bg-primary text-white text-center rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                    >
                                        {language === 'ar' ? 'حجز موعد' : 'Reserve Spot'}
                                    </Link>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="bg-[#1a2235]/40 backdrop-blur-3xl rounded-[2.5rem] p-6 border border-white/5">
                            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">{language === 'ar' ? 'المواعيد' : 'Availability'}</h3>
                            <div className="space-y-2">
                                {[
                                    { day: language === 'ar' ? 'السبت - الخميس' : 'Sat - Thu', time: '09:00 - 23:00', status: 'active' },
                                    { day: language === 'ar' ? 'الجمعة' : 'Friday', time: language === 'ar' ? 'مغلق' : 'Closed', status: 'closed' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                        <span className="text-[10px] font-black text-white/60">{item.day}</span>
                                        <span className={`text-[9px] font-black ${item.status === 'active' ? 'text-primary' : 'text-gray-600'}`}>{item.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-2">
                            <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-white/80 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                <MessageCircle className="w-4 h-4 text-primary" />
                                {language === 'ar' ? 'مراسلة' : 'Message'}
                            </button>
                            <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-white/80 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                                {language === 'ar' ? 'تطور' : 'Stats'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

