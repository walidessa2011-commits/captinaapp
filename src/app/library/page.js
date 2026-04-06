"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from 'next/link';
import { ChevronLeft, ChevronRight, PlaySquare, GraduationCap, Users, UserCheck, Film, Search, Play, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { useRouter } from 'next/navigation';
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, limit, orderBy } from "firebase/firestore";

const CATEGORIES = [
    {
        id: 'educational',
        title_ar: 'فيديوهات تعليمية',
        title_en: 'Educational',
        desc_ar: 'دروس وشروحات احترافية لمختلف الرياضات القتالية',
        desc_en: 'Professional lessons for various martial arts',
        icon: GraduationCap,
        image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800",
        gradient: "from-blue-600 to-indigo-700",
        accent: "#3b82f6",
    },
    {
        id: 'trainees',
        title_ar: 'إنجازات المتدربين',
        title_en: 'Trainee Achievements',
        desc_ar: 'انجازات وبطولات أبطال كابتنا',
        desc_en: 'Achievements & tournaments of Captina champions',
        icon: Users,
        image: "https://images.unsplash.com/photo-1599058917233-57c0e88cfb4c?q=80&w=800",
        gradient: "from-emerald-500 to-teal-600",
        accent: "#10b981",
    },
    {
        id: 'trainers',
        title_ar: 'نصائح المدربين',
        title_en: 'Trainer Tips',
        desc_ar: 'توجيهات ونصائح من نخبة المدربين المعتمدين',
        desc_en: 'Guidance from our certified elite coaches',
        icon: UserCheck,
        image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800",
        gradient: "from-orange-500 to-rose-600",
        accent: "#f97316",
    },
    {
        id: 'others',
        title_ar: 'فيديوهات متنوعة',
        title_en: 'More Content',
        desc_ar: 'تغطيات، فعاليات ومحتوى ترفيهي متنوع',
        desc_en: 'Events, coverage & diverse entertainment',
        icon: Film,
        image: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=800",
        gradient: "from-purple-500 to-pink-600",
        accent: "#a855f7",
    }
];

export default function LibraryPage() {
    const { language, darkMode, t } = useApp();
    const router = useRouter();
    const ar = language === 'ar';
    const [latestVideos, setLatestVideos] = useState([]);
    const [counts, setCounts] = useState({});
    const [searchQ, setSearchQ] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);

    const bg = darkMode ? "bg-[#0a0f1a]" : "bg-slate-50";
    const card = darkMode ? "bg-white/5 border-white/8" : "bg-white border-gray-100 shadow-sm";
    const textC = darkMode ? "text-white" : "text-slate-900";
    const muted = darkMode ? "text-gray-400" : "text-gray-500";

    useEffect(() => {
        // Fetch latest videos + counts per category
        const fetchData = async () => {
            try {
                const snap = await getDocs(query(collection(db, "library"), where("status", "==", "active"), limit(20)));
                const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                setLatestVideos(all.slice(0, 6));
                const c = {};
                all.forEach(v => { c[v.category] = (c[v.category] || 0) + 1; });
                setCounts(c);
            } catch (e) { console.error(e); }
        };
        fetchData();
    }, []);

    const getText = (f) => !f ? '' : typeof f === 'object' ? f[language] || f.ar || f.en || '' : f;

    return (
        <div className={`min-h-screen ${bg} pb-32 relative transition-colors duration-300`} dir={ar ? 'rtl' : 'ltr'}>
            {/* BG */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className={`absolute top-0 end-0 w-[600px] h-[600px] rounded-full blur-[150px] translate-x-1/2 -translate-y-1/3 ${darkMode ? 'bg-violet-500/10' : 'bg-violet-500/5'}`} />
                <div className={`absolute bottom-0 start-0 w-[400px] h-[400px] rounded-full blur-[120px] ${darkMode ? 'bg-blue-500/8' : 'bg-blue-500/4'}`} />
            </div>

            {/* ── Header ── */}
            <div className={`sticky top-0 z-50 ${darkMode ? 'bg-[#0a0f1a]/85' : 'bg-slate-50/85'} backdrop-blur-xl border-b ${darkMode ? 'border-white/5' : 'border-gray-200'} px-4 py-3`}>
                <div className="max-w-5xl mx-auto flex items-center gap-3">
                    <button onClick={() => router.back()}
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center border shrink-0 transition-all active:scale-95 ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-slate-900 shadow-sm'}`}>
                        {ar ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>

                    {/* Search bar */}
                    <div className={`flex-1 flex items-center gap-2.5 rounded-2xl border px-4 py-2.5 transition-all ${searchFocused ? 'border-primary/40 shadow-lg shadow-primary/5' : darkMode ? 'bg-white/5 border-white/8' : 'bg-white border-gray-200 shadow-sm'}`}>
                        <Search className={`w-4 h-4 shrink-0 transition-colors ${searchFocused ? 'text-primary' : muted}`} />
                        <input
                            value={searchQ}
                            onChange={e => setSearchQ(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            placeholder={ar ? 'ابحث في مكتبة كابتنا...' : 'Search Captina library...'}
                            className={`flex-1 bg-transparent text-sm font-bold outline-none ${textC} placeholder:${muted}`}
                        />
                    </div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4 pt-6 space-y-10 relative z-10">

                {/* ── Hero Banner ── */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 p-7 md:p-10">
                    <div className="absolute top-0 end-0 w-60 h-60 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, white 0, white 1px, transparent 0, transparent 12px)', backgroundSize: '17px 17px' }} />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-1 text-start">
                            <div className="flex items-center gap-2 mb-3">
                                <PlaySquare className="w-5 h-5 text-primary" />
                                <span className="text-primary text-[9px] font-black uppercase tracking-[0.25em]">
                                    {ar ? 'مكتبة كابتنا المرئية' : 'Captina Video Library'}
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2">
                                {ar ? 'استكشف عالم' : 'Explore the World of'}
                                <span className="text-primary"> {ar ? 'فنون القتال' : 'Martial Arts'}</span>
                            </h1>
                            <p className="text-white/50 text-xs font-bold leading-relaxed max-w-sm">
                                {ar ? 'مئات الفيديوهات الحصرية من نخبة المدربين المعتمدين لتحسين مهاراتك.' : 'Hundreds of exclusive videos from certified elite coaches to boost your skills.'}
                            </p>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap justify-center md:justify-end">
                            {[
                                { val: latestVideos.length || '20+', label: ar ? 'فيديو' : 'Videos' },
                                { val: '4', label: ar ? 'تصنيف' : 'Categories' },
                            ].map(({ val, label }, i) => (
                                <div key={i} className="text-center bg-white/8 rounded-2xl px-5 py-3 border border-white/10">
                                    <p className="text-xl font-black text-white">{val}</p>
                                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-wider">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* ── Categories Grid ── */}
                <div>
                    <div className="flex items-center gap-2 mb-5">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <h2 className={`text-sm font-black ${textC} uppercase tracking-wider`}>
                            {ar ? 'تصنيفات المحتوى' : 'Content Categories'}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {CATEGORIES.map((cat, i) => {
                            const Icon = cat.icon;
                            const count = counts[cat.id] || 0;
                            return (
                                <motion.div key={cat.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08 }}>
                                    <Link href={`/library/${cat.id}`}>
                                        <div className="relative h-52 rounded-[1.8rem] overflow-hidden group cursor-pointer shadow-xl">
                                            {/* BG Image */}
                                            <img src={cat.image} alt=""
                                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700" style={{ transform: 'scale(1)' }}
                                                onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
                                                onMouseLeave={e => e.target.style.transform = 'scale(1)'} />

                                            {/* Gradient overlays */}
                                            <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-60 group-hover:opacity-70 transition-opacity duration-500`} />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                            {/* Content */}
                                            <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                                                <div className="flex items-start justify-between">
                                                    {/* Icon */}
                                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform shadow-lg">
                                                        <Icon className="w-6 h-6 text-white" />
                                                    </div>

                                                    {/* Count badge */}
                                                    {count > 0 && (
                                                        <div className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                                                            <span className="text-white text-[9px] font-black">{count} {ar ? 'فيديو' : 'vids'}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="text-start">
                                                    <h3 className="text-lg md:text-xl font-black text-white mb-1 drop-shadow-md">
                                                        {ar ? cat.title_ar : cat.title_en}
                                                    </h3>
                                                    <p className="text-white/75 text-[10px] font-bold drop-shadow-md line-clamp-1">
                                                        {ar ? cat.desc_ar : cat.desc_en}
                                                    </p>

                                                    {/* Arrow */}
                                                    <div className="mt-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                                        <span className="text-white text-[9px] font-black uppercase tracking-wider">{ar ? 'استعرض الفيديوهات' : 'Browse Videos'}</span>
                                                        <ChevronLeft className={`w-3.5 h-3.5 text-white ${ar ? '' : 'rotate-180'}`} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Latest Videos ── */}
                {latestVideos.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-primary" />
                                <h2 className={`text-sm font-black ${textC} uppercase tracking-wider`}>
                                    {ar ? 'أحدث الفيديوهات' : 'Latest Videos'}
                                </h2>
                            </div>
                            <Link href="/library/educational" className="text-[10px] font-black text-primary hover:underline flex items-center gap-1">
                                {ar ? 'عرض الكل' : 'View All'}
                                <ChevronLeft className={`w-3.5 h-3.5 ${ar ? '' : 'rotate-180'}`} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {latestVideos.map((vid, i) => (
                                <motion.div key={vid.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.06 }}>
                                    <Link href={`/library/${vid.category}/${vid.id}`}>
                                        <div className={`${card} border rounded-[1.5rem] overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all`}>
                                            <div className="relative aspect-video overflow-hidden">
                                                <img src={vid.thumbnailUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400'}
                                                    alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-600" />
                                                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                                                    <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all shadow-xl">
                                                        <Play className="w-4 h-4 text-primary ms-0.5" />
                                                    </div>
                                                </div>
                                                {vid.duration && (
                                                    <div className="absolute bottom-2 end-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md">
                                                        <Clock className="w-2.5 h-2.5 text-white/70" />
                                                        <span className="text-[8px] font-black text-white">{vid.duration}</span>
                                                    </div>
                                                )}
                                                {/* Category tag */}
                                                <div className="absolute top-2 start-2">
                                                    <span className="text-[7px] font-black bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                        {CATEGORIES.find(c => c.id === vid.category)?.[ar ? 'title_ar' : 'title_en'] || vid.category}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-3 text-start">
                                                <p className={`text-[10px] font-black ${textC} line-clamp-2 leading-tight`}>
                                                    {getText(vid.title)}
                                                </p>
                                                {vid.views !== undefined && (
                                                    <p className={`text-[8px] font-bold ${muted} mt-1`}>{vid.views} {ar ? 'مشاهدة' : 'views'}</p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
