"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Search, ChevronLeft, ChevronRight, Users, Star, Heart, X, Shield, Loader2 } from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { matchesSport } from "@/lib/utils";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { trainersData } from '@/lib/trainersData';

export default function Trainers() {
    const { t, language, darkMode, getText, favoriteTrainers, toggleFavoriteTrainer } = useApp();
    const router = useRouter();
    const ar = language === 'ar';

    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [onlyFav, setOnlyFav] = useState(false);

    const bg = darkMode ? "bg-[#0a0f1a]" : "bg-slate-50";
    const card = darkMode ? "bg-white/5 border-white/8" : "bg-white border-gray-100 shadow-sm";
    const textC = darkMode ? "text-white" : "text-slate-900";
    const muted = darkMode ? "text-gray-400" : "text-gray-500";
    const inp = darkMode ? "bg-white/5 border-white/8 text-white placeholder:text-gray-600" : "bg-white border-gray-200 text-slate-900 placeholder:text-gray-400 shadow-sm";

    useEffect(() => {
        getDocs(query(collection(db, "trainers"), where("status", "==", "active")))
            .then(snap => setTrainers(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const sports = t('pageSportsData') || [];
    const cats = [
        { id: 'all', name: ar ? 'الكل' : 'All' },
        ...sports.map(s => ({ id: s.id, name: getText(s.name) }))
    ];

    const filtered = useMemo(() => {
        return trainers.filter(tr => {
            const name = getText(tr.name) || '';
            const matchSearch = !search.trim() || name.toLowerCase().includes(search.toLowerCase());
            const matchCat = activeCategory === 'all' || (() => {
                const sport = sports.find(s => s.id === activeCategory);
                return sport ? matchesSport(tr, sport) : false;
            })();
            const matchFav = !onlyFav || (favoriteTrainers || []).includes(tr.id);
            return matchSearch && matchCat && matchFav;
        });
    }, [trainers, search, activeCategory, onlyFav, favoriteTrainers, language]);

    const getImg = (tr) => {
        if (tr.image) return tr.image;
        const staticData = trainersData[tr.id] || Object.values(trainersData).find(t => {
            const norm = s => (s || '').replace(/كابتن|captain/gi, '').trim();
            const trName = typeof tr.name === 'object' ? tr.name : { ar: tr.name, en: tr.name };
            return norm(t.name?.ar)?.includes(norm(trName.ar)) || norm(t.name?.en)?.toLowerCase().includes(norm(trName.en)?.toLowerCase());
        });
        return staticData?.profileImage || '/trainers/default_trainer.png';
    };

    return (
        <div className={`min-h-screen ${bg} pb-32 relative transition-colors duration-300`} dir={ar ? 'rtl' : 'ltr'}>
            {/* BG */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className={`absolute top-0 end-0 w-[700px] h-[700px] rounded-full blur-[160px] translate-x-1/2 -translate-y-1/3 ${darkMode ? 'bg-primary/12' : 'bg-primary/6'} animate-pulse`} />
                <div className={`absolute bottom-0 start-0 w-[500px] h-[500px] rounded-full blur-[120px] ${darkMode ? 'bg-blue-500/6' : 'bg-blue-500/3'}`} />
            </div>

            {/* ── Header ── */}
            <div className="relative z-10 px-4 pt-5 pb-3 max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-4">
                    <button onClick={() => router.back()}
                        className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 transition-all active:scale-95 ${darkMode ? 'bg-white/5 border-white/8 text-white' : 'bg-white border-gray-200 text-slate-900 shadow-sm'}`}>
                        {ar ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>

                    {/* Search */}
                    <div className={`flex-1 flex items-center gap-2.5 border rounded-2xl px-4 py-3 ${inp} border`}>
                        <Search className={`w-4 h-4 shrink-0 ${muted}`} />
                        <input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder={ar ? 'ابحث عن مدرب...' : 'Search a trainer...'}
                            className="flex-1 bg-transparent text-sm font-bold outline-none" />
                        {search && <button onClick={() => setSearch('')}><X className={`w-3.5 h-3.5 ${muted}`} /></button>}
                    </div>

                    {/* Fav toggle */}
                    <button onClick={() => setOnlyFav(s => !s)}
                        className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition-all active:scale-95 ${onlyFav ? 'bg-rose-500 border-rose-500 text-white' : darkMode ? 'bg-white/5 border-white/8 text-gray-400' : 'bg-white border-gray-200 text-gray-500 shadow-sm'}`}>
                        <Heart className={`w-4 h-4 ${onlyFav ? 'fill-current' : ''}`} />
                    </button>
                </motion.div>

                {/* Page title + count */}
                <div className="flex items-center justify-between px-1 mb-4">
                    <div>
                        <h1 className={`text-xl font-black ${textC} tracking-tight`}>{ar ? 'نخبة المدربين' : 'Elite Trainers'}</h1>
                        <p className={`text-[9px] font-bold uppercase tracking-[0.2em] ${muted}`}>{ar ? 'مدربون معتمدون ومحترفون' : 'Certified professional coaches'}</p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black ${darkMode ? 'bg-white/5 text-gray-400' : 'bg-white text-gray-500 shadow-sm border border-gray-100'}`}>
                        {filtered.length} {ar ? 'مدرب' : 'trainers'}
                    </div>
                </div>

                {/* Sport filter tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                    {cats.map(cat => (
                        <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl whitespace-nowrap border text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 shrink-0 ${activeCategory === cat.id ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : darkMode ? 'bg-white/5 border-white/8 text-gray-400 hover:border-white/15' : 'bg-white border-gray-200 text-gray-500 shadow-sm hover:border-gray-300'}`}>
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Grid ── */}
            <main className="max-w-7xl mx-auto px-4 relative z-10">
                {loading ? (
                    <div className="flex justify-center items-center py-24">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                        <AnimatePresence mode="popLayout">
                            {filtered.map((trainer, idx) => {
                                const name = getText(trainer.name);
                                const spec = getText(trainer.specialty) || getText(trainer.expertise?.[0]) || (ar ? 'مدرب محترف' : 'Pro Trainer');
                                const img = getImg(trainer);
                                const isFav = (favoriteTrainers || []).includes(trainer.id);

                                return (
                                    <motion.div key={trainer.id} layout
                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: Math.min(idx * 0.04, 0.3) }}>
                                        <Link href={`/trainers/${trainer.id}`}>
                                            <div className={`group relative ${card} border rounded-[1.8rem] overflow-hidden hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 cursor-pointer`}>

                                                {/* Photo */}
                                                <div className="relative aspect-square overflow-hidden">
                                                    <img src={img} alt={name} referrerPolicy="no-referrer"
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

                                                    {/* Verified badge */}
                                                    <div className="absolute top-2.5 start-2.5">
                                                        <div className="w-7 h-7 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                                                            <Shield className="w-3.5 h-3.5 text-white" />
                                                        </div>
                                                    </div>

                                                    {/* Fav btn */}
                                                    <button onClick={e => { e.preventDefault(); e.stopPropagation(); toggleFavoriteTrainer?.(trainer.id); }}
                                                        className={`absolute top-2.5 end-2.5 w-8 h-8 rounded-xl backdrop-blur-md flex items-center justify-center border transition-all active:scale-90 ${isFav ? 'bg-rose-500 border-rose-500 text-white shadow-lg' : 'bg-black/20 border-white/20 text-white hover:bg-black/40'}`}>
                                                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                                                    </button>

                                                    {/* Rating bottom */}
                                                    <div className="absolute bottom-2.5 start-2.5 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                                                        <Star className="w-2.5 h-2.5 text-amber-400 fill-current" />
                                                        <span className="text-[9px] font-black text-white">{trainer.rating || '5.0'}</span>
                                                    </div>

                                                    {/* Students */}
                                                    {trainer.students && (
                                                        <div className="absolute bottom-2.5 end-2.5 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                                                            <Users className="w-2.5 h-2.5 text-white/70" />
                                                            <span className="text-[8px] font-black text-white">{trainer.students}+</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className="px-3 py-3 text-start">
                                                    <p className={`text-xs font-black ${textC} truncate group-hover:text-primary transition-colors`}>{name}</p>
                                                    <p className={`text-[9px] font-bold ${muted} truncate mt-0.5 uppercase tracking-wide`}>{spec}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className={`w-20 h-20 ${darkMode ? 'bg-white/5' : 'bg-gray-100'} rounded-2xl flex items-center justify-center mb-4`}>
                            <Users className={`w-10 h-10 ${muted} opacity-30`} />
                        </div>
                        <p className={`text-sm font-black ${textC} mb-2`}>{ar ? 'لا يوجد مدربون' : 'No Trainers Found'}</p>
                        <button onClick={() => { setSearch(''); setActiveCategory('all'); setOnlyFav(false); }}
                            className="text-xs font-black text-primary hover:underline">{ar ? 'عرض الكل' : 'Show All'}</button>
                    </div>
                )}
            </main>
        </div>
    );
}
