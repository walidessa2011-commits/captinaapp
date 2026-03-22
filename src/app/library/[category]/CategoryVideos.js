"use client";
import React, { use, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Play, Clock, Share2, Search, PlaySquare, X } from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { useRouter } from 'next/navigation';
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function CategoryVideos({ params }) {
    const { language, darkMode } = useApp();
    const router = useRouter();
    const categoryId = params.category;

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeVideo, setActiveVideo] = useState(null);

    const bgClass = darkMode ? "bg-[#0a0f1a]" : "bg-slate-50";
    const textClass = darkMode ? "text-white" : "text-gray-900";
    const cardBg = darkMode ? "bg-white/5 border-white/5" : "bg-white border-gray-100";
    const textMuted = darkMode ? "text-gray-400" : "text-gray-500";

    useEffect(() => {
        fetchVideos();
    }, [categoryId]);

    const fetchVideos = async () => {
        setLoading(true);
        try {
            const q = query(
                collection(db, "library"), 
                where("status", "==", "active")
            );
            const snapshot = await getDocs(q);
            const videosList = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(v => v.category === categoryId)
                .sort((a, b) => {
                    const dateA = a.createdAt?.seconds || 0;
                    const dateB = b.createdAt?.seconds || 0;
                    return dateB - dateA;
                });
            setVideos(videosList);
        } catch (error) {
            console.error("Error fetching videos:", error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryDetails = () => {
        switch(categoryId) {
            case 'educational': return { title: language === 'ar' ? 'فيديوهات تعليمية لكل رياضة' : 'Educational Videos', badge: 'PRO' };
            case 'trainees': return { title: language === 'ar' ? 'فيديوهات المتدربين' : 'Trainees Achievements', badge: 'ACHIEVED' };
            case 'trainers': return { title: language === 'ar' ? 'فيديوهات المدربين' : 'Trainers Guidance', badge: 'TIPS' };
            default: return { title: language === 'ar' ? 'فيديوهات أخرى' : 'Miscellaneous', badge: 'MORE' };
        }
    }

    const details = getCategoryDetails();

    const filteredVideos = videos.filter(v => 
        v.title[language]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description[language]?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`min-h-screen ${bgClass} transition-colors duration-500 pb-32`}>
            {/* Header - Pill Style */}
            <div className={`sticky top-0 z-40 ${darkMode ? 'bg-[#0a0f1a]/80' : 'bg-slate-50/80'} backdrop-blur-xl border-b ${darkMode ? 'border-white/5' : 'border-gray-200'} px-4 py-4 md:py-6`}>
                <div className="container mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => router.back()}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30 active:scale-95 transition-all`}
                        >
                            <ChevronLeft className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                        </button>
                        <div className="flex flex-col text-start">
                            <h1 className={`text-lg md:text-2xl font-black ${textClass} tracking-tighter flex items-center gap-2 truncate max-w-[200px] md:max-w-[400px]`}>
                                {details.title}
                            </h1>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                <span onClick={() => router.push('/library')} className="cursor-pointer hover:text-primary">{language === 'ar' ? 'المكتبة' : 'Library'}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                <span className="text-primary truncate">{details.title}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 pt-6">
                {/* Search Bar matching other pages */}
                <div className={`mb-6 p-2 rounded-[1.5rem] flex items-center gap-3 w-full ${cardBg} shadow-sm border`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                        <Search className="w-4 h-4" />
                    </div>
                    <input 
                        type="text"
                        placeholder={language === 'ar' ? "ابحث عن فيديو..." : "Search for a video..."}
                        className={`flex-1 bg-transparent border-none outline-none text-xs md:text-sm font-bold ${textClass} placeholder-gray-400`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{language === 'ar' ? 'جاري التحميل...' : 'Fetching Data...'}</span>
                    </div>
                ) : filteredVideos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVideos.map((vid, i) => (
                            <motion.div 
                                key={vid.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => setActiveVideo(vid)}
                                className={`group cursor-pointer rounded-[2rem] overflow-hidden ${cardBg} border shadow-lg hover:shadow-xl transition-all block`}
                            >
                                {/* Thumbnail */}
                                <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                                    <img 
                                        src={vid.thumbnailUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600'} 
                                        className="w-full h-full object-cover group-hover:scale-110 group-hover:opacity-80 transition-all duration-500" 
                                        alt={vid.title[language]} 
                                    />
                                    
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
                                    
                                    {/* Badge */}
                                    <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-md px-2 py-1 rounded-lg">
                                        <span className="text-white text-[8px] font-black uppercase tracking-widest">{details.badge}</span>
                                    </div>
                                    
                                    {/* Duration */}
                                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-white/10">
                                        <Clock className="w-3 h-3 text-white" />
                                        <span className="text-white text-[10px] font-black">{vid.duration}</span>
                                    </div>

                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                        <div className="w-14 h-14 bg-primary/90 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary),0.5)] transform scale-50 group-hover:scale-100 transition-transform duration-300">
                                            <Play className="w-6 h-6 ml-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-4 text-start">
                                    <h3 className={`text-sm md:text-base font-black ${textClass} line-clamp-2 mb-2 leading-tight uppercase`}>
                                        {vid.title[language]}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <p className={`text-[10px] font-bold ${textMuted}`}>
                                            {vid.views || 0} {language === 'ar' ? 'مشاهدة' : 'views'}
                                        </p>
                                        <button className={`p-2 rounded-xl border ${darkMode ? 'border-white/10 hover:bg-white/10' : 'border-gray-200 hover:bg-gray-100'} transition-colors`}>
                                            <Share2 className="w-3 h-3 text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center gap-4 opacity-40">
                        <PlaySquare className="w-20 h-20 text-gray-400" />
                        <h2 className={`text-xl font-black ${textClass} uppercase tracking-tight`}>
                            {language === 'ar' ? 'لا توجد فيديوهات متاحة حالياً' : 'No Videos Found'}
                        </h2>
                    </div>
                )}
            </main>

            {/* Video Player Modal */}
            <AnimatePresence>
                {activeVideo && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveVideo(null)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-5xl aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl border border-white/10"
                        >
                            <button 
                                onClick={() => setActiveVideo(null)}
                                className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-2xl flex items-center justify-center backdrop-blur-md transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            
                            {activeVideo.videoUrl.includes('youtube.com') || activeVideo.videoUrl.includes('youtu.be') ? (
                                <iframe 
                                    src={activeVideo.videoUrl.replace('watch?v=', 'embed/').split('&')[0]}
                                    className="w-full h-full"
                                    allowFullScreen
                                    title="Video Player"
                                />
                            ) : (
                                <video 
                                    src={activeVideo.videoUrl} 
                                    className="w-full h-full" 
                                    controls 
                                    autoPlay
                                />
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
