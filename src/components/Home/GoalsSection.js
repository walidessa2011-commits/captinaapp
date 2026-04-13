"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from "@/context/AppContext";

export default function GoalsSection() {
    const { language, darkMode, goals, activeSubscription } = useApp();
    const ar = language === 'ar';
    const [showAll, setShowAll] = useState(false);

    const userSport = activeSubscription?.sportName || 'general';
    const filtered = goals.filter(g => g.sport === userSport || g.sport === 'general');

    if (!activeSubscription || filtered.length === 0) return null;

    const visible = showAll ? filtered : filtered.slice(0, 4);

    return (
        <section className="max-w-7xl mx-auto px-4 mb-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center">
                        <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <h2 className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {ar ? 'أهدافك الرياضية' : 'Training Goals'}
                    </h2>
                </div>
                {filtered.length > 4 && (
                    <button onClick={() => setShowAll(s => !s)}
                        className="flex items-center gap-1 text-[10px] font-black text-primary hover:underline">
                        {showAll ? (ar ? 'عرض أقل' : 'Less') : (ar ? 'عرض الكل' : 'See All')}
                        {showAll ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                )}
            </div>

            <div className={`flex ${showAll ? 'flex-col gap-2' : 'gap-3 overflow-x-auto pb-2 no-scrollbar snap-x -mx-4 px-4'}`}>
                {visible.map((goal, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex-shrink-0 ${showAll ? 'w-full' : 'w-[150px] md:w-[170px]'} snap-start rounded-2xl border p-3 flex items-center gap-3 ${darkMode ? 'bg-white/5 border-white/8' : 'bg-white border-gray-100 shadow-sm'}`}
                    >
                        {/* Circular progress */}
                        <div className="relative w-10 h-10 shrink-0">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
                                <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="3"
                                    className={darkMode ? 'text-white/8' : 'text-gray-100'} />
                                <motion.circle
                                    cx="20" cy="20" r="16" fill="none"
                                    stroke="currentColor" strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeDasharray={100.5}
                                    initial={{ strokeDashoffset: 100.5 }}
                                    animate={{ strokeDashoffset: 100.5 * (1 - goal.percentage / 100) }}
                                    transition={{ duration: 1.2, ease: 'easeOut' }}
                                    className="text-primary"
                                />
                            </svg>
                            <span className={`absolute inset-0 flex items-center justify-center text-[9px] font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                {goal.percentage}%
                            </span>
                        </div>
                        <div className="flex-1 min-w-0 text-start">
                            <p className={`text-[9px] font-black ${darkMode ? 'text-white' : 'text-slate-900'} truncate uppercase tracking-tight`}>{goal.text}</p>
                            <p className={`text-[8px] font-bold ${darkMode ? 'text-white/40' : 'text-gray-400'} line-clamp-1 mt-0.5`}>{goal.sub}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
