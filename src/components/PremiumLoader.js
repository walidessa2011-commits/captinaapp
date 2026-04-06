"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const PremiumLoader = ({ darkMode, language, minimal = false }) => {
    const [mounted, setMounted] = useState(false);
    const isAr = language === 'ar';

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-colors duration-700 ${darkMode ? 'bg-[#050811]' : 'bg-slate-50'}`}
        >
            {/* ═══════ Subtle Radial Glow ═══════ */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: darkMode
                        ? 'radial-gradient(circle at 50% 45%, rgba(229,27,36,0.08) 0%, transparent 65%)'
                        : 'radial-gradient(circle at 50% 45%, rgba(229,27,36,0.04) 0%, transparent 65%)'
                }}
            />

            <div className="relative flex flex-col items-center gap-8 z-10">
                
                {/* ═══════ Logo Container ═══════ */}
                <div className="relative w-28 h-28 flex items-center justify-center">
                    
                    {/* Rotating ring */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full"
                        style={{
                            border: '1.5px solid transparent',
                            borderTopColor: '#E51B24',
                            borderRightColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                        }}
                    />

                    {/* Second ring - counter rotate */}
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-2 rounded-full"
                        style={{
                            border: '1px solid transparent',
                            borderTopColor: darkMode ? 'rgba(229,27,36,0.25)' : 'rgba(229,27,36,0.15)',
                            borderLeftColor: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                        }}
                    />

                    {/* Logo */}
                    <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", damping: 15, stiffness: 120 }}
                    >
                        <motion.div
                            animate={{ 
                                y: [0, -3, 0],
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className={`w-16 h-16 rounded-2xl overflow-hidden ring-1 shadow-xl ${
                                darkMode 
                                    ? 'ring-white/10 shadow-[#E51B24]/10' 
                                    : 'ring-gray-200 shadow-gray-200/50'
                            }`}
                        >
                            <img 
                                src="/logo_captina.jpg" 
                                alt="Captina" 
                                className="w-full h-full object-cover" 
                            />
                        </motion.div>
                    </motion.div>
                </div>

                {/* ═══════ Brand Name ═══════ */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="flex flex-col items-center gap-2"
                >
                    <h1 
                        className={`text-[15px] font-black tracking-[0.35em] uppercase ${darkMode ? 'text-white' : 'text-gray-900'}`}
                        style={{ fontFamily: "'Outfit', 'Tajawal', sans-serif" }}
                    >
                        CAPT<span className="text-[#E51B24]">INA</span>
                    </h1>
                    <div className="w-8 h-[1.5px] bg-gradient-to-r from-transparent via-[#E51B24]/50 to-transparent rounded-full" />
                </motion.div>

                {/* ═══════ Loading Indicator ═══════ */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col items-center gap-4"
                >
                    {/* Progress bar */}
                    <div className={`w-32 h-[2px] rounded-full overflow-hidden ${darkMode ? 'bg-white/[0.06]' : 'bg-gray-200'}`}>
                        <motion.div 
                            animate={{ 
                                x: ['-100%', '100%'],
                            }}
                            transition={{ 
                                duration: 1.5, 
                                repeat: Infinity, 
                                ease: "easeInOut"
                            }}
                            className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#E51B24] to-transparent rounded-full"
                        />
                    </div>

                    {/* Loading text */}
                    <motion.p
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className={`text-[9px] font-bold uppercase tracking-[0.3em] ${darkMode ? 'text-white/30' : 'text-gray-400'}`}
                        style={{ fontFamily: isAr ? "'Tajawal', sans-serif" : "'Inter', sans-serif" }}
                    >
                        {isAr ? 'جارِ التحميل' : 'Loading'}
                    </motion.p>
                </motion.div>
            </div>
        </div>
    );
};

export default PremiumLoader;
