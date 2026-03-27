"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, PlaySquare, Clock, Eye, Share2, Play, Info, ThumbsUp, MessageCircle, MoreVertical, X, Dumbbell } from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { getYouTubeEmbedUrl, getYouTubeId } from "@/lib/utils";
import { useRouter } from 'next/navigation';
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, limit, getDocs } from "firebase/firestore";

export default function VideoDetail({ params }) {
    const { language, darkMode, t } = useApp();
    const router = useRouter();
    const { category, videoId } = params;

    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedVideos, setRelatedVideos] = useState([]);

    const bgClass = darkMode ? "bg-[#0a0f1a]" : "bg-slate-50";
    const textClass = darkMode ? "text-white" : "text-gray-900";
    const cardBg = darkMode ? "bg-white/5 border-white/5 shadow-2xl" : "bg-white border-gray-100 shadow-xl";
    const textMuted = darkMode ? "text-gray-400" : "text-gray-500";

    useEffect(() => {
        const fetchVideo = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, "library", videoId);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    setVideo({ id: docSnap.id, ...docSnap.data() });
                    // Fetch related videos from same category
                    const q = query(
                        collection(db, "library"),
                        where("category", "==", category),
                        where("status", "==", "active"),
                        limit(4)
                    );
                    const querySnapshot = await getDocs(q);
                    setRelatedVideos(querySnapshot.docs
                        .map(d => ({ id: d.id, ...d.data() }))
                        .filter(v => v.id !== videoId)
                    );
                }
            } catch (error) {
                console.error("Error fetching video:", error);
            } finally {
                setLoading(false);
            }
        };

        if (videoId) fetchVideo();
    }, [videoId, category]);

    const getCategoryTitle = (catId) => {
        switch(catId) {
            case 'educational': return language === 'ar' ? 'فيديوهات تعليمية' : 'Educational Videos';
            case 'trainees': return language === 'ar' ? 'فيديوهات المتدربين' : 'Trainees Videos';
            case 'trainers': return language === 'ar' ? 'فيديوهات المدربين' : 'Trainers Guidance';
            default: return language === 'ar' ? 'فيديوهات أخرى' : 'Miscellaneous';
        }
    }

    if (loading) {
        return (
            <div className={`min-h-screen ${bgClass} flex flex-col items-center justify-center gap-4`}>
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{language === 'ar' ? 'جاري تحميل الفيديو...' : 'Loading Content...'}</span>
            </div>
        );
    }

    if (!video) {
        return (
            <div className={`min-h-screen ${bgClass} flex flex-col items-center justify-center p-6 text-center gap-6`}>
                <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center">
                    <X className="w-12 h-12 text-red-500" />
                </div>
                <h2 className={`text-2xl font-black ${textClass} uppercase tracking-tighter`}>
                    {language === 'ar' ? 'الفيديو غير متاح حالياً' : 'Video Not Available'}
                </h2>
                <button 
                    onClick={() => router.push(`/library/${category}`)}
                    className="px-8 py-3 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest"
                >
                    {language === 'ar' ? 'العودة للمكتبة' : 'Back to Library'}
                </button>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${bgClass} transition-colors duration-500 pb-32`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Nav Header */}
            <div className={`sticky top-0 z-50 ${darkMode ? 'bg-[#0a0f1a]/80' : 'bg-slate-50/80'} backdrop-blur-xl border-b ${darkMode ? 'border-white/5' : 'border-gray-200'} px-4 py-4 md:py-6`}>
                <div className="container mx-auto flex items-center gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30 active:scale-95 transition-all"
                    >
                        {language === 'ar' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                    <div className="flex flex-col text-start overflow-hidden">
                        <h1 className={`text-sm md:text-lg font-black ${textClass} tracking-tight truncate`}>
                            {video.title[language]}
                        </h1>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                            {getCategoryTitle(video.category)}
                        </span>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Primary Player Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Video Player */}
                        <div className="aspect-video w-full bg-black rounded-[2.5rem] overflow-hidden shadow-2xl relative border-4 border-white/5 p-2">
                             {getYouTubeId(video.videoUrl) ? (
                                <iframe 
                                    src={getYouTubeEmbedUrl(video.videoUrl)}
                                    className="w-full h-full rounded-[1.8rem]"
                                    allowFullScreen
                                    title="Video Player"
                                />
                            ) : (
                                <video 
                                    src={video.videoUrl} 
                                    className="w-full h-full rounded-[1.8rem]" 
                                    controls 
                                    autoPlay
                                    poster={video.thumbnailUrl}
                                />
                            )}
                        </div>

                        {/* Video Meta */}
                        <div className={`p-6 md:p-8 rounded-[2.5rem] ${cardBg} text-start space-y-6`}>
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="space-y-4 flex-1">
                                    <h2 className={`text-xl md:text-3xl font-black ${textClass} leading-tight`}>
                                        {video.title[language]}
                                    </h2>
                                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-400">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-white/5 rounded-full">
                                            <Eye className="w-4 h-4 text-primary" />
                                            <span>{video.views || 0} {language === 'ar' ? 'مشاهدة' : 'views'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-white/5 rounded-full">
                                            <Clock className="w-4 h-4 text-primary" />
                                            <span>{video.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-white/5 rounded-full">
                                            <Info className="w-4 h-4 text-primary" />
                                            <span>{getCategoryTitle(video.category)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-primary/30 active:scale-95 transition-all">
                                        <Share2 className="w-4 h-4" />
                                        {language === 'ar' ? 'مشاركة' : 'Share'}
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 dark:border-white/5 pt-6">
                                <h4 className={`text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4`}>{language === 'ar' ? 'عن هذا الفيديو' : 'About this video'}</h4>
                                <p className={`text-sm md:text-base font-medium leading-relaxed ${textMuted}`}>
                                    {video.description[language]}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Related Videos & Recommendations */}
                    <div className="space-y-6">
                        <div className={`p-6 rounded-[2.5rem] ${cardBg} text-start`}>
                            <h3 className={`text-lg font-black ${textClass} mb-6 flex items-center gap-3 uppercase tracking-tighter`}>
                                <PlaySquare className="w-5 h-5 text-primary" />
                                {language === 'ar' ? 'فيديوهات مشابهة' : 'Suggested for you'}
                            </h3>
                            
                            <div className="space-y-4">
                                {relatedVideos.map((vid) => (
                                    <button 
                                        key={vid.id}
                                        onClick={() => router.push(`/library/${vid.category}/${vid.id}`)}
                                        className="w-full group flex items-start gap-4 p-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-start"
                                    >
                                        <div className="relative w-24 h-16 md:w-32 md:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-black">
                                            <img src={vid.thumbnailUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=300'} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform" alt="" />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                                                <Play className="w-4 h-4 text-white fill-white" />
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h4 className={`text-xs font-black ${textClass} line-clamp-2 leading-tight group-hover:text-primary transition-colors`}>{vid.title[language]}</h4>
                                            <div className="flex items-center gap-2 text-[8px] font-bold text-gray-400 uppercase">
                                                <span>{vid.duration}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                                <span>{vid.views || 0} {language === 'ar' ? 'مشاهدة' : 'views'}</span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                                
                                {relatedVideos.length === 0 && (
                                    <div className="py-10 text-center opacity-20">
                                        <PlaySquare className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                        <p className="text-[10px] font-black uppercase">{language === 'ar' ? 'لا توجد توصيات' : 'No suggestions'}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Featured CTA */}
                        <div className="relative p-8 rounded-[2.5rem] bg-gradient-to-tr from-slate-900 via-slate-800 to-primary/80 overflow-hidden text-start">
                            <div className="relative z-10 space-y-4">
                                <h3 className="text-xl font-black text-white leading-tight">
                                    {language === 'ar' ? 'انضم إلى كابتينا برو' : 'Level Up with Captina Pro'}
                                </h3>
                                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                                    {language === 'ar' ? 'فيديوهات حصرية وخطط تدريب مخصصة' : 'Exclusive content & custom training plans'}
                                </p>
                                <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                                    {language === 'ar' ? 'اشترك الآن' : 'Get Started'}
                                </button>
                            </div>
                            <Dumbbell className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 -rotate-12" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
