"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from "@/context/AppContext";

const Splash = ({ onComplete }) => {
    const { darkMode, language } = useApp();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // We match the 3.5s + 0.8s transition time for a consistent premium feel
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onComplete) {
                // Wait for the exit animation to finish before calling onComplete
                setTimeout(onComplete, 800);
            }
        }, 3500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div 
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-colors duration-700 ${darkMode ? 'bg-[#050811]' : 'bg-slate-50'}`}
                >
                    {/* Background Mesh Grid */}
                    <div className={`absolute inset-0 opacity-[0.15] ${darkMode ? 'invert-0' : 'invert'}`} 
                         style={{ 
                             backgroundImage: `radial-gradient(circle at 2px 2px, ${darkMode ? '#ffffff' : '#000000'} 1px, transparent 0)`,
                             backgroundSize: '32px 32px' 
                         }} 
                    />

                    {/* Background Ambient Glows */}
                    <div className="absolute inset-0 pointer-events-none">
                        <motion.div 
                            animate={{ 
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.5, 0.3],
                                rotate: [0, 45, 0]
                            }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] mix-blend-screen"
                        />
                        <motion.div 
                            animate={{ 
                                scale: [1, 1.3, 1],
                                opacity: [0.2, 0.4, 0.2],
                                rotate: [0, -45, 0]
                            }}
                            transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 1 }}
                            className="absolute -bottom-1/4 -left-1/4 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen"
                        />
                    </div>

                    <div className="relative scale-90 md:scale-75">
                        {/* 1. Hyper-Outer Rotating Ring */}
                        <motion.div
                            animate={{ rotate: 360, scale: [0.95, 1.05, 0.95] }}
                            transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
                            className="absolute -inset-20 rounded-full border border-primary/5 blur-sm will-change-transform"
                        />

                        {/* 2. Middle Ring with Sliding Light */}
                        <div className="absolute -inset-14 rounded-full border border-white/5 dark:border-white/5">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full border-t border-primary/40 blur-[1px]"
                            />
                        </div>

                        {/* 3. Concentric Rotating Arcs */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-8 rounded-full border-x border-primary/30"
                        />

                        {/* 4. Glowing Particles (Orbitals) */}
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ rotate: 360 }}
                                transition={{ 
                                    duration: 3 + i * 0.5, 
                                    repeat: Infinity, 
                                    ease: "linear",
                                    delay: i * 0.4
                                }}
                                className="absolute -inset-8 md:-inset-11 rounded-full will-change-transform"
                            >
                                <motion.div 
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                    className="absolute top-0 left-1/2 -translate-x-1/2 w-1.2 h-1.2 rounded-full bg-primary shadow-[0_0_12px_#e51b24] shadow-primary"
                                />
                            </motion.div>
                        ))}

                        {/* 5. Main Logo Platform */}
                        <motion.div
                            initial={{ scale: 0.5, rotateY: 90, opacity: 0 }}
                            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                            transition={{ type: "spring", damping: 12, stiffness: 100 }}
                            className="z-50"
                        >
                            <motion.div
                                animate={{ 
                                    y: [0, -6, 0],
                                    boxShadow: [
                                        "0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(229, 27, 36, 0.2)",
                                        "0 25px 50px rgba(0,0,0,0.6), 0 0 40px rgba(229, 27, 36, 0.4)",
                                        "0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(229, 27, 36, 0.2)"
                                    ]
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="relative w-24 h-24 md:w-28 md:h-28 rounded-[2rem] p-1 bg-gradient-to-br from-primary/40 via-white/10 to-transparent border border-white/20 backdrop-blur-md"
                            >
                                <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-black relative">
                                    <img 
                                        src="/logo_captina.jpg" 
                                        alt="Logo" 
                                        className="w-full h-full object-cover"
                                    />
                                    <motion.div 
                                        animate={{ top: ['-10%', '110%'] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute left-0 right-0 h-[2px] bg-primary/40 blur-sm z-10"
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    <div className="mt-14 text-center relative z-50">
                        <motion.div initial="hidden" animate="visible" className="flex flex-col items-center">
                            <h1 
                                className={`text-3xl md:text-4xl font-extrabold mb-1 tracking-tight flex items-center justify-center ${darkMode ? 'text-white' : 'text-slate-900'}`}
                                style={{ fontFamily: language === 'ar' ? "'Tajawal', sans-serif" : "'Outfit', sans-serif" }}
                            >
                                {language === 'ar' ? (
                                    <div className="relative">
                                        <span className="opacity-0">كابتنا</span>
                                        <motion.span
                                            initial={{ clipPath: 'inset(0 0 0 100%)', filter: 'blur(0px)', opacity: 0 }}
                                            animate={{ clipPath: 'inset(0 0 0 0%)', filter: 'blur(0px)', opacity: 1 }}
                                            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                                            className="absolute inset-0 whitespace-nowrap"
                                        >
                                            <span className="text-primary">كابتـ</span>نا
                                        </motion.span>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <span className="opacity-0">CAPTINA</span>
                                        <motion.span
                                            initial={{ clipPath: 'inset(0 100% 0 0)', filter: 'blur(0px)', opacity: 0 }}
                                            animate={{ clipPath: 'inset(0 0% 0 0)', filter: 'blur(0px)', opacity: 1 }}
                                            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                                            className="absolute inset-0 whitespace-nowrap"
                                        >
                                            CAPT<span className="text-primary">INA</span>
                                        </motion.span>
                                    </div>
                                )}
                            </h1>
                            <motion.div 
                                initial={{ scaleX: 0, opacity: 0 }}
                                animate={{ scaleX: 1, opacity: 1 }}
                                transition={{ duration: 1.5, delay: 1.5, ease: "circOut" }}
                                className="h-[2px] w-24 bg-gradient-to-r from-transparent via-primary to-transparent blur-[1px] mb-4 origin-center"
                            />
                        </motion.div>
                        
                        <div className="flex flex-col items-center gap-3">
                            <div className="h-[2px] w-20 bg-gray-800/40 rounded-full overflow-hidden relative">
                                <motion.div 
                                    animate={{ left: ['-100%', '100%'] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                    className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent"
                                />
                            </div>
                            <motion.div 
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={`text-[9px] font-black uppercase tracking-[0.5em] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
                            >
                                {language === 'ar' ? 'جاري تجهيز الساحة' : 'PREPARING THE ARENA'}
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            transition={{ delay: 2.2, duration: 1 }}
                            className={`mt-4 text-[10px] font-medium tracking-[0.2em] uppercase ${darkMode ? 'text-white/60' : 'text-gray-500'}`}
                            style={{ fontFamily: language === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif" }}
                        >
                            {language === 'ar' ? 'مدربك المحترف والذكي' : 'Your Professional AI Coach'}
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Splash;
