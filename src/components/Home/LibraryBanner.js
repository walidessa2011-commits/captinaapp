"use client";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import { Sparkles, Play, BookOpen, ArrowLeft } from 'lucide-react';
import { useApp } from "@/context/AppContext";

export default function LibraryBanner() {
    const { language, darkMode, appContent } = useApp();
    const router = useRouter();
    const ar = language === 'ar';

    const banner = appContent?.homepage_banner || {
        badge: { ar: 'المكتبة التعليمية', en: 'LIBRARY' },
        title: { ar: 'اعرف أكثر عن الرياضات القتالية', en: 'Learn Combat Sports' },
        description: { ar: 'فيديوهات تعليمية حصرية من نخبة المدربين.', en: 'Exclusive educational videos from elite coaches.' },
        buttonText: { ar: 'استعرض المكتبة', en: 'Explore Library' },
        link: '/library',
        image: 'https://images.unsplash.com/photo-1590556409324-aa1d726e5c3c?q=80&w=1200'
    };

    const getText = (f) => !f ? '' : typeof f === 'object' ? f[language] || f.ar || f.en || '' : f;

    return (
        <motion.section
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[2rem] cursor-pointer group"
            style={{ minHeight: '200px' }}
            onClick={() => router.push(getText(banner.link) || '/library')}
        >
            {/* BG */}
            <img src={banner.image} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

            {/* Diagonal decorative lines */}
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, white 0, white 1px, transparent 0, transparent 10px)', backgroundSize: '14px 14px' }} />

            {/* Content */}
            <div className="relative z-10 p-7 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-start">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white/70 text-[9px] font-black uppercase tracking-[0.25em]">{getText(banner.badge)}</span>
                    </div>
                    <h2 className="text-lg md:text-2xl font-black text-white mb-1.5 tracking-tight leading-tight max-w-sm">
                        {getText(banner.title)}
                    </h2>
                    <p className="text-white/50 text-xs font-bold max-w-xs leading-relaxed">
                        {getText(banner.description)}
                    </p>
                </div>

                <button onClick={e => { e.stopPropagation(); router.push(getText(banner.link) || '/library'); }}
                    className="flex items-center gap-3 bg-white text-slate-900 px-7 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all whitespace-nowrap shrink-0 group/btn">
                    <div className="w-7 h-7 bg-primary rounded-xl flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                        <Play className="w-3.5 h-3.5 text-white" />
                    </div>
                    {getText(banner.buttonText)}
                    <motion.div animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                        <ArrowLeft className={`w-4 h-4 text-primary ${ar ? '' : 'rotate-180'}`} />
                    </motion.div>
                </button>
            </div>
        </motion.section>
    );
}
