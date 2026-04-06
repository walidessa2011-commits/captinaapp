"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation';
import { Sparkles, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useApp } from "@/context/AppContext";

export default function OffersCarousel({ onDevModal }) {
    const { offers, language, darkMode } = useApp();
    const router = useRouter();
    const ar = language === 'ar';
    const [current, setCurrent] = useState(0);

    const hasOffers = Array.isArray(offers) && offers.length > 0;

    useEffect(() => {
        if (!hasOffers) return;
        const t = setInterval(() => setCurrent(p => (p + 1) % offers.length), 5000);
        return () => clearInterval(t);
    }, [hasOffers, offers.length]);

    if (!hasOffers) return null;

    const offer = offers[current];

    const handleAction = () => {
        if (offer.id === 'offer-trial-free' || offer.id === 'trial') {
            router.push(`/offers/${offer.id}`);
        } else {
            onDevModal(offer.title);
        }
    };

    return (
        <section>
            <div className="relative h-56 md:h-64 rounded-[2rem] overflow-hidden shadow-2xl shadow-black/20 cursor-pointer group" onClick={handleAction}>
                <AnimatePresence mode="wait">
                    <motion.div key={current} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0">
                        <img src={offer.image || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200'}
                            alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                        {/* overlays */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </motion.div>
                </AnimatePresence>

                {/* Content */}
                <div className="relative z-10 p-6 md:p-10 h-full flex flex-col justify-between">
                    <div>
                        {/* Badge */}
                        <motion.div key={`badge-${current}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                            <span className="inline-flex items-center gap-1.5 bg-primary text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-primary/40 mb-4">
                                <Sparkles className="w-3 h-3" />
                                {offer.badge || (ar ? 'عرض حصري' : 'Exclusive Offer')}
                            </span>
                        </motion.div>

                        <motion.h2 key={`title-${current}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                            className="text-xl md:text-3xl font-black text-white tracking-tight leading-tight mb-2 max-w-sm">
                            {offer.title}
                        </motion.h2>

                        <motion.p key={`sub-${current}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                            className="text-white/60 text-xs font-bold max-w-xs leading-relaxed line-clamp-2">
                            {offer.subtitle}
                        </motion.p>
                    </div>

                    {/* CTA */}
                    <div className="flex items-end justify-between mt-6">
                        <button onClick={e => { e.stopPropagation(); handleAction(); }}
                            className="flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">
                            {ar ? 'احتجز الآن' : 'Claim Offer'}
                            <ArrowRight className={`w-3.5 h-3.5 text-primary ${ar ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dots */}
                        <div className="flex gap-1.5 items-center pb-1">
                            {offers.map((_, i) => (
                                <button key={i} onClick={e => { e.stopPropagation(); setCurrent(i); }}
                                    className={`h-1.5 rounded-full transition-all duration-400 ${i === current ? 'w-8 bg-white shadow-lg' : 'w-2 bg-white/30 hover:bg-white/50'}`} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Arrow nav */}
                <button onClick={e => { e.stopPropagation(); setCurrent(p => (p - 1 + offers.length) % offers.length); }}
                    className="absolute top-1/2 start-4 -translate-y-1/2 w-9 h-9 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 active:scale-90">
                    {ar ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
                <button onClick={e => { e.stopPropagation(); setCurrent(p => (p + 1) % offers.length); }}
                    className="absolute top-1/2 end-4 -translate-y-1/2 w-9 h-9 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 active:scale-90">
                    {ar ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
            </div>
        </section>
    );
}
