"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation';
import { useApp } from "@/context/AppContext";
import { ChevronRight, ChevronLeft, ArrowRight, Sparkles, Target, Users, ShieldCheck } from 'lucide-react';
import Splash from "@/components/Splash";

export default function IntroPage() {
    const { language, darkMode } = useApp();
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showSplash, setShowSplash] = useState(true);

    const slides = [
        {
            title: language === 'ar' ? 'رحلتك الرياضية تبدأ هنا' : 'Your Fitness Journey Starts Here',
            desc: language === 'ar' ? 'استكشف عالم الرياضة مع مدربين معتمدين وتدريبات مخصصة تناسب أهدافك.' : 'Explore the world of sports with certified trainers and customized workouts that fit your goals.',
            image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000',
            icon: <Sparkles className="w-6 h-6" />,
            accent: '#E51B24'
        },
        {
            title: language === 'ar' ? 'مدربون محترفون ونخبة' : 'Elite Professional Trainers',
            desc: language === 'ar' ? 'تدرب مع الأفضل في مجالات الملاكمة، فنون القتال، واللياقة البدنية أينما كنت.' : 'Train with the best in boxing, martial arts, and fitness wherever you are.',
            image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1000',
            icon: <Target className="w-6 h-6" />,
            accent: '#E51B24'
        },
        {
            title: language === 'ar' ? 'مجتمع متكامل وآمن' : 'Integrated & Safe Community',
            desc: language === 'ar' ? 'انضم إلى مجتمع كابتينا، تابع تقدمك، واحجز حصصك بسهولة تامة.' : 'Join the Captina community, track your progress, and book your classes with total ease.',
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000',
            icon: <ShieldCheck className="w-6 h-6" />,
            accent: '#E51B24'
        }
    ];

    const nextSlide = () => {
        if (currentSlide >= slides.length - 1) {
            finishIntro();
        } else {
            setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
        }
    };

    const finishIntro = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('hasSeenIntro', 'true');
        }
        router.push('/login');
    };

    const activeSlide = slides[currentSlide] || slides[0] || {};

    if (showSplash) {
        return <Splash onComplete={() => setShowSplash(false)} />;
    }

    return (
        <div className={`min-h-[100dvh] flex flex-col font-sans relative overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-[#0A0E17] text-white' : 'bg-slate-50 text-gray-900'} ${language === 'ar' ? 'font-arabic' : ''}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Image with Ken Burns Effect */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`bg-${currentSlide}`}
                    initial={{ opacity: 0, scale: 1.15 }}
                    animate={{ opacity: 1, scale: 1.05 }}
                    exit={{ opacity: 0, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute inset-0 z-0"
                >
                    <img 
                        src={activeSlide.image || ''} 
                        alt="" 
                        className={`w-full h-full object-cover transition-all duration-500 ${darkMode ? 'opacity-60 grayscale-[10%]' : 'opacity-100 brightness-[0.85] contrast-[1.1]'}`}
                    />
                    <div className={`absolute inset-0 transition-colors duration-500 bg-gradient-to-b ${darkMode ? 'from-[#0A0E17]/90 via-transparent to-[#0A0E17]' : 'from-black/20 via-transparent to-slate-50/90'}`}></div>
                </motion.div>
            </AnimatePresence>

            {/* Header Overlay */}
            <div className="relative z-30 px-5 pt-8 flex justify-between items-center">
                <motion.div 
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`flex items-center gap-2.5 backdrop-blur-lg p-1 rounded-xl border border-white/10 transition-colors ${darkMode ? 'bg-black/30' : 'bg-white/40'}`}
                >
                    <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/10">
                        <img src="/logo_captina.jpg" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-black text-xs tracking-wider uppercase text-[#E51B24] pr-2">Captina</span>
                </motion.div>
                
                <motion.button 
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    onClick={finishIntro}
                    className={`transition-all font-bold text-[10px] px-2.5 py-1.5 rounded-lg border border-white/10 ${darkMode ? 'text-white/60 bg-white/5 hover:text-white' : 'text-gray-500 bg-black/5 hover:text-gray-900'}`}
                >
                    {language === 'ar' ? 'تخطي' : 'Skip'}
                </motion.button>
            </div>

            {/* Main Content Card (Wide and Short) */}
            <div className="flex-1 flex flex-col justify-end items-center px-4 pb-8 relative z-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className={`w-full backdrop-blur-[25px] border rounded-[1.5rem] py-3.5 px-5 shadow-2xl relative overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-black/5'}`}
                    >
                        <div className="flex flex-col gap-2 relative z-10">
                            <div className="flex items-center gap-3">
                                <motion.div 
                                    className="w-9 h-9 bg-[#E51B24] rounded-lg flex items-center justify-center shadow-lg"
                                >
                                    {activeSlide && activeSlide.icon && React.isValidElement(activeSlide.icon) ? 
                                        React.cloneElement(activeSlide.icon, { className: "w-5 h-5 text-white" }) 
                                        : null
                                    }
                                </motion.div>
                                <h1 className={`text-lg md:text-xl font-black leading-tight mb-0 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {activeSlide?.title || ''}
                                </h1>
                            </div>

                            <p className={`text-xs md:text-sm font-medium leading-relaxed transition-colors ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                                {activeSlide.desc}
                            </p>

                            <div className="pt-2 flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-1">
                                        {slides.map((_, i) => (
                                            <motion.div 
                                                key={i} 
                                                animate={{ 
                                                    width: currentSlide === i ? 20 : 6,
                                                    backgroundColor: currentSlide === i ? '#E51B24' : (darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)')
                                                }}
                                                className="h-1 rounded-full"
                                            />
                                        ))}
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        {currentSlide > 0 && (
                                            <button 
                                                onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                                                className={`w-10 h-10 border rounded-lg flex items-center justify-center transition-colors ${darkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'}`}
                                            >
                                                <ChevronLeft className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''} ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                                            </button>
                                        )}
                                        <button 
                                            onClick={nextSlide}
                                            className="h-10 px-6 bg-[#E51B24] text-white rounded-lg font-bold text-xs flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-[#E51B24]/20"
                                        >
                                            {currentSlide === slides.length - 1 ? (language === 'ar' ? 'ابدأ' : 'Start') : (language === 'ar' ? 'التالي' : 'Next')}
                                            <ArrowRight className={`w-3 h-3 ${language === 'ar' ? 'rotate-180' : ''}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Global Dynamic Lights */}
            <div className={`absolute top-0 right-0 w-[300px] h-[300px] blur-[100px] -z-10 rounded-full transition-opacity ${darkMode ? 'bg-[#E51B24]/5 opacity-100' : 'bg-[#E51B24]/10 opacity-50'}`}></div>
            <div className={`absolute bottom-0 left-0 w-[300px] h-[300px] blur-[100px] -z-10 rounded-full transition-opacity ${darkMode ? 'bg-blue-500/5 opacity-100' : 'bg-blue-500/10 opacity-50'}`}></div>
        </div>
    );
}

