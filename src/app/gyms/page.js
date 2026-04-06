"use client";
import { motion } from "framer-motion";
import { MapPin, Star, ChevronLeft, ChevronRight, Navigation, Building2, Users2, Zap, Search, X, Shield, Clock } from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { useRouter } from 'next/navigation';
import { useState, useMemo } from "react";
import GymsMap from "./GymsMap";

export default function Gyms() {
    const { language, darkMode, gyms: allGyms, getText } = useApp();
    const router = useRouter();
    const ar = language === 'ar';
    const [search, setSearch] = useState('');
    const [activeType, setActiveType] = useState('all');

    const gyms = useMemo(() => (allGyms || []).filter(g => g.status !== 'inactive'), [allGyms]);

    const bg = darkMode ? "bg-[#0a0f1a]" : "bg-slate-50";
    const card = darkMode ? "bg-white/5 border-white/8" : "bg-white border-gray-100 shadow-sm";
    const textC = darkMode ? "text-white" : "text-slate-900";
    const muted = darkMode ? "text-gray-400" : "text-gray-500";

    const types = ['all', ...new Set(gyms.map(g => g.type).filter(Boolean))];

    const filtered = useMemo(() => gyms.filter(g => {
        const name = getText(g.name)?.toLowerCase() || '';
        const loc = getText(g.location)?.toLowerCase() || '';
        const q = search.toLowerCase();
        const matchSearch = !search || name.includes(q) || loc.includes(q);
        const matchType = activeType === 'all' || g.type === activeType;
        return matchSearch && matchType;
    }), [gyms, search, activeType, language]);

    return (
        <div className={`min-h-screen ${bg} pb-32 relative transition-colors duration-300`} dir={ar ? 'rtl' : 'ltr'}>
            {/* BG blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className={`absolute top-0 end-0 w-[700px] h-[700px] rounded-full blur-[160px] translate-x-1/2 -translate-y-1/3 ${darkMode ? 'bg-primary/10' : 'bg-primary/5'} animate-pulse`} />
                <div className={`absolute bottom-0 start-0 w-[500px] h-[500px] rounded-full blur-[120px] ${darkMode ? 'bg-blue-500/6' : 'bg-blue-500/3'}`} />
            </div>

            <div className="max-w-7xl mx-auto px-4 pt-5 relative z-10">

                {/* ── Header ── */}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-5">
                    <button onClick={() => router.back()}
                        className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 transition-all active:scale-95 ${darkMode ? 'bg-white/5 border-white/8 text-white' : 'bg-white border-gray-200 text-slate-900 shadow-sm'}`}>
                        {ar ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>

                    <div className={`flex-1 flex items-center gap-2.5 border rounded-2xl px-4 py-3 ${darkMode ? 'bg-white/5 border-white/8' : 'bg-white border-gray-200 shadow-sm'}`}>
                        <Search className={`w-4 h-4 shrink-0 ${muted}`} />
                        <input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder={ar ? 'ابحث عن نادٍ...' : 'Search a gym...'}
                            className={`flex-1 bg-transparent text-sm font-bold outline-none ${textC} placeholder:text-gray-400`} />
                        {search && <button onClick={() => setSearch('')}><X className={`w-3.5 h-3.5 ${muted}`} /></button>}
                    </div>
                </motion.div>

                {/* Title + stats */}
                <div className="flex items-center justify-between px-1 mb-5">
                    <div>
                        <h1 className={`text-xl font-black ${textC} tracking-tight`}>{ar ? 'نوادينا المعتمدة' : 'Partner Gyms'}</h1>
                        <p className={`text-[9px] font-bold uppercase tracking-[0.2em] mt-0.5 ${muted}`}>{ar ? 'أفضل المراكز الرياضية في الرياض' : 'Top fitness centers in Riyadh'}</p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black ${darkMode ? 'bg-white/5 text-gray-400' : 'bg-white text-gray-500 shadow-sm border border-gray-100'}`}>
                        {filtered.length} {ar ? 'نادٍ' : 'gyms'}
                    </div>
                </div>

                {/* Type filter */}
                {types.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar mb-5" style={{ scrollbarWidth: 'none' }}>
                        {types.map(type => (
                            <button key={type} onClick={() => setActiveType(type)}
                                className={`px-4 py-2 rounded-xl whitespace-nowrap border text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 shrink-0 ${activeType === type ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : darkMode ? 'bg-white/5 border-white/8 text-gray-400' : 'bg-white border-gray-200 text-gray-500 shadow-sm'}`}>
                                {type === 'all' ? (ar ? 'الكل' : 'All') : type}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── Map ── */}
                <GymsMap customGyms={gyms} className="h-[260px] md:h-[320px]" />

                {/* ── Gyms Grid ── */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((gym, idx) => {
                            const name = getText(gym.name);
                            const location = getText(gym.location || gym.address);
                            const trainersCount = gym.trainers_count || gym.trainers || 0;

                            return (
                                <motion.div key={gym.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-20px' }}
                                    transition={{ delay: Math.min(idx * 0.07, 0.4) }}>
                                    <Link href={`/gyms/${gym.id}`}>
                                        <div className={`group ${card} border rounded-[1.8rem] overflow-hidden hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 cursor-pointer`}>

                                            {/* Image */}
                                            <div className="relative h-48 overflow-hidden">
                                                <img src={gym.image} alt={name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    referrerPolicy="no-referrer" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />

                                                {/* Type badge */}
                                                {gym.type && (
                                                    <div className="absolute top-3 start-3">
                                                        <span className="text-[8px] font-black bg-primary text-white px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                                            {gym.type}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Rating */}
                                                <div className="absolute top-3 end-3 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
                                                    <Star className="w-3 h-3 text-amber-400 fill-current" />
                                                    <span className="text-[9px] font-black text-white">{gym.rating}</span>
                                                </div>

                                                {/* Name overlay */}
                                                <div className="absolute bottom-3 start-3 end-3">
                                                    <h3 className={`text-base font-black text-white group-hover:text-primary transition-colors tracking-tight`}>{name}</h3>
                                                    <p className="text-white/65 text-[10px] font-bold flex items-center gap-1 mt-0.5">
                                                        <MapPin className="w-3 h-3 text-primary shrink-0" />
                                                        <span className="truncate">{location}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Info row */}
                                            <div className="px-4 py-3 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {trainersCount > 0 && (
                                                        <div className="flex items-center gap-1.5">
                                                            <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${darkMode ? 'bg-white/8' : 'bg-primary/8'}`}>
                                                                <Users2 className="w-3.5 h-3.5 text-primary" />
                                                            </div>
                                                            <span className={`text-[10px] font-black ${textC}`}>{trainersCount} {ar ? 'مدرب' : 'coaches'}</span>
                                                        </div>
                                                    )}
                                                    {gym.workingHours && (
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3 text-primary" />
                                                            <span className={`text-[9px] font-bold ${muted}`}>{getText(gym.workingHours)}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[9px] font-black text-primary ${darkMode ? 'bg-primary/10' : 'bg-primary/8'} group-hover:bg-primary group-hover:text-white transition-all`}>
                                                    {ar ? 'تفاصيل' : 'Details'}
                                                    <ChevronLeft className={`w-3 h-3 ${ar ? '' : 'rotate-180'}`} />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className={`w-20 h-20 ${darkMode ? 'bg-white/5' : 'bg-gray-100'} rounded-2xl flex items-center justify-center mb-4`}>
                            <Building2 className={`w-10 h-10 ${muted} opacity-30`} />
                        </div>
                        <p className={`text-sm font-black ${textC} mb-2`}>{ar ? 'لا توجد نتائج' : 'No Gyms Found'}</p>
                        <button onClick={() => { setSearch(''); setActiveType('all'); }} className="text-xs font-black text-primary hover:underline">
                            {ar ? 'عرض الكل' : 'Show All'}
                        </button>
                    </div>
                )}

                {/* ── Features Section ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className={`mt-12 ${card} border rounded-[2rem] p-6 md:p-8`}>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-1 h-5 bg-primary rounded-full" />
                        <h2 className={`text-xs font-black ${textC} uppercase tracking-wider`}>{ar ? 'لماذا نوادينا؟' : 'Why Our Gyms?'}</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: Shield, label: ar ? 'معتمدة رسمياً' : 'Officially Certified', color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
                            { icon: Star, label: ar ? 'أعلى التقييمات' : 'Top Rated', color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' },
                            { icon: Users2, label: ar ? 'مدربون نخبة' : 'Elite Coaches', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' },
                            { icon: Zap, label: ar ? 'عروض حصرية' : 'Exclusive Deals', color: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10' },
                        ].map(({ icon: Icon, label, color }, i) => (
                            <div key={i} className="flex flex-col items-center gap-3 text-center group hover:-translate-y-1 transition-all">
                                <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className={`text-[10px] font-black ${textC} uppercase tracking-wide leading-tight`}>{label}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
