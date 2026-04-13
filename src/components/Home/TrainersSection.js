"use client";
import Link from 'next/link';
import { ChevronLeft, Star, Shield } from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";

export default function TrainersSection() {
    const { t, language, darkMode, trainers } = useApp();
    const ar = language === 'ar';
    const getText = (f) => !f ? '' : typeof f === 'object' ? f[language] || f.ar || f.en || '' : f;
    if (!Array.isArray(trainers) || !trainers.length) return null;

    return (
        <section>
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="text-start">
                    <h2 className={`text-base md:text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'} tracking-tight`}>{t('trainers')}</h2>
                    <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                        {ar ? 'نخبة المدربين المعتمدين' : 'Certified elite coaches'}
                    </p>
                </div>
                <Link href="/trainers" className="flex items-center gap-1 text-primary text-[10px] font-black hover:underline">
                    {t('viewAll')}
                    <ChevronLeft className={`w-3.5 h-3.5 ${ar ? '' : 'rotate-180'}`} />
                </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
                {trainers.map((trainer, i) => {
                    const name = getText(trainer.name);
                    const spec = getText(trainer.specialty) || getText(trainer.title) || '';
                    return (
                        <Link href={`/trainers/${trainer.id}`} key={trainer.id || i} className="flex-shrink-0 w-44 md:w-52 snap-start">
                            <motion.div whileHover={{ y: -5 }}
                                className={`rounded-[1.8rem] border overflow-hidden group transition-all ${darkMode ? 'bg-white/5 border-white/8 hover:border-white/15' : 'bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200'}`}>
                                {/* Photo */}
                                <div className="relative aspect-square overflow-hidden rounded-t-[1.6rem]">
                                    <img src={trainer.image || trainer.profileImage || 'https://images.unsplash.com/photo-1567013127542-490d757e51fe?q=80&w=400'}
                                        alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    {/* Rating badge */}
                                    {trainer.rating && (
                                        <div className="absolute bottom-3 start-3 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full">
                                            <Star className="w-2.5 h-2.5 text-amber-400 fill-current" />
                                            <span className="text-[9px] font-black text-white">{trainer.rating}</span>
                                        </div>
                                    )}
                                    {/* Verified badge */}
                                    <div className="absolute top-3 end-3 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                        <Shield className="w-3.5 h-3.5 text-white" />
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-3 text-start">
                                    <p className={`text-xs font-black ${darkMode ? 'text-white' : 'text-slate-900'} truncate`}>{name}</p>
                                    {spec && <p className={`text-[9px] font-bold ${darkMode ? 'text-white/40' : 'text-gray-400'} truncate mt-0.5 uppercase tracking-wider`}>{spec}</p>}
                                </div>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
