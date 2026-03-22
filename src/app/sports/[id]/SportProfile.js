"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
    ChevronLeft, ChevronRight, Star, Target, Zap, 
    Clock, Shield, Award, Play, Image as ImageIcon, 
    Users, Info, Activity, Dumbbell, Heart, ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useApp } from "@/context/AppContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import SportTrainers from "@/components/SportTrainers";
import Link from 'next/link';

export default function SportProfile({ params }) {
    const id = params.id;
    const { t, language, darkMode, favoriteSports, toggleFavoriteSport } = useApp();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('about');
    const [sport, setSport] = useState(null);
    const [loading, setLoading] = useState(true);

    const getText = (field) => {
        if (!field) return '';
        if (typeof field === 'object') {
            return field[language] || field['ar'] || field['en'] || '';
        }
        return field;
    };

    useEffect(() => {
        const fetchSport = async () => {
            try {
                const docRef = doc(db, "sports", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setSport({ id: docSnap.id, ...docSnap.data() });
                } else {
                    const staticSports = t('pageSportsData') || [];
                    const staticSport = staticSports.find(s => s.id === id);
                    if (staticSport) {
                        const content = t(id + 'Content') || {};
                        setSport({
                            ...staticSport,
                            ...content,
                            fallback: true
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching sport:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchSport();
    }, [id, t]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0f1a]">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!sport) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0a0f1a] p-6 text-center">
                <Dumbbell className="w-16 h-16 text-gray-300 mb-4" />
                <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Sport Not Found</h1>
                <button onClick={() => router.back()} className="text-primary font-bold">Go Back</button>
            </div>
        );
    }

    const tabs = [
        { id: 'about', label: language === 'ar' ? 'نبذة' : 'About', icon: Info },
        { id: 'gallery', label: language === 'ar' ? 'الصور' : 'Gallery', icon: ImageIcon },
        { id: 'trainers', label: language === 'ar' ? 'المدربين' : 'Trainers', icon: Users },
        { id: 'videos', label: language === 'ar' ? 'فيديوهات' : 'Videos', icon: Play },
    ];

    const stats = [
        { label: language === 'ar' ? 'الشدة' : 'Intensity', value: getText(sport.intensity) || sport.stats?.intensity || 'High', icon: Zap },
        { label: language === 'ar' ? 'المدة' : 'Duration', value: getText(sport.duration) || sport.stats?.duration || '60 Min', icon: Clock },
        { label: language === 'ar' ? 'المعدات' : 'Equipment', value: getText(sport.equipment) || 'Standard', icon: Shield },
        { label: language === 'ar' ? 'العمر' : 'Age', value: getText(sport.targetAge) || 'All Ages', icon: Award },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a] pb-20 transition-colors relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            
            <div className="relative h-[35vh] md:h-[50vh] w-full overflow-hidden shadow-2xl">
                {(sport.heroBanner || sport.image || sport.heroImg) ? (
                    <img 
                        src={sport.heroBanner || sport.image || sport.heroImg}
                        className="w-full h-full object-cover"
                        alt={getText(sport.name)}
                    />
                ) : (
                    <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#0a0f1a] via-black/30 to-transparent"></div>
                
                <div className="absolute top-8 inset-x-0 px-6 flex justify-between items-center z-30">
                    <button 
                        onClick={() => router.back()}
                        className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all shadow-xl"
                    >
                        {language === 'ar' ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
                    </button>

                    <div className="flex gap-3">
                        <button 
                            onClick={() => toggleFavoriteSport(sport.id)}
                            className={`w-12 h-12 rounded-2xl backdrop-blur-md flex items-center justify-center border transition-all shadow-xl ${favoriteSports.includes(sport.id) ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
                        >
                            <Heart className={`w-5 h-5 ${favoriteSports.includes(sport.id) ? 'fill-current' : ''}`} />
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-12 inset-x-0 px-6 z-20">
                    <div className="max-w-7xl mx-auto text-start">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 mb-2"
                        >
                            <span className="w-8 h-[2px] bg-primary"></span>
                            <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-[0.3em] drop-shadow-lg">
                                {language === 'ar' ? 'عالم كابتينا الرياضي' : 'CAPTINA SPORTS WORLD'}
                            </span>
                        </motion.div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic drop-shadow-2xl">
                            {getText(sport.name)}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-10 max-w-6xl">
                <div className="flex overflow-x-auto no-scrollbar gap-3 mb-6 p-2 bg-white/60 dark:bg-[#1a2235]/60 backdrop-blur-xl rounded-[2rem] shadow-premium border border-white/10">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 rounded-2xl transition-all whitespace-nowrap font-black text-[10px] md:text-xs uppercase tracking-widest ${
                                activeTab === tab.id 
                                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white dark:bg-[#1a2235]/60 backdrop-blur-xl rounded-[3rem] p-6 md:p-12 shadow-premium border border-gray-100 dark:border-white/5"
                    >
                        {activeTab === 'about' && (
                            <div className="flex flex-col lg:flex-row gap-12">
                                <div className="lg:w-2/3 text-start">
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 tracking-tight flex items-center gap-3">
                                        <div className="w-2 h-8 bg-primary rounded-full"></div>
                                        {language === 'ar' ? 'عن الرياضة' : 'About This Sport'}
                                    </h2>
                                    <p className="text-[13px] md:text-[15px] text-gray-600 dark:text-gray-400 font-bold leading-relaxed mb-10">
                                        {getText(sport.description)}
                                    </p>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                                        {stats.map((stat, i) => (
                                            <div key={i} className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 text-center">
                                                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2 opacity-50" />
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                                <p className="text-[11px] font-black text-slate-900 dark:text-white truncate">{stat.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {(sport.benefits || []).length > 0 && (
                                        <div className="space-y-4 mb-10">
                                            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                                                <Target className="w-5 h-5 text-primary" />
                                                {language === 'ar' ? 'الفوائد والنتائج' : 'Benefits & Results'}
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-3">
                                                {sport.benefits.map((benefit, i) => (
                                                    <div key={i} className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                                                        <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                                                            <Shield className="w-3 h-3" />
                                                        </div>
                                                        <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400">{getText(benefit)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <Link href={`/booking?sport=${id}`} className="inline-flex items-center gap-3 bg-primary text-white font-black px-12 py-5 rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all text-center text-[10px] uppercase tracking-[0.2em]">
                                        {language === 'ar' ? 'أحجز حصتك الآن' : 'Book Your Session Now'}
                                        <ArrowRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
                                    </Link>
                                </div>

                                <div className="lg:w-1/3">
                                    <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 sticky top-32">
                                        <div className="text-center mb-8">
                                            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] mx-auto flex items-center justify-center mb-6 text-primary border border-primary/20">
                                                <Activity className="w-10 h-10" />
                                            </div>
                                            <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase">
                                                {language === 'ar' ? 'المتطلبات الأساسية' : 'Key Requirements'}
                                            </h4>
                                        </div>

                                        <div className="space-y-4 font-black">
                                            <div className="bg-white dark:bg-white/5 p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-premium">
                                                <p className="text-gray-400 text-[8px] mb-2 uppercase tracking-widest">{language === 'ar' ? 'المعدات المطلوبة' : 'EQUIPMENT NEEDED'}</p>
                                                <p className="text-xs text-slate-900 dark:text-white truncate">{getText(sport.equipment) || 'None'}</p>
                                            </div>
                                            <div className="bg-white dark:bg-white/5 p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-premium">
                                                <p className="text-gray-400 text-[8px] mb-2 uppercase tracking-widest">{language === 'ar' ? 'تقييم الشدة' : 'INTENSITY EVAL'}</p>
                                                <p className="text-xs text-slate-900 dark:text-white">{getText(sport.intensity) || 'General'}</p>
                                            </div>
                                            <div className="bg-white dark:bg-white/5 p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-premium">
                                                <p className="text-gray-400 text-[8px] mb-2 uppercase tracking-widest">{language === 'ar' ? 'مدة التدريب' : 'SESSION DURATION'}</p>
                                                <p className="text-xs text-slate-900 dark:text-white">{getText(sport.duration) || '60m'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'gallery' && (
                            <div className="text-start">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 tracking-tight flex items-center gap-3">
                                    <div className="w-2 h-8 bg-primary rounded-full"></div>
                                    {language === 'ar' ? 'معرض الصور' : 'Visual Gallery'}
                                </h2>
                                {(sport.gallery || []).length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        {sport.gallery.map((img, i) => (
                                            <motion.div 
                                                key={i}
                                                whileHover={{ y: -5 }}
                                                className="group relative aspect-square rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-premium bg-gray-100 dark:bg-white/5"
                                            >
                                                {img ? (
                                                    <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={`Gallery ${i}`} />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-white/5">
                                                        <ImageIcon className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <ImageIcon className="text-white w-8 h-8" />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-20 text-center bg-gray-50 dark:bg-white/5 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-white/10">
                                        <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 font-bold">{language === 'ar' ? 'لا توجد صور متوفرة حالياً' : 'No gallery images available yet'}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'trainers' && (
                            <div className="text-start">
                                <SportTrainers sportId={id} sportName={getText(sport.name)} />
                            </div>
                        )}

                        {activeTab === 'videos' && (
                            <div className="text-start">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 tracking-tight flex items-center gap-3">
                                    <div className="w-2 h-8 bg-primary rounded-full"></div>
                                    {language === 'ar' ? 'فيديوهات تدريبية' : 'Training Videos'}
                                </h2>
                                {(sport.videos || []).length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {sport.videos.map((vid, i) => (
                                            <div key={i} className="group flex flex-col gap-4">
                                                <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-black shadow-premium border border-white/5">
                                                    {vid.thumbnail && (
                                                        <img src={vid.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt={vid.title} />
                                                    )}
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <Link href={vid.url} target="_blank" className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 hover:scale-110 transition-transform">
                                                            <Play className="w-6 h-6 fill-current ml-1" />
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1 uppercase tracking-tight">{getText(vid.title)}</h3>
                                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Certified Training Material</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-20 text-center bg-gray-50 dark:bg-white/5 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-white/10">
                                        <Play className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 font-bold">{language === 'ar' ? 'لا توجد فيديوهات متوفرة' : 'No training videos available yet'}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed bottom-0 left-0 w-full h-1 bg-primary/20 pointer-events-none z-50"
            >
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                />
            </motion.div>
        </div>
    );
}
