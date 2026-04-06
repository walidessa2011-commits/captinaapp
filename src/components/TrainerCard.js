"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Users, Shield, Heart } from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { trainersData } from "@/lib/trainersData";

export default function TrainerCard({ trainer, idx }) {
    const { language, darkMode, favoriteTrainers, toggleFavoriteTrainer, getText } = useApp();
    const ar = language === 'ar';
    const isFav = (favoriteTrainers || []).includes(trainer.id);

    const getImg = () => {
        if (trainer.image) return trainer.image;
        const staticData = trainersData[trainer.id] || Object.values(trainersData).find(t => {
            const norm = s => (s || '').replace(/كابتن|captain/gi, '').trim();
            const trName = typeof trainer.name === 'object' ? trainer.name : { ar: trainer.name, en: trainer.name };
            return norm(t.name?.ar)?.includes(norm(trName.ar)) || norm(t.name?.en)?.toLowerCase().includes(norm(trName.en)?.toLowerCase());
        });
        return staticData?.profileImage || '/trainers/default_trainer.png';
    };

    const name = getText(trainer.name);
    const spec = getText(trainer.specialty) || getText(trainer.expertise?.[0]) || (ar ? 'مدرب محترف' : 'Pro Trainer');
    const img = getImg();

    const card = darkMode ? "bg-white/5 border-white/8" : "bg-white border-gray-100 shadow-sm";
    const textC = darkMode ? "text-white" : "text-slate-900";
    const muted = darkMode ? "text-gray-400" : "text-gray-500";

    return (
        <motion.div layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: Math.min(idx * 0.05, 0.4) }}>
            <Link href={`/trainers/${trainer.id}`}>
                <div className={`group relative ${card} border rounded-[1.8rem] overflow-hidden hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 cursor-pointer`}>

                    {/* Photo */}
                    <div className="relative aspect-square overflow-hidden">
                        <img src={img} alt={name} referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

                        {/* Verified */}
                        <div className="absolute top-2.5 start-2.5">
                            <div className="w-7 h-7 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                                <Shield className="w-3.5 h-3.5 text-white" />
                            </div>
                        </div>

                        {/* Fav */}
                        <button onClick={e => { e.preventDefault(); e.stopPropagation(); toggleFavoriteTrainer?.(trainer.id); }}
                            className={`absolute top-2.5 end-2.5 w-8 h-8 rounded-xl backdrop-blur-md flex items-center justify-center border transition-all active:scale-90 ${isFav ? 'bg-rose-500 border-rose-500 text-white shadow-lg' : 'bg-black/20 border-white/20 text-white hover:bg-black/40'}`}>
                            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                        </button>

                        {/* Rating */}
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
}
