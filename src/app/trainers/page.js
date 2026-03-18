"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { 
    Search, ChevronLeft, ChevronRight, 
    Activity, Target
} from 'lucide-react';
import { useApp } from "@/context/AppContext";
import Link from 'next/link';
import TrainerCard from '@/components/TrainerCard';

export default function Trainers() {
    const { t, language, darkMode } = useApp();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [trainers, setTrainers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const q = query(collection(db, "trainers"), where("status", "==", "active"));
                const trainersSnap = await getDocs(q);
                setTrainers(trainersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching trainers:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTrainers();
    }, []);

    const sports = t('pageSportsData') || [];

    const sportsList = [
        { id: 'all', name: language === 'ar' ? 'الكل' : 'All', icon: <Activity className="w-4 h-4" /> },
        ...sports.map(s => ({ 
            id: s.id, 
            name: s.name, 
            icon: <Target className="w-4 h-4" /> 
        }))
    ];

    const filteredTrainers = trainers.filter(trainer => {
        const name = trainer.name || "";
        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
        
        const selectedSport = activeCategory === "all" ? null : sportsList.find(s => s.id === activeCategory);
        const selectedSportName = selectedSport?.name || "";
        
        // Check specialty string
        const specialties = (trainer.specialty || "").split('-').map(s => s.trim().toLowerCase());
        // Check expertise array
        const expertise = (trainer.expertise || []).map(e => e.toLowerCase());
        
        const matchesSport = activeCategory === "all" || 
                           specialties.some(s => s.includes(selectedSportName.toLowerCase())) ||
                           expertise.some(e => e.includes(selectedSportName.toLowerCase()));
        
        return matchesSearch && matchesSport;
    });

    return (
        <div className={`min-h-screen ${darkMode ? "bg-[#0a0f1a]" : "bg-slate-50"} relative overflow-hidden pb-40 transition-colors duration-500`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px] -z-0 -translate-x-1/2 translate-y-1/2"></div>
            
            {/* Compact Immersive Header */}
            <div className="relative h-28 md:h-32 w-full overflow-hidden flex items-center px-6">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-primary/20"></div>
                
                <div className="max-w-7xl mx-auto w-full flex items-center justify-between relative z-20">
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/"
                            className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all shadow-xl"
                        >
                            {language === 'ar' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                        </Link>
                        
                        <motion.h1 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-xl md:text-3xl font-black text-white tracking-tighter uppercase italic drop-shadow-2xl"
                        >
                            {language === 'ar' ? 'نخبة المدربين' : 'Elite Trainers'}
                        </motion.h1>
                    </div>

                    <div className="hidden sm:flex items-center gap-4">
                        <div className="relative group">
                            <Search className={`absolute ${language === 'en' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/50 group-focus-within:text-white transition-colors`} />
                            <input 
                                type="text"
                                placeholder={language === 'ar' ? 'ابحث...' : 'Search...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl py-2 h-9 px-9 text-[10px] font-black text-white outline-none focus:border-white/30 transition-all placeholder:opacity-40 w-40 lg:w-60"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Specialty Tabs */}
            <div className="relative z-20 px-6 mt-4">
                <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto no-scrollbar py-2 w-full">
                    {sportsList.map((sport) => (
                        <button
                            key={sport.id}
                            onClick={() => setActiveCategory(sport.id)}
                            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${
                                activeCategory === sport.id 
                                ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' 
                                : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-transparent dark:border-white/5 hover:border-primary/30'
                            }`}
                        >
                            <span className={`${activeCategory === sport.id ? 'text-white' : 'text-primary'}`}>{sport.icon}</span>
                            {sport.name}
                        </button>
                    ))}
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 mt-6 relative z-10">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredTrainers.map((trainer, idx) => (
                                <TrainerCard key={trainer.id} trainer={trainer} idx={idx} />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </main>

            {/* Empty State */}
            {!isLoading && filteredTrainers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-40 opacity-50">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest italic text-center">
                        {language === 'ar' ? 'لم يتم العثور على مدربين بهذا القسم' : 'No coaches found in this section'}
                    </p>
                </div>
            )}
        </div>
    );
}
