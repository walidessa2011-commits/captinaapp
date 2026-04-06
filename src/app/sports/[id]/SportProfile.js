"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft, ChevronRight, Star, Target, Zap,
    Clock, Shield, Award, Play, Image as ImageIcon,
    Users, Info, Activity, Dumbbell, Heart, ArrowRight,
    Flame, CheckCircle2, BookOpen, Calendar
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useApp } from "@/context/AppContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import SportTrainers from "@/components/SportTrainers";
import { matchesSport } from "@/lib/utils";
import Link from 'next/link';
import { getSportImage } from "@/lib/sportsData";

export default function SportProfile({ params }) {
    const id = params.id;
    const { t, language, darkMode, favoriteSports, toggleFavoriteSport, getText: ctxGetText } = useApp();
    const router = useRouter();
    const ar = language === 'ar';

    const [activeTab, setActiveTab] = useState('about');
    const [sport, setSport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [videosLoading, setVideosLoading] = useState(false);

    const bg = darkMode ? "bg-[#0a0f1a]" : "bg-slate-50";
    const card = darkMode ? "bg-white/5 border-white/8" : "bg-white border-gray-100 shadow-sm";
    const textC = darkMode ? "text-white" : "text-slate-900";
    const muted = darkMode ? "text-gray-400" : "text-gray-500";

    const getText = (f) => !f ? '' : typeof f === 'object' ? f[language] || f.ar || f.en || '' : f;

    useEffect(() => {
        if (!id) return;
        const fetch = async () => {
            try {
                const snap = await getDoc(doc(db, "sports", id));
                if (snap.exists()) {
                    setSport({ id: snap.id, ...snap.data() });
                } else {
                    const list = t('pageSportsData') || [];
                    const found = list.find(s => s.id === id);
                    if (found) {
                        const content = t(id + 'Content') || {};
                        setSport({ ...found, ...content, fallback: true });
                    }
                }
            } catch (e) { console.error(e); } finally { setLoading(false); }
        };
        fetch();
    }, [id]);

    useEffect(() => {
        if (activeTab !== 'videos' || !sport) return;
        setVideosLoading(true);
        getDocs(query(collection(db, "library"), where("status", "==", "active")))
            .then(snap => {
                const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                setRelatedVideos(all.filter(v => matchesSport(v, sport)));
            })
            .catch(() => {})
            .finally(() => setVideosLoading(false));
    }, [sport, activeTab]);

    if (loading) return (
        <div className={`min-h-screen ${bg} flex items-center justify-center`}>
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className={`text-[10px] font-black uppercase tracking-widest ${muted} animate-pulse`}>{ar ? 'جاري التحميل...' : 'Loading...'}</p>
            </div>
        </div>
    );

    if (!sport) return (
        <div className={`min-h-screen ${bg} flex flex-col items-center justify-center gap-5 p-6 text-center`}>
            <Dumbbell className={`w-16 h-16 ${muted} opacity-30`} />
            <h1 className={`text-xl font-black ${textC}`}>{ar ? 'الرياضة غير موجودة' : 'Sport Not Found'}</h1>
            <button onClick={() => router.back()} className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-sm">{ar ? 'رجوع' : 'Go Back'}</button>
        </div>
    );

    const isFav = favoriteSports.includes(sport.id);
    const sportName = getText(sport.name);
    const heroImg = getSportImage(id, sport.heroBanner || sport.image || sport.heroImg, language);

    const tabs = [
        { id: 'about', label: ar ? 'نبذة' : 'About', icon: Info },
        { id: 'trainers', label: ar ? 'المدربون' : 'Trainers', icon: Users },
        { id: 'videos', label: ar ? 'فيديوهات' : 'Videos', icon: Play },
        { id: 'gallery', label: ar ? 'الصور' : 'Gallery', icon: ImageIcon },
    ];

    const stats = [
        { label: ar ? 'الشدة' : 'Intensity', val: getText(sport.intensity) || sport.stats?.intensity || 'High', icon: Zap, color: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10' },
        { label: ar ? 'المدة' : 'Duration', val: getText(sport.duration) || sport.stats?.duration || '60 Min', icon: Clock, color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
        { label: ar ? 'المعدات' : 'Equipment', val: getText(sport.equipment) || 'Standard', icon: Shield, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' },
        { label: ar ? 'العمر' : 'Age Group', val: getText(sport.targetAge) || 'All Ages', icon: Award, color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' },
    ];

    return (
        <div className={`min-h-screen ${bg} pb-32 transition-colors duration-300 relative`} dir={ar ? 'rtl' : 'ltr'}>
            {/* BG blob */}
            <div className="fixed top-0 end-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[140px] pointer-events-none translate-x-1/3 -translate-y-1/3" />

            {/* ── Hero Image ── */}
            <div className="relative h-[40vh] md:h-[52vh] overflow-hidden">
                <img src={heroImg} alt={sportName} className="w-full h-full object-cover" />
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent h-24" />

                {/* Top controls */}
                <div className="absolute top-5 inset-x-5 flex items-center justify-between z-20">
                    <button onClick={() => router.back()}
                        className="w-11 h-11 bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center text-white hover:bg-black/50 transition-all active:scale-95">
                        {ar ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                    <button onClick={() => toggleFavoriteSport(sport.id)}
                        className={`w-11 h-11 rounded-2xl backdrop-blur-md border flex items-center justify-center transition-all active:scale-90 ${isFav ? 'bg-rose-500 border-rose-500 text-white shadow-xl shadow-rose-500/30' : 'bg-black/30 border-white/20 text-white hover:bg-black/50'}`}>
                        <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                </div>

                {/* Bottom text */}
                <div className="absolute bottom-6 start-5 end-5 z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-0.5 bg-primary" />
                        <span className="text-[9px] font-black text-white/70 uppercase tracking-[0.25em]">
                            {ar ? 'كابتنا — فنون القتال' : 'Captina — Martial Arts'}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase leading-none drop-shadow-2xl">
                        {sportName}
                    </h1>
                    {/* Quick stats inline */}
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                        {[
                            { icon: Zap, val: getText(sport.intensity) || sport.stats?.intensity || 'High' },
                            { icon: Clock, val: getText(sport.duration) || sport.stats?.duration || '60 Min' },
                        ].map(({ icon: Icon, val }, i) => (
                            <div key={i} className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                                <Icon className="w-3 h-3 text-primary" />
                                <span className="text-[9px] font-black text-white">{val}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="max-w-4xl mx-auto px-4 -mt-4 relative z-10">

                {/* Tabs */}
                <div className={`flex gap-1 p-1.5 rounded-[1.5rem] mb-5 ${darkMode ? 'bg-white/5 border border-white/8' : 'bg-white border border-gray-100 shadow-sm'}`}>
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/25' : `${muted} hover:text-primary`}`}>
                            <tab.icon className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

                        {/* ── ABOUT ── */}
                        {activeTab === 'about' && (
                            <div className="space-y-4">
                                {/* Stats row */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {stats.map(({ label, val, icon: Icon, color }, i) => (
                                        <div key={i} className={`${card} border rounded-2xl p-4 flex flex-col gap-2`}>
                                            <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center`}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div className="text-start">
                                                <p className={`text-[8px] font-bold uppercase tracking-wider ${muted} mb-0.5`}>{label}</p>
                                                <p className={`text-xs font-black ${textC} truncate`}>{val}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Description */}
                                {getText(sport.description) && (
                                    <div className={`${card} border rounded-2xl p-5 text-start`}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-1 h-5 bg-primary rounded-full" />
                                            <h3 className={`text-xs font-black ${textC} uppercase tracking-wider`}>{ar ? 'عن الرياضة' : 'About This Sport'}</h3>
                                        </div>
                                        <p className={`text-sm font-medium leading-relaxed ${muted}`}>{getText(sport.description)}</p>
                                    </div>
                                )}

                                {/* Benefits */}
                                {(sport.benefits || []).length > 0 && (
                                    <div className={`${card} border rounded-2xl p-5 text-start`}>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                                            <h3 className={`text-xs font-black ${textC} uppercase tracking-wider`}>{ar ? 'الفوائد والنتائج' : 'Benefits & Results'}</h3>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-2">
                                            {sport.benefits.map((b, i) => (
                                                <div key={i} className={`flex items-start gap-2.5 p-3 ${darkMode ? 'bg-white/5' : 'bg-gray-50'} rounded-xl`}>
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                                    <span className={`text-xs font-bold ${muted}`}>{getText(b)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Requirements sidebar info */}
                                <div className={`${card} border rounded-2xl p-5 text-start`}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-1 h-5 bg-blue-500 rounded-full" />
                                        <h3 className={`text-xs font-black ${textC} uppercase tracking-wider`}>{ar ? 'المتطلبات الأساسية' : 'Key Requirements'}</h3>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { label: ar ? 'المعدات' : 'Equipment', val: getText(sport.equipment) || 'None', icon: Dumbbell },
                                            { label: ar ? 'الشدة' : 'Intensity', val: getText(sport.intensity) || 'General', icon: Flame },
                                            { label: ar ? 'مدة الحصة' : 'Session', val: getText(sport.duration) || '60m', icon: Clock },
                                        ].map(({ label, val, icon: Icon }, i) => (
                                            <div key={i} className={`text-center p-3 ${darkMode ? 'bg-white/5' : 'bg-gray-50'} rounded-xl`}>
                                                <Icon className="w-4 h-4 text-primary mx-auto mb-1.5" />
                                                <p className={`text-[8px] font-bold uppercase tracking-wider ${muted} mb-0.5`}>{label}</p>
                                                <p className={`text-[10px] font-black ${textC}`}>{val}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Link href={`/booking?sport=${id}`}
                                        className="flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 active:scale-[0.98] transition-all">
                                        <Calendar className="w-4 h-4" />
                                        {ar ? 'احجز الآن' : 'Book Now'}
                                    </Link>
                                    <Link href="/trainers"
                                        className={`flex items-center justify-center gap-2 py-4 ${card} border rounded-2xl font-black text-sm active:scale-[0.98] transition-all ${textC}`}>
                                        <Users className="w-4 h-4 text-primary" />
                                        {ar ? 'المدربون' : 'Trainers'}
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* ── TRAINERS ── */}
                        {activeTab === 'trainers' && (
                            <div className={`${card} border rounded-2xl p-5`}>
                                <SportTrainers sportId={id} sportName={sportName} sport={sport} />
                            </div>
                        )}

                        {/* ── VIDEOS ── */}
                        {activeTab === 'videos' && (
                            <div className="space-y-3">
                                {videosLoading ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        {[1,2,3,4].map(i => <div key={i} className={`aspect-video ${darkMode ? 'bg-white/5' : 'bg-gray-100'} rounded-2xl animate-pulse`} />)}
                                    </div>
                                ) : [...(sport.videos || []), ...relatedVideos].length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {[...(sport.videos || []), ...relatedVideos].map((vid, i) => (
                                            <Link key={vid.id || i} href={vid.id ? `/library/${vid.category}/${vid.id}` : (vid.url || vid.videoUrl || '#')}>
                                                <div className={`${card} border rounded-2xl overflow-hidden group hover:-translate-y-1 transition-all`}>
                                                    <div className="relative aspect-video overflow-hidden">
                                                        <img src={vid.thumbnailUrl || vid.thumbnail || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400'}
                                                            alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-600" />
                                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
                                                                <Play className="w-4 h-4 text-primary ms-0.5" />
                                                            </div>
                                                        </div>
                                                        {vid.duration && (
                                                            <div className="absolute bottom-2 end-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md">
                                                                <Clock className="w-2.5 h-2.5 text-white/70" />
                                                                <span className="text-[8px] font-black text-white">{vid.duration}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-3 text-start">
                                                        <p className={`text-[10px] font-black ${textC} line-clamp-2 leading-tight`}>{getText(vid.title)}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={`py-16 text-center ${darkMode ? 'bg-white/5' : 'bg-gray-50'} rounded-2xl border border-dashed ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                                        <Play className={`w-12 h-12 ${muted} opacity-30 mx-auto mb-3`} />
                                        <p className={`text-sm font-black ${textC} mb-1`}>{ar ? 'لا توجد فيديوهات' : 'No Videos Yet'}</p>
                                        <Link href="/library" className="text-xs font-black text-primary hover:underline">{ar ? 'استعرض المكتبة' : 'Browse Library'}</Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── GALLERY ── */}
                        {activeTab === 'gallery' && (
                            <div>
                                {(sport.gallery || []).length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {sport.gallery.map((img, i) => (
                                            <motion.div key={i} whileHover={{ y: -4 }}
                                                className="relative aspect-square rounded-2xl overflow-hidden group">
                                                {img ? (
                                                    <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <div className={`w-full h-full ${darkMode ? 'bg-white/5' : 'bg-gray-100'} flex items-center justify-center`}>
                                                        <ImageIcon className={`w-8 h-8 ${muted} opacity-30`} />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={`py-16 text-center ${darkMode ? 'bg-white/5' : 'bg-gray-50'} rounded-2xl border border-dashed ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                                        <ImageIcon className={`w-12 h-12 ${muted} opacity-30 mx-auto mb-3`} />
                                        <p className={`text-sm font-black ${textC}`}>{ar ? 'لا توجد صور بعد' : 'No Gallery Images Yet'}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── Bottom Progress Indicator ── */}
            <motion.div className="fixed bottom-0 start-0 end-0 h-0.5 bg-primary/10 z-50 pointer-events-none">
                <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1 }} />
            </motion.div>
        </div>
    );
}
