"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
    Star, MessageCircle, ChevronLeft, ChevronRight,
    Calendar, Trophy, Award, GraduationCap,
    ShieldCheck, Heart, Share2,
    Users, Target, Dumbbell,
    Sparkles, Clock, MapPin, Zap, CheckCircle2,
    Info, Play
} from 'lucide-react';
import { useApp } from "@/context/AppContext";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { trainersData } from '@/lib/trainersData';
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const TABS = [
    { id: 'about', icon: Info },
    { id: 'achievements', icon: Trophy },
    { id: 'reviews', icon: Star },
];

export default function TrainerProfileContent({ trainerId }) {
    const { t, language, darkMode, setAlert, getText } = useApp();
    const router = useRouter();
    const ar = language === 'ar';
    const id = trainerId;

    const [dbTrainer, setDbTrainer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('about');

    const bg = darkMode ? "bg-[#0a0f1a]" : "bg-slate-50";
    const card = darkMode ? "bg-white/5 border-white/8" : "bg-white border-gray-100 shadow-sm";
    const textC = darkMode ? "text-white" : "text-slate-900";
    const muted = darkMode ? "text-gray-400" : "text-gray-500";

    useEffect(() => {
        getDoc(doc(db, "trainers", id))
            .then(snap => { if (snap.exists()) setDbTrainer(snap.data()); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [id]);

    // Merge static + dynamic data
    const getTrainerInfo = () => {
        if (trainersData[id]) return trainersData[id];
        if (dbTrainer) {
            const dbName = typeof dbTrainer.name === 'object' ? dbTrainer.name : { ar: dbTrainer.name, en: dbTrainer.name };
            return Object.values(trainersData).find(t => {
                const norm = s => (s || '').replace(/كابتن|captain/gi, '').trim();
                return norm(t.name?.ar)?.includes(norm(dbName.ar)) || norm(t.name?.en)?.toLowerCase().includes(norm(dbName.en)?.toLowerCase());
            }) || Object.values(trainersData)[0];
        }
        return Object.values(trainersData)[0];
    };

    const trainerInfo = getTrainerInfo();

    const trainer = {
        name: dbTrainer ? getText(dbTrainer.name) : getText(trainerInfo?.name),
        coverImage: dbTrainer?.coverImage || dbTrainer?.image || trainerInfo?.coverImage || '/trainers/default_trainer.png',
        profileImage: dbTrainer?.image || trainerInfo?.profileImage || '/trainers/default_trainer.png',
        title: dbTrainer ? (getText(dbTrainer.specialty) || (ar ? 'مدرب محترف' : 'Professional Trainer')) : getText(trainerInfo?.title),
        specialty: dbTrainer ? getText(dbTrainer.specialty) : getText(trainerInfo?.specialty),
        rating: dbTrainer?.rating || trainerInfo?.rating || 5.0,
        reviewsCount: trainerInfo?.reviewsCount || 0,
        experience: dbTrainer ? `${getText(dbTrainer.experience)} ${ar ? 'سنوات' : 'Yrs'}` : getText(trainerInfo?.experience),
        location: dbTrainer?.location || (ar ? 'الرياض' : 'Riyadh'),
        bio: dbTrainer ? (getText(dbTrainer.bio) || (ar ? 'مدرب معتمد من كابتنا' : 'Captina certified trainer')) : getText(trainerInfo?.bio),
        price: dbTrainer?.price || trainerInfo?.price || 150,
        stats: dbTrainer ? [
            { label: ar ? 'حصة' : 'Sessions', val: '250+' },
            { label: ar ? 'سنوات' : 'Years', val: getText(dbTrainer.experience) || '1' },
            { label: ar ? 'تقييم' : 'Rating', val: String(dbTrainer.rating || '5.0') },
        ] : (trainerInfo?.stats || []).map(s => ({ label: getText(s.label), val: s.val })),
        achievements: dbTrainer
            ? (dbTrainer.achievements || []).map(a => ({ title: getText(a), date: '' }))
            : (trainerInfo?.achievements || []).map(a => ({ title: getText(a.title), date: a.date })),
        certificates: dbTrainer
            ? (dbTrainer.certificates || []).map(c => ({ name: getText(c), issuer: '' }))
            : (trainerInfo?.certificates || []).map(c => ({ name: getText(c.name), issuer: c.issuer })),
        specializations: dbTrainer
            ? (dbTrainer.expertise || []).map((s, i) => ({ id: i, name: getText(s) }))
            : (trainerInfo?.specializations || []).map((s, i) => ({ id: i, name: typeof s === 'string' ? s : getText(s) })),
        reviews: (trainerInfo?.reviews || []).map(r => ({
            id: r.id, user: getText(r.user), rating: r.rating,
            date: getText(r.date), comment: getText(r.comment)
        })),
    };

    const handleShare = () => {
        const url = typeof window !== 'undefined' ? window.location.href : '';
        if (navigator.share) {
            navigator.share({ title: trainer.name, url }).catch(() => {});
        } else {
            navigator.clipboard?.writeText(url);
            setAlert?.({ title: ar ? 'تم النسخ!' : 'Copied!', message: ar ? 'تم نسخ الرابط' : 'Link copied', type: 'success' });
        }
    };

    if (loading && !trainersData[id]) return (
        <div className={`min-h-screen ${bg} flex items-center justify-center`}>
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    );

    if (!trainerInfo && !dbTrainer && !loading) return (
        <div className={`min-h-screen ${bg} flex flex-col items-center justify-center gap-5 p-6 text-center`}>
            <Dumbbell className={`w-16 h-16 ${muted} opacity-30`} />
            <h2 className={`text-xl font-black ${textC}`}>{ar ? 'المدرب غير موجود' : 'Trainer Not Found'}</h2>
            <Link href="/trainers" className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-sm">
                {ar ? 'العودة للمدربين' : 'Back to Trainers'}
            </Link>
        </div>
    );

    const tabLabels = { about: ar ? 'نبذة' : 'About', achievements: ar ? 'إنجازات' : 'Achievements', reviews: ar ? 'التقييمات' : 'Reviews' };

    return (
        <div className={`min-h-screen ${bg} pb-32 transition-colors duration-300 relative overflow-x-hidden`} dir={ar ? 'rtl' : 'ltr'}>
            {/* BG blob */}
            <div className="fixed top-0 end-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[140px] pointer-events-none translate-x-1/3 -translate-y-1/3" />

            {/* ── Hero Cover ── */}
            <div className="relative h-[38vh] md:h-[48vh] overflow-hidden">
                <img src={trainer.coverImage} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

                {/* Controls */}
                <div className="absolute top-5 inset-x-5 flex items-center justify-between z-20">
                    <button onClick={() => router.back()}
                        className="w-11 h-11 bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center text-white transition-all active:scale-95">
                        {ar ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                    <div className="flex gap-2">
                        <button onClick={handleShare}
                            className="w-11 h-11 bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center text-white transition-all active:scale-95">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Label */}
                <div className="absolute bottom-5 start-5 z-10">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-5 h-0.5 bg-primary" />
                        <span className="text-[9px] font-black text-white/70 uppercase tracking-[0.25em]">{ar ? 'مدرب معتمد' : 'Certified Trainer'}</span>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight drop-shadow-2xl">{trainer.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black text-primary">{trainer.title}</span>
                        {trainer.location && <>
                            <span className="text-white/30 text-[9px]">•</span>
                            <span className="text-[9px] font-bold text-white/50 flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{trainer.location}</span>
                        </>}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 -mt-4 relative z-10">

                {/* ── Profile Card ── */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    className={`${card} border rounded-[2rem] p-5 mb-4 relative overflow-hidden`}>
                    <div className="absolute top-0 end-0 w-32 h-32 bg-primary/8 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex items-center gap-4 mb-5">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-xl">
                                <img src={trainer.profileImage} alt={trainer.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-1 -end-1 w-7 h-7 bg-primary rounded-xl border-2 border-white dark:border-[#0a0f1a] flex items-center justify-center shadow-lg">
                                <Sparkles className="w-3.5 h-3.5 text-white" />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 text-start">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h2 className={`text-base font-black ${textC} tracking-tight`}>{trainer.name}</h2>
                                <div className="flex items-center gap-0.5 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full">
                                    <Star className="w-2.5 h-2.5 text-amber-500 fill-current" />
                                    <span className="text-[9px] font-black text-amber-500">{trainer.rating}</span>
                                </div>
                            </div>
                            <p className="text-[10px] font-bold text-primary uppercase tracking-wider truncate">{trainer.specialty}</p>
                            <p className={`text-[10px] font-medium ${muted} mt-1 leading-relaxed line-clamp-2`}>{trainer.bio}</p>
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-2">
                        {trainer.stats.map((s, i) => (
                            <div key={i} className={`text-center py-3 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className={`text-lg font-black ${textC} leading-none`}>{s.val}</p>
                                <p className={`text-[8px] font-bold uppercase tracking-wider ${muted} mt-0.5`}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* ── Tabs ── */}
                <div className={`flex gap-1 p-1.5 rounded-[1.5rem] mb-4 ${darkMode ? 'bg-white/5 border border-white/8' : 'bg-white border border-gray-100 shadow-sm'}`}>
                    {TABS.map(({ id: tid, icon: Icon }) => (
                        <button key={tid} onClick={() => setActiveTab(tid)}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${activeTab === tid ? 'bg-primary text-white shadow-lg shadow-primary/25' : `${muted} hover:text-primary`}`}>
                            <Icon className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{tabLabels[tid]}</span>
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* ── Main Content ── */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}
                                className="space-y-4">

                                {/* ABOUT */}
                                {activeTab === 'about' && (
                                    <>
                                        {/* Bio */}
                                        <div className={`${card} border rounded-2xl p-5 text-start`}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-1 h-5 bg-primary rounded-full" />
                                                <h3 className={`text-xs font-black ${textC} uppercase tracking-wider`}>{ar ? 'نبذة عن المدرب' : 'About the Trainer'}</h3>
                                            </div>
                                            <p className={`text-sm font-medium leading-relaxed ${muted}`}>{trainer.bio}</p>
                                        </div>

                                        {/* Specializations */}
                                        {trainer.specializations.length > 0 && (
                                            <div className={`${card} border rounded-2xl p-5`}>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="w-1 h-5 bg-violet-500 rounded-full" />
                                                    <h3 className={`text-xs font-black ${textC} uppercase tracking-wider`}>{ar ? 'مجالات التخصص' : 'Specializations'}</h3>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {trainer.specializations.map((spec, i) => (
                                                        <div key={i} className={`flex items-center gap-2.5 p-3 ${darkMode ? 'bg-white/5' : 'bg-gray-50'} rounded-xl`}>
                                                            <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                                                <Target className="w-4 h-4 text-primary" />
                                                            </div>
                                                            <span className={`text-[10px] font-black ${textC} truncate`}>{spec.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Certificates */}
                                        {trainer.certificates.length > 0 && (
                                            <div className={`${card} border rounded-2xl p-5`}>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="w-1 h-5 bg-blue-500 rounded-full" />
                                                    <h3 className={`text-xs font-black ${textC} uppercase tracking-wider`}>{ar ? 'الشهادات المعتمدة' : 'Certifications'}</h3>
                                                </div>
                                                <div className="space-y-2">
                                                    {trainer.certificates.map((cert, i) => (
                                                        <div key={i} className={`flex items-center gap-3 p-3 ${darkMode ? 'bg-white/5' : 'bg-gray-50'} rounded-xl`}>
                                                            <div className="w-8 h-8 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                                                                <ShieldCheck className="w-4 h-4 text-blue-500" />
                                                            </div>
                                                            <div className="flex-1 min-w-0 text-start">
                                                                <p className={`text-[10px] font-black ${textC} truncate`}>{cert.name}</p>
                                                                {cert.issuer && <p className={`text-[8px] font-bold ${muted}`}>{cert.issuer}</p>}
                                                            </div>
                                                            <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* ACHIEVEMENTS */}
                                {activeTab === 'achievements' && (
                                    <div className={`${card} border rounded-2xl p-5`}>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-1 h-5 bg-amber-500 rounded-full" />
                                            <h3 className={`text-xs font-black ${textC} uppercase tracking-wider`}>{ar ? 'أهم الإنجازات' : 'Key Achievements'}</h3>
                                        </div>
                                        {trainer.achievements.length > 0 ? (
                                            <div className="space-y-3">
                                                {trainer.achievements.map((a, i) => (
                                                    <div key={i} className={`flex items-start gap-3 p-4 ${darkMode ? 'bg-white/5' : 'bg-amber-50'} rounded-2xl`}>
                                                        <div className="w-9 h-9 bg-amber-100 dark:bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
                                                            <Award className="w-4 h-4 text-amber-500" />
                                                        </div>
                                                        <div className="flex-1 text-start">
                                                            <p className={`text-xs font-black ${textC}`}>{a.title}</p>
                                                            {a.date && <p className={`text-[9px] font-bold ${muted} mt-0.5 uppercase tracking-wider`}>{a.date}</p>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-10 text-center">
                                                <Trophy className={`w-10 h-10 ${muted} opacity-30 mx-auto mb-2`} />
                                                <p className={`text-xs font-bold ${muted}`}>{ar ? 'لا توجد إنجازات مسجلة' : 'No achievements listed'}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* REVIEWS */}
                                {activeTab === 'reviews' && (
                                    <div className="space-y-3">
                                        {/* Average */}
                                        <div className={`${card} border rounded-2xl p-5 flex items-center gap-4`}>
                                            <div className="text-center">
                                                <p className={`text-4xl font-black ${textC}`}>{trainer.rating}</p>
                                                <div className="flex gap-0.5 justify-center mt-1">
                                                    {[1,2,3,4,5].map(s => (
                                                        <Star key={s} className={`w-3 h-3 ${s <= Math.round(trainer.rating) ? 'text-amber-500 fill-current' : `${muted} opacity-30`}`} />
                                                    ))}
                                                </div>
                                                <p className={`text-[9px] font-bold ${muted} mt-0.5`}>{trainer.reviewsCount || trainer.reviews.length} {ar ? 'تقييم' : 'reviews'}</p>
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                {[5,4,3,2,1].map(n => {
                                                    const cnt = trainer.reviews.filter(r => r.rating === n).length;
                                                    const pct = trainer.reviews.length ? Math.round((cnt / trainer.reviews.length) * 100) : (n === 5 ? 80 : n === 4 ? 20 : 0);
                                                    return (
                                                        <div key={n} className="flex items-center gap-2">
                                                            <span className={`text-[8px] font-black ${muted} w-2`}>{n}</span>
                                                            <div className={`flex-1 h-1.5 rounded-full ${darkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                                                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {trainer.reviews.length > 0 ? trainer.reviews.map(r => (
                                            <div key={r.id} className={`${card} border rounded-2xl p-4`}>
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-9 h-9 bg-gradient-to-br from-primary to-rose-500 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary/20">
                                                            {r.user?.charAt(0)}
                                                        </div>
                                                        <div className="text-start">
                                                            <p className={`text-[11px] font-black ${textC}`}>{r.user}</p>
                                                            <p className={`text-[8px] font-bold ${muted} uppercase tracking-wide`}>{r.date}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-0.5">
                                                        {[1,2,3,4,5].map(s => <Star key={s} className={`w-2.5 h-2.5 ${s <= r.rating ? 'text-amber-500 fill-current' : `${muted} opacity-20`}`} />)}
                                                    </div>
                                                </div>
                                                <p className={`text-xs font-medium ${muted} leading-relaxed italic`}>"{r.comment}"</p>
                                            </div>
                                        )) : (
                                            <div className="py-12 text-center">
                                                <Star className={`w-10 h-10 ${muted} opacity-30 mx-auto mb-2`} />
                                                <p className={`text-xs font-bold ${muted}`}>{ar ? 'لا توجد تقييمات بعد' : 'No reviews yet'}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* ── Sidebar ── */}
                    <div className="space-y-4">
                        {/* Book Card */}
                        <div className={`${card} border rounded-[1.8rem] p-5 relative overflow-hidden`}>
                            <div className="absolute top-0 end-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

                            <div className="flex items-center gap-1.5 mb-3">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                <span className={`text-[9px] font-black text-emerald-500 uppercase tracking-wider`}>{ar ? 'متاح الآن' : 'Available Now'}</span>
                            </div>

                            <h3 className={`text-sm font-black ${textC} mb-1`}>{ar ? 'احجز جلستك' : 'Book a Session'}</h3>
                            <p className={`text-[10px] font-bold ${muted} mb-4`}>{ar ? 'ابدأ رحلتك الرياضية مع' : 'Start your journey with'} {trainer.name}</p>

                            {/* Price */}
                            <div className={`flex items-center justify-between p-3 rounded-2xl mb-4 ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <div className="text-start">
                                    <p className={`text-[8px] font-bold uppercase tracking-wider ${muted}`}>{ar ? 'سعر الجلسة' : 'Session Price'}</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className={`text-xl font-black ${textC}`}>{trainer.price}</span>
                                        <span className="text-[9px] font-black text-primary">SAR</span>
                                    </div>
                                </div>
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-primary" />
                                </div>
                            </div>

                            <Link href={`/booking?trainer=${id}`}
                                className="block w-full py-4 bg-primary text-white text-center rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                {ar ? 'احجز الموعد' : 'Reserve Spot'}
                            </Link>
                        </div>

                        {/* Schedule */}
                        <div className={`${card} border rounded-[1.8rem] p-5`}>
                            <div className="flex items-center gap-2 mb-4">
                                <Calendar className="w-4 h-4 text-primary" />
                                <h3 className={`text-xs font-black ${textC} uppercase tracking-wider`}>{ar ? 'أوقات العمل' : 'Availability'}</h3>
                            </div>
                            <div className="space-y-2">
                                {[
                                    { day: ar ? 'السبت — الخميس' : 'Sat — Thu', time: '09:00 – 23:00', open: true },
                                    { day: ar ? 'الجمعة' : 'Friday', time: ar ? 'مغلق' : 'Closed', open: false },
                                ].map((item, i) => (
                                    <div key={i} className={`flex items-center justify-between p-3 ${darkMode ? 'bg-white/5' : 'bg-gray-50'} rounded-xl`}>
                                        <span className={`text-[10px] font-black ${textC}`}>{item.day}</span>
                                        <span className={`text-[10px] font-black ${item.open ? 'text-primary' : muted}`}>{item.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => router.push(`/trainers/${id}/chat`)}
                                className={`py-4 ${card} border rounded-2xl font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 hover:border-primary/30 transition-all active:scale-95 ${textC}`}>
                                <MessageCircle className="w-4 h-4 text-primary" />
                                {ar ? 'تواصل' : 'Chat'}
                            </button>
                            <button onClick={handleShare}
                                className={`py-4 ${card} border rounded-2xl font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 hover:border-emerald-500/30 transition-all active:scale-95 ${textC}`}>
                                <Share2 className="w-4 h-4 text-emerald-500" />
                                {ar ? 'مشاركة' : 'Share'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <motion.div className="fixed bottom-0 start-0 end-0 h-0.5 bg-primary/10 z-50 pointer-events-none">
                <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1 }} />
            </motion.div>
        </div>
    );
}
