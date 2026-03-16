"use client";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Star, ChevronLeft, ChevronRight, Navigation, Building2, Users2, Building, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";

export default function Gyms() {
    const { t, language, darkMode } = useApp();

    const gyms = (t('gymsData') || []).filter(g => g.type === 'Internal');

    return (
        <div className={`min-h-screen ${darkMode ? "bg-[#0a0f1a]" : "bg-slate-50"} relative overflow-hidden pb-32 transition-colors duration-500`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] -z-0 translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px] -z-0 -translate-x-1/2 translate-y-1/2"></div>
            
            {/* Header / Breadcrumbs - Mobile Premium Alignment */}
            <header className="relative z-20 pt-8 px-6">
                <div className="max-w-7xl mx-auto flex flex-col items-start">
                    {/* Breadcrumbs */}
                    <motion.div 
                        initial={{ opacity: 0, x: language === 'ar' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 mb-4 text-[11px] font-black uppercase tracking-[0.2em] opacity-60"
                    >
                        <Link href="/" className="hover:text-primary transition-colors text-slate-900 dark:text-white">
                            {language === 'ar' ? 'الرئيسية' : 'Home'}
                        </Link>
                        <span className="text-gray-400">
                            {language === 'ar' ? ' / ' : ' / '}
                        </span>
                        <span className="text-primary font-black">
                            {language === 'ar' ? 'صالاتنا' : 'Our Gyms'}
                        </span>
                    </motion.div>

                    {/* Titling Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-1"
                    >
                        <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                            {t('gymsPageTitle')}
                        </h1>
                        <div className="flex items-center gap-2">
                            <div className="h-1 w-12 bg-primary rounded-full"></div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest opacity-80">
                                {language === 'ar' ? 'تغطية واسعة في كافة أنحاء الرياض' : 'Wide coverage across Riyadh'}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </header>

            <div className="container mx-auto px-6 mt-12 relative z-10 max-w-7xl">
                {/* Gyms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gyms.map((gym, idx) => (
                        <motion.div 
                            key={gym.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group"
                        >
                            <div className="relative bg-white/80 dark:bg-[#1a2235]/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-premium transition-all duration-500 hover:shadow-active hover:-translate-y-2 flex flex-col h-full active:scale-[0.98]">
                                {/* Card Image Section */}
                                <div className="relative w-full h-48 overflow-hidden shrink-0">
                                    <img 
                                        src={gym.image} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                                        alt={gym.name} 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    
                                    {/* Rating Badge */}
                                    <div className="absolute top-4 end-4">
                                        <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-black flex items-center gap-1.5 border border-white/30 shadow-lg">
                                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                            <span>{gym.rating}</span>
                                        </div>
                                    </div>

                                    {/* Branch Title over Image */}
                                    <div className="absolute bottom-4 start-6">
                                        <h3 className="text-xl font-black text-white tracking-tight leading-none mb-1">
                                            {gym.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-white/70 text-[10px] font-bold">
                                            <MapPin className="w-3 h-3 text-primary" />
                                            <span className="truncate max-w-[200px]">{gym.location}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6 flex flex-col justify-between flex-1">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                                <Users2 className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                                                    {language === 'ar' ? 'المدربين' : 'Trainers'}
                                                </span>
                                                <span className="text-sm font-black text-slate-900 dark:text-white">
                                                    {gym.trainers} {language === 'ar' ? 'أبطال' : 'Pros'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-400">
                                            <Building2 className="w-5 h-5" />
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black py-4 rounded-2xl shadow-xl hover:bg-primary hover:text-white dark:hover:bg-primary transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2rem] group/btn">
                                        {language === 'ar' ? 'استكشاف الموقع ' : 'Explore Location'}
                                        <Navigation className={`w-4 h-4 transition-transform group-hover/btn:rotate-12`} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Facilities section - Large & Modern */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 p-12 rounded-[3rem] bg-white/80 dark:bg-[#1a2235]/40 border border-gray-100 dark:border-white/10 relative overflow-hidden backdrop-blur-3xl shadow-premium"
                >
                    <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { label: language === 'ar' ? 'أحدث الأجهزة' : 'Elite Gear', icon: Building, color: 'text-blue-500' },
                            { label: language === 'ar' ? 'مساحات واسعة' : 'Wide Areas', icon: Star, color: 'text-amber-500' },
                            { label: language === 'ar' ? 'أبطال معتمدون' : 'Certified Team', icon: Users2, color: 'text-emerald-500' },
                            { label: language === 'ar' ? 'عروض حصرية' : 'Exclusive Deals', icon: Sparkles, color: 'text-rose-500' },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center gap-4 group">
                                <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-[1.5rem] flex items-center justify-center border border-gray-100 dark:border-white/10 group-hover:scale-110 group-hover:border-primary/20 transition-all duration-500">
                                    <item.icon className={`w-7 h-7 ${item.color}`} />
                                </div>
                                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">{item.label}</h4>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
