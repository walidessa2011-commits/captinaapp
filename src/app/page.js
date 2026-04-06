"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Bell, Zap } from 'lucide-react';
import { useApp } from "@/context/AppContext";
import Link from "next/link";

import StatsBanner from "@/components/Home/StatsBanner";
import GoalsSection from "@/components/Home/GoalsSection";
import OffersCarousel from "@/components/Home/OffersCarousel";
import SportsSection from "@/components/Home/SportsSection";
import TrainersSection from "@/components/Home/TrainersSection";
import GymsSection from "@/components/Home/GymsSection";
import MembershipSection from "@/components/Home/MembershipSection";
import LibraryBanner from "@/components/Home/LibraryBanner";
import VideosSection from "@/components/Home/VideosSection";
import DevModal from "@/components/Home/DevModal";

export default function Home() {
    const { t, language, darkMode, userData } = useApp();
    const [devModal, setDevModal] = useState(false);
    const [selectedItemName, setSelectedItemName] = useState('');
    const ar = language === 'ar';

    const handleOpenDevModal = (name) => { setSelectedItemName(name); setDevModal(true); };

    const bg = darkMode ? "bg-[#0a0f1a]" : "bg-slate-50";

    return (
        <div className={`min-h-screen ${bg} transition-colors duration-500 pb-32 relative`} dir={ar ? 'rtl' : 'ltr'}>

            {/* ── Layered Background ── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className={`absolute top-0 end-0 w-[700px] h-[700px] rounded-full blur-[160px] translate-x-1/2 -translate-y-1/3 ${darkMode ? 'bg-primary/15' : 'bg-primary/8'} animate-pulse`} />
                <div className={`absolute bottom-0 start-0 w-[500px] h-[500px] rounded-full blur-[120px] -translate-x-1/2 translate-y-1/3 ${darkMode ? 'bg-blue-500/8' : 'bg-blue-500/4'}`} />
                <div className="absolute inset-0 opacity-[0.015]" style={{
                    backgroundImage: `linear-gradient(${darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'} 1px, transparent 1px), linear-gradient(90deg, ${darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'} 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }} />
            </div>

            {/* ── Header ── */}
            <section className="relative z-10 px-4 pt-5 pb-2 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-between mb-6"
                >
                    {/* ── Logo + Brand Name ── */}
                    <div className="flex items-center gap-3">
                        {/* Logo */}
                        <div className="relative shrink-0">
                            <div className="w-11 h-11 rounded-2xl overflow-hidden bg-primary shadow-lg shadow-primary/30 flex items-center justify-center">
                                <img
                                    src="/logo_captina.jpg"
                                    alt="Captina Logo"
                                    className="w-full h-full object-cover"
                                    onError={e => { e.target.style.display = 'none'; }}
                                />
                            </div>
                            {/* Green active dot */}
                            <span className="absolute -bottom-0.5 -end-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0a0f1a] shadow-sm" />
                        </div>

                        {/* Brand text */}
                        <div className="flex flex-col text-start leading-none">
                            <h1 className={`text-xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                {ar ? 'كابتنا' : 'Captina'}
                            </h1>
                            <span className="text-primary text-[9px] font-black uppercase tracking-[0.2em] mt-0.5">
                                {ar ? 'فنون القتال والدفاع عن النفس' : 'Martial Arts & Self Defense'}
                            </span>
                        </div>
                    </div>

                    {/* ── Actions ── */}
                    <div className="flex items-center gap-2">
                        <Link href="/notifications"
                            className={`relative w-10 h-10 rounded-2xl flex items-center justify-center border transition-all hover:scale-105 active:scale-95 ${darkMode ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-white border-gray-200 text-gray-600 shadow-sm'}`}>
                            <Bell className="w-4 h-4" />
                            <span className="absolute top-2 end-2 w-1.5 h-1.5 bg-primary rounded-full ring-1 ring-white dark:ring-[#0a0f1a]" />
                        </Link>
                        <Link href="/booking?trial=true"
                            className="flex items-center gap-1.5 px-3 py-2.5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all whitespace-nowrap">
                            <Zap className="w-3.5 h-3.5" />
                            {ar ? 'احجز الآن' : 'Book Now'}
                        </Link>
                    </div>
                </motion.div>

                <StatsBanner />
            </section>

            <GoalsSection />

            <main className="relative z-10 max-w-7xl mx-auto px-4 space-y-8">
                <OffersCarousel onDevModal={handleOpenDevModal} />
                <SportsSection />
                <TrainersSection />

                {/* ── Trial CTA Banner ── */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8"
                >
                    <div className="absolute top-0 end-0 w-48 h-48 bg-primary/20 rounded-full blur-[60px] pointer-events-none" />
                    <div className="absolute bottom-0 start-0 w-32 h-32 bg-blue-500/15 rounded-full blur-[40px] pointer-events-none" />
                    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)', backgroundSize: '14px 14px' }} />

                    <div className="relative flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-1 text-start">
                            <span className="inline-block text-[9px] font-black text-primary bg-primary/15 border border-primary/30 px-3 py-1 rounded-full uppercase tracking-widest mb-3">
                                {ar ? '🎁 عرض خاص' : '🎁 Special Offer'}
                            </span>
                            <h3 className="text-xl md:text-2xl font-black text-white mb-1 leading-tight">
                                {ar ? 'حصتك التجريبية مجاناً' : 'Your Trial Session is FREE'}
                            </h3>
                            <p className="text-white/50 text-xs font-bold leading-relaxed">
                                {ar ? 'جرّب التدريب مع أفضل المدربين بدون أي التزام.' : "Train with elite coaches with zero commitment."}
                            </p>
                        </div>
                        <Link href="/booking?trial=true"
                            className="shrink-0 px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap">
                            <Zap className="w-4 h-4" />
                            {ar ? 'احجز مجاناً' : 'Book Free'}
                        </Link>
                    </div>
                </motion.div>

                <GymsSection />
                <MembershipSection onDevModal={handleOpenDevModal} />
                <LibraryBanner />
                <VideosSection />
            </main>

            <DevModal isOpen={devModal} onClose={() => setDevModal(false)} itemName={selectedItemName} />
        </div>
    );
}
