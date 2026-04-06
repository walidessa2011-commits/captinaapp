"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation';
import { useApp } from "@/context/AppContext";
import { ChevronLeft, ArrowRight, Sparkles, Target, ShieldCheck } from 'lucide-react';
import Splash from "@/components/Splash";

export default function IntroPage() {
    const { language, darkMode, appContent } = useApp();
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showSplash, setShowSplash] = useState(true);
    const [direction, setDirection] = useState(1);
    const [touchStart, setTouchStart] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const isAr = language === 'ar';

    const introData = appContent?.onboarding?.slides || [
        {
            title_ar: 'رحلتك الرياضية تبدأ هنا',
            title_en: 'Your Fitness Journey Starts Here',
            desc_ar: 'استكشف عالم الرياضة مع مدربين معتمدين وتدريبات مخصصة تناسب أهدافك وطموحاتك.',
            desc_en: 'Explore the world of sports with certified trainers and customized workouts tailored to your goals.',
            image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000',
            icon: 'Sparkles',
            accent: '#E51B24',
            tag_ar: 'ابدأ رحلتك',
            tag_en: 'START YOUR JOURNEY'
        },
        {
            title_ar: 'مدربون محترفون ونخبة',
            title_en: 'Elite Professional Trainers',
            desc_ar: 'تدرب مع الأفضل في مجالات الملاكمة، فنون القتال، واللياقة البدنية أينما كنت.',
            desc_en: 'Train with the best in boxing, martial arts, and fitness wherever you are.',
            image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1000',
            icon: 'Target',
            accent: '#E51B24',
            tag_ar: 'مدربون معتمدون',
            tag_en: 'CERTIFIED COACHES'
        },
        {
            title_ar: 'مجتمع متكامل وآمن',
            title_en: 'Integrated & Safe Community',
            desc_ar: 'انضم إلى مجتمع كابتنا، تابع تقدمك، واحجز حصصك بسهولة تامة.',
            desc_en: 'Join the Captina community, track your progress, and book sessions effortlessly.',
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000',
            icon: 'ShieldCheck',
            accent: '#E51B24',
            tag_ar: 'مجتمع كابتنا',
            tag_en: 'CAPTINA COMMUNITY'
        }
    ];

    const getIcon = (name, size = "w-5 h-5") => {
        const props = { className: size };
        switch(name) {
            case 'Sparkles': return <Sparkles {...props} />;
            case 'Target': return <Target {...props} />;
            case 'ShieldCheck': return <ShieldCheck {...props} />;
            default: return <Sparkles {...props} />;
        }
    };

    const slides = introData.map(s => ({
        title: isAr ? s.title_ar : s.title_en,
        desc: isAr ? s.desc_ar : s.desc_en,
        image: s.image,
        icon: s.icon,
        accent: s.accent,
        tag: isAr ? (s.tag_ar || '') : (s.tag_en || '')
    }));

    const goToSlide = useCallback((index) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setDirection(index > currentSlide ? 1 : -1);
        setCurrentSlide(index);
        setTimeout(() => setIsTransitioning(false), 600);
    }, [currentSlide, isTransitioning]);

    const nextSlide = useCallback(() => {
        if (isTransitioning) return;
        if (currentSlide >= slides.length - 1) {
            finishIntro();
        } else {
            goToSlide(currentSlide + 1);
        }
    }, [currentSlide, slides.length, isTransitioning, goToSlide]);

    const prevSlide = useCallback(() => {
        if (isTransitioning || currentSlide <= 0) return;
        goToSlide(currentSlide - 1);
    }, [currentSlide, isTransitioning, goToSlide]);

    const finishIntro = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('hasSeenIntro', 'true');
        }
        router.push('/login');
    };

    // Touch/Swipe handlers
    const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
    const handleTouchEnd = (e) => {
        if (!touchStart) return;
        const diff = touchStart - e.changedTouches[0].clientX;
        const threshold = 50;
        if (isAr) {
            if (diff < -threshold) nextSlide();
            else if (diff > threshold) prevSlide();
        } else {
            if (diff > threshold) nextSlide();
            else if (diff < -threshold) prevSlide();
        }
        setTouchStart(null);
    };

    // Auto-advance timer
    useEffect(() => {
        if (showSplash) return;
        const timer = setInterval(() => {
            if (currentSlide < slides.length - 1) {
                goToSlide(currentSlide + 1);
            }
        }, 6000);
        return () => clearInterval(timer);
    }, [currentSlide, showSplash, slides.length, goToSlide]);

    const activeSlide = slides[currentSlide] || slides[0] || {};

    if (showSplash) {
        return <Splash onComplete={() => setShowSplash(false)} />;
    }

    const slideVariants = {
        enter: (dir) => ({ opacity: 0, x: dir > 0 ? 80 : -80, scale: 0.95 }),
        center: { opacity: 1, x: 0, scale: 1 },
        exit: (dir) => ({ opacity: 0, x: dir > 0 ? -80 : 80, scale: 0.95 })
    };

    const imageVariants = {
        enter: { opacity: 0, scale: 1.2 },
        center: { opacity: 1, scale: 1.05, transition: { duration: 1.2, ease: "easeOut" } },
        exit: { opacity: 0, scale: 1, transition: { duration: 0.5 } }
    };

    const progress = ((currentSlide + 1) / slides.length) * 100;

    return (
        <div 
            className={`min-h-[100dvh] flex flex-col font-sans relative overflow-hidden select-none ${darkMode ? 'bg-[#050811]' : 'bg-white'} ${isAr ? 'font-arabic' : ''}`} 
            dir={isAr ? 'rtl' : 'ltr'}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* ═══════════════ BACKGROUND IMAGE ═══════════════ */}
            <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                    key={`bg-${currentSlide}`}
                    variants={imageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 z-0"
                >
                    <img 
                        src={activeSlide.image || ''} 
                        alt="" 
                        className="w-full h-full object-cover"
                        style={{ 
                            filter: darkMode 
                                ? 'brightness(0.35) saturate(1.2) contrast(1.1)' 
                                : 'brightness(0.55) saturate(1.1) contrast(1.05)'
                        }}
                    />
                </motion.div>
            </AnimatePresence>

            {/* ═══════════════ GRADIENT OVERLAYS ═══════════════ */}
            <div className="absolute inset-0 z-[1]">
                <div className={`absolute top-0 inset-x-0 h-40 bg-gradient-to-b ${darkMode ? 'from-[#050811]/80' : 'from-black/30'} to-transparent`} />
                <div className={`absolute bottom-0 inset-x-0 h-[65%] bg-gradient-to-t ${darkMode ? 'from-[#050811] via-[#050811]/95' : 'from-black/90 via-black/70'} to-transparent`} />
            </div>

            {/* ═══════════════ AMBIENT EFFECTS ═══════════════ */}
            <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
                <motion.div 
                    animate={{ opacity: [0.15, 0.25, 0.15], scale: [1, 1.1, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-20 -right-20 w-[350px] h-[350px] rounded-full bg-[#E51B24]/20 blur-[120px]"
                />
                <motion.div 
                    animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.15, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-[100px]"
                />
            </div>

            {/* ═══════════════ TOP BAR ═══════════════ */}
            <div className="relative z-30 px-5 pt-6 pb-2">
                <div className="flex justify-between items-center">
                    <motion.div 
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="flex items-center gap-2"
                    >
                        <div className="w-8 h-8 rounded-xl overflow-hidden ring-1 ring-white/20 shadow-lg">
                            <img src={appContent?.branding?.logo || "/logo_captina.jpg"} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-[11px] tracking-widest uppercase text-white">
                                {appContent?.branding?.name || "Captina"}
                            </span>
                            <span className="text-[7px] font-medium tracking-[0.2em] uppercase text-white/40">
                                {isAr ? 'منصة التدريب الذكية' : 'SMART TRAINING PLATFORM'}
                            </span>
                        </div>
                    </motion.div>
                    
                    <motion.button 
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        onClick={finishIntro}
                        className="text-white/50 hover:text-white font-bold text-[10px] px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all active:scale-95"
                    >
                        {isAr ? 'تخطي' : 'Skip'}
                    </motion.button>
                </div>

                {/* Progress Bar */}
                <motion.div 
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mt-4 h-[2px] bg-white/10 rounded-full overflow-hidden"
                    style={{ direction: 'ltr' }}
                >
                    <motion.div 
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[#E51B24] to-[#ff4444] rounded-full"
                    />
                </motion.div>
            </div>

            {/* ═══════════════ STEP COUNTER ═══════════════ */}
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="relative z-30 px-5 mt-2"
            >
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-white/30 tracking-widest">
                        {String(currentSlide + 1).padStart(2, '0')}
                    </span>
                    <div className="w-4 h-[1px] bg-white/20" />
                    <span className="text-[10px] font-black text-white/15 tracking-widest">
                        {String(slides.length).padStart(2, '0')}
                    </span>
                </div>
            </motion.div>

            {/* ═══════════════ MAIN CONTENT ═══════════════ */}
            <div className="flex-1 flex flex-col justify-end relative z-20 px-5 pb-10">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentSlide}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="w-full"
                    >
                        {/* Tag Badge */}
                        {activeSlide.tag && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="mb-4 inline-flex items-center gap-2"
                            >
                                <div className="w-7 h-7 bg-[#E51B24] rounded-lg flex items-center justify-center shadow-lg shadow-[#E51B24]/30">
                                    {getIcon(activeSlide.icon, "w-3.5 h-3.5 text-white")}
                                </div>
                                <span className="text-[9px] font-black tracking-[0.25em] uppercase text-[#E51B24]">
                                    {activeSlide.tag}
                                </span>
                            </motion.div>
                        )}

                        {/* Title */}
                        <motion.h1 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="text-[28px] md:text-4xl font-black leading-[1.15] text-white mb-3 tracking-tight"
                        >
                            {activeSlide?.title || ''}
                        </motion.h1>

                        {/* Accent Line */}
                        <motion.div 
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className={`w-12 h-[3px] bg-[#E51B24] rounded-full mb-4 ${isAr ? 'origin-right' : 'origin-left'}`}
                        />

                        {/* Description */}
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="text-[14px] md:text-base font-medium leading-relaxed text-white/60 mb-8 max-w-[340px]"
                        >
                            {activeSlide.desc}
                        </motion.p>

                        {/* ═══════════════ NAVIGATION ═══════════════ */}
                        <motion.div 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className="flex items-center justify-between"
                        >
                            {/* Dots */}
                            <div className="flex items-center gap-2">
                                {slides.map((_, i) => (
                                    <button key={i} onClick={() => goToSlide(i)} className="relative py-2">
                                        <motion.div 
                                            animate={{ 
                                                width: currentSlide === i ? 28 : 8,
                                                backgroundColor: currentSlide === i ? '#E51B24' : 'rgba(255,255,255,0.2)',
                                            }}
                                            transition={{ duration: 0.4, ease: "easeOut" }}
                                            className="h-[3px] rounded-full"
                                        />
                                    </button>
                                ))}
                            </div>
                            
                            {/* Buttons */}
                            <div className="flex items-center gap-2.5">
                                {currentSlide > 0 && (
                                    <motion.button 
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        onClick={prevSlide}
                                        className="w-11 h-11 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center active:scale-90 transition-all"
                                    >
                                        <ChevronLeft className={`w-4 h-4 text-white/70 ${isAr ? 'rotate-180' : ''}`} />
                                    </motion.button>
                                )}
                                
                                <button 
                                    onClick={nextSlide}
                                    className="h-11 px-7 bg-[#E51B24] hover:bg-[#ff2233] text-white rounded-xl font-bold text-[12px] flex items-center gap-2 active:scale-[0.96] transition-all shadow-xl shadow-[#E51B24]/25 relative overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    <span className="relative z-10">
                                        {currentSlide === slides.length - 1 
                                            ? (isAr ? 'ابدأ الآن' : 'Get Started') 
                                            : (isAr ? 'التالي' : 'Next')
                                        }
                                    </span>
                                    <ArrowRight className={`w-3.5 h-3.5 relative z-10 ${isAr ? 'rotate-180' : ''}`} />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ═══════════════ BOTTOM SAFE AREA ═══════════════ */}
            <div className="h-[env(safe-area-inset-bottom)]" />
        </div>
    );
}
