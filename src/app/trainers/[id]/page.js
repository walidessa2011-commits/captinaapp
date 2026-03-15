"use client";
import { motion } from "framer-motion";
import { 
    Star, MessageCircle, ChevronLeft, MapPin, 
    Calendar, Trophy, Award, GraduationCap, 
    Briefcase, ShieldCheck, Heart, Share2, 
    CheckCircle2, Clock, Users, Play, StarHalf,
    Dumbbell, Target, Zap, TrendingUp, Info
} from 'lucide-react';
import { useApp } from "@/context/AppContext";
import Link from 'next/link';
import React, { use } from 'react';
import { trainersData } from '@/lib/trainersData';

const iconMap = {
    ShieldCheck, Dumbbell, Target, Zap, Trophy, Award, GraduationCap, Heart
};

export default function TrainerProfile({ params }) {
    const { t, language } = useApp();
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

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] pb-24 overflow-x-hidden">
            {/* Header / Banner Secion - Reduced Height */}
            <div className="relative h-[220px] w-full overflow-hidden">
                <img src={trainer.coverImage} className="w-full h-full object-cover" alt="Cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-[#0b1120]/20 to-transparent"></div>
                
                {/* Back Button */}
                <Link 
                    href="/trainers"
                    className="absolute top-4 left-4 w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10 z-20"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Link>

                <div className="absolute top-4 right-4 flex gap-2 z-20">
                    <button className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10">
                        <Share2 className="w-4 h-4" />
                    </button>
                    <button className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10">
                        <Heart className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Profile Info Card - Overlapping - Reduced Max Width and Negative Margin */}
            <div className="max-w-3xl mx-auto px-4 -mt-20 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-xl border border-gray-100 dark:border-white/5"
                >
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
                                <img src={trainer.profileImage} className="w-full h-full object-cover" alt={trainer.name} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-primary w-8 h-8 rounded-xl flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-md">
                                <Star className="w-4 h-4 text-white fill-white" />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-start">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                                <div>
                                    <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">{trainer.name}</h1>
                                    <p className="text-primary font-black uppercase tracking-[0.1em] text-[10px]">{trainer.title}</p>
                                </div>
                                <div className="flex items-center justify-center gap-2 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-lg">
                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                    <span className="text-base font-black text-gray-900 dark:text-white">{trainer.rating}</span>
                                    <span className="text-[10px] text-gray-400 font-bold">({trainer.reviewsCount})</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-500 dark:text-gray-400 mb-6">
                                <div className="flex items-center gap-1.5">
                                    <Briefcase className="w-3.5 h-3.5 text-primary" />
                                    <span className="text-xs font-bold">{trainer.experience} {language === 'ar' ? 'خبرة' : 'Exp'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-primary" />
                                    <span className="text-xs font-bold">{trainer.location}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                    <span className="text-xs font-bold uppercase tracking-wider">{language === 'ar' ? 'موثق' : 'Verified'}</span>
                                </div>
                            </div>

                            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed mb-6">
                                {trainer.bio}
                            </p>

                            <div className="grid grid-cols-3 gap-3">
                                {trainer.stats.map((s, i) => (
                                    <div key={i} className="bg-gray-50 dark:bg-white/5 p-3 rounded-xl text-center">
                                        <div className="text-lg font-black text-gray-900 dark:text-white">{s.val}</div>
                                        <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Sections - Reduced top margin and grid gap */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    {/* Left Column - Details */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Achievements */}
                        <section className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-lg">
                            <div className="flex items-center gap-2 mb-6">
                                <Trophy className="w-5 h-5 text-amber-500" />
                                <h3 className="text-lg font-black text-gray-900 dark:text-white">{language === 'ar' ? 'أهم الإنجازات' : 'Top Achievements'}</h3>
                            </div>
                            <div className="space-y-4">
                                {trainer.achievements.map((item, i) => (
                                    <div key={i} className="flex gap-3 group">
                                        <div className="w-8 h-8 bg-gray-50 dark:bg-white/5 rounded-lg flex-shrink-0 flex items-center justify-center">
                                            <Award className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight mb-0.5">{item.title}</h4>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{item.date}</p>
                                        </div>
                                    </div>
                                ))}
                                {trainer.achievements.length === 0 && (
                                    <p className="text-xs text-gray-400 italic">{language === 'ar' ? 'لا توجد إنجازات مسجلة حالياً' : 'No achievements recorded yet'}</p>
                                )}
                            </div>
                        </section>

                        {/* Certificates */}
                        <section className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-lg">
                            <div className="flex items-center gap-2 mb-6">
                                <GraduationCap className="w-5 h-5 text-blue-500" />
                                <h3 className="text-lg font-black text-gray-900 dark:text-white">{language === 'ar' ? 'الشهادات والاعتمادات' : 'Certs & Licenses'}</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {trainer.certificates.map((cert, i) => (
                                    <div key={i} className="p-4 border border-gray-50 dark:border-white/5 rounded-2xl bg-gray-50/50 dark:bg-white/5">
                                        <h4 className="font-bold text-gray-900 dark:text-white text-xs mb-1">{cert.name}</h4>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{cert.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Reviews Section */}
                        <section className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-lg">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-primary" />
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white">{language === 'ar' ? 'آراء المتدربين' : 'Trainee Reviews'}</h3>
                                </div>
                                <Link href="#" className="text-primary font-black text-[9px] uppercase tracking-widest hover:opacity-70">{language === 'ar' ? 'عرض الكل' : 'View All'}</Link>
                            </div>
                            
                            <div className="space-y-6">
                                {trainer.reviews.length > 0 ? trainer.reviews.map((review) => (
                                    <div key={review.id} className="border-b border-gray-50 dark:border-white/5 pb-4 last:border-0 last:pb-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-[10px]">
                                                    {review.user.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white text-xs">{review.user}</h4>
                                                    <p className="text-[8px] text-gray-400 font-bold">{review.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-2.5 h-2.5 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-200'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed font-medium">{review.comment}</p>
                                    </div>
                                )) : (
                                    <p className="text-xs text-gray-400 italic text-center py-4">{language === 'ar' ? 'لا توجد مراجعات حالياً' : 'No reviews yet'}</p>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Areas of Focus */}
                        <section className="bg-[#1A1A2E] dark:bg-[#0f172a] rounded-[2rem] p-6 text-white shadow-xl">
                            <h3 className="text-lg font-black mb-6">{language === 'ar' ? 'مجالات التركيز' : 'Areas of Focus'}</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {trainer.specializations.map((spec) => (
                                    <div key={spec.id} className="bg-white/5 border border-white/10 p-3 rounded-2xl text-center group">
                                        <spec.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                                        <span className="text-[8px] font-black uppercase tracking-widest leading-tight block">{spec.name}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Availability Bar */}
                        <section className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-lg">
                            <h3 className="text-base font-black text-gray-900 dark:text-white mb-4 leading-tight">{language === 'ar' ? 'التوقيتات المتاحة' : 'Availability'}</h3>
                            <div className="space-y-3">
                                {[
                                    { day: language === 'ar' ? 'السبت - الخميس' : 'Sat - Thu', time: '09:00 AM - 11:00 PM' },
                                    { day: language === 'ar' ? 'الجمعة' : 'Friday', time: language === 'ar' ? 'مغلق' : 'Closed' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                                        <span className="text-[10px] font-black text-gray-900 dark:text-white">{item.day}</span>
                                        <span className="text-[9px] font-bold text-primary">{item.time}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Quick Tips or Message */}
                        <div className="bg-primary/10 border-2 border-primary/20 p-6 rounded-[2rem] relative overflow-hidden group">
                            <h3 className="text-base font-black text-gray-900 dark:text-white mb-1 leading-tight">{language === 'ar' ? 'احجز حصة تجريبية' : 'Book a Trial'}</h3>
                            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{language === 'ar' ? 'هل تريد تجربة التمرين مع مدربنا قبل الالتزام؟ احجز أول حصة بخصم 50%.' : 'Want to try training with our coach before committing? Book your first session with 50% discount.'}</p>
                            <button className="w-full py-3 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg">
                                {language === 'ar' ? 'احجز الآن' : 'Book Now'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Action Bar - Reduced size */}
            <div className="fixed bottom-6 left-0 w-full px-4 z-50">
                <div className="max-w-3xl mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-3 rounded-[1.5rem] border border-white/20 shadow-2xl flex items-center justify-between gap-3">
                    <div className="hidden sm:block px-3">
                        <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{language === 'ar' ? 'سعر الجلسة' : 'Session Price'}</div>
                        <div className="text-xl font-black text-gray-900 dark:text-white">{trainer.price} <span className="text-xs text-primary">EGP</span></div>
                    </div>
                    
                    <div className="flex-1 flex gap-2">
                        <button className="w-12 h-12 bg-gray-100 dark:bg-white/5 text-gray-400 rounded-xl flex items-center justify-center">
                             <MessageCircle className="w-5 h-5" />
                        </button>
                        <Link 
                            href="/booking"
                            className="flex-1 py-3 bg-primary text-white rounded-xl font-black text-xs text-center shadow-xl hover:brightness-110 active:scale-95 transition-all outline-none"
                        >
                            {language === 'ar' ? 'احجز موعد مع الكابتن' : 'Book a Session'}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
