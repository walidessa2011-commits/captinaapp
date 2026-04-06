"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, PlaySquare, Clock, Eye, Share2, Play, X, Dumbbell, BookOpen, ArrowLeft } from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { getYouTubeEmbedUrl, getYouTubeId } from "@/lib/utils";
import { useRouter } from 'next/navigation';
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, limit, getDocs } from "firebase/firestore";
import Link from "next/link";

const CATEGORY_META = {
    educational: { title_ar: 'فيديوهات تعليمية', title_en: 'Educational', gradient: 'from-blue-500 to-indigo-600' },
    trainees:    { title_ar: 'إنجازات المتدربين', title_en: 'Trainees', gradient: 'from-emerald-500 to-teal-600' },
    trainers:    { title_ar: 'نصائح المدربين',   title_en: 'Trainers', gradient: 'from-orange-500 to-rose-600' },
    others:      { title_ar: 'محتوى متنوع',      title_en: 'More',     gradient: 'from-purple-500 to-pink-600' },
};

export default function VideoDetail({ params }) {
    const { language, darkMode } = useApp();
    const router = useRouter();
    const ar = language === 'ar';
    const { category, videoId } = params;

    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [related, setRelated] = useState([]);

    const bg = darkMode ? "bg-[#0a0f1a]" : "bg-slate-50";
    const card = darkMode ? "bg-white/5 border-white/8" : "bg-white border-gray-100 shadow-sm";
    const textC = darkMode ? "text-white" : "text-slate-900";
    const muted = darkMode ? "text-gray-400" : "text-gray-500";
    const meta = CATEGORY_META[category] || CATEGORY_META.others;
    const getText = (f) => !f ? '' : typeof f === 'object' ? f[language] || f.ar || f.en || '' : f;

    useEffect(() => {
        if (!videoId) return;
        const fetchVideo = async () => {
            setLoading(true);
            try {
                const snap = await getDoc(doc(db, "library", videoId));
                if (snap.exists()) {
                    setVideo({ id: snap.id, ...snap.data() });
                    const relSnap = await getDocs(query(collection(db, "library"), where("category", "==", category), where("status", "==", "active"), limit(6)));
                    setRelated(relSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(v => v.id !== videoId).slice(0, 5));
                }
            } catch (e) { console.error(e); } finally { setLoading(false); }
        };
        fetchVideo();
    }, [videoId, category]);

    if (loading) return (
        <div className={`min-h-screen ${bg} flex items-center justify-center`}>
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className={`text-[10px] font-black uppercase tracking-widest ${muted} animate-pulse`}>{ar ? 'جاري التحميل...' : 'Loading...'}</p>
            </div>
        </div>
    );

    if (!video) return (
        <div className={`min-h-screen ${bg} flex flex-col items-center justify-center gap-5 p-6 text-center`}>
            <div className={`w-20 h-20 ${darkMode ? 'bg-white/5' : 'bg-gray-100'} rounded-2xl flex items-center justify-center`}>
                <X className={`w-10 h-10 ${muted} opacity-50`} />
            </div>
            <h2 className={`text-xl font-black ${textC}`}>{ar ? 'الفيديو غير متاح' : 'Video Not Available'}</h2>
            <button onClick={() => router.push(`/library/${category}`)}
                className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20">
                {ar ? 'العودة للمكتبة' : 'Back to Library'}
            </button>
        </div>
    );

    return (
        <div className={`min-h-screen ${bg} pb-32 transition-colors duration-300`} dir={ar ? 'rtl' : 'ltr'}>
            {/* BG */}
            <div className="fixed top-0 end-0 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none translate-x-1/2 -translate-y-1/3 bg-primary/8" />

            {/* ── Sticky Header ── */}
            <div className={`sticky top-0 z-50 ${darkMode ? 'bg-[#0a0f1a]/90' : 'bg-white/90'} backdrop-blur-xl border-b ${darkMode ? 'border-white/5' : 'border-gray-200'} px-4 py-3`}>
                <div className="max-w-5xl mx-auto flex items-center gap-3">
                    <button onClick={() => router.back()}
                        className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 transition-all active:scale-95 ${darkMode ? 'bg-white/5 border-white/8 text-white' : 'bg-white border-gray-200 text-slate-900 shadow-sm'}`}>
                        {ar ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                    <div className="flex-1 min-w-0 text-start">
                        <p className={`text-sm font-black ${textC} truncate`}>{getText(video.title)}</p>
                        <div className="flex items-center gap-2">
                            <Link href="/library" className={`text-[9px] font-bold ${muted} hover:text-primary transition-colors`}>{ar ? 'المكتبة' : 'Library'}</Link>
                            <span className={`text-[8px] ${muted}`}>/</span>
                            <Link href={`/library/${category}`} className={`text-[9px] font-bold ${muted} hover:text-primary transition-colors`}>{ar ? meta.title_ar : meta.title_en}</Link>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4 pt-5">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ── Left: Player + Info ── */}
                    <div className="lg:col-span-2 space-y-4">

                        {/* Video Player */}
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            className="aspect-video w-full bg-black rounded-[1.8rem] overflow-hidden shadow-2xl border border-white/5">
                            {getYouTubeId(video.videoUrl) ? (
                                <iframe src={getYouTubeEmbedUrl(video.videoUrl)} className="w-full h-full" allowFullScreen title="Video" />
                            ) : (
                                <video src={video.videoUrl} className="w-full h-full" controls autoPlay poster={video.thumbnailUrl} />
                            )}
                        </motion.div>

                        {/* Video Info Card */}
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className={`${card} border rounded-[1.8rem] p-5`}>
                            {/* Category badge */}
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`text-[9px] font-black bg-gradient-to-r ${meta.gradient} text-white px-3 py-1 rounded-full uppercase tracking-wider`}>
                                    {ar ? meta.title_ar : meta.title_en}
                                </span>
                            </div>

                            <h1 className={`text-lg md:text-xl font-black ${textC} leading-tight mb-3 text-start`}>
                                {getText(video.title)}
                            </h1>

                            {/* Meta row */}
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                {video.duration && (
                                    <div className={`flex items-center gap-1.5 text-[10px] font-bold ${muted} px-3 py-1.5 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                                        <Clock className="w-3.5 h-3.5 text-primary" />
                                        {video.duration}
                                    </div>
                                )}
                                {video.views !== undefined && (
                                    <div className={`flex items-center gap-1.5 text-[10px] font-bold ${muted} px-3 py-1.5 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                                        <Eye className="w-3.5 h-3.5 text-primary" />
                                        {video.views} {ar ? 'مشاهدة' : 'views'}
                                    </div>
                                )}
                                <button className="flex items-center gap-1.5 text-[10px] font-black text-primary px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 transition-all active:scale-95 ms-auto">
                                    <Share2 className="w-3.5 h-3.5" />
                                    {ar ? 'مشاركة' : 'Share'}
                                </button>
                            </div>

                            {/* Description */}
                            {getText(video.description) && (
                                <div className={`pt-4 border-t ${darkMode ? 'border-white/5' : 'border-gray-100'} text-start`}>
                                    <p className={`text-[10px] font-black uppercase tracking-wider ${muted} mb-2`}>{ar ? 'عن هذا الفيديو' : 'About this video'}</p>
                                    <p className={`text-sm font-medium leading-relaxed ${muted}`}>{getText(video.description)}</p>
                                </div>
                            )}
                        </motion.div>

                        {/* CTA to book */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                            className="relative overflow-hidden rounded-[1.8rem] bg-gradient-to-r from-slate-900 to-slate-800 p-5 flex items-center gap-4">
                            <div className="absolute top-0 end-0 w-32 h-32 bg-primary/20 rounded-full blur-[50px] pointer-events-none" />
                            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center shrink-0">
                                <Dumbbell className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 text-start">
                                <p className="text-white font-black text-sm">{ar ? 'مستعد للتدريب الحقيقي؟' : 'Ready for real training?'}</p>
                                <p className="text-white/50 text-[10px] font-bold">{ar ? 'احجز حصة مع مدرب معتمد الآن' : 'Book a session with a certified coach'}</p>
                            </div>
                            <Link href="/booking?trial=true"
                                className="shrink-0 px-5 py-2.5 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-wider shadow-lg shadow-primary/30 active:scale-95 transition-all">
                                {ar ? 'احجز الآن' : 'Book Now'}
                            </Link>
                        </motion.div>
                    </div>

                    {/* ── Right: Related Videos ── */}
                    <div className="space-y-4">
                        <div className={`${card} border rounded-[1.8rem] overflow-hidden`}>
                            <div className={`px-5 py-4 border-b ${darkMode ? 'border-white/5' : 'border-gray-50'} flex items-center gap-2`}>
                                <PlaySquare className="w-4 h-4 text-primary" />
                                <h3 className={`text-xs font-black ${textC} uppercase tracking-wider`}>
                                    {ar ? 'فيديوهات مشابهة' : 'Related Videos'}
                                </h3>
                            </div>

                            <div className="divide-y divide-white/5">
                                {related.length > 0 ? related.map(vid => (
                                    <button key={vid.id} onClick={() => router.push(`/library/${vid.category}/${vid.id}`)}
                                        className={`w-full flex items-start gap-3 p-4 text-start hover:bg-primary/5 transition-colors group`}>
                                        <div className="relative w-20 h-14 rounded-xl overflow-hidden shrink-0">
                                            <img src={vid.thumbnailUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200'}
                                                alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Play className="w-3.5 h-3.5 text-white fill-current" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-[10px] font-black ${textC} line-clamp-2 leading-tight group-hover:text-primary transition-colors`}>
                                                {getText(vid.title)}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {vid.duration && <span className={`text-[8px] font-bold ${muted} flex items-center gap-0.5`}><Clock className="w-2.5 h-2.5" />{vid.duration}</span>}
                                                {vid.views !== undefined && <span className={`text-[8px] font-bold ${muted}`}>{vid.views} {ar ? 'مشاهدة' : 'views'}</span>}
                                            </div>
                                        </div>
                                    </button>
                                )) : (
                                    <div className="py-10 text-center">
                                        <PlaySquare className={`w-10 h-10 ${muted} opacity-30 mx-auto mb-2`} />
                                        <p className={`text-[10px] font-bold ${muted}`}>{ar ? 'لا توجد فيديوهات مشابهة' : 'No related videos'}</p>
                                    </div>
                                )}
                            </div>

                            {related.length > 0 && (
                                <div className={`px-4 py-3 border-t ${darkMode ? 'border-white/5' : 'border-gray-50'}`}>
                                    <Link href={`/library/${category}`}
                                        className="flex items-center justify-center gap-1.5 text-[10px] font-black text-primary hover:underline">
                                        {ar ? 'عرض كل فيديوهات التصنيف' : 'View all in category'}
                                        <ChevronLeft className={`w-3.5 h-3.5 ${ar ? '' : 'rotate-180'}`} />
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Library CTA */}
                        <Link href="/library">
                            <div className={`${card} border rounded-[1.8rem] p-5 flex items-center gap-3 hover:border-primary/30 transition-all group`}>
                                <div className="w-11 h-11 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:scale-105 transition-all">
                                    <BookOpen className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                                </div>
                                <div className="flex-1 text-start">
                                    <p className={`text-xs font-black ${textC}`}>{ar ? 'استعرض كل المكتبة' : 'Browse Full Library'}</p>
                                    <p className={`text-[9px] font-bold ${muted}`}>{ar ? 'مئات الفيديوهات الحصرية' : 'Hundreds of exclusive videos'}</p>
                                </div>
                                <ChevronLeft className={`w-4 h-4 ${muted} ${ar ? '' : 'rotate-180'}`} />
                            </div>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
