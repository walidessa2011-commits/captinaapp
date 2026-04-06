"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Clock, Search, PlaySquare, X, Share2, Eye, SlidersHorizontal, Check } from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { getYouTubeEmbedUrl, getYouTubeId } from "@/lib/utils";
import { useRouter } from 'next/navigation';
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const CATEGORY_META = {
    educational: {
        title_ar: 'فيديوهات تعليمية', title_en: 'Educational Videos',
        desc_ar: 'دروس وشروحات لمختلف الرياضات', desc_en: 'Lessons for various sports',
        gradient: 'from-blue-600 to-indigo-700', badge: 'EDU',
        image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200'
    },
    trainees: {
        title_ar: 'إنجازات المتدربين', title_en: 'Trainee Achievements',
        desc_ar: 'بطولات وانجازات متدربي كابتنا', desc_en: 'Tournaments & achievements',
        gradient: 'from-emerald-500 to-teal-600', badge: 'WIN',
        image: 'https://images.unsplash.com/photo-1599058917233-57c0e88cfb4c?q=80&w=1200'
    },
    trainers: {
        title_ar: 'نصائح المدربين', title_en: 'Trainer Tips',
        desc_ar: 'توجيهات من نخبة المدربين', desc_en: 'Tips from elite coaches',
        gradient: 'from-orange-500 to-rose-600', badge: 'PRO',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200'
    },
    others: {
        title_ar: 'محتوى متنوع', title_en: 'More Content',
        desc_ar: 'تغطيات وفعاليات', desc_en: 'Events & coverage',
        gradient: 'from-purple-500 to-pink-600', badge: 'MORE',
        image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=1200'
    },
};

export default function CategoryVideos({ params }) {
    const { language, darkMode } = useApp();
    const router = useRouter();
    const ar = language === 'ar';
    const { category } = params;

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeVideo, setActiveVideo] = useState(null);
    const [view, setView] = useState('grid'); // grid | list
    const [sortBy, setSortBy] = useState('newest');

    const bg = darkMode ? "bg-[#0a0f1a]" : "bg-slate-50";
    const card = darkMode ? "bg-white/5 border-white/8" : "bg-white border-gray-100 shadow-sm";
    const textC = darkMode ? "text-white" : "text-slate-900";
    const muted = darkMode ? "text-gray-400" : "text-gray-500";
    const inp = darkMode ? "bg-white/5 border-white/8 text-white placeholder:text-gray-600" : "bg-white border-gray-200 text-slate-900 placeholder:text-gray-400";

    const meta = CATEGORY_META[category] || CATEGORY_META.others;
    const getText = (f) => !f ? '' : typeof f === 'object' ? f[language] || f.ar || f.en || '' : f;

    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true);
            try {
                const snap = await getDocs(query(collection(db, "library"), where("status", "==", "active")));
                let list = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(v => v.category === category);
                list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
                setVideos(list);
            } catch (e) { console.error(e); } finally { setLoading(false); }
        };
        fetchVideos();
    }, [category]);

    const filtered = videos
        .filter(v => {
            const q = search.toLowerCase();
            return !q || getText(v.title)?.toLowerCase().includes(q) || getText(v.description)?.toLowerCase().includes(q);
        })
        .sort((a, b) => {
            if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
            if (sortBy === 'duration') return (a.duration || '').localeCompare(b.duration || '');
            return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
        });

    return (
        <div className={`min-h-screen ${bg} pb-32 relative transition-colors duration-300`} dir={ar ? 'rtl' : 'ltr'}>
            {/* BG blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className={`absolute top-0 end-0 w-[500px] h-[500px] rounded-full blur-[140px] translate-x-1/2 -translate-y-1/3 opacity-30`}
                    style={{ background: `var(--primary)` }} />
            </div>

            {/* ── Hero Banner ── */}
            <div className="relative h-44 md:h-56 overflow-hidden">
                <img src={meta.image} alt="" className="w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} opacity-75`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 14px)', backgroundSize: '20px 20px' }} />

                {/* Back button */}
                <button onClick={() => router.back()}
                    className="absolute top-4 start-4 w-10 h-10 bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center text-white transition-all active:scale-95">
                    {ar ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>

                {/* Title */}
                <div className="absolute bottom-5 start-5 text-start">
                    <span className={`inline-block text-[8px] font-black bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full border border-white/30 uppercase tracking-widest mb-2`}>
                        {meta.badge}
                    </span>
                    <h1 className="text-xl md:text-2xl font-black text-white drop-shadow-lg">
                        {ar ? meta.title_ar : meta.title_en}
                    </h1>
                    <p className="text-white/70 text-[10px] font-bold mt-0.5">
                        {ar ? meta.desc_ar : meta.desc_en}
                        {videos.length > 0 && <span className="ms-2 text-white/50">• {videos.length} {ar ? 'فيديو' : 'videos'}</span>}
                    </p>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4 pt-5 relative z-10 space-y-5">

                {/* ── Search + Controls ── */}
                <div className="flex items-center gap-2">
                    <div className={`flex-1 flex items-center gap-2 border rounded-2xl px-4 py-3 ${inp} border`}>
                        <Search className={`w-4 h-4 shrink-0 ${muted}`} />
                        <input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder={ar ? 'ابحث عن فيديو...' : 'Search videos...'}
                            className="flex-1 bg-transparent text-sm font-bold outline-none" />
                        {search && <button onClick={() => setSearch('')}><X className={`w-3.5 h-3.5 ${muted}`} /></button>}
                    </div>

                    {/* Sort */}
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                        className={`border rounded-2xl py-3 px-3 text-[10px] font-black outline-none ${darkMode ? 'bg-white/5 border-white/8 text-gray-300' : 'bg-white border-gray-200 text-slate-700 shadow-sm'}`}>
                        <option value="newest">{ar ? 'الأحدث' : 'Newest'}</option>
                        <option value="views">{ar ? 'الأكثر مشاهدة' : 'Most Viewed'}</option>
                        <option value="duration">{ar ? 'المدة' : 'Duration'}</option>
                    </select>

                    {/* View toggle */}
                    <button onClick={() => setView(v => v === 'grid' ? 'list' : 'grid')}
                        className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition-all ${darkMode ? 'bg-white/5 border-white/8 text-gray-400' : 'bg-white border-gray-200 text-gray-500 shadow-sm'}`}>
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>
                </div>

                {/* ── Content ── */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className={`text-[10px] font-black uppercase tracking-widest ${muted} animate-pulse`}>
                            {ar ? 'جاري التحميل...' : 'Loading...'}
                        </p>
                    </div>
                ) : filtered.length > 0 ? (
                    <div className={view === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 gap-3' : 'space-y-2'}>
                        <AnimatePresence>
                            {filtered.map((vid, i) => (
                                view === 'grid' ? (
                                    /* Grid Card */
                                    <motion.div key={vid.id}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => setActiveVideo(vid)}
                                        className={`${card} border rounded-[1.5rem] overflow-hidden group cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all`}>
                                        <div className="relative aspect-video overflow-hidden">
                                            <img src={vid.thumbnailUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400'}
                                                alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-600" />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                                                <div className="w-11 h-11 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all shadow-xl">
                                                    <Play className="w-4 h-4 text-primary ms-0.5" />
                                                </div>
                                            </div>
                                            <span className={`absolute top-2 start-2 text-[7px] font-black bg-gradient-to-r ${meta.gradient} text-white px-2 py-0.5 rounded-full`}>{meta.badge}</span>
                                            {vid.duration && (
                                                <div className="absolute bottom-2 end-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md">
                                                    <Clock className="w-2.5 h-2.5 text-white/70" />
                                                    <span className="text-[8px] font-black text-white">{vid.duration}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3 text-start">
                                            <p className={`text-[10px] font-black ${textC} line-clamp-2 leading-tight`}>{getText(vid.title)}</p>
                                            {vid.views !== undefined && <p className={`text-[8px] font-bold ${muted} mt-1`}>{vid.views} {ar ? 'مشاهدة' : 'views'}</p>}
                                        </div>
                                    </motion.div>
                                ) : (
                                    /* List Row */
                                    <motion.div key={vid.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        onClick={() => setActiveVideo(vid)}
                                        className={`${card} border rounded-2xl flex items-center gap-3 p-3 cursor-pointer hover:border-primary/30 active:scale-[0.99] transition-all`}>
                                        <div className="relative w-24 h-16 rounded-xl overflow-hidden shrink-0">
                                            <img src={vid.thumbnailUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=300'}
                                                alt="" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                                <Play className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0 text-start">
                                            <p className={`text-xs font-black ${textC} line-clamp-2 leading-tight`}>{getText(vid.title)}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {vid.duration && <span className={`text-[9px] font-bold ${muted} flex items-center gap-0.5`}><Clock className="w-2.5 h-2.5" />{vid.duration}</span>}
                                                {vid.views !== undefined && <span className={`text-[9px] font-bold ${muted}`}>{vid.views} {ar ? 'مشاهدة' : 'views'}</span>}
                                            </div>
                                        </div>
                                        <ChevronLeft className={`w-4 h-4 ${muted} shrink-0 ${ar ? '' : 'rotate-180'}`} />
                                    </motion.div>
                                )
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className={`w-20 h-20 ${darkMode ? 'bg-white/5' : 'bg-gray-100'} rounded-2xl flex items-center justify-center mb-4`}>
                            <PlaySquare className={`w-10 h-10 ${muted} opacity-40`} />
                        </div>
                        <p className={`text-sm font-black ${textC} mb-1`}>{ar ? 'لا توجد فيديوهات' : 'No Videos Found'}</p>
                        <p className={`text-xs font-bold ${muted}`}>{search ? (ar ? 'جرّب بحثاً آخر' : 'Try another search') : (ar ? 'لا يوجد محتوى في هذا التصنيف بعد' : 'No content in this category yet')}</p>
                        {search && <button onClick={() => setSearch('')} className="mt-4 text-xs font-black text-primary hover:underline">{ar ? 'مسح البحث' : 'Clear Search'}</button>}
                    </div>
                )}
            </main>

            {/* ── Video Player Modal ── */}
            <AnimatePresence>
                {activeVideo && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
                        onClick={() => setActiveVideo(null)}>
                        <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="relative w-full max-w-4xl z-10">
                            {/* Close */}
                            <button onClick={() => setActiveVideo(null)}
                                className="absolute -top-12 end-0 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-2xl flex items-center justify-center backdrop-blur-md transition-all">
                                <X className="w-5 h-5" />
                            </button>

                            {/* Title above player */}
                            <p className="text-white font-black text-sm mb-3 text-start line-clamp-1">{getText(activeVideo.title)}</p>

                            {/* Player */}
                            <div className="aspect-video w-full bg-black rounded-[1.5rem] overflow-hidden border border-white/10 shadow-2xl">
                                {getYouTubeId(activeVideo.videoUrl) ? (
                                    <iframe src={getYouTubeEmbedUrl(activeVideo.videoUrl)}
                                        className="w-full h-full" allowFullScreen title="Video" />
                                ) : (
                                    <video src={activeVideo.videoUrl} className="w-full h-full" controls autoPlay poster={activeVideo.thumbnailUrl} />
                                )}
                            </div>

                            {/* Info row */}
                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-3">
                                    {activeVideo.duration && <span className="flex items-center gap-1 text-white/50 text-[10px] font-bold"><Clock className="w-3 h-3" />{activeVideo.duration}</span>}
                                    {activeVideo.views !== undefined && <span className="flex items-center gap-1 text-white/50 text-[10px] font-bold"><Eye className="w-3 h-3" />{activeVideo.views}</span>}
                                </div>
                                <button onClick={() => router.push(`/library/${activeVideo.category}/${activeVideo.id}`)}
                                    className="text-[10px] font-black text-primary hover:underline">
                                    {ar ? 'فتح صفحة الفيديو' : 'Open Full Page'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
