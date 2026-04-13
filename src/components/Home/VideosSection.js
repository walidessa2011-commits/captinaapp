"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Play, Clock } from 'lucide-react';
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";

export default function VideosSection() {
    const { t, language, darkMode } = useApp();
    const router = useRouter();
    const ar = language === 'ar';
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        getDocs(query(collection(db, "library"), where("status", "==", "active"), limit(8)))
            .then(snap => setVideos(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
            .catch(() => {});
    }, []);

    if (!videos.length) return null;

    const getText = (f) => !f ? '' : typeof f === 'object' ? f[language] || f.ar || f.en || '' : f;

    return (
        <section>
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="text-start">
                    <h2 className={`text-base md:text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'} tracking-tight`}>
                        {ar ? 'أحدث الفيديوهات' : 'Latest Videos'}
                    </h2>
                    <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                        {ar ? 'محتوى تدريبي حصري' : 'Exclusive training content'}
                    </p>
                </div>
                <Link href="/library" className="flex items-center gap-1 text-primary text-[10px] font-black hover:underline">
                    {t('viewAll')}
                    <ChevronLeft className={`w-3.5 h-3.5 ${ar ? '' : 'rotate-180'}`} />
                </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
                {videos.map((vid, i) => (
                    <motion.button key={vid.id} whileHover={{ y: -4 }}
                        onClick={() => router.push(`/library/${vid.category}/${vid.id}`)}
                        className={`flex-shrink-0 w-48 md:w-60 snap-start text-start rounded-[1.5rem] overflow-hidden border group transition-all ${darkMode ? 'bg-white/5 border-white/8' : 'bg-white border-gray-100 shadow-sm hover:shadow-md'}`}>
                        {/* Thumbnail */}
                        <div className="relative aspect-video overflow-hidden">
                            <img src={vid.thumbnailUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400'}
                                alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-600" />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
                            {/* Play button */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                                <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
                                    <Play className="w-4 h-4 text-primary ms-0.5" />
                                </div>
                            </div>
                            {/* Duration */}
                            {vid.duration && (
                                <div className="absolute bottom-2 end-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md">
                                    <Clock className="w-2.5 h-2.5 text-white/70" />
                                    <span className="text-[8px] font-black text-white">{vid.duration}</span>
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="p-3">
                            <p className={`text-[10px] font-black ${darkMode ? 'text-white' : 'text-slate-900'} line-clamp-2 uppercase leading-tight mb-1`}>
                                {getText(vid.title)}
                            </p>
                            <p className={`text-[8px] font-bold uppercase tracking-wider ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>{vid.category}</p>
                        </div>
                    </motion.button>
                ))}
            </div>
        </section>
    );
}
