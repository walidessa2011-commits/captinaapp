"use client";
import { motion } from "framer-motion";
import Link from 'next/link';
import { ChevronLeft, Heart, Zap } from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { getSportImage } from "@/lib/sportsData";

export default function SportsSection() {
    const { t, language, darkMode, sports, favoriteSports, toggleFavoriteSport } = useApp();
    const ar = language === 'ar';
    const getText = (f) => !f ? '' : typeof f === 'object' ? f[language] || f.ar || f.en || '' : f;
    if (!Array.isArray(sports) || !sports.length) return null;

    return (
        <section>
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="text-start">
                    <h2 className={`text-base md:text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'} tracking-tight`}>{t('sports')}</h2>
                    <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                        {ar ? 'اختر تحديك القادم' : 'Choose your next challenge'}
                    </p>
                </div>
                <Link href="/sports" className="flex items-center gap-1 text-primary text-[10px] font-black hover:underline">
                    {t('viewAll')}
                    <ChevronLeft className={`w-3.5 h-3.5 ${ar ? '' : 'rotate-180'}`} />
                </Link>
            </div>

            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
                {sports.map((sport, i) => {
                    const name = getText(sport.name) || (ar ? 'رياضة' : 'Sport');
                    const isFav = favoriteSports.includes(sport.id);
                    return (
                        <Link href={`/sports/${sport.id}`} key={sport.id || i} className="flex-shrink-0 w-[42vw] max-w-[170px] md:max-w-[200px] snap-start">
                            <motion.div whileHover={{ y: -6, scale: 1.02 }} className={`relative rounded-[1.8rem] overflow-hidden border-2 group transition-all ${darkMode ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-white shadow-md'} hover:border-primary/40 hover:shadow-primary/10 hover:shadow-xl`}>
                                <div className="aspect-square relative overflow-hidden">
                                    <img src={getSportImage(sport.id, sport.image || sport.heroBanner, language)} alt={name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                                    {/* Fav */}
                                    <button onClick={e => { e.preventDefault(); e.stopPropagation(); toggleFavoriteSport(sport.id); }}
                                        className={`absolute top-2.5 end-2.5 w-8 h-8 rounded-xl backdrop-blur-md flex items-center justify-center border transition-all active:scale-90 ${isFav ? 'bg-rose-500 border-rose-500 text-white shadow-lg' : 'bg-black/20 border-white/20 text-white hover:bg-black/40'}`}>
                                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                                    </button>

                                    {/* Name overlay at bottom */}
                                    <div className="absolute bottom-0 inset-x-0 p-3 text-start">
                                        <p className="text-white text-[10px] md:text-xs font-black uppercase tracking-tight">{name}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
