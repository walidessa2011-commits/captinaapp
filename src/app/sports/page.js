"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, Search, ChevronLeft, ChevronRight, Zap, Clock, Dumbbell, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getSportImage } from '@/lib/sportsData';

export default function SportsPage() {
    const { language, darkMode, sports: allSports, favoriteSports, toggleFavoriteSport, loadingSports } = useApp();
    const router = useRouter();
    const ar = language === 'ar';

    const [search, setSearch] = useState('');

    const bg = darkMode ? 'bg-[#0a0f1a]' : 'bg-slate-50';
    const card = darkMode ? 'bg-white/5 border-white/8' : 'bg-white border-gray-100 shadow-sm';
    const textC = darkMode ? 'text-white' : 'text-slate-900';
    const muted = darkMode ? 'text-gray-400' : 'text-gray-500';
    const inp = darkMode
        ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50'
        : 'bg-white border-gray-200 text-slate-900 placeholder:text-gray-400 focus:border-primary/40';

    const getText = (f) => !f ? '' : typeof f === 'object' ? f[language] || f.ar || f.en || '' : f;

    const filtered = allSports.filter(s => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        const nameAr = (s.name_ar || getText(s.name) || '').toLowerCase();
        const nameEn = (s.name_en || '').toLowerCase();
        return nameAr.includes(q) || nameEn.includes(q);
    });

    return (
        <div className={`min-h-screen ${bg} pb-32 transition-colors duration-300`} dir={ar ? 'rtl' : 'ltr'}>
            {/* BG blob */}
            <div className="fixed top-0 end-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[140px] pointer-events-none translate-x-1/3 -translate-y-1/3" />

            {/* Header */}
            <div className="relative pt-8 pb-6 px-4 max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => router.back()}
                        className={`w-10 h-10 ${card} border rounded-xl flex items-center justify-center transition-all active:scale-95`}>
                        {ar ? <ChevronRight className={`w-5 h-5 ${textC}`} /> : <ChevronLeft className={`w-5 h-5 ${textC}`} />}
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="w-4 h-0.5 bg-primary" />
                            <span className={`text-[9px] font-black uppercase tracking-[0.25em] ${muted}`}>
                                {ar ? 'كابتنا — عالم الرياضة' : 'Captina — Sports World'}
                            </span>
                        </div>
                        <h1 className={`text-2xl font-black ${textC} uppercase tracking-tight`}>
                            {ar ? 'الرياضات المتاحة' : 'Available Sports'}
                        </h1>
                    </div>
                </div>

                {/* Search */}
                <div className={`relative border rounded-2xl overflow-hidden ${card}`}>
                    <Search className={`absolute ${ar ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 ${muted}`} />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder={ar ? 'ابحث عن رياضة...' : 'Search for a sport...'}
                        className={`w-full py-3 ${ar ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-sm font-bold outline-none bg-transparent ${inp}`}
                    />
                </div>
            </div>

            {/* Sports Grid */}
            <div className="px-4 max-w-4xl mx-auto">
                {loadingSports ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className={`aspect-square rounded-3xl animate-pulse ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`} />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-20 text-center">
                        <Dumbbell className={`w-16 h-16 ${muted} opacity-20 mx-auto mb-4`} />
                        <p className={`text-base font-black ${textC}`}>
                            {ar ? 'لا توجد رياضات مطابقة' : 'No sports found'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {filtered.map((sport, idx) => {
                            const id = sport.id || sport.slug;
                            const name = ar ? (sport.name_ar || getText(sport.name)) : (sport.name_en || getText(sport.name));
                            const image = getSportImage(id, sport.heroImg || sport.image || sport.heroBanner);
                            const isFav = favoriteSports.includes(id);

                            return (
                                <motion.div
                                    key={id || idx}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.04 }}
                                    className="relative group"
                                >
                                    <Link href={`/sports/${id}`} className="block">
                                        <div className={`${card} border rounded-3xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl`}>
                                            {/* Image */}
                                            <div className="relative aspect-square overflow-hidden">
                                                <img
                                                    src={image}
                                                    alt={name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                                                {/* Sport name overlay */}
                                                <div className="absolute bottom-0 start-0 end-0 p-3">
                                                    <h3 className="text-white font-black text-sm leading-tight uppercase tracking-wide drop-shadow-lg">
                                                        {name}
                                                    </h3>
                                                </div>

                                                {/* Fav button */}
                                                <button
                                                    onClick={e => { e.preventDefault(); e.stopPropagation(); toggleFavoriteSport(id); }}
                                                    className={`absolute top-2.5 end-2.5 w-8 h-8 rounded-xl backdrop-blur-md border flex items-center justify-center transition-all active:scale-90 z-10 ${isFav ? 'bg-rose-500 border-rose-500 text-white' : 'bg-black/30 border-white/20 text-white hover:bg-rose-500/80'}`}>
                                                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                                                </button>
                                            </div>

                                            {/* Info row */}
                                            <div className={`px-3 py-2.5 flex items-center justify-between ${darkMode ? 'bg-white/5' : 'bg-white'}`}>
                                                <div className="flex items-center gap-2">
                                                    {sport.intensity && (
                                                        <span className="flex items-center gap-1 text-[9px] font-black text-primary">
                                                            <Zap className="w-3 h-3" />
                                                            {getText(sport.intensity)}
                                                        </span>
                                                    )}
                                                    {sport.duration && (
                                                        <span className={`flex items-center gap-1 text-[9px] font-bold ${muted}`}>
                                                            <Clock className="w-3 h-3" />
                                                            {getText(sport.duration)}
                                                        </span>
                                                    )}
                                                </div>
                                                <ArrowRight className={`w-3.5 h-3.5 ${muted} ${ar ? 'rotate-180' : ''} group-hover:text-primary transition-colors`} />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* CTA */}
                {!loadingSports && filtered.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-10 rounded-3xl overflow-hidden relative"
                    >
                        <div className="bg-gradient-to-r from-primary via-rose-600 to-amber-500 p-8 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="relative z-10 space-y-4">
                                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                                    {ar ? 'بوابتك للاحتراف' : 'Your Path to Excellence'}
                                </h2>
                                <p className="text-white/80 text-sm font-bold max-w-md mx-auto">
                                    {ar
                                        ? 'انضم الآن واحصل على تقييم بدني مجاني مع استشارة من خبرائنا الرياضيين.'
                                        : 'Join now and get a free physical assessment with advice from our sports experts.'}
                                </p>
                                <Link href="/booking?trial=true"
                                    className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl">
                                    <Zap className="w-4 h-4" />
                                    {ar ? 'ابدأ الآن — مجاناً' : 'Start Now — Free'}
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
