"use client";
import { motion } from "framer-motion";
import { Flame, Activity, TrendingUp, Users, Zap } from 'lucide-react';
import { useApp } from "@/context/AppContext";
import Link from "next/link";

export default function StatsBanner() {
    const { language, darkMode, userData, activeSubscription } = useApp();
    const ar = language === 'ar';

    const stats = [
        {
            label: ar ? 'السعرات' : 'Calories',
            val: userData?.calories?.toLocaleString() || '—',
            icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10',
            sub: 'kcal'
        },
        {
            label: ar ? 'الحصص' : 'Sessions',
            val: userData?.workoutsCount || '—',
            icon: Activity, color: 'text-primary', bg: 'bg-primary/8',
            sub: ar ? 'حصة' : 'done'
        },
        {
            label: ar ? 'الوزن' : 'Weight',
            val: userData?.weight || '—',
            icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10',
            sub: 'kg'
        },
        {
            label: ar ? 'المدربون' : 'Coaches',
            val: userData?.activeCoaches || '—',
            icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10',
            sub: ar ? 'نشط' : 'active'
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
            {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className={`relative rounded-2xl border p-4 flex flex-col gap-2 overflow-hidden group transition-all hover:-translate-y-0.5 hover:shadow-md ${darkMode ? 'bg-white/5 border-white/8' : 'bg-white border-gray-100 shadow-sm'}`}
                    >
                        {/* subtle bg glow */}
                        <div className={`absolute -top-3 -end-3 w-12 h-12 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity ${stat.bg}`} />

                        <div className="flex items-center justify-between">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${stat.bg}`}>
                                <Icon className={`w-4 h-4 ${stat.color}`} />
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-wider ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>{stat.label}</span>
                        </div>

                        <div className="flex items-baseline gap-1 text-start">
                            <span className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'} leading-none`}>{stat.val}</span>
                            <span className={`text-[9px] font-bold ${darkMode ? 'text-white/30' : 'text-gray-400'} uppercase`}>{stat.sub}</span>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
