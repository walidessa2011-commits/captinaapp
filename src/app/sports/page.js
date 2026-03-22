"use client";
import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
    ChevronLeft, ChevronRight, Dumbbell, Award, 
    Target, Users, Star, Trophy, ArrowLeft,
    Flame, Zap, Timer, Activity, Sparkles, ArrowRight, Heart
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";
import { useRouter } from 'next/navigation';

export default function Sports() {
    const { t, language, darkMode, favoriteSports, toggleFavoriteSport } = useApp();
    const router = useRouter();

    const getText = (field) => {
        if (!field) return '';
        if (typeof field === 'object') {
            return field[language] || field['ar'] || field['en'] || '';
        }
        return field;
    };

    const sportsList = t('pageSportsData') || [];

    return (
        <div className={`min-h-screen ${darkMode ? "bg-[#0a0f1a]" : "bg-slate-50"} relative overflow-hidden pb-20 md:pb-40 transition-colors duration-500`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px] -z-0 -translate-x-1/2 translate-y-1/2"></div>
            
            {/* Minimal Spacer */}
            <div className="h-2 md:h-4"></div>

            <main className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Top Action Bar - Title & Back */}
                <div className="mb-3 p-1 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-between shadow-premium transition-all">
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={() => router.back()}
                            className="w-10 h-10 flex items-center justify-center text-slate-900 dark:text-white hover:text-primary transition-colors active:scale-95"
                        >
                            {language === 'ar' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                        </button>
                        
                        <div className="flex items-center gap-3 px-2 py-2 text-slate-900 dark:text-white">
                            <Dumbbell className="w-4 h-4 text-primary" />
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap">
                                {language === 'ar' ? 'عالم كابتينا' : 'Captina World'}
                            </span>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 px-6 opacity-30">
                        <p className="text-[8px] font-black uppercase tracking-[0.3em]">
                            {language === 'ar' ? 'الرئيسية / الرياضات' : 'Home / Sports'}
                        </p>
                    </div>
                </div>

                {/* Subtitle Line */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-1 mb-3 px-2"
                >
                    <div className="flex items-center gap-2">
                        <div className="h-1 w-12 bg-primary rounded-full"></div>
                        <p className="text-[10px] sm:text-xs font-black text-gray-500 uppercase tracking-widest opacity-80">
                            {language === 'ar' ? 'اختر رياضتك المفضلة وابدأ التحدي' : 'Choose your favorite sport & start the challenge'}
                        </p>
                    </div>
                </motion.div>
            </main>

            {/* Sports Grid */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 mt-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sportsList.map((sport, idx) => {
                        // Assigning unique gradients based on index for variety
                        const gradients = [
                            "from-blue-500 to-indigo-600",
                            "from-emerald-500 to-teal-600",
                            "from-orange-500 to-rose-600",
                            "from-purple-500 to-pink-600",
                            "from-blue-600 to-cyan-500",
                            "from-amber-500 to-orange-600"
                        ];
                        const gradient = gradients[idx % gradients.length];

                        return (
                            <Link href={`/sports/${sport.id}`} key={sport.id}>
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`group relative h-40 md:h-56 rounded-[2rem] overflow-hidden shadow-xl border ${darkMode ? 'border-white/10' : 'border-gray-200'} bg-black`}
                                >
                                    <img 
                                        src={sport.image || "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=800"} 
                                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500 group-hover:scale-110"
                                        alt={getText(sport.name)}
                                    />
                                    <div className={`absolute inset-0 bg-gradient-to-tr ${gradient} mix-blend-multiply opacity-60 group-hover:opacity-80 transition-opacity duration-500`}></div>
                                    
                                    <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                                        <div className="flex justify-between items-start">
                                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 shadow-lg group-hover:scale-110 transition-transform">
                                                <Dumbbell className="w-7 h-7" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        toggleFavoriteSport(sport.id);
                                                    }}
                                                    className={`w-10 h-10 rounded-2xl backdrop-blur-md flex items-center justify-center border transition-all active:scale-90 ${favoriteSports.includes(sport.id) ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-white/20 border-white/30 text-white hover:bg-white/40'}`}
                                                >
                                                    <Heart className={`w-5 h-5 ${favoriteSports.includes(sport.id) ? 'fill-current' : ''}`} />
                                                </button>
                                                
                                                <div className="w-8 h-8 bg-white text-black rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all shadow-lg">
                                                    <ChevronLeft className={`w-4 h-4 ${language === 'en' ? 'rotate-180' : ''}`} />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="text-start">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[8px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10">
                                                    {sport.stats?.intensity || 'High Intensity'}
                                                </span>
                                                <div className="flex items-center gap-1 text-white/70 text-[8px] font-bold uppercase">
                                                    <Timer className="w-2.5 h-2.5" />
                                                    {sport.stats?.duration || '60 Min'}
                                                </div>
                                            </div>
                                            <h3 className="text-lg md:text-2xl font-black text-white mb-1 drop-shadow-md uppercase tracking-tight tracking-tighter">{getText(sport.name)}</h3>
                                            <p className="text-white/80 text-[10px] md:text-xs font-bold drop-shadow-md line-clamp-1 max-w-[80%] uppercase tracking-wide opacity-70">
                                                {getText(sport.description)}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* CTA Section - More Premium */}
            <section className="mt-8 md:mt-16 px-4 md:px-6 max-w-7xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative rounded-[2rem] md:rounded-[4rem] p-8 md:p-20 overflow-hidden bg-slate-900 dark:bg-[#161b22] text-white shadow-3xl text-start"
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-primary/20 rounded-full blur-[100px] -z-0 translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-primary/10 rounded-full blur-[80px] -z-0 -translate-x-1/2 translate-y-1/2"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                        <div className="max-w-xl">
                            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                                <Trophy className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                                <span className="text-[10px] md:text-xs font-black text-primary uppercase tracking-[0.2rem] md:tracking-[0.4rem]">Winner Mindset</span>
                            </div>
                            <h2 className="text-2xl md:text-5xl font-black mb-4 md:mb-8 leading-none tracking-tighter uppercase italic">
                                {language === 'ar' ? 'بوابتك للاحتراف' : 'Your Pro Portal'}
                            </h2>
                            <p className="text-white/60 text-sm md:text-lg font-bold mb-6 md:mb-10 leading-relaxed uppercase tracking-wider opacity-80">
                                {language === 'ar' ? 'انضم الآن واحصل على تقييم بدني مجاني مع استشارة من خبرائنا في المجال الرياضي.' : 'Unleash your potential with dedicated pro-coaching and premium sports science assessment.'}
                            </p>
                            <Link href="/packages" className="inline-flex items-center justify-center w-full md:w-auto gap-4 bg-primary text-white px-8 md:px-12 py-4 md:py-5 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2rem] hover:shadow-xl hover:shadow-primary/30 active:scale-95 transition-all">
                                {language === 'ar' ? 'ابدأ الآن' : 'Join Elite'}
                                <ChevronRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
                            </Link>
                        </div>
                        <div className="hidden md:block relative animate-float">
                            <div className="w-72 h-72 border-2 border-primary/20 rounded-full flex items-center justify-center p-8">
                                <div className="w-full h-full border-2 border-primary/40 rounded-full flex items-center justify-center p-8">
                                    <Dumbbell className="w-full h-full text-primary opacity-40" />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
