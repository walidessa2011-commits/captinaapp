"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Users, Crown, ArrowRight, UserCheck, Heart } from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { trainersData } from "@/lib/trainersData";

export default function TrainerCard({ trainer, idx }) {
    const { language, darkMode, favoriteTrainers, toggleFavoriteTrainer, getText } = useApp();
    
    const isFavorite = favoriteTrainers.includes(trainer.id);

    const handleToggleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavoriteTrainer(trainer.id);
    };

    // Process specialties/expertise
    const expertise = (trainer.expertise || []).map(e => getText(e));
    const specialtyText = getText(trainer.specialty);
    const specialties = specialtyText ? specialtyText.split('-').map(s => s.trim()) : [];
    const allSkills = [...new Set([...expertise, ...specialties])];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group"
        >
            <Link href={`/trainers/${trainer.id}`}>
                <div className="relative bg-white/80 dark:bg-[#1a2235]/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-premium transition-all duration-500 hover:shadow-active hover:-translate-y-2 flex flex-col h-full active:scale-[0.98]">
                    {/* Profile Media */}
                    <div className="relative aspect-[4/5] overflow-hidden m-1.5 rounded-[2.2rem]">
                        {(() => {
                            // Find static data by ID or by matching name (AR/EN)
                            const getStaticData = () => {
                                if (trainersData[trainer.id]) return trainersData[trainer.id];
                                
                                // Search by name (handling both string and object names)
                                return Object.values(trainersData).find(t => {
                                    const trainerName = typeof trainer.name === 'object' ? trainer.name : { ar: trainer.name, en: trainer.name };
                                    
                                    const normalize = (name) => name?.replace(/كابتن|captain/gi, '').trim() || "";
                                    
                                    const dbAr = normalize(trainerName.ar);
                                    const dbEn = normalize(trainerName.en);
                                    const staticAr = normalize(t.name.ar);
                                    const staticEn = normalize(t.name.en);

                                    return (
                                        (dbAr && staticAr && (staticAr.includes(dbAr) || dbAr.includes(staticAr))) ||
                                        (dbEn && staticEn && (staticEn.toLowerCase().includes(dbEn.toLowerCase()) || dbEn.toLowerCase().includes(staticEn.toLowerCase())))
                                    );
                                });
                            };

                            const staticData = getStaticData();
                            const imgSrc = trainer.image || staticData?.profileImage;

                            return (
                                <img 
                                    src={imgSrc || "/trainers/default_trainer.png"}
                                    alt={getText(trainer.name)}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            );
                        })()}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    
                        {/* Top Icons */}
                        <div className="absolute top-4 start-4 end-4 flex justify-between items-center">
                            <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-black flex items-center gap-1.5 border border-white/30 shadow-lg">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                <span>{trainer.rating || "5.0"}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={handleToggleFavorite}
                                    className={`w-8 h-8 rounded-xl backdrop-blur-md flex items-center justify-center border transition-all active:scale-90 ${isFavorite ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-white/20 border-white/30 text-white hover:bg-white/40'}`}
                                >
                                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                                </button>
                                
                                {(trainer.premium || trainer.verified) && (
                                    <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-[0_4px_15px_rgba(255,0,0,0.4)] border border-primary/50">
                                        <Crown className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>
                        </div>
 
                        {/* Name & Specialty Over Image */}
                        <div className="absolute bottom-6 start-6 end-6">
                            <h3 className="text-lg font-black text-white tracking-tight leading-tight group-hover:text-primary transition-colors mb-1 truncate">
                                {getText(trainer.name)}
                            </h3>
                            <div className="flex items-center gap-2">
                                <div className="h-1 w-4 bg-primary rounded-full"></div>
                                <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest truncate">
                                    {allSkills[0] || (language === 'ar' ? "مدرب محترف" : "Professional Trainer")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Actions/Stats */}
                    <div className="p-4 pt-1 flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 py-2 px-3 rounded-2xl border border-gray-100 dark:border-white/10 flex-1">
                            <Users className="w-3.5 h-3.5 text-primary" />
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter leading-none">{language === 'ar' ? 'طلاب' : 'Students'}</span>
                                <span className="text-[11px] font-black text-slate-900 dark:text-white leading-none mt-0.5">{trainer.students || "100"}+</span>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center ms-2 group-hover:bg-primary group-hover:text-white transition-all shadow-lg shadow-black/5">
                            <ArrowRight className={`w-4 h-4 transition-transform ${language === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
