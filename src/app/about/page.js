"use client";
import { motion } from "framer-motion";
import { 
    Info, Star, Award, Users, Rocket, 
    ChevronRight, ChevronLeft, Heart, 
    ShieldCheck, Zap, Target, Sparkles, Shield
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";

export default function AboutApp() {
    const { language, t } = useApp();

    const stats = [
        { label: t('aboutPage.stats.trainees'), value: "5000+", icon: Users },
        { label: t('aboutPage.stats.trainers'), value: "150+", icon: Award },
        { label: t('aboutPage.stats.years'), value: "5+", icon: Sparkles },
    ];

    const values = [
        {
            title: t('aboutPage.values.quality.title'),
            desc: t('aboutPage.values.quality.desc'),
            icon: Shield
        },
        {
            title: t('aboutPage.values.innovation.title'),
            desc: t('aboutPage.values.innovation.desc'),
            icon: Target
        },
        {
            title: t('aboutPage.values.commitment.title'),
            desc: t('aboutPage.values.commitment.desc'),
            icon: Heart
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a] transition-colors duration-300 pb-12">
            {/* Header / Breadcrumbs - Compact Version */}
            <header className="relative z-20 pt-6 px-4">
                <div className="max-w-2xl mx-auto flex flex-col items-center">
                    {/* Breadcrumbs */}
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest opacity-50"
                    >
                        <Link href="/" className="hover:text-primary transition-colors">{t('aboutPage.breadcrumbs.home')}</Link>
                        <span className="text-gray-500">
                            {language === 'ar' ? ' < ' : ' > '}
                        </span>
                        <Link href="/settings" className="hover:text-primary transition-colors">{t('aboutPage.breadcrumbs.settings')}</Link>
                        <span className="text-gray-500">
                            {language === 'ar' ? ' < ' : ' > '}
                        </span>
                        <span className="text-primary">{t('aboutPage.breadcrumbs.about')}</span>
                    </motion.div>

                    {/* Consolidated Title Line - Horizontal */}
                    <div className="flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-3 mb-4"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                            <h1 className="text-xl md:text-2xl font-black text-white tracking-tighter italic uppercase text-center">
                                {t('aboutPage.heroTitle')}
                            </h1>
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                        </motion.div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 max-w-2xl">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="w-24 h-24 bg-primary rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/30 rotate-3">
                        <img src="/logo.png" alt="Captina" className="w-16 h-16 object-contain brightness-0 invert" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Captina</h2>
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 leading-relaxed max-w-md mx-auto italic">
                        {t('aboutPage.heroTagline')}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-12">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm text-center">
                            <stat.icon className={`w-5 h-5 mx-auto mb-2 text-primary`} />
                            <h4 className="text-lg font-black text-gray-900 dark:text-white leading-none mb-1">{stat.value}</h4>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Content Section */}
                <div className="space-y-8 text-start">
                    <section>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Rocket className="w-4 h-4 text-primary" />
                            </span>
                            {t('aboutPage.storyTitle')}
                        </h3>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 leading-relaxed">
                            {t('aboutPage.storyContent')}
                        </p>
                    </section>


                    <section className="grid grid-cols-1 gap-4">
                        {values.map((v, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-white/5 flex gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                                    <v.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-gray-900 dark:text-white mb-1">{v.title}</h4>
                                    <p className="text-[11px] font-bold text-gray-400 leading-relaxed">{v.desc}</p>
                                </div>
                            </div>
                        ))}
                    </section>
                </div>

                {/* Footer Message */}
                <div className="mt-12 text-center">
                    <p className="text-[10px] font-bold text-gray-400 flex items-center justify-center gap-2">
                        {t('aboutPage.footer.madeWith')} <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> {t('aboutPage.footer.atCaptina')}
                    </p>
                    <p className="text-[9px] font-bold text-gray-500 mt-2 uppercase tracking-widest">{t('aboutPage.footer.copyright')}</p>
                </div>
            </main>
        </div>
    );
}
