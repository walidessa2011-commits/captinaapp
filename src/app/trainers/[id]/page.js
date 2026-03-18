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
import { useRouter } from 'next/navigation';
import React, { use, useState, useEffect } from 'react';
import { trainersData } from '@/lib/trainersData';
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const iconMap = {
    ShieldCheck, Dumbbell, Target, Zap, Trophy, Award, GraduationCap, Heart
};

export default function TrainerProfile({ params }) {
    const { t, language, darkMode, setAlert } = useApp();
    const router = useRouter();
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const [dbTrainer, setDbTrainer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTrainer = async () => {
            try {
                const docRef = doc(db, "trainers", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setDbTrainer(docSnap.data());
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTrainer();
    }, [id]);

    // Use specific trainer data or fallback to Ahmed
    const trainerInfo = trainersData[id] || trainersData['ahmed-hussaini'];

    // If dbTrainer exists, replace static data fields with real DB fields
    const trainer = dbTrainer ? {
        name: dbTrainer.name,
        coverImage: dbTrainer.image || dbTrainer.coverImage || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800",
        profileImage: dbTrainer.image || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200",
        title: language === 'ar' ? 'مدرب محترف' : 'Professional Trainer',
        specialty: dbTrainer.specialty,
        rating: dbTrainer.rating || 5.0,
        reviewsCount: Math.floor(Math.random() * 100) + 10,
        experience: `${dbTrainer.experience} ${language === 'ar' ? 'سنوات' : 'Years'}`,
        location: dbTrainer.location || (language === 'ar' ? 'عن بعد' : 'Online'),
        bio: dbTrainer.bio || (language === 'ar' ? 'هذا المدرب لم يضف نبذة تعريفية.' : 'This trainer has not added a bio.'),
        stats: [
            { label: language === 'ar' ? 'تدريباً' : 'SESSIONS', val: '250+' },
            { label: language === 'ar' ? 'سنوات القوة' : 'YEARS EXP.', val: dbTrainer.experience?.toString() || '1' },
            { label: language === 'ar' ? 'تقييم عام' : 'RATING', val: dbTrainer.rating?.toString() || '5.0' },
        ],
        achievements: trainerInfo.achievements.map(a => ({
            title: a.title[language],
            date: a.date
        })),
        certificates: trainerInfo.certificates.map(c => ({
            name: c.name[language],
            issuer: c.issuer
        })),
        specializations: (dbTrainer.specialty || "").split('-').map((sName, index) => ({
            id: index + 1,
            name: sName.trim(),
            icon: Target
        })),
        reviews: trainerInfo.reviews.map(r => ({
            id: r.id,
            user: r.user[language],
            rating: r.rating,
            date: r.date[language],
            comment: r.comment[language]
        })),
        price: dbTrainer.price || 150
    } : {
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

    if (isLoading && !trainersData[id]) {
        return (
            <div className={`min-h-screen ${darkMode ? "bg-[#0a0f1a]" : "bg-slate-50"} flex items-center justify-center`}>
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const handleShare = () => {
        const shareData = {
            title: trainer.name,
            text: language === 'ar' ? `شاهد الملف الشخصي للمدرب ${trainer.name} على كابتينا!` : `Check out ${trainer.name}'s profile on Captina!`,
            url: window.location.href,
        };

        if (navigator.share) {
            navigator.share(shareData).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            if (setAlert) {
                setAlert({
                    title: language === 'ar' ? 'تم النسخ!' : 'Copied!',
                    message: language === 'ar' ? 'تم نسخ رابط الملف الشخصي' : 'Profile link copied to clipboard',
                    type: 'success'
                });
            }
        }
    };

    return (
        <div className={`min-h-screen ${darkMode ? "bg-[#0a0f1a]" : "bg-slate-50"} pb-32 transition-colors duration-500 overflow-x-hidden relative`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Decorative Blobs */}
            <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${darkMode ? 'bg-primary/20' : 'bg-primary/10'} rounded-full blur-[120px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse`}></div>
            
            {/* Immersive Cover Image */}
            <div className="relative h-[35vh] md:h-[50vh] w-full overflow-hidden">
                <img 
                    src={trainer.coverImage} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                    alt="Cover" 
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#0a0f1a] via-black/20 to-transparent`}></div>
                
                {/* Back Button */}
                <button 
                    onClick={() => router.back()}
                    className={`absolute top-8 ${language === 'en' ? 'left-6' : 'right-6'} z-30 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all shadow-xl`}
                >
                    <ChevronLeft className={`w-6 h-6 ${language === 'en' ? '' : 'rotate-180'}`} />
                </button>

                {/* Top Actions */}
                <div className={`absolute top-8 ${language === 'en' ? 'right-6' : 'left-6'} flex gap-3 z-30`}>
                    <button 
                        onClick={handleShare}
                        className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all shadow-xl"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all shadow-xl">
                        <Heart className="w-5 h-5" />
                    </button>
                </div>

                {/* Title Overlay (Hidden on Mobile to avoid redundancy with card) */}
                <div className="absolute bottom-32 inset-x-0 px-6 z-20 hidden md:block">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, x: language === 'ar' ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 mb-2"
                        >
                            <span className="w-8 h-[2px] bg-primary"></span>
                            <span className="text-xs font-black text-white uppercase tracking-[0.3em] drop-shadow-lg">
                                {language === 'ar' ? 'مدرب معتمد' : 'CERTIFIED TRAINER'}
                            </span>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Profile Info Card - Premium Overlap */}
            <div className="max-w-5xl mx-auto px-6 -mt-24 md:-mt-32 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${darkMode ? 'bg-[#0f172a]/80 border-white/10' : 'bg-white/90 border-slate-200'} backdrop-blur-2xl rounded-[3rem] p-8 lg:p-10 border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] relative overflow-hidden group`}
                >
                    {/* Decorative Background Glows */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all duration-700"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/5 rounded-full blur-[80px]"></div>
                    
                    {/* Decorative Accent */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
                    <div className="absolute top-0 right-0 p-4">
                        <div className="flex items-center gap-1.5 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span className="text-sm font-black text-amber-500">{trainer.rating}</span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className={`w-28 h-28 md:w-36 md:h-36 rounded-[2rem] overflow-hidden border-4 ${darkMode ? 'border-white/10' : 'border-white'} relative z-10 shadow-2xl`}>
                                <img src={trainer.profileImage} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={trainer.name} />
                            </div>
                            <div className={`absolute -bottom-2 -right-2 bg-primary p-2 rounded-xl border-4 ${darkMode ? 'border-[#1a2235]' : 'border-white'} z-20 flex items-center justify-center shadow-lg`}>
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-start">
                            <div className="mb-4">
                                <div className="flex flex-col gap-1 mb-2">
                                    <h1 className={`text-3xl font-black ${textClass} tracking-tighter`}>{trainer.name}</h1>
                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                        <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">{trainer.title}</span>
                                        <div className={`w-1 h-1 ${darkMode ? 'bg-white/20' : 'bg-slate-300'} rounded-full`}></div>
                                        <span className="text-[10px] font-bold text-gray-500">{trainer.location}</span>
                                    </div>
                                </div>
                                <p className={`${darkMode ? 'text-gray-400' : 'text-slate-600'} text-xs md:text-sm font-medium leading-relaxed max-w-2xl`}>
                                    {trainer.bio}
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-md">
                                {trainer.stats.map((s, i) => (
                                    <div key={i} className={`${darkMode ? 'bg-white/[0.03] border-white/[0.05]' : 'bg-slate-50 border-slate-100'} border rounded-[1.5rem] p-4 transition-all hover:bg-primary/10 hover:border-primary/20 group/stat shadow-sm`}>
                                        <div className={`text-xl md:text-2xl font-black ${textClass} tracking-tighter mb-0.5 group-hover/stat:scale-110 transition-transform`}>{s.val}</div>
                                        <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest group-hover/stat:text-primary transition-colors">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Specializations - Premium Grid */}
                        <div className={`${darkMode ? 'bg-[#0f172a]/60 border-white/5' : 'bg-white border-slate-200'} backdrop-blur-xl rounded-[2.5rem] p-8 border shadow-xl relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px]"></div>
                            <div className="flex items-center gap-4 mb-8 relative z-10">
                                <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                                    <Target className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className={`text-xl font-black ${textClass} tracking-tight uppercase`}>
                                        {language === 'ar' ? 'مجالات الخبرة' : 'Specializations'}
                                    </h3>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{language === 'ar' ? 'المهارات والاحترافية' : 'Skills & Professionalism'}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
                                {trainer.specializations.map((spec) => (
                                    <div key={spec.id} className={`${darkMode ? 'bg-white/[0.03] border-white/[0.05]' : 'bg-slate-50 border-slate-100'} border p-5 rounded-[2rem] text-center group hover:bg-primary/10 hover:border-primary/30 transition-all hover:-translate-y-1 shadow-sm`}>
                                        <div className={`w-12 h-12 mx-auto mb-3 ${darkMode ? 'bg-white/5' : 'bg-white shadow-sm'} rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-all`}>
                                            <spec.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                                        </div>
                                        <span className={`text-[9px] font-black ${darkMode ? 'text-white/80' : 'text-slate-700'} uppercase tracking-widest block group-hover:text-primary transition-colors`}>{spec.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Achievements & Certificates - Coordinated Colors */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className={`${darkMode ? 'bg-[#0f172a]/60 border-white/5' : 'bg-white border-slate-200'} backdrop-blur-xl rounded-[2.5rem] p-8 border shadow-xl relative overflow-hidden`}>
                                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-[40px]"></div>
                                <div className="flex items-center gap-4 mb-8 relative z-10">
                                    <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                                        <Trophy className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <h3 className={`text-sm font-black ${textClass} uppercase tracking-wider`}>{language === 'ar' ? 'أهم الإنجازات' : 'Achievements'}</h3>
                                </div>
                                <div className="space-y-6 relative z-10">
                                    {trainer.achievements.map((item, i) => (
                                        <div key={i} className="flex gap-4 items-center group/item cursor-default">
                                            <div className="w-10 h-10 bg-amber-500/5 rounded-2xl flex-shrink-0 flex items-center justify-center border border-amber-500/10 group-hover/item:bg-amber-500/20 transition-all">
                                                <Award className="w-5 h-5 text-amber-500 group-hover/item:scale-110 transition-transform" />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className={`font-black ${textClass} text-xs truncate leading-tight group-hover/item:text-amber-500 transition-colors`}>{item.title}</h4>
                                                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{item.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={`${darkMode ? 'bg-[#0f172a]/60 border-white/5' : 'bg-white border-slate-200'} backdrop-blur-xl rounded-[2.5rem] p-8 border shadow-xl relative overflow-hidden`}>
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-[40px]"></div>
                                <div className="flex items-center gap-4 mb-8 relative z-10">
                                    <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                        <GraduationCap className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <h3 className={`text-sm font-black ${textClass} uppercase tracking-wider`}>{language === 'ar' ? 'الشهادات المعتمدة' : 'Official Certificates'}</h3>
                                </div>
                                <div className="space-y-6 relative z-10">
                                    {trainer.certificates.map((cert, i) => (
                                        <div key={i} className="flex gap-4 items-center group/item cursor-default">
                                            <div className="w-10 h-10 bg-blue-500/5 rounded-2xl flex-shrink-0 flex items-center justify-center border border-blue-500/10 group-hover/item:bg-blue-500/20 transition-all">
                                                <ShieldCheck className="w-5 h-5 text-blue-500 group-hover/item:scale-110 transition-transform" />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className={`font-black ${textClass} text-xs truncate leading-tight group-hover/item:text-blue-500 transition-colors`}>{cert.name}</h4>
                                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{cert.issuer}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section - Modern Styling */}
                        <div className={`${darkMode ? 'bg-[#0f172a]/60 border-white/5' : 'bg-white border-slate-200'} backdrop-blur-xl rounded-[2.5rem] p-8 border shadow-xl relative overflow-hidden`}>
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px]"></div>
                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                                        <Users className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className={`text-xl font-black ${textClass} tracking-tight uppercase`}>{language === 'ar' ? 'آراء المتدربين' : 'Reviews'}</h3>
                                </div>
                                <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/10 px-6 py-2.5 rounded-xl border border-primary/20 hover:bg-primary hover:text-white transition-all">
                                    {language === 'ar' ? 'عرض الكل' : 'View All'}
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                                {trainer.reviews.map((review) => (
                                    <div key={review.id} className={`${darkMode ? 'bg-white/[0.02] border-white/[0.05]' : 'bg-slate-50 border-slate-100'} border p-6 rounded-[2rem] hover:bg-white/[0.05] transition-all group/rev shadow-inner`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-[1.2rem] bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary/20">
                                                    {review.user.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className={`font-black ${textClass} text-[12px] leading-tight`}>{review.user}</h4>
                                                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{review.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-white/10'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className={`${darkMode ? 'text-gray-400' : 'text-slate-600'} text-xs leading-relaxed font-medium line-clamp-3 italic opacity-80 group-hover/rev:opacity-100 transition-opacity`}>"{review.comment}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Booking CTA - Ultra Premium */}
                        <div className="bg-gradient-to-br from-primary to-emerald-600 p-[1px] rounded-[3rem] shadow-2xl shadow-primary/20">
                            <div className={`${darkMode ? 'bg-[#0f172a]' : 'bg-white'} rounded-[2.95rem] p-8 relative overflow-hidden group`}>
                                <div className="relative z-10 text-center">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 mb-4">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{language === 'ar' ? 'متاح الآن' : 'Available Now'}</span>
                                    </div>
                                    <h3 className={`text-2xl font-black ${textClass} mb-2 tracking-tighter uppercase`}>{language === 'ar' ? 'احجز جلستك' : 'Book Session'}</h3>
                                    <p className="text-xs font-bold text-gray-500 mb-8 leading-relaxed">
                                        {language === 'ar' ? 'ابدأ رحلة التغيير الاحترافية مع' : 'Start your pro transformation with'} {trainer.name}
                                    </p>
                                    
                                    <div className={`${darkMode ? 'bg-white/5' : 'bg-slate-50'} backdrop-blur-md p-5 rounded-[2rem] border ${darkMode ? 'border-white/5' : 'border-slate-100'} mb-8 group-hover:bg-white/10 transition-all`}>
                                        <div className="flex items-center justify-between">
                                            <div className="text-start">
                                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{language === 'ar' ? 'سعر الجلسة' : 'Hourly Rate'}</span>
                                                <div className="flex items-baseline gap-1">
                                                    <span className={`text-2xl font-black ${textClass} tracking-tighter`}>{trainer.price}</span>
                                                    <span className="text-[10px] text-primary font-black uppercase">EGP</span>
                                                </div>
                                            </div>
                                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                                                <Clock className="w-6 h-6 text-primary" />
                                            </div>
                                        </div>
                                    </div>

                                    <Link 
                                        href="/booking"
                                        className="block w-full py-5 bg-primary text-white text-center rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-primary/30 hover:scale-[1.02] hover:shadow-primary/50 active:scale-95 transition-all"
                                    >
                                        {language === 'ar' ? 'احجز الموعد' : 'Reserve Spot'}
                                    </Link>
                                </div>
                                {/* Animated background accent */}
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-[60px] group-hover:bg-primary/20 transition-all duration-700"></div>
                            </div>
                        </div>

                        {/* Availability - Glass Styled */}
                        <div className={`${darkMode ? 'bg-[#111827]/60 border-white/5' : 'bg-white border-slate-200'} backdrop-blur-xl rounded-[2.5rem] p-8 border shadow-xl`}>
                            <div className="flex items-center gap-3 mb-6">
                                <Calendar className="w-5 h-5 text-indigo-400" />
                                <h3 className={`text-sm font-black ${textClass} uppercase tracking-wider`}>{language === 'ar' ? 'جدول المواعيد' : 'Availability'}</h3>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { day: language === 'ar' ? 'من السبت للأحد' : 'Sat to Thu', time: '09:00 - 23:00', status: 'active' },
                                    { day: language === 'ar' ? 'يوم الجمعة' : 'Friday', time: language === 'ar' ? 'مغلق' : 'Closed', status: 'closed' }
                                ].map((item, i) => (
                                    <div key={i} className={`flex items-center justify-between p-4 ${darkMode ? 'bg-white/[0.03] border-white/[0.05]' : 'bg-slate-50 border-slate-100'} border rounded-2xl hover:bg-white/[0.06] transition-colors shadow-sm`}>
                                        <span className={`text-[11px] font-black ${darkMode ? 'text-white/60' : 'text-slate-500'} tracking-tight`}>{item.day}</span>
                                        <span className={`text-[10px] font-black ${item.status === 'active' ? 'text-primary' : 'text-gray-500'}`}>{item.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Interactive Actions */}
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => router.push(`/trainers/${id}/chat`)}
                                className={`py-5 ${darkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-slate-200 shadow-sm'} border rounded-[2rem] ${darkMode ? 'text-white/80' : 'text-slate-700'} font-black text-[10px] uppercase tracking-widest hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-all flex items-center justify-center gap-2 group`}
                            >
                                <MessageCircle className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                                {language === 'ar' ? 'تواصل' : 'Chat'}
                            </button>
                            <button 
                                onClick={handleShare}
                                className={`py-5 ${darkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-slate-200 shadow-sm'} border rounded-[2rem] ${darkMode ? 'text-white/80' : 'text-slate-700'} font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500/10 hover:border-emerald-500/20 hover:text-emerald-500 transition-all flex items-center justify-center gap-2 group`}
                            >
                                <Share2 className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                                {language === 'ar' ? 'مشاركة' : 'Share'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

